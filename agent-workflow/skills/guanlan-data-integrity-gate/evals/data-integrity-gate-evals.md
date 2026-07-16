# Data Integrity Gate Evals

1. Pass when 100% of events have source and Claim references.
2. Pass when 100% of tags have Claim evidence and exact spans.
3. Fail when FDE or hardware records point directly to source artifacts without an event.
4. Fail when boilerplate, search snippets, or forbidden judgment keys enter canonical outputs.
5. Pass when zero domain projections remains an explicit warning.
