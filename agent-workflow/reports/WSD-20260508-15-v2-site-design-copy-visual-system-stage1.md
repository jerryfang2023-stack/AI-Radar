---
task_id: WSD-20260508-15-v2-site-design-copy-visual-system-autopilot
board_id: V2-SITE-QUALITY-AUTO
stage: stage-1-diagnosis
date: 2026-05-08
status: waiting-user-confirmation
owner: ui-ue / copy / pm / workflow
encoding: UTF-8
---

# V2 全站设计 / 文案 / 视觉资产质感升级 Stage 1

## 0. 调度摘要

```yaml
task_id: WSD-20260508-15-v2-site-design-copy-visual-system-autopilot
board_id: V2-SITE-QUALITY-AUTO
stage: stage-1-diagnosis
recommended_status: pause_for_user_confirmation
changed_files:
  - agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-stage1.md
generated_evidence:
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/index-desktop.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/index-mobile.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/daily-desktop.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/daily-mobile.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/signals-desktop.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/signals-mobile.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/opportunities-desktop.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/opportunities-mobile.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/brief-desktop.png
  - agent-workflow/reports/WSD-20260508-15-stage1-screenshots/brief-mobile.png
gates:
  stage1_report_utf8: pass
  desktop_mobile_screenshots: pass
  design_director_scoring: pass
  copy_review_table: pass
  code_changes: none
automation_impact: none
netlify: not-run
next_action: 用户确认阶段 2 方向后，再按栏目逐页改造。
```

## 1. 方法基线修正

用户已明确：不要用 `frontend-design` 这种偏端正、模板式的审美方法做主基线，要用 taste-skill 相关技能。

本阶段已改用以下 taste-skill 相关口径：

- `design-taste-frontend`：高变体、非中心化、少卡片、强网格、动效只用 transform / opacity。
- `gpt-taste`：避免窄标题墙、避免廉价 meta label、避免空洞 Bento、重视章节式页面张力。
- `redesign-existing-projects`：先诊断现有项目的 AI 默认模式、卡片滥用、CSS 累积和缺少状态。
- `high-end-visual-design`：用高端 agency 的材料感、宏观留白、嵌套层次和微交互判断“贵不贵”。

适配边界：观澜 AI 已锁定中文衬线标题、深海蓝 / 云白 / 雾灰 / 香槟金和澜线 / 地平线 VI，因此不照搬 taste-skill 中“禁用全部 serif / 禁用 Inter”的通用规则。taste-skill 负责打破呆板，观澜 VI 负责不跑偏。

## 2. 当前页面总体判断

当前 V2 页面已经比早期版本更干净，但仍不是最终可发布质感。主要问题不是单个颜色或按钮，而是“结构太规矩、页面太平、内容像列表排版、视觉资产没有进入系统”。

核心诊断：

| 维度 | 当前状态 | 主要问题 | 阶段 2 处理方向 |
|---|---|---|---|
| 页面气质 | 克制但偏静态 | 像排好版的内容库，不像有判断力的商业内参产品 | 引入非对称章节、封面感、判断样张和滚动节奏 |
| 信息架构 | 有栏目顺序 | 多数栏目仍是 section + list，阅读路径缺少“主判断 -> 证据 -> 边界”的戏剧性 | 每页只强化一个主任务，减少等权模块 |
| 字体 | 已接入 VI token | 标题有气质，但部分页面标题过端正，列表标题与正文层级相近 | 建立栏目标题、报告标题、列表标题、正文四级硬层级 |
| 色彩 | 基本符合 VI | 背景网格和浅卡片过多，色块关系过平，香槟金没有形成记忆点 | 减少背景网格，保留少量地平线金线和报告封面视觉 |
| 卡片 | 已从卡片墙收敛 | 仍有多处“行卡片 / 透明卡片 / 标签”重复，页面辨识度弱 | 列表改为内参索引、关键内容改为 double-bezel / 报告页结构 |
| 视觉资产 | 首页有主图，Brief 有 Logo | 最新 48 个 SVG 没有完整进入站点资产；栏目缺少专属视觉 | 先同步 VI SVG，再用符号、热力图、时间线、机会矩阵入页 |
| 移动端 | 无明显横向溢出 | 首页移动端主图露出方式突兀；信号页长标题压迫 | 移动端重排首屏顺序，列表改更短标题 / 摘要节奏 |
| 文案 | 基本克制 | 仍有“查看本期可读内容”“阅读完整分析”等偏功能说明句 | 改成判断语境，减少页面说明腔 |
| 技术样式 | 可运行 | `styles.css` 6453 行，明显是多轮覆盖层叠；存在 `--ws-*` 未在品牌 token 中定义的痕迹 | 阶段 2 先做 CSS 分层与 tokens 清理，再改页面 |

