const fundingIndex = require("../../data/funding-index.js");
const { filterCards, sortCards, activeFilterCount, exportSummary } = require("../../utils/funding.js");
const { getWatchIds, toggleWatch } = require("../../utils/storage.js");

const DEFAULT_FILTERS = {
  keyword: "",
  period: "all",
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
    meta: fundingIndex.meta,
    categories: fundingIndex.categories,
    watchCount: 0,
    selectedIds: [],
    sort: "latest",
    dense: false,
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
    periods: [
      { id: "all", name: "全部时间" },
      { id: "30d", name: "近30天" },
      { id: "90d", name: "近90天" },
      { id: "1y", name: "近1年" }
    ],
    evidenceOptions: [
      { id: "all", name: "全部证据" },
      { id: "multi", name: "多源已核验" },
      { id: "official", name: "官方单源" },
      { id: "single", name: "单源披露" }
    ]
  },

  onLoad() {
    this.allCards = fundingIndex.cards;
    this.filteredCards = [];
    this.pageSize = 36;
    this.refreshCards(true);
  },

  onShow() {
    const pending = wx.getStorageSync("guanlan_pending_filter_v1");
    if (pending?.categoryId) {
      wx.removeStorageSync("guanlan_pending_filter_v1");
      this.setData({ "filters.categoryId": pending.categoryId }, () => this.refreshCards(true));
    } else {
      this.refreshWatchState();
    }
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
    const filtered = filterCards(this.allCards, this.data.filters, fundingIndex.meta.latestDate);
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

  quickPeriod() {
    const next = this.data.filters.period === "30d" ? "all" : "30d";
    this.setData({ "filters.period": next }, () => this.refreshCards(true));
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

  toggleDensity() { this.setData({ dense: !this.data.dense }); },

  openCard(event) {
    wx.navigateTo({ url: `/pages/detail/index?id=${event.detail.id}` });
  },

  toggleWatch(event) {
    toggleWatch(event.detail.id);
    this.renderSlice(this.data.visibleCount);
  },

  toggleSelect(event) {
    const id = event.detail.id;
    const selected = [...this.data.selectedIds];
    const index = selected.indexOf(id);
    if (index >= 0) selected.splice(index, 1);
    else if (selected.length >= 3) {
      wx.showToast({ title: "最多比较3家公司", icon: "none" });
      return;
    } else selected.push(id);
    this.setData({ selectedIds: selected }, () => this.renderSlice(this.data.visibleCount));
  },

  openCompare() {
    if (this.data.selectedIds.length < 2) {
      wx.showToast({ title: "请至少选择2家公司", icon: "none" });
      return;
    }
    wx.navigateTo({ url: `/pages/compare/index?ids=${encodeURIComponent(this.data.selectedIds.join(","))}` });
  },

  exportSelected() {
    const selectedSet = new Set(this.data.selectedIds);
    const cards = this.allCards.filter((card) => selectedSet.has(card.id));
    if (!cards.length) {
      wx.showToast({ title: "请先选择公司", icon: "none" });
      return;
    }
    wx.setClipboardData({
      data: exportSummary(cards),
      success: () => wx.showToast({ title: "摘要已复制", icon: "success" }),
    });
  },

  openWatchlist() { wx.switchTab({ url: "/pages/watchlist/index" }); },
});
