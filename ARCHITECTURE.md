# Chronolab.ai Architecture

Chronolab.ai is a dark-studio generative media interface: a marketing home, an
image/video studio, an explore feed, a library, account and billing screens.
The repo is a single Next.js App Router application with no backend. Every
catalogue item, price and generation is local demo data.

The product name is **Chronolab.ai**, always. Models are named
`Chronolab <Name>` and account addresses use `@chronolab.ai`. The previous
brand name is retired and must not be reintroduced; its old asset filenames
exist only in git history.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js `16.4` App Router, React `19.3`, TypeScript strict |
| Styling | Tailwind CSS v4, CSS variables in `src/app/globals.css` |
| Components | shadcn-style primitives (`radix-nova`) in `src/ui` |
| State | Jotai atoms for shared generation state, local hooks for the rest |
| Motion | `motion/react` for number rolls, CSS for shell/video-wall motion |
| Icons | `lucide-react` |
| Tests | Vitest + Testing Library (jsdom), Playwright (Chrome) |

`src/lib/utils/index.ts` re-exports `cn` from the `cn` package. Imports use the
`@/` alias, which maps to `src/`.

## Folder structure

```text
src/
  app/
    layout.tsx              html, fonts, metadata, providers (no chrome)
    shell.tsx               client shell: rail and top nav
    providers.tsx           client runtime wiring: Jotai + tooltips
    globals.css             design tokens, theme mapping, base styles
    (website)/
      layout.tsx            <AppShell> + <main> + <SiteFooter>
      page.tsx              home: metadata + <Home />
      page.test.tsx         rendered behaviour, colocated
      explore/ pricing/ billing/ settings/ help/
    (workspace)/
      layout.tsx            <AppShell> + <main>, no footer
      library/ assets/ favorites/
      create/[mode]/        video and image studio
    login/                  outside the groups: split-screen, no chrome
  components/
    <feature>/              one folder per product feature
      index.tsx             public entry
      index.test.tsx        rendered behaviour, colocated
      constants.ts          static data, copy and class strings
      hooks.ts              stateful logic
      hooks.test.ts         hook logic, colocated
      state.ts              Jotai atoms owned by the feature
      types.ts              local shared types
      <feature>-<part>.tsx  private subcomponents
  ui/                       shadcn primitives (do not restructure)
  e2e/                      Playwright specs, production build
  lib/
    <name>/                 one folder per library
      index.ts              public entry
      index.test.ts         unit test, colocated
public/
  favicon.ico               browser icon
  brand/                    logo, orb, social card, orb custom element
  favicons/                 manifest, install icons, apple touch icon
  media/                    local media (gitignored, do not commit)
vitest.setup.tsx            the only shared test file: framework mocks,
                            jsdom gaps, router state and renderWithProviders
```

Tests live next to the code they cover. A file named `index.test.tsx`,
`hooks.test.ts` or `page.test.tsx` belongs beside its entry file; there is no
`test` directory and no mirrored test tree. Playwright specs sit beside the
source as `src/e2e`, a sibling of `src/components` and `src/app`. The only
shared test file is `vitest.setup.tsx` at the repo root, next to
`vitest.config.mts`.

### Route composition

`src/app/**/page.tsx` owns the route but holds no markup. It exports
`metadata` (plus dynamic-segment helpers such as `generateMetadata` and
`generateStaticParams`) and renders one route component from
`@/components/<route>`. All markup, styles, data and copy live in that
component's entry point, `src/components/<route>/index.tsx`, with its strings
in a colocated `constants.ts`.

There is no intermediate `screens` layer and no wrapper `*-page` component.
A page is: import the route component, export `metadata`, return
`<Component />`.

Route groups describe chrome, not URLs. The root `src/app/layout.tsx` owns the
document, fonts, metadata and providers, but no chrome. Two sibling groups
mount `AppShell` from `src/app/shell.tsx`, and each layout decides its own
footer:

- `src/app/(website)/layout.tsx` → `<AppShell>` with `<main>` and
  `<SiteFooter>` for marketing and account pages (`/`, `/explore`, `/pricing`,
  `/billing`, `/settings`, `/help`).
- `src/app/(workspace)/layout.tsx` → `<AppShell>` with `<main>` only, for
  library, assets, favorites and the studio.

`AppShell` owns the rail and the top nav; it takes only `children` and has no
footer prop. Group names never appear in the URL. `/login` sits outside both
groups, so it inherits only the chrome-free root layout — no route list decides
that. Route components render their own content only; they never import
`TopNav`, `Sidebar` or `SiteFooter`.

Route copy and data belong to the owning component
(`src/components/pricing/constants.ts`, `src/components/login/constants.ts`),
never to the page. The page test sits beside the route as `page.test.tsx` and
renders the default export, so it exercises the composition end to end. Pages
stay server components by default; interactive behaviour lives inside the
client component islands the route component imports.

`src/lib` follows the component-folder shape: `src/lib/<name>/index.ts` is the
public entry and `index.test.ts` sits beside it. Imports still use
`@/lib/<name>`, so the folder move is invisible to callers. `src/proxy.ts` is
the exception: Next 16 only recognises it at the `src/` root, so it stays a
single file with `src/proxy.test.ts` beside it.

All static assets live under `public/`. Next's app-router icon files
(`favicon.ico`, `icon.png`, `apple-icon.png`) have also moved there and are
declared through `metadata.icons` in `src/app/layout.tsx`; do not add icon
files back to `src/app`.


### Feature-folder contract

Each product area owns one folder. `index.tsx` is its public API; other files
are private unless deliberately imported by tests.

- **`index.tsx`** exports the feature component (and occasionally sibling
  exports a page needs). Named exports; pages use the Next default export.
- **`constants.ts`** holds static arrays, config, reusable class strings and
  **all visible copy** — headings, labels, button text, placeholders,
  `aria-label`s and tooltip text. Do not put React or state here.
- **`hooks.ts`** holds stateful logic. Return one object and export its type as
  `ReturnType<typeof useFeature>` when children need it.
- **`state.ts`** holds the feature's Jotai atoms. There is no global store: put
  new atoms in the folder that owns the behaviour. Shared generation state
  lives in `src/components/studio/state.ts`; the home prompt composer reads the
  same atoms because it is a compact front door to that studio.
- **`types.ts`** holds shared, non-trivial prop/state types. Use `import type`.
  Do **not** create a named type for a single flat prop: write it inline, e.g.
  `function AppShell({ children }: { children: ReactNode })`. Name a type only
  when props are shaped (nested objects) or reused across files.
- **Copy** never lives in JSX. If a string is visible to a person, it belongs in
  the owning folder's `constants.ts`. Vendor primitives in `src/ui`
  are the only exception.
- **Tests** are named after the file they cover and sit beside it:
  `index.test.tsx`, `hooks.test.ts`, `utils.test.ts`.
- **Subcomponents** are named after their role (`studio-preview.tsx`,
  `nav-search.tsx`) and stay in the same folder.
- Do not reach into another feature's internals. Import its `index.tsx`.
- Do not create cross-feature barrel files.

Client boundaries are as small as practical: `"use client"` goes on the
interactive feature root or hook, not on pages, layouts or pure presentational
components. Pages and layouts stay server components and export `metadata`.
Runtime wiring (`Providers`) is not a component: it lives beside the root
layout at `src/app/providers.tsx`.

### Routes

| Route | Purpose |
| --- | --- |
| `/` | Full-bleed video wall, prompt composer, featured gallery, ratio mosaic, pay-as-you-go panel |
| `/create/video`, `/create/image` | Studio: controls, preview, takes, queue dialog |
| `/explore` | Filterable community feed |
| `/library` | Generated work with tabs and search |
| `/assets`, `/favorites` | Asset folders and favourited work |
| `/pricing` | Image/video order calculators, top-up packs, FAQ |
| `/billing` | Balance, auto top-up, transactions |
| `/settings` | Profile, preferences, notifications, security, API |
| `/help` | Guides and contact |
| `/login` | Standalone split-screen sign-in |

