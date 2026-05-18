# 统一网站同步闸门

生成时间：2026/5/15 18:51:56

## 结论

- 日期：2026-05-15
- 状态：blocked
- 阻塞项：3
- 备份目录：未创建

## 内容就绪检查

无

## 阻塞项

1. **AI商业雷达**：缺少当天 Signals 文件或文件为空：01-Signals/2026-05-15-AI商业雷达.md
2. **AI机会评分**：缺少当天 Scoring 文件或文件为空：02-Scoring/2026-05-15-AI机会评分.md
3. **The Point**：缺少当天 The Point 文件或文件为空：05-Point/2026-05-15-The-Point.md

## 执行命令

未执行同步命令。

## 处理规则

- 只有 AI商业雷达、AI机会评分、The Point 三类当天 Markdown 同时就绪，才允许同步网站。
- 任一内容缺失、空跑、失败、待补充或字段不完整，均阻止入站。
- 同步前先备份网站数据文件；同步后关系检查或 The Point 质量检查出现硬错误，则恢复备份。
- Priority Engine 2.0 的 Judgment Node 覆盖率是 ai-3 硬闸门：Priority Row 必须 100% 进入 Judgment Node，Judgment Node 不得断链，priorityEngine 摘要必须与实际数据一致。
- 内容生产任务不得直接运行网站同步，统一由本闸门执行。
