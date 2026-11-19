__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]), RN=require(deps[1]), connect=require(deps[2]).connect;
  const setting=require(deps[3]).setting, api=require(deps[4]), health=require(deps[5]), client=require(deps[6]).default;
  const el=React.createElement, colors=require(deps[7]).colors, accent=colors.secondary;
  function label(value,size,color,weight){return el(RN.Text,{style:{fontSize:size,color:color,fontWeight:weight||'400'}},value);}
  function Lines(props){
    const [,update]=React.useReducer(n=>n+1,0), [busy,setBusy]=React.useState([]), [waiting,setWaiting]=React.useState(false);
    const run=React.useRef(null), list=health.hosts(), recommended=health.order(list)[0];
    const dark=global.darkMode==='1', surface=dark?colors.backgroundDark:'white', ink=dark?colors.textPrimaryDark:colors.main, muted=dark?colors.primary:colors.tertiary;
    const canvas=dark?'#161616':'#F2F2F2', edge=dark?'#515151':'#C6C6C6', highlight=dark?'#FFAA67':'#964400';
    const ready=!!(props.Setting.info && props.Setting.info.img_host);
    function cancel(){const batch=run.current;run.current=null;if(batch)batch.tasks.forEach(t=>t.abort());}
    React.useEffect(()=>{let live=true;const off=health.subscribe(update);health.ready.then(()=>{if(live)update();});return ()=>{live=false;off();cancel();};},[]);
    const settings=props.route.name==='LineSettings';
    function leave(){cancel();setBusy([]);setWaiting(false);if(settings)props.navigation.goBack();else props.navigation.replace('Main');}
    React.useEffect(()=>{if(waiting && ready)leave();},[waiting,ready]);
    function choose(host){
      health.choose(host);
      if(ready)return leave();
      setWaiting(true);if(!props.Setting.isLoading)props.setting(api.API_APP_SETTING,{},true);
    }
    function measure(set){
      cancel();const batch={tasks:new Set(),todo:set.slice()};run.current=batch;setBusy(set);
      function next(){
        if(run.current!==batch || !batch.todo.length)return;
        const host=batch.todo.shift(),task=client.probe(host);
        batch.tasks.add(task);
        task.then(()=>{if(run.current!==batch)return;batch.tasks.delete(task);setBusy(items=>items.filter(h=>h!==host));next();});
      }
      next();next();
    }
    function control(title,fn,disabled,card){
      return el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:card?card+'，'+title:title,disabled:disabled,onPress:fn,
        style:{minHeight:44,minWidth:64,paddingHorizontal:10,justifyContent:'center',alignItems:'center',borderRadius:6,
          borderWidth:card?1:0,borderColor:edge,opacity:disabled?0.55:1}},label(title,14,card?ink:'#FFAA67','600'));
    }
    function time(sample){return sample ? sample.ok ? sample.ms+' ms' : '失败' : '待记录';}
    function row(host,i){
      const stat=health.summary(host), best=host===recommended && stat.good>0, current=host===global.api_host, active=busy.includes(host);
      const details=['首页 '+time(stat.last.home),'章节 '+time(stat.last.reader||stat.last.chapter)].join('    ');
      const title='线路 '+(i+1);
      return el(RN.View,{key:host,style:{backgroundColor:surface,borderWidth:current?2:1,borderColor:current?accent:edge,
        borderRadius:10,marginHorizontal:12,marginBottom:10,padding:12,flexDirection:'row',alignItems:'center'}},
        el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:'使用'+title+(current?'，当前':'')+(best?'，推荐':''),
          onPress:()=>choose(host),style:{flex:1,minHeight:68,justifyContent:'center',paddingRight:8}},
          el(RN.View,{style:{flexDirection:'row',flexWrap:'wrap',alignItems:'center'}},label(title,17,ink,'bold'),
            current && label('   当前',13,highlight,'bold'),best && label('   推荐',13,highlight,'600')),
          label(details,13,muted),label(active?'正在测速…':stat.last.probe?'上次测速  '+time(stat.last.probe):'尚未测速',13,muted)),
        control(active?'测速中':'测速',()=>measure([host]),busy.length>0,title));
    }
    return el(RN.SafeAreaView,{style:{flex:1,backgroundColor:colors.main,paddingTop:RN.StatusBar.currentHeight||0}},
      el(RN.StatusBar,{translucent:true,barStyle:'light-content',backgroundColor:colors.main}),
      el(RN.View,{style:{flexDirection:'row',minHeight:45,paddingLeft:15,paddingRight:3,alignItems:'center',justifyContent:'space-between'}},
        settings && el(require(deps[8]).Controls,{}),el(RN.View,{style:{flex:1}},label('选择线路',18,'white','bold')),control('全部重测',()=>measure(list),!list.length||busy.length>0)),
      el(RN.ScrollView,{style:{backgroundColor:canvas},contentContainerStyle:{paddingBottom:20}},
        !settings && control('本地下载',()=>props.navigation.navigate('OfflineLibrary'),false),
        el(RN.Text,{style:{fontSize:13,lineHeight:19,color:muted,paddingHorizontal:15,paddingVertical:12}},'点线路进入。推荐参考首页和章节的加载表现。'),
        waiting && label(props.Setting.isLoading?'正在连接…':'连接失败，点线路重试',14,accent),
        list.length?list.map(row):el(RN.ActivityIndicator,{color:accent})));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=connect(s=>({Setting:s.Setting}),{setting})(Lines);
},2125,[55,2,410,647,650,2158,648,729,2180]);
