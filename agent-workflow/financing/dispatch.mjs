#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { queryPlan } from './discovery.mjs';
const args = new Map(process.argv.slice(2).map(arg => { const [key,...value] = arg.replace(/^--/u,'').split('='); return [key,value.join('=')]; }));
const date = args.get('date') || new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
queryPlan(date);
const repo = process.env.GH_REPO || 'jerryfang2023-stack/AI-Radar';
function gh(args, optional = false) {
  const result = spawnSync('gh',args,{ encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:8*1024*1024 });
  if (result.status !== 0) { if(optional) return null; throw new Error(`github_request_failed:${args.slice(0,2).join('_')}`); }
  return result.stdout.trim();
}
const report = gh(['api',`repos/${repo}/contents/agent-workflow/reports/financing/${date}/publication.json?ref=main`,'--jq','.content'],true);
let publication;
if (report) publication = JSON.parse(Buffer.from(report,'base64').toString('utf8'));
if (publication?.date === date && ['ready_for_review','no_new_financing','pending_verification'].includes(publication.status)) {
  console.log(JSON.stringify({date,status:publication.status === 'ready_for_review' ? 'awaiting_portal' : publication.status, accepted_on_main:true}));
} else {
  const runs = JSON.parse(gh(['run','list','--repo',repo,'--workflow','funding-daily-pr.yml','--branch','main','--limit','60','--json','databaseId,displayTitle,status,conclusion']));
  const matching = runs.filter(run => run.displayTitle === `Financing ${date}`);
  const active = matching.find(run => run.status !== 'completed');
  if (active) console.log(JSON.stringify({date,status:'running',run_id:active.databaseId}));
  else {
    let resume;
    for(const run of matching) {
      const artifacts = JSON.parse(gh(['api',`repos/${repo}/actions/runs/${run.databaseId}/artifacts`]));
      if(artifacts.artifacts.some(row => row.name === `financing-${date}` && !row.expired)) { resume=run.databaseId; break; }
    }
    if(args.get('dry-run') !== 'true') gh(['workflow','run','funding-daily-pr.yml','--repo',repo,'--ref','main','-f',`date=${date}`,...(resume?['-f',`resume_run_id=${resume}`]:[])]);
    console.log(JSON.stringify({date,status:args.get('dry-run') === 'true' ? 'planned' : 'dispatched',resume_run_id:resume || null}));
  }
}
