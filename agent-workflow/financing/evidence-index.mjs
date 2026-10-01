import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadPrivateEvidenceRecord } from '../tools/lib/private-evidence-store.mjs';

export const publicIndexPath = '01-SiteV2/content/01-raw/source-index.jsonl';

// Publish locators for this collection only; never copy a private original body.
export function indexFinancingEvidence({root, backupRoot, date, collection}) {
  const file=path.join(root,publicIndexPath);
  const rows=fs.existsSync(file) ? fs.readFileSync(file,'utf8').split(/\r?\n/u).filter(Boolean).map(line=>JSON.parse(line)) : [];
  const indexed=new Map(rows.map(row=>[row.source_id,row]));
  for(const capture of Object.values(collection.captures || {}).filter(row=>row.status==='accepted')) {
    const {entry,metadata}=loadPrivateEvidenceRecord(root,`evidence://${capture.content_hash}`,capture.content_hash,{backupRoot,sourceUrl:capture.source_url,dataDate:date});
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
  }
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,[...indexed.values()].map(row=>JSON.stringify(row)).join('\n')+'\n','utf8');
}
