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

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/u);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

if (args.has("help") || args.has("h")) {
  console.log(
    [
      "WaveSight AI V3.3.6.3 guanlan-daily-monitor",
      "",
      "Usage:",
      "  node agent-workflow/tools/run-guanlan-daily-monitor.mjs --date=YYYY-MM-DD",
      "",
      "Optional:",
      "  --fetch-timeout-ms=20000",
      "  --snapshot-timeout-ms=16000",
      "  --raw-target=150",
      "  --raw-min=150",
      "  --raw-max=220",
      "  --historical-dedupe=true",
      "  --raw-dedupe-buffer=40",
      "  --aihot-limit=500",
      "  --aihot-mode=all",
      "  --aihot-window-hours=24",
      "  --search-limit=150",
      "  --search-path-query-limit=5",
      "  --hn-limit=8",
      "  --gdelt-query-limit=8",
      "  --rss-source-limit=0",
      "  --disable-tavily=true",
      "  --source-only=aihot|keyword|gdelt|rss",
      "  --use-source-artifacts=true",
      "  --source-artifact-dir=agent-workflow/reports/source-runs/YYYY-MM-DD",
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
const searchTarget = Number(args.get("search-limit") || 150);
const searchPathQueryLimit = Number(args.get("search-path-query-limit") || 5);
const hnTarget = Number(args.get("hn-limit") || 8);
const rawTargetOverride = args.has("raw-target") ? Number(args.get("raw-target")) : null;
const rawMinTarget = Number(args.get("raw-min") || 150);
const rawMaxTarget = Number(args.get("raw-max") || 220);
const historicalDedupeEnabled = args.get("historical-dedupe") !== "false";
const rawDedupeBuffer = Number(args.get("raw-dedupe-buffer") || 40);
const dryRun = args.get("dry-run") === "true";
const sourceOnlyMode = String(args.get("source-only") || "").trim().toLowerCase();
const useSourceArtifacts = args.get("use-source-artifacts") === "true" || args.has("source-artifact-dir");
const fetchTimeoutMs = Number(args.get("fetch-timeout-ms") || 20000);
const snapshotTimeoutMs = Number(args.get("snapshot-timeout-ms") || 16000);
const contentRoot = path.join(root, "01-SiteV2", "content");
const reportsDir = path.join(root, "agent-workflow", "reports");
const sourceArtifactDir = path.resolve(root, args.get("source-artifact-dir") || path.join(reportsDir, "source-runs", date));
const rawDir = path.join(contentRoot, "01-raw");
const originalDir = path.join(rawDir, "originals", date);
const poolDir = path.join(contentRoot, "02-pool");
const businessSignalsDir = path.join(contentRoot, "04-business-signals");
const keywordMonitoringPath = path.join(contentRoot, "11-databases", "keyword-monitoring-v2.json");
const sourceRegistryPath = path.join(contentRoot, "11-databases", "source-registry-v2.json");
const monitorQualityGatePath = path.join(contentRoot, "11-databases", "monitor-quality-gate-v2.json");

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");
const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });
const writeFile = (file, text) => {
  ensure(path.dirname(file));
  assertGeneratedIndexTextClean(file, text);
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
const sourceRegistry = readJson(sourceRegistryPath, { sources: [] });
const monitorQualityGate = readJson(monitorQualityGatePath, { hard_gates: {}, layered_search_requirements: {} });
const monitorHardGates = monitorQualityGate.hard_gates || {};
const layeredSearchRequirements = monitorQualityGate.layered_search_requirements || {};
const themeGroups = Array.isArray(keywordMonitoring.theme_groups) ? keywordMonitoring.theme_groups : [];
const themeOrder = themeGroups.map((group) => group.id);
const themeById = new Map(themeGroups.map((group) => [group.id, group]));
const gdeltQueryLimit = Number(args.get("gdelt-query-limit") || Math.max(4, themeGroups.length || 7));
const rssSourceLimit = Number(args.get("rss-source-limit") || 0);
const rawEntryPolicy = keywordMonitoring.raw_entry_policy || {};
const anysearchApiKey = process.env.ANYSEARCH_API_KEY || "";
const tavilyDisabledByConfig = args.get("disable-tavily") === "true" || process.env.TAVILY_DISABLED === "true";
const tavilyApiKey = tavilyDisabledByConfig ? "" : process.env.TAVILY_API_KEY || "";
const exaApiKey = process.env.EXA_API_KEY || "";

function numericConfig(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

const poolMinTarget = numericConfig(monitorHardGates.pool_count_min, 75);
const routedPoolMinTarget = numericConfig(monitorHardGates.routed_pool_count_min, 60);
const corePoolMinTarget = numericConfig(monitorHardGates.core_pool_min, 30);
const coreNonLargeVendorMinTarget = numericConfig(monitorHardGates.core_non_large_vendor_min, 20);
const coreLargeVendorMaxTarget = numericConfig(monitorHardGates.core_large_vendor_max, 10);
const corePoolMaxPerImportanceType = numericConfig(layeredSearchRequirements.core_pool_max_per_importance_type, 8);
const poolSelectionBufferTarget = numericConfig(layeredSearchRequirements.pool_selection_buffer, 20);

let historicalRawIndexCache = null;
let historicalDedupePreFetchRemoved = 0;
let historicalDedupePostFetchRemoved = 0;
let historicalDedupeRecordsChecked = 0;
const providerFallbackNotes = [];
let anysearchDisabledForRun = false;
let tavilyDisabledForRun = tavilyDisabledByConfig;
const aTierMediaFallbackQuerySuffix = "(site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:theinformation.com OR site:axios.com OR site:techcrunch.com)";
const registrySources = Array.isArray(sourceRegistry.sources) ? sourceRegistry.sources : [];
const registryHostRules = registrySources
  .filter((source) => source && source.enabled_default !== false)
  .map((source) => {
    let host = "";
    try {
      host = new URL(source.endpoint_or_url || "").hostname.toLowerCase();
    } catch {
      host = "";
    }
    return { ...source, host };
  })
  .filter((source) => source.host || source.name);
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
    keyword_group: "fallback-seed",
  }));
}

function themeLabel(themeId) {
  return themeById.get(themeId)?.label || themeId || "未分类";
}

const themeTagHints = {
  "mature-commercial-signal": ["stage-mature", "evidence-customer-adoption", "track-enterprise-workflow"],
  "early-direction-signal": ["stage-rising", "evidence-funding"],
  "technical-iteration-signal": ["track-ai-infra", "track-ai-governance", "stage-watch"],
  "developer-ecosystem-signal": ["track-ai-coding", "track-ai-infra", "stage-watch"],
  "outside-core-exploration": ["stage-watch"],
  "enterprise-agent-governance": ["track-ai-agent", "track-ai-governance", "track-enterprise-workflow"],
  "model-capability-cost": ["track-ai-infra", "stage-watch"],
  "infra-devtools-open-source": ["track-ai-coding", "track-ai-infra"],
  "vertical-customer-adoption": ["customer-enterprise", "evidence-customer-adoption"],
  "funding-vc-market": ["evidence-funding", "stage-rising"],
  "risk-regulation-counterevidence": ["stage-risk", "evidence-regulation"],
  "china-local-market": ["region-china", "stage-watch"],
};

function sourceTagForItem(item) {
  if (["funding", "marketplace", "industry", "web"].includes(item.source_type)) return "source-industry-data";
  if (["official", "registry"].includes(item.source_type)) return "source-first-party";
  if (["media", "research"].includes(item.source_type)) return "source-business-media";
  if (["blog", "podcast"].includes(item.source_type)) return `source-${item.source_type}`;
  return "source-social";
}

function tagHintsForItem(item) {
  const tags = [
    ...(themeTagHints[item.theme] || ["track-ai-agent"]),
    "stage-watch",
    sourceTagForItem(item),
  ];
  return [...new Set(tags)];
}

function tagArray(items = []) {
  return `[${items.map((item) => JSON.stringify(item)).join(", ")}]`;
}

function opinionFormalTagsForItem(item = {}) {
  const text = [
    item.title,
    item.summary,
    item.source,
    item.url,
    item.theme,
    item.keyword_group,
  ].filter(Boolean).join(" ").toLowerCase();
  const track = [];
  const opinion = [];

  const add = (group, tag) => {
    if (group === "track" && !track.includes(tag)) track.push(tag);
    if (group === "opinion" && !opinion.includes(tag)) opinion.push(tag);
  };

  if (/codex|cursor|coding|code|software|developer|sdk|git|github|local[-\s]?first|stitch/iu.test(text)) {
    add("track", "track-ai-coding");
    add("opinion", "opinion-ai-coding");
  }
  if (/agent|assistant|workflow|gbrain|multiplayer|automation|work together|team/iu.test(text)) {
    add("track", "track-ai-agent");
    add("opinion", "opinion-agent-workflow");
  }
  if (/model|reliability|post[-\s]?training|inference|gemini|openai|labs|ai progress|context window|cost/iu.test(text)) {
    add("track", "track-ai-infra");
    add("opinion", "opinion-model-infra");
  }
  if (/governance|safety|security|flock|permission|policy|risk|attack|mosque|cost governance/iu.test(text)) {
    add("track", "track-ai-governance");
    add("opinion", "opinion-ai-safety-governance");
  }
  if (/startup|founder|hiring|product|launch|growth|customer|market|vc|venture|experiment|design|labs/iu.test(text)) {
    add("opinion", "opinion-product-strategy");
  }

  if (!track.length) track.push("track-ai-agent");
  if (!opinion.length) opinion.push("opinion-product-strategy");

  const source = /podcast|youtube|spotify|apple podcasts/iu.test(text)
    ? ["source-podcast"]
    : /blog/iu.test(text)
      ? ["source-blog"]
      : ["source-social"];

  return {
    track,
    function: [],
    scenario: [],
    customer: [],
    evidence: [],
    stage: [],
    region: [],
    source,
    opinion,
  };
}

