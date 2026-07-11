# Pattedoie – Context for Claude

## What This Repo Is

**Two independent Astro sites** live in this repo:

1. **lagaille.fr** (repo root) — showcase site for **La Gaille**, French stand-up comedian based in Lyon. This is the main project; everything below describes it unless stated otherwise.
2. **productions.lagaille.fr** (`productions/` subfolder) — showcase site for **Pattedoie Productions**, the production company. Fully independent Astro project (own `package.json`, lockfile, `node_modules`, tsconfig — no npm workspaces, no shared imports; shared assets/patterns are *copied*). See "Productions Site" section at the bottom.

Root site facts:
- Show: *"Entre Rire et Réalité"* (60 min, all ages)
- Production company: **Pattedoie Productions**
- Live at: `https://lagaille.fr`
- Booking contact: `julien.gallego.pro@gmail.com` / Instagram `@la_gaille_`

## Tech Stack

- **Framework**: Astro v5 (static site, no React/Vue)
- **Language**: TypeScript (strict mode)
- **Styling**: Scoped CSS in `.astro` components — no CSS framework
- **Deployment**: GitHub Pages via `withastro/action@v2` on push to `main`
- **Dependencies**: `astro`, `@astrojs/sitemap`, `marked` (markdown → HTML for blog/FAQ), `schema-dts` (typed JSON-LD)

## Commands

```bash
npm run dev      # Local dev server with hot reload
npm run build    # Build to ./dist
npm run preview  # Preview built site locally
```

## Project Structure

```
astro.config.mjs            # Sitemap integration — fetches blog slugs from Wispra at build
src/
  pages/index.astro         # Entry point — composes all sections
  pages/blog.astro          # Blog listing (Wispra API)
  pages/blog/[slug].astro   # Blog article — prerendered via getStaticPaths
  pages/faq.astro           # FAQ page (Wispra API) + schema.org FAQPage
  layouts/Layout.astro      # HTML shell, fonts, global CSS vars, footer, GA + Wispra pixel
  components/
    Header.astro            # Fixed nav bar, hamburger on mobile
    Hero.astro              # Full-width photo + name overlay + CTA
    Bio.astro               # Two-column bio + awards + poster
    Shows.astro             # Dynamic show listings (Google Sheets CSV)
    Contact.astro           # Email + Instagram links
  types/                    # blog.ts, faq.ts — Wispra API response types
  utils/                    # blog-api.ts, faq-api.ts — Wispra fetch helpers
public/
  photo_la_gaille_1.jpg     # Hero photo
  affiche.jpg               # Show poster
Guide d'installation*.mhtml # Wispra setup guides (reference only)
productions/                # Independent site for Pattedoie Productions — see section below
```

## Design System

| Token | Value |
|---|---|
| `--color-bg` | `#ffffff` |
| `--color-accent` | `#c9a84c` (gold) |
| `--color-text` | `#111111` |
| `--color-muted` | `#666666` |
| `--color-cta-bg` | `#111111` |
| Max width | `1100px` |
| Display font | Cormorant Garamond (serif) |
| Body font | Inter (sans-serif) |

## Dynamic Shows Data

`Shows.astro` fetches a **Google Sheets CSV** at build/page-load time.

CSV columns (in order): `display`, `start_date` (DD/MM/YYYY), `end_date`, `days`, `time` (HH:MM), `event_type`, `event_name`, `location`, `venue`, `booking_link`, `info_link`

Logic: filters `display=TRUE`, hides past events, sorts chronologically, formats dates in French. Single-day events (start = end) show one date with weekday, no days label. Action button: `booking_link` → "Réserver", else `info_link` → "Plus d'infos", else greyed "Infos à venir".

## Blog & FAQ (Wispra API)

Blog and FAQ content comes from **Wispra** (`https://api.wispra.fr`), fetched at **build time** (static output — a redeploy is needed to pick up new content).

- Public codes are **hardcoded on purpose** in `src/utils/blog-api.ts` (`pk_blog_…`) and `src/utils/faq-api.ts` (`pk_faq_…`) — they are public keys; env vars were removed because the prod build doesn't have them ("Fix env var prod").
- Article/answer bodies are markdown, rendered with `marked` (`breaks: true, gfm: true`). Prefer `contentPublic`/`responsePublic` over `content`/`response`.
- `blog/[slug].astro` prerenders one page per article via `getStaticPaths`; a duplicate leading H1 matching the title is stripped.
- `astro.config.mjs` feeds article URLs to `@astrojs/sitemap` as `customPages`.
- SEO: JSON-LD `BlogPosting` on articles, `FAQPage` on the FAQ (typed with `schema-dts`).

## Analytics & Tracking

`Layout.astro` `<head>` loads Google Analytics (`G-YB40WS0EY9`) and the **Wispra Pixel V2** (tag `492746cd-fcb1-45fa-9ee8-ec26c6a5eb7e`, with retry-on-error logic).

## Key Conventions

- All component styles are **scoped** — no global classes
- Multi-page site: `/` (home), `/blog`, `/blog/[slug]`, `/faq` — header wordmark links to `/`, footer links to `/blog` and `/faq`
- Home sections use semantic `id` attributes: `#dates`, `#bio`, `#contact`, with `href="#dates"` etc. for smooth scroll
- French language throughout (`lang="fr"` on `<html>`)
- No first-party client-side JS except: Header scroll detection, Shows CSV fetch (third-party: GA + Wispra pixel)
- Responsive breakpoints: 800px (Bio), 680px (Header mobile, Contact grid)

## Productions Site (`productions/`)

Showcase site for **Pattedoie Productions** at `https://productions.lagaille.fr` (temporary domain — a dedicated pattedoie domain may replace it later).

- **Independent Astro v5 project**: run `npm install` / `npm run dev` / `npm run build` *inside* `productions/`. It never touches the root project (root `tsconfig.json` excludes `productions/`).
- **Structure**: multi-page — `/` (accueil), `/spectacles`, `/artistes`, `/entreprises`, `/contact`. Content data lives in `productions/src/data/{spectacles,artistes}.ts` (typed arrays — append entries to extend). Images in `productions/src/assets/` served via `astro:assets` `<Image>`.
- **Design**: same token/scoped-CSS pattern as root, different identity — yellow accent `#f2c200` (from the logo `favicon.png`), display font Archivo, body Inter. No GA, no Wispra pixel.
- **Deployment**: `.github/workflows/deploy-productions.yml` (triggers only on `productions/**` changes) builds the site and pushes `dist/` to the separate repo `PattedoieproductionsOrg/productions.lagaille.fr` (branch `gh-pages`) via `peaceiris/actions-gh-pages` + deploy key (secret `PRODUCTIONS_DEPLOY_KEY`), because GitHub Pages allows only one site/domain per repo (taken by lagaille.fr). Custom domain comes from `productions/public/CNAME`.
- **Domain swap later**: edit `productions/public/CNAME` + `site` in `productions/astro.config.mjs` + robots.txt sitemap URL, add DNS, update Pages cname on the target repo, redeploy.
- The root workflow `deploy.yml` is untouched and still triggers on **every** push to `main` (including productions-only commits — harmless, refreshes Wispra content).
