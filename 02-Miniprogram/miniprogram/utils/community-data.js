const schedules = [
  { id: "schedule-12", issue: "第 12 场", day: "今天", date: "08.27 20:00", title: "Physical AI 与产业落地", speakers: "梓哲、朱叫兽、Sylvan", status: "进行中", note: "三位成员依次分享，每人 15 分钟。" },
  { id: "schedule-13", issue: "第 13 场", day: "明天", date: "08.28 20:00", title: "数字员工与传统企业提效", speakers: "苏茂金、黄文强、谷先生", status: "排期", note: "围绕数字员工、门店增长与组织提效展开。" },
];

const archives = [
  {
    id: "issue-10", issue: "10", date: "2026.08.25", title: "AI 内容闭环与人的连接", subtitle: "职场认知、海外短剧与内容时代的个人壁垒",
    summary: "三位成员从平台价值、海外短剧和 AI 内容运营出发，讨论当工具能力逐渐普及时，真实客户、内容数据飞轮与人的连接为何仍是业务壁垒。",
    speakers: "阿澤、阿耀、小王（江小虫）",
    chapters: [
      { index: "01", title: "从平台价值回到真实客户", copy: "阿澤分享如何从平台价值解耦中重新认识专业判断与真实客户。" },
      { index: "02", title: "海外短剧的内容数据飞轮", copy: "阿耀复盘 LuckyShort 的海外 AI 短剧生产，以及模型、内容和反馈如何组成运营系统。" },
      { index: "03", title: "工具普及后，人的连接仍是壁垒", copy: "小王从 AI 漫剧、直播和运营实践出发，讨论注意力、信任与连接的长期价值。" },
    ],
  },
  {
    id: "issue-09", issue: "09", date: "2026.08.24", title: "AI 落地的三条路径", subtitle: "短视频内容库、医疗工具与实体增长",
    summary: "三位成员分别从短视频内容库、医疗 AI 工具和实体连锁增长出发，展示 AI 如何进入具体业务流程，并说明数据、验证和获客闭环的重要性。",
    speakers: "爱辉、曾景斯、国伟",
    chapters: [
      { index: "01", title: "让短视频内容库持续进化", copy: "爱辉介绍如何用垂直内容库和反馈数据，让 AI 成为内容与投放效率的放大器。" },
      { index: "02", title: "医疗工具先解决干净数据", copy: "曾景斯分享院外随访与医疗工具实践，说明医疗 AI 落地首先依赖可靠的数据基础。" },
      { index: "03", title: "实体增长需要可复用获客", copy: "国伟从连锁与电商出发，强调 AI 是效率工具，业务最终仍要回到结果和持续获客。" },
    ],
  },
  {
    id: "issue-02", issue: "02", date: "2026.08.13", title: "AI 判断力、企业服务与垂直赛道", subtitle: "生产门槛降低之后，验证与交付成为关键",
    summary: "杨旭、Fisher 与张晓明从内容生产、企业服务和垂直行业三个角度，讨论 AI 降低生产门槛后，真实需求、客户入口与行业积累为何更加重要。",
    speakers: "杨旭、Fisher、张晓明",
    chapters: [
      { index: "01", title: "AI 降低生产门槛，不降低验证门槛", copy: "杨旭从 AI 内容和交易实践出发，说明生成能力普及后判断与校验的重要性。" },
      { index: "02", title: "开发不是最大难点，真实需求才是", copy: "Fisher 从企业服务出发，讨论客户入口、需求识别和持续交付。" },
      { index: "03", title: "垂直行业仍依赖长期积累", copy: "张晓明强调行业认知、真实场景和长期资源无法被通用能力快速替代。" },
    ],
  },
];

