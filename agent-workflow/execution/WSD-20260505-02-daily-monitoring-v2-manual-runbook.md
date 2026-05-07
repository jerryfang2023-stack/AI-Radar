# WSD-20260505-02｜日常监测 v2 手工启动 Runbook

日期：2026-05-05  
状态：test-pipeline  
owner：PM / Intelligence Data / Workflow

## 1. 使用边界

本 Runbook 用于手工启动日常监测算法 v2。默认只写入 `06-content/`，不得写入正式 `01-Signals/`、`03-Trends/`、`07-Opportunities/` 或生产同步链路。

本流程可能影响自动化任务口径，但当前不替换 `ai-2`、`ai-3`。

## 2. 口令

| 口令 | 执行范围 | 主要输出 |
|---|---|---|
| `启动：日常监测v2` | 完整流程 | Raw / Pool / Structured / Selected / Insight / Trend / Deep Dive 判断 / Database |
| `启动：日常监测v2-采集` | 采集与初筛 | `01-raw`、`02-pool` |
| `启动：日常监测v2-入库` | 结构化 | `03-structured-signals` |
| `启动：日常监测v2-精选` | 选择 TOP 3 并轻量二次搜索 | `04-selected-signals` |
| `启动：日常监测v2-深挖` | 选择 0-1 个机会并重搜索 | `08-opportunities/deep-dive`、必要时 `09-mvp-validation` |
| `启动：日常监测v2-趋势` | 趋势挂载和长期库更新 | `05-trend-chain`、`10-databases/trends` |
| `启动：日常监测v2-复核` | QA 复核 | 质量报告 / closeout 更新 |

## 3. 执行顺序

### 3.1 完整流程

1. 读取 `AGENTS.md`。
2. 读取 `docs/agent-handoff.md`。
3. 读取 `agent-workflow/product/daily-monitoring-algorithm-v2.md`。
4. 读取 `agent-workflow/product/source-intelligence.md`。
5. 读取 `agent-workflow/product/tag-taxonomy.md`。
6. 执行 Raw / Pool / Structured / Selected / Insight / Trend / Deep Dive 判断。
7. 写入 `06-content/` 对应目录。
8. 运行测试同步和基础质量检查。
9. 更新 closeout 或生成当日报告。

### 3.2 分段流程

分段口令只执行对应阶段，但必须读取上游目录。

- `采集` 读取来源规则，输出 raw、raw 本地原文档案和 pool。
- `入库` 读取 pool，输出 structured。
- `精选` 读取 structured，完成二次搜索后输出 selected。
- `深挖` 读取 selected 和 trend-chain，证据达标才写内参。
- `趋势` 读取 structured、selected、历史 trend database，更新趋势链。
- `复核` 检查数量、字数、来源、反证、标签和目录位置。

## 4. 每日最低完成线

- Raw：30-50 条；每条必须有本地原文档案、出处 URL 和来源类型。
- Pool：10-15 条。
- Structured：5-8 条。
- Selected：正好 3 条。
- Insight：至少 1 条。
- Trend：全量结构化 Signal 都有趋势处理。
- Database：至少更新趋势库。

深挖机会不足证据时，不强行写内参，统一输出：

```text
今日暂无足够证据支撑深挖内参。
```

## 5. 标签规则

每条核心内容必须区分：

- `primary_title_family`
- `primary_trend_label`
- `formal_tags`
- `classification_labels`
- `candidate_tags`

正式标签只使用 `agent-workflow/product/tag-taxonomy.md` 的 `tag_id`。新标签不得直接进入正式字典。

## 6. 验收

复核至少检查：

1. 目录是否写入新编号结构。
2. 数量是否达标。
3. Raw 每条是否引用 `06-content/01-raw/originals/YYYY-MM-DD/` 中的本地原文档案。
4. 精选 3 条是否各有 3 类二次搜索。
5. 深挖是否有 5 类交叉验证、证据链和反向证据。
6. 结构化 Signal 是否完成 6 维度分析。
7. 标签是否与现有标题体系和 tag taxonomy 兼容。
8. 是否未触碰正式生产同步链路。

## 7. Raw 原文档案

Raw 阶段必须保存本地原文，统一路径：

```text
06-content/01-raw/originals/YYYY-MM-DD/R-001-source-title.md
```

Raw 列表中的 30-80 字是采集理由，不是原文替代。若某条线索只有链接、没有本地原文档案，只能留在 `00-inbox/`。
