# WaveSight Code and Rule Audit Checklist

Use each applicable item as pass/fail. The five review axes are adapted from Addy Osmani's `code-review-and-quality` approach; WaveSight current context and stage ownership always override generic guidance.

## 1. Source of Truth and Reachability

- Resolve the current version and task route before inspecting implementation.
- Identify the actual entry command and every reachable child command.
- Inspect commands named `audit`, `check`, or `validate` for hidden sync, generation, repair, Git, or deployment writes before running them.
- Prefer direct read-only child checks or a proven dry-run when a wrapper mixes mutation and verification.
- Confirm workflow/script paths and imported modules exist with exact casing.
- Confirm declared CLI arguments are parsed, consumed, and forwarded to the stage that owns them.
- Confirm each generated artifact has one authoritative producer and at least one current consumer.
- Flag active references to V2 pages, legacy content outputs, publiccopy/cardcopy, old Top10/candidate modes, or retired copy gates.
- Do not flag historical reports merely for describing retired behavior.
- Treat a contradiction as confirmed only when both sides are reachable or one reachable implementation violates a higher-priority current source.

## 2. Correctness

- Compare the code's observable behavior with the current context and target Skill contract.
- Check empty, partial, stale, duplicated, malformed, and same-date rerun states.
- Check whether fallback behavior hides failures, leaks backend fields, or silently changes source ownership.
- Check that gates read the same artifact and field versions produced upstream.
- Check that failure/waiting/success classifications match actual GitHub and publication state.
- Check that tests validate business behavior, not only syntax or file existence.
- Check whether an error is swallowed, converted to success, or reported at the wrong stage.

## 3. Simplicity and Readability

- Flag duplicated condition trees, thresholds, path constants, selectors, and field-normalization logic.
- Flag compatibility branches with no current caller or consumer.
- Flag helpers that only forward calls without enforcing a boundary.
- Flag oversized scripts that mix collection, classification, publication, and UI rendering.
- Prefer deletion or reuse of an existing owner over a new abstraction.
- Distinguish maintainability smells from confirmed behavior defects.

## 4. Architecture and Stage Ownership

- Keep deterministic work in scripts, judgment/boundaries in Skills, release decisions in gates, and project truth in context.
- Repair title translation and source-backed fact extraction in Raw/Card/FDE asset generation, not frontstage suppression.
- Keep Pool as audit/repair evidence, not a mandatory selector before a source-backed Card.
- Keep Card types limited to `product_service`, `funding`, and `case`.
- Keep relationship edges Card-backed and source-linked.
- Require multiple same-direction Cards and evidence contexts for trend candidates.
- Keep First-Line Viewpoints and Community Intelligence out of Business Signal evidence unless separately verified through Raw/Pool.
- Keep Enterprise AI / FDE and AI Hardware as documented lenses, not extra Card types.
- Find shotgun surgery: one policy change duplicated across context, Skills, scripts, gates, and pages.

## 5. Security and Integrity

- Check secrets, tokens, webhook URLs, credentials, and personal paths are not committed or logged.
- Check external input is not passed unsafely to shells, templates, paths, or generated JavaScript.
- Check workflow permissions are minimal and third-party actions are version-pinned where practical.
- Check untrusted pull requests cannot access production credentials or deployment steps.
- Check artifact downloads, cache restores, and generated-data writes preserve provenance.
- Check repair automation cannot silently edit, commit, push, close incidents, or deploy outside its declared mode.

## 6. Performance and Reliability

- Find repeated full scans, repeated source collection, serial network work, and duplicate builds.
- Confirm retry/backoff/timeout logic does not turn permanent contract failures into endless reruns.
- Confirm idempotency for same-date data generation, Obsidian sync, comments, and publication.
- Confirm locks and PID files cannot leave a healthy lane permanently blocked after a crash.
- Confirm cached or previous-good data is used only where the current lane contract permits it.
- Confirm diagnostics do not trigger expensive recollection when downstream Card supply is already healthy.

## 7. GitHub Workflow Necessity

- Map every workflow trigger, job, output artifact, environment, permission, and deployment target.
- Name the single owner for collection, aggregation, validation, PR creation, merge, Pages build, and deployment.
- Flag duplicate schedules, duplicate Pages deployments, recursive workflow triggers, and jobs that rebuild unchanged artifacts.
- Confirm branch filters and path filters cannot skip required gates or trigger production from documentation-only changes.
- Confirm generated files are either committed by one controlled owner or built at deploy time, not both without a contract.
- Separate advisory audits from merge-blocking gates until false-positive behavior is proven.
- Retain a workflow only when it prevents a named failure or produces a required artifact not owned elsewhere.

## 8. Business Signals Contract

- Cards: publish every active-date qualified source-backed event that passes formal Card gates; no public Top10/candidate split.
- Relationship graph: use Card nodes and source-backed edges; no opinion evidence.
- Trend candidates: require repeated evidence; never promote one article, opinion, or funding event alone.
- Keep ordering by importance/impact without exposing sorting reasons as public copy.
- Preserve original-source traceability and never summarize a summary.
- Keep Raw provider/coverage shortfalls diagnostic when Pool/Card/frontstage contracts remain healthy.

## 9. Finding Quality Gate

- Cite tight evidence from the active path.
- Name the violated current contract.
- Explain downstream impact without speculation.
- Name the earliest owning stage.
- Propose the smallest repair and a concrete validation.
- Separate confirmed defects, likely risks, code smells, and cleanup.
- Do not recommend deletion until all current callers, workflows, imports, docs, and generated consumers are checked.
