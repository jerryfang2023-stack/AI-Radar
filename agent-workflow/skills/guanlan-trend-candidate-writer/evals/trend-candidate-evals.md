# Trend Candidate Evals

Run these pass/fail checks after creating, updating, or auditing a WaveSight AI V3.3.1 trend candidate.

## Required Checks

1. `not_trend_report`
   - Pass when the artifact is a lightweight `trend_candidate` or `no_trend_candidate_decision`, not a full Trend Report or article.

2. `multiple_signal_threshold`
   - Pass when a new candidate cites at least 2-3 related business-signal Cards or eligible Core Pool items.

3. `multiple_context_threshold`
   - Pass when evidence comes from at least 2 source types or evidence contexts, not one source family.

4. `single_item_block`
   - Pass when no candidate is created from one article, one opinion, one company announcement, one funding event, one AI HOT summary, or one index/search/directory page.

5. `builders_isolated`
   - Pass when first-line builders viewpoints and opinion cards are not used as business-signal evidence.

6. `commercial_variable_named`
   - Pass when the candidate names a concrete commercial variable such as adoption, procurement, workflow, funding concentration, pricing, regulation, infrastructure cost, or customer deployment.

7. `boundary_not_empty`
   - Pass when `boundary_notes`, `missing_information`, and `next_observation` are present and specific.

8. `retired_gate_absent`
   - Pass when frontmatter does not include retired `cardcopy_gate`, publiccopy, daily-observation, business-brief, or Trend Report fields.

## Repair Loop

When a check fails, downgrade to `no_trend_candidate_decision`, add missing source-backed evidence, or keep watching. Do not lower the trend threshold to avoid an empty day.
