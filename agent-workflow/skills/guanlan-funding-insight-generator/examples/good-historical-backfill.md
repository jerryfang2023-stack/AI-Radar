# Good historical Funding Insights backfill

Request: Convert all historical verified funding events into Funding Insight cards using secondary search and DeepSeek.

1. Dry-run the requested range and report raw occurrences, unique event IDs, duplicates removed, and selected owner bundles.
2. Confirm DeepSeek and at least one search provider credential without printing secrets.
3. Run the historical backfill without force so accepted cards are reused.
4. For each unique event, capture source bodies through secondary search and send only those bodies plus the verified event to DeepSeek V4 Pro.
5. Publish a card only after explicit-investor, exact-quote, two-source, Chinese narrative, schema, and provenance gates pass.
6. Keep unresolved items as blocked queue entries with stable problem codes.
7. Rebuild the combined frontstage projection, run funding tests and regression, and report published versus blocked unique events.

Bad behavior includes researching the same event again for every daily duplicate, filling an investor from model memory, citing a search snippet, copying downstream analysis into V4 canonical data, or claiming blocked events were converted.
