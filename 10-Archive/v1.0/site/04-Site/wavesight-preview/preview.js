const data = window.AI_RADAR_DATA || { signals: [], scoring: { rows: [] }, trends: [], opportunities: [] };

const clean = (value = "") => String(value).replace(/[🔥👀📈📊⬆➡]/g, "").trim();
const shortText = (value = "", max = 54) => {
  const text = clean(typeof value === "string" ? value : value?.["一句话机会定义"] || Object.values(value || {}).find(Boolean) || "");
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const normalize = (value = "") => clean(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const sameName = (left = "", right = "") => {
  const a = normalize(left);
  const b = normalize(right);
  return a && b && (a.includes(b) || b.includes(a));
};

function scoreOf(signal = {}) {
  if (signal.score) return signal.score;
  return (data.scoring.rows || []).find((row) => row.date === signal.date && (sameName(row.product, signal.product) || sameName(row.product, signal.title))) || null;
}

function latestSignalDate() {
  return [...new Set((data.signals || []).map((signal) => signal.date).filter(Boolean))].sort().at(-1) || "";
}

function signalUrl(signal = {}) {
  return `../signals.html?slug=${encodeURIComponent(signal.slug || signal.id || "")}`;
}

function trendUrl(trend = {}) {
  return `../trend.html?slug=${encodeURIComponent(trend.slug || trend.track || "")}`;
}

function opportunityUrl(item = {}) {
  return `../opportunity.html?slug=${encodeURIComponent(item.slug || item.id || "")}`;
}

function renderHighlights() {
  const box = document.querySelector("#previewHighlights");
  if (!box) return;
  const latestDate = latestSignalDate();
  const topSignals = (data.signals || [])
    .filter((signal) => !latestDate || signal.date === latestDate)
    .sort((a, b) => (scoreOf(b)?.total || 0) - (scoreOf(a)?.total || 0))
    .slice(0, 3);
  const rising = (data.trends || []).filter((trend) => /上升|持续/.test(`${trend.sevenDay || ""}${trend.thirtyDay || ""}`)).slice(0, 3);
  const topOpps = [...(data.opportunities || [])].sort((a, b) => (b.urgency || 0) - (a.urgency || 0)).slice(0, 3);

  const empty = (text) => `<p class="highlight-empty">${text}</p>`;
  box.innerHTML = `
    <article class="highlight-card">
      <p>信号</p>
      <h3>今天先看这几个信号</h3>
      ${
        topSignals.length
          ? topSignals.map((signal) => `<a href="${signalUrl(signal)}"><strong>${clean(signal.product)}</strong><span>${clean(signal.track || "-")} · ${clean(scoreOf(signal)?.total || "-")}/30</span><small>${shortText(signal.summary || signal.title)}</small></a>`).join("")
          : empty("今日暂无新的强信号，建议回看完整 Daily Brief。")
      }
    </article>
    <article class="highlight-card">
      <p>趋势</p>
      <h3>正在升温的方向</h3>
      ${
        rising.length
          ? rising.map((trend) => `<a href="${trendUrl(trend)}"><strong>${clean(trend.track)}</strong><span>${clean(trend.thirtyDay || trend.sevenDay || "-")}</span><small>${shortText(trend.verdict || trend.thirtyDay || trend.sevenDay)}</small></a>`).join("")
          : empty("今日暂无明显升温方向，建议查看完整趋势库。")
      }
    </article>
    <article class="highlight-card">
      <p>机会</p>
      <h3>值得进一步验证的机会</h3>
      ${
        topOpps.length
          ? topOpps.map((opp) => `<a href="${opportunityUrl(opp)}"><strong>${clean(opp.title)}</strong><span>${clean(opp.priority || "-")} · 紧迫度 ${clean(opp.urgency || "-")}/5</span><small>${shortText(opp.summary || opp.industry)}</small></a>`).join("")
          : empty("今日暂无高紧迫度机会卡，建议查看完整机会库。")
      }
    </article>
  `;
}

renderHighlights();
