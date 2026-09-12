const key = (value = "") => String(value).replace(/[?#].*$/u, "").replace(/\/$/u, "");
const count = (items) => new Set(items.filter(Boolean)).size;

export function buildChinaFundingHealth({ date, discovery, raw = [], artifacts = [], claims = [], events = [], entities = [], cards = [], stages = [], generatedAt = new Date().toISOString() }) {
  const available = discovery?.date === date && Array.isArray(discovery.diagnostics);
  const rows = available ? discovery.diagnostics.map((source) => {
    const urls = new Set((discovery.items || []).filter((item) => (source.registry_id && item.source_registry_id === source.registry_id) || item.source === source.name).map((item) => key(item.url)));
    const sources = artifacts.filter((item) => urls.has(key(item.source_url)) || urls.has(key(item.canonical_url)));
    const sourceIds = new Set(sources.map((item) => item.source_artifact_id));
    const documents = raw.filter((item) => sourceIds.has(item.source_artifact_id));
    const rawIds = new Set(documents.map((item) => item.raw_id));
    const acceptedClaims = claims.filter((item) => rawIds.has(item.raw_id) && item.verification_status === "accepted");
    const matchedEvents = events.filter((item) => item.publication_status === "verified" && (item.source_refs || []).some((id) => sourceIds.has(id)));
    const fundingEvents = matchedEvents.filter((item) => /funding|financing/iu.test(item.event_type || ""));
    const cardMatches = cards.filter((card) => (card.research_sources || []).some((item) => urls.has(key(item.source_url))));
    return { ...source, raw_count: documents.length, readable_count: documents.filter((item) => ["accepted", "partial"].includes(item.extraction_status) && item.body_length > 0).length,
      accepted_claims: acceptedClaims.length, verified_event_ids: matchedEvents.map((item) => item.event_id), funding_event_ids: fundingEvents.map((item) => item.event_id),
      china_funding_event_ids: fundingEvents.filter((item) => item.market_scope?.china_market_match === true).map((item) => item.event_id),
      card_ids: cardMatches.map((item) => item.funding_insight_id),
      latest_disclosure: documents.map((item) => item.published_at || "").sort().at(-1) || null };
  }) : [];
  const eventIds = new Set(rows.flatMap((row) => row.verified_event_ids));
  const linkedEntities = new Set(events.filter((event) => eventIds.has(event.event_id)).flatMap((event) => event.entities || []));
  const failedStage = stages.find((stage) => stage.status === "failed");
  return { schema_version: "CHINA-FUNDING-HEALTH-V1.0", date, generated_at: generatedAt,
    status: !available ? "not_run" : failedStage ? "failed" : rows.every((row) => row.status === "failed") ? "source_failed" : stages.some((stage) => stage.id === "projections" && stage.status === "passed") ? rows.some((row) => row.status !== "collected" && row.status !== "empty") ? "partial" : "passed" : "discovered",
    last_collection_at: discovery?.generated_at || null, failed_stage: failedStage?.id || null, stages, sources: rows,
    totals: !available ? null : { sources_attempted: rows.length, sources_failed: rows.filter((row) => row.status === "failed").length,
      candidates: count((discovery.items || []).map((item) => key(item.url))), readable_documents: rows.reduce((sum, row) => sum + row.readable_count, 0),
      accepted_claims: rows.reduce((sum, row) => sum + row.accepted_claims, 0), verified_events: eventIds.size,
      funding_events: count(rows.flatMap((row) => row.funding_event_ids)), china_funding_events: count(rows.flatMap((row) => row.china_funding_event_ids)),
      linked_organizations: entities.filter((item) => linkedEntities.has(item.entity_id) && /organization/u.test(item.entity_type)).length,
      linked_products: entities.filter((item) => linkedEntities.has(item.entity_id) && /product/u.test(item.entity_type)).length,
      published_card_matches: count(rows.flatMap((row) => row.card_ids)) },
    publication: { status: "awaiting_publication_receipt" },
    metric_note: "候选按原文URL去重，事件及卡片跨来源按ID去重；组织含公司和投资主体。仅成功接纳的事实同步实体库，未核验产品保留候选；匹配已有卡不等于当日新增卡。来源失败不计为零事件日。" };
}
