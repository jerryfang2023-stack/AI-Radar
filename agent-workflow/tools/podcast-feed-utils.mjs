function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/$/u, "").toLowerCase();
}

export function dedupeSources(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeUrl(item.endpoint_or_url) || String(item.source_id || item.name || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function dedupeEpisodes(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeUrl(item.url) || `${String(item.title || "").trim().toLowerCase()}|${String(item.publishedAt || "")}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
