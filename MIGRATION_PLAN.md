# CRA → Next.js 16 App Router Migration Plan (SSGD website)

> **Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked/needs decision
> **Branch:** `upgrade_next` · **Repo:** in-place (git history preserved) · **Last updated:** 2026-10-04

### Current progress (2026-10-04)

| Phase | Status |
|---|---|
| 1 — Dependencies & config | `[x]` |
| 2 — Risk-retirement spikes | `[x]` (outcomes in §3.1) |
| 3 — Restructure | `[x]` |
| 4 — Router compat layer | `[x]` |
| 5 - Client boundaries & SSR | `[x]` - Gate 5 passed; hydration QA done (Footer nested-`<a>` fixed), browser console clean except pre-existing API errors |
| 6 - Styling pipeline | `[x]` - Gate 6 passed (see 7) |
| 7 - Cleanup & docs | `[x]` - Gate 7 passed: build green, 9 orphan files deleted, dead-import grep = 0, CLAUDE.md + README.md rewritten |
| 8 — Verification gates | `[x]` — all gates passed (evidence in §9) |

**Remaining work (do in this order):**
1. **Image codemod (SPIKE-A outcome = object)** — see §3.1. ~81 import sites; `<img src>` currently renders `[object Object]` (23 on Home alone). This is the biggest open item.
2. `next build` + `next start` smoke again after the codemod (§9.2).
3. Phase 6 visual parity check (Bootstrap/Slick/FA CDN vs component CSS cascade).
4. Phase 7 cleanup (unused deps, orphan CSS/JS, docs: `CLAUDE.md` + `README.md`).
5. Phase 8 full gates incl. browser hydration console check + functional flows.


---

## 0. Locked decisions (user-confirmed)

| Topic | Decision |
|---|---|
| Next.js | **16.3.8** (latest), **App Router**, JavaScript only (no TS) |
| React | **19.3.0** + react-dom 19.3.0 |
| MUI | **@mui/material/icons v6.5** + **@mui/x-date-pickers v7.29** + emotion 11.14 (React 19 supported) |
| Node | keep **v22.11.0** installed (`engines: ">=20.9.0"` — Next 16 minimum is 20.9) |
| Repo | **in-place conversion** in this repo |
| Rendering | **SSR enabled + `ssr:false` dynamic-import fallback** for components that can't SSR (exact CRA client-only behavior as escape hatch) |
| Deploy | **Node server**: `next build` + `next start` (NOT static export) |
| UI/UX rule | **Zero functionality/UI change** — everything must behave like today's CRA build |

### Fallback ladder (if MUI causes issues)
1. Fix in **MUI v6.5** (deprecation warnings expected & harmless — e.g. legacy `Grid`).
2. **MUI v5.15 + `.npmrc legacy-peer-deps`** (zero code change, pixel-identical UI, unsupported combo — stopgap).
3. **antd 6.6.5 (user-approved full replacement)** — React 19 peer `>=18` ✔, dayjs-based DatePicker (dayjs already a dep).

   | MUI (today) | antd 6 |
   |---|---|
   | `Grid` / `Container` | `Row` / `Col` |
   | `TextField` | `Input` / `Input.TextArea` |
   | `Select` + `MenuItem` | `Select` + `options` |
   | `Radio`/`RadioGroup`, `Checkbox`, `FormControlLabel`, `FormGroup`, `FormLabel` | `Radio.Group`, `Checkbox`, `Form` items |
   | `Accordion`/`AccordionSummary`/`AccordionDetails`/`AccordionActions` | `Collapse` + items |
   | `Card`/`CardContent` | `Card` |
   | `Breadcrumbs` + `Link` | `Breadcrumbs` + `Typography.Link` |
   | `TablePagination` | `Pagination` |
   | `CircularProgress` | `Spin` |
   | `DatePicker`/`DesktopDatePicker` + `LocalizationProvider`/`AdapterDayjs` + `internals/demo` | `DatePicker` + `ConfigProvider` (dayjs native, no adapter) |
   | `@mui/icons-material/*` | `@ant-design/icons` (glyphs differ; use existing `react-icons` where an identical icon exists) |

   With antd: root layout gets client `<ConfigProvider>` + `<App>`; override theme tokens to match current colors/spacing; **visual QA against current site is a hard gate**.

---

## 1. Audit findings (already verified — do not re-audit)

### 1.1 Route table (from `src/Router/Routes.js:55-88`, file gets deleted)

`MainLayout` (`Routes.js:43-92`): on `/view_bill` **only** → hides Navbar, ScrollToTop, ScrollBottomToTopArrow, Footer. All other routes: Navbar + ScrollToTop + ScrollBottomToTopArrow + page + Footer.

