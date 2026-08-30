// Keep loaded pages stable during refresh. Protected responses remain page-local;
// no persistent cache or skipped server membership checks are introduced.
function readCommunityPage(page, action, clearOnError) {
  if (page._communityRead) return page._communityRead;
  page.setData({ loading: true, showLoading: false, error: "" });
  const timer = setTimeout(() => {
    if (!page.data.loaded) page.setData({ showLoading: true });
  }, 180);
  const pending = Promise.resolve().then(action).then(() => {
    page.setData({ loaded: true });
  }).catch((error) => {
    if (clearOnError) {
      clearOnError(error);
      page.setData({ loaded: false });
    }
    page.setData({ error: error.message });
  }).finally(() => {
    clearTimeout(timer);
    page.setData({ loading: false, showLoading: false });
    page._communityRead = null;
  });
  page._communityRead = pending;
  return pending;
}

module.exports = { readCommunityPage };
