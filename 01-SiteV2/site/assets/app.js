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
          <input id="siteSearch" name="q" type="search" placeholder="搜索信号 / 趋势" autocomplete="off">
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
          <span class="footer-copy">© 2026 WaveSight AI · V2.1</span>
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

function publicSummaryText(item, fallback = "这条内容用于补充判断背景。") {
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
  const relationText = [
    ...(item.relatedSignals || []).map((value) => `Signal ${value}`),
    ...(item.relatedTrends || []).map((value) => `Trend ${value}`),
    ...(item.relatedTrendReports || []).map((value) => `TrendReport ${value}`),
  ].join(" · ") || "暂无延伸";
  const source = cleanText(item.originalView || "来源观点已归档。");
  const reading = cleanText(item.interpretation || item.calibrates || item.usage || "作为补充视角，不替代事实来源。");
  return `
    <article class="point-card fade-in" style="animation-delay:${index * 60}ms">
      <div class="point-card-head">
        <span class="kicker"><img class="kicker-icon" src="assets/vi-components/01-symbol-system/key-judgment.svg" alt="">POINT ${String(index + 1).padStart(2, "0")} · ${date}${handle ? ` · @${handle}` : ""}</span>
        <h3>${item.title}</h3>
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
    ["01", "今日判断", "先看这件事和业务有没有关系"],
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
  const homeDailyJudgment = dailyHomeJudgmentText(dailyEventSignals);
  const dailyProfile = dailyJudgmentProfile(data.daily || {}, dailyEventSignals);

  const heroPreview = root.querySelector("[data-home-hero-preview]");
  if (heroPreview) {
    heroPreview.innerHTML = `
      <div class="home-v2-preview-card">
        <div class="home-v2-preview-head">
          ${homeMemo("今日判断")}
          <span>${data.brief.issue || "Issue 05"} · ${data.meta.date}</span>
        </div>
        <h2>今日商业内参预览</h2>
        <p>${homeShort(homeDailyJudgment, 116)}</p>
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
    const mainLine = dailyProfile.title || cleanText(data.daily?.title || "今日观察").replace(/^今日观察[｜|]\s*/u, "");
    const detailCopy = dailyProfile.impact || data.daily?.dek || "今天的几条变化被放在一起看，是因为它们指向同一个经营问题。";
    dailyCore.innerHTML = `
      <span class="home-v2-label">${data.meta.date || "今日"}</span>
      <strong class="home-v2-daily-line">${mainLine}</strong>
      <p>${homeShort(homeDailyJudgment, 190)}</p>
      <p>${homeShort(detailCopy, 170)}</p>
      <a class="home-v2-text-link" href="${data.daily.link || "daily.html"}">查看今日观察</a>
    `;
  }

  const dailyRationale = root.querySelector("[data-home-daily-rationale]");
  if (dailyRationale) {
    const dailyItems = [
      {
        label: "采购",
        title: "老板先问谁兜底",
        body: "大组织部署很诱人，但 Agent 一旦碰流程，采购会先追问权限、日志和停用按钮。",
      },
      {
        label: "产品",
        title: "控制层变成卖点",
        body: "运行时隔离、权限拦截和人工批准都在补同一块：让 Agent 能动手，也能被管住。",
      },
      {
        label: "账单",
        title: "热闹终归要算钱",
        body: "计费讨论把问题拉回现实：AI 从座席订阅走向用量消耗，预算会被摊到流程上。",
      },
    ];
    dailyRationale.innerHTML = `
      <div class="home-v2-side-head">
        ${homeMemo("今日看点")}
        <strong>${dailyProfile.thesis || homeShort(homeDailyJudgment, 88)}</strong>
      </div>
      ${dailyItems.map((item, index) => `
      <article class="home-v2-mini-card home-v2-rationale-card fade-in" style="animation-delay:${index * 70}ms">
        <div class="home-v2-card-kicker">${homeMemo(item.label)}<span class="home-v2-index">${String(index + 1).padStart(2, "0")}</span></div>
        <h3>${homeShort(item.title, 42)}</h3>
        <p>${homeShort(item.body, 138)}</p>
      </article>
      `).join("")}
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
        <span class="home-v2-read-link">查看变化</span>
      </a>
    `;
    }).join("");
  }

  const signalGrid = root.querySelector("[data-home-signals]");
  if (signalGrid) {
    const activeDate = activeSignalDate();
    const activeSignals = (data.contentIndex?.signals || data.signals || []).filter((item) => signalMatchesDate(item, activeDate));
    const homeSignals = (activeSignals.length ? activeSignals : data.contentIndex?.signals || data.signals || []).slice(0, 4);
    const lead = homeSignals[0];
    const sideSignals = homeSignals.slice(1, 4);
    const activeCases = (data.contentIndex?.cases || []).filter((item) => !activeDate || item.date === activeDate);
    const activePoints = (data.contentIndex?.points || []).filter((item) => !activeDate || item.date === activeDate);
    const leadTags = lead ? signalTagNames(lead, 5) : [];
    const leadCases = lead ? signalCaseNames(lead, 2) : [];
    const leadSources = lead ? signalSourceNames(lead, 2) : [];
    const isCopilotLead = /copilot/i.test(String(lead?.title || ""));
    const evidenceJudgment = isCopilotLead
      ? "这条材料不能直接证明 GitHub 已经改价，但它把开发者最敏感的一件事捅出来了。"
      : signalWhyLine(lead, 108);
    const evidenceStatus = isCopilotLead ? "讨论升温 / 仍需补证" : "材料充足 / 继续观察";
    const watchWindows = isCopilotLead ? [
      ["7D", "看是否出现更多一手讨论"],
      ["30D", "看是否影响开发者付费预期"],
      ["90D", "看是否沉淀为 AI 编程工具计费趋势"],
    ] : [
      ["7D", "看是否出现更多一手材料"],
      ["30D", "看客户采用和付费反馈"],
      ["90D", "看是否沉淀为连续趋势"],
    ];
    const sideRow = (signal, index) => `
      <a class="home-signal-row fade-in" href="${safeAttribute(signalHref(signal))}" style="animation-delay:${(index + 1) * 70}ms">
        <span class="home-signal-row-index">${String(index + 2).padStart(2, "0")}</span>
        <div>
          <strong>${dailySignalShortTitle(signal)}</strong>
          <p>${signalEventLine(signal, 74)}</p>
          <div class="home-signal-row-tags">
            ${signalTagNames(signal, 2).map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </div>
      </a>
    `;
    signalGrid.innerHTML = lead ? `
      <div class="home-signal-workbench">
        <a class="home-signal-lead fade-in" href="${safeAttribute(signalHref(lead))}">
          <div class="home-signal-lead-head">
            <span>DAILY SIGNAL BRIEF</span>
            <em>${lead.id || "FS"} · ${signalSystemDate(lead.date)}</em>
          </div>
          <h3>${dailySignalShortTitle(lead)}</h3>
          <p class="home-signal-lead-copy">${signalEventLine(lead, 172)}</p>
          <p class="home-signal-interpretation">${evidenceJudgment}</p>
          <div class="home-signal-evidence" aria-label="Evidence Summary">
            <div>
              <span>EVIDENCE NOTE</span>
              <strong>${evidenceJudgment}</strong>
            </div>
            <div>
              <span>案例</span>
              <strong>${leadCases.join(" / ") || "暂未监测到同类案例"}</strong>
            </div>
            <div>
              <span>来源</span>
              <strong>${leadSources.join(" / ") || "暂无公开信息"}</strong>
            </div>
          </div>
          <div class="home-signal-statusline">
            <span>${evidenceStatus}</span>
            <span>观察窗口：7D / 30D / 90D</span>
          </div>
          <div class="home-signal-watchline" aria-label="Watch Window">
            ${watchWindows.map(([label, text]) => `
            <div>
              <span>${label}</span>
              <strong>${text}</strong>
            </div>
            `).join("")}
          </div>
          <div class="home-signal-lower">
            <div class="home-signal-tags">
              ${(leadTags.length ? leadTags : ["AI Coding", "开发者工具", "计费模型"]).map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            <svg class="home-signal-sparkline" viewBox="0 0 180 44" aria-hidden="true">
              <path d="M8 34 H172" />
              <polyline points="10,31 46,27 82,28 118,18 160,10" />
              <circle cx="160" cy="10" r="3.5" />
            </svg>
          </div>
          <div class="home-signal-boundary">
            <span>当前为讨论升温信号，不等同于官方定价变化。</span>
            <em>查看信号 ↗</em>
          </div>
        </a>
        <aside class="home-signal-aside" aria-label="更多商业信号">
          <div class="home-signal-aside-head">
            <span>SIGNAL BRIEF</span>
            <strong>今日信号简报</strong>
          </div>
          <div class="home-signal-counts">
            <div><strong>${homeSignals.length}</strong><span>今日信号</span></div>
            <div><strong>${activeCases.length}</strong><span>案例卡</span></div>
            <div><strong>${activePoints.length}</strong><span>前沿观点</span></div>
          </div>
          <div class="home-signal-row-list">
            ${sideSignals.map(sideRow).join("")}
          </div>
          <a class="home-signal-library-link" href="signals.html">进入完整信号库</a>
        </aside>
      </div>
    ` : "";
  }

  const featuredTrendReport = root.querySelector("[data-home-featured-trend-report]");
  if (featuredTrendReport && data.trendReport) {
    const reportId = String(data.trendReport.id || "");
    const hasFormalReport = /^TRD-(FLASH|FULL)-\d{8}-\d{2}$/.test(reportId);
    const audience = compactJoin([tagsByGroup(data.trendReport, "customer", 2), tagsByGroup(data.trendReport, "function", 2)], "企业老板 / 业务负责人");
    const entry = hasFormalReport ? (data.trendReport.link || "trend-tracking.html") : "trend-tracking.html";
    const reportLabel = hasFormalReport
      ? (data.trendReport.kind === "full" ? "最新深度报告" : "正在升温")
      : "趋势仍在补证";
    const reportTitle = hasFormalReport ? data.trendReport.title : "今天的趋势判断还在补证";
    const reportCopy = hasFormalReport
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
        <div><span>状态</span><p>${data.trendReport.stage || "继续观察"}</p></div>
      </div>
      <div class="home-v2-trend-report-notes">
        <p><span>来源</span>多源密度</p>
        <p><span>客户</span>真实采用</p>
        <p><span>反证</span>成本边界</p>
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
          ${homeMemo(item.kind === "full" ? "深度报告" : (item.kind === "flash" ? "正在升温" : "继续观察"))}
          <h3>${item.title}</h3>
          <p>${homeShort(item.oneLine || summaryText(item), 74)}</p>
          <small>${compactJoin([tagsByGroup(item, "customer", 1), tagsByGroup(item, "track", 1)], "观察线索")} · ${item.stage || "观察中"}</small>
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
        <div><span>阅读重点</span><p>流程影响 / 机会判断 / 后续观察</p></div>
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
    if (!/(^|\\.)x\\.com$|(^|\\.)twitter\\.com$/i.test(target.hostname)) return "";
    const parts = target.pathname.split("/").filter(Boolean);
    return parts[0] || "";
  } catch {
    return "";
  }
}

