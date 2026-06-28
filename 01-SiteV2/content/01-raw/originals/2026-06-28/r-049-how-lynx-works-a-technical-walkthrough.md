---
schema_version: raw-evidence-v2
raw_id: R-049
title: "How Lynx Works: A Technical Walkthrough"
original_url: "https://www.tigera.io/blog/how-lynx-works-a-technical-walkthrough/"
canonical_url: "https://tigera.io/blog/how-lynx-works-a-technical-walkthrough"
source_name: "Tigera Blog (Calico / AI Security)"
source_type: analysis
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: rss-feed
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: ""
collected_at: 2026-06-28T04:05:28.165Z
language: mixed
full_text_hash: c80207038c987242
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-28/r-049-how-lynx-works-a-technical-walkthrough.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-28/r-049-how-lynx-works-a-technical-walkthrough.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":14136,"paragraph_count":60,"sentence_count":99,"boilerplate_hits":0,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 14136
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"c80207038c987242","missing":[]}
source_volatility: low
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: ""
discovery_record: null
source_role: resolved_original_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: f9c1c6f3b20ecce0
content_hash: c80207038c987242
semantic_hash: 0de88da9d408d8c8
duplicate_of: ""
first_seen_at: "2026-06-28T04:05:28.165Z"
last_seen_at: 2026-06-28T04:05:28.165Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"vertical industry solution; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":4,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Tigera Blog (Calico","AI Security)","Cursor"],"products":["agents","agent","MCP","Agent","Agents","Claude","Cursor"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["合同审阅 / 法律研究","权限 / 安全治理"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全"],"numbers":["8217","2","8693"],"quotes":["any issuer","unbypassably","what the agent did","what the platform allowed","register this agent,"]}
evidence_seed: {"company_actions":["We launched Lynx this week. Instead of restating the pitch, I want to explain how it&#8217;s built and why we made the architectural choices we did. If you run Kubernetes and you&#8217;re starting to put... The post How Lynx Works: A Technical Walkthrough appeared first on Tigera – Creator of Calico. ]]>","We launched Lynx this week.","Instead of restating the pitch, I want to explain how it’s built and why we made the architectural choices we did."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"product_update","text":"We launched Lynx this week. Instead of restating the pitch, I want to explain how it&#8217;s built and why we made the architectural choices we did. If you run Kubernetes and you&#8217;re starting to put... The post How Lynx Works: A Technical Walkthrough appeared first on Tigera – Creator of Calico. ]]>","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"We launched Lynx this week.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Instead of restating the pitch, I want to explain how it’s built and why we made the architectural choices we did.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"If you run Kubernetes and you’re starting to put AI agents on it, this is roughly the system you’d end up designing yourself.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Lynx is a control and data plane for all agentic AI traffic, providing a registry, gateway, audit, authentication with token exchange, policy enforcement, agent sandboxing, shadow agent discovery, and advanced AI capabilities such as red team agent and a guardian supervising agent to keep your agents on track.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Lynx is single control point in the path of every agent call – agent-to-agent, agent-to-MCP, agent-to-LLM.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"}]
theme: early-direction-signal
keyword_group: early-direction-signal
copyright_note: local research archive only
---

# How Lynx Works: A Technical Walkthrough

## clean_text

