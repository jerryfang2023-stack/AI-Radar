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
