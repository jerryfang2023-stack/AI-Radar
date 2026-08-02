# Taxonomy Governor Evals

1. Pass when every active TagAssertion has `tag_id`, `evidence_ref`, exact span, method, confidence and taxonomy version.
2. Pass when every active FacetAssertion has `dimension_id`, `value_id`, `evidence_ref`, exact span, method, confidence and taxonomy version.
3. Fail when Tags or Facets are assigned from full HTML, navigation, publisher, query, unrelated aggregated headlines, or legacy summary text.
4. Fail when product form, use case, industry, deployment model, or target user is duplicated as a technical Tag.
5. Fail when a definition matches one of its explicit exclusion terms.
6. Fail when Tags or Facets influence eligibility, value, ranking, relationship direction or truth.
7. Pass when frozen V3 Card tag-shape observations remain non-blocking compatibility diagnostics while current TAG-V4 assertions are blocked by the Data Center V4 integrity gate.
8. Fail when market layer, product form, industry, use case, or technology are flattened into peer values of one user-facing classification.
9. Pass when an adopted external framework records its source, exact adopted levels, and dimension boundary.
10. Fail when a Funding Insight source card lacks an explicit reviewed market category, subcategory where applicable, or product form and the public builder guesses one from keywords.
11. Fail when a world model, simulation model, or future robotics plan is classified as Physical AI without evidence of a current robot, vehicle, or autonomous machine product acting in the physical world.
12. Fail when a generic `technology` or `software` value is used as the customer's industry in an AI-only corpus.
13. Fail when a founder's former employer, work history, or an investor's background assigns a business classification to the funded company.
14. Fail when an event-level classification is copied to every linked entity instead of the exact target entity supported by evidence.
15. Pass when all 222 reviewed Funding Insight decisions produce evidence-backed `ReviewedEventClassification` rows that resolve to 222 canonical events and one target company per decision.
16. Fail when a reviewed classification fabricates a Claim span, omits exact research evidence, or loses its decision-to-canonical-event lineage.
17. Fail when Data Center, Funding Insights, Trend Radar, Opportunity Evidence, or entity profiles use a retired value, a different taxonomy version, or classifications inconsistent with the reviewed decision ledger.
18. Fail when the same event classification has different target-entity sets in Data Center, Trend Radar, and Opportunity Evidence, or when a consumer silently drops or adds an event/entity/dimension/value/provenance tuple.
19. Fail when a reviewed company classification reuses founder biography, investor history, or other secondary-party evidence, even if the classification value itself came from a human-reviewed decision.
20. Pass when Opportunity Map grouping reads TAG-V4.1 classification dimensions where they overlap the map axes and keeps opportunity-specific assertions separate.
