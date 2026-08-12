Page({
  data: { statusBarHeight: 20 },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 20 });
  },

  onReady() {
    this.launchTimer = setTimeout(() => this.enter(), 1500);
  },

  onHide() {
    clearTimeout(this.launchTimer);
  },

  onUnload() {
    clearTimeout(this.launchTimer);
  },

  enter() {
    if (this.entering) return;
    this.entering = true;
    clearTimeout(this.launchTimer);
    wx.switchTab({ url: "/pages/terminal/index" });
  },
});
