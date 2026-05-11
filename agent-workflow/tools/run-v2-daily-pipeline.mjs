import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const root = process.cwd();
const execFileAsync = promisify(execFile);
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const aihotTarget = Number(args.get("aihot-limit") || 60);
const buildersTarget = Number(args.get("builders-limit") || 25);
const searchTarget = Number(args.get("search-limit") || 50);
const hnTarget = Number(args.get("hn-limit") || 40);
const rawTarget = Number(args.get("raw-target") || 100);
const dryRun = args.get("dry-run") === "true";
const followBuildersSkillScript =
  args.get("follow-builders-script") ||
  path.join(process.env.USERPROFILE || "", ".skill-store", "follow-builders", "scripts", "prepare-digest.js");

const contentRoot = path.join(root, "01-SiteV2", "content");
const reportsDir = path.join(root, "agent-workflow", "reports");
const rawDir = path.join(contentRoot, "01-raw");
const originalDir = path.join(rawDir, "originals", date);
const heatDir = path.join(contentRoot, "05-trend-chain");

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");
const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });
const writeFile = (file, text) => {
  ensure(path.dirname(file));
  fs.writeFileSync(file, text, "utf8");
};

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

function classify(item) {
  const url = item.url || "";
  const host = urlHost(url);
  const source = `${item.source || ""} ${host}`.toLowerCase();
  const title = `${item.title || ""} ${item.summary || ""}`.toLowerCase();

  if (/openai|anthropic|google|microsoft|aws|cursor|baidu|alibaba|nvidia|serviceNow|servicenow|salesforce|github\.com\/[^/]+\/[^/]+/iu.test(source)) {
    return host === "github.com" ? { level: "B", type: "developer" } : { level: "S", type: "official" };
  }
  if (/reuters|axios|techcrunch|theinformation|ft\.com|cncf|arxiv|berkeley|bair|stanford|mit|nature|the-decoder/iu.test(source)) {
    return { level: "A", type: /arxiv|bair|stanford|mit|cncf|berkeley/iu.test(source) ? "research" : "media" };
  }
  if (/huggingface|pypi|npmjs|github|producthunt|yc|crunchbase|simonwillison|substack|medium/iu.test(source)) {
    return { level: "B", type: /github|pypi|npmjs|huggingface/iu.test(source) ? "developer" : "industry" };
  }
  if (/x\.com|twitter|reddit|news\.ycombinator|hn\.algolia|aihot/iu.test(source) || /show hn|ask hn/iu.test(title)) {
    return { level: "C", type: "community" };
  }
  return { level: "B", type: "web" };
}

