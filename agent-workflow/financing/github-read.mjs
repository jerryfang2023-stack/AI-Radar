import {spawnSync} from 'node:child_process';

export function githubFailure(result) {
  const stderr=String(result.stderr || '');
  const status=Number(stderr.match(/\(HTTP (\d{3})\)/u)?.[1] || 0);
  const rateLimited=status===429 || (status===403 && /rate limit|secondary rate|abuse detection/iu.test(stderr));
  const network=!status && (Boolean(result.error) || /timeout|timed out|connection|TLS|EOF|resolve host|network/iu.test(stderr));
  return {status, retryable:rateLimited || status>=500 || network,
    reason:rateLimited?'rate_limited':network?'network_error':status?`http_${status}`:'command_failed'};
}

// Only callers performing GET/list/view use this function. Approval, merge and
// workflow dispatch remain single attempts because their outcome can be unknown.
export function githubRead(args,{cwd,execute=spawnSync,pause=ms=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms)}={}) {
  if(!['api','pr','run'].includes(args[0]) || (args[0]!=='api' && !['view','list'].includes(args[1]))
    || args.some(arg=>/^(?:--(?:method|field|raw-field|input)(?:=|$)|-[XfF])/u.test(arg)))throw new Error('github_read_requires_readonly_arguments');
  let result;
  for(let attempt=0;attempt<3;attempt++) {
    result=execute('gh',args,{cwd,encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:8*1024*1024});
    if(!result.error && result.status===0)return {...result,attempts:attempt+1};
    const failure=githubFailure(result);
    result={...result,failure,attempts:attempt+1};
    if(!failure.retryable || attempt===2)return result;
    pause(1000*(attempt+1));
  }
  return result;
}
