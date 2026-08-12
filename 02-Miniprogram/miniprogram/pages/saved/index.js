const { getWatchIds, toggleWatch } = require("../../utils/storage.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");

Page({
  data: { cards: [] },
  onLoad() { refreshFundingData().then(() => this.refresh()); },
  onShow() { this.refresh(); },
  refresh() {
    const watchSet = new Set(getWatchIds());
    this.setData({ cards: getFundingData().index.cards.filter((card) => watchSet.has(card.id)).map((card) => ({ ...card, watched: true })) });
  },
  openCard(event) { wx.navigateTo({ url: `/pages/detail/index?id=${event.detail.id}` }); },
  toggleWatch(event) { toggleWatch(event.detail.id); this.refresh(); },
  openTerminal() { wx.switchTab({ url: "/pages/terminal/index" }); },
});
