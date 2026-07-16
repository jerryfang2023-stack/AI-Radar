# Taxonomy Governor Evals

1. Pass when every active TagAssertion has `tag_id`, `evidence_ref`, exact span, method, confidence and taxonomy version.
2. Pass when every active FacetAssertion has `dimension_id`, `value_id`, `evidence_ref`, exact span, method, confidence and taxonomy version.
3. Fail when Tags or Facets are assigned from full HTML, navigation, publisher, query, unrelated aggregated headlines, or legacy summary text.
4. Fail when product form, use case, industry, deployment model, or target user is duplicated as a technical Tag.
5. Fail when a definition matches one of its explicit exclusion terms.
6. Fail when Tags or Facets influence eligibility, value, ranking, relationship direction or truth.
