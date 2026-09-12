// Original-link repair is separate from immutable snapshot identity and editorial keys.
export function canonicalScysUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'scys.com' || url.port || url.username || url.password) return '';
    return /^\/articleDetail\/(xq_topic|forum_topic)\/\d+\/?$/.test(url.pathname) ? url.origin + url.pathname.replace(/\/$/, '') : '';
  } catch { return ''; }
}
const normalize = value => String(value || '').normalize('NFKC').replace(/\s+/g, '').trim();
const identity = item => item.title && item.author ? JSON.stringify([normalize(item.title), normalize(item.author)]) : '';

export function resolveScysOriginalLinks(items, resolutions = []) {
  const known = new Map();
  for (const item of items) {
    const url = canonicalScysUrl(item.url) || canonicalScysUrl(item.originalUrl);
    const key = identity(item);
    if (url && key) { if (!known.has(key)) known.set(key, new Set()); known.get(key).add(url); }
  }
  const verified = new Map();
  for (const entry of resolutions) {
    const url = canonicalScysUrl(entry.url);
    if (!url || !entry.id || !identity(entry) || entry.basis !== 'mcp-exact-title-author') throw new Error('Invalid SCYS original-link resolution');
    if (verified.has(entry.id)) throw new Error('Duplicate SCYS original-link resolution');
    verified.set(entry.id, entry);
    const key = identity(entry);
    if (!known.has(key)) known.set(key, new Set());
    known.get(key).add(url);
  }
  const resolved = items.map(item => {
    if (canonicalScysUrl(item.url)) return item;
    const entry = verified.get(item.id);
    if (entry && identity(entry) !== identity(item)) throw new Error('SCYS original-link identity mismatch: ' + item.id);
    const matches = known.get(identity(item));
    const originalUrl = canonicalScysUrl(item.originalUrl) || (entry ? canonicalScysUrl(entry.url) : '') || (matches?.size === 1 ? [...matches][0] : '');
    return originalUrl ? { ...item, originalUrl } : item;
  });
  return { items: resolved, unresolved: resolved.filter(item => !canonicalScysUrl(item.originalUrl || item.url)).map(item => item.id) };
}
