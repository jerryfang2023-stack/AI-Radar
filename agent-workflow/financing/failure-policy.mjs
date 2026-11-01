// Only known transport/response failures are retried. Fact holds, permissions,
// unknown exceptions and uncertain writes never become automatic approvals.
const reviewRetryCodes=new Set(['hermes_review_ambiguous_or_incomplete_json','hermes_review_incomplete',
  'hermes_review_submission_missing','hermes_review_response_schema','hermes_review_transport']);

export function reviewFailure(receipt,result,identity='review') {
  const code=receipt?.error_code || (result.error?.code==='ETIMEDOUT'?'hermes_review_transport':'hermes_review_unknown_failure');
  return Object.assign(new Error(code),{retryable:reviewRetryCodes.has(code) && (receipt?.retryable===true || result.error?.code==='ETIMEDOUT'),
    recovery_key:`review:${identity}`,failure_kind:'review_response'});
}

export function failureRecovery(error,state,now=Date.now()) {
  if(error.retryable!==true || !error.recovery_key)return null;
  const key=error.recovery_key,prior=state.recovery_attempts?.[key],count=(prior?.count || 0)+1;
  if(count>3)return null;
  const attempt={count,error:error.message,at:new Date(now).toISOString(),next_retry_at:new Date(now+Math.min(30,2**count)*60000).toISOString()};
  return {status:'retry_pending',error:null,reason:error.message,retry:{key,...attempt},
    recovery_attempts:{...state.recovery_attempts,[key]:attempt}};
}
