# Bad Unverified Fact Promotion Example

This is a cross-lane contamination failure.

```yaml
---
date: 2026-06-12
source_platform: logged-in-community
source_url: https://community.example.com/post/xyz
verification_status: community_lead_only
promoted_to: business_signal_card
card_type: case
---

title: "Company X deployed Agent Y across its whole sales team"
detail: "A community user said this happened, so it is treated as a verified customer case."
```

Why it fails:

- A community post is a lead, not verified Business Signals evidence.
- No Raw / Pool verification exists.
- The item must not feed Signal Cards, relationship graph evidence, or trend candidates until separately verified.
