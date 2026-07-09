---
status: current
scope: project-memory
last_updated: 2026-07-09
use_when:
  - project startup
  - agent handoff
  - context recovery
  - recurring conflict check
priority: stable-memory
---

# Project Memory

This file records stable project memory for WaveSight AI / Guanlan AI. It is not a version ledger, daily report, closeout, or skill-specific memory.

## Stable Identity

- WaveSight AI / Guanlan AI is an AI business intelligence asset system, not a general content site.
- The public frontstage is organized around Business Signals, Reports Center, First-Line Viewpoints, and Community Intelligence.
- Dashboard / Operations Console is a backend-facing operations surface, not a public content column.
- Business Signals is the source-backed asset chain for Raw / Pool / Card / relationship graph / trend-candidate work.
- First-Line Viewpoints is an independent builders / operator viewpoints column.
- Community Intelligence is an independent logged-in community collection and archive stream.
- The local DuckDB data lake is an analytical index layer for machine queries; Obsidian remains the human-readable knowledge base.

## Non-Negotiable Rules

- Deploy through GitHub Pages only. Netlify is retired and must not be used as a fallback.
- Do not restore legacy content-output routes as required outputs.
- Do not restore legacy copy gates as publication blockers.
- Builders / First-Line Viewpoints must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.
- Community posts are demand signals unless recaptured through source-backed business evidence.
- If an old rule conflicts with current SITE-V3.4.5 context, rebuild or delete the old route instead of preserving compatibility.

## Operating Model

- Column-level production is independent; site-level publication is unified.
- Business Signals, First-Line Viewpoints, and Community Intelligence each own their monitoring, gates, persistence, and PR boundary.
- Reports Center and Dashboard follow the relevant upstream data chains.
- Hermes supervises, records, classifies, and hands off failures.
- Codex repairs root causes, validates fixes, records prevention, and prepares git changes.
- Hermes should not directly rewrite production rules, merge PRs, bypass gates, or judge Codex work by commit author name.

## Known Failure Patterns

- GitHub Actions schedule can be delayed or skipped during busy periods; Hermes must use staged checks instead of waiting blindly.
- Business Signals should not fail only because one source lane failed; source artifacts should isolate source-lane failures behind unified quality gates.
- Business Signals can regress when cardable Raw / Pool supply is too small, source titles are untranslated before Card promotion, or duplicate candidates crowd out qualified Cards.
- First-Line Viewpoints must keep morning RSS collection and afternoon follow-builders skill publishing separate.
- Community Intelligence depends on local logged-in collection; GitHub can publish already collected data but cannot replace the logged-in local collector.
- Weekly report content should be sourced from `01-SiteV2/content/08-report/` before site generation.
- Generated DuckDB files and JSONL tables must be rebuilt from source files and must not become production truth or Git-tracked content.

## Memory Boundaries

- Current version, release time, and freeze points belong in `context/version-ledger.md`.
- Current execution routes belong in `AGENTS.md`, `context/context-index.md`, and the relevant `context/` rule files.
- Daily monitoring results belong in reports and Hermes inbox items.
- Skill-specific learnings belong in each skill's `MEMORY.md`.
- Temporary task closeouts should not be copied here unless they create a durable rule.
