# Reaper Botany Commerce

Full-stack ecommerce starter built with:

- Next.js 16 (App Router, TypeScript)
- Prisma + SQLite
- Server actions for auth, cart, checkout, and admin CRUD
- Role-based admin dashboard

## Features

- 21+ age-gate before storefront access
- Account registration/login/logout
- Product catalog and product detail pages
- Persistent cart per user
- Checkout flow creating orders + order items
- User account page with order history
- Admin dashboard
  - Products: create, edit, publish/unpublish, delete
  - Categories: create, edit, delete
  - Orders: status updates
  - Users: role updates (`USER` / `ADMIN`)
- Product image support via URL or direct upload (`public/uploads`)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create and seed database:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

3. Run development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Default Admin Account

- Email: `admin@ecom.local`
- Password: `Admin123!`

Change this after first login.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint project
- `npm run db:generate` - generate Prisma client
- `npm run db:migrate` - apply migration SQL to SQLite
- `npm run db:apply` - apply migration SQL directly
- `npm run db:seed` - seed admin + canna categories/products
- `npm run db:studio` - Prisma Studio

## Project Notes

- Database file: `prisma/dev.db` (gitignored)
- Session auth uses signed HTTP-only cookies (`AUTH_SECRET` in `.env`)
- Uploads are stored on local disk (`public/uploads`) for local/self-hosted setups.
  For cloud/serverless deployments, replace with S3/R2/GCS object storage.
