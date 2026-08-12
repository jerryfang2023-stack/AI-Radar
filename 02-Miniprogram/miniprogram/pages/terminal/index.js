const { filterCards, sortCards, activeFilterCount } = require("../../utils/funding.js");
const { getWatchIds, toggleWatch, getCompareIds } = require("../../utils/storage.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");

const bundledFundingIndex = getFundingData().index;

const DEFAULT_FILTERS = {
  keyword: "",
  period: "all",
  marketRegion: "all",
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
    categories: bundledFundingIndex.categories,
    watchCount: 0,
    selectedIds: [],
    sort: "latest",
    filterOpen: false,
    activeFilterCount: 0,
    filters: { ...DEFAULT_FILTERS },
    draftFilters: { ...DEFAULT_FILTERS },
    roundGroups: [
      { id: "all", name: "全部轮次" },
      { id: "early", name: "种子/天使" },
      { id: "growth", name: "A/B/C轮" },
      { id: "late", name: "D轮及以后" },
      { id: "other", name: "战略及其他" }
    ],
    regions: [
      { id: "all", name: "全部地区" },
      { id: "china", name: "中国总部" },
      { id: "overseas", name: "海外总部" },
      { id: "undisclosed", name: "未披露" }
    ],
    marketRegions: [
      { id: "all", name: "全球" },
      { id: "china", name: "中国区" },
      { id: "global", name: "全球其他" }
    ],
    periods: [
      { id: "all", name: "全部时间" },
      { id: "30d", name: "近30天" },
      { id: "90d", name: "近90天" },
      { id: "1y", name: "近1年" }
    ]
  },

  onLoad() {
    this.allCards = bundledFundingIndex.cards;
    this.filteredCards = [];
    this.pageSize = 36;
    this.setData({ selectedIds: getCompareIds() });
    this.refreshCards(true);
    refreshFundingData().then((state) => this.applyFundingData(state.index));
  },

  onShow() {
    const currentIndex = getFundingData().index;
    if (currentIndex.meta.generatedAt !== this.data.meta.generatedAt) this.applyFundingData(currentIndex);
    const pending = wx.getStorageSync("guanlan_pending_filter_v1");
    const selectedIds = getCompareIds();
    if (pending?.categoryId) {
      wx.removeStorageSync("guanlan_pending_filter_v1");
      this.setData({ selectedIds, "filters.categoryId": pending.categoryId }, () => this.refreshCards(true));
    } else {
      this.setData({ selectedIds }, () => this.renderSlice(Math.max(this.data.visibleCount, this.pageSize)));
    }
  },

  applyFundingData(index) {
    if (!index?.cards?.length) return;
    this.allCards = index.cards;
    this.setData({ meta: index.meta, categories: index.categories }, () => this.refreshCards(true));
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
    this.setData({
      filteredCount: this.filteredCards.length,
      activeFilterCount: activeFilterCount(this.data.filters),
    });
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

  clearSearch() {
    this.setData({ "filters.keyword": "" }, () => this.refreshCards(true));
  },

  quickCategory(event) {
    this.setData({ "filters.categoryId": event.currentTarget.dataset.value }, () => this.refreshCards(true));
  },

  openFilters() {
    this.setData({ filterOpen: true, draftFilters: { ...this.data.filters } });
  },

  closeFilters() { this.setData({ filterOpen: false }); },

  chooseDraft(event) {
    const { name, value } = event.currentTarget.dataset;
    this.setData({ [`draftFilters.${name}`]: value });
  },

  resetDraft() {
    this.setData({ draftFilters: { ...DEFAULT_FILTERS, keyword: this.data.filters.keyword } });
  },

  applyDraft() {
    this.setData({ filters: { ...this.data.draftFilters }, filterOpen: false }, () => this.refreshCards(true));
  },

  changeSort() {
    const next = this.data.sort === "latest" ? "amount" : this.data.sort === "amount" ? "company" : "latest";
    this.setData({ sort: next }, () => this.refreshCards(true));
  },

  openCard(event) {
    wx.navigateTo({ url: `/pages/detail/index?id=${event.detail.id}` });
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
