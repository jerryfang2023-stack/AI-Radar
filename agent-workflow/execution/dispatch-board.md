# Dispatch Board｜当前任务看板

更新时间：2026-06-07
状态：V3.3.1 current

本看板只保留当前可执行的运行口径。历史任务、旧派发单和 closeout 只作为 `agent-workflow/reports/` 或 `agent-workflow/execution/` 下的档案，不再作为当前执行规则。

## 当前基线

| 项目 | 状态 | 当前口径 |
|---|---|---|
| Version | current | `V3.3.1-unified-intelligence-frontstage` |
| Context | current | 默认入口为 `AGENTS.md` + `context/` + 当前用户任务 |
| Business Signals | current | 每日前台展示 10 条最值得看的商业信号，按重要性排序 |
| Raw / Pool / Core Pool | current | Raw >= 150，Pool >= 75，Core Pool >= 30 |
| First-Line Viewpoints | current | 独立 builders 观点页，不进入商业信号事实、关系图或趋势候选证据 |
| Automation | current | Business Signals、First-Line Viewpoints、Dashboard 可分别构建；builders 不被 Raw / Pool / Card 失败阻断 |
| Tags | current | 正式前台数据必须使用 `agent-workflow/product/tag-taxonomy.md` 中的正式 tag |

## 当前前台

| 页面 | 文件 | 角色 |
|---|---|---|
| Business Signals / 商业信号 | `01-SiteV2/site/v3-data-observation.html` | 每日 10 条前台卡片、详情、关系图、趋势候选 |
| First-Line Viewpoints / 一线观点 | `01-SiteV2/site/follow-builders.html` | 独立 builders 观点流 |
| Dashboard / 仪表盘 | `01-SiteV2/site/operations-console.html` | 运行和质量状态 |

## 当前注意项

- 不恢复 V2.2.1 的“今日观察 / 趋势追踪 / 商业内参”作为当前导航。
- 不使用旧 Raw 80-150 / Pool 20-40 口径。
- 不新增非体系 tag；旧 `customer-service-proof` 等伪 tag 必须迁移到正式 tag。
- builders 页面允许在业务信号链路失败时独立更新；如果当日抓取失败，应保留上一份可用数据并写入 fallback 元信息。
