---
schema_version: raw-evidence-v2
raw_id: R-050
title: "Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://mindgard.ai/blog/cursor-0day-when-full-disclosure-becomes-the-only-protection-left"
canonical_url: "https://mindgard.ai/blog/cursor-0day-when-full-disclosure-becomes-the-only-protection-left"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2025-12-15T00:00:00.000Z"
collected_at: 2026-07-15T04:28:37.887Z
language: mixed
full_text_hash: fb8796548f9dfa91
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-15/r-050-cursor-ide-0day-漏洞-打开恶意仓库即可自动执行任意代码.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-15/r-050-cursor-ide-0day-漏洞-打开恶意仓库即可自动执行任意代码.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":13062,"paragraph_count":77,"sentence_count":108,"boilerplate_hits":0,"symbol_ratio":0.0002,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 13062
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"fb8796548f9dfa91","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码","discovery_summary":"安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://mindgard.ai/blog/cursor-0day-when-full-disclosure-becomes-the-only-protection-left","discovered_at":"2026-07-15T04:20:27.091Z","rank_on_page":124,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 27ec0538f7927c7e
content_hash: fb8796548f9dfa91
semantic_hash: f02156d6e3f2c4d0
duplicate_of: ""
first_seen_at: "2025-12-15T00:00:00.000Z"
last_seen_at: 2026-07-15T04:28:37.887Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_market_structure","importance_score":5,"importance_reason":"market-structure commercial event; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context","market_shaping_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Cursor"],"products":["Cursor","cursor"],"people":[],"industries":["开发者工具","企业服务"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全"],"numbers":["0","2025","12","15","7","70","7 million","1 million"],"quotes":["C:\\Users\\aport\\AppData\\Local\\Programs\\cursor\\Cursor.exe"]}
evidence_seed: {"company_actions":["This isn't one of those cases.","This bug is simple.","A developer opens a repository in Cursor on Windows, and if that repository contains a malicious git."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":["安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。","Sometimes security research uncovers deeply technical vulnerabilities that require pages of explanation."]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"supporting_context","text":"安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"high"},{"type":"supporting_context","text":"Sometimes security research uncovers deeply technical vulnerabilities that require pages of explanation.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"high"},{"type":"company_action","text":"This isn't one of those cases.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"This bug is simple.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"A developer opens a repository in Cursor on Windows, and if that repository contains a malicious git.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"exe in the project root, Cursor will execute it automatically.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-15T04:28:37.887Z
theme: mature-commercial-signal
keyword_group: mature-commercial-signal
copyright_note: local research archive only
---

# Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码

## clean_text

Sometimes security research uncovers deeply technical vulnerabilities that require pages of explanation. This isn't one of those cases.
This bug is simple. A developer opens a repository in Cursor on Windows, and if that repository contains a malicious git.exe in the project root, Cursor will execute it automatically. There are no clicks, prompts, approval dialogs, or warnings. The result is arbitrary code execution.
Given that Cursor is one of the most widely adopted AI-assisted development environments (7 million+ active users, 1 million+ daily, 1 million+ paying, used by 50K+ companies), and its reported market price of $60 billion , it’s fair to assume that some level of respect for security practices exists, but this issue would indicate otherwise.
The vulnerability was first identified by Mindgard on December 15, 2025. We reported it the same day and multiple times since. More than six months and 197+ new versions later, the issue remains present in the latest tested version of Cursor.
The vulnerability is not theoretical and does not depend on a complex chain of exploitation, prompt injection, model manipulation, jailbreaks, memory corruption, or sophisticated attacker tradecraft. Exploitation simply requires a developer to open a project containing a git.exe binary in the repository at root.
What Cursor Users Should Do Now
Enterprise/managed windows systems: As a temporary mitigation on managed Windows systems, administrators can use AppLocker or Windows App Control policies to deny execution of the affected executable name from developer workspace directories. Prefer path-based deny rules scoped to repo/workspace roots, such as %USERPROFILE%\source\repos\*\filename.exe , rather than hash-based rules, because attacker-supplied binaries can vary by hash. Windows does not provide a general built-in rule to block an arbitrary child executable only when launched by a specific parent process, so parent-aware enforcement generally requires EDR or a custom endpoint security product.
Consumer systems: Until the IDE is patched, open untrusted repositories only in an isolated VM, Windows Sandbox, or other disposable environment. Do not rely on file hash blocklists for this issue.
A Strange Response to a Straightforward Problem
The most confusing part of this disclosure is the absence of a response from Cursor. Over the course of seven months, Mindgard repeatedly attempted to engage through every available channel. Initial disclosure was sent directly to Cursor's security reporting e-mail address, as specified in the company's published security.txt file . Follow-ups were sent when no confirmation was received. Public outreach was made in an attempt to identify an appropriate security contact.
Eventually, Cursor's CISO responded and acknowledged that an internal automation failure had prevented the expected HackerOne workflow from taking place. We were invited into the private bug bounty program and resubmitted the report.
The report was initially closed as Informative and out of scope. After we challenged that determination, HackerOne reopened the report, reproduced the issue, and confirmed that the details had been delivered to Cursor. And then everything stopped. Requests for updates went unanswered, additional follow-ups received no response, escalation through HackerOne produced no meaningful engagement, and direct outreach to Cursor leadership yielded the same result: no response.
Month after month has passed without evidence that remediation had begun, that engineering teams were actively investigating the issue, or that affected users would be informed as to the risk. Meanwhile, Cursor continued shipping releases. More than 70 versions came and went as features shipped, announcements continued, and the platform evolved. But the vulnerability remained present and repeated requests for a status update yielded no meaningful response.
At some point the conversation shifts from vulnerability disclosure to a more uncomfortable question: What exactly is the security process for?
The Bug
The technical issue itself is remarkably straightforward. When loading a project, Cursor attempts to locate Git binaries across multiple locations. One of those locations includes the workspace itself.
If an attacker planted a malicious git.exe in the repository root, Cursor will execute it automatically as part of its path resolution logic without warning, approval, or even an indication that executable content from the repository is about to run.
To demonstrate the issue safely, Mindgard used a harmless proof-of-concept: the Windows Calculator application, renamed to git.exe , placed in the root of the repository. Simply launching Cursor against that repository was enough to execute it.
The screenshot below shows the result. The multiple Calculator windows were not opened manually by the researcher. Cursor continued to re-execute the renamed binary while the project was left open, causing more instances to appear over time. In other words, this was not a one-time launch event or a user-triggered action. Cursor repeatedly invoked executable content from inside the workspace during normal operation.
A harmless proof-of-concept using Windows Calculator renamed to git.exe. Cursor repeatedly executed the binary from the repository root after the project was opened. ‍
In a real attack scenario, Calculator would simply be replaced with attacker-controlled code.
The result is arbitrary code execution under the privileges of the current user as demonstrated in the following Sysinternals process monitor logs (last verified on April 30, 2026 against Cursor version 3.2.16 on Windows.)
4:25:12.6209706 PM Cursor.exe 54880 Process Create c:\Users\aport\Documents\Audits\cursor\test_repos\git_exec0001\git.exe SUCCESS PID: 48972, Command line: git rev-parse --show-toplevel "C:\Users\aport\AppData\Local\Programs\cursor\Cursor.exe" C:\Users\aport\AppData\Local\Programs\cursor\Cursor.exe ‍
The vulnerability is almost boring in its simplicity, and that may be the most concerning part. During normal operation, Cursor executes an attacker-controlled binary from a repository with no user interaction required. The fact that such a straightforward issue can persist for months without remediation should concern every individual and organization currently deploying Cursor.
Why This Disclosure Is Different
Most coordinated disclosures follow a familiar pattern:
A vulnerability is reported.
A dialogue begins.
Severity is discussed.
Engineering teams investigate.
Fixes are developed.
Users are protected.
Public disclosure follows.
That process works because all parties share a common objective: reducing risk.
Unfortunately, this case never reached the stage of risk reduction. After seven months and no vendor engagement, it’s time to question if remediation for such a simple, high impact vulnerability will ever occur.
Security researchers understand that remediation takes time, particularly inside large and rapidly evolving software platforms. Patience becomes difficult to justify, however, when months pass without communication, updates, or visible progress. Users deserve basic protections against basic threats, and when a vendor stops communicating while continuing to distribute affected software, researchers eventually face an uncomfortable decision:
Remain silent and allow users to operate under a false assumption of safety.
Or, disclose the issue publicly so organizations can make informed risk decisions.
We believe users deserve the information. Full disclosure is the nuclear option of vulnerability disclosure, reserved for situations where every other path has failed. It exists for a reason: when vendors stop communicating, users should not be left in the dark.
What Happens When Innovation Stops Listening?
The most obvious question is also the simplest: Why hasn't this been fixed?
The vulnerability is neither subtle nor difficult to reproduce, has a straightforward execution path and critical impact. The lackluster response from Cursor leads to much broader questions:
Are modern bug bounty programs becoming overloaded?
Are bug bounty programs overloaded due to increasingly competent models, such as Mythos?
Is Cursor preoccupied with their SpaceX acquisition and de-prioritizing user safety?
Is user safety of any concern when billions of dollars are at stake?
The security industry has spent years encouraging researchers to use coordinated disclosure channels. Those channels depend on responsive triage processes and vendors having the capacity to evaluate and act on incoming reports. However as AI products proliferate, the volume of security findings is increasing dramatically. Many of those findings are novel and do not fit neatly into traditional vulnerability categories. At the same time, the triage processes we have relied on for nearly two decades are rapidly failing as the core assumptions they are built upon crumble under the emerging world of AI.
If disclosure pipelines are becoming overwhelmed, the industry should say so. Researchers, customers, and users deserve transparency.
Sadly, that may not be the case as uncomfortable questions of priority grow. Like many others, Cursor has been at the center of enormous growth, investment, and industry attention. The company is expanding rapidly, yet from the outside it is difficult to reconcile that growth with the absence of visible progress on a straightforward arbitrary code execution vulnerability.
Rapid growth introduces a responsibility to address security failures while also requiring the treatment of users as valuable customers, not buying experiments. They are trusting production software with access to source code, credentials, proprietary intellectual property, and increasingly, autonomous capabilities.
Trust requires accountability, and accountability requires communication. When users, researchers, and disclosure platforms spend months seeking basic status updates without success, that accountability becomes difficult to see or believe in.
The Bigger Problem
This disclosure goes beyond a single executable named git.exe to the place of trust in software. AI companies routinely ask users to grant unprecedented levels of access to code, repositories, terminals, secrets, and workflows that increasingly blur the line between suggestion and action.
The industry narrative is that these systems deserve trust because they increase productivity, but history has taught us time and again that trust should not be granted because something is useful. It should be earned through behavior. That behavior is reflected in how a company responds to security reports, communicates with affected users, and prioritizes remediation.
When straightforward vulnerabilities remain unresolved for months without meaningful communication, users are forced to reevaluate assumptions about that trust.
Why We Are Going Full Disclosure
Like many security research teams, Mindgard prefers coordinated disclosure. The goal is always security first, publicity second.
But coordinated disclosure only works when there is coordination. Seven months after initial disclosure, we have no indication that users are being protected, that remediation is underway, or that affected organizations have been informed. And at this point, withholding information no longer serves users, it serves silence.
For that reason, Mindgard is releasing full details of this vulnerability. Organizations using Cursor deserve the opportunity to evaluate their exposure, implement compensating controls, and make informed decisions about their security posture.
User safety must come first, even when disclosure becomes uncomfortable.
Especially when disclosure becomes uncomfortable.
Timeline
Date
Action
Dec 15, 2025
Vulnerability discovered by Mindgard
Dec 15, 2025
Vulnerability reported to security-reports@cursor.com
Dec 18, 2025
Follow-up requesting confirmation of receipt
Jan 13, 2026
Mindgard created a LinkedIn post requesting a contact at Cursor to assist. Cursor CISO is mentioned by a user in the comments.
Jan 15, 2026
Cursor CISO responds to the e-mail thread indicating an automation failed that was supposed to invite to the HackerOne private bounty program. CISO manually invites Mindgard to the bounty program.
Jan 15, 2026
Vulnerability submitted through HackerOne
Jan 16, 2026
Report initially closed as Informative and out of scope
Jan 16, 2026
Mindgard challenges determination
Jan 16, 2026
Report reopened after successful reproduction
Jan 20, 2026
HackerOne confirms delivery to Cursor
Feb 16, 2026
Update requested, no response received
Mar 3, 2026
Update requested, no response received
Mar 17, 2026
Direct outreach to Cursor CISO requesting update
Mar 18, 2026
HackerOne indicates Cursor has been contacted
Apr 1, 2026
Update requested, no response received
Apr 1, 2026
HackerOne confirms no update from Cursor
Jun 1, 2026
Mindgard informs HackerOne of intent to disclose publicly
Jun 3, 2026
HackerOne provides disclosure guidance
Jul 14 2026
This blog post published.

## full_text

Sometimes security research uncovers deeply technical vulnerabilities that require pages of explanation. This isn't one of those cases.
This bug is simple. A developer opens a repository in Cursor on Windows, and if that repository contains a malicious git.exe in the project root, Cursor will execute it automatically. There are no clicks, prompts, approval dialogs, or warnings. The result is arbitrary code execution.
Given that Cursor is one of the most widely adopted AI-assisted development environments (7 million+ active users, 1 million+ daily, 1 million+ paying, used by 50K+ companies), and its reported market price of $60 billion , it’s fair to assume that some level of respect for security practices exists, but this issue would indicate otherwise.
The vulnerability was first identified by Mindgard on December 15, 2025. We reported it the same day and multiple times since. More than six months and 197+ new versions later, the issue remains present in the latest tested version of Cursor.
The vulnerability is not theoretical and does not depend on a complex chain of exploitation, prompt injection, model manipulation, jailbreaks, memory corruption, or sophisticated attacker tradecraft. Exploitation simply requires a developer to open a project containing a git.exe binary in the repository at root.
What Cursor Users Should Do Now
Enterprise/managed windows systems: As a temporary mitigation on managed Windows systems, administrators can use AppLocker or Windows App Control policies to deny execution of the affected executable name from developer workspace directories. Prefer path-based deny rules scoped to repo/workspace roots, such as %USERPROFILE%\source\repos\*\filename.exe , rather than hash-based rules, because attacker-supplied binaries can vary by hash. Windows does not provide a general built-in rule to block an arbitrary child executable only when launched by a specific parent process, so parent-aware enforcement generally requires EDR or a custom endpoint security product.
Consumer systems: Until the IDE is patched, open untrusted repositories only in an isolated VM, Windows Sandbox, or other disposable environment. Do not rely on file hash blocklists for this issue.
A Strange Response to a Straightforward Problem
The most confusing part of this disclosure is the absence of a response from Cursor. Over the course of seven months, Mindgard repeatedly attempted to engage through every available channel. Initial disclosure was sent directly to Cursor's security reporting e-mail address, as specified in the company's published security.txt file . Follow-ups were sent when no confirmation was received. Public outreach was made in an attempt to identify an appropriate security contact.
Eventually, Cursor's CISO responded and acknowledged that an internal automation failure had prevented the expected HackerOne workflow from taking place. We were invited into the private bug bounty program and resubmitted the report.
The report was initially closed as Informative and out of scope. After we challenged that determination, HackerOne reopened the report, reproduced the issue, and confirmed that the details had been delivered to Cursor. And then everything stopped. Requests for updates went unanswered, additional follow-ups received no response, escalation through HackerOne produced no meaningful engagement, and direct outreach to Cursor leadership yielded the same result: no response.
Month after month has passed without evidence that remediation had begun, that engineering teams were actively investigating the issue, or that affected users would be informed as to the risk. Meanwhile, Cursor continued shipping releases. More than 70 versions came and went as features shipped, announcements continued, and the platform evolved. But the vulnerability remained present and repeated requests for a status update yielded no meaningful response.
At some point the conversation shifts from vulnerability disclosure to a more uncomfortable question: What exactly is the security process for?
The Bug
The technical issue itself is remarkably straightforward. When loading a project, Cursor attempts to locate Git binaries across multiple locations. One of those locations includes the workspace itself.
If an attacker planted a malicious git.exe in the repository root, Cursor will execute it automatically as part of its path resolution logic without warning, approval, or even an indication that executable content from the repository is about to run.
To demonstrate the issue safely, Mindgard used a harmless proof-of-concept: the Windows Calculator application, renamed to git.exe , placed in the root of the repository. Simply launching Cursor against that repository was enough to execute it.
The screenshot below shows the result. The multiple Calculator windows were not opened manually by the researcher. Cursor continued to re-execute the renamed binary while the project was left open, causing more instances to appear over time. In other words, this was not a one-time launch event or a user-triggered action. Cursor repeatedly invoked executable content from inside the workspace during normal operation.
A harmless proof-of-concept using Windows Calculator renamed to git.exe. Cursor repeatedly executed the binary from the repository root after the project was opened. ‍
In a real attack scenario, Calculator would simply be replaced with attacker-controlled code.
The result is arbitrary code execution under the privileges of the current user as demonstrated in the following Sysinternals process monitor logs (last verified on April 30, 2026 against Cursor version 3.2.16 on Windows.)
4:25:12.6209706 PM Cursor.exe 54880 Process Create c:\Users\aport\Documents\Audits\cursor\test_repos\git_exec0001\git.exe SUCCESS PID: 48972, Command line: git rev-parse --show-toplevel "C:\Users\aport\AppData\Local\Programs\cursor\Cursor.exe" C:\Users\aport\AppData\Local\Programs\cursor\Cursor.exe ‍
The vulnerability is almost boring in its simplicity, and that may be the most concerning part. During normal operation, Cursor executes an attacker-controlled binary from a repository with no user interaction required. The fact that such a straightforward issue can persist for months without remediation should concern every individual and organization currently deploying Cursor.
Why This Disclosure Is Different
Most coordinated disclosures follow a familiar pattern:
A vulnerability is reported.
A dialogue begins.
Severity is discussed.
Engineering teams investigate.
Fixes are developed.
Users are protected.
Public disclosure follows.
That process works because all parties share a common objective: reducing risk.
Unfortunately, this case never reached the stage of risk reduction. After seven months and no vendor engagement, it’s time to question if remediation for such a simple, high impact vulnerability will ever occur.
Security researchers understand that remediation takes time, particularly inside large and rapidly evolving software platforms. Patience becomes difficult to justify, however, when months pass without communication, updates, or visible progress. Users deserve basic protections against basic threats, and when a vendor stops communicating while continuing to distribute affected software, researchers eventually face an uncomfortable decision:
Remain silent and allow users to operate under a false assumption of safety.
Or, disclose the issue publicly so organizations can make informed risk decisions.
We believe users deserve the information. Full disclosure is the nuclear option of vulnerability disclosure, reserved for situations where every other path has failed. It exists for a reason: when vendors stop communicating, users should not be left in the dark.
What Happens When Innovation Stops Listening?
The most obvious question is also the simplest: Why hasn't this been fixed?
The vulnerability is neither subtle nor difficult to reproduce, has a straightforward execution path and critical impact. The lackluster response from Cursor leads to much broader questions:
Are modern bug bounty programs becoming overloaded?
Are bug bounty programs overloaded due to increasingly competent models, such as Mythos?
Is Cursor preoccupied with their SpaceX acquisition and de-prioritizing user safety?
Is user safety of any concern when billions of dollars are at stake?
The security industry has spent years encouraging researchers to use coordinated disclosure channels. Those channels depend on responsive triage processes and vendors having the capacity to evaluate and act on incoming reports. However as AI products proliferate, the volume of security findings is increasing dramatically. Many of those findings are novel and do not fit neatly into traditional vulnerability categories. At the same time, the triage processes we have relied on for nearly two decades are rapidly failing as the core assumptions they are built upon crumble under the emerging world of AI.
If disclosure pipelines are becoming overwhelmed, the industry should say so. Researchers, customers, and users deserve transparency.
Sadly, that may not be the case as uncomfortable questions of priority grow. Like many others, Cursor has been at the center of enormous growth, investment, and industry attention. The company is expanding rapidly, yet from the outside it is difficult to reconcile that growth with the absence of visible progress on a straightforward arbitrary code execution vulnerability.
Rapid growth introduces a responsibility to address security failures while also requiring the treatment of users as valuable customers, not buying experiments. They are trusting production software with access to source code, credentials, proprietary intellectual property, and increasingly, autonomous capabilities.
Trust requires accountability, and accountability requires communication. When users, researchers, and disclosure platforms spend months seeking basic status updates without success, that accountability becomes difficult to see or believe in.
The Bigger Problem
This disclosure goes beyond a single executable named git.exe to the place of trust in software. AI companies routinely ask users to grant unprecedented levels of access to code, repositories, terminals, secrets, and workflows that increasingly blur the line between suggestion and action.
The industry narrative is that these systems deserve trust because they increase productivity, but history has taught us time and again that trust should not be granted because something is useful. It should be earned through behavior. That behavior is reflected in how a company responds to security reports, communicates with affected users, and prioritizes remediation.
When straightforward vulnerabilities remain unresolved for months without meaningful communication, users are forced to reevaluate assumptions about that trust.
Why We Are Going Full Disclosure
Like many security research teams, Mindgard prefers coordinated disclosure. The goal is always security first, publicity second.
But coordinated disclosure only works when there is coordination. Seven months after initial disclosure, we have no indication that users are being protected, that remediation is underway, or that affected organizations have been informed. And at this point, withholding information no longer serves users, it serves silence.
For that reason, Mindgard is releasing full details of this vulnerability. Organizations using Cursor deserve the opportunity to evaluate their exposure, implement compensating controls, and make informed decisions about their security posture.
User safety must come first, even when disclosure becomes uncomfortable.
Especially when disclosure becomes uncomfortable.
Timeline
Date
Action
Dec 15, 2025
Vulnerability discovered by Mindgard
Dec 15, 2025
Vulnerability reported to security-reports@cursor.com
Dec 18, 2025
Follow-up requesting confirmation of receipt
Jan 13, 2026
Mindgard created a LinkedIn post requesting a contact at Cursor to assist. Cursor CISO is mentioned by a user in the comments.
Jan 15, 2026
Cursor CISO responds to the e-mail thread indicating an automation failed that was supposed to invite to the HackerOne private bounty program. CISO manually invites Mindgard to the bounty program.
Jan 15, 2026
Vulnerability submitted through HackerOne
Jan 16, 2026
Report initially closed as Informative and out of scope
Jan 16, 2026
Mindgard challenges determination
Jan 16, 2026
Report reopened after successful reproduction
Jan 20, 2026
HackerOne confirms delivery to Cursor
Feb 16, 2026
Update requested, no response received
Mar 3, 2026
Update requested, no response received
Mar 17, 2026
Direct outreach to Cursor CISO requesting update
Mar 18, 2026
HackerOne indicates Cursor has been contacted
Apr 1, 2026
Update requested, no response received
Apr 1, 2026
HackerOne confirms no update from Cursor
Jun 1, 2026
Mindgard informs HackerOne of intent to disclose publicly
Jun 3, 2026
HackerOne provides disclosure guidance
Jul 14 2026
This blog post published.

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 97
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":13062,"paragraph_count":77,"sentence_count":108,"boilerplate_hits":0,"symbol_ratio":0.0002,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=high
   安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。

2. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=high
   Sometimes security research uncovers deeply technical vulnerabilities that require pages of explanation.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   This isn't one of those cases.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   This bug is simple.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   A developer opens a repository in Cursor on Windows, and if that repository contains a malicious git.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   exe in the project root, Cursor will execute it automatically.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Cursor
- products: Cursor, cursor
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全
- numbers: 0, 2025, 12, 15, 7, 70, 7 million, 1 million
- quotes: C:\Users\aport\AppData\Local\Programs\cursor\Cursor.exe

## evidence_seed

- company_actions: This isn't one of those cases. / This bug is simple. / A developer opens a repository in Cursor on Windows, and if that repository contains a malicious git.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。 / Sometimes security research uncovers deeply technical vulnerabilities that require pages of explanation.

## guanlan_scores

- importance_type: important_market_structure
- importance_score: 5
- importance_reason: market-structure commercial event; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,commercial_or_risk_context,market_shaping_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- watchlist

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码","discovery_summary":"安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://mindgard.ai/blog/cursor-0day-when-full-disclosure-becomes-the-only-protection-left","discovered_at":"2026-07-15T04:20:27.091Z","rank_on_page":124,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
