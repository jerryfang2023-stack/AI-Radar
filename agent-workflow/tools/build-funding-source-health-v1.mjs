#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const root = path.resolve(args.get("root") || process.cwd());
const date = args.get("date") || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());
const sourceDir = path.resolve(args.get("source-dir") || path.join(root, "agent-workflow/reports/source-runs", date));
const outputFile = path.join(root, "01-SiteV2/site/data/funding-source-health-v1.json");
const fundingPattern = /(?:\bfunding\b|\bfunded\b|\braises?\b|\braised\b|\bpre[- ]?seed\b|\bseed round\b|\bseries [a-z]\b|融资|获投|完成.{0,8}轮)/iu;

function readJson(file, fallback = {}) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function dateOnly(value = "") {
  return String(value).match(/^\d{4}-\d{2}-\d{2}/u)?.[0] || "";
}

function sourceHealth() {
  if (!fs.existsSync(sourceDir)) return [];
  return fs.readdirSync(sourceDir)
    .filter((name) => name.endsWith("-source-intake-candidates.json"))
    .map((name) => {
      const data = readJson(path.join(sourceDir, name), {});
      const items = Array.isArray(data.items) ? data.items : [];
      const fundingCandidates = items.filter((item) => fundingPattern.test(`${item.title || ""} ${item.summary || ""}`));
      const urls = fundingCandidates.map((item) => String(item.url || "").replace(/[?#].*$/u, "")).filter(Boolean);
      const latestContentDate = fundingCandidates.map((item) => dateOnly(item.published_at)).filter(Boolean).sort().at(-1) || "";
      const failures = Array.isArray(data.failures) ? data.failures : [];
      const failureText = failures.join(" ");
      return {
        id: data.source_id || name.replace(/-source-intake-candidates\.json$/u, ""),
        status: data.status || (items.length ? "collected" : "empty"),
        last_success_at: items.length ? data.generated_at || "" : "",
        response_ms: data.response_ms ?? null,
        http_status: failureText.match(/\b(?:401|403|429|500|502|503|504)\b/u)?.[0] || (items.length ? "200" : ""),
        fetched_count: items.length,
        latest_content_date: latestContentDate,
        duplicate_rate: urls.length ? Number((1 - new Set(urls).size / urls.length).toFixed(4)) : 0,
        stale_rate: fundingCandidates.length ? Number((fundingCandidates.filter((item) => dateOnly(item.published_at) < date).length / fundingCandidates.length).toFixed(4)) : 0,
        funding_candidate_count: fundingCandidates.length,
        verified_event_count: 0,
        failures,
        fallback_used: failures.some((item) => /fallback/iu.test(item)),
      };
    });
}

function main() {
  const rawChannels = sourceHealth();
  const fundingBundle = readJson(path.join(root, "01-SiteV2/content/12-applications/funding-insights", `${date}.json`), null);
  const frontstage = readJson(path.join(root, "01-SiteV2/site/data/funding-insights-v1.json"), { meta: {}, cards: [] });
  const verifiedCount = Array.isArray(fundingBundle?.cards) ? fundingBundle.cards.length : 0;
  const verifiedSourceUrls = new Set(
    (fundingBundle?.cards || [])
      .flatMap((card) => card.research_sources || [])
      .map((source) => String(source.source_url || "").replace(/[?#].*$/u, ""))
      .filter(Boolean),
  );
  const channels = rawChannels.map((channel) => {
    const data = readJson(path.join(sourceDir, `${channel.id}-source-intake-candidates.json`), {});
    const verifiedUrls = new Set(
      (data.items || [])
        .map((item) => String(item.url || "").replace(/[?#].*$/u, ""))
        .filter((url) => verifiedSourceUrls.has(url)),
    );
    return { ...channel, verified_event_count: verifiedUrls.size };
  });
  const projectionCurrent = frontstage.meta?.last_checked_date === date || frontstage.meta?.latest_date === date;
  const anyReturned = channels.some((item) => item.fetched_count > 0);
  const candidateCount = channels.reduce((sum, item) => sum + item.funding_candidate_count, 0);
  const state = !anyReturned
    ? "source_no_data"
    : candidateCount === 0
      ? "no_real_funding_event"
      : verifiedCount === 0
        ? "candidate_evidence_insufficient"
        : !projectionCurrent
          ? "projection_failed"
          : args.get("published") === "false"
            ? "site_not_deployed"
            : "healthy";
  const payload = {
    schema_version: "FUNDING-SOURCE-HEALTH-V1.0",
    generated_at: new Date().toISOString(),
    date,
    status: state === "healthy" ? "passed" : "degraded",
    state,
    last_checked_date: date,
    latest_financing_date: frontstage.meta?.latest_financing_date || frontstage.meta?.latest_date || "",
    totals: {
      fetched: channels.reduce((sum, item) => sum + item.fetched_count, 0),
      funding_candidates: candidateCount,
      verified_events: verifiedCount,
    },
    channels,
  };
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ ok: true, output: path.relative(root, outputFile), status: payload.status, state }, null, 2));
}

main();
