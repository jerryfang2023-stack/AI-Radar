# WaveSight Light Data Lake

This directory is the rebuildable machine-readable serving layer for WaveSight Data Center V4.

It does not replace the Git-tracked daily V4 bundles under `01-SiteV2/content/11-databases/data-center-v4/`.

## Roles

| Layer | Role |
|---|---|
| Guanlan AI Vault / Markdown | One-way human-readable projection for reading, judgment, review, and knowledge memory; it never reads or modifies DuckDB |
| Private evidence repository | Sole complete-original store, content-addressed by `content_hash` |
| Git-tracked JSON / Markdown | Auditable body-free evidence locators and production history |
| DuckDB data lake | SQL query, monitoring, quality audit, cross-day statistics, and incident diagnosis |
| Frontstage JSON | Website rendering payloads |
| Data Center V4 bundles | Canonical normalized facts and evidence links |

## Generated Files

The following files are generated locally and ignored by Git:

- `data-lake/wavesight.duckdb`
- `data-lake/manifest.json`
- `data-lake/tables/*.jsonl`
- `data-lake/reports/*`

Regenerate them with:

```powershell
npm run sync:data-lake
```

Validate the strict V4 contract:

```powershell
npm run assert:data-lake-v4
```

The 16:45 `WaveSight Daily Final Closure` task owns the local refresh. There is
no independent data-lake scheduled task or Startup loop.

Before every sync, JSONL files outside the 23-table V4 allowlist are deleted.
The manifest records the contract version, generation time, Git commit, table
names, row counts, removed stale tables, and DuckDB state.

## Current Tables

V4 canonical serving tables:

| Table | Purpose |
|---|---|
| `source_artifacts` | Source provenance and snapshot references |
| `raw_documents` | RAW-V4 body-free metadata with private `evidence://<content_hash>` locators |
| `claims` | Exact-span factual claims |
| `entities`, `entity_mentions` | Candidate entity registry and mentions |
| `canonical_events` | EVENT-V1 normalized events, status, conflicts and revisions |
| `event_sources`, `event_claims`, `event_conflicts` | Event provenance and conflict links |
| `relationships` | Source-backed subject/predicate/object rows linked to events and Claims |
| `tag_assertions` | TAG-V4 evidence-backed technical semantic assertions |
| `facet_assertions` | TAG-V4 evidence-backed product, scenario, industry, deployment, and target-user classifications |
| `fde_records` | FDE-V2 source-bounded implementation projections |
| `fde_observations` | Claim-native FDE observations |
| `hardware_records` | HARDWARE-V1 source-bounded hardware projections |
| `hardware_facts`, `hardware_snapshots` | Claim-native hardware facts and factual snapshots |
| `monitoring_funnel` | FDE and hardware observation-to-publication funnel |
| `entity_registry`, `entity_profiles` | Stable entity registry and factual entity profiles |
| `taxonomy_nodes` | TAG-V4 classification nodes |
| `entity_relationships` | Materialized factual relationship service |
| `qa_queue` | Quarantined, partial, or no-event review records |

The table set must be exactly 23. `card`, `pool`, `compatibility`, and legacy
mapping tables are forbidden.

## Example Queries

```sql
select data_date, count(*) as event_count
from canonical_events
group by data_date
order by data_date desc;
```
