const essays = [
  {
    id: "community-essay-2026-08-13-ai-judgment", contentType: "community-essay", typeLabel: "社群精华", date: "2026-08-13", dateShort: "08.13", issue: "精华", readingTime: "8 分钟",
    title: "AI 判断力、企业服务与垂直赛道",
    summary: "AI 降低了生产门槛，却没有降低验证门槛。企业服务真正的瓶颈，正在从开发速度转向需求识别、客户入口与持续交付。",
    author: "观澜编辑部",
    blocks: [
      { id: "c1", type: "heading", text: "生产门槛降低，验证门槛仍然存在" },
      { id: "c2", type: "paragraph", text: "非技术背景的创业者已经可以借助 AI 快速搭建复杂系统。但如果缺少独立判断结果正确性的能力，早期的功能繁荣反而可能掩盖底层错误。" },
      { id: "c3", type: "heading", text: "企业服务的瓶颈转向客户入口" },
      { id: "c4", type: "paragraph", text: "会议转写、需求整理与 AI Coding 可以压缩方案交付周期。真正困难的是找到真实客户、进入采购体系，并形成持续服务能力。" },
      { id: "c5", type: "heading", text: "垂直经验仍然决定产品方向" },
      { id: "c6", type: "paragraph", text: "长期行业积累帮助创业者识别哪些需求值得做、哪些结果必须人工复核，以及客户真正愿意为什么付费。" },
    ],
  },
  {
    id: "community-essay-2026-08-12-delivery-path", contentType: "community-essay", typeLabel: "社群精华", date: "2026-08-12", dateShort: "08.12", issue: "精华", readingTime: "6 分钟",
    title: "从 AI 工具使用者到项目交付者：一条更短的实践路径",
    summary: "工具熟练度不是交付能力。真正的分水岭，是能否把需求拆成可验证流程，并对最终结果负责。",
    author: "观澜编辑部",
    blocks: [
      { id: "d1", type: "heading", text: "工具熟练不等于能够交付" },
      { id: "d2", type: "paragraph", text: "客户真正关心的是问题能否被解决、结果是否稳定，以及出现错误时谁来负责。" },
      { id: "d3", type: "heading", text: "先把需求拆成流程" },
      { id: "d4", type: "paragraph", text: "可交付的 AI 项目需要明确输入、处理步骤、输出标准和复核责任。" },
    ],
  },
  {
    id: "community-essay-2026-08-08-ai-service", contentType: "community-essay", typeLabel: "社群精华", date: "2026-08-08", dateShort: "08.08", issue: "精华", readingTime: "7 分钟",
    title: "从一个下午的交付，到一套可复用的 AI 企业服务",
    summary: "项目制服务要走向复用，需要把需求判断、交付步骤、验收标准和后续维护一起产品化。",
    author: "观澜编辑部",
    blocks: [
      { id: "s1", type: "heading", text: "快速交付只是起点" },
      { id: "s2", type: "paragraph", text: "同样的需求是否能由另一位成员复现，才是服务能否扩大的关键。" },
      { id: "s3", type: "heading", text: "把隐性经验变成明确步骤" },
      { id: "s4", type: "paragraph", text: "需求访谈、数据准备、权限确认、异常处理和验收都需要形成检查表。" },
    ],
  },
  {
    id: "community-essay-2026-08-04-vertical-loop", contentType: "community-essay", typeLabel: "社群精华", date: "2026-08-04", dateShort: "08.04", issue: "精华", readingTime: "9 分钟",
    title: "医疗、制造和零售中的 AI 落地：先找到可验证的小闭环",
    summary: "垂直行业不缺宏大方案，缺的是责任边界清楚、数据可获得、结果可复核的小型业务闭环。",
    author: "观澜编辑部",
    blocks: [
      { id: "v1", type: "heading", text: "从低风险流程开始" },
      { id: "v2", type: "paragraph", text: "首个项目不应直接进入不可逆的核心决策，资料整理、异常提示和标准问答更适合作为验证入口。" },
      { id: "v3", type: "heading", text: "结果必须可复核" },
      { id: "v4", type: "paragraph", text: "一个小闭环必须能够回答输入从哪里来、输出由谁确认、错误如何发现、结果如何记录。" },
    ],
  },
];

function getCommunityEssays() {
  return {
    index: essays.map(({ blocks, ...item }) => ({ ...item, sectionCount: blocks.filter((block) => block.type === "heading").length })),
    details: Object.fromEntries(essays.map((item) => [item.id, { ...item, sectionCount: item.blocks.filter((block) => block.type === "heading").length }])),
  };
}

module.exports = { getCommunityEssays };
