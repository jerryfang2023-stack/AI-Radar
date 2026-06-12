# Skill Cleanup Top 20 Audit

Date: 2026-06-13
Skill Store version: v1.2.1

## Scope

This is the first cleanup audit batch. It intentionally excludes core Guanlan skills.

Selection rules:

- non-Guanlan skill;
- not current;
- no observed usage in action logs;
- no `evals/`;
- no `examples/`;
- cleanup queue candidate.

No skill was deleted, moved, or retired by this audit.

## Summary

| Decision | Count | Meaning |
|---|---:|---|
| Keep | 2 | Keep in store, but add evals/examples or governance metadata if still useful. |
| Merge | 9 | Consolidate into an existing skill or plugin before retiring the duplicate. |
| Archive | 4 | Move to archive review first; do not delete directly. |
| Observe | 5 | Keep in cleanup queue for one review cycle because possible future value remains. |

## Top 20 Decisions

| # | Skill | Decision | Replacement / Target | Reason | Next Action |
|---:|---|---|---|---|---|
| 1 | `fbs-bookwriter` | Archive | - | Large store-only writing system, no observed usage, no evals/examples, many scripts. | Move to archive review; keep restorable copy. |
| 2 | `frontend-dev` | Merge | `frontend-design` / project frontend rules | Overlaps with existing frontend guidance and product UI rules. | Compare unique scripts, then merge only reusable references. |
| 3 | `llm-wiki` | Observe | - | Personal knowledge-base tooling may still be useful outside Guanlan action logs. | Recheck after one cycle; archive only if no user need appears. |
| 4 | `minimax-docx` | Merge | `documents:documents` | Document generation overlaps with bundled Documents capability. | Keep only unique DOCX handling notes if any. |
| 5 | `content-ops` | Merge | `content-factory` | Content scoring/iteration overlaps with current content workflow. | Fold useful checklist into content-factory references, then archive. |
| 6 | `minimax-xlsx` | Merge | `spreadsheets:Spreadsheets` | Spreadsheet work overlaps with bundled Spreadsheets capability. | Keep only unique financial-formatting rules if valuable. |
| 7 | `baoyu-post-to-wechat` | Observe | - | Dormant, but publishing to WeChat may be operationally important. | Keep one review cycle; require account/auth validation before keep. |
| 8 | `lark-unified` | Observe | - | Feishu/Lark may be useful if external collaboration returns. | Keep in queue; archive if no Feishu task appears. |
| 9 | `minimax-pdf` | Merge | `documents:documents` / `nano-pdf` | PDF handling overlaps with current document/PDF capabilities. | Compare unique visual/PDF routines before archive. |
| 10 | `content-repurposer` | Merge | `content-factory` | Multi-channel repurposing overlaps with content factory. | Move useful platform rules into content factory references. |
| 11 | `wechat-topic-radar` | Observe | - | AI topic radar may still fit AI热点/公众号 workflows. | Add eval/examples if retained; archive if topic-center fully replaces it. |
| 12 | `ima-skills` | Archive | - | Store-only, dormant, no evals/examples; no current Guanlan dependency. | Move to archive review. |
| 13 | `skill-creator` | Keep | - | Meta skill creation remains useful, but needs governance coverage. | Add minimal eval/example or explicitly map to `guanlan-skill-editor`. |
| 14 | `ppt-slideshow` | Merge | `presentations:Presentations` | Slide generation overlaps with bundled Presentations capability. | Keep only unique HTML-slide visual rules if needed. |
| 15 | `agent-mail` | Archive | - | Dormant agent email integration, no current workflow dependency. | Move to archive review. |
| 16 | `note-organizer` | Archive | - | Dormant personal Joplin tooling, no Guanlan dependency. | Move to archive review. |
| 17 | `wechat-article-search` | Keep | - | Chinese source search can support research workflows. | Add eval/example and mark expected trigger boundaries. |
| 18 | `arxiv-watcher` | Merge | `arxiv-reader` / `research` | ArXiv monitoring overlaps with existing research skills. | Decide one ArXiv entrypoint and archive duplicate. |
| 19 | `github-ai-trends` | Merge | `github-trending-cn` | GitHub AI trends overlaps with GitHub trending monitor. | Merge report formatting into one GitHub trend skill. |
| 20 | `github-trending-cn` | Observe | - | Could support AI Radar source discovery, but lacks governance evidence. | Add eval/example if kept; otherwise archive next cycle. |

## Guardrails

- Do not delete anything in this batch.
- Archive before deletion.
- Any `Keep` item must receive eval/example coverage before leaving the cleanup queue.
- Any `Merge` item must name the replacement skill before retirement.
- Any `Observe` item needs a review outcome in the next cleanup cycle.
