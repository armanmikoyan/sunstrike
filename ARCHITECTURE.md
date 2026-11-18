# Chronolab.ai Architecture

Chronolab.ai is a dark-studio generative media interface: a marketing home, an
image/video studio, an explore feed, a library, account and billing screens.
The repo is an npm-workspace monorepo. `apps/lab` is the Next.js App Router
frontend; `apps/engine` is the Express modular monolith behind `/api/v1`. The UI
still renders demo data from `src/mocks` until `UI-1`.

The product is modelled on one contract: the high-level design's seven
entities, `/api/v1` surface and user flow. The UI keeps the subset it renders,
declared beside the component that owns it, so a screen cannot invent a field
that the contract does not have. `ROADMAP.md` maps every remaining ticket to
`F1`–`F5` and `N1`–`N4`.

The product name is **Chronolab.ai**, always. Models are named
`Chronolab <Name>` and account addresses use `@chronolab.ai`. The previous
brand name is retired and lives only in git history.

Unless stated otherwise, `src/...` paths in this document are relative to
`apps/lab/`; `apps/engine/src/...` names the backend.

## Stack

| Layer       | Choice                                                                |
| ----------- | --------------------------------------------------------------------- |
| Framework   | Next.js `16.4` App Router, React `19.3`, TypeScript strict            |
| Styling     | Tailwind CSS v4, CSS variables in `src/app/globals.css`               |
| Components  | shadcn primitives (`radix-nova` style) in `src/ui`                    |
| State       | Jotai atoms for shared generation state, local hooks for the rest     |
| Motion      | `motion/react` for number rolls, CSS for shell/video-wall motion      |
| Icons       | `lucide-react`                                                        |
| Backend     | Express `5.3`, `tsx`, helmet/cors/compression/morgan in `apps/engine` |
| Workspaces  | npm workspaces (`apps/*`), one `tsconfig.base.json`                   |
| Lint/format | oxlint and oxfmt, shared config at the repo root                      |
| Tests       | Vitest + Testing Library (jsdom), Playwright (Chrome)                 |

`cn` is imported directly from the `cn` package; there is no local wrapper.
Imports use the `@/` alias, which maps to `src/`, and the `~` alias, which maps
to the app root. The engine uses the same `@/` alias for `apps/engine/src`, so backend
imports read `@/modules/billing` rather than a chain of `../`.

## Product contract

The UI-facing shapes live with the component that owns them:

- `components/studio/types.ts` — `GenerationModel` with
  `GenerationModelCapabilities`, `ModelOption` and `Template`.
- `components/media-card/types.ts` — `MediaItem`, `MediaKind` and
  `MediaCategory`.
- `components/settings/types.ts` — `User`; `components/nav/types.ts` —
  `Notification`.
- `components/pricing/utils.ts` — quantity clamping, quote maths and
  `formatUSD`; `components/studio/utils.ts` — aspect-ratio descriptors,
  capability filters, duration presets and the per-model cost rule.

The settings stored on a generation are `{ resolution, duration, aspectRatio,
audio }`. `GenerationKind` is `create | edit` and `GenerationStatus` is
`queued | running | succeeded | failed`; both are values the data model draws.
The working notification types are `generation_succeeded` and
`generation_failed`, mapped to labels in `components/nav/utils.ts`.

`src/mocks` holds every demo row the UI renders until the API is wired:
`generation` (the `generation_models` catalogue and model costs), `media`,
`templates`, `notifications`, and the marketing `pricing` data. Demo data never
lives in component files; it is the seam that `UI-1` replaces with `/api/v1`
calls.

A model carries `id`, `slug`, `displayName`, `provider`, `providerModelId`,
`capabilities` and `isEnabled`; `cost` is kept beside the mock row until pricing
moves to the server. The UI derives aspect ratios, durations and resolutions
from the selected model's capabilities rather than from global lists.

## System design

The drawing this section follows is `docs/arch-1.excalidraw`: requirements,
core entities, API design, data flow, high-level architecture and deep dives,
in that order.

One deployment exposes `/api/v1`. Modules own their routes and interact through
public interfaces; there is no API gateway and no per-module database. The
worker runs from the same image as the API.

### High-level architecture

```text
web app — apps/lab (Next.js)
  │  HTTPS · Supabase Auth session, or a bearer API token
  ▼
engine — apps/engine (Express), one deployment
  identity · generation · billing · media · catalog · notifications
  │            │                  │               │
  ▼            ▼                  ▼               ▼
Postgres     job queue           Redis         private storage
(Supabase)   (generation)        (catalog)     (signed URLs)
               │
               ▼
         model providers — Gemini · Seedance

Supabase Auth  ·  Lemon Squeezy — checkout and verified top-up webhooks
```

| Module          | Owns                                                                                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth`          | Validating Supabase Auth sessions and bearer API tokens; resolving the authenticated user.                                                                       |
| `generation`    | Validating model settings, inserting queued jobs, exposing job status, the worker that claims jobs and calls provider adapters, retries, publishing the outcome. |
| `billing`       | Quoting, reserving funds before work, settling on success, releasing on failure, crediting verified top-ups.                                                     |
| `media`         | Validating uploads, registering generated media, issuing short-lived signed URLs.                                                                                |
| `catalog`       | Templates and model options; reads Redis first, Postgres on a miss, TTL expiry and invalidation on edits.                                                        |
| `notifications` | Recording terminal job updates, listing unread and past updates, marking notifications read.                                                                     |

`templates` keeps its own router under `modules/templates` because
`/api/v1/templates` is its own surface; it belongs to the catalog domain.
`generation/providers` holds one adapter per provider, keyed by
`provider_model_key`.

| Service           | Used for                                                        |
| ----------------- | --------------------------------------------------------------- |
| Supabase Auth     | Sign-in and session validation for web requests                 |
| Supabase Postgres | Application records, the ledger and the durable job queue       |
| Supabase Storage  | Private uploads and generated media, served through signed URLs |
| Redis             | Catalog cache-aside reads, TTL expiry and invalidation on edits |
| Lemon Squeezy     | Top-up checkout and verified webhook credit                     |
| Gemini, Seedance  | Model providers called by the generation worker                 |

### Data model

The drawing's tables. Foreign keys point at the row they reference; timestamps
are `timestamptz`; `jsonb` columns carry a checked shape.

```text
users
  id          uuid         PK
  email       text         UNIQUE
  created_at  timestamptz
