# 观澜AI 工作进度账本

## 2026-05-11 关键信号页面体系阶段性设计优化已验收

- 任务汇总：`V2-KEY-SIGNALS-SYSTEM / WSD-20260511-key-signals-page-system`。
- 状态：`accepted / phase-design-optimized`。
- closeout：
  - `agent-workflow/reports/WSD-20260510-key-signals-compression-closeout.md`
  - `agent-workflow/reports/WSD-20260511-front-signal-report-closeout.md`
  - `agent-workflow/reports/WSD-20260511-structured-signal-card-closeout.md`
  - `agent-workflow/reports/WSD-20260511-builder-perspective-system-closeout.md`
- 覆盖页面：`signals.html`、`signal-detail.html`、`structured-signal.html`、`builders.html`、`builder-detail.html`。
- 栏目页结果：关键信号栏目页收敛为 Signal Header、Lead Signal、Signal Library、Evidence & Calibration、Tracking Index 五个核心区；页面高度压缩，桌面 / 移动横向溢出为 0。
- Front Signal 详情结果：收束为 7 个报告区，新增 Report Meta Bar、Fact Ledger、Business Variables、Evidence & Calibration、Watch Next 等报告结构。
- 常规信号详情结果：收束为 Signal Dossier、Source Ledger、Commercial Read、Upgrade Watch、Related Path 五个紧凑区，低于 Front Signal 报告权重。
- Builders 体系结果：Builders 入口页重构为观点入口，Builder 详情页重构为 profile dossier + view-change timeline，明确观点用于校准判断，不替代一手事实证据。
- 验收：四个 closeout 均记录 `node --check 01-SiteV2/site/assets/app.js` 通过、syntax gate 通过、桌面 / 移动截图和横向溢出检查；调度中枢复核 `node --check 01-SiteV2/site/assets/app.js` 通过。
- 残余：部分截图过程仍有静态资源 404，疑似 favicon / 静态资源请求；Builders 身份仍受现有 source URL / mock data 丰富度限制；本次不是 Netlify/Git 发布验收。

## 2026-05-10 商业内参 V2 设计规范已验收

- 任务：`V2-BUSINESS-BRIEF-DESIGN / WSD-20260510-11-v2-business-brief-design`。
- 状态：`accepted / design-spec-ready`。
- closeout：`agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-closeout.md`。
- 设计规范：`agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-spec.md`。
- 模块矩阵：`agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-matrix.md`。
- 验收结论：Design Director 93.6/100，通过会员核心页建议线 85；PM 门禁、WAVE、模块决策表、Copy 表、QA 设计可开发性验收齐全。
- 核心口径：商业内参是 V2 会员 / 增值产品入口，不是普通文章栏目；商业热力图是会员层前台表达和后台判断资产，不做公开榜单。
- 会员边界：普通用户 / 登录用户 / 会员分层；锁定态只锁受限模块，不整页遮挡；下载 / 保存 / 分享延期复核。
- 后续建议：可新建 `V2-BUSINESS-BRIEF-IMPLEMENT` 开发任务，允许范围建议为 `brief.html`、`assets/app.js`、`assets/styles.css`；Dev 后必须补普通用户、登录用户、会员、管理员四状态与桌面 1440px / 移动 390px 截图验收。

## 2026-05-10 机会解码 V2 设计规范已验收

- 任务：`V2-OPPORTUNITY-DESIGN / WSD-20260510-10-v2-opportunity-decode-design`。
- 状态：`accepted / design-spec-ready`。
- closeout：`agent-workflow/reports/WSD-20260510-10-v2-opportunity-decode-design-closeout.md`。
- 设计规范：`agent-workflow/reports/WSD-20260510-10-v2-opportunity-decode-design-spec.md`。
- 模块矩阵：`agent-workflow/reports/WSD-20260510-10-v2-opportunity-decode-design-matrix.md`。
- 验收结论：Design Director 87/100，通过栏目 / 详情页 `>=80` 线；PM 门禁、WAVE、模块决策表、Copy 表、QA 设计可开发性验收齐全。
- 核心口径：机会解码不是旧机会库或新闻列表，而是低频、少而精的机会判断报告；证据不足内容进入“观察中方向”，不得包装成正式深度报告。
- 后续建议：可新建 `V2-OPPORTUNITY-DECODE-IMPLEMENT` 开发任务，允许范围建议为 `opportunities.html`、`opportunity-detail.html`、`assets/app.js`、`assets/styles.css`；Dev 后必须补桌面 1440px 与移动 390px 截图验收。

## 2026-05-10 调度派发机制冲突修复

- 状态：已完成。
- 触发原因：用户要求检查多轮任务派发方式是否存在冲突，并立即修改。
- 已统一三轨派发：`quick_fix` / `formal_task` / `autopilot_chain`，避免小修也建任务、连贯任务被拆碎、自动化任务降低硬闸门。
- 已新增收口箱：`agent-workflow/inbox/closeout-queue.jsonl`，执行窗口完成后可登记 closeout，调度窗口可用 `检查收口箱` / `验收收口箱` 自动发现并验收。
- 已修正派发模板：默认读取 `AGENTS.md` + `current-context.md` + 当前派发单；页面开发入口统一为 `01-SiteV2/site/`；V1 `04-Site` 不再作为当前页面或脚本默认入口。
- 已修正调度治理文件：短提示词、派发输出字段、收口箱机制、`current-context.md` 维护规则和轻量启动边界已统一。
- 已更新 `AGENTS.md` 与 `current-context.md`，把收口箱和 V2-only 验证口径写入默认规则。

## 2026-05-10 V2-only 设计规范总纲冲突清理完成

任务：
- 看板编号：`V2-DESIGN-SPEC-RECONCILE`
- Task ID：`WSD-20260510-02-v2-design-spec-reconciliation`
- closeout：`agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-closeout.md`
- 状态：`accepted`

已完成：
- 先输出冲突清单：`agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-conflicts.md`。
- 旧 `DESIGN.md` 已归档：`agent-workflow/product/archive/DESIGN-2026-05-10-pre-v2-spec-reconciliation.md`。
- `agent-workflow/product/DESIGN.md` 已重写为 V2-only 单一可信设计总纲。
- 当前有效导航统一为：今日要点 / 关键信号 / 机会解码 / 商业内参。
- The Point 降级为观点校准模块；Trends 降级为趋势背景和热力输入。
- V2 网站导航栏 Logo 明确以当前正在使用的 `01-SiteV2/site/assets/brand/logo-wavesight-reference-horizontal.svg` 为准，不得轻易更换、重绘或调整识别结构。
- 页面宽度、圆角、图表边界、VI / SVG / token-first、Logo 尺寸、导航背景和截图验收口径已集中沉淀。
- 明确禁止继续使用 `frontend-design`，并禁止继承 `V2-SITE-QUALITY-AUTO` failed / not-accepted 成果。

范围：
- 未修改 `01-SiteV2/site/`。
- 未修改 `01-SiteV2/content/`。
- 未修改 `docs/brand/wavesight-ai-vi/` 正式 VI 资产。
- 未修改 Netlify / GitHub / automation 配置。

## 2026-05-10 任务派发轻量启动读取升级

- 状态：已完成。
- 用户问题：执行任务启动时需要读取的文档过多，导致派发和执行窗口启动成本高。
- 已新增：`agent-workflow/governance/current-context.md`，作为 V2 当前事实、导航、VI、失败任务、每日生产线和按任务类型补读清单的轻量入口。
- 已更新：`AGENTS.md`，默认新窗口只读 `AGENTS.md`、`current-context.md` 和当前任务派发单。
- 已更新：`agent-workflow/execution/TASK-window-dispatch-template.md`，派发单模板改为 3 个默认入口 + 按类型补读 1-4 个单一真源。
- 已更新：`agent-workflow/governance/window-dispatch-hub.md`，调度规则写入“轻量启动读取”模式。
- 已更新：`agent-workflow/execution/dispatch-board.md` 使用建议，后续派发默认按轻量读取生成。
- 执行原则：旧 handoff、progress、feature、历史 closeout、旧 PRD 和旧报告不再默认读取，只在任务指定、收口验收、冲突追溯或状态恢复时读取。

## 2026-05-10 VI 规范收敛清理

- 状态：已完成。
- 依据：`agent-workflow/reports/WSD-20260510-vi-home-daily-closeout.md`。
- 已完成：清理 `AGENTS.md` 中 `frontend-design` 作为审美主准则的旧口径，改为观澜 AI VI + Apple / Linear / Stripe + `design-taste-frontend` / `gpt-taste` / `redesign-existing-projects` / `high-end-visual-design` + `awesome-design-md`。
- 已完成：更新 `agent-workflow/product/DESIGN.md`，写入当前有效设计口径、背景色规则和 Logo 默认尺寸规则；历史草案如与最新 VI / closeout 冲突，以最新口径为准。
- 已完成：更新 `agent-workflow/v2/v2-workflow-skill-graph.md`，修正 UI / UE Agent 与 V2 VI / Design System Agent 的 skill 优先级。
- 已完成：更新 `docs/brand/wavesight-ai-vi/brand-tokens.css` 与站点副本，新增 `--gl-bg-page: #FFFDF8`、`--gl-paper-warm: #FFFDF8`。
- 已完成：更新 `visual-identity-guidelines.md`、`USAGE.md`、`logo-reference-guidelines.md`，统一 V2 公开页面背景为 `#FFFDF8` / `--gl-bg-page`，正式横版 Logo 默认不低于 `160px`，小于 `120px` 时优先使用 symbol。
- 验证：旧关键冲突短语扫描无命中；后续页面任务应按新口径执行。

## 2026-05-10 frontend-design 彻底停用与 token 统一

- 状态：已完成。
- 用户要求：清理旧 `frontend-design` 口径，不再使用 `frontend-design` 技能，统一 token。
- 已完成：`AGENTS.md`、`agent-workflow/product/DESIGN.md`、`agent-workflow/v2/v2-workflow-skill-graph.md`、`agent-workflow/agents/ui-ue-agent.md`、`agent-workflow/governance/tool-registry.md`、`agent-workflow/governance/window-dispatch-hub.md`、`agent-workflow/prompts/worker.md` 均改为不得使用 `frontend-design`。
- 已完成：站点样式不再重复定义品牌同名 `--gl-*` token；`01-SiteV2/site/assets/styles.css` 只保留站点别名，品牌色、字体、背景、阴影、圆角统一来自 `brand/brand-tokens.css`。
- 已完成：`docs/brand/wavesight-ai-vi/brand-tokens.css` 与站点副本补齐 `--gl-positive`、`--gl-risk`、`--gl-radius-sm/md/lg`。
- 当前有效设计技能：`design-taste-frontend`、`gpt-taste`、`redesign-existing-projects`、`high-end-visual-design`、`awesome-design-md`。

## 2026-05-10 VI / HomeTemplate / Daily Brief 阶段收口

任务：
- `WSD-20260510-vi-home-daily`
- closeout：`agent-workflow/reports/WSD-20260510-vi-home-daily-closeout.md`
- 状态：`accepted / partial-page-template-ready`

验收结论：
- 接受为 V2 首页母版与今日要点 Newsletter 模板的阶段验收。
- 不等同于全站页面系统最终验收。
- 不覆盖关键信号页面体系、Front Signal / Structured Signal / Builders 详情页、Netlify 部署或 Git 提交。

已完成：
- VI 与设计 skill 当前口径已明确为观澜 AI VI + Apple / Linear / Stripe 高级商业网站方向 + taste-skill / awesome-design-md。
- 首页已形成标准导航、Hero、今日要点、关键信号、机会解码、商业内参预览等高保真母版。
- 今日要点已从普通栏目页调整为 AI 商业判断 Newsletter，模块压缩为 6 个核心区。
- 全局公开页面背景统一到 `#fffdf8` 口径。

验证：
- 首页和 Daily Brief 均有桌面 / 移动 full-page 截图。
- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告：`agent-workflow/reports/quality-gates-syntax-2026-05-10-20260510-141005.md`。

遗留：
- `AGENTS.md` 与 `agent-workflow/product/DESIGN.md` 的 `frontend-design` 旧主准则残留已在 2026-05-10 VI 规范收敛清理中处理。
- 关键信号页面体系应另派发。

## 2026-05-10 AI HOT 优先每日自动化与一键 source-router 脚本升级

任务：
- `WSD-20260510-09-v2-aihot-daily-pipeline-upgrade`
- closeout：`agent-workflow/reports/WSD-20260510-09-v2-aihot-daily-pipeline-upgrade-closeout.md`
- 状态：`accepted / automation-updated`

已完成：
- 新增 `agent-workflow/tools/run-v2-daily-pipeline.mjs`。
- 每日自动化 `v2-content-site-daily-update` 已更新为先运行该脚本。
- AI HOT 与联网关键词搜索已明确为 V2 每日生产线主数量池；follow-builders 已调整为全量扫描的高价值 Builder 观点雷达，不设 Raw / Pool 固定比例。
- `run-v2-daily-pipeline.mjs` 已优先调用真实 follow-builders skill，失败时才退回 builder query proxy。
- 更新 `agent-workflow/governance/v2-current-rule-overrides.md`。
- 更新 `01-SiteV2/content/README.md`。
- 更新 `01-SiteV2/content/10-databases/source-registry-v2.json`。
- 更新 `agent-workflow/tools/run-quality-gates.mjs`，将新脚本纳入 syntax 检查。

验证：
- 脚本 syntax 检查通过。
- dry-run 成功从 AI HOT 拉取候选。
- GDELT 异常会进入 failed_sources，不阻塞 AI HOT 主路径。
- 自动化仍 ACTIVE，每天 09:00。

2026-05-10 追加修正：
- follow-builders 监测对象约 25 个，每日可用量通常约 10-20 条。
- 因此脚本不再按 `40/30/30` 给 follow-builders 硬配额；AI HOT 与联网关键词搜索承担主数量池，follow-builders 全量扫描后按质量进入 Point / Trend / Signal 线索。

## 2026-05-10 新增每日生产线 / 栏目 / 知识库治理任务

任务：
- `WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance`
- 派发单：`agent-workflow/execution/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance.md`
- 状态：`accepted / governance-rules-current`

任务口径：
- 单独治理每日抓取流程、栏目产出质量、Obsidian 知识库生成要求和历史冲突规则。
- 采用 `Tool Wrapper + Inversion + Pipeline + Reviewer`。
- 第一阶段只做分类诊断与逐项确认清单，不修改自动化本体、生产规则、content、knowledge 或 site。
- 后续必须按 A-F 类别逐项得到用户确认后执行。

六个确认类别：
- A. 每日抓取流程。
- B. 内容漏斗质量。
- C. 栏目产出标准。
- D. 知识库生成规则。
- E. 历史冲突清理。
- F. 验收与回填。

当前进展：
- A-D 已按用户逐项确认完成并写入 stage summary。
- E 已确认并完成，已清理旧 Daily Brief / Opportunities / Trends / The Point 一级栏目、Raw 30-50、行动建议 / 下一步验证动作等历史口径冲突。
- F 已确认并完成最终验收与回填，closeout 已写入 `agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-closeout.md`。
- 当前覆盖规则入口：`agent-workflow/governance/v2-current-rule-overrides.md`。

## 2026-05-10 首批 Obsidian 知识卡片入库

任务：
- `WSD-20260510-07-v2-knowledge-first-curation`
- closeout：`agent-workflow/reports/WSD-20260510-07-v2-knowledge-first-curation-closeout.md`
- 状态：`accepted / first-cards-ingested`

已完成：
- 从 2026-05-10 今日 3 条 Front Signal 生成 3 张 Signal 卡。
- 从 2026-05-10 今日 6 条 Point Calibration 生成 6 张 Point 卡。
- 从 Sierra、Anthropic、Collibra 相关内容生成 3 张 Case 卡和 3 张 Company 卡。
- 新增 `01-SiteV2/knowledge/00-MOC/2026-05-10--daily-curation--first-batch.md`。
- 更新 `01-SiteV2/knowledge/00-MOC/WaveSight Knowledge MOC.md`。
- 补充 4 个中文可见索引：`00-今日信号索引.md`、`00-今日观点索引.md`、`00-今日案例索引.md`、`00-公司索引.md`。
- 建立 Signal / Point / Case / Company / Daily Curation 之间的 Obsidian 双链。

验证：
- Signal 卡 3 张、Point 卡 6 张、Case 卡 3 张、Company 卡 3 张。
- 双链引用 66 处。
- `feature_list.json` JSON 结构检查通过。
- `syntax` Quality Gate 通过。

未做：
- 未把 Raw 全量搬入知识库。
- 未修改 V2 网站页面。
- 未部署 Netlify。

## 2026-05-10 V2 Obsidian 长期知识库目录与模板已创建

任务：
- `WSD-20260510-06-v2-obsidian-knowledge-layer`
- closeout：`agent-workflow/reports/WSD-20260510-06-v2-obsidian-knowledge-layer-closeout.md`
- 状态：`accepted / knowledge-layer-ready`

已完成：
- 新增 `01-SiteV2/knowledge/`。
- 新增 MOC、Signals、Points、Cases、Opportunities、Trends、Sources、Companies、People、Templates、Archive 目录。
- 新增 9 个 Obsidian 模板：
  - signal
  - point
  - case
  - opportunity
  - trend
  - source
  - company
  - person
  - daily curation
- 更新 `01-SiteV2/README.md` 和 `docs/README.md`。

目录口径：
- `01-SiteV2/content/` 继续作为每日生产漏斗。
- `01-SiteV2/knowledge/` 作为长期知识库层。
- Raw 不全量入库，优先沉淀 Front Signal、Point、Case、Opportunity 和长期 Trend。

## 2026-05-10 今日监测新版补跑与 Obsidian 知识库结构复核

任务：
- `WSD-20260510-05-v2-daily-monitoring-rerun-and-obsidian-review`
- closeout：`agent-workflow/reports/WSD-20260510-05-v2-daily-monitoring-rerun-and-obsidian-review-closeout.md`
- 状态：`accepted / rerun-complete`

用户要求：
- 判断 Obsidian 中长期积累观点库 / 案例库 / 信号库时，当前文件夹是否需要优化。
- 重新执行今日更新后的监测任务。

已完成：
- 确认 Obsidian vault 根目录为 `C:\Users\86186\Documents\Fang\wiki\AI热点`。
- 判断 `01-SiteV2/content/` 应继续作为生产漏斗，不建议直接承担全部长期知识库功能。
- 建议后续新增 `01-SiteV2/knowledge/`，分为 MOC、Signals、Points、Cases、Opportunities、Trends、Sources、Companies、People、Templates、Archive。
- 2026-05-10 今日监测已按新版宽采集补跑：
  - Raw 90
  - Raw originals 90
  - Pool 22
  - Structured 10
  - Front Signals 3
  - Point Calibration 6
- 已接入 follow-builders 作为 M 级 builder-monitor，新增 3 条 Point Calibration。
- 已运行 V2 site data generator，更新 `01-SiteV2/site/data/site-content.json` 和 `site-content.js`。
- `v2-source-quality-gate`、`v2content`、`syntax` 均 passed。

遗留：
- 未物理创建 `knowledge/`，等待用户确认后再建目录和模板。
- Deep Dive 未新增，原因是新增候选未形成足够证据链，不硬凑。

## 2026-05-10 Builders / Point 原文链接修复验收

任务：
- `WSD-20260510-04-builders-source-link-repair`
- closeout：`agent-workflow/reports/WSD-20260510-04-builders-source-link-repair-closeout.md`
- 状态：`accepted / link-data-repair`

完成：
- 修复 Sierra 官方来源失效链接。
- 补齐 3 条 legacy refined point 缺失 `source_url`。
- 修复 2026-05-10 Front Signal 正文中的 Sierra 官方来源链接。
- Point / Builders 卡片兼容 `sourceUrl` / `source_url`。
- 为 X 来源新增“文本镜像”兜底入口。
- 重生成 `01-SiteV2/site/data/site-content.json` 和 `site-content.js`。

调度复验：
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-10`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。

遗留：
- 未跑桌面 / 移动浏览器截图。
- 若后续扩展外链组件或镜像入口，应新建外链健康度治理任务并补浏览器验收。

## 2026-05-10 V2 每日监测自动化本体已升级为 80-150 宽采集漏斗

用户反馈：
- 每日监测仍像按旧版本运行。
- 新版要求 Raw 80-150 条新闻，并合并 AI HOT / follow-builders 等来源，做新闻分级。

核查：
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md` 和 `agent-workflow/v2/v2-daily-source-collection-strategy.md` 已写新版策略。
- 历史核查记录：实际每天 09:00 运行的 Codex app automation `v2-content-site-daily-update` prompt 曾是旧 Raw 30-50；该问题已修复，2026-05-10 晚间又按最新来源口径重新覆盖。

已处理：
- 直接更新 `C:\Users\86186\.codex\automations\v2-content-site-daily-update\automation.toml`。
- 自动化保持 `ACTIVE`，时间仍为每天 09:00。
- Prompt 已升级为 Raw 80-150；低信号或接口失败日可降级 50-80 并说明原因。
- Prompt 已要求 Pool 20-30、Structured 8-15、Front Signals 3-5、Deep Dive 1-2、Trend Updates 3-5。
- Prompt 最新覆盖口径为：AI HOT 与联网关键词搜索承担主数量池；follow-builders 全量扫描但不设固定比例；HN、GitHub、GDELT、官方、媒体、VC、developer / research / marketplace / customer / regulation 等来源用于补充和二搜。
- Prompt 已要求 AI HOT / follow-builders 等 M 级线索通道不得作为事实主证据，必须解析原始 URL 后按 S/A/B/C/D 分级。

回填：
- 新增报告：`agent-workflow/reports/WSD-20260510-03-v2-daily-monitoring-automation-prompt-fix-closeout.md`
- 新增看板记录：`SYS-11`
- 更新 `V2-DAILY-AUTO` 看板口径。
- 更新 `GL-M4-022`，新增 `GL-M4-040`。

## 2026-05-10 新增 V2-only 设计规范总纲冲突清理任务

任务：
- 看板编号：`V2-DESIGN-SPEC-RECONCILE`
- Task ID：`WSD-20260510-02-v2-design-spec-reconciliation`
- 派发单：`agent-workflow/execution/WSD-20260510-02-v2-design-spec-reconciliation.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-closeout.md`
- 状态：`ready`

创建原因：
- 当前设计规范仍有 V1/P0/P1 历史段落残留。
- V2 当前导航、页面宽度、圆角、雷达/热力图边界和外部参考使用边界需要统一。
- 后续页面任务必须避免再次误读旧规范或继承失败任务成果。

任务口径：
- 只清理设计规范、看板、feature、progress 和 handoff。
- 不改 V2 网站页面代码。
- 不改 VI 资产。
- 不部署。

## 2026-05-10 调度状态冲突清理与派发漏洞修复

任务：
- `SYS-10 / WSD-20260510-01-dispatch-conflict-reconciliation`
- closeout：`agent-workflow/reports/WSD-20260510-01-dispatch-conflict-reconciliation-closeout.md`
- 状态：`accepted / governance-fixed`

用户要求：
- 梳理过去几轮任务流程优化后的主要冲突。
- 修复会妨碍后续派发效率和质量的漏洞。

已修复：
- 新增 `agent-workflow/governance/dispatch-state-reconciliation.md`，统一状态优先级和失败任务继承规则。
- 更新 `agent-workflow/governance/window-dispatch-hub.md`，加入状态冲突消解和 V2 页面路径口径。
- 更新 `agent-workflow/governance/quality-gates.md`，加入 V2-only 路径和 V2 常用检查入口。
- 更新 `agent-workflow/tools/run-quality-gates.mjs`，将 `content` / `point` / `site` / `all` 模式改为 V2 默认入口。
- 更新 `agent-workflow/governance/automation-fallback-policy.md`，确认 V2 每日自动化已启用，不再写“待重建”。
- 更新 `agent-workflow/governance/agent-memory.md`，沉淀失败任务、合并子项和下一步建议刷新规则。
- 更新 `agent-workflow/execution/dispatch-board.md`，新增 SYS-10，刷新“使用建议”，不再推荐已完成任务。
- 更新 `agent-workflow/feature_list.json`：`GL-M4-030` 和 `GL-M4-031` 为 `review`，`GL-M4-033` 为 `passed`，新增 `GL-M4-038`。

后续派发硬规则：
- 派发前先按 `dispatch-state-reconciliation.md` 统一状态。
- `failed / not-accepted / closed` 任务不得继续用原 Task ID 派发。
- 被 failed 任务合并过的子项不得视为已解决。
- V2 页面、内容、自动化默认入口是 `01-SiteV2/`，旧 `04-Site/` 只读参考。

## 2026-05-10 V2-SITE-QUALITY-AUTO 失败关闭为最高优先级口径

任务：
- `V2-SITE-QUALITY-AUTO / WSD-20260508-15-v2-site-design-copy-visual-system-autopilot`
- failed closeout：`agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-failed-closeout.md`
- 最终状态：`failed / not-accepted / closed`

用户裁决：
- 任务失败。
- 不验收。
- 结束任务。

接手硬规则：
- 不得继承此前 `ready / stage-1-diagnosis-first`、`completed / local-site-quality-pass / netlify-paused` 或任何 `accepted` 暗示。
- 不得把 stage1 诊断、stage2 截图、reference mockups、Design Director 分数、taste-skill 方向或 `local-site-quality-pass` closeout 当作通过验收证据。
- 相关产物只可作为失败样本、过程记录或复盘材料。
- 若后续重启全站页面质感方向，必须新建任务，重新定义商业情报平台的信息架构、数据阅读效率、商业分析逻辑和用户决策路径验收标准。

被合并项处置：
- `V2-PUBLIC-COPY-FOOTER-CLEANUP` 曾并入本任务，但本任务失败后不得视为已解决；如仍需处理页脚 / 公开文案 / 截图验收，必须重新派发继任任务。
- `V2-PAGE-TIME-DIMENSION` 曾并入本任务，但本任务失败后不得视为已解决；如仍需处理时间线索模块视觉 / 截图验收，必须重新派发继任任务。

## 2026-05-10 V2 Skill Pattern 调度闸门已建立

任务：
- `V2-WORKFLOW-SKILL-PATTERN-GATE`
- closeout：`agent-workflow/reports/V2-WORKFLOW-SKILL-PATTERN-GATE-closeout.md`
- 状态：`accepted / skill-pattern-gate-ready`

来源：
- 用户要求学习 Google Cloud Tech / Lavi Nigam《5 Agent Skill design patterns every ADK developer should know》，并用于提升观澜 AI 开发质量。

已完成：
- 新增 `agent-workflow/governance/skill-pattern-gate.md`。
- 将五类模式写入调度闸门：Tool Wrapper、Generator、Reviewer、Inversion、Pipeline。
- 更新 `agent-workflow/execution/TASK-window-dispatch-template.md`，新增 `Skill Pattern` 字段和 `7S. Skill Pattern Gate`。
- 更新 `agent-workflow/v2/v2-workflow-skill-graph.md`，新增 Skill Pattern 路由。
- 更新 `agent-workflow/governance/README.md`，将 `skill-pattern-gate.md` 纳入治理文件地图。

新规则：
- 后续新派发任务必须标注 Skill Pattern、Pattern 顺序、硬停顿和 Reviewer。
- 页面质感任务默认使用 `Tool Wrapper + Inversion + Pipeline + Reviewer`。
- 产品功能任务默认使用 `Inversion + Reviewer + Generator`。
- 自动化 / 内容入库 / 部署任务默认使用 `Pipeline + Reviewer`。
- 派发、收口和治理任务默认使用 `Generator + Reviewer`。
- closeout 必须提供对应 Pattern 证据，缺失不得 accepted。

边界：
- 未改 V2 网站页面。
- 未改内容库和每日自动化本体。
- 未新增临时 agent。
- 未做 Netlify deploy。

## 2026-05-08 V2 全站设计 / 文案 / 视觉资产质感升级自动包历史创建记录

用户要求：
- 基于当前网站页面粗糙简陋，审查排版、页头页脚、字体规范和 VI 规范，并提出优化建议。
- 优化确认后执行页面修改。
- 补充栏目图片，使用 imagegen / gpt-image2 等能力生成或引用适合观澜 AI 的商业内参视觉资产。
- 引入商业内参常用符号和元素，包括雷达图、热力图、判断卡、澜线、地平线和关系网络提示。
- 审查并规范全站文字表达。
- 先出整体诊断和标准，再按栏目一个一个优化。
- 如任务面板有相关任务，需要合并，且优先自动化执行。

状态覆盖：
- 本节仅保留历史创建过程，当前有效状态以 2026-05-10 失败关闭记录为准：`failed / not-accepted / closed`。
- 不得根据本节的 `ready / stage-1-diagnosis-first` 继续执行或视为可继承基线。

已创建：
- 看板编号：`V2-SITE-QUALITY-AUTO`
- Task ID：`WSD-20260508-15-v2-site-design-copy-visual-system-autopilot`
- 派发单：`agent-workflow/execution/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot.md`
- 状态：`ready / stage-1-diagnosis-first`

执行机制：
- 阶段 1：只输出全站诊断、Design Director 评分、设计 / 字体 / VI / 文案标准、视觉资产策略和逐栏目优化清单，不改页面代码。
- 阶段 1 输出后必须暂停，等待用户确认。
- 用户确认后阶段 2 自动执行，不需要重新派发；按 Home、今日要点、关键信号、机会解码、商业内参、详情页母版逐个优化。

已合并：
- `V2-PUBLIC-COPY-FOOTER-CLEANUP`：合并其页脚、公开前台文案和缺失截图验收。
- `V2-PAGE-TIME-DIMENSION`：合并其时间线索模块视觉与截图验收。
- `GL-M4-029 V2 字体规范`：作为字体硬基线。

用户修正：
- 不得借鉴 `V2-3`、`V2-8AUTO`、`V2-SITE-AUTO`、`V2-HERO-BLEND-EXTEND` 的页面完成度和验收结论。
- 上述任务只能作为历史上下文、现有代码范围和问题来源参考。
- 阶段 1 必须对当前页面重新诊断、重新评分、重新提出标准。
- 观澜 AI VI 规范已更新，必须以 `docs/brand/wavesight-ai-vi/` 和 `V2-VI-SVG-RESTORE` 生成的 48 个 SVG 资产作为 VI 硬规范。
- Logo、SVG、字体、token、动效和使用说明必须按最新 VI 资料库引用。

边界：
- 不恢复旧 `04-Site`。
- 不处理 `09-ai-news-radar`。
- 不新增一级导航，除非 PM 门禁通过且用户确认。
- 不把 The Point 或 Trends 恢复为 V2 一级栏目。
- 不做 Netlify deploy，除非用户单独确认。

## 2026-05-08 V2 VI SVG 还原与说明补齐

- 状态：`accepted / vi-svg-ready`。
- 使用技能：`image-to-code`。
- 范围：`docs/brand/wavesight-ai-vi/`。
- 已完成：对照用户提供的三张 VI 图，将现有可执行 SVG 从 31 个扩展到 48 个。
- 已完成：新增 `06-site-design-system/`，覆盖导航、按钮、标签、卡片、章节标题、搜索框、引用框、桌面模板、移动模板和数据图表。
- 已完成：补齐动效规范 SVG，包括动效 token、手风琴、弹窗淡入、禁用动效和阅读体验。
- 已完成：新增 `svg-restoration-guidelines.md`，写清 SVG 还原原则、变形/失真处理、必要时使用图像生成参考后再 SVG 化的边界。
- 已更新：`README.md`、`USAGE.md`、`visual-identity-guidelines.md` 和 `generate-executable-svg.mjs`。
- 已验证：生成脚本语法通过；生成 48 个 SVG；全量 SVG XML 解析通过。
- 收口记录：`agent-workflow/reports/WSD-20260508-14-vi-svg-restoration-closeout.md`。
- 调度中枢复验：生成脚本语法通过，`manifest.json` 可读取，48 个 SVG 结构检查通过。

## 2026-05-08 V2 首页首屏图融合与左延展已验收

执行任务：
- `V2-HERO-BLEND-EXTEND / WSD-20260508-13-v2-hero-image-blend-extend`
- closeout：`agent-workflow/reports/WSD-20260508-13-v2-hero-image-blend-extend-closeout.md`
- 状态：`accepted / hero-visual-fit`

完成：
- 仅修改 `01-SiteV2/site/assets/styles.css`。
- 首页首屏图片起点从 `33%` 左移到 `26%`，减少标题与主视觉之间的空白。
- 移除原先的白色覆盖层，改用横向与纵向渐隐遮罩，让图片边缘自然融入页面背景。
- 图片改为右侧锚定铺展，保留右侧主体可见，同时让画面更充分进入首屏。

验收：
- 桌面 `2048x1120`、桌面 `1440x900` 和移动 `390x900` 已有截图与 `qa-final.json` 记录。
- 三个视口均记录为无横向溢出。
- 截图目录：`agent-workflow/reports/v2-hero-image-blend-extend-2026-05-08/`。
- `syntax` Quality Gate 复验通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-08-20260508-055123.md`。

边界：
- 未重新生成图片资产。
- 未调整首屏文字、按钮、导航和后续栏目。
- 未部署 Netlify。

## 2026-05-08 V2 新闻源与接口升级完成

执行任务：
- `V2-SOURCE-INTERFACE-UPGRADE / WSD-20260508-10-v2-source-interface-upgrade-autopilot`
- closeout：`agent-workflow/reports/WSD-20260508-10-v2-source-interface-upgrade-autopilot-closeout.md`
- 状态：`accepted / source-registry-ready`

完成：
- 新增 `agent-workflow/v2/v2-source-interface-registry.md`。
- 新增 `01-SiteV2/content/10-databases/source-registry-v2.json`，共 27 个来源，默认启用 22 个。
- 新增 `agent-workflow/v2/v2-daily-source-collection-strategy.md`。
- 新增 `agent-workflow/v2/v2-commercial-brief-depth-standard.md`，每日信号 / 深挖机会卡 / 趋势链必须按商业内参深度、白话表达和展示元素生成。
- 新增 `agent-workflow/tools/v2-source-probe.mjs` 与 `v2-source-quality-gate.mjs`。
- 每日 09:00 自动化文档已更新为优先读取 source registry。
- 用户新增的 `aihot` skill 已安装到 `C:\Users\86186\.skill-store\aihot\SKILL.md`，并作为 M 级 `source-router` 采集通道写入 registry；`follow-builders` 也按 M 级采集通道处理。
- `source-registry-v2.json` 当前登记 27 个来源；Product Hunt、Crunchbase、Reddit、X / Twitter、LinkedIn 等 gated 来源默认不启用。
- 采集漏斗已扩大为 Raw 80-150、Pool 20-30、Structured 8-15、Front 3-5、Deep Dive 1-2、Trend Updates 3-5，并按默认 / 高信号 / 降级三档执行。
- 用户追加的展示与写作要求已纳入：时间线、热力图、雷达图、趋势图、机会地图、证据梯子等展示元素；内容面向普通老板，避免 AI 味、机械味和专家黑话。

验证：
- source registry JSON 解析通过。
- `v2-source-quality-gate` 通过。
- `v2-source-probe` 4/5 成功：GDELT、AI HOT、HN Algolia、GitHub 成功；arXiv 因 HTTP 429 限流失败，已记录降级。
- 调度中枢复验 `v2-source-quality-gate --date=2026-05-08` 通过，报告 `agent-workflow/reports/v2-source-quality-gate-2026-05-08.md`。
- `syntax` Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-08-20260508-053945.md`。

