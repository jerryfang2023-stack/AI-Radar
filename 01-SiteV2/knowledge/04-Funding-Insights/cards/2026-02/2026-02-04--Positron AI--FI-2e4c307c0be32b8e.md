---
type: funding_insight_card
sync_owner: guanlan-funding-insight-obsidian-sync
schema_version: "FUNDING-INSIGHT-V1.0"
funding_insight_id: "FI-2e4c307c0be32b8e"
event_id: "EV-7abd8ec418f1e7f3"
as_of_date: "2026-07-07"
announced_at: "2026-02-04"
company: "Positron AI"
company_entity_id: "EN-0995103010d39563"
round: "Series B"
amount: "$230 million"
sector: "AI 推理硬件/半导体"
publication_status: "auto_published"
source_count: 5
source: "01-SiteV2/site/data/funding-insights-v1.json"
tags:
  - funding-insight
  - application-center
---

# Positron AI｜$230 million｜Series B

> [!summary] 公司概况
> Positron AI 是一家专注于构建高能效 AI 推理硬件的半导体初创公司，旨在通过降低运行现代模型的成本和功耗，使 AI 推理在大规模部署时更加经济高效。

## 融资概览

- **融资轮次**：Series B
- **本轮金额**：$230 million
- **累计融资**：just over $300 million
- **公布日期**：2026-02-04

### 投资方

- **Arena Private Wealth** — 本轮联合领投
- **Jump Trading** — 本轮联合领投
- **Unless** — 本轮联合领投
- **Qatar Investment Authority (QIA)** — 本轮战略参投
- **Arm** — 本轮参投
- **Helena** — 本轮参投
- **Valor Equity Partners** — 既有投资方（本轮参投）
- **Atreides Management** — 既有投资方（本轮参投）
- **DFJ Growth** — 既有投资方（本轮参投）
- **Flume Ventures** — 既有投资方（本轮参投）
- **Resilience Reserve** — 既有投资方（本轮参投）
- **1517** — 既有投资方（本轮参投）

## 公司与团队

- **公司**：Positron AI
- **总部**：Reno, Nevada
- **官网**：[positron.ai](<positron.ai>)
- **团队规模**：50（2026-02-04）

### 创始团队

- **Mitesh Agrawal** — CEO
- **Thomas Sohmers** — CTO

## 产品

### Atlas

第一代基于 FPGA 的 AI 推理系统，专为快速部署和扩展而设计，采用全美国制造和封装的芯片与系统。

- **目标客户**：云服务商、先进计算和性能敏感行业的客户
- **关键能力**：
  - 全美国制造与封装
  - 支持快速部署和扩展
  - 针对 Transformer 推理进行硬件加速
  - 使用 Agilex-7M FPGA，集成 HBM 和 DDR5

### Asimov

下一代定制 ASIC 芯片，采用内存优先架构，旨在支持长上下文大语言模型、智能体工作流和下一代媒体与视频模型。

- **目标客户**：需要处理内存密集型推理工作负载的客户
- **关键能力**：
  - 每加速器支持 2 TB 内存
  - 每 Titan 系统支持 8 TB 内存
  - 使用 LPDDR 内存，不依赖 HBM
  - 基于芯粒（chiplet）设计

## 客户与应用

- **Jump Trading** — 金融交易；在其生产型推理工作负载上部署 Atlas 系统，实现相比 H100 系统约 3 倍的端到端延迟降低。
- **Cloudflare** — 云服务/网络；早期部署 Atlas 系统的客户。
- **Parasail** — 云服务/AI；早期部署 Atlas 系统的客户。

## 关键指标

- **B 轮融资额**：$230 million（2026-02-04）
- **B 轮后估值**：$1 billion（2026-02-04）
- **累计融资额**：just over $300 million（2026-02-04）
- **Atlas 相比 H100 的端到端延迟降低**：roughly 3x lower（2026-02-04）
- **Asimov 每瓦特 tokens 数 vs Rubin**：5x more tokens per watt（2026-02-04）
- **公司成立至 B 轮时间**：34 months（2026-02-04）
- **截至 B 轮的总支出**：$38 million（2026-02-04）

