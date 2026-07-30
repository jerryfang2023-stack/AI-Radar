---
type: funding_insight_card
sync_owner: guanlan-funding-insight-obsidian-sync
schema_version: "FUNDING-INSIGHT-V1.0"
funding_insight_id: "FI-dac348b622e87b82"
event_id: "EV-f1a605a25af30dc5"
as_of_date: "2026-06-10"
announced_at: "2026-06-02"
company: "Archestra.AI"
company_entity_id: "EN-348445124d405d5a"
round: "种子轮"
amount: "$10M"
sector: "AI 智能体安全与治理基础设施"
publication_status: "auto_published"
source_count: 3
source: "01-SiteV2/site/data/funding-insights-v1.json"
tags:
  - funding-insight
  - application-center
---

# Archestra.AI｜$10M｜种子轮

> [!summary] 公司概况
> Archestra.AI 是一家开源平台公司，其技术使企业能够安全地将敏感数据连接到 AI 智能体，提供确定性护栏、治理和可观测性，以防止数据泄露和提示注入攻击。

## 融资概览

- **融资轮次**：种子轮
- **本轮金额**：$10M
- **累计融资**：$13.5M
- **公布日期**：2026-06-02

### 投资方

- **Visible Ventures** — 本轮参投
- **Tenacity Capital** — 本轮参投
- **Olivier Pomel** — 本轮天使投资人
- **Kieran Flanagan** — 本轮天使投资人
- **20 Product** — 本轮参投
- **Carolyn Everson** — 本轮天使投资人
- **AJ Tennant** — 本轮天使投资人
- **Insiders** — 本轮天使投资人
- **Debo Dutta** — 本轮天使投资人
- **Alexandre Berriche** — 本轮天使投资人
- **Gerhard Eschelbeck** — 本轮天使投资人
- **Mark Goldberger** — 本轮天使投资人
- **Declan Kelly** — 本轮天使投资人
- **Concept Ventures** — 既有投资方（种子前轮）
- **Zero Prime Ventures** — 既有投资方（种子前轮）
- **Celero Ventures** — 既有投资方（种子前轮）
- **Aloniq** — 既有投资方（种子前轮）

## 公司与团队

