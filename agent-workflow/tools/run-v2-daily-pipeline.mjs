import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import crypto from "node:crypto";

const root = process.cwd();
const execFileAsync = promisify(execFile);
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

if (args.has("help") || args.has("h")) {
  console.log(
    [
      "WaveSight AI V2 daily pipeline (source-router)",
      "",
      "Usage:",
      "  node agent-workflow/tools/run-v2-daily-pipeline.mjs --date=YYYY-MM-DD",
      "",
      "Optional:",
      "  --fetch-timeout-ms=20000",
      "  --snapshot-timeout-ms=16000",
      "  --raw-target=100",
      "  --aihot-limit=500",
      "  --aihot-mode=all",
      "  --aihot-window-hours=24",
      "  --builders-limit=25",
      "  --search-limit=50",
      "  --search-path-query-limit=2",
      "  --hn-limit=40",
      "  --gdelt-query-limit=7",
      "  --dry-run=true",
      "",
    ].join("\n")
  );
  process.exit(0);
}

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const aihotMode = args.get("aihot-mode") || "all";
const aihotWindowHours = Number(args.get("aihot-window-hours") || 24);
const aihotTarget = Number(args.get("aihot-limit") || 500);
const buildersTarget = Number(args.get("builders-limit") || 25);
const searchTarget = Number(args.get("search-limit") || 50);
const searchPathQueryLimit = Number(args.get("search-path-query-limit") || 2);
const hnTarget = Number(args.get("hn-limit") || 40);
const rawTarget = Number(args.get("raw-target") || 100);
const dryRun = args.get("dry-run") === "true";
const fetchTimeoutMs = Number(args.get("fetch-timeout-ms") || 20000);
const snapshotTimeoutMs = Number(args.get("snapshot-timeout-ms") || 16000);
const followBuildersSkillScript =
  args.get("follow-builders-script") ||
  path.join(process.env.USERPROFILE || "", ".skill-store", "follow-builders", "scripts", "prepare-digest.js");

