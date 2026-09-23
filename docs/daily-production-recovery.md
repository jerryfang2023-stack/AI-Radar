# Daily production recovery

The four Windows production tasks remain the local owners; daily inspection and
repair are operator-owned. Recovery, Closure and Hermes watchdog timers are retired.
Cloud dispatch success is not
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
   Unresolved truncated discovery titles may stay deferred only when no
   CanonicalEvent requires their translation. Shared title/job deduplication
   retains the canonical requirement; unresolved public-event titles still block.
   Indian `crore` monetary spans are protected before model translation and
   restored verbatim afterwards. Validate the restored title against the
   original amount and currency; neither repeated model arithmetic nor a
   relaxed numeric gate is a repair for a tenfold conversion error.
   Calendar equivalence accepts spaces between a Chinese month number and 月;
   translated months, days and years remain protected. A correct spaced Chinese
   date must not force repeated model calls or source recollection.
   Chinese growth increments must compare with the final English multiplier:
   "增长一倍" corresponds to "doubled", whereas "增长两倍" corresponds to
   "tripled". Keep changed durations and growth-to-level wording distinct.
   The September 21 regression uses both actual rejected DeepSeek translations;
   repair the numeric comparator rather than replacing the source or bypassing it.

## Preserve operational state

After a workspace migration, Windows directory junctions can preserve an old
invocation path while Node resolves the module to its new physical path.
Production CLI entry guards must use `lib/module-entry.mjs`, which compares
real paths, rather than comparing `process.argv[1]` with a module URL as strings.
Otherwise collection, generation and gates can exit zero without running.
The community CLI junction regression and runtime entry-identity tests cover
both direct execution and import-only behavior on Windows and Linux. A zero
exit code still needs a fresh dated output/gate before publication is accepted.

After rebuilding collection telemetry, rebuild the OPS console projection before
staging. Its embedded telemetry metadata must exactly match the accepted telemetry
file, including the generation timestamp. `test:ops-unified` runs in both PR CI
and Pages deployment; never relax this equality to publish a stale OPS snapshot.

Funding round recovery prioritizes the referenced, accepted funding Claim's
financing sentence over the event object, which may describe a product. For
example, an infrastructure product description must not replace an explicitly
disclosed Series C round. Preserve historical-round disambiguation and immutable
source quotes; rebuild reused cards through the canonical evidence normalizer.
Prospective Chinese headlines such as “又要融资” or “寻求融资” do not establish
completion. The shared transaction-status guard applies both to factual status
and to persisted/recovered funding cards. Keep the original evidence and partial
event, but exclude financing talks (including a potential valuation) from completed
funding publication. The September 22 regression covers this boundary without
letting a future round mentioned in a completed round's background suppress it.

Cross-day review must distinguish new reporting from a new financing. On
2026-09-19, the accepted CLS original explicitly identifies 新生探途 as Anew Labs
and dates its $290 million first external round to September 16; the application
identity review and source-event links retain all three disclosures. Crusoe's
September 18 Newcomer summary (nearly $4 billion at a $30.9 billion valuation)
repeats the September 17 TechCrunch Series F disclosure ($3.9 billion at the same
valuation). Their reviewed source-event links aggregate one round while keeping
both original amount/date disclosures. Do not implement a general fuzzy-amount
merge or edit accepted Claims to achieve this projection.

- Network preflight checks both proxy environment variables and Git proxy
  configuration. A dead loopback Git proxy receives an empty process-scoped
  override inherited by Vault, OPS and the sibling financing publisher. User
  configuration is never rewritten; reachable and remote proxies stay intact.
  Windows PowerShell uses quoted Git parameters to preserve empty values.

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

Afternoon source intake uses the repository-owned
`prepare-follow-builders-intake.mjs`, which fetches the same three upstream feeds
concurrently with bounded request/body deadlines. It does not fetch unused remote
digest prompts or read personal delivery settings. The former generic helper's
unbounded fetches and five sequential prompt downloads could exhaust the outer
180-second process budget before returning any diagnostics. Failed feeds remain
explicit; empty usable intake fails before replacing the accepted Markdown.
The Windows runner's durable report lives under
`<runtime>/follow-builders-skill/<date>-follow-builders-skill-local-publish.md`.
Supervision selects the latest exact-date local report from that directory or
the active worktree, falls back to the canonical published report, and retains the original
failure cause. Final Closure accepts a fresh `manual_required` report as completed
supervision with unhealthy lanes, never as a missing report or a healthy release.

