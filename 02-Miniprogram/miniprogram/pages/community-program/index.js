const { schedules, archives, getArchive } = require("../../utils/community-data.js");
const { isExperience } = require("../../utils/experience.js");
const sharingPreview = require("../../utils/sharing-preview.js");
const { requireCommunityMember } = require("../../utils/community-access.js");

Page({
  data: { mode: "list", activeTab: "schedule", schedules, archives, item: null, speaker: null, error: "" },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    if (options.type === "speaker") {
      const item = getArchive(options.id);
      const speaker = isExperience() ? sharingPreview[options.id]?.speakers?.[Number(options.speaker)] : null;
      this.setData({ mode: "speaker", item, speaker, error: speaker ? "" : "完整实录暂未加载，请稍后重试。" });
      return;
    }
    if (options.type === "archive") this.setData({ mode: "archive", item: getArchive(options.id) });
    else if (options.type === "schedule") this.setData({ mode: "schedule", item: schedules.find((value) => value.id === options.id) || schedules[0] });
    else this.setData({ activeTab: options.tab === "archive" ? "archive" : "schedule" });
  },
  switchTab(event) { this.setData({ activeTab: event.currentTarget.dataset.tab }); },
  openSchedule(event) { wx.navigateTo({ url: `/pages/community-program/index?type=schedule&id=${event.currentTarget.dataset.id}` }); },
  openArchive(event) { wx.navigateTo({ url: `/pages/community-program/index?type=archive&id=${event.currentTarget.dataset.id}` }); },
  openSpeaker(event) { wx.navigateTo({ url: `/pages/community-program/index?type=speaker&id=${this.data.item.id}&speaker=${event.currentTarget.dataset.index}` }); },
  back() { wx.navigateBack({ fail: () => wx.switchTab({ url: "/pages/community/index" }) }); },
});