const bounties = [
  { id: "FC-260825-01", founder: "Fisher", role: "AI SaaS · 企业落地", status: "进行中", mode: "社群共创", category: "产品战略", points: 30, question: "未来 6 个月，我们应该继续做 FDE 项目制收入，还是把高频需求产品化？", summary: "已有 3 个企业客户，项目收入稳定，但交付高度依赖创始团队。现在需要在现金流和可复制性之间做一次明确选择。", time: "今天 20:00 截止", answers: 2, participants: 6 },
  { id: "FC-260824-03", founder: "Kevin", role: "AI SaaS 出海 · 增长", status: "进行中", mode: "线上回答", category: "增长", points: 20, question: "已有 100 个付费用户，下一阶段应优先建设销售团队，还是继续投入 PLG？", summary: "产品已有初步付费验证，需要在销售扩张和产品驱动增长之间确定下一阶段的资源配置。", time: "剩余 18 小时", answers: 3, participants: 3 },
  { id: "FC-260823-02", founder: "Harry Yu", role: "日本市场 · ToB 销售", status: "待结案", mode: "混合解题", category: "出海", points: 30, question: "进入日本市场第一年，应该自建本地销售，还是与渠道伙伴联合交付？", summary: "团队正在验证日本 ToB 市场，希望结合交付控制、获客速度和本地信任成本确定进入方式。", time: "等待 Founder 确认", answers: 5, participants: 8 },
  { id: "FC-260821-06", founder: "Echo", role: "RAG SaaS · 商业化", status: "已结案", mode: "线上回答", category: "定价", points: 10, question: "首批企业客户应该按席位收费，还是按可验证的业务结果收费？", summary: "产品已完成两家客户试用，需要在易理解的席位价格和更贴近价值的结果定价之间选择首个标准方案。", time: "已分配 10 积分", answers: 4, participants: 4 },
];

