import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const changes = [];

const canonical = new Map(
  Object.entries({
    "AI-Agent": "AI Agent",
    "AI编程": "AI Coding",
    "AI-Coding": "AI Coding",
    AICoding: "AI Coding",
    "AI增长": "AI营销",
    "Voice-AI": "AI客服",
    语音Agent: "AI客服",
    "AI客服/语音Agent": "AI客服",
    企业知识库: "企业数据智能",
    企业数据: "企业数据智能",
    "企业数据/RAG": "企业数据智能",
    RAG: "企业数据智能",
    企业服务: "企业工作流",
    AI企业服务: "企业工作流",
    企业AI工作流: "企业工作流",
    AI治理与安全: "AI治理",
    Agent治理: "AI治理",
    融资: "融资证据",
    融资与估值: "融资证据",
    投资: "融资证据",
    产品发布: "产品发布",
    并购: "融资证据",
    收购并购: "融资证据",
    开源: "产品发布",
    企业采用: "客户采用",
    合作: "客户采用",
    "合作/生态": "客户采用",
    生态: "客户采用",
    企业客户: "客户采用",
    客户案例: "客户采用",
    商业化验证: "收入增长",
    监管: "监管政策",
    政策: "监管政策",
    招投标: "招投标 / 采购",
    采购: "招投标 / 采购",
    成熟期: "成熟化",
    增长期: "升温",
    "增长期（有客户）": "升温",
    "早期（无收入）": "新出现",
    早期: "新出现",
    海外: "全球",
    中国: "中国适配",
    中大型: "大中型企业",
    中大型企业: "大中型企业",
    大型: "大中型企业",
    营销增长: "市场营销",
    增长: "市场营销",
    "销售/客服": "客服售后",
    投标支持: "采购投标",
    合规风控: "法务合规",
    运营效率: "运营流程",
    数据分析: "企业数据智能",
    "技术/工程": "工程研发",
    技术: "工程研发",
    IT: "工程研发",
    产品: "工程研发",
    研发: "工程研发",
    安全: "法务合规",
    质量: "客服售后",
    售前: "销售",
    "AI Native": "AI营销",
  })
);

const genericTags = new Set([
  "观澜AI",
  "AI商业雷达",
  "AI商业决策内参",
  "机会卡库",
  "Signals",
  "AI机会评分",
  "Trends",
  "Opportunity Scoring",
  "AI趋势",
  "AI创业机会",
]);

const unique = (items) => {
  const seen = new Set();
  const out = [];
  const sourceItems = Array.isArray(items) ? items : [items];
  for (const raw of sourceItems.flatMap((item) => (Array.isArray(item) ? item : String(item || "").split(/[\/｜|,，、;；\n]/)))) {
    const cleaned = String(raw || "")
      .replace(/^['"]|['"]$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleaned || genericTags.has(cleaned)) continue;
    const key = canonical.get(cleaned) || canonical.get(cleaned.replace(/\s+/g, "")) || cleaned;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(key);
    }
  }
  return out;
};

const updateFrontmatterTags = (file, desiredTags) => {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) return;
  const text = fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return;

  const tags = unique(desiredTags);
  const tagBlock = ["tags:", ...tags.map((tag) => `  - "${tag}"`)].join("\n");
  const lines = match[1].split("\n");
  const start = lines.findIndex((line) => /^tags:\s*$/.test(line));
  let next = start + 1;
  let newLines;

  if (start >= 0) {
    while (next < lines.length && /^\s+-\s+/.test(lines[next])) next += 1;
    newLines = [...lines.slice(0, start), ...tagBlock.split("\n"), ...lines.slice(next)];
  } else {
    newLines = [...lines, ...tagBlock.split("\n")];
  }

  const updated = `---\n${newLines.join("\n")}\n---${text.slice(match[0].length)}`;
  if (updated !== text) {
    fs.writeFileSync(target, updated, "utf8");
    changes.push(file);
  }
};

