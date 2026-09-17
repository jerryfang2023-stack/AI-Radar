import assert from "node:assert/strict";
import test from "node:test";
import { articleLabelDate } from "../lib/publisher-date.mjs";

test("publisher article label handles Chinese month-day-year before related stories", () => {
  const article = '<span class="mg-blog-date"><i class="fas fa-clock"></i>4 月 15, 2025</span>';
  const related = '<span class="mg-blog-date">9 月 16, 2026</span>';
  assert.equal(articleLabelDate(article + related), "2025-04-15T00:00:00.000Z");
  assert.equal(articleLabelDate('<span>4 月 15, 2025</span>'), "");
  assert.equal(articleLabelDate('<span class="mg-blog-date">2 月 31, 2026</span>'), "");
  assert.equal(articleLabelDate('<span class="mg-blog-date">unknown</span>' + related), "");
});
