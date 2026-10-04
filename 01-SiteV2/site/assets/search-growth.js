(() => {
  const root = document.querySelector('[data-search-growth]');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const state = {days:30, authenticated:false, csrf:'', epoch:0, readId:0, started:false, importing:false};
  let controller;
  let googleBusy=false,googleTicket=new URL(location.href).searchParams.get('google_connect');
  if(googleTicket){const u=new URL(location.href);u.searchParams.delete('google_connect');history.replaceState(null,'',u.pathname+u.search+u.hash);}
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const n = v => v == null ? '—' : new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2}).format(v);
  const pct = v => v == null ? '—' : `${(v*100).toFixed(1)}%`;
  const stamp = v => v ? new Date(v).toLocaleString('zh-CN',{hour12:false}) : '未记录';
  const labels = {not_connected:'未接入',not_measured:'未评测',no_records:'当前周期暂无记录',available:'已接入',not_verified:'尚未核验'};
  const sources = {google:'Google',bing:'Bing',baidu:'百度',chatgpt:'ChatGPT',perplexity:'Perplexity',copilot:'Copilot',gemini:'Gemini',deepseek:'DeepSeek',doubao:'豆包',kimi:'Kimi',qwen:'Qwen',other:'其他来访',direct:'直接访问',unattributed:'未归因'};
  const metric = (label,value) => `<div class="growth-metric"><span>${esc(label)}</span><strong>${value}</strong></div>`;
  function table(headers,rows) {
    if (!rows.length) return '<p class="growth-note">当前周期暂无记录</p>';
    return `<div class="growth-table-scroll"><table class="growth-table"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function safePageLink(url) {
    try {const u=new URL(url);if(u.protocol==='https:'&&u.hostname==='www.zkdlj.vip'&&!u.username&&!u.password)return `<a href="${esc(u.origin+u.pathname)}" target="_blank" rel="noopener noreferrer">${esc(u.pathname)}</a>`;} catch {}
    return esc(url);
  }
  function renderReports(reports,providers) {
    return reports.filter(r=>providers.includes(r.provider)).map(r=>{
      const m=r.metrics, date=r.dimensions.date;
      const values=r.provider.endsWith('_indexing') ? [['已收录',n(m.indexed)],['未收录',n(m.excluded)]] : r.provider==='bing_ai' ? [['引用次数',n(m.citations)],['被引用页面',n(m.citedPages)]] : r.provider==='google_ai' ? [['AI 搜索展现',n(m.impressions)]] : [['展现',n(m.impressions)],['点击',n(m.clicks)],['点击率',pct(m.ctr)],['平均排名',n(m.position)]];
      const period=date ? `<p class="growth-note">报告周期 ${esc(date.startDate)} — ${esc(date.endDate)}${date.partialWindow?' · 当前周期覆盖不完整':''}<br>${date.source==='google_api'?'Google API 自动同步':'导入于'} ${esc(stamp(date.importedAt))}</p>` : '';
      const detail=['page','query'].filter(d=>r.dimensions[d]).map(d=>{const data=r.dimensions[d],rows=data.rows;
        const metrics=r.provider==='bing_ai'?['citations']:r.provider==='google_ai'?['impressions']:['clicks','impressions'];
        return `<details><summary>${d==='page'?'页面':'关键词'}明细</summary><p class="growth-note">${esc(data.startDate)} — ${esc(data.endDate)} · ${esc(stamp(data.importedAt))}${data.topRowsOnly?'<br>API 返回热门明细，可能省略部分记录':''}</p>${table([d==='page'?'页面':'关键词',...metrics.map(k=>({clicks:'点击',impressions:'展现',citations:'引用次数'})[k])],rows.slice(0,30).map(row=>[row[d],...metrics.map(k=>n(row[k]))]))}</details>`;}).join('');
      const trend=date&&!r.provider.endsWith('_indexing')?(r.provider==='google_search'?`<details><summary>每日展现、点击、点击率及平均排名</summary>${table(['日期','展现','点击','点击率','平均排名'],date.rows.map(row=>[row.date,n(row.impressions),n(row.clicks),pct(row.impressions?row.clicks/row.impressions:null),n(row.position)]))}</details>`:table(['日期',r.provider==='bing_ai'?'引用次数':'展现'],date.rows.slice(-14).map(row=>[row.date,n(row.citations??row.impressions)]))):'';
      return `<article class="growth-card"><h3>${esc(r.label)}</h3><p class="growth-note">${esc(labels[r.status]||r.status)}</p><div class="growth-report-metrics">${values.map(([label,value])=>`<div>${esc(label)}<strong>${value}</strong></div>`).join('')}</div>${period}${detail}${trend}</article>`;
    }).join('');
  }
  function render(data, publication) {
    const t=data.traffic, totals=t.totals||{};
    $('[data-growth-kpis]').innerHTML=metric('搜索会话',n(totals.searchSessions))+metric('AI 来访会话',n(totals.aiSessions))+metric('页面浏览',n(totals.pageViews))+metric('未归因会话',n(totals.unattributedSessions));
    $('[data-growth-channels]').innerHTML=t.status==='not_connected'?'<p class="growth-note">未接入</p>':table(['来源','会话','页面浏览','内容阅读','研究入口点击','社群入口点击'],t.channels.map(r=>[sources[r.source]||r.source,n(r.sessions),n(r.pageViews),n(r.contentViews),n(r.researchCtaSessions),n(r.applicationCtaSessions)]));
    const max=Math.max(1,...t.trend.map(r=>r.sessions));
    $('[data-growth-trend]').innerHTML=t.trend.length?`<div class="growth-chart" role="img" aria-label="每日访问会话趋势">${t.trend.map((r,i)=>`<div class="growth-day" title="${esc(r.date)}：${r.sessions} 会话"><i style="height:${Math.max(2,r.sessions/max*100)}px"></i><span>${i===0||i===t.trend.length-1?esc(r.date.slice(5)):''}</span></div>`).join('')}</div>`:'';
    $('[data-growth-search]').innerHTML=renderReports(data.reports,['google_search','bing_search','baidu_search']);
    renderGoogle(data.googleConnection);
    $('[data-growth-ai-platforms]').innerHTML=renderReports(data.reports,['google_ai','bing_ai']);
    $('[data-growth-evaluations]').innerHTML=table(['平台','状态','已评测回答','网站引用率','事实已核验','核验正确','核验错误'],data.evaluation.engines.map(r=>[r.engine,labels[r.status],n(r.observations),pct(r.citationRate),n(r.accuracyReviewed),n(r.correct),n(r.incorrect)]))+
      data.evaluation.engines.filter(r=>r.citedPages.length).map(r=>`<details><summary>${esc(r.engine)} · 被引用页面 ${r.citedPages.length}</summary><p class="growth-note">最近观察 ${esc(stamp(r.lastObservedAt))}</p>${r.citedPages.map(u=>`<p>${safePageLink(u)}</p>`).join('')}</details>`).join('');
    $('[data-growth-question-count]').textContent=`题库 ${data.evaluation.questions} 题 · 截至 ${data.evaluation.baselineDate}`;
    $('[data-growth-indexing]').innerHTML=renderReports(data.reports,['google_indexing','bing_indexing','baidu_indexing']);
    const h=data.health, current=publication&&h.portalCommit===publication.portalCommit;
    $('[data-growth-health]').innerHTML=h.status==='verified'?`<p class="growth-note">${publication?(current?'已核验当前发布':'核验已过期'):'当前发布暂时无法核对'} · ${esc(stamp(h.verifiedAt))}</p>${table(['检查','结果'],[['公开页面检查',`${n(h.pagesPassed)} / ${n(h.pagesChecked)}`],['模拟爬虫检查',`${n(h.crawlerProbesPassed)} / ${n(h.crawlerProbes)}`],['更新通知',h.indexNowStatus==='accepted'?`通知已接收 · ${n(h.indexNowSubmitted)} 个 URL`:'尚未核验']])}<p class="growth-note">${esc(h.releaseId)}<br>通知时间 ${esc(stamp(h.indexNowAt))}</p>`:'<p class="growth-note">尚未核验</p>';
    $('[data-growth-updated]').textContent=`更新于 ${stamp(data.generatedAt)}`;
    $('[data-growth-content]').hidden=false;
  }
  function status(message,error=false) {const el=$('[data-growth-status]');el.textContent=message;el.classList.toggle('is-error',error);}
  function renderGoogle(data={}) {
    const statuses={not_configured:'未配置',not_connected:'待授权',connected:'已连接',reauthorize:'需重新授权',queued:'等待同步',syncing:'正在同步',failed:'同步失败'};
    $('[data-growth-google-state]').textContent=statuses[data.status]||'未配置';
    $('[data-growth-google-freshness]').textContent=`最近同步：${data.syncedAt?stamp(data.syncedAt):'尚未同步'} · 最新数据日期：${data.latestDataDate||'未记录'}`;
    const connect=$('[data-growth-google=connect]');connect.textContent=data.connected?'重新授权':'连接 Google';connect.disabled=googleBusy||!data.configured;
    for(const action of ['sync','disconnect'])$(`[data-growth-google=${action}]`).disabled=googleBusy||!data.connected||(action==='sync'&&['queued','syncing','reauthorize'].includes(data.status));
    if(data.message)$('[data-growth-google-message]').textContent=data.message;
    else if(!data.configured)$('[data-growth-google-message]').textContent='请先配置 Google OAuth 网页客户端。';
  }
  async function googleAction(action,ticket) {
    if(!state.authenticated||googleBusy)return;
    googleBusy=true;const epoch=state.epoch,current=()=>state.authenticated&&epoch===state.epoch;
    root.querySelectorAll('[data-growth-google]').forEach(b=>b.disabled=true);
    $('[data-growth-google-message]').textContent='正在处理…';
    try {
      const response=await fetch(`/ops/growth-api/google/${action}`,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},body:JSON.stringify(ticket?{ticket}:{})});
      const data=await response.json();if(!current())return;
      if(response.status===401){document.dispatchEvent(new Event('operations:session-expired'));return;}
      if(!response.ok)throw Error(data.error?.message||'操作失败，请重试');
      if(action==='connect'){
        const u=new URL(data.authorizationUrl);
        if(u.origin!=='https://accounts.google.com'||u.pathname!=='/o/oauth2/auth'||u.username||u.password)throw Error('授权链接无效，请重试');
        location.assign(u.href);return;
      }
      $('[data-growth-google-message]').textContent=({finish:'授权已完成，等待首次同步',sync:'已提交同步请求',disconnect:'已断开连接'})[action];
    }catch(error){if(current())$('[data-growth-google-message]').textContent=error.message||'操作失败，请重试';}
    finally{if(current()){googleBusy=false;await load();}}
  }
  async function load() {
    if(!state.authenticated)return;
    state.started=true; const id=++state.readId,epoch=state.epoch;
    controller?.abort();controller=new AbortController();const active=controller;
    const timeout=setTimeout(()=>active.abort(),20000);
    status('正在读取运营数据…');$('[data-growth-content]').hidden=true;
    try {
      const [response,publication]=await Promise.all([fetch(`/ops/growth-api/summary?days=${state.days}`,{credentials:'same-origin',cache:'no-store',signal:active.signal}),fetch('/publication.json',{cache:'no-store',signal:active.signal}).then(r=>r.ok?r.json():null).catch(()=>null)]);
      const data=await response.json();
      if(id!==state.readId||epoch!==state.epoch||!state.authenticated)return;
      if(response.status===401){document.dispatchEvent(new Event('operations:session-expired'));return;}
      if(!response.ok||data.schemaVersion!=='SEARCH-AI-GROWTH-V1'||data.dataSource!=='production')throw Error('invalid data');
      render(data,publication);status('');
    }catch{if(id===state.readId&&epoch===state.epoch&&state.authenticated)status('数据读取失败，请刷新重试。',true);}
    finally{clearTimeout(timeout);}
  }
  // RFC 4180-style CSV: quoted commas, quotes and line breaks are preserved.
  function parseCsv(text) {
    const rows=[];let row=[],value='',quoted=false;
    for(let i=0;i<text.length;i++) {const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else if(!quoted&&value!=='')throw Error('CSV 引号无效');else quoted=!quoted;}else if(!quoted&&(c===','||c==='\n'||c==='\r')){row.push(value);value='';if(c!==','){if(c==='\r'&&text[i+1]==='\n')i++;if(row.some(v=>v!==''))rows.push(row);row=[];}}else value+=c;}
    if(quoted)throw Error('CSV 引号未闭合');row.push(value);if(row.some(v=>v!==''))rows.push(row);
    return rows;
  }
  const aliases={date:['date','日期'],page:['page','pages','url','页面','网页','热门网页','top pages'],query:['query','queries','关键词','查询','热门查询','top queries'],clicks:['clicks','点击','点击次数','点击量'],impressions:['impressions','展现','展现次数','展示次数','展现量'],position:['position','average position','平均排名'],citations:['citations','total citations','引用次数'],indexed:['indexed','已收录'],excluded:['excluded','未收录']};
  function csvReport(text,provider,dimension,startDate,endDate) {
    const grid=parseCsv(text.replace(/^\uFEFF/,''));if(grid.length<2)throw Error('报表没有记录');
    const headers=grid.shift().map(x=>x.trim().toLowerCase());
    const fields=Object.fromEntries(Object.entries(aliases).map(([key,names])=>[key,headers.findIndex(h=>names.includes(h))]));
    if(fields[dimension]<0)throw Error('报表缺少所选维度，请核对模板');
    const metrics=provider.endsWith('_indexing')?['indexed','excluded']:provider==='bing_ai'?['citations']:provider==='google_ai'?['impressions']:['clicks','impressions','position'];
    if(metrics.every(k=>fields[k]<0))throw Error('报表缺少指标');
    const rows=grid.map(cells=>{
      if(cells.length!==headers.length)throw Error('CSV 列数不一致');
      const row={[dimension]:cells[fields[dimension]].trim()};
      for(const key of metrics){const value=fields[key]<0?'':cells[fields[key]].trim();row[key]=['','-','~','—'].includes(value)?null:Number(value.replaceAll(',',''));if(row[key]!=null&&!Number.isFinite(row[key]))throw Error('报表数值无效');}
      return row;
    });
    if(dimension==='date'){const dates=rows.map(r=>r.date).sort();startDate=dates[0];endDate=dates.at(-1);}
    return {provider,dimension,startDate,endDate,rows};
  }
  function download(name,content,type='application/json') {const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function template() {
    if(!state.authenticated)return;
    const provider=$('[data-growth-provider]').value,dimension=$('[data-growth-dimension]').value;
    if(provider==='ai_evaluation'){
      const epoch=state.epoch;const response=await fetch('/ops/growth-api/questions',{credentials:'same-origin',cache:'no-store'});const data=await response.json();
      if(epoch!==state.epoch||!state.authenticated)return;
      if(!response.ok)throw Error('题库读取失败');
      data.observationFormat={caseId:'题库中的 id',engine:'题库中的平台名称',model:'实际模型或版本',observedAt:'真实观察的 ISO 时间',citations:['真实引用 URL；无引用时为空数组'],accuracyReview:'correct / incorrect / unreviewed'};
      download('geo-questions.json',JSON.stringify(data,null,2));return;
    }
    const fields=provider.endsWith('_indexing')?['indexed','excluded']:provider==='bing_ai'?['citations']:provider==='google_ai'?['impressions']:['clicks','impressions','position'];
    download(`${provider}-${dimension}.csv`,'\uFEFF'+[dimension,...fields].join(',')+'\n','text/csv;charset=utf-8');
  }
  async function importReport(event) {
    event.preventDefault();if(!state.authenticated||state.importing)return;
    const epoch=state.epoch,button=$('[data-growth-submit]');state.importing=true;button.disabled=true;
    const current=()=>epoch===state.epoch&&state.authenticated;
    try {
      const file=$('[data-growth-file]').files[0];if(!file||file.size>2*1024*1024)throw Error('请选择不超过 2 MB 的报表');
      const provider=$('[data-growth-provider]').value,dimension=$('[data-growth-dimension]').value;
      const start=$('[data-growth-start]').value,end=$('[data-growth-end]').value;
      const text=await file.text();if(!current())return;
      let body;
      if(file.name.toLowerCase().endsWith('.csv')){if(provider==='ai_evaluation')throw Error('AI 评测请使用 JSON 观察记录');body=csvReport(text,provider,dimension,start,end);}
      else {body=JSON.parse(text);if(Array.isArray(body)){if(provider!=='ai_evaluation')throw Error('请使用报表模板');body={provider:'ai_evaluation',rows:body};}if(body.provider!==provider)throw Error('文件平台与所选平台不一致');}
      const response=await fetch('/ops/growth-api/import',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},body:JSON.stringify(body)});
      const receipt=await response.json();if(!current())return;
      if(response.status===401){document.dispatchEvent(new Event('operations:session-expired'));return;}
      if(!response.ok)throw Error(receipt.error?.message||'导入失败，请核对模板');
      $('[data-growth-import-status]').textContent=`导入成功 · ${receipt.rows} 条${receipt.replayed?' · 已保存的相同报表':''}`;
      $('[data-growth-file]').value='';await load();
    }catch(error){if(current())$('[data-growth-import-status]').textContent=error instanceof SyntaxError?'JSON 格式无效，请核对模板':error.message;}
    finally{if(current()){state.importing=false;button.disabled=false;}}
  }
  root.querySelectorAll('[data-growth-days]').forEach(button=>button.addEventListener('click',()=>{state.days=Number(button.dataset.growthDays);root.querySelectorAll('[data-growth-days]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));load();}));
  $('[data-growth-refresh]').addEventListener('click',load);
  root.querySelectorAll('[data-growth-google]').forEach(b=>b.addEventListener('click',()=>googleAction(b.dataset.growthGoogle)));
  $('[data-growth-form]').addEventListener('submit',importReport);
  $('[data-growth-template]').addEventListener('click',()=>{template().catch(()=>{if(state.authenticated)$('[data-growth-import-status]').textContent='模板读取失败，请重试';});});
  root.addEventListener('growth:open',()=>{if(!state.started)load();});
  function clear(){state.epoch++;state.readId++;state.started=false;state.importing=false;googleBusy=false;controller?.abort();$('[data-growth-content]').hidden=true;for(const name of ['kpis','channels','trend','search','ai-platforms','evaluations','indexing','health'])$(`[data-growth-${name}]`).innerHTML='';for(const name of ['state','freshness','message'])$(`[data-growth-google-${name}]`).textContent='';root.querySelectorAll('[data-growth-google]').forEach(b=>b.disabled=true);$('[data-growth-updated]').textContent='';$('[data-growth-question-count]').textContent='';$('[data-growth-form]').reset();$('[data-growth-submit]').disabled=false;$('[data-growth-import-status]').textContent='';status('登录后可查看');}
  document.addEventListener('operations:logout',()=>{state.authenticated=false;state.csrf='';clear();});
  document.addEventListener('operations:authenticated',event=>{clear();state.authenticated=true;state.csrf=event.detail?.csrfToken||'';if(googleTicket){const ticket=googleTicket;googleTicket=null;googleAction('finish',ticket);}else if(root.classList.contains('is-active'))load();});
})();