```

```text
media_assets
  id             uuid         PK
  owner_user_id  uuid         FK users.id · nullable for shared assets
  kind           text         image / video / audio
  storage_key    text         UNIQUE
  created_at     timestamptz
```

```text
templates
  id                     uuid         PK
  source_asset_id        uuid         FK media_assets.id
  name                   text
  customization_options  jsonb        roles and the settings a user may change
  created_at             timestamptz
```

```text
generations
  id               uuid         PK
  user_id          uuid         FK users.id
  template_id      uuid         FK templates.id · nullable
  output_asset_id  uuid         FK media_assets.id · nullable · UNIQUE
  kind             text         create / edit
  prompt           text         nullable
  model_id         uuid         FK generation_models.id
  settings         jsonb
  status           text         queued / running / succeeded / failed
  failure_code     text         nullable
  created_at       timestamptz
  completed_at     timestamptz  nullable
  inputs           jsonb        ordered asset ids and roles
```

```text
generation_models
  id                  uuid         PK
  name                text         model display name
  provider            text         Gemini / Seedance
  provider_model_key  text         UNIQUE per provider
  supported_modes     text[]
  resolutions         text[]
  durations_seconds   int[]
  aspect_ratios       text[]
  supports_audio      boolean
  active              boolean      enabled for generation
  updated_at          timestamptz
```

```text
notifications
  id             uuid         PK
  generation_id  uuid         FK generations.id
  type           text
  read_at        timestamptz  nullable
  created_at     timestamptz
```

```text
transactions
  id               uuid         PK
  user_id          uuid         FK users.id
  generation_id    uuid         FK generations.id · nullable
  type             text         top-up / charge / credit
  amount           bigint       signed, in balance units
  idempotency_key  text         UNIQUE
  created_at       timestamptz
```

### API

`/api/v1` is the only surface: JSON in, JSON out, every route authenticated
except the top-up checkout redirect. The endpoint table lives in `ROADMAP.md`
§1.4. The groups
are identity (`/me`), catalog (`/models`, `/templates`), media (`/assets`),
billing (`/balance`, `/balance/top-ups`), generations (`/generation-quotes`,
`/generations`) and notifications.

### Data flow

1. **Compose.** A prompt, source clip, reference media or curated template.
2. **Sign in with Supabase Auth.** The draft survives the trip; on cancel the
   user returns to it.
3. **Review the quote.** Model settings and the cost of the generation.
4. **Check the balance.** Below the quote, top up through Lemon Squeezy; the
   balance is credited after a verified confirmation, then checked again. A
   pending payment can be waited on or retried.
5. **Submit the generation.** Reserve the funds, queue the job and return the
   generation id.
6. **Generate in the background.** The user can leave or keep checking status.
   Success saves the video, settles the charge, notifies and puts the result in
   history. Failure releases the reservation, records the failure code, notifies
   and shows the failed job in history.

### Deep dives

- **Reliable job dispatch and recovery** — durable queue, stale leases
  reclaimed, every accepted job reaches a terminal status.
- **Pay-as-you-go billing** — reserve before work, settle on success, release on
  failure; retrying the same request never charges twice.
- **Provider retries** — bounded backoff for transient errors, final failures
  recorded on the generation.
- **Redis caching** — cache-aside catalog reads with a TTL, invalidated on
  catalog edits.
- **Private storage** — private bucket, ownership checks and short-lived signed
  URLs; another user's id returns 404.
- **Latency and recovery metrics** — API p95, queue age, provider duration,
  failures and lease recovery.

## Folder structure

Paths in the block below are relative to `apps/lab/`; the backend lives in
`apps/engine/src/`.

```text
src/
  app/
    layout.tsx              html, fonts, metadata, providers, <AppShell>
    shell.tsx               client shell: rail and top nav, skips /login
    providers.tsx           client runtime: Jotai, tooltips, hydrated flag
    globals.css             design tokens, theme mapping, base styles
    (website)/
      layout.tsx            <main> + <SiteFooter>
      page.tsx              home: <Home />
      explore/ pricing/ billing/ settings/ help/
    (workspace)/
      layout.tsx            <main>, no footer
      library/ assets/ favorites/
      create/[mode]/        video and image studio
    login/                  chrome-free: AppShell returns only its children
    auth/                   server-only auth: service, http, routes, env,
                            server client and proxy session refresh
  components/
    <feature>/              one folder per product feature
      index.tsx             the component and its logic, nothing else
      index.test.tsx        rendered behaviour, colocated
      constants.ts          static data, copy and class strings, UPPER_SNAKE
      hooks.ts              custom hooks, useXxx only (as needed)
      state.ts              Jotai atoms owned by the feature (as needed)
      types.ts              types and interfaces (as needed)
      utils.ts              functions (as needed)
      utils.test.ts         unit test, colocated
      <feature>-<part>.tsx  private subcomponents
  motion/                   reusable animation primitives
    constants.ts            shared transitions (spring, fade, instant)
    animated-height/        measured height wrapper, same folder shape
    rolling-number/         digit roll, same folder shape
  ui/                       shadcn-style primitives: one file per component,
                            types and class strings inline, no folder
  e2e/                      Playwright specs and helpers
  mocks/
    generation.ts           demo generation_models rows and model costs
    media.ts                demo media catalogue and lookups
    templates.ts            demo templates rows and lookups
    notifications.ts        demo notifications rows and unread lookup
    pricing.ts              demo rates, video models and top-up packs
