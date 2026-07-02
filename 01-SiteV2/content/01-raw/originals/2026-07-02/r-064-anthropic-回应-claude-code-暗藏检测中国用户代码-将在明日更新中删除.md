---
schema_version: raw-evidence-v2
raw_id: R-064
title: "Anthropic 回应 Claude Code 暗藏检测中国用户代码：将在明日更新中删除"
original_url: "https://www.ithome.com/0/971/118.htm"
canonical_url: "https://ithome.com/0/971/118.htm"
source_name: "IT之家（RSS）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: changelog_or_release
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-01T07:41:45.000Z"
collected_at: 2026-07-02T02:28:35.482Z
language: mixed
full_text_hash: 64ba4b9891c92e3c
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-02/r-064-anthropic-回应-claude-code-暗藏检测中国用户代码-将在明日更新中删除.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-02/r-064-anthropic-回应-claude-code-暗藏检测中国用户代码-将在明日更新中删除.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-body-visible-text
extraction_quality: medium
extraction_method: "body-visible-text"
readability_score: 48
extractor_diagnostics: {"readability_score":48,"text_length":1971,"paragraph_count":20,"sentence_count":7,"boilerplate_hits":3,"symbol_ratio":0.002,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}
has_full_text: true
content_length: 1971
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"64ba4b9891c92e3c","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Anthropic 回应 Claude Code 暗藏检测中国用户代码：将在明日更新中删除","discovery_summary":"用户逆向发现，Claude Code 自今年4月2日发布的2.1.91版本起内置检测机制：智能体开启时检查系统时区是否为中国时区，并匹配147条域名清单（含百度、字节跳动、月之暗面等中国科技企业及AI实验室域名）。检测结果通过改变日期格式和替换撇号字符编码在系统提示词中。Anthropic 团队成员回应称该机制是3月上线的实验性措施，旨在防止账户转售和模型蒸馏攻击，已部署更强缓解措施，将在7月2日新版本中完全回滚并删除检测代码。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/971/118.htm","discovered_at":"2026-07-02T02:12:32.542Z","rank_on_page":238,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: f2ca158e868c0544
content_hash: 64ba4b9891c92e3c
semantic_hash: 11551f1ca6404022
duplicate_of: ""
first_seen_at: "2026-07-01T07:41:45.000Z"
last_seen_at: 2026-07-02T02:28:35.482Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":2}
business_elements: {"companies":["IT之家（RSS）","Anthropic","AWS"],"products":["Claude"],"people":[],"industries":["开发者工具","企业服务"],"roles":["开发者 / 工程团队"],"workflows":["部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全"],"numbers":["4","2","2.1","91","147","3","7","5"],"quotes":["2026-06-30","2026/06/30","Today's date is","命中中国域名但非 AI 实验室","关联中国 AI 实验室"]}
evidence_seed: {"company_actions":["196 版本时，发现该工具自今年 4 月 2 日发布的 2.","91 版本起便内置了一套隐蔽的检测机制。","据介绍，该机制会在用户开启智能体时，检查系统时区是否为中国时区（Asia / Shanghai 或 Asia / Urumqi），以及 URL 是否匹配一份包含 147 个条目的域名清单（包括百度、阿里巴巴、字节跳动、月之暗面、MiniMax、阶跃星辰等中国科技企业及 AI 实验室的域名，以及大量 Claude API 中转服务地址）。"],"case_details":["用户逆向发现，Claude Code 自今年4月2日发布的2.1.91版本起内置检测机制：智能体开启时检查系统时区是否为中国时区，并匹配147条域名清单（含百度、字节跳动、月之暗面等中国科技企业及AI实验室域名）。检测结果通过改变日期格式和替换撇号字符编码在系统提示词中。Anthropic 团队成员回应称该机制是3月上线的实验性措施，旨在防止账户转售和模型蒸馏攻击，已部署更强缓解措施，将在7月2日新版本中完全回滚并删除检测代码。","Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 2026/7/1 15:41:45 来源： IT之家 作者： 问舟 责编： 问舟 评论： 感谢IT之家网友 补药吖 、 小星_14 、 Coje_He 、 咩咩洋 、 風見暉一 的线索投递！"],"workflow_changes":[],"before_after_clues":["可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"case_detail","text":"用户逆向发现，Claude Code 自今年4月2日发布的2.1.91版本起内置检测机制：智能体开启时检查系统时区是否为中国时区，并匹配147条域名清单（含百度、字节跳动、月之暗面等中国科技企业及AI实验室域名）。检测结果通过改变日期格式和替换撇号字符编码在系统提示词中。Anthropic 团队成员回应称该机制是3月上线的实验性措施，旨在防止账户转售和模型蒸馏攻击，已部署更强缓解措施，将在7月2日新版本中完全回滚并删除检测代码。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 2026/7/1 15:41:45 来源： IT之家 作者： 问舟 责编： 问舟 评论： 感谢IT之家网友 补药吖 、 小星_14 、 Coje_He 、 咩咩洋 、 風見暉一 的线索投递！","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"medium"},{"type":"opinion","text":"IT之家 7 月 1 日消息，用户 LegitMichel777 昨日在 Reddit 发帖称，其在逆向分析 Claude Code 2.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"high","confidence":"medium"},{"type":"product_update","text":"196 版本时，发现该工具自今年 4 月 2 日发布的 2.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"91 版本起便内置了一套隐蔽的检测机制。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"据介绍，该机制会在用户开启智能体时，检查系统时区是否为中国时区（Asia / Shanghai 或 Asia / Urumqi），以及 URL 是否匹配一份包含 147 个条目的域名清单（包括百度、阿里巴巴、字节跳动、月之暗面、MiniMax、阶跃星辰等中国科技企业及 AI 实验室的域名，以及大量 Claude API 中转服务地址）。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Anthropic 回应 Claude Code 暗藏检测中国用户代码：将在明日更新中删除

## clean_text

Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 - IT之家
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
Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除
2026/7/1 15:41:45
来源： IT之家
作者： 问舟
责编： 问舟
评论：
感谢IT之家网友 补药吖 、 小星_14 、 Coje_He 、 咩咩洋 、 風見暉一 的线索投递！
IT之家 7 月 1 日消息，用户 LegitMichel777 昨日在 Reddit 发帖称，其在逆向分析 Claude Code 2.1.196 版本时，发现该工具自今年 4 月 2 日发布的 2.1.91 版本起便内置了一套隐蔽的检测机制。
据介绍，该机制会在用户开启智能体时，检查系统时区是否为中国时区（Asia / Shanghai 或 Asia / Urumqi），以及 URL 是否匹配一份包含 147 个条目的域名清单（包括百度、阿里巴巴、字节跳动、月之暗面、MiniMax、阶跃星辰等中国科技企业及 AI 实验室的域名，以及大量 Claude API 中转服务地址）。
同时，其检测结果的传输方式尤为隐蔽。Claude Code 并未通过独立的遥测字段上报数据，而是将信息直接编码在每次请求都会发送的系统提示词中。具体手法有两种：若系统时区为中国时区，日期格式会从“2026-06-30”变为“2026/06/30”；同时，“Today's date is”中的撇号会被替换为三种视觉上几乎无法分辨的 Unicode 字符 ——U+2019（右单引号）、U+02BC（修饰字母撇号）或 U+02B9（修饰字母上撇号），分别对应“命中中国域名但非 AI 实验室”、“关联中国 AI 实验室”以及“两者均命中”三种状态。在 2.1.196 版本中，实现该逻辑的函数名为 Crt、Rrt (e)、e0t、Zup、edp 和 Vla。发现者还指出，相关代码使用了密钥为“91”的 XOR 混淆，且发布说明中从未提及此项功能。
事件曝光后迅速引发开发者社区广泛关注。Anthropic Claude Code 团队成员 Thariq Shihipar 今日在 X 上回应称，该机制是团队于 2026 年 3 月上线的“实验性”措施，目的是防止未经授权的账户转售以及防范模型蒸馏攻击。
他表示团队此后已部署了更强的缓解措施，原本也计划下线该实验，相关 PR 已经合并，将在 2026 年 7 月 2 日发布的新版本中完全回滚并删除相关检测代码。
相关阅读：
《 美国商务部“松手”，Anthropic 现可对外出口 Fable 及 Mythos AI 模型 》
《 系列最强智能体 AI 模型：Claude Sonnet 5 登场，部分性能逼近 Opus 4.8 》
《 又双标？Anthropic 指责阿里巴巴对其实施“迄今已知最大规模的蒸馏攻击” 》
《 美国最强大模型 Claude Opus 4.8 刚上线就被曝“蒸馏”中国模型：自称是千问和 DeepSeek，Anthropic 再陷“双标”争议 》
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。
投诉水文
我要纠错
下载IT之家APP，签到赚金币兑豪礼
相关文章
关键词： Claude Code ， Anthropic
Anthropic 推出科学家 AI 工作平台 Claude Science，简化繁琐工作
美国商务部“松手”，Anthropic 现可对外出口 Fable 及 Mythos AI 模型
系列最强智能体 AI 模型：Claude Sonnet 5 登场，部分性能逼近 Opus 4.8
Claude Code 负责人切尔尼：未来员工将身兼数职，工程、产品、设计正融为一体
微软全面推出 Anthropic Claude 模型 Azure 云服务，基于英伟达 GB300
消息称亚马逊 AWS 将按 Token 向 Anthropic 支付模型使用费
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

Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 - IT之家
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
Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除
2026/7/1 15:41:45
来源： IT之家
作者： 问舟
责编： 问舟
评论：
感谢IT之家网友 补药吖 、 小星_14 、 Coje_He 、 咩咩洋 、 風見暉一 的线索投递！
IT之家 7 月 1 日消息，用户 LegitMichel777 昨日在 Reddit 发帖称，其在逆向分析 Claude Code 2.1.196 版本时，发现该工具自今年 4 月 2 日发布的 2.1.91 版本起便内置了一套隐蔽的检测机制。
据介绍，该机制会在用户开启智能体时，检查系统时区是否为中国时区（Asia / Shanghai 或 Asia / Urumqi），以及 URL 是否匹配一份包含 147 个条目的域名清单（包括百度、阿里巴巴、字节跳动、月之暗面、MiniMax、阶跃星辰等中国科技企业及 AI 实验室的域名，以及大量 Claude API 中转服务地址）。
同时，其检测结果的传输方式尤为隐蔽。Claude Code 并未通过独立的遥测字段上报数据，而是将信息直接编码在每次请求都会发送的系统提示词中。具体手法有两种：若系统时区为中国时区，日期格式会从“2026-06-30”变为“2026/06/30”；同时，“Today's date is”中的撇号会被替换为三种视觉上几乎无法分辨的 Unicode 字符 ——U+2019（右单引号）、U+02BC（修饰字母撇号）或 U+02B9（修饰字母上撇号），分别对应“命中中国域名但非 AI 实验室”、“关联中国 AI 实验室”以及“两者均命中”三种状态。在 2.1.196 版本中，实现该逻辑的函数名为 Crt、Rrt (e)、e0t、Zup、edp 和 Vla。发现者还指出，相关代码使用了密钥为“91”的 XOR 混淆，且发布说明中从未提及此项功能。
事件曝光后迅速引发开发者社区广泛关注。Anthropic Claude Code 团队成员 Thariq Shihipar 今日在 X 上回应称，该机制是团队于 2026 年 3 月上线的“实验性”措施，目的是防止未经授权的账户转售以及防范模型蒸馏攻击。
他表示团队此后已部署了更强的缓解措施，原本也计划下线该实验，相关 PR 已经合并，将在 2026 年 7 月 2 日发布的新版本中完全回滚并删除相关检测代码。
相关阅读：
《 美国商务部“松手”，Anthropic 现可对外出口 Fable 及 Mythos AI 模型 》
《 系列最强智能体 AI 模型：Claude Sonnet 5 登场，部分性能逼近 Opus 4.8 》
《 又双标？Anthropic 指责阿里巴巴对其实施“迄今已知最大规模的蒸馏攻击” 》
《 美国最强大模型 Claude Opus 4.8 刚上线就被曝“蒸馏”中国模型：自称是千问和 DeepSeek，Anthropic 再陷“双标”争议 》
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。
投诉水文
我要纠错
下载IT之家APP，签到赚金币兑豪礼
相关文章
关键词： Claude Code ， Anthropic
Anthropic 推出科学家 AI 工作平台 Claude Science，简化繁琐工作
美国商务部“松手”，Anthropic 现可对外出口 Fable 及 Mythos AI 模型
系列最强智能体 AI 模型：Claude Sonnet 5 登场，部分性能逼近 Opus 4.8
Claude Code 负责人切尔尼：未来员工将身兼数职，工程、产品、设计正融为一体
微软全面推出 Anthropic Claude 模型 Azure 云服务，基于英伟达 GB300
消息称亚马逊 AWS 将按 Token 向 Anthropic 支付模型使用费
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
- diagnostics: {"readability_score":48,"text_length":1971,"paragraph_count":20,"sentence_count":7,"boilerplate_hits":3,"symbol_ratio":0.002,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=medium
   用户逆向发现，Claude Code 自今年4月2日发布的2.1.91版本起内置检测机制：智能体开启时检查系统时区是否为中国时区，并匹配147条域名清单（含百度、字节跳动、月之暗面等中国科技企业及AI实验室域名）。检测结果通过改变日期格式和替换撇号字符编码在系统提示词中。Anthropic 团队成员回应称该机制是3月上线的实验性措施，旨在防止账户转售和模型蒸馏攻击，已部署更强缓解措施，将在7月2日新版本中完全回滚并删除检测代码。

2. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=medium
   Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 2026/7/1 15:41:45 来源： IT之家 作者： 问舟 责编： 问舟 评论： 感谢IT之家网友 补药吖 、 小星_14 、 Coje_He 、 咩咩洋 、 風見暉一 的线索投递！

3. **opinion**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=high｜confidence=medium
   IT之家 7 月 1 日消息，用户 LegitMichel777 昨日在 Reddit 发帖称，其在逆向分析 Claude Code 2.

4. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=medium
   196 版本时，发现该工具自今年 4 月 2 日发布的 2.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   91 版本起便内置了一套隐蔽的检测机制。

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   据介绍，该机制会在用户开启智能体时，检查系统时区是否为中国时区（Asia / Shanghai 或 Asia / Urumqi），以及 URL 是否匹配一份包含 147 个条目的域名清单（包括百度、阿里巴巴、字节跳动、月之暗面、MiniMax、阶跃星辰等中国科技企业及 AI 实验室的域名，以及大量 Claude API 中转服务地址）。

## business_elements

- companies: IT之家（RSS）, Anthropic, AWS
- products: Claude
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: 开发者 / 工程团队
- workflows: 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全
- numbers: 4, 2, 2.1, 91, 147, 3, 7, 5
- quotes: 2026-06-30 / 2026/06/30 / Today's date is / 命中中国域名但非 AI 实验室 / 关联中国 AI 实验室

## evidence_seed

- company_actions: 196 版本时，发现该工具自今年 4 月 2 日发布的 2. / 91 版本起便内置了一套隐蔽的检测机制。 / 据介绍，该机制会在用户开启智能体时，检查系统时区是否为中国时区（Asia / Shanghai 或 Asia / Urumqi），以及 URL 是否匹配一份包含 147 个条目的域名清单（包括百度、阿里巴巴、字节跳动、月之暗面、MiniMax、阶跃星辰等中国科技企业及 AI 实验室的域名，以及大量 Claude API 中转服务地址）。
- case_details: 用户逆向发现，Claude Code 自今年4月2日发布的2.1.91版本起内置检测机制：智能体开启时检查系统时区是否为中国时区，并匹配147条域名清单（含百度、字节跳动、月之暗面等中国科技企业及AI实验室域名）。检测结果通过改变日期格式和替换撇号字符编码在系统提示词中。Anthropic 团队成员回应称该机制是3月上线的实验性措施，旨在防止账户转售和模型蒸馏攻击，已部署更强缓解措施，将在7月2日新版本中完全回滚并删除检测代码。 / Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 Anthropic 回应 Claude Code 暗藏代码检测中国用户：将在明日更新中删除 2026/7/1 15:41:45 来源： IT之家 作者： 问舟 责编： 问舟 评论： 感谢IT之家网友 补药吖 、 小星_14 、 Coje_He 、 咩咩洋 、 風見暉一 的线索投递！
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 2

## usable_for

- viewpoint: true
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- watchlist

## missing_information

- none

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Anthropic 回应 Claude Code 暗藏检测中国用户代码：将在明日更新中删除","discovery_summary":"用户逆向发现，Claude Code 自今年4月2日发布的2.1.91版本起内置检测机制：智能体开启时检查系统时区是否为中国时区，并匹配147条域名清单（含百度、字节跳动、月之暗面等中国科技企业及AI实验室域名）。检测结果通过改变日期格式和替换撇号字符编码在系统提示词中。Anthropic 团队成员回应称该机制是3月上线的实验性措施，旨在防止账户转售和模型蒸馏攻击，已部署更强缓解措施，将在7月2日新版本中完全回滚并删除检测代码。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/971/118.htm","discovered_at":"2026-07-02T02:12:32.542Z","rank_on_page":238,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

用户逆向发现，Claude Code 自今年4月2日发布的2.1.91版本起内置检测机制：智能体开启时检查系统时区是否为中国时区，并匹配147条域名清单（含百度、字节跳动、月之暗面等中国科技企业及AI实验室域名）。检测结果通过改变日期格式和替换撇号字符编码在系统提示词中。Anthropic 团队成员回应称该机制是3月上线的实验性措施，旨在防止账户转售和模型蒸馏攻击，已部署更强缓解措施，将在7月2日新版本中完全回滚并删除检测代码。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
