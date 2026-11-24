# Chronolab.ai

A dark-studio generative media interface. Generate cinematic video and stills
from a prompt, pay as you go, and keep every frame.

This is an npm-workspace monorepo. `apps/lab` is the Next.js App Router
frontend, with every route, shell and studio screen built on the demo rows in
`apps/lab/src/mocks`. `apps/engine` is the modular-monolith backend. The rest of
the API is scaffolded, so no live product data serves the UI yet; prices, media
and generation results are simulated.

Start with [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the repository shape and
rules, [`ROADMAP.md`](./ROADMAP.md) for remaining work,
[`architecture.excalidraw`](./architecture.excalidraw) for the product design,
and [`AGENTS.md`](./AGENTS.md) for agent workflow.

## Run

```bash
npm install
npm run dev          # studio at http://localhost:3000
npm run dev:engine   # engine API at http://localhost:4000
npm run build
npm run start -- -p 3131
```

Copy each app's `.env.example` to its local env file and fill in what you need.
The demo UI browses without configuration; sign-in needs the engine and its
Supabase project. Supabase lives only in the engine: the browser never sees its
URL or key.

### Database

The engine owns the schema. Migrations live in
`apps/engine/src/infrastructure/supabase/migrations` and run against
`DATABASE_URL` from `apps/engine/.env`.

```bash
npm run db:migrate    # apply pending migrations
```

Applied files are recorded in `public.schema_migrations`, so `db:migrate` is
safe to re-run. Migrations are forward-only: add a new file rather than editing
one that has already been applied.

Scripts run from the repo root and delegate to the workspace. `typecheck` and
`lint` cover both apps; unit tests, coverage and e2e run in `apps/lab`.

## Structure

`apps/lab` is the Next.js app; `apps/engine` is the modular-monolith backend.
The lab reaches the engine through its server-side BFF and imports no Supabase
package.

Folder layout, component contract, shared UI and tests live in
[`ARCHITECTURE.md`](./ARCHITECTURE.md); the design board is
[`architecture.excalidraw`](./architecture.excalidraw).

## Brand

The product is **Chronolab.ai**. Brand assets are in `apps/lab/public/brand`;
app icons and the manifest live in `apps/lab/public/favicons` and are declared
through `metadata.icons` in `apps/lab/src/app/layout.tsx`. The nav orb is a
self-contained WebGL element (`apps/lab/public/brand/violet-orb.js`) with a
static poster fallback.
