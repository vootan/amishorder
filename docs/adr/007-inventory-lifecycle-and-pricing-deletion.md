# ADR 007 - Inventory Lifecycle and Pricing Deletion Policy

**Date:** 2026-06-05  
**Status:** Accepted

## Context

Inventory management in Phase 1 added time-based pricing and admin operations, but we needed explicit rules for:

- how item deletion should behave
- how pricing record deletion should behave
- when price changes are allowed
- backward compatibility for inventory documents created before soft-delete fields existed
- whether SKU should remain in the model

## Decision

1. **Inventory item deletion is soft delete**
   - Items are marked with `isDeleted = true` and `deletedAt`.
   - Soft-deleted items are hidden from normal admin inventory listing and detail retrieval.

2. **Pricing record deletion is hard delete**
   - A pricing record can be permanently removed by admin using pricing subdocument id.

3. **Price updates must be future-effective**
   - New pricing records require `startDate > now`.
   - Non-future effective dates are rejected.

4. **Overlapping ranges auto-close previous record**
   - If a new future price overlaps a prior active record, prior `endDate` is set to `newStart - 1ms`.

5. **SKU removed from inventory domain**
   - `sku` is removed from server schema/types/validators and client types/forms/table.

6. **Legacy document compatibility**
   - Queries use `isDeleted != true` so records without `isDeleted` are treated as active.

## Rationale

- Soft delete for items preserves business audit/history and avoids accidental destructive loss.
- Hard delete for pricing records supports administrative cleanup of incorrect entries.
- Future-effective pricing prevents immediate retroactive changes and aligns with planned price scheduling.
- Auto-closing previous price windows keeps date ranges coherent without manual end-date management.
- Removing SKU reflects current business requirements and simplifies forms and schema.
- Compatibility filter prevents older records from disappearing after adding soft-delete flags.

## Implementation

### Backend

- Model: `server/src/models/inventory.model.ts`
  - Added `isDeleted`, `deletedAt`
  - Pricing subdocuments retain `_id` for targeted hard delete
- Service: `server/src/services/inventory.service.ts`
  - Soft-delete method: `softDeleteInventoryItem`
  - Hard-delete pricing method: `hardDeletePricingRecord`
  - Read filters use `{ isDeleted: { $ne: true } }`
  - Future-date validation enforced for `addPricingRecord`
- Routes: `server/src/api/routes/admin.routes.ts`
  - `DELETE /api/admin/inventory/:id`
  - `DELETE /api/admin/inventory/:id/pricing/:pricingId`
- Controllers: `server/src/api/controllers/inventory.controller.ts`
  - Added handlers for both delete endpoints

### Client

- API methods: `client/src/features/admin/api/adminApi.ts`
  - `softDeleteInventory`
  - `hardDeleteInventoryPricing`
- Hook mutations: `client/src/features/admin/hooks/useInventory.ts`
- UI actions:
  - `Delete Item` button in inventory table (soft delete)
  - Per-pricing `Delete` in pricing history modal (hard delete)
- Removed SKU from:
  - `client/src/features/admin/types/AdminTypes.ts`
  - `client/src/features/admin/components/InventoryForm.tsx`
  - `client/src/features/admin/components/InventoryTable.tsx`

## Consequences

- Item deletion is reversible only by direct DB/manual restore in current phase (no restore API yet).
- Pricing deletion is irreversible and should be used intentionally.
- Legacy pricing entries without `_id` may not be hard-deletable unless migrated.
- Existing DB documents with `sku` remain in MongoDB but are ignored by app logic/UI.
- Future-phase work may include:
  - restore endpoint for soft-deleted items
  - pricing-entry migration script for missing subdocument `_id`
  - optional audit log event stream for delete actions
