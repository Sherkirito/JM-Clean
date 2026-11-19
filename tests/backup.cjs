const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {gzipSync, gunzipSync} = require('node:zlib');
const locale = require('./language.cjs').locale;

function app(initial) {
  const values = new Map(initial);
  const store = {
    fail: false,
    getAllKeys: async () => [...values.keys()],
    getItem: async k => values.get(k) ?? null,
    setItem: async (k,v) => { values.set(k,v); },
    multiGet: async keys => keys.map(k => [k,values.get(k) ?? null]),
    multiSet: async pairs => {
      if (store.fail) throw Error('storage write failed');
      for (const [k,v] of pairs) values.set(k,v);
    }
  };
  const mods = {2:{AsyncStorage:store},651:locale,2172:require('../vendor/re2js/re2js.cjs')};
  for (const name of ['comment-presets','comment-learning','comment-filters','history-store','backup-data']) {
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src',name+'.js'),'utf8'), {
      __d(fn,id,deps) { mods[id]={}; fn({},i=>mods[i],null,null,null,mods[id],deps); }
    });
  }
  return {rules:mods[2169], history:mods[2161], backup:mods[2176], store, values};
}

(async () => {
  const legacy = [['jm2clean.history.books',JSON.stringify([{id:'9',chapter:'31',title:'本机',total:30}])],
    ['series_history_9','{"0":[31],"other":42}'],['series_latest_view_9','31'],
    ['jm2clean.history.page.31','6'],['jm2clean.reader.mode','rtl'],['session.test','private']];
  const target = app(legacy), source = app([]);
  for (const client of [target,source]) {
    await client.rules.hide('users',{UID:'600',username:client===target?'本机昵称':'另一昵称'});
    await client.rules.save('keyword',client===target?'资源':'資源');
  }
  await target.rules.deletePreset('trial-address');
  await source.rules.editPreset('trial-address','示例[0-9]+');
  await source.rules.editPreset('novel-group','示例[1-9]+');
  await source.rules.togglePreset('novel-group',false);
  for (let i=0;i<3;i++) await source.rules.hide('comments',{CID:100+i,UID:200+i,content:'星舟接驳：12345678，全-国-高-校-兼-职'});
  await source.rules.save('regex','测试[0-9]+');
  await source.history.open({id:'9',chapter:'42',title:'备份标题',total:12,episode:'2'});
  await source.history.open({id:'10',chapter:'51',title:'新增',total:12,image:'cover.webp'});
  source.history.save('31',1);source.history.save('51',4);
  const compressed = gzipSync(await source.backup.create());
  const archive = target.backup.decode(gunzipSync(compressed).toString());
  const before = await target.backup.create();
  assert(!before.includes('private'));
  const bad = JSON.parse(JSON.stringify(archive));bad.p.push(['31',-1]);
  assert.throws(()=>target.backup.restore(bad));assert.throws(()=>target.backup.decode('oops'));
  target.store.fail=true;await assert.rejects(target.backup.restore(archive));
  assert.equal(await target.backup.create(),before);target.store.fail=false;
  await target.backup.restore(archive);
  const snapshot = await target.backup.create(), result = JSON.parse(snapshot);
  await target.backup.restore(archive);assert.equal(await target.backup.create(),snapshot);
  const after = await app(target.values).backup.create();assert.equal(after,snapshot);
  assert.equal(result.b.length,2);assert.equal(result.b[0][2],'本机');assert.equal(result.b[1][5],'cover.webp');
  assert.deepEqual(result.h.find(r=>r[0]==='9').slice(1,3),[['31','42'],'31']);
  assert.equal(JSON.parse(target.values.get('series_history_9')).other,42);
  assert.equal(Object.fromEntries(result.p)['31'],6);assert.equal(Object.fromEntries(result.p)['51'],4);
  assert.equal(result.m,'rtl');assert.equal(result.f.u[0][1],'本机昵称');assert.equal(result.f.r.length,2);
  assert.equal(result.f.c.length,3);assert.equal(result.f.c[0][3][0][0],'星舟接驳');
  assert.deepEqual(result.f.c[0][3][1],['全国高校兼职','phrase']);
  assert.equal(target.rules.suggestions(target.rules.get().value)[0].count,3);
  assert(target.rules.suggestions(target.rules.get().value).some(x=>x.anchor==='全国高校兼职' && x.authors===3));
  assert.equal(result.f.p['trial-address'].deleted,true);assert.equal(result.f.p['novel-group'].enabled,false);
  assert.equal(result.f.p['novel-group'].pattern,'示例[1-9]+');
  assert.equal(target.values.get('session.test'),'private');
  const paused = app([]);
  await paused.rules.allowLearning(false);
  await paused.backup.restore(archive);
  const pausedArchive = JSON.parse(await paused.backup.create());
  assert.equal(pausedArchive.f.l,false);assert.equal(pausedArchive.f.c[0].length,4);
  assert.equal(paused.rules.suggestions(paused.rules.get().value).length,0);
  const spam = app([]), filters=spam.rules;
  await filters.save('keyword','群聊');
  await filters.save('regex','招揽[0-9]+');
  const item=(UID,content,CID='100')=>({UID,CID,content,username:'同名'});
  const parent=item('31','普通留言','101');
  parent.replys=[item('22','群聊：招攬123'),item('33','普通回复'),item('66','扣扣裙：12345678')];
  const list=[item('22','前面的普通帖'),item('44','只有群聊'),parent,item(null,'招揽123'),item(9007199254740992,'招揽123')];
  assert.equal(filters.visible(list,filters.get()).length,1);
  assert.deepEqual(Array.from(filters.visible(list,filters.get())[0].replys,r=>r.UID),['33']);
  const original=filters.get();
  spam.store.fail=true;
  const oldSet=spam.store.setItem;let writes=0;
  spam.store.setItem=async(k,v)=>{if(spam.store.fail)throw Error('full');writes++;await oldSet(k,v);};
  await assert.rejects(filters.rememberAuthors(list,original));
  assert.equal(filters.get().users.size,0);spam.store.fail=false;
  await Promise.all([filters.rememberAuthors(list,original),filters.rememberAuthors(list,original)]);
  assert.deepEqual(Array.from(filters.get().value.autoUsers),['22','66']);assert.equal(writes,1);
  assert(!spam.values.get('jm2clean.commentFilters.v1').includes('同名'));
  assert.equal(filters.get().users.has('31'),false);assert.equal(filters.get().users.has('44'),false);
  const blacklist=await spam.backup.create(),copy=app([]);
  await copy.backup.restore(copy.backup.decode(blacklist));await copy.backup.restore(copy.backup.decode(blacklist));
  assert.equal(copy.rules.get().users.size,2);
  await filters.remove('users','22');await filters.rememberAuthors(list,original);
  await spam.backup.restore(spam.backup.decode(blacklist));
  assert(!filters.get().users.has('22'));assert(filters.get().released.has('22'));
  const restarted=app(spam.values);await restarted.rules.load();
  assert.equal(restarted.rules.visible([item('22','普通讨论'),item('22','招攬123')],restarted.rules.get()).length,1);
  await restarted.rules.rememberAuthors(list,restarted.rules.get());assert(!restarted.rules.get().users.has('22'));
  await restarted.rules.hide('users',item('22','普通讨论'));assert(restarted.rules.get().users.has('22'));assert(!restarted.rules.get().released.has('22'));
  const learned=app([]);await learned.backup.restore(archive);
  const suggestion=learned.rules.suggestions(learned.rules.get().value)[0];await learned.rules.decide(suggestion.pattern,true);
  await learned.rules.rememberAuthors([item('88','星舟接驳：42345678')],learned.rules.get());assert(learned.rules.get().users.has('88'));
  const bulk=app([]);await bulk.rules.load();
  const beforeRaw=await bulk.backup.create();
  const sample=Array.from({length:1000},(_,i)=>item(String(10000000+(i*1299709)%90000000),'扣扣裙：12345678',String(i+1)));
  await bulk.rules.rememberAuthors(sample.concat(sample),bulk.rules.get());
  const bulkRaw=await bulk.backup.create();
  assert.equal(JSON.parse(bulkRaw).f.a.length,1000);
  const filterKey='jm2clean.commentFilters.v1';
  const older={id:'disguised-group',pattern:'[unclosed'};
  const dirty=app([[filterKey,JSON.stringify({presetChanges:{[older.id]:{pattern:older.pattern}},
    comments:Array.from({length:120},(_,i)=>({id:String(i===0?100:i+1000),label:''})),
    rules:Array.from({length:99},(_,i)=>({id:'k'+i,kind:'keyword',value:'本机'+i}))})],
    ['series_history_9','{bad'],['jm2clean.history.page.31','NaN'],['jm2clean.history.page.42','-1'],
    ['series_history_10','{"0":["51",51],"extra":7}']]);
  const clean=JSON.parse(await dirty.backup.create());
  assert.equal(clean.p.length,0);assert(!clean.h.some(row=>row[0]==='9'));assert(!clean.f.p[older.id].pattern);
  const pair=[item('210','不要错过，扣扣裙 123456789','210'),item('211','大家小心被骗，上面的扣扣裙不要加','211'),
    item('212','小心失效，扣扣裙 123456789','212'),item('213','防骗，扣扣裙 123456789','213')];
  assert.deepEqual(Array.from(dirty.rules.visible(pair,dirty.rules.get()),r=>r.UID),['211']);
  await dirty.rules.rememberAuthors(pair,dirty.rules.get());assert.deepEqual(Array.from(dirty.rules.get().value.autoUsers),['210','212','213']);
  const incoming=JSON.parse(JSON.stringify(archive));
  incoming.h.find(r=>r[0]==='10')[1].push('9007199254740993');
  await dirty.backup.restore(incoming);
  assert.deepEqual(JSON.parse(dirty.values.get('series_history_9'))[0],[42]);
  assert.deepEqual(JSON.parse(dirty.values.get('series_history_10')),{'0':[51,'9007199254740993'],extra:7});
  assert.equal(dirty.values.get('jm2clean.history.page.31'),'1');
  assert.equal(dirty.rules.get().value.rules.length,100);
  assert.equal(dirty.rules.suggestions(dirty.rules.get().value)[0].count,3);
  const atLimit=app([[filterKey,JSON.stringify({comments:Array.from({length:540},(_,i)=>({id:String(i+1),label:'',author:'4',shapes:[{anchor:'星舟接驳',type:'number'}]})),
    released:Array.from({length:510},(_,i)=>String(i+9000))})]]);
  await atLimit.rules.load();
  const trimmed=JSON.parse(atLimit.values.get(filterKey));assert.equal(trimmed.comments[0].id,'41');
  assert.equal(trimmed.comments.filter(c=>c.shapes).length,100);assert.equal(trimmed.released.length,500);
  const many=Array.from({length:2010},(_,i)=>item(String(i+1),'扣扣裙 123456789'));
  await atLimit.rules.rememberAuthors(many,atLimit.rules.get());
  assert.equal(atLimit.rules.get().value.autoUsers.length,2000);assert(!atLimit.rules.get().users.has('10'));
  const stable=atLimit.rules.get();await atLimit.rules.rememberAuthors(many,stable);assert.equal(atLimit.rules.get(),stable);
  await atLimit.backup.restore(incoming);
  const once=await atLimit.backup.create();await atLimit.backup.restore(incoming);assert.equal(await atLimit.backup.create(),once);
  console.log('1,000 distinct synthetic eight-digit UIDs: '+(Buffer.byteLength(bulkRaw)-Buffer.byteLength(beforeRaw))+' extra JSON bytes, '+(gzipSync(bulkRaw).length-gzipSync(beforeRaw).length)+' extra gzip bytes.');
  console.log('Backup passed: gzip, legacy migration, atomic merge, preserved progress, learning, presets and replay.');
})().catch(e=>{console.error(e);process.exitCode=1;});
