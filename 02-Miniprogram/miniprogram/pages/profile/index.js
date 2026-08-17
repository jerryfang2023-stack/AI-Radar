const { getWatchIds } = require("../../utils/storage.js");
const {
  getProfile,
  getProfileCompletion,
  getHistory,
  getFollowIds,
  getGrowthSnapshot,
  getCommunity,
  recordBehavior,
  syncBehaviorQueue,
  syncCommunity,
  syncWallet,
  syncMembership,
} = require("../../utils/member.js");
const { fetchMembership, linkCommunityPhone } = require("../../utils/payment.js");
const { syncTabBar } = require("../../utils/tab-bar.js");

Page({
  data: {
    profile: {},
    profileCompletion: 0,
    stats: { browse: 0, favorite: 0, follow: 0 },
    growth: { wallet: { balance: 0 }, level: { level: 1, name: "初识者", progress: 0 }, tasks: [], benefits: [], weeklyCompleted: 0 },
    community: { status: "none", statusLabel: "未入群", points: 0 },
    linkingCommunity: false,
  },

  onShow() {
    syncTabBar(this, 3);
    const profile = getProfile();
    this.setData({
      profile,
      profileCompletion: getProfileCompletion(profile),
      stats: {
        browse: getHistory().length,
        favorite: getWatchIds().length,
        follow: getFollowIds().length,
      },
      growth: getGrowthSnapshot(),
      community: getCommunity(),
    });
    this.refreshAccount();
  },

  openSettings() { wx.navigateTo({ url: "/pages/profile-edit/index" }); },
  openHistory() { wx.navigateTo({ url: "/pages/history/index" }); },
  openWatchlist() { wx.navigateTo({ url: "/pages/saved/index" }); },
  openFollows() { wx.navigateTo({ url: "/pages/follows/index" }); },
  openGrowth() { wx.navigateTo({ url: "/pages/growth/index" }); },
  openMembership() { wx.navigateTo({ url: "/pages/membership/index" }); },
  openInvite() { wx.navigateTo({ url: "/pages/invite/index" }); },
  openCommunity() {
    if (this.data.community.status === "joined") wx.navigateTo({ url: "/pages/growth/index" });
    else wx.navigateTo({ url: "/pages/community-apply/index" });
  },
  async refreshAccount() {
    try {
      await syncBehaviorQueue();
      const result = await fetchMembership();
      if (result.membership) syncMembership(result.membership);
      if (result.wallet) syncWallet(result.wallet);
      if (result.community) syncCommunity(result.community);
      this.setData({ growth: getGrowthSnapshot(), community: getCommunity() });
    } catch (_) {
      // Keep the last confirmed snapshot when the account service is unavailable.
    }
  },
  async linkCommunity(event) {
    if (this.data.linkingCommunity || !event.detail.code) return;
    this.setData({ linkingCommunity: true });
    wx.showLoading({ title: "正在核验", mask: true });
    try {
      const result = await linkCommunityPhone(event.detail.code);
      if (result.wallet) syncWallet(result.wallet);
      if (result.membership) syncMembership(result.membership);
      const community = syncCommunity(result.community);
      this.setData({ growth: getGrowthSnapshot(), community });
      wx.hideLoading();
      if (community.status === "joined") wx.showToast({ title: "已同步社群积分", icon: "success" });
      else wx.navigateTo({ url: "/pages/community-apply/index" });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: error.message || "核验失败，请重试", icon: "none" });
    } finally {
      this.setData({ linkingCommunity: false });
    }
  },
  openTask(event) {
    const id = event.currentTarget.dataset.id;
    if (id === "checkin") {
      const result = recordBehavior("checkin", "daily");
      this.setData({ growth: getGrowthSnapshot() });
      wx.showToast({ title: result.awarded ? "签到成功，+5 分" : "今日已签到", icon: "none" });
    } else if (id === "favorite") wx.navigateTo({ url: "/pages/saved/index" });
    else wx.switchTab({ url: "/pages/terminal/index" });
  },

});
