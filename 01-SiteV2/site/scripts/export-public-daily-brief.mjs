import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.resolve(__dirname, "..");
const projectRoot = path.resolve(siteDir, "..", "..");
const dataPath = path.join(siteDir, "data", "site-content.json");

const args = new Map(process.argv.slice(2).map((item) => {
  const [key, ...rest] = item.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

const cleanText = (value = "") => String(value || "")
  .replace(/^#{1,6}\s*/gm, "")
  .replace(/\*\*(.*?)\*\*/g, "$1")
  .replace(/`([^`]+)`/g, "$1")
  .replace(/\s+/g, " ")
  .trim();

const short = (value = "", limit = 120) => {
  const text = cleanText(value);
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

const escapeHtml = (value = "") => cleanText(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const safeUrl = (value = "") => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
};

const dateParam = (value = "") => cleanText(value).replaceAll(".", "-").slice(0, 10);
const dateLabel = (value = "") => dateParam(value).replaceAll("-", ".");

const typeLabel = (type = "") => ({
  funding: "融资",
  case: "案例",
  product_service: "产品",
  "product-service": "产品",
  partnership: "合作",
})[String(type || "").trim()] || "信号";

const titleForSignal = (signal = {}) => cleanText(
  signal.frontend?.sourceTitleTranslation
  || signal.frontend?.displayTitle
  || signal.title
  || "商业信号",
);

const signalScore = (signal = {}, index = 0) => {
  const rawScore = Number(signal.importanceScore || signal.rawImportanceScore || signal.poolScore || 0);
  const sourceScore = { S: 8, A: 6, B: 4, C: 2 }[String(signal.sourceLevel || signal.frontend?.sourceLinks?.[0]?.level || "").toUpperCase()] || 3;
  const typeScore = signal.signalType === "case" ? 4 : signal.signalType === "funding" ? 3 : 2;
  const tagScore = Math.min(4, (signal.tags || []).length);
  const base = rawScore ? 62 + rawScore * 5 : 66;
  return Math.max(60, Math.min(98, Math.round(base + sourceScore + typeScore + tagScore - index)));
};

const tagNames = (item = {}, group, limit = 2) => (item.tags || [])
  .filter((tag) => !group || tag.group === group)
  .map((tag) => tag.name)
  .filter(Boolean)
  .slice(0, limit);

const impactArea = (signal = {}) => {
  const values = [
    ...tagNames(signal, "track", 1),
    ...tagNames(signal, "function", 1),
    ...tagNames(signal, "scenario", 1),
  ];
  return values.length ? values.join(" / ") : "企业工作流 / AI Agent";
};

const introLine = (signal = {}, limit = 150) => {
  const event = cleanText(signal.frontend?.eventLine || signal.event || signal.brief || "");
  const title = titleForSignal(signal);
  const match = event.match(/材料(?:显示|把|称)?(?:它|资金用途|这项能力)?(?:已经)?(?:面向|指向|对应|用于)([^。；，]+)/u)
    || title.match(/面向([^。；，]+?)(?:的 AI 能力|流程|发布|融资|$)/u);
  const target = cleanText(match?.[1] || "")
    .replace(/^(企业|客户)?/u, "")
    .replace(/的 AI 能力$/u, "");
  if (target.length >= 4) {
    if (typeLabel(signal.signalType || signal.type) === "融资") {
      return short(`资金用途指向${target}，可以继续看它是否带来客户采用、预算归属或交付方式变化。`, limit);
    }
    if (typeLabel(signal.signalType || signal.type) === "案例") {
      return short(`案例落在${target}，更值得看的是它是否已经嵌入具体任务或客户环境。`, limit);
    }
    return short(`这类发布把 AI 能力落在${target}，重点看它能否进入具体岗位、系统调用和交付责任。`, limit);
  }
  return short(`${impactArea(signal)} 正在出现新的采用线索，重点不是功能本身，而是它是否会改变客户采购、团队分工和交付责任。`, limit);
};

const commentLine = (signal = {}, limit = 150) => short(
  signal.frontend?.businessMeaning
  || signal.businessMeaning
  || signal.frontend?.whyWatch
  || signal.judgment
  || signal.brief
  || "继续观察客户采用、预算归属和交付责任是否发生变化。",
  limit,
);

const sourceUrl = (item = {}) => safeUrl(item.sourceUrl || item.source_url || item.frontend?.sourceLinks?.[0]?.url || "");

const pointName = (point = {}) => cleanText(point.name || point.speaker || point.speakerLine || point.author || "Builder");
const pointTitle = (point = {}) => cleanText(point.identityTitle || point.role || point.title || point.sourceName || "公开观点来源");
const pointQuote = (point = {}) => short(point.translatedQuote || point.quoteChinese || point.quote || point.rawText || point.interpretation || point.calibrates || "这条观点值得继续跟踪。", 210);

const renderSignal = ({ signal }, index) => `
  <article class="signal">
    <div class="num"><span>${String(index + 1).padStart(2, "0")}</span><em>${escapeHtml(typeLabel(signal.signalType || signal.type))}</em></div>
    <div class="body">
      <h3>${escapeHtml(titleForSignal(signal))}</h3>
      <dl>
        <div><dt>介绍</dt><dd>${escapeHtml(introLine(signal))}</dd></div>
        <div><dt>点评</dt><dd>${escapeHtml(commentLine(signal))}</dd></div>
      </dl>
    </div>
    <footer>${sourceUrl(signal) !== "#" ? `<a href="${sourceUrl(signal)}" target="_blank" rel="noreferrer">阅读原文 →</a>` : ""}</footer>
  </article>
`;

const renderPoint = (point = {}, index = 0) => `
  <article class="side-card">
    <span class="kicker">BUILDER ${String(index + 1).padStart(2, "0")}</span>
    <h3>${escapeHtml(pointName(point))}</h3>
    <p class="role">${escapeHtml(pointTitle(point))}</p>
    <blockquote>${escapeHtml(pointQuote(point))}</blockquote>
    ${sourceUrl(point) !== "#" ? `<a href="${sourceUrl(point)}" target="_blank" rel="noreferrer">阅读原文 →</a>` : ""}
  </article>
`;

const renderTopic = (topic = {}, index = 0, signal = {}) => `
  <article class="topic">
    <span>${String(index + 1).padStart(2, "0")}</span>
    <h3>${escapeHtml(topic.title || titleForSignal(signal))}</h3>
    <p><b>背景</b>${escapeHtml(topic.comment || topic.editorComment || introLine(signal, 170))}</p>
    <p><b>讨论问题</b>${escapeHtml(topic.conflict || "这件事会让企业先买更多 AI 工具，还是先改造能被 AI 接管的流程？")}</p>
    <small><b>相关信号</b>${escapeHtml(titleForSignal(signal))}</small>
  </article>
`;

const stylesheet = `
  :root { --ink:#071827; --muted:rgba(7,24,39,.62); --line:rgba(7,24,39,.1); --gold:#9b742e; --paper:#fffdf8; --warm:#f7f4ef; }
  * { box-sizing:border-box; }
  body { margin:0; background:linear-gradient(180deg,var(--warm),var(--paper) 42%,var(--warm)); color:var(--ink); font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif; }
  main { width:min(1240px,calc(100% - 104px)); margin:34px auto 70px; padding:30px 34px 38px; border:1px solid var(--line); background:var(--paper); }
  header.hero { display:grid; grid-template-columns:1fr auto; gap:28px; align-items:center; padding:18px 0 22px; border-bottom:1px solid var(--line); }
  .kicker { color:rgba(7,24,39,.5); font-family:Georgia,"Times New Roman",serif; font-size:10px; font-weight:700; letter-spacing:.16em; }
  h1 { margin:6px 0 0; font-family:Georgia,"Times New Roman","Noto Serif SC",serif; font-size:44px; line-height:50px; background:linear-gradient(95deg,#071827 0%,#0d355c 58%,#9b742e 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .date { color:var(--muted); font-family:Georgia,"Times New Roman",serif; font-size:14px; }
  .layout { display:grid; grid-template-columns:minmax(0,1fr) 342px; gap:24px; margin-top:22px; }
  section { margin-top:34px; }
  .layout section { margin-top:0; }
  .section-head { margin-bottom:14px; }
  .section-head h2 { margin:6px 0 0; font-family:Georgia,"Times New Roman","Noto Serif SC",serif; font-size:26px; line-height:34px; }
  .list, .side { display:grid; gap:10px; }
  .signal { display:grid; grid-template-columns:46px minmax(0,1fr) 108px; min-height:100px; border:1px solid rgba(7,24,39,.075); background:rgba(255,253,248,.74); }
  .num { display:grid; align-content:start; gap:4px; padding:12px 8px; border-right:1px solid rgba(7,24,39,.075); background:rgba(247,244,239,.56); }
  .num span { color:rgba(7,24,39,.58); font:700 11px/16px Consolas,monospace; }
  .num em { color:var(--gold); font-size:11px; font-style:normal; line-height:16px; }
  .body { padding:12px 14px; }
  h3 { margin:0 0 7px; font-family:"Noto Serif SC",Georgia,serif; font-size:15px; line-height:23px; }
  dl { display:grid; gap:4px; margin:0; }
  dl div { display:grid; grid-template-columns:42px minmax(0,1fr); gap:8px; }
  dt { color:rgba(7,24,39,.42); font-size:11px; line-height:18px; }
  dd { margin:0; color:rgba(7,24,39,.68); font-size:11px; line-height:18px; }
  footer { display:grid; place-content:center; padding:12px 10px; border-left:1px solid rgba(7,24,39,.075); }
  a { color:#0d355c; font-size:12px; font-weight:700; text-decoration:none; }
  .side-card, .trend, .topic { border:1px solid var(--line); border-left:2px solid rgba(200,167,102,.42); background:rgba(255,253,248,.74); padding:14px; }
  .side-card .role, .trend p, .topic p, .topic small { color:var(--muted); font-size:12px; line-height:20px; }
  blockquote { margin:10px 0 8px; color:rgba(7,24,39,.72); font-size:12px; line-height:20px; }
  .topic-grid { display:grid; grid-template-columns:1.15fr 1fr 1fr; gap:12px; }
  .topic span { color:var(--gold); font-family:Georgia,"Times New Roman",serif; font-size:12px; }
  .topic b { display:block; margin-bottom:3px; color:rgba(7,24,39,.46); font-weight:500; }
  @media (max-width: 960px) { main { width:min(100% - 32px,1240px); padding:22px; } header.hero, .layout, .topic-grid { grid-template-columns:1fr; } }
  @media (max-width: 640px) { main { width:min(100% - 24px,1240px); padding:18px; } h1 { font-size:36px; line-height:42px; } .signal { grid-template-columns:42px minmax(0,1fr); } footer { grid-column:1/-1; justify-content:start; padding:8px 10px 12px 56px; border-left:0; border-top:1px solid rgba(7,24,39,.075); } }
`;

const data = JSON.parse(await readFile(dataPath, "utf8"));
const requestedDate = args.get("date") || data.contentIndex?.activeDate || data.meta?.date;
const date = dateParam(requestedDate);
const outputRoot = path.resolve(projectRoot, args.get("out") || path.join("01-SiteV2", "site", "public-daily-brief"));
const outputDir = path.join(outputRoot, date);

const signals = (data.contentIndex?.signals || [])
  .filter((signal) => dateParam(signal.date || signal.originalDate) === date)
  .map((signal, index) => ({ signal, score: signalScore(signal, index) }))
  .sort((a, b) => b.score - a.score || String(a.signal.id || "").localeCompare(String(b.signal.id || "")))
  .slice(0, 10);

if (!signals.length) {
  throw new Error(`No public Daily Brief signals found for ${date}. Please run the content/card pipeline or export a date that exists in site-content.json.`);
}

const points = (data.contentIndex?.points || [])
  .filter((point) => dateParam(point.date || point.originalDate) === date)
  .slice(0, 3);

const trends = [
  ...(data.contentIndex?.trends || []),
  ...(data.contentIndex?.trendReports || []),
].filter((trend) => dateParam(trend.date || trend.originalDate || trend.period) === date);

const topics = (data.contentIndex?.pitchTopics || [])
  .filter((topic) => dateParam(topic.date) === date)
  .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
  .slice(0, 3);

const primaryTrend = trends[0] || {
  title: titleForSignal(signals[0]?.signal),
  oneLine: introLine(signals[0]?.signal, 150),
  nextObservation: "继续观察客户采用、预算归属和交付责任是否发生变化。",
};

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(dateLabel(date))} 今日简报</title>
  <meta name="description" content="${escapeHtml(dateLabel(date))} 观澜 AI 公开版 Daily Brief">
  <style>${stylesheet}</style>
</head>
<body>
  <main>
    <header class="hero">
      <div>
        <span class="kicker">DAILY BRIEF</span>
        <h1>今日简报</h1>
      </div>
      <div class="date">${escapeHtml(dateLabel(date))}</div>
    </header>
    <div class="layout">
      <section>
        <div class="section-head"><span class="kicker">SIGNALS</span><h2>最值得关注的 10 个信号</h2></div>
        <div class="list">${signals.map(renderSignal).join("")}</div>
      </section>
      <aside class="side">
        <section>
          <div class="section-head"><span class="kicker">BUILDERS</span><h2>Builders 观点</h2></div>
          <div class="side">${points.length ? points.map(renderPoint).join("") : `<article class="side-card"><h3>暂无公开观点</h3><p class="role">这一天没有可展示的 Builder 观点。</p></article>`}</div>
        </section>
        <section>
          <div class="section-head"><span class="kicker">TRENDS</span><h2>趋势 / 话题</h2></div>
          <article class="trend">
            <span class="kicker">正在形成</span>
            <h3>${escapeHtml(primaryTrend.title || "趋势线索")}</h3>
            <p>${escapeHtml(short(primaryTrend.oneLine || primaryTrend.judgment || primaryTrend.whyForming || introLine(signals[0]?.signal), 160))}</p>
            <p>${escapeHtml(short(primaryTrend.nextObservation || primaryTrend.evidenceGaps || "继续观察客户采用、预算归属和交付责任是否发生变化。", 130))}</p>
          </article>
        </section>
      </aside>
    </div>
    <section>
      <div class="section-head"><span class="kicker">DISCUSSION</span><h2>今日值得讨论</h2></div>
      <div class="topic-grid">${(topics.length ? topics : signals.slice(0, 3).map(({ signal }) => ({ title: titleForSignal(signal) }))).slice(0, 3).map((topic, index) => renderTopic(topic, index, signals[index]?.signal)).join("")}</div>
    </section>
  </main>
</body>
</html>
`;

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "index.html"), html, "utf8");
console.log(`Exported ${path.relative(projectRoot, path.join(outputDir, "index.html"))}`);
