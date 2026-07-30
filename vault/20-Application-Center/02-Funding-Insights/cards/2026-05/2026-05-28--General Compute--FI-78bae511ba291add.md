---
type: funding_insight_card
sync_owner: guanlan-funding-insight-obsidian-sync
schema_version: "FUNDING-INSIGHT-V1.0"
funding_insight_id: "FI-78bae511ba291add"
event_id: "EV-53acea531ac371d6"
as_of_date: "2026-07-08"
announced_at: "2026-05-28"
company: "General Compute"
company_entity_id: "EN-18b4bbfd60f4137e"
round: "种子轮"
amount: "$15 million"
sector: "AI基础设施/推理云服务"
publication_status: "auto_published"
source_count: 3
source: "01-SiteV2/site/data/funding-insights-v1.json"
tags:
  - funding-insight
  - application-center
---

# General Compute｜$15 million｜种子轮

> [!summary] 公司概况
> 一家专注于AI推理阶段的新型推理新云服务商，通过部署SambaNova专用推理芯片而非传统GPU，为模型运行和响应用户请求提供算力租赁服务。

## 融资概览

- **融资轮次**：种子轮
- **本轮金额**：$15 million
- **累计融资**：$15 million
- **公布日期**：2026-05-28

### 投资方

- **FUSE VC** — 本轮领投
- **Carya Venture Partners** — 本轮参投
- **Village Global Ventures** — 本轮参投
- **Evercrest Capital Partners** — 本轮参投

## 公司与团队

