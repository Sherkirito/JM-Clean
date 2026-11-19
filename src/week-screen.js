__d(function(global,require,_i,_a,module,exports,deps){
  const Week=require(deps[0]).default,client=require(deps[1]).default,api=require(deps[2]);
  const React=require(deps[3]),PageStatus=require(deps[4]).PageStatus;
  const identified=item=>item && (typeof item.id==='number' || typeof item.id==='string');
  class WeeklyScreen extends Week{
    componentDidMount(){
      this.live=true;this.revision=0;
      this.getWeekData=()=>{
        this.cancel();
        const revision=this.revision;
        this.setState({weekError:'',weekList:undefined});
        this.request=client.fetchGet(api.API_WEEK,{page:0},reply=>{
          if(!this.live || revision!==this.revision)return;
          const week=reply && reply.data;
          const categories=week && Array.isArray(week.categories)?week.categories.filter(identified):[];
          if(!categories.length)return this.failed(revision,'暂无可用的每周更新');
          const type=Array.isArray(week.type)?week.type.filter(identified):[];
          const selected=categories.some(x=>x.id===this.state.selected)?this.state.selected:categories[0].id;
          this.setState({week:Object.assign({},week,{categories,type}),selected},()=>this.loadList(selected));
        },()=>this.failed(revision,'暂时无法读取每周更新'));
      };
      this.onTypeChange=()=>this.loadList(this.state.selected);
      this.getWeekData();
    }
    failed(revision,message){
      if(this.live && this.revision===revision)this.setState({weekError:message});
    }
    cancel(){this.revision++;if(this.request)this.request.abort();this.request=null;}
    componentWillUnmount(){this.live=false;this.cancel();}
    onValueChange(id){if(id!==this.state.selected)this.setState({selected:id},()=>this.loadList(id));}
    loadList(id){
      if(!this.live)return;
      this.cancel();
      const revision=this.revision;
      this.request=client.fetchGet(api.API_WEEK__FILTER_LIST,{id,type:this.state.type,page:0},reply=>{
        if(!this.live || revision!==this.revision)return;
        const list=reply && reply.data && reply.data.list;
        if(!Array.isArray(list))return this.failed(revision,'暂时无法读取本期列表');
        this.setState({weekList:list.filter(identified),weekError:''});
      },()=>this.failed(revision,'暂时无法读取本期列表'));
    }
    render(){
      if(this.state.weekError || !this.state.weekList)return React.createElement(PageStatus,{
        message:this.state.weekError,actions:[['重试',this.getWeekData]]});
      return super.render();
    }
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=WeeklyScreen;
},2182,[2050,648,650,55,2180]);
