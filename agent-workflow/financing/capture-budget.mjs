import path from 'node:path';
import {config} from './discovery.mjs';
import {read} from './state.mjs';
import {legacyOriginals, followupDue} from './verification-followup.mjs';

// Legacy receipts without an attempted flag conservatively count as spent.
export const collectionAttempts = collection => Object.values(collection.captures || {}).filter(row => row.attempted !== false).length;
export function captureAllowance({collection, verification = {entries:{}}, backupRoot, date}) {
  const history = read(path.join(backupRoot, 'financing-monitor-state/verification-attempts.json'), {entries:{}});
  return Math.max(0, config.max_capture_attempts - collectionAttempts(collection) - legacyOriginals(backupRoot,date).attempts
    - Math.max(Object.values(verification.entries).filter(row => row.attempted).length,
      Object.values(history.entries).filter(row => row.date === date && row.attempted).length));
}
export function backlogReserve({backupRoot, date}) {
  const queue = read(path.join(backupRoot, 'financing-monitor-state/verification-queue.json'), {entries:{}});
  return Math.min(config.verification_capture_reserve, Object.values(queue.entries).filter(row => followupDue(row,date)).length);
}
