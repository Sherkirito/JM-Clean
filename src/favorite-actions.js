__d(function(global,require,_i,_a,module,exports,deps){
  const client=require(deps[0]).default, types=require(deps[1]);
  let sequence=0, pending=null;

  function favorite(url,params,loading,more){
    return (dispatch,getState)=>{
      const state=getState().Favorite, options=Object.assign({},params);
      // Card actions refresh the current collection without sending a folder or sort.
      if(options.folder_id==null)options.folder_id=state.folder;
      if(options.o==null)options.o=state.sort;
      const folder=String(options.folder_id), sort=options.o;
      if(more && (state.folder!==folder || state.sort!==sort || state.ended))return;
      options.page=more?state.page+1:1;
      const key=JSON.stringify([url,folder,sort,options.page]);
      if(pending && pending.key===key && state.requestId===pending.id)return pending.task;
      if(more && state.requestId!=null)return;
      const previous=pending, job={id:++sequence,key};
      pending=job;
      if(previous && previous.task)previous.task.abort();
      dispatch({type:types.LOAD_FAVORITE_LIST,id:job.id,folder,sort,more:!!more,loading:!!loading});
      function finish(reply){
        if(pending!==job)return;
        pending=null;
        const data=reply && (reply.code==null || Number(reply.code)===200) && reply.data;
        dispatch({type:types.GET_FAVORITE_LIST,id:job.id,page:options.page,more:!!more,
          data:data && Array.isArray(data.list)?data:null});
      }
      job.task=client.fetchGet(url,options,finish,()=>finish(null));
      return job.task;
    };
  }
  function post(url,params,begin,end,loadingField,resultField,loading){
    return dispatch=>{
      dispatch({type:begin,[loadingField]:loading});
      const finish=reply=>dispatch({type:end,[resultField]:reply});
      return client.fetchPost(url,params,finish,()=>finish([]));
    };
  }
  exports.favorite=favorite;
  exports.addOrRemoveFavorite=(url,params,loading)=>post(url,params,types.LOAD_FAVORITE_ADD_REMOVE,types.GET_FAVORITE_ADD_REMOVE,'isAddOrRemoveLoading','addOrRemoveResult',loading);
  exports.like=(url,params,loading)=>post(url,params,types.LOAD_LIKE_DATA,types.GET_LIKE_DATA,'isLikeLoading','likeResult',loading);
},1425,[648,662]);
