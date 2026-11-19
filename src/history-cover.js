__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]), RN=require(deps[1]), colors=require(deps[2]).colors, el=React.createElement;
  function candidates(entry,host){
    const base=typeof host==='string' && /^https?:\/\//i.test(host)?host.replace(/\/+$/,''):'';
    const path=typeof entry.image==='string'?entry.image.trim():'';
    const version=entry.update_at==null?'':'?v='+encodeURIComponent(entry.update_at);
    const standard=base && /^\d+$/.test(String(entry.id))?base+'/media/albums/'+entry.id+'_3x4.jpg'+version:'';
    let custom='';
    if(/^https?:\/\//i.test(path))custom=path;
    else if(/^\/\//.test(path))custom='https:'+path;
    else if(base && path && !/^[a-z][a-z\d+.-]*:/i.test(path))custom=base+'/'+path.replace(/^\/+/, '');
    return Array.from(new Set([custom,standard].filter(Boolean)));
  }
  function ImageWithFallback({urls,style}){
    const [index,setIndex]=React.useState(0),uri=urls[index];
    if(uri)return el(RN.Image,{key:uri,style:style,source:{uri},resizeMode:'cover',onError:()=>setIndex(i=>i===index?i+1:i)});
    return el(RN.View,{style:[style,{alignItems:'center',justifyContent:'center',backgroundColor:global.darkMode==='1'?colors.tertiary:colors.primary}]},
      el(RN.Text,{style:{fontSize:12,color:global.darkMode==='1'?colors.primary:colors.tertiary}},'暂无封面'));
  }
  function Cover({item,host,style}){
    const urls=candidates(item,host);
    return el(ImageWithFallback,{key:JSON.stringify(urls),urls,style});
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=Cover;exports.candidates=candidates;
},2164,[55,2,729]);
