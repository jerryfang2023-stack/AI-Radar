---
task_id: WSD-20260508-02-v2-content-site-daily-automation
board_id: V2-DAILY-AUTO
title: V2 每日内容抓取、入库与本地网站更新自动化
date: 2026-05-08
status: active
lead_agent: Workflow / Automation Agent
support_agents:
  - V2 Source Intelligence Agent
  - V2 Heatmap Algorithm Agent
  - Dev Agent
  - QA / Acceptance Agent
encoding: UTF-8
automation_id: v2-content-site-daily-update
---

# V2-DAILY-AUTO｜V2 每日内容抓取、入库与本地网站更新自动化

## 1. 自动化状态

已创建 Codex app automation：

- 名称：`v2-content-site-daily-update`
- 状态：active
- 频率：每日早上 09:00
- 工作目录：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight`
- 执行环境：local

## 2. 任务目标

每天自动执行 V2 内容生产链路：

1. 优先读取 `01-SiteV2/content/10-databases/source-registry-v2.json`。
2. 按 source registry 原始抓取 80-150 条 AI 商业候选线索，低信号或接口失败日可降级为 50-80 条。
3. 初筛 20-30 条进入 pool。
4. 结构化 8-15 条 Signal。
5. 精选 3-5 条前台关键信号，默认 3 条，只有高信号日扩展到 4-5 条。
6. 生成 1-2 条机会解码 / deep dive；第 2 条只能在证据链充足时生成，不能硬凑。
7. 更新 3-5 条趋势链，并生成 Point Calibration、Insight、HeatEvidence / DB 更新所需内容。
8. 按商业内参深度标准生成展示元素：时间线、热力图、雷达图、趋势图、机会地图、证据梯子或内参符号。
9. 写入 `01-SiteV2/content/`。
10. 运行 source quality gate、`v2content` 质量闸门。
11. 如果 V2 site data generator 已存在，则更新 `01-SiteV2/site/data/`。
12. 运行 syntax 检查。
13. 写入 UTF-8 日志 / closeout 到 `agent-workflow/reports/`。

## 2A. Source Registry 与扩大采集口径

每日自动化启动时必须先读取：

```text
01-SiteV2/content/10-databases/source-registry-v2.json
agent-workflow/v2/v2-daily-source-collection-strategy.md
agent-workflow/v2/v2-commercial-brief-depth-standard.md
```

采集三档：

| 场景 | Raw | Pool | Structured | Front Signals | Deep Dive | Trend Updates |
|---|---:|---:|---:|---:|---:|---:|
| 日常默认 | 80-120 | 20-25 | 8-12 | 3 | 1 | 3 |
| 高信号日 | 120-150 | 25-30 | 12-15 | 4-5 | 1-2 | 4-5 |
| 降级日 | 50-80 | 12-20 | 5-8 | 2-3 | 0-1 | 1-3 |

记录要求：

- Raw 必须写清 `source_distribution`，至少覆盖官方产品 / 高质量媒体 / 开发者研究 / 融资创业 / C 级线索中的 4 类。
- AI HOT、follow-builders、HN、X、Reddit 等先作为采集通道，不直接计入事实证据；必须解析原始 URL 后再给原始来源定 S/A/B/C。
- 如 source probe 或接口失败，必须记录失败接口、错误、降级来源和缺口。
- 不得因为接口失败就把单一搜索结果伪装成多源结果。
- 第 2 条 Deep Dive 只有在至少 5 个来源、反证和商业模式都充足时生成。

### 2B-A. A 类确认后的抓取流程硬规则

以下规则已在 `WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance` 的 A 类确认后生效：

- 旧 Raw 30-50 口径废止；V2 每日自动化默认只接受 Raw 80-150，低信号或关键接口失败日可降级为 50-80。
- 降级不是失败遮盖。降级日必须写清触发原因、失败来源、替代来源、未补齐证据和是否影响 Front Signal / Deep Dive。
- AI HOT、follow-builders、HN、X、Reddit、聚合站统一视为 `M` 级 discovery / source-router，不得直接写成事实主证据。
- M 级通道命中的每条候选必须回看原始 URL；只有解析后的原始来源被重新判为 S/A/B，才可作为 Structured / Front Signal 的事实证据。
- 每日日志必须包含 `source_distribution`、`failed_sources`、`fallback_used`、`evidence_gaps`、`raw_count_by_source_type`、`front_signal_sab_source_count` 六个字段；缺任一字段不得报告为完整完成。
- 若某类来源当天为空，应记录缺口和影响，不得用 C / M 级线索补成 S/A/B 来源数量。

### 2B-B. B 类确认后的 Trend 输入算法

Trend Updates 采用“热度轴 + 证据轴”：

- 热度轴读取 Raw / Pool：用于判断声量、扩散速度、重复事件密度、多来源同题频率和风险升温。
- 证据轴读取 Structured / Front / 历史 Signals：用于判断商业证据、趋势阶段、连续性和反证边界。
- Point Calibration 只用于校准共识、分歧、假设和反证，不替代事实证据。
- Deep Dive 只补强机会侧和商业模式判断，不作为趋势唯一来源。

高热但未入 Structured Signal / Front Signal 的内容必须保存为：

```text
01-SiteV2/content/05-trend-chain/YYYY-MM-DD-heat-candidates.md
```

Heat Candidates 用于记录高热主题、重复事件、来源扩散、未入选 Signal 的原因和所需补证。它们不进入前台关键信号，也不进入正式 Signal / Trend / Opportunity 知识库；但应同步沉淀到 `01-SiteV2/knowledge/11-Heat-Candidates/`，作为观察型知识资产，用于 7 / 30 / 90 天回看、重复热度累计和未来升级回链。

### 2B-C. B 类确认后的各阶段最低质量门槛

每日漏斗数量达标不等于质量达标。以下字段为硬门槛：

- Raw：每条必须有本地原文档案；没有本地原文档案的线索不计入 Raw 数量。
- Pool：每条必须有入池理由和淘汰风险。
- Structured：每条必须有事件、商业变量、来源等级、反证或证据边界、趋势候选，正文 1200-2000 中文字。
- Front：每条固定至少 3 个解析后的 S/A/B 原始来源，正文 3000-5000 中文字。
- Deep Dive：每条固定至少 5 个来源，其中至少 2 个 S 级或一手来源，正文 6000-10000 中文字。
- Point：每条必须有原始观点、观澜解读和关联关系。
- 所有事实引用、数据、融资、客户案例、产品发布、监管、观点和参数必须带来源名、来源等级、原始外链和该来源提供的增量事实。

缺失任一硬门槛时，不得报告为每日生产完整完成；应写入 evidence gaps，并按 partial / needs_review / failed 处理。

### 2B-D. B 类确认后的数量不足处理

数量不足时按降级运行，不用低质量内容硬凑：

- Raw：80-150 为完整运行；50-79 为降级运行；低于 50 为严重降级，仍然有多少抓多少，并写清失败来源、尝试路径和缺口。
- Front：不足 3 条时允许发布 2 条，并写明缺口；低于 2 条不得伪装成前台完整更新。
- Deep Dive：无足够证据时明确写“今日暂无足够证据支撑深挖内参”，不得硬凑。
- Trend Updates：不足 3 条时允许只更新 1-2 条，并写明缺口、缺少的趋势证据和后续观察。

降级日必须保留 Raw 原文档案、日志字段和 evidence gaps。M / C 级来源不得因数量不足被提升为 S/A/B。

### 2B-E. B 类确认后的重复与合并规则

- 同一事件多来源命中时，合并为一条资产，保留 `source_cluster`；S 级来源作为主来源，A/B 来源补充语境，M 级通道只记录发现路径。
- 同一公司连续多天出现时，默认更新旧 Signal 或 Heat Candidate，并追加热度说明或变化说明；只有新事件类型、新商业变量或新趋势候选出现时，才新建 Signal。
- Heat Candidate 升级为 Signal / Trend 后，原候选必须标记 `converted_to`，新 Signal / Trend 必须标记 `origin_heat_candidates`，不得删除原候选。

### 2B-F. B 类确认后的反证、风险、字数与 gate 边界

- Structured / Front 不强制每条都有反证；未发现反证时写清证据边界或 `counter_evidence_status`，不得编造。
- 风险类高热内容进入 `risk trend` 或 `counter-evidence` 候选。
- 只有利好、没有反证的 Deep Dive 可以通过，但必须说明本轮未发现关键反证；证据不足不得通过。
- Structured 1200-2000 中文字为硬门槛。
- Front 3000-5000 中文字为硬门槛。
- Deep Dive 6000-10000 中文字为硬门槛。
- 字数达标但证据不足，不得通过。
- 引用必须有新闻源 / 原始来源和外链；M/C 级通道不得替代原始外链。
- B 类已按用户确认同步升级 `v2content` gate 脚本，F 类再检查确认一次是否作为正式硬阻塞。

## 2C. 商业内参深度、可读性与展示元素

每日内容必须符合：

```text
agent-workflow/v2/v2-commercial-brief-depth-standard.md
```

总体要求：

- 面向普通老板写，不默认读者懂模型、论文、框架或开发者术语。
- 可以专业，但每个专业判断必须落到客户、成本、收入、效率、风险、采购、渠道或竞争位置。
- 不写 AI 味、机械味和模板味；不使用空泛句式替代判断。
- 生成正文前必须先生成结构化字段：一句话判断、商业变量、受影响对象、证据梯子、反证边界、展示元素数据。

### 每日信号展示

每条 Front Signal 至少包含 3 类展示元素：

- 时间线：事件、发布、融资、客户、竞品或监管节点。
- 影响坐标：行业 / 岗位 / 流程。
- 证据梯子：S/A/B 原始证据与 M 级采集通道分开展示。
- 商业变量卡：成本、收入、效率、风险、采购。
- 反证卡：尚缺客户、价格、合规、规模化或留存中的哪些证据。

### 深挖机会卡展示

每条 Deep Dive 至少包含 5 类展示元素：

- 机会地图：痛点 -> 解决方案 -> 买单者 -> 交付方式。
- 玩家分层图：大厂、创业公司、开源、集成商、渠道方。
- 商业模式表：收费方式、适合客户、毛利假设、规模化难点。
- 验证清单：客户、价格、复购、部署、合规、渠道。
- 雷达图或风险雷达：需求强度、付费能力、成熟度、竞争、落地难度、证据强度。

### 趋势链展示

每条 Trend Update 至少包含 4 类展示元素：

- 趋势阶段条：萌芽、验证、早期商业化、规模化、降温、风险暴露。
- 趋势线：7 / 30 / 90 天信号数量或强度变化。
- 热力图：行业 x 流程的热度与变化方向。
- 信号簇图：3-5 个相关信号构成趋势，不用单点新闻冒充趋势。
- 推力 / 阻力双栏。
- 升级 / 降级触发器。

### 白话表达闸门

内容生成后必须自检：

- 普通老板是否能在前 30 秒知道“这事和我有什么关系”。
- 每个术语是否有白话解释。
- 每段是否有事实、解释或判断，不能只有铺垫。
- 是否把“值得关注”“潜力巨大”“生态形成”等空话替换成具体业务变量。
- 是否写清楚“还不知道什么”，而不是装作判断已经完成。

## 2B. 联网二搜与深度写作硬要求

自动化不得只完成数量型产出。每日 `04-selected-signals` 和 `08-opportunities/deep-dive` 必须按算法规范完成联网二次搜索和字数门槛。

### 精选 3 条 Front Signal

每条精选 Signal 必须：

- 联网二搜并补齐至少 3 个 `S/A/B` 来源。
- 必须覆盖三类补证：官网 / 产品或公告、融资 / 投资人或可靠商业来源、客户 / 案例 / 定价 / 部署信号。
- 每个来源写清提供了什么增量事实。
- 采集通道不能写成事实主证据；AI HOT / follow-builders / HN 等线索必须回看原始 URL，并按原始来源重新判定 S/A/B/C。
- 每条正文达到 `3000-5000` 中文字的深度信号报告，不得只写卡片摘要。
- 必须包含：发生了什么、为什么重要、商业含义、谁应该关注、二次搜索补强、观澜判断、反证与边界、未入选对比、后续观察。

### Opportunity Deep Dive

如当天生成 deep dive，必须：

- 联网重搜索并完成至少 5 个来源，其中至少 2 个 `S` 级或一手来源。
- 正文达到 `6000-10000` 中文字，作为内参级深度报道，不得写成泛泛机会卡。
- 必须完成 5 类交叉验证：代表公司、融资信号、客户场景、定价 / 商业模式、落地约束。
- 必须包含 `证据链` 与 `反向证据`，并写明未找到的关键证据。
- 证据不足时，正确输出是 `今日暂无足够证据支撑深挖内参。`，不得硬凑。

### Point Calibration

如当天生成 Point Calibration，每条 Point 必须保留三层信息：

- `原始观点`：来自来源材料的观点摘要或原始观点提炼，不得只写标题。
- `观澜解读`：说明这条观点如何修正、支持或质疑某个商业判断。
- `关联`：必须写入 `relation_fields`，至少关联 Signal / Trend / Opportunity / Risk / Point 中的一类。

Point 只能作为观点校准、假设或反证边界，不能替代事实主证据。

### 失败处理

如果网络、搜索或来源访问失败：

- 不得报告完成。
- 必须写明失败来源、尝试过的检索词、降级路径、未补齐的证据和下一步。
- `v2content` 闸门失败时，不更新网站数据为“已完成态”。

## 3. 输入范围

自动化必须读取：

- `AGENTS.md`
- `docs/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/v2/v2-production-pipeline-cutover.md`
- `agent-workflow/v2/v2-data-schema-minimum.md`
- `agent-workflow/v2/v2-copy-editorial-system.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/site/README.md`

## 4. 硬边界

- 不恢复旧 `04-Site`。
- 不写入 V1 内容目录。
- 不处理 `09-ai-news-radar`，除非用户后续明确放开。
- 不做 Netlify production deploy。
- 不切正式域名。
- 不把 legacy candidates 未经精修直接作为正式前台内容。
- 失败时必须写清失败阶段、尝试路径、降级处理和下一步，不得报告完成。

## 5. 验收口径

每日成功必须同时满足：

- Raw / Pool / Structured / Front Signals 数量达标。
- 每条 Front Signal 通过联网二搜、3 个 S/A/B 来源和 `3000-5000` 字深度门槛。
- 如有 Opportunity Deep Dive，必须通过 `6000-10000` 字、5 类交叉验证、证据链和反向证据门槛。
- 如有 Point Calibration，每条必须包含来源、原始观点、观澜解读、V2 用法和关联关系。
- 当日内容写入 `01-SiteV2/content/`。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=<date>` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 如果站点数据生成器存在，`01-SiteV2/site/data/` 已更新；如果不存在，日志写清阻塞。

## 6. 说明

本自动化是 V2 新生产链路，不是旧 `ai-2` / `ai-3` / `ai-the-point` 的恢复。
