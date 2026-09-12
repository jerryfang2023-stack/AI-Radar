// Only explicitly authorized historical sources scope CN application coverage.
// Ordinary daily events and every individual card evidence gate stay unchanged.
export function chinaFundingPublicationScope(events, policy = {}) {
  if (policy.application_market_region !== "CN" || policy.authorized_by !== "explicit_user_request_2026_china_funding_backfill") return { events, outside_market: [] };
  const sources = new Set(policy.source_refs || []);
  const outside_market = events.filter((event) => (event.source_refs || []).some((id) => sources.has(id))
    && String(event.disclosed_at || "").slice(0, 10) >= policy.from && String(event.disclosed_at || "").slice(0, 10) <= policy.to
    && event.market_scope?.china_market_match !== true).map((event) => event.event_id);
  const excluded = new Set(outside_market);
  return { events: events.filter((event) => !excluded.has(event.event_id)), outside_market };
}
