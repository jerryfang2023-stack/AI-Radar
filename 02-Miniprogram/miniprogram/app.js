const analytics = require("./utils/analytics.js");
const pageSharing = require("./utils/page-sharing.js");

pageSharing.installPageSharing();
analytics.installPageTracking();

App({
  onLaunch(options) {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.globalData.statusBarHeight = windowInfo.statusBarHeight || 20;
    const { refreshFundingData, refreshReportData } = require("./utils/live-data.js");
    refreshFundingData();
    refreshReportData();
    analytics.sessionId(true);
    analytics.track("app_launch", { scene: options?.scene || 0 });
    analytics.flush();
  },
  onShow(options) {
    analytics.track("app_show", { scene: options?.scene || 0 });
    analytics.flush();
  },
  onHide() {
    analytics.track("app_hide");
    analytics.flush();
  },
  globalData: {
    statusBarHeight: 20,
  },
});
