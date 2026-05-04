# 2026-05-04 自动化首跑验收计划

生成日期：2026-05-03  
owner：`workflow` / `qa`  
状态：pending_first_run

## 1. 结论

截至 2026-05-03 21:20，本地尚未出现 2026-05-04 三段式自动化产物，因此不能报告首跑已通过。

当前检查结果：

| 文件 | 状态 |
|---|---|
| `01-Signals/2026-05-04-AI商业雷达.md` | 未生成 |
| `02-Scoring/2026-05-04-AI机会评分.md` | 未生成 |
| `05-Point/2026-05-04-The-Point.md` | 未生成 |
| `agent-workflow/reports/unified-site-sync-2026-05-04.md` | 未生成 |

这是正常状态，因为 2026-05-04 自动化真实定时运行尚未发生。

## 2. 自动化链路

| 自动化 | 时间 | 职责 | 不应做 |
|---|---:|---|---|
| `ai-the-point` | 08:30 | 生成 The Point Markdown 和素材笔记 | 不同步网站，不写 `04-Site/data` |
| `ai-2` | 08:45 | 生成 AI商业雷达、AI机会评分、必要趋势/机会卡 | 不同步网站，不写 `04-Site/data` |
| `ai-3` | 09:30 | 运行统一网站同步闸门 | 不绕过 blocked / failed |

## 3. 首跑验收步骤

2026-05-04 09:35 后执行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04 --run-sync-gate
node agent-workflow/tools/run-quality-gates.mjs content
node agent-workflow/tools/run-quality-gates.mjs point
```

同时读取：

- `agent-workflow/daily-run-log.md`
- `agent-workflow/reports/unified-site-sync-2026-05-04.md`
- `agent-workflow/reports/unified-site-sync-latest.md`
- `agent-workflow/reports/the-point-quality-check-latest.md`
- `agent-workflow/reports/relation-check-latest.md`

## 4. 通过标准

- `ai-the-point` 生成 `05-Point/2026-05-04-The-Point.md`，且非空、状态可同步。
- `ai-2` 生成 `01-Signals/2026-05-04-AI商业雷达.md` 和 `02-Scoring/2026-05-04-AI机会评分.md`，且非空、状态可同步。
- 每条当天 Signal 包含 6 点机会拆解。
- `ai-3` 或手动闸门报告状态为 `synced`。
- 关系检查硬错误为 0。
- The Point 质量检查硬错误为 0。
- 如果出现软提醒，必须有处理路径，不强行清零。

## 5. 阻塞标准

以下任一情况视为首跑未通过：

- 任一当天核心 Markdown 缺失或为空。
- `status` 为 `failed`、`empty`、`draft`、`needs_review`。
- Signal 缺少 6 点机会拆解。
- The Point 出现 `t.co` 短链、speaker/timecode、摘要冒充译文。
- 统一同步闸门返回 `blocked`、`failed` 或 `failed_restored`。
- 同步后关系检查出现硬错误。

## 6. 降级处理

若 `ai-the-point` 失败：

- 不生成空文件。
- 不进入首页精选。
- 在 `daily-run-log.md` 记录来源、命令、降级路径和失败原因。

若 `ai-2` 失败：

- 不覆盖已有非空文件。
- 不生成空跑文件冒充完成。
- 记录检索路径、来源失败和降级方式。

若 `ai-3` 失败：

- 不手工绕过闸门。
- 保留上一版有效网站数据。
- 交给 Workflow / Dev Agent 修复。

## 7. 下一步 owner

| Agent | 下一步 |
|---|---|
| Workflow Agent | 2026-05-04 09:35 后读取日志和闸门报告 |
| QA Agent | 按本报告验收首跑结果 |
| Intelligence Data Agent | 处理关系软提醒、标签和来源质量问题 |
| Dev Agent | 如果闸门脚本失败，修复脚本或路径 |
