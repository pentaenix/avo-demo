import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const pages = ['index.html', 'shop.html', 'benefits.html', 'recipes.html'];
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

async function exists(path) { try { await stat(path); return true; } catch { return false; } }

for (const page of pages) {
  const path = join(root, page);
  expect(await exists(path), `Missing page: site/${page}`);
  if (!(await exists(path))) continue;
  const html = await readFile(path, 'utf8');
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  expect(h1Count === 1, `${page}: expected exactly one H1; found ${h1Count}.`);
  expect(/<meta\s+name=["']viewport["']/i.test(html), `${page}: missing viewport meta.`);
  expect(!/href=["']#["']/i.test(html), `${page}: found placeholder href="#".`);
  expect(!/(src|href)=["']\/(?!\/)/i.test(html), `${page}: root-absolute asset/link will break under /avo-demo/ GitHub Pages.`);

  const refs = [...html.matchAll(/(?:src|href)=["'](\.\/?[^"'#?]+)["']/gi)].map(m => m[1]);
  for (const ref of refs) {
    const cleaned = ref.replace(/^\.\//, '');
    const target = join(root, cleaned);
    expect(await exists(target), `${page}: missing local reference ${ref}`);
  }
}

for (const scriptName of ['site.js', 'shop.js']) {
  const path = join(root, scriptName);
  expect(await exists(path), `Missing script: site/${scriptName}`);
  if (await exists(path)) {
    const js = await readFile(path, 'utf8');
    try { new Function(js); } catch (error) { errors.push(`${scriptName}: JavaScript syntax error: ${error.message}`); }
  }
}

for (const file of ['brand.css', 'shop-base.css', '.nojekyll', '404.html', 'robots.txt']) {
  expect(await exists(join(root, file)), `Missing deployment file: site/${file}`);
}

const assetsDir = join(root, 'assets');
expect(await exists(assetsDir), 'Missing site/assets directory.');
if (await exists(assetsDir)) {
  const assets = await readdir(assetsDir);
  expect(assets.includes('routine-scroll-poster.jpg'), 'Missing routine sequence poster.');
  expect(assets.includes('routine-frames'), 'Missing scroll-controlled routine frame sequence.');
  const framesDir = join(assetsDir, 'routine-frames');
  if (await exists(framesDir)) {
    const frames = (await readdir(framesDir)).filter(name => /^frame_\d{3}\.webp$/.test(name));
    expect(frames.length === 130, `Expected 130 routine frames; found ${frames.length}.`);
  }
  expect(assets.includes('avokind-wordmark-clean.png'), 'Missing AvoKind wordmark.');
}

if (errors.length) {
  console.error('AvoKind static-site checks failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('AvoKind static-site checks passed.');
console.log(`Pages: ${pages.join(', ')}`);
