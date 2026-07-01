# 趋势模型与 Trend Report 规则

更新时间：2026-05-14
状态：V2-only current / single source

## 1. 产品定义

趋势追踪不是趋势名称列表，也不是公司案例库。它判断一组 AI 商业变化是否正在连成一个方向：谁会受影响，谁可能付钱，证据够不够，边界在哪里。

趋势体系分两层：

| 资产 | 角色 | 前台形态 |
|---|---|---|
| 趋势候选 | 趋势状态记录 | 卡片、关系网络、筛选和后台状态 |
| Trend Report | 趋势判断文章 | 深度长文、趋势快报、报告详情页 |

`趋势候选` 负责记住趋势状态，`Trend Report` 负责形成判断。老板不会因为一张趋势候选产生认同，但系统需要趋势候选来记录持续出现的同向变化。

## 2. 与 1-79 题已确认口径的承接

本模型承接前序已确认规则：

- V2 一级导航保持：`今日观察 / 商业信号 / 趋势追踪 / 商业内参`。
- 机会判断不再作为一级栏目、独立 schema 或独立卡片资产。
- 机会判断保留为趋势报告和商业内参中的文章段落，用来说明客户、场景、付费、风险和时机。
- 趋势追踪是 `长文报告 + 趋势候选 / 变化候选聚合` 双重结构。
- 每个栏目仍以文章阅读为主，不把前台做成后台结构化填充页。
- 今日观察是当天市场综述，不由少量正式变化判断样本直接推导全局判断。
- 商业内参是周期刊物，不照搬每日观察或单篇趋势报告。
- 自动化保持六线程，不新增第七个线程。
- 所有来源、事实、数据、观点和边界信息必须标注来源名、来源等级、原始链接和增量事实。
- 文案必须遵守观澜风格：具体、冷静、有判断、有经营颗粒度，不煽动，不写 AI 味套话。

## 3. Trend Report 的两种文章形态

Trend Report 是一级判断资产，schema 统一使用 `trendReport / trendReports`。它有两种文章形态：

| kind | 前台名称 | 触发方式 | 篇幅 | 作用 |
|---|---|---|---:|---|
| `flash` | 趋势快报 | 急件候选触发 | 2000-3500 中文字 | 一个方向突然升温时，快速给出临时判断 |
| `full` | 深度报告 | 周任务筛选或快报升级 | 6000-10000 中文字 | 对一个方向做完整商业研究 |

趋势快报不是低质量版正式报告。它是前哨。它可以更短、更快，但不能降低可信底线。

正式 Trend Report 是趋势追踪的核心付费资产，必须有足够证据、案例、竞品、客户场景、技术路线、商业模式分析和清晰边界。

## 4. 正式 Trend Report 生成条件

正式报告不能每天硬写，也不能等到完全确定才写。最低门槛是“三类证据 + 商业影响”：

1. 至少 3 条独立商业信号，不能来自同一个媒体转述链。
2. 至少 1 个具体案例：公司、产品、客户采用、融资、招投标、收入或合作。
3. 至少 1 条外部观点或技术路线材料，用来解释为什么现在发生。

如果不满足，不能硬写正式报告，只能进入：

- 趋势候选：观察中。
- 今日观察中的自然提及。
- 后台候选池。
- 继续监测，等待更多同向证据或商业影响信号。

风险、限制和不确定项仍应在报告中自然说明，但不再作为正式 Trend Report 的准入硬门槛。

## 5. 急件候选机制

Trend Report 默认由每周 `trend-report-writer` 生成或更新。每日监测不直接写正式报告，只把候选方向放入趋势候选池。

但 AI 变化很快，系统必须保留急件机制。

`trend-report-writer` 的主任务仍然是写一篇趋势报告，不变成后台调度器。它每次运行最多产出 1 篇：

- weekly mode：最多 1 篇 `TRD-FULL-*`。
- urgent mode：最多 1 篇 `TRD-FLASH-*`。

生命周期管理是附带动作：

- 写快报时绑定 `urgent_candidate_id`。
- 快报升级时补 `upgrade_target`。
- 正式报告生成时补 `upgraded_from`。
- 发现快报不适合前台继续展示时改后台状态。
- 不负责全站调度、批量关系审查或自动化总控。

### 5.1 urgent_trend_candidate 标准

满足 3 个条件可进入急件候选，但必须同时包含“多源信号”和“商业影响”：

