let pending = null;
let observations = {};
let selection = null;
function parseSelection(value) {
  if (value === undefined || value === null) return null;
  if (value.schemaVersion !== 1 || !Array.isArray(value.windows) || value.windows.length > 4096) throw new Error('Invalid featured selection');
  let previousEnd = -Infinity;
  const windows = value.windows.map(window => {
    const start = Date.parse(window.startsAt), end = Date.parse(window.endsAt);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end || start < previousEnd) throw new Error('Invalid featured window');
    previousEnd = end;
    const markets = {};
    for (const market of ['global', 'china']) {
      const rows = window.markets?.[market];
      if (!Array.isArray(rows) || rows.length > 3 || new Set(rows.map(r => r.fundingId)).size !== rows.length) throw new Error('Invalid featured market');
      markets[market] = rows.map(row => {
        if (!/^FI-[a-z0-9]+$/i.test(row.fundingId || '') || !/^\d{4}-\d{2}-\d{2}$/.test(row.date || '')) throw new Error('Invalid featured ID');
        return { fundingId: row.fundingId, date: row.date };
      });
    }
    return { startsAt: window.startsAt, endsAt: window.endsAt, markets };
  });
  return { schemaVersion: 1, windows };
}
function parseObservations(payload) {
  if (payload?.schemaVersion !== 1 || !Array.isArray(payload.entries) || payload.entries.length > 1000) throw new Error("Invalid observations");
  const result = {};
  for (const e of payload.entries) {
    if (!/^FI-[a-z0-9]+$/i.test(e.fundingId || "") || typeof e.institution !== "string" || typeof e.summary !== "string" || !e.institution.trim() || !e.summary.trim() || !/^https:\/\//.test(e.sourceUrl || "")) throw new Error("Invalid observation");
    const attributed = `${e.institution.trim()}：${e.summary.trim()}`;
    if (attributed.length > 80 || result[e.fundingId]) throw new Error("Invalid observation length or duplicate");
    const text = e.institution.trim() === "观澜分析" ? e.summary.trim() : attributed;
    result[e.fundingId] = text;
  }
  return result;
}
function refreshFeatured() {
  if (pending) return pending;
  pending = new Promise(resolve => {
    wx.request({ url: `https://www.zkdlj.vip/data/funding-featured.json?refresh=${Date.now()}`, timeout: 10000,
      success(response) {
        try {
          if (response.statusCode !== 200) throw new Error("Request failed");
          const nextObservations = parseObservations(response.data), nextSelection = parseSelection(response.data.selection);
          observations = nextObservations; selection = nextSelection;
        } catch (_) { /* keep last accepted in-memory copy, bounded by selection windows */ }
        resolve({ observations, selection });
      }, fail() { resolve({ observations, selection }); }
    });
  }).catch(() => ({ observations, selection })).then(value => { pending = null; return value; });
  return pending;
}
let pendingObservations = null;
function refreshObservations() {
  if (!pendingObservations) pendingObservations = refreshFeatured().then(value => { pendingObservations = null; return value.observations; });
  return pendingObservations;
}
function getFeatured() { return { observations, selection }; }
try {
  const bundled = require('../data/funding-featured.js');
  observations = parseObservations(bundled); selection = parseSelection(bundled.selection);
} catch (_) { /* a missing/invalid offline snapshot is not a latest-three recommendation */ }
module.exports = { parseObservations, parseSelection, refreshObservations, refreshFeatured, getFeatured };
