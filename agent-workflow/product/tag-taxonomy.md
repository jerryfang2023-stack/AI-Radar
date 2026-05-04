# Tag Taxonomy

更新时间：2026-05-03  
owner：`data-agent`  
状态：active

## 1. 定位

Tags 不是前台一级栏目，也不是随手标注。

在观澜AI中，Tags 是用于搜索、筛选和关系网络的判断资产。它们帮助用户回答：

- 我想看某个赛道的 Signals。
- 我想找某个客户场景下的 Opportunities。
- 我想观察某个趋势有哪些证据。
- 我想追踪某类 Builder 观点如何影响机会判断。

Tags 应服务关系网络，不服务装饰。

## 2. 当前问题

基于当前 Markdown frontmatter 初步盘点：

- `AI创业机会` 出现 27 次，过于泛化，不能承担搜索和筛选价值。
- 存在同义重复：`AI Agent` / `AI-Agent`、`AI编程` / `AI-Coding`。
- 许多 Opportunity 只有一个泛标签，缺少赛道、职能、场景、证据、地域等结构化标签。
- Tags 还没有稳定 ID、group、aliases 和准入规则。

## 3. 标签分层

正式标签分为 9 类：

| group | 用途 | 是否必填 |
|---|---|---:|
| `track` | 赛道 / 技术方向 | 核心内容必填 |
| `function` | 业务职能 | Opportunity / Signal 建议必填 |
| `scenario` | 应用场景 | Opportunity 必填 |
| `customer` | 客户类型 | Opportunity 建议必填 |
| `evidence` | 证据类型 | Signal / Trend 建议必填 |
| `stage` | 阶段 / 成熟度 | Trend / Opportunity 建议必填 |
| `region` | 地域 / 市场适配 | 视内容需要 |
| `source` | 来源类型 | Signal / Point 建议必填 |
| `point` | 人物 / 观点主题 | The Point 必填 |

## 4. Tag 数据结构

每个正式标签应有：

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

## 5. 第一版正式标签字典

### track：赛道 / 技术方向

| tag_id | name | aliases | description |
|---|---|---|---|
| `track-ai-agent` | AI Agent | AI-Agent、智能体 | 多步骤任务、工具调用、企业流程执行 |
| `track-ai-coding` | AI Coding | AI-Coding、AI编程 | 编码助手、开发者工具、软件生成 |
| `track-enterprise-workflow` | 企业工作流 | 企业AI工作流、工作流自动化 | 企业流程、文档、审批、跨系统自动化 |
| `track-enterprise-data` | 企业数据智能 | 企业数据、RAG、企业知识库 | 企业数据、知识库、RAG、数据控制面 |
| `track-ai-marketing` | AI营销 | AI增长、销售赋能 | 营销、增长、销售、线索和客户运营 |
| `track-ai-customer-service` | AI客服 | Voice-AI、语音客服 | 客服、售后、质检、工单和语音分流 |
| `track-ai-governance` | AI治理 | Agent治理、权限审计 | 权限、审计、合规、安全和治理 |
| `track-ai-infra` | AI基础设施 | AI Infra、模型基础设施 | 推理、托管、评测、记忆层和基础设施 |
| `track-embodied-ai` | 具身智能 | 机器人、无人系统 | 机器人、物流、无人系统、物理任务执行 |
| `track-medical-ai` | 医疗AI | 临床AI、影像AI | 医疗影像、临床辅助、医疗工作流 |
| `track-professional-services-ai` | 专业服务AI | 法务AI、咨询AI、专家知识Agent | 专业服务、知识工作和专家判断 |

### function：业务职能

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

### scenario：应用场景

| tag_id | name | aliases |
|---|---|---|
| `scenario-document-workflow` | 文档流程 | 文档处理、合同提取 |
| `scenario-knowledge-base` | 知识库问答 | RAG、企业知识库 |
| `scenario-customer-ticket` | 工单与质检 | 工单、质检、智能派单 |
| `scenario-sales-briefing` | 销售日报 | 销售周报、线索跟进 |
| `scenario-bidding-response` | 标书响应 | 标书解析、应标响应 |
| `scenario-clinical-imaging` | 临床影像辅助 | 影像诊断 |
| `scenario-agent-governance` | Agent 权限治理 | 审计、权限、风险控制 |
| `scenario-builder-point` | 建造者观点 | The Point、观点证据 |

### customer：客户类型

| tag_id | name | aliases |
|---|---|---|
| `customer-smb` | 中小企业 | SMB、中小商家 |
| `customer-enterprise` | 大中型企业 | 企业客户 |
| `customer-public-sector` | 政府 / 国企 | 政府、央国企 |
| `customer-developer-team` | 开发团队 | 工程团队 |
| `customer-healthcare-provider` | 医疗机构 | 医院、诊所 |
| `customer-heavy-industry` | 重资产行业 | 能源、电力、制造、建筑 |

### evidence：证据类型

| tag_id | name | aliases |
|---|---|---|
| `evidence-funding` | 融资证据 | 投资、种子轮 |
| `evidence-customer-adoption` | 客户采用 | 部署、上线、合作 |
| `evidence-product-launch` | 产品发布 | 功能发布、平台发布 |
| `evidence-revenue` | 收入增长 | ARR、营收 |
| `evidence-regulation` | 监管政策 | 政策、合规 |
| `evidence-procurement` | 招投标 / 采购 | 招标、政府采购 |
| `evidence-builder-view` | 建造者观点 | The Point、观点 |

