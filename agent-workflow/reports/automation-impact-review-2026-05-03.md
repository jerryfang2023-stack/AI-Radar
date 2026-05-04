# Automation Impact Review

日期：2026-05-03  
owner：`workflow` / `dev`  
状态：completed

## 1. 本轮变更

本轮完成任务 5-9：

1. 2026-05-04 自动化首跑验收计划。
2. 5 张无 Priority 评分证据 Opportunity 评审。
3. `source-intelligence.md`。
4. `commercial-operating-model.md`。
5. `tag-taxonomy.md`。

## 2. 自动化影响判断

| 变更 | 是否影响自动化 | 影响对象 | 处理 |
|---|---:|---|---|
| `automation-first-run-2026-05-04.md` | 否 | 无 | 仅作为验收计划 |
| `opportunity-priority-gap-review-2026-05-03.md` | 轻微 | `ai-2` / `ai-3` | 强化“不为清零硬绑评分” |
| `source-intelligence.md` | 是 | `ai-the-point` / `ai-2` / `ai-3` | 更新三条自动化读取来源治理 |
| `commercial-operating-model.md` | 否 | 无 | 不影响每日内容生成和入站 |
| `tag-taxonomy.md` | 是 | `ai-the-point` / `ai-2` / `ai-3` | 更新标签生成和未知标签处理规则 |

## 3. 已更新自动化

### `ai-the-point`

已更新：

- 读取 `governance/README.md`、Agent Memory、Quality Gates、Automation Fallback。
- 读取 `source-intelligence.md` 和 `tag-taxonomy.md`。
- Point 至少使用 `point`、`track`、`source` 三类标签。
- 人物姓名不作为 tag。
- 新观点主题进入候选主题或运行报告，不直接写正式新 tag。
- 继续保持只生成 Markdown，不同步网站。

### `ai-2`

已更新：

- 读取 `source-intelligence.md` 和 `tag-taxonomy.md`。
- 优先 S/A 来源，对 C 级线索回找一手证据。
- Signal 至少包含 `track` 和 `evidence`。
- Opportunity 至少包含 `track`、`function`、`scenario`，建议补 `customer`。
- Trend 至少包含 `track` 和 `stage`。
- 不再只写 `AI创业机会`。
- 同义标签按字典归并。
- 无法确定标签时写 `needs_tag_review`，不编造标签。
- 继续保持只生成 Markdown，不同步网站。

### `ai-3`

已更新：

- 读取 `tag-taxonomy.md` 和 `source-intelligence.md`。
- 明确 Tags 不是一线导航，只作为搜索、筛选和关系网络资产。
- 同步闸门不新增标签，只解析已有标签。
- 未来若增加标签检查，未知标签作为软提醒或 `needs_tag_review`，不作为硬错误。
- 继续坚持 blocked / failed 不绕过闸门。

## 4. 未更新自动化

旧自动化 `ai` 当前为 `PAUSED`，不再作为每日商业雷达主流程。本轮未更新。

## 5. 自动化边界保持

三段式边界保持不变：

```text
ai-the-point -> 只写 The Point Markdown
ai-2 -> 只写商业雷达 / 评分 / 趋势 / 机会源 Markdown
ai-3 -> 统一同步网站数据
```

未改变：

- 定时运行时间。
- `cwds`。
- 模型。
- 推理强度。
- 内容生成不直接写 `04-Site/data`。

## 6. 风险

- `tag-taxonomy.md` 是新规则，2026-05-04 自动化首跑可能出现 `needs_tag_review` 或候选标签，需要 Intelligence Data Agent 复核。
- `ai-2` 可能仍会继承提示词旧表达中的泛标签习惯，需要通过首跑验收检查。
- 当前尚未新增 `check-tags.mjs`，标签质量第一阶段仍以人工和报告复核为主。

## 7. 下一步

1. 2026-05-04 首跑后读取三份自动化输出。
2. 检查是否仍出现只有 `AI创业机会` 的 Opportunity。
3. 若标签问题高频出现，Dev Agent 新增 `04-Site/scripts/check-tags.mjs` 或纳入 `run-quality-gates.mjs`。
