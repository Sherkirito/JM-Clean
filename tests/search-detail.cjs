const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const requests=[],types=load('actions',{});
const client={fetchGet(url,params,ok,fail){
  const task={url,params,ok,fail,aborted:false,abort(){this.aborted=true;}};
  requests.push(task);return task;
}};
function load(file,modules){
  const result={};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src',file+'.js'),'utf8'),{
    __d(factory,id,deps){factory({},i=>modules[i],null,null,null,result,deps);}
  });return result;
}
const actions=load('search-actions',{648:{default:client},662:types}),reduce=load('search-state',{662:types}).default;
let state=reduce(undefined,{});
const dispatch=action=>{assert.equal(typeof action.type,'string');state=reduce(state,action);};
actions.randomRecommend('random',{},true)(dispatch).ok({code:200,data:[]});
actions.hotTags('tags',true)(dispatch).ok({code:200,data:[]});
const search=(query,page=1)=>actions.search('search',{search_query:query,page},true,page>1)(dispatch);
const stale=search('1001'),fresh=search('1002');
assert(stale.aborted);assert.equal(search('1002'),fresh);
fresh.ok({code:200,data:{redirect_aid:1002}});
stale.ok({code:200,data:{redirect_aid:1001}});
assert.equal(state.searchList.redirect_aid,'1002');assert.equal(state.searchList.search_query,'1002');
assert.equal(state.searchList.content.length,0);
search('1003').ok({code:200,data:{redirect_aid:'0',content:'invalid'}});
assert.equal(state.searchList.redirect_aid,null);
search('test').ok({code:200,data:{content:[{id:1},null],total:3}});
const first=state.searchList;
search('test',2).ok({code:200,data:{content:[{id:1},{id:2}],total:3}});
assert.equal(first.content.length,1);assert.equal(state.searchList.content.length,2);
search('test',3).ok({code:200,data:{content:[{id:2}],total:400}});
assert.equal(state.searchList.total,2);
const detail=load('detail-actions',{648:{default:client},662:types}).detail,events=[],shown=[];
const get=id=>detail('album',{id},true,(album,error)=>shown.push({album,error}))(e=>events.push(e));
const a=get('1002'),b=get('1003');
b.ok({code:200,data:{id:'1003',tags:'x',author:null,series:[null,{id:'9'}],related_list:{}}});
a.ok({code:200,data:{id:'1002'}});
assert.equal(events.at(-1).detailList.id,'1003');
assert.equal(shown[0].album.tags.length,0);assert.equal(shown[0].album.series.length,1);
get('1004').ok({code:200,data:null});assert.equal(shown.at(-1).album,null);assert.equal(shown.at(-1).error,'未找到这部漫画');
get('1005').ok({code:200,data:{id:'2000'}});assert.equal(shown.at(-1).album,null);
get('1006').fail();assert.equal(shown.at(-1).album,null);
console.log('Passed search redirect, stale responses, duplicate submissions, pagination, missing and mismatched albums.');
