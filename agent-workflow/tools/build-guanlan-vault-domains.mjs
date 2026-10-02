import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {resolveGuanlanVaultRoot,GUANLAN_VAULT_LAYOUT_VERSION} from './guanlan-vault-paths.mjs';
import {isMainModule} from './lib/module-entry.mjs';
export function verifyVaultDomains(vaultRoot) {
  const inventory=JSON.parse(fs.readFileSync(path.join(vaultRoot,'.guanlan-generated.json'),'utf8'));
  const manifest=JSON.parse(fs.readFileSync(path.join(vaultRoot,'.guanlan-domains.json'),'utf8'));
  if(manifest.layoutVersion!==GUANLAN_VAULT_LAYOUT_VERSION || manifest.schemaVersion!=='GUANLAN-VAULT-DOMAINS-1')throw Error('vault_domain_contract_mismatch');
  const expected=inventory.generatedFiles.filter(p=>p.endsWith('.md')&&!p.startsWith('90-工作区/')).sort(),seen=[];
  for(const domain of Object.values(manifest.domains)) {
    if(domain.fileCount!==domain.files.length || domain.contentHash!==crypto.createHash('sha256').update(JSON.stringify(domain.files)).digest('hex'))throw Error('vault_domain_version_mismatch');
    for(const file of domain.files){if(!expected.includes(file.path)||file.sha256!==crypto.createHash('sha256').update(fs.readFileSync(path.join(vaultRoot,file.path))).digest('hex'))throw Error(`vault_domain_asset_mismatch:${file.path}`);seen.push(file.path);}
  }
  if(JSON.stringify(seen.sort())!==JSON.stringify(expected))throw Error('vault_domain_inventory_mismatch');
  return manifest;
}
export function buildVaultDomains(vaultRoot) {
  const file=path.join(vaultRoot,'.guanlan-generated.json'),manifest=JSON.parse(fs.readFileSync(file,'utf8'));
  const groups={financing:[],fde:[],hardware:[],builders:[],community:[],shared:[]};
  for(const entry of manifest.generatedFiles.filter(p=>p.endsWith('.md')&&!p.startsWith('90-工作区/')).sort()) {
    const domain=entry.startsWith('20-融资情报/')||entry.startsWith('60-知识资产/融资/')?'financing':entry.includes('/FDE/')?'fde':entry.includes('/AI硬件/')?'hardware':entry.includes('/Builders观点/')?'builders':entry.includes('/社群监测/')?'community':'shared';
    groups[domain].push({path:entry,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(vaultRoot,entry))).digest('hex')});
  }
  const domains=Object.fromEntries(Object.entries(groups).map(([name,files])=>[name,{fileCount:files.length,contentHash:crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex'),files}]));
  fs.writeFileSync(path.join(vaultRoot,'.guanlan-domains.json'),JSON.stringify({schemaVersion:'GUANLAN-VAULT-DOMAINS-1',layoutVersion:GUANLAN_VAULT_LAYOUT_VERSION,domains},null,2)+'\n');
  manifest.generatedFiles=[...new Set([...manifest.generatedFiles,'.guanlan-domains.json'])].sort();fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n');return domains;
}
if(isMainModule(import.meta.url))console.log(JSON.stringify(buildVaultDomains(resolveGuanlanVaultRoot(process.cwd()))));
