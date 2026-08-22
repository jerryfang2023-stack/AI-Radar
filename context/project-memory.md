---
status: current
scope: project-memory
last_updated: 2026-08-22
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
- Data Center and Application Center are internal foundations, not public columns. Public products are independent application websites; Funding Insights consumes governed Data Center data without exposing the internal two-center navigation.
- Dashboard / Operations Console is a backend-facing operations surface, not a public content column.
- Business Signals is the V4 SourceArtifact / RawDocument / Claim / CanonicalEvent factual production chain. Retired Raw / Pool / Card assets are absent from the working tree and recoverable only from explicit Git history; they have no active production, page, relationship, or operations consumer.
- First-Line Viewpoints and Community Intelligence are independent data lanes projected into the V4 Data Center shell.
- The local DuckDB data lake is an analytical index layer for machine queries; the externally configured Guanlan AI Vault is the human-readable operations and knowledge front door. Repository code, raw snapshots, canonical JSON, site data, and operational reports remain in Git and outside it.

## Non-Negotiable Rules

- Deploy WaveSight compatibility/internal pages through GitHub Pages. Deploy the independent AI financing site through its atomic VPS release path. Netlify is retired and must not be used as a fallback.
- Do not restore legacy content-output routes as required outputs.
- Do not restore legacy copy gates as publication blockers.
- Builders / First-Line Viewpoints must not be used as business-signal facts, relationship-graph evidence, or trend-candidate evidence.
- Community posts are demand signals unless recaptured through source-backed business evidence.
- If an old rule conflicts with `SITE-V4.6.1-research-retirement`, rebuild or delete the old route instead of restoring retired content.
- China-market coverage is a scope projection inside the existing V4 fact chain. Source categories are descriptive only: no source weights or ranking bonuses are permitted, and procurement/tender sources remain disabled for this scope.
- First-Line Viewpoints and Community Intelligence keep their existing content contracts. FDE / AI Hardware are Event Library themes, relationships are embedded in Entity Library detail, financing cards and reports publish to the independent AI financing site, and Opportunity Map is an unlisted internal lab.
- DeepSeek is the sole production source-title translation provider. Formal translation-registry entries must retain `deepseek_title_translation` plus a non-empty model identifier; manual-reviewed, MyMemory, business-rule, and missing-provenance entries are not approved publication translations.
- A verified funding event may publish without named investors only when captured evidence confirms the financing but discloses investors solely by generic category. The card must keep an empty investor list, set `investor_disclosure_status=not_disclosed`, retain the `investors_missing` risk marker, and never materialize the generic category as an institution.
- Funding publication is one atomic application release: card, accepted identity/taxonomy decisions, reviewed classifications, institution registry, Data Center monolith and split service, Trend Radar, and Opportunity Map must be rebuilt, gated, and committed together. A card-only commit is incomplete even when card validation passes.
- Legacy V3 column URLs remain redirects only; no public page may load V3 navigation, V3 page assets, or the V3 desk JSON.

## Operating Model

- Column-level production is independent; site-level publication is unified.
- Business Signals, First-Line Viewpoints, and Community Intelligence each own their monitoring, gates, persistence, and PR boundary.
- Weekly/monthly report Markdown follows the relevant upstream data chains and publishes through Final Closure to the AI financing site; Dashboard follows its operations chain.
- Hermes supervises, records, classifies, and hands off failures.
- Codex repairs root causes, validates fixes, records prevention, and prepares git changes.
- Hermes should not directly rewrite production rules, merge PRs, bypass gates, or judge Codex work by commit author name.

## Known Failure Patterns

- GitHub Actions schedule can be delayed or skipped during busy periods; Hermes must use staged checks instead of waiting blindly.
- Business Signals should not fail only because one source lane failed; source artifacts should isolate source-lane failures behind unified quality gates.
- Business Signals can regress when immutable source capture is incomplete, source titles remain untranslated before V4 event publication, or duplicate discovery candidates reduce accepted factual coverage.
- First-Line Viewpoints must keep morning RSS collection and afternoon follow-builders skill publishing separate.
- Community Intelligence depends on local logged-in collection; GitHub can publish already collected data but cannot replace the logged-in local collector.
- Weekly and monthly report content is sourced from `01-SiteV2/content/12-applications/industry-reports/` before site generation.
- Local knowledge refresh writes only to the externally configured `GUANLAN-VAULT-V1.0` directory map. The removed repository `vault/` and retired Obsidian targets under old production paths must not be recreated.
- Generated DuckDB files and JSONL tables must be rebuilt from source files and must not become production truth or Git-tracked content.

## Memory Boundaries

- Current version, release time, and freeze points belong in `context/version-ledger.md`.
- Current execution routes belong in `AGENTS.md`, `context/context-index.md`, and the relevant `context/` rule files.
- Daily monitoring results belong in reports and the neutral production incident registry. Hermes may create only control-plane liveness incidents.
- Skill-specific learnings belong in each skill's `MEMORY.md`.
- Temporary task closeouts should not be copied here unless they create a durable rule.
