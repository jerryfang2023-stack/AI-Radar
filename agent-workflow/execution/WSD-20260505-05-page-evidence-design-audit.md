# WSD-20260505-05-page-evidence-design-audit 派发单

日期：2026-05-05  
状态：blocked_until_P1-4C_accepted  
调度窗口：当前调度中枢窗口  
看板编号：P1-4D  
牵头 Agent：`ui-ue / qa`  
协作 Agent：`pm / copy / workflow`

## 1. 任务目标

在 `P1-4C / WSD-20260505-04-p1-4b-stop-restore-baseline` accepted 之后，由 UI / UE Design Director 基于 SYS-7 新证据化审美闸门，对网站页面逐页评分，提出修改和优化意见。

本任务只做审计与派发建议，不修改 `04-Site/`。

## 2. 执行前置条件

必须等以下任务 accepted 后才能执行：

- `P1-4C / WSD-20260505-04-p1-4b-stop-restore-baseline`

如果 P1-4C 未 accepted，不得执行本任务。

## 3. 必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/reports/design-director-evidence-based-quality-gate-2026-05-05.md`
5. `agent-workflow/product/DESIGN.md`
6. `agent-workflow/product/COPY.md`
7. `agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`

## 4. 审计范围

优先覆盖全站关键页面：

普通前台：

- `index.html`
- `daily.html`
- `daily-detail.html`
- `signals.html`
- `signal.html`
- `the-point.html`
- `point-daily.html`
- `point.html`
- `point-source.html`
- `opportunities.html`
- `opportunity.html`
- `trends.html`
- `trend.html`

账号 / 商业化页面：

- `login.html`
- `register.html`
- `invite-request.html`
- `account.html`
- `pricing.html`
- `checkout.html`
- `apply.html`

后台 / 边界页面：

- `admin.html`
- `scoring.html`
- `tags.html`

说明：本任务可以给首页评分，但不得提出“立即执行首页开发”。首页后续仍按用户要求之后再做。

## 5. 审计标准

必须使用 SYS-7 证据化审美闸门：

- 首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产：通过线 `85`。
- 一级栏目页 / 详情页 / 会员页：通过线 `80`。
- Admin 工作台和后台模块：通过线 `75`。
- 任一单项低于 `14`、Squint Test 不通过或出现审美阻塞项时，必须重做。

每个页面必须输出：

- 桌面截图路径。
- 移动端截图路径。
- 页面类型和通过线。
- Style Purity 得分和扣分原因。
- Proportion & Rhythm 得分和扣分原因。
- Color Sophistication 得分和扣分原因。
- Craftsmanship 得分和扣分原因。
- Emotional Resonance 得分和扣分原因。
- Squint Test 结论。
- 必须重做清单。
- 可延后优化清单。
- Dev 实现偏差或页面结构问题。
- Copy / 文案问题。
- 是否建议进入下一轮 Dev。

## 6. 输出要求

必须生成：

- 主审计报告：`agent-workflow/reports/page-evidence-design-audit-2026-05-05.md`
- closeout：`agent-workflow/reports/WSD-20260505-05-page-evidence-design-audit-closeout.md`
- 截图目录：`agent-workflow/reports/page-evidence-design-audit-20260505/`

报告最后必须给出下一轮执行建议：

1. 哪些页面先做。
2. 哪些页面暂缓。
3. 哪些问题由 UI/UE 解决。
4. 哪些问题由 Copy 解决。
5. 哪些问题由 Dev 解决。
6. 是否需要新建一个或多个 Dev 任务。

## 7. 自动化影响

本任务只读页面并生成报告，不改代码：

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 8. 收口文件

完成后生成 UTF-8 收口文件：

`agent-workflow/reports/WSD-20260505-05-page-evidence-design-audit-closeout.md`

回到调度中枢窗口汇报：

```text
收口：agent-workflow/reports/WSD-20260505-05-page-evidence-design-audit-closeout.md
```