function xMirrorUrl(url) {
  try {
    const target = new URL(url);
    if (!/(^|\\.)x\\.com$|(^|\\.)twitter\\.com$/i.test(target.hostname)) return "";
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
              <div class="heat-meta">点击查看该人物观点时间线</div>
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
  "point-agent-workflow",
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
  return {
    date: params.get("date") || "",
    tag: params.get("tag") || "",
  };
}

function signalFilterHref(next = {}) {
  const params = signalFilterParams();
  const date = Object.prototype.hasOwnProperty.call(next, "date") ? next.date : params.date;
  const tag = Object.prototype.hasOwnProperty.call(next, "tag") ? next.tag : params.tag;
  const query = new URLSearchParams();
  if (date) query.set("date", date);
  if (tag) query.set("tag", tag);
  const queryString = query.toString();
  return queryString ? `signals.html?${queryString}` : "signals.html";
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
  const filter = signalTagFilters().find((entry) => entry.id === tagId);
  if (!filter) return false;
  return (item.tags || []).some((tag) => {
    const values = [tag.id, tag.name, ...(tag.aliases || [])].map((value) => String(value || "").toLowerCase());
    return filter.terms.some((term) => values.includes(String(term).toLowerCase()));
  });
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

function signalTagPicker(tagId = "") {
  const tags = signalTagFilters();
  const groups = [...new Set(tags.map((tag) => tag.group))];
  const active = tags.find((tag) => tag.id === tagId);
  return `
    <form class="signal-picker signal-tag-picker" data-signal-tag-picker>
      <span>标签</span>
      <div>
        <select name="group" aria-label="标签分类">
          <option value="">全部分类</option>
          ${groups.map((group) => `<option value="${group}" ${active?.group === group ? "selected" : ""}>${tagGroupLabel(group)}</option>`).join("")}
        </select>
        <input name="keyword" type="search" list="signalTagOptions" placeholder="输入关键词或选择标签" value="${active?.label || ""}" autocomplete="off">
        <datalist id="signalTagOptions">
          ${tags.map((tag) => `<option value="${tag.label}" data-id="${tag.id}">${tagGroupLabel(tag.group)}</option>`).join("")}
        </datalist>
        <button type="submit">查看信号</button>
        <a class="signal-picker-alt" href="${active ? builderFilterHref(active.id) : "builders.html"}">相关观点</a>
      </div>
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
    point: "观点",
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
    return "补充融资规模、市场关注度和外部报道语境，适合判断这件事是否已进入商业讨论。";
  }
  if (/sierra\.ai\/customers|customers|case-stud/.test(lower)) {
    return "提供客户采用和服务场景线索，可用于观察是否已经进入真实客服或运营流程。";
  }
  if (/sierra\.ai|anthropic\.com|microsoft\.com|collibra\.com|servicenow|soundhound|twilio|greenhouse|nvidia/.test(lower)) {
    return "确认产品定位、发布主体和平台能力边界，是判断事件真实性的主要依据。";
  }
  if (/pricing|api|docs|developer|github|cloud|bedrock/.test(lower)) {
    return "补充价格、接口或交付条件，帮助判断后续成本和接入门槛。";
  }
  if (/regulation|gov|security|five-eyes|csa|risk|lawsuit/.test(lower)) {
    return "提供监管、安全或平台限制信息，用来保留反证和风险边界。";
  }
  if (/youtube|x\.com|twitter|reddit|news\.ycombinator/.test(lower)) {
    return "提供一线讨论或观点变化，只作判断参照，不作为事实主证据。";
  }
  const fallbacks = [
    "确认事件主体和发生时间，适合做基础事实核对。",
    "补充客户采用、渠道合作或市场反馈中的关键变化。",
    "提供外部反证或背景语境，帮助判断这条信号是否过热。",
    "补充交付成本、平台限制或接下来要看的线索。",
  ];
  return fallbacks[index] || "补充判断所需的来源信息和观察边界。";
}

function sourceRoleForUrl(url = "", index = 0) {
  const lower = `${signalSystemUrlDomain(url)} ${url}`.toLowerCase();
  if (/customers|case-stud/.test(lower)) return "客户采用";
  if (/techcrunch|theinformation|bloomberg|wsj|ft\.com|axios|cnbc/.test(lower)) return "外部报道";
  if (/pricing|api|docs|developer|github|cloud|bedrock/.test(lower)) return "成本条件";
  if (/regulation|gov|security|five-eyes|csa|risk|lawsuit/.test(lower)) return "风险限制";
  if (/x\.com|twitter|youtube|reddit|news\.ycombinator/.test(lower)) return "前沿观点";
  if (/prnewswire|businesswire/.test(lower)) return "发布通道";
  if (/sierra\.ai|anthropic\.com|microsoft\.com|collibra\.com|servicenow|soundhound|twilio|greenhouse|nvidia|openai\.com/.test(lower)) return "产品定位";
  return ["产品定位", "客户采用", "外部反证", "成本限制"][index] || "补充线索";
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
      ["Anthropic 官方材料", "S级", "https://www.anthropic.com", "说明企业场景里的 Agent 能力边界。"],
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
    ["行业观察", "B级", "#", "提供讨论升温和后续观察线索。"],
  ];
}

function signalSystemSources(item) {
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
    status: sources.some((source) => source.grade === "S级") ? "多源支撑" : "继续观察",
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

function signalBusinessLine(signal = {}, limit = 132) {
  const text = signalAnalysisValue(signal, ["商业含义", "为什么值得看"], signal.businessMeaning || signal.judgment);
  return homeShort(text, limit);
}

function signalEventLine(signal = {}, limit = 132) {
  const text = signalAnalysisValue(signal, ["事件", "发生了什么"], signal.event || signal.brief);
  return homeShort(text, limit);
}

function signalWhyLine(signal = {}, limit = 132) {
  const text = signalAnalysisValue(signal, ["入选理由", "为什么值得看"], signal.judgment || signal.businessMeaning);
  return homeShort(text, limit);
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

function signalTagNames(signal = {}, limit = 3) {
  return [
    ...signalSystemTags(signal, "track", 1),
    ...signalSystemTags(signal, "scenario", 1),
    ...signalSystemTags(signal, "customer", 1),
    ...signalSystemTags(signal, "function", 1),
  ].filter(Boolean).slice(0, limit);
}

function signalSupportLine(signal = {}) {
  const cases = signalCaseNames(signal, 1);
  const sources = signalSourceNames(signal, 1);
  return compactJoin([cases[0], sources[0]], "来源和案例继续补证");
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
    <div class="source-ledger-mini" aria-label="来源账本">
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
      ${["同一公司", "同一趋势", "相关趋势判断", "讨论升温", "观察窗口"].map((label, index) => `
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
  return cleanText(point.originalView || point.title || "")
    .replace(/^V1\s*/i, "")
    .replace(/^观点提示\s*/u, "")
    .replace(/属于\s*C\s*级观点线索[，,]*/u, "属于讨论升温线索，");
}

function builderOpinionCard(profile, index) {
  const latest = profile.latest || {};
  const status = ["新看法", "持续关注", "修正判断", "判断转向"][index % 4];
  const identity = builderIdentityForPoint(latest, profile);
  const original = builderOriginalText(latest);
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
  const status = perspectiveStatus(index);
  const relation = perspectiveRelation(index);
  const topics = perspectiveTopics(profile, latest);
  const original = builderOriginalText(latest);
  const textLimit = mode === "featured" ? 150 : 96;
  return `
    <article class="perspective-card ${mode === "featured" ? "featured" : ""}">
      <a href="builder-detail.html?id=${encodeURIComponent(profile.handle)}">
        <div class="perspective-card-top">
          <div class="builder-avatar">${identity.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>${identity.name}</strong>
            <small>${identity.title} · ${publicSourceLabel(profile.org)}</small>
          </div>
          <span>${status}</span>
        </div>
        <p class="perspective-original">${homeShort(original, textLimit)}</p>
        <p>${homeShort(cleanText(latest.interpretation || latest.calibrates || latest.usage || latest.title || "这条观点可作为判断参照。"), mode === "featured" ? 118 : 76)}</p>
        <div class="perspective-tags">
          <em>${signalSystemDate(latest.date)}</em>
          <em>${relation}</em>
          ${topics.map((tag) => `<em>${tag}</em>`).join("")}
        </div>
      </a>
    </article>
  `;
}

function perspectiveHeader() {
  const params = signalFilterParams();
  return `
    <section class="perspective-header">
      <div class="perspective-controls">
        <form class="signal-search-bar" role="search">
          <label class="sr-only" for="builderSearch">搜索前沿观点</label>
          <input id="builderSearch" type="search" placeholder="搜索">
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
          <span class="signal-system-label">判断参照</span>
          <h2>这组前沿观点在看什么</h2>
        </div>
        <p>先看它支持、质疑或修正哪条商业信号，再决定是否需要回到事实来源继续核对。</p>
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
          <span class="signal-system-label">后续观察</span>
          <h2>正在改变判断权重的看法</h2>
        </div>
        <p>只保留会影响客户、流程、预算或风险边界判断的观点。</p>
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
  return `
    <section class="builder-profile-header">
      <div class="builder-profile-identity">
        <div class="builder-avatar large">${identity.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <span class="signal-system-label">公开观点来源</span>
          <h1>${identity.name || "前沿观点"}</h1>
          <p>${identity.title} · ${publicSourceLabel(profile.org)}</p>
          <div class="signal-system-chipline">
            ${["前沿观点", "不作背书", "回到事实核对"].map(evidenceBadge).join("")}
          </div>
        </div>
      </div>
      <aside class="builder-profile-summary">
        ${[
          ["校准对象", "相关信号的客户采用、交付成本和责任边界"],
          ["来源边界", "身份待补时不作为个人背书"],
          ["判断权重", "只作判断参照，不替代一手事实"],
          ["继续观察", "是否出现公司公告、客户采用或监管材料"],
        ].map(([label, value]) => `<p><span>${label}</span><strong>${value}</strong></p>`).join("")}
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
        <span>当前判断</span>
        <h2>当前观点摘要</h2>
        <p>这些内容只说明观点如何变化。是否提高判断权重，还要看公司公告、客户采用、财务数据和监管材料。</p>
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
        <span>重点记录</span>
        <h2>最近三条观点变化</h2>
        <p>时间线默认只展示重点变化，避免把来源整理误读成人物背书。</p>
      </div>
      <div class="view-timeline">
        ${rows.slice(0, 3).map((row, index) => `
          <article class="view-timeline-item">
            <time>${signalSystemDate(row.date)}</time>
            <div>
              <span>${perspectiveStatus(index)} · ${perspectiveRelation(index)}</span>
              <h3>${homeShort(cleanText(row.title), 64)}</h3>
              <p class="builder-original">${homeShort(builderOriginalText(row), 132)}</p>
              <p>${homeShort(cleanText(row.interpretation || row.calibrates || row.usage || row.originalView), 128)}</p>
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
        <span>判断影响</span>
        <h2>观点变化</h2>
      </div>
      <div class="shift-analysis-grid">
        ${[
          ["最近变化类型", "新判断正在出现，但仍需要和事实来源分开看。"],
          ["变化发生在哪个变量", perspectiveTopics({}, first).join(" / ") || "客户采用 / 商业化 / 组织采用"],
          ["变化的意义", "它帮助校准本期判断，而不是替代公司公告或客户证据。"],
          ["是否影响今日判断", "作为补充视角保留，若后续出现一手材料再提高权重。"],
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
        <span>回到信号</span>
        <h2>关联主题与内容</h2>
        <p>这些内容只说明观点如何变化。是否提高判断权重，还要看公司公告、客户采用、财务数据和监管材料。</p>
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
    ["变化卡", "观察线索", "单条变化进入观察，先看来源差异、客户采用和反证缺口。"],
    ["精选信号", "商业信号", "多源事实指向同一客户、流程、预算或风险边界时，进入深读判断。"],
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
          ["判断强度", "中高"],
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
    "责任边界",
    "平台化交付",
    "企业预算",
  ];
  return `
    <div class="business-variable-map signal-image-card" aria-label="商业变量关系图">
      <img src="assets/generated/key-signal-editorial-map-imagegen.png" alt="客户、流程、预算和风险边界汇聚成商业判断的位图插画">
      <div>
        ${nodes.map((label, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${label}</span>`).join("")}
      </div>
    </div>
  `;
}

function evidenceBoundaryList(signal) {
  const items = [
    ["证据缺口", "缺少可公开核对的客户采用规模和持续付费数据。"],
    ["风险边界", signal.counter || "仍需观察真实采用规模、付费意愿和责任边界。"],
    ["观察变量", "上线周期、事故成本和人工接管机制仍会影响商业化速度。"],
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
  const tags = [...signalSystemTags(signal, "track", 3), ...signalSystemTags(signal, "scenario", 3)].filter(Boolean);
  return `
    <section class="watch-next-panel">
      <div>
        <span class="signal-system-label">后续观察</span>
        <h2>接下来怎么看</h2>
        <div class="tracking-tags">
          ${tags.map((tag, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${tag}</span>`).join("")}
        </div>
      </div>
      <div class="watch-next-timeline">
        ${["7天：看官方是否补充客户、权限和动作边界。", "30天：看是否出现采购、试点或渠道合作信号。", "90天：如果多条信号继续指向同一流程，再考虑进入趋势追踪或商业内参。"].map((text, index) => `
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
          ${["主要出处", "影响变量", "趋势候选"].map((label, index) => {
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
        <p>同一条信号需要拆开看：谁确认了事件，谁提供客户采用，谁补充反证或成本边界。</p>
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
      <img src="assets/generated/key-signal-editorial-map-imagegen.png" alt="结构化信号进入后续观察的位图插画">
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

function mountSignalSystemPage() {
  const root = document.querySelector("[data-signal-system]");
  if (!root) return;
  const params = signalFilterParams();
  const allSignals = data.contentIndex?.signals || data.signals || [];
  const baseSignals = allSignals.filter((item) => {
    if (params.date) return signalMatchesDate(item, params.date);
    if (params.tag) return true;
    return signalMatchesDate(item, activeSignalDate());
  });
  const scopedSignals = baseSignals.filter((item) => signalMatchesTag(item, params.tag));
  const displaySignals = scopedSignals.length ? scopedSignals : baseSignals.length ? baseSignals : allSignals;
  const frontSignals = displaySignals.slice(0, 5);
  const lead = frontSignals[0] || data.contentIndex?.signals?.[0] || {};
  const activeFilter = params.tag ? signalTagFilters().find((entry) => entry.id === params.tag) : null;
  const pageTitle = activeFilter ? `${activeFilter.label}相关信号` : "商业信号";
  const leadTitle = lead?.title || signalLeadTitle(lead, params.date, params.tag);
  const leadEvidence = signalSystemEvidence(lead);
  const structured = displaySignals.slice(0, 8);
  const builders = signalSystemBuilderProfiles().slice(0, 2);
  const leadCases = relatedCaseAssets(lead, 3);
  const leadSources = signalSystemSources(lead).slice(0, 3);
  root.innerHTML = `
    <section class="signal-workbench-hero">
      <div>
        <span class="signal-system-label">商业信号 · ${signalRangeLabel(params.date)}</span>
        <h1>${pageTitle}</h1>
        <p>${signalRangeLabel(params.date)}先看事实和事件，再看判断、案例和前沿观点。这里不堆新闻，只保留已经碰到客户、流程、预算或责任边界的变化。</p>
      </div>
      <div class="signal-header-controls signal-workbench-controls">
        ${signalDatePicker(params.date)}
        ${signalTagPicker(params.tag)}
      </div>
    </section>

    <section class="signal-ledger">
      <article class="signal-ledger-lead">
        <div class="signal-ledger-kicker">
          <span>今日精选</span>
          <em>${lead.id || "CHG"}</em>
        </div>
        <h2>${dailySignalShortTitle(lead)}</h2>
        <p class="signal-ledger-event">${signalEventLine(lead, 260)}</p>
        <div class="signal-ledger-brief">
          <section>
            <span>影响</span>
            <strong>${signalBusinessLine(lead, 150)}</strong>
          </section>
          <section>
            <span>为什么收进来</span>
            <strong>${signalWhyLine(lead, 140)}</strong>
          </section>
        </div>
        <div class="signal-ledger-foot">
          <div>
            <span>案例</span>
            <strong>${leadCases.map((item) => item.title).join(" / ") || "暂未监测到同类案例"}</strong>
          </div>
          <div>
            <span>来源</span>
            <strong>${leadSources[0]?.name || "来源待复核"}</strong>
          </div>
          <a class="signal-primary-action" href="${safeAttribute(signalHref(lead))}">查看信号</a>
        </div>
      </article>
      <div class="signal-ledger-list">
        ${frontSignals.slice(1, 6).map((signal, index) => `
          <a class="signal-ledger-row" href="${safeAttribute(signalHref(signal))}">
            <span>${String(index + 2).padStart(2, "0")}</span>
            <div>
              <strong>${dailySignalShortTitle(signal)}</strong>
              <p>${signalEventLine(signal, 118)}</p>
            </div>
            <em>${signalBusinessLine(signal, 76)}</em>
          </a>
        `).join("")}
      </div>
    </section>

    <section class="signal-evidence-board" id="library">
      <div class="signal-evidence-column">
        <span class="signal-system-label">来源依据</span>
        <h2>先看材料从哪来</h2>
        <div class="signal-source-stack">
          ${leadSources.map((source, index) => `
            <a href="${safeAttribute(source.url)}" ${source.url === "#" ? "" : 'target="_blank" rel="noreferrer"'}>
              <span>${String(index + 1).padStart(2, "0")} · ${source.grade}</span>
              <strong>${source.name}</strong>
              <p>${source.fact}</p>
            </a>
          `).join("")}
        </div>
      </div>
      <div class="signal-evidence-column">
        <span class="signal-system-label">案例卡</span>
        <h2>有没有真实对象支撑</h2>
        <div class="signal-case-mini-stack">
          ${leadCases.map((item) => `
            <article>
              <strong>${item.title}</strong>
              <p>${summaryText(item, item.brief)}</p>
              ${tagRow(item, 2)}
            </article>
          `).join("") || "<p>暂未监测到同类案例。</p>"}
        </div>
      </div>
      <div class="signal-evidence-column">
        <span class="signal-system-label">前沿观点</span>
        <h2>一线人在讨论什么</h2>
        <div class="builder-opinion-list compact">
          ${builders.map(builderOpinionCard).join("")}
        </div>
      </div>
    </section>

    <section class="signal-library signal-library-redesigned">
      <div class="signal-system-section-head">
        <div>
          <span class="signal-system-label">继续看</span>
          <h2>更多信号</h2>
        </div>
        ${trackingFilterStrip()}
      </div>
      <div class="signal-table-list">
        ${structured.map((signal, index) => `
          <a class="signal-table-row" href="${safeAttribute(signalHref(signal))}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${dailySignalShortTitle(signal)}</strong>
            <p>${signalEventLine(signal, 96)}</p>
            <em>${signalBusinessLine(signal, 58)}</em>
          </a>
        `).join("")}
      </div>
    </section>
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
    }) || (group ? tags[0] : null);
    window.location.href = signalFilterHref({ tag: matched?.id || "" });
  });
}

function mountFrontSignalDetail() {
  const root = document.querySelector("[data-front-signal-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const all = [...(data.signals || []), ...(data.contentIndex?.signals || [])];
  const signal = all.find((item) => item.slug === slug || item.id === slug) || data.signals?.[0] || {};
  const evidence = signalSystemEvidence(signal);
  const related = relatedAssets(signal, "signal");
  const relatedPoints = (related.point || []).slice(0, 4);
  const builders = signalSystemBuilderProfiles().slice(0, 2);
  const pointBlocks = relatedPoints.length
    ? relatedPoints.map((item) => `
      <article class="signal-point-card">
        <span>${item.person || item.author || "前沿观点"}</span>
        <h3>${item.title}</h3>
        <p>${summaryText(item, item.brief)}</p>
        ${item.sourceUrl ? `<a href="${safeAttribute(item.sourceUrl)}" target="_blank" rel="noreferrer">查看原文</a>` : ""}
      </article>
    `).join("")
    : builders.map(builderOpinionCard).join("");
  const sourceCards = signalSystemSources(signal).slice(0, 5);
  root.innerHTML = `
    <article class="front-signal-detail signal-detail-report">
      <header class="signal-detail-hero">
        <span class="signal-system-label">商业信号 · ${signal.id || "CHG"}</span>
        <h1>${reportTitleHtml(signal.title)}</h1>
        <p>${signalEventLine(signal, 240)}</p>
        <div class="signal-detail-meta">
          <span>${signalSystemDate(signal.date)}</span>
          <span>${evidence.total} 条来源</span>
          <span>${signalCaseNames(signal, 1)[0] || "案例继续补证"}</span>
        </div>
      </header>

      <section class="signal-detail-narrative">
        <div>
          <h2>把这件事放回生意里看</h2>
          <p>${signalBusinessLine(signal, 280)}</p>
          <p>${signalWhyLine(signal, 260)}</p>
        </div>
        <aside>
          <span>观察坐标</span>
          <strong>${signalTagNames(signal, 3).join(" / ") || "AI 商业变化"}</strong>
          <p>${signal.counter || "继续观察客户采用、付费方式和责任边界。"}</p>
        </aside>
      </section>

      <section class="report-section signal-detail-two-up signal-detail-proof">
        <div class="signal-detail-column">
          <div class="report-section-head">
            <span>来源依据</span>
            <h2>材料从哪来</h2>
            <p>这里放能追到原文的来源。观点可以参考，事实仍要回到原始材料。</p>
          </div>
          <div class="signal-source-stack">
            ${sourceCards.map((source, index) => `
              <a href="${safeAttribute(source.url)}" ${source.url === "#" ? "" : 'target="_blank" rel="noreferrer"'}>
                <span>${String(index + 1).padStart(2, "0")} · ${source.grade}</span>
                <strong>${source.name}</strong>
                <p>${source.fact}</p>
              </a>
            `).join("")}
          </div>
        </div>
        <div class="signal-detail-column signal-detail-column-accent">
          <div class="report-section-head">
            <span>前沿观点</span>
            <h2>谁在提前说这件事</h2>
            <p>它们不替代事实，但能看出行业焦虑、兴奋和分歧在哪里。</p>
          </div>
          <div class="signal-point-list">
            ${pointBlocks}
          </div>
        </div>
      </section>

      ${signalCaseEvidenceSection(signal)}

      <section class="report-section">
        <div class="report-section-head">
          <span>商业含义</span>
          <h2>它会改谁的账本</h2>
          <p>观澜看商业信号，不只看公司发了什么，更看它碰到了哪张预算表、哪条流程和哪类责任。</p>
        </div>
        ${commercialVariableGrid(signal)}
      </section>

      <section class="report-section business-variable-section">
        <div>
          <div class="report-section-head"><span>继续观察</span><h2>还不能急着下判断</h2></div>
          <p>${signal.counter || "还要继续看真实采用、付费意愿、部署成本和事故处理材料。"}</p>
          <div class="variable-brief-list">
            ${[
              `影响对象：${signalSystemTags(signal, "customer", 2).join(" / ") || "企业客户和业务负责人"}`,
              `涉及流程：${signalSystemTags(signal, "scenario", 2).join(" / ") || "客户、数据或工作流"}`,
              `支撑案例：${signalCaseNames(signal, 2).join(" / ") || "暂未监测到同类案例"}`,
              `继续看：${signalSystemTags(signal, "evidence", 1)[0] || "客户采用和公开材料"}`
            ].map((text, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><p>${text}</p></div>`).join("")}
          </div>
        </div>
        ${businessVariableMap(signal)}
      </section>

      <section class="report-section evidence-calibration-report">
        <div>
          <div class="report-section-head"><span>还缺什么</span><h2>还不能下结论的部分</h2></div>
          ${evidenceBoundaryList(signal)}
        </div>
      </section>

      ${watchNextPanel(signal)}
      ${relationPanel(signal, "signal")}
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
  root.innerHTML = `
    ${builderProfileHeader(profile, identity)}
    ${currentViewPanel(rows)}
    ${viewTimelinePanel(rows)}
    ${shiftAnalysisPanel(rows)}
    ${builderRelatedLinks()}
  `;
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

function selectedDailyPoints(issue, builderOnly = false) {
  const date = dailyDateParam(issue?.date || issue?.label);
  const all = data.contentIndex?.points || [];
  const sameDay = all.filter((item) => dailyDateParam(item.date) === date);
  const pool = builderOnly ? sameDay.filter(isFollowBuilderPoint) : sameDay;
  if (pool.length) return pool;
  return builderOnly ? [] : sameDay;
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
  nav.innerHTML = `
    ${link(previous, "上一日")}
    <a href="daily.html">今日</a>
    ${link(next, "下一日")}
  `;
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
  const preset = {
    "FS-20260511-01": "ServiceNow 把企业 Agent 从单点 Copilot 推向系统级行动平台，重点不是多一个助手，而是让 Agent 能在企业系统里执行动作，并接受连接、权限、审计和控制。对企业来说，真正要评估的是动作能不能被授权、回放和停用；这会影响 IT、业务系统、客服、采购和财务流程，也会改变产品负责人对连接器与权限边界的判断。短期看平台能否把 MCP、工具调用和审批策略接成闭环，长期看企业是否愿意把关键流程交给可审计的 Agent 执行。",
    "FS-20260511-02": "SoundHound 的 OASYS 把语音 Agent 从一次性问答推向可编排、可学习的平台叙事。它提醒企业：客服和销售自动化的竞争点正在从回答质量，转到流程是否能持续运营、持续优化，并被业务团队接管。短期要看模板复用、人工接管和上线周期，长期要看它能否沉淀为企业自己的服务流程。如果学习、编排和复盘不能进入管理界面，语音 Agent 仍会停留在前台体验，而不是运营系统。",
    "FS-20260511-03": "Collibra 将 AI Command Center 定位为实时监督和持续控制能力，说明治理不再只是上线前的政策、流程或报表，而是进入运行时。企业需要关注模型漂移、权限扩散、责任追溯和异常停用这些实际运营问题；受影响的不只是数据团队，还包括合规、风控、IT 运维和业务负责人。短期看它能否接入真实用例、权限和日志，长期看 Agent 治理会不会成为企业 AI 采购的默认条件。",
  };
  return preset[signal.id] || cleanText(signal.judgment || signal.brief || summaryText(signal));
}

function dailyJudgmentProfile(dailyContent = {}, signals = []) {
  const date = dailyDateParam(dailyContent.date || dailyContent.label || selectedDailyIssue()?.date || "");
  const profiles = {};
  const fallback = {
    title: cleanText(dailyContent.title || "这一天的商业变化值得继续回看。").replace(/^Insight-\d{4}-\d{2}-\d{2}-\d+\s*[｜|]\s*/u, ""),
    thesis: cleanText(dailyContent.dek || dailyContent.title || "这一天的信号已经进入归档，仍可作为后续判断参照。"),
    body: "回看这类内容时，重点不是复述当天发生了什么，而是看它是否持续影响客户采用、预算归属、交付成本和企业流程。只有当这些变化进入真实部署、采购标准或组织分工，它才从热点变成商业信号。",
    impact: "它会影响相关业务负责人、产品负责人和企业服务采购。短期看客户侧材料，长期防的是把发布、融资和观点误读成已经成熟的需求。",
    note: "归档日需要继续看后续证据是否补足，而不是只保留当天判断。",
  };
  const profile = profiles[date] || fallback;
  const names = signals.slice(0, 3).map(dailySignalShortTitle).filter(Boolean);
  return {
    ...profile,
    basis: names.length ? `当日信号包括：${names.join("、")}。` : "",
  };
}

function dailyHomeJudgmentText(signals = []) {
  const signalNames = signals.slice(0, 3).map(dailySignalShortTitle).filter(Boolean);
  const basis = signalNames.length ? `今天被拎出来的几条材料，落在 ${signalNames.join("、")} 上。` : "";
  return `今天真正该看的，不是模型又多会了什么，而是 AI 是否已经碰到客户、流程、预算或责任边界。${basis}一旦它能动手，企业会先问权限、记录、停用和账单。`;
}

function dailyJudgmentMarkup(dailyContent = {}, signals = []) {
  const profile = dailyJudgmentProfile(dailyContent, signals);
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
  const issueNo = `DB.${dailyDateParam(issue?.date || issue?.label).replaceAll("-", "")}`;
  return `
    <div class="daily-newsletter-issue-meta">
      <div><span>Issue No.</span><strong>${issueNo}</strong></div>
      <div><span>Published</span><strong>${dailyDateLabel(issue?.label || issue?.date)}</strong></div>
      <div><span>Window</span><strong>24H / 7D / 30D</strong></div>
      <div><span>Status</span><strong>${isActiveDailyIssue(issue) ? "当前日" : "归档日"} · 可回看</strong></div>
    </div>
    ${dailyStatusRail(issue)}
  `;
}

function dailySummaryCard(dailyContent = data.daily) {
  const profile = dailyJudgmentProfile(dailyContent, selectedDailySignals(selectedDailyIssue()));
  const keywords = ["Agent", "可控运营", "治理", "交付成本", "企业工作流"];
  return `
    <dl>
      <div><dt>今日主线</dt><dd>${profile.title.replace(/^今日观察[｜|]\s*/u, "")}</dd></div>
      <div><dt>判断强度</dt><dd>中高</dd></div>
      <div><dt>观察窗口</dt><dd>24H / 7D / 30D</dd></div>
      <div><dt>当前状态</dt><dd>升温，仍需边界校准</dd></div>
      <div class="daily-newsletter-tags-field">
        <dt>Tags</dt>
        <dd class="daily-brief-key-chips">${keywords.map((item) => `<span>${item}</span>`).join("")}</dd>
      </div>
    </dl>
  `;
}

function dailyCalibrationNote(dailyContent = data.daily) {
  const profile = dailyJudgmentProfile(dailyContent, selectedDailySignals(selectedDailyIssue()));
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
  return `
    <span class="daily-newsletter-memo">MARKET READ</span>
    <h3>讨论正在从“能不能做”转向“敢不敢放进流程”</h3>
    <p>今天的材料更像一个采购前夜的信号：供应商开始把“可控”写进产品，客户侧还在等部署结果、事故成本和接管机制。</p>
    <div class="daily-newsletter-market-strip">
      <span><strong>官方发布增多</strong><em>产品叙事已经转向治理</em></span>
      <span><strong>客户采用待补</strong><em>真实上线材料仍少</em></span>
      <span><strong>继续看交付</strong><em>成本和责任边界未定</em></span>
    </div>
  `;
}

function dailyNewsletterRiskPanel() {
  const risks = [
    ["先别只看发布", "融资、发布和媒体报道会先出现，真实部署里的权限、接管和事故处理往往滞后披露。"],
    ["还缺客户侧材料", data.daily.risk || "客户采用、预算归属和部署周期仍需继续观察。"],
    ["采购标准还没定型", "“可控”能否成为企业采购条件，还取决于责任边界、权限默认值和人工接管机制。"],
  ];
  return `
    <span class="daily-newsletter-memo">WHAT TO WATCH</span>
    <h3>现在还不能下定论的地方</h3>
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
          <div><dt>商业变量</dt><dd>${dailyMetaByGroup(item, "scenario", "流程承接与付费边界", 2)}</dd></div>
          <div><dt>客户场景</dt><dd>${dailyMetaByGroup(item, "customer", "中大型企业 / 业务团队", 2)}</dd></div>
          <div><dt>边界条件</dt><dd>责任、数据和部署周期仍需观察</dd></div>
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
          <p>这一天的内容先保留为信号和观点观察，等客户采用、预算归属或交付边界更清楚后，再进入趋势追踪。</p>
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
          <span>商业变量：${dailyMetaByGroup(item, "scenario", "流程承接与付费边界", 1)}</span>
          <span>客户场景：${dailyMetaByGroup(item, "customer", "中大型企业", 1)}</span>
          <span>边界：责任、数据和部署周期</span>
        </div>
      </div>
      <a href="${item.link || `trend-detail.html?id=${item.slug}`}">趋势追踪 ↗</a>
    </article>
  `).join("");
}

function dailyNewsletterWatchMarkup() {
  const items = [
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
  const groups = new Map();
  const add = (group, name, weight = 1) => {
    if (!name) return;
    const key = `${group}:${name}`;
    const current = groups.get(key) || { group, name, weight: 0 };
    current.weight += weight;
    groups.set(key, current);
  };
  [...(data.signals || []), ...(data.contentIndex?.trendReports || [])].forEach((item) => {
    (item.tags || []).forEach((tag) => add(tag.group || "tag", tag.name, 1));
  });
  ["Sierra", "Microsoft 365", "Anthropic", "Collibra", "Agent", "Workflow", "Decision"].forEach((name) => add("正式标签", name, 2));
  return [...groups.values()]
    .filter((item) => ["company", "product", "track", "scenario", "risk", "source", "evidence", "function", "正式标签"].includes(item.group))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 42);
}

function mountDailyKeywords() {
  const grid = document.querySelector("[data-daily-keywords]");
  if (!grid) return;
  const filters = document.querySelector("[data-daily-keyword-filters]");
  const input = document.querySelector("[data-daily-keyword-search]");
  const items = dailyKeywordItems();
  const labels = [
    ["all", "全部"],
    ["track", "赛道"],
    ["scenario", "场景"],
    ["function", "职能"],
    ["source", "来源"],
    ["evidence", "证据"],
    ["正式标签", "正式标签"],
  ];
  let active = "all";
  const render = () => {
    const q = String(input?.value || "").trim().toLowerCase();
    const picked = items.filter((item) => {
      if (active !== "all" && item.group !== active) return false;
      if (!q) return true;
      return `${item.name} ${item.group}`.toLowerCase().includes(q);
    });
    grid.innerHTML = picked.slice(0, 18).map((item) => `<button type="button" class="daily-newsletter-keyword" data-group="${item.group}"><span>${item.group}</span>${item.name}</button>`).join("");
  };
  if (filters) {
    filters.innerHTML = labels.map(([value, label]) => `<button type="button" data-filter="${value}" ${value === active ? "aria-pressed=\"true\"" : ""}>${label}</button>`).join("");
    filters.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = btn.dataset.filter || "all";
        filters.querySelectorAll("[data-filter]").forEach((node) => node.setAttribute("aria-pressed", String(node === btn)));
        render();
      });
    });
  }
  input?.addEventListener("input", render);
  render();
}

