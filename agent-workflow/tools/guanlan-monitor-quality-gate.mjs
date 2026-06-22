import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const reportsDir = path.join(root, "agent-workflow", "reports");
const defaultConfigPath = path.join(root, "01-SiteV2", "content", "11-databases", "monitor-quality-gate-v2.json");

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function firstExisting(paths) {
  for (const file of paths) {
    if (fs.existsSync(file)) return file;
  }
  return "";
}

function parseFrontMatterValue(text, key, fallback = "") {
  const matcher = new RegExp(`^${key}:\\s*(.+)$`, "m");
  const match = text.match(matcher);
  return match ? String(match[1]).replace(/^"|"$/g, "").trim() : fallback;
}

function parseBulletMap(text) {
  const map = {};
  for (const line of String(text || "").split(/\r?\n/u)) {
    const match = line.match(/^- ([a-zA-Z0-9_]+):\s*(.*)$/u);
    if (!match) continue;
    map[match[1]] = match[2].trim();
  }
  return map;
}

function parseDistribution(value = "") {
  const out = {};
  if (!value || value === "none" || value === "-") return out;
  for (const part of String(value).split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [rawKey, rawVal] = trimmed.split("=");
    if (!rawKey) continue;
    const key = rawKey.trim();
    const number = Number((rawVal || "").trim());
    out[key] = Number.isFinite(number) ? number : 0;
  }
  return out;
}

function sumValues(map = {}) {
  return Object.values(map).reduce((acc, value) => acc + (Number(value) || 0), 0);
}

function parseNumber(value, fallback = 0) {
  const number = Number(String(value || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : fallback;
}

function parseFailedSources(text = "") {
  const value = String(text || "").trim();
  if (!value || value === "none") return [];
  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function weekdayNameForDate(value = "") {
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/u);
  if (!match) return "";
  const [, yyyy, mm, dd] = match;
  const day = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd), 12)).getUTCDay();
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][day] || "";
}

function parseCoverageGapEntries(value = "") {
  const text = String(value || "").trim().toLowerCase();
  if (!text || text === "none" || text === "unknown") return [];
  return text
    .split(/[;,]/u)
    .map((part) => {
      const match = part.trim().match(/^([a-z0-9_/-]+)\s*=\s*(\d+)\s*\/\s*(\d+)$/iu);
      if (!match) return null;
      return {
        key: match[1],
        actual: Number(match[2]),
        required: Number(match[3]),
      };
    })
    .filter(Boolean);
}

function weekendPolicyState(config = {}, targetDate = "") {
  const policy = config.weekend_release_policy || {};
  const weekday = weekdayNameForDate(targetDate);
  const appliesOn = Array.isArray(policy.applies_on) ? policy.applies_on.map((item) => String(item).toLowerCase()) : [];
  return {
    policy,
    weekday,
    active: Boolean(policy.enabled) && appliesOn.includes(weekday),
  };
}

function parseLineInBlock(block = "", key = "") {
  const pattern = new RegExp(`^-\\s*${key}:\\s*(.+)$`, "im");
  const match = String(block || "").match(pattern);
  return match ? match[1].trim() : "";
}

