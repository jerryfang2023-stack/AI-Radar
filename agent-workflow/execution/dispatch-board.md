# Window Dispatch Board

更新时间：2026-05-04  
owner：`pm` / `workflow`  
状态：active

本文件是当前调度中枢窗口的任务看板。具体执行任务应在独立窗口完成，结束后回到调度中枢窗口提交 closeout 文件。

## 快捷口令

- `执行：<看板编号或 Task ID>`：读取已预生成派发单，输出独立窗口提示词。
- `派发：<任务描述>`：新增任务，生成任务 ID、派发单和执行窗口提示词。
- `收口：<closeout 文件路径>`：读取收口文件，验收并回填进度。
- `状态`：查看本看板。
- `看板`：查看 ready / running / review 任务。
- `下一批`：列出建议派发顺序。
- `加入看板：<优先级> <牵头 Agent> <任务描述>`：追加新任务。
- `阻塞：<task-id> <原因>`：标记阻塞并说明需要谁决策。

## 当前任务

| 看板编号 | Task ID | 状态 | 牵头 Agent | 任务 | 派发单 | 收口文件 | 下一步 |
|---|---|---|---|---|---|---|---|
| SYS-0 | WSD-20260504-00-dispatch-hub | accepted | workflow | 建立调度中枢窗口机制、派发模板、收口模板和 UTF-8 交接规则 | `agent-workflow/governance/window-dispatch-hub.md` | `agent-workflow/reports/WSD-20260504-00-dispatch-hub-closeout.md` | 已完成 |
| SYS-1 | WSD-20260504-06-board-driven-upgrade | accepted | workflow | 升级为任务看板驱动机制，预生成首批任务卡和派发单 | `agent-workflow/execution/dispatch-board.md` | `agent-workflow/reports/WSD-20260504-06-board-driven-upgrade-closeout.md` | 已完成 |
| SYS-2 | WSD-agent-github-capability-learning | accepted | workflow | 计划外收口：长期 Agent GitHub 外部能力学习、taste-skill 安装与安全审查 | `agent-workflow/execution/WSD-agent-github-capability-learning.md` | `agent-workflow/reports/WSD-agent-github-capability-learning-closeout-2026-05-04.md` | 已验收，外部 skill 安全审查规则已回填 |
| SYS-3 | WSD-page-dispatch-gate-rules | accepted | workflow / ui-ue / qa | 计划外收口：建立页面类任务派发硬闸门，要求 UI/UE 规范表、Dev 按表实现、QA 截图/测量验收 | `agent-workflow/reports/page-dispatch-gate-rules-2026-05-04.md` | `agent-workflow/reports/WSD-page-dispatch-gate-rules-closeout-2026-05-04.md` | 已验收；后续页面类任务必须套用新闸门 |
| SYS-4 | WSD-ui-ue-design-director-upgrade | accepted | workflow / ui-ue | 计划外收口：将 UI / UE Agent 原地升级为 UI / UE Design Director，强化 Art Direction、DESIGN v2、页面母版和审美阻塞权 | `agent-workflow/execution/ui-ue-design-director-upgrade-2026-05-04.md` | `agent-workflow/reports/WSD-ui-ue-design-director-upgrade-closeout-2026-05-04.md` | 已验收；后续首页 / 全站 UI / Admin / 海报任务必须先过 Design Director |
| SYS-5 | WSD-pm-module-governance | accepted | pm / workflow | 计划外收口：PM 新增功能门禁与“宁缺毋滥”模块生命周期治理，产品功能类任务必须先过 WAVE 评分和模块决策表 | `agent-workflow/reports/pm-module-governance-2026-05-04.md` | `agent-workflow/reports/WSD-pm-module-governance-closeout-2026-05-04.md` | 已验收；后续产品功能类任务不得直接进入 Dev |
| P0-1 | WSD-20260504-07-the-point-home-redesign-plan | accepted | strategy / pm | The Point 首页改版方向制定，突出价值，避免平庸 | `agent-workflow/execution/WSD-20260504-07-the-point-home-redesign-plan.md` | `agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md` | 已完成规划，进入 P0-1A 页面落地 |
| P0-1A | WSD-20260504-14-the-point-home-redesign-implementation | accepted | ui-ue / copy / dev / qa | The Point 首页页面设计、文案、开发和基础验收，全部修改完再回调度窗口交接 | `agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation.md` | `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md` | 已验收，The Point 首页改版落地完成 |
| P0-2 | WSD-20260504-09-homepage-hero-optimization-plan | accepted | strategy / pm / ui-ue / copy | 首页优化，重点是首屏海报图和第一屏价值表达 | `agent-workflow/execution/WSD-20260504-09-homepage-hero-optimization-plan.md` | `agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md` | 规划保留，需重新派发首页首屏 P0 落地任务 |
| P0-2A | WSD-20260504-13-homepage-hero-carousel-assets | void / abandoned | ui-ue / copy / dev / qa | 在派生工作树制作 3 张首页首屏轮播图，并替换当前首页首屏画面 | `agent-workflow/execution/WSD-20260504-13-homepage-hero-carousel-assets.md` | `agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md` | 已提前终止，无交付物，不可合并 |
| P0-2B | WSD-20260504-18-homepage-ui-copy-redesign | failed / not accepted | ui-ue / copy / dev / qa | 首页 UI / Copy 重设计执行尝试，用户复核判定未达到参考 demo 首页质感 | `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md` | `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md` | 不合并；后续改为网站 UI 优化任务与首页右侧海报图优化任务 |
| P0-3 | WSD-20260504-08-admin-console-requirements | accepted | pm | Admin 管理功能模块设计和页面设计，输出开发需求并推进执行 | `agent-workflow/execution/WSD-20260504-08-admin-console-requirements.md` | `agent-workflow/reports/WSD-20260504-08-admin-console-requirements-closeout.md` | 已完成需求规划，进入 P0-3A 工作台落地 |
| P0-3A | WSD-20260504-16-admin-console-p0-workbench-implementation | accepted | ui-ue / copy / dev / qa | Admin P0 单页工作台页面设计、前端实现和基础验收 | `agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation.md` | `agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md` | 已验收；Admin P0 工作台落地，后续由 P0-6 做前后台边界复查 |
| P0-4 | WSD-20260504-11-launch-readiness-plan | ready | pm / dev | 上线前准备：服务器、数据库、版本、备份、回滚、权限和部署方案 | `agent-workflow/execution/WSD-20260504-11-launch-readiness-plan.md` | `agent-workflow/reports/WSD-20260504-11-launch-readiness-plan-closeout.md` | 等待 `执行：P0-4` |
| P0-4A | WSD-20260504-17-netlify-preview-deploy | accepted | dev / pm / qa / workflow | 将当前项目部署到 Netlify 预览环境，并返回可访问链接 | `agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy.md` | `agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md` | 已验收，Netlify 预览链接可访问 |
| P0-4B | WSD-20260504-28-github-netlify-sync | ready | dev / workflow / qa | 同步已验收的网站代码和工作流文件到 GitHub，并更新 Netlify 预览站点部署 | `agent-workflow/execution/WSD-20260504-28-github-netlify-sync.md` | `agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md` | 等待 `执行：P0-4B`；必须排除 P0-2A / P0-2B failed 或 void 成果 |
| P0-5 | WSD-20260504-02-ui-screenshot-matrix | ready | ui-ue / qa | Signals / Daily / Opportunities / Trends UI 截图矩阵验收 | `agent-workflow/execution/WSD-20260504-02-ui-screenshot-matrix.md` | `agent-workflow/reports/WSD-20260504-02-ui-screenshot-matrix-closeout.md` | 等待 `执行：P0-5` |
| P0-6 | WSD-20260504-03-admin-boundary-qa | ready | qa | 普通前台与 Admin 边界复查 | `agent-workflow/execution/WSD-20260504-03-admin-boundary-qa.md` | `agent-workflow/reports/WSD-20260504-03-admin-boundary-qa-closeout.md` | 等待 `执行：P0-6`；需包含 `signals.html` 隐藏编辑弹窗源码风险 |
| P0-7 | WSD-20260504-15-signal-keyword-source-optimization | accepted | data / workflow / pm | 优化每日监测关键词和来源策略，补齐早期融资、新趋势、技术迭代、开发者生态和反证信号 | `agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization.md` | `agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md` | 已验收，等待下一次 ai-2 雷达运行观察质量 |
| P0-8 | priority-engine-2-2026-05-04 | accepted | data | Priority Engine 2.0 第一版模型形成 | `agent-workflow/execution/PLAN-priority-engine-2-2026-05-04.md` | `agent-workflow/reports/priority-engine-2-2026-05-04.md` | 已验收，进入 P0-8A 快速落地 |
| P0-8A | WSD-20260504-22-priority-engine-2-fast-track-implementation | accepted | pm / data / dev / workflow / qa | 合并 PM 确认、ai-2 提示词升级、Judgment Node 解析实现和 QA 验收，尽快开发上线 | `agent-workflow/execution/WSD-20260504-22-priority-engine-2-fast-track-implementation.md` | `agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md` | 已验收，本地可运行；Netlify 重新部署待授权链路处理 |
| P0-8B | WSD-20260504-23-ai-3-judgment-node-sync-gate | accepted | workflow / dev / data / qa | 升级 ai-3 统一同步闸门，加入 Priority Engine 2.0 Judgment Node 覆盖率与硬错误检查 | `agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate.md` | `agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md` | 已验收，ai-3 自动化本体与执行文档均已更新 |
| P0-9 | WSD-20260504-24-login-register-page-optimization | accepted | ui-ue / copy / dev / qa | 登录 / 注册页面优化，按页面与文案类新闸门完成设计、文案、开发和桌面 / 移动验收 | `agent-workflow/execution/WSD-20260504-24-login-register-page-optimization.md` | `agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md` | 已在当前窗口执行并验收；截图、交互检查和 syntax Quality Gate 均通过 |
| P0-10A | WSD-20260504-27-site-module-design-review | ready | pm / ui-ue | 升级后的 PM Agent 与 UI / UE Design Director 联合梳理网站模块、页面体系和设计规范，提出模块取舍、DESIGN v2 和后续优化建议 | `agent-workflow/execution/WSD-20260504-27-site-module-design-review.md` | `agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md` | 等待 `执行：P0-10A`；建议先于 P0-10 执行 |
| P0-10 | WSD-20260504-25-site-ui-design-direction | ready | ui-ue / strategy / pm / copy | 网站 UI 优化：由 Design Director 先输出全站 Art Direction、页面母版、DESIGN v2 草案和验收基线 | `agent-workflow/execution/WSD-20260504-25-site-ui-design-direction.md` | `agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md` | 等待 `执行：P0-10` |
| P0-11 | WSD-20260504-26-homepage-desk-visual-asset | ready | ui-ue / copy / dev / qa | 首页右侧海报图 / Intelligence Desk 样张优化，小任务聚焦首页右侧主视觉资产与移动端裁切 | `agent-workflow/execution/WSD-20260504-26-homepage-desk-visual-asset.md` | `agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md` | 等待 P0-10 方向确认后再执行 |
| P1-1 | WSD-20260504-10-mobile-design-system | ready | ui-ue / qa | 移动端设计独立任务：全站移动端设计规则与关键页面验收 | `agent-workflow/execution/WSD-20260504-10-mobile-design-system.md` | `agent-workflow/reports/WSD-20260504-10-mobile-design-system-closeout.md` | 等待 `执行：P1-1` |
| P1-2 | WSD-20260504-12-ai-assistant-product-plan | ready | strategy / pm | 观澜AI 助理产品规划：网页端或手机端与客户对话交流 | `agent-workflow/execution/WSD-20260504-12-ai-assistant-product-plan.md` | `agent-workflow/reports/WSD-20260504-12-ai-assistant-product-plan-closeout.md` | 等待 `执行：P1-2` |
| P1-3 | WSD-20260504-01-copy-audit | ready | copy | 全站前台 Copy 语气审计 | `agent-workflow/execution/WSD-20260504-01-copy-audit.md` | `agent-workflow/reports/WSD-20260504-01-copy-audit-closeout.md` | 等待 `执行：P1-3` |
| P1-4 | WSD-20260504-04-daily-brief-detail-productization | ready | pm / ui-ue / copy | Daily Brief 详情页产品化收口 | `agent-workflow/execution/WSD-20260504-04-daily-brief-detail-productization.md` | `agent-workflow/reports/WSD-20260504-04-daily-brief-detail-productization-closeout.md` | 等待 `执行：P1-4` |
| P1-5 | WSD-20260504-05-automation-first-run-log-review | ready | workflow / data | 自动化首跑与日志复查 | `agent-workflow/execution/WSD-20260504-05-automation-first-run-log-review.md` | `agent-workflow/reports/WSD-20260504-05-automation-first-run-log-review-closeout.md` | 等待 `执行：P1-5` |

## 使用建议

当前建议先执行：

1. `执行：P0-10A`
2. 如需立即更新远端站点，执行 `P0-4B`
3. `P0-10A accepted` 后执行或更新 `P0-10`
4. P0-10 accepted 后再执行 `P0-11`
5. `执行：P0-6`
6. `执行：P0-5`
7. `执行：P0-4`

如果需要新增任务，用：

```text
加入看板：P0 dev 修复某个明确页面问题
```
