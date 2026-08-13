const { getWatchIds } = require("../../utils/storage.js");
const {
  getProfile,
  getProfileCompletion,
  getHistory,
  getFollowIds,
  getGrowthSnapshot,
} = require("../../utils/member.js");
const { syncTabBar } = require("../../utils/tab-bar.js");

Page({
  data: {
    profile: {},
    profileCompletion: 0,
    stats: { browse: 0, favorite: 0, follow: 0 },
    growth: { wallet: { balance: 0 }, level: { level: 1, name: "初识者", progress: 0 }, tasks: [], benefits: [], weeklyCompleted: 0 },
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
    });
  },

  openSettings() { wx.navigateTo({ url: "/pages/profile-edit/index" }); },
  openHistory() { wx.navigateTo({ url: "/pages/history/index" }); },
  openWatchlist() { wx.navigateTo({ url: "/pages/saved/index" }); },
  openGrowth() { wx.navigateTo({ url: "/pages/growth/index" }); },
  openMembership() { wx.navigateTo({ url: "/pages/membership/index" }); },
  openInvite() { wx.navigateTo({ url: "/pages/invite/index" }); },
  openTask(event) {
    const id = event.currentTarget.dataset.id;
    if (id === "favorite") wx.navigateTo({ url: "/pages/saved/index" });
    else wx.switchTab({ url: "/pages/terminal/index" });
  },

});
