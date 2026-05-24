---
task_id: WSD-20260520-01-source-layer-governance
title: Source / 采集层治理
status: ready
owner: Intelligence Engine
created_at: 2026-05-20
encoding: UTF-8
depends_on: none
next_task: WSD-20260520-02-raw-evidence-governance
---

# WSD-20260520-01｜Source / 采集层治理

## 1. 任务目标

治理每日监测的 Source / 采集层，明确观澜 AI 从哪里抓、哪些源可信、哪些源只能作为线索，防止 AI HOT、follow-builders、关键词搜索、媒体、官方源和社区源在入口阶段就污染 Raw。

本任务只处理 Source / 采集层，不处理 Raw 字段、Pool 分流、卡片生成和前台内容。

## 2. 必读文件

只读取：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/05-daily-monitoring.md`
4. `skills/guanlan-daily-monitor/SKILL.md`
5. `agent-workflow/product/daily-monitoring-playbook.md`
6. `agent-workflow/product/source-intelligence.md`
7. `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
8. `01-SiteV2/content/11-databases/source-registry-v2.json`
9. `agent-workflow/tools/run-guanlan-daily-monitor.mjs`

如发现全局 Skill 与项目内 Skill 口径冲突，以项目内 `skills/guanlan-daily-monitor/SKILL.md` 为准，并在 closeout 中记录。

## 3. 治理问题

必须回答并落地：

- AI HOT、follow-builders、关键词搜索、HN、GitHub、GDELT、官方源、媒体、VC / research / developer 源分别是什么角色。
- 哪些源可以作为发现入口。
- 哪些源可以作为事实主证据。
- 哪些源只能进入观察、补证、观点线索或 index。
- 哪些关键词搜索路径容易抓到垃圾页、官网首页、工具目录、中文 SEO 页。
- AI HOT daily selected 如何保留完整性，但不自动抬升为 `core_pool`。
- follow-builders 如何作为观点入口，而不是事实主证据。

## 4. 可修改范围

允许修改：

- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/daily-monitoring-playbook.md`
- `skills/guanlan-daily-monitor/SKILL.md`
- `agent-workflow/automation-prompts/guanlan-daily-monitor.md`
- `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
- `01-SiteV2/content/11-databases/source-registry-v2.json`
- `agent-workflow/tools/run-guanlan-daily-monitor.mjs` 中与来源分类、来源角色、采集入口有关的逻辑

不得修改：

- Raw 字段 schema 的非来源字段
- Pool 分流规则
- 卡片模板和卡片文案
- 前台网站
- GitHub / Netlify

## 5. 验收闸门

必须运行：

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('01-SiteV2/content/11-databases/keyword-monitoring-v2.json','utf8')); JSON.parse(fs.readFileSync('01-SiteV2/content/11-databases/source-registry-v2.json','utf8')); console.log('json ok')"
```

如修改每日监测 prompt 或 Skill，必须确认不再引用已删除规则文件。

## 6. Closeout 要求

写入：

```text
agent-workflow/reports/WSD-20260520-01-source-layer-governance-closeout.md
```

closeout 必须说明：

- 调整了哪些来源角色。
- 哪些来源被降级为发现入口。
- 哪些来源可以作为事实主证据。
- 哪些搜索路径被限制或重写。
- 是否修改脚本。
- 验证结果。
- 是否建议解锁 Raw / 证据层任务。

