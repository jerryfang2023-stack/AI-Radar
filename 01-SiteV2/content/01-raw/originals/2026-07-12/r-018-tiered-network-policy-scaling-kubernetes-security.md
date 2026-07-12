---
schema_version: raw-evidence-v2
raw_id: R-018
title: "Tiered Network Policy: Scaling Kubernetes Security"
title_zh: "分层网络策略：扩展Kubernetes安全性"
title_translation_status: translated
title_translation_method: mymemory_title_translation
original_url: "https://www.tigera.io/blog/tiered-network-policy-scaling-kubernetes-security/"
canonical_url: "https://tigera.io/blog/tiered-network-policy-scaling-kubernetes-security"
source_name: "Tigera Blog (Calico / AI Security)"
source_type: analysis
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: supporting_article
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: rss-feed
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-10T16:12:22.000Z"
collected_at: 2026-07-12T09:55:27.817Z
language: mixed
full_text_hash: a5e5d057a03328d1
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-018-tiered-network-policy-scaling-kubernetes-security.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-018-tiered-network-policy-scaling-kubernetes-security.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":10018,"paragraph_count":43,"sentence_count":62,"boilerplate_hits":0,"symbol_ratio":0.0006,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 10018
fetch_error: ""
evidence_strength: source_backed_event
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["insufficient_usable_evidence_object"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"a5e5d057a03328d1","missing":[]}
source_volatility: low
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: supporting_evidence
discovery_source: ""
discovery_record: null
source_role: resolved_original_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: cdb2c97a5294c7d9
content_hash: a5e5d057a03328d1
semantic_hash: 996c6be6a030eccd
duplicate_of: ""
first_seen_at: "2026-07-10T16:12:22.000Z"
last_seen_at: 2026-07-12T09:55:27.817Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"vertical industry solution; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Tigera Blog (Calico","AI Security)"],"products":[],"people":[],"industries":["开发者工具","企业服务"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["169.254","10","100","8","1","2","53","80"],"quotes":["Isolate the payments namespace from everything else","Allow-Only","Block traffic from Namespace X to Namespace Y, no matter what.","configuration drift","block this, period."]}
evidence_seed: {"company_actions":["As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis.","A small number of microservices suddenly demand hundreds of individual Kubernetes NetworkPolicy objects.","The solution lies in establishing a clear, multi-layered framework: a hierarchy of trust powered by tiered network policies."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":["As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis. A small number of microservices suddenly demand hundreds of individual Kubernetes... The post Tiered Network Policy: Scaling Kubernetes Security appeared first on Tigera – Creator of Calico. ]]>","Managing them becomes operationally expensive, auditing them is difficult, and a single developer misconfiguration can easily drop critical production traffic or open a massive security hole.","To scale cluster security without slowing down engineering velocity, we must abandon the flat, uncoordinated rule planes of the past."]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"supporting_context","text":"As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis. A small number of microservices suddenly demand hundreds of individual Kubernetes... The post Tiered Network Policy: Scaling Kubernetes Security appeared first on Tigera – Creator of Calico. ]]>","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"A small number of microservices suddenly demand hundreds of individual Kubernetes NetworkPolicy objects.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"supporting_context","text":"Managing them becomes operationally expensive, auditing them is difficult, and a single developer misconfiguration can easily drop critical production traffic or open a massive security hole.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"supporting_context","text":"To scale cluster security without slowing down engineering velocity, we must abandon the flat, uncoordinated rule planes of the past.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"The solution lies in establishing a clear, multi-layered framework: a hierarchy of trust powered by tiered network policies.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T09:55:27.817Z
theme: early-direction-signal
keyword_group: early-direction-signal
copyright_note: local research archive only
---

# Tiered Network Policy: Scaling Kubernetes Security

## clean_text

