import { Request, Response } from 'express';
import * as inventoryService from '../../services/inventory.service';
import { createInventorySchema, addPricingSchema } from '../validators/admin.validators';

export async function listInventory(_req: Request, res: Response): Promise<void> {
  try {
    const items = await inventoryService.listInventory();
    res.json({ success: true, message: 'OK', data: items });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch inventory.' });
  }
}

export async function createInventoryItem(req: Request, res: Response): Promise<void> {
  const result = createInventorySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error.issues[0].message });
    return;
  }

  try {
    const item = await inventoryService.createInventoryItem(result.data as any);
    res.json({ success: true, message: 'Inventory item created.', data: item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Creation failed.';
    res.status(400).json({ success: false, message });
  }
}

export async function addPricing(req: Request, res: Response): Promise<void> {
  const result = addPricingSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error.issues[0].message });
    return;
  }

  try {
    const id = req.params['id'] as string;
    const item = await inventoryService.addPricingRecord(id, result.data as any);
    res.json({ success: true, message: 'Pricing added.', data: item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Add pricing failed.';
    res.status(400).json({ success: false, message });
  }
}

export async function getInventoryItem(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const item = await inventoryService.getInventoryItem(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Not found.' });
      return;
    }
    res.json({ success: true, message: 'OK', data: item });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch item.' });
  }
}

export async function softDeleteInventoryItem(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const item = await inventoryService.softDeleteInventoryItem(id);
    res.json({ success: true, message: 'Inventory item deleted.', data: item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed.';
    res.status(400).json({ success: false, message });
  }
}

export async function hardDeletePricing(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const pricingId = req.params['pricingId'] as string;
    const item = await inventoryService.hardDeletePricingRecord(id, pricingId);
    res.json({ success: true, message: 'Pricing record deleted.', data: item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed.';
    res.status(400).json({ success: false, message });
  }
}
