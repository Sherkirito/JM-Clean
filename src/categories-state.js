__d(function(global,require,_i,_a,module,exports,deps){
  const events=require(deps[0]);
  const initial={categoriesList:{categories:[]},categoriesFilterList:{content:[],tags:[]},isLoading:true,isCategoriesFilterLoading:true,isCategoriesFilterLoadMore:false};
  function list(value){return Array.isArray(value)?value:[];}
  function object(value){return value && typeof value==='object' && !Array.isArray(value)?value:{};}
  function reduce(state,action){
    if(!state)state=initial;
    switch(action.type){
      case events.LOAD_CATEGORIES_LIST:return Object.assign({},state,{isLoading:action.isLoading});
      case events.GET_CATEGORIES_LIST:{
        const value=object(action.categoriesList);
        const items=list(value.categories).filter(x=>x && typeof x==='object').map(x=>
          Object.assign({},x,{sub_categories:list(x.sub_categories)}));
        return Object.assign({},state,{isLoading:false,categoriesList:Object.assign({},value,{
          categories:action.isLoadMore?list(state.categoriesList.categories).concat(items):items})});
      }
      case events.LOAD_CATEGORIES_FILTER_LIST:return Object.assign({},state,{
        isCategoriesFilterLoading:action.isCategoriesFilterLoading,isCategoriesFilterLoadMore:!!action.isCategoriesFilterLoadMore});
      case events.GET_CATEGORIES_FILTER_LIST:{
        const value=object(action.categoriesFilterList);
        const previous=object(state.categoriesFilterList),append=state.isCategoriesFilterLoadMore;
        const updated=Object.assign({},append?previous:{},value,{
          content:(append?list(previous.content):[]).concat(list(value.content).filter(Boolean)),
          tags:list(value.tags || (append && previous.tags))});
        return Object.assign({},state,{isCategoriesFilterLoading:false,categoriesFilterList:updated});
      }
      default:return state;
    }
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=reduce;
},668,[662]);
