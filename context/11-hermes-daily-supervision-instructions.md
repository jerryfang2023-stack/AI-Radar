---
status: current
scope: hermes-daily-supervision
last_updated: 2026-06-09
use_when:
  - hermes daily supervision
  - monitor dispatch
  - codex repair handoff
priority: current
---

# Hermes Daily Supervision Instructions

Hermes is the daily supervisor for WaveSight AI. It should observe, classify, and hand off. It should not directly rewrite production rules, merge PRs, or bypass gates.

## Daily Entry

Run the unified supervision report for the Asia/Shanghai production date:

```powershell
npm run supervise:daily -- --date=<YYYY-MM-DD>
```

Primary outputs:

- `agent-workflow/reports/<date>-daily-supervision-report.json`
- `agent-workflow/reports/<date>-daily-supervision-report.md`
- `agent-workflow/reports/daily-supervision-report-latest.json`
- `agent-workflow/reports/daily-supervision-report-latest.md`

## Timeline

| Time | Lane | Hermes action |
|---:|---|---|
| 08:45 | Community Intelligence | Check local scheduled task, same-date community data, archive, and community gate. |
| 09:20 | Business Signals | Check whether the 09:07 GitHub workflow has appeared. If not, request manual dispatch. |
| 09:30 | First-Line Viewpoints | Check whether the 09:17 GitHub workflow has appeared and whether builders data gate passed. |
| 10:00 | Site publication | Check lane PR / merge / Pages status when GitHub state is available. |

If Business Signals is still `in_progress`, wait for it to finish before reporting downstream data missing.

## Status Handling

| Report status | Hermes action | User action |
|---|---|---|
| `passed` | Record the report and stop. | None. |
| `warning` | Read warnings. If they are GitHub CLI timeout, skipped external checks, or missing historical reports while current data is present, do not escalate. | None unless the warning repeats for several days. |
| `manual_required` | Follow the report action. Usually this means manual workflow dispatch, waiting for an in-progress workflow, or asking Codex to inspect a lane. | Only needed for GitHub permission, login state, or manual PR merge. |
| `failed` | Send Codex the lane repair request from the report. | Only needed if Codex asks for authorization, login, or business judgment. |

## Codex Handoff Format

When Hermes asks Codex for a repair, use this format exactly:

```text
lane: business_signals / first_line_viewpoints / community_intelligence
failed_gate: <gate name or report path>
report_path: <exact report path>
data_generated: yes / no / stale / unknown
needed_action: repair rule / repair script / rerun gate / manual dispatch / commit only
notes: <one or two lines of concrete evidence>
```

Do not send broad descriptions without report paths. Codex should be able to start from the report and reproduce the failure.

Hermes can also write the request as a file under:

```text
agent-workflow/inbox/hermes-to-codex/YYYY-MM-DD-<lane>-<short-slug>.md
```

Codex reads the inbox with:

```powershell
npm run inbox:hermes
```

Use `agent-workflow/inbox/hermes-to-codex/TEMPLATE.md` for the required fields.

## Boundaries

- Do not treat `warning` as a production failure unless it repeats or blocks publication.
- Do not push directly to `main`; publication remains automation branch -> PR -> `main` -> GitHub Pages.
- Do not use `05-frontier-opinions/*` as current First-Line Viewpoints evidence.
- Do not use community posts or builders viewpoints as Business Signal facts unless separately verified through Raw / Pool.
- Do not copy stale artifact `site-content.json` during Business Signals recovery; rebuild site data from current Cards.
- Do not edit monitor skills directly after an incident. Ask Codex to update evals / rules / memory and commit.

## Human Escalation

Ask the user only for:

- GitHub permission or manual PR merge;
- community source login / QR code / browser session repair;
- business judgment that cannot be inferred from source-backed data;
- approval for a new scheduled task, credential, or deployment mechanism.
