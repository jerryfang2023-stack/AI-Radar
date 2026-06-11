# Bad Signal Card Example

Use this to recognize failure signatures.

## Bad Title

AI research lab NeoCognition lands $40M seed to build agents that ...

Why it fails:

- Title is incomplete.
- Title is not translated for Chinese frontstage.
- Ellipsis hides the event.

## Bad Subject

Anthropic销售人员用Claude Code重建团队工作流

Why it fails:

- Subject is a title-like phrase, not a clean entity.
- Use a company, organization, product, customer, or institution instead.

## Bad Detail Fields

News Fact:
融资信息：原文关键数字包括 $40M。

Original Points:
- 融资信息：原文关键数字包括 $40M。
- 关键词：$40M、$40 m、50%、$920M。

Value:
可观察融资金额、资金用途或赛道线索：AI research lab NeoCognition lands $40M seed to build agents that ...

Why it fails:

- It summarizes extracted numbers instead of source facts.
- It repeats the same generic sentence across fields.
- It uses title text as value analysis.
- It invents confidence from keyword extraction rather than evidence.

## Bad Core Pool Candidate

Candidate-only item:

```json
{
  "status": "pooled",
  "notPromotedReason": ""
}
```

Why it fails:

- Candidate-only Core Pool evidence is visible to Hermes, so it must explain why it did not become a formal Card.
- Add `notPromotedReason`, `repairSuggestion`, and `promotePriority`.
