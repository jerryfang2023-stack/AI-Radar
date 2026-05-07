---
title: 观澜AI Agent Handoff
date: 2026-05-03
type: agent-handoff
status: current
project: 观澜AI｜WaveSight AI
tagline: 观AI之澜，识商业之势
---

# 观澜AI Agent Handoff

## 0AD. 2026-05-07 V2-5A baseline Batch 1 / Batch 3 已处理

用户确认口径：排除默认项，提交 Batch 1，归档 Batch 3，直接处理。

调度中枢已完成：
- Batch 1 已提交：`e75d90b docs: record accepted v2 planning baseline`
- Batch 3 已归档提交：`a46226d chore: archive v2 monitoring test pipeline`
- V1.0 baseline tag 已创建：`v1.0-baseline-20260507`，指向 Batch 1 commit `e75d90b`

提交边界：
- Batch 1 只纳入 accepted V2 planning、governance、V2 isolation skeleton、V2 closeout / stage summary 与 2026-05-07 syntax gate 报告。
- Batch 3 只纳入 P0-12 / daily monitoring v2 test-only pipeline 的历史归档文件。
- 默认排除项未提交：`09-ai-news-radar/`、P0-11、P0-2A、P0-2B、P1-4B、未确认临时审计目录、未验收页面实现。
- Batch 2 未提交：2026-05-05 / 2026-05-06 生产内容、生成网站数据与相关同步报告仍需 Data / Workflow 另行确认。

当前限制：
- 未创建 `codex/v2-planning` branch。
- 未创建外部 V2 worktree。
- 未执行生产自动化切换、V2 网站同步、Netlify 发布或生产 `content-paths.json` 迁移。

Quality Gate：
- Batch 1 提交前 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-102625.md`。
- Batch 3 归档前 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-102813.md`。

## 0AC. 2026-05-07 V2-PREFLIGHT 已验收

最新状态：`V2-PREFLIGHT / WSD-20260507-11-v2-preflight-governance-autopilot` 已由调度中枢验收为 `accepted / preflight-complete`。

收口文件：
- `agent-workflow/reports/WSD-20260507-11-v2-preflight-governance-autopilot-closeout.md`

主产物：
- `agent-workflow/reports/WSD-20260507-11-v2-baseline-decision-package.md`
- `agent-workflow/reports/WSD-20260507-11-v2-schema-quality-review.md`

Part A baseline 结论：
- Git baseline 仍为 `blocked / user-git-confirmation-required`。
- 当前工作树仍不干净，不能直接全部提交。
- 三段提交策略仍成立：
  1. accepted V2 planning + governance + V2 isolation skeleton。
  2. 2026-05-05 / 2026-05-06 生产内容和生成数据，需 Data / Workflow 另行确认。
  3. P0-12 test-only pipeline，需用户明确是否作为 test-only 历史归档。
- 默认排除 `09-ai-news-radar/`、P0-11、P0-2A、P0-2B、P1-4B、未确认临时审计目录、未验收页面实现。
- 本轮未执行 `git add`、`git commit`、tag、branch、worktree。

Part B schema / quality gate 结论：
- V2 isolation skeleton 足以启动 `V2-7` limited 7-day isolation validation。
- 不足以进入生产 cutover。
- 不足以进入完整 V2 页面 / 产品 Dev。
- 主要缺口：V2-4 尚未被调度中枢 accepted；Point Calibration、Trend Context、Opportunity Report 尚无独立最小 schema；Source Registry 还没有实际来源清单；质量闸门仍是文档级，不是可执行 validator。

V2-7 允许范围：
- 只使用 `06-content/v2/`。
- 不写入 V1 内容目录。
- 不修改生产自动化。
- 不修改 `content-paths.json`。
- 不修改同步脚本或 Netlify 配置。
- 每日输出手工关系表。
- 第 7 天输出 1 份 weekly AI Brief sample。

范围合规：
- 未修改生产 `ai-the-point`、`ai-2`、`ai-3`。
- 未修改 `content-paths.json`。
- 未修改同步脚本。
- 未修改 Netlify 配置。
- 未移动、删除、重命名 V1 内容目录。

Quality Gate：
- 执行窗口 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-101733.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-102056.md`。

## 0AB. 2026-05-07 派发任务改为连贯 / 自动化优先

用户要求：以后创建派发任务，秉持“一个能连贯或者自动化执行的优先原则”。

调度中枢已写入：
- `agent-workflow/governance/window-dispatch-hub.md`

新规则：
- 后续新增任务时，默认优先判断是否能合并为同一执行窗口的连续任务包。
- 能顺序执行的任务，优先做 `AUTO` / `autopilot` 派发包。
- 小阶段用 stage summary 记录，最终只回调度中枢一次。
- 不再把同一条链路拆成过多来回派发，除非遇到硬闸门。

必须拆分或停止的硬闸门：
- 用户产品决策。
- PM 门禁 / WAVE / 模块决策表。
- UI / UE Design Director 证据化审美验收。
- 生产自动化、同步脚本、`content-paths.json`、Netlify 配置。
- Git commit / tag / branch / worktree / push。
- 正式页面 Dev、部署、生产数据切换或权限变更。
- 可能混入 failed / abandoned / stopped / review 成果。

注意：
- 连贯 / 自动化优先不降低质量闸门。
- 自动包必须写清阶段顺序、允许范围、禁止事项、硬停止点和最终 closeout。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-101131.md`。

## 0AA. 2026-05-07 新增 V2-PREFLIGHT 预备治理自动包

用户询问是否能把 `V2-5A baseline 决策` 和 `V2-6F schema / quality gate 复核` 合并或自动化执行。

调度中枢已新增：
- `V2-PREFLIGHT / WSD-20260507-11-v2-preflight-governance-autopilot`
- 派发单：`agent-workflow/execution/WSD-20260507-11-v2-preflight-governance-autopilot.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-11-v2-preflight-governance-autopilot-closeout.md`
- 状态：`ready`

执行口径：
- Part A：承接 V2-5A，输出 baseline 提交范围决策包和后续 Git 命令草案。
- Part B：承接 V2-6F，复核 V2 schemas、rules、quality gates、Source Registry、HeatEvidence、AI Brief 规范。
- 可判断是否足以进入 `V2-7` 7 日隔离验证。

硬边界：
- 不执行 `git add` / `git commit` / tag / branch / worktree。
- 不修改 `content-paths.json`、同步脚本、统一同步闸门、生产自动化或 Netlify 配置。
- 不移动、删除、重命名 V1 内容目录。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-100843.md`。

## 0Z. 2026-05-07 V2-6AUTO 隔离骨架已验收

最新状态：`V2-6AUTO / WSD-20260507-10-v2-directory-migration-autopilot` 已由调度中枢验收为 `accepted / isolation-skeleton`。

收口文件：
- `agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md`

阶段摘要：
- `agent-workflow/reports/WSD-20260507-10-stage-6A-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6B-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6C-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6D-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6E-summary.md`

已完成：
- `V2-6A`：创建 `06-content/v2/` 内容目录骨架与 README。
- `V2-6B`：创建 V2 schemas、rules、quality gates。
- `V2-6C`：创建 ai-2 V2 入站隔离方案和提示词草案，未改生产 ai-2。
- `V2-6D`：创建 ai-3 / sync / relation check 隔离方案和 `content-paths` 草案，未改生产脚本。
- `V2-6E`：创建 V1 legacy index，不移动 V1 原文件。

范围合规：
- 未修改 `04-Site/config/content-paths.json`。
- 未修改 `04-Site/scripts/sync-data.mjs`。
- 未修改 `04-Site/scripts/check-relations.mjs`。
- 未修改 `04-Site/scripts/check-tags.mjs`。
- 未修改 `agent-workflow/tools/unified-site-sync.mjs`。
- 未修改生产 `ai-the-point`、`ai-2`、`ai-3` 自动化任务。
- 未修改 Netlify 配置。
- 未移动、删除、重命名或编辑 V1 内容目录。

后续硬规则：
- 生产自动化或同步切换仍需单独派发。
- `V2-6C` / `V2-6D` 当前只是隔离方案，不代表生产链路已切换。
- `V2-5A` baseline 范围仍待用户确认，不得把这些新增文件直接混入不可信 baseline。

Quality Gate：
- 执行窗口 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-095517.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-100158.md`。

## 0Y. 2026-05-07 新增 V2-6AUTO 单窗口顺序执行包

用户询问是否能自动化执行 `V2-6A` 到 `V2-6E`，减少每个子任务来回调度。

调度中枢已新增：
- `V2-6AUTO / WSD-20260507-10-v2-directory-migration-autopilot`
- 派发单：`agent-workflow/execution/WSD-20260507-10-v2-directory-migration-autopilot.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md`
- 状态：`ready`

执行口径：
- 单个执行窗口按 `V2-6A -> V2-6B -> V2-6C -> V2-6D -> V2-6E` 顺序执行。
- 每阶段写 stage summary，但最终只回调度中枢一次。
- `V2-6A` / `V2-6B` / `V2-6E` 可创建隔离目录、README、schema、rules、legacy index。
- `V2-6C` / `V2-6D` 只允许做隔离层方案、runbook、提示词草案、fixtures 和切换计划。
- 不得修改生产 `ai-2`、`ai-3`、`content-paths.json`、同步脚本、统一同步闸门或 Netlify 配置。
- 如必须改生产自动化或同步脚本，执行窗口必须停止并在 closeout 写阻塞原因。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-094245.md`。

## 0X. 2026-05-07 V2-6 目录与内容资产架构已验收

最新状态：`V2-6 / WSD-20260507-09-v2-directory-content-architecture` 已由调度中枢验收为 `accepted / architecture`。

收口文件：
- `agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md`

主产物：
- `agent-workflow/v2/v2-directory-content-architecture.md`

验收结论：
- V1 网站内容从 2026-05-07 起进入冻结口径，不再作为日更入口，不再承接 V2 新内容。
- `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/` 和 `04-Site/config/content-paths.json` 保留为 `legacy / read-only / compatibility` 层。
- V2 正式内容库建议新增在 `06-content/v2/`，先新增路径，不替换 V1 路径。
- 已规划 Raw / Pool / Structured / Front Signals / Deep Dives / Trends / HeatEvidence / HeatCards / AI Brief / Opportunity Maps / Counter Evidence / Source Registry / Legacy Index。
- 已规划 `agent-workflow/v2/schemas/`、`rules/`、`migration/`、`quality-gates/`。
- 已输出当前目录处置矩阵，覆盖 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`04-Site/`、`05-point/`、`06-content/`、`07-Opportunities/`、`08-AI news/`、`09-ai-news-radar/`、`agent-workflow/v2/`、`提示词/`、`测试期文档/`、`content-paths.json`。
- 已输出自动化影响表和兼容期策略。
- 已拆分后续任务：`V2-6A`、`V2-6B`、`V2-6C`、`V2-6D`、`V2-6E`。

范围合规：
- 未移动任何文件。
- 未删除任何文件。
- 未重命名任何目录。
- 未创建实际 `06-content/v2/` 目录骨架。
- 未修改 `04-Site/config/content-paths.json`。
- 未修改 `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`。
- 未修改 `unified-site-sync.mjs`。
- 未修改 `ai-the-point`、`ai-2`、`ai-3` 自动化任务。
- 未修改 Netlify 配置。

后续建议：
- `V2-6A`：创建 V2 内容目录骨架和 README，不移动旧内容。
- `V2-6B`：定义 V2 schemas / source registry / HeatEvidence 文件规范。
- `V2-6C`：升级 ai-2 入站到 V2 内容库，保留 V1 只读兼容。
- `V2-6D`：升级 ai-3 / sync-data / relation checks 支持 V2 数据。
- `V2-6E`：迁移或映射 V1 历史内容到 V2 legacy index。

Quality Gate：
- 执行窗口 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-092626.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-093313.md`。

## 0W. 2026-05-07 新增 V2-6 目录与内容资产架构任务

用户新增口径：
- V1 版网站内容不再更新。
- 基于 V2 规划，需要考虑 `01-WaveSight` 文件目录优化。

调度中枢已新增：
- `V2-6 / WSD-20260507-09-v2-directory-content-architecture`
- 派发单：`agent-workflow/execution/WSD-20260507-09-v2-directory-content-architecture.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md`
- 状态：`ready`
- 牵头 Agent：`workflow / data / dev`

任务目标：
- 设计 V2 文件目录与内容资产架构。
- 明确 V1 内容冻结后的 `legacy / read-only / compatibility` 目录策略。
- 规划 V2 正式内容库、算法证据库、HeatEvidence、HeatCards、AIBriefIssue、Opportunity Maps、Source Registry 等目录。
- 输出当前目录处置矩阵、自动化影响表和分阶段迁移任务。

硬边界：
- 本任务只做方案，不移动文件。
- 不修改 `04-Site/config/content-paths.json`。
- 不修改同步脚本、生产内容源、Netlify 配置或自动化任务。
- 不把 V1 frozen content 当成继续日更入口。
- V2-4 若已收口，V2-6 必须吸收其产品架构结论。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-091850.md`。

## 0V. 2026-05-07 V2-5A baseline 分类已收口，需用户确认范围

最新状态：`V2-5A / WSD-20260507-08-v1-accepted-baseline-tag-branch` 已收到 closeout。调度中枢验收结论为 `review / user-confirmation-required`，不是 accepted。

收口文件：
- `agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`

执行窗口完成：
- 已读取 V2-5 / workspace / baseline 相关文件。
- 已运行 Git 状态检查。
- 已完成当前未提交 / 未跟踪文件归属分类。
- 已识别 accepted、governance、production content candidate、generated data candidate、test-only、review / not accepted、abandoned / failed / stopped、private / external、modified site implementation、automation docs、quality gate report bulk 等类别。
- 已运行 syntax Quality Gate，通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-091301.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-091533.md`。

未完成 / 未执行：
- 未提交 commit。
- 未创建 `v1.0-baseline-20260507` tag。
- 未创建 `codex/v2-planning` branch。
- 未创建 `C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight-v2-lab` worktree。

阻塞原因：
- 当前工作树仍混有 accepted、test-only、review / not accepted、abandoned / stopped、生产内容、网站数据、外部本地目录和大量质量报告。
- 直接“全部提交”会把 P0-11、P1-4B、test-only、外部雷达目录或未确认内容混入可信 baseline。
- 必须先由用户确认提交范围。

推荐提交策略：
1. `docs: record accepted v2 planning baseline`：只纳入 V2 accepted planning、派发单、closeout、handoff、dispatch board、progress、feature_list 和治理文件。
2. `content: archive accepted daily radar and point runs`：经 Workflow / Data Agent 确认后，纳入 2026-05-05 / 2026-05-06 内容源、同步数据和对应质量报告。
3. `chore: archive test-only monitoring pipeline`：纳入 P0-12 test-only 管线和手工 runbook，但明确不得替换生产 Signals。

默认应排除：
- P0-11 未验收视觉资产和页面实现改动。
- P0-2A / P0-2B / P1-4B 成果型代码或页面实现。
- 未确认的 `09-ai-news-radar/` 外部本地目录。
- 未确认是否需要长期保留的大批临时截图 / 审计目录。

下一步需要用户决策：
- 是否先按第 1 类提交 accepted V2 planning 与治理文件。
- 生产内容与同步数据是否纳入 baseline。
- P0-12 test-only 管线是否作为 V2 planning 记录提交。
- 是否确认排除 `09-ai-news-radar/`、P0-11、P1-4B 等未验收成果。

## 0U. 2026-05-07 V1 未完成任务统一放弃

用户明确：`V1阶段的任务全部放弃`。

