---
title: WaveSight 01-SiteV2
date: 2026-07-30
status: current
encoding: UTF-8
---

# WaveSight 01-SiteV2

This directory owns the SITE-V4.3 website, canonical source/data files, downstream application data, and frontstage build scripts. It is not an Obsidian vault.

## Production Boundaries

| Layer | Location |
|---|---|
| Public site | `site/` |
| Public body-free evidence locators | `content/01-raw/source-index.jsonl` |
| Complete original bodies | External private `WaveSight-private-evidence` repository only |
| Canonical V4 bundles | `content/11-databases/data-center-v4/` |
| Downstream application data | `content/12-applications/` and `site/data/` |
| Accepted industry report Markdown | `content/12-applications/industry-reports/` |
| Independent local knowledge base | External Guanlan AI Vault configured by `GUANLAN_VAULT_ROOT` |

RawDocument stores body-free metadata and a private `evidence://<content_hash>` locator, Claim stores exact verifiable spans, and CanonicalEvent stores accepted V4 commercial facts. Reports, trends, opportunities, funding research, viewpoints, and community material are downstream application or independent-column outputs and must not flow back into canonical V4 fact tables.

V1/V2/V3 page plans, candidate Markdown, Signal Cards, desks, old graphs, legacy mappings, and `compatibility_cards` are absent from the current working tree and recoverable through Git history only.

Current rules start at the repository-root `AGENTS.md`, `context/12-data-center-v4.md`, and `context/frontstage-page-contracts.md`.
