const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
function load(name,modules={}){
  const out={};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src',name+'.js'),'utf8'),{
    __d(factory,id,deps){factory({},key=>modules[key],null,null,null,out,deps);}
  });
  return out;
}
const requests=[];
const client={fetchGet(url,params,ok,fail){
  const request={params,ok,fail,abort(){this.aborted=true;}};
  requests.push(request);return request;
}};
const types=load('actions'),deps={648:{default:client},662:types};
const favorites=load('favorite-actions',deps),reduceFavorite=load('favorite-state',deps).default;
let state=reduceFavorite(undefined,{});
const dispatch=action=>{state=reduceFavorite(state,action);};
const get=(folder='0',sort='mr',more=false)=>favorites.favorite('favorite',{folder_id:folder,o:sort},true,more)(dispatch,()=>({Favorite:state}));
const page=(request,ids,total)=>request.ok({code:200,data:{list:ids.map(id=>({id})),total}});
const rows=()=>Array.from(state.favoriteList.list,book=>String(book.id));
const next=()=>get('0','mr',true);
page(get(),[1,'1',2],6);assert.deepEqual(rows(),['1','2']);
const repeated=next();assert.equal(next(),repeated);assert.equal(repeated.params.page,2);
page(repeated,[1,2],6);assert.deepEqual(rows(),['1','2']);assert(state.error);assert.equal(state.page,1);
const retry=next();assert.equal(retry.params.page,2);retry.fail();
assert.equal(state.page,1);assert.deepEqual(rows(),['1','2']);
const recovered=next();assert.equal(recovered.params.page,2);page(recovered,['2',3,4],6);
assert.deepEqual(rows(),['1','2','3','4']);assert.equal(state.error,'');
const third=next();assert.equal(third.params.page,3);page(third,[5,6],6);
assert(state.ended);assert.equal(next(),undefined);
page(get('7'),[10],null);
const slow=get('7','mr',true);const sorted=get('7','mp');
assert(slow.aborted);page(sorted,[18],3);page(slow,[11],2);
assert.deepEqual(rows(),['18']);assert.equal(state.sort,'mp');
const refresh=favorites.favorite('favorite',{page:1},true)(dispatch,()=>({Favorite:state}));
assert.equal(refresh.params.folder_id,'7');assert.equal(refresh.params.o,'mp');page(refresh,[21],null);
const empty=get('7','mp',true);assert.equal(empty.params.page,2);page(empty,[],null);
assert(state.ended);
const obsolete=get('8');dispatch({type:types.GET_LOGOUT_INFO});page(obsolete,[81],1);
assert.deepEqual(rows(),[]);

const search=load('search-actions',deps),reduceSearch=load('search-state',deps).default;
function screen(){
  const session=search.createSearchSession();
  let state=reduceSearch(undefined,{});
  return {session,get result(){return state.searchList;},
    get(query,page=1){return session.search('search',{search_query:query,page},page===1,page>1)(action=>{state=reduceSearch(state,action);});}};
}
const first=screen(),nested=screen();
const find=(request,ids)=>request.ok({code:200,data:{content:ids.map(id=>({id})),total:60}});
find(first.get('outer'),[1,2]);find(first.get('outer',2),[3,4]);
const inFlight=first.get('outer',3);find(nested.get('inner'),[7,8]);
assert(!inFlight.aborted);inFlight.fail();assert.equal(first.result.page,2);assert.equal(first.result.content.length,4);
find(first.get('outer',3),[4,5]);assert.equal(first.result.content.length,5);
const stale=nested.get('inner',2);nested.session.dispose();find(stale,[9]);assert.equal(nested.result.page,1);
console.log('Passed independent search screens, favorite cursors, overlap, repeated pages, retry, sorting, folders, and logout.');
