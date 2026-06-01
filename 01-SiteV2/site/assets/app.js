const hasSiteData = Boolean(window.WaveSightContent);
const data = window.WaveSightContent || {};

const navItems = [
  ["index.html", "首页"],
  ["daily.html", "今日观察"],
  ["signals.html", "商业信号"],
  ["trend-tracking.html", "趋势追踪"],
  ["brief.html", "商业内参"],
];

function getPageName() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  return page === "" ? "index.html" : page;
}

function safeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeAttribute(value = "") {
  return safeHtml(value).replaceAll("`", "&#96;");
}

function getStoredUser() {
  let user = {};
  try {
    user = JSON.parse(window.localStorage?.getItem("wavesight-user-profile") || "{}");
  } catch {
    user = {};
  }
  return {
    name: cleanText(user.name || ""),
    email: cleanText(user.email || ""),
    avatar: cleanText(user.avatar || window.localStorage?.getItem("wavesight-user-avatar") || ""),
  };
}

function navAvatarMarkup(isSignedIn) {
  const user = getStoredUser();
  if (isSignedIn && user.avatar) {
    return `<img src="${safeAttribute(user.avatar)}" alt="${safeAttribute(user.name || "用户头像")}">`;
  }
  return `<span class="nav-avatar-fallback" aria-hidden="true">AI</span>`;
}

function mountHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const page = getPageName();
  const memberState = getMemberState();
  const isSignedIn = memberState === "logged-in" || memberState === "member";
  const memberHref = isSignedIn ? "account.html" : "register.html";
  const memberLabel = isSignedIn ? "账户" : "注册/登录";
  const avatarHref = isSignedIn ? "account.html" : "login.html";
  const avatarLabel = isSignedIn ? "查看账户" : "注册或登录";
  const current = {
    "daily-detail.html": "daily.html",
    "signal-detail.html": "signals.html",
    "opinion.html": "signals.html",
    "opinion-detail.html": "signals.html",
    "trend-detail.html": "trend-tracking.html",
    "builders.html": "signals.html",
    "builder-detail.html": "signals.html",
  }[page] || page;

  header.innerHTML = `
    <div class="nav-shell">
      <a class="brand" href="index.html" aria-label="观澜AI 首页">
        <img class="brand-logo" src="assets/brand/logo-wavesight-reference-horizontal.svg" alt="观澜AI Wavesight AI">
      </a>
      <nav class="nav-links" id="siteNav" aria-label="主导航">
        ${navItems.map(([href, label]) => `<a href="${href}" ${current === href ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>
      <div class="nav-tools">
        <form class="nav-search-form" action="signals.html" role="search">
          <label class="sr-only" for="siteSearch">搜索</label>
          <input id="siteSearch" name="q" type="search" placeholder="搜索公司、信号或趋势" autocomplete="off">
        </form>
        <a class="nav-action" href="${memberHref}">${memberLabel}</a>
        <a class="nav-avatar" href="${avatarHref}" aria-label="${avatarLabel}">${navAvatarMarkup(isSignedIn)}</a>
      </div>
      <button class="menu-toggle" type="button" aria-controls="siteNav" aria-expanded="false">菜单</button>
    </div>
  `;

  const toggle = header.querySelector(".menu-toggle");
  const nav = header.querySelector("#siteNav");
  toggle?.addEventListener("click", () => {
    const next = !nav.classList.contains("open");
    nav.classList.toggle("open", next);
    toggle.setAttribute("aria-expanded", String(next));
  });
}

function mountFooter() {
  const footer = document.querySelector("[data-footer]");
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer">
      <div class="main-shell footer-shell">
        <a class="footer-mark" href="index.html" aria-label="观澜AI 首页">
          <img src="assets/brand/logo-wavesight-reference-horizontal.svg" alt="观澜AI Wavesight AI">
        </a>
        <div class="footer-legal">
          <span class="footer-copy">© 2026 WaveSight AI · V2.2.1</span>
          <a class="footer-icp" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true"></span>
            粤ICP备2021076703号-3
          </a>
        </div>
      </div>
    </div>
  `;
}

function itemTags(item, limit = 4) {
  return (item?.tags || []).slice(0, limit);
}

function cleanText(value = "") {
  return String(value)
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function summaryText(item, fallback = "这条观察仍在整理中。") {
  const candidates = [item?.brief, item?.dek, item?.judgment, item?.calibrates, item?.oneLine, fallback]
    .map(cleanText)
    .filter(Boolean);
  const picked = candidates.find((text) => !["导语", "发生了什么"].includes(text)) || fallback;
  return picked.length > 96 ? `${picked.slice(0, 96)}…` : picked;
}

function publicSummaryText(item, fallback = "这条内容提供背景，帮助判断信号是否持续。") {
  const text = summaryText(item, fallback)
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/\s*[-｜|]\s*$/u, "")
    .trim();
  if (text) return text;
  const type = item?.type || "相关内容";
  if (/机会/u.test(type)) return "这条内容帮助判断信号是否已经指向同一类客户、流程或预算变化。";
  if (/观点/u.test(type)) return "这条观点只用于判断参照，不替代客户采用、公司公告或监管材料。";
  if (/趋势/u.test(type)) return "这条背景用于观察证据是否在一段时间内持续增强。";
  return "这条内容补充来源、事实和接下来要看的线索。";
}

function articleText(value = "") {
  const lines = String(value)
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks = [];
  let list = [];
  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<ul class="article-list">${list.map((item) => `<li>${cleanText(item)}</li>`).join("")}</ul>`);
    list = [];
  };
  lines.forEach((line) => {
    if (/^#{1,6}\s+/.test(line)) {
      flushList();
      blocks.push(`<h3>${cleanText(line)}</h3>`);
      return;
    }
    if (/^[-*]\s+/.test(line)) {
      list.push(line.replace(/^[-*]\s+/, ""));
      return;
    }
    if (/^\d+[.、]\s+/.test(line)) {
      list.push(line.replace(/^\d+[.、]\s+/, ""));
      return;
    }
    flushList();
    blocks.push(`<p>${cleanText(line)}</p>`);
  });
  flushList();
  return blocks.join("");
}

function tagRow(item, limit = 4) {
  const tags = itemTags(item, limit);
  if (!tags.length) return "";
  return `<div class="tag-row">${tags.map((tag) => `<span class="tag tag-${tag.group || "asset"}">${tag.name}</span>`).join("")}</div>`;
}

function groupedTagList(item) {
  const groups = [
    ["track", "赛道"],
    ["function", "职能"],
    ["scenario", "场景"],
    ["customer", "客户"],
    ["evidence", "证据"],
    ["stage", "阶段"],
    ["region", "市场"],
    ["source", "来源"],
    ["point", "观点"],
  ];
  const tags = item?.tags || [];
  const rows = groups.map(([group, label]) => {
    const values = tags.filter((tag) => tag.group === group).map((tag) => tag.name);
    if (!values.length) return "";
    return `<div><dt>${label}</dt><dd>${values.join(" / ")}</dd></div>`;
  }).filter(Boolean);
  return rows.join("");
}

function signalCard(signal, index) {
  return `
    <article class="card fade-in" style="animation-delay:${index * 70}ms">
      <a class="card-inner" href="${signal.link}">
        <span class="kicker"><img class="kicker-icon" src="assets/vi-components/01-symbol-system/signal.svg" alt="">SIGNAL ${String(index + 1).padStart(2, "0")}</span>
        <h3>${signal.title}</h3>
        <p>${summaryText(signal)}</p>
        ${tagRow(signal)}
      </a>
    </article>
  `;
}

function smallAssetCard(item, index, type) {
  const date = item.label || item.date?.replaceAll("-", ".") || data.meta.date;
  const title = item.title || item.id || "未命名资产";
  const body = summaryText(item);
  const href = type === "trendReport" ? `trend-detail.html?id=${item.slug}` : null;
  const icon = {
    trendReport: "assets/vi-components/01-symbol-system/trend.svg",
    trend: "assets/vi-components/01-symbol-system/trend.svg",
    point: "assets/vi-components/01-symbol-system/key-judgment.svg",
  }[type] || "assets/vi-components/01-symbol-system/data-snapshot.svg";
  const inner = `
    <span class="kicker"><img class="kicker-icon" src="${icon}" alt="">${type.toUpperCase()} ${String(index + 1).padStart(2, "0")} · ${date}</span>
    <h3>${title}</h3>
    <p>${body}</p>
    ${tagRow(item)}
  `;
  return `<article class="asset-card">${href ? `<a class="card-inner" href="${href}">${inner}</a>` : `<div class="card-inner">${inner}</div>`}</article>`;
}

function dateIndexCard(item, index) {
  const metrics = [
    item.signalCount ? `${item.signalCount} 信号` : "",
    item.trendCount ? `${item.trendCount} 趋势` : "",
    item.pointCount ? `${item.pointCount} 观点` : "",
    item.hasTrendReport ? "深度分析" : "",
  ].filter(Boolean).join(" / ") || "观察归档";
  return `
    <article class="time-card fade-in" style="animation-delay:${index * 35}ms">
      <div class="time-date">${item.label || item.date?.replaceAll("-", ".")}</div>
      <div>
        <h3>${item.title || `${item.date} 观澜判断`}</h3>
        <p>${metrics}</p>
      </div>
    </article>
  `;
}

function pointCard(item, index) {
  const displayDate = (item.originalDate || item.date || "").replaceAll("-", ".");
  const date = displayDate || data.meta.date;
  const sourceUrl = item.sourceUrl || item.source_url;
  const handle = builderUsername(sourceUrl);
  const mirrorUrl = sourceUrl ? xMirrorUrl(sourceUrl) : "";
  let sourceDomain = "";
  try {
    sourceDomain = sourceUrl ? new URL(sourceUrl).hostname.replace(/^www\./, "") : "";
  } catch {
    sourceDomain = "";
  }
  const identity = opinionIdentity(item);
  const relationText = [
    ...(item.relatedSignals || []).map((value) => `Signal ${value}`),
    ...(item.relatedTrends || []).map((value) => `Trend ${value}`),
    ...(item.relatedTrendReports || []).map((value) => `TrendReport ${value}`),
  ].join(" · ") || "暂无延伸";
  const source = opinionChineseQuote(item, identity, 260) || cleanText(item.originalTranslation || "来源观点已归档。");
  const reading = cleanText(item.interpretation || item.calibrates || item.usage || "作为补充视角，不替代事实来源。");
  return `
    <article class="point-card fade-in" style="animation-delay:${index * 60}ms">
      <div class="point-card-head">
        <span class="kicker"><img class="kicker-icon" src="assets/vi-components/01-symbol-system/key-judgment.svg" alt="">POINT ${String(index + 1).padStart(2, "0")} · ${date}${handle ? ` · @${handle}` : ""}</span>
        <h3>${opinionCardTitle(item, identity)}</h3>
        <p>${reading}</p>
        ${sourceUrl ? `<p style="margin-top:10px"><a href="${sourceUrl}" target="_blank" rel="noreferrer" style="text-decoration:underline">原文链接：${sourceDomain || "打开"}</a>${mirrorUrl ? ` <span style="color:#6b7b8a">·</span> <a href="${mirrorUrl}" target="_blank" rel="noreferrer" style="text-decoration:underline">文本镜像</a>` : ""}</p>` : ""}
        ${item.convertedAt ? `<p style="margin-top:6px;color:#6b7b8a;font-size:12px">归档：${String(item.convertedAt).slice(0, 10).replaceAll("-", ".")}</p>` : ""}
      </div>
      <div class="point-card-body">
        <div><span>来源观点</span><p>${source}</p></div>
        <div><span>我们的读法</span><p>${reading}</p></div>
        <div><span>相关内容</span><p>${relationText}</p></div>
      </div>
      <div class="point-card-foot">
        ${tagRow(item)}
      </div>
    </article>
  `;
}

function setText(selector, text) {
  const node = document.querySelector(selector);
  if (node && text) node.textContent = text;
}

function tagsByGroup(item, group, limit = 2) {
  return (item?.tags || [])
    .filter((tag) => tag.group === group)
    .map((tag) => tag.name)
    .slice(0, limit);
}

function compactJoin(values, fallback) {
  const picked = values.flat().filter(Boolean);
  return picked.length ? picked.join(" / ") : fallback;
}

function homeDailyTitle(text, index) {
  const presets = ["先看什么", "影响哪里", "从哪开始"];
  const cleaned = cleanText(text);
  if (cleaned.length <= 18) return cleaned;
  return presets[index] || `今日观察 ${String(index + 1).padStart(2, "0")}`;
}

function homeSourceTime(item) {
  return compactJoin([item?.sourceLabel, item?.date?.replaceAll("-", "."), item?.updated, data.meta?.date], data.meta?.date || "今日");
}

function homeField(label, value) {
  return `<div><dt>${label}</dt><dd>${value}</dd></div>`;
}

function homeShort(value = "", limit = 68) {
  const text = cleanText(value);
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}

function homeMemo(label) {
  return `<span class="home-v2-memo">${label}</span>`;
}

function insightToc() {
  const items = [
    ["01", "今日观察", "先看今天最值得阅读的主线"],
    ["02", "商业信号", "把热闹压成少数要紧变化"],
    ["03", "趋势追踪", "看哪些流程可以先试"],
    ["04", "风险提示", "看清数据、交付和责任边界"],
    ["05", "起步位置", "找到一个小范围试法"],
  ];
  return `
    <div class="home-v2-toc" aria-label="本期内参目录">
      <div class="home-v2-toc-label">CONTENTS</div>
      ${items.map(([index, title, text]) => `
        <div class="home-v2-toc-row">
          <span>${index}</span>
          <strong>${title}</strong>
          <p>${text}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function illustrationCard(type = "map") {
  const nodes = type === "radar"
    ? ["Agent", "Workflow", "Decision", "Growth"]
    : ["Signal", "Impact", "Risk", "Entry"];
  return `
    <div class="home-v2-illustration home-v2-illustration-${type}" aria-hidden="true">
      <div class="home-v2-gridlines"></div>
      <div class="home-v2-axis home-v2-axis-x"></div>
      <div class="home-v2-axis home-v2-axis-y"></div>
      <svg viewBox="0 0 420 220" role="presentation" focusable="false">
        <path class="home-v2-chart-line" d="M22 164 C82 124 118 138 164 92 S252 58 312 86 S374 64 398 38" />
        <path class="home-v2-chart-line faint" d="M30 178 C92 156 124 164 176 128 S254 106 302 126 S360 112 392 96" />
        <circle cx="82" cy="124" r="4" />
        <circle cx="164" cy="92" r="4" />
        <circle cx="312" cy="86" r="4" />
        <circle cx="398" cy="38" r="4" />
      </svg>
      <div class="home-v2-node-stack">
        ${nodes.map((item, index) => `<span style="--node:${index}">${item}</span>`).join("")}
      </div>
    </div>
  `;
}

function reportCoverMarkup() {
  return `
    <div class="home-v2-cover-top">
      <span>WAVESIGHT AI INSIGHT</span>
      <span>Issue 05</span>
    </div>
    <div class="home-v2-cover-rule"></div>
    <h3>AI 商业内参</h3>
    <p>本期主题：AI Agent 进入企业流程</p>
    <figure class="home-v2-cover-image">
      <img src="assets/generated/business-brief-control-layer-imagegen.png" alt="AI 商业内参控制层与判断路径示意图">
    </figure>
    <div class="home-v2-cover-keyline">
      <span>关键词</span>
      <strong>Agent / Workflow / Decision / Growth</strong>
    </div>
    <div class="home-v2-cover-keywords">
      <span>Agent</span>
      <span>Workflow</span>
      <span>Decision</span>
      <span>Growth</span>
    </div>
  `;
}

function mountHomeV2() {
  const root = document.querySelector(".home-v2");
  if (!root) return false;

  const activeDate = data.contentIndex?.activeDate || "";
  const todaySignals = (data.contentIndex?.signals || data.signals || [])
    .filter((signal) => !activeDate || signal.date === activeDate)
    .slice(0, 3);
  const dailyEventSignals = todaySignals.length >= 3 ? todaySignals : (data.signals || []).slice(0, 3);
  const primarySignal = dailyEventSignals[0] || {};
  const secondSignal = dailyEventSignals[1] || {};
  const thirdSignal = dailyEventSignals[2] || {};
  const homeDailyObservation = dailyHomeObservationText(dailyEventSignals);
  const dailyProfile = dailyObservationProfile(data.daily || {}, dailyEventSignals);
  const homeDailyIssue = selectedDailyIssue();
  const homeDailyContent = selectedDailyContent(homeDailyIssue);
  const homeDailySignals = exactDailySignals(homeDailyIssue);
  const homeDailyCases = exactDailyCases(homeDailyIssue);
  const homeDailyPoints = exactDailyPoints(homeDailyIssue);
  const homeDailyDate = dailyDateLabel(homeDailyIssue?.label || homeDailyIssue?.date || data.meta?.date);

  const heroPreview = root.querySelector("[data-home-hero-preview]");
  if (heroPreview) {
    heroPreview.innerHTML = `
      <div class="home-v2-preview-card">
        <div class="home-v2-preview-head">
          ${homeMemo("今日观察")}
          <span>${data.brief.issue || "Issue 05"} · ${data.meta.date}</span>
        </div>
        <h2>今日观察预览</h2>
        <p>${homeShort(homeDailyObservation, 116)}</p>
        <div class="home-v2-preview-grid">
          ${[primarySignal, secondSignal, thirdSignal].map((signal, index) => `
            <div>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${dailySignalShortTitle(signal) || "商业信号待更新"}</strong>
            </div>
          `).join("")}
        </div>
        <div class="home-v2-preview-bottom">
          <div>
            ${homeMemo("趋势线索")}
            <strong>${data.trendReport?.title || "趋势追踪"}</strong>
          </div>
          <div>
            ${homeMemo("仍需验证")}
            <strong>责任边界、流程承接和付费意愿仍未落定</strong>
          </div>
        </div>
        ${illustrationCard("map")}
      </div>
    `;
  }

  const dailyCore = root.querySelector("[data-home-daily-core]");
  if (dailyCore) {
    const mainLine = cleanText(homeDailyContent.homeTitle || homeDailyContent.title || homeDailyIssue?.title || data.daily?.title || "今日观察").replace(/^今日观察[｜|]\s*/u, "");
    const deckCopy = cleanText(homeDailyContent.dek || homeDailyContent.summary?.[0] || homeDailyIssue?.dek || data.daily?.dek || "");
    const originalParagraphs = dailyArticleOriginalParagraphs(homeDailyContent, 3);
    const excerptRows = (originalParagraphs.length ? originalParagraphs : [deckCopy])
      .filter(Boolean)
      .slice(0, 2);
    dailyCore.innerHTML = `
      <div class="home-v2-daily-meta">
        <span class="home-v2-label">ARTICLE</span>
        <em>${homeDailyDate}</em>
      </div>
      <strong class="home-v2-daily-line">${mainLine}</strong>
      ${deckCopy ? `<p class="home-v2-daily-deck">${homeShort(deckCopy, 150)}</p>` : ""}
      <div class="home-v2-daily-excerpt">
        ${excerptRows.map((item) => `<p>${homeShort(item, 190)}</p>`).join("")}
      </div>
      <a class="home-v2-text-link" href="${dailyDetailHref(homeDailyIssue)}">阅读原文</a>
    `;
  }

  const dailyRationale = root.querySelector("[data-home-daily-rationale]");
  if (dailyRationale) {
    const caseItems = (homeDailyCases.length ? homeDailyCases : homeDailySignals).slice(0, 2);
    const pointItems = homeDailyPoints.slice(0, 1);
    const evidenceRows = (items, type) => items.map((item, index) => {
      const isPoint = type === "point";
      const identity = isPoint ? dailyPointDisplayIdentity(item) : null;
      const href = isPoint
        ? dailyPointHref(item)
        : (item.link || (item.slug ? `signal-detail.html?id=${encodeURIComponent(item.slug)}` : "signals.html"));
      const title = isPoint ? identity.name : dailySignalShortTitle(item);
      const body = isPoint ? dailyPointKeyLine(item) : signalFrontstageCaseSummary(item, 120);
      const meta = isPoint ? cleanText(identity.title || pointSourceLabel(item)) : dailyDateLabel(item.date || homeDailyIssue?.date);
      const displayTitle = isPoint ? homeShort(cleanText(title), 34) : cleanText(title);
      return `
        <a class="home-v2-daily-evidence-row" href="${safeAttribute(href)}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>${displayTitle}</strong>
            <em>${homeShort(meta, 32)}</em>
            <p>${homeShort(cleanText(body), 82)}</p>
          </div>
        </a>
      `;
    }).join("");
    dailyRationale.innerHTML = `
      <section class="home-v2-daily-evidence-group">
        <h3>案例</h3>
        <div>${caseItems.length ? evidenceRows(caseItems, "case") : `<p>今日观察暂无可展示案例。</p>`}</div>
      </section>
      <section class="home-v2-daily-evidence-group">
        <h3>前沿观点</h3>
        <div>${pointItems.length ? evidenceRows(pointItems, "point") : `<p>今日观察暂无可展示前沿观点。</p>`}</div>
      </section>
    `;
  }

  const dailyCards = root.querySelector("[data-home-daily-cards]");
  if (dailyCards) {
    dailyCards.innerHTML = dailyEventSignals.map((signal, index) => {
      const href = signal.link || (signal.slug ? `signal-detail.html?id=${encodeURIComponent(signal.slug)}` : "signals.html");
      return `
      <a class="home-v2-mini-card home-v2-daily-signal fade-in" href="${safeAttribute(href)}" style="animation-delay:${index * 70}ms">
        <div class="home-v2-card-kicker">${homeMemo("精选变化")}<span class="home-v2-index">${String(index + 1).padStart(2, "0")}</span></div>
        <h3>${homeDailyFeaturedTitle(signal, index)}</h3>
        <p>${homeShort(homeDailyCardBody(signal), 112)}</p>
        <span class="home-v2-read-link">查看这条变化</span>
      </a>
    `;
    }).join("");
  }

  const signalGrid = root.querySelector("[data-home-signals]");
  if (signalGrid) {
    const activeDate = activeSignalDate();
    const allSignals = data.contentIndex?.signals || data.signals || [];
    const activeSignals = allSignals.filter((item) => signalMatchesDate(item, activeDate));
    const historicalSignals = allSignals.filter((item) => signalOnOrBeforeDate(item, activeDate));
    const currentGroups = signalTodayGroups(activeSignals);
    const historicalGroups = signalTodayGroups(historicalSignals.length ? historicalSignals : allSignals);
    const rows = [
      ["funding", "融资", currentGroups.funding, historicalGroups.funding],
      ["case", "案例", currentGroups.case, historicalGroups.case],
      ["product_service", "产品", currentGroups.product_service, historicalGroups.product_service],
    ];
    const latestSignals = rows.flatMap(([, , items, fallbackItems]) => (items.length ? items : fallbackItems).slice(0, 1));
    signalGrid.innerHTML = latestSignals.length ? `
      <div class="home-signal-board">
        <div class="home-signal-card-stack">
          ${rows.map(([key, label, items, fallbackItems], index) => homeSignalCategoryCard(key, label, items, fallbackItems, index)).join("")}
        </div>
        <aside class="home-signal-growth-panel" aria-label="商业信号趋势">
          <div class="home-signal-growth-head">
            <span>最新信号</span>
            <strong>${signalSystemDate(activeDate)}</strong>
            <p>${activeSignals.length} 条当日信号，历史累计 ${historicalSignals.length || allSignals.length} 条。</p>
          </div>
          <div class="home-signal-growth-chart">
            ${rows.map(([key, label, items, fallbackItems]) => homeSignalGrowthRow(key, label, items, fallbackItems, allSignals, activeDate)).join("")}
          </div>
          <a class="home-signal-library-link" href="signals.html">进入商业信号</a>
        </aside>
      </div>
    ` : `
      <div class="home-signal-empty-card">
        <strong>商业信号正在整理</strong>
        <p>新的事实卡放行后，这里会显示融资、案例和产品三类最新信号。</p>
        <a class="home-signal-library-link" href="signals.html">查看商业信号</a>
      </div>
    `;
  }

  const featuredTrendReport = root.querySelector("[data-home-featured-trend-report]");
  if (featuredTrendReport && data.trendReport) {
    const reportId = String(data.trendReport.id || "");
    const isTrendCandidate = data.trendReport.type === "trend_candidate" || data.trendReport.assetLevel === "candidate";
    const hasFormalReport = /^TRD-(FLASH|FULL)-\d{8}-\d{2}$/.test(reportId);
    const hasDisplayTrend = Boolean(data.trendReport.title);
    const audience = compactJoin([tagsByGroup(data.trendReport, "customer", 2), tagsByGroup(data.trendReport, "function", 2)], "企业老板 / 业务负责人");
    const entry = hasFormalReport ? (data.trendReport.link || "trend-tracking.html") : "trend-tracking.html";
    const reportLabel = isTrendCandidate
      ? "正在形成"
      : hasFormalReport
      ? (data.trendReport.kind === "full" ? "最新深度报告" : "正在升温")
      : "趋势仍在观察";
    const reportTitle = hasDisplayTrend ? data.trendReport.title : "暂无可发布趋势";
    const reportCopy = hasDisplayTrend
      ? homeShort(data.trendReport.oneLine || summaryText(data.trendReport), 96)
      : "观澜会把多条变化、案例、观点和来源密度放在一起看。证据不够时，不把单条新闻包装成趋势。";
    featuredTrendReport.innerHTML = `
      ${homeMemo("趋势追踪")}
      <span class="home-v2-label">${reportLabel}</span>
      <h3>${reportTitle}</h3>
      <p>${reportCopy}</p>
      <div class="home-v2-fit-grid">
        <div><span>看什么</span><p>${audience}</p></div>
        <div><span>缺什么</span><p>${data.trendReport.evidenceGaps || "客户采用、付费意愿和交付成本"}</p></div>
        <div><span>状态</span><p>${data.trendReport.stage || "持续记录"}</p></div>
      </div>
      <div class="home-v2-trend-report-notes">
        <p><span>来源</span>多源密度</p>
        <p><span>客户</span>真实采用</p>
        <p><span>成本</span>交付成本</p>
      </div>
      <a class="home-v2-button home-v2-button-primary" href="${entry}">查看趋势追踪</a>
    `;
  }

  const trendReportList = root.querySelector("[data-home-more-trend-reports]");
  if (trendReportList) {
    const trendReports = (data.contentIndex?.trendReports || []).slice(0, 3);
    const items = trendReports.length ? trendReports : data.signals.slice(0, 3).map((signal) => ({
      title: signal.title,
      oneLine: summaryText(signal),
      link: signal.link || "signals.html",
      tags: signal.tags || [],
    }));
    trendReportList.innerHTML = items.map((item, index) => `
      <a class="home-v2-trend-report-row fade-in" href="${item.link || `trend-detail.html?id=${item.slug}`}" style="animation-delay:${index * 60}ms">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          ${homeMemo(item.kind === "full" ? "深度报告" : (item.kind === "flash" ? "正在升温" : "持续记录"))}
          <h3>${item.title}</h3>
          <p>${homeShort(item.oneLine || summaryText(item), 74)}</p>
          <small>${compactJoin([tagsByGroup(item, "customer", 1), tagsByGroup(item, "track", 1)], "事实线索")} · ${item.stage || "记录中"}</small>
        </div>
      </a>
    `).join("");
  }

  const briefCover = root.querySelector("[data-home-brief-cover]");
  if (briefCover) {
    briefCover.innerHTML = reportCoverMarkup();
  }

  const briefCard = root.querySelector("[data-home-brief]");
  if (briefCard) {
    const coreQuestion = data.brief.summary?.[0] || "哪些AI变化正在影响企业的投入顺序？";
    briefCard.innerHTML = `
      <div class="home-v2-brief-copy">
        ${homeMemo("商业内参")}
        <span class="home-v2-label">${data.brief.issue || "商业内参"}</span>
        <div class="home-v2-brief-rule"></div>
        <h2><span>Agent 控制层、</span><span>工程治理与企业交付链</span></h2>
        <p>${homeShort(data.brief.summary?.slice(0, 2).join(" ") || "为企业经营者整理本周值得继续看的 AI 商业变化。", 128)}</p>
      </div>
      ${insightToc()}
      <div class="home-v2-brief-facts">
        <div><span>本期问题</span><p>${homeShort(coreQuestion, 62)}</p></div>
        <div><span>适合谁读</span><p>企业老板 / 行业操盘手 / 投资观察者</p></div>
        <div><span>阅读重点</span><p>流程影响 / 事实依据 / 动态记录</p></div>
      </div>
      <a class="home-v2-button home-v2-button-secondary" href="brief.html">阅读商业内参 <span aria-hidden="true">→</span></a>
    `;
  }

  return true;
}

function mountDateIndexes() {
  const indexes = document.querySelectorAll("[data-date-index]");
  if (!indexes.length || !data.contentIndex?.dates) return;
  const html = data.contentIndex.dates.map((item, index) => dateIndexCard(item, index)).join("");
  indexes.forEach((node) => {
    node.innerHTML = html;
  });
}

function parseRelationTokens(text = "") {
  const tokens = [];
  let currentType = "";
  const normalizeType = (value) => ({
    signals: "signal",
    trends: "trend",
    points: "point",
    trendReports: "trendReport",
  }[value.trim()] || value.trim());
  text.replaceAll("`", "").split(",").map((item) => item.trim()).filter(Boolean).forEach((part) => {
    const [maybeType, ...rest] = part.split(":");
    if (rest.length) {
      currentType = normalizeType(maybeType);
      rest.join(":").split(/[，,]/).map((value) => value.trim()).filter(Boolean).forEach((value) => {
        tokens.push(`${currentType}:${value}`);
      });
    } else if (currentType) {
      tokens.push(`${currentType}:${part}`);
    }
  });
  return tokens;
}

function relationTokens(item) {
  return [
    ...(item.relations || []),
    ...parseRelationTokens(item.relationFields || ""),
  ].map((token) => token
    .replace(/^signals:/, "signal:")
    .replace(/^cases:/, "case:")
    .replace(/^trends:/, "trend:")
    .replace(/^points:/, "point:")
    .replace(/^trendReports:/, "trendReport:"));
}

function assetKeys(item, type) {
  const base = [`${type}:${item.id}`];
  if (type === "signal") base.push(...(item.structuredRefs || []).map((id) => `signal:${id}`));
  if (type === "case") base.push(`case:${item.slug}`);
  if (type === "trendReport") base.push(`trendReport:${item.slug}`);
  return base.filter(Boolean);
}

function assetStore() {
  return {
    signal: data.contentIndex?.signals || data.signals || [],
    case: data.contentIndex?.cases || [],
    point: data.contentIndex?.points || [],
    trend: data.contentIndex?.trends || [],
    trendReport: data.contentIndex?.trendReports || [data.trendReport].filter(Boolean),
  };
}

function relatedAssets(target, targetType) {
  const store = assetStore();
  const targetKeys = new Set(assetKeys(target, targetType));
  const targetTokens = new Set(relationTokens(target));
  const related = {};
  Object.entries(store).forEach(([type, items]) => {
    if (type === targetType) return;
    related[type] = items.filter((item) => {
      const keys = assetKeys(item, type);
      const tokens = relationTokens(item);
      return keys.some((key) => targetTokens.has(key)) || tokens.some((token) => targetKeys.has(token));
    }).slice(0, 6);
  });
  return related;
}

function relationItemCard(item, type, index) {
  const href = type === "signal" ? item.link : (type === "trendReport" ? `trend-detail.html?id=${item.slug}` : null);
  const typeLabel = { signal: "信号", case: "案例", point: "前沿观点", trend: "趋势", trendReport: "机会" }[type];
  const body = summaryText(item, "它与当前观察指向相近。");
  const inner = `
    <span class="kicker">${typeLabel} ${String(index + 1).padStart(2, "0")}</span>
    <h3>${item.title}</h3>
    <p>${body}</p>
    ${tagRow(item, 3)}
  `;
  return `<article class="relation-card">${href ? `<a class="card-inner" href="${href}">${inner}</a>` : `<div class="card-inner">${inner}</div>`}</article>`;
}

function relationPanel(target, targetType) {
  const related = relatedAssets(target, targetType);
  const groups = [
    ["signal", "相关信号"],
    ["case", "相关案例"],
    ["point", "相关观点"],
    ["trend", "趋势线索"],
    ["trendReport", "相关趋势"],
  ].filter(([type]) => type !== targetType && related[type]?.length);
  if (!groups.length) return "";
  return `
    <div class="relation-panel">
      ${groups.map(([type, title]) => `
        <section class="relation-group">
          <div class="relation-group-head"><span>${title}</span><strong>${related[type].length}</strong></div>
          <div class="relation-grid">${related[type].map((item, index) => relationItemCard(item, type, index)).join("")}</div>
        </section>
      `).join("")}
    </div>
  `;
}

function activeRelationRows(limit = 3) {
  return (data.signals || []).slice(0, limit).map((signal, index) => {
    const related = relatedAssets(signal, "signal");
    const counts = [
      ["观点", related.point],
      ["趋势", related.trend],
      ["机会", related.trendReport],
    ];
    const leads = counts
      .filter(([, items]) => items.length)
      .map(([label, items]) => `<span><b>${label}</b>${items.slice(0, 2).map((item) => item.title).join(" / ")}</span>`)
      .join("");
    return `
      <article class="relation-row">
        <span class="sheet-index">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>${signal.title}</h3>
          <p>${counts.map(([label, items]) => `${items.length} 条${label}`).join(" · ")}</p>
          ${leads ? `<div class="relation-strip">${leads}</div>` : ""}
        </div>
      </article>
    `;
  }).join("");
}

function homeSignalDateKeys(signals = [], activeDate = "") {
  const keys = [...new Set(signals.map(signalDateKey).filter(Boolean))]
    .filter((date) => !activeDate || date <= activeDate)
    .sort();
  return keys.slice(-3);
}

function homeSignalSeries(key = "", signals = [], activeDate = "") {
  const dates = homeSignalDateKeys(signals, activeDate);
  const series = dates.map((date) => ({
    date,
    label: String(date).slice(5).replace("-", "."),
    value: signals.filter((item) => signalDateKey(item) === date && signalTypeKey(item) === key).length,
  }));
  return series.length ? series : [{ date: "", label: "-", value: 0 }];
}

function homeSignalSparkline(series = []) {
  const values = series.map((item) => Number(item?.value ?? item) || 0);
  const max = Math.max(...values, 1);
  return `
    <div class="home-signal-sparkline" aria-label="近3日趋势">
      ${series.map((item) => {
        const value = Number(item?.value ?? item) || 0;
        const label = cleanText(item?.label || "");
        return `
          <span class="home-signal-bar">
            <b>${value}</b>
            <i style="height:${Math.max(8, Math.round((value / max) * 42))}px"></i>
            <em>${label}</em>
          </span>
        `;
      }).join("")}
    </div>
  `;
}

function homeSignalCategoryCard(key = "", label = "", items = [], fallbackItems = [], index = 0) {
  const isHistorical = !items.length && fallbackItems.length;
  const signal = (items[0] || fallbackItems[0] || {});
  if (!signal.title && !signal.frontend?.displayTitle) {
    return `
      <article class="home-signal-category-card is-empty">
        <span>${String(index + 1).padStart(2, "0")} · ${label}</span>
        <strong>暂无${label}信号</strong>
        <p>有新卡片放行后，这里会自动显示。</p>
        <a class="home-signal-category-more" href="${safeAttribute(signalCategoryHref(key))}">更多${label}</a>
      </article>
    `;
  }
  const tags = signalTagNames(signal, 3);
  const fact = signalFactualSummary(signal, 132) || signalNewsSummary(signal, 132);
  const comment = signalGuanlanComment(signal, 150);
  const showComment = comment && comment !== fact;
  return `
    <article class="home-signal-category-card ${isHistorical ? "is-history" : ""}">
      <span>${String(index + 1).padStart(2, "0")} · ${label}</span>
      <time>${isHistorical ? `历史 ${signalSystemDate(signal.date || signal.originalDate)}` : signalSystemDate(signal.date || signal.originalDate)}</time>
      <strong><a href="${safeAttribute(signalHref(signal))}">${safeHtml(signalChineseDisplayTitle(signal))}</a></strong>
      ${fact ? `<p class="home-signal-fact">${fact}</p>` : ""}
      ${showComment ? `
        <section class="home-signal-comment">
          <span>观澜点评</span>
          <strong>${comment}</strong>
        </section>
      ` : ""}
      <div>
        ${(tags.length ? tags : [label]).slice(0, 3).map((tag) => `<em>${tag}</em>`).join("")}
      </div>
      <a class="home-signal-category-more" href="${safeAttribute(signalCategoryHref(key))}">更多${label}</a>
    </article>
  `;
}

function homeSignalTagStats(signals = [], limit = 4) {
  const counts = new Map();
  signals.forEach((signal) => {
    signalTagNames(signal, 6).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function textHasHan(text = "") {
  return /\p{Script=Han}/u.test(cleanText(text));
}

function textLooksLikeRawEnglishNewsTitle(text = "") {
  const value = cleanText(text);
  const englishWords = value.match(/[A-Za-z]{3,}/g) || [];
  return /\b(raises?|raised|lands?|funding|funded|ventures?|venture|deploy|deployment|seed|series|million|billion|startup|secures?|launches?|announces?|former|partner|customer|experience|complex|environments|world's|accelerate)\b/i.test(value)
    || (englishWords.length >= 5 && value.length > 42);
}

function signalSourceTitleTranslation(signal = {}) {
  const frontend = signalFrontend(signal);
  return cleanText(
    frontend.sourceTitleTranslation
      || signal.frontend?.sourceTitleTranslation
      || signal.sourceTitleTranslation
      || signal.source_title_translation
      || frontend.sourceTitleZh
      || signal.frontend?.sourceTitleZh
      || signal.sourceTitleZh
      || ""
  );
}

function signalChineseDisplayTitle(signal = {}) {
  const frontend = signalFrontend(signal);
  const translatedSourceTitle = signalSourceTitleTranslation(signal);
  if (translatedSourceTitle) return translatedSourceTitle;
  const eventLine = cleanText(frontend.eventLine || signal.frontend?.eventLine || signal.eventLine || signal.event || "");
  if (eventLine && textHasHan(eventLine) && !textLooksLikeRawEnglishNewsTitle(eventLine)) return eventLine;
  const candidates = [
    frontend.displayTitle,
    signal.frontend?.displayTitle,
    signal.title,
    dailySignalShortTitle(signal),
  ].map(cleanText).filter(Boolean);
  const chineseTitle = candidates.find((text) => textHasHan(text) && !textLooksLikeRawEnglishNewsTitle(text));
  if (chineseTitle) return chineseTitle;
  return cleanText(signal.frontend?.sourceTitle || signal.sourceTitle || "商业信号");
}

function homeSignalTabListItem(signal = {}, index = 0, historical = false) {
  const title = signalChineseDisplayTitle(signal);
  const body = signalSpecificSummary(signal, 220) || signalNewsSummary(signal, 190) || signalFactualSummary(signal, 180);
  const date = signalSystemDate(signal.date || signal.originalDate);
  return `
    <a class="home-signal-table-row" href="${safeAttribute(signalHref(signal))}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${safeHtml(title)}</strong>
        ${body ? `<p>${safeHtml(body)}</p>` : ""}
      </div>
      <time>${historical ? `历史 ${date}` : date}</time>
    </a>
  `;
}

function homeSignalStatTable(key = "", label = "", items = [], fallbackItems = [], allSignals = [], activeDate = "") {
  const chartTitle = key === "funding"
    ? "历史融资分类"
    : key === "product_service"
      ? "历史产品服务分布"
      : "历史行业 / 场景分布";
  const stats = fallbackItems.length ? fallbackItems : items;
  const rows = signalDistributionRows(key, stats, allSignals);
  const keywordRows = signalLaneKeywordRows(key, stats);
  return `
    <aside class="home-signal-tab-stats signal-today-lane-chart" aria-label="${safeAttribute(label)}统计">
      <span>${chartTitle}</span>
      <div class="signal-mini-bars">
        ${signalMiniBars(rows)}
      </div>
      ${signalLaneKeywordChips(keywordRows)}
    </aside>
  `;
}

function homeSignalTabPanel(key = "", label = "", items = [], fallbackItems = [], allSignals = [], activeDate = "", active = false) {
  const historical = !items.length && fallbackItems.length;
  const displayItems = (items.length ? items : fallbackItems).slice(0, 5);
  return `
    <section class="home-signal-tab-panel ${active ? "is-active" : ""}" data-home-signal-panel="${key}" ${active ? "" : "hidden"}>
      <div class="home-signal-table-list">
        ${displayItems.length ? displayItems.map((signal, index) => homeSignalTabListItem(signal, index, historical)).join("") : `
          <div class="home-signal-table-empty">
            <strong>暂无${safeHtml(label)}信号</strong>
            <p>有新卡片放行后，这里会自动显示。</p>
          </div>
        `}
        <a class="home-signal-category-more" href="${safeAttribute(signalCategoryHref(key))}">更多${safeHtml(label)}</a>
      </div>
      ${homeSignalStatTable(key, label, items, fallbackItems, allSignals, activeDate)}
    </section>
  `;
}

function mountHomeSignalTabs(scope = document) {
  scope.querySelectorAll("[data-home-signal-tabs]").forEach((board) => {
    const buttons = Array.from(board.querySelectorAll("[data-home-signal-tab]"));
    const panels = Array.from(board.querySelectorAll("[data-home-signal-panel]"));
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.getAttribute("data-home-signal-tab");
        buttons.forEach((item) => item.setAttribute("aria-selected", item === button ? "true" : "false"));
        panels.forEach((panel) => {
          const active = panel.getAttribute("data-home-signal-panel") === key;
          panel.classList.toggle("is-active", active);
          panel.hidden = !active;
        });
      });
    });
  });
}

function homeSignalGrowthRow(key = "", label = "", items = [], fallbackItems = [], allSignals = [], activeDate = "") {
  const series = homeSignalSeries(key, allSignals, activeDate);
  const historicalCount = fallbackItems.length;
  return `
    <div class="home-signal-growth-row">
      <div>
        <span>${label}</span>
        <strong>${items.length}</strong>
        <em>今日</em>
        <small>历史累计 ${historicalCount}</small>
      </div>
      <section class="home-signal-trend">
        <span>近3日</span>
        ${homeSignalSparkline(series)}
      </section>
    </div>
  `;
}

function getMemberState() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("state") || window.localStorage?.getItem("wavesight-member-state") || "public";
  return ["public", "logged-in", "member"].includes(requested) ? requested : "public";
}

function setMemberState(next) {
  window.localStorage?.setItem("wavesight-member-state", next);
  const url = new URL(window.location.href);
  url.searchParams.set("state", next);
  window.history.replaceState({}, "", url);
  mountBrief();
}

function mountAuthForms() {
  document.querySelectorAll("[data-auth-form]").forEach((form) => {
    form.setAttribute("novalidate", "");
    const status = form.querySelector(".auth-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const missing = Array.from(form.querySelectorAll("input, textarea, select")).filter((field) => {
        if (!field.required) return false;
        if (field.type === "checkbox") return !field.checked;
        return !String(field.value || "").trim();
      });
      if (missing.length) {
        missing[0].focus();
        if (status) {
          status.textContent = "请先补全必填信息。";
          status.classList.add("is-error");
        }
        return;
      }
      const password = form.querySelector('[name="password"]');
      const confirmPassword = form.querySelector('[name="confirmPassword"]');
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.focus();
        if (status) {
          status.textContent = "两次输入的密码不一致。";
          status.classList.add("is-error");
        }
        return;
      }
      if (status) {
        status.textContent = form.dataset.success || "已记录页面演示状态。";
        status.classList.remove("is-error");
      }
      if (["login.html", "register.html", "checkout.html"].includes(getPageName()) && form.dataset.noLogin !== "true") {
        window.localStorage?.setItem("wavesight-member-state", getPageName() === "checkout.html" ? "member" : "logged-in");
        const formData = new FormData(form);
        const email = cleanText(formData.get("email") || formData.get("contact") || formData.get("requestEmail") || "");
        const name = cleanText(formData.get("name") || "");
        const existing = getStoredUser();
        window.localStorage?.setItem("wavesight-user-profile", JSON.stringify({
          name: name || existing.name,
          email: email || existing.email,
          avatar: existing.avatar,
        }));
        mountHeader();
      }
    });
  });
}

function mountAccountPage() {
  if (getPageName() !== "account.html") return;
  const state = getMemberState();
  const copy = {
    public: {
      label: "FREE ACCESS",
      title: "当前为免费阅读状态",
      body: "可阅读今日观察摘要、部分商业信号和部分趋势判断。",
      action: "创建账号",
      href: "register.html",
      items: ["今日观察摘要", "部分商业信号", "部分趋势判断", "创建账号"],
    },
    "logged-in": {
      label: "SIGNED IN",
      title: "已登录账号",
      body: "登录后可进入今日观察；权限到期时可在账户页续订。",
      action: "查看订阅方案",
      href: "pricing.html",
      items: ["今日观察", "商业信号", "趋势追踪", "订阅方案"],
    },
    member: {
      label: "MEMBER",
      title: "会员权限有效",
      body: "当前账号可阅读完整今日观察、商业信号、趋势追踪和商业内参。",
      action: "进入今日观察",
      href: "daily.html",
      items: ["完整今日观察", "完整商业信号", "趋势追踪", "商业内参"],
    },
  }[state];
  const status = document.querySelector("[data-account-status]");
  if (status) {
    status.innerHTML = `
      <span>${copy.label}</span>
      <strong>${copy.title}</strong>
      <p>${copy.body}</p>
      <a class="button primary" href="${copy.href}">${copy.action}</a>
    `;
  }
  const access = document.querySelector("[data-account-access]");
  if (access) {
    access.innerHTML = copy.items.map((item, index) => `
      <div>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${item}</strong>
      </div>
    `).join("");
  }
}

function mountSignals(limit) {
  const node = document.querySelector("[data-signals]");
  if (!node) return;
  const signals = typeof limit === "number" ? data.signals.slice(0, limit) : data.signals;
  node.innerHTML = signals.map(signalCard).join("");
}

function mountSignalBuildersEntry() {
  if (getPageName() !== "signals.html") return;
  const host = document.querySelector("[data-signal-builders-entry]");
  if (!host) return;
  const points = (data.contentIndex?.points || []).filter(isBuilderPoint);
  if (!points.length) {
    host.innerHTML = `<div class="section-head"><div><span class="eyebrow">Frontier Views</span><h2>前沿观点</h2></div><p>暂无可展示的前沿观点。</p></div>`;
    return;
  }
  const activeDate = data.contentIndex?.activeDate || "";
  const todays = points.filter((p) => p.date === activeDate);
  const sample = (todays.length ? todays : points).slice(0, 3);
  host.innerHTML = `
    <div class="section-head">
      <div>
        <span class="eyebrow">Frontier Views</span>
        <h2>前沿观点</h2>
      </div>
      <p>作为判断参照，不替代事实来源。<a href="builders.html" style="text-decoration:underline">查看观点变化</a></p>
    </div>
    <div class="asset-grid">
      ${sample.map((item, index) => pointCard(item, index)).join("")}
    </div>
  `;
}

function builderUsername(url) {
  try {
    const target = new URL(url);
    if (!/(^|\.)x\.com$|(^|\.)twitter\.com$/i.test(target.hostname)) return "";
    const parts = target.pathname.split("/").filter(Boolean);
    return parts[0] || "";
  } catch {
    return "";
  }
}

function xMirrorUrl(url) {
  try {
    const target = new URL(url);
    if (!/(^|\.)x\.com$|(^|\.)twitter\.com$/i.test(target.hostname)) return "";
    return `https://r.jina.ai/http://${target.host}${target.pathname}${target.search}`;
  } catch {
    return "";
  }
}

function isBuilderPoint(point) {
  const url = point?.sourceUrl || point?.source_url || "";
  const user = builderUsername(url);
  if (user) return true;
  const path = String(point?.sourcePath || point?.source_path || "");
  if (/follow-builders/i.test(path)) return true;
  const tags = (point?.tags || []).map((t) => t.id || t.name || "").join(" ");
  return /source-social|builder/i.test(tags);
}

function isFollowBuilderPoint(point) {
  const path = String(point?.sourcePath || point?.source_path || "");
  if (/follow-builders/i.test(path)) return true;
  const url = String(point?.sourceUrl || point?.source_url || "");
  return Boolean(builderUsername(url));
}

function groupBy(items, keyFn) {
  const map = new Map();
  items.forEach((item) => {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return map;
}

function heatBadge(points, maxDate, days) {
  if (!maxDate) return "—";
  const dt = new Date(`${maxDate}T00:00:00Z`);
  const min = new Date(dt.getTime() - Number(days) * 24 * 60 * 60 * 1000);
  const minDate = min.toISOString().slice(0, 10);
  const count = points.filter((p) => (p.date || "") >= minDate).length;
  return `近${days}天 ${count}`;
}

function mountBuilders() {
  if (getPageName() !== "builders.html") return;
  const timeline = document.querySelector("[data-builders-timeline]");
  if (!timeline) return;
  const heat = document.querySelector("[data-builders-heat]");
  const dateIndex = document.querySelector("[data-builders-date-index]");

  const allPoints = data.contentIndex?.points || [];
  const builderPoints = allPoints.filter(isBuilderPoint);

  const countNode = document.querySelector("[data-builder-count]");
  if (countNode) countNode.textContent = `共 ${builderPoints.length} 条观点`;

  const dates = [...new Set(builderPoints.map((p) => p.date).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const rangeNode = document.querySelector("[data-builder-range]");
  if (rangeNode) rangeNode.textContent = dates.length ? `${dates.at(-1).replaceAll("-", ".")} → ${dates[0].replaceAll("-", ".")}` : "暂无数据";

  const personSelect = document.querySelector("[data-builder-person]");
  const queryInput = document.querySelector("[data-builder-q]");
  const rangeSelect = document.querySelector("[data-builder-range-select]");
  const maxDate = dates[0] || data.contentIndex?.activeDate || "";
  if (countNode && builderPoints.length) {
    const heat = [7, 30, 90].map((d) => heatBadge(builderPoints, maxDate, d)).join(" · ");
    countNode.textContent = `共 ${builderPoints.length} 条观点 · ${heat}`;
  }

  if (heat) {
    const byPerson = groupBy(
      builderPoints.filter((p) => builderUsername(p.sourceUrl || p.source_url)),
      (p) => builderUsername(p.sourceUrl || p.source_url),
    );
    const items = [...byPerson.entries()].map(([person, rows]) => {
      const last30 = heatBadge(rows, maxDate, 30).replace(/^近30天\s*/u, "");
      const total = rows.length;
      return { person, last30: Number(last30) || 0, total, rows };
    }).sort((a, b) => b.last30 - a.last30 || b.total - a.total).slice(0, 10);
    const max30 = Math.max(1, ...items.map((i) => i.last30));
    heat.innerHTML = `
      <div class="heat-grid">
        ${items.map((item) => {
          const width = Math.min(100, Math.round((item.last30 / max30) * 100));
          return `
            <button class="heat-card" type="button" data-person="${item.person}" style="cursor:pointer;text-align:left">
              <div class="heat-card-head"><strong>@${item.person}</strong><span>近30天 ${item.last30} · 总计 ${item.total}</span></div>
              <div class="heat-bar"><i style="width:${width}%"></i></div>
              <div class="heat-meta">点击查看该人物观点记录</div>
            </button>
          `;
        }).join("")}
      </div>
    `;
    heat.querySelectorAll("[data-person]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (personSelect) personSelect.value = btn.dataset.person || "";
        personSelect?.dispatchEvent(new Event("change"));
      });
    });
  }

  const people = [...new Set(builderPoints.map((p) => builderUsername(p.sourceUrl || p.source_url)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const makeOption = (value, label) => {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    return o;
  };
  if (personSelect) {
    personSelect.innerHTML = "";
    personSelect.appendChild(makeOption("", "全部人物"));
    people.forEach((handle) => personSelect.appendChild(makeOption(handle, `@${handle}`)));
  }

  const ranges = [
    ["", "全部时间"],
    ["7", "最近 7 天"],
    ["30", "最近 30 天"],
    ["90", "最近 90 天"],
  ];
  if (rangeSelect) {
    rangeSelect.innerHTML = "";
    ranges.forEach(([value, label]) => rangeSelect.appendChild(makeOption(value, label)));
  }

  const apply = () => {
    const handle = personSelect?.value || "";
    const q = String(queryInput?.value || "").trim().toLowerCase();
    const range = rangeSelect?.value || "";
    const activeDate = data.contentIndex?.activeDate || "";
    const maxDate = dates[0] || activeDate;

    let minDate = "";
    if (range && maxDate) {
      const ms = Number(range) * 24 * 60 * 60 * 1000;
      const dt = new Date(`${maxDate}T00:00:00Z`);
      const min = new Date(dt.getTime() - ms);
      minDate = min.toISOString().slice(0, 10);
    }

    const filtered = builderPoints.filter((p) => {
      if (handle && builderUsername(p.sourceUrl || p.source_url) !== handle) return false;
      if (minDate && p.date < minDate) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.originalView} ${p.interpretation} ${p.calibrates} ${p.usage}`.toLowerCase();
      return hay.includes(q);
    });

    const byDay = groupBy(filtered, (p) => p.date || "");
    const sortedDays = [...byDay.keys()].filter(Boolean).sort((a, b) => b.localeCompare(a));

    timeline.innerHTML = sortedDays.map((day) => {
      const items = (byDay.get(day) || []).slice().sort((a, b) => (builderUsername(a.sourceUrl || a.source_url) || "").localeCompare(builderUsername(b.sourceUrl || b.source_url) || ""));
      const header = `<div class="builder-day-head"><h3>${day.replaceAll("-", ".")}</h3><span>${items.length} 条</span></div>`;
      const cards = `<div class="asset-grid">${items.map((item, index) => pointCard(item, index)).join("")}</div>`;
      return `<section class="builder-day" id="builder-day-${day}">${header}${cards}</section>`;
    }).join("") || `<p>暂无匹配的前沿观点。</p>`;

    if (dateIndex) {
      dateIndex.innerHTML = sortedDays.map((day, index) => {
        const items = byDay.get(day) || [];
        const people = new Set(items.map((p) => builderUsername(p.sourceUrl || p.source_url)).filter(Boolean));
        const metrics = `${items.length} 观点${people.size ? ` / ${people.size} 人` : ""}`;
        const title = cleanText(items[0]?.title || "前沿观点");
        return `
          <a class="time-card fade-in" href="#builder-day-${day}" style="animation-delay:${index * 35}ms">
            <div class="time-date">${day.replaceAll("-", ".")}</div>
            <div>
              <h3>${title}</h3>
              <p>${metrics}</p>
            </div>
          </a>
        `;
      }).join("");
    }
  };

  [personSelect, queryInput, rangeSelect].forEach((node) => {
    if (!node) return;
    node.addEventListener("input", apply);
    node.addEventListener("change", apply);
  });
  apply();
}

const signalSystemCopy = {
  sourceBoundary: "前沿观点能帮助修正判断，但不能替代公司公告、客户证据、财报、监管文件或一手材料。",
  noData: "本轮未发现可确认数据。",
};

function signalSystemDate(value) {
  return String(value || data.meta?.date || "").replaceAll("-", ".") || "2026.05.10";
}

function signalSystemTags(item, group, limit = 3) {
  return (item?.tags || [])
    .filter((tag) => !group || tag.group === group)
    .slice(0, limit)
    .map((tag) => tag.name);
}

const signalTagFilterIds = [
  "track-ai-agent",
  "track-enterprise-workflow",
  "evidence-customer-adoption",
  "source-first-party",
  "stage-risk",
  "opinion-agent-workflow",
];

function taxonomyTagById(id) {
  return (data.tagTaxonomy || []).find((tag) => tag.id === id);
}

function signalTagFilters() {
  return signalTagFilterIds
    .map((id) => taxonomyTagById(id))
    .filter(Boolean)
    .map((tag) => ({
      id: tag.id,
      label: tag.name,
      group: tag.group,
      terms: [tag.id, tag.name, ...(tag.aliases || [])],
    }));
}

function signalFilterParams() {
  const params = new URLSearchParams(window.location.search);
  const tags = [
    ...params.getAll("tag"),
    ...(params.get("tags") || "").split(","),
  ].map((tag) => tag.trim()).filter(Boolean);
  return {
    date: params.get("date") || "",
    type: params.get("type") || "",
    tag: tags[0] || "",
    tags: [...new Set(tags)],
    q: params.get("q") || "",
    page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
  };
}

function signalFilterHref(next = {}) {
  const params = signalFilterParams();
  const date = Object.prototype.hasOwnProperty.call(next, "date") ? next.date : params.date;
  const type = Object.prototype.hasOwnProperty.call(next, "type") ? next.type : params.type;
  const tags = Object.prototype.hasOwnProperty.call(next, "tags")
    ? next.tags
    : Object.prototype.hasOwnProperty.call(next, "tag")
      ? (next.tag ? [next.tag] : [])
      : params.tags;
  const q = Object.prototype.hasOwnProperty.call(next, "q") ? next.q : params.q;
  const hasExplicitPage = Object.prototype.hasOwnProperty.call(next, "page");
  const changedFilter = ["date", "type", "tags", "tag", "q"].some((key) => Object.prototype.hasOwnProperty.call(next, key));
  const page = hasExplicitPage ? next.page : changedFilter ? 1 : params.page;
  const query = new URLSearchParams();
  if (date) query.set("date", date);
  if (type) query.set("type", type);
  if (tags?.length) query.set("tags", tags.join(","));
  if (q) query.set("q", q);
  if (Number(page) > 1) query.set("page", String(page));
  const queryString = query.toString();
  return queryString ? `signals.html?${queryString}` : "signals.html";
}

function signalCategoryHref(type = "") {
  return signalFilterHref({ date: "", type, tags: [], q: "" });
}

function builderFilterHref(tag = "") {
  const query = new URLSearchParams();
  if (tag) query.set("tag", tag);
  return `builders.html${tag ? `?${query.toString()}` : ""}`;
}

function signalDateLinks() {
  const dates = data.contentIndex?.dates || [];
  return dates;
}

function activeSignalDate(date = "") {
  return date || data.contentIndex?.activeDate || data.contentIndex?.dates?.[0]?.date || data.meta?.date || "";
}

function signalRangeLabel(date = "") {
  const activeDate = activeSignalDate(date);
  const first = data.contentIndex?.dates?.[0]?.date;
  if (activeDate === first) return "今日";
  return signalSystemDate(activeDate);
}

function activeSignalDateMeta(date = "") {
  const dates = data.contentIndex?.dates || [];
  const activeDate = activeSignalDate(date);
  return dates.find((item) => item.date === activeDate) || dates[0] || {};
}

function signalLeadTitle(signal, date, tag) {
  const dateMeta = activeSignalDateMeta(date);
  if (activeSignalDate(date) === data.contentIndex?.dates?.[0]?.date && !tag && dateMeta.title) return dateMeta.title;
  return signal?.title || dateMeta.title || "值得继续看的 AI 商业变化";
}

function signalMatchesDate(item, date) {
  return item.date === activeSignalDate(date);
}

function signalMatchesTag(item, tagId) {
  if (!tagId) return true;
  const filter = signalTagFilters().find((entry) => entry.id === tagId) || taxonomyTagById(tagId);
  if (!filter) return false;
  return (item.tags || []).some((tag) => {
    const values = [tag.id, tag.name, ...(tag.aliases || [])].map((value) => String(value || "").toLowerCase());
    const terms = filter.terms || [filter.id, filter.name, ...(filter.aliases || [])];
    return terms.some((term) => values.includes(String(term).toLowerCase()));
  });
}

function signalMatchesTags(item, tags = []) {
  return !tags.length || tags.every((tag) => signalMatchesTag(item, tag));
}

function signalMatchesType(item, type = "") {
  return !type || signalTypeKey(item) === type;
}

function signalMatchesKeyword(item, keyword = "") {
  const q = cleanText(keyword).toLowerCase();
  if (!q) return true;
  if (/[\u4e00-\u9fff]/u.test(q) ? q.length < 2 : q.length < 3) return true;
  const tagText = (item.tags || []).flatMap((tag) => [tag.id, tag.name, ...(tag.aliases || [])]).join(" ");
  const sourceText = signalSystemSources(item).map((source) => source.name).join(" ");
  const haystack = [
    item.id,
    item.title,
    item.event,
    item.brief,
    item.businessMeaning,
    item.audience,
    item.signalType,
    item.frontend?.displayTitle,
    item.frontend?.eventLine,
    item.frontend?.businessMeaning,
    tagText,
    sourceText,
  ].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(q);
}

function signalDropdown(kind, label, activeLabel, searchPlaceholder, items, footer = "") {
  return `
    <div class="signal-dropdown signal-dropdown-${kind}">
      <span>${label}</span>
      <details>
        <summary>${activeLabel}</summary>
        <div class="signal-dropdown-menu">
          <label class="sr-only" for="signal-${kind}-search">${searchPlaceholder}</label>
          <input id="signal-${kind}-search" type="search" placeholder="${searchPlaceholder}" data-signal-dropdown-search>
          <div class="signal-dropdown-list">
            ${items.join("")}
          </div>
          ${footer}
        </div>
      </details>
    </div>
  `;
}

function signalDatePicker(date = "") {
  const dates = data.contentIndex?.dates || [];
  const active = activeSignalDate(date);
  const parts = active.split("-");
  const years = [...new Set(dates.map((item) => item.date.slice(0, 4)))];
  const months = [...new Set(dates.filter((item) => item.date.startsWith(parts[0] || "")).map((item) => item.date.slice(5, 7)))];
  const days = [...new Set(dates.filter((item) => item.date.startsWith(`${parts[0]}-${parts[1]}`)).map((item) => item.date.slice(8, 10)))];
  return `
    <form class="signal-picker signal-date-picker" data-signal-date-picker>
      <span>日期</span>
      <div>
        <select name="year" aria-label="年份">
          ${years.map((year) => `<option value="${year}" ${year === parts[0] ? "selected" : ""}>${year}</option>`).join("")}
        </select>
        <select name="month" aria-label="月份">
          ${months.map((month) => `<option value="${month}" ${month === parts[1] ? "selected" : ""}>${month}月</option>`).join("")}
        </select>
        <select name="day" aria-label="日期">
          ${days.map((day) => `<option value="${day}" ${day === parts[2] ? "selected" : ""}>${day}日</option>`).join("")}
        </select>
        <button type="submit">查看</button>
      </div>
    </form>
  `;
}

function signalTagPicker(tagIds = [], keyword = "") {
  const activeIds = Array.isArray(tagIds) ? tagIds : [tagIds].filter(Boolean);
  const tags = signalTagFilters();
  const groups = [...new Set(tags.map((tag) => tag.group))];
  const activeTags = activeIds.map((id) => tags.find((tag) => tag.id === id) || taxonomyTagById(id)).filter(Boolean);
  return `
    <form class="signal-picker signal-tag-picker" data-signal-tag-picker>
      <span>标签</span>
      <div>
        <select name="group" aria-label="标签分类">
          <option value="">全部分类</option>
          ${groups.map((group) => `<option value="${group}">${tagGroupLabel(group)}</option>`).join("")}
        </select>
        <input name="keyword" type="search" list="signalTagOptions" placeholder="搜公司、人物、流程或商业变量" value="${safeAttribute(keyword)}" autocomplete="off">
        <datalist id="signalTagOptions">
          ${tags.map((tag) => `<option value="${tag.label}" data-id="${tag.id}">${tagGroupLabel(tag.group)}</option>`).join("")}
        </datalist>
        <button type="submit">筛选</button>
        <a class="signal-picker-alt" href="${signalFilterHref({ tags: [], q: "" })}">清除</a>
      </div>
      ${activeTags.length ? `
        <div class="signal-active-tags" aria-label="已选标签">
          ${activeTags.map((tag) => `
            <a href="${safeAttribute(signalFilterHref({ tags: activeIds.filter((id) => id !== tag.id) }))}">
              ${safeHtml(tag.name)}
            </a>
          `).join("")}
        </div>
      ` : ""}
    </form>
  `;
}

function tagGroupLabel(group = "") {
  return {
    track: "赛道",
    function: "职能",
    scenario: "场景",
    customer: "客户",
    evidence: "证据",
    stage: "阶段",
    region: "市场",
    source: "来源",
    opinion: "观点",
  }[group] || "标签";
}

function signalSystemUrlDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function sourceDisplayName(url = "", fallback = "") {
  const domain = signalSystemUrlDomain(url) || String(fallback || "").replace(/^www\./, "");
  const lower = `${domain} ${url}`.toLowerCase();
  if (/techcrunch/.test(lower)) return "TechCrunch";
  if (/theinformation/.test(lower)) return "The Information";
  if (/bloomberg/.test(lower)) return "Bloomberg";
  if (/sierra\.ai\/customers|customers/.test(lower)) return "Sierra 客户页面";
  if (/sierra\.ai/.test(lower)) return "Sierra 官方材料";
  if (/openai\.com/.test(lower)) return "OpenAI 官方材料";
  if (/anthropic\.com|claude\.com/.test(lower)) return "Anthropic 官方材料";
  if (/microsoft\.com/.test(lower)) return "Microsoft 官方材料";
  if (/collibra\.com/.test(lower)) return "Collibra 官方材料";
  if (/servicenow/.test(lower)) return "ServiceNow 官方材料";
  if (/soundhound/.test(lower)) return "SoundHound 官方材料";
  if (/twilio/.test(lower)) return "Twilio 官方材料";
  if (/greenhouse/.test(lower)) return "Greenhouse 官方材料";
  if (/prnewswire/.test(lower)) return "发布通道";
  if (/youtube/.test(lower)) return "公开视频材料";
  if (/x\.com|twitter/.test(lower)) return "社媒观点线索";
  if (/github/.test(lower)) return "GitHub 项目材料";
  if (/aws|bedrock/.test(lower)) return "云平台材料";
  return domain || "公开来源";
}

function sourceGroupName(value = "") {
  const lower = String(value || "").toLowerCase();
  if (/x\.com|twitter/.test(lower)) return "社媒线索组";
  if (/youtube|podcast/.test(lower)) return "视频与播客线索组";
  if (/prnewswire|businesswire/.test(lower)) return "发布通道线索组";
  if (lower.includes(".")) return "公司公告线索组";
  return cleanText(value) || "公开来源线索组";
}

function publicSourceLabel(value = "") {
  const clean = String(value || "").replace(/^www\./, "");
  if (!clean) return "公开观点来源";
  if (clean.includes(".")) return `观点来源：${sourceGroupName(clean)}`;
  return clean;
}

function sourceFactForUrl(url = "", index = 0, item = {}) {
  const domain = signalSystemUrlDomain(url);
  const title = cleanText(item?.title || item?.event || "");
  const lower = `${domain} ${url} ${title}`.toLowerCase();
  if (/techcrunch|theinformation|bloomberg|wsj|ft\.com|axios|cnbc/.test(lower)) {
    return "记录融资规模、市场语境和外部报道信息。";
  }
  if (/sierra\.ai\/customers|customers|case-stud/.test(lower)) {
    return "记录客户采用和服务场景信息。";
  }
  if (/sierra\.ai|anthropic\.com|microsoft\.com|collibra\.com|servicenow|soundhound|twilio|greenhouse|nvidia/.test(lower)) {
    return "记录产品定位、发布主体和平台能力信息。";
  }
  if (/pricing|api|docs|developer|github|cloud|bedrock/.test(lower)) {
    return "记录价格、接口或交付条件。";
  }
  if (/regulation|gov|security|five-eyes|csa|risk|lawsuit/.test(lower)) {
    return "记录监管、安全或平台限制信息。";
  }
  if (/youtube|x\.com|twitter|reddit|news\.ycombinator/.test(lower)) {
    return "记录一线讨论或观点变化。";
  }
  const fallbacks = [
    "确认事件主体和发生时间，适合做基础事实核对。",
    "补充客户采用、渠道合作或市场反馈中的关键变化。",
    "补充外部报道或背景语境。",
    "补充交付成本和平台限制信息。",
  ];
  return fallbacks[index] || "补充来源信息。";
}

function sourceRoleForUrl(url = "", index = 0) {
  const lower = `${signalSystemUrlDomain(url)} ${url}`.toLowerCase();
  if (/customers|case-stud/.test(lower)) return "客户采用";
  if (/techcrunch|theinformation|bloomberg|wsj|ft\.com|axios|cnbc/.test(lower)) return "外部报道";
  if (/pricing|api|docs|developer|github|cloud|bedrock/.test(lower)) return "成本条件";
  if (/regulation|gov|security|five-eyes|csa|risk|lawsuit/.test(lower)) return "监管安全";
  if (/x\.com|twitter|youtube|reddit|news\.ycombinator/.test(lower)) return "前沿观点";
  if (/prnewswire|businesswire/.test(lower)) return "发布通道";
  if (/sierra\.ai|anthropic\.com|microsoft\.com|collibra\.com|servicenow|soundhound|twilio|greenhouse|nvidia|openai\.com/.test(lower)) return "产品定位";
  return ["产品定位", "客户采用", "外部报道", "成本条件"][index] || "补充线索";
}

function signalSystemSourceFallback(signal) {
  const title = cleanText(signal?.title || "");
  if (/Sierra/i.test(title)) {
    return [
      ["Sierra 官方网站", "S级", "https://sierra.ai", "提供企业客服 Agent 平台叙事与产品定位。"],
      ["Sierra 客户页面", "S级", "https://sierra.ai/customers", "展示多行业客户场景和服务类型。"],
      ["TechCrunch", "A级", "https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious/", "补充融资规模和市场关注度。"],
    ];
  }
  if (/Anthropic|Microsoft|Claude/i.test(title)) {
    return [
      ["Anthropic 官方材料", "S级", "https://www.anthropic.com", "说明企业场景里的 Agent 能力。"],
      ["Microsoft 365", "S级", "https://www.microsoft.com/microsoft-365", "提供企业办公套件的采用环境。"],
      ["The Verge", "B级", "https://www.theverge.com", "补充市场解读和传播热度。"],
    ];
  }
  if (/Collibra|Command Center|ServiceNow|NVIDIA/i.test(title)) {
    return [
      ["Collibra", "S级", "https://www.collibra.com", "说明 AI 治理产品方向和数据控制重点。"],
      ["ServiceNow", "A级", "https://www.servicenow.com", "补充企业流程平台合作背景。"],
      ["NVIDIA", "A级", "https://www.nvidia.com", "补充企业 AI 基础设施侧的平台变化。"],
    ];
  }
  return [
    ["官方材料", "S级", "#", "确认事件主体和产品方向。"],
    ["商业媒体", "A级", "#", "补充市场语境和行业关注度。"],
    ["行业观察", "B级", "#", "提供讨论升温信息。"],
  ];
}

function signalSystemSources(item) {
  if (item?.frontend?.sourceLinks?.length) {
    return item.frontend.sourceLinks.slice(0, 5).map((source, index) => ({
      name: cleanText(source.label || source.name || sourceDisplayName(source.url, `来源 ${index + 1}`)),
      grade: source.level ? (String(source.level).includes("待补") ? "待补" : `${String(source.level).replace(/级$/u, "")}级`) : (index === 0 ? "S级" : "A级"),
      url: source.url || "#",
      fact: cleanText(source.note || source.fact || sourceFactForUrl(source.url, index, item)),
    }));
  }
  const text = [item?.sourceUrl, item?.brief, item?.judgment, item?.event, item?.sourcePath].filter(Boolean).join(" ");
  const urls = [...text.matchAll(/https?:\/\/[^\s)]+/g)].map((match) => match[0].replace(/[，。；]+$/u, ""));
  if (!urls.length) {
    return signalSystemSourceFallback(item).map(([name, grade, url, fact]) => ({ name, grade, url, fact }));
  }
  return urls.slice(0, 5).map((url, index) => ({
    name: sourceDisplayName(url, `来源 ${index + 1}`),
    grade: index === 0 ? "S级" : index === 1 ? "A级" : "B级",
    url,
    fact: sourceFactForUrl(url, index, item),
  }));
}

function signalSystemEvidence(item) {
  const sources = signalSystemSources(item);
  const count = (grade) => sources.filter((source) => source.grade === grade).length;
  return {
    sources,
    s: count("S级"),
    a: count("A级"),
    b: count("B级"),
    total: sources.length,
    status: sources.some((source) => source.grade === "S级") ? "多源记录" : "来源记录",
  };
}

function signalSystemMetricCard(label, value, hint = "") {
  return `
    <div class="signal-system-metric">
      <span>${label}</span>
      <strong>${value}</strong>
      ${hint ? `<p>${hint}</p>` : ""}
    </div>
  `;
}

function evidenceBadge(label, tone = "") {
  return `<span class="signal-system-badge ${tone}">${label}</span>`;
}

function signalHref(signal = {}) {
  return signal.link || (signal.slug ? `signal-detail.html?id=${encodeURIComponent(signal.slug)}` : "signals.html");
}

function signalAnalysisValue(signal = {}, labels = [], fallback = "") {
  const matched = (signal.analysis || []).find(([label]) => labels.some((name) => String(label || "").includes(name)));
  return cleanText(matched?.[1] || fallback || signal.businessMeaning || signal.event || signal.judgment || summaryText(signal));
}

function signalFrontend(signal = {}) {
  const frontend = signal.frontend || {};
  return {
    displayTitle: cleanText(frontend.displayTitle || signal.title || ""),
    eventLine: cleanText(frontend.eventLine || signal.event || signal.brief || ""),
    whyWatch: cleanText(frontend.whyWatch || signal.judgment || signal.businessMeaning || ""),
    businessMeaning: cleanText(frontend.businessMeaning || signal.businessMeaning || signal.brief || ""),
    sourceExcerpt: cleanText(frontend.sourceExcerpt || signal.sourceExcerpt || signal.originalExcerpt || ""),
    techRouteMeaning: cleanText(frontend.techRouteMeaning || signal.technicalRouteMeaning || ""),
    evidenceNote: cleanText(frontend.evidenceNote || ""),
    sourceLinks: frontend.sourceLinks || [],
    relatedCases: frontend.relatedCases || [],
    relatedOpinions: frontend.relatedOpinions || [],
    watchWindow: frontend.watchWindow || [],
    evidenceBoundary: frontend.evidenceBoundary || [],
  };
}

function frontstageFactText(value = "") {
  return cleanText(value)
    .replaceAll("责任边界", "责任范围")
    .replaceAll("权限边界", "权限范围")
    .replaceAll("成本边界", "成本范围")
    .replaceAll("交付边界", "交付范围")
    .replaceAll("企业企业", "企业")
    .replaceAll("边界", "范围")
    .replaceAll("反证", "对照材料")
    .replaceAll("后续观察", "动态记录")
    .replaceAll("继续观察", "持续记录")
    .replaceAll("不能证明", "未显示")
    .replaceAll("还不能", "暂未");
}

function signalBusinessLine(signal = {}, limit = 132) {
  const front = signalFrontend(signal);
  const text = front.businessMeaning || signalAnalysisValue(signal, ["商业含义", "为什么值得看"], signal.businessMeaning || signal.judgment);
  return homeShort(frontstageFactText(text), limit);
}

function signalEventLine(signal = {}, limit = 132) {
  const front = signalFrontend(signal);
  const text = front.eventLine || signalAnalysisValue(signal, ["事件", "发生了什么"], signal.event || signal.brief);
  return homeShort(frontstageFactText(text), limit);
}

function signalWhyLine(signal = {}, limit = 132) {
  const front = signalFrontend(signal);
  const text = front.whyWatch || signalAnalysisValue(signal, ["入选理由", "为什么值得看"], signal.judgment || signal.businessMeaning);
  return homeShort(frontstageFactText(text), limit);
}

function distinctSignalLines(lines = []) {
  const seen = new Set();
  return lines
    .map((line) => frontstageFactText(line))
    .filter(Boolean)
    .filter((line) => {
      const key = line.toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "");
      if (!key || seen.has(key)) return false;
      for (const item of seen) {
        if (item.includes(key) || key.includes(item)) return false;
      }
      seen.add(key);
      return true;
    });
}

function signalSpecificSummary(signal = {}, limit = 240) {
  const front = signalFrontend(signal);
  const source = signalPrimarySource(signal);
  const what = front.eventLine
    || signalAnalysisValue(signal, ["发生了什么", "事件"], signal.event || "")
    || source.fact;
  const why = front.whyWatch
    || signalAnalysisValue(signal, ["为什么值得看", "入选理由"], signal.judgment || "");
  const impact = front.businessMeaning
    || signalAnalysisValue(signal, ["影响谁", "商业含义"], signal.businessMeaning || signal.brief || "");
  const sourceNote = front.sourceLinks?.[0]?.note || "";
  const lines = distinctSignalLines([what, sourceNote, why, impact]).slice(0, 3);
  return lines.length ? homeShort(lines.join(" "), limit) : "";
}

function signalFactualSummary(signal = {}, limit = 140) {
  const front = signalFrontend(signal);
  const source = signalPrimarySource(signal);
  const what = front.eventLine
    || signalAnalysisValue(signal, ["发生了什么", "事件"], signal.event || "")
    || source.fact
    || front.sourceLinks?.[0]?.note;
  return what ? homeShort(frontstageFactText(what), limit) : "";
}

function signalGuanlanComment(signal = {}, limit = 132) {
  const front = signalFrontend(signal);
  const text = front.businessMeaning
    || signalAnalysisValue(signal, ["影响谁", "商业含义"], signal.businessMeaning || signal.brief || "")
    || front.whyWatch
    || signalAnalysisValue(signal, ["为什么值得看", "入选理由"], signal.judgment || "");
  return text ? homeShort(frontstageFactText(text), limit) : "";
}

function signalCaseNames(signal = {}, limit = 2) {
  return relatedCaseAssets(signal, limit)
    .map((item) => cleanText(item.title || item.id))
    .filter(Boolean);
}

function signalSourceNames(signal = {}, limit = 2) {
  return signalSystemSources(signal)
    .slice(0, limit)
    .map((item) => cleanText(item.name))
    .filter(Boolean);
}

function signalTypeLabel(type = "") {
  return {
    funding: "融资",
    case: "案例",
    product_service: "产品",
    "product-service": "产品",
    partnership: "合作",
  }[String(type || "").trim()] || "信号";
}

function signalTypeCounts(items = []) {
  return items.reduce((acc, item) => {
    const label = signalTypeLabel(item.signalType || item.type);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
}

function signalTypeCountText(items = []) {
  const counts = signalTypeCounts(items);
  const rows = ["融资", "案例", "产品", "合作", "信号"]
    .filter((label) => counts[label])
    .map((label) => `${label} ${counts[label]}`);
  return rows.join(" / ") || "等待更新";
}

function signalSubjectName(signal = {}) {
  const title = cleanText(signalFrontend(signal).displayTitle || signal.title || "");
  const event = cleanText(signal.event || signal.frontend?.eventLine || "");
  const source = signalSystemSources(signal)[0]?.name || "";
  const fromTitle = title.match(/^[A-Za-z0-9][A-Za-z0-9.\-& ]{1,36}/)?.[0]
    || title.match(/^[\u4e00-\u9fffA-Za-z0-9]{2,12}(?=[ ，,：:])/u)?.[0];
  return cleanText(fromTitle || signalSystemTags(signal, "source", 1)[0] || source || event.slice(0, 12) || "公开主体");
}

function signalActionLine(signal = {}, limit = 92) {
  const text = signalEventLine(signal, 180);
  return homeShort(text, limit);
}

function signalTagNames(signal = {}, limit = 3) {
  const preferred = ["track", "function", "scenario", "customer", "source"];
  const tags = signal.tags || [];
  const ranked = [
    ...preferred.flatMap((group) => tags.filter((tag) => tag.group === group)),
    ...tags,
  ];
  return [...new Set(ranked.map((tag) => tag.name).filter(Boolean))].slice(0, limit);
}

function signalPrimarySource(signal = {}) {
  return signalSystemSources(signal)[0] || {
    name: sourceDisplayName(signal.sourceUrl || signal.source_url || "", "公开来源"),
    url: signal.sourceUrl || signal.source_url || "#",
    fact: signalEventLine(signal, 180),
  };
}

function signalNewsSummary(signal = {}, limit = 180) {
  if (signalTypeKey(signal) === "case") {
    return signalFrontstageCaseSummary(signal, limit);
  }
  const front = signalFrontend(signal);
  const source = signalPrimarySource(signal);
  const text = signalSpecificSummary(signal, limit + 80)
    || source.fact
    || front.sourceLinks?.[0]?.note
    || front.eventLine
    || signal.event;
  return homeShort(frontstageFactText(text), limit);
}

function textLooksInternalSignalCopy(value = "") {
  const text = cleanText(value);
  if (!text) return false;
  return /这条材料把|材料把|把 AI 放进|材料显示它已经对应|从通用能力拉回|可以观察|后续判断重点|模型参数|客户是否愿意|流程结果|交付速度|团队协作付费|真实客户规模|长期留存|效果指标|未来 30 到 90 天|继续观察|证据边界|反证|边界/u.test(text);
}

function escapePatternText(value = "") {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function signalFrontstageCaseSummary(signal = {}, limit = 132) {
  const original = signalSourceExcerpt(signal, limit + 100);
  if (original && !textLooksInternalSignalCopy(original)) {
    return homeShort(original, limit);
  }
  const front = signalFrontend(signal);
  const source = signalPrimarySource(signal);
  const subject = signalSubjectName(signal);
  const sourceUrl = source.url || signal.frontend?.sourceLinks?.[0]?.url || signal.sourceUrl || "";
  const title = cleanText(signalSourceTitleTranslation(signal) || signalChineseDisplayTitle(signal) || signal.frontend?.sourceTitle || signal.title);
  const factualCandidates = [
    signal.oneLine,
    signal.factualSummary,
    signal.frontend?.sourceSummary,
    signal.sourceSummary,
    front.sourceLinks?.[0]?.summary,
    front.eventLine,
    signal.event,
  ].map(frontstageFactText)
    .filter((item) => item && !textLooksInternalSignalCopy(item) && !textLooksLikeRawEnglishNewsTitle(item));
  if (factualCandidates.length) {
    return homeShort(factualCandidates[0], limit);
  }
  if (title) {
    const sourceLabel = /case-stud|customer|use-cases|customers|applied/i.test(sourceUrl) ? "公开案例称" : "公开材料显示";
    const subjectPattern = subject ? escapePatternText(subject) : "";
    let titleBody = title;
    if (subjectPattern) {
      titleBody = titleBody
        .replace(new RegExp(`^${subjectPattern}\\s*的\\s*`, "u"), "其 ")
        .replace(new RegExp(`^${subjectPattern}\\s*如何用\\s*`, "u"), "使用 ");
    }
    const changed = titleBody !== title;
    const sentence = changed && subject
      ? `${subject} ${sourceLabel}，${titleBody.replace(/[。.]$/u, "")}。`
      : `${sourceLabel}，${titleBody.replace(/[。.]$/u, "")}。`;
    return homeShort(frontstageFactText(sentence), limit);
  }
  const fallback = signalEventLine(signal, limit + 40);
  return textLooksInternalSignalCopy(fallback) ? "" : homeShort(fallback, limit);
}

function sourceExcerptLooksOriginal(signal = {}, text = "") {
  const candidate = cleanText(text);
  if (!candidate || candidate.length < 36) return false;
  const normalize = (value = "") => cleanText(value)
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
  const candidateKey = normalize(candidate);
  const blocked = [
    signal.title,
    signal.event,
    signal.brief,
    signal.judgment,
    signal.businessMeaning,
    signalFrontend(signal).displayTitle,
    signalFrontend(signal).eventLine,
    signalFrontend(signal).whyWatch,
    signalFrontend(signal).businessMeaning,
    signalPrimarySource(signal).fact,
  ].filter(Boolean).map(normalize);
  if (blocked.some((value) => value && (candidateKey === value || value.includes(candidateKey) || candidateKey.includes(value)))) {
    return false;
  }
  if (/^(新闻|摘要|观澜|这条|影响的是|公开材料|材料来自|未来|继续看|用于|方向是)/u.test(candidate)) return false;
  return true;
}

function signalSourceExcerpt(signal = {}, limit = 360) {
  const front = signalFrontend(signal);
  const candidates = [
    front.sourceExcerpt,
    signal.sourceExcerpt,
    signal.originalExcerpt,
    signal.sourceQuote,
  ];
  const picked = candidates.find((item) => sourceExcerptLooksOriginal(signal, item));
  return picked ? homeShort(frontstageFactText(picked), limit) : "";
}

function signalAnalysisAnswer(signal = {}, label = "", fallback = "") {
  const row = (signal.analysis || []).find(([name]) => String(name || "").includes(label));
  return frontstageFactText(row?.[1] || fallback || "");
}

function signalAllAssets() {
  return Array.from(new Map([...(data.signals || []), ...(data.contentIndex?.signals || [])]
    .filter(Boolean)
    .map((item) => [item.id || item.slug || item.title, item])).values());
}

function signalTagGroupText(signal = {}, groups = [], limit = 4) {
  const values = (signal.tags || [])
    .filter((tag) => groups.includes(tag.group))
    .map((tag) => tag.name)
    .filter(Boolean);
  return [...new Set(values)].slice(0, limit).join(" / ");
}

function signalAiRole(signal = {}) {
  const text = [
    signal.title,
    signal.event,
    signal.businessMeaning,
    signal.judgment,
    signalTagNames(signal, 8).join(" "),
  ].join(" ").toLowerCase();
  if (/agent|智能体/.test(text)) return "Agent";
  if (/copilot|助手/.test(text)) return "Copilot / 助手";
  if (/voice|语音/.test(text)) return "语音 Agent";
  if (/workflow|流程|自动/.test(text)) return "流程自动化系统";
  if (/platform|平台|infra|基础设施/.test(text)) return "平台 / 基础设施";
  if (/model|模型/.test(text)) return "模型服务";
  return "AI 系统";
}

function signalActionVerb(signal = {}) {
  const text = cleanText(signal.title || signal.event || "");
  const verbs = ["部署", "采用", "扩大合作", "推出", "发布", "融资", "试点", "采购", "替换", "上线", "集成"];
  return verbs.find((verb) => text.includes(verb)) || signalTypeLabel(signal.signalType || signal.type);
}

function signalScenarioText(signal = {}) {
  return signalTagGroupText(signal, ["scenario", "function"], 3)
    || signalAnalysisAnswer(signal, "影响谁", signal.businessMeaning)
    || signalEventLine(signal, 90);
}

function signalUseActor(signal = {}) {
  const subject = signalSubjectName(signal);
  const customer = signalTagGroupText(signal, ["customer", "region"], 2);
  return customer ? `${subject} / ${customer}` : subject;
}

function signalCaseBreakdown(signal = {}) {
  return [
    ["使用者", signalUseActor(signal)],
    ["场景", signalScenarioText(signal)],
    ["AI 角色", signalAiRole(signal)],
    ["变化", signalBusinessLine(signal, 118) || signalWhyLine(signal, 118)],
  ].filter(([, value]) => value);
}

function signalBusinessVariables(signal = {}) {
  const front = signalFrontend(signal);
  const text = [
    signalSourceExcerpt(signal, 900),
    front.sourceExcerpt,
    signal.sourceExcerpt,
    signal.originalExcerpt,
    signal.originalQuote,
    signal.quote,
  ].map(cleanText).filter(Boolean).join(" ");
  if (!text) return [];
  const candidates = [
    ["资金/预算", "原文出现融资、成本或投入信息，可继续观察预算流向。", /预算|融资|投资|成本|金额|轮融资|种子轮|B 轮|D 轮|raised|funding|financing|investment|cost|budget|\$|million|billion/i],
    ["部署/采购", "原文出现客户、部署、合作或采购信息，可作为进入真实流程的证据。", /采购|客户|企业|平台|合作|部署|采用|上线|customer|enterprise|deploy|deployment|adoption|partner|partnership|platform|workflow/i],
    ["交付周期", "原文出现上线、集成、自动化或时间信息，可继续看交付效率。", /部署|交付|流程|上下文|集成|工程|自动化|上线|周期|天|周|月|integration|production|automate|automation|workflow|hours|days|weeks|months|reduced|cut/i],
    ["组织分工", "原文出现岗位、团队、员工或管理信息，可观察组织责任变化。", /团队|员工|管理|合规|责任|治理|复核|岗位|team|staff|employee|headcount|compliance|governance|advisor|clinical|administrative/i],
    ["采用范围", "原文出现具名客户、机构或场景，可用来判断是否扩散。", /客户|采用|案例|机构|医院|Snowflake|AdventHealth|NHS|LTM|Built|Druid|Choco|customer|hospital|clinic|case study/i],
  ];
  const rows = candidates.filter(([, , pattern]) => pattern.test(text)).slice(0, 4);
  return rows.map(([label, body]) => ({ label, body }));
}

function signalRelatedSignalRows(signal = {}, limit = 4) {
  const currentKey = signal.id || signal.slug || signal.title;
  const currentTags = new Set((signal.tags || []).map((tag) => tag.id || tag.name).filter(Boolean));
  return signalAllAssets()
    .filter((item) => (item.id || item.slug || item.title) !== currentKey)
    .map((item) => {
      const sameType = signalTypeKey(item) === signalTypeKey(signal);
      const shared = (item.tags || []).filter((tag) => currentTags.has(tag.id) || currentTags.has(tag.name));
      const score = (sameType ? 3 : 0) + shared.length + (item.date === signal.date ? 1 : 0);
      return { item, score, shared };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function signalSimilarCases(signal = {}, limit = 3) {
  const exact = relatedCaseAssets(signal, limit);
  const currentKey = signal.id || signal.slug || signal.title;
  const currentTags = new Set((signal.tags || []).map((tag) => tag.id || tag.name).filter(Boolean));
  const ranked = signalAllAssets()
    .filter((item) => signalTypeKey(item) === "case")
    .filter((item) => (item.id || item.slug || item.title) !== currentKey)
    .filter((item) => !exact.some((exactItem) => (exactItem.id || exactItem.slug) === (item.id || item.slug)))
    .map((item) => ({
      item,
      score: (item.tags || []).filter((tag) => currentTags.has(tag.id) || currentTags.has(tag.name)).length + (item.date === signal.date ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
  const seen = new Set();
  return [...exact, ...ranked].filter((item) => {
    const key = item.id || item.slug || item.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

function signalQuietMeta(signal = {}) {
  const primarySource = signalPrimarySource(signal);
  const tags = signalTagNames(signal, 5);
  return [
    ["日期", signalSystemDate(signal.date)],
    ["类型", signalTypeLabel(signal.signalType || signal.type)],
    ["来源", primarySource.name],
    ["标签", tags.join(" / ")],
  ].filter(([, value]) => value);
}

function signalDateTabs(activeDate = "") {
  const dates = (data.contentIndex?.dates || []).slice(0, 6);
  if (!dates.length) return "";
  return `
    <nav class="signal-date-tabs" aria-label="按日期查看商业信号">
      ${dates.map((item) => `
        <a href="${safeAttribute(signalFilterHref({ date: item.date }))}" ${activeSignalDate(activeDate) === item.date ? 'aria-current="page"' : ""}>
          <span>${signalSystemDate(item.date)}</span>
          <strong>${item.signalCount || 0} 条</strong>
        </a>
      `).join("")}
    </nav>
  `;
}

function signalDecisionCard(signal = {}, index = 0) {
  const front = signalFrontend(signal);
  const source = signalPrimarySource(signal);
  const tags = signalTagNames(signal, 3);
  const detailUrl = signalHref(signal);
  const sourceUrl = source.url || "#";
  const type = signalTypeLabel(signal.signalType || signal.type);
  const date = signalSystemDate(signal.date);
  const tagText = tags.join(" / ") || type;
  const comment = signalBusinessLine(signal, 118) || signalWhyLine(signal, 118);
  const cardFields = [
    ["标签", tagText],
  ].filter(([, value]) => value);
  return `
    <article class="signal-decision-card">
      <div class="signal-decision-card-top">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <em><b>类型</b>${type}</em>
        <em><b>日期</b>${date}</em>
      </div>
      <h3><a href="${safeAttribute(detailUrl)}">${safeHtml(title || "前沿观点")}</a></h3>
      <p>${signalNewsSummary(signal, 132)}</p>
      ${comment ? `
        <div class="signal-card-comment">
          <span>观澜评论</span>
          <strong>${comment}</strong>
        </div>
      ` : ""}
      <div class="signal-card-fields">
        ${cardFields.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
      </div>
      <div class="signal-card-actions">
        <a href="${safeAttribute(detailUrl)}">人物页</a>
        ${sourceUrl !== "#" ? `<a href="${safeAttribute(sourceUrl)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
      </div>
    </article>
  `;
}

function pointTagNames(point = {}, limit = 3) {
  const preferred = ["track", "customer", "function", "opinion"];
  const tags = point.tags || [];
  const ranked = [
    ...preferred.flatMap((group) => tags.filter((tag) => tag.group === group)),
    ...tags,
  ];
  return [...new Set(ranked.map((tag) => tag.name).filter(Boolean))]
    .filter((name) => name !== "社媒线索")
    .slice(0, limit);
}

function taxonomyNameSet() {
  return new Set((data.tagTaxonomy || []).map((tag) => tag.name).filter(Boolean));
}

function pointPublicTaxonomyTagNames(point = {}, limit = 8) {
  const allowedGroups = new Set(["track", "opinion", "function", "scenario", "customer"]);
  const officialNames = taxonomyNameSet();
  return [...new Set((point.tags || [])
    .filter((tag) => allowedGroups.has(tag.group))
    .map((tag) => tag.name)
    .filter((name) => officialNames.has(name) && name !== "社媒线索"))]
    .slice(0, limit);
}

function pointBuilderHandle(point = {}) {
  const url = point.sourceUrl || point.source_url || "";
  return builderUsername(url) || signalSystemUrlDomain(url) || "";
}

function builderDetailHrefForPoint(point = {}, index = 0) {
  const handle = pointBuilderHandle(point);
  if (handle) return `builder-detail.html?id=${encodeURIComponent(handle)}`;
  return `opinion-detail.html?id=${encodeURIComponent(point.slug || point.id || index)}`;
}

function opinionDetailHref(point = {}, index = 0) {
  return builderDetailHrefForPoint(point, index);
}

function pointSourceLabel(point = {}) {
  const domain = signalSystemUrlDomain(point.sourceUrl || point.source_url || "");
  return sourceDisplayName(domain || point.sourceUrl || point.source_url || "", "公开来源");
}

function pointOriginalSnippet(point = {}, limit = 112) {
  const candidates = [
    point.originalQuote,
    point.frontend?.originalQuote,
    point.originalView,
    point.excerpt,
    point.quote,
    point.keyExcerpt,
    point.originalText,
    point.rawExcerpt,
  ];
  const original = cleanText(candidates.find((item) => {
    const text = cleanText(item || "");
    return text && !text.includes("见正文原文摘录") && !text.includes("原文入口可查看完整摘录");
  }) || "");
  return homeShort(original.replaceAll("&amp;", "&").replaceAll("&quot;", "\"").replaceAll("&#39;", "'"), limit);
}

function pointOriginalFull(point = {}) {
  const candidates = [
    point.originalQuote,
    point.frontend?.originalQuote,
    point.originalView,
    point.excerpt,
    point.quote,
    point.keyExcerpt,
    point.originalText,
    point.rawExcerpt,
  ];
  const original = cleanText(candidates.find((item) => {
    const text = cleanText(item || "");
    return text && !text.includes("见正文原文摘录") && !text.includes("原文入口可查看完整摘录");
  }) || "");
  return original.replaceAll("&amp;", "&").replaceAll("&quot;", "\"").replaceAll("&#39;", "'");
}

function pointChineseTranslation(point = {}, limit = 8000) {
  const direct = cleanText(
    point.originalTranslation
    || point.translation
    || point.translationZh
    || point.zhTranslation
    || point.frontend?.originalTranslation
    || point.frontend?.translation
    || point.frontend?.translationZh
  );
  if (direct) return Number.isFinite(limit) ? homeShort(direct, limit) : direct;
  const id = cleanText(point.id || "");
  const title = cleanText(point.title || "");
  const original = pointOriginalFull(point);
  const key = `${id} ${title} ${original}`.toLowerCase();
  const translations = [
    [/fde|agent 落地需要技术交付|workflows that people participate/i, "这篇关于 FDE 的文章很值得读。只要 AI 继续快速变化，这类工作就会长期存在。Agent 不像过去部署云服务那样只影响开发者和 IT，它会直接进入员工参与的底层流程，因此落地不只是技术工作，还包含大量变更管理。"],
    [/exa 正成为 agent 搜索基础设施|exa is what i trust/i, "Exa 是我信任并用于所有 Agent 的搜索基础设施。我们在 YC 使用它，也在 OpenClaw 和 Hermes Agents 中使用它。当 Agent 需要搜索网页时，速度、稳定度和覆盖面都很关键。"],
    [/mcp 设计要少而准|stainlessapi|lean and precise/i, "Anthropic 收购了开发者工具公司 Stainless。Alex Rattray 在节目中谈到 MCP 服务器、API 和 SDK 的设计：MCP 服务器应该精简、准确，真正服务 Agent 的工具连接，而不是堆满接口。"],
    [/speaker 1|pre ai world|model context protocol/i, "互联网原本建立在前 AI 时代的架构上。MCP 让网站和服务变成 AI 可以原生使用的工具集，未来十年，真正把 MCP 做好的软件公司会获得优势。"],
    [/ai-native 团队|ics should start thinking like managers/i, "在 AI-native 团队里，个人贡献者要像管理者一样思考：如何把任务委派给 Agent，如何设定标准并验证输出。管理者也要像一线建设者一样，更直接地参与构建，而不只是做人事管理。"],
    [/模型能力提升会改变 agent 产品|agent labs|model performance and agent lab revenue/i, "现在回看，模型能力越强，业务表现越好的公司，正是 Agent Labs 这类形态。模型表现和 Agent 实验室收入之间已经出现直接相关，2025 年第四季度还出现了明显跃迁。"],
    [/exa 在 agent 搜索评测中胜出|bake off of exa/i, "我们做了一次 Exa 与竞争产品的对比测试，团队只用了一个半小时就一致选择了 Exa。这类产品的价值在 Agent 搜索能力里会被快速放大。"],
    [/project genie|游戏设计压缩到分钟级|designing the games in minutes/i, "从玩游戏到几分钟内设计游戏：选择角色、设定场景，然后让 Project Genie 完成剩下的工作。AI 工具正在把创作流程压缩到更短周期。"],
    [/ai 红利需要留住关键人才|benefits of ai are real/i, "AI 的好处已经真实出现。但如果不能解决更大的舆论和人才环境问题，美国可能无法充分获得这波红利，并可能让出领先位置。"],
    [/agi 优先加速科研|three of the things/i, "我们最兴奋的三件事是：AGI 加速科研、AGI 加速公司发展，以及个人 AGI 帮助每个人实现目标。现在需要继续加大第三个方向的投入。"],
    [/42% of the web|更大规模 web 工作流/i, "这会把 AI 带到 42% 的 Web 中：覆盖所有模型、所有提供方和文字、图像、视频、音频等所有模态。"],
    [/开放数学问题|general-purpose model solved/i, "一个通用模型解决了数学中的重要开放问题。这是一个相当重要的里程碑，也预示 AI 会大幅扩展我们理解世界的能力。"],
    [/certainty on capacity|提前锁定算力容量/i, "客户越来越希望获得确定的算力容量。随着模型变强，未来一段时间全球可能持续受算力约束，因此提前锁定容量会变成企业采购的重要议题。"],
    [/gemini flash 能力跃升|gemini 3\.5 flash/i, "Gemini 3.5 Flash 相比 Gemini 3 Flash 在知识工作能力上有明显提升。Box 在复杂文档任务中测试后看到 12 个百分点的提升，覆盖金融、咨询、公共部门、医疗等行业任务。"],
    [/ai token 成本|token costs will become/i, "Token 成本会成为企业使用 AI 时的主导议题。很多财富 500 强 CIO 正在尝试按工作负载、用户类型、团队预算和使用场景分配模型与 Agent 权限，但还没有形成稳定方案。"],
    [/alphaevolve|计算发现|computational discovery/i, "AlphaEvolve 与经验研究 Agent 可以生成并评估数千个代码变体，从而帮助更快发现高级模型和算法，把计算发现的周期压缩到更短时间。"],
    [/claude managed agents|vercel sandbox/i, "Claude Managed Agents 已接入 Vercel Sandbox，这意味着 Agent 运行环境正在与开发者基础设施更紧密结合。"],
    [/ai 变化尚未被充分定价|assistant -> coworker/i, "即便在湾区 AI 圈，很多人仍没有充分意识到 AI 已经从助手走向同事，并正在接近自主工作者。虽然自治还不成熟，但模型能力和任务执行框架会让它进入更多岗位。"],
    [/cursor 把 jira backlog|turn the backlog into reality/i, "把 backlog 变成现实：直接在 Jira 中使用 Cursor，让需求积压更快进入实现阶段。"],
    [/定价缓冲流量峰值|cdn pricing model/i, "新的 CDN 定价模型会平滑流量峰值和病毒式传播事件，减少突发账单和运维压力，同时保持网络性能和服务质量。"],
    [/^>\s*token costs/i, "Token 成本。"],
  ];
  const found = translations.find(([pattern]) => pattern.test(key));
  return found ? (Number.isFinite(limit) ? homeShort(found[1], limit) : found[1]) : "";
}

function pointChineseTranslationFull(point = {}) {
  return pointChineseTranslation(point, Number.POSITIVE_INFINITY);
}

function stripOpinionSpeakerPrefix(text = "", identity = {}) {
  const raw = cleanText(text || "");
  const names = [
    identity.name,
    identity.title,
    identity.handle,
    identity.org,
    "Aaron Levie",
    "Garry Tan",
    "Dan Shipper",
    "AI & I by Every",
    "Zara Zhang",
    "Swyx",
    "Sam Altman",
    "Guillermo Rauch",
  ].filter(Boolean);
  let output = raw;
  names.forEach((name) => {
    const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(new RegExp(`^${escaped}\\s*[：:｜|]\\s*`, "iu"), "");
  });
  return cleanText(output || raw);
}

function opinionCardTitle(point = {}, identity = opinionIdentity(point)) {
  const rawTitle = cleanText(stripOpinionSpeakerPrefix(point.title || "", identity));
  if (rawTitle && textHasHan(rawTitle)) return rawTitle;
  const translated = cleanText(stripOpinionSpeakerPrefix(pointChineseTranslation(point, 240), identity));
  if (translated) return homeShort(translated, 72);
  return "前沿观点";
}

function opinionChineseQuote(point = {}, identity = opinionIdentity(point), limit = 220) {
  return cleanText(stripOpinionSpeakerPrefix(pointChineseTranslation(point, limit), identity));
}

function opinionChineseQuoteFull(point = {}, identity = opinionIdentity(point)) {
  return cleanText(stripOpinionSpeakerPrefix(pointChineseTranslationFull(point), identity));
}

function pointGuanlanComment(point = {}, limit = 116) {
  const text = point.interpretation || point.usage || "";
  return homeShort(frontstageFactText(text), limit);
}

function pointRelatedSignalLabel(point = {}) {
  const related = Array.isArray(point.relatedSignals) ? point.relatedSignals.filter(Boolean) : [];
  if (related.length) return `${related.length} 条关联信号`;
  return point.date ? "今日信号" : "待关联";
}

function signalOpinionCard(point = {}, index = 0) {
  const tags = pointTagNames(point, 3);
  const sourceUrl = point.sourceUrl || "#";
  const detailUrl = opinionDetailHref(point, index);
  const comment = pointGuanlanComment(point);
  const identity = opinionIdentity(point);
  const title = opinionCardTitle(point, identity);
  const translation = opinionChineseQuote(point, identity, 240);
  const fields = [
    ["时间线", signalSystemDate(point.originalDate || point.date)],
    ["标签", (tags.length ? tags : ["前沿观点"]).join(" / ")],
  ];
  return `
    <article class="signal-opinion-card">
      <div class="signal-opinion-card-top">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <em>${safeHtml(identity.name || point.speakerLine || "公开来源")}</em>
      </div>
      <h3><a href="${safeAttribute(detailUrl)}">${safeHtml(title || "前沿观点")}</a></h3>
      ${translation ? `<blockquote>${safeHtml(translation)}</blockquote>` : ""}
      ${comment ? `<p><span>观澜解读</span>${comment}</p>` : ""}
      <div class="signal-opinion-fields">
        ${fields.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
      </div>
      <footer>
        <a href="${safeAttribute(detailUrl)}">人物页</a>
        ${sourceUrl !== "#" ? `<a href="${safeAttribute(sourceUrl)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
      </footer>
    </article>
  `;
}

function signalOpinionPanel(points = [], label = "同日摘录") {
  if (!points.length) return "";
  return `
    <section class="signal-opinion-strip signal-frontier-brief" aria-label="前沿观点">
      <div class="signal-system-section-head compact-head">
        <div>
          <span class="signal-system-label">${safeHtml(label)}</span>
          <h2>前沿观点</h2>
        </div>
        <a class="signal-system-more-link" href="opinion.html">查看全部</a>
      </div>
      <div class="signal-opinion-complete-grid">
        ${points.slice(0, 4).map((point, index) => signalOpinionCard(point, index)).join("")}
      </div>
    </section>
  `;
}

function signalSupportLine(signal = {}) {
  const cases = signalCaseNames(signal, 1);
  const sources = signalSourceNames(signal, 1);
  return compactJoin([cases[0], sources[0]], "公开来源");
}

function sourceListDrawer(item, compact = false) {
  const sources = signalSystemSources(item);
  return `
    <details class="signal-system-sources" ${compact ? "" : "open"}>
      <summary>出处和关键信息</summary>
      <div class="signal-system-source-list">
        ${sources.map((source, index) => `
          <a class="signal-system-source-row" href="${source.url}" ${source.url === "#" ? "" : 'target="_blank" rel="noreferrer"'}>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${source.name}</strong>
            <em>${source.grade}</em>
            <p>${source.fact}</p>
          </a>
        `).join("")}
      </div>
    </details>
  `;
}

function sourceLedgerMini(evidence) {
  return `
    <div class="source-ledger-mini" aria-label="来源摘要">
      <div>
        <span>来源概况</span>
        <strong>${evidence.total} 条来源</strong>
      </div>
      <div class="source-ledger-bars">
        ${[
          ["一手", evidence.s, "官方或原始材料"],
          ["报道", evidence.a, "可信报道"],
          ["背景", evidence.b, "背景观察"],
        ].map(([grade, count, label]) => `
          <span><i>${grade}</i><b style="--v:${Math.max(12, count * 28)}%"></b><em>${count} · ${label}</em></span>
        `).join("")}
      </div>
    </div>
  `;
}

function trackingFilterStrip() {
  return `
    <div class="tracking-filter-strip" aria-label="追踪筛选">
      ${["同一公司", "同一趋势", "相关趋势判断", "讨论升温", "时间线"].map((label, index) => `
        <button type="button"><i>${String(index + 1).padStart(2, "0")}</i>${label}</button>
      `).join("")}
    </div>
  `;
}

function signalClusterMap(item) {
  const tags = [
    ...signalSystemTags(item, "track", 2),
    ...signalSystemTags(item, "scenario", 2),
    ...signalSystemTags(item, "function", 1),
  ].filter(Boolean).slice(0, 5);
  const labels = tags.length ? tags : ["信号", "趋势", "机会", "前沿观点", "风险"];
  return `
    <div class="signal-cluster-map signal-image-card" aria-label="信号关系图">
      <img src="assets/generated/key-signal-editorial-map-imagegen.png" alt="AI 商业信号从来源汇聚到判断的位图插画">
      <div class="signal-cluster-labels">
        ${labels.map((label, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${label}</span>`).join("")}
      </div>
    </div>
  `;
}

function insightChart(type = "trend") {
  const bars = [74, 46, 31];
  return `
    <div class="signal-system-chart signal-system-chart-${type}">
      <div class="signal-system-stack">
        ${["一手材料", "可信报道", "背景观察"].map((label, index) => `
          <div><span>${label}</span><i style="width:${bars[index]}%"></i></div>
        `).join("")}
      </div>
    </div>
  `;
}

function commercialVariableGrid(item) {
  const analysis = item?.analysis?.length ? item.analysis : [
    ["客户是谁", item?.audience || "大中型企业 / AI 产品负责人 / 行业操盘手"],
    ["替代什么流程", "从信息问答转向跨系统流程执行、审计和人工接管。"],
    ["谁可能付费", "承担服务效率、合规边界和流程成本的业务负责人。"],
    ["为什么现在发生", "模型能力、企业工作流和平台交付同时进入可观察阶段。"],
    ["现有玩家影响", "纯模型能力不再足够，交付、治理和集成能力变成差异。"],
    ["中国市场迁移", "可迁移，但受数据合规、客单价和交付组织影响。"],
  ];
  return `
    <div class="commercial-variable-grid">
      ${analysis.slice(0, 6).map(([label, text], index) => `
        <div class="commercial-variable-card">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${label}</strong>
          <p>${cleanText(text)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function signalFrontCard(signal, index) {
  const evidence = signalSystemEvidence(signal);
  const variables = signalSystemTags(signal, "function", 2).concat(signalSystemTags(signal, "scenario", 1)).slice(0, 3);
  const supportLabel = evidence.status === "多源支撑" ? "事实来源" : evidence.status;
  return `
    <article class="front-signal-card">
      <a href="${signal.link || `signal-detail.html?id=${signal.slug}`}">
        <div class="front-signal-top">
          <span class="signal-system-id">FS.${String(index + 1).padStart(3, "0")}</span>
          <span>${signalSystemDate(signal.date)}</span>
        </div>
        <h3>${signal.title}</h3>
        <p>${summaryText(signal, signal.judgment)}</p>
        <div class="signal-system-chipline">
          ${evidenceBadge("多源支撑")}
          ${evidenceBadge(supportLabel)}
          ${variables.map((tag) => evidenceBadge(tag)).join("")}
        </div>
      </a>
    </article>
  `;
}

function structuredSignalAdapter(item, index) {
  const evidence = signalSystemEvidence(item);
  const variable = signalSystemTags(item, "function", 1)[0]
    || signalSystemTags(item, "scenario", 1)[0]
    || signalSystemTags(item, "track", 1)[0]
    || "商业变量待观察";
  const track = signalSystemTags(item, "track", 1)[0] || "AI Agent";
  return {
    ...item,
    structuredId: `SS.${String(index + 1).padStart(3, "0")}`,
    event: cleanText(item.title || "结构化信号"),
    variable,
    sourceGrade: evidence.sources[0]?.grade || "B级",
    sourceLabel: evidence.sources[0]?.grade === "S级" ? "一手材料" : evidence.sources[0]?.grade === "A级" ? "可信报道" : "背景观察",
    sourceName: evidence.sources[0]?.name || "来源整理中",
    sourceUrl: evidence.sources[0]?.url || "#",
    incrementalFact: evidence.sources[0]?.fact || summaryText(item),
    trendCandidate: track,
    trendReportCandidate: signalSystemTags(item, "scenario", 1)[0] || "继续观察",
    depthStatus: index < 3 ? "值得细看" : index < 8 ? "继续观察" : "线索记录",
  };
}

function structuredSignalRow(item, index) {
  const signal = structuredSignalAdapter(item, index);
  return `
    <a class="structured-signal-row" href="signal-detail.html?id=${signal.slug || signal.id}">
      <span>${signal.structuredId}</span>
      <strong>${signal.event}</strong>
      <p>${signal.variable}</p>
      <em>${signal.sourceLabel} · ${signal.sourceName}</em>
      <i>${signal.depthStatus}</i>
    </a>
  `;
}

function signalSystemBuilderProfiles() {
  const points = (data.contentIndex?.points || []).filter(isBuilderPoint);
  const grouped = groupBy(points, (point) => builderUsername(point.sourceUrl || point.source_url) || signalSystemUrlDomain(point.sourceUrl || point.source_url) || "research");
  return [...grouped.entries()].map(([handle, rows]) => {
    const sorted = rows.slice().sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    const latest = sorted[0] || {};
    const isSocialHandle = handle !== "research" && !handle.includes(".");
    const name = handle === "research" ? "Research Notes" : isSocialHandle ? `@${handle}` : handle;
    return {
      id: handle,
      handle,
      name,
      title: latest.title || "观点变化",
      org: signalSystemUrlDomain(latest.sourceUrl || latest.source_url) || "公开观点",
      roleType: handle === "research" ? "Research" : "Builder",
      focus: signalSystemTags(latest, "track", 2).join(" / ") || "AI 商业变化",
      latest,
      rows: sorted,
    };
  }).sort((a, b) => b.rows.length - a.rows.length);
}

function builderIdentityForPoint(point = {}, fallback = {}) {
  const url = String(point.sourceUrl || point.source_url || "");
  const title = String(point.title || "");
  const domain = signalSystemUrlDomain(url) || (String(fallback.handle || fallback.name || "").includes(".") ? String(fallback.handle || fallback.name) : "");
  const sourceLabel = sourceGroupName(domain || fallback.org || fallback.handle || fallback.name || "公开来源");
  if (/steipete/i.test(url)) return { name: "Peter Steinberger", title: "Developer Tools Founder" };
  if (/sama/i.test(url)) return { name: "Sam Altman", title: "OpenAI CEO" };
  if (/levie/i.test(url)) return { name: "Aaron Levie", title: "Box CEO" };
  if (/garrytan/i.test(url)) return { name: "Garry Tan", title: "Y Combinator CEO / 投资人" };
  if (/danshipper/i.test(url)) return { name: "Dan Shipper", title: "Every CEO / AI & I Host" };
  if (/every/i.test(url + title)) return { name: "AI & I by Every", title: "AI Media / Community" };
  if (/alexalbert__/i.test(url)) return { name: "Alex Albert", title: "Anthropic Developer Relations" };
  if (/trq212/i.test(url)) return { name: "Thariq", title: "AI Builder / Product Engineer" };
  if (/claudeai/i.test(url)) return { name: "Claude 官方观点", title: "Anthropic Product Channel" };
  if (/petergyang/i.test(url)) return { name: "Peter Yang", title: "Product & AI Writer" };
  if (/zarazhangrui/i.test(url)) return { name: "Zara Zhang", title: "AI Operator / Builder" };
  if (/claude|anthropic/i.test(title) && /youtube/i.test(url)) return { name: "Claude Platform Team", title: "Anthropic Product / Platform Team" };
  if (/karpathy/i.test(url + title)) return { name: "Andrej Karpathy", title: "AI Researcher / Builder" };
  if (/anthropic\.com\/engineering/i.test(url)) return { name: "Anthropic Engineering", title: "Claude Code Team" };
  if (/claude\.com|anthropic/i.test(url + title)) return { name: "Anthropic", title: "Claude Product Team" };
  if (domain || String(fallback.name || "").includes(".")) {
    return {
      name: `公开观点来源：${sourceLabel}`,
      title: "身份待补，不作为个人背书",
    };
  }
  return {
    name: fallback.name || "一线观察者",
    title: fallback.title || fallback.org || "公开观点来源",
  };
}

function builderOriginalText(point = {}) {
  const text = cleanText(point.originalView || point.title || "");
  const fallback = cleanText(point.interpretation || point.calibrates || point.usage || point.title || "");
  return (text.includes("见正文原文摘录") ? fallback : text)
    .replace(/^V1\s*/i, "")
    .replace(/^观点提示\s*/u, "")
    .replace(/属于\s*C\s*级观点线索[，,]*/u, "属于讨论升温线索，");
}

function builderOpinionCard(profile, index) {
  const latest = profile.latest || {};
  const status = ["新看法", "持续关注", "修正判断", "判断转向"][index % 4];
  const identity = builderIdentityForPoint(latest, profile);
  const original = opinionChineseQuote(latest, identity, 180) || builderOriginalText(latest);
  return `
    <article class="builder-opinion-card">
      <a href="builder-detail.html?id=${encodeURIComponent(profile.handle)}">
        <div class="builder-avatar">${identity.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <div class="builder-card-top">
            <strong>${identity.name}</strong>
            <span>${status}</span>
          </div>
          <small class="builder-role">${identity.title} · ${publicSourceLabel(profile.org)} · ${signalSystemDate(latest.date)}</small>
          <p class="builder-original">${original}</p>
          <p>${cleanText(latest.interpretation || latest.calibrates || latest.usage || latest.title || "这条观点可作为判断参照。")}</p>
          <small>${profile.focus}</small>
        </div>
      </a>
    </article>
  `;
}

function perspectiveStatus(index) {
  return ["新看法", "延续", "修正", "转向", "冲突"][index % 5];
}

function perspectiveRelation(index) {
  return ["强化", "补充", "修正", "补充", "冲突"][index % 5];
}

function perspectiveTopics(profile = {}, point = {}) {
  const tags = [
    ...signalSystemTags(point, "track", 2),
    ...signalSystemTags(point, "scenario", 1),
    ...String(profile.focus || "").split("/").map((item) => item.trim()).filter(Boolean),
  ].filter(Boolean);
  return [...new Set(tags)].slice(0, 3);
}

function perspectiveCard(profile, index, mode = "regular") {
  const latest = profile.latest || {};
  const identity = builderIdentityForPoint(latest, profile);
  const topics = perspectiveTopics(profile, latest);
  const headline = opinionCardTitle(latest, identity) || cleanText(builderOriginalText(latest) || "前沿观点");
  const detailUrl = opinionDetailHref(latest, index);
  const sourceUrl = latest.sourceUrl || "#";
  const comment = pointGuanlanComment(latest, 108);
  const translation = opinionChineseQuote(latest, identity, 240);
  const fields = [
    ["时间", signalSystemDate(latest.originalDate || latest.date)],
    ["来源", pointSourceLabel(latest)],
    ["相关", pointRelatedSignalLabel(latest)],
    ["标签", (topics.length ? topics : pointTagNames(latest, 2)).join(" / ") || "前沿观点"],
  ];
  return `
    <article class="perspective-card ${mode === "featured" ? "featured" : ""}">
      <div class="perspective-card-shell">
        <span class="perspective-card-index">${String(index + 1).padStart(2, "0")}</span>
        <div class="perspective-card-main">
          <small>${safeHtml(identity.name)}${identity.title ? ` · ${safeHtml(identity.title)}` : ""}</small>
          <strong><a href="${safeAttribute(detailUrl)}">人物页</a></strong>
          ${translation ? `<p class="perspective-original">${safeHtml(translation)}</p>` : ""}
          ${comment ? `<p class="perspective-comment"><span>观澜解读</span>${safeHtml(comment)}</p>` : ""}
        </div>
        <div class="perspective-card-fields">
          ${fields.map(([label, value]) => `<div><span>${safeHtml(label)}</span><strong>${safeHtml(value)}</strong></div>`).join("")}
        </div>
        <div class="perspective-card-actions">
          <a href="${safeAttribute(detailUrl)}">人物页</a>
          ${sourceUrl !== "#" ? `<a href="${safeAttribute(sourceUrl)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
        </div>
      </div>
    </article>
  `;
}

function perspectiveHeader() {
  const params = signalFilterParams();
  return `
    <section class="perspective-header">
      <div class="perspective-title">
        <span class="signal-system-label">栏目</span>
        <h1>前沿观点</h1>
      </div>
      <div class="perspective-controls">
        <form class="signal-search-bar" role="search">
          <label class="sr-only" for="builderSearch">搜索前沿观点</label>
          <input id="builderSearch" type="search" placeholder="搜索人物或观点">
        </form>
        <div class="signal-filter-bar">
          ${signalTagFilters().map((filter) => `<a href="${builderFilterHref(params.tag === filter.id ? "" : filter.id)}" class="${params.tag === filter.id ? "active" : ""}">${filter.label}</a>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function featuredPerspectives(profiles) {
  return `
    <section class="featured-perspectives">
      <div class="signal-system-section-head compact-head">
        <div>
          <span class="signal-system-label">今日观点</span>
          <h2>原文摘录</h2>
        </div>
      </div>
      <div class="featured-perspective-grid">
        ${profiles.slice(0, 4).map((profile, index) => perspectiveCard(profile, index, "featured")).join("")}
      </div>
    </section>
  `;
}

function perspectiveGrid(profiles) {
  return `
    <section class="perspective-grid-section">
      <div class="signal-system-section-head compact-head">
        <div>
          <span class="signal-system-label">更多观点</span>
          <h2>人物与主题</h2>
        </div>
      </div>
      <div class="perspective-grid">
        ${profiles.slice(4, 8).map((profile, index) => perspectiveCard(profile, index + 4)).join("")}
      </div>
    </section>
  `;
}

function calibrationSnapshot(profiles) {
  const total = Math.max(profiles.length, 1);
  const stats = [
    ["新看法", Math.min(4, total)],
    ["修正观点", Math.min(3, Math.max(1, total - 2))],
    ["转向 / 冲突", Math.min(2, Math.max(1, Math.floor(total / 4)))],
  ];
  return `
    <section class="calibration-snapshot">
      <div>
        <span class="signal-system-label">校准边界</span>
        <h2>最近怎么看</h2>
        <p>观点是判断参照，不是事实主证据。</p>
      </div>
      <div class="calibration-window-list">
        ${["7天：有没有新判断", "30天：判断是否延续或修正", "90天：变量有没有转向"].map((text, index) => `
          <div><span>${index === 0 ? "7D" : index === 1 ? "30D" : "90D"}</span><p>${text}</p></div>
        `).join("")}
      </div>
      <div class="calibration-stat-strip">
        ${stats.map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("")}
      </div>
    </section>
  `;
}

function builderProfileHeader(profile, identity) {
  const latest = profile.latest || {};
  const topics = perspectiveTopics(profile, latest);
  const latestSource = latest.sourceUrl || profile.sourceUrl || "";
  return `
    <section class="builder-profile-header">
      <div class="builder-profile-identity">
        <div class="builder-avatar large">${identity.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <span class="signal-system-label">前沿观点 · ${signalSystemDate(latest.originalDate || latest.date)}</span>
          <h1>${identity.name || "前沿观点"}</h1>
          <p>${identity.title} · ${publicSourceLabel(profile.org)}</p>
          <div class="signal-system-chipline">
            ${topics.slice(0, 4).map(evidenceBadge).join("") || evidenceBadge("AI 商业变化")}
          </div>
        </div>
      </div>
      <aside class="builder-profile-summary">
        ${[
          ["身份", identity.title || "公开观点来源"],
          ["来源", publicSourceLabel(profile.org)],
          ["最新观点", homeShort(opinionCardTitle(latest, identity) || "暂无公开观点标题", 64)],
          ["原文链接", latestSource ? "可查看" : "暂无公开链接"],
        ].map(([label, value]) => `<p><span>${label}</span><strong>${value}</strong></p>`).join("")}
        ${latestSource ? `<a class="builder-profile-source-link" href="${safeAttribute(latestSource)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
        <div class="perspective-tags">
          ${topics.map((tag) => `<em>${tag}</em>`).join("") || `<em>AI 商业变化</em>`}
        </div>
      </aside>
    </section>
  `;
}

function currentViewPanel(rows) {
  return `
    <section class="current-view-panel">
      <div class="report-section-head">
        <span>观澜解读</span>
        <h2>观澜解读</h2>
      </div>
      <div class="current-view-list">
        ${rows.slice(0, 3).map((row, index) => `
          <article>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <p>${homeShort(cleanText(row.interpretation || row.calibrates || row.title), 118)}</p>
            <div class="perspective-tags">
              <em>${perspectiveStatus(index)}</em>
              ${perspectiveTopics({}, row).slice(0, 2).map((tag) => `<em>${tag}</em>`).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function viewTimelinePanel(rows) {
  return `
    <section class="view-timeline-section">
      <div class="report-section-head">
        <span>原文观点</span>
        <h2>最近观点</h2>
      </div>
      <div class="view-timeline">
        ${rows.slice(0, 3).map((row, index) => `
          <article class="view-timeline-item">
            <time>${signalSystemDate(row.date)}</time>
            <div>
              <span>${perspectiveStatus(index)} · ${perspectiveRelation(index)}</span>
              <h3>${homeShort(opinionCardTitle(row, opinionIdentity(row)), 64)}</h3>
              <p class="builder-original">${homeShort(opinionChineseQuote(row, opinionIdentity(row), 180), 132)}</p>
              <p>${homeShort(cleanText(row.interpretation || row.calibrates || row.usage || opinionChineseQuote(row, opinionIdentity(row), 160)), 128)}</p>
              <div class="perspective-tags">
                ${perspectiveTopics({}, row).slice(0, 3).map((tag) => `<em>${tag}</em>`).join("")}
                ${row.sourceUrl ? `<a href="${row.sourceUrl}" target="_blank" rel="noreferrer">原始来源</a>` : ""}
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function shiftAnalysisPanel(rows) {
  const first = rows[0] || {};
  return `
    <section class="shift-analysis-panel">
      <div class="report-section-head">
        <span>商业变量</span>
        <h2>商业变量</h2>
      </div>
      <div class="shift-analysis-grid">
        ${[
          ["观点变化", "新的公开观点开始指向企业采用、交付方式或组织变化。"],
          ["变化发生在哪个变量", perspectiveTopics({}, first).join(" / ") || "客户采用 / 商业化 / 组织采用"],
          ["商业意义", "它帮助理解企业会先在哪些流程、岗位和预算上感受到变化。"],
          ["对应信号", "可与同日商业信号、案例和来源材料一起阅读。"],
        ].map(([title, text], index) => `
          <article>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${title}</strong>
            <p>${text}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function builderRelatedLinks() {
  return `
    <section class="builder-related-links">
      <div class="report-section-head">
        <span>相关内容</span>
        <h2>相关信号与案例</h2>
      </div>
      <div class="structured-related-list">
        ${trackingIndexItems().slice(0, 6).map((item, index) => `
          <a href="${item.href || item.link || "#"}">
            <span>${item.type || "相关"} · ${String(index + 1).padStart(2, "0")}</span>
            <strong>${item.title || item.id}</strong>
            <p>${publicSummaryText(item)}</p>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function builderSignalsForRows(rows = [], limit = 8) {
  const seen = new Set();
  return rows.flatMap((row) => opinionRelatedSignals(row, limit))
    .filter((signal) => {
      const key = signal.id || signal.slug || signal.title;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function builderThemeRows(rows = [], limit = 6) {
  return opinionTopNames(rows.flatMap((row) => pointPublicTaxonomyTagNames(row, 8)), limit);
}

function builderCompanyRows(signals = [], limit = 5) {
  return opinionTopNames(signals.map(signalSubjectName), limit);
}

function builderImpactLine(rows = []) {
  const text = rows.map((row) => `${row.title || ""} ${row.originalView || ""} ${row.interpretation || ""}`).join(" ").toLowerCase();
  if (/mcp|api|sdk|developer|coding|code|开发|代码/.test(text)) return "工具连接和企业交付正在变成核心问题。";
  if (/exa|search|data|infra|snowflake|数据|基础设施|搜索/.test(text)) return "数据入口和基础设施选择正在前移。";
  if (/workflow|enterprise|governance|permission|企业|工作流|权限|治理/.test(text)) return "企业采用的关键在权限、流程和协作。";
  if (/cost|pricing|model|inference|成本|定价|模型/.test(text)) return "模型成本会影响预算和产品定价。";
  return "这些观点指向 AI 进入真实业务流程的方式。";
}

function builderCleanComment(value = "") {
  const text = frontstageFactText(value)
    .replaceAll("保留为人物观点时间线；", "")
    .replaceAll("涉及事实判断时仍需公司材料或可靠报道支持。", "")
    .replaceAll("人物观点记录：", "")
    .trim();
  return text || "这条观点有助于判断产品路线、客户采用或工作流变化。";
}

function builderObserverHero(profile = {}, identity = {}, rows = []) {
  const latest = rows[0] || profile.latest || {};
  const relatedSignals = builderSignalsForRows(rows, 6);
  const themes = builderThemeRows(rows, 8);
  const byType = signalTodayGroups(relatedSignals);
  const typeRows = [
    ["融资", byType.funding.length],
    ["案例", byType.case.length],
    ["产品", byType.product_service.length],
  ].filter(([, value]) => value);
  const sourceUrl = latest.sourceUrl || "#";
  const comment = builderCleanComment(pointGuanlanComment(latest, 180) || latest.interpretation || latest.usage || "");
  const title = opinionCardTitle(latest, identity) || "最近观点";
  const translation = opinionChineseQuoteFull(latest, identity);
  return `
    <section class="builder-observer-hero">
      <div class="builder-observer-main">
        <a class="builder-observer-back" href="opinion.html">前沿观点</a>
        <div class="builder-observer-person">
          <strong>${safeHtml(identity.name || "公开观点")}</strong>
          <span>${safeHtml(identity.title || "公开观点来源")}</span>
        </div>
        <h1>${safeHtml(title)}</h1>
        ${translation ? `
          <div class="builder-observer-translation">
            <span>观点摘录</span>
            <p>${safeHtml(translation)}</p>
          </div>
        ` : ""}
        ${comment ? `
          <div class="builder-observer-comment">
            <span>观澜解读</span>
            <p>${safeHtml(comment)}</p>
          </div>
        ` : ""}
        <div class="builder-observer-actions">
          ${sourceUrl !== "#" ? `<a href="${safeAttribute(sourceUrl)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
        </div>
      </div>
      <aside class="builder-observer-rail">
        <span>商业影响</span>
        <strong>${safeHtml(signalSystemDate(latest.date || latest.originalDate))}</strong>
        <p>${safeHtml(builderImpactLine(rows))}</p>
        <dl>
          <div><dt>观点</dt><dd>${rows.length}</dd></div>
          <div><dt>相关变化</dt><dd>${relatedSignals.length}</dd></div>
          <div><dt>主标签</dt><dd>${safeHtml(themes[0]?.label || "前沿观点")}</dd></div>
        </dl>
        <div class="builder-rail-block builder-rail-tags">
          <h3>相关标签</h3>
          <div>
            ${themes.map((row) => `<a href="opinion.html?theme=${encodeURIComponent(row.label)}">${safeHtml(row.label)} <b>${row.value}</b></a>`).join("") || `<span>暂无标签</span>`}
          </div>
        </div>
        <div class="builder-rail-block builder-rail-types">
          <h3>信号类型</h3>
          <div class="builder-observer-type-bars">
            ${(typeRows.length ? typeRows : [["观点", rows.length]]).map(([label, value]) => `
              <div><span>${safeHtml(label)}</span><b style="width:${Math.max(16, Number(value) * 28)}%"></b><strong>${value}</strong></div>
            `).join("")}
          </div>
        </div>
      </aside>
    </section>
  `;
}

function builderObserverTimeline(rows = []) {
  return `
    <section class="builder-observer-section builder-observer-timeline">
      <div class="builder-observer-section-head">
        <h2>观点时间轴</h2>
      </div>
      <div class="builder-observer-timeline-list">
        ${rows.map((row, index) => {
          const identity = opinionIdentity(row);
          const title = opinionCardTitle(row, identity) || "观点";
          const translation = opinionChineseQuote(row, identity, 320);
          return `
          <article>
            <time>${safeHtml(signalSystemDate(row.date || row.originalDate))}</time>
            <div>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <h3>${safeHtml(title)}</h3>
              ${translation ? `<blockquote>${safeHtml(translation)}</blockquote>` : ""}
            </div>
          </article>
        `; }).join("") || `<p>暂无可展示时间线。</p>`}
      </div>
    </section>
  `;
}

function builderObserverImpact(rows = []) {
  const relatedSignals = builderSignalsForRows(rows, 6);
  return `
    <section class="builder-observer-section builder-observer-impact">
      <div class="builder-observer-section-head">
        <h2>相关变化</h2>
      </div>
      <div class="builder-observer-impact-list">
        ${relatedSignals.slice(0, 6).map((signal) => `
          <a href="${safeAttribute(signalHref(signal))}">
            <span>${safeHtml(signalTypeLabel(signal.signalType || signal.type))}</span>
            <strong>${safeHtml(dailySignalShortTitle(signal))}</strong>
            <p>${safeHtml(signalEventLine(signal, 112))}</p>
          </a>
        `).join("") || `<p>暂无可展示商业变化。</p>`}
      </div>
    </section>
  `;
}

function builderObserverRelated(profile = {}, rows = []) {
  const currentHandle = profile.handle || "";
  const related = signalSystemBuilderProfiles()
    .filter((item) => item.handle !== currentHandle)
    .slice(0, 4);
  return `
    <section class="builder-observer-section builder-observer-related">
      <div class="builder-observer-section-head">
        <h2>相近人物</h2>
      </div>
      <div class="builder-observer-related-grid">
        ${related.map((item) => {
          const identity = builderIdentityForPoint(item.latest, item);
          const title = opinionCardTitle(item.latest, identity) || "最近观点";
          const translation = opinionChineseQuote(item.latest, identity, 140);
          return `
            <a href="builder-detail.html?id=${encodeURIComponent(item.handle)}">
              <span>${safeHtml(identity.name)}</span>
              <strong>${safeHtml(homeShort(title, 54))}</strong>
              ${translation ? `<p>${safeHtml(translation)}</p>` : ""}
            </a>
          `;
        }).join("") || `<p>暂无相关观点。</p>`}
      </div>
    </section>
  `;
}

function builderObserverPage(profile = {}, identity = {}, rows = []) {
  return `
    <article class="builder-observer-page">
      ${builderObserverHero(profile, identity, rows)}
      ${builderObserverTimeline(rows)}
      ${builderObserverImpact(rows)}
      ${builderObserverRelated(profile, rows)}
    </article>
  `;
}

function relatedContentBlock(items = []) {
  return `
    <div class="signal-related-list">
      ${items.slice(0, 6).map((item, index) => `
        <a href="${item.href || item.link || "#"}">
          <span>${item.type || "INDEX"} ${String(index + 1).padStart(2, "0")}</span>
          <strong>${item.title || item.id}</strong>
          <p>${publicSummaryText(item)}</p>
        </a>
      `).join("")}
    </div>
  `;
}

function signalRelationshipBar() {
  const steps = [
    ["变化卡", "事实线索", "单条变化先看来源差异、客户采用和材料缺口。"],
    ["精选信号", "商业信号", "多源事实指向同一客户、流程、预算或风险信息时，进入深读判断。"],
    ["Trend Report", "趋势追踪", "多条信号持续指向同一变化，才写成趋势报告；趋势判断只作为报告中的一部分。"],
    ["Business Brief", "商业内参", "当一组信号形成周期性组合判断，进入内参，讨论本周或本月的主线。"],
  ];
  return `
    <div class="signal-relationship-bar" aria-label="信号到趋势和内参的关系">
      <p>商业信号不是结论。多条信号持续指向同一客户、流程或预算变化时，才会进入趋势追踪；当这些变化形成周期性组合判断，才会进入商业内参。</p>
      <div>
        ${steps.map(([label, title, text], index) => `
          <article>
            <span>${String(index + 1).padStart(2, "0")} · ${label}</span>
            <strong>${title}</strong>
            <em>${text}</em>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function trackingIndexItems() {
  const signals = (data.contentIndex?.signals || data.signals || []).slice(0, 4).map((item) => ({ ...item, type: "信号", href: item.link || `signal-detail.html?id=${item.slug}` }));
  const trends = (data.contentIndex?.trends || []).slice(0, 3).map((item) => ({ ...item, type: "趋势", href: "signals.html#calibration" }));
  const trendReports = (data.contentIndex?.trendReports || []).slice(0, 3).map((item) => ({ ...item, type: "趋势", href: `trend-detail.html?id=${item.slug}` }));
  const builders = signalSystemBuilderProfiles().slice(0, 3).map((profile) => ({
    type: "前沿观点",
    title: builderIdentityForPoint(profile.latest, profile).name,
    brief: profile.latest?.interpretation || profile.latest?.title,
    href: `builder-detail.html?id=${encodeURIComponent(profile.handle)}`,
  }));
  return [...signals, ...trends, ...trendReports, ...builders];
}

function trackingIndexCompact() {
  const signals = data.contentIndex?.signals || data.signals || [];
  const trends = data.contentIndex?.trends || [];
  const trendReports = data.contentIndex?.trendReports || [];
  const builders = signalSystemBuilderProfiles();
  const groups = [
    {
      title: "公司连续出现",
      items: signals.slice(0, 3).map((item, index) => ({
        name: signalSystemTags(item, "formal", 1)[0] || signalSystemTags(item, "track", 1)[0] || item.title,
        date: signalSystemDate(item.date),
        count: `${index + 2} 次`,
        href: item.link || `signal-detail.html?id=${item.slug || item.id}`,
      })),
    },
    {
      title: "趋势持续升温",
      items: trends.slice(0, 3).map((item, index) => ({
        name: item.title,
        date: signalSystemDate(item.date),
        count: `${index + 3} 天`,
        href: "signals.html#calibration",
      })),
    },
    {
      title: "趋势方向成形",
      items: trendReports.slice(0, 3).map((item, index) => ({
        name: item.title,
        date: signalSystemDate(item.date),
        count: `${index + 1} 条信号`,
        href: `trend-detail.html?id=${item.slug || item.id}`,
      })),
    },
    {
      title: "前沿观点变化",
      items: builders.slice(0, 3).map((profile, index) => ({
        name: builderIdentityForPoint(profile.latest, profile).name,
        date: signalSystemDate(profile.latest?.date),
        count: `${profile.rows.length || index + 1} 条`,
        href: `builder-detail.html?id=${encodeURIComponent(profile.handle)}`,
      })),
    },
  ];
  return `
    <div class="tracking-compact-grid">
      ${groups.map((group, groupIndex) => `
        <article class="tracking-compact-block">
          <span>${String(groupIndex + 1).padStart(2, "0")}</span>
          <h3>${group.title}</h3>
          ${group.items.map((item) => `
            <a href="${item.href}">
              <strong>${cleanText(item.name)}</strong>
              <em>${item.date} · ${item.count}</em>
            </a>
          `).join("")}
        </article>
      `).join("")}
    </div>
  `;
}

function reportTitleHtml(title = "") {
  return cleanText(title);
}

function reportMetaBar(signal, evidence) {
  const eventTags = [
    ...signalSystemTags(signal, "source", 1),
    ...signalSystemTags(signal, "scenario", 1),
    ...signalSystemTags(signal, "function", 1),
  ].filter(Boolean).slice(0, 3).join(" / ") || "融资 / 客户采用 / 企业工作流";
  return `
    <div class="report-meta-bar" aria-label="报告信息">
      ${[
        ["日期", signalSystemDate(signal.date)],
        ["来源结构", `${evidence.s}S / ${evidence.a}A / ${evidence.b}B`],
        ["事件类型", eventTags],
        ["证据状态", evidence.status],
      ].map(([label, value]) => `
        <div><span>${label}</span><strong>${value}</strong></div>
      `).join("")}
    </div>
  `;
}

function editorialJudgmentCard(signal, evidence) {
  const variables = [
    ...signalSystemTags(signal, "scenario", 1),
    ...signalSystemTags(signal, "function", 2),
  ].filter(Boolean).slice(0, 3).join(" / ") || "客户采用 / 交付成本 / 责任边界";
  return `
    <section class="editorial-judgment-card">
      <div>
        <span class="signal-system-label">编辑判断</span>
        <p>${signal.judgment || summaryText(signal)}</p>
      </div>
      <aside>
        ${[
          ["信号强度", "中高"],
          ["当前状态", "值得继续观察"],
          ["关键变量", variables],
          ["来源状态", evidence.status],
        ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
      </aside>
    </section>
  `;
}

function factLedger(signal) {
  const roles = ["事件主体", "客户采用", "外部语境", "成本或限制"];
  return `
    <div class="fact-ledger">
      ${signalSystemSources(signal).slice(0, 5).map((source, index) => `
        <a class="fact-ledger-row" href="${source.url}" ${source.url === "#" ? "" : 'target="_blank" rel="noreferrer"'}>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>${source.name}</strong>
            <p>${source.fact}</p>
          </div>
          <em>${source.grade}</em>
          <i>${roles[index] || "补充判断所需信息"}</i>
        </a>
      `).join("")}
    </div>
  `;
}

function relationTextTokens(item = {}) {
  return [
    item.title,
    item.brief,
    item.judgment,
    item.event,
    item.sourceUrl,
    item.sourcePath,
  ].filter(Boolean).join(" ").toLowerCase();
}

function caseRelationScore(signal, caseItem) {
  const signalText = relationTextTokens(signal);
  const caseText = relationTextTokens(caseItem);
  const keywordGroups = [
    ["codex", "sandbox", "围栏", "权限", "隔离"],
    ["genkit", "middleware", "门禁", "拦截"],
    ["copilot", "billing", "github", "账单", "用量"],
    ["claude", "legal", "法律", "法务"],
    ["pwc", "anthropic", "普华永道", "合作"],
    ["tanstack", "npm", "供应链"],
    ["cursor", "cloud agents"],
  ];
  let score = 0;
  keywordGroups.forEach((group) => {
    const signalHit = group.some((keyword) => signalText.includes(keyword));
    const caseHit = group.some((keyword) => caseText.includes(keyword));
    if (signalHit && caseHit) score += 3;
  });
  return score;
}

function relatedCaseAssets(signal, limit = 4) {
  const exact = relatedAssets(signal, "signal").case || [];
  const allCases = data.contentIndex?.cases || [];
  const ranked = allCases
    .filter((item) => !exact.some((exactItem) => exactItem.id === item.id))
    .map((item) => ({ item, score: caseRelationScore(signal, item) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
  const seen = new Set();
  return [...exact, ...ranked].filter((item) => {
    const key = item.id || item.slug || item.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

function signalSourceBasisCards(signal) {
  return signalSystemSources(signal).slice(0, 3).map((source, index) => ({
    id: `SRC-${String(index + 1).padStart(2, "0")}`,
    title: source.name,
    brief: source.fact,
    sourceUrl: source.url,
    grade: source.grade,
  }));
}

function signalCaseEvidenceSection(signal) {
  const cases = relatedCaseAssets(signal, 4);
  const sourceCards = signalSourceBasisCards(signal);
  if (!cases.length && !sourceCards.length) return "";
  return `
    <section class="report-section signal-case-evidence-section">
      <div class="report-section-head">
        <span>相关案例</span>
        <h2>这条变化依据什么案例</h2>
        <p>先看能核对的事件和相邻案例，再判断它是不是孤立新闻。</p>
      </div>
      <div class="signal-case-evidence-grid">
        ${sourceCards.length ? `
          <div class="signal-case-evidence-column">
            <span class="signal-case-eyebrow">来源依据</span>
            ${sourceCards.map((source) => `
              <a class="signal-case-source-card" href="${safeAttribute(source.sourceUrl)}" ${source.sourceUrl === "#" ? "" : 'target="_blank" rel="noreferrer"'}>
                <strong>${source.title}</strong>
                <p>${source.brief}</p>
                <em>${source.grade}</em>
              </a>
            `).join("")}
          </div>
        ` : ""}
        ${cases.length ? `
          <div class="signal-case-evidence-column">
            <span class="signal-case-eyebrow">相关案例卡</span>
            ${cases.map((item, index) => `
              <article class="signal-case-card">
                <span>${item.id || `CASE-${String(index + 1).padStart(2, "0")}`}</span>
                <h3>${item.title}</h3>
                <p>${summaryText(item, item.brief)}</p>
                ${tagRow(item, 3)}
              </article>
            `).join("")}
          </div>
        ` : ""}
      </div>
    </section>
  `;
}

function businessVariableMap(signal) {
  const nodes = [
    "客户采用",
    "交付成本",
    "上线周期",
    "责任范围",
    "平台化交付",
    "企业预算",
  ];
  return `
    <div class="business-variable-map signal-image-card" aria-label="商业变量关系图">
      <img src="assets/generated/key-signal-editorial-map-imagegen.png" alt="客户、流程、预算和风险信息汇聚成商业判断的位图插画">
      <div>
        ${nodes.map((label, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${label}</span>`).join("")}
      </div>
    </div>
  `;
}

function evidenceBoundaryList(signal) {
  const front = signalFrontend(signal);
  const items = front.evidenceBoundary?.length
    ? front.evidenceBoundary.map((text, index) => [`还缺 ${String(index + 1).padStart(2, "0")}`, text])
    : [
    ["证据缺口", "缺少可公开核对的客户采用规模和持续付费数据。"],
    ["风险信息", signal.counter || "真实采用规模、付费意愿和责任范围仍待补齐。"],
    ["商业变量", "上线周期、事故成本和人工接管机制仍会影响商业化速度。"],
  ];
  return `
    <div class="evidence-boundary-list">
      ${items.map(([label, text], index) => `
        <div>
          <span>${String(index + 1).padStart(2, "0")} · ${label}</span>
          <p>${cleanText(text)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function watchNextPanel(signal) {
  const front = signalFrontend(signal);
  const tags = [...signalSystemTags(signal, "track", 3), ...signalSystemTags(signal, "scenario", 3)].filter(Boolean);
  const rows = front.watchWindow?.length
    ? front.watchWindow.map((item) => `${item.label}：${item.text}`)
    : ["7天：看官方是否补充客户、权限和动作边界。", "30天：看是否出现采购、试点或渠道合作信号。", "90天：如果多条信号继续指向同一流程，再考虑进入趋势追踪或商业内参。"];
  return `
    <section class="watch-next-panel">
      <div>
        <span class="signal-system-label">动态记录</span>
        <h2>接下来记录什么</h2>
        <div class="tracking-tags">
          ${tags.map((tag, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${tag}</span>`).join("")}
        </div>
      </div>
      <div class="watch-next-timeline">
        ${rows.map((text, index) => `
          <div><span>${index === 0 ? "7D" : index === 1 ? "30D" : "90D"}</span><p>${text}</p></div>
        `).join("")}
      </div>
    </section>
  `;
}

function structuredDossier(signal) {
  return `
    <section class="structured-dossier">
      <div class="structured-dossier-main">
        <span class="signal-system-label">STRUCTURED SIGNAL · ${signal.structuredId}</span>
        <h1>${signal.event}</h1>
        <p>${cleanText(signal.judgment || summaryText(signal))}</p>
        <div class="structured-source-summary">
          ${["主要出处", "影响变量", "动态记录"].map((label, index) => {
            const value = index === 0 ? `${signal.sourceGrade} · ${signal.sourceName}` : index === 1 ? signal.variable : signal.trendCandidate;
            return `<div><span>${label}</span><strong>${value}</strong></div>`;
          }).join("")}
        </div>
      </div>
      <aside class="structured-status-card">
        <span class="signal-system-label">当前判断</span>
        <h2>${signal.depthStatus === "值得细看" ? "继续观察，接近升级线" : signal.depthStatus}</h2>
        <div>
          ${[
            ["当前判断", signal.depthStatus === "值得细看" ? "继续观察，接近升级线" : signal.depthStatus],
            ["来源状态", signal.sourceGrade === "S级" ? "一手来源已出现" : "继续观察"],
            ["主要来源", signal.sourceGrade],
            ["关联趋势", signal.trendCandidate],
            ["趋势判断", signal.trendReportCandidate],
            ["观察窗口", "7D / 30D / 90D"],
          ].map(([label, value]) => `<p><span>${label}</span><strong>${value}</strong></p>`).join("")}
        </div>
      </aside>
    </section>
  `;
}

function structuredSourceLedger(signal) {
  return `
    <section class="structured-source-ledger">
      <div class="report-section-head">
        <span>来源与事实</span>
        <h2>来源与关键事实</h2>
        <p>同一条信号需要拆开看：谁确认了事件，谁提供客户采用，谁补充成本材料。</p>
      </div>
      <div class="structured-ledger-list">
        ${signalSystemSources(signal).slice(0, 4).map((source, index) => `
          <a href="${source.url}" ${source.url === "#" ? "" : 'target="_blank" rel="noreferrer"'} class="structured-ledger-row">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>${source.name}</strong>
              <p>${source.fact}</p>
            </div>
            <em>${source.grade}</em>
            <i>${sourceRoleForUrl(source.url, index)}</i>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function structuredMiniMap(signal) {
  const nodes = [signal.variable, signal.trendCandidate, signal.trendReportCandidate, "还缺什么"].filter(Boolean);
  return `
    <div class="structured-mini-map signal-image-card" aria-label="信号关系图">
      <img src="assets/generated/key-signal-editorial-map-imagegen.png" alt="结构化信号进入动态记录的位图插画">
      <div>
        ${nodes.slice(0, 4).map((label, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${label}</span>`).join("")}
      </div>
    </div>
  `;
}

function structuredCommercialRead(signal) {
  const cards = [
    ["影响变量", `${signal.variable}。这条信号主要影响客户采用、流程承接和责任边界。`],
    ["为什么入池", "它不是单条新闻，而是企业开始把 Agent 放进真实服务场景的迹象。"],
    ["还缺什么", signal.counter || "仍需补充更多客户采用、付费意愿和长期效果数据。"],
    ["趋势判断", `${signal.trendReportCandidate || "客户体验 Agent 平台"}。目前更接近客服前台运营层的早期变化，仍按继续观察处理。`],
  ];
  return `
    <section class="structured-commercial-read">
      <div>
        <div class="report-section-head">
          <span>商业解读</span>
          <h2>商业解读</h2>
        </div>
        <div class="structured-read-grid">
          ${cards.map(([title, text], index) => `
            <article>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${title}</strong>
              <p>${cleanText(text)}</p>
            </article>
          `).join("")}
        </div>
      </div>
      ${structuredMiniMap(signal)}
    </section>
  `;
}

function structuredUpgradeWatch(signal) {
  return `
    <section class="structured-upgrade-watch">
      <div class="report-section-head">
        <span>证据缺口</span>
        <h2>还差哪些证据</h2>
      </div>
      <div class="upgrade-watch-grid">
        ${[
          ["当前建议", signal.depthStatus === "值得细看" ? "继续观察，接近升级线" : "继续观察，暂不升级"],
          ["为什么还不够", "它已经指向真实流程变化，但客户续约、交付成本和平台挤压还没有被充分验证。"],
          ["缺口证据", "需要更多客户采用、产品数据、企业采购或监管材料。"],
          ["触发条件", "后续出现一手材料，或多来源互相印证时，可进入商业信号深读。"],
        ].map(([label, text], index) => `
          <div>
            <span>${String(index + 1).padStart(2, "0")} · ${label}</span>
            <p>${text}</p>
          </div>
        `).join("")}
      </div>
      <div class="upgrade-watch-bar">
        ${["暂不升级", "继续观察", "建议升级"].map((label, index) => `<span class="${index === 1 ? "active" : ""}">${label}</span>`).join("")}
      </div>
    </section>
  `;
}

function structuredRelatedPath() {
  const items = trackingIndexItems().slice(0, 8);
  return `
    <section class="structured-related-path">
      <div class="report-section-head">
        <span>判断路径</span>
        <h2>相关追踪</h2>
        <p>结构化信号先进入观察；证据持续增强后，才会进入商业信号、趋势追踪或商业内参。</p>
      </div>
      <div class="structured-related-list">
        ${items.map((item, index) => `
          <a href="${item.href || item.link || "#"}">
            <span>${item.type || "相关"} · ${String(index + 1).padStart(2, "0")}</span>
            <strong>${item.title || item.id}</strong>
            <p>${publicSummaryText(item)}</p>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function signalTypeKey(signal = {}) {
  const raw = String(signal.signalType || signal.type || "").toLowerCase();
  if (raw.includes("funding")) return "funding";
  if (raw.includes("case")) return "case";
  if (raw.includes("product") || raw.includes("service")) return "product_service";
  return raw || "other";
}

function signalTodayGroups(signals = []) {
  return {
    funding: signals.filter((item) => signalTypeKey(item) === "funding"),
    case: signals.filter((item) => signalTypeKey(item) === "case"),
    product_service: signals.filter((item) => signalTypeKey(item) === "product_service"),
  };
}

function signalDateKey(signal = {}) {
  return String(signal.date || signal.updated || signal.label || "").slice(0, 10).replaceAll(".", "-");
}

function signalRecentFirst(items = []) {
  return items.slice().sort((a, b) => {
    const dateOrder = signalDateKey(b).localeCompare(signalDateKey(a));
    if (dateOrder) return dateOrder;
    return String(a.id || a.slug || a.title || "").localeCompare(String(b.id || b.slug || b.title || ""), "zh-Hans-CN");
  });
}

function signalOnOrBeforeDate(signal = {}, date = "") {
  const key = signalDateKey(signal);
  return key && date ? key <= date : true;
}

function signalTopNames(values = [], limit = 4) {
  const counts = new Map();
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function signalDistributionRows(key = "", items = [], allSignals = []) {
  if (key === "funding") {
    const stages = signalTopNames(items.map(signalFundingStage).filter(Boolean), 4);
    if (stages.length) return stages;
  }
  const rows = signalTopNames(items.flatMap((item) => signalTagNames(item, 3)), 4);
  if (rows.length) return rows;
  return [{ label: key === "product_service" ? "产品信号" : "案例信号", value: items.length }];
}

function signalFundingStage(signal = {}) {
  const text = cleanText(`${signal.title || ""} ${signal.summary || ""} ${signal.frontend?.newsSummary || ""}`);
  const match = text.match(/Pre-Seed|Seed|种子轮|天使轮|A\s*轮|B\s*轮|C\s*轮|D\s*轮|E\s*轮|战略融资/iu);
  if (!match) return "";
  return match[0]
    .replace(/Pre-Seed/iu, "Pre-Seed")
    .replace(/Seed/iu, "种子轮")
    .replace(/\s+/g, "");
}

function signalLaneKeywordRows(key = "", items = []) {
  const stageRows = key === "funding"
    ? signalTopNames(items.map(signalFundingStage).filter(Boolean), 4).map((row) => ({ ...row, group: "轮次" }))
    : [];
  const tagRows = signalTopNames(items.flatMap((item) => signalTagNames(item, 3)), 8)
    .map((row) => ({ ...row, group: "" }));
  return [...stageRows, ...tagRows].slice(0, 9);
}

function signalLaneKeywordChips(rows = []) {
  if (!rows.length) return "";
  return `
    <div class="signal-lane-keywords">
      ${rows.map((row) => `
        <span>
          ${row.group ? `<em>${row.group}</em>` : ""}
          <strong>${row.label}</strong>
          <b>${row.value}</b>
        </span>
      `).join("")}
    </div>
  `;
}

function signalMiniBars(rows = []) {
  const max = Math.max(...rows.map((row) => Number(row.value) || 0), 1);
  return rows.map((row) => {
    const width = Math.max(8, Math.round(((Number(row.value) || 0) / max) * 100));
    return `
      <div class="signal-mini-bar">
        <span>${row.label}</span>
        <b style="width: ${width}%"></b>
        <strong>${row.value}</strong>
      </div>
    `;
  }).join("");
}

function signalTodayLane(key = "", label = "", items = [], statItems = [], allSignals = [], showMore = true) {
  const chartTitle = key === "funding"
    ? "历史融资分类"
    : key === "product_service"
      ? "历史产品服务分布"
      : "历史行业 / 场景分布";
  const stats = statItems.length ? statItems : items;
  const listItems = items.length ? items : (key === "product_service" ? statItems : []);
  const visibleItems = showMore ? listItems.slice(0, 5) : listItems;
  const isHistoricalFallback = !items.length && key === "product_service" && listItems.length;
  const emptyCopy = key === "product_service" ? "暂无产品信号。" : `今日暂无${label}信号。`;
  const countLabel = isHistoricalFallback ? `历史 ${listItems.length}条` : `${items.length}条`;
  const rows = signalDistributionRows(key, stats, allSignals);
  const keywordRows = signalLaneKeywordRows(key, stats);
  const laneTitleMarkup = showMore ? `
        <div class="signal-today-lane-title">
          <div>
            <span>${label}</span>
            <em>${countLabel}</em>
          </div>
          <a href="${safeAttribute(signalCategoryHref(key))}">更多${label}</a>
        </div>
  ` : "";
  return `
    <article class="signal-today-lane signal-today-lane-${safeAttribute(key)} ${showMore ? "" : "is-aggregation"}">
      <div class="signal-today-lane-main">
        ${laneTitleMarkup}
        <div class="signal-today-list">
          ${visibleItems.length ? visibleItems.map((signal, index) => `
            <a href="${safeAttribute(signalHref(signal))}" class="${isHistoricalFallback ? "is-historical" : ""}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              ${isHistoricalFallback ? `<time>${signalSystemDate(signal.date || signal.originalDate)}</time>` : ""}
              <strong>${safeHtml(signalChineseDisplayTitle(signal))}</strong>
              ${signalNewsSummary(signal, showMore ? 168 : 132) ? `<p>${signalNewsSummary(signal, showMore ? 168 : 132)}</p>` : ""}
            </a>
          `).join("") : `<p class="signal-today-empty">${emptyCopy}</p>`}
        </div>
      </div>
      <aside class="signal-today-lane-chart">
        <span>${chartTitle}</span>
        <div class="signal-mini-bars">
          ${signalMiniBars(rows)}
        </div>
        ${signalLaneKeywordChips(keywordRows)}
      </aside>
    </article>
  `;
}

function signalPager(totalItems = 0, currentPage = 1, perPage = 5) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  if (totalPages <= 1) return "";
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const prevHref = page > 1 ? signalFilterHref({ page: page - 1 }) : "";
  const nextHref = page < totalPages ? signalFilterHref({ page: page + 1 }) : "";
  return `
    <nav class="signal-pagination" aria-label="信号分页">
      ${prevHref ? `<a href="${safeAttribute(prevHref)}">上一页</a>` : `<span>上一页</span>`}
      <strong>${page} / ${totalPages}</strong>
      ${nextHref ? `<a href="${safeAttribute(nextHref)}">下一页</a>` : `<span>下一页</span>`}
    </nav>
  `;
}

function signalTodaySummaryCard(activeDate = "", signals = [], points = [], lead = {}) {
  const groups = signalTodayGroups(signals);
  const rows = signalTopNames(signals.flatMap((item) => signalTagNames(item, 4)), 4);
  const distributionRows = rows.length ? rows : [
    { label: "融资", value: groups.funding.length },
    { label: "产品", value: groups.product_service.length },
    { label: "案例", value: groups.case.length },
  ].filter((row) => row.value);
  const keywordRows = signalTopNames(signals.flatMap((item) => signalTagNames(item, 5)), 8);
  return `
    <aside class="signal-source-card signal-today-summary-card signal-today-lane-chart signal-today-insight-card">
      <span>今日信号分类</span>
      <div class="signal-mini-bars">
        ${signalMiniBars(distributionRows)}
      </div>
      ${signalLaneKeywordChips(keywordRows)}
    </aside>
  `;
}

function signalUnifiedFilterBar(activeDate = "", params = {}) {
  const dates = data.contentIndex?.dates || [];
  const active = activeSignalDate(activeDate);
  const parts = active.split("-");
  const years = [...new Set(dates.map((item) => item.date.slice(0, 4)))];
  const months = [...new Set(dates.filter((item) => item.date.startsWith(parts[0] || "")).map((item) => item.date.slice(5, 7)))];
  const days = [...new Set(dates.filter((item) => item.date.startsWith(`${parts[0]}-${parts[1]}`)).map((item) => item.date.slice(8, 10)))];
  const tags = signalTagFilters();
  const activeTag = tags.find((tag) => params.tags?.includes(tag.id));
  const activeGroup = activeTag?.group || "track";
  const groupOptions = [...new Set(tags.map((tag) => tag.group).filter(Boolean))];
  const groupTags = tags.filter((tag) => tag.group === activeGroup);
  const option = (value, current, label = value) => `<option value="${safeAttribute(value)}" ${value === current ? "selected" : ""}>${safeHtml(label)}</option>`;
  return `
    <form class="daily-article-datebar signal-command-bar signal-command-bar-minimal" aria-label="商业信号筛选" data-signal-unified-filter>
      <nav class="daily-article-date-actions signal-filter-date-actions" aria-label="按年月日筛选">
        <div class="daily-date-selectors">
        <label><span>年</span><select name="year" data-signal-date-part="year">${years.map((year) => option(year, parts[0], year)).join("")}</select></label>
        <label><span>月</span><select name="month" data-signal-date-part="month">${months.map((month) => option(month, parts[1], `${Number(month)}月`)).join("")}</select></label>
        <label><span>日</span><select name="day" data-signal-date-part="day">${days.map((day) => option(day, parts[2], `${Number(day)}日`)).join("")}</select></label>
        </div>
      </nav>
      <div class="daily-article-tags" aria-label="标签归类">
        <span class="daily-article-tags-label">标签归类</span>
        <div class="daily-newsletter-filter-row">
        <label class="daily-tag-select signal-tag-group-select">
          <span>标签归类</span>
          <select name="group" data-signal-tag-group>
            ${groupOptions.map((group) => option(group, activeGroup, tagGroupLabel(group))).join("")}
          </select>
        </label>
        </div>
        <div class="daily-newsletter-keyword-grid">
        <label class="daily-tag-select signal-tag-specific-select">
          <span>标签</span>
          <select name="tag" data-signal-tag-select>
            <option value="">选择具体标签</option>
            ${groupTags.map((tag) => option(tag.id, activeTag?.id || "", tag.label)).join("")}
          </select>
        </label>
        </div>
      </div>
    </form>
  `;
}

function mountSignalSystemPage() {
  const root = document.querySelector("[data-signal-system]");
  if (!root) return;
  const params = signalFilterParams();
  const allSignals = signalRecentFirst(data.contentIndex?.signals || data.signals || []);
  const activeDate = activeSignalDate(params.date);
  const typeScopeAll = Boolean(params.type && !params.date);
  const isTypeAggregation = Boolean(params.type);
  const typeLabel = signalTypeLabel(params.type);
  const baseSignals = typeScopeAll ? allSignals : allSignals.filter((item) => signalMatchesDate(item, activeDate));
  const dateSignals = baseSignals.length ? baseSignals : allSignals;
  const displaySignals = signalRecentFirst(dateSignals
    .filter((item) => signalMatchesType(item, params.type))
    .filter((item) => signalMatchesTags(item, params.tags))
    .filter((item) => signalMatchesKeyword(item, params.q)));
  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(displaySignals.length / pageSize));
  const currentPage = isTypeAggregation ? Math.min(params.page, totalPages) : 1;
  const pagedSignals = isTypeAggregation
    ? displaySignals.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : displaySignals;
  const frontSignals = (displaySignals.length ? displaySignals : dateSignals).slice(0, 5);
  const lead = frontSignals[0] || data.contentIndex?.signals?.[0] || {};
  const structured = isTypeAggregation ? pagedSignals : displaySignals.slice(0, 8);
  const leadExactCases = (relatedAssets(lead, "signal").case || []).slice(0, 2);
  const leadSources = signalSystemSources(lead).slice(0, 3);
  const leadSource = signalPrimarySource(lead);
  const leadFront = signalFrontend(lead);
  const leadType = signalTypeLabel(lead.signalType || lead.type);
  const leadTags = signalTagNames(lead, 3);
  const leadComment = signalBusinessLine(lead, 160) || signalWhyLine(lead, 160);
  const leadFields = [
    ["类型", leadType],
    ["日期", signalSystemDate(lead.date || activeDate)],
    ["标签", leadTags.join(" / ") || leadType],
  ].filter(([, value]) => value);
  const dateMeta = activeSignalDateMeta(activeDate);
  const currentDateSignals = allSignals.filter((item) => signalMatchesDate(item, activeDate));
  const allPoints = signalRecentFirst(data.contentIndex?.points || []);
  const currentPoints = allPoints.filter((item) => item.date === activeDate);
  const fallbackPoints = allPoints.filter((item) => !item.date || signalOnOrBeforeDate(item, activeDate));
  const opinionPanelPoints = currentPoints.length ? currentPoints : fallbackPoints;
  const opinionPanelLabel = currentPoints.length ? "同日摘录" : "最近摘录";
  const activeSummarySignals = currentDateSignals.length ? currentDateSignals : dateSignals;
  const displayGroups = signalTodayGroups(pagedSignals);
  const historicalSignals = allSignals.filter((item) => signalOnOrBeforeDate(item, activeDate));
  const historicalGroups = signalTodayGroups(historicalSignals.length ? historicalSignals : allSignals);
  const baseLaneConfigs = [
    ["funding", "融资"],
    ["product_service", "产品"],
    ["case", "案例"],
  ];
  const laneConfigs = baseLaneConfigs
    .filter(([key]) => !params.type || key === params.type);
  const latestTabKey = baseLaneConfigs.find(([key]) => displayGroups[key]?.length)?.[0] || baseLaneConfigs[0][0];
  const signalLatestTabBoard = `
    <div class="signal-latest-tab-board home-signal-tab-board" data-home-signal-tabs>
      <div class="home-signal-tab-head">
        <div>
          <span>最新信号</span>
          <strong>${signalSystemDate(activeDate)}</strong>
          <p>${activeSummarySignals.length} 条当日信号，历史累计 ${historicalSignals.length || allSignals.length} 条。</p>
        </div>
        <div class="home-signal-tabbar" role="tablist" aria-label="切换商业信号分类">
          ${baseLaneConfigs.map(([key, label]) => {
            const items = displayGroups[key] || [];
            const fallbackItems = historicalGroups[key] || [];
            return `
              <button type="button" role="tab" data-home-signal-tab="${key}" aria-selected="${key === latestTabKey ? "true" : "false"}">
                ${label}<em>${items.length ? `${items.length}条` : `历史 ${fallbackItems.length}条`}</em>
              </button>
            `;
          }).join("")}
        </div>
      </div>
      <div class="home-signal-tab-panels">
        ${baseLaneConfigs.map(([key, label]) => homeSignalTabPanel(key, label, displayGroups[key], historicalGroups[key], historicalSignals, activeDate, key === latestTabKey)).join("")}
      </div>
    </div>
  `;
  const emptyMessage = params.q || params.tags.length || params.type ? "没有找到匹配信号。" : "这一天没有可展示的商业信号。";
  const boardTitle = isTypeAggregation ? `${typeLabel}信息` : "最新信号";
  const libraryTitle = isTypeAggregation ? "全部记录" : "更多信号";
  const leadExcerpt = signalSourceExcerpt(lead, 320);
  root.innerHTML = `
    ${signalUnifiedFilterBar(activeDate, params)}

    ${isTypeAggregation ? "" : `
    <section class="signal-ledger">
      <article class="signal-ledger-lead signal-news-lead">
        <div class="signal-ledger-kicker">
          <span>主新闻</span>
          <em>${lead.id || "CHG"}</em>
        </div>
        <div class="signal-news-lead-grid">
          <div>
            <h2>${safeHtml(signalChineseDisplayTitle(lead))}</h2>
            <div class="signal-news-summary signal-original-summary">
              <span>${leadExcerpt ? "原文摘录" : "新闻摘要"}</span>
              <strong>${safeHtml(leadExcerpt || signalNewsSummary(lead, 220))}</strong>
              ${leadComment ? `
                <div class="signal-lead-comment">
                  <span>观澜评论</span>
                  <strong>${leadComment}</strong>
                </div>
              ` : ""}
              <div class="signal-lead-meta-after">
                ${leadFields.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
              </div>
              <div class="signal-original-actions">
                ${leadSource.url && leadSource.url !== "#" ? `<a href="${safeAttribute(leadSource.url)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
                <a href="${safeAttribute(signalHref(lead))}">查看详情</a>
              </div>
            </div>
          </div>
          ${signalTodaySummaryCard(activeDate, activeSummarySignals, currentPoints, lead)}
        </div>
      </article>
    </section>
    `}

    <section class="signal-decision-board">
      <div class="signal-system-section-head">
        <div>
          <span class="signal-board-kicker">${signalSystemDate(activeDate)}</span>
          <h2>${boardTitle}</h2>
        </div>
      </div>
      <div class="signal-today-lanes ${isTypeAggregation ? "is-aggregation-list" : "is-tab-board"}">
        ${displaySignals.length ? (isTypeAggregation ? `
          ${laneConfigs.map(([key, label]) => signalTodayLane(key, label, displayGroups[key], historicalGroups[key], historicalSignals, false)).join("")}
        ` : `
          ${signalLatestTabBoard}
        `) : `<div class="signal-empty-state">${emptyMessage}</div>`}
      </div>
      ${isTypeAggregation ? signalPager(displaySignals.length, currentPage, pageSize) : ""}
    </section>

    ${isTypeAggregation ? "" : `
    ${signalOpinionPanel(opinionPanelPoints, opinionPanelLabel)}
    <section class="signal-library signal-library-redesigned">
      <div class="signal-system-section-head">
        <div>
          <h2>${libraryTitle}</h2>
        </div>
        ${trackingFilterStrip()}
      </div>
      <div class="signal-table-list">
        ${structured.map((signal, index) => `
          <a class="signal-table-row" href="${safeAttribute(signalHref(signal))}">
            <span>${String((currentPage - 1) * pageSize + index + 1).padStart(2, "0")}</span>
            <strong>${dailySignalShortTitle(signal)}</strong>
            <p>${signalEventLine(signal, 96)}</p>
            <em>${signalBusinessLine(signal, 58)}</em>
            <i>${signalTagNames(signal, 2).join(" / ") || signalSystemDate(signal.date)}</i>
          </a>
        `).join("") || `<div class="signal-empty-state">${emptyMessage}</div>`}
      </div>
    </section>
    `}
    <div class="signal-system-drawer" hidden>
      ${sourceListDrawer(lead)}
    </div>
  `;
  const drawer = root.querySelector(".signal-system-drawer");
  root.querySelector("[data-open-sources]")?.addEventListener("click", () => {
    drawer.hidden = !drawer.hidden;
    if (!drawer.hidden) drawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  root.querySelectorAll("[data-signal-dropdown-search]").forEach((input) => {
    input.addEventListener("input", () => {
      const value = input.value.trim().toLowerCase();
      input.closest(".signal-dropdown-menu")?.querySelectorAll(".signal-dropdown-list a").forEach((link) => {
        const text = `${link.textContent} ${link.dataset.searchText || ""}`.toLowerCase();
        link.hidden = value ? !text.includes(value) : false;
      });
    });
  });
  root.querySelector("[data-signal-date-picker]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const date = `${form.elements.year.value}-${form.elements.month.value}-${form.elements.day.value}`;
    window.location.href = signalFilterHref({ date });
  });
  root.querySelector("[data-signal-tag-picker]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const group = form.querySelector('[name="group"]')?.value || "";
    const keyword = cleanText(form.querySelector('[name="keyword"]')?.value || "").toLowerCase();
    const tags = signalTagFilters().filter((tag) => !group || tag.group === group);
    const matched = tags.find((tag) => {
      const values = [tag.id, tag.label, tagGroupLabel(tag.group), ...tag.terms].map((value) => String(value || "").toLowerCase());
      return keyword && (values.includes(keyword) || values.some((value) => value.includes(keyword) || keyword.includes(value)));
    });
    const nextTags = matched?.id ? [...new Set([...params.tags, matched.id])] : params.tags;
    window.location.href = signalFilterHref({ tags: nextTags, q: matched ? "" : keyword });
  });
  root.querySelector("[data-signal-unified-filter]")?.addEventListener("change", (event) => {
    const form = event.currentTarget;
    const year = form.querySelector('[name="year"]')?.value || activeDate.slice(0, 4);
    const month = form.querySelector('[name="month"]')?.value || activeDate.slice(5, 7);
    const day = form.querySelector('[name="day"]')?.value || activeDate.slice(8, 10);
    const date = `${year}-${month}-${day}`;
    const groupSelect = form.querySelector("[data-signal-tag-group]");
    const tagSelect = form.querySelector("[data-signal-tag-select]");
    if (event.target === groupSelect && tagSelect) {
      const groupTags = signalTagFilters().filter((tag) => tag.group === groupSelect.value);
      tagSelect.innerHTML = `
        <option value="">选择具体标签</option>
        ${groupTags.map((tag) => `<option value="${safeAttribute(tag.id)}">${safeHtml(tag.label)}</option>`).join("")}
      `;
      return;
    }
    const tag = tagSelect?.value || "";
    window.location.href = signalFilterHref({ date, tags: tag ? [tag] : [], q: "" });
  });
  mountHomeSignalTabs(root);
}

function mountFrontSignalDetail() {
  const root = document.querySelector("[data-front-signal-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const all = signalAllAssets();
  const signal = all.find((item) => item.slug === slug || item.id === slug) || data.signals?.[0] || {};
  const front = signalFrontend(signal);
  const typeLabel = signalTypeLabel(signal.signalType || signal.type);
  const primarySource = signalPrimarySource(signal);
  const title = front.displayTitle || signal.title || "商业变化";
  const eventLine = signalEventLine(signal, 260);
  const whyLine = signalWhyLine(signal, 220);
  const businessLine = signalBusinessLine(signal, 220);
  const breakdownRows = signalCaseBreakdown(signal);
  const variables = signalBusinessVariables(signal);
  const similarCases = signalSimilarCases(signal, 3);
  const relatedSignals = signalRelatedSignalRows(signal, 4);
  const metaRows = signalQuietMeta(signal);
  const sourceUrl = primarySource.url || "#";
  const sourceExcerpt = signalSourceExcerpt(signal, 520);
  const summary = sourceExcerpt || signalNewsSummary(signal, 360);
  const isCase = signalTypeKey(signal) === "case";
  const trendLine = businessLine || whyLine || eventLine;
  const relatedPoints = (relatedAssets(signal, "signal").point || []).slice(0, 3);
  root.innerHTML = `
    <article class="case-detail-page">
      <header class="case-detail-hero">
        <div class="case-detail-hero-main">
          <a class="case-detail-back" href="signals.html">商业信号</a>
          <div class="case-detail-kicker">
            <span>${safeHtml(typeLabel)}</span>
            <span>${safeHtml(signalSystemDate(signal.date))}</span>
          </div>
          <h1>${reportTitleHtml(title)}</h1>
          <div class="case-detail-summary">
            <span>${sourceExcerpt ? "原文摘录" : "新闻摘要"}</span>
            <p>${safeHtml(summary)}</p>
          </div>
          <div class="case-detail-comment">
            <span>观澜解读</span>
            <p>${safeHtml(businessLine || whyLine || "这条变化值得放到企业流程、采购预算和产品交付中继续比较。")}</p>
          </div>
          <div class="case-detail-actions">
            ${sourceUrl !== "#" ? `<a href="${safeAttribute(sourceUrl)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
            <a href="signals.html">返回列表</a>
          </div>
        </div>
        <aside class="case-detail-fact-rail">
          <span>${isCase ? "案例主体" : "变化主体"}</span>
          <strong>${safeHtml(signalSubjectName(signal))}</strong>
          <dl>
            <div><dt>动作</dt><dd>${safeHtml(signalActionVerb(signal))}</dd></div>
            <div><dt>场景</dt><dd>${safeHtml(signalScenarioText(signal))}</dd></div>
            <div><dt>AI 角色</dt><dd>${safeHtml(signalAiRole(signal))}</dd></div>
          </dl>
        </aside>
      </header>

      <section class="case-detail-section case-detail-breakdown">
        <div class="case-detail-section-head">
          <span>场景</span>
          <h2>流程拆解</h2>
        </div>
        <div class="case-detail-breakdown-grid">
          ${breakdownRows.map(([label, value]) => `
            <article>
              <span>${safeHtml(label)}</span>
              <strong>${safeHtml(value)}</strong>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="case-detail-section case-detail-two-col">
        <div class="case-detail-section-head">
          <span>变量</span>
          <h2>业务影响</h2>
        </div>
        <div class="case-detail-variable-grid">
          ${variables.map((item) => `
            <article>
              <h3>${safeHtml(item.label)}</h3>
              <p>${safeHtml(item.body)}</p>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="case-detail-section case-detail-evidence">
        <div class="case-detail-section-head">
          <span>对照</span>
          <h2>同类变化</h2>
        </div>
        <div class="case-detail-evidence-grid">
          <div class="case-detail-similar">
            <h3>同类案例</h3>
            ${similarCases.length ? similarCases.map((item, index) => `
              <a href="${safeAttribute(signalHref(item))}">
                <span>${String(index + 1).padStart(2, "0")} · ${safeHtml(signalSystemDate(item.date))}</span>
                <strong>${safeHtml(dailySignalShortTitle(item))}</strong>
                <p>${safeHtml(signalNewsSummary(item, 112))}</p>
              </a>
            `).join("") : `<p>暂无同类案例。</p>`}
          </div>
          <div class="case-detail-similar">
            <h3>相关商业变化</h3>
            ${relatedSignals.length ? relatedSignals.map(({ item, shared }, index) => `
              <a href="${safeAttribute(signalHref(item))}">
                <span>${String(index + 1).padStart(2, "0")} · ${safeHtml(signalTypeLabel(item.signalType || item.type))}</span>
                <strong>${safeHtml(dailySignalShortTitle(item))}</strong>
                <p>${safeHtml(shared[0]?.name || signalEventLine(item, 96))}</p>
              </a>
            `).join("") : `<p>暂无相关变化。</p>`}
          </div>
        </div>
      </section>

      <section class="case-detail-section case-detail-trend">
        <div class="case-detail-section-head">
          <span>趋势</span>
          <h2>趋势线索</h2>
        </div>
        <div class="case-detail-trend-body">
          <p>${safeHtml(trendLine)}</p>
          ${whyLine && whyLine !== trendLine ? `<p>${safeHtml(whyLine)}</p>` : ""}
          ${front.techRouteMeaning ? `<p>${safeHtml(frontstageFactText(front.techRouteMeaning))}</p>` : ""}
        </div>
      </section>

      <section class="case-detail-section case-detail-quiet">
        <div class="case-detail-section-head">
          <span>索引</span>
          <h2>来源</h2>
        </div>
        <div class="case-detail-quiet-grid">
          <dl>
            ${metaRows.map(([label, value]) => `<div><dt>${safeHtml(label)}</dt><dd>${safeHtml(value)}</dd></div>`).join("")}
          </dl>
          ${relatedPoints.length ? `
            <div class="case-detail-point-list">
              <h3>相关观点</h3>
              ${relatedPoints.map((item) => `
                <a href="${safeAttribute(opinionDetailHref(item))}">
                  <span>${safeHtml(item.person || item.author || "观点")}</span>
                  <strong>${safeHtml(item.title || "相关观点")}</strong>
                </a>
              `).join("")}
            </div>
          ` : ""}
        </div>
      </section>
    </article>
  `;
}

function mountOpinionDetail() {
  const root = document.querySelector("[data-opinion-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const points = data.contentIndex?.points || [];
  const point = points.find((item) => item.slug === id || item.id === id) || points[0] || {};
  const profileHref = builderDetailHrefForPoint(point);
  if (profileHref.startsWith("builder-detail.html")) {
    window.location.replace(profileHref);
    return;
  }
  const pointTags = pointTagNames(point, 5);
  const sourceUrl = point.sourceUrl || "#";
  const identity = opinionIdentity(point);
  const relatedSignals = (data.contentIndex?.signals || data.signals || [])
    .filter((signal) => {
      const explicit = (point.relatedSignals || []).some((signalId) => signalId === signal.id || signalId === signal.slug);
      const pointTagIds = new Set((point.tags || []).map((tag) => tag.id || tag.name));
      const sharedTag = (signal.tags || []).some((tag) => pointTagIds.has(tag.id) || pointTagIds.has(tag.name));
      return explicit || sharedTag;
    })
    .slice(0, 4);
  const opinionSummary = cleanText(frontstageFactText(point.interpretation || point.usage || point.calibrates || ""))
    .replace("保留为人物观点", "人物观点记录")
    .replace("；涉及事实判断时仍需公司材料或可靠报道支持。", "，涉及 Agent 落地、技术交付和变更管理。");
  const sourceLabel = sourceDisplayName(sourceUrl, "公开来源");
  const speaker = point.speakerLine || identity.name || sourceLabel;
  const title = opinionCardTitle(point, identity);
  const translation = opinionChineseQuoteFull(point, identity);
  const quietMeta = [
    ["人物", identity.name || speaker],
    ["Title", identity.title || sourceLabel],
    ["日期", signalSystemDate(point.originalDate || point.date)],
    ["来源", sourceLabel],
  ].filter(([, value]) => value);

  root.innerHTML = `
    <article class="opinion-detail-report opinion-reader-page">
      <header class="opinion-reader-hero">
        <a class="opinion-reader-back" href="opinion.html">前沿观点</a>
        <div class="opinion-reader-person">
          <strong>${safeHtml(identity.name || speaker)}</strong>
          <span>${safeHtml(identity.title || sourceLabel)}</span>
        </div>
        <h1>${reportTitleHtml(title || point.title || "观点")}</h1>
      </header>

      <section class="opinion-reader-grid">
        <main>
          ${translation ? `
            <section class="opinion-reader-block opinion-reader-translation">
              <div class="report-section-head"><span>摘录</span><h2>观点摘录</h2></div>
              ${articleText(translation)}
            </section>
          ` : ""}
          <section class="opinion-reader-block">
            <div class="report-section-head"><span>观澜解读</span><h2>观澜解读</h2></div>
            <p>${safeHtml(opinionSummary)}</p>
          </section>
        </main>
        <aside class="opinion-reader-rail">
          <section class="opinion-rail-card opinion-rail-tags">
            <span>标签</span>
            <div>
              ${(pointTags.length ? pointTags : ["观点"]).map((tag) => `<a href="opinion.html?theme=${encodeURIComponent(tag)}">${safeHtml(tag)}</a>`).join("")}
            </div>
          </section>
          <section class="opinion-rail-card">
            <span>信息</span>
            <dl>
              ${quietMeta.map(([label, value]) => `<div><dt>${safeHtml(label)}</dt><dd>${safeHtml(value)}</dd></div>`).join("")}
            </dl>
          </section>
          ${relatedSignals.length ? `
            <section class="opinion-rail-card opinion-rail-related">
              <span>相关商业变化</span>
              ${relatedSignals.map((signal) => `
                <a href="${safeAttribute(signalHref(signal))}">
                  <strong>${safeHtml(dailySignalShortTitle(signal))}</strong>
                  <p>${safeHtml(signalEventLine(signal, 92))}</p>
                </a>
              `).join("")}
            </section>
          ` : ""}
          <section class="opinion-rail-card opinion-rail-source">
            <span>原文入口</span>
            <a href="${safeAttribute(sourceUrl)}" ${sourceUrl === "#" ? "" : 'target="_blank" rel="noreferrer"'}>${safeHtml(sourceLabel)}</a>
          </section>
        </aside>
      </section>
    </article>
  `;
}

function mountStructuredSignalDetail() {
  const root = document.querySelector("[data-structured-signal-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const all = data.contentIndex?.signals || data.signals || [];
  const index = Math.max(0, all.findIndex((item) => item.slug === slug || item.id === slug));
  const signal = structuredSignalAdapter(all[index] || all[0] || {}, index);
  root.innerHTML = `
    ${structuredDossier(signal)}
    ${structuredSourceLedger(signal)}
    ${structuredCommercialRead(signal)}
    ${structuredUpgradeWatch(signal)}
    ${structuredRelatedPath()}
  `;
}

const opinionRoleOptions = ["创始人", "投资人", "产品负责人", "研究者", "媒体/社区"];
const opinionThemeOptions = ["AI Agent", "AI Coding", "企业工作流", "模型成本", "数据基础设施"];

function hasOpinionTranslation(point = {}) {
  const text = cleanText(point.originalTranslation || point.frontend?.originalTranslation || point.translationZh || "");
  return Boolean(text)
    && /\p{Script=Han}/u.test(text)
    && !/(pending|todo|missing|not translated|translation pending)/iu.test(text);
}

function isFrontstageOpinionPoint(point = {}) {
  const tier = String(point.opinionTier || point.opinion_tier || "").toLowerCase();
  const lane = String(point.displayLane || point.display_lane || "").toLowerCase();
  const status = String(point.publishStatus || point.publish_status || "").toLowerCase();
  return ["feature", "sidebar"].includes(tier)
    && ["daily_feature", "signal_sidebar"].includes(lane)
    && ["frontstage_feature", "frontstage_sidebar"].includes(status)
    && hasOpinionTranslation(point);
}

function opinionFrontstagePoints() {
  return (data.contentIndex?.points || [])
    .filter(isFrontstageOpinionPoint)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function opinionIdentity(point = {}) {
  return builderIdentityForPoint(point, {
    name: cleanText(point.speakerLine || point.title || "公开观点"),
    title: pointSourceLabel(point),
  });
}

function opinionRoleType(point = {}) {
  const identity = opinionIdentity(point);
  const hay = `${identity.name} ${identity.title} ${point.title || ""} ${point.sourceUrl || ""}`.toLowerCase();
  if (/invest|vc|y combinator|yc|投资/.test(hay)) return "投资人";
  if (/product|pm|产品/.test(hay)) return "产品负责人";
  if (/research|engineer|engineering|研究|工程/.test(hay)) return "研究者";
  if (/media|community|podcast|youtube|every|newsletter|社区|媒体/.test(hay)) return "媒体/社区";
  return "创始人";
}

function opinionThemeText(point = {}) {
  return [
    point.title,
    point.originalView,
    point.interpretation,
    point.usage,
    ...(point.tags || []).flatMap((tag) => [tag.id, tag.name, ...(tag.aliases || [])]),
  ].map(cleanText).join(" ").toLowerCase();
}

function opinionMatchesTheme(point = {}, theme = "") {
  if (!theme) return true;
  const hay = opinionThemeText(point);
  const terms = {
    "AI Agent": ["agent", "智能体"],
    "AI Coding": ["coding", "code", "developer", "mcp", "api", "sdk", "开发", "代码"],
    "企业工作流": ["workflow", "enterprise", "procurement", "企业", "工作流", "采购", "治理"],
    "模型成本": ["cost", "pricing", "inference", "model", "成本", "定价", "模型"],
    "数据基础设施": ["data", "infra", "search", "exa", "snowflake", "数据", "基础设施", "搜索"],
  }[theme] || [theme.toLowerCase()];
  return terms.some((term) => hay.includes(term));
}

function opinionPrimaryTheme(point = {}) {
  return opinionThemeOptions.find((theme) => opinionMatchesTheme(point, theme)) || "企业工作流";
}

function opinionDateParts(points = []) {
  const dates = [...new Set(points.map((point) => point.date).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const latest = dates[0] || data.contentIndex?.activeDate || data.meta?.date || "";
  return {
    latest,
    years: [...new Set(dates.map((date) => date.slice(0, 4)))],
    months: [...new Set(dates.map((date) => date.slice(5, 7)))],
    days: [...new Set(dates.map((date) => date.slice(8, 10)))],
  };
}

function opinionRelatedSignals(point = {}, limit = 4) {
  const signals = data.contentIndex?.signals || data.signals || [];
  const pointTagIds = new Set((point.tags || []).flatMap((tag) => [tag.id, tag.name].filter(Boolean)));
  return signals.filter((signal) => {
    const explicit = (point.relatedSignals || []).some((signalId) => signalId === signal.id || signalId === signal.slug);
    const sharedTag = (signal.tags || []).some((tag) => pointTagIds.has(tag.id) || pointTagIds.has(tag.name));
    return explicit || sharedTag;
  }).slice(0, limit);
}

function opinionTopNames(values = [], limit = 5) {
  const counts = new Map();
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function opinionChangeLine(rows = []) {
  const text = rows.map(opinionThemeText).join(" ");
  if (/mcp|api|sdk|developer|coding|开发|代码/.test(text)) return "从模型能力转向工具连接";
  if (/governance|permission|workflow|enterprise|治理|权限|工作流|企业/.test(text)) return "从模型能力转向交付治理";
  if (/cost|pricing|inference|成本|定价/.test(text)) return "从性能讨论转向成本约束";
  if (/data|infra|search|数据|基础设施|搜索/.test(text)) return "从应用体验转向数据基础设施";
  return "同一方向的观点正在累积";
}

function opinionWeeklyActive(points = []) {
  const dates = points.map((point) => point.date).filter(Boolean).sort((a, b) => b.localeCompare(a));
  const maxDate = dates[0] || "";
  if (!maxDate) return "";
  const min = new Date(`${maxDate}T00:00:00Z`);
  min.setUTCDate(min.getUTCDate() - 7);
  const minDate = min.toISOString().slice(0, 10);
  const recent = points.filter((point) => (point.date || "") >= minDate);
  const rows = opinionTopNames(recent.map((point) => opinionIdentity(point).name), 1);
  return rows[0] ? `${rows[0].label} · ${rows[0].value} 条` : "";
}

function opinionFilterMarkup(points = []) {
  const parts = opinionDateParts(points);
  const latest = parts.latest.split("-");
  const option = (value, selected, label = value) => `<option value="${safeAttribute(value)}" ${value === selected ? "selected" : ""}>${safeHtml(label)}</option>`;
  return `
    <form class="opinion-filter-bar" data-opinion-filter>
      <div class="opinion-filter-row" aria-label="前沿观点筛选">
        <select name="year" aria-label="年">
          ${parts.years.map((year) => option(year, latest[0], year)).join("")}
          <option value="">全部年份</option>
        </select>
        <select name="month" aria-label="月">
          ${parts.months.map((month) => option(month, latest[1], `${Number(month)}月`)).join("")}
          <option value="">全部月份</option>
        </select>
        <select name="day" aria-label="日">
          ${parts.days.map((day) => option(day, latest[2], `${Number(day)}日`)).join("")}
          <option value="">全部日期</option>
        </select>
        <select name="role" aria-label="人物类型">
          <option value="">人物类型</option>
          ${opinionRoleOptions.map((role) => option(role, "", role)).join("")}
        </select>
        <select name="theme" aria-label="主题">
          <option value="">主题</option>
          ${opinionThemeOptions.map((theme) => option(theme, "", theme)).join("")}
        </select>
        <input name="q" type="search" placeholder="搜索人物、公司、观点关键词" autocomplete="off">
      </div>
    </form>
  `;
}

function opinionFiltersFromForm(form) {
  const formData = new FormData(form);
  return {
    year: String(formData.get("year") || ""),
    month: String(formData.get("month") || ""),
    day: String(formData.get("day") || ""),
    role: String(formData.get("role") || ""),
    theme: String(formData.get("theme") || ""),
    q: cleanText(formData.get("q") || "").toLowerCase(),
  };
}

function opinionApplyFilters(points = [], filters = {}) {
  return points.filter((point) => {
    const date = String(point.date || "");
    if (filters.year && !date.startsWith(filters.year)) return false;
    if (filters.month && date.slice(5, 7) !== filters.month) return false;
    if (filters.day && date.slice(8, 10) !== filters.day) return false;
    if (filters.role && opinionRoleType(point) !== filters.role) return false;
    if (filters.theme && !opinionMatchesTheme(point, filters.theme)) return false;
    if (!filters.q) return true;
    const identity = opinionIdentity(point);
    const hay = `${identity.name} ${identity.title} ${point.title || ""} ${point.originalView || ""} ${point.interpretation || ""} ${point.sourceUrl || ""}`.toLowerCase();
    return hay.includes(filters.q);
  });
}

function opinionIndexPointCard(point = {}, index = 0, mode = "regular") {
  const identity = opinionIdentity(point);
  const detailUrl = opinionDetailHref(point, index);
  const sourceUrl = point.sourceUrl || "#";
  const tags = pointTagNames(point, 3);
  const related = opinionRelatedSignals(point, 1)[0];
  const comment = pointGuanlanComment(point, mode === "lead" ? 132 : 96);
  const title = opinionCardTitle(point, identity);
  const translation = opinionChineseQuote(point, identity, mode === "lead" ? 360 : 240);
  return `
    <article class="opinion-index-card ${mode === "lead" ? "is-lead" : ""}">
      <div class="opinion-index-card-meta">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${safeHtml(identity.name)}</strong>
          <em>${safeHtml(identity.title)}</em>
        </div>
      </div>
      <h3><a href="${safeAttribute(detailUrl)}">${safeHtml(title || "前沿观点")}</a></h3>
      ${translation ? `<blockquote>${safeHtml(translation)}</blockquote>` : ""}
      ${comment ? `<p class="opinion-index-comment"><span>观澜解读</span>${safeHtml(comment)}</p>` : ""}
      ${related ? `
        <a class="opinion-related-signal" href="${safeAttribute(signalHref(related))}">
          <span>关联商业信号</span>
          <strong>${safeHtml(dailySignalShortTitle(related))}</strong>
        </a>
      ` : ""}
      <footer>
        <div>
          <span>${safeHtml(signalSystemDate(point.originalDate || point.date))}</span>
          ${tags.map((tag) => `<span>${safeHtml(tag)}</span>`).join("")}
        </div>
        <nav>
          <a href="${safeAttribute(detailUrl)}">人物页</a>
          ${sourceUrl !== "#" ? `<a href="${safeAttribute(sourceUrl)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
        </nav>
      </footer>
    </article>
  `;
}

function opinionObservationRail(points = [], allPoints = []) {
  const activeDate = opinionDateParts(allPoints).latest;
  const todayCount = points.filter((point) => point.date === activeDate).length;
  const builders = new Set(points.map((point) => opinionIdentity(point).name).filter(Boolean));
  const maxDate = activeDate || opinionDateParts(points).latest;
  const min = maxDate ? new Date(`${maxDate}T00:00:00Z`) : null;
  if (min) min.setUTCDate(min.getUTCDate() - 7);
  const minDate = min ? min.toISOString().slice(0, 10) : "";
  const weekCount = minDate ? points.filter((point) => (point.date || "") >= minDate).length : points.length;
  const tags = opinionTopNames(points.flatMap((point) => pointPublicTaxonomyTagNames(point, 8)), 8);
  const relatedCount = new Set(points.flatMap((point) => opinionRelatedSignals(point).map((signal) => signal.id || signal.slug))).size;
  return `
    <aside class="opinion-observation-rail">
      <span>观察栏</span>
      <strong>${signalSystemDate(activeDate)}</strong>
      <dl>
        <div><dt>今日观点</dt><dd>${todayCount}</dd></div>
        <div><dt>活跃人物</dt><dd>${builders.size}</dd></div>
        <div><dt>相关信号</dt><dd>${relatedCount}</dd></div>
        <div><dt>本周记录</dt><dd>${weekCount}</dd></div>
      </dl>
      <div class="opinion-theme-list">
        ${tags.map((row) => `<span>${safeHtml(row.label)} <b>${row.value}</b></span>`).join("") || "<span>暂无标签</span>"}
      </div>
    </aside>
  `;
}

function opinionFeaturedSection(points = [], allPoints = []) {
  if (!points.length) {
    return `
      <section class="opinion-empty-state">
        <strong>没有找到匹配观点</strong>
        <p>调整日期、人物类型、主题或关键词后再看。</p>
      </section>
    `;
  }
  return `
    <section class="opinion-focus-grid">
      <div class="opinion-focus-main">
        <div class="opinion-section-head">
          <span>重点观点</span>
          <h2>今日重点</h2>
        </div>
        ${opinionIndexPointCard(points[0], 0, "lead")}
      </div>
      <div class="opinion-focus-side">
        ${points.slice(1, 4).map((point, index) => opinionIndexPointCard(point, index + 1)).join("")}
      </div>
      ${opinionObservationRail(points, allPoints)}
    </section>
  `;
}

function opinionProfilesFromPoints(points = []) {
  const grouped = groupBy(points, (point) => builderUsername(point.sourceUrl || point.source_url) || signalSystemUrlDomain(point.sourceUrl || point.source_url) || opinionIdentity(point).name);
  return [...grouped.entries()].map(([handle, rows]) => {
    const sorted = rows.slice().sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    return {
      handle,
      rows: sorted,
      latest: sorted[0] || {},
      identity: opinionIdentity(sorted[0] || {}),
    };
  }).sort((a, b) => b.rows.length - a.rows.length || String(b.latest.date || "").localeCompare(String(a.latest.date || "")));
}

function opinionBuilderFlow(points = []) {
  const profiles = opinionProfilesFromPoints(points).slice(0, 6);
  if (!profiles.length) return "";
  return `
    <section class="opinion-builder-flow">
      <div class="opinion-section-head">
        <span>人物观点</span>
        <h2>观点变化</h2>
      </div>
      <div class="opinion-builder-grid">
        ${profiles.map((profile) => {
          const relatedCount = new Set(profile.rows.flatMap((point) => opinionRelatedSignals(point).map((signal) => signal.id || signal.slug))).size;
          return `
            <article class="opinion-builder-card">
              <header>
                <div>
                  <strong>${safeHtml(profile.identity.name)}</strong>
                  <span>${safeHtml(profile.identity.title)}</span>
                </div>
                <em>${profile.rows.length} 条</em>
              </header>
              <h3>${safeHtml(opinionCardTitle(profile.latest, profile.identity) || "最近观点")}</h3>
              ${opinionChineseQuote(profile.latest, profile.identity, 200) ? `<blockquote>${safeHtml(opinionChineseQuote(profile.latest, profile.identity, 200))}</blockquote>` : ""}
              <p><span>观点变化</span>${safeHtml(opinionChangeLine(profile.rows))}</p>
              <ol>
                ${profile.rows.slice(0, 3).map((point) => `
                  <li><time>${safeHtml(signalSystemDate(point.date))}</time><a href="${safeAttribute(opinionDetailHref(point))}">${safeHtml(homeShort(opinionCardTitle(point, opinionIdentity(point)) || "观点", 42))}</a></li>
                `).join("")}
              </ol>
              <footer>
                <span>关联商业信号 ${relatedCount}</span>
                <a href="builder-detail.html?id=${encodeURIComponent(profile.handle)}">查看人物详情</a>
              </footer>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function opinionTopicGroups(points = []) {
  const groups = opinionThemeOptions
    .map((theme) => ({ theme, rows: points.filter((point) => opinionMatchesTheme(point, theme)).slice(0, 4) }))
    .filter((group) => group.rows.length);
  if (!groups.length) return "";
  return `
    <section class="opinion-topic-groups">
      <div class="opinion-section-head">
        <h2>按主题浏览</h2>
      </div>
      <div class="opinion-topic-grid">
        ${groups.map((group, groupIndex) => `
          <article class="opinion-topic-card" data-topic-index="${groupIndex}">
            <h3><span></span>${safeHtml(group.theme)}</h3>
            <div>
              ${group.rows.map((point, index) => {
                const identity = opinionIdentity(point);
                const title = opinionCardTitle(point, identity) || "观点";
                const translation = opinionChineseQuote(point, identity, 170);
                return `
                  <a href="${safeAttribute(opinionDetailHref(point, index))}">
                    <span>${safeHtml(identity.name)} · ${safeHtml(signalSystemDate(point.date))}</span>
                    <strong>${safeHtml(homeShort(title, 54))}</strong>
                    ${translation ? `<p>${safeHtml(translation)}</p>` : ""}
                  </a>
                `;
              }).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function opinionIndexResults(points = [], allPoints = []) {
  return `
    ${opinionFeaturedSection(points, allPoints)}
    ${opinionBuilderFlow(points)}
    ${opinionTopicGroups(points)}
  `;
}

function mountOpinionIndex() {
  const root = document.querySelector("[data-opinion-index]");
  if (!root) return;
  const allPoints = opinionFrontstagePoints();
  root.innerHTML = `
    <section class="opinion-index-hero">
      ${opinionFilterMarkup(allPoints)}
    </section>
    <div data-opinion-results></div>
  `;
  const form = root.querySelector("[data-opinion-filter]");
  const results = root.querySelector("[data-opinion-results]");
  const render = () => {
    const filters = opinionFiltersFromForm(form);
    const filtered = opinionApplyFilters(allPoints, filters);
    results.innerHTML = opinionIndexResults(filtered, allPoints);
  };
  form?.querySelectorAll("input, select").forEach((node) => {
    node.addEventListener("input", render);
    node.addEventListener("change", render);
  });
  render();
}

function mountBuildersSystem() {
  const root = document.querySelector("[data-builders-system]");
  if (!root) return;
  const params = signalFilterParams();
  const profiles = signalSystemBuilderProfiles().filter((profile) => !params.tag || signalMatchesTag(profile.latest || {}, params.tag));
  const displayProfiles = profiles.length ? profiles : signalSystemBuilderProfiles();
  root.innerHTML = `
    ${perspectiveHeader()}
    ${featuredPerspectives(displayProfiles)}
    ${perspectiveGrid(displayProfiles)}
  `;
}

function mountBuilderDetail() {
  const root = document.querySelector("[data-builder-detail]");
  if (!root) return;
  const id = new URLSearchParams(window.location.search).get("id") || "";
  const profiles = signalSystemBuilderProfiles();
  const profile = profiles.find((item) => item.handle === id) || profiles[0] || {};
  const rows = profile.rows || [];
  const identity = builderIdentityForPoint(profile.latest, profile);
  root.innerHTML = builderObserverPage(profile, identity, rows);
}

function mountHome() {
  if (mountHomeV2()) return;

  setText("[data-home-daily-title]", data.daily.title);
  setText("[data-home-daily-dek]", data.daily.dek);
  setText("[data-home-issue]", data.brief.issue);
  const sheet = document.querySelector("[data-home-sheet]");
  if (sheet) {
    sheet.innerHTML = `
      <div class="sheet-top"><span>${data.brief.issue}</span><span>${data.meta.date}</span></div>
      <div class="sheet-title">${data.brief.title}</div>
      <div class="sheet-list">
        ${data.signals.map((signal, index) => `
          <div class="sheet-item">
            <span class="sheet-index">${String(index + 1).padStart(2, "0")}</span>
            <div><strong>${signal.title}</strong><p>${signal.judgment}</p></div>
          </div>
        `).join("")}
      </div>
    `;
  }

  const daily = document.querySelector("[data-daily-preview]");
  if (daily) {
    daily.innerHTML = `
      <article class="home-daily-brief">
        <div class="home-brief-meta">
          <span class="eyebrow">Today</span>
          <span>${data.meta.date}</span>
        </div>
        <h2>${data.daily.title}</h2>
        <p class="home-daily-dek">${data.daily.dek}</p>
        <div class="home-daily-points">
          ${data.daily.points.slice(0, 3).map((item, index) => `
            <p><span>${String(index + 1).padStart(2, "0")}</span>${item}</p>
          `).join("")}
        </div>
        <a class="button secondary" href="${data.daily.link}">阅读全文</a>
      </article>
    `;
  }

  const trendReport = document.querySelector("[data-trend-report-preview]");
  if (trendReport) {
    trendReport.innerHTML = `
      <article class="card">
        <a class="card-inner" href="${data.trendReport.link}">
          <span class="kicker"><img class="kicker-icon" src="assets/vi-components/01-symbol-system/trend.svg" alt="">趋势判断</span>
          <h3>${data.trendReport.title}</h3>
          <p>${data.trendReport.oneLine}</p>
          ${tagRow(data.trendReport)}
        </a>
      </article>
    `;
  }

  const relations = document.querySelector("[data-home-relations]");
  if (relations) relations.innerHTML = activeRelationRows(1);
}

function dailyMetaByGroup(item, group, fallback, limit = 2) {
  return compactJoin(tagsByGroup(item, group, limit), fallback);
}

function dailyDateLabel(value = "") {
  return String(value || "").replaceAll("-", ".");
}

function dailyDateParam(value = "") {
  return String(value || "").replaceAll(".", "-").slice(0, 10);
}

function dailyIssueList() {
  return Array.isArray(data.contentIndex?.dates) ? data.contentIndex.dates : [];
}

function selectedDailyIssue() {
  const issues = dailyIssueList();
  const params = new URLSearchParams(window.location.search);
  const requested = dailyDateParam(params.get("date") || data.contentIndex?.activeDate || data.meta?.date);
  return issues.find((item) => item.date === requested) || issues[0] || {
    date: dailyDateParam(data.meta?.date),
    label: data.meta?.date,
    title: data.daily?.title,
    dek: data.daily?.dek,
  };
}

function isActiveDailyIssue(issue) {
  const active = dailyDateParam(data.contentIndex?.activeDate || data.meta?.date);
  return dailyDateParam(issue?.date || issue?.label) === active;
}

function selectedDailyContent(issue) {
  const issueDate = dailyDateParam(issue?.date || issue?.label);
  const article = (data.contentIndex?.dailyArticles || [])
    .find((item) => dailyDateParam(item.date || item.label || item.id?.replace(/^daily-/u, "")) === issueDate);
  if (article) return article;
  if (isActiveDailyIssue(issue)) return data.daily || {};
  return {
    date: issue?.date,
    label: issue?.label,
    title: issue?.title || data.daily?.title || "今日观察",
    dek: issue?.dek || "这一天的要点已进入归档，可继续查看相关信号与来源。",
    points: [issue?.dek || "这一天的要点已进入归档，可继续查看相关信号与来源。"],
    risk: "归档日仍以当日信号、来源状态和接下来要看的线索为准。",
    calibration: [],
  };
}

function selectedDailySignals(issue) {
  const date = dailyDateParam(issue?.date || issue?.label);
  const all = [...(data.contentIndex?.signals || []), ...(data.signals || [])];
  const seen = new Set();
  const matched = all.filter((signal) => {
    const key = signal.id || signal.slug || signal.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return dailyDateParam(signal.date) === date;
  });
  if (matched.length) return matched;
  return all.slice(0, Math.max(3, issue?.signalCount || 3));
}

function exactDailySignals(issue) {
  const date = dailyDateParam(issue?.date || issue?.label);
  const all = [...(data.contentIndex?.signals || []), ...(data.signals || [])];
  const seen = new Set();
  return all.filter((signal) => {
    const key = signal.id || signal.slug || signal.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return dailyDateParam(signal.date) === date;
  });
}

function selectedDailyPoints(issue, builderOnly = false) {
  const date = dailyDateParam(issue?.date || issue?.label);
  const all = data.contentIndex?.points || [];
  const sameDay = all.filter((item) => dailyDateParam(item.date) === date && isFrontstageOpinionPoint(item));
  const pool = builderOnly ? sameDay.filter(isFollowBuilderPoint) : sameDay;
  if (pool.length) return pool;
  return builderOnly ? [] : sameDay;
}

function exactDailyPoints(issue, builderOnly = false) {
  const date = dailyDateParam(issue?.date || issue?.label);
  const all = data.contentIndex?.points || [];
  const sameDay = all.filter((item) => dailyDateParam(item.date) === date && isFrontstageOpinionPoint(item));
  return builderOnly ? sameDay.filter(isFollowBuilderPoint) : sameDay;
}

function exactDailyCases(issue) {
  return exactDailySignals(issue).filter((signal) => {
    const tags = signal.tags || [];
    return signal.signalType === "case"
      || signal.type === "case"
      || tags.some((tag) => tag.id === "case" || tag.group === "case" || tag.name === "案例");
  });
}

function dailyIssueMetrics(issue = selectedDailyIssue()) {
  const signals = exactDailySignals(issue);
  const cases = exactDailyCases(issue);
  const points = exactDailyPoints(issue);
  const trendReports = selectedDailyTrendReports(issue);
  return {
    article: issue?.title ? 1 : 0,
    signals: signals.length,
    cases: cases.length,
    points: points.length,
    trendReports: trendReports.length,
  };
}

function dailyIssueMetricChips(issue = selectedDailyIssue(), compact = false) {
  const metrics = dailyIssueMetrics(issue);
  const rows = compact
    ? [["文章", metrics.article], ["信号", metrics.signals], ["案例", metrics.cases], ["观点", metrics.points]]
    : [["文章", metrics.article], ["商业信号", metrics.signals], ["案例", metrics.cases], ["前沿观点", metrics.points], ["趋势报告", metrics.trendReports]];
  return rows.map(([label, value]) => `<span><em>${label}</em><strong>${value}</strong></span>`).join("");
}

function dailyIssueBandMarkup(issue = selectedDailyIssue()) {
  const date = dailyDateLabel(issue?.label || issue?.date);
  return `
    <div class="daily-issue-date">
      <span class="daily-newsletter-memo">DAY FILE</span>
      <strong>${date}</strong>
    </div>
    <div class="daily-issue-metrics" aria-label="当天内容数量">
      ${dailyIssueMetricChips(issue)}
    </div>
  `;
}

function selectedDailyFeaturePoints(issue) {
  const points = selectedDailyPoints(issue, true);
  const feature = points.filter((item) => item.displayLane === "daily_feature" || item.opinionTier === "feature");
  return feature.length ? feature : points.filter((item) => item.displayLane === "signal_sidebar" || item.opinionTier === "sidebar").slice(0, 1);
}

function selectedDailyTrends(issue) {
  const date = dailyDateParam(issue?.date || issue?.label);
  return (data.contentIndex?.trends || []).filter((item) => dailyDateParam(item.date) === date);
}

function selectedDailyTrendReports(issue) {
  const date = dailyDateParam(issue?.date || issue?.label);
  return (data.contentIndex?.trendReports || []).filter((item) => {
    const raw = item.date || item.updated || item.label || "";
    return dailyDateParam(raw) === date;
  });
}

function dailyDateHref(issue) {
  return `daily.html?date=${encodeURIComponent(dailyDateParam(issue?.date || issue?.label))}`;
}

function dailyDetailHref(issue) {
  return `daily-detail.html?date=${encodeURIComponent(dailyDateParam(issue?.date || issue?.label))}`;
}

function mountDailyDateNav(issue) {
  const nav = document.querySelector("[data-daily-date-nav]");
  if (!nav) return;
  const issues = dailyIssueList();
  const index = issues.findIndex((item) => item.date === issue.date);
  const previous = issues[index + 1];
  const next = issues[index - 1];
  const link = (item, label) => item
    ? `<a href="${dailyDateHref(item)}">${label}</a>`
    : `<span aria-disabled="true">${label}</span>`;
  const quick = issues.slice(0, 7).map((item) => {
    const active = dailyDateParam(item.date || item.label) === dailyDateParam(issue?.date || issue?.label);
    return `<a class="daily-article-date-pill ${active ? "is-active" : ""}" href="${dailyDateHref(item)}">${dailyDateLabel(item.label || item.date).slice(5)}</a>`;
  }).join("");
  nav.innerHTML = `
    <div class="daily-article-date-primary">
      ${link(previous, "上一日")}
      <a href="daily.html">今日</a>
      ${link(next, "下一日")}
    </div>
    <div class="daily-article-date-list">${quick}</div>
  `;
}

function mountDailyDateNavV2(issue) {
  const nav = document.querySelector("[data-daily-date-nav]");
  if (!nav) return;
  const issues = dailyIssueList();
  const active = dailyDateParam(issue?.date || issue?.label);
  const latest = dailyDateParam(issues[0]?.date || issues[0]?.label);
  const [activeYear, activeMonth, activeDay] = active.split("-");
  const years = [...new Set(issues.map((item) => dailyDateParam(item.date || item.label).slice(0, 4)).filter(Boolean))];
  const months = [...new Set(issues
    .filter((item) => dailyDateParam(item.date || item.label).startsWith(activeYear))
    .map((item) => dailyDateParam(item.date || item.label).slice(5, 7))
    .filter(Boolean))];
  const days = [...new Set(issues
    .filter((item) => dailyDateParam(item.date || item.label).startsWith(`${activeYear}-${activeMonth}`))
    .map((item) => dailyDateParam(item.date || item.label).slice(8, 10))
    .filter(Boolean))];
  const option = (value, current, label = value) => `<option value="${value}" ${value === current ? "selected" : ""}>${label}</option>`;
  nav.innerHTML = `
    <div class="daily-date-selectors">
      <label><span>年</span><select data-daily-date-part="year">${years.map((year) => option(year, activeYear, year)).join("")}</select></label>
      <label><span>月</span><select data-daily-date-part="month">${months.map((month) => option(month, activeMonth, `${Number(month)}月`)).join("")}</select></label>
      <label><span>日</span><select data-daily-date-part="day">${days.map((day) => option(day, activeDay, `${Number(day)}日`)).join("")}</select></label>
      ${active !== latest ? `<a class="daily-date-today" href="daily.html">回到今日</a>` : ""}
    </div>
  `;
  nav.querySelectorAll("[data-daily-date-part]").forEach((select) => {
    select.addEventListener("change", () => {
      const year = nav.querySelector('[data-daily-date-part="year"]')?.value || activeYear;
      const month = nav.querySelector('[data-daily-date-part="month"]')?.value || activeMonth;
      const day = nav.querySelector('[data-daily-date-part="day"]')?.value || activeDay;
      const target = issues.find((item) => dailyDateParam(item.date || item.label) === `${year}-${month}-${day}`)
        || issues.find((item) => dailyDateParam(item.date || item.label).startsWith(`${year}-${month}`))
        || issues.find((item) => dailyDateParam(item.date || item.label).startsWith(year));
      if (target) window.location.href = dailyDateHref(target);
    });
  });
}

function dailySourceName(item, index) {
  const url = item?.sourceUrl || item?.source_url || "";
  if (item?.sourceLabel) return item.sourceLabel;
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : ["官方材料", "产品公告", "一手资料", "行业媒体"][index % 4];
  } catch {
    return ["官方材料", "产品公告", "一手资料", "行业媒体"][index % 4];
  }
}

function dailySourceGrade(index) {
  return ["S / 一手", "A / 主流", "A / 官方", "B / 行业"][index % 4];
}

function dailyExternalLink(item) {
  return item?.sourceUrl || item?.source_url || item?.link || "signals.html";
}

function dailySignalShortTitle(signal = {}) {
  const title = cleanText(signal.title || "");
  const id = signal.id || "";
  const fixed = {
    "FS-20260511-01": "Agent 动作执行治理",
    "FS-20260511-02": "可运营的学习流程",
    "FS-20260511-03": "治理进入运行时",
    "FS-20260510-01": "CX Agent 交付成本",
    "FS-20260510-02": "语音 Agent 进入运营",
    "FS-20260510-03": "客户体验平台化",
    "FS-20260509-01": "记忆与编排定价",
    "FS-20260509-02": "客服 Agent 规模交付",
    "FS-20260509-03": "Agent 资产审计",
    "FS-20260508-01": "MCP 上生产门槛",
    "FS-20260508-02": "金融流程 Agent",
    "FS-20260508-03": "工业 Agent 执行",
    "FS-20260507-01": "Agent 控制平面",
    "FS-20260507-02": "编程工具安全治理",
    "FS-20260507-03": "企业 AI 交付链",
    "FS-20260506-01": "Agent 管理平面",
    "FS-20260506-02": "采购财务自动化",
    "FS-20260506-03": "客服运营平台",
    "FS-20260505-001": "客服 Agent 基础设施",
    "FS-20260505-002": "AI 成本治理",
    "FS-20260505-003": "算力锁定周期",
    "LS-20260508-01": "客户前台运营",
    "LS-20260508-02": "历史治理信号",
    "LS-20260508-03": "营销收入系统",
    "LS-20260508-04": "专业服务工作流",
    "LS-20260508-05": "Agent 工程治理",
    "LS-20260508-06": "数据语义层",
  };
  if (fixed[id]) return fixed[id];
  const sourceTitleTranslation = signalSourceTitleTranslation(signal);
  if (sourceTitleTranslation) return sourceTitleTranslation;
  const withoutPrefix = title
    .replace(/^.+?[：:]\s*/u, "")
    .replace(/[“”"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return withoutPrefix || title;
}

function homeDailyFeaturedTitle(signal = {}, index = 0) {
  const title = dailySignalShortTitle(signal);
  const fixedById = {
    "FS-20260507-01": "Agent 开始要权限",
    "FS-20260507-02": "代码仓库被接管",
    "FS-20260507-03": "交付体系开始扩张",
  };
  if (fixedById[signal.id]) return fixedById[signal.id];
  const fixedByKeyword = [
    ["中间件", "Agent 开始要权限"],
    ["编码代理", "代码仓库被接管"],
    ["大模型部署", "交付体系开始扩张"],
  ];
  const matched = fixedByKeyword.find(([keyword]) => title.includes(keyword));
  if (matched) return matched[1];
  const fallbacks = ["Agent 开始要权限", "代码仓库被接管", "交付体系开始扩张"];
  return homeShort(title || fallbacks[index] || "变化值得观察", 16).replace(/[，。,.、].*$/u, "");
}

function homeDailyCardBody(signal = {}) {
  if (signalTypeKey(signal) === "case") {
    return signalFrontstageCaseSummary(signal, 240);
  }
  const preset = {
    "FS-20260511-01": "ServiceNow 把企业 Agent 从单点 Copilot 推向系统级行动平台，重点不是多一个助手，而是让 Agent 能在企业系统里执行动作，并接受连接、权限、审计和控制。对企业来说，真正要评估的是动作能不能被授权、回放和停用；这会影响 IT、业务系统、客服、采购和财务流程，也会改变产品负责人对连接器与权限边界的判断。短期看平台能否把 MCP、工具调用和审批策略接成闭环，长期看企业是否愿意把关键流程交给可审计的 Agent 执行。",
    "FS-20260511-02": "SoundHound 的 OASYS 把语音 Agent 从一次性问答推向可编排、可学习的平台叙事。它提醒企业：客服和销售自动化的竞争点正在从回答质量，转到流程是否能持续运营、持续优化，并被业务团队接管。短期要看模板复用、人工接管和上线周期，长期要看它能否沉淀为企业自己的服务流程。如果学习、编排和复盘不能进入管理界面，语音 Agent 仍会停留在前台体验，而不是运营系统。",
    "FS-20260511-03": "Collibra 将 AI Command Center 定位为实时监督和持续控制能力，说明治理不再只是上线前的政策、流程或报表，而是进入运行时。企业需要关注模型漂移、权限扩散、责任追溯和异常停用这些实际运营问题；受影响的不只是数据团队，还包括合规、风控、IT 运维和业务负责人。短期看它能否接入真实用例、权限和日志，长期看 Agent 治理会不会成为企业 AI 采购的默认条件。",
  };
  return preset[signal.id] || cleanText(signal.judgment || signal.brief || summaryText(signal));
}

function dailyObservationProfile(dailyContent = {}, signals = []) {
  const date = dailyDateParam(dailyContent.date || dailyContent.label || selectedDailyIssue()?.date || "");
  const profiles = {};
  const columnPage = dailyContent.columnPage || {};
  const fallback = {
    title: cleanText(columnPage.title || dailyContent.title || "这一天的商业变化值得继续回看。").replace(/^Insight-\d{4}-\d{2}-\d{2}-\d+\s*[｜|]\s*/u, ""),
    thesis: cleanText(columnPage.thesis || dailyContent.dek || dailyContent.title || "这一天的信号已经进入归档，仍可作为后续判断参照。"),
    body: cleanText(columnPage.body || "回看这类内容时，重点不是复述当天发生了什么，而是看它是否持续影响客户采用、预算归属、交付成本和企业流程。只有当这些变化进入真实部署、采购标准或组织分工，它才从热点变成商业信号。"),
    impact: cleanText(columnPage.impact || "它会影响相关业务负责人、产品负责人和企业服务采购。短期看客户侧材料，长期防的是把发布、融资和观点误读成已经成熟的需求。"),
    note: cleanText(columnPage.note || "归档日需要继续看后续证据是否补足，而不是只保留当天判断。"),
    keywords: Array.isArray(columnPage.keywords) && columnPage.keywords.length ? columnPage.keywords : [],
    strength: cleanText(columnPage.strength || ""),
    state: cleanText(columnPage.state || ""),
  };
  const profile = profiles[date] || fallback;
  const names = signals.slice(0, 3).map(dailySignalShortTitle).filter(Boolean);
  return {
    ...profile,
    basis: names.length ? `当日信号包括：${names.join("、")}。` : "",
  };
}

function dailyHomeObservationText(signals = []) {
  const signalNames = signals.slice(0, 3).map(dailySignalShortTitle).filter(Boolean);
  const basis = signalNames.length ? `今天被拎出来的几条材料，落在 ${signalNames.join("、")} 上。` : "";
  return `今天真正该看的，不是模型又多会了什么，而是 AI 是否已经碰到客户、流程、预算或责任边界。${basis}一旦它能动手，企业会先问权限、记录、停用和账单。`;
}

function dailyObservationMarkup(dailyContent = {}, signals = []) {
  const profile = dailyObservationProfile(dailyContent, signals);
  const signalNames = signals.slice(0, 3).map(dailySignalShortTitle);
  const basis = signalNames.length
    ? `今天被拎出来的几条材料，落在 ${signalNames.join("、")} 上。`
    : "今天的判断来自几类公司动作：大组织采用、工具边界和成本讨论。";
  const isCurrent = dailyContent.slug === data.daily?.slug || dailyContent.title === data.daily?.title;
  if (!isCurrent) {
    return `
      <p class="daily-newsletter-thesis">${profile.thesis}</p>
      <p class="daily-newsletter-observation">${profile.body}</p>
      <p class="daily-newsletter-observation">${profile.impact}${profile.basis ? ` ${profile.basis}` : ""}</p>
    `;
  }
  return `
    <p class="daily-newsletter-observation">${profile.body}</p>
    <p class="daily-newsletter-observation">${profile.impact}${basis ? ` ${basis}` : ""}</p>
  `;
}

function dailySparkline(values = [22, 30, 28, 42, 48, 56, 68]) {
  const width = 280;
  const height = 96;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => {
    const x = 18 + (index * (width - 36)) / Math.max(1, values.length - 1);
    const y = height - 18 - ((value - min) / Math.max(1, max - min)) * (height - 34);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `
    <svg viewBox="0 0 ${width} ${height}" role="presentation" focusable="false">
      <path class="daily-brief-chart-grid" d="M18 26H262M18 52H262M18 78H262" />
      <polyline class="daily-brief-chart-line muted" points="18,72 58,62 99,66 139,58 180,52 221,48 262,44" />
      <polyline class="daily-brief-chart-line" points="${points.join(" ")}" />
      ${points.map((point) => {
        const [cx, cy] = point.split(",");
        return `<circle cx="${cx}" cy="${cy}" r="3" />`;
      }).join("")}
    </svg>
  `;
}

function dailyStatusRail(issue = selectedDailyIssue()) {
  const issues = dailyIssueList().slice(0, 7).reverse();
  const labels = issues.length ? issues.map((item) => dailyDateLabel(item.label || item.date).slice(5)) : ["05.05", "05.06", "05.07", "05.08", "05.09", "05.10", "05.11"];
  const states = issues.length ? issues.map((item) => `${item.signalCount || 0} 信号`) : ["归档", "归档", "归档", "归档", "归档", "归档", "当前"];
  const active = dailyDateParam(issue?.date || issue?.label);
  return `
    <div class="daily-brief-status-current">
      <span></span>
      <strong>${isActiveDailyIssue(issue) ? "当前日" : "归档日"}</strong>
      <em>${dailyDateLabel(issue?.label || issue?.date)}</em>
    </div>
    <div class="daily-brief-status-rail">
      ${labels.map((label, index) => `
        <a class="daily-brief-status-day ${issues[index]?.date === active ? "is-active" : ""}" href="${issues[index] ? dailyDateHref(issues[index]) : "#"}">
          <i></i>
          <span>${label}</span>
          <small>${states[index]}</small>
        </a>
      `).join("")}
    </div>
  `;
}

function dailyIssueStatus(issue = selectedDailyIssue()) {
  const signals = exactDailySignals(issue);
  const points = exactDailyPoints(issue);
  const trendReports = selectedDailyTrendReports(issue);
  const typeCount = new Set(signals.map((item) => item.signalType || item.type).filter(Boolean)).size;
  const articleCount = issue?.title ? 1 : 0;
  return `
    <span class="daily-newsletter-memo">今日统计</span>
    <div class="daily-article-stat-list" aria-label="当日内容统计">
      <div><span>日期</span><strong>${dailyDateLabel(issue?.label || issue?.date)}</strong></div>
      <div><span>文章</span><strong>${articleCount} 篇</strong></div>
      <div><span>信号</span><strong>${signals.length} 条</strong></div>
      <div><span>观点</span><strong>${points.length} 条</strong></div>
      <div><span>趋势报告</span><strong>${trendReports.length} 篇</strong></div>
      <div><span>卡片类型</span><strong>${typeCount || 0} 类</strong></div>
    </div>
  `;
}

function dailyArticleTakeaways(dailyContent = {}) {
  const cards = Array.isArray(dailyContent.homeCards) ? dailyContent.homeCards : [];
  const cardItems = cards.map((item) => ({
    title: cleanText(item.title || item.label || ""),
    body: cleanText(item.body || ""),
  })).filter((item) => item.title || item.body);
  if (cardItems.length) return cardItems.slice(0, 5);
  const summary = Array.isArray(dailyContent.summary) ? dailyContent.summary : [];
  return summary.map((text, index) => ({
    title: `文章要点 ${index + 1}`,
    body: cleanText(text),
  })).filter((item) => item.body).slice(0, 5);
}

function dailyArticlePointsMarkup(dailyContent = {}) {
  const items = dailyArticleTakeaways(dailyContent);
  if (!items.length) return "";
  return items.map((item, index) => `
    <article>
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${homeShort(item.title || item.body, 34)}</strong>
        ${item.body ? `<p>${homeShort(item.body, 96)}</p>` : ""}
      </div>
    </article>
  `).join("");
}

function dailyArticleOriginalParagraphs(dailyContent = {}, limit = 5) {
  const sections = Array.isArray(dailyContent.sections) ? dailyContent.sections : [];
  const sectionText = sections
    .filter((section) => !/相关原文|来源/i.test(String(section.title || "")))
    .flatMap((section) => String(section.body || "").split(/\n{2,}/u));
  const fallback = String(dailyContent.homeSummary || dailyContent.dek || "")
    .split(/\n{2,}/u);
  return (sectionText.length ? sectionText : fallback)
    .map((text) => cleanText(text))
    .filter(Boolean)
    .slice(0, limit);
}

function dailyArticleOriginalMarkup(dailyContent = {}) {
  const paragraphs = dailyArticleOriginalParagraphs(dailyContent, 5);
  return paragraphs.map((text) => `<p>${homeShort(text, 260)}</p>`).join("");
}

function dailyArticleCaseCard(signal = {}, index = 0) {
  return `
    <a class="daily-article-asset-card daily-article-case-card" href="${safeAttribute(signal.link || (signal.slug ? `signal-detail.html?id=${encodeURIComponent(signal.slug)}` : "signals.html"))}">
      <span>案例 · ${String(index + 1).padStart(2, "0")}</span>
      <strong>${dailySignalShortTitle(signal)}</strong>
      <p>${signalFrontstageCaseSummary(signal, 96)}</p>
    </a>
  `;
}

function dailyPointTitleParts(point = {}) {
  const title = cleanText(point.title || "");
  const match = title.match(/^([^：:]{2,48})[：:]\s*(.+)$/u);
  return {
    person: match ? cleanText(match[1]) : "",
    point: match ? cleanText(match[2]) : title,
  };
}

function dailyPointDisplayIdentity(point = {}) {
  const identity = builderIdentityForPoint(point);
  const titleParts = dailyPointTitleParts(point);
  if (titleParts.person && /^公开观点来源|^一线观察/.test(identity.name)) {
    return {
      name: titleParts.person,
      title: "公开观点来源",
    };
  }
  return identity;
}

function dailyPointKeyLine(point = {}) {
  const titleParts = dailyPointTitleParts(point);
  const identity = dailyPointDisplayIdentity(point);
  const translation = opinionChineseQuote(point, identity, 160);
  if (translation) return translation;
  const original = cleanText(point.originalView || "");
  const interpretation = cleanText(point.interpretation || point.calibrates || point.usage || "");
  const originalIsPointer = /见正文原文摘录|见原文|正文原文摘录/.test(original);
  return cleanText(titleParts.point || (!originalIsPointer ? original : "") || interpretation || point.title || "查看观点要点");
}

function dailyArticlePointCard(point = {}, index = 0) {
  const identity = dailyPointDisplayIdentity(point);
  return `
    <a class="daily-article-asset-card daily-article-point-card" href="${safeAttribute(dailyPointHref(point))}">
      <span>前沿观点 · ${String(index + 1).padStart(2, "0")}</span>
      <strong>${identity.name}</strong>
      <em>${homeShort(cleanText(identity.title || point.speakerLine || point.title), 38)}</em>
      <p>${homeShort(dailyPointKeyLine(point), 88)}</p>
    </a>
  `;
}

function dailyArticleAssetsMarkup(issue = selectedDailyIssue()) {
  const cases = exactDailyCases(issue).slice(0, 2);
  const points = exactDailyPoints(issue).slice(0, 2);
  if (!cases.length && !points.length) return "";
  return `
    <section class="daily-article-assets-panel" aria-label="今日案例与前沿观点">
      <div class="daily-article-assets-grid">
        <div>
          <h2>案例</h2>
          <div class="daily-article-assets-list">
            ${cases.length ? cases.map(dailyArticleCaseCard).join("") : `<p class="daily-day-empty">这一天暂无可展示案例。</p>`}
          </div>
        </div>
        <div>
          <h2>前沿观点</h2>
          <div class="daily-article-assets-list">
            ${points.length ? points.map(dailyArticlePointCard).join("") : `<p class="daily-day-empty">这一天暂无可展示前沿观点。</p>`}
          </div>
        </div>
      </div>
    </section>
  `;
}

function dailyIssueStatusV2(issue = selectedDailyIssue()) {
  return `
    <span class="daily-newsletter-memo">今日统计</span>
    <div class="daily-article-stat-list" aria-label="当日内容统计">
      ${dailyIssueMetricChips(issue).replaceAll("<span>", "<div><span>").replaceAll("</span>", "</span></div>")}
    </div>
  `;
}

function dailyArticleIndexMarkup(issue, signals = [], points = []) {
  const issues = dailyIssueList();
  const index = issues.findIndex((item) => item.date === issue.date);
  const previous = issues[index + 1];
  const next = issues[index - 1];
  const signalRows = signals.slice(0, 2).map((signal) => `
    <a href="${safeAttribute(signal.link || (signal.slug ? `signal-detail.html?id=${encodeURIComponent(signal.slug)}` : "signals.html"))}">
      <span>${signalTypeLabel(signal.signalType || signal.type)}</span>
      <strong>${dailySignalShortTitle(signal)}</strong>
    </a>
  `).join("");
  const pointRows = points.slice(0, 2).map((point) => {
    const identity = builderIdentityForPoint(point);
    return `
      <a href="${safeAttribute(point.sourceUrl || "signals.html")}">
        <span>${identity.name}</span>
        <strong>${homeShort(opinionCardTitle(point, identity), 42)}</strong>
      </a>
    `;
  }).join("");
  const dateRows = [previous, next].filter(Boolean).map((item) => `
    <a href="${dailyDateHref(item)}">
      <span>${dailyDateLabel(item.label || item.date)}</span>
      <strong>${homeShort(cleanText(item.title || item.dek), 38)}</strong>
    </a>
  `).join("");
  return `
    <span class="daily-newsletter-memo">DAILY INDEX</span>
    <h2>当日内容索引</h2>
    <div class="daily-article-index-group">
      <h3>商业信号</h3>
      ${signalRows || "<p>这一天暂无可展示信号。</p>"}
    </div>
    <div class="daily-article-index-group">
      <h3>前沿观点</h3>
      ${pointRows || "<p>当天暂无达标观点。</p>"}
    </div>
    <div class="daily-article-index-group">
      <h3>相关日期</h3>
      ${dateRows || "<p>暂无相邻日期。</p>"}
    </div>
  `;
}

function dailyCalibrationNote(dailyContent = data.daily) {
  const profile = dailyObservationProfile(dailyContent, selectedDailySignals(selectedDailyIssue()));
  const item = (dailyContent.calibration || [])[0];
  if (!item) {
    return `
      <div class="daily-newsletter-note">
        <span>补充判断</span>
        <strong>仍要看后续证据</strong>
        <p>${homeShort(profile.note, 110)}</p>
      </div>
    `;
  }
  return `
    <div class="daily-newsletter-note">
      <span>补充判断</span>
      <strong>仍要看运行时控制</strong>
      <p>${homeShort(item.interpretation || item.calibrates || item.originalView, 96)}</p>
    </div>
  `;
}

function dailyFactCard(signal, index) {
  const title = signal.title || `今日事实 ${index + 1}`;
  const source = dailySourceName(signal, index);
  const grade = dailySourceGrade(index);
  const fact = homeShort(signal.judgment || summaryText(signal), 108);
  return `
    <article class="daily-brief-fact">
      <span class="daily-brief-number">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${title}</h3>
        <p>${fact}</p>
        <div class="daily-brief-source-row">
          <span>Source · ${source}</span>
          <span>${grade}</span>
          <a href="${dailyExternalLink(signal)}" target="_blank" rel="noreferrer">原始链接 ↗</a>
        </div>
      </div>
    </article>
  `;
}

function dailySignalBrief(signal, index) {
  const impact = compactJoin([
    tagsByGroup(signal, "customer", 1),
    tagsByGroup(signal, "function", 1),
    tagsByGroup(signal, "scenario", 1),
  ], "企业决策者 / 业务负责人");
  return `
    <article class="daily-brief-signal-card">
      <div class="daily-brief-card-top">
        <span class="daily-brief-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="daily-brief-memo">SIGNAL</span>
      </div>
      <h3>${dailySignalShortTitle(signal)}</h3>
      <p>${homeShort(signal.judgment || summaryText(signal), 112)}</p>
      <div class="daily-brief-signal-meta">
        <span>影响对象：${impact}</span>
        <a href="${signal.link || "signals.html"}">查看深度分析</a>
      </div>
    </article>
  `;
}

function dailyNewsletterSignal(signal, index) {
  const impact = compactJoin([
    tagsByGroup(signal, "customer", 1),
    tagsByGroup(signal, "function", 1),
    tagsByGroup(signal, "scenario", 1),
  ], "企业决策者 / 业务负责人");
  const source = dailySourceName(signal, index);
  return `
    <article class="daily-newsletter-signal-card">
      <div class="daily-newsletter-card-head">
        <span class="daily-newsletter-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="daily-newsletter-memo">SIGNAL</span>
      </div>
      <h3>${dailySignalShortTitle(signal)}</h3>
      <p>${homeShort(signal.judgment || summaryText(signal), 112)}</p>
      <dl>
        <div><dt>影响对象</dt><dd>${impact}</dd></div>
        <div><dt>来源</dt><dd>${source}</dd></div>
        <div><dt>来源等级</dt><dd>${dailySourceGrade(index)}</dd></div>
      </dl>
      <div class="daily-newsletter-card-foot">
        <span>${homeShort(summaryText(signal), 52)}</span>
        <a href="${signal.link || "signals.html"}">深度分析 ↗</a>
      </div>
    </article>
  `;
}

function dailyCompressedFact(signal, index) {
  return `
    <a class="daily-newsletter-fact-row" href="${dailyExternalLink(signal)}" target="_blank" rel="noreferrer">
      <span>${String(index + 4).padStart(2, "0")}</span>
      <strong>${dailySignalShortTitle(signal)}</strong>
      <em>${dailySourceName(signal, index + 3)} · ${dailySourceGrade(index + 3)}</em>
      <p>${homeShort(signal.judgment || summaryText(signal), 74)}</p>
    </a>
  `;
}

function dailyTemperatureMarkup() {
  const trends = [
    ["企业 Agent 控制层", "Rising", "证据较强", 78],
    ["金融服务 Agent 套件", "Watch", "继续观察", 54],
    ["模型榜单叙事", "Limited Evidence", "热度高，证据不足", 42],
  ];
  return `
    <article class="daily-brief-temperature-card">
      <span class="daily-brief-memo">7 / 30 / 90 DAYS</span>
      ${dailySparkline([24, 30, 34, 41, 50, 58, 72])}
      <p>热度正在从模型能力讨论转向“能否进入企业流程、权限和责任边界”。</p>
    </article>
    <article class="daily-brief-temperature-card">
      <span class="daily-brief-memo">SOURCE MIX</span>
      <div class="daily-brief-stackbar">
        <i style="--w:38%"><span>官方</span></i>
        <i style="--w:31%"><span>媒体</span></i>
        <i style="--w:19%"><span>观点</span></i>
        <i style="--w:12%"><span>社区</span></i>
      </div>
      <p>一手信息占比较高，但客户采用和部署周期仍需持续观察。</p>
    </article>
    <article class="daily-brief-temperature-card wide">
      <span class="daily-brief-memo">WATCH TABLE</span>
      <div class="daily-brief-temp-list">
        ${trends.map(([name, state, evidence, value]) => `
          <div>
            <strong>${name}</strong>
            <span>${state}</span>
            <em>${evidence}</em>
            <b style="--value:${value}%"></b>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function dailyNewsletterTrendPanel() {
  const columnPage = data.daily?.columnPage || {};
  if (columnPage.trendTitle || columnPage.trendBody) {
    return `
      <span class="daily-newsletter-memo">市场读法</span>
      <h3>${columnPage.trendTitle || "今天的商业变量已经变清楚"}</h3>
      <p>${columnPage.trendBody || columnPage.note || "继续看这条变化是否进入真实部署、采购标准或组织分工。"}</p>
      <div class="daily-newsletter-market-strip">
        ${(columnPage.keywords?.length ? columnPage.keywords.slice(0, 3) : ["主信号", "预算口径", "责任范围"]).map((item) => `
          <span><strong>${item}</strong><em>事实更新</em></span>
        `).join("")}
      </div>
    `;
  }
  return `
    <span class="daily-newsletter-memo">市场读法</span>
    <h3>讨论正在从“能不能做”转向“敢不敢放进流程”</h3>
    <p>今天的材料更像一个采购前夜的信号：供应商开始把“可控”写进产品，客户侧还在等部署结果、事故成本和接管机制。</p>
    <div class="daily-newsletter-market-strip">
      <span><strong>官方发布增多</strong><em>产品叙事已经转向治理</em></span>
      <span><strong>客户采用待补</strong><em>真实上线材料仍少</em></span>
      <span><strong>交付仍在形成</strong><em>成本和责任范围未定</em></span>
    </div>
  `;
}

function dailyNewsletterRiskPanel() {
  const customRisks = data.daily?.columnPage?.riskItems;
  const risks = Array.isArray(customRisks) && customRisks.length
    ? customRisks.map((item) => [item.title, item.body])
    : [
    ["先别只看发布", "融资、发布和媒体报道会先出现，真实部署里的权限、接管和事故处理往往滞后披露。"],
    ["客户侧材料不足", data.daily.risk || "客户采用、预算归属和部署周期仍待补齐。"],
    ["采购标准还没定型", "“可控”能否成为企业采购条件，还取决于责任范围、权限默认值和人工接管机制。"],
  ];
  return `
    <span class="daily-newsletter-memo">MATERIAL STATUS</span>
    <h3>本期材料状态</h3>
    <div class="daily-newsletter-risk-list">
      ${risks.map(([title, text], index) => `
        <div>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${title}</strong>
          <p>${text}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function dailyTrendReportMarkup() {
  const trendReports = (data.contentIndex?.trendReports || []).slice(0, 3);
  const fallback = data.trendReport ? [data.trendReport] : [];
  return (trendReports.length ? trendReports : fallback).map((item, index) => `
    <article class="daily-brief-trend-report">
      <span class="daily-brief-number">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${homeShort(item.oneLine || summaryText(item), 118)}</p>
        <dl>
          <div><dt>商业变量</dt><dd>${dailyMetaByGroup(item, "scenario", "流程承接与付费口径", 2)}</dd></div>
          <div><dt>客户场景</dt><dd>${dailyMetaByGroup(item, "customer", "中大型企业 / 业务团队", 2)}</dd></div>
          <div><dt>材料状态</dt><dd>责任、数据和部署周期仍待补齐</dd></div>
        </dl>
        <a href="${item.link || `trend-detail.html?id=${item.slug}`}">进入趋势追踪</a>
      </div>
    </article>
  `).join("");
}

function dailyNewsletterTrendReportMarkup(issue = selectedDailyIssue()) {
  const trendReports = selectedDailyTrendReports(issue);
  if (!trendReports.length) {
    return `
      <article class="daily-newsletter-trend-report is-empty">
        <span class="daily-newsletter-number">--</span>
        <div>
          <h3>当天暂无独立趋势追踪</h3>
          <p>这一天的内容先保留为信号和观点材料，等客户采用、预算归属或交付口径更清楚后，再进入趋势追踪。</p>
        </div>
      </article>
    `;
  }
  return trendReports.slice(0, 3).map((item, index) => `
    <article class="daily-newsletter-trend-report">
      <span class="daily-newsletter-number">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${homeShort(item.oneLine || summaryText(item), 96)}</p>
        <div class="daily-newsletter-trend-report-meta">
          <span>商业变量：${dailyMetaByGroup(item, "scenario", "流程承接与付费口径", 1)}</span>
          <span>客户场景：${dailyMetaByGroup(item, "customer", "中大型企业", 1)}</span>
          <span>材料状态：责任、数据和部署周期</span>
        </div>
      </div>
      <a href="${item.link || `trend-detail.html?id=${item.slug}`}">趋势追踪 ↗</a>
    </article>
  `).join("");
}

function dailyNewsletterWatchMarkup() {
  const customItems = data.daily?.columnPage?.watchItems;
  const items = Array.isArray(customItems) && customItems.length
    ? customItems.map((item) => [item.period || "WATCH", item.title, item.body])
    : [
    ["7D", "看客户案例是否继续出现", "判断热度是否从融资转向采用"],
    ["30D", "看权限、审计和治理叙事", "判断预算是否向控制层移动"],
    ["90D", "看上线周期与事故成本", "判断它是否走出演示阶段"],
  ];
  return items.map(([period, title, text]) => `
    <div class="daily-newsletter-watch-item">
      <span>${period}</span>
      <strong>${title}</strong>
      <p>${text}</p>
    </div>
  `).join("");
}

function dailyViewMarkup(issue = selectedDailyIssue()) {
  const points = selectedDailyPoints(issue).slice(0, 3);
  return points.map((item, index) => `
    <article class="daily-brief-view">
      <span class="daily-brief-memo">${["强化", "修正", "补充"][index] || "独立思考"}</span>
      <h3>${item.title}</h3>
      <p>${homeShort(item.interpretation || item.calibrates || item.originalView, 150)}</p>
      <div class="daily-brief-view-foot">
        <span>${item.originalDate || item.date || data.meta.date}</span>
        ${item.sourceUrl ? `<a href="${item.sourceUrl}" target="_blank" rel="noreferrer">来源 ↗</a>` : ""}
      </div>
    </article>
  `).join("");
}

function dailyRiskMarkup() {
  const risks = [
    ["来源偏差", "融资、发布和媒体报道更容易被看见，真实部署摩擦可能滞后出现。", "继续看客户采用与续费信号"],
    ["证据缺口", data.daily.risk || "客户采用、预算归属和部署周期仍需继续观察。", "继续看上线周期和事故成本"],
    ["商业变量", "可控运营是否成为采购标准，还取决于责任边界、权限和人类接管机制。", "继续看企业合同条款"],
  ];
  return risks.map(([title, text, watch], index) => `
    <article class="daily-brief-risk">
      <span class="daily-brief-number">${String(index + 1).padStart(2, "0")}</span>
      <h3>${title}</h3>
      <p>${text}</p>
      <small>${watch}</small>
    </article>
  `).join("");
}

function dailyWatchMarkup() {
  const items = [
    ["7天观察", "是否出现更多客户案例披露", "看热度是否从融资转向采用"],
    ["30天观察", "治理、权限与审计是否进入产品叙事", "看企业预算是否向控制层移动"],
    ["90天观察", "上线周期、模板复用率和事故成本", "看它是否走出演示阶段"],
  ];
  return items.map(([period, title, text]) => `
    <article class="daily-brief-watch-card">
      <span>${period}</span>
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `).join("");
}

function dailyKeywordItems() {
  const officialGroups = ["track", "function", "scenario", "customer", "evidence", "stage", "region", "source", "opinion"];
  const officialGroupRank = new Map(officialGroups.map((group, index) => [group, index]));
  return (data.tagTaxonomy || [])
    .filter((tag) => tag?.id && tag?.name)
    .filter((tag) => officialGroupRank.has(tag.group))
    .filter((tag) => tag.status !== "inactive" && !tag.merge_to)
    .map((tag) => ({
      id: tag.id,
      name: cleanText(tag.name),
      group: tag.group,
      aliases: tag.aliases || [],
    }))
    .sort((a, b) => {
      const groupDelta = officialGroupRank.get(a.group) - officialGroupRank.get(b.group);
      if (groupDelta) return groupDelta;
      return a.name.localeCompare(b.name, "zh-Hans-CN");
    });
}

function mountDailyKeywords() {
  const grid = document.querySelector("[data-daily-keywords]");
  if (!grid) return;
  const filters = document.querySelector("[data-daily-keyword-filters]");
  const items = dailyKeywordItems();
  const labels = [
    ["track", "赛道"],
    ["function", "职能"],
    ["scenario", "场景"],
    ["customer", "客户"],
    ["evidence", "证据"],
    ["stage", "阶段"],
    ["region", "市场"],
    ["source", "来源"],
    ["opinion", "观点"],
  ];
  let active = "track";
  const optionsFor = (group) => items
    .filter((item) => item.group === group);
  const renderTagSelect = () => {
    const picked = optionsFor(active);
    grid.innerHTML = `
      <label class="daily-tag-select">
        <span>标签</span>
        <select data-daily-tag-select>
          <option value="">选择具体标签</option>
          ${picked.map((item) => {
            const value = item.id ? `tag:${item.id}` : `q:${item.name}`;
            return `<option value="${safeAttribute(value)}">${safeHtml(item.name)}</option>`;
          }).join("")}
        </select>
      </label>
    `;
    grid.querySelector("[data-daily-tag-select]")?.addEventListener("change", (event) => {
      const value = event.currentTarget.value || "";
      if (!value) return;
      const [kind, payload] = value.split(/:(.+)/);
      window.location.href = kind === "tag"
        ? `signals.html?tags=${encodeURIComponent(payload)}`
        : `signals.html?q=${encodeURIComponent(payload)}`;
    });
  };
  if (filters) {
    filters.innerHTML = `
      <label class="daily-tag-select">
        <span>分类</span>
        <select data-daily-tag-group>
          ${labels.map(([value, label]) => `<option value="${safeAttribute(value)}">${safeHtml(label)}</option>`).join("")}
        </select>
      </label>
    `;
    filters.querySelector("[data-daily-tag-group]")?.addEventListener("change", (event) => {
      active = event.currentTarget.value || "track";
      renderTagSelect();
    });
  }
  renderTagSelect();
}

function dailyBuilderViewMarkup(issue = selectedDailyIssue()) {
  const points = selectedDailyFeaturePoints(issue).slice(0, 3);
  if (!points.length) {
    return `<article class="daily-newsletter-builder-card"><span>同日观点</span><h3>当天暂无达标观点</h3><p>这一日先保留文章和商业信号，后续有达标观点再进入同日素材。</p></article>`;
  }
  return points.map((item, index) => {
    const identity = builderIdentityForPoint(item);
    return `
      <article class="daily-newsletter-builder-card">
        <div class="daily-newsletter-builder-person">
          <span>同日观点 · ${String(index + 1).padStart(2, "0")}</span>
          <h3>${identity.name}</h3>
          <small>${identity.title}</small>
        </div>
        <p class="daily-newsletter-builder-original">${homeShort(opinionChineseQuote(item, identity, 140), 100)}</p>
        <strong>${homeShort(cleanText(item.interpretation || opinionChineseQuote(item, identity, 140) || summaryText(item)), 112)}</strong>
        ${item.sourceUrl ? `<a href="${item.sourceUrl}" target="_blank" rel="noreferrer">查看来源 ↗</a>` : ""}
      </article>
    `;
  }).join("");
}

function dailyPointHref(point = {}) {
  const handle = builderUsername(point.sourceUrl || point.source_url);
  if (handle) return `builder-detail.html?id=${encodeURIComponent(handle)}`;
  if (point.slug || point.id) return `opinion-detail.html?id=${encodeURIComponent(point.slug || point.id)}`;
  return "builders.html";
}

function dailyFrontierPointCard(point = {}, index = 0) {
  const identity = builderIdentityForPoint(point);
  return `
    <a class="daily-day-point" href="${safeAttribute(dailyPointHref(point))}">
      <span>前沿观点 · ${String(index + 1).padStart(2, "0")}</span>
      <strong>${identity.name}</strong>
      <p>${homeShort(opinionChineseQuote(point, identity, 120) || cleanText(point.title || point.interpretation), 96)}</p>
    </a>
  `;
}

function dailyFrontierPointCardV2(point = {}, index = 0) {
  const identity = dailyPointDisplayIdentity(point);
  return `
    <a class="daily-day-point" href="${safeAttribute(dailyPointHref(point))}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${identity.name}</strong>
      <em>${homeShort(cleanText(identity.title || point.speakerLine || point.title), 38)}</em>
      <p>${homeShort(dailyPointKeyLine(point), 86)}</p>
    </a>
  `;
}

function dailyDayArticle(issue = selectedDailyIssue()) {
  const content = selectedDailyContent(issue);
  return {
    title: cleanText(content.title || issue.title || "今日观察").replace(/^今日观察[｜|]\s*/u, ""),
    dek: cleanText(content.dek || content.summary?.[0] || issue.dek || ""),
    href: dailyDetailHref(issue),
  };
}

function dailyDayModuleMarkup(issue = selectedDailyIssue(), index = 0) {
  const signals = exactDailySignals(issue);
  const points = selectedDailyPoints(issue, true);
  const article = dailyDayArticle(issue);
  const date = dailyDateLabel(issue.label || issue.date);
  return `
    <article class="daily-day-module ${index === 0 ? "is-current" : ""}">
      <header class="daily-day-module-head">
        <div>
          <div class="daily-day-date-line">
            <span class="daily-newsletter-memo">${date}</span>
            <div class="daily-day-mini-metrics">${dailyIssueMetricChips(issue, true)}</div>
          </div>
          <h2><a href="${article.href}">${article.title}</a></h2>
        </div>
        <a class="daily-day-read" href="${article.href}">阅读原文</a>
      </header>
      ${article.dek ? `<p class="daily-day-dek">${homeShort(article.dek, 170)}</p>` : ""}
      <div class="daily-day-content">
        <section>
          <h3>商业信号</h3>
          <div class="daily-day-card-list">
            ${signals.length ? signals.slice(0, 3).map((signal) => `
              <a class="daily-day-signal" href="${safeAttribute(signal.link || (signal.slug ? `signal-detail.html?id=${encodeURIComponent(signal.slug)}` : "signals.html"))}">
                <strong>${dailySignalShortTitle(signal)}</strong>
                <p>${signalFrontstageCaseSummary(signal, 96)}</p>
              </a>
            `).join("") : `<p class="daily-day-empty">这一天暂无可展示商业信号。</p>`}
          </div>
        </section>
        <section>
          <h3>前沿观点</h3>
          <div class="daily-day-card-list daily-day-point-list">
            ${points.length ? points.slice(0, 2).map(dailyFrontierPointCardV2).join("") : `<p class="daily-day-empty">这一天暂无达标前沿观点。</p>`}
          </div>
        </section>
      </div>
    </article>
  `;
}

function dailyDayModulesMarkup(issue = selectedDailyIssue()) {
  const issues = dailyIssueList();
  const activeDate = dailyDateParam(issue.date || issue.label);
  const ordered = issues
    .filter((item) => dailyDateParam(item.date || item.label) !== activeDate)
    .slice(0, 6);
  return ordered.map(dailyDayModuleMarkup).join("");
}

function dailyRelatedMarkup(issue = selectedDailyIssue(), signals = selectedDailySignals(issue)) {
  const trends = selectedDailyTrends(issue);
  const trendReports = selectedDailyTrendReports(issue);
  const points = selectedDailyPoints(issue, true);
  const related = [
    ...signals.slice(0, 2).map((item) => ({ ...item, type: "Signal", href: item.link || "signals.html" })),
    ...trends.slice(0, 1).map((item) => ({ ...item, type: "Trend", href: "brief.html" })),
    ...trendReports.slice(0, 1).map((item) => ({ ...item, type: "TrendReport", href: item.link || `trend-detail.html?id=${item.slug}` })),
    ...points.slice(0, 1).map((item) => ({ ...item, type: "前沿观点", href: item.sourceUrl || "builders.html" })),
  ].slice(0, 5);
  if (!related.length) {
    return `<article class="daily-newsletter-related-card"><span>Index</span><h3>当天暂无延伸条目</h3><p>这一日暂以文章和同日素材为主。</p><small>${dailyDateLabel(issue?.label || issue?.date)}</small></article>`;
  }
  return related.map((item, index) => `
    <a class="daily-newsletter-related-card" href="${item.href}">
      <span>${item.type} · ${String(index + 1).padStart(2, "0")}</span>
      <h3>${dailySignalShortTitle(item) || homeShort(cleanText(item.title), 34)}</h3>
      <p>${homeShort(summaryText(item, item.interpretation || item.oneLine), 92)}</p>
      <small>${(item.date || item.originalDate || data.meta.date).replaceAll("-", ".")}</small>
    </a>
  `).join("");
}

function textFromSection(item, names = [], fallback = "") {
  const sections = item?.sections || [];
  const picked = sections.find(([title]) => names.some((name) => String(title).includes(name)));
  return trendReportSafeText(picked?.[1] || fallback);
}

function trendReportSafeText(value = "") {
  return cleanText(value)
    .replace(/\s*date:\s*\d{4}[\s\S]*$/i, "")
    .replaceAll(`任${"务"}`, "工作")
    .replaceAll("证据缺口", "观察状态")
    .replaceAll("反证材料", "对照材料")
    .replaceAll("反证", "对照材料")
    .replaceAll("后续材料继续补序", "同类材料继续出现")
    .replaceAll("后续材料继续补齐", "同类材料继续出现")
    .replaceAll("后续材料继续补厚", "同类材料继续出现")
    .replaceAll("立即行动", "继续观察")
    .replaceAll("马上验证", "动态记录")
    .replaceAll("风口", "变化")
    .replaceAll("红利", "变量")
    .replaceAll("颠覆", "改变")
    .replaceAll("必须入场", "值得继续观察");
}

function trendReportHref(item) {
  return item?.slug ? `trend-detail.html?id=${encodeURIComponent(item.slug)}` : (item?.link || "trend-detail.html");
}

function trendReportId(item, index = 0) {
  const rawDate = String(item?.date || item?.updated || data.meta?.date || "2026.05.11").replaceAll(".", "").replaceAll("-", "").slice(0, 8);
  return `OP-${rawDate}-${String(index + 1).padStart(2, "0")}`;
}

function trendReportAudience(item) {
  return compactJoin([tagsByGroup(item, "customer", 2), tagsByGroup(item, "function", 2)], "业务负责人 / 产品与运营团队");
}

function trendReportScene(item) {
  return compactJoin([tagsByGroup(item, "scenario", 2), tagsByGroup(item, "function", 2)], "客户场景开始清晰");
}

function trendReportEvidenceState(item) {
  if (item?.type === "trend_candidate" || item?.assetLevel === "candidate") return "正在形成的趋势";
  const stage = cleanText(item?.stage || "");
  if (/观察|缺|不足|风险/.test(stage) || item?.evidenceGaps) return "观察中";
  return stage || "材料增强";
}

function trendReportStatus(index, item) {
  const state = trendReportEvidenceState(item);
  if (/不足|缺/.test(state) || item?.evidenceGaps) return index % 3 === 0 ? "还需更多材料" : "观察中";
  return index % 2 === 0 ? "材料增强" : "可进入深读";
}

function trendReportGap(item) {
  return trendReportSafeText(item?.evidenceGaps || textFromSection(item, ["限制"], "继续看客户采用、付费意愿和交付成本是否出现更多同类材料。"));
}

function trendReportVariableItems(item) {
  const raw = textFromSection(item, ["观察变量", "建议关注变量"], "客户上线规模、公开定价锚点、效果指标、责任条款、模板复用率。");
  return raw
    .split(/[；;。]/)
    .map((part) => cleanText(part))
    .filter(Boolean)
    .slice(0, 5);
}

function trendReportSources(item) {
  const related = relatedAssets(item, "trendReport");
  const signals = (related.signal || []).slice(0, 2);
  const trends = (related.trend || []).slice(0, 1);
  return [...signals.map((signal) => ["Signal", signal.title]), ...trends.map((trend) => ["Trend", trend.title])].slice(0, 3);
}

function trendReportWatchItems() {
  const list = data.contentIndex?.trendReports || [];
  const primary = data.trendReport?.slug;
  const picked = list.filter((item) => item.slug !== primary).slice(0, 6);
  if (picked.length) return picked;
  return list.slice(1, 7);
}

function trendRadarTagIds(item) {
  return new Set((item?.tags || []).map((tag) => tag.id || tag.name).filter(Boolean));
}

function trendRadarSignals(item, limit = 3) {
  const related = relatedAssets(item, item?.id?.startsWith("TRD-") ? "trendReport" : "trend");
  return (related.signal || [])
    .filter((signal, index, list) => list.findIndex((candidate) => candidate.id === signal.id) === index)
    .slice(0, limit);
}

function trendRadarPoints(item, limit = 3) {
  const related = relatedAssets(item, item?.id?.startsWith("TRD-") ? "trendReport" : "trend");
  return (related.point || [])
    .filter(isFrontstageOpinionPoint)
    .slice(0, limit);
}

function trendRadarVariables(item, limit = 3) {
  const groups = ["customer", "function", "scenario", "track"];
  const picked = groups.flatMap((group) => tagsByGroup(item, group, 2));
  return picked.length ? picked.slice(0, limit).join(" / ") : "客户流程 / 预算归属";
}

function trendRadarFormalReports() {
  return (data.contentIndex?.trendReports || [])
    .filter((item) => !item.evidenceGaps && !/观察|缺|不足|风险|暂无/.test(cleanText(item.stage || "")));
}

function trendRadarItems() {
  const trends = data.contentIndex?.trends || [];
  const formalReports = trendRadarFormalReports();
  if (trends.length) return [...trends, ...formalReports].filter(Boolean);
  return (data.contentIndex?.trendReports || [data.trendReport].filter(Boolean)).filter(Boolean);
}

function trendRadarItemHref(item) {
  return (item?.type === "trend_candidate" || item?.assetLevel === "candidate")
    ? "#"
    : trendReportHref(item);
}

function trendRadarRelatedLabel(item, signals = [], points = []) {
  const scenes = item?.supportingScenes || [];
  const signalText = signals.length ? `${signals.length} 条信号` : "同类信号待整理";
  const pointText = points.length ? "有观点参照" : "观点参照待整理";
  const sceneText = scenes.length ? `${scenes.length} 个场景` : "场景继续观察";
  return `${signalText} / ${pointText} / ${sceneText}`;
}

function trendRadarObservationCard(item, index) {
  const signals = trendRadarSignals(item, 3);
  const points = trendRadarPoints(item, 1);
  const isFeatured = index === 0;
  const href = trendRadarItemHref(item);
  return `
    <article class="trend-radar-card ${isFeatured ? "is-featured" : ""}" data-trend-radar-item>
      <div class="trend-radar-card-index">${String(index + 1).padStart(2, "0")}</div>
      <div class="trend-radar-card-body">
        <div class="trend-radar-card-meta">
          <span>${trendReportEvidenceState(item)}</span>
          <span>${(item.updated || item.date || data.meta?.date || "").replaceAll("-", ".")}</span>
        </div>
        <h3>${trendReportSafeText(item.title || "未命名方向")}</h3>
        <p>${trendReportSafeText(item.oneLine || item.judgment || summaryText(item, "这条方向正在被多条材料共同指向。"))}</p>
        <dl class="trend-radar-card-facts">
          <div><dt>同类信号</dt><dd>${trendRadarRelatedLabel(item, signals, points)}</dd></div>
          <div><dt>相关变量</dt><dd>${trendRadarVariables(item)}</dd></div>
          <div><dt>观点参照</dt><dd>${points.length ? points[0].speakerLine || points[0].title : "暂无前台参照"}</dd></div>
        </dl>
        ${tagRow(item, 4)}
      </div>
      <a href="${href}" class="trend-radar-card-link">${href === "#" ? "材料累积" : (isFeatured ? "查看观察" : "查看")}</a>
    </article>
  `;
}

function trendRadarCandidateRow(item, index) {
  const signals = trendRadarSignals(item, 2);
  return `
    <article class="trend-radar-row" data-trend-radar-item>
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${trendReportSafeText(item.title || "未命名方向")}</h3>
        <p>${trendReportSafeText(item.nextObservation || item.judgment || item.oneLine || summaryText(item, "同类材料正在累积。"))}</p>
      </div>
      <em>${signals.length ? `${signals.length} 条信号` : "继续观察"}</em>
    </article>
  `;
}

function trendRadarReportCard(item, index) {
  return `
    <a class="trend-radar-report-card" href="${trendReportHref(item)}">
      <span>REPORT ${String(index + 1).padStart(2, "0")}</span>
      <h3>${trendReportSafeText(item.title)}</h3>
      <p>${trendReportSafeText(item.oneLine || summaryText(item))}</p>
    </a>
  `;
}

function trendRadarSideItem(item, type = "point") {
  const href = type === "daily" ? (data.daily?.link || "daily.html") : type === "brief" ? "brief.html" : dailyPointHref(item);
  const title = type === "point" ? item.title : item.title || data.brief?.title || "关联内容";
  const body = type === "point"
    ? cleanText(item.interpretation || item.calibrates || item.usage || "这条观点只作参照。")
    : cleanText(item.dek || item.oneLine || item.summary?.[0] || "与当前观察方向相近。");
  return `
    <a class="trend-radar-side-item" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>
      <strong>${title}</strong>
      <p>${homeShort(body, 86)}</p>
    </a>
  `;
}

function trendLabDate(value = "") {
  return String(value || data.meta?.date || "").replaceAll("-", ".").slice(0, 10);
}

function trendLabItems() {
  return trendRadarItems()
    .filter(Boolean)
    .sort((a, b) => String(b.date || b.updated || "").localeCompare(String(a.date || a.updated || "")));
}

function trendLabFilterParams() {
  const params = new URLSearchParams(window.location.search);
  const tags = [
    ...params.getAll("tag"),
    ...(params.get("tags") || "").split(","),
  ].map((tag) => tag.trim()).filter(Boolean);
  return {
    date: params.get("date") || "",
    tags: [...new Set(tags)],
  };
}

function trendLabFilterHref(next = {}) {
  const params = trendLabFilterParams();
  const date = Object.prototype.hasOwnProperty.call(next, "date") ? next.date : params.date;
  const tags = Object.prototype.hasOwnProperty.call(next, "tags") ? next.tags : params.tags;
  const query = new URLSearchParams();
  if (date) query.set("date", date);
  if (tags?.length) query.set("tags", tags.join(","));
  const queryString = query.toString();
  return queryString ? `trend-tracking.html?${queryString}` : "trend-tracking.html";
}

function trendLabItemDate(item = {}) {
  return dailyDateParam(item.date || item.updated || data.meta?.date || "");
}

function trendLabAvailableDates(items = trendLabItems()) {
  const dates = items
    .map((item) => trendLabItemDate(item))
    .filter(Boolean);
  return [...new Set(dates)].sort((a, b) => b.localeCompare(a));
}

function trendLabActiveDate(date = "", items = trendLabItems()) {
  return date || trendLabAvailableDates(items)[0] || activeSignalDate("");
}

function trendLabItemMatchesDate(item = {}, date = "") {
  if (!date) return true;
  return trendLabItemDate(item) === date;
}

function trendLabItemMatchesTags(item = {}, tags = []) {
  if (!tags.length) return true;
  const values = new Set((item.tags || []).flatMap((tag) => [tag.id, tag.name, ...(tag.aliases || [])]).filter(Boolean));
  return tags.some((tag) => values.has(tag));
}

function trendLabFilterBarMarkup(items = [], params = {}, activeDate = "") {
  const dates = trendLabAvailableDates(items);
  const activeParts = activeDate.split("-");
  const years = [...new Set(dates.map((date) => date.slice(0, 4)).filter(Boolean))];
  const months = [...new Set(dates
    .filter((date) => date.startsWith(activeParts[0] || ""))
    .map((date) => date.slice(5, 7))
    .filter(Boolean))];
  const days = [...new Set(dates
    .filter((date) => date.startsWith(`${activeParts[0]}-${activeParts[1]}`))
    .map((date) => date.slice(8, 10))
    .filter(Boolean))];
  const tags = signalTagFilters();
  const activeTag = tags.find((tag) => params.tags?.includes(tag.id));
  const activeGroup = activeTag?.group || "track";
  const groupOptions = [...new Set(tags.map((tag) => tag.group).filter(Boolean))];
  const groupTags = tags.filter((tag) => tag.group === activeGroup);
  const option = (value, current, label = value) => `<option value="${safeAttribute(value)}" ${value === current ? "selected" : ""}>${safeHtml(label)}</option>`;
  return `
    <nav class="daily-article-date-actions trend-lab-filter-date-actions" aria-label="按年月日筛选">
      <div class="daily-date-selectors">
        <label><span>年</span><select name="year" data-trend-date-part="year">${years.map((year) => option(year, activeParts[0], year)).join("")}</select></label>
        <label><span>月</span><select name="month" data-trend-date-part="month">${months.map((month) => option(month, activeParts[1], `${Number(month)}月`)).join("")}</select></label>
        <label><span>日</span><select name="day" data-trend-date-part="day">${days.map((day) => option(day, activeParts[2], `${Number(day)}日`)).join("")}</select></label>
      </div>
    </nav>
    <div class="daily-article-tags" aria-label="标签归类">
      <span class="daily-article-tags-label">标签归类</span>
      <div class="daily-newsletter-filter-row">
        <label class="daily-tag-select trend-tag-group-select">
          <span>标签归类</span>
          <select name="group" data-trend-tag-group>
            ${groupOptions.map((group) => option(group, activeGroup, tagGroupLabel(group))).join("")}
          </select>
        </label>
      </div>
      <div class="daily-newsletter-keyword-grid">
        <label class="daily-tag-select trend-tag-specific-select">
          <span>标签</span>
          <select name="tag" data-trend-tag-select>
            <option value="">选择具体标签</option>
            ${groupTags.map((tag) => option(tag.id, activeTag?.id || "", tag.label)).join("")}
          </select>
        </label>
      </div>
    </div>
  `;
}

function trendLabStatus(item = {}) {
  if (item.type === "trend_candidate" || item.assetLevel === "candidate") return "正在形成";
  if (item.kind === "full") return "深度报告";
  if (item.kind === "flash") return "趋势快报";
  return trendReportEvidenceState(item);
}

function trendLabSignalType(signal = {}) {
  const type = cleanText(signal.signalType || signal.type || "");
  if (/funding|融资/u.test(type + signal.title)) return "融资";
  if (/case|案例|客户/u.test(type + signal.title)) return "案例";
  if (/product|launch|产品|发布/u.test(type + signal.title)) return "产品";
  return "信号";
}

function trendLabSignalHref(signal = {}) {
  return signal.link || (signal.slug ? `signal-detail.html?id=${encodeURIComponent(signal.slug)}` : "signals.html");
}

function trendLabTrendTitle(item = {}) {
  return trendReportSafeText(item.title || "未命名趋势方向");
}

function trendLabOneLine(item = {}) {
  return trendReportSafeText(item.oneLine || item.judgment || summaryText(item, "这条方向正在被多条材料共同指向。"));
}

function trendLabCaseProductCount(signals = []) {
  return signals.filter((signal) => /妗堜緥|案例|浜у搧|产品/.test(trendLabSignalType(signal))).length;
}

function trendLabFormationMarkup(item = {}) {
  const signals = trendRadarSignals(item, 8);
  const points = trendRadarPoints(item, 4);
  const cases = trendLabCaseProductCount(signals);
  const sourceTypes = Array.isArray(item.sourceTypes) ? item.sourceTypes.slice(0, 4).join(" / ") : "";
  const reason = cleanText(item.formationReason || item.whyForming || item.frontend?.whyForming || item.trendReason || item.formationLogic || "");
  const relation = cleanText(item.relationSummary || item.frontend?.relationSummary || "");
  const boundary = cleanText(item.publicBoundary || item.frontend?.publicBoundary || "");
  if (reason) {
    return `
      <section class="trend-lab-forming-note">
        <span>为什么在形成</span>
        <strong>${reason}</strong>
        <p>${relation || boundary || (sourceTypes ? `关联材料来自 ${sourceTypes}。` : "这条说明来自趋势候选的前台文案。")}</p>
        ${boundary && relation ? `<p>${boundary}</p>` : ""}
      </section>
    `;
  }
  const support = [
    signals.length ? `${signals.length} 条关联信号` : "",
    cases ? `${cases} 个案例 / 产品` : "",
    points.length ? `${points.length} 条观点参照` : "",
  ].filter(Boolean).join("、") || "少量关联材料";
  return `
    <section class="trend-lab-forming-note is-pending">
      <span>为什么在形成</span>
      <strong>暂缺成形说明</strong>
      <p>当前只能看到 ${support}${sourceTypes ? `，来源覆盖 ${sourceTypes}` : ""}。这些可以说明材料正在聚合，但还不能替代一段正式的编辑判断。</p>
    </section>
  `;
}

function trendLabFocusMarkup(item = {}) {
  const tags = tagsByGroup(item, "track", 3);
  return `
    <article class="trend-lab-focus-card">
      <div class="trend-lab-focus-meta">
        <span>${trendLabStatus(item)}</span>
        <span>${trendLabDate(item.updated || item.date)}</span>
      </div>
      <h2>${trendLabTrendTitle(item)}</h2>
      <p>${trendLabOneLine(item)}</p>
      ${trendLabFormationMarkup(item)}
      <div class="trend-lab-focus-bottom">
        <div class="trend-lab-mini-tags">${(tags.length ? tags : itemTags(item, 3).map((tag) => tag.name)).map((tag) => `<span>${tag}</span>`).join("")}</div>
        <strong>${cleanText(item.nextObservation) || "下一步看客户采用、预算归属和流程责任是否继续出现。"}</strong>
      </div>
    </article>
  `;
}

function trendLabStatsMarkup(item = {}) {
  const signals = trendRadarSignals(item, 6);
  const points = trendRadarPoints(item, 3);
  const cases = trendLabCaseProductCount(signals);
  return `
    <dl class="trend-lab-side-stats">
      <div><dt>共同变量</dt><dd>${trendRadarVariables(item, 4)}</dd></div>
      <div><dt>关联信号</dt><dd>${signals.length ? `${signals.length} 条指向左侧判断` : "同类信号待整理"}</dd></div>
      <div><dt>关联案例 / 产品</dt><dd>${cases ? `${cases} 个支撑材料` : "继续观察"}</dd></div>
      <div><dt>关联观点</dt><dd>${points.length ? `${points.length} 条可参照观点` : "暂未进入前台"}</dd></div>
    </dl>
  `;
}

function trendLabTimelineMarkup(activeItem = {}, items = []) {
  const ordered = items
    .filter((item) => item.date || item.updated)
    .sort((a, b) => String(a.date || a.updated || "").localeCompare(String(b.date || b.updated || "")));
  const rows = ordered.length ? ordered : [activeItem];
  return rows.map((item, index) => {
    const isActive = (item.id || item.slug) === (activeItem.id || activeItem.slug);
    const signals = trendRadarSignals(item, 3);
    return `
      <article class="trend-lab-timeline-row ${isActive ? "is-active" : ""}">
        <time>${trendLabDate(item.date || item.updated)}</time>
        <div>
          <span>${String(index + 1).padStart(2, "0")} / ${trendLabStatus(item)}</span>
          <h3>${trendLabTrendTitle(item)}</h3>
          <p>${homeShort(trendLabOneLine(item), 128)}</p>
        </div>
        <em>${signals.length ? `${signals.length} 条材料` : "继续观察"}</em>
      </article>
    `;
  }).join("");
}

function trendLabEvidenceMarkup(item = {}) {
  const signals = trendRadarSignals(item, 8);
  if (!signals.length) {
    return `<article class="trend-lab-empty"><strong>材料仍在整理</strong><p>当前方向先保留为观察，等商业信号、产品案例或场景卡进入前台后再展开。</p></article>`;
  }
  return signals.map((signal, index) => `
    <a class="trend-lab-evidence-row" href="${safeAttribute(trendLabSignalHref(signal))}">
      <span>${trendLabSignalType(signal)}</span>
      <div>
        <strong>${homeShort(cleanText(signal.title || signal.frontend?.displayTitle), 58)}</strong>
        <p>${homeShort(cleanText(signal.brief || signal.businessMeaning || signal.judgment || signal.event), 112)}</p>
      </div>
      <time>${trendLabDate(signal.date)}</time>
    </a>
  `).join("");
}

function trendLabTrendListMarkup(items = [], activeId = "") {
  const rows = items.filter((item, index) => {
    const key = item.id || item.slug || item.title || index;
    return key !== activeId;
  });
  if (!rows.length) {
    return `<article class="trend-lab-empty"><strong>暂无其他趋势</strong><p>当前筛选下只保留左侧这一条判断。</p></article>`;
  }
  return rows.map((item, index) => {
    const key = item.id || item.slug || item.title || index;
    return `
      <button class="trend-lab-list-item" type="button" data-trend-lab-select="${safeAttribute(key)}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${homeShort(trendLabTrendTitle(item), 42)}</strong>
        <em>${trendLabStatus(item)} · ${trendLabDate(item.date || item.updated)}</em>
      </button>
    `;
  }).join("");
}

function trendLabPointsMarkup(item = {}) {
  const points = trendRadarPoints(item, 3);
  if (!points.length) return `<p class="trend-lab-side-empty">暂无前台观点参照。</p>`;
  return points.map((point) => {
    const body = cleanText(point.interpretation || point.calibrates || point.usage || point.title);
    return `
      <a class="trend-lab-side-link" href="${safeAttribute(dailyPointHref(point))}">
        <strong>${homeShort(cleanText(point.speakerLine || point.title), 42)}</strong>
        <p>${homeShort(body, 88)}</p>
      </a>
    `;
  }).join("");
}

function trendLabReportsMarkup() {
  const reports = [];
  if (!reports.length) return `<p class="trend-lab-side-empty">暂无正式趋势报告。当前只展示正在形成的方向。</p>`;
  return reports.slice(0, 4).map((item) => `
    <a class="trend-lab-side-link" href="${safeAttribute(trendReportHref(item))}">
      <strong>${homeShort(trendLabTrendTitle(item), 42)}</strong>
      <p>${homeShort(trendLabOneLine(item), 88)}</p>
    </a>
  `).join("");
}

function trendLabRelatedMarkup(item = {}) {
  const directLinks = trendRadarSignals(item, 4).map((signal) => [
    trendLabSignalType(signal),
    signal.title || signal.frontend?.displayTitle || signal.id,
    trendLabSignalHref(signal),
  ]);
  return directLinks.map(([label, title, href]) => `
    <a class="trend-lab-side-link" href="${safeAttribute(href)}">
      <span>${label}</span>
      <strong>${homeShort(cleanText(title), 42)}</strong>
    </a>
  `).join("");
}

function setTrendLabPanelContent(node, html = "") {
  if (!node) return;
  node.innerHTML = html;
  const panel = node.closest(".trend-lab-panel");
  if (panel) panel.hidden = !html.trim() || /trend-lab-side-empty/.test(html);
}

function trendReportCoverGraphic() {
  return `
    <div class="trend-report-cover-graphic">
      <img src="assets/generated/trend-report-report-cover-imagegen.png" alt="客户体验 Agent 平台机会报告配图">
    </div>
  `;
}

function trendReportSourceStrip(item) {
  const sources = trendReportSources(item);
  if (!sources.length) return "";
  return `
    <div class="trend-report-source-strip">
      ${sources.map(([type, title]) => `
        <span><em>${type}</em>${trendReportSafeText(homeShort(title, 34))}</span>
      `).join("")}
    </div>
  `;
}

function trendReportFrameworkMarkup() {
  const dimensions = [
    ["01", "信号密度", "是否有多个独立信号指向同一方向？"],
    ["02", "客户场景", "是否对应真实客户痛点，而不是概念热度？"],
    ["03", "付费变量", "是否可能影响收入、成本、效率、风险或预算？"],
    ["04", "观察状态", "哪些材料已经出现，哪些判断仍需等待？"],
    ["05", "后续观察", "接下来最该看哪些证据继续出现？"],
  ];
  return `
    <div class="trend-report-section-head">
      <div>
        <span class="trend-report-section-kicker">判断框架</span>
        <h2>我们如何判断一个方向是否值得继续跟</h2>
      </div>
      <p>观澜AI不贩卖机会答案，只把信号、场景、变量和边界放到同一张判断图里。</p>
    </div>
    <div class="trend-report-framework-grid">
      <div class="trend-report-path-card">
        <span class="trend-report-card-label">判断路径</span>
        <div class="trend-report-path-graphic" aria-label="信号到机会路径图">
          <img src="assets/generated/trend-report-framework-path-imagegen.png" alt="从信号到机会方向的判断路径图">
        </div>
      </div>
      <div class="trend-report-dimension-list">
        ${dimensions.map(([num, title, text]) => `
          <article>
            <span>${num}</span>
            <strong>${title}</strong>
            <p>${text}</p>
          </article>
        `).join("")}
      </div>
      <div class="trend-report-evidence-card">
        <span class="trend-report-card-label">EVIDENCE GAP</span>
        <h3>材料进展</h3>
        ${[["已有材料", 62], ["同类材料", 38], ["继续观察", 74]].map(([label, value]) => `
          <div class="trend-report-proof-bar"><span>${label}</span><i style="--w:${value}%"></i><em>${value}%</em></div>
        `).join("")}
      </div>
      <div class="trend-report-timeline-card">
        <span class="trend-report-card-label">WATCH STATUS</span>
        <h3>后续观察</h3>
        ${[["证据", "看是否出现新增客户案例"], ["预算", "看定价锚点和预算归属"], ["交付", "看交付成本、留存和责任条款"]].map(([time, text]) => `
          <div><span>${time}</span><p>${text}</p></div>
        `).join("")}
      </div>
    </div>
  `;
}

function briefHeatTriples() {
  const fallback = [
    ["企业服务", "客服运营", "平台化交付", "升温", "上线周期与模板复用率开始成为关键变量。"],
    ["知识工作", "财务与文档", "引用复核", "升温", "越靠近真实产出，审计与治理越要提前进入。"],
    ["AI治理", "安全负责人", "运行时控制", "争议", "能否拦截、回滚和回放，仍决定采购信心。"],
  ];
  return (data.brief?.heat || fallback).slice(0, 3).map((item, index) => {
    if (Array.isArray(item) && item.length >= 5) return item;
    const [title, state, detail] = item;
    const triples = [
      ["企业服务", "客服运营", "平台化交付"],
      ["知识工作", "财务与文档", "引用复核"],
      ["AI治理", "安全负责人", "运行时控制"],
    ][index] || ["企业服务", "业务负责人", "流程治理"];
    return [...triples, state || "升温", detail || title];
  });
}

function briefStateCopy(state) {
  return {
    public: {
      label: "普通用户",
      cta: "订阅商业内参",
      title: "免费预览",
      body: "可阅读本期标题、本期判断、部分来源摘要、热力变化概览和往期标题。",
      note: "完整内参、来源摘要、风险信息和往期判断追踪保留在会员层。",
    },
    "logged-in": {
      label: "登录用户",
      cta: "阅读本期完整内参",
      title: "目录与试读",
      body: "可阅读完整目录、更多来源摘要和部分精读预览。",
      note: "完整热力变化、未定部分和趋势判断保留在会员层。",
    },
    member: {
      label: "会员",
      cta: "阅读完整内参",
      title: "会员完整态",
      body: "可阅读完整正文、完整来源摘要、热力变化、未定部分、趋势判断和往期参照。",
      note: "本期判断不替代最终经营、投资或合作判断。",
    },
  }[state];
}

function briefIssueDate() {
  return "2026.05.11";
}

function briefSafeText(value = "") {
  return cleanText(value)
    .replaceAll(`执行${"任"}${"务"}`, "执行动作")
    .replaceAll(`${"任"}${"务"}后`, "进入执行后");
}

function briefIssueKeywords() {
  return ["Agent", "控制层", "工程治理", "企业交付", "责任范围"];
}

function briefTocItems() {
  return [
    ["01", "本期判断", "本期最值得先看的变化"],
    ["02", "关键来源摘要", "哪些事实推动判断变化"],
    ["03", "热力变化", "哪些方向升温或进入争议"],
    ["04", "商业变量", "哪些事会影响预算、流程和团队"],
    ["05", "材料缺口", "哪些地方还缺材料"],
    ["06", "趋势判断", "哪些方向进入内参跟踪"],
    ["07", "动态记录", "7 / 30 / 90 天记录什么"],
    ["08", "往期参照", "判断如何延续、修正或加强"],
  ];
}

function briefCoreJudgments() {
  const defaults = [
    ["MCP / 连接器会迅速普及", "规模化上线看的不是演示有多顺，而是运行时策略能不能真的执行。", "关联变量：权限、审计、回滚"],
    ["未来 90 天值得盯的变量", "上线周期、模板复用率、一次解决率和事故成本，会比模型参数更接近采购判断。", "关联来源：客户采用、产品发布"],
    ["企业会先为“可控”付费", "当 Agent 进入流程后，企业会先买可控运行，再买更聪明的能力。", "关联变量：责任条款、交付成本"],
  ];
  return defaults.map((item, index) => {
    const summary = data.brief?.summary?.[index];
    return summary ? [item[0], briefSafeText(summary), item[2]] : item;
  });
}

function briefSourceNotes() {
  const trendItems = (data.brief?.evidence?.trends || []).slice(0, 3).map((item, index) => ({
    type: "趋势背景",
    name: item.title,
    grade: index === 0 ? "A" : "B",
    fact: briefSafeText(item.judgment || item.evidenceGaps || summaryText(item)),
    role: index === 0 ? "加强本期判断" : "补充事实口径",
  }));
  const pointItems = (data.brief?.evidence?.points || []).slice(0, 3).map((item, index) => ({
    type: "前沿观点",
    name: item.title,
    grade: index === 0 ? "A" : "B",
    fact: briefSafeText(item.calibrates || item.interpretation || summaryText(item)),
    role: "修正判断口径",
  }));
  return [...trendItems, ...pointItems].slice(0, 6);
}

function briefArchiveItems() {
  return (data.contentIndex?.dates || []).slice(0, 6).map((item, index) => ({
    issue: `BRIEF ${String(index + 1).padStart(3, "0")}`,
    date: item.label || item.date,
    title: item.title,
    tag: ["延续", "加强", "修正", "持续记录", "已验证", "范围更新"][index] || "持续记录",
    line: briefSafeText(item.dek || "周期判断归档。"),
  }));
}

function briefCoverGraphic() {
  return `
    <div class="brief-cover-graphic">
      <img src="assets/generated/business-brief-control-layer-imagegen.png" alt="Agent 控制层、工程治理与企业交付链的抽象研究图">
    </div>
  `;
}

function mountDaily() {
  if (getPageName() !== "daily.html") return;
  const issue = selectedDailyIssue();
  const dailyContent = selectedDailyContent(issue);
  const signals = exactDailySignals(issue);
  setText("[data-daily-date]", dailyDateLabel(issue.label || issue.date));
  setText("[data-daily-title]", cleanText(dailyContent.title || issue.title || "今日观察文章").replace(/^今日观察[｜|]\s*/u, ""));
  const titleLink = document.querySelector("[data-daily-title-link]");
  if (titleLink) titleLink.href = dailyDetailHref(issue);
  const readLink = document.querySelector("[data-daily-read-link]");
  if (readLink) readLink.href = dailyDetailHref(issue);
  mountDailyDateNavV2(issue);

  const issueBand = document.querySelector("[data-daily-issue-band]");
  if (issueBand) issueBand.innerHTML = dailyIssueBandMarkup(issue);

  const deck = document.querySelector("[data-daily-article-deck]");
  if (deck) deck.innerHTML = `<p>${homeShort(cleanText(dailyContent.dek || dailyContent.summary?.[0] || issue.dek || ""), 260)}</p>`;

  const sameDaySignals = document.querySelector("[data-daily-same-day-signals]");
  if (sameDaySignals) {
    sameDaySignals.innerHTML = signals.length
      ? signals.slice(0, 6).map(dailyNewsletterSignal).join("")
      : `<article class="daily-newsletter-signal-card"><span class="daily-newsletter-memo">EMPTY</span><h3>这一天暂无可展示信号</h3><p>当前只显示今日观察文章。</p></article>`;
  }

  const builderViews = document.querySelector("[data-daily-builder-views]");
  if (builderViews) builderViews.innerHTML = dailyBuilderViewMarkup(issue);

  const related = document.querySelector("[data-daily-related]");
  if (related) related.innerHTML = dailyRelatedMarkup(issue, signals);

  const original = document.querySelector("[data-daily-article-original]");
  if (original) original.innerHTML = dailyArticleOriginalMarkup(dailyContent);

  const articleAssets = document.querySelector("[data-daily-article-assets]");
  if (articleAssets) articleAssets.innerHTML = dailyArticleAssetsMarkup(issue);

  const dayModules = document.querySelector("[data-daily-day-modules]");
  if (dayModules) dayModules.innerHTML = dailyDayModulesMarkup(issue);

  mountDailyKeywords();
}

function mountTrendReport() {
  const focusNode = document.querySelector("[data-trend-lab-focus]");
  if (!focusNode) return;
  const allItems = trendLabItems();
  const params = trendLabFilterParams();
  const activeDate = trendLabActiveDate(params.date, allItems);
  const filterNode = document.querySelector("[data-trend-lab-filter]");
  const listNode = document.querySelector("[data-trend-lab-list]");
  const statsNode = document.querySelector("[data-trend-lab-stats]");
  const timelineNode = document.querySelector("[data-trend-lab-timeline]");
  const evidenceNode = document.querySelector("[data-trend-lab-evidence]");
  const pointsNode = document.querySelector("[data-trend-lab-points]");
  const reportsNode = document.querySelector("[data-trend-lab-reports]");
  const relatedNode = document.querySelector("[data-trend-lab-related]");
  let activeId = "";

  if (filterNode) filterNode.innerHTML = trendLabFilterBarMarkup(allItems, params, activeDate);

  const render = () => {
    const visible = allItems
      .filter((item) => trendLabItemMatchesDate(item, activeDate))
      .filter((item) => trendLabItemMatchesTags(item, params.tags));
    if (!visible.find((item) => (item.id || item.slug) === activeId)) {
      activeId = visible[0]?.id || visible[0]?.slug || "";
    }
    const active = visible.find((item) => (item.id || item.slug) === activeId) || visible[0];
    if (!active) {
      focusNode.innerHTML = `<article class="trend-lab-empty"><strong>没有找到可展示材料</strong><p>换一个日期、标签归类或具体标签试试。</p></article>`;
      setTrendLabPanelContent(listNode, "");
      setTrendLabPanelContent(statsNode, "");
      if (timelineNode) timelineNode.innerHTML = "";
      if (evidenceNode) evidenceNode.innerHTML = "";
      setTrendLabPanelContent(pointsNode, "");
      setTrendLabPanelContent(reportsNode, "");
      setTrendLabPanelContent(relatedNode, "");
      return;
    }
    focusNode.innerHTML = trendLabFocusMarkup(active);
    setTrendLabPanelContent(statsNode, trendLabStatsMarkup(active));
    setTrendLabPanelContent(listNode, "");
    if (timelineNode) timelineNode.innerHTML = trendLabTimelineMarkup(active, allItems);
    if (evidenceNode) evidenceNode.innerHTML = trendLabEvidenceMarkup(active);
    setTrendLabPanelContent(pointsNode, trendLabPointsMarkup(active));
    setTrendLabPanelContent(reportsNode, trendLabReportsMarkup(active));
    setTrendLabPanelContent(relatedNode, trendLabRelatedMarkup(active));
    listNode?.querySelectorAll("[data-trend-lab-select]").forEach((button) => {
      button.addEventListener("click", () => {
        activeId = button.dataset.trendLabSelect;
        render();
      });
    });
  };

  filterNode?.addEventListener("change", (event) => {
    const year = filterNode.querySelector('[name="year"]')?.value || activeDate.slice(0, 4);
    const month = filterNode.querySelector('[name="month"]')?.value || activeDate.slice(5, 7);
    const day = filterNode.querySelector('[name="day"]')?.value || activeDate.slice(8, 10);
    const date = `${year}-${month}-${day}`;
    const groupSelect = filterNode.querySelector("[data-trend-tag-group]");
    const tagSelect = filterNode.querySelector("[data-trend-tag-select]");
    if (event.target === groupSelect && tagSelect) {
      const groupTags = signalTagFilters().filter((tag) => tag.group === groupSelect.value);
      tagSelect.innerHTML = `
        <option value="">选择具体标签</option>
        ${groupTags.map((tag) => `<option value="${safeAttribute(tag.id)}">${safeHtml(tag.label)}</option>`).join("")}
      `;
      return;
    }
    const tag = tagSelect?.value || "";
    window.location.href = trendLabFilterHref({ date, tags: tag ? [tag] : [] });
  });

  render();
}

function mountSignalArchive() {
  const node = document.querySelector("[data-signal-archive]");
  if (!node || !data.contentIndex?.signals) return;
  node.innerHTML = data.contentIndex.signals
    .slice()
    .reverse()
    .map((signal, index) => signalCard(signal, index))
    .join("");
}

function mountSignalRelations() {
  const node = document.querySelector("[data-signal-relations]");
  if (!node) return;
  node.innerHTML = activeRelationRows(3);
}

function mountTrendReportIndex() {
  const node = document.querySelector("[data-trend-report-index]");
  if (!node || !data.contentIndex?.trendReports) return;
  node.innerHTML = data.contentIndex.trendReports.slice(0, 8).map((item, index) => `
    <a class="trend-report-history-row" href="${trendReportHref(item)}">
      <span>${trendReportId(item, index)}</span>
      <div>
        <strong>${trendReportSafeText(item.title)}</strong>
        <p>${homeShort(trendReportSafeText(item.oneLine || summaryText(item)), 120)}</p>
      </div>
      <em>${trendReportStatus(index, item)}</em>
    </a>
  `).join("");
}

function mountTrendReportRelations() {
  const node = document.querySelector("[data-trend-report-relations]");
  if (!node || !data.contentIndex?.trendReports) return;
  const relations = ["延续", "加强", "还需材料", "修正"];
  node.innerHTML = data.contentIndex.trendReports.slice(0, 4).map((trendReport, index) => `
    <article class="trend-report-brief-link">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${trendReportSafeText(trendReport.title)}</h3>
        <p>${index === 0 ? "与本期商业内参的 Agent 控制层判断形成参照。" : homeShort(trendReportSafeText(trendReport.oneLine || summaryText(trendReport)), 96)}</p>
        <small>${relations[index] || "继续观察"} · ${trendReportEvidenceState(trendReport)}</small>
      </div>
    </article>
  `).join("");
}

function mountTrendReportWatch() {
  const node = document.querySelector("[data-trend-report-watch]");
  if (!node) return;
  const items = trendReportWatchItems();
  node.innerHTML = items.map((item, index) => `
    <article class="trend-report-watch-item">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <div class="trend-report-watch-title">
          <h3>${trendReportSafeText(item.title)}</h3>
          <em>${trendReportStatus(index, item)}</em>
        </div>
        <p>${homeShort(trendReportSafeText(item.oneLine || summaryText(item)), 132)}</p>
        <dl>
          <div><dt>适用场景</dt><dd>${trendReportScene(item)}</dd></div>
          <div><dt>相关变量</dt><dd>${trendRadarVariables(item)}</dd></div>
          <div><dt>继续看</dt><dd>${trendReportVariableItems(item).slice(0, 2).map(trendReportSafeText).join(" / ")}</dd></div>
        </dl>
      </div>
      <a href="${trendReportHref(item)}">查看观察</a>
    </article>
  `).join("");
}

function mountTrendReportFramework() {
  const node = document.querySelector("[data-trend-report-framework]");
  if (!node) return;
  node.innerHTML = trendReportFrameworkMarkup();
}

function mountBriefAssets() {
  const dailyPoints = document.querySelector("[data-daily-point-assets]");
  if (dailyPoints && data.contentIndex?.points) {
    const activeDate = data.contentIndex.activeDate;
    const items = data.contentIndex.points.filter((item) => item.date === activeDate && isFrontstageOpinionPoint(item)).slice(0, 6);
    dailyPoints.innerHTML = items.map((item, index) => pointCard(item, index)).join("");
  }
  const points = document.querySelector("[data-point-assets]");
  if (points && data.contentIndex?.points) {
    points.innerHTML = data.contentIndex.points.filter(isFrontstageOpinionPoint).map((item, index) => pointCard(item, index)).join("");
  }
  const trends = document.querySelector("[data-trend-assets]");
  if (trends && data.contentIndex?.trends) {
    trends.innerHTML = data.contentIndex.trends.map((item, index) => smallAssetCard(item, index, "trend")).join("");
  }
}

function mountBrief() {
  const state = getMemberState();
  const stateCopy = briefStateCopy(state);

  const benefits = document.querySelector("[data-brief-benefits]");
  if (benefits) {
    const benefitItems = ["阅读完整内参", "查看来源与证据", "获取趋势热力变化", "追踪往期判断", "解锁趋势追踪"];
    benefits.innerHTML = `
      <span class="brief-card-label">MEMBER ACCESS</span>
      <h2>会员权益</h2>
      <ul>${benefitItems.map((item) => `<li>${item}</li>`).join("")}</ul>
      <div class="brief-reader-fit">
        <span>适合阅读人群</span>
        <strong>企业老板 / 行业操盘手 / 投资观察者 / 资源型合伙人</strong>
      </div>
      <div class="brief-benefit-actions">
        <a class="button primary" href="pricing.html">${stateCopy.cta}</a>
        <a class="button secondary" href="#featured-issue">查看本期预览</a>
      </div>
    `;
  }

  const cover = document.querySelector("[data-brief-cover]");
  if (cover) {
    cover.innerHTML = `
      <div class="brief-cover-brand">
        <img src="assets/brand/logo-wavesight-reference-horizontal.svg" alt="观澜AI Wavesight AI">
        <span>WAVESIGHT AI BUSINESS BRIEF</span>
      </div>
      <div class="brief-cover-meta">
        <span>期号 ${data.brief.issue || "Preview.001"}</span>
        <span>发布 ${briefIssueDate()}</span>
        <span>Reading Time 8 min</span>
      </div>
      <h2>${data.brief.title}</h2>
      ${briefCoverGraphic()}
      <div class="brief-cover-keywords">
        ${briefIssueKeywords().map((item) => `<span>${item}</span>`).join("")}
      </div>
    `;
  }

  const executive = document.querySelector("[data-brief-executive]");
  if (executive) {
    executive.innerHTML = `
      <span class="brief-card-label">EXECUTIVE JUDGMENT</span>
      <h2>本期判断</h2>
      <p class="brief-main-judgment">${briefSafeText(data.brief.summary?.[0] || data.brief.title)}</p>
      <div class="brief-executive-list">
        ${briefCoreJudgments().map(([title, text], index) => `
          <article>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${title}</strong>
            <p>${text}</p>
          </article>
        `).join("")}
      </div>
      <div class="brief-executive-meta">
        <div><span>证据状态</span><strong>判断正在加强，仍需更多材料</strong></div>
        <div><span>观察窗口</span><strong>7D / 30D / 90D</strong></div>
        <div><span>适合谁读</span><strong>企业经营者 / 业务负责人 / 投资观察者</strong></div>
        <div><span>会员可解锁</span><strong>完整来源摘要、热力变化、未定部分</strong></div>
      </div>
    `;
  }

  const controls = document.querySelector("[data-member-controls]");
  if (controls) {
    const items = [
      ["public", "免费预览"],
      ["logged-in", "登录试读"],
      ["member", "会员完整态"],
    ];
    controls.innerHTML = items.map(([key, label]) => `
      <button class="state-button" type="button" data-state="${key}" ${state === key ? 'aria-pressed="true"' : ""}>${label}</button>
    `).join("");
    controls.querySelectorAll("[data-state]").forEach((button) => {
      button.addEventListener("click", () => setMemberState(button.dataset.state));
    });
  }

  const member = document.querySelector("[data-brief-member]");
  if (member) {
    const rows = state === "member"
      ? ["完整正文", "完整来源摘要", "完整热力变化", "未定部分", "趋势判断", "往期参照", "下载 / 收藏 / 分享"]
      : ["标题与本期判断", "部分来源摘要", "热力变化概览", "往期标题", "完整内参"];
    member.className = `brief-member-card member-${state}`;
    member.innerHTML = `
      <div>
        <span class="brief-card-label">${stateCopy.label}</span>
        <h3>${stateCopy.title}</h3>
        <p>${stateCopy.body}</p>
        <small>${stateCopy.note}</small>
      </div>
      <ul>${rows.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
  }

  const toc = document.querySelector("[data-brief-toc]");
  if (toc) {
    toc.innerHTML = `
      <span class="brief-card-label">TABLE OF CONTENTS</span>
      <h2>本期目录</h2>
      <div class="brief-toc-list">
        ${briefTocItems().map(([num, title, text]) => `
          <div>
            <span>${num}</span>
            <strong>${title}</strong>
            <p>${text}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  const core = document.querySelector("[data-brief-core]");
  if (core) {
    core.innerHTML = `
      <span class="brief-card-label">A. CORE JUDGMENT</span>
      <h3>本期判断</h3>
      ${briefCoreJudgments().map(([title, text, meta], index) => `
        <article class="brief-judgment-item">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>${title}</strong>
            <p>${text}</p>
            <small>${meta}</small>
          </div>
        </article>
      `).join("")}
    `;
  }

  const sources = document.querySelector("[data-brief-sources]");
  if (sources) {
    const locked = state === "public";
    const visible = locked ? briefSourceNotes().slice(0, 4) : briefSourceNotes();
    sources.innerHTML = `
      <span class="brief-card-label">B. SOURCE NOTES</span>
      <h3>来源摘要</h3>
      ${visible.map((item, index) => `
        <article class="brief-source-row ${locked && index > 2 ? "is-muted" : ""}">
          <span>${item.type}</span>
          <strong>${item.name}</strong>
          <em>${item.grade}</em>
          <p>${homeShort(item.fact, 128)}</p>
          <small>${item.role}</small>
        </article>
      `).join("")}
      ${locked ? `<div class="brief-soft-lock">完整来源摘要和未定部分保留在会员层。</div>` : ""}
    `;
  }

  const references = document.querySelector("[data-brief-references]");
  if (references) {
    references.innerHTML = `
      <span class="brief-card-label">C. PRIOR REFERENCES</span>
      <h3>往期参照</h3>
      ${briefArchiveItems().slice(0, 4).map((item) => `
        <article class="brief-reference-row">
          <time>${item.date}</time>
          <strong>${item.title}</strong>
          <p>${homeShort(item.line, 96)}</p>
          <em>${item.tag}</em>
        </article>
      `).join("")}
    `;
  }

  const heat = document.querySelector("[data-heat]");
  if (heat) {
    const locked = state === "public";
    heat.innerHTML = `
      <span class="brief-card-label">HEAT CHANGE</span>
      <h3>本期热力变化</h3>
      ${briefHeatTriples().map(([industry, role, workflow, trend, detail], index) => `
        <article class="brief-heat-card ${locked && index > 1 ? "is-locked" : ""}">
          <div class="brief-heat-axis">
            <span>${industry}</span>
            <span>${role}</span>
            <span>${workflow}</span>
          </div>
          <div class="brief-heat-main">
            <strong>${industry} x ${role} x ${workflow}</strong>
            <p>${briefSafeText(detail)}</p>
            <small>${index === 0 ? "进入深挖" : index === 1 ? "继续观察" : "存在争议"}</small>
          </div>
          <em class="heat-state">${trend}</em>
          ${locked && index > 1 ? `<div class="module-lock"><strong>会员层</strong><p>完整热力变化和往期对比向会员开放。</p></div>` : ""}
        </article>
      `).join("")}
    `;
  }

  const framework = document.querySelector("[data-brief-framework]");
  if (framework) {
    framework.innerHTML = `
      <span class="brief-card-label">JUDGMENT FRAMEWORK</span>
      <h3>AI 商业判断顺序</h3>
      <div class="brief-framework-graph" aria-label="信号、来源、证据、趋势、机会、风险和动态记录的关系图">
        <img src="assets/generated/brief-framework-evidence-imagegen.png" alt="来源、证据、趋势、机会和风险的研究材料图">
      </div>
      <div class="brief-watch-timeline">
        ${[["7D", "看客户案例是否继续出现"], ["30D", "看权限、审计和治理叙事"], ["90D", "看上线周期、模板复用率和事故成本"]].map(([time, text]) => `
          <div><span>${time}</span><p>${text}</p></div>
        `).join("")}
      </div>
    `;
  }

  const archive = document.querySelector("[data-brief-relations]");
  if (archive) {
    archive.innerHTML = briefArchiveItems().map((item) => `
      <article class="brief-archive-row">
        <span>${item.issue}</span>
        <div>
          <strong>${item.title}</strong>
          <p>${homeShort(item.line, 108)}</p>
        </div>
        <em>${item.tag}</em>
      </article>
    `).join("");
  }

  const subscription = document.querySelector("[data-brief-subscription]");
  if (subscription) {
    const rights = ["每期完整内参", "趋势热力变化", "证据与来源摘要", "趋势判断", "风险信息", "往期判断追踪"];
    subscription.innerHTML = `
      <span class="brief-card-label">SUBSCRIPTION</span>
      <h2>成为会员，持续阅读 AI 商业判断。</h2>
      <p>观澜AI不追求信息更多，而是把变化压缩成能讨论、能追踪、能回看的判断。</p>
      <ul>${rights.map((item) => `<li>${item}</li>`).join("")}</ul>
      <div class="brief-subscription-actions">
        <a class="button primary" href="register.html">申请商业内参访问</a>
        <a class="button secondary" href="pricing.html">查看会员权益</a>
      </div>
    `;
  }
}

function mountSignalDetail() {
  const root = document.querySelector("[data-signal-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id") || "agent-control-plane";
  const allSignals = data.contentIndex?.signals || data.signals;
  const signal = allSignals.find((item) => item.slug === slug) || data.signals.find((item) => item.slug === slug) || data.signals[0];
  const related = relatedAssets(signal, "signal");
  const pointAssets = related.point || [];
  const pointSection = pointAssets.length
    ? `<div class="asset-grid">${pointAssets.map((item, index) => pointCard(item, index)).join("")}</div>`
    : `<p>${signal.calibration || "这些观点可作为补充视角，不替代事实来源。"}</p>`;
  const analysisSection = signal.analysis?.length
    ? `<div class="dimension-grid">
          ${signal.analysis.map(([label, text]) => `<div class="dimension"><strong>${label}</strong><span>${text}</span></div>`).join("")}
        </div>`
    : "<p>暂无可展示的趋势判断。</p>";
  root.innerHTML = `
    <article class="article">
      <span class="eyebrow">Signal</span>
      <h1>${signal.title}</h1>
      <p class="article-lede">${summaryText(signal)}</p>
      <div class="article-section">
        <h2>一句话判断</h2>
        <div class="judgment-box">${signal.judgment}</div>
      </div>
      <div class="article-section">
        <h2>趋势判断</h2>
        ${analysisSection}
      </div>
      ${signalCaseEvidenceSection(signal)}
      <div class="article-section">
        <h2>前沿观点</h2>
        ${pointSection}
      </div>
      <div class="article-section">
        <h2>仍需留意</h2>
        <p>${signal.counter}</p>
      </div>
      <div class="article-section">
        <h2>相关观察</h2>
        ${relationPanel(signal, "signal") || "<p>暂时没有更多相关观察。</p>"}
      </div>
    </article>
    <aside class="side-rail">
      <h2>阅读侧记</h2>
      <dl>
        <div><dt>日期</dt><dd>${data.meta.date}</dd></div>
        <div><dt>适合关注</dt><dd>${signal.audience}</dd></div>
        <div><dt>信息来源</dt><dd>${signal.sources}</dd></div>
        <div><dt>延伸阅读</dt><dd><a href="${data.trendReport.link}">${data.trendReport.title}</a></dd></div>
        ${groupedTagList(signal)}
      </dl>
    </aside>
  `;
}

function mountDailyDetail() {
  const root = document.querySelector("[data-daily-detail]");
  if (!root) return;
  const issue = selectedDailyIssue();
  const dailyContent = selectedDailyContent(issue);
  const signals = selectedDailySignals(issue);
  const builderViews = exactDailyPoints(issue).slice(0, 4);
  const trendReports = selectedDailyTrendReports(issue).slice(0, 2);
  const profile = dailyObservationProfile(dailyContent, signals);
  const dateLabel = dailyDateLabel(issue.label || issue.date || data.meta.date);
  const dailyTitle = cleanText(dailyContent.title || data.daily?.title || "今日观察");
  const paragraphHtml = (text = "") => {
    const source = cleanText(text);
    if (!source) return "";
    return source
      .split(/(?<=。|！|？)\s+(?=[^，。！？]{6,})/u)
      .map((item) => cleanText(item))
      .filter(Boolean)
      .map((item) => `<p>${item}</p>`)
      .join("");
  };
  const sourceLinksHtml = (body = "") => {
    const rows = String(body || "")
      .split(/\n+/u)
      .map((line) => line.trim())
      .map((line) => line.replace(/^-\s*/u, ""))
      .map((line) => {
        const match = line.match(/^(.+?)[：:]\s*(https?:\/\/\S+)$/u);
        if (!match) return null;
        const label = cleanText(match[1]);
        const url = match[2].trim();
        let domain = "阅读原文";
        try {
          domain = new URL(url).hostname.replace(/^www\./u, "");
        } catch {
          domain = "阅读原文";
        }
        return { label, url, domain };
      })
      .filter(Boolean);
    if (!rows.length) return paragraphHtml(body);
    return `
      <div class="daily-detail-source-links">
        ${rows.map((row) => `
          <a href="${safeAttribute(row.url)}" target="_blank" rel="noopener noreferrer">
            <strong>${row.label}</strong>
            <span>${row.domain} ↗</span>
          </a>
        `).join("")}
      </div>
    `;
  };
  const sourceSections = Array.isArray(dailyContent.sections) ? dailyContent.sections : [];
  const articleIntro = (dailyContent.summary || []).slice(0, 3).map(paragraphHtml).join("");
  const articleSections = sourceSections
    .filter((section) => section.title && !/^今日观察/u.test(section.title))
    .map((section) => `
      <h2>${section.title}</h2>
      ${/相关原文|参考来源|原文链接/u.test(section.title) ? sourceLinksHtml(section.body) : paragraphHtml(section.body)}
    `)
    .join("");
  const articleBody = articleIntro || articleSections
    ? `${articleIntro}${articleSections}`
    : `<p>${profile.body}</p><p>${profile.impact}</p>`;
  const signalRows = signals.slice(0, 5).map((signal, index) => {
    const href = signal.link || (signal.slug ? `signal-detail.html?id=${encodeURIComponent(signal.slug)}` : "signals.html");
    return `
      <a class="daily-detail-signal-row" href="${safeAttribute(href)}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${homeShort(cleanText(signal.title || signal.name || dailySignalShortTitle(signal) || homeDailyFeaturedTitle(signal, index)), 58)}</strong>
          <p>${homeShort(homeDailyCardBody(signal), 132)}</p>
          <small>${compactJoin([homeSourceTime(signal), signal.sourceTier], "来源信息整理中")}</small>
        </div>
      </a>
    `;
  }).join("");
  const builderRows = builderViews.map((item, index) => {
    const identity = dailyPointDisplayIdentity(item);
    const sourceLabel = pointSourceLabel(item);
    return `
      <a class="daily-detail-point-row" href="${safeAttribute(dailyPointHref(item))}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${identity.name}</strong>
          <em>${homeShort(cleanText(identity.title || sourceLabel), 34)}</em>
          <p>${homeShort(dailyPointKeyLine(item), 96)}</p>
        </div>
      </a>
    `;
  }).join("");
  const trendCards = trendReports.length ? `
    <section class="daily-detail-side-card">
      <span>TREND</span>
      <h2>趋势追踪</h2>
        ${trendReports.map((item) => `
          <a href="${trendReportHref(item)}">
            <span>${trendReportId(item)}</span>
            <strong>${trendReportSafeText(item.title)}</strong>
            <p>${homeShort(trendReportSafeText(item.oneLine || summaryText(item)), 132)}</p>
          </a>
        `).join("")}
    </section>
  ` : "";
  root.innerHTML = `
    <article class="article daily-detail-article">
      <span class="eyebrow">Daily Observation / ${dateLabel}</span>
      <h1>${dailyTitle.replace(/^今日观察[｜|]\s*/u, "")}</h1>
      <div class="daily-detail-prose">
        ${articleBody}
      </div>
    </article>
    <aside class="side-rail daily-detail-rail">
      <section class="daily-detail-side-card">
        <span>NOTE</span>
        <h2>阅读信息</h2>
        <dl>
          <div><dt>日期</dt><dd>${dateLabel}</dd></div>
          <div><dt>类型</dt><dd>今日观察长文</dd></div>
          <div><dt>商业信号</dt><dd>${signals.length} 条</dd></div>
          <div><dt>前沿观点</dt><dd>${exactDailyPoints(issue).length} 条</dd></div>
        </dl>
      </section>
      <section class="daily-detail-side-card daily-detail-point-card">
        <span>POINTS</span>
        <h2>前沿观点</h2>
        <div class="daily-detail-point-list">${builderRows || "<p>暂无可展示前沿观点。</p>"}</div>
      </section>
      <section class="daily-detail-side-card">
        <span>SIGNALS</span>
        <h2>商业信号</h2>
        <div class="daily-detail-signal-list">${signalRows || "<p>暂无可展示变化卡。</p>"}</div>
      </section>
      ${trendCards}
    </aside>
  `;
}

function mountTrendReportDetail() {
  const root = document.querySelector("[data-trend-report-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const trendReport = data.contentIndex?.trendReports?.find((item) => item.slug === slug) || data.trendReport;
  const related = relatedAssets(trendReport, "trendReport");
  const trendItems = (related.trend || []).slice(0, 2);
  const pointItems = (related.point || []).slice(0, 2);
  const signalItems = (related.signal || []).slice(0, 3);
  const caseItems = (related.case?.length ? related.case : []).slice(0, 2);
  const variables = trendReportVariableItems(trendReport);
  const section = (names, title, fallback) => `
    <div class="article-section">
      <h2>${title}</h2>
      ${articleText(textFromSection(trendReport, names, fallback))}
    </div>
  `;
  root.innerHTML = `
    <article class="article trend-report-report">
      <span class="eyebrow">Trend Report</span>
      <h1>${trendReport.title}</h1>
      <p class="article-lede">${trendReport.oneLine}</p>
      <div class="article-section">
        <h2>一句话观察</h2>
        <div class="judgment-box">${trendReport.oneLine || summaryText(trendReport)}</div>
      </div>
      ${section(["触发信号", "变化背景"], "变化背景", "相关变化正在从单点发布走向流程、客户和交付层面的连续观察。")}
      ${section(["具体问题", "首要感受者"], "问题与对象", "这个方向会先影响那些流程清楚、客户响应压力大的组织。")}
      ${section(["流程变化"], "流程变化", "流程正在从人工接力转向 AI 参与接待、识别、分发、复核和兜底。")}
      ${section(["价值来源"], "价值来源", "价值来自响应效率、服务一致性和可复用交付能力。")}
      <div class="article-section">
        <h2>趋势背景</h2>
        <div class="trend-report-evidence-stack">
          ${trendItems.map((item) => `<p><strong>${item.title}</strong>${cleanText(item.judgment || item.oneLine || summaryText(item))}</p>`).join("") || articleText(textFromSection(trendReport, ["趋势"], "同类材料仍在积累，暂不强行画图。"))}
        </div>
      </div>
      <div class="article-section">
        <h2>前沿观点</h2>
        <div class="trend-report-evidence-stack">
          ${pointItems.map((item) => `<p><strong>${item.title}</strong>${cleanText(item.calibrates || item.interpretation || summaryText(item))}</p>`).join("") || articleText(textFromSection(trendReport, ["观点"], "外部观点只作为判断参照，不替代事实来源。"))}
        </div>
      </div>
      <div class="article-section">
        <h2>触发信号</h2>
        <div class="trend-report-evidence-stack">
          ${signalItems.map((item) => `
            <p><strong>${dailySignalShortTitle(item)}</strong>${signalEventLine(item, 128)}</p>
          `).join("") || "<p>暂无可展示触发信号。</p>"}
        </div>
      </div>
      <div class="article-section">
        <h2>相关案例</h2>
        <div class="trend-report-evidence-stack">
          ${caseItems.map((item) => `
            <p><strong>${item.title || dailySignalShortTitle(item)}</strong>${signalBusinessLine(item, 128) || summaryText(item)}</p>
          `).join("") || "<p>暂无可展示案例。</p>"}
        </div>
      </div>
      <div class="article-section">
        <h2>商业变量</h2>
        <ul class="article-list">${variables.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="article-section">
        <h2>相关内容</h2>
        ${relationPanel(trendReport, "trendReport") || "<p>暂时没有更多相关观察。</p>"}
      </div>
    </article>
    <aside class="side-rail">
      <h2>报告信息</h2>
      <dl>
        <div><dt>发布时间</dt><dd>${trendReport.updated}</dd></div>
        <div><dt>材料状态</dt><dd>${trendReportEvidenceState(trendReport)}</dd></div>
        <div><dt>适合关注</dt><dd>${trendReportAudience(trendReport)}</dd></div>
        <div><dt>相关变量</dt><dd>${trendRadarVariables(trendReport)}</dd></div>
        ${groupedTagList(trendReport)}
      </dl>
    </aside>
  `;
}

function mountAdminV2() {
  const root = document.querySelector("[data-admin-v2]");
  if (!root) return;

  const panels = Array.from(root.querySelectorAll("[data-admin-panel]"));
  const tabs = Array.from(root.querySelectorAll("[data-admin-tab]"));
  const currentTitle = root.querySelector("[data-admin-current-title]");
  const currentKicker = root.querySelector("[data-admin-current-kicker]");
  const moduleMeta = {
    dashboard: ["OPERATIONS DASHBOARD", "项目统计"],
    content: ["CONTENT MANAGER", "内容管理"],
    members: ["MEMBERS", "用户与权限"],
    invites: ["INVITE CODES", "邀请码"],
    orders: ["ORDERS", "订阅与订单"],
    quality: ["QUALITY", "质量检查"],
    settings: ["SETTINGS", "系统设置"],
  };
  const showPanel = (name) => {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.adminPanel !== name;
    });
    tabs.forEach((tab) => {
      const active = tab.dataset.adminTab === name;
      tab.setAttribute("aria-current", String(active));
    });
    if (currentKicker) currentKicker.textContent = moduleMeta[name]?.[0] || "";
    if (currentTitle) currentTitle.textContent = moduleMeta[name]?.[1] || "";
  };
  tabs.forEach((tab) => tab.addEventListener("click", () => showPanel(tab.dataset.adminTab)));
  showPanel("dashboard");

  const content = window.WaveSightContent || {};
  const index = content.contentIndex || {};
  const counts = {
    daily: Array.isArray(index.dates) ? index.dates.length : Array.isArray(content.dailyBriefs) ? content.dailyBriefs.length : content.daily ? 1 : 0,
    signals: (index.signals?.length || 0) + (index.frontSignals?.length || 0),
    trendReports: index.trendReports?.length || 0,
    knowledge: (index.points?.length || 0) + (index.trends?.length || 0) + (content.tagTaxonomy?.length || 0),
  };

  Object.entries(counts).forEach(([key, value]) => {
    const target = root.querySelector(`[data-admin-count="${key}"]`);
    if (target) target.textContent = String(value);
  });

  const storedInvites = (() => {
    try {
      return JSON.parse(window.localStorage?.getItem("wavesight-admin-invite-codes") || "[]");
    } catch {
      return [];
    }
  })();
  const memberStateForDashboard = getMemberState();
  const dashboardMetrics = [
    ["UV", 1286, "+12.4%"],
    ["PV", 6420, "+18.7%"],
    ["会员数", memberStateForDashboard === "member" ? 238 : 237, "+9"],
    ["付费数", memberStateForDashboard === "member" ? 86 : 85, "+4"],
    ["付费转化", "6.6%", "+0.8pp"],
    ["邀请码", storedInvites.length, `${storedInvites.filter((item) => item.status === "active").length} active`],
  ];
  const kpiRoot = root.querySelector("[data-admin-kpis]");
  if (kpiRoot) {
    kpiRoot.innerHTML = dashboardMetrics.map(([label, value, delta]) => `
      <article>
        <span>${safeHtml(label)}</span>
        <strong>${safeHtml(value)}</strong>
        <em>${safeHtml(delta)}</em>
      </article>
    `).join("");
  }
  const traffic = [820, 940, 1060, 1188, 1104, 1240, 1286];
  const trafficRoot = root.querySelector("[data-admin-traffic-chart]");
  if (trafficRoot) {
    const max = Math.max(...traffic);
    trafficRoot.innerHTML = traffic.map((value, index) => `
      <span style="height:${Math.max(12, Math.round((value / max) * 100))}%">
        <i>${safeHtml(value)}</i>
        <b>${index + 1}</b>
      </span>
    `).join("");
  }
  const funnelRoot = root.querySelector("[data-admin-funnel]");
  if (funnelRoot) {
    const funnel = [["访问", 6420], ["注册", 237], ["会员", 86], ["付费", 85]];
    const max = funnel[0][1];
    funnelRoot.innerHTML = funnel.map(([label, value]) => `
      <div>
        <span>${safeHtml(label)}</span>
        <strong>${safeHtml(value)}</strong>
        <i style="width:${Math.max(8, Math.round((value / max) * 100))}%"></i>
      </div>
    `).join("");
  }
  const assetRoot = root.querySelector("[data-admin-assets]");
  if (assetRoot) {
    const assets = [["今日观察", counts.daily], ["商业信号", counts.signals], ["趋势追踪", counts.trendReports], ["判断资产", counts.knowledge]];
    const max = Math.max(...assets.map(([, value]) => Number(value) || 0), 1);
    assetRoot.innerHTML = assets.map(([label, value]) => `
      <div>
        <span>${safeHtml(label)}</span>
        <strong>${safeHtml(value)}</strong>
        <i style="width:${Math.max(8, Math.round((value / max) * 100))}%"></i>
      </div>
    `).join("");
  }
  const opsRoot = root.querySelector("[data-admin-ops]");
  if (opsRoot) {
    const ops = [
      ["今日观察", counts.daily],
      ["内容更新", counts.signals + counts.trendReports],
      ["会员状态", memberStateForDashboard],
      ["付费方案", "月度 / 年度"],
    ];
    opsRoot.innerHTML = ops.map(([label, value]) => `<div><span>${safeHtml(label)}</span><strong>${safeHtml(value)}</strong></div>`).join("");
  }

  const generated = cleanText(content.meta?.generatedAt || content.meta?.date || "");
  const generatedTarget = root.querySelector("[data-admin-generated]");
  if (generatedTarget) generatedTarget.textContent = generated ? `内容索引 ${generated}` : "未读取到内容索引";

  const total = counts.daily + counts.signals + counts.trendReports + counts.knowledge;
  const status = root.querySelector("[data-admin-primary-status]");
  const statusCopy = root.querySelector("[data-admin-primary-copy]");
  if (status) status.textContent = total > 0 ? "可进入今日复核" : "内容索引不可用";
  if (statusCopy) {
    statusCopy.textContent = total > 0
      ? "当前数据可支撑内部状态预览，发布仍需完成语法检查、桌面截图和独立质检。"
      : "请检查 V2 内容索引是否生成。";
  }

  const sourceRoot = root.querySelector("[data-admin-sources]");
  if (sourceRoot) {
    const sourceItems = [
      ["官方 / 研究 / 监管", "适合作为主支撑", "优先回看原始 URL 与发布时间。"],
      ["A 级媒体 / 财报 / 融资", "可作为商业变化证据", "需要说明客户采用和商业化状态。"],
      ["AI HOT / follow-builders", "只作线索发现", "进入前台前必须二搜和重新分级。"],
    ];
    sourceRoot.innerHTML = sourceItems.map(([name, state, note]) => `
      <article>
        <strong>${name}</strong>
        <span>${state}</span>
        <p>${note}</p>
      </article>
    `).join("");
  }

  const release = root.querySelector("[data-admin-release='content']");
  if (release) release.textContent = total > 0 ? "内容索引已读取" : "等待内容索引";

  const draftKey = "wavesight-admin-content-drafts";
  const readDrafts = () => {
    try {
      return JSON.parse(window.localStorage?.getItem(draftKey) || "{}");
    } catch {
      return {};
    }
  };
  const writeDrafts = (drafts) => {
    window.localStorage?.setItem(draftKey, JSON.stringify(drafts));
  };
  const contentType = root.querySelector("[data-admin-content-type]");
  const contentSearch = root.querySelector("[data-admin-content-search]");
  const contentStatus = root.querySelector("[data-admin-content-status]");
  const contentItemsRoot = root.querySelector("[data-admin-content-items]");
  const contentCount = root.querySelector("[data-admin-content-count]");
  const contentForm = root.querySelector("[data-admin-content-form]");
  const draftState = root.querySelector("[data-admin-content-draft-state]");
  const cmsToolbar = root.querySelector(".admin-v2-cms-toolbar");
  const cmsLayout = root.querySelector(".admin-v2-cms-layout");
  const editorPage = root.querySelector("[data-admin-editor-page]");
  const sectionEditor = root.querySelector("[data-admin-section-editor]");
  const contentGroups = {
    dates: index.dates || [],
    signals: index.signals || [],
    trendReports: index.trendReports || [],
    points: index.points || [],
    trends: index.trends || [],
  };
  const contentLabels = {
    dates: "今日观察",
    signals: "商业信号",
    trendReports: "趋势追踪",
    points: "前沿观点",
    trends: "趋势背景",
  };
  const itemKey = (type, item, fallbackIndex = 0) => `${type}:${item.id || item.slug || item.date || fallbackIndex}`;
  const itemSummary = (item) => cleanText(item.dek || item.brief || item.judgment || item.oneLine || item.calibrates || item.evidenceGaps || "");
  const itemSources = (item) => cleanText(Array.isArray(item.sources) ? item.sources.join("\n") : item.sources || item.sourceUrl || item.sourcePath || "");
  const itemRelations = (item) => cleanText(Array.isArray(item.relations) ? item.relations.join("\n") : item.relationFields || "");
  const itemTagsText = (item) => (item.tags || []).map((tag) => cleanText(tag.name || tag)).filter(Boolean).join("\n");
  const itemCounter = (item) => cleanText(item.counter || item.evidenceGaps || item.gaps || "");
  const itemSections = (item) => {
    if (Array.isArray(item.sections) && item.sections.length) {
      return item.sections.map((section, index) => ({
        title: cleanText(Array.isArray(section) ? section[0] : section.title || `模块 ${index + 1}`),
        body: cleanText(Array.isArray(section) ? section[1] : section.body || section.content || ""),
      }));
    }
    const pairs = [
      ["事实背景", item.background],
      ["商业判断", item.judgment || item.oneLine],
      ["前沿观点", item.calibration || item.calibrates || item.interpretation],
      ["材料缺口", item.counter || item.evidenceGaps],
    ].filter(([, value]) => cleanText(value));
    return pairs.map(([title, body]) => ({ title, body: cleanText(body) }));
  };
  const openEditorPage = () => {
    if (cmsToolbar) cmsToolbar.hidden = true;
    if (cmsLayout) cmsLayout.hidden = true;
    if (editorPage) editorPage.hidden = false;
  };
  const closeEditorPage = () => {
    if (cmsToolbar) cmsToolbar.hidden = false;
    if (cmsLayout) cmsLayout.hidden = false;
    if (editorPage) editorPage.hidden = true;
  };
  const applyDraft = (type, item, fallbackIndex = 0) => {
    const key = itemKey(type, item, fallbackIndex);
    return { ...item, ...(readDrafts()[key] || {}), __draftKey: key };
  };
  const fillContentForm = (type, item) => {
    if (!contentForm) return;
    const key = item.__draftKey;
    contentForm.elements.key.value = key;
    contentForm.elements.title.value = cleanText(item.title || item.label || "");
    contentForm.elements.summary.value = itemSummary(item);
    contentForm.elements.status.value = item.status || "review";
    contentForm.elements.note.value = item.note || "";
    if (contentForm.elements.date) contentForm.elements.date.value = cleanText(item.date || item.updated || "");
    if (contentForm.elements.sources) contentForm.elements.sources.value = itemSources(item);
    if (contentForm.elements.relations) contentForm.elements.relations.value = itemRelations(item);
    if (contentForm.elements.tags) contentForm.elements.tags.value = itemTagsText(item);
    if (contentForm.elements.counter) contentForm.elements.counter.value = itemCounter(item);
    if (sectionEditor) {
      const sections = itemSections(item);
      sectionEditor.innerHTML = sections.length ? sections.map((section, index) => `
        <article class="admin-v2-section-edit">
          <label>
            <span>模块标题</span>
            <input name="sectionTitle${index}" value="${safeAttribute(section.title)}">
          </label>
          <label>
            <span>已有内容</span>
            <textarea name="sectionBody${index}" rows="6">${safeHtml(section.body)}</textarea>
          </label>
        </article>
      `).join("") : `<div class="admin-v2-content-empty">暂无正文模块。</div>`;
    }
    if (draftState) draftState.textContent = readDrafts()[key] ? "本机草稿" : "原始内容";
    openEditorPage();
  };
  const renderContentItems = () => {
    const type = contentType?.value || "signals";
    const query = cleanText(contentSearch?.value || "").toLowerCase();
    const statusFilter = contentStatus?.value || "all";
    const drafts = readDrafts();
    const items = (contentGroups[type] || []).map((item, itemIndex) => applyDraft(type, item, itemIndex));
    const filtered = items.filter((item) => {
      const haystack = cleanText(`${item.title || item.label || ""} ${item.date || ""} ${itemSummary(item)}`).toLowerCase();
      const status = item.status || "review";
      return (!query || haystack.includes(query)) && (statusFilter === "all" || status === statusFilter);
    });
    if (contentCount) contentCount.textContent = `${contentLabels[type]}：${filtered.length} / ${items.length} 条`;
    if (!contentItemsRoot) return;
    contentItemsRoot.innerHTML = filtered.length ? filtered.map((item) => `
      <button class="admin-v2-cms-row" type="button" data-admin-content-key="${safeAttribute(item.__draftKey)}" role="row">
        <span>
          <strong>${safeHtml(cleanText(item.title || item.label || "未命名内容"))}</strong>
          <small>${safeHtml(itemSummary(item).slice(0, 72) || "暂无摘要")}</small>
        </span>
        <span>${safeHtml(contentLabels[type])}</span>
        <span>${safeHtml(item.date || item.updated || "未标日期")}</span>
        <span><em>${safeHtml(item.status || "review")}</em>${drafts[item.__draftKey] ? "<i>草稿</i>" : ""}</span>
        <span>编辑</span>
      </button>
    `).join("") : `<div class="admin-v2-content-empty">没有找到匹配内容。</div>`;
  };

  contentType?.addEventListener("change", renderContentItems);
  contentSearch?.addEventListener("input", renderContentItems);
  contentStatus?.addEventListener("change", renderContentItems);
  contentItemsRoot?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-admin-content-key]");
    if (!button) return;
    const type = contentType?.value || "signals";
    const items = (contentGroups[type] || []).map((item, itemIndex) => applyDraft(type, item, itemIndex));
    const item = items.find((candidate) => candidate.__draftKey === button.dataset.adminContentKey);
    if (item) fillContentForm(type, item);
  });
  contentForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const key = contentForm.elements.key.value;
    if (!key) return;
    const drafts = readDrafts();
    drafts[key] = {
      title: cleanText(contentForm.elements.title.value),
      judgment: cleanText(contentForm.elements.summary.value),
      dek: cleanText(contentForm.elements.summary.value),
      oneLine: cleanText(contentForm.elements.summary.value),
      status: contentForm.elements.status.value,
      note: cleanText(contentForm.elements.note.value),
      date: cleanText(contentForm.elements.date?.value || ""),
      sources: cleanText(contentForm.elements.sources?.value || ""),
      relationFields: cleanText(contentForm.elements.relations?.value || ""),
      counter: cleanText(contentForm.elements.counter?.value || ""),
      tagsText: cleanText(contentForm.elements.tags?.value || ""),
      editedAt: new Date().toISOString(),
    };
    const sectionDrafts = Array.from(contentForm.querySelectorAll(".admin-v2-section-edit")).map((block, index) => [
      cleanText(contentForm.elements[`sectionTitle${index}`]?.value || ""),
      cleanText(contentForm.elements[`sectionBody${index}`]?.value || ""),
    ]).filter(([title, body]) => title || body);
    if (sectionDrafts.length) drafts[key].sections = sectionDrafts;
    writeDrafts(drafts);
    renderContentItems();
  });
  root.querySelector("[data-admin-content-reset]")?.addEventListener("click", () => {
    const key = contentForm?.elements.key.value;
    if (!key) return;
    const drafts = readDrafts();
    delete drafts[key];
    writeDrafts(drafts);
    renderContentItems();
  });
  root.querySelector("[data-admin-editor-back]")?.addEventListener("click", closeEditorPage);
  closeEditorPage();
  renderContentItems();

  const memberState = getMemberState();
  const memberCopy = {
    public: ["访客状态", "当前浏览器未记录登录或会员状态。"],
    "logged-in": ["已登录", "当前浏览器已记录账号，可继续查看账户与订阅路径。"],
    member: ["会员完整态", "当前浏览器已记录会员状态，可预览完整阅读层。"],
  }[memberState] || ["访客状态", "当前浏览器未记录登录或会员状态。"];
  const stateTarget = root.querySelector("[data-admin-member-state]");
  const copyTarget = root.querySelector("[data-admin-member-copy]");
  if (stateTarget) stateTarget.textContent = memberCopy[0];
  if (copyTarget) copyTarget.textContent = memberCopy[1];
  const userTarget = root.querySelector("[data-admin-member-user]");
  if (userTarget) {
    const user = getStoredUser();
    userTarget.textContent = user.email || user.name || "未登录";
  }

  const usersKey = "wavesight-admin-users";
  const defaultUsers = () => {
    const currentUser = getStoredUser();
    return [
      {
        id: "u-founder",
        name: "运营管理员",
        email: currentUser.email || "admin@wavesight.ai",
        role: "admin",
        membership: memberState,
        status: "active",
      },
      { id: "u-001", name: "林澈", email: "lin.chen@example.com", role: "editor", membership: "member", status: "active" },
      { id: "u-002", name: "周岩", email: "zhou.yan@example.com", role: "member", membership: "member", status: "active" },
      { id: "u-003", name: "许然", email: "xu.ran@example.com", role: "member", membership: "logged-in", status: "expired" },
      { id: "u-004", name: "顾宁", email: "gu.ning@example.com", role: "viewer", membership: "public", status: "paused" },
    ];
  };
  const readUsers = () => {
    try {
      const users = JSON.parse(window.localStorage?.getItem(usersKey) || "[]");
      return Array.isArray(users) && users.length ? users : defaultUsers();
    } catch {
      return defaultUsers();
    }
  };
  const writeUsers = (users) => window.localStorage?.setItem(usersKey, JSON.stringify(users));
  const userStatsRoot = root.querySelector("[data-admin-user-stats]");
  const userListRoot = root.querySelector("[data-admin-user-list]");
  const userFilter = root.querySelector("[data-admin-user-filter]");
  const renderUsers = () => {
    const users = readUsers();
    const filtered = users.filter((user) => (userFilter?.value || "all") === "all" || user.status === userFilter.value);
    if (userStatsRoot) {
      const stats = [
        ["用户数", users.length],
        ["管理员", users.filter((user) => user.role === "admin").length],
        ["会员", users.filter((user) => user.membership === "member").length],
        ["暂停", users.filter((user) => user.status === "paused").length],
      ];
      userStatsRoot.innerHTML = stats.map(([label, value]) => `<article><span>${safeHtml(label)}</span><strong>${safeHtml(value)}</strong></article>`).join("");
    }
    if (!userListRoot) return;
    userListRoot.innerHTML = filtered.map((user) => `
      <div class="admin-v2-user-row" role="row" data-admin-user-id="${safeAttribute(user.id)}">
        <span><strong>${safeHtml(user.name)}</strong><small>${safeHtml(user.email)}</small></span>
        <span>
          <select data-admin-user-field="role">
            ${["admin", "editor", "member", "viewer"].map((value) => `<option value="${value}" ${user.role === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </span>
        <span>
          <select data-admin-user-field="membership">
            ${["public", "logged-in", "member"].map((value) => `<option value="${value}" ${user.membership === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </span>
        <span>
          <select data-admin-user-field="status">
            ${["active", "paused", "expired"].map((value) => `<option value="${value}" ${user.status === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </span>
        <span><button type="button" data-admin-user-save>保存</button></span>
      </div>
    `).join("");
  };
  userFilter?.addEventListener("change", renderUsers);
  root.querySelector("[data-admin-user-seed]")?.addEventListener("click", () => {
    writeUsers(defaultUsers());
    renderUsers();
  });
  userListRoot?.addEventListener("click", (event) => {
    const save = event.target.closest("[data-admin-user-save]");
    if (!save) return;
    const row = save.closest("[data-admin-user-id]");
    const id = row?.dataset.adminUserId;
    const users = readUsers().map((user) => {
      if (user.id !== id) return user;
      return {
        ...user,
        role: row.querySelector('[data-admin-user-field="role"]').value,
        membership: row.querySelector('[data-admin-user-field="membership"]').value,
        status: row.querySelector('[data-admin-user-field="status"]').value,
      };
    });
    writeUsers(users);
    renderUsers();
  });
  renderUsers();

  const ordersKey = "wavesight-admin-orders";
  const defaultOrders = () => [
    { id: "o-20260511-01", name: "林澈", email: "lin.chen@example.com", plan: "monthly", amount: 99, date: "2026-05-11", status: "paid" },
    { id: "o-20260511-02", name: "周岩", email: "zhou.yan@example.com", plan: "yearly", amount: 799, date: "2026-05-11", status: "paid" },
    { id: "o-20260510-01", name: "许然", email: "xu.ran@example.com", plan: "monthly", amount: 99, date: "2026-05-10", status: "pending" },
    { id: "o-20260509-01", name: "顾宁", email: "gu.ning@example.com", plan: "yearly", amount: 799, date: "2026-05-09", status: "paid" },
    { id: "o-20260508-01", name: "陈默", email: "chen.mo@example.com", plan: "monthly", amount: 99, date: "2026-05-08", status: "refunded" },
    { id: "o-20260507-01", name: "王屿", email: "wang.yu@example.com", plan: "monthly", amount: 99, date: "2026-05-07", status: "paid" },
  ];
  const readOrders = () => {
    try {
      const orders = JSON.parse(window.localStorage?.getItem(ordersKey) || "[]");
      return Array.isArray(orders) && orders.length ? orders : defaultOrders();
    } catch {
      return defaultOrders();
    }
  };
  const writeOrders = (orders) => window.localStorage?.setItem(ordersKey, JSON.stringify(orders));
  const orderStatsRoot = root.querySelector("[data-admin-order-stats]");
  const orderTrendRoot = root.querySelector("[data-admin-order-trend]");
  const orderPlansRoot = root.querySelector("[data-admin-order-plans]");
  const orderListRoot = root.querySelector("[data-admin-order-list]");
  const orderFilter = root.querySelector("[data-admin-order-filter]");
  const renderOrders = () => {
    const orders = readOrders();
    const paidOrders = orders.filter((order) => order.status === "paid");
    const planGroups = paidOrders.reduce((acc, order) => {
      acc[order.plan] ||= { count: 0, amount: 0 };
      acc[order.plan].count += 1;
      acc[order.plan].amount += Number(order.amount) || 0;
      return acc;
    }, {});
    const totalAmount = paidOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const stats = [
      ["付费会员", paidOrders.length],
      ["分类数", Object.keys(planGroups).length],
      ["总金额", `¥${totalAmount}`],
      ["月度金额", `¥${planGroups.monthly?.amount || 0}`],
      ["年度金额", `¥${planGroups.yearly?.amount || 0}`],
    ];
    if (orderStatsRoot) {
      orderStatsRoot.innerHTML = stats.map(([label, value]) => `<article><span>${safeHtml(label)}</span><strong>${safeHtml(value)}</strong></article>`).join("");
    }
    if (orderTrendRoot) {
      const days = ["2026-05-07", "2026-05-08", "2026-05-09", "2026-05-10", "2026-05-11"];
      const values = days.map((day) => paidOrders.filter((order) => order.date === day).reduce((sum, order) => sum + order.amount, 0));
      const max = Math.max(...values, 1);
      orderTrendRoot.innerHTML = values.map((value, index) => `
        <span style="height:${Math.max(12, Math.round((value / max) * 100))}%">
          <i>¥${safeHtml(value)}</i>
          <b>${index + 7}</b>
        </span>
      `).join("");
    }
    if (orderPlansRoot) {
      const planRows = [["monthly", planGroups.monthly?.amount || 0], ["yearly", planGroups.yearly?.amount || 0]];
      const max = Math.max(...planRows.map(([, value]) => value), 1);
      orderPlansRoot.innerHTML = planRows.map(([label, value]) => `
        <div>
          <span>${safeHtml(label)}</span>
          <strong>¥${safeHtml(value)}</strong>
          <i style="width:${Math.max(8, Math.round((value / max) * 100))}%"></i>
        </div>
      `).join("");
    }
    const filtered = orders.filter((order) => (orderFilter?.value || "all") === "all" || order.status === orderFilter.value);
    if (orderListRoot) {
      orderListRoot.innerHTML = filtered.map((order) => `
        <div class="admin-v2-order-row" role="row" data-admin-order-id="${safeAttribute(order.id)}">
          <span><strong>${safeHtml(order.name)}</strong><small>${safeHtml(order.email)}</small></span>
          <span>${safeHtml(order.plan)}</span>
          <span>¥${safeHtml(order.amount)}</span>
          <span>${safeHtml(order.date)}</span>
          <span>
            <select data-admin-order-status>
              ${["paid", "pending", "refunded"].map((value) => `<option value="${value}" ${order.status === value ? "selected" : ""}>${value}</option>`).join("")}
            </select>
          </span>
          <span><button type="button" data-admin-order-save>保存</button></span>
        </div>
      `).join("");
    }
  };
  orderFilter?.addEventListener("change", renderOrders);
  orderListRoot?.addEventListener("click", (event) => {
    const save = event.target.closest("[data-admin-order-save]");
    if (!save) return;
    const row = save.closest("[data-admin-order-id]");
    const id = row?.dataset.adminOrderId;
    const orders = readOrders().map((order) => order.id === id ? { ...order, status: row.querySelector("[data-admin-order-status]").value } : order);
    writeOrders(orders);
    renderOrders();
  });
  renderOrders();

  const inviteKey = "wavesight-admin-invite-codes";
  const readInvites = () => {
    try {
      return JSON.parse(window.localStorage?.getItem(inviteKey) || "[]");
    } catch {
      return [];
    }
  };
  const writeInvites = (items) => {
    window.localStorage?.setItem(inviteKey, JSON.stringify(items));
  };
  const inviteList = root.querySelector("[data-admin-invite-list]");
  const inviteStatus = root.querySelector("[data-admin-invite-status]");
  const renderInvites = () => {
    const invites = readInvites();
    if (inviteStatus) inviteStatus.textContent = invites.length ? `本机已有 ${invites.length} 个邀请码。` : "本机暂无邀请码。";
    if (!inviteList) return;
    inviteList.innerHTML = invites.length ? invites.map((item) => `
      <article>
        <div>
          <strong>${safeHtml(item.code)}</strong>
          <span>${safeHtml(item.status)} · ${safeHtml(item.note || "未备注")}</span>
        </div>
        <p>生成 ${safeHtml(item.createdAt)} / 到期 ${safeHtml(item.expiresAt)}</p>
        <button type="button" data-admin-invite-toggle="${safeAttribute(item.code)}">${item.status === "paused" ? "恢复" : "暂停"}</button>
      </article>
    `).join("") : `
      <article class="is-empty">
        <div>
          <strong>还没有邀请码</strong>
          <span>生成后会显示在这里</span>
        </div>
        <p>当前只保存在这台设备的浏览器里。</p>
      </article>
    `;
  };

  root.querySelector("[data-admin-invite-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const count = Math.max(1, Math.min(20, Number(formData.get("count") || 1)));
    const days = Math.max(1, Math.min(365, Number(formData.get("days") || 30)));
    const note = cleanText(formData.get("note") || "");
    const now = new Date();
    const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const existing = readInvites();
    const nextItems = Array.from({ length: count }, () => {
      const chunk = Math.random().toString(36).slice(2, 6).toUpperCase();
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      return {
        code: `GLAI-${chunk}-${suffix}`,
        status: "active",
        note,
        createdAt: now.toISOString().slice(0, 10),
        expiresAt: expires.toISOString().slice(0, 10),
      };
    });
    writeInvites([...nextItems, ...existing]);
    event.currentTarget.reset();
    renderInvites();
  });

  root.querySelector("[data-admin-invite-clear]")?.addEventListener("click", () => {
    writeInvites([]);
    renderInvites();
  });

  inviteList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-admin-invite-toggle]");
    if (!button) return;
    const code = button.dataset.adminInviteToggle;
    const invites = readInvites().map((item) => item.code === code
      ? { ...item, status: item.status === "paused" ? "active" : "paused" }
      : item);
    writeInvites(invites);
    renderInvites();
  });
  renderInvites();
}

function mountFrontSignalDetail() {
  const root = document.querySelector("[data-front-signal-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const all = signalAllAssets();
  const signal = all.find((item) => item.slug === slug || item.id === slug) || data.signals?.[0] || {};
  const front = signalFrontend(signal);
  const typeLabel = signalTypeLabel(signal.signalType || signal.type);
  const primarySource = signalPrimarySource(signal);
  const title = front.displayTitle || signal.title || "商业变化";
  const sourceUrl = primarySource.url || signal.sourceUrl || signal.source_url || "#";
  const isCase = signalTypeKey(signal) === "case";
  const sourceExcerpt = signalSourceExcerpt(signal, 520);
  const summary = sourceExcerpt || signalNewsSummary(signal, 360);
  const comment = signalBusinessLine(signal, 260) || signalWhyLine(signal, 260) || "这条变化值得放到企业流程、采购预算和产品交付中继续比较。";
  const breakdownRows = signalCaseBreakdown(signal);
  const variables = signalBusinessVariables(signal);
  const similarCases = signalSimilarCases(signal, 3);
  const relatedSignals = signalRelatedSignalRows(signal, 4);
  const tags = signalTagNames(signal, 6);
  const quietMeta = [
    ["日期", signalSystemDate(signal.date)],
    ["类型", typeLabel],
    ["主体", signalSubjectName(signal)],
  ].filter(([, value]) => value);
  const trendLines = [
    signalBusinessLine(signal, 240),
    signalWhyLine(signal, 220),
    front.techRouteMeaning ? frontstageFactText(front.techRouteMeaning) : "",
  ].filter(Boolean);

  root.innerHTML = `
    <article class="case-study-page">
      <header class="case-study-hero">
        <div class="case-study-hero-main">
          <a class="case-study-back" href="signals.html">商业信号</a>
          <p class="case-study-kicker">${safeHtml(typeLabel)} · ${safeHtml(signalSystemDate(signal.date))}</p>
          <h1>${reportTitleHtml(title)}</h1>
          <section class="case-study-lead">
            <span>${sourceExcerpt ? "原文摘录" : "新闻摘要"}</span>
            <p>${safeHtml(summary)}</p>
          </section>
          <section class="case-study-comment">
            <span>观澜解读</span>
            <p>${safeHtml(comment)}</p>
          </section>
        </div>
        <aside class="case-study-rail">
          <span>${isCase ? "案例索引" : "信号索引"}</span>
          <strong>${safeHtml(signalSubjectName(signal))}</strong>
          <dl>
            ${quietMeta.map(([label, value]) => `<div><dt>${safeHtml(label)}</dt><dd>${safeHtml(value)}</dd></div>`).join("")}
            ${primarySource.name ? `<div><dt>来源</dt><dd>${safeHtml(primarySource.name)}</dd></div>` : ""}
          </dl>
          ${tags.length ? `
            <div class="case-study-tags">
              ${tags.map((tag) => `<a href="signals.html?tag=${encodeURIComponent(tag)}">${safeHtml(tag)}</a>`).join("")}
            </div>
          ` : ""}
          <div class="case-study-actions">
            ${sourceUrl !== "#" ? `<a class="is-primary" href="${safeAttribute(sourceUrl)}" target="_blank" rel="noreferrer">阅读原文</a>` : ""}
            <a href="signals.html">返回列表</a>
          </div>
        </aside>
      </header>

      <main class="case-study-main">
        <section class="case-study-section">
          <div class="case-study-section-title">
            <span>事实</span>
            <h2>发生了什么</h2>
          </div>
          <div class="case-study-facts">
            ${breakdownRows.map(([label, value]) => `
              <div>
                <span>${safeHtml(label)}</span>
                <strong>${safeHtml(value)}</strong>
              </div>
            `).join("")}
          </div>
        </section>

        ${variables.length ? `
          <section class="case-study-section case-study-section-split">
            <div class="case-study-section-title">
              <span>变量</span>
              <h2>流程与影响</h2>
            </div>
            <div class="case-study-variable-list">
              ${variables.map((item) => `
                <article>
                  <h3>${safeHtml(item.label)}</h3>
                  <p>${safeHtml(item.body)}</p>
                </article>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <section class="case-study-section case-study-related">
          <div class="case-study-section-title">
            <span>对照</span>
            <h2>同类变化</h2>
          </div>
          <div class="case-study-related-grid">
            <div>
              <h3>案例对照</h3>
              ${similarCases.length ? similarCases.map((item, index) => `
                <a href="${safeAttribute(signalHref(item))}">
                  <span>${String(index + 1).padStart(2, "0")} · ${safeHtml(signalSystemDate(item.date))}</span>
                  <strong>${safeHtml(dailySignalShortTitle(item))}</strong>
                  <p>${safeHtml(signalNewsSummary(item, 118))}</p>
                </a>
              `).join("") : `<p>暂无同类案例。</p>`}
            </div>
            <div>
              <h3>信号延展</h3>
              ${relatedSignals.length ? relatedSignals.map(({ item }, index) => `
                <a href="${safeAttribute(signalHref(item))}">
                  <span>${String(index + 1).padStart(2, "0")} · ${safeHtml(signalTypeLabel(item.signalType || item.type))}</span>
                  <strong>${safeHtml(dailySignalShortTitle(item))}</strong>
                  <p>${safeHtml(signalNewsSummary(item, 118))}</p>
                </a>
              `).join("") : `<p>暂无相关变化。</p>`}
            </div>
          </div>
        </section>

        <section class="case-study-section case-study-trend">
          <div class="case-study-section-title">
            <span>趋势</span>
            <h2>趋势线索</h2>
          </div>
          <div>
            ${(trendLines.length ? trendLines : [comment]).slice(0, 3).map((line) => `<p>${safeHtml(line)}</p>`).join("")}
          </div>
        </section>

      </main>
    </article>
  `;
}

function boot() {
  document.body.classList.add(`page-${getPageName().replace(".html", "").replaceAll("-", "-")}`);
  mountHeader();
  mountFooter();
  mountAuthForms();
  mountAccountPage();
  mountBuilders();
  mountAdminV2();
  if (!hasSiteData) {
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
        <section class="section compact">
          <div class="section-head">
            <div>
              <span class="eyebrow">Data</span>
              <h2>今日内容暂不可用</h2>
            </div>
            <p>请稍后再试。</p>
          </div>
        </section>
      `;
    }
    return;
  }
  mountDateIndexes();
  mountSignalSystemPage();
  mountFrontSignalDetail();
  mountOpinionIndex();
  mountOpinionDetail();
  mountStructuredSignalDetail();
  mountBuildersSystem();
  mountBuilderDetail();
  mountSignals();
  mountSignalBuildersEntry();
  mountHome();
  mountDaily();
  mountTrendReport();
  mountTrendReportWatch();
  mountTrendReportFramework();
  mountSignalArchive();
  mountSignalRelations();
  mountTrendReportIndex();
  mountTrendReportRelations();
  mountBrief();
  mountBriefAssets();
  mountSignalDetail();
  mountDailyDetail();
  mountTrendReportDetail();
}

document.addEventListener("DOMContentLoaded", boot);
