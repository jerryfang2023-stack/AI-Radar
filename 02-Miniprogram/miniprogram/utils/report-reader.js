// Presentation only: retain server text and keep protected bodies out of the bundle.
function presentReport(report) {
  if (!report || !["weekly", "monthly"].includes(report.type)) return report;
  const blocks = [];
  const source = Array.isArray(report.blocks) ? report.blocks : [];
  for (let i = 0; i < source.length; i++) {
    const block = { ...source[i] };
    if (block.type === "heading") {
      const heading = block.text.match(/^(\d+)[.、．]\s*(.+)$/u);
      if (heading) { block.number = heading[1].padStart(2, "0"); block.title = heading[2]; }
    }
    if (block.type === "list" || block.type === "paragraph") {
      const label = block.text.match(/^([^：\n。！？]{2,24}：)(.+)$/u);
      if (label) { block.lead = label[1]; block.body = label[2]; }
    }
    if (block.type === "table") {
      const group = [block];
      while (source[i + 1]?.type === "table") group.push({ ...source[++i] });
      const cells = group.map((row) => row.text.split(" · "));
      // Legacy text does not preserve empty cells. Only map rectangular rows.
      if (cells.length > 1 && cells[0].length > 1 && cells.every((row) => row.length === cells[0].length)) {
        block.type = "tableCards";
        block.rows = cells.slice(1).map((row, index) => ({
          id: `${block.id}_row_${index}`,
          fields: row.map((value, column) => ({ id: `cell_${column}`, label: cells[0][column], value })),
        }));
        blocks.push(block);
      } else blocks.push(...group);
      continue;
    }
    blocks.push(block);
  }
  return { ...report, readerStyled: true, blocks };
}

module.exports = { presentReport };
