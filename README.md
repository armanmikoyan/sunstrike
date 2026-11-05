# Chronolab.ai

A dark-studio generative media interface. Generate cinematic video and stills
from a prompt, pay as you go, and keep every frame.

This is a single Next.js App Router app with local demo data — no backend,
database or auth. Prices, media and generation results are simulated in
`src/lib`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start -- -p 3131
```

## Verify

```bash
npm run typecheck
npm run lint
npm test                 # Vitest: unit + component
npm run test:coverage
npm run test:e2e         # Playwright; builds on :3100
npm run check            # typecheck + lint + coverage
```

## Structure

- `src/app` — metadata, root layout, the client shell (`shell.tsx`: rail and
  top nav) and runtime wiring (`providers.tsx`). Two route groups pick the
  chrome: `(website)` composes the shell with `<main>` and the site footer,
  `(workspace)` composes it without the footer, and `/login` sits outside both
  with no chrome. Group names never affect URLs. Each `page.tsx` only exports
  metadata and renders its route component, so pages never own markup, styles
  or chrome.
- `src/components/<feature>` — one folder per product feature and per route
  surface (`home`, `library`, `pricing`, …). The entry point `index.tsx` owns
  the markup, styles and composition; supporting files are `constants.ts`,
  `hooks.ts`, `state.ts`, `types.ts` and private parts. All visible copy lives
  in `constants.ts`. Tests sit beside the file they cover (`index.test.tsx`,
  `hooks.test.ts`).
- `src/ui` — shadcn primitives, a sibling of `src/components`; keep their layout.
- `src/lib/<name>/` — one folder per library (`media`, `pricing`, `generation`,
  `utils`) with `index.ts` and a colocated `index.test.ts`.
- `src/e2e` — Playwright specs, beside the code they cover.
- `vitest.setup.tsx` at the repo root — the only shared test file (framework
  mocks, router state, `renderWithProviders`). There is no test directory;
  unit and component tests are colocated.
- `public` — every static asset: brand art, favicons and local media.

Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) before changing structure, routes,
state, the design system or the brand. Project-specific design rules live in
[`AGENTS.md`](./AGENTS.md).

## Brand

The product is **Chronolab.ai**. Brand assets are in `public/brand`; app icons
and the manifest live in `public/favicons` and are declared through
`metadata.icons` in `src/app/layout.tsx`. The nav orb is a self-contained
WebGL element (`public/brand/violet-orb.js`) with a static poster fallback.

Local media in `public/media` and `movs/` is gitignored. Do not commit it.
