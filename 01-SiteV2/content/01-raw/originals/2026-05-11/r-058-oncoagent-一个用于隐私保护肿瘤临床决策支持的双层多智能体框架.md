---
raw_id: R-058
source_name: Hugging Face：Blog（RSS）
source_url: https://huggingface.co/blog/lablab-ai-amd-developer-hackathon/oncoagent-official-paper
source_type: developer
source_level: B
acquisition_channel: aihot
captured_at: 2026-05-11T04:34:55.856Z
language: mixed
copyright_note: local research archive only
---

# OncoAgent：一个用于隐私保护肿瘤临床决策支持的双层多智能体框架

## 原文 / 可用正文

研究团队发布了开源肿瘤临床决策支持系统OncoAgent。该系统采用双层多智能体框架，结合LangGraph拓扑与四阶段Corrective RAG流程，检索超过70份权威临床指南。系统根据查询复杂度，将任务路由至9B参数的速度优化模型或27B参数的深度推理模型，两者均通过QLoRA在AMD MI300X硬件上使用包含26万余病例的数据集进行微调。系统强制执行严格的零受保护健康信息政策，并通过三层反射安全验证器确保安全，支持完全本地部署以保护患者数据主权。

## 采集备注

该条目由 aihot 发现，原始来源等级初判为 B。若采集通道为 AI HOT / HN / X / Reddit / 社群聚合，只能作为 discovery / source-router；进入事实主证据前必须打开原始 URL，并寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。
