# Hold & Fit: a clickable prototype for reducing ASOS wedding-dress returns

Student concept prototype for an HBS product-management exercise (ASOS bridal returns case).
Not affiliated with or endorsed by ASOS. Photos: Unsplash.

**Live demo:** https://amaiaaguilar1-create.github.io/ASOS-case/

## The idea

Brides order about three wedding dresses to keep one, so about 70% of bridal units come back. Hold & Fit changes two behaviours:

1. **Send one at a time.** At checkout the pre-selected option sends her favourite now and keeps her size in the others for 21 days. She only pays for a dress when it ships, and the next one arrives next day when she asks. "All 3 now" is one tap away.
2. **Fix, don't refund.** When a dress arrives we ask "Is it the one?". If it's nearly right, she can keep it with £40 towards alterations instead of sending it back.

Per 100 brides: 300 dresses shipped → 245, 210 returned → 152, return rate 70% → 62%.

## Using the demo

The left panel jumps to any step of the main path (browse → product page → bag → checkout → order status → delivery notification → "Is it the one?" → keep / fix the fit / next dress) and to the other cases (wedding in under 4 weeks, size can't be kept, no partner tailor nearby, all 3 now). State lives in the browser only; there is no backend.

## Running it

```bash
npm install
npm run dev      # local dev server
npm test         # 20 unit tests for the delivery, payment and undo rules
```

Build the static GitHub Pages version (served under `/ASOS-case/`):

```bash
GITHUB_PAGES=true npm run build   # output in dist/client
```

Pushing to `main` builds, tests and deploys to GitHub Pages via `.github/workflows/pages.yml`.

## Code map

- `src/proto/` — the prototype: screens, bottom sheets, state store, rules (payment, holds, undo) and tests
- `src/routes/` — TanStack Start routes (single page)
- `src/components/ui/` — shadcn/ui components that came with the Lovable scaffold (not used by the prototype)

Built with Lovable (TanStack Start, React 19, Tailwind CSS 4).