public/
  favicon.ico               browser icon
  brand/                    logo, orb, social card, orb custom element
  favicons/                 manifest, install icons, apple touch icon
  media/                    local media (gitignored, do not commit)
vitest.setup.tsx            the shared test setup: framework mocks,
                            jsdom gaps, router state and renderWithProviders
```

Every file in a feature folder has one job. `index.tsx` declares the component
and its logic and nothing else: no named type, no named constant and no named
function. A feature with static data or visible copy has a `constants.ts`; one
with stateful logic has `hooks.ts`; one with shared Jotai atoms has `state.ts`
(currently `studio`); one with shaped or reused props has `types.ts`;
one with reusable functions has `utils.ts`. Presentational components can be a
single `index.tsx` with no supporting files.

The backend is a modular monolith in `apps/engine`. `apps/engine/src/app.ts`
builds the Express app, `src/main.ts` starts the HTTP server and `src/worker.ts`
starts the generation worker from the same image. Each module's `index.ts` is
its public interface: it creates the router and registers the module's routes,
so `app.ts` only mounts it under `/api/v1/<module>`. The layers sit beside it as
files named after the layer — `controller.ts`, `service.ts`, `repository.ts`,
`worker.ts` — so the module name is never repeated in a filename
(`generation/service.ts`, not `generation/generation.service.ts`). The modules
are `auth`, `billing`, `catalog`, `generation`, `media` and `notifications`;
`templates` is a catalog subdomain with its own router because `/templates` is
its own API surface, and `generation/providers` holds one adapter per provider.
Modules reach each other through those public interfaces, never through another
module's repository or tables.
`src/infrastructure` goes the other way on purpose: each client is a folder
whose `index.ts` is the only import surface (`database`, `redis`, `queue`,
`s3`, `supabase`), because those folders will hold a client, its config and
helpers.
`src/middleware` exports one `middleware` array — helmet, CORS, compression,
JSON parsing, morgan — that `app.ts` mounts with a single `app.use`, plus the
404 and error handlers it mounts last. `app.ts` also declares the single health
route inline — `app.get("/health")` answering `{ status: "ok" }` — so there is
one probe at the app level and no per-module health route.

Tests live next to the code they cover. Vitest picks up every `src/**/*.test.ts`
and `src/**/*.test.tsx`; name the file after the module it covers
(`index.test.tsx`, `pricing-quantity-slider.test.tsx`, `utils.test.ts`). Playwright
specs sit in `src/e2e` as a sibling of `src/components` and `src/app`, end in
`.e2e.ts`, and share `src/e2e/helpers.ts`. `vitest.setup.tsx` at the `apps/lab`
root, next to `vitest.config.mts`, is the only shared test setup file.

### Route composition

`src/app/**/page.tsx` composes the route. It exports `metadata` when the route
has one (every page except home), plus dynamic-segment helpers such as
`generateMetadata` and `generateStaticParams` where needed, and renders one
route component from `@/components/<route>`. All markup, styles, data and copy
live in that component's entry point, `src/components/<route>/index.tsx`, with
its strings in `constants.ts`. A typical page is a small module:

```tsx
import { Explore } from "@/components/explore";

export const metadata = { title: "Explore" };

