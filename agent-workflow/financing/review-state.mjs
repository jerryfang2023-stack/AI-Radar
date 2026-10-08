import path from 'node:path';
import {spawnSync} from 'node:child_process';

// Linked private worktrees share their Git common directory. The live account
// receipts/lock belong there; body-free snapshots still persist in each backup.
export function reviewStateDirectory(backupRoot) {
  const result=spawnSync('git',['rev-parse','--git-common-dir'],{cwd:backupRoot,encoding:'utf8',stdio:['ignore','pipe','ignore']});
  if(result.status!==0)return path.join(backupRoot,'financing-monitor-state');
  return path.join(path.resolve(backupRoot,result.stdout.trim()),'guanlan-financing-review');
}
