const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASELINE_PATH = path.join(__dirname, 'baseline.json');

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, acc);
    else if (/\.html$/i.test(entry.name)) acc.push(full);
  }
  return acc;
}

function rel(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function scanBrand(brandDir) {
  const files = walkHtml(brandDir);
  const fields = new Set();
  const blocks = new Set();
  const placeholders = new Set();
  const fileSet = new Set();
  let pageRoots = 0;

  for (const file of files) {
    fileSet.add(rel(brandDir, file));
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/data-finam-v2-field="([^"]+)"/g)) fields.add(m[1]);
    for (const m of html.matchAll(/data-finam-v2-block="([^"]+)"/g)) blocks.add(m[1]);
    const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
    for (const m of withoutComments.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)) placeholders.add(m[1]);
    pageRoots += (html.match(/<article\b[^>]*\bfinam-v2-page\b/gi) || []).length;
    pageRoots += (html.match(/<(?:section|div)\b[^>]*class=(["'])[^"']*\bpage\b/gi) || []).length;
  }

  return {
    files: [...fileSet].sort(),
    fields: [...fields].sort(),
    blocks: [...blocks].sort(),
    placeholders: [...placeholders].sort(),
    pageRoots,
  };
}

function missing(expected, actual) {
  const set = new Set(actual);
  return expected.filter((item) => !set.has(item));
}

function extra(expected, actual) {
  const set = new Set(expected);
  return actual.filter((item) => !set.has(item));
}

function checkBrand(name, baselineKey, opts = {}) {
  const brandDir = path.join(ROOT, 'brands', name);
  const base = baseline[baselineKey];
  const now = scanBrand(brandDir);
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(brandDir)) {
    errors.push(`missing brand folder brands/${name}`);
    return { errors, warnings, now };
  }

  const missingFiles = missing(base.files || [], now.files);
  if (missingFiles.length) {
    errors.push(`missing HTML files (${missingFiles.length}): ${missingFiles.slice(0, 8).join(', ')}`);
  }

  if (opts.requireFields) {
    const miss = missing(base.fields || [], now.fields);
    if (miss.length) errors.push(`missing data-finam-v2-field (${miss.length}): ${miss.join(', ')}`);
    const missBlocks = missing(base.blocks || [], now.blocks);
    if (missBlocks.length) errors.push(`missing data-finam-v2-block (${missBlocks.length}): ${missBlocks.join(', ')}`);
    const added = extra(base.fields || [], now.fields);
    if (added.length) warnings.push(`new fields not in baseline (${added.length}): ${added.join(', ')}`);
  }

  if (opts.requirePlaceholders) {
    const miss = missing(base.placeholders || [], now.placeholders);
    if (miss.length) {
      errors.push(`missing placeholders (${miss.length}): ${miss.slice(0, 20).join(', ')}${miss.length > 20 ? '…' : ''}`);
    }
    const added = extra(base.placeholders || [], now.placeholders);
    if (added.length) {
      warnings.push(`new placeholders not wired on backend yet (${added.length}): ${added.slice(0, 15).join(', ')}`);
    }
  }

  if (now.pageRoots < 1) {
    errors.push('no page roots found (.finam-v2-page or .page)');
  }

  return { errors, warnings, now };
}

if (!fs.existsSync(BASELINE_PATH)) {
  console.error('FAIL: scripts/baseline.json not found. Run: node scripts/extract-baseline.js');
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));

const checks = [
  checkBrand('finam-v2', 'finam', { requireFields: true }),
  checkBrand('rostech', 'rostech', { requirePlaceholders: true }),
  checkBrand('renaissance', 'renaissance', { requirePlaceholders: true }),
];

let failed = false;
const labels = ['finam-v2', 'rostech', 'renaissance'];

labels.forEach((label, idx) => {
  const result = checks[idx];
  console.log(`\n=== ${label} ===`);
  console.log(`files=${result.now.files.length} pageRoots=${result.now.pageRoots}`);
  if (result.errors.length) {
    failed = true;
    result.errors.forEach((e) => console.error(`ERROR: ${e}`));
  } else {
    console.log('OK: contract markers present');
  }
  result.warnings.forEach((w) => console.warn(`WARN: ${w}`));
});

console.log('');
if (failed) {
  console.error('check-templates: FAILED');
  process.exit(1);
}
console.log('check-templates: PASSED');
