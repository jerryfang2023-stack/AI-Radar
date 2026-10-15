import {digest} from './state.mjs';

const version='FINANCING-RESEARCH-DEFERRAL-1';
const allowedReasons=new Set(['research_sources_insufficient','research_independent_sources_insufficient']);
const cardEvents=card=>[card.triggered_by_event_id,...(card.source_event_ids || [])];

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
    || row.problems.some(reason=>!allowedReasons.has(reason)) || cards.some(card=>cardEvents(card).includes(event.event_id)))return null;
  const evidence=binding(event,bundle);
  if(!evidence)return null;
  return {version,event_id:event.event_id,status:'pending_verification',reason:row.problems.join('|'),
    ...evidence,next_action:'recover_existing_originals_and_complete_independent_research',fact_approval:false};
}

export function validResearchDeferral(event,bundle,row,cards=[]) {
  const expected=researchDeferral(event,bundle,row,cards);
  return Boolean(expected && row.deferral && digest(expected)===digest(row.deferral));
}
