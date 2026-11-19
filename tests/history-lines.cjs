// Use an isolated AsyncStorage for restart and write-order regression tests.
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const db=new Map();
let fail=false;
const storage={
  async getItem(key){return db.get(key)||null;},
  async setItem(key,value){db.set(key,value);},
  async multiGet(keys){return keys.map(key=>[key,db.get(key)||null]);},
  async multiSet(items){await Promise.resolve();if(fail){fail=false;throw Error('write failed');}items.forEach(([k,v])=>db.set(k,v));}
};
function load(file,g={}){
  const out={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src',file+'.js'),'utf8'),{
    __d(factory){factory(g,()=>({AsyncStorage:storage}),null,null,null,out,[2]);}
  });return out;
}
(async()=>{
  const history=load('history-store');
  db.set('series_history_11',JSON.stringify({0:[8]}));
  const first=history.info({id:10,series_id:11,name:'Book',images:Array(7),series:[{id:10,sort:3}]},{});
  const second=Object.assign({},first,{chapter:'12',episode:4});
  const one=history.info({id:99,series_id:0,name:'Single',images:[1,2]},{});
  await Promise.all([history.open(first),history.open(second),history.open(one)]);
  history.save('10',2);history.save('10',4);history.save('10',6);history.save('12',1);await history.flush();
  const cold=load('history-store');assert.equal(await cold.position('10'),6);assert.equal(await cold.position('12'),1);
  const rows=await cold.list();assert.deepEqual(Array.from(rows,r=>r.chapter),['99','12']);assert.equal(rows[1].page,1);
  assert.equal(db.get('series_latest_view_11'),'12');assert.deepEqual(JSON.parse(db.get('series_history_11'))[0],[8,10,12]);
  assert.equal(db.get('last_viewed_chapter_11'),'4');
  fail=true;history.save('10',1);await history.flush();await history.flush();assert.equal(await cold.position('10'),1);
  const edition=history.info({id:10,series_id:11,name:'chapter',images:[1]},{},{id:11,name:'album',image:'/covers/11.png',update_at:70});
  assert.equal(edition.title,'album');assert.equal(edition.image,'/covers/11.png');
  const mismatched=history.info({id:12,series_id:11,name:'other',images:[1]},{},{id:10,image:'/wrong.png'});
  assert.equal(mismatched.image,undefined);
  await history.open(edition);await history.open(mismatched);
  assert.equal((await load('history-store').list())[0].image,'/covers/11.png');
  const covers=load('history-cover').candidates;
  assert.deepEqual(Array.from(covers({id:'71'},'https://host.test/')),['https://host.test/media/albums/71_3x4.jpg']);
  assert.deepEqual(Array.from(covers(edition,'https://host.test')),['https://host.test/covers/11.png','https://host.test/media/albums/11_3x4.jpg?v=70']);
  assert.equal(covers({id:11,image:'https://cdn.test/i.jpg'},'')[0],'https://cdn.test/i.jpg');
  assert.equal(covers({id:11,image:'//cdn.test/i.jpg'},'')[0],'https://cdn.test/i.jpg');
  assert.equal(covers({id:11},'').length,0);
  const g={};const health=load('line-health',g);
  await health.ready;const config={Server:['a.test','b.test'],Setting:['cfg.test']};health.configure(config);
  health.record('b.test','probe',true,100);health.record('a.test','home',true,200);health.record('a.test','chapter',true,500);
  assert.equal(health.order(config.Server)[0],'a.test');
  health.choose('a.test');health.record('a.test','home',false,1000);health.fallback('a.test','b.test');assert.equal(g.api_host,'a.test');
  health.record('a.test','chapter',false,1100);health.fallback('a.test','b.test');assert.equal(g.api_host,'b.test');
  await new Promise(resolve=>setImmediate(resolve));const next={};const again=load('line-health',next);await again.ready;again.configure(config);
  assert.equal(next.api_host,'b.test');
  const rowsLong=Array.from({length:1024},(_,i)=>({id:String(i+1),chapter:String(i+2001),title:'合成记录 '+i,total:15,episode:i+1}));
  const legacy=JSON.stringify(rowsLong),indexKey='jm2clean.history.books';
  db.set(indexKey,legacy);
  const large=load('history-store');
  assert.equal((await large.list()).length,1024);
  fail=true;await assert.rejects(large.open(rowsLong[800]));
  assert.equal(db.get(indexKey),legacy);
  await large.open(rowsLong[800]);
  const manifest=JSON.parse(db.get(indexKey));assert.equal(manifest.parts,8);
  const bytes=Buffer.byteLength(db.get(indexKey))+Array.from({length:8},(_,i)=>Buffer.byteLength(db.get(indexKey+'.'+i))).reduce((a,b)=>a+b);
  assert(bytes<Buffer.byteLength(legacy));
  const reload=load('history-store'),reopened=await reload.list();
  assert.equal(reopened.length,1024);assert.equal(reopened[0].id,rowsLong[800].id);assert.equal(reopened.at(-1).title,rowsLong.at(-1).title);
  db.set('jm2clean.lines.v1',JSON.stringify({hosts:{'a.test':{home:'broken',probe:[null,{}]}}}));
  const partial=load('line-health',{});await partial.ready;
  partial.configure({Server:'a.test',Setting:null});assert.equal(partial.hosts().length,0);assert.equal(partial.order({}).length,0);
  partial.configure(config);assert.equal(partial.summary('a.test').good,0);
  console.log('Passed history retry, migration, reload, malformed routes and line selection. Synthetic index bytes:',Buffer.byteLength(legacy),'->',bytes);
})().catch(e=>{console.error(e);process.exitCode=1;});
