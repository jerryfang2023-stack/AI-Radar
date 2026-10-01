import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const digest = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
export function read(file, fallback = null) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; } }
export function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(temp, file);
}
export function acquireLock(directory) {
  fs.mkdirSync(directory, { recursive: true });
  const file = path.join(directory, 'run.lock');
  try { fs.writeFileSync(file, String(process.pid), { flag: 'wx' }); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const pid = Number(fs.readFileSync(file, 'utf8'));
    if (!Number.isInteger(pid) || pid < 1) throw new Error('invalid_financing_lock');
    try { process.kill(pid, 0); throw new Error('financing_run_already_active'); }
    catch (e) { if (e.code !== 'ESRCH') throw e; }
    fs.unlinkSync(file); fs.writeFileSync(file, String(process.pid), { flag: 'wx' });
  }
  return () => fs.unlinkSync(file);
}
// Each stage has its own version/input key. A downstream code repair never
// invalidates accepted originals. Dependent stages follow changed receipts.
export async function runStages({ stages, file, execute, codeVersion, date }) {
  const state = read(file, { version: 'FINANCING-RUN-1', date, stages: {} });
  if (state.date !== date || state.version !== 'FINANCING-RUN-1') throw new Error('checkpoint_identity_mismatch');
  let parent = date;
  for (const stage of stages) {
    const key = digest([parent, stage.id, codeVersion, stage.version || "", stage.commands]);
    if (state.stages[stage.id]?.key !== key || !state.stages[stage.id]?.ok || !(await stage.valid())) {
      try {
        await execute(stage);
        if (!(await stage.valid())) throw new Error('stage_output_invalid');
        state.stages[stage.id] = { ok: true, key, at: new Date().toISOString() };
      } catch (error) {
        state.stages[stage.id] = { ok: false, key, error: error.message, at: new Date().toISOString() };
        state.status = 'failed'; state.next_stage = stage.id; write(file, state); throw error;
      }
      write(file, state);
    }
    parent = state.stages[stage.id].key;
  }
  state.status = 'ready_for_review'; state.next_stage = 'merge_and_publish'; write(file, state);
  return state;
}
