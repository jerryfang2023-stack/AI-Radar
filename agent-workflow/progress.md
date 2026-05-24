# Progress｜当前进度

更新时间：2026-05-24
状态：current / V2.2 compact

本文件只保留当前可继承状态。流水账、过程报告、截图记录和无效任务记录不再作为新窗口上下文。

## 当前项目状态

- 项目：观澜 AI｜WaveSight AI。
- 版本：V2.2。
- 当前目标：保持 Source / Evidence / Asset / Editorial / Build / Review 链路可追溯、可验收、可继续执行。
- 默认入口：`AGENTS.md`、`context/`、当前派发单或 closeout。
- 高风险流程入口：`context/06-execution-harness.md`。
- 当前前台导航：今日观察 / 商业信号 / 趋势追踪 / 商业内参。

## 当前 Agent 与 Skill

- Product Commander：任务入口、产品判断、派发和验收。
- Intelligence Engine：来源、Raw、Pool、证据和判断资产。
- Experience & Editorial：内容结构、页面体验、VI、Typography、Copy-first。
- Build & Release：代码、脚本、质量门、发布状态。

原则：Agent 按流程节点设置，Skill 按能力模块沉淀；栏目能力优先做 Skill。

## 当前自动化

- `guanlan-daily-monitor`：PAUSED，手动触发，只产出 Raw / Pool / 监测日志 / 质量循环 / QC。
- `guanlan-daily-assets-chain`：PAUSED，手动触发，先运行 readiness，再生成资产卡和索引。
- `daily-observation-writer`：PAUSED，不自动写稿，不自动同步网站。

手动触发命令：

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=80 --max-cycles=3 --search-limit=70 --search-path-query-limit=2 --gdelt-query-limit=8 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=<YYYY-MM-DD>
```

## 当前已验收基座

- Source / Raw / Pool / Card 治理已完成并进入 `context/05-daily-monitoring.md`、`context/06-execution-harness.md`、`agent-workflow/product/evidence-and-routing-rules.md`、`agent-workflow/product/card-asset-copy-governance.md` 和相关 Skill。
- 商业信号卡：eligible `core_pool` + `raw_qc_decision=allow` 默认全部生成正式前台 `signal_card`。
- 前沿观点卡：`opinion_intake -> duplicate merge -> rating -> cardcopy -> site sync` 为固定顺序。
- Tags：`agent-workflow/product/tag-taxonomy.md` 为正式 taxonomy 真源，`check-tags` 已成为质量门。
- 今日观察三件套：Pitch 只选题，Writer 只写商业叙事，QC 只做可读性质检。
- 页面治理：页面 / 文案 / Typography 任务必须先有 Copy-first 与 Typography 表；桌面端优先。
- 搜索与去重：NewsAPI 退出活跃链路；Anysearch / Tavily / Exa / GDELT 日期归一到 `published_at`；搜索前跨入口去重。

## 最新接收项

- `WSD-20260523-rule-chain-consistency-audit`：accepted，规则链路一致性审计通过，`v2content`、tags、syntax、cardcopy 均通过。
- `WSD-20260524-dedupe-search-rule-sync`：accepted_with_fixes，修复旧 playbook / prompt 的 NewsAPI 残留，并禁止从 URL / title 推断发布时间。
- `WSD-20260524-column-filter-rail-alignment`：accepted / desktop_scope，今日观察、商业信号、趋势追踪筛选栏桌面首屏位置已对齐。

## 当前质量要求

- 自动化和脚本类任务至少运行相关 `node --check`。
- 每日监测、Raw / Pool / Card、页面 / 文案 / Typography 任务必须说明使用的 harness、固定读取、质量门和下游放行结论。
- 涉及每日监测必须检查 Raw / Pool / quality gate / QC / readiness。
- 页面任务必须先有 Typography 页面位置表和 Copy-first 文案表。
- 公开前台不得展示 Raw / Pool / gate / 字段 / 同步等内部生产语言。

## 当前限制

- 不推送 GitHub，除非用户明确恢复。
- 不部署 Netlify，除非用户明确恢复。
- 不恢复已删除链路。
- 不新增常驻栏目 Agent。
- 不把已删除文档写入新提示词。
