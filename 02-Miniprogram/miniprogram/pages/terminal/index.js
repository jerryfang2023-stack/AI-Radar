const { filterCards, sortCards } = require("../../utils/funding.js");
const { getWatchIds, toggleWatch, getCompareIds } = require("../../utils/storage.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
const { getAccessState, openMembership } = require("../../utils/access.js");
const { track } = require("../../utils/analytics.js");

const bundledFundingIndex = getFundingData().index;
const MARKET_SCOPE_KEY = "guanlan_funding_market_scope_v2";
const MARKET_SCOPES = ["global", "china"];

const DEFAULT_FILTERS = {
  keyword: "",
  period: "all",
  marketRegion: "global",
  region: "all",
  roundGroup: "all",
  categoryId: "all",
  evidenceId: "all",
};

Page({
  data: {
    cards: [],
    visibleCount: 0,
    filteredCount: 0,
    meta: bundledFundingIndex.meta,
    watchCount: 0,
    selectedIds: [],
    todayCount: 0,
    weekCount: 0,
    latestDateShort: "",
    scopeCardCount: 0,
    scopeCounts: { china: 0, global: 0 },
    selectedMarketRegion: "global",
    registrationOpen: false,
    registrationRequired: false,
    sort: "latest",
    filters: { ...DEFAULT_FILTERS },
  },

  onLoad() {
    this.allCards = bundledFundingIndex.cards;
    this.filteredCards = [];
    this.pageSize = 36;
    const savedScope = wx.getStorageSync(MARKET_SCOPE_KEY);
    const selectedMarketRegion = MARKET_SCOPES.includes(savedScope) ? savedScope : "global";
    this.setData({
      selectedIds: getCompareIds(),
      selectedMarketRegion,
      "filters.marketRegion": selectedMarketRegion,
    }, () => {
      this.updateMetrics(bundledFundingIndex);
      this.refreshCards(true);
    });
    refreshFundingData().then((state) => this.applyFundingData(state.index));
  },

  onShow() {
    syncTabBar(this, 0);
    const currentIndex = getFundingData().index;
    if (currentIndex.meta.generatedAt !== this.data.meta.generatedAt) this.applyFundingData(currentIndex);
    const selectedIds = getCompareIds();
    this.setData({ selectedIds }, () => this.renderSlice(Math.max(this.data.visibleCount, this.pageSize)));
  },

  applyFundingData(index) {
    if (!index?.cards?.length) return;
    this.allCards = index.cards;
    this.updateMetrics(index);
    this.setData({ meta: index.meta }, () => this.refreshCards(true));
  },

  updateMetrics(index) {
    const latest = new Date(`${index.meta.latestDate}T00:00:00`);
    const scopeCounts = {
      china: index.cards.filter((card) => card.marketRegion === "china").length,
      global: index.cards.filter((card) => card.marketRegion === "global").length,
    };
    const scopeCards = index.cards.filter((card) => card.marketRegion === this.data.selectedMarketRegion);
    const todayCount = scopeCards.filter((card) => card.date === index.meta.latestDate).length;
    const weekCount = scopeCards.filter((card) => {
      const current = new Date(`${card.date}T00:00:00`);
      return Number.isFinite(current.getTime()) && latest.getTime() - current.getTime() <= 6 * 86400000;
    }).length;
    this.setData({
      todayCount,
      weekCount,
      scopeCardCount: scopeCards.length,
      scopeCounts,
      latestDateShort: index.meta.latestDate.slice(5),
    });
  },

  onReachBottom() {
    if (this.data.visibleCount >= this.filteredCards.length) return;
    this.renderSlice(this.data.visibleCount + this.pageSize);
  },

  refreshWatchState() {
    const watchIds = getWatchIds();
    const watchSet = new Set(watchIds);
    this.setData({
      watchCount: watchIds.length,
      cards: this.data.cards.map((card) => ({ ...card, watched: watchSet.has(card.id) })),
    });
  },

  refreshCards(reset) {
    const filtered = filterCards(this.allCards, this.data.filters, this.data.meta.latestDate);
    this.filteredCards = sortCards(filtered, this.data.sort);
    this.setData({ filteredCount: this.filteredCards.length });
    this.renderSlice(reset ? this.pageSize : Math.max(this.data.visibleCount, this.pageSize));
  },

  renderSlice(limit) {
    const watchSet = new Set(getWatchIds());
    const selectedSet = new Set(this.data.selectedIds);
    const slice = this.filteredCards.slice(0, limit).map((card) => ({
      ...card,
      watched: watchSet.has(card.id),
      selected: selectedSet.has(card.id),
    }));
    this.setData({ cards: slice, visibleCount: slice.length, watchCount: watchSet.size });
  },

  onSearchInput(event) {
    this.setData({ "filters.keyword": event.detail.value }, () => this.refreshCards(true));
  },

  onSearchConfirm(event) {
    track("search_submitted", {
      scope: "funding",
      queryLength: String(event.detail.value || "").trim().length,
      resultCount: this.data.filteredCount,
    });
  },

  clearSearch() {
    this.setData({ "filters.keyword": "" }, () => this.refreshCards(true));
  },

  changeMarketRegion(event) {
    const marketRegion = event.currentTarget.dataset.region;
    if (!MARKET_SCOPES.includes(marketRegion) || marketRegion === this.data.selectedMarketRegion) return;
    wx.setStorageSync(MARKET_SCOPE_KEY, marketRegion);
    this.setData({
      selectedMarketRegion: marketRegion,
      "filters.marketRegion": marketRegion,
    }, () => {
      track("filter_changed", { scope: "funding", filter: "marketRegion", value: marketRegion });
      this.updateMetrics({ cards: this.allCards, meta: this.data.meta });
      this.refreshCards(true);
    });
  },

  changeSort() {
    const next = this.data.sort === "latest" ? "amount" : this.data.sort === "amount" ? "company" : "latest";
    this.setData({ sort: next }, () => this.refreshCards(true));
  },

  openCard(event) {
    const id = event.detail.id;
    const accessState = getAccessState();
    if (accessState === "unregistered") {
      this.pendingCardId = id;
      this.setData({ registrationOpen: true, registrationRequired: true });
      return;
    }
    if (accessState === "expired") return openMembership();
    wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },

  closeRegistration() {
    this.pendingCardId = "";
    this.setData({ registrationOpen: false, registrationRequired: false });
  },

  continueAfterRegistration() {
    const id = this.pendingCardId;
    this.pendingCardId = "";
    this.setData({ registrationOpen: false, registrationRequired: false });
    if (id) wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },

  toggleWatch(event) {
    toggleWatch(event.detail.id);
    this.renderSlice(this.data.visibleCount);
  },

  openCompare() {
    if (this.data.selectedIds.length < 2) {
      wx.showToast({ title: "请在详情页加入至少 2 家公司", icon: "none" });
      return;
    }
    wx.navigateTo({ url: `/pages/compare/index?ids=${encodeURIComponent(this.data.selectedIds.join(","))}` });
  },

  openWatchlist() { wx.navigateTo({ url: "/pages/saved/index" }); },
});
