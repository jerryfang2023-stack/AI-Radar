---
task_id: WSD-20260507-09-v2-directory-content-architecture
board_id: V2-6
status: accepted
recommended_status: accepted / architecture
dispatch_path: agent-workflow/execution/WSD-20260507-09-v2-directory-content-architecture.md
closeout_path: agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md
owner: V2 Directory / Content Architecture Agent
encoding: UTF-8
automation_impact: planning-only; website update stopped and automation tasks should not run unless explicitly restarted
---

# WSD-20260507-09 V2 Directory / Content Architecture Closeout

## 0. 调度摘要

- 任务：输出 V2 文件目录与内容资产架构方案。
- 主产物：`agent-workflow/v2/v2-directory-content-architecture.md`
- 执行范围：只新增方案文档和 closeout，不移动文件、不删除文件、不重命名目录、不改脚本、不改自动化、不改 Netlify 配置。
- 用户补充口径：网站不再更新，自动化任务也不再运行；本 closeout 已按该口径更新。
- 推荐状态：`review`，待调度中枢和用户确认是否进入 V2-6A / V2-6B 后续执行。

## 1. 已读取文件

- `AGENTS.md`
- `docs/agent-handoff.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/execution/WSD-20260507-09-v2-directory-content-architecture.md`
- `agent-workflow/v2/v2-transition-charter.md`
- `agent-workflow/v2/v2-workspace-strategy.md`
- `agent-workflow/v2/v2-dev-workspace-baseline.md`
- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
- `agent-workflow/v2/v2-vi-design-direction.md`
- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`
- `04-Site/config/content-paths.json`
- `04-Site/README.md`
- `06-content/README.md`

## 2. V2-4 状态判断

`agent-workflow/v2/v2-product-architecture-prd.md` 已存在，状态为 `draft-for-dispatch-review`。看板中 V2-4 仍显示 `ready`，未见 accepted closeout。

本轮处理方式：

- 已吸收 V2-4 PRD 草案关于首页、栏目、AI商业内参、AI商业热力图和前后台边界的结论。
- 同时在方案中明确：如果 V2-4 后续正式收口并调整产品架构，V2-6 后续迁移任务必须重新对齐。

## 3. 已完成内容

已输出 `agent-workflow/v2/v2-directory-content-architecture.md`，覆盖：

- V1 内容冻结规则。
- V1 legacy / read-only / compatibility 层定义。
- `06-content/v2/` 推荐目录树。
- `agent-workflow/v2/schemas/`、`rules/`、`migration/`、`quality-gates/` 建议。
- `04-Site/v2/` 或 V2 分支 / worktree 前端目录策略。
- 当前目录处置矩阵。
- 自动化停止与未来重启影响表。
- 兼容期策略。
- V2-6A 到 V2-6E 分阶段迁移建议。
- 风险、回滚和验收要求。

## 4. 关键结论

V1 内容冻结：

- V1 网站内容不再日更。
- `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/` 保留为 legacy read-only compatibility 层。
- V2 新内容不得继续写入 V1 生产目录，除非用户明确启动 V2 生产迁移，并另有入站、同步脚本、QA 和回滚方案。
- V1 历史内容可用于 V2 训练、回溯、迁移和关系校验，不作为 V2 新内容默认入站位置。
- 因网站不再更新，`ai-the-point`、`ai-2`、`ai-3` 默认停止运行，不再继续生成 Markdown 或触发网站同步。

V2 内容库：

- 建议正式新增 `06-content/v2/`。
- 当前 `06-content/` 下已有 P0-12 test-only 结构，建议保留为 pilot 记录，不直接作为正式 V2 内容库。
- 建议新增 `12-legacy-index/`，用于 V1 历史内容映射，不移动原文件。

自动化停止口径：

- 当前 `04-Site/config/content-paths.json` 仍指向 V1 生产路径。
- `ai-the-point`、`ai-2`、`ai-3` 不再运行；不再按“继续并行运行”的兼容期设计。
- 未来只有用户明确要求重启 V2 生产链路时，才重新设计 `ai-the-point`、`ai-2`、`ai-3`、`sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`、`unified-site-sync.mjs` 和 `content-paths.json` 的迁移。
- 停止期只保留 V1 路径和配置作为历史兼容与回滚参考。

## 5. 未执行事项

按派发单硬规则，本轮未执行：

- 未移动任何文件。
- 未删除任何文件。
- 未重命名任何目录。
- 未创建实际 `06-content/v2/` 目录骨架。
- 未修改 `04-Site/config/content-paths.json`。
- 未修改 `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`。
- 未修改 `agent-workflow/tools/unified-site-sync.mjs`。
- 未修改 `ai-the-point`、`ai-2`、`ai-3` 自动化任务。
- 未修改 Netlify 配置。

## 6. 自动化停止与未来重启影响

本轮为方案文档任务，未修改任何自动化本体。按用户最新口径，网站不再更新，因此自动化任务也不再运行。下表记录的是历史依赖和未来如重启的影响，不表示这些任务仍在运行。

| 自动化 / 脚本 | 本轮是否修改 | 当前口径 | 未来如重启是否需迁移 |
|---|---:|---|---:|
| `ai-the-point` | 否 | 停止运行 | 是 |
| `ai-2` | 否 | 停止运行 | 是 |
| `ai-3` | 否 | 停止运行 | 是 |
| `04-Site/scripts/sync-data.mjs` | 否 | 不再定时运行，只作历史兼容 | 是 |
| `04-Site/scripts/check-relations.mjs` | 否 | 不再作为日更闸门运行 | 是 |
| `04-Site/scripts/check-tags.mjs` | 否 | 不再作为日更闸门运行 | 是 |
| `agent-workflow/tools/unified-site-sync.mjs` | 否 | 停止运行 | 是 |
| `04-Site/config/content-paths.json` | 否 | V1 历史兼容配置 | 是 |

## 7. 后续建议派发

建议按以下顺序派发：

1. `V2-6A`：创建 V2 内容目录骨架和 README，不移动旧内容。
2. `V2-6B`：定义 V2 schemas / source registry / HeatEvidence 文件规范。
3. `V2-6C`：如用户明确重启网站更新，重建 ai-2 到 V2 内容库的入站，保留 V1 只读兼容。
4. `V2-6D`：如用户明确重启网站更新，重建 ai-3 / sync-data / relation checks 支持 V2 数据。
5. `V2-6E`：迁移或映射 V1 历史内容到 V2 legacy index。

## 8. Quality Gates

已运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：通过，6 项检查，失败 0。

报告：

```text
agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-093651.md
```

说明：已在用户补充“网站不再更新，自动化任务也不再运行”口径后复跑 syntax Quality Gate。

页面截图、SYS-7、内容同步、关系检查、多身份权限验收不适用本轮，因为本任务只输出目录和内容资产架构方案，不改页面、不改生产内容源、不改同步脚本、不部署。

## 9. 回调度窗口口令

```text
收口：WSD-20260507-09-v2-directory-content-architecture
```