调度中枢解释与执行口径：
- 已 accepted 的 V1 历史成果不删除、不回滚，保留为历史记录和可参考资产。
- 已 failed / void / stopped 的 V1 任务维持原失败、作废或停止结论。
- 所有 V1 未完成、待派发、review、spec_done_dev_pending 的任务统一标记为 `abandoned / superseded-by-v2`，不再继续派发。
- `P0-11` 不再补 SYS-7 证据，不得转 accepted；后续首页由 V2 首页重构承接。
- `P1-4A` 的规范文档可作为参考，但 V1 Dev / QA 落地放弃；后续栏目、详情、长文阅读规范按 V2 架构重做。

已放弃的 V1 未完成任务：
- `P0-4 / WSD-20260504-11-launch-readiness-plan`
- `P0-5 / WSD-20260504-02-ui-screenshot-matrix`
- `P0-6 / WSD-20260504-03-admin-boundary-qa`
- `P0-11 / WSD-20260504-26-homepage-desk-visual-asset`
- `P1-1 / WSD-20260504-10-mobile-design-system`
- `P1-2 / WSD-20260504-12-ai-assistant-product-plan`
- `P1-3 / WSD-20260504-01-copy-audit`
- `P1-4A / WSD-20260505-01-column-detail-reading-system`
- `P1-4D / WSD-20260505-05-page-evidence-design-audit`
- `P1-5 / WSD-20260504-05-automation-first-run-log-review`

当前主线：
- `V2-4` 已在执行，负责 V2 产品架构、首页重构、栏目去留、AI内参和热力图产品位置。
- `V2-5A` 可并行执行，负责 accepted 文件整理、可信 baseline、branch 和可选 worktree。

范围说明：
- 本决策只更新调度状态和交接账本。
- 未删除文件。
- 未回滚代码。
- 未修改 `04-Site/`。
- 未修改生产内容源、同步脚本、Netlify 配置或自动化任务。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-091200.md`。

## 0T. 2026-05-07 V2-5 技术工作区与迁移方案已验收

最新状态：`V2-5 / WSD-20260507-06-v2-dev-workspace-baseline` 已由调度中枢验收为 `accepted / migration-plan`。

收口文件：
- `agent-workflow/reports/WSD-20260507-06-v2-dev-workspace-baseline-closeout.md`

主产物：
- `agent-workflow/v2/v2-dev-workspace-baseline.md`

验收结论：
- 已完成 Git / remote / branch / tag / worktree / Netlify publish 事实检查。
- 当前 `HEAD` 为 `925f2e9ccbd6cb2a63b5790d594f89e4efb01d9c`，与 `origin/main` 一致。
- 当前工作树存在大量 modified / untracked 文件，因此本轮未创建 tag、branch 或外部 worktree。
- 调度中枢接受执行窗口判断：此时直接创建 `v1.0-baseline` tag 会把旧提交误当当前完整基线，不可信。
- 推荐 tag：`v1.0-baseline-20260507`。
- 推荐 branch：`codex/v2-planning`。
- 推荐 worktree 路径：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight-v2-lab`，需用户确认后才能创建。
- 已覆盖 V2 VI 到 tokens、品牌资产目录、icon set、layout primitives 的迁移策略。
- 已覆盖部署隔离、自动化影响边界、V2 Verification Agent 验收段和回滚策略。

新增后续任务：
- `V2-5A / WSD-20260507-08-v1-accepted-baseline-tag-branch`
- 状态：`ready`
- 目标：整理当前未提交文件归属，提交 accepted / V2 planning 文件，经用户确认后创建可信 V1 baseline tag、V2 branch 和可选 worktree。
- 禁止：不得使用破坏性回滚，不得把 failed / abandoned / stopped / review 任务结果作为 accepted baseline。

范围合规：
- 未修改 `04-Site/`。
- 未修改内容源 Markdown。
- 未修改同步脚本、关系检查脚本、统一同步闸门。
- 未修改 `ai-the-point`、`ai-2`、`ai-3` 自动化任务。

Quality Gate：
- 执行窗口 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-084440.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-085359.md`。

## 0S. 2026-05-07 V2-4A AI商业内参与热力图产品门禁已验收

最新状态：`V2-4A / WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan` 已由调度中枢验收为 `accepted / product-gate`。

收口文件：
- `agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md`

主产物：
- `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`

产品门禁结论：
- PM 新增功能门禁：通过。
- WAVE 评分：`10/12`，通过。
- 模块决策表：已完成。
- `AI商业内参`：进入 V2 增值产品层，作为会员 / 增值产品入口。
- `AI商业热力图`：作为 AI商业内参核心模块与数据资产，不做普通公开榜单。
- MVP：周度 AI商业热力周报、Top 高热三元组和证据来源展开。
- 月度完整版：后置到 V2-2 算法与 7 日测试稳定后推进。

范围合规：
- 未修改 `04-Site/`。
- 未新增正式前台栏目代码。
- 未修改生产内容源 frontmatter、同步脚本或长期自动化任务。

后续必须吸收：
- `V2-4`：V2 产品架构 PRD 必须吸收本结论，把 AI内参作为增值产品层，把热力图作为内参核心模块；不建议直接挤入普通公开一级栏目。
- `V2-5`：技术方案必须预留 HeatEvidence / HeatCard / AIBriefIssue 数据落地、兼容、备份和回滚策略。

Quality Gate：
- syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-084519.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-084928.md`。

## 0R. 2026-05-07 V2-2 算法与内容源架构已验收

最新状态：`V2-2 / WSD-20260507-03-v2-algorithm-source-architecture` 已由调度中枢验收为 `accepted / architecture`。

收口文件：
- `agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md`

主产物：
- `agent-workflow/v2/v2-algorithm-source-architecture.md`

验收结论：
- 阶段 2 遵守阶段 1 确认口径，只产出架构文档和 closeout。
- 未修改 `04-Site`、生产内容源 frontmatter、`sync-data.mjs`、`unified-site-sync.mjs`、`ai-the-point`、`ai-2`、`ai-3`。
- 已明确 V2-2 服务正式 V2.0 升级，不是测试项目。
- 已覆盖来源分层、监测漏斗、去重、二次搜索、反证、可信度评分。
- 已覆盖四栏目到 `HeatEvidence` 的转换规则和 schema 草案。
- 已覆盖行业 / 岗位 / 流程 / 三元组热力计算规则。
- 已覆盖 weekly / monthly `AIBriefIssue`，MVP 先 weekly。
- 已覆盖 7 日验证计划，第 7 天模拟 1 期 weekly AI内参样张。

后续必须吸收：
- `V2-4A`：做 AI内参 + 热力图产品门禁时必须读取本架构。
- `V2-4`：做 V2 产品架构 PRD 时必须吸收本架构。
- `V2-5`：做技术工作区与迁移方案时必须读取本架构中的 Dev 文件路径建议和生产迁移分层。

注意：
- 7 日隔离验证任务尚未派发。
- 本轮未替换生产自动化；未来迁入生产需单独派发 `ai-2` / `ai-3` 升级任务。
- syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-083845.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-084311.md`。

## 0Q. 2026-05-07 V2-3 VI / Design Direction 已验收

最新状态：`V2-3 / WSD-20260507-04-v2-vi-design-direction` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260507-04-v2-vi-design-direction-closeout.md`

主产物：
- `agent-workflow/v2/v2-vi-design-direction.md`

核心结论：
- V2.0 正式采用用户提供的 `方案 A：极简澜线型`。
- 后续官网、页面、新增栏目、组件、符号、元素和动效，都必须按本 VI 规范执行。
- Logo 主方向、澜线、地平线、商业内参符号、信息元素和动效母题不得被后续执行窗口随意更改、重画或替换。
- 本任务为 VI / Design Direction 文档任务，不是页面实现任务，因此浏览器截图 / SYS-7 页面截图质检不适用。
- 未修改 `04-Site/`、生产内容源、同步脚本或自动化任务。

必须交接给后续任务：
- `V2-4A` / `V2-4`：判断 AI内参和热力图产品位置时必须吸收本 VI，不得做成普通榜单、泛仪表盘或 AI 科技感页面。
- `V2-5`：必须把本 VI 转为 tokens、资产目录、Logo / icon set、layout primitives 和迁移策略。
- 后续 V2 页面 Dev：必须先读取 `agent-workflow/v2/v2-vi-design-direction.md`。

Quality Gate：
- syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-082135.md`。
- 调度中枢回填后复跑 syntax 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-083104.md`。

## 0P. 2026-05-07 V2.0 正式升级口径确认

最新状态：用户明确 V2.0 涉及大量 VI、内容、算法等更新，是要实际执行的正式升级，不是在测试环境中完成。

已更新：
- `agent-workflow/v2/v2-transition-charter.md`
- `agent-workflow/v2/v2-workspace-strategy.md`
- `agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md`

统一口径：
- V2.0 是正式产品升级项目，不是测试项目。
- 独立分支 / worktree 是正式升级开发区，用来保护 V1.0 基线、支持审计和回滚。
- 测试页、test-only 管线、隔离环境只用于降低迁移风险，不是最终交付定义。
- V2 产物最终应进入正式 V2 版本，除非 QA 或用户验收判定不通过。

正式升级路径：

```text
规划确认 -> 分支 / worktree 隔离开发 -> 证据化 QA -> 用户验收 -> 合并 / 部署 / 生产替换
```

调度注意：
- 不要把 V2 任务说成“只在测试环境完成”。
- 不要因为使用 worktree 或 test-only 管线就降低正式交付要求。
- 用户验收前，不直接覆盖 V1.0 稳定版本。
- 影响生产自动化、内容源字段、同步脚本或前台导航的任务，必须单独派发并通过对应硬闸门。

## 0O. 2026-05-07 V2 VI 资产锁定规则

最新状态：用户确认以后官网、页面、可能新增的栏目、元素、符号和动效，都必须按照已提供的 V2 VI 规范执行；已给的 Logo 和元素不得随意更改。

核心规范：
- `agent-workflow/v2/v2-vi-design-direction.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/governance/agent-memory.md`

锁定方向：
- Logo 主方向：`方案 A：极简澜线型`。
- Logo 结构：一条远方地平线 + 三道流动澜线 + `观澜 AI` + `WAVESIGHT AI`。
- 核心图形语言：澜线、地平线、细分割线。
- 商业内参符号系统、信息元素、版式原则和动效规范。

硬规则：
- 后续官网、页面、新增栏目、组件、图标、内参页、热力图、报告、PPT、社交封面和动效都必须优先读取并遵守 V2 VI。
- 执行窗口不得自行改变澜线数量、去掉金色地平线、添加信号点、雷达圈、眼睛、机器人、箭头、蓝紫科技渐变或新的品牌母题。
- 如确需调整已锁定资产，必须先由 PM / UI / Verification 评审，并判断是否需要用户确认。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 0N. 2026-05-07 V2-1 新长期 Agent 体系分配

最新状态：用户要求阅读 `Building multi-agent systems: When and how to use them` 并据此为 V2.0 分配新的长期 Agent。调度中枢已完成并标记 `V2-1 / WSD-20260507-02-v2-agent-system-design` 为 `accepted`。

核心文件：
- `agent-workflow/v2/v2-agent-system.md`
- `agent-workflow/reports/WSD-20260507-02-v2-agent-system-design-closeout.md`

文章原则已吸收：
- 多 Agent 只有在上下文隔离、并行探索、专业化工具 / 领域成立时才值得使用。
- V2 Agent 不按“规划 / 设计 / 开发 / 测试”机械拆分，而按来源、证据、算法、内参、VI、平台迁移、验证等上下文边界拆分。
- 多 Agent 带来协调成本，所以只新增必要长期岗位。
- Verification Agent 作为独立黑盒验收角色。

V2 新长期 Agent：
- `V2 Strategy & Product Architecture Agent`
- `V2 Source Intelligence Agent`
- `V2 Signal Evidence Agent`
- `V2 Point / Builder Insight Agent`
- `V2 Heatmap Algorithm Agent`
- `V2 AI Brief Editorial Agent`
- `V2 VI / Design System Agent`
- `V2 Platform / Dev Migration Agent`
- `V2 Verification Agent`

后续任务分配：
- `V2-2`：`V2 Source Intelligence Agent` + `V2 Heatmap Algorithm Agent`
- `V2-3`：`V2 VI / Design System Agent`
- `V2-4A` / `V2-4`：`V2 Strategy & Product Architecture Agent`
- `V2-5`：`V2 Platform / Dev Migration Agent`
- 所有关键 V2 任务必须有 `V2 Verification Agent` 独立验收段。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-075456.md`。

## 0M. 2026-05-07 V2-4A AI商业内参与热力图规划入库

最新状态：用户提供的 `guanlan_ai_brief_heatmap_premium_plan.md` 已入库，并派发为 V2 专题任务。

入库文件：
- `agent-workflow/v2/references/guanlan-ai-brief-heatmap-premium-plan.md`
- `agent-workflow/v2/briefs/v2-ai-brief-heatmap-premium-brief.md`

新增任务：
- 看板编号：`V2-4A`
- Task ID：`WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan`
- 状态：`ready`
- 派发单：`agent-workflow/execution/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan.md`
- closeout：`agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md`

任务定位：
- 将“观澜AI商业内参 + AI商业热力图”规划转为 V2 增值产品方案。
- 这是产品功能类任务，必须完成 PM 门禁、WAVE 评分和模块决策表。
- 不进入 Dev，不修改 `04-Site`，不替换生产自动化。

编号说明：
- 原路线图中已有 `V2-6` 用于“监测算法 7 日测试”，本任务采用 `V2-4A`，作为 `V2-4 产品架构与 PRD` 的前置专题。

对后续任务影响：
- `V2-2` 必须回应 HeatEvidence、热力评分、行业 / 岗位 / 流程 / 三元组和 AIBriefIssue。
- `V2-4` 必须判断 `AI内参` 和 `AI商业热力图` 是否进入 V2 产品架构，以及是公开栏目、会员产品页、内参详情模块还是后台生成资产。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-074931.md`。

## 0L. 2026-05-07 SYS-9 V2.0 转场准备

最新状态：V1.0 已完成，调度中枢已建立 V2.0 前置规划体系。`SYS-9 / WSD-20260507-01-v2-transition-planning` 已标记为 `accepted`。

核心结论：
- V2.0 仍归属当前 `01-WaveSight` 项目体系，不另起孤立项目。
- 当前阶段只新增 `agent-workflow/v2/` 规划目录和 V2 任务派发单。
- 后续代码开发阶段建议由 `V2-5` 决定是否创建独立分支或 worktree，例如 `01-WaveSight-v2-lab`。
- 本轮未修改 `04-Site`、生产内容源、同步脚本或三个长期自动化任务。

V2 规划目录：
- `agent-workflow/v2/README.md`
- `agent-workflow/v2/v1-baseline-freeze.md`
- `agent-workflow/v2/v2-transition-charter.md`
- `agent-workflow/v2/v2-preflight-roadmap.md`
- `agent-workflow/v2/v2-workspace-strategy.md`
- `agent-workflow/v2/briefs/`

新看板任务：
- `SYS-9 / WSD-20260507-01-v2-transition-planning`：`accepted`
- `V2-1 / WSD-20260507-02-v2-agent-system-design`：`ready`
- `V2-2 / WSD-20260507-03-v2-algorithm-source-architecture`：`ready`
- `V2-3 / WSD-20260507-04-v2-vi-design-direction`：`ready`
- `V2-4 / WSD-20260507-05-v2-product-architecture-prd`：`ready`
- `V2-5 / WSD-20260507-06-v2-dev-workspace-baseline`：`ready`

建议下一批：
1. `执行：V2-1`
2. `执行：V2-2`
3. `执行：V2-3`
4. `执行：V2-4`
5. `执行：V2-5`

注意：
- V2-1 / V2-2 / V2-3 可以并行开独立窗口。
- V2-4 最好吸收 V2-1 / V2-2 / V2-3 的 closeout 后再定稿。
- V2-5 负责真实 Git tag / branch / worktree 策略，不在 SYS-9 中直接创建。