边界：
- 未处理 `09-ai-news-radar/`。
- 未恢复旧 `04-Site`。
- 未写入 V1 内容目录。
- 未做 Netlify deploy。
- 未默认启用 X / LinkedIn 非官方抓取。
- Product Hunt、Reddit、Crunchbase、X、LinkedIn 等需要 key / consent 的来源均默认禁用。

## 2026-05-08 V2 新闻源与接口升级任务已派发

用户要求：
- 新增新闻源和接口。
- 优化每天新闻抓取方式。

已创建：
- 看板编号：`V2-SOURCE-INTERFACE-UPGRADE`
- 派发单：`agent-workflow/execution/WSD-20260508-10-v2-source-interface-upgrade-autopilot.md`
- 状态：`ready / source-interface-upgrade`

任务目标：
- 建立 `source registry`，登记来源等级、接口类型、授权要求、降级路径和证据角色。
- 新增或评估 GDELT、Hacker News、GitHub、Product Hunt、arXiv、Reddit、VC / 产品 / 云市场等来源。
- 至少完成 3 类无密钥或低门槛来源 probe。
- 更新每日 09:00 自动化文档，使其优先读取 `source-registry-v2.json`。
- 保持每日自动化时间不变。

硬边界：
- 不处理 `09-ai-news-radar/`。
- 不恢复旧 `04-Site`。
- 不写入 V1 内容目录。
- 不做 Netlify deploy。
- 不默认启用 X / LinkedIn 非官方抓取。
- 不把需要付费或审批的接口硬编码为必需项。

## 2026-05-08 任务复盘账本已建立

- 状态：已完成。
- 触发：用户希望统计每个任务的任务简介、完成质量和完成时间，并记录关键动作，便于后续复盘。
- 已新增：`agent-workflow/reports/task-retrospective-2026-05-08.md`。
- 已改为简版诊断结构：任务诊断表、关键动作、优化建议、明日优先处理。
- 已记录：2026-05-08 V2 相关任务的完成时间、任务简介、难度排序、完成质量和复盘判断。
- 已单独记录关键动作：用户要求阅读 `A new way to think about composing skills to increase leverage: Skill Graphs 2.0` 并用其改进工作流程，该动作已关联到 `V2-WORKFLOW-SKILL-GRAPH-UPGRADE`。
- 质量口径：高质量完成、完成但需复核、低效或返工、调度 / 自动化记录。
- 每日自动化 `wavesight-daily-task-retrospective` 已更新为简版诊断型复盘，重点发现耗时长但质量不高的任务、关键提效动作，以及流程 / skill / agent 优化建议。

## 2026-05-08 V2 全页面时间维度接入进入复核

执行任务：
- `V2-PAGE-TIME-DIMENSION`
- closeout：`agent-workflow/reports/V2-PAGE-TIME-DIMENSION-closeout.md`
- 状态：`review / screenshot-gate-pending / netlify-paused`

完成：
- V2 站点新增统一 `时间线索` 模块。
- `01-SiteV2/site/assets/app.js` 新增 `dateIndexCard()` 与 `mountDateIndexes()`。
- `01-SiteV2/site/assets/styles.css` 新增 `.time-index`、`.time-card`、`.time-date` 样式，桌面双列、移动单列。
- 8 个前台页面均已加入时间维度：
  - `index.html`
  - `daily.html`
  - `signals.html`
  - `opportunities.html`
  - `brief.html`
  - `daily-detail.html`
  - `signal-detail.html`
  - `opportunity-detail.html`

验证：
- V2 app 语法通过。
- generated data 语法通过。
- 8 个 HTML 页面均包含 `data-date-index` 容器。
- 本地 HTTP 抽查 8 个页面均返回 200，且均包含时间索引容器。
- `v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-190330.md`。
- `syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-190330.md`。
- 调度中枢复验 `v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-190756.md`。
- 调度中枢复验 `syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-190756.md`。

数据复核：
- `contentIndex.dates` 当前覆盖 10 个日期：`2026-04-28` 至 `2026-05-07`。

硬闸门结论：
- 暂不 accepted。
- 原因：页面类任务缺桌面 / 移动截图落盘，调度中枢当前环境未能加载 Playwright 补跑截图。
- 后续应补 UI / UE + QA 桌面与移动截图复核后再最终验收。

边界：
- 未新增独立日期详情页。
- 未改变详情页路由或历史日期筛选逻辑。
- 未恢复旧 `04-Site`。
- 未处理 `09-ai-news-radar`。
- 未做 Netlify deploy。

## 2026-05-08 V2 历史日期索引修复完成

执行任务：
- `V2-HISTORY-DATE-INDEX-FIX`
- closeout：`agent-workflow/reports/V2-HISTORY-DATE-INDEX-FIX-closeout.md`
- 状态：`completed / local-data-ready / netlify-paused`

完成：
- 修复 `01-SiteV2/site/scripts/sync-v2-site-data.mjs` 的历史日期索引口径。
- 历史精修 Signal / Point / Trend / Opportunity 优先使用 `original_date` 作为资产日期。
- 新增 `dateRefs`，从 `source_paths` 解析跨日期历史来源，让同一条精修资产能计入所有相关来源日期。
- `contentIndex.dates` 改为从实际 Signals / Points / Trends / Opportunities 汇总，不再只依赖 `04-selected-signals/*-front-signals.md`。
- 已重新生成 `01-SiteV2/site/data/site-content.json` 与 `site-content.js`。

结果：
- `contentIndex.dates` 从 3 个日期扩展为 10 个日期。
- 已覆盖 `2026-04-28` 至 `2026-05-07` 的历史与当前资产。
- 当前 generated data：Signals 15、Points 14、Trends 17、Opportunities 8。

验证：
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs` 通过。
- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node --check 01-SiteV2/site/data/site-content.js` 通过。
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07` 通过。
- `v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-185404.md`。
- `syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-185404.md`。

边界：
- 未改页面布局和样式。
- 未恢复旧 `04-Site`。
- 未处理 `09-ai-news-radar`。
- 未做 Netlify deploy。

## 2026-05-08 V2 前台备注性文案与页脚清理进入复核

执行任务：
- 用户追加：删除全站对内备注性文案，并重做网站尾部。
- closeout：`agent-workflow/reports/WSD-20260508-08-v2-public-copy-footer-cleanup-closeout.md`
- 状态：`review / screenshot-gate-pending / netlify-paused`

完成：
- 删除首页固定百分比、变化快照、内参样张等样例模块。
- 删除机会页固定观察卡、固定趋势卡。
- 删除信号页固定筛选标签和样例说明段。
- 删除商业内参页固定矩阵和备注性说明段。
- 移除所有页面对 `sample-content.js` 的加载，并删除样例数据文件。
- 页脚改为低调品牌收尾，仅保留 Logo 与版权信息，不重复顶部导航。

验证：
- 8 个页面本地访问 200。
- 浏览器检查无空 section、无横向溢出、无指定备注性词句。
- 调度中枢复验 `syntax` 质量门禁通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-190245.md`。
- 调度中枢复核确认：`sample-content.js` 已删除，前台页面不再加载 `sample-content.js` 或 `WaveSightSample` fallback。

硬闸门结论：
- 暂不 accepted。
- 原因：页面 / 文案类任务缺桌面截图落盘、缺移动端截图验收，Design Director 证据化复核不足。
- 后续应补派 UI / UE + QA 截图复核后再最终验收。

## 2026-05-08 V1 历史 AI商业雷达与 The Point 全量 V2 化已验收

执行任务：
- `V2-HISTORY-FULL-REFINE-AUTO / WSD-20260508-09-v1-history-full-refine-autopilot`
- closeout：`agent-workflow/reports/WSD-20260508-09-v1-history-full-refine-autopilot-closeout.md`
- 状态：`accepted / local-site-ready / netlify-paused`

完成：
- 12 篇 V1 历史源文档已全量覆盖。
- 8 篇 AI商业雷达：2026-04-29 至 2026-05-06。
- 4 篇 The Point：2026-05-03 至 2026-05-06。
- Source Coverage：`agent-workflow/reports/WSD-20260508-09-v1-history-full-source-coverage.md`。
- 发布索引：`01-SiteV2/content/00-inbox/legacy-full-import/history-full-publish-ready-index-2026-05-08.md`。
- history-refined 内容已写入 Signal / Trend / Point / Opportunity / HeatEvidence 对应目录。
- `sync-v2-site-data.mjs` 已读取 `history-refined/` publish-ready 内容。
- `site-content.json` 与 `site-content.js` 已重新生成。

结果：
- 原始拆解条目：104。
- 已处理条目：104。
- publish-ready：37。
- hold：53。
- reject：14。
- 新增入站资产：4 Signals、5 Points、4 Trends、2 Opportunities、6 HeatEvidence。

验证：
- 调度中枢复验 `v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-184331.md`。
- 调度中枢复验 `syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-184331.md`。
- 浏览器检查：`agent-workflow/reports/v2-history-full-refine-site-ready-2026-05-08/browser-check.json`。
- 桌面 / 移动截图已保存到 `agent-workflow/reports/v2-history-full-refine-site-ready-2026-05-08/`。

边界：
- 未处理 `09-ai-news-radar/`。
- 未恢复旧 `04-Site`。
- 未做 Netlify deploy。
- 未切正式域名。
- 仍有 53 个 hold 条目，后续可按赛道二搜补证。

## 2026-05-08 V2 字体规范已纳入 VI 与设计硬规范

用户补充字体规范，要求观澜 AI 字体系统服务于高级、克制、东方智识、商业内参和判断感。

已完成：
- 新增正式字体规范：`docs/brand/wavesight-ai-vi/typography-guidelines.md`。
- `visual-identity-guidelines.md` 已将 Typography 改为引用完整字体规范。
- `USAGE.md` 已把字体规范列为页面、报告和内参排版必读。
- `README.md` 已补充 typography 文件说明。
- `agent-workflow/product/DESIGN.md` 已把字体规范纳入 V2 VI 硬基线，并替换旧的笼统字号建议。
- `AGENTS.md` 已将 `typography-guidelines.md` 加入 UI / 页面 / 排版 / 视觉任务必读清单。
- `brand-tokens.css` 与 `01-SiteV2/site/assets/brand/brand-tokens.css` 已同步补齐 serif / sans / en / mono 字体 token、字距 token 和核心字号 token。
- Logo 说明中的英文字体推荐已统一为 `Inter / IBM Plex Sans / Avenir Next`，英文品牌名统一为 `WAVESIGHT AI`。

边界：
- 本轮只纳入规范和 token，未重排页面，未做截图验收，未部署 Netlify。

## 2026-05-08 V1 历史 AI商业雷达与 The Point 全量 V2 化任务已派发

用户指出：
- V1 版本网站中有 2026-04-29 到 2026-05-06 的 AI商业雷达，以及 2026-05-03 到 2026-05-06 的 The Point。
- 前一轮只完成少量 legacy candidates，不足以覆盖历史资产。

已创建：
- 看板编号：`V2-HISTORY-FULL-REFINE-AUTO`
- 派发单：`agent-workflow/execution/WSD-20260508-09-v1-history-full-refine-autopilot.md`
- 状态：`ready / full-history-site-ready-required`

任务口径：
- 全量处理 8 篇 AI商业雷达和 4 篇 The Point，共 12 篇源文档。
- 每篇必须登记、拆解、去重、V2 归类、精修和给出 `publish-ready / hold / reject`。
- publish-ready 内容必须写入 `01-SiteV2/content/` 并接入 V2 site data generator。
- 必须重新生成 `01-SiteV2/site/data/site-content.json` 与 `site-content.js`。
- 任务完成后本地 V2 新网站必须直接可用，并完成桌面 / 移动截图验收。
- 不处理 `09-ai-news-radar/`，不恢复旧 `04-Site`，不做 Netlify deploy。

## 2026-05-08 V2 深挖内容标准优化完成

用户要求：
- 每条 Front Signal 必须联网二搜。
- 至少 3 个 S/A/B 来源。
- 每条 1200-1800 中文字。
- Deep Dive 如生成，必须 3000-6000 字、至少 5 个来源、含证据链和反向证据。
- 内容要达到“深挖”程度，让用户一篇文章深刻了解所有内容。

已完成：
- `2026-05-07-front-signals.md` 的 3 条 Front Signal 已补充联网二搜、来源等级、增量事实、证据链解读和用户理解框架。
- `2026-05-07-opportunity-deep-dive.md` 已补充来源地图、情景推演和更完整的证据链解释。
- `v2-content-gate.mjs` 已从“可见字符”升级为严格中文字符计数，并校验 Deep Dive 证据链来源数量。
- `v2-content-quality-gate.md` 已同步更新严格门禁口径。
- V2 site data 已重新生成。

严格计数：
- Signal 1：1417 中文字，二搜来源 4 条。
- Signal 2：1411 中文字，二搜来源 4 条。
- Signal 3：1377 中文字，二搜来源 4 条。
- Deep Dive：3410 中文字，证据链来源 6 条，含反向证据。

验证：
- 执行窗口验证：`v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-181228.md`。
- 执行窗口验证：`syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-181228.md`。
- 调度中枢复验：`v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-181845.md`。
- 调度中枢复验：`syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-181845.md`。
- V2 site 禁用前台词扫描无命中。
- 收口文件：`agent-workflow/reports/WSD-20260508-08-v2-deep-dive-content-depth-closeout.md`。
- 本轮未上传 Netlify。

## 2026-05-08 V2 全站文案模块与排版优化完成

用户指出：
- 页面存在莫名空白和右侧孤立文字。
- `关联判断网 / 信号关联判断网 / 观点校准` 等表达工程化、晦涩、难懂。
- 希望改成克制、高雅、精炼且易懂的文案。

已完成：
- 全站模块文案已改为读者可理解的表达：`关联判断网` 系列改为 `相关观察 / 相互印证`，`观点校准` 改为 `观点参照`，`趋势背景` 改为 `趋势线索`。
- 清理前台可见的工程化表达：`Relation Network / Point Calibration / Trend Context / Data Snapshot / Matrix Card / 判断资产 / 判断链 / 暂未绑定` 等。
- 生成器默认文案同步更新，避免下次生成数据后旧词回流。
- `.section-head` 改为单列阅读流，说明文字不再被推到页面最右侧。
- 关系区孤立数字计数已隐藏，关系卡、观点卡、快照卡已收紧排版。

验证：
- `v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-180415.md`。
- `syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-180415.md`。
- 浏览器检查保存到 `agent-workflow/reports/v2-copy-layout-check-2026-05-08/browser-check.json`，8 个页面桌面 / 移动共 16 项全部通过。
- 无横向溢出；禁用晦涩词扫描无命中；section-head 说明文字未再右漂。
- 本轮未上传 Netlify。

## 2026-05-08 V2 Legacy Candidates 精修、合并与本地站点接入完成

执行任务：
- `V2-LEGACY-REFINE-AUTO / WSD-20260508-03-v2-legacy-candidates-refinement-autopilot`
- closeout：`agent-workflow/reports/WSD-20260508-03-v2-legacy-candidates-refinement-autopilot-closeout.md`
- 状态：`completed / local-site-ready / netlify-paused`

完成：
- 已输出 legacy refinement inventory：`agent-workflow/reports/WSD-20260508-03-legacy-refinement-inventory.md`。
- 已输出发布索引：`01-SiteV2/content/00-inbox/legacy-import/legacy-publish-ready-index-2026-05-08.md`。
- 已写入 refined 内容到 `01-SiteV2/content/*/refined/`。
- `sync-v2-site-data.mjs` 已读取 refined publish-ready 内容，并重新生成 `site-content.json` / `site-content.js`。
- 当前 generated data 新增 legacy refined：2 条 Signal、3 条 Point、3 条 Trend、3 条 Opportunity。
- 本地 V2 站点 HTTP 检查和桌面 / 移动截图完成，材料在 `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/`。

验证：
- V2 data generator、site app 和 generated JS 语法检查通过。
- `v2content --date=2026-05-07` 通过。
- `syntax` 通过。
- 公开页面 / app / generated data 禁用词扫描通过。
- 浏览器检查 30 项通过，失败 0，核心页面无横向溢出。

未执行：
- 未处理 `09-ai-news-radar/`。
- 未恢复旧 `04-Site`。
- 未做 Netlify deploy。

## 2026-05-08 V2 标签体系沿用与全页面体现完成

用户要求：
- 查看 tag 体系是否沿用 V1 网站版本。
- 确认 V2 网站中每个页面都有体现。

检查结论：
- V1 旧站有 tags / taxonomy 数据和 tags 页面样式。
- 项目正式标签体系已沉淀在 `agent-workflow/product/tag-taxonomy.md`，共 9 类：`track / function / scenario / customer / evidence / stage / region / source / point`。
- V2 此前只在少数页面显示 chip，且部分 chip 是阶段、评分或泛词，不等于正式 tag 体系。

已完成：
- `01-SiteV2/site/scripts/sync-v2-site-data.mjs` 已沿用正式标签体系，输出 `tagTaxonomy` 61 个标签。
- Signal / Point / Trend / Opportunity 已生成规范 `tags` 对象。
- `01-SiteV2/site/assets/app.js` 已统一渲染标签；卡片显示少量可读标签，详情侧栏按组展示。
- `styles.css` 已补分组标签样式。
- `index.html`、`opportunities.html` 已清理非正式泛 chip。
- V2 仍不恢复 tags 一级导航，符合“Tags 暂不作为一线栏目”的 V2 口径。

验证：
- Signals 9 条，均覆盖 `track / evidence`。
- Points 6 条，均覆盖 `point / track / source`。
- Trends 10 条，均覆盖 `track / stage`。
- Opportunities 3 条，均覆盖 `track / function / scenario`。
- 主页、今日要点、关键信号、机会解码、商业内参、Signal 详情、Daily 详情、Opportunity 详情均出现标签。
- 浏览器检查保存到 `agent-workflow/reports/v2-tag-system-check-2026-05-08/browser-check.json`，桌面 / 移动 16 项全部通过，无横向溢出。
- `v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-174906.md`。
- `syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-174906.md`。
- 本轮未上传 Netlify。

## 2026-05-08 V2 Legacy Candidates 精修任务已升级为网站可用交付

用户要求：
- V1 版网站 2026-05-05 之前沉淀的商业机会雷达、Point、30-50 监测等判断资产有价值。
- 这些内容应按 V2 规则和算法改造后进入 V2 网站内容库。
- 精修任务完成后，新网站必须直接可用，而不是只产出待接入文档。

已创建 / 更新：
- 派发单：`agent-workflow/execution/WSD-20260508-03-v2-legacy-candidates-refinement-autopilot.md`
- 看板编号：`V2-LEGACY-REFINE-AUTO`
- 状态：`ready / site-ready-required`

任务硬要求：
- 精修 legacy candidates，输出 `publish-ready / hold / reject`。
- 输出 refined 内容到 `01-SiteV2/content/*/refined/`。
- 输出发布索引 `01-SiteV2/content/00-inbox/legacy-import/legacy-publish-ready-index-2026-05-08.md`。
- 更新或扩展 `01-SiteV2/site/scripts/sync-v2-site-data.mjs`，让 publish-ready 内容进入站点数据。
- 重新生成 `01-SiteV2/site/data/site-content.json` 与 `site-content.js`。
- 完成本地 V2 网站 HTTP 检查、桌面截图和移动截图。
- 不处理 `09-ai-news-radar/`，不恢复旧 `04-Site`，不做 Netlify deploy。

## 2026-05-08 V2 判断资产关系网已覆盖全页面

用户指出：
- Signals、Point、Trends、Opportunities 是互相交融的关系。
- 只要有相关联系，就要在对应页面体现出来，并检查所有页面。

已完成：
- `01-SiteV2/site/scripts/sync-v2-site-data.mjs` 已解析并输出 `relations`，覆盖 Signal / Point / Trend / Opportunity。
- `01-SiteV2/site/assets/app.js` 已新增关系资产索引、互链匹配和关系面板。
- 主页、今日要点、关键信号、机会解码、商业内参均新增关系网展示。
- Signal 详情、Daily 详情、Opportunity 详情均新增关联判断网。
- `index.html / daily.html / signals.html / opportunities.html / brief.html` 已补对应页面容器。
- `styles.css` 已补关系卡片、关系分组和移动端布局。

验证：
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07` 通过。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`、`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/data/site-content.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-173622.md`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-173622.md`。
- 公开页面 / app / generated data 内部词扫描通过。
- 浏览器检查保存到 `agent-workflow/reports/v2-relation-network-check-2026-05-08/browser-check.json`，桌面 / 移动共 16 项全部通过，无横向溢出。
- 本轮未上传 Netlify。

## 2026-05-08 V2 二次搜索与长文深度门槛已并入自动化和闸门

用户指出：
- 每日 Signals 应做联网二次搜索和深度解读。
- 机会解析 / Deep Dive 应做联网二次搜索长篇论证，并满足字数要求。
- 这些要求必须进入自动化任务。

已修正：
- Codex app automation `v2-content-site-daily-update` 已更新 prompt。
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md` 已补充联网二搜和深度写作硬要求。
- `agent-workflow/tools/v2-content-gate.mjs` 已新增可执行深度闸门：
  - 每条 Front Signal 至少 1200 可见字符。
  - 每条 Front Signal 必须有 `二次搜索补强`，且至少 3 个二搜来源 bullet。
  - 每条 Front Signal 必须有 `反证与边界` 和 `后续观察`。
  - Opportunity Deep Dive 如生成，至少 3000 可见字符，且必须有证据链、反向证据和 5 类交叉验证。
- `agent-workflow/v2/quality-gates/v2-content-quality-gate.md` 已同步更新。
- `2026-05-07-front-signals.md` 已补齐为 3 条短深度 Signal：2108 / 2007 / 1975 字。
- `2026-05-07-opportunity-deep-dive.md` 已补齐为 4690 字深挖内参。
- V2 site data generator 已更新，机会长文详情可解析 `###` 小节并展示完整长文章节。

验证：
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-171541.md`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-171551.md`。
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07` 通过。
- 公开页面 / app / generated data 内部词扫描通过。
- 本轮未上传 Netlify。

补充修正：
- Point Calibration 已纳入同一自动化和闸门要求。
- 每条 Point 必须保留 `原始观点 / 观澜解读 / 关联`：
  - `conversion_reason` 作为原始观点摘要或原始观点提炼。
  - `Point:` 作为观澜解读。
  - `relation_fields` 作为 Signal / Trend / Opportunity / Risk / Point 关联。
- `sync-v2-site-data.mjs` 已解析 Point 的 `originalView / interpretation / relations / relatedSignals / relatedTrends / relatedOpportunities`。
- `brief.html` 商业内参已用三段式展示 Point。
- `daily.html` 每日要点页也已展示当天 Point 三段式内容，覆盖 `原始观点 / 观澜解读 / 关联`。
- `v2-content-gate.mjs` 已检查 Point 来源、原始观点、观澜解读、V2 用法和关联关系。

## 2026-05-08 VI 源图还原与正式 Logo 系统校准完成

执行任务：
- `WSD-20260508-04-vi-source-image-logo-system`
- closeout：`agent-workflow/reports/WSD-20260508-04-vi-source-image-logo-system-closeout.md`
- 状态：`completed / vi-source-image-aligned`

完成：
- 以用户提供的 VI 源图作为正式基准，校准 `docs/brand/wavesight-ai-vi/` 品牌资产。
- `tools/generate-logo-system-svg.mjs` 已收敛为一条香槟金地平线 + 三道主澜线 + 一条低对比细辅助水纹的正式 Logo 结构。
- 已重新生成横版、竖版、图形、单色、深色背景、App icon 和底部标语线等 11 个 SVG。
- 已同步 `01-SiteV2/site/assets/brand/` 站点引用副本，包括 Logo SVG、`brand-tokens.css`、`motion-tokens.css` 和 `README.md`。
- 已更新 `visual-identity-guidelines.md` 与 `USAGE.md`，明确 Logo 结构、色彩、字体、辅助图形、图标风格、应用说明和禁用规则。
- 用户反馈上一版与近景源图差距仍大后，已二次校准为填充轮廓澜线，并将中文字标字体栈前置 `STSong / SimSun`，减少等宽线条和普通网页字体造成的简化感。
- 按用户补充的高还原需求，已新增 `logo-wavesight-reference-horizontal.svg`、`logo-wavesight-reference-horizontal-reverse.svg`、`logo-wavesight-reference-symbol.svg` 和 `logo-reference-guidelines.md`，并同步到 `01-SiteV2/site/assets/brand/`。
- 用户反馈横版中图形过大、字体过小后，已将横版 symbol 缩小到 `0.82`，中文字标放大到 `116`，英文字标放大到 `36`，并左移字标恢复图文比例。

验证：
- `node docs/brand/wavesight-ai-vi/tools/generate-logo-system-svg.mjs` 通过。
- `node --check docs/brand/wavesight-ai-vi/tools/generate-logo-system-svg.mjs` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，最新报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-172456.md`。

未执行：
- 未运行浏览器截图验收，本轮未改页面布局。
- 未运行内容、关系、会员权限或 Netlify 检查，本轮不改变 V2 内容模型、身份状态、自动化或部署。

## 2026-05-08 V2-CONTENT-INDEX-AUTO 补齐多日期、观点、趋势和长文索引

执行任务：
- `V2-CONTENT-INDEX-AUTO / WSD-20260508-03-v2-content-index-assets-autopilot`
- closeout：`agent-workflow/reports/WSD-20260508-03-v2-content-index-assets-autopilot-closeout.md`
- 状态建议：`completed / local-index-ready / netlify-paused`

完成：
- `sync-v2-site-data.mjs` 已从单日生成扩展为多日期内容索引。
- 生成数据新增 `contentIndex.dates/signals/points/trends/opportunities`。
- 已覆盖 `2026-05-07 / 2026-05-06 / 2026-05-05` 三个日期。
- 站点前台已补齐：
  - 今日要点：时间索引。
  - 关键信号：历史信号。
  - 机会解码：历史长文索引。
  - 商业内参：观点校准与趋势背景。
- 机会详情页支持通过 slug 打开 2026-05-06 与 2026-05-05 历史长文。
- 用户要求暂不上传 Netlify，本任务未做任何 Netlify 上传。

验证：
- 数据生成、脚本语法、前端 app 语法和 `site-content.js` 语法通过。
- 公开页面 / app / generated data 内部词扫描通过。
- `v2content --date=2026-05-07` 通过。
- `syntax` 通过。
- 浏览器桌面 / 移动 12 项检查通过，截图和 `browser-check.json` 保存到 `agent-workflow/reports/v2-content-index-autopilot-2026-05-08/`。

## 2026-05-08 V2-DATA-PREVIEW-AUTO 本地预览完成，Netlify 后续上传暂停

执行任务：
- `V2-DATA-PREVIEW-AUTO / WSD-20260508-01-v2-site-data-member-preview-autopilot`
- closeout：`agent-workflow/reports/WSD-20260508-01-v2-site-data-member-preview-autopilot-closeout.md`
- 状态建议：`completed / local-preview-ready / netlify-paused-after-user-instruction`

完成：
- 新增 `01-SiteV2/site/scripts/sync-v2-site-data.mjs`。
- 已从 `01-SiteV2/content/` 2026-05-07 内容生成：
  - `01-SiteV2/site/data/site-content.json`
  - `01-SiteV2/site/data/site-content.js`
- `01-SiteV2/site/assets/app.js` 已优先读取 generated data，保留 sample fallback。
- Home、今日要点、关键信号、机会解码、商业内参和三个详情母版已接入生成数据。
- 商业内参已实现 `public / logged-in / member` 三种展示边界。
- 本地截图和浏览器检查保存到 `agent-workflow/reports/v2-data-preview-autopilot-2026-05-08/`。

验证：
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07` 通过。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs` 通过。
- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node --check 01-SiteV2/site/dev-server.mjs` 通过。
- `node --check 01-SiteV2/site/data/site-content.js` 通过。
- 本地 HTTP 抽查核心页面和 `site-content` 数据文件均 200。
- Playwright 使用本机 Chrome 完成桌面 / 移动 18 项截图检查，全部读取 `window.WaveSightContent`，无横向溢出。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-163828.md`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-163828.md`。

Netlify 状态：
- `netlify.toml` 已为 V2 站点目录：`publish = "01-SiteV2/site"`。
- 按派发单曾尝试 Netlify Preview：项目根目录上传失败，发布目录上传成功，Deploy ID `69fcc0a7b0abf8160747727f`，状态 `ready`。
- 用户随后明确要求“暂时不上传到netlify”，因此从该指令后不再继续任何 Netlify 上传、复传或远端发布检查。
- 未切正式域名，未接入真实身份或支付。

后续：
- 可继续做本地 V2 generated-data 页面验收。
- Netlify 远端发布、回滚或再上传，等待用户重新确认后另行处理。

## 2026-05-08 V2 每日内容与网站更新自动化

用户要求：
- 设置 V2 内容自动抓取和更新到网站的任务。
- 确认任务已启动，每天可以自动执行。
- 时间改为每天早上 09:00。

已完成：
- 创建 Codex app automation：`v2-content-site-daily-update`。
- 状态：`ACTIVE`。
- 执行时间：每天早上 09:00。
- 工作目录：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight`。
- 任务文档：`agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`。

执行范围：
- 2026-05-10 已更新为新版宽采集漏斗。
- 每日抓取 Raw 80-150；低信号或关键接口失败日可降级 50-80 并说明原因。
- 初筛 Pool 20-30。
- 结构化 Signal 8-15。
- 前台关键信号 3-5。
- 机会解码 / deep dive 1-2，证据不足时不得硬凑。
- Trend Updates 3-5。
- AI HOT / follow-builders 等 M 级线索通道必须解析原始 URL 后按 S/A/B/C/D 分级。
- 生成 Point Calibration、Trend Context、Insight、HeatEvidence / DB 更新。
- 写入 `01-SiteV2/content/`。
- 运行 `v2content` 和 `syntax`。
- 若 V2 site data generator 已存在，则更新 `01-SiteV2/site/data/`；否则写清阻塞。

硬边界：
- 不恢复旧 `04-Site`。
- 不写入 V1 内容目录。
- 不处理 `09-ai-news-radar`。
- 不做 Netlify production deploy。
- 不切正式域名。

## 2026-05-08 新增 V2-DATA-PREVIEW-AUTO 数据生成 / 会员状态 / 预览部署自动包

当前前置条件：
- `V2-SITE-AUTO` 已验收，`01-SiteV2/site/` V2 静态站点骨架和核心页面已完成。
- `V2-13AUTO` 已验收，`01-SiteV2/content/` 已有 2026-05-06 与 2026-05-07 V2 内容链路。

调度处理：
- 新增 `V2-DATA-PREVIEW-AUTO / WSD-20260508-01-v2-site-data-member-preview-autopilot`，状态 `ready`。
- 合并范围：V2 site data generator、member-state rendering、preview deployment readiness、Netlify preview deploy。

执行口径：
- 从 `01-SiteV2/content/` 生成 `01-SiteV2/site/` 可消费的数据对象。
- 将核心页面从 sample-only 推进到 generated-data driven。
- 实现商业内参 public / logged-in / member 三种展示边界。
- 做 Netlify Preview 准备并尝试发布 preview。
- 不做 production deploy，不切正式域名。
- 不恢复旧 `04-Site`，不处理 `09-ai-news-radar/`。
- 如果 Netlify CLI / 认证不可用，必须写清阻塞原因，不伪造 preview URL。

## 2026-05-08 V2-SITE-AUTO 新站页面骨架验收

调度中枢收到并验收：
- `V2-SITE-AUTO / WSD-20260507-19-v2-site-foundation-page-autopilot`
- closeout：`agent-workflow/reports/WSD-20260507-19-v2-site-foundation-page-autopilot-closeout.md`
- 状态：`accepted / site-foundation-ready`

完成范围：
- `01-SiteV2/site/` 已建立可运行 V2 静态站点骨架。
- 已实现 Home、今日要点、关键信号、机会解码、商业内参。
- 已实现今日要点详情母版、Signal 详情母版、机会解码详情母版。
- 已接入项目 VI 资产：`docs/brand/wavesight-ai-vi/` 与 `01-SiteV2/site/assets/brand/`。
- 已完成页面密度与栏目标题节奏修正。
- 顶部导航只保留 `今日要点 / 关键信号 / 机会解码 / 商业内参`。
- The Point 仅作为 `观点校准` 模块，Trends 仅作为 `趋势背景` / 热力输入模块。

页面类硬闸门：
- UI/UE 规范表已覆盖。
- Copy 规范表已覆盖。
- Dev 按表实现已覆盖。
- QA 桌面和移动截图已保存到 `agent-workflow/reports/v2-site-autopilot-2026-05-07/`。
- Design Director 评分 87/100，超过页面母版 / 首页通过线。

Quality Gates：
- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node --check 01-SiteV2/site/data/sample-content.js` 通过。
- `node --check 01-SiteV2/site/dev-server.mjs` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，调度中枢复跑报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-162123.md`。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07` 通过，调度中枢复跑报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-162123.md`。

未执行：
- 未部署 Netlify。
- 未接入正式生产同步。
- 未实现真实登录 / 会员 / Admin 身份矩阵。
- 未处理 `09-ai-news-radar/`。

建议下一步：
- V2 site data generator：从 `01-SiteV2/content/` 生成正式站点数据对象。
- Member state rendering：商业内参预览 / 登录 / 会员全文状态。
- Deployment preview：Netlify 预览部署、备份、回滚和发布检查。

## 2026-05-07 新增 V2-SITE-AUTO 新站页面开发自动包

当前前置条件：
- `V2-4B + V2-8AUTO` 已验收，四导航、页面母版、Data schema、Copy 和 QA 交接规范已齐。
- `V2-13AUTO` 已验收为 `accepted / v2-content-20260507-imported`，V2 生产路径、内容闸门、legacy candidates、2026-05-07 今日监测和 follow-builders Point 入库已齐。

调度处理：
- 新增 `V2-SITE-AUTO / WSD-20260507-19-v2-site-foundation-page-autopilot`，状态 `ready`。
- 合并范围：`V2-9 tokens / primitives / brand assets`、`V2-10 Home prototype`、`V2-11 core column pages`。

执行口径：
- 在 `01-SiteV2/site/` 建立 V2 新站工程骨架。
- 实现 Home / 今日要点 / 关键信号 / 机会解码 / 商业内参 / 详情页母版。
- 使用 `01-SiteV2/content/` 已通过 v2content 的样本数据。
- 不恢复旧 `04-Site`，不部署 Netlify，不处理 `09-ai-news-radar/`。
- 必须完成页面类硬闸门：UI/UE 规范表、Copy 规范表、Dev 按表实现、QA 桌面和移动截图验收。

## 2026-05-07 V2-13AUTO 合并执行验收

用户要求：`V2-13 + V2-DOC 合并执行`，并补充将 V1.0 已沉淀内容与近期监测产物迁移并入当前执行范围，不二次开新任务、不另写独立派发单。

本轮按当前合并包继续执行：
- `V2-13AUTO / WSD-20260507-18-v2-production-content-migration-autopilot`
- 合并来源：`V2-13`、`V2-DOC`、历史判断资产迁移。