const dailyTags = {
  "01-Signals/2026-04-29-AI商业雷达.md": ["AI营销", "AI Agent", "AI客服", "AI Coding", "企业工作流", "企业数据智能", "融资证据", "产品发布", "全球"],
  "01-Signals/2026-04-30-AI商业雷达.md": ["AI营销", "企业工作流", "AI治理", "AI基础设施", "AI Agent", "融资证据", "产品发布", "全球"],
  "01-Signals/2026-05-01-AI商业雷达.md": ["AI客服", "AI Coding", "AI营销", "企业工作流", "具身智能", "融资证据", "产品发布", "全球"],
  "01-Signals/2026-05-02-AI商业雷达.md": ["AI Agent", "AI治理", "AI基础设施", "具身智能", "融资证据", "产品发布", "全球", "中国适配"],
  "01-Signals/2026-05-03-AI商业雷达.md": ["AI Agent", "AI治理", "企业数据智能", "医疗AI", "专业服务AI", "AI客服", "AI营销", "融资证据", "产品发布", "客户采用", "全球"],
  "02-Scoring/2026-04-29-AI机会评分.md": ["AI营销", "AI Agent", "AI客服", "AI Coding", "企业工作流", "企业数据智能", "融资证据", "成熟化", "升温"],
  "02-Scoring/2026-04-30-AI机会评分.md": ["AI营销", "企业工作流", "AI治理", "AI基础设施", "AI Agent", "融资证据", "成熟化", "升温"],
  "02-Scoring/2026-05-01-AI机会评分.md": ["AI客服", "AI Coding", "AI营销", "企业工作流", "具身智能", "融资证据", "升温", "观察"],
  "02-Scoring/2026-05-02-AI机会评分.md": ["AI Agent", "AI治理", "AI基础设施", "具身智能", "融资证据", "产品发布", "升温", "成熟化"],
  "02-Scoring/2026-05-03-AI机会评分.md": ["AI Agent", "AI治理", "企业数据智能", "医疗AI", "专业服务AI", "AI客服", "AI营销", "融资证据", "客户采用", "升温"],
  "03-Trends/AI趋势总表.md": ["AI营销", "AI客服", "AI Agent", "AI Coding", "企业数据智能", "AI治理", "医疗AI", "具身智能", "升温", "观察"],
};

for (const [file, tags] of Object.entries(dailyTags)) updateFrontmatterTags(file, tags);

const opportunityTags = {
  "AI Agent基础设施服务.md": ["AI Agent", "AI基础设施", "工程研发", "开发团队", "大中型企业", "观察"],
  "AICoding驱动一人公司工具链.md": ["AI Coding", "工程研发", "开发团队", "中小企业", "观察"],
  "AI互动内容平台.md": ["AI营销", "市场营销", "运营流程", "中小企业", "新出现"],
  "AI企业客服执行Agent.md": ["AI客服", "AI Agent", "客服售后", "工单与质检", "大中型企业", "客户采用", "升温"],
  "AI商业洞察与销售赋能Agent.md": ["AI营销", "销售", "市场营销", "销售日报", "中小企业", "观察"],
  "AI基础设施托管服务.md": ["AI基础设施", "工程研发", "开发团队", "大中型企业", "观察"],
  "AI增长Agent.md": ["AI营销", "市场营销", "运营流程", "销售日报", "中小企业", "观察"],
  "AI客服质检与工单智能Agent.md": ["AI客服", "客服售后", "工单与质检", "大中型企业", "观察"],
  "AI工程仿真软件.md": ["AI Coding", "工程研发", "大中型企业", "观察"],
  "AI招投标Agent.md": ["AI Agent", "企业工作流", "采购投标", "标书响应", "大中型企业", "中国适配", "观察"],
  "AI用户研究Agent.md": ["企业数据智能", "AI营销", "市场营销", "知识库问答", "大中型企业", "客户采用", "升温"],
  "AI营销Agent.md": ["AI营销", "市场营销", "销售日报", "大中型企业", "客户采用", "升温"],
  "AI记忆层基础设施.md": ["AI基础设施", "企业数据智能", "工程研发", "Agent 权限治理", "大中型企业", "观察"],
  "AI语音客服首轮分流助手.md": ["AI客服", "客服售后", "工单与质检", "大中型企业", "中国适配", "观察"],
  "Agent治理与权限审计服务.md": ["AI治理", "AI Agent", "法务合规", "Agent 权限治理", "大中型企业", "客户采用", "升温"],
  "专业服务AI工作流平台.md": ["专业服务AI", "企业工作流", "法务合规", "文档流程", "大中型企业", "客户采用", "升温"],
  "中小商家AI营销对话平台.md": ["AI营销", "AI客服", "市场营销", "销售", "中小企业", "中国适配", "观察"],
  "临床影像AI辅助诊断平台.md": ["医疗AI", "临床影像辅助", "医疗机构", "客户采用", "观察"],
  "企业AI工作流样板库.md": ["企业工作流", "运营流程", "文档流程", "中小企业", "观察"],
  "企业Agent工作平台.md": ["AI Agent", "企业工作流", "运营流程", "Agent 权限治理", "大中型企业", "客户采用", "升温"],
  "企业数据智能体控制平面.md": ["企业数据智能", "AI Agent", "运营流程", "知识库问答", "Agent 权限治理", "大中型企业", "客户采用", "升温"],
  "企业文档与财务流程Agent.md": ["企业工作流", "AI Agent", "财务", "采购投标", "文档流程", "中小企业", "中国适配", "客户采用"],
  "具身智能控制栈与评测平台.md": ["具身智能", "工程研发", "大中型企业", "观察"],
  "具身智能物流机器人.md": ["具身智能", "运营流程", "大中型企业", "客户采用", "观察"],
  "无人系统任务执行智能体平台.md": ["具身智能", "AI Agent", "运营流程", "Agent 权限治理", "大中型企业", "观察"],
  "端侧推理芯片与软件栈.md": ["AI基础设施", "工程研发", "大中型企业", "观察"],
  "行业专家知识Agent化.md": ["专业服务AI", "企业数据智能", "运营流程", "知识库问答", "大中型企业", "中国适配", "观察"],
};

