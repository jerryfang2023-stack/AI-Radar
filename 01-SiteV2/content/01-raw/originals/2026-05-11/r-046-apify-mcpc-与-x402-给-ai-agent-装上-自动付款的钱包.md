---
raw_id: R-046
source_name: X：邵猛 (@shao__meng)
source_url: https://x.com/shao__meng/status/2052397575446417822
source_type: community
source_level: C
acquisition_channel: aihot
captured_at: 2026-05-11T04:34:55.838Z
language: mixed
copyright_note: local research archive only
---

# Apify mcpc 与 x402：给 AI Agent 装上"自动付款的钱包"

## 原文 / 可用正文

Apify发布的通用MCP客户端CLI工具mcpc，集成了x402支付协议，旨在解决AI Agent调用付费API时的手动计费瓶颈。传统SaaS计费流程依赖人工注册、绑卡和审批，而x402协议将支付压缩为一次HTTP往返加签名，使程序能自主交易。mcpc为Agent提供加密钱包，当调用付费服务遭遇HTTP 402状态码时，可自动签名完成支付，无需人工干预。该工具支持Claude Code等MCP兼容的Agent，用户可使用USDC为钱包充值并连接x402兼容服务。

## 采集备注

该条目由 aihot 发现，原始来源等级初判为 C。若采集通道为 AI HOT / HN / X / Reddit / 社群聚合，只能作为 discovery / source-router；进入事实主证据前必须打开原始 URL，并寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。
