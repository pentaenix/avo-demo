#!/usr/bin/env bash
set -euo pipefail

REPO="avo-demo"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required: https://cli.github.com/"
  exit 1
fi

gh auth status >/dev/null
OWNER="$(gh api user --jq .login)"

if [ ! -d .git ]; then
  git init -b main
else
  git branch -M main
fi

git add .
if ! git diff --cached --quiet; then
  git commit -m "AvoKind Green Boost demo"
fi

if ! gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin
else
  if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "https://github.com/$OWNER/$REPO.git"
  else
    git remote add origin "https://github.com/$OWNER/$REPO.git"
  fi
fi

if gh api "repos/$OWNER/$REPO/pages" >/dev/null 2>&1; then
  gh api --method PUT "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null
else
  gh api --method POST "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null
fi

git push -u origin main

echo
echo "GitHub Pages deployment started."
echo "Share this URL once the Deploy AvoKind Demo workflow finishes:"
echo "https://$OWNER.github.io/$REPO/"
