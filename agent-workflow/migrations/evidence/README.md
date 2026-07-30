# Private Evidence Migration Boundary

Current V4 production reads immutable snapshots only from
`01-SiteV2/content/01-raw/originals/`.

`npm run backup:private-evidence` creates a physically separate, private,
content-addressed backup:

- one original body per `content_hash`;
- a complete snapshot-to-object catalog;
- `manifests/non-production-historical-sources.jsonl` for historical sources
  that are not referenced by the latest V4 production bundle;
- no backup object or historical migration manifest under the repository,
  public site, or Guanlan Vault.

The Guanlan Vault stores citation cards and repository-relative snapshot
locators only. It never stores the full original body.
