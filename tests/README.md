# Tests

Two layers, both run against the same source tree:

| Layer | Location | Runner | What it protects |
| --- | --- | --- | --- |
| Unit | `tests/unit/lib` | Vitest + jsdom | Pure logic in `src/lib` (pricing, generation, media catalogue, atoms, class names) |
| Component | `tests/components` | Vitest + jsdom + Testing Library | Rendered behaviour of layout, gallery, pricing, home, studio, settings and page components |
| End to end | `tests/e2e` | Playwright (Chrome) | Real routing, responsive layout, search, calculators and the mobile drawer in a production build |

File names say what they are: `*.test.ts(x)` under `tests/unit` and
`tests/components`, and `*.e2e.ts` under `tests/e2e` (matched by
`testMatch` in `playwright.config.ts`).

## Commands

```bash
npm test              # every Vitest project (unit + component)
npm run test:unit     # only tests/unit
npm run test:components
npm run test:coverage # Vitest with the coverage floors enforced
npm run test:e2e      # Playwright (builds, starts on :3100, then runs)
npm run test:e2e:ui   # Playwright in watch/UI mode
npm run typecheck     # tsc --noEmit
npm run check         # typecheck + lint + coverage
```

Playwright always runs `npm run build && npm run start -p 3100` for the suite.
It never reuses a server that is already listening, because new HTML paired
with a chunk from an older build makes a page look hydrated while its
interactive parts never attach — that is what used to make the gallery and
pricing specs flake. The e2e build goes to `.next-e2e` (`NEXT_DIST_DIR`), so it
stays isolated from a `next dev` session writing to `.next` at the same time.
Set `E2E_PORT` to change the port and `CI=1` to add retries.
The browser is the locally installed Chrome (`channel: "chrome"`), so no
`playwright install` step is needed on this machine.

## How the tests are written

Everything imports through the `@/…` alias and talks to components the way a
user would: roles, accessible names, labels, visible copy. No test reaches into
component internals, CSS module names or DOM structure beyond an `article` or a
`form[role=search]` that is part of the public contract.

Framework seams are mocked once, in `tests/setup.tsx`:

- `next/navigation` → `tests/mocks/navigation.ts` (`routerMock`, `setPathname`,
  `setSearchParams`, `resetNavigation`).
- `next/link` and `next/image` render plain anchors and images.
- `motion/react` renders static elements, so `AnimatePresence` never leaves an
  exiting node in the DOM and number roll animations settle immediately.
- jsdom gaps: `matchMedia`, `ResizeObserver`, `IntersectionObserver`,
  `Element.animate`, pointer capture and `scrollIntoView`.

Reset helpers run automatically in `beforeEach`, and `cleanup()` runs in
`afterEach`.

## After moving folders

The suite is deliberately import-light so a restructure is mostly a find and
replace:

1. Update the `@` alias target once in `vitest.config.mts` (and `tsconfig.json`
   if the alias itself changes). Component tests keep working if `src` is
   renamed but the alias still points at the source root.
2. Move test files alongside the new source grouping under `tests/components`
   if you want the mirror to stay obvious. Only relative imports to
   `../../mocks/navigation` need adjusting; everything else uses `@/…`.
3. If a component is renamed, update its import in the matching test file and
   the accessible names the test asserts. Prefer keeping the accessible name
   stable — that is the part users depend on.
4. Page tests in `tests/components/pages/pages.test.tsx` import route modules
   directly. Update those import paths if the `app` tree changes.
5. Run `npm run typecheck` first: broken imports surface there before Vitest.

## Coverage

`coverage.thresholds` in `vitest.config.mts` sets floors of 85% statements,
83% branches, 80% functions and 87% lines over `src/**` (UI primitives and
route layouts are excluded). If a refactor moves code around, coverage itself
does not change; if it deletes well-tested code the floors still hold. Raise
the floors when the numbers move up, never lower them to make a change pass.

Reports land in `coverage/` (text, HTML, lcov) and are gitignored, as are the
Playwright `test-results/` and `playwright-report/` folders.
