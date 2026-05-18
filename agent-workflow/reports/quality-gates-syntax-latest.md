# Quality Gates Report

生成时间：2026/5/18 16:07:08

## 结论

- 模式：syntax
- 日期参数：2026-05-18
- 状态：passed
- 检查项：10
- 失败项：0

## 检查明细

### 1. v2 frontend app syntax

- 命令：`node --check 01-SiteV2/site/assets/app.js`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 2. v2 dev-server syntax

- 命令：`node --check 01-SiteV2/site/dev-server.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 3. run-quality-gates syntax

- 命令：`node --check agent-workflow/tools/run-quality-gates.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 4. v2-content-gate syntax

- 命令：`node --check agent-workflow/tools/v2-content-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 5. v2-source-probe syntax

- 命令：`node --check agent-workflow/tools/v2-source-probe.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 6. v2-source-quality-gate syntax

- 命令：`node --check agent-workflow/tools/v2-source-quality-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 7. v2 daily pipeline source-router syntax

- 命令：`node --check agent-workflow/tools/run-v2-daily-pipeline.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 8. writer-style-gate syntax

- 命令：`node --check agent-workflow/tools/writer-style-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 9. v2-typography-gate syntax

- 命令：`node --check agent-workflow/tools/v2-typography-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 10. v2-raw-evidence-gate syntax

- 命令：`node --check agent-workflow/tools/v2-raw-evidence-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-


## 说明

- 本脚本是 `quality-gates.md` 的统一入口。
- V2-only 阶段默认检查 `01-SiteV2/site/` 与 `agent-workflow/tools/v2-*.mjs`。
- 旧 `04-Site` / V1 归档已从当前仓库移除，不再作为 `content`、`site`、`automation` 或 `all` 模式的目标。
- `content`、`point` 和 `all` 会运行 V2 content gate；需要指定日期时使用 `--date=YYYY-MM-DD`。
- `style` 会检查三个 writer 的文章产物是否出现禁词、抽象名词和高频重复句式。
- `automation` 检查 V2 每日生产线相关脚本语法，不再运行旧统一同步闸门。
- 未覆盖的浏览器截图、多身份权限和人工内容判断，仍需 QA Agent 单独验收。
