---
schema_version: raw-evidence-v2
raw_id: R-052
title: "Windows 0-day drops the same day Microsoft releases record number of patches"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://arstechnica.com/security/2026/07/windows-0-day-drops-the-same-day-microsoft-releases-record-number-of-patches/"
canonical_url: "https://arstechnica.com/security/2026/07/windows-0-day-drops-the-same-day-microsoft-releases-record-number-of-patches"
source_name: "Ars Technica AI"
source_type: media
source_level: A
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
published_at: "2026-07-15T19:59:48.000Z"
collected_at: 2026-07-16T02:39:33.748Z
language: mixed
full_text_hash: a89d1cdb46b87691
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-16/r-052-windows-0-day-drops-the-same-day-microsoft-releases-record-number-of-p.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-16/r-052-windows-0-day-drops-the-same-day-microsoft-releases-record-number-of-p.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":4059,"paragraph_count":19,"sentence_count":32,"boilerplate_hits":2,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 4059
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"a89d1cdb46b87691","missing":[]}
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
url_hash: fc3d86ae249fbde8
content_hash: a89d1cdb46b87691
semantic_hash: ae038523eb16f6d0
duplicate_of: ""
first_seen_at: "2026-07-15T19:59:48.000Z"
last_seen_at: 2026-07-16T02:39:33.748Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"business_change":true,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"supporting_signal","importance_score":2,"importance_reason":"consumer entertainment or minor platform policy feature; AI-adjacent but not a core business signal","supporting_signals":["low_value_ai_adjacent_context"],"novelty":2,"evidence_strength":4,"case_richness":5,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Ars Technica AI","Microsoft"],"products":[],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["0","82","23","1","2","3","838","4"],"quotes":["powerful primitive","pretty powerful primitive","If I can set up the system so that it runs my code when the admin user logs in,","I don’t need to be an admin myself.","too much uncertainty"]}
evidence_seed: {"company_actions":["The exploit, which multiple researchers say works , is sending Microsoft scrambling, yet again, to patch a zero-day released by an anonymous researcher who has complained about the software maker’s handling of their bug reports.","To date, the pseudonymous NightmareEclypse has published nine such exploits, including Tuesday’s HiveLegacy ."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":["Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Right on the heels of Microsoft releasing a record number of security patches, a researcher has published exploit code that can enable low-privilege Windows accounts to make sensitive changes to administrator accounts."]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"quote","text":"HiveLegacy is a \"powerful primitive\" that's likely capable of other nefarious actions.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"high","confidence":"high"},{"type":"supporting_context","text":"Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Right on the heels of Microsoft releasing a record number of security patches, a researcher has published exploit code that can enable low-privilege Windows accounts to make sensitive changes to administrator accounts.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"high"},{"type":"product_update","text":"The exploit, which multiple researchers say works , is sending Microsoft scrambling, yet again, to patch a zero-day released by an anonymous researcher who has complained about the software maker’s handling of their bug reports.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"To date, the pseudonymous NightmareEclypse has published nine such exploits, including Tuesday’s HiveLegacy .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"opinion","text":"The researcher said the proof-of-concept code included in the report was stripped down to prevent attackers from using it maliciously.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"high","confidence":"high"},{"type":"quote","text":"A “pretty powerful primitive” HiveLegacy is an elevation-of-privilege exploit that targets a vulnerability residing in the Windows User Profile Service.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-16T02:39:33.748Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# Windows 0-day drops the same day Microsoft releases record number of patches

## clean_text

Skip to content
Text
settings
Story text
Size
Small
Standard
Large
Width
Standard
Wide
Links
Standard
Orange
* Subscribers only
Learn more
Minimize to nav
Right on the heels of Microsoft releasing a record number of security patches, a researcher has published exploit code that can enable low-privilege Windows accounts to make sensitive changes to administrator accounts.
The exploit, which multiple researchers say works , is sending Microsoft scrambling, yet again, to patch a zero-day released by an anonymous researcher who has complained about the software maker’s handling of their bug reports. To date, the pseudonymous NightmareEclypse has published nine such exploits, including Tuesday’s HiveLegacy . The researcher said the proof-of-concept code included in the report was stripped down to prevent attackers from using it maliciously.
A “pretty powerful primitive”
HiveLegacy is an elevation-of-privilege exploit that targets a vulnerability residing in the Windows User Profile Service. It allows users (and with more work likely processes) with limited system rights to compromise an admin user’s account by modifying its classes registry hive , a resource that ensures the correct application opens when certain types of files are clicked on in Windows Explorer.
At a minimum, that means the attacker can modify the Windows registry associated with an administrator account. As written, the exploit requires the attacker to know another user’s credentials. The account need not be admin. An attacker must also know the username of a third account, also with or without admin status, on the machine.
“If I can set up the system so that it runs my code when the admin user logs in,” the attacker has de facto administrator privileges, Will Dormann, a senior principal vulnerability analyst at Tharros Labs, said in an interview. “I don’t need to be an admin myself.”
In a post , he said that “the ability of a non-admin user to be able to modify the classes registry hive of an admin user is a pretty powerful primitive. Clever attackers or people who want to accomplish something will easily be able to figure out how to do things that are more interesting and/or don’t even require user interaction.”
Dormann said that the exploit could possibly be chained to a separate one that gives direct access to an administrative account.
As explained in a post by a different analyst: “When a new user is logging on, Windows needs to load the user’s class hive. Since the user isn’t logged on before logging on (tautology, I know), it can’t be loaded in the context of the user. So it is loaded in the context of NT AUTHORITY\SYSTEM. LegacyHive abuses this.”
In an emailed statement, Microsoft said it’s aware of the vulnerability report and is investigating. The company also noted its preference that vulnerability reporters follow a coordinated disclosure policy.
For now, Windows users who want to protect their systems against HiveLegacy can run a detection script published by independent researcher Kevin Beaumont. Other defenses are to restrict local non-user account creation, monitor ProfSvc for unexpected hive loads, and track NTUSER.DAT/UsrClass.dat activity.
Dan Goodin
Senior Security Editor
Dan Goodin
Senior Security Editor
Dan Goodin is Senior Security Editor at Ars Technica, where he oversees coverage of malware, computer espionage, botnets, hardware hacking, encryption, and passwords. In his spare time, he enjoys gardening, cooking, and following the independent music scene. Dan is based in San Francisco. Follow him at here on Mastodon and here on Bluesky. Contact him on Signal at DanArs.82.
23 Comments
Comments
Forum view
Loading comments...
Prev story
Next story
1.
Microsoft’s Secure Boot has been broken for a decade and no one noticed until now
2.
How hard is it to build orbital data centers, actually?
3.
Sheetz moves 838 stores off VMware: Broadcom created “too much uncertainty"
4.
A most improbable astronaut just went to space
5.
Probe into explosive diarrheal cases points to Taco Bell and bad lettuce
Customize

## full_text

Skip to content
Text
settings
Story text
Size
Small
Standard
Large
Width
Standard
Wide
Links
Standard
Orange
* Subscribers only
Learn more
Minimize to nav
Right on the heels of Microsoft releasing a record number of security patches, a researcher has published exploit code that can enable low-privilege Windows accounts to make sensitive changes to administrator accounts.
The exploit, which multiple researchers say works , is sending Microsoft scrambling, yet again, to patch a zero-day released by an anonymous researcher who has complained about the software maker’s handling of their bug reports. To date, the pseudonymous NightmareEclypse has published nine such exploits, including Tuesday’s HiveLegacy . The researcher said the proof-of-concept code included in the report was stripped down to prevent attackers from using it maliciously.
A “pretty powerful primitive”
HiveLegacy is an elevation-of-privilege exploit that targets a vulnerability residing in the Windows User Profile Service. It allows users (and with more work likely processes) with limited system rights to compromise an admin user’s account by modifying its classes registry hive , a resource that ensures the correct application opens when certain types of files are clicked on in Windows Explorer.
At a minimum, that means the attacker can modify the Windows registry associated with an administrator account. As written, the exploit requires the attacker to know another user’s credentials. The account need not be admin. An attacker must also know the username of a third account, also with or without admin status, on the machine.
“If I can set up the system so that it runs my code when the admin user logs in,” the attacker has de facto administrator privileges, Will Dormann, a senior principal vulnerability analyst at Tharros Labs, said in an interview. “I don’t need to be an admin myself.”
In a post , he said that “the ability of a non-admin user to be able to modify the classes registry hive of an admin user is a pretty powerful primitive. Clever attackers or people who want to accomplish something will easily be able to figure out how to do things that are more interesting and/or don’t even require user interaction.”
Dormann said that the exploit could possibly be chained to a separate one that gives direct access to an administrative account.
As explained in a post by a different analyst: “When a new user is logging on, Windows needs to load the user’s class hive. Since the user isn’t logged on before logging on (tautology, I know), it can’t be loaded in the context of the user. So it is loaded in the context of NT AUTHORITY\SYSTEM. LegacyHive abuses this.”
In an emailed statement, Microsoft said it’s aware of the vulnerability report and is investigating. The company also noted its preference that vulnerability reporters follow a coordinated disclosure policy.
For now, Windows users who want to protect their systems against HiveLegacy can run a detection script published by independent researcher Kevin Beaumont. Other defenses are to restrict local non-user account creation, monitor ProfSvc for unexpected hive loads, and track NTUSER.DAT/UsrClass.dat activity.
Dan Goodin
Senior Security Editor
Dan Goodin
Senior Security Editor
Dan Goodin is Senior Security Editor at Ars Technica, where he oversees coverage of malware, computer espionage, botnets, hardware hacking, encryption, and passwords. In his spare time, he enjoys gardening, cooking, and following the independent music scene. Dan is based in San Francisco. Follow him at here on Mastodon and here on Bluesky. Contact him on Signal at DanArs.82.
23 Comments
Comments
Forum view
Loading comments...
Prev story
Next story
1.
Microsoft’s Secure Boot has been broken for a decade and no one noticed until now
2.
How hard is it to build orbital data centers, actually?
3.
Sheetz moves 838 stores off VMware: Broadcom created “too much uncertainty"
4.
A most improbable astronaut just went to space
5.
Probe into explosive diarrheal cases points to Taco Bell and bad lettuce
Customize

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 91
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":4059,"paragraph_count":19,"sentence_count":32,"boilerplate_hits":2,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=high｜confidence=high
   HiveLegacy is a "powerful primitive" that's likely capable of other nefarious actions.

2. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=high
   Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Right on the heels of Microsoft releasing a record number of security patches, a researcher has published exploit code that can enable low-privilege Windows accounts to make sensitive changes to administrator accounts.

3. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=high
   The exploit, which multiple researchers say works , is sending Microsoft scrambling, yet again, to patch a zero-day released by an anonymous researcher who has complained about the software maker’s handling of their bug reports.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   To date, the pseudonymous NightmareEclypse has published nine such exploits, including Tuesday’s HiveLegacy .

5. **opinion**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=high｜confidence=high
   The researcher said the proof-of-concept code included in the report was stripped down to prevent attackers from using it maliciously.

6. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=high｜confidence=high
   A “pretty powerful primitive” HiveLegacy is an elevation-of-privilege exploit that targets a vulnerability residing in the Windows User Profile Service.

## business_elements

- companies: Ars Technica AI, Microsoft
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 0, 82, 23, 1, 2, 3, 838, 4
- quotes: powerful primitive / pretty powerful primitive / If I can set up the system so that it runs my code when the admin user logs in, / I don’t need to be an admin myself. / too much uncertainty

## evidence_seed

- company_actions: The exploit, which multiple researchers say works , is sending Microsoft scrambling, yet again, to patch a zero-day released by an anonymous researcher who has complained about the software maker’s handling of their bug reports. / To date, the pseudonymous NightmareEclypse has published nine such exploits, including Tuesday’s HiveLegacy .
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Right on the heels of Microsoft releasing a record number of security patches, a researcher has published exploit code that can enable low-privilege Windows accounts to make sensitive changes to administrator accounts.

## guanlan_scores

- importance_type: supporting_signal
- importance_score: 2
- importance_reason: consumer entertainment or minor platform policy feature; AI-adjacent but not a core business signal
- supporting_signals: low_value_ai_adjacent_context
- novelty: 2
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 2
- guanlan_relevance: 2
- emerging_signal_score: 3

## usable_for

- viewpoint: true
- case: true
- business_change: true
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- watchlist

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

HiveLegacy is a "powerful primitive" that's likely capable of other nefarious actions.

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
