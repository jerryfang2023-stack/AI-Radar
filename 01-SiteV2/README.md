---
title: WaveSight 01-SiteV2
date: 2026-05-18
status: active-v2-root
encoding: UTF-8
---

# 观澜AI｜WaveSight 01-SiteV2

本目录是 V2.1 新文件、内容库和新站工程的默认入口。V2.1 以 `WSD-20260518-GRILLME-STRATEGY-PRODUCT` 和 `WSD-20260518-RAW-POOL-CARD-RULES` 为当前战略、产品和证据生产线基座。

## 使用规则

- 后续新建 V2.1 文档、规范、内容样张、页面实现方案和生产线文件，优先放入本目录。
- `content/` 保留为内容生产线子目录，不把 raw / pool / structured / reports 文件平铺到站点根目录。
- `knowledge/` 保留为 Obsidian 长期知识库层，用于沉淀观点库、案例库、信号库、机会库和来源库；不要把每日 Raw 全量搬入知识库。
- 已存在的 `AGENTS.md`、`docs/`、`agent-workflow/` 暂保留在项目根目录，用于新窗口接手、调度治理和长期记录。
- V1.0 内容归档与旧站工程已从当前仓库移除；如需追溯只能查看 Git 历史。

## 建议结构

```text
01-SiteV2/
  README.md
  docs/
  product/
  content/
  knowledge/
  site/
  workflow/
  reports/
```

## 当前过渡口径

现有 V2 规划文件仍保留在 `agent-workflow/v2/`，这是已经被派发单、progress、handoff 和 reports 引用的事实路径。

后续新增 V2 文件应逐步进入 `01-SiteV2/`，必要时再通过单独迁移任务把已验收 V2 文件映射或复制到本目录。
