import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readJson = async (name) => JSON.parse(await readFile(new URL(`../public/data/${name}`, import.meta.url), "utf8"));

test("H5 contains all four confirmed columns", async () => {
  const source = await readFile(new URL("../src/Prototype.tsx", import.meta.url), "utf8");
  for (const label of ["融资", "生态", "观察", "我的"]) assert.match(source, new RegExp(`label: \"${label}\"`));
  assert.match(source, /title="融资情报"/u);
  assert.match(source, /placeholder="公司 \/ 机构 \/ 产品"/u);
  assert.match(source, /title="生态图谱"/u);
  assert.match(source, /企业库/u);
  assert.match(source, /机构库/u);
  assert.match(source, /人物库/u);
  assert.match(source, /人物 \/ 企业 \/ 职务/u);
  assert.match(source, /function EntityDetailView/u);
  assert.match(source, /onOpenEntity/u);
  assert.doesNotMatch(source, /category-carousel|融资分类|全部市场/u);
  for (const internalCopy of ["融资终端", "多源核验", "已验证信号", "当前公开样本概览"]) {
    assert.doesNotMatch(source, new RegExp(internalCopy, "u"));
  }
});

test("H5 opens with the confirmed Guanlan brand splash", async () => {
  const source = await readFile(new URL("../src/Prototype.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/prototype.css", import.meta.url), "utf8");

  for (const phrase of ["洞察趋势 · 智见未来", "AI 融资情报与市场观察", "观澜 AI"]) {
    assert.ok(source.includes(phrase), `missing splash copy: ${phrase}`);
  }
  assert.match(source, /logo-wavesight\.svg/u);
  assert.match(source, /setTimeout\(\(\) => setSplashVisible\(false\), 1500\)/u);
  assert.match(styles, /prefers-reduced-motion/u);
});

test("H5 offers a forced phone layout for wide preview browsers", async () => {
  const runtime = await readFile(new URL("../src/Prototype.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/prototype.css", import.meta.url), "utf8");

  assert.match(runtime, /get\("mobile"\) === "1"/u);
  assert.match(styles, /html\.forced-mobile-layout/u);
});

test("funding and report datasets are available", async () => {
  const fundingIndex = await readJson("funding-index.json");
  const fundingDetails = await readJson("funding-details.json");
  const reportIndex = await readJson("report-index.json");
  const reportDetails = await readJson("report-details.json");

  assert.ok(fundingIndex.cards.length > 0);
  assert.ok(Object.keys(fundingDetails).length > 0);
  assert.ok(reportIndex.reports.some((item) => item.type === "weekly"));
  assert.ok(reportIndex.reports.some((item) => item.type === "monthly"));
  assert.ok(Object.keys(reportDetails).length > 0);
});

test("profile capabilities are present", async () => {
  const source = await readFile(new URL("../src/Prototype.tsx", import.meta.url), "utf8");
  for (const capability of ["浏览记录", "我的收藏", "我的关注", "成长与权益", "邀请好友", "个人资料"]) {
    assert.ok(source.includes(capability), `missing capability: ${capability}`);
  }
  for (const membershipCopy of ["7 天体验中", "30", "168", "300", "月度会员", "半年会员", "年度会员", "会员权益兑换", "活跃积分兑换", "所有栏目的完整浏览权"]) {
    assert.ok(source.includes(membershipCopy), `missing membership capability: ${membershipCopy}`);
  }
  const profile = source.slice(source.indexOf("function ProfileView"), source.indexOf("function MembershipView"));
  assert.ok(profile.indexOf('className="growth-card"') < profile.indexOf('className="membership-card"'));
  assert.doesNotMatch(profile, /className="stats"/u);
  assert.doesNotMatch(profile.slice(profile.indexOf('className="membership-card"')), /元\/月起/u);
});

test("public UI does not expose internal workflow language", async () => {
  const source = await readFile(new URL("../src/Prototype.tsx", import.meta.url), "utf8");
  const forbidden = [
    "多源核验率",
    "多源已核验",
    "PUBLIC FUNDING SAMPLE",
    "当前公开样本概览",
    "已验证信号",
    "当前本地体验积分",
    "H5 体验起始积分",
    "待后端接入",
    "需公众号或开放平台网页授权",
    "数据保存在当前浏览器",
    "正式到账以服务端验证结果为准",
    "报告是基于证据的下游研究判断",
  ];
  for (const phrase of forbidden) assert.ok(!source.includes(phrase), `internal phrase is still exposed: ${phrase}`);
});
