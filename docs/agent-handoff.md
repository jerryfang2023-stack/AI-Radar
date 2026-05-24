---
title: WaveSight Current Handoff
date: 2026-05-24
status: current
encoding: UTF-8
---

# WaveSight 当前交接

本文件只保留新窗口接手所需状态。长交接、过程依赖、临时规划和过程截图不再作为默认上下文。

## 当前口径

- 项目：观澜 AI｜WaveSight AI。
- 版本：V2.2。
- 定位：由 Agent 驱动的 AI 商业情报系统，不是新闻站、工具导航或普通日报。
- 前台导航：今日观察 / 商业信号 / 趋势追踪 / 商业内参。
- 默认入口：`AGENTS.md` + `context/context-index.md` + 当前派发单。
- 当前上下文只以 `context/` 和 `skills/` 为准；历史 closeout 只用于验收追溯，不作为新任务默认依据。

## 当前目录

- 新站工程：`01-SiteV2/site/`
- 内容生产：`01-SiteV2/content/`
- 判断资产：`01-SiteV2/knowledge/`
- 当前上下文：`context/`
- 当前 Agent：`agent-workflow/agents/`
- 当前 Skill：`skills/`

## 当前生产线

- `guanlan-daily-monitor`：手动触发，产出 Raw / Pool / monitor log / quality loop / QC。
- `guanlan-daily-assets-chain`：手动触发，先过 readiness，再生成商业信号卡、观点卡和候选资产。
- `daily-observation-writer`：暂停自动化，不自动写稿或自动同步网站。

手动触发命令以 `context/00-current-state.md` 为准。

## 当前规则要点

- Source -> Raw -> Pool -> Card -> Column -> Site 顺序固定，后一层必须继承前一层 closeout。
- NewsAPI 已退出当前活跃搜索链路；当前 A-media / news verification 为 `GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback`。
- Anysearch / Tavily / Exa / GDELT 的有效供应商日期必须归一到 `published_at`；不得从 URL、标题、孤立年份或 activity id 伪造发布时间。
- 搜索结果进入 Raw 前先跨入口去重：canonical URL，其次来源家族 + 标题指纹 + 发布日。
- eligible `core_pool` + `raw_qc_decision=allow` 默认全部生成正式前台 `signal_card`；不再用单日数量上限或 selected change cards 截流。
- 前沿观点先入 `opinion_intake`，保留原文 / 原文摘录、中文翻译、来源和 `formal_tags`；评级前先合并重复观点卡。
- 观点卡只有 `feature` / `sidebar`、翻译完成且发布状态为前台状态时才能进入前台；`archive` / `discard` 不得 fallback 展示。
- 趋势和变化判断不再把“反证”或固定 `7 / 30 / 90` 时间窗口作为硬准入；必须写清风险边界、信息缺口或后续观察变量。
- Tags 只服务搜索、筛选、关系网络和复盘；正式资产必须使用 `formal_tags`，不得编造 taxonomy 外标签。

## 当前限制

- 不推送 GitHub，不部署 Netlify，除非用户明确恢复。
- 不恢复已停止的网站版本、内容日更或旧自动化变体。
- 不新增一级导航，除非用户明确确认。
- 页面任务必须先有 Typography 页面位置表和 Copy-first 文案表；桌面端优先，移动端专项按派发单执行。

## 恢复方式

新窗口只需读取：

1. `AGENTS.md`
2. `context/context-index.md`
3. 当前任务派发单或 closeout
4. 任务对应的 1-3 个 current 文档或 Skill
