import api from '@/lib/axios';
import type { ApiResponse, User, UserAccess } from '@/types';

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<ApiResponse<User[]>>('/admin/users');
  return data.data ?? [];
}

export async function approveUser(
  userId: string,
  access: UserAccess,
): Promise<User> {
  const { data } = await api.put<ApiResponse<User>>(`/admin/users/${userId}/approve`, {
    access,
  });
  return data.data!;
}

export async function rejectUser(userId: string): Promise<User> {
  const { data } = await api.put<ApiResponse<User>>(`/admin/users/${userId}/reject`);
  return data.data!;
}

// Inventory API
export async function fetchInventory(): Promise<any[]> {
  const { data } = await api.get<ApiResponse<any[]>>('/admin/inventory');
  return data.data ?? [];
}

export async function createInventory(payload: any): Promise<any> {
  const { data } = await api.post<ApiResponse<any>>('/admin/inventory', payload);
  return data.data!;
}

export async function addInventoryPricing(itemId: string, payload: any): Promise<any> {
  const { data } = await api.post<ApiResponse<any>>(`/admin/inventory/${itemId}/pricing`, payload);
  return data.data!;
}

export async function softDeleteInventory(itemId: string): Promise<any> {
  const { data } = await api.delete<ApiResponse<any>>(`/admin/inventory/${itemId}`);
  return data.data!;
}

export async function hardDeleteInventoryPricing(itemId: string, pricingId: string): Promise<any> {
  const { data } = await api.delete<ApiResponse<any>>(`/admin/inventory/${itemId}/pricing/${pricingId}`);
  return data.data!;
}
