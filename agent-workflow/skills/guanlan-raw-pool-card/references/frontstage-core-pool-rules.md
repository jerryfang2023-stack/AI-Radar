# Frontstage Core Signal Card Rules

Use these rules when changing `v3-data-observation.html`, `v3-data-observation-desk.js`, or `build-v3-data-observation-desk.mjs`.

## Public View

- Default view: one active-date Card set.
- No public Top10 mode.
- No public Core Pool candidate-pool mode.
- Every qualified Core Pool business signal that can become a Card should render as a public Card.
- Cards are sorted by importance / impact from high to low.
- Do not display sorting reasons, selection tiers, or candidate-only labels.

## Backend Evidence

- Raw and Pool keep full evidence and diagnostics.
- Core Pool items that cannot satisfy Card display requirements remain backend evidence.
- Do not force stale sources, generic lists, index-only pages, user-feedback-only items, or weak evidence into public Cards just to increase count.

## Source-First Boundary

- Public Cards must keep auditable source URL, source-title-derived title, and source-backed fact text.
- Source/channel labels are traceability only. They must not be ranking, quality, priority, or release-gate signals.
