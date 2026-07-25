# FDE Projection Evals

1. Pass when every FDE row resolves to an accepted/partial event and Claim evidence.
2. Pass when absent needs, systems, teams, controls or outcomes appear under `undisclosed_fields`.
3. Fail when a URL/company hardcode supplies facts.
4. Fail when a generic service page becomes an implementation record without a concrete event.
5. Pass when final closure reports trailing 7-day and 30-day FDE output rates over observed V4 bundle days.
6. Pass when records without disclosed outcomes remain counted as `records_without_reported_outcomes`, with empty `reported_outcomes`; the health report must not infer ROI or implementation results.
7. Fail when a zero-output day lowers the FDE evidence gate, fabricates a record, or treats missing calendar bundles as observed zero-output production days.
