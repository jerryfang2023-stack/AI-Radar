import assert from "node:assert/strict";
import test from "node:test";
import { extractExplicitProductNames } from "../../product/product-entity-normalizer.mjs";

function extract(title, organizations = []) {
  return extractExplicitProductNames({
    eventType: "product_release",
    title,
    object: title,
    evidenceTexts: [],
    organizationNames: organizations
  });
}

test("product extraction rejects headline grammar and article fragments", () => {
  assert.deepEqual(extract("AWS Launches AI Agents On Partner Central To Simplify Funding", ["AWS"]), []);
  assert.deepEqual(extract("Vertical AI Agents Are Eating Horizontal SaaS: Inside the 2026 Specialization Boom"), []);
  assert.deepEqual(extract("Entire Is The Next Developer Platform for AI"), []);
  assert.deepEqual(extract("Company Announcement: IBM Enterprise Deployment Scales", ["IBM"]), []);
});

test("product extraction preserves exact branded names while dropping headline suffixes", () => {
  assert.deepEqual(extract("OpenAI releases GPT-5.6 amid US AI regulatory drama", ["OpenAI"]), ["GPT-5.6"]);
  assert.deepEqual(extract("1Password has launched 1Password for Claude", ["1Password"]), ["1Password for Claude"]);
});
