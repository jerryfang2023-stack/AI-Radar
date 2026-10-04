import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalFundingEventRound, normalizeFundingRound, ensureCanonicalFundingEvidence } from '../funding-insight-v1-utils.mjs';

test('an investor growth fund does not name the issuer financing round', () => {
  const quote = "Supabase today announced $150 million in new funding led by GIC, with Alphabet's independent growth fund CapitalG also participating.";
  const event = { claim_refs: ['claim'], event_time: '2026-10-02', object: '$150 million in new funding' };
  const claims = [{ claim_id: 'claim', claim_type: 'funding', verification_status: 'accepted', source_quote: quote }];
  assert.equal(canonicalFundingEventRound(event, claims).code, 'undisclosed');
  const payload = { financing: { round: '轮次未披露', round_original: '未披露轮次' } };
  ensureCanonicalFundingEvidence(payload, { claims }, event);
  assert.equal(payload.financing.round, '轮次未披露');
  for (const text of ['growth fund', 'Harmonic Growth Partners', 'capital to accelerate growth', '成长基金参投']) {
    assert.notEqual(normalizeFundingRound(text).code, 'growth');
  }
});

test('explicit growth round disclosures and standalone labels remain supported', () => {
  for (const text of ['growth', 'Growth round', 'Growth investment', 'raised $50 million in growth funding', '成长轮', '完成成长轮融资']) {
    assert.equal(normalizeFundingRound(text).code, 'growth', text);
  }
});
