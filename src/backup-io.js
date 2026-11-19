__d(function(global,require,_i,_a,module,exports,deps){
  const RN=require(deps[0]),fs=require(deps[1]),backup=require(deps[2]);
  const base='content://com.jiaohua_cleaner.jmbackup/',delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  let running=false;
  async function status(dir){
    const end=Date.now()+30*60*1000;
    let away=false,resumedAt=0;
    while(Date.now()<end){
      if(RN.AppState.currentState==='active'){
        if(await fs.exists(dir+'/result'))return fs.readFile(dir+'/result','utf8');
        if(away && !resumedAt)resumedAt=Date.now();
        if(resumedAt && Date.now()-resumedAt>15000)break;
      }else{away=true;resumedAt=0;}
      await delay(RN.AppState.currentState==='active'?300:1000);
    }
    throw Error('文件选择已中断，请重试');
  }
  function confirm(a){
    const samples=a.f.c.filter(r=>r.length===4).length;
    const users=a.f.u.length+(a.f.a||[]).length;
    const summary='自定义规则 '+a.f.r.length+' 条，预置规则改动 '+Object.keys(a.f.p).length+' 条，手动屏蔽 '+a.f.c.length+' 条（含 '+samples+' 条学习样本），黑名单 '+users+' 人，观看记录 '+a.b.length+' 本。已有规则和页码优先保留。自定义规则最多 100 条，自动拉黑、解除拉黑和单条屏蔽分别保留最近 2000、500 和 500 项。';
    return new Promise(resolve=>RN.Alert.alert('合并备份',summary,[{text:'取消',onPress:()=>resolve(false)},{text:'合并导入',onPress:()=>resolve(true)}],{cancelable:true,onDismiss:()=>resolve(false)}));
  }
  async function transfer(mode){
    if(running)return;
    running=true;
    // Old Android React bridges flush queued native work on an incoming frame.
    // Keep the bridge responsive while this foreground document action is pending.
    const pulse=setInterval(()=>{},200);
    const token=Date.now().toString(36)+Math.random().toString(36).slice(2,12),root=fs.CachesDirectoryPath+'/jm-clean-backups',dir=root+'/'+token;
    try{
      await fs.mkdir(dir);
      // Only inspect the few transfer jobs. The shared cache also holds reader images.
      fs.readDir(root).then(items=>Promise.all(items.filter(item=>/^[a-z0-9]{8,48}$/.test(item.name) &&
        item.name!==token && Date.now()-Number(new Date(item.mtime))>86400000).map(item=>fs.unlink(item.path).catch(()=>{})))).catch(()=>{});
      if(mode==='export')await fs.writeFile(dir+'/payload',await backup.create(),'utf8');
      await fs.readFile(base+mode+'/'+token,'utf8');
      const result=await status(dir);
      if(result==='cancel')return;
      if(result!=='ok')throw Error(result);
      if(mode==='export'){RN.Alert.alert('备份已保存','文件保存在你选择的位置。');return;}
      const archive=backup.decode(await fs.readFile(dir+'/payload','utf8'));
      if(await confirm(archive))RN.Alert.alert('备份与恢复',await backup.restore(archive));
    }catch(error){RN.Alert.alert('备份与恢复',String(error.message||'文件操作失败，请重试'));}
    finally{try{await fs.unlink(dir).catch(()=>{});}finally{clearInterval(pulse);running=false;}}
  }
  exports.show=function(){
    RN.Alert.alert('备份与恢复','包含屏蔽规则、学习样本、黑名单和本机观看记录。文件经过压缩，可保存在你选择的位置。',[
      {text:'取消',style:'cancel'},{text:'导入备份',onPress:()=>transfer('import')},{text:'导出备份',onPress:()=>transfer('export')}
    ],{cancelable:true});
  };
},2177,[2,2118,2176]);
