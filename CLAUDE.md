# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server (next dev) at localhost:3000 — `npm start` is an alias
npm run build      # Production build to .next/
npm run serve      # Production server (next start)
```

`npm test` is a leftover CRA script; there are no tests.

Build must be green before and after any change. `MIGRATION_PLAN.md` holds the migration record, status table and gates — read it (and never skip a gate) when touching routing, layout or CSS.

## Architecture Overview

Next.js **16 App Router** (JavaScript, no TypeScript) website for SSGD — a multi-site religious/cultural organization. Multiple regional deployments are controlled via environment variables. Rendering is SSR with `"use client"` on components that need the browser.

### Key Directories

- **`src/app/`** — App Router. `layout.js` is the single root layout: `<Providers>` (Redux), Navbar/Footer, global CSS imports, and the CDN `<link>`/`<script>` tags ported from CRA's `index.html`. Route groups: `(main)/…` (navbar + footer) and `(bare)/view_bill` (no navbar/footer). `not-found.js` = 404.
- **`src/common/routerCompat.js`** — the react-router-shaped API (`useNavigate`, `useLocation`, `useParams`, `Link`, `NavLink`, `setNavState`/`getNavState`) on top of `next/navigation`. **Never import `react-router-dom`** — `grep react-router-dom src` must stay at 0.
- **`src/api/`** — All backend communication. `index.js` creates an Axios instance with a request interceptor that attaches a Bearer token from `localStorage` (client-side only). `url.js` sets the base URL from `NEXT_PUBLIC_API_URL`. `API.js` exports ~25 named async functions.
- **`src/Redux/`** — Redux Toolkit store with a single `audioSlice` (`currentSongIndex`, `isPlaying`, `currentTime`). Kept for parity; currently unused by any page.
- **`src/views/`** — One directory per route/feature (this was `src/pages/` in CRA). Each page fetches its own data directly via `src/api/API.js`.
- **`src/common/`** — Shared UI: breadcrumbs, loaders/skeletons, dialogs, publication filters, scroll utilities.

### Data Flow

Pages call API functions from `src/api/API.js` directly (no intermediary service layer). Token-based auth: the token lives in `localStorage` and is attached by the Axios request interceptor, so all fetching runs in client effects. No global loading/error state — each page manages its own.

### Styling

Three approaches coexist: Bootstrap 5 + slick-carousel from **npm** (imported first in `src/app/layout.js`), component-scoped `.css` files, and Emotion for MUI. MUI is used only for date pickers (`@mui/x-date-pickers`). Font Awesome and Poppins stay on CDN (tags in the root layout `<body>`).

**All 43 reachable component CSS files are imported globally in `src/app/layout.js`, in the exact order the CRA bundle produced.** CRA shipped one stylesheet for every route; Next only loads the current route's CSS, so removing an import silently drops rules that other pages depend on. Add new component CSS to that list rather than relying on route-level imports alone.

### Environment

```
NEXT_PUBLIC_API_URL=https://www.ssgd.org/
```

`NEXT_PUBLIC_*` values are inlined at build time — changing one requires `npm run build` again. The API base URL resolves to `https://beadm.ssgd.org/api/v1/`; commented-out entries in `.env` show alternate site URLs (USA, Surat, etc.) for multi-site deployment.

### Notable Patterns

- `console.log` is disabled globally (parity with the old `App.js:6`).
- Site name used in UI comes from `localStorage` (supports multi-site branding).
- The `Foooter/` directory name is a typo — preserved on purpose so imports don't churn.
- Skeleton loader components in `src/common/` mirror the shape of the content they replace.
- Static image imports return `StaticImageData`; call sites use `import _x from "…"; const x = _x.src;`.
- Deploy = Node server: `npm run build && npm run serve` (not static export).