function opinionFormalTagsBlock(item = {}) {
  const formalTags = opinionFormalTagsForItem(item);
  return [
    "formal_tags:",
    `  track: ${tagArray(formalTags.track)}`,
    `  function: ${tagArray(formalTags.function)}`,
    `  scenario: ${tagArray(formalTags.scenario)}`,
    `  customer: ${tagArray(formalTags.customer)}`,
    `  evidence: ${tagArray(formalTags.evidence)}`,
    `  stage: ${tagArray(formalTags.stage)}`,
    `  region: ${tagArray(formalTags.region)}`,
    `  source: ${tagArray(formalTags.source)}`,
    `  opinion: ${tagArray(formalTags.opinion)}`,
  ];
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

function isAIRelevantTitleForMonitor(item = {}) {
  const text = [item.title, item.titleZh, item.title_en, item.url, item.source, item.sourceName, item.category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /\bai\b|人工智能|大模型|llm|agent|智能体|mcp|copilot|codex|gpt|chatgpt|openai|anthropic|claude|gemini|deepmind|hugging\s?face|模型|推理|inference|多模态|developer|开发者|sdk|api|开源|open\s?source|github|gitlab|npm|pypi|hf\s|huggingface|deepseek/iu.test(
    text
  );
}

function isDisallowedDiscoveryIndexPage(item = {}) {
  const title = String(item.title || "").toLowerCase();
  const url = String(item.url || "").toLowerCase();
  // Block AI-tool navigation / daily digest index pages that look like directories/collections,
  // even if they contain generic "funding/product release" words in the title.
  if (url.includes("ai-bot.cn/daily-ai-news")) return true;
  // Block generic official AI hub landing pages (home-like) that rarely contain a discrete change action.
  // Keep official *news/announcements* pages elsewhere (they should have explicit change actions and non-home URLs).
  if (url === "https://ai.aliyun.com/" || url === "https://ai.aliyun.com") return true;
  if (/\b(ai[-\s]?tools?|ai\s*tool)\b/iu.test(title) && /(directory|list|collection|navigation|catalog|合集|工具集|导航|目录)/iu.test(title)) return true;
  if (/(工具集|工具导航|工具目录|工具大全|资源合集|导航站)/iu.test(item.title || "")) return true;
  if (/(每日|今日).{0,6}(ai|人工智能).{0,6}(资讯|热点|动态).{0,10}(工具集|工具导航|工具目录|工具大全)/iu.test(item.title || "")) return true;
  return false;
}

function shouldIncludeInRawCandidates(item = {}) {
  if (!item || (!item.title && !item.url)) return false;
  if (isDisallowedDiscoveryIndexPage(item)) return false;
  const matchedAll = matchRawEntryRules(item);
  const matchedNonBroad = matchedAll.filter((rule) => rule.type !== "broad");
  if (isObviousRawNoise(item) && !matchedAll.length && !hasCommercialActionSignal(item)) return false;

  // AIHOT already has its own strict raw-entry decision.
  if (item.acquisition_channel === "aihot") return true;

  const aiContext = hasAIContextSignal(item);
  const actionSignal = hasCommercialActionSignal(item);

  // Default rule: require AI anchor context OR rule matches; allow action signals only when AI context exists.
  // NOTE: "broad terms" (YC/seed/etc) are only weak admission hints; do not admit without AI context.
  if (matchedNonBroad.length) return true;
  if (aiContext) return true;
  if (actionSignal && aiContext) return true;

  // Keyword-lane context can rescue broad funding / developer matches whose title omits the AI anchor.
  const routed = String(item.keyword_group || item.query_theme || "").trim();
  if (item.acquisition_channel === "keyword-search" && routed && matchedAll.length) return true;

  // Last resort: allow items that pass the monitor's AI-relevance title check.
  return isAIRelevantTitleForMonitor(item);
}

function normalizeDeveloperKeywordGroup(item = {}) {
  const url = String(item.url || "").toLowerCase();
  if (!/github\.com|gitlab\.com|npmjs\.com|pypi\.org|huggingface\.co/iu.test(url)) return item;
  if (item.keyword_group === "developer-ecosystem-signal") return item;
  // Repo / package / model hub URLs are treated as developer-ecosystem collection lanes.
  return { ...item, keyword_group: "developer-ecosystem-signal" };
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
  return /壁纸|头像|表情包|教程合集|prompt模板|提示词合集|转发抽奖|招聘简历|课程优惠|漫画|韩漫|日漫|国漫|词典|翻译|例句|读音|affiliate|wallpaper|avatar|meme|prompt pack|coupon|comic|manga|dictionary|translation|pronunciation/iu.test(text);
}

function aihotRawEntryDecision(item = {}) {
  const category = String(item.category || "").toLowerCase();
  const matched = matchRawEntryRules(item);
  const categoryKeeps = new Set(rawEntryPolicy.aihot_default_candidate_categories || ["ai-products", "ai-models"]);
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
    return `warning: ${themeLabel(theme)} concentration ${(share * 100).toFixed(1)}% exceeds ${(threshold * 100).toFixed(0)}%; downstream Pool / cards / business signals must diversify or declare theme_day=true.`;
  }
  return "none";
}

const defaultRequiredImportanceTypes = [
  "important_case",
  "important_funding",
  "important_product_or_service",
  "important_vertical_solution",
];
const formalCardCoreImportanceTypes = new Set(defaultRequiredImportanceTypes);

function requiredImportanceTypes() {
  const configured = keywordMonitoring.policy?.required_importance_types;
  return Array.isArray(configured) && configured.length ? configured : defaultRequiredImportanceTypes;
}

function itemImportanceType(item = {}) {
  return item.raw_record?.guanlan_scores?.importance_type
    || item.guanlan_scores?.importance_type
    || importanceProfile(item, item.snapshot?.text || "").importance_type;
}

function importanceCoverageGaps(items, scope = "raw") {
  const required = requiredImportanceTypes();
  const minRaw = Number(
    keywordMonitoring.policy?.raw_min_per_required_importance_type
      ?? 1
  );
  const minPool = Number(
    keywordMonitoring.policy?.pool_min_per_required_importance_type
      ?? 1
  );
  const min = scope === "pool" ? minPool : minRaw;
  if (!min) return [];
  const byImportance = items.reduce((acc, item) => {
    const type = itemImportanceType(item);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  return required
    .map((importanceType) => ({
      importanceType,
      count: byImportance[importanceType] || 0,
      min,
    }))
    .filter((entry) => entry.count < entry.min);
}

function coverageGapText(gaps = []) {
  return Array.isArray(gaps) && gaps.length
    ? gaps.map((gap) => `${gap.importanceType || gap.signalClass}=${gap.count}/${gap.min}`).join("; ")
    : "none";
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
  return /[ÃÂ\ufffdæäåèéï¼]/u.test(text);
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

function normalizePublishedAt(...values) {
  for (const value of values.flat()) {
    const raw = String(value || "").trim();
    if (!raw) continue;
    const gdelt = raw.match(/(?:^|[^\d])(\d{4})(\d{2})(\d{2})(?:T?(\d{2})(\d{2})(\d{2})?)?/u);
    if (gdelt) {
      const [, year, month, day, hour = "00", minute = "00", second = "00"] = gdelt;
      if (!validDateParts(year, month, day)) continue;
      if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) return `${year}-${month}-${day}T00:00:00Z`;
      return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }
    const looksLikeDate = /^\d{4}-\d{1,2}-\d{1,2}/u.test(raw)
      || /^[A-Z][a-z]{2,9}\s+\d{1,2},\s+\d{4}/u.test(raw)
      || /^\d{1,2}\s+[A-Z][a-z]{2,9}\s+\d{4}/u.test(raw);
    if (looksLikeDate) {
      const parsed = new Date(raw);
      if (Number.isFinite(parsed.getTime())) return parsed.toISOString();
    }
    const dateOnly = raw.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/u);
    if (dateOnly) {
      const [, year, month, day] = dateOnly;
      if (!validDateParts(year, month, day)) continue;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`;
    }
  }
  return "";
}

function validDateParts(year, month, day) {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  return y >= 2000 && y <= 2099 && m >= 1 && m <= 12 && d >= 1 && d <= 31;
}

function acquisitionSourceLevelFor(item = {}) {
  const channel = String(item.acquisition_channel || "").toLowerCase();
  if (/aihot|search|rss|aggregator/u.test(channel)) return "M";
  return "";
}

function isMixedDiscoveryChannel(item = {}) {
  return acquisitionSourceLevelFor(item) === "M";
}

function isSocialDiscoverySource(item = {}) {
  const source = `${item.source || ""} ${item.url || ""}`.toLowerCase();
  return /x\.com|twitter\.com|linkedin\.com|operators|founder|ceo|cto|creator|operator|community|social/iu.test(source);
}

function isAIHotDailySelected(item = {}) {
  return item.acquisition_channel === "aihot" && item.aihot_lane === "daily";
}

function researchStatusFor(item = {}) {
  const text = `${item.url || ""} ${item.source || ""} ${item.title || ""}`.toLowerCase();
  if (/arxiv\.org|arxiv/u.test(text)) return "preprint";
  if (/conference|proceedings|paper|benchmark|technical report|cncf|stanford|mit|berkeley/u.test(text)) return "formal_report";
  if (/nature\.com|science\.org|nejm|lancet/u.test(text)) return "peer_reviewed";
  return "not_research";
}

function isKnownOfficialHost(host = "") {
  return /(^|\.)?(openai\.com|anthropic\.com|palantir\.com|scale\.com|googleblog\.com|developers\.googleblog\.com|deepmind\.google|microsoft\.com|github\.com|aws\.amazon\.com|amazon\.com|nvidia\.com|salesforce\.com|servicenow\.com|cursor\.com|perplexity\.ai|mistral\.ai|huggingface\.co)$/iu.test(host);
}

function isDomesticVendorHost(host = "") {
  return /(^|\.)?(baidu\.com|alibabacloud\.com|aliyun\.com|tencent\.com|cloud\.tencent\.com|huawei\.com|huaweicloud\.com|bytedance\.com|volcengine\.com)$/iu.test(host);
}

function registryRuleFor(item = {}) {
  const host = urlHost(item.url || "").toLowerCase();
  const sourceText = `${item.source || ""} ${item.sourceName || ""}`.toLowerCase();
  if (!host && !sourceText) return null;
  return registryHostRules.find((rule) => {
    const ruleHost = String(rule.host || "").toLowerCase();
    const ruleName = String(rule.name || "").toLowerCase();
    if (ruleHost && (host === ruleHost || host.endsWith(`.${ruleHost}`) || ruleHost.endsWith(`.${host}`))) return true;
    return ruleName && sourceText.includes(ruleName);
  }) || null;
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
  const registryRule = registryRuleFor(item);

  if (isSocialDiscoverySource(item)) {
    return { level: "C", type: "operators", acquisition_source_level: "M", research_status: researchStatus };
  }

  if (/github\.com/iu.test(host)) {
    return {
      level: isOfficialGitHubRepo(item) ? "S" : "B",
      type: "developer",
      acquisition_source_level: acquisitionSourceLevel,
      research_status: researchStatus,
    };
  }

  if (registryRule && registryRule.source_level && registryRule.source_level !== "M") {
    return {
      level: registryRule.source_level,
      type: registryRule.source_type || "registry",
      acquisition_source_level: acquisitionSourceLevel,
      research_status: researchStatus,
    };
  }

  if (isDomesticVendorHost(host) || /baidu|alibaba|aliyun|tencent|huawei|volcengine|bytedance/iu.test(source)) {
    return { level: "B", type: "domestic_vendor", acquisition_source_level: acquisitionSourceLevel, research_status: researchStatus };
  }
  if (isKnownOfficialHost(host) || /openai|anthropic|google|microsoft|aws|cursor|nvidia|servicenow|salesforce/iu.test(source)) {
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

function enterpriseAiTransformationProfileFromText(text = "") {
  const normalized = String(text || "").toLowerCase();
  const roleSignal =
    /\bfde\b|forward deployed engineer|forward deployed engineering|applied ai engineer|applied ai architect|solutions architect applied ai|technical deployment lead|model deployment for business|customer engineering|domain teams/iu.test(normalized);
  const implementationSignal =
    /enterprise ai transformation|ai transformation|ai implementation|production rollout|customer deployment|design partner|pilot customer|technical scoping|system design|workflow automation|business process automation|agent deployment|applied ai deployment|customer engineering/iu.test(normalized);
  const platformEnablementSignal =
    /rag deployment|enterprise knowledge base|data integration|ontology|evals?|observability|permission control|audit logging|agent governance|runtime governance/iu.test(normalized);
  const enterpriseSignal =
    /enterprise|customer|production|deployment|workflow|procurement|governance|business|industry|domain|pilot|企业|客户|生产|部署|流程|采购|治理|行业/iu.test(normalized);

  if (!(roleSignal || platformEnablementSignal || (implementationSignal && enterpriseSignal))) {
    return { matched: false, stage: "", reason: "" };
  }

  let stage = "ai_transformation";
  if (roleSignal) stage = "org_build";
  if (/procurement|tender|rfp|marketplace|采购|招投标/iu.test(normalized)) stage = "procurement";
  if (/production rollout|production deployment|deployed in production|customer deployment|上线|生产部署/iu.test(normalized)) stage = "production_rollout";
  if (/pilot|design partner|proof of concept|\bpoc\b|试点/iu.test(normalized)) stage = "pilot";
  if (platformEnablementSignal) stage = "platform_enablement";

  return {
    matched: true,
    stage,
    reason: roleSignal ? "fde_or_applied_ai_org_signal" : "enterprise_ai_implementation_signal",
  };
}

function enterpriseAiTransformationProfileForItem(item = {}, bodyText = "") {
  return enterpriseAiTransformationProfileFromText([
    item.title,
    item.summary,
    bodyText,
    item.url,
    item.source,
    item.search_intent,
    item.search_path,
    item.search_path_label,
  ].filter(Boolean).join(" "));
}

function importanceProfile(item = {}, bodyText = "") {
  const text = [
    item.title,
    item.summary,
    bodyText,
    item.url,
    item.source,
    item.search_path,
    item.search_intent,
    item.search_path_label,
  ].filter(Boolean).join(" ").toLowerCase();
  const candidates = [];
  const supportingSignals = [];

  const add = (type, scoreValue, reason) => candidates.push({ type, score: scoreValue, reason });
  const support = (signal) => supportingSignals.push(signal);
  const enterpriseAi = enterpriseAiTransformationProfileForItem(item, bodyText);

  if (enterpriseAi.matched) {
    support("enterprise_ai_transformation_lens");
    if (enterpriseAi.stage === "production_rollout" || enterpriseAi.stage === "pilot") {
      add("important_case", enterpriseAi.stage === "production_rollout" ? 5 : 4, "enterprise AI implementation case");
    }
  }

  if (/case study|customer story|customer case|customer adopts|customer adoption|design partner|pilot|production rollout|客户案例|客户采用|标杆客户|真实客户|试点|上线客户|行业客户/iu.test(text)) {
    add("important_case", /fortune|global 500|enterprise|银行|医院|制造|金融|医疗|法律|大型企业|头部客户/iu.test(text) ? 5 : 4, "real customer or adoption case");
  }
  const automotiveRolloutOnly =
    /(tesla|特斯拉|fsd|autopilot|自动驾驶|智驾|robotaxi|汽车|车主|车辆|整车)/iu.test(text)
    && /(立陶宛|欧洲|欧盟|车型认证|型式认证|监管|推送|上线|订阅|车主|道路|驾驶员|l2)/iu.test(text)
    && !/(enterprise ai|企业ai|ai平台|开发者平台|模型发布|agent|智能体|api|sdk|客户案例|生产部署)/iu.test(text);
  if (automotiveRolloutOnly) {
    support("automotive_vertical_context");
  }

  const oldFundingBackground =
    /(此前|去年|早前|202[0-5]).{0,30}(融资|完成.*轮|raised|funding|series|seed)/iu.test(text)
    && /(发布|推出|亮相|预告|将于|teaser|launch|release)/iu.test(text);
  const fundingNoise =
    /clickbait|feed|funding record|massive ai deals|ranked by funding|top ai agent startups|vc attention|market map|fund focused on ai/iu.test(text);
  const concreteFundingEvent =
    /\b(raises|raised|lands|landed|secures|secured|closes|closed|announces|announced|pulls in|bags)\b.{0,100}\b(\$|funding|financing|round|seed|series|pre-seed|debt)\b/iu.test(text)
    || /\b(series [a-z]|seed|pre-seed|debt financing)\b.{0,100}\b(\$|million|billion|funding|round|financing)\b/iu.test(text)
    || /(融资|债务融资|完成.*轮|种子轮|天使轮|a轮|b轮).{0,80}(\$|美元|人民币|亿元|千万|百万|投资方|领投|参投|估值)/iu.test(text);
  if (concreteFundingEvent && !oldFundingBackground && !fundingNoise) {
    add("important_funding", /\$|million|billion|估值|yc|y combinator|a16z|sequoia|benchmark|知名机构|亿美元|千万美元/iu.test(text) ? 5 : 4, "funding or investment event");
  }
  if (/model release|new model|benchmark|evals?|inference|reasoning|multimodal|agent architecture|mcp|protocol|open[-\s]?source|paper|research|模型发布|新模型|基准|评测|推理|多模态|智能体架构|开源|论文|技术趋势/iu.test(text)) {
    add("important_technical_trend", /breakthrough|state-of-the-art|sota|major|frontier|openai|anthropic|google|deepmind|meta|nvidia|突破|前沿|重大/iu.test(text) ? 5 : 4, "technical trend or capability shift");
  }
  if (/launch(?:es|ed|ing)?|release(?:s|d)?|introduc(?:e|es|ed|ing)|new product|new service|new api|sdk|platform|general availability|推出|发布|上线|新产品|新服务|新 api|平台|正式可用/iu.test(text)) {
    const teaserOnly = /(预告|将于|即将|亮相|teaser|coming soon|showcase|海报)/iu.test(text) && !/(customer|客户|production|部署|正式可用|general availability|api|sdk|pricing|定价|规格|benchmark|评测)/iu.test(text);
    add("important_product_or_service", teaserOnly ? 3 : /openai|anthropic|google|microsoft|aws|nvidia|salesforce|servicenow|major|enterprise|developer platform|大厂|平台级|企业级/iu.test(text) ? 5 : 4, teaserOnly ? "product teaser without enough launch evidence" : "new product or service");
  }
  const verticalIndustryPattern = /(healthcare|medical|legal|finance|banking|insurance|manufacturing|retail|education|logistics|supply chain|hr|public sector|public procurement|procurement|tender|construction|architecture|architectural|aec|engineering|energy|utility|utilities|power grid|modern grid|electric grid|物流|医疗|金融|银行|保险|法律|法务|制造|工业|零售|教育|供应链|人力资源|政务|建筑).{0,140}(solution|workflow|use case|vertical|industry|copilot|agent|automation|adoption|workspace|platform|interface|engine|virtual workforce|operational complexity|解决方案|工作流|场景|行业|智能体|助手|自动化|采用)/iu;
  const verticalSolutionPattern = /(solution|workflow|use case|vertical|industry|copilot|agent|automation|adoption|workspace|platform|interface|engine|virtual workforce|operational complexity|解决方案|工作流|场景|行业|智能体|助手|自动化|采用).{0,140}(healthcare|medical|legal|finance|banking|insurance|manufacturing|retail|education|logistics|supply chain|hr|public sector|public procurement|procurement|tender|construction|architecture|architectural|aec|engineering|energy|utility|utilities|power grid|modern grid|electric grid|物流|医疗|金融|银行|保险|法律|法务|制造|工业|零售|教育|供应链|人力资源|政务|建筑)/iu;
  if (verticalIndustryPattern.test(text) || verticalSolutionPattern.test(text)) {
    add("important_vertical_solution", /enterprise|production|case study|customer|部署|客户|生产|落地|标杆/iu.test(text) ? 5 : 4, "vertical industry solution");
  }

  if (/procurement|tender|budget|revenue|arr|pricing|billing|regulation|lawsuit|compliance|security|privacy|risk|采购|招标|预算|收入|定价|计费|监管|诉讼|合规|安全|隐私|风险/iu.test(text)) {
    support("commercial_or_risk_context");
  }
  if (/(regulation|lawsuit|compliance|security|privacy|risk|breach|ban|fine|investigation|监管|诉讼|合规|安全事故|隐私|风险|处罚|调查).{0,120}(industry|market|enterprise|deployment|adoption|governance|行业|市场|企业|部署|采用|治理|路线|判断)/iu.test(text)) {
    support("market_shaping_risk_context");
  }
  if (/customer|deployment|workflow|integration|adoption|客户|部署|工作流|集成|采用/iu.test(text)) {
    support("adoption_context");
  }

  const strongVerticalContext =
    /(industry_landing|procurement_marketplace|public procurement|enterprise procurement|architecture|architectural|aec|design workspace|design engine|intelligent interface|modern grid|power grid|electric grid|utility cooperatives|insurance claims|logistics planning|manufacturing|supply chain|healthcare|legal workflow)/iu.test(text)
    && /(workflow|use case|agent|automation|workspace|platform|interface|engine|solution|virtual workforce|operational complexity|procurement process|tenders?|design|adoption)/iu.test(text);
  const typePriority = {
    important_vertical_solution: strongVerticalContext ? 5 : 1,
    important_case: 4,
    important_product_or_service: 3,
    important_funding: concreteFundingEvent ? 6 : 2,
    important_technical_trend: 2,
  };
  const best = candidates.sort((a, b) => (b.score - a.score) || ((typePriority[b.type] || 0) - (typePriority[a.type] || 0)))[0];
  if (automotiveRolloutOnly && (!best || best.score < 5)) {
    return {
      importance_type: "supporting_signal",
      importance_score: 2,
      importance_reason: "automotive vertical rollout only; AI-adjacent but not a core WaveSight AI commercial signal",
      supporting_signals: [...new Set(supportingSignals)],
    };
  }
  if (!best) {
    return {
      importance_type: supportingSignals.length ? "supporting_signal" : "none",
      importance_score: supportingSignals.length ? 2 : 1,
      importance_reason: supportingSignals.length ? "supporting commercial context only" : "no core WaveSight importance signal",
      supporting_signals: [...new Set(supportingSignals)],
    };
  }

  return {
    importance_type: best.type,
    importance_score: best.score,
    importance_reason: `${best.reason}; rubric=${best.score >= 5 ? "5 major/platform/industry-shaping" : best.score >= 4 ? "4 concrete important change" : best.score >= 3 ? "3 plausible but not core-ready" : "1-2 weak/supporting"}`,
    supporting_signals: [...new Set(supportingSignals)],
  };
}

function score(item) {
  const text = `${item.title || ""} ${item.summary || ""} ${item.url || ""}`.toLowerCase();
  const importance = importanceProfile(item);
  let value = importance.importance_score * 1.4;
  if (importance.importance_type === "supporting_signal") value -= 1.5;
  if (item.theme && item.theme !== "enterprise-agent-governance" && item.theme !== "uncategorized") value += 0.6;
  // Source tier is a type label only. Curated entrances may affect capture
  // priority, but S/A/B/C/D/M must not create layered value bonuses.
  if (isAIHotDailySelected(item)) value += 2;
  else if (item.acquisition_channel === "aihot") value += 1;
  if (item.acquisition_channel === "aihot" && item.raw_entry_decision === "raw_candidate") value += 0.5;
  if (item.acquisition_channel === "keyword-search") value += 0.8;
  if (item.search_path === "community_feedback" || item.acquisition_channel === "hn") value -= 2;
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

function stripSiteFilters(query = "") {
  return String(query || "")
    .replace(/\(\s*(?:site:[^\s()]+(?:\s+OR\s+)?)+\s*\)/giu, " ")
    .replace(/\bsite:[^\s()]+/giu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isProviderAuthFailure(message = "") {
  return /401|unauthorized|invalid api key|forbidden/iu.test(String(message || ""));
}

function isProviderRunOutage(message = "") {
  return /gateway|upstream|temporarily unavailable|timeout|timed out|5\d\d|bad gateway|service unavailable/iu.test(String(message || ""));
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
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_, code) => {
      try {
        return String.fromCodePoint(Number(code));
      } catch {
        return _;
      }
    })
    .replace(/&#x([0-9a-f]+);/giu, (_, code) => {
      try {
        return String.fromCodePoint(parseInt(code, 16));
      } catch {
        return _;
      }
    });
}

function normalizeExtractedText(text = "") {
  return decodeHtmlEntities(text)
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split(/\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 1)
    .join("\n")
    .trim();
}

function stripHtmlNoise(html = "") {
  return String(html || "")
    .replace(/<!--[\s\S]*?-->/gu, " ")
    .replace(/<script[\s\S]*?<\/script>/giu, " ")
    .replace(/<style[\s\S]*?<\/style>/giu, " ")
    .replace(/<svg[\s\S]*?<\/svg>/giu, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/giu, " ")
    .replace(/<form[\s\S]*?<\/form>/giu, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/giu, " ")
    .replace(/<nav[\s\S]*?<\/nav>/giu, " ")
    .replace(/<footer[\s\S]*?<\/footer>/giu, " ")
    .replace(/<header[\s\S]*?<\/header>/giu, " ")
    .replace(/<aside[\s\S]*?<\/aside>/giu, " ");
}

function htmlFragmentToText(fragment = "") {
  return normalizeExtractedText(
    stripHtmlNoise(fragment)
      .replace(/<\/(h1|h2|h3|h4|p|li|blockquote|section|article|main|div|tr)>/giu, "\n")
      .replace(/<br\s*\/?>/giu, "\n")
      .replace(/<[^>]+>/gu, " ")
  );
}

function attrValue(tag = "", attr = "") {
  const pattern = new RegExp(`${attr}\\s*=\\s*([\"'])([\\s\\S]*?)\\1`, "iu");
  return decodeHtmlEntities(tag.match(pattern)?.[2] || "");
}

function extractMetaText(html = "") {
  const values = [];
  const metaMatches = String(html || "").matchAll(/<meta\b[^>]*>/giu);
  for (const match of metaMatches) {
    const tag = match[0];
    const key = `${attrValue(tag, "name")} ${attrValue(tag, "property")}`.toLowerCase();
    if (!/(^|\s)(description|og:description|twitter:description)(\s|$)/u.test(key)) continue;
    const content = attrValue(tag, "content");
    if (content) values.push(content);
  }
  return normalizeExtractedText(values.join("\n\n"));
}

function flattenJsonText(value, fields = []) {
  const output = [];
  const visit = (node) => {
    if (!node) return;
    if (typeof node === "string") {
      if (node.length >= 80) output.push(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node !== "object") return;
    for (const field of fields) {
      if (typeof node[field] === "string") output.push(node[field]);
    }
    for (const key of ["headline", "description", "articleBody", "text", "abstract", "reviewBody"]) {
      if (typeof node[key] === "string") output.push(node[key]);
    }
    if (node["@graph"]) visit(node["@graph"]);
  };
  visit(value);
  return normalizeExtractedText(output.join("\n\n"));
}

function extractJsonLdText(html = "") {
  const blocks = String(html || "").matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu);
  const texts = [];
  for (const block of blocks) {
    const rawJson = decodeHtmlEntities(block[1] || "").trim();
    if (!rawJson) continue;
    try {
      const parsed = JSON.parse(rawJson);
      const text = flattenJsonText(parsed, ["headline", "description", "articleBody", "text"]);
      if (text) texts.push(text);
    } catch {
      // Some sites emit invalid JSON-LD; ignore it and fall back to visible text.
    }
  }
  return normalizeExtractedText(texts.join("\n\n"));
}

function collectReadableHtmlCandidates(html = "") {
  const raw = String(html || "");
  const candidates = [];
  const add = (method, fragment) => {
    const text = htmlFragmentToText(fragment);
    if (text) candidates.push({ method, text });
  };

  for (const match of raw.matchAll(/<(article|main)\b[^>]*>[\s\S]*?<\/\1>/giu)) {
    add(match[1].toLowerCase(), match[0]);
  }

  const contentClassPattern = /<([a-z0-9]+)\b[^>]*(?:id|class)\s*=\s*["'][^"']*(?:article|content|post|entry|story|body|press|news|release|blog|markdown|prose)[^"']*["'][^>]*>[\s\S]*?<\/\1>/giu;
  for (const match of raw.matchAll(contentClassPattern)) {
    add("content-container", match[0]);
  }

  add("body-visible-text", raw);
  return candidates;
}

function isNonTextContentType(contentType = "") {
  return /\b(?:application\/pdf|application\/octet-stream|application\/zip|application\/x-gzip|application\/x-tar|image\/|audio\/|video\/|font\/)/iu.test(
    String(contentType || "")
  );
}

const MOJIBAKE_MARKER_NEEDLES = [
  "\u947e\u5cf0\u7df1",
  "\u93c9\u30e6\u7c2e",
  "\u93c4\u5267\u305a",
  "\u6d7c\u4f77\u7b1f",
  "\u935f\u55d5\u7b1f",
  "\u93af\u546e",
  "\u5bf0\u546f",
  "\u9359\u621d\u7af7",
  "\u94fb\u5d88\u796b",
  "\u7039\u5c7e\u579a",
  "\u934f\ue100\u7d11",
  "\u6769\u501f\u91dc",
  "\u9358\u71b8\u6783",
  "\u9422\u3129\u20ac",
  "\u6d93\u6c2c\u59df",
  "\u6d5c\u0443\u6427",
  "\u59af\u2033\u7037",
  "\u93ba\u3125\u56ad",
  "\u5bee\u20ac\u9359",
  "\u93c5\u9e3f\u5158",
];

function textHygieneDiagnostics(text = "") {
  const raw = String(text || "");
  const length = raw.length || 1;
  const replacementCount = (raw.match(/\uFFFD/gu) || []).length;
  const controlCount = (raw.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/gu) || []).length;
  const binaryMarkerCount = (raw.match(/%PDF|endobj|xref|JFIF|Exif|Photoshop 3\.0|stream\s+x[\u0000-\uFFFF]{0,4}\uFFFD/giu) || []).length;
  const mojibakeCount = MOJIBAKE_MARKER_NEEDLES.filter((marker) => raw.includes(marker)).length;
  return {
    replacement_count: replacementCount,
    replacement_ratio: Number((replacementCount / length).toFixed(4)),
    control_count: controlCount,
    control_ratio: Number((controlCount / length).toFixed(4)),
    binary_marker_count: binaryMarkerCount,
    mojibake_marker_count: mojibakeCount,
    binary_contaminated: binaryMarkerCount > 0 || controlCount >= 3 || replacementCount >= 8 || replacementCount / length > 0.003,
    mojibake_contaminated: mojibakeCount > 0,
  };
}

function assertGeneratedIndexTextClean(file = "", text = "") {
  if (!/(?:raw|pool)-candidates\.md$/iu.test(String(file || ""))) return;
  const diagnostics = textHygieneDiagnostics(text);
  if (diagnostics.mojibake_contaminated || diagnostics.binary_contaminated) {
    throw new Error(`Refusing to write contaminated generated index ${rel(file)}: mojibake=${diagnostics.mojibake_marker_count}, replacement=${diagnostics.replacement_count}, binary=${diagnostics.binary_marker_count}`);
  }
}

function readableDiagnostics(text = "", method = "") {
  const cleaned = String(text || "");
  const length = cleaned.length;
  const hygiene = textHygieneDiagnostics(cleaned);
  const lines = cleaned.split(/\n/u).filter((line) => line.trim().length >= 20);
  const sentenceCount = (cleaned.match(/[。！？.!?]\s/gu) || []).length + (cleaned.match(/[。！？.!?]$/gu) || []).length;
  const boilerplateHits = (cleaned.match(/navigation|subscribe|sign in|sign up|cookie|privacy policy|terms of service|advertisement|comments drawer|loading comments|menu|footer|newsletter|登录|注册|订阅|隐私|导航|广告/giu) || []).length;
  const symbolRatio = length ? (cleaned.match(/[{}<>[\]|=_~]/gu) || []).length / length : 1;
  const lineScore = Math.min(22, lines.length * 2);
  const sentenceScore = Math.min(18, sentenceCount * 2);
  const lengthScore = Math.min(45, Math.floor(length / 90));
  const methodBonus = /article|main|content-container|json-ld/iu.test(method) ? 12 : 0;
  const boilerplatePenalty = Math.min(25, boilerplateHits * 3);
  const symbolPenalty = symbolRatio > 0.08 ? 18 : symbolRatio > 0.04 ? 8 : 0;
  const hygienePenalty = hygiene.mojibake_contaminated ? 40 : 0;
  const score = hygiene.binary_contaminated
    ? 0
    : Math.max(0, Math.min(100, lengthScore + lineScore + sentenceScore + methodBonus - boilerplatePenalty - symbolPenalty - hygienePenalty));
  return {
    readability_score: score,
    text_length: length,
    paragraph_count: lines.length,
    sentence_count: sentenceCount,
    boilerplate_hits: boilerplateHits,
    symbol_ratio: Number(symbolRatio.toFixed(4)),
    ...hygiene,
    method,
  };
}

function chooseReadableCandidate(candidates = [], limit = 18000) {
  const scored = candidates
    .map((candidate) => {
      const text = normalizeExtractedText(candidate.text || "").slice(0, limit).trim();
      const diagnostics = readableDiagnostics(text, candidate.method || "unknown");
      return { ...candidate, text, diagnostics };
    })
    .filter((candidate) => candidate.text.length >= 80)
    .sort((a, b) => b.diagnostics.readability_score - a.diagnostics.readability_score || b.text.length - a.text.length);
  return scored[0] || { method: "none", text: "", diagnostics: readableDiagnostics("", "none") };
}

function extractReadableSnapshotText(bodyText = "", contentType = "", limit = 18000) {
  const raw = String(bodyText || "");
  if (isNonTextContentType(contentType)) {
    return {
      text: "",
      full_text: "",
      method: "non-text-content-type",
      diagnostics: { ...readableDiagnostics("", "non-text-content-type"), content_type: contentType, rejected: true },
      rejected: true,
    };
  }
  if (!raw) {
    return { text: "", full_text: "", method: "empty", diagnostics: readableDiagnostics("", "empty") };
  }

  const rawHygiene = textHygieneDiagnostics(raw);
  if (rawHygiene.binary_contaminated) {
    return {
      text: "",
      full_text: "",
      method: "binary-text-rejected",
      diagnostics: { ...readableDiagnostics("", "binary-text-rejected"), ...rawHygiene, rejected: true },
      rejected: true,
    };
  }

  if (/json/i.test(contentType)) {
    const text = compactSnippet(raw, Math.min(limit, 60000));
    return { text, full_text: text, method: "json-text", diagnostics: readableDiagnostics(text, "json-text") };
  }

  if (!/<html|<body|<article|<main|<p[\s>]/iu.test(raw)) {
    const text = compactSnippet(raw, Math.min(limit, 60000));
    return { text, full_text: text, method: "plain-text", diagnostics: readableDiagnostics(text, "plain-text") };
  }

  const jsonLd = extractJsonLdText(raw);
  const meta = extractMetaText(raw);
  const candidates = [
    ...(jsonLd ? [{ method: "json-ld", text: jsonLd }] : []),
    ...collectReadableHtmlCandidates(raw),
    ...(meta ? [{ method: "meta-description", text: meta }] : []),
  ];
  const best = chooseReadableCandidate(candidates, limit);
  const hasReadableBody = best.text.length >= 400 && best.diagnostics.readability_score >= 24;
  return {
    text: hasReadableBody ? best.text.slice(0, 18000).trim() : "",
    full_text: hasReadableBody ? best.text.slice(0, Math.min(limit, 60000)).trim() : "",
    method: best.method,
    diagnostics: best.diagnostics,
    fallback_meta_text: meta,
  };
}

function extractReadableText(bodyText = "", contentType = "", limit = 18000) {
  return extractReadableSnapshotText(bodyText, contentType, limit).full_text;
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
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^m\./u, "").replace(/^amp\./u, "").replace(/^www\./u, "");
    parsed.pathname = parsed.pathname
      .replace(/\/amp\/?$/iu, "")
      .replace(/\/index\.html?$/iu, "")
      .replace(/\/+/gu, "/");
    for (const param of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "utm_name", "ref", "ref_src", "fbclid", "gclid", "mc_cid", "mc_eid"]) {
      parsed.searchParams.delete(param);
    }
    if (/reuters\.com|businesswire\.com|prnewswire\.com|globenewswire\.com|techcrunch\.com|theinformation\.com|axios\.com|venturebeat\.com/iu.test(parsed.hostname)) {
      parsed.search = "";
    }
    return parsed.toString().replace(/\/$/u, "");
  } catch {
    return url || "";
  }
}

function titleFingerprint(title = "") {
  return String(title || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/gu, "")
    .replace(/\b(reuters|exclusive|update\s*\d+|press release|announces?|launches?|raises?|series [a-z]|seed round)\b/giu, " ")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .split(/\s+/u)
    .filter((word) => word && word.length > 2)
    .slice(0, 14)
    .join(" ");
}

function publishedDay(value = "") {
  const normalized = normalizePublishedAt(value);
  return normalized ? normalized.slice(0, 10) : "";
}

function dayFromUrl(value = "") {
  const text = String(value || "");
  const match = text.match(/(?:^|[^\d])(20\d{2})[/-](\d{1,2})[/-](\d{1,2})(?:[^\d]|$)/u);
  if (!match) return "";
  const [, year, rawMonth, rawDay] = match;
  const month = rawMonth.padStart(2, "0");
  const day = rawDay.padStart(2, "0");
  if (!validDateParts(year, month, day)) return "";
  return `${year}-${month}-${day}`;
}

function dayFromText(value = "") {
  const text = String(value || "");
  const months = {
    jan: "01",
    january: "01",
    feb: "02",
    february: "02",
    mar: "03",
    march: "03",
    apr: "04",
    april: "04",
    may: "05",
    jun: "06",
    june: "06",
    jul: "07",
    july: "07",
    aug: "08",
    august: "08",
    sep: "09",
    sept: "09",
    september: "09",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    dec: "12",
    december: "12",
  };
  const match = text.match(/\b(?:published|updated|posted|date)?\s*:?\s*(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(\d{1,2})(?:-\d{1,2})?,?\s+(20\d{2})\b/iu);
  if (!match) return "";
  const [, rawMonth, rawDay, year] = match;
  const month = months[rawMonth.toLowerCase()];
  const day = rawDay.padStart(2, "0");
  if (!month || !validDateParts(year, month, day)) return "";
  return `${year}-${month}-${day}`;
}

function sourceDayForItem(item = {}) {
  return publishedDay(item.published_at)
    || dayFromUrl(item.url)
    || dayFromUrl(item.source)
    || dayFromText(`${item.title || ""} ${item.summary || ""} ${item.snapshot?.text || ""}`);
}

function isStaleCoreCandidate(item = {}, maxAgeDays = 14) {
  const sourceDay = sourceDayForItem(item);
  if (!sourceDay) return false;
  const runDate = new Date(`${date}T12:00:00Z`);
  const sourceDate = new Date(`${sourceDay}T12:00:00Z`);
  if (!Number.isFinite(runDate.getTime()) || !Number.isFinite(sourceDate.getTime())) return false;
  return (runDate.getTime() - sourceDate.getTime()) > maxAgeDays * 24 * 60 * 60 * 1000;
}

function sourceFamilyForDedupe(item = {}) {
  const host = urlHost(item.url || "").toLowerCase();
  const text = `${item.source || ""} ${item.title || ""} ${item.summary || ""}`.toLowerCase();
  if (/reuters\.com|reuters/u.test(`${host} ${text}`)) return "reuters";
  if (/businesswire\.com|prnewswire\.com|globenewswire\.com|business wire|pr newswire|globenewswire/u.test(`${host} ${text}`)) return "funding-wire";
  if (/\/blog\/|\/news\/|\/press|\/product|\/products|\/customers|\/case-stud|\/release|\/changelog/iu.test(item.url || "")) return `site:${host}`;
  return host ? `host:${host}` : "";
}

function searchDedupeKey(item = {}) {
  const canonical = canonicalUrl(item.url || "").toLowerCase();
  if (canonical) return `url:${canonical}`;
  const titleKey = titleFingerprint(item.title || "");
  if (!titleKey) return `${item.title || ""}-${item.source || ""}`;
  return `title:${sourceFamilyForDedupe(item)}:${publishedDay(item.published_at)}:${titleKey}`;
}

function secondarySearchDedupeKey(item = {}) {
  const titleKey = titleFingerprint(item.title || "");
  if (titleKey.length < 24) return "";
  const family = sourceFamilyForDedupe(item);
  const day = publishedDay(item.published_at);
  if (/reuters|funding-wire|site:/u.test(family)) return `semantic:${family}:${day}:${titleKey}`;
  return "";
}

function dedupePriority(item = {}) {
  let value = 0;
  if (item.published_at) value += 6;
  if (/GDELT|Reuters|Bloomberg|TechCrunch|The Information|Axios|Business Wire|PR Newswire|GlobeNewswire/iu.test(`${item.source || ""} ${item.url || ""}`)) value += 3;
  if (/Anysearch|Exa|Tavily/iu.test(item.source || "")) value += 1;
  value += Math.min(String(item.summary || "").length / 400, 2);
  return value;
}

function dedupeSearchItems(items = []) {
  const byPrimary = new Map();
  const aliasToPrimary = new Map();
  let duplicateCount = 0;
  for (const item of items) {
    const primary = searchDedupeKey(item);
    const secondary = secondarySearchDedupeKey(item);
    const existingKey = aliasToPrimary.get(primary) || (secondary ? aliasToPrimary.get(secondary) : "") || primary;
    const current = byPrimary.get(existingKey);
    if (!current || dedupePriority(item) > dedupePriority(current)) {
      byPrimary.set(existingKey, current ? { ...item, duplicate_count: (current.duplicate_count || 0) + 1 } : item);
    } else if (current) {
      current.duplicate_count = (current.duplicate_count || 0) + 1;
    }
    aliasToPrimary.set(primary, existingKey);
    if (secondary) aliasToPrimary.set(secondary, existingKey);
    if (current) duplicateCount += 1;
  }
  if (duplicateCount) providerFallbackNotes.push(`Search cross-entry dedupe removed ${duplicateCount} duplicate provider hits before Raw selection.`);
  return [...byPrimary.values()];
}

function listJsonFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listJsonFilesRecursive(next));
    else if (entry.name.endsWith(".json")) files.push(next);
  }
  return files;
}

function rawDateFromArchivePath(file) {
  const normalized = file.replace(/\\/g, "/");
  const match = normalized.match(/\/originals\/(\d{4}-\d{2}-\d{2})\//u);
  return match ? match[1] : "";
}

function addIndexValue(map, key, value) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function buildHistoricalRawIndex() {
  if (historicalRawIndexCache) return historicalRawIndexCache;
  const urls = new Map();
  const hashes = new Map();
  const originalsRoot = path.join(rawDir, "originals");
  let records = 0;
  for (const file of listJsonFilesRecursive(originalsRoot)) {
    const archiveDate = rawDateFromArchivePath(file);
    if (!archiveDate || archiveDate >= date) continue;
    const record = readJson(file, null);
    if (!record || typeof record !== "object") continue;
    records += 1;
    const pointer = {
      date: archiveDate,
      raw_id: record.raw_id || "",
      title: record.title || "",
      path: rel(file),
    };
    const url = canonicalUrl(record.canonical_url || record.original_url || record.source_url || record.url || "").toLowerCase();
    addIndexValue(urls, url, pointer);
    for (const hash of [
      record.content_hash,
      record.full_text_hash,
      record.evidence_completeness?.evidence_hash,
    ].filter(Boolean)) {
      addIndexValue(hashes, String(hash).toLowerCase(), pointer);
    }
  }
  historicalRawIndexCache = { urls, hashes, records };
  historicalDedupeRecordsChecked = records;
  return historicalRawIndexCache;
}

function firstHistoricalMatch(map, key) {
  if (!key || !map.has(key)) return null;
  const matches = map.get(key) || [];
  return matches
    .slice()
    .sort((left, right) => String(left.date).localeCompare(String(right.date)) || String(left.raw_id).localeCompare(String(right.raw_id)))[0] || null;
}

function historicalDuplicateMatchFor(item = {}, includeSnapshotHash = false) {
  if (!historicalDedupeEnabled) return null;
  const index = buildHistoricalRawIndex();
  const url = canonicalUrl(item.canonical_url || item.original_url || item.source_url || item.url || item.raw_original_id || "").toLowerCase();
  const urlMatch = firstHistoricalMatch(index.urls, url);
  if (urlMatch) return { kind: "url", match: urlMatch };

  if (!includeSnapshotHash) return null;
  const snapshot = item.snapshot || {};
  for (const hash of [
    item.content_hash,
    item.full_text_hash,
    snapshot.hash,
    snapshot.full_text_hash,
  ].filter(Boolean)) {
    const hashMatch = firstHistoricalMatch(index.hashes, String(hash).toLowerCase());
    if (hashMatch) return { kind: "hash", match: hashMatch };
  }
  return null;
}

function filterHistoricalDuplicatesBeforeRaw(items = []) {
  if (!historicalDedupeEnabled) return items;
  const kept = [];
  let removed = 0;
  for (const item of items) {
    if (historicalDuplicateMatchFor(item, false)) {
      removed += 1;
      continue;
    }
    kept.push(item);
  }
  historicalDedupePreFetchRemoved = removed;
  if (removed) {
    providerFallbackNotes.push(`Historical Raw dedupe removed ${removed} URL duplicate candidate(s) before Raw selection.`);
  }
  return kept;
}

function filterHistoricalDuplicatesAfterFetch(items = []) {
  if (!historicalDedupeEnabled) return items;
  const kept = [];
  let removed = 0;
  for (const item of items) {
    if (historicalDuplicateMatchFor(item, true)) {
      removed += 1;
      continue;
    }
    kept.push(item);
  }
  historicalDedupePostFetchRemoved = removed;
  if (removed) {
    providerFallbackNotes.push(`Historical Raw dedupe removed ${removed} fetched hash duplicate candidate(s) before Raw writing.`);
  }
  return kept;
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
  const diagnostics = snapshot.extractor_diagnostics || {};
  if (/fetch-failed|no-url|blocked|paywall|non-text|binary|garbled/iu.test(status)) return "failed";
  if (diagnostics.rejected || diagnostics.binary_contaminated || diagnostics.mojibake_contaminated) return "failed";
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

function hasUsableSnapshot(snapshot = {}) {
  return Boolean(String(snapshot.text || snapshot.full_text || "").trim()) && !/no-url|fetch-failed|blocked|timeout/iu.test(String(snapshot.status || ""));
}

function hasEvidenceHash(snapshot = {}) {
  return Boolean(String(snapshot.hash || snapshot.full_text_hash || "").trim());
}

function sourceVolatility(item = {}) {
  const host = urlHost(item.url || "");
  const text = `${item.source || ""} ${item.source_type || ""} ${host} ${item.acquisition_channel || ""}`.toLowerCase();
  if (/linkedin\.com|x\.com|twitter\.com|reddit\.com|news\.ycombinator\.com|hn\.algolia|hacker news|community|social/u.test(text)) return "high";
  if (/aihot|newsletter|substack|medium|producthunt|github/u.test(text)) return "medium";
  return "low";
}

function isCommunitySource(item = {}) {
  const host = urlHost(item.url || "");
  const sourceType = String(item.source_type || "").toLowerCase();
  const acquisitionChannel = String(item.acquisition_channel || "").toLowerCase();
  const sourceRole = String(item.source_role || item.sourceRole || "").toLowerCase();
  const directSourceText = `${sourceType} ${host} ${acquisitionChannel}`.toLowerCase();
  if (/linkedin\.com|x\.com|twitter\.com|reddit\.com|news\.ycombinator\.com|hn\.algolia|community|social/u.test(directSourceText)) {
    return true;
  }
  if (/resolved_original_source|primary_source/u.test(sourceRole) && host) {
    return false;
  }
  const discoveryText = String(item.source || "").toLowerCase();
  return /hacker news|community|social/u.test(discoveryText);
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
  const evidenceObjectType = classifyEvidenceObjectType(item, snapshot.text || item.summary || "", []);
  if (hasFullText(snapshot) && isEventEvidenceObject(evidenceObjectType)) return "core_evidence_candidate";
  if (hasFullText(snapshot) && isIndexOnlyEvidenceObject(evidenceObjectType)) return "index_only_evidence";
  return hasFullText(snapshot) ? "supporting_evidence" : "weak_signal";
}

function originFetchStatus(snapshot = {}) {
  const status = String(snapshot.status || "");
  const error = String(snapshot.error || "");
  const combined = `${status} ${error}`.toLowerCase();
  if (/paywall|subscribe|subscription/u.test(combined)) return "paywalled";
  if (/403|forbidden|blocked|captcha|access denied/u.test(combined)) return "blocked";
  if (/timeout|aborted|etimedout/u.test(combined)) return "timeout";
  if (/fetched-(clean|readable)-text/u.test(status) && String(snapshot.text || "").trim().length >= 400) return "success";
  if (/summary-only/u.test(status)) return "summary_only";
  return "failed";
}

function sourceRoleFor(item = {}, snapshot = {}) {
  if (!isMixedDiscoveryChannel(item)) return "primary_source";
  return originFetchStatus(snapshot) === "success" ? "resolved_original_source" : "discovery_source";
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
  if (/risk|security|privacy|lawsuit|regulation|compliance|incident|风险|安全|隐私|诉讼|监管|合规/iu.test(text)) return "supporting_context";
  if (/customer|case study|deployment|pilot|PwC|客户|案例|部署|试点|采用/iu.test(text)) return "case_detail";
  if (/workflow|process|approval|procurement|sales|support|流程|审批|采购|销售|客服|交付/iu.test(text)) return "workflow_change";
  if (/launch|release|announce|update|integrat|发布|推出|更新|集成|上线/iu.test(text)) return "product_update";
  if (/believe|argue|said|says|认为|表示|称|观点/iu.test(text)) return "opinion";
  return "company_action";
}

function supportsForExcerpt(type) {
  const supports = new Set(["signal_card_candidate", "relationship_graph_input"]);
  if (["company_action", "product_update", "workflow_change"].includes(type)) supports.add("business_change");
  if (["case_detail", "company_action", "workflow_change", "number"].includes(type)) supports.add("case");
  if (["opinion", "quote"].includes(type)) supports.add("viewpoint");
  if (["company_action", "workflow_change", "funding", "number"].includes(type)) supports.add("trend_candidate_context");
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
      importance: item.score >= 7 || ["case_detail", "workflow_change", "funding", "number"].includes(type) ? "high" : "medium",
      confidence: extractionQuality(item.snapshot) === "high" ? "high" : "medium",
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
  const riskExcerpts = excerpts.filter((excerpt) => excerpt.type === "supporting_context");
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
  return clampScore(value);
}

function guanlanScores(item, quality, elements, seed) {
  const qualityBonus = { high: 1.4, medium: 0.8, low: 0.2, failed: -1 }[quality] || 0;
  const evidenceRichness = elements.companies.length + elements.workflows.length + elements.numbers.length + seed.case_details.length;
  const importance = importanceProfile(item, item.snapshot?.text || item.summary || "");
  const guanlanBase = importance.importance_type === "supporting_signal" || importance.importance_type === "none" ? 1.5 : 2.5;
  return {
    importance_type: importance.importance_type,
    importance_score: importance.importance_score,
    importance_reason: importance.importance_reason,
    supporting_signals: importance.supporting_signals,
    novelty: clampScore(2 + (item.theme && item.theme !== "uncategorized" ? 1 : 0)),
    evidence_strength: clampScore(2 + qualityBonus + Math.min(1, evidenceRichness / 5)),
    case_richness: clampScore(1 + evidenceRichness / 3),
    trend_relevance: clampScore(guanlanBase + importance.importance_score / 3 + (importance.importance_type === "important_technical_trend" ? 1 : 0)),
    guanlan_relevance: clampScore(guanlanBase + importance.importance_score / 3 + (["important_case", "important_funding", "important_product_or_service", "important_vertical_solution"].includes(importance.importance_type) ? 0.8 : 0)),
    emerging_signal_score: emergingSignalScore(item, quality, elements, seed),
  };
}

function usableFor(item, quality, scores, excerpts) {
  const coreEvidence = hasFullText(item.snapshot) && !["low", "failed"].includes(quality);
  const types = new Set(excerpts.map((excerpt) => excerpt.type));
  const community = isCommunitySource(item);
  const gate = commercialSignalHardGate(item, item.snapshot?.text || item.summary || "", excerpts);
  return {
    viewpoint: coreEvidence && (types.has("opinion") || types.has("quote")),
    case: gate.evidenceObjectUsable && coreEvidence && (types.has("case_detail") || scores.case_richness >= 3),
    business_change: gate.evidenceObjectUsable && coreEvidence && ["company_action", "product_update", "workflow_change"].some((type) => types.has(type)),
    relationship_graph_input: gate.evidenceObjectUsable && coreEvidence && scores.guanlan_relevance >= 3,
    trend_candidate_context: gate.evidenceObjectUsable && coreEvidence && scores.trend_relevance >= 4,
    signal_card_candidate: gate.evidenceObjectUsable && coreEvidence && scores.importance_score >= 4 && formalCardCoreImportanceTypes.has(scores.importance_type),
    emerging_pool: gate.evidenceObjectUsable && scores.emerging_signal_score >= 4,
    user_feedback_pool: gate.evidenceObjectUsable && community && coreEvidence,
    watchlist: gate.evidenceObjectUsable && (scores.emerging_signal_score >= 3 || scores.guanlan_relevance >= 3),
  };
}

function poolRoutesFor(item, quality, scores, usable, excerpts = [], rawQcDecision = "") {
  const routes = new Set();
  const sourceRole = sourceRoleFor(item, item.snapshot || {});
  const gate = commercialSignalHardGate(item, item.snapshot?.text || item.summary || "", excerpts);
  const completeness = evidenceCompleteness(
    item,
    "",
    "",
    excerpts,
    item.snapshot?.full_text || item.snapshot?.text || item.summary || ""
  );
  const computedRawQc = rawQcDecisionFor(
    item,
    quality,
    gate,
    completeness
  );
  const computedRawQcDecision = rawQcDecision || computedRawQc.decision;
  const degradationReasons = computedRawQc.degradation_reasons || [];
  const hasOriginalUrl = Boolean(String(item.url || "").trim());
  const hasRequiredEvidenceHashes =
    !completeness.missing?.includes("missing_hash")
    && !completeness.missing?.includes("missing_excerpt");
  const nonIndexEvidenceObject =
    gate.evidenceObjectUsable
    && !gate.indexOnlyEvidence
    && !isIndexOnlyEvidenceObject(gate.evidenceObjectType);
  const coreEvidence =
    computedRawQcDecision === "allow"
    && hasOriginalUrl
    && !/discovery_source/iu.test(sourceRole)
    && hasFullText(item.snapshot)
    && ["high", "medium"].includes(quality)
    && hasRequiredEvidenceHashes
    && nonIndexEvidenceObject
    && !isGenericReportOrListItem(item)
    && !isRepositoryOrCatalogCoreBlockedItem(item)
    && !isStaleCoreCandidate(item);
  if (computedRawQcDecision === "block") {
    return [isAIHotDailySelected(item) ? "index_only" : "discard"];
  }
  if (!gate.evidenceObjectUsable) {
    return [isAIHotDailySelected(item) || quality !== "failed" ? "index_only" : "discard"];
  }
  if (coreEvidence && scores.importance_score >= 4 && formalCardCoreImportanceTypes.has(scores.importance_type)) routes.add("core_pool");
  if (usable.emerging_pool) routes.add("emerging_pool");
  if (usable.user_feedback_pool) routes.add("user_feedback_pool");
  if (usable.watchlist && !routes.has("core_pool")) routes.add("watchlist");
  if (!routes.size && isAIHotDailySelected(item)) routes.add(quality === "failed" ? "index_only" : "watchlist");
  if (!routes.size && quality === "failed") routes.add("discard");
  if (!routes.size) routes.add("index_only");
  const limitedRoutes = limitRoutesByDegradation([...routes], degradationReasons, computedRawQcDecision, item);
  return applyPoolRouteOverrides(item, limitedRoutes);
}

function applyPoolRouteOverrides(item = {}, routes = []) {
  if (item.force_non_core_pool !== true) return routes;
  const next = routes.filter((route) => route !== "core_pool");
  if (!next.length || next.every((route) => route === "index_only" || route === "discard")) {
    next.push("watchlist");
  }
  return [...new Set(next)];
}

function limitRoutesByDegradation(routes = [], degradationReasons = [], rawQcDecision = "", item = {}) {
  const routeSet = new Set(routes);
  if (rawQcDecision === "allow") return [...routeSet].filter((route) => route !== "discard");
  if (rawQcDecision === "block") return [isAIHotDailySelected(item) ? "index_only" : "discard"];

  routeSet.delete("core_pool");
  const reasons = new Set(degradationReasons || []);
  if (reasons.has("index_only_or_directory_page")) return ["index_only"];
  if (reasons.has("missing_full_text") || reasons.has("missing_snapshot")) {
    return [isAIHotDailySelected(item) ? "index_only" : "watchlist"];
  }
  if (reasons.has("missing_hash") || reasons.has("missing_excerpt")) {
    return routeSet.has("user_feedback_pool") ? ["user_feedback_pool"] : ["watchlist"];
  }
  const allowed = [...routeSet].filter((route) => ["emerging_pool", "user_feedback_pool", "watchlist", "index_only"].includes(route));
  return allowed.length ? allowed : ["watchlist"];
}

function commercialSignalText(item = {}, snapshotText = "", excerpts = []) {
  return [
    item.title,
    item.summary,
    item.url,
    item.source,
    item.sourceName,
    item.keyword_group,
    item.search_intent,
    item.search_path_label,
    ...excerpts.map((excerpt) => excerpt.text),
    snapshotText.slice(0, 2600),
  ].filter(Boolean).join(" ");
}

function urlPathSegments(item = {}) {
  try {
    return new URL(item.url || "").pathname.split("/").map((part) => part.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function isRootLikePath(item = {}) {
  const segments = urlPathSegments(item);
  if (!segments.length) return true;
  return segments.length === 1 && /^(?:index\.html?|home|product|products|pricing|docs|documentation|api|sdk|demo|solutions|models|package|project)$/iu.test(segments[0]);
}

function isPackageOrModelIndex(item = {}) {
  const host = urlHost(item.url || "");
  const path = `/${urlPathSegments(item).join("/")}`.toLowerCase();
  if (/npmjs\.com/u.test(host)) return /^\/package\/[^/]+\/?$/u.test(path);
  if (/pypi\.org/u.test(host)) return /^\/project\/[^/]+\/?$/u.test(path);
  if (/huggingface\.co/u.test(host)) return /^\/(?:[^/]+\/[^/]+|models\/[^/]+\/[^/]+|datasets\/[^/]+\/[^/]+)\/?$/u.test(path);
  return false;
}

function isMarketplaceListing(item = {}) {
  const host = urlHost(item.url || "");
  const path = `/${urlPathSegments(item).join("/")}`.toLowerCase();
  const text = `${item.title || ""} ${item.summary || ""} ${host} ${path}`.toLowerCase();
  if (/marketplace|appsource|aws\.amazon\.com\/marketplace|chromewebstore|plugins?\/?$/iu.test(text)) return true;
  return /\/(?:marketplace|apps?|plugins?|extensions?)\/[^/]+\/?$/iu.test(path);
}

function isSearchResultOrToolDirectory(item = {}) {
  const host = urlHost(item.url || "");
  const path = `/${urlPathSegments(item).join("/")}`.toLowerCase();
  const text = `${item.title || ""} ${item.summary || ""} ${host} ${path}`.toLowerCase();
  if (/\/search(?:\/|$)|[?&]q=|[?&]query=|search results?|搜索结果/iu.test(`${item.url || ""} ${text}`)) return true;
  return /ai[-\s]?tools?|工具导航|工具目录|工具大全|导航站|directory|catalog|collection/iu.test(text)
    && !/announce|launch|release|funding|case study|customer|发布|推出|融资|客户|案例/iu.test(text);
}

function isLowQualityChineseOfficialOrSeo(item = {}) {
  const host = urlHost(item.url || "");
  const text = `${item.title || ""} ${item.summary || ""} ${host} ${item.source || ""}`.toLowerCase();
  const domesticVendor = isDomesticVendorHost(host) || /baidu|aliyun|alibaba|tencent|huawei|volcengine|bytedance/iu.test(text);
  const seoPattern = /官网|产品介绍|免费试用|立即开通|解决方案|热门产品|产品服务|联系我们|低代码|智能客服|营销文案|seo|推广|获客|私域|全网首发/iu.test(text);
  const concreteAction = /公告|发布|更新|客户|案例|融资|投资|采购|招标|监管|处罚|诉讼|changelog|release|launch|funding|customer|case study/iu.test(text);
  return (domesticVendor || /中文|国内|国产/iu.test(text)) && seoPattern && !concreteAction;
}

function isGitHubReadmeOrRepoIndex(item = {}) {
  const host = urlHost(item.url || "");
  if (!/github\.com/u.test(host)) return false;
  const segments = urlPathSegments(item);
  if (segments.length <= 2) return true;
  return /readme|blob\/[^/]+\/readme|tree\/[^/]+$/iu.test(segments.join("/"));
}

function isRepositoryOrCatalogCoreBlockedItem(item = {}) {
  const host = urlHost(item.url || "");
  const path = `/${urlPathSegments(item).join("/")}`.toLowerCase();
  const text = `${item.title || ""} ${item.summary || ""} ${item.url || ""} ${item.source || ""}`.toLowerCase();
  if (isGitHubReadmeOrRepoIndex(item)) return true;
  if (/docs\.github\.com|learn\.microsoft\.com|docs\./u.test(host)) return true;
  if (isPackageOrModelIndex(item) || isMarketplaceListing(item) || isSearchResultOrToolDirectory(item)) return true;
  return /(^|\/)(docs?|documentation|api|sdk|marketplace|models?|packages?|tools?|catalog)(\/|$)|readme|readme-ov-file|product catalog|model page|package page|marketplace listing/iu.test(`${path} ${text}`)
    && !/blog|news|press|release|announc|changelog|customer|case-study/iu.test(`${path} ${text}`);
}

function isGenericFdeRoleOrServicePage(item = {}) {
  const host = urlHost(item.url || "");
  const path = `/${urlPathSegments(item).join("/")}`.toLowerCase();
  const text = `${item.title || ""} ${item.summary || ""} ${item.url || ""} ${item.source || ""}`.toLowerCase();
  const combined = `${host} ${path} ${text}`;
  const eventText = combined.replace(/\/\s*query=.*$/iu, "");
  const fdeRoleOrService = /forward[-\s]?deployed[-\s]?(?:engineer|engineering)|\bfde\b|applied ai engineer|ai implementation service|customer engineering|technical deployment lead/iu.test(combined);
  if (!fdeRoleOrService) return false;
  const genericPage = /(^|\/)(?:hire|forward-deployed-engineer|forward-deployed-engineering|fde|services?|careers?|jobs?|roles?)(?:[-/]|$)|what is|role|career|job|hire|services?|consulting|implementation|for ai implementation|critical bridge|from the customer|embedded ai workflow delivery|customer-embedded function/iu.test(combined);
  const concreteOriginalEvent = /customer story|case study|customer case|new customer|customer adopts|deployment announced|launch(?:es|ed)?|release(?:s|d)?|announc(?:e|es|ed|ement)|raise(?:s|d)?|funding|acqui(?:re|res|red|sition)|partner(?:s|ed|ship)|procurement|contract|pilot customer/iu.test(eventText);
  return genericPage && !concreteOriginalEvent;
}

function classifyEvidenceObjectType(item = {}, snapshotText = "", excerpts = []) {
  const host = urlHost(item.url || "");
  const path = `/${urlPathSegments(item).join("/")}`.toLowerCase();
  const text = commercialSignalText(item, snapshotText, excerpts).toLowerCase();
  const officialIndex =
    isRootLikePath(item)
    || /\/(?:products?|solutions?|pricing|docs?|documentation|api|sdk|demo|models?|packages?)\/?$/iu.test(path)
    || isPackageOrModelIndex(item)
    || isGitHubReadmeOrRepoIndex(item);
  const searchOrDirectory = isSearchResultOrToolDirectory(item);
  const marketplaceListing = isMarketplaceListing(item);
  const chineseSeo = isLowQualityChineseOfficialOrSeo(item);
  const changelog = /\/(?:releases?|changelog|changes|release-notes|tags)(?:\/|$)|release notes|changelog|version \d|sdk release|api change|breaking change|版本更新|更新日志|发布说明/iu.test(`${path} ${text}`);
  const pricingChange = /price increase|price cut|pricing change|billing change|new pricing|usage-based pricing|计费变化|价格变化|涨价|降价|按量计费/iu.test(text);
  const caseDetail = /case study|customer story|customer case|deployment|deployed|pilot|design partner|customer adopts|客户案例|客户采用|部署|试点|上线客户|合作客户/iu.test(text);
  const regulatory = /sec filing|8-k|10-k|10-q|procurement|tender|lawsuit|regulation|监管|采购公告|招标|诉讼|证券披露/iu.test(text);
  const concreteEvent = /announce(?:s|d)?|launch(?:es|ed)?|release(?:s|d)?|roll(?:s|ed)? out|ship(?:s|ped)?|open-source(?:d)?|fund(?:ing|ed)?|raise(?:s|d)?|acqui(?:re|res|red|sition)|partner(?:s|ed)?|integrat(?:e|es|ed|ion)|new customer|new partnership|new product|新发布|推出|上线|公测|开源|融资|收购|合作|接入|集成|新增客户|新客户|新合作/iu.test(text);
  const explicitOfficialEvent = /announc(?:e|es|ed|ement)|introduc(?:e|es|ed|ing)|new customer|new partnership|new product|release notes|changelog|version \d|\b20\d{2}\b|新发布|正式发布|宣布|新增客户|新客户|新合作|版本更新|更新日志|发布说明/iu.test(text);

  if (changelog) return "changelog_or_release";
  if (pricingChange) return "pricing_change";
  if (caseDetail) return "case_or_customer";
  if (regulatory) return "regulatory_or_procurement";
  if (concreteEvent && !officialIndex) return "event";
  if (concreteEvent && officialIndex && explicitOfficialEvent) return "event_on_official_page";
  if (searchOrDirectory) return "search_result_or_tool_directory";
  if (marketplaceListing) return "marketplace_listing";
  if (chineseSeo) return "low_quality_chinese_official_or_seo";
  if (isGitHubReadmeOrRepoIndex(item)) return "repo_readme_or_index";
  if (isPackageOrModelIndex(item)) return "ecosystem_package_or_model_index";
  if (officialIndex) return "official_index_or_directory";
  if (isCommunitySource(item)) return "community_feedback";
  if (/arxiv|paper|report|benchmark|research|whitepaper|论文|研究|报告|基准/iu.test(`${host} ${path} ${text}`)) return "research_or_report";
  return "supporting_article";
}

function isIndexOnlyEvidenceObject(type = "") {
  return [
    "official_index_or_directory",
    "repo_readme_or_index",
    "ecosystem_package_or_model_index",
    "marketplace_listing",
    "search_result_or_tool_directory",
    "low_quality_chinese_official_or_seo",
  ].includes(type);
}

function isEventEvidenceObject(type = "") {
  return [
    "event",
    "event_on_official_page",
    "case_or_customer",
    "changelog_or_release",
    "pricing_change",
    "regulatory_or_procurement",
  ].includes(type);
}

function isGenericReportOrListItem(item = {}) {
  const titleUrlSource = [
    item.title,
    item.url,
    item.source,
  ].join(" ");
  const urlSource = [
    item.url,
    item.source,
  ].join(" ");
  if (/yc\.com\/companies\/industry|\/research\/enterprise-ai-agent|data-room\/ycombinator|\.pdf(?:$|[?#])|docs\.github\.com|dev\.to|aws marketplace:|docs\.aws\.com\/marketplace|pypi|\/packages?\//iu.test(urlSource)) {
    return true;
  }
  if (isGenericFdeRoleOrServicePage(item)) {
    return true;
  }
  return /startup ideas|buying criteria|adoption 2026|massive ai deals|funding record|funding bubble|funding roundup|biggest funding rounds|pre-seed slowdown|fund focused on ai|ranked by funding|top ai pre-seed investors|pre-seed investors|top ai agent startups|ai agent marketplace|marketplaces landscape|procurement guide|procurement playbook|enterprise business model shift|enterprise ai adoption stalls|agentic ai tools mapped|artificial intelligence startups funded by y combinator|funded companies|companies\s*&\s*verified leads|complete batch breakdown|market report|implementation report|complete guide|framework for investors|vertical report|fastest growing|venture funding quarter|building vertical ai|\btop\s+\d+\b|\buse cases\b|future of ai is vertical|hallucination tax|y combinator w26 batch|field guide|glossary|open source toolkit|ai in procurement orchestration|ai citations\s*&\s*visibility|about github copilot cloud agent|series-b-enterprise-ai-agents|ai agent startups insight partners funding/iu.test(titleUrlSource);
}

function hasExplicitChangeAction(item = {}, snapshotText = "", excerpts = []) {
  const types = new Set(excerpts.map((excerpt) => excerpt.type));
  const text = commercialSignalText(item, snapshotText, excerpts);
  const actionPattern = /发布|推出|上线|公测|内测|开源|收购|并购|融资|投资|合作|部署|接入|集成|升级|涨价|降价|计费|采购|招标|签约|扩展|新增|停用|关闭|监管|处罚|诉讼|客户|案例|launch(?:es|ed|ing)?|release(?:s|d)?|ship(?:s|ped)?|announce(?:s|d)?|roll(?:s|ed)? out|open-source|acqui(?:re|res|red|sition)|fund(?:ing|ed)?|raise(?:s|d)?|partner(?:s|ed)?|deploy(?:s|ed|ment)?|adopt(?:s|ed|ion)?|integrat(?:e|es|ed|ion)|pricing|billing|customer|case study|procurement|tender|regulation|lawsuit/iu;
  return ["company_action", "product_update", "workflow_change", "case_detail", "risk"].some((type) => types.has(type))
    && actionPattern.test(text);
}

function isHomepageOrDirectoryObservation(item = {}, snapshotText = "", excerpts = []) {
  const text = commercialSignalText(item, snapshotText, excerpts);
  let pathName = "";
  try {
    pathName = new URL(item.url || "").pathname || "/";
  } catch {
    pathName = "";
  }
  const rootLike = pathName === "/" || pathName === "" || /^\/(?:index\.html?)?$/iu.test(pathName);
  const directoryPattern = /官网|首页|开放平台|产品服务|热门产品|产品目录|解决方案|文档中心|开发文档|控制台|登录|注册|用户中心|财务及订单|消息中心|工单|免费开通|立即使用|查看详情|工具集|导航|大全|搜索结果|home\s?page|platform|pricing|docs|documentation|console|login|sign in|sign up|products|solutions/iu;
  if (!directoryPattern.test(text)) return false;
  return rootLike || /工具集|导航|大全|搜索结果|产品目录|热门产品|控制台|登录|用户中心|财务及订单|消息中心|工单/iu.test(text);
}

function commercialSignalHardGate(item = {}, snapshotText = "", excerpts = []) {
  const actionDetected = hasExplicitChangeAction(item, snapshotText, excerpts);
  const evidenceObjectType = classifyEvidenceObjectType(item, snapshotText, excerpts);
  const indexOnlyEvidence = isIndexOnlyEvidenceObject(evidenceObjectType);
  const eventEvidence = isEventEvidenceObject(evidenceObjectType);
  const directoryObservation = isRootLikePath(item) || isHomepageOrDirectoryObservation(item, snapshotText, excerpts) || indexOnlyEvidence;
  const evidenceObjectUsable = eventEvidence && !directoryObservation;
  return {
    actionDetected,
    evidenceObjectType,
    eventEvidence,
    evidenceObjectUsable,
    indexOnlyEvidence,
    directoryObservation,
    blockReason: directoryObservation
      ? "homepage_or_directory_observation"
      : !eventEvidence ? "not_event_case_or_trend_evidence" : "",
  };
}

function evidenceCompleteness(item = {}, originalPath = "", jsonPath = "", excerpts = [], fullText = "") {
  const snapshot = item.snapshot || {};
  const snapshotText = String(snapshot.text || "").trim();
  const text = String(fullText || snapshot.full_text || snapshotText || "").trim();
  const hash = snapshot.full_text_hash || snapshot.hash || (text ? shortHash(text) : "");
  const hasExcerpt = excerpts.some((excerpt) => String(excerpt.text || "").trim() && !/暂无可用摘录/u.test(excerpt.text || ""));
  const missing = [];
  if (!item.url) missing.push("missing_original_url");
  if (!hasFullText(snapshot)) missing.push("missing_full_text");
  if (!hasUsableSnapshot(snapshot)) missing.push("missing_snapshot");
  if (!hash) missing.push("missing_hash");
  if (!hasExcerpt) missing.push("missing_excerpt");
  return {
    original_url_status: item.url ? "present" : "missing",
    full_text_status: hasFullText(snapshot) ? "present" : "missing_or_summary_only",
    snapshot_status: hasUsableSnapshot(snapshot) ? "present" : "missing_or_fetch_failed",
    hash_status: hash ? "present" : "missing",
    excerpt_status: hasExcerpt ? "present" : "missing",
    markdown_snapshot_status: originalPath ? "will_write" : "missing",
    json_snapshot_status: jsonPath ? "will_write" : "missing",
    evidence_hash: hash,
    missing,
  };
}

function rawQcDecisionFor(item = {}, quality = "failed", gate = {}, completeness = {}) {
  const missing = new Set(completeness.missing || []);
  const degradationReasons = [];
  if (gate.indexOnlyEvidence || gate.directoryObservation) degradationReasons.push("index_only_or_directory_page");
  if (missing.has("missing_full_text")) degradationReasons.push("missing_full_text");
  if (missing.has("missing_snapshot")) degradationReasons.push("missing_snapshot");
  if (missing.has("missing_hash")) degradationReasons.push("missing_hash");
  if (missing.has("missing_excerpt")) degradationReasons.push("missing_excerpt");

  const hardBlock =
    !item.url
    || (quality === "failed" && !hasUsableSnapshot(item.snapshot))
    || ["low_quality_chinese_official_or_seo", "search_result_or_tool_directory"].includes(gate.evidenceObjectType)
    || (gate.evidenceObjectType === "marketplace_listing" && !gate.actionDetected);

  if (hardBlock) {
    return {
      decision: "block",
      downstream_use: "not_allowed",
      degradation_reasons: [...new Set(degradationReasons.length ? degradationReasons : ["raw_evidence_unusable"])],
    };
  }

  const allow =
    gate.evidenceObjectUsable
    && hasFullText(item.snapshot)
    && ["high", "medium"].includes(quality)
    && completeness.snapshot_status === "present"
    && completeness.hash_status === "present"
    && completeness.excerpt_status === "present";

  if (allow) {
    return {
      decision: "allow",
      downstream_use: "eligible_after_qc",
      degradation_reasons: [],
    };
  }

  return {
    decision: "allow_with_degradation",
    downstream_use: "index_watchlist_or_feedback_only",
    degradation_reasons: [...new Set(degradationReasons.length ? degradationReasons : ["insufficient_usable_evidence_object"])],
  };
}

function missingInformation(item, elements, seed, excerpts = []) {
  const missing = [];
  const gate = commercialSignalHardGate(item, item.snapshot?.text || item.summary || "", excerpts);
  if (!gate.evidenceObjectUsable) missing.push("证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象");
  if (!gate.actionDetected) missing.push("没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势");
  if (gate.directoryObservation) missing.push("疑似官网首页、产品目录或导航页，只能索引留存");
  if (!elements.companies.length) missing.push("没有明确公司或机构主体");
  if (!seed.case_details.length) missing.push("没有具体客户或真实企业案例");
  if (!seed.before_after_clues.length) missing.push("没有变化前后流程线索");
  if (!elements.numbers.length) missing.push("没有成本、收入、采用率或市场规模数字");
  if (!hasFullText(item.snapshot)) missing.push("没有可用全文快照");
  if (!hasEvidenceHash(item.snapshot)) missing.push("缺少证据 hash");
  if (!excerpts.length) missing.push("缺少可用摘录");
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
    "## extraction_diagnostics",
    "",
    `- extraction_method: ${record.extraction_method || "unknown"}`,
    `- readability_score: ${record.readability_score ?? 0}`,
    `- fetch_status: ${record.fetch_status || "unknown"}`,
    `- extraction_quality: ${record.extraction_quality || "unknown"}`,
    "",
    "## key_excerpts",
    "",
    ...record.key_excerpts.map((excerpt, index) => `${index + 1}. [${excerpt.type} / ${excerpt.supports.join(", ")} / ${excerpt.importance}] ${excerpt.text}`),
    "",
  ].join("\n");
}

function rawStatusFor(item, quality, isPooled, gate = commercialSignalHardGate(item, item.snapshot?.text || item.summary || "")) {
  if (!gate.evidenceObjectUsable) return quality === "failed" ? "ignored" : "indexed";
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
  const gate = commercialSignalHardGate(item, snapshotText, excerpts);
  const flags = accessFlags(item.snapshot);
  const completeness = evidenceCompleteness(item, originalPath, jsonPath, excerpts, fullText);
  const rawQc = rawQcDecisionFor(item, quality, gate, completeness);
  const enterpriseAi = enterpriseAiTransformationProfileForItem(item, fullText);
  const record = {
    schema_version: "raw-evidence-v2",
    raw_id: id,
    title: item.title || "",
    original_url: item.url || "",
    canonical_url: canonical,
    source_name: item.source || "",
    source_type: item.source_type || "unknown",
    source_level: item.source_level || "unknown",
    source_level_role: "traceability_only_not_value_score_or_core_gate",
    evidence_object_type: gate.evidenceObjectType,
    evidence_object_usable: gate.evidenceObjectUsable,
    event_evidence: gate.eventEvidence,
    index_only_evidence: gate.indexOnlyEvidence,
    acquisition_source_level: item.acquisition_source_level || acquisitionSourceLevelFor(item) || "",
    acquisition_channel: item.acquisition_channel || "unknown",
    research_status: item.research_status || researchStatusFor(item),
    search_intent: item.search_intent || "",
    search_path: item.search_path || "",
    search_path_label: item.search_path_label || "",
    enterprise_ai_transformation_lens: Boolean(item.enterprise_ai_transformation_lens || enterpriseAi.matched),
    enterprise_ai_transformation_stage: item.enterprise_ai_transformation_stage || enterpriseAi.stage || "",
    enterprise_ai_transformation_reason: item.enterprise_ai_transformation_reason || enterpriseAi.reason || "",
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
    extraction_method: item.snapshot?.extraction_method || "unknown",
    readability_score: item.snapshot?.readability_score ?? 0,
    extractor_diagnostics: item.snapshot?.extractor_diagnostics || {},
    has_full_text: hasFullText(item.snapshot),
    content_length: fullText.length,
    fetch_error: item.snapshot?.error || "",
    evidence_completeness: completeness,
    raw_qc_decision: rawQc.decision,
    raw_qc_downstream_use: rawQc.downstream_use,
    degradation_reasons: rawQc.degradation_reasons,
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
    duplicate_status: item.duplicate_count ? "merged_provider_duplicates" : flags.duplicate ? "duplicate" : "unique",
    url_hash: shortHash(canonical || item.url || ""),
    content_hash: item.snapshot?.hash || shortHash(snapshotText),
    full_text_hash: item.snapshot?.full_text_hash || shortHash(fullText),
    semantic_hash: shortHash(`${item.title || ""}\n${keyExcerpt(snapshotText, item.summary)}`),
    duplicate_of: item.duplicate_count ? `merged ${item.duplicate_count} duplicate provider hit(s) before Raw selection` : "",
    first_seen_at: item.published_at || collectedAt,
    last_seen_at: collectedAt,
    update_detected: false,
    key_excerpts: excerpts,
    business_elements: elements,
    evidence_seed: seed,
    guanlan_scores: scores,
    usable_for: usable,
    pool_routes: poolRoutesFor(item, quality, scores, usable, excerpts, rawQc.decision),
    change_action_detected: gate.actionDetected,
    evidence_eligibility: gate.evidenceObjectUsable ? "eligible" : "blocked",
    evidence_block_reason: gate.blockReason,
    missing_information: missingInformation(item, elements, seed, excerpts),
    raw_status: rawStatusFor(item, quality, isPooled, gate),
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
      extraction_method: "no_url_summary_fallback",
      readability_score: 0,
      extractor_diagnostics: { method: "no_url_summary_fallback" },
      error: "",
    };
  }
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "WaveSightAI/2.0 raw-snapshot",
        accept: "text/html,application/json,text/plain,*/*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "cache-control": "no-cache",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(snapshotTimeoutMs),
    });
    const contentType = response.headers.get("content-type") || "";
    if (isNonTextContentType(contentType)) {
      const text = summary || "来源返回 PDF、图片、压缩包或其它非文本内容；未写入正文证据，进入 Core Pool / Card 前必须改用可解析原文或专用解析器。";
      return {
        status: "non-text-source-rejected",
        text,
        full_text: "",
        excerpt: keyExcerpt(text, summary),
        fetched_at: fetchedAt,
        content_type: contentType || "unknown",
        capture_scope: "summary_only",
        visible_range: "非文本响应，已拒绝作为正文证据",
        hash: contentHash(text),
        full_text_hash: "none",
        extraction_method: "non-text-content-type",
        readability_score: 0,
        extractor_diagnostics: { ...readableDiagnostics("", "non-text-content-type"), content_type: contentType, rejected: true },
        error: response.ok ? "" : `${response.status} ${response.statusText}`,
      };
    }
    const bodyText = await response.text();
    const extracted = extractReadableSnapshotText(bodyText, contentType, 60000);
    if (extracted.rejected) {
      const text = summary || "来源正文包含 PDF、图片、压缩流或乱码特征；未写入正文证据，进入 Core Pool / Card 前必须回源重抓。";
      return {
        status: extracted.method || "binary-text-rejected",
        text,
        full_text: "",
        excerpt: keyExcerpt(text, summary),
        fetched_at: fetchedAt,
        content_type: contentType || "unknown",
        capture_scope: "summary_only",
        visible_range: "响应正文未通过文本卫生检查",
        hash: contentHash(text),
        full_text_hash: "none",
        extraction_method: extracted.method || "binary-text-rejected",
        readability_score: 0,
        extractor_diagnostics: extracted.diagnostics || { rejected: true },
        error: "",
      };
    }
    const fullText = extracted.full_text || "";
    const extractedText = extracted.text || (fullText ? fullText.slice(0, 18000).trim() : "");
    const metaFallback = extracted.fallback_meta_text || "";
    const text = extractedText || metaFallback || summary || compactSnippet(bodyText, 4000);
    const lowReadableBody = !extractedText && response.ok && (metaFallback || text);
    const status = response.ok
      ? (extractedText ? `fetched-readable-text-${extracted.method}` : (lowReadableBody ? "summary-only-low-readable-body" : "summary-only-no-readable-body"))
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
      extraction_method: extracted.method || "unknown",
      readability_score: extracted.diagnostics?.readability_score ?? 0,
      extractor_diagnostics: extracted.diagnostics || {},
      error: response.ok ? "" : `${response.status} ${response.statusText}`,
    };
  } catch (error) {
    const formattedError = formatFetchFailure(error);
    const text = summary || "正文抓取失败，保留标题、来源与采集摘要；进入前台前必须补足原文、页面类型和事件证据。";
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
      extraction_method: "fetch_failed_summary_fallback",
      readability_score: 0,
      extractor_diagnostics: { method: "fetch_failed_summary_fallback", error_type: blocked ? "blocked" : timeout ? "timeout" : "fetch_failed" },
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
        "user-agent": "WaveSightAI/2.1 guanlan-daily-monitor",
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

async function fetchAnysearchResults(query, limit = 5, options = {}) {
  if (!anysearchApiKey) throw new Error("ANYSEARCH_API_KEY is not configured");
  const body = {
    query,
    max_results: Math.min(Math.max(Number(limit) || 5, 1), 10),
  };
  if (options.domain) body.domain = options.domain;
  if (options.includeFilters !== false) {
    body.content_types = ["web", "news"];
    body.zone = "intl";
    body.language = "en";
  }
  const response = await fetch("https://api.anysearch.com/v1/search", {
    method: "POST",
    headers: {
      authorization: `Bearer ${anysearchApiKey}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(fetchTimeoutMs),
  });
  const bodyText = await response.text();
  let data = {};
  try {
    data = bodyText ? JSON.parse(bodyText) : {};
  } catch (error) {
    throw new Error(`Anysearch invalid JSON: ${formatFetchFailure(error)}`);
  }
  if (!response.ok) {
    const message = data?.error || data?.message || `${response.status} ${response.statusText}`;
    throw new Error(`Anysearch ${message}`);
  }
  if (data && typeof data.code === "number" && data.code !== 0) {
    throw new Error(`Anysearch ${data.message || `code=${data.code}`}`);
  }
  const nestedData = data && typeof data.data === "object" && !Array.isArray(data.data) ? data.data : {};
  const results = Array.isArray(data.results)
    ? data.results
    : Array.isArray(nestedData.results)
      ? nestedData.results
    : Array.isArray(data.items)
      ? data.items
      : Array.isArray(nestedData.items)
        ? nestedData.items
      : Array.isArray(data.data)
        ? data.data
        : [];
  const parsed = results
    .map((item) => ({
      id: item.id || item.url || item.link,
      title: item.title || item.name || item.headline || "",
      url: item.url || item.link || item.original_url || item.source_url || "",
      snippet: item.snippet || item.summary || item.description || item.content || item.text || "",
      source: item.source || item.source_name || item.publisher || "keyword search / Anysearch",
      published_at: normalizePublishedAt(
        item.published_at,
        item.publishedAt,
        item.published_date,
        item.publishedDate,
        item.datePublished,
        item.date_published,
        item.created_at,
        item.updated_at,
        item.published,
        item.date,
      ),
      meta: typeof item.score === "number" ? `score=${item.score.toFixed(3)}` : "",
    }))
    .filter((item) => item.url && item.title)
    .slice(0, limit);
  return parsed;
}

async function searchAnysearch(query, limit = 5) {
  const parsed = [];
  const seen = new Set();
  const add = (items) => {
    for (const item of items) {
      const key = item.url || item.id;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      parsed.push(item);
      if (parsed.length >= limit) break;
    }
  };
  try {
    add(await fetchAnysearchResults(query, limit, { domain: "business" }));
    if (parsed.length < limit) add(await fetchAnysearchResults(query, limit - parsed.length, { domain: "tech" }));
  } catch (error) {
    if (!isProviderRunOutage(error.message)) throw error;
    providerFallbackNotes.push(`Anysearch documented-payload retry for query "${query}": ${error.message}`);
    add(await fetchAnysearchResults(query, limit, { includeFilters: false }));
  }
  if (!parsed.length) throw new Error("Anysearch returned 0 usable results");
  return parsed.slice(0, limit);
}

async function searchTavily(query, limit = 5) {
  if (!tavilyApiKey) throw new Error("TAVILY_API_KEY is not configured");
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      authorization: `Bearer ${tavilyApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query,
      topic: "general",
      search_depth: "basic",
      max_results: Math.min(Math.max(Number(limit) || 5, 1), 10),
      include_answer: false,
      include_raw_content: false,
    }),
    signal: AbortSignal.timeout(fetchTimeoutMs),
  });
  const bodyText = await response.text();
  let data = {};
  try {
    data = bodyText ? JSON.parse(bodyText) : {};
  } catch (error) {
    throw new Error(`Tavily invalid JSON: ${formatFetchFailure(error)}`);
  }
  if (!response.ok) {
    const message = data?.error || data?.message || `${response.status} ${response.statusText}`;
    throw new Error(`Tavily ${message}`);
  }
  const results = Array.isArray(data.results) ? data.results : [];
  const parsed = results
    .map((item) => ({
      id: item.url,
      title: item.title || "",
      url: item.url || "",
      snippet: item.content || item.snippet || "",
      source: "keyword search / Tavily",
      published_at: normalizePublishedAt(item.published_at, item.publishedAt, item.published_date, item.publishedDate, item.datePublished, item.date),
      meta: typeof item.score === "number" ? `score=${item.score.toFixed(3)}` : "",
    }))
    .filter((item) => item.url && item.title)
    .slice(0, limit);
  if (!parsed.length) throw new Error("Tavily returned 0 usable results");
  return parsed;
}

async function searchExa(query, limit = 5) {
  if (!exaApiKey) throw new Error("EXA_API_KEY is not configured");
  const exaQuery = stripSiteFilters(query) || query;
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "x-api-key": exaApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: exaQuery,
      type: "auto",
      numResults: Math.min(Math.max(Number(limit) || 5, 1), 10),
      contents: {
        highlights: {
          numSentences: 2,
          highlightsPerUrl: 1,
        },
        text: false,
      },
    }),
    signal: AbortSignal.timeout(fetchTimeoutMs),
  });
  const bodyText = await response.text();
  let data = {};
  try {
    data = bodyText ? JSON.parse(bodyText) : {};
  } catch (error) {
    throw new Error(`Exa invalid JSON: ${formatFetchFailure(error)}`);
  }
  if (!response.ok) {
    const message = data?.error || data?.message || `${response.status} ${response.statusText}`;
    throw new Error(`Exa ${message}`);
  }
  const results = Array.isArray(data.results) ? data.results : [];
  const parsed = results
    .map((item) => {
      const highlights = Array.isArray(item.highlights) ? item.highlights.filter(Boolean).join(" ") : "";
      return {
        id: item.id || item.url,
        title: item.title || "",
        url: item.url || "",
        snippet: highlights || item.text || item.summary || "",
        source: "keyword search / Exa",
        published_at: normalizePublishedAt(item.published_at, item.publishedAt, item.published_date, item.publishedDate, item.datePublished, item.publishedDateString, item.created_at, item.updated_at),
        meta: typeof item.score === "number" ? `score=${item.score.toFixed(3)}` : "",
      };
    })
    .filter((item) => item.url && item.title)
    .slice(0, limit);
  if (!parsed.length) throw new Error("Exa returned 0 usable results");
  return parsed;
}

