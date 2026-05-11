import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = path.join(root, "executable-svg");

const colors = {
  ink: "#071827",
  deep: "#0B1D2A",
  blue: "#0D355C",
  wave: "#1F5D8C",
  gray: "#6F7F8F",
  mountain: "#A7ADB4",
  border: "#E5E8EC",
  bg: "#F7F4EF",
  paper: "#FFFFFF",
  gold: "#C8A766",
};

const css = `
  :root {
    --gl-ink: ${colors.ink};
    --gl-deep: ${colors.deep};
    --gl-blue: ${colors.blue};
    --gl-wave: ${colors.wave};
    --gl-gray: ${colors.gray};
    --gl-mountain: ${colors.mountain};
    --gl-border: ${colors.border};
    --gl-bg: ${colors.bg};
    --gl-paper: ${colors.paper};
    --gl-gold: ${colors.gold};
  }
  * { box-sizing: border-box; }
  text { font-family: "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", Arial, sans-serif; fill: var(--gl-ink); letter-spacing: 0; }
  .serif { font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif; }
  .mono { font-family: "Inter", "IBM Plex Sans", "Avenir", Arial, sans-serif; letter-spacing: .12em; }
  .label { fill: var(--gl-gray); font-size: 12px; }
  .title { fill: var(--gl-ink); font-size: 22px; font-weight: 700; }
  .subtitle { fill: var(--gl-gray); font-size: 11px; }
  .caption { fill: var(--gl-gray); font-size: 10px; }
  .fine { stroke: var(--gl-border); stroke-width: 1; }
  .gold { stroke: var(--gl-gold); }
  .blue { stroke: var(--gl-blue); }
  .wave { stroke: var(--gl-wave); }
  .card { fill: rgba(255,255,255,.86); stroke: var(--gl-border); stroke-width: 1; }
  .soft { filter: drop-shadow(0 10px 24px rgba(7,24,39,.06)); }
  .no-fill { fill: none; stroke-linecap: round; stroke-linejoin: round; }
`;

