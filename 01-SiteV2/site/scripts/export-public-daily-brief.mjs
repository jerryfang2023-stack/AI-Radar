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

const signalText = (signal = {}) => cleanText([
  signal.frontend?.sourceTitle,
  signal.frontend?.displayTitle,
  signal.frontend?.eventLine,
  signal.title,
].filter(Boolean).join(" "));

const strictEditorComment = (signal = {}, limit = 190) => {
  const text = signalText(signal);
  const lower = text.toLowerCase();

  if (/webwright/u.test(lower)) {
    return short("这不是又一个浏览器代理 demo，而是把网页操作变成可测试、可复现、可计分的工程对象。真正值得看的是：企业未来采购的可能不是“会点网页的 Agent”，而是一层能进测试、审计和交付流程的操作能力。", limit);
  }
  if (/claude code|缩放算法|scaling algorithms/u.test(lower)) {
    return short("这仍是研究信号，不是可直接采购的产品。但它重要在于：代码代理开始进入算法搜索本身。如果这种探索能稳定复现，模型团队的差距会从“谁更会调参”转向“谁能把研究过程自动化”。", limit);
  }
  if (/gated deltanet|linear attention|nvidia/u.test(lower)) {
    return short("这类底层结构离老板很远，但离成本很近。它的价值要落到更低推理成本、更长上下文或更高吞吐；落不到这些指标上，就只是论文和工程社区里的技术热闹。", limit);
  }
  if (/multi-agent ai sales|sales crew|sql conversion|dreamztech/u.test(lower)) {
    return short("这更像销售自动化案例，不应被粗暴理解成融资信号。可看的不是“多 Agent”概念，而是线索筛选、CRM 写回、销售跟进和收入归因是否真的连成闭环。没有客户留存和复购数据前，只能当案例线索。", limit);
  }
  if (/telli|phone operations|livekit|enterprise phone/u.test(lower)) {
    return short("语音 Agent 的商业价值不在能不能接电话，而在能不能处理打断、噪声、转人工、质检和合规留痕。高频电话场景有预算，下一步要看它能否把失败收尾和人工接管做成稳定流程。", limit);
  }
  if (/cheap ai|openai|anthropic|ipo/u.test(lower)) {
    return short("这不是资本市场八卦，而是模型公司商业模式的压力测试。低价模型会迫使企业把能力、成本、供应商锁定和数据边界放在同一张表里比较，高估值公司的护城河会被重新审问。", limit);
  }
  if (/compute commit|capacity|3-year|算力承诺/u.test(lower)) {
    return short("这条信号的核心不是 Capacity，而是算力采购正在合同化。多年算力承诺换来价格确定性，也把模型路线变化和需求预测误差提前写进合同；这会把 CFO 拉进 AI 决策桌。", limit);
  }
  if (/字节跳动|bytedance|多模态|长文档/u.test(lower)) {
    return short("这不是融资新闻，而是训练方法信号：长文档能力可能不只靠更多文本堆料，而要让模型直接理解版面、图表和上下文结构。对企业知识库来说，文档解析质量会比向量库参数更关键。", limit);
  }
  if (/stepaudio|voice model|语音模型/u.test(lower)) {
    return short("语音模型的看点不在拟真，而在能否承接真实服务流程：情绪、停顿、方言、转人工和质检。客服、销售和培训会先试，真正的分水岭是错了以后谁接手、怎么补救。", limit);
  }
  if (/constraint|约束|后端代码|backend code/u.test(lower)) {
    return short("这条信号提醒企业：AI 编程的风险不是代码不会生成，而是越做越容易忘掉约束。真正的采购重点应转向测试、审查、任务拆分和回滚机制，而不是单纯比较生成速度。", limit);
  }

  const title = titleForSignal(signal);
  if (signal.signalType === "funding") {
    return short(`先别只看融资金额，要看钱会不会换来可重复交付。${title}只有同时出现客户名单、明确场景和收入留存，才算商业信号；否则只是市场对 AI 叙事的再押注。`, limit);
  }
  if (signal.signalType === "case") {
    return short(`这条案例的价值不在“用了 AI”，而在它是否改写了岗位分工、交付责任和成本结构。没有上线范围、失败处理和效果指标，就只能作为观察样本，不能当成熟趋势。`, limit);
  }
  if (signal.signalType === "product_service" || signal.signalType === "product-service") {
    return short(`产品发布只有在进入真实流程时才重要。接下来要看它是否给出客户场景、部署路径、权限设计和计费方式；没有这些，能力再新也只是供应商展示。`, limit);
  }
  return short(signal.frontend?.whyWatch || signal.frontend?.businessMeaning || signal.businessMeaning || "这条材料可以保留为观察线索，但还不足以支撑商业结论。继续看客户采用、付费意愿、交付责任和可复用场景是否出现。", limit);
};