const contentRoot = path.join(root, "01-SiteV2", "content");
const reportsDir = path.join(root, "agent-workflow", "reports");
const rawDir = path.join(contentRoot, "01-raw");
const originalDir = path.join(rawDir, "originals", date);
const poolDir = path.join(contentRoot, "02-pool");
const businessSignalsDir = path.join(contentRoot, "04-business-signals");
const keywordMonitoringPath = path.join(contentRoot, "09-databases", "keyword-monitoring-v2.json");
const opinionCardsDir = path.join(root, "01-SiteV2", "knowledge", "03-Opinion-Cards");

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");
const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });
const writeFile = (file, text) => {
  ensure(path.dirname(file));
  fs.writeFileSync(file, text, "utf8");
};
const resetGeneratedDir = (dir, allowedParent) => {
  const resolvedDir = path.resolve(dir);
  const resolvedParent = path.resolve(allowedParent);
  if (!resolvedDir.startsWith(resolvedParent + path.sep)) {
    throw new Error(`Refusing to reset generated dir outside allowed parent: ${resolvedDir}`);
  }
  fs.rmSync(resolvedDir, { recursive: true, force: true });
  ensure(resolvedDir);
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

const keywordMonitoring = readJson(keywordMonitoringPath, {
  policy: { raw_max_theme_share: 0.35, warning_threshold_share: 0.4 },
  theme_groups: [],
});
const themeGroups = Array.isArray(keywordMonitoring.theme_groups) ? keywordMonitoring.theme_groups : [];
const themeOrder = themeGroups.map((group) => group.id);
const themeById = new Map(themeGroups.map((group) => [group.id, group]));
const gdeltQueryLimit = Number(args.get("gdelt-query-limit") || Math.max(4, themeGroups.length || 7));
const rawEntryPolicy = keywordMonitoring.raw_entry_policy || {};
const p0TermRules = (Array.isArray(keywordMonitoring.p0_core_tracks) ? keywordMonitoring.p0_core_tracks : [])
  .flatMap((group) => (Array.isArray(group.terms) ? group.terms : []).map((term) => ({
    term,
    group: group.id,
    type: "p0",
  })));
const p1TermRules = Object.entries(keywordMonitoring.p1_evidence_terms || {})
  .flatMap(([group, terms]) => (Array.isArray(terms) ? terms : []).map((term) => ({
    term,
    group,
    type: "p1",
  })));
const themeTermRules = themeGroups.flatMap((group) =>
  (Array.isArray(group.keywords) ? group.keywords : []).map((term) => ({
    term,
    group: group.id,
    type: "theme",
  }))
);
const broadRawEntryRules = (Array.isArray(rawEntryPolicy.broad_terms) ? rawEntryPolicy.broad_terms : []).map((term) => ({
  term,
  group: "raw-entry-broad",
  type: "broad",
}));
const rawEntryTermRules = [...themeTermRules, ...p0TermRules, ...p1TermRules, ...broadRawEntryRules];

function laneQueries(lane, fallbackQueries) {
  const queries = themeGroups.flatMap((group) =>
    ((group.lanes && Array.isArray(group.lanes[lane]) ? group.lanes[lane] : [])).map((query) => ({
      query,
      query_theme: group.id,
      keyword_group: group.id,
    }))
  );
  if (queries.length) return queries;
  return fallbackQueries.map((query) => ({
    query,
    query_theme: "uncategorized",
    keyword_group: "legacy-hardcoded",
  }));
}

function themeLabel(themeId) {
  return themeById.get(themeId)?.label || themeId || "未分类";
}

const themeFormalTags = {
  "mature-commercial-signal": ["stage-proven", "evidence-customer-adoption", "track-enterprise-workflow"],
  "early-direction-signal": ["stage-rising", "evidence-funding", "track-ai-startup"],
  "technical-iteration-signal": ["track-ai-infra", "track-ai-governance", "stage-watch"],
  "developer-ecosystem-signal": ["track-ai-coding", "track-ai-infra", "stage-watch"],
  "outside-core-exploration": ["stage-watch", "track-vertical-ai", "evidence-market-signal"],
  "enterprise-agent-governance": ["track-ai-agent", "track-ai-governance", "track-enterprise-workflow"],
  "model-capability-cost": ["track-ai-infra", "stage-watch"],
  "infra-devtools-open-source": ["track-ai-coding", "track-ai-infra"],
  "vertical-customer-adoption": ["customer-enterprise", "evidence-customer-adoption"],
  "funding-vc-market": ["evidence-funding", "stage-rising"],
  "risk-regulation-counterevidence": ["stage-risk", "evidence-regulation"],
  "china-local-market": ["region-china", "stage-watch"],
};

function sourceTagForItem(item) {
  if (item.source_level === "S") return "source-first-party";
  if (item.source_level === "A") return "source-business-media";
  if (["funding", "marketplace", "industry", "web"].includes(item.source_type)) return "source-industry-data";
  if (["blog", "podcast"].includes(item.source_type)) return `source-${item.source_type}`;
  return "source-social";
}

function formalTagsForItem(item) {
  const tags = [
    ...(themeFormalTags[item.theme] || ["track-ai-agent"]),
    "stage-watch",
    sourceTagForItem(item),
  ];
  return [...new Set(tags)];
}

function assignTheme(item) {
  if (item.query_theme) {
    return {
      ...item,
      theme: item.query_theme,
      theme_label: themeLabel(item.query_theme),
      keyword_group: item.keyword_group || item.query_theme,
    };
  }

  const text = `${item.title || ""} ${item.summary || ""} ${item.url || ""} ${item.source || ""}`.toLowerCase();
  const matched = themeGroups.find((group) =>
    (Array.isArray(group.keywords) ? group.keywords : []).some((keyword) => text.includes(String(keyword).toLowerCase()))
  );
  const theme = matched?.id || "uncategorized";
  return {
    ...item,
    theme,
    theme_label: themeLabel(theme),
    keyword_group: item.keyword_group || theme,
  };
}

function keywordMatchText(item = {}) {
  return [
    item.title,
    item.titleZh,
    item.title_en,
    item.summary,
    item.summaryZh,
    item.url,
    item.source,
    item.sourceName,
    item.category,
    item.section,
  ].filter(Boolean).join(" ").toLowerCase();
}

function matchRawEntryRules(item = {}, rules = rawEntryTermRules) {
  const text = keywordMatchText(item);
  const matched = [];
  const seen = new Set();
  for (const rule of rules) {
    const term = String(rule.term || "").trim();
    if (!term) continue;
    const key = `${rule.type}:${rule.group}:${term.toLowerCase()}`;
    if (seen.has(key)) continue;
    if (text.includes(term.toLowerCase())) {
      matched.push({ ...rule, term });
      seen.add(key);
    }
  }
  return matched;
}

function hasCommercialActionSignal(item = {}) {
  const text = keywordMatchText(item);
  return /客户|案例|部署|上线|采购|招标|投标|合作|融资|投资|并购|收入|定价|计费|付费|价格|合规|监管|诉讼|安全|权限|审计|工作流|流程|开发者|开源|sdk|api|插件|marketplace|github|customer|case study|deployment|procurement|tender|partnership|funding|raises|series|seed|acquisition|revenue|pricing|billing|compliance|regulation|lawsuit|security|permission|audit|workflow|developer|open-source|plugin/iu.test(text);
}

function hasAIContextSignal(item = {}) {
  // Use a strict AI-anchor check on low-noise fields only (title/url/source/category).
  // Do NOT rely on "summary" here because some sources embed nav text (e.g. "AI / 苹果 / ...") and cause false positives.
  const text = [item.title, item.titleZh, item.title_en, item.url, item.source, item.sourceName, item.category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /\bai\b|人工智能|大模型|llm|agent|智能体|mcp|copilot|gpt|chatgpt|openai|anthropic|claude|gemini|deepmind|google|mistral|meta|llama|hugging\s?face|模型|推理|inference|multimodal|多模态/iu.test(text);
}

function isObviousRawNoise(item = {}) {
  const text = keywordMatchText(item);
  const configuredNoise = Array.isArray(rawEntryPolicy.noise_terms) ? rawEntryPolicy.noise_terms : [];
  if (configuredNoise.some((term) => text.includes(String(term).toLowerCase()))) return true;
  return /壁纸|头像|表情包|教程合集|prompt模板|提示词合集|转发抽奖|招聘简历|课程优惠|affiliate|wallpaper|avatar|meme|prompt pack|coupon/iu.test(text);
}

function aihotRawEntryDecision(item = {}) {
  const category = String(item.category || "").toLowerCase();
  const matched = matchRawEntryRules(item);
  const categoryKeeps = new Set(rawEntryPolicy.aihot_default_candidate_categories || ["industry", "ai-products", "ai-models", "paper"]);
  const categoryNeedsKeyword = new Set(rawEntryPolicy.aihot_keyword_required_categories || ["tip"]);
  const actionSignal = hasCommercialActionSignal(item);
  const aiContext = hasAIContextSignal(item);
  const noise = isObviousRawNoise(item);

  if (noise && !matched.length && !actionSignal) {
    return {
      keep: false,
      reason: "noise_filtered",
      matched_terms: [],
    };
  }

  if (categoryKeeps.has(category)) {
    return {
      keep: true,
      reason: matched.length ? "category_and_keyword_match" : "category_candidate",
      matched_terms: matched.slice(0, 10),
    };
  }

  if (categoryNeedsKeyword.has(category)) {
    return {
      keep: matched.length > 0 || (actionSignal && aiContext),
      reason: matched.length ? "tip_keyword_match" : actionSignal && aiContext ? "tip_commercial_action_match" : "tip_without_signal",
      matched_terms: matched.slice(0, 10),
    };
  }

  // For AI HOT, do not allow generic keyword/action matches to admit non-AI industry news.
  // Unless the category is explicitly AI-related (ai-products/ai-models kept above), require AI anchor context.
  if (!aiContext) {
    return {
      keep: false,
      reason: "no_ai_anchor_context",
      matched_terms: matched.slice(0, 10),
    };
  }

  return {
    keep: matched.length > 0 || (actionSignal && aiContext),
    reason: matched.length ? "keyword_match" : actionSignal && aiContext ? "commercial_action_match" : "no_raw_entry_signal",
    matched_terms: matched.slice(0, 10),
  };
}

function themeFromAIHotDecision(item = {}, decision = {}) {
  const matched = Array.isArray(decision.matched_terms) ? decision.matched_terms : [];
  const themeMatch = matched.find((rule) => rule.type === "theme");
  if (themeMatch?.group) return themeMatch.group;
  const p1Match = matched.find((rule) => rule.type === "p1");
  const p1ToTheme = {
    mature: "mature-commercial-signal",
    early: "early-direction-signal",
    technical_iteration: "technical-iteration-signal",
    developer_ecosystem: "developer-ecosystem-signal",
  };
  if (p1Match?.group && p1ToTheme[p1Match.group]) return p1ToTheme[p1Match.group];

  const text = keywordMatchText(item);
  const category = String(item.category || "").toLowerCase();
  if (/funding|raises|series|seed|pre-seed|yc|融资|种子轮|天使轮|投资/iu.test(text)) return "early-direction-signal";
  if (/sdk|api|github|开源|developer|开发者|插件|framework|框架|marketplace/iu.test(text)) return "developer-ecosystem-signal";
  if (/model|模型|推理|inference|上下文|多模态|sandbox|沙箱|runtime|运行时|mcp|协议/iu.test(text) || ["ai-models", "paper"].includes(category)) return "technical-iteration-signal";
  if (/customer|客户|采购|部署|定价|计费|pricing|billing|enterprise|企业|合作|并购|收入/iu.test(text) || category === "industry") return "mature-commercial-signal";
  return "outside-core-exploration";
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function distributionText(distribution) {
  return Object.entries(distribution)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}

function normalizeDay(dateValue = "") {
  const match = String(dateValue).match(/\d{4}-\d{2}-\d{2}/u);
  return match ? match[0] : "";
}

function themeConcentrationWarning(items) {
  if (!items.length) return "no items";
  const distribution = countBy(items, "theme");
  const [theme, count] = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0] || ["unknown", 0];
  const share = count / items.length;
  const threshold = Number(keywordMonitoring.policy?.warning_threshold_share || 0.4);
  if (share > threshold) {
    return `warning: ${themeLabel(theme)} concentration ${(share * 100).toFixed(1)}% exceeds ${(threshold * 100).toFixed(0)}%; downstream Pool / change cards / frontstage business signals must diversify or declare theme_day=true.`;
  }
  return "none";
}

function signalCoverageGaps(items) {
  const required = Array.isArray(keywordMonitoring.policy?.required_signal_classes)
    ? keywordMonitoring.policy.required_signal_classes
    : [];
  const minRaw = Number(keywordMonitoring.policy?.raw_min_per_required_signal_class || 0);
  if (!required.length || !minRaw) return [];
  const byKeyword = countBy(items, "keyword_group");
  return required
    .map((signalClass) => ({
      signalClass,
      count: byKeyword[signalClass] || 0,
      min: minRaw,
    }))
    .filter((entry) => entry.count < entry.min);
}

function diversifyByTheme(items) {
  const target = items.length;
  const maxShare = Number(keywordMonitoring.policy?.raw_max_theme_share || 0.35);
  const maxPerTheme = Math.max(1, Math.ceil(target * maxShare));
  const grouped = new Map();
  for (const item of items) {
    const theme = item.theme || "uncategorized";
    if (!grouped.has(theme)) grouped.set(theme, []);
    grouped.get(theme).push(item);
  }
  for (const groupItems of grouped.values()) groupItems.sort((a, b) => b.score - a.score);

  const orderedThemes = [...themeOrder, ...[...grouped.keys()].filter((theme) => !themeOrder.includes(theme))];
  const picked = [];
  const seen = new Set();
  const themeCounts = {};
  let progressed = true;
  while (picked.length < target && progressed) {
    progressed = false;
    for (const theme of orderedThemes) {
      const bucket = grouped.get(theme);
      if (!bucket?.length) continue;
      if ((themeCounts[theme] || 0) >= maxPerTheme) continue;
      const item = bucket.shift();
      const key = item.url || `${item.title}-${item.source}`;
      if (seen.has(key)) continue;
      picked.push(item);
      seen.add(key);
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      progressed = true;
      if (picked.length >= target) break;
    }
  }

  if (picked.length < target) {
    for (const item of items.sort((a, b) => b.score - a.score)) {
      const key = item.url || `${item.title}-${item.source}`;
      if (seen.has(key)) continue;
      picked.push(item);
      seen.add(key);
      if (picked.length >= target) break;
    }
  }

  return picked;
}

function slugify(text = "") {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70) || "item";
}

function looksMojibake(text = "") {
  return /[ÃÂ�æäåèéï¼]/u.test(text);
}

function cleanText(primary = "", fallback = "") {
  const picked = primary && !looksMojibake(primary) ? primary : fallback || primary;
  return String(picked || "").replace(/\s+/g, " ").trim();
}

function urlHost(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function acquisitionSourceLevelFor(item = {}) {
  const channel = String(item.acquisition_channel || "").toLowerCase();
  if (/aihot|follow-builders|search|rss|aggregator|source-router/u.test(channel)) return "M";
  return "";
}

function researchStatusFor(item = {}) {
  const text = `${item.url || ""} ${item.source || ""} ${item.title || ""}`.toLowerCase();
  if (/arxiv\.org|arxiv/u.test(text)) return "preprint";
  if (/conference|proceedings|paper|benchmark|technical report|cncf|stanford|mit|berkeley/u.test(text)) return "formal_report";
  if (/nature\.com|science\.org|nejm|lancet/u.test(text)) return "peer_reviewed";
  return "not_research";
}

function isKnownOfficialHost(host = "") {
  return /(^|\.)?(openai\.com|anthropic\.com|googleblog\.com|developers\.googleblog\.com|deepmind\.google|microsoft\.com|github\.com|aws\.amazon\.com|amazon\.com|nvidia\.com|salesforce\.com|servicenow\.com|cursor\.com|perplexity\.ai|mistral\.ai|huggingface\.co|baidu\.com|alibabacloud\.com)$/iu.test(host);
}

function isOfficialGitHubRepo(item = {}) {
  const url = item.url || "";
  const source = `${item.source || ""} ${item.title || ""}`.toLowerCase();
  const match = url.match(/github\.com\/([^/\s?#]+)\/([^/\s?#]+)/iu);
  if (!match) return false;
  const org = match[1].toLowerCase();
  if (["openai", "anthropics", "anthropic-ai", "google", "google-gemini", "microsoft", "github", "aws", "nvidia", "salesforce", "servicenow", "huggingface", "vercel", "langchain-ai"].includes(org)) return true;
  return /official|release|changelog|readme|project page|项目方|官方/iu.test(source);
}

function classify(item) {
  const url = item.url || "";
  const host = urlHost(url);
  const source = `${item.source || ""} ${host}`.toLowerCase();
  const title = `${item.title || ""} ${item.summary || ""}`.toLowerCase();
  const acquisitionSourceLevel = acquisitionSourceLevelFor(item);
  const researchStatus = researchStatusFor(item);

  if (item.acquisition_channel === "follow-builders" && /x\.com|twitter\.com|follow-builders|builder|founder|ceo|cto|creator|project/i.test(source)) {
    return { level: "S", type: "official", acquisition_source_level: "M", research_status: researchStatus };
  }

  if (/github\.com/iu.test(host)) {
    return {
      level: isOfficialGitHubRepo(item) ? "S" : "B",
      type: "developer",
      acquisition_source_level: acquisitionSourceLevel,
      research_status: researchStatus,
    };
  }

  if (isKnownOfficialHost(host) || /openai|anthropic|google|microsoft|aws|cursor|baidu|alibaba|nvidia|servicenow|salesforce/iu.test(source)) {
    return { level: "S", type: "official", acquisition_source_level: acquisitionSourceLevel, research_status: researchStatus };
  }
  if (/reuters|axios|techcrunch|theinformation|ft\.com|cncf|arxiv|berkeley|bair|stanford|mit|nature|the-decoder/iu.test(source)) {
    return { level: "A", type: /arxiv|bair|stanford|mit|cncf|berkeley/iu.test(source) ? "research" : "media", acquisition_source_level: acquisitionSourceLevel, research_status: researchStatus };
  }
  if (/huggingface|pypi|npmjs|producthunt|yc|crunchbase|dealroom|pitchbook|simonwillison|substack|medium/iu.test(source)) {
    return { level: "B", type: /pypi|npmjs|huggingface/iu.test(source) ? "developer" : "industry", acquisition_source_level: acquisitionSourceLevel, research_status: researchStatus };
  }
  if (/x\.com|twitter|reddit|news\.ycombinator|hn\.algolia|aihot/iu.test(source) || /show hn|ask hn/iu.test(title)) {
    return { level: "C", type: "community", acquisition_source_level: acquisitionSourceLevel || (/aihot/iu.test(source) ? "M" : ""), research_status: researchStatus };
  }
  return { level: "B", type: "web", acquisition_source_level: acquisitionSourceLevel, research_status: researchStatus };
}

function score(item) {
  const text = `${item.title} ${item.summary} ${item.url}`.toLowerCase();
  let value = 0;
  for (const [pattern, weight] of [
    [/customer|case study|deployment|pilot|design partner|procurement|tender|客户|试点|采购|招投标/iu, 2],
    [/funding|raises|series|seed|pre-seed|arr|revenue|pricing|acquisition|融资|收入|并购|估值/iu, 2],
    [/security|privacy|lawsuit|regulation|compliance|churn|shutdown|incident|copyright|监管|诉讼|安全|流失/iu, 2],
    [/inference cost|model routing|model release|multimodal|on-device|latency|推理成本|模型路由|多模态/iu, 2],
    [/developer|github|sdk|framework|open-source|plugin marketplace|release notes|开源|开发者/iu, 1.5],
    [/enterprise|workflow|platform|api|health|finance|legal|manufacturing|insurance|企业|流程|平台|医疗|金融|法务|制造/iu, 1],
    [/agent|agentic|mcp|governance|copilot|智能体|治理/iu, 1],
  ]) {
    if (pattern.test(text)) value += weight;
  }
  if (item.theme && item.theme !== "enterprise-agent-governance" && item.theme !== "uncategorized") value += 1;
  // Source tier should affect evidence confidence, not drown out smaller but richer commercial signals.
  if (item.source_level === "S") value += 2.2;
  if (item.source_level === "A") value += 1.8;
  if (item.source_level === "B") value += 1.4;
  if (item.source_level === "C") value += 0.6;
  if (item.acquisition_channel === "aihot") value += 2;
  if (item.acquisition_channel === "aihot" && item.raw_entry_decision === "raw_candidate") value += 1;
  if (item.raw_entry_reason && /category|keyword|commercial_action/u.test(item.raw_entry_reason)) value += 0.5;
  if (item.acquisition_channel === "follow-builders") value += 2;
  if (item.acquisition_channel === "keyword-search") value += 2;
  if (/tool|tutorial|prompt|free|course|求职|简历|壁纸|封面/iu.test(text)) value -= 2;
  return value;
}

function rawCapturePriority(item) {
  const quality = extractionQuality(item.snapshot);
  const length = String(item.snapshot?.text || "").length;
  let value = item.score || 0;
  if (hasFullText(item.snapshot)) value += 6;
  if (quality === "high") value += 4;
  if (quality === "medium") value += 2.5;
  if (quality === "low") value -= 2;
  if (quality === "failed") value -= 6;
  if (length >= 2500) value += 2;
  if (length >= 900) value += 1;
  if (item.acquisition_channel === "aihot" && originFetchStatus(item.snapshot) !== "success") value -= 3;
  if (["S", "A", "B"].includes(item.source_level)) value += 1;
  if (item.source_level === "C" && !hasFullText(item.snapshot)) value -= 2;
  return value;
}

function prioritizeAfterFetch(items) {
  return [...items]
    .map((item) => ({ ...item, raw_capture_priority: rawCapturePriority(item) }))
    .sort((a, b) => b.raw_capture_priority - a.raw_capture_priority || b.score - a.score);
}

function formatFetchFailure(error) {
  if (!error) return "unknown fetch error";
  const message = String(error.message || error);
  const cause = error.cause;
  if (!cause || typeof cause !== "object") return message;
  const code = cause.code ? `code=${cause.code}` : "";
  const errno = cause.errno ? `errno=${cause.errno}` : "";
  const syscall = cause.syscall ? `syscall=${cause.syscall}` : "";
  const host = cause.hostname ? `host=${cause.hostname}` : "";
  const port = cause.port ? `port=${cause.port}` : "";
  const details = [code, errno, syscall, host, port].filter(Boolean).join(" ");
  return details ? `${message} (${details})` : message;
}

function compactSnippet(text, limit = 140) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function contentHash(text = "") {
  return crypto.createHash("sha256").update(String(text || ""), "utf8").digest("hex").slice(0, 16);
}

function decodeHtmlEntities(text = "") {
  return String(text || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function extractReadableText(bodyText = "", contentType = "", limit = 18000) {
  const raw = String(bodyText || "");
  if (!raw) return "";
  if (/json/i.test(contentType)) return compactSnippet(raw, Math.min(limit, 60000));
  if (!/<html|<body|<article|<p[\s>]/iu.test(raw)) return compactSnippet(raw, Math.min(limit, 60000));
  const withoutNoise = raw
    .replace(/<script[\s\S]*?<\/script>/giu, " ")
    .replace(/<style[\s\S]*?<\/style>/giu, " ")
    .replace(/<svg[\s\S]*?<\/svg>/giu, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/giu, " ")
    .replace(/<nav[\s\S]*?<\/nav>/giu, " ")
    .replace(/<footer[\s\S]*?<\/footer>/giu, " ")
    .replace(/<\/(h1|h2|h3|p|li|blockquote|section|article|div)>/giu, "\n")
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/<[^>]+>/gu, " ");
  return decodeHtmlEntities(withoutNoise)
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split(/\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 1)
    .join("\n")
    .slice(0, limit)
    .trim();
}

function keyExcerpt(text = "", fallback = "") {
  const cleaned = String(text || fallback || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "暂无可用摘录。";
  return cleaned.slice(0, 520);
}

function canonicalUrl(url = "") {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    for (const param of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"]) {
      parsed.searchParams.delete(param);
    }
    return parsed.toString().replace(/\/$/u, "");
  } catch {
    return url || "";
  }
}

function shortHash(text = "") {
  return crypto.createHash("sha256").update(String(text || ""), "utf8").digest("hex").slice(0, 16);
}

function markdownEscape(text = "") {
  return String(text || "").replace(/\r/g, "").trim();
}

function extractionQuality(snapshot = {}) {
  const length = String(snapshot.text || "").length;
  const status = String(snapshot.status || "");
  if (/fetch-failed|no-url|blocked|paywall/iu.test(status)) return "failed";
  if (/summary-only/iu.test(status)) return length >= 800 ? "low" : "failed";
  if (/http-\d+/iu.test(status)) return length >= 1200 ? "medium" : "low";
  if (length >= 2500) return "high";
  if (length >= 900) return "medium";
  if (length >= 400) return "low";
  return "failed";
}

function hasFullText(snapshot = {}) {
  return extractionQuality(snapshot) !== "failed" && !/summary-only/iu.test(String(snapshot.status || ""));
}

function sourceVolatility(item = {}) {
  const host = urlHost(item.url || "");
  const text = `${item.source || ""} ${item.source_type || ""} ${host} ${item.acquisition_channel || ""}`.toLowerCase();
  if (/x\.com|twitter\.com|reddit\.com|news\.ycombinator\.com|hn\.algolia|hacker news|community|social|follow-builders/u.test(text)) return "high";
  if (/aihot|newsletter|substack|medium|producthunt|github/u.test(text)) return "medium";
  return "low";
}

function isCommunitySource(item = {}) {
  const host = urlHost(item.url || "");
  const text = `${item.source || ""} ${item.source_type || ""} ${host} ${item.acquisition_channel || ""}`.toLowerCase();
  return /x\.com|twitter\.com|reddit\.com|news\.ycombinator\.com|hn\.algolia|hacker news|community|social|follow-builders/u.test(text);
}

function communityNameFor(item = {}) {
  if (!isCommunitySource(item)) return "";
  return item.source || urlHost(item.url || "") || item.acquisition_channel || "community";
}

function captureScopeFor(item = {}, status = "", text = "") {
  const host = urlHost(item.url || "");
  const length = String(text || "").length;
  if (item.acquisition_channel === "aihot" && /summary-only|fetch-failed|blocked|timeout/iu.test(status)) return "aihot_visible_text";
  if (/reddit\.com/u.test(host)) return length >= 2500 ? "post_and_top_comments" : "visible_text";
  if (/news\.ycombinator\.com|hn\.algolia/u.test(host)) return length >= 1800 ? "thread_text" : "visible_text";
  if (/x\.com|twitter\.com/u.test(host)) return "visible_text";
  if (/summary-only/iu.test(status)) return "summary_only";
  if (/fetch-failed|blocked|timeout/iu.test(status)) return "none";
  return "article_text";
}

function evidenceLevelFor(item = {}, snapshot = {}) {
  const status = String(snapshot.status || "");
  if (item.acquisition_channel === "aihot" && /summary-only|fetch-failed|blocked|timeout/iu.test(status)) return "discovery_only";
  if (isCommunitySource(item)) {
    if (/summary-only|fetch-failed|blocked|timeout/iu.test(status)) return "weak_signal";
    return /reddit|hacker news|news\.ycombinator|hn/iu.test(`${item.source || ""} ${item.url || ""}`)
      ? "user_feedback_signal"
      : "community_signal";
  }
  if (["S", "A", "B"].includes(item.source_level) && hasFullText(snapshot)) return "core_evidence_candidate";
  return hasFullText(snapshot) ? "supporting_evidence" : "weak_signal";
}

function originFetchStatus(snapshot = {}) {
  const status = String(snapshot.status || "");
  const error = String(snapshot.error || "");
  const combined = `${status} ${error}`.toLowerCase();
  if (/paywall|subscribe|subscription/u.test(combined)) return "paywalled";
  if (/403|forbidden|blocked|captcha|access denied/u.test(combined)) return "blocked";
  if (/timeout|aborted|etimedout/u.test(combined)) return "timeout";
  if (/fetched-clean-text/u.test(status) && String(snapshot.text || "").trim().length >= 400) return "success";
  if (/summary-only/u.test(status)) return "summary_only";
  return "failed";
}

function sourceRoleFor(item = {}, snapshot = {}) {
  if (item.acquisition_channel !== "aihot") return "primary_source";
  return originFetchStatus(snapshot) === "success" ? "primary_source" : "discovery_source";
}

function accessFlags(snapshot = {}) {
  const status = String(snapshot.status || "");
  const error = String(snapshot.error || "");
  const combined = `${status} ${error}`.toLowerCase();
  return {
    paywall: /paywall|subscribe|subscription|login required/u.test(combined),
    blocked: /blocked|403|forbidden|captcha|access denied/u.test(combined),
    duplicate: false,
  };
}

function sentences(text = "", limit = 8) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[。！？.!?])\s*/u)
    .map((line) => line.trim())
    .filter((line) => line.length >= 18)
    .slice(0, limit);
}

function excerptType(text = "") {
  if (/raise|funding|series|seed|融资|投资|基金|估值/iu.test(text)) return "funding";
  if (/\$|%|\d+(?:\.\d+)?\s*(?:million|billion|亿|万|%|x|倍|人|家|美元|人民币)/iu.test(text)) return "number";
  if (/[“"][^”"]{8,}[”"]/u.test(text)) return "quote";
  if (/risk|security|privacy|lawsuit|regulation|compliance|incident|风险|安全|隐私|诉讼|监管|合规/iu.test(text)) return "risk";
  if (/customer|case study|deployment|pilot|PwC|客户|案例|部署|试点|采用/iu.test(text)) return "case_detail";
  if (/workflow|process|approval|procurement|sales|support|流程|审批|采购|销售|客服|交付/iu.test(text)) return "workflow_change";
  if (/launch|release|announce|update|integrat|发布|推出|更新|集成|上线/iu.test(text)) return "product_update";
  if (/believe|argue|said|says|认为|表示|称|观点/iu.test(text)) return "opinion";
  return "company_action";
}

function supportsForExcerpt(type) {
  const supports = new Set(["daily_observation", "heatmap"]);
  if (["company_action", "product_update", "workflow_change", "risk"].includes(type)) supports.add("change");
  if (["case_detail", "company_action", "workflow_change", "number"].includes(type)) supports.add("case");
  if (["opinion", "quote"].includes(type)) supports.add("viewpoint");
  if (["company_action", "workflow_change", "funding", "number", "risk"].includes(type)) supports.add("trend");
  return [...supports];
}

function structuredKeyExcerpts(item, snapshotText) {
  const candidates = [
    item.summary,
    ...sentences(snapshotText, 7),
  ].filter(Boolean);
  const seen = new Set();
  return candidates.slice(0, 6).map((text) => {
    const cleaned = keyExcerpt(text, "", 360);
    if (seen.has(cleaned)) return null;
    seen.add(cleaned);
    const type = excerptType(cleaned);
    return {
      type,
      text: cleaned,
      supports: supportsForExcerpt(type),
      importance: item.score >= 7 || ["S", "A"].includes(item.source_level) ? "high" : "medium",
      confidence: extractionQuality(item.snapshot) === "high" && ["S", "A", "B"].includes(item.source_level) ? "high" : "medium",
    };
  }).filter(Boolean);
}

function extractNumbers(text = "") {
  const matches = String(text || "").match(/(?:\$|¥|￥)?\d+(?:\.\d+)?\s*(?:%|million|billion|trillion|M|B|亿|万|美元|人民币|人|家|次|倍|x)?/giu) || [];
  return [...new Set(matches.map((value) => value.trim()).filter((value) => /\d/u.test(value)))].slice(0, 8);
}

function extractQuotes(text = "") {
  const matches = String(text || "").match(/[“"][^”"]{8,160}[”"]/gu) || [];
  return matches.map((value) => value.replace(/^["“]|["”]$/gu, "")).slice(0, 5);
}

function splitSourceName(source = "") {
  return String(source || "")
    .split(/[：:｜|/,-]/u)
    .map((part) => part.trim())
    .filter((part) => part && part.length <= 40);
}

function extractBusinessElements(item, text = "") {
  const combined = `${item.title || ""}\n${item.summary || ""}\n${text || ""}`;
  const knownCompanies = [
    "OpenAI", "Anthropic", "Google", "Microsoft", "GitHub", "Meta", "Amazon", "AWS", "Nvidia",
    "Apple", "Salesforce", "ServiceNow", "PwC", "Deloitte", "Cursor", "Perplexity", "Mistral",
  ];
  const companies = new Set(splitSourceName(item.source));
  for (const company of knownCompanies) {
    if (new RegExp(`\\b${company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "iu").test(combined)) companies.add(company);
  }
  const products = [...new Set((combined.match(/\b(?:Claude|ChatGPT|Codex|Copilot|Gemini|Genkit|MCP|Agent|Agents|GPT-5|GPT-4|Cursor)\b/giu) || []).map((value) => value.trim()))].slice(0, 10);
  const industries = [];
  for (const [pattern, label] of [
    [/legal|law|法务|法律/iu, "法律 / 法务"],
    [/finance|bank|insurance|金融|银行|保险/iu, "金融 / 保险"],
    [/health|medical|医疗|医院/iu, "医疗"],
    [/manufacturing|factory|制造|工业/iu, "制造 / 工业"],
    [/developer|coding|code|开发者|编程/iu, "开发者工具"],
    [/enterprise|企业/iu, "企业服务"],
  ]) {
    if (pattern.test(combined)) industries.push(label);
  }
  const roles = [];
  for (const [pattern, label] of [
    [/CIO|CTO|IT leader|技术负责人|信息化/iu, "CIO / IT 负责人"],
    [/developer|engineer|开发者|工程师/iu, "开发者 / 工程团队"],
    [/legal|counsel|lawyer|法务|律师/iu, "法务 / 律师"],
    [/procurement|采购/iu, "采购负责人"],
    [/sales|客服|customer support|销售/iu, "销售 / 客服"],
  ]) {
    if (pattern.test(combined)) roles.push(label);
  }
  const workflows = [];
  for (const [pattern, label] of [
    [/contract|review|legal research|合同|审阅|法律研究/iu, "合同审阅 / 法律研究"],
    [/billing|usage|pricing|cost|账单|计费|预算|成本/iu, "计费 / 预算管理"],
    [/sandbox|permission|security|governance|权限|沙箱|安全|治理/iu, "权限 / 安全治理"],
    [/procurement|tender|采购|招投标/iu, "采购 / 招投标"],
    [/deployment|integration|交付|部署|集成/iu, "部署 / 集成交付"],
  ]) {
    if (pattern.test(combined)) workflows.push(label);
  }
  const businessActions = [];
  for (const [pattern, label] of [
    [/launch|release|announce|发布|推出/iu, "发布 / 推出"],
    [/partner|partnership|合作|联盟/iu, "合作 / 联盟"],
    [/deploy|roll out|部署|上线/iu, "部署 / 上线"],
    [/pricing|billing|计费|定价/iu, "定价 / 计费变化"],
    [/raise|funding|融资|投资/iu, "融资 / 投资"],
  ]) {
    if (pattern.test(combined)) businessActions.push(label);
  }
  const affectedDepartments = [];
  for (const [pattern, label] of [
    [/IT|security|CIO|安全|信息化/iu, "IT / 安全"],
    [/legal|law|法务/iu, "法务"],
    [/finance|cost|billing|财务|预算|账单/iu, "财务 / 预算"],
    [/procurement|采购/iu, "采购"],
    [/sales|support|客服|销售/iu, "销售 / 客服"],
  ]) {
    if (pattern.test(combined)) affectedDepartments.push(label);
  }
  return {
    companies: [...companies].filter(Boolean).slice(0, 12),
    products,
    people: [],
    industries: [...new Set(industries)],
    roles: [...new Set(roles)],
    workflows: [...new Set(workflows)],
    business_actions: [...new Set(businessActions)],
    affected_departments: [...new Set(affectedDepartments)],
    numbers: extractNumbers(combined),
    quotes: extractQuotes(combined),
  };
}

function evidenceSeed(item, elements, excerpts) {
  const actionExcerpts = excerpts.filter((excerpt) => ["company_action", "product_update", "funding"].includes(excerpt.type));
  const workflowExcerpts = excerpts.filter((excerpt) => excerpt.type === "workflow_change");
  const caseExcerpts = excerpts.filter((excerpt) => excerpt.type === "case_detail");
  const riskExcerpts = excerpts.filter((excerpt) => excerpt.type === "risk");
  return {
    company_actions: actionExcerpts.map((excerpt) => excerpt.text).slice(0, 3),
    case_details: caseExcerpts.map((excerpt) => excerpt.text).slice(0, 3),
    workflow_changes: workflowExcerpts.map((excerpt) => excerpt.text).slice(0, 3),
    before_after_clues: elements.workflows.map((workflow) => `可能涉及 ${workflow} 的前后变化，需要二搜补足变化前流程。`).slice(0, 3),
    affected_roles: elements.roles,
    risks_or_constraints: riskExcerpts.map((excerpt) => excerpt.text).slice(0, 3),
  };
}

function clampScore(value) {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function emergingSignalScore(item, quality, elements, seed) {
  const text = `${item.title || ""} ${item.summary || ""} ${item.url || ""}`.toLowerCase();
  let value = 1.5;
  if (/pre-seed|seed|angel|grant|yc|accelerator|stealth|spinout|demo day|early access|design partner/iu.test(text)) value += 1.4;
  if (/open source|github|sdk|framework|plugin|extension|marketplace|api|developer|开源|开发者|插件/iu.test(text)) value += 0.8;
  if (/hacker news|reddit|x\.com|twitter|discussion|comments|hn/iu.test(`${item.source || ""} ${item.url || ""}`)) value += 0.6;
  if (quality === "high" || quality === "medium") value += 0.5;
  if (elements.companies.length || elements.products.length) value += 0.4;
  if (seed.workflow_changes.length || seed.risks_or_constraints.length) value += 0.4;
  if (["S", "A"].includes(item.source_level) && !/pre-seed|seed|yc|github|sdk|open source|hacker news|reddit|x\.com|twitter/iu.test(text)) value -= 0.3;
  return clampScore(value);
}

function guanlanScores(item, quality, elements, seed) {
  const sourceBonus = { S: 1.3, A: 1, B: 0.5, C: 0, D: -1 }[item.source_level] || 0;
  const qualityBonus = { high: 1.4, medium: 0.8, low: 0.2, failed: -1 }[quality] || 0;
  const evidenceRichness = elements.companies.length + elements.workflows.length + elements.numbers.length + seed.case_details.length;
  return {
    commercial_value: clampScore(2 + item.score / 3),
    novelty: clampScore(2 + (item.theme && item.theme !== "uncategorized" ? 1 : 0) + (item.acquisition_channel === "follow-builders" ? 0.5 : 0)),
    evidence_strength: clampScore(2 + sourceBonus + qualityBonus),
    case_richness: clampScore(1 + evidenceRichness / 3),
    trend_relevance: clampScore(2 + item.score / 4 + (seed.workflow_changes.length ? 0.8 : 0)),
    guanlan_relevance: clampScore(2 + item.score / 4 + (elements.workflows.length ? 0.8 : 0) + (elements.affected_departments.length ? 0.5 : 0)),
    emerging_signal_score: emergingSignalScore(item, quality, elements, seed),
  };
}

function usableFor(item, quality, scores, excerpts) {
  const coreEvidence = hasFullText(item.snapshot) && !["low", "failed"].includes(quality);
  const types = new Set(excerpts.map((excerpt) => excerpt.type));
  const community = item.source_level === "C" || isCommunitySource(item);
  return {
    viewpoint: coreEvidence && (types.has("opinion") || types.has("quote") || item.acquisition_channel === "follow-builders"),
    case: coreEvidence && (types.has("case_detail") || scores.case_richness >= 3),
    change: coreEvidence && ["company_action", "product_update", "workflow_change", "risk"].some((type) => types.has(type)),
    trend: coreEvidence && scores.trend_relevance >= 4,
    daily_observation: coreEvidence && scores.guanlan_relevance >= 3,
    heatmap: scores.guanlan_relevance >= 3,
    briefing: coreEvidence && scores.commercial_value >= 4,
    emerging_pool: scores.emerging_signal_score >= 4,
    user_feedback_pool: community && coreEvidence,
    watchlist: scores.emerging_signal_score >= 3 || scores.guanlan_relevance >= 3,
  };
}

function poolRoutesFor(item, quality, scores, usable) {
  const routes = new Set();
  const coreEvidence = hasFullText(item.snapshot) && ["high", "medium"].includes(quality) && ["S", "A", "B"].includes(item.source_level);
  if (coreEvidence && scores.commercial_value >= 3 && scores.guanlan_relevance >= 3) routes.add("core_pool");
  if (usable.emerging_pool) routes.add("emerging_pool");
  if (usable.user_feedback_pool) routes.add("user_feedback_pool");
  if (usable.watchlist && !routes.has("core_pool")) routes.add("watchlist");
  if (!routes.size && quality === "failed") routes.add("discard");
  if (!routes.size) routes.add("index_only");
  return [...routes];
}

function missingInformation(item, elements, seed) {
  const missing = [];
  if (!elements.companies.length) missing.push("没有明确公司或机构主体");
  if (!seed.case_details.length) missing.push("没有具体客户或真实企业案例");
  if (!seed.before_after_clues.length) missing.push("没有变化前后流程线索");
  if (!elements.numbers.length) missing.push("没有成本、收入、采用率或市场规模数字");
  if (!elements.quotes.length && item.acquisition_channel === "follow-builders") missing.push("没有可核验原文引述");
  if (["C", "D"].includes(item.source_level)) missing.push("缺少一手来源或可靠转述来源");
  if (!hasFullText(item.snapshot)) missing.push("没有可用全文快照");
  return missing;
}

function buildMarkdownSnapshot(item, record) {
  return [
    `# ${item.title}`,
    "",
    `- raw_id: ${record.raw_id}`,
    `- original_url: ${record.original_url || "no-url"}`,
    `- source_name: ${record.source_name || "unknown"}`,
    `- collected_at: ${record.collected_at}`,
    "",
    "## clean_text",
    "",
    record.clean_text || "未抓到正文。",
    "",
    "## full_text",
    "",
    record.full_text || record.clean_text || "未抓到全文。",
    "",
    "## key_excerpts",
    "",
    ...record.key_excerpts.map((excerpt, index) => `${index + 1}. [${excerpt.type} / ${excerpt.supports.join(", ")} / ${excerpt.importance}] ${excerpt.text}`),
    "",
  ].join("\n");
}

function rawStatusFor(item, quality, isPooled) {
  if (isPooled) return "pooled";
  if (hasFullText(item.snapshot) && !["low", "failed"].includes(quality) && item.score >= 6) return "candidate";
  if (item.score <= 1 || quality === "failed") return "ignored";
  return "indexed";
}

function buildRawRecord(item, id, originalPath, jsonPath, isPooled) {
  const collectedAt = new Date().toISOString();
  const snapshotText = item.snapshot?.text || item.summary || "未抓到正文。";
  const fullText = item.snapshot?.full_text || snapshotText;
  const quality = extractionQuality(item.snapshot);
  const canonical = canonicalUrl(item.url || "");
  const excerpts = structuredKeyExcerpts(item, snapshotText);
  const elements = extractBusinessElements(item, snapshotText);
  const seed = evidenceSeed(item, elements, excerpts);
  const scores = guanlanScores(item, quality, elements, seed);
  const usable = usableFor(item, quality, scores, excerpts);
  const flags = accessFlags(item.snapshot);
  const record = {
    schema_version: "raw-evidence-v2",
    raw_id: id,
    title: item.title || "",
    original_url: item.url || "",
    canonical_url: canonical,
    source_name: item.source || "",
    source_type: item.source_type || "unknown",
    source_level: item.source_level || "unknown",
    acquisition_source_level: item.acquisition_source_level || acquisitionSourceLevelFor(item) || "",
    acquisition_channel: item.acquisition_channel || "unknown",
    research_status: item.research_status || researchStatusFor(item),
    search_intent: item.search_intent || "",
    search_path: item.search_path || "",
    search_path_label: item.search_path_label || "",
    author: item.author || "",
    published_at: item.published_at || "",
    collected_at: collectedAt,
    language: item.language || "mixed",
    full_text: fullText,
    clean_text: snapshotText,
    markdown_snapshot_path: rel(originalPath),
    json_snapshot_path: rel(jsonPath),
    html_snapshot_path: "",
    screenshot_path: "",
    fetch_status: item.snapshot?.status || "not-attempted",
    extraction_quality: quality,
    has_full_text: hasFullText(item.snapshot),
    content_length: fullText.length,
    fetch_error: item.snapshot?.error || "",
    source_volatility: sourceVolatility(item),
    community_name: communityNameFor(item),
    capture_scope: item.snapshot?.capture_scope || captureScopeFor(item, item.snapshot?.status || "", snapshotText),
    visible_range: item.snapshot?.visible_range || "",
    evidence_level: evidenceLevelFor(item, item.snapshot),
    discovery_source: item.discovery_source || "",
    discovery_record: item.discovery_record || null,
    source_role: sourceRoleFor(item, item.snapshot),
    origin_fetch_status: item.acquisition_channel === "aihot" ? originFetchStatus(item.snapshot) : "",
    paywall_status: flags.paywall ? "suspected" : "none",
    block_status: flags.blocked ? "suspected" : "none",
    duplicate_status: flags.duplicate ? "duplicate" : "unique",
    url_hash: shortHash(canonical || item.url || ""),
    content_hash: item.snapshot?.hash || shortHash(snapshotText),
    full_text_hash: item.snapshot?.full_text_hash || shortHash(fullText),
    semantic_hash: shortHash(`${item.title || ""}\n${keyExcerpt(snapshotText, item.summary)}`),
    duplicate_of: "",
    first_seen_at: item.published_at || collectedAt,
    last_seen_at: collectedAt,
    update_detected: false,
    key_excerpts: excerpts,
    business_elements: elements,
    evidence_seed: seed,
    guanlan_scores: scores,
    usable_for: usable,
    pool_routes: poolRoutesFor(item, quality, scores, usable),
    missing_information: missingInformation(item, elements, seed),
    raw_status: rawStatusFor(item, quality, isPooled),
    copyright_note: "local research archive only",
  };
  record.markdown_snapshot = buildMarkdownSnapshot(item, record);
  return record;
}

async function fetchSourceSnapshot(item) {
  const url = item.url || "";
  const summary = String(item.summary || "").trim();
  const fetchedAt = new Date().toISOString();
  if (!url) {
    const text = summary || "当前来源没有原始 URL，已保留采集通道提供的可用文本。";
    return {
      status: "no-url-summary-only",
      text,
      full_text: text,
      excerpt: keyExcerpt(text),
      fetched_at: fetchedAt,
      content_type: "summary",
      capture_scope: "summary_only",
      visible_range: "采集通道提供的标题与摘要",
      hash: contentHash(text),
      full_text_hash: contentHash(text),
      error: "",
    };
  }
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "WaveSightAI/2.0 raw-snapshot",
        accept: "text/html,application/json,text/plain,*/*",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(snapshotTimeoutMs),
    });
    const contentType = response.headers.get("content-type") || "";
    const bodyText = await response.text();
    const fullText = extractReadableText(bodyText, contentType, 60000);
    const extractedText = fullText ? fullText.slice(0, 18000).trim() : "";
    const text = extractedText || summary || compactSnippet(bodyText, 4000);
    const status = response.ok
      ? (extractedText ? "fetched-clean-text" : "summary-only-no-readable-body")
      : (/403|401/u.test(String(response.status)) ? `blocked-http-${response.status}` : `http-${response.status}-fallback-text`);
    return {
      status,
      text,
      full_text: fullText || text,
      excerpt: keyExcerpt(text, summary),
      fetched_at: fetchedAt,
      content_type: contentType || "unknown",
      capture_scope: captureScopeFor(item, status, text),
      visible_range: response.ok ? "抓取时页面可见正文 / 讨论文本" : `HTTP ${response.status} fallback 可见文本`,
      hash: contentHash(text),
      full_text_hash: contentHash(fullText || text),
      error: response.ok ? "" : `${response.status} ${response.statusText}`,
    };
  } catch (error) {
    const formattedError = formatFetchFailure(error);
    const text = summary || "正文抓取失败，保留标题、来源与采集摘要；进入前台前必须二搜补证。";
    const blocked = /403|forbidden|blocked|captcha|access denied/iu.test(formattedError);
    const timeout = /timeout|aborted|etimedout/iu.test(formattedError);
    return {
      status: blocked ? "blocked-fallback-visible-text" : timeout ? "timeout-fallback-visible-text" : "fetch-failed-fallback-visible-text",
      text,
      full_text: text,
      excerpt: keyExcerpt(text),
      fetched_at: fetchedAt,
      content_type: "summary",
      capture_scope: item.acquisition_channel === "aihot" ? "aihot_visible_text" : "summary_only",
      visible_range: "仅保留采集通道当时可见文本，未抓到原页面正文",
      hash: contentHash(text),
      full_text_hash: contentHash(text),
      error: formattedError,
    };
  }
}

async function enrichSnapshots(items) {
  const enriched = new Array(items.length);
  let cursor = 0;
  const workerCount = Math.min(6, Math.max(1, items.length));
  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      enriched[index] = { ...items[index], snapshot: await fetchSourceSnapshot(items[index]) };
    }
  }));
  return enriched;
}

async function fetchJson(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: {
        "user-agent": "WaveSightAI/2.0 daily-source-router",
        accept: "application/json,text/plain,*/*",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(fetchTimeoutMs),
    });
  } catch (error) {
    throw new Error(formatFetchFailure(error));
  }

  const contentType = response.headers.get("content-type") || "";
  const bodyText = await response.text();
  if (!response.ok) {
    const snippet = compactSnippet(bodyText);
    throw new Error(`${response.status} ${response.statusText}${snippet ? ` — ${snippet}` : ""}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch (error) {
    const snippet = compactSnippet(bodyText);
    const typeNote = contentType ? `content-type=${contentType}` : "content-type=unknown";
    throw new Error(`${typeNote}; invalid JSON — ${formatFetchFailure(error)}${snippet ? ` — ${snippet}` : ""}`);
  }
}

let gdeltLastRequestAt = 0;
const gdeltMinIntervalMs = 5500;

function isRetryableGdeltError(message = "") {
  const text = String(message || "").toLowerCase();
  if (text.includes("too short") || text.includes("illegal character")) return false;
  return (
    text.includes("429") ||
    text.includes("und_err_connect_timeout") ||
    text.includes("econnreset") ||
    text.includes("fetch failed") ||
    text.includes("timed out")
  );
}

async function fetchGdeltJsonWithRetry(url, attempts = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const now = Date.now();
    const waitMs = Math.max(0, gdeltMinIntervalMs - (now - gdeltLastRequestAt));
    if (waitMs > 0) await sleep(waitMs);
    gdeltLastRequestAt = Date.now();
    try {
      return await fetchJson(url);
    } catch (error) {
      lastError = error;
      const message = error?.message || String(error || "");
      if (!isRetryableGdeltError(message) || attempt === attempts) break;
      const backoffMs = gdeltMinIntervalMs * attempt;
      await sleep(backoffMs);
    }
  }
  throw lastError || new Error("GDELT request failed");
}

function decodeSearchResultUrl(href = "") {
  const raw = decodeHtmlEntities(String(href || ""));
  if (!raw) return "";
  try {
    if (raw.startsWith("/")) {
      const parsed = new URL(raw, "https://duckduckgo.com");
      const uddg = parsed.searchParams.get("uddg");
      return uddg ? decodeURIComponent(uddg) : parsed.toString();
    }
    const parsed = new URL(raw);
    const uddg = parsed.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : parsed.toString();
  } catch {
    return raw;
  }
}

function stripHtml(text = "") {
  return decodeHtmlEntities(String(text || "").replace(/<[^>]+>/gu, " ")).replace(/\s+/g, " ").trim();
}

function parseDuckDuckGoResults(html = "", limit = 5) {
  const results = [];
  const blocks = String(html || "").split(/<div[^>]+class="[^"]*result[^"]*"[^>]*>/giu).slice(1);
  for (const block of blocks) {
    const linkMatch = block.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/iu);
    if (!linkMatch) continue;
    const url = decodeSearchResultUrl(linkMatch[1]);
    const title = stripHtml(linkMatch[2]);
    if (!url || !title || /duckduckgo\.com/iu.test(url)) continue;
    const snippetMatch = block.match(/<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>|<div[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/iu);
    const snippet = stripHtml(snippetMatch?.[1] || snippetMatch?.[2] || "");
    results.push({ title, url, snippet });
    if (results.length >= limit) break;
  }
  return results;
}

async function searchDuckDuckGo(query, limit = 5) {
  try {
    const url = new URL("https://duckduckgo.com/html/");
    url.searchParams.set("q", query);
    const ddgTimeoutMs = Math.min(fetchTimeoutMs, 4000);
    const response = await fetch(url.toString(), {
      headers: {
        "user-agent": "WaveSightAI/2.0 keyword-search",
        accept: "text/html,*/*",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(ddgTimeoutMs),
    });
    const html = await response.text();
    if (!response.ok) throw new Error(`DuckDuckGo ${response.status} ${response.statusText}`);
    const parsed = parseDuckDuckGoResults(html, limit);
    if (!parsed.length) throw new Error("DuckDuckGo returned 0 parseable results");
    return parsed;
  } catch (error) {
    // DuckDuckGo is occasionally unreachable or blocked in some environments; fallback to Bing HTML.
    return searchBing(query, limit, error);
  }
}

function parseBingResults(html = "", limit = 5) {
  const results = [];
  const blocks = String(html || "").split('<li class="b_algo"').slice(1);
  for (const block of blocks) {
    if (results.length >= limit) break;
    const linkMatch = block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/iu);
    if (!linkMatch?.[1]) continue;
    const url = decodeHtmlEntities(linkMatch[1]);
    const title = stripHtml(linkMatch[2] || "");
    if (!url || !title) continue;

    const snippetMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/iu);
    const snippet = stripHtml(snippetMatch?.[1] || "");
    results.push({
      id: url,
      title,
      url,
      snippet,
      source: "keyword search / Bing",
    });
  }
  return results;
}

async function searchBing(query, limit = 5, priorError) {
  const url = new URL("https://www.bing.com/search");
  url.searchParams.set("q", query);
  const response = await fetch(url.toString(), {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      accept: "text/html,*/*",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(fetchTimeoutMs),
  });
  const html = await response.text();
  if (!response.ok) {
    const prefix = priorError ? `DDG failed (${priorError.message}); ` : "";
    throw new Error(`${prefix}Bing ${response.status} ${response.statusText}`);
  }
  const parsed = parseBingResults(html, limit);
  if (!parsed.length) {
    const prefix = priorError ? `DDG failed (${priorError.message}); ` : "";
    throw new Error(`${prefix}Bing returned 0 parseable results`);
  }
  return parsed;
}

function inferSearchIntent(query = "") {
  const text = String(query || "").toLowerCase();
  if (/official|launch|release|changelog|api|sdk|pricing|product|docs|发布|更新|定价|文档/iu.test(text)) return "find_original_source";
  if (/startup|seed|pre-seed|angel|yc|funding|raises|融资|种子轮|天使轮/iu.test(text)) return "find_startups";
  if (/customer|case|deployment|adoption|pilot|客户|案例|部署|试点/iu.test(text)) return "find_customer_case";
  if (/workflow|process|operation|procurement|sales|support|finance|legal|流程|岗位|采购|销售|客服|法务|财务/iu.test(text)) return "find_workflow_change";
  if (/github|npm|pypi|huggingface|sdk|framework|open source|developer|开源|开发者/iu.test(text)) return "find_developer_adoption";
  if (/tender|procurement|marketplace|app store|采购|招投标|市场/iu.test(text)) return "find_procurement_signal";
  if (/reddit|hacker news|hn|feedback|comment|issue|用户反馈|讨论/iu.test(text)) return "find_user_feedback";
  if (/market|trend|regulation|media|行业|趋势|监管/iu.test(text)) return "find_market_trend";
  return "verify_company_action";
}

const keywordSearchPaths = [
  {
    id: "official_original",
    label: "官方原始路径",
    role: "verify company actions, product changes and official claims",
    method: "ddg",
    querySuffix: "(official OR blog OR changelog OR docs OR API OR SDK OR pricing OR customer story OR partnership OR launch)",
  },
  {
    id: "developer_ecosystem",
    label: "开发生态路径",
    role: "find repositories, packages, models, plugins and developer adoption",
    method: "ddg",
    querySuffix: "(site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)",
  },
  {
    id: "capital_startup",
    label: "资本与创业公司路径",
    role: "find startups, investors and funding signals",
    method: "ddg",
    querySuffix: "(startup OR funding OR seed OR pre-seed OR YC OR venture OR Crunchbase OR Dealroom OR PitchBook OR Tracxn)",
  },
  {
    id: "industry_landing",
    label: "行业落地路径",
    role: "find industry adoption, workflows and customer scenarios",
    method: "ddg",
    querySuffix: "(industry use case OR customer case OR vertical SaaS OR consulting report OR workflow OR adoption)",
  },
  {
    id: "procurement_marketplace",
    label: "采购 / 招投标 / Marketplace 路径",
    role: "find procurement, marketplace, app store and job signal",
    method: "ddg",
    querySuffix: "(procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)",
  },
  {
    id: "a_media_gdelt",
    label: "A 级媒体 / GDELT 路径",
    role: "verify major events, diffusion, capital moves and regulation",
    method: "gdelt_then_ddg",
    fallbackQuerySuffix: "(site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)",
    querySuffix: "",
  },
  {
    id: "community_feedback",
    label: "社区反馈路径",
    role: "find user feedback, developer discussion and early heat",
    method: "hn",
    querySuffix: "",
  },
];

function selectQueriesForPath(allQueries, pathConfig) {
  const byTheme = new Map();
  for (const query of allQueries) {
    if (!byTheme.has(query.query_theme)) byTheme.set(query.query_theme, []);
    byTheme.get(query.query_theme).push(query);
  }
  const selected = [];
  for (const groupQueries of byTheme.values()) {
    selected.push(...groupQueries.slice(0, 1));
  }
  for (const query of allQueries) {
    if (selected.length >= Math.max(searchPathQueryLimit, 1) * Math.max(1, byTheme.size)) break;
    if (!selected.includes(query)) selected.push(query);
  }
  return selected.slice(0, Math.max(searchPathQueryLimit * Math.max(1, byTheme.size), searchPathQueryLimit));
}

function keywordSearchItem(result, queryConfig, pathConfig, extra = {}) {
  const intent = extra.search_intent || inferSearchIntent(queryConfig.query);
  return {
    acquisition_channel: "keyword-search",
    original_id: result.id || result.url || `${pathConfig.id}:${queryConfig.query}:${result.title}`,
    title: result.title || "",
    summary: `${result.snippet || result.summary || ""}${result.meta ? ` / ${result.meta}` : ""} / query=${queryConfig.query} / intent=${intent} / path=${pathConfig.id}`.trim(),
    url: result.url || "",
    source: result.source || `keyword search / ${pathConfig.label}`,
    published_at: result.published_at || "",
    category: pathConfig.id,
    search_intent: intent,
    search_path: pathConfig.id,
    search_path_label: pathConfig.label,
    query_theme: queryConfig.query_theme,
    keyword_group: queryConfig.keyword_group,
  };
}

async function collectAIHot() {
  const items = [];
  const failures = [];
  let discoveredCountAll = 0;
  let discoveredCountDaily = 0;
  let rejectedCount = 0;
  const since = new Date(Date.now() - aihotWindowHours * 60 * 60 * 1000).toISOString();
  const seen = new Set();

  const fetchMode = async (mode, options = {}) => {
    const out = [];
    let cursor = "";
    let discovered = 0;
    const maxItems = Number(options.maxItems || 1000);
    while (discovered < maxItems) {
      const url = new URL("https://aihot.virxact.com/api/public/items");
      url.searchParams.set("mode", mode);
      if (options.since) url.searchParams.set("since", options.since);
      url.searchParams.set("take", "100");
      url.searchParams.set("limit", "100");
      if (cursor) url.searchParams.set("cursor", cursor);
      try {
        const data = await fetchJson(url.toString());
        const batch = Array.isArray(data.items) ? data.items : [];
        for (const item of batch) {
          out.push(item);
          discovered += 1;
          if (discovered >= maxItems) break;
        }
        if (!data.hasNext || !data.nextCursor || batch.length === 0 || discovered >= maxItems) break;
        cursor = data.nextCursor;
      } catch (error) {
        failures.push(`AI HOT (${mode}): ${error.message}`);
        break;
      }
    }
    return { items: out, discovered };
  };

  const createCandidate = (item, rank, lane) => {
    const title = cleanText(
      item.title || item.headline || item.itemTitle || item.name || item.topic,
      item.title_en || item.summary || item.description || item.snippet
    );
    const summary = cleanText(
      item.summary || item.description || item.snippet || item.content || item.text || item.lead,
      item.title_en || item.title || item.headline
    );
    const url = item.url || item.link || item.original_url || item.originalUrl || item.origin_url || item.originUrl || "";
    const sourceName = item.source || item.sourceName || item.publisher || item.media || "AI HOT";
    const publishedAt = item.publishedAt || item.published_at || item.published || item.date || "";
    const category = item.category || item.section || "industry";
    const originalId = item.id || item.itemId || url || `${lane}-${rank}`;
    return {
      acquisition_channel: "aihot",
      aihot_lane: lane,
      original_id: originalId,
      title,
      summary,
      url,
      source: cleanText(sourceName, "AI HOT"),
      published_at: publishedAt,
      category,
      discovery_source: "AI HOT",
      discovery_record: {
        discovery_title: title,
        discovery_summary: summary,
        source_name: cleanText(sourceName, "AI HOT"),
        origin_url: url,
        discovered_at: new Date().toISOString(),
        rank_on_page: rank,
        discovery_status: "discovered",
      },
    };
  };

  const markSeen = (candidate) => {
    const key = candidate.original_id || candidate.url || candidate.title;
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };

  const extractDailyItems = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    const direct = [
      payload.items,
      payload.data,
      payload.results,
      payload.list,
    ].find((value) => Array.isArray(value));
    if (Array.isArray(direct)) return direct;
    if (Array.isArray(payload.sections)) {
      return payload.sections.flatMap((section) => (Array.isArray(section.items) ? section.items : []));
    }
    return [];
  };

  const fetchDaily = async (dailyDate) => {
    const endpoints = [
      `https://aihot.virxact.com/api/public/daily/${dailyDate}`,
      "https://aihot.virxact.com/api/public/daily",
    ];
    let discovered = 0;
    for (const endpoint of endpoints) {
      try {
        const data = await fetchJson(endpoint);
        const dailyItems = extractDailyItems(data);
        if (dailyItems.length) {
          discovered = dailyItems.length;
          return { items: dailyItems, discovered };
        }
      } catch (error) {
        failures.push(`AI HOT (daily endpoint ${endpoint}): ${error.message}`);
      }
    }
    return { items: [], discovered };
  };

  // 1) Pull AI HOT daily report first and include all curated daily items.
  const daily = await fetchDaily(date);
  discoveredCountDaily = daily.discovered;
  for (const item of daily.items) {
    const rank = items.length + 1;
    const candidate = createCandidate(item, rank, "daily");
    if (!markSeen(candidate)) continue;
    const decision = aihotRawEntryDecision(candidate);
    const queryTheme = themeFromAIHotDecision(candidate, decision);
    items.push({
      ...candidate,
      raw_entry_decision: "raw_candidate",
      raw_entry_reason: "daily_curated_candidate",
      raw_entry_matched_terms: decision.matched_terms || [],
      query_theme: queryTheme,
      keyword_group: queryTheme,
    });
  }

  // 2) Pull 24h full feed, skip items already in daily, then apply keyword/action rules on the remaining items.
  const full = await fetchMode(aihotMode, { since, maxItems: aihotTarget });
  discoveredCountAll = full.discovered;
  for (const item of full.items) {
    const rank = items.length + rejectedCount + 1;
    const candidate = createCandidate(item, rank, "all");
    if (!markSeen(candidate)) continue;
    try {
      const decision = aihotRawEntryDecision(candidate);
      if (decision.keep) {
        const queryTheme = themeFromAIHotDecision(candidate, decision);
        items.push({
          ...candidate,
          raw_entry_decision: "raw_candidate",
          raw_entry_reason: decision.reason,
          raw_entry_matched_terms: decision.matched_terms,
          query_theme: queryTheme,
          keyword_group: queryTheme,
        });
      } else {
        rejectedCount += 1;
      }
    } catch (error) {
      failures.push(`AI HOT (${aihotMode}) item process failed: ${error.message}`);
    }
  }

  return {
    items,
    failures,
    discovered_count: discoveredCountDaily + discoveredCountAll,
    discovered_count_daily: discoveredCountDaily,
    discovered_count_all: discoveredCountAll,
    included_count_daily: items.filter((item) => item.aihot_lane === "daily").length,
    rejected_count: rejectedCount,
    mode: `daily+${aihotMode}`,
    since,
  };
}

