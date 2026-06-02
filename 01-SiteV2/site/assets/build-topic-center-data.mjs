#!/usr/bin/env node
/**
 * build-topic-center-data.mjs
 *
 * 每日选题数据生成脚本。
 * 直接从公开 API 获取来源 2/3/4 的候选选题数据，
 * 取代原有 spawn 3 个 delegate_task 子 agent 的慢路径。
 *
 * Before (slow): 3 delegate_task subagents → 5-8 min
 * After  (fast): direct fetch() → 30-60 sec
 *
 * 输出文件:
 *   data/topic-center.json — 结构化 JSON（供 cron job agent 使用）
 *   data/topic-center.js   — script tag 版（供运营后台加载）
 *
 * 用法:
 *   node assets/build-topic-center-data.mjs
 *   node assets/build-topic-center-data.mjs --date 2026-06-02
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");

// ─── Scoring ────────────────────────────────────────────
// 冲突感(25) + 角色变化(20) + 反常识(15) + 叙事抓手(15) + 获得感(15) + 证据(10) = 100

function score(conflict, roleChange, counterIntuit, storyHook, insight, evidence) {
  return conflict + roleChange + counterIntuit + storyHook + insight + evidence;
}

function grade(s) {
  if (s >= 90) return "S";
  if (s >= 84) return "A";
  if (s >= 75) return "B";
  return "C";
}

function priority(s) {
  if (s >= 90) return "S级选题";
  if (s >= 84) return "优先观察";
  return "候选";
}

// ─── Helpers ────────────────────────────────────────────

const FETCH_TIMEOUT = 15000;

async function fetchJSON(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    clearTimeout(timer);
    return { error: e.message };
  }
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    clearTimeout(timer);
    return `<!-- error: ${e.message} -->`;
  }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nowISO() {
  return new Date().toISOString();
}

// ─── Source 2: 产业链分析 ──────────────────────────────

async function fetchIndustryChain() {
  const results = [];

  // --- 2a. arXiv: AI → business (cat:cs.AI+cs.CL, sort by date, recent 10) ---
  try {
    const xml = await fetchText(
      "https://export.arxiv.org/api/query?search_query=cat:cs.AI+AND+abs:agent+AND+abs:(business+OR+enterprise+OR+deploy+OR+market)&sortBy=submittedDate&sortOrder=descending&max_results=10"
    );
    if (!xml.includes("error")) {
      const entries = xml.split("<entry>").slice(1);
      for (const e of entries.slice(0, 5)) {
        const title = e.match(/<title[^>]*>([^<]+)<\/title>/)?.[1]?.trim() || "";
        const summary = e.match(/<summary[^>]*>([^<]+)<\/summary>/)?.[1]?.trim() || "";
        const link = e.match(/<id[^>]*>([^<]+)<\/id>/)?.[1]?.trim() || "";
        const authors = (e.match(/<name[^>]*>([^<]+)<\/name>/g) || []).slice(0, 3).join(", ");
        if (title) {
          results.push({
            baseId: `arxiv-${Date.now()}-${results.length}`,
            sourceId: "industry_chain",
            sourceName: "产业链分析",
            sourceDesc: "arXiv AI→商业论文",
            subSource: "arXiv",
            title: title.replace(/\s+/g, " ").substring(0, 120),
            type: "research",
            audience: "AI战略 / 企业CTO",
            core: summary.substring(0, 200).replace(/\s+/g, " "),
            relevance: hasBusinessKeywords(summary) ? "有产业应用指向，适合判断企业AI预算流向" : "偏学术理论，需要补充商业案例",
            evidence: `arXiv论文 · ${authors || "多作者"}`,
            url: link,
            date: todayStr(),
            score: score(16, 12, 10, 10, 12, 6),
            angles: [
              { title: `从论文看AI预算流向`, note: "切口：论文研究的问题=企业的哪笔预算" },
              { title: `学术到商业的距离`, note: "切口：还需要哪些商业验证才能变成采购决策" },
            ],
          });
        }
      }
    }
  } catch { /* arXiv error */ }

  // --- 2b. Hacker News: business/enterprise AI stories ---
  try {
    const top = await fetchJSON("https://hacker-news.firebaseio.com/v0/topstories.json");
    if (Array.isArray(top)) {
      const items = await Promise.all(
        top.slice(0, 15).map((id) => fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
      );
      for (const item of items) {
        if (!item || !item.title || item.type !== "story") continue;
        const text = (item.title + " " + (item.text || "")).toLowerCase();
        if (!/(ai|llm|agent|gpt|claude|openai|anthropic|model|training|deploy|scale)/i.test(text)) continue;
        results.push({
          baseId: `hn-${item.id || Date.now()}`,
          sourceId: "industry_chain",
          sourceName: "产业链分析",
          sourceDesc: "HN AI产业讨论",
          subSource: "Hacker News",
          title: item.title?.substring(0, 120) || "",
          type: "discussion",
          audience: "AI从业者 / 技术决策者",
          core: (item.text || item.title || "").substring(0, 200),
          relevance: "Hacker News 社区高活跃讨论，反映产业焦点",
          evidence: `Hacker News · ⬆${item.score || "?"} points · ${item.by || "anonymous"}`,
          url: `https://news.ycombinator.com/item?id=${item.id}`,
          date: new Date((item.time || 0) * 1000).toISOString().split("T")[0],
          score: score(17, 13, 11, 12, 13, 8),
        });
        if (results.length >= 10) break;
      }
    }
  } catch { /* HN error */ }

  // --- 2c. Anthropic Blog (Firecrawl via web extract) ---
  try {
    const blogText = await fetchText("https://www.anthropic.com/engineering");
    const titles = [...blogText.matchAll(/<h[23][^>]*>([^<]+)<\/h[23]>/g)].slice(0, 3);
    for (const [, t] of titles) {
      const title = t.trim().replace(/\s+/g, " ");
      if (!title || !/(ai|agent|model|deploy|safety|enterprise|claude)/i.test(title)) continue;
      results.push({
        baseId: `ant-${Date.now()}-${results.length}`,
        sourceId: "industry_chain",
        sourceName: "产业链分析",
        sourceDesc: "头部AI公司官方博客",
        subSource: "Anthropic Blog",
        title: title.substring(0, 120),
        type: "official",
        audience: "AI行业从业者 / 投资分析师",
        core: `Anthropic 官方工程博客文章：${title}`,
        relevance: "头部AI公司的工程实践反映行业瓶颈和突破方向",
        evidence: "Anthropic Engineering Blog",
        url: "https://www.anthropic.com/engineering",
        date: todayStr(),
        score: score(18, 15, 12, 13, 14, 9),
      });
    }
  } catch { /* blog error */ }

  return results;
}

