import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const script = fileURLToPath(new URL("../apply-public-entity-profiles-v1.mjs", import.meta.url));
test("new investor profiles survive registry-first build; missing indexed detail still fails", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "profile-stage-"));
  const write = (name, value) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value)); };
  const db = "01-SiteV2/content/11-databases/";
  const site = "01-SiteV2/site/data/";
  try {
    write(db + "public-entity-profile-coverage-v1.json", { institutions: { "INV-new": { name: "New fund" } }, people: {} });
    write(db + "investment-institutions-v1.json", { institutions: [{ id: "INV-new" }] });
    write(site + "data-center-v4-frontstage.json", { investors: [], people: [] });
    write(site + "data-center-v4/indexes/entities.json", { investors: [], people: [] });
    const result = spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout).deferred_details_until_materialization, ["INV-new"]);
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, db + "investment-institutions-v1.json"))).institutions[0].public_profile.name, "New fund");
    write(site + "data-center-v4/indexes/entities.json", { investors: [{ id: "INV-new" }], people: [] });
    const broken = spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
    assert.notEqual(broken.status, 0);
    assert.match(broken.stderr, /missing_institution_detail:INV-new/u);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
