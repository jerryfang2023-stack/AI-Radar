const { getReportData, refreshReportData } = require("../../utils/live-data.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
const { getAccessState, openMembership } = require("../../utils/access.js");

const bundledReportIndex = getReportData().index;

Page({
  data: {
    meta: bundledReportIndex.meta,
    activeType: "weekly",
    activeLabel: "周报",
    featured: null,
    reports: [],
    registrationOpen: false,
  },

  onLoad() {
    this.refresh("weekly");
    refreshReportData().then(() => this.refresh(this.data.activeType));
  },

  onShow() { syncTabBar(this, 2); },

  refresh(type) {
    const reportIndex = getReportData().index;
    const reports = reportIndex.reports.filter((item) => item.type === type);
    this.setData({
      meta: reportIndex.meta,
      activeType: type,
      activeLabel: type === "weekly" ? "周报" : "月报",
      featured: reports[0] || null,
      reports: reports.slice(1),
    });
  },

  switchType(event) { this.refresh(event.currentTarget.dataset.type); },
  openReport(event) {
    const id = event.currentTarget.dataset.id;
    const accessState = getAccessState();
    if (accessState === "unregistered") {
      this.pendingReportId = id;
      this.setData({ registrationOpen: true });
      return;
    }
    if (accessState === "expired") return openMembership();
    wx.navigateTo({ url: `/pages/report-detail/index?id=${id}` });
  },
  closeRegistration() {
    this.pendingReportId = "";
    this.setData({ registrationOpen: false });
  },
  continueAfterRegistration() {
    const id = this.pendingReportId;
    this.pendingReportId = "";
    this.setData({ registrationOpen: false });
    if (id) wx.navigateTo({ url: `/pages/report-detail/index?id=${id}` });
  },
  openSaved() { wx.navigateTo({ url: "/pages/saved/index" }); },
});
