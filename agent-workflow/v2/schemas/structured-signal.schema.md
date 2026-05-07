# Structured Signal Schema

Status: V2 isolation schema, not production frontmatter.

Required fields:

| Field | Type | Rule |
|---|---|---|
| `signal_id` | string | Stable ID |
| `title` | string | Event + business meaning, not company-only |
| `one_sentence_judgment` | string | Clear judgment with boundary |
| `fact_background` | text | What happened |
| `source_summaries` | list | At least 3 S/A/B for Front Signal candidates |
| `business_signal` | text | Why it matters commercially |
| `opportunity_decomposition` | object | Six modules: problem, customer, workflow, model, timing, China transfer |
| `counter_evidence` | list | At least 2 variables for frontstage candidates |
| `evidence_gaps` | list | Unknowns must stay unknown |
| `industry_tags` | list | Seed tags allowed |
| `job_tags` | list | Seed tags allowed |
| `workflow_tags` | list | Seed tags allowed |
| `formal_tags` | list | Must come from tag taxonomy |
| `candidate_tags` | list | New terms awaiting governance |
| `frontstage_status` | enum | `raw_only`, `structured`, `front_signal_candidate`, `front_signal` |
| `production_readiness` | enum | `isolation_only`, `candidate`, `production_ready` |

Point / Builder material can appear as calibration, not as fact evidence.

