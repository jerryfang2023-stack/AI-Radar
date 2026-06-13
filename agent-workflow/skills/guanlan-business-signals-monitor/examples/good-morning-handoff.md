# Good Morning Handoff Example

Use this as the expected behavior when the Business Signals morning windows fail.

## Situation

- 09:07 Business Signals run completed with `failure`.
- 09:37 Business Signals run completed with `failure`, or no same-date success is visible and no run is active by 09:55.
- No same-date Top10 / active-date Business Signals data has been published.

## Correct Hermes Behavior

1. Run `npm run hermes:business-early-handoff -- --date=<YYYY-MM-DD>`.
2. If no Business Signals workflow is active, dispatch `.github/workflows/daily-persistent-assets-pr.yml` for the same production date.
3. Write `agent-workflow/reports/<date>-hermes-business-signals-early-handoff.json` and `.md`.
4. Include same-date run URLs, failure count, dispatch action, and reason in the report.
5. If dispatch fails or the bounded attempt cap is reached, create `agent-workflow/inbox/hermes-to-codex/<date>-business_signals-early-handoff.md`.
6. Codex repairs the earliest failing stage and adds or tightens a relevant eval / example before resolving the inbox item.

## Incorrect Behavior

- Waiting for 10:07 / 12:07 / 13:07 / 14:07 schedule loops as the primary strategy.
- Lowering evidence, Raw / Pool, Card, or Top10 gates to make the day appear complete.
- Copying stale site data instead of rebuilding from current Raw / Pool / Card outputs.
- Marking the incident resolved without a report path and prevention artifact.
