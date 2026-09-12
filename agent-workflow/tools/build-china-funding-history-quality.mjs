#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isEligibleFundingInsightEvent } from "./funding-insight-v1-utils.mjs";

const normalized = (value) => String(value || "").toLowerCase().replace(/[\s·（）().]/gu, "");
const urlKey = (value) => String(value || "").replace(/[?#].*$/u, "").replace(/\/$/u, "");
export function historyCaseClosure(ledger, { raws = [], claims = [], events = [], cards = [], outcomes = [], queue = [] } = {}) {
  const rawBySource = new Map(raws.map((row) => [row.source_artifact_id, row]));
  const claimById = new Map(claims.map((row) => [row.claim_id, row]));
  const outcomeByRaw = new Map(outcomes.map((row) => [row.raw_id, row]));
  return ledger.cases.map((row) => {
    const urls = new Set(row.original_candidates.map((item) => urlKey(item.url)));
    const originals = raws.filter((raw) => urls.has(urlKey(raw.source_url)));
    const name = normalized(row.company_hint);
    const subject = name.length > 4 ? name.replace(/ai$/u, "") : name;
    const matches = events.filter((event) => event.event_type === "funding" && event.publication_status === "verified"
      && event.source_refs?.some((id) => urls.has(urlKey(rawBySource.get(id)?.source_url)))
      && event.claim_refs?.some((id) => normalized(claimById.get(id)?.subject).includes(subject))
      && Math.abs(Date.parse(event.disclosed_at?.slice(0, 10)) - Date.parse(row.date_hint)) <= 14 * 86400000);
    const eventIds = new Set(matches.map((event) => event.event_id));
    // A card for another round of the same company is not a completed case.
    const exactCards = cards.filter((card) => [card.triggered_by_event_id, ...(card.source_event_ids || [])].some((id) => eventIds.has(id)));
    const decisions = originals.map((raw) => outcomeByRaw.get(raw.raw_id)).filter(Boolean);
    const chinaEvents = matches.filter((event) => event.market_scope?.china_market_match === true);
    const cardAttempts = queue.filter((item) => chinaEvents.some((event) => event.event_id === item.event_id));
    const eligible = chinaEvents.filter((event) => isEligibleFundingInsightEvent(event, claims));
    const status = exactCards.length && chinaEvents.length ? "card_available"
      : chinaEvents.length && !eligible.length ? "card_evidence_incomplete"
        : cardAttempts.some((item) => item.status === "blocked") ? "card_research_blocked" : chinaEvents.length ? "card_pending"
      : matches.length ? "market_verification_pending" : !row.original_candidates.length ? "original_source_unresolved"
        : originals.length ? "fact_verification_pending" : "original_capture_pending";
    const missing = exactCards.flatMap((card) => [
      !card.financing?.round_code ? "round" : "", !card.financing?.amount ? "amount" : "",
      !card.financing?.announced_at ? "announced_at" : "",
      !card.financing?.investors?.length && card.financing?.investor_disclosure_status !== "not_disclosed" ? "investors" : "",
      !card.products?.length ? "product" : "",
    ].filter(Boolean));
    return { case_id: row.case_id, company_hint: row.company_hint, date_hint: row.date_hint, round_hint: row.round_hint, status,
      original_candidate_count: row.original_candidates.length, captured_originals: originals.length,
      readable_originals: originals.filter((raw) => ["accepted", "partial"].includes(raw.extraction_status) && raw.body_length > 0).length,
      secondary_search_attempts: row.secondary_searches?.length || 0,
      secondary_search_failures: row.secondary_searches?.filter((attempt) => attempt.status === "failed").length || 0,
      event_ids: [...eventIds], china_event_ids: chinaEvents.map((event) => event.event_id), card_ids: exactCards.map((card) => card.funding_insight_id),
      card_research: cardAttempts.map((item) => ({ event_id: item.event_id, status: item.status, problems: item.problems || [], query_count: item.queries?.length || 0 })),
      secondary_review: row.secondary_review || null,
      missing_fields: [...new Set(missing)], source_decisions: decisions.map((item) => ({ raw_id: item.raw_id, status: item.status, reason: String(item.reason || "").slice(0, 400) })) };
  });
}
export function buildHistoryQuality(root, from = "2026-01-01", to = "2026-09-12", date = "2026-09-12") {
  const read = (file, fallback) => fs.existsSync(path.join(root, file)) ? JSON.parse(fs.readFileSync(path.join(root, file), "utf8")) : fallback;
  const lane = `agent-workflow/reports/china-funding-history/${from}_${to}`;
  const ledger = read(`${lane}/systematic-ledger.json`, { cases: [], months: [], index: {} });
  const base = `01-SiteV2/content/11-databases/data-center-v4/${date}`;
  const outcomes = read(`${lane}/extraction-coverage.json`, {});
  const sourceIds = new Set(read(`${base}/historical-funding-authorization.json`, {}).source_refs || []);
  const authorizedRaws = read(`${base}/raw-documents.json`, []).filter((raw) => sourceIds.has(raw.source_artifact_id));
  const attemptedIds = new Set((outcomes.items || []).filter((item) => item.status !== "failed").map((item) => item.raw_id));
  const extractionPending = authorizedRaws.filter((raw) => !attemptedIds.has(raw.raw_id)).length;
  const cases = historyCaseClosure(ledger, { raws: read(`${base}/raw-documents.json`, []), claims: read(`${base}/claims.json`, []), events: read(`${base}/canonical-events.json`, []), cards: read("01-SiteV2/site/data/funding-insights-v1.json", {}).cards || [], outcomes: outcomes.items || [], queue: read(`01-SiteV2/content/12-applications/funding-insights/${date}.json`, {}).queue || [] });
  const count = (rows, status) => rows.filter((row) => row.status === status).length;
  const result = { schema_version: "CHINA-FUNDING-HISTORY-QUALITY-V1.0", from, to, date, generated_at: new Date().toISOString(), status: !cases.length ? "not_run" : extractionPending || count(cases, "card_pending") ? "in_progress" : "processed_with_gaps",
    index_pages: ledger.index.pages?.length || 0, historical_boundary_reached: ledger.index.historical_boundary_reached === true,
    totals: { index_cases: cases.length, cases_with_candidates: cases.filter((row) => row.original_candidate_count).length,
      cases_with_captured_originals: cases.filter((row) => row.captured_originals).length, cases_with_verified_china_event: cases.filter((row) => row.china_event_ids.length).length,
      cases_with_exact_cards: count(cases, "card_available"), pending_cards: count(cases, "card_pending"), unresolved_originals: count(cases, "original_source_unresolved"),
      secondary_search_failures: cases.reduce((sum, row) => sum + row.secondary_search_failures, 0),
      extraction_unfinished_sources: extractionPending, card_research_blocked: count(cases, "card_research_blocked"), card_evidence_incomplete: count(cases, "card_evidence_incomplete"),
      case_statuses: Object.fromEntries([...new Set(cases.map((row) => row.status))].map((status) => [status, count(cases, status)])) },
    months: ledger.months.map((month) => { const rows = cases.filter((row) => row.date_hint.startsWith(month.month)); return { ...month, captured_cases: rows.filter((row) => row.captured_originals).length,
      verified_china_cases: rows.filter((row) => row.china_event_ids.length).length, card_cases: count(rows, "card_available"), pending_cases: rows.length - count(rows, "card_available") }; }), cases,
    metric_note: "索引条目是待核验线索，不能当作融资事件。逐月按主体、披露日期及原文关联事件，卡片仅统计明确引用对应事件的记录；同公司其他轮次卡片不算完成。公开未披露字段与检索失败分别保留。" };
  for (const file of [`${lane}/systematic-quality.json`, "01-SiteV2/site/data/china-funding-history-quality-v1.json"]) fs.writeFileSync(path.join(root, file), JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result.totals));
  return result;
}
if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) buildHistoryQuality(process.cwd());
