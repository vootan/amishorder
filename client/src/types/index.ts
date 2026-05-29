export type UserRole = 'admin' | 'SOResident';
export type UserAccess = 'edit' | 'view' | null;
export type UserStatus = 'pending_email' | 'pending_approval' | 'active' | 'rejected';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  access: UserAccess;
  status: UserStatus;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