We launched Lynx this week. Instead of restating the pitch, I want to explain how it’s built and why we made the architectural choices we did. If you run Kubernetes and you’re starting to put AI agents on it, this is roughly the system you’d end up designing yourself.
Lynx is a control and data plane for all agentic AI traffic, providing a registry, gateway, audit, authentication with token exchange, policy enforcement, agent sandboxing, shadow agent discovery, and advanced AI capabilities such as red team agent and a guardian supervising agent to keep your agents on track. Lynx is single control point in the path of every agent call – agent-to-agent, agent-to-MCP, agent-to-LLM. Every call is authenticated, authorized against policy, and recorded, with no changes to agent code.
The constraints we started from
Four principles shaped the design:
No agent code changes. Governance has to be applied by the platform, not adopted as a library. If it requires a code change, it won’t land uniformly – and uniformity is the entire point.
No new database in the control plane. The source of truth is the Kubernetes API server and the data model is custom resources – there’s no separate datastore to run, back up, and secure. (Telemetry is the one thing that needs a column store at scale; that’s kept separate and is bring-your-own.)
Don’t reinvent the data plane. Proxying agentic protocols – MCP, A2A, streaming LLM traffic – well is a full-time job. We wanted to own the policy , not the proxy.
Catch what doesn’t opt in. A governance layer that only sees traffic routed through it is blind exactly where the risk is. We needed an out-of-band way to find the agents nobody registered.
The data model
Lynx is Kubernetes-native to the core: its entire vocabulary is a small set of custom resources – Agent , MCPServer , LLMProvider , ServiceIdentity , and Policy – stored in the Kubernetes API itself. There’s no Lynx database; every record is something you can manage, GitOps, and RBAC like anything else in your cluster. The registry is a thin API in front of these resources. It records agents; it doesn’t run them.
Two ideas matter throughout. First, workload identity is the join key that ties a running pod to its registry record. Second, an agent becomes governed by two independent acts – it runs with an identity, and someone registers it – which means registration can happen in CI/CD at deploy time while the workload itself stays unaware of Lynx.
Identity: reuse what you already trust
A workload proves who it is with one of two mechanisms – it’s one or the other, and which one is recorded in the workload’s registration:
SPIFFE/SPIRE for mTLS workload identity, where private keys never leave the pod.
OIDC for tokens from your existing IdP (Entra ID, Okta, Keycloak). The binding is the issuer/subject pair you record at registration time. Because the in-cluster Kubernetes API server is itself an OIDC issuer, this path also covers plain Kubernetes ServiceAccount tokens – a pod’s projected token simply is its identity, with nothing to mount beyond what Kubernetes already gives every pod.
You can register more than one identity on an agent – which turns an IdP migration into a config change rather than a cutover – but any single call authenticates by exactly one. Human access to the dashboard uses the same IdP over OIDC, kept distinct so a person’s token is never mistaken for an agent’s. And not every caller is an agent: a ServiceIdentity lets a plain service or human-operated client be governed by the same machinery.
The validation pipeline behind all of this is deliberately strict and shared by every component: issuers are matched against a per-service allow-list (there is no “any issuer” mode), tokens are signature-verified and bound to an audience, and keys rotate automatically. The result is that agents reuse identity you already trust, rather than living in a parallel, ungoverned credential system.
One gateway for A2A, MCP, and LLM
The framing that matters most: Lynx is a single consolidated gateway for all three classes of agentic traffic . Today these tend to be governed by three different things – a service mesh for agent-to-agent, a bespoke proxy or SDK wrapper for MCP, an egress gateway or nothing at all for LLM calls. That fragmentation is how you end up with three identity models, three policy languages, and three audit trails nobody can correlate.
Lynx collapses them into one control point with one identity model, one policy language, and one audit trail. Agents, MCP servers, and LLM providers are all first-class objects with their own governed routes, and every call – whatever its kind – is authenticated, authorized, and recorded the same way.
The LLM path has a property teams feel immediately: the gateway holds the provider credential, the agent never does . Upstream API keys live in one governed place, rotate centrally, and never sit in agent pods – and when a provider needs no upstream auth, the gateway strips the caller’s credential so a Lynx-issued token can’t leak to a third party.
The data plane: drive the proxy, don’t fork it
The proxy in the request path is agentgateway , the open-source Rust proxy purpose-built for LLM/MCP/A2A traffic. We run it unmodified and drive it the way Envoy is driven – over xDS. Our control plane watches the custom resources and compiles them into the proxy’s native configuration; the proxy itself never sees a Lynx resource, has no Kubernetes access, and holds no cluster privileges.
That decoupling is deliberate, and it buys four things:
Blast radius – a malformed registration drops one route; it can’t corrupt the proxy.
Least privilege – the component on the wire has no API-server reach.
Schema freedom – we evolve our data model without touching the proxy.
Hot reconfiguration – register an agent and its route is programmed live, no restart.
The customer who already likes agentgateway gets it as-is, with Lynx’s governance layered on through the same open extension points they already trust – no proprietary lock-in at the data path.
The decision point: policy in the path, credentials minted per hop
Before the proxy forwards a request, it calls back into Lynx’s decision point, which runs the same sequence every time: authenticate the caller, validate the destination’s requirements, and evaluate policy in Cedar – a formally-grounded language, default-deny, with LLM, MCP, and agent access all expressed in one model. Only on an allow does the request proceed.
The property I care most about is what happens on allow: t he gateway mints a fresh, short-lived credential scoped to that one hop . When Agent A calls Agent B, A never holds a credential for B – it proves only its own identity, and the gateway issues a token good for exactly that destination, for a couple of minutes. A leaked token is useless beyond a single hop: no shared secrets, no standing keys, no blast radius.
For multi-step chains – A calls B, which calls a tool – this extends into proper on-behalf-of delegation built on RFC 8693 token exchange . An agent presents the token it already has and asks for a destination; Lynx validates it, checks policy at the moment of issuance (so an unauthorized hop never even produces a credential), and mints a destination-scoped token carrying the original subject. The payoff is threefold: agents stay IdP-agnostic (one endpoint, one credential), delegation is genuine and auditable end-to-end rather than just the last leg, and least privilege is enforced by construction. To the rest of your estate, Lynx looks like an ordinary OAuth2 provider – standards in, standards out.
Catching what routes around the gateway
A gateway only governs traffic that flows through it – and the agents that don’t route through it are exactly the ones worth finding. So Lynx watches at a layer the workload can’t bypass or tamper with: the kernel, via eBPF, deployed as a per-node agent that needs no instrumentation of the workloads it observes.
The first signal is LLM egress. Any workload calling a provider does a TLS handshake; Lynx observes that in the kernel, attributes it to a pod, and checks whether that pod is a registered agent – classifying each as registered, a shadow agent , or unattributable. This is the backstop for the LLM path specifically: even an agent that calls a provider directly, bypassing the gateway entirely, still does a handshake the kernel sees. The gateway governs what routes through it; this finds what goes around it.
Agent sandboxing
The same vantage point is also an enforcement point. Lynx can run each agent inside a tailored kernel-level sandbox – a per-workload syscall policy that constrains which operations the pod may perform – rather than letting it act with the full ambient authority of its pod. Notably, those policies are written in the same Cedar language as request authorization and compiled down to run in the kernel, so one policy model drives both the request path and the sandbox. Because enforcement lives in the kernel, a flagged or shadow agent is contained immediately and “unbypassably”, rather than merely alerted on.
This is also where the platform is heading next: a per-agent behavioral baseline over kernel-level activity, with anomaly detection for the cases a request-time policy can’t catch – credential theft, lateral movement, an agent doing something it never has – and agent-specific threats such as memory and context poisoning. Policy governs intent; this layer is about what actually happens.
Tracing, audit, and compliance
Everything emits OpenTelemetry, and the design choice that pays off here is that the gateway’s authorization decisions and the agents’ own reasoning – their LLM and tool calls – land in the same distributed trace . You don’t get one system for “what the agent did” and a separate one for “what the platform allowed”; you get a single, correlated timeline of each interaction.
That timeline is what turns governance into an audit story. Every call carries who the caller was, on whose behalf it acted, which policy permitted it, and what the decision was – and because each hop is independently authorized and freshly credentialed, the chain is attributable end-to-end , not just at the edge. Alongside the request traces, every change to the system itself – a registration, a policy edit – is recorded as an audit event capturing the actor, the operation, and the exact before-and-after. Together these are the reproducible, cryptographically attributable record that incident response and auditors ask for, and that frameworks such as SOC 2, HIPAA, GDPR, and financial-services regimes require you to produce on demand – without a separate logging project bolted on after the fact.
Traces and audit records flow into ClickHouse (bring-your-own), which powers the dashboard’s inventory, policy editor, audit search, agent-to-agent traffic graph, and shadow-agent views.
Driving Lynx: dashboard, CLI, and MCP
Everything in Lynx is an API over Kubernetes resources, so there are three ways to operate it – all thin clients over the same control plane:
The dashboard . A web UI for the people who live in this day to day – agent and MCP inventory, a Cedar policy editor, the agent-to-agent traffic graph, audit search, and trace exploration. It’s a Next.js and React app that renders agent execution traces with agent-prism , so a multi-hop, multi-agent interaction reads as a single timeline.
lyctl. A single Go CLI for everything scriptable – registering agents and MCP servers, authoring and testing policies, and standing up a complete demo environment in one command. It’s the natural fit for CI/CD, where registration belongs.
MCP . Lynx ships its own Model Context Protocol server that exposes the governance operations – list and register agents, write policies, inspect audit traces – as MCP tools. So you can drive Lynx straight from an AI assistant like Claude or Cursor : “register this agent,” “which agents can reach the payments MCP server?”, “what changed in policy yesterday?” The platform that governs agents is itself operable by one.
Built on open standards
We deliberately built Lynx on proven, open technology rather than inventing a parallel stack – it’s why it drops into an existing cluster and speaks the protocols your tooling already speaks:
Kubernetes-native – the entire data model is custom resources in the Kubernetes API; it installs as a single Helm chart and runs no database of its own.
Identity – SPIFFE/SPIRE for workload mTLS, and OIDC/OAuth2 with your existing IdP (including Kubernetes ServiceAccount tokens). Per-hop delegation uses RFC 8693 token exchange, and tokens are verified through standard JWKS.
Policy – authorization is expressed in Cedar , a formally-grounded, open policy language – the same language whether it’s evaluated in the request path or compiled into the kernel.
Data plane – the open-source agentgateway proxy, driven dynamically over xDS and integrated through the standard ext-authz contract, with native fluency in MCP and A2A.
Visibility and enforcement – eBPF for kernel-level discovery and sandboxing, with no instrumentation of the workloads themselves.
Observability – OpenTelemetry end to end, stored in ClickHouse.
The throughline: Lynx contributes the governance layer – identity binding, Cedar policy, per-hop credentials, the agent registry – and bridges to everything else through open, standard contracts. No proprietary lock-in at the parts that matter most.
How it installs
Lynx is a single Helm chart on any conformant Kubernetes cluster. The minimal install is the registry and the gateway; the data plane, the policy decision point, the kernel-level detector, the telemetry pipeline, and the UI are each switched on as you need them. The most revealing first step is to turn on discovery and watch what’s already talking to LLM providers across your fleet – for most teams, that first scan surfaces agents nobody knew were running.
Explore our product page to see Lynx in action .
AI Agent Security Products
Join our mailing list
Get updates on blog posts, workshops, certification programs, new releases, and more!

