'use strict';
// Step 3 — personalised outreach drafts. Drafts only: a human reviews and sends.
const { loadEvent, loadCompanies, loadTemplate, render, writeOut } = require('./lib/data');
const { isTarget } = require('./lib/classify');

const ev = loadEvent();
const tpl = loadTemplate('outreach_email_en.md');
const slots = ['Monday 10:00', 'Monday 14:30', 'Tuesday 09:30', 'Tuesday 15:00', 'Wednesday 11:00', 'Wednesday 16:00'];
const targets = loadCompanies().filter((x) => isTarget(x));
targets.forEach((c, i) => {
  writeOut(`03_Outreach/${c.id}.md`, render(tpl, {
    ...ev,
    region: ev.region.name,
    company: c.name,
    contact_name: c.contact.name,
    sector_lower: c.sector.toLowerCase(),
    regional_hook: ev.region.value_proposition[i % ev.region.value_proposition.length],
    proposed_slot: slots[i % slots.length],
  }));
});
console.log(`wrote ${targets.length} outreach drafts`);
