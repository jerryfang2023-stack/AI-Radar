# Raw Candidate Schema

Status: V2 isolation schema, not production frontmatter.

Required fields:

| Field | Type | Rule |
|---|---|---|
| `raw_id` | string | Stable ID, suggested `raw-YYYYMMDD-source-slug-nn` |
| `date` | date | Capture date |
| `source_name` | string | Human-readable source |
| `source_url` | string | Original URL or local archive path |
| `source_level` | enum | `S`, `A`, `B`, or `C` |
| `source_type` | string | Product, company blog, media, VC report, builder point, etc. |
| `captured_at` | datetime | Capture time |
| `language` | string | Source language |
| `raw_title` | string | Original title |
| `raw_summary` | string | Short factual summary |
| `collection_reason` | string | Why it entered raw |
| `initial_business_relevance` | string | Industry, job, workflow, or business value hypothesis |
| `original_archive_path` | string | Local archive or citation note |
| `needs_secondary_search` | boolean | Required for C-level or weak sources |

Raw candidates are not public content.

