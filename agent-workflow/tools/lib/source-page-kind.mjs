// Company directories carry a history and related-news dates, not one disclosure.
// Keep them available as research context, never as a standalone event source.
export function isCompanyProfileUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return (url.hostname === 'pedaily.cn' || url.hostname.endsWith('.pedaily.cn'))
      && /^\/(?:vc\/)?company\/\d+(?:\.html?)?\/?$/iu.test(url.pathname);
  } catch { return false; }
}
