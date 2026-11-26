# Chronolab.ai roadmap

The product design is in [`architecture.excalidraw`](./architecture.excalidraw);
the system and rules are in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Lab

### Done

- Every route, shell and page: studio, library, explore, pricing, settings and
  legal, on `src/mocks`.
- Design tokens, primitives in `src/ui`, motion primitives and shared control
  sizing.
- **Auth UI.** Google and GitHub sign-in plus email OTP: six auto-submitting
  boxes, an optimistic resend with three sends before a 30s wait, the server's
  own wait and the project email cap shown as copy instead of a fake clock, a
  blinking caret and a reduced-motion path. Session refresh, a session-aware
  account menu with the provider avatar, and the `/settings` gate.
- **Studio on Offerings.** The studio and home composer list models from
  `/api/offerings` and default to the first in catalog order; the studio shows
  the price from `/api/pricing/quote` for the current settings. Both routes forward to
  the engine; e2e answers them from `src/mocks/offerings.ts`.
- **Pricing page on Offerings.** Model rates, vendor logos, volume tiers, the
  per-clip example and the top-up estimate come from `/api/offerings`; the
  engine prices the example clip. Only the top-up packs are still copy.

### Next

- **Draft resume.** A signed-out generate resumes its draft after sign-in.
- **Real data.** Library, assets, billing, settings and notifications read
  engine rows, with no mock on a product screen.
- **End-to-end.** Sign in, upload, quote, generate, notify, history and top up,
  plus the failure path and a worker restart.

## Engine

### Done

- Express app, middleware, error handling, health route and module routers as
  stubs.
- Configuration through `infra/config`; the build passes with and
  without env.
- Database migrations: one baseline SQL file, a `schema_migrations` ledger and
  the `db:migrate` script.
- Auth schema: `users` migration with RLS scoped to `auth.uid()`.
- Auth and users: bearer verification, lazy provisioning, `GET /api/v1/users/me`
  and a sticky provider avatar — stored by the first identity that offers one,
  never swapped by a later provider.
- Auth API: email OTP, session, refresh, sign-out and Google and GitHub OAuth on
  the auth module; Supabase stays in `infra/supabase`. Email templates
  send `{{ .Token }}` at a 6-digit OTP length, matching the login boxes.
- Catalog: `generation_models` migration with 9 seeded models,
  `GET /api/v1/catalog` and `GET /api/v1/catalog/:id` (with `?mode=video|image`),
  shared capability validation, and abstract `CatalogProviderAdapter` sync.
- Runware catalog: 5 video and 4 image Runware models keyed by AIR id, with
  their vendor and its logo. The Runware adapter reads availability through
  the authenticated model search, and capabilities, upstream cost and vendor
  from each model's published schema; `catalog:sync` runs it once and keeps the
  catalog's name, summary and order. Prices are the lowest Runware rate plus
  50%, with Runware's resolution and audio steps as multipliers.
- Pricing: `model_prices` migration seeded for the 9 models (per-second video,
  per-image stills, image volume tiers), `pricing_rules` for tiers, resolution
  and audio multipliers and a percentage discount; `pricing.listRates(models)`
  for Offerings and `GET /api/v1/pricing/quote`, which calculates a price for
  model and settings from the query string, validated through Catalog and never
  stored, with no upstream costs exposed. Rates carry price fields only; model
  details stay with Catalog.
- Offerings: `GET /api/v1/offerings` (with `?mode=video|image`) pairs active
  catalog models with their selling price, in catalog order, and leaves out a
  model without an active price. The source for the studio pickers and the
  pricing page.
- Media: `media_assets` migration and a private `media` bucket with type and
  size limits. `POST /api/v1/media/uploads` checks the declared type and size
  and signs a one-time upload to a server-picked path;
  `POST /api/v1/media/{id}/complete` checks the stored object's real type and
  size, removing a mismatch; `GET /api/v1/media/{id}` returns the asset with a
  five-minute signed URL, and a foreign id returns 404. Storage access uses the
  secret key, server-side only.
- Templates: `templates` migration (a shared source asset, customisation
  options for input roles, resolutions, clip lengths and aspect ratios, and an
  `active` flag). `GET /api/v1/templates` pages active templates newest first
  (`?limit=` up to 50, `?cursor=` from `nextCursor`) and `GET
  /api/v1/templates/{id}` returns one; each carries its source with a
  five-minute signed URL, signed in one batch through
  `media.getSharedAssets`, and one whose source is not ready is left out. No
  templates are seeded yet, so the list is empty.
