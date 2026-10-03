import fs from 'node:fs';
import path from 'node:path';

export function semanticVaultContent(content) {
  return content.replace(/^---\r?\n([\s\S]*?)\r?\n---/u,(_,yaml)=>`---\n${yaml.replaceAll('\r\n','\n').split('\n').filter(line=>!/^updated:\s*\d{4}-\d{2}-\d{2}\s*$/u.test(line)).join('\n')}\n---`);
}
export function writeVaultIfChanged(target, content) {
  const next=`${content.trimEnd()}\n`;
  if(fs.existsSync(target)) {
    const previous=fs.readFileSync(target,'utf8');
    if(previous===next || (target.endsWith('.md') && semanticVaultContent(previous)===semanticVaultContent(next))) return false;
  }
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,next,'utf8');
  return true;
}
