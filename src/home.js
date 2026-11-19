__d(function (global, require, _i, _a, module, exports, deps) {
  const React=require(deps[0]), RN=require(deps[1]), api=require(deps[2]), client=require(deps[3]).default;
  const Toolbar=require(deps[4]).default, Shortcuts=require(deps[5]).default, Shelf=require(deps[6]).default;
  const Library=require(deps[7]).default, Card=require(deps[8]).default, card=require(deps[9]).comicVerticalListStyle;
  const theme=require(deps[10]).mainStyle, week=require(deps[11]), lang=require(deps[12]).lang;
  const el=React.createElement;
  function albums(list) {
    return Array.isArray(list) ? list.filter(item=>item && (typeof item.id==='number' || typeof item.id==='string')) : null;
  }
  class Home extends React.Component {
    constructor(props) {
      super(props);
      this.state={shelves:[],latest:[],refreshing:false,busy:false,feedError:false,latestError:false};
      this.revision=0;this.offset=0;this.end=false;this.loading=false;
      this.renderRow=this.renderRow.bind(this);this.refresh=this.refresh.bind(this);
    }
    componentDidMount(){this.refresh();this.focus=this.props.navigation.addListener('focus',()=>{if(this.host!==global.api_host)this.refresh();});}
    componentWillUnmount(){if(this.focus)this.focus();this.revision++;if(this.feed)this.feed.abort();if(this.latest)this.latest.abort();}
    refresh() {
      this.host=global.api_host;const rev=++this.revision;
      if(this.feed)this.feed.abort();if(this.latest)this.latest.abort();
      this.setState({refreshing:true,feedError:false,latestError:false});
      this.loading=false;
      this.feed=client.fetchGet(api.API_COMBIC_PROMOTE,{page:0},reply=>{
        if(rev!==this.revision)return;
        if(!Array.isArray(reply.data))return this.setState({feedError:true});
        const shelves=[];
        reply.data.forEach(s=>{
          if(!s || /game|movie|video|hanime|blog/i.test(s.type || ''))return;
          const content=albums(s.content);
          if(content && content.length)shelves.push(Object.assign({},s,{content}));
        });
        this.setState({shelves:shelves});
      },()=>{if(rev===this.revision)this.setState({feedError:true});});
      this.load(true);
    }
    load(reset) {
      if(this.loading || !reset && this.end)return;
      this.loading=true;
      const rev=this.revision, offset=reset?0:this.offset;
      this.setState({busy:true,latestError:false});
      const failed=()=>{if(rev!==this.revision)return;this.loading=false;this.setState({busy:false,refreshing:false,latestError:true});};
      this.latest=client.fetchGet(api.API_COMBIC_LATEST,{page:offset},reply=>{
        if(rev!==this.revision)return;
        const batch=albums(reply.data) || albums(reply.data && reply.data.content);
        if(!batch)return failed();
        const previous=reset?[]:this.state.latest, seen=new Set(previous.map(x=>String(x.id)));
        const fresh=batch.filter(x=>{const k=String(x.id);if(seen.has(k))return false;seen.add(k);return true;});
        this.end=!fresh.length;this.offset=offset+10;this.loading=false;
        this.setState({latest:previous.concat(fresh),busy:false,refreshing:false});
      },failed);
    }
    retry(label,action) {return el(RN.TouchableOpacity,{onPress:action,accessibilityRole:'button',style:{padding:16}},
      el(RN.Text,{style:{textAlign:'center',color:'#e88735'}},label));}
    renderRow({item}) {
      const dark=global.darkMode==='1';
      if(item.kind==='shelf')return el(item.value.type==='library'?Library:Shelf,{item:item.value});
      if(item.kind==='heading')return el(RN.View,{style:dark?theme.newestDark:theme.newest},el(RN.Text,{style:dark?theme.newestTitleDark:theme.newestTitle},lang('最新上傳')));
      return el(RN.View,{style:dark?theme.newestColumnDark:theme.newestColumn},item.value.map(album=>
        el(Card,{key:String(album.id),item:album,categoryStyle:card.listCategory,containerStyle:card.listCardContainer})));
    }
    render() {
      const s=this.state, data=s.shelves.map((s,i)=>({kind:'shelf',key:'s'+i+'-'+(s.id||s.type),value:s}));
      data.push({kind:'heading',key:'latest'});
      for(let i=0;i<s.latest.length;i+=3)data.push({kind:'cards',key:'a'+s.latest[i].id,value:s.latest.slice(i,i+3)});
      return el(RN.View,{style:[theme.container,{flex:1,backgroundColor:global.darkMode==='1'?'#232323':'#fff'}]},
        el(RN.StatusBar,{translucent:true,backgroundColor:'#232323',barStyle:'light-content'}),
        el(Toolbar,{homeToolbar:true,onLines:()=>this.props.navigation.navigate('LineSettings',{returnToMain:true}),backgroundOpacity:'#232323'}),
        el(RN.FlatList,{data:data,keyExtractor:row=>row.key,renderItem:this.renderRow,windowSize:5,initialNumToRender:3,
          maxToRenderPerBatch:3,refreshing:s.refreshing,onRefresh:this.refresh,
          onEndReached:()=>{if(!s.latestError && s.latest.length)this.load(false);},onEndReachedThreshold:0.4,
          ListHeaderComponent:el(RN.View,null,el(Shortcuts),el(RN.TouchableOpacity,{accessibilityLabel:'每周更新',onPress:()=>this.props.navigation.navigate('Week'),style:{marginBottom:10}},
            el(RN.Image,{source:week,resizeMode:'stretch',style:{width:'100%',aspectRatio:1/0.123}})),
            s.feedError && this.retry('推荐加载失败，点击重试',this.refresh)),
          ListFooterComponent:s.latestError ? this.retry('最新上传加载失败，点击重试',()=>this.load(!s.latest.length)) :
            s.busy ? el(RN.ActivityIndicator,{color:'#ff903e',style:{padding:12}}) : null}));
    }
  }
  Object.defineProperty(exports,'__esModule',{value:true});
  exports.default=Home;
},803,[55,2,650,648,808,1420,1422,1598,1424,1620,809,1651,651]);
