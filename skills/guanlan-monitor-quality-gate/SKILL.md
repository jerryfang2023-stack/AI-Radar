---
name: guanlan-monitor-quality-gate
description: 观澜 AI 每日监测脚本化质量预闸门。用于运行或修复 guanlan-daily-monitor 的自动评分、硬阈值检查和最多 3 轮补采重跑；检查 Raw / Pool 数量、关键词路径、非社区证据、六类重要性覆盖、核心原文证据、首页/目录页误入 core_pool、M 入口误作事实证据、core_pool 缺全文等问题。它不是最终 QC，下游放行必须再由 guanlan-daily-monitor-qc 决定。
---

# Guanlan Monitor Quality Gate

本 Skill 是每日监测的脚本化预闸门。

最终放行只看：

```text
skills/guanlan-daily-monitor-qc/SKILL.md
```

## 与治理的关系

本质量门需要跟随来源层治理更新：

- 不再使用 `S/A/B` 比例或 `source_level=S/A/B` 作为硬门槛或价值评分。
- `S/A/B/C/D/M`：来源类型、证据角色、使用边界。
- 自动门槛改看可用原文证据、页面类型、关键词路径、六类重要性覆盖和 core_pool 完整性。
- AI HOT daily 和 follow-builders 的精选权重体现在采集优先级，不等于事实证据通过。
- HN / Reddit / X 上限收敛为反馈补充，不参与撑起主搜索覆盖。
- Raw 不固定 100，正常目标是 80-150；低信号日允许 50-80，但必须记录原因。

## 必读

普通运行不额外扩大阅读，使用每日监测任务已读上下文。

只有调试或改阈值时读取：

- `context/05-daily-monitoring.md`
- `skills/guanlan-daily-monitor/SKILL.md`
- `skills/guanlan-daily-monitor-qc/SKILL.md`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`
- `agent-workflow/tools/guanlan-monitor-quality-gate.mjs`
- `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`

## 执行

从项目根目录运行：

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=80 --max-cycles=3 --search-limit=70 --search-path-query-limit=2 --gdelt-query-limit=8 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000
```

日期默认使用 Asia/Shanghai。

脚本循环负责：

- 跑每日监测。
- 生成 Raw / Pool / monitor log。
- 运行脚本质量门。
- 未达标时在上限内补采重跑。
- 最多 3 轮；仍失败则标记需要人工介入。

## 当前硬门槛

脚本预闸门检查：

- Raw 数量不低于硬下限。
- Pool 数量不低于硬下限。
- 非社区关键词检索结果足够。
- Raw 标题 AI 相关性达标。
- 明显跑题项目不超过上限。
- 六类 `importance_type` 在 Raw 和 Pool 中无缺口：`important_case`、`important_funding`、`important_technical_trend`、`important_product_or_service`、`important_vertical_solution`、`important_viewpoint_or_article`。
- `routed_pool_count` 达到硬下限；不得只看被 AI HOT daily selected 全量保留抬高的 `pool_count`。
- `core_pool` 达到基线数量。
- 可用核心原文证据达到基线数量。
- `core_pool` 中没有首页、目录、README、包页、模型页、价格导航、搜索结果、SEO 页等 index-only 项。
- `core_pool` 中没有 M 入口单独充当事实证据。
- `core_pool` 中没有缺 `full_text` 的项目。
- `core_pool` 中没有缺 `extraction_method` 或 `readability_score` 低于当前门槛的项目。
- `core_pool` 中没有 `raw_qc_decision=block` 或 `raw_qc_decision=allow_with_degradation` 的项目。
- 失败来源、fallback 和证据缺口必须出现在监测日志中。

可用核心原文证据必须同时满足：

```text
pool_routes includes core_pool
has_full_text = true
extraction_method exists
readability_score >= configured minimum, default 24
evidence_object_type not in index_only_types
index_only_evidence = false
extraction_quality = high / medium when the field exists
content hash, full text hash and key excerpts exist in Raw JSON / snapshot
```

`raw_qc_decision=allow` 是输出结果，不是原子门槛。`core_pool` 中出现 `block` 或 `allow_with_degradation` 必须阻断。

