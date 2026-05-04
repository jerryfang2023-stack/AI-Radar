---
title: Tag Taxonomy Source Cleanup
date: 2026-05-03
owner: data-agent
type: tag-quality-report
status: passed
---

# Tag Taxonomy Source Cleanup

## 结论

已根据 `agent-workflow/product/tag-taxonomy.md` 完成源 Markdown 与网站公开 tags 的整理。

本轮把 tags 从“内容类型词 + 随手标签”收敛为正式字典资产：

- 原始 Markdown frontmatter 禁用旧标签命中：0
- 网站公开 tags：46 个
- 网站公开 tags 禁用别名命中：0
- 网站公开 tags 未知正式标签命中：0
- 关系检查硬错误：0
- The Point 质量检查硬错误：0

## 主要动作

1. 批量整理原始 Markdown frontmatter tags：
   - `01-Signals/*.md`
   - `02-Scoring/*.md`
   - `03-Trends/AI趋势总表.md`
   - `05-Point/2026-05-03-The-Point.md`
   - `05-Point/sources/2026-05-03/*.md`
   - `07-Opportunities/*.md`

2. 清理泛标签和旧别名：
   - 移除 `AI创业机会` 作为 Opportunity 唯一标签。
   - 归并 `AI-Agent` -> `AI Agent`。
   - 归并 `AI编程` / `AI-Coding` -> `AI Coding`。
   - 归并 `AI增长` -> `AI营销`。
   - 归并 `Voice-AI` / `语音Agent` -> `AI客服`。
   - 归并 `企业数据` / `企业知识库` -> `企业数据智能`。

3. 调整网站同步逻辑：
   - 原始 Markdown frontmatter tags 成为公开标签权威输入。
   - 详细行业、能力、动作、产品词保留在 `taxonomy` 中用于关系匹配。
   - 前台 `tags` 只允许进入正式字典，避免标签墙膨胀。

4. 新增检查与复用工具：
   - `agent-workflow/tools/normalize-source-tags.mjs`
   - `04-Site/scripts/check-tags.mjs`

5. 更新统一同步闸门：
   - `agent-workflow/tools/unified-site-sync.mjs` 已加入 `check-tags.mjs`。
   - 同步闸门现在会检查 tag 禁用别名与未知公开标签。

## 验证结果

- `node --check 04-Site/scripts/sync-data.mjs` passed
- `node --check 04-Site/scripts/check-tags.mjs` passed
- `node --check agent-workflow/tools/normalize-source-tags.mjs` passed
- `node --check agent-workflow/tools/unified-site-sync.mjs` passed
- `node 04-Site/scripts/sync-data.mjs` passed
- `node 04-Site/scripts/check-tags.mjs` passed：46 unique tags / 0 forbidden / 0 unknown
- `node 04-Site/scripts/check-relations.mjs` passed：硬错误 0，软提醒 10
- `node 04-Site/scripts/check-point-quality.mjs` passed：硬错误 0，软提醒 3
- `node agent-workflow/tools/unified-site-sync.mjs --date=2026-05-03` passed
- `node agent-workflow/tools/run-quality-gates.mjs syntax` passed

## 保留软提醒

关系检查保留 10 条 Opportunity -> Priority 软提醒，均为早期机会卡暂无 Priority 评分证据。按 Intelligence Data Agent 规则，不为清零软提醒强行绑定评分证据。

The Point 保留 3 条 Point -> Trend 软提醒，均为部分观点尚未进入趋势观察，非展示断链。

## 自动化影响

本轮影响三段式自动化：

- `ai-the-point`：已更新标签生成要求，避免每日 The Point frontmatter 泛标签被所有 Point 继承。
- `ai-2`：已更新内容生成要求，新增或更新 Opportunity 必须写正式字典标签，不再写泛标签。
- `ai-3`：已更新统一同步闸门要求，并要求同步后运行 `check-tags.mjs`。

同步边界未改变：The Point 和商业雷达只写 Markdown，网站入站仍由 `ai-3` 统一执行。
