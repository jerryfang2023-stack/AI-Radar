# Community Intelligence Monitor Memory

Durable production lessons only. Add entries when a failure is likely to recur.

## 2026-06-09

Community Intelligence collection is production-automated locally, but publication is independent through `.github/workflows/daily-community-intelligence-pr.yml`. A green local run still needs the community gate, `automation/community-intelligence-<date>` PR, merge to `main`, and GitHub Pages before the lane is considered published.
