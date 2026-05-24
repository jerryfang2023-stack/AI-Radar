---
task_id: WSD-20260520-04-card-asset-governance
title: Card / 资产层治理
status: accepted_with_notes
owner: Intelligence Engine / Experience & Editorial
created_at: 2026-05-20
encoding: UTF-8
depends_on:
  - WSD-20260520-03-pool-routing-governance accepted
  - WSD-20260520-05-layered-search-and-lane-pool-governance accepted
next_task: none
---

# WSD-20260520-04｜Card / 资产层治理

## 1. 任务目标

治理 Card / 资产层，明确变化卡、案例卡、观点卡、趋势卡如何从 Pool 形成长期资产，保证标题、摘要、字段、证据边界和商业判断合格，同时符合观澜基础 Copy 规范。

本任务必须在 Pool / 分流层 closeout 被调度窗口验收后执行。

注意：本任务是 Card / 资产层规则治理，不等于运行每日资产链。2026-05-20 当日监测已通过 lane backfill 修复为 `allow_with_degradation`，如后续实际运行资产链，只能使用 Daily Monitor QC 允许的 eligible core_pool，不能使用 failed provider / index-only / community fact。

## 2. 必读文件

只读取：

1. `AGENTS.md`
2. `context/03-copy-style.md`
3. `context/05-daily-monitoring.md`
4. `context/06-execution-harness.md`
5. `agent-workflow/reports/WSD-20260520-01-source-layer-governance-closeout.md`
6. `agent-workflow/reports/WSD-20260520-02-raw-evidence-governance-closeout.md`
7. `agent-workflow/reports/WSD-20260520-03-pool-routing-governance-closeout.md`
8. `agent-workflow/reports/WSD-20260520-05-layered-search-and-lane-pool-governance-closeout.md`
9. `agent-workflow/product/card-asset-copy-governance.md`
10. `agent-workflow/product/evidence-and-routing-rules.md`
11. `skills/guanlan-copy-style/SKILL.md`
12. `skills/guanlan-copy-style-qc/SKILL.md`
13. `agent-workflow/automation-prompts/asset-card-generator.md`
14. `01-SiteV2/knowledge/10-Templates/`
15. `agent-workflow/tools/card-copy-style-gate.mjs`
16. `agent-workflow/tools/assert-guanlan-automation-readiness.mjs`

## 3. 治理问题

必须回答并落地：

- 什么 Pool 候选能生成变化卡。
- 什么材料能生成案例卡。
- follow-builders / 社区观点何时能生成观点卡。
- 趋势卡必须依赖多少变化 / 案例 / 观点。
- 卡片标题、摘要、字段是否执行 `guanlan-copy-style`。
- 卡片是否避免 AI 味、新闻摘要感和空泛趋势表达。
- Card QC 是否能拦住弱证据、弱判断、无商业变量的内容。

## 4. 可修改范围

允许修改：

- `agent-workflow/product/card-asset-copy-governance.md`
- `agent-workflow/automation-prompts/asset-card-generator.md`
- `skills/guanlan-copy-style/SKILL.md` 中与卡片短文案相关的规则
- `skills/guanlan-copy-style-qc/SKILL.md` 中与卡片短文案 QC 相关的规则
- `01-SiteV2/knowledge/10-Templates/`
- `agent-workflow/tools/card-copy-style-gate.mjs`
- `agent-workflow/tools/assert-guanlan-automation-readiness.mjs`

不得修改：

- Source / Raw / Pool 的核心规则，除非只是引用前三个 closeout 的结论。
- 今日观察自动写作。
- 2026-05-20 当日资产链执行，除非另派执行任务并先通过 readiness。
- 前台网站。
- GitHub / Netlify。

## 5. 验收闸门

必须运行：

```powershell
node --check agent-workflow/tools/card-copy-style-gate.mjs
node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs
```

如修改 JSON 或脚本，追加对应解析 / 语法检查。

## 6. Closeout 要求

写入：

```text
agent-workflow/reports/WSD-20260520-04-card-asset-governance-closeout.md
```

closeout 必须说明：

- 四类卡片的生成门槛。
- 卡片字段和标题 / 摘要规范。
- Copy Skill 和 QC Skill 如何介入。
- 哪些弱内容不得生成卡片。
- 是否执行了 Raw / Pool / Card 资产 Harness，是否允许下游继续。
- 验证结果。
- 是否可以恢复或继续执行资产链自动化。