验证：
- `feature_list.json` JSON 解析通过。
- syntax Quality Gate 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-074241.md`。

## 0K. 2026-05-06 SYS-8 调度流效率升级

最新状态：`SYS-8 / WSD-20260506-01-dispatch-flow-efficiency-upgrade` 已在调度中枢完成并标记 `accepted`。

核心变化：
- 调度机制改为“文件驱动短口令”：长规则沉淀在派发单、治理文件和模板里，聊天窗口只传 Task ID 与路径。
- 后续执行窗口启动提示词默认使用短版：

```text
执行任务：<TASK-ID>
请读取 AGENTS.md 和 agent-workflow/execution/<TASK-ID>.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/<TASK-ID>-closeout.md。
回调度窗口：收口：<TASK-ID>
```

新收口规则：
- 用户可输入 `收口：<TASK-ID>`。
- 调度窗口默认寻找 `agent-workflow/reports/<TASK-ID>-closeout.md`。
- 如 closeout 不在默认路径，仍可输入完整路径。

模板变化：
- `agent-workflow/execution/TASK-window-dispatch-template.md` 新增“快速执行卡”。
- `agent-workflow/reports/TASK-window-closeout-template.md` 新增正文前 40 行内“调度摘要”。
- `agent-workflow/governance/window-dispatch-hub.md` 已写入短派发、短收口和调度摘要规则。

硬闸门未降低：
- 页面类任务仍必须有 UI/UE 页面规范表、Copy 文案规范表、Dev 按表实现、QA 桌面 / 移动截图、Design Director 证据化审美质检。
- 产品功能类任务仍必须过 PM 新增功能门禁、WAVE 评分和模块决策表。
- 自动化影响仍必须说明 `ai-the-point`、`ai-2`、`ai-3`。

## 0J. 2026-05-06 P0-11 首页主视觉收口需补 SYS-7 证据

最新状态：`P0-11 / WSD-20260504-26-homepage-desk-visual-asset` 收口已收到，但调度中枢未标记 accepted，当前状态为 `review / evidence-required`。

收口文件：
- `agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`

已确认：
- 未恢复三图轮播。
- 未沿用旧雷达图、四 poster 卡或 `P0-2B` failed 方案。
- 产出首页主视觉资产 `04-Site/assets/home-ai-trends-business-future.png`。
- closeout 提供桌面、宽屏、移动 smoke、导航 / 分割线和图片融合截图。
- syntax Quality Gate 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-163510.md`。
- 未影响 `ai-the-point`、`ai-2`、`ai-3`。

未 accepted 原因：
- SYS-7 已生效，首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产通过线为 `85`。
- closeout 只写了总分约 `89/100`，缺少完整证据化 Design Director 质检表。
- 必须补齐五项评分、逐项扣分原因、Squint Test 说明、必须重做清单、可延后优化清单和 Dev 实现偏差清单。

接手动作：
- 不要把 P0-11 当成 accepted。
- 让执行窗口在原 closeout 追加 SYS-7 证据化审美质检小节后重新收口。

## 0I. 2026-05-06 日常监测算法 v2 测试管线验收

最新状态：`P0-12 / WSD-20260505-02-daily-monitoring-v2-test-pipeline` 已由调度中枢验收为 `accepted / test-only`。

收口文件：
- `agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md`

主报告：
- `agent-workflow/reports/daily-monitoring-v2-test-pipeline-2026-05-05.md`

核心产物：
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `06-content/`
- `04-Site/signal-lab.html`
- `04-Site/data/signal-lab-data.json`
- `04-Site/data/signal-lab-data.js`
- `04-Site/scripts/sync-signal-lab.mjs`
- `提示词/日常监测算法V2测试.md`
- `提示词/Signal精选与机会深挖V2.md`
- `agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-manual-runbook.md`

验收结论：
- v2 测试漏斗已建立：Raw 36 条、Pool 12 条、Structured 8 条、Front Signal 3 条、Deep Dive 1 条、Trend 5 条。
- PM 门禁 / WAVE 已完成，决策为原型验证 / 测试管线。
- 新能力只进入 `06-content/` 与 `signal-lab.html`，成熟前不得替换正式 `Signals` 栏目。
- 未修改 `sync-data.mjs`、`unified-site-sync.mjs`，测试内容未进入生产统一同步闸门。
- `ai-2` 有影响，但仅作为测试提示词、手工 runbook 和 coordination 文档说明；生产自动化本体未替换。

接手注意：
- 这是测试管线 accepted，不是生产链路 accepted。
- `06-content/01-raw/originals/` 目前只建立归档规则和 README，2026-05-05 样例若继续复用，必须先补齐 36 条 Raw 本地原文。
- 正式迁入 `01-Signals/`、`02-Scoring/`、`03-Trends/` 或 `07-Opportunities/` 前，必须另行派发生产入站、关系检查、权限和 QA 任务。
- 成熟条件仍为连续 7 天稳定运行，3 条精选 Signal 质量优于现有 Signals。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：测试口径有影响，不替换生产日更。
- `ai-3`：不影响。

## 0H. 2026-05-05 P1-4C 已恢复 P1-4B 前网页基线

用户要求本窗口直接执行 `P1-4C / WSD-20260505-04-p1-4b-stop-restore-baseline`。本轮已完成并由调度中枢标记为 `accepted`。

23:28 补充：用户截图指出 Opportunity 列表、Opportunity Detail 和 Trends 仍未真正恢复，存在大面积横向行、巨型标题和空白节奏。调度中枢已追加删除 `Detail page standard`、`Design Director QA v3` 中覆盖 Opportunities / Trends / Opportunity Detail 的残留规则，以及 `Opportunities index fix` 整块。

收口文件：
- `agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`

关键结果：
- `P1-4B / WSD-20260505-03-non-home-column-detail-reading-implementation` 保持 `stopped / not accepted`，不得继续执行。
- 已备份 P1-4B 涉及文件到 `agent-workflow/backups/p1-4b-restore-20260505/`。
- 已删除 `04-Site/css/styles.css` 中明确标注为 `P1-4B correction: restrained commercial briefing rhythm` 的样式块。
- 已恢复 `daily.html`、`signals.html`、`opportunities.html`、`trends.html` 的 P1-4B 标题改动。
- 已恢复 `signals.html` 中 P1-4B 移除的隐藏 `newSignalBtn` 与 `editorDialog`，以回到任务前网页基线。
- 已恢复 `04-Site/js/app.js` 中可明确识别为 P1-4B 的公开文案替换。
- 未触碰 `04-Site/index.html`、内容源 Markdown、`04-Site/data/`、同步脚本、关系检查脚本、统一同步闸门或自动化任务。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-151838.md`。
- 追加回退后，`node agent-workflow/tools/run-quality-gates.mjs syntax` 再次通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-152805.md`。
- 针对 P1-4C 涉及文件的 `git diff --check` 通过。
- 浏览器截图未完成：Codex Node 环境缺少 Playwright，本机未发现可命令行调用的 Chrome / Edge / Chromium。后续 `P1-4D` 必须补齐桌面 / 移动截图。

下一步：
- `P1-4D / WSD-20260505-05-page-evidence-design-audit` 已从 `blocked` 改为 `ready`。
- 后续执行 `执行：P1-4D`，由 Design Director 按 SYS-7 逐页截图评分、写扣分原因、必须重做清单、Dev 偏差清单和下一轮修改建议。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 0G. 2026-05-05 P1-4B 停止，先恢复基线再重新审美评分

用户最新调度指令：停止 `P1-4B`，网页恢复到任务前状态，然后让 Design Director 根据新的 SYS-7 证据化审美规范，重新给每个页面评分，提出修改和优化意见后，再执行。

调度中枢已据此调整：

- `P1-4B / WSD-20260505-03-non-home-column-detail-reading-implementation` 状态改为 `stopped / not accepted`。
- P1-4B 不得继续执行，不得作为 accepted 页面成果。
- 新增 `P1-4C / WSD-20260505-04-p1-4b-stop-restore-baseline`，状态 `ready`。
- 新增 `P1-4D / WSD-20260505-05-page-evidence-design-audit`，状态 `blocked`，必须等 P1-4C accepted 后执行。

P1-4C：
- 派发单：`agent-workflow/execution/WSD-20260505-04-p1-4b-stop-restore-baseline.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260505-04-p1-4b-stop-restore-baseline-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`
- 目标：只撤回 P1-4B 对网页展示层造成的明确改动，不得整仓回滚，不得使用 `git reset --hard`，不得触碰首页、内容源、数据、同步脚本或自动化。

P1-4D：
- 派发单：`agent-workflow/execution/WSD-20260505-05-page-evidence-design-audit.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260505-05-page-evidence-design-audit-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260505-05-page-evidence-design-audit-closeout.md`
- 目标：按 SYS-7 证据化审美闸门逐页截图评分，输出扣分原因、必须重做清单、Dev 偏差清单和下一轮修改建议，不改 `04-Site/`。

新的执行顺序：
1. `执行：P1-4C`
2. P1-4C accepted 后，`执行：P1-4D`
3. 根据 P1-4D 审计结果重新派发 Dev。

自动化影响：默认不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 0F. 2026-05-05 Design Director 证据化审美验收闸门

最新状态：`SYS-7 / WSD-design-director-evidence-based-quality-gate` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-design-director-evidence-based-quality-gate-closeout-2026-05-05.md`

主报告：
- `agent-workflow/reports/design-director-evidence-based-quality-gate-2026-05-05.md`

已写入：
- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`
- `agent-workflow/governance/agent-memory.md`

新规则：
- Design Director 风格美观质检必须证据化，不接受只写主观分数。
- 页面已实现或已有可访问页面时，必须包含桌面截图、移动端截图、逐项扣分原因、必须重做清单和 Dev 实现偏差清单。
- 首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产通过线为 85。
- 一级栏目页 / 详情页 / 会员页通过线为 80。
- Admin 工作台和后台模块通过线为 75。
- 任一单项低于 14、Squint Test 不通过或出现审美阻塞项时，必须重做。
- 缺少截图、扣分原因、必须重做清单或 Dev 偏差清单时，质检无效，调度中枢必须退回补齐或重做。

接手注意：
- `SYS-6` 的 100 分制风格美观质检仍有效，但已由 SYS-7 升级为证据化审美验收。
- `P1-4B` 当前仍为 `review`，后续如要 accepted，需按 SYS-7 新规则补查证据化风格美观质检。
- 后续首页、全站 UI、Admin、移动端、栏目页、详情页、海报 / 首屏视觉任务均必须套用该硬闸门。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 0E. 2026-05-05 Design Director 风格美观质检硬闸门

最新状态：`SYS-6 / WSD-design-director-style-quality-training` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-design-director-style-quality-training-closeout-2026-05-05.md`

主报告：
- `agent-workflow/reports/design-director-style-quality-training-2026-05-05.md`

已写入：
- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`
- `agent-workflow/governance/agent-memory.md`

新规则：
- 页面类任务必须由 UI / UE Design Director 输出 100 分制风格美观质检表。
- 五项质检：Style Purity、Proportion & Rhythm、Color Sophistication、Craftsmanship、Emotional Resonance。
- 每次页面设计完成后必须执行 Squint Test。
- 总分低于 70、任一单项低于 10、Squint Test 不通过或出现审美阻塞项时，必须重做，不得进入 Dev 或不得标记 `accepted`。
- 调度中枢不得代补评分，不得接受缺少风格美观质检表的页面类收口。

接手注意：
- `P1-4B` 当前仍为 `review`，后续如要 accepted，需按 SYS-6 新规则补查风格美观质检。
- 后续首页、全站 UI、Admin、移动端、栏目页、详情页、海报 / 首屏视觉任务均必须套用该硬闸门。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 0D. 2026-05-05 首页暂缓，非首页栏目 / 详情 / 长文阅读进入开发

用户最新调度指令：`把首页的修正去掉，之后再做，先执行其他页面/栏目/详情的优化，进入开发阶段`。

调度中枢已据此调整：

- `P0-11 / WSD-20260504-26-homepage-desk-visual-asset` 保持 ready，但标记为 `ready / postponed`，暂不派发。
- `P1-4A / WSD-20260505-01-column-detail-reading-system` 仍为规范阶段完成，Dev / QA 落地改由新任务承接。
- 新增 `P1-4B / WSD-20260505-03-non-home-column-detail-reading-implementation`，状态 `ready`。

新任务：
- 派发单：`agent-workflow/execution/WSD-20260505-03-non-home-column-detail-reading-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260505-03-non-home-column-detail-reading-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md`

执行边界：
- 只做非首页一级栏目页、详情页和长文页。
- 明确排除 `04-Site/index.html`、首页 hero、首页右侧 Intelligence Desk、首页专属文案和 `P0-11`。
- 承接 `agent-workflow/reports/column-detail-reading-system-spec-2026-05-05.md` 的 UI/UE 与 Copy 规范。
- 页面类硬闸门仍有效：Dev 按表实现，QA 必须提供桌面 / 移动截图、无横向溢出、字号 / 间距 / 模块起点和禁用语验收。

自动化影响：默认不影响 `ai-the-point`、`ai-2`、`ai-3`；如执行窗口需要改 Markdown 字段、同步脚本或自动化提示词，必须停止并回调度中枢确认。

## 0. 2026-05-04 调度中心交接指针

当前主调度窗口内容已过长，后续应切换到新窗口继续作为调度中枢。新窗口先读取：

- `agent-workflow/reports/dispatch-hub-handoff-2026-05-04.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`

该交接文件已沉淀今天的任务成功 / 失败记录、作废任务、常用派发提示词、closeout 验收提示词和接手经验教训。新窗口不要把 `P0-2B` 当成首页成功版本；`P0-10` 已 accepted，下一步可执行 `P0-11`。

补充治理：`SYS-5` / `WSD-pm-module-governance` 已 accepted。后续任何产品功能类任务必须先由 PM Agent 输出新增功能门禁记录、WAVE 评分和模块决策表；未通过门禁的功能不得直接进入 Dev。

## 0A. 2026-05-04 网站模块与设计规范联合梳理

最新状态：`P0-10A / WSD-20260504-27-site-module-design-review` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`

主报告：
- `agent-workflow/reports/site-module-design-review-2026-05-04.md`

关键结论：
- 当前前台主线 `首页 / Daily Brief / Signals / The Point / Opportunities / Trends` 继续成立。
- 当前不建议新增模块；优先修全站高级感、模块主次、页面母版和前后台边界。
- 首页旧雷达图、四张 poster 卡和泛营销利益表达不符合“高端商业情报产品”调性，应在 P0-10 / P0-11 中处理。
- `scoring.html` 和 `tags.html` 虽不在主导航，但仍可直接访问；建议分别后台化 / 合并进 Opportunities 与栏目筛选能力。
- `Signals` 应从后台仪表盘感收敛为商业信号检索台。
- `Opportunities` 右侧 `机会排行` 应弱化榜单感，改向 `优先观察` / `验证序列`。
- `styles.css` 已有多轮样式堆叠，P0-10 必须先输出 DESIGN v2、页面母版和组件边界，再进入 Dev。

后续任务：
- `P0-10 / WSD-20260504-25-site-ui-design-direction` 已 accepted。
- `P0-11 / WSD-20260504-26-homepage-desk-visual-asset` 可执行，必须读取 P0-10A 报告与 P0-10 DESIGN v2。
- `P0-6` 必须覆盖 `signals.html` 隐藏编辑弹窗、`scoring.html`、`tags.html`、`apply.html` 访问边界。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 0B. 2026-05-04 网站 UI 方向与 DESIGN v2 验收

最新状态：`P0-10 / WSD-20260504-25-site-ui-design-direction` 已在当前调度窗口直接执行并验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md`

