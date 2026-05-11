---
title: V2 Production Pipeline Cutover
date: 2026-05-07
task_id: WSD-20260507-18-v2-production-content-migration-autopilot
board_id: V2-13AUTO
status: active-production-path
owner: V2 Platform / Workflow Agent / Intelligence Data Agent / QA Agent
encoding: UTF-8
---

# V2 生产线切换方案

## 0. Cutover 结论

V2 生产线不恢复旧根目录 `04-Site/`，也不把早期 `06-content/v2/` 文案作为当前生产入口。

当前生产路径锁定为：

```text
01-SiteV2/content/
01-SiteV2/site/
```

旧站工程和 V1 内容只读归档：

```text
10-Archive/v1.0/site/04-Site/
10-Archive/v1.0/source-dirs/
10-Archive/v1.0/v1.0-content-archive.md
```

## 1. 生产路径映射

| V2 阶段 | 当前生产路径 | 每日门槛 |
|---|---|---:|
| Inbox | `01-SiteV2/content/00-inbox/` | 不限 |
| Raw | `01-SiteV2/content/01-raw/` | 80-150，低信号或接口失败日可降级 50-80 并说明原因 |
| Raw originals | `01-SiteV2/content/01-raw/originals/YYYY-MM-DD/` | 与 Raw 对齐 |
| Pool | `01-SiteV2/content/02-pool/` | 20-30 |
| Structured Signals | `01-SiteV2/content/03-structured-signals/` | 8-15 |
| Front Signals | `01-SiteV2/content/04-selected-signals/` | 3-5 |
| Trend Context | `01-SiteV2/content/05-trend-chain/` | 覆盖全部 Structured |
| Insights | `01-SiteV2/content/06-insights/` | 至少 1 |
| Point Calibration | `01-SiteV2/content/07-points/` | 有则入库，无则说明 |
| Opportunity Deep Dive | `01-SiteV2/content/08-opportunities/deep-dive/` | 1-2，证据不足时不得硬凑 |
| MVP Validation | `01-SiteV2/content/09-mvp-validation/` | 条件产出 |
| Databases | `01-SiteV2/content/10-databases/` | 至少更新趋势库 |
| Distribution | `01-SiteV2/content/11-content-distribution/` | 可选 |
| Feedback | `01-SiteV2/content/12-feedback/` | 可选 |

## 2. 同步与检查闸门

当前可执行闸门：

```powershell
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
node agent-workflow/tools/run-quality-gates.mjs syntax
```

`v2content` 检查 Raw、Raw originals、Pool、Structured、Front Signals 和 V2 site root。它不运行旧 `04-Site` 同步，也不部署 Netlify。

后续 V2 站点生成脚本落地后，再补：

- `01-SiteV2/site/scripts/sync-v2-data.mjs`
- `01-SiteV2/site/scripts/check-v2-relations.mjs`
- `01-SiteV2/site/scripts/check-v2-tags.mjs`
- `01-SiteV2/site/data/`

## 3. 备份和回滚

本轮没有覆盖旧站数据，没有部署，也没有写入 `10-Archive/v1.0/`。

若后续进入 V2 site data 生成：

1. 先记录 Git 状态。
2. 备份 `01-SiteV2/site/data/`。
3. 备份即将修改的脚本。
4. 运行 `syntax` 与 `v2content`。
5. 生成数据到临时目录。
6. 验证通过后再替换 `01-SiteV2/site/data/`。
7. 失败时保留上一版有效数据，并写失败报告。

## 4. 字段兼容策略

- V1 历史内容不直接改 frontmatter。
- 历史资产进入 V2 时先进入 `00-inbox/legacy-import/` 和 migration map。
- 只有完成 V2 六维分析、关系字段、证据缺口和来源追溯的资产，才能进入 Structured / Front Signal / Opportunity / HeatEvidence。
- Point 只作为观点校准，不作为事实主证据。
- Trends 只作为趋势背景、内参热力输入和 Admin 资产，不恢复为一级频道。

## 5. 风险分级

| 风险 | 等级 | 处理 |
|---|---|---|
| 旧任务仍引用 `04-Site` | 中 | 文档中标记为 V1 archive path，不作为当前生产入口 |
| 历史资产直接搬入 V2 | 高 | 只能先进 legacy import，再按 V2 规则重加工 |
| `01-SiteV2/content/v2/` 与 parent content 结构混淆 | 中 | 标记 `content/v2/` 为早期骨架参考 |
| 未完成 V2 site generator | 中 | 本轮只建立内容闸门，不声称已发布前台 |
| `09-ai-news-radar/` 混入生产 | 中 | 本轮明确不处理 |

## 6. 当前可入站基础

2026-05-06 已具备一条完整 V2 内容链路：

- Raw Candidates：30
- Raw Originals：30
- Pool Items：12
- Structured Signals：8
- Front Signals：3

该链路通过 `v2content` 闸门后，可作为 V2 生产内容路径的第一条可验证样本。
