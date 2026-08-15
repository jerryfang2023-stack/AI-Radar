const { MEMBER_RIGHTS, PRICING_PLANS, getMembership, getWallet, syncMembership } = require("../../utils/member.js");
const { fetchMembership, purchaseMembership } = require("../../utils/payment.js");

const CUSTOMER_SERVICE_QR = "/assets/support/customer-service-wechat.jpg";

Page({
  data: {
    rights: MEMBER_RIGHTS,
    plans: PRICING_PLANS,
    membership: {},
    points: 0,
    selectedPlanId: "monthly",
    purchasing: false,
    registrationOpen: false,
  },
  onShow() {
    this.setData({ membership: getMembership(), points: getWallet().balance });
    this.refreshRemoteMembership();
  },
  openGrowth() { wx.navigateTo({ url: "/pages/growth/index" }); },
  openCustomerService() {
    wx.previewImage({ current: CUSTOMER_SERVICE_QR, urls: [CUSTOMER_SERVICE_QR] });
  },
  selectPlan(event) {
    if (this.data.purchasing) return;
    this.setData({ selectedPlanId: event.currentTarget.dataset.id });
  },
  async refreshRemoteMembership() {
    try {
      const result = await fetchMembership();
      if (result.membership) this.setData({ membership: syncMembership(result.membership) });
    } catch (_) {
      // Keep the last confirmed local snapshot when the account service is unavailable.
    }
  },
  subscribe() {
    if (this.data.membership.status === "unregistered") {
      this.setData({ registrationOpen: true });
      return;
    }
    const plan = PRICING_PLANS.find((item) => item.id === this.data.selectedPlanId) || PRICING_PLANS[0];
    wx.showModal({
      title: `开通${plan.title}`,
      content: `确认支付 ${plan.price} 元，开通 ${plan.days} 天全部栏目浏览权益？`,
      confirmText: "确认购买",
      confirmColor: "#0D355C",
      success: (result) => { if (result.confirm) this.startPurchase(plan); },
    });
  },
  async startPurchase(plan) {
    if (this.data.purchasing) return;
    this.setData({ purchasing: true });
    wx.showLoading({ title: "正在创建订单", mask: true });
    try {
      const result = await purchaseMembership(plan.id);
      const membership = syncMembership(result.membership);
      this.setData({ membership });
      wx.hideLoading();
      wx.showModal({
        title: "会员已开通",
        content: `${plan.title}开通成功，会员权益有效至 ${membership.activeUntil}。`,
        showCancel: false,
        confirmText: "完成",
        confirmColor: "#0D355C",
      });
    } catch (error) {
      wx.hideLoading();
      if (error.code !== "PAYMENT_CANCELLED") {
        wx.showModal({
          title: error.code === "PAYMENT_CONFIRMING" ? "支付结果确认中" : "未能完成支付",
          content: error.message || "请稍后重试",
          showCancel: false,
          confirmText: "我知道了",
          confirmColor: "#0D355C",
        });
      }
    } finally {
      this.setData({ purchasing: false });
    }
  },
  closeRegistration() { this.setData({ registrationOpen: false }); },
  registrationCompleted(event) {
    this.setData({ membership: event.detail.membership });
  },
  continueAfterRegistration(event) {
    this.setData({ registrationOpen: false, membership: event.detail.membership });
  },
});
