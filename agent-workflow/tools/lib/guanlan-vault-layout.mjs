import path from 'node:path';
import {GUANLAN_VAULT_PATH_MIGRATIONS} from '../guanlan-vault-paths.mjs';
const rules=Object.entries(GUANLAN_VAULT_PATH_MIGRATIONS).sort((a,b)=>b[0].length-a[0].length);
export function migratedVaultPath(value) {
  const normalized=value.replaceAll('\\','/');
  for(const [from,to] of rules) {
    if(normalized===from || normalized.startsWith(`${from}/`))return to+normalized.slice(from.length);
    if(from.endsWith('.md') && normalized===from.slice(0,-3))return to.slice(0,-3);
  }
  return normalized;
}
export function rewriteVaultLinks(content) {
  return content.replace(/\[\[([^\]]+)\]\]/gu,(match,body)=>{
    const separator=body.search(/[|#]/u),target=separator<0?body:body.slice(0,separator),suffix=separator<0?'':body.slice(separator);
    let next=migratedVaultPath(target);
    if(next===target && !target.includes('/')) {
      const found=rules.filter(([from])=>from.endsWith('.md') && path.posix.basename(from,'.md')===target);
      if(found.length===1)next=found[0][1].slice(0,-3);
    }
    return next===target?match:`[[${next}${suffix}]]`;
  });
}
