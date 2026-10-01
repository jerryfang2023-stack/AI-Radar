const { getGrowthSnapshot, syncMembership, syncWallet } = require("./member.js");
const { hasAuthToken, redeemPoints } = require("./payment.js");

async function redeemOnPage(page, event) {
  if (page._redemptionPending) return;
  if (!hasAuthToken()) { wx.navigateTo({ url: "/pages/membership/index" }); return; }
  const id = event.currentTarget.dataset.id;
  const growth = getGrowthSnapshot();
  const benefit = growth.benefits.find((item) => item.id === id);
  if (!benefit || benefit.redeemed) return;
  if (!benefit.affordable) { wx.showToast({ title: `还差 ${benefit.cost - growth.wallet.balance} 分`, icon: "none" }); return; }
  page._redemptionPending = true;
  page.setData({ redeeming: id });
  let loading = false;
  try {
    const confirmation = await new Promise((resolve, reject) => wx.showModal({
      title: `兑换${benefit.title}？`,
      content: `将扣除 ${benefit.cost} 活跃积分，阅读权益增加 ${benefit.days} 天。`,
      confirmText: "确认兑换", confirmColor: "#0D355C", success: resolve, fail: reject,
    }));
    if (!confirmation.confirm) return;
    wx.showLoading({ title: "正在兑换", mask: true }); loading = true;
    const result = await redeemPoints(id);
    syncWallet(result.wallet);
    syncMembership(result.membership);
    page.setData({ growth: getGrowthSnapshot() });
    wx.hideLoading(); loading = false;
    wx.showToast({ title: `兑换成功，已增加 ${benefit.days} 天`, icon: "success" });
  } catch (error) {
    if (loading) { wx.hideLoading(); loading = false; }
    if (error.code !== "AUTH_CHANGED") wx.showToast({ title: error.message || "兑换未完成，请重试", icon: "none" });
  } finally {
    if (loading) wx.hideLoading();
    page._redemptionPending = false;
    page.setData({ redeeming: "" });
  }
}
module.exports = { redeemOnPage };
