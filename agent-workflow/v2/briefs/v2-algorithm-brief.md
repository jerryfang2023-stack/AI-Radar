# V2 Algorithm Brief

状态：ready-for-dispatch  
建议任务：`V2-2 / WSD-20260507-03-v2-algorithm-source-architecture`

## 目标

设计 V2.0 的判断算法：从 30-50 条原始采集，到 3 条前台 Signal 和 1 条深挖机会卡，再进入长期趋势数据库。

## 必须覆盖

- Raw 采集：来源分层、抓取频率、去重规则。
- Pool 初筛：10-15 条入池标准。
- Structured 入库：5-8 条 6 维度分析。
- Front Signal：3 条二次搜索与信号解释。
- Deep Dive：每日最多 1 条机会卡。
- Trend：长期趋势归类与反证记录。
- 与 P0-12 test-only 管线的继承与差异。

## 输出

- V2 算法流程图。
- 评分与筛选规则。
- 反证与可信度规则。
- 入库 schema 草案。
- 7 日测试计划。

