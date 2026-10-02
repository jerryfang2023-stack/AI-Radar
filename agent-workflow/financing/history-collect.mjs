#!/usr/bin/env node
// Explicit historical backfill only. Daily dispatch never imports this entry.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { captureOriginal } from './capture.mjs';
import { originalDate } from './original-page.mjs';
import { config } from './discovery.mjs';
import { acquireLock, digest, read, write } from './state.mjs';
import { indexFinancingEvidence } from './evidence-index.mjs';
import { canonicalSearchUrl } from '../tools/lib/search-gateway.mjs';
import { ingestPrivateEvidenceRecords } from '../tools/lib/private-evidence-backup.mjs';
import { loadPrivateEvidenceRecord } from '../tools/lib/private-evidence-store.mjs';
import { buildSourceIntake, mergeSourceIntakes, readSourceIntake, sourceIntakePath } from '../tools/lib/source-intake-v1.mjs';
import { resolvePrivateEvidenceBackupRoot } from '../tools/private-evidence-backup-paths.mjs';

export function historyUrlKey(value) {
  const url=canonicalSearchUrl(value); if(!url)return '';
  const u=new URL(url);return u.hostname.replace(/^www\./u,'').replace(/^twitter\.com$/u,'x.com')+u.pathname.replace(/\/$/u,'')+u.search;
}

// Only sources actually cited for financing establish an existing-source match.
// A company's product page cannot suppress a later financing announcement.
export function existingFundingSourceUrls(cards=[]) {
  const urls=new Set();
  for(const card of cards){
    const refs=new Set([...(card.financing?.evidence_refs||[]),...(card.financing?.disclosures||[]).flatMap(d=>d.evidence_refs||[])].map(r=>r.source_id));
    for(const source of card.research_sources||[])if(refs.has(source.source_id))urls.add(historyUrlKey(source.source_url));
  }
  urls.delete('');return urls;
}