已完成：
- 新增 `agent-workflow/v2/v2-production-pipeline-cutover.md`，锁定 V2 生产路径为 `01-SiteV2/content/` 和 `01-SiteV2/site/`。
- 新增 `agent-workflow/tools/v2-content-gate.mjs`，并接入 `run-quality-gates.mjs v2content`。
- 补齐 `agent-workflow/v2/schemas/README.md` 和 `agent-workflow/v2/rules/README.md`。
- 更新 `agent-workflow/v2/migration/content-paths-v2-draft.md`，把旧 `06-content/v2` / `04-Site` 口径改为 `01-SiteV2` 口径。
- 建立 `01-SiteV2/content/00-inbox/legacy-import/`，作为历史判断资产重加工入口。
- 已直接加工 V1 Signals / Scoring / Trends / Point / Opportunities 为 V2 legacy candidate 文件，写入 `01-SiteV2/content/` 对应 legacy 目录。
- 输出 inventory：`agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md`。
- 输出 migration map：`agent-workflow/reports/WSD-20260507-18-v2-content-migration-map.md`。
- `01-SiteV2/content/v2/README.md` 已标记为早期骨架参考，避免成为第二个生产内容根。

追加验收结果：
- `V2-13AUTO` 状态更新为 `accepted / v2-content-20260507-imported`。
- 2026-05-06 V2 内容链路通过闸门：Raw 30、Raw originals 30、Pool 12、Structured 8、Front Signals 3。
- 2026-05-07 今日监测入库完成：Raw 30、Raw originals 30、Pool 12、Structured 8、Front Signals 3。
- 2026-05-07 follow-builders Point Calibration 已入库。
- V1 历史资产已完成盘点、迁移映射和 legacy candidate 加工；正式发布前仍需逐条精修来源、反证、证据权重和关系校验。

Quality Gates：
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-06` 通过，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-06-20260507-115050.md`。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07` 通过，调度中枢复跑报告 `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-124859.md`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，调度中枢复跑报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-124859.md`。

未执行：
- 未恢复旧 `04-Site`。
- 未部署 Netlify。
- 未做 V2 页面 Dev。
- 未处理 `09-ai-news-radar/`。
- 未把 V1 文档原样复制为 V2 正式内容。

## 2026-05-07 V2-4B + V2-8AUTO 合并执行验收

用户要求：`V2-4B + V2-8AUTO 合并执行`。

已完成：
- `V2-4B / WSD-20260507-12-v2-navigation-column-finalization` 已验收为 `accepted / merged-with-v2-8auto`。
- `V2-8AUTO / WSD-20260507-14-v2-product-to-design-data-copy-autopilot` 已验收为 `accepted / specs-ready`。
- V2 普通前台导航锁定为 `今日要点 / 关键信号 / 机会解码 / 商业内参`。
- `The Point` 降级为 `观点校准`，作为今日要点、关键信号、机会解码、商业内参中的嵌入模块和 Admin 素材资产。
- `Trends` 降级为 `趋势背景` 和 `商业热力输入`，不作为 V2 普通一级导航。
- 已输出 V2 页面母版、最小数据 schema、Copy / Editorial System 和 QA / Dev 交接规范。

新增产物：
- `agent-workflow/v2/v2-navigation-column-finalization.md`
- `agent-workflow/v2/v2-page-master-spec.md`
- `agent-workflow/v2/v2-data-schema-minimum.md`
- `agent-workflow/v2/v2-copy-editorial-system.md`
- `agent-workflow/reports/WSD-20260507-12-v2-navigation-column-finalization-closeout.md`
- `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-closeout.md`
- `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-stage-A.md`
- `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-stage-B.md`
- `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-stage-C.md`

Quality Gates：
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-114727.md`。
- 说明：V1 旧站已归档，syntax 模式跳过不存在的旧 `04-Site` 探针；本轮未做截图、权限或生产同步检查，因为没有实现页面代码、权限逻辑或生产数据切换。

后续建议：
- `V2-9` 可承接 tokens / primitives / brand assets 工程底座。
- `V2-10` 可承接首页 V2 原型。
- `V2-11` 可承接今日要点 / 关键信号 / 机会解码页面升级。
- `V2-13AUTO` 仍负责 V2 生产线、文档索引和历史判断资产迁移，包含真实内容路径、validator、备份和回滚。

## 2026-05-07 新增 V2-13AUTO 历史判断资产迁移自动包

用户补充要求：
- V1.0 网站已经沉淀下来的文档、自动化任务跑出的商业机会 / The Point，以及前几天 30-50 条监测链路都有价值。
- 这些资产不应丢弃，应按 V2.0 规则和算法改造后，放入 V2 网站内容库。

调度处理：
- 新增 `V2-13AUTO / WSD-20260507-18-v2-production-content-migration-autopilot`，状态 `ready`。
- 合并 `V2-13 + V2-DOC + 历史判断资产迁移`。
- 原 `V2-13` 和 `V2-DOC` 标记为 `merged / superseded-by-V2-13AUTO`，不再单独派发。

执行口径：
- 不是把旧文档原样搬进 V2。
- 先做历史资产 inventory，再按 V2 六维分析、HeatEvidence、Trend Context、Point Calibration、Opportunity 关系重加工。
- 可迁移内容进入 `01-SiteV2/content/`，必须保留稳定 ID、来源路径、原始日期、转换日期、转换理由、关系字段和证据缺口。
- `09-ai-news-radar/` 暂不处理。
- 不做 V2 页面 Dev，不部署 Netlify。

## 2026-05-07 V2 根目录命名与入口整理

用户最新口径：
- 归档目录命名为 `10-Archive/`。
- V2 根目录命名为 `01-SiteV2/`。
- `09-ai-news-radar/` 暂不处理。

已完成：
- `v2.0/` 已物理重命名为 `01-SiteV2/`。
- 旧根目录 `_README.md` 已移入 `10-Archive/legacy/_README.md`，不再作为 V2 接手入口。
- `01-SiteV2/content/` 保留为 V2 内容生产线目录，避免 raw / pool / structured / database 文件平铺到 V2 根目录。
- 已同步 `docs/README.md`、`docs/agent-handoff.md`、`01-SiteV2/README.md`、`01-SiteV2/site/README.md`、`01-SiteV2/content/README.md`。

当前入口关系：
- `AGENTS.md`：V2 仍相关，项目级规则和新窗口接手入口。
- `docs/`：V2 仍相关，handoff 与文档索引入口。
- `agent-workflow/`：V2 仍相关，调度、派发、验收、质量门禁、长期 agent 和历史账本入口。
- `_README.md`：V1 旧数据源说明，已归档，不再作为 V2 入口。

## 2026-05-07 V1.0 内容归档与 V2.0 根目录建立

用户要求：
- 在 `01-WaveSight` 下建立归档目录。
- 把 V1.0 内容合并为一个文件，放到归档目录。
- 初始新建 `v2.0` 目录，后续按用户最新口径重命名为 `01-SiteV2/`。

已完成：
- 已生成 V1.0 内容合并归档：`10-Archive/v1.0/v1.0-content-archive.md`。
- 归档合并范围：`01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/`。
- 合并结果：61 个 Markdown 文件，9057 行。
- 已新增 V1 归档说明和 V2 根目录说明。
- 已新增计划文件：`agent-workflow/execution/PLAN-v1-archive-v2-directory-2026-05-07.md`。
- 已新增 closeout：`agent-workflow/reports/WSD-20260507-17-v1-archive-v2-root-closeout.md`。
- 已更新 `docs/README.md` 和 `agent-workflow/v2/v2-documentation-directory-architecture.md`。

安全边界：
- `AGENTS.md`、`docs/`、`agent-workflow/`、`09-ai-news-radar/` 暂不整体迁移。
- 原因是这些路径已被 handoff、progress、dispatch-board、closeout、质量闸门和网站脚本引用。
- 后续新增 V2 文件默认进入 `01-SiteV2/`。

补充处理：
- 用户确认 V2 网站改造范围过大，不再基于旧 `04-Site` 继续更新。
- 已将根目录 `04-Site/` 物理迁移到 `10-Archive/v1.0/site/04-Site/`。
- 已新增 `01-SiteV2/site/README.md`，作为 V2 新网站工程入口。
- 后续 V2 网站开发默认从 `01-SiteV2/site/` 开始。

## 2026-05-07 V2-only 生产开发口径确认

用户明确：
- V1.0 网站不再更新。
- 老的自动化任务停止。
- 后续不再判断动作是否影响旧 V1 链路或旧自动化。
- 项目专注开发 V2.0 版。

已暂停旧自动化：
- `ai-the-point`
- `ai-2`
- `ai-3`

调度处理：
- `AGENTS.md` 第 8 节已改为 V2-only 生产开发口径。
- `automation-fallback-policy.md` 已标记旧自动化规则为历史参考。
- `V2-7` 七日隔离验证标记为 `skipped / user-waived`。
- `V2-13` 改为 V2 生产线切换任务，不再以 V1 影响判断作为阻塞。

保留硬闸门：
- 页面类任务仍需 Design Director、Copy、Dev、QA 截图验收。
- 产品功能类任务仍需 PM 门禁、WAVE 和模块决策表。
- V2 生产线改造仍需质量检查、备份和回滚。

## 2026-05-07 每日搜索入库确认与文档目录优化

确认结果：
- 每日搜索入库任务仍在。
- 旧 `ai-2` 已暂停，不再执行该任务。
- 新执行位置为 `V2-13 / WSD-20260507-15-v2-production-pipeline-cutover`，作为 V2 生产线重建的一部分。
- 2026-05-10 已由 `V2-DAILY-AUTO` 升级为 Raw 80-150、Pool 20-30、Structured 8-15、Front Signals 3-5、Deep Opportunity 1-2、Trend Updates 3-5、Point Calibration、HeatEvidence。

文档目录优化：
- 已新增 `docs/README.md`，作为 V2-only 文档入口。
- 已新增 `V2-DOC / WSD-20260507-16-v2-documentation-directory-optimization`，状态 `ready`。
- V2-DOC 只做文档入口、索引、目录分工和安全整理方案，不移动或删除既有文件。

## 2026-05-07 V2-4 产品架构 PRD 验收

调度中枢收到并验收 `V2-4 / WSD-20260507-05-v2-product-architecture-prd`，状态更新为 `accepted / architecture`。

收口文件：
- `agent-workflow/reports/WSD-20260507-05-v2-product-architecture-prd-closeout.md`

主产物：
- `agent-workflow/v2/v2-product-architecture-prd.md`

验收结论：
- PM 新增功能门禁通过。
- WAVE 评分完成：频道收敛总架构 10 分通过；The Point 独立频道 5 分不通过；Trends 独立频道 5 分不通过；机会解码 + Trends 合并为机会分析 10 分通过；商业内参 + 热力图沿用 V2-4A 10 分通过。
- 模块决策表完成。
- 首页重构、Home / Daily Brief / Signals / The Point / Opportunities / Trends 去留评估、栏目模块升级、商业热力度、栏目页 / 详情页模块、用户状态矩阵已覆盖。

关键产品方向：
- V2 普通前台导航建议收敛为 `今日要点 / 关键信号 / 机会解码 / 商业内参`。
- `The Point` 降级为观点校准模块。
- `Trends` 合并为趋势背景、商业内参热力输入和 Admin 趋势资产。
- `Opportunities` 前台改名为 `机会解码`，低频发布深度机会分析报告。
- 商业热力图不做公开普通榜单，只作为商业内参核心模块和后台判断资产。

硬边界：
- 本次只验收产品架构，不进入 Dev。
- 未修改 `04-Site`、生产内容源、同步脚本、长期自动化或 Netlify。
- 后续页面与产品开发必须先过 UI/UE Design Director、Copy、Data schema 和 QA 规划。

Quality Gates：
- 执行窗口 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-102133.md`。

## 2026-05-07 V2-5A baseline Batch 1 / Batch 3 提交完成

用户确认执行：排除默认项，提交 Batch 1，归档 Batch 3。

完成结果：
- Batch 1 已提交：`e75d90b docs: record accepted v2 planning baseline`
- Batch 3 已归档提交：`a46226d chore: archive v2 monitoring test pipeline`
- 已创建 tag：`v1.0-baseline-20260507`，指向 `e75d90b`

范围说明：
- Batch 1 纳入 accepted V2 planning、governance、V2 isolation skeleton、V2 closeout / stage summary 与 2026-05-07 syntax gate 报告。
- Batch 3 纳入 P0-12 / daily monitoring v2 test-only pipeline 历史归档。
- 默认排除项仍未提交：`09-ai-news-radar/`、P0-11、P0-2A、P0-2B、P1-4B、未确认临时审计目录、未验收页面实现。
- Batch 2 未提交：2026-05-05 / 2026-05-06 生产内容、生成网站数据与同步报告仍需 Data / Workflow 另行确认。

未执行：
- 未创建 `codex/v2-planning` branch。
- 未创建外部 V2 worktree。
- 未执行生产自动化切换、V2 网站同步、Netlify 发布或生产路径迁移。

Quality Gates：
- Batch 1 提交前 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-102625.md`。
- Batch 3 归档前 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-102813.md`。

## 2026-05-07 V2-PREFLIGHT 预备治理验收

调度中枢收到并验收 `V2-PREFLIGHT / WSD-20260507-11-v2-preflight-governance-autopilot`，状态更新为 `accepted / preflight-complete`。

收口文件：
- `agent-workflow/reports/WSD-20260507-11-v2-preflight-governance-autopilot-closeout.md`

主产物：
- `agent-workflow/reports/WSD-20260507-11-v2-baseline-decision-package.md`
- `agent-workflow/reports/WSD-20260507-11-v2-schema-quality-review.md`

验收结论：
- baseline 决策包已完成，但 Git baseline 仍需用户确认。
- schema / rules / quality gates 复核已完成。
- 可以启动 `V2-7`，但只能是 limited isolation validation。
- 不得生产 cutover，不得 V2 网站同步，不得 V2 前端 Dev，不得改生产 `ai-2` / `ai-3`。

当前 Git baseline 决策：
- Batch 1：accepted V2 planning + governance + V2 isolation skeleton，建议纳入。
- Batch 2：2026-05-05 / 2026-05-06 生产内容和生成数据，需 Data / Workflow 另行确认。
- Batch 3：P0-12 test-only pipeline，需用户确认是否作为 test-only 历史归档。
- 默认排除：`09-ai-news-radar/`、P0-11、P0-2A、P0-2B、P1-4B、未确认临时审计目录、未验收页面实现。

V2-7 限制：
- 只使用 `06-content/v2/`。
- 不写入 V1 内容目录。
- 每日手工关系表。
- 第 7 天 weekly AI Brief sample。
- 不修改生产自动化、同步脚本、`content-paths.json`、Netlify。

Quality Gates：
- 执行窗口运行 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-101733.md`，6 项通过，失败 0。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-102056.md`，6 项通过，失败 0。

## 2026-05-07 调度原则升级：连贯 / 自动化优先

用户要求后续创建派发任务时，秉持“一个能连贯或者自动化执行的优先原则”。

已更新：
- `agent-workflow/governance/window-dispatch-hub.md`
- `docs/agent-handoff.md`

新调度口径：
- 默认优先把同一链路任务合并为可连续执行的 `AUTO` / `autopilot` 包。
- 阶段内写 stage summary，最终一次 closeout。
- 遇到产品决策、PM/WAVE、Design Director、生产自动化、同步脚本、Git、部署、权限、生产数据切换等硬闸门时，必须拆分或停止。
- 自动化优先不降低质量闸门。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-101131.md`，6 项通过，失败 0。

## 2026-05-07 新增 V2-PREFLIGHT 预备治理自动包

调度中枢新增：

- `V2-PREFLIGHT / WSD-20260507-11-v2-preflight-governance-autopilot`
- 状态：`ready`
- 派发单：`agent-workflow/execution/WSD-20260507-11-v2-preflight-governance-autopilot.md`
- 默认收口：`agent-workflow/reports/WSD-20260507-11-v2-preflight-governance-autopilot-closeout.md`

任务目标：
- 合并 V2-5A baseline 决策包与 V2-6F schema / quality gate 复核。
- 输出 baseline 纳入 / 暂缓 / 排除清单和后续 Git 命令草案。
- 复核 V2 schemas、rules、quality gates、Source Registry、HeatEvidence、AI Brief 规范。
- 判断是否足以进入 `V2-7` 7 日隔离验证。

硬边界：
- 不执行 Git commit / tag / branch / worktree。
- 不修改生产自动化、同步脚本、`content-paths.json`、Netlify 配置。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-100843.md`，6 项通过，失败 0。

## 2026-05-07 V2-6AUTO 隔离骨架验收

调度中枢收到并验收 `V2-6AUTO / WSD-20260507-10-v2-directory-migration-autopilot`，状态更新为 `accepted / isolation-skeleton`。

收口文件：
- `agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md`

阶段摘要：
- `agent-workflow/reports/WSD-20260507-10-stage-6A-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6B-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6C-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6D-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6E-summary.md`

完成范围：
- 已创建 `06-content/v2/` 目录骨架和 README。
- 已创建 V2 schemas、rules、quality gates。
- 已创建 ai-2 V2 入站隔离方案和提示词草案。
- 已创建 ai-3 / sync / relation check 隔离方案、`content-paths` 草案和 rollback plan。
- 已创建 V1 legacy index。

范围合规：
- 未修改 `04-Site/config/content-paths.json`。
- 未修改 `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`。
- 未修改 `unified-site-sync.mjs`。
- 未修改生产 `ai-the-point`、`ai-2`、`ai-3` 自动化任务。
- 未修改 Netlify 配置。
- 未移动、删除、重命名或编辑 V1 内容目录。

Quality Gates：
- 执行窗口运行 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-095517.md`，6 项通过，失败 0。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-100158.md`，6 项通过，失败 0。

后续建议：
- `V2-6F`：Data / QA 复核 V2 schemas 与 quality gates。
- `V2-7`：使用 `06-content/v2/` 做隔离 7 日内容验证。
- `V2-13`：生产自动化和同步切换，必须在用户明确恢复网站更新 / V2 生产链路后单独派发。
- `V2-5A`：继续解决 baseline 提交范围确认。

## 2026-05-07 新增 V2-6AUTO 单窗口顺序执行包

为减少 `V2-6A` 到 `V2-6E` 的多轮派发和收口，调度中枢新增自动顺序执行包：

- `V2-6AUTO / WSD-20260507-10-v2-directory-migration-autopilot`
- 状态：`ready`
- 派发单：`agent-workflow/execution/WSD-20260507-10-v2-directory-migration-autopilot.md`
- 默认收口：`agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md`

执行边界：
- 可自动执行 6A / 6B / 6E 的安全文件创建。
- 6C / 6D 只做隔离层方案、runbook、提示词草案、fixtures 和切换计划。
- 不修改生产自动化、同步脚本、`content-paths.json`、Netlify 配置。
- 如需要生产切换，必须停止并回调度中枢。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-094245.md`，6 项通过，失败 0。

## 2026-05-07 V2-6 目录与内容资产架构验收

调度中枢收到并验收 `V2-6 / WSD-20260507-09-v2-directory-content-architecture`，状态更新为 `accepted / architecture`。

收口文件：
- `agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md`

主产物：
- `agent-workflow/v2/v2-directory-content-architecture.md`

验收结论：
- 已明确 V1 网站内容冻结，不再作为日更入口，不再承接 V2 新内容。
- V1 内容目录保留为 `legacy / read-only / compatibility` 层。
- V2 正式内容库建议新增 `06-content/v2/`。
- 已覆盖 V2 推荐目录树、目录处置矩阵、自动化影响表、兼容期策略、分阶段迁移建议、风险、回滚和验收要求。
- 已明确 `content-paths.json`、同步脚本、统一闸门和自动化任务未来会受影响，但本轮不改。

范围合规：
- 未移动文件。
- 未删除文件。
- 未重命名目录。
- 未创建实际 `06-content/v2/` 目录骨架。
- 未修改 `04-Site/config/content-paths.json`。
- 未修改同步脚本、统一同步闸门、Netlify 配置或长期自动化任务。

Quality Gates：
- 执行窗口运行 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-092626.md`，6 项通过，失败 0。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-093313.md`，6 项通过，失败 0。

后续建议：
- 先派 `V2-6A` 创建 V2 内容目录骨架和 README。
- 再派 `V2-6B` 定义 V2 schemas / source registry / HeatEvidence 文件规范。
- `V2-6C` / `V2-6D` 会影响自动化和同步脚本，必须单独派发并过自动化影响闸门。

## 2026-05-07 新增 V2-6 目录与内容资产架构任务

用户明确：V1 版网站内容不再更新，需要基于 V2 规划优化 `01-WaveSight` 文件目录。

调度中枢已新增：
- `V2-6 / WSD-20260507-09-v2-directory-content-architecture`
- 状态：`ready`
- 派发单：`agent-workflow/execution/WSD-20260507-09-v2-directory-content-architecture.md`
- 默认收口：`agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md`

任务范围：
- 只输出 V2 目录与内容资产架构方案。
- 明确 V1 内容冻结后的 legacy / read-only / compatibility 规则。
- 规划 V2 内容库、算法证据库、热力图、AI商业内参、机会地图、Source Registry 和自动化兼容策略。
- 输出目录处置矩阵、自动化影响表、兼容期策略和后续迁移任务拆分。

范围合规：
- 未移动文件。
- 未删除文件。
- 未修改 `04-Site/`。
- 未修改 `content-paths.json`。
- 未修改同步脚本、Netlify 配置或长期自动化任务。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-091850.md`，6 项通过，失败 0。

## 2026-05-07 V2-5A baseline 分类收口

调度中枢收到 `V2-5A / WSD-20260507-08-v1-accepted-baseline-tag-branch` closeout，状态更新为 `review / user-confirmation-required`。

收口文件：
- `agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`

验收结论：
- 本轮完成 Git 状态检查和文件归属分类。
- 本轮不标记 accepted，因为尚未得到用户对提交范围的明确确认。
- 本轮未提交、未打 tag、未建 branch、未建 worktree。
- 执行窗口没有“全部提交”，符合禁止混入 failed / abandoned / stopped / review 任务结果的规则。

当前阻塞：
- 工作树仍混有 accepted、test-only、review / not accepted、abandoned / stopped、生产内容、网站数据、外部本地目录和大量质量报告。
- 必须先确认哪些文件进入 baseline，哪些只归档，哪些排除。

推荐三段提交策略：
1. accepted V2 planning 与治理文件。
2. 经确认后的 2026-05-05 / 2026-05-06 生产内容与同步数据。
3. P0-12 test-only monitoring pipeline，作为 V2 planning 记录，不替换生产 Signals。

明确排除候选：
- P0-11 未验收视觉资产和页面实现改动。
- P0-2A / P0-2B / P1-4B 成果型代码或页面实现。
- 未确认的 `09-ai-news-radar/` 外部本地目录。
- 未确认的大批临时截图 / 审计目录。

Quality Gates：
- 执行窗口运行 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-091301.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-091533.md`，6 项通过，失败 0。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-07 V1 未完成任务统一放弃

用户明确：`V1阶段的任务全部放弃`。

调度中枢已更新 `agent-workflow/execution/dispatch-board.md`：

- V1 已 accepted 的历史成果保留为历史记录，不删除、不回滚。
- V1 failed / void / stopped 任务维持原结论。
- V1 未完成、待派发、review、spec_done_dev_pending 的任务统一标记为 `abandoned / superseded-by-v2`。
- `P0-11` 不再补 SYS-7 证据，不得转 accepted；后续首页由 V2 首页重构承接。
- `P1-4A` 规范文档可作参考，但 V1 Dev / QA 落地放弃；后续栏目、详情、长文阅读规范按 V2 架构重做。

本轮放弃的 V1 未完成任务：
- `P0-4`
- `P0-5`
- `P0-6`
- `P0-11`
- `P1-1`
- `P1-2`
- `P1-3`
- `P1-4A`
- `P1-4D`
- `P1-5`

当前主线：
- `V2-4` 已在执行。
- `V2-5A` 可并行执行。

范围合规：
- 未删除文件。
- 未回滚代码。
- 未修改 `04-Site/`。
- 未修改内容源 Markdown。
- 未修改同步脚本、统一同步闸门、Netlify 配置或自动化任务。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-091200.md`，6 项通过，失败 0。

## 2026-05-07 V2-5 技术工作区与迁移方案验收

调度中枢收到并验收 `V2-5 / WSD-20260507-06-v2-dev-workspace-baseline`，状态更新为 `accepted / migration-plan`。

收口文件：
- `agent-workflow/reports/WSD-20260507-06-v2-dev-workspace-baseline-closeout.md`

主产物：
- `agent-workflow/v2/v2-dev-workspace-baseline.md`

验收结论：
- 已完成当前 Git / remote / branch / tag / worktree / Netlify publish 事实检查。
- 当前 `HEAD` 为 `925f2e9ccbd6cb2a63b5790d594f89e4efb01d9c`，与 `origin/main` 一致。
- 当前工作树存在大量 modified / untracked 文件，因此本轮未创建 `v1.0-baseline` tag、V2 branch 或外部 worktree。
- 未贸然制造不可信 Git 基线，符合“不得覆盖未归属修改”和“创建外部 worktree 前必须确认路径”的硬规则。
- 已推荐 tag：`v1.0-baseline-20260507`。
- 已推荐 branch：`codex/v2-planning`。
- 已推荐 worktree 路径：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight-v2-lab`，需用户确认后才能创建。
- 已覆盖 V2 VI 到 tokens、品牌资产目录、icon set、layout primitives 的迁移策略。
- 已覆盖部署隔离、自动化影响边界、V2 Verification Agent 验收段和回滚策略。

范围合规：
- 未修改 `04-Site/`。
- 未修改内容源 Markdown。
- 未修改同步脚本、关系检查脚本、统一同步闸门。
- 未修改自动化提示词或执行顺序。

Quality Gates：
- 执行窗口运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-084440.md`，6 项通过，失败 0。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-085359.md`，6 项通过，失败 0。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

新增后续任务：
- `V2-5A / WSD-20260507-08-v1-accepted-baseline-tag-branch`
- 状态：`ready`
- 目标：整理当前未提交文件归属，提交 accepted / V2 planning 文件，经用户确认后创建可信 V1 baseline tag、V2 branch 和可选 worktree。
- 注意：不得使用破坏性回滚，不得把 failed / abandoned / stopped / review 任务结果作为 accepted baseline。

## 2026-05-07 V2-4A AI商业内参与热力图产品门禁验收

调度中枢收到并验收 `V2-4A / WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan`，状态更新为 `accepted / product-gate`。

收口文件：
- `agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md`

主产物：
- `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`

验收结论：
- 产品功能类硬闸门通过。
- PM 新增功能门禁：通过。
- WAVE 评分：`10/12`，通过。
- 模块决策表：已完成。
- `AI商业内参`：进入 V2 增值产品层，作为会员 / 增值产品入口。
- `AI商业热力图`：作为 AI商业内参核心模块与数据资产，不做普通公开榜单。
- MVP：先做周度 AI商业热力周报、Top 高热三元组和证据来源展开。
- 月度完整版：后置到 V2-2 算法与 7 日测试稳定后推进。
- 不直接进入 Dev，后续开发必须等待 V2-4 产品架构、V2-5 技术工作区与迁移方案。

范围合规：
- 未修改 `04-Site/`。
- 未新增正式前台栏目代码。
- 未修改生产内容源 Markdown frontmatter。
- 未修改 `sync-data.mjs`、`unified-site-sync.mjs`、`check-relations.mjs`。
- 未替换 `ai-the-point`、`ai-2`、`ai-3` 自动化本体。

Quality Gates：
- 执行窗口运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-084519.md`，6 项通过，失败 0。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-084928.md`，6 项通过，失败 0。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- 未来若 HeatEvidence、HeatCards 或 AIBriefIssue 进入生产链路，必须另行派发自动化影响任务。

后续硬规则：
- `V2-4` 必须吸收本结论：AI商业内参进入 V2 增值产品层，热力图作为内参核心模块；不建议直接挤入普通公开一级栏目。
- `V2-5` 必须规划 HeatEvidence / HeatCard / AIBriefIssue 的数据落地、分支隔离、兼容、备份和回滚策略。

## 2026-05-07 V2-2 算法与内容源架构验收

调度中枢收到并验收 `V2-2 / WSD-20260507-03-v2-algorithm-source-architecture`，状态更新为 `accepted / architecture`。

收口文件：
- `agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md`

主产物：
- `agent-workflow/v2/v2-algorithm-source-architecture.md`

验收结论：
- 执行窗口遵守阶段 1 确认口径，阶段 2 只产出架构文档与 closeout。
- 未修改 `04-Site`、生产内容源 frontmatter、`sync-data.mjs`、`unified-site-sync.mjs`、`ai-the-point`、`ai-2`、`ai-3`。
- 已明确 V2-2 服务正式 V2.0 升级，不是测试项目；隔离环境只是迁移风险控制手段。
- 已覆盖来源分层、监测频率、Raw -> Pool -> Structured -> Front Signal -> Deep Dive -> Trend 漏斗。
- 已覆盖去重、合并、二次搜索、反证、可信度评分。
- 已覆盖四栏目到 `HeatEvidence` 的转换规则与 schema 草案。
- 已覆盖行业 / 岗位 / 流程 seed dictionary 与 `tag-taxonomy.md` 映射原则。
- 已覆盖行业、岗位、流程、三元组热力计算规则和 Heat Cards schema 草案。
- 已覆盖 weekly / monthly `AIBriefIssue` 输入、输出和 schema 草案，MVP 先 weekly。
- 已覆盖 7 日验证计划，第 7 天模拟 1 期 weekly AI内参样张。
- 已给出后续 Dev 文件路径建议，但未创建代码文件。
- 已给出 V2 Verification Agent 验收清单与自动化影响说明。

Quality Gates：
- 执行窗口运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-083845.md`，6 项通过，失败 0。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-084311.md`，6 项通过，失败 0。

自动化影响：
- `ai-the-point`：不影响，本轮未修改；未来 Point 可作为 HeatEvidence 校准层输入，需另行派发。
- `ai-2`：不影响，本轮未修改；未来迁入生产需单独升级提示词和字段规则。
- `ai-3`：不影响，本轮未修改；未来 HeatEvidence / AIBriefIssue 进入正式数据时需单独升级同步闸门和关系检查。

后续硬规则：
- `V2-4A` 必须读取本架构，做 AI内参 + 热力图产品门禁。
- `V2-4` 必须吸收本架构进入 V2 产品架构 PRD。
- `V2-5` 必须读取本架构，决定后续分支 / worktree / Dev 文件路径。
- 7 日隔离验证任务需另行派发，不得直接替换生产自动化。

## 2026-05-07 V2-3 VI / Design Direction 验收

调度中枢收到并验收 `V2-3 / WSD-20260507-04-v2-vi-design-direction`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260507-04-v2-vi-design-direction-closeout.md`

主产物：
- `agent-workflow/v2/v2-vi-design-direction.md`

验收结论：
- 本任务为 VI / Design Direction 文档任务，不是页面实现任务，因此浏览器截图 / SYS-7 页面截图质检不适用。
- 已正式采用 `方案 A：极简澜线型`。
- 已覆盖品牌关键词、Logo 系统、中英文呈现、色彩、字体、澜线 / 地平线图形语言、图片与插画规范、页面母版、AI商业内参与热力图视觉方向、动效与交互原则、前端 tokens、V1.0 视觉资产保留 / 淘汰 / 暂缓清单。
- 已写入品牌资产锁定规则：后续官网、页面、新增栏目、组件、符号、元素和动效必须按本规范执行；Logo、澜线、地平线、符号和动效母题不得被执行窗口随意重画或替换。
- 未修改 `04-Site/`、生产内容源、同步脚本、关系检查脚本、统一同步闸门或自动化任务配置。

Quality Gates：
- 执行窗口已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax`，最新报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-082135.md`，6 项通过，失败 0。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-083104.md`，6 项通过，失败 0。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

后续硬规则：
- `V2-4A` / `V2-4` 必须吸收本 VI，判断 AI内参 / 热力图产品位置时不得脱离本视觉口径。
- `V2-5` 必须把本 VI 转为 tokens、资产目录、Logo / icon set 和 layout primitives 策略。
- 后续任何 V2 页面 Dev、内参页、热力图页、会员页、栏目页和动效实现必须先读取本文件。

## 2026-05-07 V2.0 正式升级口径确认

用户明确：V2.0 涉及大量 VI、内容、算法等更新，是要实际执行的正式升级，不是在测试环境中完成。

调度中枢已更新口径：
- `agent-workflow/v2/v2-transition-charter.md`
- `agent-workflow/v2/v2-workspace-strategy.md`
- `agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md`

当前统一定义：
- V2.0 是正式产品升级项目，不是测试项目。
- 独立分支 / worktree 是正式升级开发区，用来保护 V1.0 基线、支持审计和回滚。
- 测试页、test-only 管线、隔离环境只用于降低迁移风险，不是最终交付定义。
- V2 产物最终应进入正式 V2 版本，除非 QA 或用户验收判定不通过。

正式升级路径：

```text
规划确认 -> 分支 / worktree 隔离开发 -> 证据化 QA -> 用户验收 -> 合并 / 部署 / 生产替换
```

硬限制：
- 用户验收前，不直接覆盖 V1.0 稳定版本。
- 任何影响生产自动化、内容源字段、同步脚本或前台导航的任务，都必须单独派发并通过对应硬闸门。

自动化影响：
- `ai-the-point`：不影响，本轮只更新 V2 治理口径。
- `ai-2`：不影响，本轮不替换自动化。
- `ai-3`：不影响。

## 2026-05-07 V2 VI 资产锁定规则

用户确认：以后官网、页面、可能新增的栏目、元素、符号和动效，都必须按已提供的 V2 VI 规范执行；已给的 Logo 和元素不得随意更改。

已写入长期规则：
- `agent-workflow/v2/v2-vi-design-direction.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/governance/agent-memory.md`

锁定资产：
- Logo 主方向：`方案 A：极简澜线型`。
- Logo 结构：一条远方地平线 + 三道流动澜线 + `观澜 AI` + `WAVESIGHT AI`。
- 图形语言：澜线、地平线、细分割线。
- 商业内参符号、信息元素、版式原则和动效规范。

后续若需调整上述品牌资产，必须先由 PM / UI / Verification 评审，并判断是否需要用户确认。执行窗口不得自行更改 Logo、澜线数量、地平线、符号系统或动效母题。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-07 V2-2 两阶段派发

用户要求 `V2-2 / WSD-20260507-03-v2-algorithm-source-architecture` 分两步执行：

1. 先到新窗口描述任务详情和执行方案要点，不正式执行。
2. 等用户确认后再执行正式规划产出。

调度中枢已更新：
- `agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md` 新增两阶段执行规则。
- `dispatch-board.md` 将 `V2-2` 状态更新为 `dispatched / stage1-plan`。

阶段 1 期望产物：
- 任务目标复述。
- 输入材料梳理。
- 计划产出的文档结构。
- 算法 / 来源 / HeatEvidence / 热力图 / AIBriefIssue 的拆解思路。
- 需要用户确认的问题。
- 风险与非目标。
- UTF-8 阶段总结：`agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-stage1-plan.md`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响，阶段 1 不改生产自动化。
- `ai-3`：不影响。

## 2026-05-07 V2-1 新长期 Agent 体系分配

用户要求阅读 `Building multi-agent systems: When and how to use them`，并据此为观澜AI V2.0 开发分配新的长期 Agent。调度中枢已完成 `V2-1 / WSD-20260507-02-v2-agent-system-design`，状态更新为 `accepted`。

参考原则：
- 多 Agent 只在上下文保护、可并行探索、专业化工具 / 领域成立时才值得拆分。
- 拆分不按“规划 / 实现 / 测试”这种阶段硬切，而按真正独立的上下文边界切。
- 多 Agent 会增加协调成本，所以 V2 只新增必要的长期岗位。
- Verification Agent 作为独立黑盒验收角色保留。

新增 V2 长期 Agent：
- `V2 Strategy & Product Architecture Agent`
- `V2 Source Intelligence Agent`
- `V2 Signal Evidence Agent`
- `V2 Point / Builder Insight Agent`
- `V2 Heatmap Algorithm Agent`
- `V2 AI Brief Editorial Agent`
- `V2 VI / Design System Agent`
- `V2 Platform / Dev Migration Agent`
- `V2 Verification Agent`

核心文件：
- `agent-workflow/v2/v2-agent-system.md`
- `agent-workflow/reports/WSD-20260507-02-v2-agent-system-design-closeout.md`

调度影响：
- `V2-1` 已 accepted。
- 后续 `V2-2` 由 `V2 Source Intelligence Agent` + `V2 Heatmap Algorithm Agent` 牵头。
- 后续 `V2-3` 由 `V2 VI / Design System Agent` 牵头。
- 后续 `V2-4A` / `V2-4` 由 `V2 Strategy & Product Architecture Agent` 牵头。
- 后续 `V2-5` 由 `V2 Platform / Dev Migration Agent` 牵头。
- 所有关键 V2 任务必须包含 `V2 Verification Agent` 独立验收段。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

验证：
- `feature_list.json` JSON 解析通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-075456.md`。

