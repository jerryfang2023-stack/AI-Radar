# WaveSight AI / 观澜 AI

WaveSight maintains the evidence-linked Data Center and produces financing
intelligence for the independent [AI financing site](https://www.zkdlj.vip/).
The public application is deployed from the separate Guanlan-Funding-Portal
repository; this repository owns the factual inputs and internal Pages surfaces.

Start with [the documentation entry](docs/README.md) for setup and operations,
[current state](context/00-current-state.md) for accepted inventories, and
[daily recovery](docs/daily-production-recovery.md) for failed-stage recovery.
Agents must follow [AGENTS.md](AGENTS.md) and its task-specific routes.

Publication uses the [concurrency and secondary-review contract](agent-workflow/harness/publication-concurrency-and-review.md).
The VPS publisher binds `GUANLAN_PUBLICATION_RUNTIME_ROOT` to its registered
writable runtime directory; see the [VPS runbook](docs/financing-vps.md)
for ownership, receipts and recovery. Accepted `--source-sha` inputs remain
fixed while independent publication targets run or resume.

The [financing data foundation](docs/financing-data-foundation.md) keeps shared
facts and evidence, an independent financing read database, separately versioned
application indexes and distinct financing/topic sections in the Obsidian Vault.

Runtime logs, credentials, private original bodies and local databases stay
outside Git. A funding update is complete only after website and Mini Program
release receipts match; GitHub Pages success alone is not public publication.
