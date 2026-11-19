__d(function(global,require,_i,_a,module,exports,deps){
  const digit='[0-9零〇一二三四五六七八九幺两兩壹贰貳叁參肆伍陆陸柒捌玖]';
  // A separator between digits is common in group-number solicitations.
  const sep='[\\s!！.,，。·、_\\-]{0,3}', number=digit+'(?:'+sep+digit+'){5,11}';
  const mixedNumber=digit+'(?:[!.,，。·、~～_🚗🚙🚓🍎🍏\\-]{0,4}'+digit+'){5,13}';
  exports.presets=[
    {id:'disguised-group',strict:true,title:'伪装群号引流',hint:'「扣扣裙」等变体后紧跟至少六位号码，可夹空格或标点。',defaultOn:true,
      pattern:'(?:扣扣裙|抠抠裙|摳摳裙|扣扣君羊|[qQ]{2}君羊)\\s*[:：=]?\\s*[(【（]?\\s*'+number},
    {id:'novel-group',title:'小说合集留群号',hint:'同时出现完结小说或韩漫合集、「蔻蔻裙」等群名变体和拆分号码。',defaultOn:true,
      pattern:'(?:完结小说|所有韩漫都有|韩漫合集).{0,24}(?:蔻蔻?裙|扣扣裙|蔻蔻群)[,，:：(（]{0,3}'+mixedNumber},
    {id:'emoji-group',strict:true,title:'表情拆号推广漫画合集',hint:'「求求群」后用小车等表情拆开号码，并接热门漫画或资源招揽。',defaultOn:true,
      pattern:'求求群[:,，(（]{0,3}'+mixedNumber+'.{0,16}(?:各种各样热门|热门漫画|热门的漫|漫画合集|全套资源)'},
    {id:'trial-address',title:'冒用体验服发布资源地址',hint:'要求「禁漫体验服」「新增生肉专区」和「体验服地址」同时出现。普通日文和讨论测试服的留言可以保留。',defaultOn:true,
      pattern:'(?:禁漫|jm)体验服.{0,12}新增.{0,8}生肉专区.{0,36}体验服地址'},
    {id:'korean-domain-copy',strict:true,title:'韩文网址引流',hint:'同时出现资源地址、韩文域名和长按或复制地址的指令。兼容夹在字间的空格、圆点和前后填充的假名。',defaultOn:true,
      pattern:'(?:生肉|资源)地址[:：]?(?:https?://)?[가-힣ㄱ-ㅣᄀ-ᇿa-z0-9-]{1,32}[.。．][가-힣ㄱ-ㅣᄀ-ᇿ]{1,24}.{0,60}(?:长[.·。]?按韩文地址|复[.·。]?制.{0,9}浏[.·。]?览)'},
    {id:'phonetic-contact',strict:true,title:'谐音口令留联系号码',hint:'「全道罪新扣」后连续出现六位以上数字或「扒、酒」等数字谐音。',defaultOn:true,
      pattern:'全道罪新扣[,，:：]{0,2}[0-9一二三四五六七八九零壹贰叁肆伍陆柒捌玖扒酒幺]{6,16}'},
    {id:'resource-invite',title:'资源招揽加群',hint:'同时出现资源招揽、明确的加群指令和群号。可按需开启。',defaultOn:false,
      pattern:'(?:福利合集|全套[资資]源|付[费費][资資]源|[资資]源[领領]取).{0,18}(?:加群|[进進]群|加入[Qq]{2}群)[\\s:：号號码碼(（]{0,6}'+number},
    {id:'gambling-invite',title:'博彩开户引流',hint:'同时出现博彩促销、注册或开户指令，以及推广网址。可按需开启。',defaultOn:false,
      pattern:'(?:首存送|首充返利|开户送彩金|開戶送彩金|投注返利).{0,24}(?:注册|註冊|[开開][户戶]|点[击擊]|點擊).{0,12}https?://[a-z0-9-]+\\.[a-z]{2,}'}
  ];
},2173,[]);
