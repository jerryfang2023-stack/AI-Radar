---
task_id: WSD-20260510-03-v2-daily-monitoring-automation-prompt-fix
title: V2 每日监测自动化本体升级口径修复
date: 2026-05-10
status: accepted / automation-updated
owner: Workflow / Automation Agent
encoding: UTF-8
---

# V2 每日监测自动化本体升级口径修复

## 1. 触发原因

用户指出当前每日监测仍像旧版本运行，没有体现新版要求：

- Raw 80-150 条新闻。
- 合并 AI HOT / follow-builders 等新闻源。
- 做新闻分级。

核查结果：

- 项目派发文件 `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md` 和 `agent-workflow/v2/v2-daily-source-collection-strategy.md` 已是新版 80-150 口径。
- 但 Codex app 实际每天 09:00 执行的 automation `v2-content-site-daily-update` 仍保留旧 prompt：Raw 30-50、Pool 10-15、Structured 5-8、Front 3、Deep 0-1。

结论：用户判断正确，问题在“自动化本体 prompt 未同步更新”，不是策略文件没写。

## 2. 已修复

已直接更新 Codex app automation：

```text
C:\Users\86186\.codex\automations\v2-content-site-daily-update\automation.toml
```

当前状态：

```text
status = ACTIVE
rrule = FREQ=DAILY;BYHOUR=9;BYMINUTE=0;BYSECOND=0
```

新版每日漏斗：

- Raw：80-150 条；低信号或关键接口失败日可降级 50-80，但必须写明降级原因。
- Pool：20-30 条。
- Structured Signals：8-15 条。
- Front Signals：3-5 条。
- Deep Dive / Opportunity：1-2 条，证据不足时不得硬凑。
- Trend Updates：3-5 条。

## 3. 来源与分级口径

必须合并：

- AI HOT
- follow-builders
- Hacker News
- GitHub
- GDELT
- 官方产品 / 平台 / changelog / docs
- A 级商业媒体
- 融资 / VC / startup 来源
- developer / research / marketplace / customer / regulation 来源

硬规则：

- AI HOT、follow-builders、HN、X、Reddit 等只作为 M 级 discovery / source-router，不直接作为事实证据。
- 每条线索必须回看原始 URL。
- 原始来源按 S/A/B/C/D 重新分级：
  - S：一手事实来源。
  - A：高质量商业媒体 / 通讯社。
  - B：产业生态 / 开发者 / 研究 / 市场来源。
  - C：社交 / 社区 / 聚合线索。
  - D：噪音或低可信来源。
- C 级或 M 级采集通道不得作为事实主证据。

## 4. 后续验收

下一次每日 09:00 自动化应检查：

- closeout / daily run log 是否写出 Raw 80-150 或降级 50-80 原因。
- 是否记录 `source_distribution`、`failed_sources`、`fallback_used`、`evidence_gaps`、`raw_count_by_source_type`、`front_signal_sab_source_count`。
- Front Signal 是否每条至少 3 个解析后的 S/A/B 原始来源。
- Deep Dive 是否至少 5 个来源且至少 2 个 S 级或一手来源。
- 是否运行：

```powershell
node agent-workflow/tools/v2-source-quality-gate.mjs --date=当天日期
node agent-workflow/tools/run-quality-gates.mjs v2content --date=当天日期
node agent-workflow/tools/run-quality-gates.mjs syntax
```

## 5. 不做事项

- 未恢复旧 `04-Site`。
- 未写入 V1 内容目录。
- 未处理 `09-ai-news-radar`。
- 未做 Netlify deploy。
- 未启用 X / LinkedIn 非官方抓取。
