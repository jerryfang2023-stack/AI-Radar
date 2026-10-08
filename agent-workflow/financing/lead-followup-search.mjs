import path from 'node:path';
import {read,write,digest} from './state.mjs';
import {createSearchGateway} from '../tools/lib/search-gateway.mjs';

// Collection rechecks and queue verification share completed queries and the
// account health circuit, while each lead retains its own request allowance.
export function createLeadFollowupSearch({directory,date,leadUrl,policy,env=process.env,fetcher=fetch,budget}) {
  const file=path.join(directory,`verification-search-${digest(leadUrl)}.json`);
  const state=read(file,{date,requests:0,queries:{}});
  if(state.date!==date)throw new Error('verification_search_date_mismatch');
  const gateway=createSearchGateway({env,fallback:null,fetcher,
    cacheDir:path.join(directory,'review-search-cache'),healthFile:path.join(directory,'search-health.json'),
    maxRequests:Math.max(0,policy.search_requests_per_lead-state.requests),
    beforeRequest:()=>{
      if(state.requests>=policy.search_requests_per_lead)throw new Error('search_budget_exhausted');
      budget?.reserveSearch(leadUrl);
      state.requests++;write(file,state);
    }});
  const query=async(text,limit=policy.search_results)=>{
    const key=digest(text);let receipt=state.queries[key];
    if(!receipt) {
      if(state.requests>=policy.search_requests_per_lead)throw new Error('search_budget_exhausted');
      state.queries[key]={status:'started',items:[]};write(file,state);
      try {receipt={status:'completed',items:(await gateway.search(text,limit)).map(row=>({url:row.url,title:row.title}))};}
      catch(error) {receipt={status:'failed',reason:error.message,items:[]};}
      state.queries[key]=receipt;write(file,state);
    }
    if(receipt.status!=='completed')throw new Error(receipt.reason || 'search_previous_unknown_or_failed');
    return receipt.items;
  };
  const followup=async title=>{
    const subject=String(title || leadUrl).replace(/["\r\n]/gu,' ').slice(0,220);
    const items=new Map();let status='completed',reason='';
    if(!['ANYSEARCH_API_KEY','BRAVE_SEARCH_API_KEY','TAVILY_API_KEY','EXA_API_KEY'].some(key=>env[key]))return {status:'held',reason:'search_provider_unavailable',items:[]};
    const queries=[`${subject} 融资 公司 公告`,`${subject} funding company announcement`,`${subject} investor funding press release`,`${subject} 融资 领投 投资机构`].slice(0,policy.search_queries_per_lead);
    for(const text of queries) {
      try {for(const item of await query(text))items.set(item.url,item);}
      catch(error) {status=/budget_exhausted/u.test(error.message)?'deferred':'held';reason=error.message;break;}
    }
    return {status,reason,items:[...items.values()]};
  };
  followup.query=query;
  return followup;
}
