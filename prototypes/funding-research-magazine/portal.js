const state={data:null,cards:[],companies:[],investors:[],companyLimit:24,investorLimit:24};
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const escapeHtml=(value="")=>String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
const unique=values=>[...new Set(values.filter(Boolean))];
const dateValue=value=>value?new Date(`${value}T00:00:00`).getTime():0;
const compactNumber=value=>new Intl.NumberFormat("zh-CN",{notation:"compact",maximumFractionDigits:1}).format(value||0);
const plainNumber=value=>new Intl.NumberFormat("zh-CN").format(value||0);

function amountObject(card,key="amountNormalized"){return card.financing?.[key]||{};}
function amountSortValue(card,key="amountNormalized"){
  const amount=amountObject(card,key);
  if(amount.status==="range") return Number(amount.max_value||amount.value||amount.min_value||0);
  return Number(amount.value||amount.min_value||0);
}
function amountCurrency(card,key="amountNormalized"){return amountObject(card,key).currency||"未标注";}
function amountDisplay(card,key="amountNormalized",fallbackKey="amount"){
  const amount=amountObject(card,key);
  const raw=card.financing?.[fallbackKey]||card.financing?.amountOriginal||"金额未披露";
  if(amount.display_zh) return amount.display_zh;
  if(amount.status==="range"&&amount.min_value&&amount.max_value) return `${amount.currency} ${compactNumber(amount.min_value)}—${compactNumber(amount.max_value)}`;
  if(amount.value){
    const prefix=amount.status==="lower_bound"?"≥":amount.status==="approximate"?"≈":"";
    return `${prefix}${amount.currency} ${compactNumber(amount.value)}`;
  }
  return raw;
}
function investorNames(card,limit=3){
  const names=unique((card.financing?.investors||[]).map(item=>item.name));
  if(!names.length) return "投资方未披露";
  const shown=names.slice(0,limit).join("、");
  return names.length>limit?`${shown} 等 ${names.length} 家`:shown;
}
function stableCardSort(a,b){return dateValue(b.financing.announcedAt)-dateValue(a.financing.announcedAt)||a.id.localeCompare(b.id);}
function rankingSort(a,b){return amountSortValue(b)-amountSortValue(a)||dateValue(b.financing.announcedAt)-dateValue(a.financing.announcedAt)||a.id.localeCompare(b.id);}

function buildCompanies(cards){
  const map=new Map();
  cards.forEach(card=>{
    const key=card.company.id||card.company.fullName||card.company.name;
    if(!map.has(key)) map.set(key,{id:key,name:card.company.fullName||card.company.name,displayName:card.company.name||card.company.fullName,website:card.company.website,summary:card.company.summary,headquarters:card.company.headquarters,rounds:[],products:new Set(),categories:new Set(),investors:new Set()});
    const company=map.get(key); company.rounds.push(card);
    card.products.forEach(item=>company.products.add(item));
    if(card.category) company.categories.add(card.category);
    (card.financing.investors||[]).forEach(item=>company.investors.add(item.name));
  });
  return [...map.values()].map(company=>{
    company.rounds.sort(stableCardSort); company.latest=company.rounds[0];
    company.products=[...company.products]; company.categories=[...company.categories]; company.investors=[...company.investors];
    return company;
  });
}

function buildInvestors(cards){
  const map=new Map();
  cards.forEach(card=>(card.financing.investors||[]).forEach(item=>{
    const key=item.id||item.name;
    if(!map.has(key)) map.set(key,{id:key,names:new Map(),rounds:[],companies:new Set(),categories:new Set(),leadCount:0});
    const investor=map.get(key); investor.rounds.push(card); investor.companies.add(card.company.name); if(card.category) investor.categories.add(card.category);
    investor.names.set(item.name,(investor.names.get(item.name)||0)+1);
    if(/领投|lead/i.test(item.role||"")) investor.leadCount+=1;
  }));
  return [...map.values()].map(investor=>{
    investor.name=[...investor.names.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0][0];
    investor.rounds.sort(stableCardSort); investor.latest=investor.rounds[0]; investor.companies=[...investor.companies]; investor.categories=[...investor.categories];
    return investor;
  });
}

