# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Commands

```bash
npm run dev        # Dev server (next dev) at localhost:3000 — `npm start` is an alias
npm run build      # Production build to .next/
npm run serve      # Production server (next start)
```

There are no tests. The `npm test` CRA script is gone from `package.json`.

Keep the build green before and after any change. `MIGRATION_PLAN.md` is the migration record (status table, locked decisions, gates). Read it before touching routing, layout or CSS.

## Stack

Next.js 16 App Router website in JavaScript (no TypeScript) for SSGD, a multi-site religious and cultural organization. Pages render on the server, and components that need the browser are marked `"use client"`. Deploy as a Node server (`npm run build && npm run serve`), not a static export.

Key dependencies: React 19, Redux Toolkit (`react-redux`), Axios, Bootstrap 5.3.2, slick-carousel, `react-slick`, lightgallery, `react-toastify`, Emotion + MUI (date pickers only, via `@mui/x-date-pickers`), `sass`, `dayjs`, `libphonenumber-js`.

## Directory map

- **`src/app/`** — App Router.
  - `layout.js` is the single root layout. It renders `<Providers>`, the Navbar and Footer, the global CSS imports, and the CDN `<link>`/`<script>` tags ported from CRA's `index.html`.
  - Route groups: `(main)/…` (with navbar and footer) and `(bare)/view_bill` (no navbar or footer).
  - `Providers.js` holds Redux and the `console.log` override. `not-found.js` is the 404 page.
  - `robots.js` and `sitemap.js` generate `/robots.txt` and `/sitemap.xml`. Per-route SEO metadata lives in each route folder's `layout.js` (see SEO below).
- **`src/common/routerCompat.js`** — a react-router-shaped API (`useNavigate`, `useLocation`, `useParams`, `Link`, `NavLink`, `setNavState`/`getNavState`) built on `next/navigation`. **Never import `react-router-dom`.** `grep -rn "react-router-dom" src` should only match this file's comments.
- **`src/api/`** — all backend calls.
  - `url.js` hardcodes the base URL `https://beadm.ssgd.org/api/v1/`. It does not read `NEXT_PUBLIC_API_URL`.
  - `index.js` is an Axios instance. Its request interceptor sets the `authorization` header to the raw value of `localStorage["Token"]`. It is not a `Bearer` token.
  - `API.js` holds the named async functions that pages call directly.
- **`src/views/`** — one directory per route or feature (formerly `src/pages/`). Each page fetches its own data in client effects. There is no global loading or error state.
- **`src/common/`** — shared UI: breadcrumbs, loaders and skeletons, dialogs, publication filters, scroll utilities, `seo.js` (SEO helpers).
- **`src/commonPublication/`** — shared list components for publications (books, albums, videos, images).
- **`src/Redux/`** — a single `audioSlice` and `store.js`. Kept for parity; no page uses it.

## Data flow and state

- Pages call `src/api/API.js` directly. There is no service layer in between.
- Browser-only state lives in `localStorage`. Known keys include `Token`, `siteName` (multi-site branding), `selectedMemberData`, `memberInfoDataLocal`, `verifiedData`, `verifiedOtp`, `verifiedMobileNumber`, `verfiedEmail` (sic), `otpExpiryTime`, `selectedCountryISO`, `validCard`. Every access in the browser must be guarded, because SSR has no `localStorage`.
- The API request body includes a site identifier. See the comment in `.env`.

## Styling

Three approaches coexist:
1. Bootstrap 5 and slick-carousel, imported from **npm** at the top of `src/app/layout.js`.
2. Component-scoped `.css` files.
3. Emotion, used only through MUI date pickers.

Font Awesome and Poppins stay on CDN, in tags inside the root layout `<body>`.

**All reachable component CSS files are imported globally in `src/app/layout.js`, in the order the CRA bundle produced.** CRA shipped one stylesheet for every route, but Next loads only the current route's CSS. Removing an import silently drops rules other pages depend on. When you add component CSS, add its import to that list. Do not rely on route-level imports alone.

## SEO

- `src/common/seo.js` exports `SITE_URL` (from `NEXT_PUBLIC_API_URL`), `FULL_NAME`, `OG_IMAGE` (`/og-image.png`, 480×597 portrait) and `pageMeta({ title, description, path })`.
- Static routes set `export const metadata = pageMeta(...)` in their folder's `layout.js`. Pass `path` only for routes without dynamic children, because a layout's canonical is inherited by nested routes.
- Root `layout.js` holds the default metadata, the Organization JSON-LD and the Twitter card (`summary`).
- Dynamic detail routes have their own `layout.js` with `generateMetadata` (title from the URL slug via `slugToTitle`, canonical via `detailMeta`). No API call, so titles come from the slug only.
- `sitemap.js` lists the static routes plus activity pages fetched from the API (falls back to static routes if the API fails). Other detail pages (albums, publications) are not listed.
- Every page needs exactly one `<h1>`. Pages whose view has no visible H1 get a `<h1 className="visually-hidden">` in their `page.js`. Keep meta descriptions at 150–160 characters.
- `/view_bill` and `/thank_you` are `noindex` and disallowed in `robots.js`.
- The home hero H1 has a `visually-hidden` brand prefix. Keep hero CTAs as `<Link>`, not `<button>`, so crawlers can follow them.

## Environment

```
NEXT_PUBLIC_API_URL="https://www.ssgd.org/"
```

This variable is not read by `src/api/url.js` (see above). It is a site identifier, and `.env` has commented-out alternates for the other deployments (USA, Surat, and others). `NEXT_PUBLIC_*` values are inlined at build time, so changing one requires `npm run build` again.

## Conventions

- `console.log` is overridden to a no-op in `src/app/Providers.js` and `src/app/layout.js`, for parity with the old CRA `App.js`. `console.warn` and `console.error` still work.
- Static image imports return `StaticImageData`. Use `import _x from "…"; const x = _x.src;` at call sites. The image codemod is done, so new image imports must follow this pattern.
- `src/views/Foooter/` is a deliberate typo. Keep it so imports do not churn.
- Skeleton loaders in `src/common/` match the shape of the content they replace.
- Multi-site branding reads `siteName` from `localStorage`, so pages must not assume a single site.

## Migration status

The CRA → Next.js migration is complete (Phases 1–8, all gates passed) and documented in `MIGRATION_PLAN.md`; the image codemod, visual parity check and hydration QA are done. Remaining items there are optional (live payment/OTP flows not executed, `history.pushState` sites left as is). Check the plan before touching routing, layout or CSS.
