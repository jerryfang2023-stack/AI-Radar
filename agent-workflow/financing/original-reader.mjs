import path from 'node:path';
import { read,write,digest,acquireLock } from './state.mjs';
import { fetchText,publicHttpUrl } from './original-page.mjs';

// Rendering bodies and request receipts stay in private storage. An unknown
// billed outcome is never automatically repeated during same-day recovery.
export function createOriginalReader({directory,sharedDirectory=directory,env=process.env,fetcher=fetch,maxRequests=20,budgetKey='',date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai'}).format(new Date())}={}) {
  if(!env.JINA_API_KEY||!directory)return null;
  return async url=>{
    publicHttpUrl(url);
    const file=path.join(directory,date,`${digest(url)}.json`);
    const sharedFile=path.join(sharedDirectory,date,`${digest(url)}.json`);
    const save=value=>{write(sharedFile,value);if(sharedFile!==file)write(file,value);};
    const release=acquireLock(path.join(sharedDirectory,date));
    try {
      const existing=read(sharedFile,read(file));
      const budgetFile=path.join(directory,date,budgetKey?`budget-${digest(budgetKey)}.json`:'budget.json'),budget=read(budgetFile,{requests:0});
      const sharedBudget=path.join(sharedDirectory,date,path.basename(budgetFile));
      const requests=Math.max(budget.requests,read(sharedBudget,{requests:0}).requests);
      if(existing) {
        save(existing);write(sharedBudget,{requests});
        if(existing.status==='completed' && existing.url===url)return existing.result;
        throw new Error(`reader_receipt_${existing.status}`);
      }
      if(requests>=maxRequests)throw new Error('reader_daily_budget_exhausted');
      write(sharedBudget,{requests:requests+1});if(sharedBudget!==budgetFile)write(budgetFile,{requests:requests+1});
      save({url,status:'pending',at:new Date().toISOString()});
    } finally {release();}
    try {
      const response=await fetchText(`https://r.jina.ai/${url}`,{fetcher,timeoutMs:30000,headers:{authorization:`Bearer ${env.JINA_API_KEY}`,'x-return-format':'markdown',accept:'text/plain'}});
      const text=response.text;const field=name=>text.match(new RegExp(`^${name}:\\s*(.+)$`,'m'))?.[1]?.trim()||'';
      const body=text.includes('\nMarkdown Content:\n')?text.split('\nMarkdown Content:\n').slice(1).join('\nMarkdown Content:\n'):'';
      if(body.length<300||field('URL Source')!==url)throw new Error('reader_invalid_original');
      const result={url,title:field('Title'),published_at:field('Published Time'),body};
      save({url,status:'completed',at:new Date().toISOString(),result});return result;
    } catch(error) {
      save({url,status:/http_|invalid_original/u.test(error.message)?'failed':'unknown',at:new Date().toISOString(),error:error.message});throw error;
    }
  };
}
