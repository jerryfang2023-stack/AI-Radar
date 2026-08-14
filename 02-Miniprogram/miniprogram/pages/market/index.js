const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { buildEntityLibrary, filterEntities } = require("../../utils/entity-library.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
const { getAccessState, openMembership } = require("../../utils/access.js");

const MODE_META = {
  companies: { modeLabel: "企业", placeholder: "企业 / 产品 / 赛道", sortNote: "按最近融资排序", emptyCopy: "换一个企业、产品或赛道名称试试。" },
  investors: { modeLabel: "机构", placeholder: "机构 / 已投公司 / 赛道", sortNote: "按投资活跃度排序", emptyCopy: "换一个机构、已投公司或赛道名称试试。" },
  people: { modeLabel: "人物", placeholder: "人物 / 企业 / 职务", sortNote: "按关联企业与最近动态排序", emptyCopy: "换一个人物、企业或职务名称试试。" },
};

Page({
  data: {
    mode: "companies",
    query: "",
    items: [],
    visibleCount: 0,
    resultCount: 0,
    companyCount: 0,
    investorCount: 0,
    peopleCount: 0,
    registrationOpen: false,
    ...MODE_META.companies,
  },

  onLoad() {
    this.pageSize = 24;
    this.applyData(getFundingData());
    refreshFundingData().then((state) => this.applyData(state));
  },

  onShow() {
    syncTabBar(this, 1);
    this.applyData(getFundingData());
  },

  onReachBottom() {
    if (this.data.visibleCount < this.filteredItems.length) this.renderItems(this.data.visibleCount + this.pageSize);
  },

  applyData(state) {
    this.library = buildEntityLibrary(state.index.cards, state.details);
    this.setData({
      companyCount: this.library.companies.length,
      investorCount: this.library.investors.length,
      peopleCount: this.library.people.length,
    }, () => this.refreshItems(true));
  },

  switchMode(event) {
    const mode = event.currentTarget.dataset.mode;
    this.setData({ mode, query: "", ...MODE_META[mode] }, () => this.refreshItems(true));
  },

  onSearchInput(event) { this.setData({ query: event.detail.value }, () => this.refreshItems(true)); },
  clearSearch() { this.setData({ query: "" }, () => this.refreshItems(true)); },

  refreshItems(reset) {
    if (!this.library) return;
    this.filteredItems = filterEntities(this.library[this.data.mode] || [], this.data.query);
    this.setData({ resultCount: this.filteredItems.length });
    this.renderItems(reset ? this.pageSize : Math.max(this.data.visibleCount, this.pageSize));
  },

  renderItems(limit) {
    const items = this.filteredItems.slice(0, limit);
    this.setData({ items, visibleCount: items.length });
  },

  openEntity(event) {
    const { key, type } = event.currentTarget.dataset;
    if (!key || !type) return;
    const accessState = getAccessState();
    if (accessState === "unregistered") {
      this.pendingEntity = { key, type };
      this.setData({ registrationOpen: true });
      return;
    }
    if (accessState === "expired") return openMembership();
    wx.navigateTo({ url: `/pages/entity-detail/index?type=${type}&key=${encodeURIComponent(key)}` });
  },

  closeRegistration() {
    this.pendingEntity = null;
    this.setData({ registrationOpen: false });
  },

  continueAfterRegistration() {
    const entity = this.pendingEntity;
    this.pendingEntity = null;
    this.setData({ registrationOpen: false });
    if (entity) wx.navigateTo({ url: `/pages/entity-detail/index?type=${entity.type}&key=${encodeURIComponent(entity.key)}` });
  },
});
