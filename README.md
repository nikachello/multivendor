# MultiStore

A Shopify-style multi-tenant store builder for Georgian merchants, built with Next.js (App Router), Prisma/Postgres, better-auth, and a drag-and-drop storefront editor.

## Development

```bash
npm install
npx prisma generate
npm run dev
```

Copy `.env.example` to `.env` and fill in the required values (database, better-auth, Resend, uploadthing, BOG payments) before running the app.

## Database migrations

Migrations are not applied automatically during `npm run build`. Run them explicitly as part of your release process:

```bash
npm run migrate:deploy
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — generate the Prisma client and build for production
- `npm run start` — run the production build
- `npm run lint` — run ESLint
- `npm run migrate:deploy` — apply pending Prisma migrations
