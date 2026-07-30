# 08-report | 周报与月报

This directory stores the accepted report source files used by the Industry Reports route.

## Directory Structure

| Path | Use |
|---|---|
| `*.md` | Weekly AI business change radar reports |
| `monthly/` | Monthly AI business structure reports |

## Weekly Reports

Weekly reports are downstream judgment outputs. Accepted V4 CanonicalEvents (`E`) are their factual base; First-Line Viewpoints (`O`) and Community Intelligence (`C`) may provide separately namespaced interpretation and context but cannot create facts.

### Naming

```text
YYYY-MM-DD--weekly-report--ai-business-change-radar.md
```

Example:

```text
2026-06-29--weekly-report--ai-business-change-radar.md
```

### Current Index

| Date | Week | File |
|---|---|---|
| 2026-07-27 | 2026-W30 | `2026-07-27--weekly-report--ai-business-change-radar.md` |
| 2026-07-20 | 2026-W29 | `2026-07-20--weekly-report--ai-business-change-radar.md` |
| 2026-07-13 | 2026-W28 | `2026-07-13--weekly-report--ai-business-change-radar.md` |
| 2026-07-06 | 2026-W27 | `2026-07-06--weekly-report--ai-business-change-radar.md` |
| 2026-06-29 | 2026-W26 | `2026-06-29--weekly-report--ai-business-change-radar.md` |
| 2026-06-22 | 2026-W25 | `2026-06-22--weekly-report--ai-business-change-radar.md` |
| 2026-06-15 | 2026-W24 | `2026-06-15--weekly-report--ai-business-change-radar.md` |

### Frontmatter

```yaml
---
title: Weekly AI business change radar title
date: YYYY-MM-DD
week: "YYYY-WXX"
window: YYYY-MM-DD to YYYY-MM-DD
content_type: weekly-report
slug: ai-business-change-radar
status: published
---
```

## Monthly Reports

Monthly reports are current downstream application outputs under
`REPORTS-V1.1.0-lane-independent`. Their factual statements must resolve to
accepted V4 evidence; V3 Desk, Signal Cards, the old graph, trend candidates,
and legacy mappings are forbidden inputs.

The deterministic monthly source path is:

```text
monthly/YYYY-MM-DD--monthly-report--ai-business-structure-and-opportunity.md
```

DeepSeek writes bounded Markdown; the content gate must pass before
deterministic HTML and navigation rendering. Opportunity Map generation remains
independent and cannot block an accepted monthly report.
