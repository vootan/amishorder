# ADR 001 — Monorepo Structure

**Date:** 2026-05-29  
**Status:** Accepted

## Context

The project requires a React frontend and a Node.js/Express backend. We needed to decide whether to keep them in separate repositories or together.

## Decision

Use a **monorepo** with `client/` and `server/` as sibling directories inside `AmishOrder/`.

## Rationale

- Single `git clone` gets a developer fully running
- Shared TypeScript types can be promoted to a `shared/` package in future phases without changing repo structure
- Easier to keep frontend and backend in sync during rapid development
- No cross-repo PR coordination for full-stack features

## Consequences

- Both apps share a single Git history
- Each sub-project has its own `package.json`, `node_modules`, and `tsconfig.json` — they are independently deployable
- Root `.gitignore` covers both
