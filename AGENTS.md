# AGENTS.md

See `CLAUDE.md` for the full architecture writeup (routing, blog post pipeline, Mermaid handling, design tokens). This file is the quick-reference.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — builds straight into `docs/` (the publish dir), then `postbuild` auto-copies `docs/index.html` → `docs/404.html` (needed since GitHub Pages has no server-side rewrites for SPA routes). Don't hand-edit `docs/404.html`.
- `npm run preview` — serve built `docs/` locally
- `npm run lint` — ESLint only; **no test suite and no typecheck script exist** in this repo.
- No CI workflows (`.github/`) — pre-commit hooks (`.pre-commit-config.yaml`) only run generic hygiene (case conflicts, large files, JSON/YAML validity, EOF fixer, trailing whitespace), not lint/build.

## Deploying

`gh-pages` is both the working branch and the one GitHub Pages serves from `/docs`. To publish: `npm run build`, then commit source changes **and** the regenerated `docs/` together, then push. There is no separate deploy step/action.

## Gotchas

- `docs/` is committed build output, not gitignored — never hand-edit; regenerate via `npm run build`.
- Never add a static `import 'mermaid'` anywhere except inside `src/components/Mermaid.jsx` (which dynamically `import()`s it). A static import elsewhere pulls mermaid's large diagram chunks into the main bundle for every page. Verify with `npm run build` that `docs/assets/` still has separate `mermaid*`/`*Diagram*` chunks, not weight added to `index-*.js`.
- Adding a blog post = just add a frontmattered `.md` file to `src/posts/`; `src/lib/posts.js` auto-discovers it via `import.meta.glob`. Nothing else to register.
- Design tokens (colors, fonts) live in `src/index.css`'s `@theme` block — add new tokens there instead of hardcoding colors in components.
- `public/` (not `docs/`) is where `CNAME` and `.nojekyll` are hand-maintained; Vite copies them into `docs/` on build.
- In-page nav anchors (Services/Stack/About) use `/#section`, not bare `#section`, since those sections only exist on `Home`.
