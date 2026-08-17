const { hasAuthToken } = require("./payment.js");
const { getMembership } = require("./member.js");

function getAccessState() {
  if (!hasAuthToken()) return "unregistered";
  return getMembership().active ? "active" : "expired";
}

module.exports = { getAccessState };