主报告：
- `agent-workflow/reports/site-ui-design-direction-2026-05-04.md`

关键结论：
- `agent-workflow/product/DESIGN.md` 已新增 `DESIGN v2 草案：商业情报桌面`。
- 全站 Art Direction 收敛为高端商业内参、研究桌面、判断样张、克制会员产品。
- 首页后续不沿用旧雷达图、四张 poster 卡或 P0-2B failed 结果。
- P0-11 应聚焦首页右侧 `Intelligence Desk` 判断样张，包含 Brief 摘要、2 条 Signal、1 条 Opportunity 和 1 个 Trend 状态。
- 后续 Dev 不应继续用追加 `final / override / lock / polish` 样式层解决高级感问题，应按 tokens、layouts、components 和 page-specific 边界实现。

验证：
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-155700.md`。

下一步：
- 可执行 `P0-11 / WSD-20260504-26-homepage-desk-visual-asset`。
- P0-6 继续处理前后台边界。
- P0-5 后续按 DESIGN v2 做桌面高级感截图矩阵。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 0C. 2026-05-04 GitHub 与 Netlify 更新验收

最新状态：`P0-4B / WSD-20260504-28-github-netlify-sync` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md`

主报告：
- `agent-workflow/reports/github-netlify-sync-2026-05-04.md`

复核结果：
- GitHub remote：`https://github.com/jerryfang2023-stack/AI-Radar.git`
- 当前本地 `HEAD` 与 `origin/main`：`925f2e9ccbd6cb2a63b5790d594f89e4efb01d9c`
- Netlify 默认站点：`https://wavesight-ai-preview.netlify.app`
- Netlify 不可变部署链接：`https://69f8beccecce0b0009888a05--wavesight-ai-preview.netlify.app`
- 远端首页、Daily、Signals、The Point、Opportunities、Trends、CSS、JS、`data/radar-data.js` 均返回 200。
- 远端数据包含 `judgmentNodes` 与 `priorityEngine`，`judgmentNodeCount=22`，`generatedAt=2026-05-04T15:21:59.991Z`。

边界：
- 本次是 GitHub 版本同步与 Netlify Preview 更新，不是正式 production launch。
- 未配置正式域名，未接入真实数据库、真实支付、真实邮件或生产账号系统。
- `P0-2A` void / abandoned 与 `P0-2B` failed / not accepted 没有作为成功页面成果部署。
- 当前工作树已有 P0-10 accepted 后新增的 DESIGN v2、报告、看板与进度回填，不属于本次已部署远端版本；后续如需同步，需要另行执行 GitHub / Netlify 更新。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 1. 当前项目状态

观澜AI｜WaveSight AI 当前定位为面向商业决策者的 AI 机会判断系统，不是 AI 新闻站、工具站或内部资料库。核心产品逻辑是：从每日 AI 热点中筛出商业信号，再通过评分、趋势和机会卡形成可追踪的判断依据。

当前前台方向已经收敛为：

- 首页
- Daily Brief
- Signals
- The Point
- Opportunities
- Trends

Scoring 已被定义为后台 Priority Engine，不再作为普通用户的一线栏目。Tags 暂不作为一线栏目，后续应作为搜索、筛选和关系网络能力。

截至 2026-05-03 最近一次同步结果：

- Signals：29
- Priority Rows / Scoring：33
- Trends：13
- The Point Points：24
- The Point Sources：2
- Opportunities：27
- 关系检查硬错误：0
- 关系检查软提醒：23

2026-05-03 当天商业雷达已补跑完成，并修复了“机会拆解（6点｜必须详细拆解）”缺失问题。当天 7 条 Signal 均已在原始 MD 和网站数据中解析出 6 个机会拆解模块。

2026-05-03 本轮重点推进 The Point 模块：已接入一级导航，完成栏目页、每日集合页、人物详情页、素材阅读页、首页 Decision Brief、Daily Brief 和 Signals 卡片中的观点引用；已新增 `05-Point/` 与 `05-Point/sources/` 内容层，并完成 2026-05-03 当日 24 条观点、2 个素材来源的同步。

本轮最后状态：

- `follow-builders` skill 已确认可提供 X 原文、YouTube transcript、Blog content。
- `05-Point/2026-05-03-The-Point.md` 已写入当日 Point 数据。
- `05-Point/sources/2026-05-03/` 已新增 YouTube 和 Claude Blog 素材笔记。
- `04-Site/scripts/sync-data.mjs` 已支持 `points`、`pointTopics`、`pointSources`。
- `04-Site/point-source.html` 已支持站内素材阅读页，并优先展示 `全文文档` / `全文译文`。
- The Point 展示层已统一清理 YouTube speaker/timecode 标记和 X `t.co` 短链，避免来源信息混入观点正文。
- 最后验证：`node --check 04-Site/js/app.js`、`node --check 04-Site/scripts/sync-data.mjs`、`node 04-Site/scripts/sync-data.mjs`、`node 04-Site/scripts/check-relations.mjs` 均已运行，关系检查硬错误为 0。

## 2. 长期 Agent 工作原则

本项目使用长期 agent 工作规范。长期 agent 不是一次性对话线程，而是可版本管理、可恢复、可复制的岗位说明书与工作流。

长期 agent 的事实来源：

- `agent-workflow/agents/*.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/prd/active/*.md`
- `agent-workflow/execution/*.md`
- `agent-workflow/execution/PLAN-template.md`
- `agent-workflow/progress.md`
- `agent-workflow/reports/*.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/governance/plan-first-policy.md`
- `agent-workflow/governance/quality-gates.md`
- `agent-workflow/governance/automation-fallback-policy.md`
- `agent-workflow/governance/agent-handoff-template.md`
- `agent-workflow/governance/intelligence-model-calibration.md`

硬规则：

- 不要为 PM、UI、文案、开发、数据、验收等已有角色重复创建临时 agent。
- 分配任务时，优先写入 `execution/`、`feature_list.json`、`prd/active/` 或对应 agent 岗位文件。
- 如确需临时 agent，必须先说明原因、写入范围和回填方式，并得到用户明确批准。
- 重大任务先按 Plan-first 输出计划，再进入 Data/UI/Copy/Dev/QA。
- 每次完成必须说明通过了哪些 Quality Gates；未运行检查要写清原因。
- 可复用经验写入 Agent Memory；自动化失败按 fallback policy 记录降级路径。
- Quality Gates 统一脚本入口为 `agent-workflow/tools/run-quality-gates.mjs`。

## 3. PM Agent 分工

PM Agent 是产品总控，负责把 Strategy Agent 的方向转成栏目规划、PRD、路线图和开发任务。PM 不直接写 UI、不写最终文案、不实现代码。

PM 当前负责的核心分工：

| 任务 | 对应 PRD | 负责分配 |
|---|---|---|
| Daily Brief 产品化 | `PRD-001-daily-brief.md` | Data 定字段，Copy 定语气，UI 定阅读结构，Dev 实现，QA 验收 |
| Signals 商业信号系统 | `PRD-002-signals-system.md` | Data 定字段/算法/去重，Copy 定标题摘要，UI 定卡片结构，Dev 实现同步和展示 |
| Opportunities 与 Priority Engine 合并 | `PRD-003-opportunities-engine.md` | Data 定评分关系，UI 定机会卡结构，Copy 定机会标题，Dev 迁移旧 scoring 展示 |
| Trends 趋势判断模型 | `PRD-004-trends-model.md` | Data 定趋势字段，UI 定详情页，Copy 定趋势表达，Dev 实现趋势详情 |
| 会员访问与 Admin 权限边界 | `PRD-005-membership-access.md` | UI 定前后台边界，Dev 实现权限，QA 验普通前台无后台入口 |
| 首页布局与排版优化 | `PRD-006-homepage-layout.md` | UI 输出结构，Copy 输出主文案，Data 定精选来源，Dev 落地 |

PM 下一步应继续维护：

- `agent-workflow/execution/pm-next-sprint-2026-05-02.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/governance/column-decision-log.md`
- `agent-workflow/prd/active/*.md`

## 4. 各 Agent 已完成 / 未完成事项

### Strategy Agent

已完成：

- 明确产品定位：面向商业决策者的 AI 机会判断系统。
- 明确品牌名：观澜AI｜WaveSight AI。
- 明确定位语：观AI之澜，识商业之势。
- 明确前台导航收敛方向：首页 / Daily Brief / Signals / Opportunities / Trends。
- 已新增 The Point 为前台一级栏目，位于 Signals 之后，用于承接一线 AI 创造者观点。
- 明确 Scoring 后台化为 Priority Engine。
- 明确普通用户路径：注册、登录、7 天试读、订阅。

未完成：

- 内部方法论资产尚未完整沉淀为可销售、可培训、可对外解释的 Method 材料。
- 云端部署后的商业化路径、样例报告和 newsletter 转化路径还需要继续细化。

### PM Agent

已完成：

- 建立 PM Agent 产品总控机制。
- 重写或新增 6 个 Active PRD。
- 形成 P0 / P1 Sprint 执行顺序。
- 将首页布局与排版优化纳入 PM 任务。
- 将 Daily Brief 中的“行动建议”降级，避免替用户承担经营或投资判断。
- 完成 The Point 长期 Agent 分派，明确 Data / Workflow / UI / Copy / Dev / QA 的职责边界。
- 确认 The Point 自动化原则：每日 08:30 先写入 Obsidian/MD，再等待商业雷达统一同步入站，避免任务冲突。

未完成：

- 需要继续把未完成 P0/P1 任务拆成更小的开发批次。
- The Point 已进入可验收状态，但每日 08:30 自动化尚未完全产品化落地。
- 需要持续维护栏目合并、隐藏、后台化的决策记录。

### UI / UE Agent

已完成：

- 建立长期设计规范：`agent-workflow/product/DESIGN.md`。
- 重写 UI/UE Agent 岗位说明。
- 多轮优化首页、Daily Brief、Signals、Opportunities、Trends 的排版。
- 完成 The Point 栏目页、每日集合页、人物详情页、素材阅读页的多轮排版修正。
- The Point 素材页已调整为长文阅读版：正文收窄、行距增大、来源与版权弱化、全文译文独立块、侧栏显示素材状态。
- 统一详情页方向：标题位置、英文 eyebrow、正文层级、卡片密度需保持一致。
- 明确每次页面调整前必须使用 `frontend-design`，必要时参考 `awesome-design-md`。

未完成：

- 所有详情页的标题、字号、留白、正文结构仍需统一验收。
- 移动端截图验收还不完整。
- The Point 页面仍需要用真实全文文档做一次长文阅读压力测试和移动端截图验收。
- Admin 页面仍需要更系统的视觉和信息架构优化。
- 云端部署前需要整理一份前台/后台完整页面地图。

### Copy Agent

已完成：

- 建立长期文案规范：`agent-workflow/product/COPY.md`。
- 重写 Copy Agent 岗位说明。
- 明确文案原则：言之有物、简洁克制、精炼有力、不讲废话。
- 明确不能把内部流程语言写给外部用户。
- 明确不替客户下最终经营、投资或合作判断。
- 修正首页、Daily Brief、Signals、Opportunities、Trends 多处空泛文案。
- The Point 文案已按“人 + 原话 + 简洁解读”方向收敛，首页与 Daily Brief 中旧版“建造者”称谓已替换为“一线观点”。
- The Point 标题和栏目价值表达已避免与 Signals、Trends 重复。

未完成：

- 会员页、订阅页、登录注册页仍需要统一商业文案。
- The Point 后续接入更多真实全文后，需要继续检查中英文翻译是否逐句对应，不能把摘要或判断写成译文。
- Daily Brief 若未来作为 newsletter，需要进一步形成可发送版本的标题和结构规范。
- 首页最终版文案仍需结合新版视觉再收敛一次。

### Data Agent

已完成：

- 2026-05-03 已升级为 Intelligence Data Agent，保留 `data-agent` id，不新增临时 agent。
- 新岗位已从字段、标签和质量报告维护者升级为判断资产建模负责人，覆盖 Signal / Trend / Opportunity / The Point / Relation / Quality Intelligence。
- 已新增 `source-intelligence.md`，建立来源、关键词和 Builder 池治理模型。
- 已新增 `tag-taxonomy.md`，将 Tags 从随手标注升级为可搜索、可筛选、可关系网络化的判断资产。
- 已完成 5 张无 Priority 评分证据 Opportunity 的评审，不为清零软提醒硬绑评分。
- 梳理 Signals、Scoring、Trends、Opportunities 的字段和关系。
- 将 07-Opportunities 扁平化到 `07-Opportunities/`。
- 补充 frontmatter、slug、opportunity_id、去重和公司名清理规则。
- 建立 Signal-Priority-Trend-Opportunity 关系检查。
- 支持 2026-05-03 新增内容进入 Signals、Scoring、Trends、Opportunities。
- 支持 The Point 数据模型：`points`、`pointTopics`、`pointSources`。
- 已为 Point 支持 `素材笔记` 字段，并解析 `全文文档`、`全文译文`、`来源与版权`。
- 已统一清理 Point 原文展示中的 YouTube speaker/timecode 标记与 X `t.co` 短链。
- 关系检查当前硬错误为 0。

未完成：

- 2026-05-04 自动化首跑后，需要检查是否仍出现只写 `AI创业机会` 的泛标签。
- 后续可新增 `check-tags.mjs`，把未知标签、泛标签和别名归并纳入脚本检查。
- 部分 Priority -> Signal 缺少 relatedSignalId。
- 部分 Signal 尚未进入 Trend。
- 部分 Trend 缺少 relatedSignalIds。
- 部分早期 Opportunity 没有评分证据。
- 需要继续补齐 schema-check、dedupe-check、content-quality-check。
- The Point 还需要正式质量检查：同一人物多观点合并、来源去重、全文授权状态、译文完整性、Point 与 Signal/Trend/Opportunity 的弱关联质量。

### Dev Agent

已完成：

- 内容路径配置化：`04-Site/config/content-paths.json`。
- 更新同步脚本：`04-Site/scripts/sync-data.mjs`。
- 增加关系检查脚本：`04-Site/scripts/check-relations.mjs`。
- 实现 Daily 列表页和详情页。
- 实现 Trend 详情页。
- 实现 Opportunity 详情页。
- 将 Scoring / Priority Engine 合并进 Opportunities 展示逻辑。
- 新增注册、登录、账户、订阅、购买占位页面。
- 实现普通前台与 Admin 的初步权限分离。
- 修复 2026-05-03 机会拆解在原始 MD 和网站数据中的缺失。
- 完成 The Point P0 开发：`the-point.html`、`point-daily.html`、`point.html`、`point-source.html`。
- 首页 Decision Brief、Daily Brief、Signals 相关卡片均已接入 The Point。
- `sync-data.mjs` 已支持 `pointSources`，并支持站内素材全文字段。
- 新增 `agent-workflow/tools/import-point-source-fulltext.mjs`，用于把已授权或自有导出的全文写入素材 MD。

未完成：

- 真实云端登录、支付、订阅和权限系统尚未接入，目前更接近本地演示。
- Admin 的可视化编辑保存机制需要继续验证，避免刷新后丢失。
- 云端部署脚本、构建流程、备份、回滚方案尚未完成。
- The Point 每日自动抓取、写入 Obsidian、统一同步入站尚未完全自动化，只完成了今天的手动流程和数据结构。
- 当前项目目录不是 git 仓库，正式云端部署前需要补版本管理方案。

### QA / Acceptance Agent

已完成：

- 建立验收角色和验收维度。
- 已运行基础语法检查：`node --check 04-Site/scripts/sync-data.mjs`、`node --check 04-Site/js/app.js`。
- 已运行关系检查，当前硬错误为 0。
- 已验证 2026-05-03 当天 7 条 Signal 均有 6 个机会拆解模块。
- 已验证 The Point 最新同步硬错误为 0。
- 已抽查 `04-Site/data/radar-data.json`：Point 正文无 `Speaker 3 |` 与 `t.co/` 残留。

