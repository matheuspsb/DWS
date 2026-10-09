# DWS Blog

Front end challenge: a mobile-first blog built with React, Vite and SCSS (no UI libraries).

## Stack

- React 19 + Vite + TypeScript
- React Router (list and detail views)
- TanStack Query for server data, Zustand for global client state (recent searches, viewed posts), the URL for filters, search and sort
- SCSS with BEM naming and a token-based design system: JSON tokens in `tokens/` -> Style Dictionary -> CSS custom properties and a Sass map
- Open Sans, self-hosted variable font through `@fontsource-variable/open-sans`
- Vitest + React Testing Library

## Running

```bash
npm start
```

That is the only command you need. The project ships with a setup script that prepares everything automatically, so there is no `npm install` step and nothing to configure by hand. On every run it:

1. checks that your Node.js version is supported (22.12 or newer);
2. installs the dependencies if they are missing or outdated;
3. generates the design tokens from `tokens/*.json`;
4. starts the dev server.

The app is served at http://localhost:5173. If that port is taken, Vite picks the next free one and prints the URL in the terminal.

The same setup runs before `npm run build`, `npm test`, `npm run lint` and `npm run typecheck`, so they also work on a fresh clone.

| Script           | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| `npm start`      | Start the dev server                                                                 |
| `npm run build`  | Production build                                                                     |
| `npm test`       | Run unit tests                                                                       |
| `npm run lint`   | Lint the code                                                                        |
| `npm run format` | Format the code with Prettier (`npm run format:check` only verifies)                 |
| `npm run tokens` | Regenerate SCSS from `tokens/*.json` (runs automatically before `start` and `build`) |

## Structure

```
tokens/         Design tokens (JSON source of truth)
sd.config.mjs   Style Dictionary configuration
scripts/        setup.mjs: checks Node, installs dependencies when missing and generates tokens (run by the pre* npm hooks)
src/
  services/     REST client and one *.service.ts per resource (posts, authors, categories)
  components/   Atomic Design: atoms, molecules, organisms and templates
  stores/       Global state with Zustand (recent searches, viewed posts), persisted in localStorage
  hooks/        Reusable hooks (TanStack Query hooks, URL filters)
  pages/        Route-level views (PostList, PostDetail)
  styles/       Design system (tokens, functions/mixins, base styles)
  test/         Test setup and helpers
  utils/        Pure helpers
```

## API

Data comes from `https://tech-test-backend.dwsbrazil.io` (`/posts`, `/authors`, `/categories`). The address lives in `.env` (`VITE_API_URL`), which is committed because it is public and keeps `npm start` working on a fresh clone. Requests go through `src/services` and are cached by TanStack Query. The filters, search and sort order live in the URL (`/?category=...&author=...&q=...&sort=oldest`), so a filtered list can be shared.
