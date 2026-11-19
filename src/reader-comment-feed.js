__d(function(global,require,_i,_a,module,exports,deps){
  const client=require(deps[0]).default,api=require(deps[1]);
  // One feed belongs to the current reader chapter. The general forum uses its own state.
  function create(aid,scope){
    const query=Object.assign({aid,mode:'all'},scope);
    let state={items:[],page:0,more:false,busy:false,refreshing:false,error:null},updated=0,request=null,revision=0,disposed=false;
    const listeners=new Set();
    function change(patch){state=Object.assign({},state,patch);listeners.forEach(fn=>fn(state));}
    const drafts=new Map();
    let pendingReply=null;
    function selectReply(id){
      if(disposed || pendingReply)return;
      change({replyId:id,replyText:drafts.get(id)||'',replyError:''});
    }
    function editReply(text){
      const id=state.replyId;
      if(disposed || id==null || pendingReply)return;
      if(text)drafts.set(id,text);else drafts.delete(id);
      change({replyText:text,replyError:''});
    }
    function discardReply(){
      if(disposed || pendingReply)return;
      drafts.delete(state.replyId);selectReply(null);
    }
    function clearDrafts(){
      pendingReply=null;drafts.clear();
      if(!disposed)change({replyId:null,replyText:'',sending:false,replyError:''});
    }
    function beginReply(){
      if(disposed || pendingReply || state.replyId==null || !state.replyText.trim())return null;
      pendingReply={id:state.replyId,text:state.replyText.trim()};
      change({sending:true,replyError:''});return pendingReply;
    }
    function finishReply(ticket,ok,error){
      if(disposed || pendingReply!==ticket)return;
      pendingReply=null;
      if(ok){drafts.delete(ticket.id);change({replyId:null,replyText:'',sending:false,replyError:''});load('refresh');}
      else change({sending:false,replyError:error||'发送失败，请重试'});
    }
    function load(action){
      if(disposed || state.busy && action!=='refresh')return;
      if(action==='open' && state.page && Date.now()-updated<120000)return;
      if(action==='more' && !state.more)return;
      const page=action==='more'?state.page+1:1, rev=++revision;
      if(request)request.abort();request=null;
      change({busy:true,refreshing:action==='refresh',error:null});
      function failed(){if(!disposed && rev===revision){request=null;change({busy:false,refreshing:false,error:page});}}
      request=client.fetchGet(api.API_FORUM_LIST,Object.assign({},query,{page}),reply=>{
        if(disposed || rev!==revision)return;
        const data=reply && reply.data;
        if(!data || !Array.isArray(data.list) || reply.code!=null && Number(reply.code)!==200)return failed();
        const prior=page===1?[]:state.items,seen=new Set(prior.map(item=>String(item.CID)));
        const fresh=data.list.filter(item=>{
          if(!item || item.CID==null || seen.has(String(item.CID)))return false;
          seen.add(String(item.CID));return true;
        });
        const items=prior.concat(fresh),total=data.total==null?NaN:Number(data.total);
        if(page===1)updated=Date.now();
        request=null;change({items,page,busy:false,refreshing:false,error:null,more:fresh.length>0 && (!Number.isFinite(total)||items.length<total)});
      },failed);
    }
    return {load,selectReply,editReply,discardReply,clearDrafts,beginReply,finishReply,get:()=>state,subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);},
      dispose(){disposed=true;revision++;if(request)request.abort();request=null;listeners.clear();clearDrafts();
        state=Object.assign({},state,{replyId:null,replyText:'',sending:false,replyError:''});}};
  }
  exports.create=create;
},2165,[648,650]);