| 条件 | 标准 |
|---|---|
| 多源信号 | 24-48 小时内出现 5 条以上相关 Raw，且至少来自 3 个不同来源类型 |
| 权威来源 | 出现 S/A 来源，例如官方公告、监管文件、上市公司财报、权威媒体、重要论文 / 技术发布 |
| 商业影响 | 明确影响客户预算、业务流程、竞争格局、成本结构、收入方式或采购决策 |
| 市场共振 | builders、投资人、行业媒体、客户社区中至少两类人群开始讨论同一方向 |

只满足热度不够。只满足技术发布不够。只满足 builders 兴奋也不够。必须能说明它可能改变谁的钱、流程、客户或竞争关系。

同一天多个急件候选时，按以下顺序排序：

```text
多源密度 > 观澜重点赛道 > 商业影响 > 来源质量 > 时间新鲜度
```

解释：

1. `多源密度`：多个独立来源在短时间内指向同一方向，说明它不是孤立噪音。
2. `观澜重点赛道`：优先企业 Agent、AI Coding、AI 治理、企业数据、专业服务、AI 客服等长期关注方向。
3. `商业影响`：是否已经初步影响客户预算、流程、竞争、成本、收入或采购。
4. `来源质量`：是否有 S/A 或一手来源。
5. `时间新鲜度`：是否仍在升温，是否值得今天写。

不按热度排序。热度只作为线索，不作为选题主轴。

### 5.2 急件复核

急件候选不直接写报告，进入：

```text
urgent_trend_candidate -> rapid_review -> temporary_trend_report_run
```

复核分两层：

1. 系统自动复核：检查多源、来源等级、商业影响、同类案例、竞品动作、风险边界和证据缺口。
2. 人工批量复核：每天或每半天看一次急件候选清单，只做 `放行临时报告 / 继续观察 / 降级为趋势候选`。

人工不逐张卡反复确认。人只看批量候选清单，减少反复打断。

急件候选记录写入：

```text
01-SiteV2/content/11-databases/urgent-trend-candidates/YYYY-MM-DD-urgent-trend-candidates.md
```

候选 ID 使用：

```text
UTCAND-YYYYMMDD-XX
```

`review_decision` 只保留三种：

| review_decision | 含义 |
|---|---|
| `approve_flash` | 放行趋势快报 |
| `keep_watching` | 继续观察，不写快报 |
| `downgrade_to_trend_card` | 降级为趋势候选，只进入状态记录 |

复杂情况写入 `review_notes`，不扩展状态。

人工 reviewer 不记录真实姓名，只记录角色和窗口：

```yaml
reviewer_role: human_owner
reviewer_window: dispatch-hub
```

### 5.3 deferred candidates

writer 每次最多写 1 篇。如果同一天有多个候选，其余候选写入当天急件候选文件的 `Deferred Candidates`。

字段：

```yaml
deferred_reason:
next_review:
priority_rank:
defer_count:
```

处理规则：

- weekly mode 运行时，检查过去 7 天 `deferred_candidates`。
- urgent mode 运行时，优先检查当天和前 48 小时 `deferred_candidates`。
- 如果 `next_review <= today`，重新排序。
- 仍不够写快报或深度报告，就延后一次。
- 最多延后 2 次。
- 第三次必须落状态：`keep_watching`、`downgrade_to_trend_card` 或 `archived`。

## 6. 趋势快报规则

趋势快报用于突发升温方向，不替代今日观察，也不替代正式 Trend Report。

### 6.1 和今日观察的分工

| 内容 | 回答的问题 |
|---|---|
| 今日观察 | 今天 AI 商业世界发生了什么，主线是什么，为什么选这些信号 |
| 趋势快报 | 某个方向突然升温，为什么值得临时拆一篇看 |

今日观察可以引用趋势快报，趋势快报也可以由今日观察中的异常信号触发。但今日观察不能写成趋势快报合集，趋势快报也不能替代每日综述。

### 6.2 来源门槛

趋势快报数量可以低于正式报告，质量不能降：

- 至少 3 个独立来源。
- 至少 1 个 S/A 来源。
- 至少 1 条不是媒体转述的原始信息，例如官方公告、产品页、财报、论文、代码仓库、监管文件、招标文件、公司博客。
- 必须标注来源名、来源等级、原始链接和增量事实。
- 建议写明风险边界或信息缺口。
- 不能只靠 AI HOT、X、HN、Reddit 或 builders 观点写成快报。
- builders 观点可以作为判断参照，不能作为事实主证据。

### 6.3 写作骨架