未完成：

- 需要补齐完整浏览器验收记录，包括桌面端和移动端截图。
- 需要以未登录、试读有效、试读到期、管理员四种身份验收权限边界。
- The Point 栏目页、人物详情页、素材页、首页 The Point、Daily Brief、Signals 卡片需要再做浏览器截图验收。
- 需要建立发布前 release checklist。
- 需要检查普通入口是否仍有后台控件泄漏。

### Workflow / Automation Agent

已完成：

- 建立长期 agent 调度硬规则。
- 建立 `progress.md`、`feature_list.json`、`reports/` 作为进度和交接中心。
- 更新每日观澜AI商业雷达自动化任务说明。
- 修复自动化任务中机会拆解缺失的任务说明。
- 记录 2026-05-03 商业雷达补跑和机会拆解修复报告。
- 记录 The Point 素材层、全文字段、页面优化和清理规则。

未完成：

- 自动化运行日志仍需长期规范化，尤其是失败原因、降级检索、来源可用性。
- The Point 每日 08:30 自动任务还需落地为可重复运行流程，并与商业雷达同步任务协调。
- 需要持续把执行结果回填到 `daily-run-log.md` 和 `feature_list.json`。
- 自动化任务在独立运行环境中的联网能力仍需持续观察。

## 5. 关键文件索引

### 项目与流程

- `agent-workflow/README.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/agents/agent-registry.json`
- `agent-workflow/governance/README.md`
- `agent-workflow/governance/long-term-agent-dispatch-policy.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/governance/plan-first-policy.md`
- `agent-workflow/governance/quality-gates.md`
- `agent-workflow/governance/automation-fallback-policy.md`
- `agent-workflow/governance/agent-handoff-template.md`
- `agent-workflow/governance/intelligence-model-calibration.md`
- `agent-workflow/execution/PLAN-template.md`
- `agent-workflow/execution/intelligence-data-agent-upgrade-2026-05-03.md`

### 产品与方法论

- `agent-workflow/product/strategy-single-source.md`
- `agent-workflow/product/product-strategy.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/signal-system.md`
- `agent-workflow/product/daily-brief-product.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/commercial-site-modules.md`
- `agent-workflow/product/the-point-model.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/tag-taxonomy.md`
- `agent-workflow/product/commercial-operating-model.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/product/COPY.md`

### PRD

- `agent-workflow/prd/active/PRD-001-daily-brief.md`
- `agent-workflow/prd/active/PRD-002-signals-system.md`
- `agent-workflow/prd/active/PRD-003-opportunities-engine.md`
- `agent-workflow/prd/active/PRD-004-trends-model.md`
- `agent-workflow/prd/active/PRD-005-membership-access.md`
- `agent-workflow/prd/active/PRD-006-homepage-layout.md`

### 内容源

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/AI趋势总表.md`
- `05-Point/2026-05-03-The-Point.md`
- `05-Point/sources/2026-05-03/youtube-no-priors-baseten.md`
- `05-Point/sources/2026-05-03/blog-claude-managed-agents-memory.md`
- `07-Opportunities/`
- `提示词/监测提示词V4.0.md`
- `提示词/关键词列表.md`
- `提示词/AI机会评分与趋势判断系统V4.0.md`

### 网站

- `04-Site/index.html`
- `04-Site/daily.html`
- `04-Site/daily-detail.html`
- `04-Site/signals.html`
- `04-Site/the-point.html`
- `04-Site/point-daily.html`
- `04-Site/point.html`
- `04-Site/point-source.html`
- `04-Site/trends.html`
- `04-Site/trend.html`
- `04-Site/opportunities.html`
- `04-Site/opportunity.html`
- `04-Site/admin.html`
- `04-Site/register.html`
- `04-Site/login.html`
- `04-Site/pricing.html`
- `04-Site/checkout.html`
- `04-Site/js/app.js`
- `04-Site/css/styles.css`
- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`

### 脚本

- `04-Site/scripts/sync-data.mjs`
- `04-Site/scripts/check-relations.mjs`
- `04-Site/scripts/admin-server.mjs`
- `04-Site/config/content-paths.json`
- `agent-workflow/tools/import-point-source-fulltext.mjs`
- `agent-workflow/tools/unified-site-sync.mjs`
- `agent-workflow/tools/run-quality-gates.mjs`

### 最近报告

- `agent-workflow/reports/daily-radar-rerun-2026-05-03.md`
- `agent-workflow/reports/the-point-handoff-2026-05-03.md`
- `agent-workflow/reports/the-point-copy-ui-acceptance-2026-05-03.md`
- `agent-workflow/reports/the-point-dev-p0-2026-05-03.md`
- `agent-workflow/reports/opportunity-breakdown-fix-2026-05-03.md`
- `agent-workflow/reports/relation-check-latest.md`
- `agent-workflow/reports/trends-optimization-2026-05-02.md`
- `agent-workflow/reports/opportunity-priority-link-2026-05-02.md`
- `agent-workflow/reports/membership-access-2026-05-02.md`
- `agent-workflow/reports/dev-implementation-2026-05-02.md`
- `agent-workflow/reports/the-point-quality-check-implementation-2026-05-03.md`
- `agent-workflow/reports/the-point-browser-qa-implementation-2026-05-03.md`
- `agent-workflow/reports/the-point-browser-qa-2026-05-03.md`
- `agent-workflow/reports/the-point-automation-setup-2026-05-03.md`
- `agent-workflow/reports/daily-automation-coordination-2026-05-03.md`
- `agent-workflow/reports/unified-site-sync-2026-05-03.md`
- `agent-workflow/reports/intelligence-data-relation-review-2026-05-03.md`
- `agent-workflow/reports/intelligence-data-point-rules-2026-05-03.md`

## 6. 当前风险点

### 数据与关系风险

- 关系检查硬错误为 0，软提醒已从 23 收口到 5。
- Priority -> Signal 已达到 33/33。
- Signal -> Trend 已达到 29/29。
- Trend -> Signal 已达到 13/13。
- 5 张早期机会卡缺少评分证据。
- Tags 字典尚未完成，后续如果继续新增内容，标签会继续膨胀。

### 内容质量风险

- 自动化生成的 Daily Radar 必须持续检查是否包含 6 点机会拆解。
- Signal 标题必须保持“事件 + 商业含义”，不能退回公司名。
- Opportunity 标题不能出现公司名，公司只能作为案例或证据。
- 文案不能使用内部流程语，如 Markdown、同步脚本、JSON、自动沉淀等。
- Daily Brief 不应输出行动建议，避免替客户承担经营或投资判断。
- The Point 的首页、栏目页、详情页、Daily Brief、Signals 卡片不得显示 YouTube speaker/timecode 或 X `t.co` 短链。
- The Point 的中文译文必须翻译原文，不得用观点摘要或观澜判断替代。
- Blog / YouTube 全文入库需要明确来源和授权边界；当前已支持 `全文文档` / `全文译文` 字段，但真实全文导入仍需后续确认内容来源。
- The Point 质量规则已固化到 `check-point-quality.mjs` 报告：来源去重、同人多观点、素材笔记、原文/译文完整性、短链和 timecode 清理、授权说明。

### 权限与商业化风险

- 当前会员、试读、订阅和支付更接近本地演示，还不是云端正式商业系统。
- Admin 与普通前台已经初步分离，但仍需 QA 用多身份检查。
- Admin 可视化编辑保存后刷新是否稳定，需要继续验证。
- `apply.html` 已降级为停用提示页，但旧入口或旧文案需要持续抽查。

### 技术与部署风险

- 当前目录不是 git 仓库，云端部署前需要建立版本管理、备份和回滚流程。
- 站点仍以静态文件和本地数据同步为主，云端需要重新设计数据写入、权限、用户和支付。
- The Point 每日 08:30 自动化已创建，自动化 ID 为 `ai-the-point`；只生成 Markdown，不直接同步网站。
- AI 商业雷达内容生成自动化已创建，自动化 ID 为 `ai-2`；只生成 Markdown，不直接同步网站。
- 统一网站同步闸门自动化已创建，自动化 ID 为 `ai-3`；每日 09:30 运行 `agent-workflow/tools/unified-site-sync.mjs`，只有当天 AI商业雷达、AI机会评分和 The Point 同时就绪才同步网站。
- 自动化影响检查已写入 `AGENTS.md`：后续任何影响 Markdown 结构、数据字段、同步脚本、质量检查、入站顺序或发布闸门的操作，都必须先提示可能影响自动化，并同步更新对应自动化任务。
- 2026-05-03 已更新 `ai-the-point`、`ai-2`、`ai-3`，使其读取 `source-intelligence.md` 和 `tag-taxonomy.md`；The Point / 商业雷达生成端开始按正式标签字典和来源治理规则执行。
- 自动化任务独立运行时可能无法使用当前会话的网页检索能力，需要持续观察降级路径和失败报告；如果 app 中仍存在旧商业雷达自动化，应停用旧任务，避免重复或绕过同步闸门。
- 网站数据依赖 `sync-data.mjs` 解析 Markdown，任何 Markdown 模板变化都可能影响前台展示。
- The Point 现在依赖 `05-Point/` 与 `05-Point/sources/` 双层 Markdown，字段名变化会影响素材页、人物详情页和首页摘要。
- 当前 04-Site 本地预览服务曾在 `127.0.0.1:4173` 可访问；新窗口如需验收，应优先确认本地服务状态或重新启动。

## 7. 下一步建议

建议下一轮从 Data Agent 和 QA Agent 开始：

1. PM / Data Agent 评审剩余 5 张无评分证据的早期机会卡：补评分、合并、降级观察或保留。
2. 明天自动化真实运行后，Workflow / Data Agent 检查 `daily-run-log.md`、`unified-site-sync-YYYY-MM-DD.md`、新内容文件和同步闸门状态。
3. Data Agent 输出正式 `tag-taxonomy.md`，解决 Tags 膨胀问题。
4. QA Agent 对普通前台、登录、试读、到期、Admin 四种状态做权限验收。
5. UI/UE Agent 统一所有详情页标题、字号、正文、卡片和移动端规范。
6. Dev Agent 准备云端部署检查清单，先解决 git、构建、备份、回滚和真实权限方案。

下一次接手时，先读本文件，再读：

1. `agent-workflow/progress.md`
2. `agent-workflow/feature_list.json`
3. `agent-workflow/reports/relation-check-latest.md`
4. `agent-workflow/reports/the-point-handoff-2026-05-03.md`
5. 当前用户最新指令

## 8. 2026-05-03 Tag Taxonomy 源文件治理更新

本轮已完成原始 Markdown 与网站公开 tags 的整理。

关键状态：

- `agent-workflow/product/tag-taxonomy.md` 继续作为正式标签字典。
- 原始 Markdown frontmatter tags 已批量归并，`AI创业机会` 不再作为 Opportunity 唯一标签。
- `AI-Agent`、`AI编程`、`AI-Coding`、`AI增长`、`Voice-AI`、`企业数据`、`企业知识库` 等旧别名已归并到正式标签。
- `04-Site/scripts/sync-data.mjs` 已调整为：公开 `tags` 只允许正式字典标签进入；详细行业、能力、动作、产品词保留在 `taxonomy` 中用于关系匹配。
- `04-Site/scripts/check-tags.mjs` 已新增，并写入 `agent-workflow/reports/tag-quality-check-latest.md`。
- `agent-workflow/tools/unified-site-sync.mjs` 已纳入 `check-tags.mjs`。
- 最新 tag 检查结果：46 个公开标签，禁用别名 0，未知公开标签 0。

自动化影响：

- `ai-the-point` 已更新：The Point 主题必须使用正式 point/track/source 标签，不在每日 frontmatter 写宽泛 tags。
- `ai-2` 已更新：新增或更新 Markdown 时，frontmatter tags 必须按正式字典写入，不写文档类型词或泛标签。
- `ai-3` 已更新：统一同步后必须运行 `check-tags.mjs`，并汇总 forbidden/unknown 数量。

报告：

- `agent-workflow/reports/tag-taxonomy-source-cleanup-2026-05-03.md`
- `agent-workflow/reports/tag-quality-check-latest.md`

## 2026-05-03 Signal 事件类型标准化交接

最新状态：Intelligence Data Agent 已将 Signal `新闻类型 / 信号类型 / 事件类型` 规范为单一主事件类型，解决 Daily Brief `变化类型` 杂乱问题。

标准允许值：融资、客户采用、收入验证、产品发布、监管/政策、采购/招标、并购整合、平台数据。

已改动：
- `01-Signals/*.md`：历史 `新闻类型` 已全部收敛为标准值。
- `04-Site/scripts/sync-data.mjs`：新增标准 `eventTypes` 输出，每条 Signal 只取一个主事件类型。
- `04-Site/js/app.js`：Daily Brief `变化类型` 只展示标准事件类型汇总。
- `agent-workflow/product/intelligence-data-model.md`：补充 Signal 事件类型标准。
- 自动化：已更新 `ai-2` 与 `ai-3`；`ai-the-point` 不受影响。

接手注意：后续每日商业雷达生成时，`新闻类型` 不得写成 `融资 / AI营销平台 / 企业客户` 这类组合；赛道、客户、产品、场景进入 tags、track、summary、taxonomy 或机会拆解。
## 2026-05-03 Signals 首页改版交接

最新状态：PM Agent 已将 Signals 首页改版推进为 active PRD 与执行任务单，任务已分配给 UI / UE Agent 和 Copy Agent，未创建临时 agent。

新增文件：
- `agent-workflow/prd/active/PRD-007-signals-homepage-redesign.md`
- `agent-workflow/execution/signals-homepage-redesign-2026-05-03.md`

改版方向：Signals 首页从“信号列表”升级为“信号雷达页”，默认加入日期分组，突出变化类型、信源状态、商业含义、关联 Opportunity / Trend 和原始来源入口。

UI / UE Agent 下一步：
- 使用 `frontend-design + Bloomberg/FT 内参式阅读 + Linear 信息密度`。
- 输出桌面端、移动端结构，以及顶部指标、日期分组、筛选区、Signal 卡片和详情预览规则。

Copy Agent 下一步：
- 输出页面标题、顶部指标、筛选标签、卡片字段、详情模块、来源入口和空状态文案。
- 避免新闻列表、热点推荐、必须行动、确定机会、Markdown、JSON、同步脚本等表达。

自动化影响：当前只分配 UI 和文案工作，不修改 Markdown 结构、同步脚本、数据字段或自动化运行顺序，因此不影响 `ai-the-point`、`ai-2`、`ai-3`。
## 2026-05-03 Signals 首页二次优化方案交接

最新状态：新增独立 `04-Site/signal.html` 详情页后，PM Agent 与 UI / UE Agent 已给出 Signals 首页二次优化方案。

报告：
- `agent-workflow/reports/pm-ue-signals-homepage-second-optimization-2026-05-03.md`

关键判断：
- Signals 首页负责“先看哪条”：雷达筛选、日期复盘、高价值 Signal 发现。
- Signal 详情页负责“为什么值得看”：完整要闻、来源与事实、机会拆解、评分依据、关联 Opportunity / Trend。

建议下一步 P0：
- 首页卡片瘦身，增加“查看详情”入口。
- 右侧从完整详情预览改成当前视图摘要 + 选中 Signal 简短预览。
- 日期组头显示当日 Signal 数、主变化类型、多信源数量和已关联判断数。
- 所有 Signal 链接统一进入 `signal.html?slug=...`。

自动化影响：当前方案不改变 Markdown、同步脚本或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 独立详情页落地交接

最新状态：已按用户确认完成“详情页是独立页面”的实现边界。

