# AvoKind prototype

Static multi-page AvoKind design prototype, prepared to deploy automatically with GitHub Pages.

## Pages

- `site/index.html` — Home
- `site/shop.html` — Shop / Green Boost PDP
- `site/benefits.html` — Benefits
- `site/recipes.html` — Recipes

## Local preview

```bash
./run
```

Then open `http://localhost:8080`.

Or run directly:

```bash
python3 -m http.server 8080 -d site
```

## Validation

```bash
node scripts/check.mjs
```

## GitHub Pages

The repository is ready for the existing `avo-demo` workflow model. Pushing to `main` runs `.github/workflows/deploy-pages.yml`, validates the static site, uploads the `site/` directory, and deploys it with GitHub Pages.

If GitHub Pages on the repository is already configured to use **GitHub Actions**, replacing the repository contents with this codebase and pushing to `main` is enough.

If Pages is not yet enabled, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions** once.

The site uses relative URLs so it works correctly at a project URL such as `https://<owner>.github.io/avo-demo/`.
