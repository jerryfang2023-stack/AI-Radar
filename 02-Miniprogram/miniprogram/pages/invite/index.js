Page({
  data: { isInvitee: false },

  onLoad(options) {
    this.setData({ isInvitee: options.from === "member_invite" });
  },

  openExperience() {
    wx.switchTab({ url: "/pages/terminal/index" });
  },

  onShareAppMessage() {
    return {
      title: "一起看懂 AI 商业变化，新用户可体验 7 天完整权益",
      path: "/pages/invite/index?from=member_invite",
    };
  },
});