async function collectHN() {
  const failures = [];
  const queries = laneQueries("hn", ["AI agent OR agentic AI"]);
  const items = [];
  for (const queryConfig of queries) {
    const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
    url.searchParams.set("query", queryConfig.query);
    url.searchParams.set("tags", "story");
    url.searchParams.set("hitsPerPage", String(Math.ceil(hnTarget / queries.length)));
    try {
      const data = await fetchJson(url.toString());
      const hits = Array.isArray(data.hits) ? data.hits : [];
      items.push(...hits.map((item) => ({
        acquisition_channel: "hn",
        original_id: item.objectID,
        title: item.title || item.story_title || "",
        summary: `${item.points || 0} points / ${item.num_comments || 0} comments / query=${queryConfig.query}`,
        url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
        source: "Hacker News",
        published_at: item.created_at || "",
        category: "developer",
        query_theme: queryConfig.query_theme,
        keyword_group: queryConfig.keyword_group,
      })));
    } catch (error) {
      failures.push(`HN ${queryConfig.query}: ${error.message}`);
    }
  }
  return { items: items.slice(0, hnTarget), failures };
}

async function collectFollowBuildersProxy() {
  const queries = laneQueries("builder_proxy", [
    "AI agent builder product launch",
    "AI coding agent founder",
    "agentic workflow builder",
    "AI startup founder agent",
    "Claude Code builder workflow",
  ]);
  const items = [];
  const failures = [];
  for (const queryConfig of queries) {
    const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
    url.searchParams.set("query", queryConfig.query);
    url.searchParams.set("tags", "story");
    url.searchParams.set("hitsPerPage", String(Math.ceil(buildersTarget / queries.length)));
    try {
      const data = await fetchJson(url.toString());
      const hits = Array.isArray(data.hits) ? data.hits : [];
      for (const item of hits) {
        items.push({
          acquisition_channel: "follow-builders",
          original_id: item.objectID,
          title: item.title || item.story_title || "",
          summary: `${item.points || 0} points / ${item.num_comments || 0} comments / query=${queryConfig.query}`,
          url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
          source: "follow-builders proxy / HN builder query",
          published_at: item.created_at || "",
          category: "builder",
          query_theme: queryConfig.query_theme,
          keyword_group: queryConfig.keyword_group,
        });
      }
    } catch (error) {
      failures.push(`follow-builders proxy ${queryConfig.query}: ${error.message}`);
    }
  }
  return { items: items.slice(0, buildersTarget), failures };
}

