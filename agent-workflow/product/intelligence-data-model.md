# Intelligence Data Model

更新时间：2026-05-03  
owner：Intelligence Data Agent

## 1. 定位

本模型定义观澜AI的统一判断资产标准。它把 Signal、Priority、Trend、Trend Report、Point 组织成一张可追溯、可评分、可复核、可持续优化的商业判断网络。

观澜AI不把内容当作孤立文章管理，而把每条内容沉淀为判断资产：

```text
Signal 记录发生了什么
Priority 判断现在值不值得优先看
Trend 判断方向是否形成势能
Trend Report 形成可验证的趋势判断，并在文章中承接机会判断
Point 记录关键建造者、投资人、研究者和一线操盘者怎么看；前台归属到「商业信号 > 前沿观点」
AIBriefIssue 记录跨周期、跨栏目、可归档的商业组合判断
```

## 2. 统一状态

| 状态 | 含义 | 是否允许入站 |
|---|---|---:|
| `pending_unified_sync` | 内容已生成，等待统一同步闸门 | 是 |
| `updated` | 内容已更新，可同步 | 是 |
| `published` | 已发布或可展示 | 是 |
| `watch` | 观察资产，证据不足但值得保留 | 视页面策略 |
| `needs_review` | 需要人工复核 | 否 |
| `draft` | 草稿 | 否 |
| `failed` | 生成失败 | 否 |
| `empty` | 空跑或无有效内容 | 否 |
| `hidden` | 不进入前台 | 否 |

## 3. Signal Intelligence

Signal 是有商业证据的 AI 商业变化，不是普通新闻。

最小合格标准：

- 有明确事件：融资、产品发布、客户采用、收入增长、并购、监管、渠道变化、招投标或重大合作。
- 有证据：来源、客户、收入、部署、融资、合作、政策、产品更新或产业数据。
- 有商业含义：说明某方向升温、分化、成熟、受阻或出现机会。
- 有来源层级：S / A / B / C / D。
- 有 Signal Score 或可复核的评分拆解。
- 有相关 Trend Report 或 Trend。
- 每日商业雷达 Signal 必须包含 6 点机会拆解。

硬性质量规则：

- 标题必须是“事件 + 商业含义”，不能只是公司名。
- 公司名、产品名只能作为证据、来源或代表案例。
- 缺来源、缺商业含义、缺机会拆解的每日 Signal 不允许入站。
- 同一事件重复出现时，应合并补充证据，不新建重复 Signal。

## 4. Priority Intelligence

Priority 是后台评分项，不作为普通前台栏目。

最小合格标准：

- 能回链到原始 Signal。
- 能进入 Trend Report。
- 能被 Trend 吸收为评分证据。
- 保留原始评分名称、机会方向、代表案例、赛道、总分和判断。
- 公司名必须拆为代表案例，不作为机会方向。

关系规则：

- 同日同产品优先回链当天 Signal。
- 跨日期重复评分可回链最近的原始 Signal。
- 评分项若重复验证同一方向，进入趋势证据，不重复建机会。

## 5. Trend Intelligence

Trend 是商业势能判断，不是标签列表。

最小合格标准：

- 有趋势状态：rising / splitting / cooling / emerging / mature / risk / invalidating。
- 有 7 天与 30 天判断。
- 有评分证据或 Signal 证据。
- 有相关 Trend Report。
- 有具体产品或代表案例。
- 有反证观察点。

关系规则：

- Trend 必须至少有一个 Signal、Priority 或 Point 支撑。
- Trend 可以通过赛道别名、具体产品和评分项吸收 Signal。
- 新趋势可先标记为 emerging，但不能长期缺少证据。
- 缺 Signal 证据的 Trend 进入软提醒，需 Data Agent 复核。

## 6. Trend Report Intelligence

Trend Report 是可验证的趋势判断文章，不是公司报道，也不是旧独立卡片。

C-3 确认后，前台「机会判断」的核心形态是趋势深度报告和商业内参中的文章段落，而不是独立卡片列表。趋势深度报告必须达到 6000-10000 中文字，能够单独辅助老板判断是否值得继续投入注意力、资源、人脉、试点或内部讨论。

