# V2 Rollback Plan

Status: planning draft.

## Current Task Boundary

This task creates V2 skeleton and planning files only. It does not alter production sync, production automation, V1 content, Netlify config, or site output.

## Future Cutover Rollback Requirements

Before any future production change to paths, sync scripts, or automation:

1. Confirm user explicitly requested V2 production restart or cutover.
2. Record current Git status and baseline reference.
3. Back up `04-Site/data/`.
4. Back up any file to be modified.
5. Run syntax gate before and after.
6. If sync fails, preserve previous V1 valid data.
7. Write failure report with attempted path, failure reason, downgrade path, and owner.

## Never Do

- Do not use destructive reset.
- Do not overwrite V1 content during isolation.
- Do not silently replace `radar-data.json`.
- Do not mark a cutover complete without relation checks.

