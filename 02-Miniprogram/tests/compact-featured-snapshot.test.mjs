import test from 'node:test';
import assert from 'node:assert/strict';
import { compactFeaturedSnapshot } from '../scripts/compact-featured-snapshot.mjs';
const entry = id => ({fundingId:id,institution:'Investor',summary:'Evidence-backed view',sourceUrl:'https://example.com/funding'});
const payload = {schemaVersion:1,entries:['FI-a','FI-b','FI-c'].map(entry),selection:{schemaVersion:1,windows:[
  {startsAt:'2026-10-01T00:00:00Z',endsAt:'2026-10-02T00:00:00Z',markets:{global:[{fundingId:'FI-a',date:'2026-09-30'}],china:[]}},
  {startsAt:'2026-10-02T00:00:00Z',endsAt:'2026-10-03T00:00:00Z',markets:{global:[],china:[{fundingId:'FI-b',date:'2026-10-01'}]}}
]}};
test('offline projection preserves every selected row, window and attributed observation in both markets',()=>{
 const before=structuredClone(payload), result=compactFeaturedSnapshot(payload);
 assert.deepEqual(result.selection,payload.selection);
 assert.deepEqual(result.entries,payload.entries.slice(0,2));
 assert.deepEqual(payload,before);
 assert.deepEqual(compactFeaturedSnapshot({...payload,selection:{schemaVersion:1,windows:[]}}).entries,[]);
});
test('offline projection rejects missing selected copy and invalid source evidence',()=>{
 assert.throws(()=>compactFeaturedSnapshot({...payload,entries:payload.entries.slice(1)}),/Missing selected observation/);
 assert.throws(()=>compactFeaturedSnapshot({...payload,entries:[{...payload.entries[0],sourceUrl:''},...payload.entries.slice(1)]}));
});
