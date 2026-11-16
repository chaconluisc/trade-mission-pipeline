'use strict';

/**
 * Engagement classification used in every mission report.
 * Kept as pure functions so the rules are testable and identical across missions.
 */
const CLASSES = {
  STRATEGIC: 'Highest priority: announced investment, committed expansion, or a dated deliverable with a high-fit counterpart.',
  QUALIFIED: 'Counterpart explicitly opened a path to engage, conditional on a substantiated business case.',
  OBSERVE: 'Channel open for periodic re-engagement; no active interest today.',
  INFORMATIONAL: 'No meeting held or no commitment at this stage.',
};

const fitScore = (c) => c.fit.sector_priority + c.fit.expansion_signal + c.fit.regional_link;

/** A company enters the target list only if attendance is verified and fit clears the bar. */
const isTarget = (c, minScore = 5) => c.attending_verified && fitScore(c) >= minScore;

function classify(c) {
  const e = c.engagement;
  if (!e.held) return 'INFORMATIONAL';
  if (e.signals.announced_investment) return 'STRATEGIC';
  if (e.signals.committed_next_step_with_date && e.signals.explicit_interest && fitScore(c) >= 8) return 'STRATEGIC';
  if (e.signals.explicit_interest) return 'QUALIFIED';
  return 'OBSERVE';
}

module.exports = { CLASSES, fitScore, isTarget, classify };
