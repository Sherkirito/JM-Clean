__d(function(global,require,_i,_a,module,exports){
  // The original StackRouter rewinds to the first matching screen name on NAVIGATE.
  // A link from one book to a tag or another book opens a new browsing context.
  exports.forStack=function(state,action){
    const target=action.payload;
    if(action.type!=='NAVIGATE' || state.type!=='stack' || !target || target.key ||
      !state.routeNames.includes('ApiSwitcher') || !state.routeNames.includes(target.name) ||
      target.name==='Main' || target.name==='ApiSwitcher')return action;
    const current=state.routes[state.index];
    if(current.name===target.name){
      if(target.name==='Chapter')return action;
      const old=current.params||{},next=target.params||{};
      if(!Object.keys(next).some(key=>typeof next[key]!=='object' && String(next[key])!==String(old[key])))return action;
    }
    return Object.assign({},action,{type:'PUSH'});
  };
},2179,[]);
