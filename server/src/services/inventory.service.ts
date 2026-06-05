import { InventoryItem, IInventoryItem } from '../models/inventory.model';
import { Types } from 'mongoose';
import { getActivePriceFromRecords } from '../utils/pricing.utils';

export async function listInventory(): Promise<IInventoryItem[]> {
  return InventoryItem.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).exec();
}

export async function getInventoryItem(id: string): Promise<IInventoryItem | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return InventoryItem.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
}

export async function createInventoryItem(payload: Partial<IInventoryItem>): Promise<IInventoryItem> {
  const item = new InventoryItem(payload as any);
  return item.save();
}

export async function addPricingRecord(itemId: string, record: { price: number; startDate: Date; endDate?: Date | null; createdBy?: string; }) {
  const item = await InventoryItem.findOne({ _id: itemId, isDeleted: { $ne: true } });
  if (!item) throw new Error('Inventory item not found.');

  const newStart = record.startDate instanceof Date ? record.startDate : new Date(record.startDate as any);
  if (Number.isNaN(newStart.getTime())) {
    throw new Error('Invalid effective date.');
  }

  if (newStart.getTime() <= Date.now()) {
    throw new Error('Effective date must be a future date.');
  }

  const endDate = record.endDate
    ? record.endDate instanceof Date
      ? record.endDate
      : new Date(record.endDate as any)
    : null;
  if (endDate && endDate.getTime() <= newStart.getTime()) {
    throw new Error('End date must be later than effective date.');
  }

  // Auto-adjust previous pricing record to avoid overlap: find the most recent record with startDate < newStart
  // and (no endDate or endDate >= newStart) and set its endDate = newStart - 1ms
  let adjusted = false;
  let latestPriorIndex: number | null = null;
  for (let i = 0; i < item.pricing.length; i++) {
    const p: any = item.pricing[i];
    const pStart = p.startDate instanceof Date ? p.startDate : new Date(p.startDate);
    const pEnd = p.endDate ? (p.endDate instanceof Date ? p.endDate : new Date(p.endDate)) : null;
    if (pStart < newStart && (!pEnd || pEnd >= newStart)) {
      if (latestPriorIndex === null || pStart > (item.pricing[latestPriorIndex] as any).startDate) {
        latestPriorIndex = i;
      }
    }
  }

  if (latestPriorIndex !== null) {
    const prev = item.pricing[latestPriorIndex] as any;
    // set endDate to newStart - 1ms
    prev.endDate = new Date(newStart.getTime() - 1);
    adjusted = true;
  }

  // Append new pricing record
  item.pricing.push({
    price: record.price,
    startDate: newStart,
    endDate,
    createdBy: record.createdBy ? new Types.ObjectId(record.createdBy) : null,
    createdAt: new Date(),
  } as any);

  await item.save();
  return { item, adjusted } as any;
}

export async function getActivePrice(itemId: string, atDate = new Date()): Promise<number | null> {
  const item = await InventoryItem.findOne({ _id: itemId, isDeleted: { $ne: true } }).exec();
  if (!item) return null;

  return getActivePriceFromRecords(item.pricing as any, atDate);
}

export async function softDeleteInventoryItem(itemId: string): Promise<IInventoryItem> {
  if (!Types.ObjectId.isValid(itemId)) {
    throw new Error('Invalid inventory item id.');
  }

  const item = await InventoryItem.findOneAndUpdate(
    { _id: itemId, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: new Date() },
    { new: true },
  ).exec();

  if (!item) {
    throw new Error('Inventory item not found.');
  }

  return item;
}

export async function hardDeletePricingRecord(itemId: string, pricingId: string): Promise<IInventoryItem> {
  if (!Types.ObjectId.isValid(itemId)) {
    throw new Error('Invalid inventory item id.');
  }
  if (!Types.ObjectId.isValid(pricingId)) {
    throw new Error('Invalid pricing record id.');
  }

  const item = await InventoryItem.findOne({ _id: itemId, isDeleted: { $ne: true } }).exec();
  if (!item) {
    throw new Error('Inventory item not found.');
  }

  const pricingSubDoc = (item.pricing as any).id(pricingId);
  if (!pricingSubDoc) {
    throw new Error('Pricing record not found.');
  }

  pricingSubDoc.deleteOne();
  await item.save();
  return item;
}
