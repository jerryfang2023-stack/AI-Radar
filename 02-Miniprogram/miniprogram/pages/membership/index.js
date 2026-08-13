const { MEMBER_RIGHTS, PRICING_PLANS, getMembership, getWallet } = require("../../utils/member.js");

Page({
  data: {
    rights: MEMBER_RIGHTS,
    plans: PRICING_PLANS,
    membership: {},
    points: 0,
  },
  onShow() {
    this.setData({ membership: getMembership(), points: getWallet().balance });
  },
  openGrowth() { wx.navigateTo({ url: "/pages/growth/index" }); },
  subscribe() {
    wx.showModal({
      title: "会员开通",
      content: "付费开通暂未开放。当前可使用 7 天新用户体验，或通过活跃积分兑换会员权益。",
      showCancel: false,
      confirmText: "我知道了",
      confirmColor: "#0D355C",
    });
  },
});
