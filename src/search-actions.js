__d(function(global,require,_i,_a,module,exports,deps){
  const client=require(deps[0]).default, actions=require(deps[1]);
  function createSearchSession(){
    let serial=0,flight=null;
    function dispose(){
      const previous=flight;
      flight=null;
      if(previous && previous.task)previous.task.abort();
    }
    function search(url,params,loading,more,refresh){
      return dispatch=>{
        const query=String(params.search_query||'').trim(),key=JSON.stringify([query,params.o||'',params.page||1]);
        if(flight && flight.key===key)return flight.task;
        const previous=flight, job={id:++serial,key};
        flight=job;
        if(previous && previous.task)previous.task.abort();
        dispatch({type:actions.LOAD_SEARCH_LIST,query,sort:params.o||'',isLoading:!!loading,isLoadMore:!!more,isRefreshing:!!refresh});
        function finish(reply){
          if(flight!==job)return;
          flight=null;
          const raw=reply && (reply.code==null || Number(reply.code)===200) && reply.data;
          if(!raw || (!Array.isArray(raw.content) && raw.redirect_aid==null)){
            dispatch({type:actions.GET_SEARCH_LIST,failed:true,retryPage:Number(params.page)||1});return;
          }
          const content=Array.isArray(raw.content)?raw.content.filter(row=>row && row.id!=null):[];
          const aid=String(raw.redirect_aid==null?'':raw.redirect_aid);
          const result={content,total:raw.total==null?null:Math.max(content.length,Number(raw.total)||0),search_query:query,
            page:Number(params.page)||1,sort:params.o||'',
            redirect_aid:!more && /^[1-9][0-9]*$/.test(aid)?aid:null,requestId:job.id};
          dispatch({type:actions.GET_SEARCH_LIST,searchList:result});
        }
        job.task=client.fetchGet(url,params,finish,()=>finish(null));
        return job.task;
      };
    }
    return {search,dispose};
  }
  function auxiliary(url,params,begin,end,field,loadingField,loading){
    return dispatch=>{
      dispatch({type:begin,[loadingField]:loading});
      const done=reply=>dispatch({type:end,[field]:reply && Array.isArray(reply.data)?reply.data.filter(Boolean):[]});
      return client.fetchGet(url,params,done,()=>done(null));
    };
  }
  exports.createSearchSession=createSearchSession;
  exports.search=createSearchSession().search;
  exports.hotTags=(url,loading)=>auxiliary(url,{},actions.LOAD_HOT_TAGS_LIST,actions.GET_HOT_TAGS_LIST,'hotTagsList','isHotTagsLoading',loading);
  exports.randomRecommend=(url,params,loading)=>auxiliary(url,params,actions.LOAD_RANDOM_ROCOMMEND_LIST,actions.GET_RANDOM_RECOMMEND_LIST,'randomRecommendList','isRandomRecommendLoading',loading);
},2109,[648,662]);
