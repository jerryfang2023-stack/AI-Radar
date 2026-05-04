# WSD-20260504-22-priority-engine-2-fast-track-implementation 派发单

日期：2026-05-04  
状态：ready  
优先级：P0 / highest  
调度窗口：当前主窗口  
牵头 Agent：`pm` / `data` / `dev`  
协作 Agent：`workflow` / `qa` / `copy`

## 1. 任务目标

将 Priority Engine 2.0 从“模型文档”推进到第一版可运行能力，合并完成四件事：

1. PM 确认产品边界。
2. 升级 `ai-2` 每日机会评分提示词，保留旧 30 分表兼容，新增 Priority Engine 2.0 拆解段。
3. Dev 实现 Judgment Node 第一版解析、数据落点和关系检查，不破坏现有同步。
4. QA 建立并执行评分解释、反证校准、非投资化表达和自动化影响验收。

执行目标是尽快开发并进入可运行 / 可预览状态。若 Netlify 预览部署已可用，应在完成后衔接预览部署；如 Netlify 授权或环境未就绪，则必须在 closeout 中写明上线阻塞点，并提供本地验证结果。

## 2. 合并来源

以下任务不再单独执行，统一合并进本任务：

- `WSD-20260504-18-priority-engine-2-pm-boundary`
- `WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade`
- `WSD-20260504-20-judgment-node-dev-plan`
- `WSD-20260504-21-priority-engine-2-qa-criteria`

## 3. 必读文件

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/governance/quality-gates.md`
5. `agent-workflow/governance/automation-fallback-policy.md`
6. `agent-workflow/execution/WSD-20260504-22-priority-engine-2-fast-track-implementation.md`
7. `agent-workflow/product/priority-engine-2.md`
8. `agent-workflow/reports/priority-engine-2-2026-05-04.md`
9. `agent-workflow/execution/PLAN-priority-engine-2-2026-05-04.md`
10. `agent-workflow/prd/active/PRD-003-opportunities-engine.md`
11. `agent-workflow/prd/active/PRD-004-trends-model.md`
12. `agent-workflow/product/opportunity-priority-schema.md`
13. `agent-workflow/product/relation-check-schema.md`
14. `agent-workflow/product/COPY.md`
15. `提示词/AI机会评分与趋势判断系统V4.0.md`
16. `04-Site/scripts/sync-data.mjs`
17. `04-Site/scripts/check-relations.mjs`
18. `04-Site/config/content-paths.json`

## 4. 实施范围

### 4.1 PM 边界确认

- 确认 Priority Engine 2.0 是后台判断能力，不新增前台栏目。
- 确认 Judgment Node 是后台判断节点，不是公司榜单、投资建议或单条新闻评分。
- 确认对外只通过 Daily Brief、Trends、Opportunities 展示状态、证据边界和反证观察。
- 确认旧 30 分表短期保留，避免破坏现有同步。

### 4.2 ai-2 提示词升级

- 更新 `提示词/AI机会评分与趋势判断系统V4.0.md`。
- 保留旧 30 分表。
- 新增 Priority Engine 2.0 拆解段：
  - Judgment Node
  - 证据质量
  - 需求真实度
  - 趋势动量
  - The Point 观点智能
  - 机会适配度
  - 反证强度
  - 7 / 30 / 90 天回测提示
- The Point 不作为事实证据直接加权，只作为观点共识、分歧和边界信号。

### 4.3 Dev 第一版实现

在不破坏现有网站和同步兼容的前提下，实现第一版 Judgment Node 入站能力：

- 扩展 `sync-data.mjs`，能解析或派生 Judgment Node 相关字段。
- 扩展 `radar-data.json` / `radar-data.js` 输出结构中的兼容字段。
- 扩展 `check-relations.mjs`，至少检查 Priority Row -> Judgment Node 的基础关系完整性。
- 如当前历史 Markdown 尚无 2.0 字段，应设计兼容降级：从旧评分标题、赛道、Opportunity / Trend 关系派生候选 Judgment Node，并在报告中标记为 `derived`。
- 不强制改历史内容源，不批量重写旧 Markdown。

建议第一版字段：

```json
{
  "judgmentId": "",
  "judgmentTitle": "",
  "judgmentNodeSource": "explicit | derived",
  "priorityStatusV2": "priority_verify | active_watch | early_watch | cautious | downgrade",
  "judgmentType": "方向升温 | 方向分化 | 机会前移 | 需求验证 | 反证增强 | 暂缓关注",
  "evidenceQualityScore": null,
  "demandRealityScore": null,
  "momentumScore": null,
  "pointIntelligenceScore": null,
  "opportunityFitScore": null,
  "counterEvidenceScore": null,
  "reviewStatus": "pending_7d_review"
}
```

### 4.4 QA 验收

- 抽查 5 条 Priority / Opportunity / Trend 的 Judgment Node 结果。
- 检查旧 30 分表仍兼容。
- 检查对外文案不出现“做多 / 做空 / 必投 / 确定性机会 / 投资建议”。
- 检查 The Point 未被当作事实证据直接加权。
- 检查关系检查硬错误为 0；如有软提醒，说明原因和后续处理。

## 5. 允许改动范围

- `agent-workflow/product/priority-engine-2.md`
- `agent-workflow/prd/active/PRD-003-opportunities-engine.md`
- `agent-workflow/prd/active/PRD-004-trends-model.md`
- `提示词/AI机会评分与趋势判断系统V4.0.md`
- `04-Site/scripts/sync-data.mjs`
- `04-Site/scripts/check-relations.mjs`
- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`
- `agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md`
- 必要的 QA / 关系检查报告

