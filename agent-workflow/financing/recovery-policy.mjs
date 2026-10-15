// Reconcile durable receipts before retrying. All times are UTC instants.
export function reconcileDispatchAttempts(attempts,runs,date,now=Date.now()) {
  return attempts.map(attempt=>{
    if(attempt.status!=='unknown')return attempt;
    const started=Date.parse(attempt.started_at);
    if(!Number.isFinite(started))return attempt;
    const matches=runs.filter(run=>run.display_title===`Financing ${date}` && run.event==='workflow_dispatch'
      && run.head_branch==='main' && Date.parse(run.created_at)>=started-5000);
    if(matches.length)return {...attempt,status:'submitted',observed_run_ids:matches.map(run=>run.id),reconciled_at:new Date(now).toISOString()};
    // Two complete API observations, at least ten minutes apart, are required
    // before concluding a dispatch never reached GitHub.
    if(!attempt.absent_since)return {...attempt,absent_since:new Date(now).toISOString()};
    return now-Date.parse(attempt.absent_since)>=600000
      ? {...attempt,status:'not_submitted',reconciled_at:new Date(now).toISOString()} : attempt;
  });
}

export function dispatchRecoveryAllowed(state,dispatch,now=Date.now()) {
  if(dispatch.status!=='planned')return true;
  const attempts=state.dispatch_attempts || [];
  if(attempts.some(a=>a.status==='unknown'))return false;
  const submitted=attempts.filter(a=>a.status==='submitted');
  if(!dispatch.resume_run_id)return submitted.filter(a=>!a.resume_run_id).length<3;
  const recovery=submitted.filter(a=>a.resume_run_id);
  if(!recovery.length)return true;
  const wait=Math.min(60,10*2**Math.min(3,recovery.length-1))*60000;
  return now-Date.parse(recovery.at(-1).started_at)>=wait;
}

export function completedReview(review,{date,head}) {
  return review?.date===date && review.head_sha===head && ['approved','hold'].includes(review.verdict)
    && ['sources','facts','scope','classification','preservation'].every(key=>typeof review.checks?.[key]==='boolean')
    && Array.isArray(review.evidence) && review.evidence.every(x=>typeof x==='string')
    && Array.isArray(review.issues) && review.issues.every(x=>typeof x==='string');
}
export function reviewRetryDue(attempt,now=Date.now()) {
  return !attempt?.next_retry_at || now>=Date.parse(attempt.next_retry_at);
}
export function nextReviewAttempt(prior,now=Date.now()) {
  const count=(prior?.count || 0)+1;
  return {count,started_at:new Date(now).toISOString(),next_retry_at:new Date(now+Math.min(60,10*2**Math.min(count-1,3))*60000).toISOString()};
}