async function searchLayeredWeb(query, limit = 5) {
  if (anysearchApiKey && !anysearchDisabledForRun) {
    try {
      return await searchAnysearch(query, limit);
    } catch (error) {
      providerFallbackNotes.push(`Anysearch fallback for query "${query}": ${error.message}`);
      if (isProviderAuthFailure(error.message) || isProviderRunOutage(error.message)) {
        anysearchDisabledForRun = true;
      }
    }
  }
  if (tavilyApiKey && !tavilyDisabledForRun) {
    try {
      return await searchTavily(query, limit);
    } catch (error) {
      providerFallbackNotes.push(`Tavily fallback for query "${query}": ${error.message}`);
      if (isProviderAuthFailure(error.message)) {
        tavilyDisabledForRun = true;
      }
    }
  }
  if (exaApiKey) {
    try {
      return await searchExa(query, limit);
    } catch (error) {
      providerFallbackNotes.push(`Exa fallback for query "${query}": ${error.message}`);
    }
  }
  return searchDuckDuckGo(query, limit);
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
    results.push({ title, url, snippet, source: "keyword search / DuckDuckGo" });
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
    id: "fde_implementation",
    label: "Enterprise AI / FDE implementation path",
    role: "find FDE, applied AI, customer engineering, pilot, production rollout, procurement and vertical workflow deployment evidence",
    method: "ddg",
    querySuffix: "(FDE OR \"forward deployed\" OR \"applied AI\" OR \"customer engineering\" OR \"technical scoping\" OR \"production rollout\" OR \"pilot customer\" OR \"customer story\" OR \"case study\")",
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
    fallbackQuerySuffix: aTierMediaFallbackQuerySuffix,
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
  const limit = Math.max(searchPathQueryLimit, 1);
  if (pathConfig.id === "industry_landing") {
    const verticalQueries = allQueries.filter((query) => /vertical|industry|workflow|customer|adoption|finance|insurance|healthcare|legal|manufacturing|supply chain|public sector/iu.test(query.query || ""));
    if (verticalQueries.length) return verticalQueries.slice(0, limit);
  }
  if (pathConfig.id === "fde_implementation") {
    const fdeQueries = allQueries.filter((query) => /FDE|forward deployed|applied AI|customer engineering|technical scoping|production rollout|pilot customer|design partner|implementation|deployment|customer story|case study|workflow rollout|procurement pilot/iu.test(query.query || ""));
    const dedicated = fdeQueries.filter((query) => query.query_theme === "enterprise-ai-implementation-signal");
    const fallback = fdeQueries.filter((query) => query.query_theme !== "enterprise-ai-implementation-signal");
    if (fdeQueries.length) return [...dedicated, ...fallback].slice(0, limit);
  }
  const byTheme = new Map();
  for (const query of allQueries) {
    if (!byTheme.has(query.query_theme)) byTheme.set(query.query_theme, []);
    byTheme.get(query.query_theme).push(query);
  }
  const selected = [];
  for (const groupQueries of byTheme.values()) {
    selected.push(...groupQueries.slice(0, 1));
    if (selected.length >= limit) break;
  }
  for (const query of allQueries) {
    if (selected.length >= limit) break;
    if (!selected.includes(query)) selected.push(query);
  }
  return selected.slice(0, limit);
}

