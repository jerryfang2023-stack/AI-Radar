const { getCommunity } = require("./member.js");
const { readExperience } = require("./experience.js");

function isCommunityMember() {
  return (readExperience() || getCommunity()).status === "joined";
}

function requireCommunityMember(next) {
  if (isCommunityMember()) {
    if (typeof next === "function") next();
    return true;
  }
  const pending = (readExperience() || getCommunity()).status === "pending";
  wx.showModal({
    title: pending ? "申请审核中" : "加入观澜社群",
    content: pending ? "你的申请正在审核，通过后即可查看社群完整内容。" : "加入社群后，可查看完整分享实录、参与悬赏令、查看积分榜与成员档案。",
    confirmText: pending ? "查看申请" : "申请加入",
    cancelText: "暂不申请",
    success(result) {
      if (result.confirm) wx.navigateTo({ url: "/pages/community-apply/index" });
    },
  });
  return false;
}

module.exports = { isCommunityMember, requireCommunityMember };
