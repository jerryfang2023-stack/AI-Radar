# WSD-20260511-03-v2-page-copy-quality-review-skill Closeout

日期：2026-05-11  
执行窗口：独立治理执行窗口  
牵头 Agent：QA / Acceptance Agent  
结论：accepted

## 1. 修改文件列表

- `agent-workflow/governance/page-copy-quality-review-skill.md`
- `agent-workflow/execution/TASK-page-copy-quality-review-template.md`
- `agent-workflow/agents/qa-agent.md`
- `agent-workflow/governance/current-context.md`
- `AGENTS.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/reports/WSD-20260511-03-v2-page-copy-quality-review-skill-closeout.md`
- `agent-workflow/inbox/closeout-queue.jsonl`

未修改：

- `01-SiteV2/site/`
- `01-SiteV2/content/`
- `01-SiteV2/knowledge/`
- `docs/brand/wavesight-ai-vi/`
- `09-ai-news-radar/`
- `10-Archive/`

说明：当前工作区存在派发前遗留的其他未提交变更，其中包含网站和内容相关路径。本任务执行窗口未读取、编辑或回滚这些路径，只新增 / 更新上方列出的治理、模板、看板、收口和收口箱文件。

## 2. 新 Skill 摘要

已创建 `page-copy-quality-review-skill.md`，定位为观澜AI页面与文案独立质检 Skill。它用于审查网站页面、栏目页、详情页、商业内参页、热力图页、小程序诊断页和会员入口页。

核心问题：

1. 这是不是观澜AI？
2. 有没有商业判断？
3. 像不像真人写的？
4. 能不能让老板产生信任？

Skill 明确只做评审、打分、问题指出和修改指令输出，不直接修改页面代码、内容文件或 VI 资产。

## 3. 硬闸门摘要

七维评分，每项 10 分，总分 70 分：

1. 定位一致性
2. 信息架构
3. 商业判断
4. 文案自然度
5. 视觉体验
6. 页面节奏
7. 可信度

通过线：

- `accepted`：总分不少于 58 / 70，且定位一致性、商业判断、文案自然度、可信度均不低于 8，其他维度不低于 7。
- `needs-revision`：总分 49-57，或任一非核心维度为 6。
- `failed`：总分低于 49，或定位一致性 / 商业判断 / 文案自然度 / 可信度任一项低于 7。
- `needs-input`：缺少截图、页面 URL、开发 closeout 或核心规范。

硬停顿：

- 页面不像观澜AI，即使语法、链接和截图通过，也不得 accepted。
- 文案明显像 AI 模板，即使页面美观，也不得 accepted。
- 页面 / 文案开发窗口使用本 Skill 给自己 accepted，该结论无效。

## 4. 独立流程接入

已在 Skill、任务模板、QA Agent、`current-context.md` 和 `AGENTS.md` 写入后续流程：

```text
页面 / 文案开发完成
-> 开发窗口写 closeout
-> 调度窗口派发独立质检任务
-> 质检窗口按 Skill 打分和输出修改指令
-> 不达标则退回 Dev / Copy
-> 达标后调度窗口才可 accepted
```

开发窗口不能自验自收。调度窗口只有在独立质检报告结论为 `accepted` 且硬闸门满足后，才可将页面 / 文案开发任务 accepted。

## 5. 输出格式

已在 Skill 和任务模板中明确独立质检报告必须包含：

1. 总体判断
2. 七维评分表
3. 主要问题
4. 模块级优化建议
5. 文案改写建议和替换版本
6. 视觉与节奏建议
7. 转化路径建议
8. Codex 执行指令

## 6. 质量检查结果

- `feature_list.json` JSON 解析：通过。
- `dispatch-board.md` 可检索到本任务：通过。
- `current-context.md` 已包含独立质检规则：通过。
- `qa-agent.md` 已包含页面 / 文案独立质检职责：通过。
- 新增 Markdown 使用 UTF-8 文本写入。

未运行页面构建、站点语法、浏览器截图或 V2 内容检查；原因是本任务只修改治理、模板和工作流文件，不涉及页面代码、内容数据或站点资源。

## 7. 后续建议

后续所有页面 / 文案开发派发单应引用 `TASK-page-copy-quality-review-template.md` 创建独立质检任务。尤其是会员入口页、机会解码页、商业内参页和小程序诊断页，不应再由开发窗口用“语法通过 / 页面可打开 / 截图存在”作为验收结论。

## 8. Closeout Queue 登记状态

已登记到：

```text
agent-workflow/inbox/closeout-queue.jsonl
```
