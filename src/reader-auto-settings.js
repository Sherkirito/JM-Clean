__d(function(global,require,_i,_a,module,exports,deps){
  // 阅读页的底部面板。整个阅读页只有一个面板窗口：换子页面、展开收起分组时高度都平滑过渡。
  // 面板不加遮罩，改动立即作用在画面上；画面会缩到面板上方，边调边看。
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,Icon=require(deps[3]).default,el=React.createElement;
  const defaults={keep:6,ahead:2},keepMax=100,aheadMax=20;
  const inRange=(n,min,max)=>Number.isInteger(n) && n>=min && n<=max;
  const valid=n=>inRange(n,2,30);
  const validCache=c=>!!c && inRange(c.keep,0,keepMax) && inRange(c.ahead,0,aheadMax);
  const ui={surface:'#1c1c1e',raised:'#2c2c2e',group:'#242426',ink:'#f2f2f2',muted:'#9b9b9f',line:'#3a3a3c',accent:colors.secondary};
  const ease=RN.Easing.out(RN.Easing.cubic),PAD=8,MOVE=220;
  // 分组展开收起时，提前告诉面板最终高度会变多少，画面缩放和面板展开同时进行。
  const Expect=React.createContext(null);

  // 面板外壳。onInset 报告面板最终占用的高度。
  function Sheet({page,onBack,onClose,onInset,children}){
    const height=React.useRef(new RN.Animated.Value(0)).current;
    const fade=React.useRef(new RN.Animated.Value(1)).current;
    const box=React.useRef({page,natural:0,sent:-1,timer:0,burst:false,base:0,delta:0}).current;
    const [moving,setMoving]=React.useState(false);
    box.onInset=onInset;
    const report=h=>{
      const v=Math.round(h);
      if(v<=0 || Math.abs(v-box.sent)<1)return;
      box.sent=v;if(box.onInset)box.onInset(v);
    };
    // 换子页面：先把容器固定在旧高度，新内容量出高度后再过渡过去。
    if(box.page!==page){
      box.page=page;
      if(box.natural>0){
        if(!moving)height.setValue(box.natural-PAD);
        fade.setValue(0);
        if(!moving)setMoving(true);
      }
    }
    React.useEffect(()=>()=>clearTimeout(box.timer),[]);
    const expect=React.useCallback(delta=>{
      if(!box.burst){box.burst=true;box.base=box.natural;box.delta=0;}
      box.delta+=delta;report(box.base+box.delta);
    },[]);
    function onPanel(e){
      if(moving)return;
      box.natural=e.nativeEvent.layout.height;
      clearTimeout(box.timer);
      box.timer=setTimeout(()=>{box.burst=false;report(box.natural);},80);
    }
    function onInner(e){
      if(!moving)return;
      const h=e.nativeEvent.layout.height;
      report(h+PAD);
      RN.Animated.timing(height,{toValue:h,duration:MOVE,easing:ease,useNativeDriver:false}).start(({finished})=>{
        if(finished){box.natural=h+PAD;setMoving(false);}
      });
      RN.Animated.timing(fade,{toValue:1,duration:200,easing:ease,useNativeDriver:true}).start();
    }
    return el(RN.Modal,{visible:true,transparent:true,statusBarTranslucent:true,animationType:'slide',onRequestClose:onBack||onClose},
      el(RN.View,{style:{flex:1,justifyContent:'flex-end'}},
        el(RN.TouchableWithoutFeedback,{accessible:false,onPress:onClose},el(RN.View,{style:RN.StyleSheet.absoluteFill})),
        el(RN.View,{onLayout:onPanel,style:{backgroundColor:ui.surface,borderTopLeftRadius:14,borderTopRightRadius:14,paddingBottom:PAD,elevation:16}},
          el(RN.Animated.View,{style:moving?{height,overflow:'hidden'}:null},
            el(RN.Animated.View,{onLayout:onInner,style:[moving?{position:'absolute',left:0,right:0,top:0}:null,{opacity:fade}]},
              el(Expect.Provider,{value:expect},children))))));
  }
  function Page({title,onBack,onClose,footer,children}){
    return el(RN.View,null,
      el(RN.View,{style:{flexDirection:'row',alignItems:'center',paddingLeft:onBack?4:18,paddingRight:4,minHeight:52}},
        onBack && el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:'返回',onPress:onBack,style:{width:44,height:48,alignItems:'center',justifyContent:'center'}},
          el(Icon,{name:'chevron-left',size:16,color:ui.ink})),
        el(RN.Text,{accessibilityRole:'header',style:{flex:1,color:ui.ink,fontSize:17,fontWeight:'bold'}},title),
        el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:'关闭',onPress:onClose,style:{width:48,height:48,alignItems:'center',justifyContent:'center'}},
          el(Icon,{name:'times',size:17,color:ui.muted}))),
      el(RN.ScrollView,{keyboardShouldPersistTaps:'handled',bounces:false,overScrollMode:'never',
        style:{flexGrow:0,maxHeight:RN.Dimensions.get('window').height*0.68},contentContainerStyle:{paddingHorizontal:16,paddingBottom:6}},children),
      footer||null);
  }
  // 展开收起的分组：高度和透明度一起过渡；内容高度变化（比如合页行数变了）也平滑过渡。
  function Reveal({open,children}){
    const expect=React.useContext(Expect);
    const height=React.useRef(new RN.Animated.Value(0)).current;
    const fade=React.useRef(new RN.Animated.Value(open?1:0)).current;
    const st=React.useRef({open,target:0,measured:null,first:true}).current;
    const [mode,setMode]=React.useState(open?'flow':'gone');
    // 收起时等高度过渡走完再卸载内容，不然剩下的那截高度会一下子消失。
    const grow=to=>RN.Animated.timing(height,{toValue:to,duration:MOVE,easing:ease,useNativeDriver:false}).start(({finished})=>{
      if(finished && !st.open && to===0)setMode('gone');
    });
    React.useEffect(()=>{
      if(st.first){st.first=false;return;}
      st.open=open;
      if(open){
        if(mode==='gone')setMode('measure');
        else if(st.measured!=null){if(expect)expect(st.measured-st.target);st.target=st.measured;grow(st.measured);}
      }else{
        if(mode==='flow'){height.setValue(st.target);setMode('measure');}
        if(expect)expect(-st.target);st.target=0;grow(0);
      }
      RN.Animated.timing(fade,{toValue:open?1:0,duration:open?MOVE:150,easing:ease,useNativeDriver:true}).start();
    },[open]);
    function onLayout(e){
      const h=Math.round(e.nativeEvent.layout.height);
      st.measured=h;
      if(mode==='flow'){st.target=h;height.setValue(h);setMode('measure');return;}
      if(!st.open || h===st.target)return;
      if(expect)expect(h-st.target);
      st.target=h;grow(h);
    }
    if(mode==='gone')return null;
    const measure=mode==='measure';
    return el(RN.Animated.View,{style:measure?{height,overflow:'hidden'}:null},
      el(RN.Animated.View,{onLayout,style:[measure?{position:'absolute',left:0,right:0,top:0}:null,{opacity:fade}]},children));
  }
  function Field({label,children}){
    return el(RN.View,{style:{flexDirection:'row',alignItems:'center',minHeight:54}},
      el(RN.Text,{numberOfLines:1,style:{width:76,color:ui.ink,fontSize:14,fontWeight:'600'}},label),
      el(RN.View,{style:{flex:1}},children));
  }
  // 分段选择：选中块滑动过去；选中块里叠一层深色文字随它一起裁切，滑动途中文字颜色始终正确。
  function Segmented({items,value,onChange,disabled,small}){
    const [width,setWidth]=React.useState(0);
    const x=React.useRef(new RN.Animated.Value(0)).current;
    const back=React.useRef(RN.Animated.multiply(x,-1)).current;
    const placed=React.useRef(false);
    const index=items.findIndex(item=>item[0]===value),seg=width>6?(width-6)/items.length:0;
    React.useEffect(()=>{
      if(!seg || index<0)return;
      if(!placed.current){placed.current=true;x.setValue(index*seg);return;}
      RN.Animated.timing(x,{toValue:index*seg,duration:MOVE,easing:ease,useNativeDriver:true}).start();
    },[index,seg]);
    const text=(label,dark,dim)=>el(RN.Text,{numberOfLines:1,style:{color:dark?'#1a1a1a':ui.ink,fontSize:small?13:14,fontWeight:'600',opacity:dim?0.35:1}},label);
    return el(RN.View,{onLayout:e=>setWidth(e.nativeEvent.layout.width),
      style:{flexDirection:'row',backgroundColor:ui.raised,borderRadius:10,padding:3,opacity:disabled?0.45:1}},
      items.map(([key,label,off])=>{
        const selected=key===value,blocked=disabled||off,still=selected && !seg;
        // 宽度量出来之前先用静态底色标出选中项，打开面板时不会闪一下。
        return el(RN.TouchableOpacity,{key:String(key),accessibilityRole:'button',accessibilityLabel:label,accessibilityState:{selected,disabled:!!blocked},
          disabled:!!blocked,activeOpacity:0.6,onPress:()=>!selected && onChange(key),
          style:{flex:1,minHeight:40,alignItems:'center',justifyContent:'center',paddingHorizontal:2,borderRadius:8,backgroundColor:still?ui.accent:'transparent'}},
          text(label,still,off && !disabled));
      }),
      seg>0 && index>=0 && el(RN.Animated.View,{pointerEvents:'none',
        style:{position:'absolute',left:3,top:3,bottom:3,width:seg,borderRadius:8,backgroundColor:ui.accent,overflow:'hidden',transform:[{translateX:x}]}},
        el(RN.Animated.View,{style:{position:'absolute',left:0,top:0,bottom:0,width:seg*items.length,flexDirection:'row',transform:[{translateX:back}]}},
          items.map(([key,label])=>el(RN.View,{key:String(key),style:{width:seg,alignItems:'center',justifyContent:'center',paddingHorizontal:2}},text(label,true,false))))));
  }
  function Row({label,value,onPress}){
    return el(RN.TouchableOpacity,{accessibilityRole:'button',onPress,style:{flexDirection:'row',alignItems:'center',minHeight:50,
      borderTopWidth:RN.StyleSheet.hairlineWidth,borderTopColor:ui.line}},
      el(RN.Text,{style:{color:ui.ink,fontSize:14,fontWeight:'600'}},label),
      el(RN.Text,{numberOfLines:1,style:{flex:1,textAlign:'right',color:ui.muted,fontSize:13,marginHorizontal:8}},value),
      el(Icon,{name:'chevron-right',size:13,color:ui.muted}));
  }

  function layoutOf(mode){return mode==='vertical'?'strip':mode.indexOf('spread')===0?'spread':'single';}
  function modeOf(layout,rtl){return layout==='strip'?'vertical':layout==='single'?(rtl?'rtl':'horizontal'):(rtl?'spread-rtl':'spread-ltr');}
  function Settings({mode,background,cache,source,pairing,onMode,onBackground,onCache,onSource,onClose}){
    const layout=layoutOf(mode),rtl=mode==='rtl'||mode==='spread-rtl';
    return el(Page,{title:'阅读设置',onClose},
      el(Field,{label:'阅读模式'},
        el(Segmented,{value:layout,onChange:next=>onMode(modeOf(next,rtl)),items:[['strip','条漫'],['single','单页'],['spread','双页']]})),
      el(Reveal,{open:layout!=='strip'},
        el(Field,{label:'翻页方向'},
          el(Segmented,{value:rtl,onChange:next=>layout!=='strip' && onMode(modeOf(layout,next)),items:[[false,'从左往右'],[true,'从右往左（日漫）']]}))),
      el(Reveal,{open:layout==='spread' && !!pairing},pairing && el(Pairing,pairing)),
      el(Field,{label:'背景'},
        el(Segmented,{value:background,onChange:onBackground,items:[['black','黑色'],['gray','深灰'],['white','白色']]})),
      el(RN.View,{style:{height:4}}),
      source && el(Row,{label:'图源',value:source,onPress:onSource}),
      el(Row,{label:'图片缓存',value:'已看保留 '+cache.keep+' 张 · 预加载 '+cache.ahead+' 张',onPress:onCache}));
  }
  function Toggle({title,hint,value,disabled,onChange,first}){
    return el(RN.View,{style:[{flexDirection:'row',alignItems:'center',minHeight:58,paddingVertical:6},
      first?null:{borderTopWidth:RN.StyleSheet.hairlineWidth,borderTopColor:ui.line}]},
      el(RN.View,{style:{flex:1,marginRight:10}},
        el(RN.Text,{style:{color:disabled?ui.muted:ui.ink,fontSize:14,fontWeight:'600'}},title),
        el(RN.Text,{style:{color:ui.muted,fontSize:12,marginTop:2}},hint)),
      el(RN.Switch,{value,disabled:!!disabled,onValueChange:onChange,accessibilityLabel:title,
        trackColor:{false:ui.line,true:'#8a4a12'},thumbColor:value?ui.accent:'#d0d0d0'}));
  }
  // 双页配对：两页拼错了就错开一页，开关以当前画面为准，开了再关回到原样。
  function Pairing({shift,coverSingle,onShift,onCover}){
    const can=!shift || shift.can!==false,on=can && !!(shift && shift.on);
    return el(RN.View,{style:{marginBottom:6,paddingHorizontal:12,borderRadius:12,backgroundColor:ui.group}},
      el(Toggle,{first:true,title:'错开一页',value:on,disabled:!can,onChange:onShift,
        hint:can?'左右两页拼错了就打开，只改本话':shift && shift.wide?'横版跨页图本身就单独显示':'前后都是跨页图，没有可以配对的页'}),
      el(Toggle,{title:'封面单独显示',value:coverSingle,onChange:onCover,hint:'所有章节默认让第 1 页单独显示'}));
  }

  function Quantity({title,unit,min,max,initial,onValue}){
    const [draft,setDraft]=React.useState(String(initial)),[position,setPosition]=React.useState(initial);
    const parse=text=>/^\d+$/.test(text) && inRange(Number(text),min,max)?Number(text):null;
    function edit(text){
      const digits=String(text).replace(/[０-９]/g,c=>String(c.charCodeAt(0)-65296)),n=parse(digits);
      setDraft(digits);if(n!==null)setPosition(n);onValue(n);
    }
    return el(RN.View,{style:{marginTop:6}},
      title && el(RN.Text,{style:{color:ui.ink,fontSize:14,fontWeight:'600',marginTop:10,marginBottom:4}},title),
      el(RN.View,{style:{flexDirection:'row',alignItems:'center'}},
        el(RN.Slider,{accessibilityLabel:title||'数值',minimumValue:min,maximumValue:max,step:1,value:position,
          minimumTrackTintColor:ui.accent,maximumTrackTintColor:ui.line,thumbTintColor:ui.accent,
          style:{height:44,flex:1,marginRight:8},onValueChange:n=>edit(String(n)),onSlidingComplete:n=>edit(String(n))}),
        el(RN.TextInput,{accessibilityLabel:(title||'数值')+'输入',value:draft,onChangeText:edit,keyboardType:'number-pad',
          selectTextOnFocus:true,returnKeyType:'done',underlineColorAndroid:'transparent',style:{width:58,minHeight:40,paddingVertical:4,
          textAlign:'center',color:ui.ink,fontSize:17,borderRadius:8,backgroundColor:ui.raised}}),
        el(RN.Text,{style:{color:ui.ink,fontSize:14,marginLeft:6,width:16}},unit)),
      el(RN.Text,{style:{color:ui.muted,fontSize:12,marginTop:2}},parse(draft)===null?'请输入 '+min+' 到 '+max+' 之间的整数':min+' 到 '+max+' '+unit));
  }
  function Confirm({label,allowed,onPress}){
    return el(RN.TouchableOpacity,{accessibilityRole:'button',disabled:!allowed,accessibilityState:{disabled:!allowed},onPress,
      style:{marginHorizontal:16,marginTop:6,minHeight:46,borderRadius:23,alignItems:'center',justifyContent:'center',backgroundColor:ui.accent,opacity:allowed?1:0.4}},
      el(RN.Text,{style:{color:'#1a1a1a',fontSize:15,fontWeight:'bold'}},label));
  }
  function Interval({seconds,onStart,onClose}){
    const [value,set]=React.useState(seconds);
    return el(Page,{title:'自动翻页',onClose,footer:el(Confirm,{label:'开始自动翻页',allowed:valid(value),onPress:()=>onStart(value)})},
      el(RN.Text,{style:{color:ui.muted,fontSize:13}},'画面完整显示后开始计时，点画面任意处暂停。'),
      el(Quantity,{title:'间隔',unit:'秒',min:2,max:30,initial:seconds,onValue:set}));
  }
  function Cache({cache,onSave,onBack,onClose}){
    const [keep,setKeep]=React.useState(cache.keep),[ahead,setAhead]=React.useState(cache.ahead);
    return el(Page,{title:'图片缓存',onBack,onClose,footer:el(Confirm,{label:'保存',allowed:validCache({keep,ahead}),onPress:()=>onSave({keep,ahead})})},
      el(RN.Text,{style:{color:ui.muted,fontSize:13}},'只在本话内保留，退出阅读时释放。下一页总会提前准备好。'),
      el(Quantity,{title:'已看图片保留',unit:'张',min:0,max:keepMax,initial:cache.keep,onValue:setKeep}),
      el(Quantity,{title:'向后预加载',unit:'张',min:0,max:aheadMax,initial:cache.ahead,onValue:setAhead}));
  }
  function Source({options,current,onPick,onBack,onClose}){
    return el(Page,{title:'图源',onBack,onClose},
      el(RN.Text,{style:{color:ui.muted,fontSize:13,marginBottom:6}},'图片加载慢或失败时可以换一个，切换后从当前页重新加载。'),
      options.map(([key,label])=>{
        const selected=key===current;
        return el(RN.TouchableOpacity,{key:String(key),accessibilityRole:'button',accessibilityState:{selected},onPress:()=>onPick(key),
          style:{flexDirection:'row',alignItems:'center',minHeight:50,borderTopWidth:RN.StyleSheet.hairlineWidth,borderTopColor:ui.line}},
          el(RN.Text,{style:{flex:1,color:selected?ui.accent:ui.ink,fontSize:15,fontWeight:selected?'bold':'normal'}},label),
          selected && el(Icon,{name:'check',size:15,color:ui.accent}));
      }));
  }
  Object.assign(exports,{valid,validCache,defaults,ui,Sheet,Settings,Interval,Cache,Source});
},2183,[55,2,729,810]);
