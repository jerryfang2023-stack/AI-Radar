import {config} from './discovery.mjs';

// Legacy receipts without an attempted flag conservatively count as spent.
export const collectionAttempts = collection => Object.values(collection.captures || {}).filter(row => row.attempted !== false).length;
// The configured run allowance is a minimum; collection may pass a larger,
// date-specific allowance derived from the discovered lead count.
export function captureAllowance({collection, maxAttempts = config.max_capture_attempts}) {
  return Math.max(0, maxAttempts - collectionAttempts(collection));
}
export function backlogReserve() {
  // Secondary work has its own dynamically reserved pool.
  return 0;
}
