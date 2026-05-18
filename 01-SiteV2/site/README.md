# V2.0 Site

状态：new-site-workbench  
更新时间：2026-05-07

## 定位

V2.0 网站不再基于根目录旧 `04-Site/` 直接改造；V1 旧站工程已从当前仓库物理移除。

后续 V2.0 网站工程默认从本目录重新建立。

## 原因

V2.0 涉及：

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
- V2 Dev 任务必须先读取 `agent-workflow/v2/v2-product-architecture-prd.md`、`agent-workflow/v2/v2-vi-design-direction.md` 和后续 `V2-8AUTO` 输出。