- **公司**：General Compute
- **总部**：San Francisco, United States
- **官网**：[https://www.generalcompute.com/](<https://www.generalcompute.com/>)

### 创始团队

- **Finn Puklowski** — CEO
- **Jason Goodison** — CTO

## 产品

### General Compute 推理云平台

基于SambaNova SN50专用推理芯片构建的AI推理云服务，提供高速、低成本的模型推理算力，支持OpenAI、DeepSeek、MiniMax等前沿模型，并兼容API与MCP协议以支持AI智能体自主调配计算资源。

- **目标客户**：需要运行大规模AI模型推理的开发者、AI公司以及需要实时推理的智能体应用场景
- **关键能力**：
  - 推理速度高达600-700 tokens/秒，约为GPU的3倍
  - 采用风冷设计，无需液冷基础设施，可在现有数据中心快速部署
  - 支持MiniMax 2.7等开源大语言模型的高速运行
  - Agentic-First设计，API与MCP兼容，允许AI智能体自主调配计算资源
  - 声称比标准GPU云快16倍，能效高6倍

## 关键指标

- **种子轮融资金额**：$15 million（2026-05-28）
- **投后估值**：$60 million（2026-05-28）
- **SambaNova SN50芯片订单金额**：$300 million（2026-05-28）
- **SN50芯片推理速度**：600-700 tokens/秒（2026-05-28）
- **GPU推理速度对比**：约250 tokens/秒（2026-05-28）

## 资本判断

> [!analysis] 应用层判断
> 资本押注的核心变量是AI工作负载从训练向推理的结构性迁移，以及专用推理芯片在速度和能效上对GPU的替代能力。本轮估值$60 million建立在三个已验证信号之上：SambaNova SN50芯片的推理速度达到600-700 tokens/秒（约为GPU的3倍）、风冷设计使部署周期从数年缩短至数周、以及公司已锁定$300 million芯片订单并获得首个推理云部署者地位。但判断的证据边界受限于：SambaNova芯片尚未大规模出货，性能数据来自厂商声明而非第三方实测；推理芯片的二级市场流动性未经违约事件检验；公司尚无公开的付费客户或收入数据。

### 已验证信号

- 已锁定$300 million SambaNova SN50芯片订单，成为首个部署该芯片的推理新云服务商
- SN50芯片推理速度达600-700 tokens/秒，约为GPU的3倍
- 风冷设计使硬件可在现有数据中心快速部署，无需新建基础设施
- 云平台已上线，声称在运行MiniMax 2.7开源模型时速度最快

### 证据边界与风险

- SambaNova SN50芯片尚未大规模出货，性能声明未经第三方独立验证，实际部署效果存在不确定性
- 推理芯片二级市场流动性未经检验，若SambaNova生态发展不及预期，$300 million芯片订单可能面临资产减值风险
- 公司尚无公开的付费客户或收入数据，商业化验证仍处于极早期阶段

## 同类对照

### OpenRouter

- **产品/方案**：多模型路由与成本优化平台
- **场景**：为企业客户提供接入多个模型的请求路由服务，以优化token支出
- **目标客户**：需要跨多个模型优化token成本的企业客户
- **融资概况**：本周完成$113 million Series B融资
- **核心差异**：OpenRouter聚焦于多模型路由与token成本优化，而General Compute专注于通过专用推理芯片提供高速、低成本的单点推理算力。

### CoreWeave

- **产品/方案**：GPU云服务
- **场景**：通过大规模部署Nvidia GPU提供AI训练与推理算力
- **目标客户**：需要大规模GPU算力的AI公司
- **核心差异**：CoreWeave依赖Nvidia GPU构建算力基础设施，而General Compute采用SambaNova专用推理芯片，在推理速度和能效上形成差异化。

## 融资历史

- [[20-Application-Center/02-Funding-Insights/cards/2026-05/2026-05-28--General Compute--FI-78bae511ba291add|2026-07-08｜AI 算力争夺战是否催生了下一个 Cerebras？｜$15 million]]

## 研究来源

- [AI 算力争夺战是否催生了下一个 Cerebras？](<https://techcrunch.com/2026/05/28/has-the-hunt-for-ai-compute-uncovered-the-next-cerebras/>) · `FISRC-7f85c191231c7c71` · keyword search / Anysearch
- [General Compute secures $400M debt deal to bypass the GPU bottleneck and build a blazing-fast AI inference cloud | The AI Journal](<https://aijourn.com/general-compute-secures-400m-debt-deal-to-bypass-the-gpu-bottleneck-and-build-a-blazing-fast-ai-inference-cloud/>) · `FISRC-075a06a75b5f9ea9` · aijourn.com
- [General Compute raises $15M to deploy SambaNova chips for AI ...](<https://app.dealroom.co/news/feed/general-compute-raises-15m-to-deploy-sambanova-chips-for-ai-inference>) · `FISRC-431b4cf79433b16b` · app.dealroom.co

## 证据原文

### [General Compute secures $400M debt deal to bypass the GPU bottleneck and build a blazing-fast AI inference cloud | The AI Journal](<https://aijourn.com/general-compute-secures-400m-debt-deal-to-bypass-the-gpu-bottleneck-and-build-a-blazing-fast-ai-inference-cloud/>)

> General Compute claims its infrastructure delivers results up to 16x faster than standard GPU clouds, alongside a 7x faster time-to-first-token.

> the platform is also Agentic-First, meaning it is API and MCP compatible to allow AI agents to provision compute on a user’s behalf.

### [General Compute raises $15M to deploy SambaNova chips for AI ...](<https://app.dealroom.co/news/feed/general-compute-raises-15m-to-deploy-sambanova-chips-for-ai-inference>)

> San Francisco, United States

### [AI 算力争夺战是否催生了下一个 Cerebras？](<https://techcrunch.com/2026/05/28/has-the-hunt-for-ai-compute-uncovered-the-next-cerebras/>)

> at a $60 million post-money valuation

> Consider the $113 million Series B raised for OpenRouter this week, reflecting the company’s ability to offer customers access to multiple models in order to optimize their token spend.

> General Compute , a new inference neocloud — a company that rents out AI processing power, specializing in the phase when models are running and responding to users rather than being trained

> General Compute has $300 million of the company’s SN50 chips on order

> General Compute launched its cloud offering last week, claiming it is already the fastest at running MiniMax 2.7, a powerful opensource LLM.

> Hasselmann sees in SambaNova’s partnership with General Compute parallels to CoreWeave’s relationship with Nvidia

> Joe Hasselmann is a venture investor who got in on the ground floor of the inference boom when he invested in Groq in 2021. This year, he launched a new fund, Evercrest Capital Partners, focused on the AI space, and made General Compute one of his first investments.

> led by FUSE VC with participation from Carya Venture Partners and Village Global Ventures

> Puklowski says the new chips will generate 600 to 700 tokens per second, versus about 250 tokens per second for GPUs.

> raise a $15 million seed round

> the co-founders of General Compute, CEO Finn Puklowski and CTO Jason Goodison

> Those answers helped it raise a $15 million seed round at a $60 million post-money valuation, led by FUSE VC with participation from Carya Venture Partners and Village Global Ventures.

> versus about 250 tokens per second for GPUs

> with participation from Carya Venture Partners and Village Global Ventures

## 关联入口

- [公司档案](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=index&detail=entity&id=EN-18b4bbfd60f4137e>)
- [融资事件](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=events&detail=event&id=EV-53acea531ac371d6>)
- [相关方向](<https://jerryfang2023-stack.github.io/AI-Radar/opportunity-map.html#direction-cards>)
- [融资透视页面](<https://jerryfang2023-stack.github.io/AI-Radar/funding-insights.html>)
