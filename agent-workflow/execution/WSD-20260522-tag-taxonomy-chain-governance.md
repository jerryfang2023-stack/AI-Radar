---
task_id: WSD-20260522-tag-taxonomy-chain-governance
title: Raw / Pool / Card 标签体系链路治理
date: 2026-05-22
status: ready
owner: Intelligence Engine / Build & Release / Product Commander
encoding: UTF-8
---

# WSD-20260522 Tag Taxonomy Chain Governance｜Raw / Pool / Card 标签体系链路治理

## 1. 任务目标

本任务治理观澜 AI 当前 tags 体系在 Raw / Pool / Card / Candidate / Site Sync 全链路中的使用一致性。

当前已确认：

- 正式标签真源为 `agent-workflow/product/tag-taxonomy.md`。
- 前台 `site-content.json` 当前使用的 tags 均能落入 `tagTaxonomy`，未发现未知 tag。
- 但生成侧仍存在不一致：部分脚本硬编码了正式 taxonomy 未登记的 tag id，例如 `track-ai-startup`、`track-vertical-ai`、`stage-proven`、`evidence-market-signal`、`source-original-or-registry` 等。
- Raw / Pool 阶段不应被误当成正式标签层；它们可以保存主题、来源、lane、证据类型和 tag hints，但正式 `formal_tags` 应在 Card / Candidate / Report 等资产层生成和校验。

目标是让标签体系形成单一口径：

```text
tag-taxonomy.md
-> 生成侧 tag normalization
-> Card / Candidate formal_tags
-> Site sync tagTaxonomy
-> 前台筛选 / 搜索 / 关系网络
```

## 2. 调度边界

允许：

- 审计所有 Raw / Pool / Card / Candidate / Site Sync 中的 tag 生成、推断、同步和前台使用。
- 修改标签治理文档、模板、生成脚本、同步脚本和质量门脚本。
- 新增轻量 tag 检查脚本，例如 `agent-workflow/tools/check-tags.mjs`。
- 在不改变业务含义的前提下，将明显无效或未登记 tag 映射到正式 tag。
- 输出需要用户确认的新增标签候选表。

不允许：

- 新增一级导航。
- 把 Tags 做成前台一级栏目或长标签墙。
- 未经用户确认直接新增正式 tag。
- 用人物名、公司名、情绪词或一次性热词作为正式 tag。
- 用标签命中替代事实门禁、Raw / Pool QC、Card copy gate 或观点评级。
- 推送 GitHub 或部署 Netlify。

## 3. 最小读取

执行窗口必须读取：

1. `AGENTS.md`
2. `context/01-product-map.md`
3. `context/05-daily-monitoring.md`
4. `context/06-execution-harness.md`
5. `context/07-card-asset-stage-model.md`
6. `agent-workflow/product/tag-taxonomy.md`
7. `agent-workflow/product/evidence-and-routing-rules.md`
8. 本派发单

按需只可补读与标签生成直接相关的文件：

- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- `agent-workflow/tools/generate-asset-cards-from-pool.mjs`
- `agent-workflow/tools/regenerate-v2-assets-from-existing-raw.mjs`
- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `agent-workflow/tools/v2-content-gate.mjs`
- `agent-workflow/tools/card-copy-style-gate.mjs`
- `01-SiteV2/knowledge/10-Templates/*.md`
- 当前 `01-SiteV2/content/` 与 `01-SiteV2/knowledge/` 中含 `formal_tags` / `candidate_tags` 的样本文件

不要扫描全部历史报告，不要读取 V1 / V2.0 旧标签方案。

## 4. 必须回答的问题

执行窗口必须明确回答：

1. Raw 阶段是否应该生成正式 tags？如果不应该，应保存哪些字段。
2. Pool 阶段是否应该生成正式 tags？如果不应该，应保存哪些 tag hints 或 routing fields。
3. Card / Candidate 阶段正式 `formal_tags` 的生成规则是什么。
4. `candidate_tags` 与 `formal_tags` 如何区分。
5. `site-content.json` 中的 `tagTaxonomy` 是否应该从 `tag-taxonomy.md` 派生，还是继续硬编码；若继续硬编码，如何保证一致。
6. 当前脚本中哪些 tag id 不在正式 taxonomy。
7. 哪些不一致可以直接映射，哪些必须进入用户确认。
8. 如何阻止未来生成侧继续写入未登记 tag。

## 5. 治理要求

### 5.1 单一真源

- `agent-workflow/product/tag-taxonomy.md` 是当前正式标签真源。
- 前台 `tagTaxonomy`、脚本 tag 推断、模板 `formal_tags` 示例都必须与该真源一致。
- 如果脚本需要机器可读 taxonomy，可新增或派生一个 JSON 文件，但必须说明它如何从真源同步。

### 5.2 Raw / Pool 边界

Raw / Pool 阶段不强制输出正式 `formal_tags`。

允许字段：

- `theme`
- `theme_label`
- `keyword_group`
- `importance_type`
- `source_type`
- `source_level`
- `routing_lane`
- `tag_hints`
- `needs_tag_review`

不建议字段：

- `formal_tags`，除非已经经过 taxonomy normalization。

### 5.3 Card / Candidate / Report 边界

以下资产必须使用正式 tag id：

- `signal_card`
- `opinion_card`
- `change_candidate`
- `scene_candidate`
- `trend_candidate`
- `trend_report`
- `brief_issue`

正式标签必须使用 `tag-taxonomy.md` 中登记的 `tag_id`。

### 5.4 未知标签处理

未知标签不得被自动写入正式 `formal_tags`。

处理顺序：

