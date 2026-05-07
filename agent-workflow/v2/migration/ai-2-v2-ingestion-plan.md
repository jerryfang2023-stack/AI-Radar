# ai-2 V2 Ingestion Plan

Status: isolation plan. Do not modify production `ai-2`.

## Goal

Prepare a future V2 ingestion path that writes new content into `06-content/v2/` instead of V1 production directories.

## Proposed Output Paths

| Stage | Path |
|---|---|
| Raw | `06-content/v2/00-raw/YYYY-MM-DD/` |
| Pool | `06-content/v2/01-pool/YYYY-MM-DD-pool.md` |
| Structured | `06-content/v2/02-structured/YYYY-MM-DD-structured-signals.md` |
| Front Signals | `06-content/v2/03-front-signals/YYYY-MM-DD-front-signals.md` |
| Deep Dive | `06-content/v2/04-deep-dives/YYYY-MM-DD-deep-dive.md` |
| HeatEvidence | `06-content/v2/06-heat-evidence/YYYY-Www-heat-evidence.md` |

## Required Behavior

- Preserve V1 as read-only compatibility.
- Do not double-write into `01-Signals/` or `02-Scoring/`.
- Produce exactly 3 Front Signals when an issue day runs.
- Require six-part opportunity decomposition for Front Signals.
- Mark insufficient evidence instead of inventing a Deep Dive.
- Keep Point material as calibration.

## Future Production Cutover Prerequisites

- User explicitly restarts website update / V2 production chain.
- Baseline branch/worktree is confirmed.
- V2 content quality gate passes for at least a 7-day validation set.
- ai-3 V2 sync gate exists and can roll back.

