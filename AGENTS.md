Read `ARCHITECTURE.md` before changing folder structure, routes, shared state, the design system or the brand. It is the source of truth for feature folders, tokens, type, motion and tests.

## File convention

`src/ui/` is the one exception: shadcn-style primitives are a single file per component (`button.tsx`, `segmented-tabs.tsx`), with their prop types and class strings inline. No folder, no `index.tsx`, no `types.ts` or `constants.ts` there.

Every other component folder (`src/components/<feature>/`, and route-local component folders under `src/app/`) splits by kind. One job per file:

- `index.tsx` — the component and its logic only. No named types, constants, atoms, or helper functions at module level.
- `types.ts` — every `type` and `interface`.
- `constants.ts` — every named constant, in `UPPER_SNAKE_CASE` (static data, ids, durations, keys, transitions, class strings, and all visible copy).
- `utils.ts` — every reusable function, and nothing else. No constants or types.
- `state.ts` — Jotai atoms, only for state shared beyond one component. State one component owns stays local.
- `hooks.ts` — custom hooks only, named `useXxx`. No types, constants, helper functions, or plain utilities; those go to `types.ts`, `constants.ts`, and `utils.ts`.
- `<feature>-<part>.tsx` — private subcomponents.
- `*.test.ts(x)` — colocated with the file they cover.

The feature's main component always lives in `index.tsx`, never in a sibling file named after the feature (`pricing.tsx`, `settings.tsx`). Subcomponents are `<feature>-<part>.tsx`, not entry points.

No barrel files. A folder's `index.tsx` is its component, never a re-export list; do not add `export { X } from "./x"`. Import each component directly from the file that defines it.

Every file starts with its imports. All `import` declarations sit at the top of the file, before any type, constant, function, or component, including in `types.ts` and `constants.ts`.

Reusable animation primitives (`AnimatedHeight`, `RollingNumber`) and shared transitions live in `src/motion/`, each component in its own folder with the same `index.tsx`/`constants.ts`/`types.ts` shape. Do not create a `src/lib` catch-all. Shared rules live in the folder that owns them (`components/pricing/utils.ts`, `components/studio/utils.ts`, `app/auth/*`). `cn` is imported directly from `"cn"`.

## Consistency over repetition

**CONSISTENCY OVER REPETITION.** When the same UI appears in two or more places, extract one shared component and use it everywhere; never restyle a copy. The shared set lives in `src/ui/`: `SegmentedTabs` (all/image/video tabs), `SearchInput` (with or without a hotkey hint), `CountBadge`, `EmptyState`, `IconBox`, `PageShell` and `MediaKindBadge`. Extend them through named props — `icon`, `hint`, `fullWidth`, `scrollable`, `className` — instead of forking the markup. Use the shared button sizes (`cta`, `cta-sm`, `cta-xs`) for brand CTAs rather than repeating height, padding, type and colour classes at each call site.

**SAME COMPONENT, SAME SIZE.** A shared control keeps one height, radius and
text scale on every page. The primitives set them — control labels are
`text-xs lg:text-[0.6875rem]`, dropdown and select triggers are `h-9`, menus
are `rounded-lg` with `px-2 py-1.5` items — so a call site overrides only
layout (`w-*`, `mt-*`, colour). If a dropdown, tab or field needs a different
size, change the primitive, not one page's copy.

## Imports

Always import through the `@/` and `~` aliases. Never use `../` to reach a parent folder; keep `./` only for a sibling inside the same component folder.

## Code style

