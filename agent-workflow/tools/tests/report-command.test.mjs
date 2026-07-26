import assert from "node:assert/strict";
import test from "node:test";
import { formatRecordedCommand } from "../lib/report-command.mjs";

test("recorded Node commands do not expose the local executable path", () => {
  assert.equal(
    formatRecordedCommand(process.execPath, ["agent-workflow/tools/example.mjs", "--date=2026-07-26"]),
    "node agent-workflow/tools/example.mjs --date=2026-07-26",
  );
});

test("recorded Windows npm commands omit the local command shell path", () => {
  assert.equal(
    formatRecordedCommand("C:\\WINDOWS\\system32\\cmd.exe", [
      "/d",
      "/s",
      "/c",
      "npm run assert:business-frontstage -- --date=2026-07-26",
    ]),
    "npm run assert:business-frontstage -- --date=2026-07-26",
  );
});

test("portable commands remain unchanged", () => {
  assert.equal(formatRecordedCommand("gh", ["run", "list"]), "gh run list");
});
