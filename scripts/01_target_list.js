'use strict';
// Step 1 — rank researched companies and keep verified, high-fit targets.
const { loadEvent, loadCompanies, writeOut } = require('./lib/data');
const { fitScore, isTarget } = require('./lib/classify');

const ev = loadEvent();
const rows = loadCompanies()
  .map((c) => ({ ...c, score: fitScore(c), target: isTarget(c) }))
  .sort((a, b) => b.score - a.score);

let md = `# 01 — Target list · ${ev.event}\n\n| # | Company | Sector | Fit | Attendance verified | In target list |\n|---|---|---|---|---|---|\n`;
rows.forEach((c, i) => {
  md += `| ${i + 1} | ${c.name} | ${c.sector} | ${c.score}/9 | ${c.attending_verified ? 'yes' : 'no'} | ${c.target ? '**yes**' : 'no'} |\n`;
});
md += `\n${rows.filter((r) => r.target).length} of ${rows.length} researched companies qualify as targets.\n`;
console.log('wrote', writeOut('01_TargetList.md', md));
