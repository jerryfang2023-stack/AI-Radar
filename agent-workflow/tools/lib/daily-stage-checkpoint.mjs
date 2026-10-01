import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Receipt reuse is bound to both accepted data and the executing code/config.
export function createStageCheckpoint({ file, identity, dryRun = false }) {
  const key = crypto.createHash("sha256").update(JSON.stringify(identity)).digest("hex");
  let state;
  try { state = JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  if (state?.key !== key) state = { schema: "DAILY-MONITOR-V2", key, identity, stages: {} };
  function save() {
    if (dryRun) return;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temporary = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(state, null, 2) + "\n");
    fs.renameSync(temporary, file);
  }
  return {
    run(id, action, { always = false } = {}) {
      const previous = state.stages[id];
      if (!always && previous?.ok === true) return { ...previous, reused: true };
      if (dryRun) return { label: id, ok: true, status: "planned", command: "dry-run", reused: false };
      let result;
      try { result = action(); } catch (error) { result = { label: id, ok: false, status: "failed", error: error.message }; }
      state.stages[id] = { ...result, recorded_at: new Date().toISOString(), reused: false };
      save(); return state.stages[id];
    },
    state,
  };
}