`source_level` 仅保留为追溯字段。

`importance_score` 解释：

- 1-2：归档、索引或 supporting context。
- 3：潜在线索，不能进入 `core_pool`。
- 4：六类重要性之一的明确重要变化。
- 5：平台级、头部客户、知名机构、前沿能力、行业路线或高影响判断变化。

质量门必须阻断或反馈修复：

- `importance_score>=4` 缺少可解释的 `importance_reason`。
- `allow_with_degradation` 超过降级原因允许的最高路由。
- `pool_count` 被当作唯一 Pool 健康指标，而缺少 `routed_pool_count`、`index_only_pool_count`、`aihot_index_only_count`、`aihot_core_count`。

## 重跑策略

失败时只能用补采修复，不得手改报告骗过质量门。

补采方向：

- 增加重要案例。
- 增加重要融资事件。
- 增加重要技术趋势。
- 增加重要产品或服务产生。
- 增加重要垂直行业解决方案。
- 增加影响行业的重要发言、观点或文章。
- 修复 AI HOT daily / follow-builders 的原文回源。
- 降低 HN / Reddit / X 在搜索结果中的占比。

重跑上限来自：

```text
01-SiteV2/content/11-databases/monitor-quality-gate-v2.json
```

当前 HN 上限为 8，且重跑不继续增加 HN。

## QC 交接

脚本完成后必须交给 `guanlan-daily-monitor-qc`，并提供：

- Raw count。
- Pool count。
- Pool index count。
- Routed pool count。
- Index-only pool count。
- AI HOT index-only / core split。
- Source distribution。
- Source level distribution。
- Evidence object type distribution。
- Keyword path distribution。
- Raw / Pool 六类重要性覆盖缺口。
- Failed sources。
- Fallback used。
- Evidence gaps。
- `core_pool` 候选。
- 首页、产品页、目录页、文档页、README、包页、模型页、搜索结果页、SEO 页等可疑项目。
- 仅有采集入口文本、未完成原文回源的项目。
- 缺 `full_text`、snapshot、hash、Raw archive、Raw JSON 的项目。
- `raw_qc_decision=block` 或 `allow_with_degradation` 却被放入 `core_pool` 的项目。

脚本通过但 QC 未运行时：

```text
downstream_status=pending_qc
```

脚本通过但 QC 阻断时：

```text
downstream_status=blocked
```

## 输出

始终写入：

```text
agent-workflow/reports/<YYYY-MM-DD>-guanlan-monitor-quality-gate.md
agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-quality-loop.md
```

随后生成或等待：

```text
agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-qc.md
```

## 状态语言

使用明确字段：

```text
script_pre_gate=passed | failed
daily_monitor_qc=allow | allow_with_degradation | block | not_run
downstream_status=allowed | degraded | blocked | pending_qc
```

不得在 `daily_monitor_qc=not_run` 时说每日监测完成。

## 验证

改脚本或配置后运行：

```powershell
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

## Layered Search Provider Checks

The quality gate must treat provider output as discovery unless the Raw evidence chain is complete. Current provider order:

- Semantic keyword discovery: Anysearch -> Tavily -> Exa -> DuckDuckGo -> Bing fallback.
- A-media / news verification: GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback.

P0 blocker: any item sourced from Anysearch, Tavily, Exa, DuckDuckGo, Bing or GDELT enters `core_pool` without original evidence capture, `raw_qc_decision=allow`, non-index page type, key excerpts, hashes and six-lane `importance_type` scoring.

Provider freshness rule: Tavily / Exa / AnySearch / GDELT must normalize provider date fields into `published_at` before freshness comparison. Search results must dedupe across provider entrances by canonical URL and title/date fingerprint, especially Reuters, financing-wire posts, product pages and company announcements.

## Lane Volume Gate

Quality gate must check lane volume before accepting Pool health:

- Raw minimum per required importance type: 3.
- Raw target per required importance type: 5.
- Pool minimum per required importance type: 1.
- Core Pool maximum per required importance type: 3.
- Core Pool force fill: false.

If Raw for a lane is below 3, require lane-specific backfill or record a coverage gap. Do not compensate by promoting index-only, weak, community-only or degraded items.
