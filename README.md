<div align="center">

<img src="https://img.shields.io/badge/ServiceHub-Marketplace-06b6d4?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0zIDloOW0tOSA2aDlNMTMgM2g4TTEzIDloOE0xMyAxNWg4Ii8+PC9zdmc+" alt="ServiceHub" />

# ServiceHub

### A full-stack service marketplace connecting customers with verified local professionals

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-service--hub--xc5b.vercel.app-06b6d4?style=for-the-badge)](https://service-hub-xc5b.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-habib--web--dev1%2Fservice--hub-181717?style=for-the-badge&logo=github)](https://github.com/habib-web-dev1/service-hub)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [📡 API Reference](#-api-reference)
- [☁️ Deployment](#️-deployment)

---

## ✨ Overview

**ServiceHub** is a two-sided marketplace for local home and professional services. Customers discover and book vetted providers, providers grow their business, and admins keep the platform running smoothly — all in one elegant dark-themed interface.

The platform supports **three user roles**:

| Role            | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| 🧑‍💼 **Customer** | Browse services, create bookings, leave reviews              |
| 🔧 **Provider** | Publish listings, manage appointments, track revenue         |
| 🛡️ **Admin**    | Full platform control: users, categories, services, bookings |

---

## 🚀 Features

<details>
<summary><b>🧑‍💼 Customer</b></summary>

- Browse and search services by keyword or category
- View service details — price, duration, and provider info
- Book a service with a scheduled date/time and custom notes
- Track and manage bookings (cancel pending/confirmed appointments)
- Leave star ratings and written reviews on completed bookings

</details>

<details>
<summary><b>🔧 Provider</b></summary>

- Register directly as a Provider or upgrade an existing account
- Create, edit, and activate/deactivate service listings
- View all incoming customer bookings and update their status
- Dashboard with live stats: total services, active listings, total bookings

</details>

<details>
<summary><b>🛡️ Admin</b></summary>

- Full platform overview with key metrics
- Manage all registered users (view, soft-delete)
- Create, delete, and restore service categories
- View and manage all service listings across providers
- Monitor and cancel any booking on the platform

</details>

<details>
<summary><b>⚙️ Platform</b></summary>

- 🔐 JWT-based authentication with role-based access control
- 🗑️ Soft-delete pattern across users, categories, services, and bookings
- 📄 Paginated API responses with filtering and full-text search
- 📖 Swagger / OpenAPI docs at `/api/docs`
- 📱 Fully responsive, dark-themed UI built with Tailwind CSS v4

</details>

---

## 🛠️ Tech Stack

### 🖥️ Client

| Technology                                                                                                                 | Version | Purpose                               |
| -------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------- |
| ![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white&style=flat-square) Next.js              | 16      | React framework (App Router, SSR/CSR) |
| ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=flat-square) React                     | 19      | UI library                            |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) TypeScript | 5       | Static typing                         |
| ![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square) Tailwind CSS  | v4      | Utility-first styling                 |
| Lucide React                                                                                                               | 1.31    | Icon system                           |

### ⚙️ Server

| Technology                                                                                                                 | Version | Purpose                             |
| -------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------- |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square) Node.js           | 20+     | Runtime environment                 |
| ![Express](https://img.shields.io/badge/Express-000?logo=express&logoColor=white&style=flat-square) Express                | 5       | HTTP framework                      |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) TypeScript | 5       | Static typing                       |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=flat-square) Prisma                 | 7       | ORM & database migrations           |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat-square) PostgreSQL | —       | Relational database                 |
| `@prisma/adapter-pg`                                                                                                       | —       | Serverless-compatible Prisma driver |
| ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square) JSON Web Tokens       | —       | Stateless authentication            |
| bcrypt                                                                                                                     | —       | Password hashing                    |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square) Zod                                                      | 4       | Schema validation (env + requests)  |
| Swagger UI                                                                                                                 | —       | Interactive API documentation       |

---

## 📁 Project Structure