const members = [
  { id: "yangxu", name: "杨旭", avatar: "杨", city: "北京", company: "个人实践", role: "投资 / 研究", industry: "新媒体 MCN、金融投资、AI 职场培训", ai: ["Agent", "AI 产品", "AI 应用"], project: "用 CodeBuddy 搭建缠论半自动交易系统，并持续实践 AI 内容生产。", ability: "互联网与新媒体运营、AI 培训、股票与 ETF 交易、个人媒体。", need: "继续完善 AI 辅助交易系统，并交流金融 Agent 与 AI 内容创作。" },
  { id: "weilai", name: "魏来", avatar: "魏", city: "重庆", company: "自媒体商业赛道、量化交易", role: "Founder / 创业者", industry: "金融、商业、传媒", ai: ["Agent", "AI 应用"], project: "推进商业自媒体矩阵与量化交易实践。", ability: "AI 产品设计、自媒体运营与量化交易。", need: "寻找量化交易、商业内容与 AI 产品方向的同行。" },
  { id: "jasper", name: "jasper", avatar: "J", city: "新加坡", company: "bbx.com", role: "Founder / 创业者", industry: "金融与海外资产", ai: ["AI 应用", "数据分析"], project: "推进海外金融资产数据分析产品 bbx.com。", ability: "区块链与海外资产研究。", need: "寻找具备海外业务经验的创业者。" },
  { id: "zizhe", name: "梓哲", avatar: "梓", city: "北京", company: "云南沃茂科技公司", role: "投资 / 研究", industry: "生态环境、媒体、智慧农业机器人", ai: ["Agent", "AI 产品", "AI Coding"], project: "智慧农业机器人应用。", ability: "AI 行业研究与应用、生态环境和智慧农业机器人。", need: "交流 AI 出海、Physical AI 与智慧农业机器人应用。" },
  { id: "zhujiaoshou", name: "朱叫兽", avatar: "朱", city: "上海", company: "上海帷尔自动化有限公司", role: "Founder / 创业者", industry: "跨境出海、机器人", ai: ["Agent", "AI Coding"], project: "工业自动化与机器人出海业务。", ability: "外贸、跨境业务、GEO 与机器人行业实践。", need: "寻找用 AI 推动业务增长和海外推广的同行。" },
  { id: "sylvan", name: "Sylvan", avatar: "S", city: "南京", company: "长三角电商直播示范区", role: "产业方", industry: "文旅、政府、教育", ai: ["AI 产品"], project: "电商直播与文旅产业项目。", ability: "产业策划、商务与政府平台资源。", need: "寻找愿意在南京落地、具有市场效用的 AI 产品或团队。" },
  { id: "sumaokin", name: "苏茂金", avatar: "苏", city: "广州", company: "广州市飞鑫信息科技有限公司", role: "Founder / 创业者", industry: "运营商、大数据", ai: ["AI 产品", "AI 应用"], project: "AI 在企业管理与数字员工中的应用。", ability: "产品设计、大数据平台应用与数据治理。", need: "交流 AI 数字员工和 AI ERP 的产品实践。" },
  { id: "huangwenqiang", name: "黄文强", avatar: "黄", city: "桂林", company: "桂林三体网络科技有限公司", role: "运营 / 增长", industry: "实体门店", ai: ["LLM", "Agent", "AI Coding"], project: "帮助实体门店开展线上运营和流量增长。", ability: "产品设计、运营策划与流量运营。", need: "了解更多 AI 落地应用实操方法和 Agent 实践。" },
  { id: "gu", name: "谷先生", avatar: "谷", city: "石家庄", company: "个人实践", role: "Founder / 创业者", industry: "企业服务", ai: ["AI 产品", "AI 应用"], project: "OEM 代工、直播与货架电商、跨境电商。", ability: "销售与企业服务。", need: "用 AI 优化组织人效、提升工作效率。" },
  { id: "aihui", name: "爱辉", avatar: "爱", city: "长沙", company: "与创科技", role: "Founder / 创业者", industry: "电商、短视频与投流", ai: ["LLM", "Agent", "RAG", "AI Coding"], project: "面向短视频和流量投放场景构建垂直 AI 应用。", ability: "电商、短视频、广告投放与 AI 编程。", need: "寻找深耕 AI 应用落地的实践者。" },
  { id: "zengjingsi", name: "曾景斯", avatar: "曾", city: "广州", company: "院外随访（广州）", role: "Founder / 创业者", industry: "医疗", ai: ["AI 应用", "AI Coding"], project: "推进院外康复随访与医疗 AI 工具。", ability: "医疗产品运营、销售与医疗渠道合作。", need: "交流医疗 AI 研究、临床数据和合规应用。" },
  { id: "guowei", name: "国伟", avatar: "国", city: "郑州", company: "大健康连锁和电商", role: "Founder / 创业者", industry: "电商、连锁与品牌", ai: ["Agent", "AI 应用"], project: "用 AI 提升连锁招商、电商运营与品牌获客。", ability: "品牌推广、自媒体、连锁招商与电商。", need: "寻找 AI 与实体增长结合的可复用方法。" },
  { id: "aze", name: "阿澤", avatar: "澤", city: "上海", company: "阅文集团", role: "行业从业者", industry: "游戏、跨境电商", ai: ["Agent", "AI 应用"], project: "规模化生产高质量可购物短视频。", ability: "游戏发行、业务流程设计与内容产品。", need: "交流 AI 与跨境电商的真实业务闭环。" },
  { id: "ayao", name: "阿耀", avatar: "耀", city: "深圳", company: "LuckyShort 海外短剧", role: "Founder / 创业者", industry: "游戏、短剧与 AI", ai: ["Agent"], project: "推进海外 AI 短剧产品与内容数据飞轮。", ability: "短剧生产 Agent、剧本 Agent 与海外内容发行。", need: "寻找海外内容、模型能力与商业化方向的合作伙伴。" },
  { id: "xiaowang", name: "小王", avatar: "王", city: "南京", company: "华飞信息科技", role: "运营 / 增长", industry: "AI 漫剧、AI 直播、AI 运营", ai: ["LLM", "Agent", "AI 应用"], project: "为园区商户提供低成本 AI 内容、直播与运营方案。", ability: "Agent 工作流、内容自动化和本地模型部署。", need: "寻找成熟的 Agent 商业化与 AI 内容电商伙伴。" },
];

