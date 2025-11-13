import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    signUp,
    logout,
    checkAuth,
    updateProfile,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    signUp,
    logout,
    updateProfile,
  };
};