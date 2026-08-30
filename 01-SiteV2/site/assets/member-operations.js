(function () {
  const root = document.querySelector("[data-member-operations]");
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const endpoints = {
    community: "https://members.zkdlj.vip/api/v1/operations/membership-summary",
    application: "https://www.zkdlj.vip/api/v1/analytics/membership/summary",
  };
  const definitions = {
    community: [
      ["joinedMembers", "正式入群", "当前审核通过且已登记入群日期"],
      ["newJoinedMembers", "新增入群", "所选期间入群的当前正式成员"],
      ["awaitingJoin", "审核通过待入群", "尚未登记有效入群日期"],
      ["participants", "分享参与成员", "当期活动记录匹配到的正式成员去重"],
      ["speakers", "分享者", "当期嘉宾匹配到的正式成员去重"],
      ["participations", "参与人次", "同一期每位成员只计一次"],
      ["issues", "分享期数", "按期号去重；不含未来排期"],
      ["expiring7d", "即将到期", "社群尚无会员到期字段"],
      ["renewals", "社群续费", "社群尚无续费记录"],
    ],
    application: [
      ["accounts", "应用账户", "小程序 / PC 共用账户；剔除被合并账户"],
      ["activeEntitlements", "有效会员权益", "当前会员期限未到；含付费与积分兑换"],
      ["expiring7d", "7 天内到期", "有效会员权益中，未来 7 天到期账户"],
      ["newAccounts", "新增账户", "所选期间创建；不等于新增付费会员"],
      ["firstPaidAccounts", "首次付费", "首笔未退款的服务端确认订单在当期"],
      ["repeatPaidAccounts", "再次购买", "当期存在第二笔及以后未退款订单；非自动续费"],
      ["engagedAccounts", "有行为记录账户", "当期签到 / 阅读 / 收藏任务记录去重"],
      ["trialAccounts", "试用中", "试用未到期且无有效会员权益"],
      ["redemptions", "积分兑换次数", "当期已入账的积分兑换记录"],
      ["redeemingAccounts", "兑换账户", "当期兑换账户去重"],
      ["redeemedPoints", "已兑换积分", "当期兑换实际扣减积分；非社群积分总额"],
      ["offlineClaims", "线下权益核销", "线下领取、核销记录待接入"],
    ],
  };
  let days = 30, generation = 0, loaded = false;
  const controllers = new Map();
  const number = (value) => value == null ? "待接入" : new Intl.NumberFormat("zh-CN").format(value);
  const count = (value) => Number.isSafeInteger(value) && value >= 0;
  function valid(payload, source, selectedDays) {
    return payload?.schemaVersion === "MEMBER-OPS-V1.0" && payload.source === source && payload.dataSource === "production"
      && payload.window?.days === selectedDays && Number.isFinite(Date.parse(payload.generatedAt))
      && definitions[source].every(([key]) => Object.hasOwn(payload.metrics || {}, key) && (payload.metrics[key] === null || count(payload.metrics[key])))
      && ["zero", "low", "mid", "high"].every((key) => count(payload.pointBuckets?.[key]))
      && (source !== "community" || count(payload.metrics.unresolvedParticipants))
      && (source !== "application" || ["monthly", "half_year", "annual", "other"].every((key) => count(payload.tiers?.[key])));
  }
  function distribution(title, values) {
    return '<article class="mo-distribution"><h3>' + title + '</h3><dl>' + values.map(([label, value]) => '<div><dt>' + label + '</dt><dd>' + number(value) + '</dd></div>').join("") + '</dl></article>';
  }
  function render(source, payload) {
    const metrics = payload.metrics;
    let content = '<div class="mo-grid">' + definitions[source].map(([key, label, note]) => '<article class="mo-metric"><h3>' + label + '</h3><strong' + (metrics[key] == null ? ' class="mo-missing"' : '') + '>' + number(metrics[key]) + '</strong><p>' + note + '</p></article>').join("") + '</div>';
    const buckets = payload.pointBuckets;
    content += '<div class="mo-distributions">' + distribution(source === "community" ? "社群累计积分分布" : "应用可用积分分布", [
      [source === "community" ? "≤ 0 分" : "0 分", buckets.zero], [source === "community" ? "1–29 分" : "1–299 分", buckets.low],
      [source === "community" ? "30–99 分" : "300–999 分", buckets.mid], [source === "community" ? "≥ 100 分" : "≥ 1,000 分", buckets.high],
    ]);
    if (source === "application") content += distribution("有效权益账户 · 最近付费套餐", [["月度", payload.tiers.monthly], ["半年", payload.tiers.half_year], ["年度", payload.tiers.annual], ["兑换 / 其他", payload.tiers.other]]);
    content += '</div>';
    if (source === "community") content += '<p class="mo-note">当期有 ' + number(metrics.unresolvedParticipants) + ' 个活动昵称未能唯一匹配正式成员，未计入参与人数。积分排除已退出积分统计的成员；同一期活动取最高分，再加人工加减分，不改变业务积分账本。</p>';
    else content += '<p class="mo-note">套餐按当前有效权益账户最近一笔未退款订单分类，并非当前权益来源拆账。首次付费 / 再次购买均排除已退款订单；此页不提供自动续费。应用可用积分可能包含社群同步值，不与社群积分相加。</p>';
    $('[data-mo-content="' + source + '"]').innerHTML = content;
    $('[data-mo-status="' + source + '"]').textContent = "已连接 · " + days + " 天窗口 · 更新于 " + new Date(payload.generatedAt).toLocaleString("zh-CN", { hour12: false });
  }
  async function read(source, current, selectedDays) {
    const status = $('[data-mo-status="' + source + '"]');
    const content = $('[data-mo-content="' + source + '"]');
    status.textContent = "正在读取近 " + selectedDays + " 天汇总…";
    content.innerHTML = '<div class="mo-empty">正在连接只读数据源…</div>';
    controllers.get(source)?.abort();
    const controller = new AbortController();
    controllers.set(source, controller);
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(endpoints[source] + "?days=" + selectedDays, { method: "GET", credentials: "omit", cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("unavailable");
      const payload = await response.json();
      if (current !== generation) return;
      if (!valid(payload, source, selectedDays)) throw new Error("invalid aggregate");
      render(source, payload);
    } catch {
      if (current !== generation) return;
      status.textContent = "暂未取得可核验汇总 · 可点击刷新重试";
      content.innerHTML = '<div class="mo-empty">此数据源暂不可用，不代表人数为零。其他数据源仍可独立查看。</div>';
    } finally { clearTimeout(timer); }
  }
  function refresh() {
    loaded = true;
    generation += 1;
    for (const source of Object.keys(endpoints)) void read(source, generation, days);
  }
  $("[data-mo-days]").addEventListener("change", (event) => {
    const value = Number(event.target.value);
    days = [7, 30, 90].includes(value) ? value : 30;
    refresh();
  });
  $("[data-mo-refresh]").addEventListener("click", refresh);
  root.addEventListener("membership:open", () => { if (!loaded) refresh(); });
  if (root.classList.contains("is-active")) refresh();
})();
