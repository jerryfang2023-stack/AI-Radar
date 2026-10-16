import fs from 'node:fs';
import { compactFeaturedSnapshot } from './compact-featured-snapshot.mjs';
const response = await fetch(`https://www.zkdlj.vip/data/funding-featured.json?refresh=${Date.now()}`, {signal:AbortSignal.timeout(20000)});
if (!response.ok) throw new Error(`Featured HTTP ${response.status}`);
const payload = compactFeaturedSnapshot(await response.json());
const selection = payload.selection;
fs.writeFileSync(new URL('../miniprogram/data/funding-featured.js',import.meta.url), `// Reviewed online snapshot; refreshed by scripts/sync-featured.mjs.\nmodule.exports = ${JSON.stringify(payload)};\n`);
console.log(JSON.stringify({observations:payload.entries.length,windows:selection.windows.length,asOfDate:payload.selection.asOfDate}));
