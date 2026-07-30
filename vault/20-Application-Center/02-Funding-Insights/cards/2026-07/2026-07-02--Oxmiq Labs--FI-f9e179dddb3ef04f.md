---
type: funding_insight_card
sync_owner: guanlan-funding-insight-obsidian-sync
schema_version: "FUNDING-INSIGHT-V1.0"
funding_insight_id: "FI-f9e179dddb3ef04f"
event_id: "EV-63dee9f748531f08"
as_of_date: "2026-07-07"
announced_at: "2026-07-02"
company: "Oxmiq Labs"
company_entity_id: "EN-86c49cd0980883a3"
round: "Series A"
amount: "$35m"
sector: "AI 芯片架构授权"
publication_status: "auto_published"
source_count: 3
source: "01-SiteV2/site/data/funding-insights-v1.json"
tags:
  - funding-insight
  - application-center
---

# Oxmiq Labs｜$35m｜Series A

> [!summary] 公司概况
> Oxmiq Labs 是一家由资深芯片架构师 Raja Koduri 创立的 AI 芯片架构初创公司，旨在通过授权其 OxCore GPU 架构，让芯片制造商无需从头开始完整的多年设计项目即可构建定制 AI 芯片。

## 融资概览

- **融资轮次**：Series A
- **本轮金额**：$35m
- **累计融资**：$60m
- **公布日期**：2026-07-02

### 投资方

- **Fundomo** — 本轮共同领投
- **Samsung Catalyst Fund** — 本轮共同领投
- **MediaTek** — 本轮参投
- **Pegatron Venture Capital** — 本轮参投
- **Darwin Ventures** — 本轮参投
- **Morgan Creek Digital** — 本轮参投
- **Intel Capital** — 既有投资方
- **CDIB-TEN** — 既有投资方
- **AM Intelligence Labs** — 既有投资方

## 公司与团队

- **公司**：Oxmiq Labs
- **总部**：Campbell, California

### 创始团队

- **Raja Koduri** — 创始人

## 产品

### OxCore

OxCore 是一种可授权的 GPU 架构，集成了三个计算引擎：一个兼容 CUDA 的 GPU 引擎、一个张量处理引擎和一个协调系统工作负载的编排引擎，专为近内存计算设计，以减少 AI 工作负载中的数据移动。

- **目标客户**：半导体公司、系统构建商、AI 基础设施构建者、追求主权 AI 的政府
- **关键能力**：
  - 集成 CUDA 兼容 GPU 引擎、张量处理引擎和编排引擎
  - 近内存计算优化，减少数据移动
  - 可授权 IP 模式，无需从头设计芯片

### OxQuilt

OxQuilt 是一种灵活的小芯片集成架构，允许客户混合不同的逻辑工艺节点和先进封装选项，不受特定制造厂或内存类型的限制。

- **目标客户**：半导体公司
- **关键能力**：
  - 灵活的小芯片集成
  - 适应任何供应链，可混合不同逻辑工艺节点和封装选项

### OxPython

OxPython 是一个专用软件层，允许开发者直接在 OxCore 硬件上运行现有的 CUDA 和 PyTorch 代码，无需任何代码修改。

- **目标客户**：AI 开发者
- **关键能力**：
  - 零代码修改运行 CUDA 和 PyTorch 代码
  - 保证与新发布 AI 模型的即时兼容性

## 客户与应用

- **AM Intelligence Labs** — AI 基础设施；合作架构一个 2 GW 可再生能源驱动的 AI 计算平台

## 关键指标

- **软件栈公开测试用户数**：20 家公司和 10 所大学（2026-07-01）
- **软件栈公开测试 GPU 数量**：近 300 个 GPU（2026-07-01）

## 资本判断

> [!analysis] 应用层判断
> 资本押注的核心变量是 IP 授权模式能否在前沿 AI 加速器领域复制 Arm 在 CPU 领域的成功。本轮融资的已验证信号包括：创始人 Raja Koduri 曾在 AMD、Apple、Intel 三家行业巨头交付 GPU 芯片的履历；芯片传奇 Jim Keller 加入董事会带来的行业信任背书；以及三星催化剂基金、联发科、和硕等战略投资方构成的产业链上下游支持。但公开记录中未披露任何已签署授权协议产生的近期收入，商业牵引力尚未得到验证，判断的证据边界仅限于团队背景、董事会构成和投资方组合。

### 已验证信号

- 创始人 Raja Koduri 曾在 AMD、Apple、Intel 三家行业巨头交付 GPU 芯片
- 芯片架构师 Jim Keller 加入董事会
- 三星催化剂基金、联发科、和硕等产业链上下游战略投资方参与本轮融资
- 软件栈公开测试已被 20 家公司和 10 所大学使用

### 证据边界与风险

- IP 授权模式在前沿 AI 加速器领域未经大规模验证，最大买家 Nvidia 等历来倾向于完全拥有自研架构而非授权他人设计
- 未披露任何已签署授权协议产生的近期收入，商业牵引力无法从公开记录核实

## 同类对照

### Arm Holdings

- **产品/方案**：CPU 核心授权
- **场景**：授权处理器核心设计给芯片制造商
- **目标客户**：半导体公司
- **核心差异**：Arm 授权 CPU 核心，Oxmiq 授权 AI GPU 架构；Arm 模式已运行数十年，Oxmiq 将授权模式应用于前沿 AI 加速器领域，该领域此前由 Nvidia 等自研架构主导。

### Nvidia

- **产品/方案**：AI 加速器芯片
- **场景**：销售完整的 AI 芯片，拥有自研架构
- **目标客户**：云服务商、AI 公司
- **核心差异**：Nvidia 倾向于完全拥有其架构而非授权他人设计，Oxmiq 则提供可授权的 GPU 架构，让客户构建定制 AI 芯片，减少对 Nvidia 的依赖。

