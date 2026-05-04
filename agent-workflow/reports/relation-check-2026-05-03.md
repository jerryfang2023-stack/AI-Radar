# Signal-Priority-Trend-Opportunity 关系检查

生成时间：2026/5/4 01:11:54

## 检查结论

- 硬错误：0
- 软提醒：10
- 当前数据：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 27 Opportunities

## 关系覆盖率

| 关系 | 覆盖 | 说明 |
| Priority -> Signal | 33/33 (100%) | 评分项是否能回到原始商业信号 |
| Priority -> Opportunity | 33/33 (100%) | 评分项是否能进入机会卡 |
| Priority -> Trend | 33/33 (100%) | 评分项是否被趋势模型吸收 |
| Signal -> Opportunity | 29/29 (100%) | 信号是否能落到机会方向 |
| Signal -> Trend | 29/29 (100%) | 信号是否被趋势线吸收 |
| Trend -> Signal | 13/13 (100%) | 趋势是否有原始 Signal 证据 |
| Trend -> Priority | 13/13 (100%) | 趋势是否引入评分证据 |
| Trend -> Opportunity | 13/13 (100%) | 趋势是否落到机会卡 |
| Point -> Signal | 24/24 (100%) | 一线观点是否能回到信号证据 |
| Point -> Trend | 21/24 (88%) | 一线观点是否进入趋势观察 |
| Point -> Opportunity | 24/24 (100%) | 一线观点是否能辅助机会判断 |
| Opportunity -> Priority | 22/27 (81%) | 机会卡是否有评分支撑 |
| Opportunity -> Signal | 22/27 (81%) | 机会卡是否有信号证据 |
| Opportunity -> Trend | 27/27 (100%) | 机会卡是否进入趋势网络 |

## 硬错误

无

## 软提醒

1. **Opportunity -> Priority** `20260427-01-AI招投标Agent`：机会卡没有评分证据：AI招投标Agent。
2. **Opportunity -> Signal** `20260427-01-AI招投标Agent`：机会卡没有关联 Signal：AI招投标Agent。
3. **Opportunity -> Priority** `20260429-01-企业AI工作流样板库`：机会卡没有评分证据：企业AI工作流样板库。
4. **Opportunity -> Signal** `20260429-01-企业AI工作流样板库`：机会卡没有关联 Signal：企业AI工作流样板库。
5. **Opportunity -> Priority** `20260427-02-AI客服质检与工单智能Agent`：机会卡没有评分证据：AI客服质检与工单智能Agent。
6. **Opportunity -> Signal** `20260427-02-AI客服质检与工单智能Agent`：机会卡没有关联 Signal：AI客服质检与工单智能Agent。
7. **Opportunity -> Priority** `20260427-03-AI商业洞察与销售赋能Agent`：机会卡没有评分证据：AI商业洞察与销售赋能Agent。
8. **Opportunity -> Signal** `20260427-03-AI商业洞察与销售赋能Agent`：机会卡没有关联 Signal：AI商业洞察与销售赋能Agent。
9. **Opportunity -> Priority** `20260428-03-行业专家知识Agent化`：机会卡没有评分证据：行业专家知识Agent化。
10. **Opportunity -> Signal** `20260428-03-行业专家知识Agent化`：机会卡没有关联 Signal：行业专家知识Agent化。

## 处理规则

- 硬错误需要 Dev/Data 立即修复，通常是 ID 或 slug 断链。
- 软提醒是运营复核项，不一定是错误，可能是新机会、新趋势或早期信号尚未形成闭环。
- Signal / Opportunity / Trend 的弱关联可能来自标签相似度，本检查只校验引用是否存在，不逐条要求双向完全一致。
- 每次运行同步脚本后，应再运行本检查，确认新增内容没有断链。
