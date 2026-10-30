import {githubRead} from './github-read.mjs';

// gh log rendering/cache failures must not hide a completed job's diagnostics.
// Only read endpoints are used; unavailable or empty evidence still fails closed.
export function failedRunLog(repo,runId,{read=githubRead}={}) {
  if(!/^[\w.-]+\/[\w.-]+$/u.test(repo) || !/^[1-9]\d*$/u.test(String(runId)))throw new Error('invalid_failed_run_identity');
  const primary=read(['run','view',String(runId),'--repo',repo,'--log-failed']);
  if(primary.status===0 && primary.stdout?.trim())return primary.stdout;
  const get=args=>{const result=read(args);if(result.status!==0 || !result.stdout?.trim())throw new Error('failed_run_log_evidence_unavailable');return result.stdout;};
  const pages=JSON.parse(get(['api',`repos/${repo}/actions/runs/${runId}/jobs?per_page=100`,'--paginate','--slurp']));
  const jobs=pages.flatMap(page=>page.jobs || []).filter(job=>job.conclusion==='failure');
  if(!jobs.length || jobs.some(job=>!Number.isSafeInteger(job.id)||job.id<=0))throw new Error('failed_run_jobs_unavailable');
  return jobs.map(job=>get(['api',`repos/${repo}/actions/jobs/${job.id}/logs`,'--allow-escape-sequences'])).join('\n');
}
