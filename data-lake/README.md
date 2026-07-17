# WaveSight Light Data Lake

This directory is the rebuildable machine-readable serving layer for WaveSight Data Center V4 and frozen V3 compatibility data.

It does not replace the Git-tracked daily V4 bundles under `01-SiteV2/content/11-databases/data-center-v4/`.

## Roles

| Layer | Role |
|---|---|
| Obsidian / Markdown | Human reading, judgment, review, and knowledge memory |
| Git-tracked JSON / Markdown | Auditable source snapshots and production history |
| DuckDB data lake | SQL query, monitoring, quality audit, cross-day statistics, and incident diagnosis |
| Frontstage JSON | Website rendering payloads |
| Data Center V4 bundles | Canonical normalized facts and evidence links |

## Generated Files

The following files are generated locally and ignored by Git:

- `data-lake/wavesight.duckdb`
- `data-lake/tables/*.jsonl`
- `data-lake/reports/*`

Regenerate them with:

```powershell
npm run sync:data-lake
```

To materialize only V4 JSONL tables without rebuilding DuckDB:

```powershell
npm run sync:data-center
```

Install the local daily sync task with:

```powershell
npm run install:data-lake-sync-task -- -At 11:10 -RunOnceNow
```

The scheduled task is named `WaveSight Data Lake Sync`. It runs daily at 11:10 Asia/Shanghai local machine time and at Windows logon. It only writes ignored generated files.

If Windows blocks scheduled-task registration, the installer writes a Startup fallback command instead. The fallback starts a hidden sync loop at Windows logon and checks every 60 minutes.

## Current Tables

V4 canonical serving tables:

| Table | Purpose |
|---|---|
| `source_artifacts` | Source provenance and snapshot references |
| `raw_documents` | RAW-V3 normalized documents with original and cleaned text |
| `claims` | Exact-span factual claims |
| `entities`, `entity_mentions` | Candidate entity registry and mentions |
| `canonical_events` | EVENT-V1 normalized events, status, conflicts and revisions |
| `compatibility_cards` | Judgment-free Card renderers derived from CanonicalEvents |
| `event_sources`, `event_claims`, `event_conflicts` | Event provenance and conflict links |
| `relationships` | Source-backed subject/predicate/object rows linked to events and Claims |
| `tag_assertions` | TAG-V4 evidence-backed technical semantic assertions |
| `facet_assertions` | TAG-V4 evidence-backed product, scenario, industry, deployment, and target-user classifications |
| `fde_records` | FDE-V2 source-bounded implementation projections |
| `hardware_records` | HARDWARE-V1 source-bounded hardware projections |
| `qa_queue` | Quarantined, partial, or no-event review records |
| `legacy_asset_mappings` | V3 Raw/Card compatibility identifiers mapped to V4 records |

Legacy compatibility tables:

| Table | Source | Purpose |
|---|---|---|
| `raw_items` | `01-SiteV2/content/01-raw/originals/**/*.json` | Raw evidence inventory, extraction quality, source routing, and text-contamination checks |
| `pool_daily` | `01-SiteV2/content/02-pool/*.md` | Daily Pool count and candidate heading counts |
| `signal_cards` | `01-SiteV2/knowledge/01-Signal-Cards/**/*.md` | Long-term Signal Card inventory and evidence linkage |
| `builders_daily` | `01-SiteV2/content/07-points/*.md` | First-Line Viewpoints daily sync summary |
| `community_items` | `01-SiteV2/site/data/community-intelligence.json` | Community Intelligence current item index |
| `frontstage_cards` | `01-SiteV2/site/data/v3-data-observation-desk.json` | Internal V3 compatibility Cards; not the public V4 event set |
| `fde_items` | `01-SiteV2/site/data/enterprise-ai-fde.json` and V3 desk data | Enterprise AI / FDE lens item index |

## Example Queries

```sql
select date, count(*) as raw_count
from raw_items
group by date
order by date desc;

select date, count(*) as contaminated
from raw_items
where mojibake_score > 0
group by date
order by contaminated desc;

select card_kind, count(*) as cards
from signal_cards
group by card_kind
order by cards desc;
```
