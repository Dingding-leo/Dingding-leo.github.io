import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');
const origin = 'https://static-export.local';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

function outputPath(file) {
  return `/${path.relative(outDir, file).split(path.sep).join('/')}`;
}

function pageUrlFor(filePath) {
  if (filePath === '/index.html') return '/';
  if (filePath.endsWith('/index.html')) {
    return filePath.slice(0, -'index.html'.length);
  }
  return filePath;
}

function candidateFiles(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+/g, '/');
  if (clean.endsWith('/')) return [`${clean}index.html`];
  if (path.posix.extname(clean)) return [clean];
  return [clean, `${clean}.html`, `${clean}/index.html`];
}

function extractReferences(html) {
  const references = [];
  const attributes = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(attributes)) references.push(match[1]);

  const sourceSets = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(sourceSets)) {
    for (const item of match[1].split(',')) {
      const reference = item.trim().split(/\s+/)[0];
      if (reference) references.push(reference);
    }
  }
  return references;
}

function extractIds(html) {
  const ids = new Set();
  const pattern = /\b(?:id|name)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(pattern)) ids.add(match[1]);
  return ids;
}

const files = await walk(outDir);
const fileSet = new Set(files.map(outputPath));
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const htmlByUrl = new Map();
const idsByFile = new Map();

for (const file of htmlFiles) {
  const relative = outputPath(file);
  const html = await readFile(file, 'utf8');
  htmlByUrl.set(pageUrlFor(relative), { file, relative, html });
  idsByFile.set(relative, extractIds(html));
}

const failures = [];
let checkedReferences = 0;
for (const { relative, html } of htmlByUrl.values()) {
  const pageUrl = new URL(pageUrlFor(relative), origin);
  for (const rawReference of extractReferences(html)) {
    if (
      !rawReference ||
      rawReference === '#' ||
      rawReference.startsWith('data:') ||
      rawReference.startsWith('blob:') ||
      rawReference.startsWith('mailto:') ||
      rawReference.startsWith('tel:') ||
      rawReference.startsWith('javascript:') ||
      rawReference.startsWith('//')
    ) {
      continue;
    }

    let resolved;
    try {
      resolved = new URL(rawReference, pageUrl);
    } catch {
      failures.push(`${relative}: invalid URL ${JSON.stringify(rawReference)}`);
      continue;
    }
    if (resolved.origin !== origin) continue;

    checkedReferences += 1;
    const candidates = candidateFiles(resolved.pathname);
    const target = candidates.find((candidate) => fileSet.has(candidate));
    if (!target) {
      failures.push(
        `${relative}: ${JSON.stringify(rawReference)} does not resolve to an exported file`,
      );
      continue;
    }

    if (resolved.hash && target.endsWith('.html')) {
      const fragment = decodeURIComponent(resolved.hash.slice(1));
      if (fragment && !idsByFile.get(target)?.has(fragment)) {
        failures.push(
          `${relative}: ${JSON.stringify(rawReference)} points to missing #${fragment}`,
        );
      }
    }
  }
}

for (const required of [
  '/index.html',
  '/404.html',
  '/robots.txt',
  '/sitemap.xml',
  '/feed.xml',
  '/manifest.webmanifest',
  '/sw.js',
]) {
  if (!fileSet.has(required)) failures.push(`Missing required export: ${required}`);
}

const manifestPath = path.join(outDir, 'manifest.webmanifest');
try {
  JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (error) {
  failures.push(`manifest.webmanifest is invalid JSON: ${error.message}`);
}

const workerPath = path.join(outDir, 'sw.js');
const workerCheck = spawnSync(process.execPath, ['--check', workerPath], {
  encoding: 'utf8',
});
if (workerCheck.status !== 0) {
  failures.push(`sw.js failed syntax validation: ${workerCheck.stderr.trim()}`);
}

if (failures.length > 0) {
  console.error(`Static export validation failed with ${failures.length} problem(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const totalBytes = (
  await Promise.all(files.map(async (file) => (await stat(file)).size))
).reduce((sum, size) => sum + size, 0);
console.log(
  `Validated ${htmlFiles.length} pages, ${checkedReferences} internal references, and ${(totalBytes / 1024 / 1024).toFixed(1)} MB of exported files.`,
);
