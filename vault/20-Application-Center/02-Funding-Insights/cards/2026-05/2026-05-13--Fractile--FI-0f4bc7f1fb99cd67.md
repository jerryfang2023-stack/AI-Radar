---
type: funding_insight_card
sync_owner: guanlan-funding-insight-obsidian-sync
schema_version: "FUNDING-INSIGHT-V1.0"
funding_insight_id: "FI-0f4bc7f1fb99cd67"
event_id: "EV-70a994b9339f92e7"
as_of_date: "2026-05-23"
announced_at: "2026-05-13"
company: "Fractile"
company_entity_id: "EN-8da5eafb322ee86e"
round: "B轮"
amount: "2.2亿美元"
sector: "AI推理硬件/半导体"
publication_status: "auto_published"
source_count: 5
source: "01-SiteV2/site/data/funding-insights-v1.json"
tags:
  - funding-insight
  - application-center
---

# Fractile｜2.2亿美元｜B轮

> [!summary] 公司概况
> Fractile是一家英国AI推理芯片初创公司，成立于2022年，致力于通过彻底重新设计硬件来突破前沿AI模型在推理速度和成本上的瓶颈。公司采用内存内计算架构，将计算与存储融合在同一芯片上，以消除传统架构中因数据在处理器与内存间搬运而产生的“内存墙”限制。

## 融资概览

- **融资轮次**：B轮
- **本轮金额**：2.2亿美元
- **累计融资**：2.2亿美元
- **公布日期**：2026-05-13

### 投资方

- **Accel** — 本轮联合领投
- **Factorial Funds** — 本轮联合领投
- **Founders Fund** — 本轮联合领投
- **Conviction** — 本轮参投
- **Gigascale** — 本轮参投
- **01A** — 本轮参投
- **Felicis** — 本轮参投
- **Buckley Ventures** — 本轮参投
- **8VC** — 本轮参投
- **Kindred Capital** — 既有投资方
- **Pat Gelsinger** — 天使投资人

## 公司与团队

