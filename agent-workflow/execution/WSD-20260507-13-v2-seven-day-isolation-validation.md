---
task_id: WSD-20260507-13-v2-seven-day-isolation-validation
board_id: V2-7
status: ready
date: 2026-05-07
owner: V2 Source Intelligence Agent / V2 Signal Evidence Agent / V2 Heatmap Algorithm Agent / V2 Verification Agent
type: data-validation
automation_impact: future-impact-only
encoding: UTF-8
---

# V2-7 七日隔离验证

## 0. 快速执行卡

- 看板编号：`V2-7`
- Task ID：`WSD-20260507-13-v2-seven-day-isolation-validation`
- 任务类型：数据类 / 算法验证类 / QA 类
- 派发单：`agent-workflow/execution/WSD-20260507-13-v2-seven-day-isolation-validation.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-13-v2-seven-day-isolation-validation-closeout.md`
- 调度口令：`收口：WSD-20260507-13-v2-seven-day-isolation-validation`
- 是否可能影响自动化：未来会影响，本轮不得改生产自动化

执行窗口最短启动提示词：

```text
执行任务：WSD-20260507-13-v2-seven-day-isolation-validation
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260507-13-v2-seven-day-isolation-validation.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260507-13-v2-seven-day-isolation-validation-closeout.md。
回调度窗口：收口：WSD-20260507-13-v2-seven-day-isolation-validation
```

## 1. 任务目标

在 `06-content/v2/` 内执行 V2 算法和内容入库的七日隔离验证，验证新漏斗能否稳定产出：
- Raw 30-50 条。
- Pool 10-15 条。
- Structured 5-8 条。
- Front Signals 3 条。
- Deep Opportunity 0-1 条。
- Trend Context / HeatEvidence / Point Calibration 的日常关系记录。

第 7 天输出 1 份 weekly AI Brief sample。

## 2. 非目标

- 不写入 V1 生产内容目录。
- 不修改 `04-Site`。
- 不修改 `content-paths.json`。
- 不修改 `ai-2`、`ai-3`、`ai-the-point`。
- 不同步网站，不部署 Netlify。

## 3. 必须读取

1. `AGENTS.md`
2. `agent-workflow/v2/v2-algorithm-source-architecture.md`
3. `agent-workflow/v2/v2-directory-content-architecture.md`
4. `agent-workflow/v2/schemas/README.md`
5. `agent-workflow/v2/rules/README.md`
6. `agent-workflow/v2/v2-product-architecture-prd.md`

## 4. 允许改动范围

- `06-content/v2/`
- `agent-workflow/reports/WSD-20260507-13-v2-seven-day-isolation-validation-*.md`
- `agent-workflow/reports/WSD-20260507-13-v2-seven-day-isolation-validation-closeout.md`

## 5. 禁止改动范围

- V1 生产内容目录。
- `04-Site/`
- `04-Site/config/content-paths.json`
- 生产同步脚本。
- 长期自动化任务。
- Netlify 配置。

## 6. 阶段要求

每天必须写 stage summary，包含：
- 来源数量。
- 去重和剔除原因。
- Front Signal 选择理由。
- 二次搜索补强情况。
- HeatEvidence / Trend Context / Point Calibration 关系记录。
- 质量问题和次日修正建议。

第 7 天必须输出：
- 七日质量复盘。
- weekly AI Brief sample。
- 是否可进入生产自动化改造的建议。

## 7. 验收标准

- 七日数据均在 `06-content/v2/` 内。
- 至少 5 天完成完整 Raw -> Pool -> Structured -> Front Signal 链路。
- 至少 1 天输出 Deep Opportunity 候选或明确说明为何不输出。
- 第 7 天输出 weekly AI Brief sample。
- 未触碰生产自动化和正式网站。
- 运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并记录报告。
