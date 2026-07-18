# 2026-07-18 V4 Version Governance Audit

- audit_scope: SITE-V4.2 current rules, column versions, governed Skills, publication ownership, version projection, and release gates
- audit_method: active-caller and earliest-owner review using Guanlan Code Rule Auditor, Data Center Supervisor, and Skill Editor boundaries
- public_contract: SITE-V4.2.0-entity-history
- release_checkpoint: v4.2.1-governance-alignment
- status: passed

## Confirmed Findings And Resolution

| Severity | Finding | Earliest owner | Resolution |
|---|---|---|---|
| P1 | Operations Console projected SITE-V3.4.5 and omitted current REPORTS, OMAP, PERSON, TAG, and canonical contracts | `build-ops-console-data.mjs` ledger parser | Rebound projection to the complete current ledger and rebuilt JSON/JS |
| P1 | Hermes version preflight required retired shared IMAP metadata | current supervision instructions | Replaced with independent SITE, REPORTS, and OMAP checks |
| P1 | Opportunity Map Skill still claimed Industry Reports page ownership and allowed Relation Paths | Opportunity Map Skill source/evals/reference | Upgraded to v1.2.0 and bound it to independent OMAP page ownership; retired Relation Paths |
| P1 | Root `skills/` retained stale executable copies beside the formal Skill source | Skill source routing | Removed duplicate SKILL files and left a router to `agent-workflow/skills/` |
| P2 | Community Intelligence Skill called SITE-V3.4.5 current | Community monitor trigger metadata | Updated trigger to SITE-V4.2.0 and Skill v1.0.4 |
| P2 | TAG-V2 compatibility notice declared tag-taxonomy-v3.json as V4 truth | taxonomy compatibility documentation | Bound V4 to tag-taxonomy-v4.json and marked V3 JSON migration-only |
| P2 | PERSON-REVIEW-V1.0 was active but absent from central version governance | version ledger and dashboard projection | Registered the contract and preserved 37 reviewed candidates, 31 public natural people, and 6 quarantined accounts |
| P2 | Active automation/context headings still referred to SITE-V4.1 | current context routing | Updated active references to SITE-V4.2; historical freeze records remain unchanged |
| P2 | Skill Editor checklist rejected the metadata used by the current validator | Skill governance checklist | Updated the checklist and Skill v1.0.1 |
| P2 | Weekly/monthly Skill references could restore old Intelligence Map/relationship placement | report Skill references/evals | Rebound report pages to REPORTS ownership and independent OMAP inputs |

## Boundary Review

- V4 canonical chain remains SourceArtifact -> RawDocument -> Claim / Entity -> CanonicalEvent.
- FDE-V2.0 and HARDWARE-V1.0 remain evidence projections; no page-only inference or canonical rewrite was introduced.
- First-Line Viewpoints and Community Intelligence remain outside Business Signal facts and RELATION-V2 evidence.
- Reports Center and Opportunity Map have independent versions, page ownership, and generated outputs.
- GitHub Pages remains the only deployment owner.
- No business-event, FDE, hardware, canonical entity, Claim, or relationship data was regenerated for this governance release.

## Validation

- V4 data tests: 110/110 passed.
- V4 frontstage/report tests: 30/30 passed.
- Skill Ops tests: 15/15 passed; 25 governed Skills synced; zero Skill Store drift; 100% eval/example coverage.
- Data Center integrity: passed, 53 canonical events, 179 claims, 179 relationships, zero warnings/failures.
- Entity/person review: passed, 510 review decisions, 37 person candidates, 31 public natural people.
- ENTITY-V1 / RELATION-V2 gate: passed, 1,212 entities and 269 factual relationships.
- Projection coverage: six metrics at 100%.
- TAG-V4 taxonomy and audit: passed, 24 technical tags and 44 facet values.
- Current-rule hygiene: 529 files scanned, zero issues.
- Version consistency: 9 public pages and 18 Operations Console version rows passed.
- Frontstage regression and desktop/laptop/mobile smoke: passed.