function keywordSearchResultText(result = {}) {
  return [
    result.title,
    result.snippet,
    result.summary,
    result.url,
    result.source,
  ].filter(Boolean).join(" ").toLowerCase();
}

function keywordSearchResultPreGate(result = {}, queryConfig = {}, pathConfig = {}) {
  const text = keywordSearchResultText(result);
  const url = String(result.url || "").toLowerCase();
  const title = String(result.title || "").toLowerCase();
  const query = String(queryConfig.query || "").toLowerCase();
  const enterpriseAiProfile = enterpriseAiTransformationProfileFromText(`${text} ${query}`);
  const trustedEnterpriseAiOrgSignal =
    enterpriseAiProfile.matched
    && /openai\.com|anthropic\.com|palantir\.com|scale\.com|microsoft\.com|salesforce\.com|servicenow\.com/iu.test(url);
  const configuredNoise = Array.isArray(rawEntryPolicy.noise_terms) ? rawEntryPolicy.noise_terms : [];
  const noiseHit = configuredNoise.find((term) => text.includes(String(term).toLowerCase()));
  if (noiseHit && !trustedEnterpriseAiOrgSignal) return { keep: false, reason: `noise_term:${noiseHit}` };

  if (/iciba\.com|youdao\.com|dict\.cn|dictionary|translation|pronunciation|是什么意思|翻译|音标|读音|例句/iu.test(text)) {
    return { keep: false, reason: "dictionary_or_translation_page" };
  }
  if (/runoob\.com\/tags|w3school|developer\.mozilla\.org\/.*\/web\/html\/reference|html\s*<\s*pre|<\s*pre\s*>|tag-pre|html-tag|tutorialspoint/iu.test(text)) {
    return { keep: false, reason: "html_reference_or_tutorial_page" };
  }
  if (/search\?|\/search\/|\/tag\/|\/tags\/|\/category\/|\/categories\/|tool directory|ai tools directory|工具导航|一站式\s*ai\s*导航/iu.test(text)) {
    return { keep: false, reason: "directory_or_search_page" };
  }
  if (/salary distribution|jobs\/salaries|\/jobs\/|job listings|glassdoor|indeed\.com|adzuna\.com|ziprecruiter|simplyhired/iu.test(text) && !trustedEnterpriseAiOrgSignal) {
    return { keep: false, reason: "job_or_salary_page" };
  }
  if (query.includes("pre-seed") && (/tag-pre|<\s*pre|html\s*pre|pre\s*元素|pre\s*标签/iu.test(text))) {
    return { keep: false, reason: "pre_seed_pre_tag_collision" };
  }
  if (/\b(model|inference)\b/iu.test(query) && /是什么意思|翻译|音标|读音|例句|dictionary|translation|definition|pronunciation/iu.test(text)) {
    return { keep: false, reason: "model_or_inference_dictionary_collision" };
  }

  if (pathConfig.id === "community_feedback") return { keep: true, reason: "community_feedback_path" };

  const aiAnchor = /\bai\b|artificial intelligence|llm|large language model|agentic|agent|copilot|gpt|chatgpt|openai|anthropic|claude|gemini|deepmind|mistral|llama|hugging\s?face|模型|推理|智能体|人工智能|大模型|多模态/iu.test(text);
  const trustedDomain = /openai\.com|anthropic\.com|palantir\.com|scale\.com|deepmind\.google|ai\.google|blog\.google|microsoft\.com|github\.com|huggingface\.co|arxiv\.org|techcrunch\.com|theinformation\.com|reuters\.com|bloomberg\.com|ft\.com|wsj\.com|crunchbase\.com|producthunt\.com|ycombinator\.com|a16z\.com|sequoiacap\.com|accel\.com|lightspeedvp\.com|benchmark\.com/iu.test(url);
  if (!aiAnchor && !trustedDomain) {
    return { keep: false, reason: "missing_ai_anchor_in_result" };
  }

  return { keep: true, reason: "passed" };
}

