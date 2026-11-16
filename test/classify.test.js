'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { classify, isTarget, fitScore } = require('../scripts/lib/classify');

const base = (over = {}) => ({
  attending_verified: true,
  fit: { sector_priority: 3, expansion_signal: 3, regional_link: 2 },
  engagement: { held: true, signals: { announced_investment: false, committed_next_step_with_date: false, explicit_interest: false } },
  ...over,
});
const withSignals = (s, extra = {}) => base({ ...extra, engagement: { held: true, signals: { ...base().engagement.signals, ...s } } });

test('meeting not held is INFORMATIONAL', () => {
  assert.equal(classify(base({ engagement: { held: false, signals: {} } })), 'INFORMATIONAL');
});
test('announced investment is STRATEGIC', () => {
  assert.equal(classify(withSignals({ announced_investment: true })), 'STRATEGIC');
});
test('dated commitment + interest + high fit is STRATEGIC', () => {
  assert.equal(classify(withSignals({ committed_next_step_with_date: true, explicit_interest: true })), 'STRATEGIC');
});
test('dated commitment with low fit stays QUALIFIED', () => {
  const low = { fit: { sector_priority: 2, expansion_signal: 2, regional_link: 1 } };
  assert.equal(classify(withSignals({ committed_next_step_with_date: true, explicit_interest: true }, low)), 'QUALIFIED');
});
test('no interest is OBSERVE', () => {
  assert.equal(classify(base()), 'OBSERVE');
});
test('unverified attendance never enters the target list', () => {
  assert.equal(fitScore(base()), 8);
  assert.equal(isTarget(base({ attending_verified: false })), false);
});
