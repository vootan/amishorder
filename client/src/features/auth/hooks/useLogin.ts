import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { login } from '../api/authApi';
import { useAuth } from '@/providers/AuthProvider';
import type { LoginFormValues } from '../types/AuthTypes';
import axios from 'axios';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await login(values);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success('Welcome back!');
        navigate('/welcome');
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Login failed.'
        : 'An unexpected error occurred.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return { handleLogin, isLoading };
}
