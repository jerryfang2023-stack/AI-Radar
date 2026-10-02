// A migration/republication receipt is not evidence of completed discovery.
export function acceptedPublicationStatus(publication, date) {
  if (publication?.date !== date || publication.migration?.new_discovery_not_run) return null;
  return ['ready_for_review', 'no_new_financing', 'pending_verification'].includes(publication.status)
    ? (publication.status === 'ready_for_review' ? 'awaiting_portal' : publication.status)
    : null;
}

export function pendingReviewStatus(prs, date, checksStatus = 'waiting') {
  const pr = prs.find(row => row.state === 'OPEN' && row.headRefName === `automation/financing-${date}`);
  const status = checksStatus === 'passed' ? 'ready_for_review' : checksStatus === 'failed' ? 'ci_failed' : 'checks_pending';
  return pr ? { date, status, pr_url: pr.url, head_sha: pr.headRefOid } : null;
}
