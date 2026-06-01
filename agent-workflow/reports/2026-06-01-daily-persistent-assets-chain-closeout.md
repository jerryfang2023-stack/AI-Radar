# 2026-06-01 Daily Persistent Assets Chain Closeout

- status: implemented
- scope: GitHub Actions daily asset persistence
- workflow: `.github/workflows/daily-persistent-assets-pr.yml`
- mode: persistent_assets_pr

## Decision

Raw / Pool / Card are no longer treated as temporary GitHub Actions artifacts only.

Daily production assets must be persisted into a GitHub automation branch and PR so the local Obsidian vault can sync them later.

## Implemented Chain

1. Run Daily Monitor with QC.
2. Confirm Raw / Pool post-monitor gates.
3. Persist Raw candidates, Raw originals and Pool candidates.
4. Generate Signal Cards and Opinion Cards.
5. Persist generated Card assets when asset generation succeeds.
6. Run cardcopy and Pool-to-Card duplicate gates.
7. Persist site data only if frontstage gates and freshness gates pass.
8. Write a daily persistent asset manifest.
9. Push to `automation/daily-assets-YYYY-MM-DD` and open or update a PR.

## Guardrails

- No direct push to `main`.
- No auto-merge.
- No deploy.
- Raw / Pool persistence is not blocked by later cardcopy or frontstage failures.
- Site data is not persisted unless cardcopy, dedupe, site sync and pre-commit gates pass.
- Every run writes:
  - `agent-workflow/reports/YYYY-MM-DD-persistent-asset-manifest.md`
  - `agent-workflow/reports/YYYY-MM-DD-persistent-asset-manifest.json`

## Why This Fixes The Gap

The previous dry-run and cards-only chain could generate Raw / Pool / Card inside a temporary GitHub runner and upload artifacts without making those files part of repository history.

This caused local Obsidian gaps whenever artifacts were not downloaded, a PR was not opened, or a branch was not merged.

The new chain makes GitHub PR persistence the durable boundary. Once the PR is merged and local Git/Obsidian sync runs, the assets become visible locally.

## Validation

- `git diff --check -- .github/workflows/daily-persistent-assets-pr.yml`: passed.
- Workflow file inspected for stale `cards-only` labels: no remaining matches in the workflow body.

## Remaining Risk

The workflow still needs a real GitHub Actions run to verify GitHub expression handling and PR creation permissions in the cloud environment.
