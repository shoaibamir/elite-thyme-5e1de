# Pakistan Cargo Express — Website

Marketing site for [pakistancargoexpress.com](https://pakistancargoexpress.com), a UAE-to-Pakistan cargo, courier and freight-forwarding company. Built with [Next.js](https://nextjs.org) (static export) and [Contentful](https://www.contentful.com) as the CMS, deployed on [Netlify](https://www.netlify.com).

## Tech stack

- **Framework**: Next.js 14 (Pages Router), built with `output: 'export'` — the site is a fully static export, not server-rendered. There is no API routes / `getServerSideProps` support; all data is fetched at build time.
- **CMS**: Contentful, space `dcbua5eethnx`, environment `master`. Content is pulled at build time via [sourcebit](https://github.com/stackbit/sourcebit) (`sourcebit-source-contentful` → `sourcebit-target-next`), configured in [`sourcebit.js`](sourcebit.js).
- **Styling**: Sass, compiled from [`src/sass`](src/sass).
- **Hosting**: Netlify, build defined in [`netlify.toml`](netlify.toml) via [`stackbit-build.sh`](stackbit-build.sh); publish directory is `out`.
- **Node version**: see [`.nvmrc`](.nvmrc).
- **Working rules**: see [`CLAUDE.md`](CLAUDE.md) — this site ranks on page 1 of Google for several terms; changes to it (AI-assisted or otherwise) should be treated as high-stakes.

## Develop locally

1. Install [Node.js](https://nodejs.org/en/) matching the version in [`.nvmrc`](.nvmrc), and npm.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file (git-ignored — never commit this) with your Contentful credentials:

   ```bash
   CONTENTFUL_SPACE_ID=dcbua5eethnx
   CONTENTFUL_ACCESS_TOKEN={contentful_management_token}
   CONTENTFUL_DELIVERY_TOKEN={contentful_delivery_token}   # optional, auto-created if omitted
   CONTENTFUL_PREVIEW_TOKEN={contentful_preview_token}     # optional, auto-created if omitted
   ```

   **Important:** despite the name, `CONTENTFUL_ACCESS_TOKEN` must be a **Content Management API token** (Settings → API keys → Content management tokens in Contentful), not a Content Delivery API token. `sourcebit-source-contentful` calls the Management API at build/dev time regardless of whether delivery/preview tokens are supplied. Using a Delivery token here will fail with a `403 AccessTokenInvalid` error. Management tokens expire (90 days on personal tokens) — if local or Netlify builds start failing with a 403, this is the first thing to check.

4. Start the dev server:

   ```bash
   npm run develop
   ```

5. Open [http://localhost:3000/](http://localhost:3000/).

   **If you kill and restart the dev server, stop it before deleting `.next/`** — removing that directory while the server is still holding file handles on it will corrupt the running server's state and every route will start 404ing until you restart.

## npm scripts

| Script | Description |
| --- | --- |
| `npm run dev` / `npm run develop` | Start the Next.js dev server with live Contentful preview updates. |
| `npm run build` | Production build (`next build`, static export to `out/`). |
| `npm run postbuild` | Runs automatically after `build`. Generates `out/sitemap.xml` from the same page data Next.js uses to build routes ([`scripts/generate-sitemap.js`](scripts/generate-sitemap.js)) — no manual step needed. See **Known issues** below, though — this output does not currently survive to production unmodified. |
| `npm start` | Serve the production build locally (not used in deployment; Netlify serves the static `out/` export directly). |
| `npm run fetch` | Runs `sourcebit fetch` standalone, without a full Next.js build. |

## Editing content

All page content, copy, and per-page SEO fields (title, description, robots, canonical URL override) are managed in Contentful, not in this repo:

👉 [https://app.contentful.com/spaces/dcbua5eethnx](https://app.contentful.com/spaces/dcbua5eethnx)

Site-wide settings (domain, site title, favicon, header/footer nav) live in the `config` entry in the same space.

Most pages are `landing` entries built from a `sections` array (hero, content, features, FAQ, contact — several of these sections, like the "Why Pakistan Cargo Express" features block and the FAQ, are **shared/reused across many pages** by linking the same entry ID, rather than duplicated per page). Some pages (e.g. `/pakistan-cargo-abu-dhabi/`, `/courier-to-pakistan/`, `/packing-services/`) are `page` entries with a single Markdown `content` field instead.

Changes made in Contentful only go live after the next Netlify build — either trigger a manual deploy or wait for the next scheduled/webhook-triggered build.

## SEO infrastructure

- **Sitemap**: auto-generated at build time, see `npm run postbuild` above and **Known issues** below.
- **Robots.txt**: static file at [`public/robots.txt`](public/robots.txt), points to the sitemap.
- **Canonical tags**: rendered per-page in [`src/components/Layout.js`](src/components/Layout.js). Uses the page's `seo.canonicalUrl` field from Contentful if set, otherwise falls back to `config.domain` + the page's URL path.
- **Structured data**, all rendered in `Layout.js`:
  - `LocalBusiness` on every page — name, logo, and NAP (address/phone/social links) are currently **hardcoded in `Layout.js`** rather than pulled from Contentful, since the `config` content type has no fields for them yet. If the business address, phone, or social links change, update them directly in `Layout.js`, not in Contentful.
  - `Service` on route/service pages, via a small `SERVICE_PAGES` lookup table keyed by URL path (in `Layout.js`) — add new entries there for new service pages.
  - `BlogPosting` automatically on every entry where `page.__metadata.modelName === 'post'`, using the real title/date/author from Contentful.
  - **Gotcha**: this version of `react-helmet` silently drops multiple `<script>` tags if they're wrapped in a `React.Fragment`. Return them as a plain array of elements with `key` props instead (see how `Layout.js` does it) — a Fragment will build clean and simply emit no structured data at all, with no error.
- **Redirects**: [`public/_redirects`](public/_redirects), Netlify's redirect format (not related to `robots.txt`, which cannot redirect). See **Known issues**.

## Known issues

- **A Netlify build plugin overwrites `out/sitemap.xml` after our own postbuild script runs.** The live sitemap has shown signs (extra XML namespaces, `lastmod`/`priority`/`changefreq` on every URL, no trailing slashes, a duplicated `/404` entry) of a generic sitemap-generator/submitter plugin — not this repo's `scripts/generate-sitemap.js` — running after ours and clobbering the output. It is **not declared in `netlify.toml`**, so it must be configured at the Netlify site level (Site configuration → Build & deploy → Build plugins). Check there before assuming `generate-sitemap.js` is broken.
- **`public/_redirects` does not appear to be consulted by this deployment.** A path that never existed at all returns the exact same 404 signature as a path with a defined redirect rule — strong evidence the whole `_redirects` mechanism isn't firing, not just a specific rule. Suspected cause: `@netlify/plugin-nextjs` (declared in `netlify.toml`) intercepts routing through its own handler, which this fully-static (`output: 'export'`) site doesn't actually need. Unconfirmed — removing that plugin to test was deliberately not attempted, since it's an infrastructure change with unclear blast radius. Current workaround where this has mattered: remove the offending page from Contentful/`getStaticPaths` entirely (so there's no file for Netlify to serve in preference to a redirect) rather than relying on `_redirects` to catch it.
- **There is a visitor-profiling script running on the live site that is not part of this codebase.** It geolocates visitors by IP (via `ipapi.co`), scores them by inferred device/area "premium" signals, and rewrites WhatsApp CTA links' pre-filled message accordingly. It was found in production page source but does not exist anywhere in this repo, `sourcebit.js`, or Contentful rich-text content — it's most likely injected via Netlify's snippet injection feature or a custom HTML tag in Google Tag Manager. Check both if you need to find, modify, or remove it.

## Deployment

Netlify builds this repo on push to `master` via [`stackbit-build.sh`](stackbit-build.sh) (`npm run build`), publishing the `out/` directory using the [`@netlify/plugin-nextjs`](https://github.com/netlify/netlify-plugin-nextjs) plugin. Confirm Netlify's environment variables (Site settings → Environment variables) have a valid, non-expired `CONTENTFUL_ACCESS_TOKEN` — see the note above. Builds may be manually paused/resumed under Site configuration → Build & deploy → Continuous deployment — check there if pushes aren't triggering deploys.
