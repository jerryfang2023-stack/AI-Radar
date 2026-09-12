(function (scope) {
  "use strict";
  const version = "CINT-V1.4.2-vi-alignment";
  function key(item) {
    const match = String(item.url || "").match(/articleDetail\/(xq_topic|forum_topic)\/(\d+)/);
    return match ? `${match[1]}:${match[2]}` : `title:${String(item.title || item.id).trim()}`;
  }
  function weekRange(date) {
    const day = new Date(`${date}T00:00:00Z`);
    if (!Number.isFinite(day.getTime())) return { start: "", end: "" };
    day.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
    const start = day.toISOString().slice(0, 10);
    day.setUTCDate(day.getUTCDate() + 6);
    return { start, end: day.toISOString().slice(0, 10) };
  }
  function review(item, editorial) {
    const entry = editorial?.reviews?.[key(item)];
    return entry && entry.bodyRef === item.bodyRef ? entry : null;
  }
  function profile(item, editorial) {
    const entry = review(item, editorial);
    const text = `${item.title || ""} ${item.evidence || ""}`;
    return {
      caseMaterial: Boolean(entry) || (/AI|Codex|Claude|MCP|大模型|智能体|自动化|ChatGPT|人工智能/i.test(text)
        && /项目|产品|复盘|交付|客户|工具|获客|实操|开发|工作流|需求/.test(text)),
      industry: entry?.industry || "待整理",
      offering: entry?.offering || "待整理",
      stage: entry?.stage || "待整理",
      channel: entry?.channel || "待整理",
      fields: entry?.fields || {},
      reviewed: Boolean(entry),
    };
  }
  function resources(items, index = []) {
    const ids = new Set(items.map((item) => item.id));
    return index.map((link) => ({ ...link, owners: (link.owners || [link]).filter((owner) => ids.has(owner.itemId)) }))
      .filter((link) => link.owners.length);
  }
  function weekly(items, editorial, date) {
    const range = weekRange(date);
    const byKey = new Map(items.map((item) => [key(item), item]));
    return (editorial?.weekly || []).filter((entry) => entry.selectedAt >= range.start && entry.selectedAt <= range.end)
      .map((entry) => ({ ...entry, item: byKey.get(entry.itemKey) }))
      .filter((entry) => entry.item && review(entry.item, editorial));
  }
  scope.ScysCommunityModel = { version, key, weekRange, profile, review, resources, weekly };
})(globalThis);