趋势快报需要后台写作骨架，但前台仍是一篇自然文章，不展示结构化字段。

写作骨架：

1. 场景开头：一个老板、客户、工程负责人、销售、采购、投资人、医生、法务或运营负责人遇到的具体变化。
2. 今天为什么突然升温：触发事件和多源信号。
3. 它可能改变谁的流程：客户、场景、预算、岗位、交付链。
4. 市面上谁在动：同类产品、竞品、案例。
5. 技术路线的商业含义：只解释商业含义，不写技术教程。
6. 风险边界与观察变量：哪些东西还没有被证明。
7. 后续看什么：是否升级正式报告的追踪钩子。

### 6.4 文案风格

趋势快报必须遵守 `agent-workflow/product/COPY.md`。它不能写成新闻快讯、自媒体爆款或技术圈热闹总结。

它应当像“交易员晨会里临时插入的一页判断”：

- 可以快，但不能喊。
- 可以短，但不能浅。
- 从具体人、具体场景、具体冲突切入。
- 有事实，有来源，有边界。
- 不写“重磅”“颠覆”“风口”“必看”“全面爆发”。
- 不写“首先 / 其次 / 最后 / 值得注意的是 / 显而易见 / 不可否认 / 总而言之”。
- 不用空话套话，不堆抽象概念。
- 有主观判断，但不替用户下最终经营、投资或合作判断。

## 7. Trend Report schema 最小字段

不另建 `flashReport` schema。趋势快报只是 `trendReport.kind = flash`。

```json
{
  "id": "TRD-FLASH-20260514-01",
  "kind": "flash",
  "status": "watching",
  "frontStatus": "visible",
  "followUpWindow": "30d",
  "trigger": "urgent_trend_candidate",
  "urgentCandidateId": "UTCAND-20260514-01",
  "upgradeTarget": "",
  "upgradedFrom": "",
  "sourceCount": 3,
  "primarySourceCount": 1,
  "hasBoundaryNote": true
}
```

字段说明：

| 字段 | 含义 |
|---|---|
| `kind` | `flash` / `full` |
| `status` | `watching` / `upgraded` / `archived` / `revised` |
| `frontStatus` | `visible` / `hidden` |
| `followUpWindow` | 默认 30d |
| `trigger` | `weekly` / `urgent_trend_candidate` / `manual` |
| `urgentCandidateId` | 急件候选 ID，格式 `UTCAND-YYYYMMDD-XX` |
| `upgradeTarget` | 快报升级后的正式报告 ID |
| `upgradedFrom` | 正式报告回链快报 ID |
| `sourceCount` | 来源数量 |
| `primarySourceCount` | S/A 或一手来源数量 |
| `hasBoundaryNote` | 是否包含风险边界或证据缺口说明 |

ID 规则：

```text
TRD-FLASH-YYYYMMDD-XX
TRD-FULL-YYYYMMDD-XX
UTCAND-YYYYMMDD-XX
```

状态规则：

| 后台 status | 前台表达 | frontStatus 默认值 |
|---|---|---|
| `watching` | 继续观察 | `visible` |
| `upgraded` | 已升级为深度报告 | `visible` |
| `archived` | 归档观察 | `hidden` |
| `revised` | 判断被修正 | `hidden` |

第一版前台只展示 `watching` 和 `upgraded`。`archived` / `revised` 后台保留，商业内参可引用，用于周期复盘和判断校准。

升级关系必须双向记录：

快报：

```yaml
status: upgraded
upgrade_target: TRD-FULL-YYYYMMDD-XX
```

正式报告：

```yaml
kind: full
upgraded_from: TRD-FLASH-YYYYMMDD-XX
```

前台不显示字段名。对用户只显示自然表达：

- `趋势快报`
- `深度报告`
- `继续观察`
- `已升级为深度报告`

## 8. 30 天升级窗口

趋势快报发布后进入 `30-day follow-up`。系统继续监测：

- 是否出现更多客户案例。
- 是否出现真实定价或商业化信息。
- 是否出现竞品跟进。
- 是否出现反证。
- builders / 投资人 / 企业客户讨论是否持续。
- 是否有技术路线或监管变化继续推动。

30 天内有两种结局：

| 结局 | 处理 |
|---|---|
| 升级为正式 Trend Report | 证据增强，写完整深度报告，并回链原快报 |
| 归档为历史快报 | 热度退去或证据不足，不强行升级 |

被反证也可以公开展示。表达要克制、专业，不做自我检讨秀。

示例表达：

