# 变化卡与 Raw / Pool 规则对齐检查｜2026-05-18

## 结论

本轮检查发现：旧变化卡模板和 `asset-card-generator` 规则已经落后于最新 Raw / Pool 规则，主要风险是“Pool 线索直接变成变化卡”“社区 / 聚合来源被误当事实证据”“变化卡缺少 Raw 原文回源字段”“下游写作字段污染变化卡”。

已完成第一轮清理：变化卡模板、知识库 README 和资产生成提示已改为 Raw-first / Evidence-first 口径。后续生成正式 / 前台变化卡，必须先通过 Raw 核心证据门槛。

## 已发现的冲突

### 1. 变化卡模板缺少 Raw 核心字段

旧模板只有 `original_sources`、`data_sources`、`source_level`、`data_level`，没有硬性保存：

- `raw_ref`
- `raw_archive`
- `raw_json`
- `full_text_hash`
- `key_excerpts`
- `business_elements`
- `evidence_seed`
- `missing_information`

这与 `raw-evidence-schema.md` 和 `pool-routing-rules.md` 冲突。Raw / Pool 新规则要求卡片必须能回源到原文、快照、结构化证据和缺口记录。

处理：已在 `change-card-template.md` 新增完整 Raw / Pool 回源字段。

### 2. Pool 线索可能被直接写成事实卡

旧规则说 Pool 不能直接支撑卡片，但补证规则仍偏松：只要求补至少 1 条 S/A/B 来源，未明确“补到后必须重新入 Raw，并通过核心门槛”。

处理：已明确正式 / 前台变化卡必须满足：

- `has_full_text=true`
- `extraction_quality=high|medium`
- `source_level=S|A|B`
- `usable_for.change=true`
- 保留 `raw_archive`、`raw_json`、`full_text_hash`

否则只能是 `needs_backfill` 或 `watchlist_only`。

### 3. 社区 / 聚合来源存在误用风险

旧变化卡规则没有清楚区分：

- AI HOT / follow-builders / search 作为发现入口；
- HN / X / Reddit 作为社区反馈；
- S/A/B 原始来源作为事实证据。

处理：已明确 C / M / 社区 / 聚合来源未补到 S/A/B 原始证据前，不得作为前台事实变化卡。

### 4. 旧模板混入下游内容字段

旧变化卡模板包含：

- `content_derivative_fit`
- `brief_upgrade_suggestion`
- `可二创角度`
- `可升级为内参的理由`

这些字段属于 Writer / 商业内参 / 二创流程，不属于变化卡的事实资产层。它们会诱导卡片先想“怎么写”“怎么发”，而不是先把事实和证据写厚。

处理：已从变化卡模板移除。

### 5. 旧字段表达不够精确

旧模板使用：

- `data_level`
- `credibility_boundary`

这些字段与新的 Raw 证据等级、Pool 分流、缺口字段不完全对应。

处理：已替换为：

- `asset_level`
- `evidence_gate`
- `source_evidence`
- `missing_information`
- `internal.evidence_boundary`

## 当前遗留问题

### 1. 既有变化卡尚未完成 schema 迁移

扫描 `01-SiteV2/knowledge/01-Change-Cards/` 发现，当前 24 张既有变化卡均缺少：

- `raw_json`
- `full_text_hash`
- `evidence_seed`
- `missing_information`

这意味着旧卡片可以作为历史材料保留，但不应直接进入新前台，除非完成 Raw 回填和证据门槛复核。

建议下一步单独执行“变化卡 schema 迁移 + Raw 回填”。

### 2. 案例卡 / 观点卡 / 趋势卡模板也有类似旧字段

本轮只清理变化卡链路。扫描发现案例卡、观点卡、趋势卡模板中仍存在 `source_level`、`data_level`、`credibility_boundary`、`可二创角度` 等旧字段。

建议后续按同一套 Raw / Pool 证据规则，逐一重设案例卡、观点卡和趋势卡模板。

## 已修改文件

- `01-SiteV2/knowledge/README.md`
- `01-SiteV2/knowledge/10-Templates/change-card-template.md`
- `agent-workflow/automation-prompts/asset-card-generator.md`

## 验收口径

从本轮开始，变化卡进入前台必须满足：

1. 事件讲清楚。
2. 原始证据能回看。
3. Raw 原文或快照可追溯。
4. 来源等级、抓取质量和缺口字段齐全。
5. 没有公开信息时写“暂无公开信息”，没有同类案例时写“暂未监测到同类案例”，不得补戏。
6. 社区 / 聚合 / 弱线索只能进 Watchlist，不能变成前台事实。