const dateSelector = (currentDate = "", availableDates = [], prefix = "./") => {
  const dates = availableDates
    .map((item) => dateParam(item.date || item))
    .filter(Boolean);
  const current = dates.includes(currentDate) ? currentDate : dates[0] || currentDate;
  const [currentYear = "", currentMonth = "", currentDay = ""] = current.split("-");
  const years = [...new Set(dates.map((date) => date.split("-")[0]))];
  const months = [...new Set(dates
    .filter((date) => date.startsWith(`${currentYear}-`))
    .map((date) => date.split("-")[1]))];
  const days = [...new Set(dates
    .filter((date) => date.startsWith(`${currentYear}-${currentMonth}-`))
    .map((date) => date.split("-")[2]))];
  const routes = dates.map((date) => ({ date, href: `${prefix}${date}/` }));

  return `
  <div class="date-picker" data-routes="${escapeHtml(JSON.stringify(routes))}">
    <label>
      <span>年</span>
      <select data-date-part="year" aria-label="选择年份">
        ${years.map((year) => `<option value="${year}" ${year === currentYear ? "selected" : ""}>${year}</option>`).join("")}
      </select>
    </label>
    <label>
      <span>月</span>
      <select data-date-part="month" aria-label="选择月份">
        ${months.map((month) => `<option value="${month}" ${month === currentMonth ? "selected" : ""}>${Number(month)}月</option>`).join("")}
      </select>
    </label>
    <label>
      <span>日</span>
      <select data-date-part="day" aria-label="选择日期">
        ${days.map((day) => `<option value="${day}" ${day === currentDay ? "selected" : ""}>${Number(day)}日</option>`).join("")}
      </select>
    </label>
  </div>
`;
};

const renderSignal = ({ signal }, index) => `
  <article class="signal">
    <div class="num"><span>${String(index + 1).padStart(2, "0")}</span><em>${escapeHtml(typeLabel(signal.signalType || signal.type))}</em></div>
    <div class="body">
      <h3>${escapeHtml(titleForSignal(signal))}</h3>
      <dl>
        <div><dt>点评</dt><dd>${escapeHtml(strictEditorComment(signal))}</dd></div>
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
  .title-row { display:flex; align-items:baseline; gap:14px; flex-wrap:wrap; }
  h1 { margin:6px 0 0; font-family:Georgia,"Times New Roman","Noto Serif SC",serif; font-size:44px; line-height:50px; background:linear-gradient(95deg,#071827 0%,#0d355c 58%,#9b742e 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .date-tools { display:grid; justify-items:end; gap:10px; }
  .date { color:var(--gold); font-family:Georgia,"Times New Roman",serif; font-size:14px; font-weight:700; }
  .date-picker { display:flex; align-items:center; gap:8px; padding:8px 10px; border:1px solid var(--line); border-radius:999px; background:rgba(247,244,239,.72); }
  .date-picker label { display:inline-flex; align-items:center; gap:5px; }
  .date-picker span { color:rgba(7,24,39,.5); font-size:12px; }
  .date-picker select { min-height:30px; border:1px solid rgba(7,24,39,.12); border-radius:999px; background:var(--paper); color:var(--ink); font:700 12px/18px Georgia,"Times New Roman",serif; padding:4px 26px 4px 10px; }
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
  @media (max-width: 960px) { main { width:min(100% - 32px,1240px); padding:22px; } header.hero, .layout, .topic-grid { grid-template-columns:1fr; } .date-tools { justify-items:start; } }
  @media (max-width: 640px) { main { width:min(100% - 24px,1240px); padding:18px; } h1 { font-size:36px; line-height:42px; } .date-picker { flex-wrap:wrap; border-radius:16px; } .signal { grid-template-columns:42px minmax(0,1fr); } footer { grid-column:1/-1; justify-content:start; padding:8px 10px 12px 56px; border-left:0; border-top:1px solid rgba(7,24,39,.075); } }
`;

