const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { buildOverview } = require("../../utils/ecosystem-insights.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
const { track } = require("../../utils/analytics.js");

const MARKET_SCOPE_KEY = "guanlan_ecosystem_market_scope_v1";

Page({
  data: { marketRegion: "global", latestDate: "", signals: [], ranking: [], months: [], heatmap: [] },
  onLoad() {
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    const saved = wx.getStorageSync(MARKET_SCOPE_KEY);
    if (["global", "china"].includes(saved)) this.setData({ marketRegion: saved });
    this.applyData(getFundingData());
    refreshFundingData().then((state) => this.applyData(state));
  },
  onShow() { syncTabBar(this, 1); this.applyData(getFundingData()); },
  applyData(state) { this.setData(buildOverview(state.index, this.data.marketRegion)); },
  changeMarket(event) {
    const marketRegion = event.currentTarget.dataset.region;
    if (!["global", "china"].includes(marketRegion) || marketRegion === this.data.marketRegion) return;
    wx.setStorageSync(MARKET_SCOPE_KEY, marketRegion);
    this.setData({ marketRegion }, () => {
      track("filter_changed", { scope: "ecosystem", filter: "marketRegion", value: marketRegion });
      this.applyData(getFundingData());
    });
  },
  openSector(event) {
    const sector = event.currentTarget.dataset.sector;
    if (!sector) return;
    track("content_opened", { scope: "ecosystem_sector", sector });
    wx.navigateTo({ url: `/pages/sector-detail/index?sector=${encodeURIComponent(sector)}&market=${this.data.marketRegion}` });
  },
  onShareAppMessage() {
    return { title: "观澜 AI 生态图谱", path: "/pages/market/index" };
  },
  onShareTimeline() {
    return { title: "观澜 AI 生态图谱" };
  },
});
