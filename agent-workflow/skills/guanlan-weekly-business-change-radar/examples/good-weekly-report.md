# Good Weekly Report Example

Key characteristics of a well-executed weekly radar:

## Headline (good)

```markdown
# AI Coding 越便宜，软件需求反而越多：真正稀缺的是交付责任
```

Good: one evidence-bounded judgment, a counter-intuitive tension, and a concrete business consequence.

## §0 Data Scope (good)
```markdown
- Signals：`v3-data-observation-desk.json`，窗口内 101 张 Business Signal Cards，其中案例 44、产品 38、融资 19。
- Opinions：`follow-builders-daily.json`，窗口内 44 条 First-Line Viewpoints，其中产品与创业 33、AI 基础设施 6、AI 编程 5。
- Community：`community-intelligence-daily/*.json`，窗口内按 URL 优先、标题辅助粗去重后约 44 条。
- 边界：Opinions 和 Community 只用于解释权与需求互证，不作为 Business Signal Card 的事实证据。
```

Good: exact numbers, named JSON files, clear boundary statement.

## §1 One-Sentence Conclusion (good)
```markdown
本周 AI 商业变化的主线是：**AI 正在从「单点工具试用」转向「嵌入业务流程的 Agent / 工作流系统」**，同时市场机会从「做一个更强模型或通用工具」转向「帮企业、个人工作室和垂直行业把 AI 接进真实交付、获客、知识沉淀和治理体系」。
```

Good: one clear thesis, followed by signal/opinion/community evidence breakdown.

## §2 Trend Heatmap (good)

| 排名 | 升温主题 | 上周状态 | 本周状态 | 证据来源 | 本周判断 |
|---:|---|---|---|---|---|
| 1 | 企业工作流 Agent 化 | 分散出现 | 密集爆发（58张卡） | S+O+C 三方全强 | 趋势成立 |

Good: ranked by velocity, shows prior-week vs this-week state, cites evidence sources.

## §3 Trend Chain (good)
```markdown
### 趋势链 A：企业 AI 从试点走向运营重构

**事实变化**：Signals 中企业工作流相关卡片 58 张。典型信号：Sandstone 为内部法务团队融资 3000 万美元、Jedify 为企业 Agent 提供业务上下文。

**观点变化**：Dataiku 明确把企业 AI 转型问题指向组织设计、系统连接和治理。

**用户行为变化**：社群高频痛点从「要不要用 AI」转为「怎么把 AI 嵌入业务流程」。

**商业模式变化**：企业 AI 服务的价值不在卖账号，而在流程诊断、知识库重构、Agent 权限设计。

**创业机会变化**：不做通用 AI 工具，做「特定岗位的 AI 工作流系统」。
```

Good: five steps, ≥2 specific company/product/amount signals, named opinion source, community grounding, concrete business impact.

## §5 Opportunity Card Scoring (good)
```markdown
| 评分项 | 满分 | 得分 | 理由 |
|--------|-----|------|------|
| 痛点强度 | 25 | 22 | 中小企业 AI 落地是真痛点，但非生存级刚需 |
| 付费能力 | 20 | 17 | 项目制客单价可接受，企业有预算 |
| 供给缺口 | 20 | 18 | 工具多但缺服务整合，一体化交付几乎空白 |
| 时机变化 | 15 | 14 | Agent 能力提升使服务可规模化程度提高 |
| 获客路径 | 10 | 8 | 可通过内容和社群触达，但转化周期长 |
| 团队可做性 | 10 | 7 | 需要行业知识和交付能力，非纯技术问题 |
| 风险扣分 | -20 | 0 | 无明显致命风险 |
```

Good: every dimension has a specific score and reason, not generic commentary.
