# WSD-20260510-01 Dispatch Conflict Reconciliation Closeout

- Task ID: `WSD-20260510-01-dispatch-conflict-reconciliation`
- Board key: `SYS-10`
- Closeout date: 2026-05-10
- Owner: `workflow / pm`
- Final status: `accepted / governance-fixed`

## 1. Task Goal

梳理过去几轮流程升级后的冲突和漏洞，修复会影响后续任务派发、收口验收和状态回填的问题。

本轮只处理调度治理、看板、进度和 feature 状态，不修改 V2 网站页面、内容库、自动化本体或 Netlify。

## 2. Main Conflicts Found

### 2.1 状态优先级冲突

`docs/agent-handoff.md`、`progress.md` 和阶段报告中存在历史 `ready`、`completed / local-site-quality-pass` 记录，容易覆盖最新 failed closeout。

修复：新增 `agent-workflow/governance/dispatch-state-reconciliation.md`，明确状态优先级：

```text
用户最新裁决 -> 最新 closeout / failed closeout -> dispatch-board -> feature_list -> handoff 顶部 -> progress 顶部 -> 历史章节
```

### 2.2 失败任务继承漏洞

`V2-SITE-QUALITY-AUTO` 已失败关闭，但相关 stage summary、截图、reference mockups 和 `local-site-quality-pass` 仍可能被后续窗口误当成质量基线。

修复：在治理文件、handoff、progress 和 board 中写明 failed 任务不得继续派发原 Task ID，不得继承任何通过暗示。

### 2.3 合并任务回填漏洞

`V2-PUBLIC-COPY-FOOTER-CLEANUP` 和 `V2-PAGE-TIME-DIMENSION` 曾并入失败任务，如果仍显示 merged / passed，会误导后续派发。

修复：

- `dispatch-board.md` 标记为 `review / needs-successor-after-failed-merge`。
- `feature_list.json` 中 `GL-M4-030` 和 `GL-M4-031` 标记为 `review`。
- 明确如仍需处理，必须新建继任任务并补齐页面类硬闸门。

### 2.4 V1 / V2 路径混用

部分治理文件仍把 `04-Site/` 写成页面类任务默认入口，和 V2-only 生产开发口径冲突。

修复：

- `window-dispatch-hub.md` 页面类任务默认路径改为 `01-SiteV2/site/`。
- `quality-gates.md` 增加 V2-only 路径说明和 V2 常用检查入口。
- `automation-fallback-policy.md` 写明旧 `04-Site` 只作 V1 归档参考。
- `run-quality-gates.mjs` 的 `content` / `point` / `site` / `all` 模式改为 V2 默认入口，不再默认运行旧 `04-Site`。

### 2.5 自动化口径过期

`automation-fallback-policy.md` 仍写“V2 生产线待重建”，但当前 `V2-DAILY-AUTO` 已 active / scheduled。

修复：更新为“V2 每日内容自动化已启用”，并写明 09:00、`01-SiteV2/content/`、source registry、V2 quality gates 和不默认 production deploy。

### 2.6 下一步建议过期

`dispatch-board.md` 底部仍推荐已经完成的 `V2-DATA-PREVIEW-AUTO`。

修复：刷新“使用建议”，改为当前 V2 调度口径、失败任务边界和新任务派发规则。

### 2.7 Feature 状态不一致

`GL-M4-033` 已有 accepted closeout，但仍是 review；`GL-M4-030` 曾因合并关系被误保留为 passed。

修复：

- `GL-M4-030`：`review`
- `GL-M4-031`：`review`
- `GL-M4-033`：`passed`
- 新增 `GL-M4-038`：本轮治理修复

## 3. Files Changed

- `agent-workflow/governance/dispatch-state-reconciliation.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/governance/quality-gates.md`
- `agent-workflow/governance/automation-fallback-policy.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/tools/run-quality-gates.mjs`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/progress.md`
- `docs/agent-handoff.md`
- `agent-workflow/reports/WSD-20260510-01-dispatch-conflict-reconciliation-closeout.md`

## 4. Quality Gates

调度中枢已复跑：

```powershell
node -e "JSON.parse(require('fs').readFileSync('agent-workflow/feature_list.json','utf8')); console.log('feature_list.json OK')"
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：

- `feature_list.json OK`
- `syntax` Quality Gate passed
- 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-09-20260509-184045.md`

## 5. Acceptance Notes

本轮可标记为 `accepted / governance-fixed` 的原因：

- 解决了任务状态优先级冲突。
- 解决了 failed 任务被继续继承的问题。
- 解决了合并子项被误视为完成的问题。
- 解决了 V1 旧路径被当作 V2 当前入口的问题。
- 解决了 V2 自动化“待重建”与当前 active 状态冲突的问题。
- 解决了看板下一步建议过期的问题。

## 6. Next Dispatch Rule

后续新任务派发前必须先检查：

1. 是否触碰 failed / abandoned / stopped 成果。
2. 是否需要继任任务而不是沿用旧 Task ID。
3. 是否使用 V2 当前路径。
4. 是否需要 Plan-first、Skill Pattern Gate、页面 / 产品 / 自动化硬闸门。
5. 是否需要同步更新 `dispatch-board.md`、`feature_list.json`、`progress.md` 和 `docs/agent-handoff.md`。
