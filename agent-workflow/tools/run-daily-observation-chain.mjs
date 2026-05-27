#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const mode = args.get("mode") || "write-qc";
const model = args.get("model") || process.env.OPENAI_MODEL || "gpt-5.2";
const openaiKey = process.env.OPENAI_API_KEY || "";
const reportsDir = path.join(root, "agent-workflow", "reports");
const dailyDir = path.join(root, "01-SiteV2", "content", "03-daily-observation");

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return exists(file) ? fs.readFileSync(file, "utf8") : "";
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function listFiles(dir, predicate = () => true) {
  if (!exists(dir)) return [];
  const rows = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) rows.push(...listFiles(file, predicate));
    else if (predicate(file)) rows.push(file);
  }
  return rows;
}

function block(reason, details = {}) {
  const file = path.join(reportsDir, `${date}-daily-observation-chain-blocked.md`);
  const detailLines = Object.entries(details).map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}`);
  write(file, [
    `# ${date} Daily Observation Chain Blocked`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    "- status: blocked",
    `- mode: ${mode}`,
    `- openai_api_key: ${openaiKey ? "configured" : "missing"}`,
    `- reason: ${reason}`,
    "",
    "## Details",
    "",
    ...(detailLines.length ? detailLines : ["- none"]),
    "",
  ].join("\n"));
  console.log(JSON.stringify({ ok: false, date, report: rel(file), reason, details }, null, 2));
  process.exit(2);
}

function requireChainReady() {
  const result = spawnSync(process.execPath, [
    "agent-workflow/tools/assert-daily-production-chain.mjs",
    `--date=${date}`,
    "--stage=pre-daily-observation",
    "--block-stale=true",
  ], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    process.exit(result.status || 2);
  }
}

async function callOpenAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model,
      input: prompt,
    }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json?.error?.message || `OpenAI request failed with HTTP ${response.status}`);
  }
  const text = json.output_text ||
    json.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("\n").trim();
  if (!text) throw new Error("OpenAI response did not include output text");
  return text;
}

function materialsBundle() {
  const files = [
    path.join(root, "agent-workflow", "reports", `${date}-guanlan-daily-monitor-qc.md`),
    path.join(root, "agent-workflow", "reports", `${date}-guanlan-monitor-quality-gate.md`),
    path.join(root, "01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`),
    path.join(root, "01-SiteV2", "content", "04-business-signals", "signals", `${date}-signals.md`),
    path.join(root, "01-SiteV2", "content", "05-frontier-opinions", `${date}-opinion-cards.md`),
    path.join(root, "agent-workflow", "reports", `${date}-trend-candidate-decision.md`),
    path.join(root, "agent-workflow", "reports", `${date}-no-trend-candidate-decision.md`),
  ];
  return files
    .filter(exists)
    .map((file) => `\n\n# FILE: ${rel(file)}\n\n${read(file).slice(0, 24000)}`)
    .join("\n");
}

function skillText(file) {
  return read(file).slice(0, 16000);
}

function loadDailyObservationSkill(name) {
  const home = process.env.USERPROFILE || process.env.HOME || "";
  const candidates = [
    path.join(root, "skills", name, "SKILL.md"),
    path.join(home, ".skill-store", name, "SKILL.md"),
  ];
  const file = candidates.find(exists) || candidates[0];
  return {
    file,
    source: file.startsWith(path.join(root, "skills")) ? "repo" : "local_skill_store",
    text: skillText(file),
  };
}

function latestDailyObservationFile() {
  return listFiles(dailyDir, (file) => path.basename(file).startsWith(`${date}--daily-observation`) && file.endsWith(".md"))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || "";
}

async function main() {
  requireChainReady();
  if (!openaiKey) {
    block("OPENAI_API_KEY is required for Daily Observation pitch / write / QC automation", {
      required_secret: "OPENAI_API_KEY",
      safe_behavior: "blocked report only; no article is generated",
    });
  }

  const pitchSkill = loadDailyObservationSkill("guanlan-daily-observation-pitch");
  const writerSkill = loadDailyObservationSkill("guanlan-daily-observation");
  const qcSkill = loadDailyObservationSkill("guanlan-daily-observation-qc");
  if (!pitchSkill.text || !writerSkill.text || !qcSkill.text) {
    block("Daily Observation skill files are missing on this runner", {
      pitch_skill_present: pitchSkill.text ? "true" : "false",
      pitch_skill_path: rel(pitchSkill.file),
      writer_skill_present: writerSkill.text ? "true" : "false",
      writer_skill_path: rel(writerSkill.file),
      qc_skill_present: qcSkill.text ? "true" : "false",
      qc_skill_path: rel(qcSkill.file),
    });
  }

  const bundle = materialsBundle();
  if (!bundle.trim()) block("no daily materials available for Daily Observation");

  const pitchPrompt = [
    "Use the following Guanlan Daily Observation Pitch skill. Output only the pitch decision markdown.",
    `Skill source: ${pitchSkill.source} (${rel(pitchSkill.file)})`,
    pitchSkill.text,
    "Daily materials:",
    bundle,
  ].join("\n\n");
  const pitch = await callOpenAI(pitchPrompt);
  const pitchFile = path.join(reportsDir, `${date}-daily-observation-pitch.md`);
  write(pitchFile, pitch);
  if (mode === "pitch-only") {
    console.log(JSON.stringify({ ok: true, date, mode, pitch: rel(pitchFile), depends_on: ["OPENAI_API_KEY"] }, null, 2));
    return;
  }

  const writePrompt = [
    "Use the following Guanlan Daily Observation Writer skill to write one Daily Observation article.",
    "Do not expose internal Raw / Pool / gate language in frontstage copy.",
    `Skill source: ${writerSkill.source} (${rel(writerSkill.file)})`,
    writerSkill.text,
    "Pitch decision:",
    pitch,
    "Daily materials:",
    bundle,
  ].join("\n\n");
  const article = await callOpenAI(writePrompt);
  const slug = args.get("slug") || "auto-daily-observation";
  const articleFile = path.join(dailyDir, `${date}--daily-observation--${slug}.md`);
  write(articleFile, article);

  const qcPrompt = [
    "Use the following Guanlan Daily Observation QC skill. Output a QC report with explicit `decision: pass` or `decision: block`.",
    `Skill source: ${qcSkill.source} (${rel(qcSkill.file)})`,
    qcSkill.text,
    "Article to QC:",
    article,
  ].join("\n\n");
  const qc = await callOpenAI(qcPrompt);
  const qcFile = path.join(reportsDir, `${date}-daily-observation-qc.md`);
  write(qcFile, qc);

  if (!/\bdecision:\s*pass\b/iu.test(qc)) {
    block("Daily Observation QC did not explicitly pass", {
      article: rel(articleFile),
      qc_report: rel(qcFile),
    });
  }

  console.log(JSON.stringify({
    ok: true,
    date,
    mode,
    depends_on: ["OPENAI_API_KEY"],
    skill_sources: {
      pitch: pitchSkill.source,
      writer: writerSkill.source,
      qc: qcSkill.source,
    },
    pitch: rel(pitchFile),
    article: rel(articleFile),
    qc: rel(qcFile),
  }, null, 2));
}

main().catch((error) => {
  block(error?.message || String(error), { model });
});
