# WSD-20260504-15-signal-keyword-source-optimization 派发单

日期：2026-05-04  
状态：dispatched  
调度窗口：当前主窗口  
牵头 Agent：`data` / Intelligence Data Agent  
协作 Agent：`workflow` / `pm`

## 1. 任务目标

- 优化每日 AI 商业雷达的监测关键词和来源策略，提高每日 Signal 质量。
- 修正当前信号过度偏向“大企业 / 大融资 / 高曝光公司”的风险。
- 增加对以下早期变化的捕捉能力：
  - 新趋势萌芽。
  - 新投资方向。
  - 小额起步融资、pre-seed、seed、angel、grant、accelerator、stealth 等早期融资信息。
  - 技术更新迭代方向。
  - 开源项目、开发者生态、模型能力、基础设施、协议、工具链、部署方式、成本变化。
  - 垂直行业小场景、客户试点、设计伙伴、早期付费、招投标、插件/市场上架。
- 输出可被 `ai-2` 每日商业雷达使用的新版关键词 / 来源 / 查询组合策略。

## 2. 关键判断

本任务不是简单把关键词变多，而是建立更均衡的监测结构：

```text
大企业和大融资 = 成熟信号
早期融资和开源/技术迭代 = 早期信号
客户试点和垂直落地 = 需求侧信号
政策/监管/诉讼/安全 = 反证信号
```

目标是让每日 Signal 既能看到 OpenAI、Google、Microsoft、Anthropic 这类大公司变化，也能看到还未进入主流媒体的大方向变化。

## 3. 非目标

