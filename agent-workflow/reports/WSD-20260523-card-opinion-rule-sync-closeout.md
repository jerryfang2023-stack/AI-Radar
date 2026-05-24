---
date: 2026-05-23
status: closed
owner: Codex
scope: Raw / Pool / Card asset rule sync
---

# WSD-20260523 Card / Opinion Rule Sync Closeout

## 任务结论

本次收口确认并补齐了 Card 规则、观点规则、生成脚本、同步脚本和门禁脚本之间的一致性。当前链路已经按以下口径执行：

- eligible `core_pool` + `raw_qc_decision=allow` 默认全部生成前台 `signal_card`，不再设置单日上限。
- 前沿观点先进入 `opinion_intake`，入库时写入中文翻译。
- 观点四档为 `feature` / `sidebar` / `archive` / `discard`。
- 只有 `feature` 和 `sidebar` 能升级为正式 `opinion_card` 并进入前台。
- `archive` / `discard` / 未评级 / 缺中文翻译 / `translation_status: pending_translation` 不得进入前台。
- X / Twitter 来源必须保留 `x_full_visible_text`，并在详情页展示全文原文和相对完整的中文全文翻译。
- 列表页、首页模块和侧栏可以做预览截短；观点详情页和人物详情页必须读取完整翻译字段。

## 修改范围

### 规则文档

- `context/05-daily-monitoring.md`
  - 已记录 follow-builders 先入 `opinion_intake`。
  - 已记录 X / Twitter 全文抓取、全文翻译和详情页完整展示要求。
  - 已记录观点四档分级与 `feature/sidebar` 正式成卡规则。

- `context/06-execution-harness.md`
  - 已记录 Raw / Pool / Card 资产链中观点卡的前台放行条件。
  - 已记录详情页和人物页不得用预览字段替代完整译文。

- `agent-workflow/product/card-asset-copy-governance.md`
  - 已去掉“默认目标 6 张 signal_card”的旧口径。
  - 已改为 eligible `core_pool` 应全部生成正式前台 `signal_card`。
  - 已明确不适合前台的条目必须回到 Raw-to-Pool 阶段修正，而不是在 Pool-to-Card 阶段静默丢弃。

- `agent-workflow/automation-prompts/asset-card-generator.md`
  - 已同步观点卡四档评级、X 全文翻译、详情页完整展示和前台同步条件。

### 脚本

- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
  - 已确认 follow-builders 生成 `opinion_intake`。
  - 已确认 X 来源写入 `capture_scope: x_full_visible_text`。
  - 已确认 X 来源调用 `preferFullTranslation: true`。

- `agent-workflow/tools/opinion-translation-utils.mjs`
  - 已增加 `completeOpinionTranslation`，用于识别 X 长文短译文。
  - 已避免 X 来源继续使用静态短译文作为合格全文译文。

- `agent-workflow/tools/govern-opinion-card-ratings.mjs`
  - 已确认统一执行 `feature/sidebar/archive/discard` 四档评级。
  - 已确认缺完整中文翻译时不允许升为前台观点。
  - 已确认 X 来源补写 `capture_scope: x_full_visible_text`。
  - 已避免完整译文被后续短译文覆盖。

- `agent-workflow/tools/generate-asset-cards-from-pool.mjs`
  - 已确认商业信号默认无单日上限。
  - 已补齐：手工观点规格先写为 `opinion_intake`，再交由统一观点评级脚本升级，避免绕过评级直接成为前台观点。

- `agent-workflow/tools/card-copy-style-gate.mjs`
  - 已检查正式观点卡只能是 `feature/sidebar`。
  - 已检查 `display_lane` / `publish_status` 与分级一致。
  - 已检查 `pending_translation` 不得成为正式观点卡。
  - 已补齐 X 长文中文译文完整性门禁。

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
  - 已确认前台只同步 `feature/sidebar` 且通过 gates 的观点。
  - 已补齐 X 长文短译文不同步前台的检查。

- `01-SiteV2/site/assets/app.js`
  - 已确认观点详情页和人物页读取完整中文翻译字段。

## 数据核对

2026-05-23 当日核对结果：

- `core_pool + raw_qc_decision=allow`：11 条。
- 已生成当日前台商业信号卡：11 张。
- 未生成信号卡的 eligible core_pool：0 条。
- 前台观点数：58 条。
- 前台观点中混入 `archive/discard`：0 条。
- X 长文中文翻译不完整：0 条。
- Aaron Levie 长文观点已写入完整中文译文，并同步到前台详情页。

## 已运行验证

- `node --check agent-workflow/tools/generate-asset-cards-from-pool.mjs`
- `node --check agent-workflow/tools/card-copy-style-gate.mjs`
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `node --check agent-workflow/tools/govern-opinion-card-ratings.mjs`
- `node --check agent-workflow/tools/opinion-translation-utils.mjs`
- `node --check 01-SiteV2/site/assets/app.js`
- `node agent-workflow/tools/govern-opinion-card-ratings.mjs --date=2026-05-23`
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-23`
- `node agent-workflow/tools/card-copy-style-gate.mjs --date=2026-05-23 --require-gates=true --path="01-SiteV2/knowledge/01-Signal-Cards,01-SiteV2/knowledge/02-Opinion-Cards,01-SiteV2/content/04-business-signals/signals,01-SiteV2/content/05-frontier-opinions"`
- `node agent-workflow/tools/run-quality-gates.mjs syntax --date=2026-05-23`

验证结论：

- Card Copy Style Gate：passed，检查 51 个文件，问题数 0。
- Syntax Gate：passed，检查 14 项，失败项 0。
- 前台详情页实测：Aaron Levie 观点详情页能读到中文翻译开头和结尾。

## 删除情况

本次未删除文件。

## 后续注意

- 后续如果出现“core_pool 不进前台”，优先检查 Raw-to-Pool 资格是否应被修正，不应在卡片生成阶段静默过滤。
- 后续如果出现“观点没有中文全文”，优先检查 `opinion_intake` 入库字段、`translation_status`、`capture_scope` 和 `frontend.originalTranslation`，再跑 `govern-opinion-card-ratings.mjs` 和站点同步。
- 后续前台观点异常时，先看 `sync-v2-site-data.mjs` 的 `frontstageOpinionReady`，它是前台同步硬闸。
