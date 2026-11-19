const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),engine=require('../vendor/re2js/re2js.cjs');
function client(storage){
  const mods={2:{AsyncStorage:storage},2172:engine,651:require('./language.cjs').locale};
  for(const name of ['comment-presets','comment-learning','comment-filters']){
    vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),{__d(fn,id,deps){mods[id]={};fn({},i=>mods[i],null,null,null,mods[id],deps);}});
  }
  return mods[2169];
}
const rec=(CID,UID,content,replys)=>({CID,UID,username:'same',content,replys});
async function mixedScriptChecks(){
 const regex='^会员[：:]\\s*[0-9]{3}$';
 const rules=[{id:'old-key',kind:'keyword',value:'资源包'},{id:'old-regex',kind:'regex',value:regex}];
 let raw=JSON.stringify({rules}),writes=0;
 const c=client({getItem:async()=>raw,setItem:async(k,v)=>{raw=v;writes++;}});
 await c.load();
 const list=rows=>c.visible(rows,c.get());
 const shown=text=>list([rec(1,1,text)]).length===1;
 for(const a of ['会','會'])for(const b of ['员','員']){
   assert(!shown(a+'<b>'+b+'</b>：&#49;23'));
   assert(shown(a+b+'：1234'));assert(shown(a+b+'：abc'));
 }
 for(const text of ['资源包','資源包','来领資源包啦','@資源包','https://example.invalid/資源包','かな資源包','資&#28304;包'])assert(!shown(text));
 assert(shown('资源整理教程'));assert(shown('資源整理教程'));
 const replies=[rec(2,8,'会員: 234'),rec(3,9,'會員心得')],parent=rec(8,7,'正常讨论',replies);
 assert.deepEqual(Array.from(list([parent])[0].replys,r=>r.CID),[3]);assert.equal(replies.length,2);
 assert.equal(writes,0);assert.equal(c.get().value.rules[1].value,regex);
 await c.save('keyword','网络资源');
 for(const net of ['网','網'])for(const link of ['络','絡'])for(const asset of ['资','資']){
   const spelling=net+link+asset+'源';
   assert(!shown(spelling));assert(!shown('@'+spelling));assert(!shown('https://example.invalid/'+spelling));
 }
 assert(shown('網絡連接'));assert(shown('资源库'));
 await c.save('regex','^联络[^员]$');assert(shown('聯絡員'));assert(!shown('聯絡人'));
 await c.save('regex','^\\x{8cc7}料$');assert(!shown('資料'));assert(shown('资料'));
 await c.save('regex','^\\Q广告.\\E42$');assert(!shown('廣告.42'));assert(shown('廣告X42'));
 for(const [i,anchor] of ['朔風專線','朔风專线','朔風专線'].entries())await c.hide('comments',rec(20+i,10+i,anchor+'：12345678'));
 let suggestion=c.suggestions(c.get().value)[0];assert.equal(suggestion.anchor,'朔风专线');assert.equal(suggestion.count,3);
 const legacyPattern=suggestion.pattern.replace('朔风专线','朔風專線');
 const saved=JSON.parse(raw);saved.comments[0].shapes[0].anchor='朔風專線';
 saved.rules.push({kind:'regex',learned:true,id:'legacy-suggestion',value:legacyPattern});
 raw=JSON.stringify(saved);
 const old=client({getItem:async()=>raw,setItem:async(k,v)=>{raw=v;}});await old.load();
 assert.equal(old.suggestions(old.get().value).length,0);
 for(const text of ['朔風專線','朔风专线','朔风專線'])assert.equal(old.visible([rec(44,9,text+'：92345678')],old.get()).length,0);
 assert.equal(old.visible([rec(45,9,'舉报：朔风專線：92345678')],old.get()).length,1);
 await old.remove('rules','legacy-suggestion');assert.equal(old.suggestions(old.get().value)[0].count,3);
}
(async()=>{
 await mixedScriptChecks();
 let raw=null,fail=false;const storage={getItem:async()=>raw,setItem:async(k,s)=>{if(fail)throw Error('disk');raw=s;}};
 let c=client(storage);const visible=(rows)=>c.visible(rows,c.get());const row=t=>rec(1,11,t);
 await c.load();
 await c.save('keyword','廣告位');assert.equal(visible([row('购买广告位')]).length,0);await assert.rejects(c.save('keyword','广告位'));await c.remove('rules',c.get().value.rules[0].id);
 await c.save('regex','繁體字');assert.equal(visible([row('繁体字')]).length,1);assert.equal(visible([row('繁體字')]).length,0);await c.remove('rules',c.get().value.rules[0].id);
 const numbers=['扣扣裙：(  壹 !贰 !叁 !肆 !伍 !陆 !柒 !捌!玖 ! )','扣扣裙 壹贰叁 肆伍陆柒 捌玖零','扣扣裙：（ １！２！３！４！５！６！７ ）','扣扣裙：123456789'];
 const safe=['这页广告好多','求推荐一个漫画讨论群','这个作者的 QQ 群还在吗','扣扣裙是谐音吗？','扣扣裙：123','群像戏写得好','微信更新后读到第 123456 页','资源分享，见作者主页','千万别信扣扣裙：12345678','舉報：扣扣裙 12345678 是詐騙','剧情提到了首充返利','官方群：12345678','画师主页 https://example.org','第 123456 话','注册页面打不开','不要加群','这条广告说“扣扣裙：123456789”'];
 assert.equal(visible(numbers.map(row)).length,0);assert.equal(visible(safe.map(row)).length,safe.length);
 const disguised=[
   '完結小說，所有韓漫都有，蔻裙，壹！贰！叁！肆！伍！陆！柒',
   '求求群１🚗２🚗３🚗４🚗５🚗６，有各種各樣熱門的漫',
   '禁漫體驗服新增生肉專區，體驗服地址：カナ',
   '全道罪新扣，叁扒肆酒伍貳扒',
   '扣扣裙：１２３４５６７，剧情的记忆点别掉',
   '扣扣裙 ①❷➂𝟜５6️⃣',
   'カタカナ 無碼生肉地址：예시.테스트/자료 長.按韓文地址複.制去瀏.覽器訪問 アイウ',
   '无码生肉地址：예 시。테 스트/자료 长·按韩文地址'
 ];
 const neighbors=['别信扣扣裙：１２３４５６７','不要加求求群１２３４５６，有各种各样热门的漫',
   '有人知道头像怎么换吗？','完結小說和韓漫合集推薦','体验服地址在哪里反馈？',
   '我推薦這本書 1234567','求求群里的朋友推荐几本漫画','叁扒肆酒是谐音吗？',
   '한국어 번역을 기다리고 있어요','韩语怎么说长按复制？','韩文域名 예시.테스트 是什么意思？',
   '这个生肉地址是出版社的官网吗？','举报：生肉地址 예시.테스트 长按韩文地址，这是骗子',
   '我在学日语和韩语 カタカナ 한글','资源地址：example.invalid，长按韩文地址是什么意思？'];
 assert.equal(visible(disguised.map(row)).length,0);assert.equal(visible(neighbors.map(row)).length,neighbors.length);
 await c.togglePreset('disguised-group',false);assert.equal(visible(numbers.map(row)).length,numbers.length);await c.togglePreset('disguised-group',true);
 await Promise.all([c.save('keyword','bad.word'),c.save('regex','promo[0-9]+')]);assert.equal(visible([rec(1,21,'bAd.<b>wo</b>rd'),rec(2,22,'badXword'),rec(3,23,'pRoMo42')]).length,1);
 await assert.rejects(c.save('regex','['));await assert.rejects(c.save('regex','a*'));await assert.rejects(c.save('keyword','BAD.WORD'));assert.equal(c.plain('<b>广</b>&#x544a;'), '广告');
 const kid=rec('4','51','ok'),sibling=rec(5,52,'ok'),parent=rec(3,50,'ok',[kid,sibling]);const rows=[parent,rec(9,51,'ok')];
 await c.hide('users',kid);assert.equal(visible(rows).length,1);assert.equal(visible(rows)[0].replys[0],sibling);assert.equal(parent.replys.length,2);await c.remove('users','51');
 await c.hide('comments',parent);assert.equal(visible(rows).length,1);await c.remove('comments','3');assert.equal(visible(rows)[0],parent);
 await assert.rejects(c.hide('users',{UID:0}));
 const seeds=[rec('71',1,'星舟接驳：12345678'),rec(72,2,'星舟接驳：22345678'),rec(73,1,'星舟接驳：32345678')],fourth=row('星舟接驳：92345678');
 await c.hide('comments',seeds[0]);await c.hide('comments',seeds[0]);assert.equal(c.suggestions(c.get().value).length,0);
 // 两个账号各一次即可给出建议
 await c.hide('comments',seeds[1]);let suggestion=c.suggestions(c.get().value)[0];assert.equal(suggestion.count,2);assert.equal(suggestion.authors,2);
 await c.hide('comments',seeds[2]);suggestion=c.suggestions(c.get().value)[0];assert.equal(suggestion.count,3);assert.equal(suggestion.authors,2);assert.equal(visible([fourth]).length,1);
 await c.remove('comments','71');assert.equal(c.suggestions(c.get().value)[0].count,2);
 await c.remove('comments','72');assert.equal(c.suggestions(c.get().value).length,0);
 await c.hide('comments',seeds[1]);await c.hide('comments',seeds[0]);assert(!raw.includes('32345678'));
 await c.decide(suggestion.pattern,true);assert.equal(visible([fourth]).length,0);assert.equal(visible([row('举报：星舟接驳：92345678')]).length,1);
 c=client(storage);await c.load();assert.equal(visible([fourth]).length,0);let rule=c.get().value.rules.find(x=>x.learned);await c.remove('rules',rule.id);assert.equal(visible([fourth]).length,1);await c.decide(suggestion.pattern,false);assert.equal(c.suggestions(c.get().value).length,0);
 await c.allowLearning(false);assert(!c.get().value.comments.some(x=>x.shapes));await c.allowLearning(true);
 for(const [index,content] of ['作者主页：https://good.example','作品编号：99999999','举报：星舟接驳：22345678'].entries())await c.hide('comments',rec(80+index,4,content));
 assert(!c.get().value.comments.some(x=>x.shapes && x.shapes.length));
 fail=true;await assert.rejects(c.save('keyword','recover'));assert.equal(visible([row('recover')]).length,1);fail=false;await c.save('keyword','recover');assert.equal(visible([row('recover')]).length,0);
 const sameEdit=c.get().value.rules.find(x=>x.value==='bad.word');await c.save('keyword','newterm',sameEdit.id);assert.equal(visible([row('bad.word')]).length,1);
 const optional=[
   ['resource-invite','全套资源 加群：1234567','全套资源整理好了，读者群里都在讨论剧情'],
   ['gambling-invite','首充返利，请点击 https://example.invalid','看到评论里“投注返利”，请不要点它的开户链接']
 ];
 for(const [id,positive,negative] of optional){
   assert.equal(visible([row(positive)]).length,1);
   await c.togglePreset(id,true);assert.equal(visible([row(positive)]).length,0);assert.equal(visible([row(negative)]).length,1);
   await c.togglePreset(id,false);
 }
 for(const [i,body] of ['云舟快线：https://example.invalid','取票窗口：@sample_account'].entries()){
   for(let n=0;n<3;n++)await c.hide('comments',rec(900+i*10+n,81+n,body));
 }
 assert.equal(c.suggestions(c.get().value).length,2);
 assert(!raw.includes('example.invalid') && !raw.includes('sample_account'));

 // 重复话术：两条真实广告变体，用“拉黑此用户”处理也会留下学习样本
 const ads=[
   '💕全-国-高-校-兼-职，同-城-可-约🈯 👉( 地址：숏.한국/가람성 )👈🈯，长.按韩文地址复.制去浏.览嚣访问就可以视 频 调 教，无 尝 给 ，关系让我把这本追下去了',
   '💕全-国-高-校-兼-职，同-城-可-约🈯 👉( 地址：숏.한국/가람성 )👈🈯，长.按韩文地址复.制去浏.览嚣访问就可以视 频 调 教，无 尝 给 ，最舒服的是配色'
 ];
 const phraseOf=anchor=>c.suggestions(c.get().value).find(x=>x.anchor===anchor);
 await c.hide('users',rec(1001,301,ads[0]));assert(!phraseOf('全国高校兼职'));
 await c.hide('users',rec(1002,302,ads[1]));
 const split=phraseOf('全国高校兼职'),copy=phraseOf('长按韩文地址复制去浏览嚣');
 assert(split && copy);assert.equal(split.authors,2);assert.equal(split.label,'「全国高校兼职」重复话术');
 assert(!phraseOf('关系让我把这本追下去了') && !phraseOf('最舒服的是配色'));
 assert(split.pattern.length<=180 && copy.pattern.length<=180);
 // 学到的话术容忍字间符号，不误伤正常讨论
 await c.decide(split.pattern,true);await c.remove('users','301');await c.remove('users','302');
 for(const text of ['全 - 国·高*校🈯兼职，加我','全国高校兼职了解一下','全國高校兼職'])assert.equal(visible([rec(1100,310,text)]).length,0,text);
 for(const text of ['全国统一的画风，高校篇比兼职篇好看','全国的高校都放假了，兼职也停了','大学兼职经历','举报：全国高校兼职是骗局'])assert.equal(visible([rec(1101,311,text)]).length,1,text);
 // 同一账号需要三次
 for(let n=0;n<2;n++)await c.hide('comments',rec(1200+n,320,'这里有最新的完整合集资源请私聊'));
 assert(!phraseOf('这里有最新的完整合集资源'));
 await c.hide('comments',rec(1202,320,'这里有最新的完整合集资源请私聊'));
 assert.equal(phraseOf('这里有最新的完整合集资源').authors,1);
 // 重新载入后话术样本仍在
 c=client(storage);await c.load();assert(phraseOf('长按韩文地址复制去浏览嚣'));
 assert(c.get().value.comments.some(x=>x.shapes && x.shapes.some(s=>s.type==='phrase')));

 for(const pattern of ['(a+)+b','(ab|a)+b'])assert.equal(c.compile(pattern).matcher('a'.repeat(24000)).find(),false);
 console.log('Passed comment filtering, preserved discussion, persistence, undo, user identity, regex validation, suggestion thresholds and consent.');
})().catch(e=>{console.error(e);process.exitCode=1;});
