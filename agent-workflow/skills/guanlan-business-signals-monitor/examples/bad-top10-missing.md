# Bad Top10 Missing Example

This is a failure even if the backend looks busy.

```json
{
  "date": "2026-06-12",
  "status": "partial",
  "frontstageCards": [
    { "id": "BS-20260612-01", "source_url": "https://vendor.example.com/news/product-launch" },
    { "id": "BS-20260612-02", "source_url": "https://media.example.com/funding-round" }
  ],
  "frontstageSelection": {
    "candidate_count": 18,
    "selection_date": "2026-06-12"
  }
}
```

Why it fails:

- Public `top10` is missing.
- Candidate or selection counts do not substitute for the public Top10 contract.
- A repair should target the stage that writes or validates `top10`, not lower card quality gates.
