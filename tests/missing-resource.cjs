const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const data=new Map(),requests=[],globalApp={api_host:'offline.invalid'};
const storage={getItem:async k=>data.get(k)??null,multiGet:async keys=>keys.map(k=>[k,data.get(k)??null]),
  multiSet:async entries=>entries.forEach(([k,v])=>data.set(k,v))};
class Component{
  constructor(props){this.props=props;}
  setState(value,cb){Object.assign(this.state,typeof value==='function'?value(this.state):value);if(cb)cb();}
}
const modules={2:{AsyncStorage:storage,StyleSheet:{create:x=>x}},55:{Component},410:{connect:()=>x=>x},
  648:{default:{fetchGet(url,params,ok,fail){requests.push({ok,fail});return {abort(){}};},headers:()=>({})}},
  650:{},729:{colors:{}},2158:{record(){}},2175:{script:()=>''}};
function load(name){
  let out={};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src',name+'.js'),'utf8'),{
    __d(factory,id,deps){factory(globalApp,k=>modules[k]||{},null,null,null,out,deps);modules[id]=out;},
    __READER_LAYOUT__:()=>{},__READER_PROTECTION__:'',setTimeout,clearTimeout
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
  view.fetchChapter();requests.at(-1).ok({code:200,data:{id:'9',images:Array(8).fill('a')}});
  await tick();
  const session=view.session;assert.equal(view.state.page,5);
  view.failWeb(session,view.missingChapter(),true);
  view.onMessage({nativeEvent:{data:JSON.stringify({session,type:'jm2Ready',page:0})}},session);
  view.commitBook();await tick();assert.deepEqual([...data],saved);
  assert.equal((await history.list()).find(row=>row.id==='9').page,5);
  view.state.mode='spread-rtl';view.reload(5);
  const current=view.session,received=(payload,s=current)=>view.onMessage({nativeEvent:{data:JSON.stringify(payload)}},s);
  const commands=[];view.web={injectJavaScript:code=>commands.push(code)};
  received({type:'imageClick'});view.go(0);view.openPanel('chapters');
  received({session:current,type:'jm2Page',page:0});
  received({session:current,type:'jm2Ready',page:0});
  received({session,type:'jm2Ready',page:4},session);
  assert.equal(view.state.positioned,false);assert.equal(view.state.bar,true);assert.equal(view.state.panel,null);
  assert.deepEqual(commands,[]);assert.equal(await history.position('9'),5);
  focused=false;received({session:current,type:'jm2Ready',page:4});
  assert(!view.state.positioned);assert.equal(await history.position('9'),5);
  focused=true;view.onFocus();assert(view.state.positioned);commands.length=0;
  received({session:current,type:'jm2Page',page:4});
  assert.equal(view.state.positioned,true);assert.equal(view.state.page,4);
  assert.equal(await history.position('9'),5,'restoring the spread must retain the exact saved page');
  view.go(6);assert.equal(commands.length,1);assert.equal(await history.position('9'),5);
  received({session:current,type:'jm2Page',page:6});
  received({session:current,type:'jm2Ready',page:4});
  assert.equal(await history.position('9'),6);assert.equal(view.state.page,6);
  const originalPosition=history.position;history.position=async()=>{throw Error('temporary read failure')};
  view.fetchChapter();requests.at(-1).ok({code:200,data:{id:'9',images:Array(8).fill('a')}});await tick();
  assert.match(view.state.error,/阅读进度/);assert.equal(view.state.source,null);
  history.position=originalPosition;assert.equal(await history.position('9'),6);
  view.props.route.params.restartChapter='9';
  view.props.navigation.setParams=patch=>Object.assign(view.props.route.params,patch);
  view.fetchChapter();requests.at(-1).ok({code:200,data:{id:'9',images:Array(8).fill('a')}});await tick();
  assert.equal(view.state.page,0);assert.equal(await history.position('9'),6);
  const abandoned=view.session;view.failWeb(abandoned,'slow image');
  received({session:abandoned,type:'jm2Ready',page:0},abandoned);assert.equal(await history.position('9'),6);
  focused=false;view.reload(0);received({session:view.session,type:'jm2Legacy',page:0},view.session);
  assert(view.pendingReady);view.reload(0);focused=true;view.onFocus();assert(!view.webReady);
  view.background=true;received({session:view.session,type:'jm2Legacy',page:0},view.session);
  assert(!view.webReady);view.background=false;view.onFocus();assert(view.legacy);
  assert.equal(await history.position('9'),0);assert.equal(view.props.route.params.restartChapter,undefined);
  console.log('Unavailable chapters, failed storage read, stale events, locked input, odd saved page and confirmed progress passed.');
})().catch(err=>{console.error(err);process.exitCode=1;});