## 3. 证据截图

截图目录：

```text
agent-workflow/reports/WSD-20260508-15-stage1-screenshots/
```

已生成：

| 页面 | 桌面 | 移动 |
|---|---|---|
| Home | `index-desktop.png` | `index-mobile.png` |
| 今日要点 | `daily-desktop.png` | `daily-mobile.png` |
| 关键信号 | `signals-desktop.png` | `signals-mobile.png` |
| 机会解码 | `opportunities-desktop.png` | `opportunities-mobile.png` |
| 商业内参 | `brief-desktop.png` | `brief-mobile.png` |

截图观察：

- Home 桌面首屏主图有气质，但左文右图仍偏传统 split hero；移动端图片被推到按钮后下方，只露出局部，像被裁掉的装饰，而不是移动端主视觉。
- Signals 桌面列表可读，但太像“高级表格”，缺少信号强弱、来源密度、商业含义的视觉编码。
- Signals 移动端长标题压迫明显，第一屏几乎被标题和摘要占满，缺少轻重缓急。
- Brief 桌面封面区最接近 VI，但右侧大面积空白未形成“封面张力”，更像空着的版心。
- 各栏目页面基本同构，缺少 Home、Daily、Signal、Opportunity、Brief 各自的视觉记忆点。

## 4. Design Director 评分

评分基于本轮截图和当前代码重新评估，不继承 `V2-3`、`V2-8AUTO`、`V2-SITE-AUTO`、`V2-HERO-BLEND-EXTEND` 的 accepted 结论。

| 页面 / 母版 | Style Purity | Proportion & Rhythm | Color Sophistication | Craftsmanship | Emotional Resonance | Squint | 总分 | 结论 |
|---|---:|---:|---:|---:|---:|---|---:|---|
| Home | 16 | 15 | 16 | 15 | 16 | 通过但偏静 | 78 | 未达首页 85 线 |
| 今日要点 | 15 | 14 | 15 | 14 | 14 | 勉强通过 | 72 | 未达栏目 80 线 |
| 关键信号 | 15 | 14 | 15 | 14 | 13 | 勉强通过 | 71 | 未达栏目 80 线 |
| 机会解码 | 14 | 14 | 15 | 14 | 13 | 勉强通过 | 70 | 未达栏目 80 线 |
| 商业内参 | 17 | 15 | 16 | 15 | 16 | 通过但留白未成势 | 79 | 接近但未达栏目 80 线 |
| 详情页母版 | 14 | 13 | 15 | 13 | 13 | 不稳定 | 68 | 需要重做阅读母版 |
| 全站导航 / 页脚 | 16 | 15 | 16 | 15 | 14 | 通过 | 76 | 可保留方向但需更精致 |
| 视觉资产系统 | 13 | 13 | 16 | 12 | 12 | 不通过 | 66 | 资产未系统入页 |

阻塞项：

- 当前首页 / 全站母版低于 85，不能作为最终母版。
- 栏目页全部低于 80，不应进入 accepted。
- 视觉资产系统低于 70，原因是最新 VI SVG 没有充分进入站点页面。
- 详情页母版仍偏字段分段和卡片化，缺少商业内参长文阅读的叙事张力。

## 5. 当前不可借鉴的问题

此前相关任务只能作为代码范围和问题来源参考，不能继承完成度。阶段 2 必须避免继续带入以下问题：

- 不再用“section + 三列卡片 + 标签”的默认结构解决所有栏目。
- 不再靠继续追加 `final / polish / override` 类 CSS 覆盖层修视觉。
- 不再把首页主图局部调好就视为首页整体质感达标。
- 不再用页面无横向溢出代替审美验收。
- 不再把“文案没有禁用词”当作“文案有判断力”。
- 不再用样式化网格背景替代真正的商业内参视觉资产。

## 6. VI 资产检查

最新 VI 资料库：

```text
docs/brand/wavesight-ai-vi/
docs/brand/wavesight-ai-vi/executable-svg/
```

最新 `executable-svg` 清单包含 48 个 SVG，覆盖：

- Symbol：Signal、Point、Trend、Opportunity、Quote、Divider、Timeline Node、Data Snapshot、Rating Chip、Source Note。
- Information：Issue Number、Date Chip、Member Brief Tag、Reading Time、Key Judgment Block、Quote Block、Data Card、Trend Timeline、Opportunity Matrix、Source Footer。
- Layout：Cover Page、Article Detail Page、Side Decision Rail、Three-column Summary、Report Section Header。
- Application：Brief Cover、Data Card Set、Report Spread。
- Motion：Wave-line Drift、Nav Underline、Button Hover、Card Hover、Count Up、Accordion、Modal、Reading Experience。
- Site Design System：Navigation、Buttons、Tags、Cards、Section Header、Search Bar、Quote Block、Desktop Template、Mobile Template、Data Visualization。

