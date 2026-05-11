---
title: V2 AI HOT 优先每日自动化与一键采集脚本升级收口
date: 2026-05-10
task_id: WSD-20260510-09-v2-aihot-daily-pipeline-upgrade
status: accepted
owner: workflow / data / dev
encoding: UTF-8
---

# V2 AI HOT 优先每日自动化与一键采集脚本升级收口

## 1. 用户要求

用户要求：

1. AI HOT 有大量内容，内容可以重点从其中获取。
2. 通过 AI HOT 接口直接获取优质内容，再用观澜 V2 规则去跑。
3. 如有必要，生成“一键生成今日内容”的专用脚本。
4. 结合 `V2-DAILY-GOV` 更新完善每日自动化监测 / 入库任务。

## 2. 已完成

### 2.1 新增一键 source-router 脚本

新增：

- `agent-workflow/tools/run-v2-daily-pipeline.mjs`

脚本职责：

- 优先调用 AI HOT public API。
- 合并 HN / GDELT 等补充通道。
- 去重、初步分级和排序。
- 生成 `01-SiteV2/content/01-raw/YYYY-MM-DD-raw-candidates.md`。
- 生成 `01-SiteV2/content/01-raw/originals/YYYY-MM-DD/` 本地原文档案。
- 生成 `01-SiteV2/content/05-trend-chain/YYYY-MM-DD-heat-candidates.md`。
- 生成 `agent-workflow/reports/YYYY-MM-DD-v2-daily-source-router-log.md`。

脚本边界：

- 它是 source-router / collector，不替代 Data / PM / Copy Agent 判断。
- 它不直接生成最终 Front Signal / Deep Dive / 商业内参。
- AI HOT 摘要不作为事实主证据，仍需回看原始 URL 并补 S/A/B 来源。

推荐调用：

```powershell
node agent-workflow/tools/run-v2-daily-pipeline.mjs --date=YYYY-MM-DD
```

可测试调用：

```powershell
node agent-workflow/tools/run-v2-daily-pipeline.mjs --date=YYYY-MM-DD --dry-run=true --aihot-limit=20 --hn-limit=5 --raw-target=20
```

### 2.2 每日自动化本体已更新

已通过 Codex app automation 更新：

- automation id：`v2-content-site-daily-update`
- 状态：`ACTIVE`
- 时间：每天 09:00

新的自动化要求：

- 第一阶段必须先运行 `run-v2-daily-pipeline.mjs`。
- AI HOT 作为优先高通量 discovery 接口。
- HN / GDELT 等作为补充通道。
- 之后再按 V2-DAILY-GOV 执行 Pool、Structured、Front Signal、Deep Dive、Trend、Point 和知识库入库。
- 仍禁止把 AI HOT / HN / X / Reddit / 聚合页作为事实主证据。
- Front Signal 仍必须至少 3 个解析后的 S/A/B 原始来源。
- Deep Dive 仍必须 6000-10000 中文字、至少 5 个来源、至少 2 个 S 级或一手来源。
- 完成后仍需跑 `v2-source-quality-gate`、`v2content` 和 `syntax`。

### 2.3 已更新规则入口

已更新：

- `agent-workflow/governance/v2-current-rule-overrides.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/content/10-databases/source-registry-v2.json`
- `agent-workflow/tools/run-quality-gates.mjs`

## 3. 试跑结果

已执行 dry-run：

```powershell
node agent-workflow/tools/run-v2-daily-pipeline.mjs --date=2026-05-10 --dry-run=true --aihot-limit=20 --hn-limit=5 --raw-target=20
```

结果：

- AI HOT 成功返回候选。
- dry-run raw_count：20。
- dry-run aihot_count：20。
- GDELT 出现非 JSON / 429，已被脚本记录为失败来源。
- dry-run 未写入生产内容文件。

说明：

- 本轮为了避免只更新 Raw 而未同步重写 Pool / Structured / Front / Deep Dive，未对今日生产内容执行完整覆盖写入。
- 后续如要重新跑今日完整内容，应先运行该脚本生成 Raw，再由执行窗口按 V2-DAILY-GOV 完成完整内容链路。

## 4. 验证

已通过：

- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs`
- `feature_list.json` JSON 结构检查
- `node agent-workflow/tools/run-quality-gates.mjs syntax`

## 5. 当前结论

补充核查：

- 本地存在 `follow-builders` skill：`C:\Users\86186\.skill-store\follow-builders\SKILL.md`。
- 其确定性脚本为：`C:\Users\86186\.skill-store\follow-builders\scripts\prepare-digest.js`。
- 已验证该脚本可直接输出 JSON，包含 `x` builders、`podcasts` 和 `blogs`。
- `run-v2-daily-pipeline.mjs` 已改为优先调用真实 follow-builders skill；失败时才退回 builder query proxy。
- 三路配额已生效，dry-run 可同时产出 AI HOT、follow-builders、keyword-search 候选。

每日自动化已经从“泛泛联网抓取”升级为：

```text
AI HOT + follow-builders + 联网关键词搜索三路并重 source-router
-> 候选去重 / 初筛 / 原文档案 / Heat Candidate / source-router log
-> Data / PM / Copy Agent 按 V2-DAILY-GOV 做判断和写作
-> V2 content gate / syntax / site data 更新
```

后续 09:00 自动化会同时使用 AI HOT、follow-builders 和联网关键词搜索，不再依赖临时手工找源。
