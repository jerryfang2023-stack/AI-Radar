---
task_id: WSD-20260508-10-v2-source-interface-upgrade-autopilot
board_id: V2-SOURCE-INTERFACE-UPGRADE
title: V2 新增新闻源与接口，优化每日新闻抓取方式自动包
date: 2026-05-08
status: ready
lead_agent: V2 Source Intelligence Agent
support_agents:
  - Workflow / Automation Agent
  - Intelligence Data Agent
  - Dev Agent
  - QA / Acceptance Agent
encoding: UTF-8
---

# V2-SOURCE-INTERFACE-UPGRADE｜新增新闻源与接口，优化每日新闻抓取方式自动包

## 1. 任务目标

升级观澜 AI V2 每日新闻抓取方式，让每日 09:00 自动化不再依赖单一泛搜索，而是形成：

```text
Source Registry -> 接口 / RSS / 搜索 / 手动候选分层 -> Raw 80-150 -> Pool 20-30 -> Structured 8-15 -> Front Signal 3-5 -> Deep Dive 1-2 -> Trend Updates 3-5 -> V2 site data 更新
```

目标是提升原始候选覆盖率、来源可追溯性、一手证据比例、早期信号发现能力、抓取失败降级能力和每日任务可调试性。

## 2. 必须读取

```text
AGENTS.md
docs/agent-handoff.md
agent-workflow/v2/v2-workflow-skill-graph.md
agent-workflow/product/source-intelligence.md
agent-workflow/v2/v2-algorithm-source-architecture.md
agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md
agent-workflow/tools/v2-content-gate.mjs
agent-workflow/governance/automation-fallback-policy.md
agent-workflow/execution/dispatch-board.md
```

## 3. 必须评估的来源与接口

### 全球新闻与公开报道

- GDELT DOC 2.0 / GDELT Cloud：全球新闻搜索、主题追踪、时间窗口搜索。
- 高质量商业媒体 RSS / 搜索入口：Reuters、TechCrunch、Axios、The Information、Bloomberg、FT、WSJ、VentureBeat、Sifted、CNBC。
- AI 垂直媒体和 newsletter：按来源等级管理，不得把聚合站作为主证据。

### 一手产品与平台来源

- OpenAI、Anthropic、Google AI / DeepMind、Microsoft AI、Meta AI、NVIDIA、AWS、Snowflake、Databricks、Salesforce、ServiceNow、HubSpot、Atlassian、GitHub 官方博客、产品更新、文档、changelog、定价页。
- AWS Marketplace、Azure Marketplace、Google Cloud Marketplace、Slack、Teams、Salesforce、HubSpot、Shopify 等云市场 / 插件市场。

### 开发者与早期技术信号

- GitHub REST / Search API。
- Hacker News 官方 Firebase API 与 HN Algolia 搜索。
- arXiv API / RSS。
- Hugging Face、npm、PyPI、Docker Hub、ModelScope 等生态来源。

### 早期产品、创业与融资

- Product Hunt API v2 / RSS / 页面来源。
- YC companies / batch / demo day。
- Crunchbase、Dealroom、PitchBook、Tracxn、CB Insights 等融资数据库或公开页面，按可访问性和授权分级。
- VC / 研究机构博客和公告：a16z、Sequoia、Bessemer、Lightspeed、Index、General Catalyst、Menlo、Khosla、Lux、NEA 等。

### Builder / 社区线索

- X / LinkedIn / Reddit / YouTube / Podcast / Substack / Hacker News comments。
- 这些来源默认只作为 C 级触发源或 Point 候选，不得作为事实主证据。
- X / LinkedIn 如需非官方抓取，必须单独取得用户明确许可，并写风险说明；本任务不得默认启用逆向接口。

## 4. 接口状态与来源等级

每个来源必须标记接口状态：

```text
official-api
rss
public-web
search-only
manual-review
requires-key
requires-consent
blocked-or-deferred
```

