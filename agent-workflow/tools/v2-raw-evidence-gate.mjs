import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const allowedStatuses = new Set(["indexed", "candidate", "pooled", "asset_used", "archived", "ignored"]);
const allowedQuality = new Set(["high", "medium", "low", "failed"]);
const allowedVolatility = new Set(["low", "medium", "high"]);
const allowedCaptureScope = new Set(["article_text", "visible_text", "thread_text", "post_and_top_comments", "summary_only", "aihot_visible_text", "none"]);
const allowedEvidenceLevel = new Set(["core_evidence_candidate", "supporting_evidence", "community_signal", "user_feedback_signal", "discovery_only", "weak_signal"]);
const allowedSourceRole = new Set(["primary_source", "discovery_source"]);
const allowedResearchStatus = new Set(["preprint", "formal_report", "peer_reviewed", "not_research", "unknown"]);
const allowedPoolRoutes = new Set(["core_pool", "emerging_pool", "user_feedback_pool", "watchlist", "index_only", "discard"]);
const allowedExcerptTypes = new Set([
  "company_action",
  "product_update",
  "number",
  "quote",
  "case_detail",
  "workflow_change",
  "funding",
  "risk",
  "opinion",
]);
const allowedSupports = new Set(["viewpoint", "case", "change", "trend", "daily_observation", "heatmap"]);
const usableKeys = new Set(["viewpoint", "case", "change", "trend", "daily_observation", "heatmap", "briefing", "emerging_pool", "user_feedback_pool", "watchlist"]);

const requiredTopLevel = [
  "schema_version",
  "raw_id",
  "title",
  "original_url",
  "canonical_url",
  "source_name",
  "source_type",
  "source_level",
  "acquisition_source_level",
  "acquisition_channel",
  "research_status",
  "search_intent",
  "search_path",
  "search_path_label",
  "author",
  "published_at",
  "collected_at",
  "language",
  "full_text",
  "clean_text",
  "markdown_snapshot",
  "fetch_status",
  "extraction_quality",
  "has_full_text",
  "content_length",
  "fetch_error",
  "source_volatility",
  "community_name",
  "capture_scope",
  "visible_range",
  "evidence_level",
  "discovery_source",
  "discovery_record",
  "source_role",
  "origin_fetch_status",
  "paywall_status",
  "block_status",
  "duplicate_status",
  "url_hash",
  "content_hash",
  "full_text_hash",
  "semantic_hash",
  "duplicate_of",
  "first_seen_at",
  "last_seen_at",
  "update_detected",
  "key_excerpts",
  "business_elements",
  "evidence_seed",
  "guanlan_scores",
  "usable_for",
  "pool_routes",
  "missing_information",
  "raw_status",
];

const businessElementKeys = [
  "companies",
  "products",
  "people",
  "industries",
  "roles",
  "workflows",
  "business_actions",
  "affected_departments",
  "numbers",
  "quotes",
];

const evidenceSeedKeys = [
  "company_actions",
  "case_details",
  "workflow_changes",
  "before_after_clues",
  "affected_roles",
  "risks_or_constraints",
];