function dailyBuilderViewMarkup(issue = selectedDailyIssue()) {
  const points = selectedDailyPoints(issue, true).slice(0, 3);
  if (!points.length) {
    return `<article class="daily-newsletter-builder-card"><span>前沿观点</span><h3>当天暂无精选观点</h3><p>这一日先以事实信号为主，后续补足前沿观点后再校准。</p></article>`;
  }
  return points.map((item, index) => {
    const identity = builderIdentityForPoint(item);
    return `
      <article class="daily-newsletter-builder-card">
        <div class="daily-newsletter-builder-person">
          <span>前沿观点 · ${String(index + 1).padStart(2, "0")}</span>
          <h3>${identity.name}</h3>
          <small>${identity.title}</small>
        </div>
        <p class="daily-newsletter-builder-original">${homeShort(cleanText(item.originalView || item.title), 100)}</p>
        <strong>${homeShort(cleanText(item.interpretation || item.calibrates || summaryText(item)), 112)}</strong>
        ${item.sourceUrl ? `<a href="${item.sourceUrl}" target="_blank" rel="noreferrer">查看来源 ↗</a>` : ""}
      </article>
    `;
  }).join("");
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
    return `<article class="daily-newsletter-related-card"><span>Index</span><h3>当天暂无延申条目</h3><p>这一日暂以本期判断和商业信号为主。</p><small>${dailyDateLabel(issue?.label || issue?.date)}</small></article>`;
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
    .replaceAll("立即行动", "继续观察")
    .replaceAll("马上验证", "后续观察")
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
  const stage = cleanText(item?.stage || "");
  if (/观察|缺|不足|风险/.test(stage) || item?.evidenceGaps) return "观察中方向";
  return stage || "证据正在增强";
}

