---
title: ai-news-radar X OPML 本地试跑
date: 2026-05-06
type: automation-report
status: partial
owner: workflow/dev
---

# ai-news-radar X OPML 本地试跑

用户选择本地 OPML 路线新增约 30 个 X AI builders 账号。

## 已完成

- 已在本地目标仓库创建私有 OPML：
  - `C:\Users\86186\Documents\Fang\wiki\AI热点\ai-news-radar\feeds\follow.opml`
- 该文件已被目标仓库 `.gitignore` 忽略，不应提交。
- 已使用 `--rss-opml feeds\follow.opml` 运行本地更新。
- 已重新导出 Obsidian。

## 结果

- OPML enabled：true
- feed_total：30
- effective_feed_total：30
- ok_feeds：0
- failed_feeds：30
- 24h 页面新增 X OPML 条目：0

失败原因：
- `rsshub.pseudoyu.com/twitter/user/<handle>` 当前返回 `503 Service Unavailable` 或超时。
- 其他公共实例抽测：
  - `rsshub.app/twitter/user/karpathy`：404
  - `rss.detools.dev/twitter/user/karpathy`：超时
  - `rsshub.uocat.com/twitter/user/karpathy`：503

## 判断

本地 OPML 路线的配置文件已就绪，但公共 X RSSHub 桥接当前不可用，因此当天无法抓取新增 X 账号。

## 建议

- 短期：保留 `feeds/follow.opml`，以后重跑时若公共桥恢复，会自动进入 OPML RSS。
- 稳定方案：改走 Follow Builders 上游或自建 secret-backed X adapter。
- 不建议把 X API token、cookies 或登录态写入仓库。

## 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：本地 OPML 扩展已配置，但当前 X 桥接源失败，不影响默认公开源抓取。