## 2026-05-07 V2-4A AI商业内参与热力图规划入库

用户提供 `guanlan_ai_brief_heatmap_premium_plan.md`，调度中枢已阅读并判断其适合作为 V2.0 核心产品主线候选。本轮已入库并派发为 V2 专题任务。

入库文件：
- `agent-workflow/v2/references/guanlan-ai-brief-heatmap-premium-plan.md`
- `agent-workflow/v2/briefs/v2-ai-brief-heatmap-premium-brief.md`

新增看板任务：
- 看板编号：`V2-4A`
- Task ID：`WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan`
- 状态：`ready`
- 派发单：`agent-workflow/execution/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan.md`
- closeout：`agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md`

调度说明：
- 原先路线图里已有 `V2-6` 用于“V2 监测算法 7 日测试”，为避免编号冲突，本任务采用 `V2-4A`。
- `V2-4A` 是产品功能类规划任务，必须完成 PM 门禁、WAVE 评分和模块决策表，不得直接进入 Dev。
- `V2-2` 已补充读取该规划，必须回应 HeatEvidence、行业 / 岗位 / 流程 / 三元组热力和 AIBriefIssue。
- `V2-4` 已补充读取该规划，必须判断 `AI内参` 与 `AI商业热力图` 是否进入 V2 产品架构。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响，本轮只入库规划，不改生产自动化。
- `ai-3`：不影响。

验证：
- `feature_list.json` JSON 解析通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-074931.md`。

## 2026-05-07 SYS-9 V2.0 转场准备

V1.0 已完成，用户确认开始进入 V2.0 开发前准备。本轮调度中枢直接执行 `SYS-9 / WSD-20260507-01-v2-transition-planning`，状态标记为 `accepted`。

本轮结论：
- V2.0 仍归属当前 `01-WaveSight` 项目体系，不另起孤立项目。
- 当前阶段新增 `agent-workflow/v2/` 作为 V2 规划和派发资产目录。
- 后续进入代码开发时，建议由 `V2-5` 决定是否创建独立分支或 worktree，例如 `01-WaveSight-v2-lab`。
- 本轮不修改 `04-Site` 页面、不替换生产自动化、不改变内容源 frontmatter 或同步脚本口径。

新增 V2 文档：
- `agent-workflow/v2/README.md`
- `agent-workflow/v2/v1-baseline-freeze.md`
- `agent-workflow/v2/v2-transition-charter.md`
- `agent-workflow/v2/v2-preflight-roadmap.md`
- `agent-workflow/v2/v2-workspace-strategy.md`
- `agent-workflow/v2/briefs/v2-agent-system-brief.md`
- `agent-workflow/v2/briefs/v2-algorithm-brief.md`
- `agent-workflow/v2/briefs/v2-source-monitoring-brief.md`
- `agent-workflow/v2/briefs/v2-vi-brief.md`

新增看板任务：
- `SYS-9 / WSD-20260507-01-v2-transition-planning`：`accepted`
- `V2-1 / WSD-20260507-02-v2-agent-system-design`：`ready`
- `V2-2 / WSD-20260507-03-v2-algorithm-source-architecture`：`ready`
- `V2-3 / WSD-20260507-04-v2-vi-design-direction`：`ready`
- `V2-4 / WSD-20260507-05-v2-product-architecture-prd`：`ready`
- `V2-5 / WSD-20260507-06-v2-dev-workspace-baseline`：`ready`

建议下一批：
1. `执行：V2-1`
2. `执行：V2-2`
3. `执行：V2-3`
4. `执行：V2-4`
5. `执行：V2-5`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

验证：
- `feature_list.json` JSON 解析通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-074241.md`。

## 2026-05-06 AI News Radar 重点关键词与前端专区

用户要求允许修改 `09-ai-news-radar` 前端和筛选规则，并基于三层“监测关键词组”新增前端关键词筛选 / 重点推送能力。

已完成：
- 新增 `09-ai-news-radar/config/priority-keywords.json`。
- 修改 `09-ai-news-radar/scripts/update_news.py`，给命中内容打 `priority_score`、`priority_matches`、`priority_groups`。
- 输出 `priority_summary` 与 `priority_items`。
- 修改 `09-ai-news-radar/index.html`、`assets/app.js`、`assets/styles.css`，新增 `重点关注` 专区。
- 普通新闻卡片显示 `重点` 标签和命中关键词。
- OPML RSS 单源请求超时从 `12s` 调整为 `25s`。
- OPML 并发上限从 `20` 降到 `6`。

当前数据结果：
- 关键词组数量：17。
- 当前重点命中条目：834。
- 前端专区输出前 36 条高分重点条目。

验证：
- `node --check 09-ai-news-radar/assets/app.js` 通过。
- `python -m py_compile 09-ai-news-radar/scripts/update_news.py 09-ai-news-radar/scripts/export_obsidian.py` 通过。
- `pytest -q` 通过，39 passed。
- 本地站点 `http://127.0.0.1:8088/` 返回 200。
- 本地数据 `http://127.0.0.1:8088/data/latest-24h.json` 返回 200。

报告：
- `agent-workflow/reports/ai-news-radar-priority-keyword-frontend-2026-05-06.md`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：前端展示和本地数据筛选规则已变更；未引入 API Key、cookies、token、真实 OPML、邮箱正文或私有邮件内容。

## 2026-05-06 停止 AI News Radar Obsidian 同步并清空目录

用户要求停止 `08-AI news` 同步任务，并删除所有已同步内容。

已完成：
- 检查并停止 `09-ai-news-radar`、`update_news.py`、`export_obsidian.py` 相关 Python 后台进程。
- 已清空目录：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight\08-AI news`。
- 删除范围仅限 `08-AI news` 目录内部内容。
- 清空后目录剩余条目数：0。

后续状态：
- 不再默认执行 Obsidian 同步。
- 后续如启动 AI News Radar，仅启动本地网站或更新 radar 数据，除非用户明确要求恢复 Obsidian 同步。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：停止本地 Obsidian 导出任务；不影响 radar 本地网站数据文件。

## 2026-05-06 SYS-8 调度流效率升级

用户反馈调度中枢模式下派发指令、执行窗口读取指令、收口指令和收口验收耗时过长。调度中枢本轮已将机制升级为“文件驱动短口令”。

任务记录：
- 看板编号：`SYS-8`
- Task ID：`WSD-20260506-01-dispatch-flow-efficiency-upgrade`
- 状态：`accepted`
- closeout：`agent-workflow/reports/WSD-20260506-01-dispatch-flow-efficiency-upgrade-closeout.md`

新规则：
- 派发时默认只给执行窗口短提示词，不再重复粘贴长背景。
- 执行窗口必须读取 `AGENTS.md` 和对应派发单。
- 派发单成为完整任务入口，硬闸门、禁止范围、必跑检查和自动化影响都写在派发单里。
- 收口支持 `收口：<TASK-ID>`，调度窗口默认读取 `agent-workflow/reports/<TASK-ID>-closeout.md`。
- closeout 模板新增前 40 行“调度摘要”，用于快速定位状态、改动文件、检查结果、阻塞项和自动化影响。

后续标准执行口令：

```text
执行任务：<TASK-ID>
请读取 AGENTS.md 和 agent-workflow/execution/<TASK-ID>.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/<TASK-ID>-closeout.md。
回调度窗口：收口：<TASK-ID>
```

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-06 ai-news-radar 默认源与 Obsidian 同步

用户要求按 `https://github.com/LearnPrompt/ai-news-radar` 仓库内懂王 Skill 原始配置运行，不再提供额外信息源清单。

已完成：
- 下载目标仓库到本地副本：`C:\Users\86186\Documents\Fang\wiki\AI热点\ai-news-radar`。
- 读取目标仓库 `skills/ai-news-radar/SKILL.md`、`references/source-intake.md` 和 `docs/SOURCE_COVERAGE.md`。
- 按默认公开源运行 `scripts/update_news.py`，未启用 OPML 或 AgentMail。
- 新增本地 Obsidian 导出脚本 `scripts/export_obsidian.py`。
- 将公开快照导出到 `08-AI news/daily`、`08-AI news/items`、`08-AI news/sources`。
- 输出默认源接入判断：RSS / Atom、公开 feed、静态页面、Jina 兜底、OPML 私有扩展、AgentMail 私有扩展和跳过规则。

报告：
- `agent-workflow/reports/ai-news-radar-default-config-obsidian-sync-2026-05-06.md`

验证：
- `python -m py_compile scripts/update_news.py scripts/export_obsidian.py` 通过。
- `python scripts/update_news.py --output-dir data --window-hours 24 --archive-days 21` 通过。
- `python scripts/export_obsidian.py --data-dir data --vault-dir "../01-WaveSight/08-AI news" --limit 80` 通过。
- `node --check assets/app.js` 通过。
- `pytest -q` 通过，36 passed。
- `git diff --check` 未运行：目标仓库本地副本来自 GitHub zip，不包含 `.git` 元数据。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：保持 GitHub Actions 自动更新静态站路线；新增本地 Obsidian 导出能力，Actions 不直接写本机 vault。

## 2026-05-06 ai-news-radar X OPML 本地试跑

用户选择本地 OPML 路线新增约 30 个 X AI builders 账号。

已完成：
- 在本地目标仓库创建私有 OPML：`C:\Users\86186\Documents\Fang\wiki\AI热点\ai-news-radar\feeds\follow.opml`。
- 该文件已被目标仓库 `.gitignore` 忽略，不应提交。
- 使用 `--rss-opml feeds\follow.opml` 跑了一次本地更新。
- 重新导出 Obsidian。

结果：
- OPML enabled：true。
- feed_total：30。
- ok_feeds：0。
- failed_feeds：30。
- 新增 X OPML 条目：0。

失败原因：
- 当前公共 RSSHub X 桥接不可用，`rsshub.pseudoyu.com/twitter/user/<handle>` 返回 503 或超时。
- 抽测其他公共实例也返回 404、503 或超时。

报告：
- `agent-workflow/reports/ai-news-radar-x-opml-test-2026-05-06.md`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：本地私有 OPML 已配置，但当前 X 桥接源失败，不影响默认公开源抓取。

## 2026-05-06 ai-news-radar 合并本地 follow-builders skill

用户询问是否能把本地 `follow-builders` skill 合并进 `ai-news-radar`。

已完成：
- 读取本地 skill：`C:\Users\86186\.skill-store\follow-builders`。
- 修改 `ai-news-radar/scripts/update_news.py`，新增本地 Follow Builders feed 合并逻辑。
- 远端 Follow Builders feed 和本地 `feed-x.json` / `feed-blogs.json` / `feed-podcasts.json` 会合并去重。
- 支持 `FOLLOW_BUILDERS_LOCAL_DIR` 环境变量。
- 默认查找 `~/.skill-store/follow-builders`、`~/.codex/skills/follow-builders`、`~/.claude/skills/follow-builders`。
- 更新 `tests/test_utils.py` 与 `docs/DEFAULT_SOURCE_ROUTING.md`。

本轮运行结果：
- Follow Builders 原始抓取量：59 条。
- OPML 30 个 X RSSHub 源中当前成功 2 个：Karpathy、Peter Steinberger。
- 24h AI 精选当前未展示 Follow Builders 条目，主要受时间窗口与主题过滤影响。
- Obsidian 已重新导出。

验证：
- `python -m py_compile scripts/update_news.py scripts/export_obsidian.py` 通过。
- `pytest -q` 通过，37 passed。
- `node --check assets/app.js` 通过。
- 带 OPML 的 `update_news.py` 通过。
- Obsidian export 通过。

报告：
- `agent-workflow/reports/ai-news-radar-follow-builders-local-merge-2026-05-06.md`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：Follow Builders 读取能力增强；未引入 API Key、cookies、token 或邮箱正文。

## 2026-05-06 ai-news-radar Builders 过滤规则放宽

用户要求先让 X / Follow Builders 更容易出现在 radar 页面。

已完成：
- 修改 `ai-news-radar/scripts/update_news.py`。
- `site_id == followbuilders` 默认进入 AI 强相关。
- 本地 OPML 中识别为 X builders 的 `opmlrss` 条目默认进入 AI 强相关。
- 未放宽普通热榜、商业促销、娱乐噪音等通用来源。
- 新增对应测试。

本轮运行结果：
- `latest-24h.json`：974 条。
- `latest-24h-all.json`：6863 条。
- Follow Builders 原始抓取：59 条。
- OPML X 源 30 个，成功 12 个，失败 18 个。
- AI 强相关中新增 OPML X 条目：31 条。
- Obsidian 已重新导出 120 条 item notes。

验证：
- `python -m py_compile scripts/update_news.py scripts/export_obsidian.py` 通过。
- `pytest -q` 通过，39 passed。
- `node --check assets/app.js` 通过。
- 带 OPML 的 `update_news.py` 通过。
- Obsidian export 通过。

报告：
- `agent-workflow/reports/ai-news-radar-builder-filter-relax-2026-05-06.md`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：AI 强相关过滤规则对 builders 源更宽松；未引入 API Key、cookies、token 或邮箱正文。

## 2026-05-06 P0-2A 作废派生工作树清理

调度中枢按用户要求复核 `task/WSD-20260504-13-homepage-hero-carousel-assets` 状态，并清理作废派生目录。

复核结论：
- 看板编号：`P0-2A`
- Task ID：`WSD-20260504-13-homepage-hero-carousel-assets`
- 当前状态：`void / abandoned`
- closeout 结论：任务提前终止，无交付物，不可合并；不得把本轮轮播方向的资产或代码带回主工作树。
- 当前首页后续路线不再沿用三图轮播方向。

已执行清理：
- 已删除派生 worktree 目录：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight-p0-2a-hero-carousel`
- 已执行 worktree 登记清理，当前 Git worktree 只剩主工作树。
- 未删除历史任务分支：`task/WSD-20260504-13-homepage-hero-carousel-assets`，仅清理本地派生目录。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-06 P0-11 首页主视觉收口退回补证据

调度中枢已收到 `P0-11 / WSD-20260504-26-homepage-desk-visual-asset` 收口，但本轮暂不标记 `accepted`，状态更新为 `review / evidence-required`。

收口文件：
- `agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`

已确认内容：
- 任务在 `P0-10` accepted 后执行，方向为首页右侧主视觉 / 首屏节奏。
- 未恢复三图轮播，未沿用旧雷达图、四 poster 卡或 `P0-2B` failed 方案。
- 改动集中在 `04-Site/index.html`、`04-Site/css/styles.css`、`04-Site/js/app.js` 和视觉资产 `04-Site/assets/home-ai-trends-business-future.png`。
- closeout 提供桌面、宽屏、移动 smoke、导航 / 分割线、图片融合等截图路径。
- closeout 说明无横向溢出、可见文本禁用语为空、`#homeHighlights` 可渲染 3 个内容卡、浏览器 console error 为空。
- 未修改内容源 Markdown、`04-Site/data/`、同步脚本、关系检查脚本、统一同步闸门或自动化任务。
- 调度中枢复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，6 项检查，失败 0，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-163510.md`。

未通过验收原因：
- 首页属于 SYS-7 高门槛页面，首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产通过线为 `85`。
- closeout 只写了 UI/UE 总分约 `89/100`，但没有按 SYS-7 输出完整证据化风格美观质检表。
- 缺少五项评分：Style Purity、Proportion & Rhythm、Color Sophistication、Craftsmanship、Emotional Resonance。
- 缺少逐项扣分原因、Squint Test 视觉骨架说明、必须重做清单、可延后优化清单和 Dev 实现偏差清单。
- 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，6 项检查，失败 0，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-163612.md`。

调度结论：
- `P0-11` 暂不 accepted。
- 执行窗口需补齐 SYS-7 证据化审美质检表，并在同一 closeout 中追加补证据小节。
- 补齐后重新提交：`收口：agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-06 日常监测算法 v2 测试管线验收

调度中枢已验收 `P0-12 / WSD-20260505-02-daily-monitoring-v2-test-pipeline`，状态更新为 `accepted / test-only`。

收口文件：
- `agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md`

主报告：
- `agent-workflow/reports/daily-monitoring-v2-test-pipeline-2026-05-05.md`

核心产物：
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `06-content/README.md`
- `06-content/01-raw/2026-05-05-raw-candidates.md`
- `06-content/02-pool/2026-05-05-signal-pool.md`
- `06-content/03-structured-signals/2026-05-05-structured-signals.md`
- `06-content/04-selected-signals/2026-05-05-front-signals.md`
- `06-content/08-opportunities/deep-dive/2026-05-05-opportunity-deep-dive.md`
- `06-content/05-trend-chain/2026-05-05-trend-classification.md`
- `06-content/10-databases/trends/trend-database.md`
- `04-Site/signal-lab.html`
- `04-Site/data/signal-lab-data.json`
- `04-Site/data/signal-lab-data.js`
- `04-Site/scripts/sync-signal-lab.mjs`
- `提示词/日常监测算法V2测试.md`
- `提示词/Signal精选与机会深挖V2.md`
- `agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-manual-runbook.md`
- `agent-workflow/reports/WSD-20260505-02-signal-lab-desktop.png`
- `agent-workflow/reports/WSD-20260505-02-signal-lab-mobile.png`

验收结论：
- 测试漏斗已建立：Raw 36 条、Pool 12 条、Structured 8 条、Front Signal 3 条、Deep Dive 1 条、Trend 5 条。
- PM 门禁 / WAVE 已完成，WAVE 为 `W=3 / A=3 / V=2 / E=2 / 总分=10`。
- 决策为原型验证 / 测试管线，不进入正式 Signals 替换。
- `sync-signal-lab.mjs` 已验证 3 条前台测试 Signal、每条至少 3 个二次来源、每条 6 维度分析、deep dive 有行动地图。
- `signal-lab.html` 是测试页 / 内部直达页，不进入普通主导航。
- 未修改 `sync-data.mjs` 和 `unified-site-sync.mjs`，未将测试内容接入生产同步闸门。

保留边界：
- 这是测试管线验收，不是生产日更链路验收。
- 2026-05-05 测试样例的 `06-content/01-raw/originals/` 目前只建立了归档规则和 README，未回填 36 条 Raw 本地原文；若继续复用该样例，必须先补齐 originals。
- 成熟条件仍为连续 7 天稳定产出、QA 通过、3 条精选 Signal 质量优于现有 Signals，并另行派发正式入站任务。
- 后续若要进入正式 `01-Signals/`、`02-Scoring/`、`03-Trends/` 或 `07-Opportunities/`，必须另派生产入站、关系检查、权限和 QA 任务。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `node --check 04-Site/scripts/sync-signal-lab.mjs` 通过。
- `node 04-Site/scripts/sync-signal-lab.mjs` 通过，输出 3 条前台测试 Signal。
- 调度中枢检查 `sync-data.mjs` 与 `unified-site-sync.mjs` 未接入 `signal-lab` / `06-content`。
- 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，6 项检查，失败 0，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-162748.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：有影响，但只新增测试提示词、手工启动 runbook 和 coordination 文档说明；未替换生产自动化本体。
- `ai-3`：不影响；测试内容不进入统一同步闸门。

## 2026-05-05 P1-4C 已恢复 P1-4B 前网页基线

用户要求本窗口直接执行 `P1-4C / WSD-20260505-04-p1-4b-stop-restore-baseline`。本轮已完成可审计恢复，并将看板标记为 `accepted`。

补充：用户截图指出 Opportunity 列表、Opportunity Detail 和 Trends 仍有残留的大行布局、巨型标题和空白节奏。调度中枢已在 23:28 追加回退 `Detail page standard`、`Design Director QA v3` 中覆盖 Opportunities / Trends / Opportunity Detail 的残留规则，以及 `Opportunities index fix` 整块。

收口文件：
- `agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`

完成事项：
- 备份 P1-4B 涉及的 6 个网页文件到 `agent-workflow/backups/p1-4b-restore-20260505/`。
- 删除 `04-Site/css/styles.css` 中明确标注为 `P1-4B correction: restrained commercial briefing rhythm` 的样式块。
- 恢复 `daily.html`、`signals.html`、`opportunities.html`、`trends.html` 的 P1-4B 标题改动。
- 恢复 `signals.html` 中 P1-4B 移除的隐藏 `newSignalBtn` 与 `editorDialog`，以回到任务前页面基线。
- 恢复 `04-Site/js/app.js` 中可明确识别为 P1-4B 的公开文案替换。
- 未触碰 `04-Site/index.html`、内容源 Markdown、`04-Site/data/`、同步脚本、关系检查脚本、统一同步闸门或自动化任务。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-151838.md`。
- 追加回退后，`node agent-workflow/tools/run-quality-gates.mjs syntax` 再次通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-152805.md`。
- 调度中枢于 2026-05-06 复核收口后再次运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-163242.md`。
- `git diff --check` 针对 P1-4C 涉及文件通过。
- 未产出浏览器截图：Codex Node 环境缺少 Playwright，本机未发现可命令行调用的 Chrome / Edge / Chromium。该缺口已写入 closeout，后续 `P1-4D` 必须补齐桌面 / 移动截图。

调度状态：
- `P1-4C`：`accepted`。
- `P1-4D / WSD-20260505-05-page-evidence-design-audit`：已从 `blocked` 改为 `ready`。
- `GL-M3-017`：保持 `in_progress`，等待 P1-4D 完成逐页证据化审美评分。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-05 停止 P1-4B 并改为恢复基线后重新审美评分

根据用户要求，调度中枢已停止 `P1-4B / WSD-20260505-03-non-home-column-detail-reading-implementation`，状态更新为 `stopped / not accepted`。该任务不得继续执行，也不得作为 accepted 页面成果。

新增任务一：
- 看板编号：`P1-4C`
- Task ID：`WSD-20260505-04-p1-4b-stop-restore-baseline`
- 状态：`ready`
- 派发单：`agent-workflow/execution/WSD-20260505-04-p1-4b-stop-restore-baseline.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260505-04-p1-4b-stop-restore-baseline-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`

P1-4C 目标：
- 停止 P1-4B。
- 将网页恢复到 P1-4B 执行前状态。
- 只撤回 P1-4B 对 `04-Site/css/styles.css`、`04-Site/js/app.js`、`daily.html`、`signals.html`、`opportunities.html`、`trends.html` 的明确改动。
- 不得整仓回滚，不得使用 `git reset --hard`，不得回滚不属于 P1-4B 的变更。
- 不得触碰 `04-Site/index.html`、内容源 Markdown、`04-Site/data/`、同步脚本、关系检查脚本、统一同步闸门或自动化任务。

新增任务二：
- 看板编号：`P1-4D`
- Task ID：`WSD-20260505-05-page-evidence-design-audit`
- 状态：`blocked`，必须等 P1-4C accepted 后执行。
- 派发单：`agent-workflow/execution/WSD-20260505-05-page-evidence-design-audit.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260505-05-page-evidence-design-audit-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260505-05-page-evidence-design-audit-closeout.md`

P1-4D 目标：
- 由 UI / UE Design Director 按 SYS-7 新证据化审美闸门逐页评分。
- 只做截图、评分、扣分原因、必须重做清单、Dev 偏差清单和修改建议，不改代码。
- 页面已实现或可访问时，必须提供桌面截图和移动端截图。
- 首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产通过线为 85；一级栏目页 / 详情页 / 会员页为 80；Admin 为 75；任一单项低于 14、Squint Test 不通过或有审美阻塞项时必须重做。

新的建议顺序：
1. `执行：P1-4C`
2. `收口：agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`
3. P1-4C accepted 后，`执行：P1-4D`
4. `收口：agent-workflow/reports/WSD-20260505-05-page-evidence-design-audit-closeout.md`
5. 基于 P1-4D 审计结果，重新派发页面 Dev 任务。

自动化影响：
- `ai-the-point`：默认不影响。
- `ai-2`：默认不影响。
- `ai-3`：默认不影响。

验证：
- `agent-workflow/feature_list.json` 已确认可解析。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 已通过，6 项检查，失败 0。
- 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-150730.md`。

## 2026-05-05 Design Director 证据化审美验收闸门收口

调度中枢已验收计划外治理任务 `SYS-7 / WSD-design-director-evidence-based-quality-gate`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-design-director-evidence-based-quality-gate-closeout-2026-05-05.md`

主报告：
- `agent-workflow/reports/design-director-evidence-based-quality-gate-2026-05-05.md`

完成产物：
- `agent-workflow/agents/ui-ue-agent.md`：新增证据化审美质检、页面类型通过线和具体扣分规则。
- `agent-workflow/product/DESIGN.md`：新增证据化质检要求和扣分规则。
- `agent-workflow/governance/window-dispatch-hub.md`：调度中枢改为按截图、扣分、Dev 偏差和页面类型通过线验收。
- `agent-workflow/execution/TASK-window-dispatch-template.md`：页面类派发单新增证据字段和新通过线。
- `agent-workflow/reports/TASK-window-closeout-template.md`：页面类 closeout 新增证据字段和新通过线。
- `agent-workflow/governance/agent-memory.md`：写入长期记忆。

新硬规则：
- Design Director 风格美观质检必须证据化，不能只写主观评分。
- 页面已实现或已有可访问页面时，必须包含桌面截图、移动端截图、逐项扣分原因、必须重做清单和 Dev 实现偏差清单。
- 首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产通过线为 85。
- 一级栏目页 / 详情页 / 会员页通过线为 80。
- Admin 工作台和后台模块通过线为 75。
- 任一单项低于 14、Squint Test 不通过或出现审美阻塞项时，必须重做。
- 缺少截图、扣分原因、必须重做清单或 Dev 偏差清单时，质检无效，调度中枢必须退回补齐或重做。

调度影响：
- `SYS-6` 的 100 分制风格美观质检仍保留，但已由本任务升级为证据化验收。
- `P1-4B` 当前仍为 `review`，后续如要 accepted，必须按 SYS-7 补查证据化审美质检。
- 后续首页、全站 UI、Admin、移动端、栏目页、详情页、海报 / 首屏视觉任务均必须套用该硬闸门。

验证：
- closeout 与主报告均存在，UTF-8 可读。
- 已核对规则写入 UI / UE Agent、DESIGN、dispatch hub、派发模板、收口模板和 Agent Memory。
- 执行窗口已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-145746.md`。
- 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，6 项检查，失败 0，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-150156.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-05 Design Director 风格美观质检训练验收

调度中枢已验收计划外治理任务 `SYS-6 / WSD-design-director-style-quality-training`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-design-director-style-quality-training-closeout-2026-05-05.md`

主报告：
- `agent-workflow/reports/design-director-style-quality-training-2026-05-05.md`

完成产物：
- `agent-workflow/agents/ui-ue-agent.md`：新增 Design Director 风格美观创作与质检标准。
- `agent-workflow/product/DESIGN.md`：新增全站设计规范中的风格美观质检规则。
- `agent-workflow/governance/window-dispatch-hub.md`：页面类派发和验收加入风格美观质检硬规则。
- `agent-workflow/execution/TASK-window-dispatch-template.md`：页面类派发单新增 Design Director 风格美观质检表。
- `agent-workflow/reports/TASK-window-closeout-template.md`：页面类 closeout 新增 Design Director 风格美观质检表。
- `agent-workflow/governance/agent-memory.md`：写入长期记忆。

新硬规则：
- 页面类任务必须由 UI / UE Design Director 输出 100 分制风格美观质检表。
- 五项质检为 Style Purity、Proportion & Rhythm、Color Sophistication、Craftsmanship、Emotional Resonance。
- 每次页面设计完成后必须执行 Squint Test。
- 总分低于 70、任一单项低于 10、Squint Test 不通过或出现审美阻塞项时，必须重做，不得进入 Dev 或不得标记 `accepted`。
- 调度中枢不得代补评分，不得接受缺少风格美观质检表的页面类收口。

调度影响：
- `P1-4B` 当前仍为 `review`，后续验收需按本规则补查风格美观质检。
- 后续首页、全站 UI、Admin、移动端、栏目页、详情页、海报 / 首屏视觉任务均必须套用该硬闸门。

验证：
- closeout 与主报告均存在，UTF-8 可读。
- 已核对规则写入 UI / UE Agent、DESIGN、dispatch hub、派发模板、收口模板和 Agent Memory。
- 执行窗口已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-143006.md`。
- 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，6 项检查，失败 0，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-143322.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-05 非首页栏目 / 详情 / 长文阅读开发任务派发

根据用户最新要求，首页修正先去掉，之后再做；调度中枢已暂停 `P0-11` 派发，并新增 `P1-4B / WSD-20260505-03-non-home-column-detail-reading-implementation`，进入非首页页面开发阶段。

任务：
- 看板编号：`P1-4B`
- Task ID：`WSD-20260505-03-non-home-column-detail-reading-implementation`
- 派发单：`agent-workflow/execution/WSD-20260505-03-non-home-column-detail-reading-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260505-03-non-home-column-detail-reading-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md`

任务边界：
- 承接 `P1-4A` 已完成的栏目页、详情页、长文阅读母版规范。
- 只优化 `daily.html`、`signals.html`、`the-point.html`、`opportunities.html`、`trends.html` 及对应详情 / 长文页。
- 允许改动 `04-Site/css/styles.css` 与 `04-Site/js/app.js`，但必须明确不触碰首页。
- 严禁修改 `04-Site/index.html`、首页 hero、首页右侧 Intelligence Desk、首页专属文案和 `P0-11` 状态。
- 不改内容源 Markdown、数据字段、同步脚本、统一同步闸门或自动化任务。

页面类硬闸门：
- 必须按 P1-4A 三张 UI/UE 规范表落地。
- 必须按 P1-4A Copy 规范表清理文案和禁用语。
- Dev 必须逐条说明已实现 / 未实现项。
- QA 必须提供栏目页、详情页、长文页的桌面与移动截图，无横向溢出检查，字号 / 间距 / 模块起点验收。

调度建议：
- 当前优先执行 `P1-4B`。
- `P0-11` 首页右侧样张任务暂缓，等用户重新要求首页时再派发。
- `P0-5` 截图矩阵建议等 `P1-4B accepted` 后执行，以便按新栏目 / 详情 / 长文母版验收。

自动化影响：
- `ai-the-point`：默认不影响。
- `ai-2`：默认不影响。
- `ai-3`：默认不影响。

验证：
- `agent-workflow/feature_list.json` 已确认可解析。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 已通过，6 项检查，失败 0。
- 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-131849.md`。

## 2026-05-05 日常监测算法 v2 测试管线任务派发

根据用户要求，调度中枢已新增 `P0-12 / WSD-20260505-02-daily-monitoring-v2-test-pipeline`，用于升级日常监测任务和筛选算法。

任务：
- 看板编号：`P0-12`
- Task ID：`WSD-20260505-02-daily-monitoring-v2-test-pipeline`
- 派发单：`agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-test-pipeline.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-test-pipeline-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md`

核心需求：
- 原始采集 30-50 条，来源覆盖海外 AI 新闻、融资、产品发布、VC 观点、Builder 观点、X / LinkedIn、Product Hunt、YC 等。
- 初筛入池 10-15 条，去掉重复、浅新闻、工具教程和无商业信号内容。
- 结构化入库 5-8 条，每条完成问题、客户、流程、模式、为什么现在、迁移判断 6 维度分析。
- 前台测试展示 3 条最有商业价值的 Signal，必须二次搜索并提供更多新闻源，形成更强信号解释和观澜解读。
- 深挖机会卡每天最多 1 条，必须二次搜索、深度挖掘解读与行动地图。
- 趋势归类形成长期数据库。
- 所有内容先进入 `06-content/` 分阶段目录，并新建测试网页；成熟前不替代原 `Signals` 栏目。

任务边界：
- 本任务可能影响自动化任务。
- 新能力只进入 `06-content/` 与测试页，成熟前不得替换现有 `01-Signals` 或 `signals.html`。
- 不直接修改 `ai-3` 生产同步闸门。
- 如需更新正式 `ai-2` 自动化本体，必须在 closeout 写清已更新内容；如无法更新，只写测试运行说明和阻塞。

自动化影响：
- `ai-the-point`：默认不影响，但 Builder 观点可作为 raw 线索来源。
- `ai-2`：有影响，应新增或更新测试管线说明，但不得破坏当前生产日更。
- `ai-3`：短期不影响；测试内容不得进入生产同步闸门。

## 2026-05-05 P1-4A 规范阶段收口

根据用户要求，本轮只执行 `P1-4A / WSD-20260505-01-column-detail-reading-system` 的规范阶段，不修改 `04-Site`，不进入 Dev，不做截图 QA。

新增产物：
- `agent-workflow/reports/column-detail-reading-system-spec-2026-05-05.md`
- `agent-workflow/reports/WSD-20260505-01-column-detail-reading-system-closeout.md`

完成内容：
- 栏目页规范表：覆盖 Daily Brief、Signals、The Point、Opportunities、Trends。
- 详情页阅读母版规范表：覆盖 Daily Detail、Signal Detail、Opportunity Detail、Trend Detail、The Point Detail。
- 长文阅读母版规范表：覆盖 Point Source 和后续全文 / 译文 / 来源说明页。
- Copy 文案规范表：覆盖栏目标题、详情页 H1 / meta / CTA、长文页原文 / 译文 / 来源说明、禁用语和判断边界。

调度状态：
- `dispatch-board.md` 已将 `P1-4A` 更新为 `spec_done_dev_pending`。
- Dev / QA 阶段必须等待 `P0-11 / WSD-20260504-26-homepage-desk-visual-asset` accepted 后再执行。

