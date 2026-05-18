# WSD-20260518-v21-rule-workbench-cleanup-closeout

task_id: WSD-20260518-V21-RULE-WORKBENCH-CLEANUP
board_id: SYS-20
status: completed
recommended_status: accepted / v2.1-rule-cleanup
date: 2026-05-18
owner: workflow / data / ui-ue / dev

## 调度摘要

- 本次基于 `WSD-20260518-raw-pool-card-rules-closeout.md` 与 `WSD-20260518-grillme-strategy-product-closeout.md` 继续清理 V2.1 规则冲突。
- 重点清理对象：页面派发硬闸门、调度中枢规则、Agent 记忆、UI/UE 岗位说明、设计总纲、每日自动化看板、站点同步脚本和站点样式注释。
- 未触碰 `09-ai-news-radar`，未做 Git / Netlify 部署，未回滚既有脏工作区。

## 已清理的主要冲突

1. 页面类任务旧硬闸门冲突  
   旧规则要求 Design Director 证据化质检和移动端截图作为通用硬阻塞；当前 V2.1 已改为桌面端优先、Copy-first、调度复核和用户确认。  
   已更新 `TASK-window-dispatch-template.md`、`window-dispatch-hub.md`、`agent-memory.md`、`ui-ue-agent.md`、`DESIGN.md`。

2. 旧栏目命名冲突  
   将当前活规则中的 `Daily Brief / Signals / Opportunities / Trends / The Point / Front Signal / Structured Signal` 收敛为当前栏目口径：今日观察、商业信号、趋势追踪、商业内参、前沿观点、机会判断段落。

3. 旧每日自动化入口冲突  
   `v2-content-site-daily-update`、SYS-11、SYS-16 和 `V2-DAILY-AUTO` 已在看板标记为 historical / superseded，不再作为当前自动化入口。当前以 SYS-17 `guanlan-daily-monitor` 六线程生产链路为准。

4. 机会中心继续派发隐患  
   `V2-OPPORTUNITY-BRIEF-IMPLEMENT` 从 ready 改为 stale / do-not-dispatch；`V2-OPPORTUNITY-DESIGN` 改为 historical / superseded-by-v2.1。机会判断不再作为一级页面直接开发，只能作为趋势追踪或商业内参中的判断段落重新过 PM / Copy-first / UI/UE。

5. 收口箱工作台残留  
   `agent-workflow/inbox/closeout-queue.jsonl` 中多条 2026-05-10 至 2026-05-12 的 `ready_for_review` / `ready_for_independent_review` 旧记录会误导调度窗口继续验收已废弃任务。已统一标记为 `processed`、`processed_historical` 或 `processed_void`，并追加本次 SYS-20 收口记录。

6. 站点生成脚本路径隐患  
   `sync-v2-site-data.mjs` 仍读 `10-databases/risks`，会导致 V2.1 风险库漏读。已修正为 `09-databases/risks`。

7. 站点 V2.0 / 失败任务残留  
   清理了站点样式注释中的 `V2-SITE-QUALITY-AUTO Stage 2` 失败任务名，改为 V2.1 中性说明；将前端函数 `selectedDailyOpportunities` 改为 `selectedDailyTrendReports`，避免旧机会模块命名继续污染当前代码语义。

## 保留但标记为历史的内容

- `V2-SITE-QUALITY-AUTO`、`Front Signal / Structured Signal`、旧机会设计、旧每日自动化等在看板中保留为历史记录，但不再作为当前任务派发依据。
- `01-SiteV2/site/assets/vi-components/*opportunity*.svg` 属于 VI 符号资产，不等同于机会中心页面，暂不删除。
- 历史 closeout 和历史看板行不做物理删除，避免丢失追溯链；当前口径通过 `historical / superseded / do-not-dispatch` 明确隔离。

## 验证

- `node --check 01-SiteV2/site/assets/app.js`：passed。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`：passed。
- `feature_list.json`、`site-content.json`、`site-content.js` 解析：passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。
- 最新报告：`agent-workflow/reports/quality-gates-syntax-latest.md`。

## 未处理和风险

- 工作区仍有大量历史新增 / 删除 / 内容变更，属于本轮之前已存在的脏工作区状态；本轮未尝试回滚或物理删除。
- 当前只清理活规则和明显代码语义隐患；如果要彻底移除旧历史内容目录、旧 V1 入站内容和旧页面数据，需要另行定义“内容资产迁移后物理清理”范围。
- 未执行浏览器截图和 Netlify 部署，本轮不属于页面视觉验收或发布任务。