```
servicehub/
│
├── 🖥️  client/                      # Next.js 16 frontend
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Landing page (hero, categories, FAQs)
│       │   ├── services/             # Browse & filter service listings
│       │   ├── bookings/             # Book a service & view booking history
│       │   ├── provider/             # Provider dashboard, services & bookings
│       │   ├── admin/                # Admin control panel
│       │   ├── profile/              # User profile & settings
│       │   ├── login/                # Login page
│       │   └── register/             # Registration page
│       ├── components/               # Shared UI (Navbar, ConfirmModal)
│       ├── lib/                      # API client, auth helpers
│       └── types/                    # Shared TypeScript interfaces
│
└── ⚙️  server/                       # Express 5 REST API
    ├── api/
    │   └── index.ts                  # Vercel serverless entry point
    ├── src/
    │   ├── config/                   # Zod-validated environment config
    │   ├── docs/                     # Swagger / OpenAPI setup
    │   ├── lib/                      # Prisma client, utilities
    │   ├── middlewares/              # Auth, role, error, request validation
    │   ├── routes/                   # Route definitions per domain
    │   └── services/                 # Business logic (controllers + validation)
    │       ├── auth/
    │       ├── booking/
    │       ├── category/
    │       ├── review/
    │       ├── service/
    │       └── user/
    └── prisma/
        ├── schema.prisma             # Database schema
        ├── migrations/               # Migration history
        └── seed.ts                   # Sample data seeder
```

---

## ⚡ Getting Started

### Prerequisites

- ![Node.js](https://img.shields.io/badge/Node.js_20+-339933?logo=nodedotjs&logoColor=white&style=flat-square)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat-square) A running PostgreSQL instance
- ![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white&style=flat-square)

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/habib-web-dev1/service-hub.git
cd service-hub
```

---

### 2️⃣ Set up the server

```bash
cd server
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Run migrations and generate the Prisma client:

```bash
npm run migrate    # creates tables
npm run generate   # generates Prisma client
```

Optionally seed the database with sample data:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

> 🟢 API available at `http://localhost:5000`
> 📖 Swagger docs at `http://localhost:5000/api/docs`

---

### 3️⃣ Set up the client

```bash
cd ../client
npm install
```

Create your local env file:

```bash
# Create client/.env.local and add:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

> 🟢 App available at `http://localhost:3000`

---

## 🔑 Environment Variables

### Server — `server/.env`

| Variable             | Required | Default                 | Description                             |
| -------------------- | -------- | ----------------------- | --------------------------------------- |
| `DATABASE_URL`       | ✅       | —                       | PostgreSQL connection string            |
| `JWT_SECRET`         | ✅       | —                       | Secret key for signing access tokens    |
| `JWT_REFRESH_SECRET` | ❌       | —                       | Secret for refresh tokens (reserved)    |
| `NODE_ENV`           | ❌       | `development`           | `development` \| `production` \| `test` |
| `PORT`               | ❌       | `5000`                  | HTTP listen port                        |
| `CORS_ORIGIN`        | ❌       | `http://localhost:3000` | Allowed CORS origin                     |

### Client — `client/.env.local`

| Variable              | Required | Description                      |
| --------------------- | -------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | ✅       | Full base URL of the backend API |

---

## 📡 API Reference

> 📖 Full interactive docs available at `/api/docs` (Swagger UI)

**Base URL:** `http://localhost:5000/api`

### 🔐 Auth

| Method | Endpoint         | Auth   | Description           |
| ------ | ---------------- | ------ | --------------------- |
| `POST` | `/auth/register` | Public | Register a new user   |
| `POST` | `/auth/login`    | Public | Login and receive JWT |

### 🛠️ Services

| Method   | Endpoint        | Auth     | Description                              |
| -------- | --------------- | -------- | ---------------------------------------- |
| `GET`    | `/services`     | Public   | List services (filter, search, paginate) |
| `GET`    | `/services/:id` | Public   | Get a single service                     |
| `GET`    | `/services/my`  | Provider | Get own services                         |
| `POST`   | `/services`     | Provider | Create a service                         |
| `PATCH`  | `/services/:id` | Provider | Update a service                         |
| `DELETE` | `/services/:id` | Provider | Delete a service                         |

### 🗂️ Categories

| Method   | Endpoint                  | Auth   | Description                |
| -------- | ------------------------- | ------ | -------------------------- |
| `GET`    | `/categories`             | Public | List all categories        |
| `POST`   | `/categories`             | Admin  | Create a category          |
| `PATCH`  | `/categories/:id`         | Admin  | Update a category          |
| `DELETE` | `/categories/:id`         | Admin  | Soft-delete a category     |
| `PATCH`  | `/categories/:id/restore` | Admin  | Restore a deleted category |

### 📅 Bookings

| Method  | Endpoint               | Auth             | Description           |
| ------- | ---------------------- | ---------------- | --------------------- |
| `POST`  | `/bookings`            | Customer         | Create a booking      |
| `GET`   | `/bookings/my`         | Customer         | Get own bookings      |
| `PATCH` | `/bookings/:id/cancel` | Customer         | Cancel a booking      |
| `GET`   | `/bookings/provider`   | Provider         | Get provider bookings |
| `PATCH` | `/bookings/:id/status` | Provider / Admin | Update booking status |
| `GET`   | `/bookings`            | Admin            | Get all bookings      |

### ⭐ Reviews

| Method   | Endpoint                      | Auth     | Description               |
| -------- | ----------------------------- | -------- | ------------------------- |
| `POST`   | `/reviews`                    | Customer | Submit a review           |
| `GET`    | `/reviews/service/:serviceId` | Public   | Get reviews for a service |
| `GET`    | `/reviews/:id`                | Auth     | Get a single review       |
| `PATCH`  | `/reviews/:id`                | Customer | Update a review           |
| `DELETE` | `/reviews/:id`                | Auth     | Delete a review           |

### 👤 Users

| Method   | Endpoint                    | Auth  | Description              |
| -------- | --------------------------- | ----- | ------------------------ |
| `GET`    | `/users/me`                 | Auth  | Get current user profile |
| `PATCH`  | `/users/me`                 | Auth  | Update profile           |
| `PATCH`  | `/users/me/password`        | Auth  | Change password          |
| `POST`   | `/users/me/become-provider` | Auth  | Upgrade to Provider role |
| `DELETE` | `/users/me`                 | Auth  | Delete own account       |
| `GET`    | `/users`                    | Admin | List all users           |
| `DELETE` | `/users/:id`                | Admin | Delete a user            |

---

## ☁️ Deployment

Both apps are deployed on **Vercel** independently.

### Server

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/habib-web-dev1/service-hub)

