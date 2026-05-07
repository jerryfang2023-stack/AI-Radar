# V2 AI Brief Heatmap Premium Brief

状态：ready-for-dispatch  
建议任务：`V2-4A / WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan`

## 1. 来源

本 brief 来自用户提供的外部规划文档，已入库：

- `agent-workflow/v2/references/guanlan-ai-brief-heatmap-premium-plan.md`

## 2. 核心判断

该文档提出的方向适合作为 V2.0 产品架构的核心候选：

```text
Signals / Point / Opportunity / Trends
↓
统一转为 HeatEvidence
↓
聚合行业、岗位、流程、三元组热力
↓
生成 AI商业热力图
↓
沉淀为 AI商业内参
```

## 3. 产品结构

公开内容层保留四栏目：

- Signals：外部变化信号。
- Point：一线 builder 观点与实践碎片。
- Opportunity：商业机会观察。
- Trends：长期趋势观察。

增值产品层新增：

- 观澜AI商业内参。
- 核心模块：AI商业热力图。

## 4. 必须进入 PM 门禁的问题

- `AI内参` 是否作为新增一级栏目，还是会员 / 增值入口下的产品页。
- `AI商业热力图` 是周报、月报、还是二者都做。
- V1 四栏目如何转为 `HeatEvidence`，是否需要改现有内容 schema。
- 热力图是否进入公开前台，哪些部分需要会员或内参权限。
- 周度 / 月度内参是否增强付费理由、复访动力和销售可信度。
- 是否会增加过多页面、导航和内容运营成本。

## 5. 必须进入 Data / Algorithm 的问题

- `HeatEvidence` 统一证据模型。
- 行业、岗位、流程、三元组标签字典。
- `IndustryHeatCard` / `JobHeatCard` / `WorkflowHeatCard` / `HeatmapTripleCard`。
- 四栏目到 HeatEvidence 的转换规则。
- 热力评分、阶段判断、争议期和反证机制。
- `AIBriefIssue` weekly / monthly 结构。

## 6. 必须进入 Design / Copy 的问题

- `AI商业热力图` 不得做成普通榜单或泛仪表盘。
- `AI内参` 的视觉要更像周期性决策产品，而不是资讯栏目。
- 对外表达要保持克制，避免“确定机会”“立即行动”等过度承诺。
- 热力图详情页必须能展开证据来源，但不要像后台数据表。

## 7. 本任务边界

`V2-4A` 只做正式产品规划和门禁，不进入 Dev。

开发必须等待：

- `V2-2` 算法与来源架构明确 HeatEvidence 与评分规则。
- `V2-3` VI / Design Direction 明确内参和热力图视觉方向。
- `V2-4A` PM 门禁与模块决策表通过。
- `V2-5` 技术工作区策略完成。

