# Daily production recovery

The seven Windows tasks remain the local owners. Cloud dispatch success is not
collection, publication, or website completion. Inspect the earliest failing
step and its log: a `continue-on-error` step can have a successful API conclusion
despite a failed outcome.

## Restore the accepted input

1. Inspect the dated supervision report under `%LOCALAPPDATA%/WaveSight/runtime`
   and the corresponding Business Signals workflow run.
2. Reuse a failed/cancelled/timed-out run only when source capture or checkpoint
   restore succeeded **and** the non-optional private-evidence archive succeeded.
   A public artifact alone contains locators, not the original bodies needed for
   rebuild. Quality failure must not prevent archiving captured originals.
3. Dispatch `daily-persistent-assets-pr.yml` with the same `date` and
   `resume_run_id`. Restore its immutable artifact, skip collection, and resume
   the failed stage plus dependent builds. This also applies to a failed resume.
4. Source-title fixes use approved DeepSeek metadata as read-time overlays.
   Do not rewrite accepted source intake/index files or discard translation
   provenance. A private title can expand only the exact accepted prefix.
   A reused content hash is not title identity: bind provenance to the source
   URL, exact original title and capture date, and select private metadata with
   the same date/URL. Model generation revalidates existing candidate decisions
   with `--reuse-existing=true` instead of replacing successful work on retries.

## Preserve operational state

- Repair logs, supervision, gates, telemetry and incident drafts belong in the
  runtime directory. Commit only reviewed source/data changes and audit evidence.
  Controller and repair entrypoints default there, including manual npm calls.
  Runtime gate and telemetry are consumed together only when their source
  fingerprint matches the current Git commit and dated canonical JSON bundle;
  stale or unbound diagnostics cannot override a newer published snapshot.
- Existing repair worktrees are refreshed only when clean, on the expected
  branch, and fast-forwardable to `origin/main`. Preserve divergent or dirty
  work; use a separately reviewed repair branch instead of force-resetting it.
- Each command retains full output in external log files and bounded report
  tails. The Codex timeout is 30 minutes; its caller allows three more minutes.
- Run `npm run assert:windows-automation` to verify task ownership, and
  `npm run test:ops-v2` for runtime regressions. Manual Final Closure respects
  the current collection window; `--force-afternoon-window=true` is an explicit
  retrospective check, not the default before 16:10.

## Evidence and publication acceptance

Public company/product indexes require an accepted catalog decision with an
attributed reviewer. Coverage and frontstage construction share that admission
set and merge resolution. Unreviewed entities remain pending, with counts and
warnings; missing approved entities or event/mention evidence still block.

Production code PR checks run secret-free on Linux and Windows, including with
a production-shaped external evidence-root environment. Fixture tests must bind
their own evidence root rather than inherit the runner's private store.

After the gated atomic application set merges, verify a successful internal
Pages deployment of that commit or a proven descendant. A cancelled deployment
superseded by a newer successful release is not a publication failure. That
receipt means `awaiting_portal`: Final Closure still invokes the independent
Funding Portal publisher from `origin/main`, validates and atomically deploys
the VPS release, and reads back the website and Mini Program contract. Compare
the source commit, latest data date and card/report counts. A Mini Program data
update is distinct from a new WeChat client binary release.

Funding amounts require proceeds-specific evidence, not merely a number in a
valid quoted source. Chinese post-amount financing and valuation-rise wording
must remain covered by regressions. A valuation may remain a labelled metric,
but cannot populate financing amount, disclosure amount or funding history.
If an investment announcement does not disclose proceeds, retain the event in
the Data Center but exclude it from Funding Insights. Withdraw an incorrectly
published application card and prune its derived taxonomy decision; retain the
source evidence and a withdrawal reason in its queue.

First-Line Viewpoints archives approved morning records by original URL on each
publication. Offline rebuilds merge the existing approved history before adding
new snapshots: shallow Git history or an absent translation cache must never
erase already accepted translations. Rebuild the full Data Center adapter after
history recovery so person profiles and last-seen dates recover with the list.

Vault refresh uses an isolated `origin/main` worktree. Resolve broken manual-note
links at the referenced file and archive retired duplicate repository copies
outside the wiki. Do not weaken the Vault boundary gate to tolerate old roots.
