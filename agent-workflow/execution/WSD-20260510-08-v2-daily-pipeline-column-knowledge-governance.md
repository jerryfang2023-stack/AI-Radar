# WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance 派发单

日期：2026-05-10  
状态：ready / confirmation-first  
调度窗口：当前主窗口  
牵头 Agent：`workflow` / `data` / `pm`  
协作 Agent：`copy` / `qa`

## 0. 快速执行卡

- 看板编号：`V2-DAILY-GOV`
- Task ID：`WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance`
- 任务类型：治理类 / 自动化类 / 数据内容规范类
- 派发单：`agent-workflow/execution/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-closeout.md`
- 调度口令：`收口：WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance`
- 是否可能影响自动化：是，但第一阶段不得修改自动化本体
- Skill Pattern：`Tool Wrapper + Inversion + Pipeline + Reviewer`
- Pattern 顺序：先读取规范和现状，再分类诊断，再逐项向用户确认，再按确认项执行，最后由 QA / Workflow 复核
- 硬停顿：每个栏目 / 类别必须单独得到用户确认；未确认不得进入执行
- Reviewer：PM / Data / Workflow 复核规则一致性；QA 复核没有继承旧冲突规则

执行窗口最短启动提示词：

```text
执行任务：WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance.md。
注意：本任务不是马上执行规则修改，而是先做分类诊断和逐项确认。
第一阶段只输出分类清单、冲突清单、建议执行顺序和需要我确认的问题。
没有我逐项确认，不得修改每日自动化 prompt、不得清理历史规则、不得改 content / knowledge / site 文件。
完成阶段性确认后，再按我确认的栏目/类别一项一项执行。
每一阶段完成后写 UTF-8 stage summary；最终写 UTF-8 closeout：
agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-closeout.md
回调度窗口：收口：WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance
```

## 1. 任务目标

为 V2 每日内容生产线建立一套统一、可执行、可验收的治理规范，覆盖：

1. 每日新闻 / 来源抓取流程。
2. 每个栏目产出的质量要求。
3. Obsidian 知识库卡片生成要求。
4. 历史规则中与 V2-only 生产口径冲突的内容清理方案。

本任务必须采用“确认优先”模式：先分类、先诊断、先列确认点；得到用户逐项确认后，才允许执行文件修改。

## 2. 非目标

