# ADR 004 — Feature-Based Client Structure

**Date:** 2026-05-29  
**Status:** Accepted

## Context

React projects commonly use either a layer-based structure (`components/`, `hooks/`, `services/`) or a feature-based structure (`features/auth/`, `features/admin/`).

## Decision

Use a **feature-based (domain-driven) structure** for the client.

```
src/
├── features/
│   ├── auth/
│   │   ├── api/        # Axios calls
│   │   ├── components/ # LoginForm, SignupForm
│   │   ├── hooks/      # useLogin, useSignup
│   │   ├── types/      # AuthTypes
│   │   └── index.ts    # Barrel export
│   └── admin/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
├── pages/              # Thin route-level wrappers
├── components/common/  # Shared layout components
└── providers/          # React context providers
```

## Rationale

- **Colocation**: all code for a feature lives together — easier to find, change, and delete
- **Pages are thin**: route-level components just compose features; no business logic in pages
- **Scalable**: adding Phase 2 features means adding a new `features/xyz/` folder, not spreading changes across multiple layers
- **Barrel exports** (`index.ts`) keep imports clean across the codebase

## Consequences

- More folders than a flat structure — justified once the project has more than 2 features
- Cross-feature imports are allowed but should flow through barrel exports
- Shared components (Layout, Navbar, ProtectedRoute) stay in `components/common/` — not inside any feature
