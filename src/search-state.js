__d(function(global,require,_i,_a,module,exports,deps){
  const a=require(deps[0]),initial={searchList:{content:[],total:0,search_query:''},isLoading:true,isLoadMore:false,isRefreshing:false,
    hotTagsList:[],randomRecommendList:[],isHotTagsLoading:true,isRandomRecommendLoading:true};
  function reducer(state=initial,action){
    switch(action.type){
      case a.LOAD_SEARCH_LIST:{
        const same=state.searchList.search_query===action.query && (state.searchList.sort||'')===action.sort;
        return Object.assign({},state,{searchList:same?state.searchList:{content:[],total:0,search_query:action.query,sort:action.sort},
          failed:false,isLoading:action.isLoading,isLoadMore:action.isLoadMore,isRefreshing:action.isRefreshing});
      }
      case a.GET_SEARCH_LIST:{
        if(action.failed)return Object.assign({},state,{failed:true,retryPage:action.retryPage,isLoading:false,isLoadMore:false,isRefreshing:false});
        const result=Object.assign({},action.searchList);
        {
          const prior=state.isLoadMore?state.searchList.content:[],seen=new Set(prior.map(row=>String(row.id)));
          const fresh=result.content.filter(row=>{const id=String(row.id);if(seen.has(id))return false;seen.add(id);return true;});
          result.content=prior.concat(fresh);
          if(state.isLoadMore && result.total==null)result.total=state.searchList.total;
          if(!fresh.length)result.total=result.content.length;
        }
        return Object.assign({},state,{searchList:result,isLoading:false,isLoadMore:false,isRefreshing:false});
      }
      case a.LOAD_HOT_TAGS_LIST:return Object.assign({},state,{isHotTagsLoading:action.isHotTagsLoading});
      case a.GET_HOT_TAGS_LIST:return Object.assign({},state,{isHotTagsLoading:false,hotTagsList:action.hotTagsList});
      case a.LOAD_RANDOM_ROCOMMEND_LIST:return Object.assign({},state,{isRandomRecommendLoading:action.isRandomRecommendLoading});
      case a.GET_RANDOM_RECOMMEND_LIST:return Object.assign({},state,{isRandomRecommendLoading:false,randomRecommendList:action.randomRecommendList});
      default:return state;
    }
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=reducer;
},667,[662]);
