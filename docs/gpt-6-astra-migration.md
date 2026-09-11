# GPT-6 Astra migration and code audit

Date: 2026-09-11. Baseline: `main` at `4c5f058cc8`. Scope: project Codex execution, model-routing evaluation and governed Skill operations. This is not a SITE-V6 or factual-schema migration.

## Findings and repairs

| Severity | Confirmed defect | Owning repair and evidence |
|---|---|---|
| P2 | Routing runner had 22 cases while its prompt and schema demanded 26; funding-insight governance was omitted. | `run-model-routing-evals.mjs` checks the active registry, includes 23 cases and derives schema size/IDs from the manifest. |
| P2 | Duplicate results could earn credit; any existing path qualified as evidence; incorrect decisions still returned successful process status. | `lib/model-routing-score.mjs` rejects invalid IDs and shapes, gives duplicate rows no credit, requires an exact quote from the owning Skill/eval and fails incorrect profiles. Quotation relevance still requires semantic review. |
| P2 | Custom-agent smoke runs could pass after timeout. | `run-custom-agent-smoke-evals.mjs` requires successful termination without timeout. |
| P2 | Quality-reviewer pinned SITE-V4.2 and exploratory roles treated V3 as a compatibility execution route. | `.codex/agents/` now resolves current context and bounds V3 to explicitly requested history. |
| P2 | Skill editor eval/example required an external mirror sync even when outside task scope; `repair:skills` wrote that mirror implicitly. | Owner eval/example and repair command now require repo synchronization and leave personal-store writes explicitly scoped. |
| P2 | Governance dashboard preferred personal-store metadata, so an upgraded project Skill failed with the old mirror version. | Dashboard producer and gate use project truth for governed Skills, retaining separate drift reporting; regression verifies the external copy is untouched. |
| P2 | Empty headings satisfied the Skill contract validator. | `guanlan-skill-ops.mjs` requires nonempty section content, excluding comments. |

## Execution and algorithm design

- Primary and quality review: `gpt-6-astra`, high reasoning. Experience review: Astra, medium. Evidence exploration/default subagent: retained Terra, medium. No global user configuration was changed.
- Keep deterministic manifest, schema, deduplication, citation and aggregation checks in code. Keep semantic evidence interpretation and acceptance with the responsible reviewer.
- Skill Store `2.3.0` uses `GPT-6-ASTRA-SKILL-V1.0`. Only the defective authoring contract and related governance surfaces were rewritten; domain Skills retain their established ownership and evidence rules.
- Remove the superseded GPT-5.6 authoring reference, obsolete Top10 authoring example, stale version pins and contradictory external-sync requirements. Preserve historical model baselines and original evidence.
- DeepSeek translation/report/funding provider contracts remain independent. No direct OpenAI API adapter was introduced. Existing Codex ChatGPT authentication supports the execution path.
- The current working directory's Guanlan Vault is a read-only projection. The implementation source is this WaveSight repository.

## Validation

- 36 local regression tests pass across model-routing scoring, Skill Ops and catalog behavior.
- All 23 governed Skills pass the updated contract and five-case trigger inventory checks; repo runtime drift is zero.
- Three custom-agent configurations pass static preflight; TOML parses with the intended model/effort combinations.
- Dashboard build and semantic contract pass. One personal compatibility-mirror drift is informational and intentionally retained.
- `git diff --check` passes.
- Live `astra-high` routing evaluation passed: 23/23 correct decisions, 23/23 exact citations, 46/46 points in 155.44 seconds. See `agent-workflow/reports/model-routing-eval-latest.json` and its Markdown rendering.
- The first live run correctly rejected an incomplete funding test scenario (45/46). The scenario was amended to include all existing non-disclosure requirements; no business gate was weakened. The original run is preserved in `agent-workflow/reports/2026-09-11-astra-routing-incomplete-funding-case.json`.
- The first run's decisions and quotations were manually reviewed. This bounded suite does not establish production extraction quality, report cost or deployment readiness; the medium-effort and legacy comparison profiles were not live-run in this migration.

## Release and rollback

