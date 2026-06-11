status: open
priority: urgent
lane: business_signals
failed_gate: frontstage Top10 selection
report_path: 01-SiteV2/site/data/v3-data-observation-desk.json
data_generated: yes
needed_action: repair rule
created_at: 2026-06-11T09:50:00+08:00
source: hermes

# Business Signals Top10 Empty (06-11)

## Evidence

- Business Signals workflow ran successfully, PR merged at 09:30 CST (commit cd09b8e)
- 211 cards were generated in `v3-data-observation-desk.json`
- BUT `top10` array is **empty (0 items)** — same problem as 06-10
- Version shows `V3.3.2.1-public-frontstage-polish` (not updated to V3.3.4)
- GeneratedAt: `2026-06-11T01:29:55.360Z` (09:29 CST)
- Website data was deployed via manual dispatch after the PR merge (github-pages.yml push trigger didn't fire)
- Top10=0 means the Business Signals page shows no cards to users

## Previous Occurrence

- Same issue on 06-10: manual fix was applied by supplementing cards from pool and bypassing QC gate
- User asked Codex to fix this in V3.3.4, but the 06-11 run still produces empty Top10

## Suspected Root Causes

1. Frontstage selection logic failed to populate `top10` from the 211 generated cards
2. Pre-commit gate or QC gate may be blocking Top10 selection without surfacing the failure
3. Build script (`build-v3-data-observation-desk.mjs`) may not execute the Top10 selection step

## Expected Codex Action

1. Inspect `01-SiteV2/site/data/v3-data-observation-desk.json` — get the actual card data
2. Run `01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs` locally to see if Top10 selection fails
3. Identify why 211 cards pass generation but 0 pass the Top10 gate
4. Fix the rule or script that selects Top10 from generated cards
5. Commit the fix
6. Rerun Business Signals workflow or manually regenerate site data

## User Escalation Needed

- no (owner is aware and waiting for Codex fix)
