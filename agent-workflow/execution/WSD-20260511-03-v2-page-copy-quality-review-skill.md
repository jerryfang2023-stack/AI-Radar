# WSD-20260511-03-v2-page-copy-quality-review-skill 派发单

日期：2026-05-11  
状态：ready  
派发模式：formal_task / governance_upgrade  
牵头 Agent：QA / Acceptance Agent  
协作 Agent：UI-UE Agent / Copy Agent / PM Agent / Workflow Agent  
任务类型：独立质检流程 / 页面与文案审美门禁 / V2-only 治理升级  
Skill Pattern：Reviewer + Inversion + Pipeline + Tool Wrapper  

## 0. 任务卡片

为观澜AI创建“页面与文案独立质检 Skill”，用于独立审查网站页面、栏目页、详情页、内参页、热力图页、小程序诊断页和会员入口页。

这个 Skill 不是错别字检查，也不是普通 UI 好看不好看检查，而是回答四个核心问题：

1. 这是不是观澜AI？
2. 有没有商业判断？
3. 像不像真人写的？
4. 能不能让老板产生信任？

本任务要解决当前问题：开发窗口自查质量过低，页面 / 文案明显不合规但仍然通过。因此，后续页面 / 文案开发任务必须引入独立质检窗口，开发窗口不得自验自收。

## 1. 执行窗口启动读取

新窗口先读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `agent-workflow/execution/WSD-20260511-03-v2-page-copy-quality-review-skill.md`

本任务补读：

1. `agent-workflow/agents/qa-agent.md`
2. `agent-workflow/agents/ui-ue-agent.md`
3. `agent-workflow/agents/copy-agent.md`
4. `agent-workflow/product/DESIGN.md`
5. `agent-workflow/product/COPY.md`
6. `agent-workflow/product/strategy-single-source.md`
7. `docs/brand/wavesight-ai-vi/USAGE.md`
8. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
9. `docs/brand/wavesight-ai-vi/brand-tokens.css`

不要读取或继承 `V2-SITE-QUALITY-AUTO` 的 stage1 / stage2 / reference mockups / local-site-quality-pass 结论。

## 2. 背景与问题

当前 V2 页面开发中存在明显质量风险：

1. 开发窗口往往只检查语法、页面可打开、截图存在，却没有检查“是否像观澜AI”。
2. 页面和文案可能像普通 AI 新闻站、AI 工具导航、SaaS 模板页或知识付费落地页。
3. 文案容易出现 AI 味、模板句式、机械分点、空泛正确和过度营销。
4. 页面可能缺少商业判断，只是堆新闻、堆卡片、堆摘要。
5. 质检报告如果只写“已通过”，无法指导 Dev / Copy 精准修改。

因此，需要建立一个独立于页面 / 文案开发之外的质检 Skill。它只做评审、打分、指出问题和生成修改指令，不直接改页面代码。

## 3. 目标

本任务必须产出：

1. `agent-workflow/governance/page-copy-quality-review-skill.md`
2. `agent-workflow/execution/TASK-page-copy-quality-review-template.md`
3. 更新 `agent-workflow/agents/qa-agent.md`，加入此独立质检职责。
4. 更新 `agent-workflow/governance/current-context.md`，加入后续页面 / 文案任务的独立质检口径。
5. 更新 `AGENTS.md`，加入页面 / 文案开发不能自验自收的硬闸门。
6. 更新 `agent-workflow/execution/dispatch-board.md`，登记任务状态。
7. 写 closeout 并登记 closeout queue。

最终流程必须明确：

```text
页面 / 文案开发完成
-> 开发窗口写 closeout
-> 调度窗口派发独立质检任务
-> 质检窗口按 Skill 打分和输出修改指令
-> 不达标则退回 Dev / Copy
-> 达标后调度窗口才可 accepted
```

## 4. Skill 核心定位

Skill 名称建议：

```text
观澜AI页面与文案质检 Skill
```

用途：

对观澜AI网站页面、栏目页、详情页、内参页、热力图页、小程序诊断页、会员入口页进行综合质检。

它必须从“观澜AI是否像一个面向企业经营者的 AI 商业判断系统”出发，检查：

1. 页面定位
2. 信息结构
3. 商业判断
4. 文案自然度
5. 视觉体验
6. 页面节奏
7. 可信度
8. 转化路径

其中前 7 项打分，转化路径作为独立建议项。

## 5. 前置规范

Skill 执行时必须参考：

1. 观澜 VI 规范：颜色、字体、字号、卡片、间距、留白、动效、整体高级感。
2. 观澜文案规范：冷静、有判断、有温度的商业内参风，避免 AI 味、机械分点、模板句式、空泛表达和过度营销。
3. 观澜项目定位：服务企业经营者、资源型合伙人、行业操盘手，而不是普通 AI 工具学习者。
4. 观澜内容实验规范：栏目内容必须从新闻摘要升级为商业判断。
5. AI 商业热力图探索规范：涉及热力图时必须围绕行业、岗位、流程、影响路径展开。

如果上述某些规范尚未有单独文件，Skill 中要写明对应的当前可信来源或“待补文件”，不得假装已有。

