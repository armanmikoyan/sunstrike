# Chronolab.ai

A dark-studio generative media interface. Generate cinematic video and stills
from a prompt, pay as you go, and keep every frame.

This is an npm-workspace monorepo. `apps/lab` is the Next.js App Router
frontend, with every route, shell and studio screen built on the demo rows in
`apps/lab/src/mocks`. `apps/engine` is the modular-monolith backend, scaffolded
but not wired, so no live API or database serves the UI yet. Prices, media and
generation results are simulated; types and pure rules live beside the
component that owns them.

The product design is in
[`architecture.excalidraw`](./architecture.excalidraw). Remaining work is in
[`ROADMAP.md`](./ROADMAP.md); the system and rules are in
[`ARCHITECTURE.md`](./ARCHITECTURE.md); how an agent works in this repo is in
[`AGENTS.md`](./AGENTS.md).

## Run

```bash
npm install
npm run dev          # studio at http://localhost:3000
npm run dev:engine   # engine API at http://localhost:4000
npm run build
npm run start -- -p 3131
```

The engine reads `PORT` (default `4000`), `CORS_ORIGIN`, `NODE_ENV`,
`DATABASE_URL` and the Supabase project URL and keys. The web app reads
`SITE_URL`, `ENGINE_URL` and the public Supabase URL and anon key. Both are
configured per app; the demo UI runs without them. The browser only talks to
the web app: `src/app/api` authenticates and forwards to the engine.

Scripts run from the repo root and delegate to the workspace. `typecheck`
covers both apps; lint, tests and e2e run in `apps/lab`.

## Structure

`apps/lab` is the Next.js app; `apps/engine` is the modular-monolith backend.
The browser only calls `src/app/api`, which authenticates and forwards to the
engine. Folder layout, component contract, shared UI and tests live in
[`ARCHITECTURE.md`](./ARCHITECTURE.md); the design board is
[`architecture.excalidraw`](./architecture.excalidraw).

## Brand

The product is **Chronolab.ai**. Brand assets are in `apps/lab/public/brand`;
app icons and the manifest live in `apps/lab/public/favicons` and are
declared through `metadata.icons` in `apps/lab/src/app/layout.tsx`. The nav
orb is a self-contained WebGL element
(`apps/lab/public/brand/violet-orb.js`) with a static poster fallback.
