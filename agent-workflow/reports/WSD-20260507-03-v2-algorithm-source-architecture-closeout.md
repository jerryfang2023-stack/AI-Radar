---
title: WSD-20260507-03 V2 Algorithm Source Architecture Closeout
date: 2026-05-07
type: closeout
status: completed / ready-for-dispatch-review
task_id: WSD-20260507-03-v2-algorithm-source-architecture
board_id: V2-2
owner: v2-source-intelligence / v2-heatmap-algorithm / data / pm / workflow
---

# 调度摘要

- 任务：`WSD-20260507-03-v2-algorithm-source-architecture`
- 阶段：阶段 2 正式执行
- 状态：completed / ready-for-dispatch-review
- 正式产出：`agent-workflow/v2/v2-algorithm-source-architecture.md`
- 本收口：`agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md`
- 改动范围：仅新增 V2 架构文档与 closeout
- 未修改：`04-Site`、生产内容源 frontmatter、`sync-data.mjs`、`unified-site-sync.mjs`、`ai-the-point`、`ai-2`、`ai-3`
- Quality Gate：`node agent-workflow/tools/run-quality-gates.mjs syntax` passed
- 回调度口令：`收口：WSD-20260507-03-v2-algorithm-source-architecture`

## 1. 完成事项

已根据阶段 1 确认口径，正式产出 V2.0 算法与内容源架构文档：

- `agent-workflow/v2/v2-algorithm-source-architecture.md`

文档明确：

- V2-2 服务正式 V2.0 升级，不是测试项目。
- AI内参在本任务中只作为算法输入 / 输出结构处理，产品决策交给 V2-4A / V2-4。
- 分支、worktree、测试页、test-only 管线和 `06-content/` 是风险隔离手段，不是最终交付形态。
- 最终目标是成熟后迁入正式 V2 生产链路。

## 2. 架构覆盖内容

正式文档已覆盖：

1. V2 判断流水线总览。
2. 来源分层、监测频率、剔除规则。
3. Raw -> Pool -> Structured -> Front Signal -> Deep Dive -> Trend 漏斗。
4. 去重、合并、已跟踪信号补充规则。
5. 二次搜索、反证、可信度评分。
6. 四栏目到 `HeatEvidence` 的转换规则。
7. `HeatEvidence` schema 草案。
8. 行业 / 岗位 / 流程 seed dictionary 与 `tag-taxonomy.md` 映射原则。
9. 行业、岗位、流程、三元组热力计算规则。
10. Heat Cards schema 草案。
11. weekly / monthly `AIBriefIssue` 输入、输出与 schema 草案。
12. 7 日验证计划，并要求第 7 天模拟 1 期 weekly AI内参样张。
13. 哪些部分必须先隔离验证，哪些部分可进入生产升级路径。
14. 后续 Dev 文件路径建议，但未创建代码文件。
15. V2 Verification Agent 验收清单。
16. 自动化影响和回填建议。

## 3. 用户确认口径落实

| 用户确认项 | 落实情况 |
|---|---|
| V2-2 服务正式 V2.0 升级，不是测试项目 | 已在文档第 1、13、16 节明确 |
| AI内参只做算法输入规划 | 已写明产品决策交给 V2-4A / V2-4 |
| 可提出 HeatEvidence 新字段草案，不改生产 schema | 已给出 schema 草案，并说明不修改生产 schema |
| 行业 / 岗位 / 流程标签先 seed dictionary，再映射 tag-taxonomy | 已新增 seed dictionary 与正式标签映射原则 |
| weekly / monthly AIBriefIssue 都写入架构文档，MVP 先 weekly | 已在第 11 节明确 |
| 7 日测试计划模拟 1 期 weekly AI内参样张 | 已在第 12 节明确 |
| 可提出 Dev 文件路径建议，但不创建代码文件 | 已在第 14 节只给建议 |
| 执行窗口只写回填建议，调度中枢最终验收和回填 | 已在第 17 节写回填建议 |

## 4. 改动文件

新增：

- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md`

已存在并读取：

- `AGENTS.md`
- `agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md`
- `agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-stage1-plan.md`
- `agent-workflow/v2/v2-agent-system.md`
- `agent-workflow/v2/v2-transition-charter.md`
- `agent-workflow/v2/briefs/v2-algorithm-brief.md`
- `agent-workflow/v2/briefs/v2-source-monitoring-brief.md`
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/v2/references/guanlan-ai-brief-heatmap-premium-plan.md`
- `agent-workflow/v2/briefs/v2-ai-brief-heatmap-premium-brief.md`
- `agent-workflow/product/tag-taxonomy.md`

## 5. Quality Gates

已运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：

- 状态：passed
- 检查项：6
- 失败项：0
- 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-083845.md`

未运行：

- `sync-data.mjs`
- `check-relations.mjs`
- `check-tags.mjs`
- 浏览器截图 / 页面 QA
- 自动化真实同步闸门

未运行原因：

- 本任务只新增规划文档和 closeout。
- 未修改生产内容源、站点数据、页面、脚本或自动化本体。
- 运行内容同步或自动化闸门可能写入站点数据，不符合本任务禁止范围。

## 6. 自动化影响

本任务会影响 V2 正式升级路线，但本轮没有修改自动化任务。

- `ai-the-point`：未修改。未来 Point 可作为 `HeatEvidence` 校准层输入，需另行派发。
- `ai-2`：未修改。未来若将 V2 漏斗迁入生产，需单独升级提示词和字段规则。
- `ai-3`：未修改。未来若 `HeatEvidence` / `AIBriefIssue` 进入正式数据，需要单独升级同步闸门和关系检查。

## 7. 风险与后续

风险：

- 公式权重仍需 7 日真实样本校准，不能直接生产固化。
- seed dictionary 需要和 `tag-taxonomy.md` 持续映射，否则会形成第二套标签体系。
- Point 的校准价值高，但必须继续防止其被误用为事实主证据。
- AI内参页面、权限和商业化表达尚未由 V2-4A / V2-4 决策。

建议下一步：

1. 调度中枢验收 V2-2，并决定是否标记 `accepted / architecture`。
2. V2-4A 读取本文档，做 AI内参 + 热力图产品门禁。
3. V2-4 读取本文档，吸收进 V2 产品架构 PRD。
4. V2-5 读取本文档，决定后续分支 / worktree / Dev 文件路径。
5. 后续另行派发 7 日隔离验证任务，模拟 1 期 weekly AI内参样张。

## 8. 回调度窗口

收口：WSD-20260507-03-v2-algorithm-source-architecture
