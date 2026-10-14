// A throttled API response is not evidence of repository privacy. Fall back to
// the anonymous repository page, and accept only an explicit 404 response.
export async function anonymousRepositoryVisibility(repository, {fetchImpl = fetch, wait = ms => new Promise(resolve => setTimeout(resolve, ms))} = {}) {
  const probes = [];
  for (const url of [`https://api.github.com/repos/${repository}`, `https://github.com/${repository}`]) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetchImpl(url, {
          headers: {'user-agent': 'WaveSight-private-evidence-boundary'},
          redirect: 'error', signal: AbortSignal.timeout(15000),
        });
        const status = response.status;
        await response.body?.cancel();
        probes.push({url, status});
        if (status === 200) return {private: false, status, probes};
        if (status === 404) return {private: true, status, probes};
        if (![403, 408, 429].includes(status) && status < 500) break;
      } catch (error) { probes.push({url, error: error.name}); }
      if (attempt < 2) await wait(1000 * (attempt + 1));
    }
  }
  return {private: false, status: probes.at(-1)?.status || 0, probes};
}
