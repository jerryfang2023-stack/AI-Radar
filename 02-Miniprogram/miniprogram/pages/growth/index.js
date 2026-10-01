const { redeemOnPage } = require("../../utils/benefit-redemption.js");
const { getGrowthSnapshot, recordBehavior, syncBehaviorQueue, syncMembership, syncWallet } = require("../../utils/member.js");
const { fetchMembership } = require("../../utils/payment.js");

Page({
  data: { growth: { wallet: { balance: 0, ledger: [] }, level: {}, tasks: [], benefits: [] } },
  openInvite() { wx.navigateTo({ url: "/pages/invite/index" }); },
  onShow() {
    this.setData({ growth: getGrowthSnapshot() });
    this.refreshRemote();
  },
  async refreshRemote() {
    try {
      await syncBehaviorQueue();
      const result = await fetchMembership();
      if (result.membership) syncMembership(result.membership);
      if (result.wallet) syncWallet(result.wallet);
      this.setData({ growth: getGrowthSnapshot() });
    } catch (_) {}
  },
  openTask(event) {
    const id = event.currentTarget.dataset.id;
    if (id === "checkin") {
      const result = recordBehavior("checkin", "daily");
      this.setData({ growth: getGrowthSnapshot() });
      wx.showToast({ title: result.awarded ? "签到成功，+5 分" : "今日已签到", icon: "none" });
    } else if (id === "favorite") wx.navigateTo({ url: "/pages/saved/index" });
    else wx.switchTab({ url: "/pages/terminal/index" });
  },
  redeem(event) { return redeemOnPage(this, event); },
});
