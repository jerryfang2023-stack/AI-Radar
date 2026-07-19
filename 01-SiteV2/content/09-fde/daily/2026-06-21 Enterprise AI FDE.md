---
type: enterprise_ai_fde_daily
date: 2026-06-21
fde_version: FDE-V2.0
status: current
source: "01-SiteV2/content/11-databases/data-center-v4/2026-06-21/fde-records.json"
item_count: 3
---

# 2026-06-21 Enterprise AI / FDE

> 本页直接投影自 Data Center V4 的 FDERecord。它是企业实施事实视图，不是第四类 Signal Card。

- [当日 V4 CanonicalEvent](../../11-databases/data-center-v4/2026-06-21/canonical-events.json)

## 1. Engineers: How the $3B Legal AI Leader Deploys Inside BigLaw | Blog | Perspective AI

- fde_id: `FDE-9062c04ae2a9151f`
- event_id: `EV-ca0c54e3f9776fa5`
- event_time: 未披露
- stage: completed
- customer: OpenAI
- vendor: Harvey AI
- industry: Legal
- use_case: Engineers: How the $3B Legal AI Leader Deploys Inside BigLaw | Blog | Perspective AI
- reported_need: BigLaw firms cannot be sold the same SaaS product because precedent libraries, mark-up conventions, and partner sign-off chains are unrecognizably different across firms
- delivery_components: Harvey AI — the $3B legal-AI company backed by OpenAI, Sequoia, Kleiner Perkins, and GV — runs one of the most specialized forward deployed engineering functions in the AI industry, with FDEs embedded inside Allen & Overy (now A&O Shearman), PwC, Cleary Gottlieb, Macfarlanes, and dozens of other AmLaw 100 and Magic Circle firms. Harvey's forward deployed engineers do not write generic chatbot integrations. They sit inside law firm matter rooms, map partner-by-partner workflow tribalism, and rebuild firm-specific knowledge bases on top of foundation models so that the LLM speaks in the firm's house style, cites the firm's precedent vault, and respects the firm's confidentiality walls. According to Harvey's own published deployment cadence, a full firm rollout takes 6–9 months and touches three distinct populations — partners, associates, and knowledge management lawyers — each with incompatible adoption triggers. Harvey's model has become the de-facto template for any AI vendor selling into BigLaw, and it has implications well beyond law: any vertical AI company selling to regulated, partner-led, knowledge-dense buyers is now copying the Harvey playbook. The hardest part of the deployment is not the model. It is the customer-research loop — and partners, the people who sign the contract, are systematically the wrong people to interview about the workflow being automated.；What does a Harvey AI forward deployed engineer do?；A Harvey AI forward deployed engineer embeds full-time inside a single BigLaw client for 6–9 months to translate the firm's most valuable, most idiosyncratic legal workflows — M&A diligence, securities filings, regulatory memos, litigation document review — into firm-specific LLM applications running on top of Harvey's foundation-model layer. The role blends three jobs that are usually separate at a normal enterprise software vendor: customer-discovery researcher, applied ML engineer, and onboarding lead. Harvey FDEs spend roughly a third of their time on conversation — with partners, associates, knowledge-management lawyers, and IT — a third on data engineering against the firm's document management system (typically iManage or NetDocuments), and a third on retrieval, evaluation, and fine-tuning work to make Harvey speak in the firm's voice.；The function exists because BigLaw firms cannot be sold the same SaaS product. A magic-circle firm's M&A practice and a New York white-shoe firm's M&A practice both look like "M&A" to outsiders, but the precedent libraries, mark-up conventions, and partner sign-off chains are unrecognizably different. A forward deployed engineer is the only economic way to bridge that gap.
- reported_outcomes: Full firm rollout takes 6–9 months；Deployment touches partners, associates, and knowledge management lawyers；Model has become the de-facto template for any AI vendor selling into BigLaw
- metrics: $3B
- undisclosed_fields: systems_integrated；data_requirements；governance_controls
- source: [keyword search / Anysearch](https://getperspective.ai/blog/harvey-ai-forward-deployed-engineers-biglaw-deployment-playbook-2026)

## 2. Anthropic 应用 AI 工程师：Claude 企业战略背后的前沿部署职能

- fde_id: `FDE-0ee0fe3baa3f1364`
- event_id: `EV-d1e2a7c6d314612c`
- event_time: 未披露
- stage: completed
- customer: Anthropic
- vendor: 未披露
- industry: 未披露
- use_case: Function Behind Claude's Enterprise Strategy | Blog | Perspective AI
- reported_need: 未披露
- delivery_components: Anthropic calls its forward-deployed engineering function "Applied AI Engineer" — same job as a Palantir or OpenAI FDE, different label that reflects Anthropic's safety-first, research-led culture. The role sits at the center of Anthropic's enterprise push for Claude, and a reported $1.5 billion joint venture announced in 2025 underwrites the customer-deployment muscle that Applied AI Engineers bring into regulated industries: financial services, healthcare, legal, and government. Day-to-day, an Applied AI Engineer embeds with customers for multi-week sprints, designs prompts and evals, ships agents into production, and runs the customer-discovery interviews that surface what enterprise buyers actually need. Total compensation lands in a $350K–$550K band — competitive with research engineering, deliberately so. The hiring bar reads like a hybrid: senior software engineer plus product manager plus AI safety researcher. Other AI labs are copying the playbook, but Anthropic's distinctive twist is treating customer interviews as a research input on par with internal evals — a posture that pairs naturally with conversational research tools like Perspective AI.；Applied AI Engineer vs Forward Deployed Engineer: Same Role, Different Label #；Applied AI Engineer and Forward Deployed Engineer (FDE) describe the same function — a customer-embedded technical role that ships AI applications inside enterprise accounts — but Anthropic chose a different label that reflects its research-led culture. Palantir popularized the FDE title in the 2010s, OpenAI adopted it, and the rest of the AI vendor market is following. The broader picture sits in the rise of the forward-deployed engineer in 2026 .；Anthropic's choice is more than branding. The company is deliberate about not positioning customer-facing engineers as "field" or "deployed" — phrases that imply distance from R&D. Calling them Applied frames the role as the production end of a single research-to-deployment continuum, downstream of the company's Responsible Scaling Policy framing that treats deployment as a first-class research question.
- reported_outcomes: 未披露
- metrics: $1.5 billion；$350；$550
- undisclosed_fields: vendor；industry；workflow_before；workflow_after；delivery_model；team_composition；reported_need；data_requirements；governance_controls；reported_outcomes
- source: [keyword search / Anysearch](https://getperspective.ai/blog/anthropic-applied-ai-engineers-forward-deployed-claude-enterprise)

## 3. Pernod Ricard 如何将企业 AI 部署到 28 个国家

- fde_id: `FDE-a68ccf61a21e22ce`
- event_id: `EV-4c0af31f1399ea8c`
- event_time: 未披露
- stage: completed
- customer: 未披露
- vendor: 未披露
- industry: Alcohol
- use_case: Enterprise AI to 28 Countries
- reported_need: 未披露
- delivery_components: Pierre-Yves Calloc’h spent 20 years at Pernod Ricard—the company behind some of the world’s biggest alcohol brands—first as managing director, then CIO, and CDO. When he turned his attention to the company’s first AI projects, he treated governance as a design constraint from day one: something to be solved for rather than negotiated around after the fact. The D-Star program he led was deployed to the sales force in 28 countries, with 85% adoption and $15M in annual ROI in the US alone.；That kind of responsiveness would be impossible on a standard enterprise release cycle, where UI changes might ship every six months. Retool’s cadence of building and deploying changes in hours rather than quarters meant the team could adapt country by country. When the US needed enough customization to justify a fork, the $15M annual return made the call easy, and the one-to-two-million merge cost was a manageable follow-up.
- reported_outcomes: 85% adoption；$15M annual ROI in the US；Control group demanded access via union after three weeks
- metrics: 85%；$15M；$15M
- undisclosed_fields: customer；vendor；workflow_before；workflow_after；team_composition；reported_need；systems_integrated；data_requirements；governance_controls
- source: [keyword search / Anysearch](https://retool.com/blog/pernod-ricard-enterprise-ai-deployment)
