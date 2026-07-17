---
schema_version: raw-evidence-v2
raw_id: R-053
title: "What’s New in Calico v3.32"
original_url: "https://www.tigera.io/blog/whats-new-in-calico-v3-32/"
canonical_url: "https://tigera.io/blog/whats-new-in-calico-v3-32"
source_name: "Tigera Blog (Calico / AI Security)"
source_type: analysis
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: changelog_or_release
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
collected_at: 2026-06-28T04:05:28.204Z
language: mixed
full_text_hash: 5b89f242367d4aa0
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-28/r-053-what-s-new-in-calico-v3-32.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-28/r-053-what-s-new-in-calico-v3-32.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":10488,"paragraph_count":83,"sentence_count":63,"boilerplate_hits":0,"symbol_ratio":0.001,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 10488
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"5b89f242367d4aa0","missing":[]}
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
url_hash: 615b0c0a2761fa54
content_hash: 5b89f242367d4aa0
semantic_hash: 3bc1f1a00e9c4ca6
duplicate_of: ""
first_seen_at: "2026-06-28T04:05:28.204Z"
last_seen_at: 2026-06-28T04:05:28.204Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Tigera Blog (Calico","AI Security)"],"products":[],"people":[],"industries":["医疗","开发者工具","企业服务"],"roles":[],"workflows":["合同审阅 / 法律研究","计费 / 预算管理","权限 / 安全治理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全","财务 / 预算","销售 / 客服"],"numbers":["3.32","8217","1.36","2","3","1.30","1","4"],"quotes":["shift-left"]}
evidence_seed: {"company_actions":["We&#8217;re excited to announce the release of Calico Open Source v3.32! 🎉 This release corresponds with Kubernetes v1.36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it... The post What’s New in Calico v3.32 appeared first on Tigera – Creator of Calico. ]]>","We’re excited to announce the release of Calico Open Source v3.","🎉 This release corresponds with Kubernetes v1."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"product_update","text":"We&#8217;re excited to announce the release of Calico Open Source v3.32! 🎉 This release corresponds with Kubernetes v1.36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it... The post What’s New in Calico v3.32 appeared first on Tigera – Creator of Calico. ]]>","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"We’re excited to announce the release of Calico Open Source v3.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"🎉 This release corresponds with Kubernetes v1.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it actually extends capabilities and features of Kubernetes to keep you up to date with the latest innovations of the cloud.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"This release brings some of the most significant architectural changes in Calico, from live-migrating KubeVirt VMs to eBPF based Maglev load balancer.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Here’s a quick look at everything that’s new: 🚨 Breaking Changes & Deprecations ClusterNetworkPolicy (Alpha2) replaces Admin and Baseline Admin Network Policies: AdminNetworkPolicy and BaselineAdminNetworkPolicy have been removed .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"}]
theme: early-direction-signal
keyword_group: early-direction-signal
copyright_note: local research archive only
title_zh: "Calico v3.32 新特性"
title_translation_status: "translated"
title_translation_method: "source_title_translation_db"
title_translation_model: "not_applicable"
---

# What’s New in Calico v3.32

## clean_text

We’re excited to announce the release of Calico Open Source v3.32! 🎉
This release corresponds with Kubernetes v1.36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it actually extends capabilities and features of Kubernetes to keep you up to date with the latest innovations of the cloud.
This release brings some of the most significant architectural changes in Calico, from live-migrating KubeVirt VMs to eBPF based Maglev load balancer.
Here’s a quick look at everything that’s new:
🚨 Breaking Changes & Deprecations
ClusterNetworkPolicy (Alpha2) replaces Admin and Baseline Admin Network Policies: AdminNetworkPolicy and BaselineAdminNetworkPolicy have been removed . You must migrate to ClusterNetworkPolicy before upgrading to v3.32, as Calico will no longer enforce the old resources.
calico-apiserver Deprecated: The aggregated API server is deprecated and will be removed in a future release. It is being replaced by Native v3 CRDs . (Requires MutatingAdmissionPolicy feature gate, Kubernetes 1.30+).
🚀 Key Feature Updates
1. KubeVirt VM Live Migration Support
What it does: Allows live-migrating KubeVirt VMs between nodes without dropping TCP connections.
How it works: Achieves IP persistence by binding the IP to the VM name rather than the ephemeral pod.
Activation: Set kubeVirtVMAddressPersistence: Enabled in the IPAMConfiguration resource.
2. Sidecarless mTLS (Istio Ambient Mode)
What it does: High-performance, sidecarless mTLS using Istio ambient mode and Ztunnel. Removes the need to restart workloads or manage third-party components.
Activation: Create a brand new Tigera-operator resource and set its kind to Istio then the Tigera Operator will automatically pick it up and automate the Istio integration! .
3. Maglev Consistent-Hash Load Balancing
What it does: Minimizes flow remapping during backend changes, ensuring long-lived connections survive backend churn and allowing you to bypass external load balancers.
Requirements: Must use the Calico eBPF data plane in Direct Server Return (DSR) mode.
Activation: Add the annotation lb.projectcalico.org/external-traffic-strategy: "maglev" to your Service.
4. Whisker Policy Filtering (Tech Preview)
What it does: The Whisker web console flow-log stream now allows advanced UI filtering by Policy, Namespace/Pod, Verdict (allow/deny), Reporter, and Pending/Staged actions.
Kubernetes ClusterNetworkPolicy (Alpha2)
🚨Breaking change🚨
AdminNetworkPolicy and BaselineAdminNetworkPolicy resources were removed in v3.32 and must be replaced with ClusterNetworkPolicy before upgrading, Calico v3.32 and newer will not enforce them.
The Kubernetes NetworkPolicy resource has long been limited by its namespace scoped perspective. This often created challenges for practitioners attempting to secure clusters forcing them to a flat design that required individual policies for every namespace and a heavy lift for the security team to govern every aspect of the environment’s security. Calico users, however, have avoided these pitfalls through the use of Global NetworkPolicy, policy tiers and ordering. These features enable a “shift-left” approach for Calico users, allowing application teams to manage their own security while administrators and security teams maintain the cluster’s overarching security posture by adjusting policy evaluation precedence.
So we are glad to announce that the upstream Kubernetes SIG-Network introduces a new security model called ClusterNetworkPolicy. This is how cluster admins enforce cluster-scoped Accept, Deny, and Pass rules that namespace owners cannot override, filling the gap that namespace-scoped NetworkPolicy has never been able to address.
Two tiers are auto-created at startup:
ClusterNetworkPolicy Tier
Calico Tier
Order
Purpose
Admin
kube-admin
1,000
Hard guardrails set by the security/platform team
Baseline
kube-baseline
10,000,000
Safety net defaults below namespace NetworkPolicy
Policies use an action field, Allow, Deny, or Pass, and a priority field (lower wins within the tier):
apiVersion: policy.networking.k8s.io/v1alpha2
kind: ClusterNetworkPolicy
metadata:
name: admin-isolate-prod
spec:
tier: Admin
priority: 200
subject:
namespaces:
matchLabels:
environment: prod
ingress:
- action: Deny
from:
- namespaces:
matchLabels:
environment: dev
Native v3 CRDs (Tech Preview)
⚠️ Deprecation notice ⚠️The aggregated API server (calico-apiserver) is deprecated in 3.32 and will be removed in a future release. Since this feature is currently in tech preview, migrating is optional.
One of the longest-standing sources of installation friction in Calico has been the aggregated API server (calico-apiserver), a pod deployment that proxied requests to Calico’s v3 resources and generated its own OpenAPI schema independent of Kubernetes. This created ordering dependencies at install time, validation failures without an error if users used older APIs and also caused GitOps tools to fail schema validation after Kubernetes upgrades, and complicated the overall install experience. In Calico 3.32, we’re changing this permanently. Native projectcalico.org/v3 CRDs register Calico’s v3 resources directly as standard Kubernetes CRDs, the same mechanism as any other custom resource.
What changes:
🚫 No calico-apiserver host-network pod
⚡ No ordering race between CRDs and the API server at startup
🖥️ kubectl get globalnetworkpolicies works natively, no calicoctl required
✅ OpenAPI schema generated by Kubernetes, so ArgoCD and Flux validate correctly
Note: Beta or GA releases of MutatingAdmissionPolicy feature gate must be enabled in your cluster (Kubernetes 1.32+, not enabled by default in all distributions).
To help you prepare for upcoming Calico changes, we have provided a step-by-step migration guide you can use now.
📖 Enable native v3 CRDs
KubeVirt Virtual Machine (VM) Live Migration
Kubernetes flexibility and ephemeral IP allocation is its strength but when it comes to VMs hosted on Kubernetes it becomes a pain point. Most VMs are transferred from a legacy network and applications that are running on it require static IP or a certain MAC address which is not something Kubernetes offers. Calico v3.32 release brings first-class support for live-migrating KubeVirt VMs between nodes in a cluster, without even dropping a single TCP connection. This means that you can move a VM from any node into any other nodes within a cluster without impacting the network operations.
VM-based IP persistence is controlled by a single field in the IPAM configuration resource:
apiVersion: projectcalico.org/v3
kind: IPAMConfiguration
metadata:
name: default
spec:
kubeVirtVMAddressPersistence: Enabled
When enabled, Calico ties the IP handle to the VM name (k8s-pod-network.vmi.<namespace>.<vm-name>) rather than the visual representation of the VM as a pod. The same IP is reallocated to the destination pod during migration, and persists across reboots and pod evictions too.
📖 KubeVirt networking | BGP routing for KubeVirt live migration
mTLS encryption without compromise – Istio Ambient Mode (Tech Preview)
Calico sidecarless mTLS is based on Istio ambient mode and Ztunnel which establishes a secure high performance link between your pods without a need for any sidecars. This is a significant performance boost over the previous Calico integration with Istio given that it eliminates the need to restart your workloads to join the mesh and the resource overhead that used to stack up as your workloads used to grow. On top of that for the new mTLS features you don’t need to install or manage any third-party components, since Tigera operator takes care of all the necessary parts of this integration and provides a smooth transition from an unencrypted environment to a high performance secure mesh.
To enable ambient mode with Calico create the following Tigera Operator resource:
apiVersion: operator.tigera.io/v1
kind: Istio
metadata:
name: default
Note: Calico publishes its own customized Istio, and Ztunnel images, with Calico-specific patches and CVE-fix dependency bumps applied. These images were previously available only in Calico Enterprise and are now part of Open Source.
📖 Istio Ambient Mode
Maglev Consistent-Hash Load Balancing
Calico v3.32 provides support for Maglev consistent-hash load balancing for external traffic to a Service. This means if enabled, Calico nodes act as stable Equal-Cost Multi-Path (ECMP) nexthops for advertised service IPs, serving as a distributed load balancer. When a Calico node is churned or loses connectivity, service connections will stay healthy. It also means if a backend is added or removed, Maglev remaps only a small fraction of flows, so that more long-lived connections survive churn.
Now you might be wondering why you need such a feature? Using Maglev allows you to ditch your external legacy load balancers and move everything within your cluster.
Opt in per-Service with a single annotation:
apiVersion: v1
kind: Service
metadata:
name: my-service
annotations:
lb.projectcalico.org/external-traffic-strategy: "maglev"
spec:
type: LoadBalancer
...
Calico Maglev also provides monitoring capabilities and builds on top of the prometheus integrations and you can monitor Maglev connection counts via the new Prometheus metric:
felix_bpf_conntrack_maglev_entries_total
Requirements: Calico eBPF data plane in direct server return (DSR) mode.
📖 Add Maglev load balancing to a service
📖 Learn how to enable Calico Prometheus integrations
Whisker Policy Filtering (Tech Preview)
The Whisker web console gains expanded filtering on the live flow-log stream in Calico 3.32.
This video depicts how you can now filter by:
🔍 Policy, show only flows that hit a specific policy
📁 Namespace / Pod, narrow to a specific workload
✅ Verdict, filter to allowed or denied flows only
👁️ Reporter, filter by source or destination reporter
🕐 Pending/Staged actions, see what staged policies would do before enforcing them
This builds on the flow-logs API (Goldmane) and Whisker components shipped in earlier 3.x releases.
New to Calico Whisker? Watch this CalicoCon session to learn more about Calico observability features:
Like to build your own integration with Calico Goldmane?
📖 View flow logs in the Calico Whisker web console
As always a full list of all the changes can be found in the release notes .
Open Source Release Project Calico
Join our mailing list
Get updates on blog posts, workshops, certification programs, new releases, and more!

## full_text

We’re excited to announce the release of Calico Open Source v3.32! 🎉
This release corresponds with Kubernetes v1.36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it actually extends capabilities and features of Kubernetes to keep you up to date with the latest innovations of the cloud.
This release brings some of the most significant architectural changes in Calico, from live-migrating KubeVirt VMs to eBPF based Maglev load balancer.
Here’s a quick look at everything that’s new:
🚨 Breaking Changes & Deprecations
ClusterNetworkPolicy (Alpha2) replaces Admin and Baseline Admin Network Policies: AdminNetworkPolicy and BaselineAdminNetworkPolicy have been removed . You must migrate to ClusterNetworkPolicy before upgrading to v3.32, as Calico will no longer enforce the old resources.
calico-apiserver Deprecated: The aggregated API server is deprecated and will be removed in a future release. It is being replaced by Native v3 CRDs . (Requires MutatingAdmissionPolicy feature gate, Kubernetes 1.30+).
🚀 Key Feature Updates
1. KubeVirt VM Live Migration Support
What it does: Allows live-migrating KubeVirt VMs between nodes without dropping TCP connections.
How it works: Achieves IP persistence by binding the IP to the VM name rather than the ephemeral pod.
Activation: Set kubeVirtVMAddressPersistence: Enabled in the IPAMConfiguration resource.
2. Sidecarless mTLS (Istio Ambient Mode)
What it does: High-performance, sidecarless mTLS using Istio ambient mode and Ztunnel. Removes the need to restart workloads or manage third-party components.
Activation: Create a brand new Tigera-operator resource and set its kind to Istio then the Tigera Operator will automatically pick it up and automate the Istio integration! .
3. Maglev Consistent-Hash Load Balancing
What it does: Minimizes flow remapping during backend changes, ensuring long-lived connections survive backend churn and allowing you to bypass external load balancers.
Requirements: Must use the Calico eBPF data plane in Direct Server Return (DSR) mode.
Activation: Add the annotation lb.projectcalico.org/external-traffic-strategy: "maglev" to your Service.
4. Whisker Policy Filtering (Tech Preview)
What it does: The Whisker web console flow-log stream now allows advanced UI filtering by Policy, Namespace/Pod, Verdict (allow/deny), Reporter, and Pending/Staged actions.
Kubernetes ClusterNetworkPolicy (Alpha2)
🚨Breaking change🚨
AdminNetworkPolicy and BaselineAdminNetworkPolicy resources were removed in v3.32 and must be replaced with ClusterNetworkPolicy before upgrading, Calico v3.32 and newer will not enforce them.
The Kubernetes NetworkPolicy resource has long been limited by its namespace scoped perspective. This often created challenges for practitioners attempting to secure clusters forcing them to a flat design that required individual policies for every namespace and a heavy lift for the security team to govern every aspect of the environment’s security. Calico users, however, have avoided these pitfalls through the use of Global NetworkPolicy, policy tiers and ordering. These features enable a “shift-left” approach for Calico users, allowing application teams to manage their own security while administrators and security teams maintain the cluster’s overarching security posture by adjusting policy evaluation precedence.
So we are glad to announce that the upstream Kubernetes SIG-Network introduces a new security model called ClusterNetworkPolicy. This is how cluster admins enforce cluster-scoped Accept, Deny, and Pass rules that namespace owners cannot override, filling the gap that namespace-scoped NetworkPolicy has never been able to address.
Two tiers are auto-created at startup:
ClusterNetworkPolicy Tier
Calico Tier
Order
Purpose
Admin
kube-admin
1,000
Hard guardrails set by the security/platform team
Baseline
kube-baseline
10,000,000
Safety net defaults below namespace NetworkPolicy
Policies use an action field, Allow, Deny, or Pass, and a priority field (lower wins within the tier):
apiVersion: policy.networking.k8s.io/v1alpha2
kind: ClusterNetworkPolicy
metadata:
name: admin-isolate-prod
spec:
tier: Admin
priority: 200
subject:
namespaces:
matchLabels:
environment: prod
ingress:
- action: Deny
from:
- namespaces:
matchLabels:
environment: dev
Native v3 CRDs (Tech Preview)
⚠️ Deprecation notice ⚠️The aggregated API server (calico-apiserver) is deprecated in 3.32 and will be removed in a future release. Since this feature is currently in tech preview, migrating is optional.
One of the longest-standing sources of installation friction in Calico has been the aggregated API server (calico-apiserver), a pod deployment that proxied requests to Calico’s v3 resources and generated its own OpenAPI schema independent of Kubernetes. This created ordering dependencies at install time, validation failures without an error if users used older APIs and also caused GitOps tools to fail schema validation after Kubernetes upgrades, and complicated the overall install experience. In Calico 3.32, we’re changing this permanently. Native projectcalico.org/v3 CRDs register Calico’s v3 resources directly as standard Kubernetes CRDs, the same mechanism as any other custom resource.
What changes:
🚫 No calico-apiserver host-network pod
⚡ No ordering race between CRDs and the API server at startup
🖥️ kubectl get globalnetworkpolicies works natively, no calicoctl required
✅ OpenAPI schema generated by Kubernetes, so ArgoCD and Flux validate correctly
Note: Beta or GA releases of MutatingAdmissionPolicy feature gate must be enabled in your cluster (Kubernetes 1.32+, not enabled by default in all distributions).
To help you prepare for upcoming Calico changes, we have provided a step-by-step migration guide you can use now.
📖 Enable native v3 CRDs
KubeVirt Virtual Machine (VM) Live Migration
Kubernetes flexibility and ephemeral IP allocation is its strength but when it comes to VMs hosted on Kubernetes it becomes a pain point. Most VMs are transferred from a legacy network and applications that are running on it require static IP or a certain MAC address which is not something Kubernetes offers. Calico v3.32 release brings first-class support for live-migrating KubeVirt VMs between nodes in a cluster, without even dropping a single TCP connection. This means that you can move a VM from any node into any other nodes within a cluster without impacting the network operations.
VM-based IP persistence is controlled by a single field in the IPAM configuration resource:
apiVersion: projectcalico.org/v3
kind: IPAMConfiguration
metadata:
name: default
spec:
kubeVirtVMAddressPersistence: Enabled
When enabled, Calico ties the IP handle to the VM name (k8s-pod-network.vmi.<namespace>.<vm-name>) rather than the visual representation of the VM as a pod. The same IP is reallocated to the destination pod during migration, and persists across reboots and pod evictions too.
📖 KubeVirt networking | BGP routing for KubeVirt live migration
mTLS encryption without compromise – Istio Ambient Mode (Tech Preview)
Calico sidecarless mTLS is based on Istio ambient mode and Ztunnel which establishes a secure high performance link between your pods without a need for any sidecars. This is a significant performance boost over the previous Calico integration with Istio given that it eliminates the need to restart your workloads to join the mesh and the resource overhead that used to stack up as your workloads used to grow. On top of that for the new mTLS features you don’t need to install or manage any third-party components, since Tigera operator takes care of all the necessary parts of this integration and provides a smooth transition from an unencrypted environment to a high performance secure mesh.
To enable ambient mode with Calico create the following Tigera Operator resource:
apiVersion: operator.tigera.io/v1
kind: Istio
metadata:
name: default
Note: Calico publishes its own customized Istio, and Ztunnel images, with Calico-specific patches and CVE-fix dependency bumps applied. These images were previously available only in Calico Enterprise and are now part of Open Source.
📖 Istio Ambient Mode
Maglev Consistent-Hash Load Balancing
Calico v3.32 provides support for Maglev consistent-hash load balancing for external traffic to a Service. This means if enabled, Calico nodes act as stable Equal-Cost Multi-Path (ECMP) nexthops for advertised service IPs, serving as a distributed load balancer. When a Calico node is churned or loses connectivity, service connections will stay healthy. It also means if a backend is added or removed, Maglev remaps only a small fraction of flows, so that more long-lived connections survive churn.
Now you might be wondering why you need such a feature? Using Maglev allows you to ditch your external legacy load balancers and move everything within your cluster.
Opt in per-Service with a single annotation:
apiVersion: v1
kind: Service
metadata:
name: my-service
annotations:
lb.projectcalico.org/external-traffic-strategy: "maglev"
spec:
type: LoadBalancer
...
Calico Maglev also provides monitoring capabilities and builds on top of the prometheus integrations and you can monitor Maglev connection counts via the new Prometheus metric:
felix_bpf_conntrack_maglev_entries_total
Requirements: Calico eBPF data plane in direct server return (DSR) mode.
📖 Add Maglev load balancing to a service
📖 Learn how to enable Calico Prometheus integrations
Whisker Policy Filtering (Tech Preview)
The Whisker web console gains expanded filtering on the live flow-log stream in Calico 3.32.
This video depicts how you can now filter by:
🔍 Policy, show only flows that hit a specific policy
📁 Namespace / Pod, narrow to a specific workload
✅ Verdict, filter to allowed or denied flows only
👁️ Reporter, filter by source or destination reporter
🕐 Pending/Staged actions, see what staged policies would do before enforcing them
This builds on the flow-logs API (Goldmane) and Whisker components shipped in earlier 3.x releases.
New to Calico Whisker? Watch this CalicoCon session to learn more about Calico observability features:
Like to build your own integration with Calico Goldmane?
📖 View flow logs in the Calico Whisker web console
As always a full list of all the changes can be found in the release notes .
Open Source Release Project Calico
Join our mailing list
Get updates on blog posts, workshops, certification programs, new releases, and more!

## extraction_diagnostics

- extraction_method: main
- readability_score: 97
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":10488,"paragraph_count":83,"sentence_count":63,"boilerplate_hits":0,"symbol_ratio":0.001,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   We&#8217;re excited to announce the release of Calico Open Source v3.32! 🎉 This release corresponds with Kubernetes v1.36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it... The post What’s New in Calico v3.32 appeared first on Tigera – Creator of Calico. ]]>

2. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   We’re excited to announce the release of Calico Open Source v3.

3. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   🎉 This release corresponds with Kubernetes v1.

4. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it actually extends capabilities and features of Kubernetes to keep you up to date with the latest innovations of the cloud.

5. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   This release brings some of the most significant architectural changes in Calico, from live-migrating KubeVirt VMs to eBPF based Maglev load balancer.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Here’s a quick look at everything that’s new: 🚨 Breaking Changes & Deprecations ClusterNetworkPolicy (Alpha2) replaces Admin and Baseline Admin Network Policies: AdminNetworkPolicy and BaselineAdminNetworkPolicy have been removed .

## business_elements

- companies: Tigera Blog (Calico, AI Security)
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 医疗, 开发者工具, 企业服务
- roles: 暂无公开信息
- workflows: 合同审阅 / 法律研究, 计费 / 预算管理, 权限 / 安全治理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全, 财务 / 预算, 销售 / 客服
- numbers: 3.32, 8217, 1.36, 2, 3, 1.30, 1, 4
- quotes: shift-left

## evidence_seed

- company_actions: We&#8217;re excited to announce the release of Calico Open Source v3.32! 🎉 This release corresponds with Kubernetes v1.36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it... The post What’s New in Calico v3.32 appeared first on Tigera – Creator of Calico. ]]> / We’re excited to announce the release of Calico Open Source v3. / 🎉 This release corresponds with Kubernetes v1.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
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

We&#8217;re excited to announce the release of Calico Open Source v3.32! 🎉 This release corresponds with Kubernetes v1.36 (Codename Haru) and it goes beyond just sharing a cat as the mascot of the release, it... The post What’s New in Calico v3.32 appeared first on Tigera – Creator of Calico. ]]>

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
