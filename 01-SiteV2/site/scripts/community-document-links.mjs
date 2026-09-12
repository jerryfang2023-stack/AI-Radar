const DOCUMENT_HOSTS = ["feishu.cn", "larksuite.com", "docs.qq.com", "kdocs.cn", "yuque.com"];
const clean = (value) => String(value || "").trim();
const entities = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const decode = (value) => { try { return decodeURIComponent(entities(value)); } catch { return entities(value); } };

export function documentUrl(value) {
  const text = entities(clean(value)).split(/[\u200b-\u200f\u2060\ufeff\s<>"']/u)[0].replace(/[.,;!，。；！）)]+$/u, "");
  if (/\.\.\.|…/u.test(text)) return "";
  try {
    const url = new URL(text);
    if (!/^https?:$/.test(url.protocol)) return "";
    if (!DOCUMENT_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) return "";
    return url.href;
  } catch { return ""; }
}

export function documentKey(value) {
  const href = documentUrl(value);
  if (!href) return "";
  const url = new URL(href);
  url.hash = "";
  for (const key of ["from", "fromScene", "utm_source", "utm_medium", "utm_campaign"]) url.searchParams.delete(key);
  return url.href;
}

export function mergeDocumentLinks(links = []) {
  const byKey = new Map();
  const displayArtifacts = new Set();
  for (const link of links) {
    const href = documentUrl(link?.href);
    if (!href) continue;
    const key = documentKey(href);
    const existing = byKey.get(key);
    const text = clean(link.text);
    const displayPrefix = text.replace(/(?:\.\.\.|…)$/u, "");
    if (displayPrefix !== text && /^https?:/i.test(displayPrefix) && href.startsWith(displayPrefix)) {
      displayArtifacts.add(displayPrefix);
    }
    const named = text && !/^https?:/i.test(text) && !/\.\.\.|…/u.test(text);
    byKey.set(key, {
      ...existing, ...link, href: existing?.href || href,
      text: named ? text : existing?.text || href,
    });
  }
  const values = [...byKey.values()];
  // Old DOM exports also captured shortened display text. Remove only when the
  // corresponding longer resource address is present, never by assumed ID length.
  return values.filter((link) => !displayArtifacts.has(link.href));
}

export function extractDocumentLinks(text = "", anchors = []) {
  const links = [];
  for (const anchor of anchors || []) {
    if (anchor?.href) links.push({ href: anchor.href, text: anchor.text, discoveredVia: "anchor" });
  }
  // SCYS uses percent-encoded <e type="web" href="..." title="..." />.
  const body = String(text || "").replace(/<(?:e|a)\b[^>]*>/gi, (tag) => {
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    const title = tag.match(/\btitle\s*=\s*["']([^"']*)["']/i)?.[1];
    if (href) links.push({ href: decode(href), text: decode(title || ""), discoveredVia: "post_href" });
    return " ";
  });
  for (const match of body.matchAll(/https?:\/\/[^\s\u200b-\u200f\u2060\ufeff"'<>，。）、)]+/gi)) {
    links.push({ href: match[0], text: match[0], discoveredVia: "body_url" });
  }
  return mergeDocumentLinks(links);
}

export function retainDocumentLinks(items, previous = []) {
  const key = (item) => {
    const match = String(item.url || "").match(/articleDetail\/(xq_topic|forum_topic)\/(\d+)/);
    return match ? `scys:${match[1]}:${match[2]}` : `${item.source}:${item.url}:${item.title}`;
  };
  const old = new Map(previous.map((item) => [key(item), item]));
  return items.map((item) => ({
    ...item,
    links: mergeDocumentLinks([...(old.get(key(item))?.links || []), ...(item.links || [])]),
  }));
}

export function documentRetentionProblems(items, previous = []) {
  const retained = retainDocumentLinks(items, previous);
  return retained.flatMap((item, index) => {
    const actual = new Set(mergeDocumentLinks(items[index].links || []).map((link) => documentKey(link.href)));
    return item.links.filter((link) => !actual.has(documentKey(link.href)))
      .map(() => `${item.id}:previous_document_link_missing`);
  });
}

export function buildDocumentIndex(items) {
  const index = new Map();
  for (const item of items) {
    for (const link of mergeDocumentLinks(item.links || [])) {
      const key = documentKey(link.href);
      const owner = { itemId: item.id, itemTitle: item.title, itemUrl: item.originalUrl || item.url, source: item.source, sourceName: item.sourceName };
      if (!index.has(key)) index.set(key, { href: link.href, text: link.text || link.href, ...owner, owners: [] });
      const resource = index.get(key);
      if (!resource.owners.some((entry) => entry.itemId === item.id)) resource.owners.push(owner);
    }
  }
  return [...index.values()];
}
