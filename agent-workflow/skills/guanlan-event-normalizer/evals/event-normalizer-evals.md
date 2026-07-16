# Event Normalizer Evals

1. Pass when every Claim quote equals its RawDocument source span.
2. Pass when every CanonicalEvent resolves to at least one Claim and SourceArtifact.
3. Fail when background or related-story text changes the title event type.
4. Pass when planned, in-progress, rumored, disputed and withdrawn states remain distinct.
5. Fail when source conflicts are overwritten or converted to a value judgment.
