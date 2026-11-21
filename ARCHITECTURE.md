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
mounts every module, `main.ts` serves HTTP, and `worker.ts` runs background jobs.

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
it, expose it on the module's public object, as `identity.requireAuth` is.

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
  `infrastructure` and `middleware`; domain helpers stay inside their module.
- Dependencies stay acyclic and point one way.

### Infrastructure

`src/infrastructure` is the only place a database, cache, queue or storage
client is created or imported. A strict boundary is what makes later extraction
cheap; the monolith stays one deployment either way.

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
