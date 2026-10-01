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
  }).catch(async (error) => {
    if (error.statusCode === 403) {
      try {
        const result = await require("./payment.js").fetchMembership();
        if (result.community) require("./member.js").syncCommunity(result.community);
        if (result.membership) require("./member.js").syncMembership(result.membership);
        if (result.membership?.active) {
          await action();
          page.setData({ loaded: true, error: "" });
          return;
        }
        error = new Error("阅读权限已到期，请前往会员中心");
      } catch (refreshError) { error = refreshError; }
    }
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
