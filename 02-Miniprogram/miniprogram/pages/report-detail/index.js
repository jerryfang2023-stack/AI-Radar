const { recordBehavior } = require("../../utils/member.js");
const { getReportData, refreshReportData } = require("../../utils/live-data.js");

Page({
  data: { report: null },
  onLoad(options) {
    this.reportId = options.id;
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
    if (!this.browseRecorded) {
      recordBehavior("browse", `report:${report.id}`);
      this.browseRecorded = true;
    }
    this.setData({ report });
  },
  onShareAppMessage() {
    const report = this.data.report;
    return { title: report?.title || "观澜 AI 商业观察", path: `/pages/report-detail/index?id=${report?.id || ""}` };
  },
});
