# Legacy Trust Bank

A full-stack demo of a digital banking platform — secure authentication with two-factor login, accounts and transactions, cards you can freeze, payments with **dual authorisation**, and an admin console with an immutable audit trail.

The repository is a small monorepo with two independent projects:

| Project | Stack | Purpose |
| --- | --- | --- |
| [`backend/`](backend) | Node · Express · TypeScript · Prisma · SQLite | REST API, business rules, persistence, tests |
| [`frontend/`](frontend) | React 18 · Vite · TypeScript · Tailwind CSS v4 | Public marketing site + authenticated dashboard SPA |

> **Status:** the backend is a fully working API (seeded and tested). The frontend is a polished UI that currently runs on **in-browser mock data** and is not yet wired to the API — see [Roadmap](#roadmap).

---

## Features

**Authentication & session**
- Email + password login with bcrypt hashing
- Two-factor login (6-digit OTP, hashed at rest, 5-minute expiry, capped at 5 attempts)
- Account lockout after repeated failed logins (5 attempts → 15-minute lock)
- JWT access tokens + rotating, revocable refresh tokens (stored as SHA-256 hashes)

**Accounts & money movement**
- Multiple account types (cheque, savings, credit, investment) in ZAR
- Transaction ledger with running balance and statement/aggregation endpoints
- Immediate, future-dated (scheduled) and **dual-authorised** payments
- Money stored as integer cents (no floating-point drift); atomic, race-safe debits
- Per-user idempotency keys so retried requests never double-charge

**Dual authorisation (separation of duties)**
- Payments above a threshold queue for a second, different authoriser
- Capturers cannot approve their own items
- Race-safe approval claiming via conditional updates

**Cards, recipients & notifications**
- Freeze / unfreeze cards, adjust monthly limits
- Manage payees (recipients)
- In-app notifications for sign-ins, payments and approval decisions

**Administration**
- User management, suspend / reactivate accounts (enforced on every request)
- Platform stats and a read-only audit log of sensitive actions

**Frontend**
- Premium, responsive light-fintech design system (custom Tailwind v4 theme)
- Public site (products, security centre, support, registration) and app dashboard
- Accessible, keyboard-friendly components and forms with Zod validation

---

## Tech stack

**Backend** — Express 4, TypeScript, Prisma 6 (SQLite), Zod, `jsonwebtoken`, `bcryptjs`, Helmet, CORS, Morgan, Vitest + Supertest.

**Frontend** — React 18, Vite 6, TypeScript, Tailwind CSS v4, React Router 6, React Hook Form + Zod, Zustand.

---

## Repository layout

```
legacy-turst_bank/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # data model (SQLite)
│   │   └── dev.db               # local database (git-ignored)
│   ├── src/
│   │   ├── config/              # env validation + business limits
│   │   ├── lib/                 # jwt, tokens, money, errors, audit, …
│   │   ├── middleware/          # authenticate / authorize, error handler
│   │   ├── modules/             # auth, accounts, payments, approvals, …
│   │   ├── db/seed.ts           # demo data
│   │   ├── app.ts               # express app factory
│   │   └── index.ts             # server bootstrap
│   └── tests/api.test.ts        # end-to-end API tests
└── frontend/
    ├── index.html
    ├── src/
    │   ├── components/          # ui/, layout/, dashboard/
    │   ├── pages/               # public/, auth/, dashboard/
    │   ├── store/               # zustand auth store (mock)
    │   ├── data/mock.ts         # mock data used by the UI
    │   └── App.tsx              # routes
    └── vite.config.ts
```

---

## Getting started

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm (or pnpm/yarn)

### 1. Backend

```bash
cd backend
npm install

# Create your env file from the template, then edit secrets
cp .env.example .env          # Windows: copy .env.example .env

# Generate the Prisma client, create the SQLite DB and load demo data
npm run prisma:generate
npm run db:push
npm run db:seed

npm run dev                    # http://localhost:4000
```

Health check: `GET http://localhost:4000/api/health`

**Backend scripts**

| Script | Description |
| --- | --- |
| `npm run dev` | Start the API with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run typecheck` | Type-check without emitting |
| `npm test` | Run the Vitest API suite |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:seed` | Load demo data |
| `npm run db:reset` | Force-reset the DB and re-seed |
| `npm run prisma:migrate` | Create/apply migrations |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

**Frontend scripts**

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | ESLint (see [known issues](#known-issues)) |

---

## Demo credentials

The seed script and the frontend mock both use the same account:

| Field | Value |
| --- | --- |
| Email | `thandi.mokoena@legacytrust.example` |
| Password | `Demo@1234` |
| 2FA code | `123456` (frontend mock) · returned as `devCode` by the API outside production |

Seeded users (password `Demo@1234` for all):

| Name | Role |
| --- | --- |
| Thandi Mokoena | administrator |
| Kevin Dlamini | capturer |
| Priya Botha | authoriser |

---

## Environment variables

Copy `backend/.env.example` → `backend/.env`. The API validates env at boot and exits if anything required is missing.

| Variable | Default | Notes |
| --- | --- | --- |
| `DATABASE_URL` | `file:./dev.db` | SQLite file for local dev |
| `PORT` | `4000` | API port |
| `NODE_ENV` | `development` | `development` \| `test` \| `production` |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated allow-list |
| `JWT_ACCESS_SECRET` | — | **Required** — long random string |
| `JWT_REFRESH_SECRET` | — | **Required** — different long random string |
| `ACCESS_TOKEN_TTL` | `15m` | Access-token lifetime |
| `REFRESH_TOKEN_TTL` | `30d` | Refresh-token lifetime |
| `TWO_FACTOR_ENABLED` | `true` | Global 2FA toggle |

---

## API overview

All responses are wrapped as `{ "data": ... }`. Authenticated routes expect `Authorization: Bearer <accessToken>`.

| Method & path | Auth | Description |
| --- | --- | --- |
| `GET /api/health` | — | Liveness / uptime |
| `POST /api/auth/register` | — | Create a user (role: capturer) |
| `POST /api/auth/login` | — | Start login; returns a 2FA challenge |
| `POST /api/auth/login/verify` | — | Complete 2FA; returns tokens |
| `POST /api/auth/refresh` | — | Rotate refresh token |
| `POST /api/auth/logout` | — | Revoke a refresh token |
| `GET /api/auth/me` | Bearer | Current user |
| `GET /api/accounts` | Bearer | List owned accounts |
| `GET /api/accounts/:id` | Bearer | Account detail |
| `GET /api/accounts/:id/transactions` | Bearer | Recent transactions |
| `GET /api/accounts/:id/statement` | Bearer | Opening/closing balances + totals |
| `GET /api/transactions` | Bearer | Transactions across accounts |
| `GET /api/transactions/:id` | Bearer | Single transaction |
| `GET /api/recipients` | Bearer | List recipients |
| `POST /api/recipients` | Bearer | Create recipient |
| `DELETE /api/recipients/:id` | Bearer | Delete recipient |
| `POST /api/payments` | Bearer | Create payment (immediate / scheduled / dual-auth) |
| `GET /api/payments` | Bearer | List transfers |
| `GET /api/payments/:id` | Bearer | Transfer detail |
| `GET /api/approvals` | Bearer | Pending approvals (own items for capturers) |
| `POST /api/approvals/:id/authorise` | authoriser/admin | Approve (separation of duties enforced) |
| `POST /api/approvals/:id/reject` | authoriser/admin | Reject |
| `GET /api/cards` · `GET /api/cards/:id` | Bearer | List / read cards |
| `POST /api/cards/:id/freeze` · `/unfreeze` | Bearer | Freeze / unfreeze |
| `PATCH /api/cards/:id/limits` | Bearer | Set monthly limit |
| `GET /api/notifications` | Bearer | List notifications + unread count |
| `POST /api/notifications/:id/read` · `/read-all` | Bearer | Mark read |
| `GET /api/admin/stats` | administrator | Platform stats |
| `GET /api/admin/users` · `POST /api/admin/users` | administrator | List / create users |
| `PATCH /api/admin/users/:id` | administrator | Update role / status / 2FA |
| `POST /api/admin/users/:id/suspend` · `/reactivate` | administrator | Enable / disable an account |
| `GET /api/admin/audit-logs` | administrator | Recent audit entries |

---

## Business rules

Defined in `backend/src/config/limits.ts`:

| Rule | Value |
| --- | --- |
| Per-transaction limit | R250,000 |
| Daily limit (per account/user) | R1,000,000 |
| Dual-authorisation threshold | R50,000 (amounts **above** this queue for a second approver) |

Payment lifecycle: `pending_authorisation → (scheduled \| completed \| rejected \| failed)`.

---

## Testing

```bash
cd backend
npm test
```

Vitest + Supertest run against an isolated `prisma/test.db`. Coverage includes: health, auth (bad OTP, bad credentials, `/me`, unauthenticated access), accounts, payment idempotency, dual authorisation + separation of duties, card freeze/unfreeze, admin access control, OTP attempt capping, per-user idempotency scoping, and suspended-user rejection.

---

## Security notes

- Passwords hashed with bcrypt; refresh tokens and OTP codes stored only as hashes.
- `authenticate` re-checks the user on every request, so suspensions take effect immediately.
- Helmet sets secure HTTP headers; CORS is restricted to a configurable allow-list.
- All sensitive actions are written to an append-only `AuditLog`.
- Balance changes use conditional `updateMany` guards to prevent overdrafts under concurrency.
- **Not for production:** SQLite storage, `devCode`/console OTP logging outside production, and no general-purpose rate limiter yet.

---

## Roadmap

- [ ] Wire the frontend to the live API (replace `src/data/mock.ts` and the mock auth store with an API client and token handling)
- [ ] Admin console UI
- [ ] General request rate limiting
- [ ] Email/SMS delivery for OTP and alerts
- [ ] PostgreSQL deployment (schema is written to make this a datasource change)
- [ ] CI pipeline and Docker setup

### Known issues
- `frontend` `npm run lint` fails because ESLint is not installed (the script exists but `eslint` isn't a dependency yet).
- Frontend has no automated tests.

---

## License

No license file is included in this repository yet. Add a `LICENSE` before distributing or reusing the code.
