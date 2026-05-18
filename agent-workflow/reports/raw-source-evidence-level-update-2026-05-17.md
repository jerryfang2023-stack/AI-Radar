---
date: 2026-05-17
owner: intelligence-data-agent / workflow-agent
status: implemented
---

# Raw 来源证据等级规则更新

## 背景

用户确认：S / A / B / C / M 是“来源证据等级”，只判断一条 Raw 能否作为事实依据，不能混同为商业信号价值、内容重要性或入池资格。

## 已固化

- 更新 `agent-workflow/product/source-intelligence.md`：重写 S / A / B / C / M 定义，明确来源可信度与商业信号价值拆开。
- 更新 `agent-workflow/product/raw-evidence-schema.md`：新增 `acquisition_source_level`、`research_status`、`emerging_signal_score`、`pool_routes`，并加入 Emerging Pool / User Feedback Pool / Watchlist 分流规则。
- 更新 `01-SiteV2/content/09-databases/source-registry-v2.json`：升级到 `v2-source-registry-1.1`，加入 M 级发现入口、C 级社区来源、创始人原帖、arXiv preprint 等规则。
- 更新 `01-SiteV2/content/README.md`：同步 Raw / Pool 边界，明确 Pool 不由来源等级直接决定。
- 更新 `agent-workflow/automation-prompts/daily-monitor-router.md`：日常监测必须按“来源可靠度”和“商业价值”两套逻辑分流。
- 更新 `agent-workflow/tools/run-v2-daily-pipeline.mjs`：脚本新增 `acquisition_source_level`、`research_status`、`emerging_signal_score`、`pool_routes`，并调整来源分级逻辑。
- 更新 `agent-workflow/tools/v2-raw-evidence-gate.mjs`：Raw gate 接受新增字段和新增可用方向。

## 关键规则

- S/A/B/C/M 不等于重要性，也不直接决定是否进入 Pool。
- C 级来源不是低价值；高潜社区线索可进入 Emerging Pool、User Feedback Pool 或 Watchlist。
- S 级来源不是自动入池；没有商业变化的官方通稿可以只建索引。
- AI HOT、follow-builders、搜索聚合等 M 级来源只作为发现入口，必须回源重新定级。
- 创始人 / 高管 / 项目方原帖可作为 S 级一手来源；如果在 X 等高波动平台，必须保存可见文本、抓取时间和快照。
- arXiv 预印本必须标记 `research_status=preprint`，不能写成已验证商业结论。

## 验证

- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs` passed。
- `node --check agent-workflow/tools/v2-raw-evidence-gate.mjs` passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` passed。

## 注意

本次更新的是规则、schema 和后续自动化逻辑。历史 Raw JSON 若按旧 schema 生成，直接跑 Raw gate 可能会缺少新增字段；应在下一次 daily-monitor-router 重新生成 Raw 后使用新 Raw gate 验收。
