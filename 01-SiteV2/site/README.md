# WaveSight AI V4.4 Two-Center Frontstage

Status: current-site-workbench
Updated: 2026-07-31

## Positioning

This directory contains the current WaveSight AI V4.4 public site and operations entry.

Current public frontstage:

- Data Center: Event Library, Community Intelligence, First-Line Viewpoints, and Entity Library in `data-center.html`
- Application Center: Trend Radar in `trend-radar.html`; Guanlan Research is retired.
- Financing cards and weekly/monthly reports publish to `https://www.zkdlj.vip/`; local funding/research/report routes are compatibility redirects only.
- Opportunity Map remains an unlisted `noindex,nofollow` internal lab route.
- Legacy `v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, and `reports.html` are redirects only.

Current backend:

- Dashboard: `operations-console.html`

## Task Startup

For site work, read only:

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/02-vi-style.md`
4. `context/frontstage-page-contracts.md`
5. The current task dispatch and directly relevant page, script, or data file

Do not use old V2 homepage, daily observation, trend report, or business brief routes as current execution sources.

## Development Principles

- Desktop first unless the task explicitly asks for mobile.
- Public frontstage pages must not expose backend, sync, JSON, recovery, or edit traces.
- Frontstage facts must be source-backed and readable in Chinese.
- GitHub Pages publication requires explicit user confirmation.
- Netlify is retired and must not be restored as a website deployment service.
