import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const registryPath = path.join(root, "01-SiteV2", "content", "09-databases", "source-registry-v2.json");

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
};

const safeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

const fetchJson = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 15000);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "WaveSightAI-SourceProbe/1.0",
        Accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${safeText(text).slice(0, 180)}`);
    }
    return JSON.parse(text);
  } finally {
    clearTimeout(timeout);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const truncateItems = (items, count = 5) => items.slice(0, count);

const probes = [
  {
    source_id: "gdelt-doc-ai-commercial",
    source_name: "GDELT DOC 2.0",
    source_type: "news",
    interface_type: "official-api",
    url:
      "https://api.gdeltproject.org/api/v2/doc/doc?query=%22AI%20agent%22&mode=artlist&format=json&timespan=1d&maxrecords=10",
    parse(data) {
      return (data.articles || []).map((item) => ({
        title: safeText(item.title),
        url: item.url,
        source: item.sourceCountry ? `${item.domain || "unknown"} / ${item.sourceCountry}` : item.domain || "unknown",
        date: item.seendate || item.socialimage || "",
      }));
    },
  },
  {
    source_id: "aihot-virxact-selected",
    source_name: "AI HOT selected items",
    source_type: "news",
    interface_type: "official-api",
    url: (() => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
      return `https://aihot.virxact.com/api/public/items?mode=selected&since=${encodeURIComponent(since)}&take=20`;
    })(),
    parse(data) {
      return (data.items || []).map((item) => ({
        title: safeText(item.title),
        url: item.url,
        source: item.source || "aihot.virxact.com",
        date: item.publishedAt || "",
        summary: safeText(item.summary),
        category: item.category || "",
      }));
    },
  },
  {
    source_id: "hacker-news-algolia-ai",
    source_name: "Hacker News Algolia",
    source_type: "developer",
    interface_type: "official-api",
    url:
      "https://hn.algolia.com/api/v1/search_by_date?query=AI%20agent&tags=story&hitsPerPage=10",
    parse(data) {
      return (data.hits || []).map((item) => ({
        title: safeText(item.title || item.story_title),
        url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
        source: "news.ycombinator.com",
        date: item.created_at,
        points: item.points || 0,
      }));
    },
  },
  {
    source_id: "github-search-ai-agent",
    source_name: "GitHub Search API",
    source_type: "developer",
    interface_type: "official-api",
    url:
      "https://api.github.com/search/repositories?q=ai+agent+created:%3E2026-04-08&sort=stars&order=desc&per_page=10",
    parse(data) {
      return (data.items || []).map((item) => ({
        title: item.full_name,
        url: item.html_url,
        source: "github.com",
        date: item.created_at,
        stars: item.stargazers_count,
        summary: safeText(item.description),
      }));
    },
  },
  {
    source_id: "arxiv-api-ai-agent",
    source_name: "arXiv API",
    source_type: "research",
    interface_type: "official-api",
    url:
      "https://export.arxiv.org/api/query?search_query=all:agent%20AND%20all:%22large%20language%20model%22&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending",
    parseXml(text) {
      const entries = [...text.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
      return entries.map((match) => {
        const entry = match[1];
        const title = safeText(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]);
        const id = safeText(entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]);
        const published = safeText(entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]);
        const summary = safeText(entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]);
        return { title, url: id, source: "arxiv.org", date: published, summary };
      });
    },
  },
];

async function runProbe(probe) {
  const startedAt = new Date().toISOString();
  try {
    let items;
    if (probe.parseXml) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(probe.url, {
        headers: { "User-Agent": "WaveSightAI-SourceProbe/1.0" },
        signal: controller.signal,
      });
      const text = await response.text();
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${safeText(text).slice(0, 180)}`);
      items = probe.parseXml(text);
    } else {
      let data;
      try {
        data = await fetchJson(probe.url);
      } catch (error) {
        if (probe.source_id.startsWith("gdelt") && /429/.test(error.message)) {
          await delay(6500);
          data = await fetchJson(probe.url, { timeoutMs: 30000 });
        } else {
          throw error;
        }
      }
      items = probe.parse(data);
    }
    return {
      source_id: probe.source_id,
      source_name: probe.source_name,
      source_type: probe.source_type,
      interface_type: probe.interface_type,
      status: items.length ? "success" : "empty",
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      item_count: items.length,
      sample_items: truncateItems(items),
      error: "",
    };
  } catch (error) {
    return {
      source_id: probe.source_id,
      source_name: probe.source_name,
      source_type: probe.source_type,
      interface_type: probe.interface_type,
      status: "failed",
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      item_count: 0,
      sample_items: [],
      error: error.message,
    };
  }
}

export async function runV2SourceProbe({ date = new Date().toISOString().slice(0, 10) } = {}) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const registry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, "utf8")) : null;
  const results = [];

  for (const probe of probes) {
    results.push(await runProbe(probe));
  }

  const successCount = results.filter((item) => item.status === "success").length;
  const payload = {
    task_id: "WSD-20260508-10-v2-source-interface-upgrade-autopilot",
    date,
    generated_at: new Date().toISOString(),
    registry_path: rel(registryPath),
    registry_source_count: registry?.sources?.length || 0,
    probe_count: results.length,
    success_count: successCount,
    failed_count: results.filter((item) => item.status === "failed").length,
    empty_count: results.filter((item) => item.status === "empty").length,
    publish_policy: "Raw probe results are diagnostics only and must not be published to the public site.",
    results,
  };

  const jsonPath = path.join(reportsDir, `v2-source-probe-${date}.json`);
  const mdPath = path.join(reportsDir, `v2-source-probe-${date}.md`);
  writeJson(jsonPath, payload);

  const rows = results
    .map(
      (item) =>
        `| ${item.source_name} | ${item.status} | ${item.item_count} | ${item.error ? item.error.replace(/\|/g, "/") : "ok"} |`
    )
    .join("\n");
  const sampleBlocks = results
    .map((item) => {
      const lines = item.sample_items
        .map((sample) => `- ${sample.title || "untitled"}：${sample.url || "no url"}`)
        .join("\n");
      return `### ${item.source_name}\n\n${lines || "- no sample items"}\n`;
    })
    .join("\n");

  const report = `# V2 Source Probe Report

生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}

## 调度摘要

- Task ID：WSD-20260508-10-v2-source-interface-upgrade-autopilot
- 日期：${date}
- Registry：${rel(registryPath)}
- Registry 来源数：${payload.registry_source_count}
- Probe 数：${payload.probe_count}
- 成功：${payload.success_count}
- 失败：${payload.failed_count}
- 空结果：${payload.empty_count}
- 发布策略：probe 结果只用于诊断，不进入公开前台。

## Probe 结果

| 来源 | 状态 | 返回数量 | 说明 |
|---|---|---:|---|
${rows}

## 样本

${sampleBlocks}
`;

  fs.writeFileSync(mdPath, report, "utf8");
  return { payload, jsonPath, mdPath };
}

if (import.meta.main) {
  const argDate = process.argv.find((arg) => arg.startsWith("--date="))?.split("=")[1];
  const { payload, jsonPath, mdPath } = await runV2SourceProbe({ date: argDate });
  console.log(`V2 source probe: ${payload.success_count}/${payload.probe_count} succeeded`);
  console.log(`JSON: ${rel(jsonPath)}`);
  console.log(`Report: ${rel(mdPath)}`);
  if (payload.success_count < 3) process.exitCode = 1;
}
