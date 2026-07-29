# Weekly Business Change Radar Evals

1. `complete_week_window`
   - Pass when the run covers exactly the previous Monday through Sunday.

2. `v4_event_source`
   - Pass when every factual event comes from accepted V4 CanonicalEvents and uses a valid `[E:event_id]`.
   - Fail on V3 Desk, Signal Card, old graph, or legacy mapping input.

3. `namespace_boundary`
   - Pass when `[O:]` and `[C:]` support interpretation or demand context only and never establish event facts.

4. `exact_counts`
   - Pass when the data-boundary section reports exact manifest counts.

5. `trend_chain_evidence`
   - Pass when each trend chain cites at least two Events, one viewpoint, and one community item.

6. `unknown_ids_blocked`
   - Pass when every cited ID exists in the bounded manifest.

7. `opportunity_is_downstream`
   - Pass when scores, hypotheses, recommendations, and actions stay in the report and do not mutate V4 facts.

8. `lane_independence`
   - Pass when an Opportunity Map candidate failure cannot block weekly report content acceptance.

9. `content_before_page`
   - Pass when the content gate succeeds before deterministic page rendering.

10. `headline_judgment`
    - Pass when the title contains one evidence-bounded judgment and a concrete business consequence.
