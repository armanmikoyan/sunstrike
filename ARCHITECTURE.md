# Chronolab.ai Architecture

Chronolab.ai is a dark-studio generative media interface: a marketing home, an
image/video studio, an explore feed, a library, account and billing screens.
The repo is a single Next.js App Router application with no backend. Every
catalogue item, price and generation is local demo data.

The product is modelled on one contract: the high-level design's six entities,
`/api/v1` surface and user flow. `src/lib/design` is that contract in code, and
the UI shows only its fields. A screen that needs data the contract does not
have is a design change first, not a new local field. `ROADMAP.md` maps every
remaining ticket to `F1`–`F5` and `N1`–`N4`.

The product name is **Chronolab.ai**, always. Models are named
`Chronolab <Name>` and account addresses use `@chronolab.ai`. The previous
brand name is retired and lives only in git history.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js `16.4` App Router, React `19.3`, TypeScript strict |
| Styling | Tailwind CSS v4, CSS variables in `src/app/globals.css` |
| Components | shadcn primitives (`radix-nova` style) in `src/ui` |
| State | Jotai atoms for shared generation state, local hooks for the rest |
| Motion | `motion/react` for number rolls, CSS for shell/video-wall motion |
| Icons | `lucide-react` |
| Tests | Vitest + Testing Library (jsdom), Playwright (Chrome) |

`src/lib/utils/index.ts` re-exports `cn` from the `cn` package. Imports use the
`@/` alias, which maps to `src/`, and the `~` alias, which maps to the repo
root.

## Product contract

`src/lib/design/index.ts` mirrors the design and is the only place entity and
API shapes are declared:

- **Entities** — `User`, `MediaAsset`, `Template`, `Generation`,
  `GenerationModel` (with `GenerationModelCapabilities`), `Notification`, and
  the inferred `BalanceTransaction`.
- **DTOs** — `GenerationRequest`, `GenerationAccepted`, `GenerationResult`,
  `MediaAssetUpload`, `TopUp`, `GenerationQuote`, list responses and `Balance`.
- **API** — `API_PATHS` for the `/api/v1` surface.
- **Rule** — `modelSupportsSettings(model, settings)`, shared by the studio and
  the future server so a control can never offer a value the model rejects.

`GenerationSettings` is the shape stored in `generations.settings`:
`{ resolution, duration, aspectRatio, audio }`. `GenerationKind` is
`create | edit` (a recorded decision in the roadmap). The working notification
types are `generation_succeeded` and `generation_failed`.

`src/mocks` holds every demo row the UI renders until the API is wired:
`generation` (the `generation_models` catalogue and model costs), `media`,
`templates`, `notifications`, and the marketing `pricing` data. Demo data never
lives in `src/lib`; it is the seam that `UI-1` replaces with `/api/v1` calls.

`src/lib` keeps the contract and the rules. `src/lib/generation` owns
`ModelOption`, the aspect-ratio descriptors and the capability filters;
`src/lib/pricing` owns quantity clamping, quote maths and `formatUSD`;
`src/lib/notifications` owns the type-to-label map. A model carries `id`,
`slug`, `displayName`, `provider`, `providerModelId`, `capabilities` and
`isEnabled`; `cost` is kept beside the mock row until pricing moves to the
server. The UI derives aspect ratios, durations and resolutions from the
selected model's capabilities rather than from global lists.

## Folder structure

```text
src/
  app/
    layout.tsx              html, fonts, metadata, providers, <AppShell>
    shell.tsx               client shell: rail and top nav, skips /login
    providers.tsx           client runtime: Jotai, tooltips, hydrated flag
    globals.css             design tokens, theme mapping, base styles
    (website)/
      layout.tsx            <main> + <SiteFooter>
      page.tsx              home: <Home />
      page.test.tsx         rendered behaviour, colocated
      explore/ pricing/ billing/ settings/ help/
    (workspace)/
      layout.tsx            <main>, no footer
      library/ assets/ favorites/
      create/[mode]/        video and image studio
    login/                  chrome-free: AppShell returns only its children
  components/
    <feature>/              one folder per product feature
      index.tsx             public entry
      index.test.tsx        rendered behaviour, colocated
      constants.ts          static data, copy and class strings (as needed)
      hooks.ts              stateful logic (as needed)
      state.ts              Jotai atoms owned by the feature (as needed)
      types.ts              shared prop/state types (as needed)
      <feature>-<part>.tsx  private subcomponents
  ui/                       shadcn primitives (keep their layout)
  e2e/                      Playwright specs and helpers
  lib/
    design/                 the product contract: entities, DTOs, API, rules
    generation/             model types, presets and capability filters
    notifications/          notification type labels
    media/ pricing/ utils/  types and pure helpers
    <name>/                 one folder per library
      index.ts              public entry
      index.test.ts         unit test, colocated
  mocks/
    generation.ts           demo generation_models rows and model costs
    media.ts                demo media catalogue and lookups
    templates.ts            demo templates rows and lookups
    notifications.ts        demo notifications rows and unread lookup
    pricing.ts              demo rates, video models and top-up packs
public/
  favicon.ico               browser icon
  brand/                    logo, orb, social card, orb custom element
  favicons/                 manifest, install icons, apple touch icon
  media/                    local media (gitignored, do not commit)
vitest.setup.tsx            the shared test setup: framework mocks,
                            jsdom gaps, router state and renderWithProviders
```