1. alias 命中：归并到已有正式 tag。
2. 语义明显重复：归并到已有正式 tag，并记录迁移。
3. 无法判断：写入 `needs_tag_review` 或治理报告，不编造。
4. 需要新增：列入“新增标签候选表”，等待用户确认。

## 6. 已知初始问题

执行窗口必须重点核查下列初始问题：

| 来源 | 可疑 tag id | 问题 |
|---|---|---|
| `run-guanlan-daily-monitor.mjs` | `track-ai-startup` | taxonomy 当前未登记 |
| `run-guanlan-daily-monitor.mjs` | `track-vertical-ai` | taxonomy 当前未登记 |
| `run-guanlan-daily-monitor.mjs` | `stage-proven` | taxonomy 当前未登记 |
| `run-guanlan-daily-monitor.mjs` | `evidence-market-signal` | taxonomy 当前未登记 |
| `run-guanlan-daily-monitor.mjs` | `source-original-or-registry` | taxonomy 当前未登记 |
| `run-guanlan-daily-monitor.mjs` | `source-media` / `source-research` | taxonomy 当前未登记或命名不一致 |
| `sync-v2-site-data.mjs` | 内置 `tagTaxonomy` | 与 `tag-taxonomy.md` 存在漂移风险 |
| `regenerate-v2-assets-from-existing-raw.mjs` | `formal_tags` 推断 | 脚本已标注 legacy，需确认不得作为当前默认入口 |
| content / knowledge 样本 | `candidate_tags` | 可保留，但不得进入前台正式 tags |

## 7. 建议输出治理表

closeout 必须输出以下表格。

### 7.1 链路标签职责表

| 层级 | 是否允许正式 tags | 允许字段 | 禁止字段 | 质量门 |
|---|---|---|---|---|

### 7.2 当前 tag 来源审计表

| 文件 / 脚本 | 产生 tags 的位置 | tag 类型 | 是否使用正式 taxonomy | 问题 | 处理 |
|---|---|---|---|---|---|

### 7.3 非正式 tag 迁移表

| 当前 tag | 出现位置 | 建议处理 | 归并到 | 是否需用户确认 |
|---|---|---|---|---|

### 7.4 内容类型最低标签要求表

按 `tag-taxonomy.md` 复核并输出：

| 内容类型 | 必填 group | 建议 group | 不允许 |
|---|---|---|---|

### 7.5 Gate / 脚本补强表

| 检查项 | 应放在哪个脚本 | 阻塞级别 | 失败信息 |
|---|---|---|---|

## 8. 建议实现项

如执行窗口进入代码修改，建议优先完成：

1. 新增 `agent-workflow/tools/check-tags.mjs`：
   - 读取 `agent-workflow/product/tag-taxonomy.md` 或派生 JSON。
   - 扫描脚本硬编码 tag、content / knowledge 中的 `formal_tags`、site data 中的 `tags`。
   - 输出 unknown tags、candidate tags、低价值 tags、重复 alias。
2. 将 `run-quality-gates.mjs` 增加 `tags` 模式，或在 `v2content` 中调用 tag 检查。
3. 修正当前脚本中明显未登记的 tag id。
4. 明确 `sync-v2-site-data.mjs` 的 `tagTaxonomy` 维护方式，避免与真源漂移。
5. 在模板中补充“formal_tags 必须使用正式 tag_id”的说明。

如果实现范围过大，允许先输出治理规格与迁移表，不改代码；但 closeout 必须明确后续 Build 任务。

## 9. 验证要求

如改代码，至少运行：

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/generate-asset-cards-from-pool.mjs
node --check agent-workflow/tools/regenerate-v2-assets-from-existing-raw.mjs
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check agent-workflow/tools/v2-content-gate.mjs
node --check agent-workflow/tools/card-copy-style-gate.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如新增 tag 检查脚本，必须运行：

```powershell
node --check agent-workflow/tools/check-tags.mjs
node agent-workflow/tools/check-tags.mjs
```

同时必须验证：

- `site-content.json` 当前前台 tags unknown 数量为 0。
- 生成侧脚本 hardcoded unknown tags 数量为 0，或全部列入需用户确认表。
- `candidate_tags` 不会被前台当成正式 tags。

## 10. Closeout 输出

完成后写入：

```text
agent-workflow/reports/WSD-20260522-tag-taxonomy-chain-governance-closeout.md
```

closeout 必须说明：

- 改了什么。
- 是否删除无效文件。
- 是否新增脚本或 gate。
- 是否修改正式 taxonomy。
- 哪些 tag 需要用户确认。
- 运行了哪些验证。
- 是否允许后续 Raw / Pool / Card 链路继续。

## 11. 新窗口执行指令

```text
请执行任务：WSD-20260522-tag-taxonomy-chain-governance

你是 Intelligence Engine + Build & Release 协作执行窗口。本任务治理观澜 AI tags 体系在 Raw / Pool / Card / Candidate / Site Sync 全链路中的一致性。

核心要求：
1. 以 agent-workflow/product/tag-taxonomy.md 为正式标签真源。
2. 区分 Raw / Pool 的 tag hints 与 Card / Candidate / Report 的 formal_tags。
3. 审计并处理脚本、模板、content、knowledge、site sync 中的未知 tag 和命名漂移。
4. 不得把未知 tag 自动写入 formal_tags；无法判断时写 needs_tag_review。
5. 可新增 check-tags.mjs 或补强 quality gate。
6. 不推送、不部署。

完成后写 closeout：
agent-workflow/reports/WSD-20260522-tag-taxonomy-chain-governance-closeout.md
```
