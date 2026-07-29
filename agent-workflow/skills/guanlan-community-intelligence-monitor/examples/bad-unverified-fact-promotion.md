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
- No separately captured original source, exact-span Claim, or accepted CanonicalEvent exists.
- The item must not create Claims, CanonicalEvents, or RELATION-V2.1 rows. The underlying fact needs a separately captured original source and the V4 integrity gate.
