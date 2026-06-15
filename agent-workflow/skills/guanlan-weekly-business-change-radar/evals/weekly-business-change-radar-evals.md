# Weekly Business Change Radar Evals

Run these pass/fail checks after generating a weekly report.

## Required Checks

1. `not_news_roundup`
   - Pass when the report delivers judgment (trend chains, opportunity cards, contrarian views), not a list of news items.

2. `exact_data_counts`
   - Pass when §0 uses precise numbers from data files (e.g. "101 cards" not "~100 cards" or "about 100").

3. `trend_chain_evidence`
   - Pass when each of the 3 trend chains cites ≥2 specific Signals (company name + amount/product) and ≥1 named Opinion.

4. `opportunity_card_community`
   - Pass when every opportunity card cites ≥1 Community signal as demand evidence.

5. `scoring_breakdown`
   - Pass when every opportunity card includes the full 6-dimension itemized score table, not just a single number.

6. `five_step_method`
   - Pass when each trend chain walks through all 5 steps: technology → product → user behavior → business model → opportunity.

7. `contrarian_named`
   - Pass when §6 names the specific mainstream narrative being challenged, with counter-evidence from ≥2 sources.

8. `role_specific_actions`
   - Pass when §8 gives different advice to each of the 5 roles (business owners, entrepreneurs, content teams, tech teams, Guanlan AI), not generic "you should use AI" advice.

9. `signal_boundary`
   - Pass when the report does NOT use Opinions or Community items as fact evidence for Business Signal claims.

10. `change_direction`
   - Pass when §2 heatmap includes change direction indicators (↑ → ↓) comparing this week to prior week state.

## Repair Loop

When a check fails:
- §0 vague numbers → re-read data files and extract exact counts
- §3 weak evidence → find specific company/product/amount from Signals, return to Pool if needed
- §5 missing scores → run the 100-point scoring for each card
- §6 generic contrarian → find the actual mainstream narrative being challenged
- §8 generic advice → rewrite per-role with concrete 1-3 month actions
