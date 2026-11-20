# Agent instructions

Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) before changing anything. It is the
source of truth for the repository shape, layering, component contract, shared
UI and tests. [`ROADMAP.md`](./ROADMAP.md) lists what is left.

- The browser never calls the engine. Client code goes through `src/app/api`,
  which authenticates and forwards only.
- Business logic lives in `apps/engine`. A Next route handler never prices,
  validates business rules, or touches the database.
- Engine modules are imported only through their `index.ts`. Only `app.ts`
  imports a module's `router.ts`.
- `src/ui` is generic primitives, one file each. Product UI, copy, domain types
  and feature state live in `src/components/<feature>`.
- One shared component per pattern; call sites override layout only, never
  size, radius or text scale.
- For Next.js APIs and conventions, read `node_modules/next/dist/docs/` first;
  this version differs from older releases.
- Before calling work done: `npm run check` and `npm run build`.

Read the relevant skill before changing UI or interaction design:

- `.agents/skills/apple-design/SKILL.md` — interaction, gesture, motion, depth.
