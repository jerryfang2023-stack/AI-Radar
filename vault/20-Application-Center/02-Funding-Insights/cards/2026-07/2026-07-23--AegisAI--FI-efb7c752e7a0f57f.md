---
type: funding_insight_card
sync_owner: guanlan-funding-insight-obsidian-sync
schema_version: "FUNDING-INSIGHT-V1.0"
funding_insight_id: "FI-efb7c752e7a0f57f"
event_id: "EV-9b81b0dd09a046ab"
as_of_date: "2026-07-24"
announced_at: "2026-07-23"
company: "AegisAI"
company_entity_id: "EN-57b8b5990c299db8"
round: "Series A"
amount: "$36 million"
sector: "邮件安全/AI安全"
publication_status: "auto_published"
source_count: 5
source: "01-SiteV2/site/data/funding-insights-v1.json"
tags:
  - funding-insight
  - application-center
---

# AegisAI｜$36 million｜Series A

> [!summary] 公司概况
> AegisAI是一家由前谷歌安全高管创立的邮件安全公司，通过部署自主AI智能体来分析邮件意图与身份信号，以防御AI生成的鱼叉式网络钓鱼、商业邮件诈骗等高级威胁。

## 融资概览

- **融资轮次**：Series A
- **本轮金额**：$36 million
- **累计融资**：$49 million
- **公布日期**：2026-07-23

### 投资方

- **Battery Ventures** — 本轮领投
- **Accel** — 既有投资方，本轮参投
- **Foundation Capital** — 既有投资方，本轮参投

## 公司与团队

- **公司**：AegisAI
- **总部**：San Francisco
- **官网**：[aegisai.ai](<aegisai.ai>)

### 创始团队

- **Cy Khormaee** — 联合创始人兼CEO
- **Ryan Luo** — 联合创始人

## 产品

### Agentic Email Security

在员工收件箱内部署自主AI智能体，实时分析每封邮件的上下文、发件人身份信号和意图，以检测并阻止AI生成的鱼叉式钓鱼、商业邮件诈骗和恶意附件。

- **目标客户**：金融科技、科技公司等面临高级邮件威胁的企业
- **关键能力**：
  - AI智能体分析邮件上下文与语言以捕获定向攻击和BEC诈骗
  - 检测异常、扫描二维码并在到达收件箱前中和恶意附件
  - 自动分类以减少误报高达90%，同时多拦截22%的攻击
  - 通过API与Google Workspace和Microsoft 365集成，无需更改MX记录
  - 提供可解释的告警、仪表板和CISO合规报告

### Vanguard

威胁狩猎智能体，当邮件被标记后，Vanguard会像用户一样跟踪可疑链接和附件穿越开放网络，击败对抗性CAPTCHA、隐藏页面和武器化文档，并在数分钟内返回完整威胁报告。

- **目标客户**：需要主动威胁狩猎能力的安全团队
- **关键能力**：
  - 跟踪可疑链接和附件超越收件箱范围
  - 击败对抗性CAPTCHA和隐藏页面
  - 数分钟内生成威胁报告

### AI Red Team Agent

在安全团队授权范围内，对组织自身员工运行攻击者级别的鱼叉式钓鱼测试，使用自主OSINT和个性化诱饵，以评估真实暴露面。

- **目标客户**：希望测试员工对AI生成钓鱼攻击抵御能力的安全团队
- **关键能力**：
  - 自主OSINT收集目标角色、项目和关系信息
  - 为每个目标生成2-3个个性化诱饵
  - 记录点击、回复和凭证提交事件
  - 全程由安全团队设定范围并可随时停止

## 客户与应用

- **Mesh** — 加密支付；使用AegisAI捕获从模糊测试到AI生成鱼叉式钓鱼和BEC的所有攻击，无需安全团队花时间管理规则。
- **LangChain** — 人工智能；作为AI领域高曝光公司，LangChain是AI生成攻击的主要目标，AegisAI的智能体实时适应，无需规则编写或调优即可发现此前遗漏的威胁。
- **Lokker** — 隐私合规；AegisAI捕获了通过被攻破的Salesforce基础设施发送的攻击，该攻击不涉及恶意链接或附件，仅利用受信任供应商的自有系统。

