import type { User, UserAccess } from '@/types';

export interface AdminUserRow extends User {
  pendingAccess?: UserAccess;
}
