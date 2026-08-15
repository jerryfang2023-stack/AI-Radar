import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const appConfig = JSON.parse(fs.readFileSync("miniprogram/app.json", "utf8"));
const terminalSource = fs.readFileSync("miniprogram/pages/terminal/index.wxml", "utf8");
const marketSource = fs.readFileSync("miniprogram/pages/market/index.wxml", "utf8");
const marketLogic = fs.readFileSync("miniprogram/pages/market/index.js", "utf8");
const watchlistSource = fs.readFileSync("miniprogram/pages/watchlist/index.wxml", "utf8");
const headerSource = fs.readFileSync("miniprogram/components/app-header/index.wxml", "utf8");
const headerStyles = fs.readFileSync("miniprogram/components/app-header/index.wxss", "utf8");
const membershipSource = fs.readFileSync("miniprogram/pages/membership/index.wxml", "utf8");
const membershipModelSource = fs.readFileSync("miniprogram/utils/membership-model.js", "utf8");
const profileSource = fs.readFileSync("miniprogram/pages/profile/index.wxml", "utf8");
const profileLogic = fs.readFileSync("miniprogram/pages/profile/index.js", "utf8");
const profileEditSource = fs.readFileSync("miniprogram/pages/profile-edit/index.wxml", "utf8");
const profileEditLogic = fs.readFileSync("miniprogram/pages/profile-edit/index.js", "utf8");
const customTabBarSource = fs.readFileSync("miniprogram/custom-tab-bar/index.wxml", "utf8");
const customTabBarStyles = fs.readFileSync("miniprogram/custom-tab-bar/index.wxss", "utf8");
const customTabBarLogic = fs.readFileSync("miniprogram/custom-tab-bar/index.js", "utf8");
const inviteSource = fs.readFileSync("miniprogram/pages/invite/index.wxml", "utf8");
const inviteLogic = fs.readFileSync("miniprogram/pages/invite/index.js", "utf8");
const growthSource = fs.readFileSync("miniprogram/pages/growth/index.wxml", "utf8");
const growthLogic = fs.readFileSync("miniprogram/pages/growth/index.js", "utf8");
const compareSource = fs.readFileSync("miniprogram/pages/compare/index.wxml", "utf8");
const compareLogic = fs.readFileSync("miniprogram/pages/compare/index.js", "utf8");
const detailSource = fs.readFileSync("miniprogram/pages/detail/index.wxml", "utf8");
const detailLogic = fs.readFileSync("miniprogram/pages/detail/index.js", "utf8");
const entityDetailLogic = fs.readFileSync("miniprogram/pages/entity-detail/index.js", "utf8");
const reportDetailSource = fs.readFileSync("miniprogram/pages/report-detail/index.wxml", "utf8");
const reportDetailLogic = fs.readFileSync("miniprogram/pages/report-detail/index.js", "utf8");
const headerLogic = fs.readFileSync("miniprogram/components/app-header/index.js", "utf8");
const memberModelSource = fs.readFileSync("miniprogram/utils/member.js", "utf8");
const memberSource = fs.readFileSync("miniprogram/utils/member.js", "utf8");
const paymentSource = fs.readFileSync("miniprogram/utils/payment.js", "utf8");
const registrationSource = fs.readFileSync("miniprogram/components/registration-sheet/index.wxml", "utf8");
const registrationLogic = fs.readFileSync("miniprogram/components/registration-sheet/index.js", "utf8");
const terminalLogic = fs.readFileSync("miniprogram/pages/terminal/index.js", "utf8");
const membershipLogic = fs.readFileSync("miniprogram/pages/membership/index.js", "utf8");
const customerServiceQr = "miniprogram/assets/support/customer-service-wechat.jpg";
const fundingRowStyles = fs.readFileSync("miniprogram/components/funding-row/index.wxss", "utf8");
const fundingRowSource = fs.readFileSync("miniprogram/components/funding-row/index.wxml", "utf8");
const terminalStyles = fs.readFileSync("miniprogram/pages/terminal/index.wxss", "utf8");
const publicFiles = [
  "miniprogram/pages/terminal/index.wxml",
  "miniprogram/pages/market/index.wxml",
  "miniprogram/pages/entity-detail/index.wxml",
  "miniprogram/pages/watchlist/index.wxml",
  "miniprogram/pages/detail/index.wxml",
  "miniprogram/pages/follows/index.wxml",
  "miniprogram/pages/compare/index.wxml",
  "miniprogram/pages/saved/index.wxml",
];

