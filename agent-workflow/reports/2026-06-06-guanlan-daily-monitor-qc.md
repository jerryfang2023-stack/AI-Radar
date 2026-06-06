# Guanlan Daily Monitor QC Report

## 1. Summary
- Date: 2026-06-06
- Result: passed_with_notes
- Score: 90.66
- Downstream decision: allow_with_degradation
- Biggest issue: monitor quality gate passed, but final QC handoff was missing; audit found community feedback and stale source-date items that must not be used as business signal facts.

## 2. Metrics
| Metric | Value | Required | Result |
|---|---:|---:|---|
| Raw count | 115 | 80-150, or 50-80 with reason | passed |
| Pool count | 44 | 20-40 target | passed_with_notes |
| Core pool count | 15 | task-dependent | passed |
| Routed pool count | 15 | excludes index-only and discard | passed |
| Index-only pool count | 29 | audit only | noted |
| AI HOT index-only / core | 29 / 11 | separated | passed |
| Usable original-evidence core items | 15 | >= core_pool baseline | passed |
| Homepage / directory core items | 0 | 0 | passed |
| Discovery-entrance-only core items | 0 | 0 | passed |
| Missing full_text core items | 0 | 0 | passed |
| Raw-QC blocked / degraded core items | 0 | 0 | passed |
| Six importance types covered | yes | yes | passed |
| Scoped degradation permission | eligible core_pool only after feedback and stale-source exclusion | required when downstream decision is allow_with_degradation | passed_with_scope |

## 3. Hard Gates
| Gate | Triggered | Evidence | Required Fix |
|---|---|---|---|
| Final QC missing | yes | `2026-06-06-guanlan-daily-monitor-qc.md` was absent before this report | add this final QC handoff before asset chain |
| Community feedback used as fact signal | yes | P-001 / P-003 are user-feedback style HN material | may be used for opinion / feedback only, not business signal facts |
| Stale source date used as same-day signal | yes | P-012 TechCrunch URL/body date 2026-02-24; P-015 URL/body date 2026-04-21 | exclude from same-day business signal cards |

## 4. Raw / Pool Findings
| Item | Problem | Current Route | Correct Route | Fix |
|---|---|---|---|---|
| P-001 / R-001 | HN community feedback entered core business-signal path | core_pool, emerging_pool, user_feedback_pool | user_feedback_pool / watchlist | exclude from business signal generation |
| P-003 / R-003 | HN community feedback merged into P-001 signal card | core_pool, emerging_pool, user_feedback_pool | user_feedback_pool / watchlist | exclude from business signal generation |
| P-012 / R-012 | original article date is 2026-02-24, not same-day | core_pool | watchlist / historical reference | exclude from same-day business signal generation |
| P-015 / R-015 | original article date is 2026-04-21, not same-day | core_pool, emerging_pool | watchlist / historical reference | exclude from same-day business signal generation |

## 5. Importance Coverage
| Importance Type | Evidence Found | Gap | Fix |
|---|---|---|---|
| important_case | yes | none | use only non-stale, non-feedback factual items |
| important_funding | yes | stale funding candidates present | exclude stale source-date items from same-day cards |
| important_technical_trend | yes | none | use as trend evidence only when source facts are current and direct |
| important_product_or_service | yes | community feedback mixed into product lane | keep feedback separate from fact card lane |
| important_vertical_solution | yes | HN feedback mixed into vertical lane | keep feedback as feedback/opinion material |
| important_viewpoint_or_article | yes | none | route through opinion card path |

## 6. Source And Page-Type Audit
| Item | Source Type | Page Type | Evidence Boundary | Decision |
|---|---|---|---|---|
| HN Ask threads | community | discussion thread | proves user discussion, not company action | not allowed for business signal facts |
| TechCrunch stale funding pages | A-media | article | factual but old source date | not allowed as same-day signal |
| official/product/news pages with current source dates | S/A/B | article/release/blog | usable if Raw QC allow and full text exists | allowed |

## 7. Downstream Permission
- Daily observation: allow_with_degradation; do not cite P-001 / P-003 as company facts.
- Business signal: allow_with_degradation; asset chain may use eligible core_pool only after excluding community feedback and stale source-date items.
- Trend tracking: allow_with_degradation; stale or feedback items can only be supporting context, not trend proof.
- Business brief: allow_with_degradation; same exclusion scope applies.
- Asset chain: allowed for eligible_core_pool_after_feedback_and_stale_exclusion.

## 8. Required Repair Prompt

Repair the asset generation rules so business signal cards are generated only from factual, current, Raw-QC-allowed core_pool items. Exclude user_feedback_pool / user_feedback_signal / community_feedback entries from fact cards. If `published_at` is missing, derive source date from canonical URL or visible full text before same-day card generation. Keep HN / Reddit / X material in opinion, user feedback or trend-support lanes unless separately verified by a factual source.
