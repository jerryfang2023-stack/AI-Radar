# Guanlan Monitor Quality Gate Scorecard

This scorecard is the script pre-gate for `guanlan-daily-monitor`.

It is not the final Raw / Pool quality decision. Final downstream permission comes from `guanlan-daily-monitor-qc`.

## 1. Evidence Integrity

Check:

- Source level distribution is logged for traceability only.
- `source_level` / `acquisition_source_level` are not used as gates, ranking signals, or downgrade reasons.
- Non-community keyword evidence exists.
- Failed sources and fallback paths are logged.
- Source distribution is available for operational diagnosis, not eligibility scoring.

Risk it catches:

- Missing original evidence despite healthy-looking source distribution.
- Source labels accidentally being reintroduced as quality gates.
- Missing fallback notes.

## 2. Full-Text And Evidence Readiness

Check:

- Downstream-worthy Raw has `has_full_text=true`.
- Extraction quality is `high` or `medium`.
- Raw archive, Raw JSON, source URL and content hashes are present where required.
- Pool does not replace Raw.

Risk it catches:

- Clean text or summary being used without preserved full text.
- Missing evidence files before downstream writing.

## 3. Coverage Scope

Check:

- Raw count reaches normal or degraded-day minimum.
- Pool count reaches expected range.
- Required source classes and monitoring lanes are represented.
- Theme concentration warnings are logged.

Risk it catches:

- Monitor returning a narrow, repetitive or underfilled day.
- One theme, vendor or source family dominating the run.

## 4. Keyword Path Compliance

Check:

- Keyword monitoring ran.
- Non-community paths were attempted.
- Search path distribution is logged.
- Important keyword groups without coverage have explicit evidence gaps.

Risk it catches:

- AI HOT or follow-builders running alone while keyword monitoring silently fails.
- Community or aggregator paths being treated as enough.

## 5. Business-Signal Relevance

Check:

- Raw titles and evidence show AI/business relevance.
- Off-topic materials stay below the configured ceiling.
- `core_pool` is not filled with generic homepages, tool pages, directories, login pages or search results.
- Candidate materials contain a concrete action, release, adoption, funding, customer movement, pricing change, regulatory signal or workflow impact.

Risk it catches:

- Quantity targets filled by irrelevant or low-information pages.
- Tool directories or vendor homepages promoted to core materials.

## 6. Downstream Readiness

Check:

- `core_pool` has enough usable candidates.
- Each downstream-worthy candidate has source metadata, full-text status, extraction quality, route, and missing-information notes.
- Items that are only discovery, index, watchlist or weak signal are not marked as ready.

Risk it catches:

- Daily assets or articles starting from thin Raw.
- Candidate status inflated to keep the production chain moving.

## Outcome

Script outcome:

- `script_pre_gate=passed` when automated score and hard thresholds pass.
- `script_pre_gate=failed` when thresholds fail after retries.

Downstream outcome must wait for:

```text
agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-qc.md
```

Final downstream statuses:

- `allowed`
- `degraded`
- `blocked`

If script pre-gate passes but QC is not run, downstream status is `pending_qc`.
