const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

// The financing feed and selected cursor both retain accepted pages. Retry
// only a failed read, never a successful page or a contract error.
export async function fetchAIHotPage(url,options, {fetcher=fetch,wait=sleep}={}) {
  for(let attempt=0;attempt<4;attempt++) {
    try {
      const response=await fetcher(url,{...options,signal:AbortSignal.timeout(20000)});
      if(attempt<3 && (response.status===429 || response.status>=500)) {
        await response.body?.cancel();
        await wait(1000*2**attempt);continue;
      }
      // Include response body timeouts in the retry boundary.
      if(response.ok || response.status===409) {
        const data=await response.json();
        return {status:response.status,ok:response.ok,json:async()=>data};
      }
      return response;
    } catch(error) {
      if(attempt===3 || !['TypeError','TimeoutError','AbortError'].includes(error.name))throw error;
      await wait(1000*2**attempt);
    }
  }
}
