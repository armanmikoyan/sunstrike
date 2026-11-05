# Chronolab.ai — delivery plan

The UI is built. Everything behind it is not. This file is the work queue:
repository shape, every page and every control with where it must go, and small
tickets in the order they should be built.

**Work protocol:** say `agent work UI-3`. The agent reads that ticket, stops
and **clarifies with me before implementing**, waits for my answers, then
implements, runs the checks in "Definition of done" and reports. No ticket
starts before its `Depends` are closed. Answers are recorded in
`DECISIONS.md`.

---

# 1. Repository shape

Two apps, each with its own Dockerfile. No infra directory, no transcode step:
providers return finished MP4/JPG, we store the bytes as-is.

```text
apps/
  ui/                     Next.js: routes, RSC, components, no business rules
    Dockerfile            multi-stage, output: "standalone"
  server/                 API + background worker, one image
    Dockerfile            api  → node dist/api.js
                          worker → node dist/worker.js
    src/api/              HTTP surface
    src/worker/           queue consumer
    src/jobs/             generation orchestration
    src/billing/          checkout, webhooks, ledger posting
packages/
  contracts/              zod schemas, DTOs, error codes, shared types
  db/                     drizzle schema, migrations, query helpers
  billing/                LemonSqueezy client, webhook verify, ledger maths
  providers/              provider adapter interface + vendor clients
  config/                 pricing source of truth, tsconfig, eslint
```

**Boundaries**

- `apps/ui` imports `packages/contracts` and `packages/config` only. Never
  `db`, `billing`, `providers`, never a vendor SDK, never a provider key.
- `apps/server` owns every secret except the session cookie signing key.
- `packages/contracts` imports nothing but `zod`.
- `packages/config/pricing.ts` is the only place a price is written. `/pricing`,
  the composer estimate, the checkout call and the ledger all read it.

**Local development** — `docker compose up` starts `postgres`, `minio`,
`mailpit`, `api`, `worker`, `ui`. One command, no cloud account.

---

# 2. Pages and controls

Every control in the product, its current destination and its target. The
summary of what is broken, duplicated or dead today is in 2.14.

## 2.1 Global chrome

| Control | Today | Must go to |
| --- | --- | --- |
| Rail logo | `/` | `/` |
| Rail **Create** | always `/create/video` | last used studio, or `/create/video` first time |
| Rail Explore | `/explore` | `/explore` — public |
| Rail Library / Assets / Favorites | those routes | same, auth required |
| Rail Pricing / Help | those routes | public |
| Rail Billing | `/billing` | auth required |
| Rail Account settings | `/settings` | auth required |
| Rail **Workspace** | `/settings` (duplicate, wrong) | removed until teams exist |
| Rail account panel balance | `/pricing` | `/billing` — same meaning as the nav chip |
| Rail account menu | Billing, Account settings, Workspace (→ `/settings`), Help | drop the Workspace duplicate |
| Rail sign out | `/login` | clear the session, then `/` |
| Rail expand/collapse | Jotai atom | unchanged |
| Top nav Image / Video / Motion | mega menus | unchanged |
| Mega-menu CTA | `/create/image`, `/create/video` | unchanged |
| 18 mega-menu feature links | all point at the studio root | deep-link a preset (`/create/image?preset=relight`) or delete the list (UI-15a) |
| Nav search | cosmetic, no submit | `/search?q=…` (SERVER-9) |
| Notifications bell | static list, "View all" → `/library` | `/notifications` (SERVER-23) |
| Balance chip | `/billing` | unchanged, real balance (SERVER-19) |
| Mobile menu | drawer | unchanged |

## 2.2 `/` — Home (public)

| Control | Today | Must go to |
| --- | --- | --- |
| Hero video wall | decorative | unchanged |
| Composer mode switch | flips video/image | unchanged |
| Composer model menu | sets model, "Compare models" → `/pricing` | unchanged |
| Composer attach | upload / paste / library | real upload (UI-3) |
| Composer submit | `router.push('/create/'+mode)`, **prompt is lost** | `/create/{mode}` with prompt, model, aspect carried as a draft (UI-17) |
| Section action "Explore" | `/explore` | unchanged |
| Ratio mosaic tiles | `/create/{kind}` | same + preset |
| Pricing "Start creating" | `/pricing` | unchanged |
| Pricing "View billing" | `/billing`, shown to guests too | `/pricing` for guests, `/billing` when signed in (UI-15a) |
| Footer links | all valid | unchanged |

## 2.3 `/explore` — public feed

| Control | Today | Must go to |
| --- | --- | --- |
| "Publish a frame" | `/create/video` | upload-to-showcase flow for the signed-in user, `/login?next=/explore` otherwise (UI-8) |
| Gallery card | no action, hover only | `/a/{id}` asset detail (UI-9) |
| Card "Details" | `/explore` — a self-link on its own page | `/a/{id}` (UI-15b) |
| Card remix | `/create/{kind}`, prompt not carried | `/create/{kind}?remix={id}` (UI-17) |
| Search `?q=` | gallery ignores the query | filter the result set, or redirect to `/search` (SERVER-9) |
| Card heart | no handler | favorite toggle (UI-6) |
| Category filter | local state | URL query so it is shareable |