function populateFilters(){
  const currencies=unique(state.cards.map(card=>amountCurrency(card))).sort((a,b)=>a==="USD"?-1:b==="USD"?1:a.localeCompare(b));
  $("#ranking-currency").innerHTML=currencies.map(item=>`<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  const categories=unique(state.cards.map(card=>card.category)).sort();
  const rounds=unique(state.cards.map(card=>card.financing.round)).sort();
  ["#ranking-category","#company-category"].forEach(selector=>$(selector).insertAdjacentHTML("beforeend",categories.map(item=>`<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")));
  $("#ranking-round").insertAdjacentHTML("beforeend",rounds.map(item=>`<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join(""));
}

function renderMetrics(){
  const sourceTotal=state.cards.reduce((sum,card)=>sum+(card.sourceCount||0),0);
  $("#metric-events").textContent=plainNumber(state.cards.length);
  $("#metric-companies").textContent=plainNumber(state.companies.length);
  $("#metric-investors").textContent=plainNumber(state.investors.length);
  $("#metric-sources").textContent=plainNumber(sourceTotal);
  $("#hero-note").textContent=`数据更新至 ${state.data.meta.latestDate} · 自动生成 · ${state.data.meta.sourceVersion}`;
  $("#method-version").textContent=state.data.meta.sourceVersion;
  $("#method-date").textContent=state.data.meta.latestDate;
  $("#method-dedup").textContent=`${state.data.meta.duplicateRoundsRemoved} 笔`;
}

function fundingCardMarkup(card,index){return `<article class="funding-card"><button type="button" data-card-id="${escapeHtml(card.id)}"><div class="card-top"><span class="rank-number">${String(index+1).padStart(2,"0")}</span><time class="card-date">${escapeHtml(card.financing.announcedAt)}</time></div><h3>${escapeHtml(card.company.name)}</h3><p class="card-category">${escapeHtml([card.category,card.productForm].filter(Boolean).join(" · "))}</p><strong class="card-amount">${escapeHtml(amountDisplay(card))}</strong><span class="card-round">${escapeHtml(card.financing.round||"轮次未披露")}</span><p class="card-investors">${escapeHtml(investorNames(card))}</p></button></article>`;}

function renderHome(){
  const latest=[...state.cards].sort(stableCardSort).slice(0,6);
  $("#latest-grid").innerHTML=latest.map(fundingCardMarkup).join("");
  const month=state.data.meta.latestDate.slice(0,7);
  const monthly=state.cards.filter(card=>card.financing.announcedAt?.startsWith(month)&&amountCurrency(card)==="USD").sort(rankingSort).slice(0,10);
  $("#monthly-scope").textContent=`${month} · USD`;
  $("#monthly-ranking").innerHTML=monthly.length?monthly.map((card,index)=>`<div class="ranking-row"><span class="rank-number">${String(index+1).padStart(2,"0")}</span><div><strong>${escapeHtml(card.company.name)}</strong><small>${escapeHtml(card.financing.round)} · ${escapeHtml(card.category)}</small></div><b>${escapeHtml(amountDisplay(card))}</b></div>`).join(""):`<p class="result-note">本月暂无美元融资记录</p>`;
  const active=[...state.investors].sort((a,b)=>b.rounds.length-a.rounds.length||b.leadCount-a.leadCount||a.name.localeCompare(b.name)).slice(0,8);
  $("#active-investors").innerHTML=active.map((investor,index)=>`<div class="investor-row"><span class="rank-number">${String(index+1).padStart(2,"0")}</span><div><strong>${escapeHtml(investor.name)}</strong><small>${escapeHtml(investor.categories.slice(0,2).join(" · ")||"赛道未分类")}</small></div><b>${investor.rounds.length} 笔</b></div>`).join("");
  const counts=new Map(); state.cards.forEach(card=>counts.set(card.category,(counts.get(card.category)||0)+1));
  const max=Math.max(...counts.values());
  $("#sector-grid").innerHTML=[...counts.entries()].sort((a,b)=>b[1]-a[1]).map(([name,count])=>`<article class="sector-card"><span>融资事件</span><strong>${count}</strong><p>${escapeHtml(name)} · 占全部 ${((count/state.cards.length)*100).toFixed(1)}%</p><div class="sector-bar"><i style="width:${(count/max)*100}%"></i></div></article>`).join("");
  bindCardButtons($("#latest-grid"));
}

function rankingRows(){
  const currency=$("#ranking-currency").value,category=$("#ranking-category").value,round=$("#ranking-round").value,q=$("#ranking-search").value.trim().toLowerCase(),limit=Number($("#ranking-limit").value);
  return state.cards.filter(card=>amountCurrency(card)===currency&&(!category||card.category===category)&&(!round||card.financing.round===round)&&(!q||[card.company.name,card.company.fullName,card.category,card.productForm,...card.products,...card.financing.investors.map(item=>item.name)].join(" ").toLowerCase().includes(q))).sort(rankingSort).slice(0,limit);
}
function renderRankings(){
  const rows=rankingRows();
  $("#ranking-table-body").innerHTML=rows.map((card,index)=>`<tr data-card-id="${escapeHtml(card.id)}"><td data-label="排名"><span class="table-rank">${String(index+1).padStart(2,"0")}</span></td><td data-label="公司"><span class="table-company">${escapeHtml(card.company.name)}<small>${escapeHtml(card.productForm||"")}</small></span></td><td data-label="融资金额"><span class="table-amount">${escapeHtml(amountDisplay(card))}<small>${escapeHtml(card.financing.disclosureStatus||"")}</small></span></td><td data-label="轮次"><span>${escapeHtml(card.financing.round)}</span></td><td data-label="融资日期"><time>${escapeHtml(card.financing.announcedAt)}</time></td><td data-label="赛道"><span>${escapeHtml(card.category)}</span></td><td data-label="投资机构"><span>${escapeHtml(investorNames(card,2))}</span></td></tr>`).join("")||`<tr><td colspan="7"><div class="error-state">未找到符合当前条件的融资记录</div></td></tr>`;
  $("#ranking-result-note").textContent=`当前显示 ${rows.length} 笔 · ${$("#ranking-currency").value} · 不进行跨币种换算`;
  $$("#ranking-table-body tr[data-card-id]").forEach(row=>row.addEventListener("click",()=>showFunding(row.dataset.cardId)));
}

function companyMatches(company){
  const q=$("#company-search").value.trim().toLowerCase(),category=$("#company-category").value;
  return (!category||company.categories.includes(category))&&(!q||[company.name,company.displayName,company.summary,company.headquarters,...company.products,...company.categories].join(" ").toLowerCase().includes(q));
}
function companySort(a,b){
  const mode=$("#company-sort").value;
  if(mode==="rounds") return b.rounds.length-a.rounds.length||stableCardSort(a.latest,b.latest);
  if(mode==="name") return a.displayName.localeCompare(b.displayName,"zh-CN");
  return stableCardSort(a.latest,b.latest);
}
function renderCompanies(reset=false){
  if(reset) state.companyLimit=24;
  const companies=state.companies.filter(companyMatches).sort(companySort); const visible=companies.slice(0,state.companyLimit);
  $("#company-grid").innerHTML=visible.map(company=>`<article class="entity-card"><button type="button" data-company-id="${escapeHtml(company.id)}"><p class="eyebrow">${escapeHtml(company.categories[0]||"AI company")}</p><h2>${escapeHtml(company.displayName)}</h2><p class="entity-sub">${escapeHtml([company.headquarters,company.products.slice(0,2).join("、")].filter(Boolean).join(" · ")||"公司信息待补充")}</p><div class="entity-metrics"><div><span>融资轮次</span><strong>${company.rounds.length} 笔</strong></div><div><span>最近一轮</span><strong>${escapeHtml(amountDisplay(company.latest))}</strong></div></div><p class="entity-tags">最近融资 ${escapeHtml(company.latest.financing.announcedAt)} · ${escapeHtml(company.latest.financing.round)}</p></button></article>`).join("")||`<div class="error-state">未找到符合当前条件的公司</div>`;
  $("#company-load-more").hidden=visible.length>=companies.length;
  $$("#company-grid [data-company-id]").forEach(button=>button.addEventListener("click",()=>showCompany(button.dataset.companyId)));
}

function investorMatches(investor){const q=$("#investor-search").value.trim().toLowerCase();return !q||[investor.name,...investor.companies,...investor.categories].join(" ").toLowerCase().includes(q);}
function investorSort(a,b){const mode=$("#investor-sort").value;if(mode==="lead") return b.leadCount-a.leadCount||b.rounds.length-a.rounds.length;if(mode==="latest") return stableCardSort(a.latest,b.latest);return b.rounds.length-a.rounds.length||b.leadCount-a.leadCount||a.name.localeCompare(b.name);}
function renderInvestors(reset=false){
  if(reset) state.investorLimit=24;
  const investors=state.investors.filter(investorMatches).sort(investorSort); const visible=investors.slice(0,state.investorLimit);
  $("#investor-grid").innerHTML=visible.map(investor=>`<article class="entity-card"><button type="button" data-investor-id="${escapeHtml(investor.id)}"><p class="eyebrow">Investment institution</p><h2>${escapeHtml(investor.name)}</h2><p class="entity-sub">${escapeHtml(investor.categories.slice(0,2).join(" · ")||"赛道分布待补充")}</p><div class="entity-metrics"><div><span>参与轮次</span><strong>${investor.rounds.length} 笔</strong></div><div><span>领投轮次</span><strong>${investor.leadCount} 笔</strong></div></div><p class="entity-tags">最近出手 ${escapeHtml(investor.latest.financing.announcedAt)} · ${escapeHtml(investor.companies.slice(0,3).join("、"))}</p></button></article>`).join("")||`<div class="error-state">未找到符合当前条件的投资机构</div>`;
  $("#investor-load-more").hidden=visible.length>=investors.length;
  $$("#investor-grid [data-investor-id]").forEach(button=>button.addEventListener("click",()=>showInvestor(button.dataset.investorId)));
}

function renderReports(){
  const date=state.data.meta.latestDate;
  $("#report-archive").innerHTML=[{date,title:"本周 AI 融资周报",type:"周报"},{date:"2026-08-01",title:"2026 年 7 月 AI 融资月报",type:"月报"},{date:"2026-07-27",title:"AI 融资周报 · 07.27",type:"周报"}].map(item=>`<article class="archive-item"><time>${item.date}</time><strong>${item.title}</strong><span>${item.type}</span></article>`).join("");
}

function bindCardButtons(root=document){$$('[data-card-id]',root).forEach(button=>button.addEventListener("click",()=>showFunding(button.dataset.cardId)));}
function openDialog(html){$("#dialog-content").innerHTML=`<div class="dialog-body">${html}</div>`;$("#detail-dialog").showModal();}
function showFunding(id){
  const card=state.cards.find(item=>item.id===id); if(!card) return;
  const investors=(card.financing.investors||[]).map(item=>`<div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.role||"本轮投资方")}</span></div>`).join("")||"<p>投资方未披露</p>";
  openDialog(`<p class="eyebrow">融资事件 · ${escapeHtml(card.financing.announcedAt)}</p><h2>${escapeHtml(card.company.fullName||card.company.name)}</h2><p class="dialog-deck">${escapeHtml(card.company.summary||"")}</p><div class="dialog-highlight"><div><span>本轮融资</span><strong>${escapeHtml(amountDisplay(card))}</strong></div><div><span>轮次</span><strong>${escapeHtml(card.financing.round)}</strong></div><div><span>赛道</span><strong>${escapeHtml(card.category)}</strong></div></div><section class="dialog-section"><h3>产品与公司</h3><p>${escapeHtml(card.products.join("、")||card.productForm)}${card.company.headquarters?` · ${escapeHtml(card.company.headquarters)}`:""}</p></section><section class="dialog-section"><h3>本轮投资机构</h3><div class="dialog-list">${investors}</div></section><section class="dialog-section"><h3>数据来源</h3><p>${card.sourceCount} 个研究来源 · 金额状态 ${escapeHtml(card.financing.disclosureStatus||"已披露")}</p>${card.sourceUrl?`<p><a class="text-link" href="${escapeHtml(card.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看首个研究来源</a></p>`:""}</section>`);
}
function showCompany(id){
  const company=state.companies.find(item=>item.id===id); if(!company) return;
  const history=company.rounds.map(card=>`<div><span>${escapeHtml(card.financing.announcedAt)} · ${escapeHtml(card.financing.round)}</span><strong>${escapeHtml(amountDisplay(card))}</strong></div>`).join("");
  openDialog(`<p class="eyebrow">获投公司 · ${escapeHtml(company.categories.join(" · "))}</p><h2>${escapeHtml(company.displayName)}</h2><p class="dialog-deck">${escapeHtml(company.summary||"")}</p><div class="dialog-highlight"><div><span>融资轮次</span><strong>${company.rounds.length} 笔</strong></div><div><span>最近融资</span><strong>${escapeHtml(company.latest.financing.announcedAt)}</strong></div><div><span>投资机构</span><strong>${company.investors.length} 家</strong></div></div><section class="dialog-section"><h3>产品</h3><p>${escapeHtml(company.products.join("、")||"产品信息未披露")}</p></section><section class="dialog-section"><h3>融资历史</h3><div class="dialog-list">${history}</div></section>`);
}
function showInvestor(id){
  const investor=state.investors.find(item=>item.id===id); if(!investor) return;
  const rounds=investor.rounds.slice(0,15).map(card=>`<div><span>${escapeHtml(card.financing.announcedAt)} · ${escapeHtml(card.company.name)}</span><strong>${escapeHtml(amountDisplay(card))}</strong></div>`).join("");
  openDialog(`<p class="eyebrow">投资机构 · 活跃度数据</p><h2>${escapeHtml(investor.name)}</h2><p class="dialog-deck">机构卡只汇总已核验的本轮投资活动，不评价投资表现。</p><div class="dialog-highlight"><div><span>参与轮次</span><strong>${investor.rounds.length} 笔</strong></div><div><span>领投轮次</span><strong>${investor.leadCount} 笔</strong></div><div><span>已投公司</span><strong>${investor.companies.length} 家</strong></div></div><section class="dialog-section"><h3>主要赛道</h3><p>${escapeHtml(investor.categories.join("、")||"赛道信息未披露")}</p></section><section class="dialog-section"><h3>最近投资活动</h3><div class="dialog-list">${rounds}</div></section>`);
}

function activateView(name,updateHash=true){
  const valid=$( `[data-view="${name}"]` )?name:"home";
  $$(".view").forEach(view=>view.classList.toggle("is-active",view.dataset.view===valid));
  $$('[data-view-target]').forEach(link=>link.classList.toggle("is-active",link.dataset.viewTarget===valid));
  $("#main-nav").classList.remove("is-open");$("#menu-toggle").setAttribute("aria-expanded","false");
  if(updateHash&&location.hash!==`#${valid}`) history.pushState(null,"",`#${valid}`);
  window.scrollTo({top:0,behavior:"auto"});
}
function bindNavigation(){
  $$('[data-view-target]').forEach(link=>link.addEventListener("click",event=>{event.preventDefault();activateView(link.dataset.viewTarget,true);}));
  window.addEventListener("hashchange",()=>activateView(location.hash.slice(1)||"home",false));
  $("#menu-toggle").addEventListener("click",()=>{const open=$("#main-nav").classList.toggle("is-open");$("#menu-toggle").setAttribute("aria-expanded",String(open));});
}
function bindControls(){
  ["#ranking-limit","#ranking-currency","#ranking-category","#ranking-round","#ranking-search"].forEach(selector=>$(selector).addEventListener("input",renderRankings));
  ["#company-search","#company-category","#company-sort"].forEach(selector=>$(selector).addEventListener("input",()=>renderCompanies(true)));
  ["#investor-search","#investor-sort"].forEach(selector=>$(selector).addEventListener("input",()=>renderInvestors(true)));
  $("#company-load-more").addEventListener("click",()=>{state.companyLimit+=24;renderCompanies();});
  $("#investor-load-more").addEventListener("click",()=>{state.investorLimit+=24;renderInvestors();});
  $("#dialog-close").addEventListener("click",()=>$("#detail-dialog").close());
  $("#detail-dialog").addEventListener("click",event=>{if(event.target===$("#detail-dialog")) $("#detail-dialog").close();});
  $$('[data-report]').forEach(button=>button.addEventListener("click",()=>openDialog(`<p class="eyebrow">${button.dataset.report==="weekly"?"Weekly report":"Monthly report"}</p><h2>${button.dataset.report==="weekly"?"最新 AI 融资周报":"最新 AI 融资月报"}</h2><p class="dialog-deck">报告入口已经保留。正式内容将由周期报告流程生成，并引用融资事件、公司和机构数据。</p><section class="dialog-section"><h3>内容结构</h3><p>核心数字、Top 融资、活跃机构、赛道结构、观澜判断与数据来源。</p></section>`)));
}

async function init(){
  bindNavigation(); bindControls();
  try{
    const response=await fetch("data/funding-portal.json"); if(!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data=await response.json(); state.cards=state.data.cards; state.companies=buildCompanies(state.cards); state.investors=buildInvestors(state.cards);
    populateFilters(); renderMetrics(); renderHome(); renderRankings(); renderCompanies(true); renderInvestors(true); renderReports();
    activateView(location.hash.slice(1)||"home",false);$("#loading-screen").classList.add("is-hidden");
  }catch(error){
    $("#loading-screen").innerHTML=`<div class="error-state">融资数据读取失败，请刷新页面。<br><small>${escapeHtml(error.message)}</small></div>`;
  }
}
document.addEventListener("DOMContentLoaded",init);
