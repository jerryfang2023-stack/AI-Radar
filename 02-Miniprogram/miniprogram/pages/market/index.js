const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");

function withBars(items) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return items.map((item) => ({ ...item, bar: Math.max(4, Math.round((item.count / max) * 100)) }));
}

Page({
  data: {
    meta: getFundingData().index.meta,
    categories: withBars(getFundingData().index.categories),
    rounds: withBars(getFundingData().index.rounds.slice(0, 8)),
  },
  onLoad() { refreshFundingData().then((state) => this.applyData(state.index)); },
  onShow() { this.applyData(getFundingData().index); },
  applyData(index) {
    this.setData({ meta: index.meta, categories: withBars(index.categories), rounds: withBars(index.rounds.slice(0, 8)) });
  },
  openCategory(event) {
    wx.setStorageSync("guanlan_pending_filter_v1", { categoryId: event.currentTarget.dataset.id });
    wx.switchTab({ url: "/pages/terminal/index" });
  },
});
