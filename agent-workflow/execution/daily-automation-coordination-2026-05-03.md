# 2026-05-03 每日自动化协调方案

## 目标

保证两个内容自动化任务先稳定生成 Markdown，再由统一同步闸门一次性同步到网站，避免内容生成失败、字段缺失或任务并发写入导致网站数据污染。

## 三段式流程

## 一句话指令（更新网站口令）

在 Codex 对话中直接输入以下任意一句即可（默认按 Asia/Shanghai 当天日期执行）：

1. `更新网站前置 ai-the-point：生成今天 The Point（只写 05-Point 与运行报告，不同步网站）。`
2. `更新网站前置 ai-2：生成今天 AI商业雷达 + AI机会评分（只写 01-Signals/02-Scoring 等内容与报告，不同步网站）。`
3. `更新网站 ai-3：运行统一网站同步闸门（node agent-workflow/tools/unified-site-sync.mjs）。`

### 1. The Point 内容生成

- 自动化 ID：`ai-the-point`
- 时间：每日 08:30
- 只写：
  - `05-Point/YYYY-MM-DD-The-Point.md`
  - `05-Point/sources/YYYY-MM-DD/`
  - `agent-workflow/daily-run-log.md`
  - `agent-workflow/reports/the-point-run-YYYY-MM-DD.md`
- 不运行网站同步。
- 成功状态：`pending_unified_sync`

### 2. AI 商业雷达内容生成

- 自动化 ID：`ai-2`
- 自动化名称：观澜AI 商业雷达每日内容生成
- 时间：每日 08:45
- 只写：
  - `01-Signals/YYYY-MM-DD-AI商业雷达.md`
  - `02-Scoring/YYYY-MM-DD-AI机会评分.md`
  - `03-Trends/AI趋势总表.md`
  - `07-Opportunities/`
  - 处理日志与运行报告
- 不运行网站同步。
- 每条 Signal 必须包含 6 点机会拆解。
- 成功状态：`pending_unified_sync` 或 `updated`。

### 3. 统一网站同步闸门

- 自动化 ID：`ai-3`
- 自动化名称：观澜AI 每日统一网站同步闸门
- 时间：每日 09:30
- 执行脚本：

```powershell
node agent-workflow/tools/unified-site-sync.mjs
```

该脚本只在以下三类当天 Markdown 同时就绪时同步网站：

- `01-Signals/YYYY-MM-DD-AI商业雷达.md`
- `02-Scoring/YYYY-MM-DD-AI机会评分.md`
- `05-Point/YYYY-MM-DD-The-Point.md`

同步前会备份：

- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`

同步后会运行：

- `node 04-Site/scripts/sync-data.mjs`
- `node 04-Site/scripts/check-relations.mjs`
- `node 04-Site/scripts/check-point-quality.mjs`
- `node 04-Site/scripts/check-tags.mjs`

同步后还会由 `ai-3` 直接读取 `04-Site/data/radar-data.json`，执行 Priority Engine 2.0 Judgment Node 硬闸门：

- `priorityRows`、`judgmentNodes`、`priorityEngine` 摘要必须存在。
- Priority Row -> Judgment Node 覆盖率必须为 100%。
- 每个 Judgment Node 必须至少关联一个 Priority Row。
- Judgment Node 关联的 Priority / Signal / Trend / Opportunity / Point 不得断链。
- `priorityEngine` 摘要中的节点数、覆盖数、显式 / 派生数量必须与实际数据一致。
- The Point 只能作为观点共识、分歧或边界信号，不能被记录为事实证据直接加权。

任一检查失败则恢复同步前备份。

## 防护规则

1. 内容任务不得直接运行 `sync-data.mjs`。
2. 内容任务不得直接写 `04-Site/data/radar-data.json` 或 `04-Site/data/radar-data.js`。
3. 当天任一内容缺失、空跑、失败、待补充、`needs_review` 或字段不完整，统一同步必须阻止。
4. 商业雷达不能把单个网站的 Cloudflare/403 当作整体联网失败。
5. 商业雷达失败时不能生成空文件，不能覆盖已有非空文件。
6. The Point 失败时不能生成空文件，不能覆盖已有非空文件。
7. 所有失败必须写入 `agent-workflow/daily-run-log.md`，并说明尝试路径、降级方式和失败原因。
8. Priority Engine 2.0 Judgment Node 缺失、覆盖率不足、摘要不一致或关系断链属于 `ai-3` 硬错误，必须阻止入站并恢复备份。
9. 关系软提醒不能为了清零而硬绑无效 Judgment Node；软提醒应进入报告并交给 Intelligence Data Agent 复核。

## V2 测试管线说明（2026-05-05）

日常监测算法 v2 已建立为测试管线，只进入：

- `06-content/`
- `04-Site/signal-lab.html`
- `04-Site/data/signal-lab-data.json`
- `04-Site/data/signal-lab-data.js`

测试同步脚本：

```powershell
node 04-Site/scripts/sync-signal-lab.mjs
```

`06-content/` 已升级为编号目录：

```text
00-inbox -> 01-raw -> 02-pool -> 03-structured-signals -> 04-selected-signals
-> 05-trend-chain -> 06-insights -> 07-points -> 08-opportunities
-> 09-mvp-validation -> 10-databases -> 11-content-distribution -> 12-feedback
```

手工启动口令：

```text
启动：日常监测v2
启动：日常监测v2-采集
启动：日常监测v2-入库
启动：日常监测v2-精选
启动：日常监测v2-深挖
启动：日常监测v2-趋势
启动：日常监测v2-复核
```

手工启动规则见：

- `agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-manual-runbook.md`
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `06-content/README.md`

边界：

- 不替换 `ai-2` 当前生产口径。
- 不写入正式 `01-Signals/`、`02-Scoring/`、`03-Trends/AI趋势总表.md` 或 `07-Opportunities/`。
- 不进入 `ai-3` 统一同步闸门。
- 成熟条件为连续 7 天稳定产出、QA 证明前台 3 条质量优于现有 Signals，并由 PM / Data / QA 另行派发正式入站任务。

## 当前验证

已用 2026-05-03 内容运行：

```powershell
node --check agent-workflow/tools/unified-site-sync.mjs
node agent-workflow/tools/unified-site-sync.mjs --date=2026-05-03
```

最终结果：

- 状态：`synced`
- Signals：7
- Scoring Rows：7
- Points：24
- 网站同步：通过
- 关系检查：硬错误 0
- The Point 质量检查：硬错误 0
- 备份目录：`agent-workflow/backups/unified-site-sync/20260503-124246`

说明：前两次 blocked 为脚本解析规则修正前的测试记录，不代表内容缺失；最终报告以 `agent-workflow/reports/unified-site-sync-2026-05-03.md` 为准。
