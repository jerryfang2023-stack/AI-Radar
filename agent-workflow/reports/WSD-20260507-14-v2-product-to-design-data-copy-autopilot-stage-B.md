---
title: V2-8AUTO Stage B Data 最小 Schema 摘要
date: 2026-05-07
task_id: WSD-20260507-14-v2-product-to-design-data-copy-autopilot
stage: B
status: completed
encoding: UTF-8
---

# Stage B Data 最小 Schema 摘要

已输出 `agent-workflow/v2/v2-data-schema-minimum.md`。

完成内容：

- Point Calibration 最小字段。
- Trend Context 最小字段。
- Opportunity Report 最小字段。
- HeatEvidence、HeatCard、AIBriefIssue 最小字段。
- 生产 validator 第一批必须检查项。
- 可先文档化、后续进入 validator 的字段。

关键边界：

- Point 只做观点校准，不作为事实主证据。
- Trend 不做独立普通栏目，只做趋势背景和热力输入。
- HeatEvidence 不直接暴露给普通前台。
