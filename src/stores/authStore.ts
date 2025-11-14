import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/types';
import { AuthService } from '@/services/auth.service';

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin'
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      login: async (email, password) => {
        try {
          const { data, error } = await AuthService.signIn({ email, password });
          
          if (error) return { error };
          
          if (data?.user) {
            const { data: profile } = await AuthService.getProfile(data.user.id);
            if (profile) {
              get().setUser(profile);
            }
          }
          
          return { error: null };
        } catch (error: any) {
          return { error: error.message };
        }
      },

      signUp: async (email, password, fullName) => {
        try {
          const { data, error } = await AuthService.signUp({ 
            email, 
            password, 
            full_name: fullName 
          });
          
          if (error) return { error };
          
          if (data?.user) {
            const { data: profile } = await AuthService.getProfile(data.user.id);
            if (profile) {
              get().setUser(profile);
            }
          }
          
          return { error: null };
        } catch (error: any) {
          return { error: error.message };
        }
      },

      logout: async () => {
        await AuthService.signOut();
        set({ 
          user: null, 
          isAuthenticated: false,
          isAdmin: false
        });
      },

      checkAuth: async () => {
        // Prevent multiple simultaneous checks
        if (get().isLoading) {
          console.log('Auth check already in progress, skipping...');
          return;
        }

        try {
          set({ isLoading: true });
          
          // Check if Supabase is configured
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
            console.warn('⚠️ Supabase not configured - skipping auth');
            set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
            return;
          }
          
          // Quick timeout - 2 seconds max
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Auth timeout')), 2000)
          );
          
          const authPromise = AuthService.getCurrentUser();
          
          try {
            const result = await Promise.race([authPromise, timeoutPromise]);
            
            if (result?.user) {
              console.log('✅ User found:', result.user.email);
              
              // Try to get profile (optional)
              const { data: profile } = await AuthService.getProfile(result.user.id).catch(() => ({ data: null }));
              
              if (profile) {
                get().setUser(profile);
              } else {
                // Use basic user info
                const basicProfile: any = {
                  id: result.user.id,
                  email: result.user.email,
                  full_name: result.user.user_metadata?.full_name || '',
                  role: 'customer',
                };
                get().setUser(basicProfile);
              }
            } else {
              console.log('ℹ️ No user session');
              get().setUser(null);
            }
          } catch (error: any) {
            console.log('ℹ️ Auth check skipped:', error.message);
            get().setUser(null);
          }
        } catch (error: any) {
          console.error('❌ Auth error:', error.message);
          get().setUser(null);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        try {
          const currentUser = get().user;
          if (!currentUser) return { error: 'Not authenticated' };

          const { data, error } = await AuthService.updateProfile(currentUser.id, updates);
          
          if (error) return { error };
          
          if (data) {
            get().setUser(data);
          }
          
          return { error: null };
        } catch (error: any) {
          return { error: error.message };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      }),
    }
  )
);