# EliteSync — Multi-Tenant Booking & SaaS Platform

**Live demo:** [elite-sync-app.vercel.app](https://elite-sync-app.vercel.app)
**API docs:** [link to Swagger/OpenAPI docs] <!-- paste your Swagger URL here -->

A production-deployed, multi-tenant booking and resource management SaaS platform built as a team project for a 6th-semester university course. I served as **database and API contributor**.

## What it does

EliteSync lets multiple independent businesses manage bookings, staff, and services on one shared platform — without their data ever mixing. Think of it as the backend a small chain of gyms, salons, or clinics could use to manage appointments across locations.

## My contribution

- Designed and implemented the full PostgreSQL relational schema (6 tables), using UUID primary keys and foreign key constraints, migrated via Prisma ORM
- Built the booking conflict detection system using a SQL `OVERLAPS` query with composite indexing on `booking_date + service_id`, preventing double-bookings even under concurrent requests
- Implemented multi-tenant data isolation at the database layer, ensuring zero data leakage between business accounts
- Contributed to REST API design (25+ endpoints), JWT authentication middleware, and RBAC enforcing role-scoped access

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TanStack Query, Tailwind CSS, Vite |
| Backend | Node.js, Express, Prisma ORM, Zod validation |
| Database | PostgreSQL (Render) |
| Auth | JWT, bcrypt, RBAC |
| Deployment | Vercel (frontend), Render (backend + DB), CI/CD on every push |
| Docs | Swagger / OpenAPI |

## Architecture highlights

- **Conflict detection:** a single indexed `OVERLAPS` query replaces what would otherwise need application-level locking, keeping booking integrity correct even under concurrent writes
- **Multi-tenancy:** every table scoped by `business_id`, enforced both in queries and at the API middleware layer
- **CI/CD:** every push to `main` triggers an automated deploy to both Vercel and Render

## Screenshots

<!-- Add 2-3 screenshots here: dashboard, calendar view, booking flow -->
<!-- ![Dashboard](./screenshots/dashboard.png) -->

## Running locally

```bash
git clone https://github.com/panashekeith14/elitesync.git
cd elitesync
npm install
cp .env.example .env   # add your PostgreSQL connection string
npx prisma migrate dev
npm run dev
```

## Status

94% of planned features delivered, including analytics dashboards, calendar management, and full API documentation.
