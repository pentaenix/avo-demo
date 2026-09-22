import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
async function exists(path) { try { await stat(path); return true; } catch { return false; } }
async function walk(dir) { const out=[]; for (const name of await readdir(dir)) { const p=join(dir,name); const s=await stat(p); if(s.isDirectory()) out.push(...await walk(p)); else out.push(p); } return out; }
const allFiles = await walk(root);
const pages = allFiles.filter(p=>extname(p)==='.html');
for (const path of pages) {
  const page = relative(root,path);
  const html = await readFile(path,'utf8');
  const h1Count=(html.match(/<h1\b/gi)||[]).length;
  expect(h1Count===1,`${page}: expected exactly one H1; found ${h1Count}.`);
  expect(/<meta\s+name=["']viewport["']/i.test(html),`${page}: missing viewport meta.`);
  expect(!/href=["']#["']/i.test(html),`${page}: found placeholder href="#".`);
  expect(!/(src|href)=["']\/(?!\/)/i.test(html),`${page}: root-absolute asset/link will break under /avo-demo/ GitHub Pages.`);
  const refs=[...html.matchAll(/(?:src|href)=["']((?:\.\.?\/)[^"'#?]+)["']/gi)].map(m=>m[1]);
  for(const ref of refs){ const target=join(dirname(path),ref); expect(await exists(target),`${page}: missing local reference ${ref}`); }
}
for (const scriptName of ['site.js','shop.js','blog.js']) { const path=join(root,scriptName); expect(await exists(path),`Missing script: site/${scriptName}`); if(await exists(path)){ const js=await readFile(path,'utf8'); try{new Function(js);}catch(error){errors.push(`${scriptName}: JavaScript syntax error: ${error.message}`);} } }
for (const file of ['brand.css','shop-base.css','.nojekyll','404.html','robots.txt','sitemap.xml','feed.xml','llms.txt','about.html','contact.html','faq.html','blog.html','blog/benefits-of-avocado.html','blog/what-is-nopal.html','blog/does-freeze-drying-preserve-nutrients.html','blog/dietary-fiber-benefits.html','blog/are-smoothies-healthy.html','blog/benefits-of-spinach.html','blog/ginger-benefits.html','blog/turmeric-benefits.html','blog/fat-soluble-vitamins-and-dietary-fat.html','blog/added-sugar-vs-natural-sugar.html']) expect(await exists(join(root,file)),`Missing deployment file: site/${file}`);
const blogPages=pages.filter(p=>relative(root,p).startsWith('blog/')); expect(blogPages.length===10,`Expected 10 Journal articles; found ${blogPages.length}.`);
const assetsDir=join(root,'assets'); expect(await exists(assetsDir),'Missing site/assets directory.');
if(await exists(assetsDir)){ const assets=await readdir(assetsDir); expect(assets.includes('footer-waves.svg'),'Missing footer wave pattern.'); expect(assets.includes('closing-wave.svg'),'Missing Home closing wave.'); expect(assets.includes('avokind-wordmark-clean.png'),'Missing AvoKind wordmark.'); const routineDir=join(assetsDir,'routine'); expect(await exists(routineDir),'Missing routine media.'); if(await exists(routineDir)){ expect(await exists(join(routineDir,'routine-full.mp4')),'Missing routine playback video.'); expect(await exists(join(routineDir,'routine-poster.jpg')),'Missing routine poster.'); } }
if(errors.length){ console.error('AvoKind static-site checks failed:\n'); for(const error of errors)console.error(`- ${error}`); process.exit(1);}
console.log('AvoKind static-site checks passed.'); console.log(`Pages: ${pages.map(p=>relative(root,p)).join(', ')}`);
