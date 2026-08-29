const { schedules, archives, getArchive } = require("../../utils/community-data.js");

Page({
  data: { mode: "list", activeTab: "schedule", schedules, archives, item: null },
  onLoad(options) {
    if (options.type === "archive") this.setData({ mode: "archive", item: getArchive(options.id) });
    else if (options.type === "schedule") this.setData({ mode: "schedule", item: schedules.find((value) => value.id === options.id) || schedules[0] });
    else this.setData({ activeTab: options.tab === "archive" ? "archive" : "schedule" });
  },
  switchTab(event) { this.setData({ activeTab: event.currentTarget.dataset.tab }); },
  openSchedule(event) { wx.navigateTo({ url: `/pages/community-program/index?type=schedule&id=${event.currentTarget.dataset.id}` }); },
  openArchive(event) { wx.navigateTo({ url: `/pages/community-program/index?type=archive&id=${event.currentTarget.dataset.id}` }); },
  back() { wx.navigateBack(); },
});