function parsePoolItems(poolMarkdown = "") {
  return String(poolMarkdown || "")
    .split(/\r?\n##\s+/u)
    .slice(1)
    .map((block) => {
      const title = String(block.split(/\r?\n/u)[0] || "").replace(/^P-\d+\s*[|｜-]?\s*/u, "").trim();
      const routes = parseLineInBlock(block, "pool_routes")
        .split(/,\s*/u)
        .map((item) => item.trim())
        .filter(Boolean);
      return {
        title,
        routes,
        sourceName: parseLineInBlock(block, "source"),
        sourceUrl: parseLineInBlock(block, "source_url"),
        acquisitionChannel: parseLineInBlock(block, "acquisition_channel"),
        sourceLevel: parseLineInBlock(block, "source_level"),
        acquisitionSourceLevel: parseLineInBlock(block, "acquisition_source_level"),
        evidenceObjectType: parseLineInBlock(block, "evidence_object_type"),
        evidenceObjectUsable: /^true$/iu.test(parseLineInBlock(block, "evidence_object_usable")),
        eventEvidence: /^true$/iu.test(parseLineInBlock(block, "event_evidence")),
        indexOnlyEvidence: /^true$/iu.test(parseLineInBlock(block, "index_only_evidence")),
        rawQcDecision: parseLineInBlock(block, "raw_qc_decision"),
        rawQcDownstreamUse: parseLineInBlock(block, "raw_qc_downstream_use"),
        hasFullText: /^true$/iu.test(parseLineInBlock(block, "has_full_text")),
        extractionQuality: parseLineInBlock(block, "extraction_quality"),
        extractionMethod: parseLineInBlock(block, "extraction_method"),
        readabilityScore: parseNumber(parseLineInBlock(block, "readability_score"), 0),
        contentHash: parseLineInBlock(block, "raw_content_hash"),
        fullTextHash: parseLineInBlock(block, "raw_full_text_hash"),
        keyExcerpts: parseLineInBlock(block, "key_excerpts"),
        sourceRole: parseLineInBlock(block, "source_role"),
        originFetchStatus: parseLineInBlock(block, "origin_fetch_status"),
        keywordGroup: parseLineInBlock(block, "keyword_group"),
        rawRef: parseLineInBlock(block, "raw_ref"),
        text: block,
      };
    });
}

function isHomepageDirectoryCoreItem(item = {}) {
  if (!item.routes?.includes("core_pool")) return false;
  if (item.indexOnlyEvidence) return true;
  if (/official_index_or_directory|repo_readme_or_index|ecosystem_package_or_model_index/iu.test(item.evidenceObjectType || "")) return true;
  return false;
}

function isUsableCoreEvidenceItem(item = {}, readabilityMin = 24) {
  if (!item.routes?.includes("core_pool")) return false;
  if (item.rawQcDecision && item.rawQcDecision !== "allow") return false;
  if (!item.hasFullText || item.indexOnlyEvidence) return false;
  if (/official_index_or_directory|repo_readme_or_index|ecosystem_package_or_model_index|marketplace_listing|search_result_or_tool_directory|low_quality_chinese_official_or_seo/iu.test(item.evidenceObjectType || "")) return false;
  if (item.extractionQuality && !/^(high|medium)$/iu.test(item.extractionQuality)) return false;
  if (item.readabilityScore < readabilityMin) return false;
  if (!item.contentHash || /^none$/iu.test(item.contentHash)) return false;
  if (!item.fullTextHash || /^none$/iu.test(item.fullTextHash)) return false;
  if (!item.keyExcerpts || /^\[\]$|^none$/iu.test(item.keyExcerpts)) return false;
  return true;
}

function parseRawTitles(rawMarkdown = "") {
  return String(rawMarkdown)
    .split(/\r?\n/u)
    .map((line) => line.match(/^###\s+R-\d+(?:\s*[|｜-]\s*)?(.+)$/u))
    .filter(Boolean)
    .map((match) => String(match[1] || "").trim());
}

function isAIRelevant(text = "") {
  return /\bai\b|artificial intelligence|llm|agent|agentic|mcp|copilot|codex|gpt|claude|openai|anthropic|gemini|deepmind|hugging\s?face|chatgpt|deepseek|sandbox|evals|world\s?model|model|inference|multimodal|sdk|api|open\s?source|github|人工智能|大模型|智能体|模型|推理|多模态|开源|开发者/iu.test(
    String(text || "")
  );
}

function isLargeVendorText(text = "") {
  return /\b(Google|Microsoft|Anthropic|OpenAI|NVIDIA|Nvidia|Oracle|AWS|Amazon|Meta|Apple|IBM|Salesforce|DeepMind)\b|谷歌|微软|英伟达|亚马逊/iu.test(
    String(text || "")
  );
}

function largeVendorIdentityText(item = {}) {
  return [
    item.title,
    item.sourceName,
    item.sourceUrl,
  ].filter(Boolean).join(" ");
}

function hasOffTopicSignal(text = "", patterns = []) {
  const lowered = String(text || "").toLowerCase();
  if (!lowered) return false;
  return patterns.some((pattern) => lowered.includes(String(pattern || "").toLowerCase()));
}

function ratio(part, total) {
  if (!total) return 0;
  return part / total;
}

function safeObject(value) {
  return value && typeof value === "object" ? value : {};
}

const legacyRawCoverageLogKey = "signal" + "_coverage_gaps";
const legacyPoolCoverageLogKey = "pool_" + legacyRawCoverageLogKey;
const legacyRawCoverageGateKey = legacyRawCoverageLogKey + "_must_be_none";
const legacyPoolCoverageGateKey = legacyPoolCoverageLogKey + "_must_be_none";

function scoreToFixed(value) {
  return Number((value || 0).toFixed(2));
}

function buildDownstreamRecommendation(metrics, hardFailed) {
  const reasons = [];
  if (metrics.rawCount < metrics.rawMinHard) reasons.push("Raw < hard minimum");
  if (metrics.poolCount < metrics.poolMinHard) reasons.push("Pool < hard minimum");
  if (metrics.routedPoolCount < metrics.routedPoolMinHard) reasons.push("Routed Pool < hard minimum");
  if (metrics.nonCommunityCount < metrics.nonCommunityMinHard) reasons.push("keyword-search non-community evidence insufficient");
  if (metrics.aiRelevantRatio < metrics.aiRelevantMinHard) reasons.push("AI relevance insufficient");
  if (metrics.offTopicCount > metrics.offTopicMaxHard) reasons.push("too many off-topic items");
  if (metrics.corePoolCount < metrics.corePoolMinHard) reasons.push("core_pool insufficient");
  if (metrics.usableCoreEvidenceCount < metrics.usableCoreEvidenceMinHard) reasons.push("usable core evidence insufficient");
  if (metrics.coverageGapFlag) reasons.push("Raw importance coverage gaps remain");
  if (metrics.poolCoverageGapFlag) reasons.push("Pool importance coverage gaps remain");
  if (metrics.homepageDirectoryCoreCount > metrics.homepageDirectoryCoreMax) reasons.push("homepage/directory items promoted to core_pool");
  if (metrics.coreMissingFullTextCount > metrics.coreMissingFullTextMax) reasons.push("core_pool items missing full_text");
  if (metrics.coreLowReadabilityCount > metrics.coreLowReadabilityMax) reasons.push("core_pool items failed readability extraction gate");
  if (metrics.coreRawQcBlockCount > metrics.coreRawQcBlockMax) reasons.push("core_pool items blocked by Raw QC");
  if (metrics.coreRawQcDegradedCount > metrics.coreRawQcDegradedMax) reasons.push("core_pool items degraded by Raw QC");
  if (metrics.coreLargeVendorCount > metrics.coreLargeVendorMax || metrics.coreLargeVendorRatio > metrics.coreLargeVendorRatioMax) {
    reasons.push("large-company items dominate core_pool");
  }
  if (metrics.coreNonLargeVendorCount < metrics.coreNonLargeVendorMin) reasons.push("non-large-company core_pool insufficient");

  if (!hardFailed.length) {
    return {
      level: reasons.length ? "allow_with_notes" : "allow",
      action: reasons.length
        ? "Allow Signal Card asset generation and frontstage release with noted soft risks."
        : "Allow Signal Card asset generation and frontstage release.",
      reasons: reasons.length ? reasons : ["all hard gates passed"],
    };
  }

  const severeReasons = new Set([
    "Raw < hard minimum",
    "Pool < hard minimum",
    "Routed Pool < hard minimum",
    "keyword-search non-community evidence insufficient",
    "usable core evidence insufficient",
    "Raw importance coverage gaps remain",
    "Pool importance coverage gaps remain",
    "homepage/directory items promoted to core_pool",
    "core_pool items missing full_text",
    "core_pool items failed readability extraction gate",
    "core_pool items blocked by Raw QC",
    "core_pool items degraded by Raw QC",
    "large-company items dominate core_pool",
    "non-large-company core_pool insufficient",
  ]);
  const severe = reasons.some((item) => severeReasons.has(item));
  if (severe) {
    return {
      level: "pause",
      action: "Pause Signal Card asset generation and frontstage release until repair; only Watchlist / User Feedback use is allowed.",
      reasons,
    };
  }

  return {
    level: "degrade",
    action: "Run downstream in degraded mode; cards and articles may only use repaired original-evidence items.",
    reasons,
  };
}
export function runGuanlanMonitorQualityGate({
  date: targetDate = date,
  configPath = defaultConfigPath,
  passScore = null,
  attempt = 1,
  maxAttempts = 1,
} = {}) {
  const config = readJson(configPath, {});
  const weights = safeObject(config.weights);
  const hard = safeObject(config.hard_gates);
  const keywordReq = safeObject(config.keyword_requirements);
  const strategyReq = safeObject(config.strategy_requirements);
  const offTopicPatterns = Array.isArray(config.off_topic_patterns) ? config.off_topic_patterns : [];

  const scoreThreshold = Number(passScore ?? config.diagnostic_score_reference ?? config.pass_score ?? 85);
  const scoreMode = config.score_mode || "diagnostic_only";
  const rawFile = path.join(root, "01-SiteV2", "content", "01-raw", `${targetDate}-raw-candidates.md`);
  const poolFile = path.join(root, "01-SiteV2", "content", "02-pool", `${targetDate}-pool-candidates.md`);
  const logFile = firstExisting([
    path.join(root, "agent-workflow", "reports", `${targetDate}-guanlan-daily-monitor-log.md`),
  ]);

  const rawText = readText(rawFile);
  const poolText = readText(poolFile);
  const logText = readText(logFile);
  const logBullets = parseBulletMap(logText);

  const rawCount = parseNumber(logBullets.raw_count, parseNumber(parseFrontMatterValue(rawText, "raw_count", "0"), 0));
  const poolCount = parseNumber(logBullets.pool_count, parseNumber(parseFrontMatterValue(poolText, "pool_count", "0"), 0));
  const sourceLevelDist = parseDistribution(logBullets.source_level_distribution || "");
  const sourceTotal = sumValues(sourceLevelDist);

  const rawTitles = parseRawTitles(rawText);
  const aiRelevantCount = rawTitles.filter((title) => isAIRelevant(title)).length;
  const offTopicCount = rawTitles.filter((title) => hasOffTopicSignal(title, offTopicPatterns) && !isAIRelevant(title)).length;
  const aiRelevantRatio = ratio(aiRelevantCount, rawTitles.length || rawCount);

  const keywordNonCommunityCount = parseNumber(logBullets.keyword_search_non_community_count, 0);
  const pathDist = parseDistribution(logBullets.keyword_search_path_distribution || "");
  const nonCommunityPaths = (Array.isArray(keywordReq.non_community_paths) ? keywordReq.non_community_paths : [])
    .filter((pathId) => (pathDist[pathId] || 0) > 0);

  const importanceCoverageValue = String(logBullets.importance_coverage_gaps || logBullets[legacyRawCoverageLogKey] || "unknown").trim().toLowerCase();
  const coverageGapFlag = importanceCoverageValue !== "none";
  const themeConcentrationWarning = String(logBullets.theme_concentration_warning || "none").trim().toLowerCase();
  const themeConcentrationFlag = themeConcentrationWarning.startsWith("warning");
  const themeDist = parseDistribution(logBullets.theme_distribution || "");
  const outsideCoreCount = themeDist["outside-core-exploration"] || 0;
  const poolImportanceCoverageValue = String(logBullets.pool_importance_coverage_gaps || logBullets[legacyPoolCoverageLogKey] || "unknown").trim().toLowerCase();
  const poolCoverageGapFlag = poolImportanceCoverageValue !== "none";
  const poolItems = parsePoolItems(poolText);
  const poolRouteDist = poolItems.reduce((acc, item) => {
    const routes = item.routes?.length ? item.routes : ["index_only"];
    for (const route of routes) acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {});
  const corePoolCount = poolRouteDist.core_pool || 0;
  const routedPoolCount = poolItems.filter((item) =>
    item.routes.some((route) => ["core_pool", "emerging_pool", "user_feedback_pool", "watchlist"].includes(route))
  ).length;
  const indexOnlyPoolCount = poolItems.filter((item) => item.routes.includes("index_only")).length;
  const aihotIndexOnlyCount = poolItems.filter((item) => item.acquisitionChannel === "aihot" && item.routes.includes("index_only")).length;
  const aihotCoreCount = poolItems.filter((item) => item.acquisitionChannel === "aihot" && item.routes.includes("core_pool")).length;
  const corePoolItems = poolItems.filter((item) => item.routes.includes("core_pool"));
  const coreReadabilityScoreMin = Number(hard.core_readability_score_min ?? 24);
  const coreLowReadabilityMax = Number(hard.core_low_readability_max ?? 0);
  const usableCoreEvidenceCount = corePoolItems.filter((item) => isUsableCoreEvidenceItem(item, coreReadabilityScoreMin)).length;
  const homepageDirectoryCoreCount = poolItems.filter(isHomepageDirectoryCoreItem).length;
  const coreMissingFullTextCount = poolItems.filter((item) => item.routes.includes("core_pool") && !item.hasFullText).length;
  const coreLowReadabilityCount = corePoolItems.filter((item) => item.readabilityScore < coreReadabilityScoreMin).length;
  const coreRawQcBlockCount = corePoolItems.filter((item) => item.rawQcDecision === "block").length;
  const coreRawQcDegradedCount = corePoolItems.filter((item) => item.rawQcDecision === "allow_with_degradation").length;
  const coreLargeVendorCount = corePoolItems.filter((item) => isLargeVendorText(largeVendorIdentityText(item))).length;
  const coreNonLargeVendorCount = Math.max(0, corePoolCount - coreLargeVendorCount);
  const coreLargeVendorRatio = ratio(coreLargeVendorCount, corePoolCount);

  const failedSources = parseFailedSources(logBullets.failed_sources || "");

  const rawMinHard = Number(hard.raw_count_min || 50);
  const poolMinHard = Number(hard.pool_count_min || 15);
  const routedPoolMinHard = Number(hard.routed_pool_count_min || 15);
  const nonCommunityMinHard = Number(hard.keyword_search_non_community_min || 1);
  const aiRelevantMinHard = Number(hard.ai_relevant_title_ratio_min || 0.7);
  const offTopicMaxHard = Number(hard.off_topic_title_max || 3);
  const corePoolMinHard = Number(hard.core_pool_min || 5);
  const usableCoreEvidenceMinHard = Number(hard.usable_core_evidence_min || corePoolMinHard);
  const homepageDirectoryCoreMax = Number(hard.homepage_directory_core_max ?? 0);
  const coreMissingFullTextMax = Number(hard.core_missing_full_text_max ?? 0);
  const coreRawQcBlockMax = Number(hard.core_raw_qc_block_max ?? 0);
  const coreRawQcDegradedMax = Number(hard.core_raw_qc_degraded_max ?? 0);
  const coreLargeVendorMax = Number(hard.core_large_vendor_max ?? 5);
  const coreLargeVendorRatioMax = Number(hard.core_large_vendor_ratio_max ?? 0.35);
  const coreNonLargeVendorMin = Number(hard.core_non_large_vendor_min ?? 0);
  const importanceCoverageMustNone = hard.importance_coverage_gaps_must_be_none ?? hard[legacyRawCoverageGateKey] ?? true;
  const poolImportanceCoverageMustNone = hard.pool_importance_coverage_gaps_must_be_none ?? hard[legacyPoolCoverageGateKey] ?? true;
  const nonCommunityPathMin = Number(keywordReq.non_community_paths_min || 2);
  const outsideCoreMin = Number(strategyReq.outside_core_exploration_min_raw || 3);
  const weekend = weekendPolicyState(config, targetDate);
  const weekendAdjusted = weekend.policy.adjusted_hard_gates || {};
  const weekendPoolGapMin = Number(weekendAdjusted.pool_min_per_required_importance_type ?? 0);
  const poolCoverageGapEntries = parseCoverageGapEntries(poolImportanceCoverageValue);
  const weekendPoolCoveragePassed =
    weekend.active &&
    poolCoverageGapEntries.length > 0 &&
    weekendPoolGapMin > 0 &&
    poolCoverageGapEntries.every((entry) => entry.actual >= weekendPoolGapMin);
  // Also compute raw-level coverage weekend pass. Raw coverage uses the same
  // pool-level gap minimum on weekends — if pool gaps are filled, raw is acceptable.
  const rawCoverageGapEntries = parseCoverageGapEntries(importanceCoverageValue);
  const weekendRawCoveragePassed =
    weekend.active &&
    rawCoverageGapEntries.length > 0 &&
    weekendPoolGapMin > 0 &&
    rawCoverageGapEntries.every((entry) => entry.actual >= weekendPoolGapMin);
  // When raw count meets the configured hard minimum, coverage gaps are
  // acceptable — we have enough data volume, just not perfect distribution
  // across importance types. This unblocks card generation when search APIs
  // fail but raw data is still sufficient.
  const rawCountSufficientForCoverage = rawCount >= rawMinHard;
  const coverageGapAcceptable = weekend.active ? weekendRawCoveragePassed : rawCountSufficientForCoverage;
  const poolCoverageGapAcceptable = weekend.active ? weekendPoolCoveragePassed : rawCountSufficientForCoverage;
  const effectiveCorePoolMinHard = weekend.active
    ? Math.min(corePoolMinHard, Number(weekendAdjusted.core_pool_min ?? corePoolMinHard))
    : corePoolMinHard;
  const effectiveUsableCoreEvidenceMinHard = weekend.active
    ? Math.min(usableCoreEvidenceMinHard, Number(weekendAdjusted.usable_core_evidence_min ?? usableCoreEvidenceMinHard))
    : usableCoreEvidenceMinHard;
  const effectiveCoreNonLargeVendorMin = weekend.active
    ? Math.min(coreNonLargeVendorMin, Number(weekendAdjusted.core_non_large_vendor_min ?? coreNonLargeVendorMin))
    : coreNonLargeVendorMin;

  const hardChecks = [
    { key: "raw_count_min", passed: rawCount >= rawMinHard, value: `${rawCount}/${rawMinHard}` },
    { key: "pool_count_min", passed: poolCount >= poolMinHard, value: `${poolCount}/${poolMinHard}` },
    { key: "routed_pool_count_min", passed: routedPoolCount >= routedPoolMinHard, value: `${routedPoolCount}/${routedPoolMinHard}` },
    { key: "keyword_search_non_community_min", passed: keywordNonCommunityCount >= nonCommunityMinHard, value: `${keywordNonCommunityCount}/${nonCommunityMinHard}` },
    { key: "ai_relevant_title_ratio_min", passed: aiRelevantRatio >= aiRelevantMinHard, value: `${aiRelevantRatio.toFixed(2)}/${aiRelevantMinHard}` },
    { key: "off_topic_title_max", passed: offTopicCount <= offTopicMaxHard, value: `${offTopicCount}/${offTopicMaxHard}` },
    { key: "core_pool_min", passed: corePoolCount >= effectiveCorePoolMinHard, value: `${corePoolCount}/${effectiveCorePoolMinHard}${weekend.active ? `; default=${corePoolMinHard}` : ""}` },
    { key: "usable_core_evidence_min", passed: usableCoreEvidenceCount >= effectiveUsableCoreEvidenceMinHard, value: `${usableCoreEvidenceCount}/${effectiveUsableCoreEvidenceMinHard}${weekend.active ? `; default=${usableCoreEvidenceMinHard}` : ""}` },
    { key: "homepage_directory_core_max", passed: homepageDirectoryCoreCount <= homepageDirectoryCoreMax, value: `${homepageDirectoryCoreCount}/${homepageDirectoryCoreMax}` },
    { key: "core_missing_full_text_max", passed: coreMissingFullTextCount <= coreMissingFullTextMax, value: `${coreMissingFullTextCount}/${coreMissingFullTextMax}` },
    { key: "core_readability_score_min", passed: coreLowReadabilityCount <= coreLowReadabilityMax, value: `low=${coreLowReadabilityCount}/${coreLowReadabilityMax}; min=${coreReadabilityScoreMin}` },
    { key: "core_raw_qc_block_max", passed: coreRawQcBlockCount <= coreRawQcBlockMax, value: `${coreRawQcBlockCount}/${coreRawQcBlockMax}` },
    { key: "core_raw_qc_degraded_max", passed: coreRawQcDegradedCount <= coreRawQcDegradedMax, value: `${coreRawQcDegradedCount}/${coreRawQcDegradedMax}` },
    { key: "core_large_vendor_max", passed: coreLargeVendorCount <= coreLargeVendorMax, value: `${coreLargeVendorCount}/${coreLargeVendorMax}` },
    { key: "core_large_vendor_ratio_max", passed: coreLargeVendorRatio <= coreLargeVendorRatioMax, value: `${coreLargeVendorRatio.toFixed(2)}/${coreLargeVendorRatioMax}` },
    { key: "core_non_large_vendor_min", passed: coreNonLargeVendorCount >= effectiveCoreNonLargeVendorMin, value: `${coreNonLargeVendorCount}/${effectiveCoreNonLargeVendorMin}${weekend.active ? `; default=${coreNonLargeVendorMin}` : ""}` },
    {
      key: "importance_coverage_gaps_must_be_none",
      passed: importanceCoverageMustNone ? !coverageGapFlag || coverageGapAcceptable : true,
      value: `${importanceCoverageValue}${coverageGapAcceptable ? `; raw_sufficient=${rawCount}` : ""}`,
    },
    {
      key: "pool_importance_coverage_gaps_must_be_none",
      passed: poolImportanceCoverageMustNone ? !poolCoverageGapFlag || poolCoverageGapAcceptable : true,
      value: `${poolImportanceCoverageValue}${poolCoverageGapAcceptable ? `; raw_sufficient=${rawCount}` : ""}`,
    },
  ];
  const hardFailed = hardChecks.filter((check) => !check.passed);

  const sourceIntegrityScore =
    weights.source_integrity *
    clamp(
      0.45 * clamp(usableCoreEvidenceCount / Math.max(usableCoreEvidenceMinHard, 1)) +
        0.35 * clamp(keywordNonCommunityCount / Math.max(nonCommunityMinHard, 1)) +
        0.2 * clamp(failedSources.length ? 0.2 : 1)
    );
  const contentQualityScore =
    weights.content_quality *
    clamp(
      0.75 * clamp(aiRelevantRatio / Math.max(aiRelevantMinHard, 0.01)) +
        0.25 * clamp(1 - offTopicCount / Math.max(offTopicMaxHard + 1, 1))
    );
  const coverageScopeScore =
    weights.coverage_scope *
    clamp(
      0.4 * clamp(rawCount / Math.max(rawMinHard, 1)) +
        0.2 * clamp(poolCount / Math.max(poolMinHard, 1)) +
        0.15 * clamp(routedPoolCount / Math.max(routedPoolMinHard, 1)) +
        0.25 * (coverageGapFlag ? 0.2 : 1)
    );
  const keywordComplianceScore =
    weights.keyword_compliance *
    clamp(
      0.55 * clamp(keywordNonCommunityCount / Math.max(nonCommunityMinHard, 1)) +
        0.45 * clamp(nonCommunityPaths.length / Math.max(nonCommunityPathMin, 1))
    );
  const strategicAlignmentScore =
    weights.strategic_alignment *
    clamp(
      0.45 * (coverageGapFlag ? 0.2 : 1) +
        0.25 * (themeConcentrationFlag ? 0.4 : 1) +
        0.3 * clamp(outsideCoreCount / Math.max(outsideCoreMin, 1))
    );
  const importanceReadinessWeight = Number(weights.importance_readiness ?? 10);
  const importanceReadinessScore =
    importanceReadinessWeight *
    clamp(
      0.6 * clamp(corePoolCount / Math.max(corePoolMinHard, 1)) +
        0.4 * clamp(poolCount ? corePoolCount / poolCount : 0)
    );

  const totalScore = scoreToFixed(
    sourceIntegrityScore +
      contentQualityScore +
      coverageScopeScore +
      keywordComplianceScore +
      strategicAlignmentScore +
      importanceReadinessScore
  );

  const passed = hardFailed.length === 0;
  const status = passed ? "passed" : "failed";
  const downstream = buildDownstreamRecommendation(
    {
      rawCount,
      poolCount,
      routedPoolCount,
      nonCommunityCount: keywordNonCommunityCount,
      aiRelevantRatio,
      offTopicCount,
      corePoolCount,
      usableCoreEvidenceCount,
      coverageGapFlag,
      poolCoverageGapFlag: poolCoverageGapFlag && !weekendPoolCoveragePassed,
      homepageDirectoryCoreCount,
      homepageDirectoryCoreMax,
      coreMissingFullTextCount,
      coreMissingFullTextMax,
      coreLowReadabilityCount,
      coreLowReadabilityMax,
      coreRawQcBlockCount,
      coreRawQcBlockMax,
      coreRawQcDegradedCount,
      coreRawQcDegradedMax,
      coreLargeVendorCount,
      coreLargeVendorMax,
      coreLargeVendorRatio,
      coreLargeVendorRatioMax,
      coreNonLargeVendorCount,
      coreNonLargeVendorMin: effectiveCoreNonLargeVendorMin,
      rawMinHard,
      poolMinHard,
      routedPoolMinHard,
      nonCommunityMinHard,
      aiRelevantMinHard,
      offTopicMaxHard,
      corePoolMinHard: effectiveCorePoolMinHard,
      usableCoreEvidenceMinHard: effectiveUsableCoreEvidenceMinHard,
    },
    hardFailed
  );

  const keyRisks = [
    hardFailed.length ? `hard_gates_failed=${hardFailed.map((item) => item.key).join(", ")}` : "",
    routedPoolCount < routedPoolMinHard ? `routed_pool_insufficient=${routedPoolCount}/${routedPoolMinHard}` : "",
    failedSources.length ? `failed_sources=${failedSources.length}` : "",
    themeConcentrationFlag ? `theme_concentration_warning=${logBullets.theme_concentration_warning}` : "",
    importanceCoverageValue !== "none" ? `importance_coverage_gaps=${importanceCoverageValue}` : "",
    poolImportanceCoverageValue !== "none" ? `pool_importance_coverage_gaps=${poolImportanceCoverageValue}` : "",
    homepageDirectoryCoreCount ? `homepage_directory_core=${homepageDirectoryCoreCount}` : "",
    coreMissingFullTextCount ? `core_missing_full_text=${coreMissingFullTextCount}` : "",
    coreLowReadabilityCount ? `core_low_readability=${coreLowReadabilityCount}` : "",
    coreRawQcBlockCount ? `core_raw_qc_block=${coreRawQcBlockCount}` : "",
    coreRawQcDegradedCount ? `core_raw_qc_degraded=${coreRawQcDegradedCount}` : "",
    coreLargeVendorCount > coreLargeVendorMax || coreLargeVendorRatio > coreLargeVendorRatioMax
      ? `core_large_vendor=${coreLargeVendorCount}/${coreLargeVendorMax}; ratio=${coreLargeVendorRatio.toFixed(2)}/${coreLargeVendorRatioMax}`
      : "",
    weekend.active ? `weekend_policy=${status}; weekday=${weekend.weekday}; effective_core_pool_min=${effectiveCorePoolMinHard}; effective_usable_core_evidence_min=${effectiveUsableCoreEvidenceMinHard}; effective_core_non_large_vendor_min=${effectiveCoreNonLargeVendorMin}; pool_gap_min=${weekendPoolGapMin || "none"}` : "",
    weekend.active && corePoolCount < corePoolMinHard ? `weekend_default_core_pool_shortfall=${corePoolCount}/${corePoolMinHard}` : "",
    weekend.active && usableCoreEvidenceCount < usableCoreEvidenceMinHard ? `weekend_default_usable_core_evidence_shortfall=${usableCoreEvidenceCount}/${usableCoreEvidenceMinHard}` : "",
    weekend.active && coreNonLargeVendorCount < coreNonLargeVendorMin ? `weekend_default_core_non_large_vendor_shortfall=${coreNonLargeVendorCount}/${coreNonLargeVendorMin}` : "",
    coreNonLargeVendorCount < effectiveCoreNonLargeVendorMin ? `core_non_large_vendor_insufficient=${coreNonLargeVendorCount}/${effectiveCoreNonLargeVendorMin}` : "",
  ].filter(Boolean);

  const skillFeedback = [];
  if (keywordNonCommunityCount < nonCommunityMinHard) {
    skillFeedback.push("Increase non-community search paths: official, developer, capital, industry, procurement and A-media.");
  }
  if (aiRelevantRatio < aiRelevantMinHard || offTopicCount > offTopicMaxHard) {
    skillFeedback.push("Tighten Raw AI relevance anchors and noise filters before accepting candidates.");
  }
  if (corePoolCount < effectiveCorePoolMinHard) {
    skillFeedback.push("Increase usable original-evidence core items and avoid weak Pool-only leads.");
  }
  if (usableCoreEvidenceCount < effectiveUsableCoreEvidenceMinHard) {
    skillFeedback.push("Repair core_pool items so they have full text, usable evidence object, non-index page type and Raw-QC allow status.");
  }
  if (coverageGapFlag) {
    skillFeedback.push("Repair Raw importance coverage before downstream use.");
  }
  if (poolCoverageGapFlag && !weekendPoolCoveragePassed) {
    skillFeedback.push("Repair Pool importance coverage before downstream assets; each required importance type needs the configured Pool minimum.");
  }
  if (homepageDirectoryCoreCount || coreMissingFullTextCount) {
    skillFeedback.push("Downgrade index-only or missing-full-text core items before any downstream card or article use.");
  }
  if (coreLowReadabilityCount) {
    skillFeedback.push("Repair or downgrade core_pool items with low readability_score; full_text must be readable article/body evidence, not navigation or fallback text.");
  }
  if (coreRawQcBlockCount || coreRawQcDegradedCount) {
    skillFeedback.push("Remove Raw-QC blocked or degraded items from core_pool; keep degraded material only in index, watchlist, emerging, or feedback routes.");
  }
  if (coreLargeVendorCount > coreLargeVendorMax || coreLargeVendorRatio > coreLargeVendorRatioMax) {
    skillFeedback.push("Demote repeated large-company product/lab items from core_pool and replenish funding, customer deployment, vertical workflow, pricing, procurement, regulatory, or emerging-company evidence.");
  }
  if (coreNonLargeVendorCount < effectiveCoreNonLargeVendorMin) {
    skillFeedback.push("Expand Raw and Pool around emerging companies, customer deployments, vertical workflow cases, funding, procurement, pricing and regulatory evidence until non-large-company core_pool has enough depth.");
  }
  if (failedSources.length) {
    skillFeedback.push("Repair failed sources or document fallback paths before downstream use.");
  }
  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `${targetDate}-guanlan-monitor-quality-gate.md`);
  const latestPath = path.join(reportsDir, "guanlan-monitor-quality-gate-latest.md");

  const report = [
    `# ${targetDate} Guanlan Monitor Quality Gate`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- attempt: ${attempt}/${maxAttempts}`,
    `- status: ${status}`,
    `- production_weekday: ${weekend.weekday || "unknown"}`,
    `- weekend_policy: ${weekend.active ? "active" : "inactive"}`,
    `- weekend_policy_note: ${weekend.active ? "light weekend quantity floors applied; evidence-quality gates and downstream card/frontstage gates remain required" : "not_applied"}`,
    `- total_score: ${totalScore}`,
    `- diagnostic_score_reference: ${scoreThreshold}`,
    `- score_mode: ${scoreMode}`,
    `- raw_count: ${rawCount}`,
    `- pool_count: ${poolCount}`,
    `- pool_index_count: ${poolItems.length}`,
    `- routed_pool_count: ${routedPoolCount}`,
    `- index_only_pool_count: ${indexOnlyPoolCount}`,
    `- aihot_index_only_count: ${aihotIndexOnlyCount}`,
    `- aihot_core_count: ${aihotCoreCount}`,
    `- keyword_search_non_community_count: ${keywordNonCommunityCount}`,
    `- non_community_paths_hit: ${nonCommunityPaths.join(", ") || "none"}`,
    `- source_level_distribution: ${Object.entries(sourceLevelDist).map(([key, value]) => `${key}=${value}`).join("; ") || "none"}`,
    `- ai_relevant_title_ratio: ${aiRelevantRatio.toFixed(3)}`,
    `- off_topic_title_count: ${offTopicCount}`,
    `- core_pool_count: ${corePoolCount}`,
    `- core_pool_min_effective: ${effectiveCorePoolMinHard}`,
    `- core_pool_min_default: ${corePoolMinHard}`,
    `- usable_core_evidence_count: ${usableCoreEvidenceCount}`,
    `- usable_core_evidence_min_effective: ${effectiveUsableCoreEvidenceMinHard}`,
    `- usable_core_evidence_min_default: ${usableCoreEvidenceMinHard}`,
    `- homepage_directory_core_count: ${homepageDirectoryCoreCount}`,
    `- core_missing_full_text_count: ${coreMissingFullTextCount}`,
    `- core_low_readability_count: ${coreLowReadabilityCount}`,
    `- core_readability_score_min: ${coreReadabilityScoreMin}`,
    `- core_raw_qc_block_count: ${coreRawQcBlockCount}`,
    `- core_raw_qc_degraded_count: ${coreRawQcDegradedCount}`,
    `- core_large_vendor_count: ${coreLargeVendorCount}`,
    `- core_non_large_vendor_count: ${coreNonLargeVendorCount}`,
    `- core_non_large_vendor_min_effective: ${effectiveCoreNonLargeVendorMin}`,
    `- core_non_large_vendor_min_default: ${coreNonLargeVendorMin}`,
    `- core_large_vendor_ratio: ${coreLargeVendorRatio.toFixed(3)}`,
    `- importance_coverage_gaps: ${importanceCoverageValue}`,
    `- pool_importance_coverage_gaps: ${poolImportanceCoverageValue}`,
    `- failed_sources: ${failedSources.length ? failedSources.join("; ") : "none"}`,
    `- evidence_gaps: ${logBullets.evidence_gaps || "unknown"}`,
    `- fallback_used: ${logBullets.fallback_used || "unknown"}`,
    "",
    "## Score Breakdown",
    "",
    `- source_integrity (${weights.source_integrity}): ${scoreToFixed(sourceIntegrityScore)}`,
    `- content_quality (${weights.content_quality}): ${scoreToFixed(contentQualityScore)}`,
    `- coverage_scope (${weights.coverage_scope}): ${scoreToFixed(coverageScopeScore)}`,
    `- keyword_compliance (${weights.keyword_compliance}): ${scoreToFixed(keywordComplianceScore)}`,
    `- strategic_alignment (${weights.strategic_alignment}): ${scoreToFixed(strategicAlignmentScore)}`,
    `- importance_readiness (${importanceReadinessWeight}): ${scoreToFixed(importanceReadinessScore)}`,
    "",
    "## Hard Gates",
    "",
    ...hardChecks.map((check) => `- ${check.key}: ${check.passed ? "passed" : "failed"} (${check.value})`),
    "",
    "## Risks",
    "",
    ...(keyRisks.length ? keyRisks.map((risk) => `- ${risk}`) : ["- none"]),
    "",
    "## Skill Feedback",
    "",
    ...(skillFeedback.length ? skillFeedback.map((item) => `- ${item}`) : ["- none"]),
    "",
    "## Downstream Recommendation",
    "",
    `- level: ${downstream.level}`,
    `- action: ${downstream.action}`,
    `- reasons: ${downstream.reasons.join(" | ") || "none"}`,
    "",
    "## Inputs",
    "",
    `- raw_file: ${rawFile && fs.existsSync(rawFile) ? rel(rawFile) : "missing"}`,
    `- pool_file: ${poolFile && fs.existsSync(poolFile) ? rel(poolFile) : "missing"}`,
    `- monitor_log_file: ${logFile && fs.existsSync(logFile) ? rel(logFile) : "missing"}`,
    `- config_file: ${rel(configPath)}`,
    "",
  ].join("\n");

  fs.writeFileSync(reportPath, `${report}\n`, "utf8");
  fs.writeFileSync(latestPath, `${report}\n`, "utf8");

  return {
    status,
    passed,
    total_score: totalScore,
    diagnostic_score_reference: scoreThreshold,
    score_mode: scoreMode,
    hard_failed: hardFailed,
    hard_checks: hardChecks,
    skill_feedback: skillFeedback,
    risks: keyRisks,
    downstream,
    report_path: reportPath,
    latest_path: latestPath,
    input_files: {
      raw: rawFile,
      pool: poolFile,
      log: logFile || "",
      config: configPath,
    },
    metrics: {
      raw_count: rawCount,
      pool_count: poolCount,
      source_level_distribution: sourceLevelDist,
      source_level_total: sourceTotal,
      keyword_search_non_community_count: keywordNonCommunityCount,
      non_community_paths_hit: nonCommunityPaths,
      ai_relevant_title_ratio: aiRelevantRatio,
      off_topic_title_count: offTopicCount,
      core_pool_count: corePoolCount,
      usable_core_evidence_count: usableCoreEvidenceCount,
      homepage_directory_core_count: homepageDirectoryCoreCount,
      core_missing_full_text_count: coreMissingFullTextCount,
      core_low_readability_count: coreLowReadabilityCount,
      core_readability_score_min: coreReadabilityScoreMin,
      core_raw_qc_block_count: coreRawQcBlockCount,
      core_raw_qc_degraded_count: coreRawQcDegradedCount,
      core_large_vendor_count: coreLargeVendorCount,
      core_non_large_vendor_count: coreNonLargeVendorCount,
      core_large_vendor_ratio: coreLargeVendorRatio,
      failed_sources_count: failedSources.length,
      importance_coverage_gaps: importanceCoverageValue,
      pool_importance_coverage_gaps: poolImportanceCoverageValue,
    },
  };
}

if (import.meta.main) {
  const result = runGuanlanMonitorQualityGate({
    date,
    configPath: args.get("config") || defaultConfigPath,
    passScore: args.has("pass-score") ? Number(args.get("pass-score")) : null,
    attempt: Number(args.get("attempt") || 1),
    maxAttempts: Number(args.get("max-attempts") || 1),
  });

  console.log(JSON.stringify(result, null, 2));
  console.log(`Report: ${rel(result.report_path)}`);
  if (!result.passed) process.exitCode = 1;
}