`src/proxy.ts` (Next 16's middleware replacement) rewrites unknown
`/create/:mode` segments to a real 404. Keep that validation in sync with the
two supported studios.

### Domain data

`src/lib` is plain TypeScript with no React:

- `media/index.ts` — media catalogue, categories, top-up packs, generation
  rates.
- `pricing/index.ts` — image/video quantity clamping and quote maths.
- `generation/index.ts` — model options, aspect ratios, durations, render cost,
  and the `GenerationMode` type.
- `utils/index.ts` — the `cn` class-name helper.

Pricing numbers and model lists live in one place. Never hard-code a duplicate
rate in a component. All money is rounded to cents at the calculation boundary
and formatted with `formatUSD` or `tabular-nums`.

## Design system

### Surfaces

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#131517` | Page |
| `--surface` | `#18191c` | Section band |
| `--surface-raised` | `#1c1e20` | Raised card |
| `--surface-inset` | `#0f1113` | Inset well |
| `--sidebar` | `#0f1113` | Rail |
| `--foreground` | `#f4f5f7` | Primary text |
| `--muted-foreground` | `#9aa0a6` | Secondary text |
| `--border` | `rgba(255,255,255,0.1)` | Hairlines |

Surfaces stay cool neutral grey. Never tint panels warm, green or red.

### Brand

| Token | Value | Use |
| --- | --- | --- |
| `--brand` | `#7c3aed` | CTAs, logo fill, section key words |
| `--brand-hover` | `#8b5cf6` | Hover for filled brand controls |
| `--brand-foreground` | `#faf9f6` | Text/icons on brand |
| `--brand-secondary` | `#a78bfa` | Selected states, sliders, nav progress |
| `--brand-tertiary` | `#c4b5fd` | Error/destructive states |

Rules:

- Primary CTA: `bg-brand text-brand-foreground hover:bg-brand-hover`.
- Section headings use one italic Instrument Serif key word in `text-brand`.
- Cost figures, focus rings, active nav labels and chart surfaces stay neutral.
- **Never introduce red, crimson or rose.** `--destructive` aliases the brand
  tertiary.
- Do not add colored glows, radial color washes, decorative status dots,
  uppercase tracked eyebrows above page titles, or hover scaling on cards.
- Use the tokens. A one-off translucent white/black overlay is acceptable for
  glass depth; a new brand hue is not.

### Type

Fonts are loaded in `src/app/layout.tsx`:

- **Inter** — body and UI (`font-sans`, with `ss01`/`cv01`).
- **Space Grotesk** — section and display headings (`font-grotesk`).
- **Instrument Serif** — italic key words and editorial display (`font-serif`,
  `font-display`).
- **Space Mono** — timestamps, counters and technical meta (`font-mono`).

Type rules:

- Minimum text size is **11px** (`text-[0.6875rem]`).
- Body copy is sentence case. Headlines, labels and buttons do not end in a
  period.
- Page titles: `text-[1.875rem]` / `sm:text-[2.25rem]`, medium, tight tracking.
- Section headers: uppercase 17/19px Space Grotesk, `tracking-[0.1em]`, with a
  sentence-case description.
- Numbers that change use `tabular-nums`; large money changes can use
  `RollingNumber`.

### Space, radius, layout

- All lengths are `rem`; only hairline borders stay `1px`.
- Shell: `max-w-[120rem]`, page padding `px-5 py-7`, section padding `py-16`.
- Cards use `rounded-xl`/`rounded-2xl`; controls use `rounded-lg`; the base
  radius token is `0.75rem`.
- Use the shared `PageHeader` for route intros and `SectionHeader` for in-page
  sections instead of rebuilding the type/rhythm.
- Small controls are 32–40px tall; icon buttons use `size-8`/`size-9`.

### Motion

- Name the transition: `transition-[width]`, `transition-colors`,
  `transition-[opacity,transform]`; avoid `transition-all`.
- Durations: 200ms for hover/nav, 260ms for the rail, 300ms for fades.
  Easing for layout: `cubic-bezier(0.32,0.72,0,1)`.
- Add `motion-reduce:transition-none` (or `motion-reduce:animate-none`) to
  every non-essential animation.
- Decorative/infinite motion pauses under `prefers-reduced-motion`.
- The rail measures 61px collapsed and 200px expanded; controls keep one
  vertical axis.
- The top nav is fixed at 48px and **does not shrink on scroll**. The orb stays
  36px, links 36px/12px.
- The home video wall is product-critical: keep it full-bleed, starting at the
  beginning of the loop, with slightly darkened tiles.
- The nav orb is the `violet-orb` WebGL element (18s per revolution) with a
  static poster fallback. Script: `public/brand/violet-orb.js`.

## Product chrome

- `AppShell` lives in `src/app/shell.tsx`, beside `layout.tsx` and
  `providers.tsx`, because it is layout wiring rather than a feature. It owns
  the desktop rail and the top nav; each route group's `layout.tsx` composes
  it with a `<main>` element and, on `(website)`, a `<SiteFooter>`. Route
  components never render `TopNav`, `Sidebar` or `SiteFooter` themselves.
- The shell persists across route changes inside a group. Crossing between
  `(website)` and `(workspace)` swaps layouts, so rail expansion lives in a Jotai
  atom held by the root provider and survives the remount; the mobile drawer is
  local and closes on navigation.
- `layout.tsx` stays a server component because `metadata` and `viewport`
  exports are server-only; `shell.tsx` is the single `"use client"` boundary
  that holds rail and drawer state.
- Desktop rail is sticky, collapsed by default, and expands from its top
  control. Mobile uses a focus-trapped drawer.
- `TopNav` owns the mega menu, search, balance pill, notifications and brand
  orb. The mega menu positions itself from the hovered trigger.
- `NavigationProgress` is a 3px brand-secondary bar driven by link clicks,
  popstate, and the `chronolab:navigation-start` custom event.
- `SiteFooter` is rendered by `(website)/layout.tsx`; `(workspace)` omits it,
  and `/login` has no shell at all.
- `Providers` (`src/app/providers.tsx`) wires Jotai and tooltips and sets
  `data-hydrated="true"` on `<html>` after mount. E2E waits on that flag.

### Brand assets

- `public/brand/chronolab-logo.png` — integrated wordmark (1200×400).
- `public/brand/chronolab-orb-128.png` — nav fallback poster.
- `public/brand/violet-orb.js` — self-contained WebGL orb custom element.
- `public/brand/chronolab-social.png` — 1200×630 OG/Twitter card.
- `public/favicon.ico` — browser icon.
- `public/favicons/icon-512.png` — transparent app icon.
- `public/favicons/apple-touch-icon.png` — 180×180 touch icon.
- `public/favicons/site.webmanifest` + `android-chrome-192/512.png` — install
  icons. Do not add unused icon sizes.

## Data flow and conventions

- Shared generation state lives in `src/components/studio/state.ts`: mode,
  prompt, model, aspect, duration, attachment, balance. The home composer and
  studio stay in sync because they read the same atoms.
- Any other Jotai atoms belong in that feature's own `state.ts`. Do not add a
  catch-all store under `src/lib`.
- Ephemeral UI state (open menus, queues, active take) belongs in the feature's
  `hooks.ts`.
- Actions are simulated. Submitting the composer navigates to
  `/create/${mode}`; there is no fetch layer, database or auth.
- Use the `chronolab:` prefix for custom events.
- Route metadata is exported per page; the root layout owns global metadata,
  OG/Twitter, manifest and `themeColor: "#7c3aed"`.
- Images use `next/image`; local media uses `VideoWithFallback`, which aligns
  duplicate players, autoplays explicitly and falls back to a gradient.

## Testing

| Layer | Command | Contract |
| --- | --- | --- |
| Unit | `npm run test:unit` | `src/lib` maths and data |
| Component | `npm run test:components` | `src/components` and `src/app` behaviour |
| All Vitest | `npm test` | every colocated `*.test.ts(x)` |
| Coverage | `npm run test:coverage` | floors enforced |
| E2E | `npm run test:e2e` | production build on `:3100` |
| Typecheck | `npm run typecheck` | `tsc --noEmit` |
| Lint | `npm run lint` | ESLint |
| Everything | `npm run check` | typecheck + lint + coverage |

Conventions:

- Tests are colocated: `src/lib/utils/index.test.ts`,
  `src/components/nav/index.test.tsx`, `src/app/page.test.tsx`,
  `src/components/studio/hooks.test.ts`.
  Name the file after the module it covers and import it with `"."` or
  `"./hooks"`.
- Playwright specs live in `src/e2e` and end in `.e2e.ts`.
- Query by role, accessible name, label or visible copy. Avoid internal class
  names and DOM shape.
- `vitest.setup.tsx` is the single shared test file. It mocks
  `next/navigation`, `next/link`, `next/image`, `motion/react` and jsdom gaps,
  and it exports the router helpers (`routerMock`, `setPathname`,
  `setSearchParams`, `setParams`) and `renderWithProviders`. Import them
  through the root `~` alias (`~/vitest.setup`); never add per-test mocks.
- E2E builds into `.next-e2e` and never reuses a running server. Wait for
  `document.documentElement.dataset.hydrated === "true"` via `openApp`.
- Coverage floors are 85% statements, 83% branches, 80% functions, 87% lines
  over `src/**` excluding UI primitives, route layouts, tests, e2e and test
  infrastructure. Raise them when the numbers rise; never lower them to make a
  change pass.
- State modules are covered through the behaviour that reads them; do not add
  tests whose only job is asserting atom defaults.
- The full Playwright suite is slow. Run it when routing, layout or shared
  interaction changed, or when asked; use the narrowest spec while iterating.

## Change checklist

Before calling a change done:

1. `npm run typecheck` and `npm run lint`.
2. Relevant Vitest files, then `npm test` when the change is broad.
3. `npm run build`; run Playwright if the change touches routing, shell or
   responsive behaviour.
4. Check desktop and mobile widths; no horizontal overflow.
5. Check reduced-motion behaviour for any new animation.
6. Confirm no new red/crimson/rose, no new arbitrary px lengths, and 11px
   minimum text.
7. Remove dead code, unused assets and unused dependencies.
8. Keep the product name Chronolab.ai everywhere.

## Common recipes

**Add a page:** create the route surface in `src/components/<route>/index.tsx`
with its markup and a colocated `constants.ts` for every visible string, then
make the page export `metadata` and return `<Route />`. Add it under
`src/app/(website)/` if it shows the footer, or `src/app/(workspace)/` if it
should not; a route with no chrome belongs outside both groups. Add
`page.test.tsx` beside the route and an E2E route entry if it belongs in the
shell. Do not add a `screens` folder, a wrapper `*-page` component, a route
list, or markup in the page itself.

**Add a feature component:** create `src/components/<feature>/index.tsx` plus
`constants.ts`, `hooks.ts`, `state.ts` and `types.ts` only as needed. Mark the
interactive root `"use client"`. Put every visible string in `constants.ts`,
write single flat props inline, and import shared data from `src/lib`, not from
another feature. Add `index.test.tsx` beside it.

**Add a model or price:** update `src/lib/generation/index.ts` (models, cost
rules) or `src/lib/media/index.ts` (rates), then update
`src/lib/pricing/index.ts` if quantity maths changes. Add a unit test.

**Add a design token:** add the variable in `:root`, mirror it in `@theme
inline` as `--color-*`, use the generated Tailwind class, and update this doc.

**Add a test:** create `<file>.test.ts(x)` next to `<file>.ts(x)`; use
accessible queries and the existing setup mocks. E2E specs go in `src/e2e`.