验证：
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 已通过，6 项检查，失败 0。
- 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-125059.md`。
- 因未修改 `04-Site`，不运行 `node --check 04-Site/js/app.js`、浏览器截图、同步、关系检查或标签检查。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-05 栏目页与详情 / 长文阅读母版合并任务派发

根据用户要求，调度中枢已新增 `P1-4A / WSD-20260505-01-column-detail-reading-system`，将以下三项合并为一个大任务：

- 一级栏目页排版规范统一。
- 全站详情页 / 长文阅读排版规范。
- 原 `P1-4 / WSD-20260504-04-daily-brief-detail-productization` Daily Brief 详情页产品化。

任务：
- 看板编号：`P1-4A`
- Task ID：`WSD-20260505-01-column-detail-reading-system`
- 派发单：`agent-workflow/execution/WSD-20260505-01-column-detail-reading-system.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260505-01-column-detail-reading-system-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260505-01-column-detail-reading-system-closeout.md`

原任务处理：
- `P1-4 / WSD-20260504-04-daily-brief-detail-productization` 已标记为 `merged / superseded`，不再单独执行。

任务需求：
- 覆盖一级栏目页：Daily Brief、Signals、The Point、Opportunities、Trends。
- 覆盖详情页：Daily Detail、Signal Detail、Opportunity Detail、Trend Detail、The Point Detail。
- 覆盖长文页：Point Source 素材全文页，以及后续可复用的全文 / 译文 / 来源说明页。
- 必须输出栏目页规范表、详情页阅读母版规范表、长文阅读母版规范表、Copy 文案规范表、Dev 按表实现说明和 QA 截图验收。

调度建议：
- 建议在 `P0-11` 首页 Intelligence Desk 后执行。
- 建议在 `P0-5` UI 截图矩阵前执行，这样 P0-5 可直接按新栏目 / 详情 / 长文母版验收。

自动化影响：
- 默认不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 若执行窗口发现必须改 Markdown 字段、同步脚本或自动化提示词，必须停止并回到调度中枢确认。

## 2026-05-04 网站 UI 方向与 DESIGN v2 验收

用户要求在当前调度窗口直接执行 `P0-10 / WSD-20260504-25-site-ui-design-direction`，本轮已完成并标记为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md`

主报告：
- `agent-workflow/reports/site-ui-design-direction-2026-05-04.md`

完成事项：
- `agent-workflow/product/DESIGN.md` 已新增 `DESIGN v2 草案：商业情报桌面`。
- 全站 Art Direction 收敛为高端商业内参、研究桌面、判断样张、克制会员产品。
- 已输出首页、栏目页、详情页、会员页、Admin 和移动端页面母版。
- 已明确首页右侧主视觉应为 `Intelligence Desk` 判断样张，而不是旧雷达图、poster 卡、抽象海报或 P0-2B failed 结果。
- 已明确后续 Dev 不应继续靠追加 `final / override / lock / polish` 样式层推进高级感，应先按 tokens、layouts、components 和 page-specific 边界整理。

验证：
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-155700.md`。

下一步：
- `P0-11 / WSD-20260504-26-homepage-desk-visual-asset` 可执行，必须读取 DESIGN v2 与 `site-ui-design-direction-2026-05-04.md`。
- `P0-6` 继续覆盖 `signals.html` 隐藏编辑弹窗、`scoring.html`、`tags.html`、`apply.html` 和四身份状态。
- `P0-5` 后续应按 DESIGN v2 做桌面高级感截图矩阵。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 GitHub 与 Netlify 更新验收

调度中枢已验收 `P0-4B / WSD-20260504-28-github-netlify-sync`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md`

主报告：
- `agent-workflow/reports/github-netlify-sync-2026-05-04.md`

复核结果：
- GitHub remote：`https://github.com/jerryfang2023-stack/AI-Radar.git`
- 当前本地 `HEAD` 与 `origin/main`：`925f2e9ccbd6cb2a63b5790d594f89e4efb01d9c`
- Netlify 默认站点：`https://wavesight-ai-preview.netlify.app`
- Netlify 不可变部署链接：`https://69f8beccecce0b0009888a05--wavesight-ai-preview.netlify.app`
- 远端首页、Daily、Signals、The Point、Opportunities、Trends、CSS、JS、`data/radar-data.js` 均返回 200。
- 远端数据包含 `judgmentNodes` 与 `priorityEngine`，`judgmentNodeCount=22`，`generatedAt=2026-05-04T15:21:59.991Z`。

验收边界：
- 本次是 GitHub 版本同步与 Netlify Preview 更新，不是正式 production launch。
- 未配置正式域名，未接入真实数据库、真实支付、真实邮件或生产账号系统。
- `P0-2A` void / abandoned 与 `P0-2B` failed / not accepted 没有作为成功页面成果部署。
- 当前工作树仍有 P0-10 相关未提交文件和新的 syntax 报告，不属于本次已部署远端版本；后续如需同步，需要另行执行 GitHub / Netlify 更新。

后续：
- 继续执行 `P0-10`。
- `P0-10 accepted` 后再执行 `P0-11`。
- 执行 `P0-6`、`P0-5`、`P0-4`，补权限边界、截图矩阵和正式上线准备。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 网站模块与设计规范联合梳理验收

调度中枢已验收 `P0-10A / WSD-20260504-27-site-module-design-review`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`

主报告：
- `agent-workflow/reports/site-module-design-review-2026-05-04.md`

完成结论：
- 当前前台主线 `首页 / Daily Brief / Signals / The Point / Opportunities / Trends` 继续成立。
- 当前不建议新增模块；优先修全站高级感、模块主次、页面母版和前后台边界。
- 首页旧雷达图、四张 poster 卡和泛营销利益表达不符合“高端商业情报产品”调性，应在 P0-10 / P0-11 中处理。
- `scoring.html` 和 `tags.html` 虽不在主导航，但仍可直接访问；建议分别后台化 / 合并进 Opportunities 与栏目筛选能力。
- `Signals` 应从后台仪表盘感收敛为商业信号检索台。
- `Opportunities` 右侧 `机会排行` 应弱化榜单感，改向 `优先观察` / `验证序列`。
- `styles.css` 已有多轮样式堆叠，P0-10 必须先输出 DESIGN v2、页面母版和组件边界，再进入 Dev。

调度中枢复核：
- closeout 与主报告均存在，UTF-8 可读。
- 产出覆盖模块地图、PM 模块生命周期决策表、新增功能门禁记录与 WAVE 评分、Design Director 全站页面规范审计表、DESIGN v2 修改建议、Copy 风险清单和后续任务拆分建议。
- 改动范围符合派发单，只写入 `agent-workflow/reports/`。
- 未修改 `04-Site/`、内容源 Markdown、同步脚本、检查脚本、自动化配置或 Netlify 配置。
- 调度中枢复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-153020.md`。

下一步：
- 执行 `P0-10 / WSD-20260504-25-site-ui-design-direction`，并要求读取本报告。
- `P0-10 accepted` 后再执行 `P0-11`。
- P0-6 必须覆盖 `signals.html` 隐藏编辑弹窗、`scoring.html`、`tags.html`、`apply.html` 访问边界。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 GitHub 与 Netlify 更新任务派发

根据用户要求，调度中枢已新增 GitHub 同步与 Netlify 更新任务，用于把已验收、应进入版本管理的网站代码和项目工作流文件推送到 GitHub，并更新 Netlify 预览站点部署。

任务：
- 看板编号：`P0-4B`
- Task ID：`WSD-20260504-28-github-netlify-sync`
- 派发单：`agent-workflow/execution/WSD-20260504-28-github-netlify-sync.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-28-github-netlify-sync-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md`

任务边界：
- 这是版本同步与 Netlify 预览站点更新，不是正式 production launch。
- 必须先审计 Git 状态、分支、remote 和未提交文件。
- 只提交和部署已验收、应进入版本管理的变更。
- 不得提交或部署 `P0-2A` void / abandoned 成果。
- 不得提交或部署 `P0-2B` failed / not accepted 成果。
- 不得使用破坏性 Git 命令，不回滚或删除陌生修改。

验收要求：
- closeout 必须写清 GitHub branch、commit hash、remote URL 和 push 结果。
- closeout 必须写清 Netlify Site ID、Deploy ID、部署 URL 和默认站点 URL。
- 必须检查远端首页、Daily、Signals、The Point、Opportunities、Trends、CSS、JS 和 data 可访问。

自动化影响：
- 默认不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 本任务可能影响上线准备路径和 Netlify 预览站点。

## 2026-05-04 网站模块与设计规范联合梳理任务派发

根据用户要求，调度中枢已新增规划评审任务，由升级后的 PM Agent 与 UI / UE Design Director 联合梳理网站模块、页面体系和设计规范，并提出修改与优化意见。

任务：
- 看板编号：`P0-10A`
- Task ID：`WSD-20260504-27-site-module-design-review`
- 派发单：`agent-workflow/execution/WSD-20260504-27-site-module-design-review.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-27-site-module-design-review-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`

任务边界：
- 不直接修改 `04-Site/`。
- 不进入 Dev。
- 不生成首页海报图。
- 不新增前台栏目或后台能力，只做 PM 模块生命周期评审、Design Director 全站规范审计、DESIGN v2 修改建议和后续任务拆分。

调度建议：
- 先执行 `P0-10A`。
- `P0-10A accepted` 后，再决定是否执行或更新 `P0-10`。
- `P0-11` 仍必须等 `P0-10 accepted` 后再执行。

自动化影响：
- 默认不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 如执行窗口提出改变 Markdown 命名、字段规则、同步脚本、统一同步闸门、自动化时间线或内容生成口径，只能作为建议写入报告，不得直接修改。

## 2026-05-04 调度中心交接补充

- 已生成调度中心新窗口交接文件：`agent-workflow/reports/dispatch-hub-handoff-2026-05-04.md`。
- 已接收并验收 `WSD-pm-module-governance`，状态 `accepted`。
- PM Agent 已升级“宁缺毋滥”模块生命周期治理；后续新增功能、页面、入口、视图、筛选、后台能力、会员能力、自动化产物或数据维度，必须先过 PM 新增功能门禁、WAVE 评分和模块决策表。
- 产品功能类任务未通过 PM 门禁时，不得直接进入 Dev。

## 当前状态

更新时间：2026-05-02

已知状态：

- 项目根目录已调整为 `01-WaveSight`。
- `07-Opportunities` 已扁平化，机会卡直接位于 `07-Opportunities/`。
- 网站同步脚本路径已配置化：`04-Site/config/content-paths.json`。
- 已建立 `agent-workflow` 长任务协同目录。
- 已运行多 agent 梳理，形成 Strategy、Content/Data、UI、Dev、Copy、PM 六类角色。
- 已确认需要固定 PM Agent，作为栏目规划、产品功能规划、PRD 和验收总控。
- 已新增产品战略、栏目架构、PRD 模板、里程碑、发布计划、审批规则和工具登记。

## 当前产品判断

- 观澜AI是面向商业决策者的 AI 机会判断系统，不是 AI 新闻站或工具站。
- 核心卖点统一为：比市场早一步，看清哪些 AI 机会值得验证。
- 前台推荐导航调整为：首页 / Daily Brief / Signals / Opportunities / Trends。
- `Scoring` 保留为后台 Priority Engine，不再作为前台栏目；`Priorities` 的能力合并进入 `Opportunities`。
- `Opportunities` 是最终机会库，必须承接评分、优先级、证据等级、趋势状态和验证动作。
- Admin 必须独立隐藏，普通用户页面不能出现编辑、同步、恢复、访问状态等后台痕迹。
- Daily Brief 是每日核心付费交付物，应成为可独立阅读和邮件发送的商业内参。
- Signals 不是新闻，而是有事件、有证据、有商业含义的 AI 商业变化。
- Trends 不是趋势列表，而是趋势判断模型，需要解释升温、分化、降温、风险与反证。

## 待重点复核

1. 旧 `scoring.html` 前台如何迁移、隐藏或作为 Opportunity 排序视图，需要 PM 和 Dev 联合确认。
2. 需要设计正式的 Daily Brief 模板，并用最近一天数据生成样稿。
3. 需要把 Opportunities 字段升级为承接 Priority Engine 的正式机会卡。
4. 需要实现 schema-check、relation-check、dedupe-check、keyword-quality-report、brief-quality-check。
5. Tags 页面需要从前台一级导航降级为搜索和机会网络能力。
6. 每次改首页、栏目页、视觉或文案前，继续使用 frontend-design、awesome-design-md、copywriting 和 PM 判断。
7. 云端部署前，需要跑 deploy-check 和 release checklist。

## 本轮完成

- 参考 PM Skills Marketplace 的 Discovery、Strategy、Execution、PRD、Prioritization、Opportunity Solution Tree 方法，设立 PM Agent。
- 补充 `agent-workflow/product/`、`agent-workflow/prd/`、`agent-workflow/roadmap/`、`agent-workflow/execution/`、`agent-workflow/governance/`。
- 重写 `feature_list.json`，加入 milestone、owner、automation_level、approval_required、acceptance、verification。
- 新增 `04-Site/DESIGN.md`，沉淀观澜AI现有网站设计原则。
 - 运行健康检查，最新日志为 `agent-workflow/logs/health-20260502-143348.md`；基础文件正常，仍有 4 条历史评分项赛道为空。

## 2026-05-02 新阶段启动

本轮根据新的产品判断，正式启动多 agent 协同阶段。

新增作战手册：

- `product/strategy-single-source.md`：观澜 AI 战略单一事实源，作为所有长期 agent 的共同依据。
- `agents/`：长期 agent 岗位库，包含 Strategy、PM、UI/UE、Copy、Data、Dev、QA、Workflow 八个角色。
- `product/signal-system.md`：Signals 定义、监测来源、关键词自优化和评分算法。
- `product/daily-brief-product.md`：Daily Brief 作为付费级独立报告的结构和质量标准。
- `product/trend-model.md`：趋势状态、证据阶梯、采用曲线、机会温度、趋势分化和反证模型。
- `product/commercial-site-modules.md`：会员制官网、登录注册、7 天试读、会员订阅、企业版/私享内参申请和后台运营模块。
- `execution/agent-launch-2026-05-02.md`：本阶段多 agent 启动计划、目标、分工和验收。

新增 agent：

- Strategy Agent
- PM Agent
- UI / UE Agent
- Copy Agent
- Data Agent
- Dev Agent
- QA / Acceptance Agent
- Workflow / Automation Agent
- Signal Intelligence Agent
- Daily Brief Agent
- Opportunity Engine Agent
- Trend Intelligence Agent
- Commercial Site Agent

新增核心任务：

- `GL-M1-004` 建立 Signals 定义、监测来源与评分算法。
- `GL-M1-005` Daily Brief 产品化。
- `GL-M1-006` Trends 趋势判断模型升级。
- `GL-M2-001` 将 Priorities 合并进 Opportunities。
- `GL-M2-004` 建立内容质量与关键词质量检查。
- `GL-M3-003` 补齐会员制官网商业化模块。
- `GL-M3-004` 内部方法论资产沉淀，暂不作为当前对外页面。

## 2026-05-02 文档一致性整理

本轮统一了新战略主线：

- 前台导航固定为：首页 / Daily Brief / Signals / Opportunities / Trends。
- `Scoring` 保留为后台 `Priority Engine`。
- `Priorities` 不作为独立前台栏目，能力合并进 `Opportunities`。
- `Method` 不作为当前前台栏目，先作为内部方法论资产。
- 普通用户路径为注册 / 登录 / 7 天试读 / 订阅；企业版和私享内参保留申请入口。

新增 active PRD：

- `PRD-001-daily-brief.md`
- `PRD-002-signals-system.md`
- `PRD-003-opportunities-engine.md`
- `PRD-004-trends-model.md`
- `PRD-005-membership-access.md`

启动目标：

> 把观澜 AI 从“本地内容网站”升级为“可监测、可执行、可优化、可商业化的 AI 商业判断产品”。

## 2026-05-02 长期 Agent 岗位化

已建立长期 agent 岗位库：

- `agents/strategy-agent.md`
- `agents/pm-agent.md`
- `agents/ui-ue-agent.md`
- `agents/copy-agent.md`
- `agents/data-agent.md`
- `agents/dev-agent.md`
- `agents/qa-agent.md`
- `agents/workflow-agent.md`
- `agents/agent-registry.json`

长期 agent 不依赖某一个临时对话线程存在。临时 agent 可以关闭，但岗位说明书、任务状态、交接记录和验收标准必须保留。

后续每轮工作从 Strategy Agent 开始：

```text
Strategy -> PM -> Data -> UI/UE + Copy -> Dev -> QA -> Workflow
```

## 工作纪律

- 新一轮开始前先查看 `feature_list.json` 和 `progress.md`。
- 新增栏目或重要功能前先写 PM 判断或 PRD。
- 修改网站前明确普通端和管理员端影响范围。
- 每轮完成后记录：改了什么、验证了什么、还有什么风险。

## 2026-05-02 Opportunities 与 Priority Engine 关系打通

已按长期 agent 规则完成 Data Agent / Dev Agent 阶段，未创建新的临时 agent。

完成事项：

- 新增 `product/opportunity-priority-schema.md`，沉淀 scoring 与 opportunity 的关系字段和匹配规则。
- 更新 `04-Site/scripts/sync-data.mjs`，自动拆分 scoring 原始名称、机会方向和代表案例。
- 同步后每个 scoring row 写入 `relatedOpportunityId`、`opportunityId`、`opportunitySlug`、`opportunityTitle`、`opportunityMatchStatus`。
- 同步后每张 opportunity card 写入 `relatedScoringIds`、`priorityRows`、`priorityScore`、`priorityRank`、`representativeCases`。
- Opportunities 右侧机会排行可点击进入匹配到的机会详情页。
- 机会卡列表显示来自 Priority Engine 的评分。

验证结果：

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- scoring rows：26。
- matched：26。
- unmatched：0。
- opportunities with score：18。
- opportunities without score：5。

本轮报告：

- `reports/opportunity-priority-link-2026-05-02.md`

## 2026-05-02 Trends 趋势模块优化

已按长期 agent 规则完成 Trend Intelligence / Data / UI-UE / Dev 阶段，未创建新的临时 agent。

完成事项：

- Trends 引入每日 `AI机会评分` 作为第二证据层。
- 同步脚本为每个 trend 生成 `status`、`statusLabel`、`summary`、`latestScore`、`relatedScoringIds`、`topScoringRows`、`evidenceLadder`、`adoptionStage`、`opportunityTemperature`、`counterEvidence`。
- Trends 列表页从普通卡片列表升级为趋势地图。
- Trend 详情页升级为“主判断 + 评分变化 + 证据阶梯 + 机会温度 + 评分证据 + 关联机会 + 反证观察”。
- 趋势文案去掉表情符号，保持克制判断，不替用户下最终投资、经营或合作结论。

验证结果：

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- trends：10。
- 每个 trend 均已生成状态、证据阶梯和反证观察。

本轮报告：

- `reports/trends-optimization-2026-05-02.md`

## 2026-05-02 Signal-Priority-Trend-Opportunity 关系检查

已按长期 agent 规则完成 Data / QA / Dev 阶段，未创建新的临时 agent。

完成事项：

- 新增 `product/relation-check-schema.md`，定义 Signal、Priority、Trend、Opportunity 四类数据的关系检查规范。
- 新增 `04-Site/scripts/check-relations.mjs`，可在每次同步后检查断链和关系覆盖率。
- 检查报告自动写入 `reports/relation-check-latest.md` 和按日期命名的报告。
- 关系检查区分硬错误与软提醒：硬错误代表 ID 断链，软提醒代表运营复核项。

当前检查结果：

- 硬错误：0。
- 软提醒：23。
- Priority -> Opportunity：26/26，100%。
- Priority -> Trend：26/26，100%。
- Signal -> Opportunity：22/22，100%。
- Trend -> Priority：10/10，100%。
- Trend -> Opportunity：10/10，100%。

当前待优化项：

- 4 条 Priority 缺少原始 Signal。
- 10 条 Signal 尚未进入 Trend。
- 4 条 Trend 缺少原始 Signal 证据。
- 5 张 Opportunity 暂无评分证据。

后续每次运行 `node 04-Site/scripts/sync-data.mjs` 后，应继续运行 `node 04-Site/scripts/check-relations.mjs`。

## 2026-05-02 战略事实源补充整合

本轮已根据用户补充的四个文档，统一更新 `product/strategy-single-source.md`：

- `guanlan-spec.md`
- `product/column-architecture.md`
- `product/commercial-site-modules.md`
- `product/product-strategy.md`

整合后的事实源继续作为所有长期 agent 的共同依据，覆盖产品定位、栏目结构、商业化模块、权限体系、后台运营、Signals / Daily Brief / Opportunities / Trends 的一体化关系。

补充修订：

- 新增文案风格规范：克制、有观点、有证据边界，不替客户下最终判断。
- 新增页面 UI 风格规范：高端、克制、清晰、有留白，普通用户前台不出现后台痕迹。
- 优化 Daily Brief 结构：从“行动建议”改为“今日判断、关键 Signals、机会观察、趋势变化、判断依据、风险与反证”。
- 同步修订 `product/daily-brief-product.md`，避免交付口径变成投资、经营或合作指令。

## 2026-05-02 长期 Agent 调度规则修正

用户明确要求：后续必须把工作分配给已有长期智能体，不能每次重复创建临时 agent。

已新增硬规则文件：

- `governance/long-term-agent-dispatch-policy.md`

后续执行要求：

- 默认不调用临时 agent 创建能力。
- 任务分配必须写入 `execution/`、`feature_list.json`、`prd/active/` 或对应长期 agent 岗位文件。
- 只有用户明确批准时，才允许创建临时执行线程。
- 如确需临时线程，必须先说明原因、写入范围和回填方式。

补充任务：

- 已将“首页页面布局和排版优化”加入 PM Agent 本轮任务。
- PM Agent 需要先定义首页的信息层级、模块取舍、桌面/移动端验收点，再交给 UI/UE Agent 和 Copy Agent 执行。

## 2026-05-02 PM Agent 执行结果

已按长期 agent 规则执行 PM Agent 本轮工作，未创建临时 agent。

本轮更新：

- 重写 `prd/active/PRD-001-daily-brief.md`，Daily Brief 改为每日判断内参，删除行动建议结构。
- 重写 `prd/active/PRD-002-signals-system.md`，明确 Signal 标题必须是事件 + 商业含义。
- 重写 `prd/active/PRD-003-opportunities-engine.md`，明确 Scoring 后台化为 Priority Engine，并入机会卡。
- 重写 `prd/active/PRD-004-trends-model.md`，明确趋势状态、证据阶梯和反证模型。
- 重写 `prd/active/PRD-005-membership-access.md`，明确会员访问与 Admin 权限边界。
- 新增 `prd/active/PRD-006-homepage-layout.md`，定义首页布局与排版优化。
- 新增 `execution/pm-next-sprint-2026-05-02.md`，定义 P0 / P1 执行顺序与各长期 agent 后续边界。

下一步建议：

- 用户确认 PM Sprint 后，进入 Data Agent、UI/UE Agent、Copy Agent 的规范输出阶段。

## 2026-05-02 Signals 商业信号系统补充

根据用户补充要求，已更新 Signals 系统：

- `prd/active/PRD-002-signals-system.md`
- `product/signal-system.md`
- `execution/pm-next-sprint-2026-05-02.md`

补充内容：

## 2026-05-02 Dev Agent 第一轮开发

已按长期 agent 规则进入 Dev Agent 开发阶段，未创建新的临时 agent。

完成事项：

- 更新 `04-Site/config/content-paths.json`，继续保持内容目录配置化。
- 更新 `04-Site/scripts/sync-data.mjs`，支持新版 Signals 字段，包括 Signal Score、来源层级、运营状态、相关机会、相关趋势和评分拆分项。
- 修复同步脚本中的路径斜杠转义问题。
- 已执行网站数据同步，生成新的 `04-Site/data/radar-data.json` 与 `04-Site/data/radar-data.js`。
- 同步结果：22 signals，26 score rows，10 trends，23 opportunities。
- 公开前台导航已收敛为：首页 / Daily Brief / Signals / Trends / Opportunities；普通页面不再展示 Priorities 与 Tags 一层入口，Admin 页面仍保留管理入口。
- Daily Brief 页面已升级为每日判断内参结构，包含今日判断、关键 Signals、机会卡观察和趋势观察。
- Priority Engine 已合并进入 Opportunities 页面顶部，评分说明从行动建议改为证据强度和观察状态。
- Daily Brief 已继续拆成列表页与独立详情页：列表卡片可点击进入 `daily-detail.html`，卡片中已撤掉机会优先级，只保留关键 Signals、机会卡和趋势观察。
- 首页 Decision Brief 第一栏已由优先级内容改为今日关键 Signals。
- 已按 `frontend-design` 对 Daily Brief 和首页 Decision Brief 做视觉重排，减少小卡片堆叠，改成更清晰的内参式阅读布局。
- 根据用户反馈继续修正 Daily：放宽页面左右宽度，详情页改为主 Signal 阅读区 + 右侧机会/趋势侧栏。
- Daily Detail 已继续优化文案和排版：标题改为观澜简报，主判断强调连续证据，阅读区和侧栏文字层级重新收紧。
- 已新增 `product/DESIGN.md` 作为观澜AI长期设计规范，明确 Daily Brief、首页 Decision Brief、Signals、Opportunities、文案和 UI Agent 工作流程。
- 已重写 `agents/ui-ue-agent.md`，要求 UI/UE Agent 每次改页面前必须读取 `DESIGN.md`，声明设计参考、阅读路径和验收点。
- 已新增 `product/COPY.md` 作为观澜AI长期文案规范，明确对外表达、Daily Brief、Signals、Opportunities、Trends、CTA、禁用词和文案验收标准。
- 已重写 `agents/copy-agent.md`，要求 Copy Agent 每次改文案前必须读取 `COPY.md` 与 `DESIGN.md`，避免内部流程语、过度承诺和替客户下最终判断。
- Copy Agent 文案准则已补充：言之有物、简洁克制、精炼有力、不讲废话；每句话都必须提供信息、判断或边界。
- 新增 `reports/dev-implementation-2026-05-02.md` 作为本轮开发记录。

下一步建议：

- 前台导航收敛为：首页 / Daily Brief / Signals / Opportunities / Trends。
- Scoring 后台化为 Priority Engine，并入 Opportunities。
- Daily Brief 页面升级为每日内参结构。
- 继续剥离普通前台和管理员权限入口。

- 建立可支撑实际运营的 Signal Score 模型。
- 新增 Signal 运营字段，包括分数拆解、来源层级、关键词来源、监测批次、去重键和反馈标签。
- 明确每日监测任务需要反向优化关键词、优秀网站和数据源。
- 建立每日复核、每周关键词/来源质量报告、每月模型校准、季度复盘机制。
- 明确算法分数只用于筛选、排序和复盘，不替代最终商业判断。

## 2026-05-02 会员访问与 Admin 权限边界开发

已按长期 agent 工作规范执行 PRD-005，未创建临时 agent。

执行前确认标准：

- UI 依据 `product/DESIGN.md` 与 `frontend-design`：前台保持克制、清晰、有留白，普通用户路径不出现后台痕迹。
- 文案依据 `product/COPY.md`：言之有物、简洁克制，不使用申请审批口径，不替用户下最终判断。

完成事项：

- 前台访问逻辑从“申请审批”改为“注册试读 / 登录 / 订阅 / 阅读权限”。
- 新增 `register.html`、`login.html`、`account.html`、`pricing.html`、`checkout.html`。
- 注册后自动获得试读期，默认 7 天；管理员可在后台调整默认试读天数。
- 订阅方案支持月度、季度、年度；本地演示环境用模拟支付开通阅读期限。
- Admin 新增用户权限管理与订阅记录，支持给用户加一周、一月、一季或设为到期。
- 首页、旧预览页和受限页入口已替换为注册、登录、订阅相关文案。
- 旧 `apply.html` 改为停用提示页，不再承载申请流程。

验证：

- `node --check 04-Site/js/app.js` 通过。
- 站点 HTML/JS 中已清理公开“申请访问 / 审批 / 访问申请 / 访问状态”等旧流程文案。

## 2026-05-03 商业雷达补跑

已按用户要求使用当前会话 OpenAI/Codex 内置网页检索能力补跑 2026-05-03 商业雷达。

完成事项：

- 将 05-03 原空跑文件修正为正式 Signals 文件，新增 7 条 Signals。
- 将 05-03 评分文件修正为正式评分表，新增 7 条评分项。
- 新增 4 张机会卡：专业服务AI工作流平台、临床影像AI辅助诊断平台、企业数据智能体控制平面、中小商家AI营销对话平台。
- 更新趋势总表，新增/补强专业服务AI、医疗AI、企业数据/RAG、AI Agent、AI治理、AI客服、AI营销等趋势。
- 修正 Priority Engine 机会匹配规则，确保 05-03 新评分项能稳定进入对应机会卡。
- 已同步网站数据：29 Signals / 33 Priority Rows / 13 Trends / 27 Opportunities。
- 关系检查硬错误为 0，重复 URL / opportunity_id / slug 均为 0。

报告文件：

- `agent-workflow/reports/daily-radar-rerun-2026-05-03.md`

## 2026-05-03 机会拆解补齐与自动化任务修复

完成事项：

- 已为 `01-Signals/2026-05-03-AI商业雷达.md` 的 7 条 Signal 补齐 `机会拆解（6点｜必须详细拆解）`。
- 每条 Signal 均包含 6 个固定模块：解决问题、目标客户、替代/优化流程、商业模式、关注理由、中国市场迁移。
- 已更新 `每日观澜AI商业雷达` 自动化任务说明，将机会拆解写入硬性生成与验收条件。
- 已重新同步网站数据，05-03 的 7 条 Signal 在网站数据中均解析出 6 个机会拆解模块。
- 已运行关系检查，硬错误为 0。

报告文件：

- `agent-workflow/reports/opportunity-breakdown-fix-2026-05-03.md`

## 2026-05-03 会员模块验收与 Admin 独立任务拆分

已按 PM / QA 口径完成会员模块与普通/Admin 权限边界验收。

验收通过项：

- 未登录首页显示注册和登录入口。
- 未登录访问受限内容时显示注册 / 登录提示。
- 注册页包含密码和确认密码字段。
- 注册成功后进入账户页，并显示阅读权限有效期。
- 权限有效用户可以访问受限栏目。
- 登录页使用邮箱 + 密码。
- 错误密码会被拒绝，正确密码可登录。
- 阅读权限到期后访问受限栏目会提示续订。
- Admin 本机授权可访问受限栏目。
- 普通 URL 不显示页面编辑工具。
- 显式 `?admin=1` 编辑 URL 显示编辑工具。
- 普通页面未发现申请访问、审批、访问状态、JSON、同步、页面编辑等后台痕迹。

本轮 PM 决策：

- 会员模块继续聚焦普通用户注册、登录、账户、订阅、购买和阅读权限。
- Admin 后台从会员模块中拆出，作为独立后续开发任务。
- Admin 后续需要独立优化功能、设计、页面结构、操作文案和管理效率。

新增 / 更新文件：

- `agent-workflow/reports/membership-admin-boundary-acceptance-2026-05-03.md`
- `agent-workflow/prd/active/PRD-007-admin-console.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/execution/pm-next-sprint-2026-05-02.md`

## 2026-05-03 The Point 栏目 PM 立项

用户提出新增栏目 `The Point`：展示每日一线 AI 创造者观点，简要解读，评出每日 Top10，按日期观察长期热度，并融合进 Daily Brief、Trends、Opportunities 和首页 Decision Brief。

已完成：

- 安装第三方 skill：`follow-builders`。
- 安装位置：`C:\Users\86186\.codex\skills\follow-builders`。
- 已安装脚本依赖：`npm install`。
- 已读取 skill 说明、默认来源、示例 digest 和 `prepare-digest.js`。
- 已确认默认来源包括 25 位 X / Twitter 一线 AI 创造者、6 个 AI 播客、2 个官方博客来源。

PM 输出：

- 新增 `product/the-point-model.md`：定义 The Point 观点层、数据字段、评分算法、长期热度、跨栏目融合。
- 新增 `prd/active/PRD-008-the-point.md`：定义 The Point 栏目需求、页面规划、算法需求、权限边界和验收标准。
- 新增 `execution/the-point-sprint-2026-05-03.md`：定义 P0/P1/P2 开发批次和需要用户确认的问题。
- 更新 `feature_list.json`，新增 `GL-M2-005 The Point 一线观点栏目`。

当前状态：

- 仅完成 PM 立项和需求文档。
- 尚未进入 Data / UI / Copy / Dev 开发。
- 已确认 The Point 进入前台一级导航，位置在 `Signals` 之后。
- 已确认需要补充 The Point 详情页开发需求。
- 已确认 The Point 需要成为每日自动更新任务：每日 08:30，先写入 `05-Point/YYYY-MM-DD-The-Point.md`。
- 已根据用户补充要求调整：The Point 不单独触发网站同步，而是等待商业雷达统一同步流程一起入站，避免自动化任务冲突。
- 已新增 `execution/the-point-daily-automation-2026-05-03.md`，作为后续 Workflow / Dev 实现依据。
- 用户已确认开始开发 The Point 模块。
- PM Agent 已完成长期 Agent 分派，不创建临时 Agent。
- 默认显示名为 `The Point`，第一版先使用 follow-builders 默认来源。
- Daily Brief 中 The Point 放在“今日判断”之后。
- 首页 Decision Brief 用 The Point 替代原趋势线索。

## 2026-05-03 The Point 开发分派

已按长期 Agent 规则完成 GL-M2-005 开发任务分派，新增总控任务：

- `agent-workflow/execution/task-GL-M2-005-the-point-agent-dispatch.md`

分派结果：

- Data Agent：定义 `Point`、`pointTopics`、Top10 算法、Markdown schema 与关联字段。
- Workflow Agent：设计每日 08:30 自动任务，只写入 `05-Point/`，不直接同步网站。
- UI/UE Agent：设计 The Point 栏目页、每日集合页、详情页、首页 Decision Brief 模块和 Daily Brief 模块。
- Copy Agent：输出栏目、详情页、首页和 Daily Brief 文案，遵守观点边界和禁用词。
- Dev Agent：接入内容路径、同步解析、导航、栏目页、每日集合页、详情页和跨栏目渲染。
- QA Agent：验收导航、权限边界、自动化冲突、移动端可读性、文案边界和关系断链。

已同步更新：

- `agent-workflow/execution/the-point-sprint-2026-05-03.md`
- `agent-workflow/feature_list.json`

## 2026-05-03 The Point P0 开发骨架

已进入 Dev Agent P0 开发，并完成 The Point 最小可运行链路：

- `05-Point/` 内容目录与样例 Markdown。
- `sync-data.mjs` 解析 The Point，并输出 `points` / `pointTopics`。
- 前台导航新增 The Point，位于 Signals 之后。
- 新增 `the-point.html` 栏目页、`point-daily.html` 每日集合页与 `point.html` 详情页。
- 首页 Decision Brief 使用 The Point 替代原趋势线索。
- Daily Brief 列表与详情页接入 The Point。
- `check-relations.mjs` 纳入 Point 关系检查。

验证结果：

- 同步结果：29 Signals / 33 Priority Rows / 13 Trends / 2 Points / 27 Opportunities。
- 关系检查硬错误：0。

报告：

- `agent-workflow/reports/the-point-dev-p0-2026-05-03.md`

## 2026-05-03 The Point 文案与 UI 验收

Copy Agent / UI-UE Agent 已按 `COPY.md` 和 `DESIGN.md` 对 The Point 页面与文字做专项检查。

完成修正：

- 页面主标题改为“一线 AI 创造者观点”。
- 公开页旧列表称谓改为“全部一线观点”。
- 卡片和详情页以“原文摘录”为主，观澜评论保持简洁。
- 来源统一为“查看原文”文字链接，不展示裸 URL。
- 空状态去掉“同步 Markdown”等内部流程词。