站点当前资产状态：

- `01-SiteV2/site/assets/brand/` 有 Logo、tokens、home hero 图。
- `01-SiteV2/site/assets/vi-components/` 当前只有 31 个 SVG，落后于最新 48 个组件库。
- 页面实际只显性使用 Logo、首页 PNG、少量 CSS 画出的线条，未系统引用 Signal / Opportunity / Heatmap / Data Visualization 等组件。

阶段 2 第一动作应是资产同步：

```text
docs/brand/wavesight-ai-vi/executable-svg/ -> 01-SiteV2/site/assets/vi-components/
```

同步后再决定哪些 SVG 进入页面，而不是继续用 CSS 手画符号。

## 7. V2 设计标准草案

阶段 2 推荐采用：

```text
审美方向：Editorial Luxury + Asymmetrical Intelligence Brief
布局方法：非对称章节、少卡片、强留白、关键内容 double-bezel
动效：轻量 reveal / underline / hover，仅 transform + opacity
视觉资产：真实 VI SVG + 少量生成图，不做通用 AI 科技感
```

### 7.1 页面排版

- 首页：首屏不做传统左右均分，改为“左侧品牌判断 + 右侧大面积融入式情报图层 + 下沿露出今日主判断”。
- 今日要点：从普通栏目页改为“今日判断封面 + 三条主线 + 风险边界”的日报内参页。
- 关键信号：从卡片列表改为“信号索引台”，每条只保留序号、标题、事实摘要、来源状态、相关机会。
- 机会解码：从列表页改为“低频报告架”，重点突出最新一篇和观察中方向。
- 商业内参：做最强封面感，期号、周期、会员标签、热力摘要必须像周期性文件。
- 详情页：从字段段落转为研究报告母版，主栏 760-860px，侧栏只做阅读侧记和关联资产。

### 7.2 字体

- 中文大标题继续用 `Noto Serif SC / Source Han Serif SC`，但减少“巨大即高级”的用法。
- 列表标题更多使用黑体中粗，避免所有层级都宋体化。
- 数字、日期、期号、序号使用 mono 或 Georgia 类报告数字。
- 英文小标签减少数量，禁用廉价 `SECTION 01` 式标签；保留 `SIGNAL / BRIEF / ISSUE` 等内容身份。

### 7.3 色彩与材料

- 背景从当前轻网格改为更少、更有空气的纸面底。
- 香槟金只用于地平线短线、期号、关键序号，不做大色块。
- 卡片阴影继续减弱，更多使用分隔线、层级和留白。
- 允许少量 double-bezel，用于 Brief 封面、关键判断、会员内参，不泛滥。

### 7.4 动效

- 导航当前项使用短金线滑动。
- 页面内容进入视口使用轻微 fade-up，不做炫技。
- 卡片 / 列表 hover 只做 1-2px 位移、金线显现或内层轻微滑动。
- 不引入 GSAP，除非阶段 2 明确需要滚动叙事；当前静态站点优先用 CSS。

## 8. 栏目视觉资产策略

| 页面 | 推荐资产 | 是否需要生成图 | 可直接引用 SVG |
|---|---|---|---|
| Home | 当前山水 + 信号流主图可保留，但要重做移动裁切和左侧融合 | 暂不需要，先重排 | `cover-page`、`data-visualization`、`wave-line-drift` |
| 今日要点 | 今日判断封面、日期 chip、三条判断线 | 不需要 | `date-chip`、`key-judgment-block`、`timeline-node` |
| 关键信号 | Signal 符号、来源说明、证据强弱小标记 | 不需要 | `signal`、`source-note`、`rating-chip` |
| 机会解码 | 机会矩阵、成立边界、方向报告封面 | 可能需要一张低饱和栏目图 | `opportunity`、`opportunity-matrix`、`side-decision-rail` |
| 商业内参 | 内参封面、Issue No.、热力图、数据卡 | 可能需要内参封面背景或报告 spread | `brief-cover`、`issue-number`、`data-card-set`、`report-spread` |
| 详情页母版 | 引用块、来源脚注、侧边决策栏、阅读进度 | 不需要 | `article-detail-page`、`quote-block`、`source-footer`、`reading-experience` |

图像生成边界：

