#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { acquireLock, read, write, runStages, digest } from './state.mjs';
import {resolveReadModelOutput,verifyCurrentReadModel} from './read-model.mjs';
import { queryPlan } from './discovery.mjs';
import { parseArgs } from './args.mjs';
import { successfulPagesDeployment } from '../tools/wait-for-pages-deployment.mjs';
import {publicationInputs,publicationCheckpointCommands,publicationCodeInputs} from './publication-plan.mjs';
import {pagesDeploymentInputs} from '../tools/lib/pages-deployment-inputs.mjs';
import {resolveGuanlanVaultRoot} from '../tools/guanlan-vault-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = parseArgs();
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
const readModelOutput = resolveReadModelOutput(root,args.get('read-model-dir'));
if (args.get('dry-run') === 'true') {
  console.log(JSON.stringify({date,sourceSha:args.get('source-sha') || 'origin/main',stages:['accepted_main','pages','data_lake','financing_read_model','vault','editorial_review','portal_with_live_parity','ops'],parallelGroups:[['data_lake','financing_read_model','vault'],['editorial_review'],['portal'],['ops']],portal,directory,readModelOutput}));
} else {
  const unlock = acquireLock(directory);
  let checkout, linked=false;
  try {
    run('git',['fetch','origin','main','--quiet']);
    const pinned=args.get('source-sha');
    if(pinned && !/^[a-f0-9]{40}$/u.test(pinned))throw new Error('invalid_source_sha');
    const sha = pinned || run('git',['rev-parse','origin/main']);
    run('git',['merge-base','--is-ancestor',sha,'origin/main']);
    const raw = run('git',['show',`${sha}:01-SiteV2/site/data/financing-catalog-v1.json`]);
    const catalog = JSON.parse(raw);
    if(catalog.meta?.taxonomy_version !== 'AI-FUNDING-TAGS-1.0' || !Array.isArray(catalog.cards)) throw new Error('accepted_financing_catalog_missing');
    const pages = JSON.parse(run('gh',['run','list','--repo','jerryfang2023-stack/AI-Radar','--workflow','github-pages.yml','--limit','40','--json','headSha,conclusion,status,displayTitle,headBranch,event']));
    const deployed = await successfulPagesDeployment(pages,sha,
      async (base,head)=>spawnSync('git',['merge-base','--is-ancestor',base,head],{cwd:root,windowsHide:true}).status===0,
      async (base,head)=>spawnSync('git',['diff','--quiet',base,head,'--',...pagesDeploymentInputs],{cwd:root,windowsHide:true}).status===0);
    if(!deployed) throw new Error('awaiting_pages_for_accepted_commit');
    checkout = path.join(directory,`accepted-${process.pid}`);
    run('git',['worktree','add','--detach',checkout,sha]);
    const dependencies = [root,primary].find(candidate => fs.existsSync(path.join(candidate,'node_modules','ajv')) && fs.readFileSync(path.join(candidate,'package-lock.json'),'utf8')===fs.readFileSync(path.join(checkout,'package-lock.json'),'utf8'));
    if(!dependencies) throw new Error('accepted_dependencies_missing');
    fs.symlinkSync(path.join(dependencies,'node_modules'),path.join(checkout,'node_modules'),process.platform==='win32'?'junction':'dir'); linked=true;
    for(const name of ['.guanlan-vault.json','.evidence-backup.json']) if(fs.existsSync(path.join(primary,name))) fs.copyFileSync(path.join(primary,name),path.join(checkout,name));
    run('git',['fetch','origin','main','--quiet'],portal);
    const lake = `--lake-dir=${path.join(primary,'data-lake')}`;
    const plans = [
      {id:'data_lake', commands:[['agent-workflow/tools/sync-light-data-lake.mjs','--v4-only=true',lake],['agent-workflow/tools/assert-data-lake-v4.mjs',lake]]},
      {id:'financing_read_model', commands:[['agent-workflow/financing/read-model.mjs',`--output=${readModelOutput}`]]},
      {id:'vault', commands:[['agent-workflow/tools/sync-guanlan-vault-from-main.mjs',`--date=${date}`,`--runtime-dir=${directory}`,`--source-sha=${sha}`]]},
      {id:'editorial_review', commands:[[path.join(portal,'scripts/publish-from-wavesight.mjs'),`--wavesight-repo=${checkout}`,`--source-sha=${sha}`,'--review-only=true']]},
      {id:'portal', commands:[['agent-workflow/tools/assert-funding-insights-v1.mjs',`--date=${date}`],[path.join(portal,'scripts/publish-from-wavesight.mjs'),`--wavesight-repo=${checkout}`,`--source-sha=${sha}`,'--skip-review=true']]},
      {id:'ops', commands:[['agent-workflow/tools/publish-ops-console.mjs',`--source-sha=${sha}`]]},
    ].map(stage => ({...stage,dependsOn:[],
      // The accepted SHA already binds the checkout contents. A fresh temporary
      // path must not invalidate a completed release when resuming the OPS step.
      checkpointCommands:publicationCheckpointCommands(stage.commands,checkout,sha),
      inputVersion:()=>digest([
        run('git',['ls-tree',sha,'--',...publicationInputs[stage.id==='editorial_review'?'portal':stage.id],...publicationCodeInputs(checkout,stage.commands)]),
        run('git',['ls-tree',sha,'--','package-lock.json','agent-workflow/financing/state.mjs','agent-workflow/financing/publication-plan.mjs','agent-workflow/financing/publish.mjs']),
        ['editorial_review','portal'].includes(stage.id)?run('git',['ls-tree','origin/main','--','scripts','config','package-lock.json'],portal):'',
        ...['.guanlan-vault.json','.evidence-backup.json'].map(name=>fs.existsSync(path.join(primary,name))?digest(fs.readFileSync(path.join(primary,name),'utf8')):'missing'),
      ]),
      valid:async()=>{
        if(stage.id==='data_lake') {
          const manifest=read(path.join(primary,'data-lake','manifest.json'));
          return manifest?.tables?.length>0 && manifest.tables.every(table=>fs.existsSync(path.join(primary,'data-lake','tables',table.name+'.jsonl')));
        }
        if(stage.id==='vault') {
          const vaultRoot=resolveGuanlanVaultRoot(primary),manifest=read(path.join(vaultRoot,'.guanlan-generated.json'));
          return manifest?.generatedFiles?.length>0 && manifest.generatedFiles.every(file=>fs.existsSync(path.join(vaultRoot,file)));
        }
        if(stage.id==='portal') {
          const prior=read(path.join(primary,'..','..','runtime','publication-resources','portal','accepted.json'));
          if(!prior?.portal_commit)return false;
          try {
            const response=await fetch(`${args.get('live-url') || 'https://www.zkdlj.vip'}/publication.json?v=${Date.now()}`,{signal:AbortSignal.timeout(20000)});
            return response.ok && (await response.json()).portalCommit===prior.portal_commit;
          } catch {return false;}
        }
        if(stage.id!=='financing_read_model')return true;
        try {
          verifyCurrentReadModel({output:readModelOutput,inputHash:digest(fs.readFileSync(path.join(checkout,'01-SiteV2/site/data/financing-catalog-v1.json'),'utf8'))});
          return true;
        } catch {return false;}
      }}));
    await runStages({date,codeVersion:'FINANCING-PUBLICATION-2',stages:plans,
      parallelGroups:[['data_lake','financing_read_model','vault'],['editorial_review'],['portal'],['ops']],
      file:path.join(directory,'publication-stages.json'), execute: async stage => {
      // Shared resources have separate owners. Unrelated targets can proceed;
      // competing writers fail immediately and keep successful checkpoints.
      const resource=path.join(primary,'..','..','runtime','publication-resources',stage.id);
      const release=acquireLock(resource);
      try {
        const prior=read(path.join(resource,'accepted.json'));
        if(prior?.source_commit && spawnSync('git',['merge-base','--is-ancestor',prior.source_commit,sha],{cwd:root,windowsHide:true}).status!==0) throw new Error(`publication_target_superseded:${stage.id}:${prior.source_commit}`);
        for(const command of stage.commands) {
          const fd=fs.openSync(path.join(directory,`${stage.id}.log`),'a');
          try {
            await new Promise((resolve,reject)=>{
              const child=spawn(process.execPath,command,{cwd:checkout,windowsHide:true,stdio:['ignore',fd,fd]});
              const timer=setTimeout(()=>child.kill(),1200000);
              child.once('error',error=>{clearTimeout(timer);reject(error);});
              child.once('close',(status,signal)=>{clearTimeout(timer);status===0?resolve():reject(new Error(`${stage.id}:${command[0]}:${status ?? signal}`));});
            });
          } finally {fs.closeSync(fd);}
        }
        let portalCommit;
        if(stage.id==='portal') {
          const output=fs.readFileSync(path.join(directory,'portal.log'),'utf8').trim();
          const start=output.lastIndexOf('\n{');
          portalCommit=JSON.parse(start<0?output:output.slice(start+1)).portalCommit;
          if(!/^[a-f0-9]{40}$/u.test(portalCommit || ''))throw new Error('portal_publication_commit_receipt_missing');
        }
        write(path.join(resource,'accepted.json'),{source_commit:sha,...(portalCommit?{portal_commit:portalCommit}:{}),verified_at:new Date().toISOString()});
      } finally {release();}
    }});
    const base=args.get('live-url') || 'https://www.zkdlj.vip';
    const live=await Promise.all(['/data/funding-public.json','/data/mini/funding-manifest.json'].map(async suffix=>{
      const response=await fetch(`${base}${suffix}?v=${Date.now()}`,{signal:AbortSignal.timeout(20000)});
      if(!response.ok) throw new Error(`live_http_${response.status}`);
      return response.json();
    }));
    const liveDate=live[0].meta?.latestDate;
    if(!liveDate || liveDate<date || live[1].latestDate!==liveDate || live[0].meta?.taxonomyVersion !== catalog.meta.taxonomy_version || live[0].cards?.length !== catalog.cards.length || live[1].cardCount !== catalog.cards.length) throw new Error('live_funding_date_taxonomy_or_mini_parity_failed');
    const receipt={date,status:'published',source_commit:sha,pages_commit:deployed.deployedSha,pages_evidence:deployed.evidence,website_date:liveDate,mini_date:live[1].latestDate,verified_at:new Date().toISOString()};
    write(path.join(directory,'published.json'),receipt); console.log(JSON.stringify(receipt));
  } finally {
    if(linked) fs.unlinkSync(path.join(checkout,'node_modules'));
    if(checkout && fs.existsSync(checkout)) run('git',['worktree','remove','--force','--',checkout]);
    unlock();
  }
}
