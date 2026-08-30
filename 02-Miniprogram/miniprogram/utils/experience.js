const config = require("./experience-config.js");
const KEY = "guanlan_isolated_experience_v1";

function isExperience() {
  if (!config.enabled) return false;
  try { return wx.getAccountInfoSync().miniProgram.envVersion === "develop"; }
  catch (_) { return false; }
}

function readExperience() {
  if (!isExperience()) return null;
  return wx.getStorageSync(KEY) || { status: "joined", cases: null, drafts: {}, profile: {} };
}

function saveExperience(value) {
  if (!isExperience()) throw new Error("体验数据不可写入正式环境");
  wx.setStorageSync(KEY, value);
}

module.exports = { isExperience, readExperience, saveExperience };
