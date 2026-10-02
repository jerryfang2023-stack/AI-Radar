import { aihotCandidate, isFundingDiscovery } from '../tools/lib/aihot-feed.mjs';
import { read, write } from './state.mjs';
import { inDiscoveryWindow } from './subscriptions.mjs';

const fresh=()=>({version:'AIHOT-SELECTED-STATE-1',items:{},cursor:null,bootstrap:null,review_changes:[]});
export async function syncAIHotSelected({stateFile,date,fetcher=fetch,baseUrl='https://aihot.news',maxPages=50,save=state=>write(stateFile,state)}={}) {
  let state=stateFile?read(stateFile,fresh()):fresh();
  if(state.version!=='AIHOT-SELECTED-STATE-1')throw new Error('aihot_selected_state_version_mismatch');
  let pages=0,complete=false,resets=0;const cursors=new Set(),failures=[];
  try {
    while(pages<maxPages) {
      const bootstrap=!state.cursor;
      const url=new URL(bootstrap?'/api/v1/selected/snapshot':'/api/v1/selected/changes',baseUrl);
      url.searchParams.set('limit',bootstrap?'1000':'100');
      if(bootstrap){url.searchParams.set('fields','default');if(state.bootstrap?.nextPage)url.searchParams.set('page',state.bootstrap.nextPage);}
      else url.searchParams.set('cursor',state.cursor);
      const response=await fetcher(url.href,{signal:AbortSignal.timeout(20000),headers:{accept:'application/json','user-agent':'WaveSightFinancing/1.1'}});
      if(response.status===409) {
        const error=await response.json();
        if((error.error?.code||error.error||error.code)!=='snapshot_required'||resets++>0)throw new Error('aihot_selected_409_unknown');
        state={...state,cursor:null,bootstrap:null};await save(state);continue;
      }
      if(!response.ok)throw new Error(`aihot_selected_http_${response.status}`);
      const data=await response.json();pages++;
      if(data.schemaVersion!==1||data.fields!=='default'||typeof data.cursor!=='string'||!data.cursor||typeof data.hasMore!=='boolean')throw new Error('aihot_selected_invalid_contract');
      const next=structuredClone(state);
      if(bootstrap) {
        if(!Array.isArray(data.items)||data.count!==data.items.length||(data.hasMore&&(!data.nextPage||!data.items.length)))throw new Error('aihot_snapshot_invalid_page');
        next.bootstrap ||= {cursor:data.cursor,items:{},nextPage:null};
        if(next.bootstrap.cursor!==data.cursor)throw new Error('aihot_snapshot_watermark_changed');
        for(const item of data.items) {
          if(!item.id||!item.title||!item.links?.original)throw new Error('aihot_snapshot_invalid_item');
          if(isFundingDiscovery(item)){const candidate=aihotCandidate(item);if(candidate)next.bootstrap.items[item.id]=candidate;}
        }
        next.bootstrap.nextPage=data.nextPage;
        if(!data.hasMore) {
          // Editorial removal is a review signal, never an automatic retraction
          // of an independently verified financing event.
          for(const [id,item]of Object.entries(next.items))if(!next.bootstrap.items[id])next.review_changes.push({id,url:item.url,op:'remove',reason:'upstream_selected_removed'});
          else if(JSON.stringify(item)!==JSON.stringify(next.bootstrap.items[id]))next.review_changes.push({id,url:item.url,op:'update',reason:'upstream_discovery_changed'});
          next.items=next.bootstrap.items;next.cursor=next.bootstrap.cursor;next.bootstrap=null;
        }
      } else {
        if(!Array.isArray(data.changes)||data.count!==data.changes.length)throw new Error('aihot_changes_invalid_page');
        for(const change of data.changes) {
          const id=change.op==='remove'?change.id:change.item?.id;
          if(!id||!['remove','upsert'].includes(change.op))throw new Error('aihot_change_invalid');
          const old=next.items[id];
          if(change.op==='remove') { if(old)next.review_changes.push({id,url:old.url,op:'remove',changed_at:change.changedAt,reason:'upstream_selected_removed'});delete next.items[id]; }
          else {
            if(!change.item.title||!change.item.links?.original)throw new Error('aihot_change_invalid_item');
            const candidate=isFundingDiscovery(change.item)?aihotCandidate(change.item):null;
            if(old&&JSON.stringify(old)!==JSON.stringify(candidate))next.review_changes.push({id,url:old.url,op:'update',changed_at:change.changedAt,reason:'upstream_discovery_changed'});
            if(candidate)next.items[id]=candidate;else delete next.items[id];
          }
        }
        next.cursor=data.cursor;
        if(!data.hasMore)complete=true;
      }
      const marker=next.bootstrap?.nextPage||next.cursor;
      if(data.hasMore&&(cursors.has(marker)||(!bootstrap&&state.cursor===marker)))throw new Error('aihot_selected_cursor_stalled');
      cursors.add(marker);
      // Persist items and cursor atomically, only after validating the whole page.
      next.review_changes=[...new Map(next.review_changes.map(r=>[JSON.stringify(r),r])).values()];
      await save(next);state=next;
      if(complete)break;
    }
    if(!complete)throw new Error('aihot_selected_page_budget_incomplete');
  } catch(error) { failures.push(error.message); }
  const all=Object.values(state.items);
  return {complete,pages,failures,items:all.filter(row=>inDiscoveryWindow(row,date)),selected_funding_count:all.length,historical_funding_count:all.filter(row=>!inDiscoveryWindow(row,date)).length,review_changes:state.review_changes};
}
