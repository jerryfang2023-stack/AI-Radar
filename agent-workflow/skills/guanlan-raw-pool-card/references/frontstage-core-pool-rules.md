# Frontstage Core Pool Rules

Use these rules when changing `v3-data-observation.html`, `v3-data-observation-desk.js`, or `build-v3-data-observation-desk.mjs`.

## Views

- Default view: daily Top10.
- Secondary view: same-date full Core Pool candidate set.
- Top10 is an editorial selection from qualified Core Pool-backed Signal Cards.
- Full Core Pool is an evidence/candidate review surface, not a replacement for Top10.

## Large-Company Caps

- Apply caps only to Top10:
  - same large company: max 1 per date;
  - all large-company items: max 3 per date.
- Do not apply these caps to the full Core Pool secondary view.
- Still monitor full Core Pool balance:
  - large-company Core Pool should stay below 10 items and below 35% by default;
  - non-large-company Core Pool should be at least 20 items by default.

## Card Boundary

- Formal Signal Cards must pass the Card generator semantic gate.
- A Core Pool candidate can appear in the secondary view without a formal Signal Card.
- Mark status clearly:
  - `已成卡`: has a linked formal Signal Card;
  - `候选`: still a Core Pool candidate only.
- Do not force stale sources, generic lists, index-only pages, user-feedback-only items, or weak evidence into formal Signal Cards just to match Core Pool count.
