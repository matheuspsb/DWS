# DWS Blog

Front end challenge: a mobile-first blog built with React, Vite and SCSS (no UI libraries).

## Stack

- React 19 + Vite + TypeScript
- React Router (list and detail views)
- SCSS with BEM naming and a token-based design system: JSON tokens in `tokens/` -> Style Dictionary -> CSS custom properties and a Sass map
- Vitest + React Testing Library

## Running

```bash
npm install
npm start
```

The app is served at http://localhost:5173.

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm start`     | Start the dev server         |
| `npm run build` | Production build             |
| `npm test`      | Run unit tests               |
| `npm run lint`  | Lint the code                |
| `npm run tokens` | Regenerate SCSS from `tokens/*.json` (runs automatically before `start` and `build`) |

## Structure

```
tokens/         Design tokens (JSON source of truth)
sd.config.mjs   Style Dictionary configuration
src/
  api/          API client and endpoint functions
  components/   Reusable components
  pages/        Route-level views (PostList, PostDetail)
  styles/       Design system (tokens, functions/mixins, base styles)
  test/         Test setup
```

## API

Data comes from `https://tech-test-backend.dwsbrazil.io` (`/posts`, `/authors`, `/categories`).
