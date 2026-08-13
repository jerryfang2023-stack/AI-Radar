const { getGrowthSnapshot, redeemBenefit } = require("../../utils/member.js");

Page({
  data: { growth: { wallet: { balance: 0, ledger: [] }, level: {}, tasks: [], benefits: [] } },
  onShow() { this.setData({ growth: getGrowthSnapshot() }); },
  redeem(event) {
    const id = event.currentTarget.dataset.id;
    const benefit = this.data.growth.benefits.find((item) => item.id === id);
    if (!benefit || benefit.redeemed || !benefit.affordable) {
      if (benefit && !benefit.affordable) wx.showToast({ title: `还差 ${benefit.cost - this.data.growth.wallet.balance} 分`, icon: "none" });
      return;
    }
    wx.showModal({
      title: `兑换${benefit.title}？`,
      content: `将扣除 ${benefit.cost} 活跃积分，会员有效期顺延 ${benefit.days} 天。确认兑换吗？`,
      confirmColor: "#0D355C",
      success: (result) => {
        if (!result.confirm) return;
        const redemption = redeemBenefit(id);
        wx.showToast({ title: redemption.ok ? `兑换成功，已增加 ${benefit.days} 天` : redemption.reason, icon: "none" });
        this.setData({ growth: getGrowthSnapshot() });
      },
    });
  },
});
