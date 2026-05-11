# WSD-20260511-05-v2-member-auth-pages-quality-review 派发单

日期：2026-05-11  
状态：ready  
派发模式：formal_task / independent_review  
看板编号：V2-MEMBER-AUTH-QA  
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
3. `agent-workflow/execution/WSD-20260511-05-v2-member-auth-pages-quality-review.md`
4. `agent-workflow/governance/page-copy-quality-review-skill.md`

补读：

1. 原页面开发派发单：`agent-workflow/execution/WSD-20260511-02-v2-member-auth-pages-redesign.md`
2. 原开发 closeout：`agent-workflow/reports/WSD-20260511-02-v2-member-auth-pages-redesign-closeout.md`
3. 页面截图目录：`agent-workflow/reports/screenshots/WSD-20260511-02-v2-member-auth-pages-redesign/`
4. `agent-workflow/product/DESIGN.md`
5. `agent-workflow/product/COPY.md`
6. `docs/brand/wavesight-ai-vi/USAGE.md`
7. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
8. `docs/brand/wavesight-ai-vi/brand-tokens.css`

如果缺少页面、截图、开发 closeout 或核心规范，输出 `needs-input`，不得 accepted。

## 3. 质检对象

- 页面类型：会员入口页 / 注册登录 / 账户状态 / 订阅方案 / 确认页
- 原开发任务：`WSD-20260511-02-v2-member-auth-pages-redesign`
- 本次检查页面：
  1. `01-SiteV2/site/login.html`
  2. `01-SiteV2/site/register.html`
  3. `01-SiteV2/site/invite-request.html`
  4. `01-SiteV2/site/account.html`
  5. `01-SiteV2/site/pricing.html`
  6. `01-SiteV2/site/checkout.html`
- 本次检查范围：定位、信息架构、商业判断、文案自然度、视觉体验、页面节奏、可信度、转化路径、公开前台边界、桌面端截图证据。
- 不检查范围：真实后端认证、真实支付、Netlify 部署、移动端专项设计、自动化任务、内容 schema。

## 4. 特别注意

原开发 closeout 中自称 `accepted`，但根据当前项目规则，开发窗口不得自验自收。你需要独立判断，不得沿用开发窗口结论。

原派发单允许写入范围没有列出 `01-SiteV2/site/invite-request.html`，但开发 closeout 后续追加了该页面。请把它作为范围越界项单独检查：

1. 是否确有产品必要。
2. 是否与注册页形成重复。
3. 是否应该保留、合并、弱化或删除。
4. 如果建议保留，需说明为什么该新增页面不破坏会员路径。

## 5. 必查问题

本次必须回答：

1. 这套会员入口页是不是观澜AI，而不是普通 SaaS 登录注册页、知识付费订阅页或模板化落地页？
2. 页面是否服务“面向商业决策者的 AI 机会判断系统”，而不是泛泛会员系统？
3. 文案是否像真人写的，是否有 AI 味、模板句式、空泛正确、过度营销或内部流程感？
4. 是否能让企业经营者、资源型合伙人或行业操盘手产生信任？
5. 登录、注册、邀请码申请、账户、订阅方案、确认页之间的路径是否清晰。
6. 无真实认证和支付时，页面是否诚实说明边界，避免伪装成真实开通。
7. 公开前台是否出现 Admin、JSON、同步、字段、后台、编辑、恢复等不应出现的痕迹。
8. `invite-request.html` 是否应该保留。

## 6. 七维评分

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

## 7. 输出报告格式

质检报告保存为 UTF-8 Markdown：

```text
agent-workflow/reports/WSD-20260511-05-v2-member-auth-pages-quality-review-closeout.md
```

报告必须包含：

1. 总体判断。
2. 七维评分表。
3. 主要问题，按优先级排序。
4. 页面级 / 模块级优化建议。
5. 文案改写建议，必须指出具体原文和替换版本。
6. 视觉与页面节奏建议。
7. 转化路径建议。
8. `invite-request.html` 范围越界检查结论。
9. 是否允许 `WSD-20260511-02-v2-member-auth-pages-redesign` 最终 accepted。
10. Codex 执行指令。

## 8. 收口登记

完成后向 `agent-workflow/inbox/closeout-queue.jsonl` 追加登记：

```json
{"task_id":"WSD-20260511-05-v2-member-auth-pages-quality-review","board_id":"V2-MEMBER-AUTH-QA","closeout_path":"agent-workflow/reports/WSD-20260511-05-v2-member-auth-pages-quality-review-closeout.md","status":"ready_for_review","created_at":"<YYYY-MM-DDTHH:mm:ss+08:00>","owner":"qa","conclusion":"<accepted|needs-revision|failed|needs-input>"}
```

## 9. 独立窗口短提示词

```text
你是观澜AI V2 会员入口页独立质检窗口。

任务 ID：WSD-20260511-05-v2-member-auth-pages-quality-review
派发单：agent-workflow/execution/WSD-20260511-05-v2-member-auth-pages-quality-review.md

请先读取：
1. AGENTS.md
2. agent-workflow/governance/current-context.md
3. agent-workflow/execution/WSD-20260511-05-v2-member-auth-pages-quality-review.md
4. agent-workflow/governance/page-copy-quality-review-skill.md

只做独立质检，不修改代码。

重点检查：
- 会员登录、注册、邀请码申请、账户、订阅方案、确认页是否像观澜AI，而不是普通 SaaS / 知识付费模板。
- 是否有商业判断、可信边界和真人文案感。
- 无真实认证和支付时，是否诚实说明边界。
- `invite-request.html` 是不是必要页面，是否应保留或合并。
- 开发窗口自称 accepted 不作为结论依据。

输出七维评分和修改建议，保存：
agent-workflow/reports/WSD-20260511-05-v2-member-auth-pages-quality-review-closeout.md

并登记 closeout queue。
```