## 6. 质检维度

### 6.1 定位一致性

检查页面是否符合观澜AI定位。

重点判断：

1. 是否像观澜AI，而不是普通 AI 新闻站、AI 工具导航站、科技媒体或知识付费落地页。
2. 是否面向企业经营者、资源型合伙人、行业操盘手。
3. 是否围绕 AI 对行业、岗位、流程、商业机会的影响展开。
4. 是否体现商业判断，而不只是信息展示。

### 6.2 信息架构

检查页面阅读路径是否清晰。

推荐结构：

```text
先判断 -> 再事实 -> 再影响 -> 再机会 -> 再行动入口
```

重点判断：

1. 用户第一眼能否看懂页面价值。
2. 主标题是否有判断感。
3. 副标题是否说明适合谁。
4. 核心结论是否前置。
5. 模块之间是否有逻辑递进。
6. 是否存在重复模块或页面太散。

### 6.3 商业判断

检查内容是否具备观澜AI最核心的判断价值。

必须尽量回答：

1. 发生了什么？
2. 为什么重要？
3. 影响谁？
4. 影响哪个行业？
5. 影响哪个岗位？
6. 影响哪个流程？
7. 机会在哪里？
8. 风险在哪里？
9. 企业该如何判断？

### 6.4 文案自然度

检查文案是否有明显 AI 味、模板感、机械感。

重点判断：

1. 是否大量机械分点。
2. 是否句式重复。
3. 是否频繁使用“不是……而是……”“表面看……真正……”等模板句。
4. 是否堆砌赋能、重构、闭环、生态、范式、底座等词。
5. 是否每段都像标准答案。
6. 是否缺少真实项目感、人的体感和表达节奏。
7. 是否空泛正确但没有信息增量。

质检目标：

文案应像一个长期观察产业、亲自做项目、懂企业经营的人写出来，而不是 AI 模板生成。

### 6.5 视觉体验

检查页面是否符合观澜AI的高级、克制、内参感。

重点判断：

1. 是否符合观澜 VI 主色、字体、字号、间距、卡片规范。
2. 是否克制、有留白、有秩序。
3. 是否科技感过度。
4. 是否像普通 SaaS 模板。
5. 是否像 AI 工具导航站。
6. 是否装饰元素抢内容。

当前开发阶段桌面端优先：桌面端视觉体验是硬闸门；移动端专项暂缓，除非派发单明确要求。

### 6.6 页面节奏

检查页面是否有轻重变化，避免视觉和内容重复。

必须输出：

1. 哪些模块可以合并。
2. 哪些模块可以删除。
3. 哪些模块需要提升视觉权重。
4. 哪些模块应该弱化。
5. 哪些模块形式重复。

### 6.7 可信度

检查页面判断是否可靠，是否避免拍脑袋和夸大。

重点判断：

1. 判断是否有事实支撑。
2. 是否区分事实和观点。
3. 是否夸大结论。
4. 是否把趋势说成确定性。
5. 是否把个案说成普遍规律。
6. 是否有风险和边界。
7. 是否避免用单一新闻推出大结论。
8. 是否避免把海外案例直接等同国内机会。
9. 是否避免把融资热度等同商业价值。
10. 是否避免把工具流行等同企业真实需求。

### 6.8 转化路径

转化路径不计入 70 分总分，但必须单独输出建议。

重点判断：

1. 主 CTA 是否清晰。
2. 是否需要增加低门槛入口。
3. 是否过早销售。
4. 是否为了转化牺牲观澜AI的克制感和专业感。

## 7. 评分与硬闸门

每次质检按 7 个维度打分，每项 10 分，总分 70 分：

1. 定位一致性
2. 信息架构
3. 商业判断
4. 文案自然度
5. 视觉体验
6. 页面节奏
7. 可信度

评分解释：

| 分数 | 判断 |
|---:|---|
| 9-10 | 可以上线，仅需微调 |
| 7-8 | 基本合格，但需要优化局部 |
| 5-6 | 方向可用，但问题明显 |
| 3-4 | 定位或表达严重跑偏 |
| 1-2 | 不符合观澜AI，需要重做 |

硬闸门：

1. `accepted`：总分不少于 58 / 70，且定位一致性、商业判断、文案自然度、可信度均不低于 8，其他维度不低于 7。
2. `needs-revision`：总分 49-57，或任一非核心维度为 6，必须退回修改。
3. `failed`：总分低于 49，或定位一致性 / 商业判断 / 文案自然度 / 可信度任一项低于 7，必须重做关键模块。
4. 如果页面看起来不像观澜AI，即使语法、链接和截图通过，也不得 accepted。
5. 如果文案明显像 AI 模板，即使页面美观，也不得 accepted。

## 8. 输出格式

每次质检必须按以下结构输出：

### 1. 总体判断

一句话说明页面是否符合观澜AI定位，以及最大问题。

### 2. 维度评分

用表格列出 7 个维度评分和简短理由。

### 3. 主要问题

列出 3-7 个最影响页面质量的问题，按优先级排序。

### 4. 模块级优化建议