const scoreKeys = [
  "commercial_value",
  "novelty",
  "evidence_strength",
  "case_richness",
  "trend_relevance",
  "guanlan_relevance",
  "emerging_signal_score",
];

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function validateRawRecord(record, file) {
  const issues = [];
  for (const key of requiredTopLevel) {
    if (!(key in record)) issues.push(`${rel(file)} missing ${key}`);
  }

  if (record.schema_version !== "raw-evidence-v2") issues.push(`${rel(file)} schema_version must be raw-evidence-v2`);
  if (!allowedQuality.has(record.extraction_quality)) issues.push(`${rel(file)} invalid extraction_quality=${record.extraction_quality}`);
  if (!allowedStatuses.has(record.raw_status)) issues.push(`${rel(file)} invalid raw_status=${record.raw_status}`);
  if (!allowedVolatility.has(record.source_volatility)) issues.push(`${rel(file)} invalid source_volatility=${record.source_volatility}`);
  if (!allowedCaptureScope.has(record.capture_scope)) issues.push(`${rel(file)} invalid capture_scope=${record.capture_scope}`);
  if (!allowedEvidenceLevel.has(record.evidence_level)) issues.push(`${rel(file)} invalid evidence_level=${record.evidence_level}`);
  if (!allowedSourceRole.has(record.source_role)) issues.push(`${rel(file)} invalid source_role=${record.source_role}`);
  if (!allowedResearchStatus.has(record.research_status)) issues.push(`${rel(file)} invalid research_status=${record.research_status}`);
  if (typeof record.has_full_text !== "boolean") issues.push(`${rel(file)} has_full_text must be boolean`);
  if (typeof record.content_length !== "number") issues.push(`${rel(file)} content_length must be number`);
  if (typeof record.full_text !== "string") issues.push(`${rel(file)} full_text must be string`);
  if (!record.full_text_hash) issues.push(`${rel(file)} missing full_text_hash`);
  if (!Array.isArray(record.key_excerpts)) issues.push(`${rel(file)} key_excerpts must be array`);
  if (!Array.isArray(record.missing_information)) issues.push(`${rel(file)} missing_information must be array`);
  if (!Array.isArray(record.pool_routes)) issues.push(`${rel(file)} pool_routes must be array`);
  for (const route of record.pool_routes || []) {
    if (!allowedPoolRoutes.has(route)) issues.push(`${rel(file)} invalid pool_route=${route}`);
  }

  if (Array.isArray(record.key_excerpts)) {
    record.key_excerpts.forEach((excerpt, index) => {
      if (!isObject(excerpt)) {
        issues.push(`${rel(file)} key_excerpts[${index}] must be object`);
        return;
      }
      if (!allowedExcerptTypes.has(excerpt.type)) issues.push(`${rel(file)} key_excerpts[${index}] invalid type=${excerpt.type}`);
      if (!Array.isArray(excerpt.supports)) issues.push(`${rel(file)} key_excerpts[${index}].supports must be array`);
      for (const support of excerpt.supports || []) {
        if (!allowedSupports.has(support)) issues.push(`${rel(file)} key_excerpts[${index}] invalid support=${support}`);
      }
      if (!excerpt.text) issues.push(`${rel(file)} key_excerpts[${index}] missing text`);
      if (!excerpt.importance) issues.push(`${rel(file)} key_excerpts[${index}] missing importance`);
      if (!excerpt.confidence) issues.push(`${rel(file)} key_excerpts[${index}] missing confidence`);
    });
  }

  if (!isObject(record.business_elements)) {
    issues.push(`${rel(file)} business_elements must be object`);
  } else {
    for (const key of businessElementKeys) {
      if (!Array.isArray(record.business_elements[key])) issues.push(`${rel(file)} business_elements.${key} must be array`);
    }
  }

  if (!isObject(record.evidence_seed)) {
    issues.push(`${rel(file)} evidence_seed must be object`);
  } else {
    for (const key of evidenceSeedKeys) {
      if (!Array.isArray(record.evidence_seed[key])) issues.push(`${rel(file)} evidence_seed.${key} must be array`);
    }
  }

  if (!isObject(record.guanlan_scores)) {
    issues.push(`${rel(file)} guanlan_scores must be object`);
  } else {
    for (const key of scoreKeys) {
      const value = record.guanlan_scores[key];
      if (!Number.isInteger(value) || value < 1 || value > 5) issues.push(`${rel(file)} guanlan_scores.${key} must be integer 1-5`);
    }
  }

  if (!isObject(record.usable_for)) {
    issues.push(`${rel(file)} usable_for must be object`);
  } else {
    for (const key of usableKeys) {
      if (typeof record.usable_for[key] !== "boolean") issues.push(`${rel(file)} usable_for.${key} must be boolean`);
    }
  }

  if (record.has_full_text && ["low", "failed"].includes(record.extraction_quality)) {
    issues.push(`${rel(file)} has_full_text=true cannot pair with extraction_quality=${record.extraction_quality}`);
  }

  if (record.source_role === "discovery_source" && record.evidence_level !== "discovery_only" && record.evidence_level !== "weak_signal") {
    issues.push(`${rel(file)} discovery_source must use discovery_only or weak_signal evidence_level`);
  }

  if (record.source_volatility === "high" && /^summary-only-high-volatility/iu.test(record.fetch_status || "")) {
    issues.push(`${rel(file)} high-volatility source cannot be downgraded by source type alone`);
  }

  return issues;
}

export function runV2RawEvidenceGate({ date = new Date().toISOString().slice(0, 10) } = {}) {
  const rawDir = path.join(root, "01-SiteV2", "content", "01-raw", "originals", date);
  if (!fs.existsSync(rawDir)) {
    return {
      status: "skipped",
      report: `# V2 Raw Evidence Gate\n\n- date: ${date}\n- status: skipped\n- reason: no raw originals directory found\n`,
    };
  }

  const files = fs.readdirSync(rawDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(rawDir, name));

  const issues = [];
  if (files.length === 0) {
    issues.push(`${rel(rawDir)} has no raw-evidence-v2 JSON records`);
  }
  for (const file of files) {
    try {
      const record = JSON.parse(fs.readFileSync(file, "utf8"));
      issues.push(...validateRawRecord(record, file));
    } catch (error) {
      issues.push(`${rel(file)} invalid JSON: ${error.message}`);
    }
  }

  const status = issues.length ? "failed" : "passed";
  return {
    status,
    report: [
      "# V2 Raw Evidence Gate",
      "",
      `- date: ${date}`,
      `- status: ${status}`,
      `- checked_json_files: ${files.length}`,
      `- issue_count: ${issues.length}`,
      "",
      ...(issues.length ? ["## Issues", "", ...issues.map((issue) => `- ${issue}`), ""] : []),
    ].join("\n"),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = runV2RawEvidenceGate({ date: args.get("date") || new Date().toISOString().slice(0, 10) });
  console.log(result.report);
  process.exit(result.status === "failed" ? 1 : 0);
}
