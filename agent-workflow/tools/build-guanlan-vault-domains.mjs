import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {writeVaultIfChanged,semanticVaultContent} from './lib/incremental-vault-write.mjs';
import {resolveGuanlanVaultRoot,GUANLAN_VAULT_LAYOUT_VERSION} from './guanlan-vault-paths.mjs';
import {isMainModule} from './lib/module-entry.mjs';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const VERSION_ALGORITHM='content-without-generated-update-1';
function contentHash(bytes) {
  const text=semanticVaultContent(bytes.toString('utf8'));
  return hash(text);
}
const domainVersion=(files,semantic)=>hash(JSON.stringify(semantic?files.map(file=>({path:file.path,contentHash:file.contentHash})):files));
export function verifyVaultDomains(vaultRoot) {
  const inventory=JSON.parse(fs.readFileSync(path.join(vaultRoot,'.guanlan-generated.json'),'utf8'));
  const manifest=JSON.parse(fs.readFileSync(path.join(vaultRoot,'.guanlan-domains.json'),'utf8'));
  if(manifest.layoutVersion!==GUANLAN_VAULT_LAYOUT_VERSION || manifest.schemaVersion!=='GUANLAN-VAULT-DOMAINS-1')throw Error('vault_domain_contract_mismatch');
  if(manifest.versionAlgorithm && manifest.versionAlgorithm!==VERSION_ALGORITHM)throw Error('vault_domain_version_algorithm_mismatch');
  const semantic=manifest.versionAlgorithm===VERSION_ALGORITHM;
  const expected=inventory.generatedFiles.filter(p=>p.endsWith('.md')&&!p.startsWith('90-工作区/')).sort(),seen=[];
  for(const domain of Object.values(manifest.domains)) {
    if(domain.fileCount!==domain.files.length || domain.contentHash!==domainVersion(domain.files,semantic))throw Error('vault_domain_version_mismatch');
    for(const file of domain.files){const bytes=fs.readFileSync(path.join(vaultRoot,file.path));if(!expected.includes(file.path)||file.sha256!==hash(bytes)||(semantic && file.contentHash!==contentHash(bytes)))throw Error(`vault_domain_asset_mismatch:${file.path}`);seen.push(file.path);}
  }
  if(JSON.stringify(seen.sort())!==JSON.stringify(expected))throw Error('vault_domain_inventory_mismatch');
  return manifest;
}
export function buildVaultDomains(vaultRoot) {
  const file=path.join(vaultRoot,'.guanlan-generated.json'),manifest=JSON.parse(fs.readFileSync(file,'utf8'));
  const groups={financing:[],fde:[],hardware:[],builders:[],community:[],shared:[]};
  for(const entry of manifest.generatedFiles.filter(p=>p.endsWith('.md')&&!p.startsWith('90-工作区/')).sort()) {
    const domain=entry.startsWith('20-融资情报/')||entry.startsWith('60-知识资产/融资/')?'financing':entry.includes('/FDE/')?'fde':entry.includes('/AI硬件/')?'hardware':entry.includes('/Builders观点/')?'builders':entry.includes('/社群监测/')?'community':'shared';
    const bytes=fs.readFileSync(path.join(vaultRoot,entry));
    groups[domain].push({path:entry,sha256:hash(bytes),contentHash:contentHash(bytes)});
  }
  const domains=Object.fromEntries(Object.entries(groups).map(([name,files])=>[name,{fileCount:files.length,contentHash:domainVersion(files,true),files}]));
  writeVaultIfChanged(path.join(vaultRoot,'.guanlan-domains.json'),JSON.stringify({schemaVersion:'GUANLAN-VAULT-DOMAINS-1',versionAlgorithm:VERSION_ALGORITHM,layoutVersion:GUANLAN_VAULT_LAYOUT_VERSION,domains},null,2));
  manifest.generatedFiles=[...new Set([...manifest.generatedFiles,'.guanlan-domains.json'])].sort();writeVaultIfChanged(file,JSON.stringify(manifest,null,2));return domains;
}
if(isMainModule(import.meta.url))console.log(JSON.stringify(buildVaultDomains(resolveGuanlanVaultRoot(process.cwd()))));