## 资本判断

> [!analysis] 应用层判断
> 资本押注的核心变量是 AI 推理工作负载从“计算密集型”向“内存和功耗密集型”的范式转移。本轮融资以超过 10 亿美元的估值完成，所依赖的已验证信号包括：1) 已出货的 Atlas 系统在客户 Jump Trading 的生产环境中实现了相比 H100 约 3 倍的端到端延迟降低；2) 客户 Jump Trading 从客户转变为联合领投方，提供了技术验证和真实市场需求的双重信号；3) 公司以仅 3800 万美元的总支出运营至 B 轮，展示了极高的资本效率。判断的证据边界在于，这些信号目前主要来自单一高价值客户（Jump Trading）的测试部署，大规模商业验证尚未完成。

### 已验证信号

- 已出货的 Atlas 系统在客户 Jump Trading 的生产环境中实现了相比 H100 约 3 倍的端到端延迟降低。
- 客户 Jump Trading 从客户转变为联合领投方，提供了技术验证和真实市场需求的双重信号。
- 公司以仅 3800 万美元的总支出运营至 B 轮，展示了极高的资本效率。

### 证据边界与风险

- 大规模商业验证尚未完成：目前公开的客户验证主要来自 Jump Trading 的小规模测试部署，尚未在多个大型云服务商或企业中证明其大规模部署的可靠性和经济性。

### 投资机构公开理由

#### Jump Trading · Alex Davies · Chief Technology Officer

Jump Trading 在作为客户部署 Atlas 系统后，验证了其在生产环境中相比 H100 系统约 3 倍的端到端延迟降低，并认可 Positron 以内存和功耗为先的路线图能够重塑推理的成本曲线和能力。

> We invested because Positron combines traction today with a roadmap that can reshape the cost curve and capabilities for inference.

## 同类对照

### Nvidia

- **产品/方案**：H100 GPU
- **场景**：AI 推理工作负载
- **目标客户**：需要大规模 AI 推理的企业和云服务商
- **核心差异**：Positron Atlas 在特定推理工作负载上实现约 3 倍于 H100 系统的端到端延迟降低，且功耗不到其三分之一。

### Nvidia

- **产品/方案**：Rubin GPU
- **场景**：下一代 AI 推理工作负载
- **目标客户**：需要处理内存密集型推理工作负载的客户
- **核心差异**：Positron Asimov 每设备配备超过 2304 GB 内存，而 Rubin 仅为 384 GB；在核心工作负载上每瓦特 tokens 数提升 5 倍。

## 融资历史

- [[01-WaveSight/01-SiteV2/knowledge/04-Funding-Insights/cards/2026-02/2026-02-04--Positron AI--FI-2e4c307c0be32b8e|2026-07-07｜独家：Positron 获 2.3 亿美元 B 轮融资，挑战英伟达 AI 芯片｜$230M]]

## 研究来源

