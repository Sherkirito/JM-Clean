__d(function (global, require, _i, _a, module, exports, deps) {
  // 阅读页：读取章节、启动 WebView 里的阅读引擎，并负责顶栏、底栏、面板和进度保存。
  const React=require(deps[0]), RN=require(deps[1]), connect=require(deps[2]).connect;
  const api=require(deps[3]), client=require(deps[4]).default, WebView=require(deps[5]).WebView;
  const TopBar=require(deps[6]).default, BottomBar=require(deps[7]).default, keys=require(deps[8]).default || require(deps[8]);
  const history=require(deps[9]), health=require(deps[10]), colors=require(deps[11]).colors;
  const Panel=require(deps[12]).default, feeds=require(deps[13]), presentation=require(deps[14]);
  const sheets=require(deps[15]), local=require(deps[16]), lang=require(deps[17]).lang, settingAction=require(deps[18]).setting;
  const el=React.createElement;
  const MODES=['vertical','horizontal','rtl','spread-ltr','spread-rtl'];
  const pref='jm2clean.reader.mode', autoPref='jm2clean.reader.autoSeconds', cachePref='jm2clean.reader.imageCounts';
  const backgroundPref='jm2clean.reader.background', coverPref='jm2clean.reader.coverSingle';
  const pairKey=id=>'jm2clean.reader.pairs.'+id, oldPairKey=id=>'jm2clean.reader.pairOffset.'+id;
  const backgrounds={black:'#000000',gray:'#2a2a2c',white:'#ffffff'};
  const engine=__READER_LAYOUT__;
  const protect=__READER_PROTECTION__;
  function chapterTitle(item,index){
    const episode=item.sort||item.episode||index+1,name=String(item.name||'').trim();
    return '第 '+episode+' 话'+(name?' '+name:'');
  }
  function sameList(a,b){return a.length===b.length && a.every((v,i)=>v===b[i]);}

  class Reader extends React.Component {
    constructor(props) {
      super(props);
      this.state={chapter:null,error:null,webError:null,source:null,session:0,positioned:false,
        mode:'vertical',page:0,end:0,wide:[],chrome:false,sheet:null,panel:null,
        autoSeconds:8,autoRunning:false,cache:sheets.defaults,background:'black',coverSingle:false,singles:[],shift:null,
        shunt:1,express:'off',needsPassword:false,password:''};
      this.chromeAnim=new RN.Animated.Value(0);
      this.session=0;this.sequence=0;this.web=null;this.active=false;this.autoSerial=0;this.modeSerial=0;
      this.onMessage=this.onMessage.bind(this);
      this.openPanel=name=>{
        if(!this.mounted || this.state.panel || !this.state.chapter || !this.props.navigation.isFocused())return;
        this.pauseAuto();
        if(name==='comments'){
          if(!this.feed)this.feed=feeds.create(this.state.chapter.id);
          this.feed.load('open');
        }
        this.setChrome(false);this.setState({panel:name});
      };
      this.dismissPanel=()=>this.setState({panel:null});
      this.selectChapter=item=>{
        this.dismissPanel();
        if(item && String(item.id)!==String(this.state.chapter.id))this.openChapter(item);
      };
      this.onAction=name=>{
        if(name==='chapters' || name==='comments')return this.openPanel(name);
        if(name==='auto'){if(this.autoActive)this.pauseAuto();else this.openSheet('auto');return;}
        this.openSheet(name);
      };
      // 面板占用的高度交给阅读引擎，把当前画面缩到面板上方。
      this.insetSent=0;
      this.onInset=height=>{
        const value=Math.max(0,Math.round(height||0));
        if(value===this.insetSent || !this.mounted)return;
        this.insetSent=value;this.inject('jm2Pager.setInset('+value+')');
      };
    }
    componentDidMount() {
      this.active=true;
      if(RN.AccessibilityInfo.isReduceMotionEnabled)RN.AccessibilityInfo.isReduceMotionEnabled().then(value=>{
        this.reduceMotion=value;this.inject('jm2Pager.setReduceMotion('+!!value+')');
      }).catch(()=>{});
      this.finish=()=>{history.flush();this.commitBook();if(this.opened)history.notify();};
      this.background=/^(inactive|background)$/.test(RN.AppState.currentState);
      this.onAppState=state=>{
        this.background=state!=='active';
        if(this.background){clearTimeout(this.watch);this.pauseAuto();this.finish();}
        else{history.flush();this.onFocus();}
      };
      RN.AppState.addEventListener('change',this.onAppState);
      this.offBlur=this.props.navigation.addListener('blur',()=>{
        clearTimeout(this.watch);this.pauseAuto();this.finish();
        if(this.feed)this.feed.clearDrafts();
        this.inject('jm2Pager.suspend()');
      });
      this.offFocus=this.props.navigation.addListener('focus',()=>this.onFocus());
      // 返回键先收起目录或评论面板，不直接退出阅读页。
      this.offRemove=this.props.navigation.addListener('beforeRemove',event=>{
        if(!this.state.panel)return;
        if(event && event.preventDefault)event.preventDefault();
        this.dismissPanel();
      });
      RN.AsyncStorage.multiGet([pref,'shunt',autoPref,cachePref,backgroundPref,coverPref]).then(pairs=>{
        if(!this.active)return;
        const value=key=>(pairs.find(p=>p[0]===key)||[])[1];
        let cache;try{cache=JSON.parse(value(cachePref));}catch(_){}
        const seconds=Number(value(autoPref)),background=value(backgroundPref);
        this.setState({mode:MODES.indexOf(value(pref))>=0?value(pref):'vertical',shunt:parseInt(value('shunt'),10)||1,
          autoSeconds:sheets.valid(seconds)?seconds:8,cache:sheets.validCache(cache)?cache:sheets.defaults,
          background:backgrounds[background]?background:'black',coverSingle:value(coverPref)==='1'},()=>this.fetchChapter());
      }).catch(()=>{if(this.active)this.fetchChapter();});
      if(keys && keys.onKeyUpListener)keys.onKeyUpListener(event=>{
        if(!this.active || this.state.panel || this.state.sheet || !this.props.navigation.isFocused())return;
        if(event.keyCode===24 || event.keyCode===25)this.inject('jm2Pager.turn('+(event.keyCode===25?1:-1)+')');
      });
    }
    componentDidUpdate(prev,previousState) {
      if(previousState.sheet && !this.state.sheet)this.onInset(0);
      if(prev.route.params.id!==this.props.route.params.id || prev.route.params.offlineBook!==this.props.route.params.offlineBook)this.fetchChapter();
      else if(prev.account!==this.props.account && this.feed)this.feed.clearDrafts();
      if(this.archive && this.state.source && previousState.session!==this.state.session){
        // 这个 WebView 版本可能在同一次原生更新里先加载页面、后应用 allowFileAccess，挂载后再导航。
        const session=this.state.session;
        requestAnimationFrame(()=>{if(this.active && session===this.session)this.setState({fileReady:session});});
      }
    }
    componentWillUnmount() {
      this.closeLocal();if(this.feed)this.feed.dispose();this.finish();this.offBlur();this.offFocus();if(this.offRemove)this.offRemove();
      RN.AppState.removeEventListener('change',this.onAppState);this.active=false;this.sequence++;
      clearTimeout(this.watch);if(this.scrubFrame)cancelAnimationFrame(this.scrubFrame);if(this.request)this.request.abort();
      if(keys && keys.removeKeyUpListener)keys.removeKeyUpListener();
    }
    inject(code){if(this.web && this.mounted)this.web.injectJavaScript('window.jm2Pager && '+code+';true;');}
    closeLocal(){if(this.archive){local.call('close',this.archive.token).catch(()=>{});this.archive=null;}}
    fetchChapter(password='') {
      this.closeLocal();this.pauseAuto();
      if(this.feed){this.feed.dispose();this.feed=null;}
      this.commitBook();this.entry=null;this.lastSaved=null;this.opened=false;this.openPending=false;this.mounted=false;
      const generation=++this.sequence,params=this.props.route.params;
      this.session++;clearTimeout(this.watch);if(this.request)this.request.abort();
      this.setChrome(false);
      this.setState({chapter:null,error:null,source:null,webError:null,page:0,end:0,wide:[],positioned:false,sheet:null,panel:null,needsPassword:false,password:''});
      this.restartPending=params.restartChapter===String(params.id);
      const saved=Promise.all([
        this.restartPending?Promise.resolve(0):history.position(String(params.id)).catch(()=>null),
        RN.AsyncStorage.multiGet([pairKey(params.id),oldPairKey(params.id)]).then(rows=>{
          let list=null;try{list=JSON.parse(rows[0][1]);}catch(_){}
          if(Array.isArray(list))return list.filter(n=>Number.isInteger(n) && n>=0);
          return rows[1][1]==='1'?[0]:rows[1][1]==='0'?[]:null;
        },()=>null)
      ]);
      if(params.offlineBook){this.openLocal(params,generation,saved,password);return;}
      const failed=reason=>{
        const missing=[404,410].includes(Number(reason && reason.status));
        if(this.active && generation===this.sequence)this.setState({error:missing?this.missingChapter():'章节数据暂时无法读取'});
      };
      this.request=client.fetchGet(api.API_COMBIC_CHAPTER,{id:params.id,skip:''},(reply,route)=>{
        if(!this.active || generation!==this.sequence)return;
        const data=reply && reply.data;
        if(reply && reply.code!=null && Number(reply.code)!==200)return failed({status:reply.code});
        if(!data || (data.id!=null && String(data.id)!==String(params.id)) || !Array.isArray(data.images) || !data.images.length)return failed();
        const series=Array.isArray(data.series)?data.series.filter(item=>item && (typeof item.id==='string' || typeof item.id==='number')):[];
        const chapter=Object.assign({},data,{id:data.id==null?params.id:data.id,series});
        this.chapterHost=route && route.host || global.api_host;
        this.entry=history.info(chapter,params,this.props.album);
        saved.then(([position,singles])=>this.ready(generation,chapter,position,singles));
      },failed);
    }
    async openLocal(params,generation,saved,password){
      try{
        const rows=(await local.refresh()).filter(r=>r.book===String(params.offlineBook)&&local.readable(r)).sort((a,b)=>a.episode-b.episode);
        const row=rows.find(r=>r.id===String(params.id));if(!row)throw Error('本地 ZIP 已移动、删除或尚未下载');
        const [position,singles]=await saved;if(position==null)throw Error('暂时无法读取本机阅读进度');
        if(row.state==='locked' && !password)throw Error('请输入来源提供的 ZIP 密码');
        const archive=await local.open(row.id,password);
        if(!this.active || generation!==this.sequence){local.call('close',archive.token).catch(()=>{});return;}
        this.archive=archive;
        const chapter={offline:true,id:row.id,series_id:row.book,name:row.title||row.name,images:Array(archive.pages).fill(0),
          series:rows.map(c=>({id:c.id,name:c.name,sort:c.episode}))};
        this.entry=history.info(chapter,params,{id:row.book,name:row.title});
        this.ready(generation,chapter,position,singles);
      }catch(e){if(this.active && generation===this.sequence)this.setState({error:e.message||'无法打开本地 ZIP',needsPassword:/密码/.test(e.message||'')});}
    }
    ready(generation,chapter,position,singles){
      if(!this.active || generation!==this.sequence)return;
      if(position==null){this.setState({error:'暂时无法读取本机阅读进度，请重试'});return;}
      this.customPairs=Array.isArray(singles);
      this.setState({chapter,singles:this.customPairs?singles:this.defaultSingles()},()=>this.reload(Math.min(position,chapter.images.length-1)));
    }
    defaultSingles(){return this.state.coverSingle?[0]:[];}
    commitBook(){
      const entry=this.entry;
      if(!entry || !this.opened || this.openPending)return;
      this.openPending=true;
      history.open(entry).catch(()=>{if(this.entry===entry)this.openPending=false;});
    }
    neighbours(chapter){
      const series=chapter && chapter.series || [],index=series.findIndex(row=>row && String(row.id)===String(chapter.id));
      return {prev:index>0?series[index-1]:null,next:index>=0 && index+1<series.length?series[index+1]:null,index,series};
    }
    reload(initial) {
      if(!this.active || !this.state.chapter)return;
      this.pauseAuto();
      const s=this.state,session=++this.session,stamp=String(Math.floor(Date.now()/1000));
      const host=this.chapterHost || global.api_host;
      if(!this.archive && !host){this.setState({webError:'线路尚未就绪'});return;}
      const query={id:this.props.route.params.id,mode:'vertical',page:initial,app_img_shunt:s.shunt,express:s.express,v:global.ad_cache_version || 0};
      const url='https://'+host+'/chapter_view_template?'+Object.keys(query).map(k=>k+'='+encodeURIComponent(query[k])).join('&');
      const around=this.neighbours(s.chapter),title=item=>item?{title:lang(chapterTitle(item,around.series.indexOf(item)))}:null;
      const options={session,count:s.chapter.images.length,mode:s.mode,initial,cache:s.cache,offline:!!this.archive,
        singles:s.singles,defaultSingles:this.defaultSingles(),background:backgrounds[s.background],
        prev:title(around.prev),next:title(around.next),reduceMotion:!!this.reduceMotion};
      this.injected=protect+'\n;('+engine+')('+JSON.stringify(options)+');true;';
      this.mounted=false;this.insetSent=0;this.shiftAnchor=null;this.loadStarted=this.archive?0:Date.now();
      this.watchLoad(session);
      this.setState({source:this.archive?{uri:this.archive.uri}:{uri:url,headers:client.headers(stamp)},session,webError:null,
        page:initial,end:initial,positioned:false,sheet:null,panel:null});
    }
    missingChapter(){return this.props.route.params.fromHistory?'章节已下架或不存在，本机观看记录已保留':'章节已下架或不存在';}
    watchLoad(session){
      clearTimeout(this.watch);
      if(!this.background && this.props.navigation.isFocused() && !this.mounted)
        this.watch=setTimeout(()=>this.failWeb(session,this.archive?'本地图包读取超时':'来源阅读页加载超时'),25000);
    }
    onFocus(){
      if(this.background || !this.active || !this.props.navigation.isFocused())return;
      if(this.state.source && this.state.session===this.session && !this.mounted)this.watchLoad(this.session);
      this.inject('jm2Pager.resume()');
    }
    failWeb(session,text,localFailure) {
      if(!this.active || session!==this.session)return;
      this.pauseAuto();
      this.session++;this.mounted=false;
      if(this.loadStarted && !localFailure)health.record(this.chapterHost,'reader',false,Date.now()-this.loadStarted);
      this.loadStarted=0;clearTimeout(this.watch);this.setChrome(false);this.setState({webError:text,panel:null,sheet:null});
    }
    // 进度：首张画面显示出来以后才写入本机记录。
    saveProgress(page){
      if(!this.entry || !Number.isInteger(page) || page<0 || page>=this.entry.total || !this.opened)return;
      if(page!==this.lastSaved){this.lastSaved=page;history.save(this.entry.chapter,page);}
    }
    onShown(page){
      if(!this.entry)return;
      if(!this.opened){
        this.opened=true;this.commitBook();
        if(this.restartPending){this.restartPending=false;this.props.navigation.setParams({restartChapter:undefined});}
      }
      this.saveProgress(page);
    }
    setChrome(shown){
      if(!!shown===this.state.chrome)return;
      this.setState({chrome:!!shown});
      RN.Animated.timing(this.chromeAnim,{toValue:shown?1:0,duration:this.reduceMotion?0:170,easing:RN.Easing.out(RN.Easing.cubic),useNativeDriver:true}).start();
      this.inject('jm2Pager.setChrome('+!!shown+')');
    }
    openSheet(name){
      if(!this.mounted)return RN.ToastAndroid.show('请等画面加载出来后再调整',RN.ToastAndroid.SHORT);
      this.pauseAuto();this.setChrome(false);this.setState({sheet:name});
    }
    closeSheet(back){this.setState({sheet:back||null});if(!back)this.setChrome(true);}
    openChapter(item){
      if(!item)return;
      this.finish();
      const params=this.props.route.params,episode=item.sort || item.episode;
      this.props.navigation.navigate('Chapter',{id:item.id,episode,offlineBook:params.offlineBook});
    }
    scrub(page,done){
      if(!this.mounted)return;
      this.pauseAuto();this.scrubTarget=page;
      if(done){
        if(this.scrubFrame){cancelAnimationFrame(this.scrubFrame);this.scrubFrame=0;}
        this.inject('jm2Pager.go('+page+')');
      }else if(!this.scrubFrame){
        this.scrubFrame=requestAnimationFrame(()=>{this.scrubFrame=0;this.inject('jm2Pager.go('+this.scrubTarget+')');});
      }
    }
    pauseAuto(){
      if(!this.autoActive)return;
      this.autoActive=false;this.setState({autoRunning:false});
      this.inject('jm2Pager.setAuto(0,'+(++this.autoSerial)+')');
    }
    startAuto(value){
      const seconds=Number(value);
      if(!sheets.valid(seconds) || !this.mounted || !this.props.navigation.isFocused() || RN.AppState.currentState==='background')return;
      this.autoActive=true;this.setState({sheet:null,autoSeconds:seconds,autoRunning:true});
      RN.AsyncStorage.setItem(autoPref,String(seconds)).catch(()=>{});
      this.inject('jm2Pager.setAuto('+seconds+','+(++this.autoSerial)+')');
    }
    changeMode(mode){
      if(MODES.indexOf(mode)<0 || mode===this.state.mode)return;
      this.setState({mode});
      this.inject('jm2Pager.setMode('+JSON.stringify(mode)+','+(++this.modeSerial)+')');
      RN.AsyncStorage.setItem(pref,mode).catch(()=>RN.ToastAndroid.show('阅读方式已应用，本机保存失败',RN.ToastAndroid.SHORT));
    }
    changeBackground(name){
      if(!backgrounds[name])return;
      this.setState({background:name});
      this.inject('jm2Pager.setBackground('+JSON.stringify(backgrounds[name])+')');
      RN.AsyncStorage.setItem(backgroundPref,name).catch(()=>{});
    }
    saveCache(cache){
      if(!sheets.validCache(cache))return;
      this.closeSheet('settings');this.setState({cache});
      this.inject('jm2Pager.setCache('+JSON.stringify(cache)+')');
      RN.AsyncStorage.setItem(cachePref,JSON.stringify(cache)).catch(()=>RN.ToastAndroid.show('本次设置已生效，保存失败',RN.ToastAndroid.SHORT));
    }
    pickSource(key){
      const express=key==='express'?'on':'off',shunt=key==='express'?this.state.shunt:key;
      this.setState({sheet:null});
      if(express===this.state.express && shunt===this.state.shunt)return this.setChrome(true);
      if(key!=='express'){
        RN.AsyncStorage.setItem('shunt',String(key)).catch(()=>{});
        if(this.props.setting)this.props.setting(api.API_APP_SETTING,{app_img_shunt:key},true);
      }
      this.setState({shunt,express},()=>this.reload(this.state.page));
    }
    sourceOptions(){
      const info=this.props.Setting && this.props.Setting.info || {};
      const list=(Array.isArray(info.app_shunts)?info.app_shunts:[]).filter(item=>item && item.key!=null && typeof item.title==='string').map(item=>[item.key,item.title]);
      if(info.is_cn)list.unshift(['express','快速通道']);
      return list;
    }
    // 错开一页：以当前画面里的一页为准切换配对。连续开关时沿用同一页，开了再关能回到原来那一组。
    shiftPairs(){
      const s=this.state,last=this.shiftAnchor;
      const anchor=Number.isInteger(last) && last>=s.page && last<=s.end?last:s.page;
      this.shiftAnchor=anchor;
      this.inject('jm2Pager.pair("shift",'+anchor+')');
    }
    toggleCover(value){
      this.setState({coverSingle:value});
      RN.AsyncStorage.setItem(coverPref,value?'1':'0').catch(()=>{});
      this.inject('jm2Pager.pair("reset",'+this.state.page+','+JSON.stringify(value?[0]:[])+')');
    }
    savePairs(list){
      const chapter=this.state.chapter;if(!chapter)return;
      this.setState({singles:list});
      const key=pairKey(chapter.id);
      const write=sameList(list,this.defaultSingles())?RN.AsyncStorage.multiRemove([key,oldPairKey(chapter.id)]):RN.AsyncStorage.multiSet([[key,JSON.stringify(list)]]);
      write.catch(()=>RN.ToastAndroid.show('合页已应用，本机保存失败',RN.ToastAndroid.SHORT));
    }
    onMessage(event,session) {
      if(!this.active || session!==this.session)return;
      let msg;try{msg=JSON.parse(event.nativeEvent.data);}catch(_){return;}
      if(!msg || typeof msg!=='object' || msg.session!==session)return;
      if(this.archive && (msg.type==='jm2ZipPage'||msg.type==='jm2ZipDrop')){
        const {index,ticket}=msg;
        if(!Number.isInteger(index)||index<0||index>=this.archive.pages||!Number.isSafeInteger(ticket)||ticket<1)return;
        const extract=msg.type==='jm2ZipPage';
        const acknowledge=ok=>{
          if(extract && this.active && session===this.session && this.web)this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.zipPage('+index+','+ticket+','+(ok===true)+');true;');
        };
        local.call(extract?'page':'drop',this.archive.token,session,index,ticket).then(acknowledge,()=>acknowledge(false));
        return;
      }
      switch(msg.type){
        case 'jm2Mounted':
          if(this.mounted)return;
          this.mounted=true;clearTimeout(this.watch);
          if(this.loadStarted)health.record(this.chapterHost,'reader',true,Date.now()-this.loadStarted);
          this.loadStarted=0;this.setState({positioned:true});
          if(this.state.chrome)this.inject('jm2Pager.setChrome(true)');
          if(this.reduceMotion)this.inject('jm2Pager.setReduceMotion(true)');
          return;
        case 'jm2Page':
          if(!Number.isInteger(msg.page))return;
          this.setState(Object.assign({page:msg.page,end:Number.isInteger(msg.end)?msg.end:msg.page,wide:Array.isArray(msg.wide)?msg.wide:[]},
            msg.shift && typeof msg.shift==='object'?{shift:msg.shift}:null));
          this.saveProgress(msg.page);return;
        case 'jm2Shown':return this.onShown(msg.page);
        case 'jm2Menu':
          if(!this.state.sheet && !this.state.panel)this.setChrome(!this.state.chrome);
          return;
        case 'jm2Chapter':{
          const around=this.neighbours(this.state.chapter),item=msg.delta<0?around.prev:around.next;
          if(item)this.openChapter(item);return;
        }
        case 'jm2Pairs':
          if(msg.shift && typeof msg.shift==='object')this.setState({shift:msg.shift});
          if(Array.isArray(msg.singles))this.savePairs(msg.singles);
          return;
        case 'jm2Mode':if(msg.ok && MODES.indexOf(msg.mode)>=0 && msg.mode!==this.state.mode)this.setState({mode:msg.mode});return;
        case 'jm2Auto':
          if(msg.request!==this.autoSerial)return;
          this.autoActive=msg.running===true;this.setState({autoRunning:this.autoActive});
          if(msg.reason==='timeout'||msg.reason==='end')RN.ToastAndroid.show(msg.reason==='end'?'已到本话末页':'图片加载超时，自动翻页已暂停',RN.ToastAndroid.SHORT);
          return;
        case 'jm2ZipError':RN.ToastAndroid.show('本地 ZIP 中的第 '+(msg.index+1)+' 页无法读取',RN.ToastAndroid.SHORT);return;
        case 'jm2Unavailable':return this.failWeb(session,'来源阅读页的格式无法识别，请换一条线路重试');
      }
    }
    // 所有面板共用一个窗口：设置、图源、缓存、自动翻页之间切换时原地过渡，不重新弹出。
    renderSheet(){
      const s=this.state,chapter=s.chapter;
      if(!s.sheet)return null;
      const close=()=>this.closeSheet(),back=()=>this.closeSheet('settings');
      let body=null,onBack=null;
      if(s.sheet==='settings'){
        const options=this.sourceOptions(),current=s.express==='on'?'express':s.shunt;
        const picked=options.find(o=>o[0]===current);
        body=el(sheets.Settings,{mode:s.mode,background:s.background,cache:s.cache,
          source:!chapter.offline && options.length?(picked?picked[1]:'默认'):null,
          pairing:{shift:s.shift,coverSingle:s.coverSingle,onShift:()=>this.shiftPairs(),onCover:v=>this.toggleCover(v)},
          onMode:m=>this.changeMode(m),onBackground:b=>this.changeBackground(b),
          onCache:()=>this.setState({sheet:'cache'}),onSource:()=>this.setState({sheet:'source'}),onClose:close});
      }else if(s.sheet==='auto')body=el(sheets.Interval,{seconds:s.autoSeconds,onClose:close,onStart:v=>this.startAuto(v)});
      else if(s.sheet==='cache'){onBack=back;body=el(sheets.Cache,{cache:s.cache,onBack:back,onClose:close,onSave:c=>this.saveCache(c)});}
      else if(s.sheet==='source'){
        onBack=back;
        body=el(sheets.Source,{options:this.sourceOptions(),current:s.express==='on'?'express':s.shunt,
          onPick:key=>this.pickSource(key),onBack:back,onClose:close});
      }else return null;
      return el(sheets.Sheet,{page:s.sheet,onBack,onClose:close,onInset:this.onInset},body);
    }
    render() {
      const s=this.state,chapter=s.chapter,error=s.error||s.webError;
      const backgroundColor=backgrounds[s.background]||'#000000';
      if(s.needsPassword){
        const color=global.darkMode==='1'?'white':colors.main,surface=presentation.surface();
        return el(RN.View,{style:{flex:1,backgroundColor:surface,justifyContent:'center',paddingHorizontal:24}},
          el(RN.Text,{style:{color,fontSize:16}},error),el(RN.TextInput,{secureTextEntry:true,value:s.password,accessibilityLabel:'ZIP 密码',
            style:{color,minHeight:48},onChangeText:password=>this.setState({password}),onSubmitEditing:()=>s.password && this.fetchChapter(s.password)}),
          el(RN.Button,{title:'打开章节',disabled:!s.password,color:colors.secondary,onPress:()=>this.fetchChapter(s.password)}),
          el(RN.Button,{title:'返回',color:colors.tertiary,onPress:()=>this.props.navigation.goBack()}));
      }
      if(error)return el(presentation.PageStatus,{message:error,actions:[
        ['重试',()=>s.error?this.fetchChapter():this.reload(s.page)],
        s.webError && !this.archive && ['切换线路',()=>{
          const hosts=(global.api_data||{}).Server||[],current=this.chapterHost || global.api_host;
          if(hosts.length)this.chapterHost=hosts[(hosts.indexOf(current)+1)%hosts.length];
          this.reload(s.page);
        }]]});
      const loading=!s.source || !chapter || !s.positioned;
      const waitingForAccess=this.archive && s.fileReady!==s.session;
      const around=chapter?this.neighbours(chapter):{};
      const subtitle=chapter && around.index>=0 && around.series.length>1?chapterTitle(around.series[around.index],around.index):'';
      const range=s.page===s.end?String(s.page+1):(s.page+1)+'-'+(s.end+1);
      const top=this.chromeAnim.interpolate({inputRange:[0,1],outputRange:[-90,0]});
      const bottom=this.chromeAnim.interpolate({inputRange:[0,1],outputRange:[150,0]});
      const pill=this.chromeAnim.interpolate({inputRange:[0,1],outputRange:[1,0]});
      return el(RN.View,{style:{flex:1,backgroundColor}},
        el(RN.StatusBar,{hidden:true,translucent:true,barStyle:'light-content'}),
        s.source && chapter && el(RN.View,{style:{flex:1},pointerEvents:s.positioned?'auto':'none',
          importantForAccessibility:s.panel?'no-hide-descendants':'auto',accessibilityElementsHidden:!!s.panel},
          el(WebView,{key:s.session,ref:view=>{this.web=view;},style:{flex:1,backgroundColor},containerStyle:{backgroundColor},
            source:waitingForAccess?undefined:s.source,cacheMode:this.archive?'LOAD_NO_CACHE':'LOAD_DEFAULT',
            allowFileAccess:!!this.archive,allowFileAccessFromFileURLs:false,allowUniversalAccessFromFileURLs:false,
            originWhitelist:this.archive?['*']:['http://*','https://*'],
            injectedJavaScriptBeforeContentLoaded:waitingForAccess?undefined:this.injected,injectedJavaScript:waitingForAccess?undefined:this.injected,
            onMessage:event=>this.onMessage(event,s.session),onError:()=>this.failWeb(s.session,'阅读页连接失败'),
            onHttpError:event=>{
              const {url,statusCode}=event.nativeEvent,missing=[404,410].includes(Number(statusCode));
              if(url===s.source.uri)this.failWeb(s.session,missing?this.missingChapter():'来源阅读页暂时无法访问',missing);
            },
            onRenderProcessGone:()=>this.failWeb(s.session,'阅读进程已退出，可以重新加载',true),
            onShouldStartLoadWithRequest:req=>req.url==='about:blank'||req.url.split('#')[0]===s.source.uri,
            overScrollMode:'never',textZoom:100,setBuiltInZoomControls:false,setDisplayZoomControls:false,
            setSupportMultipleWindows:false,javaScriptCanOpenWindowsAutomatically:false,allowsFullscreenVideo:false})),
        loading && el(RN.View,{style:[RN.StyleSheet.absoluteFill,{backgroundColor,justifyContent:'center',alignItems:'center'}]},
          el(RN.View,{style:{position:'absolute',top:0,left:0}},el(require(deps[14]).Controls,{ink:s.background==='white'?colors.main:'white'})),
          el(RN.ActivityIndicator,{color:colors.secondary,size:'large'}),
          el(RN.Text,{style:{color:s.background==='white'?'#555':'#9b9b9f',marginTop:14,fontSize:14}},s.page>0?'正在恢复到第 '+(s.page+1)+' 页':'正在加载')),
        !loading && el(RN.Animated.View,{pointerEvents:'none',style:{position:'absolute',bottom:10,alignSelf:'center',opacity:pill,
          backgroundColor:'rgba(0,0,0,0.55)',borderRadius:11,paddingHorizontal:10,paddingVertical:3}},
          el(RN.Text,{style:{color:'#e8e8ea',fontSize:12}},range+' / '+chapter.images.length)),
        !loading && el(RN.Animated.View,{pointerEvents:s.chrome?'box-none':'none',style:{position:'absolute',top:0,left:0,right:0,opacity:this.chromeAnim,transform:[{translateY:top}]}},
          el(TopBar,{data:chapter,title:chapter.name,subtitle})),
        !loading && el(RN.Animated.View,{pointerEvents:s.chrome?'box-none':'none',style:{position:'absolute',bottom:0,left:0,right:0,opacity:this.chromeAnim,transform:[{translateY:bottom}]}},
          el(BottomBar,{key:String(chapter.id),data:chapter,mode:s.mode,count:chapter.images.length,start:s.page,end:s.end,
            prev:around.prev,next:around.next,onChapter:item=>this.openChapter(item),onScrub:(n,done)=>this.scrub(n,done),onTouch:()=>this.pauseAuto(),
            autoRunning:s.autoRunning,autoSeconds:s.autoSeconds,onAction:this.onAction})),
        s.panel && el(Panel,{key:chapter.id+'-'+s.panel,kind:s.panel,chapter,feed:this.feed,navigation:this.props.navigation,
          onDismiss:this.dismissPanel,onSelect:this.selectChapter,reduceMotion:this.reduceMotion}),
        chapter && this.renderSheet());
    }
  }
  Object.defineProperty(exports,'__esModule',{value:true});
  exports.default=connect(state=>({Setting:state.Setting,album:state.Detail && state.Detail.detailList,
    account:state.Member && state.Member.isLogin && (state.Member.memberInfo||{}).username}),{setting:settingAction})(Reader);
},2054,[55,2,410,650,648,1630,2061,2057,2100,2161,2158,729,2168,2165,2180,2183,2184,651,647]);