function keywordSearchItem(result, queryConfig, pathConfig, extra = {}) {
  const intent = extra.search_intent || inferSearchIntent(queryConfig.query);
  const enterpriseAiProfile = enterpriseAiTransformationProfileFromText([
    result.title,
    result.snippet,
    result.summary,
    result.url,
    result.source,
    queryConfig.query,
    pathConfig.id,
  ].filter(Boolean).join(" "));
  return {
    acquisition_channel: "keyword-search",
    original_id: result.id || result.url || `${pathConfig.id}:${queryConfig.query}:${result.title}`,
    title: result.title || "",
    summary: `${result.snippet || result.summary || ""}${result.meta ? ` / ${result.meta}` : ""} / query=${queryConfig.query} / intent=${intent} / path=${pathConfig.id}`.trim(),
    url: result.url || "",
    source: result.source || `keyword search / ${pathConfig.label}`,
    published_at: normalizePublishedAt(result.published_at, result.publishedAt, result.published_date, result.datePublished, result.date),
    category: pathConfig.id,
    search_intent: intent,
    search_path: pathConfig.id,
    search_path_label: pathConfig.label,
    enterprise_ai_transformation_lens: enterpriseAiProfile.matched,
    enterprise_ai_transformation_stage: enterpriseAiProfile.stage,
    enterprise_ai_transformation_reason: enterpriseAiProfile.reason,
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
  const filtered = [];
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
            const result = {
              id: item.objectID,
              title: item.title || item.story_title || "",
              url: `https://news.ycombinator.com/item?id=${item.objectID}`,
              snippet: `${item.points || 0} points / ${item.num_comments || 0} comments / linked_url=${item.url || "none"}`,
              source: "keyword search / HN community feedback",
              published_at: item.created_at || "",
            };
            const gate = keywordSearchResultPreGate(result, queryConfig, pathConfig);
            if (!gate.keep) {
              filtered.push({ path: pathConfig.id, reason: gate.reason, title: result.title });
              continue;
            }
            items.push(keywordSearchItem(result, queryConfig, pathConfig, { search_intent: "find_user_feedback" }));
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
            const result = {
              id: article.url,
              title: article.title || "",
              url: article.url,
              snippet: normalizePublishedAt(article.seendate, article.seenDate, article.date) || article.seendate || "",
              source: article.sourceCommonName || article.domain || "keyword search / GDELT",
              published_at: normalizePublishedAt(article.seendate, article.seenDate, article.date),
            };
            const gate = keywordSearchResultPreGate(result, queryConfig, pathConfig);
            if (!gate.keep) {
              filtered.push({ path: pathConfig.id, reason: gate.reason, title: result.title });
              continue;
            }
            items.push(keywordSearchItem(result, queryConfig, pathConfig, { search_intent: "find_market_trend" }));
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
            const newsResults = articles.map((article) => ({
              id: article.url,
              title: article.title || "",
              url: article.url,
              snippet: normalizePublishedAt(article.seendate, article.seenDate, article.date) || article.seendate || "",
              source: article.sourceCommonName || article.domain || "keyword search / GDELT",
              published_at: normalizePublishedAt(article.seendate, article.seenDate, article.date),
            }));
            for (const newsResult of newsResults) {
              const result = {
                id: newsResult.id || newsResult.url,
                title: newsResult.title || "",
                url: newsResult.url,
                snippet: newsResult.snippet || "",
                source: newsResult.source || "keyword search / news provider",
                published_at: newsResult.published_at || "",
              };
              const gate = keywordSearchResultPreGate(result, queryConfig, pathConfig);
              if (!gate.keep) {
                filtered.push({ path: pathConfig.id, reason: gate.reason, title: result.title });
                continue;
              }
              items.push(keywordSearchItem(result, queryConfig, pathConfig, { search_intent: "find_market_trend" }));
            }
          } catch {
            const fallbackQuery = [queryConfig.query, pathConfig.fallbackQuerySuffix || ""].filter(Boolean).join(" ");
            const results = await searchLayeredWeb(fallbackQuery, perPathResultLimit);
            for (const result of results) {
              const gate = keywordSearchResultPreGate(result, queryConfig, pathConfig);
              if (!gate.keep) {
                filtered.push({ path: pathConfig.id, reason: gate.reason, title: result.title });
                continue;
              }
              items.push(keywordSearchItem(result, queryConfig, pathConfig, { search_intent: "find_market_trend" }));
            }
          }
          continue;
        }

        const results = await searchLayeredWeb(query, perPathResultLimit);
        for (const result of results) {
          const gate = keywordSearchResultPreGate(result, queryConfig, pathConfig);
          if (!gate.keep) {
            filtered.push({ path: pathConfig.id, reason: gate.reason, title: result.title });
            continue;
          }
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
  if (filtered.length) {
    const byReason = countBy(filtered, "reason");
    failures.push(`keyword-search pre-gate filtered ${filtered.length} result(s): ${distributionText(byReason)}`);
  }
  if (providerFallbackNotes.length) {
    failures.push(...providerFallbackNotes.splice(0));
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
  const fallbackMediaSuffix = aTierMediaFallbackQuerySuffix;
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
          summary: normalizePublishedAt(article.seendate, article.seenDate, article.date) || article.seendate || "",
          url: article.url,
          source: article.sourceCommonName || article.domain || "GDELT",
          published_at: normalizePublishedAt(article.seendate, article.seenDate, article.date),
          category: "news",
          query_theme: queryConfig.query_theme,
          keyword_group: queryConfig.keyword_group,
        });
      }
    } catch (error) {
      try {
        const fallbackQuery = `${queryConfig.query} ${fallbackMediaSuffix}`;
        const fallbackResults = await searchLayeredWeb(fallbackQuery, 4);
        for (const result of fallbackResults) {
          items.push({
            acquisition_channel: "gdelt",
            original_id: result.id || result.url,
            title: result.title || "",
            summary: (result.snippet || "").slice(0, 300),
            url: result.url || "",
            source: result.source || "GDELT fallback / A-tier media",
            published_at: normalizePublishedAt(result.published_at, result.publishedAt, result.published_date, result.date),
            category: "news",
            query_theme: queryConfig.query_theme,
            keyword_group: queryConfig.keyword_group,
          });
        }
      } catch (fallbackError) {
        failures.push(`GDELT ${queryConfig.query}: ${error.message}; fallback failed: ${fallbackError.message}`);
      }
    }
  }
  return { items, failures };
}

