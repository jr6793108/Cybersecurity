'use strict';
// All processing is local. No fetch, XMLHttpRequest, storage, telemetry, or network calls.
const $ = id => document.getElementById(id);
const rules = [
 ['Urgency or pressure', /\b(urgent|immediately|act now|within (?:\d+|twenty[- ]four) hours|final warning|limited time|right away|today only)\b/i, 9, 'Pressure tactics try to rush you before you verify the message.'],
 ['Account suspension or closure threat', /\b(account|access|profile|service).{0,65}\b(suspend(?:ed|sion)?|clos(?:ed|ure)|terminat(?:ed|ion)|deactivat(?:ed|ion)|lock(?:ed|out)?)\b|\b(suspend(?:ed|sion)?|clos(?:ed|ure)|terminat(?:ed|ion)|deactivat(?:ed|ion)|lock(?:ed|out)?).{0,65}\b(account|access|profile|service)\b/i, 17, 'Threats of losing access are often used to pressure recipients.'],
 ['Password request', /\b(?:send|share|provide|enter|confirm|submit|reply with|verify|update)\b.{0,55}\b(?:password|passphrase|login credentials)\b/i, 24, 'Legitimate support teams should not ask you to disclose passwords by email.'],
 ['MFA or verification code request', /\b(?:send|share|provide|enter|confirm|submit|reply with|forward)\b.{0,55}\b(?:otp|one.time (?:passcode|password)|verification code|security code|mfa code|2fa code|authentication code)\b/i, 25, 'Verification codes should never be shared with someone contacting you unexpectedly.'],
 ['Payment or gift-card request', /\b(?:gift[ -]?cards?|itunes cards?|steam cards?|wire transfer|send (?:money|funds)|pay (?:now|immediately)|bitcoin payment|crypto payment)\b/i, 20, 'Unusual payment methods and urgent transfers are common fraud patterns.'],
 ['Bank detail change request', /\b(?:change|update|replace|new|revised)\b.{0,55}\b(?:bank details|bank account|routing number|payment instructions|account number|iban)\b/i, 24, 'Verify payment-detail changes through an independently known contact channel.'],
 ['Impersonation or authority claim', /\b(?:i am (?:the )?(?:ceo|cfo|it administrator|helpdesk)|from (?:microsoft|google|paypal|your bank|it support)|security department|compliance team|executive office)\b/i, 10, 'Claims of authority are easy to write and do not establish the sender’s identity.'],
 ['Unexpected invoice or overdue charge', /\b(?:unexpected invoice|invoice attached|overdue invoice|past due|unpaid invoice|outstanding balance|payment overdue)\b/i, 12, 'Unexpected billing messages may be used to provoke clicks or payments.'],
 ['Credential-harvesting language', /\b(?:verify your (?:account|identity|login)|sign in to (?:avoid|restore|confirm|verify)|validate your account|re.?authenticate|confirm your credentials|login to unlock)\b/i, 19, 'Requests to verify identity through a link may lead to credential-harvesting pages.'],
 ['Macro enablement request', /\b(?:enable (?:content|editing|macros?)|turn on macros?|allow macros?)\b/i, 25, 'Office macros can execute code and should not be enabled on untrusted documents.'],
 ['Executable or script attachment', /\b[\w.-]+\.(?:exe|scr|bat|cmd|ps1|vbs|js|jse|wsf|hta|msi|jar|pif|lnk)(?=\b|[\s"'<>])/i, 28, 'Executable or script files can run harmful commands when opened.'],
 ['Unusual attachment filename', /\b[\w.-]+\.(?:zip|rar|7z|iso|img|docm|xlsm|pptm|html|htm)(?=\b|[\s"'<>])/i, 12, 'Archives, macro-enabled documents and HTML attachments deserve additional scrutiny.'],
];
const shorteners = new Set(['bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','is.gd','buff.ly','cutt.ly','rebrand.ly','tiny.cc','rb.gy']);
function hostname(url){try{return new URL(url).hostname.toLowerCase().replace(/\.$/,'')}catch{return ''}}
function domainFromAddress(value){const m=value.match(/[\w.+-]+@([a-z\d.-]+\.[a-z]{2,})/i);return m?m[1].toLowerCase():''}
function analyse(raw){
 const findings=[];const add=(title,points,detail)=>{if(!findings.some(f=>f.title===title))findings.push({title,points,detail})};
 for(const [title,re,points,detail] of rules)if(re.test(raw))add(title,points,detail);
 // Treat pasted HTML as text; never render it as HTML or execute it.
 const urls=[...raw.matchAll(/https?:\/\/[^\s<>"']+/gi)].map(m=>m[0].replace(/[),.;!?]+$/,''));
 for(const url of urls){const host=hostname(url);if(!host)continue;
  if(shorteners.has(host))add('Shortened URL',16,'Short links hide their final destination; do not follow them to investigate.');
  if(/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)||host.startsWith('['))add('URL uses an IP address',19,'A numeric destination instead of a recognizable domain can be suspicious.');
  if(url.includes('@')||host.includes('xn--')||host.split('.').length>=5||/(?:login|verify|secure|account|update)[-.]/i.test(host))add('Suspicious URL structure',13,'The link contains URL tricks, punycode, many subdomains or security-themed naming.');
 }
 // HTML anchor text can be inspected only if the visitor pastes literal HTML markup.
 for(const match of raw.matchAll(/<a\b[^>]*href\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
  const target=hostname(match[1]);const visible=(match[2].replace(/<[^>]*>/g,'').trim().match(/https?:\/\/[^\s]+/i)||[])[0];
  if(visible&&target&&hostname(visible)&&hostname(visible)!==target)add('Misleading link text',24,'The visible URL points to a different hostname than the actual HTML link target.');
 }
 const headerBlock=raw.split(/\r?\n\s*\r?\n/)[0];
 const headers={};let last='';
 for(const line of headerBlock.split(/\r?\n/)){
  const m=line.match(/^([\w-]+):\s*(.*)$/);
  if(m){last=m[1].toLowerCase();if(!headers[last])headers[last]=m[2]}
  else if(/^\s/.test(line)&&last)headers[last]+=' '+line.trim();
 }
 const from=domainFromAddress(headers.from||'');const reply=domainFromAddress(headers['reply-to']||'');
 if(from&&reply&&from!==reply)add('From / Reply-To domain mismatch',18,`The From domain (${from}) differs from the Reply-To domain (${reply}). This can be legitimate, but warrants verification.`);
 const auth=Object.entries(headers).filter(([key])=>key==='authentication-results'||key==='received-spf').map(([,value])=>value).join(' ');
 for(const [method,points] of [['spf',13],['dkim',13],['dmarc',17]]){
  if(new RegExp('\\b'+method+'\\s*=\\s*(?:fail|softfail|permerror)\\b','i').test(auth))add(`${method.toUpperCase()} authentication failure`,points,`Pasted authentication headers report a ${method.toUpperCase()} failure. Header text can be forged; trusted mail-system results matter most.`);
 }
 const score=Math.min(100,findings.reduce((sum,f)=>sum+f.points,0));
 return {score,classification:score>=60?'High Risk':score>=25?'Suspicious':'Low Risk',findings};
}
function render(result){$('results').hidden=false;$('score').textContent=`${result.score}/100`;$('classification').textContent=result.classification;
 const high=result.score>=60;const medium=result.score>=25;
 $('classification').style.color=high?'#ff8585':medium?'#ffca76':'#7ce0b0';$('meterFill').style.background=high?'#f47171':medium?'#f0b45d':'#45c78e';$('meterFill').style.width=`${result.score}%`;
 $('overview').textContent=high?'Several strong phishing indicators were detected. Treat this message as potentially malicious.':medium?'Some warning signs were found. Verify the message before taking any action.':'Few or no known warning signs were detected. This does not prove the email is safe.';
 const root=$('findings');root.replaceChildren();
 if(!result.findings.length){const p=document.createElement('p');p.className='empty';p.textContent='No rules matched the pasted text. Sophisticated phishing can still evade these checks.';root.append(p)}
 for(const f of result.findings){const box=document.createElement('div');box.className='finding';const title=document.createElement('strong');title.textContent=f.title;const points=document.createElement('div');points.className='points';points.textContent=`+${f.points} risk points`;const description=document.createElement('p');description.textContent=f.detail;box.append(title,points,description);root.append(box)}
 const recommendations=['Do not click links, open attachments, reply with sensitive information, or share verification codes.','Verify the request using an official website or phone number you already trust—not contact details in the email.','Report suspicious messages through your organization’s security process or your email provider’s phishing-report feature.'];
 if(result.findings.some(f=>/authentication|mismatch/i.test(f.title)))recommendations.push('Ask your mail administrator to inspect the original message headers and authentication results.');
 if(result.findings.some(f=>/payment|bank|invoice/i.test(f.title)))recommendations.push('Confirm any financial request directly with the known person or organization before sending money.');
 if(result.findings.some(f=>/attachment|macro/i.test(f.title)))recommendations.push('Do not open the attachment or enable macros; request verification from a trusted contact.');
 const list=$('recommendations');list.replaceChildren();for(const advice of recommendations){const li=document.createElement('li');li.textContent=advice;list.append(li)}
 $('results').scrollIntoView({behavior:'smooth',block:'start'});
}
$('analyse').addEventListener('click',()=>{const text=$('email').value.trim();if(!text){$('email').focus();return}render(analyse(text))});
$('clear').addEventListener('click',()=>{$('email').value='';$('results').hidden=true;$('email').focus()});
$('sample').addEventListener('click',()=>{$('email').value='From: IT Support <helpdesk@example.test>\nReply-To: support@different.example.test\nAuthentication-Results: mx.example.test; spf=fail; dkim=fail; dmarc=fail\nSubject: URGENT - Account suspension\n\nYour account will be suspended immediately. Verify your account and enter your password and MFA verification code at https://192.0.2.10/login. Please enable macros in the attached invoice.docm.';$('results').hidden=true});
