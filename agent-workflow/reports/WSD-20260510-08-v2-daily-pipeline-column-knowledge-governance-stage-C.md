---
title: V2 每日生产线治理 Stage C 栏目产出标准阶段总结
date: 2026-05-10
task_id: WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance
stage: C
status: in_progress / C-1-confirmed-and-written
owner: strategy / pm / copy / data
encoding: UTF-8
---

# Stage C｜栏目产出标准

## 已确认事项

用户已确认今日要点的定位升级：

- 今日要点不是普通日报，而是 AI 商业判断 Newsletter。
- 核心能力是帮老板快速理解今天发生了什么、判断哪些值得关注、判断哪些只是热度上升但证据不足。
- “暂不行动”不作为独立表达，相关内容进入趋势温度、风险与边界、后续观察。
- 每天有价值的 Builder / VC / Founder / Research 观点都可以出现；能修正主判断时写修正关系，不能修正时作为独立思考模块。

## 今日要点内容结构

已写入 `agent-workflow/product/column-architecture.md` 与 `agent-workflow/product/COPY.md`：

1. 日期导航
2. 今日判断
3. 发生了什么
4. 值得关注
5. 趋势温度
6. 机会观察
7. 观点与思考
8. 风险与边界
9. 后续观察
10. 关键词表
11. 搜索与筛选
12. 相关内容索引
13. 来源与证据状态

## 今日要点新增能力

- 日期导航：上一日、下一日、周视图、月视图；标记完整日、降级日、证据不足日和无深挖日。
- 关键词表：公司、产品、人物、赛道、场景、风险、来源类型和正式标签。
- 搜索与筛选：按日期、关键词、正式标签、来源等级、栏目类型检索。
- 趋势图：7 / 30 / 90 天热度折线、来源类型堆叠条、赛道 x 场景热力图、风险温度条、信号簇关系图。

## Structured Signal / Front Signal 分工

用户确认两类内容不能同构：

| 类型 | 角色 | 字数 | 内容要求 |
|---|---|---:|---|
| Structured Signal | 结构化信号卡 | 1200-2000 中文字 | 快速理解、入库、关联；必须有事件、商业变量、来源等级、证据边界、趋势候选 |
| Front Signal | 深度分析报告 | 3000-5000 中文字 | 值得精读、可分享、可进入商业内参；必须有数据、分析、图片或图表、关键参数、至少 3 个 S/A/B 原始来源 |

## 引用规则

所有事实引用、数据、融资、客户案例、产品发布、监管、观点和参数必须有：

- 来源名
- 来源等级
- 原始外链
- 增量事实说明

M/C 级线索不能替代原始外链。

## C-2 关键信号新增确认：Builders 观点

用户已确认：

- Builders 观点作为「关键信号」大栏目下的子入口。
- 栏目页展示高价值观点卡片。
- Builder 详情页以人物 / title / 发言时间线为主线。
- 详情页展示该人物观点随时间的延续、修正、转向、冲突和关联信号。
- 观点只作为判断校准，不作为事实主证据。

已写入：

- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/the-point-model.md`
- `agent-workflow/product/intelligence-data-model.md`

## C-3 机会解码确认

用户已确认：

- 机会解码不是机会卡列表，而是面向老板的 AI 商业机会深度分析栏目。
- Deep Dive 必须达到 6000-10000 中文字，是商业内参级长文。
- 机会解码应能单独辅助老板判断是否值得继续投入注意力、资源、人脉、试点或内部讨论。
- 不出现“中国迁移难点”作为固定栏目或硬性模块。
- 公司不能作为机会标题，只能作为代表案例或证据。
- 证据不足时不硬凑 Deep Dive，明确写“今日暂无足够证据支撑深挖内参”。

已写入：

- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/v2/v2-commercial-brief-depth-standard.md`
- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`

## C-4 商业内参确认

用户已确认：

- 商业内参是高阶组合判断报告，不是单个机会 Deep Dive。
- 商业内参围绕一个主题、赛道、趋势或周期，把多个 Signal、Opportunity、Trend、Builders 观点和风险证据组织成可归档、可复盘、可付费阅读的商业判断报告。
- 单篇 Deep Dive 可以被商业内参引用，但不能直接等同于商业内参。

已写入：

- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/intelligence-data-model.md`

## 已修改文件

- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/product/the-point-model.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/v2/v2-commercial-brief-depth-standard.md`
- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`

## 未修改文件

- 未修改每日内容正文。
- 未修改 Obsidian 知识库文件。
- 未修改 V2 前台页面模板或站点代码。
- 未修改实际 automation toml。

## 检查结果

- `node --check agent-workflow/tools/v2-content-gate.mjs`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-10`：失败，符合预期；旧内容尚未按新版 1200-2000 / 3000-5000 / Heat Candidate / daily log 字段回填。该项留到 F 类确认。

## 下一步

C 类已确认今日要点、关键信号、Builders 观点、机会解码和商业内参的当前核心口径。后续若进入页面实现，需要另开 UI / UE 验收任务。