/**
 * Fetch RSS/Atom feeds from source-registry-v2.json sources marked as interface_type=rss.
 * Parses both RSS 2.0 and Atom 1.0 formats.
 */
async function collectRSSFeeds() {
  const allSources = registrySources.filter(
    (s) => s.interface_type === "rss" && s.enabled_default !== false
  );
  const sources = rssSourceLimit > 0 ? allSources.slice(0, rssSourceLimit) : allSources;
  if (!sources.length) return { items: [], failures: [], rss_source_count: 0 };

  const items = [];
  const failures = [];
  const seenUrls = new Set();

  for (const source of sources) {
    const url = source.endpoint_or_url || "";
    if (!url) {
      failures.push(`RSS ${source.source_id}: no endpoint URL`);
      continue;
    }
    try {
      let response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WaveSightRSS/1.0; +https://github.com/jerryfang2023-stack/AI-Radar)",
          "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
        },
        signal: AbortSignal.timeout(fetchTimeoutMs),
      });
      if (!response.ok && ([403, 415, 429].includes(response.status) || response.status >= 500)) {
        const firstStatus = response.status;
        try {
          const fallbackResponse = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; WaveSightRSS/1.0; +https://github.com/jerryfang2023-stack/AI-Radar)",
              "Accept": "*/*",
            },
            signal: AbortSignal.timeout(fetchTimeoutMs),
          });
          if (fallbackResponse.ok) {
            providerFallbackNotes.push(`RSS fallback recovered ${source.source_id} after HTTP ${firstStatus}`);
            response = fallbackResponse;
          } else {
            response = fallbackResponse;
          }
        } catch (fallbackError) {
          failures.push(`RSS ${source.source_id}: HTTP ${firstStatus}; fallback failed: ${fallbackError.message}`);
          continue;
        }
      }
      if (!response.ok) {
        failures.push(`RSS ${source.source_id}: HTTP ${response.status}`);
        continue;
      }
      const xml = await response.text();
      if (!xml || xml.length < 50) {
        failures.push(`RSS ${source.source_id}: empty or too short`);
        continue;
      }

      // Detect format: RSS 2.0 or Atom 1.0. Atom feeds start with <feed tag.
      const isAtom = /<feed[\s>]/i.test(xml);

      if (isAtom) {
        // Atom 1.0 parsing
        const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
        for (const entryXml of entries) {
          try {
            const title = extractXmlField(entryXml, 'title');
            const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"/i);
            const link = linkMatch ? linkMatch[1] : '';
            const summary = extractXmlField(entryXml, 'summary') || extractXmlField(entryXml, 'content');
            const published = extractXmlField(entryXml, 'published') || extractXmlField(entryXml, 'updated');
            const authorName = extractXmlField(entryXml, 'name');
            const id = extractXmlField(entryXml, 'id') || link;

            if (!link && !title) continue;
            const dedupKey = link || id;
            if (seenUrls.has(dedupKey)) continue;
            seenUrls.add(dedupKey);

            items.push({
              acquisition_channel: "rss-feed",
              original_id: id,
              title: (title || "").trim(),
              summary: (summary || "").trim().slice(0, 500),
              url: link,
              source: source.name,
              source_id: source.source_id,
              published_at: normalizePublishedAt(published),
              category: "rss",
              rss_source_name: source.name,
              query_theme: "",
              keyword_group: "",
            });
          } catch (entryError) {
            // skip single entry parse failure
          }
        }
      } else {
        // RSS 2.0 parsing
        const channelTitle = extractXmlField(xml, 'title');
        const itemsXml = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
        for (const itemXml of itemsXml) {
          try {
            const title = extractXmlField(itemXml, 'title');
            const link = extractXmlField(itemXml, 'link');
            const description = extractXmlField(itemXml, 'description');
            const pubDate = extractXmlField(itemXml, 'pubDate');
            const guid = extractXmlField(itemXml, 'guid');
            const author = extractXmlField(itemXml, 'author') || extractXmlField(itemXml, 'dc:creator');

            if (!link && !title) continue;
            const dedupKey = link || guid || title;
            if (seenUrls.has(dedupKey)) continue;
            seenUrls.add(dedupKey);

            items.push({
              acquisition_channel: "rss-feed",
              original_id: guid || link,
              title: (title || "").trim(),
              summary: (description || "").trim().replace(/<[^>]+>/g, "").slice(0, 500),
              url: link,
              source: source.name,
              source_id: source.source_id,
              published_at: normalizePublishedAt(pubDate),
              category: "rss",
              rss_source_name: source.name,
              query_theme: "",
              keyword_group: "",
            });
          } catch (entryError) {
            // skip single item parse failure
          }
        }
      }
    } catch (error) {
      failures.push(`RSS ${source.source_id}: ${error.message}`);
    }
  }

  return { items, failures, rss_source_count: sources.length };
}

/** Extract the text content of an XML element by tag name. */
function extractXmlField(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>(.*?)<\\/${tag}>`, 'is'));
  if (!match) return "";
  return match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
}

const sourceOnlyCollectors = {
  aihot: {
    label: "AI HOT",
    collect: collectAIHot,
  },
  keyword: {
    label: "Keyword / layered search",
    collect: collectKeywordSearch,
  },
  gdelt: {
    label: "GDELT",
    collect: collectGDELT,
  },
  rss: {
    label: "RSS feeds",
    collect: collectRSSFeeds,
  },
};

function sourceRunArtifactItems(items, sourceId) {
  return items.map((item) => ({
    ...item,
    source_artifact_id: sourceId,
  }));
}

function writeSourceOnlyRun(sourceId, sourceLabel, sourceResult, normalizedItems, sourceItems) {
  const sourceRunDir = sourceArtifactDir;
  const jsonPath = path.join(sourceRunDir, `${sourceId}-raw-source-candidates.json`);
  const reportPath = path.join(sourceRunDir, `${sourceId}-raw-source-report.md`);
  const failures = Array.isArray(sourceResult.failures) ? sourceResult.failures : [];
  const rawSourceItems = Array.isArray(sourceItems) ? sourceItems : [];
  const payload = {
    date,
    generated_at: new Date().toISOString(),
    mode: "business_source_raw",
    source_id: sourceId,
    source_label: sourceLabel,
    status: rawSourceItems.length ? "collected" : "empty",
    discovered_count: sourceResult.discovered_count ?? rawSourceItems.length,
    source_item_count: rawSourceItems.length,
    raw_candidate_count: normalizedItems.length,
    failures,
    channel_distribution: countBy(normalizedItems, "acquisition_channel"),
    theme_distribution: countBy(normalizedItems, "theme"),
    keyword_group_distribution: countBy(normalizedItems, "keyword_group"),
    items: sourceRunArtifactItems(rawSourceItems, sourceId),
  };

  const report = [
    `# ${date} Business Source Raw - ${sourceLabel}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- mode: ${payload.mode}`,
    `- source_id: ${sourceId}`,
    `- status: ${payload.status}`,
    `- discovered_count: ${payload.discovered_count}`,
    `- source_item_count: ${payload.source_item_count}`,
    `- raw_candidate_count: ${payload.raw_candidate_count}`,
    `- failures: ${failures.length}`,
    "",
    "## Channel Distribution",
    "",
    distributionText(payload.channel_distribution),
    "",
    "## Theme Distribution",
    "",
    Object.entries(payload.theme_distribution).map(([key, value]) => `- ${themeLabel(key)} (${key || "unknown"}): ${value}`).join("\n") || "- none",
    "",
    "## Failures",
    "",
    failures.map((failure) => `- ${failure}`).join("\n") || "- none",
    "",
    "## Top Candidates",
    "",
    rawSourceItems.slice(0, 30).map((item, index) => {
      const title = item.title || item.url || "untitled";
      return `${index + 1}. ${title} (${item.source || "unknown"})`;
    }).join("\n") || "- none",
    "",
  ].join("\n");

  writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  writeFile(reportPath, report);
  return [rel(jsonPath), rel(reportPath)];
}

function loadSourceArtifactItems() {
  if (!fs.existsSync(sourceArtifactDir)) {
    throw new Error(`Source artifact dir does not exist: ${sourceArtifactDir}`);
  }
  const files = fs.readdirSync(sourceArtifactDir)
    .filter((file) => /-raw-source-candidates\.json$/u.test(file))
    .map((file) => path.join(sourceArtifactDir, file))
    .sort();
  if (!files.length) {
    throw new Error(`No source raw candidate artifacts found in ${sourceArtifactDir}`);
  }

  const items = [];
  const failures = [];
  const sourceRuns = [];
  for (const file of files) {
    const payload = readJson(file, null);
    if (!payload || typeof payload !== "object") {
      failures.push(`source-artifact ${rel(file)}: invalid JSON`);
      continue;
    }
    if (payload.date && payload.date !== date) {
      failures.push(`source-artifact ${rel(file)}: date ${payload.date} does not match run date ${date}`);
      continue;
    }
    const sourceId = payload.source_id || path.basename(file).replace(/-raw-source-candidates\.json$/u, "");
    const sourceItems = Array.isArray(payload.items) ? payload.items : [];
    sourceRuns.push({
      source_id: sourceId,
      source_label: payload.source_label || sourceId,
      raw_candidate_count: Number(payload.raw_candidate_count) || sourceItems.length,
      source_item_count: Number(payload.source_item_count) || sourceItems.length,
      artifact_path: rel(file),
      status: payload.status || "unknown",
    });
    for (const item of sourceItems) {
      items.push({
        ...item,
        source_artifact_id: sourceId,
        source_artifact_label: payload.source_label || sourceId,
        source_artifact_path: rel(file),
      });
    }
    for (const failure of Array.isArray(payload.failures) ? payload.failures : []) {
      failures.push(`source-artifact ${sourceId}: ${failure}`);
    }
  }

  return {
    items,
    failures,
    files: files.map(rel),
    sourceRuns,
  };
}

async function runSourceOnly() {
  const collector = sourceOnlyCollectors[sourceOnlyMode];
  if (!collector) {
    const allowed = Object.keys(sourceOnlyCollectors).join("|");
    throw new Error(`Unknown --source-only=${sourceOnlyMode || "empty"}; expected ${allowed}`);
  }

  const sourceResult = await collector.collect();
  const sourceItems = Array.isArray(sourceResult.items) ? sourceResult.items : [];
  const normalizedItems = normalize(sourceItems);
  const outputs = dryRun ? [] : writeSourceOnlyRun(sourceOnlyMode, collector.label, sourceResult, normalizedItems, sourceItems);
  console.log(
    JSON.stringify(
      {
        date,
        mode: "business_source_raw",
        source_id: sourceOnlyMode,
        source_label: collector.label,
        status: sourceItems.length ? "collected" : "empty",
        discovered_count: sourceResult.discovered_count ?? sourceItems.length,
        source_item_count: sourceItems.length,
        raw_candidate_count: normalizedItems.length,
        failures: sourceResult.failures || [],
        outputs,
      },
      null,
      2
    )
  );
}

const targetedRefillQueriesByImportance = {
  important_case: [
    `enterprise AI agent customer story deployment announced ${date.slice(0, 4)}`,
    `AI platform case study production rollout customer ${date.slice(0, 4)}`,
    `enterprise AI agent customer adopts production rollout case study ${date.slice(0, 4)}`,
    `AI agent pilot customer production rollout case study ${date.slice(0, 4)}`,
  ],
  important_funding: [
    `AI agent startup raises seed Series A funding ${date.slice(0, 4)}`,
    `vertical AI startup funding enterprise agents announced ${date.slice(0, 4)}`,
    `AI workflow automation startup raises venture funding ${date.slice(0, 4)}`,
  ],
  important_product_or_service: [
    `AI agent product launch enterprise workflow platform announced ${date.slice(0, 4)}`,
    `AI coding agent API SDK release enterprise product update ${date.slice(0, 4)}`,
    `AI platform launches agent workflow automation service ${date.slice(0, 4)}`,
  ],
  important_vertical_solution: [
    `vertical AI solution customer deployment healthcare finance manufacturing ${date.slice(0, 4)}`,
    `AI agent vertical SaaS customer workflow deployment case ${date.slice(0, 4)}`,
    `enterprise AI deployment industry workflow customer story ${date.slice(0, 4)}`,
  ],
};

const targetedRefillPathByImportance = {
  important_case: "official_original",
  important_funding: "capital_startup",
  important_product_or_service: "official_original",
  important_vertical_solution: "industry_landing",
};

