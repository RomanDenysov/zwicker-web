# Zwicker

Marketing website and admin for **Zwicker – Reštaurácia a penzión**. Built with [Next.js](https://nextjs.org) and [Payload CMS](https://payloadcms.com) (originally based on the Payload website template) — the public site and the admin panel run in a single Next.js app.

- Public site: `/` (Slovak default, English locale available)
- Admin panel: `/admin`
- Deployed on Vercel (Postgres + Vercel Blob storage)

## Development

Requirements: Node >= 18.20.2 (or >= 20.9), pnpm 9/10, and a running Postgres instance.

```sh
cp .env.example .env   # fill in DATABASE_URL and PAYLOAD_SECRET at minimum
pnpm install
pnpm dev               # http://localhost:3000
```

### Common commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Dev server (site + admin) |
| `pnpm build` / `pnpm start` | Production build / serve (postbuild regenerates the sitemap) |
| `pnpm lint` | ESLint |
| `pnpm test:int` | Vitest integration tests |
| `pnpm test:e2e` | Playwright e2e tests (auto-starts the dev server) |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after schema changes |
| `pnpm generate:importmap` | Regenerate the admin import map after adding custom admin components |
| `pnpm seed` | Seed the database (standalone runner, no HTTP login) |

## Architecture notes

See [CLAUDE.md](./CLAUDE.md) for the full architecture overview: route groups, layout-builder blocks, draft/live preview, revalidation hooks, access control, localization, and database migration workflow.
