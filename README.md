# Service Experience Index

Public directory of UK trade and home-service businesses, scored from verified
customer experience records. Live at https://serviceexperienceindex.com

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4, Radix UI primitives (shadcn-style components in `components/ui`) |
| Data | Airtable |
| Hosting | Netlify |
| Package manager | pnpm 10 (pinned via `packageManager` in `package.json`) |

## Getting started

Requires Node 20.9+ (developed on Node 22) and pnpm 10. The repo pins no Node
version, so match whatever the Netlify site is building with.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

Pages read from Airtable, so `.env.local` must be populated before most of the
site will render. `lib/fallback-data.ts` holds static stand-in data, but it is
wired into only one route (`app/api/profiles/search`) - it is not a general
offline fallback.

## Environment variables

See `.env.example` for the full list and what each one does. Seven are required:

- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`
- `AIRTABLE_PUBLIC_PROFILES_TABLE`, `AIRTABLE_PUBLIC_RECORDS_TABLE`
- `NEXT_PUBLIC_SITE_URL`
- `REVALIDATE_SECRET`, `SEI_AGENT_KEY`

Production values live in the Netlify site's environment variables, not in this
repo. `airtable-fields-Public_Profiles.json` lists the field names the profiles
table is expected to expose.

## Layout

```
app/
  profiles/[slug]        profile pages (primary entity)
  records/[slug]         individual experience records
  trades/[tradeSlug]     trade category landing pages
  london/[areaSlug]/[tradeSlug]
                         area x trade landing pages for SEO
  locations/, methodology/, standards/
  api/
    profiles/            profile read + search endpoints
    quote-requests/      public quote submission
    agent/quote-requests agent endpoint, Bearer token in SEI_AGENT_KEY
    revalidate/          on-demand ISR, guarded by REVALIDATE_SECRET
  sitemap.xml/, robots.ts
lib/
  airtable.ts            Airtable client and read-through cache
  profiles-data.ts, data.ts
  trades.ts, locations.ts taxonomy and slug maps
  fallback-data.ts       static stand-in data (search route only)
components/              presentational components
```

## Deployment

Netlify builds from `main` on push. Build settings and environment variables are
configured in the Netlify UI; there is no `netlify.toml` in the repo, so those
settings are not captured in version control.

To refresh a cached page without a redeploy, POST to `/api/revalidate` with the
`REVALIDATE_SECRET`.

## Known gaps

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so type errors do
  not fail the build. Turning this off will likely surface existing errors.
- `images.unoptimized: true` disables Next.js image optimisation.
- The `lint` script runs `eslint .`, but ESLint is neither installed nor
  configured, so the script currently fails. Either add ESLint or drop the script.
- No automated tests.
- No licence file; licensing and ownership are not stated in the repo.