## 2.4 `/pricing` — public

| Control | Today | Must go to |
| --- | --- | --- |
| Top-up pack button | no checkout | checkout for that pack, `?return=` preserved (SERVER-17) |
| Image quantity slider | computes a quote locally | same maths from `packages/config/pricing` |
| Video order card CTA | `/billing` | checkout, or `/login?next=/pricing` for guests |
| "Auto top-up" section | promises a feature that does not exist | only after SERVER-20 ships, otherwise remove |
| FAQ "teams / shared workspace" | promises a feature that does not exist | remove until teams exist |

## 2.5 `/help` — public

| Control | Today | Must go to |
| --- | --- | --- |
| Guide cards | `/create/video`, `/pricing`, `/explore`, `/settings` | unchanged |
| Support links | `mailto:support@…` | real inbox, verified sending domain (SERVER-4) |

## 2.6 `/login` — public, no chrome

| Control | Today | Must go to |
| --- | --- | --- |
| Google button | decorative form | OAuth (SERVER-3, UI-1) |
| Email field / submit | decorative | magic link (SERVER-3, UI-1) |
| "Continue to studio" links | `/` | `/library` after sign-in |
| Footer legal links | `/help` | `/terms`, `/privacy` (PLATFORM-19) |

## 2.7 `/library` — auth

| Control | Today | Must go to |
| --- | --- | --- |
| "New generation" | `/create/video` | `/create/video`, or a mode picker |
| Stats row | fixed numbers | derived from assets and ledger (UI-5) |
| Tabs All / Video / Images | local filter | URL query, server-filtered |
| Search field | local filter | `/search` or server query (SERVER-9) |
| Card heart | visual only | real favorite toggle (UI-6) |
| Card open | no detail page | `/a/{id}` (UI-9) |
| Card download | none | signed URL download with cost + prompt metadata |

## 2.8 `/assets` — auth

| Control | Today | Must go to |
| --- | --- | --- |
| "Upload" header button | no handler | opens the picker (UI-3) |
| Drop zone / hidden input | opens the picker, discards the file (no `onChange`) | presigned upload (SERVER-8, UI-3) |
| Folder card | `/assets?folder=…` | real folder query |
| "New folder" | nothing | create folder |
| Filter Images / All | local | server filter |
| Asset options menu | nothing | rename, move, delete, **publish to showcase** (UI-8) |

## 2.9 `/favorites` — auth

| Control | Today | Must go to |
| --- | --- | --- |
| Collection list | static | real collections (UI-6) |
| "New collection" | no handler | create collection (UI-6) |
| "Open in studio" | `/create/video` | studio with the collection as references |

## 2.10 `/create/video` and `/create/image` — auth

| Control | Today | Must go to |
| --- | --- | --- |
| Back home | `/` | unchanged |
| Draft / Video / Image switch | client state + route | unchanged |
| Share project | button, no action | copy signed link, or remove until sharing exists |
| "Library" | `/library` | unchanged |
| Prompt + Enhance | Enhance writes a starter prompt | real enhance endpoint or remove |
| References | upload / paste / library | real upload (UI-3) |
| Model menu | local list | provider-backed model list with live cost |
| Aspect / Duration / Camera | local | sent to the provider |
| Advanced (negative prompt, seed, motion) | local | sent to the provider, persisted per draft |
| **Generate** | sets `queued = true`, nothing else | submit a job, show progress, render the result (UI-10) |
| Queue dialog | static | real queue |
| Takes list | 4 fixture items | real job history |
| Cost line | local maths | same source as billing (PLATFORM-4) |

## 2.11 `/billing` — auth

| Control | Today | Must go to |
| --- | --- | --- |
| "Add funds" | `/pricing` | `/pricing?pack=starter&return=/billing` |
| Balance | `$10.54` fixture | ledger sum (SERVER-19) |
| Payment method row | fixture | provider customer portal or saved method |
| Auto top-up card | toggle, no effect | SERVER-20, or hidden |
| Usage chart | fixture | aggregated jobs |
| Receipt row | link to nothing | invoice detail (UI-14) |
| "Contact support" | `/help` | unchanged |
| "Settings" link | `/settings` | unchanged |

## 2.12 `/settings` — auth, five tabs

| Control | Today | Must go to |
| --- | --- | --- |
| Tab rail | local state | `?tab=` query so links are shareable |
| Profile fields + Save | decorative | persist (UI-18) |
| Preferences toggles | decorative | persist |
| Notification toggles | decorative | persist + gate email (SERVER-23) |
| Security | decorative | passwordless info, session list, sign out all |
| API keys | decorative list | create / revoke / last used (SERVER-22) |

## 2.13 Pages that do not exist yet

| Route | Why |
| --- | --- |
| `/search` | nav and library search need a destination |
| `/a/[id]` | asset detail: preview, prompt, model, cost, download, favorite |
| `/notifications` | bell "View all" |
| `/settings?tab=workspace` | teams, or removed |
| `/checkout/success`, `/checkout/cancel` | return from the payment provider |
| `/verify`, `/reset` | only if password auth is ever added — not needed with magic links |
| `/terms`, `/privacy`, `/cookies` | required before launch |
| `/docs/api` | public API (SERVER-22 ships keys first) |
| `/status` | uptime and incidents, or an external status page |
| `/app` `not-found.tsx`, `error.tsx` | designed failure states, per route group |

