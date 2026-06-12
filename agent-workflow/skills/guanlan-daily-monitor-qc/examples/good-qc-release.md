# Good QC Release Example

```yaml
result: passed_with_notes
score: 88
downstream_decision: allow_with_degradation
allowed_materials:
  - source_level: S
    extraction_quality: high
  - source_level: A
    extraction_quality: medium
blocked_materials:
  - homepage_or_directory_observation
  - discovery_only_without_original_source
required_notes:
  - list blocked Raw IDs
  - list missing S/A source gaps
```

Why it passes: the QC decision protects downstream use by naming exactly which evidence can proceed and which evidence is blocked.
