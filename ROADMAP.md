# Chronolab.ai roadmap

The product design is in [`architecture.excalidraw`](./architecture.excalidraw);
the system and rules are in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Lab

### Done

- Every route, shell and page: studio, library, explore, pricing, settings and
  legal, on `src/mocks`.
- Design tokens, primitives in `src/ui`, motion primitives and shared control
  sizing.
- **Auth UI.** Email OTP and Google, GitHub and Apple sign-in through the lab BFF,
  session refresh, a session-aware account menu and the `/settings` gate.

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
- Auth schema: `users` and `identities` migrations with RLS scoped to
  `auth.uid()`.
- Identity and users: bearer verification, lazy provisioning and
  `GET /api/v1/users/me`.
- Identity API: email OTP, session, refresh, sign-out and Google, GitHub and Apple
  OAuth on the identity module; Supabase stays in `infrastructure/supabase`.

### Next

#### Foundation

- **Fixtures.** Migrations build from empty; one fixture row per table.

#### Catalog and media

- **Models and templates.** Eight seeded models; `/models` returns active rows;
  `/templates` returns options; Redis cache with TTL and invalidation.
- **Uploads.** `POST /assets/uploads` returns a signed Supabase Storage upload
  URL; `/complete` records the kind.
- **Assets.** `GET /assets/{id}` returns metadata and a short-lived URL; a
  foreign id returns 404.

#### Billing

- **Balance.** `GET /balance` derives available and reserved from the ledger.
- **Top-ups.** Lemon Squeezy checkout URL; a verified webhook credits once.
- **Reserve and settle.** A failed job restores the exact amount; a succeeded
  job charges once.
- **Idempotency.** `Idempotency-Key` on generation and top-up replays the
  original result.
- **History.** Every balance change appears in the ledger, newest first.
- **Payment method and receipts.** Card and invoices come from the Lemon
  Squeezy portal; auto top-up crosses once per threshold.

#### Generations

- **Quotes.** `POST /generation-quotes` prices model, settings and template;
  invalid settings are rejected; a quote is derived, never stored.
- **Capability validation.** One rule shared by studio and engine; rejects an
  unsupported ratio, resolution, duration or audio.
- **Create.** Validates, reserves, inserts `queued`, enqueues and returns 202 in
  under 1s.
- **List and read.** Cursor history and one generation scoped to the user; a
  foreign id returns 404.
- **Edit and personalise.** `kind = edit` applies template options through the
  same queue and billing.

#### Worker and notifications

- **Queue.** Postgres queue with leases and retries; no Redis until load
  requires it; killing the worker mid-job reclaims the job.
- **Providers.** One adapter per provider; a fake and a sandbox provider both
  produce a terminal generation.
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