const targetedCoreRefillImportanceOrder = [
  "important_case",
  "important_funding",
  "important_vertical_solution",
  "important_product_or_service",
];

function keywordPathById(id) {
  return keywordSearchPaths.find((pathConfig) => pathConfig.id === id) || keywordSearchPaths[0];
}

function coreSupplyGaps(items) {
  const poolItems = selectMonitorPoolItems(items);
  const metas = poolItems.map(poolCandidateMeta);
  const coreMetas = metas.filter((meta) => meta.isCore);
  const routedMetas = metas.filter((meta) => meta.isRouted);
  const nonLargeCoreMetas = coreMetas.filter((meta) => !meta.isLargeVendor);
  return {
    coreCount: coreMetas.length,
    routedCount: routedMetas.length,
    nonLargeCoreCount: nonLargeCoreMetas.length,
    gaps: [
      routedMetas.length < routedPoolMinTarget ? `routed_pool=${routedMetas.length}/${routedPoolMinTarget}` : "",
      coreMetas.length < corePoolMinTarget ? `core_pool=${coreMetas.length}/${corePoolMinTarget}` : "",
      nonLargeCoreMetas.length < coreNonLargeVendorMinTarget ? `core_non_large=${nonLargeCoreMetas.length}/${coreNonLargeVendorMinTarget}` : "",
    ].filter(Boolean),
  };
}

function refillRequestsForPoolState(poolGaps, supplyGaps) {
  if (poolGaps.length) return poolGaps;
  if (!supplyGaps.gaps.length) return [];
  const needed = Math.max(
    routedPoolMinTarget - supplyGaps.routedCount,
    corePoolMinTarget - supplyGaps.coreCount,
    coreNonLargeVendorMinTarget - supplyGaps.nonLargeCoreCount,
    1
  );
  return targetedCoreRefillImportanceOrder.map((importanceType) => ({
    importanceType,
    count: 0,
    min: Math.min(needed, 3),
  }));
}

async function collectTargetedImportanceRefill(poolGaps, existingItems = []) {
  const items = [];
  const failures = [];
  const filtered = [];
  const seen = new Set(existingItems.map(poolKeyFor));
  for (const gap of poolGaps) {
    const importanceType = gap.importanceType || "";
    const needed = Math.max(1, Number(gap.min || 0) - Number(gap.count || 0));
    const pathConfig = keywordPathById(targetedRefillPathByImportance[importanceType]);
    const queries = targetedRefillQueriesByImportance[importanceType] || [];
    for (const baseQuery of queries.slice(0, Math.min(queries.length, Math.max(needed, 1)))) {
      const query = [baseQuery, pathConfig.fallbackQuerySuffix || pathConfig.querySuffix || ""].filter(Boolean).join(" ");
      const queryConfig = {
        query: baseQuery,
        query_theme: "targeted-pool-gap-refill",
        keyword_group: "targeted-pool-gap-refill",
      };
      try {
        const results = await searchLayeredWeb(query, Math.min(Math.max(needed + 3, 4), 8));
        for (const result of results) {
          const key = result.url || `${result.title}-${result.source}`;
          if (seen.has(key)) continue;
          const gate = keywordSearchResultPreGate(result, queryConfig, pathConfig);
          if (!gate.keep) {
            filtered.push({ path: pathConfig.id, reason: gate.reason, title: result.title });
            continue;
          }
          seen.add(key);
          items.push(keywordSearchItem(result, queryConfig, pathConfig, { search_intent: inferSearchIntent(baseQuery) }));
        }
      } catch (error) {
        failures.push(`targeted-refill ${importanceType} ${baseQuery}: ${error.message}`);
      }
    }
  }
  if (filtered.length) {
    failures.push(`targeted-refill pre-gate filtered ${filtered.length} result(s): ${distributionText(countBy(filtered, "reason"))}`);
  }
  return { items, failures };
}

async function refillPoolImportanceGaps(items, failures) {
  let current = items;
  const normalizeRefillItems = async (refillItems) => {
    const beforePreFetchRemoved = historicalDedupePreFetchRemoved;
    const beforePostFetchRemoved = historicalDedupePostFetchRemoved;
    const normalizedRefill = normalize(refillItems);
    historicalDedupePreFetchRemoved = beforePreFetchRemoved;
    const enrichedRefill = dryRun
      ? normalizedRefill
      : prioritizeAfterFetch(filterHistoricalDuplicatesAfterFetch(await enrichSnapshots(normalizedRefill)));
    historicalDedupePostFetchRemoved = beforePostFetchRemoved;
    return enrichedRefill;
  };
  const appendUnique = (baseItems, nextItems) => {
    const seen = new Set(baseItems.map(poolKeyFor));
    const added = [];
    for (const item of nextItems) {
      const key = poolKeyFor(item);
      if (seen.has(key)) continue;
      seen.add(key);
      added.push(item);
    }
    return { added, current: prioritizeAfterFetch([...baseItems, ...added]) };
  };
  for (let cycle = 1; cycle <= 3; cycle += 1) {
    const poolGaps = importanceCoverageGaps(selectMonitorPoolItems(current), "pool");
    const supplyGaps = coreSupplyGaps(current);
    const refillRequests = refillRequestsForPoolState(poolGaps, supplyGaps);
    if (!refillRequests.length) break;
    const refill = await collectTargetedImportanceRefill(refillRequests, current);
    failures.push(...refill.failures);
    const gapText = [
      coverageGapText(poolGaps),
      supplyGaps.gaps.length ? supplyGaps.gaps.join("; ") : "",
    ].filter((part) => part && part !== "none").join("; ") || "none";
    if (!refill.items.length) {
      failures.push(`targeted pool/core refill cycle ${cycle} returned 0 usable result(s) for ${gapText}`);
      break;
    }
    const enrichedRefill = await normalizeRefillItems(refill.items);
    const result = appendUnique(current, enrichedRefill);
    const added = result.added;
    current = result.current;
    failures.push(`targeted pool/core refill cycle ${cycle} added ${added.length} item(s) for ${gapText}`);
    if (!added.length) break;
  }
  for (let cycle = 1; current.length < rawMinTarget && cycle <= 2; cycle += 1) {
    const needed = rawMinTarget - current.length;
    const perLane = Math.max(1, Math.ceil(needed / targetedCoreRefillImportanceOrder.length));
    const refillRequests = targetedCoreRefillImportanceOrder.map((importanceType) => ({
      importanceType,
      count: 0,
      min: perLane,
    }));
    const refill = await collectTargetedImportanceRefill(refillRequests, current);
    failures.push(...refill.failures);
    if (!refill.items.length) {
      failures.push(`targeted raw-volume refill cycle ${cycle} returned 0 usable result(s) for raw_count=${current.length}/${rawMinTarget}`);
      break;
    }
    const enrichedRefill = await normalizeRefillItems(refill.items);
    const result = appendUnique(current, enrichedRefill);
    const added = result.added;
    current = result.current;
    failures.push(`targeted raw-volume refill cycle ${cycle} added ${added.length} item(s) for raw_count=${current.length}/${rawMinTarget}`);
    if (!added.length) break;
  }
  return current;
}

function normalize(items) {
  const prepared = items
    .filter((item) => item.title || item.url)
    .filter((item) => shouldIncludeInRawCandidates(item))
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
        ...normalizeDeveloperKeywordGroup(themed),
      };
    });
  const historicallyUnique = filterHistoricalDuplicatesBeforeRaw(prepared);
  const normalized = dedupeSearchItems(historicallyUnique)
    .map((item) => ({ ...item, score: score(item) }))
    .sort((a, b) => b.score - a.score);

  const picked = [];
  const pickedKeys = new Set();
  const dailySelectedCount = normalized.filter(isAIHotDailySelected).length;
  const baseTarget = rawTargetOverride
    ? Math.min(Math.max(rawTargetOverride, dailySelectedCount), normalized.length)
    : Math.min(Math.max(rawMinTarget, dailySelectedCount), rawMaxTarget, normalized.length);
  const target = rawTargetOverride
    ? baseTarget
    : Math.min(Math.max(baseTarget + rawDedupeBuffer, baseTarget), rawMaxTarget, normalized.length);

  const pushUnique = (item) => {
    const key = item.url || `${item.title}-${item.source}`;
    if (pickedKeys.has(key)) return false;
    picked.push(item);
    pickedKeys.add(key);
    return true;
  };

  const peerChannels = ["gdelt", "keyword-search", "rss-feed", "aihot"];
  const peerBuckets = new Map(peerChannels.map((channel) => [
    channel,
    normalized.filter((entry) => entry.acquisition_channel === channel),
  ]));
  let peerProgress = true;
  while (picked.length < target && peerProgress) {
    peerProgress = false;
    for (const channel of peerChannels) {
      if (picked.length >= target) break;
      const bucket = peerBuckets.get(channel) || [];
      while (bucket.length) {
        const item = bucket.shift();
        if (pushUnique(item)) {
          peerProgress = true;
          break;
        }
      }
    }
  }

  let hnPicked = 0;
  for (const item of normalized.filter((entry) => entry.acquisition_channel === "hn")) {
    if (picked.length >= target || hnPicked >= Math.min(hnTarget, 8)) break;
    if (pushUnique(item)) hnPicked += 1;
  }

  for (const item of normalized) {
    if (picked.length >= target) break;
    pushUnique(item);
  }

  return diversifyByTheme(picked.sort((a, b) => b.score - a.score));
}

function isXSourceItem(item = {}) {
  const haystack = `${item.url || ""} ${item.source || ""} ${item.source_url || ""}`.toLowerCase();
  return /\bx\.com\b|\btwitter\.com\b/u.test(haystack) || /(^|[\/\s])x([\/\s]|$)/u.test(haystack);
}

const poolKeyFor = (item) => item.url || `${item.title}-${item.source}`;

function isLargeVendorPoolItem(item = {}) {
  const text = [
    item.title,
    item.source,
    item.url,
    item.search_path_label,
  ].join(" ");
  return /\b(Google|Microsoft|Anthropic|OpenAI|NVIDIA|Nvidia|Oracle|AWS|Amazon|Meta|Apple|IBM|Salesforce|DeepMind|Claude|Gemini|Copilot|ChatGPT|GitHub)\b|谷歌|微软|英伟达|亚马逊|甲骨文/iu.test(text);
}

function poolCandidateMeta(item) {
  const snapshotText = item.snapshot?.text || item.summary || "";
  const quality = extractionQuality(item.snapshot);
  const excerpts = structuredKeyExcerpts(item, snapshotText);
  const elements = extractBusinessElements(item, snapshotText);
  const seed = evidenceSeed(item, elements, excerpts);
  const scores = guanlanScores(item, quality, elements, seed);
  const usable = usableFor(item, quality, scores, excerpts);
  const routes = poolRoutesFor(item, quality, scores, usable, excerpts);
  const capturePriority = Number(item.raw_capture_priority ?? rawCapturePriority(item)) || 0;
  const itemScore = Number(item.score) || 0;
  const importanceScore = Number(scores.importance_score) || 0;
  return {
    item,
    key: poolKeyFor(item),
    routes,
    scores,
    importanceType: scores.importance_type || "none",
    isCore: routes.includes("core_pool"),
    isRouted: routes.some((route) => ["core_pool", "emerging_pool", "user_feedback_pool", "watchlist"].includes(route)),
    isLargeVendor: isLargeVendorPoolItem(item),
    sortScore: importanceScore * 20 + capturePriority + itemScore,
  };
}

function qualifiesForMonitorPool(item) {
  if (isAIHotDailySelected(item)) return true;
  const routes = poolCandidateMeta(item).routes;
  return routes.some((route) => ["core_pool", "emerging_pool", "user_feedback_pool", "watchlist"].includes(route));
}

function selectMonitorPoolItems(items) {
  const metas = items.map(poolCandidateMeta);
  const selected = [];
  const selectedKeys = new Set();
  const coreLaneCounts = new Map();
  let coreLargeVendorCount = 0;
  let coreNonLargeVendorCount = 0;

  const poolTarget = Math.min(
    items.length,
    Math.max(
      poolMinTarget + poolSelectionBufferTarget,
      routedPoolMinTarget + Math.max(poolSelectionBufferTarget, metas.filter((meta) => isAIHotDailySelected(meta.item)).length)
    )
  );
  const sorted = [...metas].sort((a, b) => b.sortScore - a.sortScore || a.key.localeCompare(b.key));

  function canAdd(meta, options = {}) {
    if (selectedKeys.has(meta.key)) return false;
    if (options.requireCore && !meta.isCore) return false;
    if (options.requireRouted && !meta.isRouted) return false;
    if (options.requireLargeVendor === true && !meta.isLargeVendor) return false;
    if (options.requireLargeVendor === false && meta.isLargeVendor) return false;
    if (options.enforceCoreLargeVendorCap && meta.isCore && meta.isLargeVendor && coreLargeVendorCount >= coreLargeVendorMaxTarget) return false;
    if (options.enforceCoreLaneCap && meta.isCore) {
      const laneCount = coreLaneCounts.get(meta.importanceType) || 0;
      if (laneCount >= corePoolMaxPerImportanceType) return false;
    }
    return true;
  }

  function add(meta, options = {}) {
    const demoteCore =
      options.demoteCore === true ||
      (meta.isCore && meta.isLargeVendor && coreLargeVendorCount >= coreLargeVendorMaxTarget);
    if (demoteCore) meta.item.force_non_core_pool = true;
    const countsAsCore = meta.isCore && !demoteCore;
    selected.push(meta);
    selectedKeys.add(meta.key);
    if (countsAsCore) {
      coreLaneCounts.set(meta.importanceType, (coreLaneCounts.get(meta.importanceType) || 0) + 1);
      if (meta.isLargeVendor) coreLargeVendorCount += 1;
      else coreNonLargeVendorCount += 1;
    }
  }

  function pick(options, targetCount) {
    for (const meta of sorted) {
      if (selected.length >= poolTarget) break;
      if (targetCount !== undefined && targetCount <= 0) break;
      if (!canAdd(meta, options)) continue;
      add(meta);
      if (targetCount !== undefined) targetCount -= 1;
    }
  }

  const coreSelectedCount = () => [...coreLaneCounts.values()].reduce((sum, count) => sum + count, 0);
  const selectedImportanceCount = (importanceType) =>
    selected.filter((meta) => meta.importanceType === importanceType).length;

  function pickRequiredImportanceCoverage() {
    const minPool = Number(keywordMonitoring.policy?.pool_min_per_required_importance_type ?? 0);
    if (!minPool) return;
    for (const importanceType of requiredImportanceTypes()) {
      let needed = minPool - selectedImportanceCount(importanceType);
      if (needed <= 0) continue;
      for (const meta of sorted) {
        if (selected.length >= poolTarget || needed <= 0) break;
        if (meta.importanceType !== importanceType) continue;
        if (!canAdd(meta, { requireRouted: true, enforceCoreLargeVendorCap: true })) continue;
        add(meta);
        needed -= 1;
      }
    }
  }

  for (const meta of metas.filter((entry) => isAIHotDailySelected(entry.item))) {
    if (selectedKeys.has(meta.key)) continue;
    const demoteCore = meta.isCore && meta.isLargeVendor && coreLargeVendorCount >= coreLargeVendorMaxTarget;
    add(meta, { demoteCore });
  }

  pickRequiredImportanceCoverage();
  pick({ requireCore: true, requireLargeVendor: false, enforceCoreLaneCap: true }, Math.max(0, coreNonLargeVendorMinTarget - coreNonLargeVendorCount));
  if (coreNonLargeVendorCount < coreNonLargeVendorMinTarget) {
    pick({ requireCore: true, requireLargeVendor: false }, Math.max(0, coreNonLargeVendorMinTarget - coreNonLargeVendorCount));
  }
  pick({ requireCore: true, requireLargeVendor: true, enforceCoreLargeVendorCap: true, enforceCoreLaneCap: true }, Math.max(0, coreLargeVendorMaxTarget - coreLargeVendorCount));
  pick({ requireCore: true, enforceCoreLargeVendorCap: true, enforceCoreLaneCap: true }, Math.max(0, corePoolMinTarget - coreSelectedCount()));
  pick({ requireCore: true, enforceCoreLargeVendorCap: true }, Math.max(0, corePoolMinTarget - coreSelectedCount()));
  pick({ requireRouted: true }, Math.max(0, routedPoolMinTarget - selected.filter((meta) => meta.isRouted).length));
  pick({}, Math.max(0, poolTarget - selected.length));

  return selected.slice(0, poolTarget).map((meta) => meta.item);
}