## 关键指标

- **AI生成鱼叉式钓鱼占所有钓鱼邮件的比例增长**：从2.8%增长至13.9%（2025年内）（2025）
- **AI生成邮件绕过传统过滤器的效率**：比人工编写的攻击高出近一倍（2025）
- **成功AI攻击中通过邮件认证的比例**：72.6%（2025）
- **FBI报告的网络犯罪损失**：$20.8 billion（2025）
- **商业邮件诈骗损失**：$11.64 billion（2025）
- **误报减少比例**：高达90%（2026-07-23）
- **额外拦截攻击比例**：22%（2026-07-23）
- **集成时间**：5分钟（通过API）（2026-07-23）

## 资本判断

> [!analysis] 应用层判断
> 资本押注的核心变量是“AI原生攻击使传统规则和签名防御失效”这一范式转变。AegisAI的融资建立在三个已验证信号之上：其一，AI生成鱼叉式钓鱼在2025年内增长5倍（从2.8%到13.9%），且绕过传统过滤器的效率是人工攻击的近两倍；其二，72.6%的成功AI攻击通过了邮件认证，来自被攻破的合法账户，表明基于信誉和签名的防御已失效；其三，创始团队来自谷歌核心安全团队（reCAPTCHA、Safe Browsing），具备在数十亿用户规模构建防御系统的经验。公司未披露估值和收入，但声称已签约数十家客户，包括Mesh、LangChain和Lokker。资本判断的证据边界限于公司自身在M3AAWG会议发布的研究数据、FBI网络犯罪报告的外部损失数据，以及投资方对团队背景的认可；缺乏独立基准测试结果和第三方验证的收入数据。

### 已验证信号

- AI生成鱼叉式钓鱼在2025年内从2.8%增长至13.9%，增长约5倍
- AI生成邮件绕过传统过滤器的效率是人工编写攻击的近两倍
- 72.6%的成功AI攻击通过了邮件认证，来自被攻破的合法账户
- FBI报告2025年网络犯罪损失达208亿美元，BEC占116.4亿美元
- 创始团队来自谷歌核心安全团队，曾构建reCAPTCHA、Safe Browsing和Web Risk
- 已签约数十家金融科技和科技客户，包括Mesh、LangChain和Lokker

### 证据边界与风险

- 公司未提供独立基准测试结果，其90%误报减少和22%额外拦截等性能声明均为自身数据，缺乏第三方验证。
- 邮件安全市场竞争激烈，既有厂商Proofpoint、Mimecast以及新玩家Abnormal Security、Ocean均在将AI智能体附加到现有产品上，AegisAI尚未证明其差异化优势能转化为市场份额。

### 投资机构公开理由

#### Battery Ventures · Dharmesh Thakker · general partner

AegisAI创始团队在谷歌规模下构建了reCAPTCHA、Safe Browsing等系统，是投资方愿意押注赢得该市场的团队。

> Cy and Ryan spent a decade building exactly these systems at Google scale. They're the team we'd back to win this market.

#### Battery Ventures · Dharmesh Thakker · general partner

Thakker注意到邮件攻击增加后，主动寻找一家能以AI对抗AI的初创公司，目标是取代传统邮件安全工具，转向智能体驱动的防御。

> When Dharmesh Thakker, general partner at Battery Ventures, noticed an increase in email attacks, he set out to invest in a startup that could defend against AI with AI, one aiming to replace legacy email security tools with agentic-driven defense.

## 同类对照

### Ocean

- **产品/方案**：基于AI的邮件安全方案
- **场景**：分析每封入站邮件的上下文以检测欺诈和冒充企图
- **目标客户**：需要替代传统邮件安全工具的企业
- **融资概况**：Lightspeed投资
- **核心差异**：AegisAI由曾帮助保护Gmail（全球最大邮件系统）的专家领导，投资方认为其在成为领先防黑客公司方面具有最佳机会。

### Proofpoint

- **产品/方案**：传统邮件安全方案
- **场景**：既有邮件安全与威胁防护
- **目标客户**：企业邮件安全市场
- **核心差异**：AegisAI使用AI智能体进行意图分析，而非依赖基于已知签名的规则系统；Ocean和AegisAI等新玩家正试图取代Proofpoint等既有厂商。

