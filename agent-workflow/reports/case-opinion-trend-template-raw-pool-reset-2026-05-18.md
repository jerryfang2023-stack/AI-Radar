# 案例卡 / 观点卡 / 趋势卡模板重设｜Raw / Pool 对齐｜2026-05-18

## 结论

已按变化卡同一套 Raw / Pool 证据规则，重设案例卡、观点卡和趋势卡模板，并同步相关自动化提示。

新的共同原则：

- Raw 是证据底座。
- Pool 只是候选入口。
- C / M / 社区 / 聚合来源可以触发检索，但不得单独支撑事实资产。
- `missing_information` 是写作禁区提示，缺什么就写缺口，不能补戏。

## 已重设模板

### 案例卡

文件：`01-SiteV2/knowledge/10-Templates/case-card-template.md`

新增或强化：

- `asset_level`
- `evidence_gate`
- `raw_refs`
- `pool_refs`
- `primary_raw`
- `source_evidence`
- `key_excerpts`
- `business_elements`
- `evidence_seed`
- `missing_information`
- `case_event`
- `case_value`
- `supported_change`
- `customer_or_scene`

核心口径：

案例卡先写“对象和事件”，再说明它支撑哪条变化。不得写成公司百科、产品黄页或空泛赛道判断。

正式 / 前台案例卡必须至少有一条核心 Raw 证据：`has_full_text=true`、`extraction_quality=high|medium`、`source_level=S|A|B`。

### 观点卡

文件：`01-SiteV2/knowledge/10-Templates/opinion-card-template.md`

新增或强化：

- `opinion_evidence_gate`
- `opinion_capture`
- `source_volatility`
- `capture_scope`
- `evidence_level`
- `has_visible_text`
- `screenshot_path`
- `markdown_snapshot`
- `fact_claim_support`

核心口径：

观点卡证明的是“谁在何时何处说了什么”，不是证明观点中的事实成立。

观点中的公司动作、客户采用、收入、融资、市场规模等事实主张，必须另补 S/A/B 来源。没有补证前，不得进入变化卡、案例卡、趋势卡或前台文章的事实段落。

### 趋势卡

文件：`01-SiteV2/knowledge/10-Templates/trend-card-template.md`

新增或强化：

- `asset_level`
- `trend_evidence_gate`
- `threshold`
- `evidence_summary`
- `primary_raw_refs`
- `supporting_raw_refs`
- `raw_source_levels`
- `primary_source_count`
- `total_source_count`
- `watch_windows`
- `missing_information`

核心口径：

趋势卡不由单条新闻、单个观点或未回填的旧卡片生成。趋势成立必须汇总变化卡、案例卡、观点卡和 Raw 证据；观点卡只能说明预期和叙事，不能单独推动趋势成立。

## 已同步自动化提示

- `agent-workflow/automation-prompts/asset-card-generator.md`
- `agent-workflow/automation-prompts/case-signal-researcher.md`
- `agent-workflow/automation-prompts/trend-report-writer.md`

同步内容：

- 案例卡使用事实证据门槛。
- 观点卡使用观点捕获门槛。
- 趋势卡维护 `trend_evidence_gate` 和 `evidence_summary`。
- trend-report-writer 明确旧变化卡 / 旧案例卡未完成 Raw 回填时，只能作背景，不能作为趋势成立主证据。

## 既有资产迁移缺口

扫描现有资产：

- `01-SiteV2/knowledge/02-Case-Cards/`：23 张案例卡，23 张缺少新版 Raw 回源字段。
- `01-SiteV2/knowledge/03-Opinion-Cards/`：30 张观点卡，30 张缺少新版 Raw 回源字段。
- `01-SiteV2/knowledge/04-Trend-Cards/`：当前 0 张趋势卡。

这些旧案例卡和旧观点卡可以作为历史材料保留，但不应直接作为新前台事实资产或趋势成立依据。后续需要单独执行：

1. 案例卡 schema 迁移 + Raw 回填。
2. 观点卡 schema 迁移 + 原文摘录 / capture_scope 回填。
3. 旧卡片进入趋势卡前的证据门槛复核。

## 已修改文件

- `01-SiteV2/knowledge/README.md`
- `01-SiteV2/knowledge/10-Templates/case-card-template.md`
- `01-SiteV2/knowledge/10-Templates/opinion-card-template.md`
- `01-SiteV2/knowledge/10-Templates/trend-card-template.md`
- `agent-workflow/automation-prompts/asset-card-generator.md`
- `agent-workflow/automation-prompts/case-signal-researcher.md`
- `agent-workflow/automation-prompts/trend-report-writer.md`

## 验收口径

从本轮开始：

- 案例卡不能靠“公司名 + 标签 + 一句判断”入库。
- 观点卡不能用摘要替代原文摘录。
- 趋势卡不能靠单条新闻、单个观点或未回填 Raw 的旧资产成立。
- 前台事实必须能回看 Raw 原文或快照。
- 缺口必须明写，不得用模型补戏。
