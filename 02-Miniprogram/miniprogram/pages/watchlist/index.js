const fundingIndex = require("../../data/funding-index.js");
const { getWatchIds, toggleWatch } = require("../../utils/storage.js");

Page({
  data: { cards: [] },
  onShow() { this.refresh(); },
  refresh() {
    const watchSet = new Set(getWatchIds());
    this.setData({ cards: fundingIndex.cards.filter((card) => watchSet.has(card.id)).map((card) => ({ ...card, watched: true })) });
  },
  openCard(event) { wx.navigateTo({ url: `/pages/detail/index?id=${event.detail.id}` }); },
  toggleWatch(event) { toggleWatch(event.detail.id); this.refresh(); },
  openTerminal() { wx.switchTab({ url: "/pages/terminal/index" }); },
});
