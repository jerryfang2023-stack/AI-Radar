// A migration/republication receipt is not evidence of completed discovery.
export function activeProductionRun(matching, preflightRun) {
  return matching.filter(run=>run.status!=='completed' && (!preflightRun || run.databaseId<Number(preflightRun)))
    .sort((a,b)=>a.databaseId-b.databaseId)[0];
}
export function acceptedPublicationStatus(publication, date) {
  if (publication?.date !== date || publication.migration?.new_discovery_not_run) return null;
  if (publication.status === 'pending_verification' && publication.verification?.status !== 'completed') return 'verification_required';
  return ['ready_for_review', 'no_new_financing', 'pending_verification'].includes(publication.status)
    ? (publication.status === 'ready_for_review' ? 'awaiting_portal' : publication.status)
    : null;
}

export function pendingReviewStatus(prs, date, checksStatus = 'waiting', details = {}) {
  const pr = prs.find(row => row.state === 'OPEN' && row.headRefName === `automation/financing-${date}`);
  const status = checksStatus === 'passed' ? 'ready_for_review' : checksStatus === 'failed' ? 'ci_failed' : checksStatus === 'awaiting_approval' ? 'awaiting_approval' : 'checks_pending';
  return pr ? { date, status, pr_url: pr.url, head_sha: pr.headRefOid,
    ...(details.run_id ? {ci_run_id:details.run_id,ci_run_url:details.run_url} : {}),
    ...(details.reason ? {reason:details.reason} : {}) } : null;
}