## Evidence and publication acceptance

An exact-head Production Code Checks run with `action_required` needs maintainer
review and approval. The waiter reports that run immediately; it must not silently
wait 15 minutes, approve itself, weaken repository policy, or restart collection.
After approval, reuse accepted lane inputs and resume publication. If later lanes
were generated against the same older main, reconcile their accepted intake and
model candidates by stable IDs, then regenerate shared projections before merging.

Publisher article date labels can sit outside the extracted body. Preserve the
first explicit article date (including `4 月 15, 2025`), not dates in related
stories. A verified date correction retains the original content hash and intake
lineage, rebuilds V4, and leaves out-of-window items in QA rather than publishing
them as current funding.

Qualified Chinese foreign-currency amounts such as `超千万美元` must retain
both currency and lower-bound status. A truncated metric (`超千万`) cannot
override an accepted Claim's full amount with an implicit CNY interpretation.

English elapsed-time text after a series letter (for example, `Series D 7 months
after last round`) is not a numbered sub-round. Keep genuine `C-1` / `C1`
labels; canonical reuse repairs the application round without recollecting sources.
Accepted Claims describing financing raised in multiple tranches with a capped
`Series C-1, up to ...` component require application review before publishing
the combined amount as a completed round. Keep factual Claims/Events intact,
exclude the card, and persist `funding_capped_tranche_requires_review` on retries.
Likewise, an accepted Chinese disclosure combining 天使轮及天使+轮 with a
cumulative financing amount stays review-only (`funding_combined_rounds_requires_review`).
Do not assign the cumulative amount or prior-round investors to the latest round.

Chinese financing headlines such as “智谱宣布完成…” must split “宣布” into the
action, not the funded company's Claim subject. Repair the deterministic factual
builder and rebuild from the same accepted intake; do not rename a generated
card to hide a malformed Claim subject. Exact source quotes and spans remain
unchanged, and existing organization aliases retain their evidence requirements.

Funding generation with `--recover-from-git-ref=HEAD` first resolves an exact
commit and checks whether that date's prior card bundle exists. A missing bundle
in a valid commit is a normal first run, not failed recovery. Invalid references,
Git errors, malformed JSON and invalid card arrays still fail closed. Existing
cards continue through the normal evidence and canonical-consistency gates.

Incremental funding reuse requires more than company and round: unless the
source event is already represented, normalized proceeds (including qualifier)
must match and disclosure dates must be within three days. A missing amount/date
or an additional investment resumes research rather than silently reusing an old
seed card. Historical-authorized sources retain their stricter independent-review
path. For founder-led English headlines, a directly named, linked recipient in
an accepted appositive financing sentence can resolve the company; pending
claims, negation, outward investments and mismatched amounts do not qualify.
`expanded its seed funding by` binds the incremental proceeds, not a later
paragraph about the founder's previous company. September 18 Hang Ten regressions
cover all three boundaries without changing canonical evidence.

Public company/product indexes require an accepted catalog decision with an
attributed reviewer. Coverage and frontstage construction share that admission
set and merge resolution. Unreviewed entities remain pending, with counts and
warnings; missing approved entities or event/mention evidence still block.

Entity materialization must retain aliases across accepted daily records of the
same stable ID, name and type. An empty latest alias array is not a withdrawal:
discarding historical Chinese aliases can silently remove Claim-backed
relationships. Latest verification status and explicit catalog corrections stay
authoritative; never repair this by rewriting immutable daily evidence.

Production code PR checks run secret-free on Linux and Windows, including with
a production-shaped external evidence-root environment. Fixture tests must bind
their own evidence root rather than inherit the runner's private store.
The PR checks also run `test:data-center-site`, the same frontstage contract
suite used after daily materialization. Person coverage assertions compare
accepted review-ledger IDs rather than historical catalog sizes; source-specific
community pages and job-level publication locks retain explicit contract checks.

Homepage banners, documentation index pages and monthly/yearly article archives
are discovery containers even when their body mentions a valid financing or
release. The shared source-URL gate rejects those containers in both generation
and integrity validation; resolve their announcement links before admission.
Rebuild the affected date from immutable intake so rejected containers retain
Raw evidence and explicit QA reasons rather than appearing as newly dated events.

