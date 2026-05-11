---
title: V1 Archive and V2 Directory Plan
date: 2026-05-07
status: active
owner: Workflow Agent / Dev Agent
encoding: UTF-8
---

# V1 内容归档与 V2.0 目录计划

## 1. 背景与目标

用户要求在 `01-WaveSight` 根目录下建立归档目录，把 V1.0 内容合并为一个文件放入归档目录，并新建 `v2.0` 目录，后续所有 V2 文件进入 `v2.0`。

本轮目标：

- 新建 `归档/v1.0/`。
- 把 V1 内容目录中的 Markdown 合并成一个归档文件。
- 新建 `v2.0/` 作为后续 V2 文件入口。
- 写清哪些文件本轮不移动，避免破坏既有引用。

## 2. V1 合并范围

本轮合并以下 V1 内容目录的 Markdown：

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-point/`
- `07-Opportunities/`

这些目录代表 V1 主要内容资产：Signals、Scoring / Priority、Trends、The Point、Opportunities。

## 3. 本轮不移动的范围

以下路径暂不移动：

- `AGENTS.md`
- `docs/`
- `agent-workflow/`
- `04-Site/`
- `06-content/`
- `09-ai-news-radar/`
- `.git/`
- `.netlify/`
- `netlify.toml`

原因：

- `agent-workflow/`、`docs/` 和 `AGENTS.md` 是当前调度、交接、治理、质量闸门和 V2 规划的恢复入口，直接搬动会破坏大量路径引用。
- `04-Site/` 和同步脚本仍是网站与数据输出目标，迁移必须另派 Dev 任务。
- `09-ai-news-radar/` 是本地 external radar candidate，尚未确定是否进入 V2 正式体系。

## 4. 新目录规则

| 目录 | 用途 |
|---|---|
| `归档/v1.0/` | V1 内容归档、索引和只读历史资产 |
| `v2.0/` | 后续 V2 新文件、新规范、新内容和新实现的默认入口 |

后续新建 V2 文件时，优先放入 `v2.0/` 下，再通过 README 或索引指向必要的治理文件。

## 5. 风险与控制

| 风险 | 控制 |
|---|---|
| 合并文件过大 | 保留原文件路径和分隔标题，便于查找 |
| 移动现有文件破坏引用 | 本轮不移动既有文件，只新增归档副本和 V2 入口 |
| V2 新目录与 `agent-workflow/v2/` 并存造成混乱 | `v2.0/README.md` 写清新目录为后续入口，旧 `agent-workflow/v2/` 仍作为已存在治理事实保留 |
| 误把 V1 内容继续当生产入口 | `归档/v1.0/README.md` 标记为 read-only archive |

## 6. 验收标准

- `归档/v1.0/v1.0-content-archive.md` 存在。
- 归档文件包含 V1 内容目录下的 Markdown，并保留原路径分隔。
- `v2.0/README.md` 存在并说明后续 V2 文件进入该目录。
- 未移动或删除既有文件。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