function makeRawFiles(items, failures, runMeta = {}) {
  resetGeneratedDir(originalDir, path.join(rawDir, "originals"));
  const poolItemsPre = selectMonitorPoolItems(items);
  const poolKeySet = new Set(poolItemsPre.map(poolKeyFor));
  const poolImportanceGaps = importanceCoverageGaps(poolItemsPre, "pool");
  const rawLines = [
    "---",
    `date: ${date}`,
    "stage: raw",
    "status: guanlan-daily-monitor-collected",
    `raw_count: ${items.length}`,
    `aihot_mode: ${runMeta.aihot_mode || aihotMode}`,
    `aihot_since: ${JSON.stringify(runMeta.aihot_since || "")}`,
    `aihot_discovered_count: ${runMeta.aihot_discovered_count ?? "unknown"}`,
    `aihot_daily_discovered_count: ${runMeta.aihot_daily_discovered_count ?? "unknown"}`,
    `aihot_all_discovered_count: ${runMeta.aihot_all_discovered_count ?? "unknown"}`,
    `aihot_daily_included_count: ${runMeta.aihot_daily_included_count ?? "unknown"}`,
    "aihot_daily_pool_policy: full_daily_selected_to_pool_index",
    `aihot_rejected_by_raw_entry_rules: ${runMeta.aihot_rejected_count ?? "unknown"}`,
    `external_search_activated: ${runMeta.search_activated ? "true" : "false"}`,
    `source_artifacts_used: ${runMeta.source_artifacts_used ? "true" : "false"}`,
    `source_artifact_files: ${Array.isArray(runMeta.source_artifact_files) ? runMeta.source_artifact_files.join(", ") : ""}`,
    `historical_dedupe_enabled: ${runMeta.historical_dedupe_enabled ? "true" : "false"}`,
    `historical_raw_records_checked: ${runMeta.historical_raw_records_checked ?? 0}`,
    `historical_duplicates_removed_before_fetch: ${runMeta.historical_duplicates_removed_before_fetch ?? 0}`,
    `historical_duplicates_removed_after_fetch: ${runMeta.historical_duplicates_removed_after_fetch ?? 0}`,
    `raw_dedupe_buffer: ${rawDedupeBuffer}`,
    `aihot_count: ${items.filter((item) => item.acquisition_channel === "aihot").length}`,
    `keyword_search_count: ${items.filter((item) => item.acquisition_channel === "keyword-search").length}`,
    `social_discovery_count: ${items.filter(isSocialDiscoverySource).length}`,
    `keyword_monitoring_config: ${rel(keywordMonitoringPath)}`,
    `source_registry_config: ${rel(sourceRegistryPath)}`,
    `pool_target: ${poolMinTarget}`,
    `pool_selection_buffer: ${poolSelectionBufferTarget}`,
    `routed_pool_target: ${routedPoolMinTarget}`,
    `core_pool_target: ${corePoolMinTarget}`,
    `core_non_large_vendor_target: ${coreNonLargeVendorMinTarget}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} Raw Candidates`,
    "",
    "说明：本文件由 `agent-workflow/tools/run-guanlan-daily-monitor.mjs` 生成。默认采用 Raw-first 策略：AI HOT、RSS、关键词搜索和 GDELT 作为发现入口，关键词规则补齐海外大厂、垂直赛道、融资、客户采用和行业落地缺口；HN / 社区只作为反馈补充。所有 discovery 入口进入 Business Signals 前必须回到原始 URL，保存全文或当时可见文本，并重新判定页面类型与事件证据。",
    "",
  ];

  items.forEach((item, index) => {
    const id = `R-${String(index + 1).padStart(3, "0")}`;
    const originalName = `${id.toLowerCase()}-${slugify(item.title)}.md`;
    const originalPath = path.join(originalDir, originalName);
    const jsonPath = path.join(originalDir, `${originalName.replace(/\.md$/u, "")}.json`);
    const isPooled = poolKeySet.has(poolKeyFor(item));
    const record = buildRawRecord(item, id, originalPath, jsonPath, isPooled);
    item.raw_id = id;
    item.raw_archive_path = rel(originalPath);
    item.raw_json_path = rel(jsonPath);
    item.raw_record = record;
    item.extraction_quality = record.extraction_quality;
    item.has_full_text = record.has_full_text;
    item.raw_status = record.raw_status;
    const reason = item.score >= 6
      ? "高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。"
      : "中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。";
    rawLines.push(
      `### ${id}｜${item.title}`,
      "",
      `- 原文档案：\`${rel(originalPath)}\``,
      `- 出处：${item.source}｜${item.url || "no-url"}`,
      `- 采集通道：${item.acquisition_channel}`,
      `- 搜索意图：${record.search_intent || "not_applicable"}`,
      `- 搜索路径：${record.search_path || "not_applicable"}`,
      `- 来源类型：${item.source_type}`,
      `- 追溯标签：${item.source_level}`,
      `- evidence_object_type: ${record.evidence_object_type}`,
      `- evidence_object_usable: ${record.evidence_object_usable}`,
      `- event_evidence: ${record.event_evidence}`,
      `- index_only_evidence: ${record.index_only_evidence}`,
      `- raw_qc_decision: ${record.raw_qc_decision}`,
      `- evidence_completeness: full_text=${record.evidence_completeness.full_text_status}; snapshot=${record.evidence_completeness.snapshot_status}; hash=${record.evidence_completeness.hash_status}; excerpt=${record.evidence_completeness.excerpt_status}`,
      `- degradation_reasons: ${record.degradation_reasons.join("；") || "none"}`,
      `- 采集入口标记：${record.acquisition_source_level || "not_applicable"}`,
      `- research_status：${record.research_status}`,
      `- 主题分类：${themeLabel(item.theme)}`,
      `- 关键词组：${item.keyword_group || "unknown"}`,
      `- 发布时间：${item.published_at || "unknown"}`,
      `- 分类：${item.category || "unknown"}`,
      `- 采集理由：${reason}`,
      `- importance_type: ${record.guanlan_scores.importance_type}`,
      `- importance_score: ${record.guanlan_scores.importance_score}`,
      `- supporting_signals: ${(record.guanlan_scores.supporting_signals || []).join(", ") || "none"}`,
      `- 本地快照：${record.fetch_status}｜quality=${record.extraction_quality}｜has_full_text=${record.has_full_text}｜hash=${record.content_hash}`,
      `- 原文抓取优先级：${item.raw_capture_priority ?? "not-ranked"}`,
      `- Raw 状态：${record.raw_status}`,
      `- Pool 分流：${record.pool_routes.join(", ")}`,
      `- 证据对象门禁：${record.evidence_eligibility}${record.evidence_block_reason ? `｜${record.evidence_block_reason}` : ""}`,
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
      `source_level_role: ${record.source_level_role}`,
      `evidence_object_type: ${record.evidence_object_type}`,
      `evidence_object_usable: ${record.evidence_object_usable}`,
      `event_evidence: ${record.event_evidence}`,
      `index_only_evidence: ${record.index_only_evidence}`,
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
      `extraction_method: ${JSON.stringify(record.extraction_method)}`,
      `readability_score: ${record.readability_score}`,
      `extractor_diagnostics: ${JSON.stringify(record.extractor_diagnostics)}`,
      `has_full_text: ${record.has_full_text}`,
      `content_length: ${record.content_length}`,
      `fetch_error: ${JSON.stringify(record.fetch_error)}`,
      `raw_qc_decision: ${record.raw_qc_decision}`,
      `raw_qc_downstream_use: ${record.raw_qc_downstream_use}`,
      `degradation_reasons: ${JSON.stringify(record.degradation_reasons)}`,
      `evidence_completeness: ${JSON.stringify(record.evidence_completeness)}`,
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
      `change_action_detected: ${record.change_action_detected}`,
      `evidence_eligibility: ${record.evidence_eligibility}`,
      `evidence_block_reason: ${JSON.stringify(record.evidence_block_reason)}`,
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
      "## extraction_diagnostics",
      "",
      `- extraction_method: ${record.extraction_method || "unknown"}`,
      `- readability_score: ${record.readability_score ?? 0}`,
      `- fetch_status: ${record.fetch_status || "unknown"}`,
      `- extraction_quality: ${record.extraction_quality || "unknown"}`,
      `- diagnostics: ${JSON.stringify(record.extractor_diagnostics)}`,
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
      `该条目由 ${item.acquisition_channel} 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。`,
      "",
    ].join("\n");
    writeFile(originalPath, original);
    writeFile(jsonPath, `${JSON.stringify(record, null, 2)}\n`);
  });

  writeFile(path.join(rawDir, `${date}-raw-candidates.md`), rawLines.join("\n"));

  const poolItems = items.filter((item) => poolKeySet.has(poolKeyFor(item)));
  const aihotDailyPoolCount = poolItems.filter(isAIHotDailySelected).length;
  const poolLines = [
    "---",
    `date: ${date}`,
    "stage: pool",
    "status: guanlan-daily-monitor-pool",
    `pool_count: ${poolItems.length}`,
    `aihot_daily_pool_count: ${aihotDailyPoolCount}`,
    `pool_target: ${poolMinTarget}`,
    `routed_pool_target: ${routedPoolMinTarget}`,
    `core_pool_target: ${corePoolMinTarget}`,
    `core_non_large_vendor_target: ${coreNonLargeVendorMinTarget}`,
    `historical_dedupe_enabled: ${runMeta.historical_dedupe_enabled ? "true" : "false"}`,
    `historical_raw_records_checked: ${runMeta.historical_raw_records_checked ?? 0}`,
    `historical_duplicates_removed_before_fetch: ${runMeta.historical_duplicates_removed_before_fetch ?? 0}`,
    `historical_duplicates_removed_after_fetch: ${runMeta.historical_duplicates_removed_after_fetch ?? 0}`,
    `generated_at: ${new Date().toISOString()}`,
    `keyword_monitoring_config: ${rel(keywordMonitoringPath)}`,
    "---",
    "",
    `# ${date} Pool Candidates`,
    "",
    "说明：本文件是 Raw 后的候选索引，供 Business Signals 资产链回看 Raw 全文后继续加工。Pool 不替代 Raw，也不直接等于商业信号 Card、关系图输入或趋势候选结论。",
    "",
  ];
  poolItems.forEach((item, index) => {
    const id = `P-${String(index + 1).padStart(3, "0")}`;
    const routes = item.raw_record?.pool_routes || [];
    const keepReason = routes.includes("core_pool")
      ? "全文、原始证据和商业变化同时达标，可作为后续资产加工的核心条目。"
      : "具备早期变化、用户反馈或观察价值，但进入前台判断前仍需补足原文、页面类型和事件证据。";
    const rejectRisk = isCommunitySource(item)
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
      `- source_level_role: ${item.raw_record?.source_level_role || "traceability_only_not_value_score_or_core_gate"}`,
      `- evidence_object_type: ${item.raw_record?.evidence_object_type || "unknown"}`,
      `- evidence_object_usable: ${item.raw_record?.evidence_object_usable || false}`,
      `- event_evidence: ${item.raw_record?.event_evidence || false}`,
      `- index_only_evidence: ${item.raw_record?.index_only_evidence || false}`,
      `- raw_qc_decision: ${item.raw_record?.raw_qc_decision || "block"}`,
      `- raw_qc_downstream_use: ${item.raw_record?.raw_qc_downstream_use || "not_allowed"}`,
      `- acquisition_source_level: ${item.raw_record?.acquisition_source_level || "not_applicable"}`,
      `- research_status: ${item.raw_record?.research_status || "not_research"}`,
      `- local_snapshot_status: ${item.raw_record?.fetch_status || item.snapshot?.status || "not-attempted"}`,
      `- extraction_quality: ${item.raw_record?.extraction_quality || "unknown"}`,
      `- extraction_method: ${item.raw_record?.extraction_method || "unknown"}`,
      `- readability_score: ${item.raw_record?.readability_score ?? 0}`,
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
      `- evidence_completeness: ${JSON.stringify(item.raw_record?.evidence_completeness || {})}`,
      `- degradation_reasons: ${(item.raw_record?.degradation_reasons || []).join("；") || "none"}`,
      `- importance_type: ${item.raw_record?.guanlan_scores?.importance_type || "none"}`,
      `- importance_score: ${item.raw_record?.guanlan_scores?.importance_score || 1}`,
      `- supporting_signals: ${(item.raw_record?.guanlan_scores?.supporting_signals || []).join(", ") || "none"}`,
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

  const distribution = countBy(items, "acquisition_channel");
  const byType = countBy(items, "source_type");
  const byLevel = countBy(items, "source_level");
  const byEvidenceObjectType = items.reduce((acc, item) => {
    const key = item.raw_record?.evidence_object_type || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const byTheme = countBy(items, "theme");
  const byKeywordGroup = countBy(items, "keyword_group");
  const bySearchPath = countBy(items.filter((item) => item.acquisition_channel === "keyword-search"), "search_path");
  const bySearchIntent = countBy(items.filter((item) => item.acquisition_channel === "keyword-search"), "search_intent");
  const enterpriseAiTransformationItems = items.filter((item) =>
    item.enterprise_ai_transformation_lens || item.raw_record?.enterprise_ai_transformation_lens
  );
  const byEnterpriseAiTransformationStage = countBy(
    enterpriseAiTransformationItems.map((item) => ({
      stage: item.enterprise_ai_transformation_stage || item.raw_record?.enterprise_ai_transformation_stage || "unspecified",
    })),
    "stage"
  );
  const keywordNonCommunity = items.filter((item) => item.acquisition_channel === "keyword-search" && item.search_path && item.search_path !== "community_feedback").length;
  const byPoolRoute = items.reduce((acc, item) => {
    const routes = item.raw_record?.pool_routes?.length ? item.raw_record.pool_routes : ["index_only"];
    for (const route of routes) acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {});
  const byPoolIndexRoute = poolItems.reduce((acc, item) => {
    const routes = item.raw_record?.pool_routes?.length ? item.raw_record.pool_routes : ["index_only"];
    for (const route of routes) acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {});
  const routedPoolCount = poolItems.filter((item) => {
    const routes = item.raw_record?.pool_routes || ["index_only"];
    return routes.some((route) => ["core_pool", "emerging_pool", "user_feedback_pool", "watchlist"].includes(route));
  }).length;
  const aihotIndexOnlyCount = poolItems.filter((item) => isAIHotDailySelected(item) && (item.raw_record?.pool_routes || []).includes("index_only")).length;
  const aihotCoreCount = poolItems.filter((item) => isAIHotDailySelected(item) && (item.raw_record?.pool_routes || []).includes("core_pool")).length;
  const bySnapshotStatus = items.reduce((acc, item) => {
    const key = item.snapshot?.status || "not-attempted";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const log = [
    `# ${date} Guanlan Daily Monitor Log`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- raw_count: ${items.length}`,
    `- aihot_mode: ${runMeta.aihot_mode || aihotMode}`,
    `- aihot_since: ${runMeta.aihot_since || ""}`,
    `- aihot_discovered_count: ${runMeta.aihot_discovered_count ?? "unknown"}`,
    `- aihot_daily_discovered_count: ${runMeta.aihot_daily_discovered_count ?? "unknown"}`,
    `- aihot_all_discovered_count: ${runMeta.aihot_all_discovered_count ?? "unknown"}`,
    `- aihot_daily_included_count: ${runMeta.aihot_daily_included_count ?? "unknown"}`,
    `- aihot_daily_pool_count: ${aihotDailyPoolCount}`,
    "- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.",
    `- aihot_rejected_by_raw_entry_rules: ${runMeta.aihot_rejected_count ?? "unknown"}`,
    `- external_search_activated: ${runMeta.search_activated ? "true" : "false"}`,
    `- historical_dedupe_enabled: ${runMeta.historical_dedupe_enabled ? "true" : "false"}`,
    `- historical_raw_records_checked: ${runMeta.historical_raw_records_checked ?? 0}`,
    `- historical_duplicates_removed_before_fetch: ${runMeta.historical_duplicates_removed_before_fetch ?? 0}`,
    `- historical_duplicates_removed_after_fetch: ${runMeta.historical_duplicates_removed_after_fetch ?? 0}`,
    `- raw_dedupe_buffer: ${rawDedupeBuffer}`,
    `- aihot_count: ${items.filter((item) => item.acquisition_channel === "aihot").length}`,
    `- keyword_search_count: ${items.filter((item) => item.acquisition_channel === "keyword-search").length}`,
    `- keyword_search_non_community_count: ${keywordNonCommunity}`,
    `- keyword_search_path_distribution: ${distributionText(bySearchPath)}`,
    `- keyword_search_intent_distribution: ${distributionText(bySearchIntent)}`,    `- source_distribution: ${distributionText(distribution)}`,
    "- enterprise_ai_transformation_column: 企业AI化",
    `- enterprise_ai_transformation_candidate_count: ${enterpriseAiTransformationItems.length}`,
    `- enterprise_ai_transformation_stage_distribution: ${distributionText(byEnterpriseAiTransformationStage)}`,
    "- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.",
    `- raw_count_by_channel: ${distributionText(distribution)}`,
    `- keyword_monitoring_config: ${rel(keywordMonitoringPath)}`,
    `- keyword_group_distribution: ${distributionText(byKeywordGroup)}`,
    `- theme_distribution: ${distributionText(byTheme)}`,
    `- theme_concentration_warning: ${themeConcentrationWarning(items)}`,
    `- evidence_object_type_distribution: ${distributionText(byEvidenceObjectType)}`,
    `- pool_route_distribution: ${distributionText(byPoolRoute)}`,
    `- pool_index_route_distribution: ${distributionText(byPoolIndexRoute)}`,
    `- pool_index_count: ${poolItems.length}`,
    `- pool_target: ${poolMinTarget}`,
    `- pool_selection_buffer: ${poolSelectionBufferTarget}`,
    `- routed_pool_count: ${routedPoolCount}`,
    `- routed_pool_target: ${routedPoolMinTarget}`,
    `- core_pool_target: ${corePoolMinTarget}`,
    `- core_non_large_vendor_target: ${coreNonLargeVendorMinTarget}`,
    `- non_core_pool_count: ${Math.max(0, routedPoolCount - (byPoolIndexRoute.core_pool || 0))}`,
    `- index_only_pool_count: ${byPoolIndexRoute.index_only || 0}`,
    `- aihot_index_only_count: ${aihotIndexOnlyCount}`,
    `- aihot_core_count: ${aihotCoreCount}`,
    `- importance_coverage_gaps: ${coverageGapText(runMeta.importance_coverage_gaps)}`,
    `- pool_importance_coverage_gaps: ${coverageGapText(poolImportanceGaps)}`,
    `- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.`,
    `- pool_theme_gate: diversify Pool; default max ${keywordMonitoring.policy?.structured_max_same_theme || 4} candidate items per theme unless theme_day=true.`,
    `- pool_count: ${poolItems.length}`,
    "- change_cluster_candidates: not_generated_by_monitor",
    "- heat_candidates: none",
    `- failed_sources: ${failures.length ? failures.join("; ") : "none"}`,
    "- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.",
    "- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.",
    `- raw_count_by_source_type: ${distributionText(byType)}`,
    `- source_registry_config: ${rel(sourceRegistryPath)}`,
    `- raw_snapshot_status_distribution: ${distributionText(bySnapshotStatus)}`,
    "- core_original_evidence_count: pending; to be filled after important-card evidence review.",
    "- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.",
    "",
    "## Source Level Distribution",
    "",
    Object.entries(byLevel).map(([key, value]) => `- ${key}: ${value}`).join("\n"),
    "",
    "## Evidence Object Type Distribution",
    "",
    Object.entries(byEvidenceObjectType).map(([key, value]) => `- ${key}: ${value}`).join("\n"),
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
    "## Three-Lane Monitor Policy",
    "",
    "Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.",
    "",
  ].join("\n");
  writeFile(path.join(reportsDir, `${date}-guanlan-daily-monitor-log.md`), log);
}

async function main() {
  let sourceArtifacts = { items: [], failures: [], files: [], sourceRuns: [] };
  const aihot = useSourceArtifacts
    ? {
        items: [],
        failures: [],
        mode: "source-artifacts",
        since: "",
        discovered_count: 0,
        discovered_count_daily: 0,
        discovered_count_all: 0,
        included_count_daily: 0,
        rejected_count: 0,
      }
    : await collectAIHot();
  if (useSourceArtifacts) {
    sourceArtifacts = loadSourceArtifactItems();
  }
  const primaryItems = useSourceArtifacts ? [...sourceArtifacts.items] : [...aihot.items];
  let keywordSearch = { items: [], failures: [] };
  let hn = { items: [], failures: [] };
  let gdelt = { items: [], failures: [] };
  let rss = { items: [], failures: [], rss_source_count: 0 };
  let searchActivated = false;
  let normalizedItems = normalize(primaryItems);
  let coverageGaps = importanceCoverageGaps(normalizedItems);
  const shouldRunExternalSearch =
    searchTarget > 0
    || searchPathQueryLimit > 0
    || gdeltQueryLimit > 0
    || normalizedItems.length < rawMinTarget
    || coverageGaps.length;
  const sourceArtifactsNeedSupplement = useSourceArtifacts && (normalizedItems.length < rawMinTarget || coverageGaps.length);
  if ((!useSourceArtifacts && shouldRunExternalSearch) || sourceArtifactsNeedSupplement) {
    searchActivated = true;
    [keywordSearch, gdelt, rss] = await Promise.all([
      collectKeywordSearch(),
      collectGDELT(),
      collectRSSFeeds(),
    ]);
    normalizedItems = normalize([...primaryItems, ...keywordSearch.items, ...hn.items, ...gdelt.items, ...rss.items]);
    coverageGaps = importanceCoverageGaps(normalizedItems);
  }
  const failures = [...sourceArtifacts.failures, ...aihot.failures, ...keywordSearch.failures, ...hn.failures, ...gdelt.failures, ...rss.failures];
  let items = dryRun
    ? normalizedItems
    : prioritizeAfterFetch(filterHistoricalDuplicatesAfterFetch(await enrichSnapshots(normalizedItems)));
  items = await refillPoolImportanceGaps(items, failures);
  coverageGaps = importanceCoverageGaps(items);

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
      importance_coverage_gaps: coverageGaps,
      historical_dedupe_enabled: historicalDedupeEnabled,
      historical_raw_records_checked: historicalDedupeRecordsChecked,
      historical_duplicates_removed_before_fetch: historicalDedupePreFetchRemoved,
      historical_duplicates_removed_after_fetch: historicalDedupePostFetchRemoved,
      source_artifacts_used: useSourceArtifacts,
      source_artifact_files: sourceArtifacts.files,
      source_artifact_runs: sourceArtifacts.sourceRuns,
    });
  }

  console.log(
    JSON.stringify(
      {
        date,
        status: items.length >= 50 ? "collected" : "severe-fallback",
        raw_count: items.length,
        pool_target: poolMinTarget,
        pool_selection_buffer: poolSelectionBufferTarget,
        routed_pool_target: routedPoolMinTarget,
        core_pool_target: corePoolMinTarget,
        core_non_large_vendor_target: coreNonLargeVendorMinTarget,
        aihot_mode: aihot.mode,
        aihot_since: aihot.since,
        aihot_discovered_count: aihot.discovered_count,
        aihot_daily_discovered_count: aihot.discovered_count_daily,
        aihot_all_discovered_count: aihot.discovered_count_all,
        aihot_daily_included_count: aihot.included_count_daily,
        aihot_rejected_by_raw_entry_rules: aihot.rejected_count,
        external_search_activated: searchActivated,
        source_artifacts_used: useSourceArtifacts,
        source_artifact_dir: useSourceArtifacts ? rel(sourceArtifactDir) : "",
        source_artifact_files: sourceArtifacts.files,
        source_artifact_runs: sourceArtifacts.sourceRuns,
        historical_dedupe_enabled: historicalDedupeEnabled,
        historical_raw_records_checked: historicalDedupeRecordsChecked,
        historical_duplicates_removed_before_fetch: historicalDedupePreFetchRemoved,
        historical_duplicates_removed_after_fetch: historicalDedupePostFetchRemoved,
        importance_coverage_gaps: coverageGaps,
        aihot_count: items.filter((item) => item.acquisition_channel === "aihot").length,
        keyword_search_count: items.filter((item) => item.acquisition_channel === "keyword-search").length,
        rss_feed_count: items.filter((item) => item.acquisition_channel === "rss-feed").length,
        rss_source_count: rss.rss_source_count,
        keyword_search_path_distribution: countBy(items.filter((item) => item.acquisition_channel === "keyword-search"), "search_path"),
        keyword_search_intent_distribution: countBy(items.filter((item) => item.acquisition_channel === "keyword-search"), "search_intent"),
        enterprise_ai_transformation_column: "企业AI化",
        enterprise_ai_transformation_candidate_count: items.filter((item) =>
          item.enterprise_ai_transformation_lens || item.raw_record?.enterprise_ai_transformation_lens
        ).length,
        enterprise_ai_transformation_stage_distribution: countBy(
          items
            .filter((item) => item.enterprise_ai_transformation_lens || item.raw_record?.enterprise_ai_transformation_lens)
            .map((item) => ({
              stage: item.enterprise_ai_transformation_stage || item.raw_record?.enterprise_ai_transformation_stage || "unspecified",
            })),
          "stage"
        ),
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
                rel(path.join(reportsDir, `${date}-guanlan-daily-monitor-log.md`)),
              ],
      },
      null,
      2
    )
  );
}

(sourceOnlyMode ? runSourceOnly() : main()).catch((error) => {
  console.error(error);
  process.exit(1);
});
