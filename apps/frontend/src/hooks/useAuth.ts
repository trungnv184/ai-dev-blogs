import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.post('/auth/logout');
      } catch {
        // Ignore errors on logout
      }
    },
    onSettled: () => {
      storeLogout();
    },
  });

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(credentials);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    return !!token && isAuthenticated;
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending,
    login,
    logout,
    checkAuth,
    loginError: loginMutation.error,
  };
}
