# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the source and published site for **Dawtio** (`dawtio.cloud` / `eviato.github.io`), Maxime Brunet's independent DevOps and middleware infrastructure contracting practice. It's a React marketing site (landing page + blog) client-side routed with `react-router-dom`. The `gh-pages` branch is both the working branch and the one GitHub Pages deploys from.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build, output straight to `docs/` (the publish directory)
- `npm run preview` — serve the built `docs/` output locally to sanity-check a production build
- `npm run lint` — ESLint (flat config, `eslint.config.js`)

## Architecture

- `src/App.jsx` — `Nav` + `Footer` wrap a `<Routes>`: `/` → `pages/Home.jsx` (the landing page, composed from `src/components/`: `Hero`, `Certifications`, `Services`, `Stack`, `About`, `Contact`), `/blog` → `pages/BlogIndex.jsx`, `/blog/:slug` → `pages/BlogPost.jsx`.
- `src/posts/*.md` — **blog content lives here, one Markdown file per post.** Each file needs frontmatter (`title`, `date` as `YYYY-MM-DD`, `excerpt`, `tags` as `[Tag One, Tag Two]`, optionally `pinned: true`) followed by the Markdown body — see `welcome-to-the-blog.md` for the format. Adding a new post is just adding a new file; `src/lib/posts.js` auto-discovers everything in this directory via `import.meta.glob`, so nothing else needs to be registered or imported.
- `src/lib/posts.js` — loads and parses posts (hand-rolled frontmatter parser, no dependency). Exports `posts` (all posts, pinned first then by date descending), `allTags` (unique tags across all posts), and `getPost(slug)`.
- `pages/BlogIndex.jsx` — the post list, plus client-side search (matches title/excerpt/content/tags) and tag filtering, both driven off `posts`/`allTags` from `src/lib/posts.js`; no server or index needed since post count is small and everything's already loaded at build time.
- `pages/BlogPost.jsx` renders Markdown via `react-markdown` + `remark-gfm`, styled with the Tailwind Typography plugin (`prose prose-invert`, tinted to the site's accent color via `prose-a:text-accent` etc. — see `src/index.css`'s `@plugin "@tailwindcss/typography"`). A ` ```mermaid ` fenced code block in a post is intercepted (via `react-markdown`'s `components.pre`/`components.code` overrides in `BlogPost.jsx`) and rendered as a diagram by `src/components/Mermaid.jsx`, themed to match the site palette. `mermaid` is dynamically `import()`ed only inside that component — never add a static `import 'mermaid'` anywhere else, since that would pull its (large, diagram-type-specific) chunks into every page instead of only posts that actually use a diagram. Verify with `npm run build` that `docs/assets/` still has separate `mermaid*`/`*Diagram*` chunk files rather than that weight showing up in the main `index-*.js`.
- `package.json` has an `overrides` entry pinning `lodash-es` to a patched version — mermaid's parser (`chevrotain`) pulls in a `lodash-es` with known high-severity advisories; the override fixes it without downgrading mermaid. Keep it if mermaid's dependency tree still needs it (`npm audit` will tell you).
- Headings in post content get real `id`s via the `rehype-slug` plugin (also wired into `BlogPost.jsx`'s `ReactMarkdown`), so a post can link to a specific section of another post with `/blog/other-post#some-heading-slug` (github-slugger rules: lowercase, punctuation stripped, spaces to hyphens). `src/components/ScrollToTop.jsx` scrolls to that element itself on route change — the browser's native load-time fragment scroll fires before React has rendered anything, so it does nothing in this SPA and can't be relied on.
- In-page section anchors (`Services`/`Stack`/`About` in `Nav`) point to `/#section` (not just `#section`) so they resolve correctly from any route, since those sections only exist on `Home`.
- `src/index.css` — Tailwind v4 entry (`@import "tailwindcss"`) plus the design tokens in an `@theme` block (colors: `bg`, `surface`, `surface-2`, `border`, `ink`, `muted`, `accent`, `accent-2`; fonts: `sans` = Inter, `mono` = JetBrains Mono). Tailwind v4 auto-generates utilities from these (`bg-bg`, `text-ink`, `border-border`, etc.) — add new design tokens here rather than hardcoding colors in components.
- `vite.config.js` — sets `build.outDir` to `docs/` so `npm run build` publishes directly; no separate copy step needed.
- `public/` — static files Vite copies verbatim into `docs/` on build, including `CNAME` (custom domain) and `.nojekyll` (stops GitHub Pages from running Jekyll over the output). Keep both here, not hand-edited in `docs/`.
- `docs/` — **build output only, do not hand-edit.** It's committed (not gitignored) because GitHub Pages serves this branch from `/docs`. Regenerate it with `npm run build` and commit the result. `docs/404.html` is a copy of `docs/index.html` (made by the `postbuild` npm script) — GitHub Pages has no server-side rewrites, so this is what makes direct/refreshed loads of `/blog/:slug` work instead of 404ing; `react-router-dom`'s `BrowserRouter` then reads the real path client-side. Don't hand-edit or remove it.

## Deploying a change

1. Edit source under `src/`.
2. `npm run build` (regenerates `docs/` in place).
3. Commit `docs/` along with the source change and push — GitHub Pages picks up `docs/` on `gh-pages` automatically.

## Pre-commit hooks

`.pre-commit-config.yaml` runs standard hygiene checks (case conflicts, large files, JSON/YAML validity, end-of-file fixer, trailing whitespace, no submodules) via pre-commit.ci.