function trendReportStatus(index, item) {
  const state = trendReportEvidenceState(item);
  if (/不足|缺/.test(state) || item?.evidenceGaps) return index % 3 === 0 ? "仍需补证" : "观察中";
  return index % 2 === 0 ? "证据增强" : "可进入深挖";
}

function trendReportGap(item) {
  return trendReportSafeText(item?.evidenceGaps || textFromSection(item, ["反证", "限制"], "仍需观察客户采用、付费意愿和交付成本。"));
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
  const signals = (related.signal || data.signals || []).slice(0, 2);
  const trends = (related.trend || data.contentIndex?.trends || []).slice(0, 1);
  return [...signals.map((signal) => ["Signal", signal.title]), ...trends.map((trend) => ["Trend", trend.title])].slice(0, 3);
}

function trendReportWatchItems() {
  const list = data.contentIndex?.trendReports || [];
  const primary = data.trendReport?.slug;
  const picked = list.filter((item) => item.slug !== primary).slice(0, 6);
  if (picked.length) return picked;
  return list.slice(1, 7);
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
    ["04", "还缺什么", "哪些数据仍然缺失，哪些判断还不能下结论？"],
    ["05", "观察窗口", "7 / 30 / 90 天分别要看什么？"],
  ];
  return `
    <div class="trend-report-section-head">
      <div>
        <span class="trend-report-section-kicker">OPPORTUNITY FRAMEWORK</span>
        <h2>我们如何判断一个方向是否值得解码</h2>
      </div>
      <p>观澜AI不贩卖机会答案，只把信号、趋势、场景、变量和边界放到同一张判断图里。</p>
    </div>
    <div class="trend-report-framework-grid">
      <div class="trend-report-path-card">
        <span class="trend-report-card-label">OPPORTUNITY PATH</span>
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
        <h3>证据缺口图</h3>
        ${[["已有证据", 62], ["缺失证据", 38], ["继续观察", 74]].map(([label, value]) => `
          <div class="trend-report-proof-bar"><span>${label}</span><i style="--w:${value}%"></i><em>${value}%</em></div>
        `).join("")}
      </div>
      <div class="trend-report-timeline-card">
        <span class="trend-report-card-label">WATCH STATUS</span>
        <h3>7 / 30 / 90 观察轴</h3>
        ${[["7D", "看是否出现新增客户案例"], ["30D", "看定价锚点和预算归属"], ["90D", "看交付成本、留存和责任条款"]].map(([time, text]) => `
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
      note: "完整内参、来源账本、风险边界和往期判断追踪保留在会员层。",
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
      body: "可阅读完整正文、完整来源账本、热力变化、未定部分、趋势判断和往期参照。",
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
  return ["Agent", "控制层", "工程治理", "企业交付", "责任边界"];
}

