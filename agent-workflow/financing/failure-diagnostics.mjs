import fs from 'node:fs';

// Public diagnostics include assertion codes only, never the captured originals.
export function assertionProblems(text) {
  for (const match of String(text).matchAll(/\{\s*"ok"\s*:\s*false/g)) {
    for (let end=String(text).indexOf('}',match.index); end>=0; end=String(text).indexOf('}',end+1)) {
      try {
        const result=JSON.parse(String(text).slice(match.index,end+1));
        if(Array.isArray(result.problems)) return result.problems.filter(row=>typeof row==='string').slice(0,100).map(row=>row.slice(0,500));
      } catch {}
    }
  }
  return [];
}

export function commandAssertionProblems(file, start) {
  const length=fs.statSync(file).size, offset=Math.max(start,length-65536);
  const buffer=Buffer.alloc(Math.max(0,length-offset)), fd=fs.openSync(file,'r');
  try {fs.readSync(fd,buffer,0,buffer.length,offset);} finally {fs.closeSync(fd);}
  return assertionProblems(buffer.toString('utf8'));
}

export function deterministicProductionFailure(log,{date,head,runHead}) {
  if(head!==runHead) return null;
  for(const line of String(log).split(/\r?\n/u).reverse()) {
    const start=line.indexOf('{"date":');if(start<0)continue;
    try {
      const value=JSON.parse(line.slice(start));
      if(value.date===date && value.failure_kind==='quality_gate' && value.problems?.length
        && /^assert-[\w-]+\.mjs$/u.test(value.command || '')) return value;
    } catch {}
  }
  return null;
}
