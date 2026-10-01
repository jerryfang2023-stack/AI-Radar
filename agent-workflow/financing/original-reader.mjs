import path from 'node:path';
import { read,write,digest } from './state.mjs';
import { fetchText,publicHttpUrl } from './original-page.mjs';

// Rendering bodies and request receipts stay in private storage. An unknown
// billed outcome is never automatically repeated during same-day recovery.
export function createOriginalReader({directory,env=process.env,fetcher=fetch,maxRequests=20,date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai'}).format(new Date())}={}) {
  if(!env.JINA_API_KEY||!directory)return null;
  return async url=>{
    publicHttpUrl(url);
    const file=path.join(directory,date,`${digest(url)}.json`),existing=read(file);
    if(existing?.status==='completed'&&existing.url===url)return existing.result;
    if(existing)throw new Error(`reader_receipt_${existing.status}`);
    const budgetFile=path.join(directory,date,'budget.json'),budget=read(budgetFile,{requests:0});
    if(budget.requests>=maxRequests)throw new Error('reader_daily_budget_exhausted');
    write(budgetFile,{requests:budget.requests+1});write(file,{url,status:'pending',at:new Date().toISOString()});
    try {
      const response=await fetchText(`https://r.jina.ai/${url}`,{fetcher,timeoutMs:30000,headers:{authorization:`Bearer ${env.JINA_API_KEY}`,'x-return-format':'markdown',accept:'text/plain'}});
      const text=response.text;const field=name=>text.match(new RegExp(`^${name}:\\s*(.+)$`,'m'))?.[1]?.trim()||'';
      const body=text.includes('\nMarkdown Content:\n')?text.split('\nMarkdown Content:\n').slice(1).join('\nMarkdown Content:\n'):'';
      if(body.length<300||field('URL Source')!==url)throw new Error('reader_invalid_original');
      const result={url,title:field('Title'),published_at:field('Published Time'),body};
      write(file,{url,status:'completed',at:new Date().toISOString(),result});return result;
    } catch(error) {
      write(file,{url,status:/http_|invalid_original/u.test(error.message)?'failed':'unknown',at:new Date().toISOString(),error:error.message});throw error;
    }
  };
}
