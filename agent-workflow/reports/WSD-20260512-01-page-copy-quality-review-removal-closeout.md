# WSD-20260512-01 Page Copy Quality Review Removal Closeout

日期：2026-05-12  
状态：accepted / governance-updated  
owner：workflow  
编码：UTF-8

## 1. 触发原因

用户明确要求删除页面 / 文案独立质检 Skill 和质检流程，原因是当前测试效果不佳。

## 2. 本轮处理

- 删除通用页面文案质检 Skill：`agent-workflow/governance/page-copy-quality-review-skill.md`。
- 删除通用页面文案质检任务模板：`agent-workflow/execution/TASK-page-copy-quality-review-template.md`。
- 删除已废弃的页面文案质检派发单：
  - `agent-workflow/execution/WSD-20260511-03-v2-page-copy-quality-review-skill.md`
  - `agent-workflow/execution/WSD-20260511-05-v2-member-auth-pages-quality-review.md`
  - `agent-workflow/execution/WSD-20260511-06-v2-key-signals-pages-quality-review.md`
  - `agent-workflow/execution/WSD-20260511-09-v2-admin-pages-quality-review.md`
  - `agent-workflow/execution/WSD-20260511-13-v2-site-detail-polish-quality-review.md`
- 更新当前治理口径：不再强制开发 closeout 后另派通用页面文案质检窗口。
- 保留 Copy-first 文案前置闸门：页面 / 文案进入 Dev 前仍必须输出可直接落地的 Copy 文案表。

## 3. 状态回填

- `V2-PAGE-COPY-QUALITY-SKILL`：`void / removed-by-user`。
- `V2-DETAIL-POLISH-QA`：`void / removed-by-user`。
- `V2-DETAIL-POLISH-LIVE`：`accepted / local-polish-verified`。
- `V2-MEMBER-AUTH-QA`、`V2-ADMIN-QA`：`void / quality-process-removed`。
- `V2-KEY-SIGNALS-QA`：`historical / superseded-by-process-removal`。

## 4. 后续口径

页面质量不再走通用七维评分。后续按以下方式处理：

- Copy-first：开发前必须有可落地文案表。
- 调度复核：检查用户反馈、VI / DESIGN / COPY 规范、桌面截图、核心交互和明显前台问题。
- 用户确认：可直接覆盖通用审查流程。
- 必要专项 QA：只在具体问题明确时临时创建，不复用已删除的 page-copy-quality-review 流程。

## 5. 验证

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。

## 6. 未处理

- 历史 closeout 报告保留为审计记录，未物理删除。
- 历史 handoff / progress 中保留旧流程记录，但文件顶部和最新进度已写明当前流程已删除，后续以最新口径为准。
