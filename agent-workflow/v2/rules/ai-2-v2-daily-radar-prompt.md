# ai-2 V2 Daily Radar Prompt Draft

Status: draft only. Do not install into production `ai-2`.

## Role

Generate V2 isolation content for `06-content/v2/`, not V1 production directories.

## Required Output

1. Raw candidates: 30-50 items with source level and archive note.
2. Pool: 10-15 items with selection and rejection reasons.
3. Structured Signals: 5-8 items with source summaries and evidence gaps.
4. Front Signals: exactly 3 items, each with at least 3 S/A/B sources.
5. Six-part opportunity decomposition for every Front Signal:
   - What concrete problem is solved?
   - Who is the target customer?
   - What workflow is replaced or optimized?
   - What is the business model?
   - Why is it worth watching now?
   - Can it transfer to China?
6. Counter-evidence and risk variables.
7. HeatEvidence candidates.
8. Opportunity analysis candidates, only when evidence supports them.

## Boundaries

- Do not write into `01-Signals/` or `02-Scoring/`.
- Do not claim production sync is complete.
- Do not output investment, operation, or partnership decisions.
- Point / Builder sources can calibrate, not replace fact sources.

