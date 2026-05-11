# V2 Workflow Skill Graph

日期：2026-05-08  
状态：accepted  
owner：`workflow` / `pm`  
任务：`V2-WORKFLOW-SKILL-GRAPH-UPGRADE`

## 1. 定位

本文件把 V2 长期 Agent、项目规范、可用技能和质量闸门整理成一张可调度的技能图谱。

它不是新增第九个基础 Agent，也不是创建临时 agent 的授权。它的作用是让调度中枢在派发任务时更快判断：

- 该任务属于哪个长期 Agent。
- 必须读取哪些规范和品牌 / 数据 / 文案文件。
- 可借用哪些本地技能或外部参考。
- 产物应写到哪里。
- 哪些质量闸门不能省略。

## 2. 图谱原则

1. 先按项目长期 Agent 分工路由，再按任务需要补技能。
2. 技能只增强岗位能力，不替代长期 Agent 的职责。
3. 涉及页面、文案、数据模型、自动化、部署、权限或商业化时，优先读取项目规范，技能输出必须适配观澜 AI。
4. 外部 skill / repo 只能作为方法参考；如安装、更新或执行脚本，必须写安全审查。
5. 任何结论必须沉淀到 `agent-workflow/`，不能只留在对话里。
6. 后续派发任务必须按 `agent-workflow/governance/skill-pattern-gate.md` 标注 Skill Pattern，明确 Tool Wrapper / Generator / Reviewer / Inversion / Pipeline 的组合顺序和硬停顿。

## 3. 长期 Agent 到技能映射

| Agent | 默认任务 | 必读项目文件 | 可用技能 / 参考 | 输出位置 | 禁止事项 |
|---|---|---|---|---|---|
| Strategy Agent | 产品定位、栏目取舍、商业化边界 | `strategy-single-source.md`、`product-strategy.md`、`column-architecture.md` | `market-researcher`、`research`、`deep-research` | `agent-workflow/reports/`、`agent-workflow/product/` | 不直接写页面实现，不越过 PM 门禁 |
| PM Agent | PRD、模块决策、路线图、验收标准 | `pm-agent.md`、`feature_list.json`、`prd/active/README.md` | `ab-test-setup`、`pricing-strategy`、`free-tool-strategy` 仅作方法参考 | `agent-workflow/prd/active/`、`agent-workflow/execution/` | 不把功能想法直接派 Dev |
| UI / UE Agent | 页面结构、视觉系统、审美验收 | `DESIGN.md`、`docs/brand/wavesight-ai-vi/`、`WSD-20260510-vi-home-daily-closeout.md`、`v2-vi-design-direction.md` | `design-taste-frontend`、`gpt-taste`、`redesign-existing-projects`、`high-end-visual-design`、`awesome-design-md` | `agent-workflow/reports/`、页面规范表 | 不重画 Logo，不用通用 AI 科技风替代 VI，不再使用 `frontend-design` |
| Copy Agent | 对外文案、标题、CTA、禁用语 | `COPY.md`、`DESIGN.md`、`strategy-single-source.md` | `copywriting`、`copy-editing`、`humanizer` | `agent-workflow/reports/`、派发单 Copy 表 | 不输出内部流程语，不替用户下最终判断 |
| Intelligence Data Agent | Signal / Trend / Opportunity / Point / Tag 关系治理 | `intelligence-data-model.md`、`signal-system.md`、`trend-model.md`、`tag-taxonomy.md` | `research`、`citation-manager`、`market-researcher` | `agent-workflow/product/`、`reports/`、`01-SiteV2/content/` | 不为清软提醒硬绑关系，不让 Tags 膨胀 |
| Dev Agent | 站点、脚本、同步、技术验证 | `dev-agent.md`、派发单、相关 PRD、V2 迁移文件 | `frontend-dev`、`fullstack-dev`、`browser-use`、`playwright-browser-automation` | `01-SiteV2/site/`、`agent-workflow/tools/`、closeout | 不越过范围改生产链路，不恢复旧 `04-Site` |
| QA / Acceptance Agent | 独立验收、截图、风险等级 | `qa-agent.md`、`quality-gates.md`、派发单 | `browser-use`、`playwright-browser-automation` | `agent-workflow/reports/` | 不自验自收，不把缺截图页面任务标 accepted |
| Workflow / Automation Agent | 调度、进度、交接、自动化说明 | `workflow-agent.md`、`window-dispatch-hub.md`、`agent-memory.md` | `neat-freak`、`skill-vetter`、`skill-scanner` | `dispatch-board.md`、`progress.md`、`docs/agent-handoff.md` | 不用临时 agent 代替长期文件分配 |

## 4. V2 专项 Agent 到技能映射

