# Source Registry Schema

Status: V2 isolation schema.

Required fields:

| Field | Type | Rule |
|---|---|---|
| `source_id` | string | Stable source ID |
| `name` | string | Source name |
| `homepage` | string | URL where applicable |
| `source_level` | enum | `S`, `A`, `B`, `C` |
| `source_type` | string | Company blog, product page, VC report, media, builder point, etc. |
| `primary_language` | string | Source language |
| `coverage` | list | Industries, jobs, workflows, regions |
| `allowed_roles` | list | `fact`, `calibration`, `trigger`, `counter_evidence`, `background` |
| `blocked_roles` | list | Roles this source cannot play |
| `reliability_notes` | text | Historical notes |
| `watch_frequency` | string | Daily, weekly, event-triggered |
| `archive_rule` | string | How source material should be preserved |
| `status` | enum | `active`, `watch`, `blocked`, `review` |

C-level sources cannot be sole fact evidence.

