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
