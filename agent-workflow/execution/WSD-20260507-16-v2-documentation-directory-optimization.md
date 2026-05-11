---
task_id: WSD-20260507-16-v2-documentation-directory-optimization
board_id: V2-DOC
status: ready
date: 2026-05-07
owner: Workflow Agent / PM Agent / Dev Agent
type: documentation-architecture
automation_impact: none-v2-only
encoding: UTF-8
---

# V2-DOC 01-WaveSight 文档目录优化

## 0. 快速执行卡

- 看板编号：`V2-DOC`
- Task ID：`WSD-20260507-16-v2-documentation-directory-optimization`
- 任务类型：治理类 / 文档架构类
- 派发单：`agent-workflow/execution/WSD-20260507-16-v2-documentation-directory-optimization.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-16-v2-documentation-directory-optimization-closeout.md`
- 调度口令：`收口：WSD-20260507-16-v2-documentation-directory-optimization`
- 是否可能影响自动化：旧自动化已停；不按 V1 影响口径判断

执行窗口最短启动提示词：

```text
执行任务：WSD-20260507-16-v2-documentation-directory-optimization
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260507-16-v2-documentation-directory-optimization.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260507-16-v2-documentation-directory-optimization-closeout.md。
回调度窗口：收口：WSD-20260507-16-v2-documentation-directory-optimization
```

## 1. 任务目标

优化 `01-WaveSight` 项目文档目录，让 V2.0 开发窗口能快速找到正确文件，减少历史 V1 文档、测试文档、派发单、closeout 和生产规范混杂造成的认知成本。

必须输出：
- 当前文档目录盘点。
- V2-only 文档目录目标结构。
- 可移动 / 不移动 / 只建索引 / 归档候选清单。
- README / index 入口设计。
- 后续如需移动文件的安全执行方案。

## 2. 非目标

- 不移动生产内容文件。
- 不删除历史文件。
- 不重命名已被任务、closeout、handoff 引用的文件。
- 不修改 `04-Site`。
- 不修改内容同步脚本。

## 3. 必须读取

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/agent-handoff.md`
4. `agent-workflow/execution/dispatch-board.md`
5. `agent-workflow/v2/v2-directory-content-architecture.md`
6. `agent-workflow/v2/v2-product-architecture-prd.md`
7. `agent-workflow/progress.md`
8. `agent-workflow/feature_list.json`

## 4. 允许改动范围

- `docs/README.md`
- `agent-workflow/v2/v2-documentation-directory-architecture.md`
- `agent-workflow/reports/WSD-20260507-16-v2-documentation-directory-optimization-closeout.md`
- 必要时可新增各目录下的 `README.md`

## 5. 禁止改动范围

- 不移动或删除任何既有文件。
- 不改 `04-Site/`。
- 不改 V1 历史内容目录。
- 不改自动化配置。
- 不改 Git 历史。

## 6. 建议优化方向

### A. 建立入口层

- `docs/README.md`：项目文档入口。
- `docs/agent-handoff.md`：最新接手状态。
- `AGENTS.md`：长期规则。

### B. 建立 V2 生产规范层

集中在 `agent-workflow/v2/`：
- 产品架构。
- 算法与来源。
- VI / 设计方向。
- 内容目录。
- 生产线切换。
- 页面母版。
- 数据 schema。
- Copy / Editorial。

### C. 保留执行与报告层

- `agent-workflow/execution/` 只放派发单和执行提示词。
- `agent-workflow/reports/` 只放 closeout、stage summary、quality gate 和验收报告。

### D. 历史层只做索引

V1 历史文档不搬动，先通过 README 或 index 标记：
- accepted historical
- failed / void / stopped
- abandoned / superseded-by-v2
- test-only archived

## 7. 验收标准

- 新窗口能通过 `docs/README.md` 找到 V2 当前主线。
- 明确哪些目录是 V2 当前生产开发目录，哪些是历史参考。
- 不破坏任何现有路径引用。
- 运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并记录报告。
