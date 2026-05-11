---
title: V1 历史 AI商业雷达与 The Point 全量覆盖表
date: 2026-05-08
task_id: WSD-20260508-09-v1-history-full-refine-autopilot
board_id: V2-HISTORY-FULL-REFINE-AUTO
status: completed
encoding: UTF-8
---

# V1 History Full Source Coverage

## 判断口径

本轮覆盖 12 篇 V1 历史源文档。处理方式不是全文搬运，而是逐篇拆出候选条目，按 V2 的 Signal / Point / Trend / Opportunity / HeatEvidence 口径去重合并。只有具备清晰商业含义、可追溯来源、反证边界和关系字段的内容进入 `publish-ready`；证据不足、重复度高或不适合当前四导航展示的内容进入 `hold`；纯观点、低可信社媒线索或已失去判断价值的内容进入 `reject`。

## Source Coverage

| source_id | source_path | source_type | source_date | raw_items_count | processed_items_count | publish_ready_count | hold_count | reject_count | output_paths | notes |
|---|---|---|---|---:|---:|---:|---:|---:|---|---|
| `HIST-RADAR-20260429` | `10-Archive/v1.0/source-dirs/01-Signals/2026-04-29-AI商业雷达.md` | AI商业雷达 | 2026-04-29 | 6 | 6 | 2 | 3 | 1 | `history-signals`, `history-opportunities`, `history-trends`, `history-heat-evidence` | Hightouch、Avoca、OpenAI Workspace / Bedrock 可合并入营销数据激活、客户前台运营、企业 Agent 平台；LeapMind 与 Cognizant 保留为 hold；Parallel 与后续 Agent 控制层重复。 |
| `HIST-RADAR-20260430` | `10-Archive/v1.0/source-dirs/01-Signals/2026-04-30-AI商业雷达.md` | AI商业雷达 | 2026-04-30 | 7 | 7 | 2 | 4 | 1 | `history-signals`, `history-trends`, `history-heat-evidence` | Box Automate、Vanta、中数睿智补强企业文档流程、Shadow AI 治理和中国企业 Agent 落地；MemoraX、LeapMind、Cognizant 与既有方向重复或证据不足。 |
| `HIST-RADAR-20260501` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-01-AI商业雷达.md` | AI商业雷达 | 2026-05-01 | 7 | 7 | 3 | 3 | 1 | `history-signals`, `history-opportunities`, `history-trends`, `history-heat-evidence` | Netomi、Factory、Mizzen Insight、JuliaHub 具备可归类价值；Loopit 偏消费内容平台，暂不进入 V2 前台；星动纪元进入 hold 等待单位经济模型。 |
| `HIST-RADAR-20260502` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-02-AI商业雷达.md` | AI商业雷达 | 2026-05-02 | 6 | 6 | 2 | 3 | 1 | `history-signals`, `history-trends`, `history-heat-evidence` | Amazon Quick、Haast、ARI / Meta 可作为 Agent 入口、合规引擎和具身控制栈趋势证据；Scout、原粒半导体、Manus 并购受阻暂留观察。 |
| `HIST-RADAR-20260503` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-03-AI商业雷达.md` | AI商业雷达 | 2026-05-03 | 7 | 7 | 4 | 2 | 1 | `history-signals`, `history-opportunities`, `history-trends`, `history-heat-evidence` | Legora、Aidoc、Citi、Snowflake、Okta、ASAPP、Meta Business AI 均有明确关系价值；Aidoc 因医疗监管进入 hold，不直接做机会前台化。 |
| `HIST-RADAR-20260504` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-04-AI商业雷达.md` | AI商业雷达 | 2026-05-04 | 6 | 6 | 3 | 3 | 0 | `history-signals`, `history-opportunities`, `history-trends`, `history-heat-evidence` | Google Cloud 指标、GoodData、ASAPP、Sage Doyen 可补强企业 AI 经营指标、语义层、客服和财务流程；Sycamore、Hightouch 与已有方向合并。 |
| `HIST-RADAR-20260505` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-05-AI商业雷达.md` | AI商业雷达 | 2026-05-05 | 6 | 6 | 2 | 3 | 1 | `history-signals`, `history-points`, `history-trends`, `history-heat-evidence` | Claude Code auto mode、Crabbox、GBrain 可归并到 Agent 工程化和上下文资产化；Waymo、ARR 讨论、一人公司平台化暂留观察。 |
| `HIST-RADAR-20260506` | `10-Archive/v1.0/source-dirs/01-Signals/2026-05-06-AI商业雷达.md` | AI商业雷达 | 2026-05-06 | 5 | 5 | 3 | 2 | 0 | `history-signals`, `history-points`, `history-opportunities`, `history-trends`, `history-heat-evidence` | Claude Code、Crabbox、DeepSec、语音交互和 ROI 口径均可合并为 Agent 工程化运行层、客服入口和经营指标治理。 |
| `HIST-POINT-20260503` | `10-Archive/v1.0/source-dirs/05-point/2026-05-03-The-Point.md` | The Point | 2026-05-03 | 24 | 24 | 3 | 16 | 5 | `history-points`, `history-trends`, `history-heat-evidence` | Aaron Levie、Baseten、Claude Memory 可作为企业 Agent 系统、推理云和可审计记忆层观点参照；短观点与低上下文社媒线索进入 hold / reject。 |
| `HIST-POINT-20260504` | `10-Archive/v1.0/source-dirs/05-point/2026-05-04-The-Point.md` | The Point | 2026-05-04 | 10 | 10 | 4 | 5 | 1 | `history-points`, `history-trends`, `history-heat-evidence` | Aaron Levie、Karpathy、Sam Altman、Replit 等观点可校准 Agent 落地、可验证工作和并行工程；短句观点只作背景。 |
| `HIST-POINT-20260505` | `10-Archive/v1.0/source-dirs/05-point/2026-05-05-The-Point.md` | The Point | 2026-05-05 | 10 | 10 | 4 | 5 | 1 | `history-points`, `history-trends`, `history-heat-evidence` | Claude Code auto mode、Crabbox、Waymo、经营指标讨论可入观点参照；单案例融资 / 产品点子暂 hold。 |
| `HIST-POINT-20260506` | `10-Archive/v1.0/source-dirs/05-point/2026-05-06-The-Point.md` | The Point | 2026-05-06 | 10 | 10 | 5 | 4 | 1 | `history-points`, `history-opportunities`, `history-trends`, `history-heat-evidence` | Claude Code、Crabbox、DeepSec、Aaron Levie、Sam Altman 语音观点进入 publish-ready；ARR 口径、Replit 与 Waymo 作补充或 hold。 |

## 汇总

| 项目 | 数量 |
|---|---:|
| 源文档 | 12 |
| 原始拆解条目 | 104 |
| 已处理条目 | 104 |
| publish-ready 条目 | 37 |
| hold 条目 | 53 |
| reject 条目 | 14 |
| 写入 V2 history-refined 文件 | 5 |

## Hold 原因分类

- 与已发布 V2 资产高度重复：例如 Hightouch、ASAPP、Agent 控制层、Claude Code auto mode 的多日重复。
- 来源不足：部分 X 单条短观点、消费应用增长、二手 ARR 推断缺 S/A/B 交叉验证。
- 产品边界暂不适合：自动驾驶、具身智能、医疗和端侧芯片方向重要，但当前 V2 四导航优先承接企业 Agent、工作流、治理和商业内参。
- 缺少反证与客户指标：不少融资信号缺留存、续费、定价、单位经济模型或客户部署规模。

## Reject 原因分类

- 纯热度或活动信号，不能形成商业判断。
- 单条社媒观点缺上下文，不能作为事实证据。
- 消费内容平台、硬件采购偏好等与当前 V2 生产线关联弱。
