import fs from 'node:fs';
import { load } from 'cheerio';
import { fetchText, originalDate, publicHttpUrl } from './original-page.mjs';
import { read, write, digest } from './state.mjs';
import { isFundingDiscovery } from '../tools/lib/aihot-feed.mjs';
export const sourceRegistry=JSON.parse(fs.readFileSync(new URL('./sources.json',import.meta.url),'utf8'));
const plain=value=>load(String(value||'')).text().replace(/\s+/gu,' ').trim();
const field=(object,path)=>String(path||'').split('.').reduce((v,k)=>v?.[k],object);
export function parseSubscription(source,text) {
  let rows=[];
  if(source.kind==='rss') {
    if(!/<(?:rss|feed|rdf:RDF)[\s>]/iu.test(text)) throw new Error('feed_invalid_or_challenge');
    const $=load(text,{xmlMode:true});
    $('item, entry').each((_,el)=>{
      const node=$(el);const get=name=>node.children().filter((_,child)=>child.name===name).first().text();
      const atom=node.find('link[rel="alternate"]').first().attr('href')||node.find('link[href]').first().attr('href');
      rows.push({url:atom||get('link'),title:plain(get('title')),summary:plain(get('description')||get('summary')||get('content:encoded')||get('content')).slice(0,3000),published_at:originalDate(get('pubDate')||get('published')||get('dc:date'))});
    });
  } else if(source.kind==='web_list') {
    const c=source.config||{},$=load(text);
    if(!c.itemSelector||!c.linkSelector)throw new Error('source_selector_required');
    const nodes=$(c.itemSelector);if(!nodes.length)throw new Error('source_listing_no_matches');
    nodes.each((_,el)=>{const n=$(el),a=c.linkSelector===':self'?n:n.find(c.linkSelector).first();rows.push({url:a.attr('href'),title:plain(a.attr('title')||a.text()),summary:c.summarySelector?plain(n.find(c.summarySelector).text()):'',published_at:c.dateSelector?originalDate(n.find(c.dateSelector).first().text()):''});});
  } else if(source.kind==='json_list') {
    const c=source.config||{},data=JSON.parse(text),items=field(data,c.itemsPath);
    if(!Array.isArray(items))throw new Error('source_items_not_array');
    rows=items.map(item=>({url:field(item,c.urlPath),title:plain(field(item,c.titlePath)),summary:plain(field(item,c.summaryPath)),published_at:originalDate(field(item,c.datePath))}));
  } else throw new Error('unsupported_subscription_kind');
  if(rows.length>1000)throw new Error('source_listing_budget_exceeded');
  const valid=rows.flatMap(row=>{try{if(!row.url||!row.title)return[];return[{...row,url:publicHttpUrl(new URL(row.url,source.url).href)}];}catch{return[];}});
  if(rows.length&&!valid.length)throw new Error('source_no_valid_items');
  return [...new Map(valid.map(row=>[row.url,row])).values()];
}
export function inDiscoveryWindow(row,date,days=7) {
  if(!row.published_at)return true; // Missing date is resolved at the original, never guessed.
  const age=(Date.parse(date)-Date.parse(row.published_at.slice(0,10)))/86400000;
  return age>=0&&age<=days;
}
export async function collectSubscriptions({date,stateFile,registry=sourceRegistry,fetcher=fetch,search,now=()=>new Date().toISOString()}={}) {
  const state=stateFile?read(stateFile,{version:'FINANCING-SOURCE-STATE-1',sources:{}}):{version:'FINANCING-SOURCE-STATE-1',sources:{}};
  if(state.version!=='FINANCING-SOURCE-STATE-1')throw new Error('source_state_version_mismatch');
  const items=[],health=[];
  for(const source of registry.sources.filter(s=>s.enabled)) {
    const previous=state.sources[source.id]||{}, fingerprint=digest(source),compatible=previous.fingerprint===fingerprint;
    const headers=compatible?{...(previous.etag?{'if-none-match':previous.etag}:{}),...(previous.lastModified?{'if-modified-since':previous.lastModified}:{})}:{};
    try {
      const response=await fetchText(source.url,{fetcher,headers});
      if(response.response.status===304&&!compatible)throw new Error('source_304_without_checkpoint');
      const listing=response.response.status===304?null:parseSubscription(source,response.text);
      const listedUrls=new Set((listing||[]).map(row=>row.url));
      const current=listing?.filter(isFundingDiscovery).map(row=>({...row,acquisition_channel:'subscription',source:source.name,source_id:source.id,source_tier:source.tier,coverage:[`subscription:${source.id}`],discovered_at:now(),evidence_role:'discovery_only'}));
      // Short RSS feeds must not erase yesterday's still-relevant leads.
      const carried=(compatible?previous.items||[]:[]).filter(row=>!listedUrls.has(row.url)&&inDiscoveryWindow({...row,published_at:row.published_at||row.discovered_at},date));
      const rows=response.response.status===304?previous.items||[]:[...carried,...current];
      // The durable result and successful fetch position are committed together.
      const unchanged=response.response.status===304;
      const saved={fingerprint,last_ok_at:now(),last_attempt_at:now(),failures:0,items:rows,etag:response.response.headers.get('etag')||(unchanged?previous.etag:'')||'',lastModified:response.response.headers.get('last-modified')||(unchanged?previous.lastModified:'')||''};
      state.sources[source.id]=saved;if(stateFile)write(stateFile,state);
      items.push(...rows.filter(row=>inDiscoveryWindow(row,date)));
      health.push({id:source.id,status:response.response.status===304?'not_modified':'success',count:rows.length,last_ok_at:saved.last_ok_at});
    } catch(error) {
      state.sources[source.id]={...previous,last_attempt_at:now(),failures:(previous.failures||0)+1,last_error:error.message};
      if(stateFile)write(stateFile,state);
      if(compatible)items.push(...(previous.items||[]).filter(row=>inDiscoveryWindow(row,date)));
      const receipt={id:source.id,status:'failed',reason:error.message,last_ok_at:previous.last_ok_at||'',failures:state.sources[source.id].failures};
      if(search) {
        const since=new Date(Date.parse(date)-7*86400000).toISOString().slice(0,10);
        const domain=source.search_domain||new URL(source.url).hostname.replace(/^www\./u,'');
        const query=`site:${domain} (AI OR 人工智能) (融资 OR funding OR raises) after:${since}`;
        try {
          const rows=(await search(query,8)).filter(row=>isFundingDiscovery({...row,summary:row.snippet})).map(row=>({...row,coverage:[`subscription-fallback:${source.id}`],source_id:source.id,source_tier:source.tier,evidence_role:'discovery_only'}));
          items.push(...rows);receipt.fallback_status='success';receipt.fallback_count=rows.length;
        } catch(error) {receipt.fallback_status='failed';receipt.fallback_reason=error.message;}
      }
      health.push(receipt);
    }
  }
  return {items,health,complete:health.every(h=>h.status!=='failed'),failures:health.filter(h=>h.status==='failed').map(h=>`${h.id}:${h.reason}`)};
}
