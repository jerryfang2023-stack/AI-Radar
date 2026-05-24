# 2026-05-24 重复合并与搜索引擎配置规则同步收口

时间：2026-05-24 13:25 CST

## 结论

- 已把“重复项目合并”和“搜索引擎配置”规则同步到执行入口、每日监测 Skill、每日监测 QC、证据分流真源、卡片资产真源和关键词配置。
- NewsAPI 已从当前活跃搜索链路退出；相关文件只保留“retired / 已退出”的说明，不再作为 active provider、环境变量或 QC 期待。
- Anysearch、Tavily、Exa、GDELT 的发布时间统一口径已经写入：必须归一到 `published_at` 后再比较新鲜度。
- 跨搜索入口去重已经写入：先按 canonical URL，再按来源家族 + 标题指纹 + 发布日，重点合并 Reuters、融资稿、产品页、公司公告。
- 观点卡重复合并已经写入：评级和前台同步前先合并重复卡，保留 keeper，重复文件移入归档目录。

## 重复项目合并规则

### 搜索结果 / Raw 前去重

搜索入口返回结果进入 Raw 选择前必须先去重：

1. 先用 canonical URL 合并同一页面。
2. 再用来源家族 + 标题指纹 + 发布日合并跨入口重复命中。
3. Reuters、融资稿、产品发布页、公司公告、Business Wire / PR Newswire / GlobeNewswire 等高重复来源必须重点合并。
4. keeper 优先级：可用原始 URL、有效 `published_at`、更完整摘要或正文线索、更可靠来源。
5. 被合并记录必须可追溯，Raw 侧使用 `duplicate_status=merged_provider_duplicates` 或等价说明。

### 观点卡去重

观点卡在评级和前台同步前必须先合并：

1. 以 `canonical_url`、`original_url`、`source_url` 识别重复。
2. keeper 优先级：`feature` > `sidebar` > `archive` > `discard`，其次看评分、人工复核状态、中文翻译完整度。
3. keeper 写入 `merged_duplicate_count`、`merged_duplicate_refs` 和正文合并记录。
4. 重复文件移入 `01-SiteV2/knowledge/99-Archive/Opinion-Duplicates/<date>/`。
5. 合并不删除证据，只改变活跃观点卡的唯一入口。

## 搜索引擎配置规则

### 当前活跃 provider

语义关键词发现：

```text
Anysearch -> Tavily -> Exa -> DuckDuckGo -> Bing fallback
```

A-media / news verification：

```text
GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback
```

本地环境变量只保留：

```text
ANYSEARCH_API_KEY
TAVILY_API_KEY
EXA_API_KEY
```

### 发布时间规则

- Anysearch / Tavily / Exa / GDELT 的供应商日期字段必须统一归一到 `published_at`。
- 只有有效日期可用于新鲜度比较。
- 孤立年份、URL 里的无关数字、社交平台 activity id、追踪参数不得伪装成发布时间。
- 无可靠发布时间时保持空值，不做虚假补齐。

### 证据边界

- 搜索 provider 只是发现入口，不是事实主证据。
- 搜索结果必须回到原始页面、全文或可用快照，经过 Raw QC、页面类型检查、hash / excerpt 检查和六类 `importance_type` 评分后，才允许进入 `core_pool`。
- failed provider text、搜索摘要、搜索结果页、目录页和无正文页面不得生成正式 Card。

## 已同步文件

- `context/05-daily-monitoring.md`
- `context/06-execution-harness.md`
- `skills/guanlan-daily-monitor/SKILL.md`
- `skills/guanlan-daily-monitor-qc/SKILL.md`
- `skills/guanlan-monitor-quality-gate/SKILL.md`
- `agent-workflow/product/evidence-and-routing-rules.md`
- `agent-workflow/product/card-asset-copy-governance.md`
- `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- `agent-workflow/tools/benchmark-search-providers.mjs`
- `agent-workflow/tools/govern-opinion-card-ratings.mjs`

## 冲突处理

- 修正 `guanlan-daily-monitor-qc` 中旧的 `NewsAPI -> GDELT` 路径。
- 修正 `context/06-execution-harness.md` 中旧的 `GDELT / NewsAPI` 入口表述。
- 修正 `keyword-monitoring-v2.json` 中旧的 `semantic_or_agent_search_when_configured_tavily_exa_brave` 口径。
- 保留 NewsAPI 命中的地方只用于说明 retired 状态，不作为活跃配置。

## 验证

- `keyword-monitoring-v2.json` JSON 解析：passed。
- `run-guanlan-daily-monitor.mjs` 语法检查：passed。
- `benchmark-search-providers.mjs` 语法检查：passed。
- `govern-opinion-card-ratings.mjs` 语法检查：passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed，14 项检查，0 项失败。

最新语法门报告：

- `agent-workflow/reports/quality-gates-syntax-2026-05-24-20260524-052456.md`