Dated industry explainers (annual role-of essays and industry-chain outlooks)
are not product-release announcements merely because their body mentions open
source, products or prior policy targets. Preserve their Raw evidence in QA;
an actual named report or product announcement remains a separate eligible source.

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
Preserve source qualifiers such as `超`/`近` when
extracting proceeds; a numerically equal exact metric cannot replace a lower
bound or approximate disclosure. Repair accepted cards with the generator's
`--reuse-only=true --write=true` mode, then rebuild and gate the application
projections without repeating research.
Funding-claim extraction must also bind a candidate sentence to the funded
subject, source title, or the title's normalized financing metric. A financing
teaser for another company near the article lead is not evidence for the active
event. Qualitative Chinese lower bounds such as `超亿元` are normalized as CNY
lower bounds and remain authoritative when a persisted card is reused; reuse
repairs canonical amount/date/round before the card is admitted again.
Spaced Chinese round labels (for example, `D 轮`) remain proceeds wording.
Implicit approximate proceeds such as `近亿元` retain their qualifier and normalize
as approximately 100 million yuan, never as an unqualified billion-wide range.
Funding application market scope can use the funded company's source-bound legal
identity or headquarters evidence; a Chinese publisher or investor alone cannot
establish China scope, and this does not create canonical entities or Claims.
An earlier-clause financing verb cannot classify a later valuation as proceeds;
English valuation qualifiers such as `above` and `of more than` stay valuations.
Financing history reads the latest event snapshot first and requires an accepted
funding Claim whose subject resolves to the company; investor mentions and
unresolved headline-shaped subjects do not constitute that company's history.
Known naming variants are unified only by evidence-backed application identity
decisions, without rewriting canonical entity IDs or unrelated companies.
If an investment announcement does not disclose proceeds, retain the event in
the Data Center but exclude it from Funding Insights. Withdraw an incorrectly
published application card and prune its derived taxonomy decision; retain the
source evidence and a withdrawal reason in its queue.

Cancelled financing (`scrubbed`, `shelved`, or an explicit non-closing title)
must become a withdrawn factual event, not an announced financing. The factual
builder and financing admission share source-title detection; persisted and
recovered cards independently reject non-completed transaction states. Do not
scan unrelated historical body paragraphs to withdraw a completed current round.
Rebuild from the accepted intake, retain exact Claims, remove the application
card and its derived classifications, and preserve the blocked queue reason on
subsequent generator runs. The September 10 Listen Labs regression covers this
path without source recollection or new model research.

Fundraising tutorials and sector/year financing directories are discovery
containers, not single-company funding events. Reject them at source eligibility
before either deterministic or model-assisted event admission; retain their Raw
evidence and QA reason. A real company-specific announcement or retrospective
must not be rejected merely because its headline contains "How".

When accepted evidence separately names a completed current round and a
previously undisclosed historical round, bind current amount and round together
from that clause. A combined headline amount may remain the reported total, but
cannot overwrite current proceeds or turn a seed round into its prior pre-seed.
The funding consistency gate checks both the current amount and round label.

Funding taxonomy keeps an existing application-company ID until an approved
public profile or explicit identity decision resolves it. An exact name in Raw
event entities alone must not silently promote that ID into the public catalog.

Production Code Checks run for every pull request without path filters. Atomic
split-data publications can exceed GitHub's filtered diff limit and previously
left code changes unchecked. Verify both Windows and Linux results for the exact
head commit before merging; an empty check list is not a passing check.
The five daily cloud PR publishers enforce this with
`wait-for-production-code-checks.mjs --pr=<number-or-url>` and merge only with
its returned `--match-head-commit`. Missing, failed or changed-head checks leave
the accepted branch available for targeted publication repair; they must not
restart source capture.

Same-date shared V4 data alone cannot suppress the general Business Signals
collector: its dated `business_signals_pr` completion receipt must also prove
accepted collection/restoration and factual materialization. China Funding can
publish that shared date first without completing the general lane.
Production summaries preserve private-evidence, model-rebuild and required-title
outcomes so a later skipped gate does not conceal the earliest failed owner.
Final Closure accepts a supervision report only when generated during its current
child invocation; an older same-date report cannot certify a crashed invocation.

