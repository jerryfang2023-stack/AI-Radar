import fs from 'node:fs';

// A review or publication can temporarily hold multiple complete data checkouts.
// Use bavail: filesystem-reserved blocks are unavailable to the service account.
export const MIN_WORKSPACE_BYTES = 6 * 1024 ** 3;
export function assertWorkspaceCapacity(directory,{requiredBytes=MIN_WORKSPACE_BYTES,statfs=fs.statfsSync}={}) {
  let stat;
  try {stat=statfs(directory);} catch(error) {
    throw new Error(`workspace_storage_unavailable:${directory}:${error.code || 'statfs_failed'}`);
  }
  const blockSize=Number(stat.bsize),blocks=Number(stat.bavail),available=blockSize*blocks;
  if(!Number.isFinite(blockSize) || blockSize<=0 || !Number.isFinite(blocks) || blocks<0 || !Number.isSafeInteger(available))
    throw new Error(`workspace_storage_unavailable:${directory}:invalid_capacity`);
  if(!Number.isSafeInteger(requiredBytes) || requiredBytes<0)throw new Error('invalid_workspace_reserve');
  if(available<requiredBytes)
    throw new Error(`insufficient_workspace_storage:${directory}:available_bytes=${available}:required_bytes=${requiredBytes}:archive_inactive_repair_worktrees_then_resume_accepted_stage`);
  return {directory,available_bytes:available,required_bytes:requiredBytes};
}
