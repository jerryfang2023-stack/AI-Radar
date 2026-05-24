---
task_id: WSD-20260520-02-raw-evidence-governance
title: Raw / 证据层治理
status: ready
owner: Intelligence Engine
created_at: 2026-05-20
encoding: UTF-8
depends_on: WSD-20260520-01-source-layer-governance accepted
next_task: WSD-20260520-03-pool-routing-governance
---

# WSD-20260520-02｜Raw / 证据层治理

## 1. 任务目标

治理 Raw / 证据层，确认每条材料是否有原文、full text、快照、source level、hash、摘录和证据缺口，防止垃圾页、薄文本、官网首页、目录页、搜索结果页和无法回源材料进入下游。

本任务必须在 Source / 采集层 closeout 被调度窗口验收后执行。

## 2. 必读文件

只读取：

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `agent-workflow/reports/WSD-20260520-01-source-layer-governance-closeout.md`
4. `skills/guanlan-daily-monitor/SKILL.md`
5. `skills/guanlan-monitor-quality-gate/SKILL.md`
6. `skills/guanlan-daily-monitor-qc/SKILL.md`
7. `agent-workflow/product/evidence-and-routing-rules.md`
8. `agent-workflow/product/daily-monitoring-playbook.md`
9. `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`
10. `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
11. `agent-workflow/tools/guanlan-monitor-quality-gate.mjs`

## 3. 治理问题

必须回答并落地：

- 先审计 `WSD-20260520-01-source-layer-governance-closeout.md` 中已经越界修改的 Raw-to-Pool、QC 和 quality gate 内容，判断哪些纳入 Raw 证据层，哪些留给 Pool 层，哪些需要回退或改写表述。
- Raw 必填字段是否足够支撑下游判断。
- full text / snapshot / hash / excerpt 缺失时如何降级。
- `evidence_object_type`、`event_evidence`、`index_only_evidence` 是否能识别垃圾页和目录页。
- 官网首页、产品页、文档页、价格页、README、包索引、模型索引如何默认降级。
- 低质量中文官网、工具平台官网、SEO 页面如何拦截。
- Raw QC 如何输出明确的 block / allow_with_degradation / allow。

## 4. 可修改范围

允许修改：

- `agent-workflow/product/evidence-and-routing-rules.md`
- `skills/guanlan-monitor-quality-gate/SKILL.md`
- `skills/guanlan-daily-monitor-qc/SKILL.md`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`
- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- `agent-workflow/tools/guanlan-monitor-quality-gate.mjs`
- `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`

不得修改：

- Source 入口比例和来源池，除非是修复 Source closeout 明确遗留的问题。
- Pool 路由策略。
- 卡片生成规则。
- 前台网站。

## 5. 验收闸门

必须运行：

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('01-SiteV2/content/11-databases/monitor-quality-gate-v2.json','utf8')); console.log('json ok')"
```

## 6. Closeout 要求

写入：

```text
agent-workflow/reports/WSD-20260520-02-raw-evidence-governance-closeout.md
```

closeout 必须说明：

- 如何处理 Source 层 closeout 的越界改动。
- Raw 证据字段是否调整。
- 哪些页面类型会被硬降级。
- full text / snapshot / hash 缺失如何处理。
- QC 和 hard gate 的变化。
- 验证结果。
- 是否建议解锁 Pool / 分流层任务。
