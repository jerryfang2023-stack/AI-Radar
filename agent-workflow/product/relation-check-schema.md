# Signal-Priority-Trend-Opportunity 关系检查规范

更新时间：2026-05-02  
Owner：Data Agent / QA Agent / Dev Agent  
状态：已落地为脚本

## 1. 目标

观澜AI的数据不是四个孤立栏目，而是一张证据网络：

```text
Signal -> Priority -> Trend -> Opportunity
Signal -> Trend
Signal -> Opportunity
Opportunity -> Priority
Opportunity -> Trend
```

关系检查的目标不是追求所有弱关联完全双向一致，而是确认：

- 没有引用不存在的 ID。
- 评分项能进入机会卡。
- 趋势能接入评分证据。
- 机会卡能找到信号、趋势和评分支撑。
- 新增内容如果还没有形成闭环，能被及时发现。

## 2. 检查对象

### Signal

关键字段：

- `id`
- `track`
- `relatedOpportunityIds`

检查：

- Signal 是否落到 Opportunity。
- Signal 是否被至少一个 Trend 吸收。
- Signal 指向的 Opportunity ID 是否存在。

### Priority

即后台评分表 `scoring.rows`。

关键字段：

- `id`
- `relatedSignalId`
- `relatedOpportunityId`
- `opportunitySlug`
- `opportunityTitle`

检查：

- Priority 是否能回到原始 Signal。
- Priority 是否能进入 Opportunity。
- Priority 是否被 Trend 纳入评分证据。
- Priority 指向的 ID 是否存在。

### Trend

关键字段：

- `track`
- `relatedSignalIds`
- `relatedScoringIds`
- `relatedOpportunityIds`

检查：

- Trend 是否有原始 Signal 证据。
- Trend 是否接入 Priority 评分证据。
- Trend 是否落到 Opportunity。
- Trend 指向的 ID 是否存在。

### Opportunity

关键字段：

- `id`
- `relatedScoringIds`
- `priorityRowId`
- `relatedSignalIds`
- `relatedTrendTracks`

检查：

- Opportunity 是否有评分证据。
- Opportunity 是否有 Signal 证据。
- Opportunity 是否进入 Trend 网络。
- `priorityRowId` 是否存在于 `relatedScoringIds`。

## 3. 错误等级

### 硬错误

必须修复。

- 引用了不存在的 Signal ID。
- 引用了不存在的 Priority ID。
- 引用了不存在的 Opportunity ID。
- 引用了不存在的 Trend track。

### 软提醒

需要 Data Agent / QA Agent 判断，不一定是错误。

- Priority 缺少 `relatedSignalId`。
- Signal 暂未进入 Trend。
- Trend 缺少 Signal 证据。
- Opportunity 暂无评分证据。

## 4. 执行方式

每次运行同步后执行：

```bash
node 04-Site/scripts/check-relations.mjs
```

输出：

- `agent-workflow/reports/relation-check-latest.md`
- `agent-workflow/reports/relation-check-YYYY-MM-DD.md`

## 5. 当前基线

截至 2026-05-02：

- 硬错误：0
- Priority -> Opportunity：100%
- Priority -> Trend：100%
- Signal -> Opportunity：100%
- Trend -> Priority：100%
- Trend -> Opportunity：100%

当前主要待优化项：

- 4 条 Priority 缺少原始 Signal。
- 10 条 Signal 尚未进入 Trend。
- 4 条 Trend 缺少原始 Signal 证据。
- 5 张 Opportunity 暂无评分证据。
