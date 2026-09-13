export const REPORT_SECTIONS = {
  weekly: ["一句话结论", "趋势热力图 Top 5", "三条趋势链", "行业、角色与工作流影响热力图", "机会卡"],
  monthly: ["本月核心结论", "结构判断", "趋势裁决", "证据完整性", "下游机会假设与机会地图", "结论"],
};

// Measure what the reader receives, not frontmatter, citation IDs or link URLs.
export function visibleReportText(text = "") {
  return String(text).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/u, "")
    .replace(/\[(?:E|O|C):[^\]]+\]/gu, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, "$1")
    .replace(/^Signals:.*$/gmu, "")
    .replace(/[\s#*`|>_-]/gu, "");
}

export function reportStructureProblems(kind, sections) {
  const expected = REPORT_SECTIONS[kind];
  const problems = [];
  if (!expected || sections.length !== expected.length) problems.push(`${kind}_section_count_invalid`);
  expected?.forEach((title, index) => {
    const section = sections[index];
    if (section?.number !== index + 1 || section?.title !== title || !String(section?.content || "").trim()) {
      problems.push(`${kind}_section_${index + 1}_invalid`);
    }
  });
  const removed = kind === "weekly" ? /数据边界|反共识判断|(?:下周)?观察清单|分角色行动结论/u : /数据边界|矛盾与反证|关键矛盾|下月验证清单/u;
  for (const section of sections) {
    if (removed.test(section.title || "") || new RegExp(`^(?:#{1,6}\\s+|\\*\\*)[^\\n]*${removed.source}`, "mu").test(section.content || "")) problems.push(`${kind}_removed_module_present`);
  }
  if (kind === "monthly") {
    if (visibleReportText(sections.map(s => s.content).join("\n")).length < 6000) problems.push("monthly_visible_body_below_6000");
    // A long introduction cannot compensate for empty analysis or opportunity sections.
    const minima = [450, 1700, 1300, 300, 1500, 350];
    minima.forEach((min, index) => {
      if (visibleReportText(sections[index]?.content).length < min) problems.push(`monthly_section_${index + 1}_underdeveloped`);
    });
  }
  return problems;
}

export function parseNumberedReportSections(text = "") {
  return [...String(text).matchAll(/^##\s+(\d+)[.、]\s*(.+)\r?\n([\s\S]*?)(?=^##\s+\d+[.、]|$(?![\s\S]))/gmu)]
    .map(match => ({ number: Number(match[1]), title: match[2].trim(), content: match[3].trim() }));
}
