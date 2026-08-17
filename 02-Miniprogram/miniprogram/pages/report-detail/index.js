const { recordBehavior } = require("../../utils/member.js");
const { getReportData, refreshReportData } = require("../../utils/live-data.js");
const { getCommunityEssays } = require("../../utils/community-essays.js");
const { getAccessState } = require("../../utils/access.js");
const { resolveDetailAccess, requestLockedContent } = require("../../utils/metered-access.js");

Page({
  data: { report: null, sharedEntry: false, registrationOpen: false, contentLocked: false, lockReason: "" },
  onLoad(options) {
    this.reportId = options.id;
    this.setData(resolveDetailAccess(`report:${this.reportId || "unknown"}`));
    this.isCommunityEssay = Boolean(getCommunityEssays().details[this.reportId]);
    const sharedEntry = options.from === "share";
    this.setData({ sharedEntry });
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    const bundled = getCommunityEssays().details[this.reportId] || getReportData().details[this.reportId];
    if (bundled) this.render(bundled);
    refreshReportData().then((state) => {
      const report = getCommunityEssays().details[this.reportId] || state.details[this.reportId];
      if (report) this.render(report);
      else if (!this.data.report) {
        wx.showToast({ title: "报告不存在", icon: "none" });
        setTimeout(() => wx.navigateBack(), 500);
      }
    });
  },
  render(report) {
    if (!this.browseRecorded && (this.isCommunityEssay || getAccessState() === "active")) {
      recordBehavior("browse", `report:${report.id}`);
      this.browseRecorded = true;
    }
    this.setData({ report });
  },
  unlockContent() { requestLockedContent(this); },
  closeRegistration() { this.pendingAction = ""; this.setData({ registrationOpen: false }); },
  continueAfterRegistration() {
    const unlock = this.pendingAction === "content";
    this.pendingAction = "";
    this.setData({ registrationOpen: false, contentLocked: unlock ? false : this.data.contentLocked, lockReason: unlock ? "active" : this.data.lockReason });
    if (unlock && this.data.report && !this.browseRecorded) {
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
    const url = event.currentTarget.dataset.url;
    wx.switchTab({ url });
  },
});
