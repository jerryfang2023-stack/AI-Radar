# The Point 每日自动更新任务

更新时间：2026-05-03  
owner：`workflow`  
协作 agent：`data`、`dev`、`daily-brief`、`trend-intelligence`、`opportunity-engine`、`qa`

## 1. 任务目标

每天自动生成 The Point 建造者观点栏目内容，先写入 Obsidian。网站同步不由 The Point 任务单独触发，而是交给商业雷达的统一同步流程一起执行，避免多个自动化任务同时写入网站数据。

The Point 每日任务需要完成两件事：

1. 写入 Obsidian 项目目录，形成可长期沉淀的 Markdown 内容。
2. 给后续统一网站同步流程提供稳定输入。

协调原则：

- The Point 自动化只负责生成 `05-Point/YYYY-MM-DD-The-Point.md`。
- 商业雷达自动化仍是主同步任务，负责统一运行网站同步和关系检查。
- 不允许 The Point 任务和商业雷达任务同时写入 `04-Site/data/radar-data.json`。
- 如果 The Point 任务晚于商业雷达同步完成，则当天 The Point 可在下一次统一同步时入站。

## 2. 运行时间

一句话指令：`更新网站前置 ai-the-point：生成今天 The Point（只写 05-Point 与运行报告，不同步网站）。`

```text
每日 08:30
```

时区：

```text
Asia/Shanghai
```

## 3. 输入来源

第一阶段使用已安装的 `follow-builders` skill。

安装位置：

```text
C:\Users\86186\.codex\skills\follow-builders
```

核心命令：

```bash
node scripts/prepare-digest.js
```

说明：

- 该命令从中心化 feed 获取 X / Twitter、播客和博客来源。
- 不需要 X、YouTube 或 podcast API key。
- 当前网络不稳定时可能 fetch 失败，因此必须设计缓存和降级。

## 4. 输出目录

Obsidian 内容目录：

```text
05-Point/
```

完整位置：

```text
01-WaveSight/05-Point/
```

文件命名规则参照商业雷达和评分文件：

```text
YYYY-MM-DD-The-Point.md
```

示例：

```text
2026-05-04-The-Point.md
```

## 5. Markdown 内容结构

每个 The Point Markdown 至少包含：

```markdown
---
type: the-point
date: 2026-05-04
status: published
source_skill: follow-builders
generated_at: 2026-05-04T08:30:00+08:00
---

# 2026-05-04 The Point

## 今日 Top10

### 1. 观点标题

- 人物：
- 来源：
- 原文：
- 主题：
- 赛道：
- Point Score：
- 观点摘要：
- 观澜解读：
- 商业含义：
- 观点边界：
- 关联 Signals：
- 关联 Trends：
- 关联 Opportunities：

## 今日主题热度

| Topic | 今日热度 | 7日热度 | 30日热度 | 状态 |
|---|---:|---:|---:|---|

## 观点分歧与反证

## 运行备注
```

## 6. 自动化流程

1. 运行 `follow-builders/scripts/prepare-digest.js`。
2. 获取候选 tweets、podcasts、blogs。
3. 提取候选观点。
4. 翻译或整理为中文摘要。
5. 按 Point Score 评分。
6. 选出每日 Top10。
7. 计算 topic / track 热度。
8. 关联已有 Signals、Trends、Opportunities。
9. 写入 `05-Point/YYYY-MM-DD-The-Point.md`。
10. 将运行结果写入：

```text
agent-workflow/daily-run-log.md
```

11. 标记等待统一同步：

```text
sync_status: pending_unified_sync
```

The Point 任务不直接运行：

```bash
node 04-Site/scripts/sync-data.mjs
node 04-Site/scripts/check-relations.mjs
```

这两个步骤由商业雷达统一同步任务负责。

## 7. 与商业雷达同步任务的协调

当前已有商业雷达自动化任务负责生成 Signals、Scoring、Trends、Opportunities，并统一同步网站数据。

The Point 必须作为该流程的上游内容生产任务，而不是另一个并行写站任务。

推荐顺序：

```text
08:30 The Point -> 写入 05-Point Markdown -> 记录 pending_unified_sync
商业雷达任务 -> 生成 Signals / Scoring / Trends / Opportunities
统一同步 -> sync-data.mjs 一次性解析所有内容源
统一检查 -> check-relations.mjs
统一记录 -> daily-run-log.md
```

统一同步需要包含：

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-Point/`
- `07-Opportunities/`

如果同一天商业雷达和 The Point 都需要更新网站：

- 只运行一次 `sync-data.mjs`。
- 只运行一次 `check-relations.mjs`。
- 以统一同步结果为准更新 `radar-data.json` 和 `radar-data.js`。

## 8. 网站同步接入要求

后续 Dev Agent 需要接入：

- `04-Site/config/content-paths.json`：增加 `points` 路径。
- `04-Site/scripts/sync-data.mjs`：解析 `05-Point/`。
- `04-Site/data/radar-data.json`：新增 `points` 和 `pointTopics`。
- `04-Site/data/radar-data.js`：同步新增数据。

网站消费位置：

- `the-point.html`
- `point.html`
- `daily-detail.html`
- `trend.html`
- `opportunity.html`
- `index.html`

## 9. 失败与降级

如果 `follow-builders` feed 获取失败：

- 不生成空文件。
- 不覆盖当天已有 The Point 文件。
- 优先使用最近一次成功缓存作为参考，但必须标注日期。
- 在 `daily-run-log.md` 中记录失败原因。
- 不把失败或空内容标记为可同步。
- 不影响商业雷达任务继续执行。

如果候选观点不足 10 条：

- 不强行凑满 Top10。
- 输出实际数量。
- 文件状态标为 `needs_review`。
- 首页不展示 `needs_review` 内容。

## 10. 验收标准

- 每日 08:30 有自动任务定义。
- 自动任务生成 `05-Point/YYYY-MM-DD-The-Point.md`。
- Markdown 能被 Obsidian 直接阅读。
- The Point 任务本身不直接写入网站数据文件。
- 统一网站同步后数据中存在 `points` 和 `pointTopics`。
- The Point 可被 Daily Brief、Trends、Opportunities 和首页读取。
- feed 失败不会覆盖已有内容。
- The Point 任务不会和商业雷达任务同时运行 `sync-data.mjs`。
- 运行结果写入 `daily-run-log.md`。

## 11. 落地状态

2026-05-03 已创建 Codex cron automation：

- 自动化名称：观澜AI The Point 每日观点生成
- 自动化 ID：`ai-the-point`
- 状态：ACTIVE
- 计划时间：每日 08:30
- 运行目录：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight`

边界已写入自动化提示词：

- 只写 `05-Point/`、`05-Point/sources/`、`agent-workflow/daily-run-log.md` 和必要运行报告。
- 不运行网站同步。
- 不运行关系检查。
- 不直接写入 `04-Site/data/radar-data.json` 或 `04-Site/data/radar-data.js`。
- 成功产物标记为 `pending_unified_sync`，等待商业雷达统一同步。

落地报告：

- `agent-workflow/reports/the-point-automation-setup-2026-05-03.md`
