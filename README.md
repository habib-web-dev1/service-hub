# ServiceHub

A full-stack service marketplace that connects customers with verified local service providers. Customers can browse, book, and review services. Providers manage their listings and appointments. Admins oversee the entire platform.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## Overview

ServiceHub is a two-sided marketplace for local home and professional services. The platform supports three user roles:

- **Customer** — browse services, create bookings, leave reviews
- **Provider** — publish services, manage appointments, track bookings
- **Admin** — full platform control: users, categories, services, bookings

---

## Features

### Customer

- Browse and search services by keyword or category
- View service details including price, duration, and provider info
- Book a service with a scheduled date/time and notes
- Track and manage bookings (cancel pending/confirmed)
- Leave star ratings and written reviews on completed bookings

### Provider

- Register or upgrade an existing account to Provider
- Create, edit, activate/deactivate service listings
- View all incoming bookings and update their status
- Dashboard with stats: total services, active listings, total bookings

### Admin

- Full platform overview with key metrics
- Manage all users (view, soft-delete)
- Create, delete, and restore service categories
- View and manage all service listings
- Monitor and cancel any booking

### Platform

- JWT-based authentication with role-based access control
- Soft-delete pattern across users, categories, services, and bookings
- Paginated API responses with filtering and search
- Swagger/OpenAPI documentation at `/api/docs`
- Responsive, dark-themed UI built with Tailwind CSS

---

## Tech Stack

### Client

| Technology              | Purpose                      |
| ----------------------- | ---------------------------- |
| Next.js 16 (App Router) | React framework with SSR/CSR |
| React 19                | UI library                   |
| TypeScript              | Type safety                  |
| Tailwind CSS v4         | Styling                      |
| Lucide React            | Icon library                 |

### Server

| Technology           | Purpose                            |
| -------------------- | ---------------------------------- |
| Node.js              | Runtime                            |
| Express 5            | HTTP framework                     |
| TypeScript           | Type safety                        |
| Prisma 7             | ORM and database migrations        |
| PostgreSQL           | Relational database                |
| `@prisma/adapter-pg` | Prisma driver adapter for `pg`     |
| JSON Web Tokens      | Authentication                     |
| bcrypt               | Password hashing                   |
| Zod                  | Schema validation (env + requests) |
| Swagger UI           | API documentation                  |

---

## Project Structure

```
servicehub/
├── client/                     # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── page.tsx         # Landing page
│       │   ├── services/        # Browse & filter services
│       │   ├── bookings/        # Book a service & view bookings
│       │   ├── provider/        # Provider dashboard, services, bookings
│       │   ├── admin/           # Admin control panel
│       │   ├── profile/         # User profile & settings
│       │   ├── login/           # Authentication
│       │   └── register/        # Registration
│       ├── components/          # Shared UI components (Navbar, ConfirmModal)
│       ├── lib/                 # API client, auth helpers
│       └── types/               # Shared TypeScript types
│
└── server/                     # Express backend
    ├── api/
    │   └── index.ts             # Vercel serverless entry point
    ├── src/
    │   ├── config/              # Environment config (Zod-validated)
    │   ├── docs/                # Swagger setup
    │   ├── lib/                 # Prisma client, utilities
    │   ├── middlewares/         # Auth, role, error, validation
    │   ├── routes/              # Route definitions
    │   ├── services/            # Business logic per domain
    │   │   ├── auth/
    │   │   ├── booking/
    │   │   ├── category/
    │   │   ├── review/
    │   │   ├── service/
    │   │   └── user/
    │   └── types/               # Extended Express types
    ├── prisma/
    │   ├── schema.prisma        # Database schema
    │   ├── migrations/          # Migration history
    │   └── seed.ts              # Database seeder
    └── prisma.config.ts         # Prisma v7 config
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm

### 1. Clone the repository

```bash
git clone https://github.com/habib-web-dev1/service-hub.git
cd service-hub
```

### 2. Set up the server

```bash
cd server
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Run database migrations and generate the Prisma client:

```bash
npm run migrate
npm run generate
```

Optionally seed the database with sample data:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.
API docs (Swagger UI) at `http://localhost:5000/api/docs`.

### 3. Set up the client

```bash
cd ../client
npm install
```

Create a local env file:

```bash
cp .env.local.example .env.local   # or create manually
```

Add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Server (`server/.env`)

