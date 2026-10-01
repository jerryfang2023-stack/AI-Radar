const {buildEntityLibrary}=require('./entity-library.js');
const {getResearchProfiles}=require('./research-profiles.js');
const TYPES=[{id:'companies',name:'公司',icon:'company'},{id:'products',name:'产品',icon:'product'},{id:'investors',name:'投资机构',icon:'investor'},{id:'people',name:'人物库',icon:'person'}];
function directory(state,{type='all',market='china',query='',category='全部赛道',limit=20}={}){
 const library=buildEntityLibrary(state.index.cards.filter(card=>market==='all'||card.marketRegion===market),state.details);
 const profiles=getResearchProfiles();
 const aliases=new Set(profiles.map(p=>p.legacyInvestorKey).filter(Boolean));
 const base=TYPES.flatMap(t=>library[t.id]||[]).filter(e=>!(e.type==='investors'&&aliases.has(e.key))&&(market==='all'||e.markets.includes(market))&&(type==='all'||e.type===type));
 for(const p of getResearchProfiles()) {
   if((market!=='all'&&!p.markets.includes(market))||(type!=='all'&&p.type!==type))continue;
   const existing=base.findIndex(e=>e.type===p.type&&e.key===p.key);
   const row={...p,typeLabel:p.type==='people'?'人物库':'投资机构',subtitle:p.summary,updateLabel:'公开档案',updateTitle:'',latestDate:p.latestDate||'',searchText:p.searchText||p.name.toLowerCase()};
   if(existing>=0)base[existing]={...base[existing],...row};else base.push(row);
 }
 const categories=['全部赛道',...[...new Set(base.flatMap(e=>e.categories||[]))].sort()];
 const activeCategory=categories.includes(category)?category:'全部赛道';
 const keyword=String(query).trim().toLowerCase();
 const filtered=base.filter(e=>(activeCategory==='全部赛道'||e.categories.includes(activeCategory))&&(!keyword||e.searchText.includes(keyword))).sort((a,b)=>b.latestDate.localeCompare(a.latestDate)||a.name.localeCompare(b.name));
 return {items:filtered.slice(0,limit),total:filtered.length,hasMore:filtered.length>limit,categories,category:activeCategory,groups:TYPES.map(t=>({...t,items:filtered.filter(e=>e.type===t.id).slice(0,3)}))};
}
module.exports={TYPES,directory};
