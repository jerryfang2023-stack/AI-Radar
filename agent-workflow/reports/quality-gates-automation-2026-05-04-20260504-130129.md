# Quality Gates Report

生成时间：2026/5/4 21:01:29

## 结论

- 模式：automation
- 日期参数：2026-05-04
- 状态：passed
- 检查项：1
- 失败项：0
- 自动化模式默认只检查统一同步闸门脚本语法；如需真实运行，使用 `--run-sync-gate`。

## 检查明细

### 1. unified-site-sync syntax

- 命令：`node --check agent-workflow/tools/unified-site-sync.mjs`
- 状态：passed (0)
- stdout：-
- stderr：-


## 说明

- 本脚本是 `quality-gates.md` 的统一入口。
- `content` 和 `all` 会运行 `sync-data.mjs`，可能更新 `04-Site/data/radar-data.json` 与 `radar-data.js`。
- `automation` 默认不真实运行统一同步闸门；需要显式传 `--run-sync-gate`。
- 未覆盖的浏览器截图、多身份权限和人工内容判断，仍需 QA Agent 单独验收。