As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis. A small number of microservices suddenly demand hundreds of individual Kubernetes NetworkPolicy objects. Managing them becomes operationally expensive, auditing them is difficult, and a single developer misconfiguration can easily drop critical production traffic or open a massive security hole.
To scale cluster security without slowing down engineering velocity, we must abandon the flat, uncoordinated rule planes of the past. The solution lies in establishing a clear, multi-layered framework: a hierarchy of trust powered by tiered network policies.
The Core Problem with Standard Kubernetes NetworkPolicy
Standard Kubernetes NetworkPolicy resources are genuinely useful for basic application microsegmentation, but they have major architectural and organizational bottlenecks when scaled across an enterprise:
Namespace-Scoped by Design: Standard network policies are inherently scoped to a namespace. If your security team mandates a cluster-wide rule, such as blocking all internal pods from querying the cloud provider’s metadata API (169.254.169.254), you have to copy-paste that policy into every single namespace. If a developer creates a new namespace, that guardrail doesn’t exist until someone manually applies it.
Organizational Friction: Because anyone with namespace access can manipulate these policies, it creates a persona gap within organizations. Platform & Security teams need to enforce global, un-overrideable guardrails (e.g. “Isolate the payments namespace from everything else”). DevOps teams need the freedom to write granular, service-to-service rules for their applications without opening infrastructure support tickets.
No Rules Hierarchy: Kubernetes network policies are strictly additive. There are no weights, priorities, or order sequences. An application developer can accidentally (or intentionally) write a loose policy that bypasses the security team’s intended restrictions, undermining any baseline trust.
The “Allow-Only” Restriction: Standard policies cannot explicitly Deny traffic. They operate solely on an allow-list model. Isolation is implicit: if a pod is selected by a policy, any traffic not explicitly allow-listed is dropped. This makes it impossible to write a simple, top-level rule that says, “Block traffic from Namespace X to Namespace Y, no matter what.”
What a Scalable Solution Requires
To solve these scaling pain points, we have to move away from a flat network architecture and adopt a Tiered Policy Model. A scalable solution requires four core capabilities:
Global, Cluster-Wide Scope: To stop copy-pasting rules, administrators need a policy type that natively operates at the cluster level rather than the namespace level. This allows a single manifest to apply to all current and future namespaces automatically, eliminating the risk of “configuration drift” and ensuring day-one protection for new workloads.
Separation of Concerns (RBAC-Gated Tiers): Security, platform, and application teams need their own distinct logical “zones” or tiers to deploy rules. These tiers must be strictly gated by Role-Based Access Control (RBAC) so a developer modifying their application namespace cannot alter or override a higher-priority platform or security tier.
Deterministic, Top-Down Evaluation: The firewall engine must evaluate these tiers sequentially. Traffic must pass through the highest-priority tier (e.g., Security) before it ever reaches a lower tier (e.g., Application).
Explicit Deny and Pass Actions: Standard policies are allow-only, so they can never express a hard “block this, period.” A tiered model needs explicit actions: a Deny that states a prohibition outright, and a third option, Pass, that lets one tier defer the decision to the next rather than ending it (covered in detail below).
Why the Pass Action Matters
The key enabler of tiered policies is the Pass action. Think of Pass as a delegated hand-off. When a packet matches a rule with a Pass action in a high-priority tier, the engine skips the remaining lower-precedence rules in that tier and continues evaluation in the next tier down the hierarchy. This allows security administrators to say: “This traffic is safe by our standards, but we aren’t explicitly endorsing it. We are passing the final decision down to the platform or development teams to handle at their layer.” Without a Pass action, tiered policies become brittle, forcing admins to explicitly track and approve every single microservice connection at the highest level, which would defeat the purpose of developer agility.
The Kubernetes Native Answer: ClusterNetworkPolicy
Recognizing these scalability constraints, the SIG-Network Policy API group developed a native, multi-layered solution: ClusterNetworkPolicy. The API delivers exactly the four capabilities outlined above, with a few concrete specifics worth calling out:
A Native Three-Layer Hierarchy: It introduces distinct, sequentially evaluated resource tiers. ClusterNetworkPolicy (Admin tier) at the top for absolute guardrails, standard NetworkPolicy in the middle for developer agility, and ClusterNetworkPolicy (Baseline tier) at the bottom as a cluster-wide fallback safety net. Unlike namespace-jailed standard policies, the Admin and Baseline tiers apply across the entire cluster.
Separation of Concerns: Because ClusterNetworkPolicy is delivered as a new Custom Resource Definition (CRD) rather than a tweak to the existing NetworkPolicy type, standard Kubernetes RBAC governs who can interact with it. This ensures that only Security/Platform teams access ClusterNetworkPolicy resources, while DevOps teams work only with namespaced network policies.
Numeric Precedence: Policies feature explicit integer priorities. A policy with a lower integer value (e.g., 10) takes precedence over a policy with a higher value (e.g., 100), allowing for deterministic evaluation.
Explicit Actions: Rules are no longer purely additive. You can now design rules with explicit Accept, Deny, and Pass actions.
This API completely shifts how cluster administrators manage traffic by introducing a native, three-tiered evaluation hierarchy:
The Top Layer: ClusterNetworkPolicy (Admin tier): This is the high-priority tier controlled by cluster and security administrators. Rules here are evaluated first, and two of its three actions are terminal: an Accept or a Deny is a final verdict that bypasses the developer’s NetworkPolicy layer entirely. A Deny here cannot be overridden by any developer manifest, but the same is true of Accept: if an admin explicitly accepts traffic, it is permitted regardless of what a developer policy would have decided. This is the crucial difference from a standard NetworkPolicy allow, which is additive. An Admin-tier Accept is an override, not a contribution. Only the third action, Pass, is non-terminal: it declines to decide and hands evaluation down to the next tier.
As an example, the following ClusterNetworkPolicy can be used to allow DNS UDP traffic toward kube-dns from all namespaces:
apiVersion: policy.networking.k8s.io/v1alpha2
kind: ClusterNetworkPolicy
metadata:
name: allow-dns-to-kube-dns
spec:
tier: Admin
priority: 100
subject:
namespaces:
matchLabels: {}
egress:
- name: allow-dns
action: Accept
to:
- pods:
namespaceSelector:
matchLabels:
kubernetes.io/metadata.name: kube-system
podSelector:
matchLabels:
k8s-app: kube-dns
protocols:
- udp:
destinationPort:
number: 53
The Middle Layer: Standard NetworkPolicy: This is the traditional application-developer tier. It only kicks in if traffic wasn’t explicitly allowed or denied by the ClusterNetworkPolicy in the Admin tier above it. This keeps developers agile, letting them connect their microservices without needing admin intervention. One subtlety to keep in mind: standard NetworkPolicy carries an implicit deny for any pod it selects. So traffic only falls through to the Baseline tier when no NetworkPolicy selects the workload at all. A pod that is selected but matches none of its Accept rules is already dropped here, and never reaches the Baseline tier below. The following network policy can be used to permit ingress HTTP traffic for the awesome-app namespace.
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
name: allow-http-ingress
namespace: awesome-app
spec:
podSelector:
matchLabels:
app: http-server
policyTypes:
- Ingress
ingress:
- ports:
- protocol: TCP
port: 80
The Bottom Layer: ClusterNetworkPolicy (Baseline tier): This is the cluster-scoped Baseline tier, meant for default fallbacks. It acts as the safety net after developer policies are checked. For example, if a developer forgets to secure their pod, this policy can enforce a default cluster-wide posture like “if no developer policy matches this traffic, deny all intra-cluster traffic by default.”. The following ClusterNetworkPolicy would satisfy this requirement:
apiVersion: policy.networking.k8s.io/v1alpha2
kind: ClusterNetworkPolicy
metadata:
name: deny-all
spec:
tier: Baseline
priority: 1
subject:
namespaces:
matchLabels: {}
ingress:
- name: deny-all-ingress
action: Deny
from:
- namespaces:
matchLabels: {}
Combined, these features provide a native, multi-level strategy for scaling enterprise cluster security far beyond the limitations of a flat configuration.
Extending the Model: Calico Tiers
While the native Kubernetes APIs introduce a better three-layer model, and some control over rule priority, enterprise environments often require finer granularity. Calico expands on this concept by offering unlimited policy tiers, allowing you to design an arbitrary number of custom evaluation layers. Calico tiers will be discussed in the next post.
Get started with an interactive demo: DNS Policy with Calico
Best Practices
Join our mailing list
Get updates on blog posts, workshops, certification programs, new releases, and more!

