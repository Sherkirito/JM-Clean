__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),connect=require(deps[2]).connect,colors=require(deps[3]).colors;
  const Header=require(deps[4]).default,el=React.createElement;
  function check(){
    require(deps[5]).readFile('content://com.jiaohua_cleaner.jmbackup/update','utf8')
      .catch(()=>RN.ToastAndroid.show('无法打开软件更新，请重试',RN.ToastAndroid.SHORT));
  }
  function Version({info}){
    const url=info.app_landing_page;
    return el(RN.View,{style:{flex:1,paddingTop:RN.StatusBar.currentHeight||0,backgroundColor:colors.main}},el(Header,{title:'版本信息'}),
      el(RN.ScrollView,{contentContainerStyle:{padding:16}},
        el(RN.Text,{style:{color:'white',fontSize:18}},'JM洁净版 1.2.0'),
        el(RN.Button,{title:'检查洁净版更新',color:colors.secondary,onPress:check}),
        !!info.version && el(RN.Text,{style:{color:'white',marginVertical:12}},'源站版本 '+info.version),
        !!info.version_info && el(RN.Text,{style:{color:'white',lineHeight:22}},String(info.version_info)),
        typeof url==='string' && /^https?:\/\//i.test(url) && el(RN.Button,{title:'在浏览器查看源站版本',color:colors.secondary,
          onPress:()=>RN.Linking.openURL(url).catch(()=>RN.Alert.alert('暂时无法打开此链接'))})));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.check=check;exports.default=connect(s=>({info:s.Setting.info||{}}))(Version);
},2114,[55,2,410,729,2048,2118]);
