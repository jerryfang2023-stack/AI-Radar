# Tag Taxonomy｜标签体系

更新时间：2026-05-22
owner：Intelligence Engine / Experience & Editorial
状态：current

## 1. 定位

Tags 不是前台一级栏目，也不是随手标注。它们服务搜索、筛选、关系网络和资产复盘，帮助用户按赛道、职能、场景、证据、成熟度和来源理解观澜 AI 的判断资产。

当前标签体系服务以下资产：

- 商业信号卡：`signal_card`
- 前沿观点卡：`opinion_card`
- 变化候选：`change_candidate`
- 场景候选：`scene_candidate`
- 趋势候选 / 趋势报告：`trend_candidate` / `trend_report`
- 商业内参：`brief_issue`

旧机会中心和旧观点栏目只作为历史兼容来源，不再作为当前标签分组或前台栏目名。

## 2. 标签分层

正式标签分为 9 类：

| group | 用途 | 建议使用 |
|---|---|---|
| `track` | 赛道 / 技术方向 | 核心内容必填 |
| `function` | 业务职能 | 商业信号、场景候选建议必填 |
| `scenario` | 应用场景 | 场景候选必填 |
| `customer` | 客户类型 | 案例 / 场景 / 内参建议补充 |
| `evidence` | 证据类型 | 商业信号、趋势候选建议必填 |
| `stage` | 阶段 / 成熟度 | 变化候选、趋势候选、趋势报告建议必填 |
| `region` | 地域 / 市场适配 | 视内容需要 |
| `source` | 来源类型 | 商业信号、前沿观点建议必填 |
| `opinion` | 前沿观点主题 | 前沿观点卡必填 |

## 3. Tag 数据结构

```json
{
  "tag_id": "track-ai-agent",
  "name": "AI Agent",
  "group": "track",
  "aliases": ["AI-Agent", "智能体"],
  "description": "围绕自主执行、多步骤任务、工具调用和企业流程执行的 AI 系统。",
  "status": "active",
  "merge_to": null
}
```

## 4. 第一版正式标签字典

### track

| tag_id | name | aliases | description |
|---|---|---|---|
| `track-ai-agent` | AI Agent | AI-Agent、智能体 | 多步骤任务、工具调用、企业流程执行 |
| `track-ai-coding` | AI Coding | AI-Coding、AI 编程 | 编码助手、开发者工具、软件生成 |
| `track-enterprise-workflow` | 企业工作流 | 企业 AI 工作流、工作流自动化 | 企业流程、审批、跨系统自动化 |
| `track-enterprise-data` | 企业数据智能 | 企业数据、RAG、企业知识库 | 企业数据、知识库、RAG、数据控制面 |
| `track-ai-marketing` | AI 营销 | AI 增长、销售赋能 | 营销、增长、销售、线索和客户运营 |
| `track-ai-customer-service` | AI 客服 | Voice AI、语音客服 | 客服、售后、质检、工单和语音分流 |
| `track-ai-governance` | AI 治理 | Agent 治理、权限审计 | 权限、审计、合规、安全和治理 |
| `track-ai-infra` | AI 基础设施 | AI Infra、模型基础设施 | 推理、托管、评测、记忆层和基础设施 |
| `track-embodied-ai` | 具身智能 | 机器人、无人系统 | 机器人、物流、无人系统、物理任务执行 |
| `track-medical-ai` | 医疗 AI | 临床 AI、影像 AI | 医疗影像、临床辅助、医疗工作流 |
| `track-professional-services-ai` | 专业服务 AI | 法务 AI、咨询 AI、专家知识 Agent | 专业服务、知识工作和专家判断 |

### function

| tag_id | name | aliases |
|---|---|---|
| `function-sales` | 销售 | 销售赋能、CRM |
| `function-marketing` | 市场营销 | 增长、投放 |
| `function-customer-service` | 客服售后 | 客服、售后、质检 |
| `function-operations` | 运营流程 | 运营、流程 |
| `function-finance` | 财务 | 票据、报销、财务流程 |
| `function-legal-compliance` | 法务合规 | 合规、审计 |
| `function-procurement-bidding` | 采购投标 | 招投标、采购 |
| `function-engineering` | 工程研发 | 开发、仿真、工程 |

### scenario

| tag_id | name | aliases |
|---|---|---|
| `scenario-document-workflow` | 文档流程 | 文档处理、合同提取 |
| `scenario-knowledge-base` | 知识库问答 | RAG、企业知识库 |
| `scenario-customer-ticket` | 工单与质检 | 工单、质检、智能派单 |
| `scenario-sales-briefing` | 销售日报 | 销售周报、线索跟进 |
| `scenario-bidding-response` | 标书响应 | 标书解析、应标响应 |
| `scenario-clinical-imaging` | 临床影像辅助 | 影像诊断 |
| `scenario-agent-governance` | Agent 权限治理 | 审计、权限、风险控制 |
| `scenario-frontier-opinion` | 前沿观点 | 观点证据、建造者观点 |

### customer

| tag_id | name | aliases |
|---|---|---|
| `customer-smb` | 中小企业 | SMB、中小商家 |
| `customer-enterprise` | 大中型企业 | 企业客户 |
| `customer-public-sector` | 政府 / 国企 | 政府、央国企 |
| `customer-developer-team` | 开发团队 | 工程团队 |
| `customer-healthcare-provider` | 医疗机构 | 医院、诊所 |
| `customer-heavy-industry` | 重资产行业 | 能源、电力、制造、建筑 |

### evidence

| tag_id | name | aliases |
|---|---|---|
| `evidence-funding` | 融资证据 | 投资、种子轮 |
| `evidence-customer-adoption` | 客户采用 | 部署、上线、合作 |
| `evidence-product-launch` | 产品发布 | 功能发布、平台发布 |
| `evidence-revenue` | 收入增长 | ARR、营收 |
| `evidence-regulation` | 监管政策 | 政策、合规 |
| `evidence-procurement` | 招投标 / 采购 | 招标、政府采购 |
| `evidence-frontier-opinion` | 前沿观点 | 观点、建造者观点 |

### stage

| tag_id | name | aliases |
|---|---|---|
| `stage-emerging` | 新出现 | emerging |
| `stage-rising` | 升温 | rising |
| `stage-splitting` | 分化 | splitting |
| `stage-mature` | 成熟化 | mature |
| `stage-risk` | 风险变量 | risk |
| `stage-watch` | 观察 | watch |

### region

| tag_id | name | aliases |
|---|---|---|
| `region-global` | 全球 | 海外 |
| `region-china` | 中国适配 | 中国、本土 |
| `region-us` | 美国 | US |
| `region-eu` | 欧洲 | EU |

### source

| tag_id | name | aliases |
|---|---|---|
| `source-first-party` | 一手来源 | 官网、官方博客 |
| `source-business-media` | 商业媒体 | 高质量媒体 |
| `source-industry-data` | 产业数据 | 数据库、招投标 |
| `source-social` | 社媒线索 | X、社区 |
| `source-podcast` | 播客 | YouTube、访谈 |
| `source-blog` | 技术博客 | Blog |

### opinion

| tag_id | name | aliases |
|---|---|---|
| `opinion-ai-coding` | AI Coding 观点 | 编程、开发者工具 |
| `opinion-agent-workflow` | Agent 工作流观点 | 多 Agent、工作流 |
| `opinion-model-infra` | 模型基础设施观点 | Infra、推理、记忆 |
| `opinion-product-strategy` | 产品策略观点 | PM、产品 |
| `opinion-ai-safety-governance` | AI 安全治理观点 | 安全、权限、治理 |

## 5. 合并与别名规则

