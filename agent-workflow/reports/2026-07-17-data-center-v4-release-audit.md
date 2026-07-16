# Data Center V4 Release Audit

- audit_date: 2026-07-17
- target: SITE-V4.0-data-center
- branch: codex/v4-data-center-release
- audit_skill: guanlan-code-rule-auditor
- status: release and live hotfix gates passed

## 1. Audit scope

This audit covers the Data Center V4 code, factual-data rules, TAG-V4 taxonomy, frontstage projection, GitHub Actions release path, Skill Store consistency, dependency security, and historical V4 migration.

The release boundary remains:

- provide structured, systematic AI-industry factual data;
- preserve auditable source artifacts, exact-span claims, entities, canonical events, projections, and evidence-backed tags;
- do not put importance, value, opportunity, recommendations, advice, or editorial judgment into canonical V4 data.

## 2. Findings and repairs

| Finding | Risk | Repair | Status |
|---|---|---|---|
| Source IDs were not fully content-addressed | Different snapshots could collide or overwrite | SourceArtifact and RawDocument IDs now include URL/file identity and content hash; identical captures are deduplicated | fixed |
| JSON Schema existed but was not executed by the gate | Contract drift could pass silently | Ajv 2020 schema validation added to the V4 integrity gate | fixed |
| Duplicate stable IDs were not blocked | Cross-table references could become ambiguous | Duplicate ID checks added for all canonical V4 tables | fixed |
| Public titles could fall back to incomplete source fragments | Company, product, and event pages could expose broken titles | Canonical `display_title_zh` added; incomplete titles enter QA and cannot reach the frontstage | fixed |
| Low-value or weakly AI-related items could enter commercial events | Commercial-event quality and relevance would degrade | AI-industry relevance, administrative-program, guide/index/community-source, and low-value vertical-publicity gates tightened | fixed |
| Product ownership projection dropped valid owner names without a company-page relationship | Product records could show incomplete ownership | Product names preserve all bounded owner names; only resolved entities receive clickable company relationships | fixed |
| TAG-V3 references remained in current rules and skills | New assertions could drift between taxonomies | Current V4 rules, skills, registry, and dashboard aligned to TAG-V4.0 | fixed |
| Pages workflow could deploy an unmerged automation head | Unreviewed assets could reach the live site | Pages deployment now checks out `main` and verifies the triggering automation PR is merged | fixed |
| Daily workflow did not run the complete V4 test set | Regressions could reach generated assets | Core, frontstage, taxonomy, syntax, and integrity checks added to CI | fixed |
| Historical V4 bundles did not cover the available Raw archive | V4 pages and applications could only query recent days | Repeatable dry-run/write backfill runner added with per-day gate and persisted reread verification | fixed |
| Runtime dependencies contained known vulnerabilities | Release supply-chain risk | Ajv dependencies upgraded; production dependency audit is clean | fixed |
| Community Intelligence opened on a single category after the first live deployment | Only 4 of the 61 daily snapshot records were visible by default and Feishu resources were hidden behind category switching | Restored an all-items default view while retaining category tabs, search, detail, pagination, original-post links, and Feishu resource links | fixed in v4.0.1 |

## 3. Validation evidence

| Gate | Result |
|---|---|
| Data Center core tests | 31 / 31 passed |
| Frontstage projection tests | 17 / 17 passed |
| 2026-07-16 V4 integrity gate | passed, no failures or warnings |
| Canonical source traceability | 100% |
| Canonical Claim traceability | 100% |
| AI-industry scope coverage | 100% |
| Tag evidence coverage | 100% |
| Facet evidence coverage | 100% |
| TAG-V4 taxonomy gate | passed: 24 technical tags, 5 facets, 44 facet values |
| Current-rule hygiene | passed: 486 files scanned, 0 issues |
| Skill audit | passed: 25 governed skills, 0 mirror drift, 100% eval/example coverage |
| JavaScript syntax | passed |
| Workflow YAML | passed |
| actionlint | passed |
| Dependency audit | 0 vulnerabilities |
| Git whitespace check | passed |
| Live Community Intelligence hotfix | 61 records, 12 cards on page 1, keyword search passed, Feishu links opened from detail |

## 4. Historical synchronization result

The migration is Raw-first and rebuilds V4 records instead of copying V3 Card conclusions.

Execution flow:

1. read each available historical Raw date;
2. rebuild SourceArtifacts and RawDocuments with stable content-addressed IDs;
3. extract exact-span Claims and verified entity mentions;
4. normalize accepted facts into CanonicalEvents;
5. generate FDE, hardware, TAG-V4, facet, relationship, and compatibility projections;
6. quarantine weak or incomplete records in QA;
7. validate the in-memory bundle;
8. write the date bundle;
9. reread the persisted bundle and validate it again;
10. materialize cross-date JSONL tables and rebuild the V4 frontstage dataset.

Migration totals:

- available Raw dates migrated: 55;
- date range: 2026-05-17 to 2026-07-16;
- RawDocuments: 8,449;
- per-day CanonicalEvents before cross-date deduplication: 790;
- cross-date deduplicated CanonicalEvents: 750;
- Claims: 3,137;
- verified/candidate entities in the materialized backend: 270;
- FDE records: 61;
- hardware records: 15;
- QA records: 7,593;
- quarantined RawDocuments: 1,183.

Dates without a Raw archive are not synthesized. Quarantined and QA records remain available for later recapture or manual verification but do not enter formal public event tables.

## 5. Release checklist

Required before the version is considered online:

1. commit the audited release baseline;
2. push `codex/v4-data-center-release`;
3. create and merge the release pull request into `main`;
4. create and push the release tag on the merged commit;
5. wait for the GitHub Pages deployment to finish;
6. verify the live commercial-event, company, product, FDE, hardware, community, viewpoint, entity-index, and industry-report routes;
7. verify live search, event-type filtering, TAG-V4 filtering, pagination, source links, latest data date, and current-day event count.

The release is not complete until the live Pages verification succeeds.