如确需改 `04-Site/js/app.js` 展示 2.0 状态，必须保持普通前台克制表达，不出现内部字段名。

## 6. 禁止改动范围

- 不新增普通前台栏目。
- 不删除旧 30 分评分表。
- 不批量重写历史内容源。
- 不修改 `ai-3` 统一同步闸门，除非只补文档提醒；真正闸门改造另派任务。
- 不输出投资建议、公司排行榜或确定性判断。
- 不使用“做多 / 做空 / 必投 / 稳赚 / 确定性机会”等表达。

## 7. 必跑检查

- `node --check 04-Site/scripts/sync-data.mjs`
- `node --check 04-Site/scripts/check-relations.mjs`
- `node --check 04-Site/js/app.js`
- `node 04-Site/scripts/sync-data.mjs`
- `node 04-Site/scripts/check-relations.mjs`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- UTF-8 读取更新后的提示词和报告，确认中文无乱码。

如改动会影响标签，还需运行：

- `node 04-Site/scripts/check-tags.mjs`

如已具备 Netlify 预览部署条件，完成后衔接预览部署或说明复用哪个预览任务；如不具备，写明阻塞原因。

## 8. 自动化影响

本任务可能影响自动化任务：

- `ai-2`：有影响，必须更新每日机会评分提示词。
- `ai-the-point`：本任务不强制改，但需说明后续轻量增强项。
- `ai-3`：短期不改闸门；如果 Judgment Node 字段进入同步结果，closeout 中必须说明 ai-3 后续需要补充的检查口径。

## 9. 收口文件

完成后必须生成 UTF-8 收口文件：

`agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md`

收口文件必须写清：

- 任务状态：done / partial / blocked
- PM 边界确认结论
- ai-2 提示词改了什么
- Dev 实现了哪些字段、脚本和兼容策略
- QA 抽查了哪些样本
- 运行了哪些检查
- 哪些检查未运行及原因
- 是否已进入可运行 / 可预览状态
- 如未上线，阻塞点是什么
- 是否影响 `ai-the-point`、`ai-2`、`ai-3`
- 是否可以由主调度窗口验收
