---
task_id: WSD-20260507-12-v2-navigation-column-finalization
board_id: V2-4B
status: ready
date: 2026-05-07
owner: PM Agent / Strategy Agent / Copy Agent / Intelligence Data Agent
type: product-decision
automation_impact: future-impact-only
encoding: UTF-8
---

# V2-4B 导航与栏目收敛确认

## 0. 快速执行卡

- 看板编号：`V2-4B`
- Task ID：`WSD-20260507-12-v2-navigation-column-finalization`
- 任务类型：产品功能类 / 信息架构类
- 派发单：`agent-workflow/execution/WSD-20260507-12-v2-navigation-column-finalization.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-12-v2-navigation-column-finalization-closeout.md`
- 调度口令：`收口：WSD-20260507-12-v2-navigation-column-finalization`
- 是否可能影响自动化：未来会影响，本轮不得改自动化

执行窗口最短启动提示词：

```text
执行任务：WSD-20260507-12-v2-navigation-column-finalization
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260507-12-v2-navigation-column-finalization.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260507-12-v2-navigation-column-finalization-closeout.md。
回调度窗口：收口：WSD-20260507-12-v2-navigation-column-finalization
```

## 1. 任务目标

基于已验收的 `V2-4` 产品架构，形成可交给 UI/UE、Copy、Data、Dev 使用的最终导航与栏目收敛决策。

必须明确：
- V2 普通前台最终导航。
- `The Point` 移出一级导航后的模块名、引用位置和旧内容处理。
- `Trends` 移出一级导航后的资产位置、前台露出方式和旧内容处理。
- `Opportunities` 改名为 `机会解码` 后的英文 / 中文 / URL / 旧路径兼容建议。
- `商业内参` 作为会员 / 增值入口时的公开、登录、会员可见边界。

## 2. 非目标

- 不修改 `04-Site`。
- 不改生产内容源、同步脚本、`content-paths.json` 或 Netlify。
- 不做页面视觉稿。
- 不做自动化提示词切换。

## 3. 必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/v2/v2-product-architecture-prd.md`
4. `agent-workflow/v2/v2-algorithm-source-architecture.md`
5. `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
6. `agent-workflow/v2/v2-vi-design-direction.md`

## 4. 允许改动范围

- `agent-workflow/reports/WSD-20260507-12-v2-navigation-column-finalization-closeout.md`
- 如确需沉淀正式决策，可新增：
  - `agent-workflow/v2/v2-navigation-column-finalization.md`

## 5. 禁止改动范围

- `04-Site/`
- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-point/`
- `07-Opportunities/`
- `04-Site/config/content-paths.json`
- 生产同步脚本与长期自动化

## 6. 预期输出

必须输出：
- PM 新增功能门禁复核。
- WAVE 复核表。
- 最终导航决策表。
- 旧栏目迁移 / 保留 / 隐藏 / 后台化决策表。
- URL / 命名 / 前台文案边界建议。
- 对 `V2-8AUTO`、`V2-10`、`V2-11`、`V2-13` 的交接要求。

## 7. 验收标准

- 明确是否接受 `今日要点 / 关键信号 / 机会解码 / 商业内参` 作为 V2 导航。
- The Point / Trends 不再以独立一级栏目进入 Dev。
- 对旧内容和旧路径有不破坏性处理建议。
- 未修改生产站点和自动化。
- 运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并记录报告。
