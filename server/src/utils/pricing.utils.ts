export interface PricingRecordRaw {
  price: number;
  startDate: Date | string;
  endDate?: Date | string | null;
}

export function getActivePriceFromRecords(records: PricingRecordRaw[], atDate: Date = new Date()): number | null {
  if (!records || records.length === 0) return null;

  const date = atDate instanceof Date ? atDate : new Date(atDate);

  const candidates = records
    .map((r) => ({
      ...r,
      startDate: r.startDate instanceof Date ? r.startDate : new Date(r.startDate),
      endDate: r.endDate ? (r.endDate instanceof Date ? r.endDate : new Date(r.endDate)) : null,
    }))
    .filter((r) => r.startDate <= date && (!r.endDate || r.endDate >= date));

  if (candidates.length === 0) return null;

  // pick the most recent startDate
  candidates.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  return candidates[0].price;
}