## full_text

As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis. A small number of microservices suddenly demand hundreds of individual Kubernetes NetworkPolicy objects. Managing them becomes operationally expensive, auditing them is difficult, and a single developer misconfiguration can easily drop critical production traffic or open a massive security hole.
To scale cluster security without slowing down engineering velocity, we must abandon the flat, uncoordinated rule planes of the past. The solution lies in establishing a clear, multi-layered framework: a hierarchy of trust powered by tiered network policies.
The Core Problem with Standard Kubernetes NetworkPolicy
Standard Kubernetes NetworkPolicy resources are genuinely useful for basic application microsegmentation, but they have major architectural and organizational bottlenecks when scaled across an enterprise:
Namespace-Scoped by Design: Standard network policies are inherently scoped to a namespace. If your security team mandates a cluster-wide rule, such as blocking all internal pods from querying the cloud provider’s metadata API (169.254.169.254), you have to copy-paste that policy into every single namespace. If a developer creates a new namespace, that guardrail doesn’t exist until someone manually applies it.
Organizational Friction: Because anyone with namespace access can manipulate these policies, it creates a persona gap within organizations. Platform & Security teams need to enforce global, un-overrideable guardrails (e.g. “Isolate the payments namespace from everything else”). DevOps teams need the freedom to write granular, service-to-service rules for their applications without opening infrastructure support tickets.
No Rules Hierarchy: Kubernetes network policies are strictly additive. There are no weights, priorities, or order sequences. An application developer can accidentally (or intentionally) write a loose policy that bypasses the security team’s intended restrictions, undermining any baseline trust.
The “Allow-Only” Restriction: Standard policies cannot explicitly Deny traffic. They operate solely on an allow-list model. Isolation is implicit: if a pod is selected by a policy, any traffic not explicitly allow-listed is dropped. This makes it impossible to write a simple, top-level rule that says, “Block traffic from Namespace X to Namespace Y, no matter what.”
What a Scalable Solution Requires
To solve these scaling pain points, we have to move away from a flat network architecture and adopt a Tiered Policy Model. A scalable solution requires four core capabilities:
Global, Cluster-Wide Scope: To stop copy-pasting rules, administrators need a policy type that natively operates at the cluster level rather than the namespace level. This allows a single manifest to apply to all current and future namespaces automatically, eliminating the risk of “configuration drift” and ensuring day-one protection for new workloads.
Separation of Concerns (RBAC-Gated Tiers): Security, platform, and application teams need their own distinct logical “zones” or tiers to deploy rules. These tiers must be strictly gated by Role-Based Access Control (RBAC) so a developer modifying their application namespace cannot alter or override a higher-priority platform or security tier.
Deterministic, Top-Down Evaluation: The firewall engine must evaluate these tiers sequentially. Traffic must pass through the highest-priority tier (e.g., Security) before it ever reaches a lower tier (e.g., Application).
Explicit Deny and Pass Actions: Standard policies are allow-only, so they can never express a hard “block this, period.” A tiered model needs explicit actions: a Deny that states a prohibition outright, and a third option, Pass, that lets one tier defer the decision to the next rather than ending it (covered in detail below).
Why the Pass Action Matters
The key enabler of tiered policies is the Pass action. Think of Pass as a delegated hand-off. When a packet matches a rule with a Pass action in a high-priority tier, the engine skips the remaining lower-precedence rules in that tier and continues evaluation in the next tier down the hierarchy. This allows security administrators to say: “This traffic is safe by our standards, but we aren’t explicitly endorsing it. We are passing the final decision down to the platform or development teams to handle at their layer.” Without a Pass action, tiered policies become brittle, forcing admins to explicitly track and approve every single microservice connection at the highest level, which would defeat the purpose of developer agility.
The Kubernetes Native Answer: ClusterNetworkPolicy
Recognizing these scalability constraints, the SIG-Network Policy API group developed a native, multi-layered solution: ClusterNetworkPolicy. The API delivers exactly the four capabilities outlined above, with a few concrete specifics worth calling out:
A Native Three-Layer Hierarchy: It introduces distinct, sequentially evaluated resource tiers. ClusterNetworkPolicy (Admin tier) at the top for absolute guardrails, standard NetworkPolicy in the middle for developer agility, and ClusterNetworkPolicy (Baseline tier) at the bottom as a cluster-wide fallback safety net. Unlike namespace-jailed standard policies, the Admin and Baseline tiers apply across the entire cluster.
Separation of Concerns: Because ClusterNetworkPolicy is delivered as a new Custom Resource Definition (CRD) rather than a tweak to the existing NetworkPolicy type, standard Kubernetes RBAC governs who can interact with it. This ensures that only Security/Platform teams access ClusterNetworkPolicy resources, while DevOps teams work only with namespaced network policies.
Numeric Precedence: Policies feature explicit integer priorities. A policy with a lower integer value (e.g., 10) takes precedence over a policy with a higher value (e.g., 100), allowing for deterministic evaluation.
Explicit Actions: Rules are no longer purely additive. You can now design rules with explicit Accept, Deny, and Pass actions.
This API completely shifts how cluster administrators manage traffic by introducing a native, three-tiered evaluation hierarchy:
The Top Layer: ClusterNetworkPolicy (Admin tier): This is the high-priority tier controlled by cluster and security administrators. Rules here are evaluated first, and two of its three actions are terminal: an Accept or a Deny is a final verdict that bypasses the developer’s NetworkPolicy layer entirely. A Deny here cannot be overridden by any developer manifest, but the same is true of Accept: if an admin explicitly accepts traffic, it is permitted regardless of what a developer policy would have decided. This is the crucial difference from a standard NetworkPolicy allow, which is additive. An Admin-tier Accept is an override, not a contribution. Only the third action, Pass, is non-terminal: it declines to decide and hands evaluation down to the next tier.
As an example, the following ClusterNetworkPolicy can be used to allow DNS UDP traffic toward kube-dns from all namespaces:
apiVersion: policy.networking.k8s.io/v1alpha2
kind: ClusterNetworkPolicy
metadata:
name: allow-dns-to-kube-dns
spec:
tier: Admin
priority: 100
subject:
namespaces:
matchLabels: {}
egress:
- name: allow-dns
action: Accept
to:
- pods:
namespaceSelector:
matchLabels:
kubernetes.io/metadata.name: kube-system
podSelector:
matchLabels:
k8s-app: kube-dns
protocols:
- udp:
destinationPort:
number: 53
The Middle Layer: Standard NetworkPolicy: This is the traditional application-developer tier. It only kicks in if traffic wasn’t explicitly allowed or denied by the ClusterNetworkPolicy in the Admin tier above it. This keeps developers agile, letting them connect their microservices without needing admin intervention. One subtlety to keep in mind: standard NetworkPolicy carries an implicit deny for any pod it selects. So traffic only falls through to the Baseline tier when no NetworkPolicy selects the workload at all. A pod that is selected but matches none of its Accept rules is already dropped here, and never reaches the Baseline tier below. The following network policy can be used to permit ingress HTTP traffic for the awesome-app namespace.
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
name: allow-http-ingress
namespace: awesome-app
spec:
podSelector:
matchLabels:
app: http-server
policyTypes:
- Ingress
ingress:
- ports:
- protocol: TCP
port: 80
The Bottom Layer: ClusterNetworkPolicy (Baseline tier): This is the cluster-scoped Baseline tier, meant for default fallbacks. It acts as the safety net after developer policies are checked. For example, if a developer forgets to secure their pod, this policy can enforce a default cluster-wide posture like “if no developer policy matches this traffic, deny all intra-cluster traffic by default.”. The following ClusterNetworkPolicy would satisfy this requirement:
apiVersion: policy.networking.k8s.io/v1alpha2
kind: ClusterNetworkPolicy
metadata:
name: deny-all
spec:
tier: Baseline
priority: 1
subject:
namespaces:
matchLabels: {}
ingress:
- name: deny-all-ingress
action: Deny
from:
- namespaces:
matchLabels: {}
Combined, these features provide a native, multi-level strategy for scaling enterprise cluster security far beyond the limitations of a flat configuration.
Extending the Model: Calico Tiers
While the native Kubernetes APIs introduce a better three-layer model, and some control over rule priority, enterprise environments often require finer granularity. Calico expands on this concept by offering unlimited policy tiers, allowing you to design an arbitrary number of custom evaluation layers. Calico tiers will be discussed in the next post.
Get started with an interactive demo: DNS Policy with Calico
Best Practices
Join our mailing list
Get updates on blog posts, workshops, certification programs, new releases, and more!

