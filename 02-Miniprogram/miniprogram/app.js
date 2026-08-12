App({
  onLaunch() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.globalData.statusBarHeight = windowInfo.statusBarHeight || 20;
    const { refreshFundingData, refreshReportData } = require("./utils/live-data.js");
    refreshFundingData();
    refreshReportData();
  },
  globalData: {
    statusBarHeight: 20,
  },
});
