AvoKind v3.23

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
