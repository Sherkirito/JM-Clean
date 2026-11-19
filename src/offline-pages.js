__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,lib=require(deps[3]),Header=require(deps[4]).default;
  const feeds=require(deps[5]),Comments=require(deps[6]).default,el=React.createElement;
  function palette(){const dark=global.darkMode==='1';return {bg:dark?colors.backgroundDark:'white',ink:dark?colors.textPrimaryDark:colors.main,muted:dark?'#bbb':'#666',edge:dark?'#484848':'#ddd',tile:dark?'#373737':'#f3f3f3',accent:dark?'#ffb878':'#874100'};}
  function line(value,style,props){return el(RN.Text,Object.assign({style},props),value);}
  function frame(title,child){return el(RN.View,{style:{flex:1,paddingTop:RN.StatusBar.currentHeight||0,backgroundColor:colors.main}},el(Header,{title}),el(RN.View,{style:{flex:1,backgroundColor:palette().bg}},child));}
  function button(label,fn,color){return el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:label,onPress:fn,style:{minHeight:44,justifyContent:'center',paddingHorizontal:12}},line(label,{color,fontWeight:'600'}));}
  function Books({navigation,standalone}){
    const {rows,loading,error}=lib.useRows(navigation),p=palette(),byId=new Map();
    for(const r of rows){let b=byId.get(r.book);if(!b){b={id:r.book,title:r.title,chapters:[]};byId.set(r.book,b);}b.chapters.push(r);if(!b.cover && r.cover)b.cover=r.cover;}
    function card({item:b}){
      const active=b.chapters.find(lib.busy),count=b.chapters.filter(lib.readable).length;
      return el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:b.title+'，本地下载',onPress:()=>navigation.navigate('OfflineDetail',{id:b.id}),style:{width:'33.33%',padding:4}},
        el(RN.View,{style:{width:'100%',aspectRatio:.72,backgroundColor:p.tile,alignItems:'center',justifyContent:'center',borderRadius:4,overflow:'hidden'}},
          b.cover?el(RN.Image,{source:{uri:b.cover},resizeMode:'cover',style:{width:'100%',height:'100%'}}):line(active?'下载中':'暂无封面',{color:p.muted,fontSize:13})),
        line(b.title,{color:p.ink,fontSize:14,fontWeight:'600',marginTop:4},{numberOfLines:2}),
        line(active?lib.status(active):count?'已下载 '+count+' 话':lib.status(b.chapters[0]),{color:p.muted,fontSize:12,marginVertical:3},{numberOfLines:2}));
    }
    const list=el(RN.View,{style:{flex:1,backgroundColor:p.bg}},
      el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:'打开下载位置',onPress:()=>lib.call('folder').catch(e=>RN.Alert.alert('下载位置',e.message)),style:{minHeight:55,justifyContent:'center',paddingHorizontal:14,borderBottomWidth:RN.StyleSheet.hairlineWidth,borderColor:p.edge}},
        line('下载位置',{color:p.muted,fontSize:12}),line('Download / JM洁净版  ›',{color:p.ink,fontSize:15})),
      el(RN.FlatList,{data:Array.from(byId.values()),numColumns:3,keyExtractor:b=>b.id,renderItem:card,contentContainerStyle:{padding:6},onRefresh:lib.refresh,refreshing:loading,
        ListEmptyComponent:loading?null:error?button(error+'，点此重试',lib.refresh,p.accent):line('还没有本地下载',{textAlign:'center',margin:24,color:p.muted})}));
    return standalone?frame('本地下载',list):list;
  }
  function Standalone(props){return el(Books,Object.assign({},props,{standalone:true}));}
  function Discussion({id,navigation}){
    const feed=React.useMemo(()=>feeds.create(id),[id]);
    React.useEffect(()=>{feed.load('open');return ()=>feed.dispose();},[feed]);
    return el(Comments,{chapter:{id,offline:true},feed,navigation});
  }
  function Detail({route,navigation}){
    const {rows,loading,error}=lib.useRows(navigation),id=String(route.params.id);
    const [details,setDetails]=React.useState(null),checking=React.useRef(false);
    React.useEffect(()=>lib.readDetails(id,setDetails),[id]);
    const items=rows.filter(r=>r.book===id).sort((a,b)=>a.episode-b.episode||a.stamp-b.stamp),book=items[0];
    if(!book || !details || details.id!==id)return frame('漫画介绍',loading || book?el(RN.ActivityIndicator,{color:colors.secondary}):line(error||'本地下载记录不存在',{padding:16,color:palette().ink}));
    const split=v=>String(v||'').split(' · ').filter(Boolean);
    const album=Object.assign({author:split(book.author),tags:split(book.tags),actors:[],works:[]},details && details.id===id?details:null,{
      offline:true,id,name:book.title,cover:(items.find(r=>r.cover)||{}).cover,
      series:items.map(r=>({id:r.id,sort:r.episode,name:r.name,localRow:r})),related_list:[]
    });
    function openChapter(item,restart){
      const row=item && item.localRow;
      if(!row)return;
      if(!lib.readable(row)){navigation.navigate('DownloadPage',{id:row.id,offlineRow:row});return;}
      navigation.navigate('Chapter',{id:row.id,offlineBook:id,episode:row.episode,restartChapter:restart?row.id:undefined});
    }
    async function searchTag(tag){
      if(checking.current)return;
      checking.current=true;
      try{
        const connected=await lib.call('connected');
        if(!navigation.isFocused())return;
        if(connected)navigation.navigate('Search',{searchText:tag});
        else RN.ToastAndroid.show('当前离线，联网后可搜索标签',RN.ToastAndroid.SHORT);
      }catch(_){if(navigation.isFocused())RN.ToastAndroid.show('暂时无法连接网络',RN.ToastAndroid.SHORT);}
      finally{checking.current=false;}
    }
    const Screen=require(deps[7]).default;
    return el(Screen,{route,navigation,localAlbum:album,openLocalChapter:openChapter,searchTag,
      localComments:el(Discussion,{key:id,id,navigation})});
  }
  Object.assign(exports,{Books,Detail,Standalone});
},2185,[55,2,729,2184,2048,2165,2167,2101]);