- **公司**：Archestra.AI
- **总部**：London
- **官网**：[https://archestra.ai](<https://archestra.ai>)
- **团队规模**：7（2026-06-02）

### 创始团队

- **Matvey Kukuy** — CEO and founder

## 产品

### Archestra Platform

一个开源控制平面，用于在生产环境中安全运行 AI 智能体。它自托管在用户自己的 Kubernetes 集群中，在智能体与企业技术栈之间放置一个确定性策略网关，对每个 LLM 调用、工具调用和外部请求进行 RBAC、凭证隔离、审计跟踪和成本控制。

- **目标客户**：企业内部 AI 团队，尤其是安全敏感行业（法律、采购、运营、受监管金融）
- **关键能力**：
  - MCP 网关，提供单端点、按身份路由的工具访问
  - LLM 代理，支持虚拟密钥、OAuth、JWKS
  - 双 LLM 子智能体，隔离不可信工具输出以防止提示注入
  - 动态工具引擎，在不可信来源请求时隐藏敏感工具
  - 确定性工具护栏，基于上下文信任状态动态阻止高风险后续操作
  - 企业级身份认证，支持 SSO、OAuth 2.1、用户 OAuth、MCP OBO、企业 IdP
  - 每个 MCP 服务器在隔离 Pod 中运行
  - Prometheus、OpenTelemetry 和身份绑定审计的可观测性

## 客户与应用

- **未披露** — 财富 500 强；在生产环境中运行 Archestra，将 AI 智能体连接到真实企业数据

## 关键指标

- **GitHub 星标数**：3,800+（2026-06-02）
- **社区成员数**：1,000+（2026-06-02）
- **贡献者数**：57（2026-06-02）
- **财富 500 强客户数**：4（2026-06-02）

## 资本判断

> [!analysis] 应用层判断
> 资本押注的核心变量是：企业 AI 智能体从实验走向生产时，安全与治理层将成为独立的基础设施类别，而非 LLM 提供商的内置功能。本轮融资验证的信号包括：已有 4 家财富 500 强客户在生产环境中使用，开源社区快速增长（3800+ GitHub 星标），以及创始团队来自 Grafana Labs 的工程背景。但公司仅 7 人团队，面临大型现有厂商快速添加类似安全层的竞争压力，且其护栏在大规模部署中防止数据泄露的实际效果尚未得到广泛验证。

### 已验证信号

- 4 家财富 500 强客户已在生产环境中使用 Archestra 连接 AI 智能体与真实企业数据
- 开源社区快速增长，获得 3800+ GitHub 星标、1000+ 社区成员和 57 名贡献者
- 创始团队来自 Grafana Labs，具备开源和企业级可观测性产品的构建经验

### 证据边界与风险

- 7 人团队在竞争激烈的企业软件市场中，面临大型现有厂商快速添加类似安全层的压力，其护栏在大规模部署中防止数据泄露的实际效果尚未得到广泛验证。

## 同类对照

### n8n

- **产品/方案**：n8n 工作流自动化平台
- **场景**：当 n8n 工作流从固定序列变为自主循环，AI 智能体节点读取不可信内容（如恶意 GitHub issue）时，缺乏对提示注入的防御和按身份的工具路由。
- **目标客户**：已在生产环境中使用 n8n 并希望添加自主智能体行为的团队
- **核心差异**：n8n 是可视化工作流工具，以工作流节点为中心，缺乏按身份的工具路由、MCP 服务器沙箱隔离和双 LLM 提示注入防御；Archestra 是智能体平台，以智能体轮次为中心，提供 MCP 网关、LLM 代理和确定性护栏。

## 公开引语

### Matvey Kukuy

> We address this problem. We bring guardrails so employees can spin agents inside them.

## 融资历史

- [[20-Application-Center/02-Funding-Insights/cards/2026-06/2026-06-02--Archestra Inc--FI-6c2faabba03d416d|2026-06-05｜Archestra 融资 1000 万美元，为 AI 智能体接入企业数据提供中介服务｜$10M]]
- [[20-Application-Center/02-Funding-Insights/cards/2026-06/2026-06-02--Archestra.AI--FI-dac348b622e87b82|2026-06-03｜$10 million]]

## 研究来源

- [Archestra.AI 获1000万美元融资，解锁下一代自主代理应用场景 - Tech.eu](<https://tech.eu/2026/06/02/archestraai-raises-10m-to-unlock-next-gen-agentic-use-case/>) · `FISRC-08f2020b7eca8380` · keyword search / Anysearch
- [Archestra.AI Announces $10M Seed 🎉 | Blog | Archestra](<https://archestra.ai/blog/archestra-announces-10m-seed>) · `FISRC-50130a45d72291a2` · archestra.ai
- [n8n vs Archestra for agentic workflows | Blog | Archestra](<https://archestra.ai/blog/n8n-vs-archestra-agents>) · `FISRC-5d653e5a6e442aa7` · archestra.ai

## 证据原文

### [Archestra.AI 获1000万美元融资，解锁下一代自主代理应用场景 - Tech.eu](<https://tech.eu/2026/06/02/archestraai-raises-10m-to-unlock-next-gen-agentic-use-case/>)

> also includes investment from Visible Ventures

> and Kieran Flanagan, CMO, Hubspot

> and Tenacity Capital

> Angels investing in the round include Olivier Pomel, CEO and co-founder of Datadog

> Archestra.AI is an open-source platform aiming to remedy this, with its tech enabling enterprises to connect sensitive data to AI agents securely

> Archestra.AI, which was founded in 2025 by Grafana Labs, the open-source analytics and visualisation web application, alumni

> has already bagged four Fortune 500 company clients

> has raised $10m in a seed funding round

> Matvey Kukuy, CEO and founder

> The seven-strong team

> We address this problem. We bring guardrails so employees can spin agents inside them.

### [Archestra.AI Announces $10M Seed 🎉 | Blog | Archestra](<https://archestra.ai/blog/archestra-announces-10m-seed>)

> 1,000+ community members

> 3,800+ GitHub stars

> 57 contributors

> Alexandre Berriche (Founder of Fleet)

> Archestra is a horizontal platform that lets in-house AI teams open up data access to business users without the usual nightmare scenarios. It plugs into the AI tools you already use, deploys in days, and gives you deterministic guardrails, governance, and observability out of the box.

> Built by the ex-Grafana team.

> Debo Dutta (Chief AI Officer at Nutanix)

> Declan Kelly (Founder & GP at Foreword)

> Gerhard Eschelbeck (former CISO at Google)

> Insiders (co-founders of ESL FACEIT Group)

> Joining are 20 Product (Will Wu, CPO at Match Group)

> Mark Goldberger (VP Sales at Metaview)

> multiple Fortune 500 companies are now running Archestra in production, connecting AI agents to real corporate data

> Our pre-seed investors — Concept Ventures , Zero Prime Ventures , Celero Ventures , and Aloniq — came back in.

> Tenacity Capital (AJ Tennant, ex-VP Sales at Slack and Glean)

> Visible Ventures with Carolyn Everson (Senior Advisor at Permira, Board Member at Coca-Cola and Disney)

> we've raised a $10 million Seed round, led by 20VC . That brings our total funding to $13.5M.

### [n8n vs Archestra for agentic workflows | Blog | Archestra](<https://archestra.ai/blog/n8n-vs-archestra-agents>)

> n8n does not have a per-identity tool routing model. Credentials are attached to nodes, not to the human who triggered the run

> n8n is a visual workflow tool that grew agent nodes. Archestra is an agent platform that integrates with workflow tools.

## 关联入口

- [公司档案](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=index&detail=entity&id=EN-348445124d405d5a>)
- [融资事件](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=events&detail=event&id=EV-f1a605a25af30dc5>)
- [相关方向](<https://jerryfang2023-stack.github.io/AI-Radar/opportunity-map.html#direction-cards>)
- [融资透视页面](<https://jerryfang2023-stack.github.io/AI-Radar/funding-insights.html>)
