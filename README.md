# vibhoragarwal-blog

Personal brand + web development agency website for **Vibhor Agarwal Pagia**. A lead-generation site built with Next.js 15 (App Router): services, portfolio, transparent pricing, an instant quote calculator, a blog, and a password-protected admin dashboard for leads and content.

## Tech stack

- **Next.js 15** (App Router, React Server Components) + **React 19** + **TypeScript**
- **Tailwind CSS 3** with dark mode (class-based, applied before first paint)
- **Prisma + PostgreSQL** (Neon / Supabase / Vercel Postgres all work)
- **Zod** validation, dependency-free HMAC session auth (`node:crypto` only)
- **Lucide** icons, no other UI framework

## Getting started

```bash
# 1. Install dependencies (also runs `prisma generate` via postinstall)
npm install

# 2. Configure environment
cp .env.example .env
# then edit .env — see below

# 3. Create tables and seed starter content
npm run db:push
npm run db:seed

# 4. Start the dev server
npm run dev
```

The site works without a database: every public page reads through `src/lib/content.ts`, which tries the database first and falls back to the typed config in `src/config/*` on any failure. The database is required for **lead capture** and the **admin dashboard**.

## Environment variables

See `.env.example` for the full annotated template.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes (for leads/admin) | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL (no trailing slash) — used for SEO, OG, sitemap |
| `AUTH_SECRET` | Yes (for admin) | HMAC secret for session cookies, min 32 chars |
| `ADMIN_EMAIL` | Yes (for admin) | Admin login email |
| `ADMIN_PASSWORD` | Yes* | Admin login password (plain) |
| `ADMIN_PASSWORD_HASH` | Yes* | Alternative to `ADMIN_PASSWORD`: scrypt hash (see below) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | WhatsApp number for the chat CTAs |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Public contact email |
| `NEXT_PUBLIC_GA_ID` | No | GA4 measurement ID — analytics is off unless set |
| `RATE_LIMIT_PER_MINUTE` | No | Per-IP request limit for public form endpoints (default `5`) |

\* Set one of `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`.

Generate a strong `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Hashing the admin password (`ADMIN_PASSWORD_HASH`)

Instead of storing the password in plain env, you can store a scrypt hash in the format `scrypt$<salt-hex>$<hash-hex>`:

```bash
node -e "const c=require('crypto');const s=c.randomBytes(16);const d=c.scryptSync('your-password',s,64);console.log('scrypt$'+s.toString('hex')+'$'+d.toString('hex'))"
```

Paste the output into `ADMIN_PASSWORD_HASH`. Credentials are verified in constant time.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (`prisma generate` then `next build`) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check, no emit |
| `npm run db:push` | Push `prisma/schema.prisma` to the database |
| `npm run db:seed` | Seed starter blog posts + site settings |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate the Prisma client |

## Project structure

```
prisma/schema.prisma     # Lead, LeadNote, Project, PricingPlan, BlogPost, Faq, Service, SiteSetting
scripts/seed.mjs         # Database seed (plain ESM)
src/
  app/                   # App Router pages: public site, /admin dashboard, /api routes
  components/            # ui/ primitives, layout/, forms/, home/, blog/, projects/, admin/
  config/                # Typed site content: site, services, projects, pricing, faqs, calculator
  lib/                   # db, auth, content (DB↔config merge), posts, markdown, seo, validation,
                         # rate-limit, analytics, utils
```

### Content architecture

Public pages never read the database directly — they go through `src/lib/content.ts` and `src/lib/posts.ts`:

- **Config-first defaults** live in `src/config/*` (projects, services, pricing, FAQs) and ship with the repo.
- **Admin edits upsert database rows**, which win over config by slug; config-only records are appended.
- Blog posts live only in the database and are seeded by `scripts/seed.mjs`.

This means the site renders fully even before the database is provisioned.

### Lead flow

1. Visitors submit the contact form (`/contact`), the request form (`/request-website`) or the quote calculator (home, `/pricing`).
2. `POST /api/leads` validates with zod, rate-limits per IP, and stores a `Lead` (calculator submissions include their selections as JSON).
3. In `/admin`, leads appear in a status pipeline (NEW → CONTACTED → IN_DISCUSSION → PROPOSAL_SENT → WON / LOST) with internal notes, search and filtering.

## Admin dashboard

- URL: `/admin` — login at `/admin/login`.
- Guarded by an HMAC-SHA256-signed, httpOnly session cookie (7-day expiry); the dashboard layout redirects unauthenticated visitors.
- Manage **leads**, **blog posts** (markdown), **projects** and **pricing** — edits are stored in the database and override the config defaults on the public site.

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel.
2. Provision a PostgreSQL database (Neon and Supabase both have free tiers) and set `DATABASE_URL`.
3. Set all required env vars in the Vercel project settings (Production + Preview).
4. Run once against the production database: `npm run db:push && npm run db:seed` (or via `npx prisma` locally with the production `DATABASE_URL`).
5. Set `NEXT_PUBLIC_SITE_URL` to the deployed domain.

The build command (`prisma generate && next build`) needs no special configuration on Vercel.

## Notes

- Project card images are generated SVG placeholders — swap in real screenshots via the `image` field on each project (admin or `src/config/projects.ts`).
- Security headers (nosniff, frame-deny, referrer policy, permissions policy) are set in `next.config.mjs`.
- Rate limiting is in-memory per instance, which is fine for low traffic; use Upstash or similar if you need a shared store.
"# vibhor_blog" 
