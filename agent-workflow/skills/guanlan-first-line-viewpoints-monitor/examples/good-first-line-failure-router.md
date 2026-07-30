# Good First-Line Viewpoints Failure Router Example

Use this when First-Line Viewpoints is stale, missing, or reported unhealthy.

## Correct Behavior

1. Decide which path is failing:
   - morning RSS page-data and data gate;
   - GitHub RSS fallback publication;
   - afternoon local follow-builders skill archive;
   - supervision visibility only.
2. Check the valid window:
   - RSS lane should not be declared failed before the 09:50 consolidated closure.
   - Afternoon skill lane should not be declared failed before 16:30 Asia/Shanghai.
3. For morning RSS, verify:
   - same-date `follow-builders-daily.json`;
   - remarks count greater than `0`;
   - builders count at least `6`;
   - `assert-follow-builders-data.mjs --date=<date>` passes;
4. For GitHub fallback publication, repair only commit/PR/merge/Pages if build and gate passed.
5. For afternoon skill publish, verify:
   - output file exists;
   - output frontmatter `builder_items_count > 0`;
   - publish report exists;
   - publish report `builder_items_count > 0`;
   - output and report counts match.
   - report has no unresolved `Publish Failure` section;
   - automation branch was pushed, PR merged to `main`, and Pages succeeded when the local task used `-Merge`.
6. If afternoon feed/archive generation is healthy but push, PR, merge, or Pages failed, classify it as `afternoon_publication_failure`. Repair the publication path only.
7. After accepted data reaches local `main`, refresh the external Guanlan AI Vault and require `assert:guanlan-vault` to pass.
8. Close the production incident only after validation and a prevention artifact are recorded.

## Incorrect Behavior

- Treating GitHub CLI timeout as proof that First-Line data failed.
- Creating an RSS failure inbox before the 09:50 consolidated closure.
- Creating an afternoon skill failure inbox before 16:30.
- Treating a zero-count publish report as success because the report file exists.
- Treating a healthy builders feed/archive report as full success when push / PR / merge / Pages failed.
- Re-running or blaming the builders feed when the real error is a stale remote branch ref causing `force-with-lease` rejection after an earlier same-day PR deleted the remote automation branch.
- Using removed repository-Vault timeline files as proof of current publication health.
- Replacing missing morning RSS page-data with the afternoon all-builders archive.