Trend Report 有两种形态：

| kind | 前台名称 | 规则 |
|---|---|---|
| `flash` | 趋势快报 | 2000-3500 中文字，急件候选触发，公开或登录可读，30 天 follow-up |
| `full` | 深度报告 | 6000-10000 中文字，周任务或快报升级触发，会员重点内容 |

ID 和状态规则：

| 字段 | 规则 |
|---|---|
| `id` | `TRD-FLASH-YYYYMMDD-XX` 或 `TRD-FULL-YYYYMMDD-XX` |
| `status` | `watching` / `upgraded` / `archived` / `revised` |
| `front_status` | `visible` / `hidden` |
| `urgent_candidate_id` | `UTCAND-YYYYMMDD-XX` |
| `upgrade_target` | 快报升级后的正式报告 ID |
| `upgraded_from` | 正式报告回链快报 ID |

前台第一版只显示 `watching` 和 `upgraded`。`archived` / `revised` 后台保留，商业内参可以引用，用于复盘判断变化。

最小合格标准：

- 标题必须是方向、客户场景或能力，不写公司名。
- 有目标客户、具体问题、替代流程、商业模式、判断结论和风险边界。
- 至少能关联 Signal、Trend、Priority 或 Point 中的一类证据。
- 正式深度报告应尽量有 Priority 评分；早期方向可先以趋势快报或 Trend Card 保留。
- 公司名只进入代表案例、来源或证据。

Trend Report 分层：

| 类型 | 标准 | 处理 |
|---|---|---|
| 深度报告 | 有评分、有 Signal、有 Trend、有反证 | 前台展示，会员重点内容 |
| 趋势快报 | 急件候选通过，来源质量达标但尚未完整展开 | 前台展示，30 天 follow-up |
| 观察方向 | 有 Signal 或 Point，但暂无评分或反证不足 | 进入 Trend Card 或软提醒 |
| 候选方向 | 只有单次弱证据 | 暂不前台强化 |
| 重叠方向 | 与已有报告高度重合 | 建议合并或降级 |

Trend Report -> Priority 不能为了清零而硬绑。没有评分证据的早期方向应输出处理结论：补评分、观察、合并或降级。

趋势深度报告 机会判断报告必须包含：

- 老板先看。
- 机会判断。
- 为什么现在值得看。
- 目标客户与付费方。
- 真实问题。
- AI 替代或增强的流程。
- 商业模式。
- 代表案例与证据。
- 关联信号与趋势。
- 风险与反证。
- 判断结论。
- 后续观察。

不再把“中国迁移难点”作为固定必填模块。

## 7. The Point Intelligence

Point 是结构化前沿观点，不等同新闻。

前台归属：

- The Point 不作为一级栏目。
- Point 在前台展示为「商业信号 > 前沿观点」。
- 前沿观点详情页按人物 / title / 发言时间线组织，展示观点的延续、修正、转向和冲突。
- Point 只作为判断参照，不作为事实主证据。

最小合格标准：

- 有人物、来源、原文链接、原文、中文译文、观点摘要、观澜解读、商业含义和观点边界。
- X 使用原文全文 / 中文译文全文。
- Podcast 使用原始发言段 / 发言段译文。
- Blog 使用原始段落 / 原始段落译文。
- Podcast / Blog / YouTube 必须绑定站内素材笔记。
- Point 应关联 Signal、Trend 或 Trend Report。

质量规则：

- 来源去重：同一 URL 多 Point 必须说明是同源多观点，且共享素材笔记。
- 同人多观点：人物详情页合并展示，但每条 Point 保留独立来源。
- 原文/译文完整性：不得用摘要、标题或观澜判断替代原文/译文。
- 清理规则：不得残留 X `t.co` 短链、YouTube speaker/timecode。
- 授权说明：第三方全文入库前必须确认授权或自有导出边界。

## 7.5 AIBriefIssue Intelligence

AIBriefIssue 是商业内参的判断资产对象。

最小合格标准：

