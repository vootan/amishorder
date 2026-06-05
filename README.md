# AmishOrder - Auth, Admin Approval, and Inventory

![Node](https://img.shields.io/badge/Node-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Overview

AmishOrder is a full-stack TypeScript monorepo with:

- Email verification before login access
- Admin approval workflow for new users
- Role-based access controls
- Admin inventory management with time-based pricing

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui
- Backend: Express + TypeScript
- Database: MongoDB with Mongoose
- Auth: JWT in httpOnly cookie

## Architecture Decision Records (ADR)

- [001 - Monorepo Structure](docs/adr/001-monorepo-structure.md)
- [002 - Auth JWT HttpOnly Cookie](docs/adr/002-auth-jwt-httponly-cookie.md)
- [003 - MongoDB Mongoose](docs/adr/003-mongodb-mongoose.md)
- [004 - Feature-Based Client](docs/adr/004-feature-based-client.md)
- [005 - Admin Approval Flow](docs/adr/005-admin-approval-flow.md)
- [006 - Email Verification Before Admin Review](docs/adr/006-email-verification.md)
- [007 - Inventory Lifecycle and Pricing Deletion Policy](docs/adr/007-inventory-lifecycle-and-pricing-deletion.md)

To add a new ADR, create the next numbered file in `docs/adr/` using the same format (`Date`, `Status`, `Context`, `Decision`, `Rationale`, `Implementation`, `Consequences`) and add its link to this list.

## Inventory Management (Admin)

Inventory setup and management is available only to admin users.

### Current capabilities

- Create inventory items with name and optional description
- Add future-effective price records for an item
- View pricing history
- Soft delete an inventory item
- Hard delete a pricing record from history

### Pricing rules

- Every price update must include an effective `startDate`
- Effective date must be in the future
- If a new future price overlaps a previous active range, the previous record is automatically closed (`endDate = newStart - 1ms`)
- Pricing history is retained unless a specific pricing record is hard-deleted by admin

### Deletion behavior

- Inventory item deletion is soft delete:
  - `isDeleted = true`
  - `deletedAt` is set
  - Item is excluded from normal inventory lists
- Pricing record deletion is hard delete:
  - Removes the specific pricing subdocument from the inventory item

### Data model notes

- `SKU` is no longer part of the inventory model or UI
- Legacy inventory records without `isDeleted` are treated as active (`isDeleted != true`)

## Admin API (Inventory)

All routes below are protected by `authenticate` + `authorizeAdmin` middleware.

- `GET /api/admin/inventory` - list non-deleted inventory items
- `POST /api/admin/inventory` - create inventory item
- `GET /api/admin/inventory/:id` - get a single non-deleted inventory item
- `POST /api/admin/inventory/:id/pricing` - add pricing record (future start date required)
- `DELETE /api/admin/inventory/:id` - soft delete inventory item
- `DELETE /api/admin/inventory/:id/pricing/:pricingId` - hard delete pricing record

## Recent updates (2026-06-05)

- Added React Query provider at app root to support inventory queries/mutations
- Inventory tab is now default on admin dashboard
- Admin tab order updated to `Inventory`, then `Users`
- Implemented future-effective-date rule for price changes
- Implemented soft delete for inventory items
- Implemented hard delete for pricing records
- Removed `SKU` from server and client

