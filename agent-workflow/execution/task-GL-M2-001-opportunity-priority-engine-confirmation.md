# 任务确认稿：Opportunities 与 Priority Engine 关系打通

更新时间：2026-05-02  
状态：待用户确认  
PM Owner：PM Agent  
第一责任 Agent：Data Agent  
执行规则：使用长期 agent 岗位，不新建临时 agent

## 1. 背景

Opportunities 页面已经把评分排行放入右侧，普通用户不再需要单独进入 Scoring 栏目。

但当前仍存在一个核心问题：评分项、机会卡、Signals、Trends 之间的关系还不够稳定。右侧排行可以显示所有 scoring 项，但它们未必都能准确落到某一张机会卡，也未必能解释这个机会为什么值得继续观察。

因此下一步不是继续美化页面，而是先把机会库的数据关系建稳。

## 2. 本任务目标

把 `Scoring / Priority Engine` 从“独立评分表”升级为 Opportunities 的排序与证据引擎。

完成后应做到：

- 每个评分项能关联到一个机会方向、机会卡或赛道。
- 每张机会卡能看到对应的评分、证据、相关 Signals 和相关 Trends。
- 公司名只作为代表案例或证据来源，不作为机会标题。
- 前台 Opportunities 页面能自然呈现：机会卡列表 + 机会排行 + 详情页证据链。
- Admin 端保留评分管理能力，普通前台不暴露后台式 Scoring 入口。

## 3. 非目标

本轮不做以下事情：

- 不重新设计整个网站首页。
- 不新增付费、登录、订阅功能。
- 不修改每日自动化监测任务。
- 不把评分结论写成投资、经营或合作建议。
- 不把 Tags 做成新的一级栏目。

## 4. 分工

### PM Agent

负责确认产品边界、栏目关系和验收标准。

交付物：

- 本任务确认稿
- 字段变更范围说明
- 页面影响范围说明

### Data Agent

本任务第一责任 Agent。

交付物：

- `opportunity-priority-schema.md`
- scoring 到 opportunity 的映射规则
- 缺失关系检查规则
- 重复评分项合并规则
- 公司名清理规则

重点定义字段：

- `opportunity_id`
- `opportunity_slug`
- `priority_score`
- `priority_rank`
- `score_source_id`
- `related_signals`
- `related_trends`
- `representative_cases`
- `evidence_level`
- `status`

### UI / UE Agent

在 Data Agent 输出后介入。

交付物：

- Opportunities 列表页结构建议
- Opportunity 详情页结构建议
- 右侧 Priority Engine 呈现规范
- 桌面端与移动端验收点

页面原则：

- 机会卡是主角，排行只是辅助比较。
- 不做大面积卡片堆砌。
- 详情页要像商业内参，不像数据后台。

### Copy Agent

在 Data Agent 输出后介入。

交付物：

- 机会卡标题规范
- 机会定义句规范
- 评分解释口径
- 禁用表达清单

文案原则：

- 有观点，但不替客户下最终判断。
- 说明证据强弱，不说“必投”“必须做”。
- 公司名只能作为案例，不作为机会名。

### Dev Agent

等 Data / UI / Copy 输出后再执行。

交付物：

- 同步脚本字段兼容
- Opportunities 页面与详情页展示调整
- Admin 端评分编辑入口保留
- 普通前台隐藏 Scoring 后台入口

### QA Agent

最后验收。

交付物：

- 关系完整性检查报告
- 普通前台权限检查
- 页面视觉与内容检查
- 抽样 10 条机会卡的证据链检查

## 5. 建议执行顺序

1. PM Agent：用户确认本任务范围。
2. Data Agent：输出字段和映射规则。
3. PM Agent：确认字段是否会影响现有 MD 和同步脚本。
4. UI / UE Agent：输出 Opportunities 页面和详情页结构。
5. Copy Agent：输出标题、定义句、评分解释规则。
6. Dev Agent：修改同步脚本和页面。
7. QA Agent：验收普通前台、Admin、数据关系和页面展示。
8. Workflow Agent：记录任务状态和交接结果。

## 6. 验收标准

任务通过必须满足：

- Opportunities 页面右侧排行显示 scoring 的全部机会排行。
- 排行项点击或关联时，能找到对应机会卡或明确标记为待建机会。
- 每张正式机会卡至少关联 1 条 Signal 或 1 条 Trend。
- 公司名不出现在机会卡主标题中。
- 普通前台导航不出现 Scoring。
- Admin 端仍能管理评分数据。
- 同步后数据不丢失，页面不出现空字段或错位。

## 7. 风险

- 历史评分项可能只写了公司名，无法自动判断对应机会方向。
- 部分机会卡和评分项可能一对多或多对一，需要合并规则。
- 如果先改页面再补字段，后续会继续出现错位。

## 8. 需要用户确认

请确认下一步是否按此任务推进：

> 先由 Data Agent 负责 `Opportunities 与 Priority Engine 数据关系打通`，输出字段规范和映射规则；确认后再交给 UI / Copy / Dev / QA。

