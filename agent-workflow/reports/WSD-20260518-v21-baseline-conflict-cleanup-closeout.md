# WSD-20260518 V2.1 基座冲突清理收口

日期：2026-05-18  
owner：`workflow / strategy / data / dev`  
状态：accepted  
编码：UTF-8

## 1. 任务目标

基于以下两个收口文件，检查与历史活文档的冲突和前后矛盾，以新文件为基座更新历史口径，并将网站版本从 V2.0 升级为 V2.1。

- `agent-workflow/reports/WSD-20260518-grillme-strategy-product-closeout.md`
- `agent-workflow/reports/WSD-20260518-raw-pool-card-rules-closeout.md`

## 2. 当前结论

V2.1 当前基座已经确立：

- 战略 / 产品 / 栏目 / 写作 / 页面方向：以 `WSD-20260518-GRILLME-STRATEGY-PRODUCT` 为准。
- Raw / Pool / Card / 证据 / 自动化：以 `WSD-20260518-RAW-POOL-CARD-RULES` 为准。
- 旧 V2.0 只作为历史阶段名称保留在旧报告、旧派发单和历史进度中，不作为当前执行口径。

## 3. 已清理的主要冲突

- 旧 `V2.0` 当前版本口径：更新为 V2.1。
- 旧 `daily-monitor-router`：不再作为当前自动化名，当前为 `guanlan-daily-monitor`。
- 旧 `v2-content-site-daily-update`：不再作为当前自动化本体，当前为六线程生产链。
- 旧 `unified-site-sync`：不再作为当前发布闸门，当前按 V2 quality gates 和 Raw-first 证据规则验收。
- 旧 `10-databases` 当前路径：更新为 `09-databases`。
- 旧 V1 归档读取路径：当前仓库已物理移除，只能通过 Git 历史追溯。
- 前台 `可信边界` 表达：改为观察边界 / `capture_scope`；`可信边界` 仅保留在 writer 禁用词清单中作为“不要写”的提醒。
- 旧“AI 新闻站 / 热点导航 / 工具目录 / 机会列表 / 评分前台化”产品口径：改为“面向商业决策者的 AI 机会判断系统”。

## 4. 修改文件

- `AGENTS.md`
- `docs/agent-handoff.md`
- `docs/README.md`
- `agent-workflow/governance/current-context.md`
- `agent-workflow/governance/automation-fallback-policy.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/product/raw-evidence-schema.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/daily-monitoring-playbook.md`
- `agent-workflow/product/pool-routing-rules.md`
- `01-SiteV2/README.md`
- `01-SiteV2/site/README.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`

## 5. 网站版本升级

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs` 已写入 `meta.version = "V2.1"`。
- 当前 `01-SiteV2/site/data/site-content.json` 已写入 `meta.version = "V2.1"`。
- 当前 `01-SiteV2/site/data/site-content.js` 已写入 `meta.version = "V2.1"`。
- 网站页脚显示：`© 2026 WaveSight AI · V2.1`。

## 6. 验证结果

已通过：

- `node --check 01-SiteV2/site/assets/app.js`
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `agent-workflow/feature_list.json` 解析
- `01-SiteV2/site/data/site-content.json` 解析
- `01-SiteV2/site/data/site-content.js` 解析
- `node agent-workflow/tools/run-quality-gates.mjs syntax`

最新 syntax 报告：

- `agent-workflow/reports/quality-gates-syntax-2026-05-18-20260518-070649.md`

## 7. 保留说明

历史派发单、旧报告、旧 progress 深层记录和旧归档内容中仍可能出现旧词。这些内容保留为历史记录，不作为当前执行口径。本次只清理会被新窗口默认读取、派发、验收、自动化或站点版本使用的活文档。

## 8. 后续建议

1. 派发旧变化卡 / 案例卡 / 观点卡 schema 迁移与 Raw 回填。
2. 按 V2.1 写作规范重跑 `daily-observation-writer`。
3. 按补厚后的卡片和 Raw 证据重构商业信号前台页面。