- 不生成机器人、芯片、蓝紫科技、黑暗氛围、赛博城市。
- 图像只能服务栏目封面或内参报告，不替代真实内容结构。
- 生成图不得嵌入关键中文小字，关键文字必须由 HTML 渲染。

## 9. Copy 审查标准

当前文案大体克制，但不少句子仍是“页面说明”，不够像商业判断产品。

| 位置 | 当前问题 | 阶段 2 推荐 |
|---|---|---|
| Home 副标题 | 正确但偏定义句 | 改为更有判断张力，例如“每天从 AI 变化中筛出关键信号，判断影响，沉淀值得继续观察的机会方向。” |
| 今日要点说明 | “为什么值得继续观察”可保留 | 增强为当天判断，不只说明栏目 |
| Signals 说明 | “从外部变化中，筛出值得继续看的商业信号”偏通用 | 增加来源边界和商业含义，但不写内部机制 |
| Opportunity 说明 | “对证据足够的方向...”正确但偏抽象 | 改为“只写证据正在累积的方向，不把单条新闻写成机会。” |
| Brief Access | “查看本期可读内容”像功能提示 | 改为“先读本期判断，再看完整证据与反证。” |
| CTA | “阅读全文”偏普通文章 | Home / Daily 可用“进入今日判断”；机会用“阅读完整分析”；Brief 用“查看本期内参” |

继续禁用：

- 内部流程语：后台、字段、JSON、同步、入库、生成器、样例。
- 说服语：强证据、机会确定、来源明确、阅读证据、下一步验证。
- 空泛营销：赋能、生态闭环、颠覆、财富密码、抢占红利。

注意：当前生成数据中有“工作流自动化”“销售赋能”等标签或内容词。`工作流自动化` 属业务概念，可保留；`销售赋能` 在公开展示中容易显得营销化，阶段 2 建议由 Data / Copy 统一改为 `销售增长`、`销售流程` 或更具体标签。

## 10. 逐栏目优化顺序

阶段 2 建议严格按下列顺序：

1. 全站基础层：同步 48 个 VI SVG，清理 `styles.css` 覆盖层，统一 token、导航、页脚、section、列表和卡片原语。
2. Home：重做首屏与移动端，保留当前主图但调整为真正的品牌主视觉，不让移动端只露出残图。
3. 今日要点：重做为当天内参封面式页面，突出今日主判断。
4. 关键信号：重做信号索引台，避免高级表格感。
5. 机会解码：重做报告架和机会矩阵，避免“只有一张卡”的空页面感。
6. 商业内参：强化封面、期号、会员层、热力摘要和报告感。
7. 详情页母版：Signal / Daily / Opportunity 统一报告阅读系统。
8. 移动端复核：逐页检查标题断行、按钮堆叠、主图裁切和横向溢出。

## 11. PM 门禁判断

阶段 2 大多数改动属于视觉增强和文案优化，不构成新功能：

- 同步 VI SVG：视觉资产增强。
- 重排首页 / 栏目 / 详情：页面体验增强。
- 文案压缩和禁用语清理：Copy 质量增强。
- 热力图视觉样式：如果只是展示既有 `data.brief.heat`，不构成新功能。

需要 PM 门禁的情况：

- 新增一级导航或恢复 The Point / Trends。
- 新增独立日期页、搜索页、图谱页、热力图交互页。
- 新增会员支付、真实登录、下载 PDF、订阅承诺。
- 修改 V2 数据 schema 或站点数据生成器以承载新字段。

本阶段建议：阶段 2 不新增功能，只重做视觉承载。

## 12. 阶段 2 验收线

必须达到：

- Home / 全站母版 / 核心首屏 / 视觉资产：Design Director >= 85。
- 栏目页 / 详情页：Design Director >= 80。
- 任一单项不得低于 14。
- Squint Test 必须通过。
- 桌面 1440、桌面 2048、移动 390 三档截图。
- 无横向溢出、遮挡、按钮文字挤压。
- 普通前台无内部流程语。
- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node --check 01-SiteV2/site/dev-server.mjs` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

## 13. 需要用户确认

请确认阶段 2 按以下方向执行：

```text
使用 taste-skill 相关审美口径：
更非对称、更有章节张力、更少卡片、更强商业内参封面感。

保留观澜 VI：
深海蓝 / 云白 / 雾灰 / 少量香槟金、中文衬线标题、澜线 / 地平线 / 商业内参符号。

阶段 2 不新增功能，不新增导航，不部署 Netlify。
先同步 48 个 VI SVG，再按 Home -> 今日要点 -> 关键信号 -> 机会解码 -> 商业内参 -> 详情页母版逐页重做。
```

阶段 1 到此暂停，等待确认后再进入阶段 2。
