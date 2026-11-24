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

### Next

- **Draft resume.** A signed-out generate resumes its draft after sign-in.
- **Real data.** Studio, library, assets, billing, settings and notifications
  read engine rows, with no mock on a product screen.
- **End-to-end.** Sign in, upload, quote, generate, notify, history and top up,
  plus the failure path and a worker restart.

## Engine

### Done

- Express app, middleware, error handling, health route and module routers as
  stubs.
- Configuration through `infrastructure/config`; the build passes with and
  without env.
- Database migrations: one baseline SQL file, a `schema_migrations` ledger and
  the `db:migrate` script.
- Auth schema: `users` migration with RLS scoped to `auth.uid()`.
- Auth and users: bearer verification, lazy provisioning, `GET /api/v1/users/me`
  and a sticky provider avatar — stored by the first identity that offers one,
  never swapped by a later provider.
- Auth API: email OTP, session, refresh, sign-out and Google and GitHub OAuth on
  the auth module; Supabase stays in `infrastructure/supabase`. Email templates
  send `{{ .Token }}` at a 6-digit OTP length, matching the login boxes.

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

- **Models and templates.** Seeded models with `active` enable/disable,
  capabilities, Runware mappings and synced upstream costs; `/models` returns
  active rows; `/templates` returns options; Redis cache with TTL and
  invalidation.
- **Uploads.** `POST /assets/uploads` returns a signed Supabase Storage upload
  URL; `/complete` records the kind.
- **Assets.** `GET /assets/{id}` returns metadata and a short-lived URL; a
  foreign id returns 404.

#### Pricing

- **Selling rates.** `model_prices` owns selling prices, markups, margins,
  volume tiers and discounts per model; `GET /pricing/rates` returns active
  selling rates without exposing upstream provider costs.
- **Quotes.** `POST /pricing/quotes` reads model metadata and costs from
  Catalog and returns a stateless quote for model, settings and template;
  invalid settings are rejected; preview quotes are derived, never stored.

#### Billing

- **Balance.** `GET /balance` derives available and reserved from the ledger;
  no pricing dependencies.
- **Top-ups.** Lemon Squeezy checkout URL; a verified webhook credits once.
- **Reserve and settle.** Reserve an exact amount before execution; capture on
  success; release on failure so the exact amount is restored.
- **Idempotency.** `Idempotency-Key` on generation and top-up replays the
  original result.
- **History.** Every balance change appears in the ledger, newest first.
- **Payment method and receipts.** Card and invoices come from the Lemon
  Squeezy portal; auto top-up crosses once per threshold.

#### Generations

- **Capability validation.** One rule shared by studio and engine; rejects an
  unsupported ratio, resolution, duration or audio via Catalog.
- **Create.** Validates via Catalog, gets a quote from Pricing and persists the
  accepted quote snapshot on the job (never repriced), reserves via Billing,
  inserts `queued`, enqueues and returns 202 in under 1s.
- **List and read.** Cursor history and one generation scoped to the user; a
  foreign id returns 404.
- **Edit and personalise.** `kind = edit` applies template options through the
  same queue and billing.

#### Worker and notifications

- **Queue.** Postgres queue with leases and retries; no Redis until load
  requires it; killing the worker mid-job reclaims the job.
- **Providers.** Runware adapter plus a fake/sandbox provider behind one
  provider interface; both produce a terminal generation.
- **Terminal states.** `succeeded` writes the output and settles; `failed`
  writes the code and releases.
- **Recovery.** Boot reclaims expired leases; no accepted job is lost.
- **Notifications.** One row per terminal transition, with the type set to
  `generation_succeeded` or `generation_failed`; list and mark read; a retry
  does not duplicate.

#### Programmatic API

- **Tokens.** Hashed keys owned by a users row; a key creates and reads a
  generation; a revoked key gets 401.
- **OpenAPI.** The file and a runnable example cover every route in the API
  table.

#### Hardening

- **Performance.** p95 under 1s at target load, measured in CI.
- **Authorisation.** Every route tested as owner, other user and anonymous;
  foreign ids 404.
- **Observability.** Request ids, queue depth, ack and completion latency,
  settlement failures and webhook replays.
