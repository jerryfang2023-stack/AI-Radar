const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { buildEntityLibrary, findEntity } = require("../../utils/entity-library.js");
const { getAccessState, openMembership } = require("../../utils/access.js");

const TITLES = { companies: "企业档案", investors: "机构档案", people: "人物档案" };

Page({
  data: { title: "主体档案", type: "", entity: null, sharedEntry: false, registrationOpen: false },

  onLoad(options) {
    this.type = options.type;
    const sharedEntry = options.from === "share";
    this.setData({ sharedEntry });
    if (!sharedEntry) {
      const accessState = getAccessState();
      if (accessState === "unregistered") {
        this.entryGate = true;
        this.setData({ registrationOpen: true });
      }
      if (accessState === "expired") setTimeout(() => openMembership(), 0);
    }
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
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
    if (id) this.openProtectedUrl(`/pages/detail/index?id=${id}`);
  },

  openEntity(event) {
    const { key, type } = event.currentTarget.dataset;
    if (key && type) this.openProtectedUrl(`/pages/entity-detail/index?type=${type}&key=${encodeURIComponent(key)}`);
  },

  copyWebsite() {
    if (!this.data.entity?.website) return;
    wx.setClipboardData({ data: this.data.entity.website });
  },

  closeRegistration() {
    this.pendingUrl = "";
    this.setData({ registrationOpen: false });
    if (!this.entryGate) return;
    this.entryGate = false;
    if (getCurrentPages().length > 1) wx.navigateBack();
    else wx.switchTab({ url: "/pages/market/index" });
  },

  continueAfterRegistration() {
    const url = this.pendingUrl;
    this.entryGate = false;
    this.pendingUrl = "";
    this.setData({ registrationOpen: false });
    if (url) wx.navigateTo({ url });
  },

  openProtectedUrl(url) {
    const accessState = getAccessState();
    if (accessState === "active") {
      wx.navigateTo({ url });
      return;
    }
    if (accessState === "expired") {
      openMembership();
      return;
    }
    this.pendingUrl = url;
    this.setData({ registrationOpen: true });
  },

  onShareAppMessage() {
    const entity = this.data.entity;
    const key = encodeURIComponent(this.key || "");
    return {
      title: entity ? `${entity.name}｜${this.data.title}｜观澜 AI` : "观澜 AI 生态图谱",
      path: `/pages/entity-detail/index?type=${this.type || "companies"}&key=${key}&from=share`,
    };
  },

  onShareTimeline() {
    const entity = this.data.entity;
    const key = encodeURIComponent(this.key || "");
    return {
      title: entity ? `${entity.name}｜${this.data.title}｜观澜 AI` : "观澜 AI 生态图谱",
      query: `type=${this.type || "companies"}&key=${key}&from=share`,
    };
  },
});