1. Create a new Vercel project — set **Root Directory** to `server`
2. Add environment variables in **Settings → Environment Variables**:

| Variable       | Value                                   |
| -------------- | --------------------------------------- |
| `DATABASE_URL` | Production PostgreSQL connection string |
| `JWT_SECRET`   | A long random secret                    |
| `NODE_ENV`     | `production`                            |
| `CORS_ORIGIN`  | Your deployed frontend URL              |

3. Vercel runs `npm run vercel-build` → `prisma generate && tsc` automatically on each push

> 💡 Use a connection pooler such as [Neon](https://neon.tech) or [Supabase](https://supabase.com) to handle serverless connection limits.

### Client

1. Create a separate Vercel project — set **Root Directory** to `client`
2. Add the environment variable:

| Variable              | Value                                |
| --------------------- | ------------------------------------ |
| `NEXT_PUBLIC_API_URL` | `https://your-server.vercel.app/api` |

3. Vercel auto-detects Next.js and runs `npm run build`

---

## 📄 License

This project is for portfolio and demonstration purposes.

---

<div align="center">

**Built with ❤️ by [habib-web-dev1](https://github.com/habib-web-dev1)**

[![Live Demo](https://img.shields.io/badge/🌐_View_Live_Demo-06b6d4?style=for-the-badge)](https://service-hub-xc5b.vercel.app)
&nbsp;
[![GitHub](https://img.shields.io/badge/⭐_Star_on_GitHub-181717?style=for-the-badge&logo=github)](https://github.com/habib-web-dev1/service-hub)

</div>
