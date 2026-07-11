# Daily Monitor QC Evals

1. `on_demand_only`
   - Pass when semantic QC runs only for an anomaly or explicit audit request and is not required by every publication.

2. `no_duplicate_release_gate`
   - Pass when the audit cites executable evidence/Card/frontstage gates instead of inventing P0 quantity rules.

3. `traceability_and_integrity`
   - Pass when original URL, full-text/snapshot/hash, excerpts, extraction quality and missing-information boundaries are checked.

4. `index_and_discovery_boundary`
   - Pass when index-like pages and unresolved discovery text are not approved as facts.

5. `stage_owned_findings`
   - Pass when every finding maps to source capture, evidence supply, Card/editorial quality, frontstage contract or publication.

6. `no_full_chain_rerun`
   - Pass when the audit recommends the smallest targeted repair and validation.