function svg({ width = 360, height = 220, title, body, extraDefs = "" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(title)}">
  <title>${escape(title)}</title>
  <defs>
    <linearGradient id="paperShade" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#F7F4EF"/>
    </linearGradient>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6.4" refY="4" orient="auto">
      <path d="M1 1 L7 4 L1 7" fill="none" stroke="${colors.blue}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    ${extraDefs}
  </defs>
  <style>${css}</style>
  <rect width="${width}" height="${height}" fill="url(#paperShade)"/>
  ${body}
</svg>
`;
}

function escape(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function textBlock(x, y, title, en, desc = "") {
  return `
    <text x="${x}" y="${y}" class="title serif" text-anchor="middle">${title}</text>
    <text x="${x}" y="${y + 22}" class="subtitle mono" text-anchor="middle">${en}</text>
    ${desc ? `<text x="${x}" y="${y + 46}" class="caption" text-anchor="middle">${desc}</text>` : ""}
  `;
}

const waveMark = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})" class="no-fill">
    <path d="M6 22 C28 8 70 8 92 22" stroke="${colors.gold}" stroke-width="2"/>
    <path d="M0 40 C20 29 39 31 56 39 C76 49 98 45 118 32" stroke="${colors.ink}" stroke-width="4"/>
    <path d="M3 51 C24 41 40 43 58 50 C80 59 99 55 117 45" stroke="${colors.wave}" stroke-width="3"/>
    <path d="M8 61 C28 54 43 55 60 60 C80 67 96 64 111 56" stroke="${colors.mountain}" stroke-width="2"/>
  </g>
`;

const components = [
  {
    dir: "01-symbol-system",
    name: "signal.svg",
    title: "Signal 信号",
    body: `${waveMark(113, 54, 1.12)}${textBlock(180, 150, "信号", "Signal", "识别重要信号，提示变化发生点。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "key-judgment.svg",
    title: "Point 关键判断",
    body: `<circle cx="180" cy="82" r="36" fill="none" stroke="${colors.blue}" stroke-width="2"/><circle cx="180" cy="82" r="14" fill="${colors.blue}"/>${textBlock(180, 150, "关键判断", "Point", "聚焦核心结论，帮助快速定位重点。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "trend.svg",
    title: "Trend 趋势",
    body: `<polyline points="102,102 132,78 156,88 190,62 214,70 258,38" fill="none" stroke="${colors.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow)"/>${textBlock(180, 150, "趋势", "Trend", "表示发展方向与趋势变化。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "opportunity.svg",
    title: "Opportunity 机会",
    body: `<path d="M136 54 H196 M136 54 V116 M224 54 H244 V74 M224 116 H244 V96" fill="none" stroke="${colors.blue}" stroke-width="3" stroke-linecap="square"/><path d="M224 54 H244 V74" fill="none" stroke="${colors.gold}" stroke-width="3"/>${textBlock(180, 150, "机会", "Opportunity", "识别潜在机会，强调探索与可能性。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "quote.svg",
    title: "Quote 引述",
    body: `<text x="122" y="106" class="serif" font-size="92" font-weight="700" fill="${colors.blue}">“</text><text x="198" y="106" class="serif" font-size="92" font-weight="700" fill="${colors.blue}">”</text>${textBlock(180, 150, "引述", "Quote", "引用观点或原文，增强权威与可信度。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "divider.svg",
    title: "Divider 分隔线",
    body: `<line x1="102" y1="65" x2="258" y2="65" stroke="${colors.gold}" stroke-width="1.5"/><line x1="102" y1="85" x2="258" y2="85" stroke="${colors.blue}" stroke-width="1.5"/><line x1="102" y1="105" x2="258" y2="105" stroke="${colors.mountain}" stroke-width="1.5"/>${textBlock(180, 150, "分隔线", "Divider", "划分信息结构，提升阅读清晰度。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "timeline-node.svg",
    title: "Timeline Node 时间节点",
    body: `<line x1="180" y1="50" x2="180" y2="122" stroke="${colors.blue}" stroke-width="2"/><circle cx="180" cy="50" r="15" fill="${colors.bg}" stroke="${colors.blue}" stroke-width="2"/>${textBlock(180, 150, "时间节点", "Timeline Node", "标记关键时间点，构建判断脉络。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "data-snapshot.svg",
    title: "Data Snapshot 数据快照",
    body: `<rect x="114" y="60" width="18" height="58" fill="${colors.mountain}"/><rect x="148" y="36" width="18" height="82" fill="${colors.wave}"/><rect x="182" y="82" width="18" height="36" fill="${colors.blue}"/><rect x="216" y="52" width="18" height="66" fill="${colors.ink}"/>${textBlock(180, 150, "数据快照", "Data Snapshot", "呈现关键数据指标，快速捕捉信号。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "rating-chip.svg",
    title: "Rating Chip 评级标签",
    body: `<rect x="112" y="62" width="136" height="50" rx="25" fill="#F8F1E3" stroke="${colors.gold}"/><text x="180" y="96" class="serif" font-size="30" font-weight="700" fill="${colors.gold}" text-anchor="middle">A+</text>${textBlock(180, 150, "评级标签", "Rating Chip", "表达判断结果，便于横向比较。")}`,
  },
  {
    dir: "01-symbol-system",
    name: "source-note.svg",
    title: "Source Note 来源说明",
    body: `<path d="M132 38 H210 L232 60 V126 H132 Z" fill="none" stroke="${colors.blue}" stroke-width="2"/><path d="M210 38 V60 H232" fill="none" stroke="${colors.blue}" stroke-width="2"/><line x1="150" y1="78" x2="214" y2="78" stroke="${colors.gray}"/><line x1="150" y1="94" x2="214" y2="94" stroke="${colors.gray}"/><line x1="150" y1="110" x2="196" y2="110" stroke="${colors.gray}"/>${textBlock(180, 150, "来源说明", "Source Note", "标注信息来源，保证信息透明。")}`,
  },
  {
    dir: "02-information-elements",
    name: "issue-number.svg",
    title: "Issue Number 期号编号",
    body: `<rect x="54" y="66" width="252" height="70" rx="8" class="card"/><text x="82" y="111" class="serif" font-size="24">No.</text><text x="136" y="113" class="serif" font-size="38" fill="${colors.blue}">042</text><line x1="232" y1="112" x2="282" y2="112" stroke="${colors.gold}" stroke-width="2"/><text x="54" y="162" class="caption">用于标识内参期号，便于归档与检索。</text>`,
  },
  {
    dir: "02-information-elements",
    name: "date-chip.svg",
    title: "Date 日期",
    body: `<rect x="74" y="54" width="212" height="92" rx="8" class="card"/><rect x="96" y="76" width="30" height="30" rx="4" fill="none" stroke="${colors.blue}" stroke-width="2"/><line x1="96" y1="86" x2="126" y2="86" stroke="${colors.blue}"/><text x="146" y="96" class="mono" font-size="16" fill="${colors.blue}">2025.05.20</text><text x="146" y="120" class="caption">周二</text><text x="74" y="174" class="caption">显示发布日期，明确时间信息。</text>`,
  },
  {
    dir: "02-information-elements",
    name: "member-brief-tag.svg",
    title: "Member Brief Tag 会员内参标签",
    body: `<rect x="100" y="70" width="160" height="50" rx="8" fill="${colors.ink}"/><text x="180" y="102" font-size="18" fill="${colors.paper}" text-anchor="middle" font-weight="700">会员内参</text><text x="72" y="168" class="caption">识别会员专属内容，强化身份与价值。</text>`,
  },
  {
    dir: "02-information-elements",
    name: "reading-time.svg",
    title: "Reading Time 阅读时长",
    body: `<circle cx="118" cy="92" r="24" fill="none" stroke="${colors.blue}" stroke-width="2"/><line x1="118" y1="92" x2="118" y2="77" stroke="${colors.blue}" stroke-width="2"/><line x1="118" y1="92" x2="132" y2="101" stroke="${colors.blue}" stroke-width="2"/><text x="172" y="102" class="serif" font-size="34">8 分钟</text><text x="72" y="168" class="caption">预估阅读时间，帮助读者规划阅读。</text>`,
  },
  {
    dir: "02-information-elements",
    name: "key-judgment-block.svg",
    title: "Key Judgment Block 核心判断框",
    body: `<rect x="36" y="44" width="288" height="126" rx="8" class="card"/><g transform="translate(58 62) scale(.38)">${waveMark(0, 0, 1)}</g><text x="112" y="82" font-size="15" font-weight="700">核心判断</text><text x="64" y="112" font-size="13">中国消费复苏呈现结构分化，</text><text x="64" y="136" font-size="13">高确定性赛道仍具机会窗口。</text>`,
  },
  {
    dir: "02-information-elements",
    name: "quote-block.svg",
    title: "Quote Block 引述框",
    body: `<rect x="34" y="52" width="292" height="118" rx="8" class="card"/><text x="58" y="88" class="serif" font-size="42" fill="${colors.blue}">“</text><text x="98" y="92" font-size="15">长期价值来自于对趋势的尊重，</text><text x="98" y="118" font-size="15">而非对波动的预测。</text><text x="246" y="148" class="caption">-- 彼得·林奇</text>`,
  },
  {
    dir: "02-information-elements",
    name: "data-card.svg",
    title: "Data Card 数据卡",
    body: `<rect x="44" y="42" width="272" height="140" rx="10" class="card soft"/><text x="66" y="72" class="caption">社零总额（当月同比）</text><text x="66" y="112" class="serif" font-size="38" fill="${colors.blue}">+5.4%</text><polyline points="174,144 196,137 218,124 240,130 262,116 292,96" fill="none" stroke="${colors.blue}" stroke-width="2"/><circle cx="292" cy="96" r="4" fill="${colors.blue}"/>`,
  },
  {
    dir: "02-information-elements",
    name: "trend-timeline.svg",
    title: "Trend Timeline 趋势时间线",
    body: `<line x1="58" y1="88" x2="302" y2="88" stroke="${colors.blue}" stroke-width="2"/><g fill="${colors.bg}" stroke="${colors.blue}" stroke-width="2"><circle cx="78" cy="88" r="8"/><circle cx="154" cy="88" r="8"/><circle cx="230" cy="88" r="8"/><circle cx="292" cy="88" r="8"/></g><text x="78" y="120" class="mono" font-size="12" text-anchor="middle">2023</text><text x="154" y="120" class="mono" font-size="12" text-anchor="middle">2024</text><text x="230" y="120" class="mono" font-size="12" text-anchor="middle">2025</text><text x="292" y="120" class="mono" font-size="12" text-anchor="middle">2026+</text><text x="58" y="164" class="caption">呈现阶段演进，清晰时间脉络。</text>`,
  },
  {
    dir: "02-information-elements",
    name: "opportunity-matrix.svg",
    title: "Matrix Card 机会矩阵",
    body: `<line x1="74" y1="158" x2="296" y2="158" stroke="${colors.blue}" marker-end="url(#arrow)"/><line x1="74" y1="158" x2="74" y2="40" stroke="${colors.blue}" marker-end="url(#arrow)"/><rect x="96" y="48" width="86" height="48" fill="#EFF3F5" stroke="${colors.border}"/><rect x="182" y="48" width="86" height="48" fill="#E2E8EE" stroke="${colors.border}"/><rect x="96" y="96" width="86" height="48" fill="#F7F4EF" stroke="${colors.border}"/><rect x="182" y="96" width="86" height="48" fill="#EFF3F5" stroke="${colors.border}"/><text x="139" y="77" font-size="11" text-anchor="middle">高影响·低确定</text><text x="225" y="77" font-size="11" text-anchor="middle">高影响·高确定</text><text x="139" y="125" font-size="11" text-anchor="middle">低影响·低确定</text><text x="225" y="125" font-size="11" text-anchor="middle">低影响·高确定</text><text x="282" y="178" class="caption">确定性</text><text x="24" y="48" class="caption" transform="rotate(-90 24 48)">影响力</text>`,
  },
  {
    dir: "02-information-elements",
    name: "source-footer.svg",
    title: "Source Footer 数据来源脚注",
    body: `<rect x="34" y="68" width="292" height="82" rx="8" class="card"/><text x="58" y="100" font-size="13" font-weight="700">数据来源：</text><text x="132" y="100" font-size="13">国家统计局、Wind、观澜AI研究院</text><text x="58" y="126" font-size="13">注：数据截至 2025.05.19</text>`,
  },
  {
    dir: "03-layout-principles",
    name: "cover-page.svg",
    title: "Cover Page 封面页",
    body: `<rect x="42" y="36" width="276" height="156" rx="10" class="card soft"/><rect x="58" y="54" width="244" height="112" rx="6" fill="#E6EDF2"/><path d="M58 142 C90 124 118 126 144 136 C184 151 232 126 302 92 V166 H58 Z" fill="${colors.mountain}" opacity=".35"/><line x1="72" y1="154" x2="140" y2="154" stroke="${colors.gold}"/><text x="42" y="218" class="caption">大标题聚焦主题，辅以关键数据或信号。</text>`,
  },
  {
    dir: "03-layout-principles",
    name: "article-detail-page.svg",
    title: "Article Detail Page 正文详情页",
    body: `<rect x="42" y="30" width="276" height="168" rx="10" class="card"/><rect x="62" y="56" width="44" height="28" rx="4" fill="#E5E8EC"/><line x1="122" y1="60" x2="278" y2="60" stroke="${colors.border}" stroke-width="4"/><line x1="122" y1="78" x2="244" y2="78" stroke="${colors.border}" stroke-width="4"/><line x1="62" y1="106" x2="282" y2="106" stroke="${colors.border}"/><line x1="62" y1="128" x2="282" y2="128" stroke="${colors.border}"/><line x1="62" y1="150" x2="230" y2="150" stroke="${colors.border}"/><rect x="244" y="96" width="38" height="38" rx="4" fill="#D9E1E8"/>`,
  },
  {
    dir: "03-layout-principles",
    name: "side-decision-rail.svg",
    title: "Side Decision Rail 侧边决策栏",
    body: `<rect x="58" y="30" width="244" height="168" rx="10" class="card"/><rect x="72" y="54" width="48" height="30" rx="4" fill="#E5E8EC"/><line x1="132" y1="58" x2="220" y2="58" stroke="${colors.border}" stroke-width="4"/><line x1="132" y1="76" x2="246" y2="76" stroke="${colors.border}" stroke-width="4"/><rect x="238" y="48" width="42" height="42" rx="4" fill="#D9E1E8"/><g fill="#D9E1E8"><rect x="238" y="106" width="42" height="22" rx="4"/><rect x="238" y="138" width="42" height="22" rx="4"/></g><line x1="72" y1="106" x2="204" y2="106" stroke="${colors.border}"/><line x1="72" y1="128" x2="204" y2="128" stroke="${colors.border}"/><line x1="72" y1="150" x2="204" y2="150" stroke="${colors.border}"/>`,
  },
  {
    dir: "04-application-samples",
    name: "brief-cover.svg",
    title: "Brief Cover 内参封面",
    body: `<rect x="32" y="28" width="296" height="184" rx="12" fill="#F2F6F8" stroke="${colors.border}"/><path d="M32 146 C76 108 118 116 158 132 C206 150 254 112 328 70 V212 H32 Z" fill="${colors.mountain}" opacity=".42"/><path d="M32 160 C82 136 122 136 164 150 C212 166 260 148 328 116" fill="none" stroke="${colors.gold}" opacity=".75"/><g transform="translate(56 46) scale(.35)">${waveMark(0, 0, 1)}</g><text x="56" y="104" class="serif" font-size="21" font-weight="700">中国消费复苏的结构分化</text><text x="56" y="132" class="serif" font-size="21" font-weight="700">与高确定性机会</text><text x="56" y="168" class="caption">观澜 AI 商业内参</text><text x="270" y="60" class="serif" font-size="16" fill="${colors.gold}">No.042</text>`,
  },
  {
    dir: "04-application-samples",
    name: "data-card-set.svg",
    title: "Data Card Set 数据卡片组",
    body: [0, 1, 2, 3].map((i) => `<g transform="translate(${30 + i * 82} 46)"><rect width="70" height="112" rx="8" class="card"/><text x="12" y="24" class="caption">${["社零", "固定资产", "出口", "PMI"][i]}</text><text x="12" y="58" class="serif" font-size="22" fill="${colors.blue}">${["+5.4%", "+3.7%", "+8.9%", "50.6"][i]}</text><polyline points="12,90 24,84 36,88 48,76 60,70" fill="none" stroke="${colors.blue}" stroke-width="1.5"/></g>`).join(""),
  },
  {
    dir: "04-application-samples",
    name: "report-spread.svg",
    title: "Report Spread 报告内页",
    body: `<rect x="30" y="34" width="300" height="170" rx="10" class="card"/><line x1="180" y1="34" x2="180" y2="204" stroke="${colors.border}"/><text x="54" y="64" font-size="15" font-weight="700">趋势洞察</text><polyline points="54,128 76,116 98,122 120,100 142,106 164,86" fill="none" stroke="${colors.blue}" stroke-width="2"/><line x1="54" y1="148" x2="154" y2="148" stroke="${colors.border}"/><line x1="54" y1="166" x2="166" y2="166" stroke="${colors.border}"/><text x="204" y="64" font-size="15" font-weight="700">机会矩阵</text><rect x="206" y="84" width="96" height="78" fill="#EEF3F6" stroke="${colors.border}"/><line x1="254" y1="84" x2="254" y2="162" stroke="${colors.border}"/><line x1="206" y1="123" x2="302" y2="123" stroke="${colors.border}"/>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "wave-line-drift.svg",
    title: "Wave-line Drift 波纹线微动",
    body: `<style>@keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(10px)}} .drift{animation:drift 2400ms ease-in-out infinite; transform-origin:center;}</style><g class="drift">${waveMark(92, 48, 1.5)}</g><text x="180" y="178" class="title serif" text-anchor="middle">波纹线微动</text><text x="180" y="200" class="caption" text-anchor="middle">subtle drift / 12-16s loop in production</text>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "nav-underline-slide.svg",
    title: "Nav Underline Slide 导航下划线滑动",
    body: `<style>@keyframes slide{0%{transform:translateX(0)}50%{transform:translateX(98px)}100%{transform:translateX(0)}} .underline{animation:slide 1600ms ease-out infinite;}</style><text x="72" y="82" font-size="14">首页</text><text x="158" y="82" font-size="14">内参</text><text x="244" y="82" font-size="14">机会</text><line x1="60" y1="102" x2="292" y2="102" stroke="${colors.border}"/><line class="underline" x1="60" y1="102" x2="104" y2="102" stroke="${colors.gold}" stroke-width="2"/>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "button-hover.svg",
    title: "Button Hover 按钮悬浮反馈",
    body: `<style>@keyframes lift{0%,100%{transform:translateY(0);filter:drop-shadow(0 8px 16px rgba(7,24,39,.08))}50%{transform:translateY(-2px);filter:drop-shadow(0 16px 24px rgba(7,24,39,.14))}} .btn{animation:lift 1800ms ease-out infinite;}</style><rect class="btn" x="108" y="74" width="144" height="52" rx="6" fill="${colors.ink}"/><text x="180" y="106" fill="${colors.paper}" font-size="15" text-anchor="middle">查看内参</text>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "card-hover-lift.svg",
    title: "Card Hover Lift 卡片悬浮抬升",
    body: `<style>@keyframes lift{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}} .cardMove{animation:lift 1800ms ease-out infinite;}</style><rect x="80" y="78" width="120" height="82" rx="8" class="card"/><g class="cardMove"><rect x="152" y="60" width="128" height="88" rx="8" class="card soft"/><text x="172" y="92" class="caption">2025中国AI应用</text><path d="M152 120 C184 100 210 112 280 78 V148 H152 Z" fill="${colors.mountain}" opacity=".35"/></g><path d="M210 104 L242 104" stroke="${colors.blue}" marker-end="url(#arrow)"/>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "count-up.svg",
    title: "Count Up 数字递增",
    body: `<style>@keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}} .zero{animation:pulse 1600ms ease-in-out infinite}</style><text x="92" y="112" class="serif zero" font-size="52" fill="${colors.gray}">0</text><path d="M158 96 L202 96" stroke="${colors.blue}" marker-end="url(#arrow)"/><text x="228" y="112" class="serif" font-size="52" fill="${colors.blue}">128.6</text>`,
  },
];

components.push(
  {
    dir: "03-layout-principles",
    name: "three-column-summary.svg",
    title: "Three-column Summary 三栏摘要页",
    body: `<rect x="34" y="34" width="292" height="170" rx="10" class="card"/>
      <g transform="translate(56 58)"><rect width="68" height="100" rx="6" fill="#F3F6F8" stroke="${colors.border}"/><line x1="12" y1="22" x2="54" y2="22" stroke="${colors.blue}"/><line x1="12" y1="42" x2="48" y2="42" stroke="${colors.border}"/><line x1="12" y1="58" x2="50" y2="58" stroke="${colors.border}"/></g>
      <g transform="translate(146 58)"><rect width="68" height="100" rx="6" fill="#F3F6F8" stroke="${colors.border}"/><line x1="12" y1="22" x2="54" y2="22" stroke="${colors.blue}"/><line x1="12" y1="42" x2="48" y2="42" stroke="${colors.border}"/><line x1="12" y1="58" x2="50" y2="58" stroke="${colors.border}"/></g>
      <g transform="translate(236 58)"><rect width="68" height="100" rx="6" fill="#F3F6F8" stroke="${colors.border}"/><line x1="12" y1="22" x2="54" y2="22" stroke="${colors.blue}"/><line x1="12" y1="42" x2="48" y2="42" stroke="${colors.border}"/><line x1="12" y1="58" x2="50" y2="58" stroke="${colors.border}"/></g>
      <text x="34" y="226" class="caption">三栏并列呈现核心观点卡片，适用于短读对比与板块预览。</text>`,
  },
  {
    dir: "03-layout-principles",
    name: "report-section-header.svg",
    title: "Report Section Header 报告章节页",
    body: `<rect x="42" y="30" width="276" height="168" rx="10" class="card"/>
      <text x="62" y="72" class="serif" font-size="34" fill="${colors.blue}">01</text>
      <text x="118" y="72" class="serif" font-size="24">信号 Signal</text>
      <line x1="62" y1="96" x2="282" y2="96" stroke="${colors.gold}" stroke-width="1.5"/>
      <path d="M62 174 C94 142 126 150 158 160 C204 176 246 142 302 106 V198 H62 Z" fill="${colors.mountain}" opacity=".24"/>
      <g transform="translate(238 58) scale(.26)">${waveMark(0, 0, 1)}</g>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "motion-token-strip.svg",
    title: "Motion Tokens 基础动效参数",
    body: `<rect x="24" y="40" width="312" height="148" rx="10" class="card"/>
      ${[0, 1, 2, 3].map((i) => `<g transform="translate(${48 + i * 66} 68)"><rect width="48" height="40" rx="6" fill="#F8FAFB" stroke="${colors.border}"/><text x="24" y="25" class="mono" font-size="12" text-anchor="middle">${["120ms", "180ms", "240ms", "320ms"][i]}</text><text x="24" y="58" class="caption" text-anchor="middle">${["快速", "常规", "内容", "结构"][i]}</text></g>`).join("")}
      <polyline points="58,154 118,124 178,112 238,108 302,106" fill="none" stroke="${colors.blue}" stroke-width="2"/>
      <text x="38" y="28" class="caption">Duration / Easing / Delay / Hover Lift / Opacity Fade / Soft Blur</text>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "accordion-expand.svg",
    title: "Accordion Expand 手风琴展开",
    body: `<style>@keyframes expand{0%,100%{transform:scaleY(.55);opacity:.65}50%{transform:scaleY(1);opacity:1}} .panel{animation:expand 2400ms ease-in-out infinite;transform-origin:50% 58px;}</style>
      <rect x="46" y="52" width="268" height="38" rx="6" class="card"/><text x="66" y="76" font-size="13">为什么选择观澜AI？</text><text x="292" y="76" font-size="18">+</text>
      <g class="panel"><rect x="46" y="104" width="268" height="72" rx="6" class="card"/><line x1="66" y1="128" x2="246" y2="128" stroke="${colors.border}"/><line x1="66" y1="150" x2="282" y2="150" stroke="${colors.border}"/></g>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "modal-fade.svg",
    title: "Modal Fade 弹窗淡入淡出",
    body: `<style>@keyframes fade{0%,100%{opacity:.35;transform:translateX(46px)}50%{opacity:1;transform:translateX(0)}} .modal{animation:fade 2400ms ease-in-out infinite;}</style>
      <rect x="46" y="66" width="124" height="92" rx="8" class="card soft"/><text x="64" y="96" font-size="13" font-weight="700">订阅内参</text><line x1="64" y1="116" x2="144" y2="116" stroke="${colors.border}"/><rect x="108" y="132" width="44" height="18" rx="4" fill="${colors.ink}"/>
      <path d="M184 112 L220 112" stroke="${colors.blue}" marker-end="url(#arrow)"/>
      <g class="modal"><rect x="220" y="66" width="94" height="92" rx="8" fill="#E5E8EC" opacity=".88" stroke="${colors.border}"/><text x="238" y="96" class="caption">订阅内参</text><rect x="252" y="132" width="36" height="18" rx="4" fill="${colors.gray}"/></g>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "avoid-motion-set.svg",
    title: "Avoid Motion 禁用动效",
    body: `${[
        ["避免炫目霓虹", "No Flashy Neon"],
        ["避免弹跳效果", "No Bouncing"],
        ["避免夸张视差", "No Exaggerated Parallax"],
        ["避免噪点循环", "No Noisy Loops"],
      ].map((item, i) => `<g transform="translate(${22 + i * 82} 48)"><rect width="72" height="106" rx="8" fill="#FAFAFA" stroke="${colors.border}"/><circle cx="18" cy="24" r="8" fill="none" stroke="#A66C55"/><path d="M14 20 L22 28 M22 20 L14 28" stroke="#A66C55"/><text x="36" y="52" class="caption" text-anchor="middle">${item[0]}</text><text x="36" y="72" class="caption" text-anchor="middle">${item[1]}</text></g>`).join("")}
      <text x="180" y="190" class="caption" text-anchor="middle">不使用炫光、弹跳、强视差、噪点循环或自动播放干扰阅读。</text>`,
  },
  {
    dir: "05-motion-guidelines",
    name: "reading-experience.svg",
    title: "Reading Experience 内参阅读体验",
    body: `<rect x="24" y="42" width="312" height="138" rx="10" class="card"/>
      <g transform="translate(46 66)"><text y="0" font-size="13" font-weight="700">阅读进度提示</text><line y1="28" x2="78" y2="28" stroke="${colors.border}"/><line y1="28" x2="32" y2="28" stroke="${colors.gold}" stroke-width="2"/></g>
      <g transform="translate(142 66)"><text y="0" font-size="13" font-weight="700">锚点高亮</text><rect y="18" width="74" height="56" rx="6" fill="#F3F6F8" stroke="${colors.border}"/><line x1="16" y1="38" x2="58" y2="38" stroke="${colors.blue}"/></g>
      <g transform="translate(242 66)"><text y="0" font-size="13" font-weight="700">数据强调</text><text y="48" class="serif" font-size="30" fill="${colors.blue}">128.6</text><text y="70" class="caption">行业景气指数</text></g>`,
  },
  {
    dir: "06-site-design-system",
    name: "navigation-bar.svg",
    title: "Navigation Bar 导航系统",
    body: `<rect x="24" y="58" width="312" height="68" rx="10" class="card"/>
      <g transform="translate(42 76) scale(.22)">${waveMark(0, 0, 1)}</g>
      <text x="94" y="96" class="serif" font-size="13" font-weight="700">观澜AI</text>
      <text x="156" y="96" class="caption">Signal 信号</text><text x="216" y="96" class="caption">Point 观点</text><text x="276" y="96" class="caption">Brief</text>
      <line x1="156" y1="112" x2="190" y2="112" stroke="${colors.gold}" stroke-width="2"/>
      <circle cx="314" cy="93" r="7" fill="none" stroke="${colors.blue}"/><line x1="319" y1="98" x2="326" y2="105" stroke="${colors.blue}"/>`,
  },
  {
    dir: "06-site-design-system",
    name: "buttons.svg",
    title: "Buttons 按钮规范",
    body: `<rect x="38" y="54" width="92" height="44" rx="6" fill="${colors.ink}"/><text x="84" y="82" fill="${colors.paper}" text-anchor="middle" font-size="13">主按钮</text><text x="84" y="118" class="caption" text-anchor="middle">Primary</text>
      <rect x="146" y="54" width="92" height="44" rx="6" fill="${colors.paper}" stroke="${colors.gold}"/><text x="192" y="82" text-anchor="middle" font-size="13">次按钮</text><text x="192" y="118" class="caption" text-anchor="middle">Secondary</text>
      <text x="272" y="82" font-size="13">文本按钮</text><text x="292" y="118" class="caption" text-anchor="middle">Text</text>
      <rect x="224" y="144" width="96" height="38" rx="6" fill="${colors.gold}"/><text x="272" y="168" fill="${colors.paper}" text-anchor="middle" font-size="13">强调按钮</text>`,
  },
  {
    dir: "06-site-design-system",
    name: "tags.svg",
    title: "Tags 标签规范",
    body: `${["宏观", "行业", "企业", "消费", "科技", "洞察"].map((tag, i) => `<g transform="translate(${36 + i * 52} ${i < 3 ? 62 : 112})"><rect width="42" height="28" rx="14" fill="${colors.paper}" stroke="${colors.border}"/><text x="21" y="18" font-size="11" text-anchor="middle">${tag}</text></g>`).join("")}
      <text x="36" y="176" class="caption">标签只做筛选和关系网络，不作为一线栏目；使用圆角胶囊但保持轻量。</text>`,
  },
  {
    dir: "06-site-design-system",
    name: "cards.svg",
    title: "Cards 卡片规范",
    body: `<g transform="translate(34 48)"><rect width="112" height="116" rx="8" class="card soft"/><rect width="112" height="62" rx="8" fill="#DCE5EC"/><path d="M0 54 C26 36 54 42 80 50 C98 56 108 48 112 42 V62 H0 Z" fill="${colors.mountain}" opacity=".45"/><text x="12" y="86" font-size="12">中国AI应用商业化进入增长拐点</text><text x="12" y="106" class="caption">宏观 · 科技</text></g>
      <g transform="translate(166 48)"><rect width="78" height="116" rx="8" class="card"/><text x="14" y="26" class="serif" font-size="20" fill="${colors.blue}">P</text><text x="14" y="58" font-size="13">关于AI驱动下的组织平衡</text><text x="14" y="100" class="caption">5月20日</text></g>
      <g transform="translate(264 48)"><rect width="62" height="116" rx="8" class="card"/><text x="12" y="38" class="caption">行业景气指数</text><text x="12" y="74" class="serif" font-size="25" fill="${colors.blue}">128.6</text><polyline points="12,100 24,94 36,98 48,88 58,82" fill="none" stroke="${colors.blue}"/></g>`,
  },
  {
    dir: "06-site-design-system",
    name: "section-header.svg",
    title: "Section Header 章节标题",
    body: `<rect x="28" y="62" width="304" height="96" rx="8" class="card"/>
      <text x="50" y="116" class="serif" font-size="40" fill="${colors.blue}">01</text>
      <text x="112" y="116" class="serif" font-size="26">信号 Signal</text>
      <g transform="translate(230 90) scale(.28)">${waveMark(0, 0, 1)}</g>
      <text x="286" y="116" class="caption">查看全部 &gt;</text>`,
  },
  {
    dir: "06-site-design-system",
    name: "search-bar.svg",
    title: "Search Bar 搜索框",
    body: `<rect x="44" y="82" width="272" height="54" rx="8" fill="${colors.paper}" stroke="${colors.border}"/>
      <text x="66" y="115" class="caption">搜索主题、行业、公司或关键词</text>
      <circle cx="288" cy="108" r="9" fill="none" stroke="${colors.blue}"/><line x1="295" y1="115" x2="304" y2="124" stroke="${colors.blue}"/>`,
  },
  {
    dir: "06-site-design-system",
    name: "quote-block.svg",
    title: "Quote Block 引用框",
    body: `<rect x="38" y="58" width="284" height="112" rx="8" class="card"/>
      <text x="58" y="104" class="serif" font-size="42" fill="${colors.blue}">“</text>
      <text x="96" y="106" font-size="16">看懂变化，判断影响，找到行动点。</text>
      <text x="240" y="142" class="caption">-- 观澜AI</text>`,
  },
  {
    dir: "06-site-design-system",
    name: "page-template-desktop.svg",
    title: "Page Template Desktop 桌面页面模板",
    body: `<rect x="30" y="28" width="300" height="176" rx="10" class="card"/>
      <rect x="46" y="46" width="268" height="72" rx="8" fill="#DCE5EC"/>
      <path d="M46 104 C88 68 132 78 174 92 C220 108 260 78 314 52 V118 H46 Z" fill="${colors.mountain}" opacity=".42"/>
      <text x="62" y="84" class="serif" font-size="20" fill="${colors.paper}">观AI之澜，识商业之势</text>
      <rect x="62" y="132" width="58" height="42" rx="6" fill="${colors.paper}" stroke="${colors.border}"/><rect x="132" y="132" width="58" height="42" rx="6" fill="${colors.paper}" stroke="${colors.border}"/><rect x="202" y="132" width="92" height="42" rx="6" fill="${colors.paper}" stroke="${colors.border}"/>`,
  },
  {
    dir: "06-site-design-system",
    name: "page-template-mobile.svg",
    title: "Page Template Mobile 移动页面模板",
    width: 240,
    height: 360,
    body: `<rect x="38" y="24" width="164" height="312" rx="18" class="card"/>
      <g transform="translate(58 42) scale(.18)">${waveMark(0, 0, 1)}</g><circle cx="178" cy="58" r="8" fill="none" stroke="${colors.blue}"/>
      <rect x="56" y="78" width="128" height="96" rx="8" fill="#DCE5EC"/>
      <path d="M56 150 C82 120 108 128 132 138 C154 148 170 128 184 104 V174 H56 Z" fill="${colors.mountain}" opacity=".44"/>
      <text x="68" y="118" class="serif" font-size="20" fill="${colors.paper}">观AI之澜</text><text x="68" y="144" class="serif" font-size="20" fill="${colors.paper}">识商业之势</text>
      <rect x="56" y="194" width="128" height="42" rx="6" fill="${colors.paper}" stroke="${colors.border}"/><rect x="56" y="248" width="128" height="42" rx="6" fill="${colors.paper}" stroke="${colors.border}"/>`,
  },
  {
    dir: "06-site-design-system",
    name: "data-visualization.svg",
    title: "Data Visualization 数据图表风格",
    body: `<g transform="translate(36 52)"><text y="0" font-size="13" font-weight="700">折线图</text><polyline points="0,82 42,72 84,78 126,56" fill="none" stroke="${colors.blue}" stroke-width="2"/><line y1="96" x2="132" y2="96" stroke="${colors.border}"/><line y1="28" x2="132" y2="28" stroke="${colors.border}"/></g>
      <g transform="translate(194 52)"><text y="0" font-size="13" font-weight="700">柱状图</text>${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 22}" y="${[30, 42, 54, 64, 72][i]}" width="12" height="${96 - [30, 42, 54, 64, 72][i]}" fill="${i < 2 ? colors.blue : colors.mountain}"/>`).join("")}</g>
      <text x="36" y="190" class="caption">图表使用深澜蓝主线、远山灰辅助，不使用高饱和渐变或装饰性网格。</text>`,
  },
);

const manifest = [];

for (const item of components) {
  const dir = path.join(outRoot, item.dir);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, item.name);
  await writeFile(file, svg(item), "utf8");
  manifest.push({ category: item.dir, file: `${item.dir}/${item.name}`, title: item.title });
}

const manifestMarkdown = `# 观澜AI｜可执行 SVG 规范拆解

本目录由 \`tools/generate-executable-svg.mjs\` 生成，用于把四张 VI 规范图拆成可复用、可运行、可验收的 SVG 组件。

## 使用原则

- 所有 SVG 使用观澜 VI token：墨海蓝、深澜蓝、澜线蓝、远山灰、云白、香槟金。
- Logo 类资产仍以 \`../logo-wavesight-*.svg\` 为准，不在组件 SVG 中重画正式 Logo。
- 页面设计、组件实现和截图验收应优先引用本目录中的单项 SVG，而不是从整张规范图中裁切。
- 动效 SVG 内置 \`@keyframes\`，可直接在浏览器中打开预览。

## 文件清单

| Category | File | Title |
|---|---|---|
${manifest.map((item) => `| ${item.category} | \`${item.file}\` | ${item.title} |`).join("\n")}
`;

await writeFile(path.join(outRoot, "README.md"), manifestMarkdown, "utf8");
await writeFile(path.join(outRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const indexHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>观澜AI 可执行 SVG 规范拆解</title>
  <style>
    body { margin: 0; padding: 40px; background: #f7f4ef; color: #071827; font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif; }
    h1 { font-family: "Noto Serif SC", "Songti SC", serif; font-size: 34px; margin: 0 0 12px; }
    p { color: #6f7f8f; margin: 0 0 28px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
    .item { padding: 14px; border: 1px solid #e5e8ec; border-radius: 10px; background: rgba(255,255,255,.78); }
    .item img { display: block; width: 100%; border-radius: 8px; background: white; }
    .item strong { display: block; margin-top: 10px; font-size: 14px; }
    .item small { color: #6f7f8f; font-family: "IBM Plex Sans", Arial, sans-serif; }
  </style>
</head>
<body>
  <h1>观澜AI 可执行 SVG 规范拆解</h1>
  <p>由四张 VI 规范图拆解为单项 SVG。每个文件可直接打开、引用或进入站点组件实现。</p>
  <div class="grid">
    ${manifest.map((item) => `<a class="item" href="${item.file}"><img src="${item.file}" alt="${escape(item.title)}"><strong>${escape(item.title)}</strong><small>${item.file}</small></a>`).join("\n    ")}
  </div>
</body>
</html>
`;
await writeFile(path.join(outRoot, "index.html"), indexHtml, "utf8");

console.log(`Generated ${manifest.length} SVG files in ${outRoot}`);
