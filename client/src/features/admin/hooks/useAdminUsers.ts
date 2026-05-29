import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { fetchUsers, approveUser, rejectUser } from '../api/adminApi';
import type { User, UserAccess } from '@/types';
import axios from 'axios';

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleApprove(userId: string, access: UserAccess) {
    if (!access) {
      toast.error('Please select an access level first.');
      return;
    }
    setActionLoading(userId);
    try {
      const updated = await approveUser(userId, access);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      toast.success('User approved successfully.');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Approval failed.'
        : 'Approval failed.';
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(userId: string) {
    setActionLoading(userId);
    try {
      const updated = await rejectUser(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      toast.success('User rejected.');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Rejection failed.'
        : 'Rejection failed.';
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  }

  return { users, isLoading, actionLoading, handleApprove, handleReject };
}
