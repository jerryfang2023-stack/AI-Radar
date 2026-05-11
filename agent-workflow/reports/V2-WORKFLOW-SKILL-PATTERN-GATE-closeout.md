# V2-WORKFLOW-SKILL-PATTERN-GATE Closeout

日期：2026-05-10  
状态：accepted / skill-pattern-gate-ready  
owner：`workflow` / `pm`

## 1. 任务来源

用户要求学习 Google Cloud Tech / Lavi Nigam《5 Agent Skill design patterns every ADK developer should know》，并执行对观澜 AI 工作方式、任务分配和开发质量的升级。

## 2. 已完成

- 新增 `agent-workflow/governance/skill-pattern-gate.md`。
- 将五类 Skill Pattern 写入观澜 AI 调度闸门：
  - Tool Wrapper
  - Generator
  - Reviewer
  - Inversion
  - Pipeline
- 更新 `agent-workflow/execution/TASK-window-dispatch-template.md`：
  - 快速执行卡新增 Skill Pattern、Pattern 顺序、硬停顿、Reviewer 字段。
  - 新增 `7S. Skill Pattern Gate`。
  - 必跑检查新增 Skill Pattern Gate。
- 更新 `agent-workflow/v2/v2-workflow-skill-graph.md`：
  - 增加 Skill Pattern 路由。
  - 明确后续派发必须标注 Pattern、顺序、硬停顿和 Reviewer 证据。
- 更新 `agent-workflow/governance/README.md`：
  - 将 `skill-pattern-gate.md` 加入治理文件地图。

## 3. 新规则摘要

后续任务必须标注至少一种 Skill Pattern。

常见组合：

| 任务类型 | Pattern |
|---|---|
| 页面质感 / 全站 UI / VI | Tool Wrapper + Inversion + Pipeline + Reviewer |
| 文案审查 | Tool Wrapper + Generator + Reviewer |
| 产品功能 / 新模块 | Inversion + Reviewer + Generator |
| 新闻源 / 内容自动化 | Tool Wrapper + Pipeline + Reviewer |
| 内容长文 / 商业内参 | Generator + Reviewer + Pipeline |
| 部署 / GitHub / Netlify | Pipeline + Reviewer |
| 调度 / 收口 / 治理 | Generator + Reviewer |

## 4. 质量提升点

- 派发任务时先确定执行模式，减少长提示词堆叠。
- 页面和产品任务必须先诊断 / 确认，降低直接开发带来的返工。
- Reviewer 与实现职责拆开，避免自验自收。
- closeout 必须交付 pattern 证据，不再只写“完成了”。
- 自动化和部署任务必须写阶段顺序、失败降级和验收证据。

## 5. 边界

- 未修改 V2 网站页面。
- 未修改内容库和每日自动化本体。
- 未新增临时 agent。
- 未安装外部 skill / repo。
- 未做 Netlify deploy。

## 6. 验证

- `agent-workflow/feature_list.json` JSON 解析通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告：`agent-workflow/reports/quality-gates-syntax-2026-05-09-20260509-182402.md`。

## 7. 后续要求

从下一次派发开始，执行窗口必须读取：

- `agent-workflow/governance/skill-pattern-gate.md`
- 当前派发单中的 `7S. Skill Pattern Gate`

调度中枢收口时，先验收 Pattern 是否匹配任务类型，再验收质量闸门。
