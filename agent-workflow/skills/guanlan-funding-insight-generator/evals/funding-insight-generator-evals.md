# Funding Insight Generator evals

1. `verified_event_only`
   - Pass when only verified funding CanonicalEvents with approved titles enter generation.
2. `unique_historical_owner`
   - Pass when repeated event IDs across historical bundles trigger secondary research once.
3. `secondary_search_is_discovery`
   - Pass when search snippets and provider answers cannot satisfy evidence.
4. `captured_exact_quote`
   - Pass when every evidence quote is a substring of a captured source body.
5. `explicit_investors`
   - Pass when current-round investors are explicitly named, or when an explicitly undisclosed round publishes only with an empty investor list, `investor_disclosure_status=not_disclosed`, and the retained `investors_missing` risk marker.
   - Fail when a generic category is converted into an institution, or when missing investor data publishes without the complete non-disclosure exception.
6. `two_cited_sources`
   - Pass when every published card cites at least two captured sources.
7. `deepseek_provenance`
   - Pass when generated cards record `deepseek-v4-pro` and the current prompt version.
8. `application_boundary`
   - Pass when card analysis and exact-match links do not mutate canonical events, entities, Claims, or RELATION-V2.
9. `blocked_not_public`
   - Pass when blocked queue entries are absent from the frontstage card list.
10. `historical_resume`
    - Pass when a rerun reuses accepted cards and retries only missing or blocked events unless forced.
11. `primary_product_form`
    - Pass when a new card explicitly selects one active product form from what customers buy or users directly use.
    - Fail when a company is classified by an enabling model or chip, a privacy feature, a target industry, or a future robot use case.
12. `reviewed_product_form_precedence`
    - Pass when card-explicit classification wins first, a governed historical decision wins second, and the keyword classifier is used only when neither exists.
13. `compute_layer_separation`
   - Pass when hosted GPU or inference capacity is `compute_service`, physical compute/network systems are `compute_system`, and model-serving or optimization software is `data_infrastructure`.
14. `standard_market_category`
   - Pass when the public first level is exactly AI Infrastructure, Horizontal AI, or Vertical AI, following the CB Insights AI 100 core-offering framework.
   - Fail when product forms such as model, cloud service, enterprise platform, or application are displayed as peer market categories.
15. `two_level_classification`
   - Pass when market category answers where the company sits in the AI market and product form separately answers what customers buy or users use.
16. `reviewed_company_round_merge`
   - Pass when accepted organization aliases are applied before company-round aggregation, source events are preserved, and Team Aligned Inc. / Aligned produces one Series B card.
