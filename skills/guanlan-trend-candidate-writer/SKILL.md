---
name: guanlan-trend-candidate-writer
description: Use when checking whether V3 WaveSight signal cards form a trend candidate. Trend candidates are not trend reports and must come from multiple same-direction product, funding, or case signals.
---

# Guanlan Trend Candidate Writer

Use with:

```text
context/07-v3-intelligence-generation-rules.md
```

## Scope

This skill only creates or updates trend candidates.

It does not write trend reports, daily observation, business briefs, recommendations, or opinion-based judgments.

## Inputs

Use accepted Cards only:

- product / service cards;
- funding cards;
- case / vertical deployment cards.

Opinion / follow-builders material is not part of the current V3 trend-candidate input.

## Candidate Gate

Do not create a trend candidate from:

- one news item;
- one opinion;
- one funding event without broader repeated evidence;
- an article that merely says "this is a trend";
- tag overlap alone.

A trend candidate needs:

- multiple same-direction signal cards;
- more than one evidence context or source type;
- a repeated commercial variable;
- source-linked evidence boundary.

Commercial variables may include:

- product adoption;
- funding concentration;
- customer workflow;
- vertical deployment;
- infrastructure cost;
- procurement path;
- governance requirement.

## Output

Trend candidate text must explain:

- what the trend is;
- where it appears;
- what evidence supports it;
- what boundary remains.

Do not use internal status labels, generic density wording, or abstract "needs evidence filtering" phrasing as the main description.