按页面模块逐项指出：保留、合并、弱化、删除、重写或强化。

### 5. 文案改写建议

指出有 AI 味、模板感、空泛感、营销感的文案，并给出替换版本。

### 6. 视觉与节奏建议

指出视觉重复、页面太散、卡片过多、主次不清、留白不足等问题，并给出改法。

### 7. 转化路径建议

指出主 CTA 是否清晰，是否需要增加低门槛入口，是否过早销售。

### 8. Codex 执行指令

把以上建议整理成一段可直接交给 Codex 执行的修改提示词。

## 9. 独立流程规则

必须写入新流程：

1. 页面 / 文案开发窗口不得使用本 Skill 给自己打 accepted。
2. 本 Skill 默认由独立 QA / Acceptance 窗口执行。
3. 质检窗口只读页面、截图、代码和 closeout，不直接修改页面。
4. 未通过质检的任务必须退回 Dev / Copy 修改，不得由调度窗口直接 accepted。
5. 质检报告必须保存为 UTF-8 Markdown。
6. 质检报告必须给出可执行修改提示词，而不是泛泛说“提升高级感”。

## 10. 允许写入范围

允许更新：

1. `agent-workflow/governance/page-copy-quality-review-skill.md`
2. `agent-workflow/execution/TASK-page-copy-quality-review-template.md`
3. `agent-workflow/agents/qa-agent.md`
4. `agent-workflow/governance/current-context.md`
5. `AGENTS.md`
6. `agent-workflow/execution/dispatch-board.md`
7. `agent-workflow/reports/WSD-20260511-03-v2-page-copy-quality-review-skill-closeout.md`
8. `agent-workflow/inbox/closeout-queue.jsonl`

禁止修改：

1. `01-SiteV2/site/`
2. `01-SiteV2/content/`
3. `01-SiteV2/knowledge/`
4. `docs/brand/wavesight-ai-vi/`
5. `09-ai-news-radar/`
6. `10-Archive/`

## 11. 验收标准

任务完成后必须满足：

1. 已创建可复用的页面与文案质检 Skill 文档。
2. 已创建独立质检任务模板。
3. 已更新 QA Agent 职责。
4. 已更新 AGENTS 与 current-context。
5. 已明确 7 维评分和硬闸门。
6. 已明确开发窗口不得自验自收。
7. 已明确输出格式必须包含模块级建议、文案替换版本和 Codex 执行指令。
8. 已明确桌面端优先阶段的视觉验收口径。
9. 未修改任何页面代码或内容文件。
10. closeout queue 已登记。

## 12. 质量检查

至少执行：

```powershell
node -e "JSON.parse(require('fs').readFileSync('agent-workflow/feature_list.json','utf8')); console.log('feature_list json ok')"
```

并检查：

1. 新增 Markdown 均为 UTF-8。
2. `dispatch-board.md` 可检索到本任务。
3. `current-context.md` 已包含独立质检规则。
4. `qa-agent.md` 已包含页面 / 文案独立质检职责。

## 13. 收口文件要求

收口文件保存为 UTF-8：

```text
agent-workflow/reports/WSD-20260511-03-v2-page-copy-quality-review-skill-closeout.md
```

收口必须包含：

1. 任务结论：accepted / needs-followup / blocked。
2. 修改文件列表。
3. 新 Skill 摘要。
4. 硬闸门摘要。
5. 独立流程如何接入后续页面任务。
6. 质量检查结果。
7. 后续建议。
8. closeout queue 登记状态。

## 14. 给新窗口的执行提示词

请复制以下内容到新窗口：

```text
请按 01-WaveSight 项目长期 agent-workflow 执行任务。

任务 ID：WSD-20260511-03-v2-page-copy-quality-review-skill
任务名称：创建观澜AI页面与文案独立质检 Skill

先读取：
1. AGENTS.md
2. agent-workflow/governance/current-context.md
3. agent-workflow/execution/WSD-20260511-03-v2-page-copy-quality-review-skill.md

你是本任务执行窗口，不是页面开发窗口，也不是调度中枢。

请按派发单创建“观澜AI页面与文案质检 Skill”，重点解决当前开发窗口自查过松的问题。

必须完成：
1. 创建 agent-workflow/governance/page-copy-quality-review-skill.md
2. 创建 agent-workflow/execution/TASK-page-copy-quality-review-template.md
3. 更新 agent-workflow/agents/qa-agent.md
4. 更新 agent-workflow/governance/current-context.md
5. 更新 AGENTS.md
6. 更新 agent-workflow/execution/dispatch-board.md
7. 明确 7 维评分、硬闸门、独立质检流程和输出格式。
8. 明确以后页面 / 文案开发窗口不能自验自收。
9. 不要修改 01-SiteV2/site、content、knowledge、VI 文件、09-ai-news-radar 或 10-Archive。
10. 完成后写 UTF-8 收口文件：agent-workflow/reports/WSD-20260511-03-v2-page-copy-quality-review-skill-closeout.md
11. 向 agent-workflow/inbox/closeout-queue.jsonl 追加登记。

完成后只回复收口文件路径和结论，等待调度窗口验收。
```
