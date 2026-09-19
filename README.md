# AvoKind prototype v3.17

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


## v3.13 scroll-film polish

The Home preparation film now uses semantic scroll stages (Scoop / transition / Stir / Enjoy), faster travel, stage-aware text timing, a responsive spring with light inertia, subtle magnetic resting frames, and a sub-1% cinematic scale pulse during each action.


## v3.14 scroll routine
The homepage product film is split into three explicit scroll chapters: 01 Scoop, 02 Stir, and 03 Enjoy. Each action has its own scroll range and a short held frame between stages, so the sequence reads as three steps rather than one continuous scrub.


## v3.15 integrated scroll routine
The preparation demo now uses a smaller sticky film beside three normal-flow text chapters. Scoop, Stir, and Enjoy move naturally with page scroll while the same scroll position directly drives the video. The film no longer dominates the viewport, and the active chapter is indicated only with a subtle opacity change.


## v3.17 smooth scroll renderer
The preparation demo now renders from a compact 130-frame WebP sequence on canvas instead of repeatedly seeking an MP4. Adjacent source frames are blended at the browser refresh rate, and large scroll jumps are caught up over a short bounded interval. This keeps fast wheel and trackpad movement responsive without the visible seek-choppiness of the previous implementation. The sequence is warmed in the background before the visitor reaches the routine section.


### v3.17
The Home preparation scrollytelling block is now compact: its desktop height is governed by the video itself, with the three text steps fitting alongside it rather than creating several viewport-heights of page length.