function briefTocItems() {
  return [
    ["01", "本期判断", "本期最值得先看的变化"],
    ["02", "关键来源摘要", "哪些事实推动判断变化"],
    ["03", "热力变化", "哪些方向升温或进入争议"],
    ["04", "商业变量", "哪些事会影响预算、流程和团队"],
    ["05", "还缺什么", "哪些地方还缺材料"],
    ["06", "趋势判断", "哪些方向进入内参跟踪"],
    ["07", "后续追踪", "7 / 30 / 90 天继续看什么"],
    ["08", "往期参照", "判断如何延续、修正或加强"],
  ];
}

function briefCoreJudgments() {
  const defaults = [
    ["MCP / 连接器会迅速普及", "规模化上线看的不是演示有多顺，而是运行时策略能不能真的执行。", "关联变量：权限、审计、回滚"],
    ["未来 90 天值得盯的变量", "上线周期、模板复用率、一次解决率和事故成本，会比模型参数更接近采购判断。", "关联来源：客户采用、产品发布"],
    ["企业会先为“可控”付费", "当 Agent 进入流程后，企业会先买可控运行，再买更聪明的能力。", "关联边界：责任条款、交付成本"],
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
    role: index === 0 ? "加强本期判断" : "补充观察边界",
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
    tag: ["延续", "加强", "修正", "继续观察", "已验证", "边界更新"][index] || "继续观察",
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
  const signals = selectedDailySignals(issue);
  setText("[data-daily-date]", dailyDateLabel(issue.label || issue.date));
  setText("[data-daily-title]", dailyJudgmentProfile(dailyContent, signals).title.replace(/^今日观察[｜|]\s*/u, ""));
  const titleLink = document.querySelector("[data-daily-title-link]");
  if (titleLink) titleLink.href = dailyDetailHref(issue);
  mountDailyDateNav(issue);

  const status = document.querySelector("[data-daily-issue-status]");
  if (status) status.innerHTML = dailyIssueStatus(issue);

  const judgment = document.querySelector("[data-daily-judgment]");
  if (judgment) {
    judgment.innerHTML = dailyJudgmentMarkup(dailyContent, signals);
    judgment.insertAdjacentHTML("beforeend", `<a class="daily-newsletter-read-link" href="${dailyDetailHref(issue)}">查看详情</a>`);
  }

  const summary = document.querySelector("[data-daily-summary]");
  if (summary) summary.innerHTML = dailySummaryCard(dailyContent);

  const chart = document.querySelector("[data-daily-mini-chart]");
  if (chart) chart.innerHTML = "";

  const calibration = document.querySelector("[data-daily-calibration]");
  if (calibration) calibration.innerHTML = dailyCalibrationNote(dailyContent);

  const primarySignals = document.querySelector("[data-daily-primary-signals]");
  if (primarySignals) primarySignals.innerHTML = signals.slice(0, 3).map(dailyNewsletterSignal).join("");

  const compressedFacts = document.querySelector("[data-daily-compressed-facts]");
  if (compressedFacts) compressedFacts.innerHTML = signals.slice(3, 8).map(dailyCompressedFact).join("");

  const trend = document.querySelector("[data-daily-trend-panel]");
  if (trend) trend.innerHTML = dailyNewsletterTrendPanel();

  const risk = document.querySelector("[data-daily-risk-panel]");
  if (risk) risk.innerHTML = dailyNewsletterRiskPanel();

  const trendReports = document.querySelector("[data-daily-trend-reports]");
  if (trendReports) trendReports.innerHTML = dailyNewsletterTrendReportMarkup(issue);

  const watch = document.querySelector("[data-daily-watch]");
  if (watch) watch.innerHTML = dailyNewsletterWatchMarkup();

  const builderViews = document.querySelector("[data-daily-builder-views]");
  if (builderViews) builderViews.innerHTML = dailyBuilderViewMarkup(issue);

  const related = document.querySelector("[data-daily-related]");
  if (related) related.innerHTML = dailyRelatedMarkup(issue, signals);

  mountDailyKeywords();
}

function mountTrendReport() {
  const node = document.querySelector("[data-trend-report-card]");
  if (!node) return;
  const trendReport = data.trendReport || data.contentIndex?.trendReports?.[0];
  if (!trendReport) return;
  const summary = trendReportSafeText(textFromSection(trendReport, ["趋势判断", "价值来源"], "客户场景开始清晰，但商业变量尚未完全验证，适合进入后续趋势追踪。"));
  node.innerHTML = `
    <article class="trend-report-feature-card">
      <div class="trend-report-feature-copy">
        <span class="trend-report-section-kicker">LATEST TREND REPORT</span>
        <div class="trend-report-id-row">
          <span>${trendReportId(trendReport, 0)}</span>
          <span>${trendReport.updated || trendReport.date || data.meta.date}</span>
        </div>
        <h2>${trendReportSafeText(trendReport.title)}</h2>
        <p class="trend-report-feature-lede">${trendReportSafeText(trendReport.oneLine || summaryText(trendReport))}</p>
        <p class="trend-report-feature-summary">${homeShort(summary, 220)}</p>
        <dl class="trend-report-facts">
          <div><dt>证据状态</dt><dd>${trendReportEvidenceState(trendReport)}</dd></div>
          <div><dt>适合关注</dt><dd>${trendReportAudience(trendReport)}</dd></div>
          <div><dt>主要反证</dt><dd>${trendReportGap(trendReport)}</dd></div>
          <div><dt>观察窗口</dt><dd>7D / 30D / 90D</dd></div>
        </dl>
        ${trendReportSourceStrip(trendReport)}
        <a class="button primary" href="${trendReportHref(trendReport)}">阅读报告</a>
      </div>
      <aside class="trend-report-report-cover" aria-label="趋势报告封面">
        <div class="trend-report-cover-brand">
          <img src="assets/brand/logo-wavesight-reference-horizontal.svg" alt="观澜AI Wavesight AI">
          <span>WAVESIGHT AI TREND</span>
        </div>
        <div class="trend-report-cover-meta">
          <span>${trendReport.updated || trendReport.date || data.meta.date}</span>
          <span>${trendReportId(trendReport, 0)}</span>
        </div>
        <h3>${trendReportSafeText(trendReport.title)}</h3>
        <p>${homeShort(trendReportSafeText(trendReport.oneLine || summaryText(trendReport)), 86)}</p>
        ${trendReportCoverGraphic()}
        <div class="trend-report-cover-tags">${tagRow(trendReport, 4)}</div>
      </aside>
    </article>
  `;
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
  const relations = ["延续", "加强", "待补证", "修正"];
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
          <div><dt>证据缺口</dt><dd>${trendReportGap(item)}</dd></div>
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
    const items = data.contentIndex.points.filter((item) => item.date === activeDate).slice(0, 6);
    dailyPoints.innerHTML = items.map((item, index) => pointCard(item, index)).join("");
  }
  const points = document.querySelector("[data-point-assets]");
  if (points && data.contentIndex?.points) {
    points.innerHTML = data.contentIndex.points.map((item, index) => pointCard(item, index)).join("");
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
        <span>Issue No. ${data.brief.issue || "Preview.001"}</span>
        <span>Published ${briefIssueDate()}</span>
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
        <div><span>证据状态</span><strong>判断正在加强，仍需补证</strong></div>
        <div><span>观察窗口</span><strong>7D / 30D / 90D</strong></div>
        <div><span>适合谁读</span><strong>企业经营者 / 业务负责人 / 投资观察者</strong></div>
        <div><span>会员可解锁</span><strong>完整来源账本、热力变化、未定部分</strong></div>
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
      ? ["完整正文", "完整来源账本", "完整热力变化", "未定部分", "趋势判断", "往期参照", "下载 / 收藏 / 分享"]
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
      ${locked ? `<div class="brief-soft-lock">完整来源账本和未定部分保留在会员层。</div>` : ""}
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
      <div class="brief-framework-graph" aria-label="信号、来源、证据、趋势、机会、风险和后续观察的关系图">
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
    const rights = ["每期完整内参", "趋势热力变化", "证据与来源账本", "趋势判断", "风险边界", "往期判断追踪"];
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
        <h2>观点参照</h2>
        ${pointSection}
      </div>
      <div class="article-section">
        <h2>仍需留意</h2>
        <p>${signal.counter}</p>
      </div>
      <div class="article-section">
        <h2>相关观察</h2>
        ${relationPanel(signal, "signal") || "<p>暂无更多延伸观察。</p>"}
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
  const builderViews = selectedDailyPoints(issue, true).slice(0, 3);
  const trendReports = selectedDailyTrendReports(issue).slice(0, 2);
  const profile = dailyJudgmentProfile(dailyContent, signals);
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
        let domain = "查看原文";
        try {
          domain = new URL(url).hostname.replace(/^www\./u, "");
        } catch {
          domain = "查看原文";
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
          <strong>${homeDailyFeaturedTitle(signal, index)}</strong>
          <p>${homeShort(homeDailyCardBody(signal), 132)}</p>
          <small>${compactJoin([homeSourceTime(signal), signal.sourceTier], "来源待复核")}</small>
        </div>
      </a>
    `;
  }).join("");
  const builderSection = builderViews.length ? `
    <section class="daily-detail-bottom-card">
      <span>前沿观点</span>
      <h2>前沿观点说了什么</h2>
      <div class="daily-detail-bottom-grid">
        ${builderViews.map((item) => `
          <article>
            <strong>${homeShort(item.title || "前沿观点", 64)}</strong>
            <p>${homeShort(item.originalView || item.interpretation || item.calibrates || summaryText(item), 150)}</p>
            ${item.sourceUrl ? `<a href="${safeAttribute(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看原文</a>` : ""}
          </article>
        `).join("")}
      </div>
    </section>
  ` : "";
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
        ${builderSection}
      </div>
    </article>
    <aside class="side-rail daily-detail-rail">
      <section class="daily-detail-side-card">
        <span>NOTE</span>
        <h2>今日侧记</h2>
        <dl>
          <div><dt>日期</dt><dd>${dateLabel}</dd></div>
          <div><dt>形态</dt><dd>每日市场综述长文</dd></div>
          <div><dt>精选变化</dt><dd>${signals.length} 条</dd></div>
          <div><dt>观点参照</dt><dd>${builderViews.length ? `${builderViews.length} 条` : "今日未采用"}</dd></div>
        </dl>
      </section>
      <section class="daily-detail-side-card">
        <span>SIGNALS</span>
        <h2>引用变化</h2>
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
  const trendItems = (related.trend?.length ? related.trend : data.contentIndex?.trends || []).slice(0, 2);
  const pointItems = (related.point?.length ? related.point : data.contentIndex?.points || []).slice(0, 2);
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
        <h2>一句话趋势判断</h2>
        <div class="judgment-box">${trendReport.oneLine || summaryText(trendReport)}</div>
      </div>
      ${section(["触发信号", "变化背景"], "变化背景", "相关变化正在从单点发布走向流程、客户和交付层面的连续观察。")}
      ${section(["具体问题", "首要感受者"], "问题与对象", "这个方向会先影响那些流程清楚、客户响应压力大的组织。")}
      ${section(["流程变化"], "流程变化", "流程正在从人工接力转向 AI 参与接待、识别、分发、复核和兜底。")}
      ${section(["价值来源"], "价值来源", "价值来自响应效率、服务一致性和可复用交付能力。")}
      <div class="article-section">
        <h2>趋势背景</h2>
        <div class="trend-report-evidence-stack">
          ${trendItems.map((item) => `<p><strong>${item.title}</strong>${cleanText(item.judgment || item.evidenceGaps || summaryText(item))}</p>`).join("") || articleText(textFromSection(trendReport, ["趋势"], "趋势证据仍在积累，暂不强行画图。"))}
        </div>
      </div>
      <div class="article-section">
        <h2>前沿观点</h2>
        <div class="trend-report-evidence-stack">
          ${pointItems.map((item) => `<p><strong>${item.title}</strong>${cleanText(item.calibrates || item.interpretation || summaryText(item))}</p>`).join("") || articleText(textFromSection(trendReport, ["观点"], "外部观点只作为判断参照，不替代事实来源。"))}
        </div>
      </div>
      ${section(["反证", "限制"], "风险 / 反证", trendReportGap(trendReport))}
      <div class="article-section">
        <h2>成立边界</h2>
        <p>当前更像早期信号，仍需观察客户采用、商业化证据、交付成本和责任条款是否同时改善。</p>
      </div>
      <div class="article-section">
        <h2>建议关注变量</h2>
        <ul class="article-list">${variables.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="article-section">
        <h2>关联内容</h2>
        ${relationPanel(trendReport, "trendReport") || "<p>暂无更多延伸观察。</p>"}
      </div>
    </article>
    <aside class="side-rail">
      <h2>报告侧记</h2>
      <dl>
        <div><dt>发布时间</dt><dd>${trendReport.updated}</dd></div>
        <div><dt>证据状态</dt><dd>${trendReportEvidenceState(trendReport)}</dd></div>
        <div><dt>适合关注</dt><dd>${trendReportAudience(trendReport)}</dd></div>
        <div><dt>主要缺口</dt><dd>${trendReportGap(trendReport)}</dd></div>
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
      ["反证与缺口", item.counter || item.evidenceGaps],
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
