let pending = null;
let observations = {};
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
function refreshObservations() {
  if (pending) return pending;
  pending = new Promise(resolve => {
    wx.request({ url: `https://www.zkdlj.vip/data/funding-featured.json?refresh=${Date.now()}`, timeout: 10000,
      success(response) {
        try { if (response.statusCode !== 200) throw new Error("Request failed"); observations = parseObservations(response.data); } catch (_) { /* keep last accepted in-memory copy */ }
        resolve(observations);
      }, fail() { resolve(observations); }
    });
  }).then(value => { pending = null; return value; });
  return pending;
}
module.exports = { parseObservations, refreshObservations };
