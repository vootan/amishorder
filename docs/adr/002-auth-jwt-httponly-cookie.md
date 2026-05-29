# ADR 002 — JWT Authentication via httpOnly Cookie

**Date:** 2026-05-29  
**Status:** Accepted

## Context

We needed a session strategy for authenticating API requests from the React SPA.

## Options Considered

| Option | XSS Risk | CSRF Risk | Notes |
|---|---|---|---|
| JWT in `localStorage` | High — JS can read it | Low | Simple but insecure |
| JWT in `httpOnly` cookie | None — JS cannot read it | Moderate | Industry standard for SPAs |
| Session + server-side store | None | Moderate | Requires Redis/DB session store |

## Decision

Store the JWT in an **httpOnly, SameSite=lax cookie** issued by the server on login.

## Rationale

- `httpOnly` prevents any JavaScript (including XSS payloads) from reading the token
- `SameSite=lax` mitigates CSRF for same-origin navigation
- Stateless — no server-side session store needed (simplifies Phase 1 and Azure deployment)
- Cookie is automatically sent with every request when `withCredentials: true` is set on Axios

## Implementation

- `generateJwt()` / `verifyJwt()` in `server/src/utils/token.utils.ts`
- Cookie set in `auth.controller.ts` on login, cleared on logout
- `authenticate` middleware reads `req.cookies.token` and attaches `req.user`
- Client Axios instance configured with `withCredentials: true`
- Vite dev server proxies `/api` → `localhost:3001` to avoid cross-origin cookie issues

## Consequences

- Token cannot be accessed from JavaScript — more secure, slightly harder to debug
- `secure: true` must be set in production (HTTPS only) — already conditional on `NODE_ENV`
- Refresh tokens are out of scope for Phase 1; JWT expiry is 7 days
