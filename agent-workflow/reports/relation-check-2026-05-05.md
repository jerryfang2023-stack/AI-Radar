# Signal-Priority-Trend-Opportunity 关系检查

生成时间：2026/5/5 20:17:18

## 检查结论

- 硬错误：0
- 软提醒：27
- 当前数据：39 Signals / 45 Priority Rows / 22 Judgment Nodes / 13 Trends / 44 Points / 28 Opportunities

## 关系覆盖率

| 关系 | 覆盖 | 说明 |
| Priority -> Signal | 43/45 (96%) | 评分项是否能回到原始商业信号 |
| Priority -> Judgment Node | 45/45 (100%) | 评分项是否进入后台判断节点 |
| Priority -> Opportunity | 45/45 (100%) | 评分项是否能进入机会卡 |
| Priority -> Trend | 38/45 (84%) | 评分项是否被趋势模型吸收 |
| Signal -> Opportunity | 39/39 (100%) | 信号是否能落到机会方向 |
| Signal -> Trend | 33/39 (85%) | 信号是否被趋势线吸收 |
| Trend -> Signal | 13/13 (100%) | 趋势是否有原始 Signal 证据 |
| Trend -> Priority | 13/13 (100%) | 趋势是否引入评分证据 |
| Trend -> Opportunity | 13/13 (100%) | 趋势是否落到机会卡 |
| Point -> Signal | 44/44 (100%) | 一线观点是否能回到信号证据 |
| Point -> Trend | 30/44 (68%) | 一线观点是否进入趋势观察 |
| Point -> Opportunity | 32/44 (73%) | 一线观点是否能辅助机会判断 |
| Judgment Node -> Priority | 22/22 (100%) | 判断节点是否有评分来源 |
| Judgment Node -> Signal | 22/22 (100%) | 判断节点是否能回到事实信号 |
| Judgment Node -> Trend | 22/22 (100%) | 判断节点是否进入趋势网络 |
| Judgment Node -> Opportunity | 22/22 (100%) | 判断节点是否落到机会卡 |
| Opportunity -> Priority | 22/28 (79%) | 机会卡是否有评分支撑 |
| Opportunity -> Signal | 22/28 (79%) | 机会卡是否有信号证据 |
| Opportunity -> Trend | 28/28 (100%) | 机会卡是否进入趋势网络 |

## 硬错误

无

## 软提醒

1. **Priority -> Trend** `2026-05-04-企业文档与财务流程Agent（Sage）`：评分项暂未被任何 Trend 纳入趋势证据。
2. **Priority -> Trend** `2026-05-05-AI Agent基础设施服务（Claude Code auto mode）`：评分项暂未被任何 Trend 纳入趋势证据。
3. **Priority -> Trend** `2026-05-05-AI基础设施托管服务（Crabbox 环境租赁）`：评分项暂未被任何 Trend 纳入趋势证据。
4. **Priority -> Signal** `2026-05-05-AI记忆层基础设施（GBrain 图谱化上下文）`：评分项缺少 relatedSignalId，无法回到原始 Signal。
5. **Priority -> Trend** `2026-05-05-AI记忆层基础设施（GBrain 图谱化上下文）`：评分项暂未被任何 Trend 纳入趋势证据。
6. **Priority -> Trend** `2026-05-05-AI工程仿真软件（Waymo 工程化配套）`：评分项暂未被任何 Trend 纳入趋势证据。
7. **Priority -> Signal** `2026-05-05-AI Agent基础设施服务（经营指标叙事抬头）`：评分项缺少 relatedSignalId，无法回到原始 Signal。
8. **Priority -> Trend** `2026-05-05-AI Agent基础设施服务（经营指标叙事抬头）`：评分项暂未被任何 Trend 纳入趋势证据。
9. **Priority -> Trend** `2026-05-05-AICoding驱动一人公司工具链（在线 IDE 平台化外溢）`：评分项暂未被任何 Trend 纳入趋势证据。
10. **Signal -> Trend** `2026-05-04-signal-6`：Signal 暂未进入任何 Trend：Sage 收购 Doyen AI：财务工作流的“文档处理→流程执行”正在平台化。
11. **Signal -> Trend** `2026-05-05-signal-1`：Signal 暂未进入任何 Trend：Claude Code 发布 auto mode：用更可控的方式降低权限确认摩擦。
12. **Signal -> Trend** `2026-05-05-signal-2`：Signal 暂未进入任何 Trend：Crabbox 0.5.0 发布：桌面/浏览器租赁 + WebVNC 让 Agent 更容易复现与修复。
13. **Signal -> Trend** `2026-05-05-signal-4`：Signal 暂未进入任何 Trend：Waymo 规模化体验被“日活化”描述：自动驾驶进入可运营阶段的信号。
14. **Signal -> Trend** `2026-05-05-signal-5`：Signal 暂未进入任何 Trend：巨头 ARR/估值讨论升温：AI 进入经营指标叙事，ROI 导向会更强。
15. **Signal -> Trend** `2026-05-05-signal-6`：Signal 暂未进入任何 Trend：在线 IDE 平台把“开发”延伸到“分发/融资”：一人公司工具链向平台化外溢。
16. **Opportunity -> Priority** `20260427-01-AI招投标Agent`：机会卡没有评分证据：AI招投标Agent。
17. **Opportunity -> Signal** `20260427-01-AI招投标Agent`：机会卡没有关联 Signal：AI招投标Agent。
18. **Opportunity -> Priority** `20260429-01-企业AI工作流样板库`：机会卡没有评分证据：企业AI工作流样板库。
19. **Opportunity -> Signal** `20260429-01-企业AI工作流样板库`：机会卡没有关联 Signal：企业AI工作流样板库。
20. **Opportunity -> Priority** `20260505-01-企业客户体验Agent平台`：机会卡没有评分证据：企业客户体验Agent平台。
21. **Opportunity -> Signal** `20260505-01-企业客户体验Agent平台`：机会卡没有关联 Signal：企业客户体验Agent平台。
22. **Opportunity -> Priority** `20260427-02-AI客服质检与工单智能Agent`：机会卡没有评分证据：AI客服质检与工单智能Agent。
23. **Opportunity -> Signal** `20260427-02-AI客服质检与工单智能Agent`：机会卡没有关联 Signal：AI客服质检与工单智能Agent。
24. **Opportunity -> Priority** `20260427-03-AI商业洞察与销售赋能Agent`：机会卡没有评分证据：AI商业洞察与销售赋能Agent。
25. **Opportunity -> Signal** `20260427-03-AI商业洞察与销售赋能Agent`：机会卡没有关联 Signal：AI商业洞察与销售赋能Agent。
26. **Opportunity -> Priority** `20260428-03-行业专家知识Agent化`：机会卡没有评分证据：行业专家知识Agent化。
27. **Opportunity -> Signal** `20260428-03-行业专家知识Agent化`：机会卡没有关联 Signal：行业专家知识Agent化。

## 处理规则

- 硬错误需要 Dev/Data 立即修复，通常是 ID 或 slug 断链。
- 软提醒是运营复核项，不一定是错误，可能是新机会、新趋势或早期信号尚未形成闭环。
- Signal / Opportunity / Trend 的弱关联可能来自标签相似度，本检查只校验引用是否存在，不逐条要求双向完全一致。
- The Point 只作为观点共识、分歧或边界信号，不作为 Judgment Node 的事实证据直接加权。
- 每次运行同步脚本后，应再运行本检查，确认新增内容没有断链。
