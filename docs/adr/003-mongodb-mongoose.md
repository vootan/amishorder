# ADR 003 — MongoDB + Mongoose with Azure Cosmos DB Migration Path

**Date:** 2026-05-29  
**Status:** Accepted

## Context

The project needs a database for Phase 1 (local development) with a planned migration to Azure Cosmos DB in a later phase.

## Decision

Use **MongoDB** locally with **Mongoose** as the ODM, targeting Azure Cosmos DB's MongoDB-compatible API for production.

## Rationale

- Cosmos DB exposes a MongoDB-compatible wire protocol — Mongoose models work unchanged
- Migration is a single environment variable change: `MONGODB_URI` → Cosmos DB connection string
- No ORM migration files needed (document store, schema is code)
- Mongoose provides schema validation, virtuals, and query helpers that reduce boilerplate
- MongoDB's flexible document model suits the user profile schema which may grow in future phases

## Migration Steps (Phase 3)

1. Provision an Azure Cosmos DB account with MongoDB API
2. Update `MONGODB_URI` in the production environment to the Cosmos DB connection string
3. Run `npm run seed:admin` once against the new database
4. No code changes required

## Consequences

- MongoDB must be installed locally for development (Community Edition or Docker)
- Keep `_id` as ObjectId — Cosmos DB supports it natively
- Avoid Mongoose features not supported by Cosmos DB MongoDB API (e.g. `$where`, certain aggregation operators)
- Index creation on `email` field is defined in the Mongoose schema — Cosmos DB will honour it
