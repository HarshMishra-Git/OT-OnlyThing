import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

export const AuthService = {
  async getCurrentUser() {
    try {
      // Use getSession instead of getUser for faster response
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        return { user: null, session: null };
      }
      
      return { user: session?.user || null, session };
    } catch (error) {
      console.error('getCurrentUser error:', error);
      return { user: null, session: null };
    }
  },

  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as Profile, error: null };
    } catch (error: any) {
      console.error('getProfile error:', error);
      return { data: null, error: error.message };
    }
  },

  async signIn({ email, password }: { email: string; password: string }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async signUp({ 
    email, 
    password, 
    full_name 
  }: { 
    email: string; 
    password: string; 
    full_name: string;
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
          },
        },
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Profile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async updatePassword(newPassword: string) {
    try {
      // When arriving from the recovery email, Supabase provides a temporary session.
      // updateUser will apply the new password for the current user in that session.
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { data: null, error: error.message };
      }
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};