| 原标签 | 归并到 |
|---|---|
| `AI-Agent` | `AI Agent` |
| `AI编程` | `AI Coding` |
| `AI-Coding` | `AI Coding` |
| `AI增长` | `AI 营销` |
| `Voice-AI` | `AI 客服` |
| `企业知识库` | `企业数据智能` |
| 旧观点栏目 | `前沿观点` |
| 旧机会中心 | `机会判断段落 / 趋势追踪或商业内参中的判断段落` |

`AI创业机会` 不再作为唯一标签使用，仅保留为历史兼容标签。新资产至少应包含 `track`、`function`、`scenario`、`evidence` 或 `stage` 中的结构化标签。

## 6. 准入规则

新标签必须满足至少一项：

- 能连接 3 条以上商业信号、前沿观点、变化候选、场景候选、趋势候选或趋势报告。
- 是 Product Commander 明确确认的重点赛道或商业化方向。
- 能显著提升搜索、筛选或关系网络价值。
- 是自动化质量报告中连续出现的高价值关键词。

不允许新增：

- 只有一次出现的随手词。
- 公司名标签。
- 纯情绪标签。
- 过宽泛标签，如“AI”“创业”“科技”。
- 与现有标签只是大小写、连字符或中英文差异的重复词。

## 7. 内容类型标签要求

### signal_card

- 至少 1 个 `track`
- 至少 1 个 `evidence`
- 可选 `function` / `scenario`

### opinion_card

- 至少 1 个 `opinion`
- 至少 1 个 `track`
- 至少 1 个 `source`
- 标签不能替代观点卡评级；前台展示仍必须看 `opinion_tier`、`display_lane` 和 `publish_status`。

### change_candidate

- 至少 1 个 `track`
- 至少 1 个 `stage`
- 至少 1 个 `evidence`

### scene_candidate

- 至少 1 个 `track`
- 至少 1 个 `function`
- 至少 1 个 `scenario`
- 建议补 `customer`

### trend_candidate / trend_report

- 至少 1 个 `track`
- 至少 1 个 `stage`
- 可选 `evidence` / `scenario`

## 8. 自动化生成规则

- `asset-card-generator` 生成资产时必须按本文件从别名归并到正式标签。
- `guanlan-daily-monitor` 生成 follow-builders 前沿观点卡时，必须同步写入 `formal_tags`；最小要求为 1 个 `track`、1 个 `source`、1 个 `opinion`，可补 `scenario-frontier-opinion`、`evidence-frontier-opinion`、`stage-watch`、`region-global`。
- 前沿观点不得以人物姓名作为 tag；人物进入 `speaker` / `person` / `source_name` 字段。
- 若发现新观点主题，不直接新建 tag，先写入候选主题或运行报告。
- 同步脚本不新增标签，只解析已有标签。
- 自动化不得用标签数量、人物热度或主题命中替代四档评级。
- 如果自动化无法确定标签，写 `needs_tag_review` 到报告，不要编造标签。

## 9. 前台应用规则

Tags 不进入一线导航。

前台可用于：

- 商业信号筛选。
- 前沿观点筛选。
- 趋势追踪相关内容聚合。
- 详情页“相关内容”。
- 未来标签网络图。

前台不应展示：

- 长标签墙。
- 内部 `tag_id`。
- 低价值泛标签。
- 未复核候选标签。

## 10. 治理节奏

每日自动化报告记录未知标签和候选标签。

每周输出：

```text
agent-workflow/reports/tag-quality-weekly-YYYY-WW.md
```

内容：

- 高频标签。
- 低价值标签。
- 新增候选标签。
- 合并建议。
- 未知标签。
- 标签到商业信号、前沿观点、变化候选、场景候选和趋势候选的覆盖率。

下一步：

1. Build & Release 后续可增加 `check-tags.mjs`。
2. Intelligence Engine 每周输出 tag-quality 报告。
3. Experience & Editorial 后续设计标签筛选，不做标签墙。
4. 前台不显示内部 `tag_id`。