已落地：
- `04-Site/signals.html`：只作为 Signals 雷达首页，负责日期分组、筛选、快速判断、当前视图摘要和详情跳转。
- `04-Site/signal.html`：作为独立 Signal 详情页，负责完整来源、事实与信号脉络阅读。
- `04-Site/js/app.js`：Signals 首页卡片和右侧预览 CTA 统一跳转 `signal.html?slug=...`；首页右侧不再渲染完整详情正文。
- `04-Site/css/styles.css`：保留首页雷达和独立详情页两套样式边界。
- `agent-workflow/feature_list.json`：`GL-M3-010` 已进入 `verify`。

接手注意：
- 后续不要把 Signals 首页重新做成详情阅读页。
- 首页右侧应保持“当前视图摘要 + 选中 Signal 简短预览 + 进入独立详情页”。
- 完整来源、事实、机会拆解、评分依据、相关 Opportunity / Trend 只放在 `signal.html`。

最新验证：
- `sync-data.mjs` 同步成功：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 4 Point Sources / 27 Opportunities。
- `check-relations.mjs`：硬错误 0，软提醒 10。
- `check-tags.mjs`：46 个公开标签，禁用别名 0，未知公开标签 0。
- `run-quality-gates.mjs syntax` 通过。
- 浏览器桌面/移动端检查通过：Signals 首页和 Signal 详情页均无横向溢出。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`；未改变 Markdown 结构、数据字段、同步脚本入口或自动化顺序。

## 2026-05-03 Signals UI/文案修正交接

最新状态：已根据用户截图反馈，继续修正 Signals 首页右栏和 Signal 详情页排版。

已修正：
- 首页右侧不再出现 `Radar View`、`这页只做筛选和判断入口` 等内部说明。
- 首页右侧改为紧凑“当前筛选”摘要，配合变化类型 chips 和选中信号预览。
- 详情页不再把“为什么这是 Signal”“来源与事实”等模块做成巨大卡片。
- Signal 详情页主内容改为研究笔记式结构：顶部短判断、正文分隔线、事实/含义条目、机会拆解条目、评分依据条目。
- `analysis-card` 已从 Signal 详情页主体中移除，减少大边框、大阴影和大空白。

接手注意：
- 公开前台避免写“本页做什么”“入口”“筛选和判断”等内部产品话术。
- Signal 详情页应像商业内参阅读页，不像后台组件展示页。
- 后续若继续优化，应优先看首屏密度、标题字号、正文行宽、侧栏是否抢主内容。

最新验证：
- `node --check 04-Site/js/app.js` 通过。
- `check-relations.mjs`：硬错误 0，软提醒 10。
- `check-tags.mjs`：禁用别名 0，未知公开标签 0。
- `run-quality-gates.mjs syntax` 通过。
- 浏览器桌面/移动端检查无横向溢出。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Admin P0 工作台落地验收交接

最新状态：`P0-3A / WSD-20260504-16-admin-console-p0-workbench-implementation` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md`

已完成：
- `admin.html` 从本地控制台原型升级为后台专属单页工作台。
- 已覆盖运营仪表盘、内容管理、用户与权限、订阅与订单、邀请码、质量检查和系统设置。
- 内容管理升级为新闻 CMS 式列表筛选、频道切换和独立稿件编辑页；JSON 降为高级模式。
- 用户与权限、订阅与订单、质量检查、系统设置均作为独立视图呈现。
- 新增邀请码模块，支持生成、筛选、复制、暂停 / 启用、删除、申请审批和通过后生成单次邀请码。
- 新增本地访问统计，用于 Admin 运营仪表盘展示 PV / UV 和栏目热度。

验证：
- closeout 提供 Admin 桌面 / 移动端、多模块间距、内容管理、邀请码、控件对齐等截图，截图文件均存在。
- 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-145011.md`。
- `feature_list.json` 中 `GL-M3-005` 已更新为 `verify`，表示 Admin P0 工作台已落地，仍等待权限边界复查。

范围与风险：
- 本轮范围扩展到邀请码、邀请申请审批、本地访问统计和注册邀请码闭环；调度中枢接受本次扩展。
- 邀请码、邀请申请和访问统计仍为本地浏览器演示数据，不是正式云端系统。
- 四种身份完整权限边界仍需由 `P0-6 / WSD-20260504-03-admin-boundary-qa` 独立覆盖。
- `signals.html` 隐藏编辑弹窗源码风险仍需纳入 P0-6。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 首页 UI / Copy 重设计失败收口交接

最新状态：`P0-2B / WSD-20260504-18-homepage-ui-copy-redesign` 已由调度中枢按失败任务收口，状态为 `failed / not accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md`

结论：
- 用户复核后判定 `failed`。
- 当前结果仍未达到参考 demo 的首页质感要求。
- 本任务不合并、不作为首页最终方向。
- closeout 中引用的截图未同步到主工作树，调度中枢无法完成截图复核。
- `WSD-20260504-18` 编号曾被 Priority Engine 2.0 PM 边界任务使用，后续不再复用该编号派发首页任务。

看板回填：
- `dispatch-board.md` 已新增 `P0-2B / WSD-20260504-18-homepage-ui-copy-redesign`，状态为 `failed / not accepted`。
- 已新增 `P0-10 / WSD-20260504-25-site-ui-design-direction`：网站 UI 优化，由 Design Director 先输出全站 Art Direction、页面母版、DESIGN v2 草案和验收基线。
- 已新增 `P0-11 / WSD-20260504-26-homepage-desk-visual-asset`：首页右侧海报图 / Intelligence Desk 样张优化，等待 P0-10 accepted 后执行。
- 2026-05-04 22:48 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-144808.md`。

接手注意：
- 下一步不要继续沿用 P0-2B 的执行结果返修。
- 先执行 P0-10，完成全站 UI 方向和母版，再决定首页右侧主视觉如何落地。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 UI / UE Design Director 升级交接

最新状态：计划外长期 Agent 能力升级任务 `SYS-4 / WSD-ui-ue-design-director-upgrade` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-ui-ue-design-director-upgrade-closeout-2026-05-04.md`

已更新：
- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/agents/agent-registry.json`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/execution/ui-ue-design-director-upgrade-2026-05-04.md`
- `agent-workflow/reports/ui-ue-design-director-upgrade-2026-05-04.md`
- `agent-workflow/execution/dispatch-board.md`

核心变化：
- 不新增第九个长期 Agent，仍保留八 Agent 架构。
- `ui-ue-agent` 原地升级为 `UI / UE Design Director`。
- 新 primary outputs：Art Direction、DESIGN v2、页面母版、视觉资产规则、截图验收矩阵。
- Design Director 对全站 UI、首页、栏目体系、Admin、移动端和海报 / 首屏视觉任务拥有前置设计权与审美阻塞权。

接手注意：
- 后续首页首屏 P0、全站 UI 重设计、栏目体系重设计、Admin 重设计、移动端设计和海报 / 首屏视觉任务，不得直接进入 Dev。
- 必须先由 Design Director 输出 Art Direction、页面母版、字体 / 间距系统、视觉资产规则、审美阻塞项和 UI/UE 页面规范表。
- 如果执行窗口只做局部 CSS 调整、没有 Design Director 规范表和截图验收，调度中枢不得标记 `accepted`。

验证：
- `agent-registry.json` 与 `feature_list.json` 解析正常。
- 2026-05-04 22:41 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-144158.md`。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 登录 / 注册页面优化任务验收交接

最新状态：`P0-9 / WSD-20260504-24-login-register-page-optimization` 已由调度中枢复核并验收为 `accepted`。

任务：
- 看板编号：`P0-9`
- Task ID：`WSD-20260504-24-login-register-page-optimization`
- 派发单：`agent-workflow/execution/WSD-20260504-24-login-register-page-optimization.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-24-login-register-page-optimization-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md`

已完成：
- 登录页升级为“回到今日 AI 商业判断”的账号返回页。
- 注册页升级为“创建账号，开始阅读 AI 商业信号”的账号创建页。
- 注册页明确默认 7 天阅读有效期。
- 注册页新增邀请码输入；没有有效邀请码不能创建新账号。
- 邀请码申请拆到 `04-Site/invite-request.html`，用于收集邮箱、公司 / 机构、身份和申请理由。
- Admin 邀请码页新增申请记录列表，可复制邮箱、标记已发放或删除记录。
- 登录 / 注册后的本地跳转逻辑已调整：有效账号默认进入 `daily.html`，到期账号进入 `account.html`。
- 普通前台已清理 Admin、JSON、同步、编辑、恢复、字段、后台、申请访问、申请试读等表达。

主要改动：
- `04-Site/login.html`
- `04-Site/register.html`
- `04-Site/invite-request.html`
- `04-Site/admin.html`
- `04-Site/css/styles.css`
- `04-Site/js/app.js`

验证：
- closeout 包含 UI/UE 页面规范表、Copy 文案规范表、Dev 逐条实现说明、QA 桌面 / 移动截图和文案验收，满足页面 / 文案类硬闸门。
- 登录页、注册页和邀请码申请页桌面 / 移动端截图已生成。
- Playwright / Chrome 验证无横向溢出，注册和登录交互通过。
- 无效邀请码不创建用户；有效邀请码注册成功并消耗一次；未设密码旧账号不能绕过邀请码校验。
- 邀请码申请可写入本地演示数据；Admin `#invites` 可查看申请记录。
- 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-143023.md`。

范围与风险：
- 原派发单主要允许登录 / 注册页面与相关交互逻辑；执行中扩展到 `invite-request.html` 与 `admin.html` 邀请码申请 / 发放链路。调度中枢接受本次扩展，但后续 Admin 邀请码管理应归入 Admin 或权限边界任务。
- 邀请码与申请记录仍为本地浏览器演示数据，不是云端账号或邮件发放系统。
- 四种身份完整权限验收仍归 `P0-6 / WSD-20260504-03-admin-boundary-qa`。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signal 指向机会数量显示交接

最新状态：底层关系和网站展示层均已收口到“每条 Signal 指向 1 个主 Opportunity”。

已改动：
- `04-Site/scripts/sync-data.mjs`：Signal -> Opportunity 从弱标签宽关联改为主机会关联，优先使用 Priority Engine 命中的主机会。
- `04-Site/js/app.js`：`signalOpportunityLinks()` 在存在规范 `relatedOpportunityIds` 时，只按主机会 ID 计数，不再用历史机会名称、Opportunity 反向关系或赛道关系扩展数量。
- `04-Site/js/app.js`：`loadState()` 不再允许浏览器本地缓存里的旧 Signal-Opportunity 关系覆盖最新同步数据。

验证：
- 底层数据：29 条 Signals，全部各自只有 1 个 `relatedOpportunityIds`。
- 页面渲染：Signals 栏目页 29 张卡片均显示 `1 个机会`。
- 详情页渲染：Signal 详情页“指向机会”为 `1 个`，侧栏 Opportunity 卡为 1 张。
- 已模拟本地缓存仍保存旧多机会关系的情况，页面仍显示 1 个机会。
- `node --check 04-Site/js/app.js` 通过。

接手注意：
- 后续不要再用弱标签、赛道或反向关系来计算前台“指向机会”数量。
- 多个相关机会可以作为趋势、背景或后续分析展开，但 Signals 前台计数应保持主机会口径。
- 如果用户页面仍看到旧数量，优先检查是否运行的是旧静态文件或未刷新到最新 `app.js`。

自动化影响：已复核三个长期自动化任务。`ai-the-point` 不受影响，保持不变；`ai-2` 已补充“每条 Signal 只写一个主 Opportunity”的内容生成规则；`ai-3` 已补充 Signal -> Opportunity 主机会闸门和前台数量一致性检查口径。

## 2026-05-04 当前窗口收口交接

最新状态：用户准备结束当前窗口，本轮已完成收口记录与长期规范沉淀。

新增报告：
- `agent-workflow/reports/current-run-closeout-2026-05-04.md`

已固化到长期规范：
- `AGENTS.md`
- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/agents/copy-agent.md`
- `agent-workflow/product/COPY.md`

UI / UE 新规则：
- 栏目页标题必须与其他一级栏目保持同一套位置、字号、行高和首屏节奏。
- 标题背景默认与页面背景一致，不随意加突兀色块。
- 页面不能粗糙、简陋、像模板页或像后台组件堆叠。
- 用户反馈“粗糙、简陋、主次不明、占位过大、文案像内部话术”时，默认先修信息架构和阅读路径。

Copy 新规则：
- 公开前台文案写给客户，不写给内部团队。
- 不出现“本页用于”“入口”“同步”“字段”“后台”等内部产品话术。
- 文案只阐述信号、事实、来源和观察边界，不以说服别人为目标。
- Signals 前台避免“证据链、强证据、来源明确、阅读证据、机会确定、下一步验证”等表达。

自动化：
- `ai-the-point`：不受影响，保持不变。
- `ai-2`：已更新，补充“每条 Signal 只写一个主 Opportunity”的内容生成规则。
- `ai-3`：已更新，补充 Signal -> Opportunity 主机会闸门和前台数量一致性检查口径。

最新验证：
- `check-relations.mjs`：硬错误 0，软提醒 10。
- `check-tags.mjs`：46 unique tags，禁用别名 0，未知公开标签 0。
- `run-quality-gates.mjs syntax`：passed。
- Signals 栏目页和 Signal 详情页的“指向机会”数量已验证为 `1 个`。

## 2026-05-03 Signals 双页面成品感重构交接

最新状态：用户继续反馈“粗糙，两个页面都要改”后，已对 Signals 首页和 Signal 详情页做更彻底的 UI / Copy 重构。

已改动：
- Signals 首页：从双列卡片墙改为单列情报行，提升扫读效率。
- Signals 首页：顶部指标改为横向情报条，右侧改为深墨绿“本组信号”判断面板。
- Signals 首页：单条信号的入口文案从“查看详情”收敛为“查看信号”。
- Signal 详情页：主内容收进克制的报告纸面，形成更清楚的商业信号报告结构。
- Signal 详情页：侧栏限制 Opportunity 前 5 条、Trend 前 3 条，避免关联内容过量挤压主阅读。
- Signal 详情页：侧栏卡片改为紧凑列表，减少粗边框、阴影和重复卡片感。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `check-relations.mjs` 硬错误 0，软提醒 10。
- `check-tags.mjs` 禁用别名 0，未知公开标签 0。
- `run-quality-gates.mjs syntax` 通过。
- 浏览器桌面 / 移动端检查无横向溢出。

接手注意：
- 后续继续优化 Signals 首页时，应沿用“情报行”而不是回到卡片墙。
- Signal 详情页侧栏应保持克制，不要把所有关联 Opportunity 一次性铺出。
- 文案避免“页面功能说明”，优先表达用户能获得的判断和观察边界。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 直达详情与短标题交接

最新状态：已按用户反馈移除 Signals 首页右侧“当前选中”栏，并精简 Signal 详情页标题。

已改动：
- Signals 首页右侧预览栏已隐藏。
- Signal 列表行整体为详情入口，用户可直接点击任意行进入独立详情页。
- 列表行主次调整：标题为主，商业含义为辅，赛道 / 机会 / 趋势 / 来源为弱标签。
- Signal 详情页 H1 使用短判断标题，优先取原标题冒号后的商业判断，并压缩“AI 从……进入……”这类长表达。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `check-relations.mjs` 硬错误 0，软提醒 10。
- `check-tags.mjs` 禁用别名 0，未知公开标签 0。
- `run-quality-gates.mjs syntax` 通过。
- 浏览器检查：29 条 Signal 行均有 `signal.html` 链接；详情页 H1 已明显缩短；桌面 / 移动端无横向溢出。

接手注意：
- 后续不要恢复右侧“当前选中”栏。
- Signals 首页的主要动作是从列表直接进入信号详情。
- 详情页 H1 应保持短判断，完整事件可留在正文或来源与事实段中。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signal 详情页新闻源展示交接

