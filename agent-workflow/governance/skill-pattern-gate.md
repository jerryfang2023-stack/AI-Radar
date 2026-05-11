# V2 Skill Pattern Gate

日期：2026-05-10  
状态：accepted  
owner：`workflow` / `pm`  
来源参考：Google Cloud Tech / Lavi Nigam《5 Agent Skill design patterns every ADK developer should know》

## 1. 定位

本文件把 Agent Skill 设计模式转化为观澜 AI 的任务调度闸门。

它不新增长期 Agent，也不允许用临时 agent 替代长期岗位。它解决的是：派发任务时，除了说明“谁负责”，还必须说明“用什么执行模式”，避免任务提示词越来越长、执行窗口漏读规范、实现和验收混在一起、旧任务质量被误当作新基线。

后续新派发任务必须标注至少一种 Skill Pattern。复杂任务可以组合多个模式，但必须写清顺序和硬停顿。

## 2. 五类模式

| Pattern | 中文口径 | 适用任务 | 必须输出 | 禁止事项 |
|---|---|---|---|---|
| Tool Wrapper | 工具封装 / 规范随取 | 读取 VI、字体、Copy、Source Registry、Netlify、GitHub、质量闸门等稳定规范 | 已读取文件、适用规则、不可用边界 | 不把工具输出直接当项目结论 |
| Generator | 模板生成 | 派发单、closeout、阶段报告、UI/UE 表、Copy 表、PM 门禁、QA 报告、内容模板 | 固定结构文档，缺字段说明 | 不自由写总结替代模板 |
| Reviewer | 独立审查 | Design Director 评分、Copy 审查、Source Quality Gate、截图验收、内容深度审查、发布建议 | 分数、证据、阻塞项、可延后项 | 不参与实现，不自验自收 |
| Inversion | 先问 / 先诊断 | 页面质感、VI、产品结构、算法、内容生产线、商业化等高风险任务 | 诊断、方案、确认点、阶段 1 报告 | 未确认不得进入实现 |
| Pipeline | 多阶段流水线 | 自动化、内容入库、页面开发、部署、迁移、历史资产处理 | 阶段顺序、硬闸门、失败降级、收口 | 不跳过中间质量门 |

## 3. 组合规则

常见任务必须按以下组合派发：

| 任务类型 | 推荐 Pattern | 执行口径 |
|---|---|---|
| 页面质感 / 全站 UI / VI | Tool Wrapper + Inversion + Pipeline + Reviewer | 先读 VI / 字体 / Copy，再诊断确认，再逐页实现，最后截图评分 |
| 文案审查 | Tool Wrapper + Generator + Reviewer | 先读 Copy / Strategy，再按文案表替换，最后禁用语和边界验收 |
| 产品功能 / 新模块 | Inversion + Reviewer + Generator | 先 PM 门禁和 WAVE，再模块决策表；未通过不得 Dev |
| 新闻源 / 内容自动化 | Tool Wrapper + Pipeline + Reviewer | 先读 Source Registry，再执行采集漏斗，最后 source/content gate |
| 内容长文 / 商业内参 | Generator + Reviewer + Pipeline | 先模板化结构，再内容深度审查，再入库和页面检查 |
| 部署 / GitHub / Netlify | Pipeline + Reviewer | 构建、预览、冒烟、回滚和发布建议分步完成 |
| 调度 / 收口 / 治理 | Generator + Reviewer | 固定模板记录，调度中枢按硬闸门验收 |

## 4. 派发单必须新增字段

后续派发单的快速执行卡必须包含：

```text
- Skill Pattern：Tool Wrapper / Generator / Reviewer / Inversion / Pipeline / Compose
- Pattern 顺序：
- 硬停顿：
- Reviewer：
```

填写规则：

- `Tool Wrapper`：列出必须读取的规范、工具或资产库。
- `Generator`：列出必须生成的模板化产物。
- `Reviewer`：列出独立审查者和通过线。
- `Inversion`：列出必须先问、先诊断或先确认的节点。
- `Pipeline`：列出阶段顺序和每阶段质量门。
- `Compose`：两个以上 pattern 组合时使用，并写清顺序。

## 5. 硬闸门

以下情况不得标记为 accepted：

- 派发单缺少 Skill Pattern 字段。
- 页面类任务没有 `Tool Wrapper + Inversion/Pipeline + Reviewer` 组合。
- 产品功能任务没有 `Inversion + Reviewer`，或未过 PM 门禁 / WAVE。
- 自动化任务没有 `Pipeline + Reviewer`，或未写失败降级。
- closeout 只写“完成了”，没有按 pattern 给出证据。
- Reviewer 同时参与实现且没有独立复核证据。
- 引用外部 skill / repo 但没有安全审查和适配边界。

## 6. 与长期 Agent 的关系

Skill Pattern 只描述任务执行方法，不改变长期 Agent 分工：

- Strategy / PM 仍负责判断做不做、怎么做。
- UI / UE、Copy、Data、Dev、QA 仍按岗位职责执行。
- Workflow 负责派发、收口、回填和复盘。
- 技能和插件只能增强岗位能力，不能替代长期岗位。

## 7. 当前 V2 特别要求

- V2 页面任务不得继承用户不满意的旧页面验收作为质量基线；必须重新诊断和评分。
- VI 相关任务必须优先读取 `docs/brand/wavesight-ai-vi/` 和 `V2-VI-SVG-RESTORE` 产物。
- `follow-builders`、`AI HOT` 等采集通道属于 Tool Wrapper / source-router，不能作为事实主证据。
- V2 daily 自动化属于 Pipeline，必须包含 Raw / Pool / Structured / Front / Deep Dive / Trend 阶段和失败降级。
- 页面、内容、自动化和部署任务都必须把 Reviewer 证据写入 closeout。

## 8. 收口要求

执行窗口 closeout 必须增加：

```text
Skill Pattern：
Pattern 顺序：
已执行的阶段：
硬停顿是否执行：
Reviewer 证据：
未执行 pattern 及原因：
```

调度中枢验收时，先看 pattern 是否匹配任务类型，再看质量闸门是否满足。
