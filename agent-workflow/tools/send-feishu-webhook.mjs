import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const item = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
}

function sign(timestamp, secret) {
  return crypto
    .createHmac("sha256", `${timestamp}\n${secret}`)
    .update("")
    .digest("base64");
}

async function main() {
  const file = argValue("file");
  const dryRun = process.argv.includes("--dry-run");
  const webhookUrl = process.env.FEISHU_WEBHOOK_URL || process.env.LARK_WEBHOOK_URL || "";
  const secret = process.env.FEISHU_WEBHOOK_SECRET || process.env.LARK_WEBHOOK_SECRET || "";

  if (!file) throw new Error("--file is required");
  const fullPath = path.isAbsolute(file) ? file : path.join(root, file);
  const brief = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const text = brief.feishu_text || `观澜 AI｜${brief.date || ""} 日更结果已生成`;

  const payload = {
    msg_type: "text",
    content: { text },
  };

  if (secret) {
    const timestamp = Math.floor(Date.now() / 1000);
    payload.timestamp = String(timestamp);
    payload.sign = sign(timestamp, secret);
  }

  if (dryRun || !webhookUrl) {
    console.log(JSON.stringify({
      ok: Boolean(webhookUrl) || dryRun,
      mode: dryRun ? "dry_run" : "missing_webhook",
      has_webhook: Boolean(webhookUrl),
      has_secret: Boolean(secret),
      payload,
    }, null, 2));
    if (!dryRun && !webhookUrl) process.exitCode = 2;
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Feishu webhook failed: ${response.status} ${body}`);
  }
  console.log(JSON.stringify({ ok: true, status: response.status, body }, null, 2));
}

main().catch((error) => {
  console.error(error?.message || String(error));
  process.exit(1);
});
