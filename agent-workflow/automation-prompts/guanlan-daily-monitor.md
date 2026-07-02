# guanlan-daily-monitor

Use the current V3 rule source:

```text
context/07-v3-intelligence-generation-rules.md
```

Daily monitoring only produces Raw candidates, Pool evidence, monitor logs, and QC handoff.

It does not write daily observation, business brief, trend report, site copy, or Card copy.

## Raw

Raw is the daily candidate layer. It collects external material and keeps source evidence.

Search providers are discovery entrances only. A usable record must resolve to the original source page.

Keep:

- URL and canonical URL;
- source name and source type;
- published date when available;
- full text or clean text;
- key excerpts;
- snapshot / archive path when available;
- content hash and full-text hash;
- extraction method and readability score;
- page type / evidence object type;
- missing information.

Homepage, directory, login, docs-index, tool-list, product catalog, package/model listing, marketplace listing, search-result, SEO, and navigation pages are `index_only` unless the page itself contains a dated concrete event.

## Pool

Pool is the evidence audit pool.

Any Pool item that may support a Card must have:

- original source link;
- readable body text;
- source summary or usable article lead;
- evidence excerpts;
- hash;
- Raw QC allow;
- clear importance reason.

Pool does not decide Card type, does not write frontstage copy, and is not a required manual middle layer before raw-to-card generation.

## Search Coverage

Search must actively cover:

- product / service launches;
- financing events, especially emerging companies;
- cases, customer deployments, vertical-industry examples.

Large-company news is allowed, but it must not crowd out vertical cases and emerging-company financing.

## Paused Lanes

The previous opinion / follow-builders lane is not part of V3 business-signal monitoring.