async function collectFollowBuildersSkill() {
  const failures = [];
  if (!fs.existsSync(followBuildersSkillScript)) {
    return {
      items: [],
      failures: [`follow-builders skill script not found: ${followBuildersSkillScript}`],
    };
  }

  try {
    const { stdout } = await execFileAsync("node", [followBuildersSkillScript], {
      maxBuffer: 80 * 1024 * 1024,
      timeout: 180_000,
    });
    const data = JSON.parse(stdout);
    const items = [];

    for (const builder of Array.isArray(data.x) ? data.x : []) {
      for (const tweet of Array.isArray(builder.tweets) ? builder.tweets : []) {
        if (!tweet.url || !tweet.text) continue;
        const tweetText = String(tweet.text || "").trim();
        const engagement = `likes=${tweet.likes || 0}; retweets=${tweet.retweets || 0}; replies=${tweet.replies || 0}`;
        const builderBio = String(builder.bio || "").trim();
        items.push({
          acquisition_channel: "follow-builders",
          original_id: tweet.id,
          title: `${builder.name || builder.handle}｜${tweetText.slice(0, 90)}`,
          summary: [tweetText, builderBio, engagement].filter(Boolean).join("\n\n").slice(0, 1600),
          url: tweet.url,
          source: `follow-builders / X / ${builder.name || builder.handle}`,
          published_at: tweet.createdAt || "",
          category: "builder-x",
        });
      }
    }

    for (const blog of Array.isArray(data.blogs) ? data.blogs : []) {
      if (!blog.url || !blog.title) continue;
      items.push({
        acquisition_channel: "follow-builders",
        original_id: blog.guid || blog.url,
        title: `${blog.name || "Builder Blog"}｜${blog.title}`,
        summary: blog.summary || blog.description || "",
        url: blog.url,
        source: `follow-builders / blog / ${blog.name || ""}`.trim(),
        published_at: blog.publishedAt || "",
        category: "builder-blog",
      });
    }

    for (const podcast of Array.isArray(data.podcasts) ? data.podcasts : []) {
      if (!podcast.url || !podcast.title) continue;
      items.push({
        acquisition_channel: "follow-builders",
        original_id: podcast.guid || podcast.url,
        title: `${podcast.name || "Builder Podcast"}｜${podcast.title}`,
        summary: String(podcast.transcript || "").slice(0, 1200),
        url: podcast.url,
        source: `follow-builders / podcast / ${podcast.name || ""}`.trim(),
        published_at: podcast.publishedAt || "",
        category: "builder-podcast",
      });
    }

    if (!items.length) failures.push("follow-builders skill returned no usable builder items");
    return { items, failures };
  } catch (error) {
    failures.push(`follow-builders skill: ${error.message}`);
    return { items: [], failures };
  }
}

