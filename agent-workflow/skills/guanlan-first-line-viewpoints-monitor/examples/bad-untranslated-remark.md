# Bad Untranslated Remark Example

This should fail the First-Line Viewpoints lane.

```yaml
---
date: 2026-06-12
person: example-builder
source_url: https://x.com/example/status/456
translation_status: pending
---

summary_zh: "We need to rethink agent memory as a product surface, not a backend primitive."
why_it_matters: ""
```

Why it fails:

- The supposed Chinese summary is copied English.
- `translation_status` is still pending.
- `why_it_matters` is empty, so the frontstage entry has no editorial value.
- This cannot be counted as current sync success.