来源等级沿用：

```text
S：一手事实来源
A：高质量商业媒体 / 通讯社
B：产业与生态来源
C：社交 / 社区 / 聚合线索
D：噪音或低可信来源
```

## 5. 产物要求

### Stage A｜Source Interface Registry

输出：

```text
agent-workflow/v2/v2-source-interface-registry.md
01-SiteV2/content/10-databases/source-registry-v2.json
```

每个来源必须包含：

| 字段 | 说明 |
|---|---|
| source_id | 稳定 ID |
| name | 来源名称 |
| source_level | S / A / B / C / D |
| source_type | news / product / funding / builder / developer / marketplace / research / procurement |
| interface_type | official-api / rss / public-web / search-only / manual-review / requires-key / requires-consent |
| endpoint_or_url | 官方文档或入口 |
| auth_required | true / false |
| rate_limit_note | 已知速率限制或 unknown |
| query_scope | 每日抓什么 |
| extraction_fields | title / url / date / author / summary / source / tags |
| fallback_path | 接口失败如何降级 |
| evidence_role | fact-main / fact-support / lead-only / point-only / counter-evidence |
| enabled_default | true / false |
| risk_note | 授权、稳定性、误报、噪音 |

### Stage B｜抓取策略优化

输出：

```text
agent-workflow/v2/v2-daily-source-collection-strategy.md
```

必须定义：

- 每日 Raw 80-150 的来源配比；低信号或关键接口失败日可降级为 50-80，但必须写明原因。
- 每个来源类型的 query 模板。
- 关键词簇：Agent / workflow、AI coding / devtools、enterprise AI / governance / security、vertical AI、AI infra / model routing / evals、customer support / sales / marketing / finance / legal / procurement、robotics / on-device / edge AI。
- 时间窗口：24h / 72h / 7d 分层。
- 去重规则：URL、company、product、topic、source cluster。
- C 级来源二次搜索规则。
- 噪音降权规则。
- 失败降级规则。

### Stage C｜最小可运行 Source Probe

建议新增：

```text
agent-workflow/tools/v2-source-probe.mjs
```

至少实现 3 类无密钥或低门槛来源 probe：

- GDELT DOC / Cloud 或公开 GDELT endpoint。
- Hacker News 官方 API 或 HN Algolia。
- GitHub Search API。

如 Product Hunt / Reddit / 其他来源需要 key 或审批，则写入 registry，但不强行启用。

probe 输出：

```text
agent-workflow/reports/v2-source-probe-2026-05-08.json
agent-workflow/reports/v2-source-probe-2026-05-08.md
```

Raw probe 结果不得直接发布到前台。

### Stage D｜接入每日自动化

必须更新：

```text
agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md
```

要求：

- 每日自动化必须优先读取 `source-registry-v2.json`。
- Raw 80-150 必须说明来源分布；如降级为 50-80，必须说明低信号、接口失败或来源缺口。
- 如接口失败，必须记录失败接口、错误、降级来源和缺口。
- 不得因为接口失败就把单一搜索结果伪装成多源结果。
- 保持每日 09:00 自动化不变，除非用户另行确认。

### Stage E｜质量闸门建议

必须评估是否新增或扩展：

```text
agent-workflow/tools/v2-source-quality-gate.mjs
```

最小检查：

- source-registry JSON 可解析。
- 每个 enabled source 有 source_id / level / type / interface_type / fallback_path。
- Raw Candidate 至少覆盖 4 类来源。
- Front Signal 至少 3 个 S/A/B 来源。
- C 级来源不能成为事实主证据。
- 失败接口必须写入降级说明。

如本轮不实现脚本，必须输出明确 follow-up 任务。

## 6. 不做事项

- 不处理 `09-ai-news-radar/`。
- 不恢复旧 `04-Site`。
- 不写入 V1 内容目录。
- 不做 Netlify deploy。
- 不切正式域名。
- 不默认启用 X / LinkedIn 非官方抓取。
- 不把需要付费或审批的接口硬编码为必需项。
- 不把 Raw probe 结果直接发布到前台。

