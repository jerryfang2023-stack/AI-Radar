import fs from 'node:fs';
import path from 'node:path';

export const publicationInputs = {
  data_lake:['01-SiteV2/content/11-databases','01-SiteV2/content/12-applications','agent-workflow/tools/sync-light-data-lake.mjs','agent-workflow/tools/assert-data-lake-v4.mjs','agent-workflow/tools/lib'],
  financing_read_model:['01-SiteV2/site/data/financing-catalog-v1.json','agent-workflow/financing','agent-workflow/tools/lib'],
  vault:['01-SiteV2/content','01-SiteV2/site/data','agent-workflow/tools/build-guanlan-vault.mjs','agent-workflow/tools/sync-guanlan-vault-from-main.mjs','agent-workflow/tools/sync-guanlan-evidence.mjs','agent-workflow/tools/assert-guanlan-vault.mjs','agent-workflow/tools/guanlan-vault-paths.mjs','agent-workflow/tools/lib'],
  portal:['01-SiteV2/site/data/financing-catalog-v1.json','01-SiteV2/site/data/data-center-v4/indexes/entities.json','01-SiteV2/content/11-databases/public-entity-profile-coverage-v1.json','01-SiteV2/content/11-databases/investment-institutions-v1.json','01-SiteV2/content/12-applications/industry-reports','agent-workflow/tools/assert-funding-insights-v1.mjs','agent-workflow/tools/lib'],
  ops:['01-SiteV2/site/operations-console.html','01-SiteV2/site/assets','01-SiteV2/site/data/ops-console.json','01-SiteV2/site/data/ops-console.js','01-SiteV2/site/data/local-skill-store-data.js','agent-workflow/tools/publish-ops-console.mjs','agent-workflow/tools/lib'],
};

export function publicationCheckpointCommands(commands, checkout, sha) {
  return commands.map(command=>command.map(value=>value.replaceAll(checkout,'<accepted-checkout>').replaceAll(sha,'<accepted-sha>')));
}

export function publicationCodeInputs(root,commands) {
  const found=new Set();
  const visit=file=>{
    const relative=path.relative(root,file).replaceAll('\\','/');
    if(relative.startsWith('../') || found.has(relative) || !fs.existsSync(file) || !fs.statSync(file).isFile())return;
    found.add(relative);
    if(!/\.[cm]?js$/u.test(file))return;
    const body=fs.readFileSync(file,'utf8');
    for(const match of body.matchAll(/['"](\.[^'"\n]+)['"]/gu))visit(path.resolve(path.dirname(file),match[1]));
  };
  for(const command of commands)visit(path.resolve(root,command[0]));
  return [...found].sort();
}
