# WSD-20260510-08 Stage E Summary

任务：`WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance`
阶段：E. 历史冲突清理
日期：2026-05-10
状态：已执行，等待用户确认进入 F

## 1. 本阶段目标

清理治理与产品规范中的历史冲突口径，避免后续新窗口继续继承旧 V1 / 早期 V2 测试规则。

本阶段只修改治理、产品规范、handoff 和进度账本；未修改每日内容、知识卡正文、网站页面或实际 09:00 自动化本体。

## 2. 当前规则覆盖入口

新增：

- `agent-workflow/governance/v2-current-rule-overrides.md`

用途：

- 作为 V2 当前规则覆盖表。
- 当旧 PRD、旧派发单、V1 历史说明、测试期文档和当前 A-D 规则冲突时，以此文件和 A-D 阶段 summary 为准。

已在以下文件中加入或强化引用：

- `agent-workflow/governance/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/progress.md`

## 3. 已清理的冲突类型

### 3.1 旧前台栏目冲突

旧口径：

- Daily Brief / Signals / The Point / Opportunities / Trends

当前口径：

- 今日要点 / 关键信号 / 机会解码 / 商业内参

处理：

- The Point 不作为一级栏目，进入 `关键信号 > Builders 观点` 和各栏目观点校准模块。
- Trends 不作为一级栏目，作为趋势背景、热力输入和商业内参材料。
- Opportunities 前台表达更新为机会解码，定位为深度分析报告，不是机会卡列表。

### 3.2 旧生产漏斗数量冲突

旧口径：

- Raw 30-50
- Pool 10-15
- Structured 5-8
- Deep Dive 0-1

当前口径：

- Raw 80-150
- 降级日 Raw 50-80
- Pool 20-30
- Structured 8-15
- Front 3-5
- Deep Dive 1-2
- Trend Updates 3-5

处理：

- 旧数量只保留为历史测试管线记录，不作为当前生产标准。

### 3.3 行动建议 / 下一步验证冲突

旧口径：

- Daily Brief 输出行动建议。
- Opportunities 承接下一步验证动作。

当前口径：

- 今日要点输出观察重点、判断依据、趋势温度和关键词，不替用户做行动决策。
- 机会解码输出证据、风险边界和后续观察问题，不写成经营或投资指令。

### 3.4 知识库目录冲突

旧风险：

- 新建 `08-Builders`
- 新建 `09-AIBriefs`
- 新建 `06-Heat-Candidates`

当前口径：

- Builders 使用 `08-People/`
- AIBriefs 使用 `10-AIBriefs/`
- Heat Candidates 使用 `11-Heat-Candidates/`

## 4. 已更新文件

- `agent-workflow/governance/v2-current-rule-overrides.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/governance/agent-roles.md`
- `agent-workflow/governance/column-decision-log.md`
- `agent-workflow/governance/tool-registry.md`
- `agent-workflow/product/strategy-single-source.md`
- `agent-workflow/product/product-strategy.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/commercial-operating-model.md`
- `agent-workflow/product/commercial-site-modules.md`
- `agent-workflow/product/product-principles.md`
- `agent-workflow/product/opportunity-solution-tree.md`
- `docs/agent-handoff.md`
- `agent-workflow/progress.md`

## 5. 保留为历史、不做硬删的内容

以下内容仍可能在历史 handoff、旧 closeout、旧 PRD 或 V1 文档中出现，但不再作为当前执行规则：

- V1 商业雷达格式。
- Raw 30 / Raw 30-50 测试期记录。
- Daily Brief / Signals / The Point / Opportunities / Trends 旧前台主线。
- The Point 独立一级栏目设计记录。
- Trends 独立一级栏目设计记录。
- 旧同步闸门 `ai-the-point`、`ai-2`、`ai-3`。

保留原因：

- 它们是历史审计、回溯和旧任务验收记录。
- 强行删除会破坏任务链路追踪。
- 当前通过覆盖规则和顶部 handoff 说明避免误继承。

## 6. 待 F 阶段检查

F 阶段建议检查：

- `v2-current-rule-overrides.md` 是否被新窗口优先读取。
- A-D stage summary 是否齐全。
- `v2content` 是否已按新字数、来源、Heat Candidate、日志字段检查。
- 是否仍有“当前口径”文件把旧栏目当作一级导航。
- 是否需要补充一份最终 closeout，并回调度窗口收口。

## 7. 本阶段验证

- `feature_list.json` JSON 结构检查：passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。
- 冲突词扫描：剩余 `Raw 30-50`、`08-Builders`、`09-AIBriefs`、`06-Heat-Candidates` 命中均处于历史说明、禁用规则或当前覆盖表中，不作为当前生产规则。
