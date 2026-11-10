export function retrySafePagesArtifact(workflow) {
  const block=action=>workflow.match(new RegExp(`uses:\\s*actions/${action}@[^\\n]+\\n([\\s\\S]*?)(?=\\n\\s{6}-\\s|$)`,'u'))?.[1] || '';
  const upload=block('upload-artifact').match(/^\s+name:\s*(.+)$/mu)?.[1]?.trim();
  const deployed=block('deploy-pages').match(/^\s+artifact_name:\s*(.+)$/mu)?.[1]?.trim();
  return Boolean(upload && upload===deployed && /\$\{\{\s*github\.run_id\s*\}\}/u.test(upload) && /\$\{\{\s*github\.run_attempt\s*\}\}/u.test(upload));
}

// Recover only an observed Pages transport timeout, never a failed data/build gate.
export function recoverFailedPages({runs,sourceSha,workflowId,repository,attempts={},readFailure,rerun,record}) {
  if(!/^[a-f0-9]{40}$/u.test(sourceSha) || !Number.isSafeInteger(workflowId))throw Error('invalid_pages_recovery_identity');
  const candidates=runs.filter(run=>run.workflow_id===workflowId && run.path==='.github/workflows/github-pages.yml'
    && run.head_repository?.full_name===repository && run.head_branch==='main'
    && ((run.event==='push' && run.head_sha===sourceSha)
      || (run.event==='workflow_dispatch' && run.display_title===`Deploy Frontstage to GitHub Pages ${sourceSha}`)))
    .sort((a,b)=>b.id-a.id);
  const run=candidates[0];
  if(!run || run.conclusion==='success')return {status:'not_needed'};
  if(run.status!=='completed')return {status:'waiting',run_id:run.id};
  const blocked=reason=>({status:'blocked',reason,run_id:run.id});
  if(!Number.isSafeInteger(run.id)||!Number.isSafeInteger(run.run_attempt)||run.run_attempt<1)return blocked('invalid_run_identity');
  if(run.conclusion!=='failure')return blocked('deployment_not_successful');
  const key=`${run.id}:${run.run_attempt}`;
  if(attempts[key])return blocked('rerun_outcome_unconfirmed');
  if(run.run_attempt>=3 || Object.values(attempts).filter(a=>a.source_sha===sourceSha).length>=2)return blocked('retry_limit');
  const {jobs,logs,workflow}=readFailure(run);
  if(!retrySafePagesArtifact(workflow || ''))return blocked('workflow_not_retry_safe');
  const failed=jobs.filter(job=>job.conclusion==='failure');
  const deployOnly=failed.length>0 && failed.every(job=>{
    const failures=(job.steps||[]).filter(step=>step.conclusion==='failure');
    return failures.length===1 && failures[0].name==='Deploy to GitHub Pages';
  });
  const errors=[...logs.matchAll(/##\[error\]([^\r\n]+)/gu)].map(m=>m[1].trim());
  if(!deployOnly || !logs.includes('Current status: syncing_files') || !errors.length
    || errors.some(error=>error!=='Timeout reached, aborting!'))return blocked('unrecognized_deployment_failure');
  // Persist intent before the write. A lost response never permits replay of
  // this run/attempt; later API observations can show the queued/new attempt.
  let receipt={key,run_id:run.id,prior_attempt:run.run_attempt,source_sha:sourceSha,status:'unknown',requested_at:new Date().toISOString()};
  record(receipt);
  try {rerun(run);receipt={...receipt,status:'submitted'};record(receipt);return {status:'rerun_requested',run_id:run.id};}
  catch(error){record({...receipt,error:error.message});return blocked('rerun_outcome_unconfirmed');}
}