export default function Page() {
  return <Explore />;
}
```

The studio is the richer case:
`src/app/(workspace)/create/[mode]/page.tsx` validates the segment, wraps the
studio in `Suspense` with `StudioSkeleton`, and exports `generateMetadata` and
`generateStaticParams`.

Route groups describe chrome, not URLs. The root `src/app/layout.tsx` owns the
document, fonts, metadata, providers and one `<AppShell>` mount, so the rail and
top nav have a single owner across navigation. The nested groups only decide
their footer:

- `src/app/(website)/layout.tsx` → `<main>` and `<SiteFooter>` for marketing
  and account pages (`/`, `/explore`, `/pricing`, `/settings`, `/help`).
- `src/app/(workspace)/layout.tsx` → `<main>` only, for library, assets,
  favorites and the studio.

`AppShell` owns the rail and the top nav; it takes only `children` and has no
footer prop. It returns just the children on `/login`, the one chrome-free
route. Group names never appear in the URL. Route components render their own
content; `TopNav`, `Sidebar` and `SiteFooter` come from the layouts.

Route copy and data belong to the owning component
(`src/components/pricing/constants.ts`, `src/components/login/constants.ts`).
Page modules are thin glue: they export metadata and render one route
component. They are excluded from coverage and keep no tests of their own;
behaviour is tested in the component that owns the markup. Pages are server
components; interactive behaviour lives inside the client component islands the
route component imports.

Shared rules live with their owning feature: `@/components/pricing/utils`,
`@/components/studio/utils`, `@/components/nav/utils` and so on. Reusable
animation primitives and transitions live in `@/motion`. Server-only
auth lives under `src/app/auth`, beside the `/auth/callback` route it serves.
`src/proxy.ts` is a single file at the `src/` root, because Next recognises the
proxy entry point there, with `src/proxy.test.ts` beside it.

All static assets live under `public/`. The favicon, app icons and manifest
live in `public/favicon.ico` and `public/favicons/`, and are declared through
`metadata.icons` and `metadata.manifest` in `src/app/layout.tsx`.

### Feature-folder contract

Each product area owns one folder. `index.tsx` is the feature component itself,
not a barrel; other files are private and imported by path.

- **`index.tsx`** exports the feature component. It holds the markup and the
  component's own logic, and no module-level declaration of another kind. Use
  named exports; pages use the Next default export. Never re-export a sibling
  from it (`export { X } from "./x"`): import the file that defines `X`. The
  main component is always `index.tsx`, never a sibling named after the feature
  (`pricing.tsx`); subcomponents are `<feature>-<part>.tsx` and are not entry
  points.
- **No barrels.** A folder has one `index.tsx`, the component itself. Do not
  add an `index.ts`, an `index.tsx` containing only `export { ... } from`
  lines, or re-export subcomponents from a feature entry.
- **Imports come first.** Every file opens with its `import` declarations,
  before any type, constant, function or component. This applies to
  `types.ts` and `constants.ts` too; no import sits mid-file.
- **`constants.ts`** holds every module-level constant: static arrays, config,
  reusable class strings, ids, durations, motion transitions, storage keys and
  **all visible copy** — headings, labels, button text, placeholders,
  `aria-label`s and tooltip text. Exported constants are `UPPER_SNAKE_CASE`;
  local constants are too. React and state stay out of it.
- **`utils.ts`** holds functions only — pure rules, formatting and small
  builders. No constants, no types, no components. Use `function`
  declarations for exported helpers.
- **`hooks.ts`** holds custom hooks only, each named `useXxx` and typically
  returning one object. Types, constants and plain helpers do not live here;
  they go to `types.ts`, `constants.ts` and `utils.ts`.
- **`state.ts`** holds the feature's Jotai atoms, and only when state is shared
  beyond one component. Shared generation state lives in
  `src/components/studio/state.ts`; the home prompt composer reads the same
  atoms because it is a compact front door to that studio. A single owner keeps
  plain React state instead: the shell's rail expansion is local `useState`.
- **`types.ts`** holds named types and interfaces with `import type`. Every
  prop object gets a named type: `function Studio({ initialMode }: StudioProps)`,
  never an inline `{ initialMode }: { initialMode: GenerationMode }`.
- **Reuse over repetition.** One type per shape, reused through `Pick`, `Omit`,
  intersections or a shared prop type. Identical scoped props collapse into one
  (`ComposerProps` for every composer pane, `StudioScopedProps` for every
  studio pane). Shared shapes live in the folder that owns them
  (`ChildrenProps` in `app/types.ts`, `FieldProps` in `settings/types.ts`,
  `OnCloseProps` in `nav/types.ts`, `HeadingProps` in `page-header/types.ts`);
  never hoist them into a root `src/types.ts`. The same rule covers markup:
  repeated UI comes from the shared component rather than a second copy.
- **Remove the obvious comment.** No JSDoc that restates a type, prop or name;
  document a decision only when it is not evident from the code.
- **Props** are destructured in the parameter list, not in the body:
  `function Row({ composer: { model } }: RowProps)`, never
  `function Row({ composer }: RowProps) { const { model } = composer; }`.
- **Copy blocks** are read where they are used: `BILLING_COPY.footer`,
  `STUDIO_COPY.preview.title`. Do not destructure or alias them into local
  `const copy`, `const { footer }` bindings.
- **Copy** lives in `constants.ts`, not in JSX. Vendor primitives in `src/ui`
  are the exception.
- **Tests** are named after the file they cover and sit beside it:
  `index.test.tsx`, `pricing-quantity-slider.test.tsx`, `utils.test.ts`.
- Subcomponents are named after their role (`studio-preview.tsx`,
  `nav-search.tsx`) and stay in the same folder.
- Features import each other's components from the file that defines them;
  there is no barrel entry to import through.

Client boundaries are as small as practical: `"use client"` goes on the
interactive feature root or hook, not on pages, layouts or pure presentational
components. Pages and layouts stay server components and export `metadata`.
Runtime wiring (`Providers`) lives beside the root layout at
`src/app/providers.tsx`; it mounts the Jotai provider, `NavigationProgress` and
the tooltip provider, and sets `data-hydrated="true"` on `<html>` after mount.

### Routes

| Route                                                                                  | Purpose                                                                                                                                                                     |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                                                    | Full-bleed video wall, prompt composer, featured gallery, ratio mosaic, pay-as-you-go panel                                                                                 |
| `/create/video`, `/create/image`                                                       | Studio: controls, preview, takes, queue dialog                                                                                                                              |
| `/explore`                                                                             | Gallery filtered by media kind, searchable by title, prompt and model                                                                                                       |
| `/library`                                                                             | Generated work with kind tabs and search                                                                                                                                    |
| `/assets`, `/favorites`                                                                | Uploaded assets by kind; a saved grid (no favourites entity)                                                                                                                |
| `/pricing`                                                                             | Image/video price calculators, top-up packs, FAQ (marketing only)                                                                                                           |
| `/settings/account`, `/settings/notifications`, `/settings/billing`, `/settings/usage` | Account (`email`, id, created), read-only notifications, balance, payment method and auto top-up, and the `transactions` ledger; `/settings` redirects to the account tab   |
| `/help`                                                                                | Guides and contact                                                                                                                                                          |
| `/privacy`, `/terms`                                                                   | Shared `LegalDocumentView`: header, revision date, section anchors and a sticky contents rail that marks the section being read (`#cookies` is the consent banner's target) |
| `/login`                                                                               | Standalone split-screen sign-in; crawlable but `noindex`                                                                                                                    |

