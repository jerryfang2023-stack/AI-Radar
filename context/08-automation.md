# Current automation

Effective 2026-10-01, the recurring monitor is financing-only and independently implemented under `agent-workflow/financing/`. Read [the current execution contract](../docs/unified-daily-monitoring.md) for scope, commands, checkpoints and publication acceptance.

- One Codex heartbeat `ai` at 08:10 Asia/Shanghai performs the daily financing run; `funding-health-dispatch.yml` is manual-only recovery with no scheduled trigger.
- `funding-daily-pr.yml` covers all AI financing sectors and six consumer AI hardware categories, excluding embodied intelligence and robotics core businesses.
- All Windows monitoring timers, Community and Builders schedules, FDE discovery and non-financing hardware discovery are paused.
- Old comprehensive-monitor imports, Raw/Pool quotas, score refill, afternoon cutoff, history backlog and recursive repair agents have no authority in the financing runtime.
- Original-body storage, exact-span facts, financing-card validation and atomic publication are shared infrastructure.
- Accepted originals are immutable reusable input. Failed stages resume without recollection.
- Main merge and successful Pages precede `financing/publish.mjs`, which updates the lake, knowledge base, financing website, Mini Program and authenticated operations surface; live parity is required.

Existing financing weekly/monthly reports remain separately scheduled publication work and do not expand daily discovery. Historical data contracts and archives do not supply current execution rules.

For parallel changes in different modules, use [independent window submissions](../docs/independent-window-submission.md): one scoped worktree, branch and PR per window. Module PRs do not wait for unrelated local main sync; shared generated outputs and production publication retain their existing acceptance gates.
