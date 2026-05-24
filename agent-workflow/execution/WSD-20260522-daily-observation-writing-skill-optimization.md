---
task_id: WSD-20260522-daily-observation-writing-skill-optimization
date: 2026-05-22
status: completed
owner: Experience & Editorial
method: grill-me
---

# WSD-20260522 Daily Observation Writing Skill Optimization

## Task

Optimize the Daily Observation pitch / writer / QC skills after the Card asset model changed significantly.

The immediate quality issue exposed by the 2026-05-20 and 2026-05-21 drafts:

- Articles can sound coherent while overloading weak or candidate-stage cards.
- Funding / launch / partnership signals can be accidentally written as buyer-side budget shifts.
- `scene_candidate` and `trend_candidate` can leak into article conclusions as if they were mature changes or trends.
- Website display copy can become a compressed summary of objects instead of a frontstage commercial judgment.

## Grill-Me Decision Tree

### Q1. What is the new primary writing unit?

Recommended answer:

Daily Observation should not write from a flat card list. The primary writing unit is a narrow commercial question supported by 2-3 strongest eligible `signal_card` / mature assets. Candidate assets only help frame boundaries and observation windows.

### Q2. Can a generated card automatically carry an article conclusion?

Recommended answer:

No. `cardcopy_gate: passed` or `frontend_copy_gate: passed` only means the card copy itself is usable. It does not mean the card can support a broader article conclusion such as budget migration, adoption trend, or platform shift.

### Q3. How should funding, launch, and partnership cards be treated?

Recommended answer:

They are usually supplier-side signals unless paired with customer evidence, deployment metrics, contract language, renewal data, or buyer behavior. They can show what vendors are selling or investors are betting on, but not what buyers have already adopted.

### Q4. How should case cards be treated?

Recommended answer:

Case cards are the strongest Daily Observation material when they contain a named customer or verifiable workflow. But vendor case studies still need caution around metric definitions, sample scope, and customer-side validation.

### Q5. How should `scene_candidate` and `trend_candidate` be used?

Recommended answer:

They must not become the article's fact base. They can help decide whether multiple cards point to the same observation, but frontstage writing must describe them as still-emerging evidence boundaries, not as mature trends.

### Q6. What should the article direction become?

Recommended answer:

The article should move from "AI business trend summary" toward "one buyer-side commercial question." It should ask who changes behavior, who pays, who approves, what metric changes, and what cannot yet be claimed.

### Q7. What should the website display direction become?

Recommended answer:

The display copy should not compress all objects into a list. It should tell the reader what business decision is becoming harder or clearer today, using concrete commercial actions: buy, approve, deploy, renew, verify, stop, escalate, audit, or change budget.

## Required Skill Updates

- Pitch: add card-stage weighting, buyer-side proof ladder, and claim-strength control.
- Writer: add article direction rules for card-derived drafts and forbid broad conclusions from candidate assets.
- QC: add hard checks for supplier-side signals being overstated as buyer-side adoption, and for candidate assets being written as mature trends.