```text
这条快报后来被新的客户采用数据修正。方向仍值得观察，但原先对落地速度的判断偏乐观。
```

## 9. 付费与前台展示

第一版不把趋势快报单独做付费墙。趋势快报公开或登录可读，用来建立观澜的市场反应速度和判断风格。

分层：

| 内容 | 权限建议 |
|---|---|
| 趋势快报 | 公开或登录可读 |
| 正式 Trend Report | 会员重点内容 |
| 商业内参 | 会员 / 高阶会员核心内容 |
| 后台证据账本 | 不对普通用户开放，只在文章中露出必要来源链接 |

快报升级后，免费用户仍可读快报，不回收。正式报告可展示标题、导语、核心判断摘要和部分来源列表，完整正文、完整来源、反证、竞品、客户场景、技术路线和后续观察进入会员层。

## 10. 三层升级链路

```text
Trend Report Flash
-> Full Trend Report
-> Business Brief
```

| 层级 | 来源 | 作用 |
|---|---|---|
| Trend Report Flash | 急件候选 | 快速判断一个方向是否突然升温 |
| Full Trend Report | 快报升级或周任务筛选 | 对一个方向做完整深度分析 |
| Business Brief | 周期内多个信号、快报、报告、观点和案例 | 重新融合、修正和升级判断 |

关系规则：

- 快报可以升级为正式报告。
- 正式报告可以进入商业内参。
- 商业内参可以反向修正正式报告状态。
- 被反证的快报也可以进入商业内参，作为判断校准案例。

## 10.5 无报告决策

`trend-report-writer` 每次运行，要么产出一篇 Trend Report，要么产出一份 `no_report_decision`。不能硬写，也不能沉默。

目录：

```text
01-SiteV2/content/08-trend-reports/no-report-decisions/
```

命名：

```text
YYYY-MM-DD-no-trend-report-decision.md
```

最小字段：

```yaml
date:
mode: weekly | urgent
decision: no_report
reason:
checked_candidates:
missing_evidence:
next_action:
```

规则：

- 不进入 `site-content.json`。
- 不进入趋势追踪页。
- 不进入知识卡片库。
- 只供自动化复盘、调度检查、质量门禁使用。
- 商业内参可以参考，但不直接引用。
- 后续质量门禁应轻量检查它是否存在、原因是否具体、缺失证据是否明确。

合格的 `missing_evidence` 应写具体：

```text
缺少客户采用证据；只有社媒讨论和二手媒体转述；没有一手产品更新或财报材料。
```

不合格：

```text
证据不足，继续观察。
```

## 11. 趋势状态

趋势候选 和 Trend Report 都可引用趋势状态，但前台要转译成人话。

| 状态 | 含义 |
|---|---|
| rising | 持续升温，证据增多 |
| splitting | 分化中，部分场景成立，部分概念降温 |
| cooling | 降温，新增证据减少或商业化受阻 |
| emerging | 新出现，信号早但可能值得观察 |
| mature | 成熟，进入竞争和规模交付阶段 |
| risk | 风险变量，监管、并购、地缘或安全因素影响判断 |
| invalidating | 反证增强，暂不成立或需要下调优先级 |

## 12. 判断模型

### 12.1 证据阶梯

```text
概念出现
-> 产品发布
-> 融资验证
-> 客户采用
-> 收入增长
-> 复购扩张
-> 行业标配
```

越靠后，证据越强；越靠前，想象空间更大但风险更高。

### 12.2 采用曲线

```text
早期探索 / 先锋采用 / 主流扩散 / 成熟竞争 / 红海分化
```

每个阶段对应不同判断：

- 早期探索：适合观察和小范围验证。
- 先锋采用：适合找标杆客户和合作伙伴。
- 主流扩散：适合规模服务和渠道连接。
- 成熟竞争：适合并购、整合、垂直行业切入。
- 红海分化：只保留有客户、数据或渠道壁垒的方向。

### 12.3 趋势温度

| 维度 | 问题 |
|---|---|
| 资金温度 | 是否持续融资、并购或大厂投入 |
| 客户温度 | 是否有真实客户采用和复购 |
| 产品成熟度 | 是否从演示进入可交付产品 |
| 竞争强度 | 是否快速拥挤，是否已有头部 |
| 政策 / 监管阻力 | 是否受到合规、安全、数据限制 |
| 中国适配度 | 是否适合本土客户、场景、渠道和监管环境 |

### 12.4 趋势分化

很多 AI 方向不是简单上升或下降，而是分化：

