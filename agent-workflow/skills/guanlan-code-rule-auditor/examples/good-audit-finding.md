# Good Audit Finding

```yaml
severity: P1
confidence: confirmed
title: "Safe-repair mode is dropped before the owning stage"
evidence:
  - "package.json: parent command exposes --repair=safe"
  - "agent-workflow/tools/runner.mjs: child invocation omits repair mode"
contract: "The selected repair mode must reach the stage that decides allowed mutations."
impact: "Scheduled recovery always behaves as the child default, so repeated failures are not repaired as configured."
earliest_owner: "daily self-check dispatcher"
smallest_repair: "Forward the existing parsed value to the child; do not add a second mode parser."
validation: "Run the dispatcher in repair=off and repair=safe fixtures and assert distinct child arguments without production writes."
```

Why it passes: it proves reachability and impact, names the first broken handoff, and proposes a bounded validation.
