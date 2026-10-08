import {config} from './discovery.mjs';

// Legacy receipts without an attempted flag conservatively count as spent.
export const collectionAttempts = collection => Object.values(collection.captures || {}).filter(row => row.attempted !== false).length;
export function captureAllowance({collection}) {
  return Math.max(0, config.max_capture_attempts - collectionAttempts(collection));
}
export function backlogReserve() {
  // Secondary work has its own dynamically reserved pool.
  return 0;
}
