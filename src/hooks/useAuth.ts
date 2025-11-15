import { useEffect, useRef } from 'react';
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

  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkAuth();
    }
  }, []);

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