- Billing: append-only `transactions` ledger in micros. `GET /api/v1/billing`
  derives available and reserved; `billing.reserve` holds an exact amount under
  a per-user lock (402 when short), and `capture` / `release` settle it once.
- Generations: `generations` migration holding the accepted quote snapshot.
  `POST /api/v1/generations` (202, `Idempotency-Key` required) validates
  inputs, template and settings, quotes, holds the price and queues;
  `GET /api/v1/generations` pages the user's history and
  `GET /api/v1/generations/{id}` reads one, a foreign id returning 404.
- Worker: the generations table is the queue, with leases, reclaim of expired
  leases, three attempts and retry delays. `media.registerOutput` stores the
  output; success captures, failure releases. `worker` runs the loop with the
  provider it is given and stops cleanly on a signal.
- Fake module (temporary, not mounted in production): a provider that returns
  a placeholder image after 3s and fails when the prompt contains `[fail]`;
  `POST /api/v1/fake/top-ups` with `{ amountMicros }` credits through
  `billing.topUp` without a payment; `POST /api/v1/fake/jobs/run` runs the
  next due job without the worker.
- Notifications: `notifications` migration; one row per job and outcome from
  `generation.finished`, `GET /api/v1/notifications` (paged) and
  `PATCH /api/v1/notifications/{id}` with `{ "read": true }`.

### Blocked

- **Email rate limits.** Supabase owns the mailer and its limits do not fit the
  login: the built-in provider allows 2 emails per hour for the whole project,
  and the default 60s per-address window blocks the three-send burst. Needs
  custom SMTP or a Send Email hook, **Rate limit for sending emails** at 30 or
  more, and **Minimum interval per user** at 0–1s. Until then the later sends of
  a burst return 429, and the login shows the server's countdown or the
  email-limit copy.

### Next

#### Foundation

- **Fixtures.** Migrations build from empty; one fixture row per table.

#### Catalog and media

- **Scheduled sync.** Run the catalog sync as a worker job on a schedule, keep
  an admin's disable separate from upstream availability so a sync never
  re-enables it, and flag a synced cost that rises above the selling price.
- **Template sources.** Upload curated source clips as shared assets and add
  their templates; until then the template list is empty.
- **Studio templates.** The studio's template picker reads
  `GET /api/v1/templates` through a lab route instead of the mock list.
- **Pending upload cleanup.** A worker job removes assets still pending after
  the two-hour upload window, with any partial object.

#### Pricing

- **Price admin.** Set a model's price and rules with a margin guard against
  the synced upstream cost.
- **Template pricing.** A template's customisation options change the quote
  once the templates module exists; today `templateId` is only echoed.

#### Billing

- **Top-ups.** `POST /api/v1/billing/top-ups` returns a Lemon Squeezy checkout URL
  under an `Idempotency-Key`; a verified webhook credits once through
  `billing.topUp` with the order id. Until then, dev balances come from the
  fake top-up.
- **History.** `GET /api/v1/billing/transactions` pages every balance change, newest
  first.
- **Payment method and receipts.** Card and invoices come from the Lemon
  Squeezy portal; auto top-up crosses once per threshold.

#### Generations

- **Edit and personalise.** `kind = edit` applies template options through the
  same queue and billing; today an edit only requires a template.
- **Output and inputs in the reply.** A generation returns its output and
  input assets with signed URLs, not only their ids.

#### Worker and notifications

- **Runware provider.** A Runware adapter behind the same provider interface;
  the worker uses the fake provider until then.
- **Remove the fake module.** Once top-ups and the Runware provider land,
  delete `modules/fake`, its mount in `app.ts` and its provider in `worker.ts`.
- **Settlement recovery.** A sweep settles a terminal job whose capture or
  release did not land, and removes a job left unpaid when its request died
  between insert and hold.
- **Unread count.** Notifications report how many are unread, and mark all
  read in one call.

#### Programmatic API

- **Tokens.** Hashed keys owned by a users row; a key creates and reads a
  generation; a revoked key gets 401.
- **OpenAPI.** The file and a runnable example cover every route in the API
  table.

#### Hardening

- **Catalog caching.** Add Redis cache-aside in `infra/cache` with TTL and
  invalidation on catalog edits as an optimization pass.
- **Performance.** p95 under 1s at target load, measured in CI.
- **Authorisation.** Every route tested as owner, other user and anonymous;
  foreign ids 404.
- **Observability.** Request ids, queue depth, ack and completion latency,
  settlement failures and webhook replays.
