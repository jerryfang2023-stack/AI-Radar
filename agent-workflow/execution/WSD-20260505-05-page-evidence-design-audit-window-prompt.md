# WSD-20260505-05 执行窗口短提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

前置条件：
必须确认 `P1-4C / WSD-20260505-04-p1-4b-stop-restore-baseline` 已 accepted。未 accepted 时停止，不执行审计。

先读取：
1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260505-05-page-evidence-design-audit.md`
5. `agent-workflow/reports/design-director-evidence-based-quality-gate-2026-05-05.md`
6. `agent-workflow/product/DESIGN.md`
7. `agent-workflow/product/COPY.md`
8. `agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`

任务目标：
由 UI / UE Design Director 按 SYS-7 新证据化审美闸门，对网站页面逐页截图、评分、扣分，并提出修改和优化意见。只做审计报告，不改 `04-Site/`。

审计页面：
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
- `login.html`
- `register.html`
- `invite-request.html`
- `account.html`
- `pricing.html`
- `checkout.html`
- `apply.html`
- `admin.html`
- `scoring.html`
- `tags.html`

必须输出：
1. 桌面截图和移动端截图。
2. 每页页面类型和通过线。
3. 五项评分及逐项扣分原因。
4. Squint Test 结论。
5. 必须重做清单。
6. 可延后优化清单。
7. Dev 实现偏差或页面结构问题。
8. Copy / 文案问题。
9. 下一轮 Dev 派发建议。

评分规则：
- 首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产：`>=85`。
- 一级栏目页 / 详情页 / 会员页：`>=80`。
- Admin 工作台和后台模块：`>=75`。
- 任一单项 `<14`、Squint Test 不通过或出现审美阻塞项：必须重做。

完成后生成：
- `agent-workflow/reports/page-evidence-design-audit-2026-05-05.md`
- `agent-workflow/reports/WSD-20260505-05-page-evidence-design-audit-closeout.md`
- `agent-workflow/reports/page-evidence-design-audit-20260505/`

完成后回到调度中枢窗口汇报：

```text
收口：agent-workflow/reports/WSD-20260505-05-page-evidence-design-audit-closeout.md
```