- Reuse over repetition. One type per shape: declare it once and reuse it through `Pick`, `Omit`, intersections (`A & B`) or a shared prop type. Never redeclare the same fields under a new name: seven subcomponents that all read `composer` share one `ComposerProps`, not seven identical types. Identical scoped props (`studio: StudioState`) share one type.
- No inline prop types. Give every prop object a named type: `function Studio({ initialMode }: StudioProps)`, not `{ initialMode }: { initialMode: GenerationMode }`. Shared shapes live in the folder that owns them (`ChildrenProps` in `app/types.ts`, `FieldProps` in `settings/types.ts`, `OnCloseProps` in `nav/types.ts`, `HeadingProps` in `page-header/types.ts`); never hoist them into a root `src/types.ts`.
- Never destructure or alias copy and config objects. Read the owning constant at the use site: `BILLING_COPY.footer`, not `const { footer } = BILLING_COPY`; `STUDIO_COPY.preview`, not `const copy = STUDIO_COPY.preview`.
- Destructure component props in the parameter list, never in the body: `function Row({ composer: { model } }: RowProps)`, not `function Row({ composer }: RowProps) { const { model } = composer; }`.
- Use Tailwind v4 canonical utilities. Prefer the named form over arbitrary brackets whenever they are equal: `bg-linear-to-t` (not `bg-gradient-to-t`), `max-w-190` (not `max-w-[47.5rem]`), `size-*`, `shrink-*`, `aspect-video` (not `aspect-[16/9]`), `aspect-3/4`, `rounded-lg` (not `rounded-[0.5rem]`), `text-xs` (not `text-[0.75rem]`), `duration-300` (not `duration-[300ms]`), `z-50` (not `z-[50]`). Arbitrary values are only for real one-off lengths with no token, such as `text-[0.6875rem]` or `max-w-[min(47.5rem,calc(...))]`.
- Do not add JSDoc that restates a type, prop, or name. Explain a non-obvious decision only.

## Tests

Unit tests cover real logic: feature components (`index.tsx` behaviour), `utils.ts`, `hooks.ts`, and shared behaviour in `src/motion`. Name the file after the module it covers. Do not test constants, copy, metadata, robots/sitemap configuration, route `page.tsx` glue that only renders a component, or demo fixtures in `src/mocks`. If a test only restates a constant or asserts a heading, delete it; add a behavioural test where a branch actually needs proof.

## Design skills

Read the relevant skill before changing UI or interaction design.

- `.agents/skills/unslop/SKILL.md` — use for any visual polish, redesign, or interface cleanup. It covers spacing, color, type, copy, layout, visuals, and motion, plus audit references in `references/`.
- `.agents/skills/apple-design/SKILL.md` — use for interaction feel, gesture behavior, motion, depth, typography, and reduced-motion decisions.

Project design rules:

- Preserve Chronolab.ai's dark studio direction: one consistent near-black page (`#0f1113`, shared by the rail and body), with `#18191c` sections and `#1c1e20` raised cards, without warm or green tinting. The top nav and sticky toolbars are a solid `#131517` lift (`chrome-bar`, the same surface as library summary cards) so labels always have contrast; they are never transparent. Portalled menus, selects and dialogs use `glass-menu`; large panels and cards use `glass-panel` and `glass-card`. Blur belongs only where media sits behind the layer; keep those backdrops strong enough for text to stay readable, especially the nav mega menu and dropdowns. Violet `#7c3aed` is the official brand color and CTA/logo fill, lifting to `#8b5cf6` on hover, with warm off-white `#faf9f6` text. Lavender `#a78bfa` is the brand secondary for selected states, sliders, and the navigation progress bar. One italic key word in each section heading is set in Instrument Serif (`font-serif`) in the brand violet `#7c3aed`. Cost figures, focus rings, active navigation, and chart surfaces stay neutral. Never introduce red, crimson or rose; error and destructive states use the brand tertiary `#c4b5fd`.
- Keep the infinite video wall; it is a product-critical moment, not decorative motion. The home hero is the full-bleed wall. Start it at the beginning of the loop and keep the tiles slightly darkened.
- The home prompt sits at the bottom of the hero at its full size. It does not stick to the viewport or resize on scroll. The sidebar starts collapsed and expands from its top control.
- Do not add decorative status dots before labels.
- Keep body copy sentence case. Section headings are concise 17-19px uppercase labels with a sentence-case description and one italic key word in the brand violet. Do not add uppercase tracked eyebrows above page titles, additional italics for emphasis, colored glows, radial color washes, or hover scaling on cards. The ambient background stays monochrome and neutral, not a brand-colored wash.
- Small text stays at 11px or larger. Headlines, labels, and buttons do not end in periods.
- Use named transitions and respect `prefers-reduced-motion`.
