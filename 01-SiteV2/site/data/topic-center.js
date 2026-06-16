window.WaveSightTopicCenter = {
  "meta": {
    "version": "V2.2.1-title-polish",
    "date": "2026-06-16",
    "generatedAt": "2026-06-16T03:08:09.977Z",
    "source": "business-signals + first-line-viewpoints + community-intelligence",
    "rule": "boss_decision_topic_engine",
    "ruleLabel": "老板决策型选题机制",
    "updateMechanism": "每日 Business Signals 链路第 9 步运行，读取本地三类日更数据，确定性生成选题。",
    "scoring": {
      "bossPain": 25,
      "moneyRelation": 25,
      "talkability": 20,
      "spreadability": 15,
      "actionability": 10,
      "styleFit": 5
    },
    "inputCounts": {
      "businessSignals": 16,
      "firstLineViewpoints": 2,
      "communityItems": 61
    },
    "sources": {
      "money_leak": 1,
      "save_headcount": 1,
      "peer_pressure": 1,
      "pitfall": 1,
      "counterintuitive": 1,
      "small_role": 1,
      "big_small_contrast": 1,
      "person_story": 1
    },
    "leadTopicId": "money_leak-agentforce-cust-老板先查订单入口有没有漏钱"
  },
  "sources": [
    {
      "id": "money_leak",
      "title": "漏钱型",
      "desc": "订单入口、转化漏斗、线索流失",
      "question": "老板每天哪里在流失收入？"
    },
    {
      "id": "save_headcount",
      "title": "省人型",
      "desc": "少招人、少返工、少加班",
      "question": "哪些重复岗位可以先被 AI 接管一部分？"
    },
    {
      "id": "peer_pressure",
      "title": "同行压力型",
      "desc": "同行已做、对手先跑、老板焦虑",
      "question": "哪些同行动作会让老板产生紧迫感？"
    },
    {
      "id": "pitfall",
      "title": "避坑型",
      "desc": "工具乱买、权限失控、流程没拆",
      "question": "老板最容易把 AI 钱花错在哪里？"
    },
    {
      "id": "counterintuitive",
      "title": "反常识型",
      "desc": "推翻流行说法，形成可传播判断",
      "question": "哪个流行说法需要被刺穿？"
    },
    {
      "id": "small_role",
      "title": "小岗位型",
      "desc": "客服、销售、财务、标书、运营",
      "question": "哪个具体岗位最适合先 AI 化？"
    },
    {
      "id": "big_small_contrast",
      "title": "大小对照型",
      "desc": "大融资对照小生意，大模型对照小岗位",
      "question": "大新闻背后，普通老板能抓哪一层机会？"
    },
    {
      "id": "person_story",
      "title": "人物故事型",
      "desc": "具体人、具体场景、具体结果",
      "question": "有没有一个人能讲清楚一个趋势？"
    }
  ],
  "topics": [
    {
      "id": "money_leak-agentforce-cust-老板先查订单入口有没有漏钱",
      "sourceId": "money_leak",
      "sourceName": "漏钱型",
      "sourceDesc": "订单入口、转化漏斗、线索流失",
      "type": "boss_decision_topic",
      "title": "Agentforce Cust：老板先查订单入口有没有漏钱",
      "spreadTitle": "Agentforce Cust：老板先查订单入口有没有漏钱",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "流量、搜索、来电、表单和私信，本质上都是订单入口。AI 先改变的不是工具栏，而是客户从看见你到联系你的路径。",
      "relevance": "原始来源标题：Salesforce 的原文业务场景：Agentforce Customer Stories - Salesforce。；社群里也出现了“公众号新人30天变现7000+，我是如何用微信贴图…”这类一线反馈。",
      "bossPain": "老板最容易忽略的不是没有用 AI，而是客户已经换了入口，公司还在用旧流程接单。",
      "moneyLine": "先算入口漏损，再算模型能力；能把曝光、咨询、跟进接住，AI 才和收入有关。",
      "oldFrame": "AI 是一个提效工具。",
      "newFrame": "AI 正在改写客户入口，入口漏掉就是收入漏掉。",
      "actionHint": "今天先盘点 3 个入口：搜索入口、内容入口、咨询入口，各看一次转化和跟进断点。",
      "evidence": "Salesforce：Agentforce Customer Stories - Salesforce；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A09",
            "title": "Salesforce：Agentforce Customer Stories - Salesforce",
            "source": "salesforce.com",
            "url": "https://www.salesforce.com/agentforce/customer-stories/",
            "note": "原始来源标题：Salesforce 的原文业务场景：Agentforce Customer Stories - Salesforce。"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "ac2d9cbae4815c",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "salesforce.com",
      "url": "https://www.salesforce.com/agentforce/customer-stories/",
      "date": "2026-06-16",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 25,
        "talkability": 19,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "开头直接问漏钱",
          "note": "不要先讲 Agentforce Customer Stori… 多新，先问老板：这个入口今天带来多少咨询、漏掉多少跟进？"
        },
        {
          "title": "中段拆入口链路",
          "note": "看见、点击、咨询、记录、跟进、成交，每一步都能放 AI，但先看哪里漏。"
        },
        {
          "title": "结尾落到老板动作",
          "note": "让老板今天就拉一张入口表，而不是收藏一堆工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "small_role-salesforce以36亿美-小公司先做一个小岗位-ai-员工",
      "sourceId": "small_role",
      "sourceName": "小岗位型",
      "sourceDesc": "客服、销售、财务、标书、运营",
      "type": "boss_decision_topic",
      "title": "Salesforce以36亿美：小公司先做一个小岗位 AI 员工",
      "spreadTitle": "Salesforce以36亿美：小公司先做一个小岗位 AI 员工",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "普通老板和服务商的机会，不在宏大平台，而在一个具体岗位、一个明确动作、一个可验收结果里。",
      "relevance": "Salesforce宣布以36亿美元收购AI客服平台Fin（前身为Intercom）。Fin提供可跨实时聊天、WhatsApp、短信、电话、Slack等多渠道解决客户问题的AI智能体。Salesforce计划利用Fin的技术和团队增强其企…；这类材料说明岗位级 AI 比大而全平台更容易落地。",
      "bossPain": "老板最怕 AI 项目太大、太贵、太慢，最后没人用。",
      "moneyLine": "一个岗位先打穿，比一个平台讲 100 个功能更容易收钱，也更容易复购。",
      "oldFrame": "做一个什么都能干的 AI 平台。",
      "newFrame": "做一个只干一件事但能交付的小岗位 AI 员工。",
      "actionHint": "先从客服、销售跟进、内容分发、资料整理、流程复核里选一个岗位动作。",
      "evidence": "Salesforce以36亿美元收购AI客服平台Fin；美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A12",
            "title": "Salesforce以36亿美元收购AI客服平台Fin",
            "source": "TechCrunch：AI（RSS）",
            "url": "https://techcrunch.com/2026/06/15/salesforce-acquires-ai-customer-service-platform-fin-for-3-6b",
            "note": "Salesforce宣布以36亿美元收购AI客服平台Fin（前身为Intercom）。Fin提供可跨实时聊天、WhatsApp、短信、电话、Slack等多渠道解决客户问题的AI智能体。Salesforce计划利用Fin的技术和团队增强其企业级Agentforce平台，该平台允许企业构建自定义AI智能体以自动化任务。交易预计在Salesforce 2027财…"
          },
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A11",
            "title": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼",
            "source": "IT之家（RSS）",
            "url": "https://www.ithome.com/0/964/631.htm",
            "note": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工作属行业常规，裁定不可再诉。这是马斯克四周内第二次在与 OpenAI 的法律交锋中败诉。"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "420298a9897e36",
            "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224182115441",
            "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
          }
        ]
      },
      "source": "TechCrunch：AI（RSS）",
      "url": "https://techcrunch.com/2026/06/15/salesforce-acquires-ai-customer-service-platform-fin-for-3-6b",
      "date": "2026-06-16",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 24,
        "talkability": 18,
        "spreadability": 15,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用小岗位对抗大平台",
          "note": "这是最适合你现有表达的主线：不做大而全，先做小而深。"
        },
        {
          "title": "每个岗位给一个可验收结果",
          "note": "客服看接通率，销售看跟进率，内容看线索，流程看错误率。"
        },
        {
          "title": "避免写成创业方向清单",
          "note": "要写一个岗位打穿逻辑，不要罗列 10 个机会。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "counterintuitive-ai-幻觉罚单-老板真正该买的不是工具-是任务拆解能力",
      "sourceId": "counterintuitive",
      "sourceName": "反常识型",
      "sourceDesc": "推翻流行说法，形成可传播判断",
      "type": "boss_decision_topic",
      "title": "AI 幻觉罚单：老板真正该买的不是工具，是任务拆解能力",
      "spreadTitle": "AI 幻觉罚单：老板真正该买的不是工具，是任务拆解能力",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "反常识点在于：AI 越强，越不是所有人都被替代，而是会拆任务、会验收结果的人更值钱。",
      "relevance": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工…；社群里“21岁休学创业，累计营收70w+，这个05后凭什么？”的讨论也在提醒老板，问题不再只是怎么做。",
      "bossPain": "工具买了一堆，员工不会拆任务；老板看到结果差，最后误判 AI 不行。",
      "moneyLine": "工具是支出，任务拆解和验收标准是资产。支出会过期，资产能复用。",
      "oldFrame": "追最新 AI 工具。",
      "newFrame": "先沉淀任务、语料、步骤和验收标准，再让 AI 接手。",
      "actionHint": "今天先选一个业务动作，写清输入、步骤、验收标准，再接任何 AI 工具。",
      "evidence": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A11",
            "title": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼",
            "source": "IT之家（RSS）",
            "url": "https://www.ithome.com/0/964/631.htm",
            "note": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工作属行业常规，裁定不可再诉。这是马斯克四周内第二次在与 OpenAI 的法律交锋中败诉。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
            "source": "Dataiku Blog",
            "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "9319cbd9572bc9",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/index",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "IT之家（RSS）",
      "url": "https://www.ithome.com/0/964/631.htm",
      "date": "2026-06-16",
      "score": 95,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 24,
        "moneyRelation": 23,
        "talkability": 18,
        "spreadability": 15,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "先打脸工具崇拜",
          "note": "开头写：买工具不是 AI 转型，能稳定交付结果才算。"
        },
        {
          "title": "中段讲任务拆解",
          "note": "把提示词、流程、知识库和验收标准放在同一张图里讲。"
        },
        {
          "title": "结尾给金句",
          "note": "AI 工具不是资产，能反复跑通的任务系统才是资产。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "big_small_contrast-blitzy-融资-200m-普通老板该看见哪层机会",
      "sourceId": "big_small_contrast",
      "sourceName": "大小对照型",
      "sourceDesc": "大融资对照小生意，大模型对照小岗位",
      "type": "boss_decision_topic",
      "title": "Blitzy 融资 $200M：普通老板该看见哪层机会？",
      "spreadTitle": "Blitzy 融资 $200M：普通老板该看见哪层机会？",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "大新闻负责告诉你资本往哪里押，小机会负责告诉你老板明天愿意为什么付钱。",
      "relevance": "Blitzy 获得$200M 融资，公开资料显示资金继续流向 AI 产品化和企业采用环节。；同时社群里的“这篇产品调研干货：帮你避开90%独立开发者起步坑”说明一线需求还在配置、流程和交付。",
      "bossPain": "老板看不懂大融资，但能理解谁帮他把一个具体业务动作跑起来。",
      "moneyLine": "大公司赚基础设施的钱，小服务商赚落地第一公里的钱。",
      "oldFrame": "AI 创业只能跟大模型和融资有关。",
      "newFrame": "普通人的 AI 机会在帮老板跨过配置、流程和交付门槛。",
      "actionHint": "把服务产品化：诊断一个流程、配置一套工具、交付一个可复用动作。",
      "evidence": "Blitzy 融资 $200M；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A01",
            "title": "Blitzy 融资 $200M",
            "source": "news.crunchbase.com",
            "url": "https://news.crunchbase.com/ai/blitzy-funding-valuation-autonomous-software-development-vibe-coding-startups/",
            "note": "Blitzy 获得$200M 融资，公开资料显示资金继续流向 AI 产品化和企业采用环节。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
            "source": "Dataiku Blog",
            "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "420298a9897e36",
            "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224182115441",
            "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
          }
        ]
      },
      "source": "news.crunchbase.com",
      "url": "https://news.crunchbase.com/ai/blitzy-funding-valuation-autonomous-software-development-vibe-coding-startups/",
      "date": "2026-06-16",
      "score": 93,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 21,
        "moneyRelation": 24,
        "talkability": 20,
        "spreadability": 15,
        "actionability": 8,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用大钱和小钱制造冲突",
          "note": "大融资负责制造注意力，小服务负责让老板觉得和自己有关。"
        },
        {
          "title": "写出两套赚钱逻辑",
          "note": "资本逻辑：长期技术押注；服务逻辑：帮老板完成第一公里。"
        },
        {
          "title": "落到可卖服务包",
          "note": "流程诊断、工具配置、知识库搭建、首个工作流，这是老板可理解的产品。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "person_story-从普通人赚-1000-万-到-salesforce以36亿美-有场景的-ai-故事更容易被老板转发",
      "sourceId": "person_story",
      "sourceName": "人物故事型",
      "sourceDesc": "具体人、具体场景、具体结果",
      "type": "boss_decision_topic",
      "title": "从普通人赚 1000 万，到 Salesforce以36亿美：有场景的 AI 故事更容易被老板转发",
      "spreadTitle": "从普通人赚 1000 万，到 Salesforce以36亿美：有场景的 AI 故事更容易被老板转发",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "人物故事的价值不在鸡汤，而在把一个抽象趋势压缩成老板能看懂的场景、成本和选择。",
      "relevance": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？；这类材料适合做传播入口，再回到老板的业务判断。",
      "bossPain": "老板不是不关心 AI，而是不愿意看一篇没有人、没有场景、没有结果的技术说明。",
      "moneyLine": "一个具体人、一件具体事、一个具体结果，比十个工具功能更容易带来咨询和信任。",
      "oldFrame": "写 AI 就要讲技术和趋势。",
      "newFrame": "写给老板的 AI 内容，要先有人、有场景、有结果。",
      "actionHint": "从当天素材里挑一个具体人或具体业务场景，按“处境-动作-结果-老板判断”写。",
      "evidence": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；普通人怎么赚到1000万？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A11",
            "title": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼",
            "source": "IT之家（RSS）",
            "url": "https://www.ithome.com/0/964/631.htm",
            "note": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工作属行业常规，裁定不可再诉。这是马斯克四周内第二次在与 OpenAI 的法律交锋中败诉。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
            "source": "Dataiku Blog",
            "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "679f12f1ab88e3",
            "title": "普通人怎么赚到1000万？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/22255225524225521",
            "note": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？"
          }
        ]
      },
      "source": "IT之家（RSS）",
      "url": "https://www.ithome.com/0/964/631.htm",
      "date": "2026-06-16",
      "score": 92,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 23,
        "moneyRelation": 21,
        "talkability": 20,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用人物场景开头",
          "note": "不要先讲 AI 趋势，先讲 普通人怎么赚到1000万？ 这类具体处境。"
        },
        {
          "title": "把故事转成商业判断",
          "note": "重点不是感动，而是这个故事说明老板该改哪个流程、补哪个能力。"
        },
        {
          "title": "结尾回到老板动作",
          "note": "让老板知道明天可以拿哪个人、哪个岗位、哪个场景做试点。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "peer_pressure-从公众号新人-30-天变现-到-agentforce-cust-同行压力不在技术-在速度",
      "sourceId": "peer_pressure",
      "sourceName": "同行压力型",
      "sourceDesc": "同行已做、对手先跑、老板焦虑",
      "type": "boss_decision_topic",
      "title": "从公众号新人 30 天变现，到 Agentforce Cust：同行压力不在技术，在速度",
      "spreadTitle": "从公众号新人 30 天变现，到 Agentforce Cust：同行压力不在技术，在速度",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "最能触发老板的不是技术解释，而是别人已经把 AI 用到获客、内容、交付、产品试错里，并且开始看到结果。",
      "relevance": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌；这类社群信号代表一线老板和操盘手已经在算产出。",
      "bossPain": "当同行用 AI 降低试错成本时，你还在用人工流程慢慢排队。",
      "moneyLine": "同行压力真正影响的是获客成本、内容成本和试错周期，而不是老板的技术焦虑。",
      "oldFrame": "AI 是员工自己研究的新工具。",
      "newFrame": "AI 是同行正在重做经营速度的生产系统。",
      "actionHint": "每周只问团队一个问题：同行哪一个动作已经被 AI 缩短了，我们要不要跟？",
      "evidence": "Salesforce：Agentforce Customer Stories - Salesforce；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A09",
            "title": "Salesforce：Agentforce Customer Stories - Salesforce",
            "source": "salesforce.com",
            "url": "https://www.salesforce.com/agentforce/customer-stories/",
            "note": "原始来源标题：Salesforce 的原文业务场景：Agentforce Customer Stories - Salesforce。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
            "source": "Dataiku Blog",
            "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "ac2d9cbae4815c",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "salesforce.com",
      "url": "https://www.salesforce.com/agentforce/customer-stories/",
      "date": "2026-06-16",
      "score": 91,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 22,
        "moneyRelation": 22,
        "talkability": 19,
        "spreadability": 15,
        "actionability": 8,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用同行压力开头",
          "note": "标题和开头都不要讲 AI 多强，要讲别人已经开始用 AI 跑出结果。"
        },
        {
          "title": "拆获客、交付、产品三个场景",
          "note": "每个场景只写一个真实动作，避免变成工具列表。"
        },
        {
          "title": "落到老板的例会问题",
          "note": "建议老板每周让团队汇报一个被 AI 缩短的动作，而不是汇报又试了什么工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "save_headcount-ai-幻觉罚单-别急着裁员-先少招重复岗位",
      "sourceId": "save_headcount",
      "sourceName": "省人型",
      "sourceDesc": "少招人、少返工、少加班",
      "type": "boss_decision_topic",
      "title": "AI 幻觉罚单：别急着裁员，先少招重复岗位",
      "spreadTitle": "AI 幻觉罚单：别急着裁员，先少招重复岗位",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "AI 进入企业的第一步，不是替代一个完整的人，而是接住岗位里反复发生、规则清楚、结果可验收的动作。",
      "relevance": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工…；这类信号比“AI 很强”更接近老板的组织账。",
      "bossPain": "人越招越多，流程没有变短，管理成本反而被重复动作拖住。",
      "moneyLine": "少招一个重复岗位，或让一个岗位少返工 30%，老板才会觉得 AI 是投入，不是玩具。",
      "oldFrame": "AI 上线就是裁员。",
      "newFrame": "AI 上线的第一阶段，是把岗位动作拆小，让公司少招重复岗位。",
      "actionHint": "选一个岗位，列出每天重复最多的 5 个动作，先交给 AI 试跑其中 1 个。",
      "evidence": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A11",
            "title": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼",
            "source": "IT之家（RSS）",
            "url": "https://www.ithome.com/0/964/631.htm",
            "note": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工作属行业常规，裁定不可再诉。这是马斯克四周内第二次在与 OpenAI 的法律交锋中败诉。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
            "source": "Dataiku Blog",
            "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "9319cbd9572bc9",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/index",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "IT之家（RSS）",
      "url": "https://www.ithome.com/0/964/631.htm",
      "date": "2026-06-16",
      "score": 90,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 23,
        "moneyRelation": 23,
        "talkability": 16,
        "spreadability": 13,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用岗位动作替代岗位名称",
          "note": "不要写 AI 替代某个人，写 AI 先替代接听、归档、质检、催办、汇总这类动作。"
        },
        {
          "title": "把省人写成管理账",
          "note": "老板关心的不是炫技，是少招人、少返工、少培训。"
        },
        {
          "title": "给一个当天可做的小动作",
          "note": "用 美国法官驳回 xAI 指控 OpenAI 窃取商业… 做例子，把大流程拆成一个可验收动作。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "pitfall-伯克利rdi发布agents-老板先补责任边界",
      "sourceId": "pitfall",
      "sourceName": "避坑型",
      "sourceDesc": "工具乱买、权限失控、流程没拆",
      "type": "boss_decision_topic",
      "title": "伯克利RDI发布Agents'：老板先补责任边界",
      "spreadTitle": "伯克利RDI发布Agents'：老板先补责任边界",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "AI 从生成内容走向执行动作后，企业问题从“会不会用”变成“谁审核、谁授权、谁负责”。",
      "relevance": "2026年6月，伯克利RDI发布Agents' Last Exam（ALE）基准，包含1，500余项源于真实工作的任务，覆盖55个非体力职业。对Fable 5、GPT-5.5、Composer 2.5等前沿智能体的测评显示：在最困难层级成…；这类信号适合写给老板看，因为它直接关系到业务风险。",
      "bossPain": "AI 一旦能读文件、写内容、调工具、改数据，错误就不只是内容不好，而可能变成业务事故。",
      "moneyLine": "权限没管住，省下的人力钱可能被一次合规、法务或数据事故吃掉。",
      "oldFrame": "AI 越自主越好。",
      "newFrame": "AI 越自主，越要先设计权限、复核和责任人。",
      "actionHint": "先把 AI 员工分成三级：只读、建议、可执行；每一级都写清谁复核。",
      "evidence": "伯克利RDI发布Agents' Last Exam基准；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A05",
            "title": "伯克利RDI发布Agents' Last Exam基准",
            "source": "Berkeley RDI：Blog（AI 安全与评测）",
            "url": "https://rdi.berkeley.edu/blog/agents-last-exam",
            "note": "2026年6月，伯克利RDI发布Agents' Last Exam（ALE）基准，包含1，500余项源于真实工作的任务，覆盖55个非体力职业。对Fable 5、GPT-5.5、Composer 2.5等前沿智能体的测评显示：在最困难层级成功率均为0%；整体任务表现接近，但单任务成本差异巨大（Fable 5约$15.70，GPT-5.5约$3.80，Comp…"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
            "source": "Dataiku Blog",
            "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
            "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "9319cbd9572bc9",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/index",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "Berkeley RDI：Blog（AI 安全与评测）",
      "url": "https://rdi.berkeley.edu/blog/agents-last-exam",
      "date": "2026-06-16",
      "score": 88,
      "grade": "A",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 22,
        "moneyRelation": 21,
        "talkability": 18,
        "spreadability": 13,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "不要写安全科普，写老板责任",
          "note": "老板不关心分类器模型，关心 AI 搞错后谁背锅。"
        },
        {
          "title": "把权限拆成人话",
          "note": "只读、建议、执行三个等级，比讲治理框架更容易传播。"
        },
        {
          "title": "用当天案例推进",
          "note": "用 伯克利RDI发布Agents' Last Exam… 做钩子，落到企业内部的授权和复核表。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "money_leak-google-搜索-老板先查订单入口有没有漏钱",
      "sourceId": "money_leak",
      "sourceName": "漏钱型",
      "sourceDesc": "订单入口、转化漏斗、线索流失",
      "type": "boss_decision_topic",
      "title": "Google 搜索：老板先查订单入口有没有漏钱",
      "spreadTitle": "Google 搜索：老板先查订单入口有没有漏钱",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "流量、搜索、来电、表单和私信，本质上都是订单入口。AI 先改变的不是工具栏，而是客户从看见你到联系你的路径。",
      "relevance": "Google 对其搜索引擎进行 20 多年来最大变革，将 AI 生成的答案、对话式搜索和推理工具直接集成到核心搜索产品中。高级副总裁 Nick Fox 认为，AI 允许用户提出更复杂的问题并得到更快、更有用的答案，同时仍连接人们与网络内容…；社群里也出现了“公众号新人30天变现7000+，我是如何用微信贴图…”这类一线反馈。",
      "bossPain": "老板最容易忽略的不是没有用 AI，而是客户已经换了入口，公司还在用旧流程接单。",
      "moneyLine": "先算入口漏损，再算模型能力；能把曝光、咨询、跟进接住，AI 才和收入有关。",
      "oldFrame": "AI 是一个提效工具。",
      "newFrame": "AI 正在改写客户入口，入口漏掉就是收入漏掉。",
      "actionHint": "今天先盘点 3 个入口：搜索入口、内容入口、咨询入口，各看一次转化和跟进断点。",
      "evidence": "Google 如何用 AI 重塑搜索；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A09",
            "title": "Google 如何用 AI 重塑搜索",
            "source": "Bloomberg：Technology（RSS）",
            "url": "https://www.bloomberg.com/news/videos/2026-06-14/how-google-is-reinventing-search-with-ai-video",
            "note": "Google 对其搜索引擎进行 20 多年来最大变革，将 AI 生成的答案、对话式搜索和推理工具直接集成到核心搜索产品中。高级副总裁 Nick Fox 认为，AI 允许用户提出更复杂的问题并得到更快、更有用的答案，同时仍连接人们与网络内容。但对创作者和出版商而言，更少的键盘敲击可能带来影响。"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "ac2d9cbae4815c",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "Bloomberg：Technology（RSS）",
      "url": "https://www.bloomberg.com/news/videos/2026-06-14/how-google-is-reinventing-search-with-ai-video",
      "date": "2026-06-15",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 25,
        "talkability": 19,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "开头直接问漏钱",
          "note": "不要先讲 Google 如何用 AI 重塑搜索 多新，先问老板：这个入口今天带来多少咨询、漏掉多少跟进？"
        },
        {
          "title": "中段拆入口链路",
          "note": "看见、点击、咨询、记录、跟进、成交，每一步都能放 AI，但先看哪里漏。"
        },
        {
          "title": "结尾落到老板动作",
          "note": "让老板今天就拉一张入口表，而不是收藏一堆工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "small_role-rocket-close-小公司先做一个小岗位-ai-员工",
      "sourceId": "small_role",
      "sourceName": "小岗位型",
      "sourceDesc": "客服、销售、财务、标书、运营",
      "type": "boss_decision_topic",
      "title": "Rocket Close：小公司先做一个小岗位 AI 员工",
      "spreadTitle": "Rocket Close：小公司先做一个小岗位 AI 员工",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "普通老板和服务商的机会，不在宏大平台，而在一个具体岗位、一个明确动作、一个可验收结果里。",
      "relevance": "Rocket Close 利用 AWS 的 Agentic AI 能力优化产权保险运营流程，显著提升了 title operations 的效率。这是 AWS 生态中 Agentic AI 落地的代表性案例。；这类材料说明岗位级 AI 比大而全平台更容易落地。",
      "bossPain": "老板最怕 AI 项目太大、太贵、太慢，最后没人用。",
      "moneyLine": "一个岗位先打穿，比一个平台讲 100 个功能更容易收钱，也更容易复购。",
      "oldFrame": "做一个什么都能干的 AI 平台。",
      "newFrame": "做一个只干一件事但能交付的小岗位 AI 员工。",
      "actionHint": "先从客服、销售跟进、内容分发、资料整理、流程复核里选一个岗位动作。",
      "evidence": "Rocket Close 用 Agentic AI 优化产权运营：AWS 实践案例；Rippling 用 Deep Agents 和 LangSmith 在 6 个月内全面落地 AI；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A04",
            "title": "Rocket Close 用 Agentic AI 优化产权运营：AWS 实践案例",
            "source": "aws.amazon.com",
            "url": "https://aws.amazon.com/blogs/machine-learning/building-supercharger-how-rocket-close-optimized-title-operations-with-agentic-ai/",
            "note": "Rocket Close 利用 AWS 的 Agentic AI 能力优化产权保险运营流程，显著提升了 title operations 的效率。这是 AWS 生态中 Agentic AI 落地的代表性案例。"
          },
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A03",
            "title": "Rippling 用 Deep Agents 和 LangSmith 在 6 个月内全面落地 AI",
            "source": "langchain.com",
            "url": "https://www.langchain.com/blog/how-rippling-went-ai-native-across-every-product-in-6-months-with-deep-agents-and-langsmith",
            "note": "Rippling 借助 LangChain 的 Deep Agents 和 LangSmith 平台，在 6 个月内将 AI 能力整合到所有产品线中，实现企业级 AI 原生转型。这是 LangChain 生态在企业落地中的重要参考案例。"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "420298a9897e36",
            "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224182115441",
            "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
          }
        ]
      },
      "source": "aws.amazon.com",
      "url": "https://aws.amazon.com/blogs/machine-learning/building-supercharger-how-rocket-close-optimized-title-operations-with-agentic-ai/",
      "date": "2026-06-15",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 24,
        "talkability": 18,
        "spreadability": 15,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用小岗位对抗大平台",
          "note": "这是最适合你现有表达的主线：不做大而全，先做小而深。"
        },
        {
          "title": "每个岗位给一个可验收结果",
          "note": "客服看接通率，销售看跟进率，内容看线索，流程看错误率。"
        },
        {
          "title": "避免写成创业方向清单",
          "note": "要写一个岗位打穿逻辑，不要罗列 10 个机会。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "counterintuitive-rocket-close-老板真正该买的不是工具-是任务拆解能力",
      "sourceId": "counterintuitive",
      "sourceName": "反常识型",
      "sourceDesc": "推翻流行说法，形成可传播判断",
      "type": "boss_decision_topic",
      "title": "Rocket Close：老板真正该买的不是工具，是任务拆解能力",
      "spreadTitle": "Rocket Close：老板真正该买的不是工具，是任务拆解能力",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "反常识点在于：AI 越强，越不是所有人都被替代，而是会拆任务、会验收结果的人更值钱。",
      "relevance": "Rocket Close 利用 AWS 的 Agentic AI 能力优化产权保险运营流程，显著提升了 title operations 的效率。这是 AWS 生态中 Agentic AI 落地的代表性案例。；社群里“21岁休学创业，累计营收70w+，这个05后凭什么？”的讨论也在提醒老板，问题不再只是怎么做。",
      "bossPain": "工具买了一堆，员工不会拆任务；老板看到结果差，最后误判 AI 不行。",
      "moneyLine": "工具是支出，任务拆解和验收标准是资产。支出会过期，资产能复用。",
      "oldFrame": "追最新 AI 工具。",
      "newFrame": "先沉淀任务、语料、步骤和验收标准，再让 AI 接手。",
      "actionHint": "今天先选一个业务动作，写清输入、步骤、验收标准，再接任何 AI 工具。",
      "evidence": "Rocket Close 用 Agentic AI 优化产权运营：AWS 实践案例；为什么AI没有取代软件工程师，也不会；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A04",
            "title": "Rocket Close 用 Agentic AI 优化产权运营：AWS 实践案例",
            "source": "aws.amazon.com",
            "url": "https://aws.amazon.com/blogs/machine-learning/building-supercharger-how-rocket-close-optimized-title-operations-with-agentic-ai/",
            "note": "Rocket Close 利用 AWS 的 Agentic AI 能力优化产权保险运营流程，显著提升了 title operations 的效率。这是 AWS 生态中 Agentic AI 落地的代表性案例。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://simonwillison.net/2026/Jun/14/why-ai-hasnt-replaced-software-engineers/#atom-everything",
            "title": "为什么AI没有取代软件工程师，也不会",
            "source": "Simon Willison's Blog",
            "url": "https://simonwillison.net/2026/Jun/14/why-ai-hasnt-replaced-software-engineers/#atom-everything",
            "note": "为什么AI没有取代软件工程师，也不会"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "a9315999e72ca3",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/14422458288281442",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "aws.amazon.com",
      "url": "https://aws.amazon.com/blogs/machine-learning/building-supercharger-how-rocket-close-optimized-title-operations-with-agentic-ai/",
      "date": "2026-06-15",
      "score": 95,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 24,
        "moneyRelation": 23,
        "talkability": 18,
        "spreadability": 15,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "先打脸工具崇拜",
          "note": "开头写：买工具不是 AI 转型，能稳定交付结果才算。"
        },
        {
          "title": "中段讲任务拆解",
          "note": "把提示词、流程、知识库和验收标准放在同一张图里讲。"
        },
        {
          "title": "结尾给金句",
          "note": "AI 工具不是资产，能反复跑通的任务系统才是资产。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "big_small_contrast-willow-7m融资-普通老板该看见哪层机会",
      "sourceId": "big_small_contrast",
      "sourceName": "大小对照型",
      "sourceDesc": "大融资对照小生意，大模型对照小岗位",
      "type": "boss_decision_topic",
      "title": "Willow $7M融资：普通老板该看见哪层机会？",
      "spreadTitle": "Willow $7M融资：普通老板该看见哪层机会？",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "大新闻负责告诉你资本往哪里押，小机会负责告诉你老板明天愿意为什么付钱。",
      "relevance": "Willow 获得$7M 融资，公开资料显示资金继续流向 AI 产品化和企业采用环节。；同时社群里的“这篇产品调研干货：帮你避开90%独立开发者起步坑”说明一线需求还在配置、流程和交付。",
      "bossPain": "老板看不懂大融资，但能理解谁帮他把一个具体业务动作跑起来。",
      "moneyLine": "大公司赚基础设施的钱，小服务商赚落地第一公里的钱。",
      "oldFrame": "AI 创业只能跟大模型和融资有关。",
      "newFrame": "普通人的 AI 机会在帮老板跨过配置、流程和交付门槛。",
      "actionHint": "把服务产品化：诊断一个流程、配置一套工具、交付一个可复用动作。",
      "evidence": "Willow 融资 $7M；欢迎来到AI治理的AGI时代；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A01",
            "title": "Willow 融资 $7M",
            "source": "prnewswire.com",
            "url": "https://www.prnewswire.com/il/news-releases/willow-raises-7m-seed-to-ensure-enterprises-can-fully-oversee-and-govern-autonomous-agents-302791492.html",
            "note": "Willow 获得$7M 融资，公开资料显示资金继续流向 AI 产品化和企业采用环节。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.interconnects.ai/p/welcome-to-the-agi-era-of-ai-governance",
            "title": "欢迎来到AI治理的AGI时代",
            "source": "Interconnects (Nathan Lambert)",
            "url": "https://www.interconnects.ai/p/welcome-to-the-agi-era-of-ai-governance",
            "note": "欢迎来到AI治理的AGI时代"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "420298a9897e36",
            "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224182115441",
            "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
          }
        ]
      },
      "source": "prnewswire.com",
      "url": "https://www.prnewswire.com/il/news-releases/willow-raises-7m-seed-to-ensure-enterprises-can-fully-oversee-and-govern-autonomous-agents-302791492.html",
      "date": "2026-06-15",
      "score": 93,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 21,
        "moneyRelation": 24,
        "talkability": 20,
        "spreadability": 15,
        "actionability": 8,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用大钱和小钱制造冲突",
          "note": "大融资负责制造注意力，小服务负责让老板觉得和自己有关。"
        },
        {
          "title": "写出两套赚钱逻辑",
          "note": "资本逻辑：长期技术押注；服务逻辑：帮老板完成第一公里。"
        },
        {
          "title": "落到可卖服务包",
          "note": "流程诊断、工具配置、知识库搭建、首个工作流，这是老板可理解的产品。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "person_story-从普通人赚-1000-万-到-rocket-close-有场景的-ai-故事更容易被老板转发",
      "sourceId": "person_story",
      "sourceName": "人物故事型",
      "sourceDesc": "具体人、具体场景、具体结果",
      "type": "boss_decision_topic",
      "title": "从普通人赚 1000 万，到 Rocket Close：有场景的 AI 故事更容易被老板转发",
      "spreadTitle": "从普通人赚 1000 万，到 Rocket Close：有场景的 AI 故事更容易被老板转发",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "人物故事的价值不在鸡汤，而在把一个抽象趋势压缩成老板能看懂的场景、成本和选择。",
      "relevance": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？；这类材料适合做传播入口，再回到老板的业务判断。",
      "bossPain": "老板不是不关心 AI，而是不愿意看一篇没有人、没有场景、没有结果的技术说明。",
      "moneyLine": "一个具体人、一件具体事、一个具体结果，比十个工具功能更容易带来咨询和信任。",
      "oldFrame": "写 AI 就要讲技术和趋势。",
      "newFrame": "写给老板的 AI 内容，要先有人、有场景、有结果。",
      "actionHint": "从当天素材里挑一个具体人或具体业务场景，按“处境-动作-结果-老板判断”写。",
      "evidence": "Rocket Close 用 Agentic AI 优化产权运营：AWS 实践案例；为什么AI没有取代软件工程师，也不会；普通人怎么赚到1000万？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A04",
            "title": "Rocket Close 用 Agentic AI 优化产权运营：AWS 实践案例",
            "source": "aws.amazon.com",
            "url": "https://aws.amazon.com/blogs/machine-learning/building-supercharger-how-rocket-close-optimized-title-operations-with-agentic-ai/",
            "note": "Rocket Close 利用 AWS 的 Agentic AI 能力优化产权保险运营流程，显著提升了 title operations 的效率。这是 AWS 生态中 Agentic AI 落地的代表性案例。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://simonwillison.net/2026/Jun/14/why-ai-hasnt-replaced-software-engineers/#atom-everything",
            "title": "为什么AI没有取代软件工程师，也不会",
            "source": "Simon Willison's Blog",
            "url": "https://simonwillison.net/2026/Jun/14/why-ai-hasnt-replaced-software-engineers/#atom-everything",
            "note": "为什么AI没有取代软件工程师，也不会"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "596fa19ea0f6a0",
            "title": "普通人怎么赚到1000万？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/45544554452482458",
            "note": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？"
          }
        ]
      },
      "source": "aws.amazon.com",
      "url": "https://aws.amazon.com/blogs/machine-learning/building-supercharger-how-rocket-close-optimized-title-operations-with-agentic-ai/",
      "date": "2026-06-15",
      "score": 92,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 23,
        "moneyRelation": 21,
        "talkability": 20,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用人物场景开头",
          "note": "不要先讲 AI 趋势，先讲 普通人怎么赚到1000万？ 这类具体处境。"
        },
        {
          "title": "把故事转成商业判断",
          "note": "重点不是感动，而是这个故事说明老板该改哪个流程、补哪个能力。"
        },
        {
          "title": "结尾回到老板动作",
          "note": "让老板知道明天可以拿哪个人、哪个岗位、哪个场景做试点。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "peer_pressure-从公众号新人-30-天变现-到-google-搜索-同行压力不在技术-在速度",
      "sourceId": "peer_pressure",
      "sourceName": "同行压力型",
      "sourceDesc": "同行已做、对手先跑、老板焦虑",
      "type": "boss_decision_topic",
      "title": "从公众号新人 30 天变现，到 Google 搜索：同行压力不在技术，在速度",
      "spreadTitle": "从公众号新人 30 天变现，到 Google 搜索：同行压力不在技术，在速度",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "最能触发老板的不是技术解释，而是别人已经把 AI 用到获客、内容、交付、产品试错里，并且开始看到结果。",
      "relevance": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌；这类社群信号代表一线老板和操盘手已经在算产出。",
      "bossPain": "当同行用 AI 降低试错成本时，你还在用人工流程慢慢排队。",
      "moneyLine": "同行压力真正影响的是获客成本、内容成本和试错周期，而不是老板的技术焦虑。",
      "oldFrame": "AI 是员工自己研究的新工具。",
      "newFrame": "AI 是同行正在重做经营速度的生产系统。",
      "actionHint": "每周只问团队一个问题：同行哪一个动作已经被 AI 缩短了，我们要不要跟？",
      "evidence": "Google 如何用 AI 重塑搜索；为什么AI没有取代软件工程师，也不会；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A09",
            "title": "Google 如何用 AI 重塑搜索",
            "source": "Bloomberg：Technology（RSS）",
            "url": "https://www.bloomberg.com/news/videos/2026-06-14/how-google-is-reinventing-search-with-ai-video",
            "note": "Google 对其搜索引擎进行 20 多年来最大变革，将 AI 生成的答案、对话式搜索和推理工具直接集成到核心搜索产品中。高级副总裁 Nick Fox 认为，AI 允许用户提出更复杂的问题并得到更快、更有用的答案，同时仍连接人们与网络内容。但对创作者和出版商而言，更少的键盘敲击可能带来影响。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://simonwillison.net/2026/Jun/14/why-ai-hasnt-replaced-software-engineers/#atom-everything",
            "title": "为什么AI没有取代软件工程师，也不会",
            "source": "Simon Willison's Blog",
            "url": "https://simonwillison.net/2026/Jun/14/why-ai-hasnt-replaced-software-engineers/#atom-everything",
            "note": "为什么AI没有取代软件工程师，也不会"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "ac2d9cbae4815c",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "Bloomberg：Technology（RSS）",
      "url": "https://www.bloomberg.com/news/videos/2026-06-14/how-google-is-reinventing-search-with-ai-video",
      "date": "2026-06-15",
      "score": 91,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 22,
        "moneyRelation": 22,
        "talkability": 19,
        "spreadability": 15,
        "actionability": 8,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用同行压力开头",
          "note": "标题和开头都不要讲 AI 多强，要讲别人已经开始用 AI 跑出结果。"
        },
        {
          "title": "拆获客、交付、产品三个场景",
          "note": "每个场景只写一个真实动作，避免变成工具列表。"
        },
        {
          "title": "落到老板的例会问题",
          "note": "建议老板每周让团队汇报一个被 AI 缩短的动作，而不是汇报又试了什么工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "save_headcount-rippling-别急着裁员-先少招重复岗位",
      "sourceId": "save_headcount",
      "sourceName": "省人型",
      "sourceDesc": "少招人、少返工、少加班",
      "type": "boss_decision_topic",
      "title": "Rippling：别急着裁员，先少招重复岗位",
      "spreadTitle": "Rippling：别急着裁员，先少招重复岗位",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "AI 进入企业的第一步，不是替代一个完整的人，而是接住岗位里反复发生、规则清楚、结果可验收的动作。",
      "relevance": "Rippling 借助 LangChain 的 Deep Agents 和 LangSmith 平台，在 6 个月内将 AI 能力整合到所有产品线中，实现企业级 AI 原生转型。这是 LangChain 生态在企业落地中的重要参考案例。；这类信号比“AI 很强”更接近老板的组织账。",
      "bossPain": "人越招越多，流程没有变短，管理成本反而被重复动作拖住。",
      "moneyLine": "少招一个重复岗位，或让一个岗位少返工 30%，老板才会觉得 AI 是投入，不是玩具。",
      "oldFrame": "AI 上线就是裁员。",
      "newFrame": "AI 上线的第一阶段，是把岗位动作拆小，让公司少招重复岗位。",
      "actionHint": "选一个岗位，列出每天重复最多的 5 个动作，先交给 AI 试跑其中 1 个。",
      "evidence": "Rippling 用 Deep Agents 和 LangSmith 在 6 个月内全面落地 AI；欢迎来到AI治理的AGI时代；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A03",
            "title": "Rippling 用 Deep Agents 和 LangSmith 在 6 个月内全面落地 AI",
            "source": "langchain.com",
            "url": "https://www.langchain.com/blog/how-rippling-went-ai-native-across-every-product-in-6-months-with-deep-agents-and-langsmith",
            "note": "Rippling 借助 LangChain 的 Deep Agents 和 LangSmith 平台，在 6 个月内将 AI 能力整合到所有产品线中，实现企业级 AI 原生转型。这是 LangChain 生态在企业落地中的重要参考案例。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.interconnects.ai/p/welcome-to-the-agi-era-of-ai-governance",
            "title": "欢迎来到AI治理的AGI时代",
            "source": "Interconnects (Nathan Lambert)",
            "url": "https://www.interconnects.ai/p/welcome-to-the-agi-era-of-ai-governance",
            "note": "欢迎来到AI治理的AGI时代"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "a9315999e72ca3",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/14422458288281442",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "langchain.com",
      "url": "https://www.langchain.com/blog/how-rippling-went-ai-native-across-every-product-in-6-months-with-deep-agents-and-langsmith",
      "date": "2026-06-15",
      "score": 90,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 23,
        "moneyRelation": 23,
        "talkability": 16,
        "spreadability": 13,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用岗位动作替代岗位名称",
          "note": "不要写 AI 替代某个人，写 AI 先替代接听、归档、质检、催办、汇总这类动作。"
        },
        {
          "title": "把省人写成管理账",
          "note": "老板关心的不是炫技，是少招人、少返工、少培训。"
        },
        {
          "title": "给一个当天可做的小动作",
          "note": "用 Rippling 用 Deep Agents 和 … 做例子，把大流程拆成一个可验收动作。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "pitfall-ai-幻觉罚单-老板先补责任边界",
      "sourceId": "pitfall",
      "sourceName": "避坑型",
      "sourceDesc": "工具乱买、权限失控、流程没拆",
      "type": "boss_decision_topic",
      "title": "AI 幻觉罚单：老板先补责任边界",
      "spreadTitle": "AI 幻觉罚单：老板先补责任边界",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "AI 从生成内容走向执行动作后，企业问题从“会不会用”变成“谁审核、谁授权、谁负责”。",
      "relevance": "韩国法院行政处推动修订法案，计划对提交虚假法条和判例的律师处以罚款。因 AI 大模型产生幻觉，律师在法律文书中引用不存在的\"虚假判例\"现象激增，首尔、大邱、蔚山等多地法院出现典型案例，有律师承认使用谷歌 Gemini 检索后未核对内容。今…；这类信号适合写给老板看，因为它直接关系到业务风险。",
      "bossPain": "AI 一旦能读文件、写内容、调工具、改数据，错误就不只是内容不好，而可能变成业务事故。",
      "moneyLine": "权限没管住，省下的人力钱可能被一次合规、法务或数据事故吃掉。",
      "oldFrame": "AI 越自主越好。",
      "newFrame": "AI 越自主，越要先设计权限、复核和责任人。",
      "actionHint": "先把 AI 员工分成三级：只读、建议、可执行；每一级都写清谁复核。",
      "evidence": "AI 幻觉让法官头疼，韩国计划向滥用 AI 的律师开罚单；欢迎来到AI治理的AGI时代；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260615-A05",
            "title": "AI 幻觉让法官头疼，韩国计划向滥用 AI 的律师开罚单",
            "source": "IT之家（RSS）",
            "url": "https://www.ithome.com/0/964/264.htm",
            "note": "韩国法院行政处推动修订法案，计划对提交虚假法条和判例的律师处以罚款。因 AI 大模型产生幻觉，律师在法律文书中引用不存在的\"虚假判例\"现象激增，首尔、大邱、蔚山等多地法院出现典型案例，有律师承认使用谷歌 Gemini 检索后未核对内容。今年 2 月，韩国司法信息公开门户新增案例编号核验功能，并向法官发放含专用提示词的虚假判例甄别指南。法院行政处获批 161…"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "https://www.interconnects.ai/p/welcome-to-the-agi-era-of-ai-governance",
            "title": "欢迎来到AI治理的AGI时代",
            "source": "Interconnects (Nathan Lambert)",
            "url": "https://www.interconnects.ai/p/welcome-to-the-agi-era-of-ai-governance",
            "note": "欢迎来到AI治理的AGI时代"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "a9315999e72ca3",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/14422458288281442",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "IT之家（RSS）",
      "url": "https://www.ithome.com/0/964/264.htm",
      "date": "2026-06-15",
      "score": 88,
      "grade": "A",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 22,
        "moneyRelation": 21,
        "talkability": 18,
        "spreadability": 13,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "不要写安全科普，写老板责任",
          "note": "老板不关心分类器模型，关心 AI 搞错后谁背锅。"
        },
        {
          "title": "把权限拆成人话",
          "note": "只读、建议、执行三个等级，比讲治理框架更容易传播。"
        },
        {
          "title": "用当天案例推进",
          "note": "用 AI 幻觉让法官头疼，韩国计划向滥用 AI 的律师… 做钩子，落到企业内部的授权和复核表。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "money_leak-gemini-sql-老板先查订单入口有没有漏钱",
      "sourceId": "money_leak",
      "sourceName": "漏钱型",
      "sourceDesc": "订单入口、转化漏斗、线索流失",
      "type": "boss_decision_topic",
      "title": "Gemini-SQL：老板先查订单入口有没有漏钱",
      "spreadTitle": "Gemini-SQL：老板先查订单入口有没有漏钱",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "流量、搜索、来电、表单和私信，本质上都是订单入口。AI 先改变的不是工具栏，而是客户从看见你到联系你的路径。",
      "relevance": "Google Research 推出 Gemini-SQL2，基于 Gemini 3.1 Pro，可将自然语言转换为可执行 SQL 查询。该模型在 BIRD 基准上达到 80.04% 准确率，大幅领先 OpenAI 和 Anthropic…；社群里也出现了“公众号新人30天变现7000+，我是如何用微信贴图…”这类一线反馈。",
      "bossPain": "老板最容易忽略的不是没有用 AI，而是客户已经换了入口，公司还在用旧流程接单。",
      "moneyLine": "先算入口漏损，再算模型能力；能把曝光、咨询、跟进接住，AI 才和收入有关。",
      "oldFrame": "AI 是一个提效工具。",
      "newFrame": "AI 正在改写客户入口，入口漏掉就是收入漏掉。",
      "actionHint": "今天先盘点 3 个入口：搜索入口、内容入口、咨询入口，各看一次转化和跟进断点。",
      "evidence": "Google Research 的 Gemini-SQL2 在 text-to-SQL 基准测试中以大幅优势领先；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A06",
            "title": "Google Research 的 Gemini-SQL2 在 text-to-SQL 基准测试中以大幅优势领先",
            "source": "The Decoder：AI News（RSS）",
            "url": "https://the-decoder.com/google-researchs-gemini-sql2-tops-text-to-sql-benchmarks-by-a-wide-margin",
            "note": "Google Research 推出 Gemini-SQL2，基于 Gemini 3.1 Pro，可将自然语言转换为可执行 SQL 查询。该模型在 BIRD 基准上达到 80.04% 准确率，大幅领先 OpenAI 和 Anthropic。Google 表示该技术将改进其数据服务的自然语言功能。"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "15072bfe84bddc",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "The Decoder：AI News（RSS）",
      "url": "https://the-decoder.com/google-researchs-gemini-sql2-tops-text-to-sql-benchmarks-by-a-wide-margin",
      "date": "2026-06-14",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 25,
        "talkability": 19,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "开头直接问漏钱",
          "note": "不要先讲 Google Research 的 Gemini-… 多新，先问老板：这个入口今天带来多少咨询、漏掉多少跟进？"
        },
        {
          "title": "中段拆入口链路",
          "note": "看见、点击、咨询、记录、跟进、成交，每一步都能放 AI，但先看哪里漏。"
        },
        {
          "title": "结尾落到老板动作",
          "note": "让老板今天就拉一张入口表，而不是收藏一堆工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "small_role-ai-报告翻车-小公司先做一个小岗位-ai-员工",
      "sourceId": "small_role",
      "sourceName": "小岗位型",
      "sourceDesc": "客服、销售、财务、标书、运营",
      "type": "boss_decision_topic",
      "title": "AI 报告翻车：小公司先做一个小岗位 AI 员工",
      "spreadTitle": "AI 报告翻车：小公司先做一个小岗位 AI 员工",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "普通老板和服务商的机会，不在宏大平台，而在一个具体岗位、一个明确动作、一个可验收结果里。",
      "relevance": "毕马威去年10月发布的AI报告被指由AI生成，充斥幻觉。GPTZero检测发现，45条引文中仅5条准确对应真实来源，28条对真实标题改写或添加不存在内容，约一半主张存在虚假。例如，阿联酋航空的Sara被描述为可更改航班的AI聊天机器人，实…；这类材料说明岗位级 AI 比大而全平台更容易落地。",
      "bossPain": "老板最怕 AI 项目太大、太贵、太慢，最后没人用。",
      "moneyLine": "一个岗位先打穿，比一个平台讲 100 个功能更容易收钱，也更容易复购。",
      "oldFrame": "做一个什么都能干的 AI 平台。",
      "newFrame": "做一个只干一件事但能交付的小岗位 AI 员工。",
      "actionHint": "先从客服、销售跟进、内容分发、资料整理、流程复核里选一个岗位动作。",
      "evidence": "毕马威AI报告被指由AI生成：引文45条仅5条准确，多处案例不实；Claude Fable 5 在 FrontierMath 最难题目上超越 GPT-5.5 13 个百分点；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A04",
            "title": "毕马威AI报告被指由AI生成：引文45条仅5条准确，多处案例不实",
            "source": "IT之家（RSS）",
            "url": "https://www.ithome.com/0/963/986.htm",
            "note": "毕马威去年10月发布的AI报告被指由AI生成，充斥幻觉。GPTZero检测发现，45条引文中仅5条准确对应真实来源，28条对真实标题改写或添加不存在内容，约一半主张存在虚假。例如，阿联酋航空的Sara被描述为可更改航班的AI聊天机器人，实为移动助手；瑞银被指全面整合智能体，瑞银回应\"与事实不符\"；瑞士联邦铁路SBB被称拥有AI智能体，SBB发言人表示\"不准…"
          },
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A11",
            "title": "Claude Fable 5 在 FrontierMath 最难题目上超越 GPT-5.5 13 个百分点",
            "source": "The Decoder：AI News（RSS）",
            "url": "https://the-decoder.com/claude-fable-5-outpaces-gpt-5-5-by-13-points-on-frontiermaths-toughest-problems",
            "note": "Anthropic 的 Claude Fable 5 在 FrontierMath 最困难级别上达到 88% 准确率，远超 OpenAI 的 GPT-5.5（约 75%），领先 13 个百分点。相较于 2026 年初 Opus 4.5 不到 10% 的表现，实现巨大飞跃。AI 数学推理能力的进步速度持续加快。"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "612e15d1d9f810",
            "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
            "source": "生财有术",
            "url": "https://scys.com/",
            "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
          }
        ]
      },
      "source": "IT之家（RSS）",
      "url": "https://www.ithome.com/0/963/986.htm",
      "date": "2026-06-14",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 24,
        "talkability": 18,
        "spreadability": 15,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用小岗位对抗大平台",
          "note": "这是最适合你现有表达的主线：不做大而全，先做小而深。"
        },
        {
          "title": "每个岗位给一个可验收结果",
          "note": "客服看接通率，销售看跟进率，内容看线索，流程看错误率。"
        },
        {
          "title": "避免写成创业方向清单",
          "note": "要写一个岗位打穿逻辑，不要罗列 10 个机会。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "counterintuitive-地产设计-ai-agent-老板真正该买的不是工具-是任务拆解能力",
      "sourceId": "counterintuitive",
      "sourceName": "反常识型",
      "sourceDesc": "推翻流行说法，形成可传播判断",
      "type": "boss_decision_topic",
      "title": "地产设计 AI Agent：老板真正该买的不是工具，是任务拆解能力",
      "spreadTitle": "地产设计 AI Agent：老板真正该买的不是工具，是任务拆解能力",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "反常识点在于：AI 越强，越不是所有人都被替代，而是会拆任务、会验收结果的人更值钱。",
      "relevance": "How to Build a SaaS Product with AI Agents 案例：AI 进入地产开发和建筑设计流程；社群里“21岁休学创业，累计营收70w+，这个05后凭什么？”的讨论也在提醒老板，问题不再只是怎么做。",
      "bossPain": "工具买了一堆，员工不会拆任务；老板看到结果差，最后误判 AI 不行。",
      "moneyLine": "工具是支出，任务拆解和验收标准是资产。支出会过期，资产能复用。",
      "oldFrame": "追最新 AI 工具。",
      "newFrame": "先沉淀任务、语料、步骤和验收标准，再让 AI 接手。",
      "actionHint": "今天先选一个业务动作，写清输入、步骤、验收标准，再接任何 AI 工具。",
      "evidence": "MindStudio：用 AI Agent 构建地产开发与建筑设计 SaaS 产品；嗨，我是Tibo ，我刚刚发现了Codex。AMA；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A08",
            "title": "MindStudio：用 AI Agent 构建地产开发与建筑设计 SaaS 产品",
            "source": "mindstudio.ai",
            "url": "https://www.mindstudio.ai/blog/build-saas-with-ai-agents-1m-arr-case-study",
            "note": "How to Build a SaaS Product with AI Agents 案例：AI 进入地产开发和建筑设计流程"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2066022651760721931",
            "title": "嗨，我是Tibo ，我刚刚发现了Codex。AMA",
            "source": "Thibault Sottiaux",
            "url": "https://x.com/thsottiaux/status/2066022651760721931",
            "note": "嗨，我是Tibo ，我刚刚发现了Codex。AMA"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "9319cbd9572bc9",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/index",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "mindstudio.ai",
      "url": "https://www.mindstudio.ai/blog/build-saas-with-ai-agents-1m-arr-case-study",
      "date": "2026-06-14",
      "score": 95,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 24,
        "moneyRelation": 23,
        "talkability": 18,
        "spreadability": 15,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "先打脸工具崇拜",
          "note": "开头写：买工具不是 AI 转型，能稳定交付结果才算。"
        },
        {
          "title": "中段讲任务拆解",
          "note": "把提示词、流程、知识库和验收标准放在同一张图里讲。"
        },
        {
          "title": "结尾给金句",
          "note": "AI 工具不是资产，能反复跑通的任务系统才是资产。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "big_small_contrast-jedify-24m融资-普通老板该看见哪层机会",
      "sourceId": "big_small_contrast",
      "sourceName": "大小对照型",
      "sourceDesc": "大融资对照小生意，大模型对照小岗位",
      "type": "boss_decision_topic",
      "title": "Jedify $24M融资：普通老板该看见哪层机会？",
      "spreadTitle": "Jedify $24M融资：普通老板该看见哪层机会？",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "大新闻负责告诉你资本往哪里押，小机会负责告诉你老板明天愿意为什么付钱。",
      "relevance": "Jedify 获得$24M 融资，押注销售线索和收入团队协作；同时社群里的“这篇产品调研干货：帮你避开90%独立开发者起步坑”说明一线需求还在配置、流程和交付。",
      "bossPain": "老板看不懂大融资，但能理解谁帮他把一个具体业务动作跑起来。",
      "moneyLine": "大公司赚基础设施的钱，小服务商赚落地第一公里的钱。",
      "oldFrame": "AI 创业只能跟大模型和融资有关。",
      "newFrame": "普通人的 AI 机会在帮老板跨过配置、流程和交付门槛。",
      "actionHint": "把服务产品化：诊断一个流程、配置一套工具、交付一个可复用动作。",
      "evidence": "Jedify 获得$24M 融资，押注销售线索和收入团队协作；感觉我们变得精神错乱了。这里的终局是更大的。；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A01",
            "title": "Jedify 获得$24M 融资，押注销售线索和收入团队协作",
            "source": "instagram.com",
            "url": "https://www.instagram.com/p/DZaq23zCT9J/",
            "note": "Jedify 获得$24M 融资，押注销售线索和收入团队协作"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065838585358745653",
            "title": "感觉我们变得精神错乱了。这里的终局是更大的。",
            "source": "Amjad Masad",
            "url": "https://x.com/amasad/status/2065838585358745653",
            "note": "感觉我们变得精神错乱了。这里的终局是更大的。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "612e15d1d9f810",
            "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
            "source": "生财有术",
            "url": "https://scys.com/",
            "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
          }
        ]
      },
      "source": "instagram.com",
      "url": "https://www.instagram.com/p/DZaq23zCT9J/",
      "date": "2026-06-14",
      "score": 93,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 21,
        "moneyRelation": 24,
        "talkability": 20,
        "spreadability": 15,
        "actionability": 8,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用大钱和小钱制造冲突",
          "note": "大融资负责制造注意力，小服务负责让老板觉得和自己有关。"
        },
        {
          "title": "写出两套赚钱逻辑",
          "note": "资本逻辑：长期技术押注；服务逻辑：帮老板完成第一公里。"
        },
        {
          "title": "落到可卖服务包",
          "note": "流程诊断、工具配置、知识库搭建、首个工作流，这是老板可理解的产品。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "person_story-从普通人赚-1000-万-到-ai-报告翻车-有场景的-ai-故事更容易被老板转发",
      "sourceId": "person_story",
      "sourceName": "人物故事型",
      "sourceDesc": "具体人、具体场景、具体结果",
      "type": "boss_decision_topic",
      "title": "从普通人赚 1000 万，到 AI 报告翻车：有场景的 AI 故事更容易被老板转发",
      "spreadTitle": "从普通人赚 1000 万，到 AI 报告翻车：有场景的 AI 故事更容易被老板转发",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "人物故事的价值不在鸡汤，而在把一个抽象趋势压缩成老板能看懂的场景、成本和选择。",
      "relevance": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？；这类材料适合做传播入口，再回到老板的业务判断。",
      "bossPain": "老板不是不关心 AI，而是不愿意看一篇没有人、没有场景、没有结果的技术说明。",
      "moneyLine": "一个具体人、一件具体事、一个具体结果，比十个工具功能更容易带来咨询和信任。",
      "oldFrame": "写 AI 就要讲技术和趋势。",
      "newFrame": "写给老板的 AI 内容，要先有人、有场景、有结果。",
      "actionHint": "从当天素材里挑一个具体人或具体业务场景，按“处境-动作-结果-老板判断”写。",
      "evidence": "MindStudio：用 AI Agent 构建地产开发与建筑设计 SaaS 产品；嗨，我是Tibo ，我刚刚发现了Codex。AMA；普通人怎么赚到1000万？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A08",
            "title": "MindStudio：用 AI Agent 构建地产开发与建筑设计 SaaS 产品",
            "source": "mindstudio.ai",
            "url": "https://www.mindstudio.ai/blog/build-saas-with-ai-agents-1m-arr-case-study",
            "note": "How to Build a SaaS Product with AI Agents 案例：AI 进入地产开发和建筑设计流程"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2066022651760721931",
            "title": "嗨，我是Tibo ，我刚刚发现了Codex。AMA",
            "source": "Thibault Sottiaux",
            "url": "https://x.com/thsottiaux/status/2066022651760721931",
            "note": "嗨，我是Tibo ，我刚刚发现了Codex。AMA"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "45c0347f0a654e",
            "title": "普通人怎么赚到1000万？",
            "source": "AI破局",
            "url": "https://aipoju.com/index",
            "note": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？"
          }
        ]
      },
      "source": "mindstudio.ai",
      "url": "https://www.mindstudio.ai/blog/build-saas-with-ai-agents-1m-arr-case-study",
      "date": "2026-06-14",
      "score": 92,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 23,
        "moneyRelation": 21,
        "talkability": 20,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用人物场景开头",
          "note": "不要先讲 AI 趋势，先讲 普通人怎么赚到1000万？ 这类具体处境。"
        },
        {
          "title": "把故事转成商业判断",
          "note": "重点不是感动，而是这个故事说明老板该改哪个流程、补哪个能力。"
        },
        {
          "title": "结尾回到老板动作",
          "note": "让老板知道明天可以拿哪个人、哪个岗位、哪个场景做试点。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "peer_pressure-从公众号新人-30-天变现-到-gemini-sql-同行压力不在技术-在速度",
      "sourceId": "peer_pressure",
      "sourceName": "同行压力型",
      "sourceDesc": "同行已做、对手先跑、老板焦虑",
      "type": "boss_decision_topic",
      "title": "从公众号新人 30 天变现，到 Gemini-SQL：同行压力不在技术，在速度",
      "spreadTitle": "从公众号新人 30 天变现，到 Gemini-SQL：同行压力不在技术，在速度",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "最能触发老板的不是技术解释，而是别人已经把 AI 用到获客、内容、交付、产品试错里，并且开始看到结果。",
      "relevance": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌；这类社群信号代表一线老板和操盘手已经在算产出。",
      "bossPain": "当同行用 AI 降低试错成本时，你还在用人工流程慢慢排队。",
      "moneyLine": "同行压力真正影响的是获客成本、内容成本和试错周期，而不是老板的技术焦虑。",
      "oldFrame": "AI 是员工自己研究的新工具。",
      "newFrame": "AI 是同行正在重做经营速度的生产系统。",
      "actionHint": "每周只问团队一个问题：同行哪一个动作已经被 AI 缩短了，我们要不要跟？",
      "evidence": "Google Research 的 Gemini-SQL2 在 text-to-SQL 基准测试中以大幅优势领先；嗨，我是Tibo ，我刚刚发现了Codex。AMA；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A06",
            "title": "Google Research 的 Gemini-SQL2 在 text-to-SQL 基准测试中以大幅优势领先",
            "source": "The Decoder：AI News（RSS）",
            "url": "https://the-decoder.com/google-researchs-gemini-sql2-tops-text-to-sql-benchmarks-by-a-wide-margin",
            "note": "Google Research 推出 Gemini-SQL2，基于 Gemini 3.1 Pro，可将自然语言转换为可执行 SQL 查询。该模型在 BIRD 基准上达到 80.04% 准确率，大幅领先 OpenAI 和 Anthropic。Google 表示该技术将改进其数据服务的自然语言功能。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2066022651760721931",
            "title": "嗨，我是Tibo ，我刚刚发现了Codex。AMA",
            "source": "Thibault Sottiaux",
            "url": "https://x.com/thsottiaux/status/2066022651760721931",
            "note": "嗨，我是Tibo ，我刚刚发现了Codex。AMA"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "15072bfe84bddc",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "The Decoder：AI News（RSS）",
      "url": "https://the-decoder.com/google-researchs-gemini-sql2-tops-text-to-sql-benchmarks-by-a-wide-margin",
      "date": "2026-06-14",
      "score": 91,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 22,
        "moneyRelation": 22,
        "talkability": 19,
        "spreadability": 15,
        "actionability": 8,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用同行压力开头",
          "note": "标题和开头都不要讲 AI 多强，要讲别人已经开始用 AI 跑出结果。"
        },
        {
          "title": "拆获客、交付、产品三个场景",
          "note": "每个场景只写一个真实动作，避免变成工具列表。"
        },
        {
          "title": "落到老板的例会问题",
          "note": "建议老板每周让团队汇报一个被 AI 缩短的动作，而不是汇报又试了什么工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "save_headcount-claude-fable-别急着裁员-先少招重复岗位",
      "sourceId": "save_headcount",
      "sourceName": "省人型",
      "sourceDesc": "少招人、少返工、少加班",
      "type": "boss_decision_topic",
      "title": "Claude Fable：别急着裁员，先少招重复岗位",
      "spreadTitle": "Claude Fable：别急着裁员，先少招重复岗位",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "AI 进入企业的第一步，不是替代一个完整的人，而是接住岗位里反复发生、规则清楚、结果可验收的动作。",
      "relevance": "Anthropic 的 Claude Fable 5 在 FrontierMath 最困难级别上达到 88% 准确率，远超 OpenAI 的 GPT-5.5（约 75%），领先 13 个百分点。相较于 2026 年初 Opus 4.5 不…；这类信号比“AI 很强”更接近老板的组织账。",
      "bossPain": "人越招越多，流程没有变短，管理成本反而被重复动作拖住。",
      "moneyLine": "少招一个重复岗位，或让一个岗位少返工 30%，老板才会觉得 AI 是投入，不是玩具。",
      "oldFrame": "AI 上线就是裁员。",
      "newFrame": "AI 上线的第一阶段，是把岗位动作拆小，让公司少招重复岗位。",
      "actionHint": "选一个岗位，列出每天重复最多的 5 个动作，先交给 AI 试跑其中 1 个。",
      "evidence": "Claude Fable 5 在 FrontierMath 最难题目上超越 GPT-5.5 13 个百分点；感觉我们变得精神错乱了。这里的终局是更大的。；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A11",
            "title": "Claude Fable 5 在 FrontierMath 最难题目上超越 GPT-5.5 13 个百分点",
            "source": "The Decoder：AI News（RSS）",
            "url": "https://the-decoder.com/claude-fable-5-outpaces-gpt-5-5-by-13-points-on-frontiermaths-toughest-problems",
            "note": "Anthropic 的 Claude Fable 5 在 FrontierMath 最困难级别上达到 88% 准确率，远超 OpenAI 的 GPT-5.5（约 75%），领先 13 个百分点。相较于 2026 年初 Opus 4.5 不到 10% 的表现，实现巨大飞跃。AI 数学推理能力的进步速度持续加快。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065838585358745653",
            "title": "感觉我们变得精神错乱了。这里的终局是更大的。",
            "source": "Amjad Masad",
            "url": "https://x.com/amasad/status/2065838585358745653",
            "note": "感觉我们变得精神错乱了。这里的终局是更大的。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "9319cbd9572bc9",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/index",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "The Decoder：AI News（RSS）",
      "url": "https://the-decoder.com/claude-fable-5-outpaces-gpt-5-5-by-13-points-on-frontiermaths-toughest-problems",
      "date": "2026-06-14",
      "score": 90,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 23,
        "moneyRelation": 23,
        "talkability": 16,
        "spreadability": 13,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用岗位动作替代岗位名称",
          "note": "不要写 AI 替代某个人，写 AI 先替代接听、归档、质检、催办、汇总这类动作。"
        },
        {
          "title": "把省人写成管理账",
          "note": "老板关心的不是炫技，是少招人、少返工、少培训。"
        },
        {
          "title": "给一个当天可做的小动作",
          "note": "用 Claude Fable 5 在 Frontier… 做例子，把大流程拆成一个可验收动作。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "pitfall-claude-fable-老板先补责任边界",
      "sourceId": "pitfall",
      "sourceName": "避坑型",
      "sourceDesc": "工具乱买、权限失控、流程没拆",
      "type": "boss_decision_topic",
      "title": "Claude Fable：老板先补责任边界",
      "spreadTitle": "Claude Fable：老板先补责任边界",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "AI 从生成内容走向执行动作后，企业问题从“会不会用”变成“谁审核、谁授权、谁负责”。",
      "relevance": "Anthropic 的 Claude Fable 5 在 FrontierMath 最困难级别上达到 88% 准确率，远超 OpenAI 的 GPT-5.5（约 75%），领先 13 个百分点。相较于 2026 年初 Opus 4.5 不…；这类信号适合写给老板看，因为它直接关系到业务风险。",
      "bossPain": "AI 一旦能读文件、写内容、调工具、改数据，错误就不只是内容不好，而可能变成业务事故。",
      "moneyLine": "权限没管住，省下的人力钱可能被一次合规、法务或数据事故吃掉。",
      "oldFrame": "AI 越自主越好。",
      "newFrame": "AI 越自主，越要先设计权限、复核和责任人。",
      "actionHint": "先把 AI 员工分成三级：只读、建议、可执行；每一级都写清谁复核。",
      "evidence": "Claude Fable 5 在 FrontierMath 最难题目上超越 GPT-5.5 13 个百分点；感觉我们变得精神错乱了。这里的终局是更大的。；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260614-A11",
            "title": "Claude Fable 5 在 FrontierMath 最难题目上超越 GPT-5.5 13 个百分点",
            "source": "The Decoder：AI News（RSS）",
            "url": "https://the-decoder.com/claude-fable-5-outpaces-gpt-5-5-by-13-points-on-frontiermaths-toughest-problems",
            "note": "Anthropic 的 Claude Fable 5 在 FrontierMath 最困难级别上达到 88% 准确率，远超 OpenAI 的 GPT-5.5（约 75%），领先 13 个百分点。相较于 2026 年初 Opus 4.5 不到 10% 的表现，实现巨大飞跃。AI 数学推理能力的进步速度持续加快。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065838585358745653",
            "title": "感觉我们变得精神错乱了。这里的终局是更大的。",
            "source": "Amjad Masad",
            "url": "https://x.com/amasad/status/2065838585358745653",
            "note": "感觉我们变得精神错乱了。这里的终局是更大的。"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "9319cbd9572bc9",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/index",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "The Decoder：AI News（RSS）",
      "url": "https://the-decoder.com/claude-fable-5-outpaces-gpt-5-5-by-13-points-on-frontiermaths-toughest-problems",
      "date": "2026-06-14",
      "score": 88,
      "grade": "A",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 22,
        "moneyRelation": 21,
        "talkability": 18,
        "spreadability": 13,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "不要写安全科普，写老板责任",
          "note": "老板不关心分类器模型，关心 AI 搞错后谁背锅。"
        },
        {
          "title": "把权限拆成人话",
          "note": "只读、建议、执行三个等级，比讲治理框架更容易传播。"
        },
        {
          "title": "用当天案例推进",
          "note": "用 Claude Fable 5 在 Frontier… 做钩子，落到企业内部的授权和复核表。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "money_leak-tcs-claude-老板先查订单入口有没有漏钱",
      "sourceId": "money_leak",
      "sourceName": "漏钱型",
      "sourceDesc": "订单入口、转化漏斗、线索流失",
      "type": "boss_decision_topic",
      "title": "TCS × Claude：老板先查订单入口有没有漏钱",
      "spreadTitle": "TCS × Claude：老板先查订单入口有没有漏钱",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "流量、搜索、来电、表单和私信，本质上都是订单入口。AI 先改变的不是工具栏，而是客户从看见你到联系你的路径。",
      "relevance": "Anthropic宣布与塔塔咨询服务（TCS）合作。TCS将向56个国家的5万名员工提供Claude，并为金融、医疗等受监管行业客户构建基于Claude的产品，同时加入Claude Partner Network。作为\"客户零号\"，TCS…；社群里也出现了“公众号新人30天变现7000+，我是如何用微信贴图…”这类一线反馈。",
      "bossPain": "老板最容易忽略的不是没有用 AI，而是客户已经换了入口，公司还在用旧流程接单。",
      "moneyLine": "先算入口漏损，再算模型能力；能把曝光、咨询、跟进接住，AI 才和收入有关。",
      "oldFrame": "AI 是一个提效工具。",
      "newFrame": "AI 正在改写客户入口，入口漏掉就是收入漏掉。",
      "actionHint": "今天先盘点 3 个入口：搜索入口、内容入口、咨询入口，各看一次转化和跟进断点。",
      "evidence": "TCS与Anthropic合作，将Claude引入受监管行业；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A06",
            "title": "TCS与Anthropic合作，将Claude引入受监管行业",
            "source": "Anthropic：Newsroom（网页）",
            "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
            "note": "Anthropic宣布与塔塔咨询服务（TCS）合作。TCS将向56个国家的5万名员工提供Claude，并为金融、医疗等受监管行业客户构建基于Claude的产品，同时加入Claude Partner Network。作为\"客户零号\"，TCS将在自身工程、财务、法律、营销和销售团队中率先使用Claude，并组建专门团队为客户设计和运维Claude系统。具体用例…"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "ac2d9cbae4815c",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "Anthropic：Newsroom（网页）",
      "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
      "date": "2026-06-13",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 25,
        "talkability": 19,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "开头直接问漏钱",
          "note": "不要先讲 TCS与Anthropic合作，将Claude引入… 多新，先问老板：这个入口今天带来多少咨询、漏掉多少跟进？"
        },
        {
          "title": "中段拆入口链路",
          "note": "看见、点击、咨询、记录、跟进、成交，每一步都能放 AI，但先看哪里漏。"
        },
        {
          "title": "结尾落到老板动作",
          "note": "让老板今天就拉一张入口表，而不是收藏一堆工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "small_role-tcs-claude-小公司先做一个小岗位-ai-员工",
      "sourceId": "small_role",
      "sourceName": "小岗位型",
      "sourceDesc": "客服、销售、财务、标书、运营",
      "type": "boss_decision_topic",
      "title": "TCS × Claude：小公司先做一个小岗位 AI 员工",
      "spreadTitle": "TCS × Claude：小公司先做一个小岗位 AI 员工",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "普通老板和服务商的机会，不在宏大平台，而在一个具体岗位、一个明确动作、一个可验收结果里。",
      "relevance": "Anthropic宣布与塔塔咨询服务（TCS）合作。TCS将向56个国家的5万名员工提供Claude，并为金融、医疗等受监管行业客户构建基于Claude的产品，同时加入Claude Partner Network。作为\"客户零号\"，TCS…；这类材料说明岗位级 AI 比大而全平台更容易落地。",
      "bossPain": "老板最怕 AI 项目太大、太贵、太慢，最后没人用。",
      "moneyLine": "一个岗位先打穿，比一个平台讲 100 个功能更容易收钱，也更容易复购。",
      "oldFrame": "做一个什么都能干的 AI 平台。",
      "newFrame": "做一个只干一件事但能交付的小岗位 AI 员工。",
      "actionHint": "先从客服、销售跟进、内容分发、资料整理、流程复核里选一个岗位动作。",
      "evidence": "TCS与Anthropic合作，将Claude引入受监管行业；TCS与Anthropic合作，将Claude引入受监管行业；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A06",
            "title": "TCS与Anthropic合作，将Claude引入受监管行业",
            "source": "Anthropic：Newsroom（网页）",
            "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
            "note": "Anthropic宣布与塔塔咨询服务（TCS）合作。TCS将向56个国家的5万名员工提供Claude，并为金融、医疗等受监管行业客户构建基于Claude的产品，同时加入Claude Partner Network。作为\"客户零号\"，TCS将在自身工程、财务、法律、营销和销售团队中率先使用Claude，并组建专门团队为客户设计和运维Claude系统。具体用例…"
          },
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A06",
            "title": "TCS与Anthropic合作，将Claude引入受监管行业",
            "source": "Anthropic：Newsroom（网页）",
            "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
            "note": "Anthropic宣布与塔塔咨询服务（TCS）合作。TCS将向56个国家的5万名员工提供Claude，并为金融、医疗等受监管行业客户构建基于Claude的产品，同时加入Claude Partner Network。作为\"客户零号\"，TCS将在自身工程、财务、法律、营销和销售团队中率先使用Claude，并组建专门团队为客户设计和运维Claude系统。具体用例…"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "420298a9897e36",
            "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224182115441",
            "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
          }
        ]
      },
      "source": "Anthropic：Newsroom（网页）",
      "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
      "date": "2026-06-13",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 24,
        "talkability": 18,
        "spreadability": 15,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用小岗位对抗大平台",
          "note": "这是最适合你现有表达的主线：不做大而全，先做小而深。"
        },
        {
          "title": "每个岗位给一个可验收结果",
          "note": "客服看接通率，销售看跟进率，内容看线索，流程看错误率。"
        },
        {
          "title": "避免写成创业方向清单",
          "note": "要写一个岗位打穿逻辑，不要罗列 10 个机会。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "counterintuitive-模型评估工作台-老板真正该买的不是工具-是任务拆解能力",
      "sourceId": "counterintuitive",
      "sourceName": "反常识型",
      "sourceDesc": "推翻流行说法，形成可传播判断",
      "type": "boss_decision_topic",
      "title": "模型评估工作台：老板真正该买的不是工具，是任务拆解能力",
      "spreadTitle": "模型评估工作台：老板真正该买的不是工具，是任务拆解能力",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "反常识点在于：AI 越强，越不是所有人都被替代，而是会拆任务、会验收结果的人更值钱。",
      "relevance": "olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容…；社群里“21岁休学创业，累计营收70w+，这个05后凭什么？”的讨论也在提醒老板，问题不再只是怎么做。",
      "bossPain": "工具买了一堆，员工不会拆任务；老板看到结果差，最后误判 AI 不行。",
      "moneyLine": "工具是支出，任务拆解和验收标准是资产。支出会过期，资产能复用。",
      "oldFrame": "追最新 AI 工具。",
      "newFrame": "先沉淀任务、语料、步骤和验收标准，再让 AI 接手。",
      "actionHint": "今天先选一个业务动作，写清输入、步骤、验收标准，再接任何 AI 工具。",
      "evidence": "olmo-eval：面向模型开发循环的评估工作台；我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A08",
            "title": "olmo-eval：面向模型开发循环的评估工作台",
            "source": "Hugging Face：Blog（RSS）",
            "url": "https://huggingface.co/blog/allenai/olmo-eval",
            "note": "olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应…"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065791421362352476",
            "title": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它",
            "source": "Garry Tan",
            "url": "https://x.com/garrytan/status/2065791421362352476",
            "note": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "a9315999e72ca3",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/14422458288281442",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "Hugging Face：Blog（RSS）",
      "url": "https://huggingface.co/blog/allenai/olmo-eval",
      "date": "2026-06-13",
      "score": 95,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 24,
        "moneyRelation": 23,
        "talkability": 18,
        "spreadability": 15,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "先打脸工具崇拜",
          "note": "开头写：买工具不是 AI 转型，能稳定交付结果才算。"
        },
        {
          "title": "中段讲任务拆解",
          "note": "把提示词、流程、知识库和验收标准放在同一张图里讲。"
        },
        {
          "title": "结尾给金句",
          "note": "AI 工具不是资产，能反复跑通的任务系统才是资产。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "big_small_contrast-mem0-24m融资-普通老板该看见哪层机会",
      "sourceId": "big_small_contrast",
      "sourceName": "大小对照型",
      "sourceDesc": "大融资对照小生意，大模型对照小岗位",
      "type": "boss_decision_topic",
      "title": "Mem0 $24M融资：普通老板该看见哪层机会？",
      "spreadTitle": "Mem0 $24M融资：普通老板该看见哪层机会？",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "大新闻负责告诉你资本往哪里押，小机会负责告诉你老板明天愿意为什么付钱。",
      "relevance": "原始来源标题：Mem0 融资 $24M，用途见原文：Memory Layer for AI Agents。；同时社群里的“这篇产品调研干货：帮你避开90%独立开发者起步坑”说明一线需求还在配置、流程和交付。",
      "bossPain": "老板看不懂大融资，但能理解谁帮他把一个具体业务动作跑起来。",
      "moneyLine": "大公司赚基础设施的钱，小服务商赚落地第一公里的钱。",
      "oldFrame": "AI 创业只能跟大模型和融资有关。",
      "newFrame": "普通人的 AI 机会在帮老板跨过配置、流程和交付门槛。",
      "actionHint": "把服务产品化：诊断一个流程、配置一套工具、交付一个可复用动作。",
      "evidence": "Mem0 融资 $24M；我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A03",
            "title": "Mem0 融资 $24M",
            "source": "prnewswire.com",
            "url": "https://www.prnewswire.com/news-releases/mem0-raises-24m-series-a-to-build-memory-layer-for-ai-agents-302597157.html",
            "note": "原始来源标题：Mem0 融资 $24M，用途见原文：Memory Layer for AI Agents。"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065791421362352476",
            "title": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它",
            "source": "Garry Tan",
            "url": "https://x.com/garrytan/status/2065791421362352476",
            "note": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "420298a9897e36",
            "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224182115441",
            "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
          }
        ]
      },
      "source": "prnewswire.com",
      "url": "https://www.prnewswire.com/news-releases/mem0-raises-24m-series-a-to-build-memory-layer-for-ai-agents-302597157.html",
      "date": "2026-06-13",
      "score": 93,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 21,
        "moneyRelation": 24,
        "talkability": 20,
        "spreadability": 15,
        "actionability": 8,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用大钱和小钱制造冲突",
          "note": "大融资负责制造注意力，小服务负责让老板觉得和自己有关。"
        },
        {
          "title": "写出两套赚钱逻辑",
          "note": "资本逻辑：长期技术押注；服务逻辑：帮老板完成第一公里。"
        },
        {
          "title": "落到可卖服务包",
          "note": "流程诊断、工具配置、知识库搭建、首个工作流，这是老板可理解的产品。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "person_story-从普通人赚-1000-万-到-tcs-claude-有场景的-ai-故事更容易被老板转发",
      "sourceId": "person_story",
      "sourceName": "人物故事型",
      "sourceDesc": "具体人、具体场景、具体结果",
      "type": "boss_decision_topic",
      "title": "从普通人赚 1000 万，到 TCS × Claude：有场景的 AI 故事更容易被老板转发",
      "spreadTitle": "从普通人赚 1000 万，到 TCS × Claude：有场景的 AI 故事更容易被老板转发",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "人物故事的价值不在鸡汤，而在把一个抽象趋势压缩成老板能看懂的场景、成本和选择。",
      "relevance": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？；这类材料适合做传播入口，再回到老板的业务判断。",
      "bossPain": "老板不是不关心 AI，而是不愿意看一篇没有人、没有场景、没有结果的技术说明。",
      "moneyLine": "一个具体人、一件具体事、一个具体结果，比十个工具功能更容易带来咨询和信任。",
      "oldFrame": "写 AI 就要讲技术和趋势。",
      "newFrame": "写给老板的 AI 内容，要先有人、有场景、有结果。",
      "actionHint": "从当天素材里挑一个具体人或具体业务场景，按“处境-动作-结果-老板判断”写。",
      "evidence": "olmo-eval：面向模型开发循环的评估工作台；我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它；普通人怎么赚到1000万？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A08",
            "title": "olmo-eval：面向模型开发循环的评估工作台",
            "source": "Hugging Face：Blog（RSS）",
            "url": "https://huggingface.co/blog/allenai/olmo-eval",
            "note": "olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应…"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065791421362352476",
            "title": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它",
            "source": "Garry Tan",
            "url": "https://x.com/garrytan/status/2065791421362352476",
            "note": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "596fa19ea0f6a0",
            "title": "普通人怎么赚到1000万？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/45544554452482458",
            "note": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？"
          }
        ]
      },
      "source": "Hugging Face：Blog（RSS）",
      "url": "https://huggingface.co/blog/allenai/olmo-eval",
      "date": "2026-06-13",
      "score": 92,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 23,
        "moneyRelation": 21,
        "talkability": 20,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用人物场景开头",
          "note": "不要先讲 AI 趋势，先讲 普通人怎么赚到1000万？ 这类具体处境。"
        },
        {
          "title": "把故事转成商业判断",
          "note": "重点不是感动，而是这个故事说明老板该改哪个流程、补哪个能力。"
        },
        {
          "title": "结尾回到老板动作",
          "note": "让老板知道明天可以拿哪个人、哪个岗位、哪个场景做试点。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "peer_pressure-从公众号新人-30-天变现-到-tcs-claude-同行压力不在技术-在速度",
      "sourceId": "peer_pressure",
      "sourceName": "同行压力型",
      "sourceDesc": "同行已做、对手先跑、老板焦虑",
      "type": "boss_decision_topic",
      "title": "从公众号新人 30 天变现，到 TCS × Claude：同行压力不在技术，在速度",
      "spreadTitle": "从公众号新人 30 天变现，到 TCS × Claude：同行压力不在技术，在速度",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "最能触发老板的不是技术解释，而是别人已经把 AI 用到获客、内容、交付、产品试错里，并且开始看到结果。",
      "relevance": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌；这类社群信号代表一线老板和操盘手已经在算产出。",
      "bossPain": "当同行用 AI 降低试错成本时，你还在用人工流程慢慢排队。",
      "moneyLine": "同行压力真正影响的是获客成本、内容成本和试错周期，而不是老板的技术焦虑。",
      "oldFrame": "AI 是员工自己研究的新工具。",
      "newFrame": "AI 是同行正在重做经营速度的生产系统。",
      "actionHint": "每周只问团队一个问题：同行哪一个动作已经被 AI 缩短了，我们要不要跟？",
      "evidence": "TCS与Anthropic合作，将Claude引入受监管行业；我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A06",
            "title": "TCS与Anthropic合作，将Claude引入受监管行业",
            "source": "Anthropic：Newsroom（网页）",
            "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
            "note": "Anthropic宣布与塔塔咨询服务（TCS）合作。TCS将向56个国家的5万名员工提供Claude，并为金融、医疗等受监管行业客户构建基于Claude的产品，同时加入Claude Partner Network。作为\"客户零号\"，TCS将在自身工程、财务、法律、营销和销售团队中率先使用Claude，并组建专门团队为客户设计和运维Claude系统。具体用例…"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065791421362352476",
            "title": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它",
            "source": "Garry Tan",
            "url": "https://x.com/garrytan/status/2065791421362352476",
            "note": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "ac2d9cbae4815c",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "Anthropic：Newsroom（网页）",
      "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
      "date": "2026-06-13",
      "score": 91,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 22,
        "moneyRelation": 22,
        "talkability": 19,
        "spreadability": 15,
        "actionability": 8,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用同行压力开头",
          "note": "标题和开头都不要讲 AI 多强，要讲别人已经开始用 AI 跑出结果。"
        },
        {
          "title": "拆获客、交付、产品三个场景",
          "note": "每个场景只写一个真实动作，避免变成工具列表。"
        },
        {
          "title": "落到老板的例会问题",
          "note": "建议老板每周让团队汇报一个被 AI 缩短的动作，而不是汇报又试了什么工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "save_headcount-tcs-claude-别急着裁员-先少招重复岗位",
      "sourceId": "save_headcount",
      "sourceName": "省人型",
      "sourceDesc": "少招人、少返工、少加班",
      "type": "boss_decision_topic",
      "title": "TCS × Claude：别急着裁员，先少招重复岗位",
      "spreadTitle": "TCS × Claude：别急着裁员，先少招重复岗位",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "AI 进入企业的第一步，不是替代一个完整的人，而是接住岗位里反复发生、规则清楚、结果可验收的动作。",
      "relevance": "Anthropic宣布与塔塔咨询服务（TCS）合作。TCS将向56个国家的5万名员工提供Claude，并为金融、医疗等受监管行业客户构建基于Claude的产品，同时加入Claude Partner Network。作为\"客户零号\"，TCS…；这类信号比“AI 很强”更接近老板的组织账。",
      "bossPain": "人越招越多，流程没有变短，管理成本反而被重复动作拖住。",
      "moneyLine": "少招一个重复岗位，或让一个岗位少返工 30%，老板才会觉得 AI 是投入，不是玩具。",
      "oldFrame": "AI 上线就是裁员。",
      "newFrame": "AI 上线的第一阶段，是把岗位动作拆小，让公司少招重复岗位。",
      "actionHint": "选一个岗位，列出每天重复最多的 5 个动作，先交给 AI 试跑其中 1 个。",
      "evidence": "TCS与Anthropic合作，将Claude引入受监管行业；我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A06",
            "title": "TCS与Anthropic合作，将Claude引入受监管行业",
            "source": "Anthropic：Newsroom（网页）",
            "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
            "note": "Anthropic宣布与塔塔咨询服务（TCS）合作。TCS将向56个国家的5万名员工提供Claude，并为金融、医疗等受监管行业客户构建基于Claude的产品，同时加入Claude Partner Network。作为\"客户零号\"，TCS将在自身工程、财务、法律、营销和销售团队中率先使用Claude，并组建专门团队为客户设计和运维Claude系统。具体用例…"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065791421362352476",
            "title": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它",
            "source": "Garry Tan",
            "url": "https://x.com/garrytan/status/2065791421362352476",
            "note": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "a9315999e72ca3",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/14422458288281442",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "Anthropic：Newsroom（网页）",
      "url": "https://www.anthropic.com/news/tcs-anthropic-partnership",
      "date": "2026-06-13",
      "score": 90,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 23,
        "moneyRelation": 23,
        "talkability": 16,
        "spreadability": 13,
        "actionability": 10,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "用岗位动作替代岗位名称",
          "note": "不要写 AI 替代某个人，写 AI 先替代接听、归档、质检、催办、汇总这类动作。"
        },
        {
          "title": "把省人写成管理账",
          "note": "老板关心的不是炫技，是少招人、少返工、少培训。"
        },
        {
          "title": "给一个当天可做的小动作",
          "note": "用 TCS与Anthropic合作，将Claude引入… 做例子，把大流程拆成一个可验收动作。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    {
      "id": "pitfall-anthropic-老板先补责任边界",
      "sourceId": "pitfall",
      "sourceName": "避坑型",
      "sourceDesc": "工具乱买、权限失控、流程没拆",
      "type": "boss_decision_topic",
      "title": "Anthropic：老板先补责任边界",
      "spreadTitle": "Anthropic：老板先补责任边界",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "AI 从生成内容走向执行动作后，企业问题从“会不会用”变成“谁审核、谁授权、谁负责”。",
      "relevance": "Anthropic对近5.2万美国人调查显示：48%将治愈癌症等疾病列为首要期望，36%希望AI帮助残障人士。64%担忧AI导致失业，56%担忧认知依赖，52%担忧信息误导。超70%支持政府监管，最关注隐私（56%）、儿童安全（52%）和…；这类信号适合写给老板看，因为它直接关系到业务风险。",
      "bossPain": "AI 一旦能读文件、写内容、调工具、改数据，错误就不只是内容不好，而可能变成业务事故。",
      "moneyLine": "权限没管住，省下的人力钱可能被一次合规、法务或数据事故吃掉。",
      "oldFrame": "AI 越自主越好。",
      "newFrame": "AI 越自主，越要先设计权限、复核和责任人。",
      "actionHint": "先把 AI 员工分成三级：只读、建议、可执行；每一级都写清谁复核。",
      "evidence": "Anthropic首次公众调查：近半美国人盼AI治愈疾病，超六成担忧失业；我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它；21岁休学创业，累计营收70w+，这个05后凭什么？",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260613-A15",
            "title": "Anthropic首次公众调查：近半美国人盼AI治愈疾病，超六成担忧失业",
            "source": "Anthropic：Newsroom（网页）",
            "url": "https://www.anthropic.com/news/anthropic-public-record",
            "note": "Anthropic对近5.2万美国人调查显示：48%将治愈癌症等疾病列为首要期望，36%希望AI帮助残障人士。64%担忧AI导致失业，56%担忧认知依赖，52%担忧信息误导。超70%支持政府监管，最关注隐私（56%）、儿童安全（52%）和责任归属（49%）。仅15%信任AI公司决策。多数议题上观点不因党派或地域严重分裂。调查于2025年11-12月由You…"
          }
        ],
        "viewpoints": [
          {
            "kind": "first_line_viewpoint",
            "id": "2065791421362352476",
            "title": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它",
            "source": "Garry Tan",
            "url": "https://x.com/garrytan/status/2065791421362352476",
            "note": "我希望该模型的重要性来自更多人实际使用它并得出自己的结论。但是，是的，世界上大多数人通过标志物而不是通过与标志物的互动来了解它"
          }
        ],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "a9315999e72ca3",
            "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
            "source": "AI破局",
            "url": "https://aipoju.com/topic-details/14422458288281442",
            "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
          }
        ]
      },
      "source": "Anthropic：Newsroom（网页）",
      "url": "https://www.anthropic.com/news/anthropic-public-record",
      "date": "2026-06-13",
      "score": 88,
      "grade": "A",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 22,
        "moneyRelation": 21,
        "talkability": 18,
        "spreadability": 13,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "不要写安全科普，写老板责任",
          "note": "老板不关心分类器模型，关心 AI 搞错后谁背锅。"
        },
        {
          "title": "把权限拆成人话",
          "note": "只读、建议、执行三个等级，比讲治理框架更容易传播。"
        },
        {
          "title": "用当天案例推进",
          "note": "用 Anthropic首次公众调查：近半美国人盼AI治… 做钩子，落到企业内部的授权和复核表。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    }
  ],
  "grouped": {
    "lead": {
      "id": "money_leak-agentforce-cust-老板先查订单入口有没有漏钱",
      "sourceId": "money_leak",
      "sourceName": "漏钱型",
      "sourceDesc": "订单入口、转化漏斗、线索流失",
      "type": "boss_decision_topic",
      "title": "Agentforce Cust：老板先查订单入口有没有漏钱",
      "spreadTitle": "Agentforce Cust：老板先查订单入口有没有漏钱",
      "audience": "企业老板 / 创业者 / 业务负责人",
      "core": "流量、搜索、来电、表单和私信，本质上都是订单入口。AI 先改变的不是工具栏，而是客户从看见你到联系你的路径。",
      "relevance": "原始来源标题：Salesforce 的原文业务场景：Agentforce Customer Stories - Salesforce。；社群里也出现了“公众号新人30天变现7000+，我是如何用微信贴图…”这类一线反馈。",
      "bossPain": "老板最容易忽略的不是没有用 AI，而是客户已经换了入口，公司还在用旧流程接单。",
      "moneyLine": "先算入口漏损，再算模型能力；能把曝光、咨询、跟进接住，AI 才和收入有关。",
      "oldFrame": "AI 是一个提效工具。",
      "newFrame": "AI 正在改写客户入口，入口漏掉就是收入漏掉。",
      "actionHint": "今天先盘点 3 个入口：搜索入口、内容入口、咨询入口，各看一次转化和跟进断点。",
      "evidence": "Salesforce：Agentforce Customer Stories - Salesforce；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
      "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
      "sourceInputs": {
        "businessSignals": [
          {
            "kind": "business_signal",
            "id": "SIG-20260616-A09",
            "title": "Salesforce：Agentforce Customer Stories - Salesforce",
            "source": "salesforce.com",
            "url": "https://www.salesforce.com/agentforce/customer-stories/",
            "note": "原始来源标题：Salesforce 的原文业务场景：Agentforce Customer Stories - Salesforce。"
          }
        ],
        "viewpoints": [],
        "communityItems": [
          {
            "kind": "community_intelligence",
            "id": "ac2d9cbae4815c",
            "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
            "source": "生财有术",
            "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
            "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
          }
        ]
      },
      "source": "salesforce.com",
      "url": "https://www.salesforce.com/agentforce/customer-stories/",
      "date": "2026-06-16",
      "score": 97,
      "grade": "S",
      "priority": "公众号主稿",
      "scoreBreakdown": {
        "bossPain": 25,
        "moneyRelation": 25,
        "talkability": 19,
        "spreadability": 14,
        "actionability": 9,
        "styleFit": 5
      },
      "angles": [
        {
          "title": "开头直接问漏钱",
          "note": "不要先讲 Agentforce Customer Stori… 多新，先问老板：这个入口今天带来多少咨询、漏掉多少跟进？"
        },
        {
          "title": "中段拆入口链路",
          "note": "看见、点击、咨询、记录、跟进、成交，每一步都能放 AI，但先看哪里漏。"
        },
        {
          "title": "结尾落到老板动作",
          "note": "让老板今天就拉一张入口表，而不是收藏一堆工具。"
        }
      ],
      "writingStructure": [
        "开头 3 句内给冲突或数字",
        "中段按现象 -> 算账 -> 坑 -> 解法推进",
        "结尾给一句新判断，不复述要点"
      ],
      "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
    },
    "byEngine": {
      "money_leak": [
        {
          "id": "money_leak-agentforce-cust-老板先查订单入口有没有漏钱",
          "sourceId": "money_leak",
          "sourceName": "漏钱型",
          "sourceDesc": "订单入口、转化漏斗、线索流失",
          "type": "boss_decision_topic",
          "title": "Agentforce Cust：老板先查订单入口有没有漏钱",
          "spreadTitle": "Agentforce Cust：老板先查订单入口有没有漏钱",
          "audience": "企业老板 / 创业者 / 业务负责人",
          "core": "流量、搜索、来电、表单和私信，本质上都是订单入口。AI 先改变的不是工具栏，而是客户从看见你到联系你的路径。",
          "relevance": "原始来源标题：Salesforce 的原文业务场景：Agentforce Customer Stories - Salesforce。；社群里也出现了“公众号新人30天变现7000+，我是如何用微信贴图…”这类一线反馈。",
          "bossPain": "老板最容易忽略的不是没有用 AI，而是客户已经换了入口，公司还在用旧流程接单。",
          "moneyLine": "先算入口漏损，再算模型能力；能把曝光、咨询、跟进接住，AI 才和收入有关。",
          "oldFrame": "AI 是一个提效工具。",
          "newFrame": "AI 正在改写客户入口，入口漏掉就是收入漏掉。",
          "actionHint": "今天先盘点 3 个入口：搜索入口、内容入口、咨询入口，各看一次转化和跟进断点。",
          "evidence": "Salesforce：Agentforce Customer Stories - Salesforce；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
          "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
          "sourceInputs": {
            "businessSignals": [
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A09",
                "title": "Salesforce：Agentforce Customer Stories - Salesforce",
                "source": "salesforce.com",
                "url": "https://www.salesforce.com/agentforce/customer-stories/",
                "note": "原始来源标题：Salesforce 的原文业务场景：Agentforce Customer Stories - Salesforce。"
              }
            ],
            "viewpoints": [],
            "communityItems": [
              {
                "kind": "community_intelligence",
                "id": "ac2d9cbae4815c",
                "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
                "source": "生财有术",
                "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
                "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
              }
            ]
          },
          "source": "salesforce.com",
          "url": "https://www.salesforce.com/agentforce/customer-stories/",
          "date": "2026-06-16",
          "score": 97,
          "grade": "S",
          "priority": "公众号主稿",
          "scoreBreakdown": {
            "bossPain": 25,
            "moneyRelation": 25,
            "talkability": 19,
            "spreadability": 14,
            "actionability": 9,
            "styleFit": 5
          },
          "angles": [
            {
              "title": "开头直接问漏钱",
              "note": "不要先讲 Agentforce Customer Stori… 多新，先问老板：这个入口今天带来多少咨询、漏掉多少跟进？"
            },
            {
              "title": "中段拆入口链路",
              "note": "看见、点击、咨询、记录、跟进、成交，每一步都能放 AI，但先看哪里漏。"
            },
            {
              "title": "结尾落到老板动作",
              "note": "让老板今天就拉一张入口表，而不是收藏一堆工具。"
            }
          ],
          "writingStructure": [
            "开头 3 句内给冲突或数字",
            "中段按现象 -> 算账 -> 坑 -> 解法推进",
            "结尾给一句新判断，不复述要点"
          ],
          "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
        }
      ],
      "save_headcount": [
        {
          "id": "save_headcount-ai-幻觉罚单-别急着裁员-先少招重复岗位",
          "sourceId": "save_headcount",
          "sourceName": "省人型",
          "sourceDesc": "少招人、少返工、少加班",
          "type": "boss_decision_topic",
          "title": "AI 幻觉罚单：别急着裁员，先少招重复岗位",
          "spreadTitle": "AI 幻觉罚单：别急着裁员，先少招重复岗位",
          "audience": "企业老板 / 创业者 / 业务负责人",
          "core": "AI 进入企业的第一步，不是替代一个完整的人，而是接住岗位里反复发生、规则清楚、结果可验收的动作。",
          "relevance": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工…；这类信号比“AI 很强”更接近老板的组织账。",
          "bossPain": "人越招越多，流程没有变短，管理成本反而被重复动作拖住。",
          "moneyLine": "少招一个重复岗位，或让一个岗位少返工 30%，老板才会觉得 AI 是投入，不是玩具。",
          "oldFrame": "AI 上线就是裁员。",
          "newFrame": "AI 上线的第一阶段，是把岗位动作拆小，让公司少招重复岗位。",
          "actionHint": "选一个岗位，列出每天重复最多的 5 个动作，先交给 AI 试跑其中 1 个。",
          "evidence": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；21岁休学创业，累计营收70w+，这个05后凭什么？",
          "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
          "sourceInputs": {
            "businessSignals": [
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A11",
                "title": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼",
                "source": "IT之家（RSS）",
                "url": "https://www.ithome.com/0/964/631.htm",
                "note": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工作属行业常规，裁定不可再诉。这是马斯克四周内第二次在与 OpenAI 的法律交锋中败诉。"
              }
            ],
            "viewpoints": [
              {
                "kind": "first_line_viewpoint",
                "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
                "source": "Dataiku Blog",
                "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
              }
            ],
            "communityItems": [
              {
                "kind": "community_intelligence",
                "id": "9319cbd9572bc9",
                "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
                "source": "AI破局",
                "url": "https://aipoju.com/index",
                "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
              }
            ]
          },
          "source": "IT之家（RSS）",
          "url": "https://www.ithome.com/0/964/631.htm",
          "date": "2026-06-16",
          "score": 90,
          "grade": "S",
          "priority": "公众号主稿",
          "scoreBreakdown": {
            "bossPain": 23,
            "moneyRelation": 23,
            "talkability": 16,
            "spreadability": 13,
            "actionability": 10,
            "styleFit": 5
          },
          "angles": [
            {
              "title": "用岗位动作替代岗位名称",
              "note": "不要写 AI 替代某个人，写 AI 先替代接听、归档、质检、催办、汇总这类动作。"
            },
            {
              "title": "把省人写成管理账",
              "note": "老板关心的不是炫技，是少招人、少返工、少培训。"
            },
            {
              "title": "给一个当天可做的小动作",
              "note": "用 美国法官驳回 xAI 指控 OpenAI 窃取商业… 做例子，把大流程拆成一个可验收动作。"
            }
          ],
          "writingStructure": [
            "开头 3 句内给冲突或数字",
            "中段按现象 -> 算账 -> 坑 -> 解法推进",
            "结尾给一句新判断，不复述要点"
          ],
          "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
        }
      ],
      "peer_pressure": [
        {
          "id": "peer_pressure-从公众号新人-30-天变现-到-agentforce-cust-同行压力不在技术-在速度",
          "sourceId": "peer_pressure",
          "sourceName": "同行压力型",
          "sourceDesc": "同行已做、对手先跑、老板焦虑",
          "type": "boss_decision_topic",
          "title": "从公众号新人 30 天变现，到 Agentforce Cust：同行压力不在技术，在速度",
          "spreadTitle": "从公众号新人 30 天变现，到 Agentforce Cust：同行压力不在技术，在速度",
          "audience": "企业老板 / 创业者 / 业务负责人",
          "core": "最能触发老板的不是技术解释，而是别人已经把 AI 用到获客、内容、交付、产品试错里，并且开始看到结果。",
          "relevance": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌；这类社群信号代表一线老板和操盘手已经在算产出。",
          "bossPain": "当同行用 AI 降低试错成本时，你还在用人工流程慢慢排队。",
          "moneyLine": "同行压力真正影响的是获客成本、内容成本和试错周期，而不是老板的技术焦虑。",
          "oldFrame": "AI 是员工自己研究的新工具。",
          "newFrame": "AI 是同行正在重做经营速度的生产系统。",
          "actionHint": "每周只问团队一个问题：同行哪一个动作已经被 AI 缩短了，我们要不要跟？",
          "evidence": "Salesforce：Agentforce Customer Stories - Salesforce；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
          "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
          "sourceInputs": {
            "businessSignals": [
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A09",
                "title": "Salesforce：Agentforce Customer Stories - Salesforce",
                "source": "salesforce.com",
                "url": "https://www.salesforce.com/agentforce/customer-stories/",
                "note": "原始来源标题：Salesforce 的原文业务场景：Agentforce Customer Stories - Salesforce。"
              }
            ],
            "viewpoints": [
              {
                "kind": "first_line_viewpoint",
                "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
                "source": "Dataiku Blog",
                "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
              }
            ],
            "communityItems": [
              {
                "kind": "community_intelligence",
                "id": "ac2d9cbae4815c",
                "title": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘",
                "source": "生财有术",
                "url": "https://scys.com/articleDetail/xq_topic/22255224145551211",
                "note": "公众号新人30天变现7000+，我是如何用微信贴图来快速起号，靠发公众号文章来扩大收益的复盘 生财的朋友们大家好，我是21年加入的老圈友清歌"
              }
            ]
          },
          "source": "salesforce.com",
          "url": "https://www.salesforce.com/agentforce/customer-stories/",
          "date": "2026-06-16",
          "score": 91,
          "grade": "S",
          "priority": "公众号主稿",
          "scoreBreakdown": {
            "bossPain": 22,
            "moneyRelation": 22,
            "talkability": 19,
            "spreadability": 15,
            "actionability": 8,
            "styleFit": 5
          },
          "angles": [
            {
              "title": "用同行压力开头",
              "note": "标题和开头都不要讲 AI 多强，要讲别人已经开始用 AI 跑出结果。"
            },
            {
              "title": "拆获客、交付、产品三个场景",
              "note": "每个场景只写一个真实动作，避免变成工具列表。"
            },
            {
              "title": "落到老板的例会问题",
              "note": "建议老板每周让团队汇报一个被 AI 缩短的动作，而不是汇报又试了什么工具。"
            }
          ],
          "writingStructure": [
            "开头 3 句内给冲突或数字",
            "中段按现象 -> 算账 -> 坑 -> 解法推进",
            "结尾给一句新判断，不复述要点"
          ],
          "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
        }
      ],
      "pitfall": [
        {
          "id": "pitfall-伯克利rdi发布agents-老板先补责任边界",
          "sourceId": "pitfall",
          "sourceName": "避坑型",
          "sourceDesc": "工具乱买、权限失控、流程没拆",
          "type": "boss_decision_topic",
          "title": "伯克利RDI发布Agents'：老板先补责任边界",
          "spreadTitle": "伯克利RDI发布Agents'：老板先补责任边界",
          "audience": "企业老板 / 创业者 / 业务负责人",
          "core": "AI 从生成内容走向执行动作后，企业问题从“会不会用”变成“谁审核、谁授权、谁负责”。",
          "relevance": "2026年6月，伯克利RDI发布Agents' Last Exam（ALE）基准，包含1，500余项源于真实工作的任务，覆盖55个非体力职业。对Fable 5、GPT-5.5、Composer 2.5等前沿智能体的测评显示：在最困难层级成…；这类信号适合写给老板看，因为它直接关系到业务风险。",
          "bossPain": "AI 一旦能读文件、写内容、调工具、改数据，错误就不只是内容不好，而可能变成业务事故。",
          "moneyLine": "权限没管住，省下的人力钱可能被一次合规、法务或数据事故吃掉。",
          "oldFrame": "AI 越自主越好。",
          "newFrame": "AI 越自主，越要先设计权限、复核和责任人。",
          "actionHint": "先把 AI 员工分成三级：只读、建议、可执行；每一级都写清谁复核。",
          "evidence": "伯克利RDI发布Agents' Last Exam基准；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；21岁休学创业，累计营收70w+，这个05后凭什么？",
          "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
          "sourceInputs": {
            "businessSignals": [
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A05",
                "title": "伯克利RDI发布Agents' Last Exam基准",
                "source": "Berkeley RDI：Blog（AI 安全与评测）",
                "url": "https://rdi.berkeley.edu/blog/agents-last-exam",
                "note": "2026年6月，伯克利RDI发布Agents' Last Exam（ALE）基准，包含1，500余项源于真实工作的任务，覆盖55个非体力职业。对Fable 5、GPT-5.5、Composer 2.5等前沿智能体的测评显示：在最困难层级成功率均为0%；整体任务表现接近，但单任务成本差异巨大（Fable 5约$15.70，GPT-5.5约$3.80，Comp…"
              }
            ],
            "viewpoints": [
              {
                "kind": "first_line_viewpoint",
                "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
                "source": "Dataiku Blog",
                "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
              }
            ],
            "communityItems": [
              {
                "kind": "community_intelligence",
                "id": "9319cbd9572bc9",
                "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
                "source": "AI破局",
                "url": "https://aipoju.com/index",
                "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
              }
            ]
          },
          "source": "Berkeley RDI：Blog（AI 安全与评测）",
          "url": "https://rdi.berkeley.edu/blog/agents-last-exam",
          "date": "2026-06-16",
          "score": 88,
          "grade": "A",
          "priority": "公众号主稿",
          "scoreBreakdown": {
            "bossPain": 22,
            "moneyRelation": 21,
            "talkability": 18,
            "spreadability": 13,
            "actionability": 9,
            "styleFit": 5
          },
          "angles": [
            {
              "title": "不要写安全科普，写老板责任",
              "note": "老板不关心分类器模型，关心 AI 搞错后谁背锅。"
            },
            {
              "title": "把权限拆成人话",
              "note": "只读、建议、执行三个等级，比讲治理框架更容易传播。"
            },
            {
              "title": "用当天案例推进",
              "note": "用 伯克利RDI发布Agents' Last Exam… 做钩子，落到企业内部的授权和复核表。"
            }
          ],
          "writingStructure": [
            "开头 3 句内给冲突或数字",
            "中段按现象 -> 算账 -> 坑 -> 解法推进",
            "结尾给一句新判断，不复述要点"
          ],
          "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
        }
      ],
      "counterintuitive": [
        {
          "id": "counterintuitive-ai-幻觉罚单-老板真正该买的不是工具-是任务拆解能力",
          "sourceId": "counterintuitive",
          "sourceName": "反常识型",
          "sourceDesc": "推翻流行说法，形成可传播判断",
          "type": "boss_decision_topic",
          "title": "AI 幻觉罚单：老板真正该买的不是工具，是任务拆解能力",
          "spreadTitle": "AI 幻觉罚单：老板真正该买的不是工具，是任务拆解能力",
          "audience": "企业老板 / 创业者 / 业务负责人",
          "core": "反常识点在于：AI 越强，越不是所有人都被替代，而是会拆任务、会验收结果的人更值钱。",
          "relevance": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工…；社群里“21岁休学创业，累计营收70w+，这个05后凭什么？”的讨论也在提醒老板，问题不再只是怎么做。",
          "bossPain": "工具买了一堆，员工不会拆任务；老板看到结果差，最后误判 AI 不行。",
          "moneyLine": "工具是支出，任务拆解和验收标准是资产。支出会过期，资产能复用。",
          "oldFrame": "追最新 AI 工具。",
          "newFrame": "先沉淀任务、语料、步骤和验收标准，再让 AI 接手。",
          "actionHint": "今天先选一个业务动作，写清输入、步骤、验收标准，再接任何 AI 工具。",
          "evidence": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；21岁休学创业，累计营收70w+，这个05后凭什么？",
          "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
          "sourceInputs": {
            "businessSignals": [
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A11",
                "title": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼",
                "source": "IT之家（RSS）",
                "url": "https://www.ithome.com/0/964/631.htm",
                "note": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工作属行业常规，裁定不可再诉。这是马斯克四周内第二次在与 OpenAI 的法律交锋中败诉。"
              }
            ],
            "viewpoints": [
              {
                "kind": "first_line_viewpoint",
                "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
                "source": "Dataiku Blog",
                "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
              }
            ],
            "communityItems": [
              {
                "kind": "community_intelligence",
                "id": "9319cbd9572bc9",
                "title": "21岁休学创业，累计营收70w+，这个05后凭什么？",
                "source": "AI破局",
                "url": "https://aipoju.com/index",
                "note": "21岁休学创业，累计营收70w+，这个05后凭什么"
              }
            ]
          },
          "source": "IT之家（RSS）",
          "url": "https://www.ithome.com/0/964/631.htm",
          "date": "2026-06-16",
          "score": 95,
          "grade": "S",
          "priority": "公众号主稿",
          "scoreBreakdown": {
            "bossPain": 24,
            "moneyRelation": 23,
            "talkability": 18,
            "spreadability": 15,
            "actionability": 10,
            "styleFit": 5
          },
          "angles": [
            {
              "title": "先打脸工具崇拜",
              "note": "开头写：买工具不是 AI 转型，能稳定交付结果才算。"
            },
            {
              "title": "中段讲任务拆解",
              "note": "把提示词、流程、知识库和验收标准放在同一张图里讲。"
            },
            {
              "title": "结尾给金句",
              "note": "AI 工具不是资产，能反复跑通的任务系统才是资产。"
            }
          ],
          "writingStructure": [
            "开头 3 句内给冲突或数字",
            "中段按现象 -> 算账 -> 坑 -> 解法推进",
            "结尾给一句新判断，不复述要点"
          ],
          "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
        }
      ],
      "small_role": [
        {
          "id": "small_role-salesforce以36亿美-小公司先做一个小岗位-ai-员工",
          "sourceId": "small_role",
          "sourceName": "小岗位型",
          "sourceDesc": "客服、销售、财务、标书、运营",
          "type": "boss_decision_topic",
          "title": "Salesforce以36亿美：小公司先做一个小岗位 AI 员工",
          "spreadTitle": "Salesforce以36亿美：小公司先做一个小岗位 AI 员工",
          "audience": "企业老板 / 创业者 / 业务负责人",
          "core": "普通老板和服务商的机会，不在宏大平台，而在一个具体岗位、一个明确动作、一个可验收结果里。",
          "relevance": "Salesforce宣布以36亿美元收购AI客服平台Fin（前身为Intercom）。Fin提供可跨实时聊天、WhatsApp、短信、电话、Slack等多渠道解决客户问题的AI智能体。Salesforce计划利用Fin的技术和团队增强其企…；这类材料说明岗位级 AI 比大而全平台更容易落地。",
          "bossPain": "老板最怕 AI 项目太大、太贵、太慢，最后没人用。",
          "moneyLine": "一个岗位先打穿，比一个平台讲 100 个功能更容易收钱，也更容易复购。",
          "oldFrame": "做一个什么都能干的 AI 平台。",
          "newFrame": "做一个只干一件事但能交付的小岗位 AI 员工。",
          "actionHint": "先从客服、销售跟进、内容分发、资料整理、流程复核里选一个岗位动作。",
          "evidence": "Salesforce以36亿美元收购AI客服平台Fin；美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
          "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
          "sourceInputs": {
            "businessSignals": [
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A12",
                "title": "Salesforce以36亿美元收购AI客服平台Fin",
                "source": "TechCrunch：AI（RSS）",
                "url": "https://techcrunch.com/2026/06/15/salesforce-acquires-ai-customer-service-platform-fin-for-3-6b",
                "note": "Salesforce宣布以36亿美元收购AI客服平台Fin（前身为Intercom）。Fin提供可跨实时聊天、WhatsApp、短信、电话、Slack等多渠道解决客户问题的AI智能体。Salesforce计划利用Fin的技术和团队增强其企业级Agentforce平台，该平台允许企业构建自定义AI智能体以自动化任务。交易预计在Salesforce 2027财…"
              },
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A11",
                "title": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼",
                "source": "IT之家（RSS）",
                "url": "https://www.ithome.com/0/964/631.htm",
                "note": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工作属行业常规，裁定不可再诉。这是马斯克四周内第二次在与 OpenAI 的法律交锋中败诉。"
              }
            ],
            "viewpoints": [],
            "communityItems": [
              {
                "kind": "community_intelligence",
                "id": "420298a9897e36",
                "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
                "source": "生财有术",
                "url": "https://scys.com/articleDetail/xq_topic/22255224182115441",
                "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
              }
            ]
          },
          "source": "TechCrunch：AI（RSS）",
          "url": "https://techcrunch.com/2026/06/15/salesforce-acquires-ai-customer-service-platform-fin-for-3-6b",
          "date": "2026-06-16",
          "score": 97,
          "grade": "S",
          "priority": "公众号主稿",
          "scoreBreakdown": {
            "bossPain": 25,
            "moneyRelation": 24,
            "talkability": 18,
            "spreadability": 15,
            "actionability": 10,
            "styleFit": 5
          },
          "angles": [
            {
              "title": "用小岗位对抗大平台",
              "note": "这是最适合你现有表达的主线：不做大而全，先做小而深。"
            },
            {
              "title": "每个岗位给一个可验收结果",
              "note": "客服看接通率，销售看跟进率，内容看线索，流程看错误率。"
            },
            {
              "title": "避免写成创业方向清单",
              "note": "要写一个岗位打穿逻辑，不要罗列 10 个机会。"
            }
          ],
          "writingStructure": [
            "开头 3 句内给冲突或数字",
            "中段按现象 -> 算账 -> 坑 -> 解法推进",
            "结尾给一句新判断，不复述要点"
          ],
          "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
        }
      ],
      "big_small_contrast": [
        {
          "id": "big_small_contrast-blitzy-融资-200m-普通老板该看见哪层机会",
          "sourceId": "big_small_contrast",
          "sourceName": "大小对照型",
          "sourceDesc": "大融资对照小生意，大模型对照小岗位",
          "type": "boss_decision_topic",
          "title": "Blitzy 融资 $200M：普通老板该看见哪层机会？",
          "spreadTitle": "Blitzy 融资 $200M：普通老板该看见哪层机会？",
          "audience": "企业老板 / 创业者 / 业务负责人",
          "core": "大新闻负责告诉你资本往哪里押，小机会负责告诉你老板明天愿意为什么付钱。",
          "relevance": "Blitzy 获得$200M 融资，公开资料显示资金继续流向 AI 产品化和企业采用环节。；同时社群里的“这篇产品调研干货：帮你避开90%独立开发者起步坑”说明一线需求还在配置、流程和交付。",
          "bossPain": "老板看不懂大融资，但能理解谁帮他把一个具体业务动作跑起来。",
          "moneyLine": "大公司赚基础设施的钱，小服务商赚落地第一公里的钱。",
          "oldFrame": "AI 创业只能跟大模型和融资有关。",
          "newFrame": "普通人的 AI 机会在帮老板跨过配置、流程和交付门槛。",
          "actionHint": "把服务产品化：诊断一个流程、配置一套工具、交付一个可复用动作。",
          "evidence": "Blitzy 融资 $200M；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
          "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
          "sourceInputs": {
            "businessSignals": [
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A01",
                "title": "Blitzy 融资 $200M",
                "source": "news.crunchbase.com",
                "url": "https://news.crunchbase.com/ai/blitzy-funding-valuation-autonomous-software-development-vibe-coding-startups/",
                "note": "Blitzy 获得$200M 融资，公开资料显示资金继续流向 AI 产品化和企业采用环节。"
              }
            ],
            "viewpoints": [
              {
                "kind": "first_line_viewpoint",
                "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
                "source": "Dataiku Blog",
                "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
              }
            ],
            "communityItems": [
              {
                "kind": "community_intelligence",
                "id": "420298a9897e36",
                "title": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑",
                "source": "生财有术",
                "url": "https://scys.com/articleDetail/xq_topic/22255224182115441",
                "note": "超级术：这篇产品调研干货：帮你避开90%独立开发者起步坑 #超级术# 26：今天这篇超级术，我想推荐的是@袁锐钦 的《我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了》，链接：我花3小时调研了一个出海产品，发现90%的独立开发者第一步就走错了我觉得这篇内容值得被推荐，一个很核心的原因是，它解决的是生财里一类非常普遍、而且越来越重要的问题：…"
              }
            ]
          },
          "source": "news.crunchbase.com",
          "url": "https://news.crunchbase.com/ai/blitzy-funding-valuation-autonomous-software-development-vibe-coding-startups/",
          "date": "2026-06-16",
          "score": 93,
          "grade": "S",
          "priority": "公众号主稿",
          "scoreBreakdown": {
            "bossPain": 21,
            "moneyRelation": 24,
            "talkability": 20,
            "spreadability": 15,
            "actionability": 8,
            "styleFit": 5
          },
          "angles": [
            {
              "title": "用大钱和小钱制造冲突",
              "note": "大融资负责制造注意力，小服务负责让老板觉得和自己有关。"
            },
            {
              "title": "写出两套赚钱逻辑",
              "note": "资本逻辑：长期技术押注；服务逻辑：帮老板完成第一公里。"
            },
            {
              "title": "落到可卖服务包",
              "note": "流程诊断、工具配置、知识库搭建、首个工作流，这是老板可理解的产品。"
            }
          ],
          "writingStructure": [
            "开头 3 句内给冲突或数字",
            "中段按现象 -> 算账 -> 坑 -> 解法推进",
            "结尾给一句新判断，不复述要点"
          ],
          "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
        }
      ],
      "person_story": [
        {
          "id": "person_story-从普通人赚-1000-万-到-salesforce以36亿美-有场景的-ai-故事更容易被老板转发",
          "sourceId": "person_story",
          "sourceName": "人物故事型",
          "sourceDesc": "具体人、具体场景、具体结果",
          "type": "boss_decision_topic",
          "title": "从普通人赚 1000 万，到 Salesforce以36亿美：有场景的 AI 故事更容易被老板转发",
          "spreadTitle": "从普通人赚 1000 万，到 Salesforce以36亿美：有场景的 AI 故事更容易被老板转发",
          "audience": "企业老板 / 创业者 / 业务负责人",
          "core": "人物故事的价值不在鸡汤，而在把一个抽象趋势压缩成老板能看懂的场景、成本和选择。",
          "relevance": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？；这类材料适合做传播入口，再回到老板的业务判断。",
          "bossPain": "老板不是不关心 AI，而是不愿意看一篇没有人、没有场景、没有结果的技术说明。",
          "moneyLine": "一个具体人、一件具体事、一个具体结果，比十个工具功能更容易带来咨询和信任。",
          "oldFrame": "写 AI 就要讲技术和趋势。",
          "newFrame": "写给老板的 AI 内容，要先有人、有场景、有结果。",
          "actionHint": "从当天素材里挑一个具体人或具体业务场景，按“处境-动作-结果-老板判断”写。",
          "evidence": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼；主权并不是你的AI运行的地方。问题在于它是否对你有所回应。；普通人怎么赚到1000万？",
          "evidenceBoundary": "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
          "sourceInputs": {
            "businessSignals": [
              {
                "kind": "business_signal",
                "id": "SIG-20260616-A11",
                "title": "美国法官驳回 xAI 指控 OpenAI 窃取商业机密的诉讼",
                "source": "IT之家（RSS）",
                "url": "https://www.ithome.com/0/964/631.htm",
                "note": "美国一名联邦法官驳回了 xAI 对 OpenAI 提起的诉讼。xAI 指控 OpenAI 诱使其前高级工程师李雪辰泄露与 Grok 4 相关的商业机密。法官丽塔·林认为 xAI 未能提供证据证明 OpenAI 怂恿泄密，且招聘中询问过往工作属行业常规，裁定不可再诉。这是马斯克四周内第二次在与 OpenAI 的法律交锋中败诉。"
              }
            ],
            "viewpoints": [
              {
                "kind": "first_line_viewpoint",
                "id": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "title": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。",
                "source": "Dataiku Blog",
                "url": "https://www.dataiku.com/stories/blog/sovereignty-ai",
                "note": "主权并不是你的AI运行的地方。问题在于它是否对你有所回应。"
              }
            ],
            "communityItems": [
              {
                "kind": "community_intelligence",
                "id": "679f12f1ab88e3",
                "title": "普通人怎么赚到1000万？",
                "source": "AI破局",
                "url": "https://aipoju.com/topic-details/22255225524225521",
                "note": "普通人怎么赚到1000万？ 普通人怎么赚到1000万？"
              }
            ]
          },
          "source": "IT之家（RSS）",
          "url": "https://www.ithome.com/0/964/631.htm",
          "date": "2026-06-16",
          "score": 92,
          "grade": "S",
          "priority": "公众号主稿",
          "scoreBreakdown": {
            "bossPain": 23,
            "moneyRelation": 21,
            "talkability": 20,
            "spreadability": 14,
            "actionability": 9,
            "styleFit": 5
          },
          "angles": [
            {
              "title": "用人物场景开头",
              "note": "不要先讲 AI 趋势，先讲 普通人怎么赚到1000万？ 这类具体处境。"
            },
            {
              "title": "把故事转成商业判断",
              "note": "重点不是感动，而是这个故事说明老板该改哪个流程、补哪个能力。"
            },
            {
              "title": "结尾回到老板动作",
              "note": "让老板知道明天可以拿哪个人、哪个岗位、哪个场景做试点。"
            }
          ],
          "writingStructure": [
            "开头 3 句内给冲突或数字",
            "中段按现象 -> 算账 -> 坑 -> 解法推进",
            "结尾给一句新判断，不复述要点"
          ],
          "forbiddenFrame": "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。"
        }
      ]
    }
  }
};
