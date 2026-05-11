# 观澜AI｜可执行 SVG 规范拆解

本目录由 `tools/generate-executable-svg.mjs` 生成，用于把四张 VI 规范图拆成可复用、可运行、可验收的 SVG 组件。

## 使用原则

- 所有 SVG 使用观澜 VI token：墨海蓝、深澜蓝、澜线蓝、远山灰、云白、香槟金。
- Logo 类资产仍以 `../logo-wavesight-*.svg` 为准，不在组件 SVG 中重画正式 Logo。
- 页面设计、组件实现和截图验收应优先引用本目录中的单项 SVG，而不是从整张规范图中裁切。
- 动效 SVG 内置 `@keyframes`，可直接在浏览器中打开预览。

## 文件清单

| Category | File | Title |
|---|---|---|
| 01-symbol-system | `01-symbol-system/signal.svg` | Signal 信号 |
| 01-symbol-system | `01-symbol-system/key-judgment.svg` | Point 关键判断 |
| 01-symbol-system | `01-symbol-system/trend.svg` | Trend 趋势 |
| 01-symbol-system | `01-symbol-system/opportunity.svg` | Opportunity 机会 |
| 01-symbol-system | `01-symbol-system/quote.svg` | Quote 引述 |
| 01-symbol-system | `01-symbol-system/divider.svg` | Divider 分隔线 |
| 01-symbol-system | `01-symbol-system/timeline-node.svg` | Timeline Node 时间节点 |
| 01-symbol-system | `01-symbol-system/data-snapshot.svg` | Data Snapshot 数据快照 |
| 01-symbol-system | `01-symbol-system/rating-chip.svg` | Rating Chip 评级标签 |
| 01-symbol-system | `01-symbol-system/source-note.svg` | Source Note 来源说明 |
| 02-information-elements | `02-information-elements/issue-number.svg` | Issue Number 期号编号 |
| 02-information-elements | `02-information-elements/date-chip.svg` | Date 日期 |
| 02-information-elements | `02-information-elements/member-brief-tag.svg` | Member Brief Tag 会员内参标签 |
| 02-information-elements | `02-information-elements/reading-time.svg` | Reading Time 阅读时长 |
| 02-information-elements | `02-information-elements/key-judgment-block.svg` | Key Judgment Block 核心判断框 |
| 02-information-elements | `02-information-elements/quote-block.svg` | Quote Block 引述框 |
| 02-information-elements | `02-information-elements/data-card.svg` | Data Card 数据卡 |
| 02-information-elements | `02-information-elements/trend-timeline.svg` | Trend Timeline 趋势时间线 |
| 02-information-elements | `02-information-elements/opportunity-matrix.svg` | Matrix Card 机会矩阵 |
| 02-information-elements | `02-information-elements/source-footer.svg` | Source Footer 数据来源脚注 |
| 03-layout-principles | `03-layout-principles/cover-page.svg` | Cover Page 封面页 |
| 03-layout-principles | `03-layout-principles/article-detail-page.svg` | Article Detail Page 正文详情页 |
| 03-layout-principles | `03-layout-principles/side-decision-rail.svg` | Side Decision Rail 侧边决策栏 |
| 04-application-samples | `04-application-samples/brief-cover.svg` | Brief Cover 内参封面 |
| 04-application-samples | `04-application-samples/data-card-set.svg` | Data Card Set 数据卡片组 |
| 04-application-samples | `04-application-samples/report-spread.svg` | Report Spread 报告内页 |
| 05-motion-guidelines | `05-motion-guidelines/wave-line-drift.svg` | Wave-line Drift 波纹线微动 |
| 05-motion-guidelines | `05-motion-guidelines/nav-underline-slide.svg` | Nav Underline Slide 导航下划线滑动 |
| 05-motion-guidelines | `05-motion-guidelines/button-hover.svg` | Button Hover 按钮悬浮反馈 |
| 05-motion-guidelines | `05-motion-guidelines/card-hover-lift.svg` | Card Hover Lift 卡片悬浮抬升 |
| 05-motion-guidelines | `05-motion-guidelines/count-up.svg` | Count Up 数字递增 |
| 03-layout-principles | `03-layout-principles/three-column-summary.svg` | Three-column Summary 三栏摘要页 |
| 03-layout-principles | `03-layout-principles/report-section-header.svg` | Report Section Header 报告章节页 |
| 05-motion-guidelines | `05-motion-guidelines/motion-token-strip.svg` | Motion Tokens 基础动效参数 |
| 05-motion-guidelines | `05-motion-guidelines/accordion-expand.svg` | Accordion Expand 手风琴展开 |
| 05-motion-guidelines | `05-motion-guidelines/modal-fade.svg` | Modal Fade 弹窗淡入淡出 |
| 05-motion-guidelines | `05-motion-guidelines/avoid-motion-set.svg` | Avoid Motion 禁用动效 |
| 05-motion-guidelines | `05-motion-guidelines/reading-experience.svg` | Reading Experience 内参阅读体验 |
| 06-site-design-system | `06-site-design-system/navigation-bar.svg` | Navigation Bar 导航系统 |
| 06-site-design-system | `06-site-design-system/buttons.svg` | Buttons 按钮规范 |
| 06-site-design-system | `06-site-design-system/tags.svg` | Tags 标签规范 |
| 06-site-design-system | `06-site-design-system/cards.svg` | Cards 卡片规范 |
| 06-site-design-system | `06-site-design-system/section-header.svg` | Section Header 章节标题 |
| 06-site-design-system | `06-site-design-system/search-bar.svg` | Search Bar 搜索框 |
| 06-site-design-system | `06-site-design-system/quote-block.svg` | Quote Block 引用框 |
| 06-site-design-system | `06-site-design-system/page-template-desktop.svg` | Page Template Desktop 桌面页面模板 |
| 06-site-design-system | `06-site-design-system/page-template-mobile.svg` | Page Template Mobile 移动页面模板 |
| 06-site-design-system | `06-site-design-system/data-visualization.svg` | Data Visualization 数据图表风格 |
