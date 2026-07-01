# Intelligence Data Model｜判断资产模型

更新时间：2026-05-22
owner：Intelligence Engine
状态：current

## 1. 定位

本模型定义观澜 AI 当前判断资产标准。观澜不把内容当作孤立文章管理，而是把外部信息沉淀为可追溯、可复核、可升级的判断资产。

当前核心链路：

```text
Source
-> Raw
-> Pool
-> signal_card / opinion_card
-> change_candidate / scene_candidate / trend_candidate
-> daily observation / business signals / trend reports / briefs
-> site
```

旧观点、旧机会中心和旧趋势卡口径只作为历史兼容来源，不作为当前新增资产类型。当前使用：

- `signal_card`：商业信号卡。
- `opinion_intake`：前沿观点入库素材，必须保留原文和中文翻译，等待评级。
- `opinion_card`：已完成中文翻译和四档评级的前沿观点卡。
- `change_candidate`：变化候选。
- `scene_candidate`：场景候选。
- `trend_candidate`：趋势候选。
- `trend_report`：趋势快报或深度报告。
- `brief_issue`：商业内参期。

## 2. 统一状态

| 状态 | 含义 | 是否允许入站 |
|---|---|---:|
| `published` | 已发布或可展示 | 是 |
| `passed` | 通过门禁，可被下游引用 | 是 |
| `watch` | 观察资产，证据不足但值得保留 | 视页面策略 |
| `needs_review` | 需要人工复核 | 否 |
| `draft` | 草稿 | 否 |
| `failed` | 生成失败 | 否 |
| `empty` | 空跑或无有效内容 | 否 |
| `hidden` | 不进入前台 | 否 |

## 3. signal_card｜商业信号卡

商业信号卡记录一个明确发生的 AI 商业事件。前期只保留三种主类型：

```text
product_service
funding
case
```

最小合格标准：

- 有明确主体、动作、时间或可核验发生点。
- 有原始来源、来源等级、关键摘录和证据边界。
- 主证据来自 Daily Monitor QC 允许的 eligible `core_pool`。
- 能说明影响的商业变量：客户、流程、预算、组织、责任、风险、竞争、成本、交付或渠道。
- 有 `frontend` 展示对象，并通过 `cardcopy_gate`。

不得进入正式商业信号卡：

- AI HOT 标题 / 摘要 / 热度。
- 搜索结果、目录页、官网首页、README、包页、模型页、登录页、SEO 页。
- failed provider text。
- 未补证的社区或前沿观点。

## 4. opinion_card｜前沿观点卡

前沿观点卡记录“谁在何时何处说了什么”。它是判断输入，不是公司事实主证据。

最小合格标准：

- 有人物 / 机构、当时身份、发表时间、平台、原文链接或快照。
- 保留原文或原文摘录，短观点尽量完整保存。
- 观澜解读必须放在原文之后。
- 观点里的事实主张必须另有 S/A/B 或 eligible `core_pool` 补证。
- 关联至少一个商业信号、变化候选、场景候选、趋势候选或趋势报告。
- 必须有中文翻译；翻译用于辅助阅读，不替代原文。
- 必须执行四档评级。

### 观点卡四档评级字段

```yaml
opinion_tier: feature | sidebar | archive | discard
display_lane: daily_feature | signal_sidebar | archive_only | hidden
selection_reason:
opinion_rating_score:
opinion_rating_version: 2026-05-22-v1
publish_status: frontstage_feature | frontstage_sidebar | internal_archive | hidden
translation_status: translated | pending_translation
```

| opinion_tier | display_lane | publish_status | 含义 |
|---|---|---|---|
| `feature` | `daily_feature` | `frontstage_feature` | 今日观察主推观点 |
| `sidebar` | `signal_sidebar` | `frontstage_sidebar` | 商业信号页观点模块 / 侧栏 |
| `archive` | `archive_only` | `internal_archive` | 知识库归档，不进前台 |
| `discard` | `hidden` | `hidden` | 隐藏或后续清理 |

前台同步只允许完成中文翻译的 `feature` 和 `sidebar`。未评级、评级字段冲突、缺中文翻译、`translation_status: pending_translation`、`archive` 或 `discard` 都不得进入前台。

前沿观点前台归属为「商业信号 > 前沿观点」，不作为一级导航。

## 5. change_candidate｜变化候选

变化候选记录一个可能正在发生的商业变化，但还未达到正式变化判断。

最小合格标准：

- 有变化假设。
- 有支撑信号。
- 有前后对比。
- 有商业变量。
- 有反证或观察窗口。

升级为成熟变化短专题至少需要：

- 至少 3 条相关商业信号，来自不同主体或不同来源。
- 至少 1 个案例或场景证据。
- 清楚的前后对比。
- 明确商业变量。
- 至少 1 条反证、限制或观察窗口。

成熟变化短专题前台进入 `content/04-business-signals/change-topics/`，不作为普通卡片流。

