export interface AuthTokenPayload {
  userId: string;
  role: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  access: string | null;
  status: string;
  createdAt: Date;
}

export interface PricingRecord {
  price: number;
  startDate: Date;
  endDate?: Date | null;
  createdBy?: string;
  createdAt?: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  pricing: PricingRecord[];
  createdAt: Date;
  updatedAt: Date;
}
