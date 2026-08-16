# WaveSight Weekly Health - 2026-08-10 to 2026-08-16

- generated_at: 2026-08-16T10:18:59.485Z
- status: review
- days: 7

## Daily Supervision Coverage

| Date | Status | Lane statuses |
|---|---|---|
| 2026-08-10 | missing | none |
| 2026-08-11 | missing | none |
| 2026-08-12 | missing | none |
| 2026-08-13 | missing | none |
| 2026-08-14 | missing | none |
| 2026-08-15 | missing | none |
| 2026-08-16 | missing | none |

## Lane Status Totals

- none

## Recurring Problems

- none

## Recurring Warnings

- none

## Production Incident Loop

- incidents_in_window: 2
- unresolved_incidents: 0

| Date | Lane | Status | Failed Gate | Categories | File |
|---|---|---|---|---|---|
| 2026-08-15 | business_signals | resolved | repeated daily supervision signal | monitor_or_gate_failure<br>guanlan_vault_projection | `agent-workflow/inbox/production-incidents/2026-08-15-business-signals-recurring-05f820ce67869f02.md` |
| 2026-08-15 | skill_ops | resolved | repeated daily supervision signal | monitor_or_gate_failure | `agent-workflow/inbox/production-incidents/2026-08-15-skill-ops-recurring-403353afd75531ab.md` |

## Repeated Incident Categories

- none

## Action Log Loop

- action_records_in_window: 15
- failed_or_partial_records: 10
- unregistered_records: 15

| Date | Action | Status | Summary |
|---|---|---|---|
| 2026-08-10 | Fix funding card publication validation | partial | Final funding-card validation rejected two auto_published queue entries because canonical event evidence was not cited; normalized canonical quote matching and explicit blocked status prevent silent card drops |
| 2026-08-10 | Fix structured intake identity drift | partial | Production rebuild failed when hydrated private RawDocument metadata recomputed a different SourceArtifact identity; bind URL and content hash to the structured intake envelope before V4 ID checks |
| 2026-08-10 | Fix hydrated original URL identity drift | partial | A second production run showed private hydration also retained a stale original_url that took precedence over the intake source URL; bind original_url as well as source_url/content_hash |
| 2026-08-10 | Enforce stepwise recovery without recollection | partial | Documented and applied the rule that downstream retries must restore accepted same-date intake and resume at the first failed stage instead of recollecting raw sources. |
| 2026-08-10 | Repair URL-less restored SourceArtifact identity | partial | Downstream V4 retry failed because URL-less intake entries recomputed SourceArtifact IDs from moved private-evidence paths; preserve accepted intake IDs during resumed builds. |
| 2026-08-10 | Repair URL-less restored SourceArtifact identity | partial | Downstream V4 retry failed because URL-less intake entries recomputed SourceArtifact IDs from moved private-evidence paths; preserve accepted intake IDs during resumed builds. |
| 2026-08-11 | Repair funding card amount consistency fallback | partial | The 2026-08-11 funding lane blocked Lumilens because a deterministic claim object was truncated to 00M in funding although the exact source quote disclosed $700 million; the consistency gate now checks the source quote when the claim object is incomplete. |
| 2026-08-12 | Repair V4 reviewed ownership alias collision | failure-repaired | 8/12 Business Signals materialization failed because a fresh Alibaba Cloud duplicate alias shadowed reviewed 阿里云 ownership; fixed lookup precedence and will resume from accepted run. |
| 2026-08-13 | Repair Funding Insights eligibility gate for announced verified events | failure-repaired | Funding Insights checker scheduled verified announced event EV-cca4bd983a16b8d9, but generator filtered event_status=announced and produced no card; shared eligibility predicate now accepts announced and completed. |
| 2026-08-13 | Repair Funding Insights canonical citation fallback when private evidence body is unavailable | failure-repaired |  |

## Repeated Action Log Issues

- none

## Learning Loop Escalations

- none

## GitHub Workflow Health

| Workflow | Available | Runs | Failures | In progress |
|---|---:|---:|---:|---:|
| daily-persistent-assets-pr.yml | yes | 0 | 0 | 0 |
| daily-first-line-viewpoints-pr.yml | yes | 0 | 0 | 0 |
| github-pages.yml | yes | 0 | 0 | 0 |

## Historical / Conflict Signals To Review

- suspicious_match_count: 0

- none

## Recommended Actions

- Backfill or intentionally skip missing daily supervision reports: 2026-08-10, 2026-08-11, 2026-08-12, 2026-08-13, 2026-08-14, 2026-08-15, 2026-08-16
