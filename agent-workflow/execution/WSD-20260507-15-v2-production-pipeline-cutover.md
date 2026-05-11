---
task_id: WSD-20260507-15-v2-production-pipeline-cutover
board_id: V2-13
status: ready
date: 2026-05-07
owner: V2 Platform / Dev Migration Agent / Workflow Agent / Intelligence Data Agent / QA Agent
type: production-cutover
automation_impact: v2-production-rebuild
encoding: UTF-8
---

# V2-13 生产线切换：V2 内容入库与同步闸门重建

## 0. 快速执行卡

- 看板编号：`V2-13`
- Task ID：`WSD-20260507-15-v2-production-pipeline-cutover`
- 任务类型：开发类 / 数据类 / 自动化类 / QA 类 / 生产切换类
- 派发单：`agent-workflow/execution/WSD-20260507-15-v2-production-pipeline-cutover.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-15-v2-production-pipeline-cutover-closeout.md`
- 调度口令：`收口：WSD-20260507-15-v2-production-pipeline-cutover`
- 是否可能影响自动化：旧自动化已停；本任务重建 V2 生产线

执行窗口最短启动提示词：

```text
执行任务：WSD-20260507-15-v2-production-pipeline-cutover
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260507-15-v2-production-pipeline-cutover.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260507-15-v2-production-pipeline-cutover-closeout.md。
回调度窗口：收口：WSD-20260507-15-v2-production-pipeline-cutover
```

## 1. 用户决策

用户明确决定：

- 不执行 `V2-7` 七日隔离验证，直接进入生产线。
- V1.0 网站不再更新。
- 老的自动化任务停止。
- 后续不再判断相关动作会不会对之前 V1 链路或旧自动化产生影响。
- 专注开发 V2.0 版。

本任务承接该决策，把 V2 算法、内容入库、同步闸门和网站数据路径纳入正式生产改造。旧 `ai-the-point` / `ai-2` / `ai-3` 不再作为兼容对象，只作为历史参考。

## 2. 任务目标

将 V2 内容生产链路接入正式生产线：

- V2 内容生成：覆盖 Raw 30-50、Pool 10-15、Structured 5-8、Front Signals 3、Deep Opportunity 0-1、Trend Context、Point Calibration、HeatEvidence。
- V2 Point Calibration：把旧 The Point 的独立频道口径改为观点校准素材。
- V2 统一同步闸门：支持 V2 内容资产、HeatEvidence、AIBriefIssue、关系检查、备份和回滚。
- 内容路径：明确 V2 生产内容写入路径，避免继续使用 test-only `signal-lab` 口径。
- 网站数据：明确 V2 数据如何进入 `04-Site/data/`，以及旧 V1 数据的保留 / 冻结 / 兼容策略。
- QA：完成生产切换前后的语法、关系、标签、同步、权限和回滚检查。

## 3. 非目标

- 不做 V2 首页和栏目页视觉实现。
- 不做会员支付、真实权限收费、PDF 下载。
- 不做 Netlify 发布，除非派发窗口获得用户明确允许。
- 不删除 V1 内容目录，但不以 V1 影响判断作为阻塞。
- 不回滚或删除不属于本任务的已有修改。

## 4. 必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/v2/v2-product-architecture-prd.md`
4. `agent-workflow/v2/v2-algorithm-source-architecture.md`
5. `agent-workflow/v2/v2-directory-content-architecture.md`
6. `agent-workflow/v2/v2-dev-workspace-baseline.md`
7. `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
8. `agent-workflow/v2/schemas/README.md`
9. `agent-workflow/v2/rules/README.md`
10. `04-Site/config/content-paths.json`
11. `04-Site/scripts/sync-data.mjs`
12. `agent-workflow/tools/unified-site-sync.mjs`

## 5. 允许改动范围

执行窗口必须先列出实际文件清单，再动手。原则上允许：

- `agent-workflow/governance/automation-fallback-policy.md`
- `agent-workflow/daily-run-log.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/signal-system.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/the-point-model.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/v2/`
- `06-content/v2/`
- `04-Site/config/content-paths.json`
- `04-Site/scripts/sync-data.mjs`
- `04-Site/scripts/check-relations.mjs`
- `04-Site/scripts/check-tags.mjs`
- `04-Site/scripts/check-point-quality.mjs`
- `agent-workflow/tools/unified-site-sync.mjs`
- `agent-workflow/tools/run-quality-gates.mjs`
- 相关自动化执行文档或提示词文件。

## 6. 禁止改动范围

- 不删除 V1 内容目录。
- 不直接重写 `04-Site/index.html`、`04-Site/css/styles.css`、`04-Site/js/app.js` 的页面视觉。
- 不提交 failed / abandoned / stopped V1 页面结果作为 V2 生产基础。
- 不把 `09-ai-news-radar/` 作为默认生产路径。
- 不把 P0-12 `signal-lab` 测试页当作正式 Signals 替代品。
- 不部署 Netlify，除非用户另行明确允许。

## 7. 强制执行顺序

### Stage A：生产切换计划

必须先输出 stage summary，包含：
- 生产路径选择。
- V2 生产线重建清单。
- 备份和回滚方案。
- 字段兼容策略。
- 需要保留的 V1 冻结数据。
- 风险分级。

若无法给出回滚方案，不得进入 Stage B。

### Stage B：自动化与内容路径改造

重建 V2 内容生成、观点校准和统一同步闸门口径。旧 `ai-2` / `ai-the-point` / `ai-3` 已暂停，不需要保持兼容。

必须明确：
- 新产物命名规则。
- Raw / Pool / Structured / Front Signal / Opportunity / Trend / Point / HeatEvidence / AIBriefIssue 的路径。
- 缺字段时是阻塞、降级还是留待人工复核。

### Stage C：同步与检查脚本改造

如需修改同步脚本，必须保证：
- V1 冻结数据可读。
- V2 新数据可入站。
- 关系检查覆盖 Signal / Point / Trend / Opportunity / HeatEvidence / AIBriefIssue。
- Tags 不无限膨胀。

### Stage D：本地验证

必须至少运行：

```powershell
node --check 04-Site/scripts/sync-data.mjs
node --check 04-Site/scripts/check-relations.mjs
node --check 04-Site/scripts/check-tags.mjs
node --check 04-Site/js/app.js
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如执行了内容同步，还必须运行并记录：

```powershell
node 04-Site/scripts/sync-data.mjs
node 04-Site/scripts/check-relations.mjs
node 04-Site/scripts/check-tags.mjs
```

### Stage E：closeout

Closeout 必须包含：
- 修改文件清单。
- 自动化影响说明。
- 回滚方式。
- 本地验证结果。
- 未解决风险。
- 是否建议进入 Netlify / GitHub 同步任务。

## 8. 验收标准

- 生产路径和自动化口径明确。
- V1 内容冻结边界不被破坏。
- V2 内容入库可以在正式路径运行。
- 统一同步闸门能识别 V2 缺字段 / 缺关系。
- 有可执行回滚方案。
- 质量检查通过或明确阻塞原因。
- 未经用户另行允许，不部署 Netlify。
