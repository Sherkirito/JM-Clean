__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,el=React.createElement;
  function Progress({mode,count,page,scrub,series,chapter,open,autoRunning,autoSeconds,onAutoPress,onPauseAuto,onCachePress}){
    const rtl=mode==='rtl'||mode==='spread-rtl',step=mode.indexOf('spread')===0?2:1;
    const last=Math.max(0,Math.ceil(count/step)-1),[drag,setDrag]=React.useState(null);
    const current=Math.min(last,Math.floor(page/step)),shown=drag==null?current:drag;
    const from=shown*step+1,to=Math.min(from+step-1,count),range=from===to?String(from):from+'–'+to;
    const index=React.useMemo(()=>series.findIndex(row=>row && String(row.id)===String(chapter)),[series,chapter]);
    function chapterButton(delta,side){
      const item=index>=0 && series[index+delta],name=delta>0?'下一章':'上一章';
      return el(RN.TouchableOpacity,{disabled:!item,accessibilityRole:'button',accessibilityLabel:name,onPress:()=>open(item),style:{minWidth:62,minHeight:44,alignItems:'center',justifyContent:'center',opacity:item?1:.32}},
        el(RN.Text,{style:{color:colors.primary,fontSize:13}},side==='left'?'‹ '+name:name+' ›'));
    }
    const valueToUnit=n=>Math.min(last,Math.max(0,rtl?last-Math.round(n):Math.round(n)));
    return el(RN.View,{style:{backgroundColor:colors.main,paddingTop:9,paddingHorizontal:8}},
      el(RN.View,{style:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:8}},
        el(RN.Text,{style:{flex:1,color:colors.primary,fontSize:14,fontWeight:'600'}},range+' / '+count),
        el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:'图片缓存',onPress:onCachePress,
          style:{minHeight:44,justifyContent:'center',paddingHorizontal:8}},el(RN.Text,{style:{fontSize:14,color:colors.primary}},'图片缓存')),
        el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:autoRunning?'暂停自动翻页':'自动翻页',onPress:onAutoPress,
          style:{minHeight:44,justifyContent:'center',paddingHorizontal:8}},
          el(RN.Text,{style:{fontSize:14,color:autoRunning?colors.secondary:colors.primary}},autoRunning?'暂停 · '+autoSeconds+' 秒':'自动翻页'))),
      el(RN.View,{style:{flexDirection:'row',alignItems:'center'}},chapterButton(rtl?1:-1,'left'),
        el(RN.View,{style:{flex:1,marginHorizontal:2}},el(RN.Slider,{accessibilityLabel:'阅读进度',disabled:last===0,minimumValue:0,maximumValue:Math.max(1,last),value:rtl?last-current:current,step:1,
          minimumTrackTintColor:rtl?colors.tertiary:colors.secondary,maximumTrackTintColor:rtl?colors.secondary:colors.tertiary,thumbTintColor:colors.secondary,
          style:{height:48,width:'100%'},onTouchStart:onPauseAuto,onValueChange:n=>{const unit=valueToUnit(n);setDrag(unit);scrub(unit*step,false);},
          onSlidingComplete:n=>{scrub(valueToUnit(n)*step,true);setDrag(null);}})),
        chapterButton(rtl?-1:1,'right')));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=Progress;
},2163,[55,2,729]);