### Mimecast

- **产品/方案**：传统邮件安全方案
- **场景**：既有邮件安全与威胁防护
- **目标客户**：企业邮件安全市场
- **核心差异**：AegisAI以AI对抗AI，部署自主智能体分析每封邮件的意图和身份，而非依赖规则系统。

### Abnormal Security

- **产品/方案**：基于AI的邮件安全方案
- **场景**：检测欺诈和冒充企图的邮件安全
- **目标客户**：企业邮件安全市场
- **核心差异**：AegisAI由前谷歌Gmail安全团队创立，投资方认为其团队背景使其在成为领先防黑客公司方面具有优势。

## 公开引语

### Cy Khormaee

> The core idea of building customized, highly advanced agents that can do investigations is going to [determine] who becomes the next dominant security company.

### Cy Khormaee

> You cannot patch human trust. If your security program still relies on template-based phishing tests and awareness training, you are training your people to spot last year's threat, not a capable agent crafting a novel lure just for them. When the attack is AI, the defense has to be AI.

## 融资历史

- [[20-Application-Center/02-Funding-Insights/cards/2026-07/2026-07-23--AegisAI--FI-efb7c752e7a0f57f|2026-07-23｜由前谷歌安全高管创立的AegisAI获3600万美元融资，用于阻止AI驱动的鱼叉式网络钓鱼｜$36 million]]

## 研究来源

