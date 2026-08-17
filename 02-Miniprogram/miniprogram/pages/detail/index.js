const { isWatched, toggleWatch, isCompared, toggleCompare } = require("../../utils/storage.js");
const { recordBrowse } = require("../../utils/member.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { companyEntityKey, investorEntityKey, personEntityKey } = require("../../utils/entity-library.js");
const { getAccessState } = require("../../utils/access.js");

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
  data: { card: null, watched: false, compared: false, registrationOpen: false },

  onLoad(options) {
    this.cardId = options.id;
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
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
    this.recordView(card);
    this.setData({ card, watched: isWatched(card.id), compared: isCompared(card.id) });
  },

  recordView(card) {
    if (!this.browseRecorded && card && getAccessState() === "active") {
      recordBrowse(card.id);
      this.browseRecorded = true;
    }
  },

  closeRegistration() {
    this.pendingAction = "";
    this.setData({ registrationOpen: false });
  },

  continueAfterRegistration() {
    const action = this.pendingAction;
    this.pendingAction = "";
    this.setData({ registrationOpen: false });
    this.recordView(this.data.card);
    if (action === "watch") this.applyWatch();
    if (action === "compare") this.applyCompare();
  },

  onShow() {
    if (this.data.card) this.setData({ watched: isWatched(this.data.card.id), compared: isCompared(this.data.card.id) });
  },

  toggleWatch() {
    if (this.requireRegistration("watch")) return;
    this.applyWatch();
  },

  applyWatch() {
    toggleWatch(this.data.card.id);
    this.setData({ watched: isWatched(this.data.card.id) });
    wx.showToast({ title: this.data.watched ? "已加入观察" : "已取消收藏", icon: "none" });
  },

  toggleCompare() {
    if (this.requireRegistration("compare")) return;
    this.applyCompare();
  },

  applyCompare() {
    const result = toggleCompare(this.data.card.id);
    if (result.full) {
      wx.showToast({ title: "最多比较 3 家公司", icon: "none" });
      return;
    }
    this.setData({ compared: result.selected });
    wx.showToast({ title: result.selected ? "已加入比较" : "已移出比较", icon: "none" });
  },

  requireRegistration(action) {
    if (getAccessState() !== "unregistered") return false;
    this.pendingAction = action;
    this.setData({ registrationOpen: true });
    return true;
  },

  copySource(event) {
    const url = event.currentTarget.dataset.url;
    if (!url) return;
    wx.setClipboardData({ data: url, success: () => wx.showToast({ title: "来源链接已复制", icon: "success" }) });
  },

  openCompany() {
    const key = companyEntityKey(this.data.card.company);
    if (key) wx.navigateTo({ url: `/pages/entity-detail/index?type=companies&key=${encodeURIComponent(key)}` });
  },

  openInvestor(event) {
    const key = investorEntityKey(event.currentTarget.dataset.name);
    if (key) wx.navigateTo({ url: `/pages/entity-detail/index?type=investors&key=${encodeURIComponent(key)}` });
  },

  openPerson(event) {
    const founder = { id: event.currentTarget.dataset.id || "", name: event.currentTarget.dataset.name || "" };
    const key = personEntityKey(founder, this.data.card.company);
    if (key) wx.navigateTo({ url: `/pages/entity-detail/index?type=people&key=${encodeURIComponent(key)}` });
  },

  onShareAppMessage() {
    const card = this.data.card;
    return {
      title: card ? `${card.company} ${card.round}融资｜观澜 AI` : "观澜 AI 融资情报",
      path: `/pages/detail/index?id=${encodeURIComponent(card?.id || this.cardId || "")}&from=share`,
    };
  },

  onShareTimeline() {
    const card = this.data.card;
    return {
      title: card ? `${card.company} ${card.round}融资｜观澜 AI` : "观澜 AI 融资情报",
      query: `id=${encodeURIComponent(card?.id || this.cardId || "")}&from=share`,
    };
  },
});