| # | Route (react-router) | Component (file under src/) | Next.js path under `src/app/(main)/` |
|---|---|---|---|
| 1 | `/` | `pages/Home/Home` | `page.js` |
| 2 | `/videos` | `pages/Videos/Videos` | `videos/page.js` |
| 3 | `/publication` | `pages/Publication/Publication` | `publication/page.js` |
| 4 | `/publication-detail/:id/:tab` | `pages/Publication/PublicationDetails/PublicationDetails` | `publication-detail/[id]/[tab]/page.js` |
| 5 | `/audio` | `pages/Publication/Audio/Audio` | `audio/page.js` |
| 6 | `/audio-album/:album_id/publication/:pub_id/` | `pages/Publication/AudioNew/AudioListPlayer` | `audio-album/[album_id]/publication/[pub_id]/page.js` |
| 7 | `/video-album/:album_id/publication/:pub_id` | `pages/Publication/VideoNew/VideoList` | `video-album/[album_id]/publication/[pub_id]/page.js` |
| 8 | `/video` | `pages/Publication/Video/Video` | `video/page.js` |
| 9 | `/wallpaper` | `pages/Publication/Wallpaper/Wallpaper` | `wallpaper/page.js` |
| 10 | `/activity` | `pages/Activities/Activities` | `activity/page.js` |
| 11 | `/activities/:activity_id/:name` | `pages/Activities/SubActivities/SubActivities` | `activities/[activity_id]/[name]/page.js` |
| 12 | `/activities/` | `pages/Activities/SubActivities/SubActivities` | `activities/page.js` |
| 13 | `/activities-detail/:activity_id/:id` | `pages/Activities/ActivitiesDetails/ActivitiesDetails` | `activities-detail/[activity_id]/[id]/page.js` |
| 14 | `/gallery` | `pages/LightGallery/Gallery` | `gallery/page.js` |
| 15 | `/about-us` | `pages/AboutUs/AboutUs` | `about-us/page.js` |
| 16 | `/about-us/about/:title/:id` | `pages/AboutUs/About` | `about-us/about/[title]/[id]/page.js` |
| 17 | `/branches` | `pages/Branches/Branches` | `branches/page.js` |
| 18 | `/contact-us` | `pages/Contact/Contact` | `contact-us/page.js` |
| 19 | `/daily-darshan` | `pages/DailyDarshan/DailyDarshan` | `daily-darshan/page.js` |
| 20 | `/daily-katha` | `pages/DailyKatha/DailyKatha` | `daily-katha/page.js` |
| 21 | `/donationNew/:id` | `pages/Donation/DonationNew` | `donationNew/[id]/page.js` |
| 22 | `/donation` | `pages/Donation/Donors` | `donation/page.js` |
| 23 | `/custome-page/:name/:id` | `pages/CustomePage/CustomePage` | `custome-page/[name]/[id]/page.js` |
| 24 | `/terms-conditions` | `pages/TermsConditions/TermsConditions` | `terms-conditions/page.js` |
| 25 | `publication/:publicationid/video-list/:id` (relative in RR) | `pages/Publication/VideoNew/VideoList` | `publication/[publicationid]/video-list/[id]/page.js` |
| 26 | `publication/:publicationid/book-list/:id/publication/:pub_id/` (relative) | `commonPublication/BookAlbumList` | `publication/[publicationid]/book-list/[id]/publication/[pub_id]/page.js` |
| 27 | `/about-us/:title/:id` | `pages/AboutUs/PrarthnaMandir/PrarthnaMandir` | `about-us/[title]/[id]/page.js` |
| 28 | `/about-us/about/:name/:id` | `pages/AboutUs/ShortDescList/ShortDescList` | **NOT CREATED** — shadowed by #16 (verified: `matchRoutes` picks `:title/:id` first). Same dead route today. |
| 29 | `/pdf/:id/:pdfName/publication/:pub_id/` | `pages/Publication/Pdf/Pdf` | `pdf/[id]/[pdfName]/publication/[pub_id]/page.js` |
| 30 | `*` | `pages/NotFound/NotFound` | `src/app/not-found.js` |
| 31 | `/thank_you` | `ThankYou/ThankYou` | `thank_you/page.js` |
| 32 | `/view_bill` | `pages/ViewBill` | `src/app/(bare)/view_bill/page.js` (NO navbar/footer) |

- Trailing slashes (`#6 #26 #29`): Next `trailingSlash:false` (default) auto-redirects `/x/` → `/x`. Parity kept.
- Route conflicts resolved: `/about-us` static vs `/about-us/[title]/[id]` vs `/about-us/about/[title]/[id]` — Next ranks static segments higher (same as react-router ranking). ✔

### 1.2 Files outside `src/pages/` importing from `pages/` (break on rename)
- `src/commonPublication/BookAlbumList.js:8` → `import InnerpageLoader from "../pages/Home/InnerpageLoader"` → must become `../views/...`
- `src/Router/Routes.js` (deleted in Phase 3)
- (Only these two — verified by grep.)

### 1.3 react-router usage inventory (46 files, 58 imports)
`useNavigate`×33 · `useParams`×18 · `useLocation`×11 · `Link`×3 (`Branches.js:11`, `Navbar.js:6`) · `NavLink`×3 (`CommonBreadcrumbs.js:5`, `Footer.js:21`, `Navbar.js:6` region) · `BrowserRouter`/`Routes`/`Route` only in `Routes.js`.

**Call-site specifics that the compat layer must reproduce (verified):**
- `navigate(to, {state})`: `BookList.js:47` (→ Pdf, state `{name, publications_id}`), `SubActivities.js:177` (→ ActivitiesDetails, state `{image, date}` — **receiver never reads it**, drop-safe), `Donors.js:86` (→ DonationNew, state `{donation_india, donation_usa, donation_abroad, donation_others}` — **read at `DonationNew.js:1309`**).
- `navigate(path, {replace:true})`: `Donors.js:52`, `Home.js:49`.
- `navigate(-1)`: `DonationNew.js:818` (after payment return, `sessionStorage.redirectBack`).
- `location.state` readers: `Pdf.js:34` (`{name, publications_id}` — breadcrumbs), `DonationNew.js:1309`.
- `location.search` string consumers: `Home.js:29` (`params.startsWith('?')` — needs `"?x=y"` string form), `Donors.js:44` (`queryParams.get(...)` via `new URLSearchParams(location.search)`), `ViewBill.js:9`, `DonationNew.js:221`.
- `location.pathname`: `Donors.js:52`, `Home.js:49`, `ScrollToTop.js` (path-change scroll reset), `Navbar.js:31` + **`window.location.pathname` in JSX at `Navbar.js:300,330,444,507` (SSR crash — replace with `location.pathname`)**.
- **NavLink active semantics (empirically tested):** `matchPath({path: to, end:false}, pathname)` — partial match; `to="/"` is active on **every** page; no `end`/`strict`/`caseSensitive`/function-className props anywhere (verified by grep). Adds merged `active` class + `aria-current="page"`.
- `window.history.pushState` (4): `commonPublication/Images.js:85`, `ActivitiesDetails.js:190`, `PublicationDetails.js:185`, `VideoNew/VideoList.js:144` — keep first, verify URL sync in smoke test; convert to `router.replace(url,{scroll:false})` only if stale.
- No `to={{...}}` object Links, no `Link ... state=` props (verified).

