---
task_id: WSD-20260510-06-v2-obsidian-knowledge-layer
title: V2 Obsidian 长期知识库目录与模板创建
date: 2026-05-10
status: accepted / knowledge-layer-ready
owner: Workflow / Data
encoding: UTF-8
---

# V2 Obsidian 长期知识库目录与模板创建

## 1. 用户要求

正式创建：

```text
01-SiteV2/knowledge/
```

并补齐 Obsidian 模板，用于长期积累：

- 观点库
- 案例库
- 信号库

## 2. 已完成

新增长期知识库根目录：

```text
01-SiteV2/knowledge/
```

新增目录：

- `00-MOC/`
- `01-Signals/`
- `02-Points/`
- `03-Cases/`
- `04-Opportunities/`
- `05-Trends/`
- `06-Sources/`
- `07-Companies/`
- `08-People/`
- `09-Templates/`
- `99-Archive/`

新增索引与说明：

- `01-SiteV2/knowledge/README.md`
- `01-SiteV2/knowledge/00-MOC/WaveSight Knowledge MOC.md`
- 各子目录 `README.md`

新增 Obsidian 模板：

- `09-Templates/signal-note-template.md`
- `09-Templates/point-note-template.md`
- `09-Templates/case-note-template.md`
- `09-Templates/opportunity-note-template.md`
- `09-Templates/trend-note-template.md`
- `09-Templates/source-note-template.md`
- `09-Templates/company-note-template.md`
- `09-Templates/person-note-template.md`
- `09-Templates/daily-curation-template.md`

同步更新：

- `01-SiteV2/README.md`
- `docs/README.md`

## 3. 目录口径

`01-SiteV2/content/`：

- 每日生产漏斗。
- 面向自动化和网站数据生成。
- 不直接承担长期知识库全部职责。

`01-SiteV2/knowledge/`：

- Obsidian 长期知识库层。
- 只接收经过筛选、可复用、可双链的知识资产。
- 不把 Raw 80-150 全量搬入知识库。

## 4. 后续建议

下一步可新增小任务：

```text
WSD-20260510-07-v2-knowledge-first-curation
```

任务范围：

- 从 2026-05-10 今日内容中挑选 3 条 Front Signal、6 条 Point、2-3 个 Case。
- 按模板创建第一批知识卡片。
- 建立 Signal / Point / Case / Company / Source / Trend 之间的 Obsidian 双链。

## 5. 验收

验收结论：`accepted / knowledge-layer-ready`

说明：

- 本轮只创建目录与模板，不迁移具体内容卡片。
- 未改网站页面。
- 未改自动化本体。
- 未处理 `09-ai-news-radar`。
- 未做 Netlify deploy。
