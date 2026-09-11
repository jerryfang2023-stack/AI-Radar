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
  const status = (readExperience() || getCommunity()).status;
  const pending = status === "pending" || status === "claim_pending";
  const awaitingJoin = status === "not_joined";
  const claimPending = status === "claim_pending";
  wx.showModal({
    title: awaitingJoin ? "等待登记入群" : claimPending ? "资料认领审核中" : pending ? "申请审核中" : "加入观澜社群",
    content: awaitingJoin ? "申请已通过，请联系管理员登记入群日期；登记后即可查看社群内容。个人资料保存不会改变入群状态。" : claimPending ? "管理员确认你的社群身份后，资料、积分与权限会自动同步，无需再次申请。" : pending ? "你的申请正在审核，通过后即可查看社群完整内容。" : "加入社群后，可查看完整分享实录、参与悬赏令、查看积分榜与成员档案。",
    confirmText: awaitingJoin ? "知道了" : pending ? "查看申请" : "申请加入",
    cancelText: "暂不申请",
    success(result) {
      if (result.confirm && !awaitingJoin) wx.navigateTo({ url: "/pages/community-apply/index" });
    },
  });
  return false;
}

module.exports = { isCommunityMember, requireCommunityMember };
