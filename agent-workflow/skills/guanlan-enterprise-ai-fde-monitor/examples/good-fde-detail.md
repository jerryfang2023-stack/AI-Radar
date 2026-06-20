# Good FDE Detail

This example passes because it keeps the FDE item source-bounded and implementation-specific.

```json
{
  "title": "从客户视角看：Forward Deployed Engineer 实际做什么",
  "cardId": "FDE-2026-06-20-P-001",
  "workflow": "客服响应、线索跟进与知识检索",
  "implementationAnalysis": {
    "demand": "发现的需求是客户服务、销售跟进或工单处理需要更快响应、更准知识检索，并能嵌入现有 CRM / 服务系统。",
    "services": "提供的服务是 FDE / 客户嵌入式工程交付：工程师进入客户环境，完成需求拆解、系统集成、流程验证和上线支持。",
    "result": "实施结果处在试点 / POC / 验证阶段；原文未披露是否已经规模化上线。",
    "sourceBasis": "原文说明 FDE 在客户环境中把业务上下文交给 AI 工具并验证上线前流程。"
  }
}
```

Why it passes:

- The title is a direct source-title translation.
- The detail answers demand, service, and result.
- The result does not invent ROI or production success.
- The item can be lens-only without becoming a fourth Signal Card type.
