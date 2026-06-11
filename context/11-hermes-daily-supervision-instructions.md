---
status: current
scope: hermes-daily-supervision
last_updated: 2026-06-11
use_when:
  - hermes daily supervision
  - monitor dispatch
  - codex repair handoff
priority: current
---

# Hermes Daily Supervision Instructions

Hermes is the daily supervisor for WaveSight AI. It should observe, classify, and hand off. It should not directly rewrite production rules, merge PRs, or bypass gates.

## Current Version Context

- Current version: `V3.3.5-builder-obsidian-date-timelines`.
- Version ledger: `context/version-ledger.md`.
- V3.3.5 adds First-Line Viewpoints Obsidian persistence into person / date timeline files under `01-SiteV2/knowledge/02-Opinion-Timelines/people/<person>/<YYYY-MM-DD>.md`.
- Hermes must treat old month timeline files such as `YYYY-MM.md` as legacy / cleanup candidates, not as proof that V3.3.5 sync is healthy.
- Do not judge Codex work by commit author name. In this repository Codex commits may use the configured Git identity.

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
| 08:55 | Community Intelligence Publish | Check whether `.github/workflows/daily-community-intelligence-pr.yml` has published same-date community data when local data exists. |
| 10:20 | Business Signals | Check the 09:07 / 09:37 / 10:07 GitHub workflow windows. If no same-date run exists after this watchdog, request manual dispatch. |
| 10:30 | First-Line Viewpoints | Check the 09:17 / 09:47 / 10:17 GitHub workflow windows, builders data gate, and Obsidian timeline sync. |
| 10:40 | Site publication | Check lane PR / merge / Pages status when GitHub state is available. |

If Business Signals is still `in_progress`, wait for it to finish before reporting downstream data missing.

## Status Handling

| Report status | Hermes action | User action |
|---|---|---|
| `passed` | Record the report and stop. | None. |
| `warning` | Read warnings. If they are GitHub CLI timeout, skipped external checks, or missing historical reports while current data is present, do not escalate. | None unless the warning repeats for several days. |
| `manual_required` | Follow the report action. Usually this means manual workflow dispatch, waiting for an in-progress workflow, or asking Codex to inspect a lane. | Only needed for GitHub permission, login state, or manual PR merge. |
| `failed` | Send Codex the lane repair request from the report. | Only needed if Codex asks for authorization, login, or business judgment. |

## Weekly And Monthly Review

Run weekly and monthly reports as read-only reviews:

```powershell
npm run health:weekly -- --date=<YYYY-MM-DD> --days=7
npm run health:monthly -- --date=<YYYY-MM-DD> --days=30
```

Weekly review should look for repeated failures that need a gate, eval, or monitor skill memory update. Monthly review should look for Git hygiene, stale branches/worktrees, large files, old report cleanup candidates, runtime drift, and deployment-service residue. Hermes reports findings; Codex performs code, rule, or cleanup changes.

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
- Do not use old `01-SiteV2/knowledge/02-Opinion-Timelines/people/*/YYYY-MM.md` month files as proof of current First-Line Viewpoints Obsidian sync.
- Do not use community posts or builders viewpoints as Business Signal facts unless separately verified through Raw / Pool.
- Do not copy stale artifact `site-content.json` during Business Signals recovery; rebuild site data from current Cards.
- Do not edit monitor skills directly after an incident. Ask Codex to update evals / rules / memory and commit.

## Human Escalation

Ask the user only for:

- GitHub permission or manual PR merge;
- community source login / QR code / browser session repair;
- business judgment that cannot be inferred from source-backed data;
- approval for a new scheduled task, credential, or deployment mechanism.
