import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { applyReviewedFundingMarkets, inheritConfirmedCompanyMarkets } from '../../../01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs';
import { publicationHold } from '../catalog.mjs';

const review = JSON.parse(fs.readFileSync(new URL('../../../01-SiteV2/content/12-applications/funding-insights/publication-review.json', import.meta.url)));
const iambic = {
  triggered_by_event_id: 'EV-65154e5eb49c218b',
  company: { name: 'Iambic', entity_id: 'EN-44ec15e31baddfe9', canonical_entity_consistent: true },
  market_scope: { market_region: 'CN', china_market_match: true, china_market_basis: ['event_market'] },
};

test('reviewed US headquarters overrides an erroneous repeated China event projection', () => {
  const unrelated = { ...iambic, triggered_by_event_id: 'EV-other', company: { name: 'Other' } };
  const [fixed, unchanged] = applyReviewedFundingMarkets(inheritConfirmedCompanyMarkets([iambic, unrelated]), review);
  assert.equal(fixed.market_scope.market_region, 'GLOBAL');
  assert.equal(fixed.market_scope.china_market_match, false);
  assert.deepEqual(fixed.market_scope.china_market_basis, []);
  assert.equal(unchanged, unrelated);
  assert.equal(iambic.market_scope.market_region, 'CN');
  const aggregated = { ...iambic, triggered_by_event_id: 'EV-new', source_event_ids: [iambic.triggered_by_event_id] };
  assert.equal(applyReviewedFundingMarkets([aggregated], review)[0].market_scope.market_region, 'GLOBAL');
});

test('market correction fails closed if the event changes company or review evidence is incomplete', () => {
  assert.throws(() => applyReviewedFundingMarkets([{ ...iambic, company: { name: 'Different company' } }], review), /binding_conflict/);
  const incomplete = { ...review, market_corrections: [{ ...review.market_corrections[0], source_quote: '' }] };
  assert.throws(() => applyReviewedFundingMarkets([iambic], incomplete), /invalid_financing_market_review/);
});

test('MOSI Pre-A evidence cannot publish as Zhipu; correct MOSI and separate Zhipu round remain eligible', () => {
  assert.ok(publicationHold({ triggered_by_event_id: 'EV-745ef35fd5483754' }, review));
  assert.equal(publicationHold({ triggered_by_event_id: 'EV-64d88a6be3258064' }, review), null);
  assert.equal(publicationHold({ triggered_by_event_id: 'EV-7eead74c2baae511' }, review), null);
});