async function collectFollowBuilders() {
  const fromSkill = await collectFollowBuildersSkill();
  if (fromSkill.items.length) return fromSkill;
  const fromProxy = await collectFollowBuildersProxy();
  return {
    items: fromProxy.items,
    failures: [...fromSkill.failures, ...fromProxy.failures],
  };
}

async function collectKeywordSearch() {
  const allQueries = laneQueries("keyword_search", [
    "AI agent enterprise funding",
    "AI agent product launch enterprise",
    "AI governance agent platform",
    "AI coding agent security sandbox",
    "AI customer service agent platform",
    "agentic AI workflow automation",
    "AI agents finance compliance",
    "AI agent startup raises",
  ]);
  const items = [];
  const failures = [];
  const perPathResultLimit = Math.max(2, Math.ceil(searchTarget / Math.max(1, keywordSearchPaths.length * Math.max(1, searchPathQueryLimit))));
  for (const pathConfig of keywordSearchPaths) {
    const queries = selectQueriesForPath(allQueries, pathConfig);
    for (const queryConfig of queries) {
      const query = [queryConfig.query, pathConfig.querySuffix].filter(Boolean).join(" ");
      try {
        if (pathConfig.method === "hn") {
          const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
          url.searchParams.set("query", queryConfig.query);
          url.searchParams.set("tags", "story");
          url.searchParams.set("hitsPerPage", String(perPathResultLimit));
          const data = await fetchJson(url.toString());
          const hits = Array.isArray(data.hits) ? data.hits : [];
          for (const item of hits) {
            items.push(keywordSearchItem({
              id: item.objectID,
              title: item.title || item.story_title || "",
              url: `https://news.ycombinator.com/item?id=${item.objectID}`,
              snippet: `${item.points || 0} points / ${item.num_comments || 0} comments / linked_url=${item.url || "none"}`,
              source: "keyword search / HN community feedback",
              published_at: item.created_at || "",
            }, queryConfig, pathConfig, { search_intent: "find_user_feedback" }));
          }
          continue;
        }

        if (pathConfig.method === "gdelt") {
          const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
          url.searchParams.set("query", queryConfig.query);
          url.searchParams.set("mode", "ArtList");
          url.searchParams.set("format", "json");
          url.searchParams.set("maxrecords", String(perPathResultLimit));
          url.searchParams.set("timespan", "14d");
          url.searchParams.set("sort", "HybridRel");
          const data = await fetchGdeltJsonWithRetry(url.toString(), 3);
          const articles = Array.isArray(data.articles) ? data.articles : [];
          for (const article of articles) {
            items.push(keywordSearchItem({
              id: article.url,
              title: article.title || "",
              url: article.url,
              snippet: article.seendate || "",
              source: article.sourceCommonName || article.domain || "keyword search / GDELT",
              published_at: article.seendate || "",
            }, queryConfig, pathConfig, { search_intent: "find_market_trend" }));
          }
          continue;
        }

        if (pathConfig.method === "gdelt_then_ddg") {
          try {
            const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
            url.searchParams.set("query", queryConfig.query);
            url.searchParams.set("mode", "ArtList");
            url.searchParams.set("format", "json");
            url.searchParams.set("maxrecords", String(perPathResultLimit));
            url.searchParams.set("timespan", "14d");
            url.searchParams.set("sort", "HybridRel");
            const data = await fetchGdeltJsonWithRetry(url.toString(), 3);
            const articles = Array.isArray(data.articles) ? data.articles : [];
            for (const article of articles) {
              items.push(keywordSearchItem({
                id: article.url,
                title: article.title || "",
                url: article.url,
                snippet: article.seendate || "",
                source: article.sourceCommonName || article.domain || "keyword search / GDELT",
                published_at: article.seendate || "",
              }, queryConfig, pathConfig, { search_intent: "find_market_trend" }));
            }
          } catch {
            const fallbackQuery = [queryConfig.query, pathConfig.fallbackQuerySuffix || ""].filter(Boolean).join(" ");
            const results = await searchDuckDuckGo(fallbackQuery, perPathResultLimit);
            for (const result of results) {
              items.push(keywordSearchItem(result, queryConfig, pathConfig, { search_intent: "find_market_trend" }));
            }
          }
          continue;
        }

        const results = await searchDuckDuckGo(query, perPathResultLimit);
        for (const result of results) {
          items.push(keywordSearchItem(result, queryConfig, pathConfig));
        }
      } catch (error) {
        failures.push(`keyword-search ${pathConfig.id} ${queryConfig.query}: ${error.message}`);
      }
    }
  }
  const nonCommunity = items.filter((item) => item.search_path !== "community_feedback");
  if (!nonCommunity.length && items.length) {
    failures.push("keyword-search returned only community results; items must remain Watchlist/User Feedback until non-community sources are found");
  }

  const byPath = new Map();
  for (const item of items) {
    const key = item.search_path || "unknown";
    if (!byPath.has(key)) byPath.set(key, []);
    byPath.get(key).push(item);
  }
  const pathOrder = keywordSearchPaths.map((p) => p.id).filter((id) => byPath.has(id)).concat([...byPath.keys()].filter((k) => !keywordSearchPaths.some((p) => p.id === k)));
  const balanced = [];
  let progressed = true;
  while (balanced.length < searchTarget && progressed) {
    progressed = false;
    for (const p of pathOrder) {
      const bucket = byPath.get(p);
      if (!bucket?.length) continue;
      balanced.push(bucket.shift());
      progressed = true;
      if (balanced.length >= searchTarget) break;
    }
  }
  if (balanced.length < searchTarget) {
    for (const item of items) {
      if (balanced.length >= searchTarget) break;
      if (!balanced.includes(item)) balanced.push(item);
    }
  }

  return { items: balanced.slice(0, searchTarget), failures };
}

async function collectGDELT() {
  const allQueries = laneQueries("gdelt", ["AI agent enterprise", "agentic AI governance", "AI startup funding", "AI coding agent"]);
  const seenThemes = new Set();
  const firstPerTheme = [];
  const rest = [];
  for (const queryConfig of allQueries) {
    if (!seenThemes.has(queryConfig.query_theme)) {
      firstPerTheme.push(queryConfig);
      seenThemes.add(queryConfig.query_theme);
    } else {
      rest.push(queryConfig);
    }
  }
  const queries = [...firstPerTheme, ...rest].slice(0, gdeltQueryLimit);
  const items = [];
  const failures = [];
  for (const queryConfig of queries) {
    const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
    url.searchParams.set("query", queryConfig.query);
    url.searchParams.set("mode", "ArtList");
    url.searchParams.set("format", "json");
    url.searchParams.set("maxrecords", "20");
    url.searchParams.set("timespan", "7d");
    url.searchParams.set("sort", "HybridRel");
    try {
      const data = await fetchGdeltJsonWithRetry(url.toString(), 3);
      const articles = Array.isArray(data.articles) ? data.articles : [];
      for (const article of articles) {
        items.push({
          acquisition_channel: "gdelt",
          original_id: article.url,
          title: article.title || "",
          summary: article.seendate || "",
          url: article.url,
          source: article.sourceCommonName || article.domain || "GDELT",
          published_at: article.seendate || "",
          category: "news",
          query_theme: queryConfig.query_theme,
          keyword_group: queryConfig.keyword_group,
        });
      }
    } catch (error) {
      failures.push(`GDELT ${queryConfig.query}: ${error.message}`);
    }
  }
  return { items, failures };
}

