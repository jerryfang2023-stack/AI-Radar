#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { acquireLock, read, write, runStages } from './state.mjs';
import { queryPlan } from './discovery.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = new Map(process.argv.slice(2).map(arg => { const [key,...value] = arg.replace(/^--/u,'').split('='); return [key,value.join('=')]; }));
const date = args.get('date') || new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
queryPlan(date);
const run = (command, argv, cwd = root, timeout = 600000) => {
  const result = spawnSync(command,argv,{ cwd,encoding:'utf8',windowsHide:true,timeout,maxBuffer:64*1024*1024 });
  if(result.status!==0 || result.error) throw new Error(`${command} ${argv[0]} failed: ${result.stderr || result.error?.message || result.stdout.slice(-4000)}`);
  return result.stdout.trim();
};
const primary = path.dirname(path.resolve(root,run('git',['rev-parse','--git-common-dir'])));
const directory = path.resolve(args.get('runtime-dir') || path.join(primary,'..','..','runtime','financing',date));
const portal = path.resolve(args.get('portal-repo') || process.env.GUANLAN_FUNDING_PORTAL_REPO || path.join(primary,'..','Guanlan-Funding-Portal'));
if (args.get('dry-run') === 'true') {
  console.log(JSON.stringify({date,stages:['accepted_main','pages','data_lake','vault','portal_with_live_parity','ops'],portal,directory}));
} else {
  const unlock = acquireLock(directory);
  let checkout, linked=false;
  try {
    run('git',['fetch','origin','main','--quiet']);
    const sha = run('git',['rev-parse','origin/main']);
    const raw = run('git',['show',`${sha}:01-SiteV2/site/data/financing-catalog-v1.json`]);
    const catalog = JSON.parse(raw);
    if(catalog.meta?.taxonomy_version !== 'AI-FUNDING-TAGS-1.0' || !Array.isArray(catalog.cards)) throw new Error('accepted_financing_catalog_missing');
    const pages = JSON.parse(run('gh',['run','list','--repo','jerryfang2023-stack/AI-Radar','--workflow','github-pages.yml','--limit','40','--json','headSha,conclusion,status']));
    const deployed = pages.some(row => {
      if(row.conclusion!=='success') return false;
      return spawnSync('git',['merge-base','--is-ancestor',sha,row.headSha],{cwd:root,windowsHide:true}).status===0;
    });
    if(!deployed) throw new Error('awaiting_pages_for_accepted_commit');
    checkout = path.join(directory,`accepted-${process.pid}`);
    run('git',['worktree','add','--detach',checkout,sha]);
    const dependencies = [root,primary].find(candidate => fs.existsSync(path.join(candidate,'node_modules','ajv')) && fs.readFileSync(path.join(candidate,'package-lock.json'),'utf8')===fs.readFileSync(path.join(checkout,'package-lock.json'),'utf8'));
    if(!dependencies) throw new Error('accepted_dependencies_missing');
    fs.symlinkSync(path.join(dependencies,'node_modules'),path.join(checkout,'node_modules'),process.platform==='win32'?'junction':'dir'); linked=true;
    for(const name of ['.guanlan-vault.json','.evidence-backup.json']) if(fs.existsSync(path.join(primary,name))) fs.copyFileSync(path.join(primary,name),path.join(checkout,name));
    const lake = `--lake-dir=${path.join(primary,'data-lake')}`;
    const plans = [
      {id:'data_lake', commands:[['agent-workflow/tools/sync-light-data-lake.mjs','--v4-only=true',lake],['agent-workflow/tools/assert-data-lake-v4.mjs',lake]]},
      {id:'vault', commands:[['agent-workflow/tools/sync-guanlan-vault-from-main.mjs',`--date=${date}`,`--runtime-dir=${directory}`]]},
      {id:'portal', commands:[['agent-workflow/tools/assert-funding-insights-v1.mjs',`--date=${date}`],[path.join(portal,'scripts/publish-from-wavesight.mjs'),`--wavesight-repo=${checkout}`]]},
      {id:'ops', commands:[['agent-workflow/tools/publish-ops-console.mjs']]},
    ].map(stage => ({...stage,
      // The accepted SHA already binds the checkout contents. A fresh temporary
      // path must not invalidate a completed release when resuming the OPS step.
      checkpointCommands:stage.commands.map(command=>command.map(value=>value.replaceAll(checkout,'<accepted-checkout>'))),
      valid:()=>true}));
    await runStages({date,codeVersion:sha,stages:plans,file:path.join(directory,'publication-stages.json'), execute: async stage => {
      for(const command of stage.commands) {
        const output=run(process.execPath,command,checkout,1200000);
        fs.writeFileSync(path.join(directory,`${stage.id}.log`),output);
        if(run('git',['rev-parse','origin/main'])!==sha) throw new Error('accepted_main_changed_resume_publication');
      }
    }});
    const base=args.get('live-url') || 'https://www.zkdlj.vip';
    const live=await Promise.all(['/data/funding-public.json','/data/mini/funding-manifest.json'].map(async suffix=>{
      const response=await fetch(`${base}${suffix}?v=${Date.now()}`,{signal:AbortSignal.timeout(20000)});
      if(!response.ok) throw new Error(`live_http_${response.status}`);
      return response.json();
    }));
    const liveDate=live[0].meta?.latestDate;
    if(!liveDate || liveDate<date || live[1].latestDate!==liveDate || live[0].meta?.taxonomyVersion !== catalog.meta.taxonomy_version || live[0].cards?.length !== catalog.cards.length || live[1].cardCount !== catalog.cards.length) throw new Error('live_funding_date_taxonomy_or_mini_parity_failed');
    const receipt={date,status:'published',source_commit:sha,website_date:liveDate,mini_date:live[1].latestDate,verified_at:new Date().toISOString()};
    write(path.join(directory,'published.json'),receipt); console.log(JSON.stringify(receipt));
  } finally {
    if(linked) fs.unlinkSync(path.join(checkout,'node_modules'));
    if(checkout && fs.existsSync(checkout)) run('git',['worktree','remove','--force','--',checkout]);
    unlock();
  }
}
