const { getHistory, clearHistory } = require("../../utils/member.js");
const { getWatchIds, toggleWatch } = require("../../utils/storage.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");

Page({
  data: { records: [] },
  onLoad() { refreshFundingData().then(() => this.refresh()); },
  onShow() { this.refresh(); },
  refresh() {
    const cards = new Map(getFundingData().index.cards.map((item) => [item.id, item]));
    const watched = new Set(getWatchIds());
    this.setData({ records: getHistory().map((item) => ({ ...item, card: cards.get(item.id), watched: watched.has(item.id) })).filter((item) => item.card) });
  },
  open(event) { wx.navigateTo({ url: `/pages/detail/index?id=${event.detail.id}` }); },
  toggleWatch(event) { toggleWatch(event.detail.id); this.refresh(); },
  clear() {
    wx.showModal({
      title: "清空浏览记录？",
      content: "只删除当前设备上的浏览记录，不会影响收藏与关注。",
      confirmColor: "#B85C5C",
      success: (result) => { if (result.confirm) { clearHistory(); this.refresh(); } },
    });
  },
});
