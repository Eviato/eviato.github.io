# dawtio.cloud

Source for [dawtio.cloud](https://dawtio.cloud), Maxime Brunet's DevOps and middleware infrastructure contracting site. Built with [Vite](https://vitejs.dev), React, and Tailwind CSS.

## Available scripts

### `npm run dev`

Starts the dev server at [http://localhost:5173](http://localhost:5173) with hot module reload.

### `npm run build`

Builds the site for production straight into `docs/`, which is what GitHub Pages serves on this branch (`gh-pages`).

### `npm run preview`

Serves the built `docs/` output locally, to check a production build before pushing.

### `npm run lint`

Runs ESLint.

## Deploying

GitHub Pages serves this repo's `gh-pages` branch from `/docs`. To publish a change:

```sh
npm run build
git add -A
git commit -m "..."
git push
```
