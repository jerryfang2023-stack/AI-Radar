---
task_id: WSD-20260521-repair-20260520-vertical-solution-lane
date: 2026-05-21
status: ready
owner: Intelligence Engine / Build & Release
depends_on:
  - WSD-20260521-rerun-20260520-raw-pool-layered-search
---

# WSD-20260521 Repair 2026-05-20 Vertical Solution Lane

## 任务目标

对 2026-05-20 每日监测结果做 lane-specific backfill，只修复：

```text
importance_type=important_vertical_solution
current_gap=2/3
target=Raw lane >= 3
```

本任务不是重新跑全部监测，也不是生成内容。目标是补足一个合格的垂直行业解决方案 Raw 候选，并重新生成 / 更新对应 Raw、Pool、monitor log、quality gate 和 Daily Monitor QC。

## 必读

只读取以下文件：

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `skills/guanlan-daily-monitor/SKILL.md`
4. `skills/guanlan-monitor-quality-gate/SKILL.md`
5. `skills/guanlan-daily-monitor-qc/SKILL.md`
6. `agent-workflow/reports/WSD-20260521-rerun-20260520-raw-pool-layered-search-closeout.md`
7. `agent-workflow/reports/2026-05-20-guanlan-monitor-quality-gate.md`
8. `agent-workflow/reports/2026-05-20-guanlan-daily-monitor-qc.md`

按需读取：

- `agent-workflow/product/evidence-and-routing-rules.md`
- `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
- `01-SiteV2/content/11-databases/source-registry-v2.json`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`

禁止读取：

- 历史 V1 / V2.0 文档。
- 已删除、归档、过程、草稿文档。
- 与本 lane repair 无关的页面、文案、网站开发文档。

## 硬规则

- 不降低 Raw / Pool / core_pool 证据门槛。
- 不把 AI HOT、follow-builders、HN、RSS、搜索聚合文本直接当事实主证据。
- 不把首页、产品首页、目录页、文档目录、价格导航、README、包页、模型页、Marketplace listing、登录页、搜索结果页、SEO 页升入 core_pool。
- 新增或修复 Raw 必须有原始 URL、可读 `full_text`、`extraction_method`、`readability_score>=24`、snapshot / hash / key excerpts、非 index evidence object，并通过 `raw_qc_decision=allow`。
- `important_vertical_solution` 必须指向具体行业、具体业务流程或明确垂直场景，不能用泛泛产品发布、公司介绍或工具目录硬填。
- 不写今日观察。
- 不生成变化卡、案例卡、观点卡、趋势卡。
- 不更新前台网站。
- 不推送 GitHub。
- 不部署 Netlify。

## 建议补采方向

优先搜索以下类型的一手或高可信材料：

- 垂直行业 AI 解决方案发布。
- 医疗、金融、法律、制造、零售、客服、教育、物流等明确行业场景。
- 有客户案例、上线公告、产品 release、行业解决方案页面、云市场 solution、合作公告、监管或采购材料支撑的垂直应用。
- 能说明 AI 进入了哪个岗位、部门或流程，而不是只说“AI 工具能力”。

## 执行建议

1. 先读取 2026-05-20 quality gate 和 Daily Monitor QC，确认唯一 blocker 是 `important_vertical_solution=2/3`。
2. 用 lane-specific 搜索补采，只围绕 `important_vertical_solution`。
3. 对候选逐条过 Raw 证据门：
   - 原始 URL。
   - 可读全文。
   - `extraction_method`。
   - `readability_score>=24`。
   - snapshot/hash/key excerpts。
   - 非 index 页面类型。
   - `raw_qc_decision=allow`。
4. 更新 2026-05-20 Raw / Pool / monitor log / quality gate / Daily Monitor QC。
5. 如仍无法补足，输出 blocked closeout，不允许放宽规则。

## 验收标准

必须通过：

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node agent-workflow/tools/guanlan-monitor-quality-gate.mjs --date=2026-05-20
```

并满足：

- `importance_coverage_gaps=none`
- `pool_importance_coverage_gaps=none`
- `core_missing_full_text_count=0`
- `core_low_readability_count=0`
- `core_raw_qc_block_count=0`
- `core_raw_qc_degraded_count=0`
- Daily Monitor QC 返回 `allow`，或明确、有限范围的 `allow_with_degradation`；若仍 blocked，不得进入下游。

## Closeout 要求

完成后写：

```text
agent-workflow/reports/WSD-20260521-repair-20260520-vertical-solution-lane-closeout.md
```

closeout 必须包含：

- 是否 accepted / blocked。
- 新增或修复的 `important_vertical_solution` Raw 列表。
- Raw / Pool / quality gate / Daily Monitor QC 路径。
- 质量门结果。
- Daily Monitor QC 结果。
- 是否允许资产链继续执行。
- 所有验证命令结果。
