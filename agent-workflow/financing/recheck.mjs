import {digest} from './state.mjs';
import {canonicalSearchUrl} from '../tools/lib/search-gateway.mjs';

// Independent per-lead budgets. Search snippets are never accepted evidence.
export async function recheckPending({state, policy, search, capture, accept, save, date, budget}) {
  state.rechecks ||= {};
  const pending = Object.entries(state.captures).filter(([,row]) => row.status === 'pending');
  let attempted = 0;
  const reviewLead = async ([url,lead]) => {
    const receipt = state.rechecks[url] ||= {version:'FINANCING-RECHECK-1', queries:{}, captures:[], review_status:'awaiting_agent_review'};
    receipt.status = 'in_progress';
    const queries = [
      `${lead.title || url} 融资 公司 公告`,
      `${lead.title || url} funding company announcement`,
      `${lead.title || url} investor funding press release`,
      `${lead.title || url} 融资 领投 投资机构`,
    ].slice(0, policy.search_queries_per_lead);
    // Retry the failed original once, then look for original alternative pages.
    const candidates = new Map(lead.reason==='collection_capture_interrupted_or_unknown'?[]:[[url,{...lead,url}]]);
    const captureCandidates = async () => {
      for (const candidate of candidates.values()) {
        if (receipt.captures.length >= policy.capture_attempts_per_lead) break;
        if (receipt.captures.some(row => row.url === candidate.url) || state.captures[candidate.url]?.status === 'accepted') continue;
        if (budget?.hasCapture(candidate.url)) continue;
        if (budget ? !budget.reserveCapture(url,candidate.url) : attempted >= policy.capture_attempts_per_run) {
          receipt.status = 'continuation_required'; await save(); break;
        }
        attempted++;
        const row = {url:candidate.url,status:'started'}; receipt.captures.push(row); await save();
        try {
          const result = await capture(candidate,{date,recheckLeadUrl:url});
          if (result.record || result.status === 'accepted') await accept(candidate,result,{leadUrl:url});
          Object.assign(row,{status:result.status,reason:result.reason || '',content_hash:result.record?.content_hash});
          budget?.finishCapture(candidate.url,result);
        } catch (error) {
          Object.assign(row,{status:'pending',reason:error.message});
          budget?.finishCapture(candidate.url,{status:'unknown',reason:error.message});
        }
        await save();
        // Acquisition has succeeded. Further company/round cross-checks belong
        // to the evidence review stage, not more blind original captures.
        if (row.content_hash || row.status === 'accepted') return true;
      }
      return receipt.captures.some(row=>row.content_hash || row.status==='accepted');
    };
    let evidenceReady=await captureCandidates();
    for (const [index, query] of queries.entries()) {
      if (evidenceReady || receipt.captures.length >= policy.capture_attempts_per_lead || receipt.status==='continuation_required') break;
      const key = digest(query);
      if (!receipt.queries[key]) {
        // Save before requesting: an interrupted request is visible and not
        // silently billed twice during recovery.
        receipt.queries[key] = {status:'started',query,index}; await save();
        try {
          const found=await search(query,policy.search_results,{leadUrl:url});
          receipt.queries[key] = {status:'completed',query,index,items:found.map(row=>({url:row.url,title:String(row.title || '').slice(0,500),snippet:String(row.snippet || '').slice(0,500)}))};
        }
        catch (error) { receipt.queries[key] = {status:'failed',query,index,error:error.message}; }
        await save();
      }
      for (const row of receipt.queries[key].items || []) {
        const candidate = canonicalSearchUrl(row.url);
        if (candidate) candidates.set(candidate,{...row,url:candidate,coverage:lead.coverage || []});
      }
      evidenceReady=await captureCandidates();
    }
    if (receipt.status !== 'continuation_required') receipt.status = 'evidence_attempted';
    receipt.review_status = state.captures[url]?.status === 'accepted' ? 'original_captured_awaiting_fact_gate' : 'awaiting_agent_review';
    receipt.review_stage=evidenceReady?'evidence_review':'needs_original';
    await save();
  };
  let next=0;
  await Promise.all(Array.from({length:Math.min(policy.concurrency || 4,pending.length)},async()=>{
    while(next<pending.length) {
      if(!budget && attempted>=policy.capture_attempts_per_run)break;
      await reviewLead(pending[next++]);
    }
  }));
  state.recheck_summary = {leads:pending.length,capture_attempts_this_run:attempted,
    continuation_required:pending.filter(([url])=>!state.rechecks[url] || state.rechecks[url].status==='continuation_required').length,
    awaiting_agent_review:Object.values(state.rechecks).filter(row=>row.review_status==='awaiting_agent_review').length,
    policy, ...(budget?{budget:budget.summary()}:{})};
  await save();
}