Feature folders carry the files they need. A feature with static data or
visible copy has a `constants.ts`; one with stateful logic has `hooks.ts`; one
with shared Jotai atoms has `state.ts` (currently `studio`); one with shaped or
reused props has `types.ts`. Presentational components can be a single
`index.tsx` with no supporting files.

Tests live next to the code they cover. Vitest picks up every `src/**/*.test.ts`
and `src/**/*.test.tsx`; name the file after the module it covers
(`index.test.tsx`, `pricing-order-tabs.test.tsx`, `page.test.tsx`). Playwright
specs sit in `src/e2e` as a sibling of `src/components` and `src/app`, end in
`.e2e.ts`, and share `src/e2e/helpers.ts`. `vitest.setup.tsx` at the repo root,
next to `vitest.config.mts`, is the only shared test setup file.

### Route composition

`src/app/**/page.tsx` composes the route. It exports `metadata` when the route
has one (every page except home), plus dynamic-segment helpers such as
`generateMetadata` and `generateStaticParams` where needed, and renders one
route component from `@/components/<route>`. All markup, styles, data and copy
live in that component's entry point, `src/components/<route>/index.tsx`, with
its strings in `constants.ts`. A typical page is a small module:

```tsx
import { Explore } from "@/components/explore";

export const metadata = { title: "Explore" };

export default function Page() {
  return <Explore />;
}
```

The studio is the richer case:
`src/app/(workspace)/create/[mode]/page.tsx` validates the segment, wraps the
studio in `Suspense` with `StudioSkeleton`, and exports `generateMetadata` and
`generateStaticParams`.

Route groups describe chrome, not URLs. The root `src/app/layout.tsx` owns the
document, fonts, metadata, providers and one `<AppShell>` mount, so the rail and
top nav have a single owner across navigation. The nested groups only decide
their footer:

- `src/app/(website)/layout.tsx` → `<main>` and `<SiteFooter>` for marketing
  and account pages (`/`, `/explore`, `/pricing`, `/billing`, `/settings`,
  `/help`).
- `src/app/(workspace)/layout.tsx` → `<main>` only, for library, assets,
  favorites and the studio.

`AppShell` owns the rail and the top nav; it takes only `children` and has no
footer prop. It returns just the children on `/login`, the one chrome-free
route. Group names never appear in the URL. Route components render their own
content; `TopNav`, `Sidebar` and `SiteFooter` come from the layouts.

Route copy and data belong to the owning component
(`src/components/pricing/constants.ts`, `src/components/login/constants.ts`).
A page test sits beside the route as `page.test.tsx` and renders the default
export, exercising the composition end to end. Pages are server components;
interactive behaviour lives inside the client component islands the route
component imports.

`src/lib` follows the component-folder shape: `src/lib/<name>/index.ts` is the
public entry and `index.test.ts` sits beside it. Imports use `@/lib/<name>`.
`src/proxy.ts` is a single file at the `src/` root, because Next recognises the
proxy entry point there, with `src/proxy.test.ts` beside it.

All static assets live under `public/`. The favicon, app icons and manifest
live in `public/favicon.ico` and `public/favicons/`, and are declared through
`metadata.icons` and `metadata.manifest` in `src/app/layout.tsx`.

### Feature-folder contract

Each product area owns one folder. `index.tsx` is its public API; other files
are private unless deliberately imported by tests.

- **`index.tsx`** exports the feature component (and occasionally sibling
  exports a page needs, like `StudioSkeleton`). Use named exports; pages use
  the Next default export.
- **`constants.ts`** holds static arrays, config, reusable class strings and
  **all visible copy** — headings, labels, button text, placeholders,
  `aria-label`s and tooltip text. React and state stay out of it.
