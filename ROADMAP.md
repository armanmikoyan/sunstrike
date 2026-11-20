# Chronolab.ai roadmap

The product design is in [`architecture.excalidraw`](./architecture.excalidraw);
the system and rules are in [`ARCHITECTURE.md`](./ARCHITECTURE.md). Say
`agent work <ID>` to start a ticket.

## Done

| Area   | State                                                                                          |
| ------ | ---------------------------------------------------------------------------------------------- |
| UI     | Every route, shell, studio, library, explore, pricing, settings and legal page, on `src/mocks` |
| Engine | Express app, middleware, error handling, health route, module routers as empty stubs           |
| Design | Tokens, primitives in `src/ui`, motion primitives, shared control sizing                       |

## Left

### Foundation

| ID    | Feature                 | Depends | Done when                                                                                                                                           |
| ----- | ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ENV-1 | Configuration           | —       | `.env.example` in both apps; `@supabase/*` declared; `ENGINE_URL` set; build passes with and without env                                            |
| API-0 | Next API layer          | ENV-1   | `src/app/api/v1/[...path]` proxies every engine route with the session bearer; no component or hook reaches the engine; signed-out calls return 401 |
| DB-1  | Schema, migrations, RLS | ENV-1   | Migrate builds from empty; one fixture row per table; a user reads only their own rows                                                              |

### Identity

| ID   | Feature          | Depends     | Done when                                                                                                                                                      |
| ---- | ---------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID-1 | Sign-in, session | API-0, DB-1 | Supabase sign-in, proxy refresh and `/settings` gate, `/api/auth/*`, `useSessionUser`, `useRequireAuth`; a signed-out generate resumes its draft after sign-in |
| ID-2 | `/me`            | ID-1        | Engine `identity` module validates the bearer and returns `{ user }`                                                                                           |

### Catalog and media

| ID    | Feature                | Depends    | Done when                                                                                                             |
| ----- | ---------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| CAT-1 | Models and templates   | DB-1, ID-2 | Seed eight models; `/models` returns active rows; `/templates` returns options; Redis cache with TTL and invalidation |
| MED-1 | Upload flow            | ID-2       | `POST /assets/uploads` returns a presigned S3 PUT; `/complete` records the kind                                       |
| MED-2 | Asset read, signed URL | MED-1      | `GET /assets/{id}` returns metadata and a short-lived URL; a foreign id returns 404                                   |

### Billing foundation

| ID    | Feature | Depends    | Done when                                                     |
| ----- | ------- | ---------- | ------------------------------------------------------------- |
| BIL-1 | Balance | DB-1, ID-2 | `GET /balance` derives available and reserved from the ledger |
| BIL-2 | Top-ups | BIL-1      | Lemon Squeezy checkout URL; verified webhook credits once     |

### Generations

| ID    | Feature               | Depends             | Done when                                                                                         |
| ----- | --------------------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| GEN-1 | Quotes                | CAT-1               | `POST /generation-quotes` prices model, settings and template; invalid settings rejected          |
| GEN-2 | Capability validation | CAT-1               | One rule shared by studio and engine; rejects an unsupported ratio, resolution, duration or audio |
| GEN-3 | Create generation     | GEN-1, MED-1, BIL-1 | Validates, reserves, inserts `queued`, enqueues and returns 202 in under 1s                       |
| GEN-4 | List and read         | GEN-3               | Cursor history and one generation scoped to the user; a foreign id returns 404                    |
| GEN-5 | Edit and personalise  | GEN-2, CAT-1        | `kind = edit` applies template options through the same queue and billing                         |

### Worker and notifications

| ID      | Feature               | Depends      | Done when                                                                                               |
| ------- | --------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| WRK-1   | Durable queue, worker | GEN-3        | Postgres queue with leases and retries; killing the worker mid-job reclaims it                          |
| WRK-2   | Provider adapters     | WRK-1, CAT-1 | One adapter per provider; a fake and a sandbox provider both produce a terminal generation              |
| WRK-3   | Terminal states       | WRK-2        | `succeeded` writes the output and settles; `failed` writes the code and releases; never stuck `running` |
| WRK-4   | Recovery              | WRK-1        | Boot reclaims expired leases; no accepted job is lost                                                   |
| NOTIF-1 | Notifications         | WRK-3        | One row per terminal transition; list and mark read; a retry does not duplicate                         |

### Billing lifecycle

| ID    | Feature                     | Depends      | Done when                                                                                    |
| ----- | --------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| BIL-3 | Reserve, settle, release    | BIL-1, GEN-3 | Failed job restores the exact amount; succeeded job charges once                             |
| BIL-4 | Idempotency                 | BIL-2, BIL-3 | `Idempotency-Key` on generation and top-up replays the original result                       |
| BIL-5 | Transaction history         | BIL-3        | Every balance change appears in the ledger, newest first                                     |
| BIL-6 | Payment method and receipts | BIL-2        | Card and invoices come from the Lemon Squeezy portal; auto top-up crosses once per threshold |

### Programmatic API and client

| ID    | Feature                | Depends             | Done when                                                                                                |
| ----- | ---------------------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| API-1 | API tokens             | ID-2                | A key creates and reads a generation; a revoked key gets 401                                             |
| API-2 | Parity and OpenAPI     | API-1, GEN-4, BIL-2 | OpenAPI file and a runnable example cover every route in the API table                                   |
| UI-1  | Wire the UI to the API | All engine tickets  | Studio, library, assets, billing, settings and notifications read real rows; no mock on a product screen |

### Hardening

| ID     | Feature                | Depends               | Done when                                                                                        |
| ------ | ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| PERF-1 | Acknowledgement budget | GEN-3                 | p95 under 1s at target load, measured in CI                                                      |
| SEC-1  | Authorisation matrix   | MED-2, GEN-4, NOTIF-1 | Every route tested as owner, other user and anonymous; foreign ids 404                           |
| OPS-1  | Observability          | WRK-1, BIL-4          | Request ids, queue depth, ack and completion latency, settlement failures, webhook replays       |
| QA-1   | End-to-end flow        | UI-1                  | Sign in → upload → quote → generate → notify → history → top up, plus failure and worker restart |

## Open decisions

| ID  | Needs                             | Working choice                                              |
| --- | --------------------------------- | ----------------------------------------------------------- |
| G1  | `api_keys` is not drawn           | Hashed keys owned by a `users` row                          |
| G6  | `notifications.type` values       | `generation_succeeded` / `generation_failed`                |
| G8  | Quotes have no table              | Derive, do not persist                                      |
| G10 | The queue is drawn as a component | Postgres queue with leases; no Redis until load requires it |

## Definition of done

1. `npm run typecheck`, `npm run lint`, `npm test` and `npm run build` pass.
2. New behaviour has a colocated test, including the failure path.
3. Authorisation is tested as owner, other user and anonymous for user data.
4. Billing replays its idempotency key; worker changes include a restart test.
5. `ARCHITECTURE.md` is updated when the contract, structure or rules change.
6. No demo catalogue, price or result is presented as real on a product screen.