最新状态：已按用户反馈修正 Signal 详情页顶部主内容。

已改动：
- 顶部主块展示新闻详情源 / 事件事实，不再展示观澜判断。
- 新增 `signalNewsDetail()` 展示派生逻辑：优先取 `summary` 中 `补充:` 之前的原始事实段。
- 若事实段中混入 `它的商业含义`、`其核心价值`、`核心商业意义`、`商业意义在于`、`这说明`、`这意味着` 等判断句，展示层会在这些短语前截断。
- 商业判断继续放在“为什么这是 Signal / 商业含义”模块。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `run-quality-gates.mjs syntax` 通过。
- 浏览器检查确认顶部新闻源段不含“商业含义”，无横向溢出。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signal 详情页原始新闻内容扩展交接

最新状态：已按用户要求，让详情页引用更多原始新闻内容。

已改动：
- `signalNewsDetail()` 会合并 `summary` 中多个事实块，继续剔除“商业含义 / 这意味着”等判断句。
- 详情页顶部新闻源块新增来源、发布时间、事件类型 meta。
- 已扩充 Legora 这条 Signal 的底层 `新闻内容简介`，补充融资轮次、ARR、估值、客户、市场覆盖、Harvey 对比和区域扩张信息。
- 已重新运行 `sync-data.mjs`。

验证：
- Legora 详情页顶部新闻源事实段为 309 字，不含“商业含义”。
- `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`、`run-quality-gates.mjs syntax` 均通过。

接手注意：
- 后续如果希望所有 Signal 都有更完整新闻源，需要 Data Agent 继续批量扩充原始 Markdown 的 `新闻内容简介` 事实段。
- 顶部新闻源块只展示事实，不展示观澜判断；判断放在“为什么这是 Signal / 商业含义”。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Handoff / Closeout 文件编码交接

最新状态：用户已明确要求，所有 handoff 文件和相关收口 Markdown 文件统一保存为 UTF-8。

适用范围：
- `docs/agent-handoff.md`
- `agent-workflow/progress.md`
- `agent-workflow/reports/*handoff*.md`
- `agent-workflow/reports/*closeout*.md`
- 其他用于新窗口恢复状态的交接、收口、阶段总结 Markdown 文件

接手注意：
- Windows PowerShell 读取中文交接或收口文件时，优先显式使用 `-Encoding UTF8`。
- 新增或更新 handoff / closeout 文件时，Workflow / Automation Agent 需要确保文件以 UTF-8 保存。
- 当前已有 `current-run-closeout-2026-05-03.md` 和 `current-run-closeout-2026-05-04.md` 已纳入该规则。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 调度中枢窗口机制交接

最新状态：用户已明确要求建立“当前窗口用于分配任务和接收收口文件，具体任务单独打开窗口执行，结束后回到当前窗口汇报并更新进度”的机制。

已新增：
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`
- `agent-workflow/reports/WSD-20260504-00-dispatch-hub-closeout.md`

已更新：
- `AGENTS.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/agents/workflow-agent.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`

使用方式：
- 当前窗口作为调度中枢，只做任务派发、收口验收和进度回填。
- 用户说 `派发：<任务描述>`，调度中枢生成任务 ID、派发单和执行窗口提示词。
- 用户说 `收口：<closeout 文件路径>`，调度中枢读取收口文件，检查派发单一致性、改动范围、Quality Gates、自动化影响和进度回填。
- 用户说 `状态`，调度中枢读取 `dispatch-board.md`。
- 用户说 `下一批`，调度中枢按 backlog 和当前交接状态给出建议派发顺序。

接手注意：
- 每个执行窗口必须只处理派发单范围。
- 每个执行窗口结束前必须写 UTF-8 closeout 文件，默认路径为 `agent-workflow/reports/<TASK-ID>-closeout.md`。
- 未提交 closeout 文件的任务，不得在调度中枢标记为 accepted。

最新验证：
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 任务看板驱动升级交接

最新状态：调度中枢窗口已升级为任务看板驱动。后续不需要每次从零描述任务，可直接通过看板编号领取任务。

核心文件：
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/governance/window-dispatch-hub.md`

新增快捷口令：
- `执行：<看板编号或 Task ID>`：读取已预生成派发单，并输出独立执行窗口提示词。
- `看板`：查看 ready / running / review 任务。
- `加入看板：<优先级> <牵头 Agent> <任务描述>`：追加新任务。

首批 ready 任务：
- `P0-1`：全站前台 Copy 语气审计。
- `P0-2`：Signals / Daily / Opportunities / Trends UI 截图矩阵验收。
- `P0-3`：普通前台与 Admin 边界复查。
- `P1-1`：Daily Brief 详情页产品化收口。
- `P1-2`：自动化首跑与日志复查。

接手注意：
- 以后用户说 `执行：P0-1` 时，不要重新规划该任务，直接读取对应派发单并输出执行窗口提示词。
- 执行窗口必须只处理派发单范围，并生成 UTF-8 closeout 文件。
- 调度中枢收到 closeout 后，才可把任务从 `review` 标记为 `accepted`。

最新验证：
- `feature_list.json` 可正常解析。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 看板任务池补充与排序交接

最新状态：用户新增 6 个任务，调度中枢已加入任务池，并按优先级重排。

新增并已生成派发单：
- `P0-1` / `WSD-20260504-07-the-point-home-redesign-plan`：The Point 首页改版方向制定。Strategy Agent 和 PM Agent 参与制定方向，突出价值；后续 Copy 和 UI / UE 执行。
- `P0-2` / `WSD-20260504-09-homepage-hero-optimization-plan`：首页优化，重点是首屏海报图和第一屏价值表达。
- `P0-3` / `WSD-20260504-08-admin-console-requirements`：Admin 管理功能模块设计和页面设计，由 PM Agent 给出开发需求并推进执行。
- `P0-4` / `WSD-20260504-11-launch-readiness-plan`：上线前准备，服务器、数据库、版本、备份、回滚、权限和部署方案。
- `P1-1` / `WSD-20260504-10-mobile-design-system`：移动端设计作为独立任务执行。
- `P1-2` / `WSD-20260504-12-ai-assistant-product-plan`：观澜AI 助理产品规划，支持网页端或手机端与客户对话交流。

当前建议执行顺序：
1. `执行：P0-1`
2. `执行：P0-2`
3. `执行：P0-3`
4. `执行：P0-4`
5. `执行：P0-5`
6. `执行：P0-6`
7. `执行：P1-1`
8. `执行：P1-2`

接手注意：
- The Point 首页、首页首屏、Admin、上线准备、AI 助理都属于重大任务，先走 Strategy / PM / Plan-first，不直接开发。
- 移动端设计已独立出来，不再混在每个页面改版里顺手处理。
- 执行窗口只处理派发单范围，完成后必须回到调度中枢提交 UTF-8 closeout 文件。

自动化影响：本次只补充任务池和派发单，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 长期 Agent GitHub 能力学习交接

最新状态：调度中枢已验收能力训练窗口提交的计划外收口，并补登记到看板。

收口文件：
- `agent-workflow/reports/WSD-agent-github-capability-learning-closeout-2026-05-04.md`

学习报告：
- `agent-workflow/reports/agent-github-capability-learning-2026-05-04.md`

已确认：
- `taste-skill` 已安装并学习，路径为 `C:\Users\86186\.codex\skills\taste-skill`。
- 外部学习来源包括 `openai/skills`、`phuryn/pm-skills`、`VoltAgent/awesome-design-md`、`Leonxlnx/taste-skill`、`Tencent/AI-Infra-Guard`。
- 八个长期 Agent 岗位文件已补充 GitHub 能力学习条目。
- `agent-workflow/governance/agent-memory.md` 已新增“GitHub 外部能力学习”长期规则。
- 调度看板已新增 `SYS-2` / `WSD-agent-github-capability-learning`，状态为 `accepted`。
- `agent-workflow/feature_list.json` 已新增 `GL-M3-013` 并通过 JSON 解析。
- 调度中枢已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-094538.md`。

接手注意：
- 后续安装、更新、学习或引用外部 GitHub skill / repo 时，必须在派发单和 closeout 中说明来源、路径、静态安全检查、风险等级和观澜AI适配边界。
- `taste-skill` 可作为 UI/UE 审美与工程检查参考，但不得原样套用强动效、大圆角 Bento、玻璃拟态或作品集式英雄区；观澜AI仍以克制商业情报调性为准。

自动化影响：本次只影响长期 Agent 能力说明、治理记忆、报告、调度看板和派发模板，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 首页首屏轮播图派发交接

最新状态：用户要求在派生工作树里制作 3 张首页轮播图，并替换当前首页首屏画面。调度中枢已新增并派发任务。

任务：
- 看板编号：`P0-2A`
- Task ID：`WSD-20260504-13-homepage-hero-carousel-assets`
- 派发单：`agent-workflow/execution/WSD-20260504-13-homepage-hero-carousel-assets.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md`

Agent 安排：
- UI / UE Agent 牵头。
- Copy Agent、Dev Agent、QA Agent 协作。
- PM Agent 控制任务边界。

执行要求：
- 必须在派生工作树中完成。
- 制作或生成 3 张首页首屏图，建议放入 `04-Site/assets/hero/`。
- 图片不嵌入文字，首屏文字由 HTML/CSS 承载。
- 替换首页首屏为 3 图轮播，保留品牌第一信号 `观澜AI｜WaveSight AI`。
- 必须做桌面端和移动端截图验收，确认无横向溢出，3 张图都能加载与切换。

自动化影响：预计不影响 `ai-the-point`、`ai-2`、`ai-3`，因为本任务只修改首页展示层和静态图片资产。

## 2026-05-04 本地环境与派生工作树修复交接

最新状态：派生工作树初始化失败的问题已修复。

原因：
- `01-WaveSight` 原本不是 git 仓库。
- 项目根目录没有 `.git`，因此无法创建派生工作树。

已修复：
- 初始化 git 仓库，默认分支为 `main`。
- 新增 `.gitignore`，排除依赖、缓存、备份和大型截图类验收文件。
- 新增 `.gitattributes`，固定文本换行策略并标记图片等二进制文件。
- 设置本仓库 `core.autocrlf=false`。
- 创建初始提交：`5428909 chore: initialize WaveSight repository baseline`。

验证：
- 已成功创建临时 worktree、创建临时分支、读取状态，再移除临时 worktree 和测试分支。
- 冒烟测试结果：`WORKTREE_SMOKE_OK`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

报告：
- `agent-workflow/reports/local-environment-worktree-fix-2026-05-04.md`

接手注意：
- 后续派生工作树任务应从当前 `main` 基线创建。
- 如果新窗口仍提示本地环境不可用，先确认窗口是否打开在 `01-WaveSight` 根目录，并确认是否能读取 `.git`。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 GitHub 仓库基线同步交接

最新状态：观澜AI项目基线已同步到 GitHub 仓库的部署准备分支。

GitHub 仓库：
- `jerryfang2023-stack/AI-Radar`
- `https://github.com/jerryfang2023-stack/AI-Radar`

已完成：
- 本地 `01-WaveSight` 仓库已绑定远端 `origin`。
- 起初远端 `main` 已有测试提交，因此先把当前完整项目基线推送到：

```text
wavesight-baseline-20260504
```

- 用户确认远端测试 / 命名规则文件没有价值，可以删除。
- 已使用 `--force-with-lease` 将观澜AI正式基线推送为远端 `main`。
- 当前远端 `main` 提交：

```text
504a155 chore: document GitHub baseline sync
```

同步范围：
- `04-Site/` 网站代码、页面、样式、脚本、静态资产和当前数据。
- `agent-workflow/` 长期 Agent 工作流、治理、派发单、PRD、产品规范、脚本和报告。
- `docs/agent-handoff.md`。
- `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/`。
- `AGENTS.md`、`.gitignore`、`.gitattributes`、`提示词/`、`测试期文档/`。

已排除：
- 依赖、缓存、备份、大型截图验收文件和本地环境变量。

报告：
- `agent-workflow/reports/github-baseline-sync-2026-05-04.md`

接手注意：
- 后续云端部署可以直接从 `main` 测试。
- `wavesight-baseline-20260504` 分支仍保留，如无需要可后续删除，避免混淆。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 The Point 首页改版规划收口与落地派发交接

最新状态：`P0-1 / WSD-20260504-07-the-point-home-redesign-plan` 已由调度中枢验收为 `accepted`，并已派发后续页面落地任务。

已接受文件：
- `agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md`
- `agent-workflow/reports/the-point-home-redesign-plan-2026-05-04.md`

规划结论：
- The Point 首页不应是观点列表、人物墙或来源聚合页。
- The Point 首页应成为“一线观点如何解释商业变化、补充判断证据、提示共识与分歧”的判断入口。
- H1 固定为：`从一线观点中，看见 AI 共识、分歧与边界。`
- 首屏不加小字导语，不解释栏目功能。
- 今日一线观点区是页面核心，必须突出人物 / 机构、来源类型和原文出处链接。
- 观澜解读是第二层增值，不能盖过一线来源。

已派发后续任务：
- 看板编号：`P0-1A`
- Task ID：`WSD-20260504-14-the-point-home-redesign-implementation`
- 派发单：`agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md`

执行要求：
- 一个执行窗口连续完成 Copy、UI / UE、Dev、QA。
- 不要中途回调度窗口；全部页面修改、检查和截图完成后，再提交 closeout。
- 允许改动 `04-Site/the-point.html`、`04-Site/js/app.js`、`04-Site/css/styles.css`。
- 禁止改动 `05-point/`、内容源、网站数据、同步脚本和自动化任务。

自动化影响：规划收口与后续派发本身不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 每日 Signal 关键词与来源优化派发交接

最新状态：调度中枢已根据用户要求派发 Intelligence Data Agent 任务，用于优化每日 AI 商业雷达的监测关键词和来源策略。

任务：
- 看板编号：`P0-7`
- Task ID：`WSD-20260504-15-signal-keyword-source-optimization`
- 派发单：`agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`

牵头 Agent：
- Intelligence Data Agent

目标：
- 每日 Signal 不再只偏向大企业、大融资和高曝光新闻。
- 增强对早期融资、新趋势、新投资方向、技术迭代、开源 / 开发者生态、垂直行业早期采用和反证信号的发现能力。
- 更新关键词库、监测提示词和 Source Intelligence。

自动化影响：
- 可能影响 `ai-2` 每日商业雷达生成口径。
- 默认不影响 `ai-the-point`。
- 默认不影响 `ai-3`，除非后续改同步闸门或检查规则。

## 2026-05-04 The Point 首页改版落地验收交接

最新状态：`P0-1A / WSD-20260504-14-the-point-home-redesign-implementation` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md`

已落地：
- The Point 首页 H1 固定为 `从一线观点中，看见 AI 共识、分歧与边界。`
- 首页从日期归档列表升级为判断入口，阅读路径为栏目标题、主观点、共识 / 分歧 / 早期信号、今日一线观点、往期观点和主题侧栏。
- 今日观点展示 10 条少而精内容，突出一线人物 / 机构、来源类型、出处、原始观点转述和观澜解读。
- 单条观点只保留 `查看观点` 一个动作。
- `往期观点` 可进入历史日期集合页。
- `正在升温的主题` 已改为可点击主题集合。
- 首页底部不再展示不明指向的 `相关判断` 聚合。
- 每日集合页序号已修复，超过 10 条时不会重置为 `01`。
- The Point 栏目标题区已回到全站一级栏目统一规范。

调度中枢复核：
- 改动范围符合派发单，集中在 `04-Site/the-point.html`、`04-Site/js/app.js`、`04-Site/css/styles.css` 和报告截图。
- 截图存在：
  - `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-desktop.png`
  - `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-mobile.png`
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-112652.md`。

