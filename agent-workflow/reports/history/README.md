# Historical execution evidence

These reports were moved out of the current report directory after checking file references and active producers. Their original bytes are unchanged.

- `2026-07/`: 52 historical Community / Follow-Builders local publication reports.
- `2026-09/`: one superseded local frontstage check; this is evidence for its original date, not current acceptance.
- [Restoration index](index.json): original paths, archive paths, SHA-256, sizes and original Git commits.

Reports still referenced by July 19, 26, 29 and 30 supervision or health records remain at their original paths. Historical monitor logs used by Skill usage statistics also remain in place. Frozen backup inventories continue to describe their original snapshot and are not rewritten.

## Recovery

For historical inspection, open the archive file directly. When an explicit historical replay requires the original layout, use an isolated checkout, copy the exact indexed archive file to its original relative path only if that destination does not already exist, and verify SHA-256 against `index.json`. The `sha256` field records the original archival bytes; after a Git checkout that changes CRLF/LF, normalize CRLF to LF and verify `normalizedLfSha256`. Never overwrite a current report. Original tracked reports can also be recovered from their recorded Git commit; text checkout can normalize line endings.

The archive keeps evidence, not runnable instructions. Current generation continues to write dated reports in the normal runtime/report location. No cleanup timers or business generation were added.
