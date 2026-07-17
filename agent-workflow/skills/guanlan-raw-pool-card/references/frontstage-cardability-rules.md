# Compatibility Cardability Rules

Use these rules when changing `build-v3-data-observation-desk.mjs`, its internal compatibility JSON, or related gates and downstream projections. The retired V3 page and page-specific JS are not implementation targets.

## Compatibility View

- Default view: one active-date Card set.
- No Top10 mode.
- No candidate-pool mode.
- Every qualified Raw / Pool business signal that passes raw-to-card cardability and can become a Card should render as a compatibility Card.
- Cards are sorted by importance / impact from high to low.
- Do not display sorting reasons, selection tiers, or candidate-only labels.

## Backend Evidence

- Raw and Pool keep full evidence and diagnostics.
- Raw / Pool items that cannot satisfy Card display requirements remain backend evidence.
- Do not force stale sources, generic lists, index-only pages, user-feedback-only items, or weak evidence into compatibility Cards just to increase count.

## Source-First Boundary

- Public Cards must keep auditable source URL, source-title-derived title, and source-backed fact text.
- Source/channel labels are traceability only. They must not be ranking, quality, priority, or release-gate signals.