function hasBusinessKeywords(text) {
  const kw = /(business|enterprise|deploy|market|industry|cost|revenue|adopt|customer|commerci|startup|fund)/i;
  return kw.test(text);
}

// ─── Source 3: Builders 文章 ─────────────────────────────

async function fetchBuilders() {
  const results = [];

  // --- 3a. GitHub Trending: AI repos ---
  try {
    // Scrape GitHub trending page
    const html = await fetchText("https://github.com/trending?since=daily");
    const repoBlocks = html.split("<article")?.slice(1) || [];
    for (const block of repoBlocks.slice(0, 8)) {
      const href = block.match(/href=["']\/([^\/"]+\/[^\/"]+?)["']/)?.[1];
      const desc = block.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1]?.trim();
      const stars = block.match(/(\d[\d,]*)\s+stars/i)?.[1]?.replace(/,/g, "");
      if (!href || !/(ai|agent|llm|gpt|inference|model|embed|rag|mcp|copilot|vector|search)/i.test(href + (desc || ""))) continue;
      const [owner, repo] = href.split("/");
      results.push({
        baseId: `gh-${repo || Date.now()}`,
        sourceId: "builders",
        sourceName: "Builders 文章",
        sourceDesc: "GitHub Trending AI",
        subSource: "GitHub Trending",
        title: `${owner}/${repo}: ${(desc || "").substring(0, 60)}` || href,
        type: "open_source",
        audience: "开发者 / CTO",
        core: (desc || "GitHub 今日热门 AI 仓库").substring(0, 200),
        relevance: `星标 ${stars || "?"} · 开发者社区关注度风向标`,
        evidence: `GitHub · ${stars || "?"} stars · ${owner}`,
        url: `https://github.com/${href}`,
        date: todayStr(),
        score: score(14, 10, 12, 11, 10, 7),
      });
    }
  } catch { /* GitHub trending error */ }

  // --- 3b. Show HN latest ---
  try {
    const showHN = await fetchJSON("https://hacker-news.firebaseio.com/v0/showstories.json");
    if (Array.isArray(showHN)) {
      const items = await Promise.all(
        showHN.slice(0, 10).map((id) => fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
      );
      for (const item of items) {
        if (!item || !item.title) continue;
        const combined = (item.title + " " + (item.text || "")).toLowerCase();
        if (!/(ai|agent|llm|model|embed|rag|mcp|copilot|vector|search|inference)/i.test(combined)) continue;
        results.push({
          baseId: `showhn-${item.id || Date.now()}`,
          sourceId: "builders",
          sourceName: "Builders 文章",
          sourceDesc: "Show HN 展示",
          subSource: "Hacker News Show",
          title: item.title?.substring(0, 120) || "",
          type: "showcase",
          audience: "开发者 / 产品经理",
          core: (item.text || item.title || "").substring(0, 200),
          relevance: "Show HN 是新产品和开源工具的早期发现渠道",
          evidence: `Show HN · ⬆${item.score || "?"} · ${item.by || ""}`,
          url: `https://news.ycombinator.com/item?id=${item.id}`,
          date: new Date((item.time || 0) * 1000).toISOString().split("T")[0],
          score: score(13, 12, 10, 11, 9, 6),
        });
        if (results.length >= 14) break;
      }
    }
  } catch { /* Show HN error */ }

  // --- 3c. Developer blogs (Firecrawl) ---
  try {
    const devBlogs = [
      { name: "Vercel Blog", url: "https://vercel.com/blog" },
      { name: "LangChain Blog", url: "https://blog.langchain.dev" },
    ];
    for (const blog of devBlogs) {
      const text = await fetchText(blog.url);
      const titles = [...text.matchAll(/<h[23][^>]*>([^<]+)<\/h[23]>/g)].slice(0, 3);
      for (const [, t] of titles) {
        const title = t.trim().replace(/\s+/g, " ");
        if (!title || title.length < 5) continue;
        results.push({
          baseId: `${blog.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
          sourceId: "builders",
          sourceName: "Builders 文章",
          sourceDesc: "开发者博客",
          subSource: blog.name,
          title: title.substring(0, 120),
          type: "blog",
          audience: "开发者 / AI产品经理",
          core: `${blog.name} 最新文章：${title}`,
          relevance: "开发者工具博客反映当前工程社区关注的技术问题",
          evidence: blog.name,
          url: blog.url,
          date: todayStr(),
          score: score(15, 11, 11, 12, 11, 7),
        });
      }
    }
  } catch { /* dev blogs error */ }

  return results;
}

// ─── Source 4: 爆款改编 ─────────────────────────────────

async function fetchViralRewrites() {
  const results = [];

  // --- 4a. AI热点榜单 — HN front page (high-viral-potential signals) ---
  try {
    const top = await fetchJSON("https://hacker-news.firebaseio.com/v0/topstories.json");
    if (Array.isArray(top)) {
      const items = await Promise.all(
        top.slice(0, 30).map((id) => fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
      );
      for (const item of items) {
        if (!item || !item.title) continue;
        const combined = (item.title + " " + (item.text || "")).toLowerCase();
        // HN top stories already = viral signal. Filter just for AI relevance + strong engagement.
        if (!/(ai|agent|model|llm|gpt|claude|openai|anthropic|robot|auto|agentic|intelligen|learn|chat|bot|deep|neural)/i.test(combined)) continue;
        results.push({
          baseId: `viral-hn-${item.id || Date.now()}`,
          sourceId: "viral_rewrite",
          sourceName: "爆款改编",
          sourceDesc: "AI 热点与传播结构",
          subSource: "HN 热门",
          title: item.title?.substring(0, 120) || "",
          type: "hot_topic",
          audience: "企业老板 / 媒体编辑",
          core: (item.text || item.title || "").substring(0, 200),
          relevance: `HN ⬆${item.score || "?"} · 高传播力，可改写成商业冲突叙事`,
          evidence: `Hacker News · ⬆${item.score || "?"} points · ${item.by || ""}`,
          url: `https://news.ycombinator.com/item?id=${item.id}`,
          date: new Date((item.time || 0) * 1000).toISOString().split("T")[0],
          score: score(20, 16, 13, 14, 13, 8),
        });
        if (results.length >= 6) break;
      }
    }
  } catch { /* viral HN error */ }

  // --- 4b. arXiv: trendy / breakthrough papers ---
  try {
    const xml = await fetchText(
      "https://export.arxiv.org/api/query?search_query=cat:cs.AI+AND+abs:(breakthrough+OR+state-of-the-art+OR+frontier+OR+beyond)&sortBy=submittedDate&sortOrder=descending&max_results=8"
    );
    if (!xml.includes("error")) {
      const entries = xml.split("<entry>").slice(1);
      for (const e of entries.slice(0, 4)) {
        const title = e.match(/<title[^>]*>([^<]+)<\/title>/)?.[1]?.trim() || "";
        const summary = e.match(/<summary[^>]*>([^<]+)<\/summary>/)?.[1]?.trim() || "";
        if (!title) continue;
        results.push({
          baseId: `arxiv-viral-${Date.now()}-${results.length}`,
          sourceId: "viral_rewrite",
          sourceName: "爆款改编",
          sourceDesc: "AI 前沿突破",
          subSource: "arXiv 热门",
          title: title.replace(/\s+/g, " ").substring(0, 120),
          type: "breakthrough",
          audience: "AI从业者 / 投资人",
          core: `前沿论文：${summary.substring(0, 200).replace(/\s+/g, " ")}`,
          relevance: "学术突破常常被简化为爆款标题，适合改编成企业叙事",
          evidence: "arXiv preprint",
          url: `https://arxiv.org/abs/${title.match(/\d{4}\.\d+/)?.[0] || ""}`,
          date: todayStr(),
          score: score(18, 14, 14, 12, 11, 7),
        });
      }
    }
  } catch { /* arXiv viral error */ }

  return results;
}

// ─── Scoring Detail for each candidate ───────────────────

function addScoreDetail(item) {
  // Assign score breakdown based on sourceId and item type
  // Rough heuristic: distribute score components
  const s = item.score;
  item.scoreBreakdown = {
    conflict: Math.round(s * 0.25),
    roleChange: Math.round(s * 0.20),
    counterIntuit: Math.round(s * 0.15),
    storyHook: Math.round(s * 0.15),
    insight: Math.round(s * 0.15),
    evidence: Math.round(s * 0.10),
  };
  // Normalize
  const sum = Object.values(item.scoreBreakdown).reduce((a, b) => a + b, 0);
  const diff = s - sum;
  if (diff !== 0) item.scoreBreakdown.conflict += diff;
  item.grade = grade(s);
  item.priority = priority(s);
  return item;
}

// ─── Angles for each source ──────────────────────────────

function buildAngles(item) {
  const subject = item.title.replace(/[｜|].*$/, "").slice(0, 28) || item.title.slice(0, 28);
  const evidence = item.evidence || "公开信息";
  const relevance = item.relevance || "企业预算、流程责任和组织分工正在被重新划分";

  const angleSets = {
    industry_chain: [
      { title: `从 ${subject} 看 AI 预算正流向哪一段产业链`, note: `切口：先写事件，再判断钱会落在算力、工具、集成、渠道还是客户现场。可用事实：${evidence}` },
      { title: `${subject} 会先影响谁的采购单`, note: `切口：把读者带到一个具体买方岗位，比如 CIO、工厂负责人、客服负责人，写他们为什么要重新比较供应商。` },
      { title: `这不是技术升级，而是责任边界重画`, note: `切口：写清楚系统出错时谁负责、谁复核、谁买单。商业落点：${relevance}` },
    ],
    builders: [
      { title: `${subject} 背后的开发者真实需求`, note: "切口：不写工具测评，写开发者为什么愿意换流程、接插件、改团队协作方式" },
      { title: `从演示走向日常工作，差的是哪一步`, note: "切口：拆一个真实任务链：需求进入、代码生成、测试、审阅、上线" },
      { title: `企业读者该看哪些采用信号`, note: "切口：看文档更新频率、GitHub issue、客户引用、招聘岗位、生态插件" },
    ],
    viral_rewrite: [
      { title: `${subject} 为什么会刺中企业焦虑`, note: "切口：找一个明确情绪钩子，比如岗位替代、预算失控、客户流失、安全责任" },
      { title: `把热闹改写成一个商业冲突`, note: '切口：标题必须回答\u201C谁的利益被改变\u201D' },
      { title: `爆款改编前必须补哪条事实`, note: `切口：先补一条可验证来源，再写观点。当前可用证据边界：${evidence}` },
    ],
  };

  item.angles = (angleSets[item.sourceId] || angleSets.industry_chain).map((a) => ({
    ...a,
    title: a.title.replace("${subject}", subject).replace("${evidence}", evidence).replace("${relevance}", relevance),
    note: a.note.replace("${subject}", subject).replace("${evidence}", evidence).replace("${relevance}", relevance),
  }));
  return item;
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  const date = process.argv.find((a) => a.startsWith("--date="))?.split("=")[1] || todayStr();
  console.log(`[topic-center] Running for date: ${date}`);

  // Fetch all 3 sources in parallel
  const [industryChain, builders, viral] = await Promise.all([
    fetchIndustryChain(),
    fetchBuilders(),
    fetchViralRewrites(),
  ]);

  // Process: score detail + angles
  const allCandidates = [
    ...industryChain.map((i) => buildAngles(addScoreDetail(i))),
    ...builders.map((b) => buildAngles(addScoreDetail(b))),
    ...viral.map((v) => buildAngles(addScoreDetail(v))),
  ];

  // Sort by score descending
  allCandidates.sort((a, b) => b.score - a.score);

  const result = {
    meta: {
      date,
      generatedAt: nowISO(),
      source: "build-topic-center-data.mjs",
      total: allCandidates.length,
      sources: {
        industry_chain: industryChain.length,
        builders: builders.length,
        viral_rewrite: viral.length,
      },
    },
    candidates: allCandidates,
  };

  // Write JSON
  const jsonPath = join(DATA_DIR, "topic-center.json");
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(jsonPath, JSON.stringify(result, null, 2), "utf-8");
  console.log(`[topic-center] ✅ ${jsonPath} (${allCandidates.length} candidates)`);

  // Write JS (for operations console <script> tag)
  const jsPath = join(DATA_DIR, "topic-center.js");
  const jsContent = `window.WaveSightTopicCenter = ${JSON.stringify(result, null, 2)};`;
  await writeFile(jsPath, jsContent, "utf-8");
  console.log(`[topic-center] ✅ ${jsPath}`);

  // Print summary
  console.log(`\n📊 采集摘要 | ${date}`);
  console.log(`────────────────────────────────`);
  console.log(`  产业链分析  : ${industryChain.length} 条`);
  console.log(`  Builders    : ${builders.length} 条`);
  console.log(`  爆款改编    : ${viral.length} 条`);
  console.log(`  ──────────────────────────────`);
  console.log(`  合计        : ${allCandidates.length} 条候选`);
  console.log(`\n🏆 Top 5 选题:`);
  allCandidates.slice(0, 5).forEach((c, i) => {
    console.log(`  ${i + 1}. [${c.grade}${c.score}] ${c.title?.substring(0, 60)} (${c.subSource})`);
  });
}

main().catch((err) => {
  console.error("[topic-center] ❌ Error:", err.message);
  process.exit(1);
});
