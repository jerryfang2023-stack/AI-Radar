const { getFundingData, refreshFundingData, getReportData, refreshReportData } = require("../../utils/live-data.js");
const { buildOverview } = require("../../utils/ecosystem-insights.js");
const { mergeCommunityEssays } = require("../../utils/community-essays.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
const { track } = require("../../utils/analytics.js");

const MARKET_SCOPE_KEY = "guanlan_ecosystem_market_scope_v1";
const ECOSYSTEM_MODE_KEY = "guanlan_ecosystem_mode_v1";

Page({
  data: {
    mode: "map", marketRegion: "global", latestDate: "", signals: [], ranking: [], months: [], heatmap: [],
    activeType: "all", activeLabel: "最新观察", featured: null, reports: [],
    systemCheckDate: "", latestFundingDate: "", refreshFailed: false,
  },
  onLoad(options = {}) {
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    const savedRegion = wx.getStorageSync(MARKET_SCOPE_KEY);
    const savedMode = wx.getStorageSync(ECOSYSTEM_MODE_KEY);
    const mode = options.mode === "observation" || savedMode === "observation" ? "observation" : "map";
    if (["global", "china"].includes(savedRegion)) this.setData({ marketRegion: savedRegion });
    this.setData({ mode });
    this.applyFunding(getFundingData());
    this.refreshReports("all");
  },
  onShow() {
    syncTabBar(this, 1);
    const savedMode = wx.getStorageSync(ECOSYSTEM_MODE_KEY);
    if (["map", "observation"].includes(savedMode) && savedMode !== this.data.mode) this.setData({ mode: savedMode });
    this.applyFunding(getFundingData());
    this.refreshReports(this.data.activeType);
    return this.refreshData();
  },
  refreshData() {
    if (this.refreshRequest) return this.refreshRequest;
    // Keep the current content visible while checking both remote versions on every entry.
    this.refreshRequest = Promise.all([refreshFundingData(), refreshReportData()]).then(([funding, reports]) => {
      this.applyFunding(funding);
      this.refreshReports(this.data.activeType);
      this.setData({ refreshFailed: Boolean(funding.refreshFailed || reports.refreshFailed) });
    }).catch(() => this.setData({ refreshFailed: true })).finally(() => { this.refreshRequest = null; });
    return this.refreshRequest;
  },
  onPullDownRefresh() {
    return this.refreshData().then(() => {
      if (this.data.refreshFailed && wx.showToast) wx.showToast({ title: "刷新未完成，已保留原内容", icon: "none" });
    }).finally(() => wx.stopPullDownRefresh());
  },
  setMode(event) {
    const mode = event.currentTarget.dataset.mode;
    if (!["map", "observation"].includes(mode) || mode === this.data.mode) return;
    wx.setStorageSync(ECOSYSTEM_MODE_KEY, mode);
    this.setData({ mode });
    track("filter_changed", { scope: "ecosystem", filter: "mode", value: mode });
  },
  applyFunding(state) { this.setData(buildOverview(state.index, this.data.marketRegion)); },
  changeMarket(event) {
    const marketRegion = event.currentTarget.dataset.region;
    if (!["global", "china"].includes(marketRegion) || marketRegion === this.data.marketRegion) return;
    wx.setStorageSync(MARKET_SCOPE_KEY, marketRegion);
    this.setData({ marketRegion }, () => {
      track("filter_changed", { scope: "ecosystem", filter: "marketRegion", value: marketRegion });
      this.applyFunding(getFundingData());
    });
  },
  openSector(event) {
    const sector = event.currentTarget.dataset.sector;
    if (!sector) return;
    track("content_opened", { scope: "ecosystem_sector", sector });
    wx.navigateTo({ url: `/pages/sector-detail/index?sector=${encodeURIComponent(sector)}&market=${this.data.marketRegion}` });
  },
  refreshReports(type) {
    const reportIndex = getReportData().index;
    const community = mergeCommunityEssays(reportIndex.reports);
    const editorialReports = reportIndex.reports.filter((item) => item.type !== "community");
    const all = [...community, ...editorialReports].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const reports = type === "all" ? all : type === "community" ? community : editorialReports.filter((item) => item.type === type);
    const labels = { all: "最新观察", community: "社群精华", weekly: "周报", monthly: "月报" };
    this.setData({ activeType: type, activeLabel: labels[type], featured: reports[0] || null, reports: reports.slice(1) });
  },
  switchType(event) { this.refreshReports(event.currentTarget.dataset.type); },
  openReport(event) {
    const id = event.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: `/pages/report-detail/index?id=${id}` });
  },
  onShareAppMessage() {
    return this.data.mode === "observation"
      ? { title: "观澜 AI 行业观察", path: "/pages/market/index?mode=observation" }
      : { title: "观澜 AI 生态图谱", path: "/pages/market/index" };
  },
  onShareTimeline() { return { title: this.data.mode === "observation" ? "观澜 AI 行业观察" : "观澜 AI 生态图谱" }; },
});
