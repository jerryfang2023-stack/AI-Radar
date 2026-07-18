# Weekly Business Change Radar Evals

Run these pass/fail checks after generating a weekly report.

## Required Checks

1. `headline_judgment`
   - Pass when the title states one strong, evidence-bounded judgment with both cognitive tension and a concrete business consequence.
   - Fail when it is a generic report label, a table-of-contents summary, or a stack of abstract transitions such as `进入 / 转向 / 升温`.

2. `not_news_roundup`
   - Pass when the report delivers judgment (trend chains, opportunity cards, contrarian views), not a list of news items.

3. `exact_data_counts`
   - Pass when §0 uses precise numbers from data files (e.g. "101 cards" not "~100 cards" or "about 100").

4. `trend_chain_evidence`
   - Pass when each of the 3 trend chains cites ≥2 specific Signals (company name + amount/product) and ≥1 named Opinion.

5. `opportunity_card_community`
   - Pass when every opportunity card cites ≥1 Community signal as demand evidence.

6. `scoring_breakdown`
   - Pass when every opportunity card includes the full 6-dimension itemized score table, not just a single number.

7. `five_step_method`
   - Pass when each trend chain walks through all 5 steps: technology → product → user behavior → business model → opportunity.

8. `contrarian_named`
   - Pass when §6 names the specific mainstream narrative being challenged, with counter-evidence from ≥2 sources.

9. `role_specific_actions`
   - Pass when §8 gives different advice to each of the 5 roles (business owners, entrepreneurs, content teams, tech teams, Guanlan AI), not generic "you should use AI" advice.

10. `signal_boundary`
   - Pass when the report does NOT use Opinions or Community items as fact evidence for Business Signal claims.

11. `change_direction`
   - Pass when §2 heatmap includes change direction indicators (↑ → ↓) comparing this week to prior week state.

12. `complete_week_window`
   - Pass when the Monday automation covers exactly the previous Monday through Sunday and writes both required Markdown outputs.
   - Fail when it includes the current partial Monday or uses a rolling seven-day window.

13. `content_before_page`
   - Pass when the report content gate succeeds before any weekly page-generator invocation.
   - Fail when frontstage files change after a failed or missing content gate.

## Repair Loop

When a check fails:
- title is generic → select one claim from §1, §6, or the highest-certainty opportunity; rewrite it with tension plus a budget/procurement/cost/responsibility/result consequence
- §0 vague numbers → re-read data files and extract exact counts
- §3 weak evidence → find specific company/product/amount from Signals, return to Pool if needed
- §5 missing scores → run the 100-point scoring for each card
- §6 generic contrarian → find the actual mainstream narrative being challenged
- §8 generic advice → rewrite per-role with concrete 1-3 month actions
