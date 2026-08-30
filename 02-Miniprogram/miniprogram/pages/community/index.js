const { archives, bounties, getMember } = require("../../utils/community-data.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
const { isExperience, readExperience, saveExperience } = require("../../utils/experience.js");
const { communityRequest, fetchMembership, prefetchCommunity, clearCommunityCache } = require("../../utils/payment.js");
const { syncCommunity, syncWallet, syncMembership } = require("../../utils/member.js");
const { readCommunityPage } = require("../../utils/community-loading.js");

Page({
  data: {
    featuredArchive: null, olderArchives: [], bounty: null, loading: false, error: "", memberCount: 0,
    experience: false, experienceStatus: "",
    featuredMembers: [],
  },
  onLoad() {
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
  },
  onShow() {
    const preview = readExperience();
    this.setData({ experience: isExperience(), experienceStatus: preview ? ({ joined: "已加入", none: "未申请", pending: "审核中" })[preview.status] : "" });
    syncTabBar(this, 2);
    this.refresh();
    if (!preview) fetchMembership().then((result) => {
      if (result.community) {
        syncCommunity(result.community);
        if (result.community.status === "joined") prefetchCommunity();
        else clearCommunityCache();
      }
      if (result.wallet) syncWallet(result.wallet);
      if (result.membership) syncMembership(result.membership);
    }).catch(() => {});
  },
  refresh() {
    return readCommunityPage(this, async () => {
      const apply = (result) => {
        const rows = result.archives.map((item) => ({ ...item, dateShort: item.date.slice(5) }));
        this.setData({ loaded: true, showLoading: false, featuredArchive: rows[0] || null, olderArchives: rows.slice(1, 5), bounty: result.bounty, memberCount: result.memberCount, featuredMembers: result.featuredMembers.map((member) => ({ ...member, roleShort: member.role.split("/")[0].trim() })) });
      };
      apply(readExperience() ? { archives: archives.slice(0, 5), bounty: bounties[0], featuredMembers: ["aihui", "zengjingsi", "guowei", "zizhe"].map(getMember), memberCount: 54 } : await communityRequest("home", { onCached: apply }));
    });
  },
  switchExperience() {
    const preview = readExperience();
    if (!preview) return;
    const statuses = ["joined", "none", "pending"];
    preview.status = statuses[(statuses.indexOf(preview.status) + 1) % statuses.length];
    saveExperience(preview);
    this.onShow();
  },
  openProtected(event) {
    const url = event.currentTarget.dataset.url;
    requireCommunityMember(() => wx.navigateTo({ url }));
  },
  onShareAppMessage() { return { title: "观澜 AI 社群", path: "/pages/community/index" }; },
  onShareTimeline() { return { title: "观澜 AI 社群" }; },
});
