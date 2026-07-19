# Trend Radar V1 Code and Rule Audit

Date: 2026-07-19

Baseline: `origin/main@317475e19d38dcdbc9cd63f3e36a6206c27cb5a7`

Target: `TRADAR-V1.0.0-factual-change-explorer`

## Standards axis

Initial findings:

1. Trend Radar build failure could block accepted Data Center V4 persistence because both were in one workflow step.
2. The new page was missing from the desktop/laptop/mobile browser smoke suite.
3. The projection gate did not recompute weekly/monthly structures strongly enough.
4. ARIA tab roles were incomplete.
5. The payload exposed unused relationship rows.
6. Product-entering-use output was empty because the first implementation required product IDs directly on deployment events.

Resolution:

- Split Trend Radar into its own non-blocking downstream application step; canonical V4 persistence remains owned by the V4 gate.
- Added `trend-radar.html` to all three smoke viewports and screenshot capture.
- Expanded the gate to recompute daily/weekly/monthly counts, deployment indexes, active-entity diversity, equal-window deltas, new-entity evidence and relationship-backed product use.
- Replaced incomplete tabs with an accessible pressed-button group.
- Removed unused relationship output; only verified `serves` relations are read during projection.
- Normalized reviewed entity types and used verified RELATION-V2 `serves` evidence for product-to-customer first use.

## Specification axis

Initial findings:

1. Monthly differences compared incomplete and complete months.
2. Product-entering-use was structurally present but always empty.
3. New-entity items lacked event evidence and several application cards lacked original-source links.
4. Hardware deployment was omitted from deployment indexes.
5. Browser interaction/visual acceptance was missing.

Resolution:

- Monthly differences now compare the same day range only when every prior-window batch date is observed; otherwise the page shows no delta.
- Product use now requires a verified product → customer `serves` relationship with event, Claim and SourceArtifact references.
- New entities retain their first event IDs; every rendered structure links to event/entity detail and original source.
- Hardware deployment is included in weekly/monthly deployment indexes while remaining in the hardware category count.
- Browser smoke passed for desktop 1440, laptop 1280 and mobile 390.

## Release result

- Data Center tests: 111/111 passed.
- Core frontstage tests: 33/33 passed.
- Trend Radar tests: 7/7 passed.
- Skill Ops tests: 15/15 passed; 26 governed Skills, zero drift, 100% eval/example coverage.
- Data Center integrity, entity history, projection coverage, TAG-V4, current-rule hygiene, frontstage regression, Trend Radar gate and version consistency passed.
- Browser smoke: all V4 routes and all three viewports passed.

No open P0/P1/P2 finding remains. The generated JSON is intentionally a rebuildable application projection, not canonical truth.
