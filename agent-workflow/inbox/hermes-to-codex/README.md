# Hermes To Codex Inbox

This folder is the file-based message bridge from Hermes to Codex.

Use it when Hermes finds a daily supervision issue that needs Codex to inspect, repair, rerun a gate, or commit a change.

## Write Path

Create one Markdown file per request:

```text
agent-workflow/inbox/hermes-to-codex/YYYY-MM-DD-<lane>-<short-slug>.md
```

Allowed lane values:

- `business_signals`
- `first_line_viewpoints`
- `community_intelligence`
- `site_publication`
- `automation`

## Required Fields

Every message must include this block:

```text
status: open
priority: normal
lane: business_signals
failed_gate: agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md
report_path: agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md
data_generated: yes
needed_action: repair rule
created_at: YYYY-MM-DDTHH:mm:ss+08:00
source: hermes
```

## Notes

After the field block, add short evidence notes. Keep it concrete:

- what Hermes checked;
- what failed or looked stale;
- exact report paths;
- whether a manual dispatch, rerun, code repair, or commit is needed.

Do not paste long logs unless the log path is unavailable.

## Status

- `open`: Codex has not processed it.
- `in_progress`: Codex has started work.
- `done`: Codex completed the request.
- `blocked`: Codex needs user permission, login, manual PR merge, or external state.

Codex may update status after processing, but should not delete inbox messages.