- [由前谷歌安全高管创立的AegisAI获3600万美元融资，用于阻止AI驱动的鱼叉式网络钓鱼](<https://techcrunch.com/2026/07/23/aegisai-founded-by-former-google-security-execs-lands-36m-to-stop-ai-driven-spear-phishing/>) · `FISRC-7a2e33bd2177a4c7` · TechCrunch AI
- [AegisAI funding reaches $49 million after $36 million Series A | Venture Post](<https://venturepost.co/enterprise/aegisai-funding>) · `FISRC-4b3af8138bc7fb99` · venturepost.co
- [AegisAI Raises $36 Million Series A Led by Battery Ventures to Fight the New Wave of AI Spear Phishing | Morningstar](<https://www.morningstar.com/news/pr-newswire/20260723sf10217/aegisai-raises-36-million-series-a-led-by-battery-ventures-to-fight-the-new-wave-of-ai-spear-phishing>) · `FISRC-9d9726b9fa2281de` · morningstar.com
- [AegisAI AI Email Security | Stop Phishing & BEC in 5 Minutes](<https://www.aegisai.ai/product>) · `FISRC-4a3549c46ee12829` · aegisai.ai
- [AI Red Team Agent | Automated Spear-Phishing Tests | AegisAI](<https://www.aegisai.ai/ai-red-teaming>) · `FISRC-e7715eaff612aa1c` · aegisai.ai

## 证据原文

### [AegisAI AI Email Security | Stop Phishing & BEC in 5 Minutes](<https://www.aegisai.ai/product>)

> 5min Integration Time via API

> AegisAI cuts through the noise with automated triaging that reduces false positives by up to 90% while blocking 22% more attacks.

> blocking 22% more attacks

> Our dashboard shows everything from fuzzing attempts to AI-generated spear phishing and BEC, and Aegis catches them all—without my team wasting time managing rules.

> reduces false positives by up to 90%

> What impressed us about Aegis AI is that their agents actually adapt in real time—no rule-writing, no tuning, no chasing false positives. We deployed in minutes and saw threats we'd been missing effortlessly with the agent's reasoning for each email, no black box.

### [AegisAI funding reaches $49 million after $36 million Series A | Venture Post](<https://venturepost.co/enterprise/aegisai-funding>)

> Accel Partners and Foundation Capital, both existing investors, also participating

> AegisAI funding has reached $49 million after the San Francisco email security startup said it raised a $36 million Series A

> Battery Ventures led the round

### [由前谷歌安全高管创立的AegisAI获3600万美元融资，用于阻止AI驱动的鱼叉式网络钓鱼](<https://techcrunch.com/2026/07/23/aegisai-founded-by-former-google-security-execs-lands-36m-to-stop-ai-driven-spear-phishing/>)

> a $36 million Series A led by Battery Ventures

> AegisAI, a startup that uses AI agents to stomp out these threats, known as spear phishing

> AI startup LangChain

> crypto payments company Mesh

> former Google security executives Cy Khormaee and Ryan Luo, who previously worked on developing safe browsing technology and reCAPTCHA, teamed up to launch AegisAI

> Lightspeed-backed Ocean is also trying to displace established vendors like Proofpoint and Mimecast, along with newer players like Abnormal Security.

> Lightspeed-backed Ocean is also trying to displace established vendors like Proofpoint and Mimecast, along with newer players like Abnormal Security. However, given that AegisAI is led by experts who helped secure Gmail, the most popular email system in the world, Thakker believes the startup has the best shot at becoming the leading new hack-prevention company.

> newer players like Abnormal Security. However, given that AegisAI is led by experts who helped secure Gmail, the most popular email system in the world, Thakker believes the startup has the best shot at becoming the leading new hack-prevention company.

> privacy compliance platform Lokker

> The core idea of building customized, highly advanced agents that can do investigations is going to [determine] who becomes the next dominant security company

> When Dharmesh Thakker, general partner at Battery Ventures, noticed an increase in email attacks, he set out to invest in a startup that could defend against AI with AI, one aiming to replace legacy email security tools with agentic-driven defense.

> with participation from existing backers Accel and Foundation Capital

### [AegisAI Raises $36 Million Series A Led by Battery Ventures to Fight the New Wave of AI Spear Phishing | Morningstar](<https://www.morningstar.com/news/pr-newswire/20260723sf10217/aegisai-raises-36-million-series-a-led-by-battery-ventures-to-fight-the-new-wave-of-ai-spear-phishing>)

> 72.6% of successful AI attacks passed email authentication, sent from compromised legitimate accounts with established sending histories.

> AegisAI deploys autonomous AI agents inside the inbox that interrogate the intent and identity behind every message, catching linguistically perfect attacks that pass every technical check

> AegisAI was founded in 2025 by Khormaee and Ryan Luo, veterans of Google's core security group who helped build reCAPTCHA, Safe Browsing and Web Risk

> AegisAI, the email security company building its own LLMs to defend the inbox, is headquartered in San Francisco.

> AI-generated emails evade traditional filters at nearly double the rate of human-written attacks, reaching the inbox more than half the time.

> AI-generated spear phishing grew from 2.8% to 13.9% of all observed phishing in 2025.

> Business email compromise, payload-less attacks that exploit identity rather than software, accounted for $11.64 billion in losses

> co-founder and CEO of AegisAI

> Cy and Ryan spent a decade building exactly these systems at Google scale. They're the team we'd back to win this market.

> FBI-reported cybercrime losses hitting a record $20.8 billion

> With Vanguard, announced in March, those agents now extend beyond the inbox. When a message is flagged, Vanguard follows suspicious links and attachments across the open web just as a user would – defeating adversarial CAPTCHAs, cloaked pages and weaponized documents – and returns a complete threat report in minutes.

> You cannot patch human trust. If your security program still relies on template-based phishing tests and awareness training, you are training your people to spot last year's threat, not a capable agent crafting a novel lure just for them. When the attack is AI, the defense has to be AI.

### [AI Red Team Agent | Automated Spear-Phishing Tests | AegisAI](<https://www.aegisai.ai/ai-red-teaming>)

> An AI agent built the way attackers build them: autonomous OSINT, target-specific lures, real delivery, measured engagement. Probed your defenses, scoped and approved with your security team, so you see who clicks before a real attacker does.

> The agent runs attacker-grade tradecraft against your own org, with your security team setting the scope and seeing every step.

## 关联入口

- [公司档案](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=index&detail=entity&id=EN-57b8b5990c299db8>)
- [融资事件](<https://jerryfang2023-stack.github.io/AI-Radar/data-center.html?view=events&detail=event&id=EV-9b81b0dd09a046ab>)
- [相关方向](<https://jerryfang2023-stack.github.io/AI-Radar/opportunity-map.html#direction-cards>)
- [融资透视页面](<https://jerryfang2023-stack.github.io/AI-Radar/funding-insights.html>)
