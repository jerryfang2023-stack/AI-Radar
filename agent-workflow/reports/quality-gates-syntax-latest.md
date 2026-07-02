# Quality Gates Report

- generated_at: 2026-07-02T04:02:45.914Z
- mode: syntax
- date: 2026-07-02
- status: passed
- check_count: 20
- failed_count: 0

## Checks

### 1. run-quality-gates syntax

- command: `node --check agent-workflow/tools/run-quality-gates.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 2. monitor quality gate syntax

- command: `node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 3. daily monitor syntax

- command: `node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 4. daily monitor with qc syntax

- command: `node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 5. automation readiness syntax

- command: `node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 6. daily production chain syntax

- command: `node --check agent-workflow/tools/assert-daily-production-chain.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 7. asset card generation syntax

- command: `node --check agent-workflow/tools/generate-asset-cards-from-pool.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 8. pool-to-card dedupe syntax

- command: `node --check agent-workflow/tools/assert-pool-to-card-dedupe.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 9. business frontstage gate syntax

- command: `node --check agent-workflow/tools/assert-business-signals-frontstage.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 10. source-first frontstage syntax

- command: `node --check agent-workflow/tools/assert-v3-source-first-frontstage.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 11. frontstage regression syntax

- command: `node --check agent-workflow/tools/frontstage-regression-gate.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 12. current rule hygiene syntax

- command: `node --check agent-workflow/tools/assert-current-rule-hygiene.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 13. tag quality gate syntax

- command: `node --check agent-workflow/tools/check-tags.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 14. first-line data gate syntax

- command: `node --check agent-workflow/tools/assert-follow-builders-data.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 15. community data gate syntax

- command: `node --check agent-workflow/tools/assert-community-intelligence-data.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 16. business frontstage builder syntax

- command: `node --check 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 17. operations data sync syntax

- command: `node --check 01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs`
- status: passed (0)
- stdout: -
- stderr: -

### 18. business frontstage JS syntax

- command: `node --check 01-SiteV2/site/assets/v3-data-observation-desk.js`
- status: passed (0)
- stdout: -
- stderr: -

### 19. first-line frontstage JS syntax

- command: `node --check 01-SiteV2/site/assets/follow-builders.js`
- status: passed (0)
- stdout: -
- stderr: -

### 20. community frontstage JS syntax

- command: `node --check 01-SiteV2/site/assets/community-intelligence.js`
- status: passed (0)
- stdout: -
- stderr: -


## Current Scope

- SITE-V3.4.1 only.
- Retired V1/V2 daily observation, business brief, publiccopy, cardcopy, writer-style, V2 typography, and V2 raw/source gates are not active quality gates.
- Use Business Signals source-first/frontstage gates plus Raw/Pool/Core readiness gates for the current production lane.