test("uses the confirmed financing column and public-facing copy", () => {
  assert.equal(appConfig.tabBar.list[0].text, "融资");
  assert.equal(appConfig.tabBar.list[1].text, "生态");
  assert.match(terminalSource, /<app-header title="融资情报"/u);
  assert.match(terminalSource, /<text>融资<\/text><strong>\{\{scopeCardCount\}\}<\/strong>/u);
  assert.match(terminalSource, /class="funding-date"><text>更新<\/text><strong>\{\{meta\.latestDate\}\}<\/strong>/u);
  assert.match(marketSource, /<app-header title="生态图谱"/u);
  assert.match(watchlistSource, /<app-header title="商业观察"/u);
  assert.doesNotMatch(fundingRowSource, /中国区/u);

  const publicSource = publicFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  for (const internalCopy of ["融资终端", "多源核验", "多源已核验", "已验证信号", "证据状态"]) {
    assert.doesNotMatch(publicSource, new RegExp(internalCopy, "u"));
  }
});

test("switches financing between China and global scopes with persisted live counts", () => {
  assert.match(terminalSource, /data-region="global"[\s\S]*>全球</u);
  assert.match(terminalSource, /data-region="china"[\s\S]*>中国</u);
  assert.ok(terminalSource.indexOf('data-region="global"') < terminalSource.indexOf('data-region="china"'));
  assert.match(terminalSource, /scopeCounts\.china/u);
  assert.match(terminalSource, /scopeCounts\.global/u);
  assert.match(terminalLogic, /MARKET_SCOPE_KEY/u);
  assert.match(terminalLogic, /MARKET_SCOPES = \["global", "china"\]/u);
  assert.match(terminalLogic, /selectedMarketRegion: "global"/u);
  assert.match(terminalLogic, /card\.marketRegion === this\.data\.selectedMarketRegion/u);
  assert.match(terminalLogic, /"filters\.marketRegion": marketRegion/u);
});

test("requires phone, avatar and nickname before the server starts a seven-day trial", () => {
  for (const copy of ["开启 7 天完整体验", "头像", "昵称", "授权手机号并开启体验", "不自动续费"]) {
    assert.match(registrationSource, new RegExp(copy, "u"));
  }
  assert.match(registrationSource, /open-type="chooseAvatar"/u);
  assert.match(registrationSource, /type="nickname"/u);
  assert.match(registrationSource, /open-type="getPhoneNumber"/u);
  assert.match(registrationLogic, /phoneCode/u);
  assert.match(registrationLogic, /avatarSelected: true/u);
  assert.match(registrationLogic, /syncMembership\(result\.membership\)/u);
  assert.match(paymentSource, /function hasAuthToken/u);
  assert.match(paymentSource, /fetchMembership\(\)[\s\S]*withExistingToken/u);
  assert.doesNotMatch(registrationSource, /自动获得|首次打开即/u);
});

test("lets verified community members sync without repeating profile registration", () => {
  assert.match(registrationSource, /已有社群成员，直接同步/u);
  assert.match(registrationSource, /open-type="getPhoneNumber"[\s\S]*bindgetphonenumber="linkExistingMember"/u);
  assert.match(registrationLogic, /linkExistingMember/u);
  assert.match(registrationLogic, /syncCommunity\(result\.community\)/u);
  assert.match(registrationLogic, /syncWallet\(result\.wallet\)/u);
  assert.match(registrationLogic, /未匹配到社群成员，请完成资料注册/u);
  assert.match(registrationLogic, /result\.community\?\.status !== "joined"/u);
});

