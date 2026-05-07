# V1.0 Baseline Freeze

日期：2026-05-07  
状态：baseline-record  
owner：`workflow` / `qa`

## 1. 冻结目的

V1.0 已完成，后续进入 V2.0。为避免 V2.0 开发污染当前稳定资产，需要先明确 V1.0 的冻结口径。

本文件不是代码 tag，也不是发布证明；它是调度中枢的 V1.0 基线说明。真正的 Git tag / 发布 tag 应在后续 `V2-5 / dev workspace baseline` 中由 Dev Agent 执行。

## 2. V1.0 当前资产

V1.0 已形成：

- 前台导航：首页 / Daily Brief / Signals / The Point / Opportunities / Trends。
- 后台方向：Admin P0 工作台已落地。
- 判断资产：Signal、Priority Engine、Trend、Opportunity、The Point 的基础关系已建立。
- 调度体系：长期 agent-workflow、看板驱动、closeout 收口和 SYS-8 短口令机制已建立。
- 设计治理：Design Director、DESIGN v2 草案、SYS-7 证据化审美质检闸门已建立。
- 自动化：`ai-the-point`、`ai-2`、`ai-3` 三个长期自动化任务继续按现有生产口径运行。
- 测试管线：P0-12 日常监测算法 v2 test-only 管线已存在，但不得替代正式 Signals。

## 3. 不得误用的历史任务

- `P0-2A / WSD-20260504-13-homepage-hero-carousel-assets`：`void / abandoned`，不得合并或作为首页方向。
- `P0-2B / WSD-20260504-18-homepage-ui-copy-redesign`：`failed / not accepted`，不得作为首页成功版本。
- `P1-4B / WSD-20260505-03-non-home-column-detail-reading-implementation`：`stopped / not accepted`，不得继续执行。
- `P0-11 / WSD-20260504-26-homepage-desk-visual-asset`：当前仍为 `review / evidence-required`，不得当作 accepted。

## 4. V2.0 开发保护线

V2.0 前期规划不得直接修改：

- `04-Site/` 页面与生产数据展示。
- `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/` 的生产命名和 frontmatter 口径。
- `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`、`unified-site-sync.mjs` 的生产运行口径。
- 三个长期自动化任务提示词或执行顺序。

任何涉及上述范围的 V2 任务，必须单独派发并说明自动化影响、回滚策略和 QA 验收。

## 5. 后续 Dev 建议

后续进入 V2 代码阶段前，建议由 Dev Agent 执行：

- 创建 Git tag：`v1.0-baseline` 或经用户确认的正式 tag。
- 创建 V2 分支：`codex/v2-planning` 或 `v2/main`。
- 可选创建 worktree：`01-WaveSight-v2-lab`。
- 记录当前 main / Netlify / 本地工作树状态差异。

