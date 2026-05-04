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
| P0-1 | WSD-20260504-07-the-point-home-redesign-plan | dispatched | strategy / pm | The Point 首页改版方向制定，突出价值，避免平庸 | `agent-workflow/execution/WSD-20260504-07-the-point-home-redesign-plan.md` | `agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md` | 已输出执行窗口提示词，等待收口 |
| P0-2 | WSD-20260504-09-homepage-hero-optimization-plan | dispatched | strategy / pm / ui-ue / copy | 首页优化，重点是首屏海报图和第一屏价值表达 | `agent-workflow/execution/WSD-20260504-09-homepage-hero-optimization-plan.md` | `agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md` | 已输出执行窗口提示词，等待收口 |
| P0-2A | WSD-20260504-13-homepage-hero-carousel-assets | dispatched | ui-ue / copy / dev / qa | 在派生工作树制作 3 张首页首屏轮播图，并替换当前首页首屏画面 | `agent-workflow/execution/WSD-20260504-13-homepage-hero-carousel-assets.md` | `agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md` | 已输出派生工作树执行提示词，等待收口 |
| P0-3 | WSD-20260504-08-admin-console-requirements | dispatched | pm | Admin 管理功能模块设计和页面设计，输出开发需求并推进执行 | `agent-workflow/execution/WSD-20260504-08-admin-console-requirements.md` | `agent-workflow/reports/WSD-20260504-08-admin-console-requirements-closeout.md` | 已输出执行窗口提示词，等待收口 |
| P0-4 | WSD-20260504-11-launch-readiness-plan | ready | pm / dev | 上线前准备：服务器、数据库、版本、备份、回滚、权限和部署方案 | `agent-workflow/execution/WSD-20260504-11-launch-readiness-plan.md` | `agent-workflow/reports/WSD-20260504-11-launch-readiness-plan-closeout.md` | 等待 `执行：P0-4` |
| P0-5 | WSD-20260504-02-ui-screenshot-matrix | ready | ui-ue / qa | Signals / Daily / Opportunities / Trends UI 截图矩阵验收 | `agent-workflow/execution/WSD-20260504-02-ui-screenshot-matrix.md` | `agent-workflow/reports/WSD-20260504-02-ui-screenshot-matrix-closeout.md` | 等待 `执行：P0-5` |
| P0-6 | WSD-20260504-03-admin-boundary-qa | ready | qa | 普通前台与 Admin 边界复查 | `agent-workflow/execution/WSD-20260504-03-admin-boundary-qa.md` | `agent-workflow/reports/WSD-20260504-03-admin-boundary-qa-closeout.md` | 等待 `执行：P0-6` |
| P1-1 | WSD-20260504-10-mobile-design-system | ready | ui-ue / qa | 移动端设计独立任务：全站移动端设计规则与关键页面验收 | `agent-workflow/execution/WSD-20260504-10-mobile-design-system.md` | `agent-workflow/reports/WSD-20260504-10-mobile-design-system-closeout.md` | 等待 `执行：P1-1` |
| P1-2 | WSD-20260504-12-ai-assistant-product-plan | ready | strategy / pm | 观澜AI 助理产品规划：网页端或手机端与客户对话交流 | `agent-workflow/execution/WSD-20260504-12-ai-assistant-product-plan.md` | `agent-workflow/reports/WSD-20260504-12-ai-assistant-product-plan-closeout.md` | 等待 `执行：P1-2` |
| P1-3 | WSD-20260504-01-copy-audit | ready | copy | 全站前台 Copy 语气审计 | `agent-workflow/execution/WSD-20260504-01-copy-audit.md` | `agent-workflow/reports/WSD-20260504-01-copy-audit-closeout.md` | 等待 `执行：P1-3` |
| P1-4 | WSD-20260504-04-daily-brief-detail-productization | ready | pm / ui-ue / copy | Daily Brief 详情页产品化收口 | `agent-workflow/execution/WSD-20260504-04-daily-brief-detail-productization.md` | `agent-workflow/reports/WSD-20260504-04-daily-brief-detail-productization-closeout.md` | 等待 `执行：P1-4` |
| P1-5 | WSD-20260504-05-automation-first-run-log-review | ready | workflow / data | 自动化首跑与日志复查 | `agent-workflow/execution/WSD-20260504-05-automation-first-run-log-review.md` | `agent-workflow/reports/WSD-20260504-05-automation-first-run-log-review-closeout.md` | 等待 `执行：P1-5` |

## 使用建议

当前建议先执行：

1. `执行：P0-1`
2. `执行：P0-2`
3. `执行：P0-2A`
4. `执行：P0-3`
5. `执行：P0-4`

如果需要新增任务，用：

```text
加入看板：P0 dev 修复某个明确页面问题
```
