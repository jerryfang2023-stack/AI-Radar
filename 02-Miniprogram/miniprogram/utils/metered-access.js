const { getAccessState, openMembership } = require("./access.js");

const SAMPLE_DETAIL_KEY = "guanlan_public_sample_detail_v1";

function decideDetailAccess(accessState, sampleKey, detailKey) {
  if (accessState === "active") return { contentLocked: false, lockReason: "active" };
  if (accessState === "expired") return { contentLocked: true, lockReason: "expired" };
  if (!sampleKey || sampleKey === detailKey) return { contentLocked: false, lockReason: "sample" };
  return { contentLocked: true, lockReason: "unregistered" };
}

function resolveDetailAccess(detailKey) {
  const accessState = getAccessState();
  const sampleKey = wx.getStorageSync(SAMPLE_DETAIL_KEY) || "";
  const result = decideDetailAccess(accessState, sampleKey, detailKey);
  if (accessState === "unregistered" && !sampleKey && detailKey) {
    wx.setStorageSync(SAMPLE_DETAIL_KEY, detailKey);
  }
  return result;
}

function requestLockedContent(page) {
  if (page.data.lockReason === "expired") {
    openMembership();
    return;
  }
  page.pendingAction = "content";
  page.setData({ registrationOpen: true });
}

function protectedResourceId(value) {
  let hash = 0x811c9dc5;
  const input = String(value || "");
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `r-${hash.toString(16).padStart(8, "0")}`;
}

module.exports = { SAMPLE_DETAIL_KEY, decideDetailAccess, resolveDetailAccess, requestLockedContent, protectedResourceId };
