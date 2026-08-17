const payment = require("../../utils/payment.js");

Page({
  data: {
    ticket: "",
    status: "ready",
    submitting: false,
    title: "登录观澜 AI PC 端",
    description: "确认后，PC 浏览器将登录与你的小程序相同的观澜账户。",
  },
  onLoad(options) {
    const ticket = decodeURIComponent(options.ticket || "");
    if (!ticket) this.setData({ status: "error", title: "二维码已失效", description: "请返回 PC 端重新获取二维码。" });
    else if (!payment.hasAuthToken()) this.setData({ ticket, status: "auth", title: "请先完成小程序注册", description: "注册后重新扫描 PC 端二维码，即可使用同一账户登录。" });
    else this.setData({ ticket });
  },
  async confirm() {
    if (this.data.submitting) return;
    this.setData({ submitting: true });
    try {
      await payment.confirmPcLogin(this.data.ticket);
      this.setData({ status: "success", title: "登录已确认", description: "PC 端将自动完成登录，你可以安全关闭此页面。" });
    } catch (error) {
      this.setData({ status: "error", title: "确认失败", description: error.message || "请返回 PC 端重新获取二维码。" });
    } finally {
      this.setData({ submitting: false });
    }
  },
  openProfile() { wx.switchTab({ url: "/pages/profile/index" }); },
  backHome() { wx.switchTab({ url: "/pages/terminal/index" }); },
});