验收记录：

- `agent-workflow/reports/the-point-copy-ui-acceptance-2026-05-03.md`

追加修正：

- The Point 改为三层结构：栏目页 / 每日集合页 / 详情页。
- 新增 `04-Site/point-daily.html`。
- 栏目页 `the-point.html` 只展示日期入口和长期热度。
- 每日集合页展示当日 Top10 与全部一线观点。
- 首页与 Daily Brief 中旧版直译替换为“一线观点”。

## 2026-05-03 The Point 素材层修正

根据用户反馈，确认 `follow-builders` 原始输出中 YouTube 包含完整 transcript、Blog 包含 content；此前 The Point MD 和网站只展示观点摘片，不能满足“站内阅读 + Obsidian 长期沉淀”需求。

已完成：

- 新增 `05-Point/sources/2026-05-03/` 站内素材笔记层。
- 新增 YouTube 素材笔记：`youtube-no-priors-baseten.md`。
- 新增 Claude Blog 素材笔记：`blog-claude-managed-agents-memory.md`。
- `Point` 支持 `素材笔记` 字段，网站数据新增 `pointSources`。
- 新增 `04-Site/point-source.html` 站内素材阅读页。
- 人物详情页中，同一人物多条观点会分别展示对应的“站内阅读”和“查看原文”链接。
- YouTube 字段从 `原文全文` 调整为 `原始发言段`，Blog 字段从 `原文全文` 调整为 `原始段落`，避免把选段误标为全文。
- `agent-workflow/product/the-point-model.md` 已补充 X / Podcast / Blog 的原文入库规则。

验证结果：

- `node --check 04-Site/js/app.js` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- 同步结果：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 2 Point Sources / 27 Opportunities。
- 关系检查硬错误：0。

追加修正：

- `pointSources` 增加 `全文文档`、`全文译文`、`来源与版权` 字段。
- `point-source.html` 素材页优先展示全文文档；没有全文文档时才回退到摘要、结构和高价值原文段。
- 新增 `agent-workflow/tools/import-point-source-fulltext.mjs`，用于把已授权或自有导出的全文写入对应素材 MD，再统一同步到网站。
- The Point 规范补充：YouTube / Blog 的时间戳只作为定位辅助，不作为主要阅读结构。

页面同步优化：

- 已重新运行 `04-Site/scripts/sync-data.mjs`。
- `point-source.html` 素材页优化为长文阅读版：正文收窄、行距增大、来源与版权弱化处理、全文译文独立阅读块。
- 侧栏新增“素材状态”，区分“全文已入库”和“结构化阅读”。
- 本地访问检查通过：YouTube 素材页和 Blog 素材页均返回 200。

追加清理：

- 已统一清理 Point 展示文本中的 YouTube speaker/timecode 标记。
- 已统一清理 Point 展示文本和同步数据中的 `https://t.co/...` X 短链。
- 当前 `05-Point/2026-05-03-The-Point.md`、YouTube 素材笔记和 `04-Site/data/radar-data.json` 中已无 `Speaker 3 |`、`t.co/` 残留。

## 2026-05-03 本轮结束交接

按 `AGENTS.md` 与长期 `agent-workflow` 规则，本轮已更新交接中心：

- `docs/agent-handoff.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/reports/the-point-handoff-2026-05-03.md`

当前状态：

- The Point 已完成 P0/P1 级别可运行链路：栏目页、每日集合页、人物详情页、素材阅读页、首页/Daily/Signals 引用。
- 数据同步结果：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 2 Point Sources / 27 Opportunities。
- 关系检查硬错误：0。
- Point 展示正文已清理 YouTube speaker/timecode 与 X `t.co` 短链。
- 站内素材页支持 `全文文档` / `全文译文`，但第三方 Blog / YouTube 全文入库仍需确认内容来源与授权边界。

仍未完成：

- The Point 每日 08:30 自动化任务尚未完全落地。
- The Point 仍需浏览器截图验收，覆盖首页、栏目页、每日页、人物详情页、素材页、Daily Brief、Signals 卡片和移动端。
- The Point 需要新增专门质量检查脚本或检查项：同人合并、来源去重、译文完整性、短链清理、speaker/timecode 清理、素材字段完整性。
- 会员/Admin 权限边界仍需完整 QA。
- 项目目录仍非 git 仓库，正式云端部署前需要版本管理、备份、回滚方案。

下一步建议：

1. QA Agent 先按截图验收 The Point 所有入口，确认无短链、无时间戳、无重复原文、无文案冗余。
2. Workflow / Dev Agent 落地 The Point 自动化任务，与商业雷达统一同步机制协调。
3. Data Agent 增加 The Point 数据质量检查，运行在 `sync-data.mjs` 之后。
4. UI/UE Agent 用真实长文样本继续优化 `point-source.html` 的移动端阅读体验。
5. Copy Agent 检查 The Point 全站入口文字，保持“人 + 原话 + 简洁解读”的规范。

## 2026-05-03 The Point 质量检查开发

已按长期 agent-workflow 执行 Data / Dev 任务，未创建临时 agent。

完成事项：

- 新增 `04-Site/scripts/check-point-quality.mjs`，用于检查 The Point 观点字段、素材笔记、短链清理、speaker/timecode 清理、译文完整性、素材授权说明和同源多观点状态。
- 自动输出 `agent-workflow/reports/the-point-quality-check-latest.md` 与按日期命名的质量检查报告。
- 为 Point 5、Point 8、Point 24 补齐站内素材笔记。
- 新增 `05-Point/sources/2026-05-03/blog-anthropic-april-23-postmortem.md`。
- 新增 `05-Point/sources/2026-05-03/blog-claude-connectors-everyday-life.md`。
- 为 Point 23 补齐机会关联，使 Point -> Opportunity 覆盖达到 24/24。
- 调整检查规则：同一原文链接若共享同一素材笔记，记为“同源多观点”备注，不作为软提醒。

验证结果：

- `node --check 04-Site/scripts/check-point-quality.mjs` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过，同步结果为 29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 4 Point Sources / 27 Opportunities。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 23。
- `node 04-Site/scripts/check-point-quality.mjs` 通过，硬错误 0，软提醒 0。

报告：

- `agent-workflow/reports/the-point-quality-check-implementation-2026-05-03.md`
- `agent-workflow/reports/the-point-quality-check-latest.md`

## 2026-05-03 The Point 浏览器 QA 与移动端修正

已按长期 agent-workflow 执行 QA / UI-UE / Dev 任务，未创建临时 agent。

完成事项：

- 新增 `agent-workflow/tools/the-point-browser-qa.mjs`，用于自动化检查 The Point 全入口的桌面端和移动端展示。
- QA 覆盖首页、The Point 栏目页、每日集合页、人物详情页、素材页、Daily Brief 列表页、Daily Brief 详情页和 Signals 页面。
- 自动生成 16 张截图，保存到 `agent-workflow/reports/screenshots/the-point-qa-2026-05-03/`。
- 自动生成 `agent-workflow/reports/the-point-browser-qa-2026-05-03.md`。
- 修复 Signals 移动端未折叠为单列的问题。
- 修复 Daily Brief 详情页移动端仍按桌面两栏排版的问题。
- 为 Daily Detail / Signals 增加最终响应式护栏，避免后置 CSS 覆盖移动端断点。

验证结果：

- `node --check 04-Site/js/app.js` 通过。
- `node --check agent-workflow/tools/the-point-browser-qa.mjs` 通过。
- `node agent-workflow/tools/the-point-browser-qa.mjs` 通过。
- 浏览器 QA 最终结果：8 个页面 x 2 个视口全部通过，需复核项 0。
- 未发现 X `t.co` 短链、YouTube speaker/timecode、后台流程词、横向滚动或明显文本越出视口。

报告：

- `agent-workflow/reports/the-point-browser-qa-implementation-2026-05-03.md`
- `agent-workflow/reports/the-point-browser-qa-2026-05-03.md`

## 2026-05-03 项目临时文件清理

已按用户要求清理项目中的临时截图、临时 feed 缓存、一次性回填脚本和旧备份目录，确保不影响网站运行。

已删除：

- `04-Site/` 根目录下 22 个页面验收截图 PNG。
- `agent-workflow/tmp-feed-x.json`
- `agent-workflow/tmp-feed-podcasts.json`
- `agent-workflow/tmp-feed-blogs.json`
- `agent-workflow/tmp-follow-builders-feed.json`
- `agent-workflow/tools/update-point-originals-2026-05-03.mjs`
- `09-backup/`
- `codex-recovery-backups/`

已保留：

- `04-Site/assets/` 下正式站点资产，包括 `home-hero-radar.png`、`brand-lockup.png`、`logo.svg`。
- `agent-workflow/tools/import-point-source-fulltext.mjs`，这是后续全文导入工具，不是临时文件。

同步修正：

- 已从 `05-Point/2026-05-03-The-Point.md` frontmatter 移除临时 `source_reports` 引用，避免指向已删除的 `tmp-feed-*` 文件。

验证结果：

- 未发现对已删除截图、缓存和备份目录的残留文本引用。
- `node --check 04-Site/js/app.js` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check agent-workflow/tools/import-point-source-fulltext.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 硬错误为 0。
- 本次清理约释放 22.23 MB。

## 2026-05-03 Intelligence Data Agent 升级

已按用户确认，在不改变当前 8 个长期 agent 结构的前提下，将原 `Data Agent` 升级为 `Intelligence Data Agent`。

本轮完成：

- 更新 `agent-workflow/agents/data-agent.md`，将岗位从字段、标签、质量报告维护者升级为判断资产建模负责人。
- 更新 `agent-workflow/agents/agent-registry.json`，保留 `data-agent` id，名称改为 `Intelligence Data Agent`。
- 新增 `agent-workflow/execution/intelligence-data-agent-upgrade-2026-05-03.md`，定义 P0/P1/P2 任务分派。
- 更新 `agent-workflow/feature_list.json`，新增 `GL-M3-006 Data Agent 升级为 Intelligence Data Agent`。

升级后的职责范围：

- Signal Intelligence：Signal 标准、Signal Score、来源分层、关键词质量、去重规则。
- Trend Intelligence：趋势状态、证据阶梯、机会温度、反证清单。
- Opportunity Intelligence：机会方向、Priority Engine 评分、证据等级、代表案例、验证动作。
- The Point Intelligence：人物、观点、素材来源、原文/译文、观点热度、关系归属。
- Relation Intelligence：Signal / Priority / Trend / Opportunity / Point 的证据网络。
- Quality Intelligence：字段、证据、来源、关系、标签和内容质量检查。

当前分派的 P0 任务：

1. 关系软提醒收口，优先处理 `Priority -> Signal`、`Signal -> Trend`、`Trend -> Signal`、`Opportunity -> Priority`。
2. The Point Intelligence 质量规则固化，覆盖同人多观点、来源去重、素材笔记、原文/译文完整性、短链清理、speaker/timecode 清理和授权说明。
3. 输出 `agent-workflow/product/intelligence-data-model.md`，统一 Signal / Trend / Opportunity / Point 的最小合格标准。

验证：

- `agent-workflow/feature_list.json` 已新增正式任务。
- 后续 Data Agent 工作应按 Intelligence Data Agent 岗位说明执行。

## 2026-05-03 多 Agent Operating System 治理机制建立

基于用户要求，已按《执行摘要》中 Claude Code 工作流启发，为观澜AI建立多 agent 长期治理机制。

先建立 1-3：

- `agent-workflow/governance/agent-memory.md`：观澜AI长期 agent 记忆库，记录已确认规则、反复错误、禁用表达、质量边界和自动化经验。
- `agent-workflow/governance/plan-first-policy.md`：重大任务先计划再执行，明确哪些任务必须先由 Strategy / PM 输出计划。
- `agent-workflow/governance/quality-gates.md`：内容、页面、自动化、数据模型、开发和发布前的质量闸门。

随后建立 4-6：

- `agent-workflow/governance/automation-fallback-policy.md`：自动化失败、部分失败和阻塞失败的降级策略。
- `agent-workflow/governance/agent-handoff-template.md`：长期 agent 阶段性交接模板。
- `agent-workflow/governance/intelligence-model-calibration.md`：每月一次的数据智能校准机制，复盘 Signal、The Point、Trend、Opportunity 的判断质量。

同步更新：

- `agent-workflow/feature_list.json` 新增 `GL-M3-007 建立多 Agent Operating System 治理机制`。

后续执行要求：

- 新增栏目、改权限、改数据模型、改自动化、云端部署等重大任务必须先走 Plan-first。
- 每次任务结束必须说明通过了哪些 Quality Gates。
- 可复用经验要写入 Agent Memory。
- 自动化失败必须按 fallback policy 写清失败原因、降级路径和是否影响前台。
- 每个阶段性交付建议按 handoff template 写入 reports 或 docs/agent-handoff。
- Intelligence Data Agent 每月应按 calibration 机制输出数据智能校准报告。

## 2026-05-03 Agent Operating System 1-4 落地

根据用户要求，已先执行下一步优化中的 1-4。

完成事项：

1. 建立 `agent-workflow/governance/README.md`，作为 Agent Operating System 总入口，串联长期调度、Agent Memory、Plan-first、Quality Gates、自动化降级、交接模板和月度校准。
2. 更新 `AGENTS.md`：
   - 前台导航更新为：首页 / Daily Brief / Signals / The Point / Opportunities / Trends。
   - Data Agent 更新为 Intelligence Data Agent。
   - 新会话启动必读新增 governance README、Agent Memory、Plan-first、Quality Gates、Automation Fallback。
   - 新增重大任务 Plan-first、完成后 Quality Gates、自动化影响检查等规则。
3. 新增 `agent-workflow/execution/PLAN-template.md`，作为新增栏目、权限、数据模型、自动化、云端部署等重大任务的计划模板。
4. 新增 `agent-workflow/tools/run-quality-gates.mjs`，作为质量闸门统一脚本入口。

验证：

- `node --check agent-workflow/tools/run-quality-gates.mjs` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 已生成 `agent-workflow/reports/quality-gates-syntax-latest.md`。

自动化影响：

- 本轮未修改 `ai-the-point`、`ai-2`、`ai-3` 的定时任务口径。
- `run-quality-gates.mjs automation` 默认只检查统一同步闸门脚本语法；真实运行 `unified-site-sync.mjs` 必须显式传入 `--run-sync-gate`。

## 2026-05-03 Agent Operating System 5-9 落地

根据用户要求，已继续执行 5-8，并新增任务 9：由 Intelligence Data Agent 解决 Tags 膨胀问题。

完成事项：

1. 新增 `agent-workflow/reports/automation-first-run-2026-05-04.md`，由于 2026-05-04 自动化真实运行尚未发生，当前状态为 `pending_first_run`，报告中定义了 09:35 后的验收步骤、通过标准和阻塞标准。
2. 新增 `agent-workflow/reports/opportunity-priority-gap-review-2026-05-03.md`，评审 5 张无 Priority 评分证据的早期 Opportunity，结论是不为清零硬绑评分，分别给出 watch、合并候选、补评分或保留观察建议。
3. 新增 `agent-workflow/product/source-intelligence.md`，建立来源、关键词和 Builder 池治理模型。
4. 新增 `agent-workflow/product/commercial-operating-model.md`，定义会员制、试读、newsletter、样例内容、企业版和续订路径。
5. 新增 `agent-workflow/product/tag-taxonomy.md`，将 Tags 从随手标注升级为可搜索、可筛选、可关系网络化的判断资产。
6. 新增 `agent-workflow/reports/automation-impact-review-2026-05-03.md`，明确 source/tag 规则影响三段式自动化。
7. 已通过 Codex 自动化接口更新 `ai-the-point`、`ai-2`、`ai-3`：
   - `ai-the-point` 读取 `source-intelligence.md` 和 `tag-taxonomy.md`，Point 至少使用 point / track / source 三类标签。
   - `ai-2` 读取来源治理和标签字典，Signal / Opportunity / Trend 按标签分层生成，不再只写 `AI创业机会`。
   - `ai-3` 读取标签与来源模型，未知标签作为软提醒或 `needs_tag_review`，不作为硬错误。
8. 已更新 `AGENTS.md`，数据智能读取规范纳入 `source-intelligence.md` 和 `tag-taxonomy.md`。

验证：

- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- `feature_list.json` 和 `agent-registry.json` JSON 解析通过。
- 自动化 TOML 中已确认包含 `source-intelligence`、`tag-taxonomy` 和 `needs_tag_review` 等新口径。

自动化影响：

- 本轮确实影响 `ai-the-point`、`ai-2`、`ai-3` 的读取文件和生成规则，因此已更新三条自动化任务。
- 三段式边界未改变：The Point 和商业雷达只写 Markdown，统一入站仍由 `ai-3` 执行。
- 旧自动化 `ai` 仍为 `PAUSED`，本轮未更新。

## 2026-05-03 The Point 每日自动化落地

已按长期 agent-workflow 执行 Workflow / Automation / Dev 任务，未创建临时 agent。

完成事项：

- 创建 Codex cron automation：`观澜AI The Point 每日观点生成`。
- 自动化 ID：`ai-the-point`。
- 计划时间：每日 08:30，按当前项目环境 Asia/Shanghai 理解。
- 运行目录固定为 `C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight`。
- 自动化只生成 `05-Point/YYYY-MM-DD-The-Point.md`、必要的 `05-Point/sources/YYYY-MM-DD/` 素材笔记、运行日志和运行报告。
- 自动化明确不得运行网站同步、不得运行关系检查、不得直接写入 `04-Site/data/radar-data.json` 或 `radar-data.js`。
- The Point 生成后的状态设为 `pending_unified_sync`，等待商业雷达统一同步流程入站。
- 已确认 `follow-builders` 技能目录存在，可作为自动化素材准备来源。

报告：

- `agent-workflow/reports/the-point-automation-setup-2026-05-03.md`

## 2026-05-03 每日自动化协调与同步防护

已按用户要求补强 AI 商业雷达与 The Point 两个内容自动化任务的协同关系，并新增统一网站同步闸门。

完成事项：

- 新增 `agent-workflow/tools/unified-site-sync.mjs`。
- 更新 The Point 自动化 `ai-the-point`：只生成 The Point Markdown，不运行网站同步。
- 新建 AI 商业雷达内容生成自动化 `ai-2`：只生成 Signals、Scoring、Trends、Opportunities Markdown，不运行网站同步。
- 新建统一网站同步闸门自动化 `ai-3`：每日 09:30 检查内容就绪后，统一备份、同步和质量检查。
- 同步闸门会检查当天 AI商业雷达、AI机会评分、The Point 三类 Markdown；任何缺失、空跑、失败、待补充、`needs_review` 或字段不完整都会阻止同步。
- 同步前备份 `04-Site/data/radar-data.json` 和 `04-Site/data/radar-data.js`；同步后关系检查或 The Point 质量检查失败会恢复备份。

验证结果：

- `node --check agent-workflow/tools/unified-site-sync.mjs` 通过。
- `node agent-workflow/tools/unified-site-sync.mjs --date=2026-05-03` 最终通过。
- 内容就绪检查：7 Signals / 7 Scoring Rows / 24 Points。
- 网站同步结果：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 4 Point Sources / 27 Opportunities。
- 关系检查硬错误：0。
- The Point 质量检查硬错误：0。

报告：

- `agent-workflow/execution/daily-automation-coordination-2026-05-03.md`
- `agent-workflow/reports/daily-automation-coordination-2026-05-03.md`
- `agent-workflow/reports/unified-site-sync-2026-05-03.md`

## 2026-05-03 Intelligence Data Agent P0 执行

已按升级后的 Intelligence Data Agent 执行用户指定的三项 P0 任务。

完成事项：

- 关系软提醒收口：
  - 更新 `04-Site/scripts/sync-data.mjs`，补充跨日期同产品/代表案例回链原始 Signal 的规则。
  - 更新 Trend 吸收 Signal 的规则：除赛道别名外，参考评分项和趋势具体产品证据。
  - 关系软提醒从 23 降至 5。
  - `Priority -> Signal` 从 29/33 提升到 33/33。
  - `Signal -> Trend` 从 19/29 提升到 29/29。
  - `Trend -> Signal` 从 9/13 提升到 13/13。
- The Point 质量规则固化：
  - 更新 `04-Site/scripts/check-point-quality.mjs`，在报告中输出固化规则。
  - 固化来源去重、同人多观点、素材笔记、原文/译文完整性、短链和 timecode 清理、授权说明。
  - 当前 The Point 质量检查硬错误 0、软提醒 0。
- 统一判断资产模型：
  - 新增 `agent-workflow/product/intelligence-data-model.md`。
  - 统一 Signal / Priority / Trend / Opportunity / Point 的入库、关系和质量标准。

保留结论：

- 剩余 5 条软提醒均为早期 Opportunity 暂无 Priority 评分证据。
- 按 Intelligence Data Agent 规则，不为清零而硬绑评分；已分别给出观察、合并或后续补评分建议。

验证结果：

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/scripts/check-point-quality.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 5。
- `node 04-Site/scripts/check-point-quality.mjs` 通过，硬错误 0，软提醒 0。
- `agent-workflow/feature_list.json` 解析通过。

报告：

- `agent-workflow/reports/intelligence-data-relation-review-2026-05-03.md`
- `agent-workflow/reports/intelligence-data-point-rules-2026-05-03.md`
- `agent-workflow/product/intelligence-data-model.md`

## 2026-05-03 自动化任务同步更新

根据 Intelligence Data Agent 的规则调整，已同步更新三个长期自动化任务：

- `ai-the-point`：新增读取 `intelligence-data-model.md` 与 The Point 规则报告；生成时必须遵守来源去重、同人多观点、素材笔记、原文/译文完整性、短链/timecode 清理和授权说明。
- `ai-2`：新增读取 `intelligence-data-model.md`；生成商业雷达时必须遵守统一判断资产标准，且早期 Opportunity 暂无评分证据时不得为清零强行绑定。
- `ai-3`：新增读取 `intelligence-data-model.md`；同步闸门报告需要关注关系检查硬错误、软提醒数量，以及 Priority -> Signal / Signal -> Trend / Trend -> Signal 覆盖基线。

同时已更新 `AGENTS.md` 和 `docs/agent-handoff.md`：

- 后续任何影响 Markdown 结构、数据字段、同步脚本、质量检查、入站顺序或发布闸门的操作，都必须先提示可能影响自动化任务。
- 若改动不影响自动化，也应在最终回复中说明未影响自动化任务。

## 2026-05-03 Tag Taxonomy 源文件与网站公开标签治理

已按 Intelligence Data Agent 规则完成原始 Markdown 与网站公开 tags 治理。

