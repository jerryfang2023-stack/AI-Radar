import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {syncGuanlanEvidence} from '../../tools/lib/guanlan-evidence-projection.mjs';

test('the complete base/evidence pipeline preserves unchanged overlays and source cards, yet updates changed evidence',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'vault-incremental-pipeline-')),root=path.join(dir,'source'),vaultRoot=path.join(dir,'vault');
  const put=(rel,data)=>{const file=path.join(root,rel);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(data));};
  try {
    const dateRoot='01-SiteV2/content/11-databases/data-center-v4/2026-10-02',url='https://example.test/funding';
    put('01-SiteV2/site/data/financing-catalog-v1.json',{cards:[{funding_insight_id:'FI-test',as_of_date:'2026-10-02',company:{name:'Test',summary:'Accepted product'},research_sources:[{source_id:'SA-test',source_url:url,title:'Funding'}]}]});
    put(dateRoot+'/source-artifacts.json',[{source_artifact_id:'SA-test',source_url:url,content_hash:'test-hash',publisher:'Test'}]);
    put(dateRoot+'/raw-documents.json',[{raw_id:'RAW-test',source_artifact_id:'SA-test'}]);
    put(dateRoot+'/claims.json',[{claim_id:'CL-test',raw_id:'RAW-test',verification_status:'accepted',source_quote:'Exact accepted claim'}]);
    const build=()=>execFileSync(process.execPath,[fileURLToPath(new URL('../../tools/build-guanlan-vault.mjs',import.meta.url))],{cwd:root,env:{...process.env,GUANLAN_VAULT_ROOT:vaultRoot},encoding:'utf8'});
    build();syncGuanlanEvidence({root,vaultRoot,generatedAt:'2026-10-02T00:00:00Z'});
    const inventory=JSON.parse(fs.readFileSync(path.join(vaultRoot,'.guanlan-generated.json')));
    const note=path.join(vaultRoot,inventory.generatedFiles.find(p=>p.startsWith('60-知识资产/融资/'))),citation=path.join(vaultRoot,inventory.generatedFiles.find(p=>p.startsWith('60-知识资产/来源引用/')));
    const noteBytes=fs.readFileSync(note),citationBytes=fs.readFileSync(citation);assert.ok(noteBytes.toString().includes('guanlan-evidence:start'));
    for(const file of [note,citation])fs.utimesSync(file,100,100);
    build();assert.ok(fs.readFileSync(note).equals(noteBytes));assert.ok(fs.readFileSync(citation).equals(citationBytes));
    syncGuanlanEvidence({root,vaultRoot,generatedAt:'2026-10-03T00:00:00Z'});
    for(const file of [note,citation])assert.equal(fs.statSync(file).mtimeMs,100000);
    put(dateRoot+'/claims.json',[{claim_id:'CL-test',raw_id:'RAW-test',verification_status:'accepted',source_quote:'Exact accepted claim'},{claim_id:'CL-extra',raw_id:'RAW-test',verification_status:'accepted',source_quote:'New accepted evidence'}]);
    build();syncGuanlanEvidence({root,vaultRoot,generatedAt:'2026-10-03T00:00:00Z'});
    assert.ok(fs.readFileSync(note,'utf8').includes('CL-extra'));assert.notEqual(fs.statSync(note).mtimeMs,100000);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
