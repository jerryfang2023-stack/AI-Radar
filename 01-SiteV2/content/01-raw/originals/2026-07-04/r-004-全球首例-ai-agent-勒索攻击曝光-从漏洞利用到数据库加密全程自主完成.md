---
schema_version: raw-evidence-v2
raw_id: R-004
title: "全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成"
title_zh: "全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://www.ithome.com/0/972/424.htm"
canonical_url: "https://ithome.com/0/972/424.htm"
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
published_at: "2026-07-03T11:57:00.000Z"
collected_at: 2026-07-04T04:50:50.002Z
language: mixed
full_text_hash: 8cd45c073d4fbe56
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-004-全球首例-ai-agent-勒索攻击曝光-从漏洞利用到数据库加密全程自主完成.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-004-全球首例-ai-agent-勒索攻击曝光-从漏洞利用到数据库加密全程自主完成.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-body-visible-text
extraction_quality: high
extraction_method: "body-visible-text"
readability_score: 51
extractor_diagnostics: {"readability_score":51,"text_length":2662,"paragraph_count":28,"sentence_count":19,"boilerplate_hits":6,"symbol_ratio":0.0015,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}
has_full_text: true
content_length: 2662
fetch_error: ""
evidence_strength: blocked
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["index_only_or_directory_page"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"8cd45c073d4fbe56","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成","discovery_summary":"安全厂商 Sysdig 首次记录到 AI Agent\"JADEPUFFER\"自动完成的勒索攻击。攻击利用暴露的 Langflow 服务漏洞 CVE-2025-3248 远程执行 Python 代码，随后自主收集 OpenAI、Anthropic、DeepSeek、Gemini 等 API 密钥及阿里云、腾讯云、华为云、AWS、Google Cloud、Azure 等云平台凭证，通过 MinIO 默认密码访问对象存储并创建每 30 分钟连接的计划任务。横向移动到 MySQL 和 Nacos 服务器，利用数据库 Root 账号及 Nacos 漏洞 CVE-2021-29441 获取管理权限，加密全部 1342 条配置数据，留下包含比特币钱包地址和 Proton Mail 的勒索信息。AI 在首次操作失败后 31 秒内自主完成错误分析与修复，累计执行超过 600 个攻击载荷，全程无需人类操作。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/972/424.htm","discovered_at":"2026-07-04T03:11:32.676Z","rank_on_page":148,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: afb89c71955dda50
content_hash: 8cd45c073d4fbe56
semantic_hash: 934a89f36085fdbf
duplicate_of: ""
first_seen_at: "2026-07-03T11:57:00.000Z"
last_seen_at: 2026-07-04T04:50:50.002Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":true,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["IT之家（RSS）","OpenAI","Anthropic","Google","AWS"],"products":["Agent","Gemini"],"people":[],"industries":["开发者工具","企业服务"],"roles":["开发者 / 工程团队"],"workflows":["权限 / 安全治理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全"],"numbers":["2025","3248","30","2021","29441","1342","31","600"],"quotes":["JADEPUFFER","minioadmin","COMING SOON"]}
evidence_seed: {"company_actions":["根据 Sysdig 报告，攻击起点是一台暴露在互联网的 Langflow 服务。"],"case_details":["全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 科学探索 > 科技前沿 全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 2026/7/3 19:57:00 来源： IT之家 作者： 问舟 责编： 问舟 评论： 感谢IT之家网友 不一样的体验 的线索投递！","研究人员指出，这是目前公开披露的全球首个有完整记录、完全由 AI Agent 自动执行的勒索软件攻击案例，它利用公开漏洞入侵系统后，自主完成了从侦察、窃取凭证、横向移动到最终加密和摧毁数据库的完整攻击链路，全程无需人类操作。","IT之家注意到，此次事件中的 AI 攻击者并未采用新的漏洞或攻击技术，而是依靠 AI 自主组合现有攻击手法，完成了一条完整的自动化攻击链。"],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":["IT之家 7 月 3 日消息，安全厂商 Sysdig 昨日宣布，其威胁研究团队首次记录到一例由 AI Agent（智能体）自主完成整个攻击流程的勒索软件攻击，并将该攻击者命名为 JADEPUFFER。"]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存"]
key_excerpts: [{"type":"quote","text":"安全厂商 Sysdig 首次记录到 AI Agent\"JADEPUFFER\"自动完成的勒索攻击。攻击利用暴露的 Langflow 服务漏洞 CVE-2025-3248 远程执行 Python 代码，随后自主收集 OpenAI、Anthropic、DeepSeek、Gemini 等 API 密钥及阿里云、腾讯云、华为云、AWS、Google Cloud、Azure 等云平台凭证，通过 MinIO 默认密码访问对象存储并创建每 30 分钟连接的计划任务。横向移动到 MySQL 和 Nacos 服务器，利用数据库 Root 账号及 Nacos 漏洞 CVE-2021-29441 获取管理权限，加密全部 1342 条配置数据，留下包含比特币钱包地址和 Proton Mail 的勒索信息。AI 在首次操作失败后 31 秒内自主完成错误分析与修复，累计执行超过 600 个攻击载荷，全程无需人类操作。","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 科学探索 > 科技前沿 全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 2026/7/3 19:57:00 来源： IT之家 作者： 问舟 责编： 问舟 评论： 感谢IT之家网友 不一样的体验 的线索投递！","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"supporting_context","text":"IT之家 7 月 3 日消息，安全厂商 Sysdig 昨日宣布，其威胁研究团队首次记录到一例由 AI Agent（智能体）自主完成整个攻击流程的勒索软件攻击，并将该攻击者命名为 JADEPUFFER。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"研究人员指出，这是目前公开披露的全球首个有完整记录、完全由 AI Agent 自动执行的勒索软件攻击案例，它利用公开漏洞入侵系统后，自主完成了从侦察、窃取凭证、横向移动到最终加密和摧毁数据库的完整攻击链路，全程无需人类操作。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"IT之家注意到，此次事件中的 AI 攻击者并未采用新的漏洞或攻击技术，而是依靠 AI 自主组合现有攻击手法，完成了一条完整的自动化攻击链。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"根据 Sysdig 报告，攻击起点是一台暴露在互联网的 Langflow 服务。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-04T04:50:50.002Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# 全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成

## clean_text

全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 - IT之家
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
首页 > 科学探索 > 科技前沿
全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成
2026/7/3 19:57:00
来源： IT之家
作者： 问舟
责编： 问舟
评论：
感谢IT之家网友 不一样的体验 的线索投递！
IT之家 7 月 3 日消息，安全厂商 Sysdig 昨日宣布，其威胁研究团队首次记录到一例由 AI Agent（智能体）自主完成整个攻击流程的勒索软件攻击，并将该攻击者命名为 JADEPUFFER。
研究人员指出，这是目前公开披露的全球首个有完整记录、完全由 AI Agent 自动执行的勒索软件攻击案例，它利用公开漏洞入侵系统后，自主完成了从侦察、窃取凭证、横向移动到最终加密和摧毁数据库的完整攻击链路，全程无需人类操作。
IT之家注意到，此次事件中的 AI 攻击者并未采用新的漏洞或攻击技术，而是依靠 AI 自主组合现有攻击手法，完成了一条完整的自动化攻击链。
根据 Sysdig 报告，攻击起点是一台暴露在互联网的 Langflow 服务。攻击者利用已修复但仍存在于部分系统中的高危漏洞 CVE-2025-3248，在无需身份验证的情况下远程执行 Python 代码，从而获得目标主机控制权。
研究人员指出，虽然 Langflow 已在 1.3.0 版本修复该漏洞，并于 2025 年被美国网络安全和基础设施安全局（CISA）列入“已知遭利用漏洞”名单，但仍有大量互联网暴露实例没有及时更新，因此成为攻击目标。
成功入侵后，JADEPUFFER 会自动收集主机中的敏感信息，包括 OpenAI、Anthropic、DeepSeek、Gemini 等大模型服务 API 密钥，以及阿里云、腾讯云、华为云、AWS、Google Cloud、Azure 等云平台的登录访问凭证，同时还会搜索数据库账号、配置文件、加密货币钱包及助记词等信息，并导出 Langflow 使用的 PostgreSQL 数据库内容。
研究人员还发现，该 AI 使用 MinIO 默认账号密码“minioadmin”访问对象存储，下载包含访问密钥的配置文件，并在受害服务器创建计划任务，每隔 30 分钟主动连接攻击者控制服务器，以维持长期访问权限。
完成初始侦察后，JADEPUFFER 将攻击目标转向另一台部署生产业务的服务器，该服务器运行 MySQL 数据库及阿里巴巴开源配置中心 Nacos。
研究显示，AI 通过数据库 Root 账号登录 MySQL，并结合 Nacos 身份验证绕过漏洞 CVE-2021-29441 以及长期未修改的默认 JWT 签名密钥，成功获取 Nacos 管理权限，在数据库中植入隐藏管理员账号，实现对配置中心的完全控制。
Sysdig 表示，本次攻击最具代表性的特征并非使用了新的攻击方式，而是 AI 展现出的自主决策能力。攻击过程中，JADEPUFFER 生成的大量恶意代码均包含自然语言注释，对每一步操作目的、攻击优先级和执行逻辑进行说明。
当首次创建管理员账号失败后，它没有简单重复尝试，而是在 31 秒内完成错误分析、重新生成密码哈希、删除失败账号、重新创建管理员并再次验证登录，整个修复过程完全自动完成。
研究团队统计，此次攻击累计执行了超过 600 个具有明确目的的攻击载荷，多次根据实际执行结果调整后续策略。
在勒索阶段，JADEPUFFER 使用 MySQL 的 AES_ENCRYPT () 函数加密了 Nacos 中全部 1342 条配置数据，随后删除原始配置表及历史记录表，并创建 README_RANSOM 表留下包含比特币钱包地址和 Proton Mail 联系方式的勒索信息。
不过，Sysdig 发现，AI 在生成加密密钥后仅输出到终端一次，并未保存或上传给攻击者，这意味着即使受害者支付赎金，也无法获得解密密钥恢复数据。
此外，AI 在后续还删除了多个数据库。虽然其生成的代码声称数据已备份至外部服务器，但研究人员未发现任何数据成功外传的证据，因此无法证实这一说法。
Sysdig 认为，JADEPUFFER 最大的意义在于证明 AI Agent 已能够自主串联漏洞利用、权限提升、凭据窃取、横向移动、持久化控制及勒索破坏等多个环节，从而显著降低实施勒索攻击所需的技术门槛。
研究团队建议企业尽快升级 Langflow 至修复版本，不要将其代码执行接口直接暴露在公网，同时加强 Nacos 安全配置，更换默认 JWT 签名密钥，避免数据库使用 Root 权限对外提供服务，并加强运行时行为检测、限制服务器对外通信能力以及妥善管理各类访问凭据，以降低类似 AI 自动化攻击造成的风险。
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。
投诉水文
我要纠错
下载IT之家APP，签到赚金币兑豪礼
相关文章
关键词： JADEPUFFER ， AI Agent ， Sysdig ， 勒索攻击
阿里拟整合 QoderWork、悟空、MuleRun 三大 Agent 产品，现有用户权益不受影响
微博 CLI 工具正式上线：专为开发者和 AI Agent 打造，超 70 API 一键调用
企业微信 AI Agent“大圆”开启内测：左滑唤起，可自动理解用户诉求并结合对应场景给出回复
腾讯网盘官宣“COMING SOON”：多应用数据互通、支持 Agent 调用
华为发布 DevEco Code 鸿蒙开发 AI Agent 工具，支持代码编写、编译构建、设备运行等能力
9.9 元 / 月起，字节跳动火山引擎 Agent Plan、Coding Plan 限时优惠公布
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

全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 - IT之家
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
首页 > 科学探索 > 科技前沿
全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成
2026/7/3 19:57:00
来源： IT之家
作者： 问舟
责编： 问舟
评论：
感谢IT之家网友 不一样的体验 的线索投递！
IT之家 7 月 3 日消息，安全厂商 Sysdig 昨日宣布，其威胁研究团队首次记录到一例由 AI Agent（智能体）自主完成整个攻击流程的勒索软件攻击，并将该攻击者命名为 JADEPUFFER。
研究人员指出，这是目前公开披露的全球首个有完整记录、完全由 AI Agent 自动执行的勒索软件攻击案例，它利用公开漏洞入侵系统后，自主完成了从侦察、窃取凭证、横向移动到最终加密和摧毁数据库的完整攻击链路，全程无需人类操作。
IT之家注意到，此次事件中的 AI 攻击者并未采用新的漏洞或攻击技术，而是依靠 AI 自主组合现有攻击手法，完成了一条完整的自动化攻击链。
根据 Sysdig 报告，攻击起点是一台暴露在互联网的 Langflow 服务。攻击者利用已修复但仍存在于部分系统中的高危漏洞 CVE-2025-3248，在无需身份验证的情况下远程执行 Python 代码，从而获得目标主机控制权。
研究人员指出，虽然 Langflow 已在 1.3.0 版本修复该漏洞，并于 2025 年被美国网络安全和基础设施安全局（CISA）列入“已知遭利用漏洞”名单，但仍有大量互联网暴露实例没有及时更新，因此成为攻击目标。
成功入侵后，JADEPUFFER 会自动收集主机中的敏感信息，包括 OpenAI、Anthropic、DeepSeek、Gemini 等大模型服务 API 密钥，以及阿里云、腾讯云、华为云、AWS、Google Cloud、Azure 等云平台的登录访问凭证，同时还会搜索数据库账号、配置文件、加密货币钱包及助记词等信息，并导出 Langflow 使用的 PostgreSQL 数据库内容。
研究人员还发现，该 AI 使用 MinIO 默认账号密码“minioadmin”访问对象存储，下载包含访问密钥的配置文件，并在受害服务器创建计划任务，每隔 30 分钟主动连接攻击者控制服务器，以维持长期访问权限。
完成初始侦察后，JADEPUFFER 将攻击目标转向另一台部署生产业务的服务器，该服务器运行 MySQL 数据库及阿里巴巴开源配置中心 Nacos。
研究显示，AI 通过数据库 Root 账号登录 MySQL，并结合 Nacos 身份验证绕过漏洞 CVE-2021-29441 以及长期未修改的默认 JWT 签名密钥，成功获取 Nacos 管理权限，在数据库中植入隐藏管理员账号，实现对配置中心的完全控制。
Sysdig 表示，本次攻击最具代表性的特征并非使用了新的攻击方式，而是 AI 展现出的自主决策能力。攻击过程中，JADEPUFFER 生成的大量恶意代码均包含自然语言注释，对每一步操作目的、攻击优先级和执行逻辑进行说明。
当首次创建管理员账号失败后，它没有简单重复尝试，而是在 31 秒内完成错误分析、重新生成密码哈希、删除失败账号、重新创建管理员并再次验证登录，整个修复过程完全自动完成。
研究团队统计，此次攻击累计执行了超过 600 个具有明确目的的攻击载荷，多次根据实际执行结果调整后续策略。
在勒索阶段，JADEPUFFER 使用 MySQL 的 AES_ENCRYPT () 函数加密了 Nacos 中全部 1342 条配置数据，随后删除原始配置表及历史记录表，并创建 README_RANSOM 表留下包含比特币钱包地址和 Proton Mail 联系方式的勒索信息。
不过，Sysdig 发现，AI 在生成加密密钥后仅输出到终端一次，并未保存或上传给攻击者，这意味着即使受害者支付赎金，也无法获得解密密钥恢复数据。
此外，AI 在后续还删除了多个数据库。虽然其生成的代码声称数据已备份至外部服务器，但研究人员未发现任何数据成功外传的证据，因此无法证实这一说法。
Sysdig 认为，JADEPUFFER 最大的意义在于证明 AI Agent 已能够自主串联漏洞利用、权限提升、凭据窃取、横向移动、持久化控制及勒索破坏等多个环节，从而显著降低实施勒索攻击所需的技术门槛。
研究团队建议企业尽快升级 Langflow 至修复版本，不要将其代码执行接口直接暴露在公网，同时加强 Nacos 安全配置，更换默认 JWT 签名密钥，避免数据库使用 Root 权限对外提供服务，并加强运行时行为检测、限制服务器对外通信能力以及妥善管理各类访问凭据，以降低类似 AI 自动化攻击造成的风险。
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。
投诉水文
我要纠错
下载IT之家APP，签到赚金币兑豪礼
相关文章
关键词： JADEPUFFER ， AI Agent ， Sysdig ， 勒索攻击
阿里拟整合 QoderWork、悟空、MuleRun 三大 Agent 产品，现有用户权益不受影响
微博 CLI 工具正式上线：专为开发者和 AI Agent 打造，超 70 API 一键调用
企业微信 AI Agent“大圆”开启内测：左滑唤起，可自动理解用户诉求并结合对应场景给出回复
腾讯网盘官宣“COMING SOON”：多应用数据互通、支持 Agent 调用
华为发布 DevEco Code 鸿蒙开发 AI Agent 工具，支持代码编写、编译构建、设备运行等能力
9.9 元 / 月起，字节跳动火山引擎 Agent Plan、Coding Plan 限时优惠公布
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
- readability_score: 51
- fetch_status: fetched-readable-text-body-visible-text
- extraction_quality: high
- diagnostics: {"readability_score":51,"text_length":2662,"paragraph_count":28,"sentence_count":19,"boilerplate_hits":6,"symbol_ratio":0.0015,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=high｜confidence=high
   安全厂商 Sysdig 首次记录到 AI Agent"JADEPUFFER"自动完成的勒索攻击。攻击利用暴露的 Langflow 服务漏洞 CVE-2025-3248 远程执行 Python 代码，随后自主收集 OpenAI、Anthropic、DeepSeek、Gemini 等 API 密钥及阿里云、腾讯云、华为云、AWS、Google Cloud、Azure 等云平台凭证，通过 MinIO 默认密码访问对象存储并创建每 30 分钟连接的计划任务。横向移动到 MySQL 和 Nacos 服务器，利用数据库 Root 账号及 Nacos 漏洞 CVE-2021-29441 获取管理权限，加密全部 1342 条配置数据，留下包含比特币钱包地址和 Proton Mail 的勒索信息。AI 在首次操作失败后 31 秒内自主完成错误分析与修复，累计执行超过 600 个攻击载荷，全程无需人类操作。

2. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 科学探索 > 科技前沿 全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 2026/7/3 19:57:00 来源： IT之家 作者： 问舟 责编： 问舟 评论： 感谢IT之家网友 不一样的体验 的线索投递！

3. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=high
   IT之家 7 月 3 日消息，安全厂商 Sysdig 昨日宣布，其威胁研究团队首次记录到一例由 AI Agent（智能体）自主完成整个攻击流程的勒索软件攻击，并将该攻击者命名为 JADEPUFFER。

4. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   研究人员指出，这是目前公开披露的全球首个有完整记录、完全由 AI Agent 自动执行的勒索软件攻击案例，它利用公开漏洞入侵系统后，自主完成了从侦察、窃取凭证、横向移动到最终加密和摧毁数据库的完整攻击链路，全程无需人类操作。

5. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   IT之家注意到，此次事件中的 AI 攻击者并未采用新的漏洞或攻击技术，而是依靠 AI 自主组合现有攻击手法，完成了一条完整的自动化攻击链。

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   根据 Sysdig 报告，攻击起点是一台暴露在互联网的 Langflow 服务。

## business_elements

- companies: IT之家（RSS）, OpenAI, Anthropic, Google, AWS
- products: Agent, Gemini
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: 开发者 / 工程团队
- workflows: 权限 / 安全治理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全
- numbers: 2025, 3248, 30, 2021, 29441, 1342, 31, 600
- quotes: JADEPUFFER / minioadmin / COMING SOON

## evidence_seed

- company_actions: 根据 Sysdig 报告，攻击起点是一台暴露在互联网的 Langflow 服务。
- case_details: 全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 科学探索 > 科技前沿 全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成 2026/7/3 19:57:00 来源： IT之家 作者： 问舟 责编： 问舟 评论： 感谢IT之家网友 不一样的体验 的线索投递！ / 研究人员指出，这是目前公开披露的全球首个有完整记录、完全由 AI Agent 自动执行的勒索软件攻击案例，它利用公开漏洞入侵系统后，自主完成了从侦察、窃取凭证、横向移动到最终加密和摧毁数据库的完整攻击链路，全程无需人类操作。 / IT之家注意到，此次事件中的 AI 攻击者并未采用新的漏洞或攻击技术，而是依靠 AI 自主组合现有攻击手法，完成了一条完整的自动化攻击链。
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: IT之家 7 月 3 日消息，安全厂商 Sysdig 昨日宣布，其威胁研究团队首次记录到一例由 AI Agent（智能体）自主完成整个攻击流程的勒索软件攻击，并将该攻击者命名为 JADEPUFFER。

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

- viewpoint: true
- case: false
- business_change: false
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
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
- discovery_record: {"discovery_title":"全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成","discovery_summary":"安全厂商 Sysdig 首次记录到 AI Agent\"JADEPUFFER\"自动完成的勒索攻击。攻击利用暴露的 Langflow 服务漏洞 CVE-2025-3248 远程执行 Python 代码，随后自主收集 OpenAI、Anthropic、DeepSeek、Gemini 等 API 密钥及阿里云、腾讯云、华为云、AWS、Google Cloud、Azure 等云平台凭证，通过 MinIO 默认密码访问对象存储并创建每 30 分钟连接的计划任务。横向移动到 MySQL 和 Nacos 服务器，利用数据库 Root 账号及 Nacos 漏洞 CVE-2021-29441 获取管理权限，加密全部 1342 条配置数据，留下包含比特币钱包地址和 Proton Mail 的勒索信息。AI 在首次操作失败后 31 秒内自主完成错误分析与修复，累计执行超过 600 个攻击载荷，全程无需人类操作。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/972/424.htm","discovered_at":"2026-07-04T03:11:32.676Z","rank_on_page":148,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

安全厂商 Sysdig 首次记录到 AI Agent"JADEPUFFER"自动完成的勒索攻击。攻击利用暴露的 Langflow 服务漏洞 CVE-2025-3248 远程执行 Python 代码，随后自主收集 OpenAI、Anthropic、DeepSeek、Gemini 等 API 密钥及阿里云、腾讯云、华为云、AWS、Google Cloud、Azure 等云平台凭证，通过 MinIO 默认密码访问对象存储并创建每 30 分钟连接的计划任务。横向移动到 MySQL 和 Nacos 服务器，利用数据库 Root 账号及 Nacos 漏洞 CVE-2021-29441 获取管理权限，加密全部 1342 条配置数据，留下包含比特币钱包地址和 Proton Mail 的勒索信息。AI 在首次操作失败后 31 秒内自主完成错误分析与修复，累计执行超过 600 个攻击载荷，全程无需人类操作。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
