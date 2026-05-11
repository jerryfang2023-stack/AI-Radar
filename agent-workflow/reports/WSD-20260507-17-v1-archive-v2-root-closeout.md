---
task_id: WSD-20260507-17-v1-archive-v2-root
status: completed
date: 2026-05-07
owner: Workflow Agent / Dev Agent
encoding: UTF-8
automation_impact: none
---

# V1.0 内容归档与 V2.0 根目录 Closeout

## 1. 完成结论

已按用户要求在 `01-WaveSight` 下建立 V1.0 归档目录，并新建 `v2.0/` 目录作为后续 V2 新文件默认入口。

本轮没有移动或删除既有文件，避免破坏 `AGENTS.md`、`docs/`、`agent-workflow/`、`04-Site/` 中已经存在的大量路径引用。

## 2. 完成事项

- 新建 `归档/v1.0/`。
- 新建 `v2.0/`。
- 生成 V1.0 合并归档文件：`归档/v1.0/v1.0-content-archive.md`。
- 合并 V1 内容目录下 61 个 Markdown 文件，共 9057 行。
- 新增 `归档/v1.0/README.md`，标记归档目录为 read-only archive。
- 新增 `v2.0/README.md`，标记后续 V2 新文件默认进入 `v2.0/`。
- 新增 Plan-first 文件：`agent-workflow/execution/PLAN-v1-archive-v2-directory-2026-05-07.md`。
- 更新 `docs/README.md` 和 `agent-workflow/v2/v2-documentation-directory-architecture.md`，写入新目录口径。

## 3. V1 合并范围

| 目录 | 说明 |
|---|---|
| `01-Signals/` | V1 Signals / Daily Brief |
| `02-Scoring/` | V1 Scoring / Priority |
| `03-Trends/` | V1 Trend |
| `05-point/` | V1 The Point |
| `07-Opportunities/` | V1 Opportunities |

## 4. 本轮未移动范围

- `AGENTS.md`
- `docs/`
- `agent-workflow/`
- `04-Site/`
- `06-content/`
- `09-ai-news-radar/`
- `.git/`
- `.netlify/`
- `netlify.toml`

## 5. 范围合规

- 未移动既有文件。
- 未删除既有文件。
- 未修改 `04-Site/`。
- 未修改同步脚本。
- 未修改自动化配置。
- 未修改 Git 历史。

## 6. 后续规则

后续 V2 新文件默认进入：

```text
v2.0/
```

已存在且被调度、交接、质量闸门引用的 V2 文件暂保留原路径。若要进一步把 `agent-workflow/v2/`、`06-content/v2/` 或网站实现迁入 `v2.0/`，需要单独迁移任务，先做引用检查、备份和回滚方案。

## 7. Quality Gates

已运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：passed，6 项通过，失败 0。

报告：

- `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-110458.md`

## 8. 自动化影响

无。

旧自动化已停止；本轮未触碰 V2 生产线切换任务。
