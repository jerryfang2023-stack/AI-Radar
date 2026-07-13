# 08-report | 周报与月报

This directory stores report source files used by the Intelligence Map report route.

## Directory Structure

| Path | Use |
|---|---|
| `*.md` | Weekly AI business change radar reports |
| `monthly/` | Reserved for future monthly AI business structure reports |

## Weekly Reports

Weekly reports are published source files for the Weekly AI Business Change Radar. They compare Business Signals, First-Line Viewpoints, and Community Intelligence to judge short-cycle changes.

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

Monthly reports are reserved but not yet a current published source route.

Do not publish monthly files until:

- the source Markdown is clean UTF-8;
- the file uses a current monthly frontmatter contract;
- retired fields such as `daily_observations` are not used;
- the monthly report generator and frontstage entry are explicitly versioned.

Until those conditions are met, monthly report drafts must stay out of git.
