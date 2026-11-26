# Chronolab.ai architecture

Chronolab.ai is a generative media product. Its system design — requirements,
entities, API, data flow, services and deep dives — is on the design board,
[`architecture.excalidraw`](./architecture.excalidraw). This document describes
the repository that implements it: the parts it is made of, what each part owns,
and the conventions that keep them consistent.

## Parts

Chronolab.ai is one npm workspace with two apps.

- **Engine** (`apps/engine`) — the backend. An Express service and its worker:
  validation, pricing, persistence, jobs, outcomes and authentication. It is
  the only part that talks to Supabase.
- **Lab** (`apps/lab`) — the frontend. A Next.js app for the browser and the
  server that renders it: rendering, interaction and client state. It imports
  no Supabase package and holds no Supabase key.

## Engine

`apps/engine` is a modular monolith: one deployable, divided into modules by
business domain. A module owns one area of behaviour, the data behind it, and
the public interface other modules use to reach it. `app.ts` builds the app and
mounts every module, `main.ts` serves HTTP, `worker.ts` runs background jobs,
and `sync.ts` syncs the catalog from its providers once.

### Modules

| Module          | Owns                                                                                    |
| --------------- | --------------------------------------------------------------------------------------- |
| `auth`          | Supabase session and API-token verification, sign-in flows, `requireAuth`               |
| `users`         | Application user profiles and account details                                           |
| `health`        | Runtime health check (`/health`) probing engine and database status                     |
| `catalog`       | Models, capabilities, `active` enable/disable, Runware mappings and synced costs, Redis |
| `pricing`       | Selling prices (`model_prices`), markups, discounts, public rates and stateless quotes  |
| `offerings`     | Models a customer can use now, with their options and selling price                     |
| `billing`       | Balances, top-ups (Lemon Squeezy), reserve/capture/release, refunds; no pricing deps    |
| `generation`    | Validate via `catalog`, quote via `pricing`, snapshot price, reserve via `billing`, run |
| `media`         | Uploaded assets, short-lived signed Storage URLs, registered generation outputs         |
| `templates`     | Curated source templates and their customisation options                                |
| `notifications` | Terminal job updates, unread list and read state                                        |

### Module files

Each file has one job, and the table below says which.

| File            | Owns                                                            |
| --------------- | --------------------------------------------------------------- |
| `index.ts`      | Public interface: a module-named object of services, plus types |
| `router.ts`     | The module's URLs and the controller for each                   |
| `controller.ts` | Network only: read the request, call one service, write reply   |
| `service.ts`    | Business logic only: the module's rules and decisions           |
| `repository.ts` | Database only: read and write the module's own tables           |
| `types.ts`      | The shapes that cross a boundary                                |
| `constants.ts`  | Fixed values: names, mappings and limits the module shares      |
| `utils.ts`      | Pure helpers only: shape, format or check, no state, no I/O     |
| `middleware.ts` | Module-level request middleware, where the module has it        |
| `worker.ts`     | Background jobs, where the module has them                      |
| `providers/`    | Adapters for external services, where needed                    |

`utils.ts` holds the module's pure helpers: small functions that shape, format
or check values, with no state and no I/O. They keep that work in one place for
the controller, service and repository.

Global middleware — security headers, CORS, compression, body parsing and
logging — lives in `src/middleware`. Middleware that belongs
to one module lives in that module's `middleware.ts`. When another module needs
it, expose it on the module's public object, as `auth.requireAuth` is.

### Module rules

- **Single responsibility.** One file, one job. A helper goes in `utils.ts`,
  SQL in `repository.ts`, a rule in `service.ts`, request and reply in
  `controller.ts` — never in each other's files.
- **Modules talk only through `index.ts`.** Import a module as
  `@/modules/<module>` and use the object it exports, named after the module:
  `import { users } from "@/modules/users"` gives `users`. Everything else —
  controller, service, repository, worker, providers, tables — is private.
  When a need does not fit, extend the object; never reach around it.
- **One import path, one exception.** Never import a file inside a module, only
  `@/modules/<module>`. `app.ts` is the only exception: it imports each
  module's `router.ts` to mount it, and nothing else imports a router.
- **Build the public interface, never re-export.** The public interface is one
  object named after the module, such as `export const users = { … }`, built
  from its services; controllers and routers never enter it, and the types
  others use are exported beside it. No `export … from "./file"` barrel, and
  never a generic object name like `contract` — every module would collide on
  import.
- **Own your data.** A module reads and writes its own tables. Cross-module
  joins, direct reads and shared tables are out; the owning module answers.
- **Ask for data, publish facts.** A need is a direct call through the public
  interface. A state change others may care about is an event carrying only the
  fields they need, and the publisher does not know its listeners.
- **Share snapshots, not entities.** A cross-module type is a read model with
  the fields the caller uses, never another module's domain object.
- **One transaction, one module.** A module commits its own changes.
  Cross-module consistency comes from compensation or events, never from a
  transaction that spans boundaries.
- **Keep the shared kernel small.** Cross-cutting technical code lives in
  `infra`, `middleware` and `shared`; domain helpers stay inside
  their module. `shared/types.ts` and `shared/utils.ts` hold the types and
  helpers every module uses, such as the HTTP errors; `middleware` holds only
  request middleware and its own helpers.
