'use strict';
// Step 2 — one company profile ("ficha") per target, from a fixed template.
const { loadEvent, loadCompanies, loadTemplate, render, writeOut } = require('./lib/data');
const { fitScore, isTarget } = require('./lib/classify');

const ev = loadEvent();
const tpl = loadTemplate('ficha.md');
let n = 0;
for (const c of loadCompanies().filter((x) => isTarget(x))) {
  const md = render(tpl, {
    ...c,
    region: ev.region.name,
    global_presence: c.global_presence.join(', '),
    contact_name: c.contact.name,
    contact_title: c.contact.title,
    attending_verified: c.attending_verified ? 'yes' : 'no',
    score: fitScore(c),
    relevance: `Operates in ${c.sector.toLowerCase()}, a priority sector for ${ev.region.name}; regional presence today: ${c.regional_presence.toLowerCase()}.`,
    next_steps: '- Confirm meeting slot\n- Share regional supplier map for the sector\n- Identify a named anchor customer in the region',
  });
  writeOut(`02_Fichas/${c.id}.md`, md);
  n++;
}
console.log(`wrote ${n} fichas`);