## 6. scene_candidate｜场景候选

场景候选记录 AI 进入行业、岗位、流程或任务的可复用场景。

最小合格标准：

- 行业 / 部门清楚。
- 岗位 / 使用者清楚。
- 具体流程 / 任务清楚。
- AI 改变的步骤清楚。
- 有案例、产品、客户或流程证据。
- 有证据缺口或观察变量。

成熟后，场景候选可支撑商业信号详情页、相关场景、AI 商业热力图节点或商业内参。

## 7. trend_candidate 与 trend_report

趋势候选记录多个变化或场景是否正在指向一个阶段性方向。它不是普通卡片。

趋势候选不得由单条新闻、单个观点或公司名清单生成。

趋势报告有两种形态：

| kind | 前台名称 | 规则 |
|---|---|---|
| `flash` | 趋势快报 | 2000-3500 中文字，急件候选触发，公开或登录可读，30 天 follow-up |
| `full` | 深度报告 | 6000-10000 中文字，周任务或快报升级触发，会员重点内容 |

正式趋势判断至少需要：

- 至少 3 个正式变化判断或成熟变化短专题。
- 至少 2 个正式场景判断或成熟场景。
- 至少 2 个不同赛道、行业或客户类型出现相似信号。
- 至少 2 类来源。
- 能说明它对预算、流程、组织、竞争或风险的阶段性影响。
- 清楚说明风险边界、证据缺口或尚未证明的商业变量。
- 能说明它对预算、流程、组织、竞争或风险的阶段性影响。

## 8. brief_issue｜商业内参期

商业内参是跨周期、跨栏目、可归档的组合判断报告。

最小合格标准：

- 围绕一个主题、赛道、趋势或周期形成组合判断。
- 至少关联商业信号、趋势报告、变化 / 场景 / 趋势候选、前沿观点中的两类资产。
- 明确覆盖周期：7 天、30 天、90 天、月度、季度或专题周期。
- 有执行摘要、信号链、机会组合、趋势判断、前沿观点分歧、风险边界、判断结论、后续观察和来源附录。
- 所有事实、数据和案例必须有来源名、来源等级、原始外链和增量事实。

商业内参可以形成判断，但不替用户下最终经营、投资或合作判断。

## 9. 关系网络

核心关系：

```text
signal_card -> Raw
signal_card -> source
signal_card -> change_candidate
signal_card -> scene_candidate
signal_card -> trend_candidate

opinion_card -> source
opinion_card -> signal_card
opinion_card -> change_candidate
opinion_card -> trend_candidate

change_candidate -> signal_card
change_candidate -> scene_candidate
change_candidate -> trend_candidate

scene_candidate -> signal_card
scene_candidate -> trend_candidate

trend_candidate -> change_candidate
trend_candidate -> scene_candidate
trend_candidate -> trend_report

trend_report -> signal_card
trend_report -> change_candidate
trend_report -> scene_candidate
trend_report -> opinion_card

brief_issue -> signal_card
brief_issue -> trend_report
brief_issue -> opinion_card
brief_issue -> trend_candidate
```

硬错误：

- 引用不存在的 ID。
- 重复 ID。
- 前沿观点缺原文链接或原文摘录。
- 观点卡缺少中文翻译或四档评级字段。
- `archive` / `discard` 观点进入前台。
- 商业信号缺来源、证据边界或 `cardcopy_gate`。
- 趋势报告引用的事实无法回到 Raw / source。

软提醒：

- 趋势报告暂无足够边界说明。
- 趋势候选证据过少。
- 场景候选缺真实客户或流程证据。
- 前沿观点缺素材笔记或授权边界。
- 商业内参缺少关联资产中的任意两类支撑。

软提醒必须有处理结论，不要求全部强行清零。

## 10. 发布闸门

V2.2.1 每日入站使用当前质量门。发布前检查按任务类型执行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
node agent-workflow/tools/run-quality-gates.mjs cardcopy --date=YYYY-MM-DD --require-gates=true
```

闸门检查：

- Raw / Pool / Asset 是否满足 Raw-first / Evidence-first 证据门槛。
- 前台事实是否能回到 Raw 快照、原始 URL、关键摘录和 S/A/B 来源。
- 今日观察、商业信号、趋势追踪和商业内参是否没有把 AI HOT、follow-builders、社区或聚合源当作事实主证据。
- 观点卡评级、展示位置和发布状态是否一致。
- 站点数据同步后必须能通过相关语法和内容检查。
- 已停止内容链路的同步闸门不作为 V2.2.1 当前验收条件。

## 11. 长期报告

Intelligence Engine 应持续维护：

- 关系检查报告。
- 标签质量报告。
- 资产候选升级 / 降级报告。
- 观点卡评级治理报告。
- 证据缺口报告。

每轮结束必须把处理结论写回 `progress.md` 和当前 closeout。
