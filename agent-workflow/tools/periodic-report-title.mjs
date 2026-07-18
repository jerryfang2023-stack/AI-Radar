const GENERIC_REPORT_LABEL = /^(?:\d{4}\s*年?\s*\d{1,2}\s*月?\s*)?(?:AI\s*)?(?:商业变化判断|商业结构与机会)?(?:周报|月报)(?:[:：]|$)/iu;
const HEADLINE_TENSION = /(?:：|？|不是|不再|不缺|缺的是|真正|却|反而|别再|越.{1,12}越|指向同一件事)/u;
const BUSINESS_CONSEQUENCE = /(?:预算|采购|成本|责任|结果|付费|买单|稀缺|门槛|风险|收入|利润|交付|需求|机会|业务流程|工作流|商业信号|主战场)/u;
const ABSTRACT_TRANSITION = /(?:进入|转向|升温|浮现|落地|加速)/gu;

export const periodicReportTitlePromptRules = [
  "标题只表达本期最强的一个判断，不概括整份报告，也不写成周报/月报标签。",
  "标题使用简体中文，控制在 14-42 个可见字符；允许保留必要的 AI、Agent、AI Coding 等术语。",
  "标题必须同时包含认知张力和商业后果：可使用‘不是/却/反而/真正/别再/缺的是/越...越...’或冒号结构，并点明预算、采购、成本、责任、结果、付费、稀缺、门槛、风险、交付、需求或机会中的至少一项。",
  "优先从核心结论、反共识判断或最高确定性机会中选题；不要使用‘从 A 进入 B’‘同步升温’‘加速落地’等抽象变化词堆叠。",
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
  if (!HEADLINE_TENSION.test(title)) problems.push("report title needs a clear tension or counter-intuitive hook");
  if (!BUSINESS_CONSEQUENCE.test(title)) problems.push("report title needs a concrete business consequence");
  if (transitions.length >= 2 || /同步升温|加速落地/u.test(title)) problems.push("report title stacks abstract transition words");

  return problems;
}