### stage：阶段 / 成熟度

| tag_id | name | aliases |
|---|---|---|
| `stage-emerging` | 新出现 | emerging |
| `stage-rising` | 升温 | rising |
| `stage-splitting` | 分化 | splitting |
| `stage-mature` | 成熟化 | mature |
| `stage-risk` | 风险变量 | risk |
| `stage-watch` | 观察 | watch |

### region：地域 / 市场

| tag_id | name | aliases |
|---|---|---|
| `region-global` | 全球 | 海外 |
| `region-china` | 中国适配 | 中国、本土 |
| `region-us` | 美国 | US |
| `region-eu` | 欧洲 | EU |

### source：来源类型

| tag_id | name | aliases |
|---|---|---|
| `source-first-party` | 一手来源 | 官网、官方博客 |
| `source-business-media` | 商业媒体 | 高质量媒体 |
| `source-industry-data` | 产业数据 | 数据库、招投标 |
| `source-social` | 社媒线索 | X、社区 |
| `source-podcast` | 播客 | YouTube、访谈 |
| `source-blog` | 技术博客 | Blog |

### point：人物 / 观点主题

| tag_id | name | aliases |
|---|---|---|
| `point-ai-coding` | AI Coding 观点 | 编程、开发者工具 |
| `point-agent-workflow` | Agent 工作流观点 | 多 Agent、工作流 |
| `point-model-infra` | 模型基础设施观点 | Infra、推理、记忆 |
| `point-product-strategy` | 产品策略观点 | PM、产品 |
| `point-ai-safety-governance` | AI 安全治理观点 | 安全、权限、治理 |

## 6. 合并与别名规则

当前立即生效的别名合并：

| 原标签 | 归并到 |
|---|---|
| `AI-Agent` | `AI Agent` |
| `AI编程` | `AI Coding` |
| `AI-Coding` | `AI Coding` |
| `AI增长` | `AI营销` |
| `Voice-AI` | `AI客服` |
| `企业知识库` | `企业数据智能` |
| `企业数据` | `企业数据智能` |

`AI创业机会` 处理规则：

- 不再作为唯一标签使用。
- 仅保留为历史兼容标签。
- 新增 Opportunity 至少还应包含 `track`、`function`、`scenario` 中的 2 类标签。

## 7. 准入规则

新标签必须满足至少一项：

- 能连接 3 条以上 Signal、Point、Trend 或 Opportunity。
- 是 Strategy / PM 明确确认的重点赛道或商业化方向。
- 能显著提升搜索、筛选或关系网络价值。
- 是自动化质量报告中连续出现的高价值关键词。

不允许新增：

- 只有一次出现的随手词。
- 公司名标签。
- 纯情绪标签。
- 过宽泛标签，如“AI”“创业”“科技”。
- 与现有标签只是大小写、连字符或中英文差异的重复词。

## 8. 内容类型标签要求

### Signal

至少包含：

- 1 个 `track`
- 1 个 `evidence`
- 可选 `function` / `scenario`

### Opportunity

至少包含：

- 1 个 `track`
- 1 个 `function`
- 1 个 `scenario`
- 建议补 `customer`

### Trend

至少包含：

- 1 个 `track`
- 1 个 `stage`
- 可选 `evidence`

### Point

至少包含：

- 1 个 `point`
- 1 个 `track`
- 1 个 `source`

## 9. 自动化生成规则

### `ai-the-point`

- 生成 Point 时，优先使用 `point`、`track`、`source` 三类标签。
- 不以人物姓名作为 tag；人物进入 `person` / `source_name` 字段。
- 若发现新观点主题，不直接新建 tag，先写入候选主题或运行报告。

### `ai-2`

- 生成 Signal / Opportunity 时，必须按本文件从别名归并到正式标签。
- 不再只写 `AI创业机会`。
- 新标签进入候选池，不直接进入正式字典。
- 如果自动化无法确定标签，写 `needs_tag_review` 到报告，不要编造标签。

### `ai-3`

- 同步时不新增标签，只解析已有标签。
- 若未来增加标签检查脚本，`ai-3` 应把未知标签作为软提醒，不作为硬错误。

## 10. 前台应用规则

Tags 不进入一线导航。

前台可用于：

- Signals 筛选。
- Opportunities 筛选。
- Trends 相关内容聚合。
- The Point 主题聚合。
- 详情页“相关内容”。
- 未来标签网络图。

前台不应展示：

- 长标签墙。
- 内部 tag_id。
- 低价值泛标签。
- 未复核候选标签。

## 11. 治理节奏

### 每日

- 自动化报告中记录未知标签和候选标签。

### 每周

输出：

```text
agent-workflow/reports/tag-quality-weekly-YYYY-WW.md
```

内容：

- 高频标签。
- 低价值标签。
- 新增候选标签。
- 合并建议。
- 未知标签。
- 标签到 Signal / Point / Trend / Opportunity 的覆盖率。

### 每月

在 `intelligence-model-calibration-YYYY-MM.md` 中复盘：

- 哪些标签真正帮助发现机会。
- 哪些标签只是噪音。
- 哪些标签应拆分、合并或隐藏。

## 12. 下一步执行

1. Dev Agent 后续可增加 `check-tags.mjs`。
2. Intelligence Data Agent 每周输出 tag-quality 报告。
3. UI/UE Agent 后续设计标签筛选，不做标签墙。
4. Copy Agent 确保前台不显示内部 tag_id。
