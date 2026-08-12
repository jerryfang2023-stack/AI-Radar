const details = require("../../data/report-details.js");
const { recordBehavior } = require("../../utils/member.js");

Page({
  data: { report: null },
  onLoad(options) {
    const report = details[options.id];
    if (!report) {
      wx.showToast({ title: "报告不存在", icon: "none" });
      setTimeout(() => wx.navigateBack(), 500);
      return;
    }
    recordBehavior("browse", `report:${report.id}`);
    this.setData({ report });
  },
  onShareAppMessage() {
    const report = this.data.report;
    return { title: report?.title || "观澜 AI 商业观察", path: `/pages/report-detail/index?id=${report?.id || ""}` };
  },
});