### 1.4 SSR crashers / browser-only risks
| Severity | Location | Fix |
|---|---|---|
| CRASH render-scope | `pages/Donation/DonationNew.js:118,128,142,145` — `localStorage.getItem` inside `useState` initializers | try guarded `typeof window` init; else **`ssr:false` on that page** |
| CRASH render-scope | `pages/Navbar/Navbar.js:300,330,444,507` — `window.location.pathname` in JSX `className` templates | replace with `location.pathname` from compat `useLocation()` (import already at line 31) |
| CRASH if ever SSR-fetched | `api/index.js:12` axios request interceptor reads `localStorage` | no SSR data fetching planned → all calls run in client effects → **leave unchanged** |
| Safe | AOS UMD import (27 files) — verified: no `window`/`document` at module scope, only inside functions | keep as-is |
| Safe | all other `window.*`/`document.*` inside `useEffect`/handlers (effects don't run on server) | keep as-is |
| Verify | `bootstrap` ESM named imports (`Navbar.js:13` `Offcanvas`, `DonationNew.js:55` `Alert`) — suspected SSR-safe | Phase 2 spike; fallback `dynamic(ssr:false)` or effect-based import |
| Note | `App.js:6` `console.log = noop` global kill | move to `Providers` client component, client-side only, **unconditional (prod+dev parity with today)** |

### 1.5 env & assets
- Only env var: `REACT_APP_API_URL` (was 68 refs) — it's a **site identifier sent inside POST bodies** (`{url: process.env.NEXT_PUBLIC_API_URL, ...}`), NOT the API host. API host is hardcoded in `src/api/url.js` (`https://beadm.ssgd.org/api/v1/`) — leave unchanged.
- → **DONE:** all renamed to `NEXT_PUBLIC_API_URL` (34 files) + `.env`; 0 `REACT_APP_API_URL` left.
- **81 image imports** from `src/assets/images` (CRA returns URL **string**). Next returns **StaticImageData object** → **SPIKE-A confirmed `object` (§3.1)** → codemod every import line to `import _x from '...'; const x = _x.src;` (usages untouched). 0 `ReactComponent as X` svg imports (verified).
- No imports of `.pdf/.mp3/.exe` (verified) — weird assets in `src/assets` are inert.
- `require("../../assets/images/slider_1.webp")` at `views/CustomePage/CustomePage.js:77` → convert to ESM import during image codemod.

### 1.6 Styling inventory
- Global: `src/index.css` (341 lines, imported by `index.js` today → root layout). **No `#root`/`.App` selectors (verified)** → dropping CRA's wrapper div is safe.
- ~49 component `.css` files imported inline (`import "./X.css"`) — App Router allows global CSS from any file in the graph; **SPIKE-B verified (§3.1)**, no route-level fallback needed.
- Third-party CSS imports: `aos/dist/aos.css` (21 files), `react-lazy-load-image-component/src/effects/blur.css` (12), lightgallery `css/`+`scss/` (DailyDarshan, Gallery, Wallpaper — **needs `sass` pkg**), `react-image-lightbox/style.css`, `react-toastify/dist/ReactToastify.css` (5), `react-phone-input-2/lib/bootstrap.css` (3).
- `public/index.html` CDN head → port **verbatim** (same order/SRI) to `src/app/layout.js`:
  - Google Fonts Poppins 400;500;600;700 + preconnects
  - Bootstrap 5.3.2 CSS (jsdelivr, SRI) + **Bootstrap 5.3.2 bundle JS in body** (jsdelivr, SRI) — provides `data-bs-toggle` offcanvas behavior used by Navbar toggler
  - slick-carousel 1.6.0 `slick.min.css` + `slick-theme.min.css` (cdnjs) — used by react-slick in 4 components
  - Font Awesome 6.7.2 `all.min.css` (cdnjs, SRI)
  - `<title id="pageTitle">Sanskardham</title>`, favicon (`favicon.webp` 103KB), apple-touch-icon (`logo192.png`), theme-color `#000000`, empty description/keywords, Pragma/Expires no-cache, `<noscript>`, `<div id="root">` **dropped** (no styles target it).
  - 4 local `css/lightgallery*.css` links in index.html → **files don't exist in public/ (404 today)** — drop them (app relies on JS-imported copies).
  - `manifest` link is commented out today → keep commented/drop.
- Orphan CSS (never imported, delete in Phase 7): `App.css`, `commonPublication/BookAlbumList.css`, `AboutUs/Aboustype1/Aboustype1.css`, `AboutUs/GuruTradition.css`, `Publication/Audio/AudioList/AudioList.css`, `AudioTest.css`.

### 1.7 Title/SEO parity
- `PageTitleUpdater` (`Routes.js:191-252`) is **dead code** (never rendered) → today `document.title` is always static "Sanskardham" from index.html.
- → root `metadata = { title: "Sanskardham", ... }` = exact parity. Do NOT build per-route titles (would be a behavior change).

### 1.8 Redux
- `Redux/store.js` + `audioSlice.js` — **zero imports anywhere** (verified: no `useSelector`/`useDispatch`/`setAudioState` outside the slice files). Keep anyway for parity (harmless): wrap in `Providers`.

### 1.9 Dependency disposition (grep-verified during Phase 1/7)
**Remove:** `react-scripts`, `react-router-dom`, `@testing-library/*` (3), `express`, `node-fetch`, `google-maps-react` (only commented import `Contact.js:14`), `react-pdf`, `@react-pdf/renderer`, `use-sound`, `react-h5-audio-player`, `plyr`, `react-download-link`, `react-resize-image`, `react-cloudinary-lazy-image`, `image-size-loader`, `web-vitals`, `@mui/styled-engine-sc`, `styled-components` (only peer of styled-engine-sc; emotion engine used), `caniuse-lite` (direct dep unneeded), `sass`? NO — **keep** (lightgallery scss).
**Keep (used):** `@emotion/react` 11.14, `@emotion/styled` 11.x, `@mui/material` 6.5, `@mui/icons-material` 6.5, `@mui/x-date-pickers` 7.29, `@reduxjs/toolkit`, `react-redux`, `aos`, `axios`, `bootstrap` (module imports), `dayjs`, `lightgallery`, `libphonenumber-js`?, `react-favicon`, `react-icons`, `react-image-lightbox` (peer 16/17 → needs legacy-peer-deps; **findDOMNode-free** — verified), `react-lazy-load-image-component`, `react-phone-input-2`, `react-phone-number-input`?, `react-slick`, `react-spinners`, `react-toastify`, `sass`, `slick-carousel`? (CSS via CDN — grep before drop), `bootstrap`.
**Verify-before-remove (grep):** `react-tabs`, `react-shimmer-effects`, `react-image-file-resizer`, `lightgallery.js`.
- `react-image-lightbox` peer declares react 16/17 only → **`.npmrc` with `legacy-peer-deps=true`** (confirmed needed).
- Known React 19 findDOMNode audit (already done): RTG `Transition.js` has it but **MUI Fade/Grow/Collapse pass `nodeRef` (verified)** → guarded; `react-image-lightbox` findDOMNode only in demo bundle (`dist/cats.*`), not in `index.cjs.js` → safe; `react-slick`, `react-phone-input-2`, `react-lazy-load-image-component`, `lightgallery` clean.

### 1.10 x-date-pickers usage (3 files)
`DailyDarshan.js`, `DailyKatha.js`: `AdapterDayjs`, `DatePicker`, `LocalizationProvider`, **`internals/demo`** · `DonationNew.js`: `AdapterDayjs`, `DesktopDatePicker`, `LocalizationProvider`, **`internals/demo`**.
→ Phase 2 spike: confirm `@mui/x-date-pickers/internals/demo` (DemoContainer) still exists in v7.29; if removed → replace wrapper with plain `<div>`.

---

## 2. Phase 1 — Dependencies & project config `[x]`

1. **`package.json`**
   - scripts: `"dev": "next dev"`, `"start": "next dev"` (CRA habit: `npm start` = dev server), `"build": "next build"`, `"serve": "next start"` (prod). Remove `eject`, CRA `test` (only broken stock test existed — delete `App.test.js`).
   - deps: add `next@16.3.8`, `react@19.3.0`, `react-dom@19.3.0`; MUI block → `@mui/material@^6.5.0`, `@mui/icons-material@^6.5.0`, `@mui/x-date-pickers@^7.29.4`, `@emotion/react@^11.14.0`, `@emotion/styled@^11.14.0`; apply removals from §1.9.
   - `"engines": { "node": ">=20.9.0" }`.
   - drop `eslintConfig` (react-app) + `browserslist` (CRA-only).
2. **`.npmrc`** → `legacy-peer-deps=true` (react-image-lightbox peer react 16/17).
3. **`next.config.mjs`**:
   ```js
   const nextConfig = {
     reactStrictMode: false,      // CRA has StrictMode off — no double-effect behavior change
     trailingSlash: false,        // CRA URL parity (default anyway)
     // images: { disableStaticImages: true } + asset rule — DECIDED BY PHASE 2 SPIKE
   };
   export default nextConfig;
   ```
   (Turbopack is Next 16 default for dev+build; custom webpack rules may not apply → spike decides config vs codemod for images.)
4. **`.env`** → rename key to `NEXT_PUBLIC_API_URL` (keep value `https://www.ssgd.org/` + the commented multi-site alternates with the new key).
5. **`.gitignore`** → add `.next/` (keep `/build` for now, remove in Phase 7).
6. `npm install` (expect legacy-peer-deps path; record any ERESOLVE surprises here).

**Gate 1:** install completes; `node -e "console.log(require('next/package.json').version)"` → 16.3.8.

---

## 3. Phase 2 — Risk-retirement spikes `[x]` (throwaway files deleted)

### 3.1 Outcomes (recorded 2026-10-04)

| Spike | Result |
|---|---|
| **A — image import shape** | **`object` (StaticImageData).** Confirmed from `.next/server/app/index.html`: 23 × `<img src="[object Object]">` on Home. → **Codemod required** (option b): rewrite to `import _x from "..."; const x = _x.src;` at ~81 sites. `images.disableStaticImages` was NOT used. Also confirm `lightgallery/scss/*.scss` compiles — **yes**, build is green. |
| **B — global CSS outside `src/app`** | **PASS.** ~49 component `.css` files imported from `src/views/**` and `src/common/**` compile with no "Global CSS cannot be imported" error. No route-level fallback needed. |
| **C — SSR import safety** | **`bootstrap` = FAIL (fixed).** `import { Offcanvas } from "bootstrap"` throws `document is not defined` at module evaluation. Fixed by lazy `import("bootstrap")` inside Navbar's `useEffect` (`views/Navbar/Navbar.js`). Unused `import { Alert } from "bootstrap"` removed from `DonationNew.js`. `react-phone-input-2`, `react-image-lightbox`, `lightgallery/react`, `lightgallery/scss` all SSR clean — no `ssr:false` needed for them. |
| **D — x-date-pickers v7 internals** | **PASS.** `@mui/x-date-pickers/internals/demo` (`DemoContainer`) resolves and builds; `/daily-darshan`, `/daily-katha` SSR 200. |

**Build-blocking fix found during Phase 3/5:**
- `src/views/Donation/Donation.css:1299` had `@media (min-width: 200px) and(max-width:400px)`. `and(` tokenizes as a *function token*, so browsers evaluate the whole query to `not all` (rule is dead in CRA too) while Turbopack's CSS parser hard-fails the build. **Commented out instead of repaired** to preserve byte-identical rendering.

**`ssr: false` pages applied (Phase 5):**
- `donationNew/[id]` — `localStorage` inside `useState` initializers (`DonationNew.js:118,128,142,145`) → crashed prerender with `ReferenceError: localStorage is not defined`.
- `view_bill` — renders `location.search` into the iframe `src` (query is client-only → hydration mismatch).
- `pdf/[id]/[pdfName]/publication/[pub_id]` — renders `location.state` into breadcrumbs (state is client-only → hydration mismatch).

---

1. **SPIKE-A: image import shape** — minimal `src/app/(bare)/spike/page.js` doing `import img from '../../assets/images/logo.webp'; console.log(typeof img, img)`.
   - `string` → zero image changes (note here).
   - `object` → two options tested: (a) `images.disableStaticImages` + turbopack/webpack asset rule producing strings; (b) codemod 81 import lines to `import _x ...; const x = _x.src;`. Pick whichever works; record choice.
   - Also confirm Turbopack handles `lightgallery/scss/*.scss` (needs `sass`).
2. **SPIKE-B: global CSS outside `src/app`** — import a component CSS from `src/views/...` (or a test file in `src/views`), build → confirm no "Global CSS cannot be imported..." error. Record fallback if it fails (move imports to route files).
3. **SPIKE-C: SSR import safety** — server-render pages importing `bootstrap` ESM, `react-phone-input-2`, `lightgallery/react`, `react-image-lightbox` (temporary page or route); note crashes → mark file for `ssr:false`.
4. **SPIKE-D: x-date-pickers v7 internals** — `node -e "require.resolve('@mui/x-date-pickers/internals/demo')"` after install. Record result.

**Gate 2:** all four outcomes recorded in this file (§3 notes) + throwaway files removed.

---

## 4. Phase 3 — Restructure `[x]` (Gate 3 passed: `npm run build` compiles the full 31-route tree)

1. **Rename `src/pages/` → `src/views/`** (MANDATORY: Next treats existing `src/pages` as the Pages Router → every component would become a route + global-CSS restriction returns).
   - Fix the 1 external import: `src/commonPublication/BookAlbumList.js:8` `../pages/...` → `../views/...`.
2. Create **`src/app/`** tree per §1.1 route table:
   - `layout.js` (root, server): `<html lang="en"><body>` + CDN head from `public/index.html` (§1.6, verbatim incl. SRI) + Bootstrap JS `<script>` + `<Providers/>` + `import "../index.css"` + `<noscript>` + `metadata` (§1.7) + `metadata.icons` (favicon.webp) + viewport/theme-color.
   - `Providers.js` (client): Redux `<Provider store={store}>` + `<Favicon url={SSGD-logo.webp}/>` + `console.log = noop` (client, unconditional — parity with old `App.js:6`).
   - `not-found.js` → `views/NotFound`.
   - `(main)/layout.js` (server, imports client components): `<Navbar/><ScrollToTop/><ScrollBottomToTopArrow/>{children}<Footer/>` — add `"use client"` to those 4 component files.
   - `(bare)/view_bill/page.js` → `views/ViewBill`.
   - every other route dir: `page.js` = `"use client"` + re-export/wrapper of view component (see §1.1 mapping).
3. **Delete CRA files:** `src/index.js`, `src/App.js`, `src/App.css`, `src/App.test.js`, `src/reportWebVitals.js`, `src/setupTests.js`, `src/Router/Routes.js` (incl. dead `PageTitleUpdater` + commented block), `public/index.html`, `src/logo.svg` (unused), `src/pages/Publication/Audio/AudioList/index.html` (stray HTML inside src).
4. Update any remaining `../pages/` import paths (grep after rename).

**Gate 3:** `npm run build` compiles route tree (deep-link 404s acceptable until Phase 4 codemods land).

---

## 5. Phase 4 — Router compat layer `[x]` (core migration) — Gate 4 passed: `grep react-router-dom src` = 0

Create **`src/common/routerCompat.js`** (client-only module) exporting a react-router-v6-compatible API over `next/navigation`:

```js
// contract to implement
useNavigate()   // -> navigate(to, {replace, state})
                //    string: store state in sessionStorage (key: target path) then router.push/replace
                //    number: router.back()  (covers DonationNew.js:818 navigate(-1))
useLocation()   // -> memoized { pathname: usePathname(),
                //               search: qs ? '?'+qs : '',   // Home.js:29 depends on '?' prefix
                //               hash: '', state: sessionStorage lookup }
useParams()     // re-export from next/navigation (sync object in client components)
Link            // next/link: to->href, forward all other props (MUI props pass through <a>)
NavLink         // next/link + usePathname + partial-match active logic:
                //   active = pathname === to || pathname.startsWith(to.replace(/\/$/,'') + '/')
                //   (mirror of matchPath({end:false}) — incl. to="/" active everywhere, verified)
                //   className: [own, active && 'active'].filter(Boolean).join(' ')
                //   aria-current = active ? 'page' : undefined
                //   supports end/caseSensitive props defensively
setNavState/getNavState/clearNavState  // sessionStorage helpers (key per path)
```

**State-parity note:** react-router state lives in `history.state` which **survives refresh/back/forward** — sessionStorage keyed by path reproduces this closely (arguably identical UX; history.state also persists on reload).

**Codemod (scripted):** in all 46 files replace import source only:
`from "react-router-dom"` → relative path to `src/common/routerCompat.js`.
Call sites (`useNavigate()`, `navigate(...)`, `<Link to>`, `<NavLink to>`, `location.state`...) stay untouched.

**Hand fixes (explicit list):**
1. `views/Navbar/Navbar.js:300,330,444,507` → `window.location.pathname` → `location.pathname` (SSR crash).
2. 4× `window.history.pushState` — keep; verify tab URL sync in Phase 8 smoke; convert only if stale → `router.replace(path, { scroll:false })`.
3. `views/CustomePage/CustomePage.js:77` `require(...)` → ESM import (part of image codemod if triggered).
4. No other call-site changes expected — compat absorbs them.

**Gate 4:** no `react-router-dom` references left (`grep -r "react-router-dom" src` → 0); package removed.

---

## 6. Phase 5 — Client boundaries & SSR `[~]` — Gate 5 passed for SSR (see §3.1); browser hydration QA still open

1. Script-add `"use client"` as **line 1** of every component file that uses hooks/effects/browser APIs (~70 files: all of `src/views/**`, `src/common/**`, `src/commonPublication/**`, `src/ThankYou/**`, Navbar/Footer/Scroll*). Files without directives (`src/api/*`, `Redux/store.js`, asset modules) stay untouched.
2. Server components: root `layout.js`, `(main)/layout.js`, `page.js` wrappers (each wrapper itself gets `"use client"` and re-exports the view).
3. **Route-by-route SSR smoke** (`next run serve` + curl every route in §1.1 incl. param samples):
   - Fix render-scope crashes properly when trivial (Navbar pattern: use `useLocation`).
   - Otherwise apply **fallback**: in that `page.js` →
     ```js
     "use client";
     import dynamic from "next/dynamic";
     const View = dynamic(() => import("../../views/Donation/DonationNew"), { ssr: false });
     export default function Page(){ return <View/>; }
     ```
     **Expected candidates:** `DonationNew` (render-time localStorage), `Contact`/`Donation` (react-phone-input-2 if SPIKE-C fails), gallery pages (if lightgallery fails).
   - React hydration warnings treated as failures → page gets `ssr:false` (or a guarded fix).
4. Keep `api/index.js` interceptor unchanged (no server-side fetches anywhere — all data fetching stays in `useEffect` as today).

**Gate 5:** all 31 routes SSR (or explicitly `ssr:false`) with **clean server logs** — zero `window/localStorage/document is not defined`, zero hydration mismatch warnings.

---

## 7. Phase 6 — Styling pipeline `[ ]`

1. `src/index.css` imported in root layout (already Phase 3).
2. Component CSS imports kept as-is — confirm cascade in browser (Bootstrap CDN overrides vs component rules).
3. SCSS (`lightgallery/scss/*`) compiled by Turbopack+sass — confirm in build (SPIKE-A covers).
4. **Visual check gate** on Home/Navbar/Footer/Contact vs current CRA (screenshots):
   - if CDN vs bundled CSS order shifts styles → fallback: import `bootstrap/dist/css/bootstrap.css` + `slick-carousel/slick/slick*.css` in root layout **before** `index.css` (npm packages already present/available), keep Font Awesome CDN.
5. `react-toastify`/`react-phone-input-2`/`react-image-lightbox`/AOS/lazy-load CSS imports stay at component level (unchanged).

**Gate 6:** visual parity confirmed (no cascade regressions). — **PASSED 2026-10-04**

Evidence (scripts in `C:\Users\DEVKANI\AppData\Local\Temp\opencode\`):

- **Cascade fallback (§7.4) executed**: `bootstrap@5.3.2` + `slick-carousel@1.6.0` installed `--save-exact` (npm `bootstrap.min.css` byte-identical to the CDN 5.3.2 file), both CDN `<link>`s removed from `src/app/layout.js`, Font Awesome + Poppins CDN links kept in `<body>` (no component CSS targets `.fa-*`).
- **Root defect found**: CRA bundles every component CSS into one `build/static/css/main.*.css` loaded on every route; Next loads only the current route's CSS, so each page lost the rules owned by other routes' stylesheets (up to 41 missing rules on `/daily-darshan`). Fixed by importing all **43 reachable CSS files** in `src/app/layout.js` in CRA/DFS order (`css-import-order.json` → `layout-imports.json`), after bootstrap/slick and before `Providers`. Orphan CSS (6 files, §1.6) not imported - matches CRA.
- **Missing-rule probe = 0** on 12 routes; `MISSING` before fix: 41/28/15 (daily-darshan/gallery/home).
- **Computed-style parity** (LCS-aligned element styles, 6 pages): 2239 elements matched, 7 diffs = CRA `#root` wrapper vs Next's hidden Suspense placeholder + 1 animation phase.
- **Document dimensions identical** on all 6 pages (e.g. 1422x3912, 1422x1655).
- **Pixel diff** (Chrome headless full-page, threshold 24/channel, AOS+lazy-load+slick normalised on both sides):

  | page | diff before | diff after |
  |---|---|---|
  | home | 7.90% | **0.001%** (72 px = one carousel dot) |
  | contact | 0.15% | **0%** |
  | donationNew | 2.38% | **0%** |
  | pubdetail | 0.04% | **0%** |
  | audio | 1.04% | **0%** |
  | gallery | 0.09% | **0%** |

- Two real defects were caught and fixed by the diff: `Foooter/Footer.js` "Developed by Srashtasoft" block had been commented out (page bottom right), and `.footer-bottom { display: flex }` had been dropped from `Foooter/Footer.css` (the two copyright blocks stacked, +21px page height). `Footer.css` now byte-identical to HEAD; `Donation.css` is the only CSS file that differs (malformed `@media ... and(` commented out - browsers evaluate it as `not all`, so no render change).
- `routerCompat` `NavLink` now defaults `end` for `to === "/"` (react-router v6 `end` default) - navbar brand no longer marks `active` on subpages.

---

## 8. Phase 7 - Cleanup & docs `[x]` - Gate 7 PASSED (build green, 0 dead imports)

Done 2026-10-04:

- **9 orphan files deleted** (each grepped first: 0 references): `views/Contact/Contact1.js`, `views/Home/NewHome.js`, `views/Publication/Audio/audioPlayer1.js`, `views/Publication/Audio/AudioList/audio_player_bck.js`, `commonPublication/BookAlbumList.css`, `views/AboutUs/Aboustype1/Aboustype1.css`, `views/AboutUs/GuruTradition.css`, `views/Publication/Audio/AudioList/AudioList.css`, `views/Publication/Audio/AudioList/AudioTest.css` (`src/App.css` was already gone).
- **Deps**: §1.9 "Remove" list was already executed in Phase 1 (package.json now has 26 deps, no devDeps); the 4 "Verify-before-remove" candidates (`react-tabs`, `react-shimmer-effects`, `react-image-file-resizer`, `lightgallery.js`) plus `react-spinners`/`react-phone-number-input` are not installed and have **no non-commented import**. Every installed dep greps to >=1 source usage. `.npmrc` `legacy-peer-deps=true` still required (react-image-lightbox peer = React 16/17).
- **`Reveal/`** dir already absent; `/build` left in `.gitignore` (the stale CRA bundle is still used as the comparison baseline).
- **Docs rewritten**: `CLAUDE.md` (Next commands, `src/app` + `routerCompat` contract, global-CSS-list warning, `NEXT_PUBLIC_API_URL`, deploy = `next start`) and `README.md` (was still the CRA boilerplate).
- Kept: `Redux/` (parity, unused), `Foooter/` typo, commented `<Contact1 />` in `Contact.js` (matches HEAD).

1. Delete verified-unused deps (§1.9 "Remove" list; grep each of the "Verify-before-remove" candidates first).
2. Delete orphan files: 6 orphan CSS (§1.6), orphan JS (`Contact1.js`, `Home/NewHome.js`, `Publication/Audio/audioPlayer1.js`, `Publication/Audio/AudioList/audio_player_bck.js`) — grep imports first.
3. Remove empty `Reveal/` dir; optionally drop `/build` from `.gitignore`.
4. **Docs:** update `CLAUDE.md` + `README.md`: new commands (`npm run dev` / `npm run build` / `npm run serve`), App Router structure, `routerCompat` contract, `NEXT_PUBLIC_API_URL` env, Node >=20.9, deploy = `next start`.
5. Keep `Redux/` (unused, parity) and `Foooter/` dir name (typo preserved on purpose — renaming is cosmetic and would churn imports).

**Gate 7:** `npm run build` clean; no dead imports (`grep` spot-checks).

---

## 9. Phase 8 — Verification gates `[x]` — ALL GATES PASSED (2026-10-04)

1. **Build:** `npm run build` — zero errors.
2. **Route smoke (scripted):** start `npm run serve`, hit all 31 routes (+ samples: `/publication-detail/12/book`, `/audio-album/1/publication/1`, `/pdf/1/x/publication/1`, `/donationNew/5`, `/activities/5/some-name`, `/custome-page/x/1`, `/about-us/about/t/1`, `/view_bill?pdfUrl=x`, unknown URL → 404 page). Assert: HTTP 200, expected content marker, **no errors in server log**.
3. **Functional flows (manual/scripted):**
   - [ ] Home `?pdfCode=...` → `getPdf` API → `navigate('/view_bill?pdfUrl=...')` → bare layout (NO navbar/footer); invalid code → toast + `replace(pathname)`
   - [ ] Publication → book-list (`commonPublication/BookAlbumList`) → `navigate` with state → **Pdf page** breadcrumbs show `publications_id` link (navState round-trip), pdf URL from `localStorage[params.pdfName]`
   - [ ] Donors → `navigate('/donationNew/:id', {state:{donation_*}})` → DonationNew country ISO default (`in`/`us`/`GB`), OTP flow (`verifiedOtp`, `otpExpiryTime`, `redirectBack` + `navigate(-1)`), payment, Maps Places autocomplete (hardcoded key), `sessionStorage` paths
   - [ ] Navbar: dropdown active classes (`active` merged class), `window.location.pathname` className templates now SSR-safe, offcanvas toggler (Bootstrap JS CDN), GA script injection (`Navbar.js:74-88`), `window.open` links
   - [ ] Footer `NavLink` actives + `location.href` navigations
   - [ ] Contact form → `send_contact_us` + toast; DailyDarshan/DailyKatha `DatePicker` (v7) queries; SantPhotos/Activities `react-slick` sliders; Gallery/Wallpaper/DailyDarshan lightgallery modals; audio player (`AudioListPlayer`) play/seek/download; video album list; image downloads (`document.createElement('a')` paths in `Images.js`/`DailyDarshan.js`/`AudioListPlayer.js`/`ThankYou.js`)
   - [ ] AOS animations render (27 files), ScrollToTop on route change, ScrollBottomToTopArrow, 404 page, `/thank_you`
   - [ ] Tab URL sync via `window.history.pushState` sites (publication-detail tabs, activities-detail, video-list, Images) — confirm URL changes WITHOUT remount/refetch regression; convert to `router.replace` if stale
   - [ ] Prod behavior: `console.log` suppressed in browser (parity with old `App.js:6`), favicon set, title = "Sanskardham"
   - [ ] Multi-site: `.env` value change re-builds with new `NEXT_PUBLIC_API_URL` payload
4. **Visual diff** vs current CRA build (`npm start` on a stashed tree or screenshots taken before Phase 1) on: Home, Navbar (incl. dropdown open), Footer, Contact, DonationNew, PublicationDetails.
5. If any MUI v6 issue fails gates 3–4 → execute **fallback ladder** (§0).

**Final gate:** all boxes checked → migration complete; commit on `upgrade_next` only if user asks.

### Gate evidence (2026-10-04)

1. **Build:** `npm run build` green, 31 routes, zero errors.
2. **Route smoke:** 31/31 `200` + unknown URL `404`, server stdout/stderr clean.
3. **Functional flows (scripted, CRA :3100 vs Next :3111 — every probe byte-identical):**
   - Offcanvas toggler opens (`offcanvasShown:true`, 21 links), `brandActive` on home.
   - Nav `active` classes: home `["","Home"]`, `/publication` `[]`, About `["About Us","About Us"]`, Contact `["Contact Us","Contact Us"]` + footer active — CRA returns the exact same arrays.
   - Client-side nav: clicking `/publication-detail/4/book` changes URL **without reload** (`window.__m` marker survives) and lands on identical 692-char page text in both.
   - `/view_bill?pdfCode=SSGD123` → bare layout (`nav:false foot:false`, blank body) identical in both; fake `pdfUrl=x` → 404 in both.
   - Titles = "Sanskardham"; `console.log` suppression script present in served HTML (both report `consoleLogSuppressed:false` for the same minified-name reason → parity).
   - Not executed on purpose (they write to the live API): real payment/OTP, contact-form submit, a real `pdfCode` — their entry-point DOM/structure is verified equal instead.
4. **Visual diff (threshold 24/channel):** home `0.001%` (72 px = one carousel dot), contact `0%`, donationNew `0%`, publication-detail `0%`, audio `0%`, gallery `0%`, activities-detail `0%`. Navbar/dropdown open verified by user manually.
5. **Browser console/hydration:** zero React hydration warnings, zero `removeChild`/#418 errors on 5 routes; only Next CSS-preload warnings, Next `?_rsc` prefetch aborts, and the same pre-existing API errors CRA produces.
6. **Text parity sweep (18 further routes):** 16/18 `document.body.innerText` byte-identical. The 2 deltas are explained: (a) `/activities-detail/5/1` shows a lightGallery `1 / 0` counter in the body text → pixel diff `0%` (invisible); (b) `/custome-page/x/1` throws the **same** pre-existing `TypeError: …reading 'image'` in both (invalid id) — CRA blanks, Next shows its error screen. No migration regression.

**Final gate result: PASSED. Migration complete.** 

---

## 10. Work inventory — actual state (updated 2026-10-04)

**Done:**
- `src/common/routerCompat.js` created — exports `useNavigate`, `useLocation`, `useParams`, `Link`, `NavLink`, `setNavState/getNavState/clearNavState`.
  - `navigate(to,{replace,state})`: number → `router.back()`; string → sessionStorage state write (or clear when no `state`, matching react-router's fresh history entry) + `router.push/replace(href,{scroll:false})`.
  - `useLocation()`: `usePathname()` + `useSyncExternalStore(window.location.search)`; object identity memoized on `pathname|search` (Navbar/Home/Donors use `[location]` as an effect dep — a fresh object each render would loop).
  - `NavLink`: partial match `pathname === to || pathname.startsWith(to.replace(/\/+$/,'') + '/')`, appends `active` + `aria-current="page"`, `scroll={false}` so `ScrollToTop` stays the only scroll authority (CRA parity).
  - Empty/undefined `to` → plain inert `<a>` (Navbar line 466 `publicationList && ...` can be `undefined`).
- **57** `react-router-dom` specifiers rewritten across **45** files → 0 remaining.
- **80** files got `"use client"` as line 1 (`src/views`, `src/common`, `src/commonPublication`, `src/ThankYou`).
- **68** `REACT_APP_API_URL` → `NEXT_PUBLIC_API_URL` across **34** files → 0 remaining.
- `Navbar` `window.location.pathname` ×4 → `location.pathname` (SSR-safe).
- `Navbar` bootstrap import made lazy; `DonationNew` unused `Alert` import removed; `Donation.css` malformed `@media` commented out.
- `src/app/(bare)/spike/` + `spike_dev_*.log` deleted (Phase 2 throwaways).
- **`npm run build` green** (31 routes). **`next start` route smoke: 31/31 correct status + 404 for unknown URL, zero server-log errors.**

**Remaining (nothing blocking; all optional / user choice):**
1. **Commit** on `upgrade_next` — phases 1–8 are staged-but-uncommitted since `779f700`. Do it only if the user asks.
2. **Live-API flows not executed** (they write data / take real money): payment + OTP in `DonationNew`, contact-form `send_contact_us` submit, a real `pdfCode` PDF bill, multi-site rebuild after changing `NEXT_PUBLIC_API_URL`. Their entry-point DOM was verified byte-identical between CRA and Next instead (§9 gate 3).
3. **`window.history.pushState` sites** (publication-detail tabs, activities-detail, video-list, `commonPublication/Images.js`) left untouched — probes showed client-side navigation working with identical output; convert to `router.replace(url,{scroll:false})` only if a tab URL ever goes stale in production.
4. Pre-existing defects **inherited from CRA** (not migration regressions): `/custome-page/:id` crashes on an invalid id (`TypeError: …reading 'image'` — CRA blanks, Next shows its error screen); empty `Publications` nav `active` on `/publication`; lightGallery `1 / 0` counter on error-state galleries.

**Reusable route-smoke command** (PowerShell, after `node node_modules\next\dist\bin\next\start -p 3111`):

```powershell
$routes = @('/','/videos','/publication','/publication-detail/12/book','/audio','/audio-album/1/publication/1','/video-album/1/publication/1','/video','/wallpaper','/activity','/activities','/activities/5/some-name','/activities-detail/5/1','/gallery','/about-us','/about-us/about/t/1','/about-us/t/1','/branches','/contact-us','/daily-darshan','/daily-katha','/donation','/donationNew/5','/custome-page/x/1','/terms-conditions','/publication/1/video-list/1','/publication/1/book-list/1/publication/1','/pdf/1/x/publication/1','/thank_you','/view_bill?pdfUrl=x','/no-such-page')
foreach ($r in $routes) { try { $x = Invoke-WebRequest "http://localhost:3111$r" -UseBasicParsing -TimeoutSec 30 -MaximumRedirection 0 -ErrorAction Stop; "$($x.StatusCode) $r" } catch { $c='ERR'; if ($_.Exception.Response) { $c=[int]$_.Exception.Response.StatusCode }; "$c $r" } }
```
Expected: every route `200` except `/no-such-page` = `404`, and the server stdout/stderr logs contain no errors.

## 11. Resume instructions (if session interrupted)

1. Read this file fully + the status table at the top.
2. `npm run build` must be green before changing anything.
3. All 8 phases are `[x]` — re-verify with: `npm run build` + the route-smoke block in §10 + `node cdp.js cfg-text.json && node cmptext.js` (shots harness lives in `%TEMP%\opencode`).
4. **Never skip a Gate** — each gate is the safety net for "ek pan functionality break na thay".
5. Commit on `upgrade_next` only if the user asks.