const dateScript = `
<script>
(() => {
  const unique = (values) => [...new Set(values.filter(Boolean))];
  const replaceOptions = (select, values, suffix = "") => {
    const previous = select.value;
    select.innerHTML = values.map((value) => {
      const label = suffix ? String(Number(value)) + suffix : value;
      return '<option value="' + value + '">' + label + '</option>';
    }).join("");
    select.value = values.includes(previous) ? previous : values[0] || "";
  };

  document.querySelectorAll(".date-picker").forEach((root) => {
    const routes = JSON.parse(root.dataset.routes || "[]");
    const selects = {
      year: root.querySelector('[data-date-part="year"]'),
      month: root.querySelector('[data-date-part="month"]'),
      day: root.querySelector('[data-date-part="day"]'),
    };

    const sync = () => {
      const year = selects.year.value;
      const months = unique(routes.filter((route) => route.date.startsWith(year + "-")).map((route) => route.date.split("-")[1]));
      replaceOptions(selects.month, months, "月");
      const month = selects.month.value;
      const days = unique(routes.filter((route) => route.date.startsWith(year + "-" + month + "-")).map((route) => route.date.split("-")[2]));
      replaceOptions(selects.day, days, "日");
    };

    const navigate = () => {
      sync();
      const date = [selects.year.value, selects.month.value, selects.day.value].join("-");
      const target = routes.find((route) => route.date === date);
      if (target && target.href) window.location.href = target.href;
    };

    Object.values(selects).forEach((select) => select.addEventListener("change", navigate));
  });
})();
</script>
`;

const data = JSON.parse(await readFile(dataPath, "utf8"));
const availableDates = (data.contentIndex?.dates || [])
  .filter((item) => Number(item.signalCount || 0) > 0)
  .map((item) => ({
    ...item,
    date: dateParam(item.date || item.label),
  }))
  .filter((item) => item.date);
const requestedDate = args.get("date") || availableDates[0]?.date || data.contentIndex?.activeDate || data.meta?.date;
const selectedDate = dateParam(requestedDate);
const outputRoot = path.resolve(projectRoot, args.get("out") || path.join("01-SiteV2", "site", "public-daily-brief"));

const buildDailyBriefHtml = (date = selectedDate, selectorPrefix = "../") => {
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

  return `<!doctype html>
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
        <div class="title-row">
          <h1>今日简报</h1>
          <div class="date">${escapeHtml(dateLabel(date))}</div>
        </div>
      </div>
      <div class="date-tools">
        ${dateSelector(date, availableDates, selectorPrefix)}
      </div>
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
  ${dateScript}
</body>
</html>
`;
};

const datesToExport = args.get("all") === "true"
  ? availableDates.map((item) => item.date)
  : [selectedDate];

if (!datesToExport.length) {
  throw new Error("No public Daily Brief dates found in site-content.json.");
}

await mkdir(outputRoot, { recursive: true });

for (const date of datesToExport) {
  const outputDir = path.join(outputRoot, date);
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), buildDailyBriefHtml(date, "../"), "utf8");
  console.log(`Exported ${path.relative(projectRoot, path.join(outputDir, "index.html"))}`);
}

const rootDate = datesToExport.includes(selectedDate) ? selectedDate : datesToExport[0];
await writeFile(path.join(outputRoot, "index.html"), buildDailyBriefHtml(rootDate, "./"), "utf8");
