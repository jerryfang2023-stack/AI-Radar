---
legacy_batch_id: legacy-signals-20260507
asset_type: structured-signal-candidates
source_scope: V1 Signals
converted_at: 2026-05-07
status: legacy-candidates
production_readiness: needs_review
encoding: UTF-8
---

# V1 Signals -> V2 Structured Signal Candidates

## 转换规则

V1 `AI商业雷达` 不原样搬入 V2。每个历史日更文件先作为一个 legacy candidate batch，后续再拆成具体 Signal。进入正式 Front Signal 前，必须补齐 S/A/B 来源、反证、证据缺口和 V2 六维分析。

## Legacy Candidate Table

| v2_id | source_path | source_date | converted_at | conversion_reason | V2 six-dimension rewrite | relations | evidence_gaps | destination |
|---|---|---|---|---|---|---|---|---|
| `legacy-signal-20260429-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-04-29-AI商业雷达.md` | 2026-04-29 | 2026-05-07 | 历史雷达含早期商业信号，可拆分为结构化 Signal 候选 | 问题：识别 AI 商业变化；对象：创始人/投资人/业务负责人；流程：从新闻筛选到判断；价值：机会方向与风险边界；触发：当日多源信号；边界：需补来源等级和反证 | related_trend_ids: `legacy-trend-context-main`; related_opportunity_ids: TBD | 缺 S/A/B 来源分级、逐条反证、正式 tags | `01-SiteV2/content/03-structured-signals/legacy/` |
| `legacy-signal-20260430-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-04-30-AI商业雷达.md` | 2026-04-30 | 2026-05-07 | 含 V1 Signal 与 Opportunity 关联，可转为 V2 Structured 候选 | 问题：把高曝光新闻转为商业信号；对象：企业服务/AI Agent 相关决策者；流程：筛选、评分、关联机会；价值：预算与流程变化判断；触发：融资/客户/产品发布；边界：需去重和补证 | related_opportunity_ids: legacy opportunities | 缺原始来源档案和 source level 统一字段 | `01-SiteV2/content/03-structured-signals/legacy/` |
| `legacy-signal-20260501-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-01-AI商业雷达.md` | 2026-05-01 | 2026-05-07 | 劳动节前后信号可用于趋势延续判断 | 问题：识别连续升温方向；对象：内容/营销/客服/Agent 赛道观察者；流程：日更到趋势挂载；价值：趋势背景；触发：连续出现的商业事件；边界：需确认是否仍有时效 | related_trend_ids: `legacy-trend-context-main` | 缺时效复核和二次来源 | `01-SiteV2/content/03-structured-signals/legacy/` |
| `legacy-signal-20260502-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-02-AI商业雷达.md` | 2026-05-02 | 2026-05-07 | 含治理、合规、并购阻力等边界型信号 | 问题：识别机会成立边界；对象：合规/安全/企业软件决策者；流程：信号到反证；价值：降低误判；触发：融资、监管、并购受阻；边界：不能作为确定性机会 | related_opportunity_ids: Agent治理与权限审计服务 | 缺逐条 counter evidence 结构化 | `01-SiteV2/content/03-structured-signals/legacy/` |
| `legacy-signal-20260503-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-03-AI商业雷达.md` | 2026-05-03 | 2026-05-07 | 可作为 Point / Signal 关系补充 | 问题：把观点与事实分层；对象：商业判断读者；流程：Daily -> Signal -> Point Calibration；价值：校准趋势与边界；触发：The Point 上线期；边界：Point 不做事实主证据 | related_point_ids: legacy point 2026-05-03 | 缺观点与事实的逐条拆分 | `01-SiteV2/content/03-structured-signals/legacy/` |
| `legacy-signal-20260504-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-04-AI商业雷达.md` | 2026-05-04 | 2026-05-07 | 可回收为 V2 商业热度样本 | 问题：识别行业/岗位/流程影响坐标；对象：企业 AI 观察者；流程：Signal -> HeatEvidence；价值：热力变化解释；触发：当日融资/客户/产品信号；边界：需统一 seed tags | related_trend_ids: legacy trend context | 缺 HeatEvidence 字段 | `01-SiteV2/content/03-structured-signals/legacy/` |
| `legacy-signal-20260505-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-05-AI商业雷达.md` | 2026-05-05 | 2026-05-07 | 与 V2 test monitoring 可对齐 | 问题：把测试链路与历史雷达统一；对象：Data/QA；流程：V1 daily -> V2 structured；价值：校验迁移质量；触发：V2 monitoring 试跑；边界：需避免重复导入 | related_signal_ids: 2026-05-05 V2 monitoring | 缺去重状态 | `01-SiteV2/content/03-structured-signals/legacy/` |
| `legacy-signal-20260506-batch` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-06-AI商业雷达.md` | 2026-05-06 | 2026-05-07 | 与已通过 V2 content gate 的 2026-05-06 链路交叉验证 | 问题：从 Agent coding / governance / workflow 信号中提取 V2 Front Signal；对象：CIO/CISO/工程团队/企业服务创业者；流程：Raw -> Pool -> Structured -> Front Signal；价值：生产路径样本；触发：Claude Code auto mode、Crabbox、DeepSec；边界：部分来源为 X，需 S/A/B 补强 | related_signal_ids: `S-2026-05-06-001..008`; related_point_ids: point 2026-05-06 | Crabbox / DeepSec 仍需更多 S/A/B 来源 | `01-SiteV2/content/03-structured-signals/legacy/` |

## QA Notes

- 本文件是 legacy candidate，不直接进入前台。
- 真正进入 `04-selected-signals/` 前，必须拆成单条 Signal，并通过 `v2content` 或后续 relation gate。
