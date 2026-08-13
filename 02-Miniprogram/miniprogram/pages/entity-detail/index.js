const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { buildEntityLibrary, findEntity } = require("../../utils/entity-library.js");

const TITLES = { companies: "企业档案", investors: "机构档案", people: "人物档案" };

Page({
  data: { title: "主体档案", type: "", entity: null },

  onLoad(options) {
    this.type = options.type;
    try { this.key = decodeURIComponent(options.key || ""); } catch { this.key = options.key || ""; }
    this.setData({ title: TITLES[this.type] || "主体档案", type: this.type });
    this.applyData(getFundingData());
    refreshFundingData().then((state) => this.applyData(state));
  },

  applyData(state) {
    const library = buildEntityLibrary(state.index.cards, state.details);
    const entity = findEntity(library, this.type, this.key);
    if (entity) this.setData({ entity });
    else if (!this.data.entity) wx.showToast({ title: "主体档案不存在", icon: "none" });
  },

  openFunding(event) {
    const id = event.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },

  openEntity(event) {
    const { key, type } = event.currentTarget.dataset;
    if (key && type) wx.redirectTo({ url: `/pages/entity-detail/index?type=${type}&key=${encodeURIComponent(key)}` });
  },

  copyWebsite() {
    if (!this.data.entity?.website) return;
    wx.setClipboardData({ data: this.data.entity.website });
  },
});
