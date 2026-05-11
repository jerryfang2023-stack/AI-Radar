---
title: ai-news-radar Builders 过滤规则放宽
date: 2026-05-06
type: automation-report
status: completed
owner: workflow/dev
---

# ai-news-radar Builders 过滤规则放宽

## 任务

用户要求先让 X / Follow Builders 更容易出现在 radar 页面。

## 已完成

修改 `C:\Users\86186\Documents\Fang\wiki\AI热点\ai-news-radar\scripts\update_news.py`：

- `site_id == followbuilders` 默认进入 AI 强相关。
- 本地 OPML 中识别为 X builders 的 `opmlrss` 条目默认进入 AI 强相关。
- 未放宽普通热榜、商业促销、娱乐噪音等通用来源。

新增测试：

- Follow Builders 即使短 tweet 没有显式 AI 关键词，也进入 AI 强相关。
- 本地 OPML X builder feed 进入 AI 强相关。

## 本轮结果

- `latest-24h.json`：974 条。
- `latest-24h-all.json`：6863 条。
- Follow Builders 原始抓取：59 条。
- 本地 OPML X 源：30 个。
- OPML 成功源：12 个。
- OPML 失败源：18 个。
- AI 强相关中新增 OPML X 条目：31 条。
- Obsidian 已重新导出 120 条 item notes。

成功的 OPML X 源：

- Alexandr Wang
- Andrew Ng
- Aravind Srinivas
- Demis Hassabis
- Greg Brockman
- Guillermo Rauch
- Jason Wei
- Jeff Dean
- Sam Altman
- Simon Willison
- Swyx
- Yann LeCun

## 验证

- `python -m py_compile scripts/update_news.py scripts/export_obsidian.py` 通过。
- `pytest -q` 通过，39 passed。
- `node --check assets/app.js` 通过。
- `python scripts/update_news.py --output-dir data --window-hours 24 --archive-days 21 --rss-opml feeds\follow.opml` 通过。
- `python scripts/export_obsidian.py --data-dir data --vault-dir "../01-WaveSight/08-AI news" --limit 120` 通过。

## 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：AI 强相关过滤规则对 builders 源更宽松；未引入 API Key、cookies、token 或邮箱正文。
