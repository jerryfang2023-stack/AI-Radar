# V4.3 Skill Pattern Gate

Date: 2026-07-29
Status: current
Owner: `workflow` / `product-commander`

## 1. Purpose

This file turns reusable Agent Skill patterns into a dispatch gate for WaveSight AI tasks.

It does not add long-running agents and does not allow temporary agents to replace stable process roles. It exists so each dispatched task states both who owns the work and which execution pattern should be used.

New dispatches must name at least one Skill Pattern. Complex tasks may combine patterns, but the order and hard stops must be explicit.

## 2. Patterns

| Pattern | Use For | Required Output | Must Not Do |
|---|---|---|---|
| Tool Wrapper | Reading stable rules, source registries, GitHub / Pages release rules, VI, typography, or quality gates | Files read, applicable rules, unusable boundaries | Treat tool output as the project conclusion |
| Generator | Dispatch notes, closeouts, stage reports, UI / copy tables, QA reports, content templates | Fixed-structure artifact, with missing fields called out | Replace templates with free-form summaries |
| Reviewer | Independent checks, source gates, screenshot review, content depth review, release advice | Findings, evidence, blockers, deferrable items | Self-approve implementation without review evidence |
| Inversion | High-risk product, page, algorithm, automation, or business-path changes | Diagnosis, options, confirmation points | Implement before the decision boundary is clear |
| Pipeline | Automation, data ingest, page development, deployment, migration, bulk asset handling | Stage order, hard gates, fallback behavior, closeout | Skip intermediate quality gates |

## 3. Recommended Combinations

| Task Type | Recommended Pattern | Execution Rule |
|---|---|---|
| Page quality / site UI / VI | Tool Wrapper + Inversion + Pipeline + Reviewer | Read current VI and page contracts, diagnose, implement by page, then review |
| Copy review | Tool Wrapper + Generator + Reviewer | Read current copy rules, update by table, then check boundaries |
| Product feature / new module | Inversion + Reviewer + Generator | Run product decision first, then generate module decision artifacts |
| Source / content automation | Tool Wrapper + Pipeline + Reviewer | Read source rules, run the ingest funnel, then run source and content gates |
| Commercial-event data chain | Tool Wrapper + Pipeline + Reviewer | SourceArtifact -> RawDocument -> Claim / Entity -> CanonicalEvent -> application projections -> gates |
| Deployment / GitHub Pages | Pipeline + Reviewer | Build, preview or smoke check, explain rollback and release risk |
| Dispatch / closeout / governance | Generator + Reviewer | Use fixed templates and verify against hard gates |

## 4. Dispatch Fields

Every dispatch card should include:

```text
Skill Pattern:
Pattern Order:
Hard Stops:
Reviewer:
```

## 5. Hard Gates

Do not mark a task accepted when:

- the dispatch lacks a Skill Pattern;
- a page task skips the current page contracts or VI rules;
- an automation task lacks pipeline stages or fallback behavior;
- a closeout only says the work is complete without evidence;
- the reviewer also implemented the change and no independent review evidence is provided;
- an external skill or repo is used without stating safety and adaptation boundaries.

## 6. Current V4.3 Rules

- Current version baseline comes from `context/version-ledger.md`.
- Current frontstage entries are Commercial Events, Industry Reports, Opportunity Map, Trend Radar, Funding Insights, First-Line Viewpoints, and Community Intelligence.
- Current backend entry is Dashboard / operations console.
- V2 homepage, daily observation, business brief, trend-report prose, and Netlify deployment are retired.
- `follow-builders`, AI HOT, HN, X, Reddit, search tools, and community sources are discovery or viewpoint routes. A fact requires separate original-source capture plus accepted V4 Claim/Event evidence.
- V4 daily automation belongs to Pipeline and must cover structured source intake, factual build, application projections, operations data, GitHub Pages, and local sync stages.
- V3 Card, desk, graph, legacy mapping, and compatibility interfaces must not return.
- Page, data, automation, and release tasks must write review evidence into closeout.

## 7. Closeout

Closeouts should report:

```text
Skill Pattern:
Pattern Order:
Files Changed:
Validation:
Remaining Risk:
Release / Sync Impact:
```