| Variable             | Required | Description                                                      |
| -------------------- | -------- | ---------------------------------------------------------------- |
| `DATABASE_URL`       | ✅       | PostgreSQL connection string                                     |
| `JWT_SECRET`         | ✅       | Secret key for signing access tokens                             |
| `JWT_REFRESH_SECRET` | ❌       | Secret for refresh tokens (reserved)                             |
| `NODE_ENV`           | ❌       | `development` \| `production` \| `test` (default: `development`) |
| `PORT`               | ❌       | HTTP port (default: `5000`)                                      |
| `CORS_ORIGIN`        | ❌       | Allowed CORS origin (default: `http://localhost:3000`)           |

### Client (`client/.env.local`)

| Variable              | Required | Description                 |
| --------------------- | -------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | ✅       | Base URL of the backend API |

---

## API Reference

Full interactive documentation is available at `/api/docs` when the server is running.

### Base URL

```
http://localhost:5000/api
```

### Endpoints

| Method   | Path                          | Auth           | Description                              |
| -------- | ----------------------------- | -------------- | ---------------------------------------- |
| `POST`   | `/auth/register`              | Public         | Register a new user                      |
| `POST`   | `/auth/login`                 | Public         | Login and receive JWT                    |
| `GET`    | `/services`                   | Public         | List services (filter, search, paginate) |
| `GET`    | `/services/:id`               | Public         | Get a single service                     |
| `POST`   | `/services`                   | Provider       | Create a service                         |
| `PATCH`  | `/services/:id`               | Provider       | Update a service                         |
| `DELETE` | `/services/:id`               | Provider       | Delete a service                         |
| `GET`    | `/services/my`                | Provider       | Get own services                         |
| `GET`    | `/categories`                 | Public         | List all categories                      |
| `POST`   | `/categories`                 | Admin          | Create a category                        |
| `DELETE` | `/categories/:id`             | Admin          | Delete a category                        |
| `PATCH`  | `/categories/:id/restore`     | Admin          | Restore a deleted category               |
| `POST`   | `/bookings`                   | Customer       | Create a booking                         |
| `GET`    | `/bookings/my`                | Customer       | Get own bookings                         |
| `GET`    | `/bookings/provider`          | Provider       | Get provider bookings                    |
| `GET`    | `/bookings`                   | Admin          | Get all bookings                         |
| `PATCH`  | `/bookings/:id/status`        | Provider/Admin | Update booking status                    |
| `PATCH`  | `/bookings/:id/cancel`        | Customer       | Cancel a booking                         |
| `POST`   | `/reviews`                    | Customer       | Submit a review                          |
| `GET`    | `/reviews/service/:serviceId` | Public         | Get reviews for a service                |
| `GET`    | `/users/me`                   | Auth           | Get current user profile                 |
| `PATCH`  | `/users/me`                   | Auth           | Update profile                           |
| `PATCH`  | `/users/me/password`          | Auth           | Change password                          |
| `POST`   | `/users/me/become-provider`   | Auth           | Upgrade to Provider role                 |
| `DELETE` | `/users/me`                   | Auth           | Delete own account                       |
| `GET`    | `/users`                      | Admin          | List all users                           |
| `DELETE` | `/users/:id`                  | Admin          | Delete a user                            |

---

## Deployment

### Server — Vercel

The server is configured for Vercel serverless deployment via `api/index.ts`.

1. Push the repository to GitHub
2. Create a new Vercel project and set the **root directory** to `server`
3. Add the following environment variables in Vercel project settings:

| Variable       | Value                                        |
| -------------- | -------------------------------------------- |
| `DATABASE_URL` | Your production PostgreSQL connection string |
| `JWT_SECRET`   | A long, random secret string                 |
| `NODE_ENV`     | `production`                                 |
| `CORS_ORIGIN`  | Your deployed frontend URL                   |

4. Vercel will automatically run `npm run vercel-build` (`prisma generate && tsc`) on each deploy

> **Note:** Use a connection pooler (e.g., Neon, Supabase, or PgBouncer in transaction mode) for your production database to handle serverless connection limits.

### Client — Vercel

1. Create a separate Vercel project and set the **root directory** to `client`
2. Add the environment variable:

| Variable              | Value                             |
| --------------------- | --------------------------------- |
| `NEXT_PUBLIC_API_URL` | Your deployed server URL + `/api` |

3. Vercel will automatically detect Next.js and run `npm run build`

---

## License

This project is for portfolio and demonstration purposes.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/habib-web-dev1">habib-web-dev1</a>
</div>
