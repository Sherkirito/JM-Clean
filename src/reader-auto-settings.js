__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,el=React.createElement;
  const defaults={keep:6,ahead:2},keepMax=100,aheadMax=20;
  const inRange=(n,min,max)=>Number.isInteger(n) && n>=min && n<=max;
  const valid=n=>inRange(n,2,30);
  const validCache=c=>!!c && inRange(c.keep,0,keepMax) && inRange(c.ahead,0,aheadMax);
  function palette(){
    const dark=global.darkMode==='1';
    return {surface:dark?colors.backgroundDark:'white',ink:dark?colors.textPrimaryDark:colors.main,muted:dark?'#bcbcbc':'#626262',track:dark?'#747474':'#cccccc'};
  }
  function SettingSheet({title,hint,children,allowed,confirm,onSave,onClose}){
    const p=palette();
    return el(RN.Modal,{visible:true,transparent:true,animationType:'fade',onRequestClose:onClose},
      el(RN.View,{style:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(0,0,0,.4)'}},
        el(RN.TouchableWithoutFeedback,{accessible:false,onPress:onClose},el(RN.View,{style:RN.StyleSheet.absoluteFill})),
        el(RN.ScrollView,{keyboardShouldPersistTaps:'handled',bounces:false,style:{flexGrow:0,backgroundColor:p.surface,borderTopLeftRadius:10,borderTopRightRadius:10},contentContainerStyle:{padding:16}},
          el(RN.Text,{accessibilityRole:'header',style:{color:p.ink,fontSize:18,fontWeight:'bold'}},title),
          el(RN.Text,{style:{color:p.muted,fontSize:14,marginTop:6}},hint),children,
          el(RN.View,{style:{flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}},
            el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:'取消',onPress:onClose,
              style:{minHeight:44,paddingHorizontal:16,justifyContent:'center'}},el(RN.Text,{style:{color:p.ink,fontSize:15}},'取消')),
            el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:confirm,disabled:!allowed,accessibilityState:{disabled:!allowed},
              onPress:onSave,style:{minHeight:44,paddingHorizontal:20,borderRadius:6,justifyContent:'center',backgroundColor:colors.secondary,opacity:allowed?1:.45}},
              el(RN.Text,{style:{color:colors.main,fontWeight:'bold',fontSize:15}},confirm))))));
  }
  function Quantity({title,sliderLabel,inputLabel,unit,min,max,initial,onValue}){
    const p=palette(),[draft,setDraft]=React.useState(String(initial)),[position,setPosition]=React.useState(initial);
    const parse=text=>/^\d+$/.test(text) && inRange(Number(text),min,max)?Number(text):null;
    function edit(text){
      const digits=text.replace(/[０-９]/g,c=>String(c.charCodeAt(0)-65296)),n=parse(digits);
      setDraft(digits);if(n!==null)setPosition(n);onValue(n);
    }
    return el(RN.View,{style:{marginTop:12}},
      title && el(RN.Text,{style:{color:p.ink,fontSize:15,fontWeight:'600'}},title),
      el(RN.View,{style:{flexDirection:'row',alignItems:'center'}},
        el(RN.Slider,{accessibilityLabel:sliderLabel,minimumValue:min,maximumValue:max,step:1,value:position,
          minimumTrackTintColor:colors.secondary,maximumTrackTintColor:p.track,thumbTintColor:colors.secondary,
          style:{height:48,flex:1,marginRight:8},onValueChange:n=>edit(String(n)),onSlidingComplete:n=>edit(String(n))}),
        el(RN.TextInput,{accessibilityLabel:inputLabel,value:draft,onChangeText:edit,keyboardType:'number-pad',
          selectTextOnFocus:true,returnKeyType:'done',underlineColorAndroid:'transparent',style:{width:60,minHeight:44,paddingVertical:5,paddingHorizontal:4,
          textAlign:'center',color:p.ink,fontSize:18,borderRadius:6,borderWidth:1,borderColor:p.muted}}),
        el(RN.Text,{style:{color:p.ink,fontSize:14,marginLeft:6}},unit)),
      el(RN.Text,{accessibilityLiveRegion:'polite',style:{color:p.muted,fontSize:13,marginBottom:12}},
        parse(draft)===null?'请输入 '+min+' 到 '+max+' 之间的整数':min+' 到 '+max+' '+unit));
  }
  function IntervalSheet({seconds,onStart,onClose}){
    const [value,set]=React.useState(seconds);
    return el(SettingSheet,{title:'自动翻页间隔',hint:'画面加载完成后开始计时。双页模式会等两页都显示。',allowed:valid(value),
      confirm:'开始自动翻页',onSave:()=>onStart(value),onClose},
      el(Quantity,{sliderLabel:'调整翻页间隔',inputLabel:'翻页间隔秒数',unit:'秒',min:2,max:30,initial:seconds,onValue:set}));
  }
  function CacheSheet({cache,onSave,onClose}){
    const [keep,setKeep]=React.useState(cache.keep),[ahead,setAhead]=React.useState(cache.ahead);
    return el(SettingSheet,{title:'图片缓存',hint:'仅保留当前章节的图片，退出阅读器时释放。正在看的图片单独保留。',
      allowed:validCache({keep,ahead}),confirm:'保存',onSave:()=>onSave({keep,ahead}),onClose},
      el(Quantity,{title:'已看图片保留',sliderLabel:'调整已看张数',inputLabel:'已看图片保留张数',unit:'张',min:0,max:keepMax,initial:cache.keep,onValue:setKeep}),
      el(Quantity,{title:'向前预加载',sliderLabel:'调整预加载张数',inputLabel:'预加载张数',unit:'张',min:0,max:aheadMax,initial:cache.ahead,onValue:setAhead}));
  }
  Object.assign(exports,{valid,IntervalSheet,CacheSheet,defaults,validCache});
},2183,[55,2,729]);
