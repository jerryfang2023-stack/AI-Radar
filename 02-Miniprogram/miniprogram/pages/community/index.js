const { schedules, archives, bounties, getMember } = require("../../utils/community-data.js");
const { getCommunity, getWallet } = require("../../utils/member.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { syncTabBar } = require("../../utils/tab-bar.js");

Page({
  data: {
    schedules, archives: archives.slice(0, 2).map((item) => ({ ...item, dateShort: item.date.replace("2026.", "") })), bounty: bounties[0],
    featuredMembers: ["aihui", "zengjingsi", "guowei", "zizhe"].map((id) => {
      const member = getMember(id);
      return { ...member, roleShort: member.role.split("/")[0].trim() };
    }),
    community: {}, points: 0,
  },
  onLoad() {
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
  },
  onShow() {
    const community = getCommunity();
    const wallet = getWallet();
    this.setData({ community, points: Number(community.points || wallet.balance || 0) });
    syncTabBar(this, 2);
  },
  openProtected(event) {
    const url = event.currentTarget.dataset.url;
    requireCommunityMember(() => wx.navigateTo({ url }));
  },
  onShareAppMessage() { return { title: "观澜 AI 社群", path: "/pages/community/index" }; },
  onShareTimeline() { return { title: "观澜 AI 社群" }; },
});
