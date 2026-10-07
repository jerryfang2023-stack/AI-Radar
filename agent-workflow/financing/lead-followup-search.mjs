import path from 'node:path';
import {read,write,digest} from './state.mjs';
import {createSearchGateway} from '../tools/lib/search-gateway.mjs';

// Backlog review reserves a separate allowance for each source identity.
export function createLeadFollowupSearch({directory,date,leadUrl,policy,env=process.env,fetcher=fetch}) {
  const file=path.join(directory,`verification-search-${digest(leadUrl)}.json`);
  const state=read(file,{date,requests:0,queries:{}});
  if(state.date!==date)throw new Error('verification_search_date_mismatch');
  return async title=>{
    const subject=String(title || leadUrl).replace(/["\r\n]/gu,' ').slice(0,220);
    const items=new Map();let status='completed',reason='';
    if(!['ANYSEARCH_API_KEY','BRAVE_SEARCH_API_KEY','TAVILY_API_KEY','EXA_API_KEY'].some(key=>env[key]))return {status:'held',reason:'search_provider_unavailable',items:[]};
    const queries=[`${subject} 融资 公司 公告`,`${subject} funding company announcement`,`${subject} investor funding press release`,`${subject} 融资 领投 投资机构`].slice(0,policy.search_queries_per_lead);
    for(const query of queries) {
      const key=digest(query);let receipt=state.queries[key];
      if(!receipt) {
        if(state.requests>=policy.search_requests_per_lead){status='deferred';reason='search_budget_exhausted';break;}
        state.queries[key]={status:'started',items:[]};write(file,state);
        const gateway=createSearchGateway({env,fallback:null,maxRequests:policy.search_requests_per_lead-state.requests,fetcher:async(...args)=>{
          if(state.requests>=policy.search_requests_per_lead)throw new Error('search_budget_exhausted');
          state.requests++;write(file,state);return fetcher(...args);
        }});
        try {receipt={status:'completed',items:(await gateway.search(query,policy.search_results)).map(row=>({url:row.url,title:row.title}))};}
        catch {receipt={status:'failed',reason:'search_unavailable_or_unknown',items:[]};}
        state.queries[key]=receipt;write(file,state);
      }
      if(receipt.status!=='completed'){status='held';reason='search_previous_unknown_or_failed';}
      for(const item of receipt.items || [])items.set(item.url,item);
    }
    return {status,reason,items:[...items.values()]};
  };
}
