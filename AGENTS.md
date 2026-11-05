<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Architecture

Read `ARCHITECTURE.md` before changing folder structure, routes, shared state, the design system or the brand. It is the source of truth for feature folders, tokens, type, motion and tests.

## Design skills

Read the relevant skill before changing UI or interaction design.

- `.agents/skills/unslop/SKILL.md` — use for any visual polish, redesign, or interface cleanup. It covers spacing, color, type, copy, layout, visuals, and motion, plus audit references in `references/`.
- `.agents/skills/apple-design/SKILL.md` — use for interaction feel, gesture behavior, motion, depth, typography, and reduced-motion decisions.

Project design rules:

- Preserve Chronolab.ai's dark studio direction. Use bright-enough cool neutral greys (`#131517` page, `#18191c` section, `#1c1e20` raised); keep those panels neutral, without warm or green tinting. Violet `#7c3aed` is the official brand color and CTA/logo fill, lifting to `#8b5cf6` on hover, with warm off-white `#faf9f6` text. Lavender `#a78bfa` is the brand secondary for selected states, sliders, and the navigation progress bar. One italic key word in each section heading is set in Instrument Serif (`font-serif`) in the brand violet `#7c3aed`. Cost figures, focus rings, active navigation, and chart surfaces stay neutral. Never introduce red, crimson or rose; error and destructive states use the brand tertiary `#c4b5fd`.
- Keep the infinite video wall; it is a product-critical moment, not decorative motion. The home hero is the full-bleed wall. Start it at the beginning of the loop and keep the tiles slightly darkened.
- The home prompt sits at the bottom of the hero at its full size. It does not stick to the viewport or resize on scroll. The sidebar starts collapsed and expands from its top control.
- Do not add decorative status dots before labels.
- Keep body copy sentence case. Section headings are concise 17-19px uppercase labels with a sentence-case description and one italic key word in the brand violet. Do not add uppercase tracked eyebrows above page titles, additional italics for emphasis, colored glows, radial color washes, or hover scaling on cards.
- Small text stays at 11px or larger. Headlines, labels, and buttons do not end in periods.
- Use named transitions and respect `prefers-reduced-motion`.
