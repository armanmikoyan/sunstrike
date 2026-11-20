# Chronolab.ai architecture

Chronolab.ai is a generative media product. Its system design — requirements,
entities, API, data flow, services and deep dives — is on the design board,
[`architecture.excalidraw`](./architecture.excalidraw). This document describes
the repository that implements it: how the code is divided, which layer owns
what, and the conventions that keep it consistent.

## Engine and lab

Chronolab.ai is an npm-workspace monorepo with two apps, `lab` and `engine`.
`apps/lab` runs the browser bundle and the Next.js server that renders it.
`apps/engine` runs the Express service and its worker. The API layer in
`apps/lab/src/app/api` is the boundary; nothing else crosses it.

| App           | Layer                       | Owns                                             | Never                             |
| ------------- | --------------------------- | ------------------------------------------------ | --------------------------------- |
| `apps/lab`    | Lab UI                      | Rendering, interaction, client state             | Call the engine, hold credentials |
| `apps/lab`    | Lab API layer `src/app/api` | Session, authentication, forwarding              | Business rules, database access   |
| `apps/engine` | Modules                     | Validation, pricing, persistence, jobs, outcomes | Render, trust client input        |
| `apps/engine` | Infrastructure              | Clients for database, cache, queue and storage   | Decide business rules             |

Each layer owns one job and depends only on the layer beneath it.

## Why the API layer

1. **Secrets.** The Supabase service key, AWS credentials, provider keys and
   database stay on the server and never reach the browser.
2. **Same-origin sessions.** The session lives in an httpOnly cookie on the web
   app, so there is no token in client JavaScript and no cross-origin surface.
3. **One trust boundary.** Authentication is attached in a single place, and
   the engine accepts requests only from that layer.

## Repository

```text
apps/
  lab/                     Next.js web app
    src/
      app/                 routes, layouts, metadata, and the API layer in api/
      components/          product features, one folder each
      ui/                  generic primitives, one file each
      motion/              animation primitives
      e2e/                 Playwright specs
      mocks/               demo rows until the API is wired
  engine/                  Engine service and background worker
    src/
      app.ts               builds the app and mounts every module
      main.ts              serves HTTP
      worker.ts            runs background jobs
      modules/             one folder per domain
      infrastructure/      adapters for external services
      middleware/          request pipeline, 404 and error handling
```

Pages stay thin: each renders one feature component, so markup and chrome live
in `components`. Route groups describe chrome, not URLs.

## Engine modules

`apps/engine` is a modular monolith: one deployable, divided into modules by
business domain. A module owns one area of behaviour, the data behind it, and
the public interface other modules use to reach it.

```text
modules/<module>/
  index.ts        the public object
  router.ts       Express router, mounted by app.ts
  controller.ts   HTTP handlers
  service.ts      rules and implementation
  repository.ts   the module's tables
  types.ts        public and internal types
  utils.ts        small pure helpers
```

`index.ts` exposes one typed object per module; other modules import it. The
router is a separate file that `app.ts` mounts. A module never reaches a
sibling through its router. The controller, service, repository and types stay
private; `worker.ts` and `providers/` exist only where a module needs them.

- **Talk only to the interface.** A module's controller, service, repository,
  worker, provider adapters and tables are private. Cross-module work goes
  through its public interface, `index.ts`, and nothing else. When a need does
  not fit the interface, extend the interface; never reach around it.
- **One import path.** Import a module only as `modules/<module>`, never a file
  inside it. The single exception is `app.ts`, the only file allowed to import
  a module's `router.ts`.
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

`src/infrastructure/<client>/index.ts` is the only place a database, cache,
queue or storage client is created or imported. A strict boundary is what makes
later extraction cheap; the monolith stays one deployment either way.

## Lab components

In `apps/lab`, every folder under `src/components` splits by job.
`index.tsx` declares the feature component and its logic, and nothing else.

| File                   | Holds                                                                |
| ---------------------- | -------------------------------------------------------------------- |
| `index.tsx`            | The component and its logic. No named types, constants or helpers    |
| `types.ts`             | Every `type` and `interface`                                         |
| `constants.ts`         | Every named constant, `UPPER_SNAKE_CASE`, including all visible copy |
| `utils.ts`             | Every reusable function, `function` declarations, nothing else       |
| `hooks.ts`             | Custom hooks only, `useXxx`, usually returning one object            |
| `state.ts`             | Jotai atoms, only for state shared beyond one component              |
| `<feature>-<part>.tsx` | Private subcomponents, not entry points                              |
| `*.test.ts(x)`         | Colocated with the file it covers                                    |

- No barrels: import the defining file, never re-export through a folder.
- One type per shape, reused with `Pick`, `Omit`, an intersection or a shared
  prop type. No inline prop types.

## Lab UI

| Folder                     | Belongs here                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `src/ui`                   | Generic, product-agnostic primitives: one file per component, types and class strings inline, no folder, no product copy             |
| `src/components/<feature>` | Anything with product copy, domain types, data, composition or feature state. A part reused inside one feature stays in that feature |
| `src/motion`               | Reusable animation primitives and transitions, each in its own folder                                                                |

- **Consistency over repetition.** The same UI in two places is one shared
  component configured by props, never a second copy with tuned classes.
- **Same component, same size.** The primitive owns height, radius and text
  scale; call sites override layout only. Need a different size? Change the
  primitive, not one page.
- Extend a primitive through named props; never fork its markup.

## Lab tests

- Colocate `<file>.test.ts(x)` next to the file it covers.
- Cover behaviour and rules: components, `utils.ts`, `hooks.ts`. Never copy,
  constants, metadata, page glue or mock fixtures.
- Playwright specs live in `src/e2e`, end in `.e2e.ts`, and wait for
  `data-hydrated="true"`.
- Query by role, accessible name, label or visible copy.

## Changing the system

- A product, data or API change starts on the design board, becomes a roadmap
  ticket, and only then becomes code.
- A change to the repository shape or to a convention above updates this file
  in the same change.
- Scripts live in `package.json`; commands are not copied into documentation.
