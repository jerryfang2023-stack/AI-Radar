const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { buildSector } = require("../../utils/ecosystem-insights.js");
const { getFollowIds, toggleFollow } = require("../../utils/member.js");
const { getAccessState, openMembership } = require("../../utils/access.js");

Page({
  data: { sector: "", marketRegion: "global", snapshot: null, following: false, registrationOpen: false },
  onLoad(options) {
    try { this.sector = decodeURIComponent(options.sector || ""); } catch { this.sector = options.sector || ""; }
    this.marketRegion = options.market === "china" ? "china" : "global";
    this.followId = `sector:${this.marketRegion}:${this.sector}`;
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    this.applyData(getFundingData());
    refreshFundingData().then((state) => this.applyData(state));
  },
  onShow() { this.setData({ following: getFollowIds().includes(this.followId) }); },
  applyData(state) {
    const snapshot = buildSector(state.index, state.details, this.sector, this.marketRegion);
    this.setData({ sector: this.sector, marketRegion: this.marketRegion, snapshot, following: getFollowIds().includes(this.followId) });
  },
  openFunding(event) {
    const id = event.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },
  toggleFollow() {
    const accessState = getAccessState();
    if (accessState === "expired") return openMembership();
    if (accessState === "unregistered") { this.pendingFollow = true; this.setData({ registrationOpen: true }); return; }
    this.applyFollow();
  },
  applyFollow() {
    const result = toggleFollow(this.followId);
    this.setData({ following: result.following });
    wx.showToast({ title: result.awarded ? `关注成功，获得 ${result.awarded} 积分` : (result.following ? "已关注" : "已取消关注"), icon: "none" });
  },
  closeRegistration() { this.pendingFollow = false; this.setData({ registrationOpen: false }); },
  continueAfterRegistration() {
    const shouldFollow = this.pendingFollow;
    this.pendingFollow = false;
    this.setData({ registrationOpen: false });
    if (shouldFollow) this.applyFollow();
  },
  onShareAppMessage() { return { title: `${this.sector}｜生态赛道｜观澜 AI`, path: `/pages/sector-detail/index?sector=${encodeURIComponent(this.sector)}&market=${this.marketRegion}` }; },
  onShareTimeline() { return { title: `${this.sector}｜生态赛道｜观澜 AI`, query: `sector=${encodeURIComponent(this.sector)}&market=${this.marketRegion}` }; },
});
