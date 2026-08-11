const fundingIndex = require("../../data/funding-index.js");

function withBars(items) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return items.map((item) => ({ ...item, bar: Math.max(4, Math.round((item.count / max) * 100)) }));
}

Page({
  data: {
    meta: fundingIndex.meta,
    categories: withBars(fundingIndex.categories),
    rounds: withBars(fundingIndex.rounds.slice(0, 8)),
  },
  openCategory(event) {
    wx.setStorageSync("guanlan_pending_filter_v1", { categoryId: event.currentTarget.dataset.id });
    wx.switchTab({ url: "/pages/terminal/index" });
  },
});
