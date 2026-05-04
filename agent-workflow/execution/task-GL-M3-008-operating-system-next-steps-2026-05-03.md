# Agent Operating System 后续优化 Plan

日期：2026-05-03  
owner：`pm` / `workflow`  
状态：in_progress

## 1. 背景

当前已完成 Agent Operating System 1-4：

- `governance/README.md`
- `AGENTS.md` 启动规则更新
- `execution/PLAN-template.md`
- `tools/run-quality-gates.mjs`

用户要求继续执行 5-8，并补充任务 9：由 Intelligence Data Agent 解决 Tags 膨胀问题，把标签从随手标注升级为可搜索、可筛选、可关系网络化的判断资产。

## 2. Strategy 判断

本轮任务符合观澜AI“面向商业决策者的 AI 机会判断系统”定位。

原因：

- 自动化首跑验收保障每日判断稳定入站。
- Opportunity 评分缺口评审提升机会库可信度。
- Source / Keyword / Builder 池治理提升输入质量。
- Commercial Operating Model 补齐商业化路径。
- Tags 字典化提升搜索、筛选和关系网络能力，但不把 Tags 升级为前台一级栏目。

## 3. PM 目标

1. 建立 2026-05-04 自动化首跑验收计划与报告。
2. 评审 5 张无 Priority 评分证据的早期 Opportunity。
3. 建立 `source-intelligence.md`，治理来源、关键词和 Builder 池。
4. 建立 `commercial-operating-model.md`，补齐商业化运营模型。
5. 建立 `tag-taxonomy.md`，解决标签膨胀问题。
6. 检查本轮是否影响 `ai-the-point`、`ai-2`、`ai-3`，如影响则更新自动化任务。

## 4. 非目标

- 不新增前台 Tags 一级栏目。
- 不为清零软提醒而强行绑定 Priority 评分。
- 不改动真实支付、真实登录或云端权限系统。
- 不直接运行 2026-05-04 未来日期的真实同步。
- 不修改 `ai-the-point`、`ai-2`、`ai-3` 的时间线，除非字段或读取文件变化要求同步。

## 5. 自动化影响检查

本轮可能影响自动化：

- `source-intelligence.md` 影响 `ai-the-point`、`ai-2` 的来源、关键词、人物池口径。
- `tag-taxonomy.md` 影响 `ai-the-point`、`ai-2` 生成 tags 的规则，也影响 `ai-3` 同步后的质量验收口径。
- `commercial-operating-model.md` 不影响三段式自动化。
- 机会评分缺口评审不直接影响自动化，但可能影响后续 `ai-2` 生成 Priority / Opportunity 时的处理原则。

因此，本轮结束前必须检查并更新三个自动化任务提示词或执行文档。

## 6. 输出文件

- `agent-workflow/reports/automation-first-run-2026-05-04.md`
- `agent-workflow/reports/opportunity-priority-gap-review-2026-05-03.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/commercial-operating-model.md`
- `agent-workflow/product/tag-taxonomy.md`
- `agent-workflow/reports/automation-impact-review-2026-05-03.md`

## 7. Quality Gates

计划运行：

- `node --check agent-workflow/tools/run-quality-gates.mjs`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- `node -e` 校验 `feature_list.json` 和 `agent-registry.json`

不运行：

- `content` / `all`：会运行 `sync-data.mjs` 并可能改写网站数据；本轮以产品、治理和报告为主，不做内容入站。
- `automation --run-sync-gate`：2026-05-04 自动化首跑尚未发生，不提前模拟未来日期同步。

## 8. 验收标准

- 5-9 均有对应输出文件。
- Tags 有分层、命名、ID、别名、准入、合并、降权和自动化生成规则。
- 自动化影响已明确，并对 `ai-the-point`、`ai-2`、`ai-3` 做必要更新或说明无需更新。
- 不破坏三段式自动化边界：内容生成只写 Markdown，统一入站由 `ai-3` 执行。
