# Quality Gates Report

生成时间：2026/6/2 16:39:35

## 结论

- 模式：v2content
- 日期参数：2026-06-02
- 状态：passed
- 检查项：3
- 失败项：0

## 检查明细

### 1. v2-content-gate syntax

- 命令：`node --check agent-workflow/tools/v2-content-gate.mjs`
- 状态：passed (0)
- stdout：skipped: child_process spawn blocked (EPERM) in this environment
- stderr：-

### 2. run v2 content gate

- 命令：`node agent-workflow/tools/v2-content-gate.mjs --date=2026-06-02`
- 状态：passed (0)
- stdout：| V2 site root exists | passed | 01-SiteV2/site | / ## 说明 / - 本闸门检查当前 V2.2 内容生产路径 `01-SiteV2/content/`。 / - 它只检查内容入站基础，不部署 Netlify。 / - Raw 低于 80 会被视为降级或严重降级，但仍检查是否有本地原文档案和缺口记录。 / - 当前六线程口径下，本闸门检查 Raw、Pool、今日观察、商业信号、前沿观点、变化候选、场景候选、趋势候选和 daily log 必填字段。
- stderr：-

### 3. run tag quality gate

- 命令：`node agent-workflow/tools/check-tags.mjs`
- 状态：passed (0)
- stdout：无。 / ## candidate_tags 观察项 / 无。 / ## 缺 formal_tags 的正式资产 / 无。 / Report: agent-workflow/reports/tag-quality-gate-latest.md
- stderr：-


## 说明

- 本脚本是 `quality-gates.md` 的统一入口。
- V2.2.1 阶段默认检查 `01-SiteV2/site/` 与当前 `agent-workflow/tools/` 脚本。
- `content`、`v2content` 和 `all` 会运行 V2 content gate；需要指定日期时使用 `--date=YYYY-MM-DD`。
- `style` 会检查三个 writer 的文章产物是否出现禁词、抽象名词和高频重复句式。
- `cardcopy` 会检查商业信号、前沿观点、变化候选、场景候选和趋势候选文案是否出现机械标题、内部词和空泛表达。
- `publiccopy` 会检查前台数据和当日 Markdown 是否出现内部生产语言或旧机械表达。
- `regression` 会检查前台是否出现旧版本口径、已退休组件、旧模块文案、合成 fallback 内容、过期前台日期、过期缓存参数或趋势泛关联。
- `automation` 检查 V2.2.1 每日生产线相关脚本语法。
- 未覆盖的浏览器截图、多身份权限和人工内容判断，仍需 Build & Release 发布检查或 Product Commander 专项复核。
