import {sourceTextHash} from '../deepseek-translation-client.mjs';
import {evaluateModelAssistCandidate,stableModelAssistId,withGateResult} from '../model-assist-v1.mjs';

// A review belongs to one original, not one daily Raw ID. Preserve the actual
// reviewer/time and recheck every source/span gate; never carry entity merges.
export function reusableAcceptedSourceRepairs({date,raws=[],currentCandidates=[],history=[]}) {
  const cutoff=new Date(Date.parse(date+'T00:00:00Z')-7*86400000).toISOString().slice(0,10);
  const url=raw=>String(raw.canonical_url || raw.source_url || '').trim();
  const output=[];
  for(const raw of raws){
    if(!raw.raw_id || !raw.source_artifact_id || raw.extraction_status==='quarantined' || !raw.body_clean || !url(raw) || !raw.published_at)continue;
    if(currentCandidates.some(c=>c.task_type==='qa_repair' && c.source_ref===raw.source_artifact_id && c.review?.reviewer))continue;
    const previous=history.filter(s=>s.date>=cutoff && s.date<date).flatMap(store=>
      store.candidates.filter(c=>c.task_type==='qa_repair' && c.provider==='manual_review'
        && c.source_ref===raw.source_artifact_id && c.review?.reviewer)
        .map(candidate=>({candidate,date:store.date,raw:store.raws.find(r=>r.raw_id===candidate.raw_id)})))
      .filter(row=>row.raw?.source_artifact_id===raw.source_artifact_id && url(row.raw)===url(raw))
      .sort((a,b)=>String(b.candidate.review.reviewed_at).localeCompare(String(a.candidate.review.reviewed_at)) || b.date.localeCompare(a.date));
    const prior=previous[0],c=prior?.candidate;
    if(!c || c.status!=='accepted' || c.review.decision!=='accept'
      || !Number.isFinite(Date.parse(c.review.reviewed_at)) || c.review.reviewed_at.slice(0,10)<cutoff
      || c.review.reviewed_at.slice(0,10)>date
      || prior.raw.published_at!==raw.published_at
      || c.proposal?.action!=='extract_claim' || !c.proposal.claims?.length
      || c.source_hash!==sourceTextHash(raw.body_clean)
      || evaluateModelAssistCandidate(c,raw.body_clean).length)continue;
    const adopted=structuredClone(c);
    adopted.candidate_id=stableModelAssistId(date,c.task_type,c.asset_id,c.source_hash,c.prompt_version);
    adopted.raw_id=raw.raw_id;
    adopted.generated_at=new Date().toISOString();
    adopted.review.note=(c.review.note || '').split('\n[accepted-source-repair-reuse]')[0]
      +`\n[accepted-source-repair-reuse] ${prior.date}/${c.candidate_id}; identical URL, original date, source hash and exact spans; original approval retained.`;
    output.push(withGateResult(adopted,raw.body_clean));
  }
  return output;
}