---

## 2.14 Click audit — findings to fix

Full pass over every `href`, `router.push`, `onClick` and file input, 2026-11-06.
This is the source list for `UI-15a` and `UI-15b`.

### Cycles

```text
/pricing → /billing  ×6 (three pack buttons, image order card, video order card, auto top-up)
/billing → /pricing  ×2 ("Add funds", "Running low")
/home    → both, from the pricing block
```

Nothing completes: pricing sends you to billing to pay, billing sends you back to
price. Fix: pricing starts checkout directly and never links to billing; billing
links to `/pricing#packs` at most; balance always means `/billing`.

### Duplicate destinations

| Target | Links | Problem |
| --- | --- | --- |
| `/create/video` | 23 | includes "Publish a frame" and "Open in studio", which mean something else |
| `/create/image` | 14 | 13 of them are the image mega-menu |
| `/pricing` | 10 | four are balance/top-up controls that belong on `/billing` |
| `/help` | 10 | also receives Terms, Privacy and Forgot password |
| `/library` | 9 | 4 are studio exits, correct |
| `/billing` | 9 | six come from `/pricing` (the loop) |
| `/explore` | 8 | includes card "Details", which self-links on its own page |
| `/` | 6 | four are `/login` controls |
| `/settings` | 5 | rail and account menu both expose "Workspace" |
| `/assets`, `/favorites` | 1 each | rail only; no in-page or footer entry |
| `/login` | 1 | only reachable through sign out |

### Dead controls (render, do nothing)

Assets `Upload` header button, file input `onChange`, `New folder`, asset options
menu; favorites `New collection` and collection chips; media-card `Save` heart;
notification items; billing receipt `Download`; auto top-up switch (does not
persist); settings `Save` (does not persist); studio `Share project`; studio
`Generate` (sets local state only).

### Target graph

| From | Control | Destination |
| --- | --- | --- |
| Rail | Create / New generation | `/create/{lastMode}` |
| Rail + account menu | Workspace | removed until teams exist |
| Any balance | chip, account row, menu | `/billing` |
| `/pricing` | every buy button | checkout for that pack |
| `/billing` | Add funds | `/pricing#packs` |
| `/billing` | Tax | `/settings?tab=profile#tax` |
| `/billing` | receipt | `/billing/receipts/[id]` or provider invoice |
| `/library`, `/`, `/explore` | card Details | `/a/[id]` |
| any card | heart | favorite toggle |
| `/explore` | Publish a frame | publish flow |
| `/explore` | `?q=` | filter the gallery, or redirect to `/search` |
| Nav | search | `/search?q=` |
| Nav | notifications | items to asset/billing, "View all" to `/notifications` |
| Mega menu | feature links | `/create/{mode}?preset=…` or removed |
| `/login`, footer | Terms / Privacy | `/terms`, `/privacy` |
| `/login` | Forgot password | removed (magic link, no passwords) |
| Footer | status | `/status` or external status page |

---

# 3. Decisions needed before tickets

- **D-1 Billing provider** — LemonSqueezy (merchant of record, ~5% + $0.50, no
  off-session charges) vs Stripe (2.9% + $0.30, you handle VAT, full auto
  top-up). Recommendation: LemonSqueezy, auto top-up becomes a reload plan.
- **D-2 Wallet unit** — dollars only, no "credits" abstraction.
- **D-3 Auth** — Google + email magic link at launch; GitHub when the public API
  ships; Apple/Microsoft later.
- **D-4 Hosting** — AWS: ECS Fargate for `ui`, `api`, `worker`; RDS Postgres;
  S3 + CloudFront; Secrets Manager. Alternative for the first month: one EC2
  box running compose.
- **D-5 Server framework** — Fastify (schema validation, plugins) or Hono
  (lighter, edge-ready). Recommendation: Fastify.
- **D-6 Providers** — one aggregator (fal.ai) plus Google Veo direct; Seedance
  as a later adapter.
- **D-7 Media handling** — no ffmpeg. Provider output is stored as delivered;
  poster comes from the provider or the first frame URL they return.
- **D-8 Analytics** — GA4 with Consent Mode v2 behind a cookie banner; Google
  Search Console after the custom domain.

---

# 4. Tickets

Three tracks. They run in parallel; `Depends` is the only hard ordering.

| Track | Tickets | Owns |
| --- | --- | --- |
| **UI** | 23 | `apps/ui` — screens, forms, tables, empty and error states, copy, responsive, accessibility |
| **SERVER** | 25 | `apps/server` + `packages` — auth, data, storage, jobs, billing, moderation |
| **PLATFORM** | 20 | Repo split, shared packages, env, CI, deploy, logging, analytics, security, launch |

## UI — `apps/ui`

Screens, forms, tables, empty states, copy. No business rules,
no vendor SDKs, no secrets.

