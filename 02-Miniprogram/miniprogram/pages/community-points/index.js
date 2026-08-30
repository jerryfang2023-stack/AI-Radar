const { leaderboard, pointRules } = require("../../utils/community-data.js");
const { getCommunity } = require("../../utils/member.js");
const { readExperience } = require("../../utils/experience.js");
const { requireCommunityMember } = require("../../utils/community-access.js");

Page({
  data: { mode: "list", leaderboard: [], pointRules, myPoints: 0, myRank: "—", myName: "", experience: false, latestPoints: "—", ledger: [] },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    const preview = readExperience();
    const community = preview ? { name: preview.profile.name || "体验用户", points: 80 } : getCommunity();
    const list = preview ? leaderboard.map((entry) => entry.memberId === "me" ? { ...entry, name: community.name, avatar: community.name.slice(0, 1), isMe: true } : entry) : [];
    const mine = list.find((entry) => entry.isMe);
    this.setData({
      mode: options.mode || "list", experience: Boolean(preview), leaderboard: list,
      myName: community.name || "我的积分", myPoints: Number(community.points) || 0, myRank: mine ? mine.rank : "—",
      latestPoints: preview ? "+10" : "—",
      ledger: preview ? [{ date: "08.27", title: "关键提问 · 体验记录", points: "+10" }, { date: "08.25", title: "有效互动 · 体验记录", points: "+6" }] : [],
    });
  },
  openRules() { wx.navigateTo({ url: "/pages/community-points/index?mode=rules" }); },
  openDetail() { wx.navigateTo({ url: "/pages/community-points/index?mode=detail" }); },
});
