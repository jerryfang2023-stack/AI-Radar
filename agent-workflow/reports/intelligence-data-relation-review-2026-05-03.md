# 2026-05-03 Intelligence Data 关系软提醒收口报告

## 执行身份

本轮按升级后的 Intelligence Data Agent 执行。

## 输入

- `agent-workflow/reports/relation-check-latest.md`
- `04-Site/data/radar-data.json`
- `01-Signals/`
- `02-Scoring/`
- `03-Trends/AI趋势总表.md`
- `07-Opportunities/`

## 本轮处理

### 已自动收口

1. Priority -> Signal
   - 修复前：29/33
   - 修复后：33/33
   - 处理方式：在 `sync-data.mjs` 中补充跨日期同产品/代表案例回链逻辑。
   - 典型修复：
     - 04-30 Hightouch 评分回链 04-29 Hightouch Signal。
     - 04-30 Cognizant 评分回链 04-29 Cognizant Signal。
     - 04-30 / 05-01 LeapMind 评分回链 04-29 LeapMind Signal。

2. Signal -> Trend
   - 修复前：19/29
   - 修复后：29/29
   - 处理方式：趋势吸收 Signal 时，不只按赛道名精确匹配，也参考评分项、趋势具体产品和赛道别名。

3. Trend -> Signal
   - 修复前：9/13
   - 修复后：13/13
   - 处理方式：AI用户研究、具身智能/机器人、AI增长、AI工具类等趋势通过具体产品证据吸收对应 Signal。

### 保留软提醒

Opportunity -> Priority 仍有 5 条软提醒：

| Opportunity | 处理结论 |
|---|---|
| AI招投标Agent | 早期观察机会，暂无独立评分项；保留，不硬绑。 |
| 企业AI工作流样板库 | 方法/样板库型机会，和企业Agent工作平台、企业文档流程 Agent 有重叠；建议后续 PM/Data 判断是否合并或降级为方法资产。 |
| AI客服质检与工单智能Agent | 与 AI企业客服执行Agent、AI语音客服首轮分流助手重叠；建议后续合并证据或补一条专门评分。 |
| AI商业洞察与销售赋能Agent | 与 AI营销Agent、AI用户研究Agent、中小商家AI营销对话平台存在交叉；建议保留观察，等待销售赋能独立信号。 |
| 行业专家知识Agent化 | 与专业服务AI、企业知识工作流存在交叉；建议保留观察，后续若出现专家知识库/顾问工作流评分再补证据。 |

上述 5 条不做强行评分绑定，原因是当前没有明确 Priority Row 可作为直接证据。为了关系检查“清零”而硬绑，会降低判断资产可信度。

## 验证结果

已顺序运行：

```powershell
node --check 04-Site/scripts/sync-data.mjs
node --check 04-Site/scripts/check-relations.mjs
node --check 04-Site/scripts/check-point-quality.mjs
node 04-Site/scripts/sync-data.mjs
node 04-Site/scripts/check-relations.mjs
node 04-Site/scripts/check-point-quality.mjs
```

最终关系检查：

- 硬错误：0
- 软提醒：5
- Priority -> Signal：33/33
- Signal -> Trend：29/29
- Trend -> Signal：13/13
- Opportunity -> Priority：22/27

## 后续建议

1. 对 5 张无评分证据的早期机会卡进行 PM/Data 合并评审。
2. 若继续保留，建议在机会卡中标记为 `watch` 或补充“暂无 Priority 评分”的运营说明。
3. 若合并，应保留旧 slug 的跳转或在报告中记录迁移关系。
