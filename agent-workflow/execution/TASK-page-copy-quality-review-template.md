# TASK-page-copy-quality-review-template

任务 ID：`<TASK-ID>`  
任务名称：`<页面 / 文案独立质检任务名称>`  
状态：ready  
派发模式：formal_task / independent_review  
牵头 Agent：QA / Acceptance Agent  
协作 Agent：UI / UE Agent / Copy Agent / PM Agent / Workflow Agent  
Skill：`agent-workflow/governance/page-copy-quality-review-skill.md`

## 1. 执行窗口身份

你是独立质检窗口，不是页面开发窗口，不是文案开发窗口，也不是调度中枢。

本任务只做评审、打分、指出问题和输出修改指令。不得直接修改页面代码、内容文件、VI 文件或站点数据。

## 2. 启动读取

先读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. 本派发单
4. `agent-workflow/governance/page-copy-quality-review-skill.md`

补读：

1. 原页面 / 文案开发任务派发单：`<ORIGINAL-DISPATCH-PATH>`
2. 原开发窗口 closeout：`<ORIGINAL-CLOSEOUT-PATH>`
3. 页面截图或 QA 证据：`<SCREENSHOT-OR-QA-PATHS>`
4. 页面 URL 或本地访问方式：`<PAGE-URL-OR-LOCAL-RUN>`
5. `agent-workflow/product/DESIGN.md`
6. `agent-workflow/product/COPY.md`
7. `docs/brand/wavesight-ai-vi/USAGE.md`
8. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
9. `docs/brand/wavesight-ai-vi/brand-tokens.css`

如果缺少页面、截图、开发 closeout 或核心规范，输出 `needs-input`，不得 accepted。

## 3. 质检对象

- 页面 / 模块：`<PAGE-OR-MODULE>`
- 页面类型：`首页 / 一级栏目页 / 详情页 / 商业内参 / 热力图 / 小程序诊断页 / 会员入口页 / 其他`
- 原开发任务：`<ORIGINAL-TASK-ID>`
- 原开发窗口：`<ORIGINAL-OWNER>`
- 本次检查范围：`<SCOPE>`
- 不检查范围：`<OUT-OF-SCOPE>`

## 4. 必查问题

本次必须回答：

1. 这是不是观澜AI，而不是普通 AI 新闻站、AI 工具导航、SaaS 模板页或知识付费落地页？
2. 页面有没有商业判断，而不是堆新闻、堆卡片、堆摘要？
3. 文案像不像真人写的，是否有 AI 味、模板句式、机械分点、空泛正确和过度营销？
4. 页面能不能让企业经营者、资源型合伙人或行业操盘手产生信任？
5. 页面是否符合当前 V2 桌面端优先口径？
6. 是否有普通前台不应出现的 Admin、JSON、同步、字段、后台、编辑、恢复等痕迹？
7. 是否有夸大、确定性机会、单一新闻推出大结论、海外案例直接等同国内机会的问题？

## 5. 七维评分

按 7 个维度打分，每项 10 分，总分 70 分：

1. 定位一致性
2. 信息架构
3. 商业判断
4. 文案自然度
5. 视觉体验
6. 页面节奏
7. 可信度

转化路径不计入总分，但必须单独输出建议。

硬闸门：

- `accepted`：总分不少于 58 / 70，且定位一致性、商业判断、文案自然度、可信度均不低于 8，其他维度不低于 7。
- `needs-revision`：总分 49-57，或任一非核心维度为 6，必须退回修改。
- `failed`：总分低于 49，或定位一致性 / 商业判断 / 文案自然度 / 可信度任一项低于 7，必须重做关键模块。
- `needs-input`：缺少必要材料，无法独立质检。

## 6. 输出报告格式

质检报告保存为 UTF-8 Markdown：

```text
agent-workflow/reports/<TASK-ID>-closeout.md
```

报告必须包含：

### 1. 总体判断

一句话说明页面是否符合观澜AI定位，以及最大问题。

### 2. 维度评分

| 维度 | 得分 | 理由 |
|---|---:|---|
| 定位一致性 |  |  |
| 信息架构 |  |  |
| 商业判断 |  |  |
| 文案自然度 |  |  |
| 视觉体验 |  |  |
| 页面节奏 |  |  |
| 可信度 |  |  |
| 总分 |  |  |
| 结论 |  |  |

### 3. 主要问题

列出 3-7 个最影响页面质量的问题，按优先级排序。

### 4. 模块级优化建议

按页面模块逐项指出：保留、合并、弱化、删除、重写或强化。

### 5. 文案改写建议

指出有 AI 味、模板感、空泛感、营销感或内部话术的文案，并给出替换版本。

### 6. 视觉与节奏建议

指出视觉重复、页面太散、卡片过多、主次不清、留白不足等问题，并给出改法。

### 7. 转化路径建议

指出主 CTA 是否清晰，是否需要低门槛入口，是否过早销售。

### 8. Codex 执行指令

整理一段可直接交给 Codex 执行的修改提示词。

## 7. 收口登记

完成后向 `agent-workflow/inbox/closeout-queue.jsonl` 追加登记：

```json
{"task_id":"<TASK-ID>","board_id":"<BOARD-ID>","closeout_path":"agent-workflow/reports/<TASK-ID>-closeout.md","status":"ready_for_review","created_at":"<YYYY-MM-DDTHH:mm:ss+08:00>","owner":"qa","conclusion":"<accepted|needs-revision|failed|needs-input>"}
```

## 8. 禁止事项

- 不得修改 `01-SiteV2/site/`、`01-SiteV2/content/`、`01-SiteV2/knowledge/`、`docs/brand/wavesight-ai-vi/`、`09-ai-news-radar/` 或 `10-Archive/`，除非派发单另行明确允许。
- 不得替开发窗口自验自收。
- 不得把页面可打开、语法通过或截图存在等同于观澜AI页面质量通过。
- 不得泛泛输出“提升高级感”，必须给出模块级修改建议、文案替换版本和 Codex 执行指令。
