'use strict';
// All data stays in memory. No fetch, XHR, storage, analytics or outbound connections.
(function(root){
  const MAX_BYTES=10*1024*1024, MAX_ROWS=100000;
  const ALIASES={time:['time','timestamp','frame.time_relative','frame.time_epoch'],source:['source','source ip','src','src ip','ip.src','ip.src_host','source address'],destination:['destination','destination ip','dst','dst ip','ip.dst','ip.dst_host','destination address'],protocol:['protocol','protocol name','_ws.col.protocol'],length:['length','packet length','frame.len','len','bytes'],info:['info','information','description','_ws.col.info']};
  const REQUIRED=['source','destination','protocol'];
  function normalise(s){return String(s).trim().toLowerCase().replace(/[_\s]+/g,' ')}
  function parseCSV(text){
    if(typeof text!=='string')throw Error('CSV content must be text.');
    if(text.charCodeAt(0)===0xfeff)text=text.slice(1);
    const rows=[];let row=[],field='',quoted=false,afterQuote=false,atStart=true;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++}else{quoted=false;afterQuote=true}}else{field+=c}continue}
      if(afterQuote){if(c===','){row.push(field);field='';afterQuote=false;atStart=true;continue}if(c==='\r'||c==='\n'){row.push(field);if(row.some(v=>v.trim()!==''))rows.push(row);if(rows.length>MAX_ROWS+1)throw Error('CSV exceeds the 100,000-row limit.');row=[];field='';afterQuote=false;atStart=true;if(c==='\r'&&text[i+1]==='\n')i++;continue}if(c===' '||c==='\t')continue;throw Error('Unexpected character after a closing quote near character '+(i+1)+'.')}
      if(c==='"'){if(!atStart)throw Error('Unexpected quote near character '+(i+1)+'.');quoted=true;atStart=false}
      else if(c===','){row.push(field);field='';atStart=true}
      else if(c==='\r'||c==='\n'){row.push(field);if(row.some(v=>v.trim()!==''))rows.push(row);if(rows.length>MAX_ROWS+1)throw Error('CSV exceeds the 100,000-row limit.');row=[];field='';atStart=true;if(c==='\r'&&text[i+1]==='\n')i++}
      else{field+=c;atStart=false}
    }
    if(quoted)throw Error('CSV contains an unclosed quoted field.');
    if(field!==''||row.length||afterQuote){row.push(field);if(row.some(v=>v.trim()!==''))rows.push(row)}
    if(rows.length<2)throw Error('CSV must contain a header row and at least one packet row.');
    const headers=rows.shift().map(v=>v.trim());
    if(headers.length>100)throw Error('CSV contains too many columns (maximum 100).');
    if(rows.length>MAX_ROWS)throw Error('CSV exceeds the 100,000-row limit.');
    for(let i=0;i<rows.length;i++)if(rows[i].length!==headers.length)throw Error('Row '+(i+2)+' has '+rows[i].length+' columns; expected '+headers.length+'.');
    return {headers,rows};
  }
  function inspectCSV(text){
    const parsed=parseCSV(text),columns={},notes=[];
    for(const [key,names] of Object.entries(ALIASES)){
      const index=parsed.headers.findIndex(h=>names.some(n=>normalise(n)===normalise(h)));
      if(index>=0)columns[key]=index;
      else notes.push((REQUIRED.includes(key)?'Required':'Optional')+' field missing: '+key+'.'+(key==='source'?' This CSV does not appear to contain a Source address column.':''));
    }
    const missing=REQUIRED.filter(key=>columns[key]===undefined);
    const packets=parsed.rows.map(r=>Object.fromEntries(Object.keys(ALIASES).map(key=>[key,columns[key]===undefined?'':r[columns[key]]])));
    return {headers:parsed.headers,packets,columns,notes,missing,valid:missing.length===0};
  }
  // Phase 2: descriptive statistics only. No security verdicts are made here.
  function trafficStats(packets){
    if(!Array.isArray(packets))throw Error('Packet data must be an array.');
    const sources=new Map(),destinations=new Map(),protocols=new Map(),sourceHosts=new Set(),destinationHosts=new Set();
    let totalBytes=0,validLengths=0;
    for(const packet of packets){
      const src=String(packet.source??'').trim(),dst=String(packet.destination??'').trim();
      const proto=String(packet.protocol??'').trim().toUpperCase()||'UNKNOWN';
      if(src){sourceHosts.add(src);sources.set(src,(sources.get(src)||0)+1)}
      if(dst){destinationHosts.add(dst);destinations.set(dst,(destinations.get(dst)||0)+1)}
      protocols.set(proto,(protocols.get(proto)||0)+1);
      const raw=String(packet.length??'').trim();
      if(/^\d+$/.test(raw)){const n=Number(raw);if(Number.isSafeInteger(n)){totalBytes+=n;validLengths++}}
    }
    const ranked=map=>[...map].map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
    return {totalPackets:packets.length,uniqueSources:sourceHosts.size,uniqueDestinations:destinationHosts.size,uniqueHosts:new Set([...sourceHosts,...destinationHosts]).size,protocols:ranked(protocols),topSources:ranked(sources),topDestinations:ranked(destinations),totalBytes,validLengths};
  }
  // Phase 3: heuristic evidence only. Counts are CSV rows, not validated connections.
  const DETECTION_RULES=Object.freeze({
    highVolume:{threshold:50,severity:'Medium'},
    icmpBurst:{threshold:20,severity:'Medium'},
    dnsBurst:{threshold:30,severity:'Low'},
    destinationSweep:{threshold:10,severity:'Medium'},
    portSweep:{threshold:10,severity:'Medium'}
  });
  function detectThreats(packets){
    if(!Array.isArray(packets))throw Error('Packet data must be an array.');
    const bySource=new Map();
    for(const packet of packets){
      const src=String(packet.source??'').trim(),dst=String(packet.destination??'').trim();
      if(!src)continue;
      if(!bySource.has(src))bySource.set(src,{count:0,icmp:0,dns:0,destinations:new Set(),ports:new Set()});
      const item=bySource.get(src),proto=String(packet.protocol??'').trim().toUpperCase(),info=String(packet.info??'');
      item.count++;if(dst)item.destinations.add(dst);
      if(proto==='ICMP'||proto==='ICMPV6')item.icmp++;
      if(proto==='DNS')item.dns++;
      // A destination port is only counted when explicitly marked as such in Info.
      // Wireshark's plain Info text is not a reliable substitute for a TCP/UDP port column.
      if(proto==='TCP'||proto==='UDP'){
        const m=info.match(/(?:destination\s*port|dst\s*port|dport)\s*[:=]\s*(\d{1,5})\b/i);
        if(m&&Number(m[1])<=65535&&Number(m[1])>0)item.ports.add(dst+'|'+m[1]);
      }
    }
    const alerts=[];
    const add=(id,source,observed,threshold,evidence,explanation,recommendation)=>alerts.push({id,source,severity:DETECTION_RULES[id].severity,observed,threshold,evidence,explanation,recommendation});
    for(const [src,v] of bySource){
      if(v.count>=DETECTION_RULES.highVolume.threshold)add('highVolume',src,v.count,50,`${v.count} packet rows from this source`,'Concentrated traffic from one source may be routine transfer activity or worth investigating.','Review capture duration, expected workload, and packet timing.');
      if(v.icmp>=DETECTION_RULES.icmpBurst.threshold)add('icmpBurst',src,v.icmp,20,`${v.icmp} ICMP packet rows`,'Repeated ICMP traffic may reflect diagnostics, monitoring, or probing.','Inspect ICMP types, targets, and whether testing was authorised.');
      if(v.dns>=DETECTION_RULES.dnsBurst.threshold)add('dnsBurst',src,v.dns,30,`${v.dns} DNS packet rows`,'Frequent DNS traffic may be normal resolution activity or require review.','Inspect DNS query names, response codes, and capture duration.');
      if(v.destinations.size>=DETECTION_RULES.destinationSweep.threshold)add('destinationSweep',src,v.destinations.size,10,`${v.destinations.size} distinct destination labels`,'Contact with many destinations can indicate discovery or legitimate service communication.','Review destination ownership, protocols, and authorised scanning activity.');
      if(v.ports.size>=DETECTION_RULES.portSweep.threshold)add('portSweep',src,v.ports.size,10,`${v.ports.size} distinct destination/port combinations explicitly identified in Info`,'Multiple explicitly identified destination ports may indicate scanning or legitimate diagnostics.','Verify destination ports in the original capture and check approved testing.');
    }
    const order={High:0,Medium:1,Low:2};
    alerts.sort((a,b)=>order[a.severity]-order[b.severity]||a.source.localeCompare(b.source)||a.id.localeCompare(b.id));
    return alerts;
  }
  const SAMPLES={
    normal:'samples/normal-traffic.csv',high:'samples/high-volume-traffic.csv',mixed:'samples/mixed-soc-lab.csv'
  };
  function sampleText(kind){
    const header='No.,Time,Source,Destination,Protocol,Length,Info';let lines=[header],n=0;
    function add(src,dst,proto,info){n++;lines.push([n,(n*.012).toFixed(3),src,dst,proto,proto==='DNS'?88:74,'"'+info.replace(/"/g,'""')+'"'].join(','))}
    for(let i=0;i<12;i++)add('192.168.10.'+(10+i%3),'192.168.10.1',i%3===0?'DNS':'TCP','Routine authorised lab traffic');
    if(kind==='high'||kind==='mixed')for(let i=0;i<60;i++)add('192.168.10.25','192.168.10.5','TCP','Synthetic file transfer packet');
    if(kind==='mixed'){
      for(let i=0;i<35;i++)add('192.168.10.40','192.168.10.1','ICMP','Echo request');
      for(let i=0;i<15;i++)add('192.168.10.50','192.168.10.'+(80+i),'TCP','Synthetic host discovery');
      for(let i=0;i<45;i++)add('192.168.10.60','192.168.10.70','DNS','Standard query');
    }
    return lines.join('\r\n')+'\r\n';
  }
  // Expose only pure functions for browser tests; no user content is persisted.
  root.TriageCore={parseCSV,inspectCSV,sampleText,trafficStats,detectThreats,DETECTION_RULES,MAX_BYTES};
  if(typeof document==='undefined')return;
  const el=id=>document.getElementById(id),fileInput=el('csvFile'),drop=el('dropzone');
  // Test pages import the pure analysis functions without the production UI.
  // Do not attach production event handlers when those controls are absent.
  if (!fileInput || !drop) return;
  function clearPreview(){el('results').hidden=true;el('dashboard').hidden=true;el('alertsPanel').hidden=true;el('alerts').replaceChildren();el('preview').replaceChildren();el('notes').replaceChildren();for(const id of ['protocolBars','topSources','topDestinations'])el(id).replaceChildren()}
  function renderRanking(target,items,total,maxRows=8){
    const host=el(target);
    if(!items.length){const p=document.createElement('p');p.className='hint';p.textContent='No records available.';host.append(p);return}
    for(const item of items.slice(0,maxRows)){
      const row=document.createElement('div');row.className='bar-row';
      const line=document.createElement('div');line.className='bar-label';
      const name=document.createElement('span');name.textContent=item.name;
      const value=document.createElement('strong');value.textContent=item.count.toLocaleString()+' packets ('+(total?Math.round(item.count/total*100):0)+'%)';
      line.append(name,value);
      const track=document.createElement('div');track.className='bar-track';
      const fill=document.createElement('div');fill.className='bar-fill';fill.style.width=(total?item.count/total*100:0)+'%';
      track.append(fill);row.append(line,track);host.append(row);
    }
  }
  function renderStats(data){
    if(!data.valid){el('dashboard').hidden=true;return}
    const stats=trafficStats(data.packets);el('dashboard').hidden=false;
    el('statPackets').textContent=stats.totalPackets.toLocaleString();
    el('statSources').textContent=stats.uniqueSources.toLocaleString();
    el('statDestinations').textContent=stats.uniqueDestinations.toLocaleString();
    el('statHosts').textContent=stats.uniqueHosts.toLocaleString();
    el('statBytes').textContent=stats.validLengths===stats.totalPackets?stats.totalBytes.toLocaleString()+' B':'Not available for all packets';
    renderRanking('protocolBars',stats.protocols,stats.totalPackets,12);
    renderRanking('topSources',stats.topSources,stats.totalPackets);
    renderRanking('topDestinations',stats.topDestinations,stats.totalPackets);
  }
  function renderAlerts(data){
    const panel=el('alertsPanel');panel.hidden=!data.valid;if(!data.valid)return;
    const alerts=detectThreats(data.packets);
    el('alertCount').textContent=alerts.length+' heuristic alert'+(alerts.length===1?'':'s');
    for(const severity of ['High','Medium','Low'])el('count'+severity).textContent=alerts.filter(a=>a.severity===severity).length;
    el('noAlerts').hidden=alerts.length!==0;
    for(const a of alerts){
      const article=document.createElement('article');article.className='alert-card';
      const heading=document.createElement('h3');heading.textContent=({highVolume:'High packet volume',icmpBurst:'Frequent ICMP traffic',dnsBurst:'Frequent DNS traffic',destinationSweep:'Multiple destinations',portSweep:'Multiple destination ports'})[a.id];
      const tag=document.createElement('span');tag.className='severity '+a.severity.toLowerCase();tag.textContent=a.severity+' · Investigate';
      const meta=document.createElement('p');meta.textContent='Source: '+a.source+' · Observed: '+a.observed+' · Threshold: '+a.threshold;
      const evidence=document.createElement('p');evidence.textContent='Evidence: '+a.evidence;
      const why=document.createElement('p');why.textContent='Interpretation: '+a.explanation;
      const next=document.createElement('p');next.textContent='Next step: '+a.recommendation;
      article.append(heading,tag,meta,evidence,why,next);el('alerts').append(article);
    }
  }
  function render(text,name,isDemo){
    clearPreview();
    try{
      const data=inspectCSV(text);el('results').hidden=false;el('filename').textContent=name;el('count').textContent=data.packets.length.toLocaleString();
      el('parseStatus').textContent=data.valid?'Parsed successfully':'Parsed with missing required fields';el('demoTag').hidden=!isDemo;
      el('columns').textContent=Object.keys(data.columns).map(k=>k+' → '+data.headers[data.columns[k]]).join(' · ')||'No recognised columns';
      const notes=data.notes.length?data.notes:['All main packet columns were recognised.'];
      for(const note of notes){const li=document.createElement('li');li.textContent=note;el('notes').append(li)}
      for(const packet of data.packets.slice(0,10)){const tr=document.createElement('tr');for(const key of ['time','source','destination','protocol','length','info']){const td=document.createElement('td');td.textContent=packet[key];tr.append(td)}el('preview').append(tr)}
      renderStats(data);renderAlerts(data);
      el('status').textContent=(data.valid?'Import complete. ':'Import needs attention. ')+data.packets.length+' packet rows read.';
    }catch(err){el('status').textContent='Unable to parse CSV: '+err.message}
  }
  async function loadFile(file){if(!file)return;clearPreview();if(!/\.csv$/i.test(file.name)){el('status').textContent='Please select a .csv file.';return}if(file.size>MAX_BYTES){el('status').textContent='File exceeds the 10 MB limit.';return}try{render(await file.text(),file.name,false)}catch{el('status').textContent='Could not read this file locally.'}}
  fileInput.addEventListener('change',()=>loadFile(fileInput.files[0]));
  for(const event of ['dragenter','dragover'])drop.addEventListener(event,e=>{e.preventDefault();drop.classList.add('dragover')});
  for(const event of ['dragleave','drop'])drop.addEventListener(event,e=>{e.preventDefault();drop.classList.remove('dragover')});
  drop.addEventListener('drop',e=>loadFile(e.dataTransfer.files[0]));
  document.querySelectorAll('[data-sample]').forEach(button=>button.addEventListener('click',()=>{const kind=button.dataset.sample;render(sampleText(kind),SAMPLES[kind],true)}));
})(typeof window!=='undefined'?window:globalThis);
