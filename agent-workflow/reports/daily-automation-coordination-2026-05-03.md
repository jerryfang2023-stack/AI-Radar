# 2026-05-03 每日自动化协调与防护报告

## 背景

用户指出：今天 AI 商业雷达自动化曾失败，后续必须保证 AI 商业雷达与 The Point 都能先顺利生成 Markdown，再统一同步到网站。

## 已完成

- 新增统一同步闸门脚本：`agent-workflow/tools/unified-site-sync.mjs`。
- 更新 The Point 自动化：`ai-the-point`。
- 新建 AI 商业雷达内容生成自动化：`ai-2`。
- 新建统一网站同步闸门自动化：`ai-3`。
- 输出执行方案：`agent-workflow/execution/daily-automation-coordination-2026-05-03.md`。

## 自动化时间线

| 时间 | 自动化 ID | 任务 | 是否写网站数据 |
|---|---|---|---|
| 08:30 | `ai-the-point` | 生成 The Point Markdown | 否 |
| 08:45 | `ai-2` | 生成 AI 商业雷达、机会评分、趋势和机会卡 Markdown | 否 |
| 09:30 | `ai-3` | 统一检查内容就绪后同步网站 | 是，且先备份后检查 |

## 统一同步闸门

脚本：

```powershell
node agent-workflow/tools/unified-site-sync.mjs
```

检查项：

- 当天 AI 商业雷达文件存在且非空。
- 每条 Signal 包含 6 点机会拆解。
- 当天 AI 机会评分文件存在且有评分表。
- 当天 The Point 文件存在且 Point 数量满足 Top10。
- The Point 不包含 X `t.co` 短链。
- The Point 不包含 YouTube speaker/timecode 痕迹。
- 内容状态不能是 `failed`、`empty`、`draft`、`needs_review`。

同步动作：

- 先备份 `radar-data.json` 和 `radar-data.js`。
- 运行 `sync-data.mjs`。
- 运行 `check-relations.mjs`。
- 运行 `check-point-quality.mjs`。
- 检查失败时恢复备份。

## 验证结果

已运行：

```powershell
node --check agent-workflow/tools/unified-site-sync.mjs
node agent-workflow/tools/unified-site-sync.mjs --date=2026-05-03
```

最终结果：

- 统一同步状态：`synced`
- 内容就绪：7 Signals / 7 Scoring Rows / 24 Points
- 网站同步结果：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 4 Point Sources / 27 Opportunities
- 关系检查：硬错误 0
- The Point 质量检查：硬错误 0
- 报告：`agent-workflow/reports/unified-site-sync-2026-05-03.md`

## 风险与处理

- 旧的商业雷达自动化 ID 没有写入项目文件，本次以新建的强化版自动化 `ai-2` 为准。
- 如果 Codex app 中仍存在旧的“每日观澜AI商业雷达”任务，应停用旧任务，避免它继续直接运行网站同步。
- 后续所有同步都应从 `ai-3` 或 `agent-workflow/tools/unified-site-sync.mjs` 进入。
