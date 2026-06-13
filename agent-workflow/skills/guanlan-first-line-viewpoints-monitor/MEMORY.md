# Guanlan First-Line Viewpoints Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-06-12

- V3.3.6+ First-Line Viewpoints success requires both fresh frontstage JSON and Obsidian person/date timeline persistence. Old month files such as `YYYY-MM.md` are legacy evidence, not current sync proof.

## 2026-06-13

- The afternoon `run-follow-builders-skill.ps1` task is the first validation point for the local publish route. If it shells out with PowerShell array splatting incorrectly, Hermes will report a missing same-date publish report and missing `01-SiteV2/content/07-points/<date>-builders-viewpoints.md` even when the skill data itself is healthy.
