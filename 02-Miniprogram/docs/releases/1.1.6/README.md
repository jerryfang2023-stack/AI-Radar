# 1.1.6 开发版上传记录

2026-09-28，微信 CLI 明确返回 upload 成功，包大小 888980 字节。未提交审核或发布。

- 上传源码：`fe85c5acee8`，已推送 origin/main；Git archive 固定目录 `previews/guanlan-v116-fe85c5acee8/02-Miniprogram`。
- 数据发布源码：Guanlan-Funding-Portal `201e6b2d`，已推送 main。仅原子部署 `data/funding-featured.json`，HTTPS 回读 200，确认 Ema 的 Creaegis 署名摘要及官方来源。
- 163 项小程序测试通过，25 页面、63 JS 文件校验通过；后台观点校验测试通过。微信上传编译成功；未取得新真机截图，不等同于真机视觉验收。
- 卡片高度、两行观察样式不变；标题改金黄色 #e2c57f。没有审核观点时不再拼接重复分类文案。客户端首页 onShow 独立刷新公开观点，不依赖融资 manifest 版本变化。
- 已覆盖同日内容更新、撤回、坏数据/超长/无来源拒绝、网络失败保留最近内存结果、市场隔离与下架记录过滤。
- 源编辑入口、日常构建持久性与公开来源见融资站 `docs/featured-observations.md`。没有编造其他项目投资方观点。

[审核说明](../../REVIEW-1.1.6.md)
