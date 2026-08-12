const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { buildEntityLibrary, filterEntities } = require("../../utils/entity-library.js");

Page({
  data: {
    mode: "companies",
    query: "",
    items: [],
    visibleCount: 0,
    resultCount: 0,
    companyCount: 0,
    investorCount: 0,
  },

  onLoad() {
    this.pageSize = 30;
    this.applyData(getFundingData());
    refreshFundingData().then((state) => this.applyData(state));
  },

  onShow() {
    this.applyData(getFundingData());
  },

  onReachBottom() {
    if (this.data.visibleCount < this.filteredItems.length) this.renderItems(this.data.visibleCount + this.pageSize);
  },

  applyData(state) {
    this.library = buildEntityLibrary(state.index.cards, state.details);
    this.setData({ companyCount: this.library.companies.length, investorCount: this.library.investors.length }, () => this.refreshItems(true));
  },

  switchMode(event) {
    this.setData({ mode: event.currentTarget.dataset.mode, query: "" }, () => this.refreshItems(true));
  },

  onSearchInput(event) {
    this.setData({ query: event.detail.value }, () => this.refreshItems(true));
  },

  clearSearch() {
    this.setData({ query: "" }, () => this.refreshItems(true));
  },

  refreshItems(reset) {
    if (!this.library) return;
    const source = this.data.mode === "companies" ? this.library.companies : this.library.investors;
    this.filteredItems = filterEntities(source, this.data.query);
    this.setData({ resultCount: this.filteredItems.length });
    this.renderItems(reset ? this.pageSize : Math.max(this.data.visibleCount, this.pageSize));
  },

  renderItems(limit) {
    const items = this.filteredItems.slice(0, limit);
    this.setData({ items, visibleCount: items.length });
  },

  openEntity(event) {
    const id = event.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },
});
