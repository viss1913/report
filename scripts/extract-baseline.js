const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.html$/i.test(entry.name)) acc.push(full);
  }
  return acc;
}

function relFrom(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function extract(brand) {
  const root = path.join(__dirname, '..', 'brands', brand);
  const files = walk(root);
  const fields = new Map();
  const blocks = new Map();
  const placeholders = new Map();
  const pagesByFile = {};

  for (const file of files) {
    const rel = relFrom(root, file);
    const html = fs.readFileSync(file, 'utf8');
    const finamPages = (html.match(/<article\b[^>]*\bfinam-v2-page\b/gi) || []).length;
    const sectionPages = (html.match(/<section\b[^>]*\bpage\b/gi) || []).length;
    const divPages = (html.match(/<div\b[^>]*class=(["'])[^"']*\bpage\b/gi) || []).length;
    pagesByFile[rel] = { finamArticles: finamPages, sectionPages, divPages };

    for (const match of html.matchAll(/data-finam-v2-field="([^"]+)"/g)) {
      if (!fields.has(match[1])) fields.set(match[1], rel);
    }
    for (const match of html.matchAll(/data-finam-v2-block="([^"]+)"/g)) {
      if (!blocks.has(match[1])) blocks.set(match[1], rel);
    }
    const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
    for (const match of withoutComments.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)) {
      if (!placeholders.has(match[1])) placeholders.set(match[1], rel);
    }
  }

  return {
    files: files.map((file) => relFrom(root, file)).sort(),
    fields: [...fields.keys()].sort(),
    blocks: [...blocks.keys()].sort(),
    placeholders: [...placeholders.keys()].sort(),
    fieldMap: Object.fromEntries(fields),
    blockMap: Object.fromEntries(blocks),
    placeholderMap: Object.fromEntries(placeholders),
    pagesByFile,
  };
}

const snapshot = {
  generatedAt: new Date().toISOString().slice(0, 10),
  finam: extract('finam-v2'),
  rostech: extract('rostech'),
  renaissance: extract('renaissance'),
};

const outPath = path.join(__dirname, 'baseline.json');
fs.writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
process.stdout.write(
  [
    `wrote ${outPath}`,
    `finam files=${snapshot.finam.files.length} fields=${snapshot.finam.fields.length} blocks=${snapshot.finam.blocks.length}`,
    `rostech files=${snapshot.rostech.files.length} placeholders=${snapshot.rostech.placeholders.length}`,
    `renaissance files=${snapshot.renaissance.files.length} placeholders=${snapshot.renaissance.placeholders.length}`,
  ].join('\n')
);
