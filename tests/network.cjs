// Exercise the shipped callback API using synthetic replies and a deterministic clock.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {createHash,createCipheriv,createDecipheriv}=require('node:crypto');
const md5=s=>createHash('md5').update(s).digest('hex');
const fakeCrypto={enc:{Utf8:{parse:v=>v}},mode:{ECB:1},AES:{decrypt(cipher,key){
  const c=createDecipheriv('aes-256-ecb',Buffer.from(key),null);
  return {toString:()=>Buffer.concat([c.update(cipher,'base64'),c.final()]).toString()};
}}};
const app={api_host:'one.test',api_data:{Server:['one.test','two.test'],Setting:['cfg.test']}};
const samples=[],health={order:v=>v,record:(...args)=>samples.push(args),fallback:()=>{}};
const api={API_COMBIC_PROMOTE:'https://upstream.test/promote',token:'fixture-key'},deps=[{version:'1.8.2'},api,md5,fakeCrypto,health],out={};
let now=1000000;const requests=[];
class Transport {
  constructor(){this.headers={};requests.push(this);}
  open(method,url){this.method=method;this.url=url;}
  setRequestHeader(key,value){this.headers[key]=value;}
  send(body){this.body=body;}
  abort(){this.cancelled=true;}
  reply(status,data){this.status=status;this.responseText=JSON.stringify(data);this.onload();}
}
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/network.js'),'utf8'),{Date:{now:()=>now},XMLHttpRequest:Transport,
  __d(factory){factory(app,n=>deps[n],null,null,null,out,[0,1,2,3,4]);}});
function cipher(data,stamp,key) {
  const c=createCipheriv('aes-256-ecb',Buffer.from(md5(stamp+key)),null);
  return Buffer.concat([c.update(JSON.stringify(data)),c.final()]).toString('base64');
}
const client=out.default, seen=[],bad=[];
const collect=x=>seen.push(x),failed=x=>bad.push(x),latest=()=>requests.at(-1);
const url='https://upstream.test/chapter', q={id:7,search_query:'A&B'};
client.fetchGet(url,q,collect,failed);const first=latest();
now+=64000;client.fetchGet(url,{id:8},collect,failed);const second=latest();
second.reply(200,{code:200,data:cipher({id:8,images:['p']},'1064',api.token)});
first.reply(200,{code:200,data:cipher({id:7,images:['p']},'1000','18comicAPPContent')});
assert.equal(seen[0].data.id,8);assert.equal(seen[1].data.id,7);assert.deepEqual(bad,[]);
client.fetchGet(url,q,collect,failed);latest().ontimeout();
assert.equal(latest().url,'https://two.test/chapter?id=7&search_query=A%26B');latest().onerror();
assert.equal(bad.length,1);
const total=requests.length;client.fetchPost('https://upstream.test/comment',{text:'A&B'},collect,failed);
assert.equal(latest().body,'text=A%26B&');latest().ontimeout();assert.equal(requests.length,total+1);
const pending=client.fetchGet(url,q,collect,failed);pending.abort();assert(latest().cancelled);latest().onerror();assert.equal(bad.length,2);
client.fetchSkipEc('https://upstream.test/plain',{a:1},collect,failed);assert.equal(latest().url,'https://one.test/plain?skipec=1&a=1');
latest().reply(200,{code:200,data:[1,2]});assert.equal(seen.at(-1).data.length,2);
client.fetchGet(url,{},collect,failed);latest().reply(200,{code:200,data:'invalid'});latest().reply(200,{code:200,data:'invalid'});
assert.equal(bad.length,3);const previousURL=app.current_url,baseline=requests.length;
client.probe('two.test');assert.equal(latest().url,'https://two.test/promote?page=0');assert.equal(latest().withCredentials,false);
latest().reply(200,{data:{unexpected:true}});assert.equal(requests.length,baseline+1);assert.equal(app.current_url,previousURL);
assert.deepEqual(samples.at(-1).slice(0,3),['two.test','probe',false]);
client.probe('one.test');latest().reply(200,{code:200,data:[{content:[]}]});assert.deepEqual(samples.at(-1).slice(0,3),['one.test','probe',true]);
const lines={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/line-health.js'),'utf8'),{Date:{now:()=>now},
  __d(fn){fn(app,()=>({AsyncStorage:{getItem:async()=>null,setItem:async()=>{}}}),null,null,null,lines,[0]);}});
Object.assign(health,lines);
lines.configure({Server:['one.test','two.test','three.test','four.test'],Setting:['cfg.test']});
for(const path of ['album','search']){
  client.fetchGet('https://one.test/'+path,{},collect,failed);
  for(const host of ['one.test','two.test']){
    assert(latest().url.startsWith('https://'+host+'/'));assert.equal(latest().timeout,6000);
    now+=latest().timeout;latest().ontimeout();
  }
  assert(latest().url.startsWith('https://three.test/'));assert.equal(latest().timeout,6000);
  latest().reply(200,{code:200,data:{content:[]}});
  assert.equal(app.api_host,path==='album'?'one.test':'three.test');
}
const count=requests.length;
client.fetchGet('https://three.test/forum',{},collect,failed);
now+=18000;latest().ontimeout();assert.equal(requests.length,count+1);
client.fetchGet('https://three.test/album',{},collect,failed);
latest().reply(404,{});assert.equal(requests.length,count+2);
console.log('Network contracts, three-line retry budget and automatic switching passed');
