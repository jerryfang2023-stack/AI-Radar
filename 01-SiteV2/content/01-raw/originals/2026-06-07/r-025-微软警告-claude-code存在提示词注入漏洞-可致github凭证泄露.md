---
schema_version: raw-evidence-v2
raw_id: R-025
title: "微软警告：Claude Code存在提示词注入漏洞，可致GitHub凭证泄露"
original_url: "https://www.ithome.com/0/960/994.htm"
canonical_url: "https://ithome.com/0/960/994.htm"
source_name: "IT之家（RSS）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: case_or_customer
evidence_object_usable: false
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-06T23:20:46.000Z"
collected_at: 2026-06-07T02:44:54.853Z
language: mixed
full_text_hash: 3659970dfaa2557c
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-07/r-025-微软警告-claude-code存在提示词注入漏洞-可致github凭证泄露.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-07/r-025-微软警告-claude-code存在提示词注入漏洞-可致github凭证泄露.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-body-visible-text
extraction_quality: medium
extraction_method: "body-visible-text"
readability_score: 48
extractor_diagnostics: {"readability_score":48,"text_length":1613,"paragraph_count":20,"sentence_count":11,"boilerplate_hits":3,"symbol_ratio":0.0019,"method":"body-visible-text"}
has_full_text: true
content_length: 1613
fetch_error: ""
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["index_only_or_directory_page","discovery_or_feedback_source_boundary"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"3659970dfaa2557c","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"微软警告：Claude Code存在提示词注入漏洞，可致GitHub凭证泄露","discovery_summary":"微软研究人员发现Anthropic旗下Claude Code的GitHub自动化流程存在漏洞，攻击者可通过提示词注入攻击，劫持CI/CD工作流窃取敏感凭证。漏洞源于Claude Code的读取工具未像Bash工具那样设置沙箱防护，恶意提示词可绕过两层防护读取系统文件中的API密钥等凭证。Anthropic于4月29日收到报告后，在5月5日发布Claude Code 2.1.128修复，通过限制对/proc/目录下敏感文件的访问防止信息窃取。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/960/994.htm","discovered_at":"2026-06-07T02:41:31.513Z","rank_on_page":41,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 52d03032ab25b936
content_hash: 3659970dfaa2557c
semantic_hash: c06332baaf922213
duplicate_of: ""
first_seen_at: "2026-06-06T23:20:46.000Z"
last_seen_at: 2026-06-07T02:44:54.853Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["IT之家（RSS）","Anthropic","GitHub"],"products":["Claude"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["权限 / 安全治理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全"],"numbers":["4","29","5","2.1","128","10","11","2026"],"quotes":[]}
evidence_seed: {"company_actions":["微软威胁情报团队在监测到公开代码库中出现针对人工智能辅助型 GitHub 工作流的提示词注入尝试后，启动了本次研究。","攻击者会在大模型处理的内容中嵌入误导性指令，以此操控模型行为。"],"case_details":["微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 2026/6/7 7:20:46 来源： IT之家 作者： 远洋 责编： 远洋 评论： 感谢IT之家网友 小星_14 的线索投递！","IT之家 6 月 7 日消息，微软研究人员发现，Anthropic 旗下 Claude Code 的 GitHub 自动化流程存在一处漏洞，该漏洞可能导致持续集成 / 持续部署（CI / CD）工作流中的机密信息泄露，攻击者或可通过提示词注入攻击窃取敏感凭证。"],"workflow_changes":["微软研究人员发现Anthropic旗下Claude Code的GitHub自动化流程存在漏洞，攻击者可通过提示词注入攻击，劫持CI/CD工作流窃取敏感凭证。漏洞源于Claude Code的读取工具未像Bash工具那样设置沙箱防护，恶意提示词可绕过两层防护读取系统文件中的API密钥等凭证。Anthropic于4月29日收到报告后，在5月5日发布Claude Code 2.1.128修复，通过限制对/proc/目录下敏感文件的访问防止信息窃取。"],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":["据IT之家了解，提示词注入是一类人工智能安全漏洞。"]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存"]
key_excerpts: [{"type":"workflow_change","text":"微软研究人员发现Anthropic旗下Claude Code的GitHub自动化流程存在漏洞，攻击者可通过提示词注入攻击，劫持CI/CD工作流窃取敏感凭证。漏洞源于Claude Code的读取工具未像Bash工具那样设置沙箱防护，恶意提示词可绕过两层防护读取系统文件中的API密钥等凭证。Anthropic于4月29日收到报告后，在5月5日发布Claude Code 2.1.128修复，通过限制对/proc/目录下敏感文件的访问防止信息窃取。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 2026/6/7 7:20:46 来源： IT之家 作者： 远洋 责编： 远洋 评论： 感谢IT之家网友 小星_14 的线索投递！","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"IT之家 6 月 7 日消息，微软研究人员发现，Anthropic 旗下 Claude Code 的 GitHub 自动化流程存在一处漏洞，该漏洞可能导致持续集成 / 持续部署（CI / CD）工作流中的机密信息泄露，攻击者或可通过提示词注入攻击窃取敏感凭证。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"微软威胁情报团队在监测到公开代码库中出现针对人工智能辅助型 GitHub 工作流的提示词注入尝试后，启动了本次研究。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"supporting_context","text":"据IT之家了解，提示词注入是一类人工智能安全漏洞。","supports":["daily_observation","heatmap"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"攻击者会在大模型处理的内容中嵌入误导性指令，以此操控模型行为。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# 微软警告：Claude Code存在提示词注入漏洞，可致GitHub凭证泄露

## clean_text

微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 - IT之家
首页
IT圈
最会买
设置
日夜间
随系统
浅色
深色
主题色 黑色
投稿
订阅
RSS订阅
收藏IT之家
软媒应用
App客户端
要知App
软媒魔方
业界
手机
电脑
测评
视频
AI
苹果
iPhone
鸿蒙
软件
智车
数码
学院
游戏
直播
5G
微软
Win10
Win11
专题
搜索
首页 > 智能时代 > 人工智能
微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露
2026/6/7 7:20:46
来源： IT之家
作者： 远洋
责编： 远洋
评论：
感谢IT之家网友 小星_14 的线索投递！
IT之家 6 月 7 日消息，微软研究人员发现，Anthropic 旗下 Claude Code 的 GitHub 自动化流程存在一处漏洞，该漏洞可能导致持续集成 / 持续部署（CI / CD）工作流中的机密信息泄露，攻击者或可通过提示词注入攻击窃取敏感凭证。
微软威胁情报团队在监测到公开代码库中出现针对人工智能辅助型 GitHub 工作流的提示词注入尝试后，启动了本次研究。
据IT之家了解，提示词注入是一类人工智能安全漏洞。攻击者会在大模型处理的内容中嵌入误导性指令，以此操控模型行为。大型语言模型的常规设计逻辑是遵循开发者指令、响应用户提问，而攻击者会设法诱骗模型，使其无视预设指令。
研究人员举例说明，有攻击者将注入指令藏在 HTML 注释中。这类内容在 GitHub 展示界面中不可见，但读取原始 Markdown 源码的人工智能模型却能识别。涉事代码库当时借助 GitHub 自动化流程来自动处理工单问题。
攻击者可将恶意指令伪装成普通的功能需求，无需获得项目修改权限，仅需提交一条 GitHub 工单，就能诱骗人工智能机器人代为执行修改操作。
微软证实，同类提示词注入手段同样可针对 Anthropic 的 Claude Code GitHub 自动化流程发起攻击。此前 Anthropic 已为部分工具（例如可让 Claude 在系统中执行命令的 Bash 工具）设置了沙箱防护。
但微软发现，Claude 用于读取文件的读取工具并未受到同等安全限制。
研究人员制作了提示词注入攻击载荷，对该漏洞进行验证测试。测试中，恶意提示词成功绕过两层防护，诱导这款人工智能助手读取了存放着应用程序接口密钥及其他凭证的系统文件。
微软于 4 月 29 日向 Anthropic 上报了该漏洞 。Anthropic 已于 5 月 5 日发布 Claude Code 2.1.128 版本完成修复，通过限制程序对 /proc/ 目录下敏感文件的访问，防止相关信息被非法窃取。
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。
投诉水文
我要纠错
下载IT之家APP，签到赚金币兑豪礼
相关文章
关键词： Claude Code ， Anthropic ， 微软
微软想让用户对自家智能体 Scout 上瘾？CEO 纳德拉否认
Anthropic 被曝雇 1000 名人类工程师训练 Claude Code，每项任务 280 美元
微软 CEO 纳德拉要把公司内部的智能体“管起来”，为其设定身份与权限边界
初探微软“龙虾”Scout 应用，主打常驻在线 AI 办公协作
微软 MAI 系列 AI 模型训练数据曝光，“仅商业授权”说法存在出入
《我的世界：地下城》终极版 Steam 新史低，国区 71 元
软媒旗下网站：
IT之家
最会买 - 返利返现优惠券
iPhone之家
Win7之家
Win10之家
Win11之家
软媒旗下软件：
软媒手机APP应用
魔方
最会买
要知

## full_text

微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 - IT之家
首页
IT圈
最会买
设置
日夜间
随系统
浅色
深色
主题色 黑色
投稿
订阅
RSS订阅
收藏IT之家
软媒应用
App客户端
要知App
软媒魔方
业界
手机
电脑
测评
视频
AI
苹果
iPhone
鸿蒙
软件
智车
数码
学院
游戏
直播
5G
微软
Win10
Win11
专题
搜索
首页 > 智能时代 > 人工智能
微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露
2026/6/7 7:20:46
来源： IT之家
作者： 远洋
责编： 远洋
评论：
感谢IT之家网友 小星_14 的线索投递！
IT之家 6 月 7 日消息，微软研究人员发现，Anthropic 旗下 Claude Code 的 GitHub 自动化流程存在一处漏洞，该漏洞可能导致持续集成 / 持续部署（CI / CD）工作流中的机密信息泄露，攻击者或可通过提示词注入攻击窃取敏感凭证。
微软威胁情报团队在监测到公开代码库中出现针对人工智能辅助型 GitHub 工作流的提示词注入尝试后，启动了本次研究。
据IT之家了解，提示词注入是一类人工智能安全漏洞。攻击者会在大模型处理的内容中嵌入误导性指令，以此操控模型行为。大型语言模型的常规设计逻辑是遵循开发者指令、响应用户提问，而攻击者会设法诱骗模型，使其无视预设指令。
研究人员举例说明，有攻击者将注入指令藏在 HTML 注释中。这类内容在 GitHub 展示界面中不可见，但读取原始 Markdown 源码的人工智能模型却能识别。涉事代码库当时借助 GitHub 自动化流程来自动处理工单问题。
攻击者可将恶意指令伪装成普通的功能需求，无需获得项目修改权限，仅需提交一条 GitHub 工单，就能诱骗人工智能机器人代为执行修改操作。
微软证实，同类提示词注入手段同样可针对 Anthropic 的 Claude Code GitHub 自动化流程发起攻击。此前 Anthropic 已为部分工具（例如可让 Claude 在系统中执行命令的 Bash 工具）设置了沙箱防护。
但微软发现，Claude 用于读取文件的读取工具并未受到同等安全限制。
研究人员制作了提示词注入攻击载荷，对该漏洞进行验证测试。测试中，恶意提示词成功绕过两层防护，诱导这款人工智能助手读取了存放着应用程序接口密钥及其他凭证的系统文件。
微软于 4 月 29 日向 Anthropic 上报了该漏洞 。Anthropic 已于 5 月 5 日发布 Claude Code 2.1.128 版本完成修复，通过限制程序对 /proc/ 目录下敏感文件的访问，防止相关信息被非法窃取。
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。
投诉水文
我要纠错
下载IT之家APP，签到赚金币兑豪礼
相关文章
关键词： Claude Code ， Anthropic ， 微软
微软想让用户对自家智能体 Scout 上瘾？CEO 纳德拉否认
Anthropic 被曝雇 1000 名人类工程师训练 Claude Code，每项任务 280 美元
微软 CEO 纳德拉要把公司内部的智能体“管起来”，为其设定身份与权限边界
初探微软“龙虾”Scout 应用，主打常驻在线 AI 办公协作
微软 MAI 系列 AI 模型训练数据曝光，“仅商业授权”说法存在出入
《我的世界：地下城》终极版 Steam 新史低，国区 71 元
软媒旗下网站：
IT之家
最会买 - 返利返现优惠券
iPhone之家
Win7之家
Win10之家
Win11之家
软媒旗下软件：
软媒手机APP应用
魔方
最会买
要知

## extraction_diagnostics

- extraction_method: body-visible-text
- readability_score: 48
- fetch_status: fetched-readable-text-body-visible-text
- extraction_quality: medium
- diagnostics: {"readability_score":48,"text_length":1613,"paragraph_count":20,"sentence_count":11,"boilerplate_hits":3,"symbol_ratio":0.0019,"method":"body-visible-text"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **workflow_change**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   微软研究人员发现Anthropic旗下Claude Code的GitHub自动化流程存在漏洞，攻击者可通过提示词注入攻击，劫持CI/CD工作流窃取敏感凭证。漏洞源于Claude Code的读取工具未像Bash工具那样设置沙箱防护，恶意提示词可绕过两层防护读取系统文件中的API密钥等凭证。Anthropic于4月29日收到报告后，在5月5日发布Claude Code 2.1.128修复，通过限制对/proc/目录下敏感文件的访问防止信息窃取。

2. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=medium
   微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 2026/6/7 7:20:46 来源： IT之家 作者： 远洋 责编： 远洋 评论： 感谢IT之家网友 小星_14 的线索投递！

3. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=medium
   IT之家 6 月 7 日消息，微软研究人员发现，Anthropic 旗下 Claude Code 的 GitHub 自动化流程存在一处漏洞，该漏洞可能导致持续集成 / 持续部署（CI / CD）工作流中的机密信息泄露，攻击者或可通过提示词注入攻击窃取敏感凭证。

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   微软威胁情报团队在监测到公开代码库中出现针对人工智能辅助型 GitHub 工作流的提示词注入尝试后，启动了本次研究。

5. **supporting_context**｜supports=daily_observation, heatmap｜importance=high｜confidence=medium
   据IT之家了解，提示词注入是一类人工智能安全漏洞。

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   攻击者会在大模型处理的内容中嵌入误导性指令，以此操控模型行为。

## business_elements

- companies: IT之家（RSS）, Anthropic, GitHub
- products: Claude
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 权限 / 安全治理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全
- numbers: 4, 29, 5, 2.1, 128, 10, 11, 2026
- quotes: 暂无公开信息

## evidence_seed

- company_actions: 微软威胁情报团队在监测到公开代码库中出现针对人工智能辅助型 GitHub 工作流的提示词注入尝试后，启动了本次研究。 / 攻击者会在大模型处理的内容中嵌入误导性指令，以此操控模型行为。
- case_details: 微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 微软警告称 ClaudeCode 存在漏洞，可能导致 GitHub 账号凭证泄露 2026/6/7 7:20:46 来源： IT之家 作者： 远洋 责编： 远洋 评论： 感谢IT之家网友 小星_14 的线索投递！ / IT之家 6 月 7 日消息，微软研究人员发现，Anthropic 旗下 Claude Code 的 GitHub 自动化流程存在一处漏洞，该漏洞可能导致持续集成 / 持续部署（CI / CD）工作流中的机密信息泄露，攻击者或可通过提示词注入攻击窃取敏感凭证。
- workflow_changes: 微软研究人员发现Anthropic旗下Claude Code的GitHub自动化流程存在漏洞，攻击者可通过提示词注入攻击，劫持CI/CD工作流窃取敏感凭证。漏洞源于Claude Code的读取工具未像Bash工具那样设置沙箱防护，恶意提示词可绕过两层防护读取系统文件中的API密钥等凭证。Anthropic于4月29日收到报告后，在5月5日发布Claude Code 2.1.128修复，通过限制对/proc/目录下敏感文件的访问防止信息窃取。
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 据IT之家了解，提示词注入是一类人工智能安全漏洞。

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: false
- change: false
- trend: false
- daily_observation: false
- heatmap: false
- briefing: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 疑似官网首页、产品目录或导航页，只能索引留存

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"微软警告：Claude Code存在提示词注入漏洞，可致GitHub凭证泄露","discovery_summary":"微软研究人员发现Anthropic旗下Claude Code的GitHub自动化流程存在漏洞，攻击者可通过提示词注入攻击，劫持CI/CD工作流窃取敏感凭证。漏洞源于Claude Code的读取工具未像Bash工具那样设置沙箱防护，恶意提示词可绕过两层防护读取系统文件中的API密钥等凭证。Anthropic于4月29日收到报告后，在5月5日发布Claude Code 2.1.128修复，通过限制对/proc/目录下敏感文件的访问防止信息窃取。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/960/994.htm","discovered_at":"2026-06-07T02:41:31.513Z","rank_on_page":41,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

微软研究人员发现Anthropic旗下Claude Code的GitHub自动化流程存在漏洞，攻击者可通过提示词注入攻击，劫持CI/CD工作流窃取敏感凭证。漏洞源于Claude Code的读取工具未像Bash工具那样设置沙箱防护，恶意提示词可绕过两层防护读取系统文件中的API密钥等凭证。Anthropic于4月29日收到报告后，在5月5日发布Claude Code 2.1.128修复，通过限制对/proc/目录下敏感文件的访问防止信息窃取。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