test("exposes the confirmed membership plans and point exchange entry", () => {
  const membershipContract = `${membershipSource}\n${membershipModelSource}`;
  for (const copy of ["7 天完整权益体验", "30", "168", "300", "月度会员", "半年会员", "年度会员", "所有栏目的完整浏览权", "活跃积分兑换"]) {
    assert.match(membershipContract, new RegExp(copy, "u"));
  }
  assert.match(membershipSource, /wx:for="\{\{plans\}\}"/u);
  assert.match(membershipSource, /立即开通会员/u);
  assert.match(membershipLogic, /purchaseMembership\(plan\.id\)/u);
  assert.match(paymentSource, /wx\.requestVirtualPayment/u);
  assert.doesNotMatch(paymentSource, /wx\.requestPayment/u);
  assert.match(membershipSource, /15 天内支持全额退款/u);
  assert.match(membershipSource, /支付与退款客服/u);
  assert.match(membershipLogic, /wx\.previewImage/u);
  assert.ok(fs.existsSync(customerServiceQr));
  assert.match(paymentSource, /result\?\.order\?\.status !== "PAID"/u);
  assert.doesNotMatch(membershipLogic, /付费开通暂未开放/u);
});

test("keeps observer growth primary and membership status compact on profile", () => {
  assert.ok(profileSource.indexOf('class="growth-card"') < profileSource.indexOf('class="membership-card"'));
  assert.doesNotMatch(profileSource, /class="stats-card/u);
  const compactMembership = profileSource.slice(profileSource.indexOf('class="membership-card"'), profileSource.indexOf('class="section-heading"'));
  assert.match(compactMembership, /会员权益/u);
  assert.match(compactMembership, /有效至/u);
  assert.doesNotMatch(compactMembership, /元\/月/u);
  assert.match(compactMembership, /开通会员/u);
  assert.match(profileSource, /邀请人得 300 活跃积分/u);
  assert.match(profileSource, /class="identity-row" bindtap="openSettings"/u);
  assert.match(profileSource, /class="text-link">设置</u);
  assert.doesNotMatch(profileSource, /right-label="设置"/u);
  assert.doesNotMatch(profileSource, /个人信息与数据管理|class="settings-card|class="local-note/u);
});

test("binds phone numbers through the account service without internal-facing profile copy", () => {
  const profileEditContract = `${profileEditSource}\n${profileEditLogic}`;
  assert.match(profileEditSource, /资料设置/u);
  assert.match(profileEditSource, /手机号/u);
  assert.match(profileEditSource, /点击头像更换/u);
  assert.match(profileEditLogic, /bindPhoneNumber\(code\)/u);
  assert.match(profileEditLogic, /手机号绑定成功/u);
  for (const removedCopy of ["微信号", "不可读取", "隐私说明", "等待服务端完成绑定", "当前预览版", "授权凭证已取得", "生产"] ) {
    assert.doesNotMatch(profileEditContract, new RegExp(removedCopy, "u"));
  }
});

test("renders the text-only bottom navigation as connected segmented buttons", () => {
  assert.equal(appConfig.tabBar.custom, true);
  for (const label of ["融资", "生态", "观察", "我的"]) assert.match(customTabBarLogic, new RegExp(label, "u"));
  assert.match(customTabBarSource, /class="tab-button/u);
  assert.match(customTabBarStyles, /grid-template-columns:\s*repeat\(4/u);
  assert.match(customTabBarStyles, /gap:\s*0/u);
  assert.match(customTabBarStyles, /\.tab-button\.with-divider::before[\s\S]*height:\s*44rpx/u);
  assert.match(customTabBarStyles, /\.tab-button\.active[\s\S]*background:\s*#f4efe4/u);
  assert.match(customTabBarStyles, /\.tab-button\.active::after[\s\S]*background:\s*#c8a766/u);
  assert.match(customTabBarStyles, /min-height:\s*calc\(96rpx \+ var\(--tab-safe-bottom\)\)/u);
  assert.match(customTabBarStyles, /safe-area-inset-bottom\) - 24rpx/u);
  assert.match(customTabBarStyles, /\.tab-bar[\s\S]*padding:\s*0;/u);
  assert.match(customTabBarStyles, /\.tab-button[\s\S]*padding-bottom:\s*var\(--tab-safe-bottom\)/u);
});

test("preserves the V0.5 financing list visual contract", () => {
  assert.match(fundingRowStyles, /\.avatar[\s\S]*background:\s*#0d355c/u);
  assert.match(fundingRowStyles, /\.avatar[\s\S]*box-shadow:\s*inset -5rpx 0 0 #c8a766/u);
  assert.match(fundingRowStyles, /\.funding-row[\s\S]*border-bottom:\s*1rpx solid rgba\(200, 167, 102, 0\.3\)/u);
  assert.match(fundingRowStyles, /\.company[\s\S]*font-family:\s*"Songti SC"/u);
  assert.match(fundingRowStyles, /\.amount\.mono[\s\S]*font-family:\s*"Songti SC"/u);
  assert.match(terminalStyles, /\.funding-metrics[\s\S]*border-radius:\s*28rpx/u);
  assert.doesNotMatch(terminalStyles, /\.funding-metrics[^{]*\{[^}]*margin:\s*[^;]*-30rpx/u);
});

test("company comparison can cancel selections in place", () => {
  assert.match(compareSource, /catchtap="removeCard">取消比较/u);
  assert.match(compareSource, /还需选择 1 家公司/u);
  assert.match(compareSource, /暂无比较公司/u);
  assert.match(compareLogic, /removeCompare\(id\)/u);
  assert.match(compareLogic, /wx\.switchTab/u);
});

test("collection is a detail action and favorite task opens saved items", () => {
  assert.doesNotMatch(terminalSource, /收藏/u);
  assert.match(detailSource, /<app-header title="融资详情" show-back \/>/u);
  assert.match(detailSource, /class="detail-actions"/u);
  assert.match(detailSource, /收藏情报/u);
  assert.match(profileLogic, /id === "favorite"[\s\S]*pages\/saved\/index/u);
  assert.doesNotMatch(memberModelSource, /title: "关注 1 个主题"/u);
  assert.match(profileSource, /growth\.completedToday\}\}\/\{\{growth\.tasks\.length\}\}/u);
});

test("shares funding and ecosystem details with navigable shared reports", () => {
  assert.match(detailLogic, /onShareAppMessage\(\)/u);
  assert.match(detailLogic, /onShareTimeline\(\)/u);
  assert.match(detailLogic, /pages\/detail\/index\?id=/u);
  assert.match(entityDetailLogic, /onShareAppMessage\(\)/u);
  assert.match(entityDetailLogic, /onShareTimeline\(\)/u);
  assert.match(entityDetailLogic, /pages\/entity-detail\/index\?type=/u);
  assert.match(reportDetailLogic, /from=share/u);
  assert.match(reportDetailLogic, /sharedEntry/u);
  assert.match(reportDetailLogic, /wx\.switchTab/u);
  assert.match(reportDetailSource, /class="shared-entry-nav"/u);
  for (const label of ["融资", "生态", "观察", "我的"]) assert.match(reportDetailSource, new RegExp(`>${label}<`, "u"));
  assert.match(headerLogic, /getCurrentPages\(\)\.length > 1/u);
  assert.match(headerLogic, /fallbackUrl/u);
  assert.match(headerLogic, /wx\.switchTab/u);
});

test("adds an idempotent five-point daily check-in task", () => {
  assert.match(memberModelSource, /id: "checkin", title: "每日签到", target: 1, reward: 5/u);
  assert.match(profileLogic, /recordBehavior\("checkin", "daily"\)/u);
  assert.match(profileLogic, /await syncBehaviorQueue\(\)/u);
  assert.match(profileLogic, /签到成功，\+5 分/u);
  assert.match(growthLogic, /recordBehavior\("checkin", "daily"\)/u);
  assert.match(growthLogic, /await syncBehaviorQueue\(\)/u);
  assert.match(memberModelSource, /guanlan_behavior_sync_queue_v1/u);
  assert.match(memberModelSource, /recordMemberBehavior\(pending\.type, pending\.subjectId, pending\.behaviorDate\)/u);
  assert.doesNotMatch(growthSource, /rules-note|到账规则/u);
});

test("opens a dedicated invitation value page before sharing", () => {
  assert.ok(appConfig.pages.includes("pages/invite/index"));
  assert.match(profileLogic, /openInvite/u);
  assert.match(profileSource, /bindtap="openInvite"/u);
  assert.doesNotMatch(profileSource, /open-type="share"/u);
  for (const copy of ["300 分", "融资情报", "生态图谱", "商业观察", "每位新用户仅计入一次有效邀请", "系统确认结果为准", "微信快捷注册", "我的邀请", "注册成功", "获得积分"]) {
    assert.match(inviteSource, new RegExp(copy, "u"));
  }
  assert.doesNotMatch(inviteSource, /class="invite-lead"/u);
  assert.match(inviteSource, /open-type="share"/u);
  assert.match(inviteSource, /class="shared-entry-nav"/u);
  assert.match(inviteLogic, /registerInvitee/u);
  assert.match(inviteLogic, /fetchInviteSummary/u);
  assert.match(inviteLogic, /recordInviteVisit/u);
  assert.match(inviteLogic, /syncInviteRewards/u);
  assert.match(inviteLogic, /inviterName/u);
  assert.match(inviteLogic, /if \(isInvitee\)[\s\S]*if \(!hasAuthToken\(\)\) this\.setData\(\{ registrationOpen: true \}\)/u);
});

test("enables confirmed point redemption with balance and membership updates", () => {
  assert.match(growthSource, /item\.affordable/u);
  assert.match(growthSource, /还差/u);
  assert.match(growthLogic, /确认兑换吗/u);
  assert.match(growthLogic, /兑换成功，已增加/u);
  assert.match(memberSource, /transactionId/u);
  assert.match(memberSource, /saveWallet\(result\.wallet\)/u);
  assert.match(memberSource, /saveMembership\(nextMembership\)/u);
  assert.match(memberSource, /兑换未完成，请重试/u);
});

test("keeps list pages concise while preserving detail-page actions", () => {
  assert.doesNotMatch(terminalSource, /收藏/u);
  assert.doesNotMatch(terminalSource, /checkbox/u);
  assert.match(terminalSource, /placeholder="公司 \/ 机构 \/ 产品"/u);
  assert.doesNotMatch(terminalSource, /category-chip|市场类别|全部市场/u);
  assert.match(marketSource, /企业库/u);
  assert.match(marketSource, /机构库/u);
  assert.match(marketSource, /人物库/u);
  assert.ok(
    marketSource.indexOf('class="search-box"') < marketSource.indexOf('class="library-tabs"'),
    "生态图谱搜索栏应位于子栏目切换栏上方",
  );
  assert.match(marketLogic, /企业 \/ 产品 \/ 赛道/u);
  assert.match(marketLogic, /机构 \/ 已投公司 \/ 赛道/u);
  assert.match(marketLogic, /人物 \/ 企业 \/ 职务/u);
  assert.doesNotMatch(`${marketSource}\n${watchlistSource}`, /AI FUNDING|GUANLAN RESEARCH|更新日期/u);
});

test("matches the H5 branded header across the first three tabs", () => {
  assert.match(headerSource, /logo-wavesight-reference-horizontal\.svg/u);
  assert.match(headerSource, /class="tab-header-title"/u);
  assert.match(headerStyles, /\.tab-header-logo/u);
  assert.match(headerStyles, /text-align:\s*center/u);
  assert.match(headerStyles, /border-bottom:\s*1rpx/u);
});