## full_text

We launched Lynx this week. Instead of restating the pitch, I want to explain how it’s built and why we made the architectural choices we did. If you run Kubernetes and you’re starting to put AI agents on it, this is roughly the system you’d end up designing yourself.
Lynx is a control and data plane for all agentic AI traffic, providing a registry, gateway, audit, authentication with token exchange, policy enforcement, agent sandboxing, shadow agent discovery, and advanced AI capabilities such as red team agent and a guardian supervising agent to keep your agents on track. Lynx is single control point in the path of every agent call – agent-to-agent, agent-to-MCP, agent-to-LLM. Every call is authenticated, authorized against policy, and recorded, with no changes to agent code.
The constraints we started from
Four principles shaped the design:
No agent code changes. Governance has to be applied by the platform, not adopted as a library. If it requires a code change, it won’t land uniformly – and uniformity is the entire point.
No new database in the control plane. The source of truth is the Kubernetes API server and the data model is custom resources – there’s no separate datastore to run, back up, and secure. (Telemetry is the one thing that needs a column store at scale; that’s kept separate and is bring-your-own.)
Don’t reinvent the data plane. Proxying agentic protocols – MCP, A2A, streaming LLM traffic – well is a full-time job. We wanted to own the policy , not the proxy.
Catch what doesn’t opt in. A governance layer that only sees traffic routed through it is blind exactly where the risk is. We needed an out-of-band way to find the agents nobody registered.
The data model
Lynx is Kubernetes-native to the core: its entire vocabulary is a small set of custom resources – Agent , MCPServer , LLMProvider , ServiceIdentity , and Policy – stored in the Kubernetes API itself. There’s no Lynx database; every record is something you can manage, GitOps, and RBAC like anything else in your cluster. The registry is a thin API in front of these resources. It records agents; it doesn’t run them.
Two ideas matter throughout. First, workload identity is the join key that ties a running pod to its registry record. Second, an agent becomes governed by two independent acts – it runs with an identity, and someone registers it – which means registration can happen in CI/CD at deploy time while the workload itself stays unaware of Lynx.
Identity: reuse what you already trust
A workload proves who it is with one of two mechanisms – it’s one or the other, and which one is recorded in the workload’s registration:
SPIFFE/SPIRE for mTLS workload identity, where private keys never leave the pod.
OIDC for tokens from your existing IdP (Entra ID, Okta, Keycloak). The binding is the issuer/subject pair you record at registration time. Because the in-cluster Kubernetes API server is itself an OIDC issuer, this path also covers plain Kubernetes ServiceAccount tokens – a pod’s projected token simply is its identity, with nothing to mount beyond what Kubernetes already gives every pod.
You can register more than one identity on an agent – which turns an IdP migration into a config change rather than a cutover – but any single call authenticates by exactly one. Human access to the dashboard uses the same IdP over OIDC, kept distinct so a person’s token is never mistaken for an agent’s. And not every caller is an agent: a ServiceIdentity lets a plain service or human-operated client be governed by the same machinery.
The validation pipeline behind all of this is deliberately strict and shared by every component: issuers are matched against a per-service allow-list (there is no “any issuer” mode), tokens are signature-verified and bound to an audience, and keys rotate automatically. The result is that agents reuse identity you already trust, rather than living in a parallel, ungoverned credential system.
One gateway for A2A, MCP, and LLM
The framing that matters most: Lynx is a single consolidated gateway for all three classes of agentic traffic . Today these tend to be governed by three different things – a service mesh for agent-to-agent, a bespoke proxy or SDK wrapper for MCP, an egress gateway or nothing at all for LLM calls. That fragmentation is how you end up with three identity models, three policy languages, and three audit trails nobody can correlate.
Lynx collapses them into one control point with one identity model, one policy language, and one audit trail. Agents, MCP servers, and LLM providers are all first-class objects with their own governed routes, and every call – whatever its kind – is authenticated, authorized, and recorded the same way.
The LLM path has a property teams feel immediately: the gateway holds the provider credential, the agent never does . Upstream API keys live in one governed place, rotate centrally, and never sit in agent pods – and when a provider needs no upstream auth, the gateway strips the caller’s credential so a Lynx-issued token can’t leak to a third party.
The data plane: drive the proxy, don’t fork it
The proxy in the request path is agentgateway , the open-source Rust proxy purpose-built for LLM/MCP/A2A traffic. We run it unmodified and drive it the way Envoy is driven – over xDS. Our control plane watches the custom resources and compiles them into the proxy’s native configuration; the proxy itself never sees a Lynx resource, has no Kubernetes access, and holds no cluster privileges.
That decoupling is deliberate, and it buys four things:
Blast radius – a malformed registration drops one route; it can’t corrupt the proxy.
Least privilege – the component on the wire has no API-server reach.
Schema freedom – we evolve our data model without touching the proxy.
Hot reconfiguration – register an agent and its route is programmed live, no restart.
The customer who already likes agentgateway gets it as-is, with Lynx’s governance layered on through the same open extension points they already trust – no proprietary lock-in at the data path.
The decision point: policy in the path, credentials minted per hop
Before the proxy forwards a request, it calls back into Lynx’s decision point, which runs the same sequence every time: authenticate the caller, validate the destination’s requirements, and evaluate policy in Cedar – a formally-grounded language, default-deny, with LLM, MCP, and agent access all expressed in one model. Only on an allow does the request proceed.
The property I care most about is what happens on allow: t he gateway mints a fresh, short-lived credential scoped to that one hop . When Agent A calls Agent B, A never holds a credential for B – it proves only its own identity, and the gateway issues a token good for exactly that destination, for a couple of minutes. A leaked token is useless beyond a single hop: no shared secrets, no standing keys, no blast radius.
For multi-step chains – A calls B, which calls a tool – this extends into proper on-behalf-of delegation built on RFC 8693 token exchange . An agent presents the token it already has and asks for a destination; Lynx validates it, checks policy at the moment of issuance (so an unauthorized hop never even produces a credential), and mints a destination-scoped token carrying the original subject. The payoff is threefold: agents stay IdP-agnostic (one endpoint, one credential), delegation is genuine and auditable end-to-end rather than just the last leg, and least privilege is enforced by construction. To the rest of your estate, Lynx looks like an ordinary OAuth2 provider – standards in, standards out.
Catching what routes around the gateway
A gateway only governs traffic that flows through it – and the agents that don’t route through it are exactly the ones worth finding. So Lynx watches at a layer the workload can’t bypass or tamper with: the kernel, via eBPF, deployed as a per-node agent that needs no instrumentation of the workloads it observes.
The first signal is LLM egress. Any workload calling a provider does a TLS handshake; Lynx observes that in the kernel, attributes it to a pod, and checks whether that pod is a registered agent – classifying each as registered, a shadow agent , or unattributable. This is the backstop for the LLM path specifically: even an agent that calls a provider directly, bypassing the gateway entirely, still does a handshake the kernel sees. The gateway governs what routes through it; this finds what goes around it.
Agent sandboxing
The same vantage point is also an enforcement point. Lynx can run each agent inside a tailored kernel-level sandbox – a per-workload syscall policy that constrains which operations the pod may perform – rather than letting it act with the full ambient authority of its pod. Notably, those policies are written in the same Cedar language as request authorization and compiled down to run in the kernel, so one policy model drives both the request path and the sandbox. Because enforcement lives in the kernel, a flagged or shadow agent is contained immediately and “unbypassably”, rather than merely alerted on.
This is also where the platform is heading next: a per-agent behavioral baseline over kernel-level activity, with anomaly detection for the cases a request-time policy can’t catch – credential theft, lateral movement, an agent doing something it never has – and agent-specific threats such as memory and context poisoning. Policy governs intent; this layer is about what actually happens.
Tracing, audit, and compliance
Everything emits OpenTelemetry, and the design choice that pays off here is that the gateway’s authorization decisions and the agents’ own reasoning – their LLM and tool calls – land in the same distributed trace . You don’t get one system for “what the agent did” and a separate one for “what the platform allowed”; you get a single, correlated timeline of each interaction.
That timeline is what turns governance into an audit story. Every call carries who the caller was, on whose behalf it acted, which policy permitted it, and what the decision was – and because each hop is independently authorized and freshly credentialed, the chain is attributable end-to-end , not just at the edge. Alongside the request traces, every change to the system itself – a registration, a policy edit – is recorded as an audit event capturing the actor, the operation, and the exact before-and-after. Together these are the reproducible, cryptographically attributable record that incident response and auditors ask for, and that frameworks such as SOC 2, HIPAA, GDPR, and financial-services regimes require you to produce on demand – without a separate logging project bolted on after the fact.
Traces and audit records flow into ClickHouse (bring-your-own), which powers the dashboard’s inventory, policy editor, audit search, agent-to-agent traffic graph, and shadow-agent views.
Driving Lynx: dashboard, CLI, and MCP
Everything in Lynx is an API over Kubernetes resources, so there are three ways to operate it – all thin clients over the same control plane:
The dashboard . A web UI for the people who live in this day to day – agent and MCP inventory, a Cedar policy editor, the agent-to-agent traffic graph, audit search, and trace exploration. It’s a Next.js and React app that renders agent execution traces with agent-prism , so a multi-hop, multi-agent interaction reads as a single timeline.
lyctl. A single Go CLI for everything scriptable – registering agents and MCP servers, authoring and testing policies, and standing up a complete demo environment in one command. It’s the natural fit for CI/CD, where registration belongs.
MCP . Lynx ships its own Model Context Protocol server that exposes the governance operations – list and register agents, write policies, inspect audit traces – as MCP tools. So you can drive Lynx straight from an AI assistant like Claude or Cursor : “register this agent,” “which agents can reach the payments MCP server?”, “what changed in policy yesterday?” The platform that governs agents is itself operable by one.
Built on open standards
We deliberately built Lynx on proven, open technology rather than inventing a parallel stack – it’s why it drops into an existing cluster and speaks the protocols your tooling already speaks:
Kubernetes-native – the entire data model is custom resources in the Kubernetes API; it installs as a single Helm chart and runs no database of its own.
Identity – SPIFFE/SPIRE for workload mTLS, and OIDC/OAuth2 with your existing IdP (including Kubernetes ServiceAccount tokens). Per-hop delegation uses RFC 8693 token exchange, and tokens are verified through standard JWKS.
Policy – authorization is expressed in Cedar , a formally-grounded, open policy language – the same language whether it’s evaluated in the request path or compiled into the kernel.
Data plane – the open-source agentgateway proxy, driven dynamically over xDS and integrated through the standard ext-authz contract, with native fluency in MCP and A2A.
Visibility and enforcement – eBPF for kernel-level discovery and sandboxing, with no instrumentation of the workloads themselves.
Observability – OpenTelemetry end to end, stored in ClickHouse.
The throughline: Lynx contributes the governance layer – identity binding, Cedar policy, per-hop credentials, the agent registry – and bridges to everything else through open, standard contracts. No proprietary lock-in at the parts that matter most.
How it installs
Lynx is a single Helm chart on any conformant Kubernetes cluster. The minimal install is the registry and the gateway; the data plane, the policy decision point, the kernel-level detector, the telemetry pipeline, and the UI are each switched on as you need them. The most revealing first step is to turn on discovery and watch what’s already talking to LLM providers across your fleet – for most teams, that first scan surfaces agents nobody knew were running.
Explore our product page to see Lynx in action .
AI Agent Security Products
Join our mailing list
Get updates on blog posts, workshops, certification programs, new releases, and more!

