# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:3000
npm run build      # Production build to /build
npm test           # Jest + React Testing Library (interactive)
npm test -- --watchAll=false   # Run tests once (CI mode)
npm test -- --testPathPattern=<filename>  # Run a single test file
```

## Architecture Overview

This is a React 18 (Create React App) website for SSGD — a multi-site religious/cultural organization. The site supports multiple regional deployments controlled via environment variables.

### Key Directories

- **`src/api/`** — All backend communication. `index.js` creates an Axios instance with a request interceptor that attaches a Bearer token from `localStorage`. `url.js` sets the base URL from `REACT_APP_API_URL`. `API.js` exports ~25 named async functions covering all data needs.
- **`src/Router/Routes.js`** — Single file defining all ~40 routes. A `MainLayout` wrapper component conditionally hides navbar/footer on specific routes (e.g., `/view_bill`).
- **`src/Redux/`** — Redux Toolkit store with a single `audioSlice` tracking `currentSongIndex`, `isPlaying`, and `currentTime` for coordinating the audio player across pages.
- **`src/pages/`** — One directory per route/feature. Each page fetches its own data directly via `src/api/API.js`.
- **`src/common/`** — Shared UI components: breadcrumbs, loaders/skeletons, dialogs, publication filters, and scroll utilities.

### Data Flow

Pages call API functions from `src/api/API.js` directly (no intermediary service layer). Token-based auth: the token is stored in `localStorage` and attached via the Axios request interceptor. No global loading/error state — each page manages its own.

### Styling

Three approaches coexist: Bootstrap 5 (grid/utilities via CDN in `public/index.html`), component-scoped `.css` files, and styled-components/Emotion for some components. MUI is used only for date pickers (`@mui/x-date-pickers`). Font Awesome and Poppins are loaded from CDN.

### Environment

```
REACT_APP_API_URL=https://www.ssgd.org/
```

The API base URL resolves to `https://beadm.ssgd.org/api/v1/`. Commented-out entries in `.env` show alternate site URLs (USA, Surat, etc.) for multi-site deployment.

### Notable Patterns

- `console.log` is disabled globally in `App.js` for production builds.
- Site name used in UI comes from `localStorage` (supports multi-site branding).
- The `Foooter/` directory name is a typo — it's the footer component.
- Skeleton loader components in `src/common/` mirror the shape of the content they replace.
