# V2 Content Quality Gate

Status: isolation gate. It does not run production sync.

## Required Checks

- V2 content is under `06-content/v2/`.
- V1 directories remain read-only.
- Raw items have source level, source URL or archive path, and collection reason.
- Pool items have promotion or rejection reason.
- Structured Signals include event, evidence, business meaning, six-part decomposition, counter-evidence, and evidence gaps.
- Front Signals have at least 3 S/A/B sources.
- Opportunity titles are direction or scenario titles, not company names.
- Point material is calibration or boundary evidence, not fact evidence.
- Tags are split into seed, formal, and candidate layers.

## Blocking Failures

- V2 content written into V1 production directories without cutover approval.
- Front Signal with fewer than 3 S/A/B sources.
- Missing six-part decomposition.
- Certainty language or action command.
- Missing source trace.

