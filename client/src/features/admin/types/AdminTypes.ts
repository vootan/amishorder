import type { User, UserAccess } from '@/types';

export interface AdminUserRow extends User {
  pendingAccess?: UserAccess;
}

export interface PricingRecord {
  price: number;
  startDate: string;
  endDate?: string | null;
  createdBy?: string;
  createdAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  pricing: PricingRecord[];
  createdAt: string;
  updatedAt: string;
}
