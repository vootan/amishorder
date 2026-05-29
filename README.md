# AmishOrder — Auth & User Management

A full-stack web application with user signup, email verification, admin-gated approval, role-based access, and a welcome dashboard.

**Stack:** React 18 · Node.js · TypeScript · MongoDB · Tailwind CSS · shadcn/ui

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (2-Step Verification must be enabled)

### 1. Configure environment
```bash
cd server
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux
```
Fill in `server/.env` — see [Environment Variables](#environment-variables) below.

### 2. Create the first admin account
```bash
cd server
npm install
npm run seed:admin
```
This is idempotent — safe to run multiple times.

### 3. Start the servers
```bash
# Terminal 1 — API (port 3001)
npm run dev --prefix server

# Terminal 2 — React client (port 5173)
npm run dev --prefix client
```

Open **http://localhost:5173**

---

## Project Structure

```
AmishOrder/
├── client/                        # React 18 + Vite + TypeScript
│   └── src/
│       ├── components/common/     # Layout, Navbar, ProtectedRoute
│       ├── components/ui/         # shadcn/ui primitives (auto-generated)
│       ├── features/
│       │   ├── auth/              # Login/Signup forms, hooks, API calls
│       │   └── admin/             # User table, approval hooks, API calls
│       ├── pages/                 # Thin route-level page components
│       ├── providers/             # AuthProvider (React context)
│       ├── router/                # React Router v6 route definitions
│       ├── lib/                   # Axios instance
│       └── types/                 # Shared TypeScript interfaces
│
└── server/
    └── src/
        ├── api/
        │   ├── controllers/       # auth.controller.ts, admin.controller.ts
        │   ├── middlewares/       # authenticate.ts, authorize.ts
        │   ├── routes/            # auth.routes.ts, admin.routes.ts
        │   └── validators/        # Zod schemas for request bodies
        ├── config/                # env.ts (validated), db.ts (MongoDB)
        ├── models/                # user.model.ts (Mongoose)
        ├── services/              # auth.service.ts, admin.service.ts, email.service.ts
        ├── scripts/               # seed-admin.ts
        ├── utils/                 # token.utils.ts
        ├── app.ts                 # Express app (no HTTP listener — testable)
        └── server.ts              # Entry point (starts HTTP listener)
```

---

## User Flow

```
Signup → Verification email sent
    ↓
User clicks link in email → Server validates token → status: pending_approval
    ↓
Admin logs in → /admin dashboard → Approves user + assigns access (edit | view)
    ↓
User logs in → /welcome (JWT issued as httpOnly cookie)
    ↓
Logout → cookie cleared → /login
```

### User statuses
| Status | Meaning |
|---|---|
| `pending_email` | Signed up, email not yet verified |
| `pending_approval` | Email verified, awaiting admin approval |
| `active` | Approved — can log in |
| `rejected` | Denied by admin |

### Roles & access
| Role | Access | Can do |
|---|---|---|
| `admin` | `edit` | Approve/reject users, access `/admin` |
| `user` | `edit` | Full feature access (future phases) |
| `user` | `view` | Read-only feature access (future phases) |

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create account, send verification email |
| GET | `/api/auth/verify-email/:token` | Public | Verify token, redirect to client |
| POST | `/api/auth/login` | Public | Login, issue JWT cookie |
| POST | `/api/auth/logout` | Public | Clear JWT cookie |
| GET | `/api/auth/me` | JWT | Return current user |
| GET | `/api/admin/users` | Admin | List all non-admin users |
| PUT | `/api/admin/users/:id/approve` | Admin | Set active + assign access |
| PUT | `/api/admin/users/:id/reject` | Admin | Set rejected |

---

## Environment Variables

All variables live in `server/.env` (never committed). Copy from `server/.env.example`.

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Min 32 chars. Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `CLIENT_URL` | Yes | React app URL (e.g. `http://localhost:5173`) |
| `SERVER_URL` | Yes | API server URL (e.g. `http://localhost:3001`) |
| `SMTP_HOST` | Yes | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | No | Default `587` |
| `SMTP_USER` | Yes | Gmail address |
| `SMTP_PASS` | Yes | Gmail **App Password** (not your login password) |
| `SMTP_FROM` | Yes | e.g. `"App <you@gmail.com>"` |
| `ADMIN_EMAIL` | Yes | First admin email (seed script) |
| `ADMIN_PASSWORD` | Yes | First admin password (min 8 chars) |
| `ADMIN_FIRST_NAME` | Yes | First admin first name |
| `ADMIN_LAST_NAME` | Yes | First admin last name |

> **Gmail:** Must use an [App Password](https://myaccount.google.com/apppasswords). Regular Gmail passwords are blocked for SMTP since 2022.

---

## Scripts

| Directory | Command | Description |
|---|---|---|
| `server/` | `npm run dev` | Start API with hot-reload |
| `server/` | `npm run build` | Compile TypeScript to `dist/` |
| `server/` | `npm run start` | Run compiled production build |
| `server/` | `npm run seed:admin` | Create first admin (idempotent) |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Build for production |
| `client/` | `npm run preview` | Preview production build locally |

---

## Architecture Decisions

See [`docs/adr/`](docs/adr/) for the full rationale behind key decisions.

| # | Decision | Summary |
|---|---|---|
| [001](docs/adr/001-monorepo-structure.md) | Monorepo structure | `client/` + `server/` in one repo |
| [002](docs/adr/002-auth-jwt-httponly-cookie.md) | JWT in httpOnly cookie | XSS-safe auth strategy |
| [003](docs/adr/003-mongodb-mongoose.md) | MongoDB + Mongoose | Local dev → Azure Cosmos DB migration path |
| [004](docs/adr/004-feature-based-client.md) | Feature-based client structure | Scalable React architecture |
| [005](docs/adr/005-admin-approval-flow.md) | Admin approval flow | Manual user activation by admin |
| [006](docs/adr/006-email-verification.md) | Email verification | Confirm identity before admin review |

---

## Phase Roadmap

- **AmishOrder v1** ✅ — Signup, login, email verification, admin approval, welcome page, logout
- **Phase 2** — TBD (password reset, profile editing, feature pages)
- **Phase 3** — Azure deployment (App Service / Container Apps + Cosmos DB)

---

## Azure Migration (Phase 3)

The codebase is designed for zero-code Azure migration:
- Change `MONGODB_URI` to a Cosmos DB connection string — Mongoose models are unchanged
- Cosmos DB supports the MongoDB API natively
- Deploy server to Azure App Service or Container Apps
- Deploy client build (`dist/`) to Azure Static Web Apps