接手注意：
- 后续不要把 The Point 首页退回人物墙、观点热榜或日期列表。
- The Point 首页展示一线观点和观澜解读，但来源、出处和原始观点转述仍是可信度核心。
- 具体观点的关联 Signal / Trend / Opportunity 仍由详情页承担，首页不堆不明指向的关联卡片。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Admin 后台需求规划收口交接

最新状态：`P0-3 / WSD-20260504-08-admin-console-requirements` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-08-admin-console-requirements-closeout.md`

需求产出：
- `agent-workflow/prd/active/PRD-007-admin-console.md`
- `agent-workflow/reports/admin-console-requirements-2026-05-04.md`

结论：
- Admin 后台应从本地控制台原型升级为独立管理工作台。
- Admin P0 仍保留单页 `admin.html`，但要形成后台专属信息架构。
- P0 模块包括：今日工作台、内容管理、用户与权限、订阅与订单、质量检查、发布准备、系统设置。
- P1 再考虑拆多页后台、操作日志、真实数据表映射和云端权限预留。
- `feature_list.json` 中 `GL-M3-005` 已更新为 `in_progress`。

后续任务：
- 看板编号：`P0-3A`
- Task ID：`WSD-20260504-16-admin-console-p0-workbench-implementation`
- 派发单：`agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md`

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 首页首屏与海报图规划收口交接

最新状态：`P0-2 / WSD-20260504-09-homepage-hero-optimization-plan` 已由调度中枢验收为 `accepted`，其结论已并入 P0-2A 首页轮播图落地任务。

收口文件：
- `agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md`

规划报告：
- `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`

关键结论：
- 首页首屏主视觉从抽象雷达转向“情报桌面 + 真实判断样张”。
- 首页首屏需要在 5 秒内说明：观澜AI不是 AI 新闻站，而是面向商业决策者的 AI 机会判断系统。
- 推荐 H1：`在市场形成共识前，看见 AI 商业变化`。
- 推荐副标题：`每天从融资、客户采用、产品落地和产业变化中筛出关键信号，形成可追踪的机会观察与趋势判断。`
- 推荐 CTA：`查看今日简报` / `申请进入完整情报层`。

用户认可的视觉参考：
- 展示图路径：`C:\Users\86186\.codex\generated_images\019def03-4307-7030-9f0c-2652d44d41c3\ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png`
- 参考气质：象牙白底、深石墨文字、深墨绿重点面板、少量铜棕强调。
- 右侧视觉应展示 Signals、Opportunity Watch、Trend Status 与 Brief 的判断关系。
- 避免霓虹科技风、大屏监控风、后台数据面板、抽象氛围图。

后续任务：
- P0-2A 后续已作废，不再作为首页首屏落地路径。
- `GL-M3-002` 继续保持 `in_progress`，等待重新派发新的首页首屏 P0 落地任务。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 首页首屏轮播图任务作废交接

最新状态：`P0-2A / WSD-20260504-13-homepage-hero-carousel-assets` 已提前终止，由调度中枢标记为 `void / abandoned`。

收口文件：
- `agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md`

作废原因：
- 当前首页首屏轮播方向未被采用，需要重新派发新的首页首屏 P0 方向任务。
- 本任务没有交付物，不可合并。
- 不再继续设计、生成图片、改页面或优化代码。
- 不合并、不推送、不把本任务成果带回主工作树。
- 不删除派生工作树，保留现场供后续参考。

调度结论：
- P0-2 首页首屏规划仍保留为参考。
- P0-2A 的“三张轮播图替换首屏”实现假设不再沿用。
- 后续应重新派发首页首屏 P0 落地任务，先确认最终首屏表达和视觉承载形式，再由 UI / UE、Copy、Dev、QA 连续完成开发与验收。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Netlify 预览部署任务派发交接

最新状态：调度中枢已新增 Netlify 预览部署任务，目标是把当前项目部署到 Netlify Preview，并返回可访问链接。

任务：
- 看板编号：`P0-4A`
- Task ID：`WSD-20260504-17-netlify-preview-deploy`
- 派发单：`agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`

Agent 安排：
- Dev Agent 牵头。
- PM Agent 控制范围，确认这是 preview deploy，不是 production launch。
- QA / Acceptance Agent 做部署后页面访问检查。
- Workflow / Automation Agent 记录部署方式、URL、检查结果和自动化影响。

执行边界：
- 优先将 `04-Site/` 作为发布目录。
- 优先使用 Netlify 插件 / connector；不可用时再使用 Netlify CLI 或 Web 流程。
- 不配置正式域名，不接入真实数据库，不做生产发布切换。
- 不改内容源、同步脚本、统一同步闸门或自动化任务。
- 不合并已作废的 P0-2A 首页轮播图任务成果。

自动化影响：
- 本任务可能影响上线准备路径。
- 默认不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Priority Engine 2.0 快速落地交接

最新状态：Priority Engine 2.0 第一版模型已由调度中枢验收，用户要求把 PM 确认、ai-2 提示词升级、Dev 解析实现、QA 验收四个后续任务合并为一个任务，并提高优先级、尽快开发上线。

已验收产物：
- `agent-workflow/execution/PLAN-priority-engine-2-2026-05-04.md`
- `agent-workflow/product/priority-engine-2.md`
- `agent-workflow/reports/priority-engine-2-2026-05-04.md`

核心模型：
- Priority Engine 2.0 是后台判断引擎，不新增前台栏目。
- `Judgment Node = 赛道 + 能力 + 客户场景 + 证据阶段`。
- The Point 不作为事实证据直接加权，只作为观点共识、分歧和边界信号。
- 对外状态为：优先验证、持续观察、早期观察、谨慎观察、暂缓关注。

合并任务：
- 看板编号：`P0-8A`
- Task ID：`WSD-20260504-22-priority-engine-2-fast-track-implementation`
- 派发单：`agent-workflow/execution/WSD-20260504-22-priority-engine-2-fast-track-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-22-priority-engine-2-fast-track-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md`

已合并不再单独执行：
- `WSD-20260504-18-priority-engine-2-pm-boundary`
- `WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade`
- `WSD-20260504-20-judgment-node-dev-plan`
- `WSD-20260504-21-priority-engine-2-qa-criteria`

接手注意：
- 本任务优先级已提升为 P0 / highest。
- 必须保留旧 30 分评分表兼容。
- 不新增普通前台栏目，不输出投资建议或确定性表达。
- Dev 实现应采用兼容降级策略，历史 Markdown 没有 2.0 字段时可从旧评分标题、赛道、Opportunity / Trend 关系派生候选 Judgment Node。

自动化影响：
- `ai-2`：有影响。
- `ai-the-point`：本轮不强制改，但需说明后续轻量增强项。
- `ai-3`：短期不改闸门；若 Judgment Node 字段进入同步结果，需要后续补检查口径。

## 2026-05-04 Netlify 预览部署验收交接

最新状态：`P0-4A / WSD-20260504-17-netlify-preview-deploy` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`

可访问链接：
- 不可变部署链接：`https://69f88cb84d559e9a6e9354bd--wavesight-ai-preview.netlify.app`
- 站点默认链接：`https://wavesight-ai-preview.netlify.app`
- Netlify 项目后台：`https://app.netlify.com/projects/wavesight-ai-preview`

部署信息：
- Netlify 站点名称：`wavesight-ai-preview`
- Site ID：`7ab8a5d2-477b-439d-ad4b-57f449ebad9e`
- Deploy ID：`69f88cb84d559e9a6e9354bd`
- 发布目录：`04-Site/`
- 新增 `netlify.toml`，内容仅为 `[build] publish = "04-Site"`。

调度中枢复核：
- 外部 HTTP 抽查首页、Daily、Signals、The Point、Opportunities、Trends、CSS、JS、data 均返回 200。
- `GL-M4-001` 已更新为 `in_progress`，表示已完成预览部署阶段；正式上线仍需 release checklist、权限边界、备份和回滚方案。

遗留风险：
- `/signals.html` 源码中仍有历史遗留隐藏 `editorDialog` 编辑弹窗。
- 该问题不阻塞本次 Netlify Preview 验收，但必须进入 `P0-6 / WSD-20260504-03-admin-boundary-qa` 处理。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Priority Engine 2.0 快速落地验收交接

最新状态：`P0-8A / WSD-20260504-22-priority-engine-2-fast-track-implementation` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md`

已落地：
- Priority Engine 2.0 保持后台判断能力，不新增普通前台栏目。
- `ai-2` 提示词已保留旧 30 分表，并新增 Priority Engine 2.0 Judgment Node 拆解段。
- `sync-data.mjs` 已输出 `judgmentNodes` 与 `priorityEngine` 摘要。
- `check-relations.mjs` 已覆盖 `Priority -> Judgment Node` 和 `Judgment Node -> Priority / Signal / Trend / Opportunity`。
- 网站数据已包含 `22` 个 Judgment Nodes，`39` 条 Priority Rows 全部进入 Judgment Node。

调度中枢复核：
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 12。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-123257.md`。
- `GL-M2-006` 已更新为 `verify`。

非阻塞遗留：
- Netlify 未重新部署本轮 Priority Engine 2.0 数据；远端部署遇到授权 / 绑定问题，不冒充上线。
- 旧 `04-Site/scoring.html` 中存在否定式文案 `不是投资建议`，后续 Copy / Admin 边界 QA 可处理。

自动化影响：
- `ai-2`：已影响，提示词已升级。
- `ai-the-point`：本轮未改，后续可轻量增强观点立场、Judgment Node 和可验证边界。
- `ai-3`：本轮未改统一同步闸门；后续需要把 Priority Row -> Judgment Node 检查摘要纳入闸门口径。

## 2026-05-04 ai-3 Judgment Node 同步闸门派发交接

最新状态：调度中枢已根据用户要求派发 P0 任务，用于升级 `ai-3` 统一网站同步闸门，加入 Priority Engine 2.0 Judgment Node 覆盖率与硬错误检查。

任务：
- 看板编号：`P0-8B`
- Task ID：`WSD-20260504-23-ai-3-judgment-node-sync-gate`
- 派发单：`agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md`

Agent 安排：
- Workflow / Automation Agent、Dev Agent 牵头。
- Intelligence Data Agent、QA / Acceptance Agent、PM Agent 协作。

执行要求：
- 在 `agent-workflow/tools/unified-site-sync.mjs` 中补充 Judgment Node 覆盖率与硬错误检查。
- 必须确认 `priorityRows`、`judgmentNodes`、`priorityEngine` 摘要存在且互相一致。
- Priority Row 无 Judgment Node、Judgment Node 无 Priority、覆盖率摘要缺失或不一致、Judgment Node 断链应阻止入站。
- 同步后检查失败必须恢复同步前备份，不覆盖上一版有效数据。
- 更新 `ai-3` 运行说明或实际自动化提示词；如果无法直接更新实际自动化配置，必须在 closeout 说明阻塞和替代文档。

自动化影响：
- 本任务可能影响自动化任务。
- `ai-the-point`：默认不影响。
- `ai-2`：间接影响，后续每日评分必须持续输出 Judgment Node 或可解析候选。
- `ai-3`：直接影响，统一同步闸门口径将升级。

调度中枢检查：
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-125015.md`。

## 2026-05-04 ai-3 Judgment Node 同步闸门执行验收交接

最新状态：`P0-8B / WSD-20260504-23-ai-3-judgment-node-sync-gate` 已进入执行并验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md`

已完成：
- `agent-workflow/tools/unified-site-sync.mjs` 已新增 Priority Engine 2.0 Judgment Node 硬闸门。
- `ai-3` 实际自动化本体提示词已更新，新增 Judgment Node 覆盖率、硬错误代码和成功汇总要求。
- `agent-workflow/execution/daily-automation-coordination-2026-05-03.md` 已更新 `ai-3` 运行说明。
- `dispatch-board.md` 已将 `P0-8B` 标记为 `accepted`。

硬闸门规则：
- Priority Row -> Judgment Node 覆盖率必须为 100%。
- 每个 Judgment Node 必须至少关联一个 Priority Row。
- Judgment Node 关联的 Priority / Signal / Trend / Opportunity / Point 不得断链。
- `priorityEngine` 摘要必须与实际数据一致。
- The Point 只能作为观点共识、分歧或边界信号，不能作为事实证据直接加权。

验证结果：
- `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04 --run-sync-gate` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-125900.md`。
- `ai-3` 真实闸门状态：`synced`。
- Priority Rows：39。
- Judgment Nodes：22。
- Priority Row -> Judgment Node 覆盖率：39/39。
- 备份目录：`agent-workflow/backups/unified-site-sync/20260504-125611`。
- 报告：`agent-workflow/reports/unified-site-sync-2026-05-04.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：间接影响，后续每日评分必须持续输出 Judgment Node 或可解析候选。
- `ai-3`：直接影响，统一同步闸门已升级并验证通过。

## 2026-05-04 Signal 关键词与来源优化验收交接

最新状态：`P0-7 / WSD-20260504-15-signal-keyword-source-optimization` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`

完成产物：
- `提示词/关键词列表.md`：V4.2。
- `提示词/监测提示词V4.0.md`：V4.2。
- `agent-workflow/product/source-intelligence.md`：补充早期、开发者、投资、垂直行业和反证来源分层。
- `agent-workflow/reports/signal-keyword-source-optimization-2026-05-04.md`。

关键变化：
- 每日 AI 商业雷达不再只偏向大企业、大融资和高曝光新闻。
- 候选池固定为六类：成熟信号、早期融资 / 新投资方向、技术迭代、开源 / 开发者生态、垂直行业早期采用、反证与降温。
- 下一次 `ai-2` 运行应观察早期信号覆盖率、反证覆盖率、高产词和低效词。
- 每条 Signal 后续应记录 `触发查询` 和 `监测维度`，并保持 1 个主 Opportunity 与 6 点机会拆解。

接手注意：
- `GL-M2-004` 已更新为 `in_progress`，表示关键词策略已优化，但关键词质量检查脚本 / 周期复盘仍未完全完成。
- 本任务未修改自动化配置对象；如后续发现 `ai-2` 没有充分读取 V4.2 文件，需要由 Workflow Agent 更新 `ai-2` 自动化提示摘要。

自动化影响：
- `ai-2`：有影响。
- `ai-the-point`：不影响。
- `ai-3`：不影响。

## 2026-05-04 页面类任务派发闸门规则验收交接

最新状态：计划外治理任务 `SYS-3 / WSD-page-dispatch-gate-rules` 已由调度中枢验收为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-page-dispatch-gate-rules-closeout-2026-05-04.md`

规则报告：
- `agent-workflow/reports/page-dispatch-gate-rules-2026-05-04.md`

已更新：
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/execution/dispatch-board.md`

新硬规则：
- 涉及首页、栏目页、详情页、会员页、Admin、移动端、`04-Site/*.html` 或 `04-Site/css/styles.css` 页面体验改动的任务，一律视为页面类任务。
- 页面类任务必须经过：`PM 范围确认 -> UI/UE 页面规范表 -> Dev 按表实现 -> QA 独立截图/测量验收 -> Workflow 收口`。
- 页面类任务 closeout 必须包含 UI/UE 页面规范表、Dev 逐条实现说明、QA 桌面 / 移动端截图和坐标 / 字号 / 间距 / 首屏节奏验收。
- 缺少任一项时，调度中枢不得代补事实，不得标记 `accepted`，应退回执行窗口补齐。

接手注意：
- 重新派发首页首屏 P0 时必须先产出 UI/UE 页面规范表，不沿用旧轮播任务。
- `P0-3A` Admin 工作台 closeout 需要按新页面类闸门验收；如果缺少规范表、逐条实现说明或截图/测量验收，不得 accepted。
- 后续栏目标题矩阵、移动端设计和页面返修任务均必须套用新模板。

验证：
- 2026-05-04 21:26 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-132602.md`。

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。
