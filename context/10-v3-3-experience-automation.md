---
status: current
scope: v3-3-experience-automation
last_updated: 2026-07-01
use_when:
  - record development action
  - summarize execution lessons
  - review mistakes and reusable experience
  - audit action noise
priority: current
---

# SITE-V3.4.5 Experience Automation

This file defines the lightweight automation for recording development actions and generating experience retrospectives.

The goal is not to log every command. The goal is to preserve actions that changed system state, affected product judgment, exposed risk, or produced reusable experience.

## Tools

Record one meaningful action:

```powershell
node agent-workflow/tools/record-action-run.mjs --action="Source-first check" --status=success --summary="Checked frontstage source-backed fields"
```

Generate a daily retrospective:

```powershell
node agent-workflow/tools/write-action-retrospective.mjs --date=<YYYY-MM-DD>
```

Read open Hermes repair requests:

```powershell
npm run inbox:hermes -- --status=open --latest=false
```

Close a repaired Hermes request:

```powershell
npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>
```

Audit Guanlan Skill Ops after skill edits or repeated lane failures. This refreshes the home `.skill-store` mirror before rerunning the governance check:

```powershell
npm run audit:skills
```

Read-only Skill Ops check used by daily supervision:

```powershell
npm run check:skill-ops
```

## Output Files

Action logs:

```text
agent-workflow/logs/action-runs/<YYYY-MM-DD>.jsonl
```

Daily retrospective:

```text
agent-workflow/reports/<YYYY-MM-DD>-action-retrospective.md
```

## Record Levels

| Level | Meaning | Record Policy |
|---|---|---|
| `required` | Meaningful action that affects state, release, data, rules, or risk. | Always record. |
| `exception_only` | Routine exploration or validation. | Record only when it finds a problem, causes a decision, or touches a boundary. |
| `skip` | Low-value intermediate action. | Do not record unless explicitly forced. |

## Required Records

Always record:

- any current action from `context/09-v3-3-current-action-index.md`;
- edits to `AGENTS.md`, `context/`, `.github/workflows/`, automation scripts, or core site scripts;
- any failed gate, failed workflow, rollback, manual override, or skipped safety check;
- any action that changes frontstage pages, site data, dashboard data, Raw / Pool / Card assets, graph data, trend candidates, or local sync behavior;
- any action that touches `retired` outputs or may revive historical routes;
- any decision that creates a reusable rule.

## Exception-Only Records

Record only when they reveal a problem or decision:

- ordinary file search;
- reading current context;
- checking git status;
- rerunning the same validation;
- opening or previewing a page;
- inspecting a historical report.

## Skip Records

Do not record:

- simple directory listing;
- empty search results with no decision impact;
- pure confirmation reads;
- repeated local checks that neither fail nor change decisions;
- intermediate exploration that does not affect scope, output, risk, or rules.

## Retrospective Questions

Each daily retrospective should answer:

- Which current actions ran?
- Which actions failed or were incomplete?
- Which mistakes happened?
- What insufficiencies were exposed?
- What went right?
- Which rules or habits should be reused?
- Did any retired action reappear?
- Did any unregistered action need classification?

## Production Learning Loop

Use this loop after every real production failure:

1. `supervise:daily` identifies the failed lane, gate, report path, and data state.
2. Hermes automatically creates or updates a compact repair request under `agent-workflow/inbox/hermes-to-codex/`.
3. Codex repairs the smallest script, rule, gate, or data build path.
4. Codex records the repair action with `record:action`, including issues, risks, checks, and reusable lessons.
5. Codex reruns the exact failed gate or the smallest relevant validation.
6. Codex closes the Hermes inbox item only after recording the validation and prevention artifact.
7. If the repair changes any Guanlan skill, Codex runs `npm run audit:skills` before closure.
8. Weekly health reads daily supervision reports, Hermes inbox incidents, and action logs together.
9. If the same incident category repeats twice in the weekly window, promote the lesson into one of:
   - a stricter gate;
   - a monitor skill eval;
   - durable `MEMORY.md` for the responsible monitor skill;
   - a current `context/` rule when it affects cross-lane behavior.

Do not close a recurring issue by only editing same-day data. A repeated failure must leave a prevention mechanism.

## Repeated Issue Categories

Weekly health classifies repeated incidents into categories such as:

- `business_signals_top10_missing`;
- `source_first_frontstage_gate`;
- `frontstage_title_translation`;
- `frontstage_detail_content`;
- `monitor_or_gate_failure`;
- `obsidian_sync`;
- `skill_ops`.

When a category repeats, fix the system path that allowed it to recur.

## Rule Promotion

Only promote a lesson into `context/` when it is reusable, specific, and likely to prevent repeated mistakes.

Do not promote a one-off detail into a permanent rule.

## Noise Rule

When in doubt, record only if the action changed system state, affected judgment, exposed risk, or created reusable learning.