function normalize(items) {
  const seen = new Set();
  const normalized = items
    .filter((item) => item.title || item.url)
    .map((item) => {
      const classified = classify(item);
      const themed = assignTheme({
        ...item,
        title: cleanText(item.title, item.summary || item.url),
        summary: cleanText(item.summary, ""),
        url: item.url || "",
        source_level: classified.level,
        source_type: classified.type,
        acquisition_source_level: classified.acquisition_source_level || "",
        research_status: classified.research_status || "not_research",
      });
      return {
        ...themed,
      };
    })
    .filter((item) => {
      const key = item.url || `${item.title}-${item.source}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item) => ({ ...item, score: score(item) }))
    .sort((a, b) => b.score - a.score);

  const picked = [];
  const pickedKeys = new Set();
  const target = Math.min(rawTarget, normalized.length);

  // Keep curated AIHOT daily items first so they are never starved by other channels.
  for (const item of normalized) {
    if (picked.length >= target) break;
    if (!(item.acquisition_channel === "aihot" && item.aihot_lane === "daily")) continue;
    const key = item.url || `${item.title}-${item.source}`;
    if (pickedKeys.has(key)) continue;
    picked.push(item);
    pickedKeys.add(key);
  }

  const take = (channel, count = target) => {
    for (const item of normalized.filter((entry) => entry.acquisition_channel === channel)) {
      if (picked.length >= target || count <= 0) break;
      const key = item.url || `${item.title}-${item.source}`;
      if (pickedKeys.has(key)) continue;
      picked.push(item);
      pickedKeys.add(key);
      count -= 1;
    }
  };

  take("follow-builders");
  take("keyword-search");
  take("gdelt");
  take("hn");
  take("aihot");

  for (const item of normalized) {
    if (picked.length >= target) break;
    const key = item.url || `${item.title}-${item.source}`;
    if (pickedKeys.has(key)) continue;
    picked.push(item);
    pickedKeys.add(key);
  }

  return diversifyByTheme(picked.sort((a, b) => b.score - a.score));
}

function normalizeBuilders(builderItems = []) {
  const seen = new Set();
  return (Array.isArray(builderItems) ? builderItems : [])
    .filter((item) => item && (item.title || item.url))
    .map((item) => {
      const classified = classify(item);
      const themed = assignTheme({
        ...item,
        title: cleanText(item.title, item.summary || item.url),
        summary: cleanText(item.summary, ""),
        url: item.url || "",
        source_level: classified.level,
        source_type: classified.type,
        acquisition_source_level: classified.acquisition_source_level || "",
        research_status: classified.research_status || "not_research",
      });
      return { ...themed, score: score(themed) };
    })
    .filter((item) => {
      const key = item.url || `${item.title}-${item.source}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.score - a.score);
}

function makeBuildersViewpointsFile(builderItems = []) {
  const normalized = normalizeBuilders(builderItems);
  ensure(opinionCardsDir);
  for (const file of fs.readdirSync(opinionCardsDir)) {
    if (file.startsWith(`${date}--frontier-opinion--`) && file.endsWith(".md")) {
      fs.rmSync(path.join(opinionCardsDir, file), { force: true });
    }
  }

  const lines = [
    "---",
    `date: ${date}`,
    "stage: builders-viewpoints",
    "status: v2-source-router-collected",
    `builder_items_count: ${normalized.length}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} Builders Viewpoints (All)`,
    "",
    "说明：本文件收录 follow-builders 当日全量扫描到的 Builder 观点/实践线索（discovery 级），用于后续生成观点卡候选、人物时间线和今日观察中的前沿观点材料。",
    "注意：社媒/X 观点为观点线索，不作为事实主证据；进入变化卡、案例卡或今日观察事实结论前仍需补足原始出处或 S/A/B 来源。",
    "",
  ];
  const indexLines = [
    "---",
    `date: ${date}`,
    "type: frontier_opinion_daily_index",
    "status: generated",
    `count: ${normalized.length}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} 前沿观点全量索引`,
    "",
    "本索引由 follow-builders 每日全量扫描生成。这里收录的是观点和实践线索，不是事实主证据；涉及公司动作、客户采用、收入、融资、市场规模等事实时，必须回源补证。",
    "",
  ];

  normalized.forEach((item, index) => {
    const id = `BP-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const opinionId = `OPN-FB-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const originalDate = normalizeDay(item.published_at) || "unknown";
    const title = item.title || item.url || "builder viewpoint";
    const body = String(item.summary || "").trim();
    const sourceParts = String(item.source || "follow-builders").split("/").map((part) => part.trim()).filter(Boolean);
    const personName = sourceParts[sourceParts.length - 1] || "Unknown Builder";
    const cardFile = `${date}--frontier-opinion--${slugify(`${personName}-${title}`)}.md`;
    const cardPath = path.join(opinionCardsDir, cardFile);
    const excerpt = body ? body.slice(0, 900) : "暂无可用原文摘录。";
    lines.push(
      `## ${id}｜${title}`,
      "",
      `- stable_id: \`${id}\``,
      "- source_path: `follow-builders`",
      `- source_url: \`${item.url || "no-url"}\``,
      `- source_name: ${item.source || "follow-builders"}`,
      `- original_date: ${originalDate}`,
      `- captured_at: ${new Date().toISOString()}`,
      `- theme: ${item.theme_label || themeLabel(item.theme)}`,
      "",
      body ? `原始观点/摘要：${body}` : "原始观点/摘要：本轮未抓到可用文本摘要（可能受限于采集权限或接口）。",
      ""
    );
    indexLines.push(`- ${opinionId}｜[${title}](${rel(cardPath)})｜${personName}｜${item.url || "no-url"}`);

    const card = [
      "---",
      `id: ${opinionId}`,
      "type: opinion_card",
      `title: ${JSON.stringify(title)}`,
      `date: ${date}`,
      "status: draft",
      `created_at: ${new Date().toISOString()}`,
      `updated_at: ${new Date().toISOString()}`,
      `person_name: ${JSON.stringify(personName)}`,
      "column_name: 前沿观点",
      `source_level: ${item.source_level || "C"}`,
      "source_volatility: high",
      "capture_scope: visible_text",
      "evidence_level: community_signal",
      "publish_status: internal",
      `source_url: ${JSON.stringify(item.url || "")}`,
      `source_name: ${JSON.stringify(item.source || "follow-builders")}`,
      `original_date: ${JSON.stringify(originalDate)}`,
      `theme: ${JSON.stringify(item.theme || "uncategorized")}`,
      `keyword_group: ${JSON.stringify(item.keyword_group || "unknown")}`,
      "---",
      "",
      `# ${title}`,
      "",
      "## 人物 / Title / 原文",
      "",
      `- 人物：${personName}`,
      "- Title：暂无公开信息",
      `- 原文：${item.url ? `[查看原文](${item.url})` : "暂无公开链接"}`,
      "",
      "## 原文摘录",
      "",
      excerpt,
      "",
      "## 观澜解读",
      "",
      "该条先进入前沿观点库，等待与当日 Raw、变化卡、案例卡或趋势簇建立关系。若要用于前台文章，必须保留原文出处；若涉及事实判断，必须另补 S/A/B 来源。",
      "",
      "## 关联资产",
      "",
      "- 关联变化卡：暂无公开信息",
      "- 关联案例卡：暂无公开信息",
      "- 关联今日观察：暂无公开信息",
      "",
      "## 可信边界",
      "",
      "follow-builders 是观点发现入口。X / 社区来源波动高，本卡只作为前沿观点线索，不作为公司动作、客户采用、收入、融资或市场规模的事实主证据。",
      "",
    ].join("\n");
    writeFile(cardPath, card);
  });

  writeFile(path.join(businessSignalsDir, `${date}-opinion-candidates.md`), lines.join("\n"));
  writeFile(path.join(opinionCardsDir, `${date}--frontier-opinion-index.md`), indexLines.join("\n"));
}

function makeRawFiles(items, failures, runMeta = {}) {
  resetGeneratedDir(originalDir, path.join(rawDir, "originals"));
  const poolLimit = Math.min(40, Math.max(20, Math.ceil(items.length * 0.3)));
  const poolKeySet = new Set(items.slice(0, poolLimit).map((item) => item.url || `${item.title}-${item.source}`));
  const rawLines = [
    "---",
    `date: ${date}`,
    "stage: raw",
    "status: v2-source-router-collected",
    `raw_count: ${items.length}`,
    `aihot_mode: ${runMeta.aihot_mode || aihotMode}`,
    `aihot_since: ${JSON.stringify(runMeta.aihot_since || "")}`,
    `aihot_discovered_count: ${runMeta.aihot_discovered_count ?? "unknown"}`,
    `aihot_daily_discovered_count: ${runMeta.aihot_daily_discovered_count ?? "unknown"}`,
    `aihot_all_discovered_count: ${runMeta.aihot_all_discovered_count ?? "unknown"}`,
    `aihot_daily_included_count: ${runMeta.aihot_daily_included_count ?? "unknown"}`,
    `aihot_rejected_by_raw_entry_rules: ${runMeta.aihot_rejected_count ?? "unknown"}`,
    `external_search_activated: ${runMeta.search_activated ? "true" : "false"}`,
    `aihot_count: ${items.filter((item) => item.acquisition_channel === "aihot").length}`,
    `keyword_search_count: ${items.filter((item) => item.acquisition_channel === "keyword-search").length}`,
    `follow_builders_count: ${items.filter((item) => item.acquisition_channel === "follow-builders").length}`,
    `keyword_monitoring_config: ${rel(keywordMonitoringPath)}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} Raw Candidates`,
    "",
    "说明：本文件由 `agent-workflow/tools/run-v2-daily-pipeline.mjs` 生成。默认采用三段式策略：AI HOT 最近 24 小时全量作为 Raw 主入口，先按类目、关键词、商业动作和噪音规则筛选；follow-builders 每日全量进入前沿观点库，并择优进入 Raw；当 AI HOT + follow-builders 不足 Raw 目标时，才启动外部多路搜索补齐。三者都属于 discovery / source-router，其摘要不作为事实主证据，进入重要卡片、今日观察或商业内参前必须回看原始 URL 并补足 S/A/B 来源。",
    "",
  ];

  items.forEach((item, index) => {
    const id = `R-${String(index + 1).padStart(3, "0")}`;
    const originalName = `${id.toLowerCase()}-${slugify(item.title)}.md`;
    const originalPath = path.join(originalDir, originalName);
    const jsonPath = path.join(originalDir, `${originalName.replace(/\.md$/u, "")}.json`);
    const isPooled = poolKeySet.has(item.url || `${item.title}-${item.source}`);
    const record = buildRawRecord(item, id, originalPath, jsonPath, isPooled);
    item.raw_id = id;
    item.raw_archive_path = rel(originalPath);
    item.raw_json_path = rel(jsonPath);
    item.raw_record = record;
    item.extraction_quality = record.extraction_quality;
    item.has_full_text = record.has_full_text;
    item.raw_status = record.raw_status;
    const reason = item.score >= 6
      ? "高相关商业候选，涉及 Agent、企业流程、安全治理、开发者基础设施、融资、平台或受监管场景。"
      : "中等相关候选，保留为趋势观察或 Heat Candidate，需二次搜索确认商业信号。";
    rawLines.push(
      `### ${id}｜${item.title}`,
      "",
      `- 原文档案：\`${rel(originalPath)}\``,
      `- 出处：${item.source}｜${item.url || "no-url"}`,
      `- 采集通道：${item.acquisition_channel}`,
      `- 搜索意图：${record.search_intent || "not_applicable"}`,
      `- 搜索路径：${record.search_path || "not_applicable"}`,
      `- 来源类型：${item.source_type}`,
      `- 来源等级：${item.source_level}`,
      `- 采集通道等级：${record.acquisition_source_level || "not_applicable"}`,
      `- research_status：${record.research_status}`,
      `- 主题分类：${themeLabel(item.theme)}`,
      `- 关键词组：${item.keyword_group || "unknown"}`,
      `- 发布时间：${item.published_at || "unknown"}`,
      `- 分类：${item.category || "unknown"}`,
      `- 采集理由：${reason}`,
      `- 本地快照：${record.fetch_status}｜quality=${record.extraction_quality}｜has_full_text=${record.has_full_text}｜hash=${record.content_hash}`,
      `- 原文抓取优先级：${item.raw_capture_priority ?? "not-ranked"}`,
      `- Raw 状态：${record.raw_status}`,
      `- Pool 分流：${record.pool_routes.join(", ")}`,
      `- 可用方向：${Object.entries(record.usable_for).filter(([, value]) => value).map(([key]) => key).join(", ") || "index_only"}`,
      `- 缺失信息：${record.missing_information.join("；") || "none"}`,
      ""
    );

    const original = [
      "---",
      "schema_version: raw-evidence-v2",
      `raw_id: ${id}`,
      `title: ${JSON.stringify(record.title)}`,
      `original_url: ${JSON.stringify(record.original_url)}`,
      `canonical_url: ${JSON.stringify(record.canonical_url)}`,
      `source_name: ${JSON.stringify(record.source_name)}`,
      `source_type: ${record.source_type}`,
      `source_level: ${record.source_level}`,
      `acquisition_source_level: ${JSON.stringify(record.acquisition_source_level)}`,
      `acquisition_channel: ${record.acquisition_channel}`,
      `research_status: ${record.research_status}`,
      `search_intent: ${JSON.stringify(record.search_intent)}`,
      `search_path: ${JSON.stringify(record.search_path)}`,
      `search_path_label: ${JSON.stringify(record.search_path_label)}`,
      `author: ${JSON.stringify(record.author)}`,
      `published_at: ${JSON.stringify(record.published_at)}`,
      `collected_at: ${record.collected_at}`,
      `language: ${record.language}`,
      `full_text_hash: ${record.full_text_hash}`,
      `markdown_snapshot_path: ${JSON.stringify(record.markdown_snapshot_path)}`,
      `json_snapshot_path: ${JSON.stringify(record.json_snapshot_path)}`,
      `html_snapshot_path: ${JSON.stringify(record.html_snapshot_path)}`,
      `screenshot_path: ${JSON.stringify(record.screenshot_path)}`,
      `fetch_status: ${record.fetch_status}`,
      `extraction_quality: ${record.extraction_quality}`,
      `has_full_text: ${record.has_full_text}`,
      `content_length: ${record.content_length}`,
      `fetch_error: ${JSON.stringify(record.fetch_error)}`,
      `source_volatility: ${record.source_volatility}`,
      `community_name: ${JSON.stringify(record.community_name)}`,
      `capture_scope: ${record.capture_scope}`,
      `visible_range: ${JSON.stringify(record.visible_range)}`,
      `evidence_level: ${record.evidence_level}`,
      `discovery_source: ${JSON.stringify(record.discovery_source)}`,
      `discovery_record: ${JSON.stringify(record.discovery_record)}`,
      `source_role: ${record.source_role}`,
      `origin_fetch_status: ${JSON.stringify(record.origin_fetch_status)}`,
      `paywall_status: ${record.paywall_status}`,
      `block_status: ${record.block_status}`,
      `duplicate_status: ${record.duplicate_status}`,
      `url_hash: ${record.url_hash}`,
      `content_hash: ${record.content_hash}`,
      `semantic_hash: ${record.semantic_hash}`,
      `duplicate_of: ${JSON.stringify(record.duplicate_of)}`,
      `first_seen_at: ${JSON.stringify(record.first_seen_at)}`,
      `last_seen_at: ${record.last_seen_at}`,
      `update_detected: ${record.update_detected}`,
      `raw_status: ${record.raw_status}`,
      `usable_for: ${JSON.stringify(record.usable_for)}`,
      `pool_routes: ${JSON.stringify(record.pool_routes)}`,
      `guanlan_scores: ${JSON.stringify(record.guanlan_scores)}`,
      `business_elements: ${JSON.stringify(record.business_elements)}`,
      `evidence_seed: ${JSON.stringify(record.evidence_seed)}`,
      `missing_information: ${JSON.stringify(record.missing_information)}`,
      `key_excerpts: ${JSON.stringify(record.key_excerpts)}`,
      `theme: ${item.theme || "uncategorized"}`,
      `keyword_group: ${item.keyword_group || "unknown"}`,
      "copyright_note: local research archive only",
      "---",
      "",
      `# ${item.title}`,
      "",
      "## clean_text",
      "",
      record.clean_text,
      "",
      "## full_text",
      "",
      record.full_text,
      "",
      "## markdown_snapshot",
      "",
      "本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。",
      "",
      "## key_excerpts",
      "",
      record.key_excerpts.map((excerpt, excerptIndex) => `${excerptIndex + 1}. **${excerpt.type}**｜supports=${excerpt.supports.join(", ")}｜importance=${excerpt.importance}｜confidence=${excerpt.confidence}\n   ${excerpt.text}`).join("\n\n") || "暂无可用摘录。",
      "",
      "## business_elements",
      "",
      `- companies: ${record.business_elements.companies.join(", ") || "暂无公开信息"}`,
      `- products: ${record.business_elements.products.join(", ") || "暂无公开信息"}`,
      `- people: ${record.business_elements.people.join(", ") || "暂无公开信息"}`,
      `- industries: ${record.business_elements.industries.join(", ") || "暂无公开信息"}`,
      `- roles: ${record.business_elements.roles.join(", ") || "暂无公开信息"}`,
      `- workflows: ${record.business_elements.workflows.join(", ") || "暂无公开信息"}`,
      `- business_actions: ${record.business_elements.business_actions.join(", ") || "暂无公开信息"}`,
      `- affected_departments: ${record.business_elements.affected_departments.join(", ") || "暂无公开信息"}`,
      `- numbers: ${record.business_elements.numbers.join(", ") || "暂无公开信息"}`,
      `- quotes: ${record.business_elements.quotes.join(" / ") || "暂无公开信息"}`,
      "",
      "## evidence_seed",
      "",
      `- company_actions: ${record.evidence_seed.company_actions.join(" / ") || "暂无公开信息"}`,
      `- case_details: ${record.evidence_seed.case_details.join(" / ") || "暂无公开信息"}`,
      `- workflow_changes: ${record.evidence_seed.workflow_changes.join(" / ") || "暂无公开信息"}`,
      `- before_after_clues: ${record.evidence_seed.before_after_clues.join(" / ") || "暂无公开信息"}`,
      `- affected_roles: ${record.evidence_seed.affected_roles.join(", ") || "暂无公开信息"}`,
      `- risks_or_constraints: ${record.evidence_seed.risks_or_constraints.join(" / ") || "暂无公开信息"}`,
      "",
      "## guanlan_scores",
      "",
      Object.entries(record.guanlan_scores).map(([key, value]) => `- ${key}: ${value}`).join("\n"),
      "",
      "## usable_for",
      "",
      Object.entries(record.usable_for).map(([key, value]) => `- ${key}: ${value}`).join("\n"),
      "",
      "## pool_routes",
      "",
      record.pool_routes.map((value) => `- ${value}`).join("\n"),
      "",
      "## missing_information",
      "",
      record.missing_information.map((value) => `- ${value}`).join("\n") || "- none",
      "",
      "## volatile_and_discovery_handling",
      "",
      `- source_volatility: ${record.source_volatility}`,
      `- community_name: ${record.community_name || "not_applicable"}`,
      `- capture_scope: ${record.capture_scope}`,
      `- visible_range: ${record.visible_range || "暂无公开信息"}`,
      `- evidence_level: ${record.evidence_level}`,
      `- discovery_source: ${record.discovery_source || "none"}`,
      `- source_role: ${record.source_role}`,
      `- origin_fetch_status: ${record.origin_fetch_status || "not_applicable"}`,
      record.discovery_record ? `- discovery_record: ${JSON.stringify(record.discovery_record)}` : "- discovery_record: none",
      "",
      "## 原始摘要 / 采集文本",
      "",
      item.summary || "采集通道未提供摘要。",
      "",
      "## 采集备注",
      "",
      `该条目由 ${item.acquisition_channel} 发现，事实来源等级初判为 ${item.source_level}。S/A/B/C/D 只判断事实可靠度，不判断商业价值；M 只表示 acquisition_source_level，即 AI HOT / 搜索聚合等采集通道。M 级通道必须回源；HN / Reddit / X 等 C 级社区材料可用于讨论升温、用户反馈和早期观察，但进入事实主证据前必须寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。创始人 / 高管 / 项目方原帖可作为 S 级一手来源，但高波动平台必须保存快照和抓取时间。`,
      "",
    ].join("\n");
    writeFile(originalPath, original);
    writeFile(jsonPath, `${JSON.stringify(record, null, 2)}\n`);
  });

  writeFile(path.join(rawDir, `${date}-raw-candidates.md`), rawLines.join("\n"));

  const poolItems = items.slice(0, poolLimit);
  const poolLines = [
    "---",
    `date: ${date}`,
    "stage: pool",
    "status: source-router-pool",
    `pool_count: ${poolItems.length}`,
    `generated_at: ${new Date().toISOString()}`,
    `keyword_monitoring_config: ${rel(keywordMonitoringPath)}`,
    "---",
    "",
    `# ${date} Pool Candidates`,
    "",
    "说明：本文件是 Raw 后的候选池，供 asset-card-generator 生成 L1 变化卡、L1 案例卡、观点卡候选，并供 daily-observation-writer 理解当日市场行情。Pool 仍不是事实结论。",
    "",
  ];
  poolItems.forEach((item, index) => {
    const id = `P-${String(index + 1).padStart(3, "0")}`;
    const keepReason = item.score >= 6
      ? "解释价值较高，可能形成变化卡或案例卡候选。"
      : "具备市场线索或主题热度，需进一步补证后再判断是否入库。";
    const rejectRisk = item.source_level === "C"
      ? "当前主要来自社区/聚合/线索来源，不能直接作为事实主证据。"
      : "仍需打开原始 URL，确认是否存在客户、产品、融资、技术路线或数据来源。";
    poolLines.push(
      `## ${id}｜${item.title}`,
      "",
      `- raw_ref: ${item.raw_id || item.original_id || item.url || "unknown"}`,
      `- raw_original_id: ${item.original_id || "unknown"}`,
      `- raw_archive: \`${item.raw_archive_path || "missing"}\``,
      `- raw_json: \`${item.raw_json_path || "missing"}\``,
      `- source: ${item.source}｜${item.url || "no-url"}`,
      `- source_url: ${item.url || "no-url"}`,
      `- acquisition_channel: ${item.acquisition_channel}`,
      `- search_intent: ${item.raw_record?.search_intent || "not_applicable"}`,
      `- search_path: ${item.raw_record?.search_path || "not_applicable"}`,
      `- source_type: ${item.source_type}`,
      `- source_level: ${item.source_level}`,
      `- acquisition_source_level: ${item.raw_record?.acquisition_source_level || "not_applicable"}`,
      `- research_status: ${item.raw_record?.research_status || "not_research"}`,
      `- local_snapshot_status: ${item.raw_record?.fetch_status || item.snapshot?.status || "not-attempted"}`,
      `- extraction_quality: ${item.raw_record?.extraction_quality || "unknown"}`,
      `- has_full_text: ${item.raw_record?.has_full_text || false}`,
      `- source_volatility: ${item.raw_record?.source_volatility || "unknown"}`,
      `- community_name: ${item.raw_record?.community_name || "not_applicable"}`,
      `- capture_scope: ${item.raw_record?.capture_scope || "unknown"}`,
      `- evidence_level: ${item.raw_record?.evidence_level || "unknown"}`,
      `- source_role: ${item.raw_record?.source_role || "unknown"}`,
      `- origin_fetch_status: ${item.raw_record?.origin_fetch_status || "not_applicable"}`,
      `- raw_status: ${item.raw_record?.raw_status || "indexed"}`,
      `- pool_routes: ${(item.raw_record?.pool_routes || []).join(", ") || "index_only"}`,
      `- raw_content_hash: ${item.raw_record?.content_hash || item.snapshot?.hash || "none"}`,
      `- raw_full_text_hash: ${item.raw_record?.full_text_hash || item.snapshot?.full_text_hash || "none"}`,
      `- raw_semantic_hash: ${item.raw_record?.semantic_hash || "none"}`,
      `- theme: ${themeLabel(item.theme)}`,
      `- keyword_group: ${item.keyword_group || "unknown"}`,
      `- score: ${item.score}`,
      `- raw_capture_priority: ${item.raw_capture_priority ?? "not-ranked"}`,
      `- usable_for: ${Object.entries(item.raw_record?.usable_for || {}).filter(([, value]) => value).map(([key]) => key).join(", ") || "index_only"}`,
      `- key_excerpts: ${JSON.stringify(item.raw_record?.key_excerpts || [])}`,
      `- evidence_seed: ${JSON.stringify(item.raw_record?.evidence_seed || {})}`,
      `- missing_information: ${(item.raw_record?.missing_information || []).join("；") || "none"}`,
      `- 入池理由：${keepReason}`,
      `- 淘汰风险：${rejectRisk}`,
      ""
    );
  });
  writeFile(path.join(poolDir, `${date}-pool-candidates.md`), poolLines.join("\n"));

  const heatItems = items.filter((item) => item.score >= 4 && item.source_level !== "S").slice(0, 12);
  const heatLines = [
    "---",
    `date: ${date}`,
    "stage: heat-candidates",
    "status: source-router-generated",
    "---",
    "",
    `# ${date} Change Cluster Candidates`,
    "",
    "说明：本文件是 source-router 生成的变化簇 / 升温候选，不是正式趋势结论。后续应由 asset-card-generator 写入 knowledge/05-Change-Clusters/ 或更新相关变化卡。",
    "",
  ];
  heatItems.forEach((item, index) => {
    heatLines.push(
      `## CLU-CAND-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}｜${item.title}`,
      "",
      `- formal_tags: ${formalTagsForItem(item).map((tag) => `\`${tag}\``).join(", ")}`,
      `- classification_labels: ${item.category || "unknown"} / ${item.source_type} / ${item.acquisition_channel}`,
      `- candidate_tags: ${item.category || "ai"}, ${item.source_type}, ${item.acquisition_channel}`,
      "- status: watch",
      `- source_refs: ${item.url || item.original_id || "unknown"}`,
      "- seen_count_7d: 1",
      "- source_type_count: 1",
      "",
      `观察理由：该条目热度或相关性较高，但当前仍需 S/A/B 来源补证，暂不升级为正式变化卡或趋势卡。`,
      ""
    );
  });
  writeFile(path.join(businessSignalsDir, `${date}-change-cluster-candidates.md`), heatLines.join("\n"));

  const distribution = countBy(items, "acquisition_channel");
  const byType = countBy(items, "source_type");
  const byLevel = countBy(items, "source_level");
  const byTheme = countBy(items, "theme");
  const byKeywordGroup = countBy(items, "keyword_group");
  const bySearchPath = countBy(items.filter((item) => item.acquisition_channel === "keyword-search"), "search_path");
  const bySearchIntent = countBy(items.filter((item) => item.acquisition_channel === "keyword-search"), "search_intent");
  const keywordNonCommunity = items.filter((item) => item.acquisition_channel === "keyword-search" && item.search_path && item.search_path !== "community_feedback").length;
  const bySnapshotStatus = items.reduce((acc, item) => {
    const key = item.snapshot?.status || "not-attempted";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const log = [
    `# ${date} V2 Daily Source Router Log`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- raw_count: ${items.length}`,
    `- aihot_mode: ${runMeta.aihot_mode || aihotMode}`,
    `- aihot_since: ${runMeta.aihot_since || ""}`,
    `- aihot_discovered_count: ${runMeta.aihot_discovered_count ?? "unknown"}`,
    `- aihot_daily_discovered_count: ${runMeta.aihot_daily_discovered_count ?? "unknown"}`,
    `- aihot_all_discovered_count: ${runMeta.aihot_all_discovered_count ?? "unknown"}`,
    `- aihot_daily_included_count: ${runMeta.aihot_daily_included_count ?? "unknown"}`,
    `- aihot_rejected_by_raw_entry_rules: ${runMeta.aihot_rejected_count ?? "unknown"}`,
    `- external_search_activated: ${runMeta.search_activated ? "true" : "false"}`,
    `- aihot_count: ${items.filter((item) => item.acquisition_channel === "aihot").length}`,
    `- keyword_search_count: ${items.filter((item) => item.acquisition_channel === "keyword-search").length}`,
    `- keyword_search_non_community_count: ${keywordNonCommunity}`,
    `- keyword_search_path_distribution: ${distributionText(bySearchPath)}`,
    `- keyword_search_intent_distribution: ${distributionText(bySearchIntent)}`,
    `- follow_builders_count: ${items.filter((item) => item.acquisition_channel === "follow-builders").length}`,
    `- source_distribution: ${distributionText(distribution)}`,
    `- raw_count_by_channel: ${distributionText(distribution)}`,
    `- keyword_monitoring_config: ${rel(keywordMonitoringPath)}`,
    `- keyword_group_distribution: ${distributionText(byKeywordGroup)}`,
    `- theme_distribution: ${distributionText(byTheme)}`,
    `- theme_concentration_warning: ${themeConcentrationWarning(items)}`,
    `- signal_coverage_gaps: ${Array.isArray(runMeta.signal_coverage_gaps) && runMeta.signal_coverage_gaps.length ? runMeta.signal_coverage_gaps.map((gap) => `${gap.signalClass}=${gap.count}/${gap.min}`).join("; ") : "none"}`,
    `- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.`,
    `- pool_theme_gate: diversify Pool; default max ${keywordMonitoring.policy?.structured_max_same_theme || 4} candidate items per theme unless theme_day=true.`,
    `- failed_sources: ${failures.length ? failures.join("; ") : "none"}`,
    "- fallback_used: Default source-router uses AI HOT full 24h + follow-builders + keyword rules first. External multi-path keyword search, standalone HN and GDELT activate when the default lanes do not meet the Raw target, a required signal class is thin, or important cards need S/A/B补证. Later Agent pass must use official / S/A/B sources for fact evidence.",
    "- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.",
    `- raw_count_by_source_type: ${distributionText(byType)}`,
    `- raw_snapshot_status_distribution: ${distributionText(bySnapshotStatus)}`,
    "- frontstage_sab_source_count: pending; to be filled after important-card secondary source backfill.",
    "- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before frontstage use.",
    "",
    "## Source Level Distribution",
    "",
    Object.entries(byLevel).map(([key, value]) => `- ${key}: ${value}`).join("\n"),
    "",
    "## Theme Distribution",
    "",
    Object.entries(byTheme).map(([key, value]) => `- ${themeLabel(key)} (${key}): ${value}`).join("\n"),
    "",
    "## Keyword Group Distribution",
    "",
    Object.entries(byKeywordGroup).map(([key, value]) => `- ${key}: ${value}`).join("\n"),
    "",
    "## Keyword Search Path Distribution",
    "",
    Object.entries(bySearchPath).map(([key, value]) => `- ${key || "not_applicable"}: ${value}`).join("\n") || "- none",
    "",
    "## Keyword Search Intent Distribution",
    "",
    Object.entries(bySearchIntent).map(([key, value]) => `- ${key || "not_applicable"}: ${value}`).join("\n") || "- none",
    "",
    "## Three-Lane Source-Router Policy",
    "",
    "Default strategy: AI HOT full 24h is the primary Raw discovery entrance; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill categories, tracks and evidence terms. If those lanes do not reach the Raw target, a required signal class is thin, or important cards need補证, activate external multi-path search. Important cards must then resolve original S/A/B evidence before publication.",
    "",
  ].join("\n");
  writeFile(path.join(reportsDir, `${date}-v2-daily-source-router-log.md`), log);
}

async function main() {
  const [aihot, builders] = await Promise.all([
    collectAIHot(),
    collectFollowBuilders(),
  ]);
  const builderItemsAll = Array.isArray(builders.items) ? builders.items : [];
  const builderItemsForRaw = builderItemsAll.slice(0, buildersTarget);
  const primaryItems = [...aihot.items, ...builderItemsForRaw];
  let keywordSearch = { items: [], failures: [] };
  let hn = { items: [], failures: [] };
  let gdelt = { items: [], failures: [] };
  let searchActivated = false;
  let normalizedItems = normalize(primaryItems);
  let coverageGaps = signalCoverageGaps(normalizedItems);
  if (normalizedItems.length < rawTarget || coverageGaps.length) {
    searchActivated = true;
    [keywordSearch, hn, gdelt] = await Promise.all([
      collectKeywordSearch(),
      collectHN(),
      collectGDELT(),
    ]);
    normalizedItems = normalize([...primaryItems, ...keywordSearch.items, ...hn.items, ...gdelt.items]);
    coverageGaps = signalCoverageGaps(normalizedItems);
  }
  const failures = [...aihot.failures, ...builders.failures, ...keywordSearch.failures, ...hn.failures, ...gdelt.failures];
  const items = dryRun ? normalizedItems : prioritizeAfterFetch(await enrichSnapshots(normalizedItems));

  if (!dryRun) {
    makeRawFiles(items, failures, {
      aihot_mode: aihot.mode,
      aihot_since: aihot.since,
      aihot_discovered_count: aihot.discovered_count,
      aihot_daily_discovered_count: aihot.discovered_count_daily,
      aihot_all_discovered_count: aihot.discovered_count_all,
      aihot_daily_included_count: aihot.included_count_daily,
      aihot_rejected_count: aihot.rejected_count,
      search_activated: searchActivated,
      signal_coverage_gaps: coverageGaps,
    });
    makeBuildersViewpointsFile(builderItemsAll);
  }

  console.log(
    JSON.stringify(
      {
        date,
        status: items.length >= 50 ? "collected" : "severe-fallback",
        raw_count: items.length,
        aihot_mode: aihot.mode,
        aihot_since: aihot.since,
        aihot_discovered_count: aihot.discovered_count,
        aihot_daily_discovered_count: aihot.discovered_count_daily,
        aihot_all_discovered_count: aihot.discovered_count_all,
        aihot_daily_included_count: aihot.included_count_daily,
        aihot_rejected_by_raw_entry_rules: aihot.rejected_count,
        external_search_activated: searchActivated,
        signal_coverage_gaps: coverageGaps,
        aihot_count: items.filter((item) => item.acquisition_channel === "aihot").length,
        follow_builders_count: items.filter((item) => item.acquisition_channel === "follow-builders").length,
        keyword_search_count: items.filter((item) => item.acquisition_channel === "keyword-search").length,
        keyword_search_path_distribution: countBy(items.filter((item) => item.acquisition_channel === "keyword-search"), "search_path"),
        keyword_search_intent_distribution: countBy(items.filter((item) => item.acquisition_channel === "keyword-search"), "search_intent"),
        keyword_search_non_community_count: items.filter((item) => item.acquisition_channel === "keyword-search" && item.search_path && item.search_path !== "community_feedback").length,
        keyword_group_distribution: countBy(items, "keyword_group"),
        theme_distribution: countBy(items, "theme"),
        theme_concentration_warning: themeConcentrationWarning(items),
        failures,
          outputs: dryRun
            ? []
            : [
                rel(path.join(rawDir, `${date}-raw-candidates.md`)),
                rel(originalDir),
                rel(path.join(poolDir, `${date}-pool-candidates.md`)),
                rel(path.join(businessSignalsDir, `${date}-change-cluster-candidates.md`)),
                rel(path.join(businessSignalsDir, `${date}-opinion-candidates.md`)),
                rel(path.join(reportsDir, `${date}-v2-daily-source-router-log.md`)),
              ],
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
