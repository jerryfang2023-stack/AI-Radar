import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const [, , sourceId, fullTextPath, fullTranslationPath = ""] = process.argv;

if (!sourceId || !fullTextPath) {
  console.error("Usage: node agent-workflow/tools/import-point-source-fulltext.mjs <source_id> <full_text_md_or_txt> [full_translation_md_or_txt]");
  process.exit(1);
}

const read = (file) => fs.readFileSync(path.resolve(root, file), "utf8").replace(/\r\n/g, "\n").trim();

const sourceRoot = path.join(root, "05-Point", "sources");
const findSourceFile = (dir) => {
  if (!fs.existsSync(dir)) return "";
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findSourceFile(full);
      if (found) return found;
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const text = fs.readFileSync(full, "utf8");
    if (new RegExp(`^source_id:\\s*${sourceId}\\s*$`, "m").test(text)) return full;
  }
  return "";
};

const replaceSection = (text, heading, content) => {
  const block = `## ${heading}\n\n${content.trim()}\n`;
  const re = new RegExp(`(^##\\s+${heading}\\s*\\n)[\\s\\S]*?(?=\\n##\\s+|$)`, "m");
  if (re.test(text)) return text.replace(re, block);
  return `${text.trim()}\n\n${block}`;
};

const sourceFile = findSourceFile(sourceRoot);
if (!sourceFile) {
  console.error(`Source note not found: ${sourceId}`);
  process.exit(1);
}

let note = fs.readFileSync(sourceFile, "utf8").replace(/\r\n/g, "\n");
note = replaceSection(note, "全文文档", read(fullTextPath));
if (fullTranslationPath) note = replaceSection(note, "全文译文", read(fullTranslationPath));
fs.writeFileSync(sourceFile, `${note.trim()}\n`, "utf8");

console.log(`Imported full text into ${path.relative(root, sourceFile).replaceAll("\\", "/")}`);
