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
  const owner=JSON.stringify({pid:process.pid,token:crypto.randomUUID()});
  const active = raw => {
    const pid = raw.startsWith('{') ? JSON.parse(raw).pid : Number(raw);
    if (!Number.isInteger(pid) || pid < 1) throw new Error('invalid_financing_lock');
    try { process.kill(pid, 0); throw new Error(`financing_run_already_active:pid=${pid}:lock=${file}`); }
    catch (error) { if (error.code !== 'ESRCH') throw error; }
  };
  try { fs.writeFileSync(file, owner, { flag: 'wx' }); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    active(fs.readFileSync(file,'utf8'));
    // A short recovery mutex prevents two windows deleting each other's newly
    // acquired lock while reclaiming a dead owner's old receipt.
    const recovery=file+'.recovery';
    try {fs.writeFileSync(recovery,owner,{flag:'wx'});}
    catch (e) {if(e.code==='EEXIST')throw new Error(`financing_lock_recovery_busy:${file}`);throw e;}
    try {
      if(fs.existsSync(file)) {active(fs.readFileSync(file,'utf8'));fs.unlinkSync(file);}
      fs.writeFileSync(file,owner,{flag:'wx'});
    } finally {fs.unlinkSync(recovery);}
  }
  return () => {if(fs.existsSync(file) && fs.readFileSync(file,'utf8')===owner)fs.unlinkSync(file);};
}
// Each stage has its own version/input key. A downstream code repair never
// invalidates accepted originals. Dependent stages follow changed receipts.
export async function runStages({ stages, file, execute, codeVersion, date, parallelGroups }) {
  const state = read(file, { version: 'FINANCING-RUN-1', date, stages: {} });
  if (state.date !== date || state.version !== 'FINANCING-RUN-1') throw new Error('checkpoint_identity_mismatch');
  let parent = date;
  const runOne = async stage => {
    // Explicit dependencies let independent publication targets resume alone.
    // Production plans retain the original sequential dependency by default.
    const parents = stage.dependsOn === undefined ? () => parent : () => stage.dependsOn.map(id => {
      if (!state.stages[id]?.ok) throw new Error(`stage_dependency_not_ready:${id}`);
      return state.stages[id].key;
    });
    const keyForCurrentInputs = () => digest([parents(), stage.id, codeVersion, stage.version || "", stage.checkpointCommands || stage.commands, stage.inputVersion?.() || ""]);
    let key = keyForCurrentInputs();
    if (state.stages[stage.id]?.key !== key || !state.stages[stage.id]?.ok || !(await stage.valid())) {
      try {
        const started = Date.now();
        await execute(stage);
        if (!(await stage.valid())) throw new Error('stage_output_invalid');
        // A stage may create its own reviewed input. Record the resulting key
        // so the next resume skips it until that input changes again.
        key = keyForCurrentInputs();
        state.stages[stage.id] = { ok: true, key, duration_ms: Date.now() - started, at: new Date().toISOString() };
      } catch (error) {
        state.stages[stage.id] = { ok: false, key, error: error.message, at: new Date().toISOString() };
        state.status = 'failed'; state.next_stage = stage.id; write(file, state); throw error;
      }
      write(file, state);
    }
    parent = state.stages[stage.id].key;
  };
  if (parallelGroups) {
    const ids = parallelGroups.flat();
    if (new Set(ids).size !== stages.length || ids.length !== stages.length || stages.some(stage=>!ids.includes(stage.id) || !Array.isArray(stage.dependsOn))) throw new Error('invalid_parallel_stage_groups');
    for (const group of parallelGroups) {
      const results = await Promise.allSettled(group.map(id=>runOne(stages.find(stage=>stage.id===id))));
      const failures = results.filter(result=>result.status==='rejected');
      if (failures.length) {
        state.status='failed';write(file,state);
        throw new AggregateError(failures.map(result=>result.reason),failures.map(result=>result.reason.message).join('; '));
      }
    }
  } else {
    for (const stage of stages) await runOne(stage);
  }
  state.status = 'ready_for_review'; state.next_stage = 'merge_and_publish'; write(file, state);
  return state;
}
