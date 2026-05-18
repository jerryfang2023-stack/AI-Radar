# Quality Gates Report

生成时间：2026/5/18 15:33:10

## 结论

- 模式：v2content
- 日期参数：2026-05-18
- 状态：failed
- 检查项：2
- 失败项：1

## 检查明细

### 1. v2-content-gate syntax

- 命令：`node --check agent-workflow/tools/v2-content-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 2. run v2 content gate

- 命令：`node agent-workflow/tools/v2-content-gate.mjs --date=2026-05-18`
- 状态：failed (1)
- stdout：## 说明 / - 本闸门检查当前 V2 内容生产路径 `01-SiteV2/content/`。 / - 它不运行旧 `04-Site` 同步，也不部署 Netlify。 / - 旧 `04-Site` 已从当前仓库移除，本检查只确认 V2 生产内容链路是否具备可入站基础。 / - Raw 低于 80 会被视为降级或严重降级，但仍检查是否有本地原文档案和缺口记录。 / - 当前六线程口径下，本闸门检查 Raw、Pool、今日观察、变化卡、案例卡、观点候选、变化簇候选和 daily log 必填字段。
- stderr：v2 content gate failed


## 说明

- 本脚本是 `quality-gates.md` 的统一入口。
- V2-only 阶段默认检查 `01-SiteV2/site/` 与 `agent-workflow/tools/v2-*.mjs`。
- 旧 `04-Site` / V1 归档已从当前仓库移除，不再作为 `content`、`site`、`automation` 或 `all` 模式的目标。
- `content`、`point` 和 `all` 会运行 V2 content gate；需要指定日期时使用 `--date=YYYY-MM-DD`。
- `style` 会检查三个 writer 的文章产物是否出现禁词、抽象名词和高频重复句式。
- `automation` 检查 V2 每日生产线相关脚本语法，不再运行旧统一同步闸门。
- 未覆盖的浏览器截图、多身份权限和人工内容判断，仍需 QA Agent 单独验收。