export async function collectHistory({root,directory,backupRoot,date,from,to,input,finalize=false,capture=captureOriginal}) {
  if(!directory||!backupRoot||!from||!to)throw Error('explicit_history_paths_and_range_required');
  const dailyRelative=path.relative(path.join(root,'agent-workflow/reports/financing'),path.resolve(directory));
  if(!dailyRelative||(!dailyRelative.startsWith('..')&&!path.isAbsolute(dailyRelative)))throw Error('history_must_not_use_daily_directory');
  if([date,from,to].some(value=>!value||originalDate(value)!==value)||from>to||to>date)throw Error('invalid_historical_financing_range');
  const file=path.join(directory,'collection.json'),previous=read(file);
  if(previous&&(previous.kind!=='explicit_history'||previous.date!==date||previous.from!==from||previous.to!==to))throw Error('history_checkpoint_identity_mismatch');
  const state=previous||{version:config.version,kind:'explicit_history',date,from,to,captures:{}};
  const policyFile=path.join(root,'01-SiteV2/content/11-databases/data-center-v4',date,'targeted-funding-authorization.json');
  const policy=read(policyFile);
  if(finalize&&policy&&(policy.from!==from||policy.to!==to))throw Error('historical_authorization_range_conflict');
  const items=Array.isArray(input)?input:input.items;
  if(!Array.isArray(items))throw Error('historical_candidates_required');
  const known=existingFundingSourceUrls(read(path.join(root,'01-SiteV2/site/data/funding-insights-v1.json'),{}).cards||[]);
  const leads=new Map();
  for(const item of items){
    const url=canonicalSearchUrl(item.links?.original||item.url);if(!url)continue;
    if(!leads.has(historyUrlKey(url)))leads.set(historyUrlKey(url),{url,title:item.originalTitle||item.title,original_id:item.id||item.original_id,discovery_url:item.links?.aihot||`https://aihot.news/items/${item.id}`,coverage:['explicit_aihot_history']});
  }
  const pending=[...leads.values()].filter(lead=>!state.captures[lead.url]);
  for(let i=0;i<pending.length;i+=config.capture_concurrency){
    const results=await Promise.all(pending.slice(i,i+config.capture_concurrency).map(async lead=>{
      if(known.has(historyUrlKey(lead.url)))return{lead,result:{status:'existing',reason:'already_cited_financing_source'}};
      try{return{lead,result:await capture(lead,{date,historicalRange:{from,to}})};}
      catch(error){return{lead,result:{status:'pending',reason:error.message}};}
    }));
    const records=results.filter(({result})=>result.status==='accepted').map(({lead,result})=>({
      snapshotRef:`financing-history/${from}_${to}/${date}-HIST-${digest(lead.url).slice(0,16)}.json`,sourceUrl:lead.url,dataDate:date,
      contentHash:result.record.content_hash,body:result.record.clean_text,
      metadata:{...result.record,discovery_source:'AIHOT',discovery_url:lead.discovery_url,historical_range:{from,to}},
    }));
    if(records.length)ingestPrivateEvidenceRecords({root,backupRoot,records});
    for(const{lead,result}of results){const{record,...receipt}=result;state.captures[lead.url]={...receipt,aihot_id:lead.original_id,...(record?{content_hash:record.content_hash,source_url:lead.url,original_date:record.published_at}:{})};}
    state.counts={leads:leads.size,...Object.fromEntries(['accepted','existing','pending','excluded'].map(status=>[status,Object.values(state.captures).filter(r=>r.status===status).length]))};
    write(file,state);console.log(JSON.stringify({processed:Object.keys(state.captures).length,...state.counts}));
  }
  state.discovery_complete=input.complete===true;
  state.discovery_missing_original_urls=items.filter(item=>!canonicalSearchUrl(item.links?.original||item.url)).length;
  state.accepted=false;
  if(finalize){
    if(!Array.isArray(input)&&(input.processed!==input.total))throw Error('historical_discovery_still_running');
    const entries=Object.values(state.captures).filter(row=>row.status==='accepted').map(row=>{
      const loaded=loadPrivateEvidenceRecord(root,`evidence://${row.content_hash}`,row.content_hash,{backupRoot,sourceUrl:row.source_url,dataDate:date});
      return{record:loaded.raw,jsonPath:path.join(root,loaded.entry.snapshot_ref),pooled:true};
    });
    const intake=buildSourceIntake({root,date,entries});
    intake.source_artifacts.forEach(row=>{row.snapshot_refs=[`evidence://${row.content_hash}`];});
    intake.raw_documents.forEach(row=>{row.body_ref=`evidence://${row.content_hash}`;});
    write(sourceIntakePath(root,date),mergeSourceIntakes(readSourceIntake(root,date)?.payload,intake));
    state.raw_ids=intake.raw_documents.map(r=>r.raw_id);
    write(policyFile,{schema_version:'TARGETED-FUNDING-AUTHORIZATION-V1',from,to,reviewed_by:'Codex: explicit user request for 2026 AIHOT financing backfill',source_refs:[...new Set([...(policy?.source_refs||[]),...intake.source_artifacts.map(r=>r.source_artifact_id)])],...(policy?.round_identity_source_refs ? {round_identity_source_refs:policy.round_identity_source_refs} : {}),...(policy?.event_date_reviews ? {event_date_reviews:policy.event_date_reviews} : {})});
    indexFinancingEvidence({root,backupRoot,date,collection:state});
    state.accepted=true;state.counts.accepted_originals=entries.length;
    state.status=state.discovery_complete?'accepted':'accepted_with_discovery_gaps';
  }
  write(file,state);return state;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=new Map(process.argv.slice(2).map(a=>{const[k,...v]=a.replace(/^--/u,'').split('=');return[k,v.join('=')];}));
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
  const directory=args.get('runtime-dir');if(!directory||!args.get('input'))throw Error('explicit_history_runtime_and_input_required');
  if(args.get('env-file'))process.loadEnvFile(path.resolve(args.get('env-file')));
  const unlock=acquireLock(directory);
  try{await collectHistory({root,directory,backupRoot:resolvePrivateEvidenceBackupRoot(root),date:args.get('date'),from:args.get('from'),to:args.get('to'),input:read(args.get('input')),finalize:args.get('finalize')==='true'});}finally{unlock();}
}
