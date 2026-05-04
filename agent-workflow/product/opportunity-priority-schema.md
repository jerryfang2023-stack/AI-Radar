# Opportunities 与 Priority Engine 关系规范

更新时间：2026-05-02  
Owner：Data Agent  
状态：已落地到同步脚本

## 1. 目标

`Scoring` 不再作为普通前台的独立栏目，而是作为 `Opportunities` 的 Priority Engine。

关系目标：

- scoring 项负责回答：这个机会方向当前证据强度如何。
- opportunity 卡负责回答：这个方向为什么是机会、适合谁、证据是什么、风险在哪里。
- signal 和 trend 负责提供证据来源和持续变化。

## 2. Scoring Row 新增字段

同步后，每个 scoring row 应包含：

- `rawName`：评分表原始名称。
- `opportunityName`：去掉括号公司名后的机会方向。
- `representativeCase`：括号中的代表公司、产品或事件。
- `relatedOpportunityId`：匹配到的网站机会卡内部 ID。
- `opportunityId`：机会卡 frontmatter 中的稳定 ID。
- `opportunitySlug`：机会卡详情页 URL slug。
- `opportunityTitle`：匹配到的机会卡标题。
- `opportunityMatchScore`：匹配置信度分数。
- `opportunityMatchReason`：匹配原因，当前包括 `rule`、`title`、`taxonomy`。
- `opportunityMatchStatus`：`matched` 或 `needs-opportunity`。

## 3. Opportunity Card 新增字段

同步后，每张机会卡应包含：

- `relatedScoringIds`：关联的 scoring row ID。
- `priorityRows`：关联评分记录摘要。
- `priorityScore`：当前最高或最有代表性的机会评分。
- `priorityScoreDate`：评分日期。
- `priorityVerdict`：评分判断。
- `priorityRowId`：主评分记录 ID。
- `priorityRank`：在已评分机会中的排序。
- `representativeCases`：由评分项和机会卡案例合并后的代表案例。

## 4. 匹配顺序

当前采用三层匹配：

1. **规则匹配**：对已知高频机会方向建立强规则，例如 Amazon Quick -> 企业Agent工作平台、Haast/Vanta -> Agent治理与权限审计服务。
2. **标题匹配**：比较 scoring 的 `opportunityName` 与 opportunity 的 `title`。
3. **标签/赛道匹配**：通过 tracks、industries、functions、scenarios、capabilities 计算重合度。

匹配分数低于阈值时，不强行归属，而是标记为 `needs-opportunity`。

## 5. 公司名处理规则

- 公司名、产品名、并购事件只进入 `representativeCase` 或代表案例。
- 机会卡主标题必须是机会方向，不使用公司名作为标题。
- 如果 scoring 名称为 `AI工程仿真（JuliaHub）`，则：
  - `opportunityName = AI工程仿真`
  - `representativeCase = JuliaHub`
  - `opportunityTitle = AI工程仿真软件`

## 6. 当前同步结果

截至 2026-05-02：

- scoring rows：26
- matched：26
- unmatched：0
- opportunities with score：18
- opportunities without score：5

## 7. 后续规则

- 每次新增 scoring 文档后，同步脚本自动生成关系。
- 若出现 `needs-opportunity`，Data Agent 需要判断是新建机会卡，还是补充匹配规则。
- QA Agent 每轮发布前抽查至少 10 条 scoring -> opportunity 关系。

