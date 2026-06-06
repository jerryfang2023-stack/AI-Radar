---
name: guanlan-daily-monitor-qc
description: Final human-readable QC for V3 WaveSight Raw / Pool monitoring. It decides whether the day's evidence can be used for Card generation, relationship graph, and trend-candidate input.
---

# Guanlan Daily Monitor QC

Use with:

```text
context/07-v3-intelligence-generation-rules.md
```

## Decision

Use only:

- `allow`;
- `allow_with_degradation`;
- `block`.

## Pass Criteria

A monitoring day can be used downstream when:

- Raw has source traceability;
- Pool has enough usable evidence;
- `core_pool` has original source link, readable body text, excerpts, hash, and Raw QC allow;
- product / service, funding, and case / vertical deployment material were all actively searched;
- large-company product news does not dominate without financing and case coverage;
- no opinion / follow-builders content is used as business-signal evidence.

## Output

Write a short QC report to:

```text
agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-qc.md
```

The report should list:

- result;
- Raw count;
- Pool count;
- usable `core_pool` count;
- product / funding / case coverage;
- blocked evidence;
- allowed downstream use.

## Downstream Use

Allowed downstream use is limited to:

- signal-card generation;
- relationship graph input;
- trend-candidate input.

Daily observation, business brief, and trend report are not current required outputs.

