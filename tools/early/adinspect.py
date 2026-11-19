import zipfile,re,ast,json
from pathlib import Path
s=zipfile.ZipFile('base.apk').read('assets/index.android.bundle').decode().split('__d(')
def decode(n):
 m=s[n+1]
 p=re.search(r"function (_0x\w+)\(\)\{var \w+=(\[(?:'(?:\\.|[^'\\])*',?)+\])",m)
 arr=ast.literal_eval(p[2])
 off=re.search(r'(_0x\w+)=\1-\(([-+*0-9a-fx]+)\)',m)
 if not off: off=re.search(r'(_0x\w+)=\1-(0x[0-9a-f]+)',m)
 offset=eval(off[2])
 expr=re.search(r'try\{var _0x\w+=(.+?);if\(',m)[1]
 target=re.search(r"\}\}\}\("+p[1]+r',([-+*0-9a-fx]+)\)\);',m)[1]
 def nums(mt):
  st=arr[(int(mt[1],16)-offset+i)%len(arr)]
  return re.match(r'^\d+',st)[0]
 for i in range(len(arr)):
  try: eq=re.sub(r'parseInt\(_0x\w+\((0x\w+)\)\)',nums,expr)
  except TypeError: continue
  if re.fullmatch(r'[()+*0-9a-fx/\-]+',eq) and abs(eval(eq)-eval(target))<0.001:break
 else: raise ValueError(n)
 def sub(mt):
  idx=int(mt[1],16)-offset
  return repr(arr[(idx+i)%len(arr)]) if 0<=idx<len(arr) else mt[0]
 m=m[:p.start()]+m[p.end():]
 m=re.sub(r'_0x\w+\((0x[0-9a-f]+)\)',sub,m)
 while re.search(r"'([\w/]*)'\+'([\w/]*)'",m):m=re.sub(r"'([\w/]*)'\+'([\w/]*)'",r"'\1\2'",m)
 return m
if __name__=='__main__':
 for n in [803,717,1418,1629,2125,2039,2140,2155]:
  try:
   m=decode(n)
   for hit in re.finditer(r"'(?:float_ad|top_banner|splash_top|app_splash|app_bottom|app_float|API_ADVERT\w*|app_top\w*)'",m):print(n,m[max(0,hit.start()-110):hit.end()+150])
  except Exception as e:print(n,repr(e))
