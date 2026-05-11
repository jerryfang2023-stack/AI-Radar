---
task_id: WSD-20260510-05-v2-daily-monitoring-rerun-and-obsidian-review
title: V2 今日监测更新版补跑与 Obsidian 内容库结构复核
date: 2026-05-10
status: accepted / rerun-complete
owner: Workflow / Data / Dev
encoding: UTF-8
---

# V2 今日监测更新版补跑与 Obsidian 内容库结构复核

## 1. 用户要求

1. 判断 Obsidian 中长期积累观点库 / 案例库 / 信号库时，当前文件夹设置是否需要优化。
2. 重新执行今日更新后的监测任务。

## 2. Obsidian 结构复核

已确认 Obsidian vault 根目录为：

```text
C:\Users\86186\Documents\Fang\wiki\AI热点
```

当前 `01-WaveSight/01-SiteV2/content/` 是生产漏斗目录，适合自动化运行，不适合作为唯一的 Obsidian 长期知识库结构。

建议保留现有生产漏斗，并新增一层知识库沉淀目录：

```text
01-WaveSight/
  01-SiteV2/
    content/                 # 生产漏斗，不打乱
    knowledge/               # 建议新增：Obsidian 长期知识库层
      00-MOC/
      01-Signals/
      02-Points/
      03-Cases/
      04-Opportunities/
      05-Trends/
      06-Sources/
      07-Companies/
      08-People/
      09-Templates/
      99-Archive/
```

核心原则：

- `content/` 负责每日生产与站点更新。
- `knowledge/` 负责长期可复用知识资产。
- 每条 Signal / Point / Case 都保留稳定 ID，并双链到来源、公司、趋势、机会。
- 不把 Raw 80-150 全部平铺进知识库；只有进入 Pool / Structured / Point / Case 的内容才沉淀成长期笔记。

## 3. 今日监测补跑完成

本轮按新版 V2 口径补跑 2026-05-10：

- Raw：从 30 扩展到 90。
- Raw originals：90 个本地原文档案。
- Pool：从 12 扩展到 22。
- Structured Signals：从 6 扩展到 10。
- Front Signals：保留 3 条已完成二搜与深度门槛的前台 Signal。
- Point Calibration：从 3 条扩展到 6 条，其中新增 3 条 follow-builders Builder 观点。
- Deep Dive：未新增。原因是本轮新增候选多为 Raw / Pool / Structured 扩展，未形成新的 5 源以上、2 个一手来源以上的深挖机会证据链；未硬凑。

新增 / 更新文件：

- `01-SiteV2/content/01-raw/2026-05-10-raw-candidates.md`
- `01-SiteV2/content/01-raw/originals/2026-05-10/`
- `01-SiteV2/content/02-pool/2026-05-10-signal-pool.md`
- `01-SiteV2/content/03-structured-signals/2026-05-10-structured-signals.md`
- `01-SiteV2/content/07-points/2026-05-10-point-calibration.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`
- `agent-workflow/tools/v2-content-gate.mjs`
- `agent-workflow/reports/2026-05-10-v2-content-site-daily-update-rerun-log.md`
- `agent-workflow/reports/follow-builders-digest-input-2026-05-10-rerun.json`

## 4. 来源执行情况

已使用：

- GDELT
- AI HOT
- Hacker News
- GitHub
- arXiv
- follow-builders

失败 / 降级：

- GDELT 部分查询返回 429，已记录在 `agent-workflow/reports/2026-05-10-v2-content-site-daily-update-rerun-log.md`。
- follow-builders 作为 M 级 builder-monitor，只补入 Point Calibration，不作为事实主证据。
- AI HOT / HN / X 等 M/C 级线索只进入 Raw / Pool 或 Point 候选；进入前台 Signal 前仍需解析原始 URL 并补 S/A/B 来源。

## 5. 验证

已运行：

- `node agent-workflow/tools/v2-source-probe.mjs --date=2026-05-10`：5/5 succeeded。
- `node agent-workflow/tools/v2-source-quality-gate.mjs --date=2026-05-10`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-10`：passed。
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-10`：成功生成 `site-content.json` / `site-content.js`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。

关键指标：

| 指标 | 数量 |
|---|---:|
| Raw Candidates | 90 |
| Raw Originals | 90 |
| Pool Items | 22 |
| Structured Signals | 10 |
| Front Signals | 3 |
| Point Items | 6 |

报告：

- `agent-workflow/reports/v2-source-probe-2026-05-10.md`
- `agent-workflow/reports/v2-source-quality-gate-2026-05-10.md`
- `agent-workflow/reports/quality-gates-v2content-2026-05-10-20260510-055527.md`
- `agent-workflow/reports/quality-gates-syntax-2026-05-10-20260510-055538.md`

## 6. 遗留与建议

- `01-SiteV2/content/README.md` 已同步新版数量口径。
- `v2-content-gate.mjs` 已同步新版 80-150 / 20-30 / 8-15 / 3-5 检查口径。
- 本轮未创建 `knowledge/` 目录，因用户当前询问是结构判断；建议确认后再执行物理建目录和模板迁移。
- Deep Dive 未新增，属于证据不足不硬凑；后续若 90 条 Raw 中某一方向证据链补足，可单独执行深挖。