const roles = [
  { name: "行业资源方", count: 12, share: "25.0%", description: "场景入口 · 行业渠道 · 产业关系", memberIds: ["sylvan", "zengjingsi", "zizhe"] },
  { name: "流量与增长", count: 7, share: "14.6%", description: "投流 · 内容矩阵 · 获客链路", memberIds: ["aihui", "huangwenqiang", "xiaowang"] },
  { name: "出海与跨境", count: 10, share: "20.8%", description: "海外渠道 · 本地化 · 跨境供应链", memberIds: ["aze", "ayao", "zhujiaoshou"] },
  { name: "企业服务落地", count: 8, share: "16.7%", description: "ToB 交付 · 流程改造 · 大客户", memberIds: ["sumaokin", "gu", "guowei"] },
  { name: "技术构建者", count: 6, share: "12.5%", description: "工程实现 · 模型 · Agent", memberIds: ["aihui", "zhujiaoshou", "yangxu"] },
  { name: "资本与研究", count: 5, share: "10.4%", description: "资本视角 · 研判 · 金融基础", memberIds: ["yangxu", "jasper", "weilai"] },
];

const leaderboard = [
  ["苏茂金", "苏", 87, "分享互动与内容共建", "sumaokin"], ["葡萄", "葡", 83, "多期讨论与有效补充"], ["曾景斯", "曾", 81, "医疗议题与连续互动", "zengjingsi"], ["老方", "方", 80, "主持、整理与现场问答", "me"], ["朱枫", "朱", 74, "行业分享与讨论共建"], ["国伟", "国", 71, "实体增长与案例分享", "guowei"], ["杨旭", "杨", 68, "金融实践与主题分享", "yangxu"], ["爱辉", "爱", 66, "AI 应用与投流实践", "aihui"], ["阿澤", "澤", 61, "内容产品与跨境分享", "aze"], ["张武", "张", 58, "产业实践与持续互动"], ["小王", "王", 55, "Agent 工作流与内容实践", "xiaowang"], ["黄文强", "黄", 54, "实体门店与运营交流", "huangwenqiang"], ["梓哲", "梓", 51, "智慧农业与行业研究", "zizhe"], ["阿耀", "耀", 48, "海外短剧与内容实践", "ayao"], ["Sylvan", "S", 46, "产业落地与资源连接", "sylvan"],
].map((item, index) => ({ rank: index + 1, name: item[0], avatar: item[1], points: item[2], note: item[3], memberId: item[4] || "" }));

const pointRules = {
  interactive: [
    { points: 30, title: "活动主持", copy: "完成当期活动主持、流程衔接与现场秩序维护" },
    { points: 20, title: "分享嘉宾", copy: "完成本期主题分享" },
    { points: 10, title: "关键提问 / 深度回应", copy: "推动讨论形成关键问答" },
    { points: 6, title: "多次有效互动", copy: "多次参与讨论、补充案例或回应他人" },
    { points: 3, title: "单次发言 / 回应", copy: "有明确观点、问题或内容回应" },
    { points: 1, title: "轻互动", copy: "鼓掌、点赞、表情、感谢或简短回应" },
  ],
  special: [
    { points: 1000, title: "好礼积分", copy: "为群友赠送有实际价值的礼品" },
    { points: 300, title: "成功邀请", copy: "邀请一位申请者审核通过并正式入群" },
    { points: 100, title: "Demo 秀", copy: "现场展示可运行产品、原型或完整应用并完成讲解" },
  ],
};

function getArchive(id) { return archives.find((item) => item.id === id) || archives[0]; }
function getBounty(id) { return bounties.find((item) => item.id === id) || bounties[0]; }
function getMember(id) { return members.find((item) => item.id === id) || members[0]; }

module.exports = { schedules, archives, bounties, members, roles, leaderboard, pointRules, getArchive, getBounty, getMember };
