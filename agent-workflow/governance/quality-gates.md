# Quality Gates｜当前质量门

状态：current
更新时间：2026-05-21

## 通用原则

任何任务完成前必须说明：

- 改了哪些文件；
- 跑了哪些检查；
- 哪些检查未运行及原因；
- 是否影响自动化、内容、网站或发布；
- 是否需要用户确认。
- 如属于每日监测、Raw / Pool / Card 或页面 / 文案 / Typography，必须说明是否执行 `context/06-execution-harness.md`。

## 常用检查

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
node agent-workflow/tools/run-quality-gates.mjs cardcopy --date=YYYY-MM-DD --require-gates=true
node --check 01-SiteV2/site/assets/app.js
```

## 每日监测检查

每日监测属于高风险流程，先按 `context/06-execution-harness.md` 的每日监测 Harness 判断固定读取、产物和 Stop 条件，再运行检查。

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=YYYY-MM-DD
```

## 页面任务检查

页面 / 文案 / Typography 属于高风险流程，先按 `context/06-execution-harness.md` 输出 Typography 表和 Copy-first 表，再进入实现检查。

页面任务必须有：

- Typography 页面位置表；
- Copy-first 文案表；
- 桌面端核心截图或浏览器检查；
- 核心交互检查；
- 未覆盖移动端时说明原因。

## 发布检查

发布路径只保留 GitHub Pages。Netlify 已退役，不得作为网站部署、预览或 fallback 服务恢复。
