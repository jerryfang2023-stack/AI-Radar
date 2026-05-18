# 2026-05-14 Grill 80-120 固化与承接性检查

状态：accepted / product-docs-updated

## 本轮目标

将 80 题之后的讨论，尤其是 schema 迁移后的趋势报告机制、趋势快报、急件触发和文案风格，固化到当前项目文档。同时检查它们是否与 1-79 题已确认的战略、栏目、自动化和内容资产口径冲突。

## 已固化的新增决策

### 1. Trend Report 与机会判断

- `Trend Report` 是一级判断资产，前台以文章为主。
- `Trend Card` 负责记录趋势状态，`Trend Report` 负责形成判断。
- 机会判断保留为趋势报告和商业内参中的文章段落。
- 机会判断不再是独立 schema、独立栏目或独立卡片资产。

### 2. 趋势报告两种形态

- `trendReport.kind = "flash"`：趋势快报。
- `trendReport.kind = "full"`：深度报告。
- 不另建 `flashReport` schema。
- 趋势快报复用 `trend-detail.html`，混在趋势追踪页中展示，不新增一级页面。

### 3. 急件触发机制

急件链路：

```text
urgent_trend_candidate -> rapid_review -> temporary_trend_report_run
```

急件候选必须包含：

- 多源信号。
- 商业影响。
- 至少满足权威来源或市场共振等补充条件。
- 系统自动复核后，进入人工批量复核。

人工只做：

- 放行临时报告。
- 继续观察。
- 降级为趋势卡。

### 4. 趋势快报规则

- 2000-3500 中文字。
- 公开或登录可读。
- 至少 3 个独立来源。
- 至少 1 个 S/A 或一手来源。
- 必须有反证或信息缺口。
- 不能只靠 AI HOT、X、HN、Reddit 或 builders 观点。
- 发布后进入 30 天 follow-up，可升级为正式报告、归档观察或判断被修正。

### 5. 文案风格

趋势快报必须遵守观澜文案风格：

- 像资深商业观察者，不像资讯站。
- 从具体人、具体场景、具体冲突切入。
- 快，但不喊。
- 短，但不浅。
- 不写“重磅 / 颠覆 / 风口 / 必看 / 全面爆发”。
- 不写“首先 / 其次 / 最后 / 值得注意的是 / 显而易见 / 不可否认 / 总而言之”。

## 与 1-79 题的承接性检查

| 1-79 已确认口径 | 80-120 新固化内容 | 检查结论 |
|---|---|---|
| 一级导航为 今日观察 / 商业信号 / 趋势追踪 / 商业内参 | 趋势快报不新增一级入口，混在趋势追踪页 | 承接一致 |
| 机会判断降级，不做独立栏目 | 机会判断只作为 Trend Report 和商业内参段落 | 承接一致 |
| 趋势追踪是长文 + 趋势卡双重结构 | Trend Card 记录状态，Trend Report 形成判断 | 承接一致 |
| 每个栏目不做后台结构化填充页 | 趋势快报和深度报告都是自然文章 | 承接一致 |
| 六个自动化线程 | 不新增第七线程，给 `trend-report-writer` 增加 urgent mode | 承接一致 |
| 每日观察是当天行情综述 | 趋势快报只写单一方向临时深读，不替代每日观察 | 承接一致 |
| 商业内参是周期刊物 | 商业内参可吸收并修正快报 / 深度报告，不照搬 | 承接一致 |
| 来源必须真实可靠、外显 | 快报和深度报告均要求来源名、等级、链接、增量事实 | 承接一致 |
| 文案要少 AI 味，有场景、有人和冲突 | 趋势快报明确复用观澜文风，不开快讯腔 | 承接一致 |

## 已更新文件

- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/product/signal-system.md`
- `agent-workflow/product/strategy-single-source.md`
- `agent-workflow/governance/current-context.md`
- `docs/agent-handoff.md`
- `AGENTS.md`

## 清理与修正

- 修正 `trend-model.md` 中旧 Trends / 旧英文机会字段表达，改为 Trend Card / Trend Report 双层结构。
- 修正 `column-architecture.md` 中“机会报告库 / 机会地图 / 机会库分组视图”等旧表达。
- 修正 `COPY.md` 中 Trend Report 标题规则和趋势快报写作规则。
- 修正 `strategy-single-source.md` 中 旧英文机会字段作为最终机会库的旧段落。
- 修正 `signal-system.md` 中 Signal 为旧英文机会字段提供证据的旧表达。
- 修正 `intelligence-data-model.md` 中 Trend Report Intelligence 的分层规则。

## 结论

80-120 题的新增规则已并入当前项目文档。它们没有推翻 1-79 题的大框架，而是在 schema 迁移后补齐了趋势报告的触发、快报、升级、反证、权限和写作规则。

后续任务应以 `trend-model.md`、`column-architecture.md`、`COPY.md` 和 `current-context.md` 为当前口径，不再从旧机会文档恢复独立机会卡体系。

## 验证

- 当前核心真源扫描：未在 `AGENTS.md`、`current-context.md`、`trend-model.md`、`column-architecture.md`、`COPY.md`、`strategy-single-source.md`、`intelligence-data-model.md`、`signal-system.md` 中发现旧 `opportunity / opportunities` 当前 schema 引用。
- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`：通过。
- `node --check agent-workflow/tools/v2-content-gate.mjs`：通过。
- `node --check agent-workflow/tools/unified-site-sync.mjs`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs style`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-14`：passed。
