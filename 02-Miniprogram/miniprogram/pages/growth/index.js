const { getGrowthSnapshot, redeemBenefit } = require("../../utils/member.js");

Page({
  data: { growth: { wallet: { balance: 0, ledger: [] }, level: {}, tasks: [], benefits: [] } },
  onShow() { this.setData({ growth: getGrowthSnapshot() }); },
  redeem(event) {
    const id = event.currentTarget.dataset.id;
    const benefit = this.data.growth.benefits.find((item) => item.id === id);
    if (!benefit || benefit.redeemed) return;
    wx.showModal({
      title: `兑换${benefit.title}？`,
      content: `将扣除 ${benefit.cost} 本地体验积分。正式版权益需登录并由服务端确认。`,
      confirmColor: "#0D355C",
      success: (result) => {
        if (!result.confirm) return;
        const redemption = redeemBenefit(id);
        wx.showToast({ title: redemption.ok ? "兑换成功" : redemption.reason, icon: "none" });
        this.setData({ growth: getGrowthSnapshot() });
      },
    });
  },
});
