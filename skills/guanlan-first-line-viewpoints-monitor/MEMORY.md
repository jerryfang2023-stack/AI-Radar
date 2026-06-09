# First-Line Viewpoints Monitor Memory

Durable production lessons only. Add entries when a failure is likely to recur.

## 2026-06-09

Untranslated builder remarks can make the independent lane fail even when data generation succeeds. The generator should exclude incomplete translations before writing frontstage data, and the gate must keep blocking any pending translation status.

The 2026-06-08 builders-data miss was a route migration problem: `opinion-candidates.md` under `05-frontier-opinions` was already retired, while the current lane writes `follow-builders-daily.json`. Future checks should judge the JSON gate, not the old opinion-card path.
