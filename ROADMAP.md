# Chronolab.ai — roadmap

The high-level design is the source of truth: its requirements, entities, API,
user flow and architecture. Every ticket below traces to a requirement (`F1`–
`F5`, `N1`–`N4`) or to a field in an entity. If a ticket cannot, it does not
belong here.

The UI has been aligned to the same contract. Fields that had no entity or
column were removed from the studio, settings, billing, assets, library,
favourites, explore and notifications; the remaining routes stay. What was
dropped is recorded in [UI alignment](#2-ui-alignment).

**Work protocol:** say `agent work <ID>`. The agent reads that ticket, stops
and **clarifies with you before implementing**, waits for the answers, then
implements, runs the checks in [Definition of done](#6-definition-of-done) and
reports. No ticket starts before its `Depends` are closed. Decisions are
recorded in this file under [Gaps and decisions](#5-gaps-and-decisions), not in
code comments.

---

## 1. Product contract

### 1.1 Functional requirements

| ID | Requirement | Contract |
| --- | --- | --- |
| **F1** | Generate video and images from a prompt, an input image/reference, or a template. | `POST /api/v1/generations` accepts `kind`, `prompt`, `inputs[{assetId, role}]`, `templateId`, `model`, `settings`; the model is enabled and `modelSupportsSettings` passes; a succeeded generation has `output_asset_id`. |
| **F2** | Edit and personalise existing media. | `kind = "edit"` takes one or more `media_assets` as inputs; `templateId` applies `templates.customization_options`; the same worker, status and billing path as F1. |
| **F3** | Manage asynchronous generations, notifications and history. | `GET /api/v1/generations` is a cursor list; `GET /api/v1/generations/{id}` returns `queued \| running \| succeeded \| failed`; terminal transitions create a `notifications` row; `GET /api/v1/notifications` and `PATCH /api/v1/notifications/{id}` set `read_at`. |
| **F4** | Manage spending and top-ups. | `GET /api/v1/balance` returns available USD; `POST /api/v1/balance/top-ups` returns a Lemon Squeezy checkout URL; a generation reserves its quote, settles on success and releases on failure; the balance never goes negative. |
| **F5** | Programmatic API. | Every capability above is reachable at `/api/v1` with token auth, documented by an OpenAPI file and a runnable example. **Blocked by the `api_keys` gap.** |

### 1.2 Non-functional requirements

| ID | Requirement | Acceptance |
| --- | --- | --- |
| **N1** | Acknowledge 95% of valid requests in under one second; meet completion targets per model and clip length. | `POST /generations` p95 < 1s excluding provider time; a target duration is defined per model/clip length and 95% of accepted jobs meet it; both are measured, not asserted. |
| **N2** | Accepted jobs survive restarts and reach a terminal status. | The job queue is durable; a worker killed mid-job is reclaimed; every accepted generation ends `succeeded` or `failed`, never stuck in `running`. |
| **N3** | Billing is idempotent. | `Idempotency-Key` on generation creation and top-ups; reserve, settle and release happen exactly once under retries and duplicate webhooks. |
| **N4** | Access to uploads, output and history is authorised. | A user can read only their own `media_assets`, `generations` and `notifications`; signed URLs are short-lived; another user's id returns 404, not 403. |

### 1.3 Entities

These are the only tables. Field names are as drawn; SQL uses `snake_case`.

| Entity | Fields | Notes |
| --- | --- | --- |
| `users` | `id`, `email`, `created_at` | No display name, username, avatar, bio or preferences. |
| `media_assets` | `id`, `owner_user_id`, `kind`, `storage_key`, `created_at` | `owner_user_id` is nullable for shared assets. `kind` is an asset type (`image`, `video`, `audio`); the allowed set is a gap. |
| `templates` | `id`, `source_asset_id`, `name`, `customization_options`, `created_at` | `customization_options` is jsonb: roles and the settings a user may change. |
| `generations` | `id`, `user_id`, `template_id`, `output_asset_id`, `kind`, `prompt`, `model`, `settings`, `status`, `failure_code`, `created_at`, `completed_at` | `settings` is jsonb. `kind` values are a gap; `create \| edit` is the working choice. |
| `generation_models` | `id`, `slug`, `display_name`, `provider`, `provider_model_id`, `capabilities`, `is_enabled` | `capabilities` is jsonb: modes, accepted input kinds, resolutions, durations, aspect ratios, audio, completion target. |
| `notifications` | `id`, `generation_id`, `type`, `read_at`, `created_at` | `type` values are a gap; `generation_succeeded \| generation_failed` is the working choice. |

`balance_transactions` is **named** in the design (“a top-up, generation charge
or credit”) but its table is not drawn. It is required by F4/N3; see
[gaps](#5-gaps-and-decisions).

### 1.4 API

Base path `/api/v1`. JSON in, JSON out. All routes are authenticated except the
top-up checkout redirect.

| Method | Path | Purpose | Requirement |
| --- | --- | --- | --- |
| `GET` | `/me` | The signed-in `users` row. | F5, N4 |
| `POST` | `/generations` | Validate, quote, reserve and enqueue. Returns `{ id, status: "queued" }`. | F1, F2, F4, N1 |
| `GET` | `/generations` | Cursor list for history. | F3 |
| `GET` | `/generations/{id}` | Status, output asset and failure code. | F3 |
| `POST` | `/assets/uploads` | Create an upload target for a `media_assets` row. | F1, N4 |
| `POST` | `/assets/{id}/complete` | Mark the upload finished and probe its kind. | F1, N4 |
| `GET` | `/assets/{id}` | Asset metadata plus a short-lived signed URL. | F1, F3, N4 |
| `GET` | `/templates` | List templates. | F1, F2 |
| `GET` | `/templates/{id}` | One template and its customisation options. | F2 |
| `GET` | `/balance` | Available balance in USD. | F4 |
| `POST` | `/balance/top-ups` | Create a Lemon Squeezy checkout. | F4, N3 |
| `POST` | `/generation-quotes` | Price a `kind`, `model`, `settings`, optional `templateId`. | F1, F2, F4 |
| `GET` | `/notifications` | List notifications, newest first. | F3 |
| `PATCH` | `/notifications/{id}` | Set `read_at`. | F3 |
| `GET` | `/models` | Enabled `generation_models` plus capabilities. | F1, F2 |

`src/lib/design/index.ts` holds the entity types, request/response DTOs,
`API_PATHS` and `modelSupportsSettings`. It is the code contract the UI and the
server both import.

### 1.5 User flow

1. **Set up the video.** Pick a model, prompt, inputs, template and settings.
2. **Sign in if needed.** Unauthenticated users are sent to `/login`; the
   chosen generation survives the trip.
3. **Top up if needed.** If `balance.available` is below the quote, open the
   Lemon Squeezy checkout and wait for the webhook.
4. **Start and reserve.** `POST /generations` acknowledges in under a second,
   reserves the quote and enqueues the job.
5. **Result and settle or release.** The worker writes the output asset and
   settles; a failure writes `failure_code` and releases the reservation. The
   notification and history reflect the terminal state.

### 1.6 Architecture

```text
web (Next.js)
  → API gateway (auth, rate limits, request ids)
    → modular monolith
       identity + media
       catalog + templates
       generation + worker
       billing
    → PostgreSQL          entities, ledger, idempotency keys
    → job queue           durable, retryable, restart-safe
    → object storage      uploads and outputs, signed URLs
    → Lemon Squeezy       top-up checkout and webhooks
    → model providers     provider_model_id adapters
```

No microservices, no per-feature databases. The worker runs from the same
server image as the API (`api` and `worker` entry points).

---

## 2. UI alignment

The UI now shows only modelled data. Routes were kept.

| Area | Removed | Kept |
| --- | --- | --- |
| Studio | Camera move, negative prompt, seed, motion strength, loop toggle, Enhance, character count, Share, Draft, favourites. | Prompt, reference input, template, model, aspect ratio, duration, resolution, audio, quote. |
| Settings | Profile name/username/avatar/bio/location/website, preferences, password, sessions, API keys. | `users.email`, `users.id`, `users.created_at`; read-only `notifications`. |
| Billing | Nothing removed. | Available balance, payment method, auto top-up, usage, receipts, tax and transactions, kept as the original payment page. See BIL-6. |
| Assets | Folders, “New folder”, options menu, fake file size. | `kind` filter, `storage_key`, `created_at`. |
| Library | Favourites stat and tab. | Generations, video seconds, spent; kind tabs. |
| Media card | Author, likes, save/heart. | Title, model, kind, duration, remix. |
| Sidebar / nav | Display name, initials, Workspace, new-model notices, “View all activity”. | Email, user icon, balance, billing, settings, help, generation notifications. |
| Explore | Category filters, likes, “Trending”, “Most liked”, “Updated live”, publish action, author search. | Kind filter and search over title, prompt and model. |
| Favorites | Collections, “New collection”, collection panel. | A plain saved grid; the route stays although there is no favourites entity. |

The pricing calculators remain marketing surfaces. Production prices come from
`POST /generation-quotes`; the calculators do not create orders.

---

## 3. Milestones and tickets

Tickets are ordered. `Depends` lists tickets that must close first.

### M0 — Contract and repository

**C-1 · Freeze the contract** — *F1–F5, N1–N4* · Done
`src/lib/design` holds the entities, DTOs, `API_PATHS` and
`modelSupportsSettings`; `src/mocks` holds the modelled sample rows
(`generation`, `media`, `templates`, `notifications`, `pricing`). `npm run
typecheck` and the contract tests pass. Any later field change is a design
change first.

**C-2 · Repository shape** — *all* · Depends: C-1
Create `apps/ui` and `apps/server` with one Dockerfile each. `server` builds
`dist/api.js` and `dist/worker.js`. No infra directory, no transcode step.
**Done:** both images build and the worker starts against the same database.

**C-3 · Schema and migrations** — *all* · Depends: C-1
PostgreSQL migrations for the six entities, the balance ledger, idempotency keys
and the job queue. `settings`, `capabilities` and `customization_options` are
jsonb with checked shapes.
**Done:** `db:migrate` builds from empty; a fixture inserts one row per entity.

### M1 — Identity, media and templates

**ID-1 · Sign-in and `/me`** — *F1, F5, N4* · Depends: C-3
Sign-in creates a `users` row and a session; `GET /me` returns it. The UI shows
the email, id and created date only.
**Done:** an unauthenticated generation request redirects to `/login` and
resumes; `GET /me` is covered by a test.

**MED-1 · Upload flow** — *F1, F2, N4* · Depends: ID-1
`POST /assets/uploads` creates a `media_assets` row and a presigned PUT;
`POST /assets/{id}/complete` verifies the object and records its kind.
**Done:** an image and a video round-trip; another user gets 404.

**MED-2 · Asset read and signed URLs** — *F1, F3, N4* · Depends: MED-1
`GET /assets/{id}` returns metadata and a short-lived signed URL.
**Done:** URLs expire; a foreign id returns 404.

**TPL-1 · Templates** — *F1, F2* · Depends: MED-1
`GET /templates` and `GET /templates/{id}` return `customization_options`; a
template's `source_asset_id` resolves to an asset.
**Done:** the studio lists only templates whose source asset exists.

### M2 — Models, quotes and generations

**MOD-1 · Model catalogue** — *F1, F2, N1* · Depends: C-3
Seed `generation_models` with the eight models used by the UI; `GET /models`
returns enabled rows with capabilities. `is_enabled = false` hides a model.
**Done:** disabling a model removes it from `/models` and rejects its slug.

**QUOTE-1 · Quotes** — *F1, F2, F4* · Depends: MOD-1
`POST /generation-quotes` prices a request from the model, settings and
template. The response is `{ amount, currency: "USD" }`.
**Done:** invalid settings are rejected; a quote is stable for the same input.

**GEN-1 · Create generation** — *F1, F4, N1* · Depends: QUOTE-1, ID-1
Validate the DTO, check capabilities, require balance, reserve the quote, insert
`generations` with `status = "queued"`, enqueue and return `< 1s`.
**Done:** 202 with `{ id, status: "queued" }`; the p95 ack is measured in PERF-1.

**GEN-2 · Capability validation** — *F1, F2* · Depends: MOD-1
Reject an aspect ratio, resolution, duration or audio flag the model does not
advertise. `modelSupportsSettings` is the single rule; the studio and server
share it.
**Done:** one contract test per field.

**GEN-3 · List and read generations** — *F3, N4* · Depends: GEN-1
`GET /generations` returns a cursor list scoped to the user; `GET
/generations/{id}` returns status, output and `failure_code`.
**Done:** a foreign id returns 404; the cursor is stable.

**EDIT-1 · Edit and personalise** — *F2* · Depends: GEN-2, TPL-1
`kind = "edit"` accepts input assets with roles, applies template options and
runs through the same queue and billing path.
**Done:** a template edit produces a new output asset and leaves the source
untouched.

**TARGET-1 · Completion targets** — *N1* · Depends: MOD-1, GEN-1
Record a target duration per model and clip length in `capabilities`, and emit
ack and completion timings.
**Done:** a dashboard reports p95 ack and the share of jobs inside target.

### M3 — Worker, notifications and durability

**WRK-1 · Durable queue and worker** — *F3, N2* · Depends: GEN-1
A Postgres-backed queue with visibility timeouts, retries and dead-lettering.
The worker leases a job, runs it, and writes the terminal state.
**Done:** killing the worker mid-job reclaims it; no job is lost.

**WRK-2 · Provider adapters** — *F1, F2, N2* · Depends: WRK-1, MOD-1
One adapter per provider, keyed by `provider_model_id`, returning a finished
file. Store the bytes as-is in the output asset.
**Done:** a fake provider and one real sandbox provider both produce a terminal
generation.

**WRK-3 · Terminal states** — *F3, N2* · Depends: WRK-2
Write `succeeded` with `output_asset_id` and `completed_at`, or `failed` with
`failure_code`. Never leave `running`.
**Done:** a forced provider failure produces `failed` and a failure code.

**NOTIF-1 · Notifications** — *F3* · Depends: WRK-3
Create one notification on each terminal transition; list them and set
`read_at` through the API. The nav and settings list the same rows.
**Done:** a retry does not duplicate the notification.

**WRK-4 · Restart recovery** — *N2* · Depends: WRK-1
On boot, reclaim expired leases and resume or fail them within the target.
**Done:** an integration test restarts the worker with a leased job.

### M4 — Billing

**BIL-1 · Balance** — *F4* · Depends: C-3, ID-1
`GET /balance` computes available balance from the ledger.
**Done:** a new user reads `0`; a top-up raises it.

**BIL-2 · Top-ups** — *F4, N3* · Depends: BIL-1
`POST /balance/top-ups` creates a Lemon Squeezy checkout and returns its URL;
the webhook credits the ledger once.
**Done:** replaying the webhook does not double-credit.

**BIL-3 · Reserve, settle, release** — *F4, N3* · Depends: BIL-1, GEN-1
Reserve the quote at creation, settle on success, release on failure. Store the
generation id on every ledger row.
**Done:** a failed job restores the exact amount; a succeeded job charges once.

**BIL-4 · Idempotency** — *N3* · Depends: BIL-2, BIL-3
Accept `Idempotency-Key` on generation creation and top-ups; store the key,
request hash and response. Retries return the original result.
**Done:** duplicate requests create one generation and one charge.

**BIL-5 · Transaction history** — *F4* · Depends: BIL-3 · **Gap**
Add the `balance_transactions` table the design names but does not draw, and
back the billing list with it. See [gap G2](#5-gaps-and-decisions).
**Done:** top-ups, charges and credits are listed in reverse chronological order.

**BIL-6 · Payment method, auto top-up and receipts** — *F4* · Depends: BIL-2
The billing page keeps its payment method, auto top-up, usage chart, receipts
and tax sections. Back the card and receipts with the Lemon Squeezy customer
portal and invoices; auto top-up is a billing rule over the same ledger.
**Done:** the card shown matches the provider, a receipt downloads the provider
invoice, and auto top-up creates exactly one top-up per threshold crossing. See
[gap G12](#5-gaps-and-decisions).

### M5 — Programmatic API

**API-1 · API authentication** — *F5, N4* · Depends: ID-1 · **Gap**
Add the missing `api_keys` entity (hashed key, user id, created/last used) or an
equivalent token mechanism, then authenticate `/api/v1` with it. See
[gap G1](#5-gaps-and-decisions).
**Done:** a key can create and read a generation; a revoked key gets 401.

**API-2 · Parity and documentation** — *F5* · Depends: API-1, GEN-3, BIL-2
Publish an OpenAPI file and a runnable example for every route in
[§1.4](#14-api). Any UI action that is not reachable here is a defect.
**Done:** the example creates an upload, a generation, reads the result and
tops up.

### M6 — Hardening and UI wiring

**PERF-1 · Acknowledgement budget** — *N1* · Depends: GEN-1
Load-test `POST /generations` at the expected rate and record p95.
**Done:** p95 < 1s at target load; regressions fail CI.

**SEC-1 · Authorisation matrix** — *N4* · Depends: MED-2, GEN-3, NOTIF-1
Test every route as owner, other user and anonymous. Foreign ids return 404.
**Done:** the matrix is a test file, not a checklist.

**OPS-1 · Observability** — *N1, N2, N3* · Depends: WRK-1, BIL-4
Request ids, structured logs, queue depth, job age, ack latency, completion
latency, settlement failures and webhook replays.
**Done:** one dashboard and alerts on the four SLOs.

**UI-1 · Wire the UI to the API** — *all* · Depends: M1–M5
Replace the `src/mocks` imports in the components with `fetch` calls to
`/api/v1`; keep `src/lib/design` as the shared types and `src/lib` for pure
rules. The studio, library, assets, billing, settings and notifications all
read real rows.
**Done:** no demo catalogue, price or generation remains on a product screen.

**QA-1 · End-to-end flow** — *F1–F4, N2–N4* · Depends: UI-1
Playwright: sign in → upload → quote → generate → notification → history →
top up → generate again, plus a forced failure and a worker restart.
**Done:** the suite passes against the production build.

### Requirement coverage

| Requirement | Tickets |
| --- | --- |
| F1 | GEN-1, GEN-2, MOD-1, QUOTE-1, MED-1, TPL-1, WRK-2 |
| F2 | EDIT-1, GEN-2, TPL-1 |
| F3 | GEN-3, WRK-1, WRK-3, NOTIF-1 |
| F4 | BIL-1, BIL-2, BIL-3, BIL-5, BIL-6, QUOTE-1 |
| F5 | API-1, API-2 |
| N1 | PERF-1, TARGET-1, GEN-1 |
| N2 | WRK-1, WRK-4, WRK-3 |
| N3 | BIL-2, BIL-3, BIL-4 |
| N4 | ID-1, MED-1, MED-2, GEN-3, SEC-1, API-1 |

---

## 4. Out of scope

The design has no entity, field or requirement for these. They stay out until
the design grows:

- teams, workspaces, seats, roles and sharing.
- favourites, collections and folders as entities. The `/favorites` route stays
  as a plain saved view; it does not add a table.
- likes, comments, follows, publishing and a community feed.
- notification preference toggles and email digests; notifications are rows.
- API key management UI until `api_keys` exists.
- passwords, sessions and security settings; sign-in is the only identity UI.
- camera moves, negative prompts, seeds, motion strength, loop toggles,
  Enhance, drafts and project sharing.
- usage analytics beyond the ledger, and plan/subscription billing.

---

## 5. Gaps and decisions

These are places where a requirement needs data the drawing does not define.
Each is a design change first; the ticket above is blocked until it is answered.

| ID | Gap | Working decision | Needs |
| --- | --- | --- | --- |
| **G1** | F5 needs API credentials; no `api_keys` entity is drawn. | Authenticate `/api/v1` with hashed API keys owned by a `users` row; add the table before API-1. | Table name, fields, rotation, scopes. |
| **G2** | F4/N3 needs a ledger; the design names “Balance transaction” but draws no table. | `balance_transactions(id, user_id, kind, amount, generation_id, created_at)` with `kind` = `top_up \| charge \| credit`. | Confirm shape and whether balance is stored or derived. |
| **G3** | The design shows “sign in if needed” but no auth mechanism, session table or provider. | Email magic link or OAuth; sessions in PostgreSQL; no password table until drawn. | Provider and session lifetime. |
| **G4** | `generations.kind` values are not enumerated. | `create \| edit` to represent F1 and F2. | Confirm values (`video \| image` is the alternative). |
| **G5** | `media_assets.kind` values are not enumerated. | `image \| video \| audio`, matching inputs and outputs. | Confirm the set. |
| **G6** | `notifications.type` values are not enumerated. | `generation_succeeded \| generation_failed`. | Confirm the set and whether top-ups notify. |
| **G7** | `generation_models.capabilities` is jsonb with no shape. | Modes, input kinds, resolutions, durations, aspect ratios, audio, completion target. | Confirm target units and whether pricing lives here. |
| **G8** | `generation_quotes` is an endpoint but has no table. | Derive the quote from the model, settings and template; do not persist it. | Confirm if quotes must be stored for audit. |
| **G9** | Lemon Squeezy is named, but no webhook/event table is drawn. | Store webhook idempotency keys in the ledger/idempotency table; no separate events table. | Confirm webhook event retention. |
| **G10** | The job queue is drawn as a component, not an entity. | Postgres queue with leases and retries; no Redis until load requires it. | Confirm scale target. |
| **G11** | “Completion targets per model and clip length” has no table. | Put the target in `generation_models.capabilities`; measure against it. | Confirm target values. |
| **G12** | F4's payment method, auto top-up, usage and receipts have no entity in the drawing. | Keep the billing surfaces; read the card and invoices from Lemon Squeezy and derive usage from the ledger. | Confirm whether card metadata is stored or always fetched from the provider. |

---

## 6. Definition of done

A ticket is done only when:

1. `npm run typecheck`, `npm run lint`, `npm test -- --run` and `npm run build`
   pass.
2. New behaviour has a colocated test, including the failure path.
3. The endpoint, entity or field is in `src/lib/design` or a migration. No
   unmodelled field was added to the UI.
4. Authorisation is tested as owner, other user and anonymous where the ticket
   touches user data.
5. Billing changes replay their idempotency key in a test.
6. Worker changes include a restart test.
7. `ARCHITECTURE.md` and this roadmap are updated when the contract changes.
8. No demo catalogue, price or result is presented as real on a product screen.
