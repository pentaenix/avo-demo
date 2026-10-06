AvoKind prototype v3.45

Added a Home social-proof block between the ingredient carousel and the “About thirty seconds” routine introduction. The layout mirrors the supplied three-column review reference while using AvoKind’s Manrope / STIX Two Text / Roboto Mono typography, brand green stars, and existing verified review copy from the product page.

AvoKind prototype v3.43

Rebuilt the Home ingredient carousel as a transform-driven continuous belt. It now uses sub-pixel GPU-composited motion, restrained inertial dragging, a short rest after interaction, eased return to the user’s last drag direction, horizontal trackpad support, and subtle edge masking. Ingredient detail drawers pause the belt until they are closed.

AvoKind prototype v3.40

Fixed the ingredient carousel autoplay implementation. The rail now visibly drifts to the right on load, remains draggable with mouse/touch, pauses for 2.2 seconds after interaction, then resumes in the last visual drag direction. Horizontal trackpad movement also updates the resume direction. Reduced-motion preferences still disable autoplay while preserving manual interaction.

AvoKind prototype v3.39

Rewrote the Home ingredient-carousel copy to be more concrete and product-specific. Added slow continuous carousel motion to the right; manual dragging pauses the motion briefly, then autoplay resumes in the direction the visitor last dragged. Reduced-motion preferences disable autoplay while preserving manual interaction.

AvoKind prototype v3.38

Restored the four-fact banner directly beneath the Home hero and removed the larger product-feature block that followed it. Preserved the v3.37 lighter hero headline weight and all other responsive hero refinements.

AvoKind prototype v3.37

Matched the Home hero title to the lighter Manrope display treatment used in the following content section by reducing the headline weight from 600 to 500, without changing its responsive sizing or intentional three-line structure.

AvoKind prototype v3.35

Refined the Home hero headline for responsive clarity: slightly smaller display type, three intentional phrase lines, and viewport scaling that preserves “A whole-food / smoothie powder. / Ready in 30 seconds.” instead of allowing awkward browser-balanced fragments.

AvoKind prototype v3.34

Rebuilt the Home hero around the approved AvoKind product-preparation image: full-width static media, left-side clarity copy, three product-definition bullets, and direct purchase/ingredients actions.

AvoKind prototype v3.33

Full-bleed static home hero restored: real product-preparation photography, clarity-first headline, subtitle, three facts, and purchase CTA.

AvoKind v3.27

# AvoKind prototype v3.19

Static multi-page AvoKind design prototype, prepared to deploy automatically with GitHub Pages.

## Pages

- `site/index.html` — Home
- `site/shop.html` — Shop / Green Boost PDP
- `site/benefits.html` — Benefits
- `site/recipes.html` — Recipes
- `site/about.html` — About Us (footer navigation)
- `site/contact.html` — Contact (footer navigation)
- `site/faq.html` — FAQ (footer navigation)
- `site/blog.html` — Searchable AvoKind Journal index
- `site/blog/benefits-of-avocado.html` — first SEO/GEO article

## Local preview

```bash
./run
```

Then open `http://localhost:8080`.

## Validation

```bash
node scripts/check.mjs
```

## GitHub Pages

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, validates the static site, uploads `site/`, and deploys it with GitHub Pages. Relative site links remain compatible with a project path such as `https://<owner>.github.io/avo-demo/`.

## Footer / company architecture

The primary header remains intentionally small: Shop / Benefits / Recipes. Company and support routes live in the tall dark-green footer: About Us, Blog, Contact, FAQ, Reviews and Freeze-drying. The footer is approximately 82svh on desktop and uses `site/assets/footer-waves.svg` as a quiet wave field.

## Blog / SEO / GEO

The first article is written as an answer-first explainer for the query “what are the benefits of avocado?” and includes:

- semantic article headings and plain-language answer blocks
- `BlogPosting` JSON-LD
- question/answer structured data
- source links to USDA, NIH and PubMed
- crawlable HTML rather than client-only article rendering
- RSS (`site/feed.xml`)
- sitemap (`site/sitemap.xml`)
- `site/llms.txt` as an additional machine-readable content map
- local search on `site/blog.html` via `site/blog.js`

### Adding another article

1. Duplicate `site/blog/benefits-of-avocado.html` and rename it with a descriptive, human-readable slug.
2. Replace the title, meta description, visible article, dates, `BlogPosting` JSON-LD and FAQ structured data.
3. Add a crawlable card to `site/blog.html` with descriptive `data-search` terms.
4. Add the new URL to `site/feed.xml`, `site/sitemap.xml`, and `site/llms.txt`.
5. Run `node scripts/check.mjs`.

The current sitemap uses the intended production base `https://avokind.com/`. If final production routes differ from these static filenames, update the sitemap/canonical strategy during the production integration rather than copying prototype URLs blindly.

## v3.19

Added footer-only About, Blog, Contact and FAQ routes based on the live AvoKind information architecture; rebuilt the footer as a much taller dark-green destination with a wave pattern; and added the initial searchable, structured-data-ready AvoKind Journal article architecture.


## Journal / blog system (v3.23)

The Journal ships with 10 static, crawlable articles in `site/blog/`. Each article has:
- a unique title and meta description
- a production canonical URL on `https://avokind.com/blog/...`
- AvoKind organization authorship and a real publication date
- answer-first copy, key takeaways, visible FAQs and source links
- `BlogPosting`, `BreadcrumbList`, and `FAQPage` JSON-LD
- direct research / government sources and an explicit brand disclosure
- a copy-ready APA 7 citation for the AvoKind article itself
- internal links to related Journal pages

