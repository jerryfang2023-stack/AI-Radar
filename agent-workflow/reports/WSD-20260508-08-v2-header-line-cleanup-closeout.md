---
title: V2 header double-line cleanup closeout
date: 2026-05-08
owner: UI / UE Agent + Dev Agent
status: completed
---

# V2 Header Double-Line Cleanup Closeout

## Scope

User identified a remaining obvious double horizontal rule at the first screen header / hero boundary.

## Changes

- Removed remaining header and nav bottom borders.
- Disabled the page-level grid pseudo-element that created a second line beneath the header.
- Removed border inheritance from the homepage hero visual area.

## Verification

- `node --check 01-SiteV2/site/assets/app.js`: passed.
- Browser screenshot:
  - `agent-workflow/reports/v2-header-line-cleanup-2026-05-08/desktop-header.png`
- Screenshot metric:
  - header border: `0px`
  - nav border: `0px`
  - no horizontal overflow
