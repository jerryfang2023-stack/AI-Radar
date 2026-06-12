status: open
priority: urgent
lane: business_signals
failed_gate: source_first_frontstage_gate + top10 missing
report_path: agent-workflow/reports/2026-06-12-github-persistent-assets-pr-source-first-frontstage.log
data_generated: yes
needed_action: repair rule + repair script
created_at: 2026-06-12T09:40:00+08:00
source: hermes

# Business Signals: Frontstage Gate Failure + Top10 Still Missing (06-12)

## What Happened

Two issues in today's run (#27388337521, auto-dispatched at 09:23 because schedule didn't trigger):

### Issue 1: Frontstage Gate Failed (1 card)
The `source_first_frontstage_gate` failed on card `SIG-20260612-A13`:
- Title: "Everything 案例：AI 进入模型部署和算力调用"
- Original highlight mentions "Oracle E-Business Suite, JD Edwards, PeopleSoft, Oracle Fusion Cloud ERP, Salesforce, Snowflake"
- Gate rule checks `!/procurement|采购|SAP|RFQ|AgentCore|Bedrock/iu.test(sourceScope)` — highlight mentions ERPs without procurement keyword in sourceScope
- This is a **false positive** — the card is about AI deployment, not procurement. The highlight simply mentions enterprise systems as examples.
- Gate fix needed: the regex should also exclude enterprise-ERP mentions that are just contextual examples, not procurement-specific.

### Issue 2: Top10 Key Still Missing (recurring bug)
Even if the gate passed, the artifact's `v3-data-observation-desk.json` has no `top10` key — same unresolved bug as 06-10 and 06-11.
- `frontstageCards` has 10 cards for 2026-06-12 ✅
- `frontstageSelection` shows qualifiedCount=11, selectedCount=10 ✅
- But `top10` array doesn't exist in the JSON
- Frontstage page may show nothing despite data being present

### Step Outcomes
| Step | Outcome |
|------|---------|
| Monitor/QC | ✅ success |
| Monitor readiness | ✅ success |
| Raw/Pool gate | ✅ success |
| Card generation | ✅ success (226 cards, 13 signal cards) |
| Pool-to-Card dedupe | ✅ success |
| Site data sync | ✅ success |
| Source-first frontstage gate | ❌ failure (1 card) |
| Frontstage regression gate | ✅ success |
| Pre-commit gate | ⏭️ skipped |
| Commit/PR | ⏭️ skipped |

### Data Quality
- 13 signal cards (enough for Top10)
- All 10 selected cards are editorial tier (no supply-fill)
- supplyConstrained: false
- Frontstage selection: 13 candidates → 11 qualified → 10 selected

## Expected Codex Action

1. Fix `assert-v3-source-first-frontstage.mjs` line 272: expand procurement regex or add exclusion for contextual ERP mentions
2. Fix `build-v3-data-observation-desk.mjs` to populate `top10` key (same as 06-11 inbox request)
3. Commit both fixes and regenerate today's site data from artifact:
   - Download artifact: `gh run download 27388337521 --repo jerryfang2023-stack/AI-Radar --dir /tmp/bs-fix-0612`
   - Run `node 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs` locally
   - Push to main

## Artifact Location
- Run ID: 27388337521 (also manually downloaded to `/tmp/bs-artifact-0612/`)
- All raw/pool/card/site data present
- No automation branch pushed (commit step skipped due to gate failure)

## First-Line Viewpoints Status (for context)
- ✅ Success, PR #26 merged at 09:24
- ✅ Deployed to CDN (pages manually dispatched)
- 52 remarks, 6 blogs, 1 podcast

## User Escalation Needed
- no
