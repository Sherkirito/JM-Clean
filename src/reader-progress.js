__d(function(global,require,_i,_a,module,exports,deps){
  // 进度条：拖动时画面跟着跳到对应页，松手停在那里。从右往左阅读时整条反向。
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,Icon=require(deps[3]).default,el=React.createElement;
  function label(start,end){return start===end?String(start+1):(start+1)+'-'+(end+1);}
  function Progress({count,start,end,rtl,prev,next,onChapter,onScrub,onTouch}){
    const [drag,setDrag]=React.useState(null),last=Math.max(1,count-1);
    const shown=drag==null?label(start,end):String(drag+1);
    const toPage=v=>Math.max(0,Math.min(count-1,Math.round(rtl?last-v:v)));
    function chapter(item,icon,name){
      return el(RN.TouchableOpacity,{disabled:!item,accessibilityRole:'button',accessibilityLabel:name,onPress:()=>onChapter(item),
        style:{width:44,height:44,alignItems:'center',justifyContent:'center',opacity:item?1:0.3}},el(Icon,{name:icon,size:15,color:'white'}));
    }
    const left=rtl?chapter(next,'step-backward','下一话'):chapter(prev,'step-backward','上一话');
    const right=rtl?chapter(prev,'step-forward','上一话'):chapter(next,'step-forward','下一话');
    const ends=[el(RN.Text,{key:'a',style:{color:'white',fontSize:13,fontWeight:'bold',minWidth:44,textAlign:'center'}},shown),
      el(RN.Text,{key:'b',style:{color:'#a8a8ad',fontSize:13,minWidth:30,textAlign:'center'}},String(count))];
    return el(RN.View,{style:{flexDirection:'row',alignItems:'center',paddingHorizontal:4,minHeight:48}},
      left,rtl?ends[1]:ends[0],
      el(RN.View,{style:{flex:1}},el(RN.Slider,{accessibilityLabel:'阅读进度',disabled:count<2,minimumValue:0,maximumValue:last,step:1,
        value:rtl?last-start:start,
        minimumTrackTintColor:rtl?'#5a5a5e':colors.secondary,maximumTrackTintColor:rtl?colors.secondary:'#5a5a5e',thumbTintColor:colors.secondary,
        style:{height:44,width:'100%'},onTouchStart:onTouch,
        onValueChange:v=>{const page=toPage(v);setDrag(page);onScrub(page,false);},
        onSlidingComplete:v=>{onScrub(toPage(v),true);setDrag(null);}})),
      rtl?ends[0]:ends[1],right);
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=Progress;
},2163,[55,2,729,810]);
