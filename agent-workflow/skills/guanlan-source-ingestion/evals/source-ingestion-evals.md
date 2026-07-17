# Source Ingestion Evals

1. Pass when body-cleaning preserves article text and removes navigation/footer blocks.
2. Fail when discovery summaries, publisher names, search paths, or query tails create event facts.
3. Pass when unreadable or missing-source records are quarantined without being deleted.
4. Fail when a RAW-V3 object contains judgment or routing fields.
5. Pass when a targeted backfill candidate remains operational metadata until its original page is captured with provenance, snapshot, and content hash.
6. Fail when a search-result snippet, query text, or discovery summary closes a funding or deployment fact gap.
