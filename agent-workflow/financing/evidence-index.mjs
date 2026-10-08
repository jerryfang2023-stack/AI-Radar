import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadPrivateEvidenceRecord } from '../tools/lib/private-evidence-store.mjs';

export const publicIndexPath = '01-SiteV2/content/01-raw/source-index.jsonl';

// Publish body-free locators for accepted captures and any private evidence
// explicitly referenced by the current intake; never copy an original body.
export function indexFinancingEvidence({root, backupRoot, date, collection, requiredEvidenceRefs = []}) {
  const file=path.join(root,publicIndexPath);
  const rows=fs.existsSync(file) ? fs.readFileSync(file,'utf8').split(/\r?\n/u).filter(Boolean).map(line=>JSON.parse(line)) : [];
  const indexed=new Map(rows.map(row=>[row.source_id,row]));
  const indexedRefs=new Set([...indexed.values()].map(row=>row.evidence_ref).filter(Boolean));
  const required=new Set(requiredEvidenceRefs.map(String).filter(ref=>ref.startsWith('evidence://')));
  const captures=new Map();
  for(const capture of Object.values(collection.captures || {})) {
    const ref=capture.content_hash ? `evidence://${capture.content_hash}` : '';
    if(capture.status==='accepted' || required.has(ref)) captures.set(ref,capture);
  }
  for(const ref of required) {
    if(!captures.has(ref) && !indexedRefs.has(ref)) captures.set(ref,{content_hash:ref.slice('evidence://'.length),source_url:''});
  }
  for(const [ref,capture] of captures) {
    if(indexedRefs.has(ref)) continue;
    const {entry,metadata}=loadPrivateEvidenceRecord(root,ref,capture.content_hash,{backupRoot,sourceUrl:capture.source_url,dataDate:date});
    const sourceId=`SRC-${crypto.createHash('sha256').update(entry.snapshot_ref).digest('hex').slice(0,16)}`;
    if(indexed.has(sourceId)) continue;
    indexed.set(sourceId,{
      schema_version:'PUBLIC-EVIDENCE-LOCATOR-V1.0',source_id:sourceId,data_date:entry.data_date,
      title_original:String(metadata.title || ''),title_zh:String(metadata.title_zh || ''),
      source_url:entry.source_url,publisher:String(metadata.source_name || ''),author:String(metadata.author || ''),
      published_at:String(metadata.published_at || ''),captured_at:entry.collected_at,
      language:String(metadata.language || ''),document_type:String(metadata.source_type || 'article'),
      content_hash:entry.content_hash,body_length:entry.body_length,evidence_ref:entry.evidence_ref,
    });
    indexedRefs.add(entry.evidence_ref);
  }
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,[...indexed.values()].map(row=>JSON.stringify(row)).join('\n')+'\n','utf8');
}
