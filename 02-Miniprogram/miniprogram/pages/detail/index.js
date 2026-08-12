const { isWatched, toggleWatch, isCompared, toggleCompare } = require("../../utils/storage.js");
const { recordBrowse } = require("../../utils/member.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");

function normalizedCard(card) {
  if (!card) return null;
  return {
    ...card,
    founders: card.founders || [],
    institutionRationales: card.institutionRationales || [],
    products: (card.products || []).map((item) => ({ ...item, features: item.features || [] })),
    customers: card.customers || [],
    metrics: card.metrics || [],
    comparisons: card.comparisons || [],
    investors: card.investors || [],
    signals: card.signals || [],
    risks: card.risks || [],
    history: card.history || [],
    sources: card.sources || [],
  };
}

Page({
  data: { card: null, watched: false, compared: false },

  onLoad(options) {
    this.cardId = options.id;
    const bundledCard = normalizedCard(getFundingData().details[this.cardId]);
    if (bundledCard) this.renderCard(bundledCard);
    refreshFundingData().then((state) => {
      const card = normalizedCard(state.details[this.cardId]);
      if (card) this.renderCard(card);
      else if (!this.data.card) {
        wx.showToast({ title: "融资记录不存在", icon: "none" });
        setTimeout(() => wx.navigateBack(), 500);
      }
    });
  },

  renderCard(card) {
    if (!this.browseRecorded) {
      recordBrowse(card.id);
      this.browseRecorded = true;
    }
    this.setData({ card, watched: isWatched(card.id), compared: isCompared(card.id) });
  },

  onShow() {
    if (this.data.card) this.setData({ watched: isWatched(this.data.card.id), compared: isCompared(this.data.card.id) });
  },

  toggleWatch() {
    toggleWatch(this.data.card.id);
    this.setData({ watched: isWatched(this.data.card.id) });
    wx.showToast({ title: this.data.watched ? "已加入观察" : "已取消收藏", icon: "none" });
  },

  toggleCompare() {
    const result = toggleCompare(this.data.card.id);
    if (result.full) {
      wx.showToast({ title: "最多比较 3 家公司", icon: "none" });
      return;
    }
    this.setData({ compared: result.selected });
    wx.showToast({ title: result.selected ? "已加入比较" : "已移出比较", icon: "none" });
  },

  copySource(event) {
    const url = event.currentTarget.dataset.url;
    if (!url) return;
    wx.setClipboardData({ data: url, success: () => wx.showToast({ title: "来源链接已复制", icon: "success" }) });
  },
});
