const { getGrowthSnapshot, syncMembership, syncWallet } = require("../../utils/member.js");
const { fetchMembership, redeemPoints } = require("../../utils/payment.js");

Page({
  data: { growth: { wallet: { balance: 0, ledger: [] }, level: {}, tasks: [], benefits: [] } },
  onShow() {
    this.setData({ growth: getGrowthSnapshot() });
    this.refreshRemote();
  },
  async refreshRemote() {
    try {
      const result = await fetchMembership();
      if (result.membership) syncMembership(result.membership);
      if (result.wallet) syncWallet(result.wallet);
      this.setData({ growth: getGrowthSnapshot() });
    } catch (_) {}
  },
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
      success: async (result) => {
        if (!result.confirm) return;
        wx.showLoading({ title: "正在兑换", mask: true });
        try {
          const redemption = await redeemPoints(id);
          syncWallet(redemption.wallet);
          syncMembership(redemption.membership);
          wx.hideLoading();
          wx.showToast({ title: `兑换成功，已增加 ${benefit.days} 天`, icon: "success" });
          this.setData({ growth: getGrowthSnapshot() });
        } catch (error) {
          wx.hideLoading();
          wx.showToast({ title: error.message || "兑换失败，请重试", icon: "none" });
        }
      },
    });
  },
});
