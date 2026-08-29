const { leaderboard, pointRules } = require("../../utils/community-data.js");
const { getCommunity, getWallet } = require("../../utils/member.js");

Page({
  data: { mode: "list", leaderboard, pointRules, myPoints: 80, myRank: 4, ledger: [
    { date: "08.27", title: "造浪者计划 · 关键提问", points: "+10" },
    { date: "08.25", title: "分享实录 · 有效互动", points: "+6" },
    { date: "08.24", title: "社群讨论 · 单次回应", points: "+3" },
  ] },
  onLoad(options) {
    const community = getCommunity(); const wallet = getWallet();
    this.setData({ mode: options.mode || "list", myPoints: Number(community.points || wallet.balance || 80) });
  },
  openRules() { wx.navigateTo({ url: "/pages/community-points/index?mode=rules" }); },
  openDetail() { wx.navigateTo({ url: "/pages/community-points/index?mode=detail" }); },
});
