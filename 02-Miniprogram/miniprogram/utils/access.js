const { hasAuthToken } = require("./payment.js");
const { getMembership } = require("./member.js");

function getAccessState() {
  if (!hasAuthToken()) return "unregistered";
  return getMembership().active ? "active" : "expired";
}

function openMembership() {
  wx.navigateTo({ url: "/pages/membership/index" });
}

module.exports = { getAccessState, openMembership };
