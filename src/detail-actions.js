__d(function(global,require,_i,_a,module,exports,deps){
  const client=require(deps[0]).default,actions=require(deps[1]);
  let sequence=0;
  function album(reply,id){
    const value=reply && reply.data;
    if(!value || Array.isArray(value) || String(value.id)!==String(id) || reply.code!=null && Number(reply.code)!==200)return null;
    const entry=Object.assign({},value);
    for(const field of ['tags','author','actors','works'])entry[field]=Array.isArray(value[field])?value[field].filter(x=>typeof x==='string'):[];
    for(const field of ['series','related_list'])entry[field]=Array.isArray(value[field])?value[field].filter(x=>x && (typeof x.id==='string'||typeof x.id==='number')):[];
    return entry;
  }
  exports.detail=(url,params,loading,complete)=>dispatch=>{
    const generation=++sequence;
    dispatch({type:actions.LOAD_COMBICK_DETIAL_LIST,isLoading:loading});
    function finish(reply){
      const value=album(reply,params.id);
      if(generation===sequence)dispatch({type:actions.GET_COMBICK_DETIAL_LIST,detailList:value||{}});
      if(complete)complete(value,reply && ([404,410].includes(Number(reply.code)) || (Number(reply.code)===200 && !reply.data))?'未找到这部漫画':'漫画详情暂时无法读取');
    }
    return client.fetchGet(url,params,finish,error=>finish(error && {code:error.status}));
  };
},2102,[648,662]);
