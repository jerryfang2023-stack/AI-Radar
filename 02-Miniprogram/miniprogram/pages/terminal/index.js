const { refreshFeatured, getFeatured } = require("../../utils/featured-observations.js");
const { selectFeatured, chinaDate } = require("../../utils/funding-featured.js");
const { filterCards, sortCards } = require("../../utils/funding.js");
const { getWatchIds, toggleWatch, getCompareIds } = require("../../utils/storage.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
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
    featuredCards: [],
    featuredCurrent: 0,
    featuredLabel: "",
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
    sort: "latest",
    filters: { ...DEFAULT_FILTERS },
    categoryOptions: [{ id: "all", label: "全部类别" }],
    categoryIndex: 0,
  },

  onLoad() {
    const featured = getFeatured();
    this.featuredObservations = featured.observations;
    this.featuredSelection = featured.selection;
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
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
    this.featuredVisible = true;
    syncTabBar(this, 0);
    this.refreshFeaturedObservations();
    refreshFundingData().then(state => { if(!this.featuredDisposed)this.applyFundingData(state.index); });
    const currentIndex = getFundingData().index;
    if (currentIndex.meta.generatedAt !== this.data.meta.generatedAt) this.applyFundingData(currentIndex);
    else this.updateMetrics(currentIndex);
    const selectedIds = getCompareIds();
    this.setData({ selectedIds }, () => this.renderSlice(Math.max(this.data.visibleCount, this.pageSize)));
  },

  onHide() { this.featuredVisible = false; clearTimeout(this.featuredTimer); },
  onUnload() { this.featuredDisposed = true; this.featuredVisible = false; clearTimeout(this.featuredTimer); },

  scheduleFeaturedBoundary() {
    if (!this.featuredVisible || this.featuredDisposed) return;
    clearTimeout(this.featuredTimer);
    const now = Date.now();
    const next = (this.featuredSelection?.windows || []).flatMap(w => [Date.parse(w.startsAt), Date.parse(w.endsAt)]).filter(t => t > now).sort((a,b) => a-b)[0];
    if (next) this.featuredTimer = setTimeout(() => {
      if (this.featuredVisible && !this.featuredDisposed) this.updateMetrics({ cards: this.allCards || [], meta: this.data.meta });
    }, Math.min(next - now + 25, 2147483647));
  },

  refreshFeaturedObservations() {
    return refreshFeatured().then(({ observations, selection }) => {
      if (this.featuredDisposed) return;
      this.featuredObservations = observations;
      this.featuredSelection = selection;
      this.updateMetrics({ cards: this.allCards || [], meta: this.data.meta });
    });
  },

  applyFundingData(index) {
    if (!Array.isArray(index?.cards)) return;
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
    const todayCount = scopeCards.filter((card) => card.date === chinaDate()).length;
    const weekCount = scopeCards.filter((card) => {
      const current = new Date(`${card.date}T00:00:00`);
      return Number.isFinite(current.getTime()) && latest.getTime() - current.getTime() <= 6 * 86400000;
    }).length;
    const featured = selectFeatured(index.cards, this.data.selectedMarketRegion, chinaDate(), this.featuredObservations || {}, this.featuredSelection || null);
    this.scheduleFeaturedBoundary();
    this.setData({
      featuredCards: featured.cards,
      featuredCurrent: Math.max(0, featured.cards.findIndex(card => card.id === this.data.featuredCards[this.data.featuredCurrent]?.id)),
      featuredLabel: featured.label,
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
    const categories = new Map(this.allCards.filter((card) => card.marketRegion === this.data.selectedMarketRegion)
      .map((card) => [card.categoryId, card.category]).filter(([id, label]) => id && label));
    const categoryOptions = [{ id: "all", label: "全部类别" }, ...Array.from(categories, ([id, label]) => ({ id, label }))];
    const categoryIndex = Math.max(0, categoryOptions.findIndex((item) => item.id === this.data.filters.categoryId));
    this.setData({ categoryOptions, categoryIndex, "filters.categoryId": categoryOptions[categoryIndex].id });
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

  changeCategory(event) {
    const option = this.data.categoryOptions[Number(event.detail.value)];
    if (!option) return;
    this.setData({ "filters.categoryId": option.id }, () => {
      track("filter_changed", { scope: "funding", filter: "categoryId", value: option.id });
      this.refreshCards(true);
    });
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

  changeFeatured(event) {
    const current=Number(event.detail.current);
    if(Number.isInteger(current) && current>=0 && current<this.data.featuredCards.length)this.setData({ featuredCurrent: current });
  },

  openFeatured(event) {
    const id = event.currentTarget.dataset.id;
    if (!this.data.featuredCards.some(card => card.id === id)) return;
    wx.navigateTo({ url: `/pages/detail/index?id=${encodeURIComponent(id)}` });
  },

  openCard(event) {
    const id = event.detail.id;
    wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
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

  onShareAppMessage() {
    return { title: "观澜 AI 融资情报", path: "/pages/terminal/index" };
  },

  onShareTimeline() {
    return { title: "观澜 AI 融资情报" };
  },
});