`src/proxy.ts` (Next 16's middleware replacement) rewrites unknown
`/create/:mode` segments to a real 404 and then refreshes the Supabase session.
Keep the studio validation in sync with the two supported studios. Visitors
can open the studios and library signed out; `/settings` and the generate
action ask for an account.

`src/app/auth/callback/route.ts` and `src/app/logout/route.ts` are route
handlers, not pages: the first exchanges the OAuth code for a session cookie,
the second clears the session.

### Authentication

Supabase Auth owns identity; the app has no passwords. The project is optional
while it is being set up: without `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` every route stays open and `/login` explains
what is missing instead of crashing.

- `src/app/auth/session.ts` runs from the proxy: it refreshes the session
  cookies and sends signed-out visitors of `/settings` to `/login?next=…`.
  Browsing stays public, including the studios, library and assets;
  generation asks for an account at the action itself through
  `useRequireAuth`, which sends the visitor to `/login` with the current page
  as `next`. `src/app/auth/routes.ts` owns the protected prefixes, the
  `/create/video` fallback and `safeNextPath`, which rejects absolute and
  protocol-relative redirects.
- `src/app/api/auth/*` is the only auth surface the browser sees: the
  `session`, `otp`, `verify`, `oauth` and `signout` route handlers return JSON
  and set the session cookie. Supabase stays behind `src/app/auth/service.ts`
  and `src/app/auth/server.ts`; no Supabase client ships to the browser.
- `/login` signs in with Google, GitHub, Apple or a six-digit email code. The
  provider buttons are always offered; a provider that is not enabled in the
  Supabase project reports the usual sign-in error when it is clicked. The
  screen reads `next` and `error` from `searchParams` and is server-rendered
  per request (`instant = false`) so an expired callback link can explain
  itself.
- The account surfaces follow the tab's session through `useSessionUser`,
  which reads `/api/auth/session` once and shares the result.

The engine validates the same tokens: `getSupabaseAuthClient()` creates a
verify-only client, and `GET /api/v1/me` answers `{ user: { id, email,
createdAt } }` or 401 when the token is missing or the project is not
configured. The account screens still render the demo email until `UI-1` wires
them to the API.

`src/app/sitemap.ts` and `src/app/robots.ts` are metadata routes. Both build
absolute URLs from `SITE_URL` (`process.env.SITE_URL`, falling back to the
production origin); the sitemap stamps every entry with `legalUpdated` from
`src/components/legal/constants.ts`.

### Domain data

Pure TypeScript stays inside the feature that owns it:

- `components/pricing/utils.ts` — image/video quantity clamping, quote maths,
  `formatUSD` and `formatUSDRate`.
- `components/studio/utils.ts` — `ModelOption`, aspect-ratio descriptors,
  capability filters, duration presets and the per-model cost rule.
- `components/nav/utils.ts` — the notification type-to-label map.
- `components/media-card/types.ts` — `MediaItem`, `MediaKind`, `MediaCategory`.
- `components/media-card/utils.ts` — `mixMediaByKind`.
- `app/auth/routes.ts` — protected prefixes, the studio fallback, safe `next`
  paths and the sign-in URL. `app/auth/service.ts` and `app/auth/server.ts`
  hold the server-only Supabase facade and client.
- `app/auth/session.ts` — the proxy session refresh and gating.

The public origin is deployment configuration, not a checked-in constant:
`SITE_URL` feeds root metadata, `robots.txt` and `sitemap.xml`.

`src/mocks` is the only place demo rows live. Each module exposes rows plus the
lookup the UI needs (`mediaById`, `templateById`, `unreadNotifications`) and the
model options (`modelOptions`). Components import types and pure helpers from
their owning feature folder and rows from `src/mocks`. `media.category` remains
only to pick a gradient fallback; it is never shown as a product field.

All money is rounded to cents at the calculation boundary and formatted with
`formatUSD` or `tabular-nums`. The pricing calculators are marketing surfaces;
production quotes come from `POST /generation-quotes`. When `UI-1` lands, replace
the `src/mocks` imports with the `/api/v1` data source, not the other way round.

## Design system

### Surfaces

| Token                | Value                   | Use                                |
| -------------------- | ----------------------- | ---------------------------------- |
| `--background`       | `#0f1113`               | Page (shared by the rail and body) |
| `--chrome`           | `#131517`               | Nav bars, sticky toolbars          |
| `--surface`          | `#0f1113`               | Section band                       |
| `--surface-raised`   | `#0f1113`               | Raised card                        |
| `--surface-inset`    | `#0f1113`               | Inset well                         |
| `--sidebar`          | `var(--background)`     | Rail                               |
| `--foreground`       | `#f4f5f7`               | Primary text                       |
| `--muted-foreground` | `#9aa0a6`               | Secondary text                     |
| `--border`           | `rgba(255,255,255,0.1)` | Hairlines                          |

The page stays the cool neutral grey studio, without warm or green tinting.
Nav bars (top nav, sticky toolbars) are a solid `chrome-bar` lift in `--chrome`
(`#131517`) — the same surface as library summary cards — so they never read as
transparent over content. Overlays use frosted glass: `glass-menu` (menus,
selects, dialogs), `glass-panel` (large content panels) and `glass-card` (raised
cards and order panels). Glass combined with media behind it uses a strong
backdrop — a nearly opaque tint plus `blur` and `brightness` — so text stays
readable over video and images, notably the nav mega menu and dropdowns. Chrome
is the darker material; content panels are lighter. Never stack a light glass
surface on another. Glass falls back to solid grey surfaces under
`prefers-reduced-transparency` and where `backdrop-filter` is unsupported.

### Brand

| Token                | Value     | Use                                    |
| -------------------- | --------- | -------------------------------------- |
| `--brand`            | `#7c3aed` | CTAs, logo fill, section key words     |
| `--brand-hover`      | `#8b5cf6` | Hover for filled brand controls        |
| `--brand-foreground` | `#faf9f6` | Text/icons on brand                    |
| `--brand-secondary`  | `#a78bfa` | Selected states, sliders, nav progress |
| `--brand-tertiary`   | `#c4b5fd` | Error/destructive states               |

Rules:

- Primary CTA: `bg-brand text-brand-foreground hover:bg-brand-hover`.
- Section headings use one italic Instrument Serif key word in `text-brand`.
- Cost figures, focus rings, active nav labels and chart surfaces stay neutral.
- `--destructive` aliases the brand tertiary; red, crimson and rose stay out of
  the palette.
- Colored glows, radial color washes, decorative status dots, uppercase tracked
  eyebrows above page titles and hover scaling on cards are not part of the
  visual language.
- Use the tokens. A one-off translucent white/black overlay is acceptable for
  glass depth; a new brand hue is not.

### Type

Fonts are loaded in `src/app/layout.tsx`:

- **Inter** — body and UI (`font-sans`, with `ss01`/`cv01`).
- **Space Grotesk** — section and display headings (`font-grotesk`).
- **Instrument Serif** — italic key words and editorial display (`font-serif`,
  `font-display`).
- **Space Mono** — timestamps, counters and technical meta (`font-mono`).

Type rules:

- Minimum text size is **11px** (`text-[0.6875rem]`).
- Every control shares one label scale: `text-xs lg:text-[0.6875rem]` — 12px
  below `lg`, 11px at `lg`. `Button`, `Input`, `Textarea`, `Select`,
  `DropdownMenu`, `Tabs` and `SegmentedTabs` set it in the primitive, so call
  sites never restate a text size. Prose uses `text-sm lg:text-xs`.
- Body copy is sentence case. Headlines, labels and buttons do not end in a
  period.
- Page titles: `text-[1.875rem]` / `sm:text-[2.25rem]`, medium, tight tracking.
- Section headers: uppercase 17/19px Space Grotesk, `tracking-[0.1em]`, with a
  sentence-case description.
- Numbers that change use `tabular-nums`; large money changes can use
  `RollingNumber`.

### Space, radius, layout

- All lengths are `rem`; only hairline borders stay `1px`.
- Shell: `max-w-[120rem]`, page padding `px-5 py-7`, section padding `py-16`.
- Cards use `rounded-xl`/`rounded-2xl`; controls use `rounded-lg`; the base
  radius token is `0.75rem`.
- Use the shared `PageHeader` for route intros and `SectionHeader` for in-page
  sections instead of rebuilding the type/rhythm.
- Small controls are 32–40px tall; icon buttons use `size-8`/`size-9`.

### Shared primitives

Consistency over repetition: when the same UI appears twice it becomes one
component configured by props, never a second copy with slightly different
classes. The shared UI set lives in `src/ui/`, one file per primitive with its
prop types and class strings inline — no folder, no `types.ts` or
`constants.ts`:

| Component        | Owns                                                                        |
| ---------------- | --------------------------------------------------------------------------- |
| `SegmentedTabs`  | All/image/video chip bars, optional icons, `fullWidth` and `scrollable`     |
| `SearchInput`    | Search field, icon, optional hotkey hint, clear button and Escape behaviour |
| `CountBadge`     | Monospace count and metadata pills                                          |
| `EmptyState`     | Dashed empty panel with icon, title, description and optional action        |
| `IconBox`        | Bordered square around a leading icon                                       |
| `PageShell`      | Route padding wrapper (`px-5 py-7`)                                         |
| `MediaKindBadge` | Image/video badge on media overlays, with optional time and icon-only mode  |

CTAs use `buttonVariants` sizes (`cta`, `cta-sm`, `cta-xs`) and the default brand
variant; callers do not repeat `bg-brand`, `hover:bg-brand-hover` or a custom
height and type scale.

### Overlays

- Menus and selects are portalled and use popper positioning, so they open
  above or below the trigger and flip near the viewport edge. Never use
  item-aligned select overlays inside the page.
- The studio template, model and resolution pickers use `DropdownMenu` radio
  groups (`src/ui/dropdown-menu.tsx`), not `Select`. A menu has no
  item-aligned mode, so it can only anchor above or below its trigger — the
  mobile bug where the list covered the button cannot come back.
- Menus and selects share one popup shape: a 36px (`h-9`) trigger and a
  `rounded-lg` `p-1` surface whose items use `px-2 py-1.5` and the control text
  scale. Do not restyle item text, height or radius at a call site; pass only
  the spacing a specific row needs.
- Menu and select content matches the trigger width unless a wider menu is set
  explicitly.
- Selected indicators in menus are 12px checks, not large checkbox tiles.

### Motion

- Name the transition: `transition-[width]`, `transition-colors`,
  `transition-[opacity,transform]`; avoid `transition-all`.
- Durations: 200ms for hover/nav, 260ms for the rail, 300ms for fades.
  Easing for layout: `cubic-bezier(0.32,0.72,0,1)`.
- Layout changes use 400–450ms: a critically damped spring
  (`LAYOUT_SPRING` in `src/components/motion/constants.ts`) for measured
  containers and grid reflows, a named CSS transition for dimension swaps such
  as the studio aspect frame. Do not hand-write `style` for sizes; keep them in
  Tailwind classes.
- Reusable animation pieces live in `src/motion`, beside `src/components` and
  `src/ui`, each in its own folder with the same `index.tsx` / `constants.ts`
  / `types.ts` shape as a feature. Shared transitions live in
  `src/motion/constants.ts`; features import them instead of re-declaring a
  spring or fade.
- Tailwind is v4: use canonical utilities and the named scale, never the
  removed v3 names.
- The studio aspect frame is capped by `100dvh` at every breakpoint, with a
  smaller offset below `lg` (stacked page) and a larger one at `lg` (fixed
  nav + studio header + preview chrome). A square or portrait preview must fit
  with its info row without scrolling.
- When two states differ in height by only a few pixels and the difference is
  stable, reserve the taller height (shared grid cell) so nothing shifts.
  Animate when the difference is large enough to read as movement.
- Disclosure panels use the `grid-rows-[0fr]` → `grid-rows-[1fr]` transition
  with a 300ms icon rotation; do not animate `height` from `auto`.
- Add `motion-reduce:transition-none` (or `motion-reduce:animate-none`) to
  every non-essential animation.
- Decorative/infinite motion pauses under `prefers-reduced-motion`.
- The rail measures 61px collapsed and 200px expanded; controls keep one
  vertical axis.
- The top nav is fixed at 48px and does not shrink on scroll. The orb stays
  36px, links 36px/12px.
- The home video wall is product-critical: keep it full-bleed, starting at the
  beginning of the loop, with slightly darkened tiles.
- The nav orb is the `violet-orb` WebGL element (12s per revolution) with a
  static poster fallback. Script: `public/brand/violet-orb.js`.

## Product chrome

- `AppShell` lives in `src/app/shell.tsx`, beside `layout.tsx` and
  `providers.tsx`, because it is layout wiring rather than a feature. It owns
  the desktop rail and the top nav; the root `layout.tsx` mounts it once, and
  the `(website)`/`(workspace)` layouts add `<main>` and, on `(website)`, a
  `<SiteFooter>`. Route components render their own content.
- The shell persists across every route change because it sits above both
  groups. Rail expansion lives in a Jotai atom held by the root provider; the
  mobile drawer is local and closes on navigation. Mounting it once avoids a
  second, cached `AppShell` rendering stale rail state when Next preserves the
  previous route tree.
- `layout.tsx` stays a server component because `metadata` and `viewport`
  exports are server-only; `shell.tsx` is the single `"use client"` boundary
  that holds rail and drawer state and opts `/login` out of the chrome.
- Desktop rail is sticky, collapsed by default, and expands from its top
  control. Mobile uses a focus-trapped drawer.
- `TopNav` owns the mega menu, search, balance pill, notifications and brand
  orb. The mega menu positions itself from the hovered trigger and clamps its
  width to the header so it stays inside the shell.
- `NavigationProgress` is a 3px brand-secondary bar driven by link clicks,
  popstate, and the `chronolab:navigation-start` custom event.
- `SiteFooter` is rendered by `(website)/layout.tsx`; `(workspace)` omits it,
  and `AppShell` renders `/login` with no chrome at all. Its Terms and Privacy
  links point at `/terms` and `/privacy`.
- `CookieConsent` is mounted by the root `layout.tsx`, outside `AppShell`, so it
  covers every route. It stores the choice under `chronolab:cookie-consent`,
  dispatches `chronolab:cookie-consent`, and stays out of the server markup
  (`useSyncExternalStore` with a server snapshot) so the banner never causes a
  hydration mismatch.
- `Providers` (`src/app/providers.tsx`) wires Jotai and tooltips and sets
  `data-hydrated="true"` on `<html>` after mount. E2E waits on that flag.

### Brand assets

- `public/brand/chronolab-logo.svg` — integrated wordmark (1758×301).
- `public/brand/chronolab-orb-128.png` — nav fallback poster.
- `public/brand/violet-orb.js` — self-contained WebGL orb custom element.
- `public/brand/chronolab-social.png` — 1200×630 OG/Twitter card.
- `public/favicon.ico` — browser icon.
- `public/favicons/icon-512.png` — transparent app icon.
- `public/favicons/apple-touch-icon.png` — 180×180 touch icon.
- `public/favicons/site.webmanifest` + `android-chrome-192/512.png` — install
  icons.

## Data flow and conventions

- Shared generation state lives in `src/components/studio/state.ts`: mode,
  prompt, model, aspect ratio, duration, resolution, audio, optional template,
  attachment and balance. These map to the generation settings and the
  `POST /generations` body. The home composer and studio stay in sync because
  they read the same atoms.
- Other Jotai atoms belong in that feature's own `state.ts`, not in a
  catch-all store. Do not create an atom for state one component owns.
- Ephemeral UI state (open menus, queues, active take, rail expansion) belongs
  in local state or the feature's `hooks.ts`.
- Actions are simulated: submitting the composer navigates to
  `/create/${mode}`, and every catalogue item, price and result comes from
  `src/mocks`. The studio and home composer validate every control against the
  selected model's capabilities.
- Settings shows only `users.email`, `users.id` and `users.created_at`, plus
  the `notifications` rows; there are no preference, security or API-key panes.
- Billing is a settings tab, not its own route: available balance, payment
  method, auto top-up and tax. The card and invoices come from Lemon Squeezy.
- Usage is its own settings tab so the ledger is not mixed into billing: the
  `transactions` rows (top-up, charge, credit) come from the API. The
  demo values in `src/components/billing/constants.ts` are presentation data
  until BIL-6 wires the provider.
- Use the `chronolab:` prefix for custom events.
- Route metadata is exported per page; the root layout owns global metadata,
  OG/Twitter, manifest and `themeColor: "#7c3aed"`.
- Images use `next/image`; local media uses `VideoWithFallback`, which aligns
  duplicate players, autoplays explicitly and falls back to a gradient.

## Testing

| Layer      | Command                   | Contract                                    |
| ---------- | ------------------------- | ------------------------------------------- |
| Unit       | `npm run test:unit`       | the `src/proxy.test.ts` routing rules       |
| Component  | `npm run test:components` | `src/components` behaviour                  |
| All Vitest | `npm test`                | every colocated `*.test.ts(x)` in both apps |
| Coverage   | `npm run test:coverage`   | floors enforced                             |
| E2E        | `npm run test:e2e`        | production build on `:3100`                 |
| Typecheck  | `npm run typecheck`       | `tsc --noEmit` in every workspace           |
| Lint       | `npm run lint`            | oxlint                                      |
| Format     | `npm run format:check`    | oxfmt, shared config at the repo root       |
| Everything | `npm run check`           | typecheck + lint + coverage                 |

The root `vitest.config.mts` runs `projects: ["apps/*"]`, so `npm test` covers
`apps/lab` and `apps/engine` from one command. Each app keeps only its deltas:
`apps/lab/vitest.config.mts` holds the jsdom environment and setup file,
`apps/engine/vitest.config.mts` the `@/` alias. A pre-commit hook runs
`lint-staged` (oxfmt, then `oxlint --fix`) on staged files only.

Conventions:

- Tests are colocated: `src/components/studio/utils.test.ts`,
  `src/components/nav/index.test.tsx`,
  `src/components/pricing/pricing-quantity-slider.test.tsx`. Name the file after
  the module it covers and import it with `"."` or `"./hooks"`.
- Only test real logic: component behaviour, `utils.ts` and `hooks.ts`. No
  tests for constants, copy, metadata, `robots.ts`, `sitemap.ts`, route
  `page.tsx` glue that only renders a component, or demo fixtures in
  `src/mocks`. A test that restates a constant or asserts a heading is noise;
  delete it.
- Playwright specs live in `src/e2e` and end in `.e2e.ts`.
- Query by role, accessible name, label or visible copy. Avoid internal class
  names and DOM shape.
- `vitest.setup.tsx` is the single shared test file. It mocks
  `next/navigation`, `next/link`, `next/image`, `motion/react` and jsdom gaps,
  and it exports the router helpers (`routerMock`, `setPathname`,
  `setSearchParams`, `setParams`) and `renderWithProviders`. Import them
  through the root `~` alias (`~/vitest.setup`); never add per-test mocks.
- E2E builds into `.next-e2e` and never reuses a running server. Wait for
  `document.documentElement.dataset.hydrated === "true"` via `openApp`.
- Coverage floors are 85% statements, 83% branches, 80% functions, 87% lines
  over `src/**` excluding UI primitives, route files, demo fixtures, tests,
  e2e and test infrastructure. Raise them when the numbers rise; never lower
  them to make a change pass.
- State modules are covered through the behaviour that reads them; do not add
  tests whose only job is asserting atom defaults.
- The full Playwright suite is slow. Run it when routing, layout or shared
  interaction changed, or when asked; use the narrowest spec while iterating.

## Change checklist

Before calling a change done:

1. `npm run typecheck`, `npm run lint` and `npm run format:check`.
2. Relevant Vitest files, then `npm test` when the change is broad.
3. `npm run build`; run Playwright if the change touches routing, shell or
   responsive behaviour.
4. Check desktop and mobile widths; no horizontal overflow.
5. Check reduced-motion behaviour for any new animation.
6. Confirm no new red/crimson/rose, no new arbitrary px lengths, and 11px
   minimum text.
7. Remove dead code, unused assets and unused dependencies.
8. Keep the product name Chronolab.ai everywhere.

## Common recipes

**Add a page:** create the route surface in `src/components/<route>/index.tsx`
with its markup and, when it owns copy, a colocated `constants.ts` for its
visible strings, then make the page export `metadata` where the route needs it
and return `<Route />`. Add it under `src/app/(website)/` if it shows the
footer, or `src/app/(workspace)/` if it should not; a chrome-free route needs an
opt-out in `AppShell` (see `/login`). Add an E2E route entry if the route
belongs in the shell.

**Add a feature component:** create `src/components/<feature>/index.tsx` plus
`constants.ts`, `hooks.ts`, `state.ts`, `types.ts` and `utils.ts` as the feature
needs them. `index.tsx` holds the component and its logic only; every named
type goes in `types.ts`, every named value in `constants.ts` (uppercase), every
named function in `utils.ts` and every atom in `state.ts`. Mark the interactive
root `"use client"`, write single flat props inline, and import demo rows from
`src/mocks`. Add `index.test.tsx` beside it.

**Add a model or price:** add a `generation_models` row (with capabilities) in
`src/mocks/generation.ts` and its price in `modelCosts`; update
`src/components/pricing/utils.ts` if quantity maths changes. A model name,
provider or capability must exist in the contract first. Add a unit test.

**Add an endpoint:** the module that owns the data owns the route. Register it
in `apps/engine/src/modules/<module>/index.ts` on that module's router, keep the
logic in its `controller.ts`, `service.ts` and `repository.ts`, and mount a new
module in `app.ts` with one `app.use("/api/v1/<module>", router)`. Record the
path in `ROADMAP.md` §1.4; the contract change comes first. Nothing imports
another module's internals.

**Add a design token:** add the variable in `:root`, mirror it in `@theme
inline` as `--color-*`, use the generated Tailwind class, and update this doc.

**Add a test:** create `<file>.test.ts(x)` next to `<file>.ts(x)`; use
accessible queries and the existing setup mocks. E2E specs go in `src/e2e`.