完成事项：
- 批量整理 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-Point/`、`07-Opportunities/` 的 frontmatter tags。
- 将 `AI创业机会`、`AI-Agent`、`AI编程`、`AI-Coding`、`AI增长`、`Voice-AI`、`企业数据`、`企业知识库` 等泛标签或别名归并到正式标签。
- 新增 `agent-workflow/tools/normalize-source-tags.mjs`，用于后续复跑源文件标签归并。
- 新增 `04-Site/scripts/check-tags.mjs`，输出 `agent-workflow/reports/tag-quality-check-latest.md`。
- 更新 `04-Site/scripts/sync-data.mjs`：公开 `tags` 只允许正式字典标签进入；详细行业、能力、动作、产品词保留在 `taxonomy` 中用于关系匹配。
- 更新 `agent-workflow/tools/unified-site-sync.mjs`：统一网站同步闸门纳入 `check-tags.mjs`。
- 更新 `ai-the-point`、`ai-2`、`ai-3` 三个自动化任务，纳入正式标签字典与 tag 检查要求。

验证结果：
- 网站公开 tags 收敛为 46 个正式标签。
- `check-tags.mjs`：禁用别名 0，未知公开标签 0。
- 统一同步闸门 `node agent-workflow/tools/unified-site-sync.mjs --date=2026-05-03` 通过。
- 关系检查硬错误 0，保留 10 条早期 Opportunity 暂无评分证据软提醒。
- The Point 质量检查硬错误 0，保留 3 条 Point -> Trend 软提醒。

报告：`agent-workflow/reports/tag-taxonomy-source-cleanup-2026-05-03.md`

## 2026-05-03 Signal 事件类型标准化

按 Intelligence Data Agent 口径，已将 Daily Brief `变化类型` 的底层来源从混写 `newsType` 收敛为标准 Signal 主事件类型。

完成事项：
- 批量整理 `01-Signals/*.md` 中全部 `新闻类型` 字段，只保留一个主事件类型。
- 标准事件类型限定为：融资、客户采用、收入验证、产品发布、监管/政策、采购/招标、并购整合、平台数据。
- 更新 `04-Site/scripts/sync-data.mjs`，生成标准 `eventTypes` 字段，并避免把标签归一逻辑误用于事件类型。
- 更新 `04-Site/js/app.js`，Daily Brief `变化类型` 只展示标准事件类型汇总。
- 更新 `agent-workflow/product/intelligence-data-model.md` 与报告 `agent-workflow/reports/intelligence-data-event-type-normalization-2026-05-03.md`。
- 已更新自动化 `ai-2` 与 `ai-3`；`ai-the-point` 不受影响。

验证：
- Markdown 源文件事件类型检查全部为标准值。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0。
- `node 04-Site/scripts/check-tags.mjs` 通过，forbidden alias 0，unknown public tag 0。
## 2026-05-03 Signals 首页改版任务分配

已按 PM Agent 视角将 Signals 首页改版推进为 active PRD 与执行任务单，未创建临时 agent。

新增文件：
- `agent-workflow/prd/active/PRD-007-signals-homepage-redesign.md`
- `agent-workflow/execution/signals-homepage-redesign-2026-05-03.md`

本轮分配：
- UI / UE Agent：负责证据雷达页布局、日期分组、筛选区、Signal 卡片、详情预览和移动端行为。
- Copy Agent：负责页面标题、指标标签、筛选标签、卡片字段、详情模块、来源入口和空状态文案。

设计参考：
- `frontend-design + Bloomberg/FT 内参式阅读 + Linear 信息密度`

当前边界：
- P0 只做前台价值表达和筛选体验。
- 不新增 Markdown 必填字段。
- 不修改同步脚本入口。
- 不改变 `ai-the-point`、`ai-2`、`ai-3` 三个自动化任务。
## 2026-05-03 Signals 首页二次优化方案

在新增 `04-Site/signal.html` 独立详情页后，PM Agent 与 UI / UE Agent 已重新定义 Signals 首页职责：栏目首页负责雷达筛选、日期复盘和进入详情，独立详情页负责完整来源、事实与信号脉络阅读。

新增方案报告：
- `agent-workflow/reports/pm-ue-signals-homepage-second-optimization-2026-05-03.md`

核心建议：
- 首页卡片瘦身为判断入口卡片。
- 右侧从完整详情预览改为当前视图摘要 + 选中 Signal 简短预览。
- 日期组头增强为当日小结。
- 所有 Signal 阅读入口统一进入 `signal.html?slug=...`。

自动化影响：本方案只涉及前台结构和跳转，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 独立详情页边界落地

已按用户确认修正：Signal 详情页是独立页面，Signals 栏目首页不再承担完整详情阅读。

完成事项：
- `04-Site/signals.html` 保持为 Signals 雷达首页：日期分组、筛选、顶部指标、紧凑 Signal 卡片、右侧当前视图摘要和选中 Signal 简短预览。
- `04-Site/signal.html` 作为独立详情页：展示完整证据、原始来源链接、机会拆解、评分依据、关联 Opportunity / Trend 和相关 Signals。
- `04-Site/js/app.js` 已清理 Signals 渲染边界：所有卡片与预览 CTA 均跳转 `signal.html?slug=...`，首页右侧不再渲染完整详情正文。
- `04-Site/css/styles.css` 补充首页雷达与独立详情页样式，并修正变化类型分布按钮的交互状态。
- `agent-workflow/feature_list.json` 中 `GL-M3-010` 已进入 `verify`。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 4 Point Sources / 27 Opportunities。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过：46 个公开标签，禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：Signals 首页桌面/移动端无横向溢出，29 张卡片、29 个独立详情跳转；Signal 详情页桌面/移动端无横向溢出，来源链接与 4 个详情模块正常渲染。

截图记录：
- `agent-workflow/reports/signals-independent-homepage-desktop-2026-05-03.png`
- `agent-workflow/reports/signals-independent-homepage-mobile-2026-05-03.png`
- `agent-workflow/reports/signal-independent-detail-desktop-2026-05-03.png`
- `agent-workflow/reports/signal-independent-detail-mobile-2026-05-03.png`

自动化影响：本轮只调整前台 HTML/CSS/JS 展示和跳转，不改变 Markdown 模板、同步脚本入口、数据字段、质量闸门或自动化顺序，因此不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 首页右栏与详情页排版修正

根据用户反馈，已继续收敛 Signals 首页右侧和 Signal 独立详情页的信息密度。

修正事项：
- Signals 首页右侧删除 `Radar View`、`这页只做筛选和判断入口` 等内部话术。
- 右侧改为客户可理解的“当前筛选”摘要：信号数、多信源、已连到机会/趋势、仍需观察、变化类型 chips。
- 删除右侧大四宫格指标和重复证据条，降低占位。
- Signal 详情页从“大卡片堆叠”改为研究笔记式阅读结构。
- 顶部判断区改为紧凑导语，不再用大面积深色块承载长摘要。
- “为什么这是 Signal”改成事实 / 含义两条紧凑判断，不再使用大卡片。
- “机会拆解”和“评分依据”改为分隔线条目，减少边框、阴影和大留白。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/check-tags.mjs` 通过：46 个公开标签，禁用别名 0，未知公开标签 0。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：Signals 首页和 Signal 详情页桌面 / 移动端无横向溢出；详情页主内容不再使用巨型卡片，`analysis-card` 在 Signal 详情页中为 0。

截图记录：
- `agent-workflow/reports/signals-compact-panel-desktop-2026-05-03.png`
- `agent-workflow/reports/signal-detail-editorial-desktop-2026-05-03.png`
- `agent-workflow/reports/signal-detail-editorial-mobile-2026-05-03.png`

自动化影响：本轮只修改前台 JS/CSS 展示层，不改变 Markdown、同步脚本入口、数据字段或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 双页面成品感重构

根据用户继续反馈“粗糙，两个页面都要改”，已对 Signals 首页与 Signal 详情页做第二轮 UI / Copy 联合重构。

重构方向：
- Signals 首页从“卡片墙 + 右侧小面板”改为“情报筛选台”。
- Signal 详情页从“正文 + 超长侧栏”改为“商业信号报告页”。

Signals 首页改动：
- 顶部指标从大卡片改为横向情报条。
- Signal 列表从双列卡片墙改为单列情报行，降低视觉噪音，增强扫读效率。
- 单条 Signal 改为：变化类型 / 标题 / 商业含义 / 机会与趋势连接 / 证据入口。
- 右侧改为深墨绿判断面板，文案从内部说明转为“本组信号”的外部表达。
- CTA 从“查看详情”收敛为“查看信号”。

Signal 详情页改动：
- 主内容收进一张克制的报告纸面，不再散落在页面底色上。
- 详情侧栏限制展示数量：Opportunity 前 5 个、Trend 前 3 条，避免侧栏压过正文。
- 侧栏关联卡改为紧凑列表，减少边框、阴影、重复卡片感。
- 评分、机会拆解、事实 / 含义继续保留，但排版更像研究报告条目。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过：禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：Signals 首页和 Signal 详情页桌面 / 移动端无横向溢出；Signals 首页 29 条 Signal 正常展示；详情页 Opportunity 侧栏限制为 5 条。

截图记录：
- `agent-workflow/reports/signals-polished-desktop-2026-05-03.png`
- `agent-workflow/reports/signals-polished-mobile-2026-05-03.png`
- `agent-workflow/reports/signal-detail-polished-desktop-2026-05-03.png`
- `agent-workflow/reports/signal-detail-polished-mobile-2026-05-03.png`

自动化影响：本轮只改前台展示与文案，不改变 Markdown 结构、同步脚本入口、数据字段、质量闸门或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 直达详情与短标题修正

根据用户反馈，继续修正 Signals 首页与 Signal 详情页：

- 移除 Signals 首页右侧“当前选中”预览栏。
- Signal 列表行整体变为详情页入口，左侧可直接点击进入 `signal.html`。
- Signal 行重新整理主次：标题为主，商业含义为辅，赛道、机会、趋势、来源降级为弱标签。
- Signal 详情页 H1 改为短判断标题，优先取冒号后的商业判断，不再把完整事件标题作为超大标题。
- 示例验证：`Legora 估值升至 56 亿美元：法律 AI 从工具试用进入专业服务工作流竞争` 在详情页 H1 中显示为 `法律 AI 进入专业服务工作流竞争`。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过：禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：Signals 首页右侧栏 `display: none`，29 条 Signal 行均可点击进入详情；桌面和移动端无横向溢出；详情页测试 H1 长度为 17。

截图记录：
- `agent-workflow/reports/signals-direct-list-desktop-2026-05-03.png`
- `agent-workflow/reports/signals-direct-list-mobile-2026-05-03.png`
- `agent-workflow/reports/signal-detail-short-title-desktop-2026-05-03.png`

自动化影响：本轮只改前台展示和标题派生逻辑，不改变 Markdown、同步脚本入口、数据字段或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signal 详情页新闻源展示修正

根据用户反馈，修正 Signal 详情页顶部主内容语义：

- 顶部主块改为展示新闻详情源 / 事件事实，而不是观澜判断。
- 新增 `signalNewsDetail()` 展示派生逻辑，优先取 `summary` 中 `补充:` 之前的原始事实段。
- 展示层会截断 `它的商业含义`、`其核心价值`、`核心商业意义`、`商业意义在于`、`这说明`、`这意味着` 之后的判断句，避免新闻源位置混入分析判断。
- 商业判断仍保留在后续“为什么这是 Signal / 商业含义”模块。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：测试页顶部新闻源段不再包含“商业含义”，无横向溢出。

截图记录：
- `agent-workflow/reports/signal-detail-news-source-top-2026-05-03.png`

自动化影响：本轮只改前台展示派生逻辑，不改变 Markdown、同步脚本入口、数据字段或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signal 详情页原始新闻内容扩展

根据用户反馈“详情页引用更多的原始新闻内容”，已扩展详情页新闻源展示。

完成事项：
- `signalNewsDetail()` 现在会合并 `summary` 中多个事实块，仍会剔除“商业含义 / 这意味着”等判断句。
- 顶部新闻源块新增来源、发布时间、事件类型 meta。
- 扩充 `01-Signals/2026-05-03-AI商业雷达.md` 中 Legora 的原始新闻事实，补充融资轮次、ARR、估值、客户、市场覆盖、Harvey 对比和区域扩张信息。
- 重新运行 `sync-data.mjs`，网站数据已同步。

验证结果：
- Legora 详情页顶部新闻源事实段从短句扩展为 309 字，且不包含“商业含义”。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过：禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

截图记录：
- `agent-workflow/reports/signal-detail-expanded-news-source-2026-05-04.png`

自动化影响：本轮调整了单条历史 Signal 的新闻内容简介，并同步网站数据；不改变 Markdown 模板、字段名、同步脚本入口、质量闸门或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signals 栏目标题一致性与关系清理

本轮处理两类用户反馈：Signals 栏目标题与其他栏目不一致；Signal 指向 Opportunity 存在多关联和语义错配。

UI / UE 完成事项：
- Signals 栏目标题区已与 Daily / Opportunities / Trends 对齐。
- 桌面端实测四个栏目 `.page-title` 坐标、高度、h1 字号、行高一致。
- Signals 标题背景保持透明，不再使用额外色块。

Intelligence Data Agent 完成事项：
- 定位到 `sync-data.mjs` 中 Signal -> Opportunity 的弱标签关联过宽。
- 清理前：29 条 Signals 每条都关联 8 个 Opportunity，总关系数 232。
- 清理后：29 条 Signals 每条只关联 1 个主 Opportunity，总关系数 29。
- 修正 ARI / Meta 具身智能并购 Signal 被错误匹配到“专业服务AI工作流平台”的问题。
- Signal -> Opportunity 改为优先使用 Priority Engine 直接命中的主机会；无评分项时才使用源 Markdown 显式机会。
- Opportunity -> Signal 反向关系改为只来自评分项或显式关系，不再靠弱标签补齐。

报告：
- `agent-workflow/reports/signal-opportunity-relation-cleanup-2026-05-04.md`

验证结果：
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过，禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器测量通过：Signals / Daily / Opportunities / Trends 标题位置与字号一致，无横向溢出。

截图记录：
- `agent-workflow/reports/signals-title-consistency-2026-05-04.png`

自动化影响：
- 标题样式调整不影响自动化。
- 关系清理修改了 `sync-data.mjs` 的关系生成规则，会影响 `ai-3` 统一同步后的关系结果。
- 已复核并更新自动化：`ai-the-point` 不受影响，保持不变；`ai-2` 已补充“每条 Signal 只写一个主 Opportunity”的内容生成规则；`ai-3` 已补充 Signal -> Opportunity 主机会闸门和前台数量一致性检查口径。
- `ai-3` 后续会得到更严格的 Signal / Opportunity 关系。Opportunity -> Signal 覆盖率从虚高状态降为 22/27，是更真实的软提醒状态。

追加确认：
- 已修正 `04-Site/js/app.js` 展示层的 `signalOpportunityLinks()`：当 Signal 存在规范 `relatedOpportunityIds` 时，栏目页和详情页只按该主机会 ID 计数；旧机会名称、反向关系和赛道关系不再把数量扩成 10/19/27。
- 已修正 `loadState()`：浏览器本地缓存中的旧 Signal-Opportunity 关系不得覆盖最新同步数据，避免用户页面继续显示旧数量。
- 页面实测通过：Signals 栏目页 29 张 Signal 卡片均显示 `1 个机会`；Signal 详情页“指向机会”为 `1 个`，侧栏机会卡为 1 张。
- 额外模拟本地缓存仍保存旧多机会关系的情况，页面仍显示 1 个机会。

## 2026-05-04 当前窗口收口与长期规范更新

用户准备结束当前窗口，本轮已完成 Workflow / Automation Agent 收口。

新增收口报告：
- `agent-workflow/reports/current-run-closeout-2026-05-04.md`

长期规范更新：
- `AGENTS.md`：新增 UI 标题一致性、成品感、公开文案克制和禁用内部话术的启动红线。
- `agent-workflow/agents/ui-ue-agent.md`：新增栏目标题一致性、标题背景、成品感、粗糙/简陋反馈处理规则。
- `agent-workflow/product/DESIGN.md`：新增栏目标题规范、成品感与精致度、Signals 栏目页主 Opportunity 口径。
- `agent-workflow/agents/copy-agent.md`：新增公开前台不得使用内部话术、不以说服为目标、Signals 用词推荐与禁用规则。
- `agent-workflow/product/COPY.md`：新增“不用内部话术，不以说服为目标”与 Signals 前台克制用词规范。

自动化复核：
- `ai-the-point` 不受影响，保持不变。
- `ai-2` 已更新：每日内容生成必须让每条 Signal 默认只写 1 个主 Opportunity。
- `ai-3` 已更新：统一同步闸门必须检查 Signal -> Opportunity 主机会口径，以及前台“指向机会”数量不得被旧缓存或宽关系放大。
- 旧 `ai` 自动化仍处于 `PAUSED`，未纳入当前三任务链路。

最新验证：
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过，46 unique tags，禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，6 项检查全部 passed。

## 2026-05-04 Handoff 文件 UTF-8 编码规则

根据用户要求，后续所有 handoff / 交接类 Markdown 文件统一保存为 UTF-8，避免新窗口或 Windows PowerShell 默认读取时出现中文乱码。

已更新：
- `AGENTS.md`
- `agent-workflow/governance/agent-handoff-template.md`
- `agent-workflow/agents/workflow-agent.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/progress.md`

执行规则：
- `docs/agent-handoff.md`、`agent-workflow/progress.md`、`agent-workflow/reports/*handoff*.md`、`agent-workflow/reports/*closeout*.md` 等交接类文件必须保存为 UTF-8。
- Windows PowerShell 读取中文交接文件时，优先显式使用 `-Encoding UTF8`。
- 新增或更新交接报告时，Workflow / Automation Agent 负责检查编码规则是否被遵守。

自动化影响：本次只更新交接与治理文档，不改变 Markdown 内容模板字段、同步脚本、质量闸门或自动化运行顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 调度中枢窗口机制建立

根据用户要求，建立“当前窗口用于分配任务和接收收口文件，具体任务单独开窗口执行”的长期机制。

新增文件：
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`

已更新：
- `AGENTS.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/agents/workflow-agent.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`

机制说明：
- 当前窗口作为调度中枢，只做任务派发、收口验收和进度回填。
- 每个任务生成独立任务 ID 和派发单，默认写入 `agent-workflow/execution/<TASK-ID>.md`。
- 每个执行窗口结束前必须写 UTF-8 收口文件，默认写入 `agent-workflow/reports/<TASK-ID>-closeout.md`。
- 用户可用 `派发：<任务描述>`、`收口：<closeout 文件路径>`、`状态`、`下一批`、`阻塞：<task-id> <原因>` 快速操作。
- 调度中枢收到收口文件后，检查派发单一致性、改动范围、Quality Gates、自动化影响和进度回填，再标记 accepted。

自动化影响：本次只更新工作流治理、派发模板、收口模板和任务看板，不改变 `ai-the-point`、`ai-2`、`ai-3` 的提示词、运行顺序或同步脚本。

## 2026-05-04 调度中枢升级为任务看板驱动

根据用户要求，调度中枢窗口已从“每次临时派发任务”升级为“任务看板驱动”。

已升级：
- `agent-workflow/governance/window-dispatch-hub.md`：新增 `ready` 状态、`执行：<看板编号>`、`看板`、`加入看板：...` 等口令。
- `agent-workflow/execution/dispatch-board.md`：改为固定看板编号 + Task ID + 状态 + 派发单 + 收口文件。
- `AGENTS.md`：补充看板驱动快捷口令。
- `agent-workflow/governance/agent-memory.md`：写入长期记忆。

已预生成首批任务派发单：
- `P0-1` / `WSD-20260504-01-copy-audit`：全站前台 Copy 语气审计。
- `P0-2` / `WSD-20260504-02-ui-screenshot-matrix`：Signals / Daily / Opportunities / Trends UI 截图矩阵验收。
- `P0-3` / `WSD-20260504-03-admin-boundary-qa`：普通前台与 Admin 边界复查。
- `P1-1` / `WSD-20260504-04-daily-brief-detail-productization`：Daily Brief 详情页产品化收口。
- `P1-2` / `WSD-20260504-05-automation-first-run-log-review`：自动化首跑与日志复查。

新使用方式：
- 用户说 `执行：P0-1`，调度中枢直接读取该任务派发单并输出独立窗口提示词。
- 用户说 `收口：agent-workflow/reports/<TASK-ID>-closeout.md`，调度中枢读取收口文件并验收。
- 用户说 `看板` 或 `状态`，调度中枢展示当前任务状态。

验证：
- `feature_list.json` 可正常解析。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

自动化影响：本次只更新任务看板、派发单和治理文档，不改变 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 看板任务池补充与综合排序

根据用户补充，调度中枢已将 6 个新任务加入任务池，并与已有任务综合排序。

新增任务：
- `P0-1` / `WSD-20260504-07-the-point-home-redesign-plan`：The Point 首页改版方向制定，Strategy Agent 与 PM Agent 先定方向，后续 Copy / UI 执行。
- `P0-2` / `WSD-20260504-09-homepage-hero-optimization-plan`：首页优化，重点解决首屏海报图和第一屏价值表达。
- `P0-3` / `WSD-20260504-08-admin-console-requirements`：Admin 管理功能模块设计和页面设计，由 PM Agent 输出开发需求并推进执行。
- `P0-4` / `WSD-20260504-11-launch-readiness-plan`：上线前准备，覆盖服务器、数据库、版本、备份、回滚、权限和部署方案。
- `P1-1` / `WSD-20260504-10-mobile-design-system`：移动端设计独立任务，建立全站移动端规则和关键页面验收。
- `P1-2` / `WSD-20260504-12-ai-assistant-product-plan`：观澜AI 助理产品规划，网页端或手机端与客户对话交流。

综合排序原则：
- 先处理直接影响前台价值感和用户第一印象的任务：The Point 首页、首页首屏。
- 再处理影响运营效率和上线条件的任务：Admin 后台、上线准备。
- 再处理跨端体验和新产品能力：移动端设计、AI 助理。
- 已有 Copy 审计、UI 截图矩阵、Admin 边界 QA 等任务保留，但顺序后移到对应战略/PM方向之后执行。

自动化影响：本次只新增任务卡和派发单，不改变自动化任务、同步脚本或 Markdown 数据字段。

## 2026-05-04 长期 Agent GitHub 能力学习收口

调度中枢已验收能力训练窗口提交的计划外收口：

- `agent-workflow/reports/WSD-agent-github-capability-learning-closeout-2026-05-04.md`

本轮确认：
- 已安装并学习 `taste-skill`，安装路径为 `C:\Users\86186\.codex\skills\taste-skill`。
- 已抽查并学习 `openai/skills`、`phuryn/pm-skills`、`VoltAgent/awesome-design-md`、`Leonxlnx/taste-skill`、`Tencent/AI-Infra-Guard`。
- 八个长期 Agent 岗位文件已补充外部 GitHub 能力学习方式和适配边界。
- `agent-workflow/governance/agent-memory.md` 已写入“GitHub 外部能力学习”长期规则。
- 已新增学习报告：`agent-workflow/reports/agent-github-capability-learning-2026-05-04.md`。
- 调度看板已补登记为 `SYS-2` / `WSD-agent-github-capability-learning`，状态为 `accepted`。

机制补强：
- `agent-workflow/execution/TASK-window-dispatch-template.md` 已补充外部 GitHub skill / repo 安全审查要求。
- `agent-workflow/governance/window-dispatch-hub.md` 已补充收口验收时对外部 GitHub skill / repo 的检查项。

验证：
- 收口窗口已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过。
- 调度中枢已校验 `agent-workflow/feature_list.json` 可正常解析。
- 调度中枢已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-094538.md`。

自动化影响：本次只影响长期 Agent 能力说明、治理记忆、报告、调度看板和派发模板，不改变 `ai-the-point`、`ai-2`、`ai-3` 的提示词、时间线、Markdown 字段、同步脚本或质量闸门。

## 2026-05-04 首页首屏轮播图派生工作树任务

根据用户要求，调度中枢已新增并派发首页首屏执行型任务：

- 看板编号：`P0-2A`
- Task ID：`WSD-20260504-13-homepage-hero-carousel-assets`
- 派发单：`agent-workflow/execution/WSD-20260504-13-homepage-hero-carousel-assets.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md`

Agent 安排：
- UI / UE Agent 牵头，负责三张轮播图视觉方向、首屏层级和桌面/移动端验收点。
- Copy Agent 协作，负责首屏叠加文案，避免空泛营销语和内部话术。
- Dev Agent 协作，在派生工作树中新增图片资产并替换首页首屏轮播。
- QA Agent 协作，负责桌面端、移动端、无横向溢出和轮播可用性验收。
- PM Agent 控制边界，确保本任务不扩散为整站首页重构。

执行边界：
- 允许改动 `04-Site/index.html`、`04-Site/css/styles.css`、`04-Site/js/app.js`、`04-Site/assets/hero/`。
- 不改内容源 Markdown、网站数据、同步脚本、关系检查脚本、统一同步脚本或自动化任务。

自动化影响：预计不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 本地环境与派生工作树修复

用户反馈派生工作树任务初始化失败，提示本地环境不可用。经核查，项目根目录 `01-WaveSight` 不是 git 仓库，缺少 `.git`，因此无法创建派生工作树。

已修复：
- 初始化 git 仓库，默认分支为 `main`。
- 新增 `.gitignore`，排除依赖、缓存、备份和大型截图类验收文件。
- 新增 `.gitattributes`，固定文本换行策略并标记图片等二进制文件。
- 设置本仓库 `core.autocrlf=false`，降低 Windows 环境下 Markdown 文档换行被反复转换的风险。
- 创建初始提交：`5428909 chore: initialize WaveSight repository baseline`。

验证：
- 已创建临时派生工作树并读取 git 状态，随后移除临时 worktree 和测试分支。
- 冒烟测试结果：`WORKTREE_SMOKE_OK`。
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过。

报告：
- `agent-workflow/reports/local-environment-worktree-fix-2026-05-04.md`

自动化影响：本次只修复本地版本管理与派生工作树能力，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 GitHub 仓库基线同步

用户已安装 GitHub 插件，并创建 `radar` 相关仓库。调度中枢确认可访问 GitHub 仓库：

- `jerryfang2023-stack/AI-Radar`
- `https://github.com/jerryfang2023-stack/AI-Radar`

已完成：
- 本地仓库已绑定远端 `origin`。
- 起初发现远端 `main` 已有测试提交，因此先将当前观澜AI完整项目基线推送到分支：`wavesight-baseline-20260504`。
- 用户确认远端测试 / 命名规则文件没有价值，可以删除。
- 已使用 `--force-with-lease` 将观澜AI正式基线推送为远端 `main`。
- 当前远端 `main` 提交：`504a155 chore: document GitHub baseline sync`。

同步范围：
- `04-Site/` 网站代码、页面、样式、脚本、静态资产和当前数据文件。
- `agent-workflow/` 长期 Agent 工作流、治理、派发单、PRD、产品规范、脚本和报告。
- `docs/agent-handoff.md`。
- 当前内容源目录：`01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/`。
- `AGENTS.md`、`.gitignore`、`.gitattributes`、`提示词/`、`测试期文档/`。

已排除：
- 依赖、缓存、备份、大型截图验收文件和本地环境变量。

报告：
- `agent-workflow/reports/github-baseline-sync-2026-05-04.md`

自动化影响：本次只同步版本管理仓库和必要文件，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 The Point 首页改版规划收口与落地派发

调度中枢已验收并接受 `P0-1 / WSD-20260504-07-the-point-home-redesign-plan` 收口：

- 收口文件：`agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md`
- 规划报告：`agent-workflow/reports/the-point-home-redesign-plan-2026-05-04.md`

验收结论：
- Strategy / PM 规划完整，未修改页面、内容源、数据模型、同步脚本或自动化任务。
- 已明确 The Point 首页不做观点列表、人物墙或来源聚合，而是“一线观点如何帮助商业判断”的解释层。
- 固定 H1 为：`从一线观点中，看见 AI 共识、分歧与边界。`
- 今日一线观点区是页面核心，必须突出 builders / 机构、来源类型和原文出处链接，观澜解读作为第二层增值。
- 规划任务已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过。

后续已派发：
- 看板编号：`P0-1A`
- Task ID：`WSD-20260504-14-the-point-home-redesign-implementation`
- 派发单：`agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md`

执行要求：
- 一个执行窗口连续完成 Copy、UI / UE、Dev、QA。
- 不要中途回调度窗口；全部页面修改、检查和截图完成后，再提交 closeout。
- 允许改动 `04-Site/the-point.html`、`04-Site/js/app.js`、`04-Site/css/styles.css`。
- 禁止改动 `05-point/`、内容源、网站数据、同步脚本和自动化任务。

自动化影响：规划收口与后续派发本身不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 每日 Signal 关键词与来源优化派发

根据用户要求，调度中枢已派发 Intelligence Data Agent 任务，用于优化每日 AI 商业雷达的监测关键词和来源策略。

任务：
- 看板编号：`P0-7`
- Task ID：`WSD-20260504-15-signal-keyword-source-optimization`
- 派发单：`agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`

牵头 Agent：
- Intelligence Data Agent

协作 Agent：
- Workflow / Automation Agent
- PM Agent

任务目标：
- 修正每日 Signal 过度偏向大企业、大融资和高曝光新闻的风险。
- 补齐新趋势、新投资方向、小额起步融资、技术更新迭代、开源 / 开发者生态、垂直行业早期采用和反证信号。
- 更新 `提示词/关键词列表.md`、`提示词/监测提示词V4.0.md` 和 `agent-workflow/product/source-intelligence.md`。

自动化影响：
- 本任务可能影响 `ai-2` 每日商业雷达生成口径。
- 默认不影响 `ai-the-point`。
- 默认不影响 `ai-3`，除非后续改同步闸门或检查规则。

## 2026-05-04 The Point 首页改版落地验收

调度中枢已验收并接受 `P0-1A / WSD-20260504-14-the-point-home-redesign-implementation` 收口。

收口文件：
- `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md`

完成事项：
- `04-Site/the-point.html` 已从旧日期归档列表升级为 The Point 首页判断入口。
- H1 固定为 `从一线观点中，看见 AI 共识、分歧与边界。`
- 页面结构调整为栏目标题、主观点、共识 / 分歧 / 早期信号、今日一线观点、往期观点和主题侧栏。
- 今日观点展示 10 条少而精内容，单条观点只保留 `查看观点` 一个动作。
- `正在升温的主题` 已改为可点击主题集合。
- `往期观点` 可进入历史日期集合页。
- The Point 首页底部 `相关判断` 已删除，避免不明指向关联内容压过首页主线。
- 已修复每日集合页超过 10 条时序号重置问题。
- 已撤销 The Point 对一级栏目标题区的单独 CSS 覆盖，标题位置、字号、行高回到全站栏目统一规范。

调度中枢复核：
- 改动范围符合派发单，集中在 `04-Site/the-point.html`、`04-Site/js/app.js`、`04-Site/css/styles.css` 和报告截图。
- 截图文件存在：
  - `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-desktop.png`
  - `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-mobile.png`
- `04-Site/the-point.html` 未命中 `Admin`、`JSON`、`同步`、`编辑`、`恢复`、`字段`、`后台`、`证据链`、`强证据`、`机会确定`、`下一步验证` 等前台禁用话术。
- 调度中枢已运行 `node --check 04-Site/js/app.js` 通过。
- 调度中枢已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-112652.md`。

未运行检查：
- 调度中枢未重新运行浏览器截图和多身份验收；执行窗口 closeout 已记录其完成桌面端、移动端、链接抽查和四种访问状态轻量验收。残余风险低。
- 调度中枢未运行 `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`，因为本任务禁止且未修改内容源、网站数据、同步脚本和关系检查口径。

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是本任务只改 The Point 首页展示层，不改 `05-point/` 内容源、Markdown 字段、网站数据、同步脚本或自动化任务。

## 2026-05-04 Admin 后台需求规划收口

调度中枢已验收并接受 `P0-3 / WSD-20260504-08-admin-console-requirements` 收口。

收口文件：
- `agent-workflow/reports/WSD-20260504-08-admin-console-requirements-closeout.md`

需求产出：
- `agent-workflow/prd/active/PRD-007-admin-console.md`
- `agent-workflow/reports/admin-console-requirements-2026-05-04.md`

验收结论：
- 本任务为 PM 需求规划任务，未修改 `04-Site/admin.html`、普通前台、权限代码或自动化代码。
- 已明确 Admin 从本地控制台原型升级为后台专属工作台。
- 已补齐模块清单：今日工作台、内容管理、用户与权限、订阅与订单、质量检查、发布准备、系统设置。
- 已明确 P0 保持单页 `admin.html`，P1 再考虑拆多页后台。
- 已将 `feature_list.json` 中 `GL-M3-005` 更新为 `in_progress`。

后续已加入看板：
- 看板编号：`P0-3A`
- Task ID：`WSD-20260504-16-admin-console-p0-workbench-implementation`
- 派发单：`agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md`

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是需求规划未改变 Markdown 命名、目录、frontmatter、数据字段、同步脚本、检查脚本或自动化入站顺序。

## 2026-05-04 首页首屏与海报图规划收口

调度中枢已验收并接受 `P0-2 / WSD-20260504-09-homepage-hero-optimization-plan` 收口。

收口文件：
- `agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md`

规划报告：
- `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`

验收结论：
- 首页首屏不应继续以抽象雷达流程图作为主要记忆点。
- 首屏主方向确认为“情报桌面 + 真实判断样张”，突出观澜AI作为 AI 商业机会判断系统的价值。
- 推荐 H1 为：`在市场形成共识前，看见 AI 商业变化`。
- 推荐副标题为：`每天从融资、客户采用、产品落地和产业变化中筛出关键信号，形成可追踪的机会观察与趋势判断。`
- 推荐 CTA 为：`查看今日简报` / `申请进入完整情报层`。
- 用户已认可本轮生成的展示图风格，后续落地应保留象牙白底、深石墨文字、深墨绿重点面板和少量铜棕强调。
- 展示图仅作为风格参考，不是最终站点资产：`C:\Users\86186\.codex\generated_images\019def03-4307-7030-9f0c-2652d44d41c3\ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png`

调度中枢回填：
- `dispatch-board.md` 已将 P0-2 更新为 `accepted`。
- `feature_list.json` 中 `GL-M3-002` 继续保持 `in_progress`，等待 P0-2A 首页轮播图实现和截图验收。
- P0-2A 派发单和执行窗口提示词已补充 P0-2 验收结论与展示图参考路径。
- 调度中枢已复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-114355.md`。

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是本任务只做首页方向规划和派发单回填，未修改内容源、Markdown 字段、同步脚本、检查脚本或自动化入站顺序。

## 2026-05-04 首页首屏轮播图任务作废收口

调度中枢已将 `P0-2A / WSD-20260504-13-homepage-hero-carousel-assets` 标记为 `void / abandoned`。

收口文件：
- `agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md`

作废原因：
- 当前首页首屏轮播方向未被采用，需要重新派发新的首页首屏 P0 方向任务。
- 本任务提前终止，没有交付物。
- 不再继续设计、生成图片、改页面或优化代码。
- 不合并、不推送、不把本任务成果带回主工作树。
- 派生工作树不删除，保留现场供后续参考。

已尝试或曾被派发探索的方向：
- 抽象图：雷达、信号节点、关系网络。
- 现实商业图：商业情报桌面、董事会桌面、产业地图。
- 情报样张：Signals、Opportunity Watch、Trend Status 与 Brief 的判断关系样张。

调度结论：
- 当前成果不可合并。
- 若派生工作树中已有图片、截图或代码修改，只作为现场参考，不进入主工作树。
- 后续需要重新派发首页首屏 P0 方向任务，不沿用本轮“三张轮播图替换首屏”的实现假设。
- 调度中枢已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-115314.md`。

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是本任务提前终止，未改变内容源、Markdown 字段、同步脚本、检查脚本或自动化入站顺序。

## 2026-05-04 Netlify 预览部署任务加入看板

根据用户要求，调度中枢已新增 Netlify 预览部署任务。

任务：
- 看板编号：`P0-4A`
- Task ID：`WSD-20260504-17-netlify-preview-deploy`
- 派发单：`agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`

牵头 Agent：
- Dev Agent

协作 Agent：
- PM Agent
- QA / Acceptance Agent
- Workflow / Automation Agent

任务目标：
- 将当前项目网站部署到 Netlify 预览环境。
- 返回一个可外部访问的 Netlify Preview URL。
- 本任务只做预览部署，不做正式域名、生产发布、数据库迁移或自动化上线。

自动化影响：
- 本任务可能影响上线准备路径。
- 默认不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 如果执行过程中需要改变 Markdown 命名、内容字段、同步脚本或自动化入站顺序，必须停止并回调度中枢确认。

调度中枢检查：
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-120012.md`。

## 2026-05-04 Priority Engine 2.0 模型收口与快速落地合并派发

调度中枢已验收 `priority-engine-2-2026-05-04`，Priority Engine 2.0 第一版模型形成。

完成产物：
- `agent-workflow/execution/PLAN-priority-engine-2-2026-05-04.md`
- `agent-workflow/product/priority-engine-2.md`
- `agent-workflow/reports/priority-engine-2-2026-05-04.md`

核心结论：
- Priority Engine 2.0 是后台判断引擎，不新增前台栏目。
- 核心对象为 `Judgment Node = 赛道 + 能力 + 客户场景 + 证据阶段`。
- 评分从每日公司 / 新闻评分升级为可追踪、可复盘、可校准的判断节点。
- The Point 不作为事实证据直接加权，只作为观点共识、分歧和边界信号。
- 对外状态为：优先验证、持续观察、早期观察、谨慎观察、暂缓关注。

用户要求：
- 原计划拆分的 PM 确认、ai-2 提示词升级、Dev 解析实现、QA 验收四个任务合并为一个任务。
- 优先级提高。
- 尽快开发上线。

调度更新：
- `WSD-20260504-18-priority-engine-2-pm-boundary` 已标记为 merged。
- `WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade` 已标记为 merged。
- `WSD-20260504-20-judgment-node-dev-plan` 已标记为 merged。
- `WSD-20260504-21-priority-engine-2-qa-criteria` 已标记为 merged。
- 新增合并任务：`P0-8A / WSD-20260504-22-priority-engine-2-fast-track-implementation`。
- 看板建议顺序已将 `执行：P0-8A` 提升为第一位。

自动化影响：
- `ai-2`：有影响，合并任务必须更新每日机会评分提示词并保留旧 30 分表兼容。
- `ai-the-point`：本轮不强制改，但 closeout 必须说明后续轻量增强项。
- `ai-3`：短期不改闸门；若 Judgment Node 字段进入同步结果，closeout 必须说明后续检查口径。

调度中枢检查：
- `feature_list.json` 已通过 JSON 解析。
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-120819.md`。

## 2026-05-04 Netlify 预览部署验收

调度中枢已验收 `P0-4A / WSD-20260504-17-netlify-preview-deploy`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`

可访问链接：
- 不可变部署链接：`https://69f88cb84d559e9a6e9354bd--wavesight-ai-preview.netlify.app`
- 站点默认链接：`https://wavesight-ai-preview.netlify.app`
- Netlify 项目后台：`https://app.netlify.com/projects/wavesight-ai-preview`

部署信息：
- Netlify 站点名称：`wavesight-ai-preview`
- Site ID：`7ab8a5d2-477b-439d-ad4b-57f449ebad9e`
- Deploy ID：`69f88cb84d559e9a6e9354bd`
- 发布目录：`04-Site/`
- 新增 `netlify.toml`，仅固定 `[build] publish = "04-Site"`。

调度中枢复核：
- 外部 HTTP 抽查 `/`、`/daily.html`、`/signals.html`、`/the-point.html`、`/opportunities.html`、`/trends.html`、`/css/styles.css`、`/js/app.js`、`/data/radar-data.js` 均返回 200。
- `netlify.toml` 未包含 token、账号、域名、数据库或敏感配置。
- `feature_list.json` 中 `GL-M4-001` 已更新为 `in_progress`，表示云端部署准备已完成预览部署阶段，但正式上线仍需发布清单、权限边界、备份和回滚方案。

遗留风险：
- Netlify closeout 发现 `/signals.html` 源码中仍有历史遗留隐藏 `editorDialog` 编辑弹窗。
- 该问题不是本次部署引入，不阻塞预览部署验收。
- 调度中枢已将该风险回挂到 `P0-6 / WSD-20260504-03-admin-boundary-qa`。

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是本任务只新增 Netlify 预览部署配置和收口文件，未改内容源、数据字段、同步脚本、检查脚本或自动化入站顺序。

调度中枢检查：
- `feature_list.json` 已通过 JSON 解析。
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-121824.md`。

## 2026-05-04 Priority Engine 2.0 快速落地验收

调度中枢已验收 `P0-8A / WSD-20260504-22-priority-engine-2-fast-track-implementation`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md`

完成事项：
- PM 边界确认：Priority Engine 2.0 保持后台判断能力，不新增普通前台栏目。
- `ai-2` 提示词已升级：保留旧 30 分表，新增 Priority Engine 2.0 Judgment Node 拆解段。
- Dev 已实现第一版 Judgment Node 入站能力：`sync-data.mjs` 输出 `judgmentNodes` 与 `priorityEngine` 摘要。
- 关系检查已扩展：覆盖 `Priority -> Judgment Node` 和 `Judgment Node -> Priority / Signal / Trend / Opportunity`。
- QA 已抽查 5 条 Priority / Opportunity / Trend 样本，确认 The Point 未作为事实证据直接加权。

当前数据：
- Signals：33
- Priority Rows：39
- Judgment Nodes：22
- Trends：13
- Points：34
- Point Sources：5
- Opportunities：27
- Priority -> Judgment Node：39/39
- Judgment Node -> Priority / Signal / Trend / Opportunity：22/22

调度中枢复核：
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/scripts/check-relations.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 12。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-123257.md`。
- `feature_list.json` 中 `GL-M2-006` 已更新为 `verify`。
- 调度中枢最终复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-123443.md`。

非阻塞遗留：
- Netlify 未重新部署本轮 Priority Engine 2.0 数据；执行窗口已说明远端部署遇到授权 / 绑定问题，不冒充上线。
- 浏览器截图验收未运行；本轮主要验收数据解析、提示词和关系检查。
- 旧 `04-Site/scoring.html` 中存在否定式文案 `不是投资建议`，属于历史前台表达边界项，后续 Copy / Admin 边界 QA 可处理。

自动化影响：
- `ai-2`：已影响，提示词已升级。后续每日评分应继续输出旧 30 分表，并新增 Priority Engine 2.0 拆解段。
- `ai-the-point`：本轮未改。后续可轻量补充观点立场、支持 / 质疑 / 修正的 Judgment Node、可验证边界和反证观察。
- `ai-3`：本轮未改统一同步闸门。因 `judgmentNodes` 已进入网站数据，后续应补充 Priority Row -> Judgment Node 的同步闸门摘要。

## 2026-05-04 ai-3 Judgment Node 同步闸门派发

根据用户要求，调度中枢已新增 P0 任务，升级 `ai-3` 统一网站同步闸门，加入 Priority Engine 2.0 Judgment Node 覆盖率与硬错误检查。

任务：
- 看板编号：`P0-8B`
- Task ID：`WSD-20260504-23-ai-3-judgment-node-sync-gate`
- 派发单：`agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md`

牵头 Agent：
- Workflow / Automation Agent
- Dev Agent

协作 Agent：
- Intelligence Data Agent
- QA / Acceptance Agent
- PM Agent

任务目标：
- 在 `ai-3` 统一同步闸门中补充 Priority Engine 2.0 Judgment Node 覆盖率检查。
- Priority Row 无 Judgment Node、Judgment Node 无 Priority、覆盖率摘要缺失或不一致、Judgment Node 断链等情况应成为硬错误，阻止入站并恢复备份。
- 更新 `ai-3` 运行说明或实际自动化提示词；如果无法直接更新实际自动化配置，必须写清阻塞和替代执行文档。

自动化影响：
- 本任务可能影响自动化任务。
- `ai-the-point`：默认不影响。
- `ai-2`：间接影响，后续每日评分必须继续输出 Judgment Node 或可解析候选。
- `ai-3`：直接影响，统一同步闸门口径将升级。

调度中枢检查：
- 已生成派发单、窗口提示词并更新 `dispatch-board.md`。
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-125015.md`。

## 2026-05-04 ai-3 Judgment Node 同步闸门执行验收

用户要求将 `P0-8B / WSD-20260504-23-ai-3-judgment-node-sync-gate` 进入执行，本轮已完成。

完成事项：
- `agent-workflow/tools/unified-site-sync.mjs` 已新增 Priority Engine 2.0 Judgment Node 硬闸门。
- `ai-3` 真实自动化本体提示词已更新，新增 Judgment Node 覆盖率、硬错误代码和成功汇总要求。
- `agent-workflow/execution/daily-automation-coordination-2026-05-03.md` 已同步更新 `ai-3` 运行说明。
- `dispatch-board.md` 已将 `P0-8B` 标记为 `accepted`。
- 收口文件：`agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md`

硬闸门规则：
- Priority Row -> Judgment Node 覆盖率必须为 100%。
- 每个 Judgment Node 必须至少关联一个 Priority Row。
- Judgment Node 关联的 Priority / Signal / Trend / Opportunity / Point 不得断链。
- `priorityEngine` 摘要必须与实际数据一致。
- The Point 只能作为观点共识、分歧或边界信号，不能作为事实证据直接加权。

验证：
- `node --check agent-workflow/tools/unified-site-sync.mjs` 通过。
- `node --check agent-workflow/tools/run-quality-gates.mjs` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/scripts/check-relations.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 12。
- `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04 --run-sync-gate` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-125900.md`。
- 调度中枢复跑 `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04` 通过，报告为 `agent-workflow/reports/quality-gates-automation-2026-05-04-20260504-130129.md`。
- `feature_list.json` 中 `GL-M2-006` 已确认回到 `verify`。

真实 `ai-3` 闸门结果：
- 状态：`synced`
- 阻塞项：0
- Priority Rows：39
- Judgment Nodes：22
- Priority Row -> Judgment Node 覆盖率：39/39
- 备份目录：`agent-workflow/backups/unified-site-sync/20260504-125611`
- 报告：`agent-workflow/reports/unified-site-sync-2026-05-04.md`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：间接影响，后续每日评分必须持续输出 Judgment Node 或可解析候选。
- `ai-3`：直接影响，统一同步闸门已升级并验证通过。

## 2026-05-04 Signal 关键词与来源优化验收

调度中枢已验收 `P0-7 / WSD-20260504-15-signal-keyword-source-optimization`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`

完成产物：
- `提示词/关键词列表.md`：升级为 V4.2。
- `提示词/监测提示词V4.0.md`：升级为 V4.2。
- `agent-workflow/product/source-intelligence.md`：补充早期来源、开发者来源、投资来源、垂直行业来源和反证来源分层。
- `agent-workflow/reports/signal-keyword-source-optimization-2026-05-04.md`。

核心变化：
- 每日监测从“大企业 / 大融资 / 高曝光新闻优先”调整为六类候选池：成熟信号、早期融资 / 新投资方向、技术迭代、开源 / 开发者生态、垂直行业早期采用、反证与降温。
- 新增候选配额，避免成熟大融资和大公司新闻挤占全部每日 Signal 名额。
- 每条 Signal 后续应记录 `触发查询` 和 `监测维度`。
- C 级线索必须回找 S/A/B 来源，不直接支撑高分 Signal。

调度中枢复核：
- 改动范围符合派发单，未修改 `04-Site/`、历史正式内容源、同步脚本、关系检查脚本或自动化配置对象。
- `feature_list.json` 中 `GL-M2-004` 已更新为 `in_progress`，因为关键词策略已优化，但关键词质量检查脚本 / 周期复盘仍待继续完善。
- 2026-05-04 21:08 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-130820.md`。

下一次每日雷达观察指标：
- 3-6 条正式 Signal 中是否至少有 1 条早期融资 / 新投资方向。
- 是否覆盖技术迭代、开源 / 开发者生态、垂直早期采用或反证候选。
- 大企业 / 大融资新闻是否控制在 1-2 条。
- 每条 Signal 是否记录 `触发查询`、`监测维度`、1 个主 Opportunity 和 6 点机会拆解。

自动化影响：
- `ai-2`：有影响，下一次每日商业雷达将受到新版关键词、候选配额和来源采信口径影响。
- `ai-the-point`：不影响。
- `ai-3`：不影响。

## 2026-05-04 页面类任务派发闸门规则验收

调度中枢已验收计划外治理任务 `SYS-3 / WSD-page-dispatch-gate-rules`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-page-dispatch-gate-rules-closeout-2026-05-04.md`

规则报告：
- `agent-workflow/reports/page-dispatch-gate-rules-2026-05-04.md`

完成产物：
- `agent-workflow/governance/window-dispatch-hub.md`：新增页面类任务派发硬规则。
- `agent-workflow/execution/TASK-window-dispatch-template.md`：新增 `7A 页面类任务硬性要求`。
- `agent-workflow/reports/TASK-window-closeout-template.md`：新增 `4A 页面类任务验收`。
- `agent-workflow/governance/agent-memory.md`：写入页面类任务派发闸门失效的长期记忆和新硬规则。

核心规则：
- 凡涉及首页、栏目页、详情页、会员页、Admin、移动端、`04-Site/*.html` 或 `04-Site/css/styles.css` 页面体验改动，一律视为页面类任务。
- 页面类任务必须经过 `PM 范围确认 -> UI/UE 页面规范表 -> Dev 按表实现 -> QA 独立截图/测量验收 -> Workflow 收口`。
- 缺少 UI/UE 页面规范表、Dev 逐条实现说明、QA 桌面 / 移动端截图或坐标 / 字号 / 间距 / 首屏节奏验收时，调度中枢不得标记 `accepted`。

调度中枢回填：
- `dispatch-board.md` 已新增 `SYS-3 / WSD-page-dispatch-gate-rules`，状态为 `accepted`。
- `page-dispatch-gate-rules-2026-05-04.md` 与 closeout frontmatter 已更新为 `accepted`。
- 2026-05-04 21:26 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-132602.md`。

后续影响：
- 重新派发首页首屏 P0 时，必须先产出 UI/UE 页面规范表。
- `P0-3A` Admin 工作台 closeout 需要按新页面类闸门验收；若缺少规范表、逐条实现说明或截图/测量验收，不得 accepted。
- 后续栏目标题矩阵、移动端设计和页面返修任务均必须套用新模板。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 Admin P0 工作台落地验收

调度中枢已验收 `P0-3A / WSD-20260504-16-admin-console-p0-workbench-implementation`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md`

完成事项：
- `admin.html` 已从本地控制台原型升级为后台专属单页工作台。
- 已覆盖运营仪表盘、内容管理、用户与权限、订阅与订单、邀请码、质量检查和系统设置。
- 内容管理从纯 JSON 默认编辑升级为新闻 CMS 式列表筛选、频道切换和独立稿件编辑页；JSON 降为高级模式。
- 用户与权限、订阅与订单、质量检查、系统设置均作为独立视图呈现。
- 新增邀请码模块，支持生成、筛选、复制、暂停 / 启用、删除、申请审批和通过后生成单次邀请码。
- 新增本地访问统计，用于 Admin 运营仪表盘展示 PV / UV 和栏目热度。

调度中枢复核：
- closeout 提供 Admin 桌面 / 移动端、多模块间距、内容管理、邀请码、控件对齐等截图，截图文件均存在。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 调度中枢复跑通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-145011.md`。
- `dispatch-board.md` 已将 `P0-3A` 标记为 `accepted`。
- `feature_list.json` 中 `GL-M3-005` 已更新为 `verify`，表示 Admin P0 工作台已落地，仍等待权限边界复查。

范围与风险：
- 本轮范围扩展到邀请码、邀请申请审批、本地访问统计和注册邀请码闭环；调度中枢接受本次扩展。
- 邀请码、邀请申请和访问统计仍为本地浏览器演示数据，不是正式云端系统。
- 四种身份完整权限边界仍需由 `P0-6 / WSD-20260504-03-admin-boundary-qa` 独立覆盖。
- `signals.html` 隐藏编辑弹窗源码风险仍需纳入 P0-6。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 首页 UI / Copy 重设计失败收口

调度中枢已收到 `WSD-20260504-18-homepage-ui-copy-redesign` 收口，并按失败任务处理。

收口文件：
- `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md`

结论：
- 状态：`failed / not accepted`。
- 不合并，不作为首页最终方向。
- 用户复核后判定当前结果仍未达到参考 demo 的首页质感要求。
- closeout 中引用的桌面 / 移动端截图未同步到主工作树，调度中枢无法完成截图复核。
- `WSD-20260504-18` 编号曾被 Priority Engine 2.0 PM 边界任务使用，后续不再复用该编号派发首页任务。

调度中枢回填：
- `dispatch-board.md` 已新增 `P0-2B / WSD-20260504-18-homepage-ui-copy-redesign`，状态为 `failed / not accepted`。
- 已新增后续任务 `P0-10 / WSD-20260504-25-site-ui-design-direction`：网站 UI 优化，由 Design Director 先输出全站 Art Direction、页面母版、DESIGN v2 草案和验收基线。
- 已新增后续任务 `P0-11 / WSD-20260504-26-homepage-desk-visual-asset`：首页右侧海报图 / Intelligence Desk 样张优化，等待 P0-10 accepted 后执行。
- 2026-05-04 22:48 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-144808.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 UI / UE Design Director 升级验收

调度中枢已验收计划外长期 Agent 能力升级任务 `SYS-4 / WSD-ui-ue-design-director-upgrade`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-ui-ue-design-director-upgrade-closeout-2026-05-04.md`

完成产物：
- `agent-workflow/agents/ui-ue-agent.md`：原地升级为 `UI / UE Design Director`。
- `agent-workflow/agents/agent-registry.json`：`ui-ue-agent` 名称和 primary outputs 已更新。
- `agent-workflow/governance/agent-memory.md`：写入 Design Director 长期记忆。
- `agent-workflow/execution/ui-ue-design-director-upgrade-2026-05-04.md`：升级计划。
- `agent-workflow/reports/ui-ue-design-director-upgrade-2026-05-04.md`：升级报告。

核心规则：
- 不新增第九个长期 Agent，仍保留八 Agent 架构。
- `ui-ue-agent` 从页面修补角色升级为全站视觉总监。
- 后续全站 UI、首页、栏目体系、Admin、移动端和海报 / 首屏视觉任务，必须先由 Design Director 输出 Art Direction、页面母版、字体 / 间距系统、视觉资产规则和审美阻塞项。
- 对“不高级、粗糙、简陋、模板感、海报不合调性、排版乱、字体随意、栏目不紧凑”等问题，Design Director 拥有阻塞权。

调度中枢复核：
- `agent-registry.json` 与 `feature_list.json` 解析正常。
- 2026-05-04 22:41 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-144158.md`。
- `dispatch-board.md` 已新增 `SYS-4 / WSD-ui-ue-design-director-upgrade`，状态为 `accepted`。

后续影响：
- 重新派发首页首屏 P0 时，必须先由 Design Director 输出 Art Direction、页面母版和 UI/UE 页面规范表。
- 全站 UI 重设计任务不得直接进入 Dev；缺少 Design Director 输出和截图验收时不得 accepted。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 登录 / 注册页面优化验收

用户要求在当前调度窗口直接执行 `P0-9 / WSD-20260504-24-login-register-page-optimization`，本轮已完成并标记为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md`

完成事项：
- 登录页升级为“回到今日 AI 商业判断”的账号返回页。
- 注册页升级为“创建账号，开始阅读 AI 商业信号”的账号创建页。
- 注册页明确默认 7 天阅读有效期。
- 注册页新增邀请码输入；没有有效邀请码不能创建新账号。
- 邀请码申请已拆到独立页面 `04-Site/invite-request.html`，用户需填写邮箱、公司 / 机构、身份和申请理由；审核后通过邮箱发放邀请码。
- Admin 邀请码页新增申请记录列表，可复制邮箱、标记已发放或删除记录。
- 登录 / 注册 CTA 分别收敛为 `登录并继续阅读`、`创建账号并开始阅读`。
- 注册页已去掉“补充公司和身份”折叠区；有邀请码时只填写账号、邮箱、邀请码和密码。
- 邀请码申请页旧版内嵌申请框和旧两列申请样式已清理，版式回到登录 / 注册同一套左表单、右说明结构。
- 登录 / 注册后的本地跳转逻辑已调整：有效账号默认进入 `daily.html`，到期账号进入 `account.html`。
- 普通前台已清理 Admin、JSON、同步、编辑、恢复、字段、后台、申请访问、申请试读等表达。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，最新报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-142439.md`。
- 调度中枢复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-143023.md`。
- 已生成登录 / 注册 / 邀请码申请页桌面与移动端截图。
- Playwright / Chrome 验证无横向溢出，注册和登录交互通过。
- Playwright / Chrome 验证：无效邀请码不创建用户；有效邀请码注册成功并消耗一次；未设密码旧账号不能绕过邀请码校验。
- Playwright / Chrome 验证：邀请码申请可写入本地演示数据；Admin `#invites` 可查看申请记录。
- Playwright / Chrome 返修验证：注册页无“补充公司和身份”折叠区；邀请码申请页无旧申请表布局类。

调度中枢复核：
- closeout 包含 UI/UE 页面规范表、Copy 文案规范表、Dev 逐条实现说明、QA 桌面 / 移动截图和文案验收，满足页面 / 文案类硬闸门。
- 原派发单主要允许登录 / 注册页面与相关交互逻辑；执行中扩展到 `invite-request.html` 与 `admin.html` 邀请码申请 / 发放链路。该扩展与邀请码注册闭环相关，调度中枢本轮接受，但后续 Admin 邀请码管理应归入 Admin 或权限边界任务。
- 邀请码与申请记录仍为本地浏览器演示数据，不是云端账号或邮件发放系统。
- 四种身份完整权限验收仍归 `P0-6 / WSD-20260504-03-admin-boundary-qa`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-05 The Point 详情页单页返工

根据用户截图反馈，The Point 详情页存在人物名重复、缺少清晰人物身份层级、观点脉络原文过大、站内/原文链接上下排列不紧凑、背景单薄等问题。

已完成：
- 页头从“人物名重复大标题”改为“观点标题 + 人物/机构身份 + 日期 + 热度”。
- 右侧人物档案去掉重复身份。
- 观点脉络原文降级为正文引用，不再抢占整屏。
- 中文译文改为更克制的纸面注释块。
- `站内 / 原文` 链接改为同排紧凑胶囊。
- 背景增加纸面层次与正文容器质感。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-145342.md`。
- Chrome 截图：`agent-workflow/reports/point-detail-fix-20260505-v2.png`。
- 桌面横向溢出：无。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-05 页面级 Design Director 质检与返工

用户要求每一个页面单独评分、单独评审，低于 70 分必须重做。本轮已按 Style Purity、Proportion & Rhythm、Color Sophistication、Craftsmanship、Emotional Resonance 五项逐页评分。

已完成：
- 24 个 HTML 页面全部纳入桌面截图和逐页评分。
- 24 个 HTML 页面全部纳入移动端横向溢出检查。
- 首轮低于 70 分页面已逐页返工，包括 Opportunities、Opportunity Detail、Trends、Trend Detail、Tags、Scoring、Apply、Checkout、Account、Signal Lab、Admin 等。
- 复评后全部页面达到 70 分以上。

报告：
- `agent-workflow/reports/page-design-director-audit-2026-05-05.md`
- 桌面截图目录：`agent-workflow/reports/page-audit-20260505-v3/`
- 移动端截图目录：`agent-workflow/reports/page-audit-20260505-v3-mobile/`

验证：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-143353.md`。
- 桌面端横向溢出：0 个页面。
- 移动端横向溢出：0 个页面。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-05 P1-4B 非首页栏目 / 详情阅读系统返工

用户反馈上一版栏目和详情页“还是丑、粗糙、呆板，没有商业内参高级感”。本轮确认上一版 Design Director 落地失败：商业参考没有有效转译到页面，表现为标题过重、状态条空白、卡片堆叠和详情页装饰感过强。

已完成：
- 撤回失败的 P1-4B 大样式层。
- 栏目页标题回到统一上方位置和更克制字号。
- Trends 页移除空白总览块，并修正趋势卡图表与文字重叠。
- 详情页改为正文优先、右侧摘要辅助、细分线分隔的商业内参阅读节奏。
- 清理公开前台内部流程语言和 Signals 编辑弹窗残留。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-135410.md`。
- 已生成 Trends、Signal Detail、Opportunity Detail、Point Detail 桌面截图。

收口：
- `agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 登录 / 注册页面优化任务派发

根据用户要求，调度中枢已新增登录 / 注册页面优化任务。

任务：
- 看板编号：`P0-9`
- Task ID：`WSD-20260504-24-login-register-page-optimization`
- 派发单：`agent-workflow/execution/WSD-20260504-24-login-register-page-optimization.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-24-login-register-page-optimization-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md`

牵头 Agent：
- UI / UE Agent
- Copy Agent
- Dev Agent
- QA / Acceptance Agent

任务目标：
- 优化 `04-Site/login.html` 和 `04-Site/register.html`。
- 让用户清楚理解账号入口、注册后的默认阅读有效期、登录后的去向。
- 登录 / 注册页面必须符合上线前前台页面质量要求，不能像模板表单或后台组件堆叠。

新闸门要求：
- 必须先输出 UI/UE 页面规范表。
- 必须先输出 Copy 文案规范表。
- Dev 必须按两个规范表逐条实现，不得自行补写关键文案。
- QA 必须提供登录页和注册页桌面 / 移动截图，并做坐标 / 字号 / 间距 / 文案验收。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
## 2026-05-06 AI News Radar 重点关注显示修复

用户反馈本地 `09-ai-news-radar` 页面看不到“重点关注”专区。本轮由 Dev Agent 小范围修复：

- 已确认 `09-ai-news-radar/data/latest-24h.json` 中存在 `priority_items`，当前 36 条。
- 已确认本地站点 `http://127.0.0.1:8088/` 正常返回页面。
- 已为 `09-ai-news-radar/index.html` 的 `assets/styles.css` 与 `assets/app.js` 增加版本参数，降低浏览器缓存旧资源导致专区不可见的概率。
- 已在 `prioritySpotlight` 中加入静态加载态标题，脚本加载前也能看到“重点关注”位置；脚本加载后由真实列表替换。

验证：
- `node --check 09-ai-news-radar/assets/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-06-20260506-132237.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- Obsidian 同步保持停止状态，未恢复、未写入 `08-AI news`。

## 2026-05-07 V2-13AUTO 历史资产改写与 5/7 监测入库

状态：`accepted / v2-content-20260507-imported`

本轮在 `V2-13 + V2-DOC` 合并任务内继续执行，没有新开任务、没有另写独立派发单。

完成：
- V1 Signals / Scoring / Trends / Point / Opportunities 已按 V2 六维分析、HeatEvidence、Trend Context、Point Calibration、Opportunity 关系改写为 V2 legacy candidates。
- closeout 中已新增并更新“历史判断资产迁移”章节。
- 2026-05-07 今日监测任务已执行并入库：Raw 30、Raw originals 30、Pool 12、Structured 8、Front Signals 3。
- `follow-builders` 已执行，并作为 Point 主内容源写入 `01-SiteV2/content/07-points/2026-05-07-point-calibration.md`。
- 今日补充写入 Trend、Insight、Opportunity deep dive、Trend DB、Opportunity DB、Risk DB。

实际写入路径：
- `01-SiteV2/content/01-raw/2026-05-07-raw-candidates.md`
- `01-SiteV2/content/01-raw/originals/2026-05-07/`
- `01-SiteV2/content/02-pool/2026-05-07-signal-pool.md`
- `01-SiteV2/content/03-structured-signals/2026-05-07-structured-signals.md`
- `01-SiteV2/content/04-selected-signals/2026-05-07-front-signals.md`
- `01-SiteV2/content/05-trend-chain/2026-05-07-trend-classification.md`
- `01-SiteV2/content/06-insights/2026-05-07-insights.md`
- `01-SiteV2/content/07-points/2026-05-07-point-calibration.md`
- `01-SiteV2/content/08-opportunities/deep-dive/2026-05-07-opportunity-deep-dive.md`
- `01-SiteV2/content/10-databases/trends/2026-05-07-trend-database-update.md`
- `01-SiteV2/content/10-databases/opportunities/2026-05-07-opportunity-database-update.md`
- `01-SiteV2/content/10-databases/risks/2026-05-07-risk-database-update.md`

验证：
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

下一步：
- 历史 legacy candidates 进入逐条精修、合并和发布判断。
- 优先合并 V1 `Agent治理与权限审计服务` 与今日 `OPP-20260507-01｜企业 Agent 控制与审计层`。

## 2026-05-06 AI News Radar 重点关注列表化

用户要求将“重点关注”改为与普通新闻一致的新闻列表，并完整展示 36 条；下方未命中的其他来源少量展示。本轮由 Dev Agent 小范围调整：

- `09-ai-news-radar/assets/app.js`：重点关注改用普通新闻卡片与站点 / 分区分组渲染，展示 `priority_items` 全量 36 条。
- `09-ai-news-radar/assets/app.js`：下方 AI 模式列表改为“其他来源补充”，跳过已命中的重点新闻，并限制为最多 48 条、每个来源分区最多 4 条。
- `09-ai-news-radar/assets/styles.css`：清理旧重点关注双列卡样式，改为普通新闻列表样式。
- `09-ai-news-radar/index.html`：更新前端资源版本参数，避免浏览器继续读取旧资源。

命中口径确认：
- 重点关键词先作用于 24 小时“今日覆盖池”。
- 命中后会被标记为 `priority`，并可进入 AI精选。
- `priority_items` 再从 AI精选去重结果中抽取，不是浏览器页面对 AI精选临时二次筛选。

验证：
- `node --check 09-ai-news-radar/assets/app.js` 通过。
- `pytest -q` 通过，39 passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-06-20260506-133718.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- Obsidian 同步保持停止状态，未恢复、未写入 `08-AI news`。

## 2026-05-06 AI News Radar Builders 独立展示

用户要求将 Builders 呈现在“重点关注”之后，并继续减少其他非命中新闻展示。本轮由 Dev Agent 小范围调整：

- `09-ai-news-radar/index.html`：在重点关注后新增 `Builders 动态` 区块，位于 WaytoAGI 之前。
- `09-ai-news-radar/assets/app.js`：Builders 识别口径改为 `followbuilders` 源 + `opmlrss` 中来源名包含 `on X` 的本地 X 账号源。
- `09-ai-news-radar/assets/app.js`：当前 Builders 动态可展示 31 条，其中 8 条同时带重点标签。
- `09-ai-news-radar/assets/app.js`：其他来源补充继续收窄为最多 24 条、每个来源分区最多 2 条，并排除重点关注与 Builders/X 内容。
- `09-ai-news-radar/assets/styles.css`：新增 Builders 区块样式，沿用新闻列表结构。
- `09-ai-news-radar/index.html`：更新资源版本参数，避免缓存旧前端。

验证：
- `node --check 09-ai-news-radar/assets/app.js` 通过。
- `pytest -q` 通过，39 passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-06-20260506-134642.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- Obsidian 同步保持停止状态，未恢复、未写入 `08-AI news`。

## 2026-05-06 AI News Radar 重点关键词 V4.2 校准

用户要求根据 `提示词/关键词列表.md` 更新重点关注区关键词筛选列表，并去掉与 AI 不相干的词。本轮由 Dev Agent / Intelligence Data Agent 小范围调整：

- 已将 `09-ai-news-radar/config/priority-keywords.json` 改为 `关键词列表.md` 的 V4.2 口径。
- 已移除旧配置中的裸证据词和泛标签词，例如：`融资`、`客户`、`增长`、`SEO`、`IDE`、`Agent`、`RAG`、`Workflow`、`MCP`、`销售`、`客服`、`招聘`、`产品发布`、`shutdown`、`lawsuit` 等。
- 新配置保留 17 个分组、305 个关键词，所有证据词尽量绑定 AI 语境，例如 `AI 融资`、`AI customer growth`、`AI SDK`、`AI startup shutdown`。
- 已基于现有 24 小时数据重算重点关注结果：`priority_items` 从 36 条收敛为 33 条，`AI精选` 从 1532 条收敛为 912 条。
- 已同步更新 `latest-24h.json`、`latest-24h-all.json`、`source-status.json` 中的重点标记与统计。

验证：
- JSON 配置解析通过，裸泛词抽查为 0。
- `node --check 09-ai-news-radar/assets/app.js` 通过。
- `pytest -q` 通过，39 passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-06-20260506-135907.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- 此次只影响 `09-ai-news-radar` 本地 radar 的重点关键词与静态数据结果。
- Obsidian 同步保持停止状态，未恢复、未写入 `08-AI news`。
# 2026-05-08 V2 全站页面重排与字体规范校准

- 状态：进行中，首屏右侧融合视觉待最后单独精修。
- 范围：`01-SiteV2/site/index.html`、`01-SiteV2/site/assets/app.js`、`01-SiteV2/site/assets/styles.css`。
- 已完成：首页、栏目页、详情页从“豆腐块堆叠”改为更连续的商业情报 / 研究简报式页面节奏。
- 已完成：按用户提供的字体规范落地 `--gl-font-serif-cn`、`--gl-font-sans-cn`、`--gl-font-en`、`--gl-font-mono`，并校准标题、正文、英文标签、数字编号的使用角色。
- 已完成：首屏左侧主按钮恢复墨海蓝深色块，主标题恢复 VI 宋体类标题气质，颜色回到墨海蓝、深澜蓝、雾蓝灰、香槟金体系。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs`、`node agent-workflow/tools/run-quality-gates.mjs syntax` 均通过。
- 截图与 QA：`agent-workflow/reports/v2-redesign-editorial-reset-2026-05-08/`，桌面和移动端 8 个页面无横向溢出。
- 收口记录：`agent-workflow/reports/WSD-20260508-05-v2-editorial-redesign-closeout.md`。

# 2026-05-08 V2 全站高端排版问题修复

- 状态：已完成本轮排版修复，首屏右侧融合视觉仍保留为最后单独精修项。
- 使用技能：`redesign-existing-projects`、`design-taste-frontend`、`high-end-visual-design`。
- 范围：`01-SiteV2/site/assets/app.js`、`01-SiteV2/site/assets/styles.css`。
- 已完成：信号列表、历史信号、相关观察从大行高 / 表格感改为紧凑、高端的商业情报索引式排版。
- 已完成：动态内容渲染清理 Markdown 残留，前台不再出现 `### 发生了什么`。
- 已完成：机会详情页正文改为文章式渲染，移动端详情页强制单列，避免长文本窄列撑爆页面。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs`、`node agent-workflow/tools/run-quality-gates.mjs syntax` 均通过。
- 截图与 QA：`agent-workflow/reports/v2-premium-layout-fix-2026-05-08/`，最终抽查桌面 / 移动首页、信号页、机会详情页无横向溢出、无 Markdown 残留。
- 收口记录：`agent-workflow/reports/WSD-20260508-06-v2-premium-layout-fix-closeout.md`。

# 2026-05-08 V2 阅读优先视觉降噪修复

- 状态：已完成。
- 触发：用户指出页面仍存在大量不必要双横线、丑陋排版、阅读形式差、缺少美感。
- 范围：`01-SiteV2/site/assets/styles.css`。
- 已完成：降低背景网格强度，移除大部分硬分割线和双横线视觉切割。
- 已完成：首页入口区从表格线框改为轻纸面卡片；信号列表、相关观察、机会列表改为更柔和的阅读区块。
- 已完成：保留 VI 字体和色彩规则，不引入蓝紫科技感、霓虹、机器人或非品牌母题。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs`、`node agent-workflow/tools/run-quality-gates.mjs syntax` 均通过。
- 截图与 QA：`agent-workflow/reports/v2-reading-first-visual-fix-2026-05-08/`，桌面 / 移动抽查 6 个页面无横向溢出、无 Markdown 残留。
- 收口记录：`agent-workflow/reports/WSD-20260508-07-v2-reading-first-visual-fix-closeout.md`。

# 2026-05-08 V2 首屏页头双横线清理

- 状态：已完成。
- 范围：`01-SiteV2/site/assets/styles.css`。
- 已完成：移除页头和导航底部残留边框，关闭导致页头下方第二条线的页面网格伪元素，并清理首屏视觉区边框继承。
- 已验证：`node --check 01-SiteV2/site/assets/app.js` 通过；截图保存至 `agent-workflow/reports/v2-header-line-cleanup-2026-05-08/desktop-header.png`。
- 收口记录：`agent-workflow/reports/WSD-20260508-08-v2-header-line-cleanup-closeout.md`。

# 2026-05-08 V2 首页首屏图与导航边距校准

- 状态：已完成本轮校准。
- 范围：`01-SiteV2/site/index.html`、`01-SiteV2/site/assets/styles.css`、`01-SiteV2/site/assets/brand/home-hero-intelligence.png`。
- 已完成：首页右侧视觉改用 PNG 图像资产，不再使用 SVG 硬绘照片感，也不再塞真实栏目组件。
- 已完成：首屏图方向改为“山水远势 + AI 信号流 + 商业判断焦点”，用于表达洞察 AI 变化、把握商业大势。
- 已完成：导航 logo 左侧内边距收至 0，header 与 main 外沿保持同一左右边界。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs`、`node agent-workflow/tools/run-quality-gates.mjs syntax` 均通过。
- 截图与 QA：`agent-workflow/reports/v2-hero-image-nav-adjust-2026-05-08/`，桌面 2048 / 1440 和移动 390 均无横向溢出。
- 收口记录：`agent-workflow/reports/WSD-20260508-09-v2-hero-image-nav-adjust-closeout.md`。

# 2026-05-08 V2 首页商业内参式重排

- 状态：已完成本轮首页重排。
- 范围：`01-SiteV2/site/index.html`、`01-SiteV2/site/assets/app.js`、`01-SiteV2/site/assets/styles.css`。
- 已完成：首页从多段栏目堆叠改为“首屏判断 / 今日主判断 / 关键信号 / 延伸判断 / 轻归档”的商业内参式阅读路径。
- 已完成：移除首页原有入口卡片带来的重复导航感，降低 section 堆砌和卡片噪音。
- 已完成：今日关键信号改为纵向情报索引，相关观察收敛为 1 条，近期归档只展示前 4 条。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs`、`node agent-workflow/tools/run-quality-gates.mjs syntax` 均通过。
- 截图与 QA：`agent-workflow/reports/v2-homepage-editorial-redesign-2026-05-08/`，桌面 2048 / 1440 和移动 390 均无横向溢出。
- 收口记录：`agent-workflow/reports/WSD-20260508-10-v2-homepage-editorial-redesign-closeout.md`。

# 2026-05-08 V2 首页首屏图移除人物

- 状态：已完成。
- 范围：`01-SiteV2/site/assets/brand/home-hero-intelligence.png`。
- 已完成：移除首屏右侧图片中的人物，保留山水背景、AI 信号流、玻璃分析面板和平台质感。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs` 通过。
- 截图与 QA：`agent-workflow/reports/v2-hero-image-remove-person-2026-05-08/desktop-home-no-person.png`，首页无人物、无横向溢出。
- 收口记录：`agent-workflow/reports/WSD-20260508-11-v2-hero-remove-person-closeout.md`。

# 2026-05-08 V2 首页首屏图右侧裁切修复

- 状态：已完成。
- 范围：`01-SiteV2/site/assets/styles.css`。
- 已完成：收回首页首屏右侧视觉区的负向溢出定位，并将首页首屏图改为完整适配显示，避免右侧山体、玻璃面板和平台被页面外沿隐藏。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs`、`node agent-workflow/tools/run-quality-gates.mjs syntax` 均通过。
- 截图与 QA：`agent-workflow/reports/v2-hero-image-right-reveal-2026-05-08/`，桌面 2048 / 1440 和移动 390 均无横向溢出。
- 收口记录：`agent-workflow/reports/WSD-20260508-12-v2-hero-right-reveal-closeout.md`。

# 2026-05-08 V2 首页首屏图融合与左延展

- 状态：已完成。
- 范围：`01-SiteV2/site/assets/styles.css`。
- 已完成：首屏图片向左延展，移除白色覆盖层造成的交界分割线，改为图片自身横向 / 纵向渐隐遮罩；图片右侧锚定铺展，减少左侧空白同时保持右侧主体可见。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs`、`node agent-workflow/tools/run-quality-gates.mjs syntax` 均通过。
- 截图与 QA：`agent-workflow/reports/v2-hero-image-blend-extend-2026-05-08/`，桌面 2048 / 1440 和移动 390 均无横向溢出。
- 收口记录：`agent-workflow/reports/WSD-20260508-13-v2-hero-image-blend-extend-closeout.md`。

# 2026-05-08 V2 Workflow Skill Graph 升级

- 状态：已完成。
- 任务：`V2-WORKFLOW-SKILL-GRAPH-UPGRADE`。
- 范围：Workflow / PM 治理文档，不改页面、不改内容、不改自动化本体。
- 已完成：新增 `agent-workflow/v2/v2-workflow-skill-graph.md`，把八个长期 Agent、九个 V2 专项 Agent、项目规范、技能 / 插件能力、触发路由和质量闸门整理为可调度图谱。
- 已完成：明确技能只增强长期岗位，不替代长期 Agent；外部 skill / repo 必须记录来源、用途、风险、适配边界和安全审查。
- 已更新：`agent-workflow/v2/README.md`、`agent-workflow/execution/dispatch-board.md`、`agent-workflow/feature_list.json`、`docs/agent-handoff.md`。
- 已验证：`feature_list.json` JSON 解析通过；`node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 收口记录：`agent-workflow/reports/V2-WORKFLOW-SKILL-GRAPH-UPGRADE-closeout.md`。

# 2026-05-08 V2 全站商业情报产品质感升级

- 状态：已完成本地实现与截图验收；Netlify 暂停。
- 任务：`V2-SITE-QUALITY-AUTO / WSD-20260508-15-v2-site-design-copy-visual-system-autopilot`。
- 用户方向：不是生成网页，而是设计 AI 商业化产品；气质对齐 Apple / Linear / Stripe / PitchBook / Bloomberg / Notion，强调商业情报平台、AI 趋势内参、高端商业决策产品。
- 已按用户修正：本轮改用 `design-taste-frontend`、`gpt-taste`、`redesign-existing-projects`、`high-end-visual-design` 的 taste-skill 方向，避免前台做成 AI 后台、新闻页或 Admin 模板。
- 已完成：同步最新 VI SVG 组件库到 V2 站点，站内 `01-SiteV2/site/assets/vi-components/` 当前为 48 个 SVG。
- 已完成：首页加入“信号筛选 / 影响判断 / 机会观察”决策路径；栏目页头、情报卡片、热度行、详情页阅读母版统一改为商业内参 / 商业情报平台阅读逻辑。
- 已完成：详情页母版改为商业备忘录结构，移动端菜单与响应式阅读约束已修正。
- 已验证：`node --check 01-SiteV2/site/assets/app.js`、`node --check 01-SiteV2/site/dev-server.mjs`、`node agent-workflow/tools/run-quality-gates.mjs syntax` 均通过。
- 截图与 QA：`agent-workflow/reports/WSD-20260508-15-stage2-screenshots/`，覆盖 index / daily / signals / opportunities / brief / daily-detail / signal-detail / opportunity-detail 的桌面与移动端。
- 收口记录：`agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot-closeout.md`。

# 2026-05-08 V2 全站参考示意图补充

- 状态：已完成。
- 触发：用户要求后续“诊断后直接出参考图，不用等我确认”，每个页面都给参考示意图，供用户结合诊断优化意见回复。
- 范围：仅新增参考图与说明，不改 V2 页面实现代码。
- 已完成：新增 `agent-workflow/reports/WSD-20260508-15-reference-mockups/reference-mockups.html`，并导出 8 张页面参考图。
- 参考图覆盖：首页、今日要点、关键信号、机会解码、商业内参、今日要点详情、信号详情、机会详情。
- 输出目录：`agent-workflow/reports/WSD-20260508-15-reference-mockups/`。
- 已更新：`agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot-closeout.md` 追加参考图说明。

# 2026-05-10 V2-SITE-QUALITY-AUTO 失败关闭

- 状态：任务失败，不验收，已关闭。
- 任务：`V2-SITE-QUALITY-AUTO / WSD-20260508-15-v2-site-design-copy-visual-system-autopilot`。
- 用户裁决：任务失败，不验收，结束任务，给收口文件。
- 已完成：新增失败收口 `agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-failed-closeout.md`。
- 已更新：`agent-workflow/execution/dispatch-board.md` 标记为 `failed / not-accepted / closed`。
- 已更新：`agent-workflow/feature_list.json` 中 `GL-M4-035` 标记为 `failed`。
- 后续约束：此前 stage1 / stage2 / reference mockups / local-site-quality-pass 等结论不得作为验收基线或后续任务继承依据。

# 2026-05-11 V2 文案风格规范用户确认接受

- 状态：accepted / user-retained-scope-overrun。
- 任务：`V2-COPY-STYLE-SYSTEM / WSD-20260511-01-wavesight-copy-style-system`。
- 收口文件：`agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-closeout.md`。
- 调度验收意见：`agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-dispatch-review.md`。
- 调度曾识别问题：派发单要求 Stage 1 草案后停止等待用户确认，但 closeout 直接声明 Stage 2 merged；派发单禁止修改 `01-SiteV2/site/`，但 closeout 记录修改了站点页面、`app.js`、同步脚本和站点数据。
- 用户确认：2026-05-11 用户明确回复“接受，改动保留”。
- 当前处理：新版 `COPY.md`、`skills/guanlan-writing-style/` 和相关站点文案改动保留；看板更新为 `accepted / user-retained-scope-overrun`。
- 后续约束：本次接受不替代后续页面质量验收；页面 / 文案仍需按独立质检 Skill 审查，不得自验自收。

# 2026-05-11 页面与文案独立质检 Skill 验收

- 状态：accepted / independent-quality-gate-ready。
- 任务：`V2-PAGE-COPY-QUALITY-SKILL / WSD-20260511-03-v2-page-copy-quality-review-skill`。
- 收口文件：`agent-workflow/reports/WSD-20260511-03-v2-page-copy-quality-review-skill-closeout.md`。
- 已完成：新增 `agent-workflow/governance/page-copy-quality-review-skill.md`，建立观澜AI页面与文案七维独立质检标准。
- 已完成：新增 `agent-workflow/execution/TASK-page-copy-quality-review-template.md`，后续可直接派发独立质检窗口。
- 已更新：`AGENTS.md`、`agent-workflow/governance/current-context.md`、`agent-workflow/agents/qa-agent.md`、`agent-workflow/execution/dispatch-board.md`。
- 硬闸门：页面 / 文案 accepted 需总分不少于 58 / 70，且定位一致性、商业判断、文案自然度、可信度均不低于 8；开发窗口自验自收无效。
- 质量检查：`feature_list.json` JSON 解析通过，`closeout-queue.jsonl` 解析通过，收口箱已登记。
- 后续约束：页面 / 文案开发 closeout 后必须另派独立质检任务；独立质检未 accepted 前，调度窗口不得将页面 / 文案任务 accepted。