`site/blog.html` contains static cards so search engines can crawl the article links even with JavaScript disabled; `blog.js` only adds client-side filtering. `sitemap.xml`, `feed.xml`, and `llms.txt` list all 10 articles.

### Adding another article
Create another static HTML file in `site/blog/` by copying an existing article and update the canonical, metadata, visible date, schema, sources, and APA citation. Then add a static card to `site/blog.html` and add the canonical URL to `sitemap.xml`, `feed.xml`, and `llms.txt`. Keep claims matched to the exact form/dose studied and do not turn ingredient evidence into a Green Boost clinical claim.


## v3.23 interaction polish
- The homepage preparation film now uses a short sticky hold while Scoop / Stir / Enjoy remain native scrolling content.
- Playback is still semantic and directional: scrolling selects a stage; the film plays smoothly toward it rather than scrubbing raw frames.
- The footer is shorter on wide displays and its dark-green top boundary is now a true filled wave rather than a rectangular block with decorative lines.


## v3.23 repair
- Replaced the fragile canvas frame routine with native forward/reverse MP4 playback.
- Prevented horizontal page drift and hardened the routine layout at laptop widths.
- Moved the wave to the actual top edge of the Home closing section and merged the CTA/footer into one continuous dark-green field.


## v3.24 routine playback fix
The three-step Home routine now uses short animated WebP sequences instead of scripted MP4 playback. This removes browser autoplay/play() permission as a failure mode while keeping forward and reverse semantic steps.

## v3.25 routine micro-scenes
The Home preparation demo is now three independent, purpose-edited clips: Scoop, Stir, and Enjoy. Scroll only selects the active step; each clip plays once at native speed and holds its final frame. Fast scrolling can skip directly to the relevant step instead of scrubbing or queueing a long timeline. Native H.264 MP4 is the primary path with an animated WebP fallback for playback failures. The section remains normal-flow content with no sticky scroll lock.


## v3.27

Simplified the Home preparation section to normal media playback. The full preparation film now plays once when roughly 42% of the section is visible, then holds on its final frame. The section no longer scrubs, swaps clips, reverses playback, sticks to the viewport, or maps scroll distance to media time. Scoop / Stir / Enjoy remain static explanatory copy beside the film. The prepared film is a 1280×720 H.264/yuv420p MP4 with fast-start metadata for predictable web playback.


## v3.27
Rebuilt `benefits.html` as the `Why AvoKind` decision page. The primary navigation reads Shop / Benefits / Recipes; the Benefits page keeps the internal “Why AvoKind” framing. The page separates product facts, formulation rationale, ingredient research, process tradeoffs, routine fit, taste expectations, and evidence boundaries.

## v3.29 refinement

- Recipes: removed the dark "No blender required" interlude and replaced the dark closing block with a light endcap.
- Footer: retained a single green boundary wave and removed decorative contour lines; increased footer body-copy contrast.
- Shop: repaired the freeze-drying stat layout and integrated the 88% recommendation statistic into the review summary; removed visible demo-review copy.
- Home: centered the reviews and recipes sections, replaced the "Your Boost, Your Way" composite with a real AvoKind lifestyle image, and repaired ingredient + controls across looped carousel items.
- Cart: added a reusable cart drawer on all pages with line item, quantity controls, remove, subtotal, and checkout UI. Shop selections now populate the cart.

## v3.31 hero clarity pass

- Rebuilt the Home hero around first-visit comprehension rather than brand mood.
- Headline now identifies Green Boost as a whole-food smoothie powder and states the ~30-second preparation time.
- Added a direct subtitle and three product-definition bullets.
- Added the supplied landscape film as muted looping atmosphere on the right side of the hero.
- Kept the real Green Boost product visible as a separate product layer rather than asking the video to depict packaging.
- Added a static poster/reduced-motion fallback.


## v3.45
- Replaced all 12 ingredient image assets with the new warm editorial photography set.
- Green apple replaces the rejected red-apple generation; no duplicate legacy ingredient images are retained.

- v3.46: Made ingredient cards taller / more portrait-oriented and moved ingredient names into a frosted glass overlay pill on the image, with a more polished plus button treatment on both the homepage and shop ingredient carousels.

- v3.47: Removed rounded ingredient card corners and changed the label treatment to a full-width straight-edged bottom band; also aligned testimonial metadata rows in the “What People Are Saying” block.

- v3.48: Reduced ingredient bottom-band height by about 25% and softened the plus action so it no longer competes with the photography or ingredient name.

- v3.49: Removed the homepage “About thirty seconds” preamble, Scoop/Stir/Enjoy routine section, and the older taste/texture review promo block. The newer “What People Are Saying” section remains.

- v3.50: Rebuilt the homepage “More than one way to use it” feature around the new sunlit whole-food image, with the heading, copy, and Recipes CTA kept as live HTML/CSS on the image’s open right-hand side.

- v3.51: Reworked the “Your Boost, your way” section so the image is the block (no framed border/padding) and repositioned the live text into the open right side to avoid overlapping the food cluster.

- v3.52: Fixed the recipe-section wave to overlay the image instead of sitting in a pale strip, and moved the recipe copy deeper into the true right-side negative space so it no longer collides with the food cluster.

- v3.53: Nudged the “Your Boost, your way” copy block further right and slightly upward so it clears the cilantro cluster and uses the negative space more cleanly.

- v3.54: Nudged the “Your Boost, your way” copy slightly further right and upward for cleaner use of the negative space.
