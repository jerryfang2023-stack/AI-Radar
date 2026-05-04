# 统一网站同步闸门

生成时间：2026/5/4 20:56:11

## 结论

- 日期：2026-05-04
- 状态：synced
- 阻塞项：0
- 备份目录：agent-workflow/backups/unified-site-sync/20260504-125611

## 内容就绪检查

1. **AI商业雷达**：Signals 文件就绪：01-Signals/2026-05-04-AI商业雷达.md，Signal 数量 6
2. **AI机会评分**：Scoring 文件就绪：02-Scoring/2026-05-04-AI机会评分.md，评分行 6
3. **The Point**：The Point 文件就绪：05-Point/2026-05-04-The-Point.md，Point 数量 10
4. **Priority Engine 2.0**：Judgment Node 闸门检查：Priority Rows 39，Judgment Nodes 22，覆盖率 39/39。
5. **统一同步**：网站数据同步、关系检查、The Point 质量检查、Tag Quality Check 和 Priority Engine 2.0 Judgment Node 闸门均通过。

## 阻塞项

无

## 执行命令

1. `node --check 04-Site/scripts/sync-data.mjs` -> exit 0

   stdout: -

   stderr: -

2. `node --check 04-Site/scripts/check-relations.mjs` -> exit 0

   stdout: -

   stderr: -

3. `node --check 04-Site/scripts/check-point-quality.mjs` -> exit 0

   stdout: -

   stderr: -

4. `node --check 04-Site/scripts/check-tags.mjs` -> exit 0

   stdout: -

   stderr: -

5. `node 04-Site/scripts/sync-data.mjs` -> exit 0

   stdout: Synced 33 signals, 39 score rows, 13 trends, 34 points, 5 point sources, 27 opportunities.

   stderr: -

6. `node 04-Site/scripts/check-relations.mjs` -> exit 0

   stdout: - Signal / Opportunity / Trend 的弱关联可能来自标签相似度，本检查只校验引用是否存在，不逐条要求双向完全一致。 / - The Point 只作为观点共识、分歧或边界信号，不作为 Judgment Node 的事实证据直接加权。 / - 每次运行同步脚本后，应再运行本检查，确认新增内容没有断链。

   stderr: -

7. `node 04-Site/scripts/check-point-quality.mjs` -> exit 0

   stdout: - X 观点不强制绑定站内素材笔记；Podcast / Blog / YouTube 观点建议绑定素材笔记。 / - 第三方全文入库前必须确认授权或自有导出边界；没有全文时，素材页使用结构化阅读摘要和高价值原文段。 / - 每次运行同步脚本和关系检查后，建议继续运行本检查。

   stderr: -

8. `node 04-Site/scripts/check-tags.mjs` -> exit 0

   stdout: Tag check complete: 47 unique tags, 0 forbidden alias hits, 0 unknown public tag hits

   stderr: -

## 处理规则

- 只有 AI商业雷达、AI机会评分、The Point 三类当天 Markdown 同时就绪，才允许同步网站。
- 任一内容缺失、空跑、失败、待补充或字段不完整，均阻止入站。
- 同步前先备份网站数据文件；同步后关系检查或 The Point 质量检查出现硬错误，则恢复备份。
- Priority Engine 2.0 的 Judgment Node 覆盖率是 ai-3 硬闸门：Priority Row 必须 100% 进入 Judgment Node，Judgment Node 不得断链，priorityEngine 摘要必须与实际数据一致。
- 内容生产任务不得直接运行网站同步，统一由本闸门执行。
