import api from '@/lib/axios';
import type { ApiResponse, User } from '@/types';

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function signup(payload: SignupPayload): Promise<ApiResponse> {
  const { data } = await api.post<ApiResponse>('/auth/signup', payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<ApiResponse<User>> {
  const { data } = await api.post<ApiResponse<User>>('/auth/login', payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
