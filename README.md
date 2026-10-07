# DWS Blog

Front end challenge: a mobile-first blog built with React, Vite and SCSS (no UI libraries).

## Stack

- React 19 + Vite + TypeScript
- React Router (list and detail views)
- SCSS with BEM naming and shared tokens/mixins in `src/styles`
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

## Structure

```
src/
  api/          API client and endpoint functions
  components/   Reusable components
  pages/        Route-level views (PostList, PostDetail)
  styles/       SCSS tokens, mixins, reset and global styles
  test/         Test setup
```

## API

Data comes from `https://tech-test-backend.dwsbrazil.io` (`/posts`, `/authors`, `/categories`).
