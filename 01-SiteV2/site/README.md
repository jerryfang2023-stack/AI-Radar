# V2.1 Site

状态：new-site-workbench  
更新时间：2026-05-18

## 定位

V2.1 网站不再基于根目录旧 `04-Site/` 直接改造；V1 旧站工程已从当前仓库物理移除。

后续 V2.1 网站工程默认从本目录推进。

V2.1 基座：

- 战略 / 产品 / 写作 / 栏目：`agent-workflow/reports/WSD-20260518-grillme-strategy-product-closeout.md`
- Raw / Pool / Card 证据规则：`agent-workflow/reports/WSD-20260518-raw-pool-card-rules-closeout.md`

## 原因

V2.1 涉及：

- 新 VI。
- 新导航与栏目结构。
- 新内容生产线。
- 新数据 schema。
- AI 商业内参与商业热力图。
- 首页与详情页整体重构。

改造范围过大，不适合继续在旧 V1 网站工程上局部更新。

## 后续要求

- 新站点工程从 `01-SiteV2/site/` 开始。
- 旧 `04-Site` 不再作为历史参考源或 V2 默认开发入口。
- 如需追溯旧实现，只能通过 Git 历史查找，不得把 V1 旧站代码恢复为当前生产目录。
- V2.1 Dev 任务必须先读取 `AGENTS.md`、`agent-workflow/governance/current-context.md`、当前派发单，以及派发单指定的单一真源。