First-Line Viewpoints archives approved morning records by original URL on each
publication. Offline rebuilds merge the existing approved history before adding
new snapshots: shallow Git history or an absent translation cache must never
erase already accepted translations. Rebuild the full Data Center adapter after
history recovery so person profiles and last-seen dates recover with the list.
Business Signals and First-Line Viewpoints retain separate PR boundaries, but
their workflows share the `wavesight-data-center-publication` concurrency group
because both rebuild tracked Data Center projections. They must serialize rather
than create same-day generated-file merge conflicts.
All shared publication-lock users set `queue: max` as well as
`cancel-in-progress: false`. GitHub's default single pending slot can otherwise
cancel Builder RSS when China publication enters the queue while Business
Signals is running. Recover a cancelled, never-started RSS run only after the
existing accepted/active lanes are accounted for; do not displace their queue slot.
The checkout resolves the requested branch only after acquiring that lock;
the dispatch-time event SHA can already be stale when a queued job starts.
Checkpoint restoration unions same-date accepted main intake with the restored
input and recovers already-published cards from HEAD. Restoring an older overseas
checkpoint must not erase a completed domestic lane or trigger duplicate research.
Merged intake retains `collection_batches` with exact Raw IDs and eligible IDs.
China checkpoint recovery also rebuilds the date-scoped public evidence locator
index from private originals and reruns both evidence boundary gates, even when
capture previously passed. Diagnostic-only publication can roll back that index
independently of the accepted intake; capture success alone cannot skip hydration.
Daily China financing also writes body-free per-event card checkpoints under its
dated lane directory, covered by the existing checkpoint artifact. A later failed
card or projection must not discard successful research. Restored cards are still
revalidated against current canonical evidence; blocked results never publish.
Research discovery accepts a Chinese subject with an explicitly parenthesized
English name when a result uses only its Chinese name. It must not require the
literal bilingual display label in every secondary page. This affects candidate
discovery only, not canonical aliases or exact-quote/card publication gates.
China application scope also recognizes a source-quoted city/company apposition
such as “上海具身触觉公司 千觉机器人 宣布…”. It must bind the city descriptor
directly to the funded recipient; a publisher, investor or founder's university
does not establish the company's origin. Keep unsupported geography unclassified
instead of inferring it from a Chinese name, currency or unquoted headquarters.
Financing market commentary, ownership explainers and mixed financing/listing/news
headlines are discovery material, not single-company financing evidence. Keep their
originals and diagnostic reasons, but do not promote the headline subject into a
funded company or generate cards from that non-event.
The pre-commit gate reconciles all batch identities before comparing the original
lane log; never rewrite a 228-document collection log to claim it collected a
297-document composite. Missing or inconsistent batch coverage remains blocking.
First-Line Viewpoints also translates newly projected person descriptions, rebuilds
the adapter and gates public Chinese fields before staging the translation registry.

Community Intelligence validates the complete in-memory candidate before writing
the current snapshot, dated snapshot, or frontstage file. A collector error,
fewer than 12 accepted items, or fewer than three document links fails closed and
preserves the last-good tracked data for a later logged-in retry.
Collector rejection errors retain their source, stage and original error marker.
In particular, `COMMUNITY_LOGIN_REQUIRED` must reach the Windows wrapper so it
stops unattended retries and asks for manual authentication instead of reporting
only an aggregate collector-error count.
Recovery checks the freshly fetched `origin/main` snapshot with
`assert-community-intelligence-data.mjs --source-ref=origin/main`, recording its
exact commit while still verifying local private originals. A stale or dirty
local checkout is not a collection failure. Fetch/ref failures remain inspection
failures; the collector's default gate still validates its working-tree candidate.

Vault refresh uses an isolated `origin/main` worktree. Resolve broken manual-note
links at the referenced file and archive retired duplicate repository copies
outside the wiki. Do not weaken the Vault boundary gate to tolerate old roots.

Read or resolve external incident drafts with `--inbox-dir=<runtime>/production-incidents`
on `inbox:incidents` and `resolve:incident`; keep the same explicit directory when
following the generated repair prompt. The legacy in-repository registry remains
the default for historical records. A resolution must include the fix commit,
validation and prevention artifact; moving a draft is not a resolution.
