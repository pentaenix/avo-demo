# AvoKind Green Boost demo

Static frontend demo of the Green Boost product page. No build step or runtime dependencies are required.

## Included

- Responsive product page
- Mouse/touch product gallery with square thumbnail navigation
- 15- and 30-serving size options
- 1/2/3-pouch quantity options
- One-time and flexible subscription interactions
- Looping, draggable ingredient carousel
- Ingredient research drawers with cited sources
- Product and FAQ structured data
- Review-safe `noindex` configuration
- GitHub Pages deployment workflow
- Frontend/SEO validation workflow

## Local preview

```bash
python3 -m http.server 8080 -d site
```

Open `http://localhost:8080`.

Run validation with:

```bash
node scripts/check.mjs
```

## Publish as `avo-demo`

You need Git and the GitHub CLI (`gh`) authenticated once with `gh auth login`.

From this folder, run:

```bash
./publish.sh
```

The script creates or updates the public `avo-demo` repository, enables GitHub Pages with GitHub Actions, pushes `main`, and prints the URL to share. The deployment is handled by `.github/workflows/deploy-pages.yml`.
