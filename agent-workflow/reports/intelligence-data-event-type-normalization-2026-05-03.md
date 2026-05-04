# 2026-05-03 Intelligence Data Agent｜事件类型收敛报告

## 背景

Daily Brief 详情页的 `变化类型` 字段出现杂乱，根因不是样式，而是底层 Signal Markdown 的 `新闻类型` 字段混写了事件类型、赛道、客户、产品和标签。

典型旧值：

- `融资 / 收入增长 / 企业客户`
- `产品发布 / 企业 AI 工作流 / 桌面端 Agent`
- `并购受阻 / 监管 / AI Agent`

## 规范

`新闻类型 / 信号类型 / 事件类型` 只记录一个主事件类型。允许值：

- 融资
- 客户采用
- 收入验证
- 产品发布
- 监管/政策
- 采购/招标
- 并购整合
- 平台数据

赛道、客户、场景、产品、能力词不再进入该字段，应进入 `tags`、`track`、`summary`、`taxonomy` 或机会拆解。

## 已完成

- 批量整理 `01-Signals/*.md` 中 35 条 `新闻类型` 字段。
- 更新 `04-Site/scripts/sync-data.mjs`：新增标准 `eventTypes` 字段，每条 Signal 只取一个主事件类型。
- 更新 `04-Site/js/app.js`：Daily Brief `变化类型` 只读取标准事件类型，不再直接展示原始 `newsType`。
- 更新自动化 `ai-2`：生成 Signal 时必须按 8 个标准事件类型填写。
- 更新自动化 `ai-3`：同步后检查事件类型异常并写入复核项。

## 验证

- Markdown 源文件事件类型检查：全部为标准值。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0。
- `node 04-Site/scripts/check-tags.mjs` 通过，forbidden alias 0，unknown public tag 0。

## 自动化影响

本轮影响 `ai-2` 与 `ai-3`，已更新。`ai-the-point` 不生成 Signals，不受影响。
