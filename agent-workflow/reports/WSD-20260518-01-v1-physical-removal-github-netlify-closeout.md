# WSD-20260518-01 V1 旧站与旧文章归档物理移除收口

- 日期：2026-05-18
- 状态：github-pushed / netlify-deployed
- 执行窗口：当前调度窗口直接执行

## 用户要求

删除网站 V1 版本相关的文章、代码，以及 GitHub 和 Netlify 上相关的代码。

## 已删除范围

- `10-Archive/v1.0/`
- `01-SiteV2/content/00-inbox/legacy-import/`
- `01-SiteV2/content/00-inbox/legacy-full-import/`
- `agent-workflow/tools/unified-site-sync.mjs`
- `agent-workflow/tools/the-point-browser-qa.mjs`

## 明确保留范围

- `01-SiteV2/` 当前 V2 站点、内容生产线和知识库。
- `09-ai-news-radar/`，按用户此前要求暂不处理。
- `10-Archive/legacy/` 与根目录长期 agent / 调度治理文件。
- Netlify 当前发布目录仍为 `01-SiteV2/site/`。

## 同步更新

- `AGENTS.md`、`docs/agent-handoff.md`、`agent-workflow/progress.md` 已更新为 V2-only 且 V1 旧站物理移除口径。
- `agent-workflow/governance/current-context.md`、`quality-gates.md`、`dispatch-state-reconciliation.md`、`window-dispatch-hub.md`、`agent-memory.md`、`README.md`、`automation-fallback-policy.md` 已清理旧 V1 归档 / 04-Site 口径。
- Dev Agent / Data Agent 岗位说明已改为读取 V2 站点和 V2 内容路径。
- `run-quality-gates.mjs` 已移除 V1 `unified-site-sync` 检查，`automation` 检查改为 V2 生产线脚本。

## 验证结果

- `node --check agent-workflow/tools/run-quality-gates.mjs`：通过。
- `node --check agent-workflow/tools/v2-content-gate.mjs`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs site`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs automation`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs v2content`：未通过，原因是 2026-05-18 当日内容生产缺口（今日观察长文 / 变化卡未产出），与 V1 删除无关。

## GitHub / Netlify

- GitHub：已提交并推送到 `main`，提交 `d2fe186d`（`chore: remove v1 site archive`）。
- Netlify：已发布当前 `01-SiteV2/site/` 到生产站点。
- Production URL：`https://wavesight-ai-preview.netlify.app`
- Unique deploy URL：`https://6a0ab245547906e0cbead985--wavesight-ai-preview.netlify.app`
- Build logs：`https://app.netlify.com/projects/wavesight-ai-preview/deploys/6a0ab245547906e0cbead985`
