const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
// Exercise the actual rebuilt router, including the build-time hook.
const extract=`import build,contextlib,io,re,zipfile
with zipfile.ZipFile(build.DEFAULT_BASE) as z,contextlib.redirect_stdout(io.StringIO()):
 s=build.make_bundle(z.read('assets/index.android.bundle').decode())
for x in s.split('__d(')[1:]:
 m=build.META.search(x)
 if m and int(m[1]) in (445,446,447,2179):print('__d('+x[:m.end()])`;
const code=execFileSync('python',['-c',extract],{cwd:root,encoding:'utf8'});
const modules={1:x=>x && x.__esModule?x:{default:x},448:Array.from,58:Object.assign};
vm.runInNewContext(code,{__d(factory,id,deps){const out={};modules[id]=out;factory({},k=>modules[k],null,null,null,out,deps);}});
const router=modules[447].default({});
const names=Array.from(fs.readFileSync(path.join(root,'src/routes.js'),'utf8').matchAll(/name: "([A-Za-z]+)"/g),m=>m[1]);
const cfg={routeNames:names,routeParamList:{},routeGetIdList:{}};
let state=router.getInitialState(cfg);
function dispatch(type,name,params){state=router.getStateForAction(state,{type,payload:{name,params,count:1}},cfg);}
dispatch('REPLACE','Main');
for(const name of names.filter(name=>!['Main','ApiSwitcher'].includes(name))){
  dispatch('NAVIGATE',name,{id:1});dispatch('GO_BACK');
  assert.deepEqual(Array.from(state.routes,r=>r.name),['Main']);
}
dispatch('NAVIGATE','Search',{searchText:'A'});
dispatch('NAVIGATE','Detail',{id:1});
const prior=Array.from(state.routes,r=>r.key);
dispatch('NAVIGATE','Search',{searchText:'B'});dispatch('NAVIGATE','Detail',{id:2});
dispatch('GO_BACK');dispatch('GO_BACK');assert.deepEqual(Array.from(state.routes,r=>r.key),prior);
dispatch('NAVIGATE','Chapter',{id:1});dispatch('NAVIGATE','Chapter',{id:2});dispatch('GO_BACK');
assert.deepEqual(Array.from(state.routes,r=>r.key),prior);
console.log(names.length+' screen registrations and nested stack identity passed.');