- **`hooks.ts`** holds stateful logic, typically returning one object.
- **`state.ts`** holds the feature's Jotai atoms. Shared generation state lives
  in `src/components/studio/state.ts`; the home prompt composer reads the same
  atoms because it is a compact front door to that studio.
- **`types.ts`** holds shaped, non-trivial prop/state types with `import type`.
  Single flat props are written inline, e.g.
  `function AppShell({ children }: { children: ReactNode })`.
- **Copy** lives in `constants.ts`, not in JSX. Vendor primitives in `src/ui`
  are the exception.
- **Tests** are named after the file they cover and sit beside it:
  `index.test.tsx`, `page.test.tsx`, `pricing-order-tabs.test.tsx`.
- **Subcomponents** are named after their role (`studio-preview.tsx`,
  `nav-search.tsx`) and stay in the same folder.
- Features consume each other through their `index.tsx` entry.

Client boundaries are as small as practical: `"use client"` goes on the
interactive feature root or hook, not on pages, layouts or pure presentational
components. Pages and layouts stay server components and export `metadata`.
Runtime wiring (`Providers`) lives beside the root layout at
`src/app/providers.tsx`; it mounts the Jotai provider, `NavigationProgress` and
the tooltip provider, and sets `data-hydrated="true"` on `<html>` after mount.

### Routes

| Route | Purpose |
| --- | --- |
| `/` | Full-bleed video wall, prompt composer, featured gallery, ratio mosaic, pay-as-you-go panel |
| `/create/video`, `/create/image` | Studio: controls, preview, takes, queue dialog |
| `/explore` | Gallery filtered by media kind, searchable by title, prompt and model |
| `/library` | Generated work with kind tabs and search |
| `/assets`, `/favorites` | Uploaded assets by kind; a saved grid (no favourites entity) |
| `/pricing` | Image/video price calculators, top-up packs, FAQ (marketing only) |
| `/billing` | Available balance, payment method, auto top-up, usage, receipts, tax and transactions |
| `/settings` | Account (`email`, id, created) and read-only notifications |
| `/help` | Guides and contact |
| `/login` | Standalone split-screen sign-in |