function score(item) {
  const text = `${item.title} ${item.summary} ${item.url}`.toLowerCase();
  let value = 0;
  for (const pattern of [
    /agent/,
    /workflow/,
    /enterprise/,
    /customer/,
    /crm/,
    /governance/,
    /security/,
    /sandbox/,
    /coding/,
    /mcp/,
    /funding/,
    /series/,
    /api/,
    /platform/,
    /revenue/,
    /pricing/,
    /health/,
    /finance/,
    /legal/,
    /compliance/,
  ]) {
    if (pattern.test(text)) value += 1;
  }
  if (item.source_level === "S") value += 4;
  if (item.source_level === "A") value += 3;
  if (item.source_level === "B") value += 2;
  if (item.source_level === "C") value += 1;
  if (item.acquisition_channel === "aihot") value += 2;
  if (item.acquisition_channel === "follow-builders") value += 2;
  if (item.acquisition_channel === "keyword-search") value += 2;
  if (/tool|tutorial|prompt|free|course|求职|简历|壁纸|封面/iu.test(text)) value -= 2;
  return value;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "WaveSightAI/2.0 daily-source-router",
      accept: "application/json,text/plain,*/*",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function collectAIHot() {
  const items = [];
  let cursor = "";
  const failures = [];
  while (items.length < aihotTarget) {
    const url = new URL("https://aihot.virxact.com/api/public/items");
    url.searchParams.set("limit", "50");
    if (cursor) url.searchParams.set("cursor", cursor);
    try {
      const data = await fetchJson(url.toString());
      const batch = Array.isArray(data.items) ? data.items : [];
      for (const item of batch) {
        const title = cleanText(item.title, item.title_en);
        const summary = cleanText(item.summary, item.title_en);
        items.push({
          acquisition_channel: "aihot",
          original_id: item.id,
          title,
          summary,
          url: item.url,
          source: cleanText(item.source, "AI HOT"),
          published_at: item.publishedAt || "",
          category: item.category || "",
        });
      }
      if (!data.hasNext || !data.nextCursor || batch.length === 0) break;
      cursor = data.nextCursor;
    } catch (error) {
      failures.push(`AI HOT: ${error.message}`);
      break;
    }
  }
  return { items, failures };
}

async function collectHN() {
  const failures = [];
  try {
    const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
    url.searchParams.set("query", "AI agent OR agentic AI");
    url.searchParams.set("tags", "story");
    url.searchParams.set("hitsPerPage", String(hnTarget));
    const data = await fetchJson(url.toString());
    const hits = Array.isArray(data.hits) ? data.hits : [];
    return {
      items: hits.map((item) => ({
        acquisition_channel: "hn",
        original_id: item.objectID,
        title: item.title || item.story_title || "",
        summary: `${item.points || 0} points / ${item.num_comments || 0} comments`,
        url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
        source: "Hacker News",
        published_at: item.created_at || "",
        category: "developer",
      })),
      failures,
    };
  } catch (error) {
    failures.push(`HN: ${error.message}`);
    return { items: [], failures };
  }
}

async function collectFollowBuildersProxy() {
  const queries = [
    "AI agent builder product launch",
    "AI coding agent founder",
    "agentic workflow builder",
    "AI startup founder agent",
    "Claude Code builder workflow",
  ];
  const items = [];
  const failures = [];
  for (const query of queries) {
    const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
    url.searchParams.set("query", query);
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
          summary: `${item.points || 0} points / ${item.num_comments || 0} comments / query=${query}`,
          url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
          source: "follow-builders proxy / HN builder query",
          published_at: item.created_at || "",
          category: "builder",
        });
      }
    } catch (error) {
      failures.push(`follow-builders proxy ${query}: ${error.message}`);
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
        items.push({
          acquisition_channel: "follow-builders",
          original_id: tweet.id,
          title: `${builder.name || builder.handle}｜${tweet.text.slice(0, 90)}`,
          summary: `${builder.bio || ""}\nlikes=${tweet.likes || 0}; retweets=${tweet.retweets || 0}; replies=${tweet.replies || 0}`,
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
    return { items: items.slice(0, buildersTarget), failures };
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
  const queries = [
    "AI agent enterprise funding",
    "AI agent product launch enterprise",
    "AI governance agent platform",
    "AI coding agent security sandbox",
    "AI customer service agent platform",
    "agentic AI workflow automation",
    "AI agents finance compliance",
    "AI agent startup raises",
  ];
  const items = [];
  const failures = [];
  for (const query of queries) {
    const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
    url.searchParams.set("query", query);
    url.searchParams.set("tags", "story");
    url.searchParams.set("hitsPerPage", String(Math.ceil(searchTarget / queries.length)));
    try {
      const data = await fetchJson(url.toString());
      const hits = Array.isArray(data.hits) ? data.hits : [];
      for (const item of hits) {
        items.push({
          acquisition_channel: "keyword-search",
          original_id: item.objectID,
          title: item.title || item.story_title || "",
          summary: `${item.points || 0} points / ${item.num_comments || 0} comments / query=${query}`,
          url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
          source: "keyword search / HN Algolia",
          published_at: item.created_at || "",
          category: "keyword-search",
        });
      }
    } catch (error) {
      failures.push(`keyword-search ${query}: ${error.message}`);
    }
  }
  return { items: items.slice(0, searchTarget), failures };
}

async function collectGDELT() {
  const queries = ["AI agent enterprise", "agentic AI governance", "AI startup funding", "AI coding agent"];
  const items = [];
  const failures = [];
  for (const query of queries) {
    const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
    url.searchParams.set("query", query);
    url.searchParams.set("mode", "ArtList");
    url.searchParams.set("format", "json");
    url.searchParams.set("maxrecords", "20");
    url.searchParams.set("timespan", "7d");
    url.searchParams.set("sort", "HybridRel");
    try {
      const data = await fetchJson(url.toString());
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
        });
      }
    } catch (error) {
      failures.push(`GDELT ${query}: ${error.message}`);
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
      return {
        ...item,
        title: cleanText(item.title, item.summary || item.url),
        summary: cleanText(item.summary, ""),
        url: item.url || "",
        source_level: classified.level,
        source_type: classified.type,
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

  const picked = normalized.filter((item) => item.acquisition_channel === "follow-builders");
  const pickedKeys = new Set(picked.map((item) => item.url || `${item.title}-${item.source}`));

  const mainPool = normalized.filter((item) => item.acquisition_channel !== "follow-builders");
  const aihotMin = Math.floor(rawTarget * 0.35);
  const keywordMin = Math.floor(rawTarget * 0.35);
  const take = (channel, count) => {
    for (const item of mainPool.filter((entry) => entry.acquisition_channel === channel)) {
      if (picked.length >= rawTarget || count <= 0) break;
      const key = item.url || `${item.title}-${item.source}`;
      if (pickedKeys.has(key)) continue;
      picked.push(item);
      pickedKeys.add(key);
      count -= 1;
    }
  };

  take("aihot", aihotMin);
  take("keyword-search", keywordMin);

  for (const item of mainPool) {
    if (picked.length >= rawTarget) break;
    const key = item.url || `${item.title}-${item.source}`;
    if (pickedKeys.has(key)) continue;
    picked.push(item);
    pickedKeys.add(key);
  }

  return picked.sort((a, b) => b.score - a.score);
}

function makeRawFiles(items, failures) {
  ensure(originalDir);
  const rawLines = [
    "---",
    `date: ${date}`,
    "stage: raw",
    "status: v2-source-router-collected",
    `raw_count: ${items.length}`,
    `aihot_count: ${items.filter((item) => item.acquisition_channel === "aihot").length}`,
    `keyword_search_count: ${items.filter((item) => item.acquisition_channel === "keyword-search").length}`,
    `follow_builders_count: ${items.filter((item) => item.acquisition_channel === "follow-builders").length}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} Raw Candidates`,
    "",
    "说明：本文件由 `agent-workflow/tools/run-v2-daily-pipeline.mjs` 生成。AI HOT 与联网关键词搜索承担主数量池；follow-builders 全量扫描但不设固定比例，主要作为 Builder 观点、早期行为和 Point 线索入口。三者都属于 discovery / source-router，其摘要不作为事实主证据，进入 Front Signal 前必须回看原始 URL 并重新判定 S/A/B/C/D。",
    "",
  ];

  items.forEach((item, index) => {
    const id = `R-${String(index + 1).padStart(3, "0")}`;
    const originalName = `${id.toLowerCase()}-${slugify(item.title)}.md`;
    const originalPath = path.join(originalDir, originalName);
    const reason = item.score >= 6
      ? "高相关商业候选，涉及 Agent、企业流程、安全治理、开发者基础设施、融资、平台或受监管场景。"
      : "中等相关候选，保留为趋势观察或 Heat Candidate，需二次搜索确认商业信号。";
    rawLines.push(
      `### ${id}｜${item.title}`,
      "",
      `- 原文档案：\`${rel(originalPath)}\``,
      `- 出处：${item.source}｜${item.url || "no-url"}`,
      `- 采集通道：${item.acquisition_channel}`,
      `- 来源类型：${item.source_type}`,
      `- 来源等级：${item.source_level}`,
      `- 发布时间：${item.published_at || "unknown"}`,
      `- 分类：${item.category || "unknown"}`,
      `- 采集理由：${reason}`,
      ""
    );

    const original = [
      "---",
      `raw_id: ${id}`,
      `source_name: ${JSON.stringify(item.source || "").slice(1, -1)}`,
      `source_url: ${item.url || ""}`,
      `source_type: ${item.source_type}`,
      `source_level: ${item.source_level}`,
      `acquisition_channel: ${item.acquisition_channel}`,
      `captured_at: ${new Date().toISOString()}`,
      "language: mixed",
      "copyright_note: local research archive only",
      "---",
      "",
      `# ${item.title}`,
      "",
      "## 原文 / 可用正文",
      "",
      item.summary || "本地脚本保存来源标题、URL、来源等级和可用摘要；不复制受版权保护的完整正文。",
      "",
      "## 采集备注",
      "",
      `该条目由 ${item.acquisition_channel} 发现，原始来源等级初判为 ${item.source_level}。若采集通道为 AI HOT / HN / X / Reddit / 社群聚合，只能作为 discovery / source-router；进入事实主证据前必须打开原始 URL，并寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。`,
      "",
    ].join("\n");
    writeFile(originalPath, original);
  });

  writeFile(path.join(rawDir, `${date}-raw-candidates.md`), rawLines.join("\n"));

  const heatItems = items.filter((item) => item.score >= 4 && item.source_level !== "S").slice(0, 12);
  const heatLines = [
    "---",
    `date: ${date}`,
    "stage: heat-candidates",
    "status: source-router-generated",
    "---",
    "",
    `# ${date} Heat Candidates`,
    "",
  ];
  heatItems.forEach((item, index) => {
    heatLines.push(
      `## HC-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}｜${item.title}`,
      "",
      "- formal_tags: `track-ai-agent`, `stage-watch`, `source-social`",
      `- classification_labels: ${item.category || "unknown"} / ${item.source_type} / ${item.acquisition_channel}`,
      `- candidate_tags: ${item.category || "ai"}, ${item.source_type}, ${item.acquisition_channel}`,
      "- status: watch",
      `- source_refs: ${item.url || item.original_id || "unknown"}`,
      "- seen_count_7d: 1",
      "- source_type_count: 1",
      "",
      `观察理由：该条目热度或相关性较高，但当前仍需 S/A/B 来源补证，暂不升级为正式 Signal。`,
      ""
    );
  });
  writeFile(path.join(heatDir, `${date}-heat-candidates.md`), heatLines.join("\n"));

  const distribution = items.reduce((acc, item) => {
    acc[item.acquisition_channel] = (acc[item.acquisition_channel] || 0) + 1;
    return acc;
  }, {});
  const byType = items.reduce((acc, item) => {
    acc[item.source_type] = (acc[item.source_type] || 0) + 1;
    return acc;
  }, {});
  const byLevel = items.reduce((acc, item) => {
    acc[item.source_level] = (acc[item.source_level] || 0) + 1;
    return acc;
  }, {});

  const log = [
    `# ${date} V2 Daily Source Router Log`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- raw_count: ${items.length}`,
    `- aihot_count: ${items.filter((item) => item.acquisition_channel === "aihot").length}`,
    `- keyword_search_count: ${items.filter((item) => item.acquisition_channel === "keyword-search").length}`,
    `- follow_builders_count: ${items.filter((item) => item.acquisition_channel === "follow-builders").length}`,
    `- source_distribution: ${Object.entries(distribution).map(([key, value]) => `${key}=${value}`).join("; ")}`,
    `- raw_count_by_channel: ${Object.entries(distribution).map(([key, value]) => `${key}=${value}`).join("; ")}`,
    `- failed_sources: ${failures.length ? failures.join("; ") : "none"}`,
    "- fallback_used: AI HOT and keyword search are the main volume lanes; follow-builders skill is fully scanned without a fixed quota and may fall back to follow-builders proxy. HN and GDELT are supplemental fallbacks; later Agent pass must use official / S/A/B sources for Front Signal evidence.",
    "- evidence_gaps: AI HOT / follow-builders / keyword-search / HN / social items need original-source verification; customer adoption, pricing, deployment and financing evidence may be missing.",
    `- raw_count_by_source_type: ${Object.entries(byType).map(([key, value]) => `${key}=${value}`).join("; ")}`,
    "- front_signal_sab_source_count: pending; to be filled after Front Signal secondary search.",
    "",
    "## Source Level Distribution",
    "",
    Object.entries(byLevel).map(([key, value]) => `- ${key}: ${value}`).join("\n"),
    "",
    "## Three-Lane Source-Router Policy",
    "",
    "AI HOT and keyword search are the main volume lanes. follow-builders is fully scanned as a high-value builder viewpoint radar, but it does not receive a fixed Raw / Pool quota because the monitored set is small and daily volume is usually around 10-20 usable items. None of these lanes counts as Front Signal fact evidence until original S/A/B sources are resolved.",
    "",
  ].join("\n");
  writeFile(path.join(reportsDir, `${date}-v2-daily-source-router-log.md`), log);
}

async function main() {
  const [aihot, builders, keywordSearch, hn, gdelt] = await Promise.all([
    collectAIHot(),
    collectFollowBuilders(),
    collectKeywordSearch(),
    collectHN(),
    collectGDELT(),
  ]);
  const failures = [...aihot.failures, ...builders.failures, ...keywordSearch.failures, ...hn.failures, ...gdelt.failures];
  const items = normalize([...aihot.items, ...builders.items, ...keywordSearch.items, ...hn.items, ...gdelt.items]);

  if (!dryRun) makeRawFiles(items, failures);

  console.log(
    JSON.stringify(
      {
        date,
        status: items.length >= 50 ? "collected" : "severe-fallback",
        raw_count: items.length,
        aihot_count: items.filter((item) => item.acquisition_channel === "aihot").length,
        follow_builders_count: items.filter((item) => item.acquisition_channel === "follow-builders").length,
        keyword_search_count: items.filter((item) => item.acquisition_channel === "keyword-search").length,
        failures,
        outputs: dryRun
          ? []
          : [
              rel(path.join(rawDir, `${date}-raw-candidates.md`)),
              rel(originalDir),
              rel(path.join(heatDir, `${date}-heat-candidates.md`)),
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
