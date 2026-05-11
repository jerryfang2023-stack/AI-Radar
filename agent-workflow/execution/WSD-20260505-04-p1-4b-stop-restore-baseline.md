# WSD-20260505-04-p1-4b-stop-restore-baseline 派发单

日期：2026-05-05  
状态：ready  
调度窗口：当前调度中枢窗口  
看板编号：P1-4C  
牵头 Agent：`dev / qa / workflow`  
协作 Agent：`pm / ui-ue`

## 1. 任务目标

根据用户要求，停止 `P1-4B / WSD-20260505-03-non-home-column-detail-reading-implementation`，并将网页恢复到该任务执行前的状态。

本任务不是继续优化页面，而是做一次可审计的回退：

- 冻结 P1-4B，不再继续开发。
- 只撤回 P1-4B 对网页展示层造成的改动。
- 恢复完成后，交给 Design Director 按 SYS-7 新证据化审美闸门重新逐页评分。

## 2. 背景

`P1-4B` 当前状态为 `review`，未被调度中枢 accepted。用户要求：

> 停止 P1-4B，网页恢复到任务前状态，然后让设计总监根据新的规范，重新给每个页面评分，提出修改和优化意见后，再执行。

因此本任务必须先恢复基线，不得继续改设计。

## 3. 必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md`
5. `agent-workflow/execution/WSD-20260505-03-non-home-column-detail-reading-implementation.md`
6. `agent-workflow/reports/design-director-evidence-based-quality-gate-2026-05-05.md`
7. `agent-workflow/product/DESIGN.md`

## 4. 回退范围

P1-4B closeout 声明涉及以下网页文件：

- `04-Site/css/styles.css`
- `04-Site/js/app.js`
- `04-Site/daily.html`
- `04-Site/signals.html`
- `04-Site/opportunities.html`
- `04-Site/trends.html`

执行窗口应优先审计这些文件中由 P1-4B 引入的改动，并恢复到 P1-4B 前状态。

## 5. 严禁操作

- 不得使用 `git reset --hard`。
- 不得整仓回滚。
- 不得删除或回滚不属于 P1-4B 的变更。
- 不得修改 `04-Site/index.html`。
- 不得修改内容源 Markdown。
- 不得修改 `04-Site/data/`。
- 不得修改同步脚本、关系检查脚本、统一同步闸门或自动化任务。
- 不得修改 `P0-12` 测试管线相关文件。
- 不得把 P1-4B 的页面改成另一个新版本。

如果无法清楚区分某段改动是否属于 P1-4B，必须在 closeout 中标记为不确定，不得贸然回滚。

## 6. 推荐执行方式

1. 先记录当前 git 状态和上述 6 个网页文件的 diff。
2. 为上述 6 个网页文件创建本地备份目录，建议路径：`agent-workflow/backups/p1-4b-restore-20260505/`。
3. 对照 P1-4B closeout、截图和 diff，识别 P1-4B 引入的样式层、栏目标题改动、公开前台文案改动和隐藏编辑弹窗改动。
4. 只恢复 P1-4B 引入的部分。
5. 保留 P1-4B 之前已经 accepted 的功能和治理改动。
6. 恢复后运行语法检查和浏览器抽查。

## 7. 验收要求

closeout 必须包含：

- 明确写出 `P1-4B` 已停止，状态建议为 `stopped / not accepted`。
- 回退前后涉及文件清单。
- 哪些改动已确认属于 P1-4B 并已回退。
- 哪些改动不确定，未回退及原因。
- 是否触碰首页：必须明确 `04-Site/index.html` 未触碰。
- 是否影响自动化：默认不影响。
- 恢复后截图或浏览器检查说明。

必须运行：

- `node --check 04-Site/js/app.js`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`

建议截图抽查：

- `daily.html`
- `signals.html`
- `opportunities.html`
- `trends.html`
- 任一详情页

## 8. 收口文件

完成后生成 UTF-8 收口文件：

`agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`

回到调度中枢窗口汇报：

```text
收口：agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md
```

