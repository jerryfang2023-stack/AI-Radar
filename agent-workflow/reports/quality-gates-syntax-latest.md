# Quality Gates Report

生成时间：2026/6/26 12:56:49

## 结论

- 模式：syntax
- 日期参数：2026-06-26
- 状态：passed
- 检查项：18
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

### 4. v2-source-probe syntax

- 命令：`node --check agent-workflow/tools/v2-source-probe.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 5. v2-source-quality-gate syntax

- 命令：`node --check agent-workflow/tools/v2-source-quality-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 6. guanlan monitor quality gate syntax

- 命令：`node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 7. guanlan daily monitor syntax

- 命令：`node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 8. guanlan daily monitor with qc syntax

- 命令：`node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 9. writer-style-gate syntax

- 命令：`node --check agent-workflow/tools/writer-style-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 10. v2-typography-gate syntax

- 命令：`node --check agent-workflow/tools/v2-typography-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 11. frontstage regression gate syntax

- 命令：`node --check agent-workflow/tools/frontstage-regression-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 12. v2-raw-evidence-gate syntax

- 命令：`node --check agent-workflow/tools/v2-raw-evidence-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 13. tag quality gate syntax

- 命令：`node --check agent-workflow/tools/check-tags.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 14. daily production chain gate syntax

- 命令：`node --check agent-workflow/tools/assert-daily-production-chain.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 15. pool-to-card dedupe gate syntax

- 命令：`node --check agent-workflow/tools/assert-pool-to-card-dedupe.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 16. follow-builders data gate syntax

- 命令：`node --check agent-workflow/tools/assert-follow-builders-data.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 17. trend candidate decision syntax

- 命令：`node --check agent-workflow/tools/run-trend-candidate-decision.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 18. automation readiness report syntax

- 命令：`node --check agent-workflow/tools/write-automation-readiness-report.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-


## 说明

- 本脚本是 `quality-gates.md` 的统一入口。
- SITE-V3.3.8.3 阶段默认检查 `01-SiteV2/site/` 与当前 `agent-workflow/tools/` 脚本。
- `all` 会运行当前可用的内容、前台回归和 tag 质量门；需要指定日期时使用 `--date=YYYY-MM-DD`。
- `style` 会检查三个 writer 的文章产物是否出现禁词、抽象名词和高频重复句式。
- `regression` 会检查前台是否出现旧版本口径、已退休组件、旧模块文案、合成 fallback 内容、过期前台日期、过期缓存参数或趋势泛关联。
- `automation` 检查 SITE-V3.3.8.3 Business Signals / Intelligence Map / Weekly Report / First-Line Viewpoints / Community Intelligence / Dashboard 生产线相关脚本语法。
- 未覆盖的浏览器截图、多身份权限和人工内容判断，仍需 Build & Release 发布检查或 Product Commander 专项复核。