Changes are local and uncommitted. No collection, production data regeneration, credential changes, push or deployment was performed. Review the diff and the live evaluation before release. A rollback should restore only this migration's files from the recorded baseline and regenerate the repo Skill mirror/dashboard; do not reset unrelated future changes or recollect accepted data.

## Official references

- [OpenAI Docs: GPT-6 Astra migration and prompting](https://developers.openai.com/api/docs/guides/latest-model)
- [Codex configuration basics](https://learn.chatgpt.com/docs/config-file/config-basic)

## Extended scope: Mini Program and community Skills (2026-09-12)

The user explicitly included `02-Miniprogram` and the six community/content Skills in `C:/Users/86186/.skill-store`. Those local Skill sources are outside the Git repository; their exact patch and before/after hashes are recorded in `agent-workflow/reports/2026-09-12-community-skill-migration.{patch,json}`. Original files are backed up under `C:/Users/86186/.codex/backups/guanlan-astra-20260912`. No global model settings were changed.

### Mini Program implementation

The native client has no direct LLM call. It inherits the repository's Astra maintenance configuration; its product version remains 0.9.9 and its server contracts retain independent versions.

- `02-Miniprogram/miniprogram/utils/payment.js`: capture request identity, reject delayed successes for a different identity, and prevent old expiry responses from removing a new token or replaying operations for another account. Current-token authentication retries remain bounded to one; a second expiry clears that token. Old permission errors cannot invalidate a newer identity's list cache. Existing community callers retain the `COMMUNITY_CHANGED` error contract.
- `02-Miniprogram/tests/payment-identity.test.mjs`: eight deferred-response regressions cover membership, redemption, protected content, bounded retry and identity-scoped cache invalidation.
- `02-Miniprogram/AGENTS.md`: describe the inherited Astra execution boundary and required validation without introducing a client API key or model endpoint.

`npm run verify` passed: funding/report projection builds, 130 tests and validation of 25 pages / 56 JavaScript files. Build outputs produced no tracked data diff. No UI layout changed; native device checks, upload and publication were not performed.

### Community Skill changes

| Skill | Implemented change |
|---|---|
| guanlan-community-monitor | Keep CLI collection ownership; separate evidence capture from optional scoring; route identity and score rules to one shared reference. |
| guanlan-sharing-archive | Resolve season from evidence; remove scheduled-run publishing permission and duplicate CLI/scoring instructions; reuse accepted raw data and respect backend-owned second-season scheduling. |
| guanlan-zaolang-profile-writer | Astra session owns drafting and review by default; DeepSeek remains an explicitly requested compatibility path. Remove mandatory cross-project candidate generation, unnecessary confirmation and fixed background/review quotas. Preserve source attribution and channel distinctions. |
| guanlan-zaolang-card-maker | Complete an authorized multi-person batch serially after each person's checks; wait only when the user requested per-person approval. Keep original quotes and visual rules. |
| guanlan-season-recap-profile-card-maker | Reuse recorded final-source approval and accepted outputs. Both generation and batch validation now reject empty/duplicate/stitched quotes and highlights absent from their quote through a shared gate. |
| guanlan-wechat-cover-maker | Reuse accepted illustration when only title layout changes; remove duplicated composition instructions while preserving official Logo and visual acceptance requirements. |

Skill Markdown is 105 lines shorter overall, including the new shared points reference. Seven quote-gate tests pass, including subprocess checks that both generation and batch acceptance reject empty evidence before rendering. All six Skills pass Skill Creator structural validation, and changed Markdown relative links resolve. The dashboard was rebuilt; all 23 separately governed repository Skills remain valid with zero repo-runtime drift. The six external community Skills are not reclassified as those 23 governed Skills.

Live Astra high evaluation passed in 69.93 seconds: 14/14 decisions and 14/14 exact citations, 28/28 points. The decisions and supporting quotes were manually reviewed. The first run had all decisions correct but joined two noncontiguous source excerpts; it was correctly rejected at 27/28 and preserved in `agent-workflow/reports/2026-09-12-community-skill-eval-joined-citation.json`. The evaluation prompt now explicitly requires a single continuous source substring; the scorer and business rules were not relaxed. The existing 36 repository governance/scoring regression tests also pass after the extended migration.

### Remaining scope limits

- The previous Skills disagree about whether hosting and sharing contributions stack. Backend inspection confirms separate issue and operations ledgers; the migration records this conflict and requires current confirmed operating rules for an affected entry. It does not silently change business scoring, historical points or membership records.
- Structural checks and synthetic routing decisions do not certify real-world writing quality, image quality or collection completeness. Visual assets and real group messages were not regenerated or collected for this migration.
- Run the repeatable behavior suite with `node agent-workflow/tools/run-community-skill-evals.mjs --execute` and an available `CODEX_CLI_PATH`; without `--execute` it only checks the scenario inventory. The latest report is `agent-workflow/reports/community-skill-eval-latest.json`.
- Rollback the external Skills by comparing the recorded after-hashes before restoring the exact backed-up files; remove only the newly added files listed in the manifest. Do not copy whole directories over subsequent edits. At this migration checkpoint changes were local; the release record below supersedes this status.

## Automation, AIP essay and catalog closure (2026-09-12)

Completed the three follow-ups explicitly authorized by the user:

- **Automation:** `run-codex-self-repair.mjs` now constructs default arguments as an array and passes Astra/high through CLI flags, using `lib/codex-repair-model.mjs`. This works when the isolated repair worktree comes from an older `origin/main`; the controller does not depend on that worktree having the migration config. Explicit custom `--codex-args` remains a caller override. Seven installed WaveSight tasks point to the current local repository and none supplies this override. Inventory: `agent-workflow/reports/2026-09-12-automation-model-inventory.json`.
- **Runtime proof:** `probe-codex-repair-model.mjs` used the same model argument function to run a read-only, ephemeral startup probe in a separate directory containing a conflicting legacy model config. CLI startup logs reported `gpt-6-astra` and `high`, and the expected completion token was returned. This validates the launch model, not a complete unattended production repair. Report: `agent-workflow/reports/codex-repair-model-probe-latest.json`. Project configuration may be ignored if the temporary directory is untrusted; explicit CLI flags are the intended control regardless.
- **AIP community essay:** updated the owning `AIP/.agents/skills/guanlan-community-essay-writer` entrypoint, its eval, editorial methodology and UI prompt, with a scoped Astra execution reference. The current session owns drafting and review; topic/title methods are optional references rather than mandatory calls to the generic AIP provider pipeline. Full-draft requests do not acquire extra confirmation steps. User-requested confirmation, original-message quotations, speaker coverage, attribution and privacy constraints remain. Generic AIP and financing report provider rules were not changed.
- **Catalog:** replaced stale mandatory AIP/four-review/per-person-confirmation summaries; registered monitoring, recap cards and the AIP community essay. Corrected the platform mapping so public Community Intelligence belongs to the data-center lane and actual Guanlan group monitoring belongs to community operations. Rebuilt and validated the dashboard.

Validation: 31 relevant regression tests pass (including two launch argument regressions), Skill Ops and dashboard gates pass, the AIP Skill structure and relative references validate, and `git diff --check` passes. Live Astra high AIP evaluation passes all six decisions and six exact citations (12/12); each citation was reviewed. Repeat with `node agent-workflow/tools/run-community-skill-evals.mjs --aip --execute`. Report: `agent-workflow/reports/aip-community-skill-eval-latest.json`.

AIP source files were already untracked in their owning repository; they were preserved and backed up before modification under `C:/Users/86186/.codex/backups/guanlan-astra-aip-20260912`. Exact before/after hashes and review patch are `agent-workflow/reports/2026-09-12-aip-community-migration.{json,patch}`. No scheduled task was started or reconfigured, no real messages were collected, and no production repair or publication was triggered. This was the pre-release checkpoint; repository release and remote CI results are recorded below.

Official guidance: [Codex CLI configuration overrides](https://learn.chatgpt.com/zh-Hans/docs/config-file/config-advanced) and [Astra instruction migration](https://developers.openai.com/api/docs/guides/latest-model).

## Published release (2026-09-12)

The user authorized Git pushes and deployment, then specified Mini Program **1.0.0** and retained responsibility for submitting WeChat review. This section supersedes the local-only status of earlier checkpoints.

- WaveSight migration commit `25902bc205`, release fixes `aedaace4d7`, and final 1.0.0 source `e0d97059f7614599582bd3953d3b489caf58f2dd` are pushed to `origin/main`. Tags `guanlan-astra-migration-20260912`, `miniprogram-v0.9.10` and `miniprogram-v1.0.0` preserve their exact sources.
- AIP community essay and required references are pushed to the private AIP repository in commit `4296bea3a164a330e15940c04bd4201b2915a504`. An isolated worktree prevented publication of unrelated private drafts and two other local commits; the original AIP working tree was preserved.
- Mini Program **1.0.0** upload succeeded: 776387 bytes, 228 source files matched Git blobs, all 130 tests passed. [Upload evidence](../02-Miniprogram/docs/releases/1.0.0/README.md). The earlier 0.9.10 development upload is superseded. Review and public release remain with the user.
- [GitHub Pages deployment](https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/34624311455) passed for the final source. The first deployment failed because the dashboard recorded the old personal Skill editor mirror; the mirror was backed up, synchronized to the repository's 2.1.0 rules, and the dashboard regenerated. Both local and CI-environment contracts passed without weakening the gate.
- Protected OPS assets were atomically activated at `/var/www/wavesight-ops/releases/ops-astra-e0d97059f7`. Both remote SHA-256 hashes match committed content. Nginx configuration passes; unauthenticated console/data requests redirect to login, login returns 200, and account health returns 200. Prior releases remain available for rollback. Authenticated browser interaction was unavailable and is not claimed as tested.
- Financing, payment and membership service code did not change in this migration; their production releases were retained. Generic report providers were not replaced by an unverified production Astra API configuration.

Release fixes additionally passed 35 OPS runtime tests, the business-signal health fixture, two Astra launcher regressions and the version consistency gate. Exact deployment hashes and the additional Skill editor backup manifest: `agent-workflow/reports/2026-09-12-astra-release.json`. The external community Skill changes remain reproducible through the previously committed patches and manifests; their local originals are backed up.

## Operations backend implementation extension (2026-09-12)

The user explicitly included the operations backend after the Mini Program release. The earlier OPS deployment only refreshed catalog/version snapshots. OPS `3.6.3-astra-session-isolation` now changes the actual analytics, member-management and authentication clients and adds an explicit operations maintenance route to `AGENTS.md` and `docs/operations-console.md`.

Requests are accepted only for their originating session and current list/editor, with checks after network completion and JSON parsing. Logout clears analytics, member, schedule and aggregate content and invalidates in-flight work. Token actions keep the new session's write lock when an old action finishes; failed refreshes after writes remain visible. A delayed authentication bootstrap cannot reopen the logged-out console. Existing server permissions, arithmetic, idempotency and business decisions remain authoritative. The console contains no direct OpenAI inference route; the sponsor's Token model name is business configuration, not the Codex execution model.

Validation: 26 OPS unified tests, eight analytics tests, 35 OPS runtime tests, 29 Skill Ops tests, the business-health fixture, and two browser integration tests pass. New behavior cases cover reordered searches, delayed JSON parsing, former-session 401/403 responses, logout during reads, changing the selected member during a save, Token write-lock isolation and refresh failures. Browser fixtures exercise successful/failed member saves and Token configure/preview/confirm/receipt operations without real service writes. Version and catalog gates pass. Historical collection telemetry retains its original metadata; its regression now compares the entire metadata object with the accepted source rather than requiring a new dashboard release to rewrite history.

During validation the installed plugin inventory changed; the existing catalog refresh registered three newly discoverable Sites entries (287 total). These are inventory entries, not additional model-certified workflows. Mini Program 1.0.0's immutable upload remains unchanged. Release status and exact production hashes are recorded separately in the OPS 3.6.3 release receipt.
