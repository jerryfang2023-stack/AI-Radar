# WaveSight Light Data Lake

This directory is the local machine-readable index layer for WaveSight AI.

It does not replace Obsidian or the Git-tracked Markdown / JSON source files.

## Roles

| Layer | Role |
|---|---|
| Obsidian / Markdown | Human reading, judgment, review, and knowledge memory |
| Git-tracked JSON / Markdown | Auditable source snapshots and production history |
| DuckDB data lake | SQL query, monitoring, quality audit, cross-day statistics, and incident diagnosis |
| Frontstage JSON | Website rendering payloads |

## Generated Files

The following files are generated locally and ignored by Git:

- `data-lake/wavesight.duckdb`
- `data-lake/tables/*.jsonl`
- `data-lake/reports/*`

Regenerate them with:

```powershell
npm run sync:data-lake
```

## Current Tables

| Table | Source | Purpose |
|---|---|---|
| `raw_items` | `01-SiteV2/content/01-raw/originals/**/*.json` | Raw evidence inventory, extraction quality, source routing, and text-contamination checks |
| `pool_daily` | `01-SiteV2/content/02-pool/*.md` | Daily Pool count and candidate heading counts |
| `signal_cards` | `01-SiteV2/knowledge/01-Signal-Cards/**/*.md` | Long-term Signal Card inventory and evidence linkage |
| `builders_daily` | `01-SiteV2/content/07-points/*.md` | First-Line Viewpoints daily sync summary |
| `community_items` | `01-SiteV2/site/data/community-intelligence.json` | Community Intelligence current item index |
| `frontstage_cards` | `01-SiteV2/site/data/v3-data-observation-desk.json` | Current frontstage Business Signals cards |
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
