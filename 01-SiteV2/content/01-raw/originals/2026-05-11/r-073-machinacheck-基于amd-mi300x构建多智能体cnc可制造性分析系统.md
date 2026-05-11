---
raw_id: R-073
source_name: Hugging Face：Blog（RSS）
source_url: https://huggingface.co/blog/lablab-ai-amd-developer-hackathon/machinacheck
source_type: developer
source_level: B
acquisition_channel: aihot
captured_at: 2026-05-11T04:34:55.879Z
language: mixed
copyright_note: local research archive only
---

# MachinaCheck：基于AMD MI300X构建多智能体CNC可制造性分析系统

## 原文 / 可用正文

MachinaCheck是一款基于多智能体AI的系统，旨在革新小型CNC机加工车间的报价分析流程。传统上，车间经理需花费30-60分钟手动分析图纸，而该系统在上传STEP文件及材料、公差等简单输入后，能在30秒内生成完整的可制造性报告，明确指出零件能否制造、所需工具及生产前需采取的行动。其核心在AMD MI300X加速卡上本地运行Qwen 2.5 7B模型，利用192GB HBM3显存确保客户设计数据无需离开本地，满足了制造业对数据隐私的严格要求。系统采用五组件流水线，结合精确的几何特征提取与LLM的制造知识推理，最终输出结构化报告。

## 采集备注

该条目由 aihot 发现，原始来源等级初判为 B。若采集通道为 AI HOT / HN / X / Reddit / 社群聚合，只能作为 discovery / source-router；进入事实主证据前必须打开原始 URL，并寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。
