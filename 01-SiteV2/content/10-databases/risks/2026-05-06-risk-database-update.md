---
date: 2026-05-06
database: risks
status: v2-test-update
---

# Risk Database Update｜2026-05-06

## RISK-procurement-ap-agent

- 风险类型：交付过重 / 财务错误 / 数据敏感 / 系统集成
- 说明：采购和应付流程需要连接 ERP、邮件、审批、发票和供应商数据，任何自动执行都可能触发财务风险。
- 缓解：早期只做人审草稿、异常识别和催办提醒，不直接自动付款或改 ERP 主数据。

## RISK-agent-control-plane-platform

- 风险类型：平台内置
- 说明：Microsoft、ServiceNow 等可能把 Agent 控制层内置为套件功能，独立创业公司空间被压缩。
- 缓解：寻找垂直行业、私有部署、跨平台治理和本地合规切口。

## RISK-customer-agent-brand

- 风险类型：客户体验 / 合规
- 说明：客服和电话 Agent 如果话术越界、误答或触发平台规则，会直接伤害品牌和客户信任。
- 缓解：设置人工接管、话术边界、敏感场景禁答和投诉监测。
