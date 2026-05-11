---
title: ai-news-radar 合并本地 follow-builders skill
date: 2026-05-06
type: automation-report
status: completed
owner: workflow/dev
---

# ai-news-radar 合并本地 follow-builders skill

## 任务

用户询问是否能把本地 `follow-builders` skill 合并进 `ai-news-radar`。

## 已完成

- 读取本地 skill：
  - `C:\Users\86186\.skill-store\follow-builders\SKILL.md`
  - `feed-x.json`
  - `feed-blogs.json`
  - `feed-podcasts.json`
  - `config/default-sources.json`
- 修改 `ai-news-radar/scripts/update_news.py`：
  - 保留远端 Follow Builders feed。
  - 新增本地 skill feed 读取。
  - 合并远端和本地 feed，并按 URL 去重。
  - 支持 `FOLLOW_BUILDERS_LOCAL_DIR` 环境变量。
  - 默认查找 `~/.skill-store/follow-builders`、`~/.codex/skills/follow-builders`、`~/.claude/skills/follow-builders`。
- 更新测试：
  - `tests/test_utils.py`
- 更新文档：
  - `docs/DEFAULT_SOURCE_ROUTING.md`

## 本轮运行结果

- Follow Builders 原始抓取量：59 条。
- 本地 OPML 仍启用：30 个 X RSSHub 源。
- OPML 当前成功 2 个：
  - Andrej Karpathy on X：12 条
  - Peter Steinberger on X：20 条
- OPML 当前失败 28 个，仍为公共 RSSHub X 桥不稳定。
- 24h AI 精选当前未展示 Follow Builders 条目，主要受时间窗口与主题过滤影响。
- 历史 archive 中已有 Follow Builders 记录。

## 验证

- `python -m py_compile scripts/update_news.py scripts/export_obsidian.py` 通过。
- `pytest -q` 通过，37 passed。
- `node --check assets/app.js` 通过。
- `python scripts/update_news.py --output-dir data --window-hours 24 --archive-days 21 --rss-opml feeds\follow.opml` 通过。
- `python scripts/export_obsidian.py --data-dir data --vault-dir "../01-WaveSight/08-AI news" --limit 100` 通过。

## 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：Follow Builders 读取能力增强；不引入 API Key、cookies、token 或邮箱正文。
