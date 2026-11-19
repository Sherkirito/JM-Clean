__d(function(global,require,_i,_a,module,exports,deps){
  const actions=require(deps[0]);
  const initial={info:{},isLoading:true,lang:'zh_CN',darkMode:'0'};
  function setting(state=initial,action){
    switch(action.type){
      case actions.LOAD_SETTING_INFO:return Object.assign({},state,{isLoading:action.isLoading});
      case actions.GET_SETTING_INFO:{
        const valid=action.info && typeof action.info==='object' && !Array.isArray(action.info);
        const info=valid && Object.keys(action.info).length?Object.assign({},state.info,action.info):state.info;
        return Object.assign({},state,{isLoading:false,info});
      }
      case actions.SET_SETTING_LANG:return state.lang==='zh_CN'?state:Object.assign({},state,{lang:'zh_CN'});
      case actions.SET_SETTING_DARK:return Object.assign({},state,{darkMode:action.darkMode});
      default:return state;
    }
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=setting;
},666,[662]);
