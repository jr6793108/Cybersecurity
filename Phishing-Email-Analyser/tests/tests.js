'use strict';
// Browser-only regression suite. All test strings are synthetic.
const cases = [
 {name:'Empty benign meeting',input:'From: training@example.com\nSubject: Weekly Team Meeting\n\nPlease join our team meeting Tuesday.',score:0,level:'Low Risk'},
 {name:'Invoice reminder',input:'From: billing@example.com\nSubject: Invoice Reminder\n\nThere is an outstanding balance.',score:12,level:'Low Risk'},
 {name:'Urgent invoice',input:'Subject: Final Invoice Reminder\n\nFinal warning: overdue invoice today.',score:21,level:'Low Risk'},
 {name:'Shortened URL with invoice',input:'Subject: Final Invoice Reminder\n\nFinal warning: overdue invoice today. https://bit.ly/example-invoice',score:37,level:'Suspicious'},
 {name:'Password request',input:'Please enter your password.',score:24,level:'Low Risk'},
 {name:'MFA code request',input:'Please share your verification code.',score:25,level:'Suspicious'},
 {name:'Executable attachment',input:'Attachment: invoice.exe',score:28,level:'Suspicious'},
 {name:'Ordinary dot-com address is not an executable',input:'From: training@example.com\nSubject: Hello',score:0,level:'Low Risk'},
 {name:'Raw IP URL',input:'Visit https://192.0.2.10/info',score:19,level:'Low Risk'},
 {name:'Reply-To domain mismatch',input:'From: A <a@example.test>\nReply-To: a@different.test\nSubject: Hello',score:18,level:'Low Risk'},
 {name:'SPF, DKIM and DMARC failure',input:'Authentication-Results: mx.example.test; spf=fail; dkim=fail; dmarc=fail\nSubject: Test',score:43,level:'Suspicious'},
 {name:'Macro request',input:'Please enable macros.',score:25,level:'Suspicious'},
 {name:'Script-looking text stays text',input:'<img src=x onerror=alert(1)>',score:0,level:'Low Risk'}
];
let passed=0;const list=document.getElementById('testResults');
for(const t of cases){const got=analyse(t.input);const ok=got.score===t.score&&got.classification===t.level;if(ok)passed++;const li=document.createElement('li');li.textContent=(ok?'PASS':'FAIL')+' — '+t.name+' (expected '+t.score+' '+t.level+'; actual '+got.score+' '+got.classification+')';li.style.color=ok?'#7ce0b0':'#ff8585';list.append(li)}
document.getElementById('status').textContent=passed+' / '+cases.length+' tests passed'+(passed===cases.length?' — all checks passed.':' — investigate failures before release.');
