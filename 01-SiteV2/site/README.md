# V2.0 Site

状态：new-site-workbench  
更新时间：2026-05-07

## 定位

V2.0 网站不再基于根目录旧 `04-Site/` 直接改造。

旧站工程已归档到：

```text
10-Archive/v1.0/site/04-Site/
```

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
- 旧 `04-Site` 只作为历史参考，不作为 V2 默认开发入口。
- 如需复用旧代码，必须明确复制哪些文件、为何复用、如何适配 V2 schema。
- V2 Dev 任务必须先读取 `agent-workflow/v2/v2-product-architecture-prd.md`、`agent-workflow/v2/v2-vi-design-direction.md` 和后续 `V2-8AUTO` 输出。
