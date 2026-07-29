# V3 Compatibility Archive

Status: `retired_archive` as of `SITE-V4.3.0-compatibility-write-disabled`.

This directory preserves historical Signal Cards, V3 desk/graph datasets, and
legacy Card mappings as read-only evidence of earlier releases.

Production rules:

- Current workflows, gates, pages, projections, and synchronization tasks must
  not discover or read this directory.
- GitHub Pages must not publish this directory.
- Recovery is allowed only through an explicit historical/manual tool.
- Do not generate new files here during daily production.
- The optional read-only `compatibility_cards` V4 projection remains for this
  observation release only. Its final interface removal belongs to Phase 4.

Contents:

- `signal-cards/`: frozen historical Signal Card Markdown.
- `frontstage/`: frozen V3 desk, intelligence graph, and legacy site-content payloads.
- `legacy-mappings/`: frozen Card-to-event mappings.
