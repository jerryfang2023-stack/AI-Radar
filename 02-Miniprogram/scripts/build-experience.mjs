import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

// Creates a private, disposable native preview. Never changes the release tree.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archiveFile = process.argv[2];
if (!archiveFile || !fs.statSync(archiveFile).isFile()) throw new Error("Pass the approved Demo sharing-detail-data.js path.");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(archiveFile, "utf8"), context, { timeout: 1000 });
const approved = context.window.REAL_SHARING_DETAILS;
if (!approved || !["issue-10", "issue-09", "issue-02"].every((id) => approved[id]?.speakers?.length === 3)) throw new Error("Expected three approved issues, with three speakers each.");
const outputParent = process.argv[3] ? path.resolve(process.argv[3]) : os.tmpdir();
fs.mkdirSync(outputParent, { recursive: true });
let destination;
if (process.argv[4]) {
  destination = path.resolve(process.argv[4]);
  const previous = JSON.parse(fs.readFileSync(path.join(destination, "experience-manifest.json"), "utf8"));
  if (path.dirname(destination) !== outputParent || previous.project !== destination || previous.purpose !== "native-device-preview-only") throw new Error("Only refresh a verified preview directory under the output parent.");
} else destination = fs.mkdtempSync(path.join(outputParent, "guanlan-mini-experience-"));
const mini = path.join(destination, "miniprogram");
fs.cpSync(path.join(root, "miniprogram"), mini, { recursive: true, filter: (source) => !fs.lstatSync(source).isSymbolicLink() && !/(?:^|[\\/])(?:node_modules|\.git|\.env)(?:[\\/]|$)/.test(source) });
const project = JSON.parse(fs.readFileSync(path.join(root, "project.config.json"), "utf8"));
project.projectname = "guanlan-isolated-experience";
project.description = "本机隔离体验，不用于发布";
const localConfig = path.join(root, "project.private.config.json");
if (fs.existsSync(localConfig)) project.libVersion = JSON.parse(fs.readFileSync(localConfig, "utf8")).libVersion || project.libVersion;
fs.writeFileSync(path.join(destination, "project.config.json"), JSON.stringify(project, null, 2));
fs.writeFileSync(path.join(mini, "utils/experience-config.js"), "module.exports = { enabled: true };\n");
fs.writeFileSync(path.join(mini, "utils/sharing-preview.js"), "module.exports = " + JSON.stringify(approved) + ";\n");
// Start at the new community home, without changing production's launch route.
const appFile = path.join(mini, "app.json");
const app = JSON.parse(fs.readFileSync(appFile, "utf8"));
app.pages = ["pages/community/index", ...app.pages.filter((page) => page !== "pages/community/index")];
fs.writeFileSync(appFile, JSON.stringify(app, null, 2));
// No telemetry, login, payments, application submissions or mutations to live services.
fs.writeFileSync(path.join(mini, "utils/analytics.js"), 'module.exports = { APP_VERSION: "isolated-preview", track() {}, flush() { return Promise.resolve(); }, sessionId() { return "isolated-preview"; }, installPageTracking() {} };\n');
const paymentFile = path.join(mini, "utils/payment.js");
const payment = fs.readFileSync(paymentFile, "utf8").replace('function apiRequest(path, options = {}) {', 'function apiRequest(path, options = {}) {\n  if ((options.method || "GET").toUpperCase() !== "GET") return Promise.reject(new Error("隔离体验不执行正式登录、支付或数据提交"));');
fs.writeFileSync(paymentFile, payment);
const manifest = { project: destination, createdAt: new Date().toISOString(), purpose: "native-device-preview-only", archiveIssues: Object.keys(approved), noPush: true, noDeployment: true };
fs.writeFileSync(path.join(destination, "experience-manifest.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
