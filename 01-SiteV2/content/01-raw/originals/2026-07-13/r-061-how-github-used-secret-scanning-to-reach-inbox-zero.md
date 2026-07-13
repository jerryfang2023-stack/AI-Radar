---
schema_version: raw-evidence-v2
raw_id: R-061
title: "How GitHub used secret scanning to reach inbox zero"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://github.blog/security/application-security/how-github-used-secret-scanning-to-reach-inbox-zero/"
canonical_url: "https://github.blog/security/application-security/how-github-used-secret-scanning-to-reach-inbox-zero"
source_name: "GitHub Blog AI"
source_type: developer
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: case_or_customer
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
published_at: "2026-07-02T16:00:00.000Z"
collected_at: 2026-07-13T07:40:19.127Z
language: mixed
full_text_hash: a62d7d248c11ddfa
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-13/r-061-how-github-used-secret-scanning-to-reach-inbox-zero.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-13/r-061-how-github-used-secret-scanning-to-reach-inbox-zero.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":13039,"paragraph_count":79,"sentence_count":110,"boilerplate_hits":0,"symbol_ratio":0.0012,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 13039
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"a62d7d248c11ddfa","missing":[]}
source_volatility: medium
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
url_hash: d082b0bc4e8bc011
content_hash: a62d7d248c11ddfa
semantic_hash: 5170d13b2174be9b
duplicate_of: ""
first_seen_at: "2026-07-02T16:00:00.000Z"
last_seen_at: 2026-07-13T07:40:19.127Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool","emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_case","importance_score":5,"importance_reason":"real customer or adoption case; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","market_shaping_risk_context","adoption_context"],"novelty":2,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["GitHub Blog AI","GitHub"],"products":[],"people":[],"industries":["法律 / 法务","医疗","开发者工具","企业服务"],"roles":["开发者 / 工程团队","法务 / 律师","销售 / 客服"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出","合作 / 联盟"],"affected_departments":["IT / 安全","法务","销售 / 客服"],"numbers":["20","000","15","2","2026","9","9 m","2008"],"quotes":["$(\ncurl -sS -w '\\n%{http_code}' \\\n-H ","Accept: application/vnd.github+json","X-GitHub-Api-Version: 2022-11-28","\nstatus=","${response%$'\\n'*}"]}
evidence_seed: {"company_actions":["That&rsquo;s when we found more than 20,000 secrets spread across our 15,000+ repositories.","Nine months later, we reached zero open alerts."],"case_details":["As part of that effort, we piloted the Secret Scanning capability that was under development at the time."],"workflow_changes":["GitHub had 20,000+ secret scanning alerts across 15,000 repositories. Here's how we separated signal from noise, built remediation workflows, and reached inbox zero in nine months. The post How GitHub used secret scanning to reach inbox zero appeared first on The GitHub Blog. ]]>"],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队","法务 / 律师","销售 / 客服"],"risks_or_constraints":["Michael Recachinas · @mrecachinas July 2, 2026 Updated July 9, 2026 9 minutes Share: Several years ago, GitHub Security launched an initiative to assess and improve our overall secrets hygiene.","The number was significantly higher than we anticipated, but it quickly became clear that success would depend on identifying which alerts represented real risk, assigning ownership, and remediating them safely."]}
missing_information: []
key_excerpts: [{"type":"workflow_change","text":"GitHub had 20,000+ secret scanning alerts across 15,000 repositories. Here's how we separated signal from noise, built remediation workflows, and reached inbox zero in nine months. The post How GitHub used secret scanning to reach inbox zero appeared first on The GitHub Blog. ]]>","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"supporting_context","text":"Michael Recachinas · @mrecachinas July 2, 2026 Updated July 9, 2026 9 minutes Share: Several years ago, GitHub Security launched an initiative to assess and improve our overall secrets hygiene.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"case_detail","text":"As part of that effort, we piloted the Secret Scanning capability that was under development at the time.","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"That&rsquo;s when we found more than 20,000 secrets spread across our 15,000+ repositories.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"supporting_context","text":"The number was significantly higher than we anticipated, but it quickly became clear that success would depend on identifying which alerts represented real risk, assigning ownership, and remediating them safely.","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Nine months later, we reached zero open alerts.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-13T07:40:19.127Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# How GitHub used secret scanning to reach inbox zero

## clean_text

Michael Recachinas · @mrecachinas
July 2, 2026
Updated July 9, 2026
9 minutes
Share:
Several years ago, GitHub Security launched an initiative to assess and improve our overall secrets hygiene. As part of that effort, we piloted the Secret Scanning capability that was under development at the time. That&rsquo;s when we found more than 20,000 secrets spread across our 15,000+ repositories.
The number was significantly higher than we anticipated, but it quickly became clear that success would depend on identifying which alerts represented real risk, assigning ownership, and remediating them safely. Nine months later, we reached zero open alerts.
New secret scanning customers often ask us: &ldquo;How do you manage this internally? How did you actually clean up your existing secrets?&rdquo;
Like many long-running software companies, GitHub&rsquo;s approach to secrets management evolved over time. GitHub was founded in 2008, before today&rsquo;s centralized vaults, automated secret scanning, and dedicated secrets-management platforms were common across the industry. As engineering practices matured and GitHub grew, we continued investing in stronger controls, better tooling, and systematic risk reduction for legacy patterns. This work reflects our ongoing commitment to improving security, reducing exposure, and ensuring our internal practices meet the same high standards we expect across the industry.
This blog post shares what worked for us during this effort, and highlights strategies you can apply to better protect your own secrets.
Cutting out the noise
The first thing we discovered was that the alert count was a bit misleading&mdash;i.e., 20,000 alerts did not mean 20,000 equally risky problems.
When we dug into the data, we discovered that just five repositories accounted for roughly 18,000 of those alerts, and every one of those secrets was inactive: test fixtures, deactivated credentials, and fake-but-valid-looking secrets used for testing. (We build secret scanning, so naturally we have repositories full of legitimate-looking secrets in tests.)
That left over 2,000 alerts that needed attention: potential live credentials and thousands of decisions about risk, rotation, and remediation.
Secrets don&rsquo;t just live in code
Secret remediation touched more than source code. We found secrets in support tickets (customers occasionally include tokens), bug bounty reports (researchers disclose what they found with complete reproductions, including API requests with tokens used), incident notes, and wiki pages.
We partnered with customer support, security incident response, and our bug bounty program to develop shared playbooks. Across all these workflows, we had to ensure we weren&rsquo;t creating new problems, like opening issues or pushing commits containing the very secrets we were trying to remediate.
Our phased approach
We were not going to close 20,000 alerts by asking a few security engineers to grind through them one by one. We treated it like any other operational backlog: stop new debt, then work down what already exists with a workflow that&rsquo;s repeatable, measurable, and not dependent on one person&rsquo;s institutional knowledge.
Phase 1: Enable everywhere, stop the accumulation
Before cleaning up existing secrets, we had to stop new ones from piling up.
We enabled secret scanning and push protection across all of our enterprises and organizations. Thanks to GitHub Advanced Security&rsquo;s organization-level settings, this wasn&rsquo;t a repository-by-repository slog across 15,000 repositories. We enforced the setting so individual repositories and teams could not quietly opt out.
Push protection blocked new secrets at the source. That kept the backlog from growing faster than we could burn it down.
Phase 2: Understand and triage
We broke down the 20,000+ alerts by repository, secret type, and age so we could separate noise from work.
When we dug in, we discovered that just five repositories accounted for roughly 18,000 of those alerts, and every one of those secrets was inactive: test fixtures, deactivated credentials, and fake-but-valid-looking secrets used for testing. (We build secret scanning, so naturally we have repositories full of legitimate-looking secrets in tests.)
For high-volume, low-risk alerts, we developed criteria for bulk closure. If a secret was in a dedicated test repository, had never been active, and matched a known test pattern, we could confidently mark it resolved. In a matter of days, we closed out roughly 18,000 alerts.
The hard questions
We had to make strategic decisions about how to remediate secrets. When a secret lives in an issue, do you edit the body (and potentially remove revision history), or preserve the audit trail? When a secret is committed to a repository, do you rewrite git history? Anyone who&rsquo;s tried rewriting git history at scale knows what happens next: force-pushes break open pull requests, invalidate commit SHAs, and generally interrupt developers.
A common question was: &ldquo;Can we just delete the repository if it&rsquo;s no longer in use?&rdquo; Our answer was generally no. A deleted repository takes its audit trail with it. If a secret in that repository was ever leaked or the repository was ever compromised, you lose the forensic record you&rsquo;d need during incident response. Rotate the secret, archive the repository if appropriate, but keep the history.
Whenever possible, we rotate or revoke the exposed secret first. The harder question is whether the residual risk warrants rewriting git history, or whether a revoked secret in history can safely be left in place. These are the types of questions and decisions present with each alert that product security teams wrestle with.
Phase 3: Validate what&rsquo;s actually live
A credential sitting in a repository might have been rotated years ago, or it might still unlock production systems. You can&rsquo;t prioritize without knowing the difference.
At the time, secret scanning didn&rsquo;t have native validity checking, so we built our own approach. The goal was narrow: determine whether a credential still worked and, when appropriate, collect enough metadata to route the alert or notify the right owner.
For example, for a GitHub token, a representative check could make a single authenticated request to a low-impact endpoint like GET /user:
response="$(
curl -sS -w '\n%{http_code}' \
-H "Authorization: Bearer $TOKEN" \
-H "Accept: application/vnd.github+json" \
-H "X-GitHub-Api-Version: 2022-11-28" \
https://api.github.com/user
)"
status="${response##*$'\n'}"
body="${response%$'\n'*}"
case "$status" in
200)
login="$(jq -r '.login // empty' <<< "$body")"
echo "token appears active for GitHub user: $login"
;;
401)
echo "token appears invalid or revoked"
;;
403|429)
echo "unable to determine validity; rate-limited or blocked"
;;
*)
echo "unable to determine validity: HTTP $status"
;;
esac
Remember, our goal was to answer the smallest useful set of questions: does this credential still work, and who needs to know about it? We treated ambiguous responses as inconclusive, and we avoided follow-on requests to repositories, organizations, or other private resources.
This required close partnership with our privacy and legal teams. Even a &ldquo;read-only&rdquo; validity check can have implications when you&rsquo;re touching a credential you may not own.
As we worked through this manually, our product team built the solution natively, which made the remaining work much faster. Validity checking is now built into GitHub secret scanning.
Phase 4: Figure out who owns what
That cross-functional work also exposed an ownership problem: even after we knew a credential was active, we still had to figure out who could rotate it.
We partnered with customer support, security incident response, and our bug bounty program to develop shared playbooks for secrets reported outside of code. That included redacting secret values before routing work to teams, determining whether a credential belonged to GitHub or a customer, and notifying affected customers or researchers so they could rotate tokens under their control. Across all these workflows, we had to ensure we weren&rsquo;t creating new problems, like opening issues or pushing commits containing the very secrets we were trying to remediate.
For GitHub-issued credentials like personal access tokens, we worked with our product team to surface secret metadata directly in the alert: who created the token, when, and what scopes it had. That meant we didn&rsquo;t need to use the token itself to figure out who it belonged to.
For everything else, ownership was harder, and this exposed a deeper problem: not all repositories had clear owners.
Our internal engineering standards (the Engineering Fundamentals program) enforce durable ownership on services, and we maintain a mapping between services and repositories, but not all repositories map cleanly to a service. The pain we experienced led to a broader repository ownership initiative (using GitHub&rsquo;s Custom Properties), plus a parallel effort to ensure all secrets in our credential manager have durable owners. You can&rsquo;t rotate a secret if you can&rsquo;t find the owner.
Phase 5: Manual triage for the long tail
Even with validation and metadata, a long tail of alerts required human judgment. For each one: what does this grant access to, has it been rotated, who owns the connected system, and what&rsquo;s the remediation path?
For every alert we dismissed, we ensured an accurate disposition (e.g., revoked, used in test, false positive) was recorded, along with a comment containing relevant context, such as a link to a remediation issue or an approved security exception.
This phase required close collaboration across teams to identify system owners, validate remediation status, and assess residual risk where automated signals alone were insufficient.
Phase 6: Systematize and drive accountability
As patterns emerged, we made the work scalable:
We routed alerts into our internal vulnerability management platform for centralized tracking and reporting.
Different credentials need different remediation steps. We documented playbooks by secret type so teams could self-serve.
We automated notifications, routing alerts to the right teams based on repository ownership.
The final piece was accountability. We tied secret remediation to GitHub&rsquo;s Engineering Fundamentals program, making it a security fundamental that teams were measured against. We set clear expectations and gave teams visibility into status. When secret hygiene is part of how engineering health is measured, it becomes a shared responsibility across the organization.
Nine months after we started, we hit inbox zero.
Lessons learned
Don&rsquo;t panic at the number. Our initial count was 20,000+ alerts, but 90% were not valid. The raw count is almost never the real scope of work.
Enable and enforce everywhere, no exceptions. Partial rollouts create blind spots. We enabled and enforced secret scanning and push protection at the enterprise level, without allowing anyone to opt out.
Validate before you escalate. Not every detected secret is live. Validation helps you create a prioritized to-do list.
Metadata saves hours. For GitHub credentials, secret metadata cut down the necessary detective work. If you&rsquo;re working with third-party providers, push them to surface similar metadata, or build your own enrichment layer.
You can&rsquo;t remediate without ownership. Invest in durable ownership infrastructure early.
Automate the workflow after detection. Detection gets you started, but the operational challenge was routing alerts, tracking owners, and closing the loop. Invest in the workflow layer.
Make it everyone&rsquo;s problem. Security teams can&rsquo;t remediate thousands of alerts alone. We tied secret hygiene to our Engineering Fundamentals program. When leadership watches the dashboards, teams find time to fix things.
Document your decision framework. You&rsquo;ll encounter secrets without clean remediation paths. Document how you decide: When is rotation sufficient? When do you rewrite history? When do you accept residual risk?
What this means for you
You don&rsquo;t need to reinvent most of what we built. Many of our manual workarounds, including validity checking, ownership identification, and bulk triage, are now native features in secret scanning.
If you&rsquo;re starting today:
Enable and enforce secret scanning and push protection everywhere.
Triage the backlog by repository and secret type; bulk-close what you can prove is noise.
Validate what&rsquo;s live before you escalate.
Route alerts to owners, and track remediation like any other engineering work.
Ready to get started? Learn how to enable secret scanning and push protection with GitHub Advanced Security .
Read next: How we tackled repository ownership at scale , and why durable ownership of repositories and secrets is the foundation everything else depends on.

