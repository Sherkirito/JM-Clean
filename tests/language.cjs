const assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
// Exercise the actual converter and native component edits assembled from the locked Android shell.
const script=[
  "import sys,zipfile,json,contextlib,io",
  "from pathlib import Path",
  "sys.path.insert(0,sys.argv[1]);import build",
  "with zipfile.ZipFile(build.DEFAULT_BASE) as z,contextlib.redirect_stdout(io.StringIO()):",
  " b=build.make_bundle(z.read('assets/index.android.bundle').decode())",
  "out={}",
  "for chunk in b.split('__d(')[1:]:",
  " m=build.META.search(chunk)",
  " if int(m[1]) in (651,654,2175,164,212,347,397):out[m[1]]='__d('+chunk[:m.end()]",
  "print(json.dumps(out))"
].join('\n');
const source=JSON.parse(execFileSync('python',['-c',script,root],{encoding:'utf8',maxBuffer:512000})),modules={};
for(const id of [654,651,2175]){
  vm.runInNewContext(source[id],{__d(fn,id,deps){const m={exports:{}};fn({},i=>modules[i],null,null,m,m.exports,deps);modules[id]=m.exports;}});
}
const locale=modules[651];
module.exports={locale,readerScript:modules[2175].script};
if(require.main===module){
  for(const [a,b] of [['觀看紀錄','观看记录'],['請先登入','请先登录'],['使用語言','使用语言'],['忘記密碼','忘记密码'],['資料夾設定','文件夹设置'],['個人中心','个人中心'],['簡體中文','简体中文'],['Hi！','你好！'],['OK','确定']])assert.equal(locale.lang(a),b);
  for(const [a,b] of [['閱讀與討論','阅读与讨论'],['搜尋的設定集','搜寻的设定集'],['彼は図書館に行く','彼は図書館に行く'],['https://example.invalid/搜尋/紀錄','https://example.invalid/搜尋/紀錄'],['@測試用戶','@測試用戶']])assert.equal(locale.display(a),b);
  assert.equal(locale.lang('請開啟 https://example.invalid/設定/紀錄'),'请开启 https://example.invalid/設定/紀錄');
  assert.equal(locale.display('我的の漫畫'),'我的の漫画');
  assert.equal(locale.display('私の圖書館に行く'),'私の圖書館に行く');
  const raw='[臺灣]繁體暱稱',nested={type:'icon'},children=['章節',3,[nested,'討論']],p={children,numberOfLines:2};
  const rendered=locale.textProps(p);assert.equal(rendered.children[0],'章节');assert.equal(rendered.children[1],3);assert.equal(rendered.children[2][0],nested);assert.equal(rendered.children[2][1],'讨论');assert.equal(p.children[0],'章節');
  assert.equal(locale.textProps({children:raw,jmVerbatim:true}).children,raw);
  const input={value:raw,defaultValue:raw,placeholder:'搜尋紀錄',accessibilityLabel:'密碼'};const translated=locale.inputProps(input);
  assert.equal(translated.value,raw);assert.equal(translated.defaultValue,raw);assert.equal(translated.placeholder,'搜索记录');assert.equal(translated.accessibilityLabel,'密码');assert.equal(locale.inputProps({...input,placeholder:raw,jmVerbatimPlaceholder:true}).placeholder,raw);
  assert(source[212].includes('.textProps(this.props)'));assert(source[347].includes('.inputProps(s)'));assert(source[164].includes('buttonPositive=r('));assert(source[397].includes('.lang(s)'));
  assert(modules[2175].script().includes('MutationObserver'));assert.equal(modules[2175].script(),modules[2175].script());
  console.log('Passed Simplified Chinese labels, copied text, exact identifiers, native alerts, input and reader integration.');
}

