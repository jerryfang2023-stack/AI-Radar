window.SIGNAL_LAB_DATA = {
  "generatedAt": "2026-05-05T21:30:00+08:00",
  "date": "2026-05-05",
  "summary": {
    "rawCount": 36,
    "poolCount": 12,
    "structuredCount": 8,
    "frontCount": 3,
    "deepDiveCount": 1,
    "trendCount": 5
  },
  "frontSignals": [
    {
      "id": "FS-20260505-001",
      "rank": "01",
      "title": "Sierra 新融资与客户采用：客服 Agent 从试点进入企业交互基础设施",
      "track": "AI 客服 / 企业 Agent",
      "score": 91,
      "scoreLabel": "高价值信号",
      "sourceTier": "S/A",
      "evidenceStage": "融资 + 客户采用",
      "summary": "Sierra 的新融资与客户采用信息说明，客服 Agent 正在从对话能力走向企业交互基础设施。关键不只是金额，而是客户、流程和交互规模开始同时出现。",
      "interpretation": "这条信号更像企业 Agent 生产化的连续证据：客户体验、工单、退货、理赔和品牌语气正在被整合进同一个 Agent 运营层。",
      "secondarySearch": [
        {
          "label": "TechCrunch",
          "url": "https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious/",
          "tier": "A"
        },
        {
          "label": "Sierra",
          "url": "https://sierra.ai/",
          "tier": "S"
        },
        {
          "label": "Sierra Customers",
          "url": "https://sierra.ai/customers",
          "tier": "S"
        }
      ],
      "risks": [
        "续约和复杂场景交付成本仍需观察",
        "大厂平台和客服 SaaS 可能内置同类能力",
        "自动解决率可能被简单问题高估"
      ],
      "sixDimensions": [
        "降低高频客服交互的人力压力，同时保持品牌语气和流程一致。",
        "客服量大、流程复杂、合规要求高的银行、保险、零售和电商企业。",
        "替代 FAQ、人工一线分流和工单前置判断。",
        "按座席、对话量、自动解决量或企业工作区订阅收费。",
        "企业客户开始把 Agent 接入真实交互，而不是只做 demo。",
        "可迁移，但需要结合客服系统、数据合规和行业话术。"
      ],
      "trendId": "TR-LAB-ENTERPRISE-AGENT-CX",
      "opportunityId": "OP-LAB-CX-AGENT-OPS"
    },
    {
      "id": "FS-20260505-002",
      "rank": "02",
      "title": "模型与工具价格透明化：企业 AI 应用的成本治理变成采购前置问题",
      "track": "AI 基础设施 / 成本治理",
      "score": 87,
      "scoreLabel": "高价值信号",
      "sourceTier": "S",
      "evidenceStage": "价格页 + 开发者文档",
      "summary": "模型价格、缓存、批处理和工具调用成本结构更透明，意味着企业 AI 应用进入规模化后，成本治理会前移到架构和采购阶段。",
      "interpretation": "机会不只在模型本身，也在模型路由、批处理编排、预算监控和 FinOps 化的 AI 成本治理。",
      "secondarySearch": [
        {
          "label": "OpenAI API Pricing",
          "url": "https://openai.com/api/pricing/",
          "tier": "S"
        },
        {
          "label": "OpenAI Docs",
          "url": "https://platform.openai.com/docs/",
          "tier": "S"
        },
        {
          "label": "OpenAI Batch API",
          "url": "https://platform.openai.com/docs/guides/batch",
          "tier": "S"
        }
      ],
      "risks": [
        "价格下降可能压缩中间层空间",
        "平台可能直接提供成本治理能力",
        "大客户可绕过第三方工具直接采购平台服务"
      ],
      "sixDimensions": [
        "帮助企业控制模型调用、缓存、批处理和工具链成本。",
        "高调用量 AI 应用团队、企业 IT、财务和采购团队。",
        "替代人工估算、粗粒度账单复盘和单模型固定调用。",
        "SaaS 订阅、按调用规模计费或 FinOps 咨询服务。",
        "模型能力扩散后，成本成为能否进入生产的关键变量。",
        "可迁移，本土模型和多云环境会增加治理需求。"
      ],
      "trendId": "TR-LAB-AI-COST-GOVERNANCE",
      "opportunityId": "OP-LAB-INFERENCE-COST-CONTROL"
    },
    {
      "id": "FS-20260505-003",
      "rank": "03",
      "title": "大模型算力合作扩张：企业 AI 需求把基础设施锁定期拉长",
      "track": "模型基础设施 / 云合作",
      "score": 84,
      "scoreLabel": "高价值信号",
      "sourceTier": "S",
      "evidenceStage": "云合作 + 企业需求",
      "summary": "Anthropic 与 Amazon 的算力合作扩张说明，企业和开发者需求正在从短期调用转为长期容量规划。",
      "interpretation": "这条信号指向模型供应、云基础设施和企业采购关系的深度绑定。创业机会更可能外溢到可观测、迁移、成本治理和多云调度。",
      "secondarySearch": [
        {
          "label": "Anthropic News",
          "url": "https://www.anthropic.com/news/anthropic-amazon-compute",
          "tier": "S"
        },
        {
          "label": "AWS Bedrock",
          "url": "https://aws.amazon.com/bedrock/",
          "tier": "S"
        },
        {
          "label": "Anthropic Enterprise",
          "url": "https://www.anthropic.com/enterprise",
          "tier": "S"
        }
      ],
      "risks": [
        "头部集中，创业公司不宜直接复制资本密集路径",
        "云平台绑定可能提高迁移成本",
        "容量承诺需要和真实需求匹配"
      ],
      "sixDimensions": [
        "降低企业关键 AI 应用的容量不确定性。",
        "大模型公司、云厂商、大型企业 AI 平台团队。",
        "替代临时采购和缺少容量预测的模型调用规划。",
        "容量承诺、云服务合约、可观测和多云调度工具。",
        "企业需求增长让推理和训练容量成为长期合同问题。",
        "可迁移，但更多表现为国产云、模型厂和政企大客户的容量协同。"
      ],
      "trendId": "TR-LAB-AI-INFRA-CAPACITY",
      "opportunityId": "OP-LAB-MODEL-CAPACITY-OPS"
    }
  ],
  "deepDive": {
    "id": "OP-LAB-CX-AGENT-OPS",
    "title": "AI 客服 Agent 运营控制层",
    "score": 89,
    "definition": "帮助企业把客服 Agent 接入知识、工单、身份、质检和升级流程，并持续监控效果、成本和风险。",
    "customers": [
      "客服中心负责人",
      "CX / 客户体验负责人",
      "售后运营负责人",
      "信息安全和合规负责人"
    ],
    "businessModel": [
      "SaaS 订阅",
      "用量计费",
      "专业服务"
    ],
    "barriers": [
      "系统集成",
      "行业质检语料",
      "合规与审计",
      "指标证明"
    ],
    "risks": [
      "复杂投诉仍需人工",
      "隐私和合规提高交付成本",
      "客服 SaaS 内置能力挤压中间层"
    ],
    "actionMap": {
      "questions": [
        "企业愿意为 Agent 运营控制层单独付费吗？",
        "哪些行业最适合先证明自动解决率？",
        "客户最担心效果、合规、成本还是集成？"
      ],
      "interviews": [
        "客服中心负责人",
        "售后运营负责人",
        "信息安全负责人",
        "客服 SaaS 集成商"
      ],
      "metrics": [
        "自动解决率",
        "人工升级率",
        "单次交互成本",
        "客户满意度",
        "合规拦截率"
      ],
      "watch7d": "观察更多客服 Agent 融资、客户案例或价格披露。",
      "watch30d": "观察行业客户部署、续约或指标案例。",
      "watch90d": "观察是否形成从客服 Agent 到运营控制层的连续产品形态。"
    }
  },
  "trends": [
    {
      "id": "TR-LAB-ENTERPRISE-AGENT-CX",
      "name": "企业客服 Agent 生产化",
      "status": "warming",
      "heat": 92,
      "signals": [
        "FS-20260505-001"
      ],
      "note": "从客服对话进入企业交互基础设施。"
    },
    {
      "id": "TR-LAB-AI-COST-GOVERNANCE",
      "name": "企业 AI 成本治理",
      "status": "emerging",
      "heat": 86,
      "signals": [
        "FS-20260505-002"
      ],
      "note": "模型价格、缓存和批处理改变采购前置判断。"
    },
    {
      "id": "TR-LAB-AI-INFRA-CAPACITY",
      "name": "模型算力锁定与容量规划",
      "status": "warming",
      "heat": 84,
      "signals": [
        "FS-20260505-003"
      ],
      "note": "需求从短期调用进入长期容量承诺。"
    },
    {
      "id": "TR-LAB-AGENT-OPEN-SOURCE",
      "name": "开源 Agent 框架商业化",
      "status": "emerging",
      "heat": 68,
      "signals": [
        "ST-20260505-004"
      ],
      "note": "观察企业集成和云市场证据。"
    },
    {
      "id": "TR-LAB-AI-CODING-RISK",
      "name": "AI 编程版权与合规风险",
      "status": "risk",
      "heat": 71,
      "signals": [
        "ST-20260505-005"
      ],
      "note": "作为反证方向保留。"
    }
  ],
  "excludedStructured": [
    "开源 Agent 框架热度上升，但企业采用证据不足。",
    "AI 编程版权诉讼风险具备反证价值，但今日缺少新的行业级事实。",
    "端侧小模型部署有技术信号，但客户预算方仍不清晰。",
    "垂直医疗 AI 采购线索需要继续回找采购或监管文件。",
    "早期融资方向新，但只有融资稿，缺设计伙伴或客户试点。"
  ]
};
