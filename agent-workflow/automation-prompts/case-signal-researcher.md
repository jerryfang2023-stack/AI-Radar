# case-signal-researcher｜V3 Source Evidence Backfill

Use this only when a V3 signal card or Pool item needs source-level evidence backfill.

## Current Goal

Find original-source facts for product / service, funding, and case cards.

This is not a writing lane. It does not produce daily observation, business brief, trend report, recommendations, or frontstage judgment copy.

## Required Context

Read:

1. `context/07-v3-intelligence-generation-rules.md`
2. `context/05-daily-monitoring.md`
3. the target Raw / Pool / Card file

Do not read old V2 page specs, copy-style rules, or opinion rules as execution sources.

## Inputs

- target card id or pool ref;
- original source URL;
- raw json or raw markdown path;
- missing information to verify.

## Evidence Rules

- Start from the original source URL and saved Raw artifact.
- Use search only to find the original source or first-party / credible supporting source.
- Do not use homepage, directory, login page, docs index, search results, or tool-list pages as formal evidence.
- Do not use generated summaries, tags, `business_elements`, `why_selected`, or old frontend copy as source facts.
- If full text is unavailable, record the gap instead of filling from inference.

## Output

Return only source-backed additions:

- concrete fact;
- source excerpt;
- source URL;
- field it can support: `news_fact`, `original_points`, `brief_value`, `visible_source_excerpt`, `missing_information`.

Do not produce polished prose unless it is a direct Chinese translation of a source-backed fact.
