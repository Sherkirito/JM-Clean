__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),store=require(deps[2]),ui=require(deps[3]),colors=require(deps[4]).colors,lang=require(deps[5]).lang,el=React.createElement;
  function Manager({navigation}){
    const {state,error,retry}=ui.useFilters(),[section,select]=React.useState(0),[kind,setKind]=React.useState('keyword'),[draft,setDraft]=React.useState(''),[editing,setEditing]=React.useState(null),[notice,setNotice]=React.useState(''),[busy,setBusy]=React.useState(false),[expanded,expand]=React.useState('');
    const writing=React.useRef(false),scroll=React.useRef(null);
    const dark=global.darkMode==='1',bg=dark?colors.backgroundDark:'white',ink=dark?colors.textPrimaryDark:colors.main,muted=dark?'#bbb':colors.tertiary,edge=dark?colors.tertiary:colors.primary,accent=colors.secondary;
    const divider={borderBottomWidth:RN.StyleSheet.hairlineWidth,borderBottomColor:edge},line={flexDirection:'row',alignItems:'center'};
    function txt(s,size,color,style,verbatim){return el(RN.Text,{jmVerbatim:verbatim,style:Object.assign({fontSize:size,color},style)},s);}
    function action(title,fn,opts){
      const o=opts||{},value=lang(title);
      return el(RN.TouchableOpacity,{key:o.key,accessibilityRole:o.tab?'tab':'button',accessibilityLabel:o.label||value,accessibilityState:o.tab?{selected:o.active}:undefined,disabled:!!o.disabled,onPress:fn,
        style:{minHeight:44,paddingHorizontal:10,alignItems:'center',justifyContent:'center',flex:o.flex,borderBottomWidth:o.tab?2:0,borderColor:o.active?accent:'transparent',opacity:o.disabled ? 0.45 : 1}},
        txt(value,14,o.color||ink,{fontWeight:o.active?'bold':'normal'}));
    }
    function reset(){setDraft('');setEditing(null);setNotice('');}
    function changeTab(i){reset();expand('');select(i);}
    function run(fn,done){
      if(writing.current)return;writing.current=true;setBusy(true);setNotice('');
      fn().then(()=>{if(done)done();},err=>setNotice(lang(err.message||'保存失败，请重试'))).then(()=>{writing.current=false;setBusy(false);});
    }
    function note(s){return txt(lang(s),13,muted,{paddingHorizontal:14,paddingVertical:10,lineHeight:19});}
    function row(key,title,detail,buttons){
      return el(RN.View,{key,style:[line,divider,{paddingLeft:14,paddingRight:4,minHeight:54}]},
        el(RN.View,{style:{flex:1,paddingVertical:9}},txt(title,15,ink,null,true),detail?txt(detail,12,muted,{lineHeight:17,marginTop:3}):null),buttons);
    }
    function presets(){
      return el(RN.View,null,note('预置规则会保留常见举报和防骗提醒。点规则名可查看匹配条件。'),
        store.presetList(state.value).map(p=>{
          const on=!state.value.disabled.includes(p.id);
          return el(RN.View,{key:p.id,style:divider},el(RN.View,{style:[line,{paddingHorizontal:14}]},
            el(RN.TouchableOpacity,{accessibilityRole:'button',onPress:()=>expand(expanded===p.id?'':p.id),style:{flex:1,paddingVertical:12,paddingRight:10}},txt(lang(p.title),16,ink),
              txt(lang(p.hint),13,muted,{lineHeight:19,marginTop:3}),expanded===p.id && txt(p.pattern,12,muted,{marginTop:6},true)),
            el(RN.Switch,{accessibilityLabel:lang(p.title),disabled:busy,value:on,onValueChange:v=>run(()=>store.togglePreset(p.id,v)),trackColor:{true:accent}})),
            expanded===p.id && el(RN.View,{style:[line,{justifyContent:'flex-end'}]},action('编辑正则',()=>{
              changeTab(1);setKind('regex');setEditing('preset:'+p.id);setDraft(p.pattern);
            }),action('删除预置规则',()=>RN.Alert.alert('删除这条预置规则？',p.title,[{text:'取消'},{text:'删除',onPress:()=>run(()=>store.deletePreset(p.id),()=>expand(''))}]))));
        }),action('新增正则',()=>{changeTab(1);setKind('regex');},{color:accent}));
    }
    function custom(){
      return el(RN.View,null,el(RN.View,{style:[line,{paddingHorizontal:4}]},['keyword','regex'].map((k,i)=>action(i?'正则':'关键词',()=>{reset();setKind(k);},{key:k,tab:true,active:k===kind}))),
        el(RN.View,{style:{paddingHorizontal:14,paddingTop:6}},el(RN.TextInput,{accessibilityLabel:lang('规则内容'),autoCapitalize:'none',autoCorrect:false,maxLength:180,value:draft,onChangeText:s=>{setDraft(s);setNotice('');},placeholder:lang(kind==='regex'?'输入正则表达式':'输入要屏蔽的词'),placeholderTextColor:muted,style:{minHeight:46,color:ink,fontSize:16}})),
        note(kind==='regex'?'简体正则可匹配繁体和繁简混写的评论。支持 RE2 语法，忽略大小写。含繁体字的正则按原文匹配。':'关键词用简体写一次，即可屏蔽简体、繁体和繁简混写的评论与回复。'),
        el(RN.View,{style:[line,divider,{justifyContent:'flex-end'}]},editing && action('取消编辑',reset),action(editing?'保存修改':'添加规则',()=>run(()=>editing && editing.startsWith('preset:')?store.editPreset(editing.slice(7),draft):store.save(kind,draft,editing),()=>{if(editing && editing.startsWith('preset:'))changeTab(0);else reset();}),{color:accent,disabled:busy||!draft.trim()})),
        state.value.rules.filter(r=>r.kind===kind).map(r=>row(r.id,r.value,r.learned?lang('来自手动屏蔽'):'',el(RN.View,{style:line},
          action('编辑',()=>{setDraft(r.value);setEditing(r.id);setNotice('');if(scroll.current)scroll.current.scrollTo({y:0,animated:true});}),action('移除',()=>run(()=>store.remove('rules',r.id),()=>{if(editing===r.id)reset();}),{disabled:busy})))),
        !state.value.rules.some(r=>r.kind===kind) && note(kind==='regex'?'尚无自定义正则':'尚无屏蔽关键词'));
    }
    function suggestions(){
      const v=state.value,items=store.suggestions(v);
      return el(RN.View,null,el(RN.View,{style:[line,divider,{paddingHorizontal:14,minHeight:54}]},txt(lang('从手动屏蔽中学习'),15,ink,{flex:1}),el(RN.Switch,{accessibilityLabel:lang('从手动屏蔽中学习'),value:v.learning!==false,disabled:busy,onValueChange:on=>run(()=>store.allowLearning(on))})),
        note('最近 100 条手动屏蔽中，若至少 3 条来自至少 2 个账号，且重复使用相同短语和号码、账号或网址格式，就会出现建议。启用后可在「自定义」里修改或移除。'),
        v.learning!==false && !items.length && note('尚无待确认的建议'),
        items.map(x=>el(RN.View,{key:x.pattern,style:[divider,{paddingHorizontal:14,paddingTop:10}]},
          txt(x.anchor+' ＋ '+lang(x.title),16,ink,null,true),txt(x.count+lang(' 条手动屏蔽')+' · '+x.authors+lang(' 个账号'),13,muted,{marginVertical:5}),
          expanded===x.pattern && txt(x.pattern,13,muted,null,true),el(RN.View,{style:[line,{justifyContent:'flex-end'}]},
          action('查看正则',()=>expand(expanded===x.pattern?'':x.pattern)),action('忽略',()=>run(()=>store.decide(x.pattern,false)),{disabled:busy}),action('启用',()=>run(()=>store.decide(x.pattern,true)),{color:accent,disabled:busy})))));
    }
    function blocked(){
      const v=state.value;
      const sections=[{key:'auto',title:'正则自动拉黑',data:v.autoUsers},{key:'users',title:'手动拉黑',data:v.users},{key:'comments',title:'手动屏蔽的评论',data:v.comments}];
      return el(RN.SectionList,{sections,initialNumToRender:12,maxToRenderPerBatch:12,windowSize:5,
        keyExtractor:item=>typeof item==='string'?item:item.id,
        ListHeaderComponent:note('正则命中后按账号编号拉黑。仅命中关键词时只隐藏该条留言。解除拉黑后仍过滤该账号的违规留言，可再次手动拉黑。'),
        renderSectionHeader:({section})=>note(section.title+'（'+section.data.length+'）'),
        renderItem:({item,section})=>{
          const auto=section.key==='auto',comment=section.key==='comments',id=auto?item:item.id;
          const title=auto?'ID '+id:item.label||lang(comment?'评论':'用户');
          return row(section.key+id,title,auto?'':(comment?lang('评论')+' #':'ID ')+id,
            action(comment?'恢复':'解除拉黑',()=>run(()=>store.remove(comment?'comments':'users',id)),{disabled:busy}));
        }});
    }
    return el(RN.SafeAreaView,{style:{flex:1,backgroundColor:colors.main,paddingTop:RN.StatusBar.currentHeight||0}},
      el(RN.StatusBar,{translucent:true,barStyle:'light-content',backgroundColor:colors.main}),
      el(RN.View,{style:[line,{paddingHorizontal:4,minHeight:45}]},el(require(deps[7]).Controls,{}),txt(lang('屏蔽管理'),18,'white',{fontWeight:'bold',paddingLeft:6,flex:1}),action('备份与恢复',require(deps[6]).show,{color:'white'})),
      el(RN.View,{style:{flex:1,backgroundColor:bg}},el(RN.View,{style:[line,divider]},['预置规则','自定义','建议','黑名单'].map((t,i)=>action(t,()=>changeTab(i),{key:t,tab:true,active:i===section,flex:1}))),
        !!notice && txt(notice,14,ink,{paddingHorizontal:14,paddingVertical:8}),
        error? action('读取失败，点此重试',retry):!state?el(RN.ActivityIndicator,{color:accent,style:{margin:18}}):
          section===3?blocked():el(RN.ScrollView,{key:section,ref:scroll,keyboardShouldPersistTaps:'handled',contentContainerStyle:{paddingBottom:24}},section===0?presets():section===1?custom():suggestions())));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=Manager;
},2170,[55,2,2169,2171,729,651,2177,2180]);
