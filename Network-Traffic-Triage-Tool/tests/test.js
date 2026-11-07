'use strict';
const c=window.TriageCore, tests=[];
function test(name,fn){try{if(!fn())throw Error('Assertion failed');tests.push([name,true])}catch(e){tests.push([name,false,e.message])}}
const csv='No.,Time,Source,Destination,Protocol,Length,Info\n1,0.01,192.168.1.2,192.168.1.1,TCP,64,"Hello, world"';
test('Standard Wireshark columns',()=>c.inspectCSV(csv).valid);
test('Quoted comma preserved',()=>c.inspectCSV(csv).packets[0].info==='Hello, world');
test('Alternative source and destination aliases',()=>c.inspectCSV('src,ip.dst,protocol\na,b,TCP').valid);
test('UTF-8 BOM',()=>c.inspectCSV('\ufeff'+csv).valid);
test('Quoted multiline fields',()=>c.inspectCSV('Source,Destination,Protocol,Info\na,b,TCP,"line1\nline2"').packets[0].info==='line1\nline2');
test('Escaped double quotes',()=>c.inspectCSV('Source,Destination,Protocol,Info\na,b,TCP,"say ""hi"""').packets[0].info==='say "hi"');
test('Missing required source reported',()=>c.inspectCSV('Destination,Protocol\na,TCP').missing.includes('source'));
test('Malformed quote fails safely',()=>{try{c.inspectCSV('Source,Destination,Protocol\n"a,b,TCP');return false}catch{return true}});
test('Uneven columns fail safely',()=>{try{c.inspectCSV('Source,Destination,Protocol\na,b');return false}catch{return true}});
test('Normal sample packet count',()=>c.inspectCSV(c.sampleText('normal')).packets.length===12);
test('High-volume sample packet count',()=>c.inspectCSV(c.sampleText('high')).packets.length===72);
test('Mixed sample packet count',()=>c.inspectCSV(c.sampleText('mixed')).packets.length===167);
test('HTML payload remains inert string',()=>c.inspectCSV('Source,Destination,Protocol,Info\na,b,TCP,"<img src=x onerror=alert(1)>"').packets[0].info.includes('<img'));
test('Statistics: normal sample total and sources',()=>{const s=c.trafficStats(c.inspectCSV(c.sampleText('normal')).packets);return s.totalPackets===12&&s.uniqueSources===3&&s.uniqueDestinations===1&&s.uniqueHosts===4});
test('Statistics: high-volume top source',()=>{const s=c.trafficStats(c.inspectCSV(c.sampleText('high')).packets);return s.totalPackets===72&&s.topSources[0].name==='192.168.10.25'&&s.topSources[0].count===60});
test('Statistics: mixed sample protocols',()=>{const s=c.trafficStats(c.inspectCSV(c.sampleText('mixed')).packets);return s.totalPackets===167&&s.protocols.find(x=>x.name==='DNS').count===49&&s.protocols.find(x=>x.name==='ICMP').count===35&&s.protocols.find(x=>x.name==='TCP').count===83});
test('Statistics: source and destination counted separately',()=>{const s=c.trafficStats([{source:'a',destination:'b',protocol:'tcp',length:'50'},{source:'b',destination:'a',protocol:'TCP',length:'60'}]);return s.uniqueSources===2&&s.uniqueDestinations===2&&s.uniqueHosts===2&&s.totalBytes===110&&s.protocols[0].count===2});
test('Statistics: empty and missing fields do not crash',()=>{const s=c.trafficStats([{source:'',destination:'',protocol:'',length:'bad'}]);return s.totalPackets===1&&s.uniqueHosts===0&&s.protocols[0].name==='UNKNOWN'&&s.validLengths===0});
test('Statistics: stable ranking for equal counts',()=>{const s=c.trafficStats([{source:'z',destination:'a',protocol:'TCP'},{source:'a',destination:'z',protocol:'TCP'}]);return s.topSources[0].name==='a'});

// Phase 3 detection regression tests
const detect=packets=>c.detectThreats(packets);
const packets=kind=>c.inspectCSV(c.sampleText(kind)).packets;
test('Detection: normal sample produces no alerts',()=>detect(packets('normal')).length===0);
test('Detection: high-volume sample identifies 60 source packets',()=>detect(packets('high')).some(a=>a.id==='highVolume'&&a.source==='192.168.10.25'&&a.observed===60));
test('Detection: mixed sample identifies ICMP pattern',()=>detect(packets('mixed')).some(a=>a.id==='icmpBurst'&&a.observed===35));
test('Detection: mixed sample identifies DNS pattern',()=>detect(packets('mixed')).some(a=>a.id==='dnsBurst'&&a.observed===45));
test('Detection: mixed sample identifies destination sweep',()=>detect(packets('mixed')).some(a=>a.id==='destinationSweep'&&a.observed===15));
test('Detection: normal sample has no port scan',()=>!detect(packets('normal')).some(a=>a.id==='portSweep'));
test('Detection: synthetic explicit ports trigger scan heuristic',()=>detect(Array.from({length:10},(_,i)=>({source:'a',destination:'b',protocol:'TCP',info:'Dst Port: '+(1000+i)}))).some(a=>a.id==='portSweep'&&a.observed===10));
test('Detection: bare numeric Info does not imply port scan',()=>!detect(Array.from({length:12},(_,i)=>({source:'a',destination:'b',protocol:'TCP',info:'Packet '+i}))).some(a=>a.id==='portSweep'));
test('Detection: missing source is ignored',()=>detect([{source:'',destination:'b',protocol:'ICMP'}]).length===0);
test('Detection: exact ICMP threshold triggers',()=>detect(Array.from({length:20},()=>({source:'a',destination:'b',protocol:'ICMP'}))).some(a=>a.id==='icmpBurst'&&a.observed===20));
test('Detection: below ICMP threshold does not trigger',()=>!detect(Array.from({length:19},()=>({source:'a',destination:'b',protocol:'ICMP'}))).some(a=>a.id==='icmpBurst'));
test('Detection: no input yields no alerts',()=>detect([]).length===0);
test('Detection: evidence contains no HTML markup generated by engine',()=>detect(Array.from({length:50},()=>({source:'<script>',destination:'b',protocol:'TCP'})))[0].source==='<script>');
const passed=tests.filter(t=>t[1]).length;document.getElementById('summary').textContent=`${passed} / ${tests.length} tests passed`;
for(const [name,ok,error] of tests){const li=document.createElement('li');li.textContent=(ok?'PASS — ':'FAIL — ')+name+(error?' ('+error+')':'');li.style.color=ok?'#8de8c5':'#ff9494';document.getElementById('testResults').append(li)}
