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
