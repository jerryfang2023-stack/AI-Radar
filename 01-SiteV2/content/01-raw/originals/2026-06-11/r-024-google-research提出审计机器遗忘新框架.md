---
schema_version: raw-evidence-v2
raw_id: R-024
title: "Google Research提出审计机器遗忘新框架"
original_url: "https://research.google/blog/new-framework-for-auditing-machine-unlearning"
canonical_url: "https://research.google/blog/new-framework-for-auditing-machine-unlearning"
source_name: "Google Research：Blog（网页）"
source_type: official
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: research_or_report
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-10T18:46:09.407Z"
collected_at: 2026-06-11T01:29:52.724Z
language: mixed
full_text_hash: 12b739f273eb3743
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-11/r-024-google-research提出审计机器遗忘新框架.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-11/r-024-google-research提出审计机器遗忘新框架.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":12861,"paragraph_count":48,"sentence_count":75,"boilerplate_hits":0,"symbol_ratio":0,"method":"main"}
has_full_text: true
content_length: 12861
fetch_error: ""
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["discovery_or_feedback_source_boundary"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"12b739f273eb3743","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: supporting_evidence
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Google Research提出审计机器遗忘新框架","discovery_summary":"Google Research 在 AISTATS 2026 发表正则化 f-散度核检验，用于高效审计 LLM 等模型的机器遗忘。该方法通过统计两样本检验判断模型是否真正\"忘记\"特定训练数据，避免完全重训的巨大成本。相比最大均值差异等现有工具，新框架理论上可在任意样本量下自然控制假阳性，且假阴性风险随可用样本增加可靠收敛至零，解决了大规模模型审计中计算成本过高的问题。","source_name":"Google Research：Blog（网页）","origin_url":"https://research.google/blog/new-framework-for-auditing-machine-unlearning","discovered_at":"2026-06-11T01:23:43.688Z","rank_on_page":106,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 3bd2405fa849103b
content_hash: 12b739f273eb3743
semantic_hash: 69e4896aee9f51f6
duplicate_of: ""
first_seen_at: "2026-06-10T18:46:09.407Z"
last_seen_at: 2026-06-11T01:29:52.724Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":true,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Google Research","Blog（网页）","Google"],"products":[],"people":[],"industries":["法律 / 法务","开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["计费 / 预算管理","权限 / 安全治理"],"business_actions":[],"affected_departments":["IT / 安全","法务","财务 / 预算"],"numbers":["2026","10","2026\nM","1","3","27","31","2026\nB"],"quotes":[" specific parts of their training data without the massive cost of retraining a model from scratch. This is essential for regulatory compliance (like GDPR’s ","distance"," retrain equivalence ","forget set","difference detectors"]}
evidence_seed: {"company_actions":["play silent looping video pause silent looping video unmute video mute video New framework for auditing machine unlearning June 10, 2026 Mónica Ribero, Research Scientist, Google Research We introduce a method designed to confidently determine whether there is statistically significant evidence that two sets of data observations come from entirely different underlying distributions.","Quick links Paper Share Copy link Machine unlearning allows AI systems to \"forget\" specific parts of their training data without the massive cost of retraining a model from scratch.","However, because auditors often don’t have access to the model's internal workings or original training data, they must verify the system strictly by querying it and analyzing the output samples."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":["Google Research 在 AISTATS 2026 发表正则化 f-散度核检验，用于高效审计 LLM 等模型的机器遗忘。该方法通过统计两样本检验判断模型是否真正\"忘记\"特定训练数据，避免完全重训的巨大成本。相比最大均值差异等现有工具，新框架理论上可在任意样本量下自然控制假阳性，且假阴性风险随可用样本增加可靠收敛至零，解决了大规模模型审计中计算成本过高的问题。","As models process increasingly massive and highly sensitive datasets, verifying machine unlearning has moved from theoretical ideal to a strict requirement, where developers must now mathematically prove privacy."]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"supporting_context","text":"Google Research 在 AISTATS 2026 发表正则化 f-散度核检验，用于高效审计 LLM 等模型的机器遗忘。该方法通过统计两样本检验判断模型是否真正\"忘记\"特定训练数据，避免完全重训的巨大成本。相比最大均值差异等现有工具，新框架理论上可在任意样本量下自然控制假阳性，且假阴性风险随可用样本增加可靠收敛至零，解决了大规模模型审计中计算成本过高的问题。","supports":["daily_observation","heatmap"],"importance":"high","confidence":"high"},{"type":"company_action","text":"play silent looping video pause silent looping video unmute video mute video New framework for auditing machine unlearning June 10, 2026 Mónica Ribero, Research Scientist, Google Research We introduce a method designed to confidently determine whether there is statistically significant evidence that two sets of data observations come from entirely different underlying distributions.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Quick links Paper Share Copy link Machine unlearning allows AI systems to \"forget\" specific parts of their training data without the massive cost of retraining a model from scratch.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"quote","text":"This is essential for regulatory compliance (like GDPR’s \"Right to be Forgotten\" ), AI safety, and model quality.","supports":["daily_observation","heatmap","viewpoint"],"importance":"high","confidence":"high"},{"type":"supporting_context","text":"As models process increasingly massive and highly sensitive datasets, verifying machine unlearning has moved from theoretical ideal to a strict requirement, where developers must now mathematically prove privacy.","supports":["daily_observation","heatmap"],"importance":"high","confidence":"high"},{"type":"company_action","text":"However, because auditors often don’t have access to the model's internal workings or original training data, they must verify the system strictly by querying it and analyzing the output samples.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Google Research提出审计机器遗忘新框架

## clean_text

play silent looping video
pause silent looping video
unmute video
mute video
New framework for auditing machine unlearning
June 10, 2026
Mónica Ribero, Research Scientist, Google Research
We introduce a method designed to confidently determine whether there is statistically significant evidence that two sets of data observations come from entirely different underlying distributions.
Quick links
Paper
Share
Copy link
Machine unlearning allows AI systems to "forget" specific parts of their training data without the massive cost of retraining a model from scratch. This is essential for regulatory compliance (like GDPR’s "Right to be Forgotten" ), AI safety, and model quality.
As models process increasingly massive and highly sensitive datasets, verifying machine unlearning has moved from theoretical ideal to a strict requirement, where developers must now mathematically prove privacy. However, because auditors often don’t have access to the model's internal workings or original training data, they must verify the system strictly by querying it and analyzing the output samples.
One method data scientists and researchers rely on for verification is two-sample testing , a statistical method that determines if two sets of data observations come from entirely different underlying distributions. For example, to verify unlearning, auditors might compare outputs from a model that never saw a specific record against a model that supposedly "forgot" it. If the outputs are statistically different within a defined threshold, the unlearning failed.
As models grow in size and complexity, two-sample testing and other statistical tools used for machine unlearning auditing become challenging to implement and they lose statistical power. To identify a real violation from random noise inherent in large-scale models, and with enough statistical significance, an auditor needs to extract a large number of samples. This makes real-world testing completely computationally very expensive..
To address this growing challenge, we introduce Regularized f-Divergence Kernel Tests , presented at AISTATS 2026 , a new framework designed to make auditing ML models much more sensitive, flexible, and accurate. We theoretically prove that our tests naturally control for false positives for any sample size, and that the risk of false negatives reliably converges to zero as the number of available data samples increases.
The challenge: Why standard tools fall short
Evaluating model safety often requires measuring the distance, or divergence, between two complex data sets. Different applications naturally require different notions of “distance”. While popular standard tools like maximum mean discrepancy (MMD) excel at detecting broad, global shifts across data (such as a model systematically generating brighter images than its counterpart), they often lack the necessary specificity to capture complex anomalies. For instance, if the addition of a specific person's data causes a model to generate a highly specific outlier output only when prompted in a very exact way — while having an equal distribution on all other samples — traditional MMD tests might completely overlook this local shift.
Also, most existing testing frameworks force researchers to make error-prone manual choices, such as picking the specific statistic best suited for either global or local shifts or tuning complex settings like kernel bandwidths and regularization parameters.
In a simple two-sample test between two two-dimensional distributions (above blue and red), MMD excels at detecting global shifts like differences in mean ( left ) but can miss localized differences such as outliers ( middle ) or non-smooth differences that require hyperparameter tuning such as setting a bandwidth parameter ( right ).
In addition to being hard in practice, two-sample testing as a verification method is flawed when verifying unlearning of ML models. Consider the example below showing how two models trained from scratch on the exact same data can produce different distributions. The blue distribution is the distribution of a model retrained without compromised data. However, its distribution is different from the standard (green) due to retraining with different batch sizes. This results in a false positive, indicating that the tested model is unsafe.
Using a two-sample test to verify unlearning yields false positives when the tested model has a different distribution that the standard the auditor is comparing to.
Furthermore, recent work shows that an AI model can never perfectly “forget” data just by tweaking its current settings; unless it re-traces every step of its original training, it will always leave behind a permanent footprint of the information it was supposed to delete. Accordingly, achieving perfect “ retrain equivalence ” is fundamentally impossible for standard, local unlearning algorithms and a traditional two-sample test can always find a dependence on the “forget set”.
The framework
We resolve this challenge by proposing a relative distance test that measures whether an unlearned model is distributionally closer to a safely retrained model or to the original, compromised one.
Our test acts as a highly adaptable statistical toolkit that leverages f-divergences to allow auditors to pinpoint highly specific types of data shifts, including:
Chi-squared and Kullback-Liebler (KL) divergences: These are highly effective for identifying smooth and localized differences in data, such as outliers in physical models.
Hockey-stick divergence : Specially captures definitions for privacy and unlearning, this divergence operates with a parameter that controls the degree of statistical indistinguishability. It effectively establishes an acceptable threshold, ignoring minor differences below a safety budget and only triggering an alert when a meaningful privacy breach occurs.
Calculating these divergences on high-dimensional, real-world data is notoriously difficult. To make these complex optimization problems tractable without requiring massive amounts of compute, we use kernel regularization methods to estimate the differences efficiently.
Our adaptive testing approach automatically selects the best divergence and the optimal hyperparameter configurations to maximize the reliability of the test, entirely eliminating the need for sample splitting.
Experiments
Because our proposed tests are general, we experimented across a wide variety of problems. We evaluated our framework on perturbed uniforms (synthetic two-sample benchmarks), as well as the Expo1D outlier detection task within physics datasets — a specialized area that uses ML to search for new physical phenomena outside the standard model of particle physics. We used high-energy physics data because that field requires the world’s most precise "difference detectors” — the idea being, if the framework can spot a rare particle that defies the laws of physics, it can spot a tiny privacy leak in an AI model.
We then shifted our primary focus to the critical, real-world applications of auditing differential privacy and evaluating machine unlearning:
Privacy auditing : Differential privacy provides a framework for protecting user data by introducing calibrated noise, bounding the influence of any single individual. We tested multiple non-private mechanisms by sampling their outputs across two simulated datasets that differed by only one record. If a mechanism is truly private, the two resulting samples must be indistinguishable; if it is flawed, the test should flag the privacy violation.
Machine unlearning evaluation: Instead of relying on the flawed approach of simply comparing a gold standard model (one retrained from scratch without the forgotten data) to the unlearned model, we leveraged a three-sample relative test, applying it to various established unlearning algorithms, including Selective Synaptic Dampening , pruning , and random label techniques. Our test evaluated whether the unlearned model distribution was closer to the safe gold standard model, or closer to the original, fully trained model that actively memorized the sensitive data.
Proposed framework for relative distance. If the tested model is closer to the compromised model than the retrained golden standard, the test flags an unlearning failure. If the tested model is closer to the golden standard, then the test doesn’t flag any failures.
Results
Our framework successfully recovered or outperformed all previous baseline methods with significantly less manual tuning.
The experimental results demonstrated that no single test consistently outperforms the others across every possible scenario. Instead, different f-divergences act as specialized sensors that "light up" for different types of localized data shifts. By using an aggregated approach across diverse statistics, our framework successfully caught subtle errors and anomalies that standard tests completely missed.
For privacy auditing, the hockey-stick divergence test proved to be a powerful and effective tool. Because it directly aligns with the mathematical foundations of pure differential privacy, it allows auditors to tightly control the acceptable degree of data shift. Our adaptive testing framework successfully caught privacy violations using significantly fewer data samples and requiring far less hyperparameter tuning than previous baseline testers.
Detection rate of non-private mechanisms ( from standard auditing benchmarks). Our hockey-stick based tester outperforms previously studied techniques ( DP-Auditorium ) with fewer samples.
In one notable instance, our framework detected violations in a specific sparse vector technique mechanism (SVT3) using only a few thousand samples, while previously studied techniques like DP-Auditorium required millions of samples to approximate the same violation detection rate.
Our findings also suggest a redefinition of how to evaluate machine unlearning. As shown in the table below, we observed that none of the approximate unlearning methods we evaluated were compliant with the strict, standard two-sample unlearning definition. Because two-sample tests simply look for any distributional difference, they incorrectly flagged perfectly safe, retrained models as unlearning failures.
In contrast, our proposed relative three-sample test successfully overcame this flaw. It correctly and consistently identified the safely retrained models as "safe". When evaluating the approximate unlearning algorithms, only the random label technique passed the evaluation.
Other popular methods, such as finetuning, pruning, and Selective Synaptic Dampening , were found to be ineffective at truly forgetting the targeted data. We emphasize that our primary goal in these experiments was the evaluation of the unlearning methodologies, rather than designing the algorithms themselves. Consequently, we used simplified implementations of these unlearning procedures; more rigorous setups will be required to rank unlearning methods in practical production environments.
Audit results for different (simplified) unlearning algorithms. Exact unlearning mechanisms retrain from scratch without access to forget data, and are thus safe by definition. However, two-sample tests incorrectly flag them as unsafe due to distributional differences with the “standard”. The three-sample test overcomes this issue.
Conclusion
Our newly proposed framework provides a much more precise, adaptable, and mathematically sound lens for examining ML behavior. By leveraging regularized f-Divergence kernel tests , researchers and auditors can now statistically prove whether a model is behaving unsafely or leaking data across a massive class of problems and complex distributional shifts.
As this field evolves, theoretically grounding our empirical observations to characterize exactly which specific divergence is optimal for other novel tasks remains an exciting direction for future work. Establishing tighter sample complexity bounds will also be a key focus to make these audits even more efficient.
Acknowledgements
The work described here was done jointly with Antonin Schrab and Arthur Gretton. We thank Nicole Mitchell and Eleni Triantafillou for insightful feedback, and Kimberly Schwede for the graphics and Mark Simborg for helpful edits.
Labels:
Algorithms & Theory
Responsible AI
Security, Privacy and Abuse Prevention
Quick links
Paper
Share
Copy link
Other posts of interest
May 27, 2026
Private analytics via zero-trust aggregation
Security, Privacy and Abuse Prevention
March 31, 2026
Building better AI benchmarks: How many raters are enough?
Algorithms & Theory
Machine Intelligence
March 31, 2026
Safeguarding cryptocurrency by disclosing quantum vulnerabilities responsibly
Algorithms & Theory
Quantum
Security, Privacy and Abuse Prevention
&times;

## full_text

play silent looping video
pause silent looping video
unmute video
mute video
New framework for auditing machine unlearning
June 10, 2026
Mónica Ribero, Research Scientist, Google Research
We introduce a method designed to confidently determine whether there is statistically significant evidence that two sets of data observations come from entirely different underlying distributions.
Quick links
Paper
Share
Copy link
Machine unlearning allows AI systems to "forget" specific parts of their training data without the massive cost of retraining a model from scratch. This is essential for regulatory compliance (like GDPR’s "Right to be Forgotten" ), AI safety, and model quality.
As models process increasingly massive and highly sensitive datasets, verifying machine unlearning has moved from theoretical ideal to a strict requirement, where developers must now mathematically prove privacy. However, because auditors often don’t have access to the model's internal workings or original training data, they must verify the system strictly by querying it and analyzing the output samples.
One method data scientists and researchers rely on for verification is two-sample testing , a statistical method that determines if two sets of data observations come from entirely different underlying distributions. For example, to verify unlearning, auditors might compare outputs from a model that never saw a specific record against a model that supposedly "forgot" it. If the outputs are statistically different within a defined threshold, the unlearning failed.
As models grow in size and complexity, two-sample testing and other statistical tools used for machine unlearning auditing become challenging to implement and they lose statistical power. To identify a real violation from random noise inherent in large-scale models, and with enough statistical significance, an auditor needs to extract a large number of samples. This makes real-world testing completely computationally very expensive..
To address this growing challenge, we introduce Regularized f-Divergence Kernel Tests , presented at AISTATS 2026 , a new framework designed to make auditing ML models much more sensitive, flexible, and accurate. We theoretically prove that our tests naturally control for false positives for any sample size, and that the risk of false negatives reliably converges to zero as the number of available data samples increases.
The challenge: Why standard tools fall short
Evaluating model safety often requires measuring the distance, or divergence, between two complex data sets. Different applications naturally require different notions of “distance”. While popular standard tools like maximum mean discrepancy (MMD) excel at detecting broad, global shifts across data (such as a model systematically generating brighter images than its counterpart), they often lack the necessary specificity to capture complex anomalies. For instance, if the addition of a specific person's data causes a model to generate a highly specific outlier output only when prompted in a very exact way — while having an equal distribution on all other samples — traditional MMD tests might completely overlook this local shift.
Also, most existing testing frameworks force researchers to make error-prone manual choices, such as picking the specific statistic best suited for either global or local shifts or tuning complex settings like kernel bandwidths and regularization parameters.
In a simple two-sample test between two two-dimensional distributions (above blue and red), MMD excels at detecting global shifts like differences in mean ( left ) but can miss localized differences such as outliers ( middle ) or non-smooth differences that require hyperparameter tuning such as setting a bandwidth parameter ( right ).
In addition to being hard in practice, two-sample testing as a verification method is flawed when verifying unlearning of ML models. Consider the example below showing how two models trained from scratch on the exact same data can produce different distributions. The blue distribution is the distribution of a model retrained without compromised data. However, its distribution is different from the standard (green) due to retraining with different batch sizes. This results in a false positive, indicating that the tested model is unsafe.
Using a two-sample test to verify unlearning yields false positives when the tested model has a different distribution that the standard the auditor is comparing to.
Furthermore, recent work shows that an AI model can never perfectly “forget” data just by tweaking its current settings; unless it re-traces every step of its original training, it will always leave behind a permanent footprint of the information it was supposed to delete. Accordingly, achieving perfect “ retrain equivalence ” is fundamentally impossible for standard, local unlearning algorithms and a traditional two-sample test can always find a dependence on the “forget set”.
The framework
We resolve this challenge by proposing a relative distance test that measures whether an unlearned model is distributionally closer to a safely retrained model or to the original, compromised one.
Our test acts as a highly adaptable statistical toolkit that leverages f-divergences to allow auditors to pinpoint highly specific types of data shifts, including:
Chi-squared and Kullback-Liebler (KL) divergences: These are highly effective for identifying smooth and localized differences in data, such as outliers in physical models.
Hockey-stick divergence : Specially captures definitions for privacy and unlearning, this divergence operates with a parameter that controls the degree of statistical indistinguishability. It effectively establishes an acceptable threshold, ignoring minor differences below a safety budget and only triggering an alert when a meaningful privacy breach occurs.
Calculating these divergences on high-dimensional, real-world data is notoriously difficult. To make these complex optimization problems tractable without requiring massive amounts of compute, we use kernel regularization methods to estimate the differences efficiently.
Our adaptive testing approach automatically selects the best divergence and the optimal hyperparameter configurations to maximize the reliability of the test, entirely eliminating the need for sample splitting.
Experiments
Because our proposed tests are general, we experimented across a wide variety of problems. We evaluated our framework on perturbed uniforms (synthetic two-sample benchmarks), as well as the Expo1D outlier detection task within physics datasets — a specialized area that uses ML to search for new physical phenomena outside the standard model of particle physics. We used high-energy physics data because that field requires the world’s most precise "difference detectors” — the idea being, if the framework can spot a rare particle that defies the laws of physics, it can spot a tiny privacy leak in an AI model.
We then shifted our primary focus to the critical, real-world applications of auditing differential privacy and evaluating machine unlearning:
Privacy auditing : Differential privacy provides a framework for protecting user data by introducing calibrated noise, bounding the influence of any single individual. We tested multiple non-private mechanisms by sampling their outputs across two simulated datasets that differed by only one record. If a mechanism is truly private, the two resulting samples must be indistinguishable; if it is flawed, the test should flag the privacy violation.
Machine unlearning evaluation: Instead of relying on the flawed approach of simply comparing a gold standard model (one retrained from scratch without the forgotten data) to the unlearned model, we leveraged a three-sample relative test, applying it to various established unlearning algorithms, including Selective Synaptic Dampening , pruning , and random label techniques. Our test evaluated whether the unlearned model distribution was closer to the safe gold standard model, or closer to the original, fully trained model that actively memorized the sensitive data.
Proposed framework for relative distance. If the tested model is closer to the compromised model than the retrained golden standard, the test flags an unlearning failure. If the tested model is closer to the golden standard, then the test doesn’t flag any failures.
Results
Our framework successfully recovered or outperformed all previous baseline methods with significantly less manual tuning.
The experimental results demonstrated that no single test consistently outperforms the others across every possible scenario. Instead, different f-divergences act as specialized sensors that "light up" for different types of localized data shifts. By using an aggregated approach across diverse statistics, our framework successfully caught subtle errors and anomalies that standard tests completely missed.
For privacy auditing, the hockey-stick divergence test proved to be a powerful and effective tool. Because it directly aligns with the mathematical foundations of pure differential privacy, it allows auditors to tightly control the acceptable degree of data shift. Our adaptive testing framework successfully caught privacy violations using significantly fewer data samples and requiring far less hyperparameter tuning than previous baseline testers.
Detection rate of non-private mechanisms ( from standard auditing benchmarks). Our hockey-stick based tester outperforms previously studied techniques ( DP-Auditorium ) with fewer samples.
In one notable instance, our framework detected violations in a specific sparse vector technique mechanism (SVT3) using only a few thousand samples, while previously studied techniques like DP-Auditorium required millions of samples to approximate the same violation detection rate.
Our findings also suggest a redefinition of how to evaluate machine unlearning. As shown in the table below, we observed that none of the approximate unlearning methods we evaluated were compliant with the strict, standard two-sample unlearning definition. Because two-sample tests simply look for any distributional difference, they incorrectly flagged perfectly safe, retrained models as unlearning failures.
In contrast, our proposed relative three-sample test successfully overcame this flaw. It correctly and consistently identified the safely retrained models as "safe". When evaluating the approximate unlearning algorithms, only the random label technique passed the evaluation.
Other popular methods, such as finetuning, pruning, and Selective Synaptic Dampening , were found to be ineffective at truly forgetting the targeted data. We emphasize that our primary goal in these experiments was the evaluation of the unlearning methodologies, rather than designing the algorithms themselves. Consequently, we used simplified implementations of these unlearning procedures; more rigorous setups will be required to rank unlearning methods in practical production environments.
Audit results for different (simplified) unlearning algorithms. Exact unlearning mechanisms retrain from scratch without access to forget data, and are thus safe by definition. However, two-sample tests incorrectly flag them as unsafe due to distributional differences with the “standard”. The three-sample test overcomes this issue.
Conclusion
Our newly proposed framework provides a much more precise, adaptable, and mathematically sound lens for examining ML behavior. By leveraging regularized f-Divergence kernel tests , researchers and auditors can now statistically prove whether a model is behaving unsafely or leaking data across a massive class of problems and complex distributional shifts.
As this field evolves, theoretically grounding our empirical observations to characterize exactly which specific divergence is optimal for other novel tasks remains an exciting direction for future work. Establishing tighter sample complexity bounds will also be a key focus to make these audits even more efficient.
Acknowledgements
The work described here was done jointly with Antonin Schrab and Arthur Gretton. We thank Nicole Mitchell and Eleni Triantafillou for insightful feedback, and Kimberly Schwede for the graphics and Mark Simborg for helpful edits.
Labels:
Algorithms & Theory
Responsible AI
Security, Privacy and Abuse Prevention
Quick links
Paper
Share
Copy link
Other posts of interest
May 27, 2026
Private analytics via zero-trust aggregation
Security, Privacy and Abuse Prevention
March 31, 2026
Building better AI benchmarks: How many raters are enough?
Algorithms & Theory
Machine Intelligence
March 31, 2026
Safeguarding cryptocurrency by disclosing quantum vulnerabilities responsibly
Algorithms & Theory
Quantum
Security, Privacy and Abuse Prevention
&times;

## extraction_diagnostics

- extraction_method: main
- readability_score: 97
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":12861,"paragraph_count":48,"sentence_count":75,"boilerplate_hits":0,"symbol_ratio":0,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=daily_observation, heatmap｜importance=high｜confidence=high
   Google Research 在 AISTATS 2026 发表正则化 f-散度核检验，用于高效审计 LLM 等模型的机器遗忘。该方法通过统计两样本检验判断模型是否真正"忘记"特定训练数据，避免完全重训的巨大成本。相比最大均值差异等现有工具，新框架理论上可在任意样本量下自然控制假阳性，且假阴性风险随可用样本增加可靠收敛至零，解决了大规模模型审计中计算成本过高的问题。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   play silent looping video pause silent looping video unmute video mute video New framework for auditing machine unlearning June 10, 2026 Mónica Ribero, Research Scientist, Google Research We introduce a method designed to confidently determine whether there is statistically significant evidence that two sets of data observations come from entirely different underlying distributions.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Quick links Paper Share Copy link Machine unlearning allows AI systems to "forget" specific parts of their training data without the massive cost of retraining a model from scratch.

4. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=high｜confidence=high
   This is essential for regulatory compliance (like GDPR’s "Right to be Forgotten" ), AI safety, and model quality.

5. **supporting_context**｜supports=daily_observation, heatmap｜importance=high｜confidence=high
   As models process increasingly massive and highly sensitive datasets, verifying machine unlearning has moved from theoretical ideal to a strict requirement, where developers must now mathematically prove privacy.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   However, because auditors often don’t have access to the model's internal workings or original training data, they must verify the system strictly by querying it and analyzing the output samples.

## business_elements

- companies: Google Research, Blog（网页）, Google
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 法律 / 法务, 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 计费 / 预算管理, 权限 / 安全治理
- business_actions: 暂无公开信息
- affected_departments: IT / 安全, 法务, 财务 / 预算
- numbers: 2026, 10, 2026
M, 1, 3, 27, 31, 2026
B
- quotes:  specific parts of their training data without the massive cost of retraining a model from scratch. This is essential for regulatory compliance (like GDPR’s  / distance /  retrain equivalence  / forget set / difference detectors

## evidence_seed

- company_actions: play silent looping video pause silent looping video unmute video mute video New framework for auditing machine unlearning June 10, 2026 Mónica Ribero, Research Scientist, Google Research We introduce a method designed to confidently determine whether there is statistically significant evidence that two sets of data observations come from entirely different underlying distributions. / Quick links Paper Share Copy link Machine unlearning allows AI systems to "forget" specific parts of their training data without the massive cost of retraining a model from scratch. / However, because auditors often don’t have access to the model's internal workings or original training data, they must verify the system strictly by querying it and analyzing the output samples.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: Google Research 在 AISTATS 2026 发表正则化 f-散度核检验，用于高效审计 LLM 等模型的机器遗忘。该方法通过统计两样本检验判断模型是否真正"忘记"特定训练数据，避免完全重训的巨大成本。相比最大均值差异等现有工具，新框架理论上可在任意样本量下自然控制假阳性，且假阴性风险随可用样本增加可靠收敛至零，解决了大规模模型审计中计算成本过高的问题。 / As models process increasingly massive and highly sensitive datasets, verifying machine unlearning has moved from theoretical ideal to a strict requirement, where developers must now mathematically prove privacy.

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: true
- case: false
- change: false
- trend: false
- daily_observation: false
- heatmap: false
- briefing: false
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

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: supporting_evidence
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Google Research提出审计机器遗忘新框架","discovery_summary":"Google Research 在 AISTATS 2026 发表正则化 f-散度核检验，用于高效审计 LLM 等模型的机器遗忘。该方法通过统计两样本检验判断模型是否真正\"忘记\"特定训练数据，避免完全重训的巨大成本。相比最大均值差异等现有工具，新框架理论上可在任意样本量下自然控制假阳性，且假阴性风险随可用样本增加可靠收敛至零，解决了大规模模型审计中计算成本过高的问题。","source_name":"Google Research：Blog（网页）","origin_url":"https://research.google/blog/new-framework-for-auditing-machine-unlearning","discovered_at":"2026-06-11T01:23:43.688Z","rank_on_page":106,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Google Research 在 AISTATS 2026 发表正则化 f-散度核检验，用于高效审计 LLM 等模型的机器遗忘。该方法通过统计两样本检验判断模型是否真正"忘记"特定训练数据，避免完全重训的巨大成本。相比最大均值差异等现有工具，新框架理论上可在任意样本量下自然控制假阳性，且假阴性风险随可用样本增加可靠收敛至零，解决了大规模模型审计中计算成本过高的问题。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
