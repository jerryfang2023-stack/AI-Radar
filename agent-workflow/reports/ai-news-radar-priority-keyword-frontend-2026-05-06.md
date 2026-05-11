---
title: AI News Radar 重点关键词与前端专区
date: 2026-05-06
type: implementation-report
status: completed
owner: dev/workflow
---

# AI News Radar 重点关键词与前端专区

## 任务

用户要求允许修改 `09-ai-news-radar` 前端和筛选规则，并基于三层“监测关键词组”新增前端关键词筛选 / 重点推送能力。

## 已完成

新增配置：
- `09-ai-news-radar/config/priority-keywords.json`

修改数据生成：
- `09-ai-news-radar/scripts/update_news.py`
- 新增 `priority_score`
- 新增 `priority_matches`
- 新增 `priority_groups`
- 新增 `priority_summary`
- 新增 `priority_items`
- 命中重点关键词的条目会进入 AI 强相关池，并进入重点关注候选。

修改前端：
- `09-ai-news-radar/index.html`
- `09-ai-news-radar/assets/app.js`
- `09-ai-news-radar/assets/styles.css`

前端新增：
- `重点关注` 专区。
- 重点卡片命中关键词展示。
- 普通新闻卡片的 `重点` 标签和关键词标签。

同时完成此前要求：
- OPML RSS 单源请求超时从 `12s` 调整为 `25s`。
- OPML 并发从最高 `20` 降到最高 `6`。

## 当前数据结果

基于当前 `latest-24h.json`：
- `priority_summary.enabled`：true。
- 关键词组数量：17。
- 重点命中条目：834。
- 前端专区输出：前 36 条高分重点条目。

## 验证

已通过：
- `node --check 09-ai-news-radar/assets/app.js`
- `python -m py_compile 09-ai-news-radar/scripts/update_news.py 09-ai-news-radar/scripts/export_obsidian.py`
- `pytest -q`：39 passed。
- 本地站点访问：`http://127.0.0.1:8088/` 返回 200。
- 本地数据访问：`http://127.0.0.1:8088/data/latest-24h.json` 返回 200。

未执行：
- 本轮未重新运行 Obsidian 导出，遵守用户已停止同步的要求。

## 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
- `ai-news-radar`：前端展示和本地数据筛选规则已变更；未引入 API Key、cookies、token、真实 OPML、邮箱正文或私有邮件内容。
