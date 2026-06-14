# Good Three-Lane Morning Handoff Example

Use this as the expected behavior when the 09:45 / 09:55 Hermes early handoff checks the morning production lanes.

## Situation

- 08:57 Business Signals primary run completed with `failure`, or no primary run is visible.
- 09:27 Business Signals health dispatch found no healthy same-date data and no active/successful same-date run, then dispatched the primary workflow, or recorded why it was waiting.
- No same-date success is visible and no run is active by 09:55.
- No same-date Top10 / active-date Business Signals data has been published.
- First-Line Viewpoints or Community Intelligence may also be missing same-date assets.

## Correct Hermes Behavior

1. Run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>`.
2. If no lane workflow is active and same-date assets are unhealthy, dispatch the relevant lane workflow for the same production date.
3. Write `agent-workflow/reports/<date>-hermes-three-lane-early-handoff.json` and `.md`.
4. Include same-date run URLs, failure count, asset checks, dispatch action, reason, and good / bad examples per lane in the report.
5. If dispatch fails or the bounded attempt cap is reached, create `agent-workflow/inbox/hermes-to-codex/<date>-<lane>-early-handoff.md`.
6. Codex repairs the earliest failing stage and adds or tightens a relevant eval / example before resolving the inbox item.

## Incorrect Behavior

- Waiting for 10:07 / 12:07 / 13:07 / 14:07 schedule loops as the primary strategy.
- Running the old Business-only early handoff schedule in parallel with the three-lane handoff.
- Lowering evidence, Raw / Pool, Card, or Top10 gates to make the day appear complete.
- Copying stale site data instead of rebuilding from current Raw / Pool / Card outputs.
- Marking the incident resolved without a report path and prevention artifact.
