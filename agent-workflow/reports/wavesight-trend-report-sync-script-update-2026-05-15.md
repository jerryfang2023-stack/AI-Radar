# 2026-05-15 Trend Report 同步脚本更新收口

状态：accepted / sync-updated

## 本轮目标

让 V2 站点同步脚本按新 Trend Report 目录读取内容：

```text
01-SiteV2/content/06-trend-reports/full/
01-SiteV2/content/06-trend-reports/flash/
01-SiteV2/content/06-trend-reports/no-report-decisions/
```

## 已更新

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `agent-workflow/tools/v2-content-gate.mjs`
- `agent-workflow/tools/writer-style-gate.mjs`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`

## 核心变化

### 站点同步

- 新增 Trend Report 专用读取逻辑。
- 读取优先级：

```text
full/ -> flash/ -> 06-trend-reports/ 根目录旧文件
```

- `no-report-decisions/` 不进入前台同步。
- `discoverDates()` 已纳入 `full/` 与 `flash/`，新目录里的报告会被日期索引识别。
- 新报告解析支持：
  - `kind`
  - `status`
  - `front_status`
  - `urgent_candidate_id`
  - `upgrade_target`
  - `upgraded_from`
  - `source_count`
  - `primary_source_count`
  - `has_counter_evidence`
- `front_status: hidden` 的报告不会进入前台。
- `kind = no_report_decision` 不会进入前台。
- Trend Report 正文按二级标题转为前台详情页章节。

### 内容门禁

- `v2-content-gate` 也改为优先检查 `full/`，再检查 `flash/`，再兼容根目录旧文件。
- `no-report-decisions/` 作为无报告决策记录识别，不作为前台 Trend Report。
- `flash` 与 `full` 使用不同门槛：
  - flash：2000-3500 中文字、至少 3 个来源、至少 1 个 S/A 或一手来源、必须有反证 / 信息缺口和 30 天观察变量。
  - full：6000-10000 中文字、至少 5 个来源、至少 2 个 S 级或一手来源、必须有竞品、客户 / 付费讨论、反证和 7 / 30 / 90 天观察变量。

### 风格门禁

- `writer-style-gate` 跳过 `no-report-decisions/`，避免把内部运行决策当作对外文章检查。

## 验证

- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`：passed
- `node --check agent-workflow/tools/v2-content-gate.mjs`：passed
- `node --check agent-workflow/tools/writer-style-gate.mjs`：passed
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-15`：passed
- 临时放入 `full/2026-05-15--TRD-FULL-20260515-99--sync-test.md` 后同步，确认前台数据读取到 `TRD-FULL-20260515-99` 和 `kind: full`。
- 测试文件已删除，并重新同步真实数据。
- 最终 `site-content.json` 不包含测试 ID，也不包含 `no-report-decisions` / `no_report_decision`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed
- `node agent-workflow/tools/run-quality-gates.mjs style`：passed
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-15`：passed

## 边界

- 本轮未修改前台趋势追踪页面布局。
- 本轮未立即触发 `trend-report-writer` 自动化运行。
- 当前没有真实 `full/` 或 `flash/` 报告，站点数据仍使用 `TRD-WATCH-20260515` fallback；这符合当前内容状态。

## 下一步

下一步可以跑一次 `trend-report-writer` 的 dry run 或正式临时运行，验证它在证据不足时是否生成 `no_report_decision`，在证据满足时是否生成 `TRD-FLASH-*` / `TRD-FULL-*`。