## extraction_diagnostics

- extraction_method: main
- readability_score: 97
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":14136,"paragraph_count":60,"sentence_count":99,"boilerplate_hits":0,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   We launched Lynx this week. Instead of restating the pitch, I want to explain how it&#8217;s built and why we made the architectural choices we did. If you run Kubernetes and you&#8217;re starting to put... The post How Lynx Works: A Technical Walkthrough appeared first on Tigera – Creator of Calico. ]]>

2. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   We launched Lynx this week.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Instead of restating the pitch, I want to explain how it’s built and why we made the architectural choices we did.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   If you run Kubernetes and you’re starting to put AI agents on it, this is roughly the system you’d end up designing yourself.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Lynx is a control and data plane for all agentic AI traffic, providing a registry, gateway, audit, authentication with token exchange, policy enforcement, agent sandboxing, shadow agent discovery, and advanced AI capabilities such as red team agent and a guardian supervising agent to keep your agents on track.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Lynx is single control point in the path of every agent call – agent-to-agent, agent-to-MCP, agent-to-LLM.

## business_elements

- companies: Tigera Blog (Calico, AI Security), Cursor
- products: agents, agent, MCP, Agent, Agents, Claude, Cursor
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 合同审阅 / 法律研究, 权限 / 安全治理
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全
- numbers: 8217, 2, 8693
- quotes: any issuer / unbypassably / what the agent did / what the platform allowed / register this agent,

## evidence_seed

- company_actions: We launched Lynx this week. Instead of restating the pitch, I want to explain how it&#8217;s built and why we made the architectural choices we did. If you run Kubernetes and you&#8217;re starting to put... The post How Lynx Works: A Technical Walkthrough appeared first on Tigera – Creator of Calico. ]]> / We launched Lynx this week. / Instead of restating the pitch, I want to explain how it’s built and why we made the architectural choices we did.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: vertical industry solution; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 4
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- core_pool

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: low
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: none
- source_role: resolved_original_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

We launched Lynx this week. Instead of restating the pitch, I want to explain how it&#8217;s built and why we made the architectural choices we did. If you run Kubernetes and you&#8217;re starting to put... The post How Lynx Works: A Technical Walkthrough appeared first on Tigera – Creator of Calico. ]]>

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