- 第一阶段不直接修改每日自动化本体。
- 第一阶段不直接修改 `01-SiteV2/content/` 生产内容。
- 第一阶段不直接修改 `01-SiteV2/knowledge/` 已生成卡片。
- 第一阶段不修改 `01-SiteV2/site/` 页面。
- 不恢复 V1 网站或旧自动化。
- 不处理 `09-ai-news-radar`，除非用户后续明确纳入。
- 不用一次性大改替代逐项确认。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Workflow / Automation Agent | 梳理现有自动化、任务规则、冲突规则和执行顺序 |
| Intelligence Data Agent | 定义 Raw / Pool / Structured / Front / Deep Dive / Trend / Point / Knowledge 的质量标准 |
| PM Agent | 判断栏目产出是否匹配 V2 产品结构与用户任务 |
| Copy Agent | 判断栏目文案、标题、摘要和外部表达边界 |
| QA / Acceptance Agent | 复核是否仍混入 V1、旧 Raw 30-50、测试管线或 failed 任务规则 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/README.md`
4. `agent-workflow/governance/long-term-agent-dispatch-policy.md`
5. `agent-workflow/governance/automation-fallback-policy.md`
6. `agent-workflow/governance/quality-gates.md`
7. `agent-workflow/governance/skill-pattern-gate.md`
8. `agent-workflow/execution/dispatch-board.md`
9. `agent-workflow/progress.md`
10. `agent-workflow/feature_list.json`
11. `agent-workflow/product/source-intelligence.md`
12. `agent-workflow/product/intelligence-data-model.md`
13. `agent-workflow/product/signal-system.md`
14. `agent-workflow/product/the-point-model.md`
15. `agent-workflow/product/trend-model.md`
16. `agent-workflow/product/tag-taxonomy.md`
17. `agent-workflow/product/column-architecture.md`
18. `agent-workflow/product/COPY.md`
19. `01-SiteV2/README.md`
20. `01-SiteV2/knowledge/README.md`
21. `01-SiteV2/knowledge/09-Templates/`
22. `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`
23. `agent-workflow/reports/WSD-20260510-03-v2-daily-monitoring-automation-prompt-fix-closeout.md`
24. `agent-workflow/reports/WSD-20260510-05-v2-daily-monitoring-rerun-and-obsidian-review-closeout.md`
25. `agent-workflow/reports/WSD-20260510-07-v2-knowledge-first-curation-closeout.md`

## 5. 第一阶段必须先分类

第一阶段只输出分类诊断，不执行修改。必须按以下六类逐项整理，并向用户请求确认。

| 类别 | 必须回答的问题 | 用户确认后才允许做什么 |
|---|---|---|
| A. 每日抓取流程 | 来源池怎么分层？Raw 80-150 怎么达成？失败降级怎么写？AI HOT / follow-builders 等 M 级通道如何只作 source-router？ | 更新每日自动化 prompt、source registry 或 fallback policy |
| B. 内容漏斗质量 | Raw / Pool / Structured / Front Signal / Deep Dive / Trend / Point 各阶段最低标准是什么？数量、证据、字数、二搜、反证要求是什么？ | 更新内容质量规范、quality gate 或每日 run log 模板 |
| C. 栏目产出标准 | 今日要点、关键信号、机会解码、商业内参、Point 校准、Trend 背景各自输出什么、不输出什么？ | 更新栏目规范、内容 schema、站点数据生成口径 |
| D. 知识库生成规则 | 哪些内容进入 Obsidian？生成 Signal / Point / Case / Company / Trend / Opportunity / Source 卡的触发条件是什么？哪些只留在 content？ | 更新 `01-SiteV2/knowledge/README.md`、模板和 MOC 规则 |
| E. 历史冲突清理 | 哪些 V1、P0/P1、测试管线、failed 任务、旧 Raw 30-50 规则需要废止、归档或加“不得继承”说明？ | 修改 governance、handoff、dispatch-board、progress 中的冲突规则 |
| F. 验收与回填 | 每日自动化完成后，怎样证明可用？哪些 gate 必跑？哪些截图 / 人工判断可选？closeout 要写什么？ | 更新 closeout 模板、quality-gates 说明或调度验收口径 |

## 6. 阶段设计

### Stage 1：分类诊断与确认清单

只读现有文件，输出：

- 当前规则来源表。
- 冲突规则清单。
- 六大类别的建议规则草案。
- 每一类需要用户确认的问题。
- 建议执行顺序。

硬停顿：

- Stage 1 结束后必须等待用户确认。
- 不得进入 Stage 2。

### Stage 2：按确认项写规范

只处理用户确认的类别。每一类单独执行、单独总结：

- A 类确认后，更新抓取流程规范。
- B 类确认后，更新内容质量规范。
- C 类确认后，更新栏目产出规范。
- D 类确认后，更新知识库生成规范。
- E 类确认后，清理历史冲突规则。
- F 类确认后，更新验收和 closeout 模板。

硬停顿：

- 每做完一类，必须输出 stage summary，并等待用户是否继续下一类。

### Stage 3：自动化本体更新

仅当用户明确确认 A / B / F 已通过后，才允许更新每日自动化 prompt 或相关质量闸门。

必须保留：

- 每天 09:00。
- Raw 80-150，低信号或关键接口失败日可降级 50-80 并说明原因。
- AI HOT / follow-builders / HN / X / Reddit 等只作 M 级 discovery / source-router。
- Front Signal 二搜和 S/A/B 来源要求。
- Deep Dive 不硬凑。

### Stage 4：最终复核与收口

输出：

- 已确认类别。
- 已修改文件。
- 未确认类别。
- 保留冲突和风险。
- 已运行的 Quality Gates。
- 下一轮建议。

## 7. 允许改动范围

第一阶段允许：

- 新增阶段诊断报告：`agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage1.md`

用户确认后，按确认类别允许修改：

- `agent-workflow/governance/`
- `agent-workflow/product/`
- `agent-workflow/execution/`
- `agent-workflow/reports/`
- `agent-workflow/progress.md`
- `docs/agent-handoff.md`
- `agent-workflow/feature_list.json`
- `01-SiteV2/README.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/knowledge/README.md`
- `01-SiteV2/knowledge/09-Templates/`
- `C:\Users\86186\.codex\automations\v2-content-site-daily-update\automation.toml`，仅限用户确认后

## 8. 禁止改动范围

- 第一阶段不得改任何生产规则文件，只能新增 stage1 诊断报告。
- 不改 `01-SiteV2/site/` 页面。
- 不改 V2 已生成内容正文，除非后续用户单独确认内容修订。
- 不恢复旧 `04-Site`。
- 不处理 `09-ai-news-radar`。
- 不删除历史文件，只能先标记冲突、废止或建议归档。
- 不把用户未确认的类别合并执行。

## 9. 预期输出

第一阶段输出：

- `agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage1.md`
- 一份面向用户的逐项确认清单。

最终输出：

- 已确认类别对应的规范更新。
- 冲突规则清理记录。
- 自动化更新记录，若用户确认执行。
- `agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-closeout.md`

## 10. 质量闸门

第一阶段：

- 不要求跑站点同步。
- 必须确认 `feature_list.json` 仍可解析。

执行阶段：

- 修改自动化或脚本时，必须跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`。
- 修改内容质量规则时，必须说明是否需要补 `v2content --date=<date>`。
- 修改知识库模板时，必须检查 Markdown 文件存在、UTF-8 保存、双链入口可见。

## 11. 验收标准

- 用户能清楚看到六大类别的规则边界。
- 每一类都有“当前问题、建议规则、需要确认的问题、执行后会改哪些文件”。
- 未经用户确认的类别没有被执行。
- 旧 V1 / P0 / P1 / failed / test-only / Raw 30-50 等冲突规则被清楚标记，后续不会误继承。
- V2 每日自动化、栏目产出和 Obsidian 知识库之间的关系清晰：
  - `content/` 是生产漏斗。
  - `knowledge/` 是长期知识库。
  - `site/` 是前台展示。
  - `agent-workflow/` 是治理和验收账本。

## 12. 第一阶段给用户的确认方式

执行窗口第一阶段结束时，必须按以下格式向用户确认：

```text
我已完成 Stage 1 分类诊断。请你先确认第一类：

A. 每日抓取流程
- 我建议保留 / 修改 / 废止：
- 会影响：
- 不会影响：
- 需要你确认：

请回复：
确认 A
或
修改 A：<你的修改意见>
```

用户确认 A 后，再进入 B；以此类推。不得一次性要求用户确认全部。
