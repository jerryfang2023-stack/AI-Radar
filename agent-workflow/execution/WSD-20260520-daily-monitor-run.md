---
task_id: WSD-20260520-daily-monitor-run
title: 执行 2026-05-20 每日监测任务
status: ready
owner: Intelligence Engine / Build & Release
created_at: 2026-05-20
encoding: UTF-8
depends_on:
  - WSD-20260520-01-source-layer-governance accepted
  - WSD-20260520-02-raw-evidence-governance accepted
---

# WSD-20260520｜执行今日每日监测任务

## 1. 任务目标

执行 2026-05-20 的 `guanlan-daily-monitor`，生成当天 Raw / Pool / 监测日志 / 质量循环 / Daily Monitor QC。

本任务只执行每日监测，不写今日观察，不生成完整卡片，不更新前台网站，不推送 GitHub，不部署 Netlify。

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

按需读取：

- `agent-workflow/product/daily-monitoring-playbook.md`
- `agent-workflow/product/evidence-and-routing-rules.md`
- `agent-workflow/product/source-intelligence.md`
- `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
- `01-SiteV2/content/11-databases/source-registry-v2.json`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`

不要读取历史 reports、旧 V1/V2.0 文档、已删除规则文件或旧 pipeline 文档。

## 3. 执行命令

使用 Asia/Shanghai 日期 `2026-05-20`。

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=2026-05-20 --pass-score=80 --max-cycles=3 --search-limit=30 --search-path-query-limit=1 --gdelt-query-limit=4 --hn-limit=20 --fetch-timeout-ms=10000 --snapshot-timeout-ms=8000
```

## 4. 必须产出

- `01-SiteV2/content/01-raw/2026-05-20-raw-candidates.md`
- `01-SiteV2/content/01-raw/originals/2026-05-20/`
- `01-SiteV2/content/02-pool/2026-05-20-pool-candidates.md`
- `agent-workflow/reports/2026-05-20-guanlan-daily-monitor-log.md`
- `agent-workflow/reports/2026-05-20-guanlan-monitor-quality-gate.md`
- `agent-workflow/reports/2026-05-20-guanlan-daily-monitor-qc.md`

如当天已有同名文件，先检查是否为未完成或旧规则产物；不要盲目覆盖，必须在 closeout 说明处理方式。

## 5. 执行要求

- Raw 正常目标：80-150；低信号或来源失败日可降级为 50-80，并写清原因。
- Pool 目标：20-40。
- Raw 和 Pool 覆盖六类 `importance_type`。
- AI HOT daily selected 全量进入 Raw / Pool 审计范围，但不能自动进入 `core_pool`，也不能因渠道身份自动降级；必须回到原文后按统一证据门槛判定。
- follow-builders 是 Builder 观点入口，不是事实主证据。
- `S/A/B/C/D/M` 只作为来源类型、证据角色和使用边界，不作为内容价值加分。
- `core_pool` 必须通过 Raw QC，不能包含 `raw_qc_decision=block` 或 `allow_with_degradation`。
- 官网首页、产品目录、文档目录、README、包页、模型页、搜索结果页和中文 SEO 页默认降级或阻断，除非同页证明具体新动作。
- 今日观察自动写作当前为 `PAUSED`，不得触发。
- GitHub / Netlify 仍为 paused-by-user，不得推送或部署。

## 6. 验收命令

至少运行：

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs
node -e "const fs=require('fs'); for (const f of ['01-SiteV2/content/11-databases/keyword-monitoring-v2.json','01-SiteV2/content/11-databases/source-registry-v2.json','01-SiteV2/content/11-databases/monitor-quality-gate-v2.json']) JSON.parse(fs.readFileSync(f,'utf8')); console.log('json ok')"
```

如果监测结果允许下游资产链，再运行：

```powershell
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=2026-05-20
```

## 7. Closeout 要求

写入 UTF-8 closeout：

```text
agent-workflow/reports/WSD-20260520-daily-monitor-run-closeout.md
```

closeout 必须说明：

- Raw 数量、Pool 数量。
- AI HOT / follow-builders / keyword / HN / GDELT / media / official 等来源分布。
- 六类 `importance_type` 覆盖情况。
- `core_pool` 数量与 Raw QC 决策情况。
- 被硬降级或阻断的典型垃圾页 / 首页 / 目录页。
- quality gate 分数和 Daily Monitor QC 结论：`allow` / `allow_with_degradation` / `block`。
- 是否通过 assets readiness。
- 未执行或失败的来源、降级原因和风险。

完成后回调度窗口：

```text
收口：agent-workflow/reports/WSD-20260520-daily-monitor-run-closeout.md
```
