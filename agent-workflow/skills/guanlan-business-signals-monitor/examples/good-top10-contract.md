# Good Top10 Contract Example

```json
{
  "date": "2026-06-12",
  "status": "ready",
  "top10": [
    {
      "rank": 1,
      "card_id": "BS-20260612-01",
      "card_type": "product_service",
      "title_zh": "Polished Chinese business-signal title",
      "source_url": "https://vendor.example.com/news/product-launch",
      "evidence_summary": "Concrete source-backed change, not a title rewrite.",
      "commercial_signal": "Workflow, budget, customer, pricing, or deployment variable.",
      "selected_reason": "Why this is in the daily public Top10."
    }
  ],
  "frontstageCards": [{ "id": "BS-20260612-01" }],
  "frontstageSelection": { "top10_count": 10, "selection_date": "2026-06-12" }
}
```

Pass criteria: `top10` exists, has exactly 10 current production-date items, and each item points to a source-backed Signal Card.
