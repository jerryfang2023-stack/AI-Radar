# Good Top10 Contract Example

Use this pattern when checking whether the Business Signals lane is public-ready.

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
  "frontstageCards": [
    { "id": "BS-20260612-01", "source_url": "https://vendor.example.com/news/product-launch" }
  ],
  "frontstageSelection": {
    "top10_count": 10,
    "selection_date": "2026-06-12"
  }
}
```

Pass criteria:

- `top10` exists and has exactly 10 current production-date items.
- Each Top10 item points to a source-backed Signal Card.
- Each card is one of `product_service`, `funding`, or `case`.
- `frontstageCards` and `frontstageSelection` agree with the public Top10.
