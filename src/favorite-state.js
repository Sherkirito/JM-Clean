__d(function(global,require,_i,_a,module,exports,deps){
  const types=require(deps[0]);
  const initial={favoriteList:{list:[],total:0},folderList:[],folder:'0',sort:'mr',page:0,ended:false,
    requestId:null,error:'',isLoading:false,isLoadMore:false,isRefreshing:false,
    isAddOrRemoveLoading:false,isLikeLoading:false,likeResult:[],addOrRemoveResult:[]};
  function reducer(state=initial,action){
    switch(action.type){
      case types.GET_LOGOUT_INFO:return initial;
      case types.LOAD_FAVORITE_LIST:{
        const same=state.folder===action.folder && state.sort===action.sort;
        const reset=same?{}:{favoriteList:initial.favoriteList,page:0,ended:false};
        return Object.assign({},state,reset,{requestId:action.id,folder:action.folder,sort:action.sort,
          isLoading:action.loading,isLoadMore:action.more,error:''});
      }
      case types.GET_FAVORITE_LIST:{
        if(state.requestId!==action.id)return state;
        const next=Object.assign({},state,{requestId:null,isLoading:false,isLoadMore:false});
        if(!action.data)return Object.assign(next,{error:'加载失败，点此重试',retryPage:action.page});
        const data=action.data, prior=action.more?state.favoriteList.list:[];
        const seen=new Set(prior.map(book=>String(book.id)));
        const fresh=data.list.filter(book=>{
          if(!book || book.id==null || String(book.id)==='')return false;
          const key=String(book.id);
          if(seen.has(key))return false;
          seen.add(key);return true;
        });
        if(data.list.length && !fresh.length)
          return Object.assign(next,{error:'本页没有新增收藏，点此重试',retryPage:action.page});
        const list=prior.concat(fresh);
        let total=data.total==null || data.total===''?null:Number(data.total);
        if(!Number.isFinite(total) || total<0)total=action.more?state.favoriteList.total:null;
        return Object.assign(next,{page:action.page,favoriteList:{list,total},
          ended:!data.list.length || (total!=null && list.length>=total),
          folderList:Array.isArray(data.folder_list)?data.folder_list:state.folderList});
      }
      case types.LOAD_FAVORITE_ADD_REMOVE:return Object.assign({},state,{isAddOrRemoveLoading:action.isAddOrRemoveLoading});
      case types.GET_FAVORITE_ADD_REMOVE:return Object.assign({},state,{isAddOrRemoveLoading:false,addOrRemoveResult:action.addOrRemoveResult});
      case types.LOAD_LIKE_DATA:return Object.assign({},state,{isLikeLoading:action.isLikeLoading});
      case types.GET_LIKE_DATA:return Object.assign({},state,{isLikeLoading:false,likeResult:action.likeResult});
      default:return state;
    }
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=reducer;
},672,[662]);
