import fs from 'node:fs';
import { digest } from './state.mjs';
export const taxonomy=JSON.parse(fs.readFileSync(new URL('./taxonomy.json',import.meta.url),'utf8'));
export function classificationInput(card) {
  const refs=[...(card.company?.evidence_refs || []),...(card.products || []).flatMap(row=>row.evidence_refs || [])];
  const evidence=[...new Map(refs.filter(row=>row.quote && row.source_id).map(row=>[`${row.source_id}:${row.quote}`,{source_id:row.source_id,quote:row.quote}])).values()].slice(0,12);
  const input={id:card.triggered_by_event_id,company:card.company?.name || '',products:(card.products || []).map(row=>row.name),evidence};
  return {...input,input_hash:digest([taxonomy,input])};
}
export function classificationProblems(row,input) {
  const issues=[];
  if(row?.id!==input.id) return ['event_identity_mismatch'];
  if(!['included','excluded','review'].includes(row.scope)) issues.push('scope_invalid');
  const sector=taxonomy.sectors.find(item=>item.id===row.sector_id);
  const indices=row.evidence_indices;
  if(!Array.isArray(indices) || indices.some(i=>!Number.isInteger(i) || !input.evidence[i])) issues.push('invalid_evidence_index');
  if(row.scope!=='review' && !indices?.length) issues.push('evidence_required');
  if(row.scope==='included') {
    if(!sector || !sector.subsectors.some(item=>item.id===row.subsector_id)) issues.push('invalid_sector_tuple');
    if(row.product_form_id && !taxonomy.product_forms.some(item=>item.id===row.product_form_id)) issues.push('invalid_product_form');
    if(!Array.isArray(row.customer_ids) || row.customer_ids.length>3 || row.customer_ids.some(id=>!taxonomy.customers.some(item=>item.id===id))) issues.push('invalid_customer');
  }
  if(row.scope==='excluded' && !['embodied_robotics','not_ai_business'].includes(row.exclusion_reason)) issues.push('invalid_exclusion_reason');
  if(!String(row.rationale || '').trim()) issues.push('rationale_required');
  return issues;
}
export function displayClassification(decision) {
  const sector=taxonomy.sectors.find(row=>row.id===decision?.sector_id);
  const subsection=sector?.subsectors.find(row=>row.id===decision?.subsector_id);
  return {version:taxonomy.version,scope:decision?.scope || 'review',status:decision?.scope==='included'?'classified':'pending',
    sector:sector?{id:sector.id,name:sector.name}:{id:'unclassified',name:'待分类'},
    subsector:subsection || {id:'unclassified',name:'待分类'},
    product_form:taxonomy.product_forms.find(row=>row.id===decision?.product_form_id) || null,
    customers:taxonomy.customers.filter(row=>decision?.customer_ids?.includes(row.id)),
    evidence_refs:decision?.evidence_refs || [],rationale:decision?.rationale || '原文业务证据待补充'};
}
