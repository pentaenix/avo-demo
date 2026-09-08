import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const siteDir = new URL('../site/', import.meta.url);
const html = await readFile(new URL('index.html', siteDir), 'utf8');
const script = await readFile(new URL('script.js', siteDir), 'utf8');
const errors = [];

try {
  new Function(script);
} catch (error) {
  errors.push(`JavaScript syntax error: ${error.message}`);
}

const expect = (condition, message) => {
  if (!condition) errors.push(message);
};

const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? '';
const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim() ?? '';
const h1Count = (html.match(/<h1\b/gi) || []).length;

expect(title.length >= 30 && title.length <= 70, `SEO title should be 30–70 chars; got ${title.length}.`);
expect(description.length >= 120 && description.length <= 170, `Meta description should be 120–170 chars; got ${description.length}.`);
expect(h1Count === 1, `Expected exactly one H1; found ${h1Count}.`);
expect(/rel="canonical"/i.test(html), 'Missing canonical link.');
expect(/property="og:title"/i.test(html), 'Missing Open Graph title.');
expect(/property="og:description"/i.test(html), 'Missing Open Graph description.');
expect(/"@type"\s*:\s*"Product"/.test(html), 'Missing Product JSON-LD.');
expect(/"@type"\s*:\s*"FAQPage"/.test(html), 'Missing FAQPage JSON-LD.');
expect(/id="ingredients"/.test(html), 'Missing semantic ingredients section.');
expect(/id="nutrition"/.test(html), 'Missing semantic nutrition section.');
expect(/id="faq"/.test(html), 'Missing semantic FAQ section.');
expect(!/href="#"/.test(html), 'Found placeholder href="#" link.');

const ingredientCardCount = (html.match(/data-ingredient-trigger/g) || []).length;
const gallerySlideCount = (html.match(/class="gallery-slide"/g) || []).length;
expect(ingredientCardCount === 12, `Expected 12 ingredient drawer triggers; found ${ingredientCardCount}.`);
expect(gallerySlideCount >= 5, `Expected at least 5 swipeable gallery slides; found ${gallerySlideCount}.`);

const galleryThumbCount = (html.match(/data-gallery-thumb=/g) || []).length;
expect(galleryThumbCount === gallerySlideCount, `Expected one square thumbnail per gallery slide; found ${galleryThumbCount} thumbnails for ${gallerySlideCount} slides.`);
expect(!/data-gallery-prev|data-gallery-next/.test(html), 'Main product gallery should not show previous/next arrow controls.');
expect(/data-gallery-track/.test(html), 'Missing draggable product gallery track.');
expect(/data-size-option="15"/.test(html), 'Missing 15-serving product option.');
expect(/data-size-option="30"/.test(html), 'Missing 30-serving product option.');
expect(/data-ingredient-drawer/.test(html), 'Missing ingredient side drawer.');
expect(!/Best to try/i.test(html), 'Deprecated "Best to try" badge is still present.');
expect(!/✦/.test(html), 'Gemini-like star icon is still present.');

expect(!/data-ingredients-prev|data-ingredients-next/.test(html), 'Ingredient carousel should not show arrow controls.');
expect(/data-drawer-research/.test(html), 'Missing ingredient research section in side drawer.');
expect(/data-drawer-citation/.test(html), 'Missing ingredient research citation link.');
expect(!/preview copy|concept page|concept pdp|mock cart|source of truth|final shopify|claimed by avokind/i.test(html + script), 'User-visible mock/implementation language is still present.');

expect(/id="ingredients-heading">Natural Ingredients<\/h2>/.test(html), 'Ingredients heading should be exactly "Natural Ingredients".');
expect(!/Natural Ingredients, Clearly Explained/i.test(html), 'Old LLM-sounding ingredients heading is still present.');
expect(/LOGO_WHITE\.png/.test(html), 'Header should use the live AvoKind shop logo asset.');
for (const route of ['/collections/all', '/pages/ingredients', '/pages/benefits', '/pages/recipes', '/pages/faq', '/pages/about-us', '/pages/contact']) {
  expect(html.includes(`https://avokind.com${route}`), `Missing live-shop header route: ${route}`);
}
expect(script.includes("'Pineapple':") && script.includes("'Basil':"), 'Ingredient research data is incomplete.');
expect((script.match(/https:\/\/doi\.org\//g) || []).length >= 12, 'Expected at least 12 DOI-backed ingredient research citations.');
expect(script.includes('galleryCount + 1') && script.includes('normalizeGalleryLoop'), 'Product gallery loop logic is missing.');
expect(script.includes('ingredientLoopWidth'), 'Ingredient carousel loop logic is missing.');
expect(script.includes("galleryTrack.style.scrollBehavior = 'auto'") && script.includes('hardJumpGallery'), 'Gallery loop boundary must jump instantly instead of animating across the full gallery.');
expect(script.includes("event.target.closest('[data-ingredient-trigger]')"), 'Ingredient drag handling must preserve + button clicks.');

for (const localRef of ['./styles.css', './script.js']) {
  const filePath = new URL(localRef, new URL('index.html', siteDir));
  try {
    await stat(filePath);
  } catch {
    errors.push(`Missing local asset: ${localRef}`);
  }
}

try { await stat(new URL('./assets/pineapple.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: pineapple.png'); }

try { await stat(new URL('./assets/nopal.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: nopal.png'); }

try { await stat(new URL('./assets/green-apple.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: green-apple.png'); }

try { await stat(new URL('./assets/cucumber.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: cucumber.png'); }

try { await stat(new URL('./assets/spinach.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: spinach.png'); }

try { await stat(new URL('./assets/celery.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: celery.png'); }

try { await stat(new URL('./assets/avocado.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: avocado.png'); }

try { await stat(new URL('./assets/cilantro.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: cilantro.png'); }

try { await stat(new URL('./assets/ginger.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: ginger.png'); }

try { await stat(new URL('./assets/turmeric.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: turmeric.png'); }

try { await stat(new URL('./assets/mint.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: mint.png'); }

try { await stat(new URL('./assets/basil.png', new URL('index.html', siteDir))); } catch { errors.push('Missing ingredient asset: basil.png'); }

const allFiles = await readdir(siteDir);
expect(allFiles.includes('robots.txt'), 'Missing robots.txt.');
expect(allFiles.includes('sitemap.xml'), 'Missing sitemap.xml.');

if (errors.length) {
  console.error('AvoKind preview quality checks failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('AvoKind preview quality checks passed.');
console.log(`Title length: ${title.length}`);
console.log(`Description length: ${description.length}`);
console.log(`H1 count: ${h1Count}`);
