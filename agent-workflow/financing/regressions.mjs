import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=fileURLToPath(new URL('../../',import.meta.url));
const cases=JSON.parse(fs.readFileSync(new URL('./regression-cases.json',import.meta.url),'utf8'));
for(const row of cases) {
  if(!/^agent-workflow\/(?:tools|financing)\/tests\/[a-z0-9-]+\.test\.mjs$/u.test(row.file))throw new Error('invalid_regression_file');
  const source=fs.readFileSync(path.join(root,row.file),'utf8');
  if(!source.includes(`test("${row.test}"`) && !source.includes(`test('${row.test}'`))throw new Error(`regression_case_missing:${row.incident}`);
}
const escape=text=>text.replace(/[.*+?^${}()|[\]\\]/gu,'\\$&');
const pattern='^(?:'+cases.map(row=>escape(row.test)).join('|')+')$';
const result=spawnSync(process.execPath,['--test',`--test-name-pattern=${pattern}`,...new Set(cases.map(row=>row.file))],{cwd:root,stdio:'inherit',windowsHide:true});
process.exitCode=result.status ?? 1;