- [独家：Positron 获 2.3 亿美元 B 轮融资，挑战英伟达 AI 芯片](<https://techcrunch.com/2026/02/04/exclusive-positron-raises-230m-series-b-to-take-on-nvidias-ai-chips/>) · `FISRC-272c28400131d6f2` · keyword search / Anysearch
- [Positron AI raises $230M at over $1B valuation to build energy-efficient AI accelerator hardware - SiliconANGLE](<https://siliconangle.com/2026/02/04/positron-ai-raises-230m-1b-valuation-build-energy-efficient-ai-accelerator-hardware/>) · `FISRC-7ab329bc47036713` · siliconangle.com
- [Positron’s $230M Funding Led By Financial Trading Firms](<https://www.eetimes.com/positron-230-million-funding-led-by-financial-trading-firms/>) · `FISRC-1c33ca1a5b60d234` · eetimes.com
- [Positron AI Raises $230M Series B at Over $1B Valuation to Scale Energy-Efficient AI Inference](<https://theaiinsider.tech/2026/02/04/positron-ai-raises-230m-series-b-at-over-1-billion-valuation-to-scale-energy-efficient-ai-inference/>) · `FISRC-086094933b1962b5` · theaiinsider.tech
- [Positron AI Raises $230M Series B to Challenge Nvidia in Inference | GMA](<https://gmacouncil.org/news/positron-ai-raises-230m-series-b-to-challenge-nvidia-in-inference>) · `FISRC-8322dd28c1a5e303` · gmacouncil.org

## 证据原文

### [Positron AI Raises $230M Series B at Over $1B Valuation to Scale Energy-Efficient AI Inference](<https://theaiinsider.tech/2026/02/04/positron-ai-raises-230m-series-b-at-over-1-billion-valuation-to-scale-energy-efficient-ai-inference/>)

> Existing investors Valor Equity Partners, Atreides Management, DFJ Growth, Resilience Reserve, Flume Ventures, and 1517 also participated.

> In our testing, Positron Atlas delivered roughly 3x lower end-to-end latency than a comparable H100-based system on the inference workloads we evaluated

> Positron AI builds purpose-built hardware and software to make AI inference dramatically cheaper and more energy-efficient.

> The company’s shipping product, Atlas, is an inference system designed for rapid deployment and scaling. Atlas is also a fully American-fabricated and manufactured silicon and system

> We invested because Positron combines traction today with a roadmap that can reshape the cost curve and capabilities for inference.

### [Positron’s $230M Funding Led By Financial Trading Firms](<https://www.eetimes.com/positron-230-million-funding-led-by-financial-trading-firms/>)

> Asimov will use LPDDR memory (no HBM)

> Lead investor Jump Trading had come to Positron as a customer, but was so impressed that it became an investor.

> Positron CTO Thomas Sohmers told EE Times

> Positron has grown its team to 50 in the last six months and will grow to around 100 by the end of 2026.

> The 34-month-old startup has reached a post-money valuation of over $1 billion

> The company operates in a very capital-efficient way, he said, having spent only $38 million to date.

> The company’s first-generation product, Atlas, uses FPGAs—specifically, the Agilex-7M with HBM and DDR5.

### [独家：Positron 获 2.3 亿美元 B 轮融资，挑战英伟达 AI 芯片](<https://techcrunch.com/2026/02/04/exclusive-positron-raises-230m-series-b-to-take-on-nvidias-ai-chips/>)

> co-led by Arena Private Wealth, Jump Trading, and Unless

> Positron’s fundraise brings the three-year-old startup’s total capital raised to just over $300 million.

> Semiconductor startup Positron has secured $230 million in Series B funding

> The company claims its first-generation chip, Atlas, manufactured in Arizona, can match the performance of Nvidia’s H100 GPUs for less than a third of the power.

> The Reno-based startup’s Series B

> The round, which brought Positron to a $1 billion valuation

> The startup previously raised $75 million last year from investors including Valor Equity Partners, Atreides Management, DFJ Growth, Flume Ventures, and Resilience Reserve.

> with strategic investment from Qatar Investment Authority (QIA)

### [Positron AI raises $230M at over $1B valuation to build energy-efficient AI accelerator hardware - SiliconANGLE](<https://siliconangle.com/2026/02/04/positron-ai-raises-230m-1b-valuation-build-energy-efficient-ai-accelerator-hardware/>)

> And our next-generation chip will deliver five times more tokens per watt in our core workloads versus Nvidia’s upcoming Rubin GPU.

> Existing investors joining the round included Valor Equity Partners, Atreides Management and DFJ Growth, among others.

> said Chief Executive Mitesh Agrawal

> with participation from new and strategic investors Qatar Investment Authority, Arm and Helena

### [Positron AI Raises $230M Series B to Challenge Nvidia in Inference | GMA](<https://gmacouncil.org/news/positron-ai-raises-230m-series-b-to-challenge-nvidia-in-inference>)

> appealing to hyperscalers like Cloudflare and Parasail—early customers already deploying Atlas.

## 关联入口

- [公司档案](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=index&detail=entity&id=EN-0995103010d39563>)
- [融资事件](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=events&detail=event&id=EV-7abd8ec418f1e7f3>)
- [融资透视页面](<https://jerryfang2023-stack.github.io/AI-Radar/funding-insights.html>)
