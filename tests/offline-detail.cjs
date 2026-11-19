const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const library={},requests=[],files=new Map(),catalog=new Map(),turn=()=>new Promise(resolve=>setImmediate(resolve));
let connected=true;
const bridge={
  CachesDirectoryPath:'cache',mkdir:async()=>{},writeFile:async(p,v)=>files.set(p,v),unlink:async p=>files.delete(p),
  async readFile(uri){
    const [,op,value]=uri.split('/offline').pop().split('/');
    if(op==='album')return JSON.stringify({value:catalog.get(value)||{}});
    if(op==='connected')return JSON.stringify({value:connected});
    assert.equal(op,'remember');const data=JSON.parse(files.get('cache/jm-download-requests/'+value+'.json'));
    catalog.set(data.id,data);return '{"value":true}';
  }
};
const modules={2118:bridge,648:{default:{fetchGet(url,params,ok){const task={ok,abort(){this.aborted=true;}};requests.push(task);return task;}}},
  650:{API_COMBIC_DETAIL:'album'}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/offline-library.js'),'utf8'),{
  setInterval,clearInterval,__d(factory,id,deps){factory({},i=>modules[i],null,null,null,library,deps);}
});
(async()=>{
  const album={id:'42',name:'Book',author:['A'],description:'Saved text',tags:['T'],series:[{id:'55',sort:8,name:'Chapter'}],related_list:[{id:90}]};
  const record=library.metadata('55',album,{},null);
  assert.equal(record.book,'42');assert.equal(record.episode,8);assert.equal(record.album.description,'Saved text');assert(!('related_list' in record.album));
  const legacy={id:'55',book:'42',title:'Book',name:'Chapter',episode:8,author:'A',tags:'T'};
  assert.deepEqual(JSON.parse(JSON.stringify(library.metadata('55',null,{},legacy))),legacy);
  let value;
  connected=false;library.readDetails('42',v=>value=v);await turn();assert.equal(requests.length,0);
  connected=true;const stop=library.readDetails('42',v=>value=v);await turn();stop();
  requests[0].ok({code:200,data:album});assert(requests[0].aborted);assert.equal(value.id,'42');assert.equal(value.description,undefined);
  library.readDetails('42',v=>value=v);await turn();requests[1].ok({code:200,data:album});await turn();
  assert.equal(value.description,'Saved text');assert.equal(catalog.size,1);
  connected=false;value=null;library.readDetails('42',v=>value=v);await turn();
  assert.equal(value.description,'Saved text');assert.equal(requests.length,2);
  console.log('Local detail metadata, legacy offline access, online backfill and stale callbacks passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
