# 统一网站同步闸门

生成时间：2026/5/4 17:13:44

## 结论

- 日期：2026-05-04
- 状态：synced
- 阻塞项：0
- 备份目录：agent-workflow/backups/unified-site-sync/20260504-091344

## 内容就绪检查

1. **AI商业雷达**：Signals 文件就绪：01-Signals/2026-05-04-AI商业雷达.md，Signal 数量 6
2. **AI机会评分**：Scoring 文件就绪：02-Scoring/2026-05-04-AI机会评分.md，评分行 6
3. **The Point**：The Point 文件就绪：05-Point/2026-05-04-The-Point.md，Point 数量 10
4. **统一同步**：网站数据同步、关系检查、The Point 质量检查和 Tag Quality Check 均通过。

## 阻塞项

无

## 执行命令

1. `C:\Program Files\nodejs\node.exe --check 04-Site/scripts/sync-data.mjs` -> exit 0

   stdout: -

   stderr: -

2. `C:\Program Files\nodejs\node.exe --check 04-Site/scripts/check-relations.mjs` -> exit 0

   stdout: -

   stderr: -

3. `C:\Program Files\nodejs\node.exe --check 04-Site/scripts/check-point-quality.mjs` -> exit 0

   stdout: -

   stderr: -

4. `C:\Program Files\nodejs\node.exe --check 04-Site/scripts/check-tags.mjs` -> exit 0

   stdout: -

   stderr: -

5. `C:\Program Files\nodejs\node.exe 04-Site/scripts/sync-data.mjs` -> exit 0

   stdout: Synced 33 signals, 39 score rows, 13 trends, 34 points, 5 point sources, 27 opportunities.

   stderr: -

6. `C:\Program Files\nodejs\node.exe 04-Site/scripts/check-relations.mjs` -> exit 0

   stdout: - 软提醒是运营复核项，不一定是错误，可能是新机会、新趋势或早期信号尚未形成闭环。 / - Signal / Opportunity / Trend 的弱关联可能来自标签相似度，本检查只校验引用是否存在，不逐条要求双向完全一致。 / - 每次运行同步脚本后，应再运行本检查，确认新增内容没有断链。

   stderr: -

7. `C:\Program Files\nodejs\node.exe 04-Site/scripts/check-point-quality.mjs` -> exit 0

   stdout: - X 观点不强制绑定站内素材笔记；Podcast / Blog / YouTube 观点建议绑定素材笔记。 / - 第三方全文入库前必须确认授权或自有导出边界；没有全文时，素材页使用结构化阅读摘要和高价值原文段。 / - 每次运行同步脚本和关系检查后，建议继续运行本检查。

   stderr: -

8. `C:\Program Files\nodejs\node.exe 04-Site/scripts/check-tags.mjs` -> exit 0

   stdout: Tag check complete: 47 unique tags, 0 forbidden alias hits, 0 unknown public tag hits

   stderr: -

## 处理规则

- 只有 AI商业雷达、AI机会评分、The Point 三类当天 Markdown 同时就绪，才允许同步网站。
- 任一内容缺失、空跑、失败、待补充或字段不完整，均阻止入站。
- 同步前先备份网站数据文件；同步后关系检查或 The Point 质量检查出现硬错误，则恢复备份。
- 内容生产任务不得直接运行网站同步，统一由本闸门执行。
