# Dispatch State Reconciliation

更新时间：2026-05-10
owner：`workflow` / `pm`
状态：长期生效

## 1. 定位

本文件用于解决调度中枢长期运行后出现的状态冲突：同一任务可能在 `dispatch-board.md`、`feature_list.json`、`progress.md`、`docs/agent-handoff.md` 和 closeout 中留下不同阶段记录。

后续派发、收口和任务看板刷新时，必须先按本文件统一状态，避免把失败任务、历史创建记录或被合并但未验收的任务继续派发。

## 2. 状态优先级

当多个文件状态不一致时，按以下顺序判定当前有效状态：

1. 用户最新明确裁决。
2. 最新 closeout 或 failed closeout。
3. `agent-workflow/execution/dispatch-board.md` 当前行。
4. `agent-workflow/feature_list.json` 当前状态。
5. `docs/agent-handoff.md` 顶部最新章节。
6. `agent-workflow/progress.md` 顶部最新章节。
7. 历史章节、阶段报告、截图、mockup、旧派发单。

历史章节只作为过程记录，不得覆盖最新裁决。

## 3. 失败任务继承规则

任务被标记为 `failed / not-accepted / closed` 后：

- 不得继续使用原 Task ID 派发。
- 不得把该任务的 stage summary、截图、参考图、局部实现、评分或 `local-site-quality-pass` 当作验收基线。
- 不得把并入该任务的子项视为已解决。
- 如仍需处理原方向，必须新建继任任务，并重新写目标、范围、质量标准、硬停止点和 closeout 路径。

## 4. 合并任务回滚规则

任务 A 合并进任务 B 后，如果任务 B 最终失败：

- 任务 A 的状态应改为 `review / needs-successor-after-failed-merge` 或 `blocked / needs-re-dispatch`。
- `feature_list.json` 不得保留 `passed`。
- 看板下一步必须写明“不得视为已解决，需要继任任务”。
- 后续派发不得复用失败任务的验收结论，只能读取其失败原因。

## 5. V2-only 路径规则

当前项目是 V2-only 生产开发：

- V2 网站工程默认入口：`01-SiteV2/site/`。
- V2 内容生产线默认入口：`01-SiteV2/content/`。
- 旧 `04-Site/` 与 `10-Archive/v1.0/` 已从当前仓库物理移除。
- 新页面、样式、脚本、内容同步、截图验收和部署任务不得写 `04-Site/`。
- 后续不得恢复 V1 旧站代码或旧文章归档作为当前开发依据；V2 任务必须使用 V2 路径和 V2 quality gates。

## 6. 下一步建议刷新规则

每次收口或状态治理后，调度中枢必须检查 `dispatch-board.md` 的“使用建议”：

- 不得推荐已经 completed / accepted 的任务作为下一步。
- 不得推荐 failed / abandoned / stopped / void 任务。
- 不得推荐被 failed 任务吞并且尚未重派的子项。
- 如当前没有 ready 任务，应明确写“等待用户派发新任务”，并列出可新建的继任方向。

## 7. 收口验收补充

调度中枢收到 closeout 后，除 `window-dispatch-hub.md` 的常规检查外，还必须检查：

- closeout 是否与最新用户裁决一致。
- 是否引用了已 failed / abandoned / stopped 的成果作为通过证据。
- 是否把 `completed / local-*` 误写为 `accepted`。
- 是否遗漏了合并任务失败后的子项状态回填。
- 是否仍用 V1 旧路径作为 V2 当前开发入口。

任一项不通过，不得标记 `accepted`。
