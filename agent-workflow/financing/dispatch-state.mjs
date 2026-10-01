// A migration/republication receipt is not evidence of completed discovery.
export function acceptedPublicationStatus(publication, date) {
  if (publication?.date !== date || publication.migration?.new_discovery_not_run) return null;
  return ['ready_for_review', 'no_new_financing', 'pending_verification'].includes(publication.status)
    ? (publication.status === 'ready_for_review' ? 'awaiting_portal' : publication.status)
    : null;
}
