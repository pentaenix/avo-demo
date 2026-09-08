# Shopify SEO + GEO implementation notes

This mock is deliberately structured so the approved design can be translated into Shopify sections without changing the content model.

## Production SEO mapping

- Keep one product H1.
- Render title, description, canonical, Open Graph image, price, currency, availability, product images, and variant data from Shopify rather than hardcoding them.
- Keep the concise answer to **What is AvoKind Green Boost?** high on the page. It gives search engines and AI systems a plain-language entity definition.
- Keep ingredients, preparation, taste, nutrition, storage, caffeine, dietary information, and FAQ as visible HTML text rather than image-only content.
- Keep descriptive `alt` text for informative images. Decorative images should use empty alt text.
- Product schema should be generated from current product/variant data. Add `aggregateRating` only when backed by real review data exposed on the page.
- FAQ schema must match visible FAQ content.
- Preserve internal links to Ingredients, Benefits, Recipes, FAQ, and About Us.

## Review environment vs production

The GitHub Pages preview intentionally uses:

- `meta robots="noindex,nofollow"`
- a `robots.txt` that disallows crawling
- the live AvoKind product page as the canonical URL

This prevents a review mock from becoming a duplicate search result. Remove the `noindex` safeguard only when the design is implemented on the real Shopify storefront.

## GEO principles used here

- Direct product definition near the top.
- Specific numbers with units: 12 ingredients, 30 servings, 10g serving size, 40 calories, 30-second prep.
- Clear lists of ingredients and dietary attributes.
- Short question-and-answer sections using shopper language.
- Avoidance of vague benefit claims where a concrete product fact is available.
- No invented review counts, scarcity, subscriptions, discounts, awards, or scientific claims.
