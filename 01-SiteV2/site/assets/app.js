const hasSiteData = Boolean(window.WaveSightContent);
const data = window.WaveSightContent || {};

const navItems = [
  ["index.html", "首页"],
  ["daily.html", "今日要点"],
  ["signals.html", "关键信号"],
  ["opportunities.html", "机会解码"],
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
    "structured-signal.html": "signals.html",
    "opportunity-detail.html": "opportunities.html",
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
          <input id="siteSearch" name="q" type="search" placeholder="搜索信号 / 机会" autocomplete="off">
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
        <span class="footer-copy">© 2026 WaveSight AI</span>
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
  return picked.length > 96 ? `${picked.slice(0, 96)}...` : picked;
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
  const href = type === "opportunity" ? `opportunity-detail.html?id=${item.slug}` : null;
  const icon = {
    opportunity: "assets/vi-components/01-symbol-system/opportunity.svg",
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
    item.hasOpportunity ? "深度分析" : "",
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
    ...(item.relatedOpportunities || []).map((value) => `Opportunity ${value}`),
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
  return presets[index] || `今日要点 ${String(index + 1).padStart(2, "0")}`;
}

function homeSourceTime(item) {
  return compactJoin([item?.sourceLabel, item?.date?.replaceAll("-", "."), item?.updated, data.meta?.date], data.meta?.date || "今日");
}

function homeField(label, value) {
  return `<div><dt>${label}</dt><dd>${value}</dd></div>`;
}

function homeShort(value = "", limit = 68) {
  const text = cleanText(value);
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function homeMemo(label) {
  return `<span class="home-v2-memo">${label}</span>`;
}

function insightToc() {
  const items = [
    ["01", "今日判断", "先看这件事和业务有没有关系"],
    ["02", "关键信号", "把热闹压成少数要紧变化"],
    ["03", "机会解码", "看哪些流程可以先试"],
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
    ${illustrationCard("radar")}
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

  const primarySignal = data.signals?.[0] || {};
  const secondSignal = data.signals?.[1] || {};
  const thirdSignal = data.signals?.[2] || {};

  const heroPreview = root.querySelector("[data-home-hero-preview]");
  if (heroPreview) {
    heroPreview.innerHTML = `
      <div class="home-v2-preview-card">
        <div class="home-v2-preview-head">
          ${homeMemo("DECISION POINT")}
          <span>${data.brief.issue || "Issue 05"} · ${data.meta.date}</span>
        </div>
        <h2>今日商业内参预览</h2>
        <p>${data.daily.dek}</p>
        <div class="home-v2-preview-grid">
          ${[primarySignal, secondSignal, thirdSignal].map((signal, index) => `
            <div>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${signal.title || "关键信号待更新"}</strong>
            </div>
          `).join("")}
        </div>
        <div class="home-v2-preview-bottom">
          <div>
            ${homeMemo("OPPORTUNITY")}
            <strong>${data.opportunity?.title || "机会解码"}</strong>
          </div>
          <div>
            ${homeMemo("RISK")}
            <strong>责任边界、流程承接和付费意愿还要继续看</strong>
          </div>
        </div>
        ${illustrationCard("map")}
      </div>
    `;
  }

  const dailyCore = root.querySelector("[data-home-daily-core]");
  if (dailyCore) {
    dailyCore.innerHTML = `
      ${homeMemo("EDITORIAL NOTE")}
      <span class="home-v2-label">编辑部判断</span>
      <h3>${data.daily.title}</h3>
      <p>${data.daily.dek}</p>
      <a class="home-v2-text-link" href="${data.daily.link}">阅读完整判断</a>
    `;
  }

  const dailyCards = root.querySelector("[data-home-daily-cards]");
  if (dailyCards) {
    dailyCards.innerHTML = data.daily.points.slice(0, 3).map((point, index) => `
      <article class="home-v2-mini-card fade-in" style="animation-delay:${index * 70}ms">
        ${homeMemo(index === 0 ? "NOTE" : index === 1 ? "WATCH" : "DECISION POINT")}
        <span class="home-v2-index">${String(index + 1).padStart(2, "0")}</span>
        <h3>${homeDailyTitle(point, index)}</h3>
        <p>${cleanText(point)}</p>
        <dl>
          ${homeField("影响对象", ["企业老板", "产品负责人", "业务操盘手"][index] || "决策者")}
          ${homeField("重要等级", ["高", "中高", "中高"][index] || "中")}
          ${homeField("阅读时间", `${index + 2} 分钟`)}
        </dl>
      </article>
    `).join("");
  }

  const signalGrid = root.querySelector("[data-home-signals]");
  if (signalGrid) {
    signalGrid.innerHTML = data.signals.slice(0, 3).map((signal, index) => {
      const signalType = compactJoin([tagsByGroup(signal, "track", 1), tagsByGroup(signal, "source", 1)], "商业信号");
      const impact = compactJoin([
        tagsByGroup(signal, "track", 2),
        tagsByGroup(signal, "function", 2),
        tagsByGroup(signal, "scenario", 1),
      ], "企业服务 / AI工作流");
      const trends = compactJoin([tagsByGroup(signal, "point", 2), tagsByGroup(signal, "stage", 1)], "可控运营");
      return `
        <article class="home-v2-signal-card fade-in" style="animation-delay:${index * 80}ms">
          ${homeMemo("SIGNAL")}
          <span class="home-v2-label">${signalType}</span>
          <div class="home-v2-signal-id">SIGNAL ID GL-${String(index + 1).padStart(3, "0")}</div>
          <h3>${signal.title}</h3>
          <p class="home-v2-meta">${homeSourceTime(signal)}</p>
          <p>${homeShort(summaryText(signal, signal.judgment), 86)}</p>
          <div class="home-v2-signal-metrics">
            <div><span>影响等级</span><strong>${["高", "中高", "中高"][index] || "中"}</strong></div>
            <div><span>观察窗口</span><strong>${["30-90 天", "2-6 周", "1-3 个月"][index] || "持续"}</strong></div>
            <div><span>相关行业</span><strong>${impact.split(" / ").slice(0, 2).join(" / ")}</strong></div>
          </div>
          <div class="home-v2-why">
            <span>为什么重要</span>
            <p>${homeShort(signal.judgment || signal.brief || "这条变化正在靠近企业真实流程。", 92)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  const featuredOpportunity = root.querySelector("[data-home-featured-opportunity]");
  if (featuredOpportunity && data.opportunity) {
    const audience = compactJoin([tagsByGroup(data.opportunity, "customer", 2), tagsByGroup(data.opportunity, "function", 2)], "企业老板 / 业务负责人");
    const entry = data.opportunity.link || "opportunities.html";
    featuredOpportunity.innerHTML = `
      ${homeMemo("OPPORTUNITY")}
      <span class="home-v2-label">今日重点机会</span>
      <h3>${data.opportunity.title}</h3>
      <p>${homeShort(data.opportunity.oneLine || summaryText(data.opportunity), 96)}</p>
      <div class="home-v2-fit-grid">
        <div><span>适合谁</span><p>${audience}</p></div>
        <div><span>不适合谁</span><p>流程还说不清、只想追模型演示的团队</p></div>
        <div><span>前置条件</span><p>${data.opportunity.stage || "已有具体流程和可观察数据"}</p></div>
      </div>
      <div class="home-v2-opportunity-notes">
        <p><span>潜在价值</span>降低试错成本</p>
        <p><span>风险提醒</span>先看责任边界</p>
        <p><span>起步方式</span>先从一个高频流程试</p>
      </div>
      <a class="home-v2-button home-v2-button-primary" href="${entry}">查看机会解码</a>
    `;
  }

  const opportunityList = root.querySelector("[data-home-more-opportunities]");
  if (opportunityList) {
    const opportunities = (data.contentIndex?.opportunities || []).slice(0, 3);
    const items = opportunities.length ? opportunities : data.signals.slice(0, 3).map((signal) => ({
      title: signal.title,
      oneLine: summaryText(signal),
      link: signal.link || "signals.html",
      tags: signal.tags || [],
    }));
    opportunityList.innerHTML = items.map((item, index) => `
      <a class="home-v2-opportunity-row fade-in" href="${item.link || `opportunity-detail.html?id=${item.slug}`}" style="animation-delay:${index * 60}ms">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          ${homeMemo(index === 0 ? "OPPORTUNITY" : "WATCH")}
          <h3>${item.title}</h3>
          <p>${homeShort(item.oneLine || summaryText(item), 74)}</p>
          <small>${compactJoin([tagsByGroup(item, "customer", 1), tagsByGroup(item, "track", 1)], "机会方向")} · ${item.stage || "观察中"}</small>
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
        ${homeMemo("INSIGHT BRIEF")}
        <span class="home-v2-label">${data.brief.issue || "商业内参"}</span>
        <div class="home-v2-brief-rule"></div>
        <h2><span>Agent 控制层、</span><span>工程治理与企业交付链</span></h2>
        <p>${homeShort(data.brief.summary?.slice(0, 2).join(" ") || "为企业经营者整理本周值得继续看的 AI 商业变化。", 128)}</p>
      </div>
      ${insightToc()}
      <div class="home-v2-brief-facts">
        <div><span>本期问题</span><p>${homeShort(coreQuestion, 62)}</p></div>
        <div><span>适合谁读</span><p>企业老板 / 行业操盘手 / 投资观察者</p></div>
        <div><span>阅读重点</span><p>流程影响 / 机会边界 / 后续观察</p></div>
      </div>
      <a class="home-v2-button home-v2-button-secondary" href="brief.html">查看详情 <span aria-hidden="true">→</span></a>
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
    opportunities: "opportunity",
  }[value.trim()] || value.trim());
  text.split(",").map((item) => item.trim()).filter(Boolean).forEach((part) => {
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
  ].map((token) => token.replace(/^signals:/, "signal:").replace(/^trends:/, "trend:").replace(/^points:/, "point:").replace(/^opportunities:/, "opportunity:"));
}

function assetKeys(item, type) {
  const base = [`${type}:${item.id}`];
  if (type === "signal") base.push(...(item.structuredRefs || []).map((id) => `signal:${id}`));
  if (type === "opportunity") base.push(`opportunity:${item.slug}`);
  return base.filter(Boolean);
}

function assetStore() {
  return {
    signal: data.contentIndex?.signals || data.signals || [],
    point: data.contentIndex?.points || [],
    trend: data.contentIndex?.trends || [],
    opportunity: data.contentIndex?.opportunities || [data.opportunity].filter(Boolean),
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
  const href = type === "signal" ? item.link : (type === "opportunity" ? `opportunity-detail.html?id=${item.slug}` : null);
  const typeLabel = { signal: "信号", point: "观点", trend: "趋势", opportunity: "机会" }[type];
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
    ["point", "相关观点"],
    ["trend", "趋势线索"],
    ["opportunity", "相关机会"],
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
      ["机会", related.opportunity],
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
      if (status) {
        status.textContent = form.dataset.success || "已记录页面演示状态。";
        status.classList.remove("is-error");
      }
      if (["login.html", "register.html", "checkout.html"].includes(getPageName())) {
        window.localStorage?.setItem("wavesight-member-state", "logged-in");
        const formData = new FormData(form);
        const email = cleanText(formData.get("email") || "");
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
      label: "PUBLIC PREVIEW",
      title: "当前是公开预览状态",
      body: "你可以阅读今日要点、部分关键信号和商业内参样张。",
      action: "申请访问",
      href: "register.html",
      items: ["今日要点公开页", "关键信号列表", "商业内参样张", "会员申请页"],
    },
    "logged-in": {
      label: "ACCESS REQUESTED",
      title: "当前是申请访问状态",
      body: "页面已记录本地登录或申请状态。真实审核、邀请码和权限需要后续服务接入。",
      action: "确认访问申请",
      href: "checkout.html",
      items: ["商业内参预览", "账户访问状态", "会员方案说明", "申请确认页"],
    },
    member: {
      label: "MEMBER PREVIEW",
      title: "当前是会员完整态预览",
      body: "这只是页面预览状态，用于确认完整会员层页面节奏。",
      action: "阅读商业内参",
      href: "brief.html?state=member",
      items: ["完整内参预览", "来源摘要", "热力变化", "机会观察", "往期参照"],
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
    host.innerHTML = `<div class="section-head"><div><span class="eyebrow">Builders</span><h2>Builders 观点</h2></div><p>暂无可展示的 builder 观点。</p></div>`;
    return;
  }
  const activeDate = data.contentIndex?.activeDate || "";
  const todays = points.filter((p) => p.date === activeDate);
  const sample = (todays.length ? todays : points).slice(0, 3);
  host.innerHTML = `
    <div class="section-head">
      <div>
        <span class="eyebrow">Builders</span>
        <h2>Builders 观点</h2>
      </div>
      <p>作为判断校准，不替代事实来源。<a href="builders.html" style="text-decoration:underline">查看观点变化</a></p>
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
    }).join("") || `<p>暂无匹配的 builders 观点。</p>`;

    if (dateIndex) {
      dateIndex.innerHTML = sortedDays.map((day, index) => {
        const items = byDay.get(day) || [];
        const people = new Set(items.map((p) => builderUsername(p.sourceUrl || p.source_url)).filter(Boolean));
        const metrics = `${items.length} 观点${people.size ? ` / ${people.size} 人` : ""}`;
        const title = cleanText(items[0]?.title || "Builders 观点");
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
  sourceBoundary: "一线观点能帮助修正判断，但不能替代公司公告、客户证据、财报、监管文件或一手材料。",
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

function signalSystemUrlDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
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
  const text = String(item?.brief || "");
  const urls = [...text.matchAll(/https?:\/\/[^\s)]+/g)].map((match) => match[0].replace(/[，。；]+$/u, ""));
  if (!urls.length) {
    return signalSystemSourceFallback(item).map(([name, grade, url, fact]) => ({ name, grade, url, fact }));
  }
  return urls.slice(0, 5).map((url, index) => ({
    name: signalSystemUrlDomain(url) || `来源 ${index + 1}`,
    grade: index === 0 ? "S级" : index === 1 ? "A级" : "B级",
    url,
    fact: "补充事件、产品、客户采用或市场反馈中的关键信息。",
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
    status: sources.some((source) => source.grade === "S级") ? "已核对来源" : "继续观察",
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
        <span>Source Ledger</span>
        <strong>${evidence.total} 条来源</strong>
      </div>
      <div class="source-ledger-bars">
        ${[
          ["S", evidence.s, "一手材料"],
          ["A", evidence.a, "可信报道"],
          ["B", evidence.b, "背景观察"],
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
      ${["同公司反复出现", "同趋势持续升温", "同机会开始成形", "线索正在扩散", "7D / 30D / 90D"].map((label, index) => `
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
  const labels = tags.length ? tags : ["信号", "趋势", "机会", "一线观点", "风险"];
  return `
    <div class="signal-cluster-map" aria-label="信号关系图">
      <svg viewBox="0 0 420 260" role="img">
        <defs>
          <linearGradient id="signalLine" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#c8a766" stop-opacity=".85"/>
            <stop offset="1" stop-color="#0d355c" stop-opacity=".34"/>
          </linearGradient>
        </defs>
        <path d="M56 190 C126 108 172 150 218 92 S324 72 366 132" fill="none" stroke="url(#signalLine)" stroke-width="1.5"/>
        <path d="M58 214 C132 172 184 190 242 150 S324 138 374 82" fill="none" stroke="rgba(7,24,39,.18)" stroke-width="1.2"/>
        ${[[56,190],[158,128],[236,92],[318,108],[366,132]].map(([cx, cy], index) => `
          <circle cx="${cx}" cy="${cy}" r="${index === 0 ? 7 : 5}" fill="${index === 0 ? "#071827" : "#c8a766"}"/>
        `).join("")}
        <g opacity=".45">
          ${[70,130,190,250,310,370].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="220" stroke="#071827" stroke-width=".5"/>`).join("")}
          ${[64,104,144,184].map((y) => `<line x1="42" y1="${y}" x2="382" y2="${y}" stroke="#071827" stroke-width=".5"/>`).join("")}
        </g>
      </svg>
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
      <svg viewBox="0 0 420 160" role="img">
        <path d="M34 118 C76 90 100 96 138 68 S210 72 254 46 S324 58 382 28" fill="none" stroke="#071827" stroke-width="2"/>
        <path d="M34 130 C92 122 130 112 180 100 S258 84 382 78" fill="none" stroke="rgba(7,24,39,.24)" stroke-width="1.4"/>
        ${[34,138,254,382].map((x, index) => `<circle cx="${x}" cy="${[118,68,46,28][index]}" r="4.5" fill="#c8a766"/>`).join("")}
        <line x1="34" y1="132" x2="390" y2="132" stroke="rgba(7,24,39,.16)"/>
        <line x1="34" y1="28" x2="34" y2="132" stroke="rgba(7,24,39,.16)"/>
      </svg>
      <div class="signal-system-stack">
        ${["S级来源", "A级来源", "B级来源"].map((label, index) => `
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
          ${evidenceBadge(`${evidence.s}S / ${evidence.a}A / ${evidence.b}B`)}
          ${evidenceBadge(evidence.status)}
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
    sourceName: evidence.sources[0]?.name || "来源整理中",
    sourceUrl: evidence.sources[0]?.url || "#",
    incrementalFact: evidence.sources[0]?.fact || summaryText(item),
    trendCandidate: track,
    opportunityCandidate: signalSystemTags(item, "scenario", 1)[0] || "继续观察",
    depthStatus: index < 3 ? "值得细看" : index < 8 ? "继续观察" : "线索记录",
  };
}

function structuredSignalRow(item, index) {
  const signal = structuredSignalAdapter(item, index);
  return `
    <a class="structured-signal-row" href="structured-signal.html?id=${signal.slug || signal.id}">
      <span>${signal.structuredId}</span>
      <strong>${signal.event}</strong>
      <p>${signal.variable}</p>
      <em>${signal.sourceGrade} · ${signal.sourceName}</em>
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
  if (/steipete/i.test(url)) return { name: "Peter Steinberger", title: "Developer Tools Founder" };
  if (/sama/i.test(url)) return { name: "Sam Altman", title: "OpenAI CEO" };
  if (/levie/i.test(url)) return { name: "Aaron Levie", title: "Box CEO" };
  if (/karpathy|youtube/i.test(url + title)) return { name: "Andrej Karpathy", title: "AI Researcher / Builder" };
  if (/anthropic\.com\/engineering/i.test(url)) return { name: "Anthropic Engineering", title: "Claude Code Team" };
  if (/claude\.com|anthropic/i.test(url + title)) return { name: "Anthropic", title: "Claude Product Team" };
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
          <small class="builder-role">${identity.title} · ${profile.org} · ${signalSystemDate(latest.date)}</small>
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
            <small>${identity.title} · ${profile.org}</small>
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
  return `
    <section class="perspective-header">
      <div>
        <span class="signal-system-label">BUILDER PERSPECTIVES</span>
        <h1>行业一线怎么看</h1>
        <p>用一线建造者、投资人和研究者的观点，修正我们对 AI 商业变化的判断。</p>
      </div>
      <div class="perspective-controls">
        <form class="signal-search-bar" role="search">
          <label class="sr-only" for="builderSearch">搜索一线观点</label>
          <input id="builderSearch" type="search" placeholder="人物、公司、关注领域、观点状态">
        </form>
        <div class="signal-filter-bar">
          ${["建造者", "创始人", "投资人", "研究者", "新看法", "判断修正", "转向", "冲突观点"].map((label) => `<button type="button">${label}</button>`).join("")}
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
          <span class="signal-system-label">PERSPECTIVE INDEX</span>
          <h2>今日最值得看的观点</h2>
        </div>
        <p>先看会改变判断权重的几条，再进入完整观点流。</p>
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
          <span class="signal-system-label">VIEW STREAM</span>
          <h2>人物观点流</h2>
        </div>
      </div>
      <div class="perspective-grid">
        ${profiles.slice(4, 10).map((profile, index) => perspectiveCard(profile, index + 4)).join("")}
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
        <span class="signal-system-label">CALIBRATION</span>
        <h2>最近怎么看</h2>
        <p>观点是判断校准来源，不是事实主证据。</p>
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
          <span class="signal-system-label">BUILDER PROFILE</span>
          <h1>${identity.name || "一线观点"}</h1>
          <p>${identity.title} · ${profile.org || "公开观点来源"}</p>
          <div class="signal-system-chipline">
            ${["Builder", "Founder", "VC", "Research", "Operator"].slice(0, 3).map(evidenceBadge).join("")}
          </div>
        </div>
      </div>
      <aside class="builder-profile-summary">
        ${[
          ["近 7 天", "看是否出现新判断"],
          ["近 30 天", "看判断是否延续或修正"],
          ["近 90 天", "看变量是否转向"],
          ["最近状态", "新看法 / 延续 / 修正"],
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
        <span>CURRENT VIEW</span>
        <h2>当前观点摘要</h2>
      </div>
      <div class="current-view-list">
        ${rows.slice(0, 4).map((row, index) => `
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
        <span>VIEW TIMELINE</span>
        <h2>观点时间线</h2>
      </div>
      <div class="view-timeline">
        ${rows.slice(0, 6).map((row, index) => `
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
        <span>SHIFT ANALYSIS</span>
        <h2>观点变化</h2>
      </div>
      <div class="shift-analysis-grid">
        ${[
          ["最近变化类型", "新判断正在出现，但仍需要和事实来源分开看。"],
          ["变化发生在哪个变量", perspectiveTopics({}, first).join(" / ") || "客户采用 / 商业化 / 组织采用"],
          ["变化的意义", "它帮助校准主判断的边界，而不是替代公司公告或客户证据。"],
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
        <span>RELATED LINKS</span>
        <h2>关联主题与内容</h2>
        <p>X / Podcast / YouTube / Blog 只作为观点来源，不能替代公司公告、客户证据、财报、监管文件或一手材料。</p>
      </div>
      <div class="structured-related-list">
        ${trackingIndexItems().slice(0, 6).map((item, index) => `
          <a href="${item.href || item.link || "#"}">
            <span>${item.type || "相关"} · ${String(index + 1).padStart(2, "0")}</span>
            <strong>${item.title || item.id}</strong>
            <p>${summaryText(item)}</p>
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
          <p>${summaryText(item)}</p>
        </a>
      `).join("")}
    </div>
  `;
}

function trackingIndexItems() {
  const signals = (data.contentIndex?.signals || data.signals || []).slice(0, 4).map((item) => ({ ...item, type: "信号", href: item.link || `signal-detail.html?id=${item.slug}` }));
  const trends = (data.contentIndex?.trends || []).slice(0, 3).map((item) => ({ ...item, type: "趋势", href: "signals.html#calibration" }));
  const opportunities = (data.contentIndex?.opportunities || []).slice(0, 3).map((item) => ({ ...item, type: "机会", href: `opportunity-detail.html?id=${item.slug}` }));
  const builders = signalSystemBuilderProfiles().slice(0, 3).map((profile) => ({
    type: "一线观点",
    title: builderIdentityForPoint(profile.latest, profile).name,
    brief: profile.latest?.interpretation || profile.latest?.title,
    href: `builder-detail.html?id=${encodeURIComponent(profile.handle)}`,
  }));
  return [...signals, ...trends, ...opportunities, ...builders];
}

function trackingIndexCompact() {
  const signals = data.contentIndex?.signals || data.signals || [];
  const trends = data.contentIndex?.trends || [];
  const opportunities = data.contentIndex?.opportunities || [];
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
      title: "机会方向成形",
      items: opportunities.slice(0, 3).map((item, index) => ({
        name: item.title,
        date: signalSystemDate(item.date),
        count: `${index + 1} 条信号`,
        href: `opportunity-detail.html?id=${item.slug || item.id}`,
      })),
    },
    {
      title: "一线观点变化",
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
  const clean = cleanText(title);
  if (!clean.includes("：")) return clean;
  const [lead, rest] = clean.split(/：(.+)/);
  return `${lead}：<br><span>${rest}</span>`;
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
        ["阅读时间", "12 分钟"],
        ["来源结构", `${evidence.s}S / ${evidence.a}A / ${evidence.b}B`],
        ["观察窗口", "7D / 30D / 90D"],
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
        <span class="signal-system-label">EDITORIAL JUDGMENT</span>
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
  const roles = ["确认事件主体与官方表述", "补充客户采用线索", "提供第三方报道与传播热度", "补充市场语境"];
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
    <div class="business-variable-map" aria-label="商业变量关系图">
      <svg viewBox="0 0 520 300" role="img">
        <g opacity=".36">
          ${[80,160,240,320,400,480].map((x) => `<line x1="${x}" y1="42" x2="${x}" y2="258" stroke="#071827" stroke-width=".5"/>`).join("")}
          ${[76,126,176,226].map((y) => `<line x1="42" y1="${y}" x2="478" y2="${y}" stroke="#071827" stroke-width=".5"/>`).join("")}
        </g>
        <circle cx="260" cy="150" r="42" fill="rgba(255,253,248,.9)" stroke="#071827" stroke-width="1.2"/>
        <text x="260" y="145" text-anchor="middle" fill="#071827" font-size="13" font-weight="700">CX Agent</text>
        <text x="260" y="164" text-anchor="middle" fill="rgba(7,24,39,.58)" font-size="11">平台变量</text>
        ${[[112,88],[408,78],[432,208],[96,214],[260,48],[260,254]].map(([x,y], index) => `
          <line x1="260" y1="150" x2="${x}" y2="${y}" stroke="${index < 2 ? "#c8a766" : "rgba(7,24,39,.34)"}" stroke-width="1"/>
          <circle cx="${x}" cy="${y}" r="7" fill="${index < 2 ? "#c8a766" : "#071827"}"/>
        `).join("")}
      </svg>
      <div>
        ${nodes.map((label, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${label}</span>`).join("")}
      </div>
    </div>
  `;
}

function evidenceBoundaryList(signal) {
  const items = [
    ["Evidence Gap", "缺少可公开核对的客户采用规模和持续付费数据。"],
    ["Risk Boundary", signal.counter || "仍需观察真实采用规模、付费意愿和责任边界。"],
    ["Watch Variable", "上线周期、事故成本和人工接管机制仍会影响商业化速度。"],
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
        <span class="signal-system-label">WATCH NEXT</span>
        <h2>接下来怎么看</h2>
        <div class="tracking-tags">
          ${tags.map((tag, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${tag}</span>`).join("")}
        </div>
      </div>
      <div class="watch-next-timeline">
        ${["7天：看是否有更多一手材料", "30天：看客户采用和付费迹象", "90天：看能否沉淀为趋势或机会"].map((text, index) => `
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
        <span class="signal-system-label">Signal Status</span>
        <h2>${signal.depthStatus === "值得细看" ? "继续观察，接近升级线" : signal.depthStatus}</h2>
        <div>
          ${[
            ["当前判断", signal.depthStatus === "值得细看" ? "继续观察，接近升级线" : signal.depthStatus],
            ["信号状态", signal.sourceGrade === "S级" ? "已核对来源" : "继续观察"],
            ["来源结构", signal.sourceGrade],
            ["关联趋势", signal.trendCandidate],
            ["可能机会", signal.opportunityCandidate],
            ["观察窗口", "7D / 30D / 90D"],
          ].map(([label, value]) => `<p><span>${label}</span><strong>${value}</strong></p>`).join("")}
        </div>
      </aside>
    </section>
  `;
}

function structuredSourceLedger(signal) {
  const roles = ["确认事件主体", "补充外部关注", "提供背景线索"];
  return `
    <section class="structured-source-ledger">
      <div class="report-section-head">
        <span>Source Ledger</span>
        <h2>来源与关键事实</h2>
        <p>只展示对本信号判断有帮助的信息。</p>
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
            <i>${roles[index] || "补充判断线索"}</i>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function structuredMiniMap(signal) {
  const nodes = [signal.variable, signal.trendCandidate, signal.opportunityCandidate, "证据边界"].filter(Boolean);
  return `
    <div class="structured-mini-map" aria-label="信号关系图">
      <svg viewBox="0 0 380 220" role="img">
        <g opacity=".34">
          ${[72,144,216,288].map((x) => `<line x1="${x}" y1="32" x2="${x}" y2="188" stroke="#071827" stroke-width=".5"/>`).join("")}
          ${[64,110,156].map((y) => `<line x1="42" y1="${y}" x2="338" y2="${y}" stroke="#071827" stroke-width=".5"/>`).join("")}
        </g>
        <circle cx="190" cy="110" r="34" fill="rgba(255,253,248,.92)" stroke="#071827" stroke-width="1.1"/>
        <text x="190" y="106" text-anchor="middle" fill="#071827" font-size="12" font-weight="700">Signal</text>
        <text x="190" y="123" text-anchor="middle" fill="rgba(7,24,39,.58)" font-size="10">${signal.structuredId}</text>
        ${[[72,64],[308,72],[304,164],[82,160]].map(([x,y], index) => `
          <line x1="190" y1="110" x2="${x}" y2="${y}" stroke="${index < 2 ? "#c8a766" : "rgba(7,24,39,.34)"}" stroke-width="1"/>
          <circle cx="${x}" cy="${y}" r="6" fill="${index < 2 ? "#c8a766" : "#071827"}"/>
        `).join("")}
      </svg>
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
    ["证据边界", signal.counter || "仍需补充更多客户采用、付费意愿和长期效果数据。"],
    ["趋势候选", `${signal.trendCandidate}，但目前仍按继续观察处理。`],
  ];
  return `
    <section class="structured-commercial-read">
      <div>
        <div class="report-section-head">
          <span>Commercial Read</span>
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
        <span>Upgrade Watch</span>
        <h2>是否升级为深度信号？</h2>
      </div>
      <div class="upgrade-watch-grid">
        ${[
          ["当前建议", signal.depthStatus === "值得细看" ? "继续观察，接近升级线" : "继续观察，暂不升级"],
          ["升级理由", "已出现商业变量，但公开证据还不足以支撑深度报告。"],
          ["缺口证据", "需要更多客户采用、产品数据、企业采购或监管材料。"],
          ["触发条件", "后续出现一手材料，或多来源互相印证时，可进入深度分析。"],
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
        <span>Related Path</span>
        <h2>相关追踪</h2>
      </div>
      <div class="structured-related-list">
        ${items.map((item, index) => `
          <a href="${item.href || item.link || "#"}">
            <span>${item.type || "相关"} · ${String(index + 1).padStart(2, "0")}</span>
            <strong>${item.title || item.id}</strong>
            <p>${summaryText(item)}</p>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function mountSignalSystemPage() {
  const root = document.querySelector("[data-signal-system]");
  if (!root) return;
  const frontSignals = (data.signals || []).slice(0, 5);
  const lead = frontSignals[0] || data.contentIndex?.signals?.[0] || {};
  const leadEvidence = signalSystemEvidence(lead);
  const structured = (data.contentIndex?.signals || []).slice(0, 8);
  const builders = signalSystemBuilderProfiles().slice(0, 2);
  root.innerHTML = `
    <section class="signal-page-header signal-filter-header">
      <div class="signal-header-title">
        <strong>关键信号</strong>
        <span>从 AI 热点中筛出值得继续跟踪的商业变化</span>
      </div>
      <div class="signal-header-controls signal-header-controls-wide">
        <div class="date-range-switcher" aria-label="日期范围">
          ${["今日", "昨日", "近7天", "近30天"].map((label, index) => `<button type="button" class="${index === 0 ? "active" : ""}">${label}</button>`).join("")}
        </div>
        <form class="signal-search-bar" role="search">
          <label class="sr-only" for="signalSearch">搜索关键信号</label>
          <input id="signalSearch" type="search" placeholder="公司、产品、人物、关键词、商业变量">
        </form>
        <div class="signal-filter-bar">
          ${["AI Agent", "企业工作流", "客户采用", "来源等级", "风险", "观点人物"].map((label) => `<button type="button">${label}</button>`).join("")}
        </div>
      </div>
    </section>

    <section class="lead-signal-panel">
      <div class="lead-signal-copy">
        <span class="signal-system-label">今日最值得看的信号 · ${lead.id || "FS.001"}</span>
        <h2>${lead.title}</h2>
        <p class="lead-signal-judgment">${lead.judgment || summaryText(lead)}</p>
        <p>${summaryText(lead, lead.counter)}</p>
        <div class="signal-system-chipline">
          ${evidenceBadge(`${leadEvidence.total} 条来源`)}
          ${evidenceBadge(`${leadEvidence.s}S / ${leadEvidence.a}A / ${leadEvidence.b}B`)}
          ${evidenceBadge("已核对来源")}
          ${evidenceBadge("观察窗口 7D / 30D / 90D")}
        </div>
        <div class="lead-signal-actions">
          <a class="signal-primary-action" href="${lead.link || `signal-detail.html?id=${lead.slug}`}">阅读完整判断</a>
          <button type="button" class="signal-secondary-action" data-open-sources>查看来源</button>
        </div>
      </div>
      <div class="lead-signal-visual">
        ${signalClusterMap(lead)}
        ${sourceLedgerMini(leadEvidence)}
        <p class="lead-boundary-note"><strong>Risk Boundary</strong>${lead.counter || "仍需观察真实采用规模、付费意愿和责任边界。"}</p>
      </div>
    </section>

    <section class="signal-library" id="library">
      <div class="signal-system-section-head">
        <div>
          <span class="signal-system-label">信号台账</span>
          <h2>精选深读与结构化扫描</h2>
        </div>
      </div>
      <div class="front-signal-grid">
        ${frontSignals.slice(0, 3).map(signalFrontCard).join("")}
      </div>
      <div class="structured-signal-panel">
        ${trackingFilterStrip()}
        <div class="structured-signal-head">
          <span>结构化扫描</span>
          <strong>${structured.length} 条值得继续看的变化</strong>
        </div>
        <div class="structured-signal-list">
          ${structured.map(structuredSignalRow).join("")}
        </div>
      </div>
    </section>

    <section class="calibration-panel" id="calibration">
      <div class="calibration-panel-head">
        <span class="signal-system-label">Evidence & Calibration</span>
        <h2>证据和一线看法</h2>
      </div>
      <div class="calibration-left">
        <span class="signal-system-label">Source Ledger</span>
        <h3>这件事有多实</h3>
        <p>热度上升不等于结论成立。先看来源，再看还缺什么。</p>
        ${insightChart("trend")}
        <div class="evidence-summary-strip">
          ${signalSystemMetricCard("S级来源", leadEvidence.s, "一手材料")}
          ${signalSystemMetricCard("A级来源", leadEvidence.a, "可信报道")}
          ${signalSystemMetricCard("证据状态", leadEvidence.status, "仍保留边界")}
        </div>
      </div>
      <div class="calibration-right">
        <div class="signal-system-section-head compact-head">
          <div>
            <span class="signal-system-label">Builder Calibration</span>
            <h3>行业一线怎么看</h3>
          </div>
          <a href="builders.html">查看全部</a>
        </div>
        <div class="builder-opinion-list">
          ${builders.map(builderOpinionCard).join("")}
        </div>
        <p class="source-boundary-note">${signalSystemCopy.sourceBoundary}</p>
      </div>
    </section>

    <section class="tracking-index" id="tracking">
      <div class="signal-system-section-head">
        <div>
          <span class="signal-system-label">Tracking Index</span>
          <h2>追踪索引</h2>
        </div>
      </div>
      ${trackingIndexCompact()}
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
}

function mountFrontSignalDetail() {
  const root = document.querySelector("[data-front-signal-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const all = [...(data.signals || []), ...(data.contentIndex?.signals || [])];
  const signal = all.find((item) => item.slug === slug || item.id === slug) || data.signals?.[0] || {};
  const evidence = signalSystemEvidence(signal);
  const builders = signalSystemBuilderProfiles().slice(0, 2);
  root.innerHTML = `
    <article class="front-signal-detail">
      <header class="report-header">
        <span class="signal-system-label">FRONT SIGNAL REPORT · ${signal.id || "FS-20260510-01"}</span>
        <h1>${reportTitleHtml(signal.title)}</h1>
        <p>${summaryText(signal, signal.judgment)}</p>
        ${reportMetaBar(signal, evidence)}
      </header>
      ${editorialJudgmentCard(signal, evidence)}
      <section class="report-section">
        <div class="report-section-head">
          <span>FACT LEDGER</span>
          <h2>发生了什么</h2>
          <p>只保留对判断有帮助的信息。</p>
        </div>
        ${factLedger(signal)}
      </section>
      <section class="report-section">
        <div class="report-section-head">
          <span>WHY IT MATTERS</span>
          <h2>为什么值得看</h2>
          <p>放到企业里看，重点不只在融资本身，而在它碰到的商业变量。</p>
        </div>
        ${commercialVariableGrid(signal)}
      </section>
      <section class="report-section business-variable-section">
        <div>
          <div class="report-section-head"><span>COMMERCIAL VARIABLES</span><h2>商业变量拆解</h2></div>
          <p>${summaryText(signal, signal.counter)}</p>
          <div class="variable-brief-list">
            ${["客户是谁：大中型企业和企业服务负责人", "谁可能付费：承担服务效率与流程成本的业务负责人", "替代什么流程：客服、售后、工单与质检中的重复执行环节", "为什么现在发生：模型能力、平台交付和企业工作流同时成熟"].map((text, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><p>${text}</p></div>`).join("")}
          </div>
        </div>
        ${businessVariableMap(signal)}
      </section>
      <section class="report-section evidence-calibration-report">
        <div>
          <div class="report-section-head"><span>EVIDENCE BOUNDARY</span><h2>还不能下结论的部分</h2></div>
          ${evidenceBoundaryList(signal)}
        </div>
        <div>
          <div class="report-section-head"><span>BUILDER CALIBRATION</span><h2>行业一线怎么看</h2></div>
          <div class="builder-opinion-list compact">
            ${builders.map(builderOpinionCard).join("")}
          </div>
          <p class="source-boundary-note">${signalSystemCopy.sourceBoundary}</p>
        </div>
      </section>
      ${watchNextPanel(signal)}
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
  const profiles = signalSystemBuilderProfiles();
  root.innerHTML = `
    ${perspectiveHeader()}
    ${featuredPerspectives(profiles)}
    ${perspectiveGrid(profiles)}
    ${calibrationSnapshot(profiles)}
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

  const opportunity = document.querySelector("[data-opportunity-preview]");
  if (opportunity) {
    opportunity.innerHTML = `
      <article class="card">
        <a class="card-inner" href="${data.opportunity.link}">
          <span class="kicker"><img class="kicker-icon" src="assets/vi-components/01-symbol-system/opportunity.svg" alt="">机会观察</span>
          <h3>${data.opportunity.title}</h3>
          <p>${data.opportunity.oneLine}</p>
          ${tagRow(data.opportunity)}
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

function dailyStatusRail() {
  const labels = ["05.04", "05.05", "05.06", "05.07", "05.08", "05.09", "05.10"];
  const states = ["完整日", "降级日", "完整日", "证据不足日", "无深挖日", "完整日", "完整日"];
  return `
    <div class="daily-brief-status-current">
      <span></span>
      <strong>完整日</strong>
      <em>Evidence checked</em>
    </div>
    <div class="daily-brief-status-rail">
      ${labels.map((label, index) => `
        <div class="daily-brief-status-day ${index === labels.length - 1 ? "is-active" : ""}">
          <i></i>
          <span>${label}</span>
          <small>${states[index]}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function dailyIssueStatus() {
  return `
    <div class="daily-newsletter-issue-meta">
      <div><span>Issue No.</span><strong>DB.20260510</strong></div>
      <div><span>Published</span><strong>${data.meta.date}</strong></div>
      <div><span>Window</span><strong>24H / 7D / 30D</strong></div>
      <div><span>Status</span><strong>完整日 · 来源已核对</strong></div>
    </div>
    ${dailyStatusRail()}
  `;
}

function dailySummaryCard() {
  const keywords = ["Agent", "可控运营", "治理", "交付成本", "企业工作流"];
  return `
    <dl>
      <div><dt>今日主线</dt><dd>${data.daily.title}</dd></div>
      <div><dt>判断强度</dt><dd>中高</dd></div>
      <div><dt>观察窗口</dt><dd>24H / 7D / 30D</dd></div>
      <div><dt>当前状态</dt><dd>升温，仍需边界校准</dd></div>
    </dl>
    <div class="daily-brief-key-chips">
      ${keywords.map((item) => `<span>${item}</span>`).join("")}
    </div>
  `;
}

function dailyCalibrationNote() {
  const item = (data.daily.calibration || [])[0];
  if (!item) return "";
  return `
    <div class="daily-newsletter-note">
      <span>EDITOR NOTE</span>
      <strong>判断校准：强化</strong>
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
      <h3>${signal.title}</h3>
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
      <h3>${signal.title}</h3>
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
      <strong>${signal.title}</strong>
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
    <span class="daily-newsletter-memo">TREND TEMPERATURE</span>
    <h3>热度正在从模型能力转向企业可控运营</h3>
    ${dailySparkline([24, 30, 34, 41, 50, 58, 72])}
    <div class="daily-newsletter-stackbar">
      <i style="--w:38%"><span>官方</span></i>
      <i style="--w:31%"><span>媒体</span></i>
      <i style="--w:19%"><span>观点</span></i>
      <i style="--w:12%"><span>社区</span></i>
    </div>
    <div class="daily-newsletter-status-tags">
      <span>Rising</span>
      <span>Limited Evidence</span>
      <span>Watch</span>
    </div>
  `;
}

function dailyNewsletterRiskPanel() {
  const risks = [
    ["来源偏差", "融资、发布和媒体报道更容易被看见，真实部署摩擦可能滞后出现。"],
    ["证据缺口", data.daily.risk || "客户采用、预算归属和部署周期仍需继续观察。"],
    ["商业变量", "可控运营是否成为采购标准，还取决于责任边界、权限和人类接管机制。"],
  ];
  return `
    <span class="daily-newsletter-memo">RISK BOUNDARY</span>
    <h3>风险不是警报，是判断边界</h3>
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

function dailyOpportunityMarkup() {
  const opportunities = (data.contentIndex?.opportunities || []).slice(0, 3);
  const fallback = data.opportunity ? [data.opportunity] : [];
  return (opportunities.length ? opportunities : fallback).map((item, index) => `
    <article class="daily-brief-opportunity">
      <span class="daily-brief-number">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${homeShort(item.oneLine || summaryText(item), 118)}</p>
        <dl>
          <div><dt>商业变量</dt><dd>${dailyMetaByGroup(item, "scenario", "流程承接与付费边界", 2)}</dd></div>
          <div><dt>客户场景</dt><dd>${dailyMetaByGroup(item, "customer", "中大型企业 / 业务团队", 2)}</dd></div>
          <div><dt>边界条件</dt><dd>责任、数据和部署周期仍需观察</dd></div>
        </dl>
        <a href="${item.link || `opportunity-detail.html?id=${item.slug}`}">进入机会解码</a>
      </div>
    </article>
  `).join("");
}

function dailyNewsletterOpportunityMarkup() {
  const opportunities = (data.contentIndex?.opportunities || []).slice(0, 3);
  const fallback = data.opportunity ? [data.opportunity] : [];
  return (opportunities.length ? opportunities : fallback).map((item, index) => `
    <article class="daily-newsletter-opportunity">
      <span class="daily-newsletter-number">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${homeShort(item.oneLine || summaryText(item), 96)}</p>
        <div class="daily-newsletter-opportunity-meta">
          <span>商业变量：${dailyMetaByGroup(item, "scenario", "流程承接与付费边界", 1)}</span>
          <span>客户场景：${dailyMetaByGroup(item, "customer", "中大型企业", 1)}</span>
          <span>边界：责任、数据和部署周期</span>
        </div>
      </div>
      <a href="${item.link || `opportunity-detail.html?id=${item.slug}`}">机会解码 ↗</a>
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

function dailyViewMarkup() {
  const points = (data.daily.calibration || data.contentIndex?.points || []).slice(0, 3);
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
  [...(data.signals || []), ...(data.contentIndex?.opportunities || [])].forEach((item) => {
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

function dailyRelatedMarkup() {
  const related = [
    ...(data.signals || []).slice(0, 2).map((item) => ({ ...item, type: "Front Signal", href: item.link || "signals.html" })),
    ...(data.contentIndex?.signals || []).slice(0, 1).map((item) => ({ ...item, type: "Structured Signal", href: item.link || "signals.html" })),
    ...(data.contentIndex?.trends || []).slice(0, 1).map((item) => ({ ...item, type: "Trend", href: "brief.html" })),
    ...(data.contentIndex?.opportunities || []).slice(0, 1).map((item) => ({ ...item, type: "Opportunity", href: item.link || `opportunity-detail.html?id=${item.slug}` })),
    ...(data.daily.calibration || []).slice(0, 1).map((item) => ({ ...item, type: "Point", href: item.sourceUrl || "builders.html" })),
  ];
  return related.map((item, index) => `
    <a class="daily-newsletter-related-card" href="${item.href}">
      <span>${item.type} · ${String(index + 1).padStart(2, "0")}</span>
      <h3>${item.title}</h3>
      <p>${homeShort(summaryText(item, item.interpretation || item.oneLine), 92)}</p>
      <small>${(item.date || item.originalDate || data.meta.date).replaceAll("-", ".")}</small>
    </a>
  `).join("");
}

function textFromSection(item, names = [], fallback = "") {
  const sections = item?.sections || [];
  const picked = sections.find(([title]) => names.some((name) => String(title).includes(name)));
  return opportunitySafeText(picked?.[1] || fallback);
}

function opportunitySafeText(value = "") {
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

function opportunityHref(item) {
  return item?.slug ? `opportunity-detail.html?id=${encodeURIComponent(item.slug)}` : (item?.link || "opportunity-detail.html");
}

function opportunityId(item, index = 0) {
  const rawDate = String(item?.date || item?.updated || data.meta?.date || "2026.05.11").replaceAll(".", "").replaceAll("-", "").slice(0, 8);
  return `OP-${rawDate}-${String(index + 1).padStart(2, "0")}`;
}

function opportunityAudience(item) {
  return compactJoin([tagsByGroup(item, "customer", 2), tagsByGroup(item, "function", 2)], "业务负责人 / 产品与运营团队");
}

function opportunityScene(item) {
  return compactJoin([tagsByGroup(item, "scenario", 2), tagsByGroup(item, "function", 2)], "客户场景开始清晰");
}

function opportunityEvidenceState(item) {
  const stage = cleanText(item?.stage || "");
  if (/观察|缺|不足|风险/.test(stage) || item?.evidenceGaps) return "观察中方向";
  return stage || "证据正在增强";
}

function opportunityStatus(index, item) {
  const state = opportunityEvidenceState(item);
  if (/不足|缺/.test(state) || item?.evidenceGaps) return index % 3 === 0 ? "仍需补证" : "观察中";
  return index % 2 === 0 ? "证据增强" : "可进入深挖";
}

function opportunityGap(item) {
  return opportunitySafeText(item?.evidenceGaps || textFromSection(item, ["反证", "限制"], "仍需观察客户采用、付费意愿和交付成本。"));
}

function opportunityVariableItems(item) {
  const raw = textFromSection(item, ["观察变量", "建议关注变量"], "客户上线规模、公开定价锚点、效果指标、责任条款、模板复用率。");
  return raw
    .split(/[；;。]/)
    .map((part) => cleanText(part))
    .filter(Boolean)
    .slice(0, 5);
}

function opportunitySources(item) {
  const related = relatedAssets(item, "opportunity");
  const signals = (related.signal || data.signals || []).slice(0, 2);
  const trends = (related.trend || data.contentIndex?.trends || []).slice(0, 1);
  return [...signals.map((signal) => ["Signal", signal.title]), ...trends.map((trend) => ["Trend", trend.title])].slice(0, 3);
}

function opportunityWatchItems() {
  const list = data.contentIndex?.opportunities || [];
  const primary = data.opportunity?.slug;
  const picked = list.filter((item) => item.slug !== primary).slice(0, 6);
  if (picked.length) return picked;
  return list.slice(1, 7);
}

function opportunityCoverGraphic() {
  return `
    <div class="opportunity-cover-graphic" aria-hidden="true">
      <svg viewBox="0 0 520 280" role="presentation" focusable="false">
        <path class="cover-grid" d="M32 50H488M32 106H488M32 162H488M32 218H488M108 28V246M214 28V246M320 28V246M426 28V246" />
        <path class="cover-muted" d="M42 218 C110 174 176 188 244 132 S360 94 478 120" />
        <path class="cover-main" d="M42 230 C124 162 178 172 246 116 S350 72 478 62" />
        <circle cx="124" cy="162" r="5" />
        <circle cx="246" cy="116" r="5" />
        <circle cx="478" cy="62" r="5" />
      </svg>
    </div>
  `;
}

function opportunitySourceStrip(item) {
  const sources = opportunitySources(item);
  if (!sources.length) return "";
  return `
    <div class="opportunity-source-strip">
      ${sources.map(([type, title]) => `
        <span><em>${type}</em>${opportunitySafeText(homeShort(title, 34))}</span>
      `).join("")}
    </div>
  `;
}

function opportunityFrameworkMarkup() {
  const dimensions = [
    ["01", "信号密度", "是否有多个独立信号指向同一方向？"],
    ["02", "客户场景", "是否对应真实客户痛点，而不是概念热度？"],
    ["03", "付费变量", "是否可能影响收入、成本、效率、风险或预算？"],
    ["04", "证据边界", "哪些数据仍然缺失，哪些判断还不能下结论？"],
    ["05", "观察窗口", "7 / 30 / 90 天分别要看什么？"],
  ];
  return `
    <div class="opportunity-section-head">
      <div>
        <span class="opportunity-section-kicker">OPPORTUNITY FRAMEWORK</span>
        <h2>我们如何判断一个方向是否值得解码</h2>
      </div>
      <p>观澜AI不贩卖机会答案，只把信号、趋势、场景、变量和边界放到同一张判断图里。</p>
    </div>
    <div class="opportunity-framework-grid">
      <div class="opportunity-path-card">
        <span class="opportunity-card-label">OPPORTUNITY PATH</span>
        <div class="opportunity-path-graphic" aria-label="信号到机会路径图">
          ${["信号", "趋势", "客户场景", "商业变量", "机会方向"].map((item, index) => `<span style="--i:${index}">${item}</span>`).join("")}
          <svg viewBox="0 0 620 260" role="presentation" focusable="false">
            <path class="path-grid" d="M54 58H568M54 130H568M54 202H568M154 34V226M278 34V226M402 34V226M526 34V226" />
            <path class="path-main" d="M64 182 C136 110 206 120 278 92 S406 80 468 126 S538 166 582 78" />
            <path class="path-muted" d="M64 202 C154 162 224 178 300 138 S432 112 582 132" />
            <circle cx="64" cy="182" r="5" />
            <circle cx="278" cy="92" r="5" />
            <circle cx="468" cy="126" r="5" />
            <circle cx="582" cy="78" r="5" />
          </svg>
        </div>
      </div>
      <div class="opportunity-dimension-list">
        ${dimensions.map(([num, title, text]) => `
          <article>
            <span>${num}</span>
            <strong>${title}</strong>
            <p>${text}</p>
          </article>
        `).join("")}
      </div>
      <div class="opportunity-evidence-card">
        <span class="opportunity-card-label">EVIDENCE GAP</span>
        <h3>证据缺口图</h3>
        ${[["已有证据", 62], ["缺失证据", 38], ["继续观察", 74]].map(([label, value]) => `
          <div class="opportunity-proof-bar"><span>${label}</span><i style="--w:${value}%"></i><em>${value}%</em></div>
        `).join("")}
      </div>
      <div class="opportunity-timeline-card">
        <span class="opportunity-card-label">WATCH STATUS</span>
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
      body: "可阅读本期标题、主判断、部分来源摘要、热力变化概览和往期标题。",
      note: "完整内参、来源账本、风险边界和往期判断追踪保留在会员层。",
    },
    "logged-in": {
      label: "登录用户",
      cta: "阅读本期完整内参",
      title: "目录与试读",
      body: "可阅读完整目录、更多来源摘要和部分精读预览。",
      note: "完整热力变化、证据边界和机会观察保留在会员层。",
    },
    member: {
      label: "会员",
      cta: "阅读完整内参",
      title: "会员完整态",
      body: "可阅读完整正文、完整来源账本、热力变化、证据边界、机会观察和往期参照。",
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
    ["01", "主判断", "本期最值得先看的变化"],
    ["02", "关键来源摘要", "哪些事实推动判断变化"],
    ["03", "热力变化", "哪些方向升温或进入争议"],
    ["04", "商业变量", "哪些事会影响预算、流程和团队"],
    ["05", "证据边界", "哪些地方还缺材料"],
    ["06", "机会观察", "哪些方向进入内参跟踪"],
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
    role: index === 0 ? "加强本期主判断" : "补充观察边界",
  }));
  const pointItems = (data.brief?.evidence?.points || []).slice(0, 3).map((item, index) => ({
    type: "观点校准",
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
    <div class="brief-cover-graphic" aria-hidden="true">
      <svg viewBox="0 0 520 260" role="presentation" focusable="false">
        <path class="grid-line" d="M28 42H492M28 96H492M28 150H492M28 204H492M88 24V228M188 24V228M288 24V228M388 24V228" />
        <path class="trend-line muted" d="M34 194 C102 168 138 176 196 136 S302 92 378 116 S458 76 492 54" />
        <path class="trend-line" d="M34 206 C118 162 150 170 214 118 S316 62 390 88 S458 58 492 38" />
        <circle cx="214" cy="118" r="5" />
        <circle cx="390" cy="88" r="5" />
        <circle cx="492" cy="38" r="5" />
      </svg>
    </div>
  `;
}

function mountDaily() {
  if (getPageName() !== "daily.html") return;
  setText("[data-daily-date]", data.meta.date);
  setText("[data-daily-title]", data.daily.title);

  const status = document.querySelector("[data-daily-issue-status]");
  if (status) status.innerHTML = dailyIssueStatus();

  const judgment = document.querySelector("[data-daily-judgment]");
  if (judgment) {
    const points = data.daily.points || [];
    judgment.innerHTML = `
      <p>${data.daily.dek}</p>
      ${points.map((item) => `<p>${item}</p>`).join("")}
    `;
  }

  const summary = document.querySelector("[data-daily-summary]");
  if (summary) summary.innerHTML = dailySummaryCard();

  const chart = document.querySelector("[data-daily-mini-chart]");
  if (chart) chart.innerHTML = dailySparkline([18, 24, 26, 35, 45, 52, 66]);

  const calibration = document.querySelector("[data-daily-calibration]");
  if (calibration) calibration.innerHTML = dailyCalibrationNote();

  const primarySignals = document.querySelector("[data-daily-primary-signals]");
  if (primarySignals) primarySignals.innerHTML = (data.signals || []).slice(0, 3).map(dailyNewsletterSignal).join("");

  const compressedFacts = document.querySelector("[data-daily-compressed-facts]");
  if (compressedFacts) compressedFacts.innerHTML = (data.signals || []).slice(3, 8).map(dailyCompressedFact).join("");

  const trend = document.querySelector("[data-daily-trend-panel]");
  if (trend) trend.innerHTML = dailyNewsletterTrendPanel();

  const risk = document.querySelector("[data-daily-risk-panel]");
  if (risk) risk.innerHTML = dailyNewsletterRiskPanel();

  const opportunities = document.querySelector("[data-daily-opportunities]");
  if (opportunities) opportunities.innerHTML = dailyNewsletterOpportunityMarkup();

  const watch = document.querySelector("[data-daily-watch]");
  if (watch) watch.innerHTML = dailyNewsletterWatchMarkup();

  const related = document.querySelector("[data-daily-related]");
  if (related) related.innerHTML = dailyRelatedMarkup();

  mountDailyKeywords();
}

function mountOpportunity() {
  const node = document.querySelector("[data-opportunity-card]");
  if (!node) return;
  const opportunity = data.opportunity || data.contentIndex?.opportunities?.[0];
  if (!opportunity) return;
  const summary = opportunitySafeText(textFromSection(opportunity, ["机会判断", "价值来源"], "客户场景开始清晰，但商业变量尚未完全验证，适合进入后续机会解码。"));
  node.innerHTML = `
    <article class="opportunity-feature-card">
      <div class="opportunity-feature-copy">
        <span class="opportunity-section-kicker">LATEST OPPORTUNITY REPORT</span>
        <div class="opportunity-id-row">
          <span>${opportunityId(opportunity, 0)}</span>
          <span>${opportunity.updated || opportunity.date || data.meta.date}</span>
        </div>
        <h2>${opportunitySafeText(opportunity.title)}</h2>
        <p class="opportunity-feature-lede">${opportunitySafeText(opportunity.oneLine || summaryText(opportunity))}</p>
        <p class="opportunity-feature-summary">${homeShort(summary, 220)}</p>
        <dl class="opportunity-facts">
          <div><dt>证据状态</dt><dd>${opportunityEvidenceState(opportunity)}</dd></div>
          <div><dt>适合关注</dt><dd>${opportunityAudience(opportunity)}</dd></div>
          <div><dt>主要反证</dt><dd>${opportunityGap(opportunity)}</dd></div>
          <div><dt>观察窗口</dt><dd>7D / 30D / 90D</dd></div>
        </dl>
        ${opportunitySourceStrip(opportunity)}
        <a class="button primary" href="${opportunityHref(opportunity)}">阅读报告</a>
      </div>
      <aside class="opportunity-report-cover" aria-label="机会报告封面">
        <div class="opportunity-cover-brand">
          <img src="assets/brand/logo-wavesight-reference-horizontal.svg" alt="观澜AI Wavesight AI">
          <span>WAVESIGHT AI OPPORTUNITY</span>
        </div>
        <div class="opportunity-cover-meta">
          <span>${opportunity.updated || opportunity.date || data.meta.date}</span>
          <span>${opportunityId(opportunity, 0)}</span>
        </div>
        <h3>${opportunitySafeText(opportunity.title)}</h3>
        <p>${homeShort(opportunitySafeText(opportunity.oneLine || summaryText(opportunity)), 86)}</p>
        ${opportunityCoverGraphic()}
        <div class="opportunity-cover-tags">${tagRow(opportunity, 4)}</div>
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

function mountOpportunityIndex() {
  const node = document.querySelector("[data-opportunity-index]");
  if (!node || !data.contentIndex?.opportunities) return;
  node.innerHTML = data.contentIndex.opportunities.slice(0, 8).map((item, index) => `
    <a class="opportunity-history-row" href="${opportunityHref(item)}">
      <span>${opportunityId(item, index)}</span>
      <div>
        <strong>${opportunitySafeText(item.title)}</strong>
        <p>${homeShort(opportunitySafeText(item.oneLine || summaryText(item)), 120)}</p>
      </div>
      <em>${opportunityStatus(index, item)}</em>
    </a>
  `).join("");
}

function mountOpportunityRelations() {
  const node = document.querySelector("[data-opportunity-relations]");
  if (!node || !data.contentIndex?.opportunities) return;
  const relations = ["延续", "加强", "待补证", "修正"];
  node.innerHTML = data.contentIndex.opportunities.slice(0, 4).map((opportunity, index) => `
    <article class="opportunity-brief-link">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${opportunitySafeText(opportunity.title)}</h3>
        <p>${index === 0 ? "与本期商业内参的 Agent 控制层判断形成参照。" : homeShort(opportunitySafeText(opportunity.oneLine || summaryText(opportunity)), 96)}</p>
        <small>${relations[index] || "继续观察"} · ${opportunityEvidenceState(opportunity)}</small>
      </div>
    </article>
  `).join("");
}

function mountOpportunityWatch() {
  const node = document.querySelector("[data-opportunity-watch]");
  if (!node) return;
  const items = opportunityWatchItems();
  node.innerHTML = items.map((item, index) => `
    <article class="opportunity-watch-item">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <div class="opportunity-watch-title">
          <h3>${opportunitySafeText(item.title)}</h3>
          <em>${opportunityStatus(index, item)}</em>
        </div>
        <p>${homeShort(opportunitySafeText(item.oneLine || summaryText(item)), 132)}</p>
        <dl>
          <div><dt>适用场景</dt><dd>${opportunityScene(item)}</dd></div>
          <div><dt>证据缺口</dt><dd>${opportunityGap(item)}</dd></div>
          <div><dt>继续看</dt><dd>${opportunityVariableItems(item).slice(0, 2).map(opportunitySafeText).join(" / ")}</dd></div>
        </dl>
      </div>
      <a href="${opportunityHref(item)}">查看观察</a>
    </article>
  `).join("");
}

function mountOpportunityFramework() {
  const node = document.querySelector("[data-opportunity-framework]");
  if (!node) return;
  node.innerHTML = opportunityFrameworkMarkup();
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
    const benefitItems = ["阅读完整内参", "查看来源与证据", "获取趋势热力变化", "追踪往期判断", "解锁机会解码"];
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
      <h2>本期主判断</h2>
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
        <div><span>会员可解锁</span><strong>完整来源账本、热力变化、证据边界</strong></div>
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
      ? ["完整正文", "完整来源账本", "完整热力变化", "证据边界", "机会观察", "往期参照", "下载 / 收藏 / 分享"]
      : ["标题与主判断", "部分来源摘要", "热力变化概览", "往期标题", "完整内参"];
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
      <h3>主判断</h3>
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
      ${locked ? `<div class="brief-soft-lock">完整来源账本和证据边界保留在会员层。</div>` : ""}
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
        ${["信号", "来源", "证据", "趋势", "机会", "风险", "后续观察"].map((item, index) => `<span style="--i:${index}">${item}</span>`).join("")}
        <svg viewBox="0 0 520 260" role="presentation" focusable="false">
          <path d="M74 130 C138 56 212 58 270 126 S382 198 452 94" />
          <path d="M74 130 C146 176 224 188 300 128 S386 64 452 94" />
          <circle cx="74" cy="130" r="5" />
          <circle cx="185" cy="72" r="5" />
          <circle cx="270" cy="126" r="5" />
          <circle cx="370" cy="178" r="5" />
          <circle cx="452" cy="94" r="5" />
        </svg>
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
    const rights = ["每期完整内参", "趋势热力变化", "证据与来源账本", "机会观察", "风险边界", "往期判断追踪"];
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
    : "<p>暂无可展示的机会拆解。</p>";
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
        <h2>机会拆解</h2>
        ${analysisSection}
      </div>
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
        <div><dt>延伸阅读</dt><dd><a href="${data.opportunity.link}">${data.opportunity.title}</a></dd></div>
        ${groupedTagList(signal)}
      </dl>
    </aside>
  `;
}

function mountDailyDetail() {
  const root = document.querySelector("[data-daily-detail]");
  if (!root) return;
  root.innerHTML = `
    <article class="article">
      <span class="eyebrow">Daily</span>
      <h1>${data.daily.title}</h1>
      <p class="article-lede">${data.daily.dek}</p>
      <div class="article-section"><h2>主判断</h2><ul class="point-list">${data.daily.points.map((item) => `<li>${item}</li>`).join("")}</ul></div>
      <div class="article-section"><h2>今日关键信号</h2><div class="grid">${data.signals.map(signalCard).join("")}</div></div>
      <div class="article-section"><h2>相关观察</h2>${activeRelationRows(3)}</div>
      <div class="article-section"><h2>仍需留意</h2><p>${data.daily.risk}</p></div>
    </article>
    <aside class="side-rail">
      <h2>今日侧记</h2>
      <dl>
        <div><dt>日期</dt><dd>${data.meta.date}</dd></div>
        <div><dt>阅读时长</dt><dd>8 分钟</dd></div>
        <div><dt>延伸阅读</dt><dd><a href="${data.opportunity.link}">${data.opportunity.title}</a></dd></div>
      </dl>
    </aside>
  `;
}

function mountOpportunityDetail() {
  const root = document.querySelector("[data-opportunity-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const opportunity = data.contentIndex?.opportunities?.find((item) => item.slug === slug) || data.opportunity;
  const related = relatedAssets(opportunity, "opportunity");
  const trendItems = (related.trend?.length ? related.trend : data.contentIndex?.trends || []).slice(0, 2);
  const pointItems = (related.point?.length ? related.point : data.contentIndex?.points || []).slice(0, 2);
  const variables = opportunityVariableItems(opportunity);
  const section = (names, title, fallback) => `
    <div class="article-section">
      <h2>${title}</h2>
      ${articleText(textFromSection(opportunity, names, fallback))}
    </div>
  `;
  root.innerHTML = `
    <article class="article opportunity-report">
      <span class="eyebrow">Opportunity Report</span>
      <h1>${opportunity.title}</h1>
      <p class="article-lede">${opportunity.oneLine}</p>
      <div class="article-section">
        <h2>一句话机会判断</h2>
        <div class="judgment-box">${opportunity.oneLine || summaryText(opportunity)}</div>
      </div>
      ${section(["触发信号", "变化背景"], "变化背景", "相关变化正在从单点发布走向流程、客户和交付层面的连续观察。")}
      ${section(["具体问题", "首要感受者"], "问题与对象", "这个方向会先影响那些流程清楚、客户响应压力大的组织。")}
      ${section(["流程变化"], "流程变化", "流程正在从人工接力转向 AI 参与接待、识别、分发、复核和兜底。")}
      ${section(["价值来源"], "价值来源", "价值来自响应效率、服务一致性和可复用交付能力。")}
      <div class="article-section">
        <h2>趋势背景</h2>
        <div class="opportunity-evidence-stack">
          ${trendItems.map((item) => `<p><strong>${item.title}</strong>${cleanText(item.judgment || item.evidenceGaps || summaryText(item))}</p>`).join("") || articleText(textFromSection(opportunity, ["趋势"], "趋势证据仍在积累，暂不强行画图。"))}
        </div>
      </div>
      <div class="article-section">
        <h2>观点校准</h2>
        <div class="opportunity-evidence-stack">
          ${pointItems.map((item) => `<p><strong>${item.title}</strong>${cleanText(item.calibrates || item.interpretation || summaryText(item))}</p>`).join("") || articleText(textFromSection(opportunity, ["观点"], "外部观点只作为判断校准，不替代事实来源。"))}
        </div>
      </div>
      ${section(["反证", "限制"], "风险 / 反证", opportunityGap(opportunity))}
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
        ${relationPanel(opportunity, "opportunity") || "<p>暂无更多延伸观察。</p>"}
      </div>
    </article>
    <aside class="side-rail">
      <h2>报告侧记</h2>
      <dl>
        <div><dt>发布时间</dt><dd>${opportunity.updated}</dd></div>
        <div><dt>证据状态</dt><dd>${opportunityEvidenceState(opportunity)}</dd></div>
        <div><dt>适合关注</dt><dd>${opportunityAudience(opportunity)}</dd></div>
        <div><dt>主要缺口</dt><dd>${opportunityGap(opportunity)}</dd></div>
        ${groupedTagList(opportunity)}
      </dl>
    </aside>
  `;
}

function boot() {
  document.body.classList.add(`page-${getPageName().replace(".html", "").replaceAll("-", "-")}`);
  mountHeader();
  mountFooter();
  mountAuthForms();
  mountAccountPage();
  mountBuilders();
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
  mountOpportunity();
  mountOpportunityWatch();
  mountOpportunityFramework();
  mountSignalArchive();
  mountSignalRelations();
  mountOpportunityIndex();
  mountOpportunityRelations();
  mountBrief();
  mountBriefAssets();
  mountSignalDetail();
  mountDailyDetail();
  mountOpportunityDetail();
}

document.addEventListener("DOMContentLoaded", boot);
