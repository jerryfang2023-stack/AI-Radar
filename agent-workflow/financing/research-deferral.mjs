import fs from 'node:fs';
import path from 'node:path';
import {digest} from './state.mjs';

const version='FINANCING-RESEARCH-DEFERRAL-1';
const allowedReasons=new Set(['research_sources_insufficient','research_independent_sources_insufficient',
  'deepseek_json_quality_failed:cited_research_sources_insufficient']);
// Known per-candidate failures may withhold only a new subject with accepted
// source-bound Claims. Unknown exceptions, hashes and schema errors stay fatal.
const candidateReasons=new Set(['subject_company_unresolved','ambiguous_company_full_name_not_in_canonical_source',
  'funding_current_round_amount_mismatch','funding_event_company_amount_mismatch','funding_cumulative_amount_used_as_round',
  'funding_amount_is_valuation','funding_current_round_label_mismatch']);
const cardEvents=card=>[card.triggered_by_event_id,...(card.source_event_ids || [])];
const nameKey=name=>String(name || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');

function candidateBinding(event,bundle,cards) {
  const entities=(bundle.entities || []).filter(entity=>(event.entities || []).includes(entity.entity_id));
  const names=new Set(entities.flatMap(entity=>[entity.canonical_name,...(entity.aliases || [])]).map(nameKey).filter(Boolean));
  const refs=new Set(event.source_refs || []),ids=new Set(event.entities || []);
  if(cards.some(card=>ids.has(card.company?.entity_id) || ids.has(card.company?.canonical_entity_id)
    || [card.company?.name,card.company?.full_name].some(name=>names.has(nameKey(name)))
    || (card.source_refs || []).some(ref=>refs.has(ref))))return null;
  const claims=(bundle.claims || []).filter(claim=>(event.claim_refs || []).includes(claim.claim_id)
    && claim.claim_type==='funding' && claim.verification_status==='accepted' && String(claim.source_quote || '').trim().length>=12
    && (bundle.rawDocuments || []).some(raw=>raw.raw_id===claim.raw_id && refs.has(raw.source_artifact_id)));
  if(!claims.length)return null;
  return {isolation:'new_candidate_only',entity_binding:digest(entities),claim_refs:claims.map(claim=>claim.claim_id).sort(),
    evidence_quotes:claims.map(claim=>({claim_id:claim.claim_id,raw_id:claim.raw_id,quote:claim.source_quote.slice(0,240),quote_hash:digest(claim.source_quote.slice(0,240))}))};
}

function binding(event,bundle) {
  const refs=new Set(event.source_refs || []);
  const sources=(bundle.rawDocuments || []).filter(raw=>refs.has(raw.source_artifact_id))
    .map(raw=>({raw_id:raw.raw_id,source_ref:raw.source_artifact_id,content_hash:raw.content_hash,
      source_url:raw.canonical_url || raw.source_url})).sort((a,b)=>a.raw_id.localeCompare(b.raw_id));
  if(!sources.length || sources.some(row=>!row.raw_id || !row.source_ref || !/^[a-f0-9]{64}$/u.test(row.content_hash || '') || !/^https?:\/\//u.test(row.source_url || '')))return null;
  const claims=(bundle.claims || []).filter(claim=>refs.has(claim.source_ref) || sources.some(raw=>raw.raw_id===claim.raw_id));
  return {sources,input_hash:digest({event,claims,sources})};
}

// This receipt withholds a new, cardless event. It does not approve evidence,
// merge identities, exclude a lead, or suppress an existing published card.
export function researchDeferral(event,bundle,row,cards=[]) {
  if(!event || event.event_type!=='funding' || event.publication_status!=='verified'
    || row?.event_id!==event.event_id || row.status!=='blocked' || !row.problems?.length
    || row.problems.some(reason=>!allowedReasons.has(reason) && !candidateReasons.has(reason)) || cards.some(card=>cardEvents(card).includes(event.event_id)))return null;
  const isolated=row.problems.some(reason=>candidateReasons.has(reason));
  const candidate=isolated?candidateBinding(event,bundle,cards):null;
  if(isolated && !candidate)return null;
  const evidence=binding(event,bundle);
  if(!evidence)return null;
  return {version,event_id:event.event_id,status:'pending_verification',reason:row.problems.join('|'),
    ...evidence,...candidate,next_action:isolated?'responsible_review_of_candidate_identity_amount_and_round':'recover_existing_originals_and_complete_independent_research',fact_approval:false};
}

export function validResearchDeferral(event,bundle,row,cards=[]) {
  const expected=researchDeferral(event,bundle,row,cards);
  return Boolean(expected && row.deferral && digest(expected)===digest(row.deferral));
}

// Research approval is distinct from the original event's claimed completion.
// Show a pending label only for an intact, cardless deferral; never hide a
// published historical round or trust a stale receipt after facts change.
export function pendingResearchEvents(root) {
  const directory=path.join(root,'01-SiteV2/content/12-applications/funding-insights');
  if(!fs.existsSync(directory))return new Map();
  const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
  const days=fs.readdirSync(directory).filter(n=>/^\d{4}-\d{2}-\d{2}\.json$/u.test(n)).sort()
    .map(name=>({date:name.slice(0,10),data:read(path.join(directory,name))}));
  const cards=days.flatMap(day=>day.data.cards || []),latest=new Map(),bundles=new Map();
  for(const day of days)for(const row of day.data.queue || [])latest.set(row.event_id,{date:day.date,row});
  const pending=new Map();
  for(const {date,row} of latest.values()) {
    if(!row.deferral)continue;
    if(!bundles.has(date)) {
      const base=path.join(root,'01-SiteV2/content/11-databases/data-center-v4',date);
      const load=name=>fs.existsSync(path.join(base,name))?read(path.join(base,name)):[];
      bundles.set(date,{events:load('canonical-events.json'),claims:load('claims.json'),rawDocuments:load('raw-documents.json'),entities:load('entities.json')});
    }
    const bundle=bundles.get(date),event=bundle.events.find(e=>e.event_id===row.event_id);
    if(validResearchDeferral(event,bundle,row,cards))pending.set(row.event_id,row.deferral.reason);
  }
  return pending;
}
