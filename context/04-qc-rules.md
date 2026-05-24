---
status: current
scope: quality-gates
last_updated: 2026-05-21
use_when:
  - acceptance
  - closeout review
  - release check
  - quality gate selection
do_not_use_when:
  - pure content drafting without acceptance
priority: current
---

# 04 QC Rules｜通用质量门禁

## 总原则

- 轻量启动不等于轻量验收。
- 自动化合并执行不降低页面、产品、文案、数据、发布检查或部署硬闸门。
- 未运行的检查必须说明原因、风险和是否阻塞下游。
- 每日监测、Raw / Pool / Card、页面 / 文案 / Typography 属于高风险流程，验收时必须说明是否执行 `context/06-execution-harness.md`。

## 页面任务

页面任务必须具备：

- `context/06-execution-harness.md` 页面 / 文案 / Typography Harness 执行说明。
- Typography 页面位置表。
- Copy-first 文案表。
- Build & Release 按表实现说明。
- 桌面端截图 / 核心交互检查。
- 是否新增表外字号、表外字重、表外文案的说明。

移动端专项暂缓，除非派发单明确要求。

## 文案任务

普通页面短文案：

- 遵循 `context/03-copy-style.md`。
- 需要 QC 时调用 `guanlan-copy-style-qc`。

专题内容：

- 调用对应专题 writer / QC Skill。

## 数据与每日监测

- 每日监测必须执行 `context/06-execution-harness.md` 的每日监测 Harness。
- Raw / Pool / Card 资产任务必须执行 `context/06-execution-harness.md` 的资产 Harness。
- `guanlan-monitor-quality-gate` 是脚本预闸门，不是最终放行。
- `guanlan-daily-monitor-qc` 是 Raw / Pool 下游放行闸门。
- QC 输出 `allow`、`allow_with_degradation` 或 `block`。
- `block` 时不得运行资产链、今日观察、商业信号、趋势报告或商业内参。

## 常用验证

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs v2content
node --check 01-SiteV2/site/assets/app.js
```

按任务需要再运行：

- `cardcopy`
- `style`
- `automation`
- `v2content --date=YYYY-MM-DD`

## 冲突处理

优先级：

1. 用户当前明确指令。
2. 对应专题 Skill。
3. `context/` 当前文档。
4. 项目内当前产品 / VI / Copy 真源。
5. 已删除文档不作为执行依据；需要追溯时先说明缺口。
