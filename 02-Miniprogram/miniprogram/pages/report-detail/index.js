const { recordBehavior } = require("../../utils/member.js");
const { getReportData, refreshReportData } = require("../../utils/live-data.js");
const { getAccessState, openMembership } = require("../../utils/access.js");

Page({
  data: { report: null, sharedEntry: false, registrationOpen: false },
  onLoad(options) {
    this.reportId = options.id;
    const accessState = getAccessState();
    if (accessState === "unregistered") this.setData({ registrationOpen: true });
    if (accessState === "expired") setTimeout(() => openMembership(), 0);
    this.setData({ sharedEntry: options.from === "share" || getCurrentPages().length <= 1 });
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    const bundled = getReportData().details[this.reportId];
    if (bundled) this.render(bundled);
    refreshReportData().then((state) => {
      const report = state.details[this.reportId];
      if (report) this.render(report);
      else if (!this.data.report) {
        wx.showToast({ title: "报告不存在", icon: "none" });
        setTimeout(() => wx.navigateBack(), 500);
      }
    });
  },
  render(report) {
    if (!this.browseRecorded && getAccessState() === "active") {
      recordBehavior("browse", `report:${report.id}`);
      this.browseRecorded = true;
    }
    this.setData({ report });
  },
  closeRegistration() {
    this.setData({ registrationOpen: false });
    wx.switchTab({ url: "/pages/watchlist/index" });
  },
  continueAfterRegistration() {
    this.setData({ registrationOpen: false });
    if (!this.browseRecorded && this.data.report) {
      recordBehavior("browse", `report:${this.data.report.id}`);
      this.browseRecorded = true;
    }
  },
  onShareAppMessage() {
    const report = this.data.report;
    return { title: report?.title || "观澜 AI 商业观察", path: `/pages/report-detail/index?id=${report?.id || ""}&from=share` };
  },
  onShareTimeline() {
    const report = this.data.report;
    return { title: report?.title || "观澜 AI 商业观察", query: `id=${report?.id || ""}&from=share` };
  },
  switchSection(event) {
    wx.switchTab({ url: event.currentTarget.dataset.url });
  },
});
