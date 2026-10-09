# SSGD website (Next.js)

Website for SSGD — a multi-site religious/cultural organization. Migrated from Create React App to **Next.js 16 (App Router)**; see [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) for the full migration record.

## Requirements

- **Node.js >= 20.9** (Next 16 minimum; developed on v22.11.0)
- npm

## Commands

```bash
npm run dev     # dev server (next dev) at http://localhost:3000
npm start       # alias of npm run dev
npm run build   # production build to .next/
npm run serve   # production server (next start)
```

## Environment

```bash
REACT_APP_API_URL is gone — use:
NEXT_PUBLIC_API_URL=https://www.ssgd.org/
```

- Only `NEXT_PUBLIC_*` variables are inlined into the browser bundle; changing one requires a **rebuild** (multi-site deployments rebuild with a different `NEXT_PUBLIC_API_URL`).
- The API base URL resolves to `https://beadm.ssgd.org/api/v1/`. Commented-out entries in `.env` show alternate site URLs (USA, Surat, …) for multi-site deployment.

## Project structure

```
src/
  app/                  # App Router
    layout.js           # root layout: <Providers>, Navbar/Footer, global CSS, CDN <link>/<script>
    page.js             # /
    (main)/…            # every routed page (navbar + footer)
    (bare)/view_bill/   # route rendered WITHOUT navbar/footer
    not-found.js        # 404
  common/
    routerCompat.js     # react-router-shaped API on top of next/navigation
    …                   # shared UI (breadcrumbs, loaders, dialogs, filters, scroll utils)
  views/                # one directory per feature/page (was src/pages/ in CRA)
  commonPublication/    # publication list/table components
  api/                  # axios instance + ~25 named functions in API.js
  Redux/                # Redux Toolkit store (kept for parity, currently unused)
  assets/               # images (static imports)
```

Notes:

- `src/views/Foooter/` keeps the original typo on purpose — renaming would churn imports for no behavior change.
- All component CSS is imported through `src/app/layout.js` in the CRA bundle's order. CRA shipped one stylesheet for every route; Next only loads the current route's CSS, so the global import list is what preserves the cascade.

## `src/common/routerCompat.js`

The app was written against `react-router-dom` v6. `routerCompat` exports the same surface on top of the Next router so the migrated components stay untouched:

| Export | Behaviour |
|---|---|
| `useNavigate()` | `navigate(to, {replace, state})` — number → `router.back()`; state is round-tripped through `sessionStorage` (`setNavState`/`getNavState`) |
| `useLocation()` | `pathname` + `search`, memoised on `pathname|search` (safe as an effect dep) |
| `useParams()` | passthrough to `next/navigation` |
| `Link` | `<a>` + `router.push`, `scroll={false}` |
| `NavLink` | appends `active` + `aria-current="page"`; `end` defaults to `true` when `to === "/"` (react-router v6 default) |

Do not import `react-router-dom` anywhere — `grep react-router-dom src` must stay at 0.

## SEO

- `src/common/seo.js` — `SITE_URL`, `FULL_NAME`, `OG_IMAGE` and `pageMeta({ title, description, path })`.
- Static routes export `metadata = pageMeta(...)` from their folder's `layout.js`; root `layout.js` has the defaults, Organization JSON-LD and Open Graph / Twitter tags.
- `src/app/robots.js` and `src/app/sitemap.js` generate `/robots.txt` and `/sitemap.xml` (static routes only; `/view_bill` and `/thank_you` are `noindex`).
- Open Graph image: `public/og-image.png` (480×597). Social networks cache it, so re-scrape after changing it.
- Known gaps: list content is still fetched client-side, and album/publication detail pages are not in the sitemap.

## Deploy

Node server only (no static export):

```bash
npm run build && npm run serve   # next build + next start
```
