---
legacy_batch_id: legacy-trends-20260507
asset_type: trend-context
source_scope: V1 Trends
converted_at: 2026-05-07
status: legacy-candidate
production_readiness: candidate
encoding: UTF-8
---

# V1 Trends -> V2 Trend Context

## Source

- source_path: `10-Archive/v1.0/source-dirs/03-Trends/AI趋势总表.md`
- source_date: updated 2026-05-05
- converted_at: 2026-05-07
- v2_id: `legacy-trend-context-main`
- v2_destination: `01-SiteV2/content/05-trend-chain/legacy/`

## V2 Conversion

V1 Trends 不恢复为独立前台频道。它转为：

- 机会解码详情中的趋势背景。
- 商业内参热力输入。
- Admin 长期趋势资产。

## Trend Context Candidates

| trend_context_id | legacy_trend | V2 role | related_opportunity_ids | evidence_gaps |
|---|---|---|---|---|
| `legacy-trend-ai-marketing` | AI营销 | 机会解码与商业内参背景 | AI营销Agent, 中小商家AI营销对话平台, AI增长Agent | 需要补 2026-05-06 后续证据和反证 |
| `legacy-trend-ai-customer-service` | AI客服/语音Agent | 客服 Agent / 语音入口迁移背景 | AI企业客服执行Agent, AI语音客服首轮分流助手, AI客服质检与工单智能Agent | 需要补客户采用、定价和投诉率数据 |
| `legacy-trend-ai-agent` | AI Agent | 企业 Agent 工作平台和控制平面背景 | 企业Agent工作平台, 企业数据智能体控制平面, Agent治理与权限审计服务 | 需要补客户案例和治理预算证据 |
| `legacy-trend-ai-governance` | AI治理 | Agent 权限、审计、合规边界 | Agent治理与权限审计服务 | 需要补监管和企业采购证据 |
| `legacy-trend-ai-coding` | AI Coding | 企业开发安全工作区 / 一人公司工具链背景 | AICoding驱动一人公司工具链, AI基础设施托管服务 | 需要补团队采用和企业安全案例 |

## V2 六维重写

- 解决什么具体问题：Trend Context 解释机会方向是否有持续证据积累。
- 谁最先感受到：机会解码读者、商业内参会员、Admin 审核者。
- 改变了哪段流程：从独立趋势页改为嵌入机会报告和内参热力判断。
- 价值从哪里来：减少单日热点误判，说明升温、降温、争议和成熟。
- 触发信号是什么：连续 Signal、Scoring、Point 和 Opportunity 的交叉出现。
- 成立边界是什么：趋势必须有跨日期证据和反证，不能只靠标题或热度。
