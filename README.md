# Chronolab.ai

A dark-studio generative media interface. Generate cinematic video and stills
from a prompt, pay as you go, and keep every frame.

This is an npm-workspace monorepo. `apps/lab` is the Next.js App Router
frontend with local demo data and an optional Supabase Auth sign-in — no live
API or database yet. Browsing the studio, library and assets stays open to
signed-out visitors; generating asks for an account, and account settings are
private. `apps/engine` is the modular-monolith backend, scaffolded
but not wired. Prices, media and generation results are still simulated in
`apps/lab/src/mocks`; types and pure rules live beside the component that owns
them.

The UI is modelled on the high-level design contract: six entities, the
`/api/v1` surface and the generation user flow. What is left before real users, real cards and real
renders is tracked in [`ROADMAP.md`](./ROADMAP.md), mapped to the design's
functional and non-functional requirements.

## Run

```bash
npm install
npm run dev          # studio at http://localhost:3000
npm run dev:engine   # engine API at http://localhost:4000
npm run build
npm run start -- -p 3131
```

The engine reads `PORT` (default `4000`), `CORS_ORIGIN` (comma-separated,
defaults to `http://localhost:3000`) and `NODE_ENV` (`development` unless set).
Copy `apps/engine/.env.example` to `apps/engine/.env` and
`apps/lab/.env.example` to `apps/lab/.env.local`, then fill the Supabase project
URL and anon key to turn sign-in on; without them the studio stays browsable and
`/login` explains what is missing.

Scripts run from the repo root and delegate to the workspace. `typecheck`
covers both apps; lint, tests and e2e run in `apps/lab`.

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

- `apps/lab` — the Next.js frontend; every path below is relative to it.
- `apps/engine` — the Express backend and generation worker, scaffolded in
  `src/`; its modules own generation, billing, catalog, media, templates,
  notifications and auth.
- `src/app` — metadata, root layout, the client shell (`shell.tsx`: rail and
  top nav) and runtime wiring (`providers.tsx`). The root layout mounts the
  shell once; `(website)` adds `<main>` and the site footer, `(workspace)` adds
  `<main>` only, and `AppShell` renders `/login` with no chrome. Group names
  never affect URLs. Each `page.tsx` composes its route component and exports
  `metadata` where the route has one, so markup, styles and chrome come from
  the component and the layout.
- `src/components/<feature>` — one folder per product feature and per route
  surface (`home`, `library`, `pricing`, …). Each file has one job:
  `index.tsx` is the feature's main component and its logic, never a sibling
  named after the feature; `types.ts` every named type, `constants.ts` every
  named constant in `UPPER_SNAKE_CASE`, `utils.ts` every reusable function,
  `state.ts` every Jotai atom, and `hooks.ts` stateful logic. Private parts
  stay in the folder too. One type per shape: reuse it through `Pick`, `Omit`,
  an intersection or a shared prop type instead of redeclaring the same props.
  Tests sit beside the module they cover (`index.test.tsx`, `utils.test.ts`).
- `src/ui` — shadcn primitives, a sibling of `src/components`; keep their layout.
- `src/app/auth` — server-only auth: the Supabase service, HTTP helpers,
  routes, env and server client, plus the proxy session refresh.
- `src/mocks` — the demo rows the UI renders today (`generation`, `media`,
  `templates`, `notifications`, `pricing`) plus their lookups and tests. This
  is the seam to replace with `/api/v1` data.
- `src/e2e` — Playwright specs and helpers, beside the code they cover.
- `vitest.setup.tsx` at the studio root — the shared test setup (framework
  mocks, router state, `renderWithProviders`); unit and component tests are
  colocated.
- `public` — every static asset: brand art, favicons and local media.

Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) before changing structure, routes,
state, the design system or the brand. Project-specific design rules live in
[`AGENTS.md`](./AGENTS.md).

## Brand

The product is **Chronolab.ai**. Brand assets are in `apps/lab/public/brand`;
app icons and the manifest live in `apps/lab/public/favicons` and are
declared through `metadata.icons` in `apps/lab/src/app/layout.tsx`. The nav
orb is a self-contained WebGL element
(`apps/lab/public/brand/violet-orb.js`) with a static poster fallback.

Local media in `apps/lab/public/media` and `movs/` is gitignored. Do not
commit it.
