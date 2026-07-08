---
task_id: WSD-20260521-rerun-20260520-raw-pool-layered-search
title: 按新分层搜索方式重跑 2026-05-20 Raw / Pool
status: ready
owner: Intelligence Engine / Build & Release
created_at: 2026-05-21
encoding: UTF-8
depends_on:
  - WSD-20260520-01-source-layer-governance accepted
  - WSD-20260520-02-raw-evidence-governance accepted
  - WSD-20260520-03-pool-routing-governance accepted
  - WSD-20260520-05-layered-search-and-lane-pool-governance accepted
replaces:
  - WSD-20260520-daily-monitor-offtopic-repair
---

# WSD-20260521｜按新分层搜索方式重跑 2026-05-20 Raw / Pool

## 1. 任务目标

废弃“只修 off-topic 噪音”的小修思路，按最新分层搜索与六 lane Pool 治理重新跑 2026-05-20 的 Raw / Pool / 监测日志 / quality gate / Daily Monitor QC。

本任务目标是重新生成当天监测基础产物，而不是在旧 Raw 文件上手工删噪音。

## 2. 必读文件

只读取：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/05-daily-monitoring.md`
4. `skills/guanlan-daily-monitor/SKILL.md`
5. `skills/guanlan-monitor-quality-gate/SKILL.md`
6. `skills/guanlan-daily-monitor-qc/SKILL.md`
7. `agent-workflow/reports/WSD-20260520-01-source-layer-governance-closeout.md`
8. `agent-workflow/reports/WSD-20260520-02-raw-evidence-governance-closeout.md`
9. `agent-workflow/reports/WSD-20260520-03-pool-routing-governance-closeout.md`
10. `agent-workflow/reports/WSD-20260520-05-layered-search-and-lane-pool-governance-closeout.md`
11. `agent-workflow/execution/WSD-20260521-rerun-20260520-raw-pool-layered-search.md`

按需读取：

- `agent-workflow/product/daily-monitoring-playbook.md`
- `agent-workflow/product/evidence-and-routing-rules.md`
- `agent-workflow/product/source-intelligence.md`
- `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
- `01-SiteV2/content/11-databases/source-registry-v2.json`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`

不要读取 V1 / V2.0 历史文档，不要读取已删除规则文件，不要复用旧 `offtopic-repair` 方案。

## 3. 执行边界

允许：

- 备份或覆盖 2026-05-20 旧 Raw / Pool / monitor log / quality gate / QC 产物。
- 使用最新分层搜索、Tavily / Exa / NewsAPI / GDELT / DuckDuckGo / Bing fallback、六 lane guardrail 重新跑 Raw / Pool。
- 重新生成 2026-05-20 monitor log、quality gate、Daily Monitor QC。
- 如发现脚本小 bug，可以修复与此次重跑直接相关的问题。

不得：

- 只手工删除 off-topic 条目来伪造通过。
- 改 Source / Raw / Pool 基础治理原则。
- 改 Card / 资产层规则。
- 写今日观察。
- 生成变化卡 / 案例卡 / 观点卡 / 趋势卡。
- 更新前台网站。
- 推送 GitHub 或部署 Netlify。

## 4. 执行命令

使用新命令形态：

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=2026-05-20 --pass-score=80 --max-cycles=3 --search-limit=70 --search-path-query-limit=2 --gdelt-query-limit=8 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000
```

## 5. 必须产出

- `01-SiteV2/content/01-raw/2026-05-20-raw-candidates.md`
- `01-SiteV2/content/01-raw/originals/2026-05-20/`
- `01-SiteV2/content/02-pool/2026-05-20-pool-candidates.md`
- `agent-workflow/reports/2026-05-20-guanlan-daily-monitor-log.md`
- `agent-workflow/reports/2026-05-20-guanlan-monitor-quality-gate.md`
- `agent-workflow/reports/2026-05-20-guanlan-daily-monitor-qc.md`

如果覆盖旧文件，closeout 必须说明旧文件如何处理，以及是否有备份 / 删除。

## 6. 新规则硬要求

- Raw 目标：80-150。
- 六 lane Raw guardrail：每类最低 3、目标 5。
- Pool 每类最低 1。
- Core Pool 每类最多 3，不强行填满。
- 通用搜索只作 fallback discovery，不能直接成为事实主证据。
- Tavily / Exa / NewsAPI 只提供发现或新闻线索；进入 `core_pool` 仍必须回源、Raw QC allow、非 index page、`importance_score >= 4`。
- AI HOT daily selected 全量保留在 Raw / Pool 审计范围，但不得自动进入 `core_pool`，也不得因渠道身份自动降级；必须回到原文后按统一证据门槛判定。
- follow-builders 是 Builder 观点入口，不是事实主证据。
- `S/A/B/C/D/M` 只作为来源类型、证据角色和使用边界，不作为内容价值加分。
- 不得恢复五类信号、`required_signal_classes` 或旧 commercial-value scoring。

## 7. 验收命令

必须运行：

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs
node -e "const fs=require('fs'); for (const f of ['01-SiteV2/content/11-databases/keyword-monitoring-v2.json','01-SiteV2/content/11-databases/source-registry-v2.json','01-SiteV2/content/11-databases/monitor-quality-gate-v2.json']) JSON.parse(fs.readFileSync(f,'utf8')); console.log('json ok')"
node agent-workflow/tools/guanlan-monitor-quality-gate.mjs --date=2026-05-20
```

如果 quality gate 和 Daily Monitor QC 允许下游，再运行：

```powershell
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=2026-05-20
```

## 8. Closeout 要求

写入：

```text
agent-workflow/reports/WSD-20260521-rerun-20260520-raw-pool-layered-search-closeout.md
```

closeout 必须说明：

- 是否覆盖 / 备份了旧 2026-05-20 Raw / Pool / reports。
- Raw 数量、Pool 数量、routed Pool 数量、core Pool 数量。
- 六 lane Raw / Pool 覆盖情况。
- off-topic title 是否通过。
- 首页 / 目录 / SEO / 工具页是否仍误入 core_pool。
- Tavily / Exa / NewsAPI / GDELT / AI HOT / follow-builders / keyword search 的来源分布。
- quality gate 结果和 Daily Monitor QC 结论。
- assets readiness 是否通过。
- 是否仍需人工修复。
