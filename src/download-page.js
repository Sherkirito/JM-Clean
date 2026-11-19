__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),client=require(deps[2]).default,api=require(deps[3]);
  const Header=require(deps[4]).default,colors=require(deps[5]).colors,el=React.createElement;
  const web=url=>typeof url==='string' && /^https?:\/\/[^\s/]+/i.test(url);
  const question=()=>[1+Math.floor(100*Math.random()),1+Math.floor(100*Math.random())];
  const lib=require(deps[6]);
  function Download({route,navigation,album}){
    const id=(route.params||{}).id,[attempt,retry]=React.useReducer(n=>n+1,0);
    const catalog=lib.useRows(navigation),row=catalog.rows.find(r=>r.id===String(id)),[sending,setSending]=React.useState(false),guard=React.useRef(false);
    const [file,setFile]=React.useState(null),[error,setError]=React.useState(''),[pair,setPair]=React.useState(question),[answer,setAnswer]=React.useState('');
    React.useEffect(()=>{
      let live=true;setFile(null);setError('');
      const failed=msg=>{if(live)setError(msg);};
      const task=client.fetchGet(api.API_ALBUM_DOWNLOAD+'/'+encodeURIComponent(id),{},reply=>{
        if(!live)return;
        const data=reply && reply.data;
        if(!data || String(data.status)==='0' || !web(data.download_url))return failed('下载资源暂不可用');
        setFile(data);
      },()=>failed('暂时无法读取下载信息'));
      return ()=>{live=false;if(task)task.abort();};
    },[id,attempt]);
    function resetQuestion(){setAnswer('');setPair(question());}
    async function download(){
      if(guard.current)return;
      if(!answer.trim() || Number(answer)!==pair[0]+pair[1]){RN.Alert.alert('验证码错误');resetQuestion();return;}
      guard.current=true;setSending(true);RN.Keyboard.dismiss();
      try{await lib.begin(Object.assign(lib.metadata(id,album,file,row||route.params.offlineRow),{url:file.download_url}));}
      catch(e){RN.Alert.alert('下载',e.message);}
      finally{guard.current=false;setSending(false);resetQuestion();}
    }
    const dark=global.darkMode==='1',ink=dark?'white':colors.main;
    return el(RN.View,{style:{flex:1,paddingTop:RN.StatusBar.currentHeight||0,backgroundColor:colors.main}},el(Header,{title:'下载页'}),
      el(RN.ScrollView,{keyboardShouldPersistTaps:'always',contentContainerStyle:{padding:16},style:{backgroundColor:dark?colors.backgroundDark:'white'}},
        row && el(RN.View,{style:{marginBottom:14}},el(RN.Text,{accessibilityLiveRegion:'polite',style:{color:ink,fontSize:16,marginBottom:8}},lib.status(row)),
          el(RN.Button,{title:'查看本地下载',onPress:()=>navigation.navigate('OfflineLibrary'),color:colors.secondary})),
        row && (['queued','running','paused'].includes(row.state)||lib.readable(row))?null:
        error?el(RN.View,null,el(RN.Text,{style:{color:ink,marginBottom:12}},error),el(RN.Button,{title:'重试',onPress:retry,color:colors.secondary})):
        !file?el(RN.ActivityIndicator,{color:colors.secondary}):el(RN.View,null,
          el(RN.Text,{style:{color:ink,fontSize:18}},[file.title,file.fileSize].filter(Boolean).join('  ')),
          web(file.img_url) && el(RN.Image,{source:{uri:file.img_url},resizeMode:'contain',style:{height:200,marginVertical:10}}),
          el(RN.Text,{style:{color:ink,marginTop:16}},pair.join(' + ')+' ='),
          el(RN.TextInput,{accessibilityLabel:'验证码答案',placeholder:'请输入答案',keyboardType:'numeric',returnKeyType:'done',value:answer,onChangeText:setAnswer,onSubmitEditing:download,style:{color:ink}}),
          el(RN.Button,{title:'下载',disabled:sending,onPress:download,color:colors.secondary}),el(RN.Button,{title:'换一题',onPress:resetQuestion,color:colors.tertiary}))));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=require(deps[7]).connect(s=>({album:s.Detail && s.Detail.detailList}))(Download);
},2153,[55,2,648,650,2048,729,2184,410]);
