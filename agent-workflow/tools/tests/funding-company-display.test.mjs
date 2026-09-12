import assert from "node:assert/strict";
import test from "node:test";
import { fundingCompanyDisplayName } from "../funding-company-display-v1.mjs";

test("prefers only an explicitly attached company abbreviation and retains unknown legal names", () => {
  const name = "上海以太之心科技有限公司";
  const card = { company: { name, full_name: name, evidence_refs: [{ quote: name + "（以下简称“以太之心”）宣布融资。" }] } };
  assert.equal(fundingCompanyDisplayName(card), "以太之心");
  assert.equal(card.company.full_name, name);
  card.company.evidence_refs = [{ quote: "上海其他科技有限公司（以下简称“其他科技”）向" + name + "投资。" }];
  assert.equal(fundingCompanyDisplayName(card), name);
  assert.equal(fundingCompanyDisplayName(card, [{ canonical_name: "以太之心", legal_names: [name], aliases: ["以太之心"] }]), "以太之心");
  assert.equal(fundingCompanyDisplayName({ company: { name: "DeepSeek" } }), "DeepSeek");
});
