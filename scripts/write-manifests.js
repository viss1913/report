const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline.json'), 'utf8'));

function writeFinam() {
  const lines = [];
  lines.push('# Finam v2 — MANIFEST');
  lines.push('');
  lines.push('Источник истины для check-script: `scripts/baseline.json` (ключ `finam`).');
  lines.push('');
  lines.push('## HTML files');
  lines.push('');
  for (const file of baseline.finam.files) lines.push(`- \`${file}\``);
  lines.push('');
  lines.push('## data-finam-v2-field');
  lines.push('');
  for (const field of baseline.finam.fields) {
    lines.push(`- \`${field}\` — ${baseline.finam.fieldMap[field]}`);
  }
  lines.push('');
  lines.push('## data-finam-v2-block');
  lines.push('');
  for (const block of baseline.finam.blocks) {
    lines.push(`- \`${block}\` — ${baseline.finam.blockMap[block]}`);
  }
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- Backend replaces the **entire element** that carries the attribute.');
  lines.push('- Keep attribute names stable across visual redesigns.');
  lines.push('- Multi-page templates contain multiple `<article class="finam-v2-page">`.');
  lines.push('');
  fs.writeFileSync(path.join(root, 'brands', 'finam-v2', 'MANIFEST.md'), `${lines.join('\n')}\n`);
}

function writePlaceholders(brand, key, title) {
  const data = baseline[key];
  const lines = [];
  lines.push(`# ${title} — MANIFEST`);
  lines.push('');
  lines.push(`Источник истины: \`scripts/baseline.json\` (ключ \`${key}\`).`);
  lines.push('');
  lines.push('## HTML files');
  lines.push('');
  for (const file of data.files) lines.push(`- \`${file}\``);
  lines.push('');
  lines.push('## Placeholders `{{...}}`');
  lines.push('');
  for (const placeholder of data.placeholders) {
    lines.push(`- \`{{${placeholder}}}\` — first seen in \`${data.placeholderMap[placeholder]}\``);
  }
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- Do not rename existing placeholders without PFP approval.');
  lines.push('- New placeholders require backend mapper changes before they appear in PDF.');
  lines.push('- HTML comments at the top of each file document expected demo values.');
  lines.push('');
  fs.writeFileSync(path.join(root, 'brands', brand, 'MANIFEST.md'), `${lines.join('\n')}\n`);
}

writeFinam();
writePlaceholders('rostech', 'rostech', 'Rostech');
writePlaceholders('renaissance', 'renaissance', 'Renaissance / YADRO');
console.log('manifests written');
