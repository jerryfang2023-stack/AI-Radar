---
date: 2026-05-17
status: completed
owner: intelligence-data-agent / workflow-agent / dev-agent
---

# Raw Evidence Schema Upgrade｜2026-05-17

## 背景

用户要求把 Raw 从“网页存档”升级为“原始证据仓库 + 内容加工入口”，用于支撑 Pool、变化卡、案例卡、观点卡、趋势卡、每日观察、商业内参和 AI 商业热力图。

## 已完成

- 新增 `agent-workflow/product/raw-evidence-schema.md`，固化 `raw-evidence-v2` 字段、证据门槛、状态流转和下游使用规则。
- 更新 `agent-workflow/tools/run-v2-daily-pipeline.mjs`：
  - Raw Markdown 档案新增来源信息、抓取质量、去重版本、结构化摘录、商业要素、`evidence_seed`、观澜评分、`usable_for`、`missing_information` 和 `raw_status`。
  - 每条 Raw 同目录生成机器可读 JSON 证据对象。
  - Pool 条目新增 `raw_json`、`extraction_quality`、`has_full_text`、`raw_semantic_hash`、`usable_for`、`key_excerpts`、`evidence_seed`、`missing_information`。
  - Raw 状态按 `indexed / candidate / pooled / ignored` 自动分流，避免所有 Raw 都进入重加工链路。
  - 高波动 / 社区来源不再按来源类型默认降级为 summary-only；脚本会先尝试抓原页面，并按实际结果写入 `source_volatility`、`capture_scope`、`visible_range`、`evidence_level`。
  - AI HOT 被明确处理为 `discovery_source`：优先回抓 `origin_url`，成功时正式 Raw 以原始页面为准；失败时才保存 AI HOT 可见文本 fallback，并标记 `source_role=discovery_source`、`evidence_level=discovery_only|weak_signal`。
- 新增 `agent-workflow/tools/v2-raw-evidence-gate.mjs`，检查 Raw JSON 字段完整性、摘录结构、评分范围、`usable_for` 和状态枚举。
- Raw 证据闸门已增加高波动 / 聚合字段检查，阻止重新出现 `summary-only-high-volatility-source` 这类按来源粗暴降级的状态。
- 更新 `agent-workflow/tools/run-quality-gates.mjs`，加入 `raw` 模式和 syntax 检查。
- 更新内容与自动化规范：
  - `01-SiteV2/content/README.md`
  - `agent-workflow/automation-prompts/daily-monitor-router.md`
  - `agent-workflow/automation-prompts/asset-card-generator.md`
  - `agent-workflow/automation-prompts/daily-observation-writer.md`
  - `agent-workflow/automation-prompts/case-signal-researcher.md`
  - `agent-workflow/automation-prompts/trend-report-writer.md`
  - `agent-workflow/automation-prompts/brief-periodical-writer.md`
  - `agent-workflow/product/source-intelligence.md`

## 新证据门槛

变化卡、案例卡、观点卡和今日观察的事实主证据必须满足：

```text
has_full_text = true
extraction_quality = high | medium
source_level = S | A | B
```

不满足门槛的 Raw 只能作为 discovery、热度或待补证线索。后续 Writer 不得用 `missing_information` 里的缺口编造客户、流程、数字或场景。

## 验证

- `node --check agent-workflow/tools/v2-raw-evidence-gate.mjs`：passed
- `node --check agent-workflow/tools/run-quality-gates.mjs`：passed
- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs`：passed
- `node agent-workflow/tools/v2-raw-evidence-gate.mjs --date=2026-05-17`：skipped，当日尚无 Raw originals 目录
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed

## 后续

- 下一次运行 `daily-monitor-router` 后，应执行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs raw --date=<YYYY-MM-DD>
```

- 旧日期 Raw 仍是旧结构；如要历史回填，需要单独派发迁移任务，不应混入本次 schema 升级。