## extraction_diagnostics

- extraction_method: main
- readability_score: 97
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":10018,"paragraph_count":43,"sentence_count":62,"boilerplate_hits":0,"symbol_ratio":0.0006,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis. A small number of microservices suddenly demand hundreds of individual Kubernetes... The post Tiered Network Policy: Scaling Kubernetes Security appeared first on Tigera – Creator of Calico. ]]>

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   A small number of microservices suddenly demand hundreds of individual Kubernetes NetworkPolicy objects.

4. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   Managing them becomes operationally expensive, auditing them is difficult, and a single developer misconfiguration can easily drop critical production traffic or open a massive security hole.

5. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   To scale cluster security without slowing down engineering velocity, we must abandon the flat, uncoordinated rule planes of the past.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   The solution lies in establishing a clear, multi-layered framework: a hierarchy of trust powered by tiered network policies.

## business_elements

- companies: Tigera Blog (Calico, AI Security)
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 169.254, 10, 100, 8, 1, 2, 53, 80
- quotes: Isolate the payments namespace from everything else / Allow-Only / Block traffic from Namespace X to Namespace Y, no matter what. / configuration drift / block this, period.

## evidence_seed

- company_actions: As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis. / A small number of microservices suddenly demand hundreds of individual Kubernetes NetworkPolicy objects. / The solution lies in establishing a clear, multi-layered framework: a hierarchy of trust powered by tiered network policies.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis. A small number of microservices suddenly demand hundreds of individual Kubernetes... The post Tiered Network Policy: Scaling Kubernetes Security appeared first on Tigera – Creator of Calico. ]]> / Managing them becomes operationally expensive, auditing them is difficult, and a single developer misconfiguration can easily drop critical production traffic or open a massive security hole. / To scale cluster security without slowing down engineering velocity, we must abandon the flat, uncoordinated rule planes of the past.

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: vertical industry solution; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: false
- business_change: false
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: low
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: supporting_evidence
- discovery_source: none
- source_role: resolved_original_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

As Kubernetes clusters scale from a few development sandboxes to massive, multi-tenant production environments, platform teams often find themselves facing a configuration management crisis. A small number of microservices suddenly demand hundreds of individual Kubernetes... The post Tiered Network Policy: Scaling Kubernetes Security appeared first on Tigera – Creator of Calico. ]]>

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