### UI-1 · Wire `/login`
Depends: SERVER-3
Clarify with me before implementing.
Scope: real form state, pending and error states (unknown email, expired link, rate limit), `?next=` preserved, redirect signed-in users to `/library`.
Done when: a wrong link shows designed copy, not a stack trace, and `?next=/create/video` returns there.

### UI-2 · Session in the shell
Depends: UI-1
Clarify with me before implementing.
Scope: server component reads the session, account menu with sign out, balance from the ledger, avatar fallback.
Done when: sign out clears the cookie and lands on `/`, and the shell never renders a user's name before the session resolves.

### UI-3 · Upload flow
Depends: SERVER-8, SERVER-6
Clarify with me before implementing.
Scope: presigned PUT from the browser, progress, cancel, retry, checksum, MIME sniffing, asset row creation, drop zone on `/assets` and the composer.
Done when: a 40 MB file uploads without passing through the API, and a `.exe` renamed `.jpg` is rejected.

### UI-4 · `/assets` from the database
Depends: UI-3
Clarify with me before implementing.
Scope: folder CRUD, listing queries, filters in the URL, options menu (rename, move, delete, publish), usage count, and the two dead controls from 2.14 — the header Upload button opens the picker and the drop zone keeps the selection.
Done when: reloading keeps the same view and an empty account sees a designed empty state.

### UI-5 · `/library` from the database
Depends: UI-3
Clarify with me before implementing.
Scope: cursor pagination, stats derived from assets and ledger, tab + search in the URL, per-card metadata.
Done when: page 2 loads without duplicates and the stats match a hand-checked account.

### UI-6 · Favorites and collections
Depends: UI-5
Clarify with me before implementing.
Scope: join table, optimistic toggle, collection CRUD, "open in studio" passes reference ids. The card heart becomes a real toggle everywhere a `MediaCard` renders, replacing the button that currently has no handler.
Done when: a toggle survives reload and the count is derived, not stored.

### UI-7 · `/explore` from the database
Depends: UI-5, SERVER-7
Clarify with me before implementing.
Scope: publish flag with consent, public query, category filter in URL, report action, cursor pagination.
Done when: an unpublished asset never leaks into the feed, and unpublishing removes it within a minute.

### UI-8 · Upload a finished video to the showcase
Depends: SERVER-8, UI-3, UI-7
Clarify with me before implementing.
Scope: an explicit "Publish to showcase" action on a finished render or on any uploaded file — presigned upload, preview, rights attestation, public-visibility warning, optional prompt/model/cost fields, review state while moderation is pending, publish and unpublish. Files generated outside Chronolab are accepted: no `generation_jobs` row is required, the asset carries `source = upload`.
Done when: a file picked from disk appears in `/explore` without a job row, nothing becomes public without the attestation, and unpublishing hides it within a minute.

### UI-9 · Asset detail and download
Depends: UI-5
Clarify with me before implementing.
Scope: `/a/[id]` with preview, prompt copy, model, cost, seed, favorite, download (signed URL), remix into studio. Every card "Details" control opens it — today it points at `/explore`, which is a self-link on the feed and the wrong context from the library.
Done when: every library and explore card opens the same page and the download link expires in 5 minutes.

### UI-10 · Studio submit
Depends: SERVER-10, SERVER-12, SERVER-13
Clarify with me before implementing.
Scope: Generate posts the draft (prompt, model, aspect, duration, camera, seed) → optimistic queue row → status → result replaces the preview → take appears in the list.
Done when: a real render appears in `/library` without a refresh, and a rejected prompt shows why.

### UI-11 · Failure and refund states
Depends: SERVER-13, UI-10
Clarify with me before implementing.
Scope: designed states for timeout, moderation block, insufficient balance, provider outage; retry affordance; automatic reversal; support link with the job id.
Done when: every failure path ends with a correct balance and a sentence a user can act on.

### UI-12 · `/billing` from the database
Depends: SERVER-19
Clarify with me before implementing.
Scope: real balance, payment method, usage chart by model, receipt list, low-balance state, auto top-up control (or hidden). "Add funds" goes to `/pricing#packs`; this page must never send the user back into the checkout loop described in 2.14. Receipt "Download" becomes a real link.
Done when: a fresh account sees $0, no receipts, and a clear first action.

### UI-13 · `/pricing` and the round trip
Depends: SERVER-17
Clarify with me before implementing.
Scope: live prices, pack → checkout → return → studio with the draft intact, cancel path, "insufficient balance" inline recovery from the studio. The four buy buttons start checkout directly and this page stops linking to `/billing`, which is what closes the loop in 2.14.
Done when: studio → add funds → pay → back in the studio with the same prompt, one flow, no dead end.

### UI-14 · Receipts and invoices
Depends: SERVER-19
Clarify with me before implementing.
Scope: receipt rows linked to the provider invoice, per-render line items, tax details from the merchant of record.
Done when: every payment has a downloadable receipt and refunds show as a credit line.

