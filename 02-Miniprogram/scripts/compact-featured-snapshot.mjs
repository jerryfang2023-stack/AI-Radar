import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { parseObservations, parseSelection } = require('../miniprogram/utils/featured-observations.js');

export function compactFeaturedSnapshot(payload) {
  const observations = parseObservations(payload);
  const selection = parseSelection(payload.selection);
  if (!selection) throw new Error('Live featured policy has not been deployed');
  const selected = new Set(selection.windows.flatMap(window =>
    ['global', 'china'].flatMap(market => window.markets[market].map(row => row.fundingId))));
  for (const id of selected) {
    if (!observations[id]) throw new Error(`Missing selected observation: ${id}`);
  }
  return { ...payload, entries: payload.entries.filter(entry => selected.has(entry.fundingId)) };
}
