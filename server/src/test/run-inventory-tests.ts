import assert from 'assert';
import { getActivePriceFromRecords } from '../utils/pricing.utils';

function iso(dateStr: string) {
  return new Date(dateStr);
}

function run() {
  console.log('Running inventory pricing tests...');

  const records = [
    { price: 5, startDate: iso('2026-01-01') },
    { price: 6, startDate: iso('2026-06-01') },
    { price: 7, startDate: iso('2026-07-01'), endDate: iso('2026-07-31') },
  ];

  // before any pricing
  assert.strictEqual(getActivePriceFromRecords(records, iso('2025-12-31')), null);

  // on 2026-01-15 => price 5
  assert.strictEqual(getActivePriceFromRecords(records, iso('2026-01-15')), 5);

  // on 2026-06-15 => price 6
  assert.strictEqual(getActivePriceFromRecords(records, iso('2026-06-15')), 6);

  // on 2026-07-15 => price 7 (within temporary window)
  assert.strictEqual(getActivePriceFromRecords(records, iso('2026-07-15')), 7);

  // after 2026-08-01 => price 6 (falls back to previous non-expired)
  assert.strictEqual(getActivePriceFromRecords(records, iso('2026-08-01')), 6);

  console.log('All inventory pricing tests passed.');
}

run();