### SiFive

- **产品/方案**：RISC-V 处理器核心授权
- **场景**：授权处理器核心设计
- **目标客户**：半导体公司
- **核心差异**：SiFive 基于 RISC-V 授权处理器核心，Oxmiq 授权 AI GPU 架构；两者均采用 IP 授权模式，但面向不同的计算领域。

## 公开引语

### Raja Koduri

> India cannot play in AI without taking control of the cost of it. AI compute costs would need to fall by 50-100 times to drive mass adoption.

## 融资历史

- [[20-Application-Center/02-Funding-Insights/cards/2026-07/2026-07-02--Oxmiq Labs--FI-f9e179dddb3ef04f|2026-07-07｜Raja Koduri 的 Oxmiq 融资 3500 万美元，出租 AI 芯片设计而非销售芯片｜$35m]]

## 研究来源

- [Raja Koduri 的 Oxmiq 融资 3500 万美元，出租 AI 芯片设计而非销售芯片](<https://thenextweb.com/news/oxmiq-35-million-oxcore-chip-architecture>) · `FISRC-b7543ce87aeb9664` · keyword search / Anysearch
- [Raja Koduri’s OXMIQ Raises $35M to License AI Chips](<https://ventureburn.com/raja-koduri-oxmiq-raises-35m-license-ai-chips/>) · `FISRC-40e752fe87070758` · ventureburn.com
- [Ex-Intel exec Raja Koduri's OXMIQ raises $35 million to ...](<https://m.economictimes.com/tech/artificial-intelligence/oxmiq-raises-35-million-to-license-ai-chip-designs-as-sovereign-ai-demand-grows/articleshow/132117037.cms>) · `FISRC-0caa795661371617` · m.economictimes.com

## 证据原文

### [Ex-Intel exec Raja Koduri's OXMIQ raises $35 million to ...](<https://m.economictimes.com/tech/artificial-intelligence/oxmiq-raises-35-million-to-license-ai-chip-designs-as-sovereign-ai-demand-grows/articleshow/132117037.cms>)

> "India cannot play in AI without taking control of the cost of it. AI compute costs would need to fall by 50-100 times to drive mass adoption," he said adding that chip design is where 92% of margins lie.

> Earlier this year, OXMIQ partnered with AM Intelligence Labs, part of the AM Green Group, to architect a 2 GW renewable-powered AI compute platform in Uttar Pradesh, with the first 1 GW phase expected to go live by the end of 2027.

> Existing investors MediaTek, Pegatron Venture Capital, CDIB-TEN, Darwin Ventures, Morgan Creek Digital, AM Intelligence Labs and Intel Capital also participated.

> Founded in 2024 and headquartered in Campbell, California, with engineering teams in Hyderabad and Bengaluru, OXMIQ is building what Koduri describes as an "Arm for AI GPUs".

> OXMIQ aims to license GPU intellectual property, through its flagship product OxCore, enabling customers to build custom AI processors instead of relying solely on Nvidia or investing billions in developing their own silicon.

> OXMIQ launched a public beta of its software stack in November 2025 and says it is now being used by 20 companies and 10 universities across nearly 300 GPUs.

### [Raja Koduri’s OXMIQ Raises $35M to License AI Chips](<https://ventureburn.com/raja-koduri-oxmiq-raises-35m-license-ai-chips/>)

> OXMIQ pairs this core with OxQuilt, a flexible chiplet integration architecture. Traditional AI chip designs lock developers into a specific manufacturing foundry or memory type. OxQuilt bypasses this limitation entirely. It adapts to any supply chain, letting customers mix different logic process nodes and advanced packaging options.

> OXMIQ tackles this problem with OxPython, a dedicated software layer designed for zero-friction deployment. OxPython allows developers to run existing CUDA and PyTorch code directly on OxCore hardware. Crucially, this requires absolutely zero code modifications.

### [Raja Koduri 的 Oxmiq 融资 3500 万美元，出租 AI 芯片设计而非销售芯片](<https://thenextweb.com/news/oxmiq-35-million-oxcore-chip-architecture>)

> OxCore is the product at the centre of that bet. It integrates three compute engines, a CUDA-compatible GPU engine, a tensor processing engine, and an orchestration engine that coordinates workloads across the system, functions typically split across separate chips. Oxmiq says the tighter coupling is built for near-memory compute, reducing the data movement that drives up both cost and energy use in AI workloads.

> Oxmiq is headquartered in Campbell, California, with a development site in Hyderabad, India.

> Oxmiq Labs has closed a $35m Series A to scale OxCore, a licensable GPU architecture the startup says lets chipmakers build custom AI silicon without running a full, multi-year design programme of their own. The round brings the company's total capital raised to $60m since its founding by veteran chip architect Raja Koduri.

> Oxmiq wants to sell the design itself as licensable IP, the way Arm licenses processor cores, rather than selling finished chips.

> Raja Koduri’s Oxmiq raises $35m to rent out AI chip design instead of selling chips

> RISC-V startups such as SiFive have built entire businesses on licensing processor cores rather than shipping finished silicon.

> The round was co-led by Fundomo and Samsung Catalyst Fund

> with participation from MediaTek, Pegatron Venture Capital, Darwin Ventures, Morgan Creek Digital, and other strategic and financial investors named in the announcement.

## 关联入口

- [公司档案](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=index&detail=entity&id=EN-86c49cd0980883a3>)
- [融资事件](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=events&detail=event&id=EV-63dee9f748531f08>)
- [融资透视页面](<https://jerryfang2023-stack.github.io/AI-Radar/funding-insights.html>)
