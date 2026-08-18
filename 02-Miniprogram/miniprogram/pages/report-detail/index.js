const { recordBehavior } = require("../../utils/member.js");
const { getReportData, getCommunityDetail } = require("../../utils/live-data.js");
const { getCommunityEssays } = require("../../utils/community-essays.js");
const { getAccessState } = require("../../utils/access.js");
const { resolveDetailAccess, requestLockedContent } = require("../../utils/metered-access.js");
const { fetchProtectedContent } = require("../../utils/payment.js");

Page({
  data: { report: null, sharedEntry: false, registrationOpen: false, contentLocked: false, lockReason: "" },
  onLoad(options) {
    this.reportId = options.id;
    this.setData(resolveDetailAccess(`report:${this.reportId || "unknown"}`));
    const remotePreview = getReportData().index.reports.find((item) => item.id === this.reportId || item.detailId === this.reportId);
    this.isCommunityEssay = /^community-essay-/.test(String(this.reportId || ""))
      || remotePreview?.contentType === "community-essay"
      || Boolean(getCommunityEssays().details[this.reportId]);
    const sharedEntry = options.from === "share";
    this.setData({ sharedEntry });
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    const preview = remotePreview || getCommunityEssays().details[this.reportId];
    if (preview) this.render(preview);
    this.verifyServerAccess();
  },
  async verifyServerAccess() {
    if (!this.reportId) return;
    if (this.isCommunityEssay) {
      const report = await getCommunityDetail(this.reportId);
      if (report) this.render(report);
      this.setData({ contentLocked: false, lockReason: "public" });
      return;
    }
    try {
      const report = await fetchProtectedContent("report", this.reportId);
      if (report) this.render(report);
      this.setData({ contentLocked: false, lockReason: "server" });
    } catch (error) {
      if (error.statusCode === 401 || error.statusCode === 403 || error.code === "MEMBERSHIP_REQUIRED" || error.code === "AUTH_INVALID") {
        this.setData({ contentLocked: true, lockReason: getAccessState() === "expired" ? "expired" : "unregistered" });
      } else if (!this.data.report) {
        wx.showToast({ title: "报告暂时无法读取", icon: "none" });
      }
    }
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
