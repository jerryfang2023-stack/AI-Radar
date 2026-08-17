const { getFundingData } = require("../../utils/live-data.js");
const { removeCompare } = require("../../utils/storage.js");
const { fetchProtectedContent } = require("../../utils/payment.js");

function compareText(cards) {
  return cards.map((card) => [
    card.company,
    `轮次：${card.round}`,
    `本轮金额：${card.amount}`,
    `累计融资：${card.cumulativeAmount}`,
    `披露日期：${card.date}`,
    `市场：${card.category} / ${card.subcategory}`,
    `投资方：${(card.investors || []).map((item) => `${item.name}${item.role ? `（${item.role}）` : ""}`).join("、") || "未披露"}`,
    `证据：${card.evidenceLabel}（${card.sourceCount}条来源）`,
  ].join("\n")).join("\n\n");
}

Page({
  data: { cards: [], contentLocked: false, registrationOpen: false },
  onLoad(options) {
    this.ids = decodeURIComponent(options.ids || "").split(",").filter(Boolean).slice(0, 3);
    this.renderPreview();
    this.loadProtectedCards();
  },
  renderPreview() {
    const cards = getFundingData().index.cards;
    this.setData({ cards: this.ids.map((id) => cards.find((item) => item.id === id)).filter(Boolean) });
  },
  async loadProtectedCards() {
    try {
      const cards = await Promise.all(this.ids.map((id) => fetchProtectedContent("funding", id)));
      this.setData({ cards: cards.filter(Boolean), contentLocked: false });
    } catch (error) {
      if (error.statusCode === 401 || error.statusCode === 403 || error.code === "MEMBERSHIP_REQUIRED" || error.code === "AUTH_INVALID") this.setData({ contentLocked: true });
    }
  },
  copyComparison() {
    if (this.data.contentLocked) { this.openRegistration(); return; }
    if (this.data.cards.length < 2) return;
    wx.setClipboardData({ data: compareText(this.data.cards), success: () => wx.showToast({ title: "比较摘要已复制", icon: "success" }) });
  },
  removeCard(event) {
    const id = event.currentTarget.dataset.id;
    this.ids = this.ids.filter((item) => item !== id);
    removeCompare(id);
    this.renderPreview();
    wx.showToast({ title: "已取消该公司比较", icon: "none" });
  },
  backToFunding() { wx.switchTab({ url: "/pages/terminal/index" }); },
  openCard(event) { wx.navigateTo({ url: `/pages/detail/index?id=${event.currentTarget.dataset.id}` }); },
  openRegistration() { this.setData({ registrationOpen: true }); },
  closeRegistration() { this.setData({ registrationOpen: false }); },
  continueAfterRegistration() { this.setData({ registrationOpen: false }); this.loadProtectedCards(); },
});