`src/proxy.ts` (Next 16's middleware replacement) rewrites unknown
`/create/:mode` segments to a real 404. Keep that validation in sync with the
two supported studios.

### Domain data

`src/lib` is plain TypeScript with no React and no demo rows:

- `design/index.ts` — the contract: entities, DTOs, `API_PATHS`,
  `modelSupportsSettings`.
- `generation/index.ts` — `ModelOption`, aspect-ratio descriptors, capability
  filters, duration presets and the per-model cost rule.
- `notifications/index.ts` — the notification type-to-label map.
- `media/index.ts` — `MediaItem`, `MediaKind` and `MediaCategory` types.
- `pricing/index.ts` — image/video quantity clamping, quote maths and
  `formatUSD`.
- `utils/index.ts` — the `cn` class-name helper.

`src/mocks` is the only place demo rows live. Each module exposes rows plus the
lookup the UI needs (`mediaById`, `templateById`, `unreadNotifications`) and the
model options (`modelOptions`). Components import types and pure helpers from
`src/lib` and rows from `src/mocks`. `media.category` remains only to pick a
gradient fallback; it is never shown as a product field.

All money is rounded to cents at the calculation boundary and formatted with
`formatUSD` or `tabular-nums`. The pricing calculators are marketing surfaces;
production quotes come from `POST /generation-quotes`. When `UI-1` lands, replace
the `src/mocks` imports with the `/api/v1` data source, not the other way round.

## Design system

### Surfaces

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#0f1113` | Page (shared by the rail and body) |
| `--chrome` | `#131517` | Nav bars, sticky toolbars |
| `--surface` | `#0f1113` | Section band |
| `--surface-raised` | `#0f1113` | Raised card |
| `--surface-inset` | `#0f1113` | Inset well |
| `--sidebar` | `var(--background)` | Rail |
| `--foreground` | `#f4f5f7` | Primary text |
| `--muted-foreground` | `#9aa0a6` | Secondary text |
| `--border` | `rgba(255,255,255,0.1)` | Hairlines |

The page stays the cool neutral grey studio, without warm or green tinting.
Nav bars (top nav, sticky toolbars) are a solid `chrome-bar` lift in `--chrome`
(`#131517`) — the same surface as library summary cards — so they never read as
transparent over content. Overlays use frosted glass: `glass-menu` (menus,
selects, dialogs), `glass-panel` (large content panels) and `glass-card` (raised
cards and order panels). Glass combined with media behind it uses a strong
backdrop — a nearly opaque tint plus `blur` and `brightness` — so text stays
readable over video and images, notably the nav mega menu and dropdowns. Chrome
is the darker material; content panels are lighter. Never stack a light glass
surface on another. Glass falls back to solid grey surfaces under
`prefers-reduced-transparency` and where `backdrop-filter` is unsupported.

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
- `--destructive` aliases the brand tertiary; red, crimson and rose stay out of
  the palette.
- Colored glows, radial color washes, decorative status dots, uppercase tracked
  eyebrows above page titles and hover scaling on cards are not part of the
  visual language.
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

### Overlays

- Menus and selects are portalled and use popper positioning, so they open
  above or below the trigger and flip near the viewport edge. Never use
  item-aligned select overlays inside the page.
- The studio template, model and resolution pickers use `DropdownMenu` radio
  groups (`src/ui/dropdown-menu.tsx`), not `Select`. A menu has no
  item-aligned mode, so it can only anchor above or below its trigger — the
  mobile bug where the list covered the button cannot come back.
- Menu and select content matches the trigger width unless a wider menu is set
  explicitly.
- Selected indicators in menus are 12px checks, not large checkbox tiles.

### Motion

- Name the transition: `transition-[width]`, `transition-colors`,
  `transition-[opacity,transform]`; avoid `transition-all`.
- Durations: 200ms for hover/nav, 260ms for the rail, 300ms for fades.
  Easing for layout: `cubic-bezier(0.32,0.72,0,1)`.
- Layout changes use 400–450ms: a critically damped spring
  (`layoutSpring` in `src/lib/motion.ts`) for measured containers and grid
  reflows, a named CSS transition for dimension swaps such as the studio
  aspect frame. Do not hand-write `style` for sizes; keep them in Tailwind
  classes.
- The studio aspect frame is capped by `100dvh` at every breakpoint, with a
  smaller offset below `lg` (stacked page) and a larger one at `lg` (fixed
  nav + studio header + preview chrome). A square or portrait preview must fit
  with its info row without scrolling.
- When two states differ in height by only a few pixels and the difference is
  stable, reserve the taller height (shared grid cell) so nothing shifts.
  Animate when the difference is large enough to read as movement.
- Disclosure panels use the `grid-rows-[0fr]` → `grid-rows-[1fr]` transition
  with a 300ms icon rotation; do not animate `height` from `auto`.
- Add `motion-reduce:transition-none` (or `motion-reduce:animate-none`) to
  every non-essential animation.
- Decorative/infinite motion pauses under `prefers-reduced-motion`.
- The rail measures 61px collapsed and 200px expanded; controls keep one
  vertical axis.
- The top nav is fixed at 48px and does not shrink on scroll. The orb stays
  36px, links 36px/12px.
- The home video wall is product-critical: keep it full-bleed, starting at the
  beginning of the loop, with slightly darkened tiles.
- The nav orb is the `violet-orb` WebGL element (12s per revolution) with a
  static poster fallback. Script: `public/brand/violet-orb.js`.

## Product chrome

- `AppShell` lives in `src/app/shell.tsx`, beside `layout.tsx` and
  `providers.tsx`, because it is layout wiring rather than a feature. It owns
  the desktop rail and the top nav; the root `layout.tsx` mounts it once, and
  the `(website)`/`(workspace)` layouts add `<main>` and, on `(website)`, a
  `<SiteFooter>`. Route components render their own content.
- The shell persists across every route change because it sits above both
  groups. Rail expansion lives in a Jotai atom held by the root provider; the
  mobile drawer is local and closes on navigation. Mounting it once avoids a
  second, cached `AppShell` rendering stale rail state when Next preserves the
  previous route tree.
- `layout.tsx` stays a server component because `metadata` and `viewport`
  exports are server-only; `shell.tsx` is the single `"use client"` boundary
  that holds rail and drawer state and opts `/login` out of the chrome.
- Desktop rail is sticky, collapsed by default, and expands from its top
  control. Mobile uses a focus-trapped drawer.
- `TopNav` owns the mega menu, search, balance pill, notifications and brand
  orb. The mega menu positions itself from the hovered trigger and clamps its
  width to the header so it stays inside the shell.
- `NavigationProgress` is a 3px brand-secondary bar driven by link clicks,
  popstate, and the `chronolab:navigation-start` custom event.
- `SiteFooter` is rendered by `(website)/layout.tsx`; `(workspace)` omits it,
  and `AppShell` renders `/login` with no chrome at all.
- `Providers` (`src/app/providers.tsx`) wires Jotai and tooltips and sets
  `data-hydrated="true"` on `<html>` after mount. E2E waits on that flag.

### Brand assets

- `public/brand/chronolab-logo.svg` — integrated wordmark (1758×301).
- `public/brand/chronolab-orb-128.png` — nav fallback poster.
- `public/brand/violet-orb.js` — self-contained WebGL orb custom element.
- `public/brand/chronolab-social.png` — 1200×630 OG/Twitter card.
- `public/favicon.ico` — browser icon.
- `public/favicons/icon-512.png` — transparent app icon.
- `public/favicons/apple-touch-icon.png` — 180×180 touch icon.
- `public/favicons/site.webmanifest` + `android-chrome-192/512.png` — install
  icons.

## Data flow and conventions

- Shared generation state lives in `src/components/studio/state.ts`: mode,
  prompt, model, aspect ratio, duration, resolution, audio, optional template,
  attachment and balance. These map to `GenerationSettings` and the
  `POST /generations` body. The home composer and studio stay in sync because
  they read the same atoms.
- Other Jotai atoms belong in that feature's own `state.ts`, not in a catch-all
  store under `src/lib`.
- Ephemeral UI state (open menus, queues, active take) belongs in the feature's
  `hooks.ts`.
- Actions are simulated: submitting the composer navigates to
  `/create/${mode}`, and every catalogue item, price and result comes from
  `src/lib`. The studio and home composer validate every control against the
  selected model's capabilities.
- Settings shows only `users.email`, `users.id` and `users.created_at`, plus
  the `notifications` rows; there are no preference, security or API-key panes.
- Billing keeps its full payment page: available balance, payment method, auto
  top-up, usage, receipts, tax and `balance_transactions` (top-up, charge,
  credit). The card and invoices come from Lemon Squeezy; usage and the ledger
  come from the API. The demo values in `src/components/billing/constants.ts`
  are presentation data until BIL-6 wires the provider.
- Use the `chronolab:` prefix for custom events.
- Route metadata is exported per page; the root layout owns global metadata,
  OG/Twitter, manifest and `themeColor: "#7c3aed"`.
- Images use `next/image`; local media uses `VideoWithFallback`, which aligns
  duplicate players, autoplays explicitly and falls back to a gradient.

## Testing

| Layer | Command | Contract |
| --- | --- | --- |
| Unit | `npm run test:unit` | `src/lib` maths and `src/mocks` data, plus `src/proxy.test.ts` |
| Component | `npm run test:components` | `src/components` and `src/app` behaviour |
| All Vitest | `npm test` | every colocated `*.test.ts(x)` |
| Coverage | `npm run test:coverage` | floors enforced |
| E2E | `npm run test:e2e` | production build on `:3100` |
| Typecheck | `npm run typecheck` | `tsc --noEmit` |
| Lint | `npm run lint` | ESLint |
| Everything | `npm run check` | typecheck + lint + coverage |

Conventions:

- Tests are colocated: `src/lib/utils/index.test.ts`,
  `src/components/nav/index.test.tsx`, `src/app/(website)/page.test.tsx`,
  `src/components/pricing/pricing-order-tabs.test.tsx`.
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
with its markup and, when it owns copy, a colocated `constants.ts` for its
visible strings, then make the page export `metadata` where the route needs it
and return `<Route />`. Add it under `src/app/(website)/` if it shows the
footer, or `src/app/(workspace)/` if it should not; a chrome-free route needs an
opt-out in `AppShell` (see `/login`). Add
`page.test.tsx` beside the route and an E2E route entry if it belongs in the
shell.

**Add a feature component:** create `src/components/<feature>/index.tsx` plus
`constants.ts`, `hooks.ts`, `state.ts` and `types.ts` as the feature needs them.
Mark the interactive root `"use client"`. Put every visible string in
`constants.ts`, write single flat props inline, and import types/rules from
`src/lib` and demo rows from `src/mocks`. Add `index.test.tsx` beside it.

**Add a model or price:** add a `generation_models` row (with capabilities) in
`src/mocks/generation.ts` and its price in `modelCosts`; update
`src/lib/pricing/index.ts` if quantity maths changes. A model name, provider or
capability must exist in the contract first. Add a unit test.

**Add a design token:** add the variable in `:root`, mirror it in `@theme
inline` as `--color-*`, use the generated Tailwind class, and update this doc.

**Add a test:** create `<file>.test.ts(x)` next to `<file>.ts(x)`; use
accessible queries and the existing setup mocks. E2E specs go in `src/e2e`.
