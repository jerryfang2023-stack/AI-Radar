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
        if (result.community?.status === "joined") {
          await action();
          page.setData({ loaded: true, error: "" });
          return;
        }
        if (result.community?.status === "not_joined") error = new Error("申请已通过，请联系管理员登记入群日期后重试");
        else error = new Error("社群身份尚未通过核验，请在“我的”中查看社群状态");
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
