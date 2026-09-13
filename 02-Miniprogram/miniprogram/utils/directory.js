const {buildEntityLibrary}=require('./entity-library.js');
const TYPES=[{id:'companies',name:'公司',icon:'company'},{id:'products',name:'产品',icon:'product'},{id:'investors',name:'投资机构',icon:'investor'},{id:'people',name:'人物库',icon:'person'}];
function directory(state,{type='all',market='china',query='',category='全部赛道',limit=20}={}){
 const library=buildEntityLibrary(state.index.cards.filter(card=>card.marketRegion===market),state.details);
 const base=TYPES.flatMap(t=>library[t.id]||[]).filter(e=>e.markets.includes(market)&&(type==='all'||e.type===type));
 const categories=['全部赛道',...[...new Set(base.flatMap(e=>e.categories||[]))].sort()];
 const activeCategory=categories.includes(category)?category:'全部赛道';
 const keyword=String(query).trim().toLowerCase();
 const filtered=base.filter(e=>(activeCategory==='全部赛道'||e.categories.includes(activeCategory))&&(!keyword||e.searchText.includes(keyword))).sort((a,b)=>b.latestDate.localeCompare(a.latestDate)||a.name.localeCompare(b.name));
 return {items:filtered.slice(0,limit),total:filtered.length,hasMore:filtered.length>limit,categories,category:activeCategory,groups:TYPES.map(t=>({...t,items:filtered.filter(e=>e.type===t.id).slice(0,3)}))};
}
module.exports={TYPES,directory};
