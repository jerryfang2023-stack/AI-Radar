# Signal-Priority-Trend-Opportunity 关系检查

生成时间：2026/5/2 22:51:04

## 检查结论

- 硬错误：0
- 软提醒：23
- 当前数据：22 Signals / 26 Priority Rows / 10 Trends / 23 Opportunities

## 关系覆盖率

| 关系 | 覆盖 | 说明 |
| Priority -> Signal | 22/26 (85%) | 评分项是否能回到原始商业信号 |
| Priority -> Opportunity | 26/26 (100%) | 评分项是否能进入机会卡 |
| Priority -> Trend | 26/26 (100%) | 评分项是否被趋势模型吸收 |
| Signal -> Opportunity | 22/22 (100%) | 信号是否能落到机会方向 |
| Signal -> Trend | 12/22 (55%) | 信号是否被趋势线吸收 |
| Trend -> Signal | 6/10 (60%) | 趋势是否有原始 Signal 证据 |
| Trend -> Priority | 10/10 (100%) | 趋势是否引入评分证据 |
| Trend -> Opportunity | 10/10 (100%) | 趋势是否落到机会卡 |
| Opportunity -> Priority | 18/23 (78%) | 机会卡是否有评分支撑 |
| Opportunity -> Signal | 23/23 (100%) | 机会卡是否有信号证据 |
| Opportunity -> Trend | 23/23 (100%) | 机会卡是否进入趋势网络 |

## 硬错误

无

## 软提醒

1. **Priority -> Signal** `2026-04-30-AI营销平台（Hightouch）`：评分项缺少 relatedSignalId，无法回到原始 Signal。
2. **Priority -> Signal** `2026-04-30-AI基础设施服务并购（Cognizant）`：评分项缺少 relatedSignalId，无法回到原始 Signal。
3. **Priority -> Signal** `2026-04-30-AI增长Agent（LeapMind）`：评分项缺少 relatedSignalId，无法回到原始 Signal。
4. **Priority -> Signal** `2026-05-01-AI增长Agent（LeapMind）`：评分项缺少 relatedSignalId，无法回到原始 Signal。
5. **Signal -> Trend** `2026-04-29-signal-2`：Signal 暂未进入任何 Trend：Parallel Web Systems 融资1亿美元，估值20亿美元，押注AI Agent网页执行基础设施。
6. **Signal -> Trend** `2026-04-29-signal-4`：Signal 暂未进入任何 Trend：LeapMind Growth获CMC资本领投，AI原生增长Agent切入营销执行链路。
7. **Signal -> Trend** `2026-04-29-signal-6`：Signal 暂未进入任何 Trend：OpenAI 推出Workspace Agents，并将最新模型和Codex接入AWS Bedrock，企业Agent进入平台化分发阶段。
8. **Signal -> Trend** `2026-04-30-signal-2`：Signal 暂未进入任何 Trend：Box 发布 Box Automate，将企业文档工作流升级为 AI Agent 流程自动化。
9. **Signal -> Trend** `2026-04-30-signal-3`：Signal 暂未进入任何 Trend：Vanta ARR 超 3 亿美元，“Agentic Trust Platform”受益于企业 Shadow AI 治理需求。
10. **Signal -> Trend** `2026-05-01-signal-1`：Signal 暂未进入任何 Trend：Netomi完成1.1亿美元C轮融资，押注企业客服AI Agent。
11. **Signal -> Trend** `2026-05-01-signal-4`：Signal 暂未进入任何 Trend：Mizzen Insight上线4个月获300家企业客户，AI用户研究平台完成近千万美元融资。
12. **Signal -> Trend** `2026-05-01-signal-5`：Signal 暂未进入任何 Trend：Loopit两个月近200万注册用户，AI互动内容平台累计融资近1亿美元。
13. **Signal -> Trend** `2026-05-01-signal-6`：Signal 暂未进入任何 Trend：星动纪元获超2亿美元融资，具身智能机器人开始批量进入物流中心。
14. **Signal -> Trend** `2026-05-02-signal-6`：Signal 暂未进入任何 Trend：ARI 被 Meta 收购：具身智能控制栈与评测层进入大厂并购加速期。
15. **Trend -> Signal** `AI用户研究`：Trend 缺少 relatedSignalIds，趋势缺少原始信号证据。
16. **Trend -> Signal** `具身智能/机器人`：Trend 缺少 relatedSignalIds，趋势缺少原始信号证据。
17. **Trend -> Signal** `AI增长`：Trend 缺少 relatedSignalIds，趋势缺少原始信号证据。
18. **Trend -> Signal** `AI工具类`：Trend 缺少 relatedSignalIds，趋势缺少原始信号证据。
19. **Opportunity -> Priority** `20260427-01-AI招投标Agent`：机会卡没有评分证据：AI招投标Agent。
20. **Opportunity -> Priority** `20260429-01-企业AI工作流样板库`：机会卡没有评分证据：企业AI工作流样板库。
21. **Opportunity -> Priority** `20260427-02-AI客服质检与工单智能Agent`：机会卡没有评分证据：AI客服质检与工单智能Agent。
22. **Opportunity -> Priority** `20260427-03-AI商业洞察与销售赋能Agent`：机会卡没有评分证据：AI商业洞察与销售赋能Agent。
23. **Opportunity -> Priority** `20260428-03-行业专家知识Agent化`：机会卡没有评分证据：行业专家知识Agent化。

## 处理规则

- 硬错误需要 Dev/Data 立即修复，通常是 ID 或 slug 断链。
- 软提醒是运营复核项，不一定是错误，可能是新机会、新趋势或早期信号尚未形成闭环。
- Signal / Opportunity / Trend 的弱关联可能来自标签相似度，本检查只校验引用是否存在，不逐条要求双向完全一致。
- 每次运行同步脚本后，应再运行本检查，确认新增内容没有断链。