- **公司**：Fractile
- **总部**：英国伦敦
- **官网**：[https://www.fractile.ai](<https://www.fractile.ai>)

### 创始团队

- **Walter Goodwin** — 首席执行官
- **Yuhang Song** — 联合创始人

## 产品

### AI推理芯片

Fractile正在开发用于数据中心AI推理的专用芯片，采用内存内计算架构，将计算与SRAM存储融合在同一芯片上，以消除传统GPU架构中因频繁访问外部DRAM而产生的内存带宽瓶颈，从而实现更快、更节能、成本更低的推理。

- **目标客户**：运行前沿大语言模型并面临推理速度和成本挑战的AI实验室和云服务商
- **关键能力**：
  - 内存内计算架构，直接在SRAM中执行计算
  - 声称运行LLM速度比现有硬件快100倍
  - 声称运营成本降低90%
  - 集成Andes AX45MPV RISC-V向量处理器

## 客户与应用

- **Anthropic** — 生成式AI；据报道，Anthropic已与Fractile就购买其推理芯片进行早期洽谈，计划用于其AI模型的推理工作负载。

## 关键指标

- **公司估值**：约10亿美元（2026-05）
- **芯片可用时间**：2027年（2026-05）
- **英国运营投资计划**：1亿英镑（2026-02）

## 资本判断

> [!analysis] 应用层判断
> 资本押注的核心变量是“内存墙”能否被内存内计算架构突破。当前估值约10亿美元，建立在芯片尚未量产、预计2027年才能部署的前提下，说明投资机构认可了Fractile从物理层面重构推理硬件的技术路径。已验证信号包括：创始团队来自牛津大学，拥有从AI研究到芯片微架构的全栈能力；已获得Pat Gelsinger、Hermann Hauser、Stan Boland等半导体行业标志性人物的个人投资背书；Anthropic已就芯片采购进行早期洽谈，表明潜在客户对技术方向的认可。但芯片尚未流片，所有性能声明均未经过第三方验证，技术风险极高。

### 已验证信号

- 创始团队具备从AI研究到芯片微架构的全栈技术能力
- 获得前Intel CEO Pat Gelsinger、Arm联合创始人Hermann Hauser、前Arm/Acorn高管Stan Boland等半导体行业资深人士的个人投资
- Anthropic已就芯片采购进行早期洽谈，显示潜在客户对技术方向的兴趣
- NATO创新基金参与投资，反映AI推理硬件已被视为国家安全议题

### 证据边界与风险

- 芯片尚未流片，所有性能声明（100倍速度提升、90%成本降低）均未经过第三方验证，存在技术无法实现的风险
- SRAM的单位比特成本远高于DRAM，能否在芯片上集成足够SRAM以承载前沿模型权重存在工程和经济上的双重不确定性
- 预计2027年芯片才能部署，届时Nvidia及其他推理芯片初创公司可能已推出新一代产品，市场窗口存在收窄风险

## 公开引语

### Walter Goodwin

> We bet everything on the logical conclusion: that the only way to truly unlock this latent value, to make speed viable at scale, was to radically re-invent the hardware that we run our frontier AI models on.

### Kanishka Narayan

> A strong vote of confidence in British AI.

## 融资历史

- [[20-Application-Center/02-Funding-Insights/cards/2026-05/2026-05-13--Fractile--FI-0f4bc7f1fb99cd67|2026-05-23｜Fractile 融资2.2亿美元，打造下一代推理硬件｜$220M]]

## 研究来源

- [Fractile 融资2.2亿美元，打造下一代推理硬件](<https://www.fractile.ai/news/fractile-raises-220m-to-build-the-next-generation-of-inference-hardware>) · `FISRC-62071134d28f47b9` · keyword search / Anysearch
- [Fractile raises $220m to accelerate development of AI inference chips - DCD](<https://www.datacenterdynamics.com/en/news/fractile-raises-220m-to-accelerate-development-of-ai-inference-chips/>) · `FISRC-bd0bb5e16dde4b65` · datacenterdynamics.com
- [UK’s Fractile raises $220m for inference ICs ⋆ Electronics Weekly](<https://www.electronicsweekly.com/news/business/uks-fractile-raises-220m-for-inference-ics-2026-05/>) · `FISRC-a09bc7e6d17a0b0f` · electronicsweekly.com
- [UK Startup Fractile Raises $220M to Solve AI's Inference Bottleneck with In-Memory Chips | FAQ](<https://faq.com.tw/en/hardware/2026-05-20-fractile-220m-series-b-ai-inference-chips-en/>) · `FISRC-d1b1bec002df54f6` · faq.com.tw
- [Fractile Raises $220M Series B to Reinvent AI Inference Hardware | FounderTrove](<https://foundertrove.com/fractile-raises-220m-series-b-to-reinvent-ai-inference-hardware>) · `FISRC-cd2cd5f60b7c7d67` · foundertrove.com

## 证据原文

### [Fractile 融资2.2亿美元，打造下一代推理硬件](<https://www.fractile.ai/news/fractile-raises-220m-to-build-the-next-generation-of-inference-hardware>)

> a financing round led by Accel, Factorial Funds, and Founders Fund

> Fractile was founded in 2022 on the bet that, eventually, the world’s most capable AI systems would be limited in their impact by the amount of time they take to produce useful outputs.

> We bet everything on the logical conclusion: that the only way to truly unlock this latent value, to make speed viable at scale, was to radically re-invent the hardware that we run our frontier AI models on.

> we have raised $220M to accelerate the path to getting our first chips and systems into customers’ hands, in a financing round led by Accel, Factorial Funds, and Founders Fund

> with participation from Conviction, Gigascale, 01A, Felicis, Buckley Ventures and 8VC

### [UK’s Fractile raises $220m for inference ICs ⋆ Electronics Weekly](<https://www.electronicsweekly.com/news/business/uks-fractile-raises-220m-for-inference-ics-2026-05/>)

> angel investors including Pat Gelsinger

> Founded in 2022 by Oxford PhD Walter Goodwin (pictured)

> Fractile has licensed the Andes AX45MPV Risc-V vector processor, combined with ACE (Andes Automated Custom Extension) and Andes Domain Library, and plans to incorporate the vector processing unit into its first generation datacentre AI inference accelerator.

> Fractile, the UK AI inference chip startup, has raised $220m at a valuation of around $1bn.

> Fractile’s chips are not expected to be ready for datacentre deployment until 2027.

> Fractile’s chips claim to be able to run LLMs up to 100-times faster than existing hardware while lowering operational costs by 90%.

> In July 2024 Fractile raised $15m in seed funding, with investors including Kindred Capital

### [Fractile raises $220m to accelerate development of AI inference chips - DCD](<https://www.datacenterdynamics.com/en/news/fractile-raises-220m-to-accelerate-development-of-ai-inference-chips/>)

> a report from The Information claimed that generative AI company Anthropic had held discussions with Fractile regarding the purchase of the startup’s inference chips when the hardware becomes available in 2027.

> Fractile has raised $220 million in a Series B funding round.

> Fractile was founded in 2022 by Dr. Walter Goodwin, a then PhD student at the University of Oxford’s Robotics Institute.

> The company is developing chips that use in-memory compute, an approach that allows processors to run calculations directly in computer memory.

> the startup announced plans to invest £100 million ($135m) to bolster its UK operations over the next three years

> UK chip startup Fractile has raised $220 million in a Series B funding round.

### [Fractile Raises $220M Series B to Reinvent AI Inference Hardware | FounderTrove](<https://foundertrove.com/fractile-raises-220m-series-b-to-reinvent-ai-inference-hardware>)

> A strong vote of confidence in British AI.

### [UK Startup Fractile Raises $220M to Solve AI's Inference Bottleneck with In-Memory Chips | FAQ](<https://faq.com.tw/en/hardware/2026-05-20-fractile-220m-series-b-ai-inference-chips-en/>)

> Anthropic is reportedly in early talks to become a customer.

> Fractile was founded in 2022 by Walter Goodwin and Yuhang Song.

## 关联入口

- [公司档案](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=index&detail=entity&id=EN-8da5eafb322ee86e>)
- [融资事件](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=events&detail=event&id=EV-70a994b9339f92e7>)
- [融资透视页面](<https://jerryfang2023-stack.github.io/AI-Radar/funding-insights.html>)
