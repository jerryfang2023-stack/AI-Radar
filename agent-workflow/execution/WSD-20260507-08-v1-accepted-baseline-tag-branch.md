# WSD-20260507-08-v1-accepted-baseline-tag-branch 派发单

日期：2026-05-07  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`dev` / `workflow` / `qa`

## 0. 快速执行卡

- 看板编号：`V2-5A`
- Task ID：`WSD-20260507-08-v1-accepted-baseline-tag-branch`
- 任务类型：开发治理 / Git baseline / branch / worktree 前置
- 派发单：`agent-workflow/execution/WSD-20260507-08-v1-accepted-baseline-tag-branch.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`
- 调度口令：`收口：WSD-20260507-08-v1-accepted-baseline-tag-branch`
- 是否可能影响自动化：否，除非执行窗口改动自动化配置或部署设置

执行窗口最短启动提示词：

```text
执行任务：WSD-20260507-08-v1-accepted-baseline-tag-branch
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260507-08-v1-accepted-baseline-tag-branch.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md。
回调度窗口：收口：WSD-20260507-08-v1-accepted-baseline-tag-branch
```

## 1. 任务目标

在进入 V2 正式开发前，整理当前大量未提交文件的归属，形成可信的 V1.0 / V2 规划基线，并在用户确认后创建 baseline tag、V2 branch 和可选 worktree。

本任务承接：

- `agent-workflow/v2/v2-dev-workspace-baseline.md`
- `agent-workflow/reports/WSD-20260507-06-v2-dev-workspace-baseline-closeout.md`

## 2. 必读

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/execution/dispatch-board.md`
4. `agent-workflow/v2/v2-dev-workspace-baseline.md`
5. `agent-workflow/v2/v1-baseline-freeze.md`
6. `agent-workflow/v2/v2-workspace-strategy.md`
7. `agent-workflow/reports/WSD-20260507-06-v2-dev-workspace-baseline-closeout.md`

## 3. 必须完成

### 3.1 文件归属分类

将当前未提交 / 未跟踪文件分为：

- `accepted`：已由调度中枢 accepted，可纳入基线。
- `review`：收口已收到但未 accepted，不得纳入 V1 baseline。
- `test-only`：测试管线或样例，需注明是否纳入 V2 planning。
- `abandoned / failed / stopped`：不得纳入 baseline。
- `private / external`：需要用户确认。

必须输出分类表，不得模糊写“全部提交”。

### 3.2 提交与 tag 建议

如文件分类清楚且用户已确认，可执行：

- 提交 accepted / V2 planning 文件。
- 创建 tag：`v1.0-baseline-20260507` 或用户确认名称。
- 创建 branch：`codex/v2-planning`。

如条件不满足，不得强行创建 tag / branch，必须写明阻塞原因。

### 3.3 worktree 前置

推荐 worktree 路径：

```text
C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight-v2-lab
```

创建前必须确认：

- 用户同意该路径。
- 目标路径不存在或可安全使用。
- 当前 branch / tag / commit 基线可信。

## 4. 禁止事项

- 不得使用 `git reset --hard`。
- 不得用破坏性命令删除未归属文件。
- 不得把 `failed / abandoned / stopped / review` 任务结果作为 accepted 基线提交。
- 不得把 `P0-2A`、`P0-2B`、`P1-4B` 当作成功成果。
- 不得把 `P0-11` 当作 accepted。
- 不得替换生产自动化或部署配置，除非另行派发。

## 5. 预期输出

- 文件归属分类表。
- Git 操作执行记录或未执行原因。
- baseline tag / branch / worktree 状态。
- 回滚方案。
- 自动化影响说明。
- closeout：`agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`

## 6. 必跑检查

- `git status --short --branch`
- `git log --oneline -5`
- `git tag --list`
- `git branch --list --all`
- 如修改或提交文件，运行 `node agent-workflow/tools/run-quality-gates.mjs syntax`

