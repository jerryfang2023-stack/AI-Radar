---
status: current
scope: quality-gates
last_updated: 2026-07-16
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
- 前台回归门禁结果：`node agent-workflow/tools/frontstage-regression-gate.mjs`。
- 是否新增表外字号、表外字重、表外文案的说明。

移动端专项暂缓，除非派发单明确要求。

## 文案任务

当前暂停使用旧前台文案规范与旧文案门禁。

- 不调用旧文案 Skill 或旧文案字段作为发布阻塞门禁。
- 商业信号标题优先使用可追溯原文标题。
- 前台出现英文标题、摘要或详情内容时，必须翻译为中文后展示。
- 文案验收以事实准确、来源可追溯、无内部生产语言、无机械改写为准。

## 数据与每日监测

Data Center V4 的正式放行门禁是：

```powershell
npm run build:data-center -- --date=YYYY-MM-DD
npm run assert:data-center -- --date=YYYY-MM-DD
```

- 正式事件必须 100% 具有可解析的 `source_refs` 和 `claim_refs`。
- Claim 必须与 `RawDocument.body_clean` 的字符区间一致。
- TagAssertion 必须 100% 具有 Claim 证据和原文区间。
- FDE / Hardware 必须来自 CanonicalEvent，禁止 SourceArtifact 直达。
- 模板、导航、搜索摘要、错配主体和判断字段进入 V4 时必须阻断。
- 当天没有 FDE 或 Hardware 是可见警告，不得为了数量制造记录。
- V3 Card / 前台门禁只验证冻结页面兼容性，不能替代 V4 数据完整性门禁。

- 每日监测必须执行 `context/06-execution-harness.md` 的每日监测 Harness。
- Raw / Pool / Card 资产任务必须执行 `context/06-execution-harness.md` 的资产 Harness。
- `guanlan-monitor-quality-gate` 是脚本预闸门，不是最终放行。
- `guanlan-daily-monitor-qc` 是 Raw / Pool 下游放行闸门。
- QC 输出 `allow`、`allow_with_degradation` 或 `block`。
- `block` 时不得运行资产链、商业信号前台构建、关系图、趋势候选或站点同步。

## 常用验证

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs automation
node agent-workflow/tools/run-quality-gates.mjs business --date=YYYY-MM-DD
node agent-workflow/tools/frontstage-regression-gate.mjs
node --check 01-SiteV2/site/assets/data-center-v4.js
node --check 01-SiteV2/site/assets/v4-report-shell.js
```

按任务需要再运行：

- `rules`
- `automation`
- `regression --date=YYYY-MM-DD`
- `tags`

## 冲突处理

优先级：

1. 用户当前明确指令。
2. 对应专题 Skill。
3. `context/` 当前文档。
4. 项目内当前产品 / VI / Copy 真源。
5. 已删除文档不作为执行依据；需要追溯时先说明缺口。
