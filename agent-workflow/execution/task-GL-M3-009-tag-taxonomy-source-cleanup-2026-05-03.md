---
title: GL-M3-009 Tag Taxonomy Source Cleanup
date: 2026-05-03
owner: data-agent
status: passed
type: execution-plan
---

# GL-M3-009 Tag Taxonomy Source Cleanup

## 背景

用户要求根据 `agent-workflow/product/tag-taxonomy.md` 整理网站 tag 内容，并进一步要求对原始 Markdown 文件中的 tag 做对应整理。

当前问题：

- 多数 Opportunity 原始文件仅使用 `AI创业机会`，无法支撑筛选与关系网络。
- 部分源文件存在别名或旧标签，如 `AI-Agent`、`AI编程`、`AI-Coding`、`AI增长`、`Voice-AI`、`企业数据`、`企业知识库`。
- 网站同步逻辑中仍会生成部分旧标签，如 `AI企业服务`、`AI数据智能`、`AI治理与安全`、`营销增长`、`销售/客服`。

## 执行范围

- `01-Signals/*.md`
- `02-Scoring/*.md`
- `03-Trends/AI趋势总表.md`
- `05-Point/*.md`
- `05-Point/sources/**/*.md`
- `07-Opportunities/*.md`
- `04-Site/scripts/sync-data.mjs`
- 新增 tag 检查报告或检查脚本

## 分工

- Intelligence Data Agent：定义映射、清理泛标签、生成质量报告。
- Dev Agent：调整同步逻辑并运行网站同步、关系检查、tag 检查。
- Workflow / Automation Agent：记录自动化影响与交接状态。

## 验收标准

- `AI创业机会` 不再作为 Opportunity 唯一标签。
- 原始 Markdown frontmatter 中旧别名归并到正式标签。
- Opportunity 至少具备 track / function / scenario 中的关键标签，并尽量补充 customer / evidence / stage / region。
- 网站同步后的 tag 不再批量生成旧别名。
- 运行同步与关系检查通过。
- 若影响 `ai-the-point`、`ai-2`、`ai-3`，同步更新自动化任务；如不需更新，报告说明原因。

## 执行结果

- 已完成源 Markdown frontmatter tags 清理。
- 已完成 Signals 正文 `标签` 字段别名归并。
- 已完成 The Point `主题` 字段归并。
- 已新增 `agent-workflow/tools/normalize-source-tags.mjs`。
- 已新增 `04-Site/scripts/check-tags.mjs`。
- 已更新 `04-Site/scripts/sync-data.mjs`，公开 tags 只允许正式字典标签进入，详细词保留在 `taxonomy`。
- 已更新 `agent-workflow/tools/unified-site-sync.mjs`，同步闸门纳入 tag 检查。
- 已同步更新 `ai-the-point`、`ai-2`、`ai-3` 三个自动化任务。

报告：`agent-workflow/reports/tag-taxonomy-source-cleanup-2026-05-03.md`
