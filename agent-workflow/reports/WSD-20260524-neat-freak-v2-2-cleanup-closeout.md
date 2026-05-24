---
task_id: WSD-20260524-neat-freak-v2-2-cleanup
title: neat-freak V2.2 规则与工作区清理 closeout
date: 2026-05-24
status: completed_with_remote_boundary
owner: Codex / Product Commander / Build & Release
encoding: UTF-8
---

# WSD-20260524 neat-freak V2.2 规则与工作区清理 closeout

## 1. 执行结论

本轮使用 `neat-freak` 对近期规则更新做收口清理，当前入口、规则真源、质量门脚本和看板已统一到 V2.2。

已确认：

- 当前默认入口 `AGENTS.md` 已标为 V2.2。
- `context/` 当前状态、执行外壳、索引已同步到 2026-05-24 / V2.2。
- 站点 README、产品真源、Agent 说明、质量门脚本、运行看板已同步到 V2.2。
- NewsAPI 保留为 retired 记录，不再作为活跃搜索链路。
- 趋势 / 变化不再把“反证窗口”或固定 `7 / 30 / 90` 时间窗口作为硬门槛。
- 标签体系验证通过：未知正式 tag 为 0，缺 `formal_tags` 的正式资产为 0。

## 2. 规则修正

| 范围 | 修正 |
|---|---|
| 版本口径 | `AGENTS.md`、`context/00-current-state.md`、`context/06-execution-harness.md`、`01-SiteV2/README.md`、`01-SiteV2/site/README.md`、`package.json` / `package-lock.json` 已升到 V2.2 / `2.2.0` |
| 当前交接 | `docs/agent-handoff.md` 重写为 V2.2 当前 handoff，删除旧自动化 active、NewsAPI active 和旧阻塞项 |
| 当前进度 | `agent-workflow/progress.md` 重写为 V2.2 当前进度，历史 accepted closeout 不再当作当前执行指令 |
| 栏目架构 | `agent-workflow/product/column-architecture.md` 重写为 V2.2 栏目架构，今日观察按 newsletter 口径，商业信号 / 观点 / 趋势 / 内参边界重新归位 |
| 趋势与变化 | `01-SiteV2/content/README.md`、`01-SiteV2/knowledge/README.md`、`01-SiteV2/content/06-asset-candidates/README.md` 去除旧反证窗口硬要求 |
| 页面规范 | `agent-workflow/product/DESIGN.md`、`docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md` 更新到 V2.2 |
| Agent / 工具 | `agent-workflow/agents/*` 和质量门脚本已去除 V2.1 / 今日判断旧口径 |
| 看板 | `agent-workflow/execution/dispatch-board.md` 压缩为当前可执行任务和注意项，历史任务回到 reports |

## 3. 清理动作

- 删除根目录临时截图：`.tmp-case-detail-0148.png`、`.tmp-opinion-quotes-0135.png`、`.tmp-opinion-rail-0154.png`。
- `.gitignore` 增加 `.tmp-*.png`，防止后续验证截图污染根目录。
- 清理本轮触碰文件的行尾空格。
- 保留历史 dated Raw、历史 closeout 和历史质量门报告作为审计记录；它们不再作为当前规则入口。

## 4. GitHub / 远端边界

本地工作区当前已有大量旧跟踪文件处于删除状态，说明历史文件清理已经在本地发生。

本轮没有执行：

- `git push`
- GitHub 远端删除
- 远端历史重写
- `git filter-repo` / `filter-branch`

原因：清理 GitHub 远端历史或重写提交历史属于不可逆高风险动作，需要用户单独明确授权。当前可安全确认的是：V2.2 规则和本地工作区清理已完成，远端发布 / 历史改写未执行。

## 5. 验证

| 验证 | 结果 |
|---|---|
| `node --check` 三个已改工具脚本 | passed |
| `package.json` / `package-lock.json` JSON 解析 | passed |
| `node agent-workflow/tools/run-quality-gates.mjs syntax --date=2026-05-24` | passed |
| `node agent-workflow/tools/check-tags.mjs` | passed |
| `node agent-workflow/tools/v2-content-gate.mjs --date=2026-05-23` | passed |
| `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-23` | passed |
| `git diff --check` 本轮触碰文件 | passed |
| 根目录 `.tmp-*.png` 残留 | 0 |

## 6. 残留说明

当前规则入口内只剩一处“今日判断”命中，位于 `agent-workflow/product/column-architecture.md`，语义是“不恢复今日判断作为首页或栏目主口径”，属于反向约束，不是旧口径残留。

历史报告和历史 Raw 文件中仍可能出现 V2.1、NewsAPI 或旧术语，它们是历史记录，不作为当前执行依据。后续若要从 GitHub 远端彻底移除这些历史记录，需要单独执行 Git 历史清理任务。