## full_text

Michael Recachinas · @mrecachinas
July 2, 2026
Updated July 9, 2026
9 minutes
Share:
Several years ago, GitHub Security launched an initiative to assess and improve our overall secrets hygiene. As part of that effort, we piloted the Secret Scanning capability that was under development at the time. That&rsquo;s when we found more than 20,000 secrets spread across our 15,000+ repositories.
The number was significantly higher than we anticipated, but it quickly became clear that success would depend on identifying which alerts represented real risk, assigning ownership, and remediating them safely. Nine months later, we reached zero open alerts.
New secret scanning customers often ask us: &ldquo;How do you manage this internally? How did you actually clean up your existing secrets?&rdquo;
Like many long-running software companies, GitHub&rsquo;s approach to secrets management evolved over time. GitHub was founded in 2008, before today&rsquo;s centralized vaults, automated secret scanning, and dedicated secrets-management platforms were common across the industry. As engineering practices matured and GitHub grew, we continued investing in stronger controls, better tooling, and systematic risk reduction for legacy patterns. This work reflects our ongoing commitment to improving security, reducing exposure, and ensuring our internal practices meet the same high standards we expect across the industry.
This blog post shares what worked for us during this effort, and highlights strategies you can apply to better protect your own secrets.
Cutting out the noise
The first thing we discovered was that the alert count was a bit misleading&mdash;i.e., 20,000 alerts did not mean 20,000 equally risky problems.
When we dug into the data, we discovered that just five repositories accounted for roughly 18,000 of those alerts, and every one of those secrets was inactive: test fixtures, deactivated credentials, and fake-but-valid-looking secrets used for testing. (We build secret scanning, so naturally we have repositories full of legitimate-looking secrets in tests.)
That left over 2,000 alerts that needed attention: potential live credentials and thousands of decisions about risk, rotation, and remediation.
Secrets don&rsquo;t just live in code
Secret remediation touched more than source code. We found secrets in support tickets (customers occasionally include tokens), bug bounty reports (researchers disclose what they found with complete reproductions, including API requests with tokens used), incident notes, and wiki pages.
We partnered with customer support, security incident response, and our bug bounty program to develop shared playbooks. Across all these workflows, we had to ensure we weren&rsquo;t creating new problems, like opening issues or pushing commits containing the very secrets we were trying to remediate.
Our phased approach
We were not going to close 20,000 alerts by asking a few security engineers to grind through them one by one. We treated it like any other operational backlog: stop new debt, then work down what already exists with a workflow that&rsquo;s repeatable, measurable, and not dependent on one person&rsquo;s institutional knowledge.
Phase 1: Enable everywhere, stop the accumulation
Before cleaning up existing secrets, we had to stop new ones from piling up.
We enabled secret scanning and push protection across all of our enterprises and organizations. Thanks to GitHub Advanced Security&rsquo;s organization-level settings, this wasn&rsquo;t a repository-by-repository slog across 15,000 repositories. We enforced the setting so individual repositories and teams could not quietly opt out.
Push protection blocked new secrets at the source. That kept the backlog from growing faster than we could burn it down.
Phase 2: Understand and triage
We broke down the 20,000+ alerts by repository, secret type, and age so we could separate noise from work.
When we dug in, we discovered that just five repositories accounted for roughly 18,000 of those alerts, and every one of those secrets was inactive: test fixtures, deactivated credentials, and fake-but-valid-looking secrets used for testing. (We build secret scanning, so naturally we have repositories full of legitimate-looking secrets in tests.)
For high-volume, low-risk alerts, we developed criteria for bulk closure. If a secret was in a dedicated test repository, had never been active, and matched a known test pattern, we could confidently mark it resolved. In a matter of days, we closed out roughly 18,000 alerts.
The hard questions
We had to make strategic decisions about how to remediate secrets. When a secret lives in an issue, do you edit the body (and potentially remove revision history), or preserve the audit trail? When a secret is committed to a repository, do you rewrite git history? Anyone who&rsquo;s tried rewriting git history at scale knows what happens next: force-pushes break open pull requests, invalidate commit SHAs, and generally interrupt developers.
A common question was: &ldquo;Can we just delete the repository if it&rsquo;s no longer in use?&rdquo; Our answer was generally no. A deleted repository takes its audit trail with it. If a secret in that repository was ever leaked or the repository was ever compromised, you lose the forensic record you&rsquo;d need during incident response. Rotate the secret, archive the repository if appropriate, but keep the history.
Whenever possible, we rotate or revoke the exposed secret first. The harder question is whether the residual risk warrants rewriting git history, or whether a revoked secret in history can safely be left in place. These are the types of questions and decisions present with each alert that product security teams wrestle with.
Phase 3: Validate what&rsquo;s actually live
A credential sitting in a repository might have been rotated years ago, or it might still unlock production systems. You can&rsquo;t prioritize without knowing the difference.
At the time, secret scanning didn&rsquo;t have native validity checking, so we built our own approach. The goal was narrow: determine whether a credential still worked and, when appropriate, collect enough metadata to route the alert or notify the right owner.
For example, for a GitHub token, a representative check could make a single authenticated request to a low-impact endpoint like GET /user:
response="$(
curl -sS -w '\n%{http_code}' \
-H "Authorization: Bearer $TOKEN" \
-H "Accept: application/vnd.github+json" \
-H "X-GitHub-Api-Version: 2022-11-28" \
https://api.github.com/user
)"
status="${response##*$'\n'}"
body="${response%$'\n'*}"
case "$status" in
200)
login="$(jq -r '.login // empty' <<< "$body")"
echo "token appears active for GitHub user: $login"
;;
401)
echo "token appears invalid or revoked"
;;
403|429)
echo "unable to determine validity; rate-limited or blocked"
;;
*)
echo "unable to determine validity: HTTP $status"
;;
esac
Remember, our goal was to answer the smallest useful set of questions: does this credential still work, and who needs to know about it? We treated ambiguous responses as inconclusive, and we avoided follow-on requests to repositories, organizations, or other private resources.
This required close partnership with our privacy and legal teams. Even a &ldquo;read-only&rdquo; validity check can have implications when you&rsquo;re touching a credential you may not own.
As we worked through this manually, our product team built the solution natively, which made the remaining work much faster. Validity checking is now built into GitHub secret scanning.
Phase 4: Figure out who owns what
That cross-functional work also exposed an ownership problem: even after we knew a credential was active, we still had to figure out who could rotate it.
We partnered with customer support, security incident response, and our bug bounty program to develop shared playbooks for secrets reported outside of code. That included redacting secret values before routing work to teams, determining whether a credential belonged to GitHub or a customer, and notifying affected customers or researchers so they could rotate tokens under their control. Across all these workflows, we had to ensure we weren&rsquo;t creating new problems, like opening issues or pushing commits containing the very secrets we were trying to remediate.
For GitHub-issued credentials like personal access tokens, we worked with our product team to surface secret metadata directly in the alert: who created the token, when, and what scopes it had. That meant we didn&rsquo;t need to use the token itself to figure out who it belonged to.
For everything else, ownership was harder, and this exposed a deeper problem: not all repositories had clear owners.
Our internal engineering standards (the Engineering Fundamentals program) enforce durable ownership on services, and we maintain a mapping between services and repositories, but not all repositories map cleanly to a service. The pain we experienced led to a broader repository ownership initiative (using GitHub&rsquo;s Custom Properties), plus a parallel effort to ensure all secrets in our credential manager have durable owners. You can&rsquo;t rotate a secret if you can&rsquo;t find the owner.
Phase 5: Manual triage for the long tail
Even with validation and metadata, a long tail of alerts required human judgment. For each one: what does this grant access to, has it been rotated, who owns the connected system, and what&rsquo;s the remediation path?
For every alert we dismissed, we ensured an accurate disposition (e.g., revoked, used in test, false positive) was recorded, along with a comment containing relevant context, such as a link to a remediation issue or an approved security exception.
This phase required close collaboration across teams to identify system owners, validate remediation status, and assess residual risk where automated signals alone were insufficient.
Phase 6: Systematize and drive accountability
As patterns emerged, we made the work scalable:
We routed alerts into our internal vulnerability management platform for centralized tracking and reporting.
Different credentials need different remediation steps. We documented playbooks by secret type so teams could self-serve.
We automated notifications, routing alerts to the right teams based on repository ownership.
The final piece was accountability. We tied secret remediation to GitHub&rsquo;s Engineering Fundamentals program, making it a security fundamental that teams were measured against. We set clear expectations and gave teams visibility into status. When secret hygiene is part of how engineering health is measured, it becomes a shared responsibility across the organization.
Nine months after we started, we hit inbox zero.
Lessons learned
Don&rsquo;t panic at the number. Our initial count was 20,000+ alerts, but 90% were not valid. The raw count is almost never the real scope of work.
Enable and enforce everywhere, no exceptions. Partial rollouts create blind spots. We enabled and enforced secret scanning and push protection at the enterprise level, without allowing anyone to opt out.
Validate before you escalate. Not every detected secret is live. Validation helps you create a prioritized to-do list.
Metadata saves hours. For GitHub credentials, secret metadata cut down the necessary detective work. If you&rsquo;re working with third-party providers, push them to surface similar metadata, or build your own enrichment layer.
You can&rsquo;t remediate without ownership. Invest in durable ownership infrastructure early.
Automate the workflow after detection. Detection gets you started, but the operational challenge was routing alerts, tracking owners, and closing the loop. Invest in the workflow layer.
Make it everyone&rsquo;s problem. Security teams can&rsquo;t remediate thousands of alerts alone. We tied secret hygiene to our Engineering Fundamentals program. When leadership watches the dashboards, teams find time to fix things.
Document your decision framework. You&rsquo;ll encounter secrets without clean remediation paths. Document how you decide: When is rotation sufficient? When do you rewrite history? When do you accept residual risk?
What this means for you
You don&rsquo;t need to reinvent most of what we built. Many of our manual workarounds, including validity checking, ownership identification, and bulk triage, are now native features in secret scanning.
If you&rsquo;re starting today:
Enable and enforce secret scanning and push protection everywhere.
Triage the backlog by repository and secret type; bulk-close what you can prove is noise.
Validate what&rsquo;s live before you escalate.
Route alerts to owners, and track remediation like any other engineering work.
Ready to get started? Learn how to enable secret scanning and push protection with GitHub Advanced Security .
Read next: How we tackled repository ownership at scale , and why durable ownership of repositories and secrets is the foundation everything else depends on.

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 97
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":13039,"paragraph_count":79,"sentence_count":110,"boilerplate_hits":0,"symbol_ratio":0.0012,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   GitHub had 20,000+ secret scanning alerts across 15,000 repositories. Here's how we separated signal from noise, built remediation workflows, and reached inbox zero in nine months. The post How GitHub used secret scanning to reach inbox zero appeared first on The GitHub Blog. ]]>

2. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   Michael Recachinas · @mrecachinas July 2, 2026 Updated July 9, 2026 9 minutes Share: Several years ago, GitHub Security launched an initiative to assess and improve our overall secrets hygiene.

3. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   As part of that effort, we piloted the Secret Scanning capability that was under development at the time.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   That&rsquo;s when we found more than 20,000 secrets spread across our 15,000+ repositories.

5. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   The number was significantly higher than we anticipated, but it quickly became clear that success would depend on identifying which alerts represented real risk, assigning ownership, and remediating them safely.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Nine months later, we reached zero open alerts.

## business_elements

- companies: GitHub Blog AI, GitHub
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 法律 / 法务, 医疗, 开发者工具, 企业服务
- roles: 开发者 / 工程团队, 法务 / 律师, 销售 / 客服
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出, 合作 / 联盟
- affected_departments: IT / 安全, 法务, 销售 / 客服
- numbers: 20, 000, 15, 2, 2026, 9, 9 m, 2008
- quotes: $(
curl -sS -w '\n%{http_code}' \
-H  / Accept: application/vnd.github+json / X-GitHub-Api-Version: 2022-11-28 / 
status= / ${response%$'\n'*}

## evidence_seed

- company_actions: That&rsquo;s when we found more than 20,000 secrets spread across our 15,000+ repositories. / Nine months later, we reached zero open alerts.
- case_details: As part of that effort, we piloted the Secret Scanning capability that was under development at the time.
- workflow_changes: GitHub had 20,000+ secret scanning alerts across 15,000 repositories. Here's how we separated signal from noise, built remediation workflows, and reached inbox zero in nine months. The post How GitHub used secret scanning to reach inbox zero appeared first on The GitHub Blog. ]]>
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队, 法务 / 律师, 销售 / 客服
- risks_or_constraints: Michael Recachinas · @mrecachinas July 2, 2026 Updated July 9, 2026 9 minutes Share: Several years ago, GitHub Security launched an initiative to assess and improve our overall secrets hygiene. / The number was significantly higher than we anticipated, but it quickly became clear that success would depend on identifying which alerts represented real risk, assigning ownership, and remediating them safely.

## guanlan_scores

- importance_type: important_case
- importance_score: 5
- importance_reason: real customer or adoption case; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,market_shaping_risk_context,adoption_context
- novelty: 2
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: true
- user_feedback_pool: false
- watchlist: true

## pool_routes

- core_pool
- emerging_pool

## missing_information

- none

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: none
- source_role: resolved_original_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

GitHub had 20,000+ secret scanning alerts across 15,000 repositories. Here's how we separated signal from noise, built remediation workflows, and reached inbox zero in nine months. The post How GitHub used secret scanning to reach inbox zero appeared first on The GitHub Blog. ]]>

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
