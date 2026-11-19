from adinspect import s
from pathlib import Path
import re,zipfile,subprocess
from tempfile import TemporaryDirectory
orig=s.copy()
def change(n,a,b):
 assert s[n+1].count(a)==1,(n,a)
 s[n+1]=s[n+1].replace(a,b)
def skip_element(n,prop,component):
 m=s[n+1]; j=m.index(prop);start=m.rfind(',f[',0,j)+1 if component=='S' else m.rfind(',f[',0,j)+1
 assert start and ('('+component+'[') in m[start:j] and len(m[start:j])<160,(n,m[start:j])
 change(n,m[start:j]+prop,'false&&'+m[start:j]+prop)
# Only the homepage carousel and the advertising child of the floating controls.
skip_element(803,"'imageStyle':",'S')
change(803,'_0x41850b&&','false&&')
# The home bottom strip is also a dedicated ad, independent of the list of comics.
m=s[804]; j=m.rindex("'isCanClose':"); k=m.rfind('&&f[',0,j)
assert '(F[' in m[k:j] and j-k<650
change(803,m[k:j]+"'isCanClose':",'&&false'+m[k:j]+"'isCanClose':")
# Skip advertising artwork and links on the splash age gate, retain original user action and readiness check.
change(717,"function(){var _0x18f2e8=","function(){return;var _0x18f2e8=")
m=s[718]; start=m.index("var _0x314c90=");end=m.index("}}]),_0x50f724;",start)
button="""var screen=this,loading=this.props.Setting.isLoading,el=p.default.createElement;
return el(h.SafeAreaView,{style:[M.AndroidSafeArea,{justifyContent:'center',alignItems:'center'}]},el(h.TouchableOpacity,{style:M.enterButton,disabled:loading,onPress:function(){screen.props.navigation.navigate('Main');}},loading&&el(h.ActivityIndicator,null),el(h.Text,{style:M.enterButtonText},(0,E.lang)(_0x47f558.LawbO))));"""
s[718]=m[:start]+button+m[end:]
# Keep the correct post-ad destination even when several routes lead to the fullscreen component.
cond="var args=this.props.route&&this.props.route.params;if(args&&args.group==='app_splash'&&c.Platform.OS==='android')"
change(2155,"function(){var _0x44033a=","function(){"+cond+"{this.props.navigation.navigate('Splash');return;}var _0x44033a=")
change(2155,"function(){var _0x551345=","function(){"+cond+"{return null;}var _0x551345=")
# Route selector contains a standalone ad view. Keep all the line selection controls.
m=s[2126]; j=m.index("'group':_0x41edb8",m.index("var _0x9e1bbc=")); k=m.rfind(',f[',0,j)+1
assert '(w[' in m[k:j] and j-k<800
change(2125,m[k:j]+"'group':",'false&&'+m[k:j]+"'group':")
assert [i-1 for i,(a,b) in enumerate(zip(orig,s)) if a!=b]==[717,803,2125,2155]
bundle='__d('.join(s).encode()
with TemporaryDirectory() as tmp:
 js=Path(tmp)/'check.js';js.write_bytes(bundle);subprocess.run(['node','--check',str(js)],check=True)
with zipfile.ZipFile('JM2Clean-fixed.apk') as src,zipfile.ZipFile('slots.tmp.apk','w') as dst:
 for i in src.infolist():
  if re.fullmatch(r'META-INF/[^/]+\.(SF|RSA|MF|DSA|EC)',i.filename,re.I):continue
  dst.writestr(i,bundle if i.filename=='assets/index.android.bundle' else src.read(i))
print('Original reader modules verified')
