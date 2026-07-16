# Bad Direct Projection

A hardware row contains a source URL but no `event_id` or `claim_refs`. It fails because a source artifact cannot bypass Claim and CanonicalEvent normalization.
