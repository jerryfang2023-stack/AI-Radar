const { archives, bounties, getMember } = require("../../utils/community-data.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
const { isExperience, readExperience, saveExperience } = require("../../utils/experience.js");

Page({
  data: {
    featuredArchive: { ...archives[0], dateShort: archives[0].date.slice(5) },
    olderArchives: archives.slice(1, 3).map((item) => ({ ...item, dateShort: item.date.slice(5) })),
    bounty: bounties[0],
    experience: false, experienceStatus: "",
    featuredMembers: ["aihui", "zengjingsi", "guowei", "zizhe"].map((id) => {
      const member = getMember(id);
      return { ...member, roleShort: member.role.split("/")[0].trim() };
    }),
  },
  onLoad() {
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
  },
  onShow() {
    const preview = readExperience();
    this.setData({ experience: isExperience(), experienceStatus: preview ? ({ joined: "已加入", none: "未申请", pending: "审核中" })[preview.status] : "" });
    syncTabBar(this, 2);
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
