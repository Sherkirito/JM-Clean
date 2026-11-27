// 阅读页的进度与记录逻辑：缺失章节、存储读取失败、过期事件、首图显示后才记进度、从头开始、合页保存。
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const data=new Map(),requests=[],globalApp={api_host:'offline.invalid'};
const storage={getItem:async k=>data.get(k)??null,multiGet:async keys=>keys.map(k=>[k,data.get(k)??null]),
  multiSet:async entries=>entries.forEach(([k,v])=>data.set(k,v)),multiRemove:async keys=>keys.forEach(k=>data.delete(k)),
  setItem:async(k,v)=>{data.set(k,v);}};
class Component{
  constructor(props){this.props=props;}
  setState(value,cb){Object.assign(this.state,typeof value==='function'?value(this.state):value);if(cb)cb();}
}
const RN={AsyncStorage:storage,StyleSheet:{create:x=>x},ToastAndroid:{show(){},SHORT:0},
  Animated:{Value:class{constructor(v){this.value=v;}},timing:(value,config)=>({start(){value.value=config.toValue;}})},
  Easing:{out:x=>x,cubic:x=>x}};
const modules={2:RN,55:{Component},410:{connect:()=>x=>x},
  648:{default:{fetchGet(url,params,ok,fail){requests.push({ok,fail});return {abort(){}};},headers:()=>({})}},
  650:{},729:{colors:{}},2158:{record(){}},651:{lang:x=>x},647:{setting(){}},
  2183:{defaults:{keep:6,ahead:2},valid:n=>Number.isInteger(n)&&n>=2&&n<=30,validCache:c=>!!c}};
function load(name){
  let out={};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src',name+'.js'),'utf8'),{
    __d(factory,id,deps){factory(globalApp,k=>modules[k]||{},null,null,null,out,deps);modules[id]=out;},
    __READER_LAYOUT__:'function(){}',__READER_PROTECTION__:'',setTimeout,clearTimeout,requestAnimationFrame:f=>setTimeout(f,0),cancelAnimationFrame:clearTimeout
  });
  return out;
}
(async()=>{
  const history=load('history-store'),Reader=load('reader').default;
  for(const id of ['9','11'])await history.open({id,chapter:id,title:'本机书 '+id,total:8});
  history.save('9',5);await history.flush();
  const saved=[...data],tick=()=>new Promise(resolve=>setImmediate(resolve));
  let focused=true;
  const view=new Reader({route:{params:{id:'9',fromHistory:true}},navigation:{isFocused:()=>focused}});
  view.active=true;
  for(const status of [404,410,503]){
    view.fetchChapter();requests.at(-1).fail({status});
    assert.equal(view.state.error.includes('已下架'),status!==503);
    view.commitBook();await tick();assert.deepEqual([...data],saved);
  }
  for(const reply of [{code:410,data:null},{code:200,data:null},{code:200,data:{id:'9',images:[]}}]){
    view.fetchChapter();requests.at(-1).ok(reply);await tick();assert(view.state.error);
    assert.deepEqual([...data],saved);
  }
  // 旧版“从第 2 页起配对”的设置迁移为第 1 页单独显示。
  data.set('jm2clean.reader.pairOffset.9','1');
  view.fetchChapter();requests.at(-1).ok({code:200,data:{id:'9',images:Array(8).fill('a')}});
  await tick();
  const session=view.session;assert.equal(view.state.page,5);assert.equal(JSON.stringify(view.state.singles),'[0]');
  const received=(payload,s)=>view.onMessage({nativeEvent:{data:JSON.stringify(payload)}},s);
  view.failWeb(session,view.missingChapter(),true);
  received({session,type:'jm2Shown',page:0},session);
  view.commitBook();await tick();
  assert.equal((await history.list()).find(row=>row.id==='9').page,5);
  view.state.mode='spread-rtl';view.reload(5);
  const current=view.session,commands=[];
  view.web={injectJavaScript:code=>commands.push(code)};
  view.scrub(0,true);view.openPanel('chapters');
  assert.deepEqual(commands,[],'nothing is sent before the engine mounts');assert.equal(view.state.panel,null);
  received({session:current,type:'jm2Mounted',page:4},current);
  assert.equal(view.state.positioned,true);
  received({session:current,type:'jm2Page',page:4,end:5},current);
  assert.equal(view.state.end,5);
  assert.equal(await history.position('9'),5,'restoring the spread must retain the exact saved page until it is shown');
  received({session,type:'jm2Shown',page:0},session);
  received({session:session,type:'jm2Shown',page:0},current);
  assert.equal(await history.position('9'),5,'stale sessions are ignored');
  received({session:current,type:'jm2Shown',page:4,end:5},current);
  assert.equal(await history.position('9'),4);
  received({session:current,type:'jm2Page',page:6,end:7},current);
  assert.equal(await history.position('9'),6);assert.equal(view.state.page,6);
  view.scrub(2,true);assert(commands.some(c=>c.includes('jm2Pager.go(2)')));
  received({session:current,type:'jm2Menu'},current);assert.equal(view.state.chrome,true);
  assert(commands.some(c=>c.includes('setChrome(true)')));
  received({session:current,type:'jm2Menu'},current);assert.equal(view.state.chrome,false);
  received({session:current,type:'jm2Pairs',singles:[2]},current);await tick();
  assert.equal(data.get('jm2clean.reader.pairs.9'),'[2]');
  received({session:current,type:'jm2Pairs',singles:[]},current);await tick();
  assert(!data.has('jm2clean.reader.pairs.9') && !data.has('jm2clean.reader.pairOffset.9'),'default pairing removes the saved entry');
  const originalPosition=history.position;history.position=async()=>{throw Error('temporary read failure')};
  view.fetchChapter();requests.at(-1).ok({code:200,data:{id:'9',images:Array(8).fill('a')}});await tick();
  assert.match(view.state.error,/阅读进度/);assert.equal(view.state.source,null);
  history.position=originalPosition;assert.equal(await history.position('9'),6);
  view.props.route.params.restartChapter='9';
  view.props.navigation.setParams=patch=>Object.assign(view.props.route.params,patch);
  view.fetchChapter();requests.at(-1).ok({code:200,data:{id:'9',images:Array(8).fill('a')}});await tick();
  assert.equal(view.state.page,0);assert.equal(await history.position('9'),6);
  const abandoned=view.session;view.failWeb(abandoned,'slow image');
  received({session:abandoned,type:'jm2Shown',page:0},abandoned);assert.equal(await history.position('9'),6);
  view.reload(0);
  received({session:view.session,type:'jm2Mounted',page:0},view.session);
  received({session:view.session,type:'jm2Page',page:0,end:0},view.session);
  assert.equal(await history.position('9'),6,'restart keeps the old page until the first image shows');
  received({session:view.session,type:'jm2Shown',page:0,end:0},view.session);
  assert.equal(await history.position('9'),0);assert.equal(view.props.route.params.restartChapter,undefined);
  console.log('Unavailable chapters, failed storage read, stale events, shown-before-save, restart, pairing storage and menu passed.');
})().catch(err=>{console.error(err);process.exitCode=1;});
