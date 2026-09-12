import crypto from "node:crypto";
import { extractDocumentLinks, documentKey, mergeDocumentLinks } from "./community-document-links.mjs";

const plain = (value) => String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
export function resourceKeyword(card, job = {}) {
  const specific = /Claude Code|Codex|FDE|RPA|YouTube|小红书|简历|知识库|n8n|Dify|Coze|ComfyUI|抖音|公众号/i;
  const titleMatch = String(card.title || "").match(specific)?.[0];
  if (titleMatch) return titleMatch;
  const body = plain(`${card.original || ""} ${card.merged || ""}`);
  const query = String(job.keyword || "").split(" / ")[0];
  if (query && body.toLowerCase().includes(query.toLowerCase())) return query;
  return body.match(specific)?.[0] || (String(card.title || "").includes("AI") ? "AI" : "");
}
export function scysIdentity(url = "") {
  const match = String(url).match(/^https:\/\/scys\.com\/articleDetail\/(xq_topic|forum_topic)\/(\d+)(?:[/?#]|$)/);
  return match ? { entityType: match[1], entityId: match[2] } : null;
}

export function scysDetailCard(detail) {
  const topic = detail.topicDTO || {};
  const original = String(topic.articleContent || "");
  const merged = String(topic.articleContentContainFeishuDoc || "");
  const links = extractDocumentLinks(original);
  // Encoded hrefs are authoritative. Plain merged text can join a URL to a title.
  const mergedLinks = extractDocumentLinks(merged);
  const allLinks = mergeDocumentLinks([...mergedLinks, ...links]);
  return {
    title: plain(topic.showTitle || topic.title || original).slice(0, 96),
    author: detail.topicUserDTO?.name || "",
    url: detail.detailUrl,
    publishedAt: topic.gmtCreate ? new Date(Number(topic.gmtCreate) * 1000).toISOString() : "",
    excerpt: plain(original), detailText: merged || plain(original), detailLinks: allLinks,
    rawText: original, metrics: `点赞 ${topic.likeCount || 0} · 评论 ${topic.commentsCount || 0}`,
    original, merged,
  };
}

export async function relatedScysResources(call, keyword) {
  if (!keyword) return [];
  const resources = [];
  resources.warnings = [];
  for (const [kind, tool] of [["case", "projectLibSearch"], ["tool", "searchProjectTools"], ["manual", "activitySearch"]]) {
    const response = await call(tool, { keyword, pageIndex: 1, pageSize: 2 });
    for (const item of response.items || []) {
      if (!plain([item.name, item.summary, item.scene, item.features, item.target].join(" ")).toLowerCase().includes(keyword.toLowerCase())) continue;
      const id = String(item.id || item.toolId || "");
      const resource = {
        kind, id, title: plain(item.name), matchedKeyword: keyword,
        association: "keyword_match", source: "scys", sourceTool: tool,
        description: plain(item.summary || item.scene || item.target).slice(0, 220),
      };
      if (/^https?:\/\//.test(item.url || "")) resource.url = item.url;
      if (kind === "manual") {
        let toc;
        try { toc = await call("activityManualToc", { activityId: id }); }
        catch (error) {
          if (!/ACCESS_DENIED/.test(error.message)) throw error;
          resources.warnings.push({ source: "scys", mode: "manual-access", activityId: id, keyword, message: "Manual restricted to designated users; skipped without requesting new permissions" });
          continue;
        }
        resource.title = toc.courseTitle || toc.activityName || resource.title;
        resource.activityId = id;
        resource.entries = (toc.items || []).filter((entry) => entry.hasContent)
          .map((entry) => ({ itemId: String(entry.itemId), title: plain(entry.title) }));
        resource.readTool = "activityManualDetail";
      }
      resources.push(resource);
    }
  }
  return resources;
}

export async function collectScysMcp({
  call, normalizeCard, jobs, previous = [], browserDetail,
  maxPages = 2, maxPosts = 80, now = Date.now(), upgradeOnly = false,
}) {
  const discoveries = new Map();
  const coverage = [];
  const warnings = [];
  const originals = [];
  const relatedCache = new Map();
  const add = (identity, job, old) => {
    const key = `${identity.entityType}:${identity.entityId}`;
    const record = discoveries.get(key) || { identity, jobs: [], old };
    record.jobs.push(job);
    discoveries.set(key, record);
  };
  if (upgradeOnly) {
    for (const old of previous.filter((item) => item.source === "scys")) {
      const identity = scysIdentity(old.url);
      if (identity) add(identity, old.collection || { mode: "upgrade", keyword: "", group: "preserved" }, old);
    }
  } else {
    for (const job of jobs) {
      let fetched = 0, total = 0;
      for (let pageIndex = 1; pageIndex <= maxPages; pageIndex++) {
        const args = { displayMode: 1, pageSize: 10, pageIndex };
        if (job.keyword) args.keyword = job.keyword;
        else {
          args.gmtCreateStart = Math.floor(now / 1000) - 86400;
          args.gmtCreateEnd = Math.floor(now / 1000);
        }
        const result = await call("searchTopic", args);
        total = Number(result.total || 0);
        const items = result.items || [];
        fetched += items.length;
        for (const item of items) {
          const topic = item.topicDTO || {};
          if (topic.entityId && topic.entityType) add({ entityId: String(topic.entityId), entityType: topic.entityType }, job);
        }
        if (items.length < 10 || fetched >= total) break;
      }
      coverage.push({ keyword: job.keyword, mode: job.mode, fetched, total, truncated: fetched < total });
    }
  }
  const items = [];
  for (const { identity, jobs: matches, old } of [...discoveries.values()].slice(0, maxPosts)) {
    const detail = await call("topicDetail", identity);
    const card = scysDetailCard(detail);
    if (!card.url || !card.original) throw new Error("SCYS_DETAIL_INCOMPLETE");
    const prior = old || previous.find((item) => JSON.stringify(scysIdentity(item.url)) === JSON.stringify(identity));
    const currentKeys = new Set(card.detailLinks.map((link) => documentKey(link.href)));
    const missingPrevious = mergeDocumentLinks(prior?.links || []).some((link) => !currentKeys.has(documentKey(link.href)));
    const resourceMention = /(?:https?(?::|%3A)(?:\/|%2F){2}[^\s"'<>]*?(?:feishu\.cn|larksuite\.com))|飞书(?:好读版|文档链接|全文)|(?:全文|资料链接)[^。\n]{0,12}飞书/i.test(card.original + card.merged);
    if (browserDetail && (missingPrevious || (resourceMention && !card.detailLinks.length))) {
      try {
        const browser = await browserDetail(card.url);
        card.detailLinks = mergeDocumentLinks([...card.detailLinks, ...extractDocumentLinks(browser.text, browser.anchors)]);
      } catch {
        warnings.push({ source: "scys", mode: "document-fallback", entityId: identity.entityId, message: "Browser document fallback unavailable; previous links retained" });
      }
    }
    card.detailLinks = mergeDocumentLinks([...(prior?.links || []), ...card.detailLinks]);
    if (resourceMention && !card.detailLinks.length) {
      throw new Error(`SCYS_DOCUMENT_LINK_UNRESOLVED:${identity.entityId}`);
    }
    const body = JSON.stringify({ articleContent: card.original, articleContentContainFeishuDoc: card.merged });
    const contentHash = crypto.createHash("sha256").update(body).digest("hex");
    const collectedAt = new Date(now).toISOString();
    originals.push({
      body, contentHash, snapshotRef: `community/scys/${identity.entityId}/${contentHash}.json`,
      sourceUrl: card.url, collectedAt, dataDate: new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date(now)),
      metadata: { title: card.title, source_url: card.url, captured_at: collectedAt, content_hash: contentHash, lane: "community_lead" },
    });
    for (const job of matches) {
      const normalized = normalizeCard("scys", card, job);
      normalized.links = card.detailLinks;
      normalized.bodyRef = `evidence://${contentHash}`;
      normalized.acquisition = "scys-mcp";
      normalized.entityType = identity.entityType;
      normalized.entityId = identity.entityId;
      normalized.feishuBodyAvailable = Boolean(card.merged);
      normalized.relatedResources = [];
      const keyword = resourceKeyword(card, job);
      if (keyword) {
        if (!relatedCache.has(keyword)) {
          try {
            const resources = await relatedScysResources(call, keyword);
            relatedCache.set(keyword, resources);
            warnings.push(...(resources.warnings || []));
          }
          catch { relatedCache.set(keyword, []); warnings.push({ source: "scys", mode: "related-resources", keyword, message: "Related resource lookup failed" }); }
        }
        normalized.relatedResources = relatedCache.get(keyword);
      }
      items.push(normalized);
    }
  }
  return {
    items, originals, warnings,
    coverage: { queries: coverage, discovered: discoveries.size, detailed: Math.min(discoveries.size, maxPosts), truncated: discoveries.size > maxPosts },
  };
}