### UI-15a · Link and route audit — wrong destinations
Depends: —
Clarify with me before implementing.
Scope: fix the findings in 2.14 that need no new route:
- break the `/pricing` ↔ `/billing` loop (pricing buy buttons start checkout, pricing stops linking to billing, billing's "Add funds" goes to `/pricing#packs`)
- balance points at `/billing` everywhere (nav chip, account panel, account menu)
- remove the duplicate "Workspace" entry (rail + account menu), which currently opens `/settings`
- Create / New generation keep the last studio mode instead of always opening video
- `/` "View billing" hidden for signed-out visitors; rates footer opens `/create/image` under image rates; Billing "Tax" opens the profile tab, not generic settings
- 18 mega-menu feature links: preset query or removed
- notifications "View all" → `/notifications` (route exists by then, otherwise keep `aria-disabled`)
- login and footer Terms/Privacy → `/terms`, `/privacy`; remove "Forgot password" until password auth exists
- hide dead buttons instead of rendering them: assets Upload/New folder/asset options, favorites New collection, studio Share, billing receipt Download, media-card Save
Done when: no link in section 2 is wrong, no rendered button is a no-op, and a test asserts every internal href resolves to a known route.

### UI-15b · Point cards and CTAs at the new pages
Depends: UI-9, UI-8, SERVER-9, SERVER-23, SERVER-17
Clarify with me before implementing.
Scope: replace placeholder destinations with the real ones: media-card "Details" → `/a/[id]` (today it self-links to `/explore` from explore, and leaves library for the public feed), card heart → favorite toggle, explore "Publish a frame" → publish flow, nav search → `/search?q=`, notification items → asset or billing, pricing CTAs → checkout session.
Done when: every control in 2.14's target graph opens the page named there, and nothing falls back to `/explore`.

### UI-16 · Active navigation from the route
Depends: UI-15a
Clarify with me before implementing.
Scope: derive rail and header active state from `usePathname`, including nested settings tabs and `/a/[id]`.
Done when: deep links highlight the right item after a hard reload.

### UI-17 · Prompt handoff
Depends: UI-10
Clarify with me before implementing.
Scope: home composer → studio carries prompt, model, aspect, duration, attachment; guest drafts survive login; studio edits update the draft.
Done when: submit on home lands in the studio with the same text, and a refresh keeps it.

### UI-18 · Settings persistence
Depends: SERVER-6
Clarify with me before implementing.
Scope: profile, preferences, notifications; validation; dirty state; success and failure feedback; `?tab=` deep links.
Done when: every toggle survives reload and a failed save keeps the old value visible.

### UI-19 · Loading, empty and error boundaries
Depends: UI-5
Clarify with me before implementing.
Scope: `loading.tsx` + `error.tsx` per route group, `not-found.tsx`, first-run empty states for library/assets/favorites/explore, skeleton reuse (the studio one is the pattern).
Done when: a thrown error in any route shows designed copy with a retry, and a new account never sees a blank grid.

### UI-20 · Responsive pass with real data
Depends: UI-19
Clarify with me before implementing.
Scope: long prompts, missing thumbnails, $0 balance, 30-item queues, receipt tables, settings forms.
Done when: no horizontal scroll and no clipped control at any target width.

### UI-21 · Copy truth audit
Depends: PLATFORM-7, UI-15a
Clarify with me before implementing.
Scope: remove or implement every claim: teams, shared workspace, auto top-up, share project, enhance, publish a frame, 4K upscale, commercial license.
Done when: no screen promises a feature that does not exist.

### UI-22 · Accessibility
Depends: UI-19
Clarify with me before implementing.
Scope: rail, studio composer, dialogs, tables; focus traps, labels, keyboard order, reduced motion, contrast on dark panels.
Done when: keyboard-only completion of the money path and zero serious axe violations.

## Server — `apps/server` + `packages`

HTTP surface, auth, jobs, billing, storage. Owns every secret.

### SERVER-1 · Database schema and migrations
Depends: PLATFORM-1, D-4
Clarify with me before implementing.
Scope: users, sessions, workspaces, memberships, assets, folders, favorites, generation_jobs, credit_ledger, payments, receipts, api_keys, notification_prefs, webhook_events; migrations checked in; seed script.
Done when: `db:migrate` and `db:seed` create a working DB from empty, and a test proves two workspaces cannot read each other's assets.

### SERVER-2 · Server skeleton
Depends: PLATFORM-1, PLATFORM-3
Clarify with me before implementing.
Scope: HTTP app with `/health`, request id, structured errors, zod validation, auth guard hook, CORS for the UI origin, graceful shutdown.
Done when: unknown routes return the error envelope, `/health` checks DB and storage, and logs are one JSON line per request.

### SERVER-3 · Sessions, Google OAuth, email magic link
Depends: SERVER-1, SERVER-2, D-3
Clarify with me before implementing.
Scope: OAuth callback, magic-link request + verify, session table, httpOnly `SameSite=Lax` cookie with 30-day sliding expiry, sign-out endpoint.
Done when: both providers land on `/library` with a session row, and a used magic link cannot be replayed.

### SERVER-4 · Transactional email
Depends: SERVER-3
Clarify with me before implementing.
Scope: provider client, magic-link template, receipt template, bounce/complaint handling, SPF/DKIM/DMARC instructions.
Done when: a real address receives a link in under 10 seconds and mail-tester scores pass.

### SERVER-5 · Route protection
Depends: SERVER-3
Clarify with me before implementing.
Scope: `apps/ui` middleware does cookie presence only; `apps/server` does the authoritative check; protect `/library`, `/assets`, `/favorites`, `/create/*`, `/billing`, `/settings`; keep `/create/:mode` validation in `proxy.ts`.
Done when: direct hits redirect to `/login?next=…`, the API rejects a forged cookie with 401, and every URL still resolves.

### SERVER-6 · Workspace scoping
Depends: SERVER-1, SERVER-5
Clarify with me before implementing.
Scope: `getWorkspace()` guard used by every read/write, `workspace_id` on every owned row, no query without it.
Done when: a cross-workspace id returns 404, proven by a test.

### SERVER-7 · Account deletion and export
Depends: SERVER-6
Clarify with me before implementing.
Scope: request → scheduled delete, JSON export of assets, jobs and ledger, S3 object deletion, confirmation email.
Done when: a deleted account cannot sign in, and its objects are gone from the bucket.

### SERVER-8 · Storage adapter
Depends: PLATFORM-2
Clarify with me before implementing.
Scope: `put`, `signGet`, `delete`, `presignPut`; local filesystem driver for dev; private `assets/` prefix, public `public/` prefix; lifecycle rules.
Done when: an upload lands in the bucket, plays through a short-lived signed URL, and never appears in a public listing.

### SERVER-9 · Search
Depends: UI-5
Clarify with me before implementing.
Scope: `GET /v1/search`, nav submit → `/search?q=`, grouped results (assets, prompts), keyboard navigation, empty state, debounce. `/explore?q=` must either filter the gallery or redirect here; today the query is silently ignored.
Done when: a prompt fragment finds the asset, and the nav search stops being decorative.

### SERVER-10 · Provider adapters
Depends: SERVER-2, D-6
Clarify with me before implementing.
Scope: `ProviderAdapter` (`submit`, `poll`, `webhook`, `cancel`, `normalize`), fal.ai adapter, Veo adapter (Service Account, not API key), fake adapter for tests.
Done when: the same job shape drives both vendors and the fake adapter can complete a job in unit tests.

### SERVER-11 · Job state machine
Depends: SERVER-1
Clarify with me before implementing.
Scope: `queued → running → succeeded | failed | canceled`, attempt count, provider job id, cost, error code, illegal transitions throw.
Done when: a redelivered webhook cannot move a succeeded job back to running.

### SERVER-12 · Queue and worker
Depends: PLATFORM-2, SERVER-11
Clarify with me before implementing.
Scope: enqueue with idempotency key, at-least-once processing, exponential retry, dead-letter after 3 attempts, max-runtime kill, concurrency limit.
Done when: killing the worker mid-job resumes without double-charging and without duplicate assets.

### SERVER-13 · Credit reservation and settlement
Depends: SERVER-1, PLATFORM-4
Clarify with me before implementing.
Scope: pending debit on submit, settle to actual on success, reversing entry on failure, balance exposed through the API.
Done when: ledger sum always equals the balance endpoint, and a failed job leaves the user exactly where they started.

### SERVER-14 · Progress transport
Depends: UI-10
Clarify with me before implementing.
Scope: SSE per workspace with reconnect, fallback to polling, no leaked connections on unmount, progress percentage where the vendor provides it.
Done when: closing and reopening the studio mid-render shows the correct state.

### SERVER-15 · Limits
Depends: UI-10
Clarify with me before implementing.
Scope: concurrent jobs, jobs per hour, prompt length, upload size, per-key API rate limit; visible feedback in the studio.
Done when: the 4th concurrent job shows a queue message rather than a 500.

### SERVER-16 · Spend caps
Depends: SERVER-10
Clarify with me before implementing.
Scope: per-provider spend counter, alert at 80%, hard stop that queues jobs, admin override.
Done when: a simulated cap stops submissions and the alert fires once, not every request.

### SERVER-17 · Products and checkout
Depends: PLATFORM-7, SERVER-5
Clarify with me before implementing.
Scope: product/price ids in env, `POST /v1/checkout` creating a session with `return` and `cancel` urls, UI buttons on `/pricing` and `/billing`.
Done when: test-mode checkout returns to the originating page with the pack recorded.

### SERVER-18 · Payment webhooks
Depends: SERVER-17, SERVER-1
Clarify with me before implementing.
Scope: raw-body HMAC verification, `webhook_events` dedupe, handlers for order paid, refund, subscription created/cancelled, 2xx only after persistence.
Done when: replaying the same event twice produces one ledger entry.

### SERVER-19 · Ledger API and balance
Depends: SERVER-13, SERVER-18
Clarify with me before implementing.
Scope: `GET /v1/billing/summary` (balance, usage 14 days, recent entries), server-derived sums, no mutable balance column.
Done when: the number in the nav chip equals `/billing` equals the ledger sum.

### SERVER-20 · Auto top-up
Depends: PLATFORM-7, SERVER-18
Clarify with me before implementing.
Scope: threshold + pack, trigger point, failure email, retry rules, off switch, visible history.
Done when: a balance dropping below the floor triggers exactly one charge and a receipt.

### SERVER-21 · Refunds and disputes
Depends: SERVER-18
Clarify with me before implementing.
Scope: refund webhook → reverse ledger, negative-balance rules, dispute state that restricts generation, admin action to grant credit.
Done when: a refunded order cannot be spent twice and the user sees why.

### SERVER-22 · API keys
Depends: SERVER-6
Clarify with me before implementing.
Scope: create (show once), list, revoke, last used, scopes, hashed at rest; wire the existing tab.
Done when: a revoked key gets 401 within a minute and the plaintext is never stored.

### SERVER-23 · Notifications
Depends: SERVER-6
Clarify with me before implementing.
Scope: notification rows (render complete, low balance, refund), unread badge, `/notifications`, mark read, digest email gated by preferences. Dropdown items open the related asset or billing page, and "View all" goes to `/notifications` instead of `/library`.
Done when: a completed job creates one notification, not one per poll.

### SERVER-24 · Abuse and bots
Depends: SERVER-3
Clarify with me before implementing.
Scope: sign-up throttling, magic-link rate limit, generation spam limits, flagged-workspace review queue.
Done when: a scripted sign-up loop is stopped without blocking a normal user.

### SERVER-25 · Moderation
Depends: UI-10
Clarify with me before implementing.
Scope: prompt filter, provider rejection handling, report button on published assets, takedown path, policy page.
Done when: a blocked prompt costs nothing and shows a clear reason.

## Platform — repo, contracts, CI, deploy, observability

Everything that has to exist before the other two tracks can ship.

### PLATFORM-1 · Split the repo into `apps/ui`, `apps/server`, `packages/*`
Depends: D-5
Clarify with me before implementing.
Scope: create the workspace tree, move the Next app to `apps/ui` unchanged, add empty `apps/server` with a hello endpoint, wire root scripts (`dev`, `build`, `test`, `lint`) to run both.
Done when: `npm run dev` starts both, `next build` passes from `apps/ui`, imports resolve through the workspace packages, no duplicated `src`.

### PLATFORM-2 · Dockerfiles and local compose
Depends: PLATFORM-1
Clarify with me before implementing.
Scope: multi-stage Dockerfiles, non-root user, `HEALTHCHECK`; `compose.yaml` with postgres, minio, mailpit, api, worker, ui; `.dockerignore`.
Done when: `docker compose up` serves the UI and API with a seeded local DB, and the server image runs as both `api` and `worker` by command.

### PLATFORM-3 · `packages/contracts`
Depends: PLATFORM-1
Clarify with me before implementing.
Scope: request/response schemas and inferred types for auth, assets, jobs, billing; one error envelope `{ error: { code, message, requestId } }`; shared enums for job status and asset kind.
Done when: ui and server import the same types, and a schema change breaks both builds.

### PLATFORM-4 · `packages/config` — pricing source of truth
Depends: PLATFORM-1
Clarify with me before implementing.
Scope: move `src/lib/pricing` and `src/lib/generation` rates into `packages/config/pricing.ts`; export `getGenerationCost`, image tiers, top-up packs; UI reads it, server charges from it.
Done when: one file changes a price everywhere, and a test asserts the quote the composer shows equals the amount the ledger debits.

### PLATFORM-5 · Environment validation
Depends: PLATFORM-1
Clarify with me before implementing.
Scope: zod-parsed env per app, `.env.example` with comments, fail-fast at boot and at build, no secret under `NEXT_PUBLIC_`.
Done when: booting with a missing key names the key and exits non-zero.

### PLATFORM-6 · CI
Depends: PLATFORM-1, PLATFORM-2
Clarify with me before implementing.
Scope: install → typecheck → lint → unit → build → docker build for both apps; service containers for postgres and minio; cache node_modules and Next build.
Done when: a red PR cannot merge and the pipeline runs under 10 minutes.

### PLATFORM-7 · Lock the billing model
Depends: D-1
Clarify with me before implementing.
Scope: write the model into `DECISIONS.md` + `/pricing` copy: wallet in dollars, top-up packs, image tiers, what auto top-up means precisely, refund policy.
Done when: every billing string in the UI matches an implemented behaviour or is removed.

### PLATFORM-8 · Structured logging
Depends: SERVER-2
Clarify with me before implementing.
Scope: pino JSON with request id, user id, workspace id, job id; redact tokens and emails; level from env.
Done when: one render can be traced end to end from the log stream.

### PLATFORM-9 · Error tracking
Depends: PLATFORM-1
Clarify with me before implementing.
Scope: ui + api + worker, release tagging, source maps, PII scrubbing, alert on new issue.
Done when: a thrown error in each app appears with a readable stack and the right release.

### PLATFORM-10 · Analytics and consent
Depends: UI-19
Clarify with me before implementing.
Scope: Consent Mode v2, cookie banner with real categories, event schema (`signup`, `generation_started`, `generation_succeeded`, `checkout_started`, `purchase_completed`), no events before consent.
Done when: no analytics request fires before consent and the funnel is visible in GA4.

### PLATFORM-11 · SEO and Search Console
Depends: UI-15a
Clarify with me before implementing.
Scope: metadata per route, canonical URLs, `sitemap.xml`, `robots.txt`, OG images, JSON-LD for pricing, Search Console verification.
Done when: the sitemap lists public routes only and Search Console shows no coverage errors.

### PLATFORM-12 · Health, uptime and alerts
Depends: SERVER-2
Clarify with me before implementing.
Scope: `/health` (DB, storage, queue), uptime monitor, alerts for 5xx rate, failed jobs, queue age, webhook failures, provider spend.
Done when: each alert has a runbook link and fires at most once per incident.

### PLATFORM-13 · Backups and restore
Depends: SERVER-1
Clarify with me before implementing.
Scope: daily snapshots with PITR, S3 versioning, restore rehearsal, documented restore steps.
Done when: a restore into a scratch environment brings back a seeded account and its assets.

### PLATFORM-14 · Secrets and IAM
Depends: PLATFORM-2
Clarify with me before implementing.
Scope: task roles, least privilege, rotation steps, build-time check that no secret is in the client bundle.
Done when: the UI bundle contains no server key and a rotated key needs no code change.

### PLATFORM-15 · Deploy pipeline and rollback
Depends: PLATFORM-6, PLATFORM-2
Clarify with me before implementing.
Scope: build → push to ECR by SHA → migration task → update services → smoke test (`/health` + one fake render); rollback by previous task definition.
Done when: a merge to `main` deploys and a failed smoke test rolls back automatically.

### PLATFORM-16 · Test plan
Depends: —
Clarify with me before implementing.
Scope: settle the shape, restore coverage floors, delete whatever the decision orphans (right now a half-migrated helper sits in `src/test-utils`).
Done when: `npm test`, `npm run test:coverage` and `ARCHITECTURE.md` all describe the same suite.

### PLATFORM-17 · Money-path e2e
Depends: UI-13, UI-10
Clarify with me before implementing.
Scope: sign up → add funds → render → see it in library → download → receipt; audio/video assertions kept minimal.
Done when: the flow passes twice in a row on a clean database.

### PLATFORM-18 · Security review
Depends: SERVER-5, UI-3, SERVER-17
Clarify with me before implementing.
Scope: CSRF on mutations, SSRF on remote assets, upload validation, open redirect on `?next=`, session fixation, IDOR sweep, rate limits.
Done when: every item has a test or a documented mitigation.

### PLATFORM-19 · Legal surface
Depends: PLATFORM-7
Clarify with me before implementing.
Scope: `/terms`, `/privacy`, `/cookies`, AI content policy, DMCA contact, sub-processor list.
Done when: the footer legal links resolve and the cookie banner matches the actual tags.

### PLATFORM-20 · Launch checklist
Depends: all
Clarify with me before implementing.
Scope: domain, DNS, SPF/DKIM/DMARC, favicons, OG cards, 404/500, status page, support inbox, analytics consent, a final full money-path run.
Done when: a stranger signs up and pays without help, and the runbook is one page.

---

# 5. Definition of done (every ticket)

1. Works against the real service in staging.
2. Types, lint and the agreed test level pass; `next build` passes.
3. Loading, empty and error states designed, not improvised.
4. Copy in `constants.ts`, sentence case, no red/crimson/rose, no decorative dots.
5. `ARCHITECTURE.md` updated if a boundary, folder or token changed.
6. No secret in a client bundle, no `console.log`, no fixture data pretending to be user data.
7. `DECISIONS.md` updated with anything that was answered during the ticket.

---

# 6. Suggested order

All three tracks can start on the same day after PLATFORM-1 → PLATFORM-4.

**Platform**

```text
PLATFORM-1 → PLATFORM-2 → PLATFORM-3 → PLATFORM-4 → PLATFORM-5 → PLATFORM-6
→ PLATFORM-7 → PLATFORM-8 → PLATFORM-9 → PLATFORM-10 → PLATFORM-11
→ PLATFORM-12 → PLATFORM-13 → PLATFORM-14 → PLATFORM-15
→ PLATFORM-16 → PLATFORM-17 → PLATFORM-18 → PLATFORM-19 → PLATFORM-20
```

**Server**

```text
SERVER-1 → SERVER-2 → SERVER-3 → SERVER-4 → SERVER-5 → SERVER-6 → SERVER-7
→ SERVER-8 → SERVER-9 → SERVER-10 → SERVER-11 → SERVER-12 → SERVER-13
→ SERVER-14 → SERVER-15 → SERVER-16 → SERVER-17 → SERVER-18 → SERVER-19
→ SERVER-20 → SERVER-21 → SERVER-22 → SERVER-23 → SERVER-24 → SERVER-25
```

**UI** (starts once its `Depends` are closed)

```text
UI-1 → UI-2 → UI-3 → UI-4 → UI-5 → UI-6 → UI-7 → UI-8 → UI-9
→ UI-10 → UI-11 → UI-12 → UI-13 → UI-14 → UI-15a → UI-15b → UI-16
→ UI-17 → UI-18 → UI-19 → UI-20 → UI-21 → UI-22
```

The first real milestone is the money path:
`PLATFORM-1…6` + `SERVER-1…13` + `UI-1…5, UI-10` + `SERVER-17…19` + `UI-12,13`.
Everything else hardens it.

