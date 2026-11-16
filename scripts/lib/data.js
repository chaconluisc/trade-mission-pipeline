'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'output');

const loadEvent = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'event.json'), 'utf8'));
const loadCompanies = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'companies.json'), 'utf8'));
const loadTemplate = (name) => fs.readFileSync(path.join(ROOT, 'templates', name), 'utf8');

/** Replace {{key}} placeholders; unknown keys are left visible so gaps are obvious in review. */
function render(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
}

function writeOut(rel, content) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

module.exports = { ROOT, OUT, loadEvent, loadCompanies, loadTemplate, render, writeOut };
