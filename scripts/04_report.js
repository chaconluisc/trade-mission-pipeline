'use strict';
// Step 4 — classify engagements and build the mission report as Markdown + DOCX.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, Footer, PageNumber, AlignmentType,
} = require('docx');
const { loadEvent, loadCompanies, writeOut, OUT } = require('./lib/data');
const { CLASSES, classify } = require('./lib/classify');

const ORDER = Object.keys(CLASSES);
const ev = loadEvent();
const rows = loadCompanies().map((c) => ({ ...c, cls: classify(c) }));
const byClass = Object.fromEntries(ORDER.map((k) => [k, rows.filter((r) => r.cls === k)]));
const held = rows.filter((r) => r.engagement.held).length;

// ---------- Markdown ----------
let md = `# Mission Report — ${ev.event}\n\n*${ev.delegation} · ${ev.city} · ${ev.dates}*\n\n`;
md += `## 1. Summary\n\n${rows.length} documented engagements (${held} meetings held), classified with the standard framework below.\n\n`;
md += `| Class | Count | Definition |\n|---|---|---|\n`;
for (const k of ORDER) md += `| **${k}** | ${byClass[k].length} | ${CLASSES[k]} |\n`;
md += `\n## 2. Engagements\n\n`;
for (const k of ORDER) {
  for (const r of byClass[k]) {
    md += `### ${r.name} — ${k}\n*${r.sector} · ${r.hq} · ${r.contact.name}, ${r.contact.title}*\n\n${r.engagement.summary}\n\n`;
  }
}
md += `## 3. Recommended next steps\n\n- Strategic: assign an owner and date to every committed deliverable.\n- Qualified: build the business case each counterpart asked for (anchor customers, cost data).\n- Observe: schedule a re-engagement touchpoint in 6 months.\n`;
writeOut('04_MissionReport.md', md);

// ---------- DOCX ----------
const NAVY = '1F3455';
const cell = (text, opts = {}) => new TableCell({
  width: { size: opts.w || 2000, type: WidthType.DXA },
  shading: opts.head ? { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' } : undefined,
  children: [new Paragraph({ children: [new TextRun({ text: String(text), bold: !!opts.head, color: opts.head ? 'FFFFFF' : undefined, size: 20 })] })],
});
const summaryTable = new Table({
  width: { size: 9000, type: WidthType.DXA },
  rows: [
    new TableRow({ tableHeader: true, children: [cell('Class', { head: true, w: 1800 }), cell('Count', { head: true, w: 900 }), cell('Definition', { head: true, w: 6300 })] }),
    ...ORDER.map((k) => new TableRow({ children: [cell(k, { w: 1800 }), cell(byClass[k].length, { w: 900 }), cell(CLASSES[k], { w: 6300 })] })),
  ],
});
const engagementParas = ORDER.flatMap((k) => byClass[k].flatMap((r) => [
  new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(`${r.name} — ${k}`)] }),
  new Paragraph({ children: [new TextRun({ text: `${r.sector} · ${r.hq} · ${r.contact.name}, ${r.contact.title}`, italics: true, size: 18 })] }),
  new Paragraph({ spacing: { after: 160 }, children: [new TextRun(r.engagement.summary)] }),
]));

const doc = new Document({
  creator: 'trade-mission-pipeline',
  title: `Mission Report — ${ev.event}`,
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  sections: [{
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Page ', PageNumber.CURRENT], size: 16 })] })] }) },
    children: [
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: `Mission Report — ${ev.event}`, color: NAVY })] }),
      new Paragraph({ children: [new TextRun({ text: `${ev.delegation} · ${ev.city} · ${ev.dates}`, italics: true })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('1. Summary')] }),
      new Paragraph({ children: [new TextRun(`${rows.length} documented engagements (${held} meetings held).`)] }),
      summaryTable,
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('2. Engagements')] }),
      ...engagementParas,
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const file = path.join(OUT, '04_MissionReport.docx');
  fs.writeFileSync(file, buf);
  console.log('wrote', file, `(${buf.length} bytes)`);
  console.log(ORDER.map((k) => `${k}=${byClass[k].length}`).join(' '));
});
