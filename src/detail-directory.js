__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),history=require(deps[2]),colors=require(deps[3]).colors;
  const el=React.createElement;
  const styles=RN.StyleSheet.create({
    panel:{flex:1,padding:10},heading:{borderRadius:5,padding:10,borderWidth:.5,borderColor:'#c8c8c8'},
    grid:{flexDirection:'row',paddingTop:10,flexWrap:'wrap',justifyContent:'space-between'},
    chapter:{width:'49%',marginBottom:10},label:{paddingHorizontal:15,paddingVertical:10,borderRadius:3,borderWidth:.8,borderColor:'#c8c8c8'}
  });
  function DetailDirectory({data,navigation,openLocalChapter,showDefault}){
    const series=data.series||[],book=String(Number(data.series_id)>0?data.series_id:data.id),groups=Math.ceil(series.length/10);
    const [group,select]=React.useState(null),[visited,setVisited]=React.useState(new Set());
    React.useEffect(()=>{
      let live=true,revision=0;select(null);setVisited(new Set());
      async function load(){
        const n=++revision;
        try{const value=JSON.parse(await RN.AsyncStorage.getItem('series_history_'+book));
          if(live && revision===n)setVisited(new Set(value && Array.isArray(value[0])?value[0].map(String):[]));
        }catch(_){}
      }
      load();const off=history.subscribe(load);return ()=>{live=false;off();};
    },[book]);
    const active=group===null?(showDefault?groups-1:0):Math.min(group,groups-1);
    const dark=global.darkMode==='1',normal={backgroundColor:dark?colors.backgroundDark:colors.primary,color:dark?colors.textPrimaryDark:'#333'};
    return el(RN.View,{style:{flex:1}},Array.from({length:groups},(_,index)=>{
      const start=10*index,items=series.slice(start,start+10),number=(row,i)=>Number(row.sort||row.episode)||start+i+1;
      const first=number(items[0],0),last=number(items[items.length-1],items.length-1);
      return el(RN.View,{key:index,style:styles.panel},el(RN.TouchableOpacity,{onPress:()=>select(group===index?-1:index)},
        el(RN.Text,{style:[styles.heading,normal,index===active && {backgroundColor:colors.secondary,color:'white',borderColor:colors.secondary}]},
        first===last?'第'+first+'话':'第'+first+'话 ~ 第'+last+'话')),
        index===active && el(RN.View,{style:styles.grid},items.map((item,i)=>{
          const name='第'+number(item,i)+'话  '+(item.name||''),row=item.localRow;
          const state=row && !['ready','locked'].includes(row.state)?require(deps[4]).status(row):'';
          return el(RN.TouchableOpacity,{key:String(item.id),style:styles.chapter,accessibilityRole:'button',accessibilityLabel:name,
            onPress:()=>openLocalChapter?openLocalChapter(item,false):navigation.navigate('Chapter',{id:item.id,episode:number(item,i)})},
            el(RN.Text,{numberOfLines:state?2:1,style:[styles.label,normal,visited.has(String(item.id)) && {color:colors.secondary}]},name+(state?'\n'+state:'')));
        })));
    }));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=DetailDirectory;
},2181,[55,2,2161,729,2184]);
