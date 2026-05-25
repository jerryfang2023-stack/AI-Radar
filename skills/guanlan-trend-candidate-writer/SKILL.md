---
name: guanlan-trend-candidate-writer
description: Use when judging whether WaveSight AI daily Raw, Pool, signal cards, scene candidates, opinion cards, or recent history form a lightweight trend candidate. This skill writes trend candidate records or a no_trend_candidate_decision; it does not write full Trend Reports or force daily trend output.
---

# Guanlan Trend Candidate Writer

## Use For

- Checking whether new AI business signals are starting to form a trend.
- Writing lightweight trend candidates after Raw / Pool / Card generation.
- Updating an existing trend candidate with new supporting evidence.
- Explaining why no new trend candidate should be generated today.

Do not use this skill to write Trend Reports, trend flash reports, daily observations, business signal cards, or site pages. Trend Reports belong to `agent-workflow/automation-prompts/trend-report-writer.md`.

## Required Reads

Open only what the task needs:

1. `AGENTS.md`
2. `context/06-execution-harness.md`
3. `agent-workflow/product/trend-model.md`
4. `01-SiteV2/content/06-asset-candidates/README.md`
5. Today's Pool and generated Card / Opinion files.

Read only when needed:

- `agent-workflow/product/evidence-and-routing-rules.md` when evidence eligibility is unclear.
- `01-SiteV2/knowledge/10-Templates/trend-candidate-template.md` when creating a new candidate from scratch.
- Existing trend candidates from the past 7-14 days when deciding whether to update rather than create.

## Decision Tree

First decide one of three outcomes:

1. **Update existing candidate**: today's signals reinforce an existing direction.
2. **Create new candidate**: evidence crosses the lightweight candidate threshold.
3. **No candidate**: evidence is isolated, weak, duplicated, or already covered.

Never create a trend candidate just because a Raw title contains "trend", "趋势", "report", "forecast", or because a single article summarizes industry themes.

Before judging, confirm same-date Raw / Pool are not newer than the Card / Opinion files used as evidence. If Raw / Pool were rerun after assets, either regenerate assets first or mark the trend decision as blocked by stale downstream assets.

## Candidate Threshold

A new trend candidate needs all four:

- At least 2-3 related signals from today's Pool / Cards or recent 7-14 day history.
- At least 2 source types, such as official source, credible media, customer case, research, funding, product release, or builder / investor opinion.
- A clear commercial variable: budget, workflow, customer adoption, cost structure, revenue model, competitive position, risk responsibility, or procurement behavior.
- A boundary note explaining what is still missing.

Keep `trend_evidence_gate: threshold_pending` if the direction is plausible but not mature.

Do not upgrade to mature trend or Trend Report unless the separate Trend Report rules are met.

## Hard Stops

Do not create a trend candidate from:

- One company announcement.
- One vendor case page.
- One opinion thread.
- One AI HOT summary.
- Search results, index pages, directories, SEO pages, or failed provider text.
- A funding event without wider commercial pattern.
- A "three trends" article that only aggregates claims without new evidence.
- Stale Card / Opinion indexes generated before the latest Raw / Pool rerun.

If the best material is a single strong item, route it to 今日观察, 商业信号, or keep watching.

## Evidence Handling

Use only items that can be traced to eligible Raw / Pool / Card records.

Preferred evidence:

- `raw_qc_decision=allow`
- eligible `core_pool`
- generated business signal cards with linked Raw IDs
- scene / case candidates with concrete workflow or customer context
- opinion cards only as interpretation, not fact proof

Every candidate must name:

- `related_signal_cards`
- `supporting_changes` or `supporting_scenes` when available
- `supporting_opinions` only when useful
- `boundary_notes`
- `missing_information`
- `next_observation`

## Output Locations

New content candidate:

```text
01-SiteV2/content/06-asset-candidates/trend/YYYY-MM-DD--trend-candidate--slug.md
```

If the knowledge mirror is active for nearby trend candidates, also keep the same content synced to:

```text
01-SiteV2/knowledge/03-Asset-Candidates/trend/YYYY-MM-DD--trend-candidate--slug.md
```

No-candidate decision:

```text
agent-workflow/reports/YYYY-MM-DD-no-trend-candidate-decision.md
```

## Candidate Frontmatter

Use this minimum shape:

```yaml
---
id: TRC-YYYYMMDD-XX
type: trend_candidate
title:
date:
status: draft
asset_level: candidate
trend_evidence_gate: threshold_pending
fact_draft_gate: pending
frontend_copy_gate: pending
cardcopy_gate: pending
trend_hypothesis:
supporting_changes: []
supporting_scenes: []
supporting_opinions: []
source_types: []
boundary_notes:
next_observation:
missing_information: []
related_signal_cards: []
related_opinion_cards: []
formal_tags:
  track: []
  function: []
  scenario: []
  customer: []
  evidence: []
  stage: []
  region: []
  source: []
  opinion: []
---
```

Use existing IDs if updating a candidate. New IDs use `TRC-YYYYMMDD-XX`.

## Writing Rules

Trend candidate text is a state record, not a public article.

Keep it concise:

- `趋势候选`: one paragraph stating the hypothesis.
- `支撑材料`: bullets with concrete signals and why they point in the same direction.
- `风险边界与证据缺口`: what is not proven.
- `下一步观察`: what to watch next.

Do not write frontstage hype. Avoid:

```text
全面爆发、重磅、颠覆、风口、必然、已经成为趋势、未来已来
```

Use careful language:

- `正在形成`
- `可能指向`
- `暂按趋势候选管理`
- `仍缺少`
- `需要继续观察`

## No-Candidate Decision

When evidence is insufficient, write a short decision instead of staying silent.

Minimum fields:

```yaml
---
date:
decision: no_trend_candidate
checked_scope:
reason:
strongest_signal:
missing_evidence:
next_action:
---
```

The body should briefly state why no candidate was created. This is useful when the daily production chain ran but no trend should appear.

## Validation

After creating or updating a candidate:

1. Check that every cited signal can be traced to Raw / Pool / Card.
2. Check that the candidate is not based on one source family.
3. Check that `boundary_notes` and `missing_information` are not empty.
4. Run available content / style / cardcopy gates if the candidate is exposed to site data.
5. Sync site data only if the repository's current trend page reads these candidate files.

Report clearly:

- created / updated / no candidate
- files changed
- evidence count and source type count
- validation run