- 不为了追早期而降低 Signal 标准。
- 不把普通 AI 工具教程、泛资讯、观点文章、社媒热帖直接升为 Signal。
- 不把没有商业证据的技术更新写成机会。
- 不把关键词无限扩张成噪音池。
- 不改网站页面。
- 不改 `04-Site/`。
- 不改同步脚本。
- 不改数据模型。

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization.md`
5. `agent-workflow/agents/data-agent.md`
6. `agent-workflow/product/source-intelligence.md`
7. `agent-workflow/product/signal-system.md`
8. `agent-workflow/product/tag-taxonomy.md`
9. `agent-workflow/product/intelligence-data-model.md`
10. `agent-workflow/reports/keyword-quality-weekly-2026-18.md`
11. `agent-workflow/reports/daily-radar-run-2026-05-04.md`
12. `提示词/关键词列表.md`
13. `提示词/监测提示词V4.0.md`
14. `提示词/AI机会评分与趋势判断系统V4.0.md`

可选读取：

- 最近 3-5 天 `01-Signals/` 与 `02-Scoring/`。
- `agent-workflow/reports/relation-check-latest.md`。
- `agent-workflow/reports/tag-quality-check-latest.md`。

## 5. 允许改动范围

- `提示词/关键词列表.md`
- `提示词/监测提示词V4.0.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/signal-system.md`
- `agent-workflow/reports/signal-keyword-source-optimization-2026-05-04.md`
- `agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`

如确需更新：

- `agent-workflow/daily-run-log.md`
- `agent-workflow/progress.md`

必须说明原因。

## 6. 禁止改动范围

- `04-Site/`
- `01-Signals/` 正式历史内容，除非只读分析。
- `02-Scoring/` 正式历史内容，除非只读分析。
- `03-Trends/`
- `05-point/`
- `07-Opportunities/`
- 自动化任务配置对象。
- 同步脚本、关系检查脚本、统一同步脚本。

## 7. 需要重点补齐的监测维度

### 7.1 早期融资与投资方向

必须补充或强化：

- pre-seed AI
- seed AI startup
- angel round AI
- stealth AI startup
- emerging AI startup
- AI startup accelerator
- YC AI startup
- AI grant
- AI research spinout
- university spinout AI
- AI 投资方向
- AI 早期融资
- AI 种子轮
- AI 天使轮
- AI 孵化器
- AI 创业加速器
- AI 高校转化

要求：

- 不只看融资金额，也看“投向什么新方向”。
- 小额融资必须说明为什么不是普通创业新闻。
- 早期融资要优先连接技术变化、客户试点、开源采用或垂直需求。

### 7.2 技术更新迭代方向

必须补充或强化：

- AI model release
- LLM benchmark improvement
- inference cost reduction
- context window
- multimodal AI update
- voice model
- video model
- agent protocol
- MCP
- tool use
- AI memory
- evals
- synthetic data
- AI observability
- model routing
- on-device AI
- small language model
- open-source model
- GitHub trending AI
- AI SDK
- AI API update
- 模型更新
- 推理成本
- 上下文窗口
- 多模态更新
- Agent 协议
- AI 记忆
- AI 评测
- 端侧 AI
- 小模型
- 开源模型
- 开发者工具

要求：

- 技术更新只有在能影响成本、部署、客户场景、开发者采用或商业模式时才进入 Signal。
- 不把纯 benchmark 新闻当作商业信号。

### 7.3 开源与开发者生态

必须补充或强化：

- open-source AI agent
- GitHub AI agent
- developer adoption AI
- AI framework release
- AI plugin marketplace
- agent framework
- AI workflow framework
- AI coding framework
- AI infra open source
- 开源 AI Agent
- AI 开源项目
- AI 开发框架
- AI 插件市场
- Agent 框架
- AI 工作流框架

要求：

- 关注 GitHub stars 变化、社区采用、企业集成、云市场上架、商业公司围绕开源项目融资或商业化。
- 不把普通开源发布当作 Signal，必须有采用、融资、生态或商业化线索。

### 7.4 垂直场景与早期客户采用

必须补充或强化：

- design partner AI
- pilot customer AI
- first customer AI
- AI procurement
- AI tender
- AI workflow deployment
- vertical AI startup
- industry-specific AI agent
- AI for legal ops
- AI for accounting firms
- AI for insurance claims
- AI for clinics
- AI for manufacturing QA
- AI for logistics
- 设计伙伴
- 首批客户
- AI 试点客户
- AI 招投标
- 垂直 AI
- 行业 AI Agent
- 法务运营 AI
- 会计事务所 AI
- 保险理赔 AI
- 诊所 AI
- 制造质检 AI
- 物流 AI

要求：

- 提高小场景信号的发现能力。
- 客户试点和招投标可以比融资更早反映需求。

### 7.5 反证与降温信号

必须补充或强化：

- AI startup shutdown
- AI churn
- AI gross margin
- AI inference cost pressure
- AI lawsuit
- AI copyright risk
- AI security incident
- AI privacy enforcement
- AI hallucination failure
- AI regulation enforcement
- AI 裁员
- AI 关闭
- AI 流失
- AI 毛利压力
- AI 推理成本压力
- AI 版权风险
- AI 安全事件
- AI 隐私处罚
- AI 幻觉事故
- AI 监管执法

要求：

- 每日雷达不只报机会，也要捕捉反证。
- 反证词不能单独作为主搜索词，必须和赛道词组合。

## 8. 输出要求

执行窗口必须输出：

1. 新版关键词结构：P0 / P1 / P2 或“成熟信号 / 早期信号 / 技术迭代 / 需求侧 / 反证”分层。
2. 更新后的 `提示词/关键词列表.md`。
3. 对 `提示词/监测提示词V4.0.md` 的更新，使每日监测明确覆盖早期融资、技术迭代和新趋势。
4. 更新 `source-intelligence.md`，说明早期来源、开发者来源、投资来源、垂直行业来源如何分层。
5. 生成报告：`agent-workflow/reports/signal-keyword-source-optimization-2026-05-04.md`。
6. 生成 UTF-8 closeout：`agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`。

## 9. 验收标准

- 关键词库不再只偏向大企业、大融资和高曝光新闻。
- 每类新增关键词都有使用边界，避免噪音。
- 每日监测提示词明确要求覆盖：
  - 大企业变化。
  - 大融资。
  - 早期融资。
  - 新趋势。
  - 技术迭代。
  - 开源 / 开发者生态。
  - 垂直行业试点。
  - 反证与降温。
- 必须给出组合查询示例，不只给单词列表。
- 必须说明哪些来源只作为线索，哪些可作为高置信 Signal 证据。
- 必须说明对 `ai-2` 的影响。

## 10. 必跑检查

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] UTF-8 读取检查：新改 Markdown 文件不能乱码。

如修改了 JSON 或脚本才需要额外语法检查；默认本任务不改脚本。

## 11. 自动化影响

本任务可能影响：

- `ai-2`：会影响每日商业雷达生成时的搜索范围、关键词池、来源策略和 Signal 入选平衡。

预计不影响：

- `ai-the-point`：除非改 The Point 来源池，本任务默认不改。
- `ai-3`：除非改同步闸门或检查规则，本任务默认不改。

执行窗口必须在 closeout 中写明：

- 是否需要后续更新 `ai-2` 自动化提示词或运行说明。
- 是否需要观察下一次每日雷达结果。
- 是否需要建立每周关键词质量复盘。

## 12. 执行窗口启动提示词

如果复制长提示词不方便，可直接让执行窗口读取：

```text
agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization-window-prompt.md
```