- 围绕一个主题、赛道、趋势或周期形成组合判断。
- 至少关联 Signal / Trend / Trend Report / Point 中的两类资产。
- 明确覆盖周期：7 天、30 天、90 天、月度、季度或专题周期。
- 有执行摘要、信号链、机会组合、趋势判断、前沿观点分歧、风险与反证、判断结论、后续观察和来源附录。
- 所有事实、数据和案例必须有来源名、来源等级、原始外链和增量事实。
- 前沿观点只能作为判断参照，不替代事实主证据。

质量规则：

- 单个 趋势深度报告 不能直接等同于 AIBriefIssue。
- 热度不能直接推导机会成立，必须说明商业证据和证据缺口。
- 内参可以形成判断，但不替用户下最终经营、投资或合作判断。
- 缺少来源附录或证据边界的内参不得进入正式会员层。

## 8. 关系网络

核心关系：

```text
Signal -> Trend Report
Signal -> Trend
Priority -> Signal
Priority -> Trend Report
Priority -> Trend
Trend -> Signal
Trend -> Priority
Trend -> Trend Report
Trend Report -> Signal
Trend Report -> Priority
Trend Report -> Trend
Point -> Source
Point -> Signal
Point -> Trend
Point -> Trend Report
AIBriefIssue -> Signal
AIBriefIssue -> Trend
AIBriefIssue -> Trend Report
AIBriefIssue -> Point
```

硬错误：

- 引用不存在的 ID。
- 重复 ID。
- Point 指向不存在的素材笔记。
- Source 指向不存在的 Point。

软提醒：

- Trend Report 暂无 Priority。
- Trend 证据过少。
- Signal 尚未进入 Trend。
- Podcast / Blog / YouTube 缺素材笔记。
- 来源授权说明不足。
- AIBriefIssue 缺少关联 Signal / Trend / Trend Report / Point 中的任意两类支撑。

软提醒必须有处理结论，不要求全部强行清零。

## 9. 发布闸门

V2.1 每日入站不再使用旧 `unified-site-sync.mjs`。当前发布前检查按任务类型执行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
```

闸门检查：

- Raw / Pool / Card 是否满足 Raw-first / Evidence-first 证据门槛。
- 前台事实是否能回到 Raw 快照、原始 URL、关键摘录和 S/A/B 来源。
- 今日观察、商业信号、趋势追踪和商业内参是否没有把 AI HOT、follow-builders、社区或聚合源当作事实主证据。
- 站点数据同步后必须能通过相关语法和内容检查。
- 旧 V1 `AI商业雷达 / AI机会评分 / The Point` 同步闸门只作为历史记录，不作为 V2.1 当前验收条件。

## 10. 长期报告

Intelligence Data Agent 应持续维护：

- `agent-workflow/reports/relation-check-latest.md`
- `agent-workflow/reports/the-point-quality-check-latest.md`
- `agent-workflow/reports/intelligence-data-relation-review-YYYY-MM-DD.md`
- `agent-workflow/reports/intelligence-data-point-rules-YYYY-MM-DD.md`
- `agent-workflow/product/tag-taxonomy.md`

每轮结束必须把处理结论写回 `progress.md` 和 `docs/agent-handoff.md`。

## 11. Signal 事件类型标准

`新闻类型`、`信号类型`、`事件类型` 只记录一条 Signal 的主事件类型，不记录赛道、客户、产品、能力、场景或标签。

允许值仅为：

- 融资
- 客户采用
- 收入验证
- 产品发布
- 监管/政策
- 采购/招标
- 并购整合
- 平台数据

示例：

- `融资 / AI营销平台 / 企业客户` 应改为 `融资`
- `产品发布 / 企业 AI 工作流 / 桌面端 Agent` 应改为 `产品发布`
- `并购受阻 / 监管 / AI Agent` 应按主风险改为 `监管/政策`

赛道、客户、产品和场景词应进入 `tags`、`track`、`summary`、`taxonomy` 或机会拆解，不进入事件类型字段。同步后网站数据生成标准 `eventTypes` 字段，用于 Daily Brief 的 `变化类型` 展示和后续筛选。
