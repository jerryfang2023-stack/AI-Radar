const DAY_MS = 24 * 60 * 60 * 1000;
const TRIAL_DAYS = 7;

function iso(value) {
  return new Date(value).toISOString();
}

function createMembership(now = Date.now()) {
  const startedAt = new Date(now).getTime();
  return {
    trialStartedAt: iso(startedAt),
    trialEndsAt: iso(startedAt + TRIAL_DAYS * DAY_MS),
    memberEndsAt: "",
  };
}

function membershipSnapshot(value = {}, now = Date.now()) {
  const current = new Date(now).getTime();
  const trialEnd = Date.parse(value.trialEndsAt || "") || 0;
  const memberEnd = Date.parse(value.memberEndsAt || "") || 0;
  const registered = Boolean(trialEnd || memberEnd);
  if (!registered) {
    return {
      ...value,
      status: "unregistered",
      active: false,
      registered: false,
      statusLabel: "注册后领取 7 天体验",
      remainingDays: 0,
      activeUntil: "",
    };
  }
  const isMember = memberEnd > current;
  const isTrial = !isMember && trialEnd > current;
  const activeUntil = isMember ? memberEnd : isTrial ? trialEnd : Math.max(memberEnd, trialEnd);
  return {
    ...value,
    status: isMember ? "member" : isTrial ? "trial" : "expired",
    active: isMember || isTrial,
    registered: true,
    statusLabel: isMember ? "观澜会员" : isTrial ? "7 天体验中" : "体验已结束",
    remainingDays: activeUntil > current ? Math.max(1, Math.ceil((activeUntil - current) / DAY_MS)) : 0,
    activeUntil: activeUntil ? iso(activeUntil).slice(0, 10) : "",
  };
}

function extendMembership(value, days, now = Date.now()) {
  const current = new Date(now).getTime();
  const trialEnd = Date.parse(value.trialEndsAt || "") || current;
  const memberEnd = Date.parse(value.memberEndsAt || "") || 0;
  const start = Math.max(current, trialEnd, memberEnd);
  return { ...value, memberEndsAt: iso(start + Math.max(0, Number(days) || 0) * DAY_MS) };
}

module.exports = { DAY_MS, TRIAL_DAYS, createMembership, membershipSnapshot, extendMembership };