- 概念降温，但真实业务场景升温。
- 海外升温，中国仍在验证。
- 工具热度下降，但基础设施增强。
- 创业机会变窄，但并购与整合增强。
- C 端声量高，但 B 端付费证据更强。

### 12.5 风险边界清单

每个重要趋势都要记录风险边界或证据缺口：

- 客户是否只试用不续费。
- 融资是否领先于收入证据太多。
- 是否缺少明确采购方。
- 是否依赖单一平台或政策窗口。
- 是否存在安全、隐私、监管、成本瓶颈。
- 是否只是大厂功能，而不是独立创业机会。

## 13. 页面表现

趋势追踪页不单独开“趋势快报”一级入口。快报混在趋势追踪页中，用状态区分。

前台建议：

- 顶部：最新正式 Trend Report。
- 正在升温：趋势快报 + 趋势候选。
- 历史：正式报告归档。
- 快报详情页复用 `trend-detail.html`。
- 卡片显示 `趋势快报` / `深度报告`。
- 已升级或被反证时，在正文前用自然语言说明，不暴露后台字段。

趋势详情页应展示：

- 标题和一句话判断。
- `趋势快报` 或 `深度报告` 状态。
- 证据阶梯位置。
- 后续观察变量。
- 来源与事实。
- 相关 Signals / 趋势候选s / 场景 / 案例信号 / 前沿观点。
- 前沿观点只能引用已完成中文翻译和四档评级的观点卡；`feature` / `sidebar` 可作为前台参照，`archive` 仅供内部校准，`discard` 不得引用。
- 机会判断段落。
- 风险边界与证据缺口。

## 14. 模板位置

Trend Report 模板拆成两个文件，但 schema 不拆：

```text
01-SiteV2/knowledge/10-Templates/trend-report-flash-template.md
01-SiteV2/knowledge/10-Templates/trend-report-full-template.md
```

两个模板都必须保留统一 frontmatter：

```yaml
asset_type: trend_report
kind: flash | full
id: TRD-FLASH-YYYYMMDD-XX | TRD-FULL-YYYYMMDD-XX
status: watching | upgraded | archived | revised
front_status: visible | hidden
follow_up_window:
trigger:
urgent_candidate_id:
upgrade_target:
upgraded_from:
source_count:
primary_source_count:
has_boundary_note:
```

模板拆分只服务写作任务：快报重在速度、触发原因和 30 天观察；深度报告重在完整研究、案例、竞品、客户场景、技术路线、商业模式和风险。

## 15. 输出路径与同步兼容

新内容只写入新结构：

```text
01-SiteV2/content/08-trend-reports/
├─ flash/
│  └─ YYYY-MM-DD--TRD-FLASH-YYYYMMDD-XX--slug.md
├─ full/
│  └─ YYYY-MM-DD--TRD-FULL-YYYYMMDD-XX--slug.md
└─ no-report-decisions/
   └─ YYYY-MM-DD-no-trend-report-decision.md
```

文件名必须包含 ID，不只依赖 frontmatter。

站点同步脚本读取策略：

1. 优先读 `full/`。
2. 再读 `flash/`。
3. 只读 `08-trend-reports/` 下的当前结构。
4. 不读取 `no-report-decisions/` 入前台。

生产写入当前结构；根目录不再作为趋势报告入站位置。

## 16. 前台排序

趋势追踪页排序：

1. `最新深度报告`
   - `kind = full`
   - 显示 1 篇主报告，最多 2 篇。
2. `正在升温`
   - `kind = flash`
   - `status = watching`
   - 趋势快报 + 相关 趋势候选。
3. `已升级`
   - `kind = flash`
   - `status = upgraded`
   - 展示为“已升级为深度报告”，引导去 full report。
4. `报告库`
   - 历史 full reports。
   - 历史 flash 第一版弱展示或不展示，避免复杂。

快报不默认压过正式报告。若当天快报极高优先级，可以在今日观察中自然露出，不一定抢趋势追踪页主位。

## 17. 与今日观察的引用关系

趋势快报发布后，不自动全文进入今日观察。

规则：

- 如果当天有趋势快报，今日观察可以在正文自然提及。
- 今日观察只写它为什么是当天行情的一部分。
- 不复述完整快报。
- 可给出链接或“延伸阅读”。
- 如果快报不是当天主线，不强行出现。

今日观察是一篇当天市场综述，不是站内内容列表。它引用趋势快报，是因为快报帮助解释行情，不是因为系统生成了这篇文章。