| V2 Agent | 触发任务 | 可借用技能 / 方法 | 关键交付 |
|---|---|---|---|
| V2 Strategy & Product Architecture Agent | V2 产品结构、AI 内参、热力图、会员价值 | `market-researcher`、`pricing-strategy`、`deep-research` | PRD、PM 门禁、WAVE、模块决策表 |
| V2 Source Intelligence Agent | 来源扩展、监测规则、来源分层 | `web-search-exa`、`multi-search-engine`、`news-summary`、`research` | 来源字典、监测规则、降级路径 |
| V2 Signal Evidence Agent | Raw 到 Signal / HeatEvidence | `research`、`citation-manager` | Signal 证据表、HeatEvidence、反证记录 |
| V2 Point / Builder Insight Agent | Builder 观点、分歧、反证 | `follow-builders`、`youtube-transcript`、`baoyu-youtube-transcript` | Point Fragment、观点簇、边界信号 |
| V2 Heatmap Algorithm Agent | 热力评分、三元组聚合、趋势阶段 | `research`、`spreadsheets:Spreadsheets` 仅作分析表格工具 | schema、评分规则、质量闸门 |
| V2 AI Brief Editorial Agent | 商业内参、周报 / 月报、长文表达 | `article-writer`、`copy-editing`、`citation-manager` | AIBriefIssue、内参模板、证据表达 |
| V2 VI / Design System Agent | VI、页面母版、内参视觉、动效 | `design-taste-frontend`、`gpt-taste`、`high-end-visual-design`、`redesign-existing-projects`、`awesome-design-md`；图像方向：`imagegen-frontend-web` | 页面母版、视觉资产规则、截图验收 |
| V2 Platform / Dev Migration Agent | 分支、迁移、数据生成器、部署隔离 | `frontend-dev`、`fullstack-dev`、`netlify:*` | 迁移方案、脚本、回滚和验证报告 |
| V2 Verification Agent | 黑盒验收、证据完整性、发布建议 | `browser-use`、`playwright-browser-automation`、`skill-vetter` | QA closeout、阻塞项、发布建议 |

## 5. 任务触发路由

| 用户任务信号 | 默认路由 | 必须补读 | 硬闸门 |
|---|---|---|---|
| “改页面 / 不高级 / 排版丑 / 移动端问题” | UI / UE + Copy + Dev + QA | VI、DESIGN、typography、motion、派发单页面规则 | 页面类硬闸门、截图、Design Director 评分 |
| “文案不对 / 内部话术 / 标题难懂” | Copy + QA | COPY、strategy、页面容器约束 | 文案类硬闸门、禁用语、边界检查 |
| “加功能 / 做图谱 / 新入口 / 新筛选” | PM + Strategy | PM 门禁、feature_list、strategy | WAVE、模块决策表，未过不进 Dev |
| “改数据模型 / 标签 / 关系 / schema” | Data + Dev + QA | 数据模型、tag-taxonomy、v2 schemas | 数据模型闸门、v2content、syntax |
| “每日自动化 / 内容入库 / 同步” | Workflow + Data + Dev + QA | automation policy、V2 rules、quality gates | 自动化闸门、失败降级、备份回滚 |
| “部署 / Netlify / GitHub / 生产切换” | Dev + PM + QA + Workflow | 发布前闸门、迁移方案、回滚方案 | 发布前闸门、权限、备份、回滚 |
| “学习 / 安装 / 引入外部 skill” | Workflow + QA | skill-vetter、agent-memory、tool-registry | 安全审查、来源记录、适配边界 |

## 6. Skill Pattern 路由

| 任务类型 | 默认 Skill Pattern | 质量重点 |
|---|---|---|
| 页面质感 / 全站 UI / VI | Tool Wrapper + Inversion + Pipeline + Reviewer | 先读 VI / 字体 / Copy，先诊断确认，再逐页实现和截图评分 |
| 文案审查 | Tool Wrapper + Generator + Reviewer | 先读 Copy / Strategy，再按表替换，最后禁用语和判断边界验收 |
| 产品功能 / 新模块 | Inversion + Reviewer + Generator | PM 门禁、WAVE、模块决策表未过不得进入 Dev |
| 新闻源 / 内容自动化 | Tool Wrapper + Pipeline + Reviewer | Source Registry、采集漏斗、失败降级、source/content gate |
| 内容长文 / 商业内参 | Generator + Reviewer + Pipeline | 模板结构、内容深度、证据链、入库和页面检查 |
| 部署 / GitHub / Netlify | Pipeline + Reviewer | 构建、预览、冒烟、回滚和发布建议 |
| 调度 / 收口 / 治理 | Generator + Reviewer | 固定模板记录，调度中枢按硬闸门验收 |

完整规则见：`agent-workflow/governance/skill-pattern-gate.md`。

## 7. 派发单新增要求

后续派发单如涉及技能使用，应在“执行窗口必须读取”或“外部 GitHub skill / repo 安全审查”中补充：

- 使用哪些本地技能或插件能力。
- 为什么这些技能适配当前 Agent，而不是替代长期 Agent。
- 哪些技能只作方法参考，不允许执行脚本。
- 若涉及联网、外部仓库、插件安装或脚本执行，closeout 必须写风险等级。
- Skill Pattern、Pattern 顺序、硬停顿和 Reviewer 证据。

## 8. 不适用边界

本图谱不改变以下项目事实：

- 八个长期 Agent 仍是基础治理底座。
- V2 专项 Agent 仍是岗位说明和工作流文件，不是临时线程。
- 不新增普通前台栏目。
- 不恢复 V1 `04-Site`。
- 不触碰 `09-ai-news-radar`。
- 不改变 Codex app 自动化本体。
- 不替代 `quality-gates.md`、`window-dispatch-hub.md`、`agent-memory.md` 或 `skill-pattern-gate.md`。

## 9. 后续建议

如 V2 后续进入更大规模并行，可把本图谱拆为：

- `agent-workflow/v2/agents/*.md`：每个 V2 专项 Agent 的岗位文件。
- `agent-workflow/governance/tool-registry.md`：正式登记技能、插件、外部仓库与安全结论。
- `agent-workflow/tools/check-dispatch-skill-graph.mjs`：检查派发单是否缺少必要技能 / 规范读取项。
