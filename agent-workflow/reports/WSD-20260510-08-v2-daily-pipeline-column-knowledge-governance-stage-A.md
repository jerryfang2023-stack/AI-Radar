---
title: V2 每日生产线治理 Stage A 每日抓取流程确认与执行总结
date: 2026-05-10
task_id: WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance
stage: A
status: completed / awaiting-B-confirmation
owner: workflow / data / pm
encoding: UTF-8
---

# Stage A｜每日抓取流程

## 用户确认

用户已确认 A 类：每日抓取流程。

## 本阶段执行范围

本阶段只固化每日抓取流程规则，不修改 V2 既有内容正文、不修改 Obsidian 知识卡片、不修改 V2 前台页面。

## 已确认规则

- 每日 09:00 自动化继续作为 V2 生产入口。
- Raw 80-150 为完整运行口径；低信号或关键接口失败日可降级为 50-80。
- 旧 Raw 30-50 口径废止；低于 50 Raw 只能记录为失败或部分失败。
- AI HOT、follow-builders、HN、X、Reddit、聚合站统一作为 M 级 discovery / source-router。
- M 级通道不得作为事实主证据。
- M 级通道命中的线索必须回看原始 URL，并按原始来源重新判定 S/A/B/C/D。
- C / M 来源不得补成 S/A/B 数量。
- 每日日志必须包含 `source_distribution`、`failed_sources`、`fallback_used`、`evidence_gaps`、`raw_count_by_source_type`、`front_signal_sab_source_count`。

## 已修改文件

- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`
- `agent-workflow/v2/v2-daily-source-collection-strategy.md`
- `agent-workflow/governance/automation-fallback-policy.md`

## 未修改文件

- 未修改 `01-SiteV2/content/` 既有内容。
- 未修改 `01-SiteV2/knowledge/` 已入库卡片。
- 未修改 `01-SiteV2/site/` 页面或站点数据。
- 未修改 `C:\Users\86186\.codex\automations\v2-content-site-daily-update\automation.toml`；原因是实际自动化 prompt 已包含 A 类确认的核心口径，本阶段只补齐项目内规则文件的硬约束表述。

## 待用户确认下一类

下一类为 B：内容漏斗质量。
