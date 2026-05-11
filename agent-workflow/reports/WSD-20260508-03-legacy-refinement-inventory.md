---
title: V2 Legacy Refinement Inventory
date: 2026-05-08
task_id: WSD-20260508-03-v2-legacy-candidates-refinement-autopilot
board_id: V2-LEGACY-REFINE-AUTO
status: completed
owner: Intelligence Data Agent / Workflow Agent
encoding: UTF-8
---

# V2 Legacy Refinement Inventory

## 1. 判断口径

本轮只精修已进入 `01-SiteV2/content/` 的 legacy candidates，不原样发布 V1 文档。判断结果分为：

- `publish-ready`：可作为 V2 站点内容或关系资产进入 generated data。
- `hold`：有判断价值，但来源、反证、去重或关系字段不足。
- `reject`：浅新闻、过时素材或不符合 V2 产品边界。

## 2. Inventory 表

| candidate_id | source_legacy_path | candidate_type | original_date | current_v2_path | duplicate_group | evidence_status | publish_decision | reason |
|---|---|---|---|---|---|---|---|---|
| `legacy-opportunity-customer-service-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI企业客服执行Agent.md` | Opportunity | legacy / 2026-05-06 | `01-SiteV2/content/08-opportunities/deep-dive/legacy/v1-opportunity-report-candidates-2026-05-07.md` | `DG-CX-Agent` | partial | publish-ready | 与客服执行、语音分流、客户体验平台合并后，可作为客户前台运营方向进入机会索引。 |
| `legacy-opportunity-voice-cs-triage` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI语音客服首轮分流助手.md` | Opportunity | legacy / 2026-05-06 | same | `DG-CX-Agent` | partial | publish-ready | 不单独发布，合并进 `客户体验 Agent 平台`，作为语音入口证据。 |
| `legacy-opportunity-customer-experience-platform` | `10-Archive/v1.0/source-dirs/07-Opportunities/企业客户体验Agent平台.md` | Opportunity | legacy / 2026-05-06 | same | `DG-CX-Agent` | sufficient | publish-ready | 标题方向符合 V2，六维和边界可补齐，进入 `LEGACY-OPP-20260508-01`。 |
| `legacy-opportunity-professional-services-workflow` | `10-Archive/v1.0/source-dirs/07-Opportunities/专业服务AI工作流平台.md` | Opportunity | legacy | same | `DG-Professional-Service` | partial | publish-ready | 与专家知识 Agent 化合并后方向清晰，按 observation 状态发布。 |
| `legacy-opportunity-expert-knowledge-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/行业专家知识Agent化.md` | Opportunity | legacy | same | `DG-Professional-Service` | partial | publish-ready | 不单独发布，作为专业服务交付流程证据。 |
| `legacy-opportunity-agent-governance-audit` | `10-Archive/v1.0/source-dirs/07-Opportunities/Agent治理与权限审计服务.md` | Opportunity | 2026-04-28 | same | `DG-Agent-Control` | sufficient | publish-ready | 与 2026-05-07 V2 深挖高度重合，作为合并发布资产进入关系网。 |
| `legacy-opportunity-enterprise-agent-workspace` | `10-Archive/v1.0/source-dirs/07-Opportunities/企业Agent工作平台.md` | Opportunity | legacy | same | `DG-Agent-Control` | partial | publish-ready | 不新建方向，合并进 Agent 控制与审计层。 |
| `legacy-opportunity-doc-finance-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/企业文档与财务流程Agent.md` | Opportunity | legacy / 2026-05-06 | same | `DG-Procurement-AP` | sufficient | publish-ready / merged-existing | 已由 2026-05-06 `采购应付 Agent 运营层` 承接，本轮只在索引中标记合并，不新增前台卡。 |
| `legacy-opportunity-ai-growth-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI增长Agent.md` | Opportunity | legacy | same | `DG-Marketing` | weak | hold | ROI、留存和渠道规则证据不足。 |
| `legacy-opportunity-marketing-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI营销Agent.md` | Opportunity | legacy | same | `DG-Marketing` | weak | hold | 与增长 Agent / 中小商家营销对话重复，需补真实增长数据。 |
| `legacy-opportunity-smb-marketing-chat` | `10-Archive/v1.0/source-dirs/07-Opportunities/中小商家AI营销对话平台.md` | Opportunity | legacy | same | `DG-Marketing` | weak | hold | 付费意愿和平台规则边界不足。 |
| `legacy-opportunity-one-person-coding-stack` | `10-Archive/v1.0/source-dirs/07-Opportunities/AICoding驱动一人公司工具链.md` | Opportunity | legacy | same | `DG-AI-Coding` | partial | hold | 与 2026-05-07 Governed AI Coding 有关，但商业化与留存证据不足。 |
| `legacy-opportunity-ai-infra-hosting` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI基础设施托管服务.md` | Opportunity | legacy | same | `DG-AI-Coding` | partial | hold | 有工程价值，但需补企业采用和成本模型。 |
| `legacy-opportunity-memory-layer` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI记忆层基础设施.md` | Opportunity | legacy | same | `DG-Agent-Memory` | partial | hold | 与 2026-05-07 Point 相关，但隐私、删除和审计证据不足。 |
| `legacy-opportunity-bidding-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI招投标Agent.md` | Opportunity | legacy | same | `DG-Document-Workflow` | partial | hold | 场景具体，但缺真实投标效率和合规证据。 |
| `legacy-opportunity-medical-imaging-ai` | `10-Archive/v1.0/source-dirs/07-Opportunities/临床影像AI辅助诊断平台.md` | Opportunity | legacy | same | `DG-Regulated-Vertical` | weak | hold | 监管和临床验证不足，不适合前台发布。 |
| `legacy-opportunity-engineering-simulation` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI工程仿真软件.md` | Opportunity | legacy | same | `DG-Industrial-AI` | weak | hold | 工程精度与行业案例不足。 |
| `legacy-opportunity-embodied-control-stack` | `10-Archive/v1.0/source-dirs/07-Opportunities/具身智能控制栈与评测平台.md` | Opportunity | legacy | same | `DG-Embodied-AI` | weak | hold | 商业化周期长，客户和量产证据不足。 |
| `legacy-opportunity-logistics-robot` | `10-Archive/v1.0/source-dirs/07-Opportunities/具身智能物流机器人.md` | Opportunity | legacy | same | `DG-Embodied-AI` | weak | hold | 单位经济模型与部署证据不足。 |
| `legacy-opportunity-edge-inference-stack` | `10-Archive/v1.0/source-dirs/07-Opportunities/端侧推理芯片与软件栈.md` | Opportunity | legacy | same | `DG-Edge-AI` | weak | hold | 方向重要但与 V2 当前四栏目关系弱，需后续单独补证。 |
| `legacy-point-20260506-claude-code-auto-mode` | `10-Archive/v1.0/source-dirs/05-point/2026-05-06-The-Point.md` | Point | 2026-05-06 | `01-SiteV2/content/07-points/legacy/v1-point-calibration-candidates-2026-05-07.md` | `DG-Agent-Control` | partial | publish-ready | 可作为 Agent 控制层与 AI Coding 治理校准。 |
| `legacy-point-20260506-crabbox-debug` | same | Point | 2026-05-06 | same | `DG-AI-Coding` | partial | publish-ready | 可作为 AI Coding 工程基础设施校准。 |
| `legacy-point-20260506-voice-interface` | same | Point | 2026-05-06 | same | `DG-CX-Agent` | partial | publish-ready | 可作为客户体验 Agent 平台的语音入口校准。 |
| `legacy-point-calibration-20260503` | `10-Archive/v1.0/source-dirs/05-point/2026-05-03-The-Point.md` | Point | 2026-05-03 | same | `DG-Point-Archive` | weak | hold | 需拆分人物、来源和立场。 |
| `legacy-point-calibration-20260504` | `10-Archive/v1.0/source-dirs/05-point/2026-05-04-The-Point.md` | Point | 2026-05-04 | same | `DG-Point-Archive` | weak | hold | 需复核短链、timecode 和授权边界。 |
| `legacy-point-calibration-20260505` | `10-Archive/v1.0/source-dirs/05-point/2026-05-05-The-Point.md` | Point | 2026-05-05 | same | `DG-Point-Archive` | weak | hold | 需明确支持 / 质疑 / 边界角色。 |
| `legacy-signal-20260506-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-06-AI商业雷达.md` | Signal | 2026-05-06 | `01-SiteV2/content/03-structured-signals/legacy/v1-signals-legacy-candidates-2026-05-07.md` | `DG-20260506` | sufficient | publish-ready | 可拆为客服 Agent 与 Agent 治理两个合并信号。 |
| `legacy-signal-20260502-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-02-AI商业雷达.md` | Signal | 2026-05-02 | same | `DG-Agent-Control` | partial | publish-ready | 作为治理连续性证据，合并进 LS-20260508-02。 |
| `legacy-signal-20260429-batch` - `legacy-signal-20260505-batch` | `10-Archive/v1.0/source-dirs/01-Signals/` | Signal | 2026-04-29..2026-05-05 | same | `DG-Historical-Signal` | weak / partial | hold | 多数缺来源等级、逐条反证或已与 V2 内容重复。 |
| `legacy-trend-ai-customer-service` | `10-Archive/v1.0/source-dirs/03-Trends/AI趋势总表.md` | Trend | 2026-05-05 | `01-SiteV2/content/05-trend-chain/legacy/v1-trend-context-2026-05-07.md` | `DG-CX-Agent` | partial | publish-ready | 可作为客户体验 Agent 背景。 |
| `legacy-trend-ai-governance` / `legacy-trend-ai-agent` | same | Trend | 2026-05-05 | same | `DG-Agent-Control` | sufficient | publish-ready | 与 2026-05-07 控制层趋势合并。 |
| `legacy-trend-professional-services-ai` | same | Trend | 2026-05-05 | same | `DG-Professional-Service` | partial | publish-ready | 可作为专业服务 AI 背景。 |
| `legacy-trend-ai-marketing` | same | Trend | 2026-05-05 | same | `DG-Marketing` | weak | hold | ROI 与渠道规则不足。 |
| `legacy-trend-ai-coding` | same | Trend | 2026-05-05 | same | `DG-AI-Coding` | partial | hold | 已由 2026-05-07 Governed AI Coding 承接，不单独发布。 |
| `legacy-priority-20260506-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-05-06-AI机会评分.md` | HeatEvidence | 2026-05-06 | `01-SiteV2/content/10-databases/legacy/v1-scoring-legacy-heat-evidence-candidates-2026-05-07.md` | `DG-20260506-Heat` | partial | publish-ready | 可转为客服、治理、Point 校准和专业服务热力证据。 |
| `legacy-priority-20260429-batch` - `legacy-priority-20260505-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/` | HeatEvidence | 2026-04-29..2026-05-05 | same | `DG-Historical-Heat` | weak | hold | 缺 evidenceScore、source level、counter evidence 和去重状态。 |

## 3. 输出文件

- `01-SiteV2/content/08-opportunities/deep-dive/refined/legacy-opportunities-publish-ready-2026-05-08.md`
- `01-SiteV2/content/07-points/refined/legacy-point-calibration-publish-ready-2026-05-08.md`
- `01-SiteV2/content/03-structured-signals/refined/legacy-signals-publish-ready-2026-05-08.md`
- `01-SiteV2/content/05-trend-chain/refined/legacy-trend-context-publish-ready-2026-05-08.md`
- `01-SiteV2/content/10-databases/refined/legacy-heat-evidence-publish-ready-2026-05-08.md`
