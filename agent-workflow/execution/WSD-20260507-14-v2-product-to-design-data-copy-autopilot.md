---
task_id: WSD-20260507-14-v2-product-to-design-data-copy-autopilot
board_id: V2-8AUTO
status: ready
date: 2026-05-07
owner: V2 VI / Design System Agent / Intelligence Data Agent / Copy Agent / PM Agent / QA Agent
type: design-data-copy-autopilot
automation_impact: future-impact-only
encoding: UTF-8
---

# V2-8AUTO 产品架构到设计 / 数据 / 文案规范连贯包

## 0. 快速执行卡

- 看板编号：`V2-8AUTO`
- Task ID：`WSD-20260507-14-v2-product-to-design-data-copy-autopilot`
- 任务类型：页面规范类 / 数据规范类 / 文案规范类 / QA 规划类
- 派发单：`agent-workflow/execution/WSD-20260507-14-v2-product-to-design-data-copy-autopilot.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-closeout.md`
- 调度口令：`收口：WSD-20260507-14-v2-product-to-design-data-copy-autopilot`
- 是否可能影响自动化：未来会影响，本轮不得改生产自动化

执行窗口最短启动提示词：

```text
执行任务：WSD-20260507-14-v2-product-to-design-data-copy-autopilot
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260507-14-v2-product-to-design-data-copy-autopilot.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-closeout.md。
回调度窗口：收口：WSD-20260507-14-v2-product-to-design-data-copy-autopilot
```

## 1. 任务目标

把 `V2-4` 产品架构转成进入 Dev 前必须具备的三类规范：

1. UI/UE Design Director：Home、今日要点、关键信号、机会解码、商业内参的页面母版和证据化审美基线。
2. Data：Point Calibration、Trend Context、Opportunity Report、HeatEvidence、AIBriefIssue 的最小字段和关系要求。
3. Copy / Editorial：栏目命名、标题、摘要、机会解码报告模板、禁用语和会员层表达边界。

本任务是规范连贯包，不进入 `04-Site` 开发。

## 2. 非目标

- 不写页面代码。
- 不改 `04-Site`。
- 不改生产内容源。
- 不改同步脚本、`content-paths.json`、自动化或 Netlify。
- 不生成最终视觉资产。
- 不做真实登录 / 会员权限实现。

## 3. 必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/v2/v2-product-architecture-prd.md`
4. `agent-workflow/v2/v2-vi-design-direction.md`
5. `agent-workflow/v2/v2-algorithm-source-architecture.md`
6. `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
7. `agent-workflow/product/DESIGN.md`
8. `agent-workflow/product/COPY.md`

## 4. 允许改动范围

- `agent-workflow/v2/v2-page-master-spec.md`
- `agent-workflow/v2/v2-data-schema-minimum.md`
- `agent-workflow/v2/v2-copy-editorial-system.md`
- `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-stage-*.md`
- `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-closeout.md`

## 5. 禁止改动范围

- `04-Site/`
- V1 生产内容目录。
- `04-Site/config/content-paths.json`
- 生产同步脚本。
- 长期自动化任务。
- Netlify 配置。

## 6. 执行顺序

### Stage A：UI/UE 母版

输出 `agent-workflow/v2/v2-page-master-spec.md`，必须包含：
- Home 页面母版。
- 今日要点栏目页 / 详情页母版。
- 关键信号栏目页 / 详情页母版。
- 机会解码栏目页 / 详情页母版。
- 商业内参栏目页 / 详情页母版。
- 移动端信息层级。
- Design Director 证据化评分表模板。
- 后续 Dev 截图验收要求。

### Stage B：Data 最小 schema

输出 `agent-workflow/v2/v2-data-schema-minimum.md`，必须包含：
- Point Calibration 最小字段。
- Trend Context 最小字段。
- Opportunity Report 最小字段。
- HeatEvidence / HeatCard / AIBriefIssue 最小字段。
- 关系 ID、slug、source、evidence、counter-evidence 的最低要求。
- 哪些字段可先文档化，哪些必须进入生产 validator。

### Stage C：Copy / Editorial

输出 `agent-workflow/v2/v2-copy-editorial-system.md`，必须包含：
- V2 栏目名称和一句话价值表达。
- 机会解码报告模板。
- Signal 详情页标题 / 摘要 / 6 维表达规则。
- 商业内参摘要与会员引导文案边界。
- 禁用语表：不得写落地方案、确定性建议、内部字段、后台语言、投资化承诺。

### Stage D：QA / Dev 交接

输出 closeout，必须包含：
- 哪些内容可进入 `V2-9` tokens / primitives。
- 哪些内容可进入 `V2-10` 首页原型。
- 哪些内容必须等 `V2-7` 数据验证。
- 哪些内容会影响生产自动化，需等 `V2-13`。

## 7. 页面类硬闸门

本任务虽然不写页面代码，但必须输出页面类任务进入 Dev 前所需的：
- UI/UE 页面规范表。
- Copy 规范表。
- Design Director 评分表模板。
- 桌面 / 移动截图验收要求。

没有这些表，不得标记 accepted。

## 8. 验收标准

- 三份主规范文件均存在且可读。
- 明确吸收 V2-3 VI、V2-4 产品架构、V2-4A 内参 / 热力图、V2-2 算法。
- 未修改生产站点和自动化。
- 运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并记录报告。
