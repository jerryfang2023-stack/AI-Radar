const GENERIC_REPORT_LABEL = /^(?:\d{4}\s*年?\s*\d{1,2}\s*月?\s*)?(?:AI\s*)?(?:商业变化判断|商业结构与机会)?(?:周报|月报)(?:[:：]|$)/iu;
const BUSINESS_ANCHOR = /(?:预算|采购|成本|账单|责任|结果|付费|买单|稀缺|门槛|风险|安全|收入|利润|转化|客户|产品|部署|交付|需求|机会|业务流程|工作流|商业信号|主战场|工程师|席位|Token|Agent|智能体|代码)/iu;
const ABSTRACT_TRANSITION = /(?:进入|转向|升温|浮现|落地|加速)/gu;
const EMPTY_CLICHE = /(?:赋能|重塑|未来已来|格局已变|值得关注|背后逻辑)/u;
const MECHANICAL_TENSION = [/(?:不是).{0,18}(?:而是|是)/u, /不缺.{0,18}缺的是/u, /缺的不是.{0,18}(?:而是|是)/u, /越.{1,12}越/u, /真正/u];

export const periodicReportTitlePromptRules = [
  "标题只表达本期最强的一个判断，不概括整份报告，也不写成周报/月报标签。",
  "标题使用简体中文，控制在 14-42 个可见字符；允许保留必要的 AI、Agent、AI Coding 等术语。",
  "标题必须有具体商业锚点；可使用数字事实、主体动作与后果、真实问题、经营判断或场景，不强制使用反差词和冒号。",
  "‘不是/而是’‘缺的是’‘真正’‘越...越...’只在正文存在真实对立时使用，不得把它们当作批量标题模板。",
  "优先从核心结论、反共识判断、最高确定性机会或最强事实中选题；不要使用‘从 A 进入 B’‘同步升温’‘加速落地’等抽象变化词堆叠。",
  "不得夸大证据，不得把尚未发生的采购、收入、裁员或事故写成既成事实。",
].join("\n");

export function periodicReportTitleProblems(value = "") {
  const title = String(value || "").replace(/\s+/gu, " ").trim();
  const visibleLength = Array.from(title.replace(/\s+/gu, "")).length;
  const transitions = title.match(ABSTRACT_TRANSITION) || [];
  const problems = [];

  if (!title) return ["report title is missing"];
  if (visibleLength < 14 || visibleLength > 42) problems.push("report title must contain 14-42 visible characters");
  if (GENERIC_REPORT_LABEL.test(title)) problems.push("report title must not be a generic weekly or monthly report label");
  if (!BUSINESS_ANCHOR.test(title)) problems.push("report title needs a concrete business anchor");
  if (EMPTY_CLICHE.test(title)) problems.push("report title contains an empty headline cliche");
  if (transitions.length >= 2 || /同步升温|加速落地/u.test(title)) problems.push("report title stacks abstract transition words");
  if (MECHANICAL_TENSION.filter((pattern) => pattern.test(title)).length >= 2) problems.push("report title stacks mechanical tension templates");

  return problems;
}

export function periodicReportTitleCorpusProblems(values = []) {
  const titles = values.map((value) => String(value || "").trim()).filter(Boolean);
  const families = [
    ["not_but", /(?:不是).{0,18}(?:而是|是)|缺的不是.{0,18}(?:而是|是)/u],
    ["lack_is", /不缺.{0,18}缺的是|缺的是/u],
    ["true_value", /真正/u],
    ["more_more", /越.{1,12}越/u],
    ["colon", /[:：]/u],
  ];
  const problems = [];
  for (const [name, pattern] of families) {
    const count = titles.filter((title) => pattern.test(title)).length;
    if (count > 2) problems.push(`report title corpus overuses ${name}: ${count}`);
  }
  const prefixes = new Map();
  for (const title of titles) {
    const prefix = Array.from(title.replace(/\s+/gu, "")).slice(0, 4).join("");
    prefixes.set(prefix, (prefixes.get(prefix) || 0) + 1);
  }
  for (const [prefix, count] of prefixes) if (prefix && count > 2) problems.push(`report title corpus repeats prefix ${prefix}: ${count}`);
  return problems;
}