- Dependencies stay acyclic and point one way.
- **Orchestrators compose, owners decide.** `offerings` (reads) and
  `generation` (writes) combine other modules through their public objects
  and own no business data of theirs; neither depends on the other. Clients
  get composed answers from these modules, never by joining two responses in
  the lab.

### Catalog sync

The catalog fills its models from provider adapters in `catalog/providers/`;
Runware is the only one. A sync writes what the provider knows and keeps what
we decide:

| Source            | Fields                                                                              |
| ----------------- | ----------------------------------------------------------------------------------- |
| Provider (synced) | Availability, capabilities, upstream cost (highest published rate), vendor and logo |
| Catalog (ours)    | Which models exist and their provider key, name, summary, order                     |
| Pricing (ours)    | Selling price and rules; never synced                                               |

- **The sync is manual today.** `sync.ts` runs it once and exits through the
  `catalog:sync` script. Nothing schedules it, so the catalog only changes
  when someone runs it, and a new model stays inactive until its first sync.
- **Scheduling it is a worker job**, and it waits on two changes. A sync
  overwrites `active` with upstream availability, so a model we disabled
  comes back on; the catalog needs separate "disabled by us" and "available
  upstream" flags. A synced cost can also rise above the selling price
  unnoticed, so the job must flag it until the price admin guards the margin.

### Media storage

Files live in one private Supabase Storage bucket, `media`, reached only
through `infra/storage` with the secret key. The engine authorises every
request itself and hands out short-lived signed URLs; the lab never sees a
key or a raw storage path.

- **Upload in two steps.** `POST /api/v1/assets/uploads` checks the declared
  type and size, picks the path (`<owner>/<asset id>.<ext>`) and returns a
  one-time upload URL with a pending asset. The client `PUT`s the file there,
  then `POST /api/v1/assets/{id}/complete` reads the stored object and only
  marks it ready when its real type and size match; otherwise it is removed.
- **Read through a signed URL.** `GET /api/v1/assets/{id}` returns the asset
  with a URL that expires in five minutes. Another user's asset is a 404,
  never a 403. Assets without an owner are shared, such as template sources.
- **Limits in two places.** The media module's constants and the bucket
  itself both hold the accepted types and the size cap, so Storage rejects
  what slips past the engine.

### Infrastructure

`src/infra` is the only place a database, cache, queue or storage
client is created or imported. `src/infra/index.ts` owns startup
connection, shutdown and health probing (`connectInfra`, `disconnectInfra`,
`checkInfraHealth`), so `app.ts` only wires middleware and module routers and
`main.ts` only starts the server. A strict boundary is what makes later
extraction cheap; the monolith stays one deployment either way.

## Lab

`apps/lab` is the Next.js app. Pages stay thin: each renders one feature
component, so markup and chrome live in `components`. Route groups describe
chrome, not URLs.

### API layer

`src/app/api` is the lab's server boundary. The private `_engine` module is the
client that talks to the engine; route handlers expose only the operations the
browser needs. Browser code calls those routes, never the engine directly.

### Component files

Every folder under `src/components` splits by job. `index.tsx` declares the
feature component and its logic, and nothing else.

| File                   | Holds                                                            |
| ---------------------- | ---------------------------------------------------------------- |
| `index.tsx`            | The component and its logic                                      |
| `types.ts`             | Every `type` and `interface`                                     |
| `constants.ts`         | Every named constant, `UPPER_SNAKE_CASE`, including visible copy |
| `utils.ts`             | Every reusable function, as `function` declarations              |
| `hooks.ts`             | Custom hooks, `useXxx`, usually returning one object             |
| `state.ts`             | Jotai atoms for state shared beyond one component                |
| `<feature>-<part>.tsx` | Private subcomponents                                            |
| `*.test.ts(x)`         | Tests, colocated with the file they cover                        |

- Import the defining file directly; folders hold files, not re-exports.
- One type per shape, reused with `Pick`, `Omit`, an intersection or a shared
  prop type. Prop types are named.

### UI

| Folder                     | Belongs here                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `src/ui`                   | Generic, product-agnostic primitives: one file per component, types and class strings inline                                         |
| `src/components/<feature>` | Anything with product copy, domain types, data, composition or feature state. A part reused inside one feature stays in that feature |
| `src/motion`               | Reusable animation primitives and transitions, each in its own folder                                                                |
| `src/hooks`                | Generic, product-agnostic React hooks, one file per hook                                                                             |
| `src/mocks`                | Demo data shown until the engine serves it, and engine-shaped replies for tests and e2e; components never define their own           |

- The same UI in two places is one shared component configured by props.
- The primitive owns height, radius and text scale; call sites override layout
  only. A different size is a change to the primitive, not to one page.
- A primitive grows through named props.

### Tests

- Colocate `<file>.test.ts(x)` next to the file it covers.
- Cover behaviour and rules: components, `utils.ts` and `hooks.ts`.
- Playwright specs live in `src/e2e`, end in `.e2e.ts`, and wait for
  `data-hydrated="true"`.
- Query by role, accessible name, label or visible copy.

## Changing the system

- A product, data or API change starts on the design board, becomes a roadmap
  ticket, and only then becomes code.
- A change to the repository shape or to a convention above updates this file
  in the same change.
- Scripts live in `package.json`; commands are not copied into documentation.
