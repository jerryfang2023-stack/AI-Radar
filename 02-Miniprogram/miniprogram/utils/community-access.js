const { getCommunity } = require("./member.js");

function isCommunityMember() {
  return getCommunity().status === "joined";
}

function requireCommunityMember(next) {
  if (isCommunityMember()) {
    if (typeof next === "function") next();
    return true;
  }
  wx.showModal({
    title: "加入观澜社群",
    content: "社群首页开放预览。加入社群后，可查看完整分享实录、参与悬赏令、查看积分榜与成员档案。",
    confirmText: "申请加入",
    cancelText: "暂不申请",
    success(result) {
      if (result.confirm) wx.navigateTo({ url: "/pages/community-apply/index" });
    },
  });
  return false;
}

module.exports = { isCommunityMember, requireCommunityMember };