## 7. 验收标准

- `v2-source-interface-registry.md` 完成。
- `source-registry-v2.json` 完成且 JSON 可解析。
- `v2-daily-source-collection-strategy.md` 完成。
- 至少 3 类接口 / 来源 probe 完成，或写清无法 probe 的原因。
- 每个 requires-key / requires-consent 来源均有禁用默认值和风险说明。
- 每日自动化派发文档已更新。
- 如修改脚本，相关 `node --check` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- closeout 为 UTF-8 Markdown。

## 8. 参考资料

执行窗口应优先核对官方文档：

- GDELT DOC 2.0 / GDELT Cloud API。
- Hacker News 官方 Firebase API。
- GitHub REST / Search API。
- Product Hunt API v2。
- Reddit API。
- arXiv API。

## 9. 收口文件

```text
agent-workflow/reports/WSD-20260508-10-v2-source-interface-upgrade-autopilot-closeout.md
```

收口必须说明：

- 新增来源数量。
- 默认启用来源数量。
- requires-key / requires-consent 来源数量。
- probe 成功 / 失败情况。
- 每日自动化是否已更新。
- 是否新增 source quality gate。
- 对明天 09:00 自动化的影响。

## 10. 新窗口提示词

```text
你是观澜 AI V2 Source Intelligence / Workflow / Dev 执行窗口。

请在 C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight 执行：

看板编号：V2-SOURCE-INTERFACE-UPGRADE
Task ID：WSD-20260508-10-v2-source-interface-upgrade-autopilot
派发单：agent-workflow/execution/WSD-20260508-10-v2-source-interface-upgrade-autopilot.md

任务目标：
新增和整理 V2 新闻源与接口，优化每天 09:00 新闻抓取方式。不要只增加来源列表，要形成 source registry、接口状态、抓取策略、最小 probe、失败降级和每日自动化接入口径。

必须先读取：
- AGENTS.md
- docs/agent-handoff.md
- agent-workflow/v2/v2-workflow-skill-graph.md
- agent-workflow/product/source-intelligence.md
- agent-workflow/v2/v2-algorithm-source-architecture.md
- agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md
- agent-workflow/tools/v2-content-gate.mjs
- agent-workflow/governance/automation-fallback-policy.md
- 本派发单

必须输出：
- agent-workflow/v2/v2-source-interface-registry.md
- 01-SiteV2/content/10-databases/source-registry-v2.json
- agent-workflow/v2/v2-daily-source-collection-strategy.md
- agent-workflow/reports/v2-source-probe-2026-05-08.json
- agent-workflow/reports/v2-source-probe-2026-05-08.md
- 更新 agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md
- 如实现脚本，新增 / 更新 agent-workflow/tools/v2-source-probe.mjs 或 v2-source-quality-gate.mjs
- closeout：agent-workflow/reports/WSD-20260508-10-v2-source-interface-upgrade-autopilot-closeout.md

硬要求：
- 不处理 09-ai-news-radar。
- 不恢复旧 04-Site。
- 不写入 V1 内容目录。
- 不做 Netlify deploy。
- 不默认启用 X / LinkedIn 非官方抓取。
- 不把需要付费或审批的接口硬编码为必需项。
- 不把 Raw probe 结果直接发布到前台。
- 保持每日自动化 09:00 时间不变，除非用户另行确认。

验收：
- source-registry-v2.json 必须可解析。
- 至少 3 类来源 probe 成功，或写清失败原因与降级方案。
- 每个 enabled source 必须有 fallback_path。
- syntax Quality Gate 必须通过。

完成后回调度中枢：
收口：agent-workflow/reports/WSD-20260508-10-v2-source-interface-upgrade-autopilot-closeout.md
```