for (const [name, tags] of Object.entries(opportunityTags)) {
  updateFrontmatterTags(`07-Opportunities/${name}`, tags);
}

const sourceTags = {
  "05-Point/sources/2026-05-03/blog-anthropic-april-23-postmortem.md": ["AI Coding 观点", "AI Coding", "AI治理", "技术博客"],
  "05-Point/sources/2026-05-03/blog-claude-connectors-everyday-life.md": ["产品策略观点", "企业工作流", "AI Agent", "技术博客"],
  "05-Point/sources/2026-05-03/blog-claude-managed-agents-memory.md": ["Agent 工作流观点", "AI Agent", "AI治理", "技术博客"],
  "05-Point/sources/2026-05-03/youtube-no-priors-baseten.md": ["模型基础设施观点", "AI基础设施", "AI Agent", "播客"],
};

for (const [file, tags] of Object.entries(sourceTags)) updateFrontmatterTags(file, tags);

const labelPattern = /^(\s*-\s*标签[\uFF1A:]\s*)(.*)$/;
for (const file of fs.readdirSync(path.join(root, "01-Signals")).filter((name) => name.endsWith(".md"))) {
  const target = path.join(root, "01-Signals", file);
  const text = fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(labelPattern);
    if (!match) {
      out.push(lines[i]);
      continue;
    }
    let value = match[2].trim();
    if (!value && i + 1 < lines.length && /^\s+[^-#]/.test(lines[i + 1]) && /[｜/]/.test(lines[i + 1])) {
      value = lines[i + 1].trim();
      i += 1;
    }
    out.push(`${match[1]}${unique(value).join(" / ")}`);
  }
  const updated = out.join("\n");
  if (updated !== text) {
    fs.writeFileSync(target, updated, "utf8");
    changes.push(`01-Signals/${file}`);
  }
}

const pointTopicByRank = new Map(
  Object.entries({
    1: ["Agent 工作流观点", "AI Agent", "企业工作流", "AI治理"],
    2: ["Agent 工作流观点", "AI Agent", "企业工作流", "专业服务AI"],
    3: ["模型基础设施观点", "AI基础设施", "AI Agent"],
    4: ["Agent 工作流观点", "AI Agent", "AI治理", "企业数据智能"],
    5: ["AI Coding 观点", "AI Coding", "AI治理"],
    6: ["AI Coding 观点", "AI Coding", "Agent 工作流观点"],
    7: ["Agent 工作流观点", "企业数据智能", "企业工作流"],
    8: ["产品策略观点", "企业工作流", "AI Agent"],
    9: ["产品策略观点", "AI营销", "中小企业"],
    10: ["AI Coding 观点", "AI Coding", "产品策略观点"],
    11: ["Agent 工作流观点", "企业工作流", "AI Agent"],
    12: ["企业数据智能", "AI Agent", "企业工作流"],
    13: ["模型基础设施观点", "AI基础设施", "AI Coding"],
    14: ["AI Coding 观点", "AI Coding", "AI治理"],
    15: ["模型基础设施观点", "AI基础设施", "AI Coding"],
    16: ["AI Coding 观点", "AI Coding", "Agent 工作流观点"],
    17: ["AI Coding 观点", "AI Coding", "产品策略观点"],
    18: ["产品策略观点", "AI营销", "中小企业"],
    19: ["产品策略观点", "AI Coding", "中小企业"],
    20: ["AI Coding 观点", "AI Coding", "Agent 工作流观点"],
    21: ["Agent 工作流观点", "AI基础设施", "AI治理"],
    22: ["产品策略观点", "运营流程", "AI营销"],
    23: ["产品策略观点", "AI基础设施", "AI Coding"],
    24: ["产品策略观点", "企业工作流", "AI Agent"],
  })
);

{
  const file = "05-Point/2026-05-03-The-Point.md";
  const target = path.join(root, file);
  const text = fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n");
  let currentRank = "";
  const updated = text
    .split("\n")
    .map((line) => {
      const heading = line.match(/^###\s+Point\s+(\d+)/);
      if (heading) currentRank = heading[1];
      if (/^-\s*主题[\uFF1A:]/.test(line) && pointTopicByRank.has(currentRank)) {
        return `- 主题：${pointTopicByRank.get(currentRank).join(", ")}`;
      }
      return line;
    })
    .join("\n");
  if (updated !== text) {
    fs.writeFileSync(target, updated, "utf8");
    changes.push(file);
  }
}

const uniqueChanges = [...new Set(changes)].sort();
console.log(`Updated ${uniqueChanges.length} files`);
for (const file of uniqueChanges) console.log(file);
