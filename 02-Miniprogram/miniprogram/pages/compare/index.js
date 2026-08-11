const details = require("../../data/funding-details.js");

function compareText(cards) {
  return cards.map((card) => [
    card.company,
    `轮次：${card.round}`,
    `本轮金额：${card.amount}`,
    `累计融资：${card.cumulativeAmount}`,
    `披露日期：${card.date}`,
    `市场：${card.category} / ${card.subcategory}`,
    `投资方：${card.investors.map((item) => `${item.name}${item.role ? `（${item.role}）` : ""}`).join("、") || "未披露"}`,
    `证据：${card.evidenceLabel}（${card.sourceCount}条来源）`,
  ].join("\n")).join("\n\n");
}

Page({
  data: { cards: [] },
  onLoad(options) {
    const ids = decodeURIComponent(options.ids || "").split(",").filter(Boolean).slice(0, 3);
    this.setData({ cards: ids.map((id) => details[id]).filter(Boolean) });
  },
  copyComparison() {
    if (this.data.cards.length < 2) return;
    wx.setClipboardData({ data: compareText(this.data.cards), success: () => wx.showToast({ title: "比较摘要已复制", icon: "success" }) });
  },
  openCard(event) { wx.navigateTo({ url: `/pages/detail/index?id=${event.currentTarget.dataset.id}` }); },
});
