import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { signup } from '../api/authApi';
import type { SignupFormValues } from '../types/AuthTypes';
import axios from 'axios';

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(values: SignupFormValues) {
    setIsLoading(true);
    try {
      await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      toast.success('Account created! Check your email.');
      navigate('/email-sent');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Signup failed.'
        : 'An unexpected error occurred.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return { handleSignup, isLoading };
}
