---
source_id: 2026-05-03-blog-claude-managed-agents-memory
title: Built-in memory for Claude Managed Agents
date: 2026-05-03
source_type: blog
source_name: Claude Blog
source_url: https://claude.com/blog/claude-managed-agents-memory
related_points:
  - 2026-05-03-point-4
tags:
  - "Agent 工作流观点"
  - "AI Agent"
  - "AI治理"
  - "技术博客"
---

# Built-in memory for Claude Managed Agents

## 来源与版权

来源为 Claude Blog。站内已支持 `全文文档` 和 `全文译文` 字段；如已获得转载授权或使用自有导出的全文，可将完整博客正文写入 `全文文档`，网站会优先展示全文文档，不再只展示关键段落。

## 站内阅读摘要

这篇博客的重点不是“Claude 增加了记忆”这个功能点，而是把 Agent 记忆做成生产级基础设施：文件化、可导出、可 API 管理、可分权共享、可审计、可回滚、可追踪来源。

对 The Point 来说，商业价值在于：长期 Agent 的记忆能力会从“上下文增强”升级为企业治理对象。它不只是让 Agent 记住更多，而是让组织知道记住了什么、谁写入的、能否共享、能否撤回、能否接受审计。

## 内容结构

- 公开测试：Managed Agents Memory 进入 public beta。
- 跨会话学习：记忆层服务于长期运行、跨会话改进、相互共享经验的 Agent。
- 文件系统记忆：Memory 挂载到文件系统，Agent 可以使用 bash 和代码执行能力读写记忆。
- 企业控制：记忆可导出、可通过 API 管理、可按不同 Agent 和用户设置权限。
- 审计治理：变更有 audit log，可以追踪来源、回滚版本、删除历史内容。
- 客户实践：Netflix、Rakuten、Wisedocs、Ando 等场景用于反馈闭环、文档验证和组织协作。

## 高价值原文段

Memory on Claude Managed Agents is available today in public beta. Your agents can now learn from every session, using an intelligence-optimized memory layer that balances performance with flexibility. Because memories are stored as files, developers can export them, manage them via the API, and keep full control over what agents retain.

中文译文：Claude Managed Agents 的 Memory 今天进入公开测试。Agent 现在可以从每一次会话中学习，使用一个针对智能表现优化的记忆层，在性能和灵活性之间取得平衡。由于记忆以文件形式存储，开发者可以导出这些记忆，通过 API 管理它们，并完全控制 Agent 保留哪些内容。

Portable memories for production-grade agents Memory is built for enterprise deployments, with scoped permissions, audit logs, and full programmatic control. Stores can be shared across multiple agents with different access scopes. For example, an org-wide store might be read-only, while per-user stores allow reads and writes. Multiple agents can work concurrently against the same store without overwriting each other. Memories are files that can be exported and independently managed via the API, giving developers full control. All changes are tracked with a detailed audit log, so you can tell which agent and session a memory came from. You can roll back to an earlier version or redact content from history. Updates also surface in the Claude Console as session events, so developers can trace what an agent learned and where it came from.

中文译文：面向生产级 Agent 的可移植记忆。Memory 是为企业部署而构建的，具备范围化权限、审计日志和完整的程序化控制。存储可以在多个 Agent 之间共享，并配置不同访问范围。例如，组织级存储可以是只读的，而每个用户的存储允许读写。多个 Agent 可以同时使用同一个存储，而不会相互覆盖。记忆以文件形式存在，可以通过 API 导出并独立管理，让开发者保有完整控制。所有变更都会被详细审计日志记录，因此可以知道某段记忆来自哪个 Agent 和哪一次会话。你可以回滚到较早版本，也可以从历史中删除特定内容。更新也会作为 session event 出现在 Claude Console 中，开发者可以追踪 Agent 学到了什么，以及这些内容来自哪里。

## 长期知识沉淀

这篇内容应沉淀到“Agent 记忆 / 企业 Agent 治理 / 长期上下文”三条观察线里。后续 The Point 不应只截取前 1/3 的博客内容，而要先按标题结构抽取完整相关段落，再把观点卡片链接到素材页。

后续自动化规则：博客类素材先生成站内素材笔记，保留结构化摘要、关键原文段、中文译文、客户案例索引；观点卡片只引用与该 Point 对应的完整原始段落。
