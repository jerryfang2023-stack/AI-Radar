---
name: guanlan-monitor-quality-gate
description: Scripted pre-gate for V3 WaveSight daily monitoring. It checks Raw / Pool evidence quality, source resolution, page-type downgrades, coverage of product / funding / case material, and blocks downstream use when evidence is not source-backed.
---

# Guanlan Monitor Quality Gate

Use with:

```text
context/07-v3-intelligence-generation-rules.md
```

## Checks

The gate checks:

- Raw count and source traceability;
- original-source resolution;
- full text / clean text availability;
- extraction method and readability;
- hash availability;
- page-type downgrade correctness;
- Pool route correctness;
- `core_pool` evidence completeness;
- coverage of product / service, funding, and case / vertical deployment material.

## Blocks

Block downstream use when:

- search result or discovery text is treated as evidence;
- homepage, directory, login, docs-index, tool-list, product catalog, package/model listing, marketplace listing, search result, SEO, or navigation page enters `core_pool`;
- `core_pool` lacks original URL, readable body text, key excerpts, hash, or Raw QC allow;
- the day has only large-company product news and no attempt to capture financing or vertical cases;
- opinion / follow-builders material enters business-signal monitoring.

## Not Checked

This gate does not check daily observation, business brief, trend report, publiccopy, cardcopy, or Guanlan-style recommendations